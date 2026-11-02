// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      // Paper and leather stay consistent across the sampled episode themes.
      root.style.setProperty('--bg', '#f4efe3');
      root.style.setProperty('--panel', '#fbf8f0');
      root.style.setProperty('--fg', '#241f1b');
      root.style.setProperty('--muted', '#766b5a');
      root.style.setProperty('--line', '#d1c5b1');
      root.style.setProperty('--accent', '#548bcb');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.dataset.instruction = display;
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const summary = util.el('section', 'ref-summary', document.body);
      const metrics = [
        ['☷', '6', 'Total Tasks', 'tasks'],
        ['●', '4', 'In Progress', 'progress'],
        ['✓', '1', 'Completed', 'complete'],
        ['◆', '1', 'Milestone', 'milestone'],
      ];
      for (const [icon, value, label, kind] of metrics) {
        const card = util.el('div', `ref-summary-card ref-summary-${kind}`, summary);
        const badge = util.el('span', 'ref-summary-icon', card);
        const glyph = util.svg('svg', {viewBox:'0 0 32 32', 'aria-hidden':'true'}, badge);
        glyph.innerHTML = {
          tasks:'<path d="M12 7h15M12 16h15M12 25h15" fill="none" stroke="#007bff" stroke-width="2.6" stroke-linecap="round"/><g fill="#007bff"><circle cx="5" cy="7" r="2"/><circle cx="5" cy="16" r="2"/><circle cx="5" cy="25" r="2"/></g>',
          progress:'<circle cx="16" cy="16" r="12" fill="#0784ff" stroke="#0072ee" stroke-width="1.5"/>',
          complete:'<path d="M7 16l6 6L25 9" fill="none" stroke="#009d4b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
          milestone:'<path d="M16 3l13 13-13 13L3 16z" fill="#90a3b4" stroke="#8194a6"/>'
        }[kind];
        const copy = util.el('span', 'ref-summary-copy', card);
        util.el('strong', '', copy, value);
        util.el('span', 'ref-summary-label', copy, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, metrics, summary });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand', header, 'Product Release Planner');
      if (!header.querySelector('.ref-nav')) util.el('nav', 'ref-nav', header);
      util.el('span', 'ref-range', header, 'Apr 22, 2010 – May 16, 2010');
      const notebook = util.svg('svg', {class:'ref-notebook', viewBox:'0 0 48 48', 'aria-hidden':'true'}, header);
      notebook.innerHTML = '<g transform="rotate(-11 24 24)"><rect x="8" y="5" width="32" height="39" rx="3" fill="#7a4b28" stroke="#35251c"/><rect x="6" y="3" width="32" height="38" rx="3" fill="#cba06c" stroke="#f1cba1"/><path d="M10 5v33h26M10 39h27" fill="none" stroke="#865c39"/><path d="M32 13h10m-10 11h10" stroke="#443b30" stroke-width="3"/><path d="M32 12h10m-10 11h10" stroke="#d9d5c9"/><circle cx="25" cy="13" r="2" fill="#ede3c9"/></g>';
      header.prepend(notebook);
    },
  };

  env.site({
    name: 'design-use-project-board-gantt-resize-05',
    template: 'site/base',
    design: { parts },
  });
})();
