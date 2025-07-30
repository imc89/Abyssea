import React, { useRef, useEffect } from 'react';

const Radar = ({ isActive, hasDetection }) => {
    const radarCanvasRef = useRef(null);

    useEffect(() => {
        const radarCanvas = radarCanvasRef.current;
        const radarCtx = radarCanvas.getContext('2d');
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

        const animationFrameId = requestAnimationFrame(updateRadarDisplay);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActive, hasDetection]);

    return (
        <div id="radarDisplay" className={isActive ? 'active' : 'inactive'}>
            <canvas ref={radarCanvasRef}></canvas>
        </div>
    );
};

export default Radar;
