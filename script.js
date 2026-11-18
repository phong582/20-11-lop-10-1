const openLetterButton = document.getElementById("openLetter");
const envelope = document.getElementById("envelope");
const letterHint = document.getElementById("letterHint");

openLetterButton.addEventListener("click", () => {
  const isOpen = envelope.classList.toggle("open");
  openLetterButton.innerHTML = isOpen ? 'Đóng bức thư <span>↑</span>' : 'Mở bức thư <span>↓</span>';
  letterHint.textContent = isOpen ? "Một lời tri ân gửi đến thầy cô." : "Chạm vào nút để mở lá thư";
});

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");
let musicPlaying = false;

musicButton.addEventListener("click", async () => {
  if (!musicPlaying) {
    try {
      await music.play();
      musicPlaying = true;
      musicLabel.textContent = "Tắt nhạc";
      musicButton.setAttribute("aria-label", "Tắt nhạc");
    } catch {
      musicLabel.textContent = "Chưa có file nhạc";
      alert("Bạn hãy thêm file nhạc MP3 vào thư mục audio và đặt tên là music.mp3 nhé.");
    }
  } else {
    music.pause();
    musicPlaying = false;
    musicLabel.textContent = "Bật nhạc";
    musicButton.setAttribute("aria-label", "Bật nhạc");
  }
});

// Hiện ảnh thật nếu file ảnh đã được thêm vào thư mục images.
document.querySelectorAll(".gallery-item").forEach((item) => {
  const img = item.querySelector("img");
  img.addEventListener("load", () => item.classList.add("has-image"));
  img.addEventListener("error", () => item.classList.remove("has-image"));
  if (img.complete && img.naturalWidth > 0) item.classList.add("has-image");
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = () => {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
};
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    if (!item.classList.contains("has-image")) {
      alert("Hãy thêm ảnh của lớp vào thư mục images trước nhé.");
      return;
    }
    lightboxImage.src = img.src;
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
  });
});
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

// Hiệu ứng xuất hiện khi cuộn đến từng khu vực.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Pháo hoa canvas: hiệu ứng trang trí, không cần thư viện ngoài.
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let particles = [];
let animationFrame = null;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function burst(x, y) {
  const colors = ["#e7cc91", "#ffffff", "#b7c9df", "#d8a879", "#f2e7cf"];
  for (let i = 0; i < 65; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2 + Math.random() * 4;
    particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 55 + Math.random() * 35, maxLife: 90,
      size: 1 + Math.random() * 2, color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function animateFireworks() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.025;
    p.vx *= 0.99; p.vy *= 0.99; p.life--;
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;
  if (particles.length) animationFrame = requestAnimationFrame(animateFireworks);
  else { cancelAnimationFrame(animationFrame); animationFrame = null; }
}

function launchFireworks() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      burst(w * (0.15 + Math.random() * 0.7), h * (0.15 + Math.random() * 0.55));
      if (!animationFrame) animateFireworks();
    }, i * 280);
  }
}
document.getElementById("fireworkButton").addEventListener("click", launchFireworks);

// Tự kích hoạt pháo hoa nhẹ khi phần kết thúc đi vào màn hình.
const thanksObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      launchFireworks();
      thanksObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.45 });
thanksObserver.observe(document.getElementById("thanks"));
