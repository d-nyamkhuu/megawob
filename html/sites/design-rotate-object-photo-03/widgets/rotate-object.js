// Design on templates/rotate-object/base.js: the base site's rotate-object widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-photo-03',
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
        const W = Math.floor(size.width);
        const H = Math.floor(size.height);
        const topHeight = 46;
        const bottomHeight = spec.slider ? 70 : 0;
        const C = Math.max(40, H - topHeight - bottomHeight);
        const half = C / 2;
        const pw = Math.round((W - 24) * rng.float(0.58, 0.64) / 0.64);
        const ph = Math.round((C - 60) * rng.float(0.64, 0.7) / 0.7);
        const Rh = Math.round(ph / 2 + rng.int(24, 32) - 17);

        const card = util.el('div', 'rot-card', ctx.stage);
        Object.assign(card.style, { width: W + 'px', height: H + 'px', display: 'block', padding: '0', border: '0', borderRadius: '0', background: 'transparent', boxShadow: 'none' });
        const svg = sv('svg', { class: 'rot-svg rot-canvas', width: W, height: C, viewBox: `${-W / 2} ${-half} ${W} ${C}` }, card);
        svg.dataset.role = 'canvas';
        Object.assign(svg.style, { position: 'absolute', left: '0', top: topHeight + 'px', border: '0', borderRadius: '0', background: 'transparent', overflow: 'hidden' });
        const defs = sv('defs', {}, svg);
        const cid = `rot-clip-${Math.floor(rng.next() * 1e9)}`;
        const clip = sv('clipPath', { id: cid }, defs);
        sv('rect', { x: -pw / 2, y: -ph / 2, width: pw, height: ph }, clip);

        const sel = sv('g', {}, svg);
        const photo = sv('g', { 'clip-path': `url(#${cid})` }, sel);
        const content = sv('g', { transform: `rotate(${spec.mode === 'level' ? spec.tilt : spec.base}) scale(${(Math.hypot(pw, ph) / 400 * 1.05).toFixed(4)})` }, photo);
        drawScene(content, spec.scene, rng);
        sv('rect', { x: -pw / 2, y: -ph / 2, width: pw, height: ph, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, sel);
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
        side.style.display = 'contents';
        util.el('div', 'rot-title', side, rng.pick(['Rotate & straighten', 'Transform', 'Adjust rotation', 'Crop & rotate'])).hidden = true;
        const toolbar = util.el('div', 'photo-toolbar', side);
        Object.assign(toolbar.style, { position: 'absolute', top: '0', left: '0', width: W + 'px', height: topHeight + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' });
        let straight = null;
        let sTrack = null;
        if (spec.slider) {
          const box = util.el('div', '', side);
          Object.assign(box.style, { position: 'absolute', left: '18%', right: '3%', bottom: '8px', height: '54px' });
          const label = util.el('div', 'rot-muted', box, rng.pick(['Straighten', 'Fine rotation', 'Angle']));
          label.textContent = 'Straighten:';
          Object.assign(label.style, { position: 'absolute', right: 'calc(100% + 12px)', top: '10px', color: '#111', fontSize: 'inherit', whiteSpace: 'nowrap' });
          const hit = util.el('div', 'rot-shit', box);
          hit.style.padding = '10px 0';
          hit.dataset.role = 'straighten';
          sTrack = util.el('div', 'rot-strack', hit);
          Object.assign(sTrack.style, { height: '16px', borderRadius: '0' });
          const zero = util.el('div', 'rot-szero', sTrack);
          zero.style.left = '50%';
          const thumb = util.el('div', 'rot-sthumb', sTrack);
          Object.assign(thumb.style, { width: '22px', height: '30px', top: '7px', margin: '-15px 0 0 -11px', borderRadius: '2px' });
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
          const row = util.el('div', 'rot-brow', toolbar);
          for (const [k, txt, glyph] of [['ccw', 'Rotate left', '↺'], ['cw', 'Rotate right', '↻']]) {
            const b = util.el('button', 'rot-btn', row);
            b.type = 'button';
            Object.assign(b.style, { borderRadius: '2px', padding: '3px 10px', fontSize: 'clamp(15px,1.35vw,23px)' });
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
        const readout = util.el('div', 'rot-readout', toolbar);
        Object.assign(readout.style, { order: '-1', minWidth: '105px', padding: '2px 9px', borderRadius: '0' });
        let field = null;
        if (spec.keys) field = angleField(ctx, readout, 'Angle', (a) => {
          const angle = fam.helpers.wrap180(a);
          rot.set(angle);
          ctx.update({ angle });
          paint();
        });
        util.el('div', 'rot-muted', side, rng.pick(['Drag the round handle above the photo to rotate it freely.', 'Use the handle on the photo for any angle.'])).hidden = true;

        function paint() {
          const a = ctx.model.angle;
          const txt = String(Number(a.toFixed(1)));
          if (field) field.paint(txt);
          else readout.textContent = `Rotation: ${txt}°`;
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
