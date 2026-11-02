document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('gardenCart') || "[]");
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.getElementById('cartCount');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const payTotal = document.getElementById('payTotal');
    
    function updateCart() {
        const qty = cart.reduce((s,i)=>s+i.qty,0);
        if(cartCount) cartCount.textContent = qty;
        localStorage.setItem('gardenCart', JSON.stringify(cart));
    }
    
    function renderCart() {
        if(!cartItemsDiv) return;
        cartItemsDiv.innerHTML = "";
        let total = 0;
        if(cart.length === 0) {
            cartItemsDiv.innerHTML = "<p style='text-align:center;padding:20px;color:gray;'>Cart is empty 🛒</p>";
        } else {
            cart.forEach((item, idx) => {
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
                        <button onclick="changeQty(${idx},-1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${idx},1)">+</button>
                        <button class="remove-item" onclick="removeItem(${idx})">🗑️</button>
                    </div>
                `;
                cartItemsDiv.appendChild(div);
            });
        }
        if(cartTotal) cartTotal.textContent = total;
        if(payTotal) payTotal.textContent = total;
        updateCart();
    }

    window.changeQty = (i,d) => { 
        cart[i].qty+=d; 
        if(cart[i].qty<=0) cart.splice(i,1); 
        renderCart(); 
    };
    
    window.removeItem = (i) => { 
        cart.splice(i,1); 
        renderCart(); 
    };

    window.addToCart = (name, price, img) => {
        const ex = cart.find(c=>c.name===name);
        if(ex) ex.qty++; 
        else cart.push({name, price:parseInt(price), img, qty:1});
        renderCart();
        if(cartSidebar) { 
            cartSidebar.classList.add('open'); 
            if(cartOverlay) cartOverlay.classList.add('show'); 
        }
    };

    document.querySelectorAll('.cart-btn').forEach(btn=>{
        btn.addEventListener('click', e=>{
            const parent = e.target.closest('[data-name]');
            if(!parent) return;
            const imgEl = parent.querySelector('img');
            const imgSrc = imgEl ? imgEl.src : "flower1.jpeg";
            addToCart(parent.dataset.name, parent.dataset.price, imgSrc);
            const original = e.target.textContent;
            e.target.textContent="Added! ✓"; 
            setTimeout(()=>e.target.textContent=original,1000);
        });
    });

    if(cartIcon) {
        cartIcon.addEventListener('click', ()=>{
            cartSidebar.classList.add('open'); 
            cartOverlay.classList.add('show');
        });
    }
    
    const closeCart = document.getElementById('closeCart');
    if(closeCart) {
        closeCart.addEventListener('click', ()=>{
            cartSidebar.classList.remove('open'); 
            cartOverlay.classList.remove('show');
        });
    }
    
    if(cartOverlay) {
        cartOverlay.addEventListener('click', ()=>{
            cartSidebar.classList.remove('open'); 
            cartOverlay.classList.remove('show');
        });
    }
    
    const clearBtn = document.getElementById('clearCartBtn');
    if(clearBtn) {
        clearBtn.addEventListener('click', ()=>{
            cart=[]; 
            renderCart();
        });
    }

    const paymentModal = document.getElementById('paymentModal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closePayment = document.getElementById('closePayment');
    
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', ()=>{
            if(cart.length===0) return alert("Cart is empty! Add some flowers first 🌸");
            let sum="<h4 style='color:#a92e8c;'>Order Summary:</h4>"; 
            cart.forEach(i=>sum+=`<p>${i.name} x ${i.qty} - R${i.price*i.qty}</p>`); 
            sum+=`<hr><strong>Total: R${cartTotal.textContent}</strong>`;
            document.getElementById('paymentSummary').innerHTML=sum;
            paymentModal.style.display="flex";
            document.getElementById('paymentSuccess').textContent="";
        });
    }
    
    if(closePayment) {
        closePayment.addEventListener('click', ()=>paymentModal.style.display="none");
    }
    
    if(paymentModal) {
        paymentModal.addEventListener('click', e=>{ 
            if(e.target===paymentModal) paymentModal.style.display="none"; 
        });
    }
    
    const paymentForm = document.getElementById('paymentForm');
    if(paymentForm) {
        paymentForm.addEventListener('submit', e=>{
            e.preventDefault();
            const cardNum = document.getElementById('cardNumber').value.replace(/\s/g,'');
            const expiry = document.getElementById('cardExpiry').value;
            const cvv = document.getElementById('cardCvv').value;
            
            if(cardNum.length < 16) return alert("Card number must be 16 digits");
            if(!/^\d{2}\/\d{2}$/.test(expiry)) return alert("Expiry must be MM/YY e.g. 12/27");
            if(cvv.length < 3) return alert("Invalid CVV");
            
            const btn = e.target.querySelector('button'); 
            const originalBtn = btn.innerHTML;
            btn.textContent="Processing..."; 
            btn.disabled=true;
            
            setTimeout(()=>{
                const email = document.getElementById('payEmail').value;
                document.getElementById('paymentSuccess').innerHTML=`✅ Payment R${cartTotal.textContent} successful!<br>Order ID: GB-${Date.now()}<br>Receipt sent to ${email}<br>Thank you! 🌸`;
                
               
                console.log("ORDER COMPILED INTO EMAIL:", {
                    to:"gardenbloom@gmail.com", 
                    customerEmail: email, 
                    items: cart, 
                    total: cartTotal.textContent,
                    date: new Date().toLocaleString()
                });
                
                localStorage.setItem('lastOrder', JSON.stringify({
                    items: cart, 
                    total: cartTotal.textContent, 
                    date: new Date().toLocaleString()
                }));
                
                cart=[]; 
                renderCart(); 
                e.target.reset(); 
                btn.innerHTML=originalBtn; 
                btn.disabled=false;
                
                setTimeout(()=>{
                    paymentModal.style.display="none"; 
                    cartSidebar.classList.remove('open'); 
                    cartOverlay.classList.remove('show'); 
                    document.getElementById('paymentSuccess').textContent=""; 
                },3500);
            },1500);
        });
    }

   
    const ham = document.getElementById('hamburger'); 
    const nav = document.getElementById('navLinks');
    if(ham && nav) {
        ham.addEventListener('click', ()=>nav.classList.toggle('show'));
    }

    renderCart();
});