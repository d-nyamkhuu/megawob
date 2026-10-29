// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-dblrename-02',
  name: 'design',
  split: 'train',
  scenarios: ['dblrename'],
  template: 'use-file-manager/explorer',
  design: {
    panel: '#fff', fg: '#111820', line: '#9aa8b4', accent: '#1268c4', muted: '#4f5d68',
    fontSize: 17, nameFontSize: 17, detailFontSize: 16, controlFont: '17px Arial, Helvetica, sans-serif',
    windowRadius: 0, margin: 0, titleHeight: 0, toolbarHeight: 108, statusHeight: 40, tileGap: 4,
    folderTone: '#f9b915', lightsChance: 0,
    parts: {
      // Consume the template's geometry draws, then fit the full-bleed window to the stage.
      fit: (base, S) => (ctx) => {
        base(ctx);
        S.geo = { left: 0, top: 0, winW: ctx.size.width, winH: ctx.size.height };
      },
      paneSize: (base, S) => (ctx) => {
        base(ctx);
        const treeW = Math.round(S.geo.winW * .272);
        S.geo = { treeW, paneW: S.geo.winW - treeW - 3,
          paneH: S.geo.winH - (ctx.size.height < 500 ? 124 : 166) - 40 };
      },
      sizes: (base, S) => (ctx) => {
        base(ctx);
        S.sizes = { rowH: 42, treeRowH: 36,
          listCols: 'minmax(0, 1.35fr) .68fr .72fr .42fr' };
      },
      group: (base, S) => (model, group) => {
        const box = base(model, group);
        box.classList.add('fm-detail-group');
        box.style.gridTemplateColumns = '';
        box.style.padding = '0';
        return box;
      },
      tile: (base, S) => (model, id, height, iconSize, lines, box) => {
        const tile = base(model, id, 42, 32, 1, box);
        tile._label.style.webkitLineClamp = '';
        return tile;
      },
      body: (base, S) => (ctx) => {
        base(ctx);
        if (S.spec.view !== 'list') {
          const head = ctx.util.el('div', 'fm-detail-head');
          head.textContent = 'Name                         Size                Type                         Date Modified';
          S.els.main.prepend(head);
        }
      },
      css: (base, S) => (ctx) => base(ctx) + `
        .fm-win { box-sizing: border-box; border-radius: 0; box-shadow: none; font-family: Arial, Helvetica, sans-serif; }
        .fm-title { height: 0; padding: 0; border: 0; overflow: hidden; }
        .fm-bar { height: 108px; padding: 8px 22px; gap: 9px; background: linear-gradient(#f8f6ed,#e3e2d5); border-bottom: 2px solid #9ca7ad; }
        .fm-ib { height: 76px; min-width: 78px; padding: 5px 11px; flex-direction: column; gap: 3px; border-radius: 0; color: #111820; font: 19px Arial, Helvetica, sans-serif; }
        .fm-ib:hover { background: #dcecff; border-color: #8fb2d6; }
        .fm-ib svg { width: 42px; height: 42px; }
        .fm-crumbs { position: absolute; left: 132px; right: 14px; top: 114px; z-index: 2; height: 48px; padding: 0 12px; border: 1px solid #aab2b4; border-radius: 0; background: #fff; font-size: 20px; }
        .fm-crumb { max-width: 210px; padding: 4px 9px; font-weight: normal; }
        .fm-sep { color: #111820; font-size: 20px; }
        .fm-body { position: absolute; top: 166px; left: 0; right: 0; bottom: 39px; }
        .fm-tree { padding: 8px 7px; background: #fff; border-right: 2px solid #929da5; overflow: auto; }
        .fm-tr { padding-right: 5px; gap: 5px; font-size: 20px; }
        .fm-tr .chev { width: 22px; height: 22px; border: 1px solid #777; border-radius: 0; }
        .fm-tr svg.fi { width: 31px; height: 29px; }
        .fm-pane { padding: 0; overflow: auto; }
        .fm-detail-head, .fm-lhead { box-sizing: border-box; flex: none; height: 46px; padding: 11px 14px; border-bottom: 1px solid #8da7c1; background: linear-gradient(#d5e7f8,#b5d1ed); color: #111820; font: 20px Arial, Helvetica, sans-serif; white-space: pre; }
        .fm-lhead { padding: 0 14px; }
        .fm-detail-group { display: flex; flex-direction: column; align-items: stretch; gap: 0; }
        .fm-row, .fm-tile { box-sizing: border-box; flex: none; width: 100%; height: 42px; min-height: 42px; padding: 0 14px; gap: 10px; border: 0; border-bottom: 1px solid #e0e3e5; border-radius: 0; color: #111820; font: 20px Arial, Helvetica, sans-serif; }
        .fm-tile { flex-direction: row; align-items: center; justify-content: flex-start; }
        .fm-tile .ic, .fm-row .ic { flex: none; width: 32px; height: 32px; }
        .fm-row .ic svg { width: 32px; height: 32px; }
        .fm-row .nm { gap: 10px; }
        .fm-row .lab { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
        .fm-tile .nm, .fm-pane.compact .fm-tile .nm { display: block; flex: 1; min-width: 0; text-align: left; font: 20px/1.2 Arial, Helvetica, sans-serif; white-space: nowrap; }
        .fm-pane.compact .fm-tile { gap: 10px; padding: 0 14px; }
        .fm-row .dim { color: #111820; font: 19px/1.2 Arial, Helvetica, sans-serif; }
        .fm-ren { flex: 1; min-width: 0; font: 20px/1.2 Arial, Helvetica, sans-serif; border-radius: 0; }
        .fm-status { position: absolute; left: 0; right: 0; bottom: 0; height: 39px; padding: 0 22px; background: linear-gradient(#f0efe5,#deddd2); color: #111820; font-size: 18px; }
        .fm-bar::after { content: '✂  Cut       ▤  Copy       ▢  Paste       ✖  Delete       ↶  Undo       ▤  Details       ▦  Icons       ▤  Views  ⌄'; flex: 1; min-width: 0; height: 74px; display: flex; align-items: center; justify-content: space-around; margin-left: 14px; padding: 0 12px; border-left: 1px solid #9ba5ac; color: #111820; font: 19px Arial, Helvetica, sans-serif; white-space: pre; overflow: hidden; }
        @media (max-width: 1250px) {
          .fm-bar::after { margin-left: 3px; padding: 0 3px; font-size: 12px; letter-spacing: -.04em; }
          .fm-ib { min-width: 49px; padding-left: 4px; padding-right: 4px; font-size: 14px; }
          .fm-ib svg { width: 31px; height: 31px; }
        }
        @media (max-height: 700px) {
          .fm-bar { height: 78px; }
          .fm-ib { height: 62px; }
          .fm-crumbs { top: 82px; height: 38px; }
          .fm-body { top: 124px; }
        }
      `,
    },
    icons: {
      back: '<svg viewBox="0 0 32 32"><path d="M25 6 7 16l18 10V6Z" fill="#36b33b" stroke="#167b25" stroke-width="2"/></svg>',
      up: '<svg viewBox="0 0 32 32"><path d="M16 3 3 16h8v13h10V16h8L16 3Z" fill="#ffc928" stroke="#ad7800" stroke-width="2"/></svg>',
      undo: '<svg viewBox="0 0 32 32"><path d="M11 9H4l8-7v6c10-1 16 5 16 13 0 5-3 9-8 10 3-3 4-6 3-9-1-6-6-10-12-10Z" fill="#287be0" stroke="#1658a5" stroke-width="2"/></svg>',
      trash: '<svg viewBox="0 0 32 32"><path d="M5 7h22M12 4h8M8 9l2 20h12l2-20" fill="#e33b32" stroke="#9e211b" stroke-width="2"/></svg>',
      grid: '<svg viewBox="0 0 32 32"><rect x="4" y="4" width="10" height="10" fill="#fff" stroke="#1470c8" stroke-width="2"/><rect x="18" y="4" width="10" height="10" fill="#fff" stroke="#1470c8" stroke-width="2"/><rect x="4" y="18" width="10" height="10" fill="#fff" stroke="#1470c8" stroke-width="2"/><rect x="18" y="18" width="10" height="10" fill="#fff" stroke="#1470c8" stroke-width="2"/></svg>',
      share: '<svg viewBox="0 0 32 32"><path d="M6 13h8V5h10v8h4L17 3 6 13Zm2 4v12h18V17" fill="#ffcd32" stroke="#b07d00" stroke-width="2"/></svg>',
      chev: '<svg viewBox="0 0 24 24"><path d="m8 4 8 8-8 8" fill="none" stroke="#222" stroke-width="3"/></svg>'
    }
  },
});
