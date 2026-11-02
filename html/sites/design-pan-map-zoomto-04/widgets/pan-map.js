// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zoomto-04',
  name: 'design',
  split: 'train',
  scenarios: ['zoomto'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    maxWidth: 1440,
    maxHeight: 790,
    widthInset: 0,
    heightInset: 0,
    mapColors: {
      land: '#ede9dc', water: '#83b8d4', park: '#bed4a7', street: '#fffdf7', road: '#f4d278', casing: '#c9a454',
      transitRoad: '#d4a0a0', transitCasing: '#a75e56', parkName: '#365e3b', open: '#16824a',
      productLand: '#ece8dc', productWater: '#83b8d4', productPark: '#bed4a7', productRoad: '#f4d278',
      editorLand: '#ede9dc', editorRoad: '#f4d278', editorCasing: '#d0b66d', droppedPin: '#b3483d',
    },
    parts: {
      topActions: (base, S) => () => {},
      shellHeader: (base, S) => (ctx, root) => {
        const top = ctx.util.el('div', 'atlas-panel-tabs', root);
        ctx.util.el('div', 'atlas-panel-tab active', top, 'Map Properties');
        ctx.util.el('div', 'atlas-panel-tab', top, 'Layers');
        S.atlasTop = top;
        const bar = ctx.util.el('div', 'atlas-hidden-bar', root);
        return { top, bar };
      },
      shellPanels: (base, S) => (ctx, root) => {
        const { util } = ctx;
        const work = util.el('div', 'mpp-work atlas-work', root);
        const rail = util.el('nav', 'atlas-hidden-rail', work);
        const panel = util.el('aside', 'mpe-panel mpp-panel atlas-inspector', work);
        panel.append(S.atlasTop);
        const foot = util.el('div', 'atlas-hidden-foot', root);
        const status = util.el('span', '', foot);
        const position = util.el('span', '', foot);
        const drawer = util.el('div', 'atlas-hidden-drawer', root); drawer.hidden = true;
        const title = util.el('span', '', drawer);
        const dc = util.el('button', '', drawer);
        const db = util.el('div', '', drawer);
        return { work, rail, panel, foot, status, position, drawer, title, dc, db };
      },
      editorHeading: (base, S) => () => {},
      editorSettings: (base, S) => () => {
        return { settings: { hidden: true }, inspectorStatus: document.createElement('div') };
      },
      editorSearch: (base, S) => (ctx) => {
        const { util } = ctx;
        const box = util.el('label', 'atlas-search', document.querySelector('.ref-task'));
        util.el('span', '', box, '⌕');
        const search = util.el('input', '', box);
        search.placeholder = 'Search places, streets or districts…';
        search.setAttribute('aria-label', search.placeholder);
        const results = util.el('div', 'mpe-results atlas-results', box); results.hidden = true;
        return { search, results };
      },
      editorDirectory: (base, S) => (ctx, panel) => {
        const { util } = ctx;
        const list = util.el('div', 'atlas-properties', panel);
        const section = (title) => {
          const h = util.el('div', 'atlas-section-title', list, title);
          const rows = util.el('div', 'atlas-property-group', list);
          return rows;
        };
        let rows = section('View');
        for (const [label, value] of [['Center', '43.7231       -79.3146'], ['Zoom level', '3'], ['Map style', 'Standard']]) {
          const row = util.el('div', 'atlas-property-row', rows);
          util.el('span', '', row, label);
          if (label === 'Center') {
            const fields = util.el('span', 'atlas-coordinate-fields', row);
            util.el('span', 'atlas-value atlas-coordinate', fields, '43.7231');
            util.el('span', 'atlas-value atlas-coordinate', fields, '-79.3146');
            continue;
          }
          const field = util.el('span', 'atlas-value', row, value);
          if (label === 'Zoom level') field.classList.add('atlas-zoom-value');
        }
        rows = section('Layers');
        for (const [label, checked] of [['Streets', true], ['Districts', true], ['Parks', true], ['Bodies of water', true], ['Places', true], ['Transit (lines)', false]]) {
          const row = util.el('div', 'atlas-layer-row', rows);
          const box = util.el('span', `atlas-check${checked ? ' checked' : ''}`, row, checked ? '✓' : '');
          util.el('span', '', row, label);
        }
        rows = section('Labels');
        for (const [label, value] of [['Place labels', 'Show at this zoom level'], ['Street labels', 'Show'], ['District labels', 'Show']]) {
          const row = util.el('div', 'atlas-property-row', rows);
          util.el('span', '', row, label); util.el('span', 'atlas-value', row, value);
        }
        rows = section('Units');
        const row = util.el('div', 'atlas-property-row', rows);
        util.el('span', '', row, 'Distance units'); util.el('span', 'atlas-value', row, 'Kilometres (km)');
        return { list, stopLabels: [] };
      },
      editorTools: (base, S) => (...args) => {
        const result = base(...args);
        result.tools.style.left = '66px';
        return result;
      },
      editorFrame: (base, S) => (ctx, work) => {
        const { util } = ctx;
        const map = util.el('div', 'mpe-map atlas-map', work);
        const port = util.el('div', 'mp-port mpe-port atlas-port', map);
        return { map, port, W: port.clientWidth, H: port.clientHeight };
      },
      editorReadout: (base, S) => (ctx, port, chrome) => {
        const { util } = ctx;
        const readout = util.el('div', 'mpe-readout atlas-live-readout', chrome.panel);
        return { readout, saved: chrome.status };
      },
      editorWorld: (base, S) => (ctx, port, W, H) => {
        const result = base(ctx, port, W, H);
        const art = ctx.util.el('div', 'atlas-map-art', port);
        port.insertBefore(art, port.firstChild);
        for (const [text, x, y] of [['Maplewood District', 79, 18], ['West End', 21, 48], ['Riverside', 48, 43], ['Cedar Grove', 73, 57], ['Old Town', 37, 79]]) {
          const label = ctx.util.el('div', 'atlas-map-label', art, text);
          label.style.left = `${x}%`; label.style.top = `${y}%`;
        }
        S.atlasArt = art; S.atlasCenter = ctx.model.c.slice(); S.atlasZoom = ctx.model.z;
        const world = ctx.spec.world, cx = world.W / 2, cy = world.H / 2;
        const spacing = ctx.spec.spacing;
        const minor = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        minor.setAttribute('class', 'atlas-minor-streets');
        const grid = [];
        for (let i = -18; i <= 18; i++) {
          const x = cx + i * spacing[0] / 2, y = cy + i * spacing[1] / 2;
          grid.push(`M${x} ${cy - 1600}V${cy + 1600}`, `M${cx - 2200} ${y}H${cx + 2200}`);
        }
        minor.setAttribute('d', grid.join(''));
        result.world.insertBefore(minor, result.world.firstChild);
        const water = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        water.setAttribute('class', 'atlas-waterway');
        water.setAttribute('d', `M${cx - 1500} ${cy - 520} C${cx - 900} ${cy - 350},${cx - 700} ${cy + 120},${cx - 120} ${cy + 20} S${cx + 650} ${cy - 250},${cx + 1500} ${cy + 180}`);
        result.world.insertBefore(water, result.world.firstChild);
        const lake = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        lake.setAttribute('class', 'atlas-lake');
        lake.setAttribute('d', `M${cx + 520} ${cy + 560} C${cx + 340} ${cy + 380},${cx + 600} ${cy + 220},${cx + 980} ${cy + 300} C${cx + 1320} ${cy + 380},${cx + 1370} ${cy + 650},${cx + 1180} ${cy + 850} L${cx + 720} ${cy + 820} Z`);
        result.world.insertBefore(lake, result.world.firstChild);
        for (const [d, casingWidth, roadWidth] of [
          [`M${cx - 2100} ${cy - 210} C${cx - 1420} ${cy + 200},${cx - 980} ${cy - 60},${cx - 440} ${cy - 170} S${cx + 380} ${cy - 340},${cx + 1150} ${cy + 60} S${cx + 1780} ${cy + 340},${cx + 2250} ${cy + 240}`, 23, 16],
          [`M${cx - 1900} ${cy + 820} C${cx - 1120} ${cy + 580},${cx - 840} ${cy + 1000},${cx - 120} ${cy + 920} S${cx + 900} ${cy + 720},${cx + 1900} ${cy + 1160}`, 21, 14],
        ]) {
          const edge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          edge.setAttribute('class', 'mp-casing atlas-arterial-edge'); edge.setAttribute('d', d); edge.setAttribute('stroke-width', casingWidth);
          const road = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          road.setAttribute('class', 'mp-road atlas-arterial'); road.setAttribute('d', d); road.setAttribute('stroke-width', roadWidth);
          result.world.append(edge, road);
        }
        const centerX = ctx.model.c[0], centerY = ctx.model.c[1];
        for (const [text, x, y, cls] of [
          ['Rivermere Bay', centerX - 760, centerY - 600, 'atlas-water-label'], ['Stone River', centerX + 880, centerY + 315, 'atlas-water-label'],
          ['Harborview Expressway', centerX - 130, centerY - 175, 'atlas-road-label'], ['Lakeside Parkway', centerX - 150, centerY + 895, 'atlas-road-label'],
        ]) {
          const label = ctx.util.el('div', `mp-lbl mp-roadname ${cls}`, result.labels, text);
          label.style.left = `${x}px`; label.style.top = `${y}px`;
        }
        const initialScale = .75 * Math.pow(1.5, ctx.model.z - 2);
        for (const [text, x, y] of [['Maplewood District', .79, .18], ['West End', .21, .48], ['Riverside', .48, .43], ['Cedar Grove', .73, .57], ['Old Town', .37, .79]]) {
          const label = ctx.util.el('div', 'mp-lbl mp-district atlas-district', result.labels, text);
          label.style.left = `${centerX + (W * (x - .5)) / initialScale}px`;
          label.style.top = `${centerY + (H * (y - .5)) / initialScale}px`;
        }
        return result;
      },
      editorPaint: (base, S) => (ctx, elements, model) => {
        base(ctx, elements, model);
        if (!S.atlasArt) return;
        const ratio = Math.pow(1.5, model.z - S.atlasZoom);
        const scale0 = .75 * Math.pow(1.5, S.atlasZoom - 2);
        const dx = (S.atlasCenter[0] - model.c[0]) * scale0 * ratio;
        const dy = (S.atlasCenter[1] - model.c[1]) * scale0 * ratio;
        S.atlasArt.style.transform = `translate(${dx}px, ${dy}px) scale(${ratio})`;
      },
      readoutLines: (base, S) => (ctx, readout, lines) => {
        const coords = ctx.stage.querySelectorAll('.atlas-coordinate');
        const zoom = ctx.stage.querySelector('.atlas-zoom-value');
        if (coords.length && lines[0]) {
          const values = String(lines[0][1]).split(/,\s*/);
          coords.forEach((field, i) => { field.textContent = values[i] || ''; });
        }
        if (zoom) zoom.textContent = String(ctx.model.z);
      },
    },
  },
});
