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
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('ref-display-header', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      // This design is the Brightpage desktop app: its left rail and account tabs
      // are part of the application frame on every episode.
      Object.assign(_c, { sidebar: true, nav: false });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        util.el('div', 'bp-logo', side, '◧');
        util.el('div', 'bp-brand', side, 'Brightpage Books');
        const sampledItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const appItems = ['Home', 'Browse', 'My Library', 'Account', 'Settings', 'Help'];
        for (const [i] of sampledItems.slice(0, 6).entries()) {
          const item = appItems[i % appItems.length];
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      // The task card belongs with the help notes, without narrowing the task pane.
      _c.panel = _c.body.querySelector('.ref-panel');
      _c.body.classList.remove('ref-panel-right');
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const help = util.el('aside', 'bp-help', body);
      if (_c.panel) help.appendChild(_c.panel);
      util.el('div', 'bp-help-title', help, 'Help & Support');
      for (const [title, copy, link] of [
        ['Managing your subscription', 'You can change your plan, update your payment method or cancel your membership at any time.', 'How do I cancel my subscription? ›'],
        ['Billing questions', 'View your billing history and receipts in Purchase History.', 'More about billing ›'],
        ['Need more help?', 'Visit our Help Centre for more information or contact our support team.', 'Go to Help Centre ›']
      ]) {
        const section = util.el('section', 'bp-help-section', help);
        util.el('div', 'bp-help-heading', section, title);
        util.el('div', 'bp-help-copy', section, copy);
        util.el('div', 'bp-help-link', section, link);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { help, stage });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-roach-01',
    template: 'site/base',
    design: { parts },
  });
})();
