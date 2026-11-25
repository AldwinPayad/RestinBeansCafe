const totalPrice = document.getElementById("total-price");
const subtotalPrice = document.getElementById("subtotal-price");
const discountPrice = document.getElementById("discount-price");
const discountSummaryRow = document.getElementById("discount-summary-row");

const itemsBox = document.querySelector(".items-box");
const orderForm = document.querySelector(".order-form");
const dialog = document.getElementById("receipt-dialog");
const confirmOrderDialog = document.getElementById("confirm-order-dialog");
const confirmOrderYes = document.getElementById("confirm-order-yes");
const confirmOrderNo = document.getElementById("confirm-order-no");
const receiptItems = document.getElementById("receipt-items");
const liveOrderItems = document.getElementById("live-order-items");

const notesField = document.getElementById("additional-notes");
const notesCounter = document.getElementById("notes-counter");

const seniorDiscountCheckbox = document.getElementById("senior-discount");
const seniorDetails = document.getElementById("senior-details");
const seniorNameField = document.getElementById("senior-name");
const seniorIdField = document.getElementById("senior-id");

const pickupDateTimeField = document.getElementById("pickup-datetime");

const itemCheckboxes = document.querySelectorAll(
    '.order-item input[type="checkbox"]'
);

const quantities = new Map();

itemCheckboxes.forEach(function (checkbox) {
    quantities.set(checkbox, checkbox.checked ? 1 : 0);
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

// ---------- Date and time helpers ----------

function getLocalDateTimeValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(date);
}

function updatePickupMinimum() {
    pickupDateTimeField.min = getLocalDateTimeValue(new Date());
}

updatePickupMinimum();

pickupDateTimeField.addEventListener("focus", updatePickupMinimum);
pickupDateTimeField.addEventListener("change", function () {
    pickupDateTimeField.setCustomValidity("");
});

// ---------- Currency and item helpers ----------

function formatCurrency(amount) {
    const roundedAmount = Math.round(amount * 100) / 100;

    if (Number.isInteger(roundedAmount)) {
        return "₱" + roundedAmount;
    }

    return "₱" + roundedAmount.toFixed(2);
}

function getItemName(checkbox) {
    return checkbox.parentElement.querySelector(
        ":scope > span:not(.price)"
    ).textContent;
}

function getItemPrice(checkbox) {
    return Number(
        checkbox.parentElement
            .querySelector(".price")
            .textContent.replace("₱", "")
    );
}

// ---------- Order totals ----------

function calculateTotals() {
    let subtotal = 0;

    itemCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            subtotal += getItemPrice(checkbox) * quantities.get(checkbox);
        }
    });

    const hasSeniorDiscount = seniorDiscountCheckbox.checked;
    const discount = hasSeniorDiscount
        ? Math.round(subtotal * 0.20 * 100) / 100
        : 0;

    return {
        subtotal: subtotal,
        discount: discount,
        total: subtotal - discount
    };
}

function updateLiveOrder() {
    liveOrderItems.innerHTML = "";

    itemCheckboxes.forEach(function (checkbox) {
        if (!checkbox.checked) return;

        const quantity = quantities.get(checkbox);
        const price = getItemPrice(checkbox);
        const category = checkbox.parentElement.closest(".order-category");

        const groupName = category
            ? category.querySelector("summary span").textContent
            : "";

        const li = document.createElement("li");
        const left = document.createElement("span");
        const right = document.createElement("span");

        left.textContent =
            getItemName(checkbox) +
            " × " +
            quantity;

        right.textContent = formatCurrency(price * quantity);

        li.appendChild(left);
        li.appendChild(right);
        liveOrderItems.appendChild(li);
    });
}

function updateTotal() {
    const totals = calculateTotals();

    subtotalPrice.textContent = formatCurrency(totals.subtotal);
    discountPrice.textContent = "−" + formatCurrency(totals.discount);
    totalPrice.textContent = formatCurrency(totals.total);

    discountSummaryRow.hidden = !seniorDiscountCheckbox.checked;

    updateLiveOrder();
}

// ---------- Quantity controls ----------

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

// ---------- Order categories ----------

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

    itemsBox.querySelectorAll(".order-group, .order-item").forEach(
        function (element) {
            element.remove();
        }
    );

    groups.forEach(function (group) {
        const category = document.createElement("details");
        category.className = "order-category";

        const categoryHeading = document.createElement("summary");
        categoryHeading.className = "order-category-heading";

        const title = document.createElement("span");
        title.textContent = group.title;

        const arrow = document.createElement("span");
        arrow.className = "category-arrow";
        arrow.textContent = ">";

        categoryHeading.appendChild(title);
        categoryHeading.appendChild(arrow);

        const categoryContent = document.createElement("div");
        categoryContent.className = "order-category-content";

        group.items.forEach(function (row) {
            const checkbox = row.querySelector('input[type="checkbox"]');

            createQuantityControls(checkbox);

            checkbox.addEventListener("change", function () {
                if (checkbox.checked) {
                    if (quantities.get(checkbox) === 0) {
                        quantities.set(checkbox, 1);
                    }
                } else {
                    quantities.set(checkbox, 0);
                }

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

        category.open = hasSelectedItems;

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

// ---------- Notes and senior discount ----------

function updateNotesCounter() {
    notesCounter.textContent =
        notesField.value.length + " / 1000 characters";
}

function updateSeniorDiscountFields() {
    const isEnabled = seniorDiscountCheckbox.checked;

    seniorDetails.hidden = !isEnabled;
    seniorNameField.required = isEnabled;
    seniorIdField.required = isEnabled;

    updateTotal();
}

// ---------- Receipt ----------

function createReceipt() {
    const orderedItems = [];

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
            subtotal: subtotal
        });
    });

    if (orderedItems.length === 0) {
        alert("Please choose at least one item.");
        return;
    }

    const pickupDateTime = new Date(pickupDateTimeField.value);
    const now = new Date();

    pickupDateTimeField.setCustomValidity("");

    if (
        !pickupDateTimeField.value ||
        Number.isNaN(pickupDateTime.getTime()) ||
        pickupDateTime.getTime() <= now.getTime()
    ) {
        pickupDateTimeField.setCustomValidity(
            "Please choose a pickup date and time in the future."
        );
        pickupDateTimeField.reportValidity();
        return;
    }

    const orderPlaced = new Date();
    const totals = calculateTotals();
    const isSeniorDiscountApplied = seniorDiscountCheckbox.checked;

    document.getElementById("receipt-name").textContent =
        document.getElementById("name").value;

    document.getElementById("receipt-email").textContent =
        document.getElementById("email").value;

    document.getElementById("receipt-order-placed").textContent =
        formatDateTime(orderPlaced);

    document.getElementById("receipt-pickup-datetime").textContent =
        formatDateTime(pickupDateTime);

    document.getElementById("receipt-address").textContent =
        document.getElementById("address").value;

    document.getElementById("receipt-contact").textContent =
        document.getElementById("contact").value;

    document.getElementById("receipt-payment").textContent =
        document.getElementById("payment-method").value;

    const receiptSeniorRow = document.getElementById("receipt-senior-row");
    receiptSeniorRow.hidden = !isSeniorDiscountApplied;

    if (isSeniorDiscountApplied) {
        document.getElementById("receipt-senior").textContent =
            seniorNameField.value + " (ID: " + seniorIdField.value + ")";
    }

    const receiptNotesRow = document.getElementById("receipt-notes-row");
    const notes = notesField.value.trim();

    receiptNotesRow.hidden = notes.length === 0;
    document.getElementById("receipt-notes").textContent = notes;

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

        right.textContent = formatCurrency(item.subtotal);

        li.appendChild(left);
        li.appendChild(right);
        receiptItems.appendChild(li);
    });

    document.getElementById("receipt-subtotal").textContent =
        formatCurrency(totals.subtotal);

    const receiptDiscountRow = document.getElementById("receipt-discount-row");
    receiptDiscountRow.hidden = !isSeniorDiscountApplied;

    document.getElementById("receipt-discount").textContent =
        "−" + formatCurrency(totals.discount);

    document.getElementById("receipt-total").textContent =
        formatCurrency(totals.total);

    dialog.showModal();
}

// ---------- Initialization and events ----------

organizeCategories();

notesField.addEventListener("input", updateNotesCounter);
seniorDiscountCheckbox.addEventListener("change", updateSeniorDiscountFields);

orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    updatePickupMinimum();

    if (!orderForm.reportValidity()) {
        return;
    }

    createReceipt();
});

document.getElementById("receipt-close").addEventListener("click", function () {
    dialog.close();
    window.location.href = window.location.pathname;
});

window.addEventListener("pageshow", updateTotal);

updateNotesCounter();
updateSeniorDiscountFields();
updateTotal();