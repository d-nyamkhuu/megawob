// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-overshare-03',
  name: 'design',
  split: 'train',
  scenarios: ['overshare'],
  template: 'protect-privacy/classic',
  design: {
    font: '14px/1.35 "Courier New", Courier, monospace',
    radius: '0px',
    parts: {
      fit: (base, S) => (ctx) => {
        // Consume the template's seeded geometry draws, then fit the native pane.
        const geo = base(ctx);
        const fullW = Math.max(1, ctx.size.width - 6);
        const fullH = Math.max(1, ctx.size.height - 6);
        return { ...geo, M: 3, fullW, fullH, winW: fullW, winH: fullH };
      },
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
      address: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
      notesPanel: (base, S) => (m) => {
        base(m);
        S.app.lastElementChild.style.width = '41%';
      },
      styles: (base) => () => base() + `
        .sp-win { box-sizing:border-box; background:#aaa; color:#10152b; border:2px ridge #ddd; box-shadow:none; }
        .sp-app { flex-direction:row-reverse; gap:6px; background:#aaa; }
        .sp-side { min-width:0; border:2px ridge #ddd; background:#fff3a5; color:#111; overflow:auto; }
        .sp-side-h { background:#0645ad; color:#fff; border-bottom:2px ridge #ddd; font-size:15px; }
        .sp-kv { grid-template-columns:minmax(0,auto) minmax(0,1fr); gap:8px 10px; }
        .sp-kv dt { white-space:normal; color:#111; }
        .sp-kv dd { color:#111; font:inherit; }
        .sp-main { border:2px ridge #ddd; background:#eee; }
        .sp-chat.sp-card { margin:0; border-radius:0; border:0; }
        .sp-site-h { background:#0645ad; color:#fff; padding:0 10px; }
        .sp-site-h .sp-navs { color:#fff; gap:8px; }
        .sp-thread { justify-content:flex-start; overflow:auto; background:#eee; }
        .sp-msg { max-width:100%; border-radius:0; background:#eee; font:inherit; }
        .sp-msg.them { background:#eee; }
        .sp-mailh { background:#0645ad; color:#fff; }
        .sp-mailh .sp-muted { color:#fff; }
        .sp-mail { font:inherit; }
        .sp-compose { flex:0 0 29%; min-height:100px; align-items:stretch; background:#aaa; }
        .sp-in { min-width:0; flex:1; border:2px inset #ddd; border-radius:0; background:#fff; color:#111; font:inherit; }
        .sp-btn { align-self:flex-end; border:2px outset #ddd; border-radius:0; box-shadow:inset 1px 1px #777; background:#aaa; color:#111; font-weight:bold; }
        .sp-btn.pri { background:#aaa; color:#111; border-color:#ddd; }
      `,
    },
  },
});
