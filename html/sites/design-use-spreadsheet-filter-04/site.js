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
      const titlebar = util.el('div', 'ref-titlebar', document.body);
      const lights = util.el('div', 'ref-window-lights', titlebar);
      for (const tone of ['red', 'amber', 'green']) util.el('span', `ref-light ref-light-${tone}`, lights);
      util.el('div', 'ref-window-title', titlebar, 'Invoice Tracker');
      Object.assign(_c, { collide, cr, decoys, label, lights, nav, placement, sidebar, titlebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const rail = util.el('aside', 'sheet-rail', document.body);
      util.el('div', 'sheet-mark', rail, '▣');
      for (const [icon, text] of [['⌂','Home'],['▦','Workbooks'],['▧','Reports'],['▤','Data'],['ϟ','Automations'],['⚙','Settings']]) {
        const item = util.el('div', `sheet-rail-item${text === 'Workbooks' ? ' active' : ''}`, rail);
        util.el('span', 'sheet-rail-icon', item, icon); util.el('span', '', item, text);
      }
      const railUser = util.el('div', 'sheet-rail-user', rail);
      util.el('span', 'sheet-user-avatar', railUser, 'JS');
      util.el('span', '', railUser, 'Jordan Smith');
      util.el('span', '', railUser, '⌄');
      const apphead = util.el('div', 'sheet-apphead', header);
      const title = util.el('div', 'sheet-record-title', apphead);
      util.el('div', 'sheet-kicker', title, 'Workbooks');
      util.el('strong', '', title, 'Invoices');
      const actions = util.el('div', 'sheet-record-actions', apphead);
      util.el('div', 'sheet-command-search', actions, '⌕　 Search workbook…　　 ⌘ K');
      for (const [icon, label] of [['♧','Share'],['⇩','Export⌄'],['•••','']]) {
        const b = util.el('button', 'sheet-action', actions); b.type = 'button';
        util.el('span', '', b, icon); if (label) util.el('span', '', b, label);
      }
      const appTabs = util.el('div', 'sheet-tabs', header);
      for (const tab of ['Sheet','Charts','Summary','Activity']) util.el('div', `sheet-tab${tab === 'Sheet' ? ' active' : ''}`, appTabs, tab);
      const stats = util.el('div', 'sheet-stats', header);
      for (const [label, value, kind] of [['Total Invoices','36',''],['Paid','18','paid'],['Pending','9','pending'],['Overdue','6','overdue'],['Total Amount','$62,230.50','']]) {
        const card = util.el('div', 'sheet-stat', stats); util.el('span', '', card, label); util.el('strong', kind, card, value);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { actions, appTabs, apphead, header, rail, railUser, stats, title });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const appTools = util.el('div', 'ref-app-tools', header);
      const appButton = (glyph, label, selected) => {
        const b = util.el('button', `ref-app-tool${selected ? ' is-selected' : ''}`, appTools);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        util.el('span', 'ref-app-glyph', b, glyph);
        util.el('span', 'ref-app-label', b, label);
        return b;
      };
      appButton('▦', 'Workbook', true);
      appButton('▥', 'Charts');
      appButton('▤', 'Tables');
      appButton('A↧', 'Sort & Filter');
      appButton('✎', 'Format');
      util.el('span', 'ref-toolbar-gap', appTools);
      appButton('▦＋', 'Insert');
      appButton('▦−', 'Delete');
      appButton('∑', 'AutoSum');
      const search = util.el('div', 'ref-search', appTools);
      util.el('span', 'ref-search-icon', search, '⌕');
      util.el('span', '', search, 'Search Sheet');
      Object.assign(_c, { appButton, appTools, search });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-properties', document.body);
      const inspectorHead = util.el('div', 'ref-properties-head', inspector);
      util.el('span', 'ref-properties-close', inspectorHead, '●');
      util.el('strong', '', inspectorHead, 'Sheet Properties');
      const property = (label, value) => {
        const row = util.el('div', 'ref-property', inspector);
        util.el('span', '', row, label);
        util.el('span', 'ref-property-value', row, value);
      };
      property('Name:', 'Invoices');
      property('Description:', 'Customer invoices for Q1 2001.');
      util.el('div', 'ref-properties-rule', inspector);
      util.el('strong', 'ref-property-section', inspector, 'Formatting');
      property('Table Style:', 'Basic');
      for (const option of ['Header Row', 'Alternate Row Color', 'Gridlines']) {
        const row = util.el('div', 'ref-property-check', inspector);
        util.el('span', 'ref-check-mark', row, '✓'); util.el('span', '', row, option);
      }
      util.el('div', 'ref-properties-rule', inspector);
      util.el('strong', 'ref-property-section', inspector, 'Columns');
      for (const [col, type] of [['A', 'Text'], ['B', 'Date'], ['C', 'Text'], ['D', 'Text'], ['E', 'Currency'], ['F', 'Date']]) {
        const row = util.el('div', 'ref-property-column', inspector);
        util.el('span', '', row, `Column ${col}:`); util.el('span', 'ref-property-select', row, type + '  ▾');
      }
      Object.assign(_c, { inspector, inspectorHead, property, stage });
    },
  };

  env.site({
    name: 'design-use-spreadsheet-filter-04',
    template: 'site/base',
    design: { parts },
  });
})();
