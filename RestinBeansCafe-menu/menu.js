
const menuCards = document.querySelectorAll(".card");
const cartButton = document.getElementById("cart-button");

const pickedItems = new Map();

function updateCartButton() {
    let totalQuantity = 0;

    pickedItems.forEach(function (quantity) {
        totalQuantity += quantity;
    });

    cartButton.textContent = "Add to Cart (" + totalQuantity + ")";
}

function updateCard(card, position) {
    const photo = card.querySelector(".photo");
    const quantity = pickedItems.get(position);

    let controls = photo.querySelector(".quantity-controls");
    let badge = photo.querySelector(".quantity-badge");

    if (quantity === undefined) {
        card.classList.remove("picked");

        if (controls) controls.remove();
        if (badge) badge.remove();

        return;
    }

    card.classList.add("picked");

    if (!badge) {
        badge = document.createElement("span");
        badge.className = "quantity-badge";
        photo.appendChild(badge);
    }

    badge.textContent = quantity;

    if (!controls) {
        controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minusButton = document.createElement("button");
        minusButton.type = "button";
        minusButton.className = "quantity-button quantity-minus";
        minusButton.textContent = "−";

        const plusButton = document.createElement("button");
        plusButton.type = "button";
        plusButton.className = "quantity-button quantity-plus";
        plusButton.textContent = "+";

        minusButton.addEventListener("click", function (event) {
            event.stopPropagation();

            const currentQuantity = pickedItems.get(position);

            if (currentQuantity <= 1) {
                pickedItems.delete(position);
            } else {
                pickedItems.set(position, currentQuantity - 1);
            }

            updateCard(card, position);
            updateCartButton();
        });

        plusButton.addEventListener("click", function (event) {
            event.stopPropagation();

            pickedItems.set(position, pickedItems.get(position) + 1);

            updateCard(card, position);
            updateCartButton();
        });

        controls.appendChild(minusButton);
        controls.appendChild(plusButton);
        photo.appendChild(controls);
    }
}

menuCards.forEach(function (card, position) {
    card.addEventListener("click", function () {
        if (pickedItems.has(position)) {
            pickedItems.delete(position);
        } else {
            pickedItems.set(position, 1);
        }

        updateCard(card, position);
        updateCartButton();
    });
});

cartButton.addEventListener("click", function () {
    if (pickedItems.size === 0) {
        alert("Please select at least one item first.");
        return;
    }

    const pickedList = Array.from(pickedItems.entries())
        .sort(function (a, b) {
            return a[0] - b[0];
        })
        .map(function (item) {
            return item[0] + ":" + item[1];
        })
        .join(",");

    window.location.href =
        "RestinBeansCafe-menu-items/Espresso/order.html?items=" +
        encodeURIComponent(pickedList);
});

const scrollBtn = document.getElementById("scrollBtn");

if (scrollBtn) {
    window.addEventListener("scroll", function () {
        if (
            document.body.scrollTop > 2500 ||
            document.documentElement.scrollTop > 2500
        ) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    });

    scrollBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
