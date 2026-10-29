// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = true;
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
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
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
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
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-avoid-phishing-login-01',
    template: 'site/base',
    design: { parts },
  });
})();
