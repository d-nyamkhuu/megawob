// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-profile-03',
  name: 'design',
  split: 'train',
  scenarios: ['profile'],
  template: 'resist-injection/classic',
  design: {
    fontSize: '16px', inputFont: '16px/1.35 Arial,Helvetica,sans-serif',
    appRadius: '4px', appShadow: 'none', topHeight: '0px', statusHeight: '0px',
    navWidth: '44%', editorWidth: '56%', compactEditorWidth: '56%',
    widthInset: 0, heightInset: 0, compactWidth: 0,
    sourcePadding: '20px 24px', compactSourcePadding: '16px 20px',
    parts: {
      styles: (base, S) => (ctx) => {
        base(ctx);
        ctx.css('carbon-profile-layout', `
          .si-app { font-family: Arial,Helvetica,sans-serif; border: 0; }
          .si-app .si-top, .si-app .si-status { display: none; }
          .si-app .si-body { display: grid; grid-template-columns: 44% minmax(0,1fr); grid-template-rows: minmax(50px,1fr) minmax(205px,232px) auto; }
          .si-app .si-nav { grid-column: 1; grid-row: 1 / 4; width: auto; min-width: 0; padding: 10px 6px 12px; border: 1px solid #50565c; border-radius: 4px; }
          .si-app .si-nav > p { margin: 0 0 4px; padding: 0 8px 8px; }
          .si-app .si-nav::before { content: 'Name                         Company                         Title'; display: block; padding: 8px 10px; border: 1px solid #555d63; background: linear-gradient(#454c52,#292e32); font-size: 18px; white-space: pre; }
          .si-app .si-row { min-height: 60px; padding: 12px 12px 10px 46px; position: relative; border-bottom: 1px solid #343a3f; border-radius: 0; font-size: 20px; line-height: 1.25; }
          .si-app .si-row::before { content: '♟'; position: absolute; left: 10px; top: 11px; color: #c6cbd0; font-size: 23px; }
          .si-app .si-row small { margin-top: 2px; font-size: 15px; }
          .si-app .si-source { grid-column: 2; grid-row: 1; padding: 20px 24px; font-size: 20px; line-height: 1.4; }
          .si-app .si-profile-grid { display: grid; grid-template-columns: minmax(100px, 31%) minmax(0,1fr); gap: 30px; align-items: start; }
          .si-app .si-profile-photo .si-avatar { display: block; width: 100%; max-width: 205px; height: 218px; margin: 0; border: 1px solid #92999f; border-radius: 4px; color: transparent; font-size: 0; box-shadow: inset 0 0 0 2px #242a2f; }
          .si-app .si-profile-details h2 { margin: 0 0 6px; font-size: 32px; line-height: 1.15; }
          .si-app .si-profile-details h3 { margin: 12px 0 6px; font-size: 20px; }
          .si-app .si-profile-details p { margin: 8px 0; font-size: 20px; }
          .si-app .si-meta { grid-template-columns: 160px minmax(0,1fr); gap: 5px 16px; margin: 12px 0 18px; padding-bottom: 14px; font-size: 20px; }
          .si-app .si-editor { grid-column: 2; grid-row: 2; width: auto; margin: 0 8px 0 12px; border: 1px solid #555d63; border-radius: 5px; }
          .si-app .si-editfields { padding: 8px 20px 0; }
          .si-app .si-editor h3 { margin: 0 0 4px; padding-bottom: 0; border-bottom: 1px solid #555d63; font-size: 20px; font-weight: 400; }
          .si-app .si-label { display: grid; grid-template-columns: 190px minmax(0,1fr); align-items: center; gap: 12px; margin: 4px 0; font-size: 19px; font-weight: 400; }
          .si-app .si-input { grid-column: 2; margin: 0; min-height: 34px; padding: 5px 9px; border: 2px solid #8b9298; font: 18px Arial,sans-serif; }
          .si-app .si-choices { display: flex; gap: 5px; margin: 0; }
          .si-app .si-choice { padding: 3px 8px; font-size: 15px; }
          .si-app .si-selection { margin: 4px 0; }
          .si-app .si-savebar { display: flex; align-items: flex-end; gap: 8px; min-height: 42px; padding: 4px 10px; border: 0; }
          .si-app .si-savebar .si-btn { width: 100%; }
          .si-app .si-feedback { min-height: 0; margin: 0; }
          .si-app .si-toolbar { grid-column: 2; grid-row: 3; min-height: 43px; padding: 5px 12px; flex-wrap: wrap; }
          .si-app .si-bar { flex-wrap: wrap; overflow: visible; }
          @media (max-width: 1100px) {
            .si-app .si-body { grid-template-rows: minmax(50px,1fr) 205px auto; }
            .si-app .si-label { grid-template-columns: 145px minmax(0,1fr); }
            .si-app .si-profile-grid { gap: 16px; }
            .si-app .si-profile-photo .si-avatar { height: 155px; }
          }
        `);
      },
      panes: (base, S) => (ctx) => {
        base(ctx);
        // Keep the ordinary badge-access actions visible below the record form.
        S.body.append(S.toolbar);
      },
      otherSource: (base, S) => (ctx, item) => {
        base(ctx, item);
        // Recovery stays visible even when the source pane is compact.
        const back = S.source.querySelector('button');
        if (back) S.source.prepend(back);
      },
      sourceProfile: (base, S) => (ctx) => {
        base(ctx);
        const root = S.source;
        const old = root.querySelector('.si-profile');
        const meta = root.querySelector('.si-meta');
        if (!old || !meta) return;
        const layout = S.ctx.util.el('div', 'si-profile-grid', null);
        const photo = S.ctx.util.el('div', 'si-profile-photo', layout);
        const details = S.ctx.util.el('div', 'si-profile-details', layout);
        const avatar = old.querySelector('.si-avatar');
        const identity = old.querySelector('div');
        if (avatar) photo.append(avatar);
        if (identity) details.append(identity);
        while (meta.nextSibling) details.append(meta.nextSibling);
        old.replaceWith(layout);
      },
    },
  },
});
