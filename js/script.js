document.addEventListener('DOMContentLoaded', () => {
    // 3D Tilt Effect
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Reversed for natural feel
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Particle System (Canvas)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const particlesContainer = document.getElementById('particles-js');

    if (particlesContainer) {
        particlesContainer.appendChild(canvas);

        let width, height;
        let particles = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
                this.color = Math.random() > 0.5 ? 'rgba(255, 51, 51, ' : 'rgba(255, 100, 100, ';
                this.alpha = Math.random() * 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    // Glitch Text Randomizer (Optional extra flair)
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        setInterval(() => {
            const originalText = glitchText.getAttribute('data-text');
            // Occasionally glitch more
            if (Math.random() > 0.9) {
                glitchText.style.textShadow = `${Math.random() * 5 - 2.5}px ${Math.random() * 5 - 2.5}px red`;
                setTimeout(() => {
                    glitchText.style.textShadow = 'none';
                }, 100);
            }
        }, 2000);
    }
});

// Carousel Logic
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next-btn');
const prevButton = document.querySelector('.prev-btn');
const dotsNav = document.querySelector('.carousel-nav');
const dots = Array.from(dotsNav.children);

const slideWidth = slides[0].getBoundingClientRect().width;

// Arrange slides next to one another
const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
};
slides.forEach(setSlidePosition);

const moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
};

const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
};

const nextSlide = () => {
    const currentSlide = track.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling || slides[0];
    const currentDot = dotsNav.querySelector('.current-slide');
    const nextDot = nextSlide === slides[0] ? dots[0] : currentDot.nextElementSibling;

    moveToSlide(track, currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
};

nextButton.addEventListener('click', e => {
    nextSlide();
});

prevButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
    const currentDot = dotsNav.querySelector('.current-slide');
    const prevDot = prevSlide === slides[slides.length - 1] ? dots[dots.length - 1] : currentDot.previousElementSibling;

    moveToSlide(track, currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
});

// Autoplay
setInterval(nextSlide, 4000);

// Resize text adjustment
window.addEventListener('resize', () => {
    const newSlideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide, index) => {
        slide.style.left = newSlideWidth * index + 'px';
    });
    const currentSlide = track.querySelector('.current-slide');
    track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
});

// --- UPSELL POPUP LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // Helper function to append URL parameters
    const getRedirectUrl = (baseUrl) => {
        const params = window.location.search;
        if (params) {
            // If baseUrl has '?', replace the '?' in params with '&' (if appending to query string)
            // or just append if baseUrl doesn't have query params yet.
            // Simplified: Check if baseUrl has query params
            return baseUrl + (baseUrl.includes('?') ? params.replace('?', '&') : params);
        }
        return baseUrl;
    };

    const btn7Days = document.getElementById('btn-7-days'); // Agora é 3 meses
    const btnBasic = document.getElementById('btn-basic'); // 15 dias
    const upsellPopup = document.getElementById('upsellPopup');
    const btnAccept = document.getElementById('btn-upsell-accept');
    const btnDecline = document.getElementById('btn-upsell-decline');
    const btnFullCapa = document.getElementById('btn-full-capa'); // Vitalício

    // Handler for Main Offer (Vitalício)
    if (btnFullCapa) {
        btnFullCapa.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = getRedirectUrl("https://pay.sunize.com.br/XAdEpISo");
        });
    }

    // Handler for 3 meses
    if (btn7Days) {
        btn7Days.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = getRedirectUrl("https://pay.sunize.com.br/AyMbCZLy");
        });
    }

    // Handler for 15 dias
    if (btnBasic) {
        btnBasic.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = getRedirectUrl("https://pay.sunize.com.br/SlTgmCRq");
        });
    }

    // Upsell Popup Logic (opcional - pode remover se não usar mais)
    if (upsellPopup && btnAccept && btnDecline) {
        // Accept Offer
        btnAccept.addEventListener('click', () => {
            window.location.href = getRedirectUrl("https://pay.sunize.com.br/XAdEpISo");
        });

        // Decline Offer
        btnDecline.addEventListener('click', () => {
            window.location.href = getRedirectUrl("https://pay.sunize.com.br/SlTgmCRq");
        });

        // Close on background click
        upsellPopup.addEventListener('click', (e) => {
            if (e.target === upsellPopup) {
                upsellPopup.classList.remove('active');
            }
        });
    }
});

