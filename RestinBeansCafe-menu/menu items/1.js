const tabs = [...document.querySelectorAll(".tabs a")];
const sections = [...document.querySelectorAll(".menu_section")];
const tabBar = document.querySelector(".tabs");

// --- highlight the tab for the section currently in view ---
let lockUntil = 0;

function setActiveTab() {
    if (!sections.length || !tabBar) return;
    if (performance.now() < lockUntil) return;

    const line = tabBar.offsetHeight + 40;
    let current = sections[0];

    sections.forEach((sec) => {
        if (sec.getBoundingClientRect().top <= line) current = sec;
    });

    // at the very bottom of the page the last section should still light up,
    // even when it is too short to ever cross the line
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1];
    }

    tabs.forEach((t) => t.classList.toggle("active", t.getAttribute("href") === "#" + current.id));
}

// tapping a tab highlights it straight away, instead of flickering
// through every section on the way during the smooth scroll
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        lockUntil = performance.now() + 800;
        tabs.forEach((t) => t.classList.toggle("active", t === tab));
    });
});

// --- clicking a header (or footer) link scrolls to that section ---
// The SAMYUNG tab points at #samyang; "samyung" is accepted as an old alias.
const aliases = { samyung: "samyang" };

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const id = decodeURIComponent(link.getAttribute("href").slice(1));
        const target = document.getElementById(aliases[id] || id);

        // leave links to sections that don't exist alone
        if (!target || !target.classList.contains("menu_section")) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", "#" + target.id);

        // Some embedded/preview viewers freeze smooth-scroll animations, which
        // would leave the click doing nothing. If the page has not moved at all
        // shortly after, jump straight to the section instead.
        const from = window.scrollY;
        window.setTimeout(() => {
            if (Math.abs(window.scrollY - from) < 2) {
                target.scrollIntoView({ behavior: "instant", block: "start" });
            }
        }, 400);

        lockUntil = performance.now() + 800;
        tabs.forEach((t) => t.classList.toggle("active", t.getAttribute("href") === "#" + target.id));
    });
});

window.addEventListener("scroll", setActiveTab, { passive: true });
window.addEventListener("resize", setActiveTab);
window.addEventListener("load", setActiveTab);
setActiveTab();
