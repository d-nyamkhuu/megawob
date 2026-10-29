/* act-in-time/_arena-delay: shared template implementation; parts remain on the calling template. */
(function () {
  'use strict';
  function installDelay(BASE, S, V, constants) {
    const { ICON } = constants;
    if (V === 'delay') {
      BASE.beforeBuild = (ctx, f) => {
        if (S.D.process) {
          const process = ctx.util.el('div', 'ds-process', f.body);
          S.D.process.forEach((t) => ctx.util.el('span', '', process, t));
        }
      };

      BASE.build = function (ctx, f, up) {
        const { spec, util, rng } = ctx;
        const fam = env.taskDef;
        S.P.delayBegin(ctx);
        const main = util.el('div', 'ut-main', f.body);
        S.P.main(ctx, main);
        const record = (k) => up({ clicks: ctx.model.clicks.concat([{ key: k, t: ctx.model.t }]) });

        if (spec.mode === 'interval') {
          const r = main.getBoundingClientRect();
          const W = Math.min(620, Math.floor(r.width * S.D.intervalWidth));
          const H = Math.min(380, Math.floor(r.height));
          const surf = util.el('div', 'ut-surface', main);
          surf.style.width = W + 'px';
          surf.style.height = H + 'px';
          const pad = 20;
          const els = spec.buttons.map((bt) => {
            const el = util.el('button', 'ut-btn', surf, bt.label);
            el.type = 'button';
            el.dataset.key = bt.key;
            el.style.left = Math.round(pad + bt.x * (W - 92 - 2 * pad)) + 'px';
            el.style.top = Math.round(pad + bt.y * (H - 54 - 2 * pad)) + 'px';
            return el;
          });
          S.P.interval(ctx, { main, surf, els, pad, W, H });
          const early = () => ctx.model.t < (spec.ready || 0) - 1e-9;
          const btns = env.ui.buttons(els, { label: 'button', disabled: () => early(), onClick: (k) => record(k) });
          return {
            sync(m) {
              btns.set(m.clicks.map((c) => c.key));
              const c = m.clicks;
              const wait = early();
              for (const el of els) el.setAttribute('aria-disabled', wait ? 'true' : 'false');
              surf.style.opacity = wait ? '0.55' : '';
              f.setStatus(
                c.length
                  ? `ONE pressed at <b>${S.P.clockText(c[0].t)}</b>`
                  : wait
                    ? `Get ready… <b>${Math.ceil((spec.ready - m.t) / 1000)}</b>`
                    : '<b>Go!</b>',
              );
            },
            locate: (tg) => (tg.button ? btns.locate(tg.button) : null),
          };
        }

        const r = main.getBoundingClientRect();
        const card = util.el('div', 'ut-dl', main);
        card.style.left = Math.round(rng.float(0.1, 0.9) * Math.max(0, r.width - 440)) + 'px';
        card.style.top = Math.round(rng.float(0.1, 0.9) * Math.max(0, r.height - 230)) + 'px';
        util.el('h3', '', card, spec.context.title);
        util.el('p', '', card, spec.context.text);
        const state = util.el('div', 'ut-dlstate', card);
        const spin = S.P.spinner(util, state);
        const ok = util.el('span', '', state);
        ok.innerHTML = ICON.check;
        ok.style.display = 'none';
        const stTxt = util.el('span', '', state);
        const extra = S.P.delayState(ctx, card);
        const row = util.el('div', 'ut-row', S.P.actions(ctx, card));
        row.style.justifyContent = rng.pick(['flex-start', 'flex-end', 'center']);
        const els = spec.buttons.map((bt) => {
          const el = util.el('button', 'ut-btn' + (bt.key === 'go' ? ' primary' : ''), row, bt.label);
          el.type = 'button';
          el.dataset.key = bt.key;
          return el;
        });
        const go = els[spec.buttons.findIndex((bt) => bt.key === 'go')];
        go.style.minWidth = '120px';
        S.P.go(ctx, f, go);
        const btns = env.ui.buttons(els, { label: 'button', onClick: (k) => record(k) });

        const layout = { main, card, state, spin, ok, stTxt, row, els, go, extra };
        S.P.card(ctx, layout);
        function sync(m) {
          const ready = fam.helpers.delayReady(spec, m.t);
          spin.svg.style.display = ready ? 'none' : '';
          ok.style.display = ready ? '' : 'none';
          spin.arc.setAttribute('transform', `rotate(${Math.round((m.t / spec.beat) * 135) % 360} 11 11)`);
          stTxt.textContent = S.P.waitText(ctx, ready);
          S.P.delaySync(ctx, layout, m, ready);
          go.setAttribute('aria-disabled', ready ? 'false' : 'true');
          go.classList.toggle('skeleton', spec.mode === 'appear' && !ready);
          btns.set(m.clicks.map((c) => c.key));
          f.setStatus(ready ? '<b>Ready</b>' : 'Working…');
        }
        return { sync, locate: (tg) => (tg.button ? btns.locate(tg.button) : null) };
      };

      BASE.spinner = function (util, parent) {
        const svg = util.svg('svg', { viewBox: '0 0 22 22' }, parent);
        util.svg('circle', { class: 'ut-spin-track', cx: 11, cy: 11, r: 8.5, fill: 'none', 'stroke-width': 3 }, svg);
        const arc = util.svg(
          'path',
          {
            class: 'ut-spin-arc',
            d: 'M11 2.5A8.5 8.5 0 0 1 19.5 11',
            fill: 'none',
            'stroke-width': 3,
            'stroke-linecap': 'round',
          },
          svg,
        );
        return { svg, arc };
      };

      BASE.delayBegin = (ctx) => {};

      BASE.main = (ctx, main) => {};

      BASE.interval = (ctx, layout) => {};

      BASE.delayState = (ctx, card) => ({});

      BASE.actions = (ctx, card) => card;

      BASE.go = (ctx, f, go) => {};

      BASE.card = (ctx, layout) => {};

      BASE.waitText = (ctx, ready) =>
        ready ? 'Ready' : S.D.waitText || (ctx.spec.mode === 'enable' ? 'Please wait…' : 'Loading…');

      BASE.delaySync = (ctx, layout, m, ready) => {};
    }
  }
  env.template('act-in-time/_arena-delay', () => ({ installDelay }));
})();
