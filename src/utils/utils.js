/**
 * Realiza una interpolación lineal entre dos valores.
 * @param {number} a - Valor inicial.
 * @param {number} b - Valor final.
 * @param {number} t - Factor de interpolación (entre 0 y 1).
 * @returns {number} El valor interpolado.
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Muestra un mensaje temporal de cambio de zona.
 * @param {string} zoneName - El nombre de la zona a mostrar.
 */
export function showZoneMessage(zoneName, gameContainer) {
    let currentZoneMessageElement = null;
    if (currentZoneMessageElement) {
        currentZoneMessageElement.remove();
        currentZoneMessageElement = null;
    }
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('zone-message');
    messageDiv.textContent = zoneName;
    gameContainer.appendChild(messageDiv);
    currentZoneMessageElement = messageDiv;
    void messageDiv.offsetWidth;
    messageDiv.classList.add('show');
    setTimeout(() => {
        messageDiv.classList.remove('show');
        messageDiv.addEventListener('transitionend', () => {
            if (messageDiv === currentZoneMessageElement) {
                messageDiv.remove();
                currentZoneMessageElement = null;
            }
        }, { once: true });
    }, 3000);
}

/**
 * Calcula el signo de la orientación de un punto con respecto a una línea.
 * @param {number} p1x - Coordenada X del punto 1.
 * @param {number} p1y - Coordenada Y del punto 1.
 * @param {number} p2x - Coordenada X del punto 2.
 * @param {number} p2y - Coordenada Y del punto 2.
 * @param {number} p3x - Coordenada X del punto 3.
 * @param {number} p3y - Coordenada Y del punto 3.
 * @returns {number} El signo del resultado del producto cruzado.
 */
export function sign(p1x, p1y, p2x, p2y, p3x, p3y) {
    return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
}

/**
 * Comprueba si un punto está dentro de un triángulo.
 * @param {number} px - Coordenada X del punto.
 * @param {number} py - Coordenada Y del punto.
 * @param {number} ax - Coordenada X del vértice A del triángulo.
 * @param {number} ay - Coordenada Y del vértice A del triángulo.
 * @param {number} bx - Coordenada X del vértice B del triángulo.
 * @param {number} by - Coordenada Y del vértice B del triángulo.
 * @param {number} cx - Coordenada X del vértice C del triángulo.
 * @param {number} cy - Coordenada Y del vértice C del triángulo.
 * @returns {boolean} Verdadero si el punto está dentro del triángulo, falso en caso contrario.
 */
export function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
    const s1 = sign(px, py, ax, ay, bx, by);
    const s2 = sign(px, py, bx, by, cx, cy);
    const s3 = sign(px, py, cx, cy, ax, ay);
    const hasNeg = (s1 < 0) || (s2 < 0) || (s3 < 0);
    const hasPos = (s1 > 0) || (s2 > 0) || (s3 > 0);
    return !(hasNeg && hasPos);
}

/**
 * Función de throttling para limitar la frecuencia de ejecución de una función.
 * @param {Function} func - La función a limitar.
 * @param {number} limit - El tiempo mínimo en milisegundos entre ejecuciones.
 * @returns {Function} La función throttled.
 */
export function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Precarga imágenes para evitar tirones durante el juego.
 * @param {Array<string>} imageUrls - Un array de URLs de imágenes a precargar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando todas las imágenes han sido cargadas.
 */
export function preloadImages(imageUrls, preloadedImages) {
    const promises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                preloadedImages[url] = img;
                resolve();
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${url}`);
                resolve();
            };
        });
    });
    return Promise.all(promises);
}
