// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.floating': (base, S) => function (_c) {
      const { body, endBtn, header, label, name, placement, stage, util } = _c;
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
        if (title === 'Storage') group.classList.add('zephyr-storage');
        util.el('strong', '', group, title);
        for (const [index, [name, value]] of rows.entries()) {
          if (title === 'My Account' && index > 0) continue;
          const row = util.el('div', 'zephyr-stat', group);
          if (title === 'My Account' && index === 0) {
            row.classList.add('zephyr-profile');
            util.el('span', 'zephyr-avatar', row);
            const info = util.el('div', 'zephyr-profile-info', row);
            util.el('span', 'zephyr-profile-name', info, name);
            for (const [label] of rows.slice(1)) {
              const link = util.el('a', '', info, label);
              link.href = '#';
              link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'account', label }); });
            }
          } else if (title === 'Quick Links') {
            const link = util.el('a', '', row, name);
            link.href = '#';
            link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'quick-link', label: name }); });
          } else {
            util.el('span', '', row, name); util.el('span', '', row, value);
          }
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
    name: 'design-protect-privacy-visibility-01',
    template: 'site/base',
    design: { parts },
  });
})();
