const serviceList = document.querySelector(".hero-services-index ul");
const services = document.querySelectorAll(".hero-services-index li");
let currentIndex = 2; // Pornim de la 03 (Web Experiences), adică indexul 2 în tablou
let autoHoverInterval;

// Funcția care mută clasa .active automat de la un link la altul
function startAutoHover() {
  autoHoverInterval = setInterval(() => {
    // Scoatem clasa .active de la elementul curent
    services[currentIndex].classList.remove("active");

    // Trecem la următorul element (și o luăm de la capăt dacă ajungem la final)
    currentIndex = (currentIndex + 1) % services.length;

    // Adăugăm clasa .active pe noul element
    services[currentIndex].classList.add("active");
  }, 3000); // Schimbă serviciul la fiecare 3 secunde (poți pune 2000 pentru 2 secunde)
}

// Funcția care oprește complet automatizarea
function stopAutoHover() {
  clearInterval(autoHoverInterval);
  // Curățăm toate clasele active automate când utilizatorul pune mouse-ul
  services.forEach((service) => service.classList.remove("active"));
}

// Pornim sistemul la încărcarea paginii
startAutoHover();

// Când MOUSE-UL INTRĂ în listă, oprim motorul automat
serviceList.addEventListener("mouseenter", () => {
  stopAutoHover();
});

// Când MOUSE-UL IESE din listă, repornim motorul automat de unde a rămas utilizatorul
serviceList.addEventListener("mouseleave", () => {
  startAutoHover();
});
