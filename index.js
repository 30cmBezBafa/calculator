<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Немеция — Калькулятор нормо-часов</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="header">
        <div class="header-logo">НЕМЕЦИЯ <span> калькулятор нормо-часов</span></div>
        <div class="header-spacer"></div>
        <div class="manager-block">
            <span class="icon">👤</span>
            <span>Менеджер:</span>
            <select id="managerSelect"></select>
        </div>
        <label class="theme-toggle">
            <span>🌙</span>
            <input type="checkbox" id="themeToggle">
            <span class="slider"></span>
            <span>☀️</span>
        </label>
        <a href="admin.html" class="header-btn">Админка</a>
    </div>

    <div class="main-container">
        <div class="left-panel">
            <!-- CAR SELECTOR -->
            <div class="car-selector">
                <h2>Выбор автомобиля</h2>
                <div class="car-search-wrapper">
                    <input type="text" id="globalSearch" placeholder="Поиск: модель, код ДВС, код КПП..." autocomplete="off">
                    <div class="search-dropdown" id="searchDropdown"></div>
                </div>
                <div class="select-row">
                    <div class="select-group">
                        <label>Марка</label>
                        <select id="brandSelect" disabled><option>—</option></select>
                    </div>
                    <div class="select-group">
                        <label>Модель</label>
                        <select id="modelSelect" disabled><option>—</option></select>
                    </div>
                </div>
                <div class="select-row">
                    <div class="select-group">
                        <label>Поколение</label>
                        <select id="genSelect" disabled><option>—</option></select>
                    </div>
                </div>
                <div class="select-row">
                    <div class="select-group">
                        <label>Двигатель (код / объём / л.с. / Нм)</label>
                        <select id="engineSelect" disabled><option>—</option></select>
                    </div>
                </div>
                <div class="select-row">
                    <div class="select-group">
                        <label>КПП (код / тип / передачи)</label>
                        <select id="gearboxSelect" disabled><option>—</option></select>
                    </div>
                    <div class="select-group">
                        <label>Привод</label>
                        <select id="driveSelect" disabled><option>—</option></select>
                    </div>
                </div>
            </div>

            <!-- FLUIDS -->
            <div class="fluids-panel" id="fluidsPanel">
                <h2>Заправочные объёмы и допуски</h2>
                <table class="fluids-table" id="fluidsTable"></table>
            </div>

            <!-- WORKS -->
            <div class="works-panel" id="worksPanel" style="display:none">
                <h2>Работы</h2>
                <input type="text" class="works-search" id="worksSearch" placeholder="Быстрый поиск работ..." autocomplete="off">
                <div id="worksList"></div>
            </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="right-panel">
            <div class="calc-panel" id="calcPanel">
                <h2>Расчёт</h2>
                <div id="calcBody">
                    <div class="calc-empty">Выберите работы из списка слева</div>
                </div>
                <div class="calc-buttons">
                    <button class="calc-btn primary" id="saveCalcBtn">Сохранить расчёт</button>
                    <button class="calc-btn danger" id="clearAllBtn">Стереть все поля</button>
                </div>
            </div>

            <!-- HISTORY -->
            <div class="history-section" id="historySection" style="display:none">
                <h3>История (последние 5)</h3>
                <div id="historyList"></div>
            </div>
        </div>
    </div>

    <!-- TOAST -->
    <div class="toast" id="toast">
        <div class="toast-text" id="toastText"></div>
        <div class="toast-buttons" id="toastButtons"></div>
    </div>

    <!-- VIN MODAL -->
    <div class="modal-overlay" id="vinModal">
        <div class="modal">
            <h3>Модификация не найдена</h3>
            <p>Введите VIN автомобиля и комментарий — мы добавим модификацию в базу.</p>
            <input type="text" id="vinInput" placeholder="VIN (17 символов)" maxlength="17">
            <textarea id="vinComment" placeholder="Комментарий (что за машина, что нужно добавить)"></textarea>
            <div class="modal-buttons">
                <button class="modal-btn" id="vinCancel">Отмена</button>
                <button class="modal-btn primary" id="vinSubmit">Отправить в очередь</button>
            </div>
        </div>
    </div>

    <script src="config.js"></script>
    <script src="volkswagen.js"></script>
    <script src="app.js"></script>
</body>
</html>
