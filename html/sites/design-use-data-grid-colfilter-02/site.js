// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.classList.toggle('crm-header-note', display === 'header');
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task crm-topbar', document.body);
      util.el('div', 'crm-cloud', header, '☁');
      util.el('div', 'crm-wordmark', header, 'Acme CRM');
      const globalSearch = util.el('div', 'crm-global-search', header, '⌕　 Search tickets, contacts, or articles...');
      util.el('span', 'crm-top-icon', header);
      util.el('span', 'crm-top-icon bell', header);
      util.el('span', 'crm-avatar', header, 'JD');
      util.el('span', 'crm-account', header, 'Jordan Diaz　⌄');
      S.frameBrand(_c, header);
      Object.assign(_c, { globalSearch, header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { display, header, util } = _c;
      if (display !== 'header') util.el('div', 'ref-spacer', header);
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body crm-layout', document.body);
      const side = util.el('aside', 'crm-rail', body);
      util.el('div', 'crm-launcher', side, '▦');
      for (const [icon, item] of [['⌂','Home'],['◆','Tickets'],['♟','Customers'],['▣','Knowledge'],['▥','Reports'],['⚙','Settings']]) {
        const a = util.el('a', `crm-rail-item${item === 'Tickets' ? ' active' : ''}`, side);
        util.el('span', 'crm-rail-icon', a, icon); util.el('span', 'crm-rail-label', a, item);
        a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      Object.assign(_c, { body, side });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, ctx, display, util } = _c;
      const center = util.el('div', 'crm-center', body);
      const summary = util.el('section', 'crm-summary', center);
      const pageTitle = util.el('div', 'crm-page-title', summary);
      util.el('span', 'crm-page-icon', pageTitle);
      const titleCopy = util.el('div', 'crm-title-copy', pageTitle);
      util.el('strong', '', titleCopy, 'Tickets');
      util.el('span', '', titleCopy, 'Manage and resolve customer support tickets');
      if (display === 'header') util.el('div', 'ref-instruction crm-title-instruction', pageTitle, ctx.instruction);
      const metrics = util.el('div', 'crm-metrics', summary);
      for (const [value, label, icon, tone] of [['182','Open Tickets','⌁','blue'],['37','High Priority','!','red'],['12','Due Today','◷','amber'],['95%','Customer Satisfaction','▥','green']]) {
        const card = util.el('div', `crm-metric ${tone}`, metrics);
        const copy = util.el('div', 'crm-metric-copy', card); util.el('strong', '', copy, value); util.el('span', '', copy, label);
        util.el('span', 'crm-metric-icon', card, icon);
      }
      const stage = util.el('main', 'ref-stage', center);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'crm-tips', body);
      util.el('div', 'crm-tips-title', tips, '♧　 Tips & Help　⌃');
      for (const [icon, title, text] of [
        ['◩','Sort records','Click a column header to sort ascending or descending.'],
        ['⚑','Filter records','Use the funnel icon in a column header to filter by specific values.'],
        ['⚙','Select multiple records','Use checkboxes to select records. Shift-click to select a range, or select the top checkbox to select all.'],
        ['✧','Bulk actions','After selecting records, use the tools below the table to update status, assign, change priority, or delete.'],
        ['▲','Reorder columns','Drag and drop column headers to reorder. Drag the edge of a header to resize.'],
        ['✦','Pagination','Use the controls at the bottom to view more records.']]) {
        const row = util.el('div', 'crm-tip', tips); util.el('span', 'crm-tip-icon', row, icon);
        const copy = util.el('div', 'crm-tip-copy', row); util.el('strong', '', copy, title); util.el('span', '', copy, text);
      }
      Object.assign(_c, { center, metrics, pageTitle, stage, summary, tips, titleCopy });
    },
  };

  env.site({
    name: 'design-use-data-grid-colfilter-02',
    template: 'site/base',
    design: { parts },
  });
})();
