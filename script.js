const WIDTH = 500;
const HEIGHT = 500;
const DEFAULT_COLOR = "#333333";
const DEFAULT_RESOLUTION = 16;

let color = DEFAULT_COLOR;
let resolution = DEFAULT_RESOLUTION;

let colorMode = true;
let eraserMode = false;

const setColor = (value) => (color = value);
const setResolution = (value) => (resolution = value);

const canvas = document.querySelector("#canvas");
const clearButton = document.querySelector("#clear");
const colorModeButton = document.querySelector("#color-mode");
const eraserModeButton = document.querySelector("#eraser-mode");
const colorPicker = document.querySelector("#color");
const resolutionSlider = document.querySelector("#resolution");
const resolutionLabel = document.querySelector("#resolution-label");

function updateResolutionLabel(value) {
    resolutionLabel.innerHTML = `${value}x${value}`;
}

function updateResolutionSliderAccentColor(value) {
    resolutionSlider.style.accentColor = value;
}

function calculatePixelSize() {
    return WIDTH / resolution;
}

function createPixel(size) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    Object.assign(pixel.style, {
        width: `${size}px`,
        height: `${size}px`,
        border: `1px solid ${DEFAULT_COLOR}`,
    });

    return pixel;
}

const applyColor = (e) => {
    const elementOnCursor = document.elementFromPoint(e.clientX, e.clientY);
    if (elementOnCursor?.classList.contains("pixel")) {
        if (colorMode) {
            elementOnCursor.classList.add("colored");
            elementOnCursor.style.backgroundColor = color;
        } else if (eraserMode) {
            clearPixel(elementOnCursor);
        }
    }
};

function clearPixel(pixel) {
    pixel.classList.remove("colored");
}

function setupCanvas(size) {
    const pixelSize = calculatePixelSize();
    let mouseDown = false;
    // Rows
    for (let i = 0; i < size; i++) {
        // Columns
        for (let j = 0; j < size; j++) {
            canvas.appendChild(createPixel(pixelSize));
        }
    }

    canvas.addEventListener("mousedown", (e) => {
        if (e.button === 0) mouseDown = true;
        applyColor(e);
    });

    canvas.addEventListener("mouseup", (e) => {
        if (e.button === 0) mouseDown = false;
    });

    canvas.addEventListener("mouseover", (e) => {
        if (mouseDown) applyColor(e);
    });
}

function clearCanvas() {
    canvas.querySelectorAll(".colored").forEach((pixel) => {
        clearPixel(pixel);
    });
}

function setupInstruments() {
    setColor(colorPicker.value);
    setResolution(resolutionSlider.value);
    updateResolutionLabel(resolutionSlider.value);
    updateResolutionSliderAccentColor(colorPicker.value);

    colorPicker.oninput = (e) => {
        setColor(e.target.value);
        updateResolutionSliderAccentColor(e.target.value);
    };

    colorModeButton.onclick = () => {
        colorMode = true;
        eraserMode = false;
    };

    eraserModeButton.onclick = () => {
        eraserMode = true;
        colorMode = false;
    };

    clearButton.onclick = () => clearCanvas();
    resolutionSlider.onchange = (e) => {
        setResolution(e.target.value);
        canvas.replaceChildren();
        setupCanvas(resolution);
    };
    resolutionSlider.onmousemove = (e) => updateResolutionLabel(e.target.value);
}

window.onload = () => {
    setupInstruments();
    setupCanvas(resolution);
};
