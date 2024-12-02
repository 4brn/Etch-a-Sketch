const canvas = document.querySelector("#canvas");
const colorPicker = document.querySelector("#color-picker");
const colorModeButton = document.querySelector("#color");
const rainbowModeButton = document.querySelector("#rainbow");
const eraserModeButton = document.querySelector("#eraser");
const clearButton = document.querySelector("#clear");
const resolutionSlider = document.querySelector("#resolution");
const resolutionLabel = document.querySelector("#resolution-label");

// Config
const WIDTH = 500;
const HEIGHT = 500;

const DEFAULT_COLOR = "#333333";
const DEFAULT_RESOLUTION = 16;
const DEFAULT_MODE = "color";

let color = DEFAULT_COLOR;
let resolution = DEFAULT_RESOLUTION;
let mode = DEFAULT_COLOR;

const setColor = (value) => (color = value);
const setResolution = (value) => (resolution = value);

const randInt = (max) => Math.floor(Math.random() * max);

const updateResolution = (newResolution) => {
    setResolution(newResolution);
    resolutionSlider.style.accentColor = color;
    resolutionLabel.innerHTML = `${resolution}x${resolution}`;
};

const createPixel = (size) => {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    Object.assign(pixel.style, {
        width: `${size}px`,
        height: `${size}px`,
    });

    return pixel;
};

const clearPixel = (pixel) => {
    pixel.style.backgroundColor = "";
    pixel.classList.remove("colored");
};

function setupCanvas() {
    const pixelSize = WIDTH / resolution;
    let mouseDown = false;

    // Rendering the canvas
    // Rows
    for (let i = 0; i < resolution; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        // Columns
        for (let j = 0; j < resolution; j++) {
            row.appendChild(createPixel(pixelSize));
        }
        canvas.appendChild(row);
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

const clearCanvas = () =>
    canvas.querySelectorAll(".colored").forEach((pixel) => {
        clearPixel(pixel);
    });

const applyColor = (e) => {
    const pixel = e.target;
    if (!pixel.classList.contains("pixel")) return;

    switch (mode) {
        case "color":
            pixel.style.backgroundColor = color;
            pixel.classList.add("colored");
            break;
        case "rainbow":
            const r = randInt(256);
            const g = randInt(256);
            const b = randInt(256);
            pixel.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            pixel.classList.add("colored");
            break;
        case "eraser":
            clearPixel(pixel);
            break;
        default:
            console.error("Something's wrong");
    }
};

const updateActiveInstrument = (mode) => {
    switch (mode) {
        case "color":
            colorModeButton.classList.add("active");
            eraserModeButton.classList.remove("active");
            rainbowModeButton.classList.remove("active");
            break;
        case "eraser":
            colorModeButton.classList.remove("active");
            eraserModeButton.classList.add("active");
            rainbowModeButton.classList.remove("active");
            break;
        case "rainbow":
            colorModeButton.classList.remove("active");
            eraserModeButton.classList.remove("active");
            rainbowModeButton.classList.add("active");
            break;
    }
};

const setupInstruments = () => {
    setColor(colorPicker.value);
    updateResolution(resolutionSlider.value);

    colorPicker.oninput = (e) => {
        setColor(e.target.value);
        resolutionSlider.style.accentColor = e.target.value;
    };

    colorModeButton.onclick = () => {
        mode = "color";
        updateActiveInstrument(mode);
    };

    rainbowModeButton.onclick = () => {
        mode = "rainbow";
        updateActiveInstrument(mode);
    };

    eraserModeButton.onclick = () => {
        mode = "eraser";
        updateActiveInstrument(mode);
    };

    clearButton.onclick = () => {
        clearCanvas();
    };

    resolutionSlider.onchange = (e) => {
        updateResolution(e.target.value);
        canvas.replaceChildren();
        setupCanvas(resolution);
    };

    resolutionSlider.onmousemove = (e) => updateResolution(e.target.value);
};

window.onload = () => {
    setupInstruments();
    setupCanvas(resolution);
};
