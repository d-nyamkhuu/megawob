// Design of this site on the click-control/controls template (templates/click-control/controls.js): the page behind the dialog is a file browser (toolbar with the opener, location bar, icon view); the dialog has a title icon, glossy buttons with icons and a fixed place.
(function () {
  'use strict';
  const FB_ICONS = {
    folder: '<svg viewBox="0 0 78 68"><defs><linearGradient id="fb-folder-back" x2="0" y2="1"><stop stop-color="#ffe9a4"/><stop offset="1" stop-color="#dca746"/></linearGradient><linearGradient id="fb-folder-front" x2=".75" y2="1"><stop stop-color="#ffdf82"/><stop offset="1" stop-color="#dfaa48"/></linearGradient></defs><path d="M4 16V9q0-5 5-5h22l5 6h32q6 0 6 6v44H4z" fill="url(#fb-folder-back)" stroke="#8c5d1d" stroke-width="1.8"/><path d="M6 12h23l5 5h36" fill="none" stroke="#fff4cb" stroke-width="2"/><path d="M7 20h65q4 0 3 5l-3 35q0 4-5 4H7q-4 0-4-4V25q0-5 4-5z" fill="url(#fb-folder-front)" stroke="#85551d" stroke-width="1.8"/><path d="M6 60V25q0-2 3-2h61" fill="none" stroke="#fff1b5" stroke-width="1.8"/></svg>',
    folderS: '<svg viewBox="0 0 30 28"><defs><linearGradient id="small-folder" x2="0" y2="1"><stop stop-color="#ffe7a9"/><stop offset="1" stop-color="#d8a04b"/></linearGradient></defs><path d="M2 8V4h10l3 4h12v16H2z" fill="#f9dfa0" stroke="#8f632b"/><path d="M3 10h24l-2 15H3z" fill="url(#small-folder)" stroke="#8f632b"/><path d="M5 12h19" stroke="#fff3c5"/><circle cx="23" cy="19" r="3" fill="#b6b9ad" stroke="#7f806f" stroke-width=".7"/></svg>',
    doc: '<svg viewBox="0 0 60 76"><defs><linearGradient id="fb-paper" x2=".6" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e0e9f4"/></linearGradient><linearGradient id="fb-fold" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#a8b7c9"/></linearGradient></defs><path d="M3 3h36l17 17v53H3z" fill="url(#fb-paper)" stroke="#505965" stroke-width="1.8" stroke-linejoin="round"/><path d="M39 3v17h17z" fill="url(#fb-fold)" stroke="#505965" stroke-width="1.5"/><path d="M11 18h20M11 27h35M11 34h35M11 41h35M11 48h35M11 55h35M11 62h20" stroke="#90abc3" stroke-width="2.5"/><path d="M6 70V6h30" fill="none" stroke="#fff" stroke-width="1.5"/></svg>',
    img: '<svg viewBox="0 0 78 68"><defs><linearGradient id="photo-sky" x2="0" y2="1"><stop stop-color="#659fcd"/><stop offset="1" stop-color="#dce9df"/></linearGradient><linearGradient id="photo-land" x2="0" y2="1"><stop stop-color="#608343"/><stop offset="1" stop-color="#243b20"/></linearGradient></defs><rect x="2" y="2" width="74" height="64" rx="1" fill="#fafafa" stroke="#777" stroke-width="1.7"/><rect x="8" y="8" width="62" height="52" fill="url(#photo-sky)"/><path d="m46 15 5 7h-9z" fill="#f0cf73"/><path d="m9 47 17-20 12 13 11-18 21 23v15H9z" fill="#96815c"/><path d="m26 27 12 13 11-18 9 9-10-4-7 16-11-3z" fill="#c1aa79"/><path d="M8 48q15-11 30-4t32-2v18H8z" fill="url(#photo-land)"/></svg>',
    sheet: '<svg viewBox="0 0 62 76"><defs><linearGradient id="sheet-green" x2="0" y2="1"><stop stop-color="#8fbd63"/><stop offset="1" stop-color="#4f8c30"/></linearGradient><linearGradient id="sheet-paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e8efec"/></linearGradient></defs><rect x="3" y="3" width="56" height="70" rx="1" fill="url(#sheet-paper)" stroke="#59675e" stroke-width="1.7"/><path d="M3 3h56v15H3z" fill="url(#sheet-green)" stroke="#46632f" stroke-width="1.5"/><path d="M6 5h50" stroke="#cee2ae"/><g fill="#f5fff0"><rect x="8" y="8" width="4" height="5"/><path d="M14 8h3v2h-3zm0 4h7v1h-7zm11-4h3v5h-3zm5 1h4v1h-4zm0 3h4v1h-4z"/></g><g stroke="#9baaa5" stroke-width="1.3" fill="#f3f7f2"><rect x="10" y="24" width="11" height="11"/><rect x="25" y="24" width="13" height="11"/><rect x="42" y="24" width="10" height="11"/><rect x="10" y="39" width="11" height="11"/><rect x="25" y="39" width="13" height="11"/><rect x="42" y="39" width="10" height="11"/><rect x="10" y="54" width="11" height="11"/><rect x="25" y="54" width="13" height="11"/><rect x="42" y="54" width="10" height="11"/></g><path d="M11 25h9v9h-9zm0 15h9v9h-9z" fill="#bbd5a5"/><path d="M12 26h6m-6 3h6m-6 12h6m-6 3h6" stroke="#e3eed9" stroke-width="1"/></svg>',
  };
  env.widget({
    task: 'click-control',
    site: 'design-click-control-dialog-11',
    name: 'design',
    split: 'train',
    scenarios: ['dialog'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      dlgIcon: FB_ICONS.doc,
      parts: {
        dialogAfter: () => (ctx, content, opener) => {
          const { util } = ctx;
          const fb = util.el('div', 'fb', content);
          const tbar = util.el('div', 'fb-tool', fb);
          const TI = {
            back: '<svg viewBox="0 0 40 38"><defs><linearGradient id="back-green" x2="0" y2="1"><stop stop-color="#c2dd92"/><stop offset="1" stop-color="#6fa343"/></linearGradient></defs><path d="M3 19 18 4q2-1 2 1v9h16q2 0 2 2v9q0 2-2 2H20v8q0 2-2 1z" fill="url(#back-green)" stroke="#47692c" stroke-width="1.5"/><path d="m6 19 12-12v9h18" fill="none" stroke="#e2efc3" stroke-width="1.3"/></svg>',
            fwd: '<svg viewBox="0 0 40 38"><defs><linearGradient id="forward-grey" x2="0" y2="1"><stop stop-color="#eeeae1"/><stop offset="1" stop-color="#c4bfb3"/></linearGradient></defs><path d="m37 19-15-15q-2-1-2 1v9H4q-2 0-2 2v9q0 2 2 2h16v8q0 2 2 1z" fill="url(#forward-grey)" stroke="#aaa599" stroke-width="1.5"/></svg>',
            up: '<svg viewBox="0 0 34 40"><defs><linearGradient id="up-gold" x2="0" y2="1"><stop stop-color="#ffdf83"/><stop offset="1" stop-color="#e9a22b"/></linearGradient></defs><path d="M17 2 2 20h10v17h10V20h10z" fill="url(#up-gold)" stroke="#80551a" stroke-width="1.6" stroke-linejoin="round"/><path d="m17 5-11 13h8v17" fill="none" stroke="#ffe9ad" stroke-width="1.4"/></svg>',
            home: '<svg viewBox="0 0 38 40"><path d="M7 19 19 7l12 12v18H7z" fill="#edc981" stroke="#825a2e" stroke-width="1.6"/><path d="M10 19v15h5V22h8v13h5V19L19 9z" fill="#fff2cd"/><path d="M28 8V4h4v10" fill="#b47a3d" stroke="#825a2e"/><path d="m2 21 17-18 17 18-3 3L19 10 5 24z" fill="#db9953" stroke="#7b4a26" stroke-width="1.4" stroke-linejoin="round"/><path d="M15 37V23h8v14" fill="#ac7840" stroke="#7b4a26"/><circle cx="21" cy="29" r="1" fill="#f9df98"/><circle cx="19" cy="16" r="2" fill="#c0d5da" stroke="#917344"/></svg>',
            search: '<svg viewBox="0 0 40 40"><defs><radialGradient id="lens-blue" cx=".35" cy=".25"><stop stop-color="#edfaff"/><stop offset=".65" stop-color="#9fc5e4"/><stop offset="1" stop-color="#7aa8cf"/></radialGradient></defs><path d="m25 25 12 12" stroke="#343940" stroke-width="7" stroke-linecap="round"/><path d="m25 25 11 11" stroke="#8a9baa" stroke-width="3" stroke-linecap="round"/><circle cx="15" cy="15" r="12" fill="#c8d7e4" stroke="#384b60" stroke-width="2"/><circle cx="15" cy="15" r="9" fill="url(#lens-blue)" stroke="#6e97b6"/><path d="M8 15q0-7 7-7" fill="none" stroke="#f9ffff" stroke-width="2" stroke-linecap="round"/></svg>',
          };
          [['back', 'Back', 1], ['fwd', 'Forward', 2], ['up', 'Up', 0], ['home', 'Home', 0], ['search', 'Search', 0]].forEach(([k, l, dd], i) => {
            if (i === 3 || i === 4) util.el('span', 'fb-sep', tbar);
            const t = util.el('span', 'fb-tb' + (dd ? ' h' : '') + (k === 'fwd' ? ' dis' : '') + (dd ? ' dd' : ''), tbar);
            const ic = util.el('span', 'ti', t); ic.innerHTML = TI[k];
            util.el('span', 'tl', t, l);
          });
          if (opener) tbar.appendChild(opener);
          const loc = util.el('div', 'fb-loc', fb);
          util.el('span', 'fb-grip', loc).innerHTML='<svg viewBox="0 0 18 24"><path d="m13 3-9 2 3 6-4 6 10 3z" fill="#777873" stroke="#53554f"/><path d="m10 6-2 5 2 5" fill="none" stroke="#a3a49b"/></svg>';
          util.el('span', 'lk', loc, 'Location:');
          const lp = util.el('span', 'lp', loc);
          const lf = util.el('i', '', lp); lf.innerHTML = FB_ICONS.folderS;
          util.el('span', '', lp, '/home/user/Documents');
          const lv = util.el('span', 'lv', loc);
          util.el('i', '', lv).innerHTML = '<svg viewBox="0 0 30 30"><defs><linearGradient id="icon-view" x2="0" y2="1"><stop stop-color="#8db7d5"/><stop offset="1" stop-color="#3c6797"/></linearGradient></defs><rect x="1" y="1" width="28" height="28" rx="1" fill="url(#icon-view)" stroke="#424d59" stroke-width="1.8"/><path d="M3 3h24" stroke="#c9dce9"/><g fill="#f5f9fc" stroke="#496e97" stroke-width="1"><path d="M5 5h8v8H5zM18 5h7v8h-7zM5 18h8v7H5z"/><path d="M18 18h7v7h-7z" fill="#f3c768"/></g><path d="M7 7h3v4H7zm13 0h3v4h-3z" fill="#cedbe6"/></svg>';
          util.el('span', '', lv, 'View as Icons');
          util.el('b', '', lv);
          const canvas = util.el('div', 'fb-canvas', fb);
          [['folder', 'Letters', '5 items'], ['folder', 'Photos', '12 items'], ['folder', 'Projects', '8 items'], ['doc', 'Report.txt', '', 1],
            ['doc', 'Notes.txt'], ['doc', 'Todo.txt'], ['img', 'Vacation.jpg'], ['sheet', 'Budget.ods'], ['doc', 'Meeting.doc']].forEach(([k, n, s, sel]) => {
            const it = util.el('div', 'fb-it' + (sel ? ' sel' : ''), canvas);
            it.dataset.kind=k;
            util.el('span', 'fi', it).innerHTML = FB_ICONS[k];
            util.el('span', 'fn', it, n);
            if (s) util.el('span', 'fs', it, s);
          });
        },
        dialogTitleText: (base) => (ctx, title) => {
          ctx.util.el('i', 'dlg-title-icon', title).innerHTML = FB_ICONS.folderS;
          base(ctx, title);
        },
        dialogClose: () => (ctx, x) => {
          x.innerHTML = '<svg viewBox="0 0 24 24"><path d="m6 5 12 14M18 5 6 19" stroke="#753519" stroke-width="6" stroke-linecap="round"/><path d="m6 5 12 14M18 5 6 19" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
        },
        dialogBody: (base) => (ctx, dbox) => {
          base(ctx, dbox);
          const dlgBody = dbox.querySelector('.uc-dlg-b');
          ctx.util.el('span', 'dlg-in', dlgBody).innerHTML = '<s>Report.txt</s>';
          dlgBody.querySelector('.dlg-rows').before(dlgBody.lastChild);
        },
        footButton: (base) => (ctx, foot, l, i) => {
          const b = base(ctx, foot, l, i);
          const actionIcon = ctx.util.el('i', 'dlg-action-icon', b);
          actionIcon.innerHTML=/cancel|no|discard/i.test(l)?'<svg viewBox="0 0 32 32"><defs><linearGradient id="uc-cancel" x2="0" y2="1"><stop stop-color="#f99184"/><stop offset="1" stop-color="#bd2525"/></linearGradient></defs><circle cx="16" cy="16" r="14" fill="url(#uc-cancel)" stroke="#6b322d" stroke-width="1.5"/><path d="m10 10 12 12m0-12L10 22" stroke="#792f28" stroke-width="6"/><path d="m10 10 12 12m0-12L10 22" stroke="white" stroke-width="4"/></svg>':'<svg viewBox="0 0 34 32"><defs><linearGradient id="uc-confirm" x2="0" y2="1"><stop stop-color="#b5d58c"/><stop offset="1" stop-color="#649b43"/></linearGradient></defs><path d="m3 16 7-6 8 8L28 3l5 4-15 24z" fill="url(#uc-confirm)" stroke="#466136" stroke-width="1.7" stroke-linejoin="round"/></svg>';
          b.prepend(actionIcon);
          b.dataset.lbl = l.toLowerCase();
          return b;
        },
        dialogWidth: () => (r) => Math.min(Math.round(r.width * 0.39), r.width - 10),
        // Retain the scaffold's two draws; the file browser window uses an anchored dialog layout.
        dialogPlaced: () => (ctx, content, dbox, r, opener) => {
          const bh = dbox.getBoundingClientRect().height || 170;
          dbox.style.left = Math.round(r.width * 0.42) + 'px';
          dbox.style.top = Math.max(0, Math.min(Math.round(r.height * 0.396), r.height - bh - 12)) + 'px';
          return opener;
        },
      },
    },
  });
})();
