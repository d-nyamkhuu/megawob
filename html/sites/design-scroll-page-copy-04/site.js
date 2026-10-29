// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const THEMES = {
    light: { bg: '#e5eaee', panel: '#ffffff', fg: '#0d0c24', muted: '#748195', line: '#d7dee5' },
    dark: { bg: '#15171c', panel: '#20232b', fg: '#e8eaf0', muted: '#9aa1ad', line: '#3a3f4b' },
    warm: { bg: '#f6f1e8', panel: '#fffaf2', fg: '#2b2118', muted: '#7d6b58', line: '#e2d6c3' },
  };

  const ACCENTS = ['#006dff', '#006dff', '#006dff', '#006dff', '#006dff', '#006dff'];

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { LOW_ACCENTS, LOW_THEME } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      name = 'light';
      accent = '#006dff';
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const mast = util.el('div', 'hb-masthead', header);
      util.el('div', 'hb-mark', mast, '▧');
      const identity = util.el('div', 'hb-identity', mast);
      util.el('strong', '', identity, 'Harbor Books');
      util.el('small', '', identity, 'WHOLESALE BOOKS & MEDIA');
      const utility = util.el('div', 'hb-utility', mast);
      for (const item of ['My Account', 'Order Status', 'Help', 'Contact Us', 'Sign Out']) util.el('span', '', utility, item);
      const tabs = util.el('nav', 'hb-tabs', header);
      for (const [i, item] of ['Home', 'Catalog', 'Orders', 'Marketing', 'Account'].entries()) {
        const a = util.el('a', i === 0 ? 'hb-tab hb-tab-active' : 'hb-tab', tabs, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const windowbar = util.el('div', 'ref-windowbar', header);
      const controls = util.el('div', 'ref-window-controls', windowbar);
      for (const color of ['red', 'yellow', 'green']) util.el('span', `ref-window-dot ref-window-${color}`, controls);
      util.el('div', 'ref-window-title', windowbar, 'Vertex Desktop — Product Information');
      S.frameBrand(_c, header);
      Object.assign(_c, { controls, header, identity, mast, tabs, utility, windowbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const help = util.el('aside', 'hb-help', body);
      util.el('strong', 'hb-help-title', help, 'Help & Information');
      util.el('b', '', help, 'Using Gift Cards');
      util.el('p', '', help, 'Gift cards can be applied to your account balance and used for future orders. Enter the code exactly as printed, including hyphens.');
      util.el('hr', '', help);
      util.el('b', '', help, 'Where to Find the Code');
      const tips = util.el('ul', '', help);
      for (const tip of ['The gift card code is printed in the Gift Card Information section below.', 'Codes are 16 characters long and include hyphens.', 'Each code can be used once.', 'If you have more than one gift card, you can apply them one at a time.']) util.el('li', '', tips, tip);
      util.el('hr', '', help);
      util.el('b', '', help, 'Need Help?');
      for (const item of ['Gift Card FAQs', 'Managing Your Account', 'Contact Customer Support']) {
        const a = util.el('a', '', help, item); a.href = '#'; a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'help', label: item }); });
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, help, tips });
    },
  };

  env.site({
    name: 'design-scroll-page-copy-04',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
