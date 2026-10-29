// Design on templates/sort-into-bins/base.js: the base site's sort-into-bins widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-desk-04',
  name: 'design',
  split: 'train',
  scenarios: ['desk'],
  template: 'sort-into-bins/base',
  design: {
    parts: {
      'TRASH_SVG': (base, S) => '<svg viewBox="0 0 64 72"><path d="M8 14h48l-5 51H13z" fill="#edf1f3" stroke="#172b44" stroke-width="2"/><path d="M7 11h50v5H7zM24 6h16v5H24z" fill="#b8c5cf" stroke="#172b44" stroke-width="2"/><path d="m29 27 5-7 4 2-2 4 6-1 2 5-10 1 2 4-4 2-5-8zm-10 12 9 1-1 4 5-2 3 4-8 4 3 2-2 4-10-7 1-8zm23 9-4-8 4-2 2 4 2-6 5 1-2 10 4-2 3 4-9 7-7-4 2-4z" fill="#13834d"/></svg>',
      'FILE_SVG': (base, S) => ({ FILE_SVG: (kind, ext) => {
        const art = kind === 'spreadsheet'
          ? '<path d="M11 4h21l10 10v42H11z" fill="#fff" stroke="#172b44" stroke-width="2"/><path d="M32 4v11h10" fill="#e8f3ec" stroke="#172b44" stroke-width="2"/><path d="M4 22h23v27H4z" fill="#16844c"/><path d="M9 28l13 14m0-14L9 42" stroke="#fff" stroke-width="4"/><path d="M29 25h9M29 32h9M29 39h9M29 46h9" stroke="#5eaa79" stroke-width="3"/>'
          : kind === 'document' && String(ext).toLowerCase() !== 'pdf'
            ? '<path d="M8 3h23l10 10v44H8z" fill="#fff" stroke="#172b44" stroke-width="2"/><path d="M31 3v11h10" fill="#dce8f5" stroke="#172b44" stroke-width="2"/><path d="M2 18h25v29H2z" fill="#1762b5"/><path d="M8 24h10q8 0 8 7t-8 7h-4v6H8zm6 6v3h4v-3z" fill="#fff"/>'
            : kind === 'image'
              ? '<path d="M5 5h38v50H5z" fill="#fff" stroke="#172b44" stroke-width="2"/><path d="M9 10h30v39H9z" fill="#55b9ed"/><circle cx="32" cy="19" r="5" fill="#ffcf36"/><path d="m10 43 10-13 8 9 5-6 7 10v6H10z" fill="#27814f"/>'
              : kind === 'presentation'
                ? '<path d="M8 3h23l10 10v44H8z" fill="#fff" stroke="#172b44" stroke-width="2"/><path d="M31 3v11h10" fill="#fce2d5" stroke="#172b44" stroke-width="2"/><path d="M2 18h25v29H2z" fill="#e84d19"/><path d="M8 24h10q8 0 8 7t-8 7h-4v6H8zm6 6v3h4v-3z" fill="#fff"/>'
              : kind === 'pdf' || String(ext).toLowerCase() === 'pdf'
                  ? '<path d="M8 3h23l10 10v44H8z" fill="#fff" stroke="#172b44" stroke-width="2"/><path d="M31 3v11h10" fill="#fce4e2" stroke="#172b44" stroke-width="2"/><path d="M13 40c8-2 12-10 14-20 1 11 4 17 10 21-8-2-13 0-21 6-3 2-5 0-3-2 4-4 12-6 20-5" fill="none" stroke="#d92327" stroke-width="3" stroke-linecap="round"/>'
                  : kind === 'audio'
                    ? '<path d="M8 3h23l10 10v44H8z" fill="#fff" stroke="#172b44" stroke-width="2"/><path d="M31 3v11h10" fill="#f1e3f4" stroke="#172b44" stroke-width="2"/><path d="M28 22v21a6 6 0 1 1-4-6V27l16-4v16a6 6 0 1 1-4-6V20z" fill="#a336b5"/>'
                    : kind === 'video'
                      ? '<path d="M8 3h23l10 10v44H8z" fill="#fff" stroke="#172b44" stroke-width="2"/><path d="M31 3v11h10" fill="#f8e6df" stroke="#172b44" stroke-width="2"/><rect x="13" y="23" width="27" height="22" fill="#e44e37"/><path d="m23 28 11 6-11 6z" fill="#fff"/>'
                      : kind === 'data'
                        ? '<path d="M8 3h23l10 10v44H8z" fill="#fff" stroke="#172b44" stroke-width="2"/><path d="M31 3v11h10" fill="#e1f3f5" stroke="#172b44" stroke-width="2"/><path d="M13 25h24v5H13zm0 9h24v5H13zm0 9h24v5H13z" fill="#13899a"/>'
                        : '<path d="M8 3h23l10 10v44H8z" fill="#fff" stroke="#172b44" stroke-width="2"/><path d="M31 3v11h10" fill="#e8edf2" stroke="#172b44" stroke-width="2"/><path d="M14 25h24M14 33h24M14 41h24M14 49h17" stroke="#75869a" stroke-width="3"/>';
        return `<svg viewBox="0 0 48 60">${art}</svg>`;
      } }.FILE_SVG),
      'renderDesk': (base, S) => function renderDesk(ctx) {
        const { FILE_SVG, FOLDER_SVG, TRASH_SVG, boardPt, els, env, rectPx, toModel, toPx } = S;
        const { rng, util } = ctx;
        S.board.classList.add('bx-desk');
        const folderEls = {};
        const counts = {};
        const fcolor = rng.pick(['#f2b134', '#5c9ded', '#74b9ff', '#f6c453', '#8fa3bf']);
        for (const d of S.spec.folders) {
          const el = util.el('div', 'bx-folder', S.board);
          if (d.x + d.w > 0.82) el.classList.add('edge-right');
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
        const sampledPos = Object.fromEntries(S.spec.files.map((f) => [f.id, ctx.model.pos[f.id].slice()]));
        const desktopSlots = [];
        const visualW = (ctx.size.width <= 1100 ? 164 : 212) / S.geo.W, visualH = 114 / S.geo.H;
        for (const cy of [0.39, 0.62, 0.85]) for (const cx of [0.12, 0.40, 0.68]) {
          const a = { l: cx - visualW / 2, r: cx + visualW / 2, t: cy - visualH / 2, b: cy + visualH / 2 };
          let penalty = 0;
          for (const d of S.spec.folders) {
            const regions = [{ l: d.x, r: d.x + d.w, t: d.y, b: d.y + d.h }];
            if (d.x + d.w > 0.82) regions.push({ l: Math.max(0, d.x - 112 / S.geo.W), r: d.x, t: d.y + 0.3 * d.h, b: d.y + 0.85 * d.h });
            else regions.push({ l: d.x + d.w, r: d.x + d.w + 100 / S.geo.W, t: d.y + 0.3 * d.h, b: d.y + 0.85 * d.h });
            for (const q of regions) penalty += Math.max(0, Math.min(a.r, q.r) - Math.max(a.l, q.l)) * Math.max(0, Math.min(a.b, q.b) - Math.max(a.t, q.t));
          }
          desktopSlots.push({ p: [cx, cy], penalty });
        }
        desktopSlots.sort((a, b) => a.penalty - b.penalty);
        const chosen = desktopSlots.slice(0, S.spec.files.length).sort((a, b) => a.p[1] - b.p[1] || a.p[0] - b.p[0]);
        const initialPos = Object.fromEntries(S.spec.files.map((f, i) => [f.id, chosen[i]?.p || sampledPos[f.id]]));
        for (const f of S.spec.files) {
          const el = util.el('div', 'bx-file', S.board);
          el.dataset.role = 'item';
          el.dataset.kind = f.kind;
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
              const p = JSON.stringify(m.pos[f.id]) === JSON.stringify(sampledPos[f.id]) ? initialPos[f.id] : m.pos[f.id];
              drags[f.id].set(toPx(p));
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
    },
  },
});
