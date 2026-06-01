/* ==========================================================================
   1. SISTEM AUTO-HOVER MEMORABIL (SERVICES INDEX)
   ========================================================================== */
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

/* ==========================================================================
   2. EFECT DE TYPEWRITER (TASTATURĂ) 
   ========================================================================== */
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

/* ==========================================================================
   3. INIȚIALIZARE LENIS (SMOOTH SCROLL CU INERȚIE)
   ========================================================================== */
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
            lenis.scrollTo(targetElement);
        }
    });
});

/* ==========================================================================
   4. MOTOR PARALLAX GLOBAL RECTIV LA CURSOR (SMOOTH INTERACTIVE LERP)
   ========================================================================== */
const parallaxElements = document.querySelectorAll('.parallax-element');

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

/* --- PANOUL TĂU DE CONTROL PENTRU MIȘCAREA SITE-ULUI --- */
const easeFactor = 0.08;     // Fluiditate: Cu cât e mai mic (ex: 0.04), cu atât plutirea e mai leneșă și smooth
const maxDeplasare = 20;    // Amplitudine: Distanța maximă în pixeli pe care o pot parcurge elementele

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - window.innerWidth / 2;
    mouseY = e.clientY - window.innerHeight / 2;
});

function animateParallax() {
    targetX += (mouseX - targetX) * easeFactor;
    targetY += (mouseY - targetY) * easeFactor;

    parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 0.05;
        
        // Calculăm translația finală raportată la rezoluția ecranului și limita setată
        const xTranslation = (targetX / (window.innerWidth / 2)) * maxDeplasare * (speed * 10);
        const yTranslation = (targetY / (window.innerHeight / 2)) * maxDeplasare * (speed * 10);

        if (element.classList.contains('hero-center-title')) {
            element.style.transform = `translate(calc(-50% + ${xTranslation}px), calc(-50% + ${yTranslation}px))`;
        } else {
            element.style.transform = `translate3d(${xTranslation}px, ${yTranslation}px, 0)`;
        }
    });

    requestAnimationFrame(animateParallax);
}

if (window.matchMedia('(min-width: 1024px)').matches) {
    animateParallax();
}

/* ==========================================================================
   5. DETECTARE SCROLL PENTRU NAVBAR GLASSMORPHISM
   ========================================================================== */
const headerElement = document.querySelector('header');

if (headerElement && typeof lenis !== 'undefined') {
    lenis.on('scroll', (e) => {
        // Dacă scroll-ul trece de 20 de pixeli în jos, adăugăm clasa premium
        if (e.scroll > 20) {
            headerElement.classList.add('scrolled');
        } else {
            headerElement.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   6. INTERACTIVE KINETIC SERVICES ACCORDION ENGINE (ULTRA-SMOOTH)
   ========================================================================== */
const accordionItems = document.querySelectorAll('.services-accordion-item');

accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    
    // Inițializăm elementul marcat ca activ implicit la încărcarea paginii
    if (item.classList.contains('active') && content) {
        content.style.height = content.scrollHeight + 'px';
    }

    if (trigger && content) {
        trigger.addEventListener('click', () => {
            // Dacă utilizatorul apasă pe tab-ul deja deschis, nu facem nimic
            if (item.classList.contains('active')) return;
            
            // Închidem fluid elementul deschis anterior
            accordionItems.forEach(i => {
                if (i.classList.contains('active')) {
                    const activeContent = i.querySelector('.accordion-content');
                    if (activeContent) activeContent.style.height = '0px';
                    i.classList.remove('active');
                }
            });
            
            // Deschidem fluid elementul curent calculându-i înălțimea reală de randare
            item.classList.add('active');
            content.style.height = content.scrollHeight + 'px';
            
            // Notificăm motorul Lenis că structura paginii s-a extins pentru a recalcula scroll-ul cu inerție
            if (typeof lenis !== 'undefined') {
                setTimeout(() => { lenis.resize(); }, 150);
            }
        });
    }
});