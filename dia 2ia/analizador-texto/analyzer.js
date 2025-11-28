// Obtener referencias a los elementos del DOM
const textoInput = document.getElementById('texto');
const caracteresConEspacios = document.getElementById('caracteres-con-espacios');
const caracteresSinEspacios = document.getElementById('caracteres-sin-espacios');
const palabrasElement = document.getElementById('palabras');

// Función para analizar el texto
function analizarTexto() {
    const texto = textoInput.value;

    // Contar caracteres (incluyendo espacios)
    const totalCaracteres = texto.length;

    // Contar caracteres (sin espacios)
    const caracteresNoEspacios = texto.replace(/\s/g, '').length;

    // Contar palabras
    // Eliminar espacios al inicio y final, luego dividir por espacios en blanco
    const palabras = texto.trim().length === 0 
        ? 0 
        : texto.trim().split(/\s+/).length;

    // Actualizar los elementos del DOM
    caracteresConEspacios.textContent = totalCaracteres;
    caracteresSinEspacios.textContent = caracteresNoEspacios;
    palabrasElement.textContent = palabras;
}

// Agregar evento de escucha para detectar cambios en el textarea
textoInput.addEventListener('input', analizarTexto);

// Ejecutar análisis inicial
analizarTexto();
