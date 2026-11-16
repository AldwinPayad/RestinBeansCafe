
// ============================================================
// PRODUCT CAROUSEL NAVIGATION FUNCTIONALITY
// ============================================================

// Step 1: Retrieve the navigation buttons from the DOM.
// These buttons will be responsible for controlling the carousel.
const nextButton = document.querySelector('.next');
const previousButton = document.querySelector('.prev');

// Step 2: Select all product card elements currently available.
// Each product card represents an individual item in the carousel.
const productItems = document.querySelectorAll('.ProductCard');

// Step 3: Retrieve the main carousel track.
// This element will be dynamically translated to create
// the sliding animation effect when navigating between products.
const carouselTrack = document.querySelector('.carousel-track');

// ============================================================
// CAROUSEL CONFIGURATION VARIABLES
// ============================================================

// Stores the current index of the first visible product card.
// The initial value is set to zero because the carousel
// should display the first set of products by default.
let currentIndex = 0;

// Defines the maximum number of product cards that should
// be visible within the carousel container at one time.
const visibleItems = 3;

// ============================================================
// FUNCTION: UPDATE CAROUSEL DISPLAY
// ============================================================

function updateCarousel() {

    // Retrieve the positional information of the first product.
    // This will serve as our reference point when calculating
    // how far the carousel track needs to move.
    const firstProductPosition = productItems[0].getBoundingClientRect();

    // Retrieve the positional information of the currently
    // selected product based on the current index value.
    const currentProductPosition = productItems[currentIndex].getBoundingClientRect();

    // Calculate the horizontal distance between the first product
    // and the currently selected product.
    //
    // This approach allows us to dynamically calculate the
    // required translation instead of manually specifying
    // a fixed pixel value.
    const horizontalDistance =
        currentProductPosition.left - firstProductPosition.left;

    // Apply the calculated horizontal translation to the
    // carousel track using the CSS transform property.
    //
    // The negative value ensures that the carousel moves
    // towards the left when navigating to the next product.
    carouselTrack.style.transform = `translateX(-${horizontalDistance}px)`;

}

// ============================================================
// EVENT LISTENER: NEXT BUTTON FUNCTIONALITY
// ============================================================

// Add a click event listener to the next navigation button.
// This allows users to move forward through the available
// product cards whenever the button is clicked.
nextButton.addEventListener('click', function () {

    // Calculate the maximum possible starting index.
    // This prevents the carousel from displaying fewer than
    // the intended number of visible product cards.
    const maximumIndex = productItems.length - visibleItems;

    // Check whether the current index is still within
    // the allowed navigation range.
    if (currentIndex < maximumIndex) {

        // Increment the current index by one.
        // This moves the carousel forward by a single product.
        currentIndex++;

    } else {

        // If the carousel has reached its final position,
        // reset the index back to zero.
        //
        // This creates a looping navigation experience,
        // allowing users to return to the beginning.
        currentIndex = 0;

    }

    // Refresh the carousel position after updating the index.
    // This ensures that the visual display stays synchronized
    // with the current navigation state.
    updateCarousel();

});

// ============================================================
// EVENT LISTENER: PREVIOUS BUTTON FUNCTIONALITY
// ============================================================

// Add a click event listener to the previous navigation button.
// This allows users to navigate backwards through the products.
previousButton.addEventListener('click', function () {

    // Recalculate the maximum starting index.
    // This value determines the last valid carousel position.
    const maximumIndex = productItems.length - visibleItems;

    // Determine whether the carousel is currently positioned
    // at the beginning of the product collection.
    if (currentIndex <= 0) {

        // If the beginning has been reached, move directly
        // to the last available carousel position.
        //
        // This provides a continuous looping experience
        // when navigating backwards.
        currentIndex = maximumIndex;

    } else {

        // Otherwise, decrease the current index by one
        // to navigate to the previous product card.
        currentIndex--;

    }

    // Update the carousel track to reflect the new index.
    // This applies the appropriate horizontal translation
    // based on the currently selected product.
    updateCarousel();

});

