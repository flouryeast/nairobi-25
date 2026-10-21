// engine.js — scroll drives each scene's timeline like a video scrubber; the playhead is held on 12 fps (cut-out stop motion),
// and every .boil element shivers a little at 10 fps, like paper moved by hand between two frames.
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ignoreMobileResize: true});
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FPS = 12;
const SCENES = [];
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const R = (a, b) => a + Math.random()*(b-a);

// scene(id, build, {intro, pxs}): build(tl, el) fills a paused timeline in seconds. The first `intro` seconds play by themselves
// on load; the rest is mapped onto the scroll, `pxs` viewport-heights of scroll per second of film.
function scene(id, build, o={}){
  const el = document.getElementById(id), tl = gsap.timeline({paused: true, defaults: {ease: 'power2.out'}});
  build(tl, el);
  const S = {el, tl, p: 0, cur: 0, last: -1, intro: o.intro || 0, introT: 0, pxs: o.pxs || .5};
  S.st = ScrollTrigger.create({trigger: el, start: 'top top', end: () => '+=' + Math.max(1, tl.duration() - S.intro) * innerHeight * S.pxs,
    pin: true, anticipatePin: 1, onUpdate: st => S.p = st.progress,
    onToggle: st => el.classList.toggle('live', st.isActive)});
  S.playIntro = () => gsap.to(S, {introT: S.intro, duration: REDUCE ? 0 : S.intro, ease: 'none'});
  SCENES.push(S);
  return S;
}

gsap.ticker.add((time, dt) => {
  const k = Math.min(1, dt/1000*6);
  for (const S of SCENES){
    const d = S.tl.duration(), target = Math.min(d, S.introT + S.p*(d - S.intro));
    S.cur += (target - S.cur)*k; if (Math.abs(target - S.cur) < .01) S.cur = target;
    const q = REDUCE ? S.cur : Math.round(S.cur*FPS)/FPS;
    if (q !== S.last){ S.last = q; S.tl.time(q, false) }
  }
});

setInterval(() => {
  if (REDUCE || document.hidden) return;
  for (const e of $$('.live .boil')){
    e.style.translate = `${R(-1.2, 1.2).toFixed(1)}px ${R(-1.2, 1.2).toFixed(1)}px`;
    e.style.rotate = `${R(-.7, .7).toFixed(2)}deg`;
  }
}, 100);

// ---------- timeline vocabulary ----------
const T = {
  // paper pops onto the page: from tiny and crooked to its place, with a little overshoot
  pop(tl, el, at, o={}){ return tl.fromTo(el, {autoAlpha: 0, scale: o.s0 ?? .2, rotation: o.r0 ?? R(-25, 25)},
    {autoAlpha: 1, scale: 1, rotation: o.r ?? 0, duration: o.d ?? .5, ease: 'back.out(2.2)'}, at) },
  // handwriting / typing: reveal left to right
  write(tl, el, at, d=.8){ return tl.fromTo(el, {autoAlpha: 1, clipPath: 'inset(-30% 100% -30% -5%)'}, {clipPath: 'inset(-30% -5% -30% -5%)', duration: d, ease: 'none'}, at) },
  // a cut-out rises from below its own box (mountains, houses)
  rise(tl, el, at, o={}){ return tl.fromTo(el, {yPercent: o.y ?? 120, autoAlpha: 1}, {yPercent: 0, duration: o.d ?? .7, ease: 'back.out(1.4)'}, at) },
  slideIn(tl, el, at, o={}){ return tl.fromTo(el, {x: o.x ?? 0, y: o.y ?? 0, rotation: o.r0 ?? 0, autoAlpha: 1}, {x: 0, y: 0, rotation: o.r ?? 0, duration: o.d ?? .8, ease: o.ease ?? 'power3.out'}, at) },
  out(tl, el, at, o={}){ return tl.to(el, {autoAlpha: 0, y: o.y ?? 0, x: o.x ?? 0, scale: o.s ?? 1, rotation: o.r ?? '+=0', duration: o.d ?? .4, ease: 'power2.in'}, at) },
  // the paper hand brings a figure in, holds it, lets go and leaves
  place(tl, fig, at, o={}){
    const hand = $('.hand', fig);
    tl.fromTo(fig, {x: o.x ?? '75vw', y: o.y ?? '-35vh', rotation: o.r0 ?? 18, autoAlpha: 0}, {x: 0, y: 0, rotation: o.r ?? -3, autoAlpha: 1, duration: o.d ?? 1, ease: 'power3.out'}, at);
    if (hand){
      tl.fromTo(hand, {autoAlpha: 1, x: 0, y: 0}, {x: '60vw', y: '-50vh', rotation: 20, duration: .7, ease: 'power2.in'}, at + (o.d ?? 1) + .15);
      tl.set(hand, {autoAlpha: 0}, at + (o.d ?? 1) + .9);
    }
    const tapes = $$('.tape', fig);
    tapes.forEach((t, i) => T.pop(tl, t, at + (o.d ?? 1) + .3 + i*.15, {s0: 1.6, r0: 0, d: .3}));
    return tl;
  }
};

// paint data-art placeholders with their SVG
function paintArt(root=document){
  for (const el of $$('[data-art]', root)){
    const k = el.dataset.art, s = +(el.dataset.seed || 1), w = 600;
    if (k === 'ridge') el.innerHTML = ridge(w, 260, s, {fill: el.dataset.fill});
    else if (k === 'canyon') el.innerHTML = canyon(w, 260, s);
    else if (k === 'cloud') el.innerHTML = cloud(200, s);
    else if (k === 'bouga') el.innerHTML = bouga(200, s);
    else if (k === 'eiffel') el.innerHTML = eiffel(120, 260);
    else if (k === 'church') el.innerHTML = church(180, 200);
    el.querySelector('svg')?.setAttribute('preserveAspectRatio', k === 'cloud' || k === 'bouga' ? 'xMidYMid meet' : (k === 'ridge' || k === 'canyon' ? 'none' : 'xMidYMax meet'));
  }
  for (const el of $$('.tear')) el.innerHTML = tear(el.dataset.next, el.dataset.next.length * 7);
}
