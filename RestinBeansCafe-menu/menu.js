// 1. Find all 50 menu cards and the add-to-cart button
const menuCards = document.querySelectorAll(".card");
const cartButton = document.getElementById("cart-button");

// A Set keeps the positions of clicked cards without duplicates
const pickedItems = new Set();

// 2. Clicking a card toggles it on or off and updates the button count
menuCards.forEach(function (card, position) {
    card.addEventListener("click", function () {
        if (pickedItems.has(position)) {
            pickedItems.delete(position);
            card.classList.remove("picked");
        } else {
            pickedItems.add(position);
            card.classList.add("picked");
        }

        cartButton.textContent = "Add to Cart (" + pickedItems.size + ")";
    });
});

// 3. The button opens the order page with the chosen positions in the address
//    For example: order.html?items=0,5,12
cartButton.addEventListener("click", function () {
    if (pickedItems.size === 0) {
        alert("Please select at least one item first.");
        return;
    }

    const pickedList = Array.from(pickedItems)
        .sort(function (a, b) {
            return a - b;
        })
        .join(",");

    window.location.href =
        "RestinBeansCafe-menu-items/Espresso/order.html?items=" + pickedList;
});

//scroll up//
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
