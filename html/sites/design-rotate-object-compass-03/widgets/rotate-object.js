// Design on templates/rotate-object/base.js: the base site's rotate-object widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-compass-03',
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
        // Match the drawn SVG and the rotation helper's radius in screen pixels.
        const compact = size.width < 780;
        const mapSize = Math.min(size.height * (compact ? 66 / 80.25 : 78 / 80.25), size.width * (compact ? 64 / 71 : 61 / 69.5));

        const card = util.el('div', 'rot-card', ctx.stage);
        Object.assign(card.style, { position: 'relative', display: 'block', width: `${size.width}px`, height: `${size.height}px`, padding: '0', overflow: 'hidden' });
        const svg = sv('svg', { class: 'rot-svg', width: mapSize, height: mapSize, viewBox: `${-half} ${-half} ${D} ${D}` }, card);
        Object.assign(svg.style, { position: 'absolute', right: '8%', top: `${(size.height - mapSize) / 2}px` });
        svg.dataset.role = 'map';
        const defs = sv('defs', {}, svg);
        const cid = `rot-map-${Math.floor(rng.next() * 1e9)}`;
        sv('circle', { r: Rmap }, sv('clipPath', { id: cid }, defs));

        // Bezel ring (the drag target is the handle on it).
        sv('circle', { r: Rring, fill: 'none', stroke: '#b9b9b6', 'stroke-width': 8 }, svg);
        const turn = sv('g', {}, svg);
        const mapG = sv('g', { 'clip-path': `url(#${cid})` }, turn);
        const land = rng.pick(['#bad49e', '#c1d9a9', '#b8d3a0']);
        sv('rect', { x: -half, y: -half, width: D, height: D, fill: land }, mapG);
        for (let k = 0; k < 3; k++) sv('circle', { cx: rng.int(-Rmap, Rmap), cy: rng.int(-Rmap, Rmap), r: rng.int(30, 70), fill: '#cfe3c1' }, mapG);
        const ry = rng.int(-Rmap / 2, Rmap / 2);
        sv('path', { d: `M${-half},${ry} C${-half / 3},${ry - rng.int(-80, 80)} ${half / 3},${ry + rng.int(-80, 80)} ${half},${ry + rng.int(-40, 40)}`, fill: 'none', stroke: '#35b5e8', 'stroke-width': 7 }, mapG);
        sv('path', { d: `M${-half*.72},${half*.42} C${-half*.35},${half*.2} ${-half*.15},${half*.6} ${-half*.02},${half*.18} S${half*.42},${-half*.18} ${half*.82},${-half*.58}`, fill: 'none', stroke: '#35b5e8', 'stroke-width': 4 }, mapG);
        for (let k = 0; k < 6; k++) {
          const a = rng.float(0, Math.PI);
          const o = rng.int(-Rmap, Rmap);
          const [dx, dy] = [Math.cos(a), Math.sin(a)];
          sv('line', { x1: o * -dy - dx * D, y1: o * dx - dy * D, x2: o * -dy + dx * D, y2: o * dx + dy * D, stroke: '#b7aa8f', 'stroke-width': k < 2 ? 2 : 1, opacity: .75 }, mapG);
        }
        for (let k = 0; k < 18; k++) {
          const rr = Rmap * (.18 + k * .043), phase = k * .61;
          let d = '';
          for (let j = 0; j <= 64; j++) {
            const a = j * Math.PI * 2 / 64, wobble = 1 + .035 * Math.sin(5*a + phase) + .018 * Math.cos(9*a - phase);
            const x = rr * wobble * Math.cos(a) + .12*rr*Math.sin(phase), y = rr * wobble * Math.sin(a);
            d += `${j ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
          }
          sv('path', { d: d + 'Z', fill: 'none', stroke: k % 3 ? '#a8bb82' : '#d2bd91', 'stroke-width': 1, opacity: .72 }, mapG);
        }
        const labels = [];
        const pinColors = ['#ed2024','#1248db','#10a53b','#ffdf00','#7c20d8'];
        for (const [placeIndex,p] of spec.places.entries()) {
          const r = p.dist * (Rmap - 20);
          const [x, y] = [r * Math.sin(p.bearing / R2D), -r * Math.cos(p.bearing / R2D)];
          const pin = sv('g', { transform: `translate(${x.toFixed(1)},${y.toFixed(1)})` }, mapG);
          const inner = sv('g', {}, pin);
          sv('circle', { cx:0, cy:-7, r:7, fill:pinColors[placeIndex % pinColors.length], stroke:'#111', 'stroke-width':1.5 }, inner);
          const labelRight = x <= 0;
          const t = sv('text', { x: labelRight ? 13 : -13, y: -7, 'text-anchor': labelRight ? 'start' : 'end', 'dominant-baseline': 'central' }, inner);
          t.textContent = p.name;
          t.style.font = '600 12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
          t.style.paintOrder = 'stroke';
          t.style.fill = '#2b2f36';
          t.style.stroke = '#f5f2dc';
          t.style.strokeWidth = '3px';
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
        const handle = sv('circle', { class: 'rot-handle', cx: hp[0], cy: hp[1], r: 10, fill: 'var(--accent)', stroke: '#fff', 'stroke-width': 2.5 }, turn);
        if (hAngle === 0) turn.append(nm); // the N marker sits on the handle (it ignores the pointer)
        handle.dataset.role = 'handle';
        sv('circle', { r: Rring + 8, fill: 'none', stroke: '#555', 'stroke-width': 1.2 }, svg);
        for (let deg = 0; deg < 360; deg += 3) {
          const major = deg % 30 === 0, medium = deg % 10 === 0;
          const p1 = polar([0,0], Rring + (major ? 1 : medium ? 5 : 9), deg);
          const p2 = polar([0,0], Rring + 15, deg);
          sv('line', { x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],stroke:major?'#222':'#555','stroke-width':major?2:1 }, svg);
          if (major) {
            const [tx,ty] = polar([0,0], Rring + 27, deg);
            const label = sv('text', { x:tx,y:ty,'text-anchor':'middle','dominant-baseline':'central' }, svg);
            label.textContent = String(deg); label.style.font = '600 14px Tahoma, Arial, sans-serif'; label.style.fill = '#111';
          }
        }
        // Fixed center marker and a fixed "up" tick at the top of the bezel.
        sv('circle', { r: 7, fill: '#1c7ed6', stroke: '#fff', 'stroke-width': 3 }, svg);
        sv('path', { d: `M0,${-half + 1} l-6,0 l6,9 l6,-9 z`, fill: 'var(--fg)', opacity: 0.7, 'pointer-events': 'none' }, svg);

        const side = util.el('div', 'rot-col', card);
        side.style.display = 'contents';
        const title = util.el('div', 'rot-title', side, rng.pick(['Map', 'Orientation', 'Navigator', 'Map view']));
        title.hidden = true;
        const roseSize = Math.min(size.height * (compact ? 12 / 80.25 : 14 / 80.25), size.width * 9 / 69.5);
        const rose = sv('svg', { width: roseSize, height: roseSize, viewBox: '-60 -60 120 120', class: 'rot-svg' }, side);
        Object.assign(rose.style, { position: 'absolute', left: compact ? '3%' : '6%', top: '44%' });
        sv('circle', { r: 55, fill: '#c5c5c2', stroke: '#555', 'stroke-width': 2 }, rose);
        sv('path', { d:'M0,-56 L9,-9 L0,0 L-9,-9 Z M0,56 L-9,9 L0,0 L9,9 Z M-56,0 L-9,-9 L0,0 L-9,9 Z M56,0 L9,9 L0,0 L9,-9 Z', fill:'#111', stroke:'#111','stroke-width':1 }, rose);
        sv('path', { d:'M0,-47 L5,-5 L0,0 L-5,-5 Z M0,47 L-5,5 L0,0 L5,5 Z M-47,0 L-5,-5 L0,0 L-5,5 Z M47,0 L5,5 L0,0 L5,-5 Z', fill:'#eee', stroke:'#444','stroke-width':1 }, rose);
        const needle = sv('g', {}, rose);
        sv('path', { d: 'M0,-34 L8,0 L-8,0 Z', fill: '#e03131' }, needle);
        sv('path', { d: 'M0,34 L8,0 L-8,0 Z', fill: 'var(--muted)' }, needle);
        const rn = sv('text', { x: 0, y: -24, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, needle);
        rn.textContent = 'N';
        rn.style.fill = '#111';
        rn.style.font = '700 13px Tahoma, sans-serif';
        for (const [letter,x,y] of [['W',-54,4],['E',54,4],['S',0,58]]) {
          const cardinal=sv('text',{x,y,'text-anchor':'middle','dominant-baseline':'central'},rose);
          cardinal.textContent=letter;cardinal.style.font='700 13px Georgia,serif';cardinal.style.fill='#111';
        }
        // Always shown (the task's facts() reports it); the draw stays so later layout draws are as before.
        if (spec.mode !== 'bearing') rng.bool(0.6);
        const readout = util.el('div', 'rot-readout', side);
        Object.assign(readout.style, { position: 'absolute', left: '3%', top: '4%', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '245px', padding: '5px 10px' });
        util.el('span','bearing-label',readout,'Bearing:');
        const bearingValue=util.el('span','bearing-value',readout,'');
        const hint = util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle on the ring to rotate the map.', 'Turn the map with the handle on its edge.']));
        hint.hidden = true;

        function paint(a = ctx.model.angle) {
          turn.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          for (const l of labels) l.setAttribute('transform', `rotate(${(-a).toFixed(3)})`);
          needle.setAttribute('transform', `rotate(${a.toFixed(3)})`);
          if (bearingValue) bearingValue.textContent = `${Math.round(fam.helpers.mod360(-a)) % 360}°`;
        }
        const rot = env.ui.rotateHandle(turn, handle, {
          label: 'map',
          pivot: () => centerOf(svg),
          radius: Rring * mapSize / D,
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
