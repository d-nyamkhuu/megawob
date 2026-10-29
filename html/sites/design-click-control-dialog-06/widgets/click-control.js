// Design of this site on the click-control/controls template (templates/click-control/controls.js): the page behind the dialog is a file manager (toolbar with the opener, folder tree, file list); the dialog sits at a fixed place with a question icon.
env.widget({
  task: 'click-control',
  site: 'design-click-control-dialog-06',
  name: 'design',
  split: 'train',
  scenarios: ['dialog'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    dlgIcon: '<svg viewBox="0 0 76 80" aria-hidden="true"><defs><linearGradient id="question-fill" x2=".7" y2="1"><stop stop-color="#eefbff"/><stop offset="1" stop-color="#91c8f1"/></linearGradient></defs><path d="M39 3C20 3 5 17 4 35 3 53 16 65 36 66l12 11-1-13c15-4 25-16 25-30C71 16 57 3 39 3Z" fill="#7f96b0" transform="translate(1 1)"/><path d="M38 2C19 2 4 16 3 34 2 52 15 64 35 65l11 10-1-13c15-4 25-16 25-30C69 15 56 2 38 2Z" fill="url(#question-fill)" stroke="#173866" stroke-width="1.8"/><path d="M12 32C12 18 24 9 37 9" fill="none" stroke="#fff" stroke-width="3"/><path d="M27 25c0-16 24-16 25-2 1 9-13 10-13 20v3" fill="none" stroke="#145394" stroke-width="8"/><rect x="34" y="51" width="9" height="9" rx="2" fill="#145394"/></svg>',
    parts: {
      dialogAfter: () => (ctx, content, opener) => {
        const { util } = ctx;
        const grid = content.querySelector('.calibration-grid');
        // File Manager context (decorative): toolbar, folder tree and file list.
        grid.remove();
        const FOLDER = '<svg viewBox="0 0 32 30"><path d="M2 5h10l3 3h14v20H2Z" fill="#f9de79" stroke="#10234b" stroke-width="2"/><path d="M4 11h25v15H4Z" fill="#f1ce4c"/><path d="M4 12h24M4 13v12" fill="none" stroke="#fff9d2" stroke-width="2"/><path d="M29 10v18H3" fill="none" stroke="#a68a2f"/><path d="M3 7h9" stroke="#fff"/></svg>';
        const DOC = '<svg viewBox="0 0 24 28"><path d="M3 1h12l7 7v19H3Z" fill="#fffef8" stroke="#142955" stroke-width="1.7"/><path d="M15 1v8h7" fill="#d9e6f3" stroke="#142955"/><path d="M6 12h12M6 15h12M6 18h12M6 21h12M6 24h12" stroke="#7b91ac" stroke-width="1.2"/></svg>';
        const XLS = '<svg viewBox="0 0 28 30"><path d="M8 2h12l6 6v20H8Z" fill="#fff" stroke="#152e50" stroke-width="2"/><path d="M20 2v7h6M17 12h6M17 16h6M17 20h6M11 24h12" fill="none" stroke="#4c7c60"/><path d="M2 7 16 5v19L2 21Z" fill="#fff" stroke="#235d2b" stroke-width="2"/><path d="m5 10 8 9m0-10-8 9" stroke="#237239" stroke-width="2"/><path d="M1 8h2v13h12" fill="none" stroke="#87b07c"/></svg>';
        const TOOLS = [
          ['New Folder', '<svg viewBox="0 0 40 40"><path d="M7 2h20l9 9v27H7Z" fill="#fffef5" stroke="#14274c" stroke-width="2"/><path d="M27 3v9h9" fill="#c5d5e7" stroke="#14274c" stroke-width="1.5"/><path d="M11 7h10M11 10h10M11 15h20M11 19h20M11 23h20M11 27h20M11 31h20M11 34h20" stroke="#879bb4" stroke-width="1.2"/><path d="M8 3v34" stroke="#fff"/></svg>'],
          ['Open', '<svg viewBox="0 0 40 40"><path d="M3 7h13l4 4h17v25H3Z" fill="#edc84d" stroke="#162447" stroke-width="2"/><path d="M5 14h30v19H5Z" fill="#f6d45a"/><path d="M5 16h29M5 16v16M4 9h11" fill="none" stroke="#fff3ac" stroke-width="2"/><path d="M35 13v21H5" fill="none" stroke="#bb9a33" stroke-width="1.5"/></svg>'],
          ['Copy', '<svg viewBox="0 0 40 40"><path d="M3 2h15l7 7v20H3Z" fill="#fffef5" stroke="#14274c" stroke-width="2"/><path d="M7 8h10M7 12h12M7 16h12M7 20h12M7 24h12" stroke="#8399b7"/><path d="M18 2v8h7" fill="#dae6ef" stroke="#14274c"/><path d="M17 12h13l7 7v19H17Z" fill="#fffef5" stroke="#14274c" stroke-width="2"/><path d="M30 13v7h7" fill="#d6e5f3" stroke="#14274c"/><path d="M21 23h12M21 27h12M21 31h12M21 34h12" stroke="#8399b7" stroke-width="1.4"/></svg>'],
          ['Move', '<svg viewBox="0 0 40 40"><rect x="6" y="5" width="29" height="33" rx="2" fill="#e7cf87" stroke="#162749" stroke-width="2"/><path d="M9 8h23v27H9Z" fill="#fffdf5" stroke="#315679" stroke-width="1.7"/><path d="M14 3h14v7H14Z" fill="#b7cde4" stroke="#162749" stroke-width="2"/><path d="M13 15h15M13 19h15M13 23h15M13 27h15M13 31h15" stroke="#698db7" stroke-width="1.6"/><path d="M8 8v27" stroke="#fff"/></svg>'],
          ['Delete', '<svg viewBox="0 0 40 40"><path d="m8 3 12 13L32 3l5 5-13 12 13 12-5 5-12-13L8 37l-5-5 13-12L3 8Z" fill="#e62e36" stroke="#15244b" stroke-width="1.8"/><path d="m7 5 13 14M31 5 19 18M5 32l12-12" fill="none" stroke="#ffabb7" stroke-width="1.4"/></svg>'],
          ['Properties', '<svg viewBox="0 0 40 40"><rect x="4" y="5" width="32" height="30" fill="#fff" stroke="#1b3a78" stroke-width="2.5"/><path d="M10 14h4M18 14h14M10 20h4M18 20h14M10 26h4M18 26h14" stroke="#4a6aa8" stroke-width="3"/></svg>'],
        ];
        const fm = util.el('div', 'fm-body', content);
        const tb = util.el('div', 'fm-tools', fm);
        TOOLS.forEach(([l, ic], i) => {
          if (i === 5) util.el('i', 'fm-sep', tb);
          const t = util.el('span', 'fm-tool', tb);
          t.innerHTML = ic;
          const caption = util.el('em', '', t, l);
          if (i === 0) caption.innerHTML = 'New<br>Folder';
        });
        if (opener) { opener.classList.add('fm-opener'); tb.appendChild(opener); }
        const fmMain = util.el('div', 'fm-main', fm);
        const tree = util.el('div', 'fm-tree', fmMain);
        ['My Files', 'Documents', 'Pictures', 'Music', 'Projects', 'Archive'].forEach((n, i) => {
          const r = util.el('div', i === 0 ? 'on' : '', tree);
          r.insertAdjacentHTML('afterbegin', FOLDER);
          util.el('span', '', r, n);
        });
        const list = util.el('div', 'fm-list', fmMain);
        const hd = util.el('div', 'fm-row hd', list);
        ['Name', 'Size', 'Type', 'Date Modified'].forEach((h) => util.el('span', '', hd, h));
        [[FOLDER, 'Budget', '--', 'File Folder', '4/12/2005 10:24 AM'], [FOLDER, 'Plans', '--', 'File Folder', '4/10/2005 2:18 PM'],
          [FOLDER, 'Reports', '--', 'File Folder', '4/9/2005 9:03 AM', 1], [DOC, 'meeting_notes.doc', '24 KB', 'Word Document', '4/8/2005 1:20 PM'],
          [XLS, 'sales.xls', '56 KB', 'Excel Spreadsheet', '4/7/2005 11:06 AM'], [DOC, 'todo.txt', '1 KB', 'Text Document', '4/6/2005 4:15 PM']].forEach((f) => {
          const r = util.el('div', 'fm-row' + (f[5] ? ' sel' : ''), list);
          const n = util.el('span', 'nm', r);
          n.insertAdjacentHTML('afterbegin', f[0]);
          util.el('b', '', n, f[1]);
          util.el('span', '', r, f[2]);
          util.el('span', '', r, f[3]);
          util.el('span', '', r, f[4]);
        });
      },
      dialogWidth: () => (r) => Math.min(r.width * .49, r.width - 10),
      dialogPos: () => (r, bw, bh, rng) => [
        Math.round(Math.min(r.width - bw - 12, r.width * .345 + rng.float(0.1, 0.9) * r.width * .01)),
        Math.round(Math.max(0, Math.min(r.height - bh - r.height * .065, r.height * .565 + rng.float(0.05, 0.8) * r.height * .01))),
      ],
    },
  },
});
