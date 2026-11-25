const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

const items = document.querySelectorAll('.ProductCard');
const track = document.querySelector('.carousel-track');

let currentindex = 0;
let isAnimating = false;


function getVisible() {
    const value = parseInt(getComputedStyle(track).getPropertyValue('--visible'), 10);
    return value || 3;
}


function buildClones() {
    track.querySelectorAll('.clone').forEach(el => el.remove());

    const original = Array.from(items);
    const visible = getVisible();
    const cloneCount = Math.min(visible, original.length);

    const tail = original.slice(-cloneCount);
    tail.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach(a => a.tabIndex = -1);
        track.insertBefore(clone, track.firstChild);
    });

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

function allCards() {
    return Array.from(track.querySelectorAll('.ProductCard'));
}

function positionAt(realIndex, animate = true) {
    const cards = allCards();
    const trackIndex = realIndex + cloneCount;

    const first = cards[0].getBoundingClientRect();
    const target = cards[trackIndex].getBoundingClientRect();
    const distance = target.left - first.left;

    if (!animate) track.style.transition = 'none';
    track.style.transform = `translateX(-${distance}px)`;
    if (!animate) {
        void track.offsetWidth;
        track.style.transition = '';
    }
}


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

    const onEnd = () => {
        track.removeEventListener('transitionend', onEnd);
        snapIfOnClone();
        isAnimating = false;
    };
    track.addEventListener('transitionend', onEnd, { once: true });
}

next.addEventListener('click', () => move(1));
prev.addEventListener('click', () => move(-1));

let lastVisible = getVisible();

function handleResize() {
    const visible = getVisible();
    if (visible !== lastVisible) {
        lastVisible = visible;
        cloneCount = buildClones();
        positionAt(currentindex, false);
    } else {
        positionAt(currentindex, false);
    }
}

window.addEventListener('resize', handleResize);

window.addEventListener('load', () => {
    cloneCount = buildClones();
    positionAt(currentindex, false);
});

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
