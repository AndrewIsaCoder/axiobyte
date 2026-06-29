/* ==========================================================================
   AXIOBYTE STUDIO — UNIFIED INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. INIȚIALIZARE LENIS (SMOOTH SCROLL CU INERȚIE)
       ========================================================================== */
    let lenis = null;

    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curbă fluidă premium
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        window.lenis = lenis;

        const updateScroll = (time) => {
            lenis.raf(time);
            requestAnimationFrame(updateScroll);
        };
        requestAnimationFrame(updateScroll);

        // Smooth scroll for anchor links
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
    } else {
        console.warn("Axiobyte Warning: Lenis library was not detected globally.");
    }

    /* ==========================================================================
       2. CUSTOM CURSOR ENGINE (HOVER & CLICK DETECT)
       ========================================================================== */
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (cursorDot && cursorOutline) {
        let cursorActive = false;

        // Urmărirea poziției mouse-ului în timp real
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

        // Efectul de CLICK pe toată pagina
        window.addEventListener('mousedown', () => {
            cursorOutline.classList.add('cursor-click');
        });
        
        window.addEventListener('mouseup', () => {
            cursorOutline.classList.remove('cursor-click');
        });

        const refreshHoverTargets = () => {
            const targets = document.querySelectorAll(
                'a, button, .chip-item, .avatar-item, .accordion-trigger, .gallery-card, .client-logo-card, input, textarea'
            );
            
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

    /* ==========================================================================
       3. SISTEM AUTO-HOVER MEMORABIL (SERVICES INDEX)
       ========================================================================== */
    const servicesContainer = document.querySelector('.hero-services-index ul');
    const serviceItems = document.querySelectorAll('.hero-services-index li');

    let currentIndex = 2; 
    let autoHoverInterval = null;

    function startAutoHover() {
        if (autoHoverInterval || serviceItems.length === 0) return;

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

    if (servicesContainer && serviceItems.length > 0) {
        servicesContainer.addEventListener('mouseenter', stopAutoHover);

        servicesContainer.addEventListener('mouseleave', () => {
            serviceItems[currentIndex].classList.add('active');
            startAutoHover();
        });

        startAutoHover();
    }

    /* ==========================================================================
       4. EFECT DE TYPEWRITER (TASTATURĂ HERO DESCRIPTION)
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
       5. DETECTARE SCROLL PENTRU NAVBAR GLASSMORPHISM
       ========================================================================== */
    const headerElement = document.querySelector('header');

    if (headerElement && lenis) {
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
                    if (lenis) {
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
                if (lenis) {
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

    const testimonialsAvatars = document.querySelectorAll('.avatar-item');
    const quoteText = document.querySelector('.testimonial-quote-text');
    const authorName = document.querySelector('.author-name');
    const authorRole = document.querySelector('.author-role');

    if (testimonialsAvatars.length > 0 && quoteText) {
        testimonialsAvatars.forEach(avatar => {
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
                    testimonialsAvatars.forEach(av => av.classList.remove('active'));
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
       8. FLOATING MAGNETIC BUTTON (.btn-session) — DISTANCE BASED
       ========================================================================== */
    const magneticButton = document.querySelector('.btn-session');

    if (magneticButton) {
        window.addEventListener('mousemove', (e) => {
            const rect = magneticButton.getBoundingClientRect();
            const btnCenterX = rect.left + rect.width / 2;
            const btnCenterY = rect.top + rect.height / 2;
            const deltaX = e.clientX - btnCenterX;
            const deltaY = e.clientY - btnCenterY;
            const distance = Math.hypot(deltaX, deltaY);

            // Împingem elementul discret când cursorul este în apropierea sa
            if (distance < 90) {
                const targetX = deltaX * 0.35;
                const targetY = deltaY * 0.35;
                magneticButton.style.transition = 'none';
                magneticButton.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
                magneticButton.style.color = 'var(--accent-white)';
            } else {
                magneticButton.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease';
                magneticButton.style.transform = 'translate3d(0, 0, 0)';
                magneticButton.style.color = '';
            }
        });
    }

    /* ==========================================================================
       9. MAGNETIC AVATAR ENGINE WITH OVERLAP ISOLATION
       ========================================================================== */
    const avatars = document.querySelectorAll('.avatar-item');

    if (avatars.length > 0) {
        avatars.forEach(avatar => {
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
                avatar.style.zIndex = '99'; // Îi dăm un z-index uriaș să treacă vizual peste celelalte
                avatar.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(1.05)`; // Micro-zoom
            });

            avatar.addEventListener('mouseleave', () => {
                // Îl punem înapoi la loc elastic și resetăm z-index
                avatar.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                avatar.style.transform = 'translate3d(0, 0, 0) scale(1)';
                
                setTimeout(() => {
                    avatar.style.zIndex = '';
                }, 100);
            });
        });
    }

    /* ==========================================================================
       10. SCROLL INDICATOR KINETIC ROTATING STAMP
       ========================================================================== */
    const stamp = document.querySelector('.axiobyte-scroll-stamp');
    const stampSvg = document.querySelector('.stamp-svg');
    
    if (stamp && stampSvg) {
        let currentRotation = 0;
        let baseVelocity = 0.5;

        const rotateStamp = () => {
            let scrollVelocity = (lenis) ? lenis.velocity : 0;
            let targetVelocity = baseVelocity + Math.abs(scrollVelocity) * 0.8;
            currentRotation += targetVelocity;
            stampSvg.style.transform = `rotate3d(0, 0, 1, ${currentRotation}deg)`;
            requestAnimationFrame(rotateStamp);
        };
        requestAnimationFrame(rotateStamp);

        if (lenis) {
            lenis.on('scroll', (e) => {
                if (e.scroll > 150) {
                    stamp.classList.add('fade-out');
                } else {
                    stamp.classList.remove('fade-out');
                }
            });
        }
    }

    /* ==========================================================================
       11. INTERSECTION OBSERVERS FOR SCROLL REVEALS & TYPOGRAPHY
       ========================================================================== */
    
    // Typography reveal
    const textElementsToReveal = document.querySelectorAll('.manifest-title, .services-title-main, .testimonials-main-title');
    textElementsToReveal.forEach(el => {
        el.classList.add('reveal-text-dynamic');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    textElementsToReveal.forEach(el => revealObserver.observe(el));

    // Split-Text Reveal (.reveal-type)
    const revealElements = document.querySelectorAll('.reveal-type');

    if (revealElements.length > 0) {
        revealElements.forEach(element => {
            const textStr = element.getAttribute('data-reveal') || element.textContent;
            const words = textStr.split(' ');
            element.innerHTML = ''; // Golim textul brut vechi

            words.forEach((word) => {
                const wordDiv = document.createElement('span');
                wordDiv.className = 'reveal-word';

                const innerSpan = document.createElement('span');
                innerSpan.className = 'reveal-word-inner';
                innerSpan.textContent = word;

                wordDiv.appendChild(innerSpan);
                element.appendChild(wordDiv);
            });
        });

        const splitObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const inners = target.querySelectorAll('.reveal-word-inner');

                    target.classList.add('animated');

                    inners.forEach((inner, index) => {
                        inner.style.transitionDelay = `${index * 45}ms`;
                    });

                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => splitObserver.observe(el));
    }

    // Scroll Reveal (.scroll-reveal)
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    if (scrollRevealElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const customDelay = element.getAttribute('data-delay') || 0;

                    setTimeout(() => {
                        element.classList.add('is-revealed');
                    }, parseInt(customDelay));

                    observer.unobserve(element);
                }
            });
        }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

        scrollRevealElements.forEach(el => scrollObserver.observe(el));
    }

    /* ==========================================================================
       12. INTERACTIVE SALES FORM ENGINE & PULSE GLOW
       ========================================================================== */
    const formInputs = document.querySelectorAll('.sales-form input, .sales-form textarea');
    const radialGlow = document.querySelector('.sales-radial-glow');
    const leadForm = document.getElementById('axiobyte-lead-form');

    if (formInputs.length > 0 && radialGlow) {
        formInputs.forEach(input => {
            // Mărim glow-ul din spate la focus
            input.addEventListener('focus', () => {
                radialGlow.style.background = 'radial-gradient(circle, rgba(255, 114, 55, 0.14) 0%, rgba(255, 114, 55, 0) 65%)';
            });

            // Revenim la glow-ul discret de bază la blur
            input.addEventListener('blur', () => {
                radialGlow.style.background = 'radial-gradient(circle, rgba(255, 114, 55, 0.08) 0%, rgba(255, 114, 55, 0) 65%)';
            });
        });
    }

    // Trimitere formular via Web3Forms
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = leadForm.querySelector('.btn-submit-sales');
            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const formFeedback = document.getElementById('form-feedback');
            
            leadForm.classList.add('submitting');
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('submitting');
            }
            if (btnText) {
                btnText.textContent = "TRANSMITTING...";
            }
            
            if (formFeedback) {
                formFeedback.classList.remove('success', 'error', 'show');
                formFeedback.textContent = '';
            }
            
            const formData = new FormData(leadForm);
            const dataObject = Object.fromEntries(formData);
            
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
                if (response.ok && result.success) {
                    if (submitBtn) {
                        submitBtn.classList.remove('submitting');
                        submitBtn.classList.add('success');
                    }
                    if (btnText) {
                        btnText.textContent = "TRANSMISSION SUCCESSFUL ✓";
                    }

                    leadForm.reset();
                    const activeChips = leadForm.querySelectorAll('.chip-item.active');
                    activeChips.forEach(chip => chip.classList.remove('active'));

                    // Pornim tranziția fluidă după ce s-a văzut confirmarea de succes (600ms)
                    setTimeout(() => {
                        const transitionOverlay = document.createElement('div');
                        transitionOverlay.className = 'page-transition-overlay';
                        document.body.appendChild(transitionOverlay);
                        
                        setTimeout(() => {
                            transitionOverlay.classList.add('active');
                        }, 10);

                        setTimeout(() => {
                            window.location.href = './thank-you.html';
                        }, 600);
                    }, 600);

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
                setTimeout(() => {
                    if (!submitBtn || submitBtn.classList.contains('success')) return;
                    leadForm.classList.remove('submitting');
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('error');
                    if (btnText) btnText.textContent = "Send message";
                }, 3500);
            });
        });
    }

    // PROJECT PLANNER CHIPS ENGINE
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
       13. MOBILE HAMBURGER MENU ENGINE (WITH LENIS INTEGRATION)
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            
            // Oprim Lenis ca să nu deruleze background-ul la scroll pe meniu mobil
            if (lenis) {
                if (isOpen) {
                    lenis.stop();
                } else {
                    lenis.start();
                }
            }
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                hamburgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                if (lenis) lenis.start();
                
                if (targetElement && lenis) {
                    setTimeout(() => { lenis.scrollTo(targetElement); }, 300);
                }
            });
        });
    }
});

/* ==========================================================================
   14. AXIOBYTE CINEMATIC PRELOADER ENGINE (SECURED & OPTIMIZED)
   ========================================================================== */
(() => {
    // Blocăm scroll-ul instantaneu pentru a opri salturile la loading
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    window.addEventListener('DOMContentLoaded', () => {
        const preloader = document.getElementById('axiobyte-preloader');
        const percentText = document.getElementById('loader-percentage');
        const progressBar = document.querySelector('.pl-progress-fill');
        const video = document.getElementById('preloader-video');
        const skipBtn = document.getElementById('skip-preloader-btn');

        if (!preloader || !percentText) {
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

        const removePreloader = () => {
            if (isLoaded) return;
            isLoaded = true;

            // Salvăm faptul că intro-ul a fost deja vizualizat în sesiune
            sessionStorage.setItem('axiobyte_intro_played', 'true');

            preloader.classList.add('loaded');
            
            if (video) video.pause();

            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };

        // Verificăm dacă avem parametrul de search "?intro=true" pentru force play (dezvoltare/testare)
        const urlParams = new URLSearchParams(window.location.search);
        const forceIntro = urlParams.get('intro') === 'true';
        const hasPlayedThisSession = sessionStorage.getItem('axiobyte_intro_played') === 'true' && !forceIntro;

        if (hasPlayedThisSession) {
            // Secvență rapidă pentru UX excelent pe navigări subsecvente
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
        // Buffering (0% - 30%) - până se inițializează videoclipul
        let bufferingInterval = setInterval(() => {
            if (videoStarted) {
                clearInterval(bufferingInterval);
                return;
            }
            if (currentPercent < 30) {
                updateProgressUI(currentPercent + 1);
            }
        }, 80);

        const startVideoIntro = () => {
            if (videoStarted || isLoaded) return;
            videoStarted = true;
            clearInterval(bufferingInterval);

            video.style.opacity = '0.85';

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Redare OK
                }).catch(error => {
                    console.warn("Autoplay block detected or video error. Falling back to simulated load.", error);
                    runSimulatedCounter();
                });
            }
        };

        if (video) {
            video.addEventListener('canplaythrough', startVideoIntro);
            video.addEventListener('loadedmetadata', startVideoIntro);
            video.addEventListener('playing', startVideoIntro);

            // Sincronizăm progresul video (de la 30% la 100%)
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

            if (video.readyState >= 3) {
                startVideoIntro();
            }

            // Fallback play la primul click
            const handleUserInteractionPlay = () => {
                if (video.paused && !isLoaded) {
                    video.play().then(() => {
                        video.style.opacity = '0.85';
                        if (!videoStarted) startVideoIntro();
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

        // bypass / skip buttons
        const triggerBypass = () => {
            updateProgressUI(100);
            removePreloader();
        };

        if (skipBtn) skipBtn.addEventListener('click', triggerBypass);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') triggerBypass();
        });

        // Failsafe în caz de delay rețea (scăzut la 4 secunde)
        setTimeout(() => {
            if (!isLoaded) {
                console.warn("Axiobyte Failsafe triggered: Preloader forced close.");
                updateProgressUI(100);
                removePreloader();
            }
        }, 4000);
    });
})();

/* ==========================================================================
   16. SECURITY SHIELD (Anti-Copy / Anti-Inspect)
   ========================================================================== */
(function() {
    // 1. Block Right-Click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // 2. Block Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+U, etc.)
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I / Cmd+Option+I (Inspect)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J / Cmd+Option+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U / Cmd+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S / Cmd+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });

    // 3. Prevent text selection globally (optional but good for anti-copy)
    document.addEventListener('selectstart', function(e) {
        // Allow text selection inside the contact form inputs
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // 4. Anti-Debugger Trap (Fires if console is forcefully opened)
    setInterval(function() {
        var before = new Date().getTime();
        debugger;
        var after = new Date().getTime();
        if (after - before > 100) {
            // DevTools is open and paused on debugger. 
            // We clear the body as punishment.
            document.body.innerHTML = '<div style="background:#050505;color:#d4d4d4;height:100vh;width:100%;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:18px;">[ AXIOBYTE ] RESTRICTED ENVIRONMENT.</div>';
        }
    }, 2000);
})();
