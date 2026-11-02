// Design on templates/rotate-object/base.js: the base site's rotate-object widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-compass-01',
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
        const D = Math.floor(Math.min(500, size.height - 64, size.width - 300));
        const half = D / 2;
        const Rmap = half - 26;
        const Rring = half - 13;

        const card = util.el('div', 'rot-card', ctx.stage);
        card.style.gap = '24px';
        card.style.padding = '16px 22px';
        const mapArt = util.el('div', 'rot-map-art', card);
        const svg = sv('svg', { class: 'rot-svg', width: D, height: D, viewBox: `${-half} ${-half} ${D} ${D}` }, card);
        svg.dataset.role = 'map';
        const defs = sv('defs', {}, svg);
        const cid = `rot-map-${Math.floor(rng.next() * 1e9)}`;
        sv('circle', { r: Rmap }, sv('clipPath', { id: cid }, defs));

        // Bezel ring (the drag target is the handle on it).
        sv('circle', { r: Rring, fill: 'none', stroke: 'color-mix(in srgb, var(--fg) 30%, var(--panel))', 'stroke-width': 24 }, svg);
        for (let tick = 0; tick < 60; tick++) {
          const a = tick * 6 / R2D;
          const major = tick % 5 === 0;
          const r0 = Rring - (major ? 10 : 6), r1 = Rring + (major ? 10 : 5);
          sv('line', { x1: r0 * Math.sin(a), y1: -r0 * Math.cos(a), x2: r1 * Math.sin(a), y2: -r1 * Math.cos(a),
            stroke: major ? '#a6a5c3' : '#777795', 'stroke-width': major ? 1.6 : 1, opacity: 0.9 }, svg);
        }
        const turn = sv('g', {}, svg);
        const mapG = sv('g', { 'clip-path': `url(#${cid})` }, turn);
        const land = rng.pick(['#eef0e4', '#f1ede3', '#e8efe9']);
        sv('rect', { x: -half, y: -half, width: D, height: D, fill: land }, mapG);
        // Fine-grained city blocks make the map read as a street atlas without affecting the seeded layout.
        for (let gy = -190; gy <= 150; gy += 54) for (let gx = -190; gx <= 150; gx += 54) {
          const w = 27 + Math.abs((gx * 7 + gy * 3 + 900) % 13);
          const h = 23 + Math.abs((gx * 5 - gy * 2 + 700) % 16);
          sv('rect', { x: gx + 8, y: gy + 8, width: w, height: h, rx: 1,
            fill: '#d7d3c8', stroke: '#c4c0b6', 'stroke-width': 1, opacity: 0.86 }, mapG);
          sv('rect', { x: gx + 13, y: gy + 13, width: w - 10, height: h - 10,
            fill: '#c9c5bb', opacity: 0.58 }, mapG);
        }
        for (let k = 0; k < 3; k++) sv('circle', { cx: rng.int(-Rmap, Rmap), cy: rng.int(-Rmap, Rmap), r: rng.int(30, 70), fill: '#cfe3c1' }, mapG);
        const ry = rng.int(-Rmap / 2, Rmap / 2);
        sv('path', { d: `M${-half},${ry} C${-half / 3},${ry - rng.int(-80, 80)} ${half / 3},${ry + rng.int(-80, 80)} ${half},${ry + rng.int(-40, 40)}`, fill: 'none', stroke: '#9cc6e4', 'stroke-width': 14 }, mapG);
        for (let k = 0; k < 6; k++) {
          const a = rng.float(0, Math.PI);
          const o = rng.int(-Rmap, Rmap);
          const [dx, dy] = [Math.cos(a), Math.sin(a)];
          sv('line', { x1: o * -dy - dx * D, y1: o * dx - dy * D, x2: o * -dy + dx * D, y2: o * dx + dy * D, stroke: '#ffffff', 'stroke-width': k < 2 ? 7 : 4 }, mapG);
        }
        const labels = [];
        for (const [pi, p] of spec.places.entries()) {
          const r = p.dist * (Rmap - 20);
          const [x, y] = [r * Math.sin(p.bearing / R2D), -r * Math.cos(p.bearing / R2D)];
          const pin = sv('g', { transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` }, mapG);
          const inner = sv('g', {}, pin);
          const pinColors = ['#f04e4a', '#1687e7', '#55b64b', '#ffb400', '#9657eb'];
          sv('path', { d: 'M0,2 C-3,-6 -13,-14 -13,-24 a13,13 0 1 1 26,0 C13,-14 3,-6 0,2 Z', fill: pinColors[pi % pinColors.length], stroke: '#fff', 'stroke-width': 1.7 }, inner);
          const t = sv('text', { x: 0, y: 14, 'text-anchor': 'middle', 'dominant-baseline': 'hanging' }, inner);
          t.textContent = p.name;
          t.style.font = '600 12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
          t.style.paintOrder = 'stroke';
          t.style.fill = '#2b2f36';
          t.style.stroke = land;
          t.style.strokeWidth = '3px';
          labels.push(inner);
        }
        // North marker and drag handle on the bezel (they turn with the map).
        const nm = sv('text', { class: 'ring-north', x: 0, y: -Rring, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, turn);
        nm.textContent = 'N';
        nm.style.fill = '#fff';
        nm.style.font = '700 12px system-ui, sans-serif';
        nm.style.pointerEvents = 'none';
        const hAngle = rng.pick([0, 0, 45, -45, 90]);
        const hp = polar([0, 0], Rring, hAngle);
        const handle = sv('circle', { class: 'rot-handle', cx: hp[0], cy: hp[1], r: 10, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 2.5 }, turn);
        if (hAngle === 0) turn.append(nm); // the N marker sits on the handle (it ignores the pointer)
        handle.dataset.role = 'handle';
        // Fixed center marker and a fixed "up" tick at the top of the bezel.
        sv('circle', { r: 7, fill: '#1c7ed6', stroke: '#fff', 'stroke-width': 3 }, svg);

        const side = util.el('div', 'rot-col', card);
        util.el('div', 'rot-title', side, rng.pick(['Map', 'Orientation', 'Navigator', 'Map view']));
        const rose = sv('svg', { width: 86, height: 86, viewBox: '-43 -43 86 86', class: 'rot-svg' }, side);
        // Keep the entire compass above the map, including at compact sizes.
        // Its transparent SVG bounds must never cover the ring's drag handle.
        const roseSize = Math.min(86, Math.max(24,
          svg.getBoundingClientRect().top - ctx.stage.getBoundingClientRect().top - 4));
        Object.assign(rose.style, {
          position: 'absolute', left: '50%', top: '0',
          width: `${roseSize}px`, height: `${roseSize}px`,
          transform: 'translateX(-50%)', overflow: 'visible', zIndex: '4',
        });
        sv('circle', { r: 40, fill: 'var(--panel)', stroke: 'var(--line)', 'stroke-width': 2 }, rose);
        const needle = sv('g', {}, rose);
        sv('path', { d: 'M0,-34 L8,0 L-8,0 Z', fill: '#e03131' }, needle);
        sv('path', { d: 'M0,34 L8,0 L-8,0 Z', fill: 'var(--muted)' }, needle);
        const rn = sv('text', { x: 0, y: -24, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, needle);
        rn.textContent = 'N';
        rn.style.fill = '#fff';
        rn.style.font = '700 10px system-ui, sans-serif';
        sv('path', { d: 'M0,-34 L5,0 L0,34 L-5,0 Z', fill: 'none', stroke: '#b8b5d0', 'stroke-width': 1 }, needle);
        for (const [label,x,y] of [['E',25,0],['S',0,28],['W',-25,0]]) {
          const t = sv('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, needle);
          t.textContent = label; t.style.fill = '#b8b5d0'; t.style.font = '700 9px system-ui, sans-serif';
        }
        // Always shown (the task's facts() reports it); the draw stays so later layout draws are as before.
        if (spec.mode !== 'bearing') rng.bool(0.6);
        const readout = util.el('div', 'rot-readout', side);
        util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle on the ring to rotate the map.', 'Turn the map with the handle on its edge.']));

        function paint(a = ctx.model.angle) {
          turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          mapArt.style.transform = `translate(-50%, -50%) rotate(${a.toFixed(3)}deg)`;
          for (const l of labels) l.setAttribute('transform', `rotate(${(-a).toFixed(3)})`);
          if (readout) readout.textContent = `${Math.round(fam.helpers.mod360(-a)) % 360}°`;
        }
        const rot = env.ui.rotateHandle(turn, handle, {
          label: 'map',
          pivot: () => centerOf(svg),
          // The SVG viewBox is scaled to the design's displayed map diameter.
          // Pointer coordinates and the rotation helper's radius are screen pixels.
          radius: Rring * svg.getBoundingClientRect().width / D,
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
