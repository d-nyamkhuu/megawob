// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
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
        // This reference design is a single-purpose macOS utility with a fixed light palette.
        name = 'light';
        accent = '#0878ff';
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { rng, util } = _c;
        const { TITLES } = S;
        const win = util.el('div', 'ref-window', document.body);
        const header = util.el('header', 'ref-task', win);
        rng.pick(TITLES); // retain the base site's seeded frame draw
        const brand = util.el('div', 'ref-brand', header, 'ProjectTracker — Engineering Issues');
        brand.dataset.role = 'brand';
        Object.assign(_c, { brand, header, win });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util, win } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const menu = util.el('nav', 'irix-menu', win);
        for (const item of ['File', 'Edit', 'View', 'Go', 'Actions', 'Tools', 'Help']) {
          const a = util.el('a', '', menu, item);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'menu', label: item });
          });
        }
        const tabs = util.el('nav', 'irix-tabs', win);
        for (const [icon, item] of [
          ['▤', 'Issues'],
          ['◆', 'Milestones'],
          ['⬢', 'Builds'],
          ['♟', 'People'],
          ['▥', 'Reports'],
        ]) {
          const a = util.el('a', item === 'Issues' ? 'irix-tab active' : 'irix-tab', tabs);
          a.href = '#';
          util.el('span', 'irix-tab-icon', a, icon);
          util.el('span', '', a, item);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'tab', label: item });
          });
        }
        Object.assign(_c, { menu, tabs });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { display, util, win } = _c;
        const body = util.el('div', 'ref-body', win);
        if (display === 'panel') body.classList.add('irix-panel-mode');
        const help = util.el('aside', 'irix-help', body);
        util.el('div', 'irix-help-title', help, 'Help & Tips');
        util.el('div', 'irix-help-head', help, 'Working with Issues');
        util.el(
          'p',
          '',
          help,
          'Use the table to browse, sort and filter issues. Select one or more rows to perform bulk actions such as reassign, change status or add a tag.',
        );
        util.el('div', 'irix-help-rule', help);
        util.el('div', 'irix-help-head', help, 'Tips');
        const tips = util.el('ul', 'irix-help-tips', help);
        for (const tip of [
          'Click a column header to sort (click again to reverse).',
          'Use the filter fields to narrow results.',
          'Shift-click to select a range of rows.',
          'Drag a column header to reorder columns.',
          'Drag a header edge to resize a column.',
          'Use the toolbar for common actions on selected issues.',
        ])
          util.el('li', '', tips, tip);
        util.el('div', 'irix-help-rule', help);
        util.el('div', 'irix-help-head', help, 'Legend (Priority)');
        const legend = util.el('div', 'irix-help-legend', help);
        for (const [color, text] of [
          ['#d82027', 'Critical'],
          ['#ed7900', 'High'],
          ['#f0cc00', 'Medium'],
          ['#16a52a', 'Low'],
        ]) {
          const row = util.el('div', '', legend);
          const swatch = util.el('i', '', row);
          swatch.style.background = color;
          util.el('span', '', row, text);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, help, legend, tips });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, win, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', win);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-data-grid-virtual-03',
    template: 'site/base',
    design: { parts },
  });
})();
