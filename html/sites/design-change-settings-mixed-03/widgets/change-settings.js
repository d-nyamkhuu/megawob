// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-mixed-03',
  name: 'design',
  split: 'train',
  scenarios: ['mixed'],
  template: 'change-settings/preferences',
  design: {
      minWidth: 0,
      labelSize: '21px',
      detailSize: '18px',
      font: '20px Georgia, "Times New Roman", serif',
      foreground: '#151515',
      muted: '#555',
      background: '#fafafa',
      panel: '#f5f5f4',
      line: '#d2d2d2',
      accent: '#252525',
      dirtyColor: '#555',
      toastColor: '#252525',
      indexAt: 100000,
    parts: {
      title: (base, S) => (ctx) => {
        // Keep the template's subtitle draw without duplicating the window title.
        ctx.rng.pick(S.D.subtitles);
      },
      search: (base) => (ctx, head) => {
        const input = base(ctx, head);
        Object.assign(input.parentElement.style, { flex: '1 1 0', minWidth: '0', width: 'auto' });
        return input;
      },
    },
  },
});
