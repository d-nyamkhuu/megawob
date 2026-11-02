// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      // IRIX desktop window containing a newspaper consent sheet and properties inspector.
      const shell = util.el('div', 'irix-window', document.body);
      const titlebar = util.el('div', 'irix-titlebar', shell);
      util.el('span', 'irix-window-mark', titlebar, 'sgi');
      util.el('span', 'irix-window-title', titlebar, 'The Kettlebrook Courier — Page View');
      const winControls = util.el('div', 'irix-window-controls', titlebar);
      for (const mark of ['−', '□', '×']) util.el('span', '', winControls, mark);
      const workspace = util.el('div', 'irix-workspace', shell);
      const app = util.el('section', 'irix-app', workspace);
      const header = util.el('header', 'ref-task nl-masthead', app);
      const logo = util.el('div', 'ref-brand nl-brand', header);
      logo.dataset.role = 'brand';
      util.el('span', 'nl-prefix', logo, 'The');
      util.el('span', 'nl-name', logo, 'Kettlebrook Courier');
      util.el('span', 'nl-tagline', logo, 'Your town. Our stories.');
      const town = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      town.setAttribute('class', 'nl-mark');
      town.setAttribute('viewBox', '0 0 140 100');
      town.setAttribute('aria-hidden', 'true');
      const strokePath = (d, fill = 'none', width = '1.7') => {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', d); p.setAttribute('fill', fill); p.setAttribute('stroke', '#17171b');
        p.setAttribute('stroke-width', width); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
        town.appendChild(p);
      };
      strokePath('M8 78 Q31 63 52 76 Q73 61 96 75 Q117 61 134 76 L134 82 L8 82 Z', '#e7e5e1');
      strokePath('M10 81 Q69 74 132 81 M17 85 Q70 79 126 85 M28 88 Q70 82 116 88', 'none', '1.2');
      strokePath('M16 70 L24 48 L31 68 M20 58 L28 57 M24 48 L28 69 M19 56 Q10 48 17 40 Q12 32 22 27 Q23 17 31 23 Q39 18 41 27 Q50 30 45 38 Q50 47 41 51 Q37 61 29 55 Q23 61 19 56 Z', '#f3f2ec');
      strokePath('M29 51 L29 70 M24 58 L29 63 L35 55 M48 73 L48 53 L61 46 L72 53 L72 72 M53 54 L53 71 M60 51 L60 71 M67 54 L67 72 M48 59 L72 59', '#ebe9e4', '1.4');
      strokePath('M79 74 L81 38 L87 32 L93 38 L95 74 M78 38 L96 38 M80 32 L87 26 L94 32 M84 26 L87 13 L90 26 M87 13 L87 7 L89 13 M82 43 L92 43 M87 39 L87 47 M84 49 L84 54 L90 54 L90 49 Z M84 59 L84 74 M90 59 L90 74', '#eeece7', '1.5');
      strokePath('M100 71 L100 56 L109 51 L119 56 L119 74 M104 57 L104 72 M111 56 L111 72 M117 58 L117 73 M99 61 L120 61', '#e8e6e0', '1.4');
      strokePath('M6 77 Q29 70 48 77 Q68 84 87 77 Q110 68 136 77', 'none', '2.1');
      logo.appendChild(town);
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      if (display === 'header') util.el('div', 'ref-instruction nl-task-note', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const n = util.el('nav', 'ref-nav nl-topnav', header);
      for (const item of ['News', 'Sport', 'Life', 'Business', 'Opinion']) {
        const a = util.el('a', 'ref-navlink', n, item);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      util.el('span', 'nl-search', header, '⌕');
      Object.assign(_c, { app, header, logo, n, shell, strokePath, titlebar, town, winControls, workspace });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, placement, titlebar, util, wantFooter, winControls } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools nl-header-tools', titlebar);
      titlebar.insertBefore(headerTools, winControls);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { app, content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
      const { K } = S;
      const paperNav = util.el('nav', 'nl-paper-nav', app);
      for (const item of ['Home', 'News', 'Sport', 'Business', 'Life', 'Opinion', 'What’s On']) {
        const a = util.el('a', 'ref-navlink', paperNav, item);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const search = util.el('div', 'nl-site-search', paperNav);
      util.el('span', '', search, 'Search the site');
      util.el('span', 'nl-search-icon', search, '⌕');
      const body = util.el('div', 'ref-body nl-layout', app);
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      const savedSide = util.el('aside', 'nl-aside', body);
      const more = util.el('section', 'nl-card nl-more', savedSide);
      util.el('h2', '', more, 'More from Northern Ledger');
      const stories = [
        ['COMMUNITY', 'Riverdale community calendar: what is happening this week', '▧'],
        ['BUSINESS', 'City council approves riverside regeneration plan', '▥'],
        ['LIFE', 'Five weekend walks near Riverdale', '◈'],
        ['SPORT', 'United take strong lead in season opener', '◉'],
      ];
      for (const [section, title, art] of stories) {
        const row = util.el('div', 'nl-story', more);
        const copy = util.el('div', 'nl-story-copy', row);
        util.el('small', '', copy, section);
        util.el('div', '', copy, title);
        util.el('span', 'nl-thumb', row, art);
      }
      const stats = util.el('section', 'nl-card nl-stats', savedSide);
      util.el('h2', '', stats, 'Northern Ledger today');
      for (const [icon, value] of [['▤', '12 new articles'], ['▱', '3.4K comments'], ['♧', '56K readers online']]) {
        const line = util.el('div', 'nl-stat', stats);
        util.el('span', 'nl-stat-icon', line, icon);
        util.el('span', '', line, value);
      }
      if (display === 'panel') {
        rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        const panelRight = rng.bool(0.5);
        const panel = util.el('aside', 'ref-panel nl-panel', savedSide);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : 'Your task');
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (panelRight) body.classList.add('ref-panel-right');
      }
      Object.assign(_c, { body, more, paperNav, savedSide, search, stats, stories });
    },
    'frame.stage': (base, S) => function (_c) {
      const { app, body, closeLabel, collide, ctx, decoyBtn, decoys, display, endBtn, label, placement, rng, shell, util, wantFooter } = _c;
      let { submit } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      const hero = util.el('div', 'nl-hero', stage);
      util.el('div', 'nl-hero-label', hero, 'COMMUNITY');
      util.el('div', 'nl-hero-title', hero, 'Food festival returns with more than 80 local vendors');
      util.el('div', 'nl-hero-image', hero);
      if (display === 'toast') {
        const note = util.el('div', 'ref-note nl-toast', app);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot nl-dock', shell);
        _c.foot = foot;
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        const dockItems = [['◆', 'Home'], ['▤', 'My News'], ['♧', 'Saved'], ['♧', 'Notifications'], ['☰', 'More']];
        const dockNav = util.el('nav', 'nl-dock-nav', foot);
        for (const [icon, text] of dockItems) {
          const item = util.el('div', 'nl-dock-item', dockNav);
          util.el('span', 'nl-dock-icon', item, icon);
          util.el('span', '', item, text);
        }
        const tools = util.el('div', 'ref-tools nl-dock-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { hero, stage, submit });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, foot, label, name, placement, shell, util, workspace } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', foot || shell);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const inspector = util.el('aside', 'irix-inspector', workspace);
      const inspectorTitle = util.el('div', 'irix-inspector-title', inspector);
      util.el('span', '', inspectorTitle, 'Page Properties');
      util.el('span', 'irix-collapse', inspectorTitle, '▲');
      const section = (name) => {
        const sec = util.el('section', 'irix-inspector-section', inspector);
        util.el('h3', '', sec, `▾  ${name}`);
        return sec;
      };
      const general = section('General');
      for (const [k, v] of [['Title:', 'The Kettlebrook Courier'], ['Address:', 'https://www.kettlebrookcourier.co.uk/news/local-runner-completes-100-marathons-in-100-days'], ['Type:', 'text/html'], ['Size:', '(not loaded)'], ['Modified:', '(not available)']]) {
        const row = util.el('div', 'irix-property-row', general);
        util.el('span', '', row, k); util.el('span', '', row, v);
      }
      const security = section('Security');
      security.classList.add('irix-security');
      util.el('div', 'irix-security-lock', security);
      util.el('div', 'irix-security-copy', security, 'Connection:  Secure (HTTPS)\nCertificate:  Valid\nIssued to:     kettlebrookcourier.co.uk');
      const media = section('Media (0)');
      const mediaHead = util.el('div', 'irix-media-head', media);
      util.el('span', '', mediaHead, 'Type');
      util.el('span', '', mediaHead, 'Address');
      util.el('span', '', mediaHead, 'Size');
      util.el('div', 'irix-media-empty', media);
      Object.assign(_c, { general, inspector, inspectorTitle, media, mediaHead, section, security, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
    'frame.panel': (base, S) => function (_c) {
    },
    'frame.toast': (base, S) => function (_c) {
    },
    'frame.footer': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-privacy-03',
    template: 'site/base',
    design: { parts },
  });
})();
