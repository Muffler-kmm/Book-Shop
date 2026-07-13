// Developer Muffler
function initMainSlider() {
  const slides = document.querySelectorAll('.slide');
  const radios = document.querySelectorAll('.radio input');
  let currentIndex = 0;
  let autoInterval;

  function showSlide(index) {
    slides.forEach(function(slide) {
      slide.classList.remove('active');
    });
    if (slides[index]) {
      slides[index].classList.add('active');
    }
    radios.forEach(function(radio, i) {
      if (i === index) {
        radio.checked = true;
      }
    });
    currentIndex = index;
  }

  function nextSlide() {
    let newIndex = currentIndex + 1;
    if (newIndex >= slides.length) {
      newIndex = 0;
    }
    showSlide(newIndex);
  }

  function startAutoPlay() {
    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
    }
  }

  for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('click', function() {
      stopAutoPlay();
      showSlide(i);
      startAutoPlay();
    });
  }

  const sliderBlock = document.querySelector('.slider');
  if (sliderBlock) {
    sliderBlock.addEventListener('mouseenter', stopAutoPlay);
    sliderBlock.addEventListener('mouseleave', startAutoPlay);
  }

  showSlide(0);
  startAutoPlay();
}

function initInfoSlider() {
  const infoSlides = document.querySelectorAll('.info-slide-box');
  const infoRadios = document.querySelectorAll('.info-radio input');
  let infoCurrentIndex = 0;
  let infoAutoInterval;

  function showInfoSlide(index) {
    infoSlides.forEach(function(slide) {
      slide.classList.remove('active');
    });
    if (infoSlides[index]) {
      infoSlides[index].classList.add('active');
    }
    infoRadios.forEach(function(radio, i) {
      if (i === index) {
        radio.checked = true;
      }
    });
    infoCurrentIndex = index;
  }

  function nextInfoSlide() {
    let newIndex = infoCurrentIndex + 1;
    if (newIndex >= infoSlides.length) {
      newIndex = 0;
    }
    showInfoSlide(newIndex);
  }

  function startInfoAutoPlay() {
    if (infoAutoInterval) clearInterval(infoAutoInterval);
    infoAutoInterval = setInterval(nextInfoSlide, 5000);
  }

  function stopInfoAutoPlay() {
    if (infoAutoInterval) {
      clearInterval(infoAutoInterval);
      infoAutoInterval = null;
    }
  }

  for (let i = 0; i < infoRadios.length; i++) {
    infoRadios[i].addEventListener('click', function() {
      stopInfoAutoPlay();
      showInfoSlide(i);
      startInfoAutoPlay();
    });
  }

  const infoSliderBlock = document.querySelector('.slider-wrapper');
  if (infoSliderBlock) {
    infoSliderBlock.addEventListener('mouseenter', stopInfoAutoPlay);
    infoSliderBlock.addEventListener('mouseleave', startInfoAutoPlay);
  }

  showInfoSlide(0);
  startInfoAutoPlay();
}