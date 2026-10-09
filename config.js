// ============================================
// КОНФИГУРАЦИЯ СИСТЕМЫ
// ============================================
const CONFIG = {
    rates: {
        engine: 3000,    // ДВС/КПП
        standard: 2500   // Остальные работы
    },
    coefficients: {
        rusty_bolts:  { label: 'Прикипевшие/ржавые болты', percent: 15 },
        aluminum:     { label: 'Алюминиевые детали',       percent: 20 },
        lpg:          { label: 'Установлено ГБО',           percent: 10 }
    },
    managers: [
        { id: 'm1', name: 'Влад' },
        { id: 'm2', name: 'Иван' },
        { id: 'm3', name: 'Сергей' }
    ],
    brands: [
        { id: 'volkswagen',  name: 'Volkswagen',  file: 'volkswagen.js' },
        { id: 'audi',        name: 'Audi',         file: 'audi.js' },
        { id: 'skoda',       name: 'Skoda',        file: 'skoda.js' },
        { id: 'seat',        name: 'SEAT',         file: 'seat.js' },
        { id: 'porsche',     name: 'Porsche',      file: 'porsche.js' },
        { id: 'bmw',         name: 'BMW',          file: 'bmw.js' },
        { id: 'mini',        name: 'Mini',         file: 'mini.js' },
        { id: 'alpine',      name: 'Alpine',       file: 'alpine.js' },
        { id: 'mercedes',    name: 'Mercedes Benz', file: 'mercedes.js' }
    ]
};

// Каталог всех возможных работ с категориями
const worksCatalog = {
    // === РЕГЛАМЕНТНЫЕ РАБОТЫ (ТО) ===
    oil_change:           { cat: 'to',  name: 'Замена моторного масла и масляного фильтра',     rateType: 'standard', nh: 0.5 },
    oil_filter_check:     { cat: 'to',  name: 'Замена масляного фильтра (отдельно)',           rateType: 'standard', nh: 0.3 },
    air_filter:           { cat: 'to',  name: 'Замена воздушного фильтра',                    rateType: 'standard', nh: 0.3 },
    cabin_filter:         { cat: 'to',  name: 'Замена салонного фильтра',                    rateType: 'standard', nh: 0.3 },
    fuel_filter:         { cat: 'to',  name: 'Замена топливного фильтра',                    rateType: 'standard', nh: 0.5 },
    spark_plugs:         { cat: 'to',  name: 'Замена свечей зажигания',                      rateType: 'standard', nh: 0.6 },
    glow_plugs:          { cat: 'to',  name: 'Замена свечей накаливания',                    rateType: 'standard', nh: 0.8 },
    brake_fluid_change:   { cat: 'to',  name: 'Замена тормозной жидкости',                   rateType: 'standard', nh: 0.4 },
    coolant_change:      { cat: 'to',  name: 'Замена охлаждающей жидкости',                 rateType: 'standard', nh: 0.5 },
    ac_recharge:         { cat: 'to',  name: 'Заправка кондиционера',                       rateType: 'standard', nh: 0.5 },

    // === ДВИГАТЕЛЬ ===
    timing_belt:         { cat: 'engine', name: 'Замена ремня ГРМ',                         rateType: 'engine',   nh: 4.0 },
    timing_chain:        { cat: 'engine', name: 'Замена цепи ГРМ',                          rateType: 'engine',   nh: 6.0 },
    valve_clearance:     { cat: 'engine', name: 'Регулировка клапанных зазоров',            rateType: 'engine',   nh: 3.0 },
    valve_cover_gasket:  { cat: 'engine', name: 'Замена прокладки клапанной крышки',         rateType: 'engine',   nh: 1.5 },
    oil_pump:            { cat: 'engine', name: 'Замена масляного насоса',                  rateType: 'engine',   nh: 4.0 },
    water_pump:          { cat: 'engine', name: 'Замена помпы',                              rateType: 'engine',   nh: 2.0 },
    thermostat:          { cat: 'engine', name: 'Замена термостата',                         rateType: 'standard', nh: 1.0 },
    engine_mounts:       { cat: 'engine', name: 'Замена опор двигателя',                    rateType: 'standard', nh: 2.5 },

    // === СНЯТИЕ/УСТАНОВКА ДВС ===
    engine_remove_install: {
        cat: 'engine_big', name: 'ДВС — Снятие/Установка',
        rateType: 'engine', nh: 12.0,
        includes: ['drain_coolant', 'remove_underguard', 'disconnect_exhaust', 'remove_drives', 'separate gearbox']
    },
    drain_coolant:       { cat: 'engine_big', name: 'Слив охлаждающей жидкости',            rateType: 'standard', nh: 0.3 },
    remove_underguard:   { cat: 'engine_big', name: 'Снятие защиты картера',                 rateType: 'standard', nh: 0.3 },
    disconnect_exhaust:   { cat: 'engine_big', name: 'Отсоединение выхлопной трассы',         rateType: 'standard', nh: 0.5 },
    remove_drives:       { cat: 'engine_big', name: 'Снятие приводов',                      rateType: 'standard', nh: 1.0 },
    separate_gearbox:    { cat: 'engine_big', name: 'Отделение КПП от ДВС',                  rateType: 'standard', nh: 1.5 },

    // === КПП ===
    gearbox_remove_install: {
        cat: 'gearbox', name: 'КПП — Снятие/Установка',
        rateType: 'engine', nh: 8.0,
        includes: ['remove_drives']
    },
    gearbox_oil_change:  { cat: 'gearbox', name: 'Замена масла КПП',                        rateType: 'standard', nh: 0.5 },
    mechatronic:         { cat: 'gearbox', name: 'Замена мехатроника',                      rateType: 'engine',   nh: 6.0 },
    clutch_replacement:  { cat: 'gearbox', name: 'Замена сцепления (DSG/робот)',            rateType: 'engine',   nh: 5.0 },
    dual_mass_flywheel:  { cat: 'gearbox', name: 'Замена двухмассового маховика',           rateType: 'engine',   nh: 5.5 },
    gearbox_repair:     { cat: 'gearbox', name: 'Ремонт КПП (без снятия)',                 rateType: 'engine',   nh: 8.0 },

    // === ПОЛНЫЙ ПРИВОД ===
    transfer_case_oil:   { cat: 'awd', name: 'Замена масла раздатки',                      rateType: 'standard', nh: 0.4 },
    diff_oil_front:      { cat: 'awd', name: 'Замена масла переднего редуктора',          rateType: 'standard', nh: 0.4 },
    diff_oil_rear:       { cat: 'awd', name: 'Замена масла заднего редуктора',             rateType: 'standard', nh: 0.4 },
    haldex_oil:         { cat: 'awd', name: 'Замена масла Haldex',                         rateType: 'standard', nh: 0.5 },
    haldex_filter:      { cat: 'awd', name: 'Замена фильтра Haldex',                       rateType: 'standard', nh: 0.5 },
    transfer_case_remove: { cat: 'awd', name: 'Снятие/Установка раздатки',                 rateType: 'engine',   nh: 4.0 },

    // === ПОДВЕСКА ===
    shock_absorbers:     { cat: 'suspension', name: 'Замена амортизаторов (пара)',          rateType: 'standard', nh: 1.5 },
    springs:            { cat: 'suspension', name: 'Замена пружин (пара)',                 rateType: 'standard', nh: 2.0 },
    control_arm_bushings: { cat: 'suspension', name: 'Замена сайлентблоков рычагов',       rateType: 'standard', nh: 2.0 },
    ball_joints:        { cat: 'suspension', name: 'Замена шаровых опор',                 rateType: 'standard', nh: 1.5 },
    sway_bar_links:     { cat: 'suspension', name: 'Замена стоек стабилизатора',           rateType: 'standard', nh: 0.5 },
    wheel_bearings:     { cat: 'suspension', name: 'Замена ступичных подшипников',        rateType: 'standard', nh: 1.5 },

    // === ТОРМОЗА ===
    brake_pads_front:    { cat: 'brakes', name: 'Замена тормозных колодок (перед)',        rateType: 'standard', nh: 0.5 },
    brake_pads_rear:     { cat: 'brakes', name: 'Замена тормозных колодок (зад)',         rateType: 'standard', nh: 0.6 },
    brake_discs_front:   { cat: 'brakes', name: 'Замена тормозных дисков (перед, пара)',   rateType: 'standard', nh: 1.0 },
    brake_discs_rear:    { cat: 'brakes', name: 'Замена тормозных дисков (зад, пара)',    rateType: 'standard', nh: 1.2 },
    brake_caliper_refurb: { cat: 'brakes', name: 'Ремонт тормозного суппорта',             rateType: 'standard', nh: 1.5 },
    brake_lines:        { cat: 'brakes', name: 'Замена тормозных шлангов',                rateType: 'standard', nh: 0.8 },
    handbrake_adjust:   { cat: 'brakes', name: 'Регулировка ручного тормоза',            rateType: 'standard', nh: 0.4 },
    abs_sensor:         { cat: 'brakes', name: 'Замена датчика ABS',                      rateType: 'standard', nh: 0.3 },

    // === РУЛЕВОЕ УПРАВЛЕНИЕ ===
    tie_rods:           { cat: 'steering', name: 'Замена рулевых тяг/наконечников',        rateType: 'standard', nh: 1.0 },
    rack_boots:         { cat: 'steering', name: 'Замена пыльников рулевой рейки',         rateType: 'standard', nh: 1.5 },
    steering_rack:      { cat: 'steering', name: 'Замена рулевой рейки',                  rateType: 'engine',   nh: 4.0 },
    power_steering_pump: { cat: 'steering', name: 'Замена насоса ГУР',                    rateType: 'standard', nh: 2.0 },
    eps:               { cat: 'steering', name: 'Замена ЭУР',                           rateType: 'standard', nh: 2.5 },

    // === ЭЛЕКТРИКА ===
    battery_under_seat:  { cat: 'electrics', name: 'Замена АКБ (под сиденьем)',            rateType: 'standard', nh: 0.5 },
    battery_trunk:      { cat: 'electrics', name: 'Замена АКБ (в багажнике)',              rateType: 'standard', nh: 0.5 },
    battery_hood:       { cat: 'electrics', name: 'Замена АКБ (под капотом)',              rateType: 'standard', nh: 0.3 },
    battery_adaptation:  { cat: 'electrics', name: 'Адаптация АКБ',                       rateType: 'standard', nh: 0.4 },
    alternator:         { cat: 'electrics', name: 'Замена генератора',                     rateType: 'engine',   nh: 2.5 },
    starter:            { cat: 'electrics', name: 'Замена стартера',                       rateType: 'engine',   nh: 2.0 },
    ignition_coils:     { cat: 'electrics', name: 'Замена катушек зажигания',              rateType: 'standard', nh: 0.4 },
    headlight_restoration: { cat: 'electrics', name: 'Полировка фар',                     rateType: 'standard', nh: 1.5 },
    xenon_bulbs:        { cat: 'electrics', name: 'Замена ксеноновых ламп',                rateType: 'standard', nh: 0.5 },

    // === ВЫХЛОПНАЯ СИСТЕМА ===
    exhaust_flange:     { cat: 'exhaust', name: 'Замена прокладки приёмной трубы',        rateType: 'standard', nh: 0.5 },
    lambda_sensors:     { cat: 'exhaust', name: 'Замена лямбда-зондов',                   rateType: 'standard', nh: 1.0 },
    dpf_clean:         { cat: 'exhaust', name: 'Профилактика/удаление DPF',               rateType: 'engine',   nh: 4.0 },
    muffler:           { cat: 'exhaust', name: 'Замена глушителя',                       rateType: 'standard', nh: 1.5 }
};

const categories = {
    'to':           'Регламентные работы (ТО)',
    'engine':       'Двигатель',
    'engine_big':   'Снятие/Установка ДВС',
    'gearbox':      'Коробка передач',
    'awd':          'Полный привод',
    'suspension':   'Подвеска',
    'brakes':       'Тормоза',
    'steering':     'Рулевое управление',
    'electrics':    'Электрика',
    'exhaust':      'Выхлопная система'
};

// Валидация: проверка что все workId в базах существуют в каталоге
function validateWorks(brandData, brandName) {
    const errors = [];
    if (!brandData || !brandData.modifications) return errors;
    brandData.modifications.forEach((mod, i) => {
        if (!mod.works) return;
        mod.works.forEach(workId => {
            if (!worksCatalog[workId]) {
                errors.push(`[${brandName}] Модификация #${i} (${mod.model || '?'}): неизвестный workId "${workId}"`);
            }
        });
    });
    return errors;
}
