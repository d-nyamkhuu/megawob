// Appointment design on use-health-records/chart; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-appointment-03',
  name: 'design',
  split: 'train',
  scenarios: ['appointment'],
  template: 'use-health-records/chart',
  design: {
    parts: {
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const workspace = S.pane.querySelector('.ehr-appt');
        if (!workspace) return;
        const visit = workspace.querySelector('.ehr-visit');
        visit.children[1].style.flex = 'none';
        // Keep the full visit form in the main pane's scroll geometry. The
        // calendar's percentage height settles as the workspace grows.
        workspace.style.flex = 'none';
        workspace.style.height = `${S.pane.clientHeight}px`;
        for (let i = 0; i < 12; i++) {
          const height = Math.ceil(visit.scrollHeight);
          if (height <= workspace.clientHeight) break;
          workspace.style.height = `${height}px`;
        }
        S.P.mirror();
      },
    },
  },
});
