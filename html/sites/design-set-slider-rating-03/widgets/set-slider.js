// Design on templates/set-slider/base.js: the base site's set-slider widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-rating-03',
  name: 'design',
  split: 'train',
  scenarios: ['rating'],
  template: 'set-slider/base',
  design: {
    parts: {
      'renderRating': (base, S) => function renderRating(ctx, look) {
        const { STAR_PATH, placeIn } = S;
        const { spec, util, size, rng } = ctx;
        const { n, half } = spec.stars;
        const big = spec.level === 'easy' ? 8 : spec.level === 'medium' ? 4 : 0;
        const gap = 14;
        const room = Math.floor(size.width) - 120 - 150 - 100;
        const px = Math.max(24, Math.min(n > 5 ? 42 : 64, Math.floor(room / n) - gap, 64 + big));
        const card = util.el('div', 'slr-card', ctx.stage);
        util.el('div', 'slr-title', card, spec.scene.title);
        util.el('div', 'slr-item', card, spec.scene.item);
        const out = spec.sliders.map((s, i) => {
          const row = util.el('div', 'slr-row', card);
          util.el('div', 'slr-label', row, s.label);
          const box = util.el('div', 'slr-stars', row);
          box.dataset.role = 'track';
          box.setAttribute('role', 'slider');
          box.setAttribute('aria-label', s.label);
          box.style.gap = gap + 'px';
          const cells = Array.from({ length: n }, () => {
            const c = util.el('div', 'slr-star', box);
            c.style.width = c.style.height = px + 'px';
            c.style.setProperty('--rating-star-size', px + 'px');
            c.innerHTML = `<svg class="bg" viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg><div class="fg"><svg viewBox="0 0 24 24" style="width:${px}px"><path d="${STAR_PATH}"/></svg></div>`;
            return c;
          });
          const readout = util.el('div', 'slr-value', row);
          const unit = half ? 0.5 : 1;
          const paint = (v) => {
            cells.forEach((c, k) => {
              const f = Math.max(0, Math.min(1, v - k));
              c.querySelector('.fg').style.width = f * px + 'px';
            });
            readout.textContent = `${v} / ${n}`;
            box.setAttribute('aria-valuenow', String(v));
          };
          // x within the star row -> value (left half of a star: the half value when half stars are on)
          const valueAtX = (x) => {
            const k = Math.floor(x / (px + gap));
            const inStar = Math.max(0, Math.min(px, x - k * (px + gap)));
            const v = k + (half ? (inStar < px / 2 ? 0.5 : 1) : 1);
            return Math.max(unit, Math.min(n, v));
          };
          let down = false;
          const set = (e) => {
            const r = box.getBoundingClientRect();
            const v = valueAtX(e.clientX - r.left);
            if (v === ctx.model.values[i][0]) return;
            const all = ctx.model.values.map((x) => x.slice());
            all[i] = [v];
            paint(v);
            ctx.update({ ...ctx.model, values: all });
          };
          box.addEventListener('pointerdown', (e) => { down = true; try { box.setPointerCapture(e.pointerId); } catch (_) { /* synthetic */ } set(e); });
          box.addEventListener('pointermove', (e) => { if (down) set(e); });
          const up = () => { down = false; };
          box.addEventListener('pointerup', up);
          box.addEventListener('pointercancel', up);
          paint(ctx.model.values[i][0]);
          const at = (v) => {
            const r = box.getBoundingClientRect();
            const k = Math.max(0, Math.ceil(v) - 1);
            const left = half && v - k === 0.5 ? 0.25 : 0.75;
            return [r.left + k * (px + gap) + left * px, r.top + r.height / 2];
          };
          return { anchor: box, locate: (v) => at(v), locateThumb: () => at(Math.max(0.5, ctx.model.values[i][0])), set: (vals) => paint(vals[0]) };
        });
        placeIn(ctx, card, rng);
        return out;
      },
    },
  },
});
