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

/* ── Live Age Counter ── */
(function() {
  var birthday = new Date(2009, 9, 17).getTime(); // October 17, 2009
  var wholeEl   = document.getElementById('age-whole');
  var decimalEl = document.getElementById('age-decimal');
  if (!wholeEl || !decimalEl) return;

  function updateAge() {
    var now = Date.now();
    var age = (now - birthday) / (365.2425 * 24 * 60 * 60 * 1000);
    var whole = Math.floor(age);
    var frac  = (age - whole).toFixed(9).substring(1); // ".123456789"
    wholeEl.textContent   = whole;
    decimalEl.textContent = frac;
  }
  updateAge();
  setInterval(updateAge, 50);
})();

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
/* ── Dog Modal ── */
function openDogModal(e) {
  const overlay = document.getElementById('dog-modal-overlay');
  overlay.classList.add('open');
  // Trap focus / close on Escape
  document.addEventListener('keydown', onEscDog);
}

function closeDogModal() {
  const overlay = document.getElementById('dog-modal-overlay');
  overlay.classList.remove('open');
  document.removeEventListener('keydown', onEscDog);
}

function onEscDog(e) {
  if (e.key === 'Escape') closeDogModal();
}
