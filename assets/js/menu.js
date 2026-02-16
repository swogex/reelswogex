// ================= MENU TOGGLE =================

function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  if (sideMenu) {
    sideMenu.classList.toggle("active");
  }
}

// ================= OUTSIDE CLICK CLOSE =================

document.addEventListener("click", (e) => {
  const sideMenu = document.getElementById("sideMenu");
  const menuIcon = document.querySelector(".menu-icon");

  if (!sideMenu || !menuIcon) return;

  if (!sideMenu.contains(e.target) && !menuIcon.contains(e.target)) {
    sideMenu.classList.remove("active");
  }
});

// ================= REFERRAL TIMER LOGIC =================

// 👉 Yaha apni referral site daalo
const allowedReferrer = "yoursite2.com";

if (document.referrer.includes(allowedReferrer)) {

  const topTimer = document.getElementById("topTimer");
  const middleTimer = document.getElementById("middleTimerBox");

  if (topTimer) topTimer.style.display = "block";
  if (middleTimer) middleTimer.style.display = "block";

  // ===== TOP TIMER (10 sec) =====
  let topTime = 10;
  const topCount = document.getElementById("topCount");

  const topInterval = setInterval(() => {
    topTime--;

    if (topCount) topCount.innerText = topTime;

    if (topTime <= 0) {
      clearInterval(topInterval);
      if (topTimer) topTimer.style.display = "none";
    }
  }, 1000);

  // ===== MIDDLE TIMER (15 sec) =====
  let middleTime = 15;
  const middleCount = document.getElementById("middleCount");
  const hiddenLink = document.getElementById("hiddenLink");

  const middleInterval = setInterval(() => {
    middleTime--;

    if (middleCount) middleCount.innerText = middleTime;

    if (middleTime <= 0) {
      clearInterval(middleInterval);
      if (hiddenLink) hiddenLink.style.display = "block";
    }
  }, 1000);
}