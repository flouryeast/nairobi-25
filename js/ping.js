// ping.js — tells Noé's phone what is happening, through ntfy.sh (app "ntfy", subscribed to the topic below).
// Only from the real site, never from the #prueba links, except #prueba-notif which sends them marked [test].
// Nothing about her phone or location is sent: just the moment of the story she has reached.
const NTFY = 'https://ntfy.sh/nairobi25-0a956ee30c3f';
const PING_ON = location.hash === '#prueba-notif' || (TEST === 0 && !/^(localhost|127\.|\[::1\])/.test(location.hostname) && location.protocol === 'https:');
const pinged = new Set();
function ping(key, msg, o={}){
  if (!PING_ON || pinged.has(key)) return; pinged.add(key);
  const q = new URLSearchParams({title: (TEST ? '[test] ' : '') + (o.title || 'Nairobi 25'), tags: o.tags || 'birthday', priority: o.priority || '3'});
  fetch(`${NTFY}?${q}`, {method: 'POST', body: msg, keepalive: true}).catch(() => {});
}

ping('open', now() < OPEN_AT ? 'Elle a ouvert le site (encore fermé : elle voit le compte à rebours).' : 'Elle a ouvert le site 💛', {priority: '4', tags: 'eyes'});
addEventListener('gate-open', () => ping('gate', "Minuit : l'enveloppe s'est ouverte sous ses yeux.", {priority: '4', tags: 'envelope'}));

// how far into the story she has scrolled
const MILESTONES = [['s-llegaste', 'Elle en est à « Y llegaste tú ».', 'door'], ['s-ruta', 'Elle est sur la carte du voyage.', 'world_map'],
  ['s-paris', 'Elle est arrivée en France.', 'fr'], ['s-boda', 'Elle est à la boda.', 'wedding'], ['cumple', 'Elle est devant le gâteau 🎂', 'birthday'], ['fin', "Elle est arrivée tout en bas, à la fin.", 'checkered_flag']];
// a milestone counts only if it stays on screen for 2 s (jumping to the end scrolls past everything in a blink)
const dwell = {};
const seen = new IntersectionObserver(es => es.forEach(e => { const id = e.target.id;
  if (!e.isIntersecting){ clearTimeout(dwell[id]); return }
  dwell[id] = setTimeout(() => { const [, msg, tag] = MILESTONES.find(m => m[0] === id); ping('m-' + id, msg, {tags: tag}); seen.unobserve(e.target) }, 2000) }), {threshold: .3});
MILESTONES.forEach(([id]) => document.getElementById(id) && seen.observe(document.getElementById(id)));
