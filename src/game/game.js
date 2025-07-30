// --- Clases de Objetos del Juego ---

/**
 * Representa el océano y sus olas.
 */
export class Ocean {
    constructor() {
        this.height = 80;
        this.waveAmplitude = 25;
        this.waveFrequency = 0.02;
        this.waveOffset = 0;
        this.waveSpeed = 0.05;
        this.color = '#00aaff';
    }

    /**
     * Dibuja las olas del océano.
     * @param {CanvasRenderingContext2D} ctx - Contexto de renderizado 2D del canvas.
     * @param {number} cameraY - Posición Y de la cámara.
     */
    draw(ctx, cameraY) {
        ctx.beginPath();
        ctx.moveTo(0, this.height - cameraY);
        for (let x = 0; x <= ctx.canvas.width; x += 10) {
            const y = this.height + Math.sin(x * this.waveFrequency + this.waveOffset) * this.waveAmplitude - cameraY;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        ctx.lineTo(0, ctx.canvas.height);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#0077cc';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Actualiza la animación del océano.
     */
    update() {
        this.waveOffset += this.waveSpeed;
    }
}

/**
 * Representa el submarino del jugador.
 */
export class Submarine {
    constructor(ocean, preloadedImages, bubblePool, SUBMARINE_IMAGE_URL, SPOTLIGHT_MAX_BATTERY, SPOTLIGHT_DRAIN_RATE, SPOTLIGHT_CHARGE_RATE, MAX_WORLD_DEPTH) {
        this.ocean = ocean;
        this.bubblePool = bubblePool;
        this.image = preloadedImages[SUBMARINE_IMAGE_URL];
        this.scaleFactor = 0.8; // Increased size

        if (!this.image) {
            this.drawFallback = true;
            this.width = 120 * this.scaleFactor;
            this.height = 60 * this.scaleFactor;
        } else {
            this.drawFallback = false;
            this.width = this.image.naturalWidth * this.scaleFactor;
            this.height = this.image.naturalHeight * this.scaleFactor;
        }

        this.x = 0;
        this.y = this.ocean.height + 20;
        this.horizontalSpeed = 10;
        this.verticalSpeed = 5;
        this.facingDirection = 1;
        this.tiltAngle = 0;
        this.lastBubbleTime = 0;
        this.bubbleInterval = 50;

        this.batteryLevel = SPOTLIGHT_MAX_BATTERY;
        this.isSpotlightOn = false;
        this.isSurfaced = false;

        this.element = document.getElementById('submarineElement');
        this.imageElement = this.element.querySelector('img');
        this.imageElement.src = SUBMARINE_IMAGE_URL;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        this.horizontalDirection = 0;
        this.verticalDirection = 0;

        this.SPOTLIGHT_MAX_BATTERY = SPOTLIGHT_MAX_BATTERY;
        this.SPOTLIGHT_DRAIN_RATE = SPOTLIGHT_DRAIN_RATE;
        this.SPOTLIGHT_CHARGE_RATE = SPOTLIGHT_CHARGE_RATE;
        this.MAX_WORLD_DEPTH = MAX_WORLD_DEPTH;
    }

    /**
     * Dibuja el submarino actualizando sus propiedades CSS.
     * @param {number} cameraY - Posición Y de la cámara.
     * @param {number} globalDarknessFactor - Factor de oscuridad global (0 = luz, 1 = oscuridad total).
     * @param {boolean} isSpotlightOn - Si el foco del submarino está encendido.
     */
    draw(cameraY, globalDarknessFactor, isSpotlightOn) {
        const visibleY = this.y - cameraY;

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${visibleY}px`;

        let transform = `scale(${this.scaleFactor}) `;
        if (this.facingDirection === -1) {
            transform += `scaleX(-1)`;
        } else {
            transform += `scaleX(1)`;
        }
        this.element.style.transform = transform;
        this.element.style.transformOrigin = 'center center';

        if (isSpotlightOn) {
            this.element.style.opacity = 1;
        } else {
            this.element.style.opacity = Math.max(0.1, 1 - globalDarknessFactor);
        }
    }

    /**
     * Actualiza la posición y el estado del submarino.
     * @param {number} currentTime - Tiempo actual del juego.
     */
    update(currentTime, canvas, cameraY) {
        const waveInfluenceFactor = 0.15;

        this.x += this.horizontalDirection * this.horizontalSpeed;
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));

        // Calculate the wave's Y at the submarine's current X in world coordinates
        const waveYAtSubmarineX_world = this.ocean.height + Math.sin(this.x * this.ocean.waveFrequency + this.ocean.waveOffset) * this.ocean.waveAmplitude;
        // Define the target Y for the submarine when surfaced, relative to the wave
        const conningTowerTopAboveWave = 10; // How much of the submarine is above the wave
        const targetSurfacedY_world = waveYAtSubmarineX_world - conningTowerTopAboveWave;

        // Define a "surface zone" rather than a strict point
        const surfaceZoneBottom = this.ocean.height + this.height * 0.1; // Bottom of sub slightly below ocean surface

        // Check if the submarine is trying to surface or is already at the surface
        if (this.y <= surfaceZoneBottom && this.verticalDirection <= 0) { // If moving up or stationary and within surface zone
            this.isSurfaced = true;
            // Smoothly interpolate to the wave's Y position when surfaced
            this.y = this.lerp(this.y, targetSurfacedY_world, 0.1); // Use lerp for smoother wave following
            cameraY = 0; // Camera remains locked at 0 when surfaced
        } else {
            this.isSurfaced = false; // Not surfaced, apply normal movement and camera logic

            this.y += this.verticalDirection * this.verticalSpeed;
            const minSubWorldY = this.ocean.height - this.ocean.waveAmplitude - this.height * 0.5; // Allow some movement above water for diving
            const maxSubWorldY = this.MAX_WORLD_DEPTH - this.height;
            this.y = Math.max(minSubWorldY, Math.min(this.y, maxSubWorldY));

            // Camera movement logic (only when not surfaced)
            const deadZoneTop = cameraY + canvas.height * 0.3;
            const deadZoneBottom = cameraY + canvas.height * 0.7;
            if (this.y < deadZoneTop && cameraY > 0) {
                cameraY = Math.max(0, cameraY - (deadZoneTop - this.y));
            } else if (this.y + this.height > deadZoneBottom && cameraY < this.MAX_WORLD_DEPTH - canvas.height) {
                cameraY = Math.min(this.MAX_WORLD_DEPTH - canvas.height, cameraY + (this.y + this.height - deadZoneBottom));
            }
            cameraY = Math.max(0, Math.min(cameraY, this.MAX_WORLD_DEPTH - canvas.height));

            // Wave influence when submerged but near surface (for smooth transition)
            const waveInteractionZoneTop_world = this.ocean.height - this.ocean.waveAmplitude - (this.height * 0.2);
            const waveInteractionZoneBottom_world = this.ocean.height + this.ocean.waveAmplitude + (this.height * 0.5);
            const isWithinWaveVerticalRange = (this.y + this.height * 0.5) > waveInteractionZoneTop_world &&
                (this.y + this.height * 0.5) < waveInteractionZoneBottom_world;
            if (this.verticalDirection === 0 && isWithinWaveVerticalRange) {
                this.y += (waveYAtSubmarineX_world - (this.y + this.height * 0.5)) * waveInfluenceFactor;
            }
        }

        if (this.horizontalDirection === -1) { this.facingDirection = -1; }
        else if (this.horizontalDirection === 1) { this.facingDirection = 1; }
        this.tiltAngle = 0;

        // Bubble generation logic (only when not surfaced)
        if (!this.isSurfaced) {
            if (currentTime - this.lastBubbleTime > this.bubbleInterval) {
                let bubbleX, bubbleY, bubbleSpeedX;
                const bubbleSpeedY = -Math.random() * 0.8 - 0.8;
                const randomOffset = Math.random() * 10 - 5;

                if (this.verticalDirection !== 0) {
                    bubbleX = this.x + this.width / 2 + (Math.random() - 0.5) * 15;
                    bubbleY = this.y + (this.verticalDirection === 1 ? this.height : 0);
                    this.bubblePool.get().init(bubbleX, bubbleY, bubbleSpeedY * this.verticalDirection, (Math.random() - 0.5) * 0.5, Math.random() * 3 + 2, 0.9, 0.005);
                    this.lastBubbleTime = currentTime;
                }

                if (this.horizontalDirection !== 0) {
                    const propellerRelativeX = this.facingDirection === 1 ? (20 * this.scaleFactor) : (this.width - (20 * this.scaleFactor));
                    const propellerCenterY = this.y + this.height * 0.7;
                    bubbleX = this.x + propellerRelativeX + randomOffset;
                    bubbleSpeedX = this.facingDirection === 1 ? -(Math.random() * 3 + 1.5) : (Math.random() * 3 + 1.5);
                    bubbleY = propellerCenterY + randomOffset;
                    this.bubblePool.get().init(bubbleX, bubbleY, bubbleSpeedY, bubbleSpeedX, Math.random() * 4 + 3, 1.0, 0.01);
                    this.lastBubbleTime = currentTime;
                } else if (this.verticalDirection === 0 && this.horizontalDirection === 0 && currentTime - this.lastBubbleTime > 500) {
                    bubbleX = this.x + this.width / 2 + (Math.random() - 0.5) * 10;
                    bubbleY = this.y + this.height;
                    this.bubblePool.get().init(bubbleX, bubbleY, -0.5, (Math.random() - 0.5) * 0.2, Math.random() * 2 + 1, 0.7, 0.002);
                    this.lastBubbleTime = currentTime;
                }
            }
        }

        if (this.isSpotlightOn && this.batteryLevel > 0) {
            this.batteryLevel = Math.max(0, this.batteryLevel - this.SPOTLIGHT_DRAIN_RATE);
            if (this.batteryLevel === 0) { this.isSpotlightOn = false; }
        } else if (!this.isSpotlightOn && this.batteryLevel < this.SPOTLIGHT_MAX_BATTERY) {
            this.batteryLevel = Math.min(this.SPOTLIGHT_MAX_BATTERY, this.batteryLevel + this.SPOTLIGHT_CHARGE_RATE);
        }
        return cameraY;
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }
}

/**
 * Representa una partícula flotante en el agua.
 */
export class Particle {
    constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.size = 0;
        this.alpha = 0;
        this.decayRate = 0;
        this.initialSize = 0;
        this.type = 'mote';
    }

    /**
     * Inicializa la partícula para su uso desde el pool.
     * @param {number} x - Posición X inicial.
     * @param {number} y - Posición Y inicial.
     * @param {number} speedX - Velocidad horizontal.
     * @param {number} speedY - Velocidad vertical.
     * @param {number} size - Tamaño de la partícula.
     * @param {number} alpha - Opacidad inicial.
     * @param {number} decayRate - Tasa de decaimiento de la opacidad.
     * @param {string} type - Tipo de partícula ('mote', 'debris', 'spotlight-dust').
     */
    init(x, y, speedX, speedY, size, alpha, decayRate, type = 'mote') {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.size = size;
        this.alpha = alpha;
        this.decayRate = decayRate;
        this.initialSize = size;
        this.type = type;
        this.active = true;
    }

    /**
     * Actualiza la posición y el estado de la partícula.
     * @param {number} maxWorldDepth - Profundidad máxima del mundo.
     * @param {number} oceanHeight - Altura del océano.
     * @param {Submarine} submarine - Instancia del submarino para interacción.
     */
    update(maxWorldDepth, oceanHeight, submarine, canvas) {
        if (!this.active) return;

        this.x += this.speedX;
        this.y += this.speedY;

        // Efecto de empuje del submarino
        const distToSubX = this.x - (submarine.x + submarine.width / 2);
        const distToSubY = this.y - (submarine.y + submarine.height / 2);
        const distToSub = Math.sqrt(distToSubX * distToSubX + distToSubY * distToSubY);
        const pushRadius = 150;
        const pushForce = 0.5;

        if (distToSub < pushRadius) {
            const angle = Math.atan2(distToSubY, distToSubX);
            const pushMagnitude = pushForce * (1 - (distToSub / pushRadius));
            this.x += Math.cos(angle) * pushMagnitude;
            this.y += Math.sin(angle) * pushMagnitude;
        }

        // Decaimiento para partículas de polvo del foco
        if (this.type === 'spotlight-dust') {
            this.alpha -= this.decayRate;
            if (this.alpha <= 0) {
                this.active = false;
            }
        } else {
            // Reinicia la posición si sale de los límites para motas y escombros
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            const minParticleWorldY = oceanHeight + 30;
            if (this.y < minParticleWorldY) { this.y = maxWorldDepth - 1; }
            else if (this.y > maxWorldDepth) { this.y = minParticleWorldY; }
        }
    }

    /**
     * Dibuja la partícula en el canvas.
     * @param {CanvasRenderingContext2D} ctx - Contexto de renderizado 2D.
     * @param {number} cameraY - Posición Y de la cámara.
     * @param {number} globalDarknessFactor - Factor de oscuridad global.
     * @param {boolean} isInSpotlight - Si la partícula está dentro del foco.
     */
    draw(ctx, cameraY, globalDarknessFactor, isInSpotlight) {
        if (!this.active) return;

        let adjustedAlpha = this.alpha;
        let adjustedSize = this.initialSize;

        // Ajusta según la profundidad (oscuridad)
        const depthInfluence = globalDarknessFactor;
        if (this.type === 'mote') {
            adjustedAlpha = Math.min(1, this.alpha + (depthInfluence * 0.6));
            adjustedSize = this.initialSize + (depthInfluence * 1.5);
        } else if (this.type === 'debris') {
            adjustedAlpha = Math.min(1, this.alpha + (depthInfluence * 0.3));
            adjustedSize = this.initialSize + (depthInfluence * 0.5);
        }

        // Si está en el foco, mejora la visibilidad
        if (isInSpotlight) {
            adjustedAlpha = Math.min(1, adjustedAlpha * 1.5 + 0.2);
            adjustedSize = Math.min(adjustedSize * 1.2, 4);
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, adjustedAlpha)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y - cameraY, adjustedSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Representa una burbuja de propulsión del submarino.
 */
export class Bubble {
    constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.speedY = 0;
        this.speedX = 0;
        this.size = 0;
        this.alpha = 0;
        this.decayRate = 0;
    }

    /**
     * Inicializa la burbuja para su uso desde el pool.
     * @param {number} x - Posición X inicial.
     * @param {number} y - Posición Y inicial.
     * @param {number} speedY - Velocidad vertical.
     * @param {number} speedX - Velocidad horizontal.
     * @param {number} size - Tamaño de la burbuja.
     * @param {number} alpha - Opacidad inicial.
     * @param {number} decayRate - Tasa de decaimiento de la opacidad.
     */
    init(x, y, speedY, speedX, size, alpha, decayRate) {
        this.x = x;
        this.y = y;
        this.speedY = speedY;
        this.speedX = speedX;
        this.size = size;
        this.alpha = alpha;
        this.decayRate = decayRate;
        this.active = true;
    }

    /**
     * Actualiza la posición y la opacidad de la burbuja.
     */
    update() {
        if (!this.active) return;
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decayRate;
        if (this.alpha <= 0) {
            this.active = false;
        }
    }

    /**
     * Dibuja la burbuja en el canvas.
     * @param {CanvasRenderingContext2D} ctx - Contexto de renderizado 2D.
     * @param {number} cameraY - Posición Y de la cámara.
     * @param {number} globalDarknessFactor - Factor de oscuridad global.
     * @param {boolean} isSpotlightOn - Si el foco del submarino está encendido.
     */
    draw(ctx, cameraY, globalDarknessFactor, isSpotlightOn) {
        if (!this.active) return;
        let finalAlpha = this.alpha;

        if (isSpotlightOn) {
            finalAlpha = Math.min(1, this.alpha * 1.5 + 0.3);
        } else {
            finalAlpha = Math.min(1, this.alpha * (1 - globalDarknessFactor * 0.7));
            finalAlpha = Math.max(0.05, finalAlpha);
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y - cameraY, this.size, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(
            this.x + this.size * 0.3, this.y - cameraY - this.size * 0.3, this.size * 0.1,
            this.x, this.y - cameraY, this.size
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, finalAlpha * 0.9)})`);
        gradient.addColorStop(0.7, `rgba(200, 230, 255, ${Math.max(0, finalAlpha * 0.5)})`);
        gradient.addColorStop(1, `rgba(150, 200, 255, ${Math.max(0, finalAlpha * 0.1)})`);

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, finalAlpha * 0.7)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * Pool de objetos para reutilizar instancias.
 */
export class ObjectPool {
    constructor(ClassRef, initialSize) {
        this.pool = [];
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(new ClassRef());
        }
        this.ClassRef = ClassRef;
    }

    /**
     * Obtiene un objeto del pool. Si no hay inactivos, crea uno nuevo.
     * @returns {Object} Una instancia de la clase.
     */
    get() {
        for (let i = 0; i < this.pool.length; i++) {
            if (!this.pool[i].active) {
                return this.pool[i];
            }
        }
        const newObj = new this.ClassRef();
        this.pool.push(newObj);
        return newObj;
    }

    /**
     * Itera sobre los objetos activos en el pool.
     * @param {Function} callback - Función a ejecutar para cada objeto activo.
     */
    forEachActive(callback) {
        for (let i = 0; i < this.pool.length; i++) {
            if (this.pool[i].active) {
                callback(this.pool[i]);
            }
        }
    }
}

/**
 * Representa una criatura marina animada (utilizando elementos DOM).
 */
export class Creature {
    constructor(creatureData, worldMinY, worldMaxY, canvas) {
        this.id = creatureData.id;
        this.imageSrc = creatureData.imageSrc;
        this.name = creatureData.name;
        this.description = creatureData.description;
        this.funFact = creatureData.funFact;
        this.hasLight = creatureData.hasLight || false;
        this.lightColor = creatureData.lightColor || 'rgba(0, 200, 255, 0.9)';
        this.lightRadius = creatureData.lightRadius || 10;
        this.lightOffsetY = creatureData.lightOffsetY || 0;

        this.baseWidth = 120;
        this.baseHeight = 80;
        this.scale = creatureData.scale;
        this.width = this.baseWidth * this.scale;
        this.height = this.baseHeight * this.scale;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (worldMaxY - worldMinY) + worldMinY;
        this.velocity = { x: (Math.random() - 0.5) * 1, y: (Math.random() - 0.5) * 1 };
        this.maxSpeed = 1.0;
        this.minSpeed = 0.3;
        this.facingDirection = this.velocity.x > 0 ? 1 : -1;
        this.worldMinY = worldMinY;
        this.worldMaxY = worldMaxY;

        this.scaleFactor = 1.0;
        this.scaleDirection = 1;
        this.scaleSpeed = 0.005;
        this.minScale = 0.95;
        this.maxScale = 1.05;
        this.isSchooling = false;

        this.movementChangeInterval = Math.random() * 2000 + 1000;
        this.lastMovementChangeTime = 0;

        this.lightOpacity = 0;
        this.lightFadeDirection = 1;
        this.lightFadeSpeed = 0.005;
        this.maxLightOpacity = 0.9;
        this.minLightOpacity = 0.1;

        this.currentOpacity = 0.1;
        this.opacityTransitionSpeed = 0.05;

        this.isHighlighting = false;
        this.highlightDuration = 500;
        this.highlightStartTime = 0;

        this.element = document.createElement('div');
        this.element.classList.add('creature-element');
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        this.imageElement = document.createElement('img');
        this.imageElement.src = this.imageSrc;
        this.imageElement.alt = this.name;
        this.element.appendChild(this.imageElement);

        document.getElementById('creaturesContainer').appendChild(this.element);
        this.canvas = canvas;
    }

    /**
     * Activa el efecto de resaltado para esta criatura.
     * @param {number} currentTime - El tiempo actual del juego.
     */
    triggerHighlight(currentTime) {
        this.isHighlighting = true;
        this.highlightStartTime = currentTime;
        this.element.classList.add('highlight');
    }

    /**
     * Actualiza la posición y el estado de la criatura.
     * @param {number} currentTime - Tiempo actual del juego.
     */
    update(currentTime) {
        // Only apply independent movement if not schooling
        if (!this.isSchooling) {
            if (currentTime - this.lastMovementChangeTime > this.movementChangeInterval) {
                this.velocity.x = (Math.random() - 0.5) * this.maxSpeed * 2;
                this.velocity.y = (Math.random() - 0.5) * this.maxSpeed * 2;
                this.lastMovementChangeTime = currentTime;
                this.movementChangeInterval = Math.random() * 2000 + 1000;
            }

            this.x += this.velocity.x;
            this.y += this.velocity.y;

            const bounceFactor = -0.8;
            if (this.x < 0) { this.x = 0; this.velocity.x *= bounceFactor; this.facingDirection = 1; }
            else if (this.x + this.width > this.canvas.width) { this.x = this.canvas.width - this.width; this.velocity.x *= bounceFactor; this.facingDirection = -1; }
            if (this.y < this.worldMinY) { this.y = this.worldMinY; this.velocity.y *= bounceFactor; }
            else if (this.y + this.height > this.worldMaxY) { this.y = this.worldMaxY - this.height; this.velocity.y *= bounceFactor; }

            const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (currentSpeed < this.minSpeed && currentSpeed > 0) {
                this.velocity.x = (this.velocity.x / currentSpeed) * this.minSpeed;
                this.velocity.y = (this.velocity.y / currentSpeed) * this.minSpeed;
            } else if (currentSpeed > this.maxSpeed) {
                this.velocity.x = (this.velocity.x / currentSpeed) * this.maxSpeed;
                this.velocity.y = (this.velocity.y / currentSpeed) * this.maxSpeed;
            }
        }

        this.scaleFactor += this.scaleDirection * this.scaleSpeed;
        if (this.scaleFactor >= this.maxScale) { this.scaleFactor = this.maxScale; this.scaleDirection = -1; }
        else if (this.scaleFactor <= this.minScale) { this.scaleFactor = this.minScale; this.scaleDirection = 1; }

        // Only adjust facing direction if not schooling (school handles its members' facing)
        if (!this.isSchooling) {
            if (this.velocity.x < 0) { this.facingDirection = -1; }
            else if (this.velocity.x > 0) { this.facingDirection = 1; }
        }

        if (this.hasLight) {
            this.lightOpacity += this.lightFadeDirection * this.lightFadeSpeed;

            if (this.lightFadeDirection === 1 && this.lightOpacity >= this.maxLightOpacity) {
                this.lightOpacity = this.maxLightOpacity;
                this.lightFadeDirection = -1;
            } else if (this.lightFadeDirection === -1 && this.lightOpacity <= this.minLightOpacity) {
                this.lightOpacity = this.minLightOpacity;
                this.lightFadeDirection = 1;
            }
        }

        if (this.isHighlighting && (currentTime - this.highlightStartTime > this.highlightDuration)) {
            this.isHighlighting = false;
            this.element.classList.remove('highlight');
        }
    }

    /**
     * El método draw ahora actualiza las propiedades CSS del elemento DOM.
     * @param {number} cameraY - Posición Y de la cámara.
     * @param {number} globalDarknessFactor - Factor de oscuridad global.
     * @param {boolean} isSubmarineSpotlightOn - Si el foco del submarino está encendido.
     * @param {Array<Creature>} creaturesInLight - Array de criaturas actualmente en la luz del foco.
     */
    draw(cameraY, globalDarknessFactor, isSubmarineSpotlightOn, creaturesInLight) {
        const screenX = this.x;
        const screenY = this.y - cameraY;

        this.element.style.left = `${screenX}px`;
        this.element.style.top = `${screenY}px`;

        let combinedScale = this.scale * this.scaleFactor;
        let transform = `scale(${combinedScale}) `;
        if (this.facingDirection === -1) {
            transform += `scaleX(1)`;
        } else {
            transform += `scaleX(-1)`;
        }
        this.element.style.transform = transform;
        this.element.style.transformOrigin = 'center center';

        let targetOpacity;
        let targetFilterGrayscale;

        if (isSubmarineSpotlightOn && creaturesInLight.includes(this)) {
            targetOpacity = 1;
            targetFilterGrayscale = 0;
        } else {
            targetOpacity = Math.max(0.1, 1 - globalDarknessFactor);
            targetFilterGrayscale = globalDarknessFactor * 100;
        }

        this.currentOpacity = this.lerp(this.currentOpacity, targetOpacity, this.opacityTransitionSpeed);

        this.element.style.opacity = this.currentOpacity;
        this.element.style.filter = `grayscale(${targetFilterGrayscale}%)`;
    }

    /**
     * Elimina el elemento DOM de la criatura.
     */
    removeElement() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }
}

/**
 * Gestiona el comportamiento de cardumen (boids) para un grupo de criaturas.
 */
export class School {
    constructor(creatureTypeData, worldMinY, worldMaxY, numMembers, canvas) {
        this.members = [];
        this.creatureTypeData = creatureTypeData;
        this.worldMinY = worldMinY;
        this.worldMaxY = worldMaxY;

        this.schoolingRadius = 100; // Slightly reduced radius for tighter groups
        this.separationDistance = 25; // Slightly increased to prevent more overlaps but still allow closeness
        this.cohesionWeight = 0.008; // Increased for stronger pull towards center
        this.alignmentWeight = 0.08; // Increased for stronger alignment
        this.separationWeight = 0.03; // Increased to prevent more overlaps
        this.boundaryWeight = 0.1;
        this.fleeWeight = 1.0; // Increased for stronger flee response

        this.normalMaxSpeed = 0.4; // Slightly slower for more natural, slow movement
        this.fleeSpeed = 4.0; // Faster flee speed
        this.reuniteSpeed = 2.0; // Faster reunification speed

        this.isFleeing = false;
        this.reuniting = false; // New state for reunification phase
        this.fleeingTimeout = null;
        this.fleeRadius = 250; // Increased radius to trigger fleeing earlier
        this.reuniteDelay = 1500; // Shorter delay to start reuniting faster
        this.canvas = canvas;

        for (let i = 0; i < numMembers; i++) {
            const creature = new Creature(
                creatureTypeData,
                worldMinY,
                worldMaxY,
                canvas
            );
            creature.isSchooling = true;
            creature.maxSpeed = this.normalMaxSpeed; // Set initial max speed
            creature.maxForce = 0.05; // Max force for individual creature
            this.members.push(creature);
        }
    }

    /**
     * Actualiza el comportamiento de cardumen de todos los miembros.
     * @param {number} currentTime - Tiempo actual del juego.
     * @param {Submarine} submarine - Instancia del submarino para interacción.
     */
    update(currentTime, submarine) {
        let anyMemberCloseToSubmarine = false;

        // Check for submarine proximity
        for (const member of this.members) {
            const distToSub = Math.sqrt(
                (member.x + member.width / 2 - (submarine.x + submarine.width / 2)) ** 2 +
                (member.y + member.height / 2 - (submarine.y + submarine.height / 2)) ** 2
            );
            if (distToSub < this.fleeRadius) {
                anyMemberCloseToSubmarine = true;
                break;
            }
        }

        if (anyMemberCloseToSubmarine) {
            this.isFleeing = true;
            this.reuniting = false; // Stop reuniting if sub is close again
            if (this.fleeingTimeout) {
                clearTimeout(this.fleeingTimeout);
                this.fleeingTimeout = null;
            }
        } else if (this.isFleeing && !this.fleeingTimeout) {
            // Submarine moved away, start reunification timer
            this.fleeingTimeout = setTimeout(() => {
                this.isFleeing = false;
                this.fleeingTimeout = null;
                this.reuniting = true; // Start reuniting phase
                // Set a timeout to end reunification phase
                setTimeout(() => this.reuniting = false, 3000); // Reunite for 3 seconds
            }, this.reuniteDelay);
        }

        // Calculate average velocity for school facing direction if not fleeing
        let totalVelocityX = 0;
        if (!this.isFleeing && !this.reuniting) {
            this.members.forEach(member => {
                totalVelocityX += member.velocity.x;
            });
        }
        const schoolFacingDirection = totalVelocityX >= 0 ? 1 : -1;


        this.members.forEach(member => {
            let separation = { x: 0, y: 0 };
            let alignment = { x: 0, y: 0 };
            let cohesion = { x: 0, y: 0 };
            let count = 0;

            // Fleeing force from submarine for individual member
            let fleeForce = { x: 0, y: 0 };
            if (this.isFleeing) {
                const distToSub = Math.sqrt(
                    (member.x + member.width / 2 - (submarine.x + submarine.width / 2)) ** 2 +
                    (member.y + member.height / 2 - (submarine.y + submarine.height / 2)) ** 2
                );
                if (distToSub < this.fleeRadius) {
                    const angle = Math.atan2(
                        member.y + member.height / 2 - (submarine.y + submarine.height / 2),
                        member.x + member.width / 2 - (submarine.x + submarine.width / 2)
                    );
                    const fleeMagnitude = 1 - (distToSub / this.fleeRadius); // Stronger closer to sub
                    fleeForce.x = Math.cos(angle) * fleeMagnitude * 2; // Stronger flee force
                    fleeForce.y = Math.sin(angle) * fleeMagnitude * 2;
                }
            }

            this.members.forEach(other => {
                if (member !== other) {
                    const distance = Math.sqrt(
                        (member.x - other.x) ** 2 + (member.y - other.y) ** 2
                    );

                    if (distance < this.separationDistance) {
                        const diffX = member.x - other.x;
                        const diffY = member.y - other.y;
                        separation.x += diffX / distance;
                        separation.y += diffY / distance;
                    }

                    if (distance < this.schoolingRadius) {
                        cohesion.x += other.x;
                        cohesion.y += other.y;
                        alignment.x += other.velocity.x;
                        alignment.y += other.velocity.y;
                        count++;
                    }
                }
            });

            if (count > 0) {
                cohesion.x /= count;
                cohesion.y /= count;
                cohesion.x -= member.x;
                cohesion.y -= member.y;
                const magCohesion = Math.sqrt(cohesion.x ** 2 + cohesion.y ** 2);
                if (magCohesion > 0) {
                    cohesion.x /= magCohesion;
                    cohesion.y /= magCohesion;
                }

                alignment.x /= count;
                alignment.y /= count;
                const magAlignment = Math.sqrt(alignment.x ** 2 + alignment.y ** 2);
                if (magAlignment > 0) {
                    alignment.x /= magAlignment;
                    alignment.y /= magAlignment;
                }
            }

            const magSeparation = Math.sqrt(separation.x ** 2 + separation.y ** 2);
            if (magSeparation > 0) {
                separation.x /= magSeparation;
                separation.y /= magSeparation;
            }

            let boundaryAvoidance = { x: 0, y: 0 };
            const margin = 50;
            const turnFactor = 0.5;

            if (member.x < margin) {
                boundaryAvoidance.x += turnFactor;
            } else if (member.x > this.canvas.width - margin - member.width) {
                boundaryAvoidance.x -= turnFactor;
            }

            if (member.y < this.worldMinY + margin) {
                boundaryAvoidance.y += turnFactor;
            } else if (member.y > this.worldMaxY - margin - member.height) {
                boundaryAvoidance.y -= turnFactor;
            }
            const magBoundary = Math.sqrt(boundaryAvoidance.x ** 2 + boundaryAvoidance.y ** 2);
            if (magBoundary > 0) {
                boundaryAvoidance.x /= magBoundary;
                boundaryAvoidance.y /= magBoundary;
            }

            // Add a small random force for more natural movement
            const randomForceMagnitude = 0.005; // Small random force
            let randomForceX = (Math.random() - 0.5) * randomForceMagnitude;
            let randomForceY = (Math.random() - 0.5) * randomForceMagnitude;

            // Adjust weights and max speed based on state
            let currentCohesionWeight = this.cohesionWeight;
            let currentAlignmentWeight = this.alignmentWeight;
            let currentSeparationWeight = this.separationWeight;
            let currentMaxSpeed = this.normalMaxSpeed;

            if (this.isFleeing) {
                currentCohesionWeight = 0; // Ignore cohesion when fleeing
                currentAlignmentWeight = 0; // Ignore alignment when fleeing
                currentSeparationWeight = this.separationWeight * 4; // Much stronger separation when fleeing
                currentMaxSpeed = this.fleeSpeed; // Faster when fleeing
            } else if (this.reuniting) {
                currentCohesionWeight = this.cohesionWeight * 3; // Boost cohesion to reunite
                currentAlignmentWeight = this.alignmentWeight * 2; // Boost alignment
                currentSeparationWeight = this.separationWeight * 0.5; // Less separation
                currentMaxSpeed = this.reuniteSpeed; // Faster reunification
            }

            let forceX = separation.x * currentSeparationWeight +
                alignment.x * currentAlignmentWeight +
                cohesion.x * currentCohesionWeight +
                boundaryAvoidance.x * this.boundaryWeight +
                fleeForce.x * this.fleeWeight +
                randomForceX; // Add random force

            let forceY = separation.y * currentSeparationWeight +
                alignment.y * currentAlignmentWeight +
                cohesion.y * currentCohesionWeight +
                boundaryAvoidance.y * this.boundaryWeight +
                fleeForce.y * this.fleeWeight +
                randomForceY; // Add random force

            const magForce = Math.sqrt(forceX ** 2 + forceY ** 2);
            if (magForce > member.maxForce) {
                forceX = (forceX / magForce) * member.maxForce;
                forceY = (forceY / magForce) * member.maxForce;
            }

            member.velocity.x += forceX;
            member.velocity.y += forceY;

            const magVelocity = Math.sqrt(member.velocity.x ** 2 + member.velocity.y ** 2);
            if (magVelocity > currentMaxSpeed) {
                member.velocity.x = (member.velocity.x / magVelocity) * currentMaxSpeed;
                member.velocity.y = (member.velocity.y / magVelocity) * currentMaxSpeed;
            }

            member.x += member.velocity.x;
            member.y += member.velocity.y;

            member.y = Math.max(this.worldMinY, Math.min(member.y, this.worldMaxY - member.height));
            member.x = Math.max(0, Math.min(member.x, this.canvas.width - member.width));

            // Adjust facing direction based on school's overall direction if not fleeing
            if (!this.isFleeing) {
                member.facingDirection = schoolFacingDirection;
            } else {
                // When fleeing, they turn away from the submarine
                if (fleeForce.x > 0) {
                    member.facingDirection = 1;
                } else if (fleeForce.x < 0) {
                    member.facingDirection = -1;
                }
            }

            member.update(currentTime); // Creature's own update for scaling/light
        });
    }

    /**
     * Dibuja todos los miembros del cardumen.
     * @param {number} cameraY - Posición Y de la cámara.
     * @param {number} globalDarknessFactor - Factor de oscuridad global.
     * @param {boolean} isSubmarineSpotlightOn - Si el foco del submarino está encendido.
     * @param {Array<Creature>} creaturesInLight - Array de criaturas actualmente en la luz del foco.
     */
    draw(cameraY, globalDarknessFactor, isSubmarineSpotlightOn, creaturesInLight) {
        this.members.forEach(member => {
            member.draw(cameraY, globalDarknessFactor, isSubmarineSpotlightOn, creaturesInLight);
        });
    }

    /**
     * Elimina los elementos DOM de todos los miembros del cardumen.
     */
    removeElements() {
        this.members.forEach(member => member.removeElement());
    }
}
