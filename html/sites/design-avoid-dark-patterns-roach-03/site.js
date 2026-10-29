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
      const navDraw = W >= 1180 && rng.bool(0.5);
      // This design is the Brightpage desktop app: its left rail and account tabs
      // are part of the application frame on every episode.
      const sidebar = true;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      {
        const brand = util.el('div', 'ref-brand', header, 'Stridewell Account');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        util.el('div', 'bp-logo', side, '◧');
        util.el('div', 'bp-brand', side, 'Brightpage Books');
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const intro = util.el('section', 'bp-intro', body);
      util.el('div', 'bp-intro-art', intro);
      const introCopy = util.el('div', 'bp-intro-copy', intro);
      util.el('div', 'bp-intro-name', introCopy, 'Stridewell™');
      util.el('div', 'bp-intro-tagline', introCopy, 'Healthier days ahead.');
      util.el('div', 'bp-intro-description', introCopy, 'Guided fitness, mindful habits and expert advice for a stronger, happier you.');
      const pageHead = util.el('div', 'bp-pagehead', stage);
      util.el('div', 'bp-title', pageHead, 'Account');
      const tabs = util.el('div', 'bp-tabs', pageHead);
      for (const [i, tab] of ['Overview', 'Purchase History', 'Membership', 'Personal Details'].entries()) {
        const t = util.el('span', i === 0 ? 'bp-tab active' : 'bp-tab', tabs, tab);
      }
      const help = util.el('aside', 'bp-help', body);
      util.el('div', 'bp-help-title', help, 'Subscription Details');
      for (const [title, copy, link] of [
        ['Service:', 'Stridewell\nPlan: Premium Plan\nStatus: Active\nMonthly price: $14.99\nCurrency: USD\nNext payment: May 12, 2025\nPayment method: Visa •••• 4242', ''],
        ['Plan features:', 'On-demand workout library\nGuided meditation sessions\nNutrition plans\nMember community\nExpert Q&A', ''],
        ['Billing history:', 'Date                 Amount       Status\nApr 12, 2025       $14.99         Paid\nMar 12, 2025       $14.99         Paid\nFeb 12, 2025       $14.99         Paid\nJan 12, 2025        $14.99         Paid', '']
      ]) {
        const section = util.el('section', 'bp-help-section', help);
        util.el('div', 'bp-help-heading', section, title);
        if (title === 'Plan features:') {
          const box = util.el('div', 'bp-list-box', section);
          const list = util.el('ul', 'bp-feature-list', box);
          for (const item of copy.split('\n')) util.el('li', '', list, item);
        } else if (title === 'Billing history:') {
          const box = util.el('div', 'bp-table-box', section);
          const table = util.el('table', 'bp-history-table', box);
          const rows = [['Date', 'Amount', 'Status'], ['Apr 12, 2025', '$14.99', 'Paid'],
            ['Mar 12, 2025', '$14.99', 'Paid'], ['Feb 12, 2025', '$14.99', 'Paid'], ['Jan 12, 2025', '$14.99', 'Paid']];
          for (const [index, row] of rows.entries()) {
            const tr = util.el('tr', index === 0 ? 'bp-history-head' : '', table);
            for (const cell of row) util.el(index === 0 ? 'th' : 'td', '', tr, cell);
          }
        } else util.el('div', 'bp-help-copy', section, copy);
        util.el('div', 'bp-help-link', section, link);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { help, intro, introCopy, pageHead, stage, tabs });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-roach-03',
    template: 'site/base',
    design: { parts },
  });
})();
