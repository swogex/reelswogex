window.WORKER_BASE = "https://reel-hub.yesnoox.com"; // Worker URL
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

    data.videos.forEach(video => {
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

      // Insert Center Ad after every 4 reels
      if (reelCount % 4 === 0) {
        const adDiv = document.createElement('div');
        adDiv.className = 'center-ad-placeholder';
        adDiv.innerHTML = "Center Ad Here";
        container.appendChild(adDiv);
      }
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>⚠️ वीडियो लोड नहीं हो पाए।</p>";
  }
}

// Bottom nav actions
document.addEventListener("DOMContentLoaded", () => {
  loadVideos();

  const btns = document.querySelectorAll(".bottom-nav button");
  if (btns.length === 4) {
    btns[0].onclick = () => window.location.href = "/";
    btns[1].onclick = () => alert("Search feature coming soon.");
    btns[2].onclick = () => alert("Bookmark feature coming soon.");
    btns[3].onclick = () => alert("Login feature coming soon.");
  }
});
