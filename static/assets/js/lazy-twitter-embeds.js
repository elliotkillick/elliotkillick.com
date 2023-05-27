function lazyLoad() {
    const scriptTag = document.createElement('script');
    scriptTag.async = true;
    scriptTag.src = "https://platform.twitter.com/widgets.js";
    const head = document.querySelector("head");
    head.appendChild(scriptTag);
}

let observer = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
        if (lazyTweet) {
            observer.unobserve(lazyTweet);
	}
        if (lazyTimeline) {
            observer.unobserve(lazyTimeline);
        }

        console.log("Lazy loading Twitter embed(s) now!");
        lazyLoad();
    }
});

const lazyTweet = document.querySelector(".twitter-tweet");
const lazyTimeline = document.querySelector(".twitter-timeline");
if (lazyTweet) {
    observer.observe(lazyTweet);
}
if (lazyTimeline) {
    observer.observe(lazyTimeline);
}
