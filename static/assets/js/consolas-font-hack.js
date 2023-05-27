// Hack for working around this bug (Windows only, due to Consolas font): https://stackoverflow.com/questions/10450091/consolas-smaller-than-verdana
// Until font-size-adjust() is widely support we're stuck with it: https://caniuse.com/font-size-adjust
// Another option to work around this is to use a custom font but I would rather use a tiny snippet of JS (custom fonts are more readily disabled for security than disabling JS)

// If Consolas font is in use
// Note that due to this bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1252821
// Some browsers like Firefox and Safari always return true for any font check to prevent fingerprinting
// To workaround this, we also detect the OS (I've tested that this check also works in Tor Browser)
if (document.fonts.check("0px Consolas") && navigator.platform == "Win32") {
    // Increase font from 16px to 17px
    document.querySelector(".logo__text").style.fontSize = "17px"
}
