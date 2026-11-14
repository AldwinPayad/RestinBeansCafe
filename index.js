const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

const items = document.querySelectorAll('.ProductCard');
const selector = document.querySelector('.carousel-track');

let currentindex = 0;
const visible = 3;

function updateCarousel() {

    const firstItem = items[0].getBoundingClientRect();
    const currentItem = items[currentindex].getBoundingClientRect();

    const distance = currentItem.left - firstItem.left;

    selector.style.transform = `translateX(-${distance}px)`;

}


next.addEventListener('click', function (){

    const maxindex = items.length - visible;

    if (currentindex < maxindex) {
        currentindex++;
    } else { currentindex = 0;}

    updateCarousel();
})

prev.addEventListener('click', function (){

    const maxindex = items.length - visible;

    if (currentindex <= 0) {
        currentindex = maxindex;
    } else {
        currentindex--;
    }

    updateCarousel();
})


