// Developer Muffler
let currentModalBook = null;
let currentQuantity = 1;

function initBookModal() {
  const bookModalOverlay = document.getElementById('bookModalOverlay');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalBookImg = document.getElementById('modalBookImg');
  const modalBookTitle = document.getElementById('modalBookTitle');
  const modalBookAuthor = document.getElementById('modalBookAuthor');
  const modalOldPrice = document.getElementById('modalOldPrice');
  const modalNewPrice = document.getElementById('modalNewPrice');
  const modalPages = document.getElementById('modalPages');
  const modalYear = document.getElementById('modalYear');
  const modalWeight = document.getElementById('modalWeight');
  const modalDescription = document.getElementById('modalDescription');
  const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
  const modalWishlistBtn = document.getElementById('modalWishlistBtn');
  const modalQuantityDecr = document.getElementById('modalQuantityDecr');
  const modalQuantityIncr = document.getElementById('modalQuantityIncr');
  const modalQuantitySpan = document.getElementById('modalQuantity');
  
  if (modalQuantitySpan) modalQuantitySpan.textContent = currentQuantity;
  
  if (modalQuantityDecr && modalQuantityIncr && modalQuantitySpan) {
    modalQuantityDecr.addEventListener('click', function() {
      if (currentQuantity > 1) {
        currentQuantity--;
        modalQuantitySpan.textContent = currentQuantity;
      }
    });
    
    modalQuantityIncr.addEventListener('click', function() {
      currentQuantity++;
      modalQuantitySpan.textContent = currentQuantity;
    });
  }
  
  window.openBookModal = function(book) {
    if (!bookModalOverlay) return;
    
    currentModalBook = book;
    currentQuantity = 1;
    if (modalQuantitySpan) modalQuantitySpan.textContent = '1';
    
    modalBookImg.src = book.cover;
    modalBookImg.alt = book.title;
    modalBookTitle.textContent = book.title;
    modalBookAuthor.textContent = book.author;
    modalOldPrice.textContent = book.originalPrice + ' ₽';
    modalNewPrice.textContent = book.price + ' ₽';
    
    const randomPages = Math.floor(Math.random() * (550 - 200 + 1) + 200);
    const randomYear = Math.floor(Math.random() * (2024 - 2018 + 1) + 2018);
    const randomWeight = Math.floor(Math.random() * (750 - 300 + 1) + 300);
    
    if (modalPages) modalPages.textContent = randomPages;
    if (modalYear) modalYear.textContent = randomYear;
    if (modalWeight) modalWeight.textContent = randomWeight + ' г';
    
    const descriptions = [
      'Увлекательная книга, которая не оставит вас равнодушным. Погрузитесь в мир приключений, эмоций и новых открытий. Это издание станет отличным дополнением вашей библиотеки.',
      'Бестселлер года! Тысячи читателей уже оценили эту книгу. Захватывающий сюжет и глубокие персонажи не дадут оторваться до последней страницы.',
      'Книга, которая меняет взгляд на мир. Автор делится уникальными знаниями и опытом. Обязательна к прочтению всем, кто стремится к саморазвитию.'
    ];
    if (modalDescription) modalDescription.textContent = book.description || descriptions[book.id % descriptions.length];
    
    bookModalOverlay.classList.add('active');
  };
  
  function closeBookModal() {
    if (bookModalOverlay) {
      bookModalOverlay.classList.remove('active');
      currentModalBook = null;
      currentQuantity = 1;
      if (modalQuantitySpan) modalQuantitySpan.textContent = '1';
    }
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeBookModal();
    });
  }
  
  if (bookModalOverlay) {
    bookModalOverlay.addEventListener('click', function(e) {
      if (e.target === bookModalOverlay) {
        closeBookModal();
      }
    });
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && bookModalOverlay && bookModalOverlay.classList.contains('active')) {
      closeBookModal();
    }
  });
  
  if (modalAddToCartBtn && modalWishlistBtn) {
    modalAddToCartBtn.addEventListener('click', function() {
      if (currentModalBook) {
        let existingItem = null;
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === currentModalBook.id) {
            existingItem = cart[i];
            break;
          }
        }
        
        if (existingItem) {
          existingItem.quantity = existingItem.quantity + currentQuantity;
        } else {
          cart.push({
            id: currentModalBook.id,
            title: currentModalBook.title,
            price: currentModalBook.price,
            quantity: currentQuantity,
            cover: currentModalBook.cover
          });
        }
        saveCart();
        showToast(currentModalBook.title + ' добавлена в корзину');
        currentQuantity = 1;
        if (modalQuantitySpan) modalQuantitySpan.textContent = '1';
        closeBookModal();
      }
    });
    
    modalWishlistBtn.addEventListener('click', function() {
      if (currentModalBook) {
        toggleWishlist(currentModalBook.id);
        closeBookModal();
      }
    });
  }
}