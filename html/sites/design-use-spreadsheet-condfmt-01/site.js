// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      // Keep the seeded theme draws above for episode stability; this design uses one fixed paper-and-olive palette.
      for (const [k, v] of Object.entries({ bg: '#f1eee8', panel: '#fffdfa', fg: '#20271b', muted: '#736d5f', line: '#d8d2c7' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#6d795b');
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
      document.body.classList.toggle('sheet-header-note', display === 'header');
      document.body.classList.toggle('sheet-panel-note', display === 'panel');
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'sheet-help', body);
      const panel = body.querySelector('.ref-panel');
      if (panel) tips.appendChild(panel);
      util.el('h2', '', tips, 'Help & Tips');
      util.el('div', 'sheet-rule', tips);
      util.el('h3', '', tips, 'Conditional formatting');
      util.el('p', '', tips, 'Use conditional formatting to highlight cells that meet a rule, such as values greater than a number, less than a number, or within a range.');
      util.el('h3', '', tips, 'Common tasks');
      const tasks = util.el('ul', '', tips);
      for (const text of ['Select the cells you want to format.', 'Open Conditional Formatting from the toolbar.', 'Choose a rule type, set the value, and pick a format.', 'The formatting will update automatically.']) util.el('li', '', tasks, text);
      util.el('div', 'sheet-rule', tips);
      util.el('h3', '', tips, 'Examples');
      const examples = util.el('ul', '', tips);
      for (const text of ['Highlight values greater than 30.', 'Fill dates that are in the next 7 days.', 'Show negative numbers in red.', 'Apply a color scale to a range.']) util.el('li', '', examples, text);
      const dock = util.el('nav', 'sheet-dock', document.body);
      for (const [icon, text] of [['⌂', 'Home'], ['▦', 'Workbooks'], ['▤', 'Templates']]) {
        const a = util.el('a', text === 'Workbooks' ? 'active' : '', dock);
        util.el('span', 'dock-icon', a, icon);
        util.el('span', '', a, text);
      }
      const dockRight = util.el('div', 'dock-right', dock);
      for (const [icon, text] of [['ⓘ', 'Help'], ['⚙', 'Settings']]) {
        const a = util.el('a', '', dockRight);
        util.el('span', 'dock-icon', a, icon);
        util.el('span', '', a, text);
      }
      Object.assign(_c, { dock, dockRight, examples, stage, tasks, tips });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-condfmt-01',
    template: 'site/base',
    design: { parts },
  });
})();
