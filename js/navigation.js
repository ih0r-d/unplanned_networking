document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  let currentSlideIndex = 0;

  function updateCurrentSlideIndex() {
    if (document.body.classList.contains('fullscreen-mode')) return;
    
    let minDistance = Infinity;
    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      if (distance < minDistance) {
        minDistance = distance;
        currentSlideIndex = index;
      }
    });
    updateActiveSlideClass();
  }

  function updateActiveSlideClass() {
    slides.forEach((slide, index) => {
      if (index === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }

      const slideNumberElement = slide.querySelector('.slide-number');
      if (slideNumberElement) {
        if (index > 0) {
          slideNumberElement.textContent = `${index + 1}`;
        } else {
          slideNumberElement.textContent = '';
        }
      }
    });
  }

  function updateScale() {
    const isFullscreen = document.body.classList.contains('fullscreen-mode');
    
    if (isFullscreen) {
      const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
      document.body.style.setProperty('--scale-factor', scale);
    } else {
      document.body.style.removeProperty('--scale-factor');
    }
  }

  function scrollToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentSlideIndex = index;
    updateActiveSlideClass();

    if (document.body.classList.contains('fullscreen-mode')) return;

    slides[currentSlideIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  function handleNext() {
    const currentSlide = slides[currentSlideIndex];
    const hiddenFragments = currentSlide.querySelectorAll('.fragment:not(.visible)');
    if (hiddenFragments.length > 0) {
      hiddenFragments[0].classList.add('visible');
    } else {
      scrollToSlide(currentSlideIndex + 1);
    }
  }

  function handlePrev() {
    const currentSlide = slides[currentSlideIndex];
    const visibleFragments = currentSlide.querySelectorAll('.fragment.visible');
    if (visibleFragments.length > 0) {
      visibleFragments[visibleFragments.length - 1].classList.remove('visible');
    } else {
      scrollToSlide(currentSlideIndex - 1);
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('button')) return;
    handleNext();
  });

  document.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('fullscreen-mode')) {
        updateCurrentSlideIndex();
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'Enter':
      case 'PageDown':
        e.preventDefault();
        handleNext();
        break;
      
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'Backspace':
      case 'PageUp':
        e.preventDefault();
        handlePrev();
        break;

      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullScreen();
        break;
        
      case 'Home':
        e.preventDefault();
        scrollToSlide(0);
        break;

      case 'End':
        e.preventDefault();
        scrollToSlide(slides.length - 1);
        break;
    }
  });

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      document.body.classList.add('fullscreen-mode');
      updateActiveSlideClass(); 
    } else {
      document.body.classList.remove('fullscreen-mode');
      setTimeout(() => scrollToSlide(currentSlideIndex), 100);
    }
    updateScale();
  });
  window.addEventListener('resize', updateScale);
  updateScale();
  updateCurrentSlideIndex();
});
