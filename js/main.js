/* ========================================
   CarConnect OI — Main JavaScript
   ======================================== */

(function () {
    'use strict';

    // ========================================
    // HEADER — Sticky + Shrink on Scroll
    // ========================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ========================================
    // BURGER MENU
    // ========================================
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (burgerBtn && mobileNav) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ========================================
    // SCROLL REVEAL — IntersectionObserver
    // ========================================
    function initScrollReveal() {
        const elements = document.querySelectorAll('.scroll-reveal');
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach(el => observer.observe(el));
    }

    // ========================================
    // TESTIMONIALS SLIDER
    // ========================================
    function initTestimonialsSlider() {
        const track = document.querySelector('.testimonials__track');
        const cards = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('dots');

        if (!track || !cards.length) return;

        let currentIndex = 0;
        let autoplayInterval;
        let isPaused = false;

        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = (index + cards.length) % cards.length;
            updateSlider();
            resetAutoplay();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                if (!isPaused) nextSlide();
            }, 5000);
        }

        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }

        nextBtn.addEventListener('click', () => { nextSlide(); });
        prevBtn.addEventListener('click', () => { prevSlide(); });

        // Pause on hover
        const slider = document.getElementById('testimonialsSlider');
        slider.addEventListener('mouseenter', () => { isPaused = true; });
        slider.addEventListener('mouseleave', () => { isPaused = false; });

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isPaused = true;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
            isPaused = false;
        }, { passive: true });

        startAutoplay();
    }

    // ========================================
    // 3D TILT EFFECT ON CARDS
    // ========================================
    function initTiltEffect() {
        const cards = document.querySelectorAll('[data-tilt]');
        if (!cards.length) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    function initActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        function updateActiveLink() {
            const scrollY = window.scrollY + 200;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
    }

    // ========================================
    // BADGE ANIMATION
    // ========================================
    function initBadgeAnimation() {
        const favBtn = document.querySelector('.header__action-btn[aria-label="Favoris"]');
        const favBadge = document.getElementById('favBadge');
        const cartBtn = document.querySelector('.header__action-btn[aria-label="Panier"]');
        const cartBadge = document.getElementById('cartBadge');

        if (favBtn && favBadge) {
            favBtn.addEventListener('click', () => {
                let count = parseInt(favBadge.textContent);
                count = count === 0 ? 1 : 0;
                favBadge.textContent = count;
                favBadge.classList.toggle('visible', count > 0);
                favBtn.style.transform = 'scale(1.2)';
                setTimeout(() => { favBtn.style.transform = ''; }, 200);
            });
        }

        if (cartBtn && cartBadge) {
            cartBtn.addEventListener('click', () => {
                let count = parseInt(cartBadge.textContent);
                count = (count + 1) % 4;
                cartBadge.textContent = count;
                cartBadge.classList.toggle('visible', count > 0);
                cartBtn.style.transform = 'scale(1.2)';
                setTimeout(() => { cartBtn.style.transform = ''; }, 200);
            });
        }
    }

    // ========================================
    // INITIALIZE ALL
    // ========================================
    document.addEventListener('DOMContentLoaded', () => {
        initScrollReveal();
        initTestimonialsSlider();
        initTiltEffect();
        initActiveNavOnScroll();
        initBadgeAnimation();
    }); 

})();
