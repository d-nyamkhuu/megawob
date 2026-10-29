// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-select-03',
  name: 'design',
  split: 'train',
  scenarios: ['select'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Northwind',
    expandedAt: 2000,
    navWidth: 0,
    railWidth: 0,
    contextAt: 9999,
    cardInsetX: 8,
    cardInsetY: 12,
    cardTop: 0,
    fixedHeight: 300,
    rowMin: 18,
    rowMax: 48,
    parts: {
      fit: (base, S) => function () {
        base();
        // Keep the row budget in step with the visible Fluent controls.
        const heights = S.H < 440 ? [40, 56, 32, 32]
          : S.H < 560 ? [48, 60, 40, 46] : [76, 112, 52, 76];
        ['head', 'tools', 'header', 'foot'].forEach((name, i) => {
          S.shell.style.setProperty(`--fluent-${name}-height`, `${heights[i]}px`);
        });
        S.FIXED = heights.reduce((a, b) => a + b, 0) + 26;
        S.rowH = Math.max(18, Math.min(S.D.rowMax, Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
        S.shell.style.setProperty('--fluent-checkbox-size', `${Math.min(21, S.rowH - 3)}px`);
      },
      drawTools: (base, S) => function (model) {
        base(model);
        if (S.selBar) S.selBar.style.setProperty('display', 'flex', 'important');
      },
    },
    extraCss: `
      .to-workspace { border:0; background:transparent; }
      .to-appbar,.to-nav,.to-context,.to-tabs { display:none!important; }
      .to-nav { width:0!important; }
      .to-card { border:1px solid #dce4ee; border-radius:12px; box-shadow:0 1px 2px rgba(20,40,65,.04); background:#fff; }
      .to-head { height:var(--fluent-head-height); padding:0 24px; border:0; flex-wrap:wrap; align-content:center; }
      .to-head .to-object { flex:1 0 40%; }
      .to-head h2 { font:600 26px/1.2 'Segoe UI',Arial,sans-serif; color:#101b31; }
      .to-head .to-chip { display:none; }
      .to-head > .sp { display:none; }
      .to-tools { height:var(--fluent-tools-height); padding:0 24px; border:0; background:#fff; flex-wrap:wrap; align-content:center; gap:8px; }
      .to-tools .to-search { order:0; margin-left:auto; width:330px; height:42px; }
      .to-tools .to-search input { font-size:14px; }
      .to-tools > .to-selinfo { order:1; flex:0 0 100%; font-size:15px; font-weight:400; color:#34435b!important; }
      .to-tools > .to-selinfo + .to-link { display:none; }
      .to-tools > .sp { display:none; }
      .to-tools > div[style*='align-items:center'] { order:2; display:flex!important; flex:0 0 100%!important; gap:10px!important; }
      .to-tools > div[style*='align-items:center'] .to-btn { padding:0 10px; border-radius:7px; font-size:14px; }
      .to-tools > div[style*='display:flex'] .to-btn[disabled] { opacity:1; }
      .to-grid { margin:0 24px; border:1px solid #e0e5ec; border-radius:7px; }
      .to-hrow { height:var(--fluent-header-height); background:#f4f6f8; }
      .to-h { font:600 14px 'Segoe UI',Arial,sans-serif; color:#17243b; border-left:1px solid #e0e5ec; padding-left:16px; }
      .to-cb input { width:var(--fluent-checkbox-size); height:var(--fluent-checkbox-size); appearance:none; border:1.5px solid #9aa8ba; border-radius:4px; background:white; }
      .to-cb input:checked { appearance:auto; accent-color:#1682e8; }
      .to-row { background:#fff; }
      .to-c { font:14px 'Segoe UI',Arial,sans-serif; color:#20304a; border-left:1px solid #e9edf2; padding:0 16px; }
      .to-foot { height:var(--fluent-foot-height); padding:0 24px; border:0; }
      .to-foot .info { font-size:15px; color:#35445e; }
      .to-pg { height:min(40px, calc(var(--fluent-foot-height) - 6px)); min-width:40px; border:1px solid #dce4ee; border-radius:7px; }
      .to-pill { padding:5px 13px; border-radius:7px; font-size:13px; }
    `,
  },
});
