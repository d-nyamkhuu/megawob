/* read-figure/_shades-frame: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function install(BASE, scope, V) {
    BASE.scale = (ctx, panel, k) => {
      if (k < 1) {
        panel.style.transform = `scale(${k.toFixed(4)})`;
        if (scope.D.scaleVar) panel.style.setProperty('--up-scale', String(k));
      }
    };
    BASE.fit = (ctx, panel) => {
      const r = panel.getBoundingClientRect(),
        k = Math.min(1, (ctx.size.width - 8) / r.width, (ctx.size.height - 8) / r.height);
      scope.P.scale(ctx, panel, k);
      return { w: r.width * k, h: r.height * k, k };
    };
    BASE.position = (ctx, panel, { w, h }, { fx, fy, mx, my }) => {
      const { size } = ctx;
      panel.style.left = scope.px(mx + fx * Math.max(0, size.width - 2 * mx - w));
      panel.style.top = scope.px(my + fy * Math.max(0, size.height - 2 * my - h));
    };
    BASE.place = (ctx, panel, geo) => {
      const { size, rng } = ctx,
        { w, h } = geo,
        pr = rng.fork('place');
      const fx = pr.pick([0, 0.5, 0.5, 1, pr.float(0, 1)]),
        fy = pr.pick([0, 0.5, 0.5, 1, pr.float(0, 1)]),
        mx = Math.min(16, Math.max(0, (size.width - w) / 2)),
        my = Math.min(12, Math.max(0, (size.height - h) / 2));
      scope.P.position(ctx, panel, geo, { fx, fy, mx, my });
    };
    BASE.rendered = (ctx, panel) => {};
    BASE.resultBar = function (ctx, panel, up) {
      const { spec, util, rng } = ctx;
      const bar = util.el('div', 'up-result', panel);
      const message = util.el('span', 'up-result-text', bar);
      const text = util.el('span', '', message, '');
      const btn = util.el('button', '', bar, rng.pick(['Undo', 'Change answer', 'Back']));
      btn.type = 'button';
      btn.dataset.role = 'undo';
      const saved = rng.pick(['Answer recorded.', 'Your answer was saved.', 'Choice saved.', 'Answer locked in.']);
      const idle = rng.pick([
        'Your answer is saved when you click it.',
        'Pick one answer; you can change it afterwards.',
        'One answer only.',
      ]);
      // Keep the shrink-to-fit panel and its controls stationary through answer and undo feedback.
      // Reserve every message before the kit records the panel anchor, including wrong-start episodes.
      for (const value of [idle, saved, 'That number was out of order.']) {
        const reserve = util.el('span', 'up-result-size', message, value);
        reserve.setAttribute('aria-hidden', 'true');
      }
      btn.addEventListener('click', () => {
        const m = ctx.model;
        if (m.answer !== null && m.answer !== undefined) {
          ctx.log('undo');
          up({ answer: null });
        }
      });
      const standing = (m) => (m.answer !== null && m.answer !== undefined ? 'saved' : null);
      return {
        sync(m) {
          const s = standing(m);
          bar.classList.toggle('bad', s === 'bad');
          text.textContent = s === 'bad' ? 'That number was out of order.' : s ? saved : idle;
          btn.disabled = !s;
        },
        locate: () => env.util.center(btn),
      };
    };
  }
  env.template('read-figure/_shades-frame', () => ({ install }));
})();
