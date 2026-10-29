// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, endBtn, header, label, placement, stage, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }

        // MyCircle GTK desktop frame: title bar, menu, navigation rail and contextual help.
        document.body.classList.add('mycircle-window');
        const titlebar = util.el('div', 'gtk-titlebar', document.body);
        util.el('span', 'gtk-appicon', titlebar, '⌂');
        util.el('strong', '', titlebar, 'MyCircle - Home');
        const winbuttons = util.el('div', 'gtk-winbuttons', titlebar);
        for (const [label, glyph] of [
          ['Minimize', '−'],
          ['Maximize', '□'],
          ['Close', '×'],
        ]) {
          const b = util.el('button', '', winbuttons, glyph);
          b.type = 'button';
          b.title = label;
        }
        const menubar = util.el('nav', 'gtk-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Go', 'Help']) util.el('span', '', menubar, item);
        header.classList.add('mycircle-toolbar');
        header.querySelector('.ref-brand')?.remove();
        header.querySelector('.ref-nav')?.remove();
        const rail = util.el('nav', 'mycircle-rail', body);
        for (const [icon, label] of [
          ['🏠', 'Home'],
          ['👥', 'Profile'],
          ['✉️', 'Messages'],
          ['🖼️', 'Photos'],
          ['📅', 'Events'],
          ['👥', 'Friends'],
        ]) {
          const a = util.el('a', 'mycircle-rail-item', rail);
          const mark = util.el('span', 'mycircle-rail-icon', a);
          const drawings = {
            Home: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#c6dbea" stroke="#526b7c" stroke-width="2" d="M5 22 24 5l19 17v21H7V22z"/><path fill="#fff" stroke="#526b7c" stroke-width="2" d="M20 29h9v14h-9z"/><path fill="#8db8d7" stroke="#526b7c" stroke-width="2" d="M3 22 24 3l21 19-4 4L24 9 7 26z"/></svg>',
            Profile:
              '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="18" cy="15" r="9" fill="#79b5df" stroke="#315c7e" stroke-width="2"/><circle cx="33" cy="18" r="7" fill="#a5c9e3" stroke="#315c7e" stroke-width="2"/><path d="M3 42c1-11 6-17 15-17s15 6 16 17z" fill="#5795c5" stroke="#315c7e" stroke-width="2"/><path d="M27 29c10-4 17 2 18 13H33" fill="#8ab6d5" stroke="#315c7e" stroke-width="2"/></svg>',
            Messages:
              '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="8" width="40" height="31" rx="2" fill="#e7f1f7" stroke="#48667b" stroke-width="2"/><path d="m5 11 19 16 19-16" fill="none" stroke="#5885a5" stroke-width="3"/><path d="m5 37 13-12m25 12L30 25" fill="none" stroke="#9abbd2" stroke-width="2"/></svg>',
            Photos:
              '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="4" y="5" width="40" height="38" rx="2" fill="#d5e4ed" stroke="#4d687b" stroke-width="2"/><rect x="8" y="9" width="32" height="28" fill="#a8d3ed"/><circle cx="17" cy="16" r="4" fill="#f3d47c"/><path d="m9 34 10-11 6 6 6-10 8 15z" fill="#71a873" stroke="#47744c" stroke-width="1.5"/></svg>',
            Events:
              '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="8" width="36" height="35" rx="3" fill="#fff" stroke="#754b3e" stroke-width="2"/><path d="M6 15h36v8H6z" fill="#d64b3f"/><path d="M15 4v9m18-9v9" stroke="#554b43" stroke-width="3"/><text x="24" y="37" text-anchor="middle" font-size="19" fill="#333">31</text></svg>',
            Friends:
              '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="17" cy="15" r="8" fill="#83b9df" stroke="#315c7e" stroke-width="2"/><circle cx="32" cy="17" r="7" fill="#b3d1e5" stroke="#315c7e" stroke-width="2"/><path d="M2 42c1-10 6-16 15-16s14 6 15 16z" fill="#6ba6d0" stroke="#315c7e" stroke-width="2"/><path d="M26 29c10-4 18 2 19 13H33" fill="#9fc4dd" stroke="#315c7e" stroke-width="2"/></svg>',
          };
          mark.innerHTML = drawings[label];
          util.el('span', '', a, label);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
        }
        const notes = util.el('aside', 'mycircle-notes', body);
        util.el('strong', 'mycircle-note-title', notes, 'Sharing on MyCircle');
        util.el(
          'p',
          '',
          notes,
          'Choose who can see each post. You can share with everyone, only your friends, or keep it just to yourself.',
        );
        util.el('hr', '', notes);
        util.el('strong', '', notes, 'Audience options');
        for (const [icon, title, desc] of [
          ['◉', 'Public', 'Anyone on or off MyCircle can see this.'],
          ['♣', 'Friends Only', 'Only people in your friends list can see this.'],
          ['▣', 'Only Me', 'Only you can see this.'],
        ]) {
          const row = util.el('div', 'mycircle-legend', notes);
          const legendIcon = util.el(
            'span',
            `mycircle-legend-icon mycircle-icon-${title === 'Public' ? 'public' : title === 'Friends Only' ? 'friends' : 'private'}`,
            row,
          );
          const icons = {
            Public:
              '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#6da8d5" stroke="#315e7c" stroke-width="2"/><path d="M4 20h32M20 3c-8 9-8 25 0 34m0-34c8 9 8 25 0 34M8 11h24M8 29h24" fill="none" stroke="#e7f3fb" stroke-width="2"/></svg>',
            'Friends Only':
              '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="14" cy="13" r="7" fill="#8bc0e4" stroke="#315e7c" stroke-width="2"/><circle cx="27" cy="15" r="6" fill="#b6d7eb" stroke="#315e7c" stroke-width="2"/><path d="M2 36c1-10 5-15 12-15s12 5 13 15z" fill="#5d9bc9" stroke="#315e7c" stroke-width="2"/><path d="M23 25c8-4 14 1 15 11H27" fill="#91bad5" stroke="#315e7c" stroke-width="2"/></svg>',
            'Only Me':
              '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="8" y="17" width="24" height="19" rx="3" fill="#e9b847" stroke="#775321" stroke-width="2"/><path d="M13 18v-6a7 7 0 0 1 14 0v6" fill="none" stroke="#775321" stroke-width="3"/><circle cx="20" cy="26" r="2" fill="#704b16"/><path d="M20 28v4" stroke="#704b16" stroke-width="2"/></svg>',
          };
          legendIcon.innerHTML = icons[title];
          const copy = util.el('div', '', row);
          util.el('strong', '', copy, title);
          util.el('span', '', copy, desc);
        }
        util.el('hr', '', notes);
        util.el('strong', '', notes, 'Tips');
        const tips = util.el('ul', '', notes);
        for (const tip of [
          'Think about what personal information to include in a post.',
          'You can always change the audience before posting.',
          'Your profile has audience settings too, so you can control who sees your information.',
        ])
          util.el('li', '', tips, tip);
        body.insertBefore(rail, stage);
        body.insertBefore(notes, stage);
        const menu = document.createElement('div');
        menu.className = 'gtk-titlebar';
        document.body.insertBefore(titlebar, document.body.firstChild);
        document.body.insertBefore(menubar, header);
        Object.assign(_c, { menu, menubar, notes, rail, submit, tips, titlebar, winbuttons });
      },
  };

  env.site({
    name: 'design-protect-privacy-visibility-02',
    template: 'site/base',
    design: { parts },
  });
})();
