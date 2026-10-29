// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-tree-03',
  name: 'design',
  split: 'train',
  scenarios: ['tree'],
  template: 'choose-option/base',
  design: {
    parts: {
      buildTree: (base) => function (field, ctx) {
        base(field, ctx);
        field.querySelector('.fp-tgroups').style.gridTemplateColumns = 'minmax(0,1fr)';
      },
      // Keep the template's controls, state and random draws; size its card to
      // the stage instead of overriding its frozen geometry from site.css.
      place: (base) => function (card, ctx, popup) {
        base(card, ctx, popup);
        Object.assign(card.style, {
          left: '0px', top: '0px',
          width: ctx.size.width + 'px', height: ctx.size.height + 'px',
        });
        card.querySelector('.fp-title').textContent = 'Select Folders to Back Up';
        card.querySelector('.fp-note').textContent = 'Choose the folders you want to include in your backup.';
      },
      ensureStyle: (base) => function (id, css) {
        base(id, css);
        base('aqua-tree-layout', `
          .aqua-stage .fp-card { box-sizing:border-box; padding:0 14px 12px; border:0; }
          .aqua-stage .fp-title { flex:none; min-height:36px; line-height:1.25; }
          .aqua-stage .fp-note { display:block; flex:none; min-height:44px; margin:0; padding-bottom:10px; line-height:1.3; }
          .aqua-stage .fp-field { flex:1 1 0; min-height:0; margin:0; overflow:auto; }
          .aqua-stage .fp-tgroups { grid-template-columns:minmax(0,1fr); gap:0; min-height:100%; padding:0 18px; align-content:space-between; }
          .aqua-stage .fp-tg { min-width:0; padding:0 0 9px; margin:0 0 9px; }
          .aqua-stage .fp-tg:last-child { margin-bottom:0; }
          .aqua-stage .fp-thead { min-height:34px; padding:0; gap:11px; }
          .aqua-stage .fp-thead input,.aqua-stage .fp-tkid input { flex:none; width:24px; height:24px; position:relative; }
          .aqua-stage .fp-tkid { min-height:34px; height:auto; padding-left:68px; gap:16px; line-height:1.1; white-space:normal; }
          .aqua-stage .fp-tkid span { overflow:visible; text-overflow:clip; }
          .aqua-stage .fp-thead:before { content:'▾'; width:16px; flex:none; }
          .aqua-stage .fp-tkid span:before { content:''; display:inline-block; width:26px; height:18px; margin-right:10px; vertical-align:-3px; }
          .aqua-stage .fp-thead>span:not(.fp-tcount):not(.fp-links):before { content:''; display:inline-block; width:34px; height:23px; margin-right:10px; vertical-align:-4px; }
          @media(max-height:760px) {
            .aqua-stage .fp-title { min-height:30px; }
            .aqua-stage .fp-note { min-height:35px; padding-bottom:6px; }
            .aqua-stage .fp-tg { padding-bottom:4px; margin-bottom:4px; }
            .aqua-stage .fp-thead { min-height:28px; }
            .aqua-stage .fp-tkid { min-height:27px; }
            .aqua-stage .fp-thead input,.aqua-stage .fp-tkid input { width:20px; height:20px; }
          }
        `);
      },
    },
  },
});
