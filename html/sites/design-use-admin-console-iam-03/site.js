// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Directory Administration'];

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1380;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      } else {
        const brand = util.el('div', 'ref-brand', header, 'Directory Administration');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'ref-help', body);
      util.el('div', 'ref-help-title', help, 'Help');
      const helpText = util.el('div', 'ref-help-content', help);
      util.el('p', '', helpText, 'Use this tool to manage directory access for Northstar users.');
      util.el('p', '', helpText, 'For each account, set the appropriate role and licence using the drop-down lists.');
      util.el('h3', '', helpText, 'Roles');
      util.el('p', '', helpText, 'Administrator – full access to all services.');
      util.el('p', '', helpText, 'Operator – can manage resources within their team.');
      util.el('p', '', helpText, 'Viewer – read-only access.');
      util.el('h3', '', helpText, 'Licences');
      util.el('p', '', helpText, 'Workspace Plus – full productivity suite.');
      util.el('p', '', helpText, 'Essentials – limited productivity tools.');
      Object.assign(_c, { help, helpText, stage });
    },
  };

  env.site({
    name: 'design-use-admin-console-iam-03',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
