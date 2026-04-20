const imageInput = document.getElementById("image-input");
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
const clearSelectionButton = document.getElementById("clear-selection-button");
const analyzeButton = document.getElementById("analyze-button");
const exportSvgButton = document.getElementById("export-svg-button");
const datamoshDirectionInput = document.getElementById("datamosh-direction");
const datamoshAmountInput = document.getElementById("datamosh-amount");
const applyDatamoshButton = document.getElementById("apply-datamosh-button");
const paletteList = document.getElementById("palette-list");
const paletteSummary = document.getElementById("palette-summary");
const mosaicSummary = document.getElementById("mosaic-summary");
const replacementColorInput = document.getElementById("replacement-color");
const applyReplaceButton = document.getElementById("apply-replace-button");
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
const canvasFrame = document.querySelector(".canvas-frame");
const previewStage = document.getElementById("preview-stage");
const previewCanvas = document.getElementById("preview-canvas");
const emptyState = document.getElementById("empty-state");
const hoverInfo = document.getElementById("hover-info");
const imageSizeInfo = document.getElementById("image-size-info");
const appTitle = document.getElementById("app-title");

const previewContext = previewCanvas.getContext("2d");
const DEFAULT_MOSAIC_COLUMNS = 48;
const DEFAULT_MOSAIC_ROWS = 48;
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
  dragSelection: null,
  mosaicShape: "square",
  mosaicInputMode: "count",
  mosaicGapX: 0,
  mosaicGapY: 0,
  mosaicBlur: 0,
  showSelectionPreview: false,
  previewBackgroundMode: "transparent",
  previewBackgroundColor: "#ff6b35",
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

appTitle.textContent = window.desktopApp.appName;
thresholdValue.textContent = thresholdInput.value;
mosaicBlurValue.textContent = mosaicBlurInput.value;
state.mosaicShape = mosaicShapeInput.value;
state.mosaicGapX = Number(mosaicGapXInput.value);
state.mosaicGapY = Number(mosaicGapYInput.value);
state.mosaicBlur = Number(mosaicBlurInput.value);
zoomValue.textContent = formatZoom(DEFAULT_ZOOM);
updateSelectionPreviewToggleUI();
updateSelectionUi();
imageSizeInfo.textContent = "Görsel yok";
applyPreviewBackground();

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
  state.activeColorIndex = -1;
  state.hoveredTileIndex = -1;
  state.mosaicShape = mosaicShapeInput.value;
  state.mosaicGapX = clampNumber(Number(mosaicGapXInput.value), 0);
  state.mosaicGapY = clampNumber(Number(mosaicGapYInput.value), 0);
  state.mosaicBlur = clampNumber(Number(mosaicBlurInput.value), 0);
  clearExplicitSelection({ skipRender: true, keepPreviewState: false });
  state.showSelectionPreview = false;
  updateSelectionPreviewToggleUI();
  paletteList.innerHTML = "";
  imageSizeInfo.textContent = `${state.image.width} x ${state.image.height} px`;
  paletteSummary.textContent = "Analiz için butona bas.";
  mosaicSummary.textContent = "Mozaik hazır değil";
  hoverInfo.textContent = "Bir renk seçtiğinde, threshold içindeki mozaikleri istersen önizlemede vurgulayabilirsin.";
  prepareCanvas();
  drawLoadedImage();
  updateSelectionUi();
});

analyzeButton.addEventListener("click", () => {
  if (!state.workingImageData) {
    paletteSummary.textContent = "Önce bir görsel seçmen gerekiyor.";
    return;
  }

  analyzeImage();
});

exportSvgButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "SVG export için önce mozaik oluşturman gerekiyor.";
    return;
  }

  exportSvg();
});

applyReplaceButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Değiştirme için önce bir görsel analiz et.";
    return;
  }

  applyReplacement();
});

applyDatamoshButton.addEventListener("click", () => {
  if (!state.mosaicTiles.length) {
    paletteSummary.textContent = "Datamosh için önce bir görsel analiz et.";
    return;
  }

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
    `${rgbToHex(referenceColor.r, referenceColor.g, referenceColor.b)} tonuna yakın mozaikler seçildi.`;
});

clearSelectionButton.addEventListener("click", () => {
  pushSelectionHistory();
  clearExplicitSelection();
  paletteSummary.textContent = "Mozaik seçimi temizlendi.";
});

resetButton.addEventListener("click", () => {
  if (!state.originalImageData) {
    return;
  }

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
    mosaicSummary.textContent = `${DEFAULT_MOSAIC_COLUMNS} x ${DEFAULT_MOSAIC_ROWS} mozaik`;
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
  fitCanvasToFrame();
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
    summaryMessage: "Önizleme temizlendi. Seçim konturları gizlendi."
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
  if (!state.mosaicTiles.length || state.dragSelection?.active) {
    return;
  }

  const point = getCanvasPointFromEvent(event);
  const nextHoveredTileIndex = getTileIndexFromPoint(point.x, point.y);

  if (nextHoveredTileIndex === state.hoveredTileIndex) {
    return;
  }

  state.hoveredTileIndex = nextHoveredTileIndex;
  requestPreviewRender();
});

previewCanvas.addEventListener("mousedown", (event) => {
  if (event.button !== 0 || !state.mosaicTiles.length) {
    return;
  }

  beginCanvasSelectionDrag(event);
});

window.addEventListener("mousemove", (event) => {
  if (!state.dragSelection?.active) {
    return;
  }

  updateCanvasSelectionDrag(event);
});

window.addEventListener("mouseup", (event) => {
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
  if (state.dragSelection?.active || state.hoveredTileIndex === -1) {
    return;
  }

  state.hoveredTileIndex = -1;
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

function pushSelectionHistory() {
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

function undoSelectionChange() {
  if (!state.selectionUndoStack.length) {
    return false;
  }

  const snapshot = state.selectionUndoStack.pop();
  restoreSelectionSnapshot(snapshot);
  paletteSummary.textContent = "Seçim geri alındı.";
  return true;
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

function prepareCanvas() {
  previewCanvas.width = state.image.width;
  previewCanvas.height = state.image.height;
  previewCanvas.style.display = "block";
  emptyState.style.display = "none";
  state.renderCache.canvas.width = state.image.width;
  state.renderCache.canvas.height = state.image.height;
  invalidateRenderCache();
  window.requestAnimationFrame(() => {
    fitCanvasToFrame();
  });
}

function drawLoadedImage() {
  previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewContext.drawImage(state.image, 0, 0);
  state.originalImageData = previewContext.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
  state.workingImageData = cloneImageData(state.originalImageData);
  previewContext.putImageData(state.workingImageData, 0, 0);
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
    `${settings.columns} x ${settings.rows} mozaik | ${settings.tileWidth} x ${settings.tileHeight}px | ` +
    `${state.mosaicShape === "round" ? "yuvarlak" : "kare"} | yatay boşluk ${state.mosaicGapX}px | dikey boşluk ${state.mosaicGapY}px | blur ${state.mosaicBlur}px`;
  if (false) {
    renderPalette();
    paletteSummary.textContent = "Shift ile alanın benzerleri seçime eklendi.";
    return;
  }

  renderPalette();
  updateSelectionUi();
  invalidateRenderCache();
  requestPreviewRender();
}

function setZoom(nextZoom) {
  state.zoom = clampNumber(nextZoom, MIN_ZOOM, MAX_ZOOM);
  applyZoom();
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
}

function applyPreviewBackground() {
  canvasFrame.dataset.bgMode = state.previewBackgroundMode;
  canvasFrame.style.setProperty("--custom-preview-bg", state.previewBackgroundColor);
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
  previewCanvas.style.width = `${previewCanvas.width * state.zoom}px`;
  previewCanvas.style.height = `${previewCanvas.height * state.zoom}px`;
  previewStage.style.width = `${previewCanvas.width * state.zoom}px`;
  previewStage.style.height = `${previewCanvas.height * state.zoom}px`;
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
  const previousFitZoom = state.fitZoom;
  const nextFitZoom = getFitZoom();

  state.fitZoom = nextFitZoom;

  if (!preserveManualZoom || Math.abs(state.zoom - previousFitZoom) < 0.02) {
    state.zoom = nextFitZoom;
  }

  applyZoom();
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
        hsl: rgbToHsl(color.r, color.g, color.b)
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
    paletteSummary.textContent = "Yeterli renk çeşidi bulunamadı.";
    return;
  }

  paletteSummary.textContent =
    `${state.palette.length} farklı ve renk çemberine daha dengeli dağılan ton seçildi.`;

  state.palette.forEach((color, index) => {
    const item = document.createElement("div");
    item.className = `palette-item${state.activeColorIndex === index ? " active" : ""}`;
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `${color.hex} rengini seç`);

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
        ? "Elle seçildi"
        : `${formatCount(color.count)} mozaik parçası`;

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
  selectSimilarButton.classList.toggle("is-hidden", selectedCount === 0);
  selectSimilarButton.textContent = state.selectionMode === "similar" ? "Benzerlerini Yenile" : "Benzerlerini Sec";

  if (!state.mosaicTiles.length) {
    selectionStatus.textContent =
      "Henüz mozaik seçimi yok. Tek tıkla bir parça seç, Shift ile çoklu seç veya sürükleyerek alan tara.";
    return;
  }

  if (!selectedCount) {
    selectionStatus.textContent =
      "Tek tık tekli seçim yapar. Shift ile mozaikleri ekleyip çıkartabilirsin. Sürükleme, alanın baskın tonuna benzeyen tüm mozaikleri bulur.";
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
      `${formatCount(selectedCount)} mozaik ${referenceHex} referansıyla seçili. Hassaslık çubuğunu oynattığında seçim buna göre yenilenir.`;
    return;
  }

  if (selectedCount === 1 && referenceHex) {
    selectionStatus.textContent =
      `${referenceHex} seçili. Yakınlık çubuğuyla benzer mozaikleri kapsayabilirsin.`;
    return;
  }

  selectionStatus.textContent =
    `${formatCount(selectedCount)} mozaik elle seçili. İstersen şimdi "Benzerlerini Seç" ile bu seçimin baskın tonuna yakın tüm mozaikleri işaretleyebilirsin.`;
}

function drawPreview() {
  if (!state.mosaicTiles.length) {
    if (state.workingImageData) {
      previewContext.putImageData(state.workingImageData, 0, 0);
    }
    return;
  }

  ensureCachedPreview();
  previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewContext.drawImage(state.renderCache.canvas, 0, 0);

  if (state.selectedTileIndices.size) {
    drawSelectedTileOverlays();
  }

  if (state.hoveredTileIndex >= 0) {
    drawHoveredTileOverlay();
  }

  if (state.dragSelection?.active && state.dragSelection.moved) {
    drawDragSelectionOverlay();
  }

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
  cacheCanvas.width = previewCanvas.width;
  cacheCanvas.height = previewCanvas.height;
  const cacheContext = cacheCanvas.getContext("2d");
  const shouldShowSelectionPreview = state.showSelectionPreview && previewSelectionSet.size > 0;

  cacheContext.clearRect(0, 0, cacheCanvas.width, cacheCanvas.height);
  cacheContext.save();
  cacheContext.filter = state.mosaicBlur > 0 ? `blur(${state.mosaicBlur}px)` : "none";

  state.mosaicTiles.forEach((tile, index) => {
    const isSelected = previewSelectionSet.has(index);

    if (shouldShowSelectionPreview) {
      if (isSelected) {
        cacheContext.fillStyle = rgbToCss({
          r: blendChannel(tile.color.r, 255, 0.08),
          g: blendChannel(tile.color.g, 255, 0.08),
          b: blendChannel(tile.color.b, 255, 0.08)
        });
        fillTile(cacheContext, tile);
        cacheContext.fillStyle = "rgba(17, 17, 17, 0.14)";
        fillTile(cacheContext, tile);
      } else {
        const grayscale = Math.round(tile.color.r * 0.299 + tile.color.g * 0.587 + tile.color.b * 0.114);
        cacheContext.fillStyle = rgbToCss({
          r: blendChannel(tile.color.r, grayscale, 0.76),
          g: blendChannel(tile.color.g, grayscale, 0.76),
          b: blendChannel(tile.color.b, grayscale, 0.76)
        });
        fillTile(cacheContext, tile);
      }
    } else {
      cacheContext.fillStyle = rgbToCss(tile.color);
      fillTile(cacheContext, tile);
    }
  });

  cacheContext.restore();
  state.renderCache.signature = cacheSignature;
  state.renderCache.selectedTiles = previewSelectionSet.size;
}

function drawSelectedTileOverlays() {
  previewContext.save();
  previewContext.lineWidth = state.showSelectionPreview ? 1.8 : 2.2;
  previewContext.strokeStyle = "rgba(17, 17, 17, 0.96)";

  if (!state.showSelectionPreview) {
    previewContext.setLineDash([6, 4]);
  }

  state.selectedTileIndices.forEach((tileIndex) => {
    const tile = state.mosaicTiles[tileIndex];

    if (tile) {
      strokeTile(previewContext, tile);
    }
  });

  previewContext.restore();
}

function drawHoveredTileOverlay() {
  const hoveredTile = state.mosaicTiles[state.hoveredTileIndex];

  if (!hoveredTile) {
    return;
  }

  const previewSelectionSet = getPreviewSelectionSet();
  const matches = previewSelectionSet.has(state.hoveredTileIndex);

  previewContext.save();
  previewContext.lineWidth = 2;
  previewContext.strokeStyle = matches ? "rgba(17, 17, 17, 0.98)" : "rgba(120, 120, 120, 0.98)";
  strokeTile(previewContext, hoveredTile);
  previewContext.restore();
}

function drawDragSelectionOverlay() {
  const rect = getNormalizedRect(
    state.dragSelection.startX,
    state.dragSelection.startY,
    state.dragSelection.currentX,
    state.dragSelection.currentY
  );

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
  if (state.dragSelection?.active && state.dragSelection.moved) {
    const rect = getNormalizedRect(
      state.dragSelection.startX,
      state.dragSelection.startY,
      state.dragSelection.currentX,
      state.dragSelection.currentY
    );
    const areaTileCount = getTileIndicesInRect(rect).length;
    hoverInfo.textContent =
      `Alan taranıyor. Kutudaki ${formatCount(areaTileCount)} mozaiğin baskın tonu bulunup benzerleri seçilecek.`;
    return;
  }

  const explicitSelectionCount = state.selectedTileIndices.size;
  const paletteColor = state.palette[state.activeColorIndex];
  const previewSelectionSet = getPreviewSelectionSet();

  if (state.hoveredTileIndex >= 0) {
    const hoveredTile = state.mosaicTiles[state.hoveredTileIndex];
    const paintBounds = getPaintBounds(hoveredTile);
    const hoveredHex = rgbToHex(hoveredTile.color.r, hoveredTile.color.g, hoveredTile.color.b);
    const matches = previewSelectionSet.has(state.hoveredTileIndex);

    if (state.selectionReferenceColor) {
      const referenceDistance = getColorDistance(hoveredTile.color, state.selectionReferenceColor);
      hoverInfo.textContent =
        `${hoveredHex} mozaiği imleç altında. Boyut: ${Math.round(paintBounds.width)} x ${Math.round(paintBounds.height)}px. ` +
        `Referans uzaklığı: ${referenceDistance.toFixed(1)} / ${thresholdInput.value}. ` +
        `${matches ? "Seçim içinde." : "Seçim dışında."}`;
      return;
    }

    if (paletteColor) {
      const hoveredDistance = getColorDistance(hoveredTile.color, paletteColor);
      hoverInfo.textContent =
        `${paletteColor.hex} seçili. İmleç altı mozaik: ${hoveredHex}. ` +
        `Boyut: ${Math.round(paintBounds.width)} x ${Math.round(paintBounds.height)}px. ` +
        `Uzaklık: ${hoveredDistance.toFixed(1)} / ${thresholdInput.value}. ` +
        `${matches ? "Bu mozaik seçim içinde." : "Bu mozaik seçim dışında."}`;
      return;
    }

    hoverInfo.textContent =
      `${hoveredHex} mozaiği imleç altında. Tıkla seç, Shift ile ekle, sürükleyerek alanın baskın tonunu tara.`;
    return;
  }

  if (explicitSelectionCount) {
    const referenceHex = state.selectionReferenceColor
      ? rgbToHex(
          state.selectionReferenceColor.r,
          state.selectionReferenceColor.g,
          state.selectionReferenceColor.b
        )
      : "renk yok";
    hoverInfo.textContent =
      `${formatCount(explicitSelectionCount)} mozaik seçili. Referans ton: ${referenceHex}. ` +
      `Önizleme ${state.showSelectionPreview ? "açık" : "kapalı"}.`;
    return;
  }

  if (paletteColor) {
    hoverInfo.textContent =
      `${paletteColor.hex} seçili. Threshold içinde ${formatCount(state.renderCache.selectedTiles)} mozaik parçası bulundu. ` +
      `Önizleme ${state.showSelectionPreview ? "açık" : "kapalı"}.`;
    return;
  }

  hoverInfo.textContent =
    "Bir renk seçtiğinde, threshold içindeki mozaikleri istersen önizlemede vurgulayabilirsin.";
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
    paletteSummary.textContent = "Değiştirme için önce mozaik seç veya bir renk belirle.";
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

  state.workingImageData = rasterizeTiles(state.mosaicTiles, previewCanvas.width, previewCanvas.height);
  invalidateSelectionCaches();
  state.autoPalette = buildWheelPalette(state.mosaicTiles, clampNumber(Number(paletteCountInput.value), 3, 16));
  syncPalette(previousHex);
  state.hoveredTileIndex = -1;
  setSelectedTileIndices(targetIndices, {
    mode: "manual",
    referenceColor: replacementColor
  });
  focusColorInPalette(replacementColor, { rerender: false });

  renderPalette();
  invalidateRenderCache();
  requestPreviewRender();
  paletteSummary.textContent = `${formatCount(changedTiles)} mozaik parçası ${previousHex} rengine dönüştürüldü.`;
}

function applyDatamosh() {
  const sourceIndices = getActiveSelectionIndices();

  if (!sourceIndices.length) {
    paletteSummary.textContent = "Datamosh için önce mozaik seç veya bir renk belirle.";
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
    paletteSummary.textContent = "Datamosh için kaynak mozaik bulunamadı.";
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
    paletteSummary.textContent = "Datamosh uygulandı ama seçili yönde gidilecek mozaik kalmadı.";
    return;
  }

  const changedIndexList = Array.from(changedIndices);
  const dominantColor = getDominantColorFromTileIndices(changedIndexList, updatedTiles);

  state.mosaicTiles = updatedTiles;
  state.workingImageData = rasterizeTiles(state.mosaicTiles, previewCanvas.width, previewCanvas.height);
  invalidateSelectionCaches();
  state.autoPalette = buildWheelPalette(state.mosaicTiles, clampNumber(Number(paletteCountInput.value), 3, 16));
  syncPalette(dominantColor ? rgbToHex(dominantColor.r, dominantColor.g, dominantColor.b) : null);
  state.hoveredTileIndex = -1;

  if (dominantColor) {
    focusColorInPalette(dominantColor, { rerender: false });
  }

  renderPalette();
  refreshPreviewCanvas({
    summaryMessage:
      `${formatCount(changedIndices.size)} mozaik parçası ${directionLabel(direction)} yönünde ${amount} adım datamosh ile kopyalandı.`
  });
}

function rasterizeTiles(tiles, width, height) {
  const data = new Uint8ClampedArray(width * height * 4);

  tiles.forEach((tile) => {
    for (let y = tile.y; y < tile.y + tile.height; y += 1) {
      for (let x = tile.x; x < tile.x + tile.width; x += 1) {
        const index = (y * width + x) * 4;
        data[index] = tile.color.r;
        data[index + 1] = tile.color.g;
        data[index + 2] = tile.color.b;
        data[index + 3] = 255;
      }
    }
  });

  return new ImageData(data, width, height);
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
  const point = getCanvasPointFromEvent(event);
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
  const point = getCanvasPointFromEvent(event);

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
  const point = getCanvasPointFromEvent(event);
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
    paletteSummary.textContent = "Seçili mozaik kaldırıldı.";
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
      ? `${formatCount(nextSelected.size)} mozaik seçili. İstersen benzerlerini de yakalayabilirsin.`
      : `${rgbToHex(tile.color.r, tile.color.g, tile.color.b)} mozaiği seçildi.`;
}

function handleCanvasAreaSelection(rect, options = {}) {
  const areaTileIndices = getTileIndicesInRect(rect);
  const additive = Boolean(options.additive);
  const subtractive = Boolean(options.subtractive);
  pushSelectionHistory();

  if (!areaTileIndices.length) {
    paletteSummary.textContent = "Alan seçiminde mozaik bulunamadı.";
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
      paletteSummary.textContent = "Alt ile alan seçimden çıkarıldı.";
      return;
    }

    setSelectedTileIndices(Array.from(nextSelected), {
      mode: "manual",
      referenceColor: getDominantColorFromTileIndices(Array.from(nextSelected))
    });
    renderPalette();
    invalidateRenderCache();
    requestPreviewRender();
    paletteSummary.textContent = `Alt ile ${formatCount(areaTileIndices.length)} mozaik seçimden çıkarıldı.`;
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
    `Alanın baskın tonu ${rgbToHex(dominantColor.r, dominantColor.g, dominantColor.b)} bulundu ve benzer mozaikler seçildi.`;
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
    if (state.selectionReferenceColor && (state.selectionMode === "similar" || state.selectedTileIndices.size === 1)) {
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
    const row = clampNumber(Math.floor((y / previewCanvas.height) * state.mosaicSettings.rows), 0, state.mosaicSettings.rows - 1);
    const column = clampNumber(Math.floor((x / previewCanvas.width) * state.mosaicSettings.columns), 0, state.mosaicSettings.columns - 1);
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
  paletteSummary.textContent = "SVG çıktısı indirildi.";
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
    const bounds = getPaintBounds(tile);
    const attrs = state.mosaicBlur > 0 ? ` filter="url(#${blurId})"` : "";
    const fill = escapeSvg(rgbToCss(tile.color));

    if (state.mosaicShape === "round") {
      return `<ellipse cx="${escapeSvg(bounds.x + bounds.width / 2)}" cy="${escapeSvg(bounds.y + bounds.height / 2)}" rx="${escapeSvg(bounds.width / 2)}" ry="${escapeSvg(bounds.height / 2)}" fill="${fill}"${attrs} />`;
    }

    const seamlessAttrs = useSeamlessSquareExport
      ? ` shape-rendering="crispEdges" stroke="${fill}" stroke-width="1" paint-order="stroke fill"`
      : "";

    return `<rect x="${escapeSvg(bounds.x)}" y="${escapeSvg(bounds.y)}" width="${escapeSvg(bounds.width)}" height="${escapeSvg(bounds.height)}" rx="0" ry="0" fill="${fill}"${seamlessAttrs}${attrs} />`;
  }).join("");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${previewCanvas.width}" height="${previewCanvas.height}" viewBox="0 0 ${previewCanvas.width} ${previewCanvas.height}" fill="none">`,
    filterMarkup,
    backgroundMarkup,
    `<g shape-rendering="${useSeamlessSquareExport ? "crispEdges" : "geometricPrecision"}">`,
    shapes,
    `</g>`,
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

function fillTile(context, tile) {
  const bounds = getPaintBounds(tile);
  context.beginPath();
  addTilePath(context, bounds);
  context.fill();
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
      return "sola";
    case "down":
      return "aşağı";
    case "up":
      return "yukarı";
    default:
      return "sağa";
  }
}

function escapeSvg(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
