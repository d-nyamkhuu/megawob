/* sort-into-bins/_base-libraries-parts: default reference renderer units; S is their live, overridable scope. */
(function () {
  'use strict';
  env.template('sort-into-bins/_base-libraries-parts', () => {
    function renderInteract(S, ctx) {
      S.env.util.css('bi-style', S.CSS);
      const I = window.interact;
      if (!I) throw new Error('bins/interact: vendored interact.js is missing');
      const { rng, util, size, spec, content } = ctx;
      const H = Math.floor(Math.min(size.height - 40, (size.width - 72) / spec.aspect) * rng.float(0.86, 1));
      const geo = { H, W: Math.round(H * spec.aspect) };
      const board = util.el('div', 'bi-board', ctx.stage);
      board.dataset.role = 'board';
      const g = rng.int(20, 32);
      Object.assign(board.style, { width: geo.W + 'px', height: geo.H + 'px', margin: `${rng.int(4, 12)}px ${rng.int(6, 24)}px`, backgroundSize: `${g}px ${g}px` });
      const toPx = (p) => [(p[0] - spec.item.w / 2) * geo.W, (p[1] - spec.item.h / 2) * geo.H];
      const toModel = (q) => [q[0] / geo.W + spec.item.w / 2, q[1] / geo.H + spec.item.h / 2];
      const radius = rng.int(2, 10);
      const boxes = {};
      for (const c of spec.containers) {
        const box = util.el('div', 'bi-box', board);
        box.dataset.role = 'container';
        Object.assign(box.style, { left: c.x * geo.W + 'px', top: c.y * geo.H + 'px', width: c.w * geo.W + 'px', height: c.h * geo.H + 'px', borderRadius: radius + 'px' });
        if (c.label) {
          const head = util.el('div', 'bi-label', box);
          head.style.height = c.head * geo.H + 'px';
          const value = c.label.toLowerCase();
          if (spec.rule.kind === 'color' && content.COLORS[value]) util.el('span', 'bi-swatch', head).style.background = content.COLORS[value];
          util.el('span', '', head, c.label);
        }
        boxes[c.id] = box;
      }
      // interact's dropzone rule: the pointer over the box, the item's centre inside it, or a fraction of its area.
      const overlap = rng.pick(['pointer', 'center', 0.5, 0.75]);
      for (const c of spec.containers) {
        I(boxes[c.id]).dropzone({
          accept: '.bi-item', overlap,
          ondropactivate: () => boxes[c.id].classList.add('drop-active'),
          ondropdeactivate: () => boxes[c.id].classList.remove('drop-active', 'drop-target'),
          ondragenter: () => boxes[c.id].classList.add('drop-target'),
          ondragleave: () => boxes[c.id].classList.remove('drop-target'),
        });
      }
      const px = spec.item.w * geo.W;
      const z = ctx.model.z || spec.items.map((it) => it.id);
      const items = {};
      for (const it of spec.items) {
        const el = util.el('div', 'bi-item', board);
        el.dataset.role = 'item';
        el.title = S.itemTitle(it);
        const q = toPx(ctx.model.pos[it.id]);
        Object.assign(el.style, { width: px + 'px', height: px + 'px', zIndex: String(10 + z.indexOf(it.id)), left: q[0] + 'px', top: q[1] + 'px' });
        el.innerHTML = S.shapeSvg(content, it);
        items[it.id] = el;
      }
      let zTop = 10 + z.length;
      const finish = (id, p) => {
        const pos = S.env.taskDef.helpers.snapDrop(spec, ctx.model, id, S.round3(p));
        for (const o of spec.items) {
          const q = toPx(pos[o.id]);
          items[o.id].style.left = q[0] + 'px';
          items[o.id].style.top = q[1] + 'px';
        }
        const zz = (ctx.model.z || spec.items.map((x) => x.id)).filter((x) => x !== id);
        ctx.update({ ...ctx.model, pos, z: [...zz, id] });
      };
      const cell = rng.pick([0, 0, 4, 6]);
      for (const it of spec.items) {
        const el = items[it.id];
        const id = it.id;
        let x = 0;
        let y = 0;
        let p0 = null;
        const modifiers = [I.modifiers.restrictRect({ restriction: board, endOnly: false })];
        // A coarse grid snap on the pointer (relative to where the item was grabbed), applied while dragging.
        if (cell) modifiers.push(I.modifiers.snap({ targets: [I.snappers.grid({ x: cell, y: cell })], relativePoints: [{ x: 0, y: 0 }] }));
        I(el).draggable({
          inertia: false,
          modifiers,
          listeners: {
            start() {
              x = parseFloat(el.style.left);
              y = parseFloat(el.style.top);
              p0 = ctx.model.pos[id].slice();
              el.style.zIndex = ++zTop;
              el.classList.add('dragging');
            },
            move(e) {
              x += e.dx;
              y += e.dy;
              el.style.left = x + 'px';
              el.style.top = y + 'px';
            },
            end() {
              el.classList.remove('dragging');
              const q0 = toPx(p0);
              const moved = Math.abs(x - q0[0]) > 0.5 || Math.abs(y - q0[1]) > 0.5;
              finish(id, moved ? toModel([x, y]) : p0);
            },
          },
        });
      }
      S.ia = { board, geo, items, ctx };
      return { anchors: [board] };
    }

    function renderDragula(S, ctx) {
      S.env.util.css('bi-style', S.CSS);
      if (!window.dragula) throw new Error('bins/dragula: vendored dragula is missing');
      if (S.gl && S.gl.drake) { S.gl.drake.destroy(); S.gl.drake = null; }
      const { rng, util, size, spec, content } = ctx;
      const sideName = { left: 'Left box', right: 'Right box', top: 'Top box', bottom: 'Bottom box' };
      const named = spec.containers.map((c) => ({ id: c.id, c, title: c.label || (c.side ? sideName[c.side] : 'Box') }));
      if (spec.containers.length > 1 && !spec.containers.some((c) => c.label)) {
        const horiz = spec.containers.some((c) => c.side === 'left');
        named.sort((a, b) => (horiz ? a.c.x - b.c.x : a.c.y - b.c.y));
      }
      const extra = { id: 'out', title: rng.pick(['Unsorted', 'Backlog', 'Inbox', 'Outside']) };
      const order = rng.bool(0.5) ? [extra, ...named] : [...named, extra];
      const L = order.length;
      const gap = rng.int(10, 18);
      const laneW = Math.min(250, Math.floor((size.width - 64 - (L - 1) * gap) / L));
      const laneH = Math.min(size.height - 44, rng.int(380, 520));
      const card = Math.max(44, Math.min(60, Math.floor((laneW - 20 - 16) / 3)));
      const root = util.el('div', 'gl-root', ctx.stage);
      root.dataset.role = 'board';
      Object.assign(root.style, { gap: gap + 'px', width: L * laneW + (L - 1) * gap + 'px', height: laneH + 'px', margin: `${rng.int(4, 10)}px ${rng.int(6, 24)}px` });
      const lanes = order.map((l) => {
        const el = util.el('div', 'gl-lane' + (l.id === 'out' ? '' : ' target'), root);
        el.dataset.role = 'container';
        el.style.width = laneW + 'px';
        const head = util.el('div', 'gl-head', el);
        head.style.height = '38px';
        const t = util.el('span', '', head);
        const value = (l.title || '').toLowerCase();
        if (l.c && spec.rule.kind === 'color' && l.c.label && content.COLORS[value]) util.el('span', 'gl-sw', t).style.background = content.COLORS[value];
        t.append(document.createTextNode(l.title));
        const count = util.el('small', '', head);
        const body = util.el('div', 'gl-body', el);
        body.dataset.lane = l.id;
        return { ...l, el, body, count };
      });
      const cards = {};
      for (const it of spec.items) {
        const el = util.el('div', 'gl-card', root);
        el.dataset.role = 'item';
        el.dataset.id = it.id;
        el.title = S.itemTitle(it);
        Object.assign(el.style, { width: card + 'px', height: card + 'px' });
        el.innerHTML = S.shapeSvg(content, it);
        cards[it.id] = el;
      }
      const laneOf = (model, id) => {
        const w = S.env.taskDef.helpers.where(spec, model.pos[id]);
        return w === 'out' || w === 'partial' ? 'out' : w;
      };
      // Put every card in the lane its position says, in slot order (the extra lane: item order).
      const layout = () => {
        const model = ctx.model;
        const by = {};
        for (const l of lanes) by[l.id] = [];
        for (const it of spec.items) by[laneOf(model, it.id)].push(it.id);
        const key = (id) => { const p = model.pos[id]; return Math.round(p[1] / (spec.item.h * 1.15)) * 10 + p[0]; };
        for (const l of lanes) {
          const ids = l.id === 'out' ? by.out : by[l.id].sort((a, b) => key(a) - key(b));
          for (const id of ids) l.body.append(cards[id]);
          l.count.textContent = String(ids.length);
        }
      };
      const drop = (id, lane) => {
        const model = ctx.model;
        if (!lane || laneOf(model, id) === lane.id) { layout(); return; }
        const f = S.env.taskDef.helpers;
        const p = lane.id === 'out' ? f.freeOutside(spec, model, id) : f.freeSlot(spec, model, id, spec.containers.find((c) => c.id === lane.id));
        if (!p) { layout(); return; }
        const z = (model.z || spec.items.map((x) => x.id)).filter((x) => x !== id);
        ctx.update({ ...model, pos: { ...model.pos, [id]: S.round3(p) }, z: [...z, id] });
        layout();
      };
      const drake = window.dragula(lanes.map((l) => l.body), {
        mirrorContainer: root,
        revertOnSpill: true,
        moves: (el) => el.classList.contains('gl-card'),
      });
      drake.on('cloned', (mirror, orig, type) => { if (type === 'mirror') mirror.removeAttribute('data-role'); });
      drake.on('drop', (el, target) => drop(el.dataset.id, lanes.find((l) => l.body === target)));
      drake.on('dragend', () => layout());
      layout();
      S.gl = { lanes, cards, drake, ctx };
      return { anchors: [root], sync: layout };
    }
    return { renderInteract, renderDragula };
  });
})();
