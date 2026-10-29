// Design on templates/sort-into-bins/base.js: the base site's sort-into-bins widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-desk-02',
  name: 'design',
  split: 'train',
  scenarios: ['desk'],
  template: 'sort-into-bins/base',
  design: {
    parts: {
      'FOLDER_SVG': (base, S) => ({ FOLDER_SVG: (c) => `<svg viewBox="0 0 64 50"><path d="M3 8a4 4 0 0 1 4-4h16l6 6h28a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="${c}"/><path d="M3 16h58v28a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="#ffcc59"/></svg>` }.FOLDER_SVG),
      'FILE_SVG': (base, S) => {
        const { KIND_COLOR } = S;
        return { FILE_SVG: (kind, ext) => {
          const paper = '<path d="M4 4a3 3 0 0 1 3-3h24l13 13v42a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#fff" stroke="#d7d7d7" stroke-width="1.6"/><path d="M31 1v10a3 3 0 0 0 3 3h10" fill="#f1f1f1" stroke="#d7d7d7" stroke-width="1.4"/>';
          let art;
          if (kind === 'spreadsheet' || kind === 'data') art = '<rect x="10" y="25" width="28" height="25" rx="2" fill="#078b51"/><path d="M12 31h24M12 38h24M12 45h24M20 31v19M29 31v19" stroke="#fff" stroke-width="2.5"/>';
          else if (kind === 'text' || kind === 'document') art = '<path d="M11 26h27M11 33h27M11 40h22M11 47h14" stroke="#2672c9" stroke-width="3" stroke-linecap="round"/>';
          else if (kind === 'presentation' || ext.toLowerCase() === 'pdf') art = '<path d="M25 24c-5 2-3 13 2 20 4 6 9 8 10 5 1-3-7-8-13-10-6-2-11-1-11 2 0 3 8 1 13-4 5-5 8-14 5-16-2-2-5 0-6 3" fill="none" stroke="#e21b23" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>';
          else if (kind === 'image') art = '<rect x="9" y="25" width="30" height="25" rx="2" fill="#2474ca"/><circle cx="30" cy="32" r="3.3" fill="#fff"/><path d="M11 47l8-9 5 5 5-6 9 10z" fill="#b9d9f8"/>';
          else art = `<rect x="10" y="27" width="28" height="21" rx="2" fill="${KIND_COLOR[kind] || '#495057'}"/><path d="M14 34h20M14 40h16" stroke="#fff" stroke-width="2"/>`;
          return `<svg viewBox="0 0 48 60">${paper}${art}</svg>`;
        } }.FILE_SVG;
      },
      'renderDesk': (base, S) => function renderDesk(ctx) {
        const { FILE_SVG, FOLDER_SVG, TRASH_SVG, boardPt, els, env, rectPx, toModel, toPx } = S;
        const { rng, util } = ctx;
        S.board.classList.add('bx-desk');
        const folderEls = {};
        const counts = {};
        const fcolor = rng.pick(['#e49a16', '#e49a16', '#e49a16', '#e49a16', '#e49a16']);
        for (const d of S.spec.folders) {
          const el = util.el('div', 'bx-folder', S.board);
          el.dataset.role = 'folder';
          Object.assign(el.style, rectPx(d));
          el.innerHTML = d.trash ? TRASH_SVG : FOLDER_SVG(fcolor);
          if (d.trash) el.querySelector('svg').style.width = '58%';
          util.el('span', '', el, d.label);
          counts[d.id] = util.el('div', 'bx-count', el);
          folderEls[d.id] = el;
          el.addEventListener('click', () => {
            const m = ctx.model;
            ctx.update({ ...m, open: m.open === d.id ? null : d.id });
            draw();
          });
        }
        const W = S.spec.win;
        const win = util.el('div', 'bx-win', S.board);
        Object.assign(win.style, rectPx(W));
        const head = util.el('div', 'bx-win-head', win);
        head.style.height = W.head * S.geo.H + 'px';
        const title = util.el('span', '', head);
        const close = util.el('button', 'bx-win-x', head, '×');
        close.type = 'button';
        close.addEventListener('click', () => {
          ctx.update({ ...ctx.model, open: null });
          draw();
        });
        const empty = util.el('div', 'bx-win-empty', win, 'This folder is empty');

        const files = {};
        const drags = {};
        const fw = S.spec.item.w * S.geo.W;
        const fh = S.spec.item.h * S.geo.H;
        for (const f of S.spec.files) {
          const el = util.el('div', 'bx-file', S.board);
          el.dataset.role = 'item';
          Object.assign(el.style, { width: fw + 'px', height: fh + 'px' });
          el.innerHTML = FILE_SVG(f.kind, f.ext);
          util.el('span', '', el, f.name);
          el.title = f.name;
          files[f.id] = el;
          let hover = null;
          const setHover = (id) => {
            if (hover === id) return;
            if (hover && folderEls[hover]) folderEls[hover].classList.remove('over');
            hover = id;
            if (hover && folderEls[hover]) folderEls[hover].classList.add('over');
          };
          let q0;
          let lastPt = null;
          drags[f.id] = env.ui.draggable(el, {
            frame: S.board,
            value: [0, 0],
            bounds: { x0: 0, y0: 0, x1: (1 - S.spec.item.w) * S.geo.W, y1: (1 - S.spec.item.h) * S.geo.H },
            label: 'file',
            onStart(q) { q0 = q; lastPt = null; el.classList.add('dragging'); },
            onInput() {
              const r = el.getBoundingClientRect();
              const b = S.board.getBoundingClientRect();
              // The pointer stays where it pressed relative to the tile; track the tile's center as a proxy.
              lastPt = [(r.left + r.width / 2 - b.left) / S.geo.W, (r.top + r.height / 2 - b.top) / S.geo.H];
              const d = S.spec.folders.find((x) => lastPt[0] >= x.x && lastPt[0] <= x.x + x.w && lastPt[1] >= x.y && lastPt[1] <= x.y + x.h);
              setHover(d ? d.id : null);
            },
            onChange(q) {
              el.classList.remove('dragging');
              setHover(null);
              if (q[0] === q0[0] && q[1] === q0[1]) { draw(); return; }
              const center = toModel(q);
              const m = env.taskDef.helpers.deskDrop(S.spec, ctx.model, f.id, center, pointerPt || center);
              pointerPt = null;
              env.log('drop', { what: 'file', item: f.id, to: m.loc[f.id] });
              ctx.update(m);
              draw();
            },
          });
        }
        // The pointer position at release decides the folder (not the tile's center).
        let pointerPt = null;
        S.board.addEventListener('pointerup', (e) => { pointerPt = boardPt(e); }, true);

        function draw() {
          const m = ctx.model;
          const open = m.open;
          win.style.display = open ? '' : 'none';
          for (const d of S.spec.folders) {
            folderEls[d.id].classList.toggle('open', open === d.id);
            const n = S.spec.files.filter((f) => m.loc[f.id] === d.id).length;
            counts[d.id].textContent = String(n);
            counts[d.id].style.display = n ? '' : 'none';
          }
          if (open) title.textContent = S.spec.folders.find((d) => d.id === open).label;
          const inWin = S.spec.files.filter((f) => open && m.loc[f.id] === open);
          empty.style.display = open && !inWin.length ? '' : 'none';
          const slots = env.taskDef.helpers.winSlots(S.spec, inWin.length);
          for (const f of S.spec.files) {
            const el = files[f.id];
            const k = inWin.indexOf(f);
            if (m.loc[f.id] === 'desk') {
              el.style.display = '';
              drags[f.id].set(toPx(m.pos[f.id]));
            } else if (k >= 0) {
              el.style.display = '';
              drags[f.id].set(toPx(slots[k]));
            } else {
              el.style.display = 'none';
            }
          }
        }
        draw();
        Object.assign(els, { files, folderEls, close, draw });
      },
      'render@0': (base, S) => function render(ctx, mode) {
        const { els, ensureStyle, mirrorView, renderBoxes, renderDesk, renderPalette, renderPane } = S;
        ensureStyle();
        const { rng, util, size } = ctx;
        S.spec = ctx.spec;
        S.ctxRef = ctx;
        S.paneEl = null;
        S.outerEl = null;
        S.thumbEl = null;
        for (const k of Object.keys(els)) delete els[k];
        if (mode.pane) renderPane(ctx);
        else {
          const H = Math.floor(Math.min(size.height - 40, (size.width - 72) / S.spec.aspect) * rng.float(0.86, 1));
          S.geo = { H, W: Math.round(H * S.spec.aspect) };
          if (S.spec.scenario === 'desk') {
            S.geo.H = Math.max(1, Math.floor(size.height - 64));
            S.geo.W = Math.max(1, Math.floor(size.width - 64));
          }
          S.board = util.el('div', 'bx-board', ctx.stage);
          S.board.dataset.role = 'board';
          Object.assign(S.board.style, { width: S.geo.W + 'px', height: S.geo.H + 'px', margin: `${rng.int(4, 12)}px ${rng.int(6, 24)}px` });
        }
        if (S.spec.scenario === 'desk') renderDesk(ctx);
        else if (S.spec.scenario === 'palette') renderPalette(ctx);
        else renderBoxes(ctx, mode);
        if (mode.pane) mirrorView(ctx);
        return { anchors: [S.outerEl || S.board] };
      },
    },
  },
});
