// ============================================
// НЕМЕЦИЯ — ОСНОВНАЯ ЛОГИКА
// ============================================

(function() {
'use strict';

// --- STATE ---
let currentBrand = null;
let currentBrandData = null;
let currentMod = null;
let selectedWorks = []; // [{workId, nh, price, rateType, coefficients: [{type, percent, rub}]}, ...] (order = add order)
let expandedCats = new Set();
let expandedIncludes = new Set(); // workIds with includes expanded in calc
let isSaving = false;
let searchActiveIndex = -1; // keyboard nav
let searchResults = [];

// --- DOM HELPERS ---
const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
};

// --- UTILITIES ---
function getRate(rateType) {
    return CONFIG.rates[rateType] || CONFIG.rates.standard;
}

function workPrice(nh, rateType) {
    return nh * getRate(rateType);
}

function formatRub(n) {
    return n.toLocaleString('ru-RU') + ' ₽';
}

function debounce(fn, ms) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), ms);
    };
}

// --- WORK ITEM TEMPLATE (shared) ---
function workItemHTML(workId, work, price, inCalc) {
    const rateLabel = work.rateType === 'engine' ? 'ДВС' : '';
    const badge = rateLabel ? `<span class="rate-badge ${work.rateType}">${rateLabel}</span>` : '';
    const hasIncludes = work.includes && work.includes.length > 0;
    const expandBtn = hasIncludes ? `<span class="expand-btn" data-work-id="${workId}" data-context="list">+</span>` : '';
    return `
        <div class="work-item${inCalc ? ' selected' : ''}${hasIncludes ? ' has-includes' : ''}" 
             data-work-id="${workId}" tabindex="0">
            <span class="checkbox"></span>
            <span class="work-name">${work.name}${badge}</span>
            <span class="work-nh">${work.nh} н/ч</span>
            <span class="work-price">${formatRub(price)}</span>
            ${expandBtn}
        </div>
    `;
}

// --- INIT ---
function init() {
    // Theme
    const savedTheme = localStorage.getItem('nemesia_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    $('themeToggle').checked = (savedTheme === 'dark');

    // Managers
    const mgrSel = $('managerSelect');
    mgrSel.innerHTML = '<option value="">— выбрать —</option>' +
        CONFIG.managers.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    const savedMgr = localStorage.getItem('nemesia_manager') || '';
    if (savedMgr) mgrSel.value = savedMgr;
    mgrSel.onchange = () => localStorage.setItem('nemesia_manager', mgrSel.value);

    // Brands
    const brandSel = $('brandSelect');
    brandSel.disabled = false;
    brandSel.innerHTML = '<option value="">— выбрать —</option>' +
        CONFIG.brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    brandSel.onchange = onBrandChange;

    // Other selects
    $('modelSelect').onchange = onModelChange;
    $('genSelect').onchange = onGenChange;
    $('engineSelect').onchange = onEngineChange;
    $('gearboxSelect').onchange = onGearboxChange;
    $('driveSelect').onchange = onDriveChange;

    // Search
    $('globalSearch').addEventListener('input', debounce(onSearchInput, 200));
    $('globalSearch').addEventListener('keydown', onSearchKeydown);

    // Works search
    $('worksSearch').addEventListener('input', debounce(onWorksSearch, 200));

    // Buttons
    $('saveCalcBtn').onclick = saveCalculation;
    $('clearAllBtn').onclick = clearAll;

    // Theme toggle
    $('themeToggle').onchange = () => {
        const theme = $('themeToggle').checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('nemesia_theme', theme);
    };

    // VIN modal
    $('vinCancel').onclick = () => $('vinModal').classList.remove('active');
    $('vinSubmit').onclick = submitVin;

    // Restore last calc
    const last = localStorage.getItem('nemesia_lastCalc');
    if (last) {
        try {
            const data = JSON.parse(last);
            if (data.modificationId && data.works && data.works.length > 0) {
                showRestoreToast(data);
            }
        } catch(e) {}
    }

    // Render history
    renderHistory();

    // Load brand data (volkswagen is loaded via script tag)
    if (typeof volkswagenDB !== 'undefined') {
        currentBrandData = volkswagenDB;
        // Validate
        const errors = validateWorks(volkswagenDB, 'Volkswagen');
        if (errors.length > 0) console.warn('Validation errors:', errors);
    }
}

// --- BRAND CHANGE ---
function onBrandChange() {
    const brandId = $('brandSelect').value;
    if (!brandId) return;
    const brand = CONFIG.brands.find(b => b.id === brandId);
    currentBrand = brand;
    // For now only volkswagen is loaded
    if (brandId === 'volkswagen' && typeof volkswagenDB !== 'undefined') {
        currentBrandData = volkswagenDB;
        const errors = validateWorks(volkswagenDB, 'Volkswagen');
        if (errors.length > 0) console.warn('Validation errors:', errors);
    } else {
        currentBrandData = null;
    }

    if (!currentBrandData) {
        showVinModal();
        return;
    }

    // Reset downstream
    resetSelect('modelSelect');
    resetSelect('genSelect');
    resetSelect('engineSelect');
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    // Fill models
    const models = [...new Set(currentBrandData.modifications.map(m => m.model))].sort();
    fillSelect('modelSelect', models);
}

function onModelChange() {
    const model = $('modelSelect').value;
    if (!model || !currentBrandData) return;
    resetSelect('genSelect');
    resetSelect('engineSelect');
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    const mods = currentBrandData.modifications.filter(m => m.model === model);
    const gens = [...new Set(mods.map(m => m.generation))].sort();
    fillSelect('genSelect', gens);
}

function onGenChange() {
    const model = $('modelSelect').value;
    const gen = $('genSelect').value;
    if (!gen || !currentBrandData) return;
    resetSelect('engineSelect');
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    const mods = currentBrandData.modifications.filter(m => m.model === model && m.generation === gen);
    const engines = mods.map(m => ({
        value: m.id,
        label: `${m.engine.code} / ${m.engine.volume} / ${m.engine.power} / ${m.engine.torque}`,
        mod: m
    }));
    fillSelect('engineSelect', engines.map(e => e.label), engines.map(e => e.value));
}

function onEngineChange() {
    const modId = $('engineSelect').value;
    if (!modId || !currentBrandData) return;
    const mods = currentBrandData.modifications.filter(m => m.id === modId);
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    const gearboxes = mods.map(m => ({
        value: m.id,
        label: `${m.gearbox.code} / ${m.gearbox.type} / ${m.gearbox.gears} ст.`,
        mod: m
    }));
    fillSelect('gearboxSelect', gearboxes.map(g => g.label), gearboxes.map(g => g.value));
}

function onGearboxChange() {
    const modId = $('gearboxSelect').value;
    if (!modId || !currentBrandData) return;
    resetSelect('driveSelect');
    expandedCats.clear();
    expandedIncludes.clear();

    const mods = currentBrandData.modifications.filter(m => m.id === modId);
    const drives = [...new Set(mods.map(m => m.drive))];
    fillSelect('driveSelect', drives);
}

function onDriveChange() {
    const modId = $('gearboxSelect').value;
    if (!modId || !currentBrandData) return;
    const drive = $('driveSelect').value;
    const mod = currentBrandData.modifications.find(m => m.id === modId && m.drive === drive);
    if (!mod) return;

    currentMod = mod;
    expandedCats.clear();
    expandedIncludes.clear();
    selectedWorks = [];

    renderFluids(mod);
    renderWorks(mod);
    renderCalc();
    $('worksPanel').style.display = 'block';
}

// --- SEARCH ---
function onSearchInput() {
    const q = $('globalSearch').value.trim().toLowerCase();
    const dropdown = $('searchDropdown');
    if (!q) { dropdown.classList.remove('active'); return; }
    if (!currentBrandData) {
        // Auto-load volkswagen for search
        if (typeof volkswagenDB !== 'undefined') currentBrandData = volkswagenDB;
        else { dropdown.classList.remove('active'); return; }
    }

    searchResults = currentBrandData.modifications.filter(m => {
        return (
            m.model.toLowerCase().includes(q) ||
            m.generation.toLowerCase().includes(q) ||
            m.engine.code.toLowerCase().includes(q) ||
            m.gearbox.code.toLowerCase().includes(q) ||
            m.engine.volume.toLowerCase().includes(q)
        );
    }).slice(0, 15);

    if (searchResults.length === 0) {
        dropdown.innerHTML = '<div class="item" style="color:var(--text-muted)">Ничего не найдено</div>';
    } else {
        dropdown.innerHTML = searchResults.map((m, i) => `
            <div class="item" data-index="${i}">
                <div class="item-model">${m.model} — ${m.generation}</div>
                <div class="item-detail">${m.engine.code} · ${m.engine.volume} · ${m.engine.power} · ${m.gearbox.code} · ${m.drive}</div>
            </div>
        `).join('');
        dropdown.querySelectorAll('.item').forEach(item => {
            item.onclick = () => {
                const idx = parseInt(item.dataset.index);
                selectFromSearch(searchResults[idx]);
            };
        });
    }
    searchActiveIndex = -1;
    dropdown.classList.add('active');
}

function onSearchKeydown(e) {
    const dropdown = $('searchDropdown');
    if (!dropdown.classList.contains('active')) return;
    const items = dropdown.querySelectorAll('.item[data-index]');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        searchActiveIndex = Math.min(searchActiveIndex + 1, items.length - 1);
        items.forEach((it, i) => it.classList.toggle('active', i === searchActiveIndex));
        items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        searchActiveIndex = Math.max(searchActiveIndex - 1, 0);
        items.forEach((it, i) => it.classList.toggle('active', i === searchActiveIndex));
        items[searchActiveIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchActiveIndex >= 0 && searchResults[searchActiveIndex]) {
            selectFromSearch(searchResults[searchActiveIndex]);
        }
    } else if (e.key === 'Escape') {
        dropdown.classList.remove('active');
        $('globalSearch').value = '';
    }
}

function selectFromSearch(mod) {
    $('searchDropdown').classList.remove('active');
    $('globalSearch').value = '';

    // Fill selects
    $('brandSelect').value = 'volkswagen';
    onBrandChange();
    $('modelSelect').value = mod.model;
    onModelChange();
    $('genSelect').value = mod.generation;
    onGenChange();
    $('engineSelect').value = mod.id;
    onEngineChange();
    $('gearboxSelect').value = mod.id;
    onGearboxChange();
    $('driveSelect').value = mod.drive;
    onDriveChange();
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.car-search-wrapper')) {
        $('searchDropdown').classList.remove('active');
    }
});

// --- WORKS SEARCH ---
function onWorksSearch() {
    const q = $('worksSearch').value.trim().toLowerCase();
    const cats = document.querySelectorAll('.work-category');
    if (!q) {
        // Restore: show expanded based on expandedCats, hide others
        cats.forEach(cat => {
            const catKey = cat.dataset.cat;
            const header = cat.querySelector('.work-category-header');
            const body = cat.querySelector('.work-category-body');
            const expanded = expandedCats.has(catKey);
            header.classList.toggle('expanded', expanded);
            body.classList.toggle('expanded', expanded);
            cat.querySelectorAll('.work-item').forEach(w => w.style.display = '');
        });
        return;
    }
    // Filter
    cats.forEach(cat => {
        let visible = 0;
        cat.querySelectorAll('.work-item').forEach(w => {
            const name = w.querySelector('.work-name').textContent.toLowerCase();
            const match = name.includes(q);
            w.style.display = match ? '' : 'none';
            if (match) visible++;
        });
        const header = cat.querySelector('.work-category-header');
        const body = cat.querySelector('.work-category-body');
        if (visible > 0) {
            header.classList.add('expanded');
            body.classList.add('expanded');
            header.querySelector('.count').textContent = visible + ' совпад.';
        } else {
            header.classList.remove('expanded');
            body.classList.remove('expanded');
        }
    });
}

// --- FLUIDS ---
function renderFluids(mod) {
    const f = mod.fluids;
    const rows = [
        ['Моторное масло', f.engine_oil],
        ['Масло КПП', f.gearbox_oil],
        ['Масло раздатки', f.transfer_case],
        ['Масло переднего редуктора', f.diff_front],
        ['Масло заднего редуктора', f.diff_rear],
        ['Охлаждающая жидкость', f.coolant],
        ['Тормозная жидкость', f.brake_fluid],
        ['Усилитель руля (ГУР)', f.power_steering],
        ['Хладагент кондиционера', f.refrigerant]
    ];
    let html = '<tr><th>Жидкость</th><th>Объём</th><th>Допуск</th><th>Вязкость</th></tr>';
    rows.forEach(([name, data]) => {
        if (!data) {
            html += `<tr><td class="fluid-name">${name}</td><td class="fluid-na" colspan="3">—</td></tr>`;
        } else {
            html += `<tr><td class="fluid-name">${name}</td><td>${data.volume}</td><td>${data.spec}</td><td>${data.viscosity}</td></tr>`;
        }
    });
    $('fluidsTable').innerHTML = html;
    $('fluidsPanel').classList.add('active');
}

// --- WORKS LIST ---
function renderWorks(mod) {
    const container = $('worksList');
    container.innerHTML = '';

    // Group works by category
    const byCat = {};
    mod.works.forEach(wid => {
        const w = worksCatalog[wid];
        if (!w) { console.warn('Unknown workId:', wid); return; }
        if (!byCat[w.cat]) byCat[w.cat] = [];
        byCat[w.cat].push(wid);
    });

    // Render categories in order
    Object.keys(categories).forEach(catKey => {
        if (!byCat[catKey]) return;
        const catDiv = el('div', 'work-category');
        catDiv.dataset.cat = catKey;

        const header = el('div', 'work-category-header');
        const isExpanded = expandedCats.has(catKey);
        if (isExpanded) header.classList.add('expanded');
        header.innerHTML = `<span class="arrow">▶</span> ${categories[catKey]} <span class="count">${byCat[catKey].length}</span>`;
        header.onclick = () => {
            const expanded = header.classList.toggle('expanded');
            body.classList.toggle('expanded', expanded);
            if (expanded) expandedCats.add(catKey);
            else expandedCats.delete(catKey);
        };

        const body = el('div', 'work-category-body');
        if (isExpanded) body.classList.add('expanded');

        byCat[catKey].forEach(wid => {
            const w = worksCatalog[wid];
            const price = workPrice(w.nh, w.rateType);
            const inCalc = selectedWorks.some(sw => sw.workId === wid);
            body.insertAdjacentHTML('beforeend', workItemHTML(wid, w, price, inCalc));
        });

        catDiv.appendChild(header);
        catDiv.appendChild(body);
        container.appendChild(catDiv);
    });

    // Attach click handlers (delegation)
    container.onclick = onWorksListClick;
}

function onWorksListClick(e) {
    // Expand button for includes
    const expandBtn = e.target.closest('.expand-btn');
    if (expandBtn) {
        e.stopPropagation();
        const wid = expandBtn.dataset.workId;
        const item = expandBtn.closest('.work-item');
        item.classList.toggle('includes-expanded');
        // Show/hide includes list
        let incList = item.nextElementSibling;
        if (incList && incList.classList.contains('includes-list')) {
            incList.classList.toggle('expanded');
        } else {
            // Create it
            const w = worksCatalog[wid];
            if (w.includes) {
                const list = el('div', 'includes-list');
                w.includes.forEach(incId => {
                    const inc = worksCatalog[incId];
                    if (inc) {
                        const incPrice = workPrice(inc.nh, inc.rateType);
                        list.insertAdjacentHTML('beforeend',
                            `<div class="include-item"><span>${inc.name}</span><span>${inc.nh} н/ч · ${formatRub(incPrice)}</span></div>`);
                    }
                });
                list.classList.add('expanded');
                item.insertAdjacentElement('afterend', list);
            }
        }
        return;
    }

    // Work item click (toggle)
    const item = e.target.closest('.work-item');
    if (!item) return;
    const wid = item.dataset.workId;
    toggleWork(wid, item);
}

// --- TOGGLE WORK (no full re-render) ---
function toggleWork(workId, itemEl) {
    const w = worksCatalog[workId];
    if (!w) return;
    const idx = selectedWorks.findIndex(sw => sw.workId === workId);
    if (idx >= 0) {
        // Remove from calc
        selectedWorks.splice(idx, 1);
        itemEl.classList.remove('selected');
        expandedIncludes.delete(workId);
    } else {
        // Add to calc
        const price = workPrice(w.nh, w.rateType);
        selectedWorks.push({
            workId: workId,
            nh: w.nh,
            price: price,
            rateType: w.rateType,
            name: w.name,
            includes: w.includes || null,
            coefficients: []
        });
        itemEl.classList.add('selected');
    }
    renderCalc();
}

// --- CALC PANEL ---
function renderCalc() {
    const body = $('calcBody');
    if (selectedWorks.length === 0) {
        body.innerHTML = '<div class="calc-empty">Выберите работы из списка слева</div>';
        return;
    }

    // Render in order of addition
    let html = '';
    let totalWorks = 0;
    let totalCoeff = 0;

    selectedWorks.forEach((sw, i) => {
        const w = worksCatalog[sw.workId];
        const hasIncludes = sw.includes && sw.includes.length > 0;
        const isIncExpanded = expandedIncludes.has(sw.workId);

        let coeffSum = 0;
        sw.coefficients.forEach(c => { coeffSum += c.rub; });

        html += `<div class="calc-work-card${hasIncludes ? ' has-includes' : ''}" data-index="${i}">`;
        html += `<div class="calc-work-header">`;
        html += `<span class="calc-work-name">${sw.name}</span>`;
        if (hasIncludes) {
            html += `<span class="expand-btn" data-calc-wid="${sw.workId}" style="cursor:pointer;font-size:14px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:3px;flex-shrink:0;">${isIncExpanded ? '−' : '+'}</span>`;
        }
        html += `<span class="calc-work-remove" data-index="${i}">×</span>`;
        html += `</div>`;
        html += `<div class="calc-work-info">`;
        html += `<span>${sw.nh} н/ч · ${formatRub(sw.price)}</span>`;
        html += `<span class="calc-work-price">${formatRub(sw.price + coeffSum)}</span>`;
        html += `</div>`;

        // Includes list in calc
        if (hasIncludes && isIncExpanded) {
            html += `<div class="includes-list expanded" style="padding:4px 0 4px 12px;">`;
            sw.includes.forEach(incId => {
                const inc = worksCatalog[incId];
                if (inc) {
                    const incPrice = workPrice(inc.nh, inc.rateType);
                    html += `<div class="include-item"><span>${inc.name}</span><span>${inc.nh} н/ч · ${formatRub(incPrice)}</span></div>`;
                }
            });
            html += `</div>`;
        }

        // Coefficients
        html += `<div class="coeff-row" data-index="${i}">`;
        if (sw.coefficients.length > 0) {
            sw.coefficients.forEach((c, ci) => {
                html += `<div class="coeff-display">${CONFIG.coefficients[c.type].label}: +${c.percent}% <span class="coeff-rub">(${formatRub(c.rub)})</span> <span class="coeff-remove" data-cindex="${ci}">убрать</span></div>`;
            });
        }
        // Add coeff select
        html += `<select class="coeff-add" data-index="${i}"><option value="">+ Добавить коэффициент</option>`;
        Object.keys(CONFIG.coefficients).forEach(ck => {
            const already = sw.coefficients.some(c => c.type === ck);
            if (!already) {
                html += `<option value="${ck}">${CONFIG.coefficients[ck].label} (+${CONFIG.coefficients[ck].percent}%)</option>`;
            }
        });
        html += `</select>`;
        html += `</div>`;
        html += `</div>`;

        totalWorks += sw.price + coeffSum;
        totalCoeff += coeffSum;
    });

    html += `<div class="calc-total">`;
    html += `<div class="calc-total-row"><span>Работы:</span><span>${formatRub(totalWorks - totalCoeff)}</span></div>`;
    if (totalCoeff > 0) {
        html += `<div class="calc-total-row"><span>Коэффициенты:</span><span>+${formatRub(totalCoeff)}</span></div>`;
    }
    html += `<div class="calc-total-row final"><span>Итого:</span><span>${formatRub(totalWorks)}</span></div>`;
    html += `</div>`;

    body.innerHTML = html;

    // Attach handlers
    body.querySelectorAll('.calc-work-remove').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            const wid = selectedWorks[idx].workId;
            selectedWorks.splice(idx, 1);
            expandedIncludes.delete(wid);
            // Update left panel
            const leftItem = document.querySelector(`.work-item[data-work-id="${wid}"]`);
            if (leftItem) leftItem.classList.remove('selected');
            renderCalc();
        };
    });

    body.querySelectorAll('.coeff-add').forEach(sel => {
        sel.onchange = () => {
            const idx = parseInt(sel.dataset.index);
            const cType = sel.value;
            if (!cType) return;
            const sw = selectedWorks[idx];
            const percent = CONFIG.coefficients[cType].percent;
            const rub = Math.round(sw.price * percent / 100);
            sw.coefficients.push({ type: cType, percent, rub });
            renderCalc();
        };
    });

    body.querySelectorAll('.coeff-remove').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const workIdx = parseInt(btn.closest('.coeff-row').dataset.index);
            const coeffIdx = parseInt(btn.dataset.cindex);
            selectedWorks[workIdx].coefficients.splice(coeffIdx, 1);
            renderCalc();
        };
    });

    body.querySelectorAll('.expand-btn[data-calc-wid]').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const wid = btn.dataset.calcWid;
            if (expandedIncludes.has(wid)) expandedIncludes.delete(wid);
            else expandedIncludes.add(wid);
            renderCalc();
        };
    });
}

// --- SAVE CALCULATION (with double-save protection) ---
function saveCalculation() {
    if (isSaving) return;
    if (selectedWorks.length === 0) return;
    if (!currentMod) return;

    isSaving = true;
    setTimeout(() => { isSaving = false; }, 1000);

    const mgr = $('managerSelect').value;
    const mgrName = CONFIG.managers.find(m => m.id === mgr)?.name || '—';

    const total = selectedWorks.reduce((sum, sw) => {
        const coeffSum = sw.coefficients.reduce((s, c) => s + c.rub, 0);
        return sum + sw.price + coeffSum;
    }, 0);

    const record = {
        id: Date.now(),
        date: new Date().toISOString(),
        manager: mgrName,
        modificationId: currentMod.id,
        carLabel: `${currentBrand?.name || ''} ${currentMod.model} ${currentMod.generation} ${currentMod.engine.code}`,
        worksCount: selectedWorks.length,
        total: total,
        works: selectedWorks.map(sw => ({
            workId: sw.workId,
            coefficients: sw.coefficients.map(c => c.type)
        }))
    };

    // Save to localStorage history (last 5)
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('nemesia_history') || '[]');
    } catch(e) {}
    history.unshift(record);
    history = history.slice(0, 5);
    localStorage.setItem('nemesia_history', JSON.stringify(history));

    // Save as last calc
    localStorage.setItem('nemesia_lastCalc', JSON.stringify(record));

    renderHistory();
    showToast('Расчёт сохранён');
}

// --- RESTORE ---
function showRestoreToast(data) {
    $('toastText').innerHTML = `Восстановить последний расчёт?<br><strong>${data.carLabel}</strong> — ${data.worksCount} работ, ${formatRub(data.total)}`;
    const btns = $('toastButtons');
    btns.innerHTML = '';
    const yesBtn = el('button', 'toast-btn primary', 'Да');
    yesBtn.onclick = () => {
        $('toast').classList.remove('active');
        restoreCalc(data);
    };
    const noBtn = el('button', 'toast-btn', 'Нет');
    noBtn.onclick = () => {
        $('toast').classList.remove('active');
        localStorage.removeItem('nemesia_lastCalc');
    };
    btns.appendChild(yesBtn);
    btns.appendChild(noBtn);
    $('toast').classList.add('active');
}

function restoreCalc(data) {
    if (!currentBrandData) return;
    const mod = currentBrandData.modifications.find(m => m.id === data.modificationId);
    if (!mod) return;

    // Select the mod in dropdowns
    $('brandSelect').value = 'volkswagen';
    onBrandChange();
    $('modelSelect').value = mod.model;
    onModelChange();
    $('genSelect').value = mod.generation;
    onGenChange();
    $('engineSelect').value = mod.id;
    onEngineChange();
    $('gearboxSelect').value = mod.id;
    onGearboxChange();
    $('driveSelect').value = mod.drive;
    onDriveChange();

    // Restore selected works
    selectedWorks = [];
    data.works.forEach(sw => {
        const w = worksCatalog[sw.workId];
        if (!w) return;
        const price = workPrice(w.nh, w.rateType);
        const coefficients = (sw.coefficients || []).map(cType => {
            const c = CONFIG.coefficients[cType];
            if (!c) return null;
            return { type: cType, percent: c.percent, rub: Math.round(price * c.percent / 100) };
        }).filter(Boolean);
        selectedWorks.push({
            workId: sw.workId,
            nh: w.nh,
            price: price,
            rateType: w.rateType,
            name: w.name,
            includes: w.includes || null,
            coefficients: coefficients
        });
    });

    // Re-render works list to update checkboxes
    renderWorks(mod);
    renderCalc();
    showToast('Расчёт восстановлен');
}

// --- HISTORY ---
function renderHistory() {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('nemesia_history') || '[]');
    } catch(e) {}
    if (history.length === 0) {
        $('historySection').style.display = 'none';
        return;
    }
    $('historySection').style.display = 'block';
    const list = $('historyList');
    list.innerHTML = '';
    history.forEach(h => {
        const card = el('div', 'history-card');
        card.innerHTML = `
            <div class="h-row">
                <span class="h-car">${h.carLabel}</span>
                <span class="h-sum">${formatRub(h.total)}</span>
            </div>
            <div class="h-date">${new Date(h.date).toLocaleString('ru-RU')} · ${h.manager}</div>
            <div class="h-works">${h.worksCount} работ</div>
        `;
        card.onclick = () => restoreCalc(h);
        list.appendChild(card);
    });
}

// --- CLEAR ALL ---
function clearAll() {
    selectedWorks = [];
    expandedCats.clear();
    expandedIncludes.clear();
    currentMod = null;
    $('brandSelect').value = '';
    resetSelect('modelSelect');
    resetSelect('genSelect');
    resetSelect('engineSelect');
    resetSelect('gearboxSelect');
    resetSelect('driveSelect');
    $('globalSearch').value = '';
    $('worksSearch').value = '';
    $('fluidsPanel').classList.remove('active');
    $('worksPanel').style.display = 'none';
    renderCalc();
    showToast('Все поля очищены');
}

// --- VIN MODAL ---
function showVinModal() {
    $('vinInput').value = '';
    $('vinComment').value = '';
    $('vinModal').classList.add('active');
}

function submitVin() {
    const vin = $('vinInput').value.trim();
    const comment = $('vinComment').value.trim();
    if (!vin) { showToast('Введите VIN'); return; }

    let queue = [];
    try {
        queue = JSON.parse(localStorage.getItem('nemesia_vinQueue') || '[]');
    } catch(e) {}
    queue.push({
        vin: vin,
        comment: comment,
        date: new Date().toISOString(),
        manager: CONFIG.managers.find(m => m.id === $('managerSelect').value)?.name || '—'
    });
    localStorage.setItem('nemesia_vinQueue', JSON.stringify(queue));

    $('vinModal').classList.remove('active');
    showToast('VIN добавлен в очередь');
}

// --- HELPERS ---
function fillSelect(id, labels, values) {
    const sel = $(id);
    sel.disabled = false;
    sel.innerHTML = '<option value="">— выбрать —</option>';
    if (values) {
        labels.forEach((l, i) => {
            sel.insertAdjacentHTML('beforeend', `<option value="${values[i]}">${l}</option>`);
        });
    } else {
        labels.forEach(l => {
            sel.insertAdjacentHTML('beforeend', `<option value="${l}">${l}</option>`);
        });
    }
}

function resetSelect(id) {
    const sel = $(id);
    sel.disabled = true;
    sel.innerHTML = '<option value="">—</option>';
}

function showToast(msg) {
    $('toastText').innerHTML = msg;
    $('toastButtons').innerHTML = '';
    $('toast').classList.add('active');
    setTimeout(() => $('toast').classList.remove('active'), 3000);
}

// --- START ---
document.addEventListener('DOMContentLoaded', init);
})();
