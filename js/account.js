// Developer Muffler
let currentUser = null;

function loadCurrentUser() {
  const saved = localStorage.getItem('currentUser');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
    } catch(e) {
      currentUser = null;
    }
  } else {
    currentUser = null;
  }
  return currentUser;
}

function saveUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  currentUser = user;
  updateHeaderUI();
  
  let users = localStorage.getItem('users');
  users = users ? JSON.parse(users) : [];
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...user };
    localStorage.setItem('users', JSON.stringify(users));
  }
}

function clearUser() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  updateHeaderUI();
}

function updateHeaderUI() {
  const accountNameSpan = document.getElementById('accountName');
  const headerAvatar = document.getElementById('headerAvatar');
  const defaultUserIcon = document.getElementById('defaultUserIcon');
  
  if (accountNameSpan) {
    accountNameSpan.textContent = currentUser ? currentUser.name : 'Аккаунт';
  }
  
  if (headerAvatar && defaultUserIcon) {
    if (currentUser && currentUser.avatar) {
      headerAvatar.src = currentUser.avatar;
      headerAvatar.style.display = 'block';
      defaultUserIcon.style.display = 'none';
    } else {
      headerAvatar.style.display = 'none';
      defaultUserIcon.style.display = 'block';
    }
  }
}

function resizeAndCropImage(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 50;
      canvas.height = 50;
      
      const size = Math.min(img.width, img.height);
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;
      
      ctx.drawImage(img, startX, startY, size, size, 0, 0, 50, 50);
      
      const resizedDataUrl = canvas.toDataURL('image/png');
      callback(resizedDataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function registerUser(name, email, password) {
  if (!name || !email || !password) {
    showToast('Заполните все поля');
    return false;
  }
  
  if (password.length < 6) {
    showToast('Пароль должен быть не менее 6 символов');
    return false;
  }
  
  let users = localStorage.getItem('users');
  users = users ? JSON.parse(users) : [];
  
  if (users.find(u => u.email === email)) {
    showToast('Пользователь с таким email уже существует');
    return false;
  }
  
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    avatar: null,
    phone: '',
    cards: [],
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  saveUser({ id: newUser.id, name: newUser.name, email: newUser.email, avatar: null, phone: '', cards: [] });
  showToast('Регистрация успешна!');
  
  setTimeout(function() {
    window.location.href = 'index.html';
  }, 500);
  return true;
}

function loginUser(email, password, remember) {
  if (!email || !password) {
    showToast('Введите email и пароль');
    return false;
  }
  
  let users = localStorage.getItem('users');
  users = users ? JSON.parse(users) : [];
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    saveUser({ id: user.id, name: user.name, email: user.email, avatar: user.avatar, phone: user.phone || '', cards: user.cards || [] });
    
    if (remember) {
      localStorage.setItem('rememberedUser', JSON.stringify({ email: email, password: password }));
    } else {
      localStorage.removeItem('rememberedUser');
    }
    
    showToast('Добро пожаловать, ' + user.name + '!');
    
    setTimeout(function() {
      window.location.href = 'index.html';
    }, 500);
    return true;
  } else {
    showToast('Неверный email или пароль');
    return false;
  }
}

function guestLogin() {
  saveUser({
    id: 'guest_' + Date.now(),
    name: 'Гость',
    email: 'guest@example.com',
    avatar: null,
    phone: '',
    cards: []
  });
  showToast('Вход выполнен как гость');
  
  setTimeout(function() {
    window.location.href = 'index.html';
  }, 500);
}

function logoutUser() {
  clearUser();
  showToast('Вы вышли из аккаунта');
  
  setTimeout(function() {
    window.location.href = 'index.html';
  }, 500);
}

function changeName(newName) {
  if (!newName || newName.trim() === '') {
    showToast('Введите имя');
    return false;
  }
  
  currentUser.name = newName;
  saveUser(currentUser);
  updateProfileUI();
  showToast('Имя обновлено');
  return true;
}

function changeEmail(newEmail) {
  if (!newEmail || !newEmail.includes('@')) {
    showToast('Введите корректный email');
    return false;
  }
  
  currentUser.email = newEmail;
  saveUser(currentUser);
  updateProfileUI();
  showToast('Email обновлен');
  return true;
}

function changePhone(newPhone) {
  currentUser.phone = newPhone;
  saveUser(currentUser);
  updateProfileUI();
  showToast('Телефон обновлен');
  return true;
}

function changePassword(currentPassword, newPassword, confirmPassword) {
  if (!currentPassword || !newPassword || !confirmPassword) {
    showToast('Заполните все поля');
    return false;
  }
  
  let users = localStorage.getItem('users');
  users = users ? JSON.parse(users) : [];
  const user = users.find(u => u.id === currentUser.id);
  
  if (!user || user.password !== currentPassword) {
    showToast('Текущий пароль неверен');
    return false;
  }
  
  if (newPassword.length < 6) {
    showToast('Новый пароль должен быть не менее 6 символов');
    return false;
  }
  
  if (newPassword !== confirmPassword) {
    showToast('Новые пароли не совпадают');
    return false;
  }
  
  user.password = newPassword;
  localStorage.setItem('users', JSON.stringify(users));
  showToast('Пароль успешно изменен');
  
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';
  
  return true;
}

function loadUserCards() {
  const cardsList = document.getElementById('cardsList');
  if (!cardsList) return;
  
  const cards = currentUser?.cards || [];
  
  if (cards.length === 0) {
    cardsList.innerHTML = '<div class="empty-cards">Нет добавленных карт</div>';
    return;
  }
  
  let cardsHTML = '';
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const last4 = card.number.slice(-4);
    cardsHTML += `
      <div class="card-item" data-card-index="${i}">
        <div class="card-info">
          <i class='bx bx-credit-card'></i>
          <div class="card-details">
            <p>**** **** **** ${last4}</p>
            <small>${card.name} | ${card.expiry}</small>
          </div>
        </div>
        <button class="delete-card-btn" data-card-index="${i}">
          <i class='bx bx-trash'></i>
        </button>
      </div>
    `;
  }
  cardsList.innerHTML = cardsHTML;
  
  const deleteBtns = document.querySelectorAll('.delete-card-btn');
  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-card-index'));
      deleteCard(index);
    });
  }
}

function addCard(cardNumber, expiry, cvv, cardName) {
  if (!cardNumber || cardNumber.length < 16) {
    showToast('Введите корректный номер карты');
    return false;
  }
  
  if (!expiry || expiry.length < 5) {
    showToast('Введите срок действия');
    return false;
  }
  
  if (!cvv || cvv.length < 3) {
    showToast('Введите CVV код');
    return false;
  }
  
  if (!cardName) {
    showToast('Введите имя владельца');
    return false;
  }
  
  const newCard = {
    number: cardNumber.replace(/\s/g, ''),
    expiry: expiry,
    cvv: cvv,
    name: cardName
  };
  
  if (!currentUser.cards) currentUser.cards = [];
  currentUser.cards.push(newCard);
  saveUser(currentUser);
  loadUserCards();
  showToast('Карта добавлена');
  closeCardModal();
  return true;
}

function deleteCard(index) {
  if (currentUser.cards && currentUser.cards[index]) {
    currentUser.cards.splice(index, 1);
    saveUser(currentUser);
    loadUserCards();
    showToast('Карта удалена');
  }
}

let ordersPerPage = 3;
let currentOrdersPage = 1;
let allOrders = [];

function loadUserOrders() {
  const ordersList = document.getElementById('ordersList');
  const showMoreBtn = document.getElementById('showMoreOrdersBtn');
  
  if (!ordersList) return;
  
  const orders = JSON.parse(localStorage.getItem('userOrders_' + currentUser?.id)) || [];
  allOrders = orders;
  
  if (orders.length === 0) {
    ordersList.innerHTML = `
      <div class="empty-orders">
        <i class='bx bx-package'></i>
        <p>У вас пока нет заказов</p>
        <small>Перейдите в каталог и сделайте первый заказ</small>
      </div>
    `;
    if (showMoreBtn) showMoreBtn.style.display = 'none';
    return;
  }
  
  const startIndex = 0;
  const endIndex = ordersPerPage;
  const visibleOrders = orders.slice(startIndex, endIndex);
  
  let ordersHTML = '';
  for (let i = 0; i < visibleOrders.length; i++) {
    const order = visibleOrders[i];
    const itemCount = order.items.reduce(function(sum, item) {
      return sum + item.quantity;
    }, 0);
    
    let statusClass = 'status-new';
    let statusText = 'Новый';
    if (order.status === 'Доставлен') {
      statusClass = 'status-delivered';
      statusText = 'Доставлен';
    } else if (order.status === 'Отменен') {
      statusClass = 'status-cancelled';
      statusText = 'Отменен';
    }
    
    ordersHTML += `
      <div class="order-item" data-order-id="${order.id}">
        <div class="order-header">
          <span class="order-date"><i class='bx bx-calendar'></i> ${order.date}</span>
          <span class="order-status ${statusClass}">${statusText}</span>
        </div>
        <div class="order-items-preview">
          <i class='bx bx-book-open'></i> ${itemCount} товар(ов)
        </div>
        <div class="order-total">${order.total} ₽</div>
        <button class="order-details-link" data-order-id="${order.id}">
          Подробнее <i class='bx bx-chevron-down'></i>
        </button>
        <div class="order-details" id="orderDetails-${order.id}">
          <div class="order-details-items">
            ${order.items.map(item => `
              <div class="detail-item">
                <span>${item.title} x ${item.quantity}</span>
                <span>${item.price * item.quantity} ₽</span>
              </div>
            `).join('')}
          </div>
          <div class="order-address">
            <h4><i class='bx bx-map'></i> Адрес доставки</h4>
            <p>${order.address.city}, ${order.address.street}, ${order.address.house}${order.address.apartment ? ', кв. ' + order.address.apartment : ''}</p>
          </div>
          <div class="order-payment">
            <h4><i class='bx bx-credit-card'></i> Способ оплаты</h4>
            <p>${order.paymentMethod === 'card' ? 'Банковская карта' : order.paymentMethod === 'cash' ? 'Наличными при получении' : 'Онлайн оплата'}</p>
          </div>
        </div>
      </div>
    `;
  }
  
  ordersList.innerHTML = ordersHTML;
  
  if (showMoreBtn) {
    if (orders.length > ordersPerPage) {
      showMoreBtn.style.display = 'flex';
    } else {
      showMoreBtn.style.display = 'none';
    }
  }
  
  const detailsLinks = document.querySelectorAll('.order-details-link');
  for (let i = 0; i < detailsLinks.length; i++) {
    detailsLinks[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const orderId = this.getAttribute('data-order-id');
      const details = document.getElementById('orderDetails-' + orderId);
      const icon = this.querySelector('i');
      if (details.classList.contains('show')) {
        details.classList.remove('show');
        icon.classList.remove('bx-chevron-up');
        icon.classList.add('bx-chevron-down');
      } else {
        details.classList.add('show');
        icon.classList.remove('bx-chevron-down');
        icon.classList.add('bx-chevron-up');
      }
    });
  }
}

function showMoreOrders() {
  currentOrdersPage++;
  const startIndex = 0;
  const endIndex = ordersPerPage * currentOrdersPage;
  const visibleOrders = allOrders.slice(startIndex, endIndex);
  const ordersList = document.getElementById('ordersList');
  const showMoreBtn = document.getElementById('showMoreOrdersBtn');
  
  if (!ordersList) return;
  
  let ordersHTML = '';
  for (let i = 0; i < visibleOrders.length; i++) {
    const order = visibleOrders[i];
    const itemCount = order.items.reduce(function(sum, item) {
      return sum + item.quantity;
    }, 0);
    
    let statusClass = 'status-new';
    let statusText = 'Новый';
    if (order.status === 'Доставлен') {
      statusClass = 'status-delivered';
      statusText = 'Доставлен';
    } else if (order.status === 'Отменен') {
      statusClass = 'status-cancelled';
      statusText = 'Отменен';
    }
    
    ordersHTML += `
      <div class="order-item" data-order-id="${order.id}">
        <div class="order-header">
          <span class="order-date"><i class='bx bx-calendar'></i> ${order.date}</span>
          <span class="order-status ${statusClass}">${statusText}</span>
        </div>
        <div class="order-items-preview">
          <i class='bx bx-book-open'></i> ${itemCount} товар(ов)
        </div>
        <div class="order-total">${order.total} ₽</div>
        <button class="order-details-link" data-order-id="${order.id}">
          Подробнее <i class='bx bx-chevron-down'></i>
        </button>
        <div class="order-details" id="orderDetails-${order.id}">
          <div class="order-details-items">
            ${order.items.map(item => `
              <div class="detail-item">
                <span>${item.title} x ${item.quantity}</span>
                <span>${item.price * item.quantity} ₽</span>
              </div>
            `).join('')}
          </div>
          <div class="order-address">
            <h4><i class='bx bx-map'></i> Адрес доставки</h4>
            <p>${order.address.city}, ${order.address.street}, ${order.address.house}${order.address.apartment ? ', кв. ' + order.address.apartment : ''}</p>
          </div>
          <div class="order-payment">
            <h4><i class='bx bx-credit-card'></i> Способ оплаты</h4>
            <p>${order.paymentMethod === 'card' ? 'Банковская карта' : order.paymentMethod === 'cash' ? 'Наличными при получении' : 'Онлайн оплата'}</p>
          </div>
        </div>
      </div>
    `;
  }
  
  ordersList.innerHTML = ordersHTML;
  
  if (visibleOrders.length >= allOrders.length) {
    showMoreBtn.style.display = 'none';
  }
  
  const detailsLinks = document.querySelectorAll('.order-details-link');
  for (let i = 0; i < detailsLinks.length; i++) {
    detailsLinks[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const orderId = this.getAttribute('data-order-id');
      const details = document.getElementById('orderDetails-' + orderId);
      const icon = this.querySelector('i');
      if (details.classList.contains('show')) {
        details.classList.remove('show');
        icon.classList.remove('bx-chevron-up');
        icon.classList.add('bx-chevron-down');
      } else {
        details.classList.add('show');
        icon.classList.remove('bx-chevron-down');
        icon.classList.add('bx-chevron-up');
      }
    });
  }
}

function openCardModal() {
  const modal = document.getElementById('cardModalOverlay');
  if (modal) modal.classList.add('active');
}

function closeCardModal() {
  const modal = document.getElementById('cardModalOverlay');
  if (modal) modal.classList.remove('active');
  document.getElementById('cardNumber').value = '';
  document.getElementById('cardExpiry').value = '';
  document.getElementById('cardCvv').value = '';
  document.getElementById('cardName').value = '';
}

function updateProfileUI() {
  const authContainer = document.getElementById('authContainer');
  const profileContainer = document.getElementById('profileContainer');
  
  if (!authContainer || !profileContainer) return;
  
  if (currentUser) {
    authContainer.style.display = 'none';
    profileContainer.style.display = 'block';
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email || 'email@example.com';
    document.getElementById('profilePhone').textContent = currentUser.phone || '+7 (___) ___-__-__';
    
    if (currentUser.id) {
      let idNum = currentUser.id;
      if (typeof idNum === 'string' && idNum.includes('guest')) {
        document.getElementById('profileMemberSince').textContent = 'Гостевой аккаунт';
      } else {
        const memberDate = new Date(parseInt(idNum)).getFullYear();
        document.getElementById('profileMemberSince').textContent = 'Участник с ' + memberDate;
      }
    }
    
    const avatarImage = document.getElementById('avatarImage');
    if (avatarImage) {
      if (currentUser.avatar) {
        avatarImage.src = currentUser.avatar;
        avatarImage.style.display = 'block';
      } else {
        avatarImage.style.display = 'none';
      }
    }
    
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount && typeof wishlist !== 'undefined') {
      wishlistCount.textContent = wishlist.length;
    }
    
    const ordersCount = document.getElementById('ordersCount');
    if (ordersCount) {
      const orders = JSON.parse(localStorage.getItem('userOrders_' + currentUser.id)) || [];
      ordersCount.textContent = orders.length;
    }
    
    loadUserCards();
    loadUserOrders();
    
  } else {
    authContainer.style.display = 'block';
    profileContainer.style.display = 'none';
  }
  
  updateHeaderUI();
}

function initAccountPage() {
  loadCurrentUser();
  
  const authTabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('loginFormContainer');
  const registerForm = document.getElementById('registerFormContainer');
  
  if (authTabs.length && loginForm && registerForm) {
    for (let i = 0; i < authTabs.length; i++) {
      authTabs[i].addEventListener('click', function() {
        for (let j = 0; j < authTabs.length; j++) {
          authTabs[j].classList.remove('active');
        }
        this.classList.add('active');
        
        if (this.getAttribute('data-tab') === 'login') {
          loginForm.classList.add('active');
          registerForm.classList.remove('active');
        } else {
          loginForm.classList.remove('active');
          registerForm.classList.add('active');
        }
      });
    }
  }
  
  const profileTabs = document.querySelectorAll('.profile-tab');
  const tabContents = document.querySelectorAll('.profile-tab-content');
  
  if (profileTabs.length) {
    for (let i = 0; i < profileTabs.length; i++) {
      profileTabs[i].addEventListener('click', function() {
        for (let j = 0; j < profileTabs.length; j++) {
          profileTabs[j].classList.remove('active');
        }
        this.classList.add('active');
        
        for (let j = 0; j < tabContents.length; j++) {
          tabContents[j].classList.remove('active');
        }
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId + 'Tab').classList.add('active');
      });
    }
  }
  
  const loginBtn = document.getElementById('loginSubmitBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const remember = document.getElementById('rememberCheckbox').checked;
      loginUser(email, password, remember);
    });
  }
  
  const registerBtn = document.getElementById('registerSubmitBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', function() {
      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      const confirm = document.getElementById('regConfirmPassword').value;
      
      if (password !== confirm) {
        showToast('Пароли не совпадают');
        return;
      }
      
      const agree = document.getElementById('agreeTermsCheckbox').checked;
      if (!agree) {
        showToast('Подтвердите условия использования');
        return;
      }
      
      registerUser(name, email, password);
    });
  }
  
  const guestBtn = document.getElementById('guestLoginBtn');
  if (guestBtn) {
    guestBtn.addEventListener('click', function() {
      guestLogin();
    });
  }
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      logoutUser();
    });
  }
  
  const editNameBtn = document.getElementById('editNameBtn');
  if (editNameBtn) {
    editNameBtn.addEventListener('click', function() {
      const newName = prompt('Введите новое имя:', currentUser?.name || '');
      if (newName) changeName(newName);
    });
  }
  
  const editEmailBtn = document.getElementById('editEmailBtn');
  if (editEmailBtn) {
    editEmailBtn.addEventListener('click', function() {
      const newEmail = prompt('Введите новый email:', currentUser?.email || '');
      if (newEmail) changeEmail(newEmail);
    });
  }
  
  const editPhoneBtn = document.getElementById('editPhoneBtn');
  if (editPhoneBtn) {
    editPhoneBtn.addEventListener('click', function() {
      const newPhone = prompt('Введите номер телефона:', currentUser?.phone || '+7');
      if (newPhone) changePhone(newPhone);
    });
  }
  
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', function() {
      const current = document.getElementById('currentPassword').value;
      const newPass = document.getElementById('newPassword').value;
      const confirm = document.getElementById('confirmNewPassword').value;
      changePassword(current, newPass, confirm);
    });
  }
  
  const addCardBtn = document.getElementById('addCardBtn');
  if (addCardBtn) {
    addCardBtn.addEventListener('click', openCardModal);
  }
  
  const closeCardModalBtn = document.getElementById('closeCardModalBtn');
  if (closeCardModalBtn) {
    closeCardModalBtn.addEventListener('click', closeCardModal);
  }
  
  const saveCardBtn = document.getElementById('saveCardBtn');
  if (saveCardBtn) {
    saveCardBtn.addEventListener('click', function() {
      const number = document.getElementById('cardNumber').value;
      const expiry = document.getElementById('cardExpiry').value;
      const cvv = document.getElementById('cardCvv').value;
      const name = document.getElementById('cardName').value;
      addCard(number, expiry, cvv, name);
    });
  }
  
  const showMoreOrdersBtn = document.getElementById('showMoreOrdersBtn');
  if (showMoreOrdersBtn) {
    showMoreOrdersBtn.addEventListener('click', showMoreOrders);
  }
  
  const cardModalOverlay = document.getElementById('cardModalOverlay');
  if (cardModalOverlay) {
    cardModalOverlay.addEventListener('click', function(e) {
      if (e.target === cardModalOverlay) closeCardModal();
    });
  }
  
  const profileAvatar = document.getElementById('profileAvatar');
  const avatarInput = document.getElementById('avatarInput');
  
  if (profileAvatar && avatarInput) {
    profileAvatar.addEventListener('click', function() {
      avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
        resizeAndCropImage(file, function(resizedImage) {
          if (currentUser) {
            currentUser.avatar = resizedImage;
            saveUser(currentUser);
            
            const avatarImg = document.getElementById('avatarImage');
            if (avatarImg) {
              avatarImg.src = resizedImage;
              avatarImg.style.display = 'block';
            }
            
            showToast('Аватарка обновлена');
          }
        });
      } else {
        showToast('Выберите изображение формата JPEG или PNG');
      }
    });
  }
  
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 16) value = value.slice(0, 16);
      let formatted = '';
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += value[i];
      }
      e.target.value = formatted;
    });
  }
  
  const cardExpiryInput = document.getElementById('cardExpiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      e.target.value = value;
    });
  }
  
  const cardCvvInput = document.getElementById('cardCvv');
  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 3) value = value.slice(0, 3);
      e.target.value = value;
    });
  }
  
  updateProfileUI();
}

function initGlobalHeader() {
  loadCurrentUser();
  updateHeaderUI();
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('authContainer')) {
    initAccountPage();
  } else {
    initGlobalHeader();
  }
});