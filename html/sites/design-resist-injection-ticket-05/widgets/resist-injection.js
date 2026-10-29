// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-ticket-05',
  name: 'design',
  split: 'train',
  scenarios: ['ticket'],
  template: 'resist-injection/classic',
  design: {
    widthInset: 2,
    heightInset: 2,
    navThreshold: 0,
    fontSize: '14px',
    inputFont: '14px/1.3 Arial,Helvetica,sans-serif',
    appRadius: '0px',
    appShadow: 'none',
    statusHeight: '22px',
    sourcePadding: '12px 16px',
    compactSourcePadding: '12px 16px',
    parts: {
      styles(base, S) {
        return (ctx) => {
          base(ctx);
          // Keep the two panes inside the frame, including the shortest stage.
          const summaryHeight = 34;
          ctx.css('ticket-layout', `
            .si-body { display:grid; grid-template-columns:minmax(190px,34%) minmax(0,1fr); grid-template-rows:minmax(0,1fr) ${Math.min(166, Math.max(124, ctx.size.height * .35))}px; }
            .si-nav { grid-column:1; grid-row:1 / 3; width:auto; margin-right:4px; padding:6px 0; }
            .si-source { grid-column:2; grid-row:1; }
            .si-editor, .si-app.compact .si-editor { grid-column:2; grid-row:2; width:auto; min-width:0; display:grid; grid-template-columns:minmax(0,1fr) 130px; }
            .si-editfields { padding:6px; display:grid; grid-template-columns:minmax(0,1fr) 112px; grid-template-rows:18px 30px minmax(54px,1fr); gap:3px 7px; }
            .si-editor h3 { grid-area:1 / 1; margin:0; font-size:12px; }
            .si-editfields .si-muted { grid-area:1 / 2; margin:0; }
            .si-editfields .si-label { margin:0; font-size:12px; font-weight:400; }
            .ticket-answer, .ticket-assignee { display:grid; grid-template-columns:76px minmax(0,1fr); align-items:start; }
            .ticket-assignee { grid-area:2 / 1; }
            .ticket-answer { grid-area:3 / 1; }
            .si-editfields .si-label:not(.ticket-answer):not(.ticket-assignee) { grid-area:2 / 2; }
            .si-editfields .si-choices { grid-area:3 / 2; margin:0; gap:3px; align-content:start; }
            .si-editfields .si-choice { padding:4px 6px; font-size:11px; }
            .si-editfields .si-input { margin:0; padding:4px 6px; min-height:26px; }
            .ticket-answer .si-input { height:100%; min-height:54px; }
            .si-savebar .si-btn { min-height:34px; }
            .si-top { height:auto; min-height:${summaryHeight}px; padding:5px 12px; }
            .si-toolbar { min-height:62px; padding:4px 8px; }
            .si-nav p { margin:0; padding:5px 8px; font-size:15px; }
            .si-row { padding:8px 9px; border-radius:0; font-size:14px; }
            @media (min-width:1101px) {
              .si-body { grid-template-columns:minmax(190px,31%) minmax(0,1fr) clamp(270px,27vw,350px); grid-template-rows:minmax(0,1fr); }
              .si-nav { grid-row:1; margin-right:0; }
              .si-editor, .si-app.compact .si-editor { grid-column:3; grid-row:1; display:flex; flex-direction:column; }
              .si-editfields { display:flex; flex-direction:column; gap:5px; overflow:auto; }
              .si-editfields .si-muted { margin:0; }
              .si-editfields .si-choices { margin:0; gap:3px; }
              .si-editfields .si-input { min-height:28px; }
              .ticket-answer .si-input { height:74px; }
              .si-savebar { padding:8px; border-top:1px solid #777; border-left:0; }
            }
          `);
        };
      },
      field(base) {
        return (parent, label, name, textarea) => {
          const input = base(parent, label, name, textarea);
          if (name === 'answer' || name === 'assignee') input.parentElement.classList.add(`ticket-${name}`);
          return input;
        };
      },
      otherSource(base, S) {
        return (ctx, item) => {
          base(ctx, item);
          // Recovery must remain visible even when frame leaves a short message pane.
          const back = S.targets.get(JSON.stringify({ row: S.spec.sourceId }));
          if (back) S.source.prepend(back);
        };
      },
      header(base, S) {
        return (ctx) => {
          const el = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
          const summary = el('header', 'si-top ticket-summary', S.app);
          const identity = el('div', 'ticket-summary-identity', summary);
          el('strong', '', identity, S.spec.sourceTitle);
          el('div', 'ticket-summary-customer', identity, S.spec.person.full);
          const metadata = el('div', 'ticket-summary-meta', summary);
          for (const [label, value] of [['Channel', 'Email'], ['Priority', 'Normal'], ['Status', 'Open']]) {
            const line = el('div', '', metadata);
            el('span', '', line, label);
            el('b', '', line, value);
          }
          const info = el('div', 'ticket-summary-card', summary);
          el('b', '', info, 'Customer Information');
          el('span', '', info, S.spec.person.full);
        };
      },
    },
  },
});
