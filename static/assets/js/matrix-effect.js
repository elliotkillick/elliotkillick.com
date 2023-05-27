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

// An array of falling characters - one per column
// Use large value for max columns to generate (if your screen happens to be big enough for that)
// Don't worry, this will have a negligible performance effect as only what can fit on the screen will be printed
// This is the fastest way to initialize an array with one value in JS
const fallingCharsSize = 1000;
const fallingChars = new Array(fallingCharsSize);
// For each falling character (x-axis)
for (let x = 0; x < fallingCharsSize; x++)
    // Initialize Y coordinate of falling character
    fallingChars[x] = startYPos;

// Main drawing loop
function draw() {
    // Dynamically adjust canvas size to window size
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.fillStyle = textColor;
    ctx.font = fontSizePx + "px" + font;

    // For each falling character (x-axis)
    for (let x = 0; x < fallingChars.length; x++) {
        // Get random character from chars array
        const randomChar = chars[Math.floor(Math.random() * chars.length)];

        // Create desired effect of there not being any solid rows at the start and having them all more dispersed
        if (fallingChars[x] >= 0)
            // Print random char at desired position
            // Any canvas drawing function (this one included, even doing one call then returning immediately until the next interval) seems pretty performance heavy (at least without GPU-accelerated graphics)
            // Consider switching this for a non-WebGL solution in the future (perhaps creating an HTML background text box that covers the whole page then using some JS to randomly place the falling chars in line-sized batches and resetting the text to the top of the text box as needed)
            // Update: I enabled the #ignore-gpu-blocklist flag on Chromium and performance increased ~7x (checking in the Chromium Task Manager, SHIFT+ESC)! This is on my Qubes system too with no dedicated GPU connected to this VM too which is good.
            ctx.fillText(randomChar, x * fontSizePx, fallingChars[x] * fontSizePx);

        // Reset a falling character back to the top to the top a random percent of the time
        // Randomness scatters the falling character across the Y axis
        // It's techically possible (however unlikely) for a falling character to make it to the bottom of the page
        if (resetYPosChance > Math.random())
            fallingChars[x] = startYPos;

        // Increment falling character Y position down the page
        fallingChars[x] += fallingYPosIncrement;
    }
}

setInterval(draw, 100);
