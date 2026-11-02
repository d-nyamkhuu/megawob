// Design of this site on the click-control/controls template (templates/click-control/controls.js): the page behind the dialog is a file manager (location bar with the opener, file table, preview and details); the dialog has a help button and a name box.
env.widget({
  task: 'click-control',
  site: 'design-click-control-dialog-05',
  name: 'design',
  split: 'train',
  scenarios: ['dialog'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      dialogAfter: () => (ctx, content, opener) => {
        const { util } = ctx;
        const grid = content.querySelector('.calibration-grid');
        grid.hidden = true;
        const FI = {
          dir: '<svg viewBox="0 0 26 24"><defs><linearGradient id="fm-folder" x2="0" y2="1"><stop stop-color="#fff8ca"/><stop offset="1" stop-color="#edc453"/></linearGradient></defs><path d="M2 5q0-2 2-2h7l3 3h10v16H2z" fill="#f2cd66" stroke="#a68536"/><path d="M3 8h22l-2 14H1z" fill="url(#fm-folder)" stroke="#94762d"/><path d="M4 10h18M4 5h6" stroke="#fff"/></svg>',
          doc: '<svg viewBox="0 0 26 28"><defs><linearGradient id="fm-doc" x2=".5" y2="1"><stop stop-color="#f0f7ff"/><stop offset="1" stop-color="#c9e1ff"/></linearGradient><linearGradient id="fm-word" x2="1" y2="1"><stop stop-color="#0864df"/><stop offset="1" stop-color="#0042ab"/></linearGradient></defs><path d="M7 1h13l5 5v21H7z" fill="url(#fm-doc)" stroke="#6494da" stroke-width=".5"/><path d="M20 1v5h5" fill="none" stroke="#6494da" stroke-width=".5"/><path d="M10 11h12M10 14h12M10 17h12M10 20h12M10 23h12" stroke="#8db9ed" stroke-width=".7"/><rect x="2" y="8" width="13" height="14" rx="1" fill="url(#fm-word)"/><text x="8.5" y="18.6" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">W</text></svg>',
          xls: '<svg viewBox="0 0 24 24"><path d="M5 1h10l5 5v17H5z" fill="#fff" stroke="#6a8a6a"/><rect x="1" y="9" width="12" height="10" fill="#1d7a3a"/><path d="M3 11l7 6M10 11l-7 6" stroke="#fff"/></svg>',
          txt: '<svg viewBox="0 0 26 28"><path d="M3 1h16l5 5v21H3z" fill="#f1ffff" stroke="#426f77"/><path d="M19 1v5h5M6 5h10M6 9h15M6 12h15M6 15h15M6 18h15M6 21h15M6 24h15" stroke="#6b9a9e"/></svg>',
          img: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" fill="#dff0f8" stroke="#5a7a5a"/><path d="M2 21l7-9 5 6 3-3 5 6z" fill="#3c9a4a"/><circle cx="16" cy="8" r="2" fill="#e8b020"/></svg>',
        };
        const fm = util.el('div', 'fm', content);
        const lr = util.el('div', 'fm-loc', fm);
        util.el('span', 'fm-lbl', lr, 'Location:');
        const combo = util.el('span', 'fm-combo', lr);
        util.el('i', 'fm-ci', combo).innerHTML = FI.dir;
        util.el('span', '', combo, 'C:\\Users\\Alex\\Documents');
        util.el('b', 'fm-dd', combo, '▾');
        util.el('span', 'fm-btn fm-up', lr, '⇧');
        if (opener) { opener.classList.add('fm-opener'); lr.appendChild(opener); }
        util.el('span', 'fm-lbl fm-slbl', lr, 'Search:');
        util.el('span', 'fm-search', lr);
        util.el('span', 'fm-btn fm-mag', lr).innerHTML = '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6" fill="#dff0ff" stroke="#2a5db0" stroke-width="2"/><path d="M15 15l7 7" stroke="#2a5db0" stroke-width="3"/></svg>';
        const fbody = util.el('div', 'fm-body', fm);
        const tp = util.el('div', 'fm-table', fbody);
        const hr = util.el('div', 'fm-row fm-hd', tp);
        ['Name ▲', 'Size', 'Type', 'Modified'].forEach((h) => util.el('span', 'c', hr, h));
        [['dir', 'Archive', '—', 'File Folder', '4/12/2024 10:03 AM'], ['dir', 'Notes', '—', 'File Folder', '4/10/2024 2:21 PM'],
          ['doc', 'ProjectPlan.doc', '120 KB', 'Microsoft Word Document', '4/9/2024 9:14 AM', 1], ['xls', 'Budget.xlsx', '85 KB', 'Microsoft Excel Worksheet', '4/8/2024 4:37 PM'],
          ['txt', 'Meeting.txt', '4 KB', 'Text Document', '4/6/2024 1:12 PM'], ['doc', 'Ideas.doc', '56 KB', 'Microsoft Word Document', '4/5/2024 11:20 AM'],
          ['img', 'Photo.jpg', '2,341 KB', 'JPEG Image', '4/3/2024 3:08 PM'], ['txt', 'Todo.txt', '1 KB', 'Text Document', '4/1/2024 9:55 AM']].forEach((r) => {
          const row = util.el('div', 'fm-row' + (r[5] ? ' sel' : ''), tp);
          const n = util.el('span', 'c', row);
          util.el('i', 'fm-ci', n).innerHTML = FI[r[0]];
          util.el('span', '', n, r[1]);
          util.el('span', 'c', row, r[2]);
          util.el('span', 'c', row, r[3]);
          util.el('span', 'c', row, r[4]);
        });
        const pv = util.el('div', 'fm-prev', fbody);
        util.el('div', 'fm-pico', pv).innerHTML = FI.doc;
        util.el('b', '', pv, 'ProjectPlan.doc');
        util.el('div', '', pv, 'Microsoft Word Document');
        util.el('div', '', pv, 'Size: 120 KB');
        util.el('div', '', pv, 'Modified: 4/9/2024 9:14 AM');
        const det = util.el('div', 'fm-det', fm);
        [['Name:', 'ProjectPlan.doc'], ['Type:', 'Microsoft Word Document'], ['Size:', '120 KB'], ['Modified:', '4/9/2024 9:14 AM']].forEach((p) => {
          util.el('span', 'k', det, p[0]);
          util.el('span', '', det, p[1]);
        });
      },
      dialogTitleText: (base) => (ctx, title) => {
        base(ctx, title);
        ctx.util.el('span', 'uc-dlg-h', title, '?');
      },
      dialogBody: (base) => (ctx, dbox) => {
        base(ctx, dbox);
        const { util } = ctx;
        const dlgBody = dbox.querySelector('.uc-dlg-b');
        const nameBox = util.el('div', 'dlg-name', dlgBody);
        util.el('span', 'dlg-selx', nameBox, 'ProjectPlan');
        util.el('span', '', nameBox, '.doc');
        dlgBody.querySelector('.dlg-rows').before(nameBox);
      },
    },
  },
});
