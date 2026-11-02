// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-align-03',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'align-layout/canvas',
  design: {
    titleSize: 23,
    itemSize: 22,
    cardPadding: '0px',
    cardGap: 0,
    bodyGap: 0,
    rulerWidth: 0,
    rulerHeight: 0,
    gridSize: 1,
    itemRadius: 3,
    radiusMin: 3,
    radiusMax: 3,
    parts: {
      begin: (base, S) => (ctx) => {
        base(ctx);
        // Enlarge the artwork without scaling drag deltas: the displayed alignment
        // edge and the guide share an origin, preserving the model's exact error.
        const vertical = ctx.spec.axis === 'x';
        const factor = ['min', 'left', 'top', 'start'].includes(ctx.spec.edge) ? 0
          : ['max', 'right', 'bottom', 'end'].includes(ctx.spec.edge) ? 1 : .5;
        const width = ctx.size.width;
        const height = ctx.size.height;
        const cardWidth = Math.round(vertical ? Math.min(400, width * .324)
          : Math.min(400, (width - 64) / ctx.spec.items.length - 16));
        const cardHeight = Math.round(Math.min(104, height * .116));
        const minimum = Math.min(...ctx.model.r.map(r => vertical ? r.w : r.h));
        const span = vertical ? width : height;
        const modelSpan = vertical ? ctx.spec.W : ctx.spec.H;
        const visualSpan = vertical ? cardWidth : cardHeight;
        const origin = Math.round((span - modelSpan) / 2 + (factor - .5) * (visualSpan - minimum));
        S.st.kde = { vertical, factor, width, height, cardWidth, cardHeight, origin,
          initial: ctx.model.r.map(r => ({ ...r })) };
      },
      canvas: (base, S) => (ctx, frame) => {
        const canvas = base(ctx, frame);
        canvas.style.width = ctx.size.width + 'px';
        canvas.style.height = ctx.size.height + 'px';
        canvas.classList.add(ctx.spec.axis === 'x' ? 'kde-vertical' : 'kde-horizontal');
        return canvas;
      },
      moved: (base, S) => (ctx, el, i) => {
        base(ctx, el, i);
        const v = S.st.kde;
        const r = ctx.model.r[i];
        const initial = v.initial[i];
        const axisPosition = v.vertical ? r.x + v.factor * r.w : r.y + v.factor * r.h;
        const axisStart = v.origin + axisPosition - v.factor * (v.vertical ? v.cardWidth : v.cardHeight);
        const crossStart = v.vertical
          ? v.height * (.09 + .612 * i / Math.max(1, ctx.spec.items.length - 1)) + r.y - initial.y
          : 32 + i * (v.width - 64) / ctx.spec.items.length + r.x - initial.x;
        el.style.left = (v.vertical ? axisStart : Math.max(12, Math.min(v.width - v.cardWidth - 12, crossStart))) + 'px';
        el.style.top = (v.vertical ? Math.max(12, Math.min(v.height - v.cardHeight - 12, crossStart)) : axisStart) + 'px';
        el.style.width = v.cardWidth + 'px';
        el.style.height = v.cardHeight + 'px';
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const rows = [...document.querySelectorAll('.mac-stat-row')];
        const panel = document.querySelector('.mac-stats');
        while (rows.length < ctx.spec.items.length) {
          const row = ctx.util.el('section', 'mac-stat-row', panel);
          ctx.util.el('span', 'mac-stat-swatch ' + ['blue', 'green', 'yellow', 'red'][rows.length % 4], row);
          ctx.util.el('span', 'mac-stat-label', row);
          ctx.util.el('span', 'mac-stat-count', row, '1');
          panel.insertBefore(row, panel.querySelector('.mac-stat-total-row'));
          rows.push(row);
        }
        rows.forEach((row, i) => { row.style.display = i < ctx.spec.items.length ? '' : 'none'; });
        ctx.spec.items.forEach((item, i) => {
          if (rows[i]) rows[i].querySelector('.mac-stat-label').textContent = item.label;
        });
        const total = document.querySelector('.mac-stat-total');
        if (total) total.textContent = String(ctx.spec.items.length);
        S.card.style.left = '0px';
        S.card.style.top = '0px';
        const guide = S.canvas.querySelector('.lo-guide');
        if (guide) guide.style[S.st.kde.vertical ? 'left' : 'top'] = (S.st.kde.origin + ctx.spec.t) + 'px';
      },
      item: (base, S) => (ctx, canvas, it, i, locked) => {
        const el = ctx.util.el('div', 'lo-item' + (locked ? ' locked' : ''), canvas);
        el.classList.add('kde-category-' + (i % 4));
        S.P.tint(el, it.hue);
        el.dataset.role = 'card';
        const icons = [
          '<svg viewBox="0 0 32 32"><path d="M8 3h11l7 7v19H8z"/><path d="M19 3v8h7M12 16h10M12 21h10M12 26h7"/></svg>',
          '<svg viewBox="0 0 32 32"><rect x="3" y="5" width="26" height="22" rx="1"/><circle cx="10" cy="12" r="2" fill="currentColor" stroke="none"/><path d="m4 26 15-14 9 10v4z" fill="currentColor" stroke="none"/></svg>',
          '<svg viewBox="0 0 32 32"><g fill="currentColor" stroke="none"><circle cx="16" cy="8" r="4.5"/><circle cx="6.5" cy="11" r="3.5"/><circle cx="25.5" cy="11" r="3.5"/><path d="M8 29v-7a8 8 0 0 1 16 0v7zM1 28v-7a6 6 0 0 1 8-5 10 10 0 0 0-3 7v5zM31 28v-7a6 6 0 0 0-8-5 10 10 0 0 1 3 7v5z"/></g></svg>',
          '<svg viewBox="0 0 32 32"><rect x="4" y="7" width="24" height="22" rx="1"/><path d="M10 3v8M22 3v8M4 12h24"/><path d="M9 17h3v3H9zM15 17h3v3h-3zM21 17h3v3h-3zM9 23h3v3H9zM15 23h3v3h-3zM21 23h3v3h-3z" fill="currentColor" stroke="none"/></svg>',
        ];
        const icon = ctx.util.el('span', 'kde-card-icon', el);
        icon.innerHTML = icons[i % icons.length];
        const copy = ctx.util.el('span', 'kde-card-copy', el);
        ctx.util.el('span', 'kde-card-title', copy, it.label);
        const detail = ['Plan and goals', 'Images and files', 'Members and roles', 'Dates and milestones'];
        ctx.util.el('span', 'kde-card-detail', copy, detail[i % detail.length]);
        if (locked) el.insertAdjacentHTML('afterbegin', S.D.icons.lock);
        return el;
      },
    },
  },
});
