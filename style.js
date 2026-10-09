/* ============================================
   НЕМЕЦИЯ — КАЛЬКУЛЯТОР НОРМО-ЧАСОВ
   ============================================ */

:root {
    --bg: #f4f4f4;
    --bg-card: #ffffff;
    --bg-input: #ffffff;
    --bg-hover: #e8e8e8;
    --bg-selected: #d9d9d9;
    --text: #1a1a1a;
    --text-muted: #666666;
    --text-light: #999999;
    --border: #d0d0d0;
    --border-light: #e0e0e0;
    --accent: #555555;
    --accent-hover: #333333;
    --accent-text: #ffffff;
    --badge-engine: #c44;
    --badge-standard: #4a8;
    --shadow: 0 1px 3px rgba(0,0,0,0.08);
    --shadow-lg: 0 4px 12px rgba(0,0,0,0.12);
    --radius: 4px;
}

[data-theme="dark"] {
    --bg: #1a1a1a;
    --bg-card: #2a2a2a;
    --bg-input: #333333;
    --bg-hover: #3a3a3a;
    --bg-selected: #4a4a4a;
    --text: #e0e0e0;
    --text-muted: #999999;
    --text-light: #666666;
    --border: #444444;
    --border-light: #383838;
    --accent: #888888;
    --accent-hover: #aaaaaa;
    --accent-text: #1a1a1a;
    --badge-engine: #e55;
    --badge-standard: #5a9;
    --shadow: 0 1px 3px rgba(0,0,0,0.3);
    --shadow-lg: 0 4px 12px rgba(0,0,0,0.4);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    line-height: 1.5;
    transition: background 0.2s, color 0.2s;
}

/* HEADER */
.header {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: var(--shadow);
}
.header-logo {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.5px;
    white-space: nowrap;
}
.header-logo span { color: var(--text-muted); font-weight: 400; font-size: 12px; }
.header-spacer { flex: 1; }
.header-btn {
    padding: 6px 14px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    cursor: pointer;
    font-size: 13px;
    text-decoration: none;
    transition: background 0.15s, border 0.15s;
}
.header-btn:hover { background: var(--bg-hover); border-color: var(--accent); }

/* THEME TOGGLE */
.theme-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--text-muted);
}
.theme-toggle input { display: none; }
.theme-toggle .slider {
    width: 40px;
    height: 20px;
    background: var(--border);
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
}
.theme-toggle .slider::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: var(--bg-card);
    border-radius: 50%;
    transition: transform 0.2s;
}
.theme-toggle input:checked + .slider { background: var(--accent); }
.theme-toggle input:checked + .slider::after { transform: translateX(20px); }

/* MANAGER BLOCK */
.manager-block {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--bg-hover);
    border-radius: var(--radius);
    font-size: 13px;
}
.manager-block .icon { font-size: 16px; }
.manager-block select {
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    padding: 4px 8px;
    font-size: 13px;
    cursor: pointer;
}

/* MAIN LAYOUT */
.main-container {
    display: flex;
    gap: 1px;
    background: var(--border);
    min-height: calc(100vh - 52px);
}
.left-panel {
    flex: 1;
    background: var(--bg);
    padding: 16px;
    overflow-y: auto;
}
.right-panel {
    width: 420px;
    background: var(--bg-card);
    padding: 16px;
    overflow-y: auto;
    border-left: 1px solid var(--border);
}

/* CAR SELECTOR */
.car-selector {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: var(--shadow);
}
.car-selector h2 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--text);
}
.car-search-wrapper {
    position: relative;
    margin-bottom: 12px;
}
.car-search-wrapper input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-input);
    color: var(--text);
    font-size: 13px;
    outline: none;
    transition: border 0.15s;
}
.car-search-wrapper input:focus { border-color: var(--accent); }
.search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    z-index: 100;
    max-height: 300px;
    overflow-y: auto;
    display: none;
}
.search-dropdown.active { display: block; }
.search-dropdown .item {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid var(--border-light);
    font-size: 13px;
    transition: background 0.1s;
}
.search-dropdown .item:hover,
.search-dropdown .item.active { background: var(--bg-hover); }
.search-dropdown .item .item-model { font-weight: 600; }
.search-dropdown .item .item-detail { color: var(--text-muted); font-size: 12px; margin-top: 2px; }

.select-row {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}
.select-group { flex: 1; }
.select-group label {
    display: block;
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 4px;
}
.select-group select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-input);
    color: var(--text);
    font-size: 13px;
    cursor: pointer;
    outline: none;
    transition: border 0.15s;
}
.select-group select:focus { border-color: var(--accent); }
.select-group select:disabled { opacity: 0.5; cursor: default; }

/* FLUIDS PANEL */
.fluids-panel {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: var(--shadow);
    display: none;
}
.fluids-panel.active { display: block; }
.fluids-panel h2 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
}
.fluids-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}
.fluids-table th {
    text-align: left;
    padding: 6px 8px;
    border-bottom: 2px solid var(--border);
    color: var(--text-muted);
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}
.fluids-table td {
    padding: 6px 8px;
    border-bottom: 1px solid var(--border-light);
}
.fluids-table .fluid-name { font-weight: 600; }
.fluids-table .fluid-na { color: var(--text-light); font-style: italic; }

/* WORKS PANEL */
.works-panel {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: var(--shadow);
}
.works-panel h2 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
}
.works-search {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-input);
    color: var(--text);
    font-size: 13px;
    outline: none;
    margin-bottom: 12px;
    transition: border 0.15s;
}
.works-search:focus { border-color: var(--accent); }

.work-category {
    margin-bottom: 4px;
}
.work-category-header {
    padding: 8px 12px;
    background: var(--bg-hover);
    border-radius: var(--radius);
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.1s;
    user-select: none;
}
.work-category-header:hover { background: var(--bg-selected); }
.work-category-header .arrow {
    font-size: 10px;
    transition: transform 0.2s;
    width: 12px;
}
.work-category-header.expanded .arrow { transform: rotate(90deg); }
.work-category-header .count {
    margin-left: auto;
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 400;
}
.work-category-body { display: none; }
.work-category-body.expanded { display: block; }

.work-item {
    display: flex;
    align-items: center;
    padding: 8px 12px 8px 24px;
    border-bottom: 1px solid var(--border-light);
    cursor: pointer;
    transition: background 0.1s;
    position: relative;
    outline: none;
}
.work-item:hover { background: var(--bg-hover); }
.work-item.selected { background: var(--bg-selected); }
.work-item .checkbox {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border);
    border-radius: 3px;
    margin-right: 10px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
}
.work-item.selected .checkbox {
    background: var(--accent);
    border-color: var(--accent);
}
.work-item .checkbox::after {
    content: '✓';
    color: var(--accent-text);
    font-size: 11px;
    font-weight: 700;
    opacity: 0;
}
.work-item.selected .checkbox::after { opacity: 1; }
.work-item .work-name { flex: 1; font-size: 13px; }
.work-item .work-nh {
    font-size: 12px;
    color: var(--text-muted);
    margin-right: 8px;
    white-space: nowrap;
}
.work-item .work-price {
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    min-width: 70px;
    text-align: right;
}
.work-item .rate-badge {
    font-size: 10px;
    padding: 1px 4px;
    border-radius: 2px;
    margin-left: 4px;
    white-space: nowrap;
}
.rate-badge.engine { background: var(--badge-engine); color: #fff; }
.rate-badge.standard { background: var(--badge-standard); color: #fff; }

/* EXPANDABLE (includes) */
.work-item.has-includes .expand-btn {
    margin-left: 6px;
    cursor: pointer;
    font-size: 14px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    transition: background 0.1s;
    flex-shrink: 0;
}
.work-item.has-includes .expand-btn:hover { background: var(--bg-selected); }
.work-item.includes-expanded .expand-btn { transform: rotate(45deg); }
.includes-list {
    display: none;
    padding: 4px 0 8px 50px;
    font-size: 12px;
    color: var(--text-muted);
}
.includes-list.expanded { display: block; }
.includes-list .include-item {
    padding: 3px 0;
    display: flex;
    justify-content: space-between;
    max-width: 400px;
}

/* CALC PANEL */
.calc-panel {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    box-shadow: var(--shadow);
}
.calc-panel h2 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
}
.calc-empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
    font-size: 13px;
}
.calc-work-card {
    border: 1px solid var(--border-light);
    border-radius: var(--radius);
    padding: 10px 12px;
    margin-bottom: 8px;
    background: var(--bg);
}
.calc-work-card .calc-work-header {
    display: flex;
    align-items: center;
    gap: 8px;
}
.calc-work-card .calc-work-name { flex: 1; font-size: 13px; font-weight: 600; }
.calc-work-card .calc-work-remove {
    cursor: pointer;
    color: var(--text-light);
    font-size: 18px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    transition: all 0.1s;
    flex-shrink: 0;
}
.calc-work-card .calc-work-remove:hover { color: #c44; background: var(--bg-hover); }
.calc-work-card .calc-work-info {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
    font-size: 12px;
    color: var(--text-muted);
}
.calc-work-card .calc-work-price { font-weight: 600; color: var(--text); }
.calc-work-card.has-includes .includes-list { padding: 4px 0 4px 12px; }

/* COEFFICIENT ROW */
.coeff-row {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed var(--border-light);
}
.coeff-row select {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 3px;
    background: var(--bg-input);
    color: var(--text);
    font-size: 12px;
    margin-bottom: 4px;
}
.coeff-row .coeff-display {
    font-size: 12px;
    color: var(--text-muted);
}
.coeff-row .coeff-display .coeff-rub { font-weight: 600; color: var(--text); }
.coeff-row .coeff-remove {
    font-size: 11px;
    color: var(--text-light);
    cursor: pointer;
    text-decoration: underline;
    margin-top: 2px;
    display: inline-block;
}
.coeff-row .coeff-remove:hover { color: #c44; }

/* CALC TOTAL */
.calc-total {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 2px solid var(--border);
}
.calc-total-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 4px;
    color: var(--text-muted);
}
.calc-total-row.final {
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
}
.calc-buttons {
    display: flex;
    gap: 8px;
    margin-top: 12px;
}
.calc-btn {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    color: var(--text);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: background 0.15s, border 0.15s;
}
.calc-btn:hover { background: var(--bg-hover); }
.calc-btn.primary { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
.calc-btn.primary:hover { background: var(--accent-hover); }
.calc-btn.danger { color: #c44; border-color: var(--border); }
.calc-btn.danger:hover { background: rgba(200,60,60,0.1); }

/* HISTORY */
.history-section {
    margin-top: 20px;
    border-top: 2px solid var(--border);
    padding-top: 16px;
}
.history-section h3 {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-muted);
}
.history-card {
    background: var(--bg);
    border: 1px solid var(--border-light);
    border-radius: var(--radius);
    padding: 10px 12px;
    margin-bottom: 6px;
    cursor: pointer;
    transition: background 0.1s, border 0.1s;
}
.history-card:hover { background: var(--bg-hover); border-color: var(--accent); }
.history-card .h-row { display: flex; justify-content: space-between; align-items: center; }
.history-card .h-car { font-size: 13px; font-weight: 600; }
.history-card .h-sum { font-size: 13px; font-weight: 600; }
.history-card .h-date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.history-card .h-works { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

/* TOAST */
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 16px;
    box-shadow: var(--shadow-lg);
    font-size: 13px;
    z-index: 1000;
    display: none;
    max-width: 320px;
}
.toast.active { display: block; }
.toast .toast-text { margin-bottom: 8px; }
.toast .toast-buttons { display: flex; gap: 8px; }
.toast .toast-btn {
    padding: 6px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    color: var(--text);
    cursor: pointer;
    font-size: 12px;
}
.toast .toast-btn.primary { background: var(--accent); color: var(--accent-text); }

/* VIN MODAL */
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 2000;
    display: none;
    align-items: center;
    justify-content: center;
}
.modal-overlay.active { display: flex; }
.modal {
    background: var(--bg-card);
    border-radius: var(--radius);
    padding: 24px;
    width: 90%;
    max-width: 480px;
    box-shadow: var(--shadow-lg);
}
.modal h3 { font-size: 16px; margin-bottom: 12px; }
.modal p { font-size: 13px; color: var(--text-muted); margin-bottom: 12px; }
.modal input, .modal textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-input);
    color: var(--text);
    font-size: 13px;
    margin-bottom: 8px;
    outline: none;
    font-family: inherit;
}
.modal textarea { min-height: 80px; resize: vertical; }
.modal .modal-buttons { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }
.modal .modal-btn {
    padding: 8px 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    color: var(--text);
    cursor: pointer;
    font-size: 13px;
}
.modal .modal-btn.primary { background: var(--accent); color: var(--accent-text); }

/* SCROLLBAR */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
