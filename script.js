/* ── Scroll Reveal ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Project Tabs ── */
function switchTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
  document.querySelectorAll('#tab-' + id + ' .reveal').forEach(el => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), 50);
  });
}

/* ── Birthday Countdown ── */
const BIRTH_MONTH = 10; // October
const BIRTH_DAY   = 17;
const BIRTH_YEAR  = 2009; // ← Set your actual birth year

function getBirthdayInfo() {
  const now     = new Date();
  const thisYear = now.getFullYear();

  // Next birthday this year or next
  let next = new Date(thisYear, BIRTH_MONTH - 1, BIRTH_DAY);
  if (now >= next) next = new Date(thisYear + 1, BIRTH_MONTH - 1, BIRTH_DAY);

  const diff   = next - now;
  const isBday = diff < 1000; // within 1 second = it's today

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);
  const ms    = diff % 1000;

  // Current age (how old you are right now)
  let age = thisYear - BIRTH_YEAR;
  const hasBirthdayPassedThisYear = now >= new Date(thisYear, BIRTH_MONTH - 1, BIRTH_DAY);
  if (!hasBirthdayPassedThisYear) age--;

  return { days, hours, mins, secs, ms, age, isBday };
}

function updateCountdown() {
  const timerEl   = document.getElementById('bday-timer');
  const wrapEl    = document.getElementById('bday-countdown');
  if (!timerEl) return;

  const { days, hours, mins, secs, ms, age, isBday } = getBirthdayInfo();

  if (isBday) {
    timerEl.textContent = '🎉 Today!';
  } else {
    const pad = (n, len = 2) => String(n).padStart(len, '0');
    timerEl.textContent = `${pad(days)}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s ${pad(ms, 3)}ms`;
  }

  // Update tooltip content
  let tooltip = wrapEl.querySelector('.bday-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'bday-tooltip';
    wrapEl.appendChild(tooltip);
  }
  tooltip.textContent = `Age: ${age}  ·  Birthday: October ${BIRTH_DAY}`;
}

updateCountdown();
setInterval(updateCountdown, 50); // 50ms for smooth milliseconds

/* ── Last.fm Now Playing ── */
const LASTFM_USER    = 'vacrtino'; // ← Replace with your Last.fm username
const LASTFM_API_KEY = '2db0871c177a97e3587677c970b45246';  // ← Replace with your free API key from last.fm/api
const FALLBACK_ART   = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';

async function fetchNowPlaying() {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;

  const artEl      = document.getElementById('hero-lastfm-art');
  const trackEl    = document.getElementById('hero-np-track');
  const artistEl   = document.getElementById('hero-np-artist');
  const statusText = document.getElementById('hero-status-text');
  const statusDot  = document.getElementById('hero-status-dot');
  const pulse      = document.getElementById('hero-lastfm-pulse');

  try {
    const res  = await fetch(url);
    const data = await res.json();

    if (data.error) {
      statusText.textContent = 'Set API key in script.js';
      trackEl.textContent    = '—';
      artistEl.textContent   = '—';
      return;
    }

    const track  = data.recenttracks.track[0];
    const isLive = track['@attr']?.nowplaying === 'true';
    const art    = track.image?.find(i => i.size === 'large')?.['#text'] || FALLBACK_ART;

    trackEl.textContent  = track.name;
    artistEl.textContent = track.artist['#text'];
    if (artEl) artEl.src = art || FALLBACK_ART;

    statusText.textContent = isLive ? 'Now Listening' : 'Last Scrobbled';
    statusDot?.classList.toggle('live', isLive);
    pulse?.classList.toggle('active', isLive);

  } catch (err) {
    if (statusText) statusText.textContent = 'Could not load';
    console.error('Last.fm error:', err);
  }
}

fetchNowPlaying();
setInterval(fetchNowPlaying, 10000);
