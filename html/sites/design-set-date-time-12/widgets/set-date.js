// Uses the shared time form with its site title and Preferences-tab navigation.
env.widget({
  task: 'set-date',
  site: 'design-set-date-time-12',
  name: 'design',
  split: 'train',
  scenarios: ['time'],
  template: 'set-date/calendar',
  design: {
    title: 'Task Details',
    parts: {
      locate: (base, S) => (target) => {
        const preferences = document.querySelector('[data-role="preferences"]');
        if (preferences && preferences.style.display !== 'none') {
          return S.ctxRef.util.center(document.querySelector('[data-role="tab-task"]'));
        }
        return base(target);
      },
    },
  },
});
