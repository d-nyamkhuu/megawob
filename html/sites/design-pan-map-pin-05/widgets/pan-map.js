// Design on the shared pan-map/city template.
(() => {
const symbols = {
  search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6',
  pin: 'M12 22S4 13 4 8a8 8 0 1 1 16 0c0 5-8 14-8 14z M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  pan: 'M4 2l16 12-9 1-3 7z M12 14l5 8',
  route: 'M4 19l7-12 9 3M4 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6M11 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6M20 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  area: 'M2 2h20v20H2z',
  train: 'M5 3h14v14H5zM8 7h8v5H8zM8 17l-3 5M16 17l3 5M7 15h2M15 15h2',
  bed: 'M2 21V6M2 16h20v5M22 16V9H10v7M5 9h3v4H5z',
  food: 'M4 2v8M8 2v8M2 6h8M6 10v12M18 2c-5 5-5 10 0 10V2v20',
  bag: 'M4 8h16l1 14H3zM8 9V5a4 4 0 0 1 8 0v4',
  museum: 'M2 7l10-5 10 5zM3 22h18M4 19h16M6 9v9M10 9v9M14 9v9M18 9v9',
  cap: 'M1 8l11-5 11 5-11 5zM5 11v7c5 4 9 4 14 0v-7M22 9v10',
  health: 'M9 2h6v7h7v6h-7v7H9v-7H2V9h7z',
  people: 'M8 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8M18 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6M1 22v-5a7 7 0 0 1 14 0v5zM17 12c5 0 6 3 6 6v4h-6',
  book: 'M12 5C7 2 3 3 2 4v16c5-2 8-1 10 1 2-2 5-3 10-1V4c-1-1-5-2-10 1v16',
  camera: 'M3 7h4l2-4h6l2 4h4v14H3zM12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  tree: 'M12 1L5 10h4l-7 8h8v5h4v-5h8l-7-8h4z',
  cart: 'M1 3h4l3 13h11l3-10H6M10 7v6M15 7v6M7 20h2M17 20h2',
  anchor: 'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4M12 7v15M6 11h12M2 15l1 5 4-1M22 15l-1 5-4-1M3 19c4 5 14 5 18 0',
  university: 'M2 22V8h6v14M16 22V8h6v14M8 22V4h8v18M1 8l4-6 4 6M15 8l4-6 4 6M11 7h2M11 11h2M11 15h2M4 11h2M4 15h2M18 11h2M18 15h2M0 22h24',
};
function aquaIcon(parent, name, color) {
  const svg = env.util.svg('svg', { viewBox:'0 0 24 24', width:26, height:26, fill:'none', stroke:color || 'currentColor', 'stroke-width':2.2, 'stroke-linejoin':'round', 'stroke-linecap':'round', 'aria-hidden':'true' }, parent);
  env.util.svg('path', {d:symbols[name] || symbols.pin}, svg);
  if (['pin','pan','cap','health','people','tree'].includes(name)) {
    svg.setAttribute('fill', color || 'currentColor');
    svg.setAttribute('fill-rule','evenodd');
  }
  if (name === 'area') svg.setAttribute('stroke-dasharray','3 2');
  return svg;
}
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-pin-05',
  name: 'design',
  split: 'train',
  scenarios: ['pin'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    font: '12px/1.4 "Lucida Grande", "Lucida Sans Unicode", Arial, sans-serif',
    brand: 'City Map',
    panelWidth: 320,
    narrowPanelWidth: 220,
    maxWidth: 1640,
    maxHeight: 900,
    widthInset: 10,
    heightInset: 8,
    mapColors: {
      land: '#e9e5d7', water: '#7dc5ed', park: '#b8dca2', street: '#fffdf7', road: '#f8d46e', casing: '#d5b65c',
      transitRoad: '#8cc8e9', transitCasing: '#438dba', parkName: '#2f7a45', open: '#16824a',
      productLand: '#e9e5d7', productWater: '#7dc5ed', productPark: '#b8dca2', productRoad: '#f8d46e',
      editorLand: '#e9e5d7', editorRoad: '#f8d46e', editorCasing: '#d5b65c', droppedPin: '#d94735'
    },
    tierColors: { 1: '#1976d2', 2: '#1389bd', 3: '#6948ce' },
    venueColor: '#177fd0',
    editorPinColor: '#147fd0',
    maxMapWidth: 1380,
    minMapWidth: 380,
    minMapHeight: 300,
    parts: {
      shellHeader: (base) => (ctx, root, editor) => {
        const chrome = base(ctx, root, editor);
        if (chrome && chrome.bar) chrome.bar.style.display = 'none';
        const el = ctx.util.el, S = (t, a, p) => env.util.svg(t, a, p);
        const titleBar = document.querySelector('.ref-task');
        if (titleBar) {
          const ap = S('svg', { viewBox: '0 0 18 20', width: 18, height: 20, class: 'mac-apple', 'aria-hidden': 'true' }, titleBar);
          S('path', { d: 'M9 5C6 3 1 5 1 11c0 4 3 9 5 8 1-.5 2-.5 3 0 2 .5 5-4 5-8 0-3-2-5-4-5-1 0-2 1-3 1zM9 4c0-2 1-3 3-4-1 2-1 3-3 4z', fill: '#000' }, ap);
        }
        const top = document.createElement('div');
        top.className = 'mac-top';
        root.insertBefore(top, root.firstChild);
        const menu = el('div', 'mac-menu', top);
        ['File', 'Edit', 'View', 'Map', 'Places', 'Tools', 'Window', 'Help'].forEach(t => el('span', '', menu, t));
        const tb = el('div', 'mac-toolbar', top);
        const windowControls = el('div', 'mac-window-controls', titleBar);
        ['−', '□', '×'].forEach(t => el('span', '', windowControls, t));
        ['M6 12L4 9Q2 7 1 9L3 16L7 22H16L20 16L22 10Q21 8 19 10L17 13V5Q17 3 15 4V11V3Q15 1 12 2V11V2Q11 0 9 2V11V4Q7 2 6 4Z', 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6', symbols.pin, 'M3 19l6-7 4 4 8-10M3 19h0', 'M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6z'].forEach((d, i) => {
          const b = el('button', 'mac-tb' + (i ? '' : ' on'), tb); b.type = 'button'; b.tabIndex = -1;
          const sv = S('svg', { viewBox: '0 0 24 24', width: 26, height: 26, fill: 'none', stroke: '#000', 'stroke-width': 2, 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, b);
          S('path', { d }, sv);
          if (i === 2) { sv.setAttribute('fill','#000'); sv.setAttribute('fill-rule','evenodd'); }
        });
        const episodeTools = document.querySelector('.ref-task > .ref-tools');
        if (episodeTools) tb.appendChild(episodeTools);
        const taskText = document.querySelector('.ref-task > .ref-instruction');
        if (taskText) {
          tb.classList.add('mac-with-note');
          tb.insertBefore(taskText, episodeTools || null);
        }
        const info = el('div', 'mac-info', top);
        const sky = S('svg', { viewBox: '0 0 240 120', class: 'mac-sky', 'aria-hidden': 'true' }, el('div', 'mac-info-art', info));
        const sd = S('defs', {}, sky), sp = S('pattern', { id: 'mac-st', width: 3, height: 3, patternUnits: 'userSpaceOnUse' }, sd);
        S('rect', { width: 3, height: 3, fill: '#fff' }, sp); S('rect', { width: 1.5, height: 1.5, fill: '#000' }, sp); S('rect', { x: 1.5, y: 1.5, width: 1.5, height: 1.5, fill: '#000' }, sp);
        S('path', { d: 'M0 33L19 25L39 21L57 27L75 24L93 32L112 29L135 37L151 31L174 35L197 28L220 33L240 27V89H0z', fill: 'url(#mac-st)', stroke:'#000' }, sky);
        S('path', { d: 'M2 65h11V54h13v29h7V41h20v42h7V61h15v22h8V68h15v15h8V56h13v27h8V71h12v12h7V68h23v15h11V43h5L191 7l5 36h5v40h10V67h21v16h8v5H0z', fill: '#000' }, sky);
        for(let x=36;x<54;x+=6) for(let y=46;y<77;y+=8) S('rect',{x,y,width:2,height:4,fill:'#fff'},sky);
        for(let i=0;i<21;i++) S('rect',{x:4+i*11,y:73-(i%3)*5,width:2,height:4,fill:'#fff'},sky);
        S('rect', { x: 0, y: 92, width: 240, height: 28, fill: 'url(#mac-st)' }, sky);
        S('path', { d: 'M0 94h240', stroke: '#000', 'stroke-width': 2 }, sky);
        const stats = el('div', 'mac-info-stats', info);
        el('h2', '', stats, 'Riverton');
        [['Population:', '248,300'], ['Area:', '62.4 sq mi'], ['Elev.:', '48 ft']].forEach(([a, b]) => { const r = el('div', '', stats); el('span', '', r, a); el('b', '', r, b); });
        el('p', 'mac-info-text', info, 'Riverton is a riverside city with a historic downtown, university district and lakefront parks.');
        const mm = S('svg', { viewBox: '0 0 220 120', class: 'mac-mini', 'aria-hidden': 'true' }, info);
        S('rect', { x: 1, y: 1, width: 218, height: 118, fill: '#fff', stroke: '#000', 'stroke-width': 2 }, mm);
        S('path', { d: 'M1 66L14 70L22 65L33 76L48 85L64 88L71 83L80 86L87 72L96 68L100 57L91 47L94 35L108 30L112 20L105 10L104 0H124L126 11L132 19L126 31L132 43L124 53L118 68L109 77L111 91L103 99L107 120H1Z', fill: 'url(#mac-st)', stroke: '#000', 'stroke-width': 1.5 }, mm);
        S('path',{d:'M219 0L205 12L201 24L193 25L188 37L174 35L162 43L158 54L148 60L140 76L126 79L119 90M148 60L154 75L145 88L134 100L126 119M1 101L18 94L27 98L41 96L52 104L67 100L71 110L88 105L91 119',fill:'none',stroke:'#000','stroke-width':1.5},mm);
        mm.insertBefore(S('defs', {}, null), mm.firstChild).appendChild(sp.cloneNode(true));
        S('rect', { x: 80, y: 35, width: 70, height: 50, fill: 'none', stroke: '#000', 'stroke-width': 4 }, mm);
        const north = S('svg', { viewBox: '0 0 30 50', class: 'mac-north', 'aria-hidden': 'true' }, info);
        S('path', { d: 'M15 14L5 40L15 33L25 40z', fill: '#000' }, north);
        const t = S('text', { x: 15, y: 10, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 }, north); t.textContent = 'N';
        return chrome;
      },
      shellPanels: (base) => (ctx, root) => {
        const panels = base(ctx, root);
        if (panels.rail) panels.rail.style.display = 'none';
        if (panels.foot) panels.foot.style.display = 'none';
        if (panels.status) panels.status.style.display = 'none';
        if (panels.drawer) panels.drawer.style.display = 'none';
        if (panels.panel) panels.panel.style.order = '3';
        if (panels.work) {
          panels.work.style.display = 'flex';
          panels.work.style.flexDirection = 'row';
          panels.work.style.minWidth = '0';
          panels.work.style.width = '100%';
        }
        return panels;
      },
      editorFrame: (base) => (ctx, work) => {
        const frame = base(ctx, work);
        const column = ctx.util.el('aside', 'aqua-map-tools');
        ctx.util.el('div', 'aqua-tools-title', column, 'Find address or place:');
        const input = document.querySelector('input[placeholder*="Search places"]');
        if (input) {
          input.classList.add('aqua-search-input');
          // Keep the template's top anchor as the visible search well.
          const field = input.closest('.mpp-top');
          const results = document.querySelector('.mpe-results');
          Array.from(field.children).forEach(child => { child.style.display = 'none'; });
          field.className = 'aqua-search-field';
          column.appendChild(field);
          aquaIcon(field, 'search');
          field.appendChild(input);
          if (results) field.appendChild(results);
        }
        const toolsTitle = document.createElement('div');
        toolsTitle.className = 'aqua-tools-subtitle';
        toolsTitle.textContent = 'Tools';
        column.appendChild(toolsTitle);
        work.insertBefore(column, frame.map);
        frame.map.classList.add('aqua-map-frame');
        const scale = ctx.util.el('div', 'mac-scale', frame.map);
        ['0', '1', '2 Miles'].forEach(t => ctx.util.el('span', '', scale, t));
        return { ...frame, W:frame.port.clientWidth, H:frame.port.clientHeight };
      },
      editorTools: (base) => (ctx, port, commit) => {
        const result = base(ctx, port, commit);
        const column = document.querySelector('.aqua-map-tools');
        if (column) {
          result.edit.querySelector('svg')?.remove();
          aquaIcon(result.edit, 'pin');
          column.appendChild(result.edit);
          for (const [label, symbol] of [['Add Route Stop','route'],['Draw Area','area']]) {
            const button = ctx.util.el('button', 'aqua-secondary-tool', column, label);
            aquaIcon(button, symbol);
            button.addEventListener('click', () => env.log('decoy', {label}));
          }
          result.pan.querySelector('svg')?.remove();
          aquaIcon(result.pan, 'pan');
          const toolbar = document.querySelector('.mac-toolbar');
          const hand = toolbar.querySelector('.mac-tb');
          result.pan.classList.add('mac-tb', 'mac-pan-tool');
          result.pan.setAttribute('aria-label','Pan'); result.pan.title='Pan';
          result.pan.replaceChildren(hand.firstChild);
          toolbar.replaceChild(result.pan, hand);
          result.tools.hidden = true;
        }
        return result;
      },
      editorDirectory: (base) => (ctx, panel, commit) => {
        const result = base(ctx, panel, commit);
        if (result.list) result.list.style.display = 'none';
        const summary = document.createElement('section');
        summary.className = 'aqua-summary';
        const taskNote = document.querySelector('.ref-body>.ref-panel');
        if (taskNote) summary.appendChild(taskNote);
        const iconOf = n => { n = n.toLowerCase(); return /station|terminal/.test(n) ? 'train' : /park|garden/.test(n) ? 'tree' : /library|book/.test(n) ? 'book' : /rowing|canoe|marina|boathouse/.test(n) ? 'anchor' : /market/.test(n) ? 'cart' : /shop|store/.test(n) ? 'bag' : /school|college|universit/.test(n) ? 'university' : /hospital|clinic|medical/.test(n) ? 'health' : /community|club/.test(n) ? 'people' : /museum|church|hall|gallery|heritage|observatory|dome/.test(n) ? 'museum' : /cafe|restaurant|bar|kitchen/.test(n) ? 'food' : 'camera'; };
        const box = ctx.util.el('section', 'mac-box mac-places', summary);
        ctx.util.el('h3', 'mac-box-title', box, 'Places');
        const list = ctx.util.el('div', 'mac-place-list', box);
        const spare = ['museum', 'book', 'cap', 'people', 'cart', 'bag', 'food'];
        ctx.spec.places.forEach((p, pi) => {
          const row = ctx.util.el('div', 'mac-place-row', list);
          const ik = iconOf(p.name);
          aquaIcon(row, ik === 'camera' ? spare[pi % spare.length] : ik);
          ctx.util.el('span', '', row, p.name);
        });
        const lg = ctx.util.el('section', 'mac-box mac-legend', summary);
        ctx.util.el('h3', 'mac-box-title', lg, 'Map Legend');
        [['mac-sw-water', 'Water'], ['mac-sw-park', 'Park / Green Space'], ['mac-sw-major', 'Major Road'], ['mac-sw-minor', 'Minor Road'], ['mac-sw-rail', 'Railroad'], ['mac-sw-named', 'Named Place']].forEach(([c, t]) => {
          const row = ctx.util.el('div', 'mac-legend-row', lg);
          if (c === 'mac-sw-named') aquaIcon(row, 'museum'); else ctx.util.el('i', c, row);
          ctx.util.el('span', '', row, t);
        });
        Array.from(panel.children).forEach((child) => { child.style.display = 'none'; });
        panel.appendChild(summary);
        return result;
      },
      editorPin: (base) => (ctx, layer, place, index) => {
        const pin = base(ctx, layer, place, index);
        const name = place.name.toLowerCase();
        const kind = /hotel|lodge|inn|room/.test(name) ? 'bed' : /station|terminal/.test(name) ? 'train' : /park|garden/.test(name) ? 'tree' : /library|book/.test(name) ? 'book' : /rowing|canoe|marina|boathouse/.test(name) ? 'anchor' : /market/.test(name) ? 'cart' : /shop|store/.test(name) ? 'bag' : /school|college|universit/.test(name) ? 'university' : /hospital|clinic|medical/.test(name) ? 'health' : /community|club/.test(name) ? 'people' : /museum|church|hall|gallery|heritage|observatory|dome/.test(name) ? 'museum' : /cafe|restaurant|bar|kitchen/.test(name) ? 'food' : ['museum','book','university','people','cart','bag','food'][index % 7];
        const dot = pin.querySelector('.mp-dot');
        dot.replaceChildren(); aquaIcon(dot, kind);
        pin.style.setProperty('--c', kind === 'bag' ? '#854ed8' : kind === 'health' ? '#e65449' : kind === 'tree' ? '#3d984b' : '#1685cb');
        pin.dataset.id = place.id;
        return pin;
      },
      editorWorld: (base) => (ctx, port, W, H) => {
        const result = base(ctx, port, W, H); // Includes every original survey-building draw.
        result.world.querySelectorAll('.mpe-block,.mp-streets,.mp-park').forEach(node => node.remove());
        const sv = (tag, attrs, parent) => env.util.svg(tag, attrs, parent);
        const art = sv('g', {'class':'aqua-cartography','pointer-events':'none'}, null);
        result.world.prepend(art);
        const defs = sv('defs', {}, art);
        const water = sv('pattern', {id:'aqua-water',width:4,height:4,patternUnits:'userSpaceOnUse'},defs);
        sv('rect',{width:4,height:4,fill:'#fff'},water);
        sv('rect',{x:0,y:0,width:2,height:2,fill:'#000'},water); sv('rect',{x:2,y:2,width:2,height:2,fill:'#000'},water);
        const stip = sv('pattern', {id:'aqua-park',width:5,height:5,patternUnits:'userSpaceOnUse'},defs);
        sv('rect',{width:5,height:5,fill:'#fff'},stip);
        sv('rect',{x:1,y:1,width:1.5,height:1.5,fill:'#000'},stip);
        const ripples = sv('pattern',{id:'aqua-ripples',width:117,height:71,patternUnits:'userSpaceOnUse'},defs);
        sv('path',{d:'M4 12q23-2 42 0M61 36q16-3 39 0M10 57q23-2 39 0M80 9h16',fill:'none',stroke:'#dcf6ff','stroke-width':1,opacity:.13},ripples);
        const city = sv('pattern', {id:'aqua-city',width:288,height:267,patternUnits:'userSpaceOnUse',patternTransform:'rotate(0)'},defs);
        sv('rect',{width:288,height:267,fill:'#deddd3'},city);
        const r = ctx.rng.fork('aqua/cartographic-detail');
        for (let x=5;x<286;x+=15) for(let y=5;y<266;y+=18) {
          sv('path',{d:`M${x} ${y}h${r.int(7,12)}v${r.int(9,14)}h-6v-3h-4z`,fill:r.pick(['#d5d4ca','#e8e5db','#dbd9ce','#cdd0c3']),stroke:'#f1eee5','stroke-width':.8},city);
        }
        const minor=[];
        for(let x=0;x<=288;x+=32) minor.push(`M${x} 0L${x+r.int(-3,3)} 89L${x+r.int(-4,4)} 178L${x} 267`);
        for(let y=0;y<267;y+=30) minor.push(`M0 ${y}L96 ${y+r.int(-3,3)}L192 ${y+r.int(-3,3)}L288 ${y}`);
        sv('path',{d:minor.join(''),fill:'none',stroke:'#bfc0b4','stroke-width':6},city);
        sv('path',{d:minor.join(''),fill:'none',stroke:'#fffdf4','stroke-width':3.6},city);
        const landD = 'M-200-200H65C46-120 37-50 37 5C112-12 170 19 157 53C145 80 193 105 239 127C299 150 307 200 374 215C435 229 480 254 549 268C615 283 688 285 742 319L792 342C825 306 840 263 826 233C802 197 748 204 737 166C712 120 682 116 675 82C668 40 696 8 722-9L740-200H1200V1100H-200Z';
        const land = sv('clipPath',{id:'aqua-land'},defs); sv('path',{d:landD},land);
        const riverD = 'M911-60C838 40 953 76 915 161S864 276 866 346S820 429 889 489S962 564 932 631S891 740 1042 839';
        sv('rect',{x:-2000,y:-2000,width:5000,height:5000,fill:'url(#aqua-city)'},art);
        sv('rect',{x:-200,y:-200,width:1400,height:1300,fill:'url(#aqua-water)'},art);
        sv('rect',{x:-200,y:-200,width:1400,height:1300,fill:'url(#aqua-ripples)'},art);
        sv('path',{d:landD,fill:'url(#aqua-city)',stroke:'#f5edc5','stroke-width':14},art);
        sv('path',{d:riverD,fill:'none',stroke:'#b4d79c','stroke-width':98},art);
        sv('path',{d:riverD,fill:'none',stroke:'#f7ecc4','stroke-width':78},art);
        sv('path',{d:riverD,fill:'none',stroke:'url(#aqua-water)','stroke-width':67},art);
        const green = sv('g',{'clip-path':'url(#aqua-land)'},art);
        const parkD = 'M282 604C315 561 459 583 502 623C576 699 514 808 438 834C366 865 318 827 283 758C250 710 245 643 282 604Z';
        const northPark = 'M719-30C762-6 818-29 872-3L865 58C896 96 887 138 866 186L836 262C815 247 801 212 782 200C741 184 707 141 685 112C661 75 679 18 719-30Z';
        sv('path',{d:parkD,fill:'#b8dca0',stroke:'#d6e9b7','stroke-width':10},green);
        sv('path',{d:northPark,fill:'#b3d69c',stroke:'#d4e5af','stroke-width':8},green);
        sv('path',{d:'M35 2C68-9 111-3 137 14C157 28 141 52 121 60C99 70 90 96 61 100L38 85C32 58 44 34 35 2Z',fill:'#bad8a1',stroke:'#e6e8c2','stroke-width':5},green);
        const lakeD='M305 654C337 615 420 614 466 644C511 673 488 713 446 733C407 754 391 775 372 815C343 794 321 757 298 727C282 700 285 677 305 654Z';
        sv('path',{d:lakeD,fill:'url(#aqua-water)',stroke:'#b4dfdc','stroke-width':5},green);
        const dry = sv('mask',{id:'aqua-dry',x:-200,y:-200,width:1400,height:1300,maskUnits:'userSpaceOnUse'},defs);
        sv('rect',{x:-200,y:-200,width:1400,height:1300,fill:'white'},dry);
        sv('path',{d:lakeD,fill:'black',stroke:'black','stroke-width':5},dry);
        sv('path',{d:riverD,fill:'none',stroke:'black','stroke-width':75},dry);
        const vegetation = sv('g',{mask:'url(#aqua-dry)'},green);
        const tree = sv('g',{id:'aqua-tree'},defs);
        sv('path',{d:'M0 3v7',stroke:'#a3bb83','stroke-width':1.2},tree);
        const canopy = sv('linearGradient',{id:'aqua-canopy',x1:'0%',y1:'0%',x2:'75%',y2:'100%'},defs);
        sv('stop',{offset:0,'stop-color':'#c4dfa6'},canopy);sv('stop',{offset:1,'stop-color':'#a6cb8d'},canopy);
        sv('path',{d:'M-5 4C-10 4-8-2-5-3C-8-8-3-11 0-7C2-12 7-9 6-5C12-5 11 2 7 3C9 8 3 9 1 5C-1 9-6 8-5 4Z',fill:'url(#aqua-canopy)',stroke:'#99bc86','stroke-width':1},tree);
        sv('path',{d:'M0 6V-2M0 3l-3-3M0 0l3-3',fill:'none',stroke:'#9fbe86','stroke-width':.7,opacity:.7},tree);
        const inkDabs = [];
        for(let i=0;i<1800;i++) {
          const x=r.float(0,1000),y=r.float(0,840);
          inkDabs.push([x,y]);
          const north=x>680&&x<865&&y<180&&x>695+y*.2;
          const lakeside=Math.pow((x-389)/150,2)+Math.pow((y-710)/128,2)<1 && Math.pow((x-389)/107,2)+Math.pow((y-708)/88,2)>1.18;
          const riverbank=Math.abs(x-(875+35*Math.sin(y/95)))<55&&x>820;
          const headland=Math.pow((x-83)/54,2)+Math.pow((y-44)/56,2)<1;
          if(north||lakeside||riverbank||headland||i%11===0) {
            const scale=r.float(.65,1.2);
            sv('use',{href:'#aqua-tree',transform:`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale})`,opacity:r.float(.6,.95)},vegetation);
          }
        }
        for(let i=0;i<100;i++) {
          const x=r.float(0,840),y=r.float(140,840);
          sv('rect',{x,y,width:r.float(5,17),height:r.float(7,22),rx:4,fill:'#acd192',opacity:.6,transform:`rotate(22 ${x} ${y})`},vegetation);
        }
        const scenicRoads = ['M-30 265C94 320 135 345 221 376S359 380 474 418S656 478 773 528L848 572C862 614 874 695 908 756L1040 850','M135 120C267 141 310 238 445 265S644 283 720 316L1030 411','M43 860L156 550L231 373L259 330','M718 858L752 673L780 563L825 354','M-30 665L114 711L340 826L405 855','M357 263C337 362 306 409 326 490S347 580 451 597L638 648L902 763'];
        scenicRoads.forEach(d=>{
          sv('path',{d,fill:'none',stroke:'#d6be79','stroke-width':11,'stroke-linejoin':'round'},green);
          sv('path',{d,fill:'none',stroke:'#fff6ce','stroke-width':9,'stroke-linejoin':'round'},green);
          sv('path',{d,fill:'none',stroke:'#ffe49a','stroke-width':6,'stroke-linejoin':'round'},green);
        });
        sv('path',{d:'M706 136C758 107 779 151 824 132S851 109 860 77M726 159C735 206 821 196 840 218M287 636C233 711 292 794 347 823',fill:'none',stroke:'#f8f9e8','stroke-width':2.4,'stroke-dasharray':'4 4'},green);
        sv('path',{d:'M0 560C140 590 300 700 520 735S800 790 1000 830',fill:'none',stroke:'#000','stroke-width':3},green);
        sv('path',{d:'M0 560C140 590 300 700 520 735S800 790 1000 830',fill:'none',stroke:'#fff','stroke-width':1.5,'stroke-dasharray':'9 7'},green);
        for(let i=0;i<5;i++) {
          const x=300+i*66,y=194+i*19;
          sv('path',{d:`M${x} ${y}l17-44`,stroke:'#b0b6aa','stroke-width':8},art);
          sv('path',{d:`M${x} ${y}l17-44`,stroke:'#f6f2e5','stroke-width':6},art);
        }
        const text=(label,x,y,cls,rotation)=> {
          const t=sv('text',{x,y,'class':cls,transform:rotation?`rotate(${rotation} ${x} ${y})`:''},art);
          t.textContent=label;
        };
        text(ctx.spec.world.sea?.name || 'Harbour Bay',390,89,'aqua-water-name');
        text('Maple',862,285,'aqua-water-name'); text('River',865,312,'aqua-water-name');
        text(ctx.spec.world.lake?.name || 'Silver Lake',341,695,'aqua-water-name');
        text('Riverside',765,108,'aqua-park-name'); text('Park',777,130,'aqua-park-name');
        text('Lakeside Park',348,788,'aqua-park-name');
        const districtNames=[...new Set(ctx.spec.places.map(p=>p.district).filter(Boolean))];
        const positions=[[90,211],[458,313],[615,465],[715,644],[594,764],[27,410]];
        districtNames.slice(0,6).forEach((name,i)=>text(name,...positions[i],'aqua-district-name'));
        const texture = sv('filter',{id:'aqua-paper',x:0,y:0,width:'100%',height:'100%'},defs);
        sv('feTurbulence',{type:'fractalNoise',baseFrequency:'.16 .4',numOctaves:3,seed:17,stitchTiles:'stitch'},texture);
        sv('feColorMatrix',{type:'saturate',values:0},texture);
        sv('rect',{x:0,y:0,width:1000,height:840,filter:'url(#aqua-paper)',opacity:.065,'style':'mix-blend-mode:multiply'},art);
        // Keep the original detail stream above intact, then draw the one-bit city survey.
        art.replaceChildren(defs);
        Array.from(result.world.children).forEach(node => {
          if (node !== art && node.namespaceURI === 'http://www.w3.org/2000/svg') node.style.display = 'none';
        });
        const ink = (d, fill, parent = art, width = 1.2) => sv('path', {d, fill, stroke:'#000', 'stroke-width':width, 'stroke-linejoin':'round'}, parent);
        const dots = sv('pattern',{id:'mac-water',width:29,height:23,patternUnits:'userSpaceOnUse',patternTransform:`scale(${650/W} ${546/H})`},defs);
        sv('rect',{width:29,height:23,fill:'#fff'},dots);
        for(let i=0;i<257;i++) sv('rect',{x:Math.floor(inkDabs[i][0])%29,y:Math.floor(inkDabs[i][1])%23,width:1,height:1,fill:'#000'},dots);
        const grass = sv('pattern',{id:'mac-grass',width:13,height:14,patternUnits:'userSpaceOnUse',patternTransform:`scale(${1000/W} ${840/H})`},defs);
        sv('rect',{width:13,height:14,fill:'#fff'},grass);
        sv('path',{d:'M2 2h1M9 5h1M4 11l1-1M11 12h1M7 1v1',stroke:'#000','stroke-width':1},grass);
        const lakeShore = 'M-100-100H557L550 4L541 10L538 21L529 28L530 41L517 52L513 69L502 83L504 94L492 105L490 121L481 134L482 148L470 162L468 178L458 191L451 211L441 224L450 230L468 225L480 214L490 219L487 233L474 245L455 253L431 259L413 266L410 252L402 254L401 272L384 279L380 262L373 262L373 283L358 284L356 267L347 269L344 291L329 297L328 274L317 276L312 301L302 306L301 278L293 280L288 311L278 317L273 308L272 293L265 292L264 319L252 326L247 320L253 274L260 237L255 229L248 231L240 288L236 318L227 319L228 300L220 297L214 313L204 309L203 292L194 289L191 297L174 288L166 277L154 275L141 260L122 255L103 241L85 220L65 212L42 217L32 228L27 244L17 260L13 287L5 301L0 337L-100 337Z';
        const harbour = 'M-100 439L0 436L15 443L25 467L22 492L35 519L54 535L73 552L94 562L117 564L136 581L151 592L159 615L173 647L188 665L201 674L211 662L219 639L223 611L229 591L234 556L239 530L246 502L253 465L259 434L266 406L271 380L278 349L287 324L296 317L294 347L289 379L284 410L282 443L275 471L271 504L266 531L260 559L258 591L249 620L246 652L235 680L220 701L204 719L186 727L175 747L156 763L147 783L128 799L120 819L103 840H-100Z';
        const river = 'M502 234C523 270 526 313 545 342S581 374 612 390S660 416 688 450S716 494 740 510S785 540 806 574S823 623 852 649S886 691 910 719S962 762 1030 780';
        sv('rect',{x:-2000,y:-2000,width:5000,height:5000,fill:'#fff'},art);
        const dryCity = sv('mask',{id:'mac-dry-city',x:-1000,y:-1000,width:4000,height:4000,maskUnits:'userSpaceOnUse'},defs);
        sv('rect',{x:-1000,y:-1000,width:4000,height:4000,fill:'#fff'},dryCity);
        [lakeShore,harbour].forEach(d => sv('path',{d,fill:'#000'},dryCity));
        sv('path',{d:river,fill:'none',stroke:'#000','stroke-width':30},dryCity);
        const blocks = sv('g',{mask:'url(#mac-dry-city)'},art);
        // Fine, imperfect streets divided into districts with different bearings.
        const grid = (x,y,w,h,angle,stepX,stepY) => {
          const clip = sv('clipPath',{id:`mac-block-${x}-${y}`},defs);
          sv('rect',{x,y,width:w,height:h},clip);
          const outer = sv('g',{'clip-path':`url(#mac-block-${x}-${y})`},blocks);
          const g = sv('g',{transform:`rotate(${angle} ${x+w/2} ${y+h/2})`},outer);
          for(let i=-40;i<w+50;i+=stepX) {
            const px=x+i;
            sv('path',{d:`M${px} ${y-100}v${h+200}`,stroke:'#444','stroke-width':.65,fill:'none'},g);
            for(let j=0;j<h;j+=stepY) {
              if((Math.floor(i/stepX)+Math.floor(j/stepY))%5===0) continue;
              sv('path',{d:`M${px+3} ${y+j+3}v${stepY-7}h${stepX-6}`,stroke:'#777','stroke-width':.4,fill:'none'},g);
            }
          }
          for(let j=-60;j<h+70;j+=stepY) sv('path',{d:`M${x-100} ${y+j}h${w+200}`,stroke:'#333','stroke-width':.65,fill:'none'},g);
        };
        grid(0,210,266,480,8,15,26);
        grid(267,230,272,415,12,15,24);
        grid(540,-20,230,350,0,16,28);
        grid(540,342,195,290,17,14,24);
        grid(270,650,450,250,0,17,25);
        grid(745,40,295,820,0,17,27);
        ink(lakeShore,'url(#mac-water)'); ink(harbour,'url(#mac-water)');
        sv('path',{d:river,fill:'none',stroke:'#000','stroke-width':33},art);
        sv('path',{d:river,fill:'none',stroke:'url(#mac-water)','stroke-width':30},art);
        // Islands, small inlets, and shore parks give the harbour an inked outline.
        ink('M24 705Q34 687 61 688L70 683L75 686L89 677Q110 679 107 705L98 721L76 731L62 729L55 735L39 734Q10 732 24 705Z','url(#mac-grass)');
        ink('M128 686Q145 674 153 693L155 710L143 721L138 716L129 718L125 703Z','url(#mac-grass)');
        ink('M514 162Q527 153 533 166L530 189L518 209L507 211L506 194Z','url(#mac-water)');
        const parks = sv('g',{mask:'url(#mac-dry-city)'},art);
        ink('M4 340L17 277L30 245L48 219L76 213L109 232L142 257L152 282L143 312L93 314L49 340L26 390L4 403Z','url(#mac-grass)',parks);
        ink('M464 232L487 177L510 109L534 47L559 4H624V174L591 189L543 221L511 254Z','url(#mac-grass)',parks);
        ink('M551 427L582 430L621 447L663 479L670 535L635 555L592 545L546 516L537 485Z','url(#mac-grass)',parks);
        ink('M951 83L1010 48V416L962 416L939 350L927 295L942 244L925 190Z','url(#mac-grass)',parks);
        ink('M274 644L294 639L300 699L277 704Z','url(#mac-grass)',parks);
        const pine = (x,y,s=1) => {
          const g=sv('g',{transform:`translate(${x} ${y}) scale(${s*1000/W} ${s*840/H})`},art);
          ink('M0-17L-5-8H-2L-8 0H-4L-10 8H-2V14H2V8H10L4 0H8L2-8H5Z','#fff',g,1.7);
          sv('path',{d:'M0-11v19M0-5l-3 4M0 1l4 4',fill:'none',stroke:'#000','stroke-width':1.5},g);
        };
        [[50,260],[62,313],[554,72],[568,141],[610,133],[572,449],[563,486],[585,513],[978,159],[983,292]].forEach(([x,y])=>pine(x,y,.78));
        const roads = [
          'M-20 413C48 386 105 421 177 451S302 498 385 536S516 585 612 610S740 633 810 638S895 639 1020 588',
          'M-20 557L70 503L132 475L233 488L360 540L510 574L672 616L799 628',
          'M22 403L48 337L97 308Q149 279 200 307L306 370Q337 397 386 410L454 442L512 431L566 320Q588 292 615 316L696 363L769 395L863 388L924 382L1020 424',
          'M141 846L182 775L238 679L316 628Q370 589 427 575Q464 568 513 618L567 666L648 680L701 707',
          'M470 865L489 771L508 684L526 574L548 436',
          'M815-30L800 66L784 170L770 286L753 425L737 571L722 730L733 880',
          'M525 237L581 204L648 168L713 148L777 151L851 106L1016 9',
          'M195 764L460 764Q478 768 492 785L530 842'
        ];
        roads.forEach(d => {
          sv('path',{d,fill:'none',stroke:'#000','stroke-width':8,'stroke-linejoin':'round'},art);
          sv('path',{d,fill:'none',stroke:'#fff','stroke-width':5.5,'stroke-linejoin':'round'},art);
        });
        const rail='M590-30L620 20L682 10M598 728L699 724L802 733L895 682L1020 629M986-20V653';
        sv('path',{d:rail,fill:'none',stroke:'#000','stroke-width':1.7},art);
        sv('path',{d:rail,fill:'none',stroke:'#000','stroke-width':6,'stroke-dasharray':'1 12'},art);
        for(let j=0;j<16;j++) {
          const x=30+(j*79)%470, y=56+(j*67)%174;
          sv('path',{d:`M${x} ${y}q3 6 7 0q4 6 9 0`,fill:'none',stroke:'#000','stroke-width':.8},art);
        }
        const label=(name,x,y,cls='mac-district',rotate=0) => {
          const t=sv('text',{x:0,y:0,class:cls,transform:`translate(${x} ${y}) scale(${1000/W} ${840/H}) rotate(${rotate})`},art);t.textContent=name;return t;
        };
        label('Lake Riverton',289,105,'mac-lake-name');
        label('Riverton River',628,433,'mac-river-name',31);
        [['Northside',705,83],['West End',177,375],['Harborview',160,560],['Riverton',438,367],['Downtown',438,397],['Brookside',397,644],['Meadowbrook',641,697],['Southbank',780,745],['Maple',895,223],['Heights',895,253],['Eastwood',921,548]].forEach(([n,x,y])=>label(n,x,y));
        [['Oak Point',91,256],['Park',91,281],['Lakeside',593,76],['Park',593,103],['Grandview',619,485],['Park',619,512]].forEach(([n,x,y])=>label(n,x,y,'mac-park-label'));
        const roadNames=ctx.spec.world.roads.map(p=>p.name).filter(Boolean);
        label(roadNames[0] || 'Riverton Ave',367,525,'mac-street-label',18);
        label(roadNames[1] || 'Pine Ridge Rd',868,106,'mac-street-label',-27);
        label(roadNames[2] || 'Cedar Ave',785,265,'mac-street-label',-76);
        label('Elm St',852,395,'mac-street-label');
        [[173,451,'61'],[490,713,'18']].forEach(([x,y,n])=>{
          const g=sv('g',{transform:`translate(${x} ${y}) scale(${1200/W} ${714/H})`},art);
          ink('M-12-19L-6-21L0-18L6-21L12-19L11-10L14-2L13 12L8 20L0 23L-8 20L-13 12L-14-2L-11-10Z','#fff',g,2.2);
          const t=sv('text',{x:0,y:8,class:'mac-shield'},g);t.textContent=n;
        });
        result.world._aquaArt = art;
        return result;
      },
      editorPaint: (base) => (ctx, elements, model) => {
        base(ctx, elements, model);
        const sc = Number(elements.world.getAttribute('transform').match(/scale\(([^)]+)/)[1]);
        const art=elements.world._aquaArt;
        if(art && !art.hasAttribute('transform')) {
          art.setAttribute('transform', `translate(${model.c[0]-elements.W/(2*sc)} ${model.c[1]-elements.H/(2*sc)}) scale(${elements.W/(1000*sc)} ${elements.H/(840*sc)})`);
        }
        elements.roadLabels.forEach((label,i)=> {
          const road=ctx.spec.world.roads[i];
          const start=road.pts[0], end=road.pts[road.pts.length-1];
          const p=[start[0]+(end[0]-start[0])*.22,start[1]+(end[1]-start[1])*.22];
          label.style.left=p[0]*sc+'px';
          label.style.top=(p[1]*sc-34)+'px';
          label.style.display='none';
        });
        const columns=[...new Set(ctx.spec.places.map(p=>p.x))].sort((a,b)=>a-b);
        elements.pins.forEach((pin,i) => {
          const name=pin.querySelector('.mp-name'), col=columns.indexOf(ctx.spec.places[i].x);
          const crowded=ctx.spec.spacing[0]*sc<150;
          const left=crowded && col===0, below=crowded && col>0 && col<columns.length-1;
          const width=below?110:128;
          Object.assign(name.style,{width:'max-content',maxWidth:width+'px',left:(left?-width-4:below?12-width/2:30)+'px',top:below?'28px':'-3px',textAlign:left?'right':below?'center':'left',maxHeight:below?'43px':'64px'});
        });
        elements.results.hidden = !model.searchOpen || !model.query.trim();
        elements.readout.hidden=!model.pin;
      },
    },
  },
});
})();
