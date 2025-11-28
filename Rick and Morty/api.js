// Variables globales
let currentPage = 1;
let currentSearch = '';
let currentStatus = '';
let totalPages = 1;
const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const resultDiv = document.getElementById('result');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const resetBtn = document.getElementById('resetBtn');

// Event Listeners
searchInput.addEventListener('input', debounce(() => {
    currentPage = 1;
    currentSearch = searchInput.value.trim();
    fetchCharacters();
}, 500));

statusFilter.addEventListener('change', () => {
    currentPage = 1;
    currentStatus = statusFilter.value;
    fetchCharacters();
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchCharacters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchCharacters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

resetBtn.addEventListener('click', () => {
    currentPage = 1;
    currentSearch = '';
    currentStatus = '';
    searchInput.value = '';
    statusFilter.value = '';
    fetchCharacters();
});

// Función debounce para optimizar búsqueda
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Función para obtener los personajes de la API
async function fetchCharacters() {
    try {
        resultDiv.innerHTML = '<div class="loading">⏳ Cargando personajes...</div>';
        
        let url = `${API_BASE_URL}?page=${currentPage}`;
        
        if (currentSearch) {
            url += `&name=${encodeURIComponent(currentSearch)}`;
        }
        
        if (currentStatus) {
            url += `&status=${currentStatus}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Actualizar información de paginación
        totalPages = data.info.pages;
        updatePaginationButtons();
        
        // Renderizar personajes
        if (data.results && data.results.length > 0) {
            displayCharacters(data.results);
        } else {
            resultDiv.innerHTML = '<div class="no-results">❌ No se encontraron personajes</div>';
        }

    } catch (error) {
        console.error('Error fetching characters:', error);
        resultDiv.innerHTML = `
            <div class="error">
                ⚠️ Error al cargar los personajes: ${error.message}
            </div>
        `;
    }
}

// Función para mostrar los personajes en la página
function displayCharacters(characters) {
    const grid = document.createElement('div');
    grid.className = 'characters-grid';

    characters.forEach(character => {
        const card = createCharacterCard(character);
        grid.appendChild(card);
    });

    resultDiv.innerHTML = '';
    resultDiv.appendChild(grid);
}

// Función para crear una tarjeta de personaje
function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';

    const statusClass = character.status.toLowerCase();
    const statusSpanish = translateStatus(character.status);
    const speciesSpanish = translateSpecies(character.species);

    card.innerHTML = `
        <img src="${character.image}" alt="${character.name}" class="character-image">
        <div class="character-info">
            <div class="character-name">${character.name}</div>
            <div class="character-detail">
                <span class="status ${statusClass}"></span>
                <strong>Estado:</strong>
                <span>${statusSpanish}</span>
            </div>
            <div class="character-detail">
                <strong>Especie:</strong>
                <span>${speciesSpanish}</span>
            </div>
            <div class="character-detail">
                <strong>Ubicación:</strong>
                <span>${character.location.name}</span>
            </div>
        </div>
    `;

    return card;
}

// Función para traducir estado al español
function translateStatus(status) {
    const statusMap = {
        'Alive': 'Vivo',
        'Dead': 'Muerto',
        'unknown': 'Desconocido'
    };
    return statusMap[status] || status;
}

// Función para traducir especie al español
function translateSpecies(species) {
    const speciesMap = {
        'Human': 'Humano',
        'Alien': 'Extraterrestre',
        'Humanoid': 'Humanoide',
        'Robot': 'Robot',
        'Animal': 'Animal',
        'Poultrian': 'Poultrian',
        'unknown': 'Desconocido'
    };
    return speciesMap[species] || species;
}

// Función para actualizar botones de paginación
function updatePaginationButtons() {
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
}

// Cargar personajes al iniciar
window.addEventListener('DOMContentLoaded', fetchCharacters);
