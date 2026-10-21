// art.js — every hand-made shape of the collage, drawn as cut paper in SVG (white paper edge + flat colour + halftone)
const PAL = {paper:'#F3EADB', white:'#FBF7EE', ink:'#1B1A17', mustard:'#F2B83B', sky:'#8FC3E6', terra:'#D2582E', bouga:'#E0457B',
  ribbon:'#EE6A2B', moto:'#8BD448', steel:'#A9BACB', kraft:'#E3CFA6', night:'#221C2B', ochre:'#C9A15B', green:'#6E9A5B', zinc:'#6F7F92', door:'#2F6B4F'};

function rng(seed){ let s = (seed*9301+49297) % 233280 || 1; return () => (s = (s*16807) % 2147483647) / 2147483647 }
const svg = (w, h, body, cls='') => `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const EDGE = `stroke="${PAL.white}" stroke-width="4" stroke-linejoin="round"`;

// a halftone pattern, used as an overlay fill on paper shapes
function dots(id, col, size=7, r=1.4, op=.35){ return `<defs><pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="${col}" opacity="${op}"/></pattern></defs>` }

// mountain ridge: a cut-paper silhouette from x=0 to w, standing on the bottom edge
function ridge(w, h, seed, o={}){
  const r = rng(seed), n = o.n || 9, pts = [];
  for (let i=0;i<=n*4;i++){ const x = i/(n*4)*w, base = h*(o.base ?? .45);
    const y = base - Math.sin(i/(n*4)*Math.PI*(o.waves||3) + seed)*h*(o.amp ?? .22) - r()*h*(o.jag ?? .08); pts.push(`${x.toFixed(1)},${y.toFixed(1)}`) }
  const id = 'rg'+seed;
  return svg(w, h, dots(id, PAL.ink, 8, 1.3, .18) +
    `<polygon points="0,${h} ${pts.join(' ')} ${w},${h}" fill="${o.fill}" ${EDGE}/>` +
    `<polygon points="0,${h} ${pts.join(' ')} ${w},${h}" fill="url(#${id})"/>`);
}

// a colonial Barichara house: whitewash, terracotta tile roof, ochre stone base, painted door and window
function house(w, h, seed, o={}){
  const r = rng(seed), roofH = h*.2, doorC = o.door || [PAL.door, '#3B5E8C', '#7A3B2A', '#2F6B4F'][Math.floor(r()*4)];
  let tiles = ''; for (let x = w*.06; x < w*.95; x += 7) tiles += `<line x1="${x}" y1="${roofH*.08}" x2="${x+(x-w/2)*.04}" y2="${roofH}" stroke="#A23F1F" stroke-width="2"/>`;
  const dx = w*(.12 + r()*.12), dw = w*.26, dh = h*.42, wx = w*.58, ww = w*.26, wh = h*.24;
  let bars = ''; for (let i=1;i<5;i++) bars += `<line x1="${wx+ww*i/5}" y1="${h*.38}" x2="${wx+ww*i/5}" y2="${h*.38+wh}" stroke="${PAL.ink}" stroke-width="2"/>`;
  return svg(w, h,
    `<rect x="2" y="${roofH-2}" width="${w-4}" height="${h-roofH}" fill="${o.wall || PAL.white}" ${EDGE}/>` +
    `<rect x="2" y="${h*.86}" width="${w-4}" height="${h*.14}" fill="${PAL.ochre}"/>` +
    `<path d="M${dx} ${h} V${h-dh+dw/2} a${dw/2} ${dw/2} 0 0 1 ${dw} 0 V${h}Z" fill="${doorC}" stroke="${PAL.ink}" stroke-width="2"/>` +
    `<line x1="${dx+dw/2}" y1="${h-dh+dw/2}" x2="${dx+dw/2}" y2="${h}" stroke="${PAL.ink}" stroke-width="2"/>` +
    `<rect x="${wx}" y="${h*.38}" width="${ww}" height="${wh}" fill="${doorC}" stroke="${PAL.ink}" stroke-width="2"/>${bars}` +
    `<polygon points="-6,${roofH+4} ${w*.1},0 ${w*.9},0 ${w+6},${roofH+4}" fill="${PAL.terra}" ${EDGE}/>${tiles}`);
}

// the sandstone cathedral of Barichara, drawn from the photo: a tall tiered bell tower with the clock on the left, a shorter one
// on the right, paired columns around the arched door, the saint in her niche, and the diamond-cut blocks on the tower base
function church(w, h){
  const ST = '#D2874A', SD = '#A85F2E', SL = '#E8A86A', line = `stroke="${SD}" stroke-width="1.6"`;
  const fin = (x, y) => `<rect x="${x-1.5}" y="${y-7}" width="3" height="7" fill="${SD}"/><circle cx="${x}" cy="${y-9}" r="3" fill="${ST}" stroke="${SD}" stroke-width="1.2"/>`;
  const opening = (x, y, ww, hh) => `<path d="M${x} ${y+hh} V${y+ww/2} a${ww/2} ${ww/2} 0 0 1 ${ww} 0 V${y+hh}Z" fill="#3A2416"/>`;
  // a tower = stacked stages, each a little narrower, with a cornice and finials on the corners
  const tower = (x0, wd, top, stages) => { let g = '', y = h, wcur = wd, cx = x0 + wd/2;
    stages.forEach(([hh, open], k) => { y -= hh; const x = cx - wcur/2;
      g += `<rect x="${x}" y="${y}" width="${wcur}" height="${hh}" fill="${ST}" ${EDGE}/>` +
        `<rect x="${x-3}" y="${y-2}" width="${wcur+6}" height="5" fill="${SL}" ${line}/>`;
      if (open) g += opening(cx - wcur*.18, y + hh*.2, wcur*.36, hh*.6);
      if (k > 0) g += fin(x + 3, y - 2) + fin(x + wcur - 3, y - 2);
      wcur *= .8 });
    return g + `<path d="M${cx-wcur*.45} ${y-2} q${wcur*.45} -${wcur*.7} ${wcur*.9} 0z" fill="${SL}" ${line}/>` + fin(cx, y - wcur*.35);
  };
  let diamonds = '';
  for (let r=0;r<6;r++) for (let c=0;c<3;c++){ const x = w*.06 + c*w*.09 + (r%2)*w*.045, y = h*.62 + r*h*.055;
    diamonds += `<path d="M${x} ${y} l${w*.04} ${h*.025} l-${w*.04} ${h*.025} l-${w*.04} -${h*.025}z" fill="none" ${line}/>` }
  const col = x => `<rect x="${x}" y="${h*.5}" width="${w*.035}" height="${h*.5}" fill="${SL}" ${line}/>`;
  return svg(w, h, dots('ch', '#6B3A18', 6, 1.1, .28) +
    // facade between the towers, with a balustrade on top
    `<rect x="${w*.3}" y="${h*.44}" width="${w*.5}" height="${h*.56}" fill="${ST}" ${EDGE}/>` +
    `<rect x="${w*.29}" y="${h*.42}" width="${w*.52}" height="${h*.035}" fill="${SL}" ${line}/>` +
    [...Array(9)].map((_, i) => `<rect x="${w*(.31 + i*.055)}" y="${h*.385}" width="${w*.02}" height="${h*.035}" fill="${SL}" ${line}/>`).join('') +
    col(w*.36) + col(w*.4) + col(w*.66) + col(w*.7) +
    `<rect x="${w*.36}" y="${h*.6}" width="${w*.375}" height="${h*.025}" fill="${SL}" ${line}/>` +
    `<path d="M${w*.5} ${h*.58} V${h*.53} a${w*.05} ${w*.05} 0 0 1 ${w*.1} 0 V${h*.58}Z" fill="#7A4524"/><path d="M${w*.55} ${h*.575} v-${h*.04}" stroke="${PAL.white}" stroke-width="${w*.025}" stroke-linecap="round"/><circle cx="${w*.55}" cy="${h*.528}" r="${w*.013}" fill="${PAL.white}"/>` +
    `<path d="M${w*.47} ${h} V${h*.78} a${w*.08} ${w*.08} 0 0 1 ${w*.16} 0 V${h}Z" fill="#3A2416" stroke="${SD}" stroke-width="3"/>` +
    tower(w*.62, w*.3, 0, [[h*.5, false], [h*.13, true], [h*.1, true]]) +
    tower(w*.02, w*.32, 0, [[h*.42, false], [h*.17, true], [h*.15, true], [h*.11, true]]) +
    `<circle cx="${w*.18}" cy="${h*.35}" r="${w*.045}" fill="${PAL.white}" stroke="${PAL.ink}" stroke-width="1.5"/><path d="M${w*.18} ${h*.35} v-${w*.03} M${w*.18} ${h*.35} h${w*.022}" stroke="${PAL.ink}" stroke-width="1.5"/>` +
    diamonds);
}

// bougainvillea: a pink cluster with a couple of leaves
function bouga(w, seed){
  const r = rng(seed); let b = '';
  for (let i=0;i<9;i++) b += `<ellipse cx="${10+r()*(w-20)}" cy="${12+r()*(w*.5-20)}" rx="${3+r()*4}" ry="${3+r()*3}" fill="${PAL.green}"/>`;
  for (let i=0;i<34;i++) b += `<circle cx="${8+r()*(w-16)}" cy="${8+r()*(w*.5-16)}" r="${3+r()*5}" fill="${i%5?PAL.bouga:'#F07BA4'}"/>`;
  return svg(w, w*.5, b);
}

function cloud(w, seed){
  const r = rng(seed); let c = '';
  for (let i=0;i<5;i++) c += `<ellipse cx="${w*(.2+i*.15)}" cy="${w*.22-r()*w*.08}" rx="${w*(.12+r()*.06)}" ry="${w*(.08+r()*.05)}" fill="${PAL.white}"/>`;
  return svg(w, w*.36, `<g ${EDGE.replace('4','6')}>${c}</g>`);
}

// Paris: a haussmann block with zinc roof, chimneys and balconies
function haussmann(w, h, seed){
  const r = rng(seed), roof = h*.22; let win = '';
  const cols = Math.max(2, Math.round(w/34)), rows = 4;
  for (let i=0;i<cols;i++) for (let j=0;j<rows;j++){
    const x = 8 + i*(w-16)/cols + 5, y = roof + 10 + j*(h-roof-20)/rows, ww = (w-16)/cols - 10, wh = (h-roof-20)/rows - 12;
    win += `<rect x="${x}" y="${y}" width="${ww}" height="${wh}" fill="#3E4A5A"/>`;
    if (j===1 || j===3) win += `<line x1="${x-3}" y1="${y+wh}" x2="${x+ww+3}" y2="${y+wh}" stroke="${PAL.ink}" stroke-width="3"/>`;
  }
  let chim = ''; for (let i=0;i<3;i++) chim += `<rect x="${w*.15+i*w*.3+r()*10}" y="${-4}" width="9" height="${roof*.5}" fill="#B8664A" stroke="${PAL.ink}" stroke-width="1.5"/>`;
  return svg(w, h, `<rect x="2" y="${roof}" width="${w-4}" height="${h-roof}" fill="#E9DCC4" ${EDGE}/>${win}` +
    `<path d="M0 ${roof+2} Q${w*.04} ${roof*.15} ${w*.12} ${roof*.15} H${w*.88} Q${w*.96} ${roof*.15} ${w} ${roof+2}Z" fill="${PAL.zinc}" ${EDGE}/>${chim}` +
    `<line x1="0" y1="${roof+4}" x2="${w}" y2="${roof+4}" stroke="${PAL.ink}" stroke-width="2"/>`);
}

function eiffel(w, h){
  const id = 'ef';
  return svg(w, h, dots(id, PAL.ink, 5, 1.2, .9) +
    `<path d="M${w*.5} 0 L${w*.56} ${h*.3} L${w*.62} ${h*.55} L${w*.95} ${h} H${w*.7} Q${w*.5} ${h*.72} ${w*.3} ${h} H${w*.05} L${w*.38} ${h*.55} L${w*.44} ${h*.3}Z" fill="url(#${id})" stroke="${PAL.ink}" stroke-width="2"/>` +
    `<rect x="${w*.34}" y="${h*.54}" width="${w*.32}" height="${h*.03}" fill="${PAL.ink}"/><rect x="${w*.42}" y="${h*.3}" width="${w*.16}" height="${h*.025}" fill="${PAL.ink}"/>`);
}

// papel picado: a garland of cut tissue flags
function picado(w, n, seed){
  const r = rng(seed), cols = [PAL.bouga, PAL.mustard, PAL.sky, PAL.moto, PAL.ribbon, PAL.white]; let f = '';
  const fw = w/n;
  for (let i=0;i<n;i++){ const x = i*fw + 3, y = 10 + Math.sin(i/n*Math.PI)*22, c = cols[i%cols.length];
    let holes = ''; for (let k=0;k<4;k++) holes += `<circle cx="${x+fw*.2+r()*fw*.5}" cy="${y+12+r()*fw*.6}" r="${2+r()*3}" fill="${PAL.bouga}" opacity="0"/>`;
    f += `<g class="flag"><path d="M${x} ${y} h${fw-6} v${fw*.95} l-${(fw-6)/4} -8 l-${(fw-6)/4} 8 l-${(fw-6)/4} -8 l-${(fw-6)/4} 8Z" fill="${c}" opacity=".95"/>` +
      `<circle cx="${x+fw/2-3}" cy="${y+fw*.4}" r="${fw*.14}" fill="#0002"/><rect x="${x+fw*.2}" y="${y+fw*.68}" width="${fw*.5}" height="3" fill="#0002"/>${holes}</g>`;
  }
  return svg(w, 120, `<path d="M0 10 Q${w/2} 40 ${w} 10" fill="none" stroke="${PAL.ink}" stroke-width="2"/>${f}`);
}

function canyon(w, h, seed){ // stacked cliff layers for Serena del Viento
  return ridge(w, h, seed, {fill:PAL.ochre, base:.38, amp:.1, jag:.12, waves:2});
}

function train(w){ const h = w*.42;
  return svg(w, h, `<rect x="4" y="${h*.18}" width="${w*.62}" height="${h*.55}" rx="6" fill="${PAL.terra}" stroke="${PAL.ink}" stroke-width="3"/>` +
    `<rect x="${w*.66}" y="${h*.08}" width="${w*.3}" height="${h*.65}" rx="6" fill="${PAL.mustard}" stroke="${PAL.ink}" stroke-width="3"/>` +
    `<rect x="${w*.1}" y="${h*.28}" width="${w*.14}" height="${h*.18}" fill="${PAL.sky}"/><rect x="${w*.3}" y="${h*.28}" width="${w*.14}" height="${h*.18}" fill="${PAL.sky}"/><rect x="${w*.72}" y="${h*.2}" width="${w*.18}" height="${h*.2}" fill="${PAL.sky}"/>` +
    [.15,.42,.75].map(x=>`<circle cx="${w*x}" cy="${h*.8}" r="${h*.13}" fill="${PAL.ink}"/>`).join(''));
}

function bike(w, col=PAL.terra){ const h = w*.62, r = h*.3;
  return svg(w, h, `<g fill="none" stroke="${PAL.ink}" stroke-width="4"><circle cx="${r+4}" cy="${h-r-4}" r="${r}"/><circle cx="${w-r-4}" cy="${h-r-4}" r="${r}"/></g>` +
    `<path d="M${r+4} ${h-r-4} L${w*.4} ${h*.42} L${w*.68} ${h*.42} L${w-r-4} ${h-r-4} M${w*.4} ${h*.42} L${w*.5} ${h-r-4} L${w*.68} ${h*.42} M${w*.5} ${h-r-4} L${r+4} ${h-r-4} M${w*.38} ${h*.3} L${w*.42} ${h*.42} M${w*.66} ${h*.28} L${w*.68} ${h*.42}" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round"/>` +
    `<rect x="${w*.3}" y="${h*.24}" width="${w*.14}" height="${h*.07}" rx="3" fill="${PAL.ink}"/><path d="M${w*.6} ${h*.28} h${w*.12}" stroke="${PAL.ink}" stroke-width="4" stroke-linecap="round"/>`);
}

// a footprint (shoe sole), for the walk through the streets
function sole(w, col){ return svg(w, w*2.2, `<ellipse cx="${w/2}" cy="${w*.75}" rx="${w*.42}" ry="${w*.7}" fill="${col}"/><ellipse cx="${w/2}" cy="${w*1.75}" rx="${w*.32}" ry="${w*.4}" fill="${col}"/>`) }

// torn-paper strip used between scenes (top edge jagged)
function tear(col, seed){ const r = rng(seed); let p = [];
  for (let x=0;x<=1000;x+=18) p.push(`${x},${(8+r()*22).toFixed(1)}`);
  return svg(1000, 40, `<polygon points="${p.join(' ')} 1000,40 0,40" fill="${col}"/>`, 'tear-svg').replace('xMidYMax meet','none') }

// the truck that carried us (and the broken moto) from Nazca up to Cusco
function truck(w){ const h = w*.5;
  return svg(w, h, `<rect x="${w*.02}" y="${h*.42}" width="${w*.66}" height="${h*.3}" fill="${PAL.door}" stroke="${PAL.ink}" stroke-width="3"/>` +
    [.1,.22,.34,.46,.58].map(x => `<line x1="${w*x}" y1="${h*.12}" x2="${w*x}" y2="${h*.42}" stroke="${PAL.kraft}" stroke-width="3"/>`).join('') +
    `<path d="M${w*.2} ${h*.4} l${w*.08} -${h*.14} h${w*.12} l${w*.06} ${h*.14}" fill="none" stroke="${PAL.ink}" stroke-width="3"/><circle cx="${w*.2}" cy="${h*.38}" r="${h*.07}" fill="${PAL.moto}" stroke="${PAL.ink}" stroke-width="2"/><circle cx="${w*.46}" cy="${h*.38}" r="${h*.07}" fill="${PAL.moto}" stroke="${PAL.ink}" stroke-width="2"/>` +
    `<path d="M${w*.68} ${h*.72} V${h*.22} h${w*.18} l${w*.11} ${h*.24} V${h*.72}Z" fill="${PAL.terra}" stroke="${PAL.ink}" stroke-width="3"/><path d="M${w*.72} ${h*.28} h${w*.12} l${w*.07} ${h*.16} h-${w*.19}Z" fill="${PAL.sky}"/>` +
    [.16,.5,.84].map(x => `<circle cx="${w*x}" cy="${h*.78}" r="${h*.13}" fill="${PAL.ink}"/>`).join(''));
}

// little drawn bodies for our two cut-out heads; legs and arms are separate groups so the walk can swing them
function walkerBody(who){
  const skin = who === 'nai' ? '#C68A63' : '#EBC0A4', ink = PAL.ink;
  const limb = (cls, x1, y1, x2, y2, col, w) => `<g class="${cls}"><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/></g>`;
  if (who === 'nai') return svg(100, 160,
    limb('arm-l', 30, 16, 20, 62, skin, 8) +
    limb('leg-l', 42, 84, 40, 148, skin, 10) + limb('leg-r', 58, 84, 60, 148, skin, 10) +
    `<path d="M26 12 Q50 2 74 12 L72 48 H28Z" fill="${PAL.white}" stroke="${ink}" stroke-width="2"/>` +
    `<rect x="30" y="48" width="40" height="10" fill="${skin}"/>` +
    `<path d="M28 58 H72 L76 90 H24Z" fill="#EDE3CC" stroke="${ink}" stroke-width="2"/>` +
    `<path d="M68 10 L34 70" stroke="${ink}" stroke-width="4"/><rect x="18" y="62" width="26" height="24" rx="3" fill="${PAL.white}" stroke="${ink}" stroke-width="2"/>` +
    `<path d="M20 68 H42 M20 74 H42 M20 80 H42" stroke="${ink}" stroke-width="3"/>` +
    limb('arm-r', 70, 16, 80, 62, skin, 8), 'body');
  return svg(100, 160,
    limb('arm-l', 26, 16, 16, 60, skin, 8) +
    limb('leg-l', 40, 96, 38, 150, skin, 11) + limb('leg-r', 60, 96, 62, 150, skin, 11) +
    `<path d="M22 8 Q50 0 78 8 L82 72 H18Z" fill="#EFE6C8" stroke="${ink}" stroke-width="2"/><path d="M50 6 V70" stroke="${ink}" stroke-width="1.2" stroke-dasharray="2 5"/>` +
    `<path d="M20 70 H80 L82 102 H54 L50 92 L46 102 H18Z" fill="#1F2A44" stroke="${ink}" stroke-width="2"/>` +
    `<g class="arm-r"><path d="M74 14 L88 40 L80 20" stroke="${skin}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="80" cy="18" r="6" fill="${skin}" stroke="${ink}" stroke-width="1.5"/><path d="M80 12 V4" stroke="${skin}" stroke-width="5" stroke-linecap="round"/></g>`, 'body');
}
