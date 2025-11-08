// ==================== Global Variables ====================
window.WORKER_BASE = "https://swogexworker.ustrafficorganic.workers.dev";
let reelCount = 0;
let currentPlaying = null;
let deferredPrompt;

// ==================== DOMContentLoaded ====================
document.addEventListener("DOMContentLoaded", () => {

  // ✅ Allow body to scroll
  document.body.style.overflowY = "auto";

  // ---------------- Load Reels ----------------
  loadVideos();

  // ---------------- Bottom Nav ----------------
  const btns = document.querySelectorAll(".bottom-nav button");
  if (btns.length >= 5) {
    btns[0].onclick = () => (window.location.href = "/");
    btns[1].onclick = () => alert("Search feature coming soon.");
    btns[2].onclick = () => alert("Bookmark feature coming soon.");
    btns[3].onclick = () => alert("Login feature coming soon.");
    btns[4].onclick = () => (window.location.href = "/reels");
  }

});

// ==================== Load Reels Function ====================
async function loadVideos() {
  const container = document.getElementById("reelContainer");
  container.innerHTML = "<div class='loading'>⏳ Loading reels...</div>";

  try {
    const res = await fetch(window.WORKER_BASE + "/videos");
    const data = await res.json();
    container.innerHTML = "";

    if (!data.videos || data.videos.length === 0) {
      container.innerHTML = "<p>कोई वीडियो नहीं मिला।</p>";
      return;
    }

    data.videos.forEach(video => {
      reelCount++;
      const reel = document.createElement("div");
      reel.className = "reel";

      reel.innerHTML = `
        <video class="reel-video" src="${video.url}" autoplay loop muted playsinline preload="auto"></video>
        <div class="footer-tags">#desi #bhabhi #mms #village #tiktok</div>
        <div class="play-pause-btn">⏸</div>
        <div class="right-icons">
          <div class="icon-btn like-btn"><img src="assets/icons/like.png"><span>120</span></div>
          <div class="icon-btn comment-btn"><img src="assets/icons/comment.png"><span>15</span></div>
          <div class="icon-btn share-btn"><img src="assets/icons/share.png"><span>Share</span></div>
          <button class="icon-btn audio-btn">
            <img src="assets/icons/speaker-off.png" alt="Mute/Unmute">
          </button>
        </div>
      `;

      const vidEl = reel.querySelector(".reel-video");
      const playBtn = reel.querySelector(".play-pause-btn");
      const audioBtn = reel.querySelector(".audio-btn");
      const audioImg = audioBtn.querySelector("img");

      // ---------------- Video Play/Pause ----------------
      const toggleVideo = () => {
        if (vidEl.paused) { 
          vidEl.play().catch(() => {}); 
          playBtn.textContent = "⏸"; 
        } else { 
          vidEl.pause(); 
          playBtn.textContent = "▶"; 
        }
      };
      vidEl.addEventListener("click", toggleVideo);
      playBtn.addEventListener("click", toggleVideo);

      // ---------------- Audio Toggle ----------------
      audioBtn.addEventListener("click", () => {
        vidEl.muted = !vidEl.muted;
        vidEl.dataset.userUnmuted = !vidEl.muted ? "true" : "false";
        audioImg.src = vidEl.muted ? "assets/icons/speaker-off.png" : "assets/icons/speaker-on.png";
      });

      // ---------------- Like / Comment / Share ----------------
      reel.querySelector(".like-btn").addEventListener("click", () => alert("Liked! ❤️"));
      reel.querySelector(".comment-btn").addEventListener("click", () => alert("Comments opening soon! 💬"));
      reel.querySelector(".share-btn").addEventListener("click", () => {
        navigator.clipboard.writeText(video.url);
        alert("Share link copied! 🔗");
      });

      container.appendChild(reel);
    });

    // ================= IntersectionObserver for Scroll Play/Pause =================
    const options = { root: null, rootMargin: '0px', threshold: 0.6 };
    const reelsVideos = document.querySelectorAll('.reel-video');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        const playBtn = video.closest('.reel').querySelector('.play-pause-btn');
        const audioBtnImg = video.closest('.reel').querySelector('.audio-btn img');

        if (entry.isIntersecting) {
          if (currentPlaying && currentPlaying !== video) {
            currentPlaying.pause();
            currentPlaying.closest('.reel').querySelector('.play-pause-btn').textContent = "▶";
            currentPlaying.muted = true;
            currentPlaying.closest(".reel").querySelector(".audio-btn img").src = "assets/icons/speaker-off.png";
          }
          video.play().catch(() => {});
          if (!video.dataset.userUnmuted) video.muted = true;
          currentPlaying = video;
          playBtn.textContent = "⏸";
        } else {
          video.pause();
          video.muted = true;
          playBtn.textContent = "▶";
          audioBtnImg.src = "assets/icons/speaker-off.png";
        }
      });
    }, options);

    reelsVideos.forEach(video => observer.observe(video));

  } catch (err) {
    console.error("Error loading videos:", err);
    container.innerHTML = "<p>⚠️ Error loading videos.</p>";
  }
}

// ==================== PWA Install Prompt ====================
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const popup = document.createElement("div");
  popup.id = "installPopup";
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

  document.getElementById("installBtn").addEventListener("click", () => {
    popup.remove();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
  });
  document.getElementById("closeBtn").addEventListener("click", () => popup.remove());
});

// ==================== Service Worker ====================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("✅ Service Worker registered"))
    .catch(err => console.error("❌ SW registration failed:", err));
}

// ==================== Menu Toggle ====================
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
