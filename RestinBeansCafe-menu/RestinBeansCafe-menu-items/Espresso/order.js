
const totalPrice = document.getElementById("total-price");
const itemsBox = document.querySelector(".items-box");
const orderForm = document.querySelector(".order-form");
const dialog = document.getElementById("receipt-dialog");
const receiptItems = document.getElementById("receipt-items");

const itemCheckboxes = document.querySelectorAll(
    '.order-item input[type="checkbox"]'
);

const quantities = new Map();

itemCheckboxes.forEach(function (checkbox) {
    quantities.set(checkbox, 1);
});

const pickedFromMenu = new URLSearchParams(window.location.search).get("items");

if (pickedFromMenu) {
    pickedFromMenu.split(",").forEach(function (item) {
        const parts = item.split(":");
        const menuIndex = Number(parts[0]);
        const quantity = parts.length > 1 ? Number(parts[1]) : 1;

        if (
            !Number.isInteger(menuIndex) ||
            menuIndex < 0 ||
            menuIndex >= 50
        ) {
            return;
        }

        const checkboxIndex = menuIndex < 37 ? menuIndex : menuIndex + 4;
        const checkbox = itemCheckboxes[checkboxIndex];

        if (checkbox) {
            checkbox.checked = true;
            quantities.set(
                checkbox,
                Number.isInteger(quantity) && quantity > 0 ? quantity : 1
            );
        }
    });
}

function getItemName(checkbox) {
    return checkbox.parentElement.querySelector(":scope > span:not(.price)").textContent;
}

function getItemPrice(checkbox) {
    return Number(
        checkbox.parentElement
            .querySelector(".price")
            .textContent.replace("₱", "")
    );
}

function updateTotal() {
    let total = 0;

    itemCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            total += getItemPrice(checkbox) * quantities.get(checkbox);
        }
    });

    totalPrice.textContent = "₱" + total;
}

function updateQuantityDisplay(checkbox) {
    const row = checkbox.parentElement;
    const quantityDisplay = row.querySelector(".quantity-value");
    const minusButton = row.querySelector(".quantity-minus");
    const plusButton = row.querySelector(".quantity-plus");

    quantityDisplay.textContent = quantities.get(checkbox);
    minusButton.disabled = !checkbox.checked || quantities.get(checkbox) <= 1;
    plusButton.disabled = !checkbox.checked;

    row.classList.toggle("is-unchecked", !checkbox.checked);
}

function createQuantityControls(checkbox) {
    const row = checkbox.parentElement;

    const controls = document.createElement("div");
    controls.className = "order-quantity";

    const quantityDisplay = document.createElement("span");
    quantityDisplay.className = "quantity-value";

    const minusButton = document.createElement("button");
    minusButton.type = "button";
    minusButton.className = "quantity-button quantity-minus";
    minusButton.textContent = "−";

    const plusButton = document.createElement("button");
    plusButton.type = "button";
    plusButton.className = "quantity-button quantity-plus";
    plusButton.textContent = "+";

    minusButton.addEventListener("click", function () {
        if (!checkbox.checked) return;

        const currentQuantity = quantities.get(checkbox);

        if (currentQuantity > 1) {
            quantities.set(checkbox, currentQuantity - 1);
            updateQuantityDisplay(checkbox);
            updateTotal();
        }
    });

    plusButton.addEventListener("click", function () {
        if (!checkbox.checked) return;

        quantities.set(checkbox, quantities.get(checkbox) + 1);
        updateQuantityDisplay(checkbox);
        updateTotal();
    });

    controls.appendChild(quantityDisplay);
    controls.appendChild(minusButton);
    controls.appendChild(plusButton);

    row.insertBefore(controls, row.querySelector("span"));
    updateQuantityDisplay(checkbox);
}

function organizeCategories() {
    const children = Array.from(itemsBox.children);
    const groups = [];
    let currentGroup = null;

    children.forEach(function (element) {
        if (element.classList.contains("order-group")) {
            currentGroup = {
                title: element.textContent.trim(),
                items: []
            };

            groups.push(currentGroup);
        } else if (
            currentGroup &&
            element.classList.contains("order-item")
        ) {
            currentGroup.items.push(element);
        }
    });

    const heading = itemsBox.querySelector("h3");

    itemsBox.querySelectorAll(".order-group, .order-item").forEach(
        function (element) {
            element.remove();
        }
    );

    groups.forEach(function (group, index) {
        const category = document.createElement("details");
        category.className = "order-category";

        const categoryHeading = document.createElement("summary");
        categoryHeading.className = "order-category-heading";

        const title = document.createElement("span");
        title.textContent = group.title;

        const arrow = document.createElement("span");
        arrow.className = "category-arrow";
        arrow.textContent = "⌄";

        categoryHeading.appendChild(title);
        categoryHeading.appendChild(arrow);

        const categoryContent = document.createElement("div");
        categoryContent.className = "order-category-content";

        group.items.forEach(function (row) {
            const checkbox = row.querySelector('input[type="checkbox"]');

            createQuantityControls(checkbox);

            checkbox.addEventListener("change", function () {
                updateQuantityDisplay(checkbox);
                updateTotal();
            });

            categoryContent.appendChild(row);
        });

        category.appendChild(categoryHeading);
        category.appendChild(categoryContent);

        const hasSelectedItems = group.items.some(function (row) {
            return row.querySelector('input[type="checkbox"]').checked;
        });

        category.open = hasSelectedItems || index === 0;

        category.addEventListener("toggle", function () {
            if (category.open) {
                const rows = Array.from(categoryContent.children);

                rows.sort(function (a, b) {
                    const aChecked = a.querySelector(
                        'input[type="checkbox"]'
                    ).checked;

                    const bChecked = b.querySelector(
                        'input[type="checkbox"]'
                    ).checked;

                    return Number(bChecked) - Number(aChecked);
                });

                rows.forEach(function (row) {
                    categoryContent.appendChild(row);
                });
            }
        });

        itemsBox.appendChild(category);
    });
}

function createReceipt() {
    const orderedItems = [];
    let total = 0;

    itemCheckboxes.forEach(function (checkbox) {
        if (!checkbox.checked) return;

        const row = checkbox.parentElement;
        const quantity = quantities.get(checkbox);
        const price = getItemPrice(checkbox);
        const subtotal = price * quantity;

        const category = row.closest(".order-category");
        const groupName = category
            ? category.querySelector("summary span").textContent
            : "";

        orderedItems.push({
            name: getItemName(checkbox),
            group: groupName,
            quantity: quantity,
            price: price,
            subtotal: subtotal
        });

        total += subtotal;
    });

    if (orderedItems.length === 0) {
        alert("Please choose at least one item.");
        return;
    }

    document.getElementById("receipt-name").textContent =
        document.getElementById("name").value;

    document.getElementById("receipt-email").textContent =
        document.getElementById("email").value;

    document.getElementById("receipt-date").textContent =
        document.getElementById("date").value;

    document.getElementById("receipt-address").textContent =
        document.getElementById("address").value;

    receiptItems.innerHTML = "";

    orderedItems.forEach(function (item) {
        const li = document.createElement("li");
        const left = document.createElement("span");
        const right = document.createElement("span");

        left.textContent =
            item.name +
            " × " +
            item.quantity +
            " (" +
            item.group.toLowerCase() +
            ")";

        right.textContent = "₱" + item.subtotal;

        li.appendChild(left);
        li.appendChild(right);
        receiptItems.appendChild(li);
    });

    document.getElementById("receipt-total").textContent = "₱" + total;

    dialog.showModal();
}

organizeCategories();

orderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    createReceipt();
});

document.getElementById("receipt-close").addEventListener("click", function () {
    dialog.close();
    window.location.href = window.location.pathname;
});

window.addEventListener("pageshow", updateTotal);

updateTotal();
