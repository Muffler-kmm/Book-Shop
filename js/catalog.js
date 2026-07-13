// Developer Muffler
let allSearchBooks = [];

function buildAllSearchBooks() {
  allSearchBooks = [];
  
  booksData.forEach(function(book) {
    allSearchBooks.push({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      cover: book.cover,
      category: 'Популярные',
      originalPrice: Math.round(book.price * 2)
    });
  });
  
  catalogData.forEach(function(book) {
    allSearchBooks.push({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      cover: book.cover,
      category: 'Новинки',
      originalPrice: book.originalPrice
    });
  });
  
  allSearchBooks.push({
    id: 999,
    title: "Birds Gonna Be Happy",
    author: "Тимбур Худ",
    price: 1250,
    cover: "image/Group 347.png",
    category: 'Рекомендуем',
    originalPrice: 2500
  });
  
  window.allSearchBooks = allSearchBooks;
}

function renderCatalog() {
  const catalogGrid = document.getElementById('catalogGrid');
  if (!catalogGrid) return;
  
  let catalogHTML = '';
  for (let i = 0; i < catalogData.length; i++) {
    const book = catalogData[i];
    const isWishlisted = wishlist.includes(book.id);
    catalogHTML = catalogHTML + `
      <div class="catalog-card">
        <div class="discount-badge">-50%</div>
        <img class="catalog-card-img" src="${book.cover}" alt="${book.title}">
        <div class="catalog-card-info">
          <div class="catalog-card-title">${book.title}</div>
          <div class="catalog-card-author">${book.author}</div>
          <div class="catalog-card-price">
            <span class="old-price">${book.originalPrice} ₽</span>
            <span class="new-price">${book.price} ₽</span>
          </div>
        </div>
        <div class="catalog-card-overlay">
          <button class="catalog-overlay-btn add-to-cart-btn" data-id="${book.id}">
            <i class='bx bx-shopping-bag'></i>
          </button>
          <button class="catalog-overlay-btn wishlist-btn ${isWishlisted ? 'wishlist-active' : ''}" data-id="${book.id}">
            <i class='bx bx-heart'></i>
          </button>
        </div>
      </div>
    `;
  }
  catalogGrid.innerHTML = catalogHTML;
  
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  for (let i = 0; i < addToCartBtns.length; i++) {
    addToCartBtns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const bookId = parseInt(this.getAttribute('data-id'));
      const book = catalogData.find(b => b.id === bookId);
      if (book) addToCart(bookId, book);
    });
  }
  
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  for (let i = 0; i < wishlistBtns.length; i++) {
    wishlistBtns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const bookId = parseInt(this.getAttribute('data-id'));
      toggleWishlist(bookId);
    });
  }
}

function initCatalog() {
  const booksTrack = document.getElementById('booksTrack');
  if (booksTrack) {
    let allBooksHTML = '';
    for (let i = 0; i < booksData.length; i++) {
      allBooksHTML = allBooksHTML + `
        <div class="book-item">
          <img class="book-cover-img" src="${booksData[i].cover}" alt="${booksData[i].title}">
          <div class="book-title-bottom">${booksData[i].title}</div>
        </div>
      `;
    }
    allBooksHTML = allBooksHTML + allBooksHTML;
    booksTrack.innerHTML = allBooksHTML;
  }
  
  const allBooksGrid = document.getElementById('allBooksGrid');
  if (allBooksGrid) {
    let allBooksGridHTML = '';
    for (let i = 0; i < booksData.length; i++) {
      const originalPrice = Math.round(booksData[i].price * 2);
      allBooksGridHTML = allBooksGridHTML + `
        <div class="all-book-card">
          <div class="discount-badge">-50%</div>
          <img class="all-book-cover" src="${booksData[i].cover}" alt="${booksData[i].title}">
          <div class="all-book-title">${booksData[i].title}</div>
          <div class="all-book-author">${booksData[i].author}</div>
          <div class="all-book-price">
            <span class="old-price">${originalPrice} ₽</span>
            <span class="new-price">${booksData[i].price} ₽</span>
          </div>
          <button class="all-book-btn" data-id="${booksData[i].id}">В корзину</button>
        </div>
      `;
    }
    allBooksGrid.innerHTML = allBooksGridHTML;
    
    const allBookButtons = document.querySelectorAll('.all-book-btn');
    for (let i = 0; i < allBookButtons.length; i++) {
      allBookButtons[i].addEventListener('click', function(e) {
        e.stopPropagation();
        const bookId = parseInt(this.getAttribute('data-id'));
        const book = booksData.find(b => b.id === bookId);
        if (book) addToCart(bookId, book);
      });
    }
  }
  
  const showAllBtn = document.getElementById('showAllBtn');
  const allBooksDropdown = document.getElementById('allBooksDropdown');
  
  if (showAllBtn && allBooksDropdown) {
    showAllBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (allBooksDropdown.classList.contains('show')) {
        allBooksDropdown.style.maxHeight = allBooksDropdown.scrollHeight + 'px';
        setTimeout(function() {
          allBooksDropdown.classList.remove('show');
          allBooksDropdown.style.maxHeight = '';
        }, 10);
        showAllBtn.classList.remove('active');
      } else {
        allBooksDropdown.classList.add('show');
        var height = allBooksDropdown.scrollHeight;
        allBooksDropdown.style.maxHeight = '0px';
        setTimeout(function() {
          allBooksDropdown.style.maxHeight = height + 'px';
        }, 10);
        showAllBtn.classList.add('active');
      }
    });
  }
  
  const recomendBtn = document.querySelector('.recomend-btn');
  if (recomendBtn) {
    recomendBtn.addEventListener('click', function() {
      const recomendBook = {
        id: 999,
        title: "Birds Gonna Be Happy",
        author: "Тимбур Худ",
        price: 1250,
        cover: "image/Group 347.png"
      };
      
      let existingItem = null;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === 999) {
          existingItem = cart[i];
          break;
        }
      }
      
      if (existingItem) {
        existingItem.quantity = existingItem.quantity + 1;
      } else {
        cart.push({
          id: recomendBook.id,
          title: recomendBook.title,
          price: recomendBook.price,
          quantity: 1,
          cover: recomendBook.cover
        });
      }
      saveCart();
      showToast(recomendBook.title + ' добавлена в корзину');
    });
  }
  
  buildAllSearchBooks();
  renderCatalog();
}

function renderNewBooks(filter = 'all') {
  const newGrid = document.getElementById('newBooksGrid');
  if (!newGrid) return;
  
  let filteredBooks = newBooksData;
  if (filter !== 'all') {
    filteredBooks = newBooksData.filter(book => book.category === filter);
  }
  
  let newHTML = '';
  for (let i = 0; i < filteredBooks.length; i++) {
    const book = filteredBooks[i];
    const isWishlisted = wishlist.includes(book.id);
    newHTML += `
      <div class="new-card" data-id="${book.id}">
        <div class="discount-badge">-50%</div>
        <img class="new-card-img" src="${book.cover}" alt="${book.title}">
        <div class="new-card-info">
          <div class="new-card-title">${book.title}</div>
          <div class="new-card-author">${book.author}</div>
          <div class="new-card-price">
            <span class="new-card-old-price">${book.originalPrice} ₽</span>
            <span class="new-card-new-price">${book.price} ₽</span>
          </div>
          <div class="new-card-buttons">
            <button class="new-card-btn" data-id="${book.id}" data-title="${book.title}" data-price="${book.price}" data-cover="${book.cover}">В корзину</button>
            <button class="new-card-wishlist ${isWishlisted ? 'active' : ''}" data-id="${book.id}">
              <i class='bx bx-heart'></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  newGrid.innerHTML = newHTML;
  
  const newBtns = document.querySelectorAll('.new-card-btn');
  for (let i = 0; i < newBtns.length; i++) {
    newBtns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const bookId = parseInt(this.getAttribute('data-id'));
      const bookTitle = this.getAttribute('data-title');
      const bookPrice = parseInt(this.getAttribute('data-price'));
      const bookCover = this.getAttribute('data-cover');
      
      let existingItem = null;
      for (let j = 0; j < cart.length; j++) {
        if (cart[j].id === bookId) {
          existingItem = cart[j];
          break;
        }
      }
      
      if (existingItem) {
        existingItem.quantity = existingItem.quantity + 1;
      } else {
        cart.push({
          id: bookId,
          title: bookTitle,
          price: bookPrice,
          quantity: 1,
          cover: bookCover
        });
      }
      saveCart();
      showToast(bookTitle + ' добавлена в корзину');
    });
  }
  
  const wishlistBtns = document.querySelectorAll('.new-card-wishlist');
  for (let i = 0; i < wishlistBtns.length; i++) {
    wishlistBtns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const bookId = parseInt(this.getAttribute('data-id'));
      toggleWishlist(bookId);
    });
  }
  
  const newCards = document.querySelectorAll('.new-card');
  for (let i = 0; i < newCards.length; i++) {
    newCards[i].addEventListener('click', function(e) {
      if (!e.target.classList.contains('new-card-btn') && 
          !e.target.classList.contains('new-card-wishlist') &&
          !e.target.closest('.new-card-buttons')) {
        const bookId = parseInt(this.getAttribute('data-id'));
        const book = newBooksData.find(b => b.id === bookId);
        if (book && typeof openBookModal === 'function') {
          openBookModal(book);
        }
      }
    });
  }
}