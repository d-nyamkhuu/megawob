// BrightFinance glass window on the shared reference frame.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const oldFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      const oldSidebar = roomy && rng.bool(0.35);
      const oldNav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const designRng = rng.fork('finance/end-placement');
      if (!ctx.finish) placement = designRng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon', 'floating']);
      const wantFooter = !ctx.finish && tall && (placement === 'footer' || placement === 'link' || oldFooter);
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      document.body.classList.add('finance-app');
      const windowbar = util.el('div', 'finance-windowbar', document.body);
      const lights = util.el('div', 'finance-lights', windowbar);
      for (const color of ['red', 'yellow', 'green']) util.el('span', color, lights);
      Object.assign(_c, { collide, cr, decoys, label, nav: false, placement, sidebar: false, wantFooter, windowbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, util, word } = _c;
      const { K } = S;
      if ((display !== 'header' || nav) && word) word(lr.pick(K.brand));
      const header = util.el('header', 'ref-task finance-toolbar', document.body);
      const brand = util.el('div', 'finance-brand', header);
      util.el('span', 'finance-brand-icon', brand, '◉');
      const name = util.el('span', 'finance-brand-name', brand);
      name.innerHTML = '<b>Bright</b>Finance';
      const search = util.el('div', 'finance-search', header);
      util.el('span', 'finance-search-icon', search, '⌕');
      const input = util.el('input', '', search);
      input.type = 'search'; input.placeholder = 'Search articles'; input.setAttribute('aria-label', 'Search articles');
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, rng, util } = _c;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel finance-task-panel', body);
        rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, 'Your task');
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        rng.bool(0.5);
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const side = util.el('aside', 'finance-sidebar', body);
      const progress = util.el('section', 'finance-side-card finance-progress', side);
      util.el('h3', '', progress, 'Learning progress');
      util.el('span', 'finance-chevron', progress, '›');
      const progressRow = util.el('div', 'finance-progress-row', progress);
      const ring = util.el('div', 'finance-ring', progressRow);
      ring.innerHTML = '<strong>3</strong><small>of 8</small>';
      const status = util.el('div', 'finance-progress-copy', progressRow);
      util.el('strong', '', status, 'Articles saved');
      util.el('p', '', status, 'Keep exploring to build your knowledge.');
      const cats = util.el('section', 'finance-side-card finance-categories', side);
      util.el('h3', '', cats, 'Categories');
      util.el('span', 'finance-chevron', cats, '›');
      const categoryArt = [
        '<svg viewBox="0 0 32 32"><path d="M7 13c2-3 6-4 11-3l4-3 1 5c2 1 3 3 3 6 0 5-4 8-10 8h-3l-2 3h-3v-4c-2-1-3-2-4-4l-3-1v-5l4-1z"/><circle cx="21" cy="16" r="1" fill="currentColor" stroke="none"/></svg>',
        '<svg viewBox="0 0 32 32"><rect x="3" y="19" width="6" height="10" rx="1.5"/><rect x="13" y="12" width="6" height="17" rx="1.5"/><rect x="23" y="5" width="6" height="24" rx="1.5"/></svg>',
        '<svg viewBox="0 0 32 32"><path d="M3 15 16 4l13 11M7 13v15h8v-9h6v9h5V13"/></svg>',
        '<svg viewBox="0 0 32 32"><path d="M3 16c2-8 8-12 13-12s11 4 13 12c-2-2-5-2-7 0-2-2-4-2-6 0-2-2-5-2-7 0-2-2-4-2-6 0zm13 0v11c0 3 5 4 6 0"/></svg>',
        '<svg viewBox="0 0 32 32"><rect x="3" y="6" width="26" height="20" rx="2"/><path d="M3 12h26M8 19h8M8 23h5"/></svg>'
      ];
      [['Saving','4','purple'],['Investing','3','gold'],['Home ownership','2','green'],['Retirement','3','blue'],['Managing debt','3','blue']].forEach(([name,count,color],i) => {
        const item = util.el('div', 'finance-category', cats);
        const icon = util.el('span', 'finance-category-icon '+color, item);
        icon.innerHTML = categoryArt[i];
        util.el('span', 'finance-category-name', item, name);
        util.el('span', 'finance-category-count', item, count);
      });
      const recent = util.el('section', 'finance-side-card finance-recent', side);
      util.el('h3', '', recent, 'Recently saved');
      util.el('span', 'finance-chevron', recent, '›');
      [['Creating a budget that works','Apr 24, 2025',0],['Saving for a home','Apr 22, 2025',2],['Planning for retirement','Apr 18, 2025',3]].forEach(([name,date,i]) => {
        const item = util.el('div', 'finance-recent-item', recent);
        util.el('span', 'finance-recent-thumb finance-thumb-'+i, item);
        const label = util.el('span', 'finance-recent-copy', item);
        util.el('strong', '', label, name);
        util.el('small', '', label, date);
      });
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage, inspector: side });
    },
  };

  env.site({
    name: 'design-scroll-page-hscroll-03',
    template: 'site/base',
    design: { parts },
  });
})();
