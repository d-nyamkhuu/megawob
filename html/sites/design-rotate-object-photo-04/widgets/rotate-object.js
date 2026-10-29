// Design on templates/rotate-object/base.js: the base site's rotate-object widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-photo-04',
  name: 'design',
  split: 'train',
  scenarios: ['photo'],
  template: 'rotate-object/base',
  design: {
    parts: {
      'renderPhoto': (base, S) => function renderPhoto(ctx) {
        const { F, angleField, centerOf, drawScene, env, sv } = S;
        const { util, rng, size, spec } = ctx;
        const fam = F();
        // SVG units are screen pixels, so the visible handle and rotateHandle's
        // radius stay in the same coordinate system at every stage size.
        const cardWidth = Math.floor(size.width);
        const cardHeight = Math.floor(size.height);
        const controlsHeight = spec.slider ? 174 : 108;
        const previewWidth = cardWidth - 34;
        const previewHeight = cardHeight - 24 - controlsHeight;
        const C = Math.min(previewWidth, previewHeight);
        const half = C / 2;
        const pw = Math.round(previewWidth * rng.float(0.86, 0.9) * 1.1);
        const aspect = rng.float(0.64, 0.7);
        const stem = rng.int(24, 32);
        const ph = Math.round(Math.min(pw * aspect, previewHeight - 2 * (stem + 13)));
        const Rh = ph / 2 + stem;

        const card = util.el('div', 'rot-card', ctx.stage);
        Object.assign(card.style, {
          boxSizing: 'border-box', display: 'grid',
          gridTemplateRows: `${previewHeight}px ${controlsHeight}px`,
          gridTemplateColumns: 'minmax(0, 1fr)', alignItems: 'stretch',
          width: `${cardWidth}px`, height: `${cardHeight}px`,
          gap: '0', padding: '12px 16px 10px',
        });
        const svg = sv('svg', { class: 'rot-svg rot-canvas', width: previewWidth, height: previewHeight, viewBox: `${-previewWidth / 2} ${-previewHeight / 2} ${previewWidth} ${previewHeight}` }, card);
        Object.assign(svg.style, { width: `${previewWidth}px`, height: `${previewHeight}px`, overflow: 'hidden', border: '0', borderRadius: '0' });
        svg.dataset.role = 'canvas';
        svg.style.background = '#f7f5f1';
        const defs = sv('defs', {}, svg);
        const cid = `rot-clip-${Math.floor(rng.next() * 1e9)}`;
        const clip = sv('clipPath', { id: cid }, defs);
        sv('rect', { x: -pw / 2, y: -ph / 2, width: pw, height: ph }, clip);

        const sel = sv('g', {}, svg);
        const photo = sv('g', { 'clip-path': `url(#${cid})` }, sel);
        const content = sv('g', { transform: `rotate(${spec.mode === 'level' ? spec.tilt : spec.base}) scale(${(Math.hypot(pw, ph) / 400 * 1.05).toFixed(4)})` }, photo);
        drawScene(content, spec.scene, rng);
        // Keep the seeded scene draw above (and its RNG sequence) while rendering this design's photo asset.
        sv('image', { x: -200, y: -200, width: 400, height: 400, href: 'sites/design-rotate-object-photo-04/assets/beach-sunset.webp', preserveAspectRatio: 'xMidYMid slice' }, content);
        sv('rect', { x: -pw / 2, y: -ph / 2, width: pw, height: ph, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, sel);
        sv('line', { x1: 0, y1: -ph / 2, x2: 0, y2: -Rh + 9, stroke: '#c6c1b9', 'stroke-width': 1.5 }, sel);
        const handle = sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 9, fill: '#fff', stroke: '#c6c1b9', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        // Fixed thirds grid over the canvas (helps leveling; does not rotate).
        if (rng.bool(0.7)) {
          for (const f of [-1 / 6, 1 / 6]) {
            sv('line', { x1: -half, y1: f * C, x2: half, y2: f * C, stroke: 'rgba(255,255,255,.5)', 'stroke-width': 1, 'stroke-dasharray': '4 4', 'pointer-events': 'none' }, svg);
            sv('line', { x1: f * C, y1: -half, x2: f * C, y2: half, stroke: 'rgba(255,255,255,.5)', 'stroke-width': 1, 'stroke-dasharray': '4 4', 'pointer-events': 'none' }, svg);
          }
        }

        const side = util.el('div', 'rot-col', card);
        Object.assign(side.style, {
          boxSizing: 'border-box', width: '100%', minWidth: '0',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: spec.slider ? '40px 66px 52px' : '40px 52px',
          alignItems: 'center', gap: '4px', padding: '8px 7% 0',
        });
        const title = util.el('div', 'rot-title', side, rng.pick(['Rotate & straighten', 'Transform', 'Adjust rotation', 'Crop & rotate']));
        title.hidden = true;
        let straight = null;
        let sTrack = null;
        if (spec.slider) {
          const box = util.el('div', 'photo-straighten', side);
          box.style.gridRow = '2';
          const label = util.el('div', 'rot-muted', box, rng.pick(['Straighten', 'Fine rotation', 'Angle']));
          Object.assign(label.style, { maxWidth: 'none', textAlign: 'left' });
          const hit = util.el('div', 'rot-shit', box);
          hit.style.padding = '8px 0';
          hit.dataset.role = 'straighten';
          sTrack = util.el('div', 'rot-strack', hit);
          const zero = util.el('div', 'rot-szero', sTrack);
          zero.style.left = '50%';
          const thumb = util.el('div', 'rot-sthumb', sTrack);
          Object.assign(thumb.style, { width: '15px', height: '25px', top: '50%', marginTop: '-12px' });
          const ticks = util.el('div', 'rot-sticks', box);
          ticks.style.fontSize = '15px';
          for (const t of ['-45°', '0°', '45°']) util.el('span', '', ticks, t);
          straight = env.ui.slider(hit, {
            label: 'straighten',
            thumbs: [thumb],
            values: [Math.max(-45, Math.min(45, ctx.model.angle))],
            min: -45,
            max: 45,
            keyboard: !!spec.keys,
            geometry() {
              const r = sTrack.getBoundingClientRect();
              return { start: [r.left, r.top + r.height / 2], end: [r.right - 1, r.top + r.height / 2] };
            },
            place: (el, point, f) => { el.style.left = f * (sTrack.getBoundingClientRect().width - 1) + 'px'; },
            onInput([v]) {
              ctx.update({ angle: v });
              rot.set(v);
              paint();
            },
          });
        }
        const btns = {};
        {
          const row = util.el('div', 'rot-brow', side);
          Object.assign(row.style, { gridRow: spec.slider ? '3' : '2', justifyContent: 'center', gap: '12px', minWidth: '0' });
          for (const [k, txt, glyph] of [['ccw', 'Rotate left', '↺'], ['cw', 'Rotate right', '↻']]) {
            const b = util.el('button', 'rot-btn', row);
            b.type = 'button';
            Object.assign(b.style, { flex: '0 1 230px', minWidth: '0', height: '48px', padding: '6px 8px', fontSize: cardWidth < 600 ? '14px' : '17px' });
            b.title = txt;
            b.textContent = spec.buttons ? (rng.bool(0.5) ? `${glyph} 90°` : `${glyph} ${txt}`) : `${glyph} ${txt} 90°`;
            b.addEventListener('click', () => {
              const angle = fam.helpers.wrap180(ctx.model.angle + (k === 'cw' ? 90 : -90));
              ctx.log('rotate90', { dir: k });
              rot.set(angle);
              ctx.update({ angle });
              paint();
            });
            btns[k] = b;
          }
        }
        const readout = util.el('div', 'rot-readout', side);
        Object.assign(readout.style, { gridRow: '1', justifySelf: 'center', minWidth: '90px', padding: '7px 12px', boxSizing: 'border-box' });
        let field = null;
        if (spec.keys) field = angleField(ctx, readout, 'Angle', (a) => {
          const angle = fam.helpers.wrap180(a);
          rot.set(angle);
          ctx.update({ angle });
          paint();
        });
        const hint = util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle above the photo to rotate it freely.', 'Use the handle on the photo for any angle.']));
        hint.hidden = true;

        function paint() {
          const a = ctx.model.angle;
          const txt = String(Number(a.toFixed(1)));
          if (field) field.paint(txt);
          else readout.textContent = `${txt}°`;
          if (straight) straight.set([Math.max(-45, Math.min(45, a))]);
        }

        const rot = env.ui.rotateHandle(sel, handle, {
          label: 'handle',
          pivot: () => centerOf(svg),
          radius: Rh,
          angle: ctx.model.angle,
          constrain: fam.helpers.wrap180,
          place: (el, a) => el.setAttribute('transform', `rotate(${a.toFixed(3)})`),
          onInput(angle) {
            ctx.update({ angle });
            paint();
          },
        });
        paint();
        const anchors = [svg];
        if (sTrack) anchors.push(sTrack);
        S.view = {
          card,
          anchors,
          sync(m) {
            rot.set(m.angle);
            paint();
          },
          locate(t) {
            if (t.handle) return rot.locateHandle();
            if (t.handleAngle !== undefined) return rot.locate(t.handleAngle);
            if (t.straighten === 'thumb') return straight.locateThumb(0);
            if (t.straighten !== undefined) return straight.locate(t.straighten);
            if (t.button) return util.center(btns[t.button]);
            if (t.field && field) return field.locate();
            return null;
          },
        };
      },
    },
  },
});
