document.addEventListener('DOMContentLoaded', () => {
    handlePreloader();
    
    loadConfig();
    setupMobileMenu();
    setupDropdownToggle();
    setupScrollAnimations();
    setupHeroSlider();
    
    // Determine which page we are on and load appropriate data
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        loadLatestNews();
        loadFeaturedPotency();
        setupStatsCounter();
    } else if (path.includes('potency.html')) {
        loadAllPotency();
    } else if (path.includes('umkm.html')) {
        loadUMKM();
    } else if (path.includes('tourism.html')) {
        loadTourism();
    } else if (path.includes('posyandu.html')) {
        loadPosyandu();
    } else if (path.includes('gallery.html')) {
        loadGallery();
        setupGalleryHeroSlider();
    } else if (path.includes('news-detail.html')) {
        loadNewsDetail();
    } else if (path.includes('contact.html')) {
        // Contact page specific logic if needed
    }
});

function setupHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.hero-dot');
    const prevBtn = slider.querySelector('.hero-prev');
    const nextBtn = slider.querySelector('.hero-next');

    if (!slides.length) return;

    let currentIndex = 0;
    let intervalId;

    const setActiveSlide = (index) => {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.remove('active');
        }

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    };

    const nextSlide = () => {
        setActiveSlide(currentIndex + 1);
    };

    const prevSlide = () => {
        setActiveSlide(currentIndex - 1);
    };

    const stopAutoSlide = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    const startAutoSlide = () => {
        stopAutoSlide();
        intervalId = setInterval(nextSlide, 5000);
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide();
        });
    }

    if (dots.length) {
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'), 10);
                if (!isNaN(index) && index !== currentIndex) {
                    setActiveSlide(index);
                    startAutoSlide();
                }
            });
        });
    }

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
}

// Hero slider khusus halaman galeri (gambar dari data/gallery.json)
async function setupGalleryHeroSlider() {
    const slider = document.querySelector('.hero-slider-gallery');
    if (!slider) return;

    try {
        const response = await fetch('data/gallery.json');
        const data = await response.json();

        if (!Array.isArray(data) || !data.length) return;

        // Buat slide dari semua gambar galeri
        slider.innerHTML = data.map((item, index) => `
            <div class="hero-slide${index === 0 ? ' active' : ''}" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${item.image}');"></div>
        `).join('');

        const slides = slider.querySelectorAll('.hero-slide');
        if (!slides.length) return;

        let currentIndex = 0;
        let intervalId;

        const setActiveSlide = (index) => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
        };

        const nextSlide = () => {
            setActiveSlide(currentIndex + 1);
        };

        const startAutoSlide = () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            intervalId = setInterval(nextSlide, 3000);
        };

        const stopAutoSlide = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        startAutoSlide();
    } catch (error) {
        console.error('Error setting up gallery hero slider:', error);
    }
}

// Preloader Handler
function handlePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Wait a bit to ensure smooth transition
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                
                // Trigger initial animations
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.classList.add('fade-in-up');
                }
            }, 500);
        });
    }
}

// Scroll Animations (Intersection Observer)
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements to animate
    const animatedElements = document.querySelectorAll('.card, .feature-card, .section-title, .stat-item, footer');
    animatedElements.forEach((el, index) => {
        // Add delay classes based on index (modulo 4 for pattern)
        const delayClass = `delay-${((index % 4) + 1) * 100}`;
        el.classList.add(delayClass);
        observer.observe(el);
    });
}

// Stats Counter Animation
function setupStatsCounter() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = document.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Load site configuration (name, footer info, etc.)
async function loadConfig() {
    try {
        const response = await fetch('data/config.json');
        const config = await response.json();
        
        // Update site title and logo text
        document.title = config.siteName;
        const logoElement = document.querySelector('.logo');
        if (logoElement) logoElement.innerHTML = `<i class="fas fa-landmark"></i> ${config.siteName}`;
        
        // Update footer info
        const addressEl = document.getElementById('footer-address');
        const phoneEl = document.getElementById('footer-phone');
        const emailEl = document.getElementById('footer-email');
        const descriptionEl = document.getElementById('footer-desc');
        
        if (addressEl) addressEl.textContent = config.address;
        if (phoneEl) phoneEl.textContent = config.phone;
        if (emailEl) emailEl.textContent = config.email;
        if (descriptionEl) descriptionEl.textContent = config.description;

        // Update Social Media Links
        if (config.socialMedia) {
            const fbLink = document.getElementById('social-fb');
            const igLink = document.getElementById('social-ig');
            const ytLink = document.getElementById('social-yt');

            if (fbLink) fbLink.href = config.socialMedia.facebook;
            if (igLink) igLink.href = config.socialMedia.instagram;
            if (ytLink) ytLink.href = config.socialMedia.youtube;
        }

    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately due to document click
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// Dropdown Toggle (Click based for all devices)
function setupDropdownToggle() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector('.dropdown-toggle');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent closing immediately
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
}


// Load Latest News for Homepage
async function loadLatestNews() {
    const newsContainer = document.getElementById('latest-news-grid');
    if (!newsContainer) return;

    try {
        const response = await fetch('data/news.json');
        const news = await response.json();
        
        // Take only first 3 items
        const latestNews = news.slice(0, 3);
        
        newsContainer.innerHTML = latestNews.map((item, index) => `
            <div class="card fade-in-up delay-${(index + 1) * 100}">
                <img src="${item.image}" alt="${item.title}" class="card-img">
                <div class="card-content">
                    <div class="card-meta">${formatDate(item.date)}</div>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-text">${item.summary}</p>
                    <a href="news-detail.html?id=${item.id}" class="read-more">Baca Selengkapnya &rarr;</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading news:', error);
        newsContainer.innerHTML = '<p>Gagal memuat berita.</p>';
    }
}

async function loadNewsDetail() {
    const container = document.getElementById('news-detail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (!id || Number.isNaN(id)) {
        container.innerHTML = '<p>Berita tidak ditemukan.</p>';
        return;
    }

    try {
        const response = await fetch('data/news.json');
        const news = await response.json();
        const item = Array.isArray(news) ? news.find(n => n.id === id) : null;

        if (!item) {
            container.innerHTML = '<p>Berita tidak ditemukan.</p>';
            return;
        }

        container.innerHTML = `
            <div class="card">
                <img src="${item.image}" alt="${item.title}" class="card-img">
                <div class="card-content">
                    <div class="card-meta">${formatDate(item.date)}</div>
                    <h1 class="card-title" style="margin-bottom: 1rem;">${item.title}</h1>
                    <p class="card-text" style="white-space: pre-line;">${item.content}</p>
                    <a href="index.html" class="read-more" style="margin-top: 1.5rem; display: inline-block;">&larr; Kembali ke Beranda</a>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading news detail:', error);
        container.innerHTML = '<p>Gagal memuat detail berita.</p>';
    }
}

// Load Featured Potency for Homepage
async function loadFeaturedPotency() {
    const potencyContainer = document.getElementById('featured-potency-grid');
    if (!potencyContainer) return;

    try {
        const response = await fetch('data/potency.json');
        const potency = await response.json();
        
        // Take only first 3 items
        const featuredPotency = potency.slice(0, 3);
        
        potencyContainer.innerHTML = featuredPotency.map((item, index) => `
            <div class="card fade-in-up delay-${(index + 1) * 100}">
                <img src="${item.image}" alt="${item.title}" class="card-img">
                <div class="card-content">
                    <span class="card-meta" style="color: var(--secondary-color); font-weight: bold;">${item.category}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-text">${item.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading potency:', error);
        potencyContainer.innerHTML = '<p>Gagal memuat data potensi.</p>';
    }
}

// Load All Potency for Potency Page
async function loadAllPotency() {
    const potencyContainer = document.getElementById('all-potency-grid');
    if (!potencyContainer) return;

    try {
        const response = await fetch('data/potency.json');
        const potency = await response.json();
        
        potencyContainer.innerHTML = potency.map((item, index) => `
            <div class="card fade-in-up delay-${(index % 4 + 1) * 100}">
                <img src="${item.image}" alt="${item.title}" class="card-img">
                <div class="card-content">
                    <span class="card-meta" style="color: var(--secondary-color); font-weight: bold;">${item.category}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-text">${item.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading potency:', error);
        potencyContainer.innerHTML = '<p>Gagal memuat data potensi.</p>';
    }
}

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Load UMKM Data
async function loadUMKM() {
    const container = document.getElementById('umkm-grid');
    if (!container) return;

    try {
        const response = await fetch('data/umkm.json');
        const data = await response.json();
        
        container.innerHTML = data.map((item, index) => `
            <div class="card fade-in-up delay-${(index % 4 + 1) * 100}">
                <img src="${item.image}" alt="${item.name}" class="card-img">
                <div class="card-content">
                    <span class="card-meta" style="color: var(--secondary-color); font-weight: bold;">${item.category}</span>
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-text" style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;"><i class="fas fa-user"></i> ${item.owner}</p>
                    <p class="card-text">${item.description}</p>
                    <div style="margin-top: 1rem; border-top: 1px solid #eee; padding-top: 0.5rem; font-size: 0.9rem;">
                        <p><i class="fas fa-phone"></i> ${item.contact}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${item.address}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading UMKM:', error);
        container.innerHTML = '<p>Gagal memuat data UMKM.</p>';
    }
}

// Load Tourism Data
async function loadTourism() {
    const container = document.getElementById('tourism-grid');
    if (!container) return;

    try {
        const response = await fetch('data/tourism.json');
        const data = await response.json();
        
        container.innerHTML = data.map((item, index) => `
            <div class="card fade-in-up delay-${(index % 4 + 1) * 100}">
                <img src="${item.image}" alt="${item.name}" class="card-img">
                <div class="card-content">
                    <span class="card-meta" style="color: var(--secondary-color); font-weight: bold;">${item.category}</span>
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-text">${item.description}</p>
                    <div style="margin-top: 1rem;">
                        <strong>Fasilitas:</strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
                            ${item.facilities.map(f => `<span style="background: var(--light-bg); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${f}</span>`).join('')}
                        </div>
                    </div>
                    <div style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                        <i class="fas fa-map-pin"></i> ${item.location}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading tourism:', error);
        container.innerHTML = '<p>Gagal memuat data wisata.</p>';
    }
}

// Load Posyandu Data
async function loadPosyandu() {
    const descContainer = document.getElementById('posyandu-desc');
    const scheduleContainer = document.getElementById('posyandu-schedules');
    const galleryContainer = document.getElementById('posyandu-gallery');

    try {
        const response = await fetch('data/posyandu.json');
        const data = await response.json();
        
        if (descContainer) descContainer.innerText = data.description;

        if (scheduleContainer) {
            scheduleContainer.innerHTML = data.schedules.map((item, index) => `
                <div class="card fade-in-up delay-${(index % 4 + 1) * 100}" style="border-left: 5px solid var(--secondary-color);">
                    <div class="card-content">
                        <h3 class="card-title" style="color: var(--secondary-color);">${item.name}</h3>
                        <div style="margin-bottom: 0.5rem; font-weight: bold;">
                            <i class="far fa-calendar-alt"></i> ${item.day}, ${item.week}
                        </div>
                        <div style="margin-bottom: 0.5rem;">
                            <i class="far fa-clock"></i> ${item.time}
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <i class="fas fa-map-marker-alt"></i> ${item.location}
                        </div>
                        <div>
                            <strong>Kegiatan:</strong>
                            <ul style="padding-left: 1.2rem; margin-top: 0.5rem;">
                                ${item.activities.map(act => `<li>${act}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        if (galleryContainer) {
            galleryContainer.innerHTML = data.gallery.map((img, index) => `
                <div class="card fade-in-up delay-${(index % 4 + 1) * 100}">
                    <img src="${img}" alt="Kegiatan Posyandu" class="card-img" style="height: 250px;">
                </div>
            `).join('');
        }

    } catch (error) {
        console.error('Error loading posyandu:', error);
        if (scheduleContainer) scheduleContainer.innerHTML = '<p>Gagal memuat data posyandu.</p>';
    }
}

// Load Gallery Data
async function loadGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;

    try {
        const response = await fetch('data/gallery.json');
        const data = await response.json();
        
        container.innerHTML = data.map((item, index) => `
            <div class="card fade-in-up delay-${(index % 4 + 1) * 100}">
                <img src="${item.image}" alt="${item.title}" class="card-img" style="height: 250px;">
                <div class="card-content">
                    <div class="card-meta"><i class="far fa-calendar-alt"></i> ${formatDate(item.date)}</div>
                    <h3 class="card-title">${item.title}</h3>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading gallery:', error);
        container.innerHTML = '<p>Gagal memuat galeri kegiatan.</p>';
    }
}
