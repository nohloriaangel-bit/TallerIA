// URLs de la API
const CAT_FACTS_API = 'https://catfact.ninja/fact';
const THE_CAT_API_BREEDS = 'https://api.thecatapi.com/v1/breeds';
const THE_CAT_API_IMAGES = 'https://api.thecatapi.com/v1/images/search';

// Variables globales
let currentBreedPage = 1;
let allBreeds = [];
let filteredBreeds = [];
const breedsPerPage = 9;
let currentFactText = '';

// Elementos del DOM
const factContainer = document.getElementById('factContainer');
const getFactBtn = document.getElementById('getFactBtn');
const copyFactBtn = document.getElementById('copyFactBtn');
const breedsContainer = document.getElementById('breedsContainer');
const loadBreedsBtn = document.getElementById('loadBreedsBtn');
const searchBreedsInput = document.getElementById('searchBreeds');
const prevBreedsBtn = document.getElementById('prevBreedsBtn');
const nextBreedsBtn = document.getElementById('nextBreedsBtn');
const breedsPageInfo = document.getElementById('breedsPageInfo');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Event Listeners para pestañas
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// Event Listeners para Datos Curiosos
getFactBtn.addEventListener('click', fetchFact);
copyFactBtn.addEventListener('click', copyFact);

// Event Listeners para Razas
loadBreedsBtn.addEventListener('click', fetchBreeds);
searchBreedsInput.addEventListener('input', debounce(() => {
    currentBreedPage = 1;
    filterBreeds();
}, 300));
prevBreedsBtn.addEventListener('click', prevBreedsPage);
nextBreedsBtn.addEventListener('click', nextBreedsPage);

// ===================== FUNCIÓN DEBOUNCE =====================
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// ===================== GESTIÓN DE PESTAÑAS =====================
function switchTab(tabName) {
    // Ocultar todas las pestañas
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Desactivar todos los botones
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar pestaña seleccionada
    document.getElementById(tabName).classList.add('active');

    // Activar botón seleccionado
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Si es la pestaña de razas y aún no se han cargado, cargarlas
    if (tabName === 'breeds' && allBreeds.length === 0) {
        fetchBreeds();
    }
}

// ===================== DATOS CURIOSOS =====================
async function fetchFact() {
    try {
        getFactBtn.disabled = true;
        factContainer.innerHTML = '<div class="loading">⏳ Cargando dato curioso...</div>';

        const response = await fetch(CAT_FACTS_API);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        currentFactText = data.fact;

        displayFact(data.fact, data.length);
    } catch (error) {
        console.error('Error fetching fact:', error);
        factContainer.innerHTML = `
            <div class="error">
                ⚠️ Error al cargar el dato curioso: ${error.message}
            </div>
        `;
    } finally {
        getFactBtn.disabled = false;
    }
}

function displayFact(fact, length) {
    factContainer.innerHTML = `
        <div class="fact-card">
            <div class="fact-text">${fact}</div>
        </div>
        <div style="text-align: center; color: #999; font-size: 0.9em; margin-top: 15px;">
            📏 ${length} caracteres
        </div>
    `;
}

function copyFact() {
    if (!currentFactText) {
        alert('❌ Carga un dato primero');
        return;
    }

    navigator.clipboard.writeText(currentFactText)
        .then(() => {
            // Feedback visual
            const originalText = copyFactBtn.textContent;
            copyFactBtn.textContent = '✅ ¡Copiado!';
            copyFactBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';

            setTimeout(() => {
                copyFactBtn.textContent = originalText;
                copyFactBtn.style.background = '';
            }, 2000);
        })
        .catch(err => {
            console.error('Error copying text:', err);
            alert('❌ Error al copiar');
        });
}

// ===================== RAZAS DE GATOS =====================
async function fetchBreeds() {
    try {
        loadBreedsBtn.disabled = true;
        breedsContainer.innerHTML = '<div class="loading">⏳ Cargando razas de gatos con imágenes...</div>';

        console.log('🔄 Solicitando razas desde TheCatAPI...');
        const response = await fetch(THE_CAT_API_BREEDS);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        let catBreeds = await response.json();
        console.log('📦 Respuesta recibida:', typeof catBreeds, Array.isArray(catBreeds));

        // Validar que sea un array
        if (!Array.isArray(catBreeds)) {
            console.error('❌ catBreeds no es un array:', catBreeds);
            throw new Error('Formato de datos inválido - no es un array');
        }

        console.log(`✅ Se recibieron ${catBreeds.length} razas`);

        // Procesar razas con validación
        allBreeds = catBreeds
            .filter(breed => breed && breed.name)
            .map(breed => {
                const weight = breed.weight?.metric || 'No especificado';
                const imageUrl = breed.image?.url || null;
                
                return {
                    id: breed.id || '',
                    name: breed.name || 'Desconocido',
                    origin: breed.origin || 'No especificado',
                    temperament: breed.temperament || 'No especificado',
                    coat_length: breed.coat_length || 'No especificado',
                    pattern: breed.pattern || 'No especificado',
                    weight: weight,
                    lifeSpan: breed.life_span || 'No especificado',
                    image: imageUrl
                };
            });

        console.log(`✅ Se procesaron ${allBreeds.length} razas`);

        if (allBreeds.length === 0) {
            breedsContainer.innerHTML = '<div class="no-results">❌ No se encontraron razas</div>';
            return;
        }

        // Obtener imágenes para razas que no las tienen
        await fetchMissingBreedImages();

        filteredBreeds = [...allBreeds];
        currentBreedPage = 1;
        displayBreeds();

    } catch (error) {
        console.error('Error fetching breeds:', error);
        breedsContainer.innerHTML = `
            <div class="error">
                ⚠️ Error al cargar las razas: ${error.message}
            </div>
        `;
    } finally {
        loadBreedsBtn.disabled = false;
    }
}

// Función para obtener imágenes de razas que no las tienen
async function fetchMissingBreedImages() {
    const breedsNeedingImages = allBreeds.filter(breed => !breed.image && breed.id);
    console.log(`📷 ${breedsNeedingImages.length} razas necesitan imágenes`);

    if (breedsNeedingImages.length === 0) {
        console.log('✅ Todas las razas tienen imágenes');
        return;
    }

    for (const breed of breedsNeedingImages) {
        try {
            const response = await fetch(`${THE_CAT_API_IMAGES}?breed_id=${breed.id}&limit=1`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0 && data[0].url) {
                    breed.image = data[0].url;
                    console.log(`✅ Imagen cargada: ${breed.name}`);
                }
            }
            // Pequeño delay para no saturar la API
            await new Promise(resolve => setTimeout(resolve, 150));
        } catch (err) {
            console.warn(`⚠️ Sin imagen para ${breed.name}`);
        }
    }
    console.log('✅ Carga de imágenes completada');
}

function filterBreeds() {
    const searchTerm = searchBreedsInput.value.toLowerCase().trim();

    if (!searchTerm) {
        filteredBreeds = [...allBreeds];
    } else {
        filteredBreeds = allBreeds.filter(breed => {
            const nameMatch = breed.name.toLowerCase().includes(searchTerm);
            const originMatch = breed.origin ? breed.origin.toLowerCase().includes(searchTerm) : false;
            return nameMatch || originMatch;
        });
    }

    currentBreedPage = 1;
    displayBreeds();
}

function displayBreeds() {
    if (filteredBreeds.length === 0) {
        breedsContainer.innerHTML = '<div class="no-results">❌ No se encontraron razas con esa búsqueda</div>';
        updateBreedsButtons();
        return;
    }

    // Calcular paginación
    const totalPages = Math.ceil(filteredBreeds.length / breedsPerPage);
    const startIndex = (currentBreedPage - 1) * breedsPerPage;
    const endIndex = startIndex + breedsPerPage;
    const breedsToShow = filteredBreeds.slice(startIndex, endIndex);

    // Crear grid de razas
    const grid = document.createElement('div');
    grid.className = 'breeds-grid';

    breedsToShow.forEach(breed => {
        const card = createBreedCard(breed);
        grid.appendChild(card);
    });

    breedsContainer.innerHTML = '';
    breedsContainer.appendChild(grid);

    // Actualizar información de paginación
    breedsPageInfo.textContent = `Página ${currentBreedPage} de ${totalPages}`;
    updateBreedsButtons();
}

function createBreedCard(breed) {
    const card = document.createElement('div');
    card.className = 'breed-card';

    // Imagen del gato
    const imageHTML = breed.image 
        ? `<img src="${breed.image}" alt="${breed.name}" class="breed-image" loading="lazy">`
        : '<div class="breed-image-placeholder">🐱 Sin imagen</div>';

    let infoHTML = imageHTML;
    infoHTML += `<div class="breed-name">${breed.name}</div>`;
    infoHTML += '<div class="breed-info">';

    if (breed.origin) {
        infoHTML += `
            <div class="breed-info-item">
                <span class="breed-info-label">🌍 Origen:</span> ${breed.origin}
            </div>
        `;
    }

    if (breed.weight) {
        infoHTML += `
            <div class="breed-info-item">
                <span class="breed-info-label">⚖️ Peso:</span> ${breed.weight}
            </div>
        `;
    }

    if (breed.coat_length) {
        infoHTML += `
            <div class="breed-info-item">
                <span class="breed-info-label">✂️ Pelaje:</span> ${breed.coat_length}
            </div>
        `;
    }

    if (breed.pattern) {
        infoHTML += `
            <div class="breed-info-item">
                <span class="breed-info-label">🎨 Patrón:</span> ${breed.pattern}
            </div>
        `;
    }

    if (breed.lifeSpan) {
        infoHTML += `
            <div class="breed-info-item">
                <span class="breed-info-label">🕐 Esperanza de vida:</span> ${breed.lifeSpan}
            </div>
        `;
    }

    if (breed.temperament) {
        infoHTML += `
            <div class="breed-info-item">
                <span class="breed-info-label">😸 Temperamento:</span> ${breed.temperament}
            </div>
        `;
    }

    infoHTML += '</div>';

    card.innerHTML = infoHTML;
    return card;
}

function updateBreedsButtons() {
    const totalPages = Math.ceil(filteredBreeds.length / breedsPerPage);
    prevBreedsBtn.disabled = currentBreedPage <= 1;
    nextBreedsBtn.disabled = currentBreedPage >= totalPages;
}

function prevBreedsPage() {
    if (currentBreedPage > 1) {
        currentBreedPage--;
        displayBreeds();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextBreedsPage() {
    const totalPages = Math.ceil(filteredBreeds.length / breedsPerPage);
    if (currentBreedPage < totalPages) {
        currentBreedPage++;
        displayBreeds();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===================== CARGAR INICIAL =====================
window.addEventListener('DOMContentLoaded', () => {
    console.log('🐱 ===== APLICACIÓN INICIADA =====');
    console.log('🐱 Gatos Fascinantes cargada');
    fetchFact();
});
