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

/**
 * Oprește animația fără a pierde indexul curent
 */
function stopAutoHover() {
    clearInterval(autoHoverInterval);
    autoHoverInterval = null;

    // Scoatem clasa active pentru ca stilurile de hover din CSS să funcționeze curat
    serviceItems.forEach(item => item.classList.remove('active'));
}

/* ==========================================================================
   EVENIMENTE MOUSE - DETECTARE INDEX ȘI MEMORARE
   ========================================================================== */

// Monitorizăm fiecare element în parte când utilizatorul trece cu mouse-ul peste el
serviceItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        // ACTUALIZARE MAGICĂ: Salvăm instant în memorie indexul pe care se află utilizatorul
        currentIndex = index;
    });
});

// Când mouse-ul intră în zona mare a containerului, oprim intervalul automat
servicesContainer.addEventListener('mouseenter', () => {
    stopAutoHover();
});

// Când mouse-ul părăsește containerul, activăm IMEDIAT elementul unde a rămas și repornim
servicesContainer.addEventListener('mouseleave', () => {
    // Îi punem clasa active exact elementului pe care a fost lăsat cursorul
    serviceItems[currentIndex].classList.add('active');
    
    // Repornim intervalul care va continua natural către următorul element
    startAutoHover();
});

// Inițializăm sistemul la deschiderea site-ului
document.addEventListener('DOMContentLoaded', () => {
    startAutoHover();
});