// gate.js — the site opens at midnight, Colombia time, on 22 October 2026; then one more cita unlocks every hour.
// Test links (a plain #anchor after the address):
//   #prueba          everything open, all 25 cards
//   #prueba-antes    the closed screen, as if it were 23:58 the evening before
//   #prueba-3        3 a.m. on the 22nd: site open, cards 1 to 4 open
//   #prueba-notif    like #prueba, but also sends the phone notifications (marked [test])
const OPEN_AT = Date.UTC(2026, 9, 22, 5, 0, 0);   // 00:00 in Bogotá (UTC−5, no daylight saving)
const HOUR = 3600e3;
const TEST = (() => {
  const h = location.hash.slice(1);
  if (h === 'prueba' || h === 'prueba-notif') return OPEN_AT + 25*HOUR - Date.now();
  if (h === 'prueba-antes') return OPEN_AT - 2*60e3 - Date.now();
  const m = h.match(/^prueba-(\d{1,2})$/); if (m) return OPEN_AT + (+m[1])*HOUR + 60e3 - Date.now();
  return 0;
})();
addEventListener('hashchange', () => location.reload());
const now = () => Date.now() + TEST;
const citaOpensAt = n => OPEN_AT + (n - 1)*HOUR;
const citaOpen = n => now() >= citaOpensAt(n);
const hourInColombia = t => new Date(t).toLocaleTimeString('es-CO', {timeZone: 'America/Bogota', hour: 'numeric', minute: '2-digit'});

// the closed screen: an envelope taped shut, with the countdown to midnight
(function gate(){
  if (now() >= OPEN_AT) return;
  document.documentElement.classList.add('closed');
  document.body.insertAdjacentHTML('afterbegin', `<div class="gate" id="gate">
    <div class="gate-in">
      <p class="kicker">22 · 10 · 2026</p>
      <h1 class="h1">Todavía no…</h1>
      <div class="env"><div class="flap"></div><span class="seal">N</span><img class="tape g1" src="img/kit/tape.webp" alt=""><img class="tape g2" src="img/kit/tape.webp" alt=""></div>
      <p class="slip">Esto se abre a medianoche, hora de Colombia.</p>
      <p class="count" id="count" aria-live="polite"></p>
      <p class="fr">patience, mon amour</p>
    </div></div>`);
  const tick = () => {
    const left = OPEN_AT - now();
    if (left <= 0){ openGate(); return }
    const s = Math.ceil(left/1000), hh = Math.floor(s/3600), mm = Math.floor(s%3600/60), ss = s%60;
    $('#count').innerHTML = [hh, mm, ss].map(v => `<b>${String(v).padStart(2, '0')}</b>`).join('<i>:</i>');
    setTimeout(tick, 250);
  };
  function openGate(){
    const g = $('#gate');
    gsap.timeline({onComplete: () => { g.remove(); document.documentElement.classList.remove('closed'); ScrollTrigger.refresh(); dispatchEvent(new Event('gate-open')) }})
      .to('#gate .flap', {rotationX: 180, duration: .5, ease: 'power2.in'})
      .to('#gate .tape', {y: -40, rotation: 30, autoAlpha: 0, duration: .3}, 0)
      .to('#gate .gate-in', {y: '-12vh', autoAlpha: 0, duration: .5, ease: 'power2.in'}, .4)
      .to(g, {autoAlpha: 0, duration: .5}, .7);
  }
  tick();
})();
