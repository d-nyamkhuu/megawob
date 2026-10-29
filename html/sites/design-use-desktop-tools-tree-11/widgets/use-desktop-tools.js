// Design of this site on the use-desktop-tools/workspace template: a 1-bit desktop: a drive row at the top of the tree and
// labels rasterized on a two-pixel grid.
(function () {
  'use strict';

  // Rasterize the system face on a two-pixel grid at the reference desktop size.
  // The original DOM text and its event target remain in place beneath the ink.
  function bitmapLabel(label) {
    if (!label || label.dataset.bitmap === '1') return;
    const size = parseFloat(getComputedStyle(label).fontSize);
    if (size < 24) return;
    const text = label.textContent;
    const canvas = document.createElement('canvas');
    const ink = canvas.getContext('2d');
    const face = `${size / 2}px Arial, sans-serif`;
    ink.font = face;
    canvas.width = Math.ceil(ink.measureText(text).width) + 1;
    canvas.height = Math.ceil(size * .65);
    ink.font = face;
    ink.fillStyle = '#000';
    ink.textBaseline = 'alphabetic';
    ink.fillText(text, 0, Math.round(size / 2));
    const pixels = ink.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < pixels.data.length; i += 4) pixels.data[i] = pixels.data[i] >= 112 ? 255 : 0;
    ink.putImageData(pixels, 0, 0);
    canvas.style.width = `${canvas.width * 2}px`;
    canvas.style.height = `${canvas.height * 2}px`;
    canvas.setAttribute('aria-hidden', 'true');
    label.dataset.bitmap = '1';
    label.classList.add('bitmap-label');
    label.style.width = `${canvas.width * 2}px`;
    label.append(canvas);
  }

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-tree-11',
    name: 'design',
    split: 'train',
    scenarios: ['tree'],
    template: 'use-desktop-tools/workspace',
    design: {
      explorerTitle: null,
      emptyTitle: 'No file open',
      emptyTitleClass: '',
      emptyClose: null,
      emptyIcon: null,
      emptyHeading: null,
      emptyHint: 'Click a file in the Explorer to open it.',
      rowRange: [21, 27],
      frame: 'plain',
      frameTitle: 'Project Files',
      siteCssLast: true,
      css: "\n.as-app{left:0!important;right:0!important;top:0!important;bottom:0!important;width:auto!important;border:0;border-radius:0;box-shadow:none}.as-top{display:none}.as-body{min-height:0}.as-btn{border-radius:3px;font-size:14px}.as-pane{border-radius:0}.se-main{padding:17px 22px!important;gap:0}.se-col{width:100%;max-width:none}.se-side{display:none}.se-box{border-radius:3px;box-shadow:none;height:39px;padding:0 12px}.se-go{border-radius:3px;height:39px;padding:0 22px}.se-card{border-bottom:1px solid var(--line);padding:8px 8px 4px}.se-card .se-title{font-family:inherit;font-size:19px}.se-pager{justify-content:center}.se-pg{border-radius:2px;width:32px;min-width:32px;height:32px}.se-fav{width:22px;height:22px;border-radius:1px}.se-url{font-size:12px}.se-desc{font-size:14px}.tk-main{padding:18px 22px}.tk-title{font-size:24px}.tk-date{border-radius:0;background:transparent}.tk-row{gap:12px;border-bottom:1px solid var(--line);padding:0 12px}.tk-name{font-size:15px}.tk-price{font-size:18px;width:68px}.tk-buy{width:65px}.tk-when{width:125px}.tk-trigger{border-radius:0;min-width:175px}.fd-wrap.left{flex-direction:row}.fd-cart{width:28%!important;border-left:3px solid var(--fg);border-radius:0;background:var(--panel)}.fd-menu{padding:12px 18px}.fd-card{border-radius:0}.fd-add{border-radius:2px}.fd-order{border-radius:2px}.fd-rname{font-size:22px}.fd-rmeta{font-size:12px}.fd-dialog,.as-dialog{border-radius:4px}.fl-form{border-radius:0}.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-title{height:30px;border-radius:0;background:var(--header,var(--panel));font-size:14px}.at-rail{display:none}.at-body{flex:1;min-height:0}.at-main{min-width:0}.at-pane-h{border-radius:0}.at-explorer{width:46%!important;max-width:none}.at-preview{padding:10px}.at-tree{font-family:inherit}.at-row svg{color:var(--fg)}.at-ed{padding:0!important}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}.at-sheet h2{font-family:inherit}.at-tb{border-radius:0;padding:10px;background:var(--header,var(--panel))}.at-tool{border-radius:3px;font-family:inherit}.at-status{background:var(--panel)}.at-term{border-radius:0;border:0}.at-tscroll{padding:20px;font:15px/1.5 monospace}.at-term-tabs{background:var(--header,var(--panel))}.as-page{inset:0!important;display:flex;justify-content:stretch!important}.as-rail,.as-side{display:none}.as-col{flex:1!important;width:100%!important;border:0}.as-head{height:43px;background:var(--header,var(--panel));font-size:14px}.as-post{padding:13px 18px;gap:14px;border-bottom:1px solid var(--line)}.as-text{font-size:16px;line-height:1.4}.as-av{width:48px;height:48px;border-radius:4px;font-size:17px}.as-acts{max-width:440px;justify-content:flex-start;gap:22px}.as-act{border-radius:3px;height:30px;font-size:14px;padding:0 8px}.as-act svg{width:20px;height:20px}.as-photos{height:100px!important;border-radius:4px}.as-menu{border-radius:3px;min-width:210px}.as-mi{height:35px;font-size:14px}.as-confirm{border-radius:4px}.as-confirm button{border-radius:3px}.as-track{border-radius:0;width:15px;background:var(--line)}.as-thumb{border-radius:0}.as-name{font-size:16px}.as-handle,.as-time{font-size:13px}.as-quote{border-radius:3px}.as-link{border-radius:3px}.as-link.tall .as-link-img{height:65px}.as-post:has(.as-photos){min-height:200px}\n.design-header{background:#fff;color:#000;border:3px solid #000}.design-nav{color:#000;font-weight:700}.task-note{font-size:26px;background:#fff;padding:30px;border-bottom:5px double #000}.at-title{background:repeating-linear-gradient(45deg,#fff 0 1px,#bbb 1px 2px);border:2px solid #000}.at-explorer{width:100%!important;border:0}.at-preview{display:none}.at-row svg{color:#000!important}.at-row{font-size:17px!important}.end-control{background:#fff;color:#000;border:3px solid #000;border-radius:0}.design-footer{border:3px solid #000}",
      chev: (S) => S.svg('<path d="M5 2L13 8 5 14z" fill="black" stroke="none"/>', 16, 'class="chev"'),
      folder: () => '<svg class="ico" viewBox="0 0 20 20"><path d="M2 3h5l2 2h9v11H2z" fill="white" stroke="black" stroke-width="1.3" stroke-linejoin="round"/></svg>',
      file: (name, cls) => `<svg class="${cls}" viewBox="0 0 20 20"><path d="M4 1.5h8l4 4v13H4zM12 1.5v5h4M6.5 9h7M6.5 12h7M6.5 15h7" fill="white" stroke="black" stroke-width="1.3" stroke-linejoin="miter"/></svg>`,
      parts: {
        explorerHead: () => (T) => {
          T.util.el('span', '', T.head, `${T.spec.nodes.length} items, 2.6 MB available`);
        },
        listBuilt: () => (T) => {
          const driveRow = T.util.el('div', 'mac-root');
          driveRow.innerHTML = '<svg class="mac-root-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12L8 13z"/></svg><svg class="mac-root-drive" viewBox="0 0 40 38" aria-hidden="true"><path d="M5 6h30v26H5z" fill="white" stroke="black" stroke-width="3"/><path d="M9 10h22v18H9z"/><path d="M11 16h5l3 2h5l4-2h1v7H11z" fill="white"/></svg>';
          T.util.el('span', 'mac-root-label', driveRow, 'Macintosh HD');
          T.x = { driveRow };
        },
        rowHeight: (base, S) => (T) => {
          const listH = T.list.getBoundingClientRect().height - 24;
          const want = Math.min(T.spec.nodes.length, 17);
          return parseFloat(getComputedStyle(T.list).lineHeight) || Math.round(S.clamp(Math.floor(listH / Math.max(1, want)), 27, 38));
        },
        rowsLead: () => (T) => [T.x.driveRow],
        rowIndent: () => () => 'calc(58 * var(--mac-unit, 1px) + var(--depth) * var(--indent, 48px))',
        rowStyle: () => (T, row, r) => row.style.setProperty('--depth', r.depth),
        loadIndent: () => (T, r, ld) => {
          ld.style.setProperty('--depth', r.depth + 1);
          return 'calc(58 * var(--mac-unit, 1px) + var(--depth) * var(--indent, 48px))';
        },
        listSwapped: () => (T) => {
          bitmapLabel(T.x.driveRow.querySelector('.mac-root-label'));
          for (const row of T.rowEls.values()) bitmapLabel(row.querySelector('.nm'));
        },
      },
    },
  });
})();
