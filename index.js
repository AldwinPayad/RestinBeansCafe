const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

const items = document.querySelectorAll('.ProductCard');
const selector = document.querySelector('.carousel-track');

let currentindex = 0;

// Get the number of currently visible cards from CSS
function getVisible() {
    const value = parseInt(
        getComputedStyle(selector).getPropertyValue('--visible'),
        10
    );

    return value || 1;
}

// Get the maximum starting index without leaving empty spaces
function getMaxIndex() {
    return Math.max(0, items.length - getVisible());
}

// Move the carousel
function updateCarousel() {
    if (!items.length) return;

    const firstItem = items[0].getBoundingClientRect();
    const currentItem = items[currentindex].getBoundingClientRect();

    const distance = currentItem.left - firstItem.left;

    selector.style.transform = `translateX(-${distance}px)`;
}

// Next button
next.addEventListener('click', function () {
    const maxindex = getMaxIndex();

    if (currentindex < maxindex) {
        currentindex++;
    } else {
        currentindex = 0;
    }

    updateCarousel();
});

// Previous button
prev.addEventListener('click', function () {
    const maxindex = getMaxIndex();

    if (currentindex > 0) {
        currentindex--;
    } else {
        currentindex = maxindex;
    }

    updateCarousel();
});

// Recalculate position when screen size changes
window.addEventListener('resize', function () {
    currentindex = Math.min(currentindex, getMaxIndex());

    requestAnimationFrame(updateCarousel);
});

// Initial positioning
window.addEventListener('load', updateCarousel);
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