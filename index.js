const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

const items = document.querySelectorAll('.ProductCard');
const track = document.querySelector('.carousel-track');

let currentindex = 0;
let isAnimating = false;

// How many cards are visible right now (3 / 2 / 1).
// The number comes from the --visible CSS variable so CSS and JS always agree.
function getVisible() {
    const value = parseInt(getComputedStyle(track).getPropertyValue('--visible'), 10);
    return value || 3;
}

// Clone the cards and place them before/after the originals so the track
// can slide past the edges without showing empty space.
// Clones at the start -> prepended (for going backwards)
// Clones at the end   -> appended   (for going forwards)
function buildClones() {
    // Remove any previous clones (e.g. on resize / re-init)
    track.querySelectorAll('.clone').forEach(el => el.remove());

    const original = Array.from(items);
    const visible = getVisible();
    // Clone enough to cover one full "page" on each side.
    const cloneCount = Math.min(visible, original.length);

    // Prepended clones (end of list copied to the front)
    const tail = original.slice(-cloneCount);
    tail.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach(a => a.tabIndex = -1);
        track.insertBefore(clone, track.firstChild);
    });

    // Appended clones (start of list copied to the back)
    const head = original.slice(0, cloneCount);
    head.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach(a => a.tabIndex = -1);
        track.appendChild(clone);
    });

    return cloneCount;
}

let cloneCount = 0;

// All cards currently in the track (originals + clones), in DOM order.
function allCards() {
    return Array.from(track.querySelectorAll('.ProductCard'));
}

// Position the track so that the card at "real index" i is the first visible one.
function positionAt(realIndex, animate = true) {
    const cards = allCards();
    // Real items start at index cloneCount in the track.
    const trackIndex = realIndex + cloneCount;

    const first = cards[0].getBoundingClientRect();
    const target = cards[trackIndex].getBoundingClientRect();
    const distance = target.left - first.left;

    if (!animate) track.style.transition = 'none';
    track.style.transform = `translateX(-${distance}px)`;
    if (!animate) {
        // Force reflow so the transition property takes effect again next time.
        void track.offsetWidth;
        track.style.transition = '';
    }
}

// Snap the track back to the equivalent "real" position without animation,
// used after we've slid onto a clone.
function snapIfOnClone() {
    const total = items.length;
    if (currentindex < 0) {
        currentindex = total - 1;
        positionAt(currentindex, false);
    } else if (currentindex >= total) {
        currentindex = 0;
        positionAt(currentindex, false);
    }
}

function move(step) {
    if (isAnimating) return;
    isAnimating = true;

    currentindex += step;
    positionAt(currentindex, true);

    // Wait for the slide transition to finish, then snap off the clone.
    const onEnd = () => {
        track.removeEventListener('transitionend', onEnd);
        snapIfOnClone();
        isAnimating = false;
    };
    track.addEventListener('transitionend', onEnd, { once: true });
}

next.addEventListener('click', () => move(1));
prev.addEventListener('click', () => move(-1));

// Rebuild clones when the number of visible cards changes (breakpoint change).
let lastVisible = getVisible();

function handleResize() {
    const visible = getVisible();
    if (visible !== lastVisible) {
        lastVisible = visible;
        cloneCount = buildClones();
        positionAt(currentindex, false);
    } else {
        // Same breakpoint: just re-align (fonts/images may have shifted layout).
        positionAt(currentindex, false);
    }
}

window.addEventListener('resize', handleResize);

window.addEventListener('load', () => {
    cloneCount = buildClones();
    positionAt(currentindex, false);
});
// scroll to top

const scrollBtn = document.getElementById("scrollBtn");

window.onscroll = function() {
  if (document.body.scrollTop > 2500 || document.documentElement.scrollTop > 2500) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
};

scrollBtn.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
  });
})
