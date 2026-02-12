/* ==================================================
   CineHub Global Enhancements (app.js)
   Applies to ALL pages automatically
   ================================================== */

/* ==================================================
   THEME SYSTEM (FIXED PROPERLY)
   Now changes BOTH background + text colors using
   CSS variables instead of partial styling
   ================================================== */

const root = document.documentElement;

const darkTheme = {
  '--bg': '#0d0d0d',
  '--card': '#161616',
  '--text': '#ffffff',
  '--muted': '#aaaaaa',
  '--accent': '#ff4c4c'
};

const lightTheme = {
  '--bg': '#f5f5f5',
  '--card': '#ffffff',
  '--text': '#111111',
  '--muted': '#555555',
  '--accent': '#ff4c4c'
};

function applyTheme(vars) {
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function setTheme(mode) {
  if (mode === 'light') {
    applyTheme(lightTheme);
  } else {
    applyTheme(darkTheme);
  }
  localStorage.setItem('cinehub-theme', mode);
}

const savedTheme = localStorage.getItem('cinehub-theme') || 'dark';
setTheme(savedTheme);

/* Inject global CSS so ALL pages auto-adapt */
const style = document.createElement('style');
style.innerHTML = `
:root{
  --bg:#0d0d0d;
  --card:#161616;
  --text:#ffffff;
  --muted:#aaaaaa;
  --accent:#ff4c4c;
}

body{
  background:var(--bg) !important;
  color:var(--text) !important;
  transition:background .35s ease, color .35s ease;
}

header, footer, .modal-content, .movie-card, .section, .footer-col{
  background:var(--card);
  color:var(--text);
}

p, span, small{
  color:var(--muted);
}

a, .logo, h1, h2, h3, h4{
  color:var(--text);
}

button, .filter-btn, .play-btn{
  background:var(--accent);
  color:#fff;
}

.theme-toggle{
  position:fixed;
  bottom:25px;
  right:25px;
  width:48px;
  height:48px;
  border-radius:50%;
  border:none;
  font-size:18px;
  cursor:pointer;
  z-index:9999;
  box-shadow:0 6px 20px rgba(0,0,0,.35);
}
`;
document.head.appendChild(style);

/* Toggle Button */
const toggle = document.createElement('button');
toggle.className = 'theme-toggle';
toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
document.body.appendChild(toggle);

toggle.onclick = () => {
  const next = localStorage.getItem('cinehub-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  toggle.textContent = next === 'dark' ? '☀️' : '🌙';
};

/* ==================================================
   WATCHLIST (unchanged, stable)
   ================================================== */

let watchlist = JSON.parse(localStorage.getItem('cinehub-watchlist') || '[]');

function saveWatchlist() {
  localStorage.setItem('cinehub-watchlist', JSON.stringify(watchlist));
}

function addWatchlistButtons() {
  document.querySelectorAll('.movie-card').forEach(card => {
    if (card.querySelector('.fav')) return;

    const title = card.innerText.trim();

    const fav = document.createElement('span');
    fav.className = 'fav';
    fav.textContent = watchlist.includes(title) ? '❤️' : '🤍';
    fav.style.position = 'absolute';
    fav.style.top = '8px';
    fav.style.right = '8px';
    fav.style.cursor = 'pointer';

    fav.onclick = (e) => {
      e.stopPropagation();
      if (watchlist.includes(title)) {
        watchlist = watchlist.filter(x => x !== title);
        fav.textContent = '🤍';
      } else {
        watchlist.push(title);
        fav.textContent = '❤️';
      }
      saveWatchlist();
    };

    card.style.position = 'relative';
    card.appendChild(fav);
  });
}

setTimeout(addWatchlistButtons, 600);

/* ==================================================
   COUNTER ANIMATION
   ================================================== */

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    let n = 0;
    const step = Math.ceil(target / 60);

    const timer = setInterval(() => {
      n += step;
      if (n >= target) {
        n = target;
        clearInterval(timer);
      }
      el.textContent = n;
    }, 20);
  });
}

window.addEventListener('load', animateCounters);

/* ==================================================
   HOVER TRAILER PREVIEW
   ================================================== */

function enableHoverPreview() {
  document.querySelectorAll('[data-preview]').forEach(card => {
    let video;

    card.addEventListener('mouseenter', () => {
      video = document.createElement('video');
      video.src = card.dataset.preview;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.style.position = 'absolute';
      video.style.inset = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      card.appendChild(video);
    });

    card.addEventListener('mouseleave', () => {
      if (video) video.remove();
    });
  });
}

setTimeout(enableHoverPreview, 600);
