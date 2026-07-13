// Developer Muffler
let wishlist = loadFromLocalStorage('bookWishlist', []);

function saveWishlist() {
  saveToLocalStorage('bookWishlist', wishlist);
}

function toggleWishlist(bookId) {
  const index = wishlist.indexOf(bookId);
  if (index === -1) {
    wishlist.push(bookId);
    showToast('Добавлено в избранное');
  } else {
    wishlist.splice(index, 1);
    showToast('Удалено из избранного');
  }
  saveWishlist();
  if (typeof renderCatalog === 'function') renderCatalog();
  if (typeof renderNewBooks === 'function') renderNewBooks('all');
  updateWishlistSidebar();
}

function updateWishlistSidebar() {
  const wishlistItemsContainer = document.getElementById('wishlistItems');
  const wishlistCountSpan = document.getElementById('wishlistCount');
  
  if (!wishlistItemsContainer) return;
  
  if (wishlist.length === 0) {
    wishlistItemsContainer.innerHTML = '<div class="empty-wishlist"><i class="bx bx-heart"></i><p>Ваш список избранного пуст</p><small>Добавляйте книги в избранное, чтобы вернуться к ним позже</small></div>';
    if (wishlistCountSpan) wishlistCountSpan.textContent = '0';
    return;
  }
  
  let itemsHTML = '';
  let itemCount = 0;
  
  for (let i = 0; i < wishlist.length; i++) {
    const bookId = wishlist[i];
    let book = null;
    
    if (window.allSearchBooks) {
      for (let j = 0; j < window.allSearchBooks.length; j++) {
        if (window.allSearchBooks[j].id === bookId) {
          book = window.allSearchBooks[j];
          break;
        }
      }
    }
    
    if (!book) continue;
    
    itemCount++;
    itemsHTML = itemsHTML + `
      <div class="wishlist-sidebar-item" data-id="${book.id}">
        <img class="wishlist-item-img" src="${book.cover}" alt="${book.title}">
        <div class="wishlist-item-info">
          <div class="wishlist-item-title">${book.title}</div>
          <div class="wishlist-item-price">${book.price} ₽</div>
          <div class="wishlist-item-actions">
            <button class="wishlist-add-to-cart" data-id="${book.id}" data-title="${book.title}" data-price="${book.price}" data-cover="${book.cover}">В корзину</button>
            <button class="wishlist-remove-btn" data-id="${book.id}">Удалить</button>
          </div>
        </div>
      </div>
    `;
  }
  
  wishlistItemsContainer.innerHTML = itemsHTML;
  if (wishlistCountSpan) wishlistCountSpan.textContent = itemCount;
  
  const addToCartWishlistBtns = document.querySelectorAll('.wishlist-add-to-cart');
  for (let i = 0; i < addToCartWishlistBtns.length; i++) {
    addToCartWishlistBtns[i].addEventListener('click', function(e) {
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
  
  const removeWishlistBtns = document.querySelectorAll('.wishlist-remove-btn');
  for (let i = 0; i < removeWishlistBtns.length; i++) {
    removeWishlistBtns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      const bookId = parseInt(this.getAttribute('data-id'));
      toggleWishlist(bookId);
      updateWishlistSidebar();
    });
  }
}

function initWishlist() {
  const wishlistSidebar = document.getElementById('wishlistSidebar');
  const wishlistOverlay = document.getElementById('wishlistOverlay');
  const wishlistBtn = document.getElementById('wishlistBtn');
  const closeWishlistBtn = document.getElementById('closeWishlistBtn');
  const addAllToCartBtn = document.getElementById('addAllToCartBtn');

  function openWishlist() {
    if (wishlistSidebar) wishlistSidebar.classList.add('open');
    if (wishlistOverlay) wishlistOverlay.classList.add('show');
    updateWishlistSidebar();
  }

  function closeWishlist() {
    if (wishlistSidebar) wishlistSidebar.classList.remove('open');
    if (wishlistOverlay) wishlistOverlay.classList.remove('show');
  }

  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openWishlist();
    });
  }

  if (closeWishlistBtn) {
    closeWishlistBtn.addEventListener('click', closeWishlist);
  }

  if (wishlistOverlay) {
    wishlistOverlay.addEventListener('click', closeWishlist);
  }

  if (addAllToCartBtn) {
    addAllToCartBtn.addEventListener('click', function() {
      if (wishlist.length === 0) {
        showToast('Избранное пусто');
        return;
      }
      
      let addedCount = 0;
      for (let i = 0; i < wishlist.length; i++) {
        const bookId = wishlist[i];
        let book = null;
        if (window.allSearchBooks) {
          for (let j = 0; j < window.allSearchBooks.length; j++) {
            if (window.allSearchBooks[j].id === bookId) {
              book = window.allSearchBooks[j];
              break;
            }
          }
        }
        if (book) {
          let existingItem = null;
          for (let k = 0; k < cart.length; k++) {
            if (cart[k].id === bookId) {
              existingItem = cart[k];
              break;
            }
          }
          if (existingItem) {
            existingItem.quantity = existingItem.quantity + 1;
          } else {
            cart.push({
              id: book.id,
              title: book.title,
              price: book.price,
              quantity: 1,
              cover: book.cover
            });
          }
          addedCount++;
        }
      }
      saveCart();
      showToast('Добавлено ' + addedCount + ' книг в корзину');
      closeWishlist();
    });
  }

  updateWishlistSidebar();
}