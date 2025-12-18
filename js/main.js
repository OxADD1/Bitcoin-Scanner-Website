document.addEventListener('DOMContentLoaded', function () {
  // Add click handler to close mobile navbar when any nav link is clicked
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }

      // Handle anchor links with manual scrolling
      const href = this.getAttribute('href');
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const navbarHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.boxShadow = '0 2px 10px rgba(247, 147, 26, 0.2)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxCounter = document.querySelector('.lightbox-counter');
  const screenshots = document.querySelectorAll('.screenshot-img');

  let currentImageIndex = 0;
  let imagesList = [];

  // Build image list from screenshots
  function buildImageList() {
    imagesList = Array.from(screenshots).map(img => ({
      src: img.src,
      alt: img.alt,
      id: img.getAttribute('data-img-id')
    }));
  }

  // Open lightbox
  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Update lightbox image
  function updateLightboxImage() {
    const currentImage = imagesList[currentImageIndex];
    lightboxImg.src = currentImage.src;
    lightboxImg.alt = currentImage.alt;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${imagesList.length}`;
  }

  // Show next image
  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % imagesList.length;
    updateLightboxImage();
  }

  // Show previous image
  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + imagesList.length) % imagesList.length;
    updateLightboxImage();
  }

  // Event listeners for screenshots
  screenshots.forEach((screenshot, index) => {
    screenshot.addEventListener('click', () => {
      buildImageList();
      openLightbox(index);
    });
  });

  // Event listeners for lightbox controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

  // Click outside image to close
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      showNextImage();
    }
    if (touchEndX > touchStartX + 50) {
      showPrevImage();
    }
  }
});
