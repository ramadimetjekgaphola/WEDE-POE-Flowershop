document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if(hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('show'));

    
    let cart = JSON.parse(localStorage.getItem('gardenCart') || "[]");
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.getElementById('cartCount');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');

    
    const paymentModal = document.getElementById('paymentModal');
    const closePayment = document.getElementById('closePayment');
    const paymentForm = document.getElementById('paymentForm');
    const payTotal = document.getElementById('payTotal');
    const paymentSummary = document.getElementById('paymentSummary');
    const paymentError = document.getElementById('paymentError');
    const paymentSuccess = document.getElementById('paymentSuccess');

    function updateCartCount(){
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalQty;
        localStorage.setItem('gardenCart', JSON.stringify(cart));
    }

    function renderCart(){
        cartItemsDiv.innerHTML = "";
        let total = 0;
        if(cart.length === 0){
            cartItemsDiv.innerHTML = "<p style='text-align:center; color:gray; padding:20px;'>Cart is empty</p>";
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.qty;
                const div = document.createElement('div');
                div.className = "cart-item";
                div.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong><br>
                        R${item.price} x ${item.qty}
                    </div>
                    <div class="cart-item-actions">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                        <button class="remove-item" onclick="removeItem(${index})">🗑️</button>
                    </div>
                `;
                cartItemsDiv.appendChild(div);
            });
        }
        cartTotal.textContent = total;
        payTotal.textContent = total;
        updateCartCount();
    }

    
    window.changeQty = (i, delta) => {
        cart[i].qty += delta;
        if(cart[i].qty <= 0) cart.splice(i, 1);
        renderCart();
    };
    window.removeItem = (i) => { cart.splice(i, 1); renderCart(); };

    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemDiv = e.target.closest('.gallery-item');
            const name = itemDiv.dataset.name;
            const price = parseInt(itemDiv.dataset.price);
            const img = itemDiv.querySelector('img').src;
            
            const existing = cart.find(c => c.name === name);
            if(existing) existing.qty += 1;
            else cart.push({name, price, img, qty: 1});
            
            renderCart();
            openCart();
            // Button feedback
            e.target.textContent = "Added! ✓";
            setTimeout(() => e.target.textContent = "Add to Cart", 1000);
        });
    });

    function openCart(){
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
    }
    function closeCartFunc(){
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
    }
    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartFunc);
    cartOverlay.addEventListener('click', closeCartFunc);
    clearCartBtn.addEventListener('click', () => { cart = []; renderCart(); });

    
    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0){ alert("Cart is empty"); return; }
        let summaryHtml = "<h4>Order Summary:</h4>";
        cart.forEach(i => { summaryHtml += `<p>${i.name} x ${i.qty} - R${i.price * i.qty}</p>`; });
        summaryHtml += `<hr><strong>Total: R${cartTotal.textContent}</strong>`;
        paymentSummary.innerHTML = summaryHtml;
        paymentModal.style.display = "flex";
        paymentError.textContent = "";
        paymentSuccess.textContent = "";
    });
    closePayment.addEventListener('click', () => paymentModal.style.display = "none");
    paymentModal.addEventListener('click', (e) => { if(e.target === paymentModal) paymentModal.style.display = "none"; });

   
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        paymentError.textContent = "";
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('cardExpiry').value;
        const cvv = document.getElementById('cardCvv').value;

        if(cardNumber.length < 16){ paymentError.textContent = "Card number must be 16 digits"; return; }
        if(!/^\d{2}\/\d{2}$/.test(expiry)){ paymentError.textContent = "Expiry must be MM/YY"; return; }
        if(cvv.length < 3){ paymentError.textContent = "Invalid CVV"; return; }

        const payBtn = document.getElementById('payBtn');
        payBtn.textContent = "Processing...";
        payBtn.disabled = true;

        
        setTimeout(() => {
            const email = document.getElementById('payEmail').value;
            paymentSuccess.innerHTML = `✅ Payment Successful! R${cartTotal.textContent} paid.<br>Receipt sent to ${email}<br>Order ID: GB-${Date.now()}<br>Thank you for shopping at Garden Bloom! 🌸`;
            
            
            const orderDetails = {
                to: "gardenbloom@gmail.com",
                customerEmail: email,
                items: cart,
                total: cartTotal.textContent,
                date: new Date().toLocaleString()
            };
            console.log("ORDER COMPILED INTO EMAIL:", orderDetails);
            localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

            cart = [];
            renderCart();
            paymentForm.reset();
            payBtn.textContent = `Pay R${cartTotal.textContent}`;
            payBtn.disabled = false;
            
            setTimeout(() => {
                paymentModal.style.display = "none";
                closeCartFunc();
            }, 3000);
        }, 1500);
    });

    
    const galleryImgs = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    document.querySelector('.close-lightbox').addEventListener('click', () => lightbox.style.display = "none");
    galleryImgs.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxCaption.textContent = img.parentElement.dataset.name + " - R" + img.parentElement.dataset.price;
            lightbox.style.display = "flex";
        });
    });
    lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.style.display = "none"; });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.style.display = (f === 'all' || item.dataset.category === f) ? "block" : "none";
            });
        });
    });
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.style.display = item.dataset.name.toLowerCase().includes(term) ? "block" : "none";
        });
    });

    renderCart();
});