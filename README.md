<div align="center">
    <a href="https://github.com/elliotkillick/qvm-create-windows-qube">
        <img width="160" src="static/avatar-full-circle.png" alt="Logo" />
    </a>
</div>

<h3 align="center">
    elliotkillick.com
</h3>

<p align="center">
    <i>Elliot's Infosec Blog</i>
</p>

Styled with [Zhuia](https://www.getzola.org/themes/zhuia/) theme (plus customizations) by Giovanni Crisalfi, a clean and elegant theme for Zola.

Powered by [Zola](https://www.getzola.org), a minimal, fast and secure static site generator (SSG) written in Rust.

Currently being served statically over Cloudflare Pages on their global edge network (using [anycast](https://wikipedia.org/wiki/Anycast) routing). Support also [exists](serve) for serving with [Actix](https://actix.rs) (+Rustls instead of OpenSSL), a [blazingly fast](https://www.techempower.com/benchmarks/#section=data-r21), feature-rich and secure web framework written in Rust.

Requests to ping.elliotkillick.com are being served by a virtual private server (VPS) in Oracle Cloud.

Feel free to submit pull requests (PRs) to correct any errors/inaccuracies you find in the content or code.

## Security

elliotkillick.com is HTTPS secured with TLS 1.3. ping.elliotkillick.com (where I have more control over these parameters) additionally uses an ECC 256-bit certificate, HSTS (one year duration, preloaded), and a DNS CAA record. Check out it's [A+ SSL report](https://www.ssllabs.com/ssltest/analyze.html?d=ping.elliotkillick.com).

This domain is [DNSSEC enabled](https://dnssec-analyzer.verisignlabs.com/elliotkillick.com). Make sure your current DNS resolver (most likely your ISP by default) [validates DNSSEC signatures](https://dnscheck.tools). If not, consider changing the configured DNS server on your device/router to one that does.

elliotkillick.com also employs a fairly strong (assuming regular users cannot upload scripts to `cdn.syndication.twimg.com`) Content Security Policy (CSP) to help mitigate XSS attacks (although a static site has little attack surface for this anyway). This policy also includes upgrading HTTP requests to HTTPS to help prevent MITM attacks.

JavaScript is optional for everything but the the menu on mobile devices and the Twitter feed. Also, the title text hack effect, matrix effect, automatically updating copyright year, a small hack for fixing the default monospace font on Windows, and [anti-spam mechanism](static/assets/js/anti-spam.js) requires JS. All but two of the fancy animations/transitions and all of the code syntax highlighting is implemented entirely in HTML/CSS (with the latter being statically generated by the server ahead of time during Zola compilation).

SVGs or CSS is always used in place of font glyphs (with a TTF, OTF, or WOFF file) to create icons. This ensures browsers configured for high security such as Tor Browser on the "Safer"/"Safest" setting or iOS Safari on Lockdown mode have a good viewing experience. Custom fonts are disabled on these browsers due to the complex attack surface it exposes.

I also own the domain elliotonsecurity.com (and eos.md; markdown, for short), however, for now the canonical domain remains elliotkillick.com. Additionally, I own the domain ring0mo3de (obfuscated due to hosting what web AVs and search engines would classify as malicious programs, replace "3" for ".") which I simply use for testing and demo purposes ([Source code](serve/ring0mo3de/rustls/src/main.rs)).

[Plausible Analytics](https://plausible.io) is used for privacy friendly website analytics and you can find that hosted at ping.elliotkillick.com. This (non-Rust) service runs in a container to help ensure it stays isolated from the rest of the system.

The only non-Rust web component that can reasonably be ported to Rust is the Nginx reverse proxy at ping.elliotkillick.com (which is just some glue between other components). I've looked into into replacing this [with Actix](https://github.com/actix/examples/tree/master/http-proxy) (+Rustls) but have no plans to move on this; contibutions are welcome.

## Licensing

**HTML and CSS/SASS including (but not limited to) everything under the `templates`, `sass`, and `static/assets/stylesheets` directories has [all rights reserved](LICENSE-RESERVED). You cannot use these file types or the files within these directories in any way except to read and learn from them.**

The code (real code such as JavaScript, Rust, and Python; not markup/stylesheets) is fully open source under the [MIT License](LICENSE-MIT).

Content is licensed under [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/) by Elliot Killick.

Thank you to all the people whose work I used. This website is mostly just a mashup from many different sources with some of my own customizations and minor additions. The most difficult part was integrating it all and testing different designs to come up with something that was to my taste.

[Zhuia](https://github.com/gicrisf/zhuia) theme by Giovanni Crisalfi. This theme is based on the [Spectre.css](https://picturepan2.github.io/spectre/) CSS framework (both MIT licenses).

[Cantarell](https://wikipedia.org/wiki/Cantarell_(typeface)) font by Dave Crossland, [Montserrat](https://wikipedia.org/wiki/Montserrat_(typeface)) font by Julieta Ulanovsky, and [Fira Code](https://github.com/tonsky/FiraCode) (with ligatures) font by Nikita Prokopov (all under SIL Open Font License).

Hacker font is [Mad Hacker](https://www.dafont.com/mad-hacker.font) by Darrell Flood (donationware).

Text hack effect is from [Typographie Hack Effect](https://codepen.io/ivandaum/details/WRxRwv) by Ivan (MIT license).

Matrix effect is reimplemented from [Matrix Rain Animation](https://codepen.io/P3R0/details/MwgoKv) originally by unknown. It was difficult to identify the initial source for this work but this is one of the many places I found it. In any case, I fully reimplemented it on my own (only taking a few notes of how the original code worked) and I think it can now be called its own work (MIT license).

Blinking terminal cursor is from [Hello Friend](https://github.com/panr/hugo-theme-hello-friend) theme by Radek Kozieł (MIT license).

Accordion dropdown menu is from [Pure CSS Accordion 2.0](https://codepen.io/raubaca/details/PZzpVe) by Raúl Barrera (MIT license).

Share buttons from [Leonids Jekyll](https://github.com/renyuanz/leonids/tree/leonids-jekyll) theme by Renyuan Zou (MIT license).

Dark mode theme generated with [Dark Reader](https://darkreader.org) by Alexander Shutov (MIT license).

Icons from Bootstrap, css.gg, Font Awesome, and Tabler (all MIT licenses).

Integration and customization of these components plus other additions by Elliot Killick (all rights reserved / MIT license).

You are expressly forbidden from making copies of my personal website and putting it up on the Internet. You're free to take inspiration and learn from it but don't use my individualized work as a template/theme for your own website under any circumstance. Besides, you can be much more creative than that! Also, it's illegal under the all rights reserved licensing for HTML and CSS/SASS.

Similarly, please don't copy my content into your own paid infosec Udemy course or otherwise (as I heard this has happened). The sharealike ("SA") clause of the Creative Commons license I'm using would also make it illegal to do so.

By contributing to this repo, you hereby agree to forefit any exclusive copyright you have of your work to Elliot Killick under the licensing terms proposed here.

I plan to make a blog post on how to create your own stellar technical blog in the near future!

## Todo

- [x] Dark mode
    - There's already some progress on this upstream
    - I've [implemented](sass/theme/_dark-mode.scss) this feature using [DarkReader](https://github.com/darkreader/darkreader#using-dark-reader-for-a-website) (just source the script and call `DarkReader.exportGeneratedCSS()` in the browser)
        - There's currently no toggle button (and no plans to add one myself) so using it requires setting your browser/OS to dark theme
- [x] Automatic table of contents generation
    - It would be great to have this on the sidebar for larger displays and move it to the top of the post for smaller displays
    - I've [implemented](templates/macros/toc.html) this feature based on [Zola documentation](https://www.getzola.org/documentation/content/table-of-contents/) and an accordion dropdown menu I found online
    - Now also made it sticky on larger displays so it follows the reader
- [x] Make entire body of website wider so it takes up more screen real estate
    - Don't want to increase line length too much because that can decrease readability and slow down reading due to the extra eye movement
    - However, we also want images with text (like in a screenshot) to appear readable
    - We are currently at 95-105 characters per line which I think is alright for a technical blog
- [x] Make custom alert boxes
    - [Implemented](templates/shortcodes) as Zola [shortcodes](https://www.getzola.org/documentation/content/shortcodes/)
- [x] Do lots of customization work
    - E.g. custom 404 page, fonts, and effects
- [x] Set HTTP header to disable FLOC
- [x] Self-host Plausible Analytics
- [x] Fix a few small Lighthouse issues to score all 100s
    - Not all 100s but close enough
- [x] Setup custom domain email
    - Done with Zoho (data stored on their EU servers)
- [x] Lazy load Twitter embeds (timeline and tweets if any) for performance improvement
    - Twitter embeds are quite heavy weight executing lots of JS and making many requests
    - Particularly on lower end mobile devices I found that loading the Twitter timeline blocked the main thread for multiple seconds causing the website to become uninteractive during that time
    - I've [implemented](static/asssets/js/lazy-twitter-embeds.js) this using the IntersectionObserver API so that the Twitter script will only load once the timeline is in the viewport
        - The result is a large and noticeable performance improvement on initial website load times
- [x] Email newsletter for blog posts
    - I've implemented the email entry & submit form in the "Feeds" sidebar
    - Probably use [Mautic](https://github.com/mautic/mautic) (open source, self-hosted) w/ Amazon Simple Email Service (SES) for *very* cheap email delivery
    - Essentially doing RSS to email conversion
        - Mautic doesn't appear to fully support this [yet](https://github.com/ChrisRAoW/mautic-rss-to-email-bundle/issues/46) and it seems to provide a lot more functionality than I require
        - [rss2email](https://github.com/rss2email/rss2email) isn't exactly what I need, it's for end users who want their RSS subscription list compiled into an email
        - [Listmonk](https://listmonk.app) is very lightweight and basically perfect for my needs, I just need to create a [small script](https://github.com/knadh/listmonk/issues/19) for consuming the RSS and starting an email campaign
