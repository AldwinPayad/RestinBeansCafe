const totalPrice = document.getElementById("total-price"); 
        const itemCheckboxes = document.querySelectorAll('.order-item input[type="checkbox"]');

        function updateTotal() {
            let total = 0;

            itemCheckboxes.forEach(function (checkbox) {
                if (checkbox.checked) {
                    const priceText = checkbox.parentElement.querySelector('.price').textContent;
                    total += Number(priceText.replace('₱', ''));
                }
            });

            totalPrice.textContent = '₱' + total;
        }

        itemCheckboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', updateTotal);
        });

        const pickedFromMenu = new URLSearchParams(window.location.search).get("items");
        if (pickedFromMenu) {
            pickedFromMenu.split(",").forEach(function (position) {
                const checkbox = itemCheckboxes[Number(position)];
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

          // ----------------------------------------------------------------------------------------------------------------

        const orderForm = document.querySelector(".order-form");
        const dialog = document.getElementById("receipt-dialog");
        const receiptItems = document.getElementById("receipt-items");

        window.addEventListener("pageshow", updateTotal);
 
        orderForm.addEventListener("submit", function (event) {
            event.preventDefault(); // stop the page from reloading
 
            // collect every checked item (name, category, price)
            const orderedItems = [];
            let total = 0;
 
            itemCheckboxes.forEach(function (checkbox) {
                if (!checkbox.checked) return;
 
                const label = checkbox.parentElement;
                const itemName = label.querySelector("span").textContent;
                const price = Number(label.querySelector(".price").textContent.replace("₱", ""));
 
                // find the category heading above this item (ESPRESSO, SODA, ...)
                let heading = label.previousElementSibling;
                while (heading && !heading.classList.contains("order-group")) {
                    heading = heading.previousElementSibling;
                }
 
                orderedItems.push({
                    name: itemName,
                    group: heading ? heading.textContent : "",
                    price: price
                });
                total += price;
            });
 
            if (orderedItems.length === 0) {
                alert("Please choose at least one item.");
                return;
            }
 
            document.getElementById("receipt-name").textContent = document.getElementById("name").value;
            document.getElementById("receipt-email").textContent = document.getElementById("email").value;
            document.getElementById("receipt-date").textContent = document.getElementById("date").value;
        document.getElementById("receipt-address").textContent = document.getElementById("address").value;

                
            receiptItems.innerHTML = "";
            orderedItems.forEach(function (item) {
                const li = document.createElement("li");
                const left = document.createElement("span");
                const right = document.createElement("span");
                left.textContent = item.name + " (" + item.group.toLowerCase() + ")";
                right.textContent = "₱" + item.price;
                li.appendChild(left);
                li.appendChild(right);
                receiptItems.appendChild(li);
            });
 
            document.getElementById("receipt-total").textContent = "₱" + total;
 
            dialog.showModal();
        });
 
        document.getElementById("receipt-close").addEventListener("click", function () {
            dialog.close();
            window.location.href = window.location.pathname;
        });
 
