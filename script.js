const profile = {
  username: "Menagasweety",
  email: "menaganadar28@gmail.com",
  linkedin: "https://www.linkedin.com/in/menaga-krishnamurthy"
};

const notebookRow = document.getElementById("notebookRow");
const webRow = document.getElementById("webRow");
const filters = document.getElementById("filters");
const search = document.getElementById("projectSearch");
const count = document.getElementById("projectCount");
const repoStat = document.getElementById("repoStat");
const languageStat = document.getElementById("languageStat");
const siteStat = document.getElementById("siteStat");
let repositories = [];
let activeFilter = "all";
const feedbackWebsite = "https://customer-feedback-ai-478ierzsten73mhcms3fpf.streamlit.app/";
const projectLinks = [
  {
    match: /oibsip1.?3|temperature.converter/i,
    website: "https://menagasweety.github.io/OIBSIP1-3/",
    repository: "https://github.com/Menagasweety/OIBSIP1-3"
  },
  {
    match: /realtime.{0,12}chat|chat.{0,12}realtime/i,
    website: "https://realtime-chat-1-4tp1.onrender.com",
    repository: "https://github.com/Menagasweety/realtime-chat-app"
  }
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function categoryFor(repo) {
  const text = `${repo.name} ${repo.description || ""} ${repo.language || ""}`.toLowerCase();
  if (/machine learning|deep learning|model|predict|classif|regress|tensorflow|pytorch|artificial intelligence|\bai\b|\bml\b/.test(text)) return "ml";
  if (/data|analys|analytics|dashboard|visual|sql|power.?bi|tableau|excel|eda|science|python|pandas/.test(text) || ["Python", "Jupyter Notebook", "SQL"].includes(repo.language)) return "data";
  return "python";
}

function categoryLabel(repo) {
  const category = categoryFor(repo);
  return category === "ml" ? "Machine learning" : category === "data" ? "Data & BI" : (repo.language || "Project");
}

function repositoryUrl(repo) {
  const override = projectLinks.find(project => project.match.test(`${repo.name} ${repo.description || ""}`));
  return override ? override.repository : repo.html_url;
}

function websiteUrl(repo) {
  const override = projectLinks.find(project => project.match.test(`${repo.name} ${repo.description || ""}`));
  if (override) return override.website;
  const value = String(repo.homepage || "").trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (/^(?:[\w-]+\.)+[a-z]{2,}(?:[/:?#]|$)/i.test(value)) return `https://${value}`;
  return "";
}

function isExcluded(repo) {
  const slug = `${repo.name} ${repo.description || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return /\bhtml and css\b/.test(slug) || /\bhtml css projects?\b/.test(slug) || /\bmenaga portfolio\b/.test(slug) || /\bmenaga personal portfolio\b/.test(slug);
}

function projectTitle(repo) {
  const text = `${repo.name} ${repo.description || ""}`.toLowerCase();
  const curated = [
    [/oibsip1.?3|temperature.converter/, "Temperature Converter"],
    [/realtime.{0,12}chat|chat.{0,12}realtime/, "Realtime Chat Application"],
    [/food.*calorie|calorie.*food/, "AI Food Calorie Predictor"],
    [/customer.*feedback|feedback.*analysis/, "Customer Feedback Analysis"],
    [/employee.*performance|performance.*prediction/, "Employee Performance Prediction"],
    [/employee.*wellness|wellness.*analysis/, "Employee Wellness Analysis"],
    [/urban.*park|park.*event/, "Urban Park Events — Exploratory Analysis"],
    [/sleep.*disorder|disorder.*sleep/, "Sleep Health Data Analysis"]
  ];
  const match = curated.find(([pattern]) => pattern.test(text));
  if (match) return match[1];
  const words = repo.name.replace(/[-_]+/g, " ").trim();
  const genericName = /^(project|new repository|my repo|untitled|test|practice|data science project|python project)$/i.test(words);
  const sourceTitle = genericName && repo.description ? repo.description.split(/[.!?]/)[0].slice(0, 62) : words;
  return sourceTitle.replace(/\b\w/g, char => char.toUpperCase()).replace(/\bAi\b/g, "AI").replace(/\bMl\b/g, "ML").replace(/\bSql\b/g, "SQL").replace(/\bApi\b/g, "API").replace(/\bEda\b/g, "EDA");
}

function updateSnapshot(items) {
  repoStat.textContent = items.length;
  const languages = new Set(items.map(repo => repo.language).filter(Boolean));
  languageStat.textContent = languages.size;
  siteStat.textContent = items.filter(repo => websiteUrl(repo)).length;
}

function isFeedbackProject(repo) {
  return /customer.{0,12}feedback|feedback.{0,12}(analysis|ai)/i.test(`${repo.name} ${repo.description || ""}`);
}

function isNotebookFeedback(repo) {
  return isFeedbackProject(repo) && (repo.language === "Jupyter Notebook" || /jupyter|notebook/i.test(`${repo.name} ${repo.description || ""}`));
}

function isWebsiteProject(repo) {
  if (isNotebookFeedback(repo)) return false;
  return isFeedbackProject(repo) || Boolean(websiteUrl(repo)) || ["HTML", "CSS", "JavaScript", "TypeScript"].includes(repo.language) || /streamlit|web app|website|interactive app|dashboard app/i.test(`${repo.name} ${repo.description || ""}`);
}

function projectVisual(repo, isNotebook) {
  const text = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
  const svg = (label, content) => `<div class="cover-illustration"><svg viewBox="0 0 360 112" role="img" aria-label="Concept illustration: ${label}" focusable="false">${content}</svg><span class="cover-art-caption">CONCEPT VISUAL</span></div>`;
  if (/temperature|converter/.test(text)) return svg("temperature conversion", `<path class="viz-line" d="M68 28v43a20 20 0 1 0 22 0V28a11 11 0 0 0-22 0Z"/><path class="viz-accent" d="M79 46v37"/><path class="viz-soft-line" d="M95 37h12m-12 14h8m-8 14h12"/><text class="viz-label" x="133" y="56">°C</text><path class="viz-line" d="M174 51h57m-10-10 10 10-10 10"/><text class="viz-label" x="258" y="56">°F</text><circle class="viz-dot" cx="292" cy="49" r="3"/><circle class="viz-dot viz-dot-alt" cx="307" cy="49" r="3"/><circle class="viz-dot viz-dot-third" cx="322" cy="49" r="3"/>`);
  if (/realtime.{0,12}chat|chat.{0,12}realtime/.test(text)) return svg("real-time messaging interface", `<rect class="viz-panel" x="73" y="15" width="220" height="82" rx="12"/><circle class="viz-dot" cx="91" cy="30" r="4"/><text class="viz-small" x="102" y="33">ONLINE</text><rect class="viz-bubble" x="91" y="43" width="108" height="15" rx="7"/><rect class="viz-bubble viz-bubble-alt" x="164" y="65" width="109" height="15" rx="7"/><path class="viz-soft-line" d="M102 50h69m-53 22h95"/>`);
  if (/feedback|sentiment|review/.test(text)) return svg("customer sentiment and feedback analysis", `<rect class="viz-panel" x="50" y="17" width="260" height="80" rx="9"/><text class="viz-label" x="68" y="39">FEEDBACK</text><text class="viz-stars" x="68" y="59">★★★★★</text><path class="viz-soft-line" d="M68 75h222"/><rect class="viz-bar viz-bar-a" x="68" y="82" width="98" height="7" rx="3"/><rect class="viz-bar viz-bar-b" x="173" y="82" width="65" height="7" rx="3"/><rect class="viz-bar viz-bar-c" x="245" y="82" width="45" height="7" rx="3"/>`);
  if (/wellness|sleep|health/.test(text)) return svg("wellness analytics dashboard", `<rect class="viz-panel" x="52" y="15" width="256" height="84" rx="9"/><rect class="viz-stat" x="68" y="27" width="62" height="22" rx="4"/><rect class="viz-stat viz-stat-alt" x="137" y="27" width="62" height="22" rx="4"/><rect class="viz-stat viz-stat-third" x="206" y="27" width="85" height="22" rx="4"/><path class="viz-grid" d="M68 80h222M68 68h222"/><path class="viz-chart" d="m71 75 25-8 23 5 25-19 23 10 24-13 24 9 25-20 25 8"/><circle class="viz-dot" cx="240" cy="39" r="3"/>`);
  if (/food|calorie|nutrition/.test(text)) return svg("AI food and nutrition recognition", `<circle class="viz-plate" cx="128" cy="55" r="38"/><circle class="viz-plate-inner" cx="128" cy="55" r="26"/><path class="viz-food" d="M112 57c3-12 15-17 27-11 9 4 10 15 2 22-10 8-29 2-29-11Z"/><circle class="viz-dot" cx="118" cy="51" r="3"/><circle class="viz-dot viz-dot-alt" cx="135" cy="58" r="4"/><rect class="viz-panel" x="187" y="23" width="115" height="64" rx="8"/><path class="viz-soft-line" d="M201 42h70M201 57h48M201 72h60"/><circle class="viz-dot" cx="281" cy="42" r="4"/><circle class="viz-dot viz-dot-alt" cx="256" cy="57" r="4"/><circle class="viz-dot viz-dot-third" cx="265" cy="72" r="4"/>`);
  if (/concrete|strength|regression|predict|study hours/.test(text)) return svg("machine learning regression plot", `<path class="viz-grid" d="M77 18v72h221M77 68h221M77 45h221M132 18v72M188 18v72M243 18v72"/><path class="viz-line viz-fit" d="m88 79 197-52"/><g class="viz-points"><circle cx="102" cy="68" r="4"/><circle cx="119" cy="76" r="4"/><circle cx="142" cy="59" r="4"/><circle cx="159" cy="64" r="4"/><circle cx="179" cy="48" r="4"/><circle cx="201" cy="55" r="4"/><circle cx="223" cy="36" r="4"/><circle cx="244" cy="43" r="4"/><circle cx="270" cy="26" r="4"/></g><text class="viz-small" x="83" y="105">FEATURES</text><text class="viz-small" x="257" y="105">PREDICTION</text>`);
  if (/park|event|urban|location/.test(text)) return svg("urban park event analysis", `<path class="viz-map" d="M78 22 142 14l20 17 67-10 49 16-12 47-63 8-30-15-81 8-14-31Z"/><path class="viz-route" d="m102 67 35-27 39 17 36-26 39 28"/><circle class="viz-pin" cx="102" cy="67" r="5"/><circle class="viz-pin viz-pin-alt" cx="176" cy="57" r="5"/><circle class="viz-pin" cx="251" cy="59" r="5"/><rect class="viz-panel" x="267" y="15" width="38" height="31" rx="6"/>`);
  return svg(isNotebook ? "data exploration chart" : "interactive project preview", `<path class="viz-grid" d="M76 18v72h220M76 68h220M76 45h220"/><rect class="viz-bar viz-bar-a" x="103" y="56" width="25" height="34" rx="4"/><rect class="viz-bar viz-bar-b" x="151" y="40" width="25" height="50" rx="4"/><rect class="viz-bar viz-bar-c" x="199" y="29" width="25" height="61" rx="4"/><rect class="viz-bar viz-bar-d" x="247" y="47" width="25" height="43" rx="4"/><path class="viz-line" d="m115 49 49-17 48-9 48 13"/>`);
}

function makeCard(repo, index, kind) {
  const isWebsite = kind === "website" || (!kind && isWebsiteProject(repo));
  const isNotebook = kind === "notebook" || isNotebookFeedback(repo);
  const topics = (repo.topics || []).slice(0, 2);
  if (!topics.length && repo.language) topics.push(repo.language);
  if (repo.language && !topics.includes(repo.language)) topics.push(repo.language);
  const description = isFeedbackProject(repo)
    ? (isNotebook ? "Explore the Jupyter notebook analysis and the steps behind the customer feedback project." : "Open the live customer feedback app or browse its source code.")
    : repo.description || "Explore the source code and project notes in this repository.";
  const updated = repo.updated_at ? new Date(repo.updated_at).getFullYear() : "GitHub";
  const demoUrl = isFeedbackProject(repo) && isWebsite ? feedbackWebsite : (isWebsite ? websiteUrl(repo) : "");
  const destination = demoUrl || repo.html_url;
  const primaryLabel = demoUrl ? "Open live website" : "Open GitHub project";
  const title = isFeedbackProject(repo) ? (isNotebook ? "Customer Feedback Analysis — Jupyter Notebook" : "Customer Feedback Analysis — Web App") : projectTitle(repo);
  const projectType = isNotebook ? "PYTHON / JUPYTER NOTEBOOK" : isWebsite ? "LIVE APP / WEBSITE" : categoryLabel(repo);
  const language = isNotebook ? "Jupyter Notebook" : repo.language || (isWebsite ? "Web app" : "Repository");
  return `<article class="project-card shelf-card" role="link" tabindex="0" aria-label="${escapeHtml(title)} — ${demoUrl ? "open live website" : "open GitHub project"}" data-destination="${escapeHtml(destination)}">
    <div class="project-cover"><span class="cover-label">${escapeHtml(projectType)} / ${updated}</span><span class="cover-num">${String(index + 1).padStart(2, "0")}</span>${projectVisual(repo, isNotebook)}</div>
    <div class="project-body"><div class="project-meta"><span class="language">${escapeHtml(language)}</span><span>${repo.fork ? "FORK / " : "PROJECT / "}${escapeHtml(repo.visibility || "PUBLIC")}</span></div>
    <h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p>
    <div class="project-tags">${topics.slice(0, 3).map(topic => `<span>${escapeHtml(topic)}</span>`).join("")}</div>
    <div class="project-open"><span class="primary-destination">${primaryLabel} <b>↗</b></span><a class="repo-link" href="${escapeHtml(repositoryUrl(repo))}" target="_blank" rel="noreferrer">GitHub source ↗</a></div></div>
    </article>`;
}

function renderProjects() {
  const query = search.value.trim().toLowerCase();
  let filtered = repositories.filter(repo => {
    const matchesCategory = activeFilter === "all" || (activeFilter === "python" ? ["Python", "Jupyter Notebook"].includes(repo.language) : categoryFor(repo) === activeFilter);
    const matchesQuery = !query || `${repo.name} ${repo.description || ""} ${repo.language || ""}`.toLowerCase().includes(query);
    return !isExcluded(repo) && matchesCategory && matchesQuery;
  });
  const feedbackRepos = filtered.filter(isFeedbackProject);
  const cardItems = filtered.filter(repo => !isFeedbackProject(repo)).map(repo => ({ repo, kind: "" }));
  if (feedbackRepos.length) {
    const byPreference = (a, b) => Number(!isNotebookFeedback(b)) - Number(!isNotebookFeedback(a)) || Number(!b.fork) - Number(!a.fork);
    const webRepo = [...feedbackRepos].sort(byPreference)[0];
    const notebookRepo = feedbackRepos.filter(isNotebookFeedback).sort((a, b) => Number(!b.fork) - Number(!a.fork))[0];
    cardItems.push({ repo: webRepo, kind: "website" });
    if (notebookRepo) cardItems.push({ repo: notebookRepo, kind: "notebook" });
  }
  const notebooks = cardItems.filter(item => item.kind === "notebook" || (!item.kind && !isWebsiteProject(item.repo)));
  const websites = cardItems.filter(item => item.kind === "website" || (!item.kind && isWebsiteProject(item.repo)));
  count.textContent = cardItems.length;
  document.getElementById("notebookCount").textContent = `${notebooks.length} PROJECT${notebooks.length === 1 ? "" : "S"}`;
  document.getElementById("webCount").textContent = `${websites.length} PROJECT${websites.length === 1 ? "" : "S"}`;
  const emptyMessage = `<div class="empty-state">${repositories.length ? "No projects match these filters." : `GitHub projects could not be loaded. <a href="https://github.com/${profile.username}?tab=repositories" target="_blank" rel="noreferrer">Open GitHub ↗</a>`}</div>`;
  notebookRow.innerHTML = notebooks.length ? notebooks.map((item, index) => makeCard(item.repo, index, item.kind)).join("") : emptyMessage;
  webRow.innerHTML = websites.length ? websites.map((item, index) => makeCard(item.repo, index, item.kind)).join("") : emptyMessage;
}

async function loadRepositories() {
  const cacheKey = `portfolio:${profile.username}:repositories`;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (cached && Date.now() - cached.savedAt < 6 * 60 * 60 * 1000 && Array.isArray(cached.items)) {
      repositories = cached.items.filter(repo => !repo.archived);
      updateSnapshot(repositories.filter(repo => !isExcluded(repo)));
      renderProjects();
    }
  } catch { /* Storage can be unavailable in private browsing. */ }

  try {
    const response = await fetch(`https://api.github.com/users/${profile.username}/repos?per_page=100&sort=updated`, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected GitHub response");
    repositories = data.filter(repo => !repo.archived).sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at));
    updateSnapshot(repositories.filter(repo => !isExcluded(repo)));
    try { localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), items: repositories })); } catch { /* Rendering does not depend on storage. */ }
    renderProjects();
  } catch (error) {
    if (!repositories.length) {
      const unavailable = `<div class="empty-state">Projects are available on GitHub. <a href="https://github.com/${profile.username}?tab=repositories" target="_blank" rel="noreferrer">Browse the repositories ↗</a></div>`;
      notebookRow.innerHTML = unavailable;
      webRow.innerHTML = unavailable;
    }
  }
}

filters.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  filters.querySelectorAll(".filter").forEach(filter => filter.classList.toggle("active", filter === button));
  renderProjects();
});
search.addEventListener("input", renderProjects);
[notebookRow, webRow].forEach(row => {
  row.addEventListener("click", event => {
    if (event.target.closest("a")) return;
    const card = event.target.closest(".project-card[data-destination]");
    if (card) window.open(card.dataset.destination, "_blank", "noopener,noreferrer");
  });
  row.addEventListener("keydown", event => {
    const card = event.target.closest(".project-card[data-destination]");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      window.open(card.dataset.destination, "_blank", "noopener,noreferrer");
    }
  });
});

document.querySelectorAll(".shelf-arrow").forEach(button => button.addEventListener("click", () => {
  const row = document.getElementById(button.dataset.scroll);
  row.scrollBy({ left: (button.dataset.direction === "right" ? 1 : -1) * Math.max(300, row.clientWidth * 0.85), behavior: "smooth" });
}));
loadRepositories();

const menuButton = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuButton.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(opened));
  menuButton.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
  menuButton.textContent = opened ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  menuButton.textContent = "☰";
}));

if ("IntersectionObserver" in window) {
  const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-28% 0px -62% 0px" });
  sectionLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) sectionObserver.observe(section);
  });
}

const themeButton = document.getElementById("themeBtn");
const themeColor = document.querySelector('meta[name="theme-color"]');
try {
  const savedTheme = localStorage.getItem("menaga-theme");
  if (savedTheme === "light") document.body.classList.remove("dark");
  else if (savedTheme === "dark") document.body.classList.add("dark");
} catch { /* Theme preference is optional. */ }
themeColor.content = document.body.classList.contains("dark") ? "#090e18" : "#f3f6fb";
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeColor.content = document.body.classList.contains("dark") ? "#090e18" : "#f3f6fb";
  try { localStorage.setItem("menaga-theme", document.body.classList.contains("dark") ? "dark" : "light"); } catch { /* Theme still changes for this visit. */ }
});

document.querySelectorAll('a[href^="mailto:"]').forEach(link => { link.href = `mailto:${profile.email}`; });
document.querySelectorAll('a[href*="linkedin.com/in/"]').forEach(link => { link.href = profile.linkedin; });
