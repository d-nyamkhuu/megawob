// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-permissions-04',
  name: 'design',
  split: 'train',
  scenarios: ['permissions'],
  template: 'protect-privacy/classic',
  design: {
    font: '16px/1.35 "Segoe UI", Tahoma, Arial, sans-serif',
    parts: {
      element: (base, S) => (tag, cls, parent, text, attrs) => {
        if (cls && cls.split(' ').includes('sp-cam') && !S.spec.needs.includes('camera')) {
          return base(tag, cls + ' vista-activity-icon', parent, S.D.permissionIcons[S.spec.needs[0]], attrs);
        }
        return base(tag, cls, parent, text, attrs);
      },
      fit: (base) => (ctx) => {
        // Retain the template's seeded draws, but fit the actual stage exactly.
        const geo = base(ctx);
        return { ...geo, M: 0, fullW: ctx.size.width, fullH: ctx.size.height,
          winW: ctx.size.width, winH: ctx.size.height };
      },
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.win.querySelector('.sp-tabs').remove();
      },
      address: (base, S) => (ctx) => {
        base(ctx);
        const bar = S.win.querySelector('.sp-bar');
        const toolbar = S.P.element('div', 'vista-site-settings', S.win);
        toolbar.append(S.lock);
        S.P.element('span', 'vista-host', toolbar, S.spec.host);
        toolbar.append(S.permChips);
        S.lock.title = 'Site settings';
        S.lock.setAttribute('aria-label', 'Site settings');
        bar.remove();
      },
      siteHead: () => () => {},
      styles: (base) => () => base() + `
        .sp-win { border-radius: 5px; box-shadow: none; background: #f6fafe; color: #263953; }
        .vista-site-settings { display:flex; align-items:center; gap:7px; flex:none; min-height:28px; padding:2px 12px; font-size:12px; background:#edf5fc; border-bottom:1px solid #d4e1ed; }
        .vista-host { color:#536b86; }
        .sp-app { flex-direction:column; overflow:auto; background:linear-gradient(115deg,#f6fafe,#f8fbfe); padding:12px; gap:12px; }
        .sp-main { flex:none; order:2; overflow:visible; }
        .sp-stagepg { display:grid; grid-template-columns:70px minmax(0,520px); justify-content:center; align-content:center; align-items:center; gap:5px 20px; padding:8px 12px; }
        .sp-cam { grid-column:1; grid-row:1 / span 5; width:64px; height:76px; aspect-ratio:auto; font-size:12px; text-align:center; overflow-wrap:anywhere; }
        .vista-activity-icon { background:transparent !important; color:#b6c0c9; font-size:54px; }
        .sp-stagepg .sp-h2, .sp-stagepg .sp-warn, .sp-stagepg .sp-ok, .sp-stagepg .sp-btn { grid-column:2; }
        .sp-stagepg .sp-h2 { color:#064995; font-size:21px; }
        .sp-stagepg .sp-btn { justify-self:start; min-width:220px; height:42px; border-radius:25px; background:linear-gradient(#fff,#d9eaf7); border-color:#adc8e0; color:#114a88; }
        .sp-bubble { position:relative; top:auto; left:auto; order:1; flex:none; align-self:center; width:min(670px,100%); padding:48px 22px 16px; border:2px solid #70879a; border-radius:10px; background:linear-gradient(#fff,#f6f9fc); box-shadow:0 5px 12px rgba(20,45,65,.3); }
        .sp-bubble::before { content:'Windows Internet Explorer'; position:absolute; top:0; left:0; right:0; height:35px; display:flex; align-items:center; padding:0 12px; border-bottom:1px solid #8daec9; border-radius:8px 8px 0 0; background:linear-gradient(#d7edfb,#9fc8e7 55%,#c4e0f4); color:#14283b; font-size:17px; }
        .sp-bubble .q { font-size:16px; font-weight:600; }
        .sp-bubble .what { margin-bottom:10px; }
        .sp-bubble .sp-btn { min-width:115px; height:36px; border-radius:4px; background:linear-gradient(#fff,#e8edf2); color:#172942; border-color:#9ca8b2; }
        .sp-bubble .sp-btn:last-child { border-color:#168acb; background:linear-gradient(#dff3ff,#b7e4fa); }
        .sp-ss { position:relative; top:auto; left:auto; order:1; flex:none; align-self:center; width:min(400px,100%); }
        @media(max-height:740px) {
          .sp-app { padding:7px; gap:6px; }
          .sp-bubble { padding:39px 16px 10px; }
          .sp-bubble::before { height:29px; font-size:15px; }
          .sp-bubble .q { margin-bottom:4px; font-size:14px; }
          .sp-bubble .what { margin-bottom:6px; font-size:14px; }
          .sp-bubble .sp-btn { height:30px; }
          .sp-stagepg { padding:4px; gap:4px 14px; font-size:13px; }
          .sp-stagepg .sp-h2 { font-size:17px; }
          .sp-stagepg .sp-btn { height:32px; }
          .sp-cam { height:54px; }
        }
      `,
    },
  },
});
