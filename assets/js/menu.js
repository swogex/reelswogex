function toggleMenu() { 
  const sideMenu = document.getElementById('sideMenu'); 
  sideMenu.classList.toggle('active'); 
}

// Optional: Close menu when clicking outside
document.addEventListener('click', (e) => { 
  const sideMenu = document.getElementById('sideMenu'); 
  const menuIcon = document.querySelector('.menu-icon'); 
  if (!sideMenu.contains(e.target) && !menuIcon.contains(e.target)) { 
    sideMenu.classList.remove('active'); 
  } 
});
