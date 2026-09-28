//app\calcPage\chainCalc\config\selectors.js
export function getSelectors() {
    return {
        inputField: document.getElementById('calc-input'),
        summaryField: document.getElementById('summary-field'),
        zeroToggle: document.getElementById('zero-toggle'),
        depthToggle: document.getElementById('depth-toggle'),

        depthLeftInput: document.getElementById('depth-value-left'),
        depthRightInput: document.getElementById('depth-value-right'),

        cosToggle: document.getElementById('cos-toggle'),
        cosSelect: document.getElementById('cos-select'),

        hallskarvToggle: document.getElementById('hallskarv-toggle'),
        hsValueInput: document.getElementById('hs-value-input'),

        mirrorBtn: document.getElementById('mirror-btn'),
        btnDiskho: document.getElementById('btn-diskho'),
        btnHall: document.getElementById('btn-hall'),
        btnSkarv: document.getElementById('btn-skarv'),
        btnHallskarv: document.getElementById('btn-hallskarv'),

        btnClear: document.getElementById('btn-clear'),
        btnReloadCalc: document.getElementById('btn-reload-calc'),
        btnAddChain: document.getElementById('btn-add-chain'),
        chainsContainer: document.getElementById('chains-container')
    };
}