// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        header.dataset.display = display;
        if (display !== 'header' || nav) {
          rng.pick(TITLES); // preserve the seeded frame draw used by sibling episodes
          const title = 'TeamTalk';
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const appIcon = util.svg(
          'svg',
          { viewBox: '0 0 24 24', width: 25, height: 25, class: 'xp-app-icon', 'aria-hidden': 'true' },
          header,
        );
        appIcon.innerHTML =
          '<defs><linearGradient id="xp-app-gloss" x2="0" y2="1"><stop stop-color="#d0f6ff"/><stop offset="1" stop-color="#35a9d0"/></linearGradient></defs><rect x="2" y="2" width="17" height="20" rx="5" fill="url(#xp-app-gloss)" stroke="#356bba"/><path d="M8 5q-4 7 4 12l4-4-3-3-2 2-2-3 2-2z" fill="white" stroke="#2c66a5"/><circle cx="19" cy="16" r="4" fill="#e5f7ff" stroke="#396eae"/>';
        const windows = util.el('div', 'xp-window-buttons', header);
        for (const [symbol, title] of [
          ['−', 'Minimize'],
          ['□', 'Maximize'],
          ['×', 'Close'],
        ]) {
          const b = util.el('button', 'xp-window-button', windows, symbol);
          b.title = title;
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: title }));
        }
        const appNav = util.el('nav', 'xp-navigation', document.body);
        const navArt = {
          Home: '<path d="M5 14L18 3l14 11v20H6z" fill="#fff0a8"/><path d="M2 15L18 1l16 14-3 4L18 7 5 19z" fill="#e9902f"/><path d="M23 4h5v9l-5-4z" fill="#e56329"/><path d="M15 23h7v11h-7z" fill="#58a0ce"/><rect x="9" y="17" width="5" height="6" fill="#9ae0ef"/>',
          Chat: '<path d="M5 5h25q3 0 3 3v17q0 3-3 3H17l-8 7v-7H5q-3 0-3-3V8q0-3 3-3z" fill="url(#xp-nav-shine)"/>',
          Meetings:
            '<circle cx="11" cy="11" r="6" fill="#e9bb7e"/><path d="M1 29V21q9-10 18 0v8z" fill="#72b858"/><circle cx="26" cy="14" r="5" fill="#e9bb7e"/><path d="M19 32v-9q9-8 15 0v9z" fill="#6ca8f0"/><circle cx="18" cy="19" r="5" fill="#e9bb7e"/><path d="M10 35v-7q8-8 16 0v7z" fill="#e89a65"/>',
          Files:
            '<path d="M3 8h11l4 4h15v21H2z" fill="#f7cd59"/><path d="M4 14h31l-5 20H1z" fill="url(#xp-folder-shine)"/>',
          Tasks:
            '<rect x="6" y="5" width="25" height="31" rx="2" fill="#e9edf5" stroke-width="2"/><rect x="14" y="2" width="10" height="7" rx="2" fill="#8095ab"/><path d="M12 19l5 6 10-13" fill="none" stroke="#4f7c58" stroke-width="3"/>',
          Settings:
            '<path d="M15 2h7l1 6 5 2 5-3 4 6-5 4v5l5 3-4 6-6-2-4 3-1 5h-7l-1-6-5-2-5 2-4-6 5-4v-5l-5-3 4-6 6 2 4-3z" fill="#b8d1f5"/><circle cx="18" cy="19" r="6" fill="#edf5ff"/>',
        };
        for (const [symbol, text] of [
          ['🏠', 'Home'],
          ['▰', 'Chat'],
          ['👥', 'Meetings'],
          ['📁', 'Files'],
          ['☑', 'Tasks'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('button', 'xp-nav-item' + (text === 'Chat' ? ' active' : ''), appNav);
          item.type = 'button';
          const icon = util.svg(
            'svg',
            { viewBox: '0 0 38 38', width: 34, height: 34, 'aria-hidden': 'true', class: 'xp-nav-icon' },
            item,
          );
          icon.innerHTML =
            '<defs><linearGradient id="xp-nav-shine" x2="0" y2="1"><stop stop-color="#c2ebff"/><stop offset="1" stop-color="#2885e8"/></linearGradient><linearGradient id="xp-folder-shine" x2="0" y2="1"><stop stop-color="#fff5aa"/><stop offset="1" stop-color="#efbd35"/></linearGradient></defs><g stroke="#466894" stroke-width="1.3" stroke-linejoin="round">' +
            navArt[text] +
            '</g>';
          util.el('span', '', item, text);
          item.addEventListener('click', () => env.log('decoy', { label: text }));
        }
        const project = util.el('section', 'ref-project', document.body);
        const identity = util.el('div', 'ref-project-identity', project);
        util.el('span', 'ref-project-icon', identity, '▤');
        const details = util.el('div', 'ref-project-copy', identity);
        util.el('div', 'ref-project-title', details, 'Project Orion');
        util.el('div', 'ref-project-meta', details, 'Engineering   ·   8 members   ·   Team channel');
        util.el('div', 'ref-project-description', details, 'Design, development and launch of Project Orion.');
        const shortcuts = util.el('div', 'ref-project-shortcuts', project);
        for (const [icon, label, count] of [
          ['▤', 'Files', '12'],
          ['☑', 'Tasks', '7'],
          ['♟', 'People', '8'],
          ['⚙', 'Settings', ''],
        ]) {
          const item = util.el('div', 'ref-project-shortcut', shortcuts);
          util.el('span', 'ref-project-shortcut-icon', item, icon);
          util.el('span', 'ref-project-shortcut-label', item, label);
          if (count) util.el('span', 'ref-project-shortcut-count', item, count);
        }
        Object.assign(_c, {
          appIcon,
          appNav,
          details,
          headerTools,
          identity,
          navArt,
          project,
          shortcuts,
          submit,
          windows,
        });
      },
  };

  env.site({
    name: 'design-use-chat-meeting-03',
    template: 'site/base',
    design: { parts },
  });
})();
