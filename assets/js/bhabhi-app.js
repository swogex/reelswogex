// ==================== Global Variables ====================
window.BH_WORKER_BASE = "https://bhabhireel.ustrafficorganic.workers.dev";
let bhReelCount = 0;
let bhCurrentPlaying = null;

// ==================== DOMContentLoaded ====================
document.addEventListener("DOMContentLoaded", () => {
  loadBhabhiVideos();
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
      const reel = document.createElement("div");
      reel.className = "reel";
      reel.innerHTML = `
        <video class="reel-video" src="${video.url}" autoplay loop muted playsinline preload="auto"></video>
        <div class="footer-tags">#bhabhi #desi #village #hot</div>
        <div class="play-pause-btn">⏸</div>
        <div class="right-icons">
          <div class="icon-btn like-btn"><img src="/assets/icons/like.png"><span>120</span></div>
          <div class="icon-btn comment-btn"><img src="/assets/icons/comment.png"><span>15</span></div>
          <div class="icon-btn share-btn"><img src="/assets/icons/share.png"><span>Share</span></div>
          <button class="icon-btn audio-btn">
            <img src="/assets/icons/speaker-off.png" alt="Mute/Unmute">
          </button>
        </div>
      `;

      const vid = reel.querySelector(".reel-video");
      const playBtn = reel.querySelector(".play-pause-btn");
      const audioBtn = reel.querySelector(".audio-btn");
      const audioImg = audioBtn.querySelector("img");

      // Play/Pause
      const toggleVideo = () => {
        if (vid.paused) {
          vid.play().catch(() => {});
          playBtn.textContent = "⏸";
        } else {
          vid.pause();
          playBtn.textContent = "▶";
        }
      };
      vid.addEventListener("click", toggleVideo);
      playBtn.addEventListener("click", toggleVideo);

      // Audio toggle
      audioBtn.addEventListener("click", () => {
        vid.muted = !vid.muted;
        audioImg.src = vid.muted ? "/assets/icons/speaker-off.png" : "/assets/icons/speaker-on.png";
      });

      container.appendChild(reel);
    });

    // Auto pause other videos
    window.addEventListener("scroll", handleScrollPause, { passive: true });
    handleScrollPause();

  } catch (err) {
    console.error("Error loading Bhabhi videos:", err);
    container.innerHTML = "<p>⚠️ Error loading videos.</p>";
  }
}

// ==================== Scroll Pause Function ====================
function handleScrollPause() {
  document.querySelectorAll(".reel").forEach(reel => {
    const video = reel.querySelector(".reel-video");
    const playBtn = reel.querySelector(".play-pause-btn");
    const rect = video.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2) {
      if (bhCurrentPlaying && bhCurrentPlaying !== video) {
        bhCurrentPlaying.pause();
        bhCurrentPlaying.closest(".reel").querySelector(".play-pause-btn").textContent = "▶";
      }
      video.play().catch(() => {});
      bhCurrentPlaying = video;
      playBtn.textContent = "⏸";
    } else {
      video.pause();
      playBtn.textContent = "▶";
    }
  });
}
