// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const globe = util.el('div', 'portal-globe', header, '🌍');
        const mast = util.el('div', 'portal-mast', header);
        util.el('strong', '', mast, 'GlobalNet™');
        util.el('span', '', mast, 'Your Window to the World');
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
    'frame.panel': (base, S) =>
      function (_c) {
        base(_c);
        const panel = _c.body.querySelector('.ref-panel');
        if (panel) _c.directory.prepend(panel);
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
        const search = util.el('section', 'portal-section portal-search', right);
        util.el('h3', '', search, 'Quick Search');
        const sr = util.el('div', 'portal-search-row', search);
        const si = util.el('input', '', sr);
        si.type = 'text';
        const sb = util.el('button', '', sr, 'Search');
        sb.type = 'button';
        util.el('div', 'portal-radios', search, '◉ Web　◯ GlobalNet Directory');
        const tips = util.el('section', 'portal-section portal-tips', right);
        util.el('h3', '', tips, 'Help & Tips');
        for (const [h, t] of [
          [
            'Account Information',
            'Choose a username that’s at least 3 characters long and easy to remember. We’ll use your email address to send important information about your account.',
          ],
          ['Passwords', 'For your security, use at least 6 characters with a mix of letters, numbers and symbols.'],
          [
            'Next Steps',
            'After you create your account, you’ll set your profile information, preferences and review your details before completing registration.',
          ],
        ]) {
          const x = util.el('article', 'portal-tip', tips);
          util.el('b', '', x, h);
          util.el('p', '', x, t);
        }
        S.frameAlign(_c, stage);
        Object.assign(_c, { banner, copy, right, sb, search, si, sr, stage, tips, titlebar });
      },
  };

  env.site({
    name: 'design-complete-wizard-signup-01',
    template: 'site/base',
    design: { parts },
  });
})();
