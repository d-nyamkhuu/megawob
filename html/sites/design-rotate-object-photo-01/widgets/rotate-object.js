// Design on templates/rotate-object/base.js: the base site's rotate-object widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-photo-01',
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
        const C = Math.floor(Math.min(460, size.height - 70, size.width - 330));
        const half = C / 2;
        const sampledWidth = Math.round(C * rng.float(0.58, 0.64));
        const sampledHeight = Math.round(sampledWidth * rng.float(0.64, 0.7));
        const sampledRadius = Math.round(sampledHeight / 2 + rng.int(24, 32));
        // Rotation helpers use screen pixels. Keep the SVG at a 1:1 scale so
        // its visible handle follows the same circular path as the drag helper.
        const railHeight = size.height < 560 ? 130 : size.width <= 1100 ? 140 : 160;
        const canvasLeft = Math.round(size.width * 0.225);
        const canvasWidth = size.width - canvasLeft;
        const canvasHeight = size.height - railHeight;
        const photoRatio = sampledHeight / sampledWidth * (1.9 / 2.3);
        const stem = sampledRadius - sampledHeight / 2;
        const pw = Math.round(Math.min(canvasWidth * 0.94, (canvasHeight - 2 * stem - 30) / photoRatio));
        const ph = Math.round(pw * photoRatio);
        const Rh = ph / 2 + stem;

        const card = util.el('div', 'rot-card', ctx.stage);
        card.style.gap = '24px';
        card.style.padding = '18px 22px';
        const svg = sv('svg', { class: 'rot-svg rot-canvas', width: canvasWidth, height: canvasHeight, viewBox: `${-canvasWidth / 2} ${-canvasHeight / 2} ${canvasWidth} ${canvasHeight}` }, card);
        svg.style.cssText = `flex:0 0 auto;width:${canvasWidth}px;height:${canvasHeight}px;margin-left:${canvasLeft}px;border:0;border-radius:0;background:transparent`;
        svg.dataset.role = 'canvas';
        const defs = sv('defs', {}, svg);
        const cid = `rot-clip-${Math.floor(rng.next() * 1e9)}`;
        const clip = sv('clipPath', { id: cid }, defs);
        sv('rect', { x: -pw / 2, y: -ph / 2, width: pw, height: ph }, clip);

        const sel = sv('g', {}, svg);
        const photo = sv('g', { 'clip-path': `url(#${cid})` }, sel);
        const content = sv('g', { transform: `rotate(${spec.mode === 'level' ? spec.tilt : spec.base}) scale(${(Math.hypot(pw, ph) / 400 * 1.05).toFixed(4)})` }, photo);
        drawScene(content, spec.scene, rng);
        sv('image', { x: -200, y: -135, width: 400, height: 270, href: 'sites/design-rotate-object-photo-01/assets/alpine-lake-level.webp', preserveAspectRatio: 'xMidYMid slice' }, content);
        sv('rect', { x: -pw / 2, y: -ph / 2, width: pw, height: ph, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, sel);
        for (const [hx, hy] of [[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [-pw / 2, ph / 2], [pw / 2, ph / 2]]) sv('rect', { x: hx - 4, y: hy - 4, width: 8, height: 8, fill: '#dfe4e9', stroke: '#48515c', 'stroke-width': 1 }, sel);
        sv('line', { x1: 0, y1: -ph / 2, x2: 0, y2: -Rh + 9, stroke: 'var(--accent)', 'stroke-width': 1.5 }, sel);
        const handle = sv('circle', { class: 'rot-handle', cx: 0, cy: -Rh, r: 9, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': 2.5 }, sel);
        handle.dataset.role = 'handle';
        // Fixed thirds grid over the canvas (helps leveling; does not rotate).
        if (rng.bool(0.7)) {
          for (const f of [-1 / 6, 1 / 6]) {
            sv('line', { x1: -half, y1: f * C, x2: half, y2: f * C, stroke: 'rgba(255,255,255,.5)', 'stroke-width': 1, 'stroke-dasharray': '4 4', 'pointer-events': 'none' }, svg);
            sv('line', { x1: f * C, y1: -half, x2: f * C, y2: half, stroke: 'rgba(255,255,255,.5)', 'stroke-width': 1, 'stroke-dasharray': '4 4', 'pointer-events': 'none' }, svg);
          }
        }

        const side = util.el('div', 'rot-col', card);
        side.style.alignItems = 'stretch';
        side.style.width = '220px';
        util.el('div', 'rot-title', side, rng.pick(['Rotate & straighten', 'Transform', 'Adjust rotation', 'Crop & rotate']));
        let straight = null;
        let sTrack = null;
        if (spec.slider) {
          const box = util.el('div', '', side);
          util.el('div', 'rot-muted', box, rng.pick(['Straighten', 'Fine rotation', 'Angle']));
          const hit = util.el('div', 'rot-shit', box);
          hit.dataset.role = 'straighten';
          sTrack = util.el('div', 'rot-strack', hit);
          const zero = util.el('div', 'rot-szero', sTrack);
          zero.style.left = '50%';
          const thumb = util.el('div', 'rot-sthumb', sTrack);
          const ticks = util.el('div', 'rot-sticks', box);
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
        if (spec.buttons) {
          const row = util.el('div', 'rot-brow', side);
          for (const [k, txt, glyph] of [['ccw', 'Rotate left', '↺'], ['cw', 'Rotate right', '↻']]) {
            const b = util.el('button', 'rot-btn', row);
            b.type = 'button';
            b.title = txt;
            b.textContent = rng.bool(0.5) ? `${glyph} 90°` : `${glyph} ${txt}`;
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
        let field = null;
        if (spec.keys) field = angleField(ctx, readout, 'Angle', (a) => {
          const angle = fam.helpers.wrap180(a);
          rot.set(angle);
          ctx.update({ angle });
          paint();
        });
        util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle above the photo to rotate it freely.', 'Use the handle on the photo for any angle.']));

        function paint() {
          const a = ctx.model.angle;
          const txt = String(Number(a.toFixed(1)));
          if (field) field.paint(txt);
          else readout.textContent = `Angle: ${txt}°`;
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
