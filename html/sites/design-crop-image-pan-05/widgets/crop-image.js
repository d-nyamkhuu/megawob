// Design on templates/crop-image/base.js with the organizer's fitted image window.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-pan-05',
  name: 'design',
  split: 'train',
  scenarios: ['pan'],
  template: 'crop-image/base',
  design: {
    parts: {
      'paintScene': (base, S) => function (g, spec, fam, rng, W, H) {
        base(g, spec, fam, rng, W, H);
        const pixels = g.getImageData(0, 0, W, H);
        const p = pixels.data;
        const mask = new Uint8Array(W * H);
        for (let i = 0; i < mask.length; i++) {
          const k = i * 4, hi = Math.max(p[k], p[k + 1], p[k + 2]), lo = Math.min(p[k], p[k + 1], p[k + 2]);
          mask[i] = (hi - lo > 70 && lo < 175) || hi < 65 ? 1 : 0;
        }
        const edge = Math.max(1, Math.round(Math.min(W, H) / 350));
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const i = y * W + x, k = i * 4;
          let hash = Math.imul(x + 17, 374761393) ^ Math.imul(y + 31, 668265263);
          hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
          const grain = ((hash ^ (hash >>> 16)) >>> 24) / 8 - 16;
          if (!mask[i]) {
            const mottling = 3 * Math.sin(x / 37 + Math.sin(y / 29)) + 2 * Math.cos(y / 19 + x / 71);
            p[k] = 247 + grain * .23 + mottling; p[k + 1] = 240 + grain * .25 + mottling; p[k + 2] = 219 + grain * .32 + mottling;
          } else {
            const outline = x >= edge && x < W - edge && y >= edge && y < H - edge && (!mask[i - edge] || !mask[i + edge] || !mask[i - W * edge] || !mask[i + W * edge]);
            if (outline) { p[k] = 41 + grain * .2; p[k + 1] = 42 + grain * .2; p[k + 2] = 35 + grain * .2; }
            else { p[k] += grain * .65; p[k + 1] += grain * .65; p[k + 2] += grain * .65; }
          }
        }
        g.putImageData(pixels, 0, 0);
      },
      'boxPanNav': (base, S) => function (ctx, spec, util, row, view, canvas, VH, panTo) {
        const nav = base(ctx, spec, util, row, view, canvas, VH, panTo);
        const side = row.querySelector('.cr-side');
        const controls = util.el('div', 'library-controls', side);
        util.el('h4', '', controls, 'Zoom');
        const zoom = util.el('div', 'library-zoom', controls);
        const minus = util.el('button', '', zoom, '−');
        const value = util.el('span', '', zoom, '100%');
        const plus = util.el('button', '', zoom, '+');
        let factor = 1;
        let initialW = 0, initialH = 0;
        const scale = (d) => {
          if (!initialW) { initialW = S.W; initialH = S.H; }
          factor = Math.max(.75, Math.min(2, factor + d));
          S.W = Math.round(initialW * factor); S.H = Math.round(initialH * factor);
          Object.assign(S.frame.style, { width: S.W + 'px', height: S.H + 'px' });
          Object.assign(canvas.style, { width: S.W + 'px', height: S.H + 'px' });
          S.crop.set(ctx.model); value.textContent = Math.round(factor * 100) + '%';
          ctx.update({ ...ctx.model, px: { W: S.W, H: S.H }, pan: panTo(ctx.model.pan.x, ctx.model.pan.y) });
        };
        minus.onclick = () => scale(-.25); plus.onclick = () => scale(.25);
        util.el('h4', '', controls, 'Pan');
        const pad = util.el('div', 'library-pan', controls);
        for (const [label, cls, dx, dy] of [['▲', 'up', 0, -1], ['◀', 'left', -1, 0], ['▶', 'right', 1, 0], ['▼', 'down', 0, 1]]) {
          const b = util.el('button', cls, pad, label);
          b.setAttribute('aria-label', 'Pan ' + cls);
          b.onclick = () => ctx.update({ ...ctx.model, pan: panTo(ctx.model.pan.x + dx * spec.view.w * .2, ctx.model.pan.y + dy * spec.view.h * .2) });
        }
        return nav;
      },
      'placeIn@0': (base, S) => function (ctx, wrap, rng, pad) {
        const headerNote = ctx.stage.parentElement.querySelector('.task-note:not([hidden]):not(.instruction-toast)');
        if (headerNote) ctx.stage.style.top = headerNote.offsetTop + headerNote.offsetHeight + 8 + 'px';
        base(ctx, wrap, rng, pad);
        if (S.applyBtn) wrap.classList.add('has-apply');
        // The organizer's window fills its paper frame. Keep the image and
        // crop coordinates at the matching zoom before the template anchors it.
        const view = S.frame.parentElement;
        const maxWidth = Math.floor((ctx.size.width - 36) * 0.7);
        const maxHeight = Math.floor((ctx.size.height - 40) * 0.94);
        const borderWidth = view.offsetWidth - view.clientWidth;
        const borderHeight = view.offsetHeight - view.clientHeight;
        const scale = Math.min((maxWidth - borderWidth) / view.clientWidth,
          (maxHeight - borderHeight) / view.clientHeight);
        Object.assign(view.style, {
          width: Math.round(view.clientWidth * scale) + borderWidth + 'px',
          height: Math.round(view.clientHeight * scale) + borderHeight + 'px',
        });
        S.W = Math.round(view.clientWidth / ctx.spec.view.w);
        S.H = Math.round(view.clientHeight / ctx.spec.view.h);
        Object.assign(S.frame.style, { width: S.W + 'px', height: S.H + 'px' });
        const canvas = S.frame.querySelector('canvas');
        Object.assign(canvas.style, { width: S.W + 'px', height: S.H + 'px' });
        S.crop.set(ctx.model);
        if (S.applyBtn) {
          const side = view.parentElement.querySelector('.cr-side');
          const toolbar = S.applyBtn.parentElement;
          side.classList.add('has-apply');
          toolbar.classList.add('library-apply');
          wrap.append(toolbar);
          Object.assign(toolbar.style, { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' });
        }
      },
    },
  },
});
