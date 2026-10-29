/* act-in-time/_arena-simon: shared template implementation; parts remain on the calling template. */
(function () {
  'use strict';
  function installSimon(BASE, S, V, constants) {
    if (V === 'simon') {
      BASE.build = function (ctx, f, up) {
        const { util, spec } = ctx;
        const fam = env.taskDef;
        const main = util.el('div', 'ut-main', f.body);
        main.style.display = 'block';
        const row = util.el('div', 'ds-pads', main);
        row.style.gap = Math.min(55, ctx.size.width / (spec.pads.length * 12)) + 'px';
        const pads = spec.pads.map((p, i) => {
          const wrap = util.el('div', 'ds-pad-wrap', row);
          const b = util.el('button', 'ds-pad', wrap);
          util.el('span', 'ds-pad-label', wrap, p.color);
          b.style.background = p.hex;
          b.style.color = p.hex;
          b.style.setProperty('--pad-color', p.hex);
          b.style.height = Math.min(170, (ctx.size.width - 100) / spec.pads.length) + 'px';
          b.dataset.key = String(i);
          b.setAttribute('aria-label', p.color);
          b.addEventListener('click', () => {
            if (fam.helpers.simonPhase(spec, ctx.model.t) !== 'show') {
              up({ presses: ctx.model.presses.concat([i]) });
              sync(ctx.model);
            }
          });
          return b;
        });
        const status = util.el('div', 'ds-phase', main);
        const history = util.el('section', 'ds-history', main);
        util.el('h3', '', history, 'Sequence History');
        const cue = util.el('div', 'ds-cue', history);
        function sync(m) {
          const phase = fam.helpers.simonPhase(spec, m.t),
            lit = fam.helpers.simonLit(spec, m.t);
          pads.forEach((b, i) => {
            b.dataset.lit = String(i === lit);
            b.setAttribute('aria-disabled', String(phase === 'show'));
          });
          status.textContent =
            (phase === 'show' ? 'Status: Watch…' : 'Status: Your turn') +
            '     ' +
            m.presses.length +
            ' / ' +
            spec.seq.length;
          cue.textContent =
            phase === 'show' && lit !== null && lit >= 0 ? 'Show: ' + spec.pads[lit].color : 'Ready for your response';
          f.setStatus(phase === 'show' ? 'Watch the lights' : 'Repeat the sequence');
        }
        return { sync, locate: (t) => (t.pad !== undefined ? util.center(pads[t.pad]) : null) };
      };
    }
  }
  env.template('act-in-time/_arena-simon', () => ({ installSimon }));
})();
