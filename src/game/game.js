// --- Clases de Objetos del Juego ---

/**
 * Representa el océano y sus olas.
 */
export class Ocean {
    constructor() {
        this.height = 80; // Altura del océano.
        this.waveAmplitude = 25; // Amplitud de la ola.
        this.waveFrequency = 0.02; // Frecuencia de la ola.
        this.waveOffset = 0; // Desplazamiento de la ola.
        this.waveSpeed = 0.05; // Velocidad de la ola.
        this.color = '#00aaff'; // Color del océano.
    }

    /**
     * Dibuja las olas del océano.
     * @param {CanvasRenderingContext2D} ctx - Contexto de renderizado 2D del canvas.
     * @param {number} cameraY - Posición Y de la cámara.
     */
    draw(ctx, cameraY) {
        ctx.beginPath(); // Comienza un nuevo trazado.
        ctx.moveTo(0, this.height - cameraY); // Mueve el punto de inicio del trazado.
        // Dibuja las olas.
        for (let x = 0; x <= ctx.canvas.width; x += 10) {
            const y = this.height + Math.sin(x * this.waveFrequency + this.waveOffset) * this.waveAmplitude - cameraY;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height); // Dibuja una línea hasta la esquina inferior derecha.
        ctx.lineTo(0, ctx.canvas.height); // Dibuja una línea hasta la esquina inferior izquierda.
        ctx.closePath(); // Cierra el trazado.
        ctx.fillStyle = this.color; // Establece el color de relleno.
        ctx.fill(); // Rellena el trazado.
        ctx.strokeStyle = '#0077cc'; // Establece el color del borde.
        ctx.lineWidth = 2; // Establece el ancho del borde.
        ctx.stroke(); // Dibuja el borde.
    }

    /**
     * Actualiza la animación del océano.
     */
    update() {
        this.waveOffset += this.waveSpeed; // Actualiza el desplazamiento de la ola.
    }
}

/**
 * Representa el submarino del jugador.
 */
export class Submarine {
    constructor(ocean, preloadedImages, bubblePool, SUBMARINE_IMAGE_URL, SUBMARINE_STATIC_IMAGE_URL, SPOTLIGHT_MAX_BATTERY, SPOTLIGHT_DRAIN_RATE, SPOTLIGHT_CHARGE_RATE, MAX_WORLD_DEPTH, SUBMARINE_BASE_WIDTH, SUBMARINE_BASE_HEIGHT, SUBMARINE_SCALE_FACTOR, SUBMARINE_HORIZONTAL_SPEED, SUBMARINE_VERTICAL_SPEED) {
        this.ocean = ocean; // Instancia del océano.
        this.bubblePool = bubblePool; // Pool de burbujas.
        this.animatedImage = preloadedImages[SUBMARINE_IMAGE_URL];
        this.staticImage = preloadedImages[SUBMARINE_STATIC_IMAGE_URL];
        this.scaleFactor = SUBMARINE_SCALE_FACTOR; // Factor de escala del submarino.

        // Establece el tamaño del submarino.
        if (!this.animatedImage) {
            this.drawFallback = true;
            this.width = SUBMARINE_BASE_WIDTH * this.scaleFactor;
            this.height = SUBMARINE_BASE_HEIGHT * this.scaleFactor;
        } else {
            this.drawFallback = false;
            this.width = this.animatedImage.naturalWidth * this.scaleFactor;
            this.height = this.animatedImage.naturalHeight * this.scaleFactor;
        }

        // Propiedades del submarino.
        this.x = 0;
        this.y = this.ocean.height + 20;
        this.horizontalSpeed = SUBMARINE_HORIZONTAL_SPEED;
        this.verticalSpeed = SUBMARINE_VERTICAL_SPEED;
        this.facingDirection = 1;
        this.tiltAngle = 0;
        this.lastBubbleTime = 0;
        this.bubbleInterval = 50;

        this.batteryLevel = SPOTLIGHT_MAX_BATTERY;
        this.isSpotlightOn = false;
        this.spotlightOpacity = 0;
        this.targetSpotlightOpacity = 0;
        this.isSurfaced = false;
        this.isPaused = false;

        // Elementos del DOM.
        this.element = document.getElementById('submarineElement');
        this.imageElement = this.element.querySelector('img');
        this.imageElement.src = this.animatedImage ? this.animatedImage.src : '';
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        this.horizontalDirection = 0;
        this.verticalDirection = 0;

        // Constantes del juego.
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

        const depthInMeters = this.y / 10; // PIXELS_PER_METER is 10

        if (depthInMeters > 450 && !isSpotlightOn) {
            this.element.style.opacity = 0;
        }
        else if (isSpotlightOn) {
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
        if (this.isPaused) {
            return cameraY;
        }
        const isMoving = this.horizontalDirection !== 0 || this.verticalDirection !== 0;

        if (isMoving) {
            if (this.imageElement.src !== this.animatedImage.src) {
                this.imageElement.src = this.animatedImage.src;
            }
        } else {
            if (this.imageElement.src !== this.staticImage.src) {
                this.imageElement.src = this.staticImage.src;
            }
        }
        const waveInfluenceFactor = 0.15;

        this.x += this.horizontalDirection * this.horizontalSpeed;
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));

        // Calcula la Y de la ola en la X actual del submarino en coordenadas del mundo.
        const waveYAtSubmarineX_world = this.ocean.height + Math.sin(this.x * this.ocean.waveFrequency + this.ocean.waveOffset) * this.ocean.waveAmplitude;
        // Define la Y objetivo para el submarino cuando está en la superficie, relativa a la ola.
        const conningTowerTopAboveWave = 10; // Cuánto del submarino está por encima de la ola.
        const targetSurfacedY_world = waveYAtSubmarineX_world - conningTowerTopAboveWave;

        // Define una "zona de superficie" en lugar de un punto estricto.
        const surfaceZoneBottom = this.ocean.height + this.height * 0.1; // La parte inferior del submarino ligeramente por debajo de la superficie del océano.

        // Comprueba si el submarino está intentando salir a la superficie o ya está en la superficie.
        if (this.y <= surfaceZoneBottom && this.verticalDirection <= 0) { // Si se mueve hacia arriba o está parado y dentro de la zona de superficie.
            this.isSurfaced = true;
            // Interpola suavemente a la posición Y de la ola cuando está en la superficie.
            this.y = this.lerp(this.y, targetSurfacedY_world, 0.1); // Usa lerp para un seguimiento de olas más suave.
            cameraY = 0; // La cámara permanece bloqueada en 0 cuando está en la superficie.
        } else {
            this.isSurfaced = false; // No está en la superficie, aplica la lógica normal de movimiento y cámara.

            this.y += this.verticalDirection * this.verticalSpeed;
            const minSubWorldY = this.ocean.height - this.ocean.waveAmplitude - this.height * 0.5; // Permite algo de movimiento sobre el agua para bucear.
            const maxSubWorldY = this.MAX_WORLD_DEPTH - this.height;
            this.y = Math.max(minSubWorldY, Math.min(this.y, maxSubWorldY));

            // Lógica de movimiento de la cámara (solo cuando no está en la superficie).
            const deadZoneTop = cameraY + canvas.height * 0.3;
            const deadZoneBottom = cameraY + canvas.height * 0.7;
            if (this.y < deadZoneTop && cameraY > 0) {
                cameraY = Math.max(0, cameraY - (deadZoneTop - this.y));
            } else if (this.y + this.height > deadZoneBottom && cameraY < this.MAX_WORLD_DEPTH - canvas.height) {
                cameraY = Math.min(this.MAX_WORLD_DEPTH - canvas.height, cameraY + (this.y + this.height - deadZoneBottom));
            }
            cameraY = Math.max(0, Math.min(cameraY, this.MAX_WORLD_DEPTH - canvas.height));

            // Influencia de las olas cuando está sumergido pero cerca de la superficie (para una transición suave).
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

        // Lógica de generación de burbujas (solo cuando no está en la superficie).
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

        // Actualiza el nivel de la batería.
        if (this.isSpotlightOn && this.batteryLevel > 0) {
            this.batteryLevel = Math.max(0, this.batteryLevel - this.SPOTLIGHT_DRAIN_RATE);
            if (this.batteryLevel === 0) {
                this.isSpotlightOn = false;
                this.targetSpotlightOpacity = 0;
            }
        } else if (!this.isSpotlightOn && this.batteryLevel < this.SPOTLIGHT_MAX_BATTERY) {
            this.batteryLevel = Math.min(this.SPOTLIGHT_MAX_BATTERY, this.batteryLevel + this.SPOTLIGHT_CHARGE_RATE);
        }

        // Transición suave de la opacidad del foco
        this.spotlightOpacity = this.lerp(this.spotlightOpacity, this.targetSpotlightOpacity, 0.1);
        if (this.spotlightOpacity < 0.01) this.spotlightOpacity = 0;
        if (this.spotlightOpacity > 0.99) this.spotlightOpacity = 1;


        return cameraY;
    }

    toggleSpotlight() {
        if (this.batteryLevel > 0) {
            this.isSpotlightOn = !this.isSpotlightOn;
            this.targetSpotlightOpacity = this.isSpotlightOn ? 1 : 0;
        }
    }

    // Función de interpolación lineal.
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
        const adjustedSize = this.initialSize;

        if (isInSpotlight) {
            adjustedAlpha = Math.min(1, this.alpha * 3.0 + 0.5);
        }

        if (adjustedAlpha > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${adjustedAlpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y - cameraY, adjustedSize, 0, Math.PI * 2);
            ctx.fill();
        }
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
        if (!this.active || !isFinite(this.size) || this.size <= 0) return;
        let finalAlpha = this.alpha;

        if (isSpotlightOn) {
            finalAlpha = Math.min(1, this.alpha * 1.5 + 0.3);
        } else {
            finalAlpha = Math.min(1, this.alpha * (1 - globalDarknessFactor * 0.7));
            finalAlpha = Math.max(0.05, finalAlpha);
        }

        ctx.save();
        ctx.beginPath();

        const x = this.x;
        const y = this.y - cameraY;
        const size = this.size;

        if (!isFinite(x) || !isFinite(y) || !isFinite(size)) {
            ctx.restore();
            return;
        }

        ctx.arc(x, y, size, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(
            x + size * 0.3, y - size * 0.3, size * 0.1,
            x, y, size
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
        this.flees = creatureData.flees || false;
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
        this.velocity = { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 };
        this.maxSpeed = 0.5;
        this.minSpeed = 0.1;
        this.facingDirection = this.velocity.x > 0 ? 1 : -1;
        this.worldMinY = worldMinY;
        this.worldMaxY = worldMaxY;

        this.scaleFactor = 1.0;
        this.scaleDirection = 1;
        this.scaleSpeed = 0.005;
        this.minScale = 0.95;
        this.maxScale = 1.05;

        if (this.id === 'anoplogaster') {
            this.minScale = 1.0;
            this.maxScale = 1.0;
        }
        this.isSchooling = false;

        this.movementChangeFrequency = creatureData.movementChangeFrequency;
        this.movementChangeInterval = Math.random() * 2000 + 1000;
        this.lastMovementChangeTime = 0;
        this.wanderAngle = Math.random() * 2 * Math.PI;

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
    update(currentTime, submarine) {
        // Solo aplica movimiento independiente si no está en un cardumen.
        if (!this.isSchooling) {
            if (this.flees && submarine) {
                const distToSub = Math.sqrt(
                    (this.x + this.width / 2 - (submarine.x + submarine.width / 2)) ** 2 +
                    (this.y + this.height / 2 - (submarine.y + submarine.height / 2)) ** 2
                );

                if (distToSub < 150) {
                    const angle = Math.atan2(
                        this.y + this.height / 2 - (submarine.y + submarine.height / 2),
                        this.x + this.width / 2 - (submarine.x + submarine.width / 2)
                    );
                    this.velocity.x = Math.cos(angle) * 3;
                    this.velocity.y = Math.sin(angle) * 3;
                } else if (Math.random() < this.movementChangeFrequency / 100) {
                    this.velocity.x = (Math.random() - 0.5) * this.maxSpeed * 2;
                    this.velocity.y = (Math.random() - 0.5) * this.maxSpeed * 2;
                }
            } else if (Math.random() < this.movementChangeFrequency / 100) {
                this.velocity.x = (Math.random() - 0.5) * this.maxSpeed * 2;
                this.velocity.y = (Math.random() - 0.5) * this.maxSpeed * 2;
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

        // Solo ajusta la dirección de la cara si no está en un cardumen (el cardumen maneja la dirección de sus miembros).
        if (this.velocity.x < 0) {
            this.facingDirection = -1;
        } else if (this.velocity.x > 0) {
            this.facingDirection = 1;
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

        this.schoolingRadius = 100;
        this.separationDistance = 30 + (creatureTypeData.schoolingSeparation || 0) * 20;
        this.cohesionWeight = 0.1;
        this.alignmentWeight = 0.3;
        this.separationWeight = 0.2;
        this.boundaryWeight = 0.5;
        this.fleeWeight = 2.0;

        this.normalMaxSpeed = 0.5; // Calmer speed
        this.fleeSpeed = 6.0; // Faster flee
        this.reuniteSpeed = 3.0; // Faster reunite

        this.isFleeing = false;
        this.reuniting = false;
        this.fleeingTimeout = null;
        this.fleeRadius = 300; // Larger radius to get scared
        this.reuniteDelay = 2500; // Longer delay to regroup
        this.canvas = canvas;

        const centerX = Math.random() * canvas.width;
        const centerY = Math.random() * (worldMaxY - worldMinY) + worldMinY;
        for (let i = 0; i < numMembers; i++) {
            const creature = new Creature(
                creatureTypeData,
                worldMinY,
                worldMaxY,
                canvas
            );
            creature.x = centerX + (Math.random() - 0.5) * 100;
            creature.y = centerY + (Math.random() - 0.5) * 100;
            creature.isSchooling = true;
            creature.maxSpeed = this.normalMaxSpeed; // Establece la velocidad máxima inicial.
            creature.maxForce = 0.05; // Fuerza máxima para una criatura individual.
            this.members.push(creature);
        }
        this.leader = this.members[0];
    }

    /**
     * Actualiza el comportamiento de cardumen de todos los miembros.
     * @param {number} currentTime - Tiempo actual del juego.
     * @param {Submarine} submarine - Instancia del submarino para interacción.
     */
    update(currentTime, submarine) {
        const isCollidingWithLeader =
            submarine.x < this.leader.x + this.leader.width &&
            submarine.x + submarine.width > this.leader.x &&
            submarine.y < this.leader.y + this.leader.height &&
            submarine.y + submarine.height > this.leader.y;

        if (this.creatureTypeData.flees) {
            if (isCollidingWithLeader && !this.isFleeing) {
                this.isFleeing = true;
                this.reuniting = false;
                if (this.fleeingTimeout) {
                    clearTimeout(this.fleeingTimeout);
                    this.fleeingTimeout = null;
                }

                // Make the leader dash away
                const angle = Math.atan2(
                    this.leader.y + this.leader.height / 2 - (submarine.y + submarine.height / 2),
                    this.leader.x + this.leader.width / 2 - (submarine.x + submarine.width / 2)
                );
                this.leader.velocity.x = Math.cos(angle) * this.fleeSpeed * 1.5;
                this.leader.velocity.y = Math.sin(angle) * this.fleeSpeed * 1.5;

            } else if (this.isFleeing && !isCollidingWithLeader && !this.fleeingTimeout) {
                this.fleeingTimeout = setTimeout(() => {
                    this.isFleeing = false;
                    this.fleeingTimeout = null;
                    this.reuniting = true;
                    setTimeout(() => this.reuniting = false, 3000);
                }, this.reuniteDelay);
            }
        }

        // Calcula la velocidad promedio para la dirección de la cara del cardumen si no está huyendo.
        let totalVelocityX = 0;
        if (!this.isFleeing && !this.reuniting) {
            this.members.forEach(member => {
                totalVelocityX += member.velocity.x;
            });
        }
        const schoolFacingDirection = totalVelocityX >= 0 ? 1 : -1;

        if (!this.isFleeing) {
            // Leader's independent movement
            this.leader.velocity.x += (Math.random() - 0.5) * 0.1;
            this.leader.velocity.y += (Math.random() - 0.5) * 0.1;

            const mag = Math.sqrt(this.leader.velocity.x ** 2 + this.leader.velocity.y ** 2);
            if (mag > this.normalMaxSpeed) {
                this.leader.velocity.x = (this.leader.velocity.x / mag) * this.normalMaxSpeed;
                this.leader.velocity.y = (this.leader.velocity.y / mag) * this.normalMaxSpeed;
            }

            this.leader.x += this.leader.velocity.x;
            this.leader.y += this.leader.velocity.y;

            // Boundary check for the leader
            if (this.leader.x < 0 || this.leader.x > this.canvas.width - this.leader.width) {
                this.leader.velocity.x *= -1;
            }
            if (this.leader.y < this.worldMinY || this.leader.y > this.worldMaxY - this.leader.height) {
                this.leader.velocity.y *= -1;
            }
        }


        this.members.forEach(member => {
            let separation = { x: 0, y: 0 };
            let alignment = { x: 0, y: 0 };
            let cohesion = { x: 0, y: 0 };
            let count = 0;

            // Fuerza de huida del submarino para un miembro individual.
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
                    const fleeMagnitude = 1 - (distToSub / this.fleeRadius); // Más fuerte cuanto más cerca del submarino.
                    fleeForce.x = Math.cos(angle) * fleeMagnitude * 2; // Fuerza de huida más fuerte.
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
            const turnFactor = 1.5;

            if (member.x < margin) {
                boundaryAvoidance.x = turnFactor;
            } else if (member.x > this.canvas.width - margin - member.width) {
                boundaryAvoidance.x = -turnFactor;
            }

            if (member.y < this.worldMinY + margin) {
                boundaryAvoidance.y = turnFactor;
            } else if (member.y > this.worldMaxY - margin - member.height) {
                boundaryAvoidance.y = -turnFactor;
            }

            // Agrega una pequeña fuerza aleatoria para un movimiento más natural.
            const randomForceMagnitude = 0.005; // Pequeña fuerza aleatoria.
            let randomForceX = (Math.random() - 0.5) * randomForceMagnitude;
            let randomForceY = (Math.random() - 0.5) * randomForceMagnitude;

            // Ajusta los pesos y la velocidad máxima según el estado.
            let currentCohesionWeight = this.cohesionWeight;
            let currentAlignmentWeight = this.alignmentWeight;
            let currentSeparationWeight = this.separationWeight;
            let currentMaxSpeed = this.normalMaxSpeed;

            if (this.isFleeing) {
                currentCohesionWeight = 0;
                currentAlignmentWeight = 0;
                currentSeparationWeight = this.separationWeight * 4;
                currentMaxSpeed = this.fleeSpeed;
            } else if (this.reuniting) {
                if (member !== this.leader) {
                    cohesion.x = this.leader.x - member.x;
                    cohesion.y = this.leader.y - member.y;
                }
                currentCohesionWeight = this.cohesionWeight * 5;
                currentAlignmentWeight = this.alignmentWeight * 2;
                currentSeparationWeight = this.separationWeight * 0.5;
                currentMaxSpeed = this.reuniteSpeed;
            }

            const wanderForce = {
                x: Math.cos(member.wanderAngle) * 0.05,
                y: Math.sin(member.wanderAngle) * 0.05
            };
            member.wanderAngle += (Math.random() - 0.5) * 0.2;

            let forceX = separation.x * currentSeparationWeight +
                alignment.x * currentAlignmentWeight +
                cohesion.x * currentCohesionWeight +
                boundaryAvoidance.x * this.boundaryWeight +
                fleeForce.x * this.fleeWeight +
                wanderForce.x;

            let forceY = separation.y * currentSeparationWeight +
                alignment.y * currentAlignmentWeight +
                cohesion.y * currentCohesionWeight +
                boundaryAvoidance.y * this.boundaryWeight +
                fleeForce.y * this.fleeWeight +
                wanderForce.y;

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

            if (member.x <= 0 || member.x >= this.canvas.width - member.width) {
                member.velocity.x *= -1;
            }
            if (member.y <= this.worldMinY || member.y >= this.worldMaxY - member.height) {
                member.velocity.y *= -1;
            }

            member.y = Math.max(this.worldMinY, Math.min(member.y, this.worldMaxY - member.height));
            member.x = Math.max(0, Math.min(member.x, this.canvas.width - member.width));


            member.update(currentTime); // Actualización propia de la criatura para escalar/luz.
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
