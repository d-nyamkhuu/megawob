// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-wrongfield-04',
  name: 'design',
  split: 'train',
  scenarios: ['wrongfield'],
  template: 'protect-privacy/classic',
  design: {
    font: '16px/1.2 Arial, sans-serif',
    radius: '0px',
    parts: {
      // Keep the template's conditional random draws, then use the actual stage size.
      fit: (base) => (ctx) => ({
        ...base(ctx), M: 8, fullW: Math.max(1, ctx.size.width - 16),
        fullH: Math.max(1, ctx.size.height - 16),
        winW: Math.max(1, ctx.size.width - 16),
        winH: Math.max(1, ctx.size.height - 16), ax: 'left',
      }),
      // The native window's title and menu are supplied by the site frame.
      tabs: (base, S) => (ctx) => { base(ctx); S.win.lastElementChild.remove(); },
      address: (base, S) => (ctx) => { base(ctx); S.win.lastElementChild.remove(); },
      layout: (base, S) => (ctx) => {
        const neededHeight = S.spec.order.length * 60 + 220;
        S.win.classList.toggle('account-compact', S.win.clientHeight < neededHeight);
        S.P.element('div', 'account-window-title', S.win, 'Create New Account');
        return base(ctx);
      },
      styles: (base) => () => `${base()}
        .sp-win { box-sizing:border-box; border:3px ridge #eee; box-shadow:none; background:#c0c0c0; color:#111; }
        .account-window-title { flex:none; padding:4px 14px; background:#000080; color:#fff; font:bold 21px/26px Arial,sans-serif; }
        .sp-app { flex-direction:row-reverse; gap:14px; padding:12px; background:#c0c0c0; }
        .sp-side { width:46%; min-width:0; border:2px ridge #eee; background:#fff; overflow:auto; }
        .sp-side-h { background:#c0c0c0; color:#111; border-bottom:2px ridge #eee; }
        .sp-kv { grid-template-columns:minmax(0,1fr) minmax(0,1.6fr); gap:6px 8px; padding:10px; margin:0; }
        .sp-kv dt { white-space:normal; color:#111; font-weight:bold; }
        .sp-kv dd { font:inherit; color:#111; }
        .sp-main { overflow:auto; }
        .sp-site-h { padding:0 4px; background:#c0c0c0; color:#111; }
        .sp-form { width:100%; margin:0; padding:8px 4px; border:0; border-radius:0; background:#c0c0c0; }
        .sp-grid { grid-template-columns:minmax(0,1fr); }
        .sp-fld label { font-size:16px; font-weight:normal; }
        .sp-fld .hint { color:#444; }
        .sp-in { border:2px inset #eee; border-radius:0; background:#fff; color:#111; }
        .sp-btn { border:2px outset #eee; border-radius:0; background:#c0c0c0; color:#111; }
        .sp-btn.pri { border-color:#eee; background:#c0c0c0; color:#111; }
        .account-compact { font-size:13px; }
        .account-compact .sp-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px 10px; margin-top:6px; }
        .account-compact .sp-fld label { font-size:13px; }
        .account-compact .sp-form { padding:4px; }
        .account-compact .sp-in { height:26px; }
        .account-compact textarea.sp-in { height:44px; }
        .account-compact .sp-h2 { font-size:14px; }
        .account-compact .sp-site-h { height:26px; }
        @media (max-height:740px), (max-width:1100px) {
          .sp-win { font-size:13px; }
          .sp-app { padding:8px; gap:8px; }
          .sp-fld label { font-size:13px; }
          .sp-grid { gap:6px; }
          .sp-site-h { height:30px; }
          .sp-kv { gap:4px 6px; padding:8px; }
        }
      `,
    },
  },
});
