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
      document.body.classList.toggle('sheet-header-note', display === 'header');
      document.body.classList.toggle('sheet-panel-note', display === 'panel');
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, navDraw, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav || navDraw) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, '▤  Campus Office');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Home', 'Documents', 'Spreadsheets', 'Mail', 'Calendar', 'Contacts']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, header, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'sheet-help', body);
      util.el('h2', '', tips, 'Workbooks');
      const books = util.el('div', 'sheet-books', tips);
      for (const text of ['Budget', 'Course Enrollments', 'Event Planning', 'Department Expenses', 'Research Grants']) {
        const a = util.el('a', '', books, text);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'workbook', label: text }); });
      }
      util.el('div', 'sheet-rule', tips);
      util.el('h2', '', tips, 'Summary');
      const stats = util.el('div', 'sheet-stats', tips);
      for (const [label, value] of [['Total Rows', '36'], ['Total Revenue', '18,540'], ['Total Expenses', '12,380'], ['Net Total', '6,160']]) {
        const row = util.el('div', 'sheet-stat', stats);
        util.el('span', '', row, label);
        util.el('span', '', row, value);
      }
      const search = util.el('div', 'sheet-search', header);
      util.el('span', '', search, 'Search:');
      const searchInput = util.el('input', '', search);
      searchInput.type = 'text';
      const go = util.el('button', '', search, 'Go');
      go.type = 'button';
      Object.assign(_c, { books, go, search, searchInput, stage, stats, tips });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-spreadsheet-condfmt-03',
    template: 'site/base',
    design: { parts },
  });
})();
