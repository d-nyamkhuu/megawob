// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.floating': (base, S) => function (_c) {
      const { body, endBtn, header, label, name, placement, stage, util } = _c;
      let { submit } = _c;
      document.body.style.setProperty('--mac-unit', Math.max(.6, Math.min(1, _c.W / 1672)));
      document.body.classList.add(`mac-note-${_c.display}`);
      const menu = util.el('div', 'mac-system-menu', document.body);
      const apple = util.el('span', 'mac-apple', menu);
      apple.innerHTML = '<svg viewBox="0 0 28 32" width="25" height="29" aria-hidden="true"><path d="M16 7C16 3 20 0 24 0c0 4-3 7-8 7ZM14 9C6 3 0 11 2 19c1 7 5 14 10 11 2-1 3-1 5 0 5 3 8-3 10-7-6-3-7-9-1-12-3-5-7-5-12-2Z" fill="black"/></svg>';
      ['File', 'Edit', 'View', 'Message', 'People', 'Window', 'Help'].forEach((item) => util.el('span', 'mac-menu-item', menu, item));
      util.el('span', 'mac-menu-clock', menu, '10:24 AM');
      util.el('span', 'mac-menu-icon', menu, '▤');
      util.el('span', 'mac-menu-help', menu, '?');
      document.body.insertBefore(menu, document.body.firstChild);
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }

      header.classList.add('mac-header');
      document.body.classList.add('mac-desktop');
      const right = util.el('aside', 'mac-contacts', body);
      util.el('div', 'mac-contacts-title', right, 'Contacts');
      const list = util.el('div', 'mac-contact-list', right);
      const names = ['Alex Kim','Brooke Taylor','Casey Nguyen','Dana Roberts','Jamie Lee','Jordan Patel','Morgan Chen','Riley Park','Taylor Brooks','Sam Wilson'];
      names.forEach((name, i) => {
        const row = util.el('div', 'mac-contact', list);
        const status = util.el('span', 'mac-status', row); if ([0,3,7].includes(i)) status.classList.add('online');
        const avatar = util.el('span', 'mac-avatar', row);
        avatar.style.setProperty('background-position', `${(i % 5) * 25}% ${Math.floor(i / 5) * 100}%`, 'important');
        util.el('span', 'mac-contact-name', row, name);
      });
      util.el('span', 'mac-scroll-down', list, '⌄');
      const stageNode = body.querySelector('.ref-stage');
      if (stageNode) body.insertBefore(right, stageNode.nextSibling);
      if (_c.W < 1200) {
        const note = document.querySelector('.ref-panel,.ref-note');
        if (note) { note.classList.add('mac-header-note'); header.appendChild(note); }
      }
      Object.assign(_c, { right, submit });
    },
  };

  env.site({
    name: 'design-protect-privacy-visibility-05',
    template: 'site/base',
    design: { parts },
  });
})();
