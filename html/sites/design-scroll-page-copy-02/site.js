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
      const windowbar = util.el('div', 'ref-windowbar', header);
      const controls = util.el('div', 'ref-window-controls', windowbar);
      for (const color of ['red', 'yellow', 'green']) util.el('span', `ref-window-dot ref-window-${color}`, controls);
      util.el('div', 'ref-window-title', windowbar, 'Vertex Desktop — Product Information');
      S.frameBrand(_c, header);
      Object.assign(_c, { controls, header, windowbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'ref-app-rail', body);
      util.el('div', 'ref-app-brand-mark', rail, 'A');
      util.el('div', 'ref-app-brand', rail, 'AlphaDesk');
      const railItems = [ ['⌂','Home'], ['✉','Inbox'], ['☑','Tasks'], ['♙','Customers'], ['▣','Knowledge'], ['▥','Reports'], ['⚙','Settings'] ];
      for (const [icon, text] of railItems) {
        const item = util.el('div', `ref-app-nav${text === 'Knowledge' ? ' active' : ''}`, rail);
        util.el('span', 'ref-app-navicon', item, icon);
        util.el('span', '', item, text);
        if (text === 'Inbox') util.el('span', 'ref-app-badge', item, '3');
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, rail, railItems });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('h3', '', inspector, 'Article details');
      const field = (label, value) => {
        const wrap = util.el('label', 'ref-inspector-field', inspector);
        if (label === 'Status') wrap.classList.add('status');
        util.el('span', '', wrap, label);
        const input = util.el('div', 'ref-inspector-input', wrap, value);
        return input;
      };
      field('Title', 'AlphaAnalytics Setup Guide');
      field('Category', 'Getting Started  ⌄');
      field('Status', 'Published  ⌄');
      util.el('div', 'ref-inspector-label', inspector, 'Last updated');
      util.el('div', 'ref-inspector-value', inspector, 'Feb 12, 2024, 10:24 AM');
      util.el('div', 'ref-inspector-label', inspector, 'Author');
      const author = util.el('div', 'ref-inspector-author', inspector);
      util.el('span', 'ref-inspector-avatar', author, 'JS');
      const authorText = util.el('div', '', author);
      util.el('div', '', authorText, 'Jordan Smith');
      util.el('div', 'ref-inspector-value', authorText, 'Product Support');
      util.el('div', 'ref-inspector-rule', inspector);
      util.el('h3', '', inspector, 'Related articles');
      for (const item of ['Account setup basics', 'Managing your license', 'Troubleshooting activation', 'Offline activation guide', 'Upgrading to a new version']) util.el('div', 'ref-inspector-link', inspector, item);
      Object.assign(_c, { author, authorText, field, inspector, stage });
    },
  };

  env.site({
    name: 'design-scroll-page-copy-02',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
