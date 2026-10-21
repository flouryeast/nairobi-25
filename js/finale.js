// finale.js — the cake (tap or real blowing into the microphone), the reveal, and the 25 face-down cards along a ribbon through Paris
const cs = $('#candles');
// 25 candles planted in the icing: three rows on the oval top of the cake, back to front
[[8, .3], [9, .55], [8, .8]].reduce((n, [count, y], row) => {
  const half = Math.sqrt(1 - ((y - .5)/.5)**2) * .5 * .86;
  for (let k=0;k<count;k++){
    const c = document.createElement('button'); c.type = 'button'; c.className = 'candle'; c.setAttribute('aria-label', 'Vela ' + (n + k + 1));
    c.innerHTML = '<span class="smoke"></span>';
    c.style.left = ((.5 - half + 2*half*(k + .5)/count)*100).toFixed(1) + '%'; c.style.top = `calc(${y*100}% - 38px)`; c.style.zIndex = row + 1;
    cs.appendChild(c);
  }
  return n + count;
}, 0);
const candles = $$('.candle', cs);
let revealed = false;
const lit = () => candles.filter(c => !c.classList.contains('out'));
function snuff(c){ if (c.classList.contains('out')) return; c.classList.add('out'); if (!lit().length) setTimeout(reveal, 700) }
candles.forEach(c => c.addEventListener('click', () => snuff(c)));
$('#blow').addEventListener('click', () => { const l = lit(); l.forEach((c, i) => setTimeout(() => snuff(c), REDUCE ? 0 : i*60 + R(0, 60))) });

// blowing for real: the mic level puffs candles out one by one while it stays loud.
// The microphone is asked for once, from the button on the first screen (or the one under the cake); listening starts when the cake is on screen.
let MIC = null, listening = false;
async function askMic(){
  if (MIC) return MIC;
  const stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const ac = new (window.AudioContext || window.webkitAudioContext)();
  MIC = {stream, ac}; return MIC;
}
function listen(){
  if (!MIC || listening || !lit().length) return; listening = true;
  const {stream, ac} = MIC; ac.resume();
  const an = ac.createAnalyser(); an.fftSize = 512; ac.createMediaStreamSource(stream).connect(an); const buf = new Uint8Array(an.fftSize);
  $('#mic').textContent = 'Sopla fuerte…'; $('#mic').disabled = true;
  const loop = () => {
    an.getByteTimeDomainData(buf); let s = 0; for (const v of buf) s += ((v-128)/128)**2;
    if (Math.sqrt(s/buf.length) > .12){ const l = lit(); for (let k=0;k<Math.min(l.length, 2);k++) snuff(l[Math.floor(Math.random()*l.length)]) }
    if (lit().length) requestAnimationFrame(loop); else { stream.getTracks().forEach(t => t.stop()); ac.close() }
  };
  loop();
}
$('#mic').addEventListener('click', async e => {
  try { await askMic(); listen() } catch { e.currentTarget.textContent = 'Sin micrófono: toca las velas'; e.currentTarget.disabled = true }
});
new IntersectionObserver(es => es.forEach(x => x.isIntersecting && listen()), {threshold: .5}).observe($('#cake'));

$('#start').addEventListener('click', async e => {
  const btn = e.currentTarget; startSong();
  try { await askMic(); btn.innerHTML = '<span>♪</span> Listo, sigue bajando'; } catch { btn.innerHTML = '<span>♪</span> Sonido listo (sin micrófono)' }
  btn.classList.add('done'); setTimeout(() => gsap.to(btn, {autoAlpha: 0, y: 20, duration: .4}), 1400);
});

function reveal(){
  if (revealed) return; revealed = true;
  $('.blow-row').hidden = true; $('#cake-hint').hidden = true;
  burst();
  const r = $('#reveal'); r.hidden = false;
  const tl = gsap.timeline({delay: .6});
  ['.r1', '.r2', '.r3', '.r4', '.r5', '.r6'].forEach((s, i) => tl.fromTo($(s, r), {autoAlpha: 0, y: 24, rotation: R(-4, 4)}, {autoAlpha: 1, y: 0, rotation: s === '.r4' ? -3 : 0, duration: .6, ease: 'back.out(2)'}, [0, 1.8, 2.8, 4.2, 5.2, 6][i]));
  setTimeout(() => r.scrollIntoView({behavior: 'smooth', block: 'center'}), 300);
}

// a puff of paper confetti from the cake
function burst(){
  const box = $('#cake'), cols = ['#F2B83B', '#E0457B', '#8FC3E6', '#8BD448', '#EE6A2B', '#FBF7EE'];
  for (let i=0;i<70;i++){
    const p = document.createElement('i');
    p.style.cssText = `position:absolute;left:50%;top:30%;width:${R(6, 12)}px;height:${R(8, 16)}px;background:${cols[i%6]};z-index:5;pointer-events:none`;
    box.appendChild(p);
    gsap.to(p, {x: R(-220, 220), y: R(-260, 40), rotation: R(-720, 720), duration: R(.8, 1.4), ease: 'power3.out', onComplete: () => gsap.to(p, {y: '+=320', autoAlpha: 0, duration: R(1.2, 2), ease: 'power1.in', onComplete: () => p.remove()})});
  }
}

// ---------- the 25 citas ----------
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const trail = $('#trail');
let lastMes = '', row;
CITAS.forEach(c => {
  if (c.mes !== lastMes){
    lastMes = c.mes; const [y, m] = c.mes.split('-').map(Number);
    trail.insertAdjacentHTML('beforeend', `<div class="month"><span>${MESES[m-1]}</span><small>${y}</small></div>`);
    row = document.createElement('div'); row.className = 'row'; trail.appendChild(row);
  }
  const [y, m] = c.mes.split('-').map(Number);
  const b = document.createElement('button'); b.type = 'button'; b.className = 'card'; b.setAttribute('aria-label', `Cita ${c.n}, ${MESES[m-1]}: toca para descubrirla`);
  b.innerHTML = `<div class="in"><div class="f"><span class="m">${MESES[m-1].slice(0, 3)} · ${String(y).slice(2)}</span><span class="num">${c.n}</span><span class="q">¿qué será?</span></div>
    <div class="b"><span class="m">cita ${c.n} · ${MESES[m-1]}</span>${ICONS[c.n] || ''}<strong></strong><span class="d">${c.date || ''}</span></div></div>`;
  $('strong', b).textContent = c.es;
  b.dataset.n = c.n;
  b.addEventListener('click', () => {
    if (b.classList.contains('locked')){ gsap.fromTo(b, {x: -6}, {x: 0, duration: .4, ease: 'elastic.out(4, .3)'}); return }
    b.classList.toggle('flip'); b.setAttribute('aria-label', b.classList.contains('flip') ? `Cita ${c.n}: ${c.es}` : `Cita ${c.n}, ${MESES[m-1]}`); count();
  });
  row.appendChild(b);
});
function count(){ lockCards(true) }

// one cita more every hour from midnight: a locked card shows when it opens, and pops when its hour comes
function lockCards(first){
  for (const b of $$('.card')){
    const n = +b.dataset.n, open = citaOpen(n), q = $('.f .q', b);
    if (!open){ b.classList.add('locked'); q.textContent = `se abre a las ${hourInColombia(citaOpensAt(n))}`; b.setAttribute('aria-label', `Cita ${n}: se abre a las ${hourInColombia(citaOpensAt(n))}`) }
    else if (b.classList.contains('locked')){
      b.classList.remove('locked'); q.textContent = '¿qué será?'; b.setAttribute('aria-label', `Cita ${n}: toca para descubrirla`);
      if (!first) gsap.fromTo(b, {scale: 1.25, rotation: -8}, {scale: 1, rotation: 0, duration: .6, ease: 'back.out(3)'});
    }
  }
  const open = $$('.card:not(.locked)').length;
  $('#counter').innerHTML = `<b>${$$('.card.flip').length}</b>/${open}${open < 25 ? ' <small>abiertas</small>' : ''}`;
}
lockCards(true); setInterval(lockCards, 20000);

// the ribbon through the year, and the red bike from Montevideo riding it with the scroll
const tsvg = $('#trail-svg'), tpath = $('#trail-path'), bikeEl = $('#bike');
bikeEl.innerHTML = bike(76, '#C2362B');
let TL = 0;
function buildTrail(){
  const W = trail.clientWidth, H = trail.clientHeight; tsvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const marks = $$('.month', trail).map(m => m.offsetTop + m.offsetHeight/2);
  let d = `M ${W/2} 0`;
  marks.forEach((y, i) => { const x = W/2 + (i%2 ? -1 : 1)*W*.36; d += ` C ${x} ${y-120}, ${x} ${y-40}, ${W/2} ${y}` });
  d += ` L ${W/2} ${H}`;
  tpath.setAttribute('d', d);
  tpath.setAttribute('stroke', '#EE6A2B'); tpath.setAttribute('stroke-width', '18'); tpath.setAttribute('stroke-linecap', 'round');
  TL = tpath.getTotalLength();
}
function rideTo(p){
  if (!TL) return; const a = tpath.getPointAtLength(p*TL), b = tpath.getPointAtLength(Math.min(TL, p*TL + 3));
  bikeEl.style.transform = `translate(${a.x - 38}px, ${a.y - 44}px) scaleX(${b.x < a.x ? -1 : 1})`;
  tpath.style.strokeDasharray = TL; tpath.style.strokeDashoffset = TL*(1-p);
}

$('#go-citas').addEventListener('click', openCitas);
function openCitas(){
  const sec = $('#citas'); if (!sec.hidden){ sec.scrollIntoView({behavior: 'smooth'}); return }
  sec.hidden = false;
  buildTrail(); rideTo(0);
  ScrollTrigger.create({trigger: trail, start: 'top 70%', end: 'bottom 70%', onUpdate: s => rideTo(s.progress)});
  ScrollTrigger.create({trigger: sec, start: 'top 60%', end: 'bottom bottom', onToggle: s => $('#counter').classList.toggle('on', s.isActive)});
  $$('.card', sec).forEach(c => gsap.from(c, {scale: .2, rotation: R(-30, 30), autoAlpha: 0, duration: .6, ease: 'back.out(2)', scrollTrigger: {trigger: c, start: 'top 92%'}}));
  $$('.month span', sec).forEach(m => gsap.from(m, {scale: 2.2, autoAlpha: 0, rotation: -18, duration: .35, ease: 'power4.in', scrollTrigger: {trigger: m, start: 'top 88%'}}));
  gsap.from('#fin > *', {y: 30, autoAlpha: 0, stagger: .4, duration: .7, scrollTrigger: {trigger: '#fin', start: 'top 70%'}});
  ScrollTrigger.refresh();
  // iOS fires 'resize' whenever the address bar slides in or out while scrolling; re-measuring the pinned scenes then makes
  // the page jump back up (to the map). Only a real width change (rotation) is worth a refresh.
  let lastW = innerWidth;
  addEventListener('resize', () => { if (innerWidth === lastW) return; lastW = innerWidth; buildTrail(); ScrollTrigger.refresh() });
  requestAnimationFrame(() => sec.scrollIntoView({behavior: 'smooth'}));
}

// optional music: drop a file at audio/cancion.mp3 and the ♪ button appears; it starts on the first tap anywhere
// a discreet shortcut to the end, offered only from 4 a.m. (Colombia) so the first visit is the whole story;
// it leads to the cake if the candles are still lit, to the citas once they are revealed
const SKIP_FROM = OPEN_AT + 4*HOUR, skip = $('#skip');
let nearEnd = false;
function showSkip(){ skip.hidden = now() < SKIP_FROM || nearEnd }
skip.addEventListener('click', () => { if (revealed) openCitas(); else $('#cumple').scrollIntoView({behavior: 'smooth'}) });
new IntersectionObserver(es => { nearEnd = es.some(e => e.isIntersecting); showSkip() }).observe($('#cumple'));
new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)){ nearEnd = true; showSkip() } }).observe($('#citas'));
showSkip(); setInterval(showSkip, 30000);

const song = new Audio('audio/cancion.mp3'); song.loop = true;
song.addEventListener('canplaythrough', () => { $('#sound').hidden = false }, {once: true});
song.load();
let started = false;
function startSong(){ if (!started && !$('#sound').hidden){ started = true; song.play().catch(() => {}) } }
addEventListener('pointerdown', e => { if (!e.target.closest('#sound')) startSong() });
$('#sound').addEventListener('click', e => { e.stopPropagation(); if (song.paused){ song.play(); e.currentTarget.classList.remove('off') } else { song.pause(); e.currentTarget.classList.add('off') } });
