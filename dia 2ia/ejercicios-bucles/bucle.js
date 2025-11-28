//ejercio arrays obejtos
//l.array (listas)
//crea un alista de tus tres comidas favoiritas
const comidasFavoritas = ['Pizza', 'Sushi', 'Tacos'];
//como agrego un elemento array en js
comidasFavoritas.push('Pasta');
//muestrame la lista en consola
console.log(comidasFavoritas);
// 2. Objetos (Diccionarios/Fichas)
// Crea un objeto que te represente a ti (nombre, edad, si te gusta programar).
let alumno = {
    nombre: "Angel",
    edad: 21,
    programador: true,
    habilidades: ['JavaScript', 'Python', 'C++'],
    estatura: 1.75


};
// Pídele a la IA: "Cómo accedo a la propiedad nombre de mi objeto alumno?"
console.log("Nombre del esclavo: " + alumno.nombre);
console.log("edad del we: " +alumno.edad);
console.log("you are??? " + alumno.programador);  
console.log("vale vrg");
console.log("Habilidades: " + alumno.habilidades.join(", "));
console.log("Estatura: " + alumno.estatura + " metros");   
//crea una lista de 3 alumnos (objetos) con el nombre y calificacion
let alumnos = [
    { nombre: "Juan", calificacion: 85 },
    { nombre: "Maria", calificacion: 92 },
    { nombre: "Luis", calificacion: 78 }
];
//muestrame la lista de alumnos en consola
console.log("Lista de Alumnos:");
alumnos.forEach(function(alumno) {
    console.log("Nombre: " + alumno.nombre + ", Calificación: " + alumno.calificacion);
});

//escribir un bucle que recorra el array de alumnos e imprima solo los que aprobaron (calificacion => 80)
console.log("Alumnos que aprobaron:");
for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i].calificacion >= 80) {
        console.log("Nombre: " + alumnos[i].nombre + ", Calificación: " + alumnos[i].calificacion);
    }
}
