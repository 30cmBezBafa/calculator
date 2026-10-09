// ============================================
// БАЗА VOLKSWAGEN
// ============================================
const volkswagenDB = {
    brand: 'Volkswagen',
    modifications: [
        {
            id: 'vw_golf7_14tsi',
            model: 'Golf',
            generation: 'VII (2012–2020)',
            engine: { code: 'CZDA', volume: '1.4 L', power: '122 л.с.', torque: '200 Нм' },
            gearbox: { code: 'DQ250', type: 'DSG (робот)', gears: 6 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.0 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 182', viscosity: '-' },
                transfer_case: null,
                diff_front: null,
                diff_rear: null,
                coolant: { volume: '7.0 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'oil_filter_check', 'air_filter', 'cabin_filter', 'fuel_filter',
                'spark_plugs', 'brake_fluid_change', 'coolant_change', 'ac_recharge',
                'timing_chain', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install',
                'gearbox_remove_install', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'gearbox_repair',
                'shock_absorbers', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'brake_caliper_refurb', 'brake_lines', 'handbrake_adjust', 'abs_sensor',
                'tie_rods', 'rack_boots', 'steering_rack', 'eps',
                'battery_under_seat', 'battery_adaptation', 'alternator', 'starter', 'ignition_coils', 'headlight_restoration', 'xenon_bulbs',
                'exhaust_flange', 'lambda_sensors', 'muffler'
            ]
        },
        {
            id: 'vw_tiguan2_20tsi',
            model: 'Tiguan',
            generation: 'II (2016–2024)',
            engine: { code: 'CZPA', volume: '2.0 L', power: '180 л.с.', torque: '320 Нм' },
            gearbox: { code: 'DQ500', type: 'DSG (робот)', gears: 7 },
            drive: 'Полный (4Motion)',
            fluids: {
                engine_oil: { volume: '5.7 л', spec: 'VW 508.00', viscosity: '0W-20' },
                gearbox_oil: { volume: '2.0 л', spec: 'VW G 052 529', viscosity: '-' },
                transfer_case: { volume: '0.9 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_front: { volume: '0.8 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_rear: { volume: '0.8 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '8.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '550 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'oil_filter_check', 'air_filter', 'cabin_filter', 'fuel_filter',
                'spark_plugs', 'brake_fluid_change', 'coolant_change', 'ac_recharge',
                'timing_chain', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install',
                'gearbox_remove_install', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'gearbox_repair',
                'transfer_case_oil', 'diff_oil_front', 'diff_oil_rear', 'haldex_oil', 'haldex_filter', 'transfer_case_remove',
                'shock_absorbers', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'brake_caliper_refurb', 'brake_lines', 'handbrake_adjust', 'abs_sensor',
                'tie_rods', 'rack_boots', 'steering_rack', 'eps',
                'battery_hood', 'battery_adaptation', 'alternator', 'starter', 'ignition_coils', 'headlight_restoration', 'xenon_bulbs',
                'exhaust_flange', 'lambda_sensors', 'dpf_clean', 'muffler'
            ]
        },
        {
            id: 'vw_polo_16mpi',
            model: 'Polo Sedan',
            generation: 'IV (2010–2020)',
            engine: { code: 'CFWA', volume: '1.6 L', power: '110 л.с.', torque: '155 Нм' },
            gearbox: { code: '02T', type: 'МКПП', gears: 5 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '3.6 л', spec: 'VW 502.00', viscosity: '5W-40' },
                gearbox_oil: { volume: '2.0 л', spec: 'VW G 052 512', viscosity: '-' },
                transfer_case: null,
                diff_front: null,
                diff_rear: null,
                coolant: { volume: '5.5 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '450 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'oil_filter_check', 'air_filter', 'cabin_filter', 'fuel_filter',
                'spark_plugs', 'brake_fluid_change', 'coolant_change', 'ac_recharge',
                'timing_belt', 'valve_clearance', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install',
                'gearbox_remove_install', 'gearbox_oil_change', 'clutch_replacement', 'dual_mass_flywheel', 'gearbox_repair',
                'shock_absorbers', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'brake_caliper_refurb', 'brake_lines', 'handbrake_adjust', 'abs_sensor',
                'tie_rods', 'rack_boots', 'steering_rack', 'power_steering_pump',
                'battery_hood', 'battery_adaptation', 'alternator', 'starter', 'ignition_coils', 'headlight_restoration',
                'exhaust_flange', 'lambda_sensors', 'muffler'
            ]
        },
        {
            id: 'vw_passat_b8_14tsi',
            model: 'Passat',
            generation: 'B8 (2014–2023)',
            engine: { code: 'CZDA', volume: '1.4 L', power: '150 л.с.', torque: '250 Нм' },
            gearbox: { code: 'DQ250', type: 'DSG (робот)', gears: 6 },
            drive: 'Передний',
            fluids: {
                engine_oil: { volume: '4.5 л', spec: 'VW 502.00 / 504.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '1.7 л', spec: 'VW G 052 182', viscosity: '-' },
                transfer_case: null,
                diff_front: null,
                diff_rear: null,
                coolant: { volume: '7.5 л', spec: 'G12evo', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: 'ЭУР — не обслуживается', spec: '-', viscosity: '-' },
                refrigerant: { volume: '525 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'oil_filter_check', 'air_filter', 'cabin_filter', 'fuel_filter',
                'spark_plugs', 'brake_fluid_change', 'coolant_change', 'ac_recharge',
                'timing_chain', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install',
                'gearbox_remove_install', 'gearbox_oil_change', 'mechatronic', 'clutch_replacement', 'dual_mass_flywheel', 'gearbox_repair',
                'shock_absorbers', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'brake_caliper_refurb', 'brake_lines', 'handbrake_adjust', 'abs_sensor',
                'tie_rods', 'rack_boots', 'steering_rack', 'eps',
                'battery_trunk', 'battery_adaptation', 'alternator', 'starter', 'ignition_coils', 'headlight_restoration', 'xenon_bulbs',
                'exhaust_flange', 'lambda_sensors', 'muffler'
            ]
        },
        {
            id: 'vw_touareg_cr_30tdi',
            model: 'Touareg',
            generation: 'CR (2010–2018)',
            engine: { code: 'CASA', volume: '3.0 L', power: '240 л.с.', torque: '550 Нм' },
            gearbox: { code: '09D', type: 'АКПП (гидротрансформатор)', gears: 8 },
            drive: 'Полный (4Motion)',
            fluids: {
                engine_oil: { volume: '8.3 л', spec: 'VW 507.00', viscosity: '5W-30' },
                gearbox_oil: { volume: '9.5 л', spec: 'VW G 055 025', viscosity: '-' },
                transfer_case: { volume: '1.1 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_front: { volume: '1.5 л', spec: 'VW G 055 145', viscosity: '-' },
                diff_rear: { volume: '1.1 л', spec: 'VW G 055 145', viscosity: '-' },
                coolant: { volume: '12.0 л', spec: 'G12+', viscosity: '-' },
                brake_fluid: { volume: '-', spec: 'DOT 4', viscosity: '-' },
                power_steering: { volume: '1.1 л', spec: 'CHF 11S', viscosity: '-' },
                refrigerant: { volume: '650 г', spec: 'R134a', viscosity: '-' }
            },
            works: [
                'oil_change', 'oil_filter_check', 'air_filter', 'cabin_filter', 'fuel_filter',
                'glow_plugs', 'brake_fluid_change', 'coolant_change', 'ac_recharge',
                'timing_chain', 'valve_cover_gasket', 'oil_pump', 'water_pump', 'thermostat', 'engine_mounts',
                'engine_remove_install',
                'gearbox_remove_install', 'gearbox_oil_change', 'gearbox_repair',
                'transfer_case_oil', 'diff_oil_front', 'diff_oil_rear', 'transfer_case_remove',
                'shock_absorbers', 'springs', 'control_arm_bushings', 'ball_joints', 'sway_bar_links', 'wheel_bearings',
                'brake_pads_front', 'brake_pads_rear', 'brake_discs_front', 'brake_discs_rear', 'brake_caliper_refurb', 'brake_lines', 'handbrake_adjust', 'abs_sensor',
                'tie_rods', 'rack_boots', 'steering_rack', 'power_steering_pump',
                'battery_trunk', 'battery_adaptation', 'alternator', 'starter', 'headlight_restoration', 'xenon_bulbs',
                'exhaust_flange', 'lambda_sensors', 'dpf_clean', 'muffler'
            ]
        }
    ]
};
