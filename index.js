const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

const items = document.querySelectorAll('.ProductCard');
const selector = document.querySelector('.carousel-track');

let currentindex = 0;

// How many cards are visible right now.
// The number comes from the --visible CSS variable (3 on desktop, 2 on tablet, 1 on phone),
// so the CSS and the JS always agree.
function getVisible() {
    const value = parseInt(getComputedStyle(selector).getPropertyValue('--visible'), 10);
    return value || 3;
}

function updateCarousel() {

    const firstItem = items[0].getBoundingClientRect();
    const currentItem = items[currentindex].getBoundingClientRect();

    const distance = currentItem.left - firstItem.left;

    selector.style.transform = `translateX(-${distance}px)`;

}


next.addEventListener('click', function (){

    const maxindex = items.length - getVisible();

    if (currentindex < maxindex) {
        currentindex++;
    } else { currentindex = 0;}

    updateCarousel();
})

prev.addEventListener('click', function (){

    const maxindex = items.length - getVisible();

    if (currentindex <= 0) {
        currentindex = maxindex;
    } else {
        currentindex--;
    }

    updateCarousel();
})

// When the window size changes (rotating a phone, resizing the window),
// keep the carousel in a valid position and re-align it.
window.addEventListener('resize', function () {
    const maxindex = items.length - getVisible();
    if (currentindex > maxindex) {
        currentindex = maxindex;
    }
    updateCarousel();
})
