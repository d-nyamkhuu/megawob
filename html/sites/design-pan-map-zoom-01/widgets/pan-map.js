// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zoom-01',
  name: 'design',
  split: 'train',
  scenarios: ['zoom'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
      font: '18px/1.2 Georgia,serif', panelWidth: 440, narrowPanelWidth: 300,
      maxWidth: 2000, maxHeight: 1400, widthInset: 0, heightInset: 0,
      maxMapWidth: 1800, mapHeaderHeight: 0, explorerSearch: 'Search places...',
      tierColors: { 1: '#171715', 2: '#171715', 3: '#171715' }, venueColor: '#171715',
    parts: {
      shellHeader: (base) => (ctx, root, editor) => {
        const result = base(ctx, root, editor);
        result.top.hidden = true; result.bar.hidden = true;
        return result;
      },
      shellPanels: (base) => (ctx, root) => {
        const result = base(ctx, root);
        result.foot.hidden = true;
        return result;
      },
      navigation: (base, S) => (ctx, rail, position, open, drawer) => {
        base(ctx, rail, position, open, drawer);
        const buttons = [...rail.querySelectorAll('button')];
        const labels = ['Map', 'Bookmarks', 'Layers', 'Settings', 'North up'];
        buttons.forEach((b, i) => { b.setAttribute('aria-label', labels[i]); b.title = labels[i]; });
        buttons[1].remove(); buttons[3].remove(); buttons[4].remove();
        rail.querySelector('.mpp-grow')?.remove(); rail.querySelector('.mpp-count')?.remove();
        const add = (name, symbol, action) => {
          const b = S.P.iconButton(rail, symbol, name);
          b.addEventListener('click', action);
          return b;
        };
        const places = add('Places', 'list', () => { drawer.hidden = true; S.els.chrome.panel.querySelector('input')?.focus(); });
        rail.insertBefore(places, buttons[2]);
        add('Search', 'search', () => S.els.chrome.panel.querySelector('input')?.focus());
        rail.append(buttons[1]);
        add('Settings', 'settings', () => open('layers'));
      },
      explorerSearch: (base) => (ctx, chrome) => {
        const input = base(ctx, chrome);
        chrome.panel.append(input.parentElement);
        return input;
      },
      explorerHeading: () => (ctx, panel) => ctx.util.el('div', 'rm-heading', panel),
      explorerRow: (base, S) => (ctx, list, p) => {
        const row = ctx.util.el('div', 'mpe-item rm-row', list);
        const button = ctx.util.el('button', '', row);
        const symbol = ctx.util.el('span', 'rm-place-icon', button);
        S.P.icon(symbol, S.P.kindIcon(p), 25);
        ctx.util.el('span', 'mpe-name', button, p.name);
        ctx.util.el('span', 'rm-district', button, p.district || '');
        S.P.rowDecorated(ctx, row, p);
        return { row, button };
      },
      directoryEnd: () => (ctx, list, count) => { if (!count) ctx.util.el('div', 'rm-empty', list, 'No places found'); },
      explorerFrame: (base) => (ctx, chrome) => {
        const result = base(ctx, chrome);
        result.head.classList.add('rm-map-heading');
        result.head.querySelector('.mp-title').textContent = 'Places';
        chrome.panel.prepend(result.head);
        return result;
      },
      explorerControls: (base) => (ctx, port, corners) => {
        const result = base(ctx, port, corners);
        result.zoomBox.append(result.zout, result.zin);
        result.zin.setAttribute('aria-label', 'Zoom in'); result.zout.setAttribute('aria-label', 'Zoom out');
        return result;
      },
      explorerWorld: (base, S) => (ctx, port, W, H) => {
        const result = base(ctx, port, W, H);
        [...result.world.children].forEach(e => e.classList.add('rm-survey'));
        S.rmWorld = result;
        return result;
      },
      explorerPaint: (base, S) => (ctx, E, model) => {
        base(ctx, E, model);
        if (!E.world.querySelector('.rm-terrain')) {
          rivermereTerrain(ctx, E, S.rmWorld.wd);
        }
        const terrain = E.world.querySelector('.rm-terrain');
        const scale = Number(E.world.getAttribute('transform').match(/scale\(([^)]+)/)[1]);
        const ratio = Number(terrain.dataset.initialScale) / scale;
        terrain.querySelectorAll('text').forEach(text => {
          text.setAttribute('font-size', Number(text.dataset.inkSize) * ratio);
          text.setAttribute('stroke-width', 4 * ratio);
          text.style.display = text.classList.contains('rm-district-label') && model.z > 4 ? 'none' : '';
        });
      },
      kindIcon: (base) => p => {
        const name = (p.name + ' ' + p.kind).toLowerCase();
        return /gallery|florist/.test(name) ? 'palette' : /theatre|comedy|stage/.test(name) ? 'theatre' : /college|university|school/.test(name) ? 'college' : /museum|library/.test(name) ? 'museum' : /station/.test(name) ? 'train' : /park/.test(name) ? 'trees' : /cafe|café/.test(name) ? 'coffee' : base(p);
      },
      icon: (base) => (parent, name, size) => {
        const paths = {
          list: 'M4 5h1 M9 5h12 M4 12h1 M9 12h12 M4 19h1 M9 19h12',
          settings: 'M9 2h6l1 3 3 1 3 3-2 3 2 3-3 3-3 1-1 3H9l-1-3-3-1-3-3 2-3-2-3 3-3 3-1 1-3z M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
          museum: 'M2 8l10-6 10 6H2z M3 21h18 M5 18V10 M10 18V10 M15 18V10 M20 18V10 M3 18h18',
          trees: 'M7 2L3 9h2l-4 6h5v7h2v-7h5L9 9h2L7 2z M17 5l-3 6h2l-3 6h4v5h2v-5h4l-3-6h2l-5-6z',
          folder: 'M5 2h14v20l-7-5-7 5V2z',
          college: 'M1 7l11-5 11 5-11 5L1 7z M5 10v7q7 6 14 0v-7 M22 8v9',
          train: 'M6 17V5q0-3 6-3t6 3v12H6z M6 10h12 M9 19l-3 4 M15 19l3 4 M7 20h10 M8 14h1 M15 14h1',
          palette: 'M12 2C0 2-2 20 10 22c5 0 0-6 5-6 9 1 11-14-3-14z M7 8h1 M12 5h1 M18 8h1 M5 13h1',
          theatre: 'M2 3l11 1v8q-7 7-11-1V3z M5 7h1 M9 7h1 M5 11q3 3 5 0 M14 8l8-2v10q-4 8-10 1 M16 11h1 M19 10h1 M15 17q3-3 5-1',
          coffee: 'M4 8h13v7q0 5-6 5t-7-5V8z M17 9h3q4 5-3 6 M2 22h19 M8 5V2 M13 5V1',
        };
        if (!paths[name]) return base(parent, name, size);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', size || 27); svg.setAttribute('height', size || 27);
        const path = document.createElementNS(svg.namespaceURI, 'path'); path.setAttribute('d', paths[name]);
        path.setAttribute('fill', /palette|trees|college/.test(name) ? 'currentColor' : 'none'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '1.8'); path.setAttribute('stroke-linejoin', 'round');
        svg.append(path);
        if (name === 'palette') [[7,8],[12,5],[18,8],[5,13]].forEach(([x,y]) => {
          const hole = document.createElementNS(svg.namespaceURI, 'circle'); hole.setAttribute('cx',x); hole.setAttribute('cy',y); hole.setAttribute('r',1.35); hole.setAttribute('fill','#f2f1ec'); svg.append(hole);
        });
        parent.append(svg); return svg;
      },
    },
  },
});

// Cartographic ink, in the same world coordinate system as the live place markers.
// It is drawn once; the template continues to own every pan, zoom and selection.
function rivermereTerrain(ctx, E, wd) {
  const ns = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(ns, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v)); parent.append(n); return n;
  };
  const s = Number(E.world.getAttribute('transform').match(/scale\(([^)]+)/)[1]);
  const origin = [ctx.model.c[0] - E.W / 2 / s, ctx.model.c[1] - E.H / 2 / s];
  const art = el('g', { class: 'rm-terrain', transform: `translate(${origin}) scale(${E.W / 1128 / s} ${E.H / 855 / s})`, 'pointer-events': 'none' }, E.world);
  art.dataset.initialScale = s;
  const r = ctx.rng.fork('rivermere/cartographic-ink');
  const bay = 'M-200 -100H440 C467 38 448 83 426 124 L418 128 421 140 410 146 418 155 C417 177 393 202 382 217 L370 220 365 231 C349 251 299 237 284 248 L268 245 257 254 242 250 232 245 230 232 219 230 221 217 212 209 203 214 202 227 191 231 187 242 166 248 155 261 140 267 137 279 124 283 125 295 112 304 109 318 119 329 C160 331 167 340 194 342 L198 356 Q142 364 112 351 C64 361 26 352 -200 398Z';
  const river = 'M-100 392 C68 345 155 366 252 398 S428 476 521 458 S707 417 816 478 S1013 631 1228 537';
  const parks = [
    'M821 -40L1170 -40 1162 182Q1104 226 1057 211L934 180Q868 167 821 94Z',
    'M782 383Q824 348 873 374L979 425Q1018 446 954 526L877 508Q814 479 763 433Z',
    'M128 628Q176 613 217 642L357 665Q412 677 393 737L357 855 207 842Q129 806 88 733Q59 686 128 628Z',
  ];
  el('rect', { x: -5000, y: -5000, width: 12000, height: 12000, fill: '#deddd6' }, art);
  const defs = el('defs', {}, art);
  const mask = el('mask', { id: 'rm-landmask', maskUnits: 'userSpaceOnUse', x: -2000, y: -2000, width: 6000, height: 6000 }, defs);
  el('rect', { x: -2000, y: -2000, width: 6000, height: 6000, fill: 'white' }, mask);
  el('path', { d: bay, fill: 'black' }, mask);
  el('path', { d: river, fill: 'none', stroke: 'black', 'stroke-width': 39 }, mask);
  parks.forEach(d => el('path', { d, fill: 'black' }, mask));
  const city = el('g', { mask: 'url(#rm-landmask)' }, art);
  const warp = (x, y) => [x + 23 * Math.sin(y / 168) + y * .08 + 33 * Math.sin(x / 260) * Math.sin(y / 210), y + 27 * Math.sin(x / 230) + x * .16];
  const pts = points => points.map((p, i) => (i ? 'L' : 'M') + warp(...p).join(',')).join('');
  // Property parcels, with separate small footprints rather than solid square blocks.
  for (let y = -120; y < 1000; y += 47) for (let x = -160; x < 1250; x += 53) {
    const block = el('g', { transform: `translate(${warp(x, y)}) rotate(${4 * Math.cos(x / 230)})` }, city);
    el('rect', { x: 5, y: 5, width: 42, height: 36, fill: '#d5d4ce', stroke: '#c3c2bc', 'stroke-width': .6 }, block);
    for (let i = 0; i < 6; i++) {
      if (r.bool(.12)) continue;
      const xx = 8 + i % 3 * 12 + r.float(-1, 2), yy = 8 + Math.floor(i / 3) * 17;
      el('rect', { x: xx, y: yy + r.float(-1,2), width: r.int(5, 10), height: r.int(6, 13), rx: .8, fill: r.pick(['#c2c1bb', '#cac9c3', '#bdbeb7', '#cecdc7']), stroke: '#b6b6ae', 'stroke-width': .4 }, block);
    }
  }
  const street = d => {
    el('path', { d, fill: 'none', stroke: '#b2b4a9', 'stroke-width': 6, 'stroke-linejoin': 'round', 'vector-effect':'non-scaling-stroke' }, city);
    el('path', { d, fill: 'none', stroke: '#f8f7f0', 'stroke-width': 4, 'stroke-linejoin': 'round', 'vector-effect':'non-scaling-stroke' }, city);
  };
  for (let x = -160; x < 1300; x += 53) street(pts(Array.from({ length: 25 }, (_, i) => [x, -120 + i * 47])));
  for (let y = -120; y < 1050; y += 47) street(pts(Array.from({ length: 30 }, (_, i) => [-160 + i * 53, y])));
  parks.forEach(d => el('path', { d, fill: '#bfc3b5', stroke: '#faf9f0', 'stroke-width': 4 }, art));
  const water = { fill: '#a4adae', stroke: '#777e7c', 'stroke-width': 1.2 };
  el('path', { d: bay, ...water }, art);
  el('path', { d: 'M38 314l-8 5 2 12 8 8 10-5 4-12-7-10Z M403 76l-5 9 4 7-4 8 7 4 7-7-1-12 12-1 1-6-15 1Z', fill: '#e9e8df', stroke: '#7c827a', 'stroke-width': 1 }, art);
  el('path', { d: 'M135 286Q154 248 184 254T221 310Q211 340 159 321Z', fill: 'none', stroke: '#93968a', 'stroke-dasharray': '5 4', 'stroke-width': 1.2 }, art);
  el('path', { d: river, fill: 'none', stroke: '#f7f6ed', 'stroke-width': 47 }, art);
  el('path', { d: river, fill: 'none', stroke: '#787f7e', 'stroke-width': 40 }, art);
  el('path', { d: river, fill: 'none', stroke: '#a4adae', 'stroke-width': 38 }, art);
  ['M389 404L382 451', 'M484 440L474 484', 'M581 432L568 478'].forEach(d => {
    el('path', { d, fill:'none', stroke:'#666b63', 'stroke-width':7, 'stroke-dasharray':'1 4' }, art);
    el('path', { d, fill:'none', stroke:'#f5f4ea', 'stroke-width':3 }, art);
    el('path', { d, fill:'none', stroke:'#777c71', 'stroke-width':.8 }, art);
  });
  const road = d => {
    el('path', { d, fill: 'none', stroke: '#8d8f88', 'stroke-width': 14, 'stroke-linejoin': 'round', 'vector-effect':'non-scaling-stroke' }, art);
    el('path', { d, fill: 'none', stroke: '#f9f8f1', 'stroke-width': 10, 'stroke-linejoin': 'round', 'vector-effect':'non-scaling-stroke' }, art);
    el('path', { d, fill: 'none', stroke: '#d1d1c8', 'stroke-width': 1, 'vector-effect':'non-scaling-stroke' }, art);
  };
  ['M-50 577Q251 535 511 633T1154 903', 'M-60 755L86 480Q129 410 189 381Q200 291 297 274L395 256Q451 241 476 188Q486 119 547 133L1199 292', 'M510 950Q535 676 577 456L650 136 700 -100', 'M1040 -50Q1151 247 1040 473T726 927'].forEach(road);
  // Park paths, trees and small ponds use the same restrained ink as the survey.
  ['M851 0Q875 163 945 128T1109 154', 'M815 401Q809 453 926 487', 'M102 688Q173 647 228 703T361 701Q405 798 308 829T209 764'].forEach(d => el('path', { d, fill: 'none', stroke: '#737b6c', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }, art));
  // Fine grass and footpath marks keep green spaces from reading as flat shapes.
  [[973,64,130,95],[877,441,70,29],[244,743,125,65]].forEach(([cx,cy,rx,ry]) => {
    for (let i=0; i<85; i++) {
      const u=r.float(-1,1), v=r.float(-1,1);
      if (u*u+v*v>.9) continue;
      const x=cx+u*rx, y=cy+v*ry;
      el('path', { d:`M${x} ${y}l-1-3m2 4 1-3`, stroke:r.pick(['#e2e4d8','#959e8b','#a9b29e']), 'stroke-width':.8, opacity:.7, fill:'none' }, art);
    }
  });
  ['M999 126q40-22 49 15t-19 44q-52-2-30-59Z', 'M282 785q46-27 44 6t-43 35q-35-6-1-41Z'].forEach(d => el('path', { d, fill: '#9aa3a3' }, art));
  const tree = (x, y, h) => {
    el('path', { d: `M${x} ${y}v${h}m0 ${-h}l${-h * .25} ${h * .55}h${h * .15}l${-h * .23} ${h * .25}h${h * .66}l${-h * .23} ${-h * .25}h${h * .15}Z`, fill: '#858d7e', stroke: '#596250', 'stroke-width': .8 }, art);
  };
  [[838,64],[857,83],[913,19],[980,16],[1075,54],[786,409],[824,384],[906,459],[942,430],[129,731],[155,698],[184,725],[340,731],[357,767],[319,697]].forEach(([x,y],i) => tree(x,y,22 + i % 4 * 4));
  for (let i = 0; i < 48; i++) {
    const x = r.float(30, 368), y = r.float(26, 255);
    if (x > 240 && y > 160) continue;
    el('path', { d: `M${x} ${y}q4 3 8 0q4 3 8 0`, fill: 'none', stroke: '#818f91', 'stroke-width': .8, opacity: .6 }, art);
  }
  const rail = 'M715 950Q809 730 960 573T1195 224';
  el('path', { d: rail, fill: 'none', stroke: '#6a6b64', 'stroke-width': 7, 'stroke-dasharray': '1 6' }, art);
  el('path', { d: rail, fill: 'none', stroke: '#62645e', 'stroke-width': 3 }, art);
  el('path', { d: rail, fill: 'none', stroke: '#eae9e1', 'stroke-width': 1.2 }, art);
  const text = (name, x, y, size, attrs = {}) => {
    const n = el('text', { x, y, 'text-anchor': 'middle', fill: '#181a16', 'font-family': 'Georgia,serif', 'font-size': size, 'paint-order': 'stroke', stroke: '#e8e7df', 'stroke-width': 4, 'stroke-linejoin': 'round', ...attrs }, art);
    n.dataset.inkSize = size;
    n.textContent = name; return n;
  };
  const locations = [[581,83],[495,325],[975,320],[171,507],[716,669],[571,798]];
  wd.districts.slice(0,6).forEach((d,i) => text(d.name, ...locations[i], 23, { 'font-weight': 'bold', class:'rm-district-label' }));
  wd.parks.slice(0,3).forEach((p,i) => text(p.name, ...[[966,94],[875,432],[229,770]][i], 22));
  wd.roads.slice(0,5).forEach((p,i) => {
    const [x,y,a] = [[840,199,9],[212,564,6],[558,575,-80],[568,680,-77],[984,438,-55]][i];
    text(p.name,x,y,19,{ transform: `rotate(${a} ${x} ${y})` });
  });
  text('Rivermere Bay', 222, 109, 27, { 'font-style': 'italic', 'letter-spacing': 3, fill: '#485050', stroke: 'none' });
  text('Eastfork River', 783, 503, 23, { transform: 'rotate(26 783 503)', 'font-style': 'italic', 'letter-spacing': 2, fill: '#4e5654', stroke: 'none' });
}
