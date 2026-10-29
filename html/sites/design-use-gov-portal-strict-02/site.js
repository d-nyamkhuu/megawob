// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const windowbar = util.el('div', 'gov-windowbar', document.body);
      util.el('span', 'gov-window-mark', windowbar, '♛');
      util.el('span', '', windowbar, 'Civic Support  –  Apply for assistance');
      const wincontrols = util.el('div', 'gov-window-controls', windowbar);
      for (const glyph of ['−', '□', '×']) util.el('span', '', wincontrols, glyph);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, wincontrols, windowbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
        util.el('span', 'gov-tagline', header, 'People  ·  Services  ·  A Stronger Community');
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const records = util.el('aside', 'gov-records', body);
      const recordsHead = util.el('div', 'gov-records-head', records);
      util.el('span', 'gov-records-icon', recordsHead, '▤');
      util.el('strong', '', recordsHead, 'My records');
      util.el('div', 'gov-search', recordsHead, '⌕　Search records…');
      const recordTabs = util.el('div', 'gov-record-tabs', records);
      for (const [i, tab] of ['Applications', 'Letters', 'Evidence', 'Profile'].entries()) {
        const t = util.el('span', i === 0 ? 'active' : '', recordTabs, tab);
      }
      const recordTable = util.el('div', 'gov-record-table', records);
      const tableHead = util.el('div', 'gov-record-row gov-record-labels', recordTable);
      for (const col of ['', 'Date', 'Type', 'Status']) util.el('span', '', tableHead, col);
      for (const row of [['12 Feb 2021', 'Council Tax Support', 'Approved'], ['03 Nov 2020', 'Housing Assistance', 'Closed'], ['18 Aug 2020', 'Civic Support', 'Closed'], ['27 Apr 2020', 'Discretionary Payment', 'Approved'], ['14 Jan 2020', 'Council Tax Support', 'Closed']]) {
        const line = util.el('div', 'gov-record-row', recordTable);
        util.el('span', 'gov-file-icon', line, '▤');
        for (const value of row) util.el('span', '', line, value);
      }
      Object.assign(_c, { recordTable, recordTabs, records, recordsHead, stage, tableHead });
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
      const dock = util.el('nav', 'gov-dock', document.body);
      for (const [i, pair] of [['⌂', 'Home'], ['▤', 'Apply'], ['▤', 'Payments'], ['✉', 'Messages'], ['♙', 'My account']].entries()) {
        const item = util.el('div', i === 1 ? 'gov-dock-item selected' : 'gov-dock-item', dock);
        util.el('span', 'gov-dock-icon', item, pair[0]);
        util.el('span', '', item, pair[1]);
      }
      Object.assign(_c, { dock, submit });
    },
  };

  env.site({
    name: 'design-use-gov-portal-strict-02',
    template: 'site/base',
    design: { parts },
  });
})();
