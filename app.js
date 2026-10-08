const RATE_ENGINE_GEARBOX = 3000;
const RATE_STANDARD = 2500;

let currentBrandDatabase = null;
let selectedData = { brand: '', model: '', generation: '', engine: '', gearbox: '', drive: '' };

const brandMapping = {
    "Audi": "audiDatabase", "Volkswagen": "volkswagenDatabase", "BMW": "bmwDatabase",
    "Skoda": "skodaDatabase", "Mercedes-Benz": "mercedesDatabase", "Porsche": "porscheDatabase"
};

// ГЛОБАЛЬНЫЙ СПИСОК СЛЕСАРНЫХ РАБОТ И ДИАГНОСТИКИ (Одинаков для всех машин по ставке 2500р)
const GLOBAL_STANDARD_WORKS = {
    "Диагностика ходовой части (подвески)": 0.5,
    "Компьютерная диагностика электронных систем": 0.6,
    "Регулировка углов установки колес (Сход-Развал)": 1.2,
    "Замена тормозной жидкости с проливкой контуров": 0.8,
    "Замена жидкости ГУР": 0.7,
    "Проверка плотности антифриза и осмотр течей": 0.3
};

// ЖЕСТКАЯ БАЗА УМНЫХ РЕКОМЕНДАЦИЙ (Срабатывает при выборе ключевых слов в чекбоксах)
const SMART_RECOMMENDATIONS = {
    "цеп": "Не забудьте предложить клиенту замену переднего/заднего сальника коленвала, прокладки клапанной крышки и свежих уплотнительных колец навесного оборудования.",
    "ремен": "Рекомендуется параллельно заменить водяной насос (помпу), если он приводится в действие этим ремнем, а также оценить состояние натяжного ролика.",
    "масл": "Предложите проверить состояние воздушного и салонного фильтра. При замене масла в коробке (DSG/АКПП) напомните о необходимости замены выносного масляного фильтра.",
    "колод": "Обязательно проверьте степень износа тормозных дисков, состояние пыльников направляющих и суппортов."
};

document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupListeners();
});

function initApp() {
    const select = document.getElementById('brand-select');
    if (select) {
        select.innerHTML = '<option value="">-- Выбрать --</option>';
        Object.keys(brandMapping).forEach(b => select.innerHTML += `<option value="${b}">${b}</option>`);
    }
}

function initDropdown(id, items) {
    const select = document.getElementById(id);
    if (select) {
        select.innerHTML = '<option value="">-- Выбрать --</option>';
        select.disabled = items.length === 0;
        items.forEach(item => select.innerHTML += `<option value="${item}">${item}</option>`);
    }
}

function setupListeners() {
    const fields = ['brand', 'model', 'generation', 'engine', 'gearbox', 'drive'];
    fields.forEach((field, index) => {
        const el = document.getElementById(`${field}-select`);
        if (el) {
            el.addEventListener('change', (e) => {
                selectedData[field] = e.target.value;
                for (let i = index + 1; i < fields.length; i++) {
                    selectedData[fields[i]] = '';
                    const subSelect = document.getElementById(`${fields[i]}-select`);
                    if (subSelect) {
                        subSelect.innerHTML = '<option value="">-- Выбрать --</option>';
                        subSelect.disabled = true;
                    }
                }
                document.getElementById('works-section').style.display = 'none';
                
                if (e.target.value) {
                    if (field === 'brand') {
                        currentBrandDatabase = window[brandMapping[e.target.value]];
                        if (currentBrandDatabase) initDropdown('model-select', Object.keys(currentBrandDatabase.models));
                    } else { updateNextStep(field); }
                }
            });
        }
    });

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetForm);

    // Умный динамический перехватчик событий клика по галочкам
    const worksContainer = document.getElementById('works-container');
    if (worksContainer) {
        worksContainer.addEventListener('change', (e) => {
            if (e.target && e.target.classList.contains('work-checkbox')) {
                checkRecommendations();
                calculateTotal();
            }
        });
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) return;
            for (let brand in brandMapping) {
                const db = window[brandMapping[brand]];
                if (!db) continue;
                for (let model in db.models) {
                    if (model.toLowerCase().includes(query)) { triggerSearchSelect(brand, model); return; }
                    for (let gen in db.models[model].generations) {
                        for (let eng in db.models[model].generations[gen].engines) {
                            if (eng.toLowerCase().includes(query)) { triggerSearchSelect(brand, model, gen, eng); return; }
                        }
                    }
                }
            }
        });
    }
}

function triggerSearchSelect(brand, model, gen = '', eng = '') {
    document.getElementById('brand-select').value = brand;
    currentBrandDatabase = window[brandMapping[brand]];
    selectedData.brand = brand;
    initDropdown('model-select', Object.keys(currentBrandDatabase.models));
    document.getElementById('model-select').value = model;
    selectedData.model = model;
    initDropdown('generation-select', Object.keys(currentBrandDatabase.models[model].generations));
    if (gen) {
        document.getElementById('generation-select').value = gen;
        selectedData.generation = gen;
        initDropdown('engine-select', Object.keys(currentBrandDatabase.models[model].generations[gen].engines));
        if (eng) {
            document.getElementById('engine-select').value = eng;
            selectedData.engine = eng;
            const engData = currentBrandDatabase.models[model].generations[gen].engines[eng];
            initDropdown('gearbox-select', engData.gearboxes);
            initDropdown('drive-select', engData.drives);
        }
    }
}

function resetForm() {
    selectedData = { brand: '', model: '', generation: '', engine: '', gearbox: '', drive: '' };
    currentBrandDatabase = null;
    document.getElementById('search-input').value = '';
    document.getElementById('brand-select').value = '';
    ['model', 'generation', 'engine', 'gearbox', 'drive'].forEach(f => {
        const select = document.getElementById(`${f}-select`);
        if (select) {
            select.innerHTML = '<option value="">-- Выбрать --</option>';
            select.value = '';
            select.disabled = true;
        }
    });
    document.getElementById('works-section').style.display = 'none';
    document.getElementById('works-container').innerHTML = '';
    document.getElementById('rec-box').style.display = 'none';
    document.getElementById('res-hours-engine').innerText = '0';
    document.getElementById('res-hours-standard').innerText = '0';
    document.getElementById('res-total-cost').innerText = '0 ₽';
}

function updateNextStep(currentField) {
    const db = currentBrandDatabase;
    if (currentField === 'model') initDropdown('generation-select', Object.keys(db.models[selectedData.model].generations));
    else if (currentField === 'generation') initDropdown('engine-select', Object.keys(db.models[selectedData.model].generations[selectedData.generation].engines));
    else if (currentField === 'engine') initDropdown('gearbox-select', db.models[selectedData.model].generations[selectedData.generation].engines[selectedData.engine].gearboxes);
    else if (currentField === 'gearbox') initDropdown('drive-select', db.models[selectedData.model].generations[selectedData.generation].engines[selectedData.engine].drives);
    else if (currentField === 'drive') renderWorks();
}

function renderWorks() {
    const engineData = currentBrandDatabase.models[selectedData.model].generations[selectedData.generation].engines[selectedData.engine];
    const container = document.getElementById('works-container');
    container.innerHTML = '';
    
    document.getElementById('car-info-title').innerText = `${selectedData.brand} ${selectedData.model} (${selectedData.generation}), ДВС: ${selectedData.engine}`;
    
    if (engineData.works.engine_gearbox_rate && Object.keys(engineData.works.engine_gearbox_rate).length > 0) {
        createSectionHeader(container, "Тяжелый ремонт агрегатов (3 000 ₽/ч)");
        for (let name in engineData.works.engine_gearbox_rate) {
            createWorkRow(container, name, engineData.works.engine_gearbox_rate[name], 'engine_gearbox');
        }
    }

    if (engineData.works.standard_rate && Object.keys(engineData.works.standard_rate).length > 0) {
        createSectionHeader(container, "Регламентное ТО модели (2 500 ₽/ч)");
        for (let name in engineData.works.standard_rate) {
            createWorkRow(container, name, engineData.works.standard_rate[name], 'standard');
        }
    }

    createSectionHeader(container, "Общие слесарные работы и диагностика (2 500 ₽/ч)");
    for (let name in GLOBAL_STANDARD_WORKS) {
        createWorkRow(container, name, GLOBAL_STANDARD_WORKS[name], 'standard');
    }

    document.getElementById('works-section').style.display = 'block';
    checkRecommendations();
    calculateTotal();
}

function createSectionHeader(container, text) {
    const div = document.createElement('div');
    div.className = 'section-title';
    div.innerText = text;
    container.appendChild(div);
}

function createWorkRow(container, name, hours, type) {
    const rateText = type === 'engine_gearbox' ? `${RATE_ENGINE_GEARBOX} ₽` : `${RATE_STANDARD} ₽`;
    const badgeColor = type === 'engine_gearbox' ? 'background: #ffebee; color: #c62828;' : 'background: #e8f5e9; color: #2e7d32;';
    const row = document.createElement('div');
    row.className = 'work-item';
    row.innerHTML = `
        <label style="display: flex; align-items: center; cursor: pointer; flex: 1;">
