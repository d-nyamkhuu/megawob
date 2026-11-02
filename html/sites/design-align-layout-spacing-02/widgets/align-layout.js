// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-spacing-02',
  name: 'design',
  split: 'train',
  scenarios: ['spacing'],
  template: 'align-layout/canvas',
  design: {
    cardGap: 0,
    cardPadding: '0',
    bodyGap: 0,
    rulerWidth: 0,
    rulerHeight: 0,
    titleSize: 22,
    itemSize: 12.5,
    panel: '#fdfdfd',
    line: '#d1d4da',
    fg: '#202d4e',
    muted: '#626c80',
    parts: {
      toolbar(base, S) {
        return (ctx, card) => {
          const bar = base(ctx, card);
          const height = Math.min(68, Math.max(26, ctx.size.height - ctx.spec.H - 2));
          Object.assign(bar.style, { height: height + 'px', flex: '0 0 auto', padding: '0 22px' });
          // Keep the template's title draw and all task wiring, but present the
          // compact project-sheet heading used by this design.
          const count = ctx.spec.items.length;
          const locked = ctx.spec.items.reduce((n, _, i) => n + (env.taskDef.helpers.locked(ctx.spec, i) ? 1 : 0), 0);
          bar.replaceChildren();
          const title = ctx.util.el('div', 'lo-title', bar, 'Homepage Layout');
          const stats = ctx.util.el('div', 'lo-summary', bar);
          ctx.util.el('span', 'lo-count-icon', stats, '▦');
          ctx.util.el('span', '', stats, `${count} cards`);
          ctx.util.el('span', 'lo-summary-sep', stats);
          ctx.util.el('span', 'lo-lock-icon', stats, '▣');
          ctx.util.el('span', '', stats, `${locked} locked`);
          return bar;
        };
      },
      pane() {
        return (ctx, parent) => ctx.util.el('div', 'lo-pane', parent);
      },
      ruler() {
        return () => null;
      },
      body(base) {
        return (ctx, card) => {
          const body = base(ctx, card);
          Object.assign(body.style, { flex: '1 1 auto', alignItems: 'center', justifyContent: 'center' });
          return body;
        };
      },
      item(base) {
        return (ctx, canvas, it, i, locked) => {
          const el = base(ctx, canvas, it, i, locked);
          const rect = ctx.model.r[i];
          // Retain the icon-over-label treatment without enlarging seeded cards.
          el.style.flexDirection = 'column';
          el.style.fontSize = Math.min(25, (rect.w - 8) / (it.label.length * 0.62), (rect.h - 8) / 3.5) + 'px';
          const lock = el.querySelector('svg');
          if (lock) Object.assign(lock.style, {
            position: 'absolute', top: Math.min(12, rect.h * 0.1) + 'px',
            right: Math.min(12, rect.w * 0.1) + 'px',
          });
          return el;
        };
      },
      place(base, S) {
        return (ctx, card) => {
          // Preserve the template's placement draws, then fit the sheet to the
          // stage while keeping canvas/model coordinates at one CSS pixel.
          base(ctx, card);
          const width = Math.min(ctx.size.width, Math.max(ctx.spec.W + 2, ctx.size.width * 0.9));
          const height = Math.min(ctx.size.height, Math.max(ctx.spec.H + S.st.bar.offsetHeight + 2, ctx.size.height * 0.86));
          Object.assign(card.style, {
            width: width + 'px', height: height + 'px',
            left: (ctx.size.width - width) / 2 + 'px',
            top: (ctx.size.height - height) / 2 + 'px',
          });
        };
      },
    },
  },
});
