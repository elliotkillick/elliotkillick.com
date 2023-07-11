// Copyright (C) 2022 Elliot Killick <contact@elliotkillick.com>
// Licensed under the MIT License. See LICENSE file for details.

const matrixEffectCanvas = document.getElementById("matrix-effect");
const ctx = matrixEffectCanvas.getContext("2d");

// Configuration variables
const chars = ['0', '1'];
const fontSizePx = 10;
const font = "Arial";
const textColor = "#0f0" // Hacker green text
const startYPos = -5;
const resetYPosChance = 0.125;
const fallingYPosIncrement = 0.5;
const drawIntervalMs = 100;

// An array of falling characters - one per column
// Use large value for max columns to generate (if your screen happens to be big enough for that)
// This will have a negligible performance effect as only what can fit in the window will be rendered
// This is the fastest way to initialize an array with one value in JS
const fallingCharsSize = 1000;
const fallingChars = new Array(fallingCharsSize);
// For each falling character (x-axis)
for (let x = 0; x < fallingCharsSize; ++x)
    // Initialize Y coordinate of falling character
    fallingChars[x] = startYPos;

// Cache this constant value because retrieving it requires a "style computation" which is costly (as shown in Firefox Profiler)
// It turns out window.scrollY causes a "style computation" anyway but it looks to be a faster computation so we will keep this optimization
const matrixEffectCanvasOffsetTopCache = matrixEffectCanvas.offsetTop;

let lastTime = performance.now() - drawIntervalMs;

// Main drawing loop
function draw(time) {
    // Draw every interval only when the page isn't scrolled too far down (where a user wouldn't be able to see the animation anyway)
    if (time - lastTime >= drawIntervalMs &&
        matrixEffectCanvasOffsetTopCache >= window.scrollY + matrixEffectCanvasOffsetTopCache - 300) {
        // Dynamically adjust canvas size to window size
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        // Style text
        ctx.fillStyle = textColor;
        ctx.font = fontSizePx + "px" + font;

        // For each falling character (x-axis)
        for (let x = 0; x < fallingChars.length; ++x) {
            // Get random character from chars array
            const randomChar = chars[Math.floor(Math.random() * chars.length)];

            // Create desired effect of there not being any solid character rows at the start instead having them dispersed
            if (fallingChars[x] >= 0)
                // Print random char at desired position
                // Any canvas drawing function (this one included, even doing one call then returning immediately until the next interval) seems somewhat performance heavy (at least without GPU-accelerated graphics)
                // Consider switching this for a non-WebGL solution in the future (perhaps creating an HTML background text box that covers the whole page then using some JS to randomly place the falling chars in line-sized batches and resetting the text to the top of the text box as needed)
                // A pure CSS solution would be cool although we would still almost certainly need JS to get random numbers
                // Update: I enabled the #ignore-gpu-blocklist flag on Chromium and performance increased ~7x (checking in the Chromium Task Manager, SHIFT+ESC)! This is on my Qubes system too with no dedicated GPU connected to this VM too which is good.
                ctx.fillText(randomChar, x * fontSizePx, fallingChars[x] * fontSizePx);

            // Reset a falling character back to the top a random percent of the time
            // Randomly resetting the Y position scatters falling characters across the x-axis
            // It's techically possible (however unlikely) for a falling character to never reset
            if (resetYPosChance > Math.random())
                fallingChars[x] = startYPos;

            // Increment falling character Y position down the page
            fallingChars[x] += fallingYPosIncrement;
        }

        lastTime = time;
    }

    window.requestAnimationFrame(draw);
}

// requestAnimationFrame is optimized to sync with ongoing screen draws (faster and no tearing)
// It also automatically stops running when the page isn't visible (e.g. after switching tabs)
// All around noticably smoother and more performant than setInterval
window.requestAnimationFrame(draw);

console.log("Matrix animation is well optimized to be lightweight, stop in the background, and stop shortly after scrolling down.");
