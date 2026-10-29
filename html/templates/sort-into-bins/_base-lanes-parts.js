/* sort-into-bins/_base-lanes-parts: default reference renderer units; S is their live, overridable scope. */
(function () {
  'use strict';
  env.template('sort-into-bins/_base-lanes-parts', () => {
    function ensureStyle(S) {
      if (document.getElementById('ln-style')) return;
      const s = document.createElement('style');
      s.id = 'ln-style';
      s.textContent = S.CSS;
      document.head.append(s);
    }

    function layout(S, ctx) {
      const model = ctx.model;
      const counts = {};
      for (const l of S.lanes) counts[l.id] = [];
      for (const it of S.spec.items) counts[S.laneOf(model, it.id)].push(it.id);
      const key = (id) => { const p = model.pos[id]; return Math.round(p[1] / (S.spec.item.h * 1.15)) * 10 + p[0]; };
      for (const l of S.lanes) {
        const ids = l.id === 'out' ? counts.out : counts[l.id].sort((a, b) => key(a) - key(b));
        for (const id of ids) l.body.append(S.cards[id]);
        l.count.textContent = String(ids.length);
      }
    }

    function laneAt(S, x, y) {
      return S.lanes.find((l) => {
        const r = l.el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      });
    }

    function drop(S, ctx, id, lane) {
      const model = ctx.model;
      if (!lane || S.laneOf(model, id) === lane.id) return;
      const f = S.env.taskDef.helpers;
      const p = lane.id === 'out' ? f.freeOutside(S.spec, model, id) : f.freeSlot(S.spec, model, id, S.spec.containers.find((c) => c.id === lane.id));
      if (!p) return;
      const z = (model.z || S.spec.items.map((x) => x.id)).filter((x) => x !== id);
      ctx.update({ ...model, pos: { ...model.pos, [id]: p.map((v) => Math.round(v * 1000) / 1000) }, z: [...z, id] });
      S.layout(ctx);
    }

    function render(S, ctx) {
      S.ensureStyle();
      const { rng, util, size, content } = ctx;
      S.spec = ctx.spec;
      S.ctxRef = ctx;
      const sideName = { left: 'Left box', right: 'Right box', top: 'Top box', bottom: 'Bottom box' };
      const named = S.spec.containers.map((c) => ({ id: c.id, c, x: c.x, title: c.label || (c.side ? sideName[c.side] : 'Box') }));
      if (S.spec.containers.length > 1 && !S.spec.containers.some((c) => c.label)) {
        // Unlabeled pairs are told apart by position: lanes keep that order (left before right, top before bottom).
        const horiz = S.spec.containers.some((c) => c.side === 'left');
        named.sort((a, b) => (horiz ? a.c.x - b.c.x : a.c.y - b.c.y));
      }
      const extra = { id: 'out', title: rng.pick(['Unsorted', 'Backlog', 'Inbox', 'Outside']) };
      const order = rng.bool(0.7) ? [extra, ...named] : [...named, extra];
      const L = order.length;
      const gap = rng.int(10, 18);
      const laneW = Math.min(250, Math.floor((size.width - 64 - (L - 1) * gap) / L));
      const laneH = Math.min(size.height - 44, rng.int(380, 520));
      const card = Math.max(44, Math.min(60, Math.floor((laneW - 20 - 16) / 3)));
      S.root = util.el('div', 'ln-root', ctx.stage);
      S.root.dataset.role = 'board';
      Object.assign(S.root.style, { gap: gap + 'px', width: L * laneW + (L - 1) * gap + 'px', height: laneH + 'px', margin: `${rng.int(4, 10)}px ${rng.int(6, 24)}px` });
      S.lanes = order.map((l) => {
        const el = util.el('div', 'ln-lane' + (l.id === 'out' ? '' : ' target'), S.root);
        el.dataset.role = 'container';
        el.style.width = laneW + 'px';
        const head = util.el('div', 'ln-head', el);
        head.style.height = '38px';
        const t = util.el('span', '', head);
        const value = (l.title || '').toLowerCase();
        if (l.c && S.spec.rule.kind === 'color' && l.c.label && content.COLORS[value]) util.el('span', 'ln-sw', t).style.background = content.COLORS[value];
        t.append(document.createTextNode(l.title));
        const count = util.el('small', '', head);
        const body = util.el('div', 'ln-body', el);
        return { ...l, el, body, count };
      });
      S.cards = {};
      for (const it of S.spec.items) {
        const el = util.el('div', 'ln-card', S.root);
        el.dataset.role = 'item';
        el.title = S.itemTitle(it);
        Object.assign(el.style, { width: card + 'px', height: card + 'px' });
        el.innerHTML = S.shapeSvg(content, it);
        S.cards[it.id] = el;
        let over = null;
        S.env.ui.track(el, {
          start() { el.classList.add('drag'); },
          move(p) {
            el.style.transform = `translate(${p.dx}px, ${p.dy}px)`;
            const l = S.laneAt(p.x, p.y);
            if (l !== over) {
              if (over) over.el.classList.remove('over');
              if (l) l.el.classList.add('over');
              over = l;
            }
          },
          end(p) {
            el.classList.remove('drag');
            el.style.transform = '';
            if (over) over.el.classList.remove('over');
            over = null;
            S.drop(ctx, it.id, S.laneAt(p.x, p.y));
          },
        }, 'card');
      }
      S.layout(ctx);
      return { anchors: [S.root], sync: () => S.layout(ctx) };
    }
    return { ensureStyle, layout, laneAt, drop, render };
  });
})();
