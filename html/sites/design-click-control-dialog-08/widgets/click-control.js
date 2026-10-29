// Design of this site on click-control/controls: adds the file browser behind the dialog and its Rename opener.
(function () {
  'use strict';

  const DRIVE_ICON = '<svg viewBox="0 0 60 54" aria-hidden="true"><defs><linearGradient id="displaycal-drive" x2="0" y2="1"><stop stop-color="#e4e2dc"/><stop offset=".52" stop-color="#cac9c2"/><stop offset="1" stop-color="#a5a59e"/></linearGradient></defs><g stroke="#686963" stroke-width="1.4" fill="url(#displaycal-drive)"><rect x="3" y="33" width="54" height="18" rx="5"/><rect x="3" y="18" width="54" height="18" rx="5"/><rect x="3" y="3" width="54" height="18" rx="5"/></g><g fill="none" stroke="#eeeae3" stroke-width="1"><path d="M7 18h45M7 33h45M7 48h45M6 8v6M6 23v6M6 38v6"/></g><g fill="#b9bab2" stroke="#81847b" stroke-width=".65"><rect x="11" y="11" width="4" height="3"/><rect x="11" y="26" width="4" height="3"/><rect x="11" y="41" width="4" height="3"/><rect x="46" y="11" width="4" height="2"/><rect x="43" y="26" width="7" height="2"/><rect x="43" y="41" width="7" height="2"/></g></svg>';
  const FM_ICONS = {
    folder: '<svg viewBox="0 0 28 24"><path d="M1 4a2 2 0 0 1 2-2h7l3 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" fill="#f7b928"/></svg>',
    doc: '<svg viewBox="0 0 28 24"><path d="M6 1h12l5 5v17H6z" fill="#fff" stroke="#2b5fc9" stroke-width="1.6"/><rect x="1" y="7" width="13" height="11" fill="#2b5fc9"/><path d="M3.5 9.5l1.5 6 2-5 2 5 1.5-6" stroke="#fff" stroke-width="1.3" fill="none"/></svg>',
    txt: '<svg viewBox="0 0 28 24"><path d="M6 1h11l5 5v17H6z" fill="#fff" stroke="#777" stroke-width="1.4"/><path d="M9 10h10M9 13h10M9 16h10M9 19h7" stroke="#999"/></svg>',
    xls: '<svg viewBox="0 0 28 24"><path d="M7 1h11l5 5v17H7z" fill="#fff" stroke="#1d8a4a" stroke-width="1.6"/><rect x="1" y="7" width="13" height="11" fill="#1d8a4a"/><path d="M4.5 10l6 5M10.5 10l-6 5" stroke="#fff" stroke-width="1.4"/></svg>',
    ppt: '<svg viewBox="0 0 28 24"><path d="M7 1h11l5 5v17H7z" fill="#fff" stroke="#d24726" stroke-width="1.6"/><rect x="1" y="7" width="13" height="11" fill="#d24726"/><path d="M5 10v6M5 10h3a1.6 1.6 0 0 1 0 3.2H5" stroke="#fff" stroke-width="1.3" fill="none"/></svg>',
  };

  env.widget({
    task: 'click-control',
    site: 'design-click-control-dialog-08',
    name: 'design',
    split: 'train',
    scenarios: ['dialog'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      dlgIcon: DRIVE_ICON,
      dlgName: ['New name:', 'Project Plan.docx'],
      dlgLocation: '/home/user/profiles',
      dlgReport: 'Include calibration report (PDF)',
      parts: {
        dialogBefore: () => (ctx, content) => {
          const { util } = ctx;
          const fm = util.el('div', 'fm', content);
          const head = util.el('div', 'fm-head', fm);
          head.innerHTML = '<svg viewBox="0 0 20 24" width="22" height="26"><path d="M2 1h10l6 6v16H2z" fill="#fff"/><path d="M5 12h10M5 15h10M5 18h10" stroke="#222" stroke-width="1.6"/></svg>';
          util.el('span', 'fm-title', head, 'Documents');
          const search = util.el('span', 'fm-search', head);
          search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/></svg><span>Search files...</span>';
          const columns = util.el('div', 'fm-cols fm-r', fm);
          ['Name ▴', 'Date modified', 'Type', 'Size'].forEach((label) => util.el('span', '', columns, label));
          [
            ['folder', 'Archive', 'Mar 3, 2024  10:15 AM', 'File folder', '—'],
            ['folder', 'Photos', 'Mar 8, 2024  2:21 PM', 'File folder', '—'],
            ['doc', 'Project Plan.docx', 'Mar 12, 2024  9:04 AM', 'Microsoft Word Document', '245 KB', true],
            ['txt', 'Research Notes.txt', 'Mar 10, 2024  4:36 PM', 'Text Document', '12 KB'],
            ['xls', 'Budget.xlsx', 'Mar 6, 2024  1:20 PM', 'Microsoft Excel Worksheet', '88 KB'],
            ['ppt', 'Presentation.pptx', 'Mar 1, 2024  11:09 AM', 'Microsoft PowerPoint Presentation', '1.4 MB'],
          ].forEach(([kind, name, date, type, size, selected]) => {
            const row = util.el('div', 'fm-r fm-row' + (selected ? ' sel' : ''), fm);
            const file = util.el('span', 'fm-name', row);
            file.innerHTML = FM_ICONS[kind];
            util.el('span', '', file, name);
            util.el('span', '', row, date);
            util.el('span', '', row, type);
            util.el('span', '', row, size);
          });
        },
        dialogAfter: () => (ctx, content, opener) => {
          if (!opener) return;
          opener.dataset.opener = 'true';
          const tool = [...document.querySelectorAll('.tool')].find((el) => el.textContent === 'Rename');
          if (tool) {
            tool.querySelector('span').remove();
            opener.classList.add('toolbar-opener');
            tool.appendChild(opener);
          }
        },
        dialogBody: (base) => (ctx, dbox) => {
          base(ctx, dbox);
          const value = dbox.querySelector('.dlg-rows .dv');
          const text = value.textContent;
          value.replaceChildren();
          ctx.util.el('span', '', value, text);
        },
      },
    },
  });
})();
