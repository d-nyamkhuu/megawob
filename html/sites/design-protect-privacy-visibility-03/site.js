// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      const dock = util.el('nav', 'drift-dock', document.body);
      dock.setAttribute('aria-label', 'Driftwood Social navigation');
      const dockItems = [
        ['Home', '<path d="m2 10 10-8 10 8v10a2 2 0 0 1-2 2h-5v-7H9v7H4a2 2 0 0 1-2-2z"/>'],
        ['Friends', '<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="8" r="3.2"/><path d="M2 20c.3-4 2.8-6 7-6m13 6c-.3-4-2.8-6-7-6M8 20c.2-4 2.2-6 4-6s3.8 2 4 6z"/>'],
        ['Post', '<path d="M4 3h16v18H4z"/><path fill="#762337" d="m6 17 8-8 3 3-8 8-4 1z"/>'],
        ['Profile', '<circle cx="12" cy="7" r="4"/><path d="M4 21c.5-5 3.2-8 8-8s7.5 3 8 8z"/>'],
        ['Settings', '<path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1m0-14.2L17 7M7 17l-2.1 2.1"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'],
      ];
      for (const [item, path] of dockItems) {
        const b = util.el('button', `drift-dock-item${item === 'Profile' ? ' is-current' : ''}`, dock);
        b.type = 'button';
        b.setAttribute('aria-label', item);
        const icon = util.el('span', 'drift-dock-icon', b);
        icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
        util.el('span', 'drift-dock-label', b, item);
        b.addEventListener('click', () => env.log('decoy', { what: 'nav', label: item }));
      }
      Object.assign(_c, { dock, dockItems, submit });
    },
    'frame.floating': (base, S) => function (_c) {
      const { body, dock, endBtn, header, label, name, placement, stage, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }

      // Zephyr Streaming directory frame. Keep the inherited episode controls above
      // intact; these are static navigation and status decorations around the stage.
      header.classList.add('zephyr-header');
      const logo = util.el('div', 'zephyr-logo', header, 'ZEPHYR');
      util.el('span', 'zephyr-logo-sub', logo, 'STREAMING');
      const topNav = util.el('nav', 'zephyr-topnav', header);
      for (const item of ['Home', 'My Channel', 'Upload', 'Browse', 'Channels', 'People', 'Help']) {
        const a = util.el('a', '', topNav, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const search = util.el('div', 'zephyr-search', header);
      util.el('strong', '', search, 'Search Videos');
      const searchRow = util.el('div', 'zephyr-search-row', search);
      const searchInput = util.el('input', '', searchRow);
      searchInput.type = 'text';
      const searchGo = util.el('button', '', searchRow, 'Go');
      searchGo.type = 'button';
      searchGo.addEventListener('click', () => env.log('decoy', { what: 'search' }));
      const left = util.el('aside', 'zephyr-left', body);
      const linkGroup = (title, links) => {
        const group = util.el('section', 'zephyr-group', left);
        util.el('strong', '', group, title);
        for (const item of links) {
          const a = util.el('a', '', group, item); a.href = '#';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      };
      linkGroup('My Channel', ['My Videos (3)', 'Upload a Video', 'Drafts (1)', 'Playlists (0)', 'Channel Settings']);
      linkGroup('Browse', ['Featured', 'Music', 'Sports', 'Movies', 'Games', 'Arts & Culture', 'Home & Hobbies', 'News & Events']);
      linkGroup('People', ['Find People', 'Popular Channels', 'New Channels']);
      const right = util.el('aside', 'zephyr-right', body);
      const summary = (title, rows) => {
        const group = util.el('section', 'zephyr-group', right);
        util.el('strong', '', group, title);
        for (const [name, value] of rows) {
          const row = util.el('div', 'zephyr-stat', group);
          util.el('span', '', row, name); util.el('span', '', row, value);
        }
      };
      summary('My Account', [['riverside88', ''], ['View My Channel', ''], ['Edit Profile', ''], ['Account Settings', '']]);
      summary('Channel Status', [['Total Videos', '3'], ['Drafts', '1'], ['Playlists', '0'], ['Channel Views', '247']]);
      summary('Storage', [['56 MB of 500 MB used', '']]);
      summary('Quick Links', [['Upload a Video', ''], ['Video Guidelines', ''], ['Supported Formats', ''], ['Community Standards', ''], ['Help Center', '']]);
      body.insertBefore(left, stage);
      body.appendChild(right);
      Object.assign(_c, { left, linkGroup, logo, right, search, searchGo, searchInput, searchRow, submit, summary, topNav });
    },
  };

  env.site({
    name: 'design-protect-privacy-visibility-03',
    template: 'site/base',
    design: { parts },
  });
})();
