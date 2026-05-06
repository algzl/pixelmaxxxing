const imageInput = document.getElementById("image-input");
const chooseImageButton = document.getElementById("choose-image-button");
const chosenImageName = document.getElementById("chosen-image-name");
const mosaicColumnsInput = document.getElementById("mosaic-columns");
const mosaicRowsInput = document.getElementById("mosaic-rows");
const mosaicTileWidthInput = document.getElementById("mosaic-tile-width");
const mosaicTileHeightInput = document.getElementById("mosaic-tile-height");
const mosaicShapeInput = document.getElementById("mosaic-shape");
const mosaicGapXInput = document.getElementById("mosaic-gap-x");
const mosaicGapYInput = document.getElementById("mosaic-gap-y");
const mosaicBlurInput = document.getElementById("mosaic-blur");
const mosaicBlurValue = document.getElementById("mosaic-blur-value");
const paletteCountInput = document.getElementById("palette-count");
const thresholdInput = document.getElementById("threshold");
const thresholdValue = document.getElementById("threshold-value");
const selectionStatus = document.getElementById("selection-status");
const selectSimilarButton = document.getElementById("select-similar-button");
const invertSelectionButton = document.getElementById("invert-selection-button");
const clearSelectionButton = document.getElementById("clear-selection-button");
const analyzeButton = document.getElementById("analyze-button");
const exportSvgButton = document.getElementById("export-svg-button");
const exportPngButton = document.getElementById("export-png-button");
const exportJpgButton = document.getElementById("export-jpg-button");
const datamoshDirectionInput = document.getElementById("datamosh-direction");
const datamoshAmountInput = document.getElementById("datamosh-amount");
const applyDatamoshButton = document.getElementById("apply-datamosh-button");
const paletteList = document.getElementById("palette-list");
const paletteSummary = document.getElementById("palette-summary");
const mosaicSummary = document.getElementById("mosaic-summary");
const replacementColorInput = document.getElementById("replacement-color");
const tileFillTextInput = document.getElementById("tile-fill-text");
const tileFillFontFamilyInput = document.getElementById("tile-fill-font-family");
const tileFillEmojiInput = document.getElementById("tile-fill-emoji");
const tileFillColorInput = document.getElementById("tile-fill-color");
const tileFillRemoveBgInput = document.getElementById("tile-fill-remove-bg");
const addTileFillFontButton = document.getElementById("add-tile-fill-font-button");
const tileFillCustomFontInput = document.getElementById("tile-fill-custom-font-input");
const applyTileTextFillButton = document.getElementById("apply-tile-text-fill-button");
const applyTileEmojiFillButton = document.getElementById("apply-tile-emoji-fill-button");
const applyReplaceButton = document.createElement("button");
const confirmReplaceButton = document.getElementById("confirm-replace-button");
const textContentInput = document.getElementById("text-content");
const textLayerList = document.getElementById("text-layer-list");
const textFontFamilyInput = document.getElementById("text-font-family");
const textSizeInput = document.getElementById("text-size");
const textColorInput = document.getElementById("text-color");
const textFontWeightInput = document.getElementById("text-font-weight");
const textFontStyleInput = document.getElementById("text-font-style");
const addCustomFontButton = document.getElementById("add-custom-font-button");
const customFontInput = document.getElementById("custom-font-input");
const emojiPickerInput = document.getElementById("emoji-picker");
const addTextButton = document.getElementById("add-text-button");
const addEmojiButton = document.getElementById("add-emoji-button");
const insertEmojiIntoTextButton = document.getElementById("insert-emoji-into-text-button");
const processTextButton = document.getElementById("process-text-button");
const applyTextProcessButton = document.getElementById("apply-text-process-button");
const removeTextButton = document.getElementById("remove-text-button");
const deleteTextButton = document.getElementById("delete-text-button");
const textStatus = document.getElementById("text-status");
const resetButton = document.getElementById("reset-button");
const resetMosaicButton = document.getElementById("reset-mosaic-button");
const zoomOutButton = document.getElementById("zoom-out-button");
const zoomInButton = document.getElementById("zoom-in-button");
const zoomResetButton = document.getElementById("zoom-reset-button");
const zoomValue = document.getElementById("zoom-value");
const selectionPreviewOnButton = document.getElementById("selection-preview-on-button");
const selectionPreviewOffButton = document.getElementById("selection-preview-off-button");
const refreshPreviewButton = document.getElementById("refresh-preview-button");
const bgTransparentButton = document.getElementById("bg-transparent-button");
const bgWhiteButton = document.getElementById("bg-white-button");
const bgBlackButton = document.getElementById("bg-black-button");
const bgCustomButton = document.getElementById("bg-custom-button");
const bgCustomColorInput = document.getElementById("bg-custom-color");
const modeSelectButton = document.getElementById("mode-select-button");
const modeMoveButton = document.getElementById("mode-move-button");
const frameNoneButton = document.getElementById("frame-none-button");
const frameSquareButton = document.getElementById("frame-square-button");
const frameLandscapeButton = document.getElementById("frame-landscape-button");
const framePortraitButton = document.getElementById("frame-portrait-button");
const canvasFrame = document.querySelector(".canvas-frame");
const previewStage = document.getElementById("preview-stage");
const previewCanvas = document.getElementById("preview-canvas");
const emptyState = document.getElementById("empty-state");
const hoverInfo = document.getElementById("hover-info");
const imageSizeInfo = document.getElementById("image-size-info");
const appTitle = document.getElementById("app-title");

const previewContext = previewCanvas.getContext("2d");
const DEFAULT_MOSAIC_COLUMNS = 175;
const DEFAULT_MOSAIC_ROWS = 175;
const DEFAULT_PALETTE_COUNT = 8;
const DEFAULT_TILE_SIZE = 20;
const DEFAULT_GAP_X = 0;
const DEFAULT_GAP_Y = 0;
const DEFAULT_BLUR = 0;
const ANALYZE_DEBOUNCE_MS = 120;
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.2;
const DRAG_THRESHOLD = 8;
const MAX_SELECTION_HISTORY = 80;
const MAX_APP_HISTORY = 20;
const DEFAULT_TEXT_SIZE = 72;
const EMOJI_FONT_STACK = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
const DEFAULT_FRAME_PRESET = "none";

const state = {
  image: null,
  objectUrl: null,
  originalImageData: null,
  workingImageData: null,
  mosaicTiles: [],
  mosaicSettings: null,
  autoPalette: [],
  customPalette: [],
  palette: [],
  activeColorIndex: -1,
  hoveredTileIndex: -1,
  selectedTileIndices: new Set(),
  selectionReferenceColor: null,
  selectionMode: "none",
  selectionVersion: 0,
  selectionUndoStack: [],
  appUndoStack: [],
  dragSelection: null,
  dragImage: null,
  textOverlays: [],
  processedTextOverlays: [],
  activeTextId: null,
  activeProcessedTextId: null,
  activeProcessedTextSource: null,
  hoveredTextId: null,
  dragText: null,
  textProcessSession: null,
  customFonts: [],
  mosaicShape: "square",
  mosaicInputMode: "count",
  mosaicGapX: 0,
  mosaicGapY: 0,
  mosaicBlur: 0,
  showSelectionPreview: false,
  previewBackgroundMode: "transparent",
  previewBackgroundColor: "#ff6b35",
  interactionMode: "select",
  framePreset: DEFAULT_FRAME_PRESET,
  frameWidth: 1,
  frameHeight: 1,
  imageOffsetX: 0,
  imageOffsetY: 0,
  zoom: DEFAULT_ZOOM,
  fitZoom: DEFAULT_ZOOM,
  analyzeTimer: null,
  thresholdTimer: null,
  resizeTimer: null,
  renderFrame: null,
  activeSelectionCache: {
    signature: "",
    indices: [],
    set: new Set()
  },
  similarityCache: {
    signature: "",
    distances: []
  },
  renderCache: {
    canvas: document.createElement("canvas"),
    signature: "",
    selectedTiles: 0
  }
};

appTitle.textContent = window.desktopApp?.appName || "pixelmaxxxing";
if (modeMoveButton) {
  modeMoveButton.textContent = "Transform";
}
thresholdValue.textContent = thresholdInput.value;
mosaicBlurValue.textContent = mosaicBlurInput.value;
state.mosaicShape = mosaicShapeInput.value;
state.mosaicGapX = Number(mosaicGapXInput.value);
state.mosaicGapY = Number(mosaicGapYInput.value);
state.mosaicBlur = Number(mosaicBlurInput.value);
zoomValue.textContent = formatZoom(DEFAULT_ZOOM);
updateSelectionPreviewToggleUI();
updateSelectionUi();
imageSizeInfo.textContent = "No image loaded";
applyPreviewBackground();
updateTextUi();
updateInteractionModeUi();
updateFramePresetUi();

thresholdInput.addEventListener("input", () => {
  thresholdValue.textContent = thresholdInput.value;

  if (!state.mosaicTiles.length) {
    return;
  }

  scheduleThresholdRefresh();
});

[mosaicColumnsInput, mosaicRowsInput].forEach((input) => {
  input.addEventListener("input", () => {
    state.mosaicInputMode = "count";
    scheduleAnalyze();
  });
});

[mosaicTileWidthInput, mosaicTileHeightInput].forEach((input) => {
  input.addEventListener("input", () => {
    state.mosaicInputMode = "size";
    scheduleAnalyze();
  });
});

[paletteCountInput, mosaicShapeInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input === mosaicShapeInput) {
      state.mosaicShape = mosaicShapeInput.value;
    }

    scheduleAnalyze();
  });
});

[mosaicGapXInput, mosaicGapYInput].forEach((input) => {
  input.addEventListener("input", () => {
    state.mosaicGapX = clampNumber(Number(mosaicGapXInput.value), 0);
    state.mosaicGapY = clampNumber(Number(mosaicGapYInput.value), 0);
    invalidateRenderCache();
    requestPreviewRender();
  });
});

mosaicBlurInput.addEventListener("input", () => {
  mosaicBlurValue.textContent = mosaicBlurInput.value;
  state.mosaicBlur = clampNumber(Number(mosaicBlurInput.value), 0);
  invalidateRenderCache();
  requestPreviewRender();
});

imageInput.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];

  if (!file) {
    return;
  }

  if (chosenImageName) {
    chosenImageName.textContent = file.name;
  }

  if (state.objectUrl) {
    URL.revokeObjectURL(state.objectUrl);
  }

  state.objectUrl = URL.createObjectURL(file);
  state.image = await loadImage(state.objectUrl);
  state.autoPalette = [];
  state.customPalette = [];
  state.palette = [];
  state.mosaicTiles = [];
  state.mosaicSettings = null;
  state.textProcessSession = null;
  state.textOverlays = [];
  state.processedTextOverlays = [];
  state.activeTextId = null;
  state.activeProcessedTextId = null;
  state.hoveredTextId = null;
  state.dragText = null;
  state.appUndoStack = [];
  updateTextUi();
  state.activeColorIndex = -1;
  state.hoveredTileIndex = -1;
  state.mosaicShape = mosaicShapeInput.value;
  state.mosaicGapX = clampNumber(Number(mosaicGapXInput.value), 0);
  state.mosaicGapY = clampNumber(Number(mosaicGapYInput.value), 0);
  state.mosaicBlur = clampNumber(Number(mosaicBlurInput.value), 0);
  clearExplicitSelection({ skipRender: true, keepPreviewState: false });
  state.showSelectionPreview = false;
  state.zoom = DEFAULT_ZOOM;
  state.fitZoom = DEFAULT_ZOOM;
  updateSelectionPreviewToggleUI();
  paletteList.innerHTML = "";
  imageSizeInfo.textContent = `${state.image.width} x ${state.image.height} px`;
  paletteSummary.textContent = "Image loaded. Palette is ready.";
  mosaicSummary.textContent = "Mosaic ready";
  hoverInfo.textContent = "Choose a color to preview matching mosaic tiles.";
  prepareCanvas();
  drawLoadedImage();
  analyzeImage();
});

chooseImageButton?.addEventListener("click", () => {
  imageInput.click();
});

analyzeButton.addEventListener("click", () => {
  if (!state.workingImageData) {
    paletteSummary.textContent = "Choose an image first.";
    return;
  }

  analyzeImage();
});

exportSvgButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Create mosaic tiles before exporting SVG.";
    return;
  }

  exportSvg();
});

exportPngButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Create mosaic tiles before exporting PNG.";
    return;
  }

  exportRaster("png");
});

exportJpgButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Create mosaic tiles before exporting JPG.";
    return;
  }

  exportRaster("jpg");
});

applyReplaceButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Analyze the image before replacing colors.";
    return;
  }

  state.showSelectionPreview = false;
  updateSelectionPreviewToggleUI();
  applyReplacement();
});

applyDatamoshButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Analyze the image before using pixel shift.";
    return;
  }

  pushAppHistory();
  applyDatamosh();
});

selectSimilarButton.addEventListener("click", () => {
  if (!state.selectedTileIndices.size) {
    return;
  }

  const referenceColor = getDominantColorFromTileIndices(getSelectedTileIndicesArray());

  if (!referenceColor) {
    return;
  }

  pushSelectionHistory();
  focusColorInPalette(referenceColor);
  enableSelectionPreviewFromSelectionAction();
  selectSimilarTilesByReference(referenceColor);
  paletteSummary.textContent =
    `${rgbToHex(referenceColor.r, referenceColor.g, referenceColor.b)} selected as the reference. Similar tiles were added.`;
});

clearSelectionButton.addEventListener("click", () => {
  pushSelectionHistory();
  clearExplicitSelection();
  paletteSummary.textContent = "Mosaic selection cleared.";
});

invertSelectionButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    return;
  }

  invertCurrentSelection();
});

applyReplaceButton.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (typeof replacementColorInput.showPicker === "function") {
      replacementColorInput.showPicker();
    } else {
      replacementColorInput.click();
    }
  },
  true
);

confirmReplaceButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Analyze the image before replacing colors.";
    return;
  }

  pushAppHistory();
  applyReplacement();
});

resetButton.addEventListener("click", () => {
  if (!state.originalImageData) {
    return;
  }

  pushAppHistory();
  state.workingImageData = cloneImageData(state.originalImageData);
  state.hoveredTileIndex = -1;
  clearExplicitSelection({ skipRender: true });
  analyzeImage();
});

resetMosaicButton.addEventListener("click", () => {
  mosaicColumnsInput.value = String(DEFAULT_MOSAIC_COLUMNS);
  mosaicRowsInput.value = String(DEFAULT_MOSAIC_ROWS);
  paletteCountInput.value = String(DEFAULT_PALETTE_COUNT);
  mosaicTileWidthInput.value = String(DEFAULT_TILE_SIZE);
  mosaicTileHeightInput.value = String(DEFAULT_TILE_SIZE);
  mosaicShapeInput.value = "square";
  mosaicGapXInput.value = String(DEFAULT_GAP_X);
  mosaicGapYInput.value = String(DEFAULT_GAP_Y);
  mosaicBlurInput.value = String(DEFAULT_BLUR);
  mosaicBlurValue.textContent = String(DEFAULT_BLUR);
  state.mosaicShape = "square";
  state.mosaicInputMode = "count";
  state.mosaicGapX = DEFAULT_GAP_X;
  state.mosaicGapY = DEFAULT_GAP_Y;
  state.mosaicBlur = DEFAULT_BLUR;
  state.showSelectionPreview = false;
  updateSelectionPreviewToggleUI();
  clearExplicitSelection({ skipRender: true, keepPreviewState: true });

  if (!state.workingImageData) {
    mosaicSummary.textContent = `${DEFAULT_MOSAIC_COLUMNS} x ${DEFAULT_MOSAIC_ROWS} tiles`;
    updateSelectionUi();
    return;
  }

  analyzeImage();
});

zoomInButton.addEventListener("click", () => {
  setZoom(Math.min(state.zoom * ZOOM_STEP, MAX_ZOOM));
});

zoomOutButton.addEventListener("click", () => {
  setZoom(Math.max(state.zoom / ZOOM_STEP, MIN_ZOOM));
});

zoomResetButton.addEventListener("click", () => {
  state.zoom = DEFAULT_ZOOM;
  if (state.image) {
    centerImageInFrame();
  }
  applyZoom();
  requestPreviewRender();
});

selectionPreviewOnButton.addEventListener("click", () => {
  setSelectionPreviewVisibility(true);
});

selectionPreviewOffButton.addEventListener("click", () => {
  setSelectionPreviewVisibility(false);
});

refreshPreviewButton.addEventListener("click", () => {
  pushSelectionHistory();
  refreshPreviewCanvas({
    summaryMessage: "Preview refreshed. Selection outlines are hidden."
  });
});

bgTransparentButton.addEventListener("click", () => {
  setPreviewBackgroundMode("transparent");
});

bgWhiteButton.addEventListener("click", () => {
  setPreviewBackgroundMode("white");
});

bgBlackButton.addEventListener("click", () => {
  setPreviewBackgroundMode("black");
});

bgCustomButton.addEventListener("click", () => {
  setPreviewBackgroundMode("custom");
  bgCustomColorInput.click();
});

bgCustomColorInput.addEventListener("input", () => {
  state.previewBackgroundColor = bgCustomColorInput.value;
  setPreviewBackgroundMode("custom");
});

tileFillRemoveBgInput?.addEventListener("change", () => {
  syncSelectedTileFillBackgroundRemoval(Boolean(tileFillRemoveBgInput.checked));
});

modeSelectButton.addEventListener("click", () => {
  setInteractionMode("select");
});

modeMoveButton.addEventListener("click", () => {
  setInteractionMode("move");
});

frameNoneButton.addEventListener("click", () => {
  setFramePreset("none");
});

frameSquareButton.addEventListener("click", () => {
  setFramePreset("square");
});

frameLandscapeButton.addEventListener("click", () => {
  setFramePreset("landscape");
});

framePortraitButton.addEventListener("click", () => {
  setFramePreset("portrait");
});

addTextButton.addEventListener("click", () => {
  pushAppHistory();
  addOrUpdateTextOverlay();
});

addEmojiButton.addEventListener("click", () => {
  pushAppHistory();
  addEmojiOverlay();
});

addCustomFontButton?.addEventListener("click", () => {
  customFontInput?.click();
});

addTileFillFontButton?.addEventListener("click", () => {
  tileFillCustomFontInput?.click();
});

customFontInput?.addEventListener("change", async () => {
  const [fontFile] = customFontInput.files || [];

  if (!fontFile) {
    return;
  }

  try {
    const familyName = await registerCustomFont(fontFile);
    const optionValue = `'${familyName}', sans-serif`;

    ensureCustomFontOption(familyName, optionValue);
    textFontFamilyInput.value = optionValue;
    syncActiveTextOverlayFromControls();
    textStatus.textContent = `${familyName} loaded. You can use it in text right away.`;
  } catch (error) {
    console.error(error);
    textStatus.textContent = "Font could not be loaded. Try another .ttf, .otf, .woff, or .woff2 file.";
  } finally {
    customFontInput.value = "";
  }
});

tileFillCustomFontInput?.addEventListener("change", async () => {
  const [fontFile] = tileFillCustomFontInput.files || [];

  if (!fontFile) {
    return;
  }

  try {
    const familyName = await registerCustomFont(fontFile);
    const optionValue = `'${familyName}', sans-serif`;

    ensureCustomFontOption(familyName, optionValue);
    if (tileFillFontFamilyInput) {
      tileFillFontFamilyInput.value = optionValue;
    }
    paletteSummary.textContent = `${familyName} loaded for tile fill.`;
  } catch (error) {
    console.error(error);
    paletteSummary.textContent = "Custom fill font could not be loaded.";
  } finally {
    tileFillCustomFontInput.value = "";
  }
});

insertEmojiIntoTextButton?.addEventListener("click", () => {
  const emoji = emojiPickerInput.value?.trim();

  if (!emoji) {
    textStatus.textContent = "Choose an emoji first.";
    return;
  }

  textContentInput.value = `${textContentInput.value || ""}${emoji}`;
  syncActiveTextOverlayFromControls();
  textStatus.textContent = "Emoji inserted into the text.";
});

processTextButton?.addEventListener("click", () => {
  toggleTextProcessing();
});

applyTextProcessButton?.addEventListener("click", () => {
  applyProcessedTextToImage();
});

removeTextButton?.addEventListener("click", () => {
  toggleTextProcessing();
});

deleteTextButton?.addEventListener("click", () => {
  removeActiveTextOverlay();
});

textContentInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addOrUpdateTextOverlay();
  }
});

textContentInput.addEventListener("input", () => {
  syncActiveTextOverlayFromControls();
});

textLayerList?.addEventListener("click", (event) => {
  const layerButton = event.target.closest("[data-text-layer-id]");

  if (!layerButton) {
    return;
  }

  const { textLayerId, textLayerSource } = layerButton.dataset;

  if (!textLayerId) {
    return;
  }

  if (textLayerSource === "editable") {
    selectTextLayer(textLayerId);
    return;
  }

  state.activeTextId = null;
  state.activeProcessedTextId = textLayerId;
  state.activeProcessedTextSource = textLayerSource || "processed";
  state.hoveredTextId = null;
  setInteractionMode("move");
  updateTextUi();
  requestPreviewRender();
});

textSizeInput.addEventListener("input", () => {
  syncActiveTextOverlayFromControls();
});

textFontWeightInput?.addEventListener("change", () => {
  syncActiveTextOverlayFromControls();
});

textFontStyleInput?.addEventListener("change", () => {
  syncActiveTextOverlayFromControls();
});

textFontFamilyInput.addEventListener("change", () => {
  syncActiveTextOverlayFromControls();
});

textColorInput.addEventListener("input", () => {
  syncActiveTextOverlayFromControls();
});

window.addEventListener("keydown", (event) => {
  const isUndoShortcut = (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "z";

  if (!isUndoShortcut || shouldIgnoreUndoShortcut(event.target)) {
    return;
  }

  if (undoSelectionChange()) {
    event.preventDefault();
  }
});

previewCanvas.addEventListener("mousemove", (event) => {
  if ((!state.mosaicTiles.length && !state.image) || state.dragSelection?.active || state.dragText?.active || state.dragImage?.active) {
    return;
  }

  const point = getCanvasPointFromEvent(event);
  const imagePoint = framePointToImagePoint(point);
  const hoveredTextId = getTextOverlayIdFromPoint(point.x, point.y);

  if (state.interactionMode === "move") {
    state.hoveredTileIndex = -1;
    state.hoveredTextId = hoveredTextId || null;
    previewCanvas.style.cursor = hoveredTextId ? "move" : "grab";
    requestPreviewRender();
    return;
  }

  if (hoveredTextId) {
    if (hoveredTextId === state.hoveredTextId) {
      previewCanvas.style.cursor = "move";
      return;
    }

    state.hoveredTextId = hoveredTextId;
    state.hoveredTileIndex = -1;
    previewCanvas.style.cursor = "move";
    requestPreviewRender();
    return;
  }

  state.hoveredTextId = null;
  const nextHoveredTileIndex = getTileIndexFromPoint(imagePoint.x, imagePoint.y);

  if (nextHoveredTileIndex === state.hoveredTileIndex) {
    previewCanvas.style.cursor = "crosshair";
    return;
  }

  state.hoveredTileIndex = nextHoveredTileIndex;
  previewCanvas.style.cursor = state.interactionMode === "move" ? "grab" : "crosshair";
  requestPreviewRender();
});

previewCanvas.addEventListener("mousedown", (event) => {
  if (event.button !== 0 || (!state.mosaicTiles.length && !state.image)) {
    return;
  }

  const point = getCanvasPointFromEvent(event);
  const textId = getTextOverlayIdFromPoint(point.x, point.y);

  if (textId && state.interactionMode !== "move") {
    selectTextLayer(textId);
    setInteractionMode("move");
    beginTextDrag(event, textId, point);
    return;
  }

  if (state.interactionMode === "move") {
    if (textId) {
      beginTextDrag(event, textId, point);
      return;
    }

    beginImageDrag(event, point);
    return;
  }

  beginCanvasSelectionDrag(event);
});

window.addEventListener("mousemove", (event) => {
  if (state.dragText?.active) {
    updateTextDrag(event);
    return;
  }

  if (state.dragImage?.active) {
    updateImageDrag(event);
    return;
  }

  if (!state.dragSelection?.active) {
    return;
  }

  updateCanvasSelectionDrag(event);
});

window.addEventListener("mouseup", (event) => {
  if (state.dragText?.active) {
    endTextDrag(event);
    return;
  }

  if (state.dragImage?.active) {
    endImageDrag(event);
    return;
  }

  if (!state.dragSelection?.active) {
    return;
  }

  endCanvasSelectionDrag(event);
});

window.addEventListener("resize", () => {
  if (!state.image) {
    return;
  }

  clearTimeout(state.resizeTimer);
  state.resizeTimer = window.setTimeout(() => {
    fitCanvasToFrame({ preserveManualZoom: true });
  }, 60);
});

previewCanvas.addEventListener("mouseleave", () => {
  if (state.dragSelection?.active || state.dragText?.active || state.dragImage?.active) {
    return;
  }

  state.hoveredTextId = null;

  if (state.hoveredTileIndex === -1) {
    previewCanvas.style.cursor = state.interactionMode === "move" ? "grab" : "crosshair";
    return;
  }

  state.hoveredTileIndex = -1;
  previewCanvas.style.cursor = state.interactionMode === "move" ? "grab" : "crosshair";
  requestPreviewRender();
});

function scheduleAnalyze() {
  clearTimeout(state.analyzeTimer);
  state.analyzeTimer = setTimeout(() => {
    if (state.workingImageData && canAnalyzeWithCurrentInputs()) {
      analyzeImage();
    }
  }, ANALYZE_DEBOUNCE_MS);
}

function scheduleThresholdRefresh() {
  if (state.thresholdTimer) {
    return;
  }

  state.thresholdTimer = window.requestAnimationFrame(() => {
    state.thresholdTimer = null;

    if (state.selectionMode === "similar" && state.selectionReferenceColor) {
      enableSelectionPreviewFromSelectionAction();
      refreshSelectionFromReference();
      return;
    }

    if (state.selectedTileIndices.size === 1 && state.selectionReferenceColor) {
      enableSelectionPreviewFromSelectionAction();
      invalidateSelectionCaches();
      invalidateRenderCache();
      requestPreviewRender();
      updateSelectionUi();
      return;
    }

    if (!state.selectedTileIndices.size && state.activeColorIndex >= 0) {
      enableSelectionPreviewFromSelectionAction();
      invalidateSelectionCaches();
      invalidateRenderCache();
      requestPreviewRender();
      return;
    }

    updateHoverInfo();
  });
}

function requestPreviewRender() {
  if (state.renderFrame) {
    return;
  }

  state.renderFrame = window.requestAnimationFrame(() => {
    state.renderFrame = null;
    drawPreview();
  });
}

function invalidateRenderCache() {
  state.renderCache.signature = "";
}

function invalidateSelectionCaches() {
  state.activeSelectionCache.signature = "";
  state.activeSelectionCache.indices = [];
  state.activeSelectionCache.set = new Set();
  state.similarityCache.signature = "";
  state.similarityCache.distances = [];
}

function createSelectionSnapshot() {
  return {
    selectedTileIndices: Array.from(state.selectedTileIndices),
    selectionReferenceColor: state.selectionReferenceColor
      ? { ...state.selectionReferenceColor }
      : null,
    selectionMode: state.selectionMode,
    showSelectionPreview: state.showSelectionPreview,
    activeColorIndex: state.activeColorIndex
  };
}

function cloneMosaicTiles(tiles) {
  return tiles.map((tile) => ({
    ...tile,
    color: tile.color ? { ...tile.color } : tile.color,
    fillContent: tile.fillContent || "",
    fillType: tile.fillType || null,
    fillColor: tile.fillColor || null,
    fillFontFamily: tile.fillFontFamily || "'Space Mono', monospace",
    fillRemoveBackground: Boolean(tile.fillRemoveBackground)
  }));
}

function createAppSnapshot(options = {}) {
  const { full = true } = options;
  const snapshot = {
    snapshotKind: full ? "full" : "light",
    textOverlays: cloneTextOverlayArray(state.textOverlays),
    processedTextOverlays: cloneTextOverlayArray(state.processedTextOverlays),
    activeTextId: state.activeTextId,
    activeProcessedTextId: state.activeProcessedTextId,
    activeProcessedTextSource: state.activeProcessedTextSource,
    hoveredTextId: state.hoveredTextId,
    selectedTileIndices: Array.from(state.selectedTileIndices),
    selectionReferenceColor: state.selectionReferenceColor ? { ...state.selectionReferenceColor } : null,
    selectionMode: state.selectionMode,
    showSelectionPreview: state.showSelectionPreview,
    activeColorIndex: state.activeColorIndex,
    imageOffsetX: state.imageOffsetX,
    imageOffsetY: state.imageOffsetY,
    zoom: state.zoom,
    interactionMode: state.interactionMode
  };

  if (state.textProcessSession) {
    snapshot.textProcessSession = {
      textOverlays: cloneTextOverlayArray(state.textProcessSession.textOverlays),
      activeTextId: state.textProcessSession.activeTextId,
      hoveredTextId: state.textProcessSession.hoveredTextId,
      customPalette: clonePaletteArray(state.textProcessSession.customPalette)
    };

    if (full) {
      snapshot.textProcessSession.workingImageData = cloneImageData(state.textProcessSession.workingImageData);
    }
  } else {
    snapshot.textProcessSession = null;
  }

  if (full) {
    snapshot.workingImageData = state.workingImageData ? cloneImageData(state.workingImageData) : null;
    snapshot.mosaicTiles = cloneMosaicTiles(state.mosaicTiles);
    snapshot.autoPalette = clonePaletteArray(state.autoPalette);
    snapshot.customPalette = clonePaletteArray(state.customPalette);
    snapshot.palette = clonePaletteArray(state.palette);
  }

  return snapshot;
}

function pushAppHistory(options = {}) {
  const snapshot = createAppSnapshot(options);
  state.appUndoStack.push(snapshot);

  if (state.appUndoStack.length > MAX_APP_HISTORY) {
    state.appUndoStack.shift();
  }
}

function pushSelectionHistory() {
  pushAppHistory({ full: false });
  const snapshot = createSelectionSnapshot();
  const previous = state.selectionUndoStack[state.selectionUndoStack.length - 1];

  if (previous && JSON.stringify(previous) === JSON.stringify(snapshot)) {
    return;
  }

  state.selectionUndoStack.push(snapshot);

  if (state.selectionUndoStack.length > MAX_SELECTION_HISTORY) {
    state.selectionUndoStack.shift();
  }
}

function shouldIgnoreUndoShortcut(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function restoreSelectionSnapshot(snapshot) {
  state.selectedTileIndices = new Set(snapshot.selectedTileIndices);
  state.selectionReferenceColor = snapshot.selectionReferenceColor
    ? { ...snapshot.selectionReferenceColor }
    : null;
  state.selectionMode = snapshot.selectionMode;
  state.showSelectionPreview = snapshot.showSelectionPreview;
  state.activeColorIndex = snapshot.activeColorIndex;
  updateSelectionPreviewToggleUI();
  updateSelectionUi();
  invalidateSelectionCaches();
  invalidateRenderCache();
  requestPreviewRender();

  if (state.palette[state.activeColorIndex]) {
    replacementColorInput.value = state.palette[state.activeColorIndex].hex;
  }
}

function restoreAppSnapshot(snapshot) {
  if (!snapshot) {
    return false;
  }

  state.workingImageData = snapshot.workingImageData ? cloneImageData(snapshot.workingImageData) : null;
  state.mosaicTiles = cloneMosaicTiles(snapshot.mosaicTiles || []);
  state.autoPalette = clonePaletteArray(snapshot.autoPalette || []);
  state.customPalette = clonePaletteArray(snapshot.customPalette || []);
  state.palette = clonePaletteArray(snapshot.palette || []);
  state.textOverlays = cloneTextOverlayArray(snapshot.textOverlays || []);
  state.processedTextOverlays = cloneTextOverlayArray(snapshot.processedTextOverlays || []);
  state.textProcessSession = snapshot.textProcessSession
    ? {
        workingImageData: cloneImageData(snapshot.textProcessSession.workingImageData),
        textOverlays: cloneTextOverlayArray(snapshot.textProcessSession.textOverlays),
        activeTextId: snapshot.textProcessSession.activeTextId,
        hoveredTextId: snapshot.textProcessSession.hoveredTextId,
        customPalette: clonePaletteArray(snapshot.textProcessSession.customPalette || [])
      }
    : null;
  state.activeTextId = snapshot.activeTextId ?? null;
  state.activeProcessedTextId = snapshot.activeProcessedTextId ?? null;
  state.hoveredTextId = snapshot.hoveredTextId ?? null;
  state.selectedTileIndices = new Set(snapshot.selectedTileIndices || []);
  state.selectionReferenceColor = snapshot.selectionReferenceColor ? { ...snapshot.selectionReferenceColor } : null;
  state.selectionMode = snapshot.selectionMode || "none";
  state.showSelectionPreview = Boolean(snapshot.showSelectionPreview);
  state.activeColorIndex = Number.isInteger(snapshot.activeColorIndex) ? snapshot.activeColorIndex : -1;
  state.imageOffsetX = snapshot.imageOffsetX ?? state.imageOffsetX;
  state.imageOffsetY = snapshot.imageOffsetY ?? state.imageOffsetY;
  state.zoom = snapshot.zoom ?? state.zoom;
  state.interactionMode = snapshot.interactionMode || "select";
  state.dragText = null;
  state.dragImage = null;
  state.dragSelection = null;
  updateSelectionPreviewToggleUI();
  updateInteractionModeUi();
  updateTextUi();
  renderPalette();
  invalidateSelectionCaches();
  invalidateRenderCache();
  requestPreviewRender();
  paletteSummary.textContent = "Undo applied.";
  return true;
}

function undoSelectionChange() {
  if (!state.appUndoStack.length) {
    return false;
  }

  const snapshot = state.appUndoStack.pop();
  return restoreAppSnapshot(snapshot);
}

function bumpSelectionVersion() {
  state.selectionVersion += 1;
  state.activeSelectionCache.signature = "";
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function resolveFrameDimensions() {
  if (!state.image) {
    return { width: 1, height: 1 };
  }

  const imageWidth = state.image.width;
  const imageHeight = state.image.height;

  if (state.framePreset === "none") {
    return {
      width: imageWidth,
      height: imageHeight
    };
  }

  if (state.framePreset === "landscape") {
    const width = Math.max(imageWidth, Math.round(imageHeight * (16 / 9)));
    return {
      width,
      height: Math.max(1, Math.round(width * (9 / 16)))
    };
  }

  if (state.framePreset === "portrait") {
    const height = Math.max(imageHeight, Math.round(imageWidth * (16 / 9)));
    return {
      width: Math.max(1, Math.round(height * (9 / 16))),
      height
    };
  }

  const side = Math.max(imageWidth, imageHeight);
  return {
    width: side,
    height: side
  };
}

function hasActiveFramePreset() {
  return state.framePreset !== "none";
}

function getRenderedImageWidth() {
  return state.image ? state.image.width * state.zoom : 0;
}

function getRenderedImageHeight() {
  return state.image ? state.image.height * state.zoom : 0;
}

function getSnappedRenderRect() {
  return {
    x: Math.round(state.imageOffsetX),
    y: Math.round(state.imageOffsetY),
    width: Math.round(getRenderedImageWidth()),
    height: Math.round(getRenderedImageHeight())
  };
}

function centerImageInFrame() {
  if (!state.image) {
    return;
  }

  if (!hasActiveFramePreset()) {
    state.imageOffsetX = 0;
    state.imageOffsetY = 0;
    return;
  }

  state.imageOffsetX = Math.round((state.frameWidth - getRenderedImageWidth()) / 2);
  state.imageOffsetY = Math.round((state.frameHeight - getRenderedImageHeight()) / 2);
  constrainImageOffsets();
}

function getImageBoundsInFrame() {
  return {
    x: state.imageOffsetX,
    y: state.imageOffsetY,
    width: getRenderedImageWidth(),
    height: getRenderedImageHeight()
  };
}

function constrainImageOffsets() {
  if (!state.image) {
    return;
  }

  if (!hasActiveFramePreset()) {
    state.imageOffsetX = 0;
    state.imageOffsetY = 0;
    return;
  }

  const renderedWidth = getRenderedImageWidth();
  const renderedHeight = getRenderedImageHeight();
  const minX = Math.min(0, state.frameWidth - renderedWidth);
  const maxX = Math.max(0, state.frameWidth - renderedWidth);
  const minY = Math.min(0, state.frameHeight - renderedHeight);
  const maxY = Math.max(0, state.frameHeight - renderedHeight);

  state.imageOffsetX = clampNumber(state.imageOffsetX, minX, maxX);
  state.imageOffsetY = clampNumber(state.imageOffsetY, minY, maxY);
}

function framePointToImagePoint(point) {
  return {
    x: (point.x - state.imageOffsetX) / state.zoom,
    y: (point.y - state.imageOffsetY) / state.zoom
  };
}

function imageRectToFrameRect(rect) {
  return {
    x: rect.x * state.zoom + state.imageOffsetX,
    y: rect.y * state.zoom + state.imageOffsetY,
    width: rect.width * state.zoom,
    height: rect.height * state.zoom
  };
}

function prepareCanvas() {
  const frame = resolveFrameDimensions();
  state.frameWidth = frame.width;
  state.frameHeight = frame.height;
  previewCanvas.width = frame.width;
  previewCanvas.height = frame.height;
  previewCanvas.style.display = "block";
  emptyState.style.display = "none";
  state.renderCache.canvas.width = state.image.width;
  state.renderCache.canvas.height = state.image.height;
  centerImageInFrame();
  invalidateRenderCache();
  window.requestAnimationFrame(() => {
    fitCanvasToFrame();
  });
}

function drawLoadedImage() {
  const rasterCanvas = document.createElement("canvas");
  rasterCanvas.width = state.image.width;
  rasterCanvas.height = state.image.height;
  const rasterContext = rasterCanvas.getContext("2d");
  rasterContext.clearRect(0, 0, rasterCanvas.width, rasterCanvas.height);
  rasterContext.drawImage(state.image, 0, 0);
  state.originalImageData = rasterContext.getImageData(0, 0, rasterCanvas.width, rasterCanvas.height);
  state.workingImageData = cloneImageData(state.originalImageData);
  invalidateRenderCache();
  window.requestAnimationFrame(() => {
    fitCanvasToFrame();
  });
}

function analyzeImage() {
  const settings = resolveMosaicSettings();
  const paletteCount = clampNumber(Number(paletteCountInput.value), 3, 16);
  const previousHex = state.palette[state.activeColorIndex]?.hex || state.selectionReferenceColor?.hex || null;

  paletteCountInput.value = String(paletteCount);
  state.mosaicShape = mosaicShapeInput.value;
  state.mosaicGapX = clampNumber(Number(mosaicGapXInput.value), 0);
  state.mosaicGapY = clampNumber(Number(mosaicGapYInput.value), 0);
  state.mosaicBlur = clampNumber(Number(mosaicBlurInput.value), 0);
  state.mosaicSettings = settings;
  state.mosaicTiles = buildMosaicTiles(state.workingImageData, settings);
  invalidateSelectionCaches();
  state.autoPalette = buildWheelPalette(state.mosaicTiles, paletteCount);
  syncPalette(previousHex);
  clearExplicitSelection({ skipRender: true });
  state.hoveredTileIndex = -1;

  if (state.palette[state.activeColorIndex]) {
    replacementColorInput.value = state.palette[state.activeColorIndex].hex;
  }

  mosaicSummary.textContent =
    `${settings.columns} x ${settings.rows} tiles | ${settings.tileWidth} x ${settings.tileHeight}px | ` +
    `${state.mosaicShape === "round" ? "round" : "square"} | horizontal gap ${state.mosaicGapX}px | vertical gap ${state.mosaicGapY}px | blur ${state.mosaicBlur}px`;
  if (false) {
    renderPalette();
    paletteSummary.textContent = "Shift added similar area tiles to the selection.";
    return;
  }

  renderPalette();
  updateSelectionUi();
  invalidateRenderCache();
  requestPreviewRender();
}

function setZoom(nextZoom) {
  if (!state.image) {
    state.zoom = clampNumber(nextZoom, MIN_ZOOM, MAX_ZOOM);
    applyZoom();
    requestPreviewRender();
    return;
  }

  const previousZoom = state.zoom;
  const nextClampedZoom = clampNumber(nextZoom, MIN_ZOOM, MAX_ZOOM);

  if (Math.abs(previousZoom - nextClampedZoom) < 0.0001) {
    return;
  }

  const anchorX = state.frameWidth / 2;
  const anchorY = state.frameHeight / 2;
  const imageXAtAnchor = (anchorX - state.imageOffsetX) / previousZoom;
  const imageYAtAnchor = (anchorY - state.imageOffsetY) / previousZoom;

  state.zoom = nextClampedZoom;
  state.imageOffsetX = anchorX - imageXAtAnchor * nextClampedZoom;
  state.imageOffsetY = anchorY - imageYAtAnchor * nextClampedZoom;
  constrainImageOffsets();
  applyZoom();
  requestPreviewRender();
}

function setSelectionPreviewVisibility(visible) {
  if (state.showSelectionPreview === visible) {
    return;
  }

  state.showSelectionPreview = visible;
  updateSelectionPreviewToggleUI();
  updateHoverInfo();
  invalidateRenderCache();
  requestPreviewRender();
}

function setPreviewBackgroundMode(mode) {
  state.previewBackgroundMode = mode;
  applyPreviewBackground();
  requestPreviewRender();
}

function setInteractionMode(mode) {
  state.interactionMode = mode;
  state.hoveredTileIndex = -1;
  state.hoveredTextId = null;
  if (mode === "move") {
    setSelectionPreviewVisibility(false);
  }
  updateInteractionModeUi();
  updateHoverInfo();
  hoverInfo.textContent =
    mode === "move"
      ? "Transform mode is active. Drag the image, text, or emoji inside the frame."
      : hoverInfo.textContent;
  requestPreviewRender();
}

function updateInteractionModeUi() {
  modeSelectButton.classList.toggle("is-active", state.interactionMode === "select");
  modeMoveButton.classList.toggle("is-active", state.interactionMode === "move");
  previewCanvas.style.cursor = state.interactionMode === "move" ? "grab" : "crosshair";
}

function setFramePreset(preset) {
  state.framePreset = preset;
  updateFramePresetUi();

  if (!state.image) {
    return;
  }

  prepareCanvas();
  requestPreviewRender();
}

function updateFramePresetUi() {
  frameNoneButton.classList.toggle("is-active", state.framePreset === "none");
  frameSquareButton.classList.toggle("is-active", state.framePreset === "square");
  frameLandscapeButton.classList.toggle("is-active", state.framePreset === "landscape");
  framePortraitButton.classList.toggle("is-active", state.framePreset === "portrait");
}

function applyPreviewBackground() {
  previewStage.dataset.bgMode = state.previewBackgroundMode;
  previewStage.style.setProperty("--custom-preview-bg", state.previewBackgroundColor);

  bgTransparentButton.classList.toggle("is-active", state.previewBackgroundMode === "transparent");
  bgWhiteButton.classList.toggle("is-active", state.previewBackgroundMode === "white");
  bgBlackButton.classList.toggle("is-active", state.previewBackgroundMode === "black");
  bgCustomButton.classList.toggle("is-active", state.previewBackgroundMode === "custom");
}

function enableSelectionPreviewFromSelectionAction() {
  if (!state.showSelectionPreview) {
    setSelectionPreviewVisibility(true);
  }
}

function applyZoom() {
  const width = previewCanvas.width * state.fitZoom;
  const height = previewCanvas.height * state.fitZoom;
  previewCanvas.style.width = `${width}px`;
  previewCanvas.style.height = `${height}px`;
  previewStage.style.width = `${width}px`;
  previewStage.style.height = `${height}px`;
  zoomValue.textContent = formatZoom(state.zoom);
}

function getFitZoom() {
  if (!canvasFrame || !previewCanvas.width || !previewCanvas.height) {
    return DEFAULT_ZOOM;
  }

  const frameWidth = Math.max(canvasFrame.clientWidth - 28, 1);
  const frameHeight = Math.max(canvasFrame.clientHeight - 28, 1);
  const fitZoom = Math.min(frameWidth / previewCanvas.width, frameHeight / previewCanvas.height, 1);

  return clampNumber(fitZoom, MIN_ZOOM, MAX_ZOOM);
}

function fitCanvasToFrame({ preserveManualZoom = false } = {}) {
  const nextFitZoom = getFitZoom();
  state.fitZoom = nextFitZoom;
  applyZoom();
}

function updateTextUi() {
  const activeText = getActiveTextOverlay();

  removeTextButton.disabled = !activeText;
  processTextButton.disabled = !state.textOverlays.length && !state.textProcessSession;
  applyTextProcessButton.disabled = !state.textProcessSession;
  processTextButton.textContent = state.textProcessSession ? "Remove" : "Process";

  if (!activeText) {
    textStatus.textContent = "After adding text, you can click and drag it on the canvas.";
    return;
  }

  textContentInput.value = activeText.text;
  if (activeText.type !== "emoji") {
    textFontFamilyInput.value = activeText.fontFamily;
    textColorInput.value = activeText.color;
    if (textFontWeightInput) {
      textFontWeightInput.value = activeText.fontWeight || "400";
    }
    if (textFontStyleInput) {
      textFontStyleInput.value = activeText.fontStyle || "normal";
    }
  }
  textSizeInput.value = String(Math.round(activeText.size));
  textStatus.textContent =
    activeText.type === "emoji"
      ? "Active emoji selected. Drag it on the canvas to reposition it."
      : "Active text selected. Drag it on the canvas to reposition it.";
}

function getActiveTextOverlay() {
  return state.textOverlays.find((overlay) => overlay.id === state.activeTextId) || null;
}

function getOverlayFontFamily(overlay) {
  if (!overlay) {
    return "'Space Mono', monospace";
  }

  if (overlay.type === "emoji") {
    return EMOJI_FONT_STACK;
  }

  return `${overlay.fontFamily}, ${EMOJI_FONT_STACK}`;
}

function renderTextLayerList() {
  if (!textLayerList) {
    return;
  }

  if (!state.textOverlays.length) {
    textLayerList.innerHTML = '<p class="text-layer-empty">No text or emoji layers yet.</p>';
    return;
  }

  textLayerList.innerHTML = state.textOverlays
    .slice()
    .reverse()
    .map((overlay, reverseIndex) => {
      const label = overlay.type === "emoji" ? "Emoji Layer" : `Text Layer ${state.textOverlays.length - reverseIndex}`;
      const preview = escapeHtml(overlay.text || (overlay.type === "emoji" ? "Emoji" : "Text"));
      const activeClass = overlay.id === state.activeTextId ? " is-active" : "";

      return `
        <button class="text-layer-item${activeClass}" type="button" data-text-layer-id="${overlay.id}">
          <span class="text-layer-badge">${label}</span>
          <span class="text-layer-text">${preview}</span>
        </button>
      `;
    })
    .join("");
}

function selectTextLayer(textId) {
  const overlay = state.textOverlays.find((item) => item.id === textId);

  if (!overlay) {
    return;
  }

  state.activeTextId = textId;
  state.hoveredTextId = textId;
  updateTextUi();
  requestPreviewRender();
}

function syncActiveTextOverlayFromControls() {
  const activeText = getActiveTextOverlay();

  if (!activeText) {
    return;
  }

  if (activeText.type === "text") {
    activeText.text = textContentInput.value;
  }

  activeText.size = clampNumber(Number(textSizeInput.value), 8, 320);

  if (activeText.type !== "emoji") {
    activeText.fontFamily = textFontFamilyInput.value || "'Space Mono', monospace";
    activeText.color = textColorInput.value || "#111111";
    activeText.fontWeight = textFontWeightInput?.value || "400";
    activeText.fontStyle = textFontStyleInput?.value || "normal";
  }

  renderTextLayerList();
  requestPreviewRender();
}

function sanitizeCustomFontFamilyName(rawName) {
  return (rawName || "Custom Font")
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "Custom Font";
}

function ensureUniqueCustomFontFamilyName(baseName) {
  const knownValues = new Set([
    ...Array.from(textFontFamilyInput.options).map((option) => option.textContent?.trim()),
    ...(tileFillFontFamilyInput
      ? Array.from(tileFillFontFamilyInput.options).map((option) => option.textContent?.trim())
      : []),
    ...state.customFonts.map((font) => font.familyName)
  ]);

  if (!knownValues.has(baseName)) {
    return baseName;
  }

  let suffix = 2;

  while (knownValues.has(`${baseName} ${suffix}`)) {
    suffix += 1;
  }

  return `${baseName} ${suffix}`;
}

function ensureCustomFontOption(familyName, optionValue) {
  const ensureOnSelect = (select) => {
    if (!select) {
      return null;
    }

    const existingOption = Array.from(select.options).find((option) => option.value === optionValue);

    if (existingOption) {
      existingOption.textContent = familyName;
      return existingOption;
    }

    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = familyName;
    option.dataset.customFont = "true";
    select.append(option);
    return option;
  };

  ensureOnSelect(textFontFamilyInput);
  return ensureOnSelect(tileFillFontFamilyInput);
}

async function registerCustomFont(fontFile) {
  if (typeof FontFace === "undefined" || !document.fonts) {
    throw new Error("FontFace API unavailable");
  }

  const baseName = sanitizeCustomFontFamilyName(fontFile.name);
  const familyName = ensureUniqueCustomFontFamilyName(baseName);
  const fontUrl = URL.createObjectURL(fontFile);
  const fontFace = new FontFace(familyName, `url(${fontUrl})`);

  await fontFace.load();
  document.fonts.add(fontFace);
  state.customFonts.push({
    familyName,
    url: fontUrl
  });

  return familyName;
}

function addOrUpdateTextOverlay() {
  if (!state.image) {
    textStatus.textContent = "Choose an image first.";
    return;
  }

  const value = textContentInput.value.trim();

  if (!value) {
    textStatus.textContent = "Type some text first.";
    return;
  }

  const fontFamily = textFontFamilyInput.value || "'Space Mono', monospace";
  const size = clampNumber(Number(textSizeInput.value), 8, 320);
  const color = textColorInput.value || "#111111";
  const fontWeight = textFontWeightInput?.value || "400";
  const fontStyle = textFontStyleInput?.value || "normal";
  const activeText = getActiveTextOverlay();

  if (activeText) {
    activeText.text = value;
    activeText.fontFamily = activeText.type === "emoji" ? EMOJI_FONT_STACK : fontFamily;
    activeText.size = size;
    activeText.color = activeText.type === "emoji" ? "#111111" : color;
    activeText.fontWeight = activeText.type === "emoji" ? "400" : fontWeight;
    activeText.fontStyle = activeText.type === "emoji" ? "normal" : fontStyle;
    textStatus.textContent =
      activeText.type === "emoji" ? "Selected emoji updated." : "Selected text updated.";
  } else {
    const overlay = {
      id: `text-${Date.now()}`,
      text: value,
      fontFamily,
      size,
      color,
      fontWeight,
      fontStyle,
      type: "text",
      x: Math.round(previewCanvas.width * 0.5),
      y: Math.round(previewCanvas.height * 0.5),
      align: "center"
    };
    state.textOverlays.push(overlay);
    state.activeTextId = overlay.id;
    textStatus.textContent = "Text added. You can drag it on the canvas now.";
  }

  updateTextUi();
  requestPreviewRender();
}

function addEmojiOverlay() {
  if (!state.image) {
    textStatus.textContent = "Choose an image first.";
    return;
  }

  const emoji = emojiPickerInput.value?.trim();

  if (!emoji) {
    textStatus.textContent = "Choose an emoji first.";
    return;
  }

  const size = clampNumber(Number(textSizeInput.value), 8, 320);
  const overlay = {
    id: `emoji-${Date.now()}`,
    text: emoji,
    fontFamily: EMOJI_FONT_STACK,
    size,
    color: "#111111",
    fontWeight: "400",
    fontStyle: "normal",
    type: "emoji",
    x: Math.round(previewCanvas.width * 0.5),
    y: Math.round(previewCanvas.height * 0.5),
    align: "center"
  };

  state.textOverlays.push(overlay);
  state.activeTextId = overlay.id;
  state.hoveredTextId = overlay.id;
  textStatus.textContent = "Emoji added. You can drag it on the canvas now.";
  updateTextUi();
  requestPreviewRender();
}

function removeActiveTextOverlay() {
  if (!state.activeTextId) {
    return;
  }

  state.textOverlays = state.textOverlays.filter((overlay) => overlay.id !== state.activeTextId);
  state.activeTextId = null;
  state.hoveredTextId = null;
  textStatus.textContent = "Selected text deleted.";
  updateTextUi();
  requestPreviewRender();
}

function centerActiveTextOverlay() {
  const activeText = getActiveTextOverlay();

  if (!activeText) {
    return;
  }

  activeText.x = Math.round(previewCanvas.width * 0.5);
  activeText.y = Math.round(previewCanvas.height * 0.5);
  activeText.align = "center";
  textStatus.textContent = "Text centered inside the frame.";
  requestPreviewRender();
}

function drawTextOverlays() {
  drawTextOverlaysToContext(previewContext, 1);
}

function drawTextOverlaysToContext(context, scale = 1) {
  if (!state.textOverlays.length) {
    return;
  }

  context.save();
  context.textBaseline = "top";

  state.textOverlays.forEach((overlay) => {
    const fontWeight = overlay.fontWeight || "400";
    const fontStyle = overlay.fontStyle || "normal";
    context.font = `${fontStyle} ${fontWeight} ${Math.round(overlay.size * scale)}px ${overlay.fontFamily}`;
    context.fillStyle = overlay.color;
    context.textAlign = overlay.align || "left";
    context.fillText(overlay.text, overlay.x * scale, overlay.y * scale);

    if (context === previewContext && overlay.id === state.activeTextId) {
      const bounds = getTextOverlayBounds(overlay);
      context.save();
      context.strokeStyle = "rgba(17, 17, 17, 0.55)";
      context.lineWidth = 1;
      context.setLineDash([6, 4]);
      context.strokeRect(bounds.x - 4, bounds.y - 4, bounds.width + 8, bounds.height + 8);
      context.restore();
    }
  });

  context.restore();
}

function getTextOverlayBounds(overlay) {
  previewContext.save();
  const fontWeight = overlay.fontWeight || "400";
  const fontStyle = overlay.fontStyle || "normal";
  previewContext.font = `${fontStyle} ${fontWeight} ${Math.round(overlay.size)}px ${overlay.fontFamily}`;
  previewContext.textBaseline = "top";
  const metrics = previewContext.measureText(overlay.text);
  previewContext.restore();

  const width = Math.max(metrics.width, 1);
  const height = Math.max(overlay.size * 1.1, 1);
  const x = overlay.align === "center" ? overlay.x - width / 2 : overlay.x;

  return {
    x,
    y: overlay.y,
    width,
    height
  };
}

function getTextOverlayIdFromPoint(x, y) {
  for (let index = state.textOverlays.length - 1; index >= 0; index -= 1) {
    const overlay = state.textOverlays[index];
    const bounds = getTextOverlayBounds(overlay);

    if (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    ) {
      return overlay.id;
    }
  }

  return null;
}

function beginTextDrag(event, textId, point) {
  if (state.interactionMode !== "move") {
    return;
  }

  const overlay = state.textOverlays.find((item) => item.id === textId);

  if (!overlay) {
    return;
  }

  const bounds = getTextOverlayBounds(overlay);
  pushAppHistory();
  state.activeTextId = textId;
  state.hoveredTextId = textId;
  state.dragText = {
    active: true,
    id: textId,
    offsetX: point.x - bounds.x,
    offsetY: point.y - bounds.y
  };
  previewCanvas.style.cursor = "move";
  updateTextUi();
  requestPreviewRender();
  event.preventDefault();
}

function updateTextDrag(event) {
  const overlay = getActiveTextOverlay();

  if (!overlay || !state.dragText?.active) {
    return;
  }

  const point = getCanvasPointFromEvent(event);
  const bounds = getTextOverlayBounds(overlay);
  const nextX = point.x - state.dragText.offsetX;
  const nextY = point.y - state.dragText.offsetY;
  const halfWidth = bounds.width / 2;

  overlay.x =
    overlay.align === "center"
      ? clampNumber(nextX + halfWidth, halfWidth, Math.max(previewCanvas.width - halfWidth, halfWidth))
      : clampNumber(nextX, 0, Math.max(previewCanvas.width - bounds.width, 0));
  overlay.y = clampNumber(nextY, 0, Math.max(previewCanvas.height - bounds.height, 0));
  textStatus.textContent = "Dragging text.";
  requestPreviewRender();
}

function endTextDrag(event) {
  if (!state.dragText?.active) {
    return;
  }

  updateTextDrag(event);
  state.dragText = null;
  previewCanvas.style.cursor = "crosshair";
  textStatus.textContent = "Text moved.";
  requestPreviewRender();
}

function beginImageDrag(event, point) {
  if (state.interactionMode !== "move" || !state.image) {
    return;
  }

  pushAppHistory();
  state.dragImage = {
    active: true,
    startX: point.x,
    startY: point.y,
    startOffsetX: state.imageOffsetX,
    startOffsetY: state.imageOffsetY
  };
  previewCanvas.style.cursor = "grabbing";
  hoverInfo.textContent = "Dragging image inside the frame.";
  event.preventDefault();
}

function updateImageDrag(event) {
  if (!state.dragImage?.active || !state.image) {
    return;
  }

  const point = getCanvasPointFromEvent(event);
  state.imageOffsetX = state.dragImage.startOffsetX + (point.x - state.dragImage.startX);
  state.imageOffsetY = state.dragImage.startOffsetY + (point.y - state.dragImage.startY);
  constrainImageOffsets();
  requestPreviewRender();
}

function endImageDrag(event) {
  if (!state.dragImage?.active) {
    return;
  }

  updateImageDrag(event);
  state.dragImage = null;
  previewCanvas.style.cursor = "grab";
  hoverInfo.textContent = "Image moved.";
  requestPreviewRender();
}

function resolveMosaicSettings() {
  const imageWidth = state.workingImageData.width;
  const imageHeight = state.workingImageData.height;
  const fallbackColumns = state.mosaicSettings?.columns || DEFAULT_MOSAIC_COLUMNS;
  const fallbackRows = state.mosaicSettings?.rows || DEFAULT_MOSAIC_ROWS;
  const fallbackTileWidth = state.mosaicSettings?.tileWidth || DEFAULT_TILE_SIZE;
  const fallbackTileHeight = state.mosaicSettings?.tileHeight || DEFAULT_TILE_SIZE;
  const hasColumnInput = hasUsableNumberInput(mosaicColumnsInput, 1);
  const hasRowInput = hasUsableNumberInput(mosaicRowsInput, 1);
  const hasTileWidthInput = hasUsableNumberInput(mosaicTileWidthInput, 2);
  const hasTileHeightInput = hasUsableNumberInput(mosaicTileHeightInput, 2);
  let columns = getInputNumberOrFallback(mosaicColumnsInput, fallbackColumns, 1);
  let rows = getInputNumberOrFallback(mosaicRowsInput, fallbackRows, 1);
  let tileWidth = getInputNumberOrFallback(mosaicTileWidthInput, fallbackTileWidth, 2);
  let tileHeight = getInputNumberOrFallback(mosaicTileHeightInput, fallbackTileHeight, 2);

  if (state.mosaicInputMode === "size") {
    columns = clampNumber(Math.ceil(imageWidth / tileWidth), 1);
    rows = clampNumber(Math.ceil(imageHeight / tileHeight), 1);
  } else {
    tileWidth = Math.max(1, imageWidth / columns);
    tileHeight = Math.max(1, imageHeight / rows);
  }

  if (state.mosaicInputMode === "count" || hasColumnInput) {
    mosaicColumnsInput.value = String(columns);
  }

  if (state.mosaicInputMode === "count" || hasRowInput) {
    mosaicRowsInput.value = String(rows);
  }

  if (state.mosaicInputMode === "size" || hasTileWidthInput) {
    mosaicTileWidthInput.value = String(Math.max(1, Math.round(tileWidth)));
  }

  if (state.mosaicInputMode === "size" || hasTileHeightInput) {
    mosaicTileHeightInput.value = String(Math.max(1, Math.round(tileHeight)));
  }

  return {
    columns,
    rows,
    tileWidth,
    tileHeight,
    mode: state.mosaicInputMode
  };
}

function buildMosaicTiles(imageData, settings) {
  const tiles = [];
  const { width, height, data } = imageData;

  for (let row = 0; row < settings.rows; row += 1) {
    const startY = settings.mode === "count"
      ? Math.floor((row / settings.rows) * height)
      : Math.floor(row * settings.tileHeight);
    const endY = settings.mode === "count"
      ? Math.floor(((row + 1) / settings.rows) * height)
      : Math.min(Math.floor((row + 1) * settings.tileHeight), height);

    if (startY >= height || endY <= startY) {
      break;
    }

    for (let column = 0; column < settings.columns; column += 1) {
      const startX = settings.mode === "count"
        ? Math.floor((column / settings.columns) * width)
        : Math.floor(column * settings.tileWidth);
      const endX = settings.mode === "count"
        ? Math.floor(((column + 1) / settings.columns) * width)
        : Math.min(Math.floor((column + 1) * settings.tileWidth), width);

      if (startX >= width || endX <= startX) {
        break;
      }

      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      let totalAlpha = 0;

      for (let y = startY; y < endY; y += 1) {
        for (let x = startX; x < endX; x += 1) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3] / 255;
          totalR += data[index] * alpha;
          totalG += data[index + 1] * alpha;
          totalB += data[index + 2] * alpha;
          totalAlpha += alpha;
        }
      }

      const divisor = totalAlpha || 1;
      const color = {
        r: Math.round(totalR / divisor),
        g: Math.round(totalG / divisor),
        b: Math.round(totalB / divisor)
      };

      tiles.push({
        x: startX,
        y: startY,
        width: Math.max(endX - startX, 1),
        height: Math.max(endY - startY, 1),
        row,
        column,
        color,
        hsl: rgbToHsl(color.r, color.g, color.b),
        fillContent: "",
        fillType: null,
        fillColor: null,
        fillFontFamily: "'Space Mono', monospace",
        fillRemoveBackground: false
      });
    }
  }

  return tiles;
}

function buildWheelPalette(tiles, paletteCount) {
  const buckets = new Map();

  tiles.forEach((tile) => {
    const r = quantizeChannel(tile.color.r, 24);
    const g = quantizeChannel(tile.color.g, 24);
    const b = quantizeChannel(tile.color.b, 24);
    const key = `${r},${g},${b}`;

    if (!buckets.has(key)) {
      buckets.set(key, { r: 0, g: 0, b: 0, count: 0 });
    }

    const bucket = buckets.get(key);
    bucket.r += tile.color.r;
    bucket.g += tile.color.g;
    bucket.b += tile.color.b;
    bucket.count += 1;
  });

  const candidates = Array.from(buckets.values())
    .map((bucket) => {
      const color = {
        r: Math.round(bucket.r / bucket.count),
        g: Math.round(bucket.g / bucket.count),
        b: Math.round(bucket.b / bucket.count)
      };
      const hsl = rgbToHsl(color.r, color.g, color.b);
      const vibrancy = hsl.s * (1 - Math.abs(hsl.l - 0.52) * 1.25);
      const baseScore = vibrancy * 130 + Math.log2(bucket.count + 1) * 10;

      return {
        ...color,
        count: bucket.count,
        hsl,
        vibrancy,
        baseScore
      };
    })
    .filter((candidate) => candidate.vibrancy > 0.06)
    .sort((left, right) => right.baseScore - left.baseScore);

  const pool = (candidates.length ? candidates : fallbackPaletteCandidates(buckets)).slice(
    0,
    Math.max(paletteCount * 10, paletteCount)
  );

  if (!pool.length) {
    return [];
  }

  const selected = [pool.shift()];
  const hueOffsets = [180, 120, 240, 90, 270, 60, 300, 150, 210, 30, 330];
  const anchorHue = selected[0].hsl.h;

  hueOffsets.forEach((offset) => {
    if (selected.length >= paletteCount || !pool.length) {
      return;
    }

    const targetHue = (anchorHue + offset) % 360;
    const bestIndex = findBestCandidateIndex(pool, targetHue, selected);

    if (bestIndex >= 0) {
      selected.push(pool.splice(bestIndex, 1)[0]);
    }
  });

  while (selected.length < paletteCount && pool.length) {
    let bestIndex = 0;
    let bestScore = -Infinity;

    pool.forEach((candidate, index) => {
      const nearestHueGap = Math.min(...selected.map((picked) => getHueDistance(candidate.hsl.h, picked.hsl.h)));
      const nearestColorGap = Math.min(...selected.map((picked) => getColorDistance(candidate, picked)));
      const score = candidate.baseScore + nearestHueGap * 0.9 + nearestColorGap * 0.18;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    selected.push(pool.splice(bestIndex, 1)[0]);
  }

  return selected.map((color) => ({
    r: color.r,
    g: color.g,
    b: color.b,
    count: color.count,
    hex: rgbToHex(color.r, color.g, color.b),
    vibrancy: color.vibrancy,
    source: "auto"
  }));
}

function fallbackPaletteCandidates(buckets) {
  return Array.from(buckets.values())
    .map((bucket) => {
      const color = {
        r: Math.round(bucket.r / bucket.count),
        g: Math.round(bucket.g / bucket.count),
        b: Math.round(bucket.b / bucket.count)
      };
      const hsl = rgbToHsl(color.r, color.g, color.b);
      return {
        ...color,
        count: bucket.count,
        hsl,
        vibrancy: hsl.s,
        baseScore: hsl.s * 80 + Math.log2(bucket.count + 1) * 12
      };
    })
    .sort((left, right) => right.baseScore - left.baseScore);
}

function findBestCandidateIndex(pool, targetHue, selected) {
  let bestIndex = -1;
  let bestScore = -Infinity;

  pool.forEach((candidate, index) => {
    const targetDistance = getHueDistance(candidate.hsl.h, targetHue);
    const nearestHueGap = Math.min(...selected.map((picked) => getHueDistance(candidate.hsl.h, picked.hsl.h)));
    const nearestColorGap = Math.min(...selected.map((picked) => getColorDistance(candidate, picked)));
    const score =
      candidate.baseScore +
      nearestHueGap * 0.55 +
      nearestColorGap * 0.1 -
      targetDistance * 1.45;

    if (score > bestScore && nearestColorGap > 28) {
      bestScore = score;
      bestIndex = index;
    }
  });

  if (bestIndex !== -1) {
    return bestIndex;
  }

  pool.forEach((candidate, index) => {
    const targetDistance = getHueDistance(candidate.hsl.h, targetHue);
    const score = candidate.baseScore - targetDistance * 1.25;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function renderPalette() {
  paletteList.innerHTML = "";

  if (!state.palette.length) {
    paletteSummary.textContent = "Not enough color variety was found.";
    return;
  }

  paletteSummary.textContent =
    `${state.palette.length} diverse tones were selected and balanced across the color wheel.`;

  state.palette.forEach((color, index) => {
    const item = document.createElement("div");
    item.className = `palette-item${state.activeColorIndex === index ? " active" : ""}`;
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Select ${color.hex}`);

    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.background = color.hex;

    const meta = document.createElement("div");
    meta.className = "swatch-meta";

    const hex = document.createElement("strong");
    hex.textContent = color.hex;

  const count = document.createElement("span");
  count.textContent =
    color.source === "custom"
      ? "Manually selected"
      : `${formatCount(color.count)} tiles`;

    const activateColor = () => {
      enableSelectionPreviewFromSelectionAction();
      state.activeColorIndex = index;
      replacementColorInput.value = color.hex;
      invalidateRenderCache();
      renderPalette();
      requestPreviewRender();
    };

    item.addEventListener("click", activateColor);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateColor();
      }
    });

    meta.append(hex, count);
    item.append(swatch, meta);
    paletteList.append(item);
  });
}

function updateSelectionUi() {
  const selectedCount = state.selectedTileIndices.size;
  clearSelectionButton.disabled = selectedCount === 0;
  invertSelectionButton.disabled = !state.mosaicTiles.length;
  selectSimilarButton.classList.remove("is-hidden");
  selectSimilarButton.textContent = "Select Similar";

  if (!state.mosaicTiles.length) {
    selectionStatus.textContent =
      "No tile selection yet. Click one tile, Shift-click to add more, or drag to scan an area.";
    return;
  }

  if (!selectedCount) {
    selectionStatus.textContent =
      "Click once to select one tile. Shift-click adds or removes tiles. Dragging scans tiles similar to the dominant tone in the area.";
    return;
  }

  const referenceHex = state.selectionReferenceColor
    ? rgbToHex(
        state.selectionReferenceColor.r,
        state.selectionReferenceColor.g,
        state.selectionReferenceColor.b
      )
    : null;

  if (state.selectionMode === "similar" && referenceHex) {
    selectionStatus.textContent =
      `${formatCount(selectedCount)} tiles selected with reference ${referenceHex}. Adjust the similarity slider to refresh the selection.`;
    return;
  }

  if (selectedCount === 1 && referenceHex) {
    selectionStatus.textContent =
      `${referenceHex} selected. Use the similarity slider to include similar tiles.`;
    return;
  }

  selectionStatus.textContent =
    `${formatCount(selectedCount)} tiles manually selected. Use "Select Similar" to include tiles near this selection's dominant tone.`;
}

function drawPreview() {
  previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewContext.imageSmoothingEnabled = false;

  if (!state.mosaicTiles.length) {
    if (state.workingImageData) {
      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = state.workingImageData.width;
      sourceCanvas.height = state.workingImageData.height;
      sourceCanvas.getContext("2d").putImageData(state.workingImageData, 0, 0);
      const renderRect = getSnappedRenderRect();
      previewContext.drawImage(
        sourceCanvas,
        renderRect.x,
        renderRect.y,
        renderRect.width,
        renderRect.height
      );
    }
    return;
  }

  ensureCachedPreview();
  const renderRect = getSnappedRenderRect();
  previewContext.drawImage(
    state.renderCache.canvas,
    renderRect.x,
    renderRect.y,
    renderRect.width,
    renderRect.height
  );

  if (state.selectedTileIndices.size) {
    drawSelectedTileOverlays();
  }

  if (state.hoveredTileIndex >= 0) {
    drawHoveredTileOverlay();
  }

  if (state.dragSelection?.active && state.dragSelection.moved) {
    drawDragSelectionOverlay();
  }

  drawTextOverlays();

  updateHoverInfo();
}

function ensureCachedPreview() {
  const selectedColor = state.palette[state.activeColorIndex];
  const previewSelectionSet = getPreviewSelectionSet();
  const cacheSignature = JSON.stringify({
    tileCount: state.mosaicTiles.length,
    selectionVersion: state.selectionVersion,
    activeColorIndex: state.activeColorIndex,
    selectedHex: selectedColor?.hex || "",
    threshold: Number(thresholdInput.value),
    shape: state.mosaicShape,
    gapX: state.mosaicGapX,
    gapY: state.mosaicGapY,
    blur: state.mosaicBlur,
    showSelectionPreview: state.showSelectionPreview,
    paletteVersion: state.palette.map((color) => color.hex).join("|")
  });

  if (cacheSignature === state.renderCache.signature) {
    return;
  }

  const cacheCanvas = state.renderCache.canvas;
  cacheCanvas.width = state.image.width;
  cacheCanvas.height = state.image.height;
  const cacheContext = cacheCanvas.getContext("2d");
  const shouldShowSelectionPreview = state.showSelectionPreview && previewSelectionSet.size > 0;

  cacheContext.clearRect(0, 0, cacheCanvas.width, cacheCanvas.height);
  cacheContext.save();
  cacheContext.filter = state.mosaicBlur > 0 ? `blur(${state.mosaicBlur}px)` : "none";

  state.mosaicTiles.forEach((tile, index) => {
    const isSelected = previewSelectionSet.has(index);
    const hasTransparentFill = Boolean(tile.fillContent && tile.fillRemoveBackground);

    if (shouldShowSelectionPreview) {
      if (isSelected) {
        if (!hasTransparentFill) {
          cacheContext.fillStyle = rgbToCss({
            r: blendChannel(tile.color.r, 255, 0.08),
            g: blendChannel(tile.color.g, 255, 0.08),
            b: blendChannel(tile.color.b, 255, 0.08)
          });
          fillTile(cacheContext, tile);
          cacheContext.fillStyle = "rgba(17, 17, 17, 0.14)";
          fillTile(cacheContext, tile);
        }
      } else {
        if (!hasTransparentFill) {
          const grayscale = Math.round(tile.color.r * 0.299 + tile.color.g * 0.587 + tile.color.b * 0.114);
          cacheContext.fillStyle = rgbToCss({
            r: blendChannel(tile.color.r, grayscale, 0.76),
            g: blendChannel(tile.color.g, grayscale, 0.76),
            b: blendChannel(tile.color.b, grayscale, 0.76)
          });
          fillTile(cacheContext, tile);
        }
      }
    } else {
      if (!hasTransparentFill) {
        cacheContext.fillStyle = rgbToCss(tile.color);
        fillTile(cacheContext, tile);
      }
    }

    drawTileInnerContent(cacheContext, tile);
  });

  cacheContext.restore();
  state.renderCache.signature = cacheSignature;
  state.renderCache.selectedTiles = previewSelectionSet.size;
}

function drawSelectedTileOverlays() {
  if (!state.showSelectionPreview) {
    return;
  }

  previewContext.save();
  previewContext.translate(state.imageOffsetX, state.imageOffsetY);
  previewContext.scale(state.zoom, state.zoom);
  previewContext.lineWidth = 1.8 / state.zoom;
  previewContext.strokeStyle = "rgba(17, 17, 17, 0.96)";

  state.selectedTileIndices.forEach((tileIndex) => {
    const tile = state.mosaicTiles[tileIndex];

    if (tile && !(tile.fillContent && tile.fillRemoveBackground)) {
      strokeTile(previewContext, tile);
    }
  });

  previewContext.restore();
}

function drawHoveredTileOverlay() {
  const hoveredTile = state.mosaicTiles[state.hoveredTileIndex];

  if (!hoveredTile || (hoveredTile.fillContent && hoveredTile.fillRemoveBackground)) {
    return;
  }

  const previewSelectionSet = getPreviewSelectionSet();
  const matches = previewSelectionSet.has(state.hoveredTileIndex);

  previewContext.save();
  previewContext.translate(state.imageOffsetX, state.imageOffsetY);
  previewContext.scale(state.zoom, state.zoom);
  previewContext.lineWidth = 2 / state.zoom;
  previewContext.strokeStyle = matches ? "rgba(17, 17, 17, 0.98)" : "rgba(120, 120, 120, 0.98)";
  strokeTile(previewContext, hoveredTile);
  previewContext.restore();
}

function drawDragSelectionOverlay() {
  const rect = imageRectToFrameRect(getNormalizedRect(
    state.dragSelection.startX,
    state.dragSelection.startY,
    state.dragSelection.currentX,
    state.dragSelection.currentY
  ));

  previewContext.save();
  previewContext.lineWidth = 2;
  previewContext.setLineDash([10, 6]);
  previewContext.strokeStyle = "rgba(17, 17, 17, 0.88)";
  previewContext.fillStyle = "rgba(17, 17, 17, 0.08)";
  previewContext.fillRect(rect.x, rect.y, rect.width, rect.height);
  previewContext.strokeRect(rect.x, rect.y, rect.width, rect.height);
  previewContext.restore();
}

function updateHoverInfo() {
  if (state.dragImage?.active) {
    hoverInfo.textContent = "Dragging image inside the frame.";
    return;
  }

  if (state.dragText?.active) {
    hoverInfo.textContent = "Dragging text to a new position.";
    return;
  }

  if (state.dragSelection?.active && state.dragSelection.moved) {
    const rect = getNormalizedRect(
      state.dragSelection.startX,
      state.dragSelection.startY,
      state.dragSelection.currentX,
      state.dragSelection.currentY
    );
    const areaTileCount = getTileIndicesInRect(rect).length;
    hoverInfo.textContent =
      `Scanning the area. The dominant tone among ${formatCount(areaTileCount)} tiles will be used to select similar tiles.`;
    return;
  }

  const explicitSelectionCount = state.selectedTileIndices.size;
  const paletteColor = state.palette[state.activeColorIndex];
  const previewSelectionSet = getPreviewSelectionSet();

  if (state.interactionMode === "move") {
    if (state.hoveredTextId) {
      const activeText = state.textOverlays.find((overlay) => overlay.id === state.hoveredTextId);

      if (activeText) {
        hoverInfo.textContent = `"${activeText.text}" is selected. Drag it anywhere inside the frame.`;
        return;
      }
    }

    hoverInfo.textContent = "Transform mode is active. Drag the image, text, or emoji inside the frame.";
    return;
  }

  if (state.hoveredTextId) {
    const activeText = state.textOverlays.find((overlay) => overlay.id === state.hoveredTextId);

    if (activeText) {
      hoverInfo.textContent = `"${activeText.text}" is selected. Click and drag to move it.`;
      return;
    }
  }

  if (state.hoveredTileIndex >= 0) {
    const hoveredTile = state.mosaicTiles[state.hoveredTileIndex];
    const paintBounds = getPaintBounds(hoveredTile);
    const hoveredHex = rgbToHex(hoveredTile.color.r, hoveredTile.color.g, hoveredTile.color.b);
    const matches = previewSelectionSet.has(state.hoveredTileIndex);

    if (state.selectionReferenceColor) {
      const referenceDistance = getColorDistance(hoveredTile.color, state.selectionReferenceColor);
      hoverInfo.textContent =
        `${hoveredHex} tile under cursor. Size ${Math.round(paintBounds.width)} x ${Math.round(paintBounds.height)} px. ` +
        `Reference distance ${referenceDistance.toFixed(1)} / ${thresholdInput.value}. ` +
        `${matches ? "Included in selection." : "Outside selection."}`;
      return;
    }

    if (paletteColor) {
      const hoveredDistance = getColorDistance(hoveredTile.color, paletteColor);
      hoverInfo.textContent =
        `${paletteColor.hex} active. Hover tile ${hoveredHex}. ` +
        `Size ${Math.round(paintBounds.width)} x ${Math.round(paintBounds.height)} px. ` +
        `Distance ${hoveredDistance.toFixed(1)} / ${thresholdInput.value}. ` +
        `${matches ? "Included in selection." : "Outside selection."}`;
      return;
    }

    hoverInfo.textContent =
      `${hoveredHex} tile under cursor. Click to select, Shift-click to add, or drag to scan the area tone.`;
    return;
  }

  if (explicitSelectionCount) {
    const referenceHex = state.selectionReferenceColor
      ? rgbToHex(
          state.selectionReferenceColor.r,
          state.selectionReferenceColor.g,
          state.selectionReferenceColor.b
        )
      : "none";
    hoverInfo.textContent =
      `${formatCount(explicitSelectionCount)} tiles selected. Reference ${referenceHex}. ` +
      `Preview ${state.showSelectionPreview ? "on" : "off"}.`;
    return;
  }

  if (paletteColor) {
    hoverInfo.textContent =
      `${paletteColor.hex} active. ${formatCount(state.renderCache.selectedTiles)} matching tiles. ` +
      `Preview ${state.showSelectionPreview ? "on" : "off"}.`;
    return;
  }

  hoverInfo.textContent =
    "Choose a color to preview matching mosaic tiles.";
}

function updateSelectionPreviewToggleUI() {
  selectionPreviewOnButton.classList.toggle("is-active", state.showSelectionPreview);
  selectionPreviewOffButton.classList.toggle("is-active", !state.showSelectionPreview);
  selectionPreviewOnButton.setAttribute("aria-pressed", String(state.showSelectionPreview));
  selectionPreviewOffButton.setAttribute("aria-pressed", String(!state.showSelectionPreview));
}

function applyReplacement() {
  const replacementColor = hexToRgb(replacementColorInput.value);
  const targetIndices = getActiveSelectionIndices();

  if (!targetIndices.length) {
    paletteSummary.textContent = "Select tiles or choose a color before replacing.";
    return;
  }

  const targetSet = new Set(targetIndices);
  const previousHex = replacementColorInput.value.toUpperCase();
  let changedTiles = 0;

  state.mosaicTiles = state.mosaicTiles.map((tile, index) => {
    if (targetSet.has(index)) {
      changedTiles += 1;
      return {
        ...tile,
        color: { ...replacementColor },
        hsl: rgbToHsl(replacementColor.r, replacementColor.g, replacementColor.b)
      };
    }

    return tile;
  });

  state.workingImageData = rasterizeTiles(state.mosaicTiles, state.image.width, state.image.height);
  invalidateSelectionCaches();
  state.autoPalette = buildWheelPalette(state.mosaicTiles, clampNumber(Number(paletteCountInput.value), 3, 16));
  syncPalette(previousHex);
  state.hoveredTileIndex = -1;
  state.showSelectionPreview = false;
  updateSelectionPreviewToggleUI();
  setSelectedTileIndices(targetIndices, {
    mode: "manual",
    referenceColor: replacementColor
  });
  focusColorInPalette(replacementColor, { rerender: false });

  renderPalette();
  invalidateRenderCache();
  requestPreviewRender();
  paletteSummary.textContent = `${formatCount(changedTiles)} tiles changed to ${previousHex}.`;
}

function applyTileContentFill(kind) {
  const targetIndices = getActiveSelectionIndices();

  if (!targetIndices.length) {
    paletteSummary.textContent = "Select some tiles first.";
    return;
  }

  const textCharacters = Array.from(String(tileFillTextInput?.value || "").trim()).filter(Boolean);
  const content = kind === "emoji" ? String(tileFillEmojiInput?.value || "").trim() : textCharacters.join("");

  if (!content) {
    paletteSummary.textContent = kind === "emoji" ? "Choose an emoji first." : "Type a letter first.";
    return;
  }

  pushAppHistory();
  const targetSet = new Set(targetIndices);
  const fillColor = String(tileFillColorInput?.value || replacementColorInput.value || "#111111").toUpperCase();
  const fillFontFamily = tileFillFontFamilyInput?.value || "'Space Mono', monospace";
  const fillRemoveBackground = Boolean(tileFillRemoveBgInput?.checked);
  let changedTiles = 0;
  let letterCursor = 0;

  state.mosaicTiles = state.mosaicTiles.map((tile, index) => {
    if (!targetSet.has(index)) {
      return tile;
    }

    const nextContent =
      kind === "emoji"
        ? content
        : textCharacters[letterCursor++ % textCharacters.length];

    changedTiles += 1;
    return {
      ...tile,
      fillContent: nextContent,
      fillType: kind,
      fillColor,
      fillFontFamily,
      fillRemoveBackground
    };
  });

  state.workingImageData = rasterizeTiles(state.mosaicTiles, state.image.width, state.image.height);
  invalidateSelectionCaches();
  invalidateRenderCache();
  requestPreviewRender();
  paletteSummary.textContent =
    `${formatCount(changedTiles)} tiles filled with ${kind === "emoji" ? "emoji" : "letter"} "${content}".`;
}

function syncSelectedTileFillBackgroundRemoval(removeBackground) {
  if (!state.mosaicTiles.length) {
    return;
  }

  const targetIndices = getActiveSelectionIndices();

  if (!targetIndices.length) {
    return;
  }

  const targetSet = new Set(targetIndices);
  let changedTiles = 0;

  state.mosaicTiles = state.mosaicTiles.map((tile, index) => {
    if (!targetSet.has(index) || !tile.fillContent) {
      return tile;
    }

    changedTiles += 1;
    return {
      ...tile,
      fillRemoveBackground: removeBackground
    };
  });

  if (!changedTiles) {
    return;
  }

  state.workingImageData = rasterizeTiles(state.mosaicTiles, state.image.width, state.image.height);
  invalidateSelectionCaches();
  invalidateRenderCache();
  requestPreviewRender();
  paletteSummary.textContent = removeBackground
    ? `${formatCount(changedTiles)} filled tiles now use a transparent background.`
    : `${formatCount(changedTiles)} filled tiles now keep their tile background.`;
}

function applyDatamosh() {
  const sourceIndices = getActiveSelectionIndices();

  if (!sourceIndices.length) {
    paletteSummary.textContent = "Select tiles or choose a color first for pixel shift.";
    return;
  }

  const direction = datamoshDirectionInput.value;
  const amount = clampNumber(Number(datamoshAmountInput.value), 1);
  const offset = getDirectionOffset(direction);
  const sourceTiles = sourceIndices
    .map((index) => state.mosaicTiles[index])
    .filter(Boolean)
    .map((tile) => ({
      row: tile.row,
      column: tile.column,
      color: { ...tile.color }
    }));

  if (!sourceTiles.length) {
    paletteSummary.textContent = "No source tiles found for pixel shift.";
    return;
  }

  const updatedTiles = state.mosaicTiles.map((tile) => ({
    ...tile,
    color: { ...tile.color },
    hsl: { ...tile.hsl }
  }));
  const changedIndices = new Set();

  sourceTiles.forEach((sourceTile) => {
    for (let step = 1; step <= amount; step += 1) {
      const targetRow = sourceTile.row + offset.dy * step;
      const targetColumn = sourceTile.column + offset.dx * step;
      const targetIndex = getTileIndexByGridPosition(targetRow, targetColumn);

      if (targetIndex < 0) {
        break;
      }

      updatedTiles[targetIndex].color = { ...sourceTile.color };
      updatedTiles[targetIndex].hsl = rgbToHsl(sourceTile.color.r, sourceTile.color.g, sourceTile.color.b);
      changedIndices.add(targetIndex);
    }
  });

  if (!changedIndices.size) {
    paletteSummary.textContent = "Pixel shift ran, but no tiles remained in that direction.";
    return;
  }

  const changedIndexList = Array.from(changedIndices);
  const dominantColor = getDominantColorFromTileIndices(changedIndexList, updatedTiles);

  state.mosaicTiles = updatedTiles;
  state.workingImageData = rasterizeTiles(state.mosaicTiles, state.image.width, state.image.height);
  invalidateSelectionCaches();
  state.autoPalette = buildWheelPalette(state.mosaicTiles, clampNumber(Number(paletteCountInput.value), 3, 16));
  syncPalette(dominantColor ? rgbToHex(dominantColor.r, dominantColor.g, dominantColor.b) : null);
  state.hoveredTileIndex = -1;

  if (dominantColor) {
    focusColorInPalette(dominantColor, { rerender: false });
  }

  renderPalette();
  invalidateRenderCache();
  requestPreviewRender();
  paletteSummary.textContent =
    `${formatCount(changedIndices.size)} tiles were copied ${amount} steps toward ${directionLabel(direction)}.`;
}

function rasterizeTiles(tiles, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    return new ImageData(width, height);
  }

  tiles.forEach((tile) => {
    if (!(tile.fillContent && tile.fillRemoveBackground)) {
      context.fillStyle = rgbToCss(tile.color);
      fillTile(context, tile);
    }
    drawTileInnerContent(context, tile);
  });

  return context.getImageData(0, 0, width, height);
}

function syncPalette(preferredHex = null) {
  const merged = [];
  const seen = new Set();

  state.customPalette.forEach((color) => {
    if (!seen.has(color.hex)) {
      seen.add(color.hex);
      merged.push(color);
    }
  });

  state.autoPalette.forEach((color) => {
    if (!seen.has(color.hex)) {
      seen.add(color.hex);
      merged.push(color);
    }
  });

  state.palette = merged;

  if (!state.palette.length) {
    state.activeColorIndex = -1;
    return;
  }

  if (preferredHex) {
    const preferredIndex = state.palette.findIndex((color) => color.hex === preferredHex);

    if (preferredIndex >= 0) {
      state.activeColorIndex = preferredIndex;
      return;
    }
  }

  state.activeColorIndex = 0;
}

function beginCanvasSelectionDrag(event) {
  const point = framePointToImagePoint(getCanvasPointFromEvent(event));
  const startTileIndex = getTileIndexFromPoint(point.x, point.y);

  state.dragSelection = {
    active: true,
    moved: false,
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    startTileIndex,
    startX: point.x,
    startY: point.y,
    currentX: point.x,
    currentY: point.y
  };

  event.preventDefault();
}

function updateCanvasSelectionDrag(event) {
  const point = framePointToImagePoint(getCanvasPointFromEvent(event));

  state.dragSelection.currentX = point.x;
  state.dragSelection.currentY = point.y;
  state.dragSelection.moved =
    Math.abs(point.x - state.dragSelection.startX) > DRAG_THRESHOLD ||
    Math.abs(point.y - state.dragSelection.startY) > DRAG_THRESHOLD;

  state.hoveredTileIndex = getTileIndexFromPoint(point.x, point.y);
  requestPreviewRender();
}

function endCanvasSelectionDrag(event) {
  const interaction = state.dragSelection;
  const point = framePointToImagePoint(getCanvasPointFromEvent(event));
  state.dragSelection.currentX = point.x;
  state.dragSelection.currentY = point.y;
  state.dragSelection = null;

  if (!interaction.moved) {
    handleCanvasTileSelection(interaction.startTileIndex, {
      additive: interaction.shiftKey,
      subtractive: interaction.altKey
    });
    return;
  }

  const rect = getNormalizedRect(
    interaction.startX,
    interaction.startY,
    point.x,
    point.y
  );
  handleCanvasAreaSelection(rect, {
    additive: interaction.shiftKey,
    subtractive: interaction.altKey
  });
}

function invertCurrentSelection() {
  pushSelectionHistory();

  const nextSelected = [];

  for (let index = 0; index < state.mosaicTiles.length; index += 1) {
    if (!state.selectedTileIndices.has(index)) {
      nextSelected.push(index);
    }
  }

  if (!nextSelected.length) {
    clearExplicitSelection();
    renderPalette();
    paletteSummary.textContent = "Invert selection left no tiles selected.";
    return;
  }

  const referenceColor = getDominantColorFromTileIndices(nextSelected);

  if (referenceColor) {
    focusColorInPalette(referenceColor, { rerender: false });
  }

  enableSelectionPreviewFromSelectionAction();
  setSelectedTileIndices(nextSelected, {
    mode: "manual",
    referenceColor
  });
  renderPalette();
  invalidateRenderCache();
  requestPreviewRender();
  paletteSummary.textContent = `${formatCount(nextSelected.length)} tiles selected by inversion.`;
}

function handleCanvasTileSelection(tileIndex, options = {}) {
  if (tileIndex < 0) {
    return;
  }

  pushSelectionHistory();
  const tile = state.mosaicTiles[tileIndex];
  const additive = Boolean(options.additive);
  const subtractive = Boolean(options.subtractive);
  const nextSelected = additive || subtractive ? new Set(state.selectedTileIndices) : new Set();

  if (subtractive) {
    nextSelected.delete(tileIndex);
  } else if (additive && nextSelected.has(tileIndex)) {
    nextSelected.delete(tileIndex);
  } else {
    nextSelected.add(tileIndex);
  }

  focusColorInPalette(tile.color, { rerender: false });

  if (!nextSelected.size) {
    clearExplicitSelection();
    paletteSummary.textContent = "Selected tiles removed.";
    renderPalette();
    return;
  }

  enableSelectionPreviewFromSelectionAction();
  setSelectedTileIndices(Array.from(nextSelected), {
    mode: "manual",
    referenceColor: getDominantColorFromTileIndices(Array.from(nextSelected))
  });
  renderPalette();
  invalidateRenderCache();
  requestPreviewRender();
  paletteSummary.textContent =
    additive
      ? `${formatCount(nextSelected.size)} tiles selected. You can expand this with similar tiles.`
      : `${rgbToHex(tile.color.r, tile.color.g, tile.color.b)} tile selected.`;
}

function handleCanvasAreaSelection(rect, options = {}) {
  const areaTileIndices = getTileIndicesInRect(rect);
  const additive = Boolean(options.additive);
  const subtractive = Boolean(options.subtractive);
  pushSelectionHistory();

  if (!areaTileIndices.length) {
    paletteSummary.textContent = "No tiles were found in the dragged area.";
    requestPreviewRender();
    return;
  }

  if (subtractive) {
    const nextSelected = new Set(state.selectedTileIndices);
    areaTileIndices.forEach((tileIndex) => {
      nextSelected.delete(tileIndex);
    });

    if (!nextSelected.size) {
      clearExplicitSelection();
      renderPalette();
      paletteSummary.textContent = "Alt removed the dragged area from the selection.";
      return;
    }

    setSelectedTileIndices(Array.from(nextSelected), {
      mode: "manual",
      referenceColor: getDominantColorFromTileIndices(Array.from(nextSelected))
    });
    renderPalette();
    invalidateRenderCache();
    requestPreviewRender();
    paletteSummary.textContent = `Alt removed ${formatCount(areaTileIndices.length)} tiles from the selection.`;
    return;
  }

  const dominantColor = getDominantColorFromTileIndices(areaTileIndices);

  if (!dominantColor) {
    return;
  }

  focusColorInPalette(dominantColor, { rerender: false });
  enableSelectionPreviewFromSelectionAction();
  if (additive) {
    const similarIndices = getSimilarTileIndices(dominantColor, Number(thresholdInput.value));
    const nextSelected = new Set(state.selectedTileIndices);
    similarIndices.forEach((tileIndex) => {
      nextSelected.add(tileIndex);
    });
    setSelectedTileIndices(Array.from(nextSelected), {
      mode: "manual",
      referenceColor: getDominantColorFromTileIndices(Array.from(nextSelected))
    });
    invalidateRenderCache();
    requestPreviewRender();
  } else {
    selectSimilarTilesByReference(dominantColor);
  }
  renderPalette();
  paletteSummary.textContent =
    `The dominant tone ${rgbToHex(dominantColor.r, dominantColor.g, dominantColor.b)} was found and similar tiles were selected.`;
}

function selectSimilarTilesByReference(referenceColor) {
  const similarIndices = getSimilarTileIndices(referenceColor, Number(thresholdInput.value));

  setSelectedTileIndices(similarIndices, {
    mode: "similar",
    referenceColor
  });

  invalidateRenderCache();
  requestPreviewRender();
}

function refreshSelectionFromReference() {
  if (!state.selectionReferenceColor || state.selectionMode !== "similar") {
    return;
  }

  const similarIndices = getSimilarTileIndices(
    state.selectionReferenceColor,
    Number(thresholdInput.value)
  );

  setSelectedTileIndices(similarIndices, {
    mode: "similar",
    referenceColor: state.selectionReferenceColor
  });

  invalidateRenderCache();
  requestPreviewRender();
}

function setSelectedTileIndices(indices, options = {}) {
  const validIndices = Array.from(new Set(indices)).filter((index) => {
    return Number.isInteger(index) && index >= 0 && index < state.mosaicTiles.length;
  });

  state.selectedTileIndices = new Set(validIndices);

  if (!validIndices.length) {
    state.selectionMode = "none";
    state.selectionReferenceColor = null;
  } else {
    state.selectionMode = options.mode || "manual";
    state.selectionReferenceColor = options.referenceColor
      ? { ...options.referenceColor }
      : getDominantColorFromTileIndices(validIndices);
  }

  bumpSelectionVersion();
  updateSelectionUi();
}

function clearExplicitSelection(options = {}) {
  state.selectedTileIndices = new Set();
  state.selectionReferenceColor = null;
  state.selectionMode = "none";
  bumpSelectionVersion();

  if (!options.keepPreviewState && options.keepPreviewState !== true) {
    state.showSelectionPreview = false;
    updateSelectionPreviewToggleUI();
  }

  updateSelectionUi();

  if (!options.skipRender) {
    invalidateRenderCache();
    requestPreviewRender();
  }
}

function refreshPreviewCanvas(options = {}) {
  state.hoveredTileIndex = -1;
  clearExplicitSelection({ skipRender: true });
  state.dragSelection = null;
  invalidateRenderCache();
  requestPreviewRender();

  if (options.summaryMessage) {
    paletteSummary.textContent = options.summaryMessage;
  }
}

function getSelectedTileIndicesArray() {
  return Array.from(state.selectedTileIndices);
}

function getActiveSelectionData() {
  const paletteColor = state.palette[state.activeColorIndex];
  const referenceHex = state.selectionReferenceColor
    ? rgbToHex(
        state.selectionReferenceColor.r,
        state.selectionReferenceColor.g,
        state.selectionReferenceColor.b
      )
    : "";
  const activeHex = paletteColor?.hex || "";
  const signature = [
    state.selectionVersion,
    state.selectionMode,
    state.selectedTileIndices.size,
    referenceHex,
    activeHex,
    thresholdInput.value
  ].join("|");

  if (state.activeSelectionCache.signature === signature) {
    return state.activeSelectionCache;
  }

  let indices = [];

  if (state.selectedTileIndices.size) {
    if (state.selectionReferenceColor && state.selectionMode === "similar") {
      indices = getSimilarTileIndices(state.selectionReferenceColor, Number(thresholdInput.value));
    } else {
      indices = getSelectedTileIndicesArray();
    }
  } else if (paletteColor) {
    indices = getSimilarTileIndices(paletteColor, Number(thresholdInput.value));
  }

  state.activeSelectionCache.signature = signature;
  state.activeSelectionCache.indices = indices;
  state.activeSelectionCache.set = new Set(indices);

  return state.activeSelectionCache;
}

function getActiveSelectionIndices() {
  return getActiveSelectionData().indices;
}

function getPreviewSelectionSet() {
  return getActiveSelectionData().set;
}

function getSimilarTileIndices(referenceColor, threshold) {
  const distances = getSimilarityDistances(referenceColor);

  return distances.reduce((indices, distance, index) => {
    if (distance <= threshold) {
      indices.push(index);
    }

    return indices;
  }, []);
}

function getSimilarityDistances(referenceColor) {
  const referenceHex = rgbToHex(referenceColor.r, referenceColor.g, referenceColor.b);
  const signature = `${state.mosaicTiles.length}|${referenceHex}`;

  if (state.similarityCache.signature === signature) {
    return state.similarityCache.distances;
  }

  const distances = state.mosaicTiles.map((tile) => getColorDistance(tile.color, referenceColor));

  state.similarityCache.signature = signature;
  state.similarityCache.distances = distances;

  return distances;
}

function getTileIndicesInRect(rect) {
  return state.mosaicTiles.reduce((indices, tile, index) => {
    if (tileIntersectsRect(tile, rect)) {
      indices.push(index);
    }

    return indices;
  }, []);
}

function tileIntersectsRect(tile, rect) {
  return !(
    tile.x + tile.width < rect.x ||
    tile.x > rect.x + rect.width ||
    tile.y + tile.height < rect.y ||
    tile.y > rect.y + rect.height
  );
}

function getNormalizedRect(startX, startY, endX, endY) {
  return {
    x: Math.min(startX, endX),
    y: Math.min(startY, endY),
    width: Math.abs(endX - startX),
    height: Math.abs(endY - startY)
  };
}

function getCanvasPointFromEvent(event) {
  const rect = previewCanvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * previewCanvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * previewCanvas.height;

  return {
    x: clampNumber(x, 0, previewCanvas.width),
    y: clampNumber(y, 0, previewCanvas.height)
  };
}

function getTileIndexFromEvent(event) {
  const point = getCanvasPointFromEvent(event);
  return getTileIndexFromPoint(point.x, point.y);
}

function getTileIndexFromPoint(x, y) {
  if (state.mosaicSettings?.mode === "count") {
    const row = clampNumber(Math.floor((y / state.image.height) * state.mosaicSettings.rows), 0, state.mosaicSettings.rows - 1);
    const column = clampNumber(Math.floor((x / state.image.width) * state.mosaicSettings.columns), 0, state.mosaicSettings.columns - 1);
    const quickIndex = row * state.mosaicSettings.columns + column;
    const quickTile = state.mosaicTiles[quickIndex];

    if (
      quickTile &&
      x >= quickTile.x &&
      x < quickTile.x + quickTile.width &&
      y >= quickTile.y &&
      y < quickTile.y + quickTile.height
    ) {
      return quickIndex;
    }
  }

  if (state.mosaicSettings?.mode === "size") {
    const column = clampNumber(Math.floor(x / state.mosaicSettings.tileWidth), 0, state.mosaicSettings.columns - 1);
    const row = clampNumber(Math.floor(y / state.mosaicSettings.tileHeight), 0, state.mosaicSettings.rows - 1);
    const quickIndex = row * state.mosaicSettings.columns + column;
    const quickTile = state.mosaicTiles[quickIndex];

    if (
      quickTile &&
      x >= quickTile.x &&
      x < quickTile.x + quickTile.width &&
      y >= quickTile.y &&
      y < quickTile.y + quickTile.height
    ) {
      return quickIndex;
    }
  }

  return state.mosaicTiles.findIndex((tile) => {
    return x >= tile.x && x < tile.x + tile.width && y >= tile.y && y < tile.y + tile.height;
  });
}

function getTileIndexByGridPosition(row, column) {
  if (!state.mosaicSettings) {
    return -1;
  }

  if (
    row < 0 ||
    column < 0 ||
    row >= state.mosaicSettings.rows ||
    column >= state.mosaicSettings.columns
  ) {
    return -1;
  }

  const index = row * state.mosaicSettings.columns + column;
  return index < state.mosaicTiles.length ? index : -1;
}

function focusColorInPalette(color, options = {}) {
  const hex = rgbToHex(color.r, color.g, color.b);
  const existingIndex = state.palette.findIndex((paletteColor) => paletteColor.hex === hex);

  if (existingIndex >= 0) {
    state.activeColorIndex = existingIndex;
  } else {
    const customExists = state.customPalette.some((paletteColor) => paletteColor.hex === hex);

    if (!customExists) {
      state.customPalette.unshift({
        r: color.r,
        g: color.g,
        b: color.b,
        count: 1,
        hex,
        source: "custom"
      });
    }

    syncPalette(hex);
  }

  replacementColorInput.value = hex;

  if (options.rerender !== false) {
    renderPalette();
  }
}

function getDominantColorFromTileIndices(indices, tileSource = state.mosaicTiles) {
  if (!indices.length) {
    return null;
  }

  const colors = indices
    .map((index) => tileSource[index]?.color)
    .filter(Boolean);

  return getDominantColorFromColors(colors);
}

function getDominantColorFromColors(colors) {
  if (!colors.length) {
    return null;
  }

  const buckets = new Map();

  colors.forEach((color) => {
    const r = quantizeChannel(color.r, 20);
    const g = quantizeChannel(color.g, 20);
    const b = quantizeChannel(color.b, 20);
    const key = `${r},${g},${b}`;

    if (!buckets.has(key)) {
      buckets.set(key, { r: 0, g: 0, b: 0, count: 0 });
    }

    const bucket = buckets.get(key);
    bucket.r += color.r;
    bucket.g += color.g;
    bucket.b += color.b;
    bucket.count += 1;
  });

  const dominantBucket = Array.from(buckets.values()).sort((left, right) => right.count - left.count)[0];

  if (!dominantBucket) {
    return null;
  }

  return {
    r: Math.round(dominantBucket.r / dominantBucket.count),
    g: Math.round(dominantBucket.g / dominantBucket.count),
    b: Math.round(dominantBucket.b / dominantBucket.count)
  };
}

function exportSvg() {
  const svg = buildSvgMarkup();
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  link.download = `pixelmaxxxing-${timestamp}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  paletteSummary.textContent = "SVG export downloaded.";
}

function exportRaster(format) {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = previewCanvas.width;
  exportCanvas.height = previewCanvas.height;
  const context = exportCanvas.getContext("2d");

  if (!context) {
    paletteSummary.textContent = "Raster export could not be created.";
    return;
  }

  const backgroundFill = resolveRasterBackgroundFill(format);

  if (backgroundFill) {
    context.fillStyle = backgroundFill;
    context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  } else {
    context.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
  }

  ensureCachedPreview();
  context.imageSmoothingEnabled = false;
  const renderRect = getSnappedRenderRect();
  context.drawImage(
    state.renderCache.canvas,
    renderRect.x,
    renderRect.y,
    renderRect.width,
    renderRect.height
  );
  drawTextOverlaysToContext(context);

  const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
  const extension = format === "jpg" ? "jpg" : "png";
  const quality = format === "jpg" ? 0.96 : undefined;

  exportCanvas.toBlob(
    (blob) => {
      if (!blob) {
        paletteSummary.textContent = `${format.toUpperCase()} export could not be created.`;
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.href = url;
      link.download = `pixelmaxxxing-${timestamp}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      paletteSummary.textContent = `${format.toUpperCase()} export downloaded.`;
    },
    mimeType,
    quality
  );
}

function buildSvgMarkup() {
  const blurId = "mosaic-blur-filter";
  const backgroundMarkup = getSvgBackgroundMarkup();
  const useSeamlessSquareExport =
    state.mosaicShape === "square" &&
    state.mosaicGapX === 0 &&
    state.mosaicGapY === 0 &&
    state.mosaicBlur === 0;
  const filterMarkup =
    state.mosaicBlur > 0
      ? `<defs><filter id="${blurId}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${escapeSvg(state.mosaicBlur / 2)}" /></filter></defs>`
      : "";

  const shapes = state.mosaicTiles.map((tile) => {
    if (tile.fillContent && tile.fillRemoveBackground) {
      return "";
    }

    const bounds = getPaintBounds(tile);
    const drawX = bounds.x * state.zoom + state.imageOffsetX;
    const drawY = bounds.y * state.zoom + state.imageOffsetY;
    const drawWidth = bounds.width * state.zoom;
    const drawHeight = bounds.height * state.zoom;
    const attrs = state.mosaicBlur > 0 ? ` filter="url(#${blurId})"` : "";
    const fill = escapeSvg(rgbToCss(tile.color));

    if (state.mosaicShape === "round") {
      return `<ellipse cx="${escapeSvg(drawX + drawWidth / 2)}" cy="${escapeSvg(drawY + drawHeight / 2)}" rx="${escapeSvg(drawWidth / 2)}" ry="${escapeSvg(drawHeight / 2)}" fill="${fill}"${attrs} />`;
    }

    const seamlessAttrs = useSeamlessSquareExport
      ? ` shape-rendering="crispEdges" stroke="${fill}" stroke-width="1" paint-order="stroke fill"`
      : "";

    return `<rect x="${escapeSvg(drawX)}" y="${escapeSvg(drawY)}" width="${escapeSvg(drawWidth)}" height="${escapeSvg(drawHeight)}" rx="0" ry="0" fill="${fill}"${seamlessAttrs}${attrs} />`;
  }).join("");

  const tileTextMarkup = state.mosaicTiles
    .filter((tile) => tile.fillContent)
    .map((tile) => {
      const bounds = getPaintBounds(tile);
      const drawX = bounds.x * state.zoom + state.imageOffsetX;
      const drawY = bounds.y * state.zoom + state.imageOffsetY;
      const drawWidth = bounds.width * state.zoom;
      const drawHeight = bounds.height * state.zoom;
      const fontSize = Math.max(Math.min(drawWidth, drawHeight) * 0.7, 6);
      const fontFamily = normalizeFontFamilyForSvg(
        tile.fillType === "emoji" ? EMOJI_FONT_STACK : tile.fillFontFamily || "'Space Mono', monospace"
      );

      return `<text x="${escapeSvg(drawX + drawWidth / 2)}" y="${escapeSvg(drawY + drawHeight / 2)}" fill="${escapeSvg(tile.fillColor || "#111111")}" font-family="${escapeSvg(fontFamily)}" font-size="${escapeSvg(fontSize)}" font-weight="${tile.fillType === "emoji" ? "400" : "700"}" dominant-baseline="middle" text-anchor="middle">${escapeSvg(tile.fillContent)}</text>`;
    })
    .join("");

  const textMarkup = state.textOverlays
    .map((overlay) => {
      const x = overlay.align === "center" ? ` text-anchor="middle"` : "";
      return `<text x="${escapeSvg(overlay.x)}" y="${escapeSvg(overlay.y)}" fill="${escapeSvg(overlay.color)}" font-family="${escapeSvg(normalizeFontFamilyForSvg(overlay.fontFamily))}" font-size="${escapeSvg(overlay.size)}" font-weight="${escapeSvg(overlay.fontWeight || "400")}" font-style="${escapeSvg(overlay.fontStyle || "normal")}" dominant-baseline="hanging"${x}>${escapeSvg(overlay.text)}</text>`;
    })
    .join("");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${previewCanvas.width}" height="${previewCanvas.height}" viewBox="0 0 ${previewCanvas.width} ${previewCanvas.height}" fill="none">`,
    filterMarkup,
    backgroundMarkup,
    `<g shape-rendering="${useSeamlessSquareExport ? "crispEdges" : "geometricPrecision"}">`,
    shapes,
    `</g>`,
    tileTextMarkup,
    textMarkup,
    `</svg>`
  ].join("");
}

function getSvgBackgroundMarkup() {
  if (state.previewBackgroundMode === "transparent") {
    return "";
  }

  let fill = "#ffffff";

  if (state.previewBackgroundMode === "black") {
    fill = "#000000";
  } else if (state.previewBackgroundMode === "custom") {
    fill = state.previewBackgroundColor || "#ff6b35";
  }

  return `<rect x="0" y="0" width="${previewCanvas.width}" height="${previewCanvas.height}" fill="${escapeSvg(fill)}" />`;
}

function resolveRasterBackgroundFill(format) {
  if (state.previewBackgroundMode === "transparent") {
    return format === "jpg" ? "#ffffff" : "";
  }

  if (state.previewBackgroundMode === "black") {
    return "#000000";
  }

  if (state.previewBackgroundMode === "custom") {
    return state.previewBackgroundColor || "#ff6b35";
  }

  return "#ffffff";
}

function normalizeFontFamilyForSvg(fontFamily) {
  return String(fontFamily || "Space Mono").replace(/['"]/g, "");
}

function fillTile(context, tile) {
  const bounds = getPaintBounds(tile);
  context.beginPath();
  addTilePath(context, bounds);
  context.fill();
}

function drawTileInnerContent(context, tile) {
  if (!tile.fillContent) {
    return;
  }

  const bounds = getPaintBounds(tile);
  const fontSize = Math.max(Math.min(bounds.width, bounds.height) * 0.7, 6);
  const fontFamily =
    tile.fillType === "emoji" ? EMOJI_FONT_STACK : tile.fillFontFamily || "'Space Mono', monospace";

  context.save();
  context.fillStyle = tile.fillColor || "#111111";
  context.font = `${tile.fillType === "emoji" ? "400" : "700"} ${Math.round(fontSize)}px ${fontFamily}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(tile.fillContent, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  context.restore();
}

function strokeTile(context, tile) {
  const bounds = getPaintBounds(tile);
  context.beginPath();
  addTilePath(context, bounds);
  context.stroke();
}

function addTilePath(context, bounds) {
  if (state.mosaicShape === "round") {
    context.ellipse(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
      Math.max(bounds.width / 2, 1),
      Math.max(bounds.height / 2, 1),
      0,
      0,
      Math.PI * 2
    );
  } else {
    context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  }
}

function getPaintBounds(tile) {
  const gapX = Math.max(0, state.mosaicGapX);
  const gapY = Math.max(0, state.mosaicGapY);
  const insetX = Math.min(gapX / 2, Math.max(tile.width / 2 - 0.5, 0));
  const insetY = Math.min(gapY / 2, Math.max(tile.height / 2 - 0.5, 0));

  return {
    x: tile.x + insetX,
    y: tile.y + insetY,
    width: Math.max(tile.width - insetX * 2, 1),
    height: Math.max(tile.height - insetY * 2, 1)
  };
}

function quantizeChannel(value, step) {
  return Math.min(255, Math.max(0, Math.round(value / step) * step));
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function rgbToCss(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
}

function rgbToHsl(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;
  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    switch (max) {
      case red:
        hue = ((green - blue) / delta) % 6;
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        hue = (red - green) / delta + 4;
        break;
    }

    hue *= 60;

    if (hue < 0) {
      hue += 360;
    }
  }

  return {
    h: hue,
    s: saturation,
    l: lightness
  };
}

function getHueDistance(firstHue, secondHue) {
  const difference = Math.abs(firstHue - secondHue);
  return Math.min(difference, 360 - difference);
}

function getColorDistance(first, second) {
  return Math.sqrt(
    (first.r - second.r) ** 2 +
      (first.g - second.g) ** 2 +
      (first.b - second.b) ** 2
  );
}

function blendChannel(base, target, amount) {
  return Math.round(base + (target - base) * amount);
}

function cloneImageData(imageData) {
  return new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
}

function cloneTileArray(tiles) {
  return tiles.map((tile) => ({
    ...tile,
    color: tile.color ? { ...tile.color } : tile.color,
    hsl: tile.hsl ? { ...tile.hsl } : tile.hsl
  }));
}

function clonePaletteArray(colors) {
  return colors.map((color) => ({
    ...color,
    hsl: color.hsl ? { ...color.hsl } : color.hsl
  }));
}

function cloneTextOverlayArray(overlays) {
  return overlays.map((overlay) => ({ ...overlay }));
}

function createTextProcessSnapshot() {
  return {
    workingImageData: cloneImageData(state.workingImageData),
    textOverlays: cloneTextOverlayArray(state.textOverlays),
    activeTextId: state.activeTextId,
    hoveredTextId: state.hoveredTextId,
    customPalette: clonePaletteArray(state.customPalette)
  };
}

function renderCurrentOverlaysIntoWorkingImage() {
  const rasterCanvas = document.createElement("canvas");
  rasterCanvas.width = state.image.width;
  rasterCanvas.height = state.image.height;
  const rasterContext = rasterCanvas.getContext("2d");

  if (!rasterContext || !state.workingImageData) {
    return null;
  }

  rasterContext.putImageData(cloneImageData(state.workingImageData), 0, 0);
  rasterContext.save();
  rasterContext.translate(-state.imageOffsetX, -state.imageOffsetY);
  rasterContext.scale(1 / state.zoom, 1 / state.zoom);
  drawOverlayArrayToContext(rasterContext, state.textOverlays, 1, false);
  rasterContext.restore();
  return rasterContext.getImageData(0, 0, rasterCanvas.width, rasterCanvas.height);
}

function rebuildWorkingImageFromProcessedLayers() {
  if (!state.originalImageData) {
    return;
  }

  const rasterCanvas = document.createElement("canvas");
  rasterCanvas.width = state.originalImageData.width;
  rasterCanvas.height = state.originalImageData.height;
  const rasterContext = rasterCanvas.getContext("2d");

  if (!rasterContext) {
    return;
  }

  rasterContext.putImageData(cloneImageData(state.originalImageData), 0, 0);

  if (state.processedTextOverlays.length) {
    rasterContext.save();
    rasterContext.translate(-state.imageOffsetX, -state.imageOffsetY);
    rasterContext.scale(1 / state.zoom, 1 / state.zoom);
    drawOverlayArrayToContext(rasterContext, state.processedTextOverlays, 1, false);
    rasterContext.restore();
  }

  state.workingImageData = rasterContext.getImageData(0, 0, rasterCanvas.width, rasterCanvas.height);
  analyzeImage();
}

function toggleTextProcessing() {
  if (state.textProcessSession) {
    state.workingImageData = cloneImageData(state.textProcessSession.workingImageData);
    state.customPalette = clonePaletteArray(state.textProcessSession.customPalette);
    state.textOverlays = cloneTextOverlayArray(state.textProcessSession.textOverlays);
    state.activeTextId = state.textProcessSession.activeTextId;
    state.hoveredTextId = state.textProcessSession.hoveredTextId;
    state.dragText = null;
    state.textProcessSession = null;
    analyzeImage();
    updateTextUi();
    textStatus.textContent = "Processed text removed. You can edit it again.";
    return;
  }

  if (!state.textOverlays.length) {
    textStatus.textContent = "Add some text or emoji first.";
    return;
  }

  const processedImageData = renderCurrentOverlaysIntoWorkingImage();

  if (!processedImageData) {
    textStatus.textContent = "Text processing failed.";
    return;
  }

  state.textProcessSession = createTextProcessSnapshot();
  state.workingImageData = processedImageData;
  state.textOverlays = [];
  state.activeTextId = null;
  state.hoveredTextId = null;
  state.dragText = null;
  analyzeImage();
  updateTextUi();
  textStatus.textContent = "Text processed. Apply to lock it in, or Remove to edit again.";
}

function applyProcessedTextToImage() {
  if (!state.textProcessSession) {
    textStatus.textContent = "Process the text first.";
    return;
  }

  state.textProcessSession = null;
  state.activeTextId = null;
  state.hoveredTextId = null;
  state.dragText = null;
  updateTextUi();
  textStatus.textContent = "Processed text applied permanently.";
  requestPreviewRender();
}

function updateTextUi() {
  const activeText = getActiveTextOverlay();

  removeTextButton.disabled = !activeText;
  processTextButton.disabled = !state.textOverlays.length && !state.textProcessSession;
  applyTextProcessButton.disabled = !state.textProcessSession;
  processTextButton.textContent = state.textProcessSession ? "Remove" : "Process";

  if (!activeText) {
    if (!state.textProcessSession && !textStatus.textContent) {
      textStatus.textContent = "After adding text, you can click and drag it on the canvas.";
    }
    return;
  }

  textContentInput.value = activeText.text;
  if (activeText.type !== "emoji") {
    textFontFamilyInput.value = activeText.fontFamily;
    textColorInput.value = activeText.color;
    if (textFontWeightInput) {
      textFontWeightInput.value = activeText.fontWeight || "400";
    }
    if (textFontStyleInput) {
      textFontStyleInput.value = activeText.fontStyle || "normal";
    }
  }
  textSizeInput.value = String(Math.round(activeText.size));
  textStatus.textContent =
    activeText.type === "emoji"
      ? "Active emoji selected. Drag it on the canvas to reposition it."
      : "Active text selected. Drag it on the canvas to reposition it.";
}

function clampNumber(value, min, max = Number.POSITIVE_INFINITY) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function hasUsableNumberInput(input, min = 0) {
  const rawValue = input.value.trim();

  if (rawValue === "") {
    return false;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) && value >= min;
}

function getInputNumberOrFallback(input, fallback, min = 0) {
  if (!hasUsableNumberInput(input, min)) {
    return fallback;
  }

  return clampNumber(Number(input.value), min);
}

function canAnalyzeWithCurrentInputs() {
  if (state.mosaicInputMode === "size") {
    return hasUsableNumberInput(mosaicTileWidthInput, 2) && hasUsableNumberInput(mosaicTileHeightInput, 2);
  }

  return hasUsableNumberInput(mosaicColumnsInput, 1) && hasUsableNumberInput(mosaicRowsInput, 1);
}

function formatCount(value) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

function formatZoom(value) {
  return `${Math.round(value * 100)}%`;
}

function getDirectionOffset(direction) {
  switch (direction) {
    case "left":
      return { dx: -1, dy: 0 };
    case "down":
      return { dx: 0, dy: 1 };
    case "up":
      return { dx: 0, dy: -1 };
    default:
      return { dx: 1, dy: 0 };
  }
}

function directionLabel(direction) {
  switch (direction) {
    case "left":
      return "left";
    case "down":
      return "down";
    case "up":
      return "up";
    default:
      return "right";
  }
}

function escapeSvg(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCount(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function directionLabel(direction) {
  switch (direction) {
    case "left":
      return "left";
    case "down":
      return "down";
    case "up":
      return "up";
    default:
      return "right";
  }
}

function getOverlayFontFamily(overlay) {
  if (!overlay) {
    return "'Space Mono', monospace";
  }

  if (overlay.type === "emoji") {
    return EMOJI_FONT_STACK;
  }

  return `${overlay.fontFamily}, ${EMOJI_FONT_STACK}`;
}

function renderTextLayerList() {
  if (!textLayerList) {
    return;
  }

  const pendingProcessedLayers = state.textProcessSession?.textOverlays || [];
  const visibleLayers = [
    ...state.textOverlays.map((overlay) => ({ overlay, source: "editable" })),
    ...pendingProcessedLayers.map((overlay) => ({ overlay, source: "session" })),
    ...state.processedTextOverlays.map((overlay) => ({ overlay, source: "processed" }))
  ];

  if (!visibleLayers.length) {
    textLayerList.innerHTML = '<p class="text-layer-empty">No text or emoji layers yet.</p>';
    return;
  }

  textLayerList.innerHTML = visibleLayers
    .slice()
    .reverse()
    .map(({ overlay, source }) => {
      const badge =
        source === "processed"
          ? overlay.type === "emoji"
            ? "PROCESSED EMOJI"
            : "PROCESSED TEXT"
          : source === "session"
            ? overlay.type === "emoji"
              ? "PENDING EMOJI"
              : "PENDING TEXT"
            : overlay.type === "emoji"
              ? "EMOJI"
              : "TEXT";
      const isActiveEditable = source === "editable" && overlay.id === state.activeTextId;
      const isActiveProcessed =
        source !== "editable" &&
        overlay.id === state.activeProcessedTextId &&
        source === state.activeProcessedTextSource;
      const activeClass = isActiveEditable || isActiveProcessed ? " is-active" : "";

      return `
        <button class="text-layer-item${activeClass}" type="button" data-text-layer-id="${overlay.id}" data-text-layer-source="${source}">
          <span class="text-layer-badge">${badge}</span>
          <span class="text-layer-text">${escapeHtml(overlay.text || badge)}</span>
        </button>
      `;
    })
    .join("");
}

function selectTextLayer(textId) {
  const overlay = state.textOverlays.find((item) => item.id === textId);

  if (overlay) {
    state.activeTextId = overlay.id;
    state.activeProcessedTextId = null;
    state.activeProcessedTextSource = null;
    state.hoveredTextId = overlay.id;
    setInteractionMode("move");
    updateTextUi();
    requestPreviewRender();
  }
}

function setInteractionMode(mode) {
  state.interactionMode = mode;
  state.hoveredTileIndex = -1;
  state.hoveredTextId = null;

  if (mode === "move") {
    setSelectionPreviewVisibility(false);
    hoverInfo.textContent = "Transform mode is active. Drag the image, text, or emoji inside the frame.";
  } else {
    hoverInfo.textContent = "Click or drag on the mosaic to make a selection.";
  }

  updateInteractionModeUi();
  updateHoverInfo();
  requestPreviewRender();
}

function updateInteractionModeUi() {
  modeSelectButton.classList.toggle("is-active", state.interactionMode === "select");
  modeMoveButton.classList.toggle("is-active", state.interactionMode === "move");
  previewCanvas.style.cursor = state.interactionMode === "move" ? "grab" : "crosshair";
}

function addOrUpdateTextOverlay() {
  if (!state.image) {
    textStatus.textContent = "Choose an image first.";
    return;
  }

  const value = textContentInput.value.trim();

  if (!value) {
    textStatus.textContent = "Type some text first.";
    return;
  }

  const fontFamily = textFontFamilyInput.value || "'Space Mono', monospace";
  const size = clampNumber(Number(textSizeInput.value), 8, 320);
  const color = textColorInput.value || "#111111";
  const fontWeight = textFontWeightInput?.value || "400";
  const fontStyle = textFontStyleInput?.value || "normal";
  const activeText = getActiveTextOverlay();

  if (activeText) {
    activeText.text = value;
    activeText.fontFamily = activeText.type === "emoji" ? activeText.fontFamily : fontFamily;
    activeText.size = size;
    activeText.color = activeText.type === "emoji" ? "#111111" : color;
    activeText.fontWeight = activeText.type === "emoji" ? "400" : fontWeight;
    activeText.fontStyle = activeText.type === "emoji" ? "normal" : fontStyle;
    textStatus.textContent = activeText.type === "emoji" ? "Selected emoji updated." : "Selected text updated.";
  } else {
    const overlay = {
      id: `text-${Date.now()}`,
      text: value,
      fontFamily,
      size,
      color,
      fontWeight,
      fontStyle,
      type: "text",
      x: Math.round(previewCanvas.width * 0.5),
      y: Math.round(previewCanvas.height * 0.5),
      align: "center"
    };
    state.textOverlays.push(overlay);
    state.activeTextId = overlay.id;
    state.hoveredTextId = overlay.id;
    textStatus.textContent = "Text added. Drag it inside the preview.";
  }

  updateTextUi();
  requestPreviewRender();
}

function addEmojiOverlay() {
  if (!state.image) {
    textStatus.textContent = "Choose an image first.";
    return;
  }

  const emoji = emojiPickerInput.value?.trim();

  if (!emoji) {
    textStatus.textContent = "Choose an emoji first.";
    return;
  }

  const size = clampNumber(Number(textSizeInput.value), 8, 320);
  const overlay = {
    id: `emoji-${Date.now()}`,
    text: emoji,
    fontFamily: EMOJI_FONT_STACK,
    size,
    color: "#111111",
    fontWeight: "400",
    fontStyle: "normal",
    type: "emoji",
    x: Math.round(previewCanvas.width * 0.5),
    y: Math.round(previewCanvas.height * 0.5),
    align: "center"
  };

  state.textOverlays.push(overlay);
  state.activeTextId = overlay.id;
  state.hoveredTextId = overlay.id;
  textStatus.textContent = "Emoji added. Drag it inside the preview.";
  updateTextUi();
  requestPreviewRender();
}

function removeActiveTextOverlay() {
  if (state.activeTextId) {
    pushAppHistory();
    state.textOverlays = state.textOverlays.filter((overlay) => overlay.id !== state.activeTextId);
    state.activeTextId = null;
    state.activeProcessedTextId = null;
    state.activeProcessedTextSource = null;
    state.hoveredTextId = null;
    textStatus.textContent = "Selected layer removed.";
    updateTextUi();
    requestPreviewRender();
    return;
  }

  if (!state.activeProcessedTextId) {
    return;
  }

  pushAppHistory();

  if (state.activeProcessedTextSource === "session" && state.textProcessSession) {
    state.textProcessSession.textOverlays = state.textProcessSession.textOverlays.filter(
      (overlay) => overlay.id !== state.activeProcessedTextId
    );

    state.processedTextOverlays = cloneTextOverlayArray(state.textProcessSession.textOverlays);
    rebuildWorkingImageFromProcessedLayers();
  } else {
    state.processedTextOverlays = state.processedTextOverlays.filter(
      (overlay) => overlay.id !== state.activeProcessedTextId
    );
    rebuildWorkingImageFromProcessedLayers();
  }

  state.activeProcessedTextId = null;
  state.activeProcessedTextSource = null;
  textStatus.textContent = "Selected processed layer removed.";
  updateTextUi();
  requestPreviewRender();
}

function centerActiveTextOverlay() {
  const activeText = getActiveTextOverlay();

  if (!activeText) {
    return;
  }

  pushAppHistory();
  activeText.x = Math.round(previewCanvas.width * 0.5);
  activeText.y = Math.round(previewCanvas.height * 0.5);
  activeText.align = "center";
  textStatus.textContent = "Layer centered in the preview.";
  requestPreviewRender();
}

function drawTextOverlaysToContext(context, scale = 1) {
  drawOverlayArrayToContext(context, state.textOverlays, scale, true);
}

function drawOverlayArrayToContext(context, overlays, scale = 1, showSelectionFrame = false) {
  if (!overlays.length) {
    return;
  }

  context.save();
  context.textBaseline = "top";

  overlays.forEach((overlay) => {
    const fontWeight = overlay.fontWeight || "400";
    const fontStyle = overlay.fontStyle || "normal";
    context.font = `${fontStyle} ${fontWeight} ${Math.round(overlay.size * scale)}px ${getOverlayFontFamily(overlay)}`;
    context.fillStyle = overlay.color;
    context.textAlign = overlay.align || "left";
    context.fillText(overlay.text, overlay.x * scale, overlay.y * scale);

    if (showSelectionFrame && context === previewContext && overlay.id === state.activeTextId) {
      const bounds = getTextOverlayBounds(overlay);
      context.save();
      context.strokeStyle = "rgba(17, 17, 17, 0.55)";
      context.lineWidth = 1;
      context.setLineDash([6, 4]);
      context.strokeRect(bounds.x - 4, bounds.y - 4, bounds.width + 8, bounds.height + 8);
      context.restore();
    }
  });

  context.restore();
}

function getTextOverlayBounds(overlay) {
  previewContext.save();
  const fontWeight = overlay.fontWeight || "400";
  const fontStyle = overlay.fontStyle || "normal";
  previewContext.font = `${fontStyle} ${fontWeight} ${Math.round(overlay.size)}px ${getOverlayFontFamily(overlay)}`;
  previewContext.textBaseline = "top";
  const metrics = previewContext.measureText(overlay.text);
  previewContext.restore();

  const width = Math.max(metrics.width, 1);
  const height = Math.max(overlay.size * 1.1, 1);
  const x = overlay.align === "center" ? overlay.x - width / 2 : overlay.x;

  return { x, y: overlay.y, width, height };
}

function toggleTextProcessing() {
  if (state.textProcessSession) {
    pushAppHistory();
    state.workingImageData = cloneImageData(state.textProcessSession.workingImageData);
    state.customPalette = clonePaletteArray(state.textProcessSession.customPalette);
    state.textOverlays = cloneTextOverlayArray(state.textProcessSession.textOverlays);
    state.processedTextOverlays = [];
    state.activeTextId = state.textProcessSession.activeTextId;
    state.activeProcessedTextId = null;
    state.activeProcessedTextSource = null;
    state.hoveredTextId = state.textProcessSession.hoveredTextId;
    state.dragText = null;
    state.textProcessSession = null;
    analyzeImage();
    updateTextUi();
    textStatus.textContent = "Processed text removed. You can edit it again.";
    return;
  }

  if (!state.textOverlays.length) {
    textStatus.textContent = "Add some text or emoji first.";
    return;
  }

  pushAppHistory();
  const processedImageData = renderCurrentOverlaysIntoWorkingImage();

  if (!processedImageData) {
    textStatus.textContent = "Text processing failed.";
    return;
  }

  state.textProcessSession = createTextProcessSnapshot();
  state.workingImageData = processedImageData;
  state.processedTextOverlays = cloneTextOverlayArray(state.textOverlays);
  state.textOverlays = [];
  state.activeTextId = null;
  state.activeProcessedTextId = state.processedTextOverlays[0]?.id || null;
  state.activeProcessedTextSource = state.activeProcessedTextId ? "session" : null;
  state.hoveredTextId = null;
  state.dragText = null;
  analyzeImage();
  updateTextUi();
  textStatus.textContent = "Text processed. Apply to lock it in, or Remove to edit again.";
}

function applyProcessedTextToImage() {
  if (!state.textProcessSession) {
    textStatus.textContent = "Process the text first.";
    return;
  }

  pushAppHistory();
  state.processedTextOverlays = cloneTextOverlayArray(state.textProcessSession.textOverlays);
  state.textProcessSession = null;
  state.activeTextId = null;
  state.activeProcessedTextId = null;
  state.activeProcessedTextSource = null;
  state.hoveredTextId = null;
  state.dragText = null;
  updateTextUi();
  textStatus.textContent = "Processed text applied permanently.";
  requestPreviewRender();
}

function updateTextUi() {
  const activeText = getActiveTextOverlay();
  const activeProcessedOverlay =
    state.activeProcessedTextSource === "session"
      ? state.textProcessSession?.textOverlays?.find((overlay) => overlay.id === state.activeProcessedTextId) || null
      : state.processedTextOverlays.find((overlay) => overlay.id === state.activeProcessedTextId) || null;

  removeTextButton.disabled = !activeText && !activeProcessedOverlay;
  processTextButton.disabled = !state.textOverlays.length && !state.textProcessSession;
  applyTextProcessButton.disabled = !state.textProcessSession;
  processTextButton.textContent = state.textProcessSession ? "Remove" : "Process";

  renderTextLayerList();

  if (!activeText && !activeProcessedOverlay) {
    if (!state.textProcessSession) {
      textStatus.textContent = "Add text or emoji, then drag it inside the preview.";
    }
    return;
  }

  if (!activeText && activeProcessedOverlay) {
    textContentInput.value = activeProcessedOverlay.type === "emoji" ? "" : activeProcessedOverlay.text;
    textSizeInput.value = String(Math.round(activeProcessedOverlay.size));
    textStatus.textContent = "Processed layer selected. You can remove it from the image.";
    return;
  }

  textContentInput.value = activeText.type === "emoji" ? "" : activeText.text;

  if (activeText.type !== "emoji") {
    textFontFamilyInput.value = activeText.fontFamily;
    textColorInput.value = activeText.color;
    if (textFontWeightInput) {
      textFontWeightInput.value = activeText.fontWeight || "400";
    }
    if (textFontStyleInput) {
      textFontStyleInput.value = activeText.fontStyle || "normal";
    }
  }

  textSizeInput.value = String(Math.round(activeText.size));
  textStatus.textContent =
    activeText.type === "emoji"
      ? "Emoji layer selected. Drag it inside the preview."
      : "Text layer selected. Drag it inside the preview.";
}

function pushExistingAppSnapshot(snapshot) {
  if (!snapshot) {
    return;
  }

  state.appUndoStack.push(snapshot);

  if (state.appUndoStack.length > MAX_APP_HISTORY) {
    state.appUndoStack.shift();
  }
}

function beginTextDrag(event, textId, point) {
  if (state.interactionMode !== "move") {
    return;
  }

  const overlay = state.textOverlays.find((item) => item.id === textId);

  if (!overlay) {
    return;
  }

  const bounds = getTextOverlayBounds(overlay);
  state.activeTextId = textId;
  state.hoveredTextId = textId;
  state.dragText = {
    active: true,
    id: textId,
    offsetX: point.x - bounds.x,
    offsetY: point.y - bounds.y,
    startX: overlay.x,
    startY: overlay.y,
    historySnapshot: createAppSnapshot({ full: false }),
    moved: false
  };
  previewCanvas.style.cursor = "move";
  updateTextUi();
  requestPreviewRender();
  event.preventDefault();
}

function updateTextDrag(event) {
  const overlay = getActiveTextOverlay();

  if (!overlay || !state.dragText?.active) {
    return;
  }

  const point = getCanvasPointFromEvent(event);
  const bounds = getTextOverlayBounds(overlay);
  const nextX = point.x - state.dragText.offsetX;
  const nextY = point.y - state.dragText.offsetY;
  const halfWidth = bounds.width / 2;

  overlay.x =
    overlay.align === "center"
      ? clampNumber(nextX + halfWidth, halfWidth, Math.max(previewCanvas.width - halfWidth, halfWidth))
      : clampNumber(nextX, 0, Math.max(previewCanvas.width - bounds.width, 0));
  overlay.y = clampNumber(nextY, 0, Math.max(previewCanvas.height - bounds.height, 0));
  state.dragText.moved =
    state.dragText.moved ||
    Math.abs(overlay.x - state.dragText.startX) > 0.5 ||
    Math.abs(overlay.y - state.dragText.startY) > 0.5;
  textStatus.textContent = overlay.type === "emoji" ? "Dragging emoji layer." : "Dragging text layer.";
  requestPreviewRender();
}

function endTextDrag(event) {
  if (!state.dragText?.active) {
    return;
  }

  updateTextDrag(event);
  const dragState = state.dragText;

  if (dragState.moved) {
    pushExistingAppSnapshot(dragState.historySnapshot);
  }

  state.dragText = null;
  previewCanvas.style.cursor = state.interactionMode === "move" ? "grab" : "crosshair";
  textStatus.textContent = "Layer moved.";
  requestPreviewRender();
}

function beginImageDrag(event, point) {
  if (state.interactionMode !== "move" || !state.image) {
    return;
  }

  state.dragImage = {
    active: true,
    startX: point.x,
    startY: point.y,
    startOffsetX: state.imageOffsetX,
    startOffsetY: state.imageOffsetY,
    historySnapshot: createAppSnapshot({ full: false }),
    moved: false
  };
  previewCanvas.style.cursor = "grabbing";
  hoverInfo.textContent = "Dragging image inside the frame.";
  event.preventDefault();
}

function updateImageDrag(event) {
  if (!state.dragImage?.active || !state.image) {
    return;
  }

  const point = getCanvasPointFromEvent(event);
  state.imageOffsetX = state.dragImage.startOffsetX + (point.x - state.dragImage.startX);
  state.imageOffsetY = state.dragImage.startOffsetY + (point.y - state.dragImage.startY);
  constrainImageOffsets();
  state.dragImage.moved =
    state.dragImage.moved ||
    Math.abs(state.imageOffsetX - state.dragImage.startOffsetX) > 0.5 ||
    Math.abs(state.imageOffsetY - state.dragImage.startOffsetY) > 0.5;
  requestPreviewRender();
}

function endImageDrag(event) {
  if (!state.dragImage?.active) {
    return;
  }

  updateImageDrag(event);
  const dragState = state.dragImage;

  if (dragState.moved) {
    pushExistingAppSnapshot(dragState.historySnapshot);
  }

  state.dragImage = null;
  previewCanvas.style.cursor = "grab";
  hoverInfo.textContent = "Image moved.";
  requestPreviewRender();
}

function setInteractionMode(mode) {
  state.interactionMode = mode;
  state.hoveredTileIndex = -1;
  state.hoveredTextId = null;

  if (mode === "move") {
    setSelectionPreviewVisibility(false);
  }

  updateInteractionModeUi();
  updateHoverInfo();
  requestPreviewRender();
}

function updateInteractionModeUi() {
  modeSelectButton.classList.toggle("is-active", state.interactionMode === "select");
  modeMoveButton.classList.toggle("is-active", state.interactionMode === "move");
  previewCanvas.style.cursor = state.interactionMode === "move" ? "grab" : "crosshair";
}

function updateHoverInfo() {
  if (state.dragImage?.active) {
    hoverInfo.textContent = "Dragging image inside the frame.";
    return;
  }

  if (state.dragText?.active) {
    hoverInfo.textContent = "Dragging text or emoji inside the frame.";
    return;
  }

  if (state.dragSelection?.active && state.dragSelection.moved) {
    const rect = getNormalizedRect(
      state.dragSelection.startX,
      state.dragSelection.startY,
      state.dragSelection.currentX,
      state.dragSelection.currentY
    );
    const areaTileCount = getTileIndicesInRect(rect).length;
    hoverInfo.textContent = `Scanning area. ${formatCount(areaTileCount)} tiles are inside the current box.`;
    return;
  }

  const explicitSelectionCount = state.selectedTileIndices.size;
  const paletteColor = state.palette[state.activeColorIndex];
  const previewSelectionSet = getPreviewSelectionSet();

  if (state.interactionMode === "move") {
    if (state.hoveredTextId) {
      const activeText = state.textOverlays.find((overlay) => overlay.id === state.hoveredTextId);

      if (activeText) {
        hoverInfo.textContent = `"${activeText.text}" selected. Drag it anywhere inside the frame.`;
        return;
      }
    }

    hoverInfo.textContent = "Transform mode is active. Drag the image, text, or emoji inside the frame.";
    return;
  }

  if (state.hoveredTextId) {
    const activeText = state.textOverlays.find((overlay) => overlay.id === state.hoveredTextId);

    if (activeText) {
      hoverInfo.textContent = `"${activeText.text}" selected. Switch to Transform mode to move it.`;
      return;
    }
  }

  if (state.hoveredTileIndex >= 0) {
    const hoveredTile = state.mosaicTiles[state.hoveredTileIndex];
    const paintBounds = getPaintBounds(hoveredTile);
    const hoveredHex = rgbToHex(hoveredTile.color.r, hoveredTile.color.g, hoveredTile.color.b);
    const matches = previewSelectionSet.has(state.hoveredTileIndex);

    if (state.selectionReferenceColor) {
      const referenceDistance = getColorDistance(hoveredTile.color, state.selectionReferenceColor);
      hoverInfo.textContent =
        `${hoveredHex} tile. ${Math.round(paintBounds.width)} x ${Math.round(paintBounds.height)} px. ` +
        `Distance ${referenceDistance.toFixed(1)} / ${thresholdInput.value}. ` +
        `${matches ? "Included in selection." : "Outside selection."}`;
      return;
    }

    if (paletteColor) {
      const hoveredDistance = getColorDistance(hoveredTile.color, paletteColor);
      hoverInfo.textContent =
        `${paletteColor.hex} active. Hover tile ${hoveredHex}. ` +
        `${Math.round(paintBounds.width)} x ${Math.round(paintBounds.height)} px. ` +
        `Distance ${hoveredDistance.toFixed(1)} / ${thresholdInput.value}. ` +
        `${matches ? "Included in selection." : "Outside selection."}`;
      return;
    }

    hoverInfo.textContent = `${hoveredHex} tile. Click to select, Shift to add, or drag to scan an area.`;
    return;
  }

  if (explicitSelectionCount) {
    const referenceHex = state.selectionReferenceColor
      ? rgbToHex(
          state.selectionReferenceColor.r,
          state.selectionReferenceColor.g,
          state.selectionReferenceColor.b
        )
      : "none";
    hoverInfo.textContent =
      `${formatCount(explicitSelectionCount)} tiles selected. Reference ${referenceHex}. ` +
      `Preview ${state.showSelectionPreview ? "on" : "off"}.`;
    return;
  }

  if (paletteColor) {
    hoverInfo.textContent =
      `${paletteColor.hex} active. ${formatCount(state.renderCache.selectedTiles)} matching tiles. ` +
      `Preview ${state.showSelectionPreview ? "on" : "off"}.`;
    return;
  }

  hoverInfo.textContent = "Selection mode is active. Click or drag on the mosaic to build a selection.";
}

function updateTextUi() {
  const activeText = getActiveTextOverlay();
  const activeProcessedOverlay =
    state.activeProcessedTextSource === "session"
      ? state.textProcessSession?.textOverlays?.find((overlay) => overlay.id === state.activeProcessedTextId) || null
      : state.processedTextOverlays.find((overlay) => overlay.id === state.activeProcessedTextId) || null;

  removeTextButton.disabled = !activeText && !activeProcessedOverlay;
  processTextButton.disabled = !state.textOverlays.length && !state.textProcessSession;
  applyTextProcessButton.disabled = !state.textProcessSession;
  processTextButton.textContent = state.textProcessSession ? "Remove" : "Process";

  renderTextLayerList();

  if (!activeText && !activeProcessedOverlay) {
    if (!state.textProcessSession) {
      textStatus.textContent = "Add text or emoji, then switch to Transform mode to position it.";
    }
    return;
  }

  if (!activeText && activeProcessedOverlay) {
    textContentInput.value = activeProcessedOverlay.type === "emoji" ? "" : activeProcessedOverlay.text;
    textSizeInput.value = String(Math.round(activeProcessedOverlay.size));
    textStatus.textContent = "Processed layer selected. Remove it if you want to edit again.";
    return;
  }

  textContentInput.value = activeText.type === "emoji" ? "" : activeText.text;

  if (activeText.type !== "emoji") {
    textFontFamilyInput.value = activeText.fontFamily;
    textColorInput.value = activeText.color;
    if (textFontWeightInput) {
      textFontWeightInput.value = activeText.fontWeight || "400";
    }
    if (textFontStyleInput) {
      textFontStyleInput.value = activeText.fontStyle || "normal";
    }
  }

  textSizeInput.value = String(Math.round(activeText.size));
  textStatus.textContent =
    activeText.type === "emoji"
      ? "Emoji layer selected. Switch to Transform mode to move it."
      : "Text layer selected. Switch to Transform mode to move it.";
}

applyTileTextFillButton?.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Analyze the image before filling tiles.";
    return;
  }

  applyTileContentFill("text");
});

applyTileEmojiFillButton?.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Analyze the image before filling tiles.";
    return;
  }

  applyTileContentFill("emoji");
});
