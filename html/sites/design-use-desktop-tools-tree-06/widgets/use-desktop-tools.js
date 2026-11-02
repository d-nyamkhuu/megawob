// Design of this site on the use-desktop-tools/workspace template: a 1991 file manager with Name / Size / Type / Modified
// columns, tree guide lines and a drawn scroll bar.
(function () {
  'use strict';
  const TY = { xlsx: 'Spreadsheet', ods: 'Spreadsheet', csv: 'Spreadsheet', txt: 'Text Document', pdf: 'PDF Document', jpg: 'Image', png: 'Image', gif: 'Image', webp: 'Image', svg: 'Image', heic: 'Image', md: 'Text Document', pptx: 'Presentation', key: 'Presentation', zip: 'Archive', '7z': 'Archive', mp3: 'Audio', wav: 'Audio', m4a: 'Audio', mp4: 'Video', mov: 'Video', py: 'Source Code', js: 'Source Code', html: 'Source Code', css: 'Source Code' };
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-tree-06',
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
      folder: () => '<svg class="ico" viewBox="0 0 24 24"><path d="M2 5h8l3 3h9v17H2z" transform="translate(0 -3)" fill="#6e5e2b"/><path d="M1.5 5h8l3 3h9v15h-20z" fill="#f3d975" stroke="#403a28" stroke-width="1.3"/><path d="M3 21V6.5h6l3 3h8" fill="none" stroke="#fff5c4" stroke-width="1.2"/><path d="M21 9v13H3" fill="none" stroke="#bd9d42"/></svg>',
      file: (name, cls, S) => {
        const m = /\.(tar\.gz|[A-Za-z0-9]+)$/.exec(name);
        const c = S.extColor(name);
        const ext = m ? m[1].toLowerCase() : '';
        let mark = '<path d="M6 10h11M6 13h11M6 16h11M6 19h11" stroke="#999" stroke-width=".8"/>';
        if (['xlsx', 'ods', 'csv'].includes(ext)) mark = '<path d="M8 9h10v12H8zM8 13h10M8 17h10M13 9v12" fill="none" stroke="#397643" stroke-width=".8"/><path d="M2 8h9v12H2z" fill="#397643"/><path d="M4 11l5 6M9 11l-5 6" stroke="#fff" stroke-width="1.4"/>';
        if (ext === 'pdf') mark = '<path d="M10 8c-4 8 6 12 7 9 0-2-9 0-12 3 0-3 9-5 5-12z" fill="none" stroke="#ba302e" stroke-width="1.1"/>';
        if (['png','jpg','gif','webp'].includes(ext)) mark = '<path d="M4 9h15v12H4z" fill="#7cbeda" stroke="#385a7d"/><circle cx="14" cy="12" r="2" fill="#f4df72"/><path d="M5 20l4-6 4 4 3-3 3 5" fill="#386580"/>';
        return `<svg class="${cls}" viewBox="0 0 24 26"><path d="M4 2h11l6 6v16H4z" fill="#eee" stroke="${['xlsx','ods','csv','pdf'].includes(ext) ? c : '#666'}" stroke-width="1.3"/><path d="M15 2v6h6" fill="#fff" stroke="#666" stroke-width="1"/>${mark}</svg>`;
      },
      parts: {
        beforeList: () => (T) => {
          const cols = T.util.el('div', 'at-cols', T.ex);
          for (const c of ['Name', 'Size', 'Type', 'Modified']) T.util.el('span', 'c-' + c.toLowerCase(), cols, c);
          T.x = {};
        },
        treeList: () => (T) => {
          const listWrap = T.x.listWrap = T.util.el('div', 'at-list-wrap', T.ex);
          return T.util.el('div', 'at-tree', listWrap);
        },
        listBuilt: () => (T) => {
          const { util, list } = T;
          const scrollRail = util.el('div', 'at-scroll-rail', T.x.listWrap);
          const scrollUp = util.el('button', 'at-scroll-arrow', scrollRail, '▲');
          scrollUp.type = 'button'; scrollUp.setAttribute('aria-label', 'Scroll up');
          const scrollTrack = util.el('div', 'at-scroll-track', scrollRail);
          const scrollThumb = util.el('div', 'at-scroll-thumb', scrollTrack);
          const scrollDown = util.el('button', 'at-scroll-arrow', scrollRail, '▼');
          scrollDown.type = 'button'; scrollDown.setAttribute('aria-label', 'Scroll down');
          function drawScrollbar() {
            const range = Math.max(0, list.scrollHeight - list.clientHeight);
            const trackH = scrollTrack.clientHeight;
            const thumbH = range ? Math.max(40, trackH * list.clientHeight / list.scrollHeight) : trackH;
            scrollThumb.style.height = `${thumbH}px`;
            scrollThumb.style.top = `${range ? list.scrollTop / range * (trackH - thumbH) : 0}px`;
          }
          scrollUp.addEventListener('click', () => { list.scrollTop -= T.rowH; drawScrollbar(); });
          scrollDown.addEventListener('click', () => { list.scrollTop += T.rowH; drawScrollbar(); });
          scrollTrack.addEventListener('click', (e) => {
            if (e.target === scrollThumb) return;
            list.scrollTop += (e.clientY < scrollThumb.getBoundingClientRect().top ? -1 : 1) * list.clientHeight;
            drawScrollbar();
          });
          let thumbDrag = null;
          scrollThumb.addEventListener('pointerdown', (e) => {
            thumbDrag = { y: e.clientY, top: list.scrollTop };
            scrollThumb.setPointerCapture(e.pointerId); e.preventDefault();
          });
          scrollThumb.addEventListener('pointermove', (e) => {
            if (!thumbDrag) return;
            const travel = scrollTrack.clientHeight - scrollThumb.offsetHeight;
            if (travel > 0) list.scrollTop = thumbDrag.top + (e.clientY - thumbDrag.y) / travel * Math.max(0, list.scrollHeight - list.clientHeight);
            drawScrollbar();
          });
          scrollThumb.addEventListener('pointerup', () => { thumbDrag = null; });
          scrollThumb.addEventListener('pointercancel', () => { thumbDrag = null; });
          list.addEventListener('scroll', drawScrollbar);
          T.x.drawScrollbar = drawScrollbar;
        },
        rowHeight: (base, S) => (T) => Math.round(S.clamp(T.mainR.height * .054, 27, 35)),
        rowIndent: () => (T, r) => `${10 + r.depth * T.rowH}px`,
        rowStyle: () => (T, row, r) => row.style.setProperty('--tree-inset', `${10 + r.depth * T.rowH}px`),
        rowIcons: (base) => (T, row, r, open) => {
          const { util, rowH } = T;
          base(T, row, r, open);
          const indent = rowH;
          const guides = util.el('span', 'at-guides', row);
          for (let d = 1; d <= r.depth; d++) {
            const guide = util.el('i', '', guides);
            guide.style.left = `${18 + (d - 1) * indent}px`;
          }
          if (r.depth) {
            const branch = util.el('i', 'at-branch', guides);
            branch.style.left = `${18 + (r.depth - 1) * indent}px`;
            branch.style.width = `${indent - 5}px`;
          }
        },
        rowBuilt: () => (T, row, r) => {
          if (r.dir) return;
          const { util } = T;
          const ext = (/\.([A-Za-z0-9]+)$/.exec(r.name) || [])[1] || '';
          let hsh = 0;
          for (const ch of r.name) hsh = (hsh * 31 + ch.charCodeAt(0)) % 997;
          util.el('span', 'c-size', row, `${1 + (hsh % 180)} KB`);
          util.el('span', 'c-type', row, TY[ext.toLowerCase()] || 'Document');
          util.el('span', 'c-modified', row, `${['Feb', 'Mar'][hsh % 2]} ${1 + (hsh % 28)}, 1991  ${String(8 + (hsh % 12)).padStart(2, '0')}:${String(hsh % 60).padStart(2, '0')}`);
        },
        listPainted: () => (T) => T.x.drawScrollbar(),
      },
    },
  });
})();
