/* ==========================================================================
   ANIMAȚIE INTERACTIVĂ: CUSTOM CURSOR ENGINE (HOVER & CLICK DETECT)
   ========================================================================== */
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorOutline = document.querySelector('.custom-cursor-outline');

if (cursorDot && cursorOutline) {
    // 1. Urmărirea poziției mouse-ului în timp real
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        cursorOutline.style.left = e.clientX + 'px';
        cursorOutline.style.top = e.clientY + 'px';
    });

    // 2. Efectul de CLICK pe toată pagina
    window.addEventListener('mousedown', () => {
        cursorOutline.classList.add('cursor-click');
    });
    
    window.addEventListener('mouseup', () => {
        cursorOutline.classList.remove('cursor-click');
    });


    const refreshHoverTargets = () => {
        const targets = document.querySelectorAll('a, button, .chip-item, .avatar-item, .accordion-trigger, input, textarea');
        
        targets.forEach(target => {

            target.removeEventListener('mouseenter', addHover);
            target.removeEventListener('mouseleave', removeHover);
            
            target.addEventListener('mouseenter', addHover);
            target.addEventListener('mouseleave', removeHover);
        });
    };

    function addHover() {
        cursorOutline.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
    }

    function removeHover() {
        cursorOutline.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
    }


    refreshHoverTargets();
    

}

    const refreshHoverTargets = () => {
        const targets = document.querySelectorAll(
            'a, button, .chip-item, .avatar-item, .accordion-trigger, .gallery-card, .client-logo-card, input, textarea'
        );
        
        targets.forEach(target => {
            target.removeEventListener('mouseenter', addHover);
            target.removeEventListener('mouseleave', removeHover);
            
            target.addEventListener('mouseenter', addHover);
            target.addEventListener('mouseleave', removeHover);
        });
    };

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

/* ==========================================================================
   AXIOBYTE CINEMATIC PRELOADER ENGINE // SECURED & ISOLATED
   ========================================================================== */
(function() {
    // Forțăm oprirea scroll-ului instantaneu, chiar înainte de citirea completă a paginii
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    window.addEventListener('DOMContentLoaded', () => {
        const preloader = document.getElementById('axiobyte-preloader');
        const percentText = document.getElementById('loader-percentage');
        const progressBar = document.querySelector('.preloader-bar');
        
        if (!preloader || !percentText) {
            // FAILING SAFE: Dacă elementele nu există în HTML, dăm drumul la scroll direct
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            return;
        }

        let currentPercent = 0;

        // FUNCȚIA MASTER DE RIDICARE A CORTINEI
        const removePreloader = () => {
            preloader.classList.add('loaded');
            // Redăm scroll-ul înapoi pe tot site-ul
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };

        // MOTORUL RECURSIV DE NUMĂRARE
        const runCounter = () => {
            // Pas de incrementare rapid și organic
            let increment = Math.floor(Math.random() * 6) + 2; 
            currentPercent += increment;

            if (currentPercent >= 100) {
                currentPercent = 100;
                percentText.textContent = "100";
                if (progressBar) progressBar.style.width = "100%";
                
                // Scurtă pauză dramatică la 100% înainte de deschidere
                setTimeout(removePreloader, 500);
            } else {
                percentText.textContent = currentPercent < 10 ? "0" + currentPercent : currentPercent;
                if (progressBar) progressBar.style.width = currentPercent + "%";
                
                // Delay variabil fluid pentru viteză cinematică
                let adaptiveDelay = Math.floor(Math.random() * 30) + 15;
                setTimeout(runCounter, adaptiveDelay);
            }
        };

        // Pornim numărătoarea imediat
        runCounter();

        // REZERVĂ CRITICĂ DE SIGURANȚĂ (FAILSAFE SYSTEM):
        // Dacă din cauza unui script extern sau a unei erori contorul se blochează,
        // forțăm deschiderea site-ului după exact 3 secunde, ca să nu piardă niciun client interfața.
        setTimeout(() => {
            if (!preloader.classList.contains('loaded')) {
                console.warn("Axiobyte Failsafe triggered: Preloader forced close.");
                percentText.textContent = "100";
                if (progressBar) progressBar.style.width = "100%";
                removePreloader();
            }
        }, 3000);
    });
})();

/* ==========================================================================
   ANIMAȚIE 3: UNIFIED LENIS SMOOTH SCROLL & KINETIC SKEW DISTORTION
   ========================================================================== */
(function() {
    // Verificăm dacă biblioteca externă Lenis a fost încărcată corect din scriptul tău de sus
    if (typeof Lenis !== 'undefined') {
        
        // 1. Inițializăm instanța master globală de scroll fluid
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curbă fluidă premium
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1
        });

        // O salvăm pe fereastră pentru a putea fi accesată de alte scripturi dacă e nevoie
        window.lenis = lenis;

        // 2. Selectăm cardurile din galerie pe care vrem să le deformăm elastic
        const galleryCards = document.querySelectorAll('.gallery-card');

        if (galleryCards.length > 0) {
            // Ascultăm evenimentul de scroll în timp real din motorul Lenis
            lenis.on('scroll', (attributes) => {
                // Extragere viteză curentă
                let currentSpeed = attributes.velocity;
                
                // Limităm viteza (clamp) ca să nu strâmbăm imaginile exagerat la un scroll violent
                let clampedSpeed = Math.min(Math.max(currentSpeed, -12), 12);
                
                // Împărțim la 45 pentru a obține un unghi de înclinare fin și extrem de luxos
                let finalAngle = clampedSpeed * 0.3;

                // Aplicăm deformarea geometrică pe fiecare card din carusel
                galleryCards.forEach(card => {
                    card.style.transform = `skewY(${finalAngle}deg)`;
                });
            });

            // Când utilizatorul ridică degetul de pe mouse și scroll-ul se oprește complet,
            // forțăm cardurile să facă snap-back la unghiuri drepte perfecte
            lenis.on('scrollEnd', () => {
                galleryCards.forEach(card => {
                    card.style.transform = 'skewY(0deg)';
                });
            });
        }

        // 3. Bucla obligatorie de animație RequestAnimationFrame (RAF) pentru randare continuă
        function updateScroll(time) {
            lenis.raf(time);
            requestAnimationFrame(updateScroll);
        }
        requestAnimationFrame(updateScroll);
    } else {
        console.warn("Axiobyte Warning: Lenis library was not detected globaly.");
    }
})();



/* ==========================================================================
   AXIOBYTE CLEAN ENGINE // UNIFIED INTERACTIVE JAVASCRIPT
   ========================================================================== */

// --- 1. ENGINE: CINEMATIC PRELOADER (00% - 100%) ---
(function() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    window.addEventListener('DOMContentLoaded', () => {
        const preloader = document.getElementById('axiobyte-preloader');
        const percentText = document.getElementById('loader-percentage');
        const progressBar = document.querySelector('.preloader-bar');
        
        if (!preloader || !percentText) {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            return;
        }

        let currentPercent = 0;

        const removePreloader = () => {
            preloader.classList.add('loaded');
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };

        const runCounter = () => {
            let increment = Math.floor(Math.random() * 6) + 2; 
            currentPercent += increment;

            if (currentPercent >= 100) {
                currentPercent = 100;
                percentText.textContent = "100";
                if (progressBar) progressBar.style.width = "100%";
                setTimeout(removePreloader, 500);
            } else {
                percentText.textContent = currentPercent < 10 ? "0" + currentPercent : currentPercent;
                if (progressBar) progressBar.style.width = currentPercent + "%";
                let adaptiveDelay = Math.floor(Math.random() * 30) + 15;
                setTimeout(runCounter, adaptiveDelay);
            }
        };

        runCounter();

        // FAILSAFE SAFEGUARD (3 secunde max)
        setTimeout(() => {
            if (!preloader.classList.contains('loaded')) {
                percentText.textContent = "100";
                if (progressBar) progressBar.style.width = "100%";
                removePreloader();
            }
        }, 3000);
    });
})();

// --- 2. ENGINE: CUSTOM INTERACTIVE CURSOR & LYNIS SKEW & ELEMENTS ---
document.addEventListener('DOMContentLoaded', () => {
    
    // INSTANȚIERE CURSOR INTERACTIV
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
        });

        window.addEventListener('mousedown', () => cursorOutline.classList.add('cursor-click'));
        window.addEventListener('mouseup', () => cursorOutline.classList.remove('cursor-click'));

        const refreshHoverTargets = () => {
            const targets = document.querySelectorAll('a, button, .chip-item, .avatar-item, .accordion-trigger, .gallery-card, input, textarea');
            targets.forEach(target => {
                target.addEventListener('mouseenter', () => {
                    cursorOutline.classList.add('cursor-hover');
                    cursorDot.classList.add('cursor-hover');
                });
                target.addEventListener('mouseleave', () => {
                    cursorOutline.classList.remove('cursor-hover');
                    cursorDot.classList.remove('cursor-hover');
                });
            });
        };
        refreshHoverTargets();
    }

    // --- 3. ENGINE: UNIFIED LENIS SMOOTH SCROLL & KINETIC SKEW ---
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true
        });
        window.lenis = lenis;

        const galleryCards = document.querySelectorAll('.gallery-card');
        if (galleryCards.length > 0) {
            lenis.on('scroll', (attributes) => {
                let clampedSpeed = Math.min(Math.max(attributes.velocity, -12), 12);
                let finalAngle = clampedSpeed * 0.3;
                galleryCards.forEach(card => card.style.transform = `skewY(${finalAngle}deg)`);
            });

            lenis.on('scrollEnd', () => {
                galleryCards.forEach(card => card.style.transform = 'skewY(0deg)');
            });
        }

        function updateScroll(time) {
            lenis.raf(time);
            requestAnimationFrame(updateScroll);
        }
        requestAnimationFrame(updateScroll);
    }

    // --- 4. ENGINE: FLOATING MAGNETIC BUTTON (.btn-session) ---
    const magneticButton = document.querySelector('.btn-session');
    if (magneticButton) {
        window.addEventListener('mousemove', (e) => {
            const rect = magneticButton.getBoundingClientRect();
            const btnCenterX = rect.left + rect.width / 2;
            const btnCenterY = rect.top + rect.height / 2;
            const deltaX = e.clientX - btnCenterX;
            const deltaY = e.clientY - btnCenterY;
            const distance = Math.hypot(deltaX, deltaY);

            if (distance < 90) {
                const targetX = deltaX * 0.35;
                const targetY = deltaY * 0.35;
                magneticButton.style.transition = 'none';
                magneticButton.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
                magneticButton.style.color = 'var(--accent-orange-acid)';
            } else {
                magneticButton.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease';
                magneticButton.style.transform = 'translate3d(0, 0, 0)';
                magneticButton.style.color = '';
            }
        });
    }

    // --- 5. ENGINE: SCROLL INDICATOR KINETIC ROTATING STAMP ---
    const stamp = document.querySelector('.axiobyte-scroll-stamp');
    const stampSvg = document.querySelector('.stamp-svg');
    
    if (stamp && stampSvg) {
        let currentRotation = 0;
        let baseVelocity = 0.5;

        const rotateStamp = () => {
            let scrollVelocity = (window.lenis) ? window.lenis.velocity : 0;
            let targetVelocity = baseVelocity + Math.abs(scrollVelocity) * 0.8;
            currentRotation += targetVelocity;
            stampSvg.style.transform = `rotate3d(0, 0, 1, ${currentRotation}deg)`;
            requestAnimationFrame(rotateStamp);
        };
        requestAnimationFrame(rotateStamp);

        if (window.lenis) {
            window.lenis.on('scroll', (e) => {
                if (e.scroll > 150) {
                    stamp.classList.add('fade-out');
                } else {
                    stamp.classList.remove('fade-out');
                }
            });
        }
    }
});

/* ==========================================================================
   REPARAT: MAGNETIC AVATAR ENGINE CU IZOLARE LA HOVER (FĂRĂ SUPRAPUNERI)
   ========================================================================== */
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const avatars = document.querySelectorAll('.avatar-item');

        if (avatars.length > 0) {
            avatars.forEach(avatar => {
                
                // 1. ÎN TIMP CE MOUSE-UL SE MIȘCĂ ÎN INTERIORUL AVATARULUI
                avatar.addEventListener('mousemove', (e) => {
                    const rect = avatar.getBoundingClientRect();
                    
                    // Centrul avatarului pe care suntem cu mouse-ul direct
                    const avatarCenterX = rect.left + rect.width / 2;
                    const avatarCenterY = rect.top + rect.height / 2;

                    const deltaX = e.clientX - avatarCenterX;
                    const deltaY = e.clientY - avatarCenterY;

                    // Mișcăm DOAR avatarul curent pe care stă fizic mouse-ul
                    const targetX = deltaX * 0.3;
                    const targetY = deltaY * 0.3;

                    avatar.style.transition = 'none';
                    // Îi dăm un z-index uriaș ca să treacă vizual PESTE celelalte din stânga/dreapta
                    avatar.style.zIndex = '99'; 
                    avatar.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(1.05)`; // Un micro-zoom adaugă realism
                });

                // 2. CÂND MOUSE-UL PĂRĂSEȘTE AVATARUL CURENT
                avatar.addEventListener('mouseleave', () => {
                    // Îl punem înapoi la loc elastic și îi resetăm z-index-ul nativ după ce se termină mișcarea
                    avatar.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    avatar.style.transform = 'translate3d(0, 0, 0) scale(1)';
                    
                    // Resetăm z-index-ul după o fracțiune de secundă ca să nu pice sub celelalte brusc
                    setTimeout(() => {
                        avatar.style.zIndex = '';
                    }, 100);
                });
            });
        }
    });
})();