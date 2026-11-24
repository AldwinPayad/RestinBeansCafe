
const menuCards = document.querySelectorAll(".card");
const cartButton = document.getElementById("cart-button");
const pickedItems = new Set();

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
