/**
 * Calcula el área de un círculo dado su radio.
 * 
 * @param {number} radio - El radio del círculo en unidades.
 * @returns {number} El área del círculo en unidades cuadradas.
 * 
 * @example
 * const area = areaCirculo(5);
 * console.log(area); // 78.53981633974483
 */

/**
 * Calcula el área de un rectángulo dado su base y altura.
 * 
 * @param {number} base - La base del rectángulo en unidades.
 * @param {number} altura - La altura del rectángulo en unidades.
 * @returns {number} El área del rectángulo en unidades cuadradas.
 * 
 * @example
 * const area = areaRectangulo(10, 5);
 * console.log(area); // 50
 */

/**
 * Calcula el volumen de un cilindro reutilizando la función areaCirculo.
 * El volumen se obtiene multiplicando el área de la base (círculo) por la altura.
 * 
 * @param {number} radio - El radio de la base del cilindro en unidades.
 * @param {number} altura - La altura del cilindro en unidades.
 * @returns {number} El volumen del cilindro en unidades cúbicas.
 * 
 * @example
 * const volumen = volumenCilindro(3, 10);
 * console.log(volumen); // 282.7433388230814
 */
//ejercicio: area y volumenes 
//objetivo generar multiples funciones y reutilizables
//crea una funcion para calcular el area de un circulo dado su radio

function areaCirculo(radio) {
    return Math.PI * Math.pow(radio, 2);
}
//crea una funcion para calcular e area de un rectangulo dado su base y altura
function areaRectangulo(base, altura) {
    return base * altura;
}  

//crea una funcion para calcular el volumen de un cilindro
//crea la funcion calcularvolumenclindro reutilizando la funcion areacirculo
function volumenCilindro(radio, altura) {
    const areaBase = areaCirculo(radio);
    return areaBase * altura;
} 
//crea una funcion para calcular una derivada simple de un afuncion polinomia de grado n
