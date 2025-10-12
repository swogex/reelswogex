// ==================== Global Variables ====================
window.BH_WORKER_BASE = "https://your-new-bhabhi-worker-url.workers.dev";
let bhReelCount = 0;
let bhCurrentPlaying = null;

// ==================== DOMContentLoaded ====================
document.addEventListener("DOMContentLoaded", () => {
  loadBhabhiVideos();

  const btns = document.querySelectorAll(".bottom-nav button");
  if (btns.length >= 5) {
    btns[0].onclick = () => (window.location.href = "/");
    btns[1].onclick = () => alert("Search feature coming soon.");
    btns[2].onclick = () => alert("Bookmark feature coming soon.");
    btns[3].onclick = () => alert("Login feature coming soon.");
    btns[4].onclick = () => (window.location.href = "/reels");
  }
});

// ==================== Load Bhabhi Reels ====================
async function loadBhabhiVideos() {
  const container = document.getElementById("bhabhiReelContainer");
  container.innerHTML = "<div class='loading'>⏳ Loading Bhabhi reels...</div>";

  try {
    const res = await fetch(window.BH_WORKER_BASE + "/videos");
    const data = await res.json();
    container.innerHTML = "";

    if (!data.videos || data.videos.length === 0) {
      container.innerHTML = "<p>No Bhabhi videos found.</p>";
      return;
    }

    data.videos.forEach(video => {
      bhReelCount++;
      const reel = document.createElement("div");
      reel.className = "reel";
      reel.innerHTML = `
        <video class="reel-video" src="${video.url}" autoplay loop muted playsinline preload="auto"></video>
        <div class="footer-tags">#bhabhi #desi #village #sexy</div>
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

      // Play/Pause
      const toggleVideo = () => {
        if (vidEl.paused) { vidEl.play().catch(() => {}); playBtn.textContent = "⏸"; }
        else { vidEl.pause(); playBtn.textContent = "▶"; }
      };
      vidEl.addEventListener("click", toggleVideo);
      playBtn.addEventListener("click", toggleVideo);

      // Audio toggle
      audioBtn.addEventListener("click", () => {
        vidEl.muted = !vidEl.muted;
        audioImg.src = vidEl.muted ? "assets/icons/speaker-off.png" : "assets/icons/speaker-on.png";
      });

      container.appendChild(reel);
    });

    // Scroll / Auto-Pause
    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
    }

    function handleScrollPause() {
      document.querySelectorAll(".reel").forEach(reel => {
        const video = reel.querySelector(".reel-video");
        const playBtn = reel.querySelector(".play-pause-btn");
        const audioBtnImg = reel.querySelector(".audio-btn img");

        if (isInViewport(video)) {
          if (bhCurrentPlaying && bhCurrentPlaying !== video) {
            bhCurrentPlaying.pause();
            bhCurrentPlaying.closest(".reel").querySelector(".play-pause-btn").textContent = "▶";
            bhCurrentPlaying.muted = true;
            bhCurrentPlaying.closest(".reel").querySelector(".audio-btn img").src = "assets/icons/speaker-off.png";
          }
          video.play().catch(() => {});
          bhCurrentPlaying = video;
          playBtn.textContent = video.paused ? "▶" : "⏸";
        } else {
          video.pause();
          video.muted = true;
          playBtn.textContent = "▶";
          audioBtnImg.src = "assets/icons/speaker-off.png";
        }
      });
    }

    window.addEventListener("scroll", handleScrollPause, { passive: true });
    setInterval(handleScrollPause, 800);
    handleScrollPause();

  } catch(err) {
    console.error("Error loading Bhabhi videos:", err);
    container.innerHTML = "<p>⚠️ Error loading videos.</p>";
  }
}
