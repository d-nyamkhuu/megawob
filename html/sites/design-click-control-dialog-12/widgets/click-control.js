// Design of this site on click-control/controls: adds the settings workspace and calibration dialog details.
(function () {
  'use strict';

  const DIALOG_ICON = '<svg viewBox="0 0 60 54" aria-hidden="true"><defs><linearGradient id="displaycal-drive" x2="0" y2="1"><stop stop-color="#e4e2dc"/><stop offset=".52" stop-color="#cac9c2"/><stop offset="1" stop-color="#a5a59e"/></linearGradient></defs><g stroke="#686963" stroke-width="1.4" fill="url(#displaycal-drive)"><rect x="3" y="33" width="54" height="18" rx="5"/><rect x="3" y="18" width="54" height="18" rx="5"/><rect x="3" y="3" width="54" height="18" rx="5"/></g><g fill="none" stroke="#eeeae3" stroke-width="1"><path d="M7 18h45M7 33h45M7 48h45M6 8v6M6 23v6M6 38v6"/></g><g fill="#b9bab2" stroke="#81847b" stroke-width=".65"><rect x="11" y="11" width="4" height="3"/><rect x="11" y="26" width="4" height="3"/><rect x="11" y="41" width="4" height="3"/><rect x="46" y="11" width="4" height="2"/><rect x="43" y="26" width="7" height="2"/><rect x="43" y="41" width="7" height="2"/></g></svg>';

  env.widget({
    task: 'click-control',
    site: 'design-click-control-dialog-12',
    name: 'design',
    split: 'train',
    scenarios: ['dialog'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      dlgIcon: DIALOG_ICON,
      dlgName: ['Archive name:', 'my_display_2004-06-12.zip'],
      dlgLocation: '/home/user/profiles',
      dlgReport: 'Include calibration report (PDF)',
      parts: {
        dialogPage: (base) => (ctx, content) => {
          const opener = base(ctx, content);
          const { util, spec } = ctx;
          const page = util.el('div', 'settings-page');
          util.el('h2', '', page, 'Settings');
          util.el('p', 'sub', page, 'Manage application preferences and default options.');
          const srow = util.el('div', 'set-row', page);
          const prefs = util.el('section', 'prefs', srow);
          util.el('h3', '', prefs, 'Preferences');
          const pbody = util.el('div', 'pbody', prefs);
          [
            ['Theme', 'Light'],
            ['Items per page', '25'],
            ['Date format', 'MM/DD/YYYY'],
            ['Notifications', '', 'Enable email notifications'],
            ['Auto-save', '', 'Save changes automatically'],
            ['Default view', 'List'],
          ].forEach((r) => {
            const row = util.el('div', 'prow', pbody);
            util.el('label', '', row, r[0]);
            if (r[2]) {
              const check = util.el('span', 'chk', row);
              util.el('i', 'box', check);
              util.el('span', '', check, r[2]);
            } else {
              const select = util.el('span', 'sel', row);
              util.el('span', '', select, r[1]);
              util.el('i', 'chev', select);
            }
          });
          const about = util.el('aside', 'about', srow);
          util.el('h3', '', about, 'About');
          const abody = util.el('div', 'abody', about);
          util.el('strong', '', abody, 'Document Manager');
          util.el('div', '', abody, 'Version 2.4.1');
          util.el('p', '', abody, 'A simple way to organize, share, and manage your files across your team.');
          util.el('a', 'lnk', abody, 'View release notes');
          util.el('a', 'lnk', abody, 'Get support');
          const grid = content.querySelector('.calibration-grid');
          if (opener) {
            opener.classList.add('opener');
            abody.appendChild(opener);
          } else {
            const start = grid.querySelector('button');
            if (start) start.remove();
          }
          content.insertBefore(page, grid);
          return opener;
        },
        footButton: (base) => (ctx, foot, label, i) => {
          const button = base(ctx, foot, label, i);
          if (label === 'OK') button.classList.add('ok');
          return button;
        },
      },
    },
  });
})();
