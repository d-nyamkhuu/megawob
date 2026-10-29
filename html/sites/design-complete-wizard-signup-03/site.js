// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base) =>
      function (_c) {
        base(_c);
        for (const [key, value] of Object.entries({
          bg: '#fbf9f5',
          panel: '#fbf9f5',
          fg: '#10143e',
          muted: '#555b87',
          line: '#d4d8e5',
          accent: '#ff7068',
        }))
          _c.root.style.setProperty(`--${key}`, value);
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const globe = util.el('div', 'portal-globe', header, '🌍');
        const mast = util.el('div', 'portal-mast', header);
        util.el('strong', '', mast, 'Pebble');
        util.el('span', '', mast, '');
        S.frameBrand(_c, header);
        Object.assign(_c, { globe, header, mast });
      },
    'frame.nav': (base, S) =>
      function (_c) {
        const { content, header, local, nav, rng, util } = _c;
        const { K } = S;
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const tabs = util.el('nav', 'portal-tabs', header);
        for (const item of ['Home', 'Search', 'Directory', 'Mail', 'Community', 'Join Now', 'Help']) {
          const a = util.el('a', item === 'Join Now' ? 'portal-tab active' : 'portal-tab', tabs, item);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        }
        Object.assign(_c, { tabs });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const directory = util.el('aside', 'portal-directory', body);
        for (const [title, links] of [
          [
            'Site Guide',
            [
              'Home',
              'World News',
              'Business',
              'Computers & Internet',
              'Entertainment',
              'Health & Living',
              'Reference',
              'Shopping',
              'Sports',
              'Travel',
              'People & Chat',
            ],
          ],
          [
            'Member Services',
            ['Join Now', 'Member Login', 'Mail', 'Calendar', 'Address Book', 'Photos', 'Discussions', 'Classifieds'],
          ],
          ['Popular Searches', ['maps', 'weather', 'books', 'music', 'flights', 'hotels', 'jobs', 'news']],
        ]) {
          const section = util.el('section', 'portal-section', directory);
          util.el('h3', '', section, title);
          for (const text of links) {
            const a = util.el('a', '', section, text);
            a.href = '#';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: text });
            });
          }
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, directory });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const banner = util.el('div', 'portal-banner', body);
        body.insertBefore(banner, stage);
        const copy = util.el('div', 'portal-banner-copy', banner);
        util.el('b', '', copy, 'A More Connected World');
        util.el('span', '', copy, 'News. People. Information. Opportunities.');
        const titlebar = util.el('div', 'portal-titlebar', body, 'Create Your GlobalNet Account');
        body.insertBefore(titlebar, stage);
        const right = util.el('aside', 'portal-right', body);
        util.el('div', 'pebble-tagline', right, 'Simple tools for big ideas.');
        for (const [icon, title, text] of [
          ['♟', 'Join thousands', 'Over 250,000 creative people use Pebble'],
          ['▤', 'Create and collaborate', 'Build, share and get feedback in one place'],
          ['ϟ', 'Get things done', 'Turn your ideas into progress'],
        ]) {
          const item = util.el('article', 'pebble-stat', right);
          util.el('span', 'pebble-stat-icon', item, icon);
          const copy = util.el('div', 'pebble-stat-copy', item);
          util.el('b', '', copy, title);
          util.el('span', '', copy, text);
        }
        S.frameAlign(_c, stage);
        Object.assign(_c, { banner, copy, right, stage, titlebar });
      },
  };

  env.site({
    name: 'design-complete-wizard-signup-03',
    template: 'site/base',
    design: { parts },
  });
})();
