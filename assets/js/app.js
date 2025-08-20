// ====== CONFIG ======
window.WORKER_BASE = "https://reel-hub.yesnoox.com"; // aapka worker URL

// Auto-ads options (Google Auto Ads जैसा)
// Inline ads (reels ke beech) by default band; on karna ho to true kar do.
const ENABLE_INLINE_ADS = false;
const INLINE_AD_FREQUENCY = 5; // har 5th reel ke baad

// ====== REELS LOGIC ======
let reelCount = 0;

async function loadVideos() {
  const container = document.getElementById("reelContainer");
  container.innerHTML = "<div class='loading'>⏳ Loading reels...</div>";

  try {
    const res = await fetch(window.WORKER_BASE);
    const data = await res.json();
    container.innerHTML = "";

    if (!data.videos || data.videos.length === 0) {
      container.innerHTML = "<p>कोई वीडियो नहीं मिला।</p>";
      return;
    }

    data.videos.forEach((video) => {
      reelCount++;
      const reel = document.createElement("div");
      reel.className = "reel";

      reel.innerHTML = `
        <video class="reel-video" src="${video.url}" autoplay loop muted playsinline></video>
        <div class="footer-tags">#hot #desi #bhabhi</div>
        <div class="play-pause-btn">▶</div>
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

      // Play/Pause
      const toggleVideo = () => {
        if (vidEl.paused) {
          vidEl.play().catch(() => {});
          playBtn.style.display = "none";
        } else {
          vidEl.pause();
          playBtn.style.display = "flex";
        }
      };
      vidEl.addEventListener("click", toggleVideo);
      playBtn.addEventListener("click", toggleVideo);

      // Audio toggle
      audioBtn.addEventListener("click", () => {
        vidEl.muted = !vidEl.muted;
        audioImg.src = vidEl.muted ? "assets/icons/speaker-off.png" : "assets/icons/speaker-on.png";
      });

      // Like / Comment / Share
      reel.querySelector(".like-btn").addEventListener("click", () => alert("Liked!"));
      reel.querySelector(".comment-btn").addEventListener("click", () => alert("Open comments!"));
      reel.querySelector(".share-btn").addEventListener("click", () => alert("Share link copied!"));

      container.appendChild(reel);

      // (OPTIONAL) Inline auto-ad insert like Google Auto Ads
      if (ENABLE_INLINE_ADS && reelCount % INLINE_AD_FREQUENCY === 0) {
        const slot = document.createElement("div");
        slot.className = "inline-auto-ad";
        slot.style.cssText = "display:flex;justify-content:center;margin:8px 0;";
        container.appendChild(slot);
        injectAdInto(slot); // use same ad network snippet
      }
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>⚠️ वीडियो लोड नहीं हो पाए।</p>";
  }
}

// ====== AUTO AD (Top sticky + optional inline) ======
function injectAdInto(targetEl) {
  // Each call sets atOptions and loads invoke.js dynamically into the target element.
  // Many ad networks read global atOptions; creating a scoped loader per slot:
  if (!targetEl) return;

  // Clear previous content
  targetEl.innerHTML = "";

  // Create a wrapper to isolate scripts
  const wrapper = document.createElement("div");
  targetEl.appendChild(wrapper);

  // 1) Set atOptions BEFORE loader
  const config = document.createElement("script");
  config.type = "text/javascript";
  config.text = `
    atOptions = {
      'key' : 'beb4357a9f3e3cb4ad23051f64297ec4',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };
  `;
  wrapper.appendChild(config);

  // 2) Load the network script
  const loader = document.createElement("script");
  loader.type = "text/javascript";
  loader.src = "//www.highperformanceformat.com/beb4357a9f3e3cb4ad23051f64297ec4/invoke.js";
  wrapper.appendChild(loader);
}

function mountTopAd() {
  const topSlot = document.getElementById("topAdSlot");
  if (topSlot) injectAdInto(topSlot);
}

// ====== INIT ======
document.addEventListener("DOMContentLoaded", () => {
  mountTopAd();   // Top sticky auto-ad
  loadVideos();   // Reels

  const btns = document.querySelectorAll(".bottom-nav button");
  if (btns.length === 4) {
    btns[0].onclick = () => window.location.href = "/";
    btns[1].onclick = () => alert("Search feature coming soon.");
    btns[2].onclick = () => alert("Bookmark feature coming soon.");
    btns[3].onclick = () => alert("Login feature coming soon.");
  }
});
