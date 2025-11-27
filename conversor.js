/**
 * Convierte una temperatura en Celsius a Fahrenheit y Kelvin
 * @param {number} celsius - La temperatura en grados Celsius
 * @returns {object} Objeto con las conversiones a Fahrenheit y Kelvin
 */
function convertirTemperatura(celsius) {
  // Validar que el valor ingresado sea un número válido
  if (typeof celsius !== 'number' || isNaN(celsius)) {
    console.error('Por favor ingresa un número válido');
    return null;
  }

  // Fórmula de conversión a Fahrenheit: (°C × 9/5) + 32
  const fahrenheit = (celsius * 9 / 5) + 32;

  // Fórmula de conversión a Kelvin: °C + 273.15
  const kelvin = celsius + 273.15;

  // Retornar un objeto con los tres valores (Celsius original + conversiones)
  return {
    celsius: celsius,
    fahrenheit: Math.round(fahrenheit * 100) / 100, // Redondear a 2 decimales
    kelvin: Math.round(kelvin * 100) / 100 // Redondear a 2 decimales
  };
}

// Ejemplos de uso:
console.log('--- Ejemplos de Conversión de Temperaturas ---');
console.log(convertirTemperatura(0));    // Punto de congelación del agua
console.log(convertirTemperatura(100));  // Punto de ebullición del agua
console.log(convertirTemperatura(25));   // Temperatura ambiente
console.log(convertirTemperatura(-40));  // -40°C = -40°F
