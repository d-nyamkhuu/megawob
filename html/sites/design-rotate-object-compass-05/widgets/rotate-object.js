// Design on templates/rotate-object/base.js: the base site's rotate-object widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-compass-05',
  name: 'design',
  split: 'train',
  scenarios: ['compass'],
  template: 'rotate-object/base',
  design: { parts: { renderCompass: (base, S) => function renderCompass(ctx) {
    const { util, rng, size, spec } = ctx;
    const { sv, polar, R2D, centerOf } = S;
    const fam = S.F();
    const D = Math.floor(Math.min(630, size.height - 150, size.width - 360));
    const half = D / 2;
    const Rmap = half - D / 18;
    const Rring = half - 1;

    const card = util.el('div', 'rot-card', ctx.stage);
    card.style.setProperty('--chart-size', `${D}px`);
    card.style.gap = '24px';
    card.style.padding = '16px 22px';
    const svg = sv('svg', { class: 'rot-svg', width: D, height: D, viewBox: `${-half} ${-half} ${D} ${D}` }, card);
    svg.dataset.role = 'map';
    const defs = sv('defs', {}, svg);
    const cid = `rot-map-${Math.floor(rng.next() * 1e9)}`;
    sv('circle', { r: Rmap }, sv('clipPath', { id: cid }, defs));

    sv('circle', { r: Rring, fill: 'none', stroke: '#dce8f4', 'stroke-width': 1.5 }, svg);
    // fixed degree ticks and labels around the bezel
    const decor = sv('g', { class: 'bezel-decor', 'pointer-events': 'none' }, svg);
    for (let d = 0; d < 360; d += 2) {
      const major = d % 30 === 0;
      const a = polar([0, 0], Rring, d); const b = polar([0, 0], Rring - (major ? 21 : d % 10 === 0 ? 14 : 10), d);
      sv('line', { x1: a[0].toFixed(1), y1: a[1].toFixed(1), x2: b[0].toFixed(1), y2: b[1].toFixed(1), stroke: '#bfe6f5', 'stroke-width': major ? 2 : 1 }, decor);
    }
    for (let d = 0; d < 360; d += 30) {
      const p = polar([0, 0], half + 21, d);
      const t = sv('text', { x: p[0].toFixed(1), y: p[1].toFixed(1), 'text-anchor': 'middle', 'dominant-baseline': 'central' }, decor);
      t.textContent = `${d}°`;
      t.style.fill = '#dbeaf5'; t.style.font = '16px "Segoe UI", Arial, sans-serif';
    }
    const turn = sv('g', {}, svg);
    const mapG = sv('g', { 'clip-path': `url(#${cid})` }, turn);
    const land = rng.pick(['#eef0e4', '#f1ede3', '#e8efe9']);
    const water = sv('radialGradient', { id: `${cid}-water` }, defs);
    sv('stop', { offset: '0', 'stop-color': '#0b3b5d' }, water);
    sv('stop', { offset: '1', 'stop-color': '#06304c' }, water);
    sv('rect', { x: -half, y: -half, width: D, height: D, fill: `url(#${cid}-water)` }, mapG);
    // Retain the original decorative draws in their original order.
    const source = sv('g', { display: 'none' }, mapG);
    for (let k = 0; k < 3; k++) sv('circle', { cx: rng.int(-Rmap, Rmap), cy: rng.int(-Rmap, Rmap), r: rng.int(30, 70), fill: '#cfe3c1' }, source);
    const ry = rng.int(-Rmap / 2, Rmap / 2);
    sv('path', { d: `M${-half},${ry} C${-half / 3},${ry - rng.int(-80, 80)} ${half / 3},${ry + rng.int(-80, 80)} ${half},${ry + rng.int(-40, 40)}`, fill: 'none', stroke: '#9cc6e4', 'stroke-width': 14 }, source);
    for (let k = 0; k < 6; k++) {
      const a = rng.float(0, Math.PI);
      const o = rng.int(-Rmap, Rmap);
      const [dx, dy] = [Math.cos(a), Math.sin(a)];
      sv('line', { x1: o * -dy - dx * D, y1: o * dx - dy * D, x2: o * -dy + dx * D, y2: o * dx + dy * D, stroke: '#ffffff', 'stroke-width': k < 2 ? 7 : 4 }, source);
    }
    const chart = sv('g', { class: 'chart-art', 'pointer-events': 'none' }, mapG);
    const unit = Rmap / 280;
    for (let k = -3; k <= 3; k++) {
      const v = k * Rmap / 3;
      sv('path', { d: `M${v},${-Rmap}V${Rmap}M${-Rmap},${v}H${Rmap}`, fill: 'none', stroke: '#37617a', 'stroke-width': .7, opacity: .65 }, chart);
    }
    for (let k = -6; k <= 6; k++) {
      let d = '';
      for (let j = 0; j <= 90; j++) {
        const x = (j/45-1)*Rmap;
        const y = k*Rmap/6 + Math.sin(x/Rmap*8+k*.6)*11*unit + Math.sin(x/Rmap*21+k)*4*unit;
        d += `${j ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
      }
      sv('path', { d, fill: 'none', stroke: '#3d7993', 'stroke-width': .65, opacity: .5 }, chart);
    }
    const islands = [
      [-.56,-.01,.18,.26,.8], [.15,-.39,.24,.13,2.1],
      [.18,.34,.12,.14,3.2], [.35,-.05,.12,.13,1.6],
      [.63,.08,.09,.09,4.3], [.34,.72,.09,.06,2.6],
      [-.13,-.64,.06,.04,1.3], [-.20,.61,.05,.035,4.6],
      [-.10,.03,.045,.04,1.8], [.10,-.05,.042,.035,3.1]
    ];
    function coast(x, y, rx, ry, phase, expansion = 0, shrink = 1) {
      let d = '';
      for (let j = 0; j <= 96; j++) {
        const a = j * Math.PI / 48;
        const wobble = 1 + .16 * Math.sin(3*a+phase) + .105 * Math.cos(5*a-phase) + .055 * Math.sin(9*a+phase*2);
        let xx = x*Rmap + Math.cos(a) * (rx*Rmap*wobble*shrink + expansion*unit*(1+.13*Math.sin(4*a+phase+expansion/14)));
        let yy = y*Rmap + Math.sin(a) * (ry*Rmap*wobble*shrink + expansion*unit*(1+.17*Math.cos(3*a-phase+expansion/19)));
        if (phase === .8) {
          xx += .18*Rmap*(((Math.sin(a)+1)/2)**4)*shrink;
        }
        if (phase === 2.1) { xx += .18*rx*Rmap*Math.sin(a)*shrink; yy += .28*rx*Rmap*Math.cos(a)*shrink; }
        d += `${j ? 'L' : 'M'}${xx.toFixed(2)},${yy.toFixed(2)}`;
      }
      return d + 'Z';
    }
    function island(shape, small = false) {
      for (let n = small ? 3 : 7; n >= 1; n--) {
        sv('path', { d: coast(...shape, n * 4.2), fill: 'none', stroke: n % 2 ? '#34728b' : '#23556f', 'stroke-width': n % 2 ? .75 : .5, opacity: .85 }, chart);
      }
      const colors = ['#315f62', '#527d6e', '#78977a', '#62846a', '#486f59', '#375b4a', '#2b4b40'];
      colors.forEach((color, n) => sv('path', { d: coast(...shape, 0, 1 - n*.12), fill: color, 'fill-opacity': n ? .68 : 1, stroke: n === 2 ? '#8aa383' : '#71967e', 'stroke-width': .7, 'stroke-opacity': .45 }, chart));
    }
    islands.forEach(s => island(s));
    for (let k = 0; k < 57; k++) {
      const x = Math.sin(k*12.31+1.4)*.87;
      const y = Math.cos(k*7.71+.8)*.87;
      if (x*x+y*y > .87 || islands.some(s => ((x-s[0])/s[2])**2+((y-s[1])/s[3])**2 < 2.6)) continue;
      island([x,y,.012+(k%4)*.006,.012+(k%3)*.006,k*.71], true);
    }
    for (let k = 0; k < 28; k++) {
      const x = Math.sin(k*3.81)*Rmap, y = Math.cos(k*5.19)*Rmap;
      sv('path', { d: `M${x},${y}c8,-9 14,9 22,0s15,5 21,-2`, fill: 'none', stroke: '#33738f', 'stroke-width': .65, opacity: .7 }, chart);
      if (k % 2 === 0) sv('circle', { cx: x, cy: y, r: 3*unit, fill: 'none', stroke: '#38728b', 'stroke-width': .7 }, chart);
    }
    const labels = [];
    for (const p of spec.places) {
      const r = p.dist * (Rmap - 20);
      const [x, y] = [r * Math.sin(p.bearing / R2D), -r * Math.cos(p.bearing / R2D)];
      const pin = sv('g', { class: 'chart-pin', transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` }, mapG);
      const inner = sv('g', {}, pin);
      sv('path', { d: 'M0,0 C-2,-6 -8,-10 -8,-16 a8,8 0 1 1 16,0 C8,-10 2,-6 0,0 Z', fill: '#d9480f', stroke: '#06283f', 'stroke-width': 2 }, inner);
      const t = sv('text', { x: 13, y: -13, 'text-anchor': 'start', 'dominant-baseline': 'central' }, inner);
      t.textContent = p.name;
      t.style.font = `${Math.max(12, Math.min(16, D/36))}px "Segoe UI", Arial, sans-serif`;
      t.style.paintOrder = 'stroke';
      t.style.fill = '#2b2f36';
      t.style.stroke = land;
      t.style.strokeWidth = '3px';
      inner.chartPoint = [x, y]; inner.chartLabel = t;
      labels.push(inner);
    }
    sv('circle', { r: Rmap, fill: 'none', stroke: '#a6bfca', 'stroke-width': 1.2, 'pointer-events': 'none' }, svg);
    // legend mirrors the seeded pin names
    const lp = document.querySelector('.legend-places');
    if (lp) {
      const PIN = ['#e53935', '#2fd23f', '#3b82f6', '#f5d90a', '#fb8c00', '#a64be0', '#22d3ee', '#b0b6bd'];
      lp.textContent = '';
      spec.places.forEach((p, i) => {
        const row = util.el('div', 'legend-row', lp);
        const dot = util.el('i', 'legend-pin', row); dot.style.background = PIN[i % 8];
        util.el('span', '', row, p.name);
      });
    }
    const nm = sv('text', { x: 0, y: -Rring, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, turn);
    nm.textContent = 'N';
    nm.style.fill = 'none';
    nm.style.font = '700 12px system-ui, sans-serif';
    nm.style.pointerEvents = 'none';
    const hAngle = rng.pick([0, 0, 45, -45, 90]);
    const hp = polar([0, 0], Rring, hAngle);
    const handle = sv('circle', { class: 'rot-handle', cx: hp[0], cy: hp[1], r: 14, fill: 'transparent' }, turn);
    sv('path', { class: 'handle-mark', d: 'M-11,-5L11,-5L0,17Z', transform: `translate(${hp[0]},${hp[1]}) rotate(${hAngle})`, fill: '#f9df18', stroke: '#fff06d', 'stroke-width': 1, 'pointer-events': 'none' }, turn);
    if (hAngle === 0) turn.append(nm);
    handle.dataset.role = 'handle';
    sv('circle', { r: 7, fill: '#1c7ed6', stroke: '#fff', 'stroke-width': 3 }, svg);
    sv('path', { d: `M0,${-half + 23} l-12,-30 l24,0 z`, fill: 'var(--fg)', opacity: 0.7, 'pointer-events': 'none' }, svg);

    const side = util.el('div', 'rot-col', card);
    util.el('div', 'rot-title', side, rng.pick(['Map', 'Orientation', 'Navigator', 'Map view']));
    const rose = sv('svg', { width: 86, height: 86, viewBox: '-43 -43 86 86', class: 'rot-svg' }, side);
    sv('circle', { r: 42, fill: 'none', stroke: '#dce8f4', 'stroke-width': .65 }, rose);
    sv('circle', { r: 36, fill: 'none', stroke: '#dce8f4', 'stroke-width': .65 }, rose);
    for (let k = 0; k < 16; k++) {
      const a = polar([0,0], 36, k*22.5), b = polar([0,0], 42, k*22.5);
      sv('line', { x1:a[0], y1:a[1], x2:b[0], y2:b[1], stroke:'#bdcfda', 'stroke-width':.6 }, rose);
    }
    for (let k = 0; k < 8; k++) {
      const reach = k % 2 ? 29 : 38;
      sv('path', { d: `M0,0L-5,-5L0,${-reach}Z`, transform: `rotate(${k*45})`, fill: k%2 ? '#456779' : '#a9ced8', stroke:'#b3d0db', 'stroke-width':.4 }, rose);
      sv('path', { d: `M0,0L5,-5L0,${-reach}Z`, transform: `rotate(${k*45})`, fill: k%2 ? '#153c51' : '#254d61', stroke:'#b3d0db', 'stroke-width':.4 }, rose);
    }
    [['N', 0, -52], ['E', 52, 0], ['S', 0, 52], ['W', -52, 0]].forEach(([c, x, y]) => {
      const t = sv('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, rose);
      t.textContent = c; t.style.fill = '#dbeaf5'; t.style.font = '13px Georgia, serif';
    });
    const needle = sv('g', { display: 'none' }, rose);
    sv('path', { d: 'M0,-34 L8,0 L-8,0 Z', fill: '#e03131' }, needle);
    sv('path', { d: 'M0,34 L8,0 L-8,0 Z', fill: 'var(--muted)' }, needle);
    const rn = sv('text', { x: 0, y: -24, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, needle);
    rn.textContent = 'N';
    rn.style.fill = '#fff';
    rn.style.font = '700 10px system-ui, sans-serif';
    if (spec.mode !== 'bearing') rng.bool(0.6);
    const readout = util.el('div', 'rot-readout', side);
    util.el('span', 'bearing-caption', readout, 'Bearing:');
    const readable = util.el('span', 'bearing-number', readout);
    const display = sv('svg', { width: 82, height: 30, viewBox: '0 0 82 30', 'aria-hidden': 'true' }, readout);
    const segments = ['M3 2H15','M17 4V12','M17 17V25','M3 27H15','M1 17V25','M1 4V12','M3 14H15'];
    const digits = [0,22,44].map(x => segments.map(d => sv('path', { d, transform: `translate(${x},0)`, fill: 'none', stroke: '#e6eef7', 'stroke-width': 2, 'stroke-linecap': 'square' }, display)));
    sv('circle', { cx: 73, cy: 6, r: 3.8, fill: 'none', stroke: '#e6eef7', 'stroke-width': 1.6 }, display);
    const digitCodes = ['1111110','0110000','1101101','1111001','0110011','1011011','1011111','1110000','1111111','1111011'];
    util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle on the ring to rotate the map.', 'Turn the map with the handle on its edge.']));

    function paint(a = ctx.model.angle) {
      turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
      const occupied = [];
      for (const l of labels) {
        l.setAttribute('transform', `rotate(${(-a).toFixed(3)})`);
        const rad = a / R2D, [x,y] = l.chartPoint;
        const px = x*Math.cos(rad)-y*Math.sin(rad), py = x*Math.sin(rad)+y*Math.cos(rad);
        const font = Math.max(12, Math.min(16,D/36));
        const width = l.chartLabel.textContent.length * font * .52;
        const options = [[13,-13],[-13,-13],[13,14],[-13,14],[13,-31],[-13,-31],[13,31],[-13,31]];
        let best, bestScore = Infinity;
        options.forEach(([dx,dy], i) => {
          const left = px+dx-(dx < 0 ? width : 0), top = py+dy-font/2;
          const box = [left,top,left+width,top+font];
          let score = i*.1;
          if ([box[0],box[2]].some(xx => [box[1],box[3]].some(yy => xx*xx+yy*yy > (Rmap-3)**2))) score += 1000;
          occupied.forEach(b => { if (box[0]<b[2]+4 && box[2]>b[0]-4 && box[1]<b[3]+3 && box[3]>b[1]-3) score += 100; });
          if (score < bestScore) { bestScore=score; best={dx,dy,box}; }
        });
        occupied.push(best.box);
        l.chartLabel.setAttribute('x', best.dx);
        l.chartLabel.setAttribute('y', best.dy);
        l.chartLabel.setAttribute('text-anchor', best.dx < 0 ? 'end' : 'start');
      }
      needle.setAttribute('transform', `rotate(${a.toFixed(3)})`);
      const value = String(Math.round(fam.helpers.mod360(-a)) % 360).padStart(3, '0');
      readable.textContent = `${value}°`;
      readout.setAttribute('aria-label', `Bearing: ${value} degrees`);
      digits.forEach((paths,i) => paths.forEach((path,n) => path.setAttribute('visibility', digitCodes[Number(value[i])][n] === '1' ? 'visible' : 'hidden')));
    }
    const rot = env.ui.rotateHandle(turn, handle, {
      label: 'map',
      pivot: () => centerOf(svg),
      radius: Rring,
      restAngle: hAngle,
      angle: ctx.model.angle,
      constrain: fam.helpers.mod360,
      place: (el, a) => paint(a),
      onInput(angle) { ctx.update({ angle }); },
    });
    paint();
    S.view = {
      card,
      anchors: [svg],
      sync(m) { rot.set(m.angle); paint(); },
      locate(t) {
        if (t.handle) return rot.locateHandle();
        if (t.handleAngle !== undefined) return rot.locate(t.handleAngle);
        return null;
      },
    };
  } } },
});
