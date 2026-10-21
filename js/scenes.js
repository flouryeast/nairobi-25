// scenes.js — the six films of the story. Times are in seconds of film; the scroll is the playhead.
paintArt();
$$('.tear').forEach((el, i) => el.innerHTML = tear(el.dataset.next, 3 + i*5));

// ================= 0 · BARICHARA SE CONSTRUYE =================
const CATEDRAL = church(200, 250);
const TOWN = [[20,150,130,0],[17,130,140,1],[30,'church'],[17,140,136,3],[21,165,128,4]];
$('#town').innerHTML = TOWN.map(([w, a, b, s]) => `<div style="width:${w}%">${a === 'church' ? CATEDRAL : house(a, b, s + 1)}</div>`).join('');
$$('#town svg').forEach(s => s.setAttribute('preserveAspectRatio', 'xMidYMax meet'));

const S0 = scene('s-barichara', (tl, el) => {
  const h = $$('#town > div');
  T.pop(tl, $('.sun', el), 0, {s0: .1, d: .6});
  T.write(tl, $('.title .kicker', el), .2, .5);
  T.write(tl, $('.title .h1', el), .5, 1.1);
  T.rise(tl, $('.mtn.far', el), .3, {y: 100});
  T.rise(tl, $('.mtn.mid', el), .6, {y: 100});
  T.rise(tl, $('.ground', el), .5, {y: 100});
  h.forEach((d, i) => tl.fromTo(d, {scaleY: 0, transformOrigin: '50% 100%', autoAlpha: 0}, {scaleY: 1, autoAlpha: 1, duration: .45, ease: 'back.out(2.5)'}, .9 + [0,2,4,3,1][i]*.22));
  $$('.cloud', el).forEach((c, i) => T.pop(tl, c, 2.3 + i*.2));
  T.pop(tl, $('.hint', el), 2.9, {r0: 0});
  tl.set({}, {}, 3.4);
  // — scroll from here —
  T.out(tl, $('.hint', el), 3.5);
  T.out(tl, $('#start'), 3.5, {y: 20});
  tl.to($('.title', el), {y: '-40vh', duration: .9, ease: 'power2.in'}, 3.6);
  tl.to($('#town', el), {scale: 1.45, yPercent: 14, transformOrigin: '50% 100%', duration: 1.3, ease: 'power2.inOut'}, 3.7);
  tl.to($('.mtn.mid', el), {scale: 1.2, transformOrigin: '50% 100%', duration: 1.3, ease: 'power2.inOut'}, 3.7);
  tl.to($('.sun', el), {y: '12vh', duration: 1.3}, 3.7);
  T.place(tl, $('#b-casa'), 4.4, {r: -4});
  T.pop(tl, $('#b-t1'), 6.1, {r: -1.5});
  T.place(tl, $('#b-tienda'), 7.0, {x: '-80vw', y: '20vh', r0: -20, r: 5});
  T.write(tl, $('#b-t2'), 8.6, .9);
  tl.set({}, {}, 10.4);
}, {intro: 3.4, pxs: .5});

// ================= 1 · Y LLEGASTE TÚ =================
const STREET = [];
for (let i=0;i<10;i++) STREET.push(i === 4 ? `<div style="width:15%">${CATEDRAL}</div>` : `<div style="width:${9.4 + (i*37 % 4)*.5}%">${house(130 + (i*53 % 50), 120 + (i*29 % 30), 20 + i)}</div>`);
$('#strip').innerHTML = `<div class="a srow" style="left:0;bottom:12%;width:100%;height:70%;display:flex;align-items:flex-end">${STREET.join('')}</div>`;
$$('#strip svg').forEach(s => { s.setAttribute('preserveAspectRatio', 'xMidYMax meet'); s.style.cssText = 'width:100%;height:auto;display:block;filter:var(--shadow)' });
$('#strip').style.cssText = 'left:0;top:0;height:100%;width:300%';
$('#strip').insertAdjacentHTML('beforeend', `<div class="a" style="left:0;bottom:0;width:100%;height:12.5%;background:radial-gradient(circle,rgba(27,26,23,.25) 2px,transparent 2.6px) 0 0/14px 10px,#B9773F;border-top:4px solid #FBF7EE"></div><div class="a" id="soles" style="left:0;bottom:0;width:100%;height:12%"></div>`);
$('.cobbles').remove(); $('#steps').remove();

const S1 = scene('s-llegaste', (tl, el) => {
  T.write(tl, $('#l-t1'), .2, .8);
  tl.fromTo($('.leaf.l', el), {rotationY: 0}, {rotationY: -112, duration: 1.3, ease: 'power2.inOut'}, 1.2);
  tl.fromTo($('.leaf.r', el), {rotationY: 0}, {rotationY: 112, duration: 1.3, ease: 'power2.inOut'}, 1.25);
  tl.fromTo($('#l-nai'), {scale: 1.25}, {scale: 1, duration: 1.4, ease: 'power2.out'}, 1.3);
  T.pop(tl, $('#l-tu'), 2.3, {r: -2, r0: -12, s0: .4});
  T.write(tl, $('#l-fr'), 2.9, .5);
  tl.to($('#door'), {scale: 6, transformOrigin: '50% 62%', duration: 1.1, ease: 'power3.in'}, 3.7);
  tl.to([$('#l-t1'), $('#l-tu'), $('#l-fr'), $('.zocalo', el), ...$$('[data-art="bouga"]', el)], {autoAlpha: 0, duration: .5}, 3.7);
  tl.fromTo($('#street'), {autoAlpha: 0}, {autoAlpha: 1, duration: .4}, 4.5);
  tl.to($('.stage', el), {backgroundColor: '#F2B83B', duration: .4}, 4.5);
  tl.to($('#door'), {autoAlpha: 0, duration: .1}, 4.9);
  const WALK = 9;
  tl.fromTo($('#strip'), {xPercent: 0}, {xPercent: -66.7, duration: WALK, ease: 'none'}, 4.7);
  // footprints, hers and mine, appearing under our two heads as the street goes by
  const soles = $('#soles');
  for (let k=0;k<22;k++){
    const s = (24 + k*3.1), d = document.createElement('div');
    d.className = 'a'; d.style.cssText = `left:${s}%;bottom:${k%2 ? 18 : 48}%;width:.9%;rotate:90deg`;
    d.innerHTML = sole(20, k%4 < 2 ? '#1B1A17' : '#D2582E');
    soles.appendChild(d);
    const p = (s - 20.7)/66.7;
    tl.fromTo(d, {autoAlpha: 0, scale: 1.8}, {autoAlpha: .85, scale: 1, duration: .15, ease: 'power2.out'}, 4.7 + Math.max(0, p)*WALK);
  }
  // our two heads on little drawn bodies, walking: legs and arms swing in opposition, the head bobs
  $$('.walker', el).forEach((w, n) => {
    w.insertAdjacentHTML('beforeend', walkerBody(w.dataset.who));
    T.pop(tl, w, 4.9 + n*.1, {r0: n ? 30 : -30});
    const reps = Math.round(WALK/.25) - 1, at = 5.2 + n*.12, sw = {duration: .25, ease: 'none', yoyo: true, repeat: reps};
    tl.fromTo($('.leg-l', w), {rotation: -16, transformOrigin: '50% 0%'}, {rotation: 16, ...sw}, at);
    tl.fromTo($('.leg-r', w), {rotation: 16, transformOrigin: '50% 0%'}, {rotation: -16, ...sw}, at);
    tl.fromTo($('.arm-l', w), {rotation: 14, transformOrigin: '50% 0%'}, {rotation: -14, ...sw}, at);
    if (w.dataset.who === 'nai') tl.fromTo($('.arm-r', w), {rotation: -14, transformOrigin: '50% 0%'}, {rotation: 14, ...sw}, at);
    tl.to($('.w-head', w), {y: -6, rotation: n ? 4 : -4, ...sw}, at);
  });
  T.pop(tl, $('#l-t2'), 5.0, {r: -1.5});
  T.place(tl, $('#l-tel'), 5.5, {r: 5});
  T.write(tl, $('#l-fr3'), 6.6, .8);
  T.out(tl, [$('#l-t2'), $('#l-tel'), $('#l-fr3')], 7.9, {y: -20});
  T.pop(tl, $('#l-t3'), 8.1, {r: 1.2});
  T.write(tl, $('#l-t4'), 8.8, .8);
  T.out(tl, [$('#l-t3'), $('#l-t4')], 10.0, {y: -20});
  T.place(tl, $('#l-relook'), 10.2, {r: 4});
  T.write(tl, $('#l-fr2'), 11.4, .8);
  T.out(tl, [$('#l-relook'), $('#l-fr2')], 12.6, {x: '-40vw', r: -12});
  T.place(tl, $('#l-velitas'), 12.9, {x: '-75vw', r0: -16, r: -2});
  T.pop(tl, $('#l-t5'), 14.3, {r: -1.5});
  tl.set({}, {}, 15.8);
}, {pxs: .5});

// ================= 2 · LA MOTO =================
const S2 = scene('s-moto', (tl, el) => {
  T.write(tl, $('#m-title'), .1, 1.1);
  tl.fromTo($('#moto'), {x: '-95vw', rotation: -6}, {x: 0, rotation: 0, duration: 1.5, ease: 'power3.out'}, .9);
  tl.to($('#moto'), {rotation: -3, yPercent: -3, duration: .15, yoyo: true, repeat: 1}, 2.4);
  T.pop(tl, $('#m-recipe'), 2.6, {r: 2, r0: 20});
  $$('#m-recipe .ing').forEach((g, i) => T.write(tl, g, 3.0 + i*.4, .35));
  $$('.bag', el).forEach((b, i) => tl.fromTo(b, {y: '-70vh', rotation: R(-60, 60), autoAlpha: 1}, {y: 0, rotation: R(-12, 12), duration: .55, ease: 'bounce.out'}, 4.8 + i*.3));
  T.out(tl, $('#m-recipe'), 6.4, {y: -20, r: 8});
  T.pop(tl, $('#m-fr2'), 6.6, {r: -6, s0: .3});
  tl.to($('#moto'), {x: '120vw', rotation: -5, duration: 1.1, ease: 'power3.in'}, 7.6);
  T.out(tl, [$('#m-fr2'), $('#m-title')], 8.4, {y: -30});
  tl.set({}, {}, 9.2);
}, {pxs: .5});

// ================= 3 · LA RUTA: a paper map on a table, photos popping up like a pop-up book =================
const M = window.MAP, plane = $('#plane');
const GEO = {bogota:[-74.07,4.71], barichara:[-73.22,6.64], quito:[-78.5,-0.2], huanchaco:[-79.12,-8.08], huaraz:[-77.53,-9.53], huacachina:[-75.76,-14.09], nazca:[-74.94,-14.83], montanita:[-80.75,-1.93], mancora:[-81.05,-4.10], purmamarca:[-65.50,-23.74],
  cusco:[-71.97,-13.53], lares:[-72.05,-13.1], puno:[-70.02,-15.84], lapaz:[-68.15,-16.5], uyuni:[-66.82,-20.46], tucuman:[-65.2,-26.82], baires:[-58.38,-34.6], montevideo:[-56.16,-34.9]};
const ROUTE = [
  {k:'bogota'},
  {k:'montanita', kick:'Ecuador · la costa', t:'Voluntariado y surf', p:'Trabajamos de voluntarios frente al mar, surfeamos, y cada tarde el sol se hundía en el Pacífico.', img:['img/atardecer.webp', 'img/ecuador.webp'], side:1},
  {k:'mancora', kick:'Perú · Máncora', t:'El primer ceviche', p:'Arena, sol y tu primer ceviche peruano.', fr:'le citron, partout', img:['img/mancora.webp'], side:1},
  {k:'huanchaco', kick:'Perú · la costa', t:'Huanchaco', p:'Surf, deporte… y pizzas argelinas.', img:['img/surf.webp'], side:-1},
  {k:'huaraz', kick:'Perú · Cordillera Blanca', t:'Ramen a 4 600 m', p:'Ramen frente a una laguna turquesa, a 4 600 metros. El mejor restaurante del mundo.', img:['img/ramen4600.webp'], side:1},
  {k:'huacachina', kick:'Perú · el desierto', t:'Huacachina', p:'Dunas al atardecer y arena hasta en las orejas.', img:['img/dune.webp', 'img/allonges.webp'], side:-1},
  {k:'nazca', kick:'Perú · Nazca', t:'La moto dijo basta', p:'Se rompió en pleno desierto. Ni un taller a la vista.', fr:'et maintenant ?', brk:true},
  {k:'cusco', kick:'Nazca → Cusco', t:'16 horas de camión', p:'Subimos a Cusco en la caja de un camión, con la moto atrás y el cielo lleno de estrellas. Allá la arreglamos y volvimos a arrancar.', fr:'les étoiles les plus folles de ma vie', img:['img/camion.webp', 'img/panne.webp'], side:1, leg:'truck', fix:true},
  {k:'lares', kick:'Perú · trek de Lares', t:'La noche más fría', p:'Casi nos morimos de frío durmiendo afuera… y terminamos en la casa de una familia, junto al fogón.', fr:'on a eu chaud au cœur', img:['img/fogon.webp', 'img/lares.webp'], side:-1},
  {k:'puno', kick:'Titicaca', t:'El lago, en banda', p:'En lancha por el Titicaca con Brian, Arnau, Sofía y Jazmina.', img:['img/titicaca.webp', 'img/road.webp'], side:1},
  {k:'lapaz', kick:'Bolivia', t:'La Paz', p:'El Mercado de las Brujas y sus llamas secas.', img:['img/lapaz.webp'], side:-1},
  {k:'uyuni', kick:'Bolivia', t:'Uyuni', p:'El cielo en el suelo.', fr:'une moto sur un miroir', img:['img/uyuni-p.webp'], side:1},
  {k:'purmamarca', kick:'Argentina · Jujuy', t:'Purmamarca', p:'Feos y viejos, pero felices.', img:['img/purmamarca.webp'], side:-1},
  {k:'tucuman', kick:'Argentina', t:'En tren', p:'De Tucumán a Buenos Aires, de un tirón.', art:'train', side:1},
  {k:'baires', pass:true, leg:'train'},
  {k:'montevideo', kick:'Uruguay', t:'Montevideo', p:'Unos meses en Montevideo, en una bici roja de las de antes.', fr:'la vie en vélo rouge', img:['img/salvo.webp', 'img/bici.webp'], side:1},
  {k:'barichara', kick:'Colombia', t:'De vuelta a casa', p:'Y un día volamos de vuelta a Colombia.', leg:'flight', end:true}
];
const pt = k => M.stops[k];
const haversine = (a, b) => { const [lo1, la1] = GEO[a], [lo2, la2] = GEO[b], r = Math.PI/180, dl = (la2-la1)*r, dn = (lo2-lo1)*r;
  const h = Math.sin(dl/2)**2 + Math.cos(la1*r)*Math.cos(la2*r)*Math.sin(dn/2)**2; return 12742*Math.asin(Math.sqrt(h)) };

// the map: countries, graticule, labels, then one path per leg
const NS = 'http://www.w3.org/2000/svg';
plane.innerHTML = `<svg viewBox="0 0 ${M.W} ${M.H}" xmlns="${NS}">
  <defs><pattern id="mdots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.3" fill="#1B1A17" opacity=".16"/></pattern></defs>
  <path d="${M.grat}" fill="none" stroke="#1B1A17" stroke-opacity=".12" stroke-width="1"/>
  ${M.countries.map(c => `<path d="${c.d}" fill="${c.v ? '#F3E3BE' : '#DCC9A0'}" stroke="#FBF7EE" stroke-width="5" stroke-linejoin="round"/>`).join('')}
  ${M.countries.map(c => `<path d="${c.d}" fill="url(#mdots)" stroke="#1B1A17" stroke-opacity=".55" stroke-width="1.1"/>`).join('')}
  ${Object.entries(M.labels).map(([n, [x, y]]) => `<text x="${x}" y="${y}" font-family="Space Mono, monospace" font-size="${['Brasil','Argentina'].includes(n) ? 26 : 15}" letter-spacing="3" fill="#1B1A17" fill-opacity=".45" text-anchor="middle">${n.toUpperCase()}</text>`).join('')}
  <g id="legs"></g>
  <path d="M${pt('barichara')[0]} ${pt('barichara')[1]-14} l4 9 l10 1 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 l10 -1z" fill="#E0457B" stroke="#1B1A17" stroke-width="1.5"/>
</svg>`;
const legsG = $('#legs', plane);
const SEG = [];
for (let i=1;i<ROUTE.length;i++){
  const a = pt(ROUTE[i-1].k), b = pt(ROUTE[i].k), type = ROUTE[i].leg || 'road';
  const mx = (a[0]+b[0])/2, my = (a[1]+b[1])/2, dx = b[0]-a[0], dy = b[1]-a[1], len = Math.hypot(dx, dy);
  const bend = type === 'flight' ? .45 : (i%2 ? .18 : -.18);
  const c = [mx - dy/len*len*bend, my + dx/len*len*bend];
  const d = `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
  const tmp = document.createElementNS(NS, 'path'); tmp.setAttribute('d', d); legsG.appendChild(tmp);
  const L = tmp.getTotalLength(), samples = [];
  for (let j=0;j<=40;j++){ const p = tmp.getPointAtLength(j/40*L); samples.push([p.x, p.y]) }
  tmp.remove();
  const g = document.createElementNS(NS, 'g');
  g.innerHTML = type === 'road' ? `<path fill="none" stroke="#FBF7EE" stroke-width="15" stroke-linecap="round"/><path fill="none" stroke="#EE6A2B" stroke-width="10" stroke-linecap="round"/>`
    : type === 'train' ? `<path fill="none" stroke="#1B1A17" stroke-width="12" stroke-dasharray="2 7"/><path fill="none" stroke="#EE6A2B" stroke-width="5"/>`
    : type === 'truck' ? `<path fill="none" stroke="#221C2B" stroke-width="8" stroke-dasharray="12 7" stroke-linecap="round"/>`
    : type === 'ferry' ? `<path fill="none" stroke="#3B5E8C" stroke-width="4" stroke-dasharray="7 6" stroke-linecap="round"/>`
    : `<path fill="none" stroke="#1B1A17" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/>`;
  legsG.appendChild(g);
  const km = (type === 'flight' ? 1 : 1.3) * haversine(ROUTE[i-1].k, ROUTE[i].k);
  SEG.push({type, samples, g, d, km, done: -1});
}
// the odometer is scaled so the road reads what we really rode: 11 200 km from Bogotá to Montevideo
const KM_SCALE = 11200 / SEG.filter(g => g.type !== 'flight').reduce((a, g) => a + g.km, 0);
const partial = (s, f) => { const n = Math.max(1, Math.round(f*40)); let d = `M${s[0][0]} ${s[0][1]}`; for (let j=1;j<=n;j++) d += ` L${s[j][0].toFixed(1)} ${s[j][1].toFixed(1)}`;
  const k = f*40 - Math.floor(f*40), j = Math.floor(f*40); if (j < 40 && k > 0) d += ` L${(s[j][0]+(s[j+1][0]-s[j][0])*k).toFixed(1)} ${(s[j][1]+(s[j+1][1]-s[j][1])*k).toFixed(1)}`; return d };
const posAt = (s) => { const i = Math.min(SEG.length-1, Math.floor(s)), f = s - i, sm = SEG[i].samples, j = Math.min(39, Math.floor(f*40)), k = f*40 - j;
  return {i, f, x: sm[j][0] + (sm[j+1][0]-sm[j][0])*k, y: sm[j][1] + (sm[j+1][1]-sm[j][1])*k, dir: Math.sign(sm[j+1][0]-sm[j][0]) || 1} };

// pop-ups and labels on the map
const pops = [];
ROUTE.forEach((r, i) => {
  if (!i || r.pass) return;
  const [x, y] = pt(r.k);
  const lab = document.createElement('div'); lab.className = 'pin-lab'; lab.style.left = x + 'px'; lab.style.top = y + 'px';
  lab.textContent = {montanita:'Montañita', mancora:'Máncora', purmamarca:'Purmamarca', nazca:'Nazca', huanchaco:'Huanchaco', huaraz:'Laguna 69', huacachina:'Huacachina', cusco:'Cusco', lares:'Lares', puno:'Titicaca', lapaz:'La Paz', uyuni:'Uyuni', tucuman:'Tucumán', montevideo:'Montevideo', barichara:'Colombia'}[r.k];
  plane.appendChild(lab);
  if (r.end || r.brk) return;
  const p = document.createElement('div'); p.className = 'pop';
  p.innerHTML = r.img ? (r.img.length > 1 ? `<div class="twin">${r.img.map(s => `<img class="ph" src="${s}" alt="">`).join('')}</div>` : `<img class="ph" src="${r.img[0]}" alt="">`)
    : (r.art === 'train' ? train(150) : bike(150, '#C2362B'));
  p.style.left = (x + r.side*95) + 'px'; p.style.top = y + 'px';
  plane.appendChild(p); pops[i] = p;
});
// the marker holds one figure per kind of leg; the moto is two halves so it can break apart at Nazca
const marker = document.createElement('div'); marker.className = 'marker'; plane.appendChild(marker);
marker.innerHTML = `<div class="mk" data-k="road"><img class="half-a" src="img/moto.webp" alt=""><img class="half-b" src="img/moto.webp" alt=""><i class="puff"></i></div>
  <div class="mk" data-k="truck">${truck(96)}</div><div class="mk" data-k="train">${train(70)}</div><div class="mk" data-k="fly"><img src="img/kit/swallow.webp" alt=""></div>`;
const MKK = {road: 'road', truck: 'truck', train: 'train', ferry: 'fly', flight: 'fly'};
const caps = $('#caps');
ROUTE.forEach((r, i) => { if (!i || r.pass) return;
  const c = document.createElement('div'); c.className = 'cap'; c.dataset.i = i;
  c.innerHTML = `<span class="k">${r.kick}</span><b>${r.t}</b><p>${r.p}</p>${r.fr ? `<p class="fr">${r.fr}</p>` : ''}`; caps.appendChild(c) });

const P = {s: 0}, C = {v: 1100, tilt: 0, f: 0, ox: 430, oy: 700};
let mkType = '';
function renderMap(){
  const stage = $('#s-ruta .stage'), sw = stage.clientWidth, sh = stage.clientHeight, fw = Math.min(sw, sh*.64);
  const m = posAt(P.s);
  SEG.forEach((g, i) => { const st = i < m.i ? 1 : i > m.i ? 0 : m.f; if (st !== g.done){ g.done = st; const d = st <= 0 ? '' : st >= 1 ? g.d : partial(g.samples, st); g.g.querySelectorAll('path').forEach(p => p.setAttribute('d', d)) } });
  const type = SEG[m.f < .001 && m.i > 0 ? m.i - 1 : m.i].type; if (type !== mkType){ mkType = type; $$('.mk', marker).forEach(e => e.hidden = e.dataset.k !== MKK[type]) }
  marker.style.transform = `translate(${m.x}px, ${m.y}px) translate(-50%, -100%) rotateX(${-C.tilt}deg) scaleX(${type === 'road' ? -m.dir : m.dir})`;
  const cx = C.ox + (m.x - C.ox)*C.f, cy = C.oy + (m.y - C.oy)*C.f, z = fw / C.v;
  plane.style.transform = `translate(${sw/2}px, ${sh*.56}px) rotateX(${C.tilt}deg) scale(${z}) translate(${-cx}px, ${-cy}px)`;
  let km = 0; SEG.forEach((g, i) => { if (g.type !== 'flight') km += i < m.i ? g.km : i === m.i ? g.km*m.f : 0 }); km *= KM_SCALE;
  $('#odo b').textContent = (Math.round(km/10)*10).toLocaleString('es-CO');
}
pops.forEach(p => p && gsap.set(p, {xPercent: -50, transformOrigin: '50% 100%', rotationX: 0, scale: .3, autoAlpha: 0, y: '-100%'}));
$$('.cap').forEach(c => gsap.set(c, {autoAlpha: 0}));

const S3 = scene('s-ruta', (tl, el) => {
  const R2 = {onUpdate: renderMap};
  T.pop(tl, $('#r-title'), 0, {r: -1.5, r0: -10});
  T.pop(tl, $('#odo'), .3, {r: 2});
  tl.to(C, {v: 380, tilt: 52, f: 1, duration: 2, ease: 'power2.inOut', ...R2}, .6);
  T.out(tl, $('#r-title'), 2.2, {y: -40});
  let t = 2.8, prev = null, prevCap = null;
  ROUTE.forEach((r, i) => {
    if (!i) return;
    const seg = SEG[i-1], d = seg.type === 'truck' ? 2.6 : Math.min(2.2, Math.max(.9, seg.km/900));
    const far = seg.type === 'flight' || seg.type === 'train';
    if (prev) tl.to(prev, {rotationX: 0, scale: .5, duration: .5, ease: 'power2.in'}, t);
    if (prevCap) T.out(tl, prevCap, t, {y: -16, d: .3});
    if (far) tl.to(C, {v: seg.type === 'flight' ? 1050 : 620, tilt: seg.type === 'flight' ? 30 : 46, duration: d*.6, ease: 'power2.inOut', ...R2}, t);
    tl.to(P, {s: i, duration: d, ease: 'power1.inOut', ...R2}, t);
    if (far && !r.end) tl.to(C, {v: 380, tilt: 52, duration: d*.5, ease: 'power2.inOut', ...R2}, t + d*.5);
    t += d;
    if (r.pass) return;
    const cap = $(`.cap[data-i="${i}"]`);
    if (r.brk){
      tl.to($('.half-a', marker), {x: -18, y: 6, rotation: -32, duration: .35, ease: 'back.out(3)'}, t);
      tl.to($('.half-b', marker), {x: 18, y: 4, rotation: 26, duration: .35, ease: 'back.out(3)'}, t);
      tl.fromTo($('.puff', marker), {scale: .2, opacity: .95}, {scale: 2.4, opacity: 0, duration: .6, ease: 'power2.out'}, t);
    }
    if (r.fix) tl.to([$('.half-a', marker), $('.half-b', marker)], {x: 0, y: 0, rotation: 0, duration: .3}, t + .5);
    if (pops[i]) tl.to(pops[i], {autoAlpha: 1, rotationX: -52, scale: 1, duration: .55, ease: 'back.out(1.8)'}, t);
    tl.fromTo(cap, {autoAlpha: 0, y: 30, rotation: R(-3, 3)}, {autoAlpha: 1, y: 0, rotation: R(-1.5, 1.5), duration: .35, ease: 'back.out(2)'}, t + .15);
    prev = pops[i] || null; prevCap = cap;
    t += r.end ? 1.6 : r.fix ? 2.4 : 1.5;
  });
  tl.to(C, {f: .25, duration: 1, ...R2}, t - 1.4);
  tl.set({}, {}, t + .6);
}, {pxs: .42});
renderMap();
addEventListener('resize', renderMap);

// ================= 4 · PARÍS =================
const SKY = [[24, 90, 150], [20, 80, 160], [22, 100, 140], [18, 80, 170], [24, 96, 150]];
$('#skyline').innerHTML = SKY.map(([w, a, b], i) => `<div style="width:${w}%">${haussmann(a, b, i+3)}</div>`).join('');
$$('#skyline svg').forEach(s => s.setAttribute('preserveAspectRatio', 'xMidYMax meet'));
const S4 = scene('s-paris', (tl, el) => {
  tl.fromTo($('#p-swallow'), {x: '-70vw', y: '20vh', rotation: 20}, {x: 0, y: 0, rotation: -5, duration: 1.1, ease: 'power2.out'}, 0);
  tl.to($('#p-swallow'), {x: '70vw', y: '-30vh', duration: .8, ease: 'power2.in'}, 1.5);
  T.pop(tl, $('.sun', el), .1);
  $$('#skyline > div').forEach((d, i) => T.rise(tl, d, .3 + i*.12, {y: 110}));
  T.rise(tl, $('#p-eiffel'), .7, {y: 110, d: .9});
  // life in France before the wedding: snapshots dropped on the table one after another, then swept away
  T.pop(tl, $('#p-t0'), 1.4, {r: -1.5});
  const snaps = $$('.snap', el);
  snaps.forEach((f, i) => tl.fromTo(f, {autoAlpha: 0, y: '-60vh', rotation: R(-40, 40)}, {autoAlpha: 1, y: 0, rotation: 0, duration: .45, ease: 'back.out(1.6)'}, 2.0 + i*.55));
  const swept = 2.0 + snaps.length*.55 + .8;
  T.out(tl, $('#p-t0'), swept, {y: -20});
  snaps.forEach((f, i) => tl.to(f, {x: (i%2 ? '' : '-') + '90vw', rotation: R(-60, 60), duration: .5, ease: 'power2.in'}, swept + i*.06));
  // then the "oui" at the mairie
  const m0 = swept + .9;
  T.place(tl, $('#p-mairie'), m0, {r: -3});
  tl.fromTo($('#p-stamp'), {autoAlpha: 0, scale: 2.6, rotation: -40}, {autoAlpha: 1, scale: 1, rotation: -12, duration: .3, ease: 'power4.in'}, m0 + 1.4);
  tl.to($('#p-stamp'), {x: 3, y: 3, duration: .08, yoyo: true, repeat: 1}, m0 + 1.7);
  T.pop(tl, $('#p-t1'), m0 + 2.0, {r: -1.5});
  T.out(tl, [$('#p-mairie'), $('#p-stamp'), $('#p-t1')], m0 + 3.8, {x: '-30vw', r: -10});
  const k0 = m0 + 4.1 - 5.5;
  T.pop(tl, $('#p-w1'), k0 + 5.5); T.pop(tl, $('#p-w2'), k0 + 5.7);
  T.pop(tl, $('#p-t2'), k0 + 5.8, {r: 1.2});
  $$('.box', el).forEach((b, i) => {
    T.pop(tl, b, k0 + 5.6 + i*.1, {r: R(-10, 10)});
    tl.to(b, {keyframes: [{left: '40%', top: (12 - i*2) + '%', rotation: 180, duration: .45, ease: 'power1.out'}, {left: '74%', top: (49 - i*5.5) + '%', rotation: 360 + R(-8, 8), duration: .45, ease: 'power1.in'}]}, k0 + 6.4 + i*.8);
  });
  T.write(tl, $('#p-fr'), k0 + 8.6, .8);
  tl.set({}, {}, k0 + 10);
}, {pxs: .5});

// ================= 5 · LA BODA =================
$('#picado').innerHTML = picado(600, 11, 4);
$$('#picado .flag').forEach(f => f.classList.add('boil'));
const S5 = scene('s-boda', (tl, el) => {
  T.pop(tl, $('.sun', el), 0);
  T.rise(tl, $('#bo-far'), .1, {y: 100}); T.rise(tl, $('#bo-near'), .3, {y: 100});
  tl.fromTo($('#picado'), {yPercent: -120}, {yPercent: 0, duration: .9, ease: 'bounce.out'}, .4);
  T.write(tl, $('.kicker', el), .8, .4);
  T.write(tl, $('#bo-title'), 1.0, 1.0);
  // the hug, everyone clapping behind us: first big, then it stays as the background of the other pictures
  T.place(tl, $('#bo-0'), 1.9, {r: -2});
  T.pop(tl, $('#bo-t1'), 3.2, {r: -1.2});
  tl.to($('#bo-0'), {scale: .68, xPercent: -4, yPercent: -10, rotation: -5, transformOrigin: '0% 0%', duration: .6, ease: 'power2.inOut'}, 4.6);
  T.slideIn(tl, $('#bo-1'), 4.9, {x: '-90vw', r0: -25, r: -3});
  tl.fromTo($('#bo-2'), {y: '-80vh', rotation: 30, autoAlpha: 1}, {y: 0, rotation: 6, duration: .7, ease: 'back.out(1.3)'}, 5.4);
  T.slideIn(tl, $('#bo-3'), 5.9, {x: '90vw', r0: 25, r: 3});
  T.pop(tl, $('#bo-date'), 6.6, {r: 2});
  T.write(tl, $('#bo-fr'), 7.0, .8);
  $$('.confetti', el).forEach((c, i) => T.pop(tl, c, 7.5 + i*.2, {s0: 0, r0: 0}));
  tl.set({}, {}, 9.4);
}, {pxs: .5});

// ================= 6 · LEJOS =================
const S6 = scene('s-lejos', (tl, el) => {
  tl.fromTo($('.half.l', el), {width: '100%'}, {width: '50%', duration: 1, ease: 'power3.inOut'}, .9);
  tl.fromTo($('.half.r', el), {width: '0%'}, {width: '50%', duration: 1, ease: 'power3.inOut'}, .9);
  T.pop(tl, $('#j-t1'), .2, {r: -1.5});
  const trail = $('#j-trail path'); const L = 140;
  tl.fromTo(trail, {strokeDashoffset: L, strokeDasharray: `2 2`}, {strokeDashoffset: 0, duration: 1.4, ease: 'none'}, 1.4);
  tl.fromTo($('#j-swallow'), {left: '4%', top: '40%', rotation: -10}, {keyframes: [{left: '40%', top: '28%', rotation: -4, duration: .7, ease: 'none'}, {left: '76%', top: '36%', rotation: 8, duration: .7, ease: 'none'}]}, 1.4);
  T.pop(tl, $('#j-t2'), 3.0, {r: 1.2});
  T.pop(tl, $('#j-c1'), 3.6); T.pop(tl, $('#j-c2'), 3.8);
  T.write(tl, $('#j-fr'), 4.3, .8);
  T.out(tl, ['#j-t1', '#j-t2', '#j-c1', '#j-c2', '#j-fr', '#j-swallow', '#j-trail'].map(s => $(s)), 5.8, {y: -20});
  tl.fromTo($('#j-sheet'), {y: '-90vh', rotation: 25, autoAlpha: 1}, {y: 0, rotation: -4, duration: .8, ease: 'bounce.out'}, 6.2);
  T.pop(tl, $('#j-t3'), 7.0, {r: -1.5});
  tl.set({}, {}, 8.8);
}, {pxs: .5});

function tickClocks(){
  for (const c of $$('.clock')){
    const s = new Date().toLocaleTimeString('en-GB', {timeZone: c.dataset.tz, hour12: false}), [h, m] = s.split(':').map(Number);
    $('.hh', c).style.transform = `rotate(${(h%12)*30 + m/2}deg)`; $('.mm', c).style.transform = `rotate(${m*6}deg)`;
    $('b', c).textContent = s.slice(0, 5);
  }
}
tickClocks(); setInterval(tickClocks, 15000);

// the village builds itself on load, or when the envelope opens at midnight
addEventListener('load', () => { ScrollTrigger.refresh(); document.documentElement.classList.contains('closed') ? addEventListener('gate-open', () => S0.playIntro(), {once: true}) : S0.playIntro() });
