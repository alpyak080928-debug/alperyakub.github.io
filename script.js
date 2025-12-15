document.addEventListener('DOMContentLoaded', function() {
    function getCart() {
        const cartString = localStorage.getItem('shoppingCart');
        try {
            return cartString ? JSON.parse(cartString) : [];
        } catch (e) {
            console.error("Kunde inte tolka kundvagn från localStorage:", e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        if (document.getElementById('cart-items-container')) {
            displayCart(); 
        }
    }

    function removeItemFromCart(id, size) {
        let cart = getCart();
        const updatedCart = cart.filter(item => !(item.id === id && item.size === size));
        saveCart(updatedCart);
        alert('Artikel borttagen från kundvagnen.');
    }

    function updateQuantity(id, size, newQuantity) {
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === id && item.size === size);

        if (itemIndex > -1) {
            newQuantity = parseInt(newQuantity, 10);
            
            if (newQuantity <= 0 || isNaN(newQuantity)) {
                removeItemFromCart(id, size);
            } else {
                cart[itemIndex].quantity = newQuantity;
                saveCart(cart);
            }
        }
    }

    function displayCart() {
        const cartContainer = document.getElementById('cart-items-container');
        if (!cartContainer) return; 

        const cart = getCart();
        cartContainer.innerHTML = ''; 
        let cartTotal = 0; 

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Kundvagnen är tom.</p>';
            document.querySelector('.cart-actions').style.display = 'none';
            return;
        }

        document.querySelector('.cart-actions').style.display = 'flex';
        const ul = document.createElement('ul');
        
        cart.forEach((item) => {
            const itemPrice = (item.price || 0) * item.quantity;
            cartTotal += itemPrice;

            const li = document.createElement('li');
            li.classList.add('cart-item');
            
            const itemDetails = document.createElement('span');
            itemDetails.innerHTML = `<strong>${item.name}</strong> (${item.size}) &ndash; ${(item.price || 0).toFixed(2)} SEK/st &ndash; Summa: ${itemPrice.toFixed(2)} SEK`;
            li.appendChild(itemDetails);

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.value = item.quantity;
            quantityInput.classList.add('quantity-input');
            quantityInput.setAttribute('data-product-id', item.id);
            quantityInput.setAttribute('data-product-size', item.size);
            li.appendChild(quantityInput);
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Ta bort';
            removeBtn.classList.add('remove-item-btn');
            removeBtn.setAttribute('data-product-id', item.id);
            removeBtn.setAttribute('data-product-size', item.size);
            
            li.appendChild(removeBtn);
            ul.appendChild(li);
        });

        cartContainer.appendChild(ul);
        
        const totalDiv = document.createElement('div');
        totalDiv.classList.add('cart-total');
        totalDiv.innerHTML = `Totalt: ${cartTotal.toFixed(2)} SEK`;
        cartContainer.appendChild(totalDiv);

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const idToRemove = this.getAttribute('data-product-id');
                const sizeToRemove = this.getAttribute('data-product-size');
                removeItemFromCart(idToRemove, sizeToRemove);
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const idToUpdate = this.getAttribute('data-product-id');
                const sizeToUpdate = this.getAttribute('data-product-size');
                updateQuantity(idToUpdate, sizeToUpdate, this.value);
            });
        });

        const clearCartButton = document.getElementById("clear-cart");
        if (clearCartButton) {
            clearCartButton.addEventListener("click", () => {
                if (confirm('Är du säker på att du vill tömma kundvagnen?')) {
                    saveCart([]);
                }
            });
        }
    }
    
    displayCart();


    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                menuToggle.classList.remove('fa-bars');
                menuToggle.classList.add('fa-times');
            } else {
                menuToggle.classList.remove('fa-times');
                menuToggle.classList.add('fa-bars');
            }
        });
    }


    const sizeButtons = document.querySelectorAll('.size-selector button');
    if (sizeButtons.length > 0) {
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                sizeButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    const purchaseForm = document.getElementById('purchase-form');
    const productAddedAlert = document.getElementById('product-added-alert');

    if (purchaseForm) {
        purchaseForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const selectedSizeButton = document.querySelector('.size-selector button.selected');

            if (!selectedSizeButton) {
                alert('Vänligen välj en storlek innan du lägger till i kundvagnen.');
                return;
            }

            const selectedSize = selectedSizeButton.getAttribute('data-size');
            const quantityInput = purchaseForm.querySelector('input[type="number"]');
            const quantity = parseInt(quantityInput ? quantityInput.value : 1, 10);
            
            if (quantity < 1 || isNaN(quantity)) {
                alert('Antal måste vara minst 1.');
                return;
            }

            const cart = getCart();

            const newItem = {
                id: 'JAX-TSHIRT-001',
                name: 'JAX Casual Street T-shirt',
                size: selectedSize,
                quantity: quantity,
                price: 499.00
            };

            const existingItemIndex = cart.findIndex(item => 
                item.id === newItem.id && item.size === newItem.size
            );

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push(newItem);
            }

            saveCart(cart);
            
            if (productAddedAlert) {
                productAddedAlert.style.opacity = '1';
                productAddedAlert.style.display = 'block';
                setTimeout(() => {
                    productAddedAlert.style.opacity = '0';
                    setTimeout(() => productAddedAlert.style.display = 'none', 500);
                }, 1500);
            }
        });
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const emailInput = document.getElementById('email');
            const email = emailInput.value;

            if (!email.includes('@') || !email.includes('.')) {
                alert('Vänligen ange en giltig e-postadress (måste innehålla @ och .)');
                event.preventDefault(); 
                emailInput.focus();
                return false;
            }
            
            event.preventDefault();
            alert('Tack för ditt meddelande! Vi återkommer snart.');
            contactForm.reset();
        });
    }
});