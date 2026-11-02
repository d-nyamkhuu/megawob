// Adds the project form framing and custom calendar icon to the shared calendar design.
env.widget({
  task: 'set-date',
  site: 'design-set-date-calendar-07',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'set-date/calendar',
  design: {
    calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="19" rx="1" fill="currentColor"/><path d="M6 1v6M18 1v6" stroke="currentColor" stroke-width="3"/><rect x="5" y="10" width="14" height="10" fill="#fff"/><path d="M7 13h2m2 0h2m2 0h2M7 17h2m2 0h2m2 0h2" stroke="currentColor" stroke-width="1.5"/></svg>',
    title: 'Create New Project',
    subtitle: 'Fill in the details below.',
    notesLabel: 'Notes (optional)',
    parts: {
      begin: (base, S) => (ctx) => {
        const helpStep = document.querySelector('.ds-help li');
        if (helpStep) helpStep.textContent = `Click the calendar icon next to "${ctx.spec.scene.label}".`;
        return base(ctx);
      },
      bodyStart: (base, S) => (ctx, extras) => {
        base(ctx, extras);
        S.P.staticRow(S.card, ['Project name', 'Enter project name'], ctx.util);
      },
      built: (base, S) => (ctx) => {
        base(ctx);
        const { util } = ctx;
        S.P.staticRow(S.card, ['Priority', 'Medium'], util);
        const description = util.el('div', 'fd-row fd-description', S.card);
        util.el('div', 'fd-label', description, 'Description');
        util.el('div', 'fd-static', description, 'Enter a brief description');
      },
    },
  },
});
