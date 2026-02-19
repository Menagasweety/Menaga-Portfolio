const typingTarget = document.getElementById("typingText");
const roles = ["Frontend Developer", "Software Engineer"];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    typingTarget.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1300);
      return;
    }
  } else {
    typingTarget.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}

typeLoop();

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.18 });

reveals.forEach((el) => observer.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll(".counter").forEach((counter) => {
      let start = 0;
      const end = Number(counter.dataset.target);
      const tick = () => {
        start += 1;
        counter.textContent = String(start);
        if (start < end) requestAnimationFrame(tick);
      };
      tick();
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.45 });

const statsGrid = document.querySelector(".stats-grid");
if (statsGrid) counterObserver.observe(statsGrid);

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelector(".skill-bars")?.classList.add("animate");
    document.querySelector(".circles")?.classList.add("animate");
    skillsObserver.disconnect();
  });
}, { threshold: 0.35 });

const skillsSection = document.getElementById("skills");
if (skillsSection) skillsObserver.observe(skillsSection);

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById("scrollProgress").style.width = `${(scrolled / max) * 100}%`;
});

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn?.addEventListener("click", () => nav.classList.toggle("open"));
nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

const tiltCard = document.getElementById("tiltCard");
if (tiltCard) {
  tiltCard.addEventListener("mousemove", (e) => {
    const r = tiltCard.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rotX = ((y / r.height) - 0.5) * -8;
    const rotY = ((x / r.width) - 0.5) * 8;
    tiltCard.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  });
}

const cursorGlow = document.getElementById("cursorGlow");
window.addEventListener("mousemove", (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

window.addEventListener("load", () => {
  document.getElementById("pageLoader")?.classList.add("hidden");
});

const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
form?.addEventListener("submit", () => {
  formNote.textContent = "Opening your email app with prefilled details.";
});

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function makeParticles() {
  particles = Array.from({ length: Math.min(70, Math.floor(window.innerWidth / 20)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    dx: (Math.random() - 0.5) * 0.25,
    dy: (Math.random() - 0.5) * 0.25,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(212, 2, 201, 0.35)";
  particles.forEach((p) => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
makeParticles();
drawParticles();
window.addEventListener("resize", () => {
  resizeCanvas();
  makeParticles();
});
