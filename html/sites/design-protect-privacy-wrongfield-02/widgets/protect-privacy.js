// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-wrongfield-02',
  name: 'design',
  split: 'train',
  scenarios: ['wrongfield'],
  template: 'protect-privacy/classic',
  design: {
    font: '14px/1.4 "Cantarell", "Segoe UI", Arial, sans-serif',
    parts: {
      fit: (base) => (ctx) => ({
        ...base(ctx), M: 0,
        fullW: ctx.size.width, fullH: ctx.size.height,
        winW: ctx.size.width, winH: ctx.size.height,
      }),
      // Retain the template's random draws for the integrated app header.
      tabs: (base, S) => (ctx) => { base(ctx); S.win.lastElementChild.remove(); },
      address: (base, S) => (ctx) => { base(ctx); S.win.lastElementChild.remove(); },
      siteHead: (base, S) => (parent) => S.P.element('div', 'travel-form-intro', parent,
        'Get travel inspiration, destination guides and exclusive offers straight to your inbox.'),
      detailsPanel: (base, S) => (m) => {
        base(m);
        S.app.lastElementChild.style.width = '42%';
      },
      view: (base, S) => (m) => {
        base(m);
        const [details, main] = Array.from(S.app.children);
        const intro = main.firstElementChild;
        const form = main.lastElementChild;
        form.firstElementChild.after(intro);
        S.P.element('div', 'travel-banner', S.app);
        const columns = S.P.element('div', 'travel-columns', S.app);
        columns.append(details, main);
        // Settle compact forms during render, before anchors are recorded.
        if (form.scrollHeight > main.clientHeight) S.app.classList.add('travel-tight');
      },
      styles: (base, S) => () => {
        const compact = S.ctx.size.height < 600;
        const rows = Math.ceil(S.spec.order.length / (compact ? 2 : 1));
        const bannerHeight = Math.max(32, Math.min(160, S.ctx.size.height * .2,
          S.ctx.size.height - rows * (compact ? 64 : 68) - 230));
        return base() + `
        .sp-win { --panel:#fff; --fg:#15234d; --bg:#fff; --muted:#647795; --line:#d8e1eb; --accent:#3584e4;
          box-shadow:0 2px 8px rgba(27,53,82,.07); background:#fff; color:#15234d; }
        .sp-app { flex-direction:column; gap:18px; padding:18px; background:#fff; }
        .travel-banner { flex:0 0 ${bannerHeight}px; border-radius:12px;
          background:url("sites/design-protect-privacy-wrongfield-02/assets/saffron-coast.webp") center / 100% 100%; }
        .travel-columns { display:flex; flex-direction:row-reverse; flex:1; min-height:0; gap:20px; }
        .travel-columns .sp-side { width:42%; min-width:0; border:0; border-radius:12px; background:#e8f3fc; overflow:auto; }
        .travel-columns .sp-main { min-height:0; overflow:auto; }
        .travel-form-intro { flex:none; color:#647795; margin-bottom:16px; }
        .sp-form { flex:none; width:100%; margin:0; padding:0; border:0; }
        .sp-grid { grid-template-columns:repeat(${compact ? 2 : 1}, minmax(0,1fr)); gap:8px 12px; }
        .sp-h2 { font-size:26px; color:#101d49; }
        .sp-fld label { font-size:14px; }
        .sp-in { background:#fff; color:#15234d; border-color:#cbd6e3; }
        .sp-btn.pri { background:#3584e4; border-color:#3584e4; }
        .sp-side-h { min-height:42px; height:auto; padding:10px 12px; }
        .sp-kv { margin:0; padding:12px; grid-template-columns:minmax(0,.7fr) minmax(0,1fr); }
        .sp-kv dt { white-space:normal; }
        @media (max-width:1200px) {
          .sp-app { padding:12px; gap:12px; }
          .travel-columns { gap:12px; }
          .sp-h2 { font-size:22px; }
          .travel-form-intro { font-size:12px; margin-bottom:10px; }
          .sp-grid { gap:8px; }
        }
        ${compact ? `
          .sp-fld.wide { grid-column:auto; }
          .sp-fld label { font-size:12px; }
          .sp-fld .hint { font-size:10px; line-height:1.2; }
          .sp-h2 { font-size:22px; }
          .travel-form-intro { font-size:12px; margin-bottom:8px; }
          .sp-in { height:28px; }
          textarea.sp-in { height:48px; }
        ` : ''}
        .travel-tight { gap:8px; }
        .travel-tight .travel-banner { flex-basis:32px; }
        .travel-tight .sp-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px 10px; margin-top:6px; }
        .travel-tight .sp-fld.wide { grid-column:auto; }
        .travel-tight .sp-h2 { font-size:20px; }
        .travel-tight .travel-form-intro { font-size:11px; line-height:1.2; margin-bottom:4px; }
        .travel-tight .sp-fld label { font-size:12px; }
        .travel-tight .sp-fld .hint { font-size:10px; line-height:1.15; }
        .travel-tight .sp-in { height:26px; }
        .travel-tight textarea.sp-in { height:40px; }
      `;
      },
    },
  },
});
