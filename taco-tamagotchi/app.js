// Clase para Taco, el gato virtual
class Taco {
    constructor() {
        this.hambre = 50;
        this.energia = 50;
        this.felicidad = 50;
    }

    // Evalúa el estado de Taco y devuelve su respuesta
    evaluarEstado() {
        if (this.hambre > 70) {
            return "¡Dame comida YA!";
        }
        
        if (this.energia < 30) {
            return "Estoy cansado";
        }
        
        if (this.felicidad > 80) {
            return "¡Estoy feliz!";
        }
        
        // Respuestas neutrales de gato
        const respuestasNeutras = [
            "miau",
            "todo tranquilo",
            "purr purr",
            "meow 🐱",
            "ronronea contento",
            "bosteza",
            "se estira",
            "mira al vacío"
        ];
        
        return respuestasNeutras[Math.floor(Math.random() * respuestasNeutras.length)];
    }

    // Acciones que puede realizar el usuario
    alimentar() {
        this.hambre = Math.max(0, this.hambre - 30);
        this.energia = Math.max(0, this.energia - 5);
        this.felicidad = Math.min(100, this.felicidad + 10);
    }

    jugar() {
        this.hambre = Math.min(100, this.hambre + 20);
        this.energia = Math.max(0, this.energia - 25);
        this.felicidad = Math.min(100, this.felicidad + 30);
    }

    dormir() {
        this.hambre = Math.min(100, this.hambre + 10);
        this.energia = 100;
        this.felicidad = Math.min(100, this.felicidad + 5);
    }

    acariciar() {
        this.hambre = Math.min(100, this.hambre + 5);
        this.energia = Math.max(0, this.energia - 3);
        this.felicidad = Math.min(100, this.felicidad + 20);
    }

    // Actualiza los estados gradualmente (envejecimiento)
    tick() {
        this.hambre = Math.min(100, this.hambre + 1);
        this.energia = Math.max(0, this.energia - 0.5);
        this.felicidad = Math.max(0, this.felicidad - 0.3);
    }

    // Obtiene el emoji según el estado emocional
    getEmoji() {
        if (this.hambre > 70) return "😫";
        if (this.energia < 30) return "😴";
        if (this.felicidad > 80) return "😻";
        if (this.hambre > 50 || this.energia < 50) return "😐";
        return "😺";
    }
}

// Variables globales
const taco = new Taco();
let gameRunning = true;

// Elementos del DOM
const tacoFace = document.getElementById('tacoFace');
const tacoResponse = document.getElementById('tacoResponse');
const hambreBar = document.getElementById('hambreBar');
const energiaBar = document.getElementById('energiaBar');
const felicidadBar = document.getElementById('felicidadBar');
const hambreValue = document.getElementById('hambreValue');
const energiaValue = document.getElementById('energiaValue');
const felicidadValue = document.getElementById('felicidadValue');
const lastAction = document.getElementById('lastAction');

// Botones de acciones
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const sleepBtn = document.getElementById('sleepBtn');
const petBtn = document.getElementById('petBtn');

// Actualiza la visualización de los estados
function actualizarUI() {
    // Emojis
    tacoFace.textContent = taco.getEmoji();
    
    // Barras de estado
    hambreBar.style.width = taco.hambre + '%';
    energiaBar.style.width = taco.energia + '%';
    felicidadBar.style.width = taco.felicidad + '%';
    
    // Valores numéricos
    hambreValue.textContent = Math.round(taco.hambre);
    energiaValue.textContent = Math.round(taco.energia);
    felicidadValue.textContent = Math.round(taco.felicidad);
    
    // Respuesta de Taco
    tacoResponse.textContent = taco.evaluarEstado();
}

// Maneja las acciones del usuario
function realizarAccion(accion, nombre) {
    if (!gameRunning) return;
    
    taco[accion]();
    lastAction.textContent = `Última acción: ${nombre}`;
    actualizarUI();
    
    // Animación del emoji
    tacoFace.style.animation = 'none';
    setTimeout(() => {
        tacoFace.style.animation = 'bounce 0.6s infinite';
    }, 10);
}

// Game loop - Taco envejece con el tiempo
setInterval(() => {
    if (gameRunning) {
        taco.tick();
        actualizarUI();
        
        // Verifica si Taco ha muerto (todo en 0)
        if (taco.hambre >= 100 && taco.energia <= 0) {
            gameRunning = false;
            tacoResponse.textContent = "Taco se ha ido... 💔";
            tacoFace.textContent = "💀";
        }
    }
}, 2000); // Cada 2 segundos

// Event listeners de botones
feedBtn.addEventListener('click', () => realizarAccion('alimentar', '🍖 Alimentar'));
playBtn.addEventListener('click', () => realizarAccion('jugar', '🎾 Jugar'));
sleepBtn.addEventListener('click', () => realizarAccion('dormir', '😴 Dormir'));
petBtn.addEventListener('click', () => realizarAccion('acariciar', '🤚 Acariciar'));

// Inicializa el juego
actualizarUI();
console.log('¡Bienvenido a Taco - Tu gato virtual!');
