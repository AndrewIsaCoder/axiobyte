/* ==========================================================================
   ANIMAȚIE INTERACTIVĂ: CUSTOM CURSOR ENGINE (HOVER & CLICK DETECT)
   ========================================================================== */
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorOutline = document.querySelector('.custom-cursor-outline');

if (cursorDot && cursorOutline) {
    let cursorActive = false;

    // 1. Urmărirea poziției mouse-ului în timp real
    window.addEventListener('mousemove', (e) => {
        if (!cursorActive) {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            cursorActive = true;
        }
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        cursorOutline.style.left = e.clientX + 'px';
        cursorOutline.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
        cursorActive = false;
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        cursorActive = true;
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
            // Dacă utilizatorul apasă pe tab-ul deja deschis, îl închidem (toggle-off)
            if (item.classList.contains('active')) {
                content.style.height = '0px';
                item.classList.remove('active');
                if (typeof lenis !== 'undefined') {
                    setTimeout(() => { lenis.resize(); }, 150);
                }
                return;
            }
            
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

// Micro-interacțiune și trimitere funcțională a formularului via Web3Forms
if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = leadForm.querySelector('.btn-submit-sales');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        const formFeedback = document.getElementById('form-feedback');
        const interactiveInputs = leadForm.querySelectorAll('input[type="text"], input[type="email"], textarea');
        
        // Activăm clasa de trimitere pe formular (pentru blocare din CSS)
        leadForm.classList.add('submitting');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('submitting');
        }
        if (btnText) {
            btnText.textContent = "TRANSMITTING...";
        }
        
        // Resetăm stările anterioare ale feedback-ului
        if (formFeedback) {
            formFeedback.classList.remove('success', 'error', 'show');
            formFeedback.textContent = '';
        }
        
        // Colectăm datele din formular
        const formData = new FormData(leadForm);
        const dataObject = Object.fromEntries(formData);
        
        // Trimitem prin AJAX către endpoint-ul Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataObject)
        })
        .then(async (response) => {
            const result = await response.json();
            if (response.status === 200 && result.success) {
                // Succes!
                if (submitBtn) {
                    submitBtn.classList.remove('submitting');
                    submitBtn.classList.add('success');
                }
                if (btnText) {
                    btnText.textContent = "TRANSMISSION SUCCESSFUL";
                }
                if (formFeedback) {
                    formFeedback.textContent = "Thank you! Your message has been sent successfully. We'll get back to you shortly.";
                    formFeedback.classList.add('success', 'show');
                }
                
                // Resetează datele formularului
                leadForm.reset();
                
                // Resetează vizual chip-urile active
                const activeChips = leadForm.querySelectorAll('.chip-item.active');
                activeChips.forEach(chip => chip.classList.remove('active'));
            } else {
                throw new Error(result.message || "Submission failed. Please check your details.");
            }
        })
        .catch((error) => {
            console.error('Form submission error:', error);
            if (submitBtn) {
                submitBtn.classList.remove('submitting');
                submitBtn.classList.add('error');
            }
            if (btnText) {
                btnText.textContent = "TRANSMISSION FAILED";
            }
            if (formFeedback) {
                formFeedback.textContent = error.message || "Failed to send message. Please try again later.";
                formFeedback.classList.add('error', 'show');
            }
        })
        .finally(() => {
            // Permitem din nou interacțiunea după un scurt delay, revenind la starea inițială
            setTimeout(() => {
                leadForm.classList.remove('submitting');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success', 'error');
                }
                if (btnText) {
                    btnText.textContent = "Send message";
                }
                
                // Ascundem mesajul de succes după un timp, dar lăsăm erorile vizibile pentru a fi citite
                if (formFeedback && formFeedback.classList.contains('success')) {
                    setTimeout(() => {
                        formFeedback.classList.remove('show');
                    }, 3000);
                }
            }, 3500);
        });
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
   AXIOBYTE CINEMATIC PRELOADER ENGINE // SECURED & ISOLATED (VIDEO INTRO EDITION)
   ========================================================================== */
(function() {
    // Forțăm oprirea scroll-ului instantaneu, chiar înainte de citirea completă a paginii
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    window.addEventListener('DOMContentLoaded', () => {
        const preloader = document.getElementById('axiobyte-preloader');
        const percentText = document.getElementById('loader-percentage');
        const progressBar = document.querySelector('.pl-progress-fill');
        const video = document.getElementById('preloader-video');
        const skipBtn = document.getElementById('skip-preloader-btn');

        if (!preloader || !percentText) {
            // FAILING SAFE: Dacă elementele nu există în HTML, dăm drumul la scroll direct
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            return;
        }

        let currentPercent = 0;
        let isLoaded = false;
        let videoStarted = false;

        const updateProgressUI = (percentage) => {
            currentPercent = percentage;
            percentText.textContent = currentPercent < 10 ? "0" + currentPercent : currentPercent;
            if (progressBar) progressBar.style.width = currentPercent + "%";
        };

        // FUNCȚIA MASTER DE RIDICARE A CORTINEI
        const removePreloader = () => {
            if (isLoaded) return;
            isLoaded = true;

            // Salvăm în sessionStorage faptul că intro-ul a fost vizualizat în această sesiune
            sessionStorage.setItem('axiobyte_intro_played', 'true');

            preloader.classList.add('loaded');
            
            // Oprim videoclipul ca să eliberăm resursele
            if (video) {
                video.pause();
            }

            // Redăm scroll-ul înapoi pe tot site-ul
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };

        // Verificăm dacă utilizatorul a vizitat deja site-ul în această sesiune (Session Bypass)
        // NOTĂ DE DEZVOLTARE: Am dezactivat temporar acest check (hasPlayedThisSession = false)
        // ca să poți testa intro-ul video la fiecare refresh.
        // Pentru producție, reactivează linia de mai jos prin stergerea comentariului.
        const hasPlayedThisSession = false; // sessionStorage.getItem('axiobyte_intro_played') === 'true';

        if (hasPlayedThisSession) {
            // Secvență ultra-rapidă de boot pentru UX optim la navigări secundare
            if (video) video.style.display = 'none';
            let fastPercent = 0;
            const runFastCounter = () => {
                fastPercent += Math.floor(Math.random() * 15) + 12;
                if (fastPercent >= 100) {
                    updateProgressUI(100);
                    setTimeout(removePreloader, 200);
                } else {
                    updateProgressUI(fastPercent);
                    setTimeout(runFastCounter, 40);
                }
            };
            runFastCounter();
            return;
        }

        // --- PORNIRE NUMĂRĂTOARE STANDARD ---
        // Pasul 1: Buffering (0% - 30%) - Crește progresiv până când videoclipul este gata de redare
        let bufferingInterval = setInterval(() => {
            if (videoStarted) {
                clearInterval(bufferingInterval);
                return;
            }
            if (currentPercent < 30) {
                updateProgressUI(currentPercent + 1);
            }
        }, 80);

        // Declanșăm redarea imediat ce browserul indică faptul că poate rula clipul
        const startVideoIntro = () => {
            if (videoStarted || isLoaded) return;
            videoStarted = true;
            clearInterval(bufferingInterval);

            // Îi dăm vizibilitate video-ului chiar înainte de a porni (pentru feedback instant)
            video.style.opacity = '0.85';

            // Redăm videoclipul
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Redare inițiată cu succes
                }).catch(error => {
                    console.warn("Autoplay block detected or video error. Falling back to simulated load.", error);
                    runSimulatedCounter();
                });
            }
        };

        if (video) {
            // Evenimente de pregătire video
            video.addEventListener('canplaythrough', startVideoIntro);
            video.addEventListener('loadedmetadata', startVideoIntro);
            video.addEventListener('playing', startVideoIntro);

            // Sincronizăm progresul video (de la 30% la 100%) cu redarea efectivă
            video.addEventListener('timeupdate', () => {
                if (!videoStarted || isLoaded || !video.duration) return;
                const progress = video.currentTime / video.duration;
                const mappedPercent = Math.min(100, Math.floor(30 + progress * 70));
                
                if (mappedPercent > currentPercent) {
                    updateProgressUI(mappedPercent);
                }
            });

            video.addEventListener('ended', () => {
                updateProgressUI(100);
                setTimeout(removePreloader, 300);
            });

            // Failsafe în caz că video-ul este deja în cache / ready state încărcat înainte de adăugarea listenerilor
            if (video.readyState >= 3) {
                startVideoIntro();
            }

            // FALLBACK AUTOPLAY BLOCK: Dacă autoplay-ul este blocat de browser,
            // videoclipul va porni la primul click/touch al utilizatorului oriunde pe ecran.
            const handleUserInteractionPlay = () => {
                if (video.paused && !isLoaded) {
                    video.play().then(() => {
                        video.style.opacity = '0.85';
                        if (!videoStarted) {
                            startVideoIntro();
                        }
                    }).catch(err => console.log("User click play attempt: ", err));
                }
                document.removeEventListener('click', handleUserInteractionPlay);
                document.removeEventListener('touchstart', handleUserInteractionPlay);
            };
            document.addEventListener('click', handleUserInteractionPlay);
            document.addEventListener('touchstart', handleUserInteractionPlay);
        } else {
            runSimulatedCounter();
        }

        // Simulator de progres în caz că videoclipul nu pornește sau este blocat de browser
        function runSimulatedCounter() {
            let simPercent = currentPercent;
            const runSim = () => {
                if (isLoaded) return;
                simPercent += Math.floor(Math.random() * 5) + 2;
                if (simPercent >= 100) {
                    updateProgressUI(100);
                    setTimeout(removePreloader, 400);
                } else {
                    updateProgressUI(simPercent);
                    setTimeout(runSim, 40 + Math.random() * 30);
                }
            };
            runSim();
        }

        // --- SISTEM DE BYPASS / SKIP INTRO ---
        const triggerBypass = () => {
            updateProgressUI(100);
            removePreloader();
        };

        if (skipBtn) {
            skipBtn.addEventListener('click', triggerBypass);
        }

        // Tasta ESC pentru bypass rapid
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                triggerBypass();
            }
        });

        // --- FAILSAFE SYSTEM (6 secunde max) ---
        setTimeout(() => {
            if (!isLoaded) {
                console.warn("Axiobyte Failsafe triggered: Preloader forced close.");
                updateProgressUI(100);
                removePreloader();
            }
        }, 6000);
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

// --- 1. ENGINE: CINEMATIC PRELOADER (DEPRECATED - INTEGRATED ABOVE) ---
// Integrat în motorul securizat de mai sus pentru a evita execuția duplicată și erorile de concurență.

// --- 2. ENGINE: CUSTOM INTERACTIVE CURSOR & LYNIS SKEW & ELEMENTS ---
document.addEventListener('DOMContentLoaded', () => {
    
    // INSTANȚIERE CURSOR INTERACTIV
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (cursorDot && cursorOutline) {
        let cursorActive = false;

        window.addEventListener('mousemove', (e) => {
            if (!cursorActive) {
                cursorDot.style.opacity = '1';
                cursorOutline.style.opacity = '1';
                cursorActive = true;
            }
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
            cursorActive = false;
        });

        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            cursorActive = true;
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

/* ==========================================================================
   ANIMAȚIE INTERACTIVĂ: TIPOGRAPHY SPLIT-TEXT REVEAL (ENGINE 2)
   ========================================================================== */
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const revealElements = document.querySelectorAll('.reveal-type');

        if (revealElements.length > 0) {
            
            // 1. PREGĂTIREA TEXTULUI: Împărțim textul în structuri sigure cu măști CSS
            revealElements.forEach(element => {
                const textStr = element.getAttribute('data-reveal') || element.textContent;
                const words = textStr.split(' ');
                element.innerHTML = ''; // Golim textul brut vechi

                words.forEach((word) => {
                    // Creăm masca exterioară pentru fiecare cuvânt
                    const wordDiv = document.createElement('span');
                    wordDiv.className = 'reveal-word';

                    // Creăm elementul intern care se va mișca
                    const innerSpan = document.createElement('span');
                    innerSpan.className = 'reveal-word-inner';
                    innerSpan.textContent = word;

                    wordDiv.appendChild(innerSpan);
                    element.appendChild(wordDiv);
                });
            });

            // 2. INTERSECTION OBSERVER: Detectăm când titlul intră pe ecran la scroll
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.15 // Declanșează când 15% din titlu este vizibil
            };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const inners = target.querySelectorAll('.reveal-word-inner');

                        // Adăugăm clasa de bază
                        target.classList.add('animated');

                        // Aplicăm un decalaj de timp (stagger) pentru fiecare cuvânt în parte
                        inners.forEach((inner, index) => {
                            inner.style.transitionDelay = `${index * 45}ms`;
                        });

                        // Opriți monitorizarea pentru acest element deoarece s-a animat deja
                        observer.unobserve(target);
                    }
                });
            }, observerOptions);

            // Pornim monitorizarea pentru toate elementele cu clasa reveal-type
            revealElements.forEach(el => revealObserver.observe(el));
        }
    });
})();

/* ==========================================================================
   ENGINE: AUTOMATED INTERSECTION OBSERVER FOR SCROLL REVEAL
   ========================================================================== */
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        if (revealElements.length === 0) return;

        // Configurăm marginea de declanșare (-80px în podea ca să nu apară chiar pe buza ecranului)
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Citim dacă elementul are setat un delay custom în HTML
                    const customDelay = element.getAttribute('data-delay') || 0;

                    // Declanșăm animația cu micro-decalajul setat
                    setTimeout(() => {
                        element.classList.add('is-revealed');
                    }, parseInt(customDelay));

                    // Oprim monitorizarea pentru acest element (rămâne fixat pe ecran)
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Mapăm motorul pe toate elementele selectate
        revealElements.forEach(el => revealObserver.observe(el));
    });
})();

/* ==========================================================================
   AXIOBYTE PROCESS SYSTEM // UNIFIED VARIANTS 1, 2 & 3 ENGINE
   ========================================================================== */
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const processSection = document.getElementById('process');
        const stepItems = document.querySelectorAll('.process-step-item');
        const sidebarTag = document.querySelector('.process-side-tag');

        if (!processSection || stepItems.length === 0 || !sidebarTag) return;

        // --- DEBUT VARIANTA 3: LOGICA DE GLITCH MATRIX PENTRU SIDEBAR ---
        let lastStepIndex = -1;
        const chars = "0123456789X/@#•";

        const runMatrixGlitch = (targetText) => {
            let iterations = 0;
            const interval = setInterval(() => {
                sidebarTag.textContent = targetText
                    .split("")
                    .map((char, index) => {
                        if (index < iterations) return targetText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");

                if (iterations >= targetText.length) {
                    clearInterval(interval);
                    sidebarTag.textContent = targetText; // Fixăm textul curat la final
                }
                iterations += 1 / 2;
            }, 30);
        };

        // --- DEBUT VARIANTA 1: INTERSECTION OBSERVER PENTRU ACTIVARE CROMATICĂ LIVE ---
        // Folosim un observer dedicat cu un viewport strâns pe centrul ecranului
        const activeObserverOptions = {
            root: null,
            rootMargin: "-25% 0px -25% 0px", // Detectează când pasul trece fix prin centrul ecranului
            threshold: 0.2
        };

        const activeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const item = entry.target;
                const stepNum = item.querySelector('.step-number').textContent.substring(0, 2);

                if (entry.isIntersecting) {
                    // Scoatem starea activă de pe toate celelalte rânduri
                    stepItems.forEach(el => el.classList.remove('step-active'));
                    
                    // Aprindem pasul curent (Varianta 1)
                    item.classList.add('step-active');

                    // Dacă pasul s-a schimbat, declanșăm glitch-ul tehnic în sidebar (Varianta 3)
                    const currentStepIndex = Array.from(stepItems).indexOf(item);
                    if (currentStepIndex !== lastStepIndex) {
                        lastStepIndex = currentStepIndex;
                        runMatrixGlitch(`[PROCESS: STEP ${stepNum}/04]`);
                    }
                }
            });
        }, activeObserverOptions);

        // Cuplăm observer-ul pe fiecare pas din listă
        stepItems.forEach(item => activeObserver.observe(item));

        // RESET TRIPLE SAFEGUARD: Dacă utilizatorul dă scroll rapid în sus în afara secțiunii
        window.addEventListener('scroll', () => {
            const sectionRect = processSection.getBoundingClientRect();
            if (sectionRect.top > window.innerHeight || sectionRect.bottom < 0) {
                if (lastStepIndex !== -1) {
                    lastStepIndex = -1;
                    sidebarTag.textContent = "[Our Process]";
                    stepItems.forEach(el => el.classList.remove('step-active'));
                }
            }
        });
    });
})();