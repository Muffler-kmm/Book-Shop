// Developer Muffler
let cart = loadFromLocalStorage('bookCart', []);

function saveCart() {
  saveToLocalStorage('bookCart', cart);
  updateCartDisplay();
  updateCartSidebar();
}

function updateCartDisplay() {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + (cart[i].price * cart[i].quantity);
  }
  const cartTotalElement = document.getElementById('cartTotal');
  if (cartTotalElement) {
    cartTotalElement.textContent = '(' + total + '₽)';
  }
}

function updateCartSidebar() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSidebarTotal = document.getElementById('cartSidebarTotal');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartItemsCount = document.getElementById('cartItemsCount');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const agreeCheckbox = document.getElementById('agreeCheckbox');
  const deliveryElement = document.getElementById('cartDelivery');
  const deliveryInfoElement = document.getElementById('cartDeliveryInfo');
  
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart"><i class="bx bx-shopping-bag"></i><p>Ваша корзина пуста</p><small>Добавьте книги, чтобы оформить заказ</small></div>';
    if (cartSidebarTotal) cartSidebarTotal.textContent = '0₽';
    if (cartSubtotal) cartSubtotal.textContent = '0₽';
    if (cartItemsCount) cartItemsCount.textContent = '0';
    if (deliveryElement) deliveryElement.textContent = '0₽';
    if (deliveryInfoElement) deliveryInfoElement.innerHTML = '';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  
  let itemsHTML = '';
  let subtotal = 0;
  let itemCount = 0;
  
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const originalPrice = Math.round(item.price * 2);
    const itemTotal = item.price * item.quantity;
    subtotal = subtotal + itemTotal;
    itemCount = itemCount + item.quantity;
    
    itemsHTML = itemsHTML + `
      <div class="cart-sidebar-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.cover}" alt="${item.title}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">
            <span class="old-price">${originalPrice} ₽</span>
            <span class="new-price">${item.price} ₽</span>
          </div>
          <div class="cart-item-quantity">
            <button class="quantity-minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-plus" data-id="${item.id}">+</button>
          </div>
          <button class="remove-item-btn" data-id="${item.id}">Удалить</button>
        </div>
      </div>
    `;
  }
  
  cartItemsContainer.innerHTML = itemsHTML;
  
  const deliveryCost = getDeliveryCost(subtotal);
  const total = subtotal + deliveryCost;
  
  if (cartSubtotal) cartSubtotal.textContent = subtotal + '₽';
  if (cartItemsCount) cartItemsCount.textContent = itemCount;
  if (deliveryElement) {
    if (deliveryCost === 0) {
      deliveryElement.innerHTML = '<span class="free-delivery">Бесплатно</span>';
    } else {
      deliveryElement.textContent = deliveryCost + '₽';
    }
  }
  if (cartSidebarTotal) cartSidebarTotal.textContent = total + '₽';
  
  if (deliveryInfoElement) {
    if (subtotal >= 1500) {
      deliveryInfoElement.innerHTML = '<span class="free-delivery">Бесплатная доставка применена</span>';
    } else {
      const needed = 1500 - subtotal;
      deliveryInfoElement.innerHTML = 'Добавьте товаров на ' + needed + ' ₽ для бесплатной доставки';
    }
  }
  
  if (checkoutBtn) {
    if (agreeCheckbox) {
      checkoutBtn.disabled = !agreeCheckbox.checked;
    } else {
      checkoutBtn.disabled = true;
    }
  }
  
  const minusBtns = document.querySelectorAll('.quantity-minus');
  const plusBtns = document.querySelectorAll('.quantity-plus');
  const removeBtns = document.querySelectorAll('.remove-item-btn');
  
  for (let i = 0; i < minusBtns.length; i++) {
    minusBtns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const id = parseInt(this.getAttribute('data-id'));
      updateQuantity(id, -1);
    });
  }
  
  for (let i = 0; i < plusBtns.length; i++) {
    plusBtns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const id = parseInt(this.getAttribute('data-id'));
      updateQuantity(id, 1);
    });
  }
  
  for (let i = 0; i < removeBtns.length; i++) {
    removeBtns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const id = parseInt(this.getAttribute('data-id'));
      removeFromCart(id);
    });
  }
}

function updateQuantity(bookId, delta) {
  let item = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === bookId) {
      item = cart[i];
      break;
    }
  }
  
  if (item) {
    item.quantity = item.quantity + delta;
    if (item.quantity <= 0) {
      cart = cart.filter(function(i) { return i.id !== bookId; });
    }
    saveCart();
    updateCartSidebar();
  }
}

function removeFromCart(bookId) {
  cart = cart.filter(function(item) { return item.id !== bookId; });
  saveCart();
  updateCartSidebar();
}

function addToCart(bookId, bookData) {
  let existingItem = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === bookId) {
      existingItem = cart[i];
      break;
    }
  }
  
  if (existingItem) {
    existingItem.quantity = existingItem.quantity + 1;
  } else {
    cart.push({
      id: bookData.id,
      title: bookData.title,
      price: bookData.price,
      quantity: 1,
      cover: bookData.cover
    });
  }
  saveCart();
  showToast(bookData.title + ' добавлена в корзину');
}

function initCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');

  function openCart() {
    if (cartSidebar) cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('show');
  }

  function closeCart() {
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('show');
  }

  if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openCart();
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  const agreeCheckbox = document.getElementById('agreeCheckbox');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (agreeCheckbox && checkoutBtn) {
    agreeCheckbox.addEventListener('change', function() {
      if (cart.length > 0) {
        checkoutBtn.disabled = !this.checked;
      }
    });
  }

 if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      showToast('Корзина пуста');
      return;
    }
    if (!agreeCheckbox || !agreeCheckbox.checked) {
      showToast('Подтвердите согласие с условиями');
      return;
    }
    window.location.href = 'checkout.html';
  });
}

  updateCartDisplay();
  updateCartSidebar();
}