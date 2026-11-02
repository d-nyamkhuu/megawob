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
      // This design uses a persistent horizontal app bar and a slim counts inspector.
      const sidebar = false;
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, '▦  TeamHub');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Home', 'Chat', 'Teams', 'Meetings', 'Files', 'Calendar']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
        const search = util.el('div', 'chat-search', header, '⌕　 Search messages, people, or files');
        const bell = util.el('div', 'chat-bell', header, '♧');
        const account = util.el('div', 'chat-account', header, '♧　 JD');
        const windowControls = util.el('div', 'chat-window-controls', header);
        for (const glyph of ['−', '□', '×']) util.el('span', '', windowControls, glyph);
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const stats = util.el('aside', 'chat-stats', body);
      for (const [icon, value] of [['♙', '18'], ['▤', ''], ['⚑', '0'], ['↗', '12']]) {
        const row = util.el('div', 'chat-stat', stats);
        util.el('span', '', row, icon);
        if (value) util.el('span', '', row, value);
      }
      Object.assign(_c, { stage, stats });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-chat-pinreact-02',
    template: 'site/base',
    design: { parts },
  });
})();
