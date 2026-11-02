// Design on templates/find-fact/base.js, with the answer above the document
// and the toolbar along its lower edge at both template breakpoints.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-locate-10',
  name: 'design',
  split: 'train',
  scenarios: ['locate'],
  template: 'find-fact/base',
  design: {
    parts: {
      buildFind: (base) => (ctx, work, up, room) => {
        const view = base(ctx, work, up, room);
        const body = work.querySelector('.rl-doc > .rl-card-b');
        // Keep the document toolbar below the scroll pane in normal flow.
        body.append(body.querySelector('.rl-tools'));
        // The template uses a footer answer at narrow widths. Give it the same
        // reserved space above the document as the wide answer form.
        const foot = body.querySelector('.rl-gfoot');
        if (foot) {
          Object.assign(foot.style, {
            position: 'absolute', top: '0', left: '0', right: '0',
            height: '42px', padding: '0 10px', border: '0',
            background: 'transparent', zIndex: '4',
          });
          const answer = foot.querySelector('.rl-ans');
          Object.assign(answer.style, { width: '100%', margin: '0' });
          Object.assign(answer.querySelector('label').style, {
            minWidth: '62px', flex: 'none',
          });
          Object.assign(answer.querySelector('.rl-input').style, {
            flex: '1', minWidth: '0', width: '0',
          });
        }
        return view;
      },
    },
  },
});
