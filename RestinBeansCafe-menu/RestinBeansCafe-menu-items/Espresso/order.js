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

        updateTotal();