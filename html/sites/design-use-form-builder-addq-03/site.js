// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');

      // Motif desktop frame: native title bar and the classic application menu row.
      const winbar = util.el('div', 'motif-titlebar', document.body);
      util.el('span', 'motif-appicon', winbar, '▤');
      util.el('strong', '', winbar, 'Ninebark Landscaping · Workshop survey');
      const wincontrols = util.el('span', 'motif-wincontrols', winbar);
      for (const mark of ['—', '□', '×']) util.el('i', '', wincontrols, mark);
      const menubar = util.el('div', 'motif-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help']) util.el('span', '', menubar, item);
      Object.assign(_c, { H, W, display, menubar, roomy, tall, winbar, wincontrols });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const mark = util.svg('svg', {viewBox:'0 0 38 40', class:'ref-app-mark', 'aria-hidden':'true'}, header);
      util.svg('path', {d:'M3 2h29l4 5v30H3z', fill:'#fff', stroke:'#bed7ec', 'stroke-width':2}, mark);
      util.svg('path', {d:'M7 8h17M7 13h14M7 18h10M7 23h7M7 28h5', stroke:'#071c64', 'stroke-width':2}, mark);
      util.svg('path', {d:'M10 32v-7h5v7zm7 0V17h5v15zm7 0V9h5v23z', fill:'#08bc38', stroke:'#071c64', 'stroke-width':1.5}, mark);
      util.svg('path', {d:'M30 1v8h5', fill:'#ef4b50', stroke:'#071c64'}, mark);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, mark });
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      {
        const n = util.el('nav', 'ref-nav', header);
        if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav); // preserve the clone's frame draws
        for (const item of ['Build', 'Design', 'Settings', 'Share', 'Responses']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
  };

  env.site({
    name: 'design-use-form-builder-addq-03',
    template: 'site/base',
    design: { parts },
  });
})();
