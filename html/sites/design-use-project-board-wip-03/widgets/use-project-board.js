// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-wip-03',
  name: 'design',
  split: 'train',
  scenarios: ['wip'],
  template: 'use-project-board/workspace',
  design: {
    inset: 0,
    compactSidebarWidth: 88,
    boardHeadHeight: 28,
    laneTitleHeight: 18,
    laneMin: 0,
    cardMin: 40,
    cardMax: 60,
    cardInset: 26,
    parts: {
      frame: (base, S) => function (ctx) {
        // Keep the workspace's controls in flow while reserving room for its scroll panes.
        ctx.css('beacon-project-layout', `
          .pj-app .pj-head { height: 28px; padding: 0 8px; }
          .pj-app .pj-title { font-size: 12px; }
          .pj-app .pj-tabs { height: 23px; gap: 10px; padding: 0 8px; }
          .pj-app .pj-tools { height: 48px; padding: 3px 5px; gap: 3px; }
          .pj-app .pj-toolbar { gap: 3px; }
          .pj-app .pj-toolbar .pj-btn { height: 23px; padding: 2px 4px; }
          .pj-app .pj-hint { height: 18px; padding: 0 5px; font-size: 8px; }
          .pj-app .pj-foot { height: 20px; padding: 0 5px; gap: 6px; font-size: 8px; }
        `);
        return base(ctx);
      },
    },
  },
});
