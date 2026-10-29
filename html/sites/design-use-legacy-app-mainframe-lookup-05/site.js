// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      // Keep the reference design single-purpose, while consuming the same seeded draws.
      rng.bool(0.35);
      const sidebar = false;
      rng.bool(0.5);
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.nav': (base, S) => function (_c) {
      const { header, util } = _c;
      const bank = util.svg('svg', { viewBox:'0 0 32 32', fill:'none', stroke:'#1683ed', 'stroke-width':'1.7', 'stroke-linejoin':'round', 'aria-hidden':'true' }, header);
      bank.setAttribute('class', 'finance-bank');
      util.svg('path', { d:'M3 10 16 3l13 7H3Z', fill:'#b8ddff' }, bank);
      util.svg('path', { d:'M5 12h22M4 28h24M3 30h26M7 13v12m4-12v12m5-12v12m5-12v12m4-12v12M5 26h22' }, bank);
      util.svg('path', { d:'M15 6h2v2h-2Z', fill:'#1683ed', stroke:'none' }, bank);
      const tabs = util.el('nav', 'ref-nav', header);
      for (const [i, item] of ['Accounts', 'Payments', 'Reports', 'Inquiries', 'Administration'].entries()) {
        const a = util.el('a', 'ref-navlink' + (i === 0 ? ' active' : ''), tabs, item);
        a.href = '#'; a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const workspace = util.el('section', 'finance-workspace', body);
      const summary = util.el('div', 'account-summary', workspace);
      const stage = util.el('main', 'ref-stage', workspace);
      S.frameAlign(_c, stage);
      util.el('div', 'summary-label', summary, 'Account');
      util.el('strong', 'summary-account', summary, 'R2641');
      util.el('div', 'summary-customer-label', summary, 'Customer Name');
      util.el('strong', 'summary-customer', summary, 'Riverside Medical Center');
      const stats = util.el('div', 'summary-stats', summary);
      for (const [label, value] of [['Account Type','Commercial'], ['Status','Open'], ['Credit Limit','250,000.00'], ['Current Open Balance','124,360.75']]) {
        const cell = util.el('div', 'summary-cell', stats);
        util.el('span', '', cell, label); util.el('strong', '', cell, value);
      }
      const inspector = util.el('aside', 'legacy-inspector', body);
      util.el('div', 'legacy-inspector-title', inspector, 'Account List');
      const search = util.el('div', 'account-search', inspector);
      const searchIcon = util.svg('svg', { viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':'1.8', 'aria-hidden':'true' }, search);
      util.svg('circle', {cx:'10', cy:'10', r:'7'}, searchIcon);
      util.svg('path', {d:'m15 15 6 6'}, searchIcon);
      util.el('span', '', search, 'Search accounts…');
      const rows = [
        ['R2641', 'Riverside Medical Center'], ['C1120', 'Carter Industries'], ['G5590', 'Golden Valley Foods'],
        ['H7713', 'Hamilton Properties'], ['J3098', 'Jefferson Consulting'], ['K8822', 'Keller Equipment'],
        ['M4431', 'Maple Grove School Dist'], ['N6700', 'Northside Technologies'], ['P5214', 'Pinecrest Builders'],
        ['R2642', 'Redwood Hospitality'], ['S9801', 'Summit Logistics'], ['T6620', 'Tri-State Manufacturing'],
        ['V3388', 'Valley Health Systems'], ['W1055', 'Westbridge Partners'], ['Y7766', 'Yorkton Energy']
      ];
      const table = util.el('div', 'account-table', inspector);
      const headings = util.el('div', 'account-head', table);
      util.el('span', '', headings, 'Account'); util.el('span', '', headings, 'Customer Name');
      const viewport = util.el('div', 'account-list-viewport', table);
      const list = util.el('div', 'account-rows', viewport);
      const contents = util.el('div', 'account-row-content', list);
      for (const [i, row] of rows.entries()) {
        const el = util.el('div', 'account-row' + (!i ? ' selected' : ''), contents);
        util.el('span', '', el, row[0]); util.el('span', '', el, row[1]);
      }
      const scrollTrack = util.el('div', 'account-scrollbar', table);
      const scrollThumb = util.el('div', 'account-scroll-thumb', scrollTrack);
      const syncScroll = () => {
        const ratio = Math.min(1, list.clientHeight / list.scrollHeight);
        scrollThumb.style.height = `${ratio * 100}%`;
        scrollThumb.style.top = `${list.scrollTop / list.scrollHeight * 100}%`;
      };
      const moveScroll = (event) => {
        const bounds = scrollTrack.getBoundingClientRect();
        const ratio = (event.clientY - bounds.top) / bounds.height;
        list.scrollTop = ratio * list.scrollHeight - list.clientHeight / 2;
        syncScroll();
      };
      list.addEventListener('scroll', syncScroll);
      scrollTrack.addEventListener('pointerdown', (event) => { scrollTrack.setPointerCapture(event.pointerId); moveScroll(event); });
      scrollTrack.addEventListener('pointermove', (event) => { if (scrollTrack.hasPointerCapture(event.pointerId)) moveScroll(event); });
      const footer = util.el('div', 'account-footer', inspector);
      util.el('span', '', footer, '15 accounts'); util.el('span', '', footer, 'Row 1 of 15');
      Object.assign(_c, { inspector, stage, summary });
    },
  };

  env.site({
    name: 'design-use-legacy-app-mainframe-lookup-05',
    template: 'site/base',
    design: { parts },
  });
})();
