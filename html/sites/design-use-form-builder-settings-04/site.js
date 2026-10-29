// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        rng.pick(TITLES); // retain the original seeded draw
        const title = 'Velvet Hammer Records · Participant intake';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        const tabs = ['Build', 'Settings', 'Share', 'Responses'];
        for (const [index, item] of local(navItems, K.nav).entries()) {
          const label = tabs[index] || item;
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const overview = util.el('aside', 'ref-overview', body);
      util.el('div', 'ref-overview-head', overview, 'Survey Overview');
      util.el('div', 'ref-overview-line', overview, 'Title　　Ninebark Landscaping · Workshop survey');
      util.el('div', 'ref-overview-line', overview, 'Status　　Draft');
      util.el('div', 'ref-overview-line', overview, 'Created　　Feb 20, 1997');
      util.el('div', 'ref-overview-line', overview, 'Last edited　 Feb 20, 1997');
      util.el('div', 'ref-overview-rule', overview);
      util.el('div', 'ref-overview-subhead', overview, 'Sections　　　3');
      util.el('div', 'ref-overview-line', overview, 'Questions　　 8');
      util.el('div', 'ref-overview-line', overview, 'Estimated time　4 minutes');
      util.el('div', 'ref-overview-rule', overview);
      util.el('div', 'ref-overview-subhead', overview, 'Response summary');
      util.el('div', 'ref-overview-line', overview, 'Total responses　　 0');
      util.el('div', 'ref-overview-line', overview, 'Completed　　　　 0');
      util.el('div', 'ref-overview-line', overview, 'Partial　　　　　 0');
      util.el('div', 'ref-overview-rule', overview);
      util.el('div', 'ref-overview-subhead', overview, 'Response policy');
      util.el('div', 'ref-overview-line', overview, 'Collect email addresses　 No');
      util.el('div', 'ref-overview-line', overview, 'One response per person　No');
      util.el('div', 'ref-overview-line', overview, 'Scheduled closing　　　Not set');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, overview });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['Use sections to organize your form. Add question types, set validation rules, and configure response policies in Settings.', 'Use sections to organize your form. Add question types, set validation rules, and configure response policies in Settings.',
          'Need help? Review question types, validation rules and response policies in Settings.', 'Use sections to organize your form. Add question types and configure response policies in Settings.']);
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
    name: 'design-use-form-builder-settings-04',
    template: 'site/base',
    design: { parts },
  });
})();
