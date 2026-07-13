// Developer Muffler
document.addEventListener('DOMContentLoaded', function() {

  if (typeof initAccount === 'function') initAccount();
  
  if (typeof initCart === 'function') initCart();
  if (typeof initWishlist === 'function') initWishlist();
  if (typeof initCatalog === 'function') initCatalog();
  if (typeof initMainSlider === 'function') initMainSlider();
  if (typeof initInfoSlider === 'function') initInfoSlider();
  if (typeof initBookModal === 'function') initBookModal();
  if (typeof initSearch === 'function') initSearch();
  if (typeof startTimer === 'function') startTimer();

  const scrollButtons = document.querySelectorAll('[data-scroll="books-section"]');
  const booksSection = document.getElementById('books-section');
  
  scrollButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (booksSection) {
        booksSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  

  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;
      
      if (name && email && message) {
        showToast('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
        contactForm.reset();
      } else {
        showToast('Пожалуйста, заполните все обязательные поля');
      }
    });
  }
  
  if (typeof renderNewBooks === 'function') {
    renderNewBooks('all');
  }
  
  const filterBtns = document.querySelectorAll('.new-filters .filter-btn');
  if (filterBtns.length > 0 && typeof renderNewBooks === 'function') {
    for (let i = 0; i < filterBtns.length; i++) {
      filterBtns[i].addEventListener('click', function() {
        for (let j = 0; j < filterBtns.length; j++) {
          filterBtns[j].classList.remove('active');
        }
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        renderNewBooks(filter);
      });
    }
  }
  
  const subscribeBtn = document.getElementById('subscribeBtn');
  const subscribeEmail = document.getElementById('subscribeEmail');
  if (subscribeBtn && subscribeEmail) {
    subscribeBtn.addEventListener('click', function() {
      const email = subscribeEmail.value.trim();
      if (email && email.includes('@')) {
        showToast('Спасибо за подписку! Вы будете получать уведомления о новинках.');
        subscribeEmail.value = '';
      } else {
        showToast('Введите корректный email');
      }
    });
  }

  function addClickToCatalogCards() {
    const catalogCards = document.querySelectorAll('.catalog-card');
    for (let i = 0; i < catalogCards.length; i++) {
      if (catalogCards[i].hasAttribute('data-modal-listener')) continue;
      catalogCards[i].setAttribute('data-modal-listener', 'true');
      catalogCards[i].addEventListener('click', function(e) {
        if (!e.target.classList.contains('catalog-overlay-btn') && 
            !e.target.closest('.catalog-overlay-btn')) {
          const addBtn = this.querySelector('.add-to-cart-btn');
          if (addBtn) {
            const bookId = parseInt(addBtn.getAttribute('data-id'));
            if (bookId && typeof openBookModal === 'function') {
              const book = catalogData.find(b => b.id === bookId);
              if (book) {
                openBookModal(book);
              }
            }
          }
        }
      });
    }
  }
  
  addClickToCatalogCards();
  

  setInterval(function() {
    addClickToCatalogCards();
  }, 500);
});