// Load all Twitter embeds once any one of them is viewed
function lazyLoad() {
    const scriptTag = document.createElement('script');
    scriptTag.async = true;
    scriptTag.src = "https://platform.twitter.com/widgets.js";
    const head = document.querySelector("head");
    head.appendChild(scriptTag);
}

const twitterEmbedObserver = new IntersectionObserver(function(entries) {
    if (!entries[0].isIntersecting) return;

    // Unobserve all Twitter embed elements once any one of them is viewed
    if (lazyTweet) twitterEmbedObserver.unobserve(lazyTweet);
    if (lazyTimeline) twitterEmbedObserver.unobserve(lazyTimeline);

    console.log("Lazy loading Twitter embed(s) now!");
    lazyLoad();
});

// Observe first of each kind of Twitter embed
const lazyTweet = document.querySelector(".twitter-tweet");
const lazyTimeline = document.querySelector(".twitter-timeline");
if (lazyTweet) twitterEmbedObserver.observe(lazyTweet);
if (lazyTimeline) twitterEmbedObserver.observe(lazyTimeline);
