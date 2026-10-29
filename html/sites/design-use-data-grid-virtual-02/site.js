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
      // This reference design is a single-purpose macOS utility with a fixed light palette.
      name = 'light';
      accent = '#0878ff';
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      rng.bool(0.5); // retain the seeded navigation draw from the source widget
      const nav = W >= 1180;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const win = util.el('div', 'ref-window', document.body);
      const header = util.el('header', 'ref-task', win);
      rng.pick(TITLES); // retain the base site's seeded frame draw
      const brand = util.el('div', 'ref-brand', header, 'Acme Support');
      brand.dataset.role = 'brand';
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampled = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const items = word ? sampled : ['Tickets', 'Customers', 'Knowledge Base', 'Reports', 'Automation'];
        for (const item of items) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header, win });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'ref-top-search', header);
      util.el('span', 'ref-search-icon', search, '⌕');
      util.el('span', '', search, 'Search tickets, customers, or articles…');
      Object.assign(_c, { search });
    },
    'frame.body': (base, S) => function (_c) {
      const { util, win } = _c;
      const summary = util.el('section', 'ref-summary', win);
      const titleBlock = util.el('div', 'ref-summary-title', summary);
      util.el('div', 'ref-summary-eyebrow', titleBlock, 'Support');
      util.el('div', 'ref-summary-heading', titleBlock, 'Tickets');
      const stats = util.el('div', 'ref-summary-stats', summary);
      for (const [value, label, tone] of [
        ['48', 'Total Tickets', 'total'], ['12', 'Open', 'open'], ['18', 'In Progress', 'progress'],
        ['14', 'Waiting', 'waiting'], ['4', 'Resolved', 'resolved'],
      ]) {
        const item = util.el('div', `ref-summary-stat ref-stat-${tone}`, stats);
        util.el('strong', '', item, value);
        util.el('span', '', item, label);
      }
      const chart = util.el('div', 'ref-summary-chart', summary);
      const bars = util.el('div', 'ref-chart-bars', chart);
      for (const h of [75, 92, 68, 86, 54, 38, 72, 88, 66, 94, 44, 32, 61, 79]) {
        const bar = util.el('i', '', bars);
        bar.style.height = `${h}%`;
      }
      util.el('div', 'ref-chart-caption', chart, 'Tickets created (last 14 days)');
      const body = util.el('div', 'ref-body', win);
      S.frameSidebar(_c, body);
      Object.assign(_c, { bars, body, chart, stats, summary, titleBlock });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const related = util.el('aside', 'ref-related', body);
      const relatedCard = util.el('section', 'ref-related-card', related);
      const customerHead = util.el('div', 'ref-related-head', relatedCard);
      util.el('strong', '', customerHead, 'Related Customers');
      util.el('span', '', customerHead, 'View all');
      for (const [initials, name, count] of [
        ['NH', 'Northbridge Health', '6 tickets'], ['RS', 'Riverside Co.', '4 tickets'],
        ['HL', 'Helix Labs', '4 tickets'], ['SR', 'Summit Retail', '4 tickets'],
        ['CS', 'Cedar Systems', '3 tickets'],
      ]) {
        const row = util.el('div', 'ref-customer-row', relatedCard);
        util.el('span', 'ref-customer-avatar', row, initials);
        util.el('span', 'ref-customer-name', row, name);
        util.el('span', 'ref-customer-count', row, count);
      }
      const recentCard = util.el('section', 'ref-related-card ref-recent-card', related);
      const recentHead = util.el('div', 'ref-related-head', recentCard);
      util.el('strong', '', recentHead, 'Recent Tickets');
      util.el('span', '', recentHead, 'View all');
      for (const [id, subject, age, tone] of [
        ['TKT-1001', 'Cannot access account', '2h ago', 'blue'],
        ['TKT-1002', 'Error syncing data', '4h ago', 'orange'],
        ['TKT-1003', 'Request for new user', '1d ago', 'gray'],
        ['TKT-1004', 'Update billing information', '1d ago', 'blue'],
        ['TKT-1005', 'Feature request: dark mode', '1d ago', 'orange'],
      ]) {
        const row = util.el('div', 'ref-recent-row', recentCard);
        util.el('i', `ref-recent-dot dot-${tone}`, row);
        const copy = util.el('div', 'ref-recent-copy', row);
        util.el('strong', '', copy, id);
        util.el('span', '', copy, subject);
        util.el('time', '', row, age);
      }
      Object.assign(_c, { customerHead, recentCard, recentHead, related, relatedCard, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, win, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', win);
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
      Object.assign(_c, { submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-data-grid-virtual-02',
    template: 'site/base',
    design: { parts },
  });
})();
