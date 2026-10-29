// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-board-02',
  name: 'design',
  split: 'train',
  scenarios: ['board'],
  template: 'use-dispatch/workspace',
  design: {
    font: '"Courier New", monospace',
    parts: {
      lanes: (base, S) => function () {
        base();
        if (S.ctx.size.height >= 560) {
          S.els.main.lastElementChild.style.gridTemplateColumns = `repeat(${S.spec.lanes.length},minmax(0,1fr))`;
        }
      },
      styles: (base, S) => function (ctx) {
        base(ctx);
        // Keep compact lanes at one height, so a complete card can be scrolled into view.
        // The taller board retains the design's backlog above the driver lanes.
        ctx.css('fleetops-board', `
          .ad-app { container: fleetops / size; }
          .ad-lane { border-radius:0; }
          .ad-inspector { display:block; background:#f5f7f8; border-color:#151b1e; }
          @container fleetops (max-height:411px) {
            .ad-toolbar { height:32px; }
            .ad-context { min-height:24px; padding:3px 10px; }
            .ad-filters { height:25px; }
          }
          @container fleetops (max-height:311px) {
            .ad-toolbar { height:28px; }
            .ad-context { min-height:20px; padding:1px 10px; }
            .ad-filters { height:23px; }
            .ad-footer { height:23px; min-height:23px; }
            .ad-app .ad-lane-head { height:70px; padding:5px; }
            .ad-lane-head strong { line-height:12px; }
            .ad-lane-head .ad-meta { line-height:11px; margin-top:2px; }
            .ad-lane-head .ad-load { line-height:12px; margin-top:2px; }
            .ad-lane-head .ad-bar { margin-top:2px; }
          }
          @container fleetops (min-height:542px) {
            .ad-lanes { grid-template-columns:repeat(${S.spec.lanes.length},minmax(0,1fr)); grid-template-rows:128px minmax(0,1fr); }
            .ad-lanes .ad-lane:first-child { grid-column:1 / -1; }
            .ad-lanes .ad-lane:first-child .ad-lane-head { height:32px; display:flex; align-items:center; gap:12px; }
            .ad-lanes .ad-lane:first-child .ad-bar { flex:1; }
            .ad-lanes .ad-lane:first-child .ad-pane { display:grid; grid-template-columns:repeat(${S.spec.items.length},minmax(0,1fr)); gap:${S.D.cardGap}px; align-content:start; }
            .ad-lanes .ad-lane:first-child .ad-empty { grid-column:1 / -1; }
          }
        `);
      },
    },
  },
});
