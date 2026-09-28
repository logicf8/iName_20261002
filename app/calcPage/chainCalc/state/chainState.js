import { getSelectors } from '../config/selectors.js';

export function getChainElements() {
    const selectors = getSelectors();
    if (!selectors.inputField) return null;
    return selectors;
}

export function getChainState() {
    const selectors = getSelectors();

    let isDepthActive = selectors.depthToggle ? selectors.depthToggle.checked : false;
    let activeRadio = document.querySelector('input[name="side-selection"]:checked');
    let side = activeRadio ? activeRadio.value : 'left';

    let depthLeftVal = parseInt(selectors.depthLeftInput ? selectors.depthLeftInput.value : "635", 10);
    let depthRightVal = parseInt(selectors.depthRightInput ? selectors.depthRightInput.value : "635", 10);
    if (isNaN(depthLeftVal)) depthLeftVal = 0;
    if (isNaN(depthRightVal)) depthRightVal = 0;

    // COS-tillstånd
    let isCosActive = selectors.cosToggle ? selectors.cosToggle.checked : false;
    let cosValue = selectors.cosSelect ? parseInt(selectors.cosSelect.value, 10) : 145;
    let activeCosDrain = document.querySelector('input[name="cos-drain-selection"]:checked');
    let cosDrain = activeCosDrain ? activeCosDrain.value : 'left';

    // Hällskarv-tillstånd
    let isHsActive = selectors.hallskarvToggle ? selectors.hallskarvToggle.checked : false;
    let hsValue = selectors.hsValueInput ? parseInt(selectors.hsValueInput.value, 10) : 560;
    if (isNaN(hsValue)) hsValue = 560;
    let activeHsSide = document.querySelector('input[name="hs-side-selection"]:checked');
    let hsSide = activeHsSide ? activeHsSide.value : 'left';

    return {
        isDepthActive,
        side,
        depthLeftVal,
        depthRightVal,

        isCosActive,
        cosValue,
        cosDrain,

        isHsActive,
        hsValue,
        hsSide
    };
}

export function resetChainStateToDefault() {
    const selectors = getSelectors();

    if (selectors.inputField) selectors.inputField.value = "";
    if (selectors.zeroToggle) selectors.zeroToggle.checked = false;
    if (selectors.depthToggle) selectors.depthToggle.checked = false;
    if (selectors.depthLeftInput) selectors.depthLeftInput.value = "635";
    if (selectors.depthRightInput) selectors.depthRightInput.value = "635";

    let defaultRadio = document.querySelector('input[name="side-selection"][value="left"]');
    if (defaultRadio) {
        defaultRadio.checked = true;
    }

    // Återställ COS
    if (selectors.cosToggle) selectors.cosToggle.checked = false;
    if (selectors.cosSelect) selectors.cosSelect.value = "145";
    let defaultCosDrain = document.querySelector('input[name="cos-drain-selection"][value="left"]');
    if (defaultCosDrain) {
        defaultCosDrain.checked = true;
    }

    // Återställ Hällskarv
    if (selectors.hallskarvToggle) selectors.hallskarvToggle.checked = false;
    if (selectors.hsValueInput) selectors.hsValueInput.value = "560";
    let defaultHsSide = document.querySelector('input[name="hs-side-selection"][value="left"]');
    if (defaultHsSide) {
        defaultHsSide.checked = true;
    }
}