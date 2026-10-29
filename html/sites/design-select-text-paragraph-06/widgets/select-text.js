// Design on templates/select-text/paragraphs.js.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-06',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    clearSelection: true,
    parts: {
      font: () => (ctx) => Math.min(35, (ctx.size.width * 35) / 1512),
      room: () => (ctx) => Math.min(ctx.size.height, ctx.stage.clientHeight) - 8,
      prepareFull: (base, S) => (ctx, room) => {
        S.textEl.style.setProperty('--hl-gap', '60px');
        const count = Math.max(1, ctx.spec.paragraphs.length - 1);
        const excess = S.card.getBoundingClientRect().height - room;
        if (excess > 0) S.textEl.style.setProperty('--hl-gap', Math.max(12, 60 - excess / count) + 'px');
      },
      bound: (base, S) => (ctx) => {
        const choose = (start, end) => {
          const m = { ...ctx.model, start, end };
          S.sel.set(m);
          ctx.update(m);
        };
        env.widgetDef.clear = () => choose(0, 0);
        env.widgetDef.selectAll = () => choose(0, ctx.spec.doc.length);
        env.widgetDef.findNext = () => {
          let offset = 0;
          const ranges = ctx.spec.paragraphs.map((text) => {
            const range = { start: offset, end: offset + text.length };
            offset += text.length + 2;
            return range;
          });
          const next = ranges.find((r) => r.start >= Math.max(ctx.model.start, ctx.model.end) && r.end > ctx.model.end) || ranges[0];
          choose(next.start, next.end);
        };
      },
    },
  },
});
