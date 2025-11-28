// 🌐 Pokédex: Consumo de PokeAPI con búsqueda, paginación y modal detallado

// Estado global
let allPokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const POKEMON_PER_PAGE = 20;

// Elementos del DOM
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const gridPokemon = document.getElementById('gridPokemon');
const paginationDiv = document.getElementById('pagination');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

// 1. Obtener lista inicial de pokémon (151 primeros)
async function cargarListaPokemon() {
    try {
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0');
        const datos = await respuesta.json();
        allPokemon = datos.results;
        filteredPokemon = [...allPokemon];
        currentPage = 1;
        renderizarGrid();
        renderizarPaginacion();
    } catch (error) {
        console.error('Error al cargar pokémon:', error);
    }
}

// 2. Obtener detalles completos de un pokémon
async function obtenerDetallesPokemon(urlPokemon) {
    try {
        const respuesta = await fetch(urlPokemon);
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error al obtener detalles:', error);
        return null;
    }
}

// 3. Renderizar grid de pokémon con paginación
function renderizarGrid() {
    gridPokemon.innerHTML = '';
    
    const inicio = (currentPage - 1) * POKEMON_PER_PAGE;
    const fin = inicio + POKEMON_PER_PAGE;
    const pokemonPagina = filteredPokemon.slice(inicio, fin);

    pokemonPagina.forEach((pokemon, index) => {
        const numero = allPokemon.indexOf(pokemon) + 1;
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${numero}.png" 
                 alt="${pokemon.name}" onerror="this.src='https://via.placeholder.com/120?text=No+Image'">
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <p>#${String(numero).padStart(3, '0')}</p>
        `;
        card.addEventListener('click', () => abrirModal(pokemon.url));
        gridPokemon.appendChild(card);
    });
}

// 4. Renderizar paginación
function renderizarPaginacion() {
    paginationDiv.innerHTML = '';
    const totalPaginas = Math.ceil(filteredPokemon.length / POKEMON_PER_PAGE);

    // Botón anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = 'Anterior';
    btnAnterior.disabled = currentPage === 1;
    btnAnterior.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderizarGrid();
            renderizarPaginacion();
            gridPokemon.scrollIntoView({ behavior: 'smooth' });
        }
    });
    paginationDiv.appendChild(btnAnterior);

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const btnPag = document.createElement('button');
        btnPag.textContent = i;
        btnPag.className = i === currentPage ? 'active' : '';
        btnPag.addEventListener('click', () => {
            currentPage = i;
            renderizarGrid();
            renderizarPaginacion();
            gridPokemon.scrollIntoView({ behavior: 'smooth' });
        });
        paginationDiv.appendChild(btnPag);
    }

    // Botón siguiente
    const btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = 'Siguiente';
    btnSiguiente.disabled = currentPage === totalPaginas;
    btnSiguiente.addEventListener('click', () => {
        if (currentPage < totalPaginas) {
            currentPage++;
            renderizarGrid();
            renderizarPaginacion();
            gridPokemon.scrollIntoView({ behavior: 'smooth' });
        }
    });
    paginationDiv.appendChild(btnSiguiente);
}

// 5. Abrir modal con detalles completos
async function abrirModal(urlPokemon) {
    const detalles = await obtenerDetallesPokemon(urlPokemon);
    if (!detalles) return;

    const tipos = detalles.types.map(t => t.type.name).join(', ');
    const habilidades = detalles.abilities.map(a => a.ability.name).join(', ');
    const stats = detalles.stats
        .map(s => `${s.stat.name}: ${s.base_stat}`)
        .join('<br>');

    modalContent.innerHTML = `
        <h2>${detalles.name.charAt(0).toUpperCase() + detalles.name.slice(1)}</h2>
        <img src="${detalles.sprites.front_default || 'https://via.placeholder.com/200?text=No+Image'}" 
             alt="${detalles.name}" style="width: 200px;">
        <p><strong>ID:</strong> #${String(detalles.id).padStart(3, '0')}</p>
        <p><strong>Tipos:</strong> ${tipos}</p>
        <p><strong>Altura:</strong> ${(detalles.height / 10).toFixed(2)} m</p>
        <p><strong>Peso:</strong> ${(detalles.weight / 10).toFixed(2)} kg</p>
        <p><strong>Habilidades:</strong> ${habilidades}</p>
        <p><strong>Estadísticas:</strong><br>${stats}</p>
    `;
    modal.style.display = 'flex';
}

// 6. Cerrar modal
function cerrarModal() {
    modal.style.display = 'none';
}

// 7. Buscar pokémon
function buscarPokemon() {
    const termino = inputBuscar.value.toLowerCase().trim();
    if (termino === '') {
        filteredPokemon = [...allPokemon];
    } else {
        filteredPokemon = allPokemon.filter(p => p.name.toLowerCase().includes(termino));
    }
    currentPage = 1;
    renderizarGrid();
    renderizarPaginacion();
}

// 8. Event listeners
btnBuscar.addEventListener('click', buscarPokemon);
inputBuscar.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') buscarPokemon();
});
closeModal.addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});

// 9. Cargar pokémon al iniciar
document.addEventListener('DOMContentLoaded', cargarListaPokemon); 
