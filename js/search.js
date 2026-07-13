// Developer Muffler
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchSuggestions = document.getElementById('searchSuggestions');
  const searchResultsOverlay = document.getElementById('searchResultsOverlay');
  const searchResultsGrid = document.getElementById('searchResultsGrid');
  const closeResultsBtn = document.getElementById('closeResultsBtn');
  
  function performSearch(query) {
    if (!query || query.length < 1) {
      searchSuggestions.classList.remove('active');
      return [];
    }
    
    const lowerQuery = query.toLowerCase();
    const results = allSearchBooks.filter(function(book) {
      return book.title.toLowerCase().includes(lowerQuery) || 
             book.author.toLowerCase().includes(lowerQuery);
    });
    return results;
  }
  
  function displaySuggestions(results, query) {
    if (results.length === 0) {
      searchSuggestions.classList.remove('active');
      return;
    }
    
    let suggestionsHTML = '';
    for (let i = 0; i < Math.min(results.length, 8); i++) {
      const book = results[i];
      const titleLower = book.title.toLowerCase();
      const queryLower = query.toLowerCase();
      const startIndex = titleLower.indexOf(queryLower);
      
      let highlightedTitle = '';
      if (startIndex !== -1) {
        highlightedTitle = book.title.substring(0, startIndex) + 
          '<span class="suggestion-highlight">' + 
          book.title.substring(startIndex, startIndex + query.length) + 
          '</span>' + 
          book.title.substring(startIndex + query.length);
      } else {
        highlightedTitle = book.title;
      }
      
      suggestionsHTML += `
        <div class="suggestion-item" data-id="${book.id}" data-title="${book.title}" data-author="${book.author}" data-price="${book.price}" data-cover="${book.cover}" data-originalprice="${book.originalPrice}">
          ${highlightedTitle}
          <span class="suggestion-category">${book.author}</span>
        </div>
      `;
    }
    
    searchSuggestions.innerHTML = suggestionsHTML;
    searchSuggestions.classList.add('active');
    
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    for (let i = 0; i < suggestionItems.length; i++) {
      suggestionItems[i].addEventListener('click', function(e) {
        const bookId = parseInt(this.getAttribute('data-id'));
        const bookTitle = this.getAttribute('data-title');
        const bookAuthor = this.getAttribute('data-author');
        const bookPrice = parseInt(this.getAttribute('data-price'));
        const bookCover = this.getAttribute('data-cover');
        const bookOriginalPrice = parseInt(this.getAttribute('data-originalprice'));
        
        searchInput.value = bookTitle;
        searchSuggestions.classList.remove('active');
        
        showSearchResultCard({
          id: bookId,
          title: bookTitle,
          author: bookAuthor,
          price: bookPrice,
          cover: bookCover,
          originalPrice: bookOriginalPrice
        });
      });
    }
  }
  
  function showSearchResultCard(book) {
    if (!searchResultsOverlay || !searchResultsGrid) return;
    
    const resultsCountText = document.getElementById('resultsCountText');
    if (resultsCountText) resultsCountText.textContent = 'Найдена 1 книга';
    
    const cardHTML = `
      <div class="search-result-card" data-id="${book.id}">
        <div class="discount-badge">-50%</div>
        <img class="search-result-img" src="${book.cover}" alt="${book.title}">
        <div class="search-result-info">
          <div class="search-result-title">${book.title}</div>
          <div class="search-result-author">${book.author}</div>
          <div class="search-result-price">
            <span class="search-result-old-price">${book.originalPrice} ₽</span>
            <span class="search-result-new-price">${book.price} ₽</span>
          </div>
          <button class="search-result-btn" data-id="${book.id}" data-title="${book.title}" data-price="${book.price}" data-cover="${book.cover}">В корзину</button>
        </div>
      </div>
    `;
    
    searchResultsGrid.innerHTML = cardHTML;
    searchResultsOverlay.classList.add('active');
    
    const addToCartResultBtn = document.querySelector('.search-result-btn');
    if (addToCartResultBtn) {
      addToCartResultBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const bookId = parseInt(this.getAttribute('data-id'));
        const bookTitle = this.getAttribute('data-title');
        const bookPrice = parseInt(this.getAttribute('data-price'));
        const bookCover = this.getAttribute('data-cover');
        
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
    
    const resultCard = document.querySelector('.search-result-card');
    if (resultCard) {
      resultCard.addEventListener('click', function(e) {
        if (!e.target.classList.contains('search-result-btn')) {
          const targetCatalog = document.getElementById('catalog');
          if (targetCatalog) {
            targetCatalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          searchResultsOverlay.classList.remove('active');
        }
      });
    }
  }
  
  function handleSearch() {
    const query = searchInput.value.trim();
    if (query.length === 0) {
      showToast('Введите название книги');
      return;
    }
    
    const results = performSearch(query);
    const resultsCountText = document.getElementById('resultsCountText');
    
    if (results.length === 0) {
      showToast('Книга не найдена. Попробуйте другое название');
      if (searchResultsGrid) {
        searchResultsGrid.innerHTML = `
          <div class="empty-results">
            <i class='bx bx-book-open'></i>
            <p>Книга не найдена</p>
            <small>Попробуйте изменить запрос или<br>напишите нам, и мы добавим её в каталог</small>
          </div>
        `;
        if (resultsCountText) resultsCountText.textContent = 'Ничего не найдено';
        searchResultsOverlay.classList.add('active');
      }
    } else {
      if (resultsCountText) resultsCountText.textContent = 'Найдено ' + results.length + ' книг';
      
      let resultsHTML = '';
      for (let i = 0; i < results.length; i++) {
        const book = results[i];
        resultsHTML += `
          <div class="search-result-card" data-id="${book.id}">
            <div class="discount-badge">-50%</div>
            <img class="search-result-img" src="${book.cover}" alt="${book.title}">
            <div class="search-result-info">
              <div class="search-result-title">${book.title}</div>
              <div class="search-result-author">${book.author}</div>
              <div class="search-result-price">
                <span class="search-result-old-price">${book.originalPrice} ₽</span>
                <span class="search-result-new-price">${book.price} ₽</span>
              </div>
              <button class="search-result-btn" data-id="${book.id}" data-title="${book.title}" data-price="${book.price}" data-cover="${book.cover}">В корзину</button>
            </div>
          </div>
        `;
      }
      searchResultsGrid.innerHTML = resultsHTML;
      searchResultsOverlay.classList.add('active');
      
      const resultBtns = document.querySelectorAll('.search-result-btn');
      for (let i = 0; i < resultBtns.length; i++) {
        resultBtns[i].addEventListener('click', function(e) {
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
      
      const resultCards = document.querySelectorAll('.search-result-card');
      for (let i = 0; i < resultCards.length; i++) {
        resultCards[i].addEventListener('click', function(e) {
          if (!e.target.classList.contains('search-result-btn')) {
            searchResultsOverlay.classList.remove('active');
          }
        });
      }
    }
    searchSuggestions.classList.remove('active');
  }
  
  if (closeResultsBtn) {
    closeResultsBtn.addEventListener('click', function() {
      searchResultsOverlay.classList.remove('active');
    });
  }
  
  if (searchResultsOverlay) {
    searchResultsOverlay.addEventListener('click', function(e) {
      if (e.target === searchResultsOverlay) {
        searchResultsOverlay.classList.remove('active');
      }
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.trim();
      const results = performSearch(query);
      displaySuggestions(results, query);
    });
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    });
  }
  
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      handleSearch();
    });
  }
  
  const searchContainerForClose = document.querySelector('.search-container');
  if (searchContainerForClose) {
    document.addEventListener('click', function(e) {
      if (!searchContainerForClose.contains(e.target)) {
        searchSuggestions.classList.remove('active');
      }
    });
  }
}