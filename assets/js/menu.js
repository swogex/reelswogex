document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const sideMenu = document.getElementById("sideMenu");

  if (!menuIcon || !sideMenu) return; // safety check

  // create overlay dynamically
  let overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  // open menu
  const openMenu = () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
  };

  // close menu
  const closeMenu = () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  };

  // toggle menu on hamburger click
  menuIcon.addEventListener("click", () => {
    if (sideMenu.classList.contains("active")) closeMenu();
    else openMenu();
  });

  // close menu on overlay click
  overlay.addEventListener("click", closeMenu);
});
