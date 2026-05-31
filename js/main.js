/* ==========================================================================
   SISTEM AUTO-HOVER MEMORABIL (REIA DE ACOLO UNDE A FOST CURSORUL)
   ========================================================================== */

const servicesContainer = document.querySelector('.hero-services-index ul');
const serviceItems = document.querySelectorAll('.hero-services-index li');

let currentIndex = 2; 
let autoHoverInterval = null;

/**
 * Porneste ciclul automat
 */
function startAutoHover() {
    if (autoHoverInterval) return;

    autoHoverInterval = setInterval(() => {
        // Ștergem starea activă de la vechiul element
        serviceItems[currentIndex].classList.remove('active');

        // Trecem la următorul element din listă
        currentIndex = (currentIndex + 1) % serviceItems.length;

        // Îl activăm pe cel nou
        serviceItems[currentIndex].classList.add('active');
    }, 1000); // Schimbă la fiecare 1 secunde
}


function stopAutoHover() {
    clearInterval(autoHoverInterval);
    autoHoverInterval = null;

    // Scoatem clasa active pentru ca stilurile de hover din CSS să funcționeze curat
    serviceItems.forEach(item => item.classList.remove('active'));
}

/* ==========================================================================
   EVENIMENTE MOUSE - DETECTARE INDEX ȘI MEMORARE
   ========================================================================== */

serviceItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        currentIndex = index;
    });
});

servicesContainer.addEventListener('mouseenter', () => {
    stopAutoHover();
});


servicesContainer.addEventListener('mouseleave', () => {

    serviceItems[currentIndex].classList.add('active');
    
    startAutoHover();
});

// Inițializăm sistemul la deschiderea site-ului
document.addEventListener('DOMContentLoaded', () => {
    startAutoHover();
});

/* ==========================================================================
   EFECT DE TYPEWRITER (TASTATURĂ) PENTRU PARAGRAFUL DESCRIPTIV
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
        } else {

        }
    }

    
    setTimeout(typeWriterEffect, 1000);
}