document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const sideMenu = document.getElementById("sideMenu");

  // create overlay dynamically
  let overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  // function to open menu
  const openMenu = () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
  };

  // function to close menu
  const closeMenu = () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  };

  menuIcon.addEventListener("click", () => {
    if (sideMenu.classList.contains("active")) closeMenu();
    else openMenu();
  });

  // clicking overlay closes menu
  overlay.addEventListener("click", closeMenu);
});
