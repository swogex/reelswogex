// ==========================
// menu.js - Swogex
// ==========================

// -------- Menu Toggle --------
function toggleMenu() {
  const sideMenu = document.getElementById('sideMenu');
  sideMenu.classList.toggle('active');
}

// -------- Close Menu on Click Outside --------
document.addEventListener('click', (e) => {
  const sideMenu = document.getElementById('sideMenu');
  const menuIcon = document.querySelector('.menu-icon');

  // अगर click menu या menu-icon पर नहीं हुआ, तो menu बंद करो
  if (!sideMenu.contains(e.target) && !menuIcon.contains(e.target)) {
    sideMenu.classList.remove('active');
  }
});

// -------- Service Worker Registration --------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('✅ Service Worker registered'))
    .catch(err => console.error('❌ SW registration failed:', err));
}

// -------- Optional: PWA Install Prompt --------
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Default Chrome prompt block
  deferredPrompt = e;

  const popup = document.createElement('div');
  popup.id = 'installPopup';
  popup.innerHTML = `
    <div style="position:fixed; bottom:65px; left:0; right:0; background:#000; color:#fff;
                padding:12px; text-align:center; font-family:Arial, sans-serif; font-size:14px;
                z-index:9999; box-shadow:0 -2px 8px rgba(0,0,0,0.4);">
      Install Swogex App?
      <button id="installBtn" style="margin-left:10px; padding:6px 12px; background:#ff2d55;
                                     color:#fff; border:none; border-radius:4px; cursor:pointer;">
        Install
      </button>
      <button id="closeBtn" style="margin-left:8px; padding:6px 10px; background:#444;
                                    color:#fff; border:none; border-radius:4px; cursor:pointer;">
        Close
      </button>
    </div>
  `;
  document.body.appendChild(popup);

  // Install button
  document.getElementById('installBtn').addEventListener('click', () => {
    popup.remove();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
  });

  // Close button
  document.getElementById('closeBtn').addEventListener('click', () => popup.remove());
});
