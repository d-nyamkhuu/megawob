// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.lang': (base, S) => function (_c) {
      const { ctx, rng, util } = _c;
      // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const lr = rng.fork('chrome/lang');
      const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
      const closeLabel = word ? word('close') : 'Close';

      // Fluent desktop window frame surrounding the long help page.
      document.body.classList.add('wellness-app');
      const win = util.el('div', 'wellness-windowbar', document.body);
      util.el('span', 'wellness-appmark', win, '✿');
      util.el('span', 'wellness-windowtitle', win, 'Wellness Hub');
      const winbuttons = util.el('div', 'wellness-winbuttons', win);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const b = util.el('span', 'wellness-winbutton', winbuttons, glyph);
        b.setAttribute('aria-label', label);
      }
      const menubar = util.el('nav', 'wellness-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'wellness-toolbar', document.body);
      for (const [glyph, label] of [['←','Back'], ['→','Forward'], ['⌂','Home'], ['⟳','Refresh'], ['▣','Print'], ['Aᴀ','Text size']]) {
        const b = util.el('button', 'wellness-tool', toolbar);
        b.type = 'button'; b.setAttribute('aria-label', label); b.title = label;
        util.el('span', 'wellness-glyph', b, glyph); util.el('span', '', b, label);
      }
      Object.assign(_c, { closeLabel, local, lr, menubar, toolbar, win, winbuttons, word });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['footer', 'footer', 'footer', 'link', 'header', 'icon']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const showNav = W >= 1180 && rng.bool(0.5);
      const nav = W >= 1180;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, showNav, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, showNav, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('wellness-taskbar');
      if (display !== 'header' || nav) rng.pick(TITLES); // preserve the original brand draw
      const brand = util.el('div', 'ref-brand', header);
      util.el('span', 'paper-masthead', brand, 'The Daily Chronicle');
      util.el('span', 'paper-tagline', brand, 'Independent news\nfor a brighter tomorrow');
      brand.dataset.role = 'brand';
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        if (showNav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav); // retain original draws
        for (const item of ['Home', 'Topics', 'Contact']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      // Keep the narrow sticky header to one row of frame so pane rows remain fully visible.
      const meta = util.el('div', 'paper-meta', header);
      util.el('span', 'paper-date', meta, 'Tuesday 10 May 2011');
      const account = util.el('div', 'paper-account', meta);
      util.el('span', '', account, 'Sign in');
      util.el('span', '', account, 'Register');
      const search = util.el('div', 'wellness-search', meta);
      util.el('span', 'wellness-search-placeholder', search, 'Search the site');
      util.el('b', 'paper-site-search', search, 'Search');
      Object.assign(_c, { brand, header, search });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const workspace = util.el('div', 'wellness-workspace', body);
      const rail = util.el('nav', 'paper-rail', workspace);
      const icons = {
        Home: '<path d="M1 11 13 1l12 10-3 3-2-2v13h-6v-8h-4v8H4V12l-2 2z"/>',
        'My Account': '<path fill="none" stroke="currentColor" stroke-width="2" d="M4 4h20v20H4zM1 8v18h20M8 8h5v6H8zM17 8h4M17 11h4M17 14h4M8 18h13M8 21h13"/>',
        Newsletters: '<path fill="none" stroke="currentColor" stroke-width="2.4" d="M5 2h12l6 6v18H5zM17 2v7h6M9 13h10M9 17h10M9 21h10"/>',
        'Contact us': '<path d="M13 2C5 2 1 6 1 12c0 4 2 7 6 9l-3 6 9-5c8 0 13-4 13-10S21 2 13 2z"/>'
      };
      for (const [icon, label] of [['◆','Home'],['▤','My Account'],['▧','Newsletters'],['?','Help Centre'],['●','Contact us'],['⚙','Settings']]) {
        const item = util.el('div', 'paper-rail-item' + (label === 'Help Centre' ? ' selected' : ''), rail);
        const mark = util.el('b', label === 'Help Centre' ? 'paper-question' : '', item, icon);
        if (icons[label]) mark.innerHTML = '<svg viewBox="0 0 28 28" aria-hidden="true">' + icons[label] + '</svg>';
        util.el('span', '', item, label);
      }
      const paperNav = util.el('nav', 'paper-nav', workspace);
      for(const label of ['News','Sport','Business','Comment','Life & Style','Culture','Travel','Environment','TV & Radio']) util.el('span','',paperNav,label);
      const page = util.el('div', 'wellness-page', workspace);
      const shell = util.el('div', 'paper-shell', page);
      const hero = util.el('section', 'paper-intro', shell);
      const title = util.el('div', 'paper-title', hero);
      util.el('h1', '', title, 'Help Centre');
      util.el('p', '', title, 'Find answers, manage your account and get the most from The Daily Chronicle.');
      const search = util.el('div', 'paper-search', hero);
      util.el('span', '', search, 'Search help articles…'); util.el('b', '', search, 'Search');
      const feature = util.el('div', 'paper-feature', shell);
      util.el('div', 'paper-photo', feature);
      const featureCopy = util.el('div', 'paper-feature-copy', feature);
      util.el('h2', '', featureCopy, 'How can we help?');
      util.el('p', '', featureCopy, 'Our help centre has articles and guides on using the website, managing your account, subscriptions and more.');
      const cats = util.el('div', 'paper-categories', shell);
      for (const [heading, copy, link] of [['Account help','Manage your account, subscription, payments and personal details.','View account help articles ›'],['Using the website','Find out how to make the most of The Daily Chronicle online.','View website help articles ›'],['Troubleshooting','Get help with common problems and error messages.','View troubleshooting articles ›']]) {
        const cat = util.el('section', 'paper-category', cats);
        util.el('h3', '', cat, heading); util.el('p', '', cat, copy); util.el('a', '', cat, link);
      }
      const listhead = util.el('section', 'paper-listhead', shell);
      util.el('h2', '', listhead, 'Help articles');
      util.el('p', '', listhead, 'Browse all help articles or search for a specific topic.');
      const stage = util.el('main', 'ref-stage', shell);
      S.frameAlign(_c, stage);
      const help = util.el('aside', 'wellness-help', workspace);
      const summary = util.el('section', 'paper-summary', help);
      util.el('h2', '', summary, 'Help centre');
      for (const [number, label] of [['12','help articles'],['5','categories'],['0','popular articles']]) { const stat=util.el('div','paper-stat',summary); util.el('b','',stat,number); util.el('span','',stat,label); }
      const popular=util.el('section','paper-popular',help); util.el('h2','',popular,'Popular topics');
      for(const item of ['Managing your subscription','Resetting your password','Using email newsletters','Commenting on articles','Troubleshooting error messages']) util.el('a','',popular,item);
      const note = body.querySelector(':scope > .ref-panel');
      if (note) help.appendChild(note);
      Object.assign(_c, { hero, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.end': (base, S) => function (_c) {
      const result = base(_c);
      const {util, headerTools} = _c;
      let foot = document.querySelector('.ref-foot');
      if (!foot && headerTools.querySelector('.ref-xtra')) {
        foot = util.el('footer', 'ref-foot', document.body);
        util.el('span', 'ref-foot-text', foot, '© 2011 The Daily Chronicle');
        util.el('div', 'ref-tools', foot);
      }
      if (foot) {
        const text = foot.querySelector('.ref-foot-text');
        if (text) text.textContent = '© 2011 The Daily Chronicle';
        const tools = foot.querySelector('.ref-tools');
        for (const control of Array.from(headerTools.querySelectorAll('.ref-xtra'))) tools.appendChild(control);
      }
      return result;
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner' && result.el) {
        result.el.classList.add('paper-announcement');
        const header = document.querySelector('body > header.ref-task');
        result.el.style.top = header.offsetHeight + 'px';
        const dismiss = result.el.querySelector('button');
        if (dismiss) {
          dismiss.textContent = '×';
          dismiss.title = 'Dismiss announcement';
          dismiss.setAttribute('aria-label', 'Dismiss announcement');
        }
      }
      return result;
    },
  };

  env.site({
    name: 'design-scroll-page-sticky-05',
    template: 'site/base',
    design: { parts },
  });
})();
