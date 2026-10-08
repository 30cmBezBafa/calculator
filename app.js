const RATE_ENGINE_GEARBOX = 3000;
const RATE_STANDARD = 2500;

let currentBrandDatabase = null;
let selectedData = { brand: '', model: '', generation: '', engine: '', gearbox: '', drive: '' };

const brandMapping = {
    "Audi": "audiDatabase",
    "Volkswagen": "volkswagenDatabase",
    "BMW": "bmwDatabase",
    "Skoda": "skodaDatabase",
    "Mercedes-Benz": "mercedesDatabase",
    "Porsche": "porscheDatabase"
};

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById('brand-select');
    select.innerHTML = '<option value="">-- Выбрать --</option>';
    Object.keys(brandMapping).forEach(b => {
        select.innerHTML += `<option value="${b}">${b}</option>`;
    });
    setupListeners();
});

function setupListeners() {
    const fields = ['brand', 'model', 'generation', 'engine', 'gearbox', 'drive'];
    fields.forEach((field, index) => {
        document.getElementById(`${field}-select`).addEventListener('change', (e) => {
            selectedData[field] = e.target.value;
            
            for (let i = index + 1; i < fields.length; i++) {
                selectedData[fields[i]] = '';
                document.getElementById(`${fields[i]}-select`).innerHTML = '<option value="">-- Выбрать --</option>';
                document.getElementById(`${fields[i]}-select`).disabled = true;
            }
            document.getElementById('works-section').style.display = 'none';
            
            if (e.target.value) {
                if (field === 'brand') {
                    const globalVar = brandMapping[e.target.value];
                    currentBrandDatabase = window[globalVar];
                    if (currentBrandDatabase) {
                        initDropdown('model-select', Object.keys(currentBrandDatabase.models));
                    } else {
                        alert('Ошибка: Файл базы данных для этой марки еще не создан или не загрузился!');
                    }
                } else {
                    updateNextStep(field);
                }
            }
        });
    });
}

function initDropdown(id, items) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">-- Выбрать --</option>';
    select.disabled = items.length === 0;
    items.forEach(item => {
        select.innerHTML += `<option value="${item}">${item}</option>`;
    });
}

function updateNextStep(currentField) {
    if (!currentBrandDatabase) return;
    const db = currentBrandDatabase;
    
    if (currentField === 'model') {
        initDropdown('generation-select', Object.keys(db.models[selectedData.model].generations));
    } 
    else if (currentField === 'generation') {
        initDropdown('engine-select', Object.keys(db.models[selectedData.model].generations[selectedData.generation].engines));
    } 
    else if (currentField === 'engine') {
        initDropdown('gearbox-select', db.models[selectedData.model].generations[selectedData.generation].engines[selectedData.engine].gearboxes);
    } 
    else if (currentField === 'gearbox') {
        initDropdown('drive-select', db.models[selectedData.model].generations[selectedData.generation].engines[selectedData.engine].drives);
    } 
    else if (currentField === 'drive') {
        renderWorks();
    }
}

function renderWorks() {
    const engineData = currentBrandDatabase.models[selectedData.model].generations[selectedData.generation].engines[selectedData.engine];
    const container = document.getElementById('works-container');
    container.innerHTML = '';
    
    document.getElementById('car-info-title').innerText = `${selectedData.brand} ${selectedData.model} (${selectedData.generation}), ДВС: ${selectedData.engine}, КПП: ${selectedData.gearbox}, Привод: ${selectedData.drive}`;
    
    if (engineData.works.engine_gearbox_rate) {
        for (let name in engineData.works.engine_gearbox_rate) {
            createWorkRow(container, name, engineData.works.engine_gearbox_rate[name], 'engine_gearbox');
        }
    }
    if (engineData.works.standard_rate) {
        for (let name in engineData.works.standard_rate) {
            createWorkRow(container, name, engineData.works.standard_rate[name], 'standard');
        }
    }
    document.getElementById('works-section').style.display = 'block';
    calculateTotal();
}

function createWorkRow(container, name, hours, type) {
    const rateText = type === 'engine_gearbox' ? `${RATE_ENGINE_GEARBOX} ₽/ч` : `${RATE_STANDARD} ₽/ч`;
    const badgeColor = type === 'engine_gearbox' ? 'background: #ffebee; color: #c62828;' : 'background: #e8f5e9; color: #2e7d32;';
    
    const row = document.createElement('div');
    row.className = 'work-item';
    row.style = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;';
    row.innerHTML = `
        <label style="display: flex; align-items: center; cursor: pointer; flex: 1;">
            <input type="checkbox" class="work-checkbox" data-hours="${hours}" data-type="${type}" onchange="calculateTotal()" style="margin-right: 15px; transform: scale(1.2);">
            <span>${name}</span>
        </label>
        <div style="text-align: right; font-size: 0.9em;">
            <strong>${hours} н/ч</strong> <span style="font-size: 0.85em; padding: 3px 6px; border-radius: 4px; ${badgeColor}">${rateText}</span>
        </div>
    `;
    container.appendChild(row);
}

function calculateTotal() {
    const checkboxes = document.querySelectorAll('.work-checkbox:checked');
    let hEngine = 0, hStandard = 0, total = 0;
    
    checkboxes.forEach(cb => {
        const hours = parseFloat(cb.getAttribute('data-hours'));
        if (cb.getAttribute('data-type') === 'engine_gearbox') {
            hEngine += hours;
            total += hours * RATE_ENGINE_GEARBOX;
        } else {
            hStandard += hours;
            total += hours * RATE_STANDARD;
        }
    });
    
    document.getElementById('res-hours-engine').innerText = hEngine.toFixed(1);
    document.getElementById('res-hours-standard').innerText = hStandard.toFixed(1);
    document.getElementById('res-total-cost').innerText = total.toLocaleString('ru-RU') + ' ₽';
}
