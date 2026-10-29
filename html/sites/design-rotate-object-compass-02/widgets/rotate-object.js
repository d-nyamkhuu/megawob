// Design on templates/rotate-object/base.js: the base site's rotate-object widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-compass-02',
  name: 'design',
  split: 'train',
  scenarios: ['compass'],
  template: 'rotate-object/base',
  design: {
    parts: {
      'renderCompass': (base, S) => function renderCompass(ctx) {
        const { F, R2D, centerOf, env, polar, sv } = S;
        const { util, rng, size, spec } = ctx;
        const fam = F();
        const D = Math.floor(Math.min(560, size.height - 64, size.width - 300));
        const half = D / 2;
        const Rmap = half - 26;
        const Rring = half - 13;

        const card = util.el('div', 'rot-card', ctx.stage);
        card.style.gap = '24px';
        card.style.padding = '16px 22px';
        const svg = sv('svg', { class: 'rot-svg', width: D, height: D, viewBox: `${-half} ${-half} ${D} ${D}` }, card);
        svg.dataset.role = 'map';
        const defs = sv('defs', {}, svg);
        const cid = `rot-map-${Math.floor(rng.next() * 1e9)}`;
        sv('circle', { r: Rmap }, sv('clipPath', { id: cid }, defs));

        // Bezel ring (the drag target is the handle on it).
        sv('circle', { r: Rring, fill: 'none', stroke: 'color-mix(in srgb, var(--fg) 30%, var(--panel))', 'stroke-width': 24 }, svg);
        for (let i = 0; i < 72; i++) {
          const a = i * Math.PI / 36, r1 = Rring + 2, r2 = r1 + (i % 6 === 0 ? 13 : i % 2 === 0 ? 8 : 4);
          sv('line', { x1: Math.sin(a) * r1, y1: -Math.cos(a) * r1, x2: Math.sin(a) * r2, y2: -Math.cos(a) * r2,
            stroke: '#181818', 'stroke-width': i % 6 === 0 ? 2.4 : 1.2 }, svg);
          if (i % 6 === 0) {
            const tx = Math.sin(a) * (Rring + 29), ty = -Math.cos(a) * (Rring + 29);
            const degree = sv('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
            degree.textContent = String(i * 5); degree.style.font = 'bold 13px "Courier New", monospace'; degree.style.fill = '#111';
          }
        }
        const turn = sv('g', {}, svg);
        const mapG = sv('g', { 'clip-path': `url(#${cid})` }, turn);
        const land = rng.pick(['#eef0e4', '#f1ede3', '#e8efe9']);
        sv('rect', { x: -half, y: -half, width: D, height: D, fill: '#9acb78' }, mapG);
        // Irregular deterministic forest canopy: clustered, varied greens over a parchment terrain base.
        sv('rect', { x: -half, y: -half, width: D, height: D, fill: land, opacity: '.16' }, mapG);
        for (let k = 0; k < 3; k++) sv('circle', { cx: rng.int(-Rmap, Rmap), cy: rng.int(-Rmap, Rmap), r: rng.int(30, 70), fill: '#cfe3c1' }, mapG);
        for (let k = 0; k < 760; k++) {
          const x = ((((k * 137 + 31) % 997) / 997) * 2 - 1) * Rmap;
          const y = ((((k * 263 + 71) % 991) / 991) * 2 - 1) * Rmap;
          const cluster = Math.sin(k * 2.31) + Math.cos(k * .73) + Math.sin(x * .028) + Math.cos(y * .021);
          if (x * x + y * y > Rmap * Rmap || cluster < -.55) continue;
          const rad = 1.8 + (k * 17 % 42) / 10;
          const greens = ['#347d39', '#4d9841', '#6cab4b', '#87bd57', '#286c39', '#579646'];
          sv('path', { d: `M${x-rad},${y+rad*.45} Q${x-rad*.7},${y-rad} ${x},${y-rad*.8} Q${x+rad},${y-rad*.3} ${x+rad*.75},${y+rad*.55} Q${x},${y+rad*1.05} ${x-rad},${y+rad*.45}Z`, fill: greens[k % greens.length], opacity: '.86' }, mapG);
          if (k % 4 === 0) sv('circle', { cx: x-rad*.2, cy: y-rad*.35, r: rad*.25, fill: '#a2cb69', opacity: '.8' }, mapG);
        }
        const ry = rng.int(-Rmap / 2, Rmap / 2);
        sv('path', { d: `M${-half},${ry} C${-half / 3},${ry - rng.int(-80, 80)} ${half / 3},${ry + rng.int(-80, 80)} ${half},${ry + rng.int(-40, 40)}`, fill: 'none', stroke: '#9cc6e4', 'stroke-width': 14 }, mapG);
        sv('path', { d: 'M-220,-35 C-170,-95 -120,-78 -82,-34 C-40,15 -8,35 25,2 C58,-31 88,-60 142,-45 C180,-34 206,10 231,46', fill: 'none', stroke: '#d8e8c2', 'stroke-width': 54 }, mapG);
        sv('path', { d: 'M-163,202 C-127,142 -135,95 -93,61 C-52,28 -16,71 9,107 C38,148 69,151 108,118 C151,81 165,44 224,31', fill: 'none', stroke: '#d8e8c2', 'stroke-width': 35 }, mapG);
        sv('path', { d: `M-220,-35 C-170,-95 -120,-78 -82,-34 C-40,15 -8,35 25,2 C58,-31 88,-60 142,-45 C180,-34 206,10 231,46`, fill: 'none', stroke: '#2e7dc7', 'stroke-width': 47 }, mapG);
        sv('path', { d: `M-220,-35 C-170,-95 -120,-78 -82,-34 C-40,15 -8,35 25,2 C58,-31 88,-60 142,-45 C180,-34 206,10 231,46`, fill: 'none', stroke: '#59a8e9', 'stroke-width': 37 }, mapG);
        sv('path', { d: `M-163,202 C-127,142 -135,95 -93,61 C-52,28 -16,71 9,107 C38,148 69,151 108,118 C151,81 165,44 224,31`, fill: 'none', stroke: '#398bd0', 'stroke-width': 28 }, mapG);
        sv('path', { d: 'M-171,-112 Q-143,-146 -119,-125 Q-99,-109 -112,-88 Q-137,-69 -158,-83Z M142,137 Q170,119 183,141 Q190,163 164,170 Q142,163 142,137Z M-13,-184 Q9,-202 24,-186 Q31,-168 8,-161 Q-12,-163 -13,-184Z', fill: '#59a8e9', stroke: '#b5d8a0', 'stroke-width': 5 }, mapG);
        // Seed-independent terrain texture, layered beneath the roads and place pins.
        for (let k = 0; k < 96; k++) {
          const x = (((k * 73) % 101) / 101 * 2 - 1) * Rmap;
          const y = ((((k * 47 + 19) % 103) / 103) * 2 - 1) * Rmap;
          if (x * x + y * y > Rmap * Rmap) continue;
          const radius = 2 + (k * 11 % 6);
          const color = ['#4b9b4a', '#75ae51', '#2f8544', '#a3c76d'][k % 4];
          sv('circle', { cx: x, cy: y, r: radius, fill: color, opacity: '.72' }, mapG);
          if (k % 3 === 0) sv('circle', { cx: x + 2, cy: y - 2, r: 2, fill: '#2e7139', opacity: '.8' }, mapG);
        }
        // Winding local roads with pale shoulders, plus short connecting roads.
        sv('path', { d: 'M-244,-166 C-170,-142 -151,-90 -123,-46 C-92,2 -73,32 -21,46 C24,57 60,40 104,64 C145,86 161,146 232,175', fill: 'none', stroke: '#e0d7b5', 'stroke-width': 13 }, mapG);
        sv('path', { d: 'M-244,-166 C-170,-142 -151,-90 -123,-46 C-92,2 -73,32 -21,46 C24,57 60,40 104,64 C145,86 161,146 232,175', fill: 'none', stroke: '#777765', 'stroke-width': 6 }, mapG);
        sv('path', { d: 'M-206,80 C-160,47 -126,51 -88,80 C-48,111 -33,158 8,181 C47,202 77,190 106,222', fill: 'none', stroke: '#e4dcbf', 'stroke-width': 10 }, mapG);
        sv('path', { d: 'M-206,80 C-160,47 -126,51 -88,80 C-48,111 -33,158 8,181 C47,202 77,190 106,222', fill: 'none', stroke: '#898774', 'stroke-width': 4 }, mapG);
        for (let k = 0; k < 6; k++) {
          const a = rng.float(0, Math.PI);
          const o = rng.int(-Rmap, Rmap);
          const [dx, dy] = [Math.cos(a), Math.sin(a)];
          // Retain the original seeded draws; the road artwork itself is a fixed map feature.
        }
        const labels = [];
        for (const p of spec.places) {
          const r = p.dist * (Rmap - 20);
          const [x, y] = [r * Math.sin(p.bearing / R2D), -r * Math.cos(p.bearing / R2D)];
          const pin = sv('g', { transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` }, mapG);
          const inner = sv('g', { transform: 'scale(1.35)' }, pin);
          sv('circle', { cx: 0, cy: -12, r: 9, fill: '#111', opacity: '.22' }, inner);
          sv('circle', { cx: 0, cy: -14, r: 8.5, fill: '#e01610', stroke: '#111', 'stroke-width': 1.5 }, inner);
          sv('circle', { cx: -2.5, cy: -16.5, r: 2.2, fill: '#ffaaa0', opacity: '.95' }, inner);
          const labelW = Math.max(68, p.name.length * 9 + 14);
          const labelX = Math.abs(x) > Rmap * .64 ? (x > 0 ? -16 : 16) : 0;
          const labelY = y > Rmap * .58 ? -29 : 0;
          sv('rect', { x: -labelW / 2 + labelX, y: -1 + labelY, width: labelW, height: 27, fill: '#f7f7f2', stroke: '#333', 'stroke-width': 1.5 }, inner);
          const t = sv('text', { x: labelX, y: 12 + labelY, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, inner);
          t.textContent = p.name;
          t.style.font = 'bold 17px "Courier New", monospace';
          t.style.paintOrder = 'normal';
          t.style.fill = '#2b2f36';
          t.style.stroke = 'none';
          t.style.strokeWidth = '0';
          labels.push(inner);
        }
        // North marker and drag handle on the bezel (they turn with the map).
        const nm = sv('text', { x: 0, y: -Rring, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, turn);
        nm.textContent = 'N';
        nm.style.fill = '#fff';
        nm.style.font = '700 12px system-ui, sans-serif';
        nm.style.pointerEvents = 'none';
        const hAngle = rng.pick([0, 0, 45, -45, 90]);
        const hp = polar([0, 0], Rring, hAngle);
        const handle = sv('circle', { class: 'rot-handle', cx: hp[0], cy: hp[1], r: 12, fill: '#0758c8', stroke: '#111', 'stroke-width': 2 }, turn);
        sv('path', { d: `M${hp[0]},${hp[1]-15} l-8,29 h16 z`, fill: '#0758c8', stroke: '#111', 'stroke-width': 2, 'pointer-events': 'none' }, turn);
        if (hAngle === 0) turn.append(nm); // the N marker sits on the handle (it ignores the pointer)
        handle.dataset.role = 'handle';
        // Fixed center marker and a fixed "up" tick at the top of the bezel.
        sv('circle', { r: 7, fill: '#1c7ed6', stroke: '#fff', 'stroke-width': 3 }, svg);
        sv('path', { d: `M0,${-half + 1} l-6,0 l6,9 l6,-9 z`, fill: 'var(--fg)', opacity: 0.7, 'pointer-events': 'none' }, svg);

        const side = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', side, rng.pick(['Map', 'Orientation', 'Navigator', 'Map view']));
        const rose = sv('svg', { width: 150, height: 200, viewBox: '-75 -100 150 200', class: 'rot-svg compass-rose' }, side);
        sv('circle', { r: 66, fill: '#c7c7c7', stroke: 'none' }, rose);
        const needle = sv('g', {}, rose);
        sv('path', { d: 'M0,-73 L8,-10 L0,0 L-8,-10 Z M0,73 L8,10 L0,0 L-8,10 Z M-73,0 L-10,-8 L0,0 L-10,8 Z M73,0 L10,-8 L0,0 L10,8 Z', fill: '#fa7e08', stroke: '#111', 'stroke-width': 2 }, needle);
        sv('path', { d: 'M0,-50 L5,-8 L0,0 L-5,-8 Z M0,50 L5,8 L0,0 L-5,8 Z M-50,0 L-8,-5 L0,0 L-8,5 Z M50,0 L8,-5 L0,0 L8,5 Z M-52,-52 L-7,-7 L0,0 L-16,-40 Z M52,-52 L7,-7 L0,0 L16,-40 Z M-52,52 L-7,7 L0,0 L-16,40 Z M52,52 L7,7 L0,0 L16,40 Z', fill: '#444', stroke: '#111', 'stroke-width': 1.8 }, needle);
        for (const [label, x, y] of [['N',0,-88],['S',0,92],['W',-67,4],['E',67,4],['NW',-50,-49],['NE',50,-49],['SW',-50,56],['SE',50,56]]) {
          const t = sv('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, rose);
          t.textContent = label; t.style.font = `${label.length === 1 ? 'bold 20px' : 'bold 11px'} "Courier New", monospace`; t.style.fill = '#111';
        }
        // Always shown (the task's facts() reports it); the draw stays so later layout draws are as before.
        if (spec.mode !== 'bearing') rng.bool(0.6);
        const readout = util.el('div', 'rot-readout', side);
        const placeBox = document.querySelector('.place-list');
        const placeHeading = document.querySelector('.places-heading');
        if (placeHeading) placeHeading.textContent = `Places (${spec.places.length})`;
        if (placeBox) {
          placeBox.textContent = '';
          spec.places.forEach((place, i) => {
            const row = util.el('div', 'place-row' + (i === 0 ? ' selected' : ''), placeBox, place.name);
            row.dataset.place = String(i);
          });
        }
        util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle on the ring to rotate the map.', 'Turn the map with the handle on its edge.']));

        function paint(a = ctx.model.angle) {
          turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          for (const l of labels) l.setAttribute('transform', `rotate(${(-a).toFixed(3)})`);
          needle.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          if (readout) readout.textContent = `Bearing: ${String(Math.round(fam.helpers.mod360(-a)) % 360).padStart(3, '0')}°`;
          const status = document.querySelector('.status-summary');
          if (status) status.textContent = `Rotation: ${String(Math.round(fam.helpers.mod360(a))).padStart(3, '0')}°\nCenter: 37.4° N 122.1° W\nZoom: 1.0x\n\nPlaces Shown\nTotal: ${spec.places.length}\nVisible: ${spec.places.length}`;
        }
        const rot = env.ui.rotateHandle(turn, handle, {
          label: 'map',
          pivot: () => centerOf(svg),
          radius: Rring,
          restAngle: hAngle,
          angle: ctx.model.angle,
          constrain: fam.helpers.mod360,
          place: (el, a) => paint(a),
          onInput(angle) {
            ctx.update({ angle });
          },
        });
        paint();
        S.view = {
          card,
          anchors: [svg],
          sync(m) {
            rot.set(m.angle);
            paint();
          },
          locate(t) {
            if (t.handle) return rot.locateHandle();
            if (t.handleAngle !== undefined) return rot.locate(t.handleAngle);
            return null;
          },
        };
      },
    },
  },
});
