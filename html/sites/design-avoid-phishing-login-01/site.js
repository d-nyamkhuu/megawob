// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      _c.wantFooter = true;
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'PINECREST');
        brand.dataset.role = 'brand';
        util.el('span', 'ref-brand-sub', brand, 'CREDIT UNION');
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const hero = util.el('section', 'pine-hero-copy', stage);
      util.el('h1', '', hero, 'Banking for\na Brighter Tomorrow');
      util.el('div', 'pine-rule', hero);
      util.el('p', '', hero, 'Pinecrest Credit Union helps people and communities build stronger financial futures together.');
      util.el('div', 'pine-domain', hero, 'pinecrestcu.org');
      util.el('div', 'pine-tagline', hero, 'PEOPLE  /  PURPOSE  /  POSSIBILITIES');
      Object.assign(_c, { hero, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const { util, wantFooter } = _c;
      if (wantFooter) {
        const foot = document.querySelector('.ref-foot');
        foot.querySelector('.ref-foot-text').textContent = 'Pinecrest Credit Union · Ready';
        const dock = util.el('nav', 'pine-dock', foot);
        const items = [['⌂','Home'],['✉','Mail'],['▤','Accounts Payable'],['♧','Accounts'],['▣','Payments'],['▤','Documents'],['▥','Reports'],['⚙','Settings']];
        for (const [icon, text] of items) {
          const item = util.el('div', `pine-dock-item${text === 'Home' ? ' active' : ''}`, dock);
          util.el('span', 'pine-dock-icon', item, icon);
          util.el('span', '', item, text);
        }
        const status = util.el('div', 'pine-dock-status', dock);
        util.el('span', '', status, '♧  3');
        util.el('span', '', status, '▱  1');
      }
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) document.querySelector('.ref-foot').appendChild(dock);
    },
  };

  env.site({
    name: 'design-avoid-phishing-login-01',
    template: 'site/base',
    design: { parts },
  });
})();
