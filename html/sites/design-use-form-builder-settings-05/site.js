// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      const r = _c.ctx.rng.fork('plain/end-placement');
      if (!_c.ctx.finish && !_c.word && r.bool(0.55)) {
        _c.placement = 'header'; _c.label = 'Confirm';
        if (_c.collide?.text === 'Confirm') _c.collide.text = 'Save';
      }
    },
    'frame.instruction': (base, S) => function (_c) {
      if (_c.display !== 'header') base(_c);
    },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const rail = util.el('nav', 'nb-topnav', header);
        util.el('strong', 'nb-appname', rail, 'Form Builder');
        for (const text of ['Forms', 'Templates', 'Responses', 'Settings', 'Help']) {
          const item = util.el('a', 'nb-topnav-item', rail, text);
          item.href = '#';
          item.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: text }); });
        }
        if (display !== 'header' || nav) {
          rng.pick(TITLES); // retain the original seeded draw
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : '');
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header, rail });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util, ctx, display } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const overview = util.el('aside', 'ref-overview', body);
        util.el('h1', 'ref-overview-head', overview, 'Glasswing Optics · Visit preferences');
        util.el('div', 'ref-overview-line nb-summary-description', overview, 'A short survey about your preferences for visiting our stores.');
        if (display === 'header') util.el('div', 'ref-instruction', overview, ctx.instruction);
        else {
          util.el('div', 'ref-overview-line', overview, 'Status: Draft');
          util.el('div', 'ref-overview-line', overview, 'Created: 2024-05-18 10:24');
          util.el('div', 'ref-overview-line', overview, 'Sections: 3　Questions: 8');
        }
        util.el('div', 'nb-header-photo', overview);
        util.el('div', 'nb-header-logo', overview);
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, overview });
      },
  };

  env.site({
    name: 'design-use-form-builder-settings-05',
    template: 'site/base',
    design: { parts },
  });
})();
