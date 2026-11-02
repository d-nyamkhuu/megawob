// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zoom-05',
  name: 'design',
  split: 'train',
  scenarios: ['zoom'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
      font: '18px/1.2 Georgia,serif', panelWidth: 440, narrowPanelWidth: 300,
      maxWidth: 2000, maxHeight: 1400, widthInset: 0, heightInset: 0,
      maxMapWidth: 1800, mapHeaderHeight: 0, explorerSearch: 'Search places, streets or districts...',
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
        result.zoomBox.append(result.zin, result.zout);
        result.zin.setAttribute('aria-label', 'Zoom in'); result.zout.setAttribute('aria-label', 'Zoom out');
        const locator = ctx.util.el('button', 'rm-locate', port);
        locator.type = 'button'; locator.title = 'Locate'; locator.setAttribute('aria-label', 'Locate');
        locator.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2v6M16 24v6M2 16h6M24 16h6"/><circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="3"/></svg>';
        const instruments = ctx.util.el('div', 'rm-instruments', port);
        instruments.innerHTML = '<div class="rm-scale-labels"><span>0</span><span>0.5</span><span>1</span><span>2 km</span></div><div class="rm-scale-bar"><i></i><i></i><i></i></div><div class="rm-north"><svg viewBox="0 0 32 48" aria-hidden="true"><path d="M16 1 29 38 16 30 3 38Z" fill="#f1f7fa"/><path d="M16 1 16 30 3 38Z" fill="#fff"/><path d="M16 1 29 38 16 30Z" fill="#153c57" stroke="#fff" stroke-width="2"/></svg><span>N</span></div>';
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
          if (text.rmBacking) text.rmBacking.style.display = text.style.display;
        });
        const occupied = [...E.world.querySelectorAll('.mp-pin .mp-name')].map(n => n.getBoundingClientRect()).filter(b => b.width && b.height);
        const labels = [...terrain.querySelectorAll('text')].sort((a,b) => Number(b.classList.contains('rm-district-label')) - Number(a.classList.contains('rm-district-label')));
        labels.forEach(label => {
          if (label.style.display === 'none') return;
          const b = label.getBoundingClientRect();
          if (occupied.some(o => b.left < o.right + 3 && b.right + 3 > o.left && b.top < o.bottom + 2 && b.bottom + 2 > o.top)) {
            label.style.display = 'none';
            if (label.rmBacking) label.rmBacking.style.display = 'none';
          } else occupied.push(b);
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
  const bay = 'M-200 -100H410Q389 32 369 66T337 127Q321 166 286 177Q277 194 287 212Q297 227 278 248Q262 258 272 284Q286 320 260 343Q242 365 254 389Q268 408 241 431Q217 453 224 484Q243 509 213 529Q194 552 202 579Q225 611 215 646Q200 682 226 706Q242 725 254 764Q274 804 317 855H-200Z';
  const river = 'M380 -90Q371 50 445 153T537 271Q502 334 549 373T693 421Q758 450 785 524T919 622Q990 653 1154 634';
  const parks = [
    'M560 105Q619 61 687 89L730 133Q737 193 706 250Q671 292 618 267L570 243Q548 194 560 105Z',
    'M906 302Q958 294 977 334L992 394Q985 446 945 453L906 433Q868 401 876 352Z',
    'M943 627Q1014 604 1072 659L1137 739 1160 875 960 875Q915 792 901 720Q892 652 943 627Z',
  ];
  el('rect', { x: -5000, y: -5000, width: 12000, height: 12000, fill: '#073b63' }, art);
  const defs = el('defs', {}, art);
  const mask = el('mask', { id: 'rm-landmask', maskUnits: 'userSpaceOnUse', x: -2000, y: -2000, width: 6000, height: 6000 }, defs);
  el('rect', { x: -2000, y: -2000, width: 6000, height: 6000, fill: 'white' }, mask);
  el('path', { d: bay, fill: 'black' }, mask);
  el('path', { d: river, fill: 'none', stroke: 'black', 'stroke-width': 39 }, mask);
  parks.forEach(d => el('path', { d, fill: 'black' }, mask));
  const city = el('g', { mask: 'url(#rm-landmask)' }, art);
  const warp = (x, y) => [x + 18 * Math.sin(y / 168) + y * .055 + 20 * Math.sin(x / 260) * Math.sin(y / 210), y + 18 * Math.sin(x / 230) + x * .095];
  const pts = points => points.map((p, i) => (i ? 'L' : 'M') + warp(...p).join(',')).join('');
  // Property parcels, with separate small footprints rather than solid square blocks.
  for (let y = -120; y < 1000; y += 47) for (let x = -160; x < 1250; x += 53) {
    const block = el('g', { transform: `translate(${warp(x, y)}) rotate(${4 * Math.cos(x / 230)})` }, city);
    el('rect', { x: 5, y: 5, width: 42, height: 36, fill: '#143a50', stroke: '#20465e', 'stroke-width': .45 }, block);
    for (let i = 0; i < 6; i++) {
      if (r.bool(.12)) continue;
      const xx = 8 + i % 3 * 12 + r.float(-1, 2), yy = 8 + Math.floor(i / 3) * 17;
      el('rect', { x: xx, y: yy + r.float(-1,2), width: r.int(5, 10), height: r.int(6, 13), rx: .8, fill: r.pick(['#183e55', '#1b455c', '#1d485e', '#173a50']), stroke: '#24556c', 'stroke-width': .35 }, block);
    }
  }
  const street = d => {
    el('path', { d, fill: 'none', stroke: '#254e65', 'stroke-width': 2.1, 'stroke-linejoin': 'round', 'vector-effect':'non-scaling-stroke' }, city);
    el('path', { d, fill: 'none', stroke: '#82a9bb', 'stroke-width': 1.05, 'stroke-linejoin': 'round', 'vector-effect':'non-scaling-stroke', opacity: .8 }, city);
  };
  for (let x = -160; x < 1300; x += 53) street(pts(Array.from({ length: 25 }, (_, i) => [x, -120 + i * 47])));
  for (let y = -120; y < 1050; y += 47) street(pts(Array.from({ length: 30 }, (_, i) => [-160 + i * 53, y])));
  for (let x = -134; x < 1300; x += 53) el('path', { d: pts(Array.from({ length: 25 }, (_, i) => [x, -120 + i * 47])), fill:'none', stroke:'#6c93a7', 'stroke-width': .55, opacity:.65 }, city);
  for (let y = -97; y < 1050; y += 47) el('path', { d: pts(Array.from({ length: 30 }, (_, i) => [-160 + i * 53, y])), fill:'none', stroke:'#6c93a7', 'stroke-width': .55, opacity:.65 }, city);
  for (let x = -147; x < 1300; x += 53) el('path', { d: pts(Array.from({ length: 25 }, (_, i) => [x, -120 + i * 47])), fill:'none', stroke:'#557f94', 'stroke-width': .4, opacity:.6 }, city);
  for (let y = -108; y < 1050; y += 47) el('path', { d: pts(Array.from({ length: 30 }, (_, i) => [-160 + i * 53, y])), fill:'none', stroke:'#557f94', 'stroke-width': .4, opacity:.6 }, city);
  ['M205 115Q410 189 571 311T1051 467','M267 804Q473 702 598 582T1130 253','M303 168Q497 327 723 342T1205 583'].forEach(d => el('path', { d, fill:'none', stroke:'#96b8c8', 'stroke-width':1.2, opacity:.9 }, city));
  parks.forEach(d => el('path', { d, fill: '#235b4b', stroke: '#82a99b', 'stroke-width': 4 }, art));
  parks.forEach((d, j) => {
    const clip = el('clipPath', { id: 'rm-parkclip-' + j }, defs);
    el('path', { d }, clip);
    const ink = el('g', { 'clip-path': 'url(#rm-parkclip-' + j + ')' }, art);
    const [cx,cy,rx,ry] = [[637,176,105,115],[931,377,75,84],[1033,737,125,122]][j];
    for (let n=0; n<125; n++) {
      const x=cx+Math.sin(n*19.47+j)*rx, y=cy+Math.cos(n*23.13+j)*ry;
      el('circle', { cx:x, cy:y, r:1.5+(n%4), fill:n%3?'#194e43':'#32725a', opacity:.48 }, ink);
    }
    for (let n=0; n<14; n++) {
      const x=cx+Math.sin(n*8.27)*rx, y=cy+Math.cos(n*11.31)*ry;
      el('path', { d:`M${x-5} ${y}q5-7 10 0m-8 3q6-7 12-1`, fill:'none', stroke:'#729c7b', 'stroke-width':.7, opacity:.55 }, ink);
    }
  });
  const water = { fill: '#073b63', stroke: '#5a8aa5', 'stroke-width': 1.2 };
  el('path', { d: bay, ...water }, art);
  el('path', { d: 'M153 72q35-25 66 6l29 25q14 45-9 76l-53 12q-38-11-43-47t10-72Z M103 541q30-23 59-7l35 36q29 54-8 79l-51-18q-39-20-35-90Z M1005 192q53-22 99 3l25 52q-3 45-55 46l-68-28q-27-37-1-73Z', fill: '#235b4b', stroke: '#82a99b', 'stroke-width': 1.2 }, art);
  el('path', { d: 'M135 286Q154 248 184 254T221 310Q211 340 159 321Z', fill: 'none', stroke: '#93968a', 'stroke-dasharray': '5 4', 'stroke-width': 1.2 }, art);
  el('path', { d: river, fill: 'none', stroke: '#6d9bb1', 'stroke-width': 49 }, art);
  el('path', { d: river, fill: 'none', stroke: '#073858', 'stroke-width': 43 }, art);
  el('path', { d: river, fill: 'none', stroke: '#0a4772', 'stroke-width': 40 }, art);
  ['M389 404L382 451', 'M484 440L474 484', 'M581 432L568 478'].forEach(d => {
    el('path', { d, fill:'none', stroke:'#666b63', 'stroke-width':7, 'stroke-dasharray':'1 4' }, art);
    el('path', { d, fill:'none', stroke:'#f5f4ea', 'stroke-width':3 }, art);
    el('path', { d, fill:'none', stroke:'#777c71', 'stroke-width':.8 }, art);
  });
  const road = d => {
    el('path', { d, fill: 'none', stroke: '#9c8045', 'stroke-width': 5.5, 'stroke-linejoin': 'round', 'vector-effect':'non-scaling-stroke' }, art);
    el('path', { d, fill: 'none', stroke: '#e3bd68', 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'vector-effect':'non-scaling-stroke' }, art);
    el('path', { d, fill: 'none', stroke: '#ffe1a3', 'stroke-width': .65, 'vector-effect':'non-scaling-stroke' }, art);
  };
  ['M176 -50Q313 153 281 317Q260 387 375 420T698 488Q871 510 1119 798', 'M342 950Q366 636 371 442T377 -70', 'M679 950Q667 698 668 463T671 -60', 'M515 950Q538 720 697 693T1154 858', 'M730 10Q912 105 1126 220'].forEach(road);
  // Park paths, trees and small ponds use the same restrained ink as the survey.
  ['M851 0Q875 163 945 128T1109 154', 'M815 401Q809 453 926 487', 'M102 688Q173 647 228 703T361 701Q405 798 308 829T209 764'].forEach(d => el('path', { d, fill: 'none', stroke: '#737b6c', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }, art));
  // Fine grass and footpath marks keep green spaces from reading as flat shapes.
  [[636,171,84,91],[931,379,52,62],[1032,733,90,85]].forEach(([cx,cy,rx,ry]) => {
    for (let i=0; i<85; i++) {
      const u=r.float(-1,1), v=r.float(-1,1);
      if (u*u+v*v>.9) continue;
      const x=cx+u*rx, y=cy+v*ry;
      el('path', { d:`M${x} ${y}l-1-3m2 4 1-3`, stroke:r.pick(['#e2e4d8','#959e8b','#a9b29e']), 'stroke-width':.8, opacity:.7, fill:'none' }, art);
    }
  });
  ['M642 193q15-9 21 4t-7 14q-20-1-14-18Z', 'M1040 758q19-10 23 8t-19 19q-21-4-4-27Z'].forEach(d => el('path', { d, fill: '#35684f', opacity:.8 }, art));
  const tree = (x, y, h) => {
    el('path', { d: `M${x} ${y}v${h}m0 ${-h}l${-h * .25} ${h * .55}h${h * .15}l${-h * .23} ${h * .25}h${h * .66}l${-h * .23} ${-h * .25}h${h * .15}Z`, fill: '#858d7e', stroke: '#596250', 'stroke-width': .8 }, art);
  };
  [[581,130],[606,102],[689,128],[660,247],[704,211],[894,337],[935,315],[961,391],[916,426],[945,688],[990,646],[1048,686],[1091,740],[1004,814],[1066,805]].forEach(([x,y],i) => tree(x,y,8 + i % 4 * 3));
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
    const backing = attrs.class === 'rm-district-label' ? el('rect', { x:x-(name.length*size*.34)-10, y:y-size*.91, width:name.length*size*.68+20, height:size*1.18, rx:1, fill:'#082c47', opacity:.75 }, art) : null;
    const n = el('text', { x, y, 'text-anchor': 'middle', fill: '#181a16', 'font-family': 'Georgia,serif', 'font-size': size, 'paint-order': 'stroke', stroke: '#e8e7df', 'stroke-width': 4, 'stroke-linejoin': 'round', ...attrs }, art);
    n.rmBacking = backing;
    n.dataset.inkSize = size;
    n.textContent = name; return n;
  };
  const locations = [[624,155],[400,260],[890,205],[526,420],[436,665],[882,680]];
  wd.districts.slice(0,6).forEach((d,i) => text(d.name, ...locations[i], 13, { 'font-weight': 'bold', class:'rm-district-label' }));
  wd.parks.slice(0,3).forEach((p,i) => text(p.name, ...[[628,210],[935,383],[1020,735]][i], 13));
  wd.roads.slice(0,5).forEach((p,i) => {
    const [x,y,a] = [[927,161,15],[338,374,-76],[453,548,17],[754,456,13],[819,670,-52]][i];
    text(p.name,x,y,12,{ transform: `rotate(${a} ${x} ${y})` });
  });
  text('Rivermere Bay', 134, 294, 16, { 'font-style': 'italic', 'letter-spacing': 3, fill: '#9dc8dd', stroke: 'none' });
  text('Eastfork River', 716, 515, 14, { transform: 'rotate(22 716 515)', 'font-style': 'italic', 'letter-spacing': 2, fill: '#9dc8dd', stroke: 'none' });
}
