// Pega elementos logo no início
const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const menuToggler = document.querySelector(".menu-toggler");
const logo = document.querySelector(".header-logo img");
const navItems = document.querySelectorAll(".nav-item");

const collapsedSidebarHeight = "56px";
const fullSidebarHeight = "calc(100vh - 32px)";

// Centraliza a logo ao carregar
window.addEventListener("load", () => {
  if (window.innerWidth >= 1024) {
    gsap.set(logo, { x: 72 });
  }

  // Inicializa a linha no primeiro item ativo
  const activeItem = document.querySelector('.nav-item.active') || navItems[0];
  moveActiveLine(activeItem);
});

// ✅ Alterna sidebar e anima logo
sidebarToggler.addEventListener("click", () => {
  const isCollapsed = sidebar.classList.toggle("collapsed");

  if (window.innerWidth >= 1024) {
    gsap.to(logo, {
      x: isCollapsed ? 0 : 72,
      duration: 0.4,
      ease: "power2.out"
    });
  } else {
    gsap.set(logo, { x: 0 });
  }
});

// Alterna menu mobile
const toggleMenu = (isMenuActive) => {
  sidebar.style.height = isMenuActive
    ? `${sidebar.scrollHeight}px`
    : collapsedSidebarHeight;

  menuToggler.querySelector("span").innerText = isMenuActive ? "close" : "menu";
};

menuToggler.addEventListener("click", () => {
  toggleMenu(sidebar.classList.toggle("menu-active"));
});

// Responsivo
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    sidebar.style.height = fullSidebarHeight;
    if (!sidebar.classList.contains("collapsed")) {
      gsap.set(logo, { x: 72 });
    }
  } else {
    sidebar.classList.remove("collapsed");
    sidebar.style.height = "auto";
    toggleMenu(sidebar.classList.contains("menu-active"));
    gsap.set(logo, { x: 0 });
  }
});

// Movimento da linha ativa
function moveActiveLine(item) {
  const offsetTop = item.offsetTop;
  gsap.to(activeLine, {
    y: offsetTop,
    duration: 0.4,
    ease: "power2.out"
  });
}

// Evento de click nos nav-items
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector(".nav-item.active")?.classList.remove("active");
    item.classList.add("active");
    moveActiveLine(item);
  });
});
