//ejercicio detector de palindromos
//objetivo crear un alogica completa encapsulada en una funcion
//un palindromo es una palabra o frase que se lee igual de izquierda a derecha que de derecha a izquierda
//ejemplos de palindromos: "anilina", "reconocer", "la ruta natural", "
//crea una funcion llamada esPalindromo que reciba un texto y retorne true si es palindromo y falso si no lo es

function esPalindromo(texto) {
    //eliminar espacios y convertir a minusculas
    const textoLimpio = texto.replace(/\s+/g, '').toLowerCase();
    //obtener el texto invertido
    const textoInvertido = textoLimpio.split('').reverse().join('');
    //comparar el texto limpio con el texto invertido
    return textoLimpio === textoInvertido;
}

//ejemplos de uso
console.log(esPalindromo("anilina")); // true
console.log(esPalindromo("reconocer")); // true
console.log(esPalindromo("la ruta natural")); // true
console.log(esPalindromo("hola mundo")); // false  
