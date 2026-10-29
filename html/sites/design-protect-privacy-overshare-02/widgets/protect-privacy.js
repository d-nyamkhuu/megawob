// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-overshare-02',
  name: 'design',
  split: 'train',
  scenarios: ['overshare'],
  template: 'protect-privacy/classic',
  design: {
    font: '14px/1.32 "Courier New", monospace',
    radius: '2px',
    parts: {
      // Preserve the template's seeded draws, then fit the reader to the stage.
      fit: (base) => (ctx) => {
        const geo = base(ctx);
        return { ...geo, M: 0, fullW: ctx.size.width, fullH: ctx.size.height,
          winW: ctx.size.width, winH: ctx.size.height };
      },
      // This mail workspace has its own app frame, without browser decorations.
      tabs: (base, S) => (ctx) => { base(ctx); S.win.lastElementChild.remove(); },
      address: (base, S) => (ctx) => { base(ctx); S.win.lastElementChild.remove(); },
      layout: (base) => (ctx) => {
        const app = base(ctx);
        app.style.flexDirection = 'column';
        return app;
      },
      notesPanel: (base, S) => (m) => {
        base(m);
        const notes = S.app.lastElementChild;
        notes.style.width = '100%';
        notes.style.flex = `0 0 ${Math.min(220, Math.floor(S.ctx.size.height * .34))}px`;
        notes.style.overflow = 'auto';
      },
      styles: (base) => () => base() + `
        .sp-win { box-sizing: border-box; }
        .sp-kv { margin: 0; }
        .sp-kv dd { font-family: inherit; font-size: inherit; }
        .sp-thread { overflow: auto; }
        .sp-compose .sp-in { flex: 1; min-width: 0; }
      `,
    },
  },
});
