---
title: Press
layout: default
css: "/static/css/press.css"
---

<h1><span class="bracket-left">「</span>Press Gallery<span class="bracket-right">」</span></h1>
<div class="press-grid">
  {% assign photos = site.press | sort: 'title' %}
  {% for item in photos %}
  <figure class="press-card">
    {% if item.image %}
    <img src="{{ item.image | relative_url }}" alt="{{ item.title | escape }}" class="press-image" data-gallery-index="{{ forloop.index0 }}" data-gallery-src="{{ item.image | relative_url }}" data-gallery-title="{{ item.title | escape }}">
    {% endif %}
  </figure>
  {% endfor %}
</div>

<!-- Fullscreen Gallery Overlay -->
<div class="gallery-overlay" id="gallery-overlay">
  <button class="gallery-close" id="gallery-close" aria-label="Close gallery"><span>&times;</span></button>
  <button class="gallery-nav gallery-prev" id="gallery-prev" aria-label="Previous image"><span>‹</span></button>
  <button class="gallery-nav gallery-next" id="gallery-next" aria-label="Next image"><span>›</span></button>
  <div class="gallery-container">
    <div class="gallery-slider" id="gallery-slider">
      {% for item in photos %}
      {% if item.image %}
      <div class="gallery-slide">
        <img src="{{ item.image | relative_url }}" alt="{{ item.title | escape }}" class="gallery-image">
        {% if item.title or item.caption or item.credit %}
        <div class="gallery-info">
          {% if item.title %}<h3 class="gallery-title">{{ item.title | escape }}</h3>{% endif %}
          {% if item.caption %}<p class="gallery-caption">{{ item.caption | escape }}</p>{% endif %}
          {% if item.credit %}<p class="gallery-credit">{{ item.credit | escape }}</p>{% endif %}
        </div>
        {% endif %}
      </div>
      {% endif %}
      {% endfor %}
    </div>
  </div>
</div>

<script>
(function() {
  const galleryOverlay = document.getElementById('gallery-overlay');
  const gallerySlider = document.getElementById('gallery-slider');
  const galleryClose = document.getElementById('gallery-close');
  const galleryPrev = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');
  const pressImages = document.querySelectorAll('.press-image');
  
  let currentIndex = 0;
  let totalSlides = 0;
  let isSwiping = false;

  // Initialize gallery
  function initGallery() {
    totalSlides = document.querySelectorAll('.gallery-slide').length;
    if (totalSlides === 0) return;

    // Add click handlers to press images
    pressImages.forEach((img, index) => {
      img.addEventListener('click', () => openGallery(index));
    });

    // Close button
    galleryClose.addEventListener('click', closeGallery);

    // Navigation buttons
    galleryPrev.addEventListener('click', () => navigateGallery(-1));
    galleryNext.addEventListener('click', () => navigateGallery(1));

    // Close on overlay click (but not on image or info)
    galleryOverlay.addEventListener('click', (e) => {
      if (e.target === galleryOverlay) {
        closeGallery();
      } else if (e.target.classList.contains('gallery-image')) {
        // Click on image to navigate to next
        navigateGallery(1);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!galleryOverlay.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowLeft') {
        navigateGallery(-1);
      } else if (e.key === 'ArrowRight') {
        navigateGallery(1);
      }
    });

    // Prevent body scroll when gallery is open
    const observer = new MutationObserver(() => {
      if (galleryOverlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    observer.observe(galleryOverlay, { attributes: true, attributeFilter: ['class'] });

    // Swipe gesture support for mobile
    setupSwipeGestures();
  }

  function setupSwipeGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50; // Minimum distance in pixels to trigger a swipe

    galleryOverlay.addEventListener('touchstart', (e) => {
      if (!galleryOverlay.classList.contains('active')) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      isSwiping = true;
    }, { passive: true });

    galleryOverlay.addEventListener('touchmove', (e) => {
      if (!isSwiping || !galleryOverlay.classList.contains('active')) return;
      const touch = e.touches[0];
      touchEndX = touch.clientX;
      touchEndY = touch.clientY;
      
      // Calculate current swipe distance for visual feedback
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Only allow horizontal swipes (ignore if vertical movement is greater)
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault(); // Prevent scrolling while swiping horizontally
      }
    }, { passive: false });

    galleryOverlay.addEventListener('touchend', (e) => {
      if (!isSwiping || !galleryOverlay.classList.contains('active')) return;
      isSwiping = false;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      
      // Only trigger swipe if horizontal movement is greater than vertical
      // and exceeds the minimum swipe distance
      if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right - go to previous
          navigateGallery(-1);
        } else {
          // Swipe left - go to next
          navigateGallery(1);
        }
      }
      
      // Reset touch positions
      touchStartX = 0;
      touchStartY = 0;
      touchEndX = 0;
      touchEndY = 0;
    }, { passive: true });
  }

  function openGallery(index) {
    currentIndex = index;
    updateGalleryPosition();
    galleryOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGallery() {
    galleryOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateGallery(direction) {
    currentIndex += direction;
    
    if (currentIndex < 0) {
      currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
      currentIndex = 0;
    }
    
    updateGalleryPosition();
  }

  function updateGalleryPosition() {
    const translateX = -currentIndex * 100;
    gallerySlider.style.transform = `translateX(${translateX}%)`;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
</script>
