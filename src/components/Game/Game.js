import React, { useRef, useEffect, useState } from 'react';
import { Ocean, Submarine, Particle, Bubble, ObjectPool, Creature, School } from '../../game/game';
import { lerp, showZoneMessage, isPointInTriangle, throttle, preloadImages } from '../../utils/utils';
import {
    PIXELS_PER_METER, MAX_WORLD_DEPTH, SPOTLIGHT_MAX_BATTERY, SPOTLIGHT_DRAIN_RATE,
    SPOTLIGHT_CHARGE_RATE, AMBIENT_LIGHT_RADIUS, AMBIENT_LIGHT_MAX_OPACITY, SUBMARINE_IMAGE_URL,
    ZONE_COLORS, creatureData
} from '../../game/constants';

const Game = ({ onCreatureDiscovery, onGamePause, onShowCreatureModal }) => {
    const canvasRef = useRef(null);
    const gameContainerRef = useRef(null);
    const gameAreaWrapperRef = useRef(null);
    const creaturesContainerRef = useRef(null);
    const submarineElementRef = useRef(null);
    const submarineImageElementRef = useRef(null);
    const radarCanvasRef = useRef(null);
    const [isGameInitialized, setIsGameInitialized] = useState(false);

    useEffect(() => {
        const imageUrlsToPreload = creatureData.map(c => c.imageSrc);
        imageUrlsToPreload.push(SUBMARINE_IMAGE_URL);
        preloadImages(imageUrlsToPreload, {}).then(() => {
            setIsGameInitialized(true);
        });
    }, []);

    useEffect(() => {
        if (!isGameInitialized) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const gameContainer = gameContainerRef.current;
        const gameAreaWrapper = gameAreaWrapperRef.current;
        const creaturesContainer = creaturesContainerRef.current;
        const submarineElement = submarineElementRef.current;
        const submarineImageElement = submarineImageElementRef.current;
        const radarCanvas = radarCanvasRef.current;
        const radarCtx = radarCanvas.getContext('2d');

        let animationFrameId;
        let cameraY = 0;
        let lastDisplayedZoneName = "";

        const gameState = {
            currentScreen: 'game',
            gamePaused: false,
            discoveredCreatures: {},
            userId: null,
            db: null,
            auth: null,
            appId: null,
        };

        const preloadedImages = {};

        const ocean = new Ocean();
        const bubblePool = new ObjectPool(Bubble, 200);
        const particlePool = new ObjectPool(Particle, 5000);
        let submarine;

        const creatureSchools = {};
        const individualCreatures = [];

        function initializeCreatures() {
            Object.values(creatureSchools).forEach(school => {
                if (school && typeof school.removeElements === 'function') {
                    school.removeElements();
                }
            });
            for (const key in creatureSchools) {
                if (creatureSchools.hasOwnProperty(key)) {
                    delete creatureSchools[key];
                }
            }

            individualCreatures.forEach(creature => creature.removeElement());
            individualCreatures.length = 0;

            const numEpipelagicCreatures = 15;
            const creatureWorldMinYEpipelagic = ocean.height + 50;
            const epipelagicZone = ZONE_COLORS.find(z => z.name.includes("Epipelágica"));
            const creatureWorldMaxYEpipelagic = epipelagicZone.depth + (200 * PIXELS_PER_METER) - 50;
            const epipelagicCreatureData = creatureData.find(c => c.id === 'pezLinterna');
            if (epipelagicCreatureData) {
                creatureSchools.epipelagic = new School(epipelagicCreatureData, creatureWorldMinYEpipelagic, creatureWorldMaxYEpipelagic, numEpipelagicCreatures, canvas);
            }

            const numMesopelagicSquidCreatures = 5;
            const numMesopelagicGhostFish = 8;
            const mesopelagicZoneStart = ZONE_COLORS.find(z => z.name.includes("Mesopelágica") && z.depth === 200 * PIXELS_PER_METER);
            const bathypelagicZoneStart = ZONE_COLORS.find(z => z.name.includes("Batipelágica"));
            const mesopelagicCreatureWorldMinY = mesopelagicZoneStart.depth + 50;
            const mesopelagicCreatureWorldMaxY = bathypelagicZoneStart.depth - 50;

            const squidCreatureData = creatureData.find(c => c.id === 'calamarMesopelagico');
            if (squidCreatureData) {
                for (let i = 0; i < numMesopelagicSquidCreatures; i++) {
                    individualCreatures.push(new Creature(squidCreatureData, mesopelagicCreatureWorldMinY, mesopelagicCreatureWorldMaxY, canvas));
                }
            }
            const ghostCreatureData = creatureData.find(c => c.id === 'pezFantasma');
            if (ghostCreatureData) {
                for (let i = 0; i < numMesopelagicGhostFish; i++) {
                    individualCreatures.push(new Creature(ghostCreatureData, mesopelagicCreatureWorldMinY, mesopelagicCreatureWorldMaxY, canvas));
                }
            }

            const numBatipelagicGhostFish = 12;
            const abyssopelagicZoneStart = ZONE_COLORS.find(z => z.name.includes("Abisopelágica"));
            const batipelagicCreatureWorldMinY = bathypelagicZoneStart.depth + 50;
            const batipelagicCreatureWorldMaxY = abyssopelagicZoneStart.depth - 50;

            if (ghostCreatureData) {
                for (let i = 0; i < numBatipelagicGhostFish; i++) {
                    individualCreatures.push(new Creature(ghostCreatureData, batipelagicCreatureWorldMinY, batipelagicCreatureWorldMaxY, canvas));
                }
            }
        }

        const keys = {};

        function resetMovementKeys() {
            keys['arrowleft'] = false;
            keys['a'] = false;
            keys['arrowright'] = false;
            keys['d'] = false;
            keys['arrowup'] = false;
            keys['w'] = false;
            keys['arrowdown'] = false;
            keys['s'] = false;
        }

        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();

            if (key === ' ' || key === 'enter') {
                e.preventDefault();
            }

            keys[key] = true;

            if ((key === ' ' || key === 'spacebar') && !e.repeat && gameState.currentScreen === 'game') {
                submarine.isSpotlightOn = !submarine.isSpotlightOn;
            }

            if (key === 'enter' && !e.repeat) {
                if (gameState.currentScreen === 'game') {
                    handleEnterPress();
                }
            }

            if (key === 'escape') {
                onGamePause();
            }
        };

        const handleKeyUp = (e) => {
            keys[e.key.toLowerCase()] = false;
        };

        function handleInput() {
            submarine.horizontalDirection = 0;
            submarine.verticalDirection = 0;
            if (keys['arrowleft'] || keys['a']) { submarine.horizontalDirection = -1; }
            if (keys['arrowright'] || keys['d']) { submarine.horizontalDirection = 1; }
            if (keys['arrowup'] || keys['w']) { submarine.verticalDirection = -1; }
            else if (keys['arrowdown'] || keys['s']) { submarine.verticalDirection = 1; }
            else { submarine.verticalDirection = 0; }
        }

        function getCreaturesInLight() {
            const creaturesInLight = [];
            const lightLength = 200;
            const lightWidthAtEnd = 80;
            const visibleSubY = submarine.y - cameraY;
            const lightSourceX = submarine.x + (submarine.facingDirection === 1 ? submarine.width * 0.8 : submarine.width * 0.2);
            const lightSourceY = visibleSubY + submarine.height * 0.6;

            const spotlightP1X = lightSourceX;
            const spotlightP1Y = lightSourceY;
            const spotlightP2X = lightSourceX + (submarine.facingDirection === 1 ? lightLength : -lightLength);
            const spotlightP2Y = lightSourceY - lightWidthAtEnd / 2;
            const spotlightP3X = lightSourceX + (submarine.facingDirection === 1 ? lightLength : -lightLength);
            const spotlightP3Y = lightSourceY + lightWidthAtEnd / 2;

            const subCenterX = submarine.x + submarine.width / 2;
            const subCenterY = submarine.y + submarine.height / 2;

            const allCreatures = [
                ...(creatureSchools.epipelagic ? creatureSchools.epipelagic.members : []),
                ...individualCreatures
            ];

            for (const creature of allCreatures) {
                const creatureCenterX = creature.x + creature.width / 2;
                const creatureCenterY = creature.y + creature.height / 2;

                const isInSpotlight = submarine.isSpotlightOn && isPointInTriangle(creatureCenterX, creatureCenterY - cameraY, spotlightP1X, spotlightP1Y, spotlightP2X, spotlightP2Y, spotlightP3X, spotlightP3Y);

                const distToSubCenterSq = (creatureCenterX - subCenterX) ** 2 + (creatureCenterY - subCenterY) ** 2;
                const isInAmbientLight = distToSubCenterSq <= (AMBIENT_LIGHT_RADIUS * 1.2) ** 2;

                if (isInSpotlight || isInAmbientLight) {
                    creaturesInLight.push(creature);
                }
            }
            return creaturesInLight;
        }

        function handleEnterPress() {
            if (!submarine.isSpotlightOn) {
                return;
            }

            const creatures = getCreaturesInLight();
            if (creatures.length > 0) {
                const foundCreature = creatures[0];
                onShowCreatureModal(foundCreature);
                onCreatureDiscovery(foundCreature.id, performance.now());
            }
        }

        let spotlightFlickerFactor = 1.0;
        const SPOTLIGHT_FLICKER_SPEED = 0.05;
        const SPOTLIGHT_FLICKER_AMOUNT = 0.05;

        function gameLoop(currentTime) {
            if (gameState.currentScreen !== 'game') {
                return;
            }

            let currentZone = ZONE_COLORS[0];
            let nextZone = ZONE_COLORS[0];
            let zoneIndex = 0;
            for (let i = 0; i < ZONE_COLORS.length; i++) {
                if (cameraY >= ZONE_COLORS[i].depth) {
                    currentZone = ZONE_COLORS[i];
                    zoneIndex = i;
                }
            }
            if (zoneIndex + 1 < ZONE_COLORS.length) {
                nextZone = ZONE_COLORS[zoneIndex + 1];
            } else {
                nextZone = currentZone;
            }

            let interpolationFactor = 0;
            if (nextZone.depth !== currentZone.depth) {
                interpolationFactor = (cameraY - currentZone.depth) / (nextZone.depth - currentZone.depth);
                interpolationFactor = Math.min(1, Math.max(0, interpolationFactor));
            } else if (cameraY >= currentZone.depth && currentZone.depth === ZONE_COLORS[ZONE_COLORS.length - 1].depth) {
                interpolationFactor = 1;
            }
            const interpolatedDarknessLevel = lerp(currentZone.darknessLevel, nextZone.darknessLevel, interpolationFactor);

            const currentOceanR = lerp(currentZone.r, nextZone.r, interpolationFactor);
            const currentOceanG = lerp(currentZone.g, nextZone.g, interpolationFactor);
            const currentOceanB = lerp(currentZone.b, nextZone.b, interpolationFactor);
            ctx.fillStyle = `rgb(${Math.round(currentOceanR)}, ${Math.round(currentOceanG)}, ${Math.round(currentOceanB)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            const gradientOpacity = 0.3 * (1 - interpolatedDarknessLevel);
            gradient.addColorStop(0, `rgba(173, 216, 230, ${gradientOpacity})`);
            gradient.addColorStop(0.5, `rgba(26, 58, 94, ${gradientOpacity * 0.3})`);
            gradient.addColorStop(1, `rgba(26, 58, 94, 0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            handleInput();
            ocean.update();
            cameraY = submarine.update(currentTime, canvas, cameraY);

            const creaturesInLight = submarine.isSpotlightOn ? getCreaturesInLight() : [];

            if (creatureSchools.epipelagic) {
                creatureSchools.epipelagic.update(currentTime, submarine);
                creatureSchools.epipelagic.draw(cameraY, interpolatedDarknessLevel, submarine.isSpotlightOn, creaturesInLight);
            }
            individualCreatures.forEach(creature => {
                creature.update(currentTime);
                creature.draw(cameraY, interpolatedDarknessLevel, submarine.isSpotlightOn, creaturesInLight);
            });

            ocean.draw(ctx, cameraY);

            particlePool.forEachActive(p => {
                p.update(MAX_WORLD_DEPTH, ocean.height, submarine, canvas);
                p.draw(ctx, cameraY, interpolatedDarknessLevel, false);
            });

            bubblePool.forEachActive(bubble => {
                bubble.update();
                bubble.draw(ctx, cameraY, interpolatedDarknessLevel, submarine.isSpotlightOn);
            });

            const finalDarknessOverlayOpacity = interpolatedDarknessLevel;
            if (finalDarknessOverlayOpacity > 0) {
                ctx.fillStyle = `rgba(0, 0, 0, ${finalDarknessOverlayOpacity})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            if (submarine.isSpotlightOn && interpolatedDarknessLevel > 0.1) {
                const visibleY = submarine.y - cameraY;
                const centerX = submarine.x + submarine.width / 2;
                const centerY = visibleY + submarine.height / 2;
                const ambientGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, AMBIENT_LIGHT_RADIUS);
                ambientGradient.addColorStop(0, `rgba(255, 255, 200, ${interpolatedDarknessLevel * AMBIENT_LIGHT_MAX_OPACITY})`);
                ambientGradient.addColorStop(0.7, `rgba(255, 255, 200, ${interpolatedDarknessLevel * AMBIENT_LIGHT_MAX_OPACITY * 0.7})`);
                ambientGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
                ctx.fillStyle = ambientGradient;
                ctx.beginPath();
                ctx.arc(centerX, centerY, AMBIENT_LIGHT_RADIUS, 0, Math.PI * 2);
                ctx.fill();
            }

            if (submarine.isSpotlightOn && submarine.batteryLevel > 0) {
                const visibleY = submarine.y - cameraY;
                const lightSourceX = submarine.x + (submarine.facingDirection === 1 ? submarine.width * 0.8 : submarine.width * 0.2);
                const lightSourceY = visibleY + submarine.height * 0.6;
                const lightLength = 200;
                const lightWidthAtEnd = 80;

                spotlightFlickerFactor = 1.0 + Math.sin(currentTime * SPOTLIGHT_FLICKER_SPEED) * SPOTLIGHT_FLICKER_AMOUNT;
                spotlightFlickerFactor = Math.max(0.9, Math.min(1.1, spotlightFlickerFactor));

                const p1x = lightSourceX;
                const p1y = lightSourceY;
                const p2x = lightSourceX + (submarine.facingDirection === 1 ? lightLength : -lightLength);
                const p2y = lightSourceY - lightWidthAtEnd / 2;
                const p3x = lightSourceX + (submarine.facingDirection === 1 ? lightLength : -lightLength);
                const p3y = lightSourceY + lightWidthAtEnd / 2;

                const spotlightGradient = ctx.createRadialGradient(
                    p1x, p1y, 0,
                    p1x, p1y, lightLength
                );

                spotlightGradient.addColorStop(0, `rgba(200, 220, 255, ${0.5 * spotlightFlickerFactor})`);
                spotlightGradient.addColorStop(0.7, `rgba(150, 180, 255, ${0.2 * spotlightFlickerFactor})`);
                spotlightGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

                ctx.fillStyle = spotlightGradient;
                ctx.beginPath();
                ctx.moveTo(p1x, p1y);
                ctx.lineTo(p2x, p2y);
                ctx.lineTo(p3x, p3y);
                ctx.closePath();
                ctx.fill();
            }

            const allCreatures = [
                ...(creatureSchools.epipelagic ? creatureSchools.epipelagic.members : []),
                ...individualCreatures
            ];
            for (const creature of allCreatures) {
                if (creature.hasLight) {
                    const creatureCenterX = creature.x + creature.width / 2;
                    const creatureCenterY = creature.y + creature.height / 2 - cameraY + creature.lightOffsetY;
                    const lightRadius = creature.lightRadius;
                    const lightColor = creature.lightColor;

                    const currentLightOpacity = creature.lightOpacity;
                    const finalLightColor = lightColor.replace(/[^,]+(?=\))/, currentLightOpacity.toFixed(2));

                    const creatureLightGradient = ctx.createRadialGradient(creatureCenterX, creatureCenterY, 0, creatureCenterX, creatureCenterY, lightRadius);
                    creatureLightGradient.addColorStop(0, finalLightColor);
                    creatureLightGradient.addColorStop(1, finalLightColor.replace(/[^,]+(?=\))/, '0'));

                    ctx.fillStyle = creatureLightGradient;
                    ctx.beginPath();
                    ctx.arc(creatureCenterX, creatureCenterY, lightRadius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.restore();

            submarine.draw(cameraY, interpolatedDarknessLevel, submarine.isSpotlightOn);

            drawScanlineEffect(ctx);

            const currentDepthMeters = Math.max(0, Math.floor(cameraY / PIXELS_PER_METER));
            document.getElementById('depthCounter').textContent = `Profundidad: ${currentDepthMeters} m`;
            const batteryPercentage = Math.floor((submarine.batteryLevel / SPOTLIGHT_MAX_BATTERY) * 100);
            document.getElementById('batteryDisplay').textContent = `Batería: ${batteryPercentage}%`;

            if (batteryPercentage < 20) {
                document.getElementById('batteryDisplay').style.color = '#ff0000';
                document.getElementById('batteryDisplay').style.borderColor = '#ff0000';
                document.getElementById('batteryDisplay').style.boxShadow = '0 0 5px #ff0000, inset 0 0 5px #ff0000';
                document.getElementById('batteryDisplay').classList.add('low-battery');
            } else if (batteryPercentage < 50) {
                document.getElementById('batteryDisplay').style.color = '#ffff00';
                document.getElementById('batteryDisplay').style.borderColor = '#ffff00';
                document.getElementById('batteryDisplay').style.boxShadow = '0 0 5px #ffff00, inset 0 0 5px #ffff00';
                document.getElementById('batteryDisplay').classList.remove('low-battery');
            } else {
                document.getElementById('batteryDisplay').style.color = '#00ffff';
                document.getElementById('batteryDisplay').style.borderColor = '#00ffff';
                document.getElementById('batteryDisplay').style.boxShadow = '0 0 5px #00ffff, inset 0 0 5px #00ffff';
                document.getElementById('batteryDisplay').classList.remove('low-battery');
            }

            let currentZoneName = "Zona Desconocida";
            for (let i = ZONE_COLORS.length - 1; i >= 0; i--) {
                if (cameraY >= ZONE_COLORS[i].depth) {
                    currentZoneName = ZONE_COLORS[i].name;
                    break;
                }
            }
            if (currentZoneName !== lastDisplayedZoneName) {
                showZoneMessage(currentZoneName, gameContainer);
                lastDisplayedZoneName = currentZoneName;
            }

            updateRadarDisplay();

            updateGameAreaWrapperGlow(interpolatedDarknessLevel);

            animationFrameId = requestAnimationFrame(gameLoop);
        }

        function drawScanlineEffect(ctx) {
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;

            for (let y = 0; y < canvas.height; y += 2) {
                ctx.beginPath();
                ctx.moveTo(0, y + 0.5);
                ctx.lineTo(canvas.width, y + 0.5);
                ctx.stroke();
            }
            ctx.restore();
        }

        function updateGameAreaWrapperGlow(darknessLevel) {
            const baseColor = [0, 255, 255];
            const dimmedColor = [0, 100, 150];
            const t = darknessLevel;

            const r = Math.round(lerp(baseColor[0], dimmedColor[0], t));
            const g = Math.round(lerp(baseColor[1], dimmedColor[1], t));
            const b = Math.round(lerp(baseColor[2], dimmedColor[2], t));

            const borderColor = `rgb(${r}, ${g}, ${b})`;
            const shadowOpacity = lerp(0.5, 0.1, t);
            const shadowSpread = lerp(20, 5, t);
            const shadowBlur = lerp(20, 5, t);

            gameAreaWrapper.style.borderColor = borderColor;
            gameAreaWrapper.style.boxShadow = `0 0 ${shadowBlur}px rgba(${r}, ${g}, ${b}, ${shadowOpacity}), inset 0 0 ${shadowSpread / 2}px rgba(${r}, ${g}, ${b}, ${shadowOpacity * 0.5})`;
        }

        const throttledResizeCanvas = throttle(function () {
            gameAreaWrapper.style.width = `${window.innerWidth * 0.8}px`;
            gameAreaWrapper.style.height = `${window.innerHeight * 0.8}px`;
            canvas.width = window.innerWidth * 0.8;
            canvas.height = window.innerHeight * 0.8;

            if (canvas.width > 1200) canvas.width = 1200;
            if (canvas.height > 800) canvas.height = 800;

            gameAreaWrapper.style.width = `${canvas.width}px`;
            gameAreaWrapper.style.height = `${canvas.height}px`;

            radarCanvas.width = document.getElementById('radarDisplay').offsetWidth;
            radarCanvas.height = document.getElementById('radarDisplay').offsetHeight;

            const visibleSubY = submarine.y - cameraY;
            const deadZoneTop = canvas.height * 0.3;
            const deadZoneBottom = canvas.height * 0.7;

            if (visibleSubY < deadZoneTop) { cameraY = Math.max(0, submarine.y - deadZoneTop); }
            else if (visibleSubY + submarine.height > deadZoneBottom) { cameraY = Math.min(MAX_WORLD_DEPTH - canvas.height, cameraY + (visibleSubY + submarine.height - deadZoneBottom)); }
            cameraY = Math.max(0, Math.min(cameraY, MAX_WORLD_DEPTH - canvas.height));

            submarine.x = canvas.width / 2 - submarine.width / 2;

            initializeCreatures();

            particlePool.pool.forEach(p => p.active = false);
            const numMotes = 4000;
            const numDebris = 1000;
            for (let i = 0; i < numMotes; i++) {
                const p = particlePool.get();
                p.init(Math.random() * canvas.width, Math.random() * (MAX_WORLD_DEPTH - (ocean.height + 30)) + (ocean.height + 30), (Math.random() * 0.6 - 0.3) + (Math.sin(p.y * 0.01) * 0.1), (Math.random() * 0.3 - 0.15) - 0.05, Math.random() * 1.5 + 0.8, Math.random() * 0.4 + 0.3, 0, 'mote');
            }
            for (let i = 0; i < numDebris; i++) {
                const p = particlePool.get();
                p.init(Math.random() * canvas.width, Math.random() * (MAX_WORLD_DEPTH - (ocean.height + 30)) + (ocean.height + 30), (Math.random() * 0.8 - 0.4) + (Math.cos(p.y * 0.005) * 0.2), (Math.random() * 0.5 - 0.25) - 0.1, Math.random() * 3 + 1.5, Math.random() * 0.3 + 0.1, 0, 'debris');
            }
        }, 100);

        let radarRotationAngle = 0;
        let detectedDotPosition = { x: null, y: null };

        function drawRadar(isActive, hasDetection, dotX, dotY) {
            const size = radarCanvas.width;
            const center = size / 2;
            const radius = size / 2 - 5;

            if (radius <= 0 || size <= 0) {
                return;
            }

            radarCtx.clearRect(0, 0, size, size);

            const lineColor = isActive ? '#0f0' : '#555';

            radarCtx.strokeStyle = lineColor;
            radarCtx.lineWidth = 1;
            for (let i = 1; i <= 3; i++) {
                radarCtx.beginPath();
                radarCtx.arc(center, center, radius * (i / 3), 0, Math.PI * 2);
                radarCtx.stroke();
            }

            radarCtx.beginPath();
            radarCtx.moveTo(center, 0);
            radarCtx.lineTo(center, size);
            radarCtx.stroke();
            radarCtx.beginPath();
            radarCtx.moveTo(0, center);
            radarCtx.lineTo(size, center);
            radarCtx.stroke();

            radarCtx.beginPath();
            radarCtx.moveTo(center - radius, center - radius);
            radarCtx.lineTo(center + radius, center + radius);
            radarCtx.stroke();

            radarCtx.beginPath();
            radarCtx.moveTo(center + radius, center - radius);
            radarCtx.lineTo(center - radius, center + radius);
            radarCtx.stroke();


            if (isActive) {
                radarCtx.save();
                radarCtx.translate(center, center);
                radarCtx.rotate(radarRotationAngle);

                const spinnerGradient = radarCtx.createLinearGradient(0, 0, radius, 0);
                spinnerGradient.addColorStop(0, 'rgba(0, 255, 0, 0.7)');
                spinnerGradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

                radarCtx.fillStyle = spinnerGradient;
                radarCtx.beginPath();
                radarCtx.moveTo(0, 0);
                radarCtx.lineTo(radius * Math.cos(Math.PI / 6), -radius * Math.sin(Math.PI / 6));
                radarCtx.lineTo(radius * Math.cos(-Math.PI / 6), -radius * Math.sin(-Math.PI / 6));
                radarCtx.closePath();
                radarCtx.fill();

                radarCtx.restore();

                radarRotationAngle += 0.05;
                if (radarRotationAngle >= Math.PI * 2) {
                    radarRotationAngle -= Math.PI * 2;
                }
            } else {
                radarRotationAngle = 0;
            }

            if (hasDetection && dotX !== null && dotY !== null) {
                radarCtx.fillStyle = '#0f0';
                radarCtx.beginPath();
                radarCtx.arc(dotX, dotY, 4, 0, Math.PI * 2);
                radarCtx.fill();
            }
        }

        function updateRadarDisplay() {
            const isActive = submarine.isSpotlightOn;
            const creaturesFound = getCreaturesInLight();
            const hasDetection = creaturesFound.length > 0;

            if (isActive && hasDetection && detectedDotPosition.x === null) {
                const radarSize = radarCanvas.width;
                const dotMargin = 10;
                detectedDotPosition.x = dotMargin + Math.random() * (radarSize - 2 * dotMargin);
                detectedDotPosition.y = dotMargin + Math.random() * (radarSize - 2 * dotMargin);
            }
            else if (!isActive || !hasDetection) {
                detectedDotPosition.x = null;
                detectedDotPosition.y = null;
            }

            drawRadar(isActive, hasDetection, detectedDotPosition.x, detectedDotPosition.y);
        }

        submarine = new Submarine(ocean, preloadedImages, bubblePool, SUBMARINE_IMAGE_URL, SPOTLIGHT_MAX_BATTERY, SPOTLIGHT_DRAIN_RATE, SPOTLIGHT_CHARGE_RATE, MAX_WORLD_DEPTH);
        throttledResizeCanvas();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('resize', throttledResizeCanvas);
        gameLoop();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('resize', throttledResizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isGameInitialized, onCreatureDiscovery, onGamePause, onShowCreatureModal]);

    return (
        <div className="game-container" ref={gameContainerRef}>
            <div className="game-area-wrapper" ref={gameAreaWrapperRef}>
                <canvas id="gameCanvas" ref={canvasRef}></canvas>
                <div id="creaturesContainer" ref={creaturesContainerRef}></div>
                <div id="submarineElement" ref={submarineElementRef}>
                    <img src="" alt="Submarino" ref={submarineImageElementRef} />
                </div>
            </div>
            <div id="depthCounter">Profundidad: 0 m</div>
            <div id="radarDisplay">
                <canvas id="radarCanvas" ref={radarCanvasRef}></canvas>
            </div>
            <div id="batteryDisplay">Batería: 100%</div>
        </div>
    );
};

export default Game;
