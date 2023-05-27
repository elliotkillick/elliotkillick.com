// This method of evading email scrapers employs a sleep technique before displaying the email address
// It's similar to how some malware evades antivirus by sleeping for long enough until they're placed outside of the sandbox and then running its malicious payload
// The hope here is that the email scrapers don't wait on our website longer than 3 seconds after the page load event (load script with "defer" attribute) before scraping

showEmailDelay();

async function showEmailDelay() {
    await new Promise(r => setTimeout(r, 3000));
    emailFields = document.getElementsByClassName('top-secret')
    emailFields[0].innerHTML = '<span class="secret">cont&#97;ct<span>void</span>@ell<AT>iot<i class="no-i">k</i>i<i class="no-i">ll</i>i<DOT>c<!-- foo at doesnotexist dot com-->k<span>void</span><COM>&#46;<span>void</span>c&#111;m</span>'
}
