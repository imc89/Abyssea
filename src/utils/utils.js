/**
 * Realiza una interpolación lineal entre dos valores.
 * @param {number} a - Valor inicial.
 * @param {number} b - Valor final.
 * @param {number} t - Factor de interpolación (entre 0 y 1).
 * @returns {number} El valor interpolado.
 */
export function lerp(a, b, t) {
    return a + (b - a) * t; // Devuelve el valor interpolado.
}

/**
 * Muestra un mensaje temporal de cambio de zona.
 * @param {string} zoneName - El nombre de la zona a mostrar.
 */
export function showZoneMessage(zoneName, gameContainer) {
    let currentZoneMessageElement = null; // Elemento del mensaje de zona actual.
    // Si ya hay un mensaje de zona, lo elimina.
    if (currentZoneMessageElement) {
        currentZoneMessageElement.remove();
        currentZoneMessageElement = null;
    }
    const messageDiv = document.createElement('div'); // Crea un nuevo elemento div.
    messageDiv.classList.add('zone-message'); // Añade la clase CSS.
    messageDiv.textContent = zoneName; // Establece el texto del mensaje.
    gameContainer.appendChild(messageDiv); // Añade el mensaje al contenedor del juego.
    currentZoneMessageElement = messageDiv; // Establece el elemento del mensaje de zona actual.
    void messageDiv.offsetWidth; // Fuerza el reflow.
    messageDiv.classList.add('show'); // Muestra el mensaje.
    // Oculta el mensaje después de 3 segundos.
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
    return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y); // Devuelve el signo del resultado del producto cruzado.
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
    const s1 = sign(px, py, ax, ay, bx, by); // Calcula el signo del primer lado.
    const s2 = sign(px, py, bx, by, cx, cy); // Calcula el signo del segundo lado.
    const s3 = sign(px, py, cx, cy, ax, ay); // Calcula el signo del tercer lado.
    const hasNeg = (s1 < 0) || (s2 < 0) || (s3 < 0); // Comprueba si hay algún signo negativo.
    const hasPos = (s1 > 0) || (s2 > 0) || (s3 > 0); // Comprueba si hay algún signo positivo.
    return !(hasNeg && hasPos); // Devuelve verdadero si todos los signos son iguales.
}

/**
 * Función de throttling para limitar la frecuencia de ejecución de una función.
 * @param {Function} func - La función a limitar.
 * @param {number} limit - El tiempo mínimo en milisegundos entre ejecuciones.
 * @returns {Function} La función throttled.
 */
export function throttle(func, limit) {
    let inThrottle; // Bandera para saber si la función está en espera.
    return function () {
        const args = arguments; // Argumentos de la función.
        const context = this; // Contexto de la función.
        // Si no está en espera, ejecuta la función.
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
export function preloadImages(imageUrls) {
    const preloadedImages = {};
    const promises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                preloadedImages[url] = img;
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${url}`);
                // Resolve even on error to not break the Promise.all
                resolve(null);
            };
        });
    });
    return Promise.all(promises).then(() => preloadedImages);
}
