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
      base(_c);
      _c.headerTools.classList.add('nl-header-tools');
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
      Object.assign(_c, { hero, stage, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('nl-task-note');
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('nl-panel');
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) note.classList.add('nl-toast');
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('nl-dock');
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
        foot.querySelector('.ref-tools').classList.add('nl-dock-tools');
      }
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-privacy-02',
    template: 'site/base',
    design: { parts },
  });
})();
