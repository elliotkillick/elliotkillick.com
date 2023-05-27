// MY EDIT
// Move inline JavaScript from /templates/macros/menu.html to its own file for the CSP

var overlay = document.getElementById('overlay');
var toggle = document.getElementById('toggle');

toggle.addEventListener("click", openOverlay);

function openOverlay() {
    // Open overlay
    if (overlay.classList.contains("open")) {
        overlay.classList.remove("open");
    }
    else {
        overlay.classList.add("open");
    }

    // Button transition
    if (toggle.classList.contains("active")) {
        toggle.classList.remove("active");
    }
    else {
        toggle.classList.add("active");
    }
}
