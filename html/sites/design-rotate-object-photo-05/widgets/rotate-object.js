// Newspaper photo editor, using the base template's model and seeded draws.
const assetScript = document.currentScript.src;
env.widget({
  task: 'rotate-object',
  site: 'design-rotate-object-photo-05',
  name: 'design',
  split: 'train',
  scenarios: ['photo'],
  template: 'rotate-object/base',
  design: { parts: {
    renderPhoto: (base, S) => (ctx) => {
      // Run the template first, including its original placement, so its seeded
      // art, labels, affordances and placement consume exactly the same draws.
      base(ctx);
      const original = S.view;
      S.placeCard(original.card, ctx);
      const { util, spec } = ctx;
      const card = original.card;
      card.replaceChildren();
      card.classList.add('chronicle-photo');
      card.style.cssText = '';
      const left = util.el('div', 'photo-column', card);
      const bounds = ctx.stage.getBoundingClientRect();
      const W = Math.round(bounds.width * .48);
      const H = Math.round(bounds.height);
      const svg = S.sv('svg', { class: 'photo-editor', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, left);
      svg.dataset.role = 'canvas';
      const top = Math.min(47, H * .095), pad = 6;
      const fh = H - top - 8, fw = W - 4;
      const pivot = [W / 2, top + fh / 2];
      const radius = fh / 2 + top * .60;
      const defs = S.sv('defs', {}, svg);
      const clip = S.sv('clipPath', { id: 'chronicle-photo-window' }, defs);
      S.sv('rect', { x: 2 + pad, y: top + pad, width: fw - pad * 2, height: fh - pad * 2 }, clip);
      S.sv('rect', { x: 2, y: top, width: fw, height: fh, rx: 4, fill: '#fffefa', stroke: '#cec8bd', 'stroke-width': 1.2 }, svg);
      const windowG = S.sv('g', { 'clip-path': 'url(#chronicle-photo-window)' }, svg);
      const imageG = S.sv('g', {}, windowG);
      const d = Math.hypot(fw, fh) * 1.02;
      const image = S.sv('image', { x: pivot[0] - d * .59 - fw * .04, y: pivot[1] - d / 2 + fh * .07, width: d * 1.18, height: d, preserveAspectRatio: 'none' }, imageG);
      // The script URL is captured below; updates never depend on document.currentScript.
      image.setAttribute('href', new URL('assets/lighthouse-wide.png', new URL('../', assetScript)).href);
      const arm = S.sv('g', {}, svg);
      S.sv('line', { x1: pivot[0], y1: top + 2, x2: pivot[0], y2: pivot[1] - radius, stroke: '#252525', 'stroke-width': 1.5 }, arm);
      const handle = S.sv('circle', { class: 'photo-handle', cx: pivot[0], cy: pivot[1] - radius, r: Math.min(22, W * .04), fill: '#fff', stroke: '#333', 'stroke-width': 1.2 }, arm);
      handle.dataset.role = 'handle';
      const glyph = S.sv('text', { x: pivot[0], y: pivot[1] - radius + 1, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': Math.min(32, W * .06), 'font-family': 'Arial', fill: '#111', 'pointer-events': 'none' }, arm);
      glyph.textContent = '⟳';
      const side = util.el('div', 'photo-controls', card);
      util.el('div', 'straighten-title', side, 'Straighten');
      const box = util.el('div', 'straighten-box', side);
      const hit = util.el('div', 'straighten-hit', box);
      hit.dataset.role = 'straighten';
      const track = util.el('div', 'straighten-track', hit);
      const thumb = util.el('div', 'straighten-thumb', track);
      let straight = null;
      const fam = env.taskDef;
      const set = (angle) => {
        const a = fam.helpers.wrap180(angle);
        ctx.update({ angle: a });
        original.sync(ctx.model);
        rot.set(a);
        paint();
      };
      const readout = util.el('div', 'photo-angle', side);
      let field = null;
      if (spec.keys) {
        field = S.angleField(ctx, readout, 'Angle', set);
        readout.querySelector('input').classList.add('photo-angle-input');
      }
      const row = util.el('div', 'photo-buttons', side);
      const buttons = {};
      for (const [key, label, icon, delta] of [['ccw', 'Rotate Left', '↶', -90], ['cw', 'Rotate Right', '↷', 90]]) {
        const button = util.el('button', 'photo-turn', row);
        button.type = 'button'; button.title = label;
        util.el('span', 'turn-icon', button, key === 'ccw' ? '⟲' : '⟳');
        const text = util.el('span', '', button, label);
        util.el('span', 'turn-degrees', text, '90°');
        button.disabled = !spec.buttons;
        button.onclick = () => { ctx.log('rotate90', { dir: key }); set(ctx.model.angle + delta); };
        buttons[key] = button;
      }
      const rot = env.ui.rotateHandle(arm, handle, {
        label: 'handle', pivot: () => {
          const r = svg.getBoundingClientRect();
          return [r.left + pivot[0], r.top + pivot[1]];
        }, radius, angle: ctx.model.angle, constrain: fam.helpers.wrap180,
        place: (el, a) => el.setAttribute('transform', `rotate(${a} ${pivot[0]} ${pivot[1]})`),
        onInput(angle) { ctx.update({ angle }); original.sync(ctx.model); paint(); },
      });
      if (spec.slider) straight = env.ui.slider(hit, {
        label: 'straighten', thumbs: [thumb], values: [Math.max(-45, Math.min(45, ctx.model.angle))],
        min: -45, max: 45, keyboard: !!spec.keys,
        geometry() { const r = track.getBoundingClientRect(); return { start: [r.left, r.top + r.height / 2], end: [r.right - 1, r.top + r.height / 2] }; },
        place: (el, point, f) => { el.style.left = f * (track.getBoundingClientRect().width - 1) + 'px'; },
        onInput([v]) { set(v); },
      });
      function paint() {
        const a = ctx.model.angle;
        const contentAngle = a + (spec.mode === 'level' ? spec.tilt : spec.base);
        imageG.setAttribute('transform', `rotate(${contentAngle} ${pivot[0]} ${pivot[1]})`);
        const txt = String(Number(a.toFixed(1)));
        if (field) field.paint(txt); else readout.textContent = `${txt}°`;
        if (straight) straight.set([Math.max(-45, Math.min(45, a))]);
        else thumb.style.left = `${(Math.max(-45, Math.min(45, a)) + 45) / 90 * 100}%`;
      }
      paint();
      const anchors = [svg];
      if (spec.slider) anchors.push(track);
      S.view = {
        card, anchors,
        sync(m) { original.sync(m); rot.set(m.angle); paint(); },
        locate(t) {
          if (t.handle) return rot.locateHandle();
          if (t.handleAngle !== undefined) return rot.locate(t.handleAngle);
          if (t.straighten === 'thumb') return straight.locateThumb(0);
          if (t.straighten !== undefined) return straight.locate(t.straighten);
          if (t.button) return util.center(buttons[t.button]);
          if (t.field && field) return field.locate();
          return null;
        },
      };
      card.dataset.placed = 'true';
    },
    'placeCard@0': (base) => (card, ctx) => {
      if (!card.dataset.placed) base(card, ctx);
    },
  } },
});
