// CSS animations continue to run when they're out of the viewport
// They can be a bit heavy (as shown by Firefox Profiler "Paint" operations) so pause them when out of view
// Surely there's a better (JS free) way of doing this?

const cursorObserver = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting)
        entries[0].target.style.animationPlayState = 'running';
    else
        entries[0].target.style.animationPlayState = 'paused';
});

// Desktop and mobile cursors
const cursors = document.getElementsByClassName("logo__cursor");
for (cursor of cursors) {
    cursor.style.animationPlayState = 'paused';
    cursorObserver.observe(cursor);
}

console.log("Cursor blink animation is well optimized to be lightweight, stop in the background, and stop when out of view.");
