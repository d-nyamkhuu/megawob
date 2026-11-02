// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-urgency-04',
  name: 'design',
  split: 'train',
  scenarios: ['urgency'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '18px/1.3 Arial, sans-serif',
    windowRadius: '0px',
    windowShadow: 'none',
    colors: { '--bg': '#fff', '--panel': '#fff', '--fg': '#111', '--line': '#111', '--muted': '#444', '--b': '#111', '--bs': '#e5e5e5', '--bfg': '#fff', '--warn': '#111', '--bad': '#111', '--good': '#111' },
    parts: {
      frame: (base, S) => (ctx) => {
        const win = base(ctx);
        Object.assign(win.style, { left: '0px', top: '0px', width: `${ctx.size.width}px`, height: `${ctx.size.height}px` });
        return win;
      },
      tabs: (base, S) => (ctx) => {
        // Retain the template's seeded decoration draws without browser tabs.
        base(ctx);
        S.tabTitle.closest('.sd-tabs').remove();
      },
      addressBar: (base, S) => (ctx) => {
        const bar = ctx.util.el('div', 'mac-location', S.win);
        S.bar = bar;
        S.hostEl = ctx.util.el('span', '', bar);
        S.pathEl = ctx.util.el('span', '', bar);
      },
      header: () => () => {},
      screenBody: (base, S) => (sc, parent, m) => {
        const body = S.ctx.util.el('div', 'sd-body mac-task-body', parent);
        S.P.main(sc, body, m);
        if (sc.side) {
          const side = S.P.side(sc, body, m);
          side.style.width = 'auto';
        }
        return body;
      },
      style: (base) => (ctx) => {
        base(ctx);
        ctx.css('mac-task-layout', `
          .mac-location { flex:none; display:flex; gap:8px; padding:5px 12px; border-bottom:1px solid #111; font:12px/1.3 Arial,sans-serif; }
          .mac-task-body { flex-direction:column; }
          .mac-task-body .sd-side { flex:none; }
        `);
      },
    },
  },
});
