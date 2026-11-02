// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'Layout Designer');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const editorialNav = ['Assets', 'Templates', 'Brand', 'Projects'];
        for (let i = 0; i < sampledNav.length; i++) {
          const item = word ? sampledNav[i] : editorialNav[i % editorialNav.length];
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const menu = util.el('nav', 'gtk-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Arrange', 'Help']) {
        const m = util.el('span', 'gtk-menu-item', menu, item);
        m.dataset.role = 'menu';
      }
      const toolbar = util.el('div', 'gtk-toolbar', document.body);
      for (const [icon, label] of [['↖', 'Select'], ['▣', 'Layout'], ['□', 'Shape'], ['T', 'Text'], ['☷', 'Align left'], ['☰', 'Align right']]) {
        const b = util.el('button', 'gtk-tool', toolbar, icon);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
      }

      // Editorial document metadata band, matching the reference tool's title strip.
      const record = util.el('section', 'ref-record', document.body);
      util.el('div', 'ref-record-thumb', record, '❧');
      const identity = util.el('div', 'ref-record-identity', record);
      util.el('div', 'ref-record-title', identity, 'Autumn Collection');
      util.el('div', 'ref-record-subtitle', identity, 'Social Media Graphic　 ·　 1080 × 1080 px');
      const details = util.el('div', 'ref-record-details', record);
      for (const [title, value] of [['Format', 'Square (1:1)'], ['Size', '1080 × 1080 px'], ['Color profile', 'sRGB'], ['Background', '■　#F8F5ED']]) {
        const item = util.el('div', 'ref-record-item', details);
        util.el('span', '', item, title);
        util.el('strong', '', item, value);
      }
      Object.assign(_c, { details, headerTools, identity, menu, record, submit, toolbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      {
        const side = util.el('aside', 'ref-side', body);
        util.el('div', 'gtk-pages-title', side, 'Pages');
        const pageItems = sidebar ? local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav) : ['Home Layout', 'Product Page', 'Article Page', 'Contact Page', 'Help Page'];
        for (const item of pageItems) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const dock = util.el('nav', 'gtk-dock', document.body);
      for (const [icon, label] of [['▤', 'Layouts'], ['▧', 'Images'], ['T', 'Text'], ['◉', 'Styles']]) {
        const b = util.el('button', `gtk-dock-item${label === 'Layouts' ? ' active' : ''}`, dock);
        b.type = 'button';
        util.el('span', 'gtk-dock-icon', b, icon);
        util.el('span', '', b, label);
      }
      Object.assign(_c, { dock, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-align-layout-mockup-04',
    template: 'site/base',
    design: { parts },
  });
})();
