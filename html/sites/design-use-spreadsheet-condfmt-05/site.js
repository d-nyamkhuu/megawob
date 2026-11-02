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
      const header = util.el('header', 'civic-header', body);
      const brand = util.el('div', 'civic-brand', header);
      util.el('div', 'civic-people', brand, '●●●');
      const names = util.el('div', 'civic-names', brand);
      util.el('strong', '', names, 'Community Programs');
      util.el('span', '', names, 'Participant Expenses');
      const summary = util.el('div', 'civic-summary', header);
      for (const [label, value] of [['Total Participants', '36'], ['Total Expenses', '$4,592'], ['Average per Participant', '$128']]) {
        const metric = util.el('div', 'civic-metric', summary);
        util.el('span', '', metric, label); util.el('b', '', metric, value);
      }
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const side = util.el('div', 'civic-side', body);
      const cf = util.el('section', 'civic-cf', side);
      util.el('h2', '', cf, 'Conditional Formatting');
      const buttons = Array.from(body.querySelectorAll('button'));
      const nativeRule = buttons.find((button) => /conditional formatting/i.test(`${button.textContent} ${button.title} ${button.getAttribute('aria-label') || ''}`))
        || body.querySelector('.as-formatgroup .as-btn');
      if (nativeRule) {
        nativeRule.classList.add('civic-real-action');
        cf.appendChild(nativeRule);
      }
      util.el('h3', '', cf, 'Existing Rules');
      util.el('div', 'civic-empty', cf, 'No rules added yet.');
      const tips = util.el('aside', 'sheet-help', side);
      const panel = body.querySelector('.ref-panel');
      if (panel) tips.appendChild(panel);
      util.el('h2', '', tips, '💡 Spreadsheet Tips');
      util.el('div', 'sheet-rule', tips);
      const tasks = util.el('ul', '', tips);
      for (const text of ['Select a range of cells before adding a rule.', 'You can format cells based on their values using conditional formatting.', 'Rules are applied in the order they appear.', 'Use the + Add Rule button to create a new rule.']) util.el('li', '', tasks, text);
      const dock = util.el('nav', 'sheet-dock', document.body);
      for (const [icon, text] of [['⌂', 'Home'], ['▤', 'Workbooks'], ['▥', 'Reports'], ['♟', 'People'], ['⚙', 'Settings']]) {
        const a = util.el('a', text === 'Workbooks' ? 'active' : '', dock);
        util.el('span', 'dock-icon', a, icon);
        util.el('span', '', a, text);
      }
      const dockRight = util.el('div', 'dock-right', dock);
      Object.assign(_c, { dock, dockRight, header, stage, tasks, tips, side });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-condfmt-05',
    template: 'site/base',
    design: { parts },
  });
})();
