const servicesContainer = document.querySelector('.hero-services-index ul');
const serviceItems = document.querySelectorAll('.hero-services-index li');

let currentIndex = 2; 
let autoHoverInterval = null;

function startAutoHover() {
    if (autoHoverInterval) return;

    autoHoverInterval = setInterval(() => {
        serviceItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % serviceItems.length;
        serviceItems[currentIndex].classList.add('active');
    }, 1000); 
}

function stopAutoHover() {
    clearInterval(autoHoverInterval);
    autoHoverInterval = null;
    serviceItems.forEach(item => item.classList.remove('active'));
}

serviceItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        currentIndex = index;
    });
});

if (servicesContainer) {
    servicesContainer.addEventListener('mouseenter', () => {
        stopAutoHover();
    });

    servicesContainer.addEventListener('mouseleave', () => {
        serviceItems[currentIndex].classList.add('active');
        startAutoHover();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startAutoHover();
});

const descElement = document.querySelector('.hero-description p');

if (descElement) {
    const fullText = descElement.textContent.trim();
    descElement.textContent = '';
    descElement.classList.add('typing-cursor');

    let charIndex = 0;
    const typingSpeed = 40; 

    function typeWriterEffect() {
        if (charIndex < fullText.length) {
            descElement.textContent += fullText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriterEffect, typingSpeed);
        }
    }
    
    setTimeout(typeWriterEffect, 1000);
}

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Dacă folosești Lenis, apelăm funcția sa nativă pentru scroll smooth
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(targetElement);
            } else {
                // Alternativă clasică dacă librăria nu este încărcată
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});