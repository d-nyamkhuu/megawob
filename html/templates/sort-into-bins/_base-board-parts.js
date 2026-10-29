/* sort-into-bins/_base-board-parts: default reference renderer units; S is their live, overridable scope. */
(function () {
  'use strict';
  env.template('sort-into-bins/_base-board-parts', () => {
    function ensureStyle(S) {
      if (document.getElementById('bx-style')) return;
      const s = document.createElement('style');
      s.id = 'bx-style';
      s.textContent = S.CSS;
      document.head.append(s);
    }

    function renderBoxes(S, ctx, mode) {
      const { rng, util } = ctx;
      if (mode.native && rng.bool(0.5)) S.board.classList.add('reveal');
      if (rng.bool(0.7)) {
        S.board.classList.add('dots');
        const g = rng.int(18, 28);
        S.board.style.backgroundSize = `${g}px ${g}px`;
      }
      const solid = rng.bool(0.35);
      const radius = rng.int(4, 14);
      const boxes = {};
      for (const c of S.spec.containers) {
        const box = util.el('div', 'bx-box' + (solid ? ' solid' : ''), S.board);
        box.dataset.role = 'container';
        Object.assign(box.style, S.rectPx(c), { borderRadius: radius + 'px' });
        if (c.label) {
          const head = util.el('div', 'bx-label', box);
          head.style.height = c.head * S.geo.H + 'px';
          const value = c.label.toLowerCase();
          if (S.spec.rule.kind === 'color' && ctx.content.COLORS[value]) util.el('span', 'bx-swatch', head).style.background = ctx.content.COLORS[value];
          util.el('span', '', head, c.label);
        }
        boxes[c.id] = box;
      }
      const zones = S.env.ui.dropzones({
        zones: boxes,
        label: 'item',
        onEnter: (zone) => boxes[zone].classList.add('over'),
        onLeave: (zone) => boxes[zone].classList.remove('over'),
      });
      const px = S.spec.item.w * S.geo.W;
      const z = ctx.model.z || S.spec.items.map((it) => it.id);
      const items = {};
      for (const it of S.spec.items) {
        const el = util.el('div', 'bx-item', S.board);
        el.dataset.role = 'item';
        el.title = S.itemTitle(it);
        Object.assign(el.style, { width: px + 'px', height: px + 'px', zIndex: String(10 + z.indexOf(it.id)) });
        el.innerHTML = S.shapeSvg(ctx.content, it);
        items[it.id] = el;
      }
      let zTop = 10 + z.length;
      const drags = {};
      // Apply a finished drop: snap (spec.snap), restack, mirror the model.
      const finish = (id, p) => {
        const pos = S.env.taskDef.helpers.snapDrop(S.spec, ctx.model, id, p.map((v) => Math.round(v * 1000) / 1000));
        for (const o of S.spec.items) {
          const q = S.toPx(pos[o.id]);
          if (drags[o.id]) drags[o.id].set(q);
          else { items[o.id].style.left = q[0] + 'px'; items[o.id].style.top = q[1] + 'px'; }
        }
        const zz = (ctx.model.z || S.spec.items.map((x) => x.id)).filter((x) => x !== id);
        ctx.update({ ...ctx.model, pos, z: [...zz, id] });
      };
      if (mode.native) {
        for (const it of S.spec.items) {
          const el = items[it.id];
          const q = S.toPx(ctx.model.pos[it.id]);
          el.classList.add('nat');
          el.style.left = q[0] + 'px';
          el.style.top = q[1] + 'px';
        }
        S.attachNative(ctx, items, boxes, finish);
        Object.assign(S.els, { items });
        return;
      }
      for (const it of S.spec.items) {
        const el = items[it.id];
        const id = it.id;
        let p0;
        let q0;
        drags[id] = S.env.ui.draggable(el, {
          frame: S.board,
          value: S.toPx(ctx.model.pos[id]),
          bounds: { x0: 0, y0: 0, x1: (1 - S.spec.item.w) * S.geo.W, y1: (1 - S.spec.item.h) * S.geo.H },
          label: 'item',
          onStart(q) {
            p0 = ctx.model.pos[id].slice();
            q0 = q;
            el.style.zIndex = ++zTop;
            el.classList.add('dragging');
          },
          onInput() { zones.track(el); },
          onChange(q) {
            el.classList.remove('dragging');
            const p = q[0] === q0[0] && q[1] === q0[1] ? p0 : S.toModel(q);
            zones.drop(el, { item: id, at: p.map((v) => Math.round(v * 1000) / 1000) });
            finish(id, p);
          },
        });
      }
      Object.assign(S.els, { items });
    }

    function attachNative(S, ctx, items, boxes, finish) {
      let drag = null;
      const px = S.spec.item.w * S.geo.W;
      const center = (e) => {
        const r = S.board.getBoundingClientRect();
        const x = Math.max(0, Math.min((1 - S.spec.item.w) * S.geo.W, e.clientX - r.left - drag.gx));
        const y = Math.max(0, Math.min((1 - S.spec.item.h) * S.geo.H, e.clientY - r.top - drag.gy));
        return S.toModel([x, y]);
      };
      const light = (p) => {
        const at = p ? S.env.taskDef.helpers.where(S.spec, p) : null;
        for (const c of S.spec.containers) boxes[c.id].classList.toggle('over', c.id === at);
      };
      const end = () => {
        if (drag) items[drag.id].classList.remove('dragging');
        drag = null;
        S.board.classList.remove('armed');
        light(null);
      };
      for (const it of S.spec.items) {
        const el = items[it.id];
        el.draggable = true;
        el.addEventListener('dragstart', (e) => {
          const r = el.getBoundingClientRect();
          drag = { id: it.id, gx: e.clientX - r.left, gy: e.clientY - r.top };
          e.dataTransfer.setData('text/plain', it.id);
          e.dataTransfer.effectAllowed = 'move';
          el.classList.add('dragging');
          S.board.classList.add('armed');
        });
        el.addEventListener('dragend', end);
      }
      S.board.addEventListener('dragover', (e) => {
        if (!drag) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        light(center(e));
      });
      S.board.addEventListener('drop', (e) => {
        if (!drag) return;
        e.preventDefault();
        const id = drag.id;
        const p = center(e);
        end();
        finish(id, p);
      });
    }

    function renderDesk(S, ctx) {
      const { rng, util } = ctx;
      S.board.classList.add('bx-desk');
      const folderEls = {};
      const counts = {};
      const fcolor = rng.pick(['#f2b134', '#5c9ded', '#74b9ff', '#f6c453', '#8fa3bf']);
      for (const d of S.spec.folders) {
        const el = util.el('div', 'bx-folder', S.board);
        el.dataset.role = 'folder';
        Object.assign(el.style, S.rectPx(d));
        el.innerHTML = d.trash ? S.TRASH_SVG : S.FOLDER_SVG(fcolor);
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
      Object.assign(win.style, S.rectPx(W));
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
        el.innerHTML = S.FILE_SVG(f.kind, f.ext);
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
        drags[f.id] = S.env.ui.draggable(el, {
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
            const center = S.toModel(q);
            const m = S.env.taskDef.helpers.deskDrop(S.spec, ctx.model, f.id, center, pointerPt || center);
            pointerPt = null;
            S.env.log('drop', { what: 'file', item: f.id, to: m.loc[f.id] });
            ctx.update(m);
            draw();
          },
        });
      }
      // The pointer position at release decides the folder (not the tile's center).
      let pointerPt = null;
      S.board.addEventListener('pointerup', (e) => { pointerPt = S.boardPt(e); }, true);

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
        const slots = S.env.taskDef.helpers.winSlots(S.spec, inWin.length);
        for (const f of S.spec.files) {
          const el = files[f.id];
          const k = inWin.indexOf(f);
          if (m.loc[f.id] === 'desk') {
            el.style.display = '';
            drags[f.id].set(S.toPx(m.pos[f.id]));
          } else if (k >= 0) {
            el.style.display = '';
            drags[f.id].set(S.toPx(slots[k]));
          } else {
            el.style.display = 'none';
          }
        }
      }
      draw();
      Object.assign(S.els, { files, folderEls, close, draw });
    }

    function renderPalette(S, ctx) {
      const { rng, util } = ctx;
      if (rng.bool(0.6)) {
        S.board.classList.add('dots');
        S.board.style.backgroundSize = `${rng.int(16, 24)}px ${rng.int(16, 24)}px`;
      }
      const pal = util.el('div', 'bx-pal', S.board);
      Object.assign(pal.style, S.rectPx(S.spec.pal));
      util.el('h4', '', pal, rng.pick(['Shapes', 'Palette', 'Library']));
      const frame = util.el('div', 'bx-frame', S.board);
      Object.assign(frame.style, S.rectPx(S.spec.frame));
      util.el('span', '', frame, rng.pick(['Frame', 'Drop zone', 'Artboard', 'Canvas area']));
      const px = S.spec.item.w * S.geo.W;
      const tpls = [];
      S.spec.templates.forEach((tp, t) => {
        const el = util.el('div', 'bx-tpl', pal.parentNode);
        el.dataset.role = 'template';
        const [cx, cy] = S.env.taskDef.helpers.palSlot(S.spec, t);
        Object.assign(el.style, { left: (cx - S.spec.item.w / 2) * S.geo.W + 'px', top: (cy - S.spec.item.h / 2) * S.geo.H + 'px', width: px + 'px', height: px + 'px' });
        el.innerHTML = S.shapeSvg(ctx.content, tp);
        el.title = `${tp.color} ${tp.shape}`;
        tpls.push(el);
        let ghost = null;
        let g0;
        S.env.ui.track(el, {
          start() {
            ghost = util.el('div', 'bx-ghost', S.board);
            ghost.innerHTML = S.shapeSvg(ctx.content, tp);
            g0 = [(cx - S.spec.item.w / 2) * S.geo.W, (cy - S.spec.item.h / 2) * S.geo.H];
            Object.assign(ghost.style, { width: px + 'px', height: px + 'px', left: g0[0] + 'px', top: g0[1] + 'px' });
          },
          move(p) {
            Object.assign(ghost.style, { left: g0[0] + p.dx + 'px', top: g0[1] + p.dy + 'px' });
          },
          end(p) {
            const center = S.toModel([g0[0] + p.dx, g0[1] + p.dy]);
            ghost.remove();
            ghost = null;
            if (p.dx === 0 && p.dy === 0) return;
            const m = S.env.taskDef.helpers.paletteDrop(S.spec, ctx.model, { template: t }, center);
            ctx.update(m);
            sync();
          },
        }, 'template');
      });

      const placed = {};
      function sync() {
        const m = ctx.model;
        const live = new Set(m.placed.map((p) => p.id));
        for (const id of Object.keys(placed)) if (!live.has(id)) { placed[id].el.remove(); delete placed[id]; }
        for (const p of m.placed) {
          if (!placed[p.id]) {
            const tp = S.spec.templates[p.t];
            const el = util.el('div', 'bx-item', S.board);
            el.dataset.role = 'item';
            el.title = `${tp.color} ${tp.shape}`;
            Object.assign(el.style, { width: px + 'px', height: px + 'px', zIndex: String(10 + Number(p.id.slice(1))) });
            el.innerHTML = S.shapeSvg(ctx.content, tp);
            let q0;
            const h = S.env.ui.draggable(el, {
              frame: S.board,
              value: S.toPx(p.pos),
              bounds: { x0: 0, y0: 0, x1: (1 - S.spec.item.w) * S.geo.W, y1: (1 - S.spec.item.h) * S.geo.H },
              label: 'item',
              onStart(q) { q0 = q; el.classList.add('dragging'); },
              onChange(q) {
                el.classList.remove('dragging');
                if (q[0] === q0[0] && q[1] === q0[1]) return;
                ctx.update(S.env.taskDef.helpers.paletteDrop(S.spec, ctx.model, { item: p.id }, S.toModel(q)));
                sync();
              },
            });
            placed[p.id] = { el, h };
          }
          placed[p.id].h.set(S.toPx(p.pos));
        }
      }
      sync();
      Object.assign(S.els, { tpls, placed, pal, sync });
    }

    function mirrorView(S, ctx) {
      const top = S.paneEl.scrollTop / S.geo.H;
      const view = { top: Math.round(top * 1e4) / 1e4, h: Math.round((S.paneGeo.viewH / S.geo.H) * 1e4) / 1e4, boardH: S.geo.H };
      const old = ctx.model.view;
      const span = S.paneGeo.viewH - S.paneGeo.thumbH;
      S.thumbEl.style.top = (S.paneGeo.max > 0 ? (S.paneEl.scrollTop / S.paneGeo.max) * span : 0) + 'px';
      if (old && old.top === view.top && old.h === view.h) return;
      ctx.update({ ...ctx.model, view });
    }

    function renderPane(S, ctx) {
      const { rng, util, size } = ctx;
      const W = Math.floor((size.width - 72 - 14) * rng.float(0.82, 1));
      const H = Math.round(W / S.spec.aspect);
      const viewH = Math.min(size.height - 44, Math.round(H * S.spec.tall));
      S.geo = { W, H };
      S.paneGeo = { viewH, max: Math.max(0, H - viewH) };
      S.paneGeo.thumbH = Math.max(36, Math.round((viewH * viewH) / H));
      S.outerEl = util.el('div', 'bx-pane', ctx.stage);
      S.outerEl.dataset.role = 'pane';
      Object.assign(S.outerEl.style, { width: W + 14 + 'px', height: viewH + 'px', margin: `${rng.int(4, 10)}px ${rng.int(6, 24)}px` });
      S.paneEl = util.el('div', '', S.outerEl);
      Object.assign(S.paneEl.style, { width: W + 'px', height: viewH + 'px', overflow: 'hidden' });
      S.board = util.el('div', 'bx-board', S.paneEl);
      S.board.dataset.role = 'board';
      Object.assign(S.board.style, { width: W + 'px', height: H + 'px' });
      const bar = util.el('div', 'bx-sbar', S.outerEl);
      S.thumbEl = util.el('div', 'bx-sthumb', bar);
      S.thumbEl.dataset.role = 'scrollbar';
      S.thumbEl.style.height = S.paneGeo.thumbH + 'px';
      S.env.ui.scrollPane(S.paneEl, {
        max: () => S.paneGeo.max,
        page: () => viewH,
        thumb: S.thumbEl,
        track: bar,
        travel: () => viewH - S.paneGeo.thumbH,
        onScroll: () => S.mirrorView(ctx),
        onDrag: (on) => S.thumbEl.classList.toggle('on', on),
      });
    }

    function render(S, ctx, mode) {
      S.ensureStyle();
      const { rng, util, size } = ctx;
      S.spec = ctx.spec;
      S.ctxRef = ctx;
      S.paneEl = null;
      S.outerEl = null;
      S.thumbEl = null;
      for (const k of Object.keys(S.els)) delete S.els[k];
      if (mode.pane) S.renderPane(ctx);
      else {
        const H = Math.floor(Math.min(size.height - 40, (size.width - 72) / S.spec.aspect) * rng.float(0.86, 1));
        S.geo = { H, W: Math.round(H * S.spec.aspect) };
        S.board = util.el('div', 'bx-board', ctx.stage);
        S.board.dataset.role = 'board';
        Object.assign(S.board.style, { width: S.geo.W + 'px', height: S.geo.H + 'px', margin: `${rng.int(4, 12)}px ${rng.int(6, 24)}px` });
      }
      if (S.spec.scenario === 'desk') S.renderDesk(ctx);
      else if (S.spec.scenario === 'palette') S.renderPalette(ctx);
      else S.renderBoxes(ctx, mode);
      if (mode.pane) S.mirrorView(ctx);
      return { anchors: [S.outerEl || S.board] };
    }

    function locate(S, t) {
      const r = S.board.getBoundingClientRect();
      const at = (p) => [r.left + p[0] * S.geo.W, r.top + p[1] * S.geo.H];
      if (t.pane !== undefined) {
        const pr = S.paneEl.getBoundingClientRect();
        return [pr.left + pr.width / 2, pr.top + pr.height / 2];
      }
      if (t.thumb !== undefined) return S.ctxRef.util.center(S.thumbEl);
      if (t.thumbAt !== undefined) {
        const pr = S.paneEl.getBoundingClientRect();
        const t0 = S.thumbEl.getBoundingClientRect();
        const s = Math.max(0, Math.min(S.paneGeo.max, t.thumbAt * S.geo.H));
        return [t0.left + t0.width / 2, pr.top + S.thumbTop(s) + S.paneGeo.thumbH / 2];
      }
      if (t.point !== undefined) return at(t.point);
      if (t.item !== undefined) {
        if (S.els.items) return S.ctxRef.util.center(S.els.items[t.item]);
        if (S.els.files) return S.ctxRef.util.center(S.els.files[t.item]);
        return S.ctxRef.util.center(S.els.placed[t.item].el);
      }
      if (t.folder !== undefined) {
        const d = S.spec.folders.find((x) => x.id === t.folder);
        return at([d.x + d.w / 2, d.y + d.h * 0.4]);
      }
      if (t.close !== undefined) return S.ctxRef.util.center(S.els.close);
      if (t.template !== undefined) return at(S.env.taskDef.helpers.palSlot(S.spec, t.template));
      if (t.trash !== undefined) return at([S.spec.pal.x + S.spec.pal.w / 2, S.spec.pal.y + S.spec.pal.h / 2]);
      throw new Error(`sort-into-bins/boxes cannot locate ${JSON.stringify(t)}`);
    }
    return { ensureStyle, renderBoxes, attachNative, renderDesk, renderPalette, mirrorView, renderPane, render, locate };
  });
})();
