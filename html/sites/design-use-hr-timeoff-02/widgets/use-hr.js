// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-timeoff-02',
  name: 'design',
  split: 'train',
  scenarios: ['timeoff'],
  template: 'use-hr/workspace',
  design: {
    brand: 'AcmeWorks',
    font: '12px/1.4 "Trebuchet MS",Arial,sans-serif',
    inset: '0px',
    panel: '#fff', foreground: '#172742', muted: '#596477',
    line: '#c9dfef', accent: '#07529a', background: '#edf6fd',
    parts: {
      styles: (base, S) => function (ctx) {
        base(ctx);
        ctx.css('acme-review-layout', `
          .acme-workspace-tools{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);flex:none;border-bottom:1px solid #c9dfef;background:linear-gradient(#fff,#f2f8fd)}
          .acme-workspace-tools .hr-brandbar{height:auto;min-width:0;min-height:30px;padding:4px 8px;border:0;gap:5px}
          .acme-workspace-tools .hr-title{padding:4px 8px;min-width:0;gap:4px}
          .acme-workspace-tools .hr-title h2{font-size:15px;margin:0}
          .acme-workspace-tools .hr-toolbar{padding:0 8px 4px;min-width:0;gap:4px}
          .acme-workspace-tools .hr-subtabs{padding:0 8px;gap:10px;min-width:0;min-height:25px;align-items:center;border:0;font-size:10px}
          .acme-workspace-tools .hr-subtab{padding-bottom:2px}
          .acme-workspace-tools .hr-filterlabel{display:inline-flex}
          .hr-app .hr-policy{margin:5px 8px;padding:4px 7px;font-size:10px}
          .hr-app .hr-work{padding:0 8px 6px}
          .hr-app .hr-stats{padding:4px 8px;min-height:24px}
          .hr-app .hr-candidate{padding:5px}
          .hr-app .hr-candidate .hr-footnote{margin:3px 0;font-size:8px}
          .hr-app .hr-candidate .hr-meta{margin:3px 0;gap:2px}
          .hr-app .hr-candidate .hr-chip{font-size:8px;padding:0 2px}
          .hr-app .hr-candidate .hr-scorebar{margin:3px 0}
          .hr-app .hr-candidate .hr-cardbottom{font-size:8px;padding-top:3px}
        `);
      },
      shell: (base, S) => function (ctx) {
        base(ctx);
        const { root, main } = S.current;
        const tools = ctx.util.el('div', 'acme-workspace-tools', main);
        const brand = root.querySelector('.hr-brandbar');
        const heading = main.querySelector('.hr-title');
        const tabs = main.querySelector('.hr-subtabs');
        const toolbar = main.querySelector('.hr-toolbar');
        toolbar.style.paddingTop = '0';
        tools.append(brand, heading, tabs, toolbar);
        main.prepend(tools);
      },
      candidateActivity: (base, S) => function (ctx, drawer, candidate) {
        base(ctx, drawer, candidate);
        // Keep the draft action reachable before the supporting activity feed.
        const action = S.current.refs.reject.node;
        drawer.prepend(action);
      },
    },
  },
});
