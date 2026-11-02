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
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;

      // GEM-era workbook frame: native window, menu strip and workbook tabs.
      const titlebar = util.el('div', 'gem-titlebar', document.body);
      const appIcon = util.el('span', 'gem-app-icon', titlebar, '▤');
      appIcon.setAttribute('aria-hidden', 'true');
      util.el('strong', '', titlebar, 'Market Data - Workbook');
      const windowButtons = util.el('div', 'gem-window-buttons', titlebar);
      for (const glyph of ['−', '□', '×']) {
        const b = util.el('button', '', windowButtons, glyph);
        b.type = 'button';
        b.tabIndex = -1;
      }
      const menu = util.el('nav', 'gem-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Window', 'Help']) {
        const a = util.el('span', '', menu, item);
        a.setAttribute('role', 'presentation');
      }
      const tabs = util.el('nav', 'gem-tabs', document.body);
      for (const item of ['Sheet', 'Charts', 'Reports', 'Data', 'Properties']) {
        const b = util.el('button', item === 'Sheet' ? 'active' : '', tabs, item);
        b.type = 'button';
        b.tabIndex = -1;
      }
      Object.assign(_c, { accent, appIcon, content, menu, name, rng, root, tabs, titlebar, tr, util, windowButtons });
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
      const records = util.el('div', 'gem-record-strip', document.body);
      const recordHead = util.el('div', 'gem-record-head', records);
      for (const title of ['ID', 'Region', 'Product', 'Month', 'Sales', 'Units', 'Price']) util.el('span', '', recordHead, title);
      const recordRows = util.el('div', 'gem-record-rows', records);
      for (const row of [['P001', 'East', 'Widget', 'Jan', '120', '30', '4.00'], ['P002', 'East', 'Widget', 'Feb', '95', '28', '3.39'], ['P003', 'East', 'Widget', 'Mar', '142', '40', '3.55']]) {
        const line = util.el('div', '', recordRows);
        for (const value of row) util.el('span', '', line, value);
      }
      document.body.insertBefore(records, body);
      Object.assign(_c, { recordHead, recordRows, records, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const status = util.el('footer', 'gem-status', document.body);
      util.el('span', '', status, 'Ready');
      const metrics = util.el('div', 'gem-metrics', status);
      for (const value of ['Sum: 0', 'Avg: 0', 'Count: 0', '100%']) util.el('span', '', metrics, value);
      Object.assign(_c, { metrics, status, submit });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-condfmt-02',
    template: 'site/base',
    design: { parts },
  });
})();
