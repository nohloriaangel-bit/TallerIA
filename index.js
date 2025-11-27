const lista = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(lista);
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Añadimos una función para sumar dos números con comentarios línea por línea
function sumar(numero1, numero2) {
	// numero1: primer valor que queremos sumar
	// numero2: segundo valor que queremos sumar

	// Creamos una variable llamada resultado para guardar la suma de los dos números
	var resultado = numero1 + numero2;

	// Devolvemos el valor almacenado en resultado al lugar que llamó a la función
	return resultado;
}

readline.question('Introduce el primer número entero: ', (a) => {
	const n1 = parseInt(a, 10);
	if (Number.isNaN(n1)) {
		console.log('Entrada inválida para el primer número. Usa un entero.');
		readline.close();
		return;
	}

	readline.question('Introduce el segundo número entero: ', (b) => {
		const n2 = parseInt(b, 10);
		if (Number.isNaN(n2)) {
			console.log('Entrada inválida para el segundo número. Usa un entero.');
			readline.close();
			return;
		}

		// Usamos la función sumar en vez de hacer la suma inline
		var suma = sumar(n1, n2);

		// Mostramos el resultado usando concatenación de cadenas (sin template literals)
		console.log('La suma de ' + n1 + ' y ' + n2 + ' es: ' + suma);
		readline.close();
	});
});

