/**
 * Logic Pocket - Main JavaScript v2.0
 * Peculiar © 2026
 *
 * Features:
 * - Light/Dark theme toggle with localStorage persistence
 * - Scroll-triggered animations using Intersection Observer
 * - Smooth scroll navigation
 * - Horizontal scroll for highlights gallery
 */

document.addEventListener("DOMContentLoaded", () => {
  // ═══════════════════════════════════════════════════════════════
  // THEME: Light mode only
  // ═══════════════════════════════════════════════════════════════

  // Set light theme only
  document.documentElement.setAttribute("data-theme", "light");
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", "#FAFAFA");
  }

  // ═══════════════════════════════════════════════════════════════
  // MOBILE NAVIGATION MENU
  // ═══════════════════════════════════════════════════════════════

  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileNavLinks = document.querySelectorAll("[data-mobile-link]");

  if (mobileMenuToggle && mobileNav) {
    // Toggle mobile menu
    mobileMenuToggle.addEventListener("click", () => {
      const isOpen = mobileMenuToggle.classList.toggle("active");
      mobileNav.classList.toggle("active");

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? "hidden" : "";

      // Update aria-label
      mobileMenuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );
    });

    // Close menu when clicking on a link
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuToggle.classList.remove("active");
        mobileNav.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Close menu on window resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        mobileMenuToggle.classList.remove("active");
        mobileNav.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNav.classList.contains("active")) {
        mobileMenuToggle.classList.remove("active");
        mobileNav.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SCROLL ANIMATIONS (Intersection Observer)
  // ═══════════════════════════════════════════════════════════════

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Determine animation type based on element
        if (entry.target.classList.contains("spec-card")) {
          entry.target.classList.add("animate-scale-in");
        } else if (entry.target.classList.contains("stat-item")) {
          entry.target.classList.add("animate-fade-in-up");
        } else if (entry.target.classList.contains("highlight-card")) {
          entry.target.classList.add("animate-scale-in");
        } else if (entry.target.classList.contains("feature-mockup")) {
          entry.target.classList.add("animate-scale-in");
        } else {
          entry.target.classList.add("animate-fade-in-up");
        }

        // Unobserve after animation (one-time animation)
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => {
    animationObserver.observe(el);
  });

  // ═══════════════════════════════════════════════════════════════
  // SMOOTH SCROLL FOR NAVIGATION LINKS
  // ═══════════════════════════════════════════════════════════════

  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      e.preventDefault();
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // HEADER BEHAVIOR ON SCROLL
  // ═══════════════════════════════════════════════════════════════

  const header = document.querySelector(".header");
  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;

      // Adjust header opacity based on scroll
      if (currentScrollY > 50) {
        header.style.setProperty("--header-opacity", "0.95");
      } else {
        header.style.setProperty("--header-opacity", "0.8");
      }

      lastScrollY = currentScrollY;
    },
    { passive: true }
  );

  // ═══════════════════════════════════════════════════════════════
  // HIDE SCROLL INDICATOR AFTER SCROLLING
  // ═══════════════════════════════════════════════════════════════

  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (scrollIndicator) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 100) {
          scrollIndicator.style.opacity = "0";
          scrollIndicator.style.pointerEvents = "none";
        } else {
          scrollIndicator.style.opacity = "1";
          scrollIndicator.style.pointerEvents = "auto";
        }
      },
      { passive: true }
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // HIGHLIGHTS GALLERY CAROUSEL
  // ═══════════════════════════════════════════════════════════════

  const highlightsGallery = document.getElementById("highlights-gallery");
  const carouselDots = document.querySelectorAll(".carousel-dot");
  const playPauseBtn = document.getElementById("carousel-play-pause");

  if (highlightsGallery && carouselDots.length > 0 && playPauseBtn) {
    let currentIndex = 0;
    let isPlaying = true;
    let autoScrollInterval = null;
    const SCROLL_INTERVAL = 4000; // 4 seconds per slide
    const cards = highlightsGallery.querySelectorAll(".highlight-card");
    const totalCards = cards.length;

    // Function to scroll to a specific card
    const scrollToCard = (index) => {
      const card = cards[index];
      if (!card) return;

      // Calculate scroll position to center the card
      const cardRect = card.getBoundingClientRect();
      const galleryRect = highlightsGallery.getBoundingClientRect();
      const cardCenter =
        card.offsetLeft - galleryRect.width / 2 + cardRect.width / 2;

      highlightsGallery.scrollTo({
        left: cardCenter,
        behavior: "smooth",
      });

      // Update active states
      updateActiveStates(index);
    };

    // Update dot and card active states
    const updateActiveStates = (index) => {
      // Update dots
      carouselDots.forEach((dot, i) => {
        dot.classList.remove("active");
        if (i === index) {
          dot.classList.add("active");
          // Restart animation
          const progress = dot.querySelector(".dot-progress");
          if (progress) {
            progress.style.animation = "none";
            progress.offsetHeight; // Trigger reflow
            progress.style.animation = "";
          }
        }
      });

      // Update cards
      cards.forEach((card, i) => {
        card.classList.remove("carousel-active");
        if (i === index) {
          card.classList.add("carousel-active");
        }
      });

      currentIndex = index;
    };

    // Auto-scroll to next card
    const nextCard = () => {
      const nextIndex = (currentIndex + 1) % totalCards;
      scrollToCard(nextIndex);
    };

    // Start auto-scroll
    const startAutoScroll = () => {
      if (autoScrollInterval) clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(() => {
        if (isPlaying) {
          nextCard();
        }
      }, SCROLL_INTERVAL);
    };

    // Stop auto-scroll
    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    // Toggle play/pause
    const togglePlayPause = () => {
      isPlaying = !isPlaying;
      playPauseBtn.classList.toggle("paused", !isPlaying);
      playPauseBtn.setAttribute(
        "aria-label",
        isPlaying ? "Pause carousel" : "Play carousel"
      );

      // Toggle paused class on active dot for animation
      const activeDot = document.querySelector(".carousel-dot.active");
      if (activeDot) {
        activeDot.classList.toggle("paused", !isPlaying);
      }

      if (isPlaying) {
        startAutoScroll();
      } else {
        stopAutoScroll();
      }
    };

    // Event listeners for dots
    carouselDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        scrollToCard(index);
        // Reset timer when manually clicking
        if (isPlaying) {
          startAutoScroll();
        }
      });
    });

    // Event listener for play/pause button
    playPauseBtn.addEventListener("click", togglePlayPause);

    // Enable horizontal scroll with mouse wheel
    highlightsGallery.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          highlightsGallery.scrollLeft += e.deltaY;

          // Pause auto-scroll on manual interaction
          if (isPlaying) {
            togglePlayPause();
          }
        }
      },
      { passive: false }
    );

    // Detect scroll position to update active dot
    let scrollTimeout;
    highlightsGallery.addEventListener(
      "scroll",
      () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          // Find which card is most visible
          const galleryCenter =
            highlightsGallery.scrollLeft + highlightsGallery.offsetWidth / 2;
          let closestIndex = 0;
          let closestDistance = Infinity;

          cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(cardCenter - galleryCenter);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = i;
            }
          });

          if (closestIndex !== currentIndex) {
            updateActiveStates(closestIndex);
            if (isPlaying) {
              startAutoScroll();
            }
          }
        }, 100);
      },
      { passive: true }
    );

    // Initialize carousel
    updateActiveStates(0);
    startAutoScroll();

    // Pause on hover over gallery
    highlightsGallery.addEventListener("mouseenter", () => {
      if (isPlaying) {
        stopAutoScroll();
        const activeDot = document.querySelector(".carousel-dot.active");
        if (activeDot) {
          activeDot.classList.add("paused");
        }
      }
    });

    highlightsGallery.addEventListener("mouseleave", () => {
      if (isPlaying) {
        startAutoScroll();
        const activeDot = document.querySelector(".carousel-dot.active");
        if (activeDot) {
          activeDot.classList.remove("paused");
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CARD INTERACTIONS
  // ═══════════════════════════════════════════════════════════════

  const interactiveCards = document.querySelectorAll(
    ".spec-card, .highlight-card, .stat-item"
  );

  interactiveCards.forEach((card) => {
    // Tactile feedback on click/tap
    card.addEventListener("mousedown", () => {
      card.style.transform = "scale(0.98)";
    });

    card.addEventListener("mouseup", () => {
      card.style.transform = "";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

    // Touch support
    card.addEventListener(
      "touchstart",
      () => {
        card.style.transform = "scale(0.98)";
      },
      { passive: true }
    );

    card.addEventListener(
      "touchend",
      () => {
        card.style.transform = "";
      },
      { passive: true }
    );
  });

  // ═══════════════════════════════════════════════════════════════
  // PARALLAX EFFECT FOR FEATURE SECTIONS (optional enhancement)
  // ═══════════════════════════════════════════════════════════════

  const featureMockups = document.querySelectorAll(".feature-mockup");

  if (featureMockups.length > 0 && window.innerWidth > 768) {
    window.addEventListener(
      "scroll",
      () => {
        featureMockups.forEach((mockup) => {
          const rect = mockup.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (rect.top < windowHeight && rect.bottom > 0) {
            const scrollProgress =
              (windowHeight - rect.top) / (windowHeight + rect.height);
            const translateY = (scrollProgress - 0.5) * 30; // -15px to +15px
            mockup.style.setProperty("--parallax-y", `${translateY}px`);
          }
        });
      },
      { passive: true }
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // COUNTER ANIMATION FOR STATS
  // ═══════════════════════════════════════════════════════════════

  const animateCounter = (element, target, duration = 1500) => {
    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(
        startValue + (target - startValue) * easeOut
      );

      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Observe stat values for counter animation
  const statValues = document.querySelectorAll(".stat-value");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const text = entry.target.textContent.trim();
          const numericValue = parseInt(text.replace(/[^0-9]/g, ""));

          if (
            !isNaN(numericValue) &&
            numericValue > 0 &&
            numericValue < 10000
          ) {
            entry.target.setAttribute("data-original", text);
            animateCounter(entry.target, numericValue);

            // Restore original text after animation for non-numeric content
            setTimeout(() => {
              const original = entry.target.getAttribute("data-original");
              if (original) {
                entry.target.textContent = original;
              }
            }, 1600);
          }

          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach((el) => counterObserver.observe(el));

  // ═══════════════════════════════════════════════════════════════
  // TIMELESS DESIGN ACCORDION
  // ═══════════════════════════════════════════════════════════════

  const accordionItems = document.querySelectorAll(".accordion-item");
  const designImages = document.querySelectorAll(".design-image");

  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const trigger = item.querySelector(".accordion-trigger");
      
      if (trigger) {
        trigger.addEventListener("click", () => {
          const targetTab = item.getAttribute("data-tab");

          // Remove active class from all items and images
          accordionItems.forEach((i) => i.classList.remove("active"));
          designImages.forEach((img) => img.classList.remove("active"));

          // Add active class to clicked item
          item.classList.add("active");

          // Show corresponding image with crossfade
          const targetImage = document.querySelector(`.design-image[data-image="${targetTab}"]`);
          if (targetImage) {
            targetImage.classList.add("active");
          }
        });
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // FUNCTIONALITY TABS
  // ═══════════════════════════════════════════════════════════════

  const funcTabs = document.querySelectorAll('.func-tab');
  const funcScreenContents = document.querySelectorAll('.func-screen-content');
  const funcDescTexts = document.querySelectorAll('.func-desc-text');

  if (funcTabs.length > 0) {
    funcTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetFunc = tab.getAttribute('data-func');

        // Remove active from all tabs
        funcTabs.forEach(t => t.classList.remove('active'));
        // Add active to clicked tab
        tab.classList.add('active');

        // Switch screen content
        funcScreenContents.forEach(content => {
          content.classList.remove('active');
          if (content.getAttribute('data-func') === targetFunc) {
            content.classList.add('active');
          }
        });

        // Switch description
        funcDescTexts.forEach(desc => {
          desc.classList.remove('active');
          if (desc.getAttribute('data-func') === targetFunc) {
            desc.classList.add('active');
          }
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CONSOLE BRANDING
  // ═══════════════════════════════════════════════════════════════

  console.log(
    "%c✦ Logic Pocket by Peculiar",
    "color: #4ADE80; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);"
  );
  console.log(
    "%cConcept Product - Designed for Education",
    "color: #A0A0A0; font-size: 12px;"
  );
});
