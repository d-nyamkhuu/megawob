// Design on templates/reorder-items/base.js: the base site's reorder-items widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'reorder-items',
  site: 'design-reorder-items-move-05',
  name: 'design',
  split: 'train',
  scenarios: ['move'],
  template: 'reorder-items/base',
  design: {
    parts: {
      'renderOrdered': (base, S) => function renderOrdered(ctx, wrap) {
        const { LOCK_SVG, env, isLocked, mirrorFocus, onOrder, slotPos, tagEl } = S;
        const { rng, util, size } = ctx;
        const n = S.spec.items.length;
        const grid = S.spec.scenario === 'grid';
        const legendW = S.spec.legend ? 190 : 0;
        const availW = size.width - 60 - legendW;
        const availH = size.height - 36;
        S.geo = { cols: S.spec.cols };
        const hasVal = S.spec.items.some((id) => S.spec.labels[id].value);
        const longest = Math.max(...S.spec.items.map((id) => S.spec.labels[id].title.length + (S.spec.labels[id].value || '').length * 0.9 + (S.spec.labels[id].tag ? 10 : 0)));
        if (grid) {
          const rows = Math.ceil(n / S.spec.cols);
          const gap = rng.int(8, 16);
          const maxH = Math.floor((availH - (rows - 1) * gap) / rows);
          const maxW = Math.floor((availW - (S.spec.cols - 1) * gap) / S.spec.cols);
          const wordy = S.spec.rule.kind !== 'number';
          S.geo.h = Math.max(40, rng.int(Math.min(56, maxH), Math.min(hasVal ? 92 : 100, maxH)));
          S.geo.w = Math.min(maxW, wordy ? rng.int(hasVal ? 132 : 112, hasVal ? 170 : 140) : S.geo.h);
          S.geo.pitchX = S.geo.w + gap;
          S.geo.pitchY = S.geo.h + gap;
          S.geo.font = Math.max(13, Math.min(20, Math.floor(S.geo.h * 0.3)));
        } else {
          const gap = rng.int(5, 10);
          S.geo.h = Math.max(26, Math.min(rng.int(40, 56), Math.floor(availH / n) - gap));
          S.geo.pitchX = 0;
          S.geo.pitchY = S.geo.h + gap;
          S.geo.font = Math.max(12, Math.min(17, Math.floor(S.geo.h * 0.38)));
          const want = Math.round(longest * S.geo.font * 0.62 + 110);
          S.geo.w = Math.max(220, Math.min(availW, rng.int(Math.max(260, want), Math.max(280, want + 100)), 640));
        }
        const rows = Math.ceil(n / S.geo.cols);
        S.geo.boardW = (S.geo.cols - 1) * S.geo.pitchX + S.geo.w;
        S.geo.boardH = (rows - 1) * S.geo.pitchY + S.geo.h;
        S.board = util.el('div', 'ro-board', wrap);
        Object.assign(S.board.style, { width: S.geo.boardW + 'px', height: S.geo.boardH + 'px', fontSize: S.geo.font + 'px' });
        S.slotEl = util.el('div', 'ro-slot', S.board);
        Object.assign(S.slotEl.style, { width: S.geo.w + 'px', height: S.geo.h + 'px' });
        const cards = {};
        const showTag = rng.bool(0.5);
        let visualIndex = 0;
        for (const id of ctx.model.order) {
          const lab = S.spec.labels[id];
          const locked = isLocked(S.spec, id);
          const card = util.el('div', 'ro-card' + (grid ? ' tile' : '') + (locked ? ' ro-locked' : ''), S.board);
          card.dataset.role = 'card';
          card.dataset.id = id;
          Object.assign(card.style, { width: S.geo.w + 'px', height: S.geo.h + 'px' });
          if (!locked) util.el('div', 'ro-h', card);
          if (grid) {
            util.el('span', 'ro-t', card, lab.value || lab.title);
            if (lab.value) util.el('span', 'ro-sub', card, lab.title);
          } else {
            if (locked) util.el('span', 'ro-lockic', card).innerHTML = LOCK_SVG;
            else util.el('span', 'ro-grip', card, '⋮⋮');
            const icon = util.el('span', 'task-kind kind-' + (visualIndex % 6), card);
            icon.setAttribute('aria-hidden', 'true');
            icon.innerHTML = [
              '<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><path d="M8 4h11l6 6v18H8zM19 4v7h6M12 17h9M12 22h9"/></svg>',
              '<svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor"><path d="M5 18h5v10H5zM13 8h5v20h-5zM21 13h6v15h-6z"/></svg>',
              '<svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor"><path d="M7 23 20 10l4 4-13 13-5 1zM22 8l2-2a3 3 0 0 1 4 4l-2 2z"/></svg>',
              '<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m11 9-7 7 7 7M21 9l7 7-7 7M19 6l-6 20"/></svg>',
              '<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4h8M14 4v9L7 25a2 2 0 0 0 2 3h14a2 2 0 0 0 2-3l-7-12V4M10 22h12"/></svg>',
              '<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="16" cy="16" r="12"/><path d="m10 16 4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            ][0];
            util.el('span', 'ro-t', card, lab.title);
            if (lab.tag && (showTag || !lab.value)) tagEl(util, card, lab).style.position = 'relative';
            const date = util.el('span', 'task-date', card, ['Apr 12, 2024','Apr 18, 2024','Apr 25, 2024','May 2, 2024','May 9, 2024','May 16, 2024'][visualIndex % 6]);
            date.setAttribute('aria-hidden', 'true');
            const status = util.el('span', 'task-status', card, 'Not started');
            status.setAttribute('aria-hidden', 'true');
            if (lab.value) util.el('span', 'ro-v', card, lab.value);
            visualIndex++;
          }
          if (locked) card.title = 'Pinned';
          cards[id] = card;
        }
        S.sortable = env.ui.sortable(S.board, {
          items: cards,
          order: ctx.model.order,
          handle: '.ro-h',
          slotRect: (i) => [...slotPos(i), S.geo.w, S.geo.h],
          placeholder: S.slotEl,
          bounds: 'center',
          activeClass: 'dragging',
          keyboard: !!S.spec.keys,
          label: 'card',
          onChange: onOrder(ctx, () => S.sortable),
        });
        if (S.spec.keys) mirrorFocus(ctx, S.board, (t) => t.closest && t.closest('.ro-card') && t.closest('.ro-card').dataset.id);
      },
    },
  },
});
