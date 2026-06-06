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

/* ==========================================================================
   7. DYNAMIC TESTIMONIALS ENGINE (STRIPE-STYLE)
   ========================================================================== */
const testimonialsData = [
    {
        quote: `"Our collaboration was smooth from start to finish. The team took time to understand our business goals, offered thoughtful creative solutions, and delivered a strong visual identity that truly reflects who we are."`,
        name: "Daniel Moore",
        role: "[Product Lead, Axis]"
    },
    {
        quote: `"Axiobyte transformed our legacy web structure into an elite interactive app. Performance skyrocketed by 40%, and their attention to minimalist details is simply unmatched in eastern Europe."`,
        name: "Marcus Vance",
        role: "[CTO, Vellum Infratech]"
    },
    {
        quote: `"Raw code combined with pure artistic direction. They do not work with basic templates—they build bulletproof custom software that positions your company as an elite premium leader."`,
        name: "Elena Rostova",
        role: "[Founder, Aurelia Lux]"
    },
    {
        quote: `"From strategy to deployment, the execution was laser-focused on metrics and user retention. Axiobyte is not just a digital agency; they are your tech co-founders."`,
        name: "Vasilică Gălușcă",
        role: "[Managing Director, Apex Digital]"
    }
];

const avatars = document.querySelectorAll('.avatar-item');
const quoteText = document.querySelector('.testimonial-quote-text');
const authorName = document.querySelector('.author-name');
const authorRole = document.querySelector('.author-role');

if (avatars.length > 0 && quoteText) {
    avatars.forEach(avatar => {
        avatar.addEventListener('click', () => {
            if (avatar.classList.contains('active')) return;

            const index = parseInt(avatar.getAttribute('data-index'));
            const data = testimonialsData[index];

            // Pasul 1: Trântim animația de retragere (fade-out)
            quoteText.classList.add('testimonial-fade-out');
            authorName.parentElement.classList.add('testimonial-fade-out');

            // Pasul 2: După 300ms schimbăm datele în fundal și facem fade-in înapoi
            setTimeout(() => {
                // Schimbăm clasa activă pe avatare
                avatars.forEach(av => av.classList.remove('active'));
                avatar.classList.add('active');

                // Înlocuim conținutul
                quoteText.textContent = data.quote;
                authorName.textContent = data.name;
                authorRole.textContent = data.role;

                // Eliminăm clasa ca textul să gliseze înapoi curat
                quoteText.classList.remove('testimonial-fade-out');
                authorName.parentElement.classList.remove('testimonial-fade-out');
            }, 300);
        });
    });
}

/* ==========================================================================
   MAGNETIC BUTTONS ENGINE (PREMIUM TACTILE FEEDBACK)
   ========================================================================== */
const magneticButtons = document.querySelectorAll('.btn-session, .avatar-item');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Împingem elementul discret cu 30% din distanța cursorului
        btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0) scale(1.05)`;
    });

    btn.addEventListener('mouseleave', () => {
        // Resetăm poziția când mouse-ul pleacă
        btn.style.transform = `translate3d(0, 0, 0) scale(1)`;
    });
});

/* ==========================================================================
   INTERSECTION OBSERVER FOR TYPOGRAPHY REVEAL
   ========================================================================== */
const textElementsToReveal = document.querySelectorAll('.manifest-title, .services-title-main, .testimonials-main-title');

textElementsToReveal.forEach(el => {
    el.classList.add('reveal-text-dynamic');
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target); // Animăm o singură dată pentru eleganță
        }
    });
}, { threshold: 0.15 });

textElementsToReveal.forEach(el => revealObserver.observe(el));

/* ==========================================================================
   8. INTERACTIVE SALES FORM ENGINE & PULSE GLOW
   ========================================================================== */
const formInputs = document.querySelectorAll('.sales-form input, .sales-form textarea');
const radialGlow = document.querySelector('.sales-radial-glow');
const leadForm = document.getElementById('axiobyte-lead-form');

if (formInputs.length > 0 && radialGlow) {
    formInputs.forEach(input => {
        // Când dă click să scrie, mărim glow-ul din spate ca o reacție chimică
        input.addEventListener('focus', () => {
            radialGlow.style.background = 'radial-gradient(circle, rgba(255, 114, 55, 0.14) 0%, rgba(255, 114, 55, 0) 65%)';
        });

        // Când iese din input, revenim la glow-ul discret de bază
        input.addEventListener('blur', () => {
            radialGlow.style.background = 'radial-gradient(circle, rgba(255, 114, 55, 0.08) 0%, rgba(255, 114, 55, 0) 65%)';
        });
    });
}

// Micro-interacțiune la trimiterea cu succes a mesajului
if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = leadForm.querySelector('.btn-submit-sales');
        const btnText = submitBtn.querySelector('.btn-text');
        
        if (btnText) {
            btnText.textContent = "Transmission successful.";
            submitBtn.style.backgroundColor = "#ffffff";
            btnText.style.color = "#050505";
            leadForm.reset();
            
            setTimeout(() => {
                btnText.textContent = "Send message";
                submitBtn.style.backgroundColor = "var(--accent-orange-acid)";
            }, 3000);
        }
    });
}

/* ==========================================================================
   9. INTERACTIVE INTERFACE: PROJECT PLANNER CHIPS ENGINE
   ========================================================================== */
const projectChips = document.querySelectorAll('.chip-item');
const projectTypeInput = document.getElementById('selected-project-type');
const budgetInput = document.getElementById('selected-budget');

if (projectChips.length > 0) {
    projectChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const isBudget = chip.classList.contains('budget-chip');

            if (isBudget) {
                const siblingBudgetChips = document.querySelectorAll('.budget-chip');
                siblingBudgetChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                if (budgetInput) budgetInput.value = chip.getAttribute('data-value');
            } else {
                chip.classList.toggle('active');
                

                const activeProjectTypes = Array.from(document.querySelectorAll('.chip-item[data-type="project-type"].active'))
                                                .map(c => c.getAttribute('data-value'));
                if (projectTypeInput) projectTypeInput.value = activeProjectTypes.join(', ');
            }
        });
    });
}

/* ==========================================================================
   10. MOBILE HAMBURGER MENU ENGINE
   ========================================================================== */
const hamburgerBtn = document.getElementById('hamburger-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            if (targetElement && typeof lenis !== 'undefined') {
                setTimeout(() => { lenis.scrollTo(targetElement); }, 300);
            }
        });
    });
}