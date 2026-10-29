// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const sidebar = true;
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const windowTitle = util.el('div', 'ref-window-title', header, 'Civic Services');
      util.el('div', 'ref-window-controls', header, 'Operations Management System');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowTitle });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, header, headerTools, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const tabs = util.el('nav', 'civic-tabs', document.body);
      for (const item of ['Operations', 'Reports', 'Reference', 'Administration']) {
        util.el('span', item === 'Operations' ? 'civic-tab active' : 'civic-tab', tabs, item);
      }
      const summary = util.el('section', 'civic-summary', document.body);
      util.el('span', 'civic-database', summary, '▤');
      const summaryTitle = util.el('div', 'civic-summary-title', summary);
      util.el('strong', '', summaryTitle, 'Transaction Maintenance');
      util.el('span', '', summaryTitle, 'Maintain system records and configuration data');
      const summaryMeta = util.el('div', 'civic-summary-meta', summary);
      util.el('span', '', summaryMeta, 'Function　 Record Maintenance');
      util.el('span', '', summaryMeta, 'Module　 Operations (OPS)');
      util.el('span', '', summaryMeta, 'Program　 OPS2000');
      util.el('span', 'summary-server', summaryMeta, 'Server　　 OPSAPP01');
      util.el('span', 'summary-server', summaryMeta, 'Region　　 PROD');
      util.el('span', 'summary-server', summaryMeta, 'Version　　5.3.1');
      const menu = util.el('div', 'ref-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Connection', 'Transfer', 'Options', 'Help']) {
        util.el('span', '', menu, item);
      }
      const toolbar = util.el('div', 'ref-toolbar', document.body);
      const toolbarItems = [['▧', 'Connect'], ['⊖', 'Disconnect'], ['▤', 'Clear'], ['▣', 'Print'], ['▧', 'Copy'], ['▤', 'Paste']];
      for (const [icon, labelText] of toolbarItems) {
        const item = util.el('div', 'ref-toolbar-item', toolbar);
        util.el('span', 'ref-toolbar-icon', item, icon);
        util.el('span', '', item, labelText);
      }
      header.append(headerTools);
      document.body.insertBefore(menu, body);
      document.body.insertBefore(toolbar, body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        rng.sample(content.NAV_ITEMS, rng.int(4, 7));
        for (const item of ['Host Terminal', 'Record Maintenance', 'Inquiry', 'Reports', 'Utilities']) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body, menu, summary, summaryMeta, summaryTitle, tabs, toolbar, toolbarItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const fieldHelp = util.el('aside', 'ref-field-help', body);
      util.el('h2', '', fieldHelp, 'Field Information');
      const fieldInfo = util.el('div', 'ref-info-grid', fieldHelp);
      for (const [label, value] of [['Field', 'Record key'], ['Description', 'Unique identifier for the record'],
        ['Format', 'Alphanumeric, 1–10 characters'], ['Example', 'R4695']]) {
        util.el('b', '', fieldInfo, label);
        util.el('span', '', fieldInfo, value);
      }
      util.el('hr', '', fieldHelp);
      util.el('h3', 'ref-help-section', fieldHelp, 'Available Actions');
      const keys = [['F1', 'Display help information'], ['F3', 'Exit to previous menu'], ['F7', 'Display previous record'], ['F8', 'Display next record'], ['F12', 'Return to main menu']];
      const keyTable = util.el('div', 'ref-key-table', fieldHelp);
      for (const [key, value] of keys) { util.el('b', '', keyTable, key); util.el('span', '', keyTable, value); }
      util.el('hr', '', fieldHelp);
      util.el('h3', 'ref-help-section', fieldHelp, 'Screen Information');
      const screenInfo = util.el('div', 'ref-info-grid ref-screen-grid', fieldHelp);
      for (const [label, value] of [['Program', 'OPS2000'], ['Screen', '1 of 1'], ['Mode', 'Add / Edit'],
        ['Last change', '—'], ['Last changed by', '—']]) {
        util.el('b', '', screenInfo, label);
        util.el('span', '', screenInfo, value);
      }
      Object.assign(_c, { fieldHelp, fieldInfo, keyTable, keys, screenInfo, stage });
    },
  };

  env.site({
    name: 'design-use-legacy-app-mainframe-02',
    template: 'site/base',
    design: { parts },
  });
})();
