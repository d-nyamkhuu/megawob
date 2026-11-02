// Design on the shared pan-map/city template.
function aeroMapIcon(parent, type) {
  const paths = {
    station: '<rect x="5" y="2" width="14" height="17" rx="4" fill="none"/><path d="M8 6h8v6H8zM8 22l2-3m6 3-2-3M8 15h1m6 0h1" fill="none"/><path d="M10 3h4"/>',
    food: '<path d="M5 2v8m3-8v8M2 2v8q0 3 3 3v9m13-20q-5 4-3 12h4V2zm1 11v9" fill="none"/>',
    museum: '<path d="M2 8l10-6 10 6zM2 22h20M4 19h16M6 9v10m6-10v10m6-10v10" fill="none"/>',
    book: '<path d="M12 5q-4-4-10-2v17q6-2 10 1 4-3 10-1V3q-6-2-10 2v16" fill="none"/>',
    theatre: '<path d="M2 4l10 1v8q-6 8-10-1zM12 8l10-2v10q-5 8-10 0z" fill="none"/><path d="M5 8h1m3 0h1m5 3h1m3-1h1M5 13q3 3 5 0m5 3q2-2 5-1" fill="none"/>',
    park: '<path d="M12 1L6 8h3l-5 7h5l-4 5h6v3h3v-3h6l-4-5h4l-5-7h3z" fill="#4d9140" stroke="#3b7833"/>',
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', '22'); svg.setAttribute('height', '22');
  svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
  svg.innerHTML = paths[type] || paths.museum;
  parent.replaceChildren(svg);
}
function aeroPlaceType(p) {
  return /station/.test(p.kind) ? 'station' : /cafe|bakery|market|grocer|restaurant/.test(p.kind) ? 'food' : /library|book/.test(p.kind) ? 'book' : /theatre|theater|cinema|comedy/.test(p.kind) ? 'theatre' : 'museum';
}
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zoom-04',
  name: 'design',
  split: 'train',
  scenarios: ['zoom'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    maxWidth: 1900,
    maxHeight: 1200,
    widthInset: 0,
    heightInset: 0,
    maxMapWidth: 1600,
    mapHeaderHeight: 0,
    panelWidth: 380,
    font: '14px/1.4 "Segoe UI", Tahoma, Arial, sans-serif',
    roadWidths: [0, 5, 8, 10, 12, 14, 16],
    streetWidths: [0, 0, 2.3, 3, 4, 5, 6],
    tierColors: { 1: '#0756b7', 2: '#0756b7', 3: '#0756b7' },
    venueColor: '#f77b00',
    explorerSearch: 'Search for a place or address...',
    parts: {
      shellPanels: (base, S) => (ctx, root) => {
        const ui = base(ctx, root);
        ui.rail.hidden = true;
        ui.foot.hidden = true;
        return ui;
      },
      explorerSearch: (base, S) => (ctx, chrome) => {
        const el = ctx.util.el;
        const box = el('section', 'aero-search aero-section', chrome.panel);
        const note = document.querySelector('.ref-panel');
        if (note) box.after(note);
        el('h2', 'aero-heading', box, 'Search Places');
        const line = el('div', 'aero-search-line', box);
        const input = base(ctx, chrome);
        line.append(input);
        const button = el('button', 'aero-search-button', line);
        button.type = 'button'; button.title = 'Search places';
        S.P.icon(button, 'search', 23);
        button.addEventListener('click', () => input.dispatchEvent(new Event('input')));
        return input;
      },
      explorerHeading: (base, S) => (ctx, panel) => {
        const el = ctx.util.el;
        const section = el('section', 'aero-layers aero-section', panel);
        el('h2', 'aero-heading', section, 'Map Layers');
        for (const [name, type, active] of [['Stations', 'station', true], ['Venues', 'venue', true], ['Parks & Recreation', 'park', true], ['Roads', 'road', true], ['District Labels', 'district', false], ['Water Features', 'water', false]]) {
          const row = el('label', 'aero-layer', section);
          const check = el('input', '', row); check.type = 'checkbox'; check.checked = active;
          const icon = el('span', 'aero-key aero-key-' + type, row);
          if (type === 'station' || type === 'park') aeroMapIcon(icon, type);
          if (type === 'venue') aeroMapIcon(icon, 'food');
          el('span', '', row, name);
          check.addEventListener('change', () => {
            const port = S.els.port;
            if (port) port.classList.toggle('aero-hide-' + type, !check.checked);
          });
        }
        const head = el('div', 'aero-directory-heading aero-heading', panel);
        el('strong', '', head, 'Places on Map');
        el('span', '', head, ctx.spec.places.length + ' places');
        return section;
      },
      explorerRow: (base, S) => (ctx, list, p) => {
        const row = base(ctx, list, p);
        row.row.classList.add(/station/.test(p.kind) ? 'aero-station' : 'aero-venue');
        aeroMapIcon(row.row.querySelector('.mpe-badge'), aeroPlaceType(p));
        return row;
      },
      explorerWorld: (base, S) => (ctx, port, W, H) => {
        const scene = base(ctx, port, W, H);
        const svg = (name, attrs, parent) => {
          const node = document.createElementNS('http://www.w3.org/2000/svg', name);
          for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
          parent.append(node); return node;
        };
        const ground = svg('g', { class: 'aero-cartography', 'pointer-events': 'none' }, scene.world);
        scene.world.insertBefore(ground, scene.world.firstChild);
        const defs = svg('defs', {}, ground);
        const unit = (scene.wd.grid ? scene.wd.grid.g : 200) / 3;
        const pattern = svg('pattern', { id: 'aero-city-blocks', width: unit * 8, height: unit * 8, patternUnits: 'userSpaceOnUse' }, defs);
        const palette = ['#e2e1dd','#e9e4dc','#e5e3df','#e6e0de','#e3e4df','#e6e5e0','#e5e0e3','#e6e2dc'];
        for (let col = 0; col < 8; col++) for (let row = 0; row < 8; row++) {
          const x = col * unit, y = row * unit;
          svg('rect', { x:x+3, y:y+3, width:unit-6, height:unit-6, fill:palette[(col*3+row*5)%8], 'fill-opacity':.60, stroke:'#cfcfc9', 'stroke-width':.65 }, pattern);
          svg('path', { d:`M${x+unit*.35} ${y+3}v${unit-6}M${x+3} ${y+unit*.57}h${unit-6}`, stroke:'#f3f1eb', 'stroke-width':1.2, fill:'none' }, pattern);
        }
        const districts = scene.wd.districts;
        const districtColors = ['#e6dce4','#dcdce7','#e9e0d0','#e2e2d8','#e4d8df','#dedee8'];
        for (let i = 0; i < districts.length; i++) {
          const centre = districts[i];
          let polygon = [[-scene.wd.W,-scene.wd.H],[scene.wd.W*2,-scene.wd.H],[scene.wd.W*2,scene.wd.H*2],[-scene.wd.W,scene.wd.H*2]];
          for (let j = 0; j < districts.length; j++) if (j !== i) {
            const other = districts[j], nx = other.x-centre.x, ny = other.y-centre.y;
            const limit = (other.x*other.x+other.y*other.y-centre.x*centre.x-centre.y*centre.y)/2;
            const clipped = [];
            for (let k = 0; k < polygon.length; k++) {
              const a = polygon[k], b = polygon[(k+1)%polygon.length];
              const da = a[0]*nx+a[1]*ny-limit, db = b[0]*nx+b[1]*ny-limit;
              if (da <= 0) clipped.push(a);
              if ((da < 0) !== (db < 0)) { const t = da/(da-db); clipped.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]); }
            }
            polygon = clipped;
          }
          svg('polygon', { points:polygon.map(p=>p.join(',')).join(' '), fill:districtColors[i%districtColors.length], 'fill-opacity':.72 }, ground);
        }
        svg('rect', { x:-scene.wd.W, y:-scene.wd.H, width:scene.wd.W*3, height:scene.wd.H*3, fill:'url(#aero-city-blocks)' }, ground);
        const water = svg('linearGradient', { id:'aero-water', x1:'0%', y1:'0%', x2:'100%', y2:'100%' }, defs);
        svg('stop', { offset:'0%', 'stop-color':'#8ed2f1' }, water);
        svg('stop', { offset:'100%', 'stop-color':'#6dbce8' }, water);
        for (const path of scene.world.querySelectorAll('.mp-sea,.mp-lake')) {
          path.setAttribute('stroke', '#f8edcd'); path.setAttribute('stroke-width', '25'); path.setAttribute('stroke-linejoin', 'round');
          path.style.fill = 'url(#aero-water)';
        }
        const parkPaths = [...scene.world.querySelectorAll('.mp-park')];
        for (let i = 0; i < parkPaths.length; i++) {
          const path = parkPaths[i], park = scene.wd.parks[i];
          path.setAttribute('stroke', '#d1e5c1'); path.setAttribute('stroke-width', '7'); path.setAttribute('stroke-linejoin', 'round');
          const clip = svg('clipPath', { id:'aero-park-'+i }, defs);
          clip.append(path.cloneNode());
          const texture = svg('g', { 'clip-path':`url(#aero-park-${i})`, 'pointer-events':'none' }, scene.world);
          path.after(texture);
          const xs = park.pts.map(p=>p[0]), ys = park.pts.map(p=>p[1]);
          const x = Math.min(...xs), y = Math.min(...ys), w = Math.max(...xs)-x, h = Math.max(...ys)-y;
          for (let k = 0; k < 18; k++) svg('ellipse', { cx:x+w*((k*7%19)/19), cy:y+h*((k*11%19)/19), rx:w*.14, ry:h*.12, fill:k%2?'#a8cb92':'#d5e8c5', opacity:.32 }, texture);
          svg('path', { d:`M${x+w*.1} ${y+h*.7}Q${x+w*.8} ${y+h*.9} ${x+w*.65} ${y+h*.4}T${x+w*.4} ${y+h*.1}M${x+w*.65} ${y+h*.4}Q${x+w*.2} ${y+h*.2} ${x+w*.1} ${y+h*.55}`, fill:'none', stroke:'#f3f5e8', 'stroke-width':'5' }, texture);
        }
        return scene;
      },
      label: (base, S) => (ctx, layer, cls, text, x, y, rot, scale) => {
        const label = base(ctx, layer, cls, text, x, y, rot, scale);
        if (cls === 'mp-parkname') {
          const tree = ctx.util.el('span', 'aero-park-tree', label);
          aeroMapIcon(tree, 'park');
        }
        return label;
      },
      explorerPaint: (base, S) => (ctx, elements, model) => {
        base(ctx, elements, model);
        if (elements.aeroRoadLevel === model.z) return;
        elements.aeroRoadLevel = model.z;
        if (model.z !== 2) return;
        const scale = elements.world.transform.baseVal.consolidate().matrix.a;
        for (const road of ctx.spec.world.roads) {
          const gap = 630 / scale;
          let next = gap / 2;
          for (let i = 1; i < road.pts.length; i++) {
            const a = road.pts[i-1], b = road.pts[i];
            const length = Math.hypot(b[0]-a[0],b[1]-a[1]);
            while (next < length) {
              const fraction = next / length;
              let angle = Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
              if (angle > 90) angle -= 180;
              if (angle <= -90) angle += 180;
              S.P.label(ctx, elements.layer, 'mp-roadname', road.name, a[0]+(b[0]-a[0])*fraction, a[1]+(b[1]-a[1])*fraction, angle, scale);
              next += gap;
            }
            next -= length;
          }
        }
      },
      explorerFit: (base, S) => (ctx, card) => ({ W: card.clientWidth, H: card.clientHeight }),
      explorerControls: (base, S) => (ctx, port, corners) => {
        const controls = base(ctx, port, corners);
        controls.zout.style.order = '-1';
        const compass = ctx.util.el('div', 'aero-compass', port);
        compass.innerHTML = '<span>N</span><svg width="34" height="44" viewBox="0 0 34 44"><path d="M17 2L3 36L17 29Z" fill="#f8fdff" stroke="#376c92" stroke-width="1.5"/><path d="M17 2L31 36L17 29Z" fill="#346f9d" stroke="#376c92" stroke-width="1.5"/></svg>';
        return controls;
      },
      explorerPin: (base, S) => (ctx, layer, p, scale, shape) => {
        const marker = base(ctx, layer, p, scale, 'sq');
        marker.pin.classList.add(/station/.test(p.kind) ? 'aero-station' : 'aero-venue');
        marker.pin.style.setProperty('--c', /station/.test(p.kind) ? '#0756b7' : '#f77b00');
        aeroMapIcon(marker.dot, aeroPlaceType(p));
        return marker;
      },
      mapDecorated: (base, S) => (ctx, port, editor) => {
        base(ctx, port, editor);
        const el = ctx.util.el;
        const legend = el('section', 'aero-legend aero-section', S.els.chrome.panel);
        el('h2', 'aero-heading', legend, 'Legend');
        const grid = el('div', 'aero-legend-grid', legend);
        for (const [name, type] of [['Station', 'station'], ['Major Road', 'major'], ['Venue', 'venue'], ['Minor Road', 'minor'], ['Park / Green Space', 'park'], ['Water', 'water']]) {
          const row = el('div', 'aero-legend-row', grid);
          const icon = el('span', 'aero-key aero-key-' + type, row);
          if (type === 'station' || type === 'park') aeroMapIcon(icon, type);
          if (type === 'venue') aeroMapIcon(icon, 'food');
          el('span', '', row, name);
        }
      },
    },
    mapColors: {
      land: '#f1eee6', water: '#79c5eb', park: '#b9d9a6', street: '#fffdf8',
      road: '#ffd34f', casing: '#d2a943', transitRoad: '#e9a3a3', transitCasing: '#b55d5d',
      parkName: '#2f7a35', open: '#16824a', productLand: '#b7c5a4', productWater: '#66a9c9',
      productPark: '#76a55c', productRoad: '#e1cb91', editorLand: '#a4b594', editorRoad: '#e9d197',
      editorCasing: '#9a927b', droppedPin: '#c74439',
    },
  },
});
