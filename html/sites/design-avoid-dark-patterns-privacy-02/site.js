// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      // 2019 tablet news layout: a masthead, split reading surface and bottom dock.
      const rail = util.el('aside', 'nl-left-rail', document.body);
      const railItems = [['⌂', 'Home'], ['◉', 'Web'], ['✉', 'Mail'], ['▤', 'Newsgroups'], ['▰', 'Bookmarks'], ['◷', 'History']];
      for (const [icon, text] of railItems) {
        const item = util.el('div', `nl-rail-item${text === 'Web' ? ' is-active' : ''}`, rail);
        util.el('span', 'nl-rail-icon', item, icon);
        util.el('span', '', item, text);
      }
      const header = util.el('header', 'ref-task nl-masthead', document.body);
      const logo = util.el('div', 'ref-brand nl-brand', header);
      logo.dataset.role = 'brand';
      util.el('span', 'nl-mark', logo, '▲');
      util.el('span', 'nl-name', logo, 'The Morning Compass');
      const account = util.el('div', 'nl-account-links', header);
      const signIn = util.el('a', '', account, 'Sign in');
      signIn.href = '#';
      signIn.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'account', label: 'Sign in' }); });
      util.el('span', '', account, '|');
      const subscribe = util.el('a', '', account, 'Subscribe');
      subscribe.href = '#';
      subscribe.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'account', label: 'Subscribe' }); });
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      if (display === 'header') util.el('div', 'ref-instruction nl-task-note', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const n = util.el('nav', 'ref-nav nl-topnav', header);
      for (const item of ['News', 'Business', 'Opinion', 'Culture', 'Life', 'Travel', 'Environment', 'Sport']) {
        const a = util.el('a', 'ref-navlink', n, item);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const search = util.el('div', 'nl-search', header);
      const searchField = util.el('span', 'nl-search-field', search, 'Search articles');
      searchField.setAttribute('aria-label', 'Search articles');
      const searchGo = util.el('button', 'nl-search-go', search, 'Go');
      searchGo.type = 'button';
      searchGo.addEventListener('click', () => env.log('decoy', { what: 'search', label: 'Go' }));
      Object.assign(_c, { account, header, logo, n, rail, railItems, search, searchField, searchGo, signIn, subscribe });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools nl-header-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body nl-layout', document.body);
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
      Object.assign(_c, { body, more, savedSide, stats, stories });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, closeLabel, collide, ctx, decoyBtn, decoys, display, endBtn, label, placement, rng, util, wantFooter } = _c;
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
        const note = util.el('div', 'ref-note nl-toast', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot nl-dock', document.body);
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
    name: 'design-avoid-dark-patterns-privacy-02',
    template: 'site/base',
    design: { parts },
  });
})();
