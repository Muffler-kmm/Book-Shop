// Developer Muffler
function initCheckout() {
  let cart = JSON.parse(localStorage.getItem('bookCart')) || [];
  
  function updateCheckoutDisplay() {
    const checkoutItems = document.getElementById('checkoutItems');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderDelivery = document.getElementById('orderDelivery');
    const orderTotal = document.getElementById('orderTotal');
    
    if (!checkoutItems) return;
    
    if (cart.length === 0) {
      checkoutItems.innerHTML = '<div class="empty-cart-message">Корзина пуста. <a href="index.html#catalog">Вернуться к покупкам</a></div>';
      const placeOrderBtn = document.getElementById('placeOrderBtn');
      if (placeOrderBtn) placeOrderBtn.disabled = true;
      return;
    }
    
    let itemsHTML = '';
    let subtotal = 0;
    
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      itemsHTML += `
        <div class="checkout-item">
          <img src="${item.cover}" alt="${item.title}" class="checkout-item-img">
          <div class="checkout-item-info">
            <div class="checkout-item-title">${item.title}</div>
            <div class="checkout-item-price">${item.price} ₽ x ${item.quantity}</div>
          </div>
          <div class="checkout-item-total">${itemTotal} ₽</div>
        </div>
      `;
    }
    
    checkoutItems.innerHTML = itemsHTML;
    
    const deliveryCost = subtotal >= 1500 ? 0 : 250;
    const total = subtotal + deliveryCost;
    
    if (orderSubtotal) orderSubtotal.textContent = subtotal + ' ₽';
    if (orderDelivery) orderDelivery.textContent = deliveryCost === 0 ? 'Бесплатно' : deliveryCost + ' ₽';
    if (orderTotal) orderTotal.textContent = total + ' ₽';
    
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) placeOrderBtn.disabled = false;
  }
  
  function fillUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const fullNameInput = document.getElementById('fullName');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      
      if (fullNameInput && currentUser.name && currentUser.name !== 'Гость') {
        fullNameInput.value = currentUser.name;
      }
      if (emailInput && currentUser.email && currentUser.email !== 'guest@example.com') {
        emailInput.value = currentUser.email;
      }
      if (phoneInput && currentUser.phone) {
        phoneInput.value = currentUser.phone;
      }
    }
  }
  
  function formatPhone(value) {
    let digits = value.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    let formatted = '';
    if (digits.length > 0) formatted = '+7';
    if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
    if (digits.length > 4) formatted += ') ' + digits.slice(4, 7);
    if (digits.length > 7) formatted += '-' + digits.slice(7, 9);
    if (digits.length > 9) formatted += '-' + digits.slice(9, 11);
    return formatted;
  }
  
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      e.target.value = formatPhone(e.target.value);
    });
  }
  
  function showSuccessOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.innerHTML = `
      <div class="success-content">
        <div class="success-loader" id="successLoader">
          <div class="loader-spinner"></div>
          <p>Оформление заказа...</p>
        </div>
        <div class="success-check" id="successCheck" style="display: none;">
          <div class="checkmark-circle">
            <i class='bx bx-check'></i>
          </div>
          <h3>Заказ оформлен!</h3>
          <p>Спасибо за покупку</p>
          <div class="success-timer">
            <span>Перенаправление через</span>
            <span class="timer-seconds" id="timerSeconds">5</span>
            <span>секунд</span>
          </div>
          <button class="cancel-redirect" id="cancelRedirectBtn">Остаться на странице</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(function() {
      const loader = document.getElementById('successLoader');
      const check = document.getElementById('successCheck');
      if (loader) loader.style.display = 'none';
      if (check) check.style.display = 'block';
    }, 1500);
    
    let seconds = 5;
    const timerElement = document.getElementById('timerSeconds');
    let redirectTimeout = setTimeout(function() {
      window.location.href = 'index.html';
    }, 6500);
    
    const timerInterval = setInterval(function() {
      seconds--;
      if (timerElement) timerElement.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
    
    const cancelBtn = document.getElementById('cancelRedirectBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        clearTimeout(redirectTimeout);
        clearInterval(timerInterval);
        overlay.remove();
        showToast('Вы остались на странице');
      });
    }
    
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        clearTimeout(redirectTimeout);
        clearInterval(timerInterval);
        overlay.remove();
      }
    });
  }
  
  function saveOrder(orderData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser ? currentUser.id : 'guest';
    const orders = JSON.parse(localStorage.getItem('userOrders_' + userId)) || [];
    orders.unshift(orderData);
    localStorage.setItem('userOrders_' + userId, JSON.stringify(orders));
  }
  
  function validateForm() {
    const fullName = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const city = document.getElementById('city')?.value.trim();
    const street = document.getElementById('street')?.value.trim();
    const house = document.getElementById('house')?.value.trim();
    
    if (!fullName) {
      showToast('Введите имя');
      return false;
    }
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      showToast('Введите корректный телефон');
      return false;
    }
    if (!email || !email.includes('@')) {
      showToast('Введите корректный email');
      return false;
    }
    if (!city) {
      showToast('Введите город');
      return false;
    }
    if (!street) {
      showToast('Введите улицу');
      return false;
    }
    if (!house) {
      showToast('Введите номер дома');
      return false;
    }
    if (cart.length === 0) {
      showToast('Корзина пуста');
      return false;
    }
    return true;
  }
  
  function placeOrder() {
    if (!validateForm()) return;
    
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const city = document.getElementById('city').value.trim();
    const street = document.getElementById('street').value.trim();
    const house = document.getElementById('house').value.trim();
    const apartment = document.getElementById('apartment')?.value.trim() || '';
    const comment = document.getElementById('comment')?.value.trim() || '';
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'card';
    
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
      subtotal += cart[i].price * cart[i].quantity;
    }
    const deliveryCost = subtotal >= 1500 ? 0 : 250;
    const total = subtotal + deliveryCost;
    
    const order = {
      id: Date.now(),
      date: new Date().toLocaleString('ru-RU'),
      items: cart.map(function(item) {
        return {
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          cover: item.cover
        };
      }),
      subtotal: subtotal,
      delivery: deliveryCost,
      total: total,
      customer: {
        name: fullName,
        phone: phone,
        email: email
      },
      address: {
        city: city,
        street: street,
        house: house,
        apartment: apartment
      },
      comment: comment,
      paymentMethod: paymentMethod,
      status: 'Новый'
    };
    
    saveOrder(order);
    localStorage.removeItem('bookCart');
    cart = [];
    
    showSuccessOverlay();
  }
  
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
  }
  
  updateCheckoutDisplay();
  fillUserData();
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('checkoutItems')) {
    initCheckout();
  }
});