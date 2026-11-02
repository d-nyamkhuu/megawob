// Preserves popup-12's unsaved-change copy and omits the geometric backdrop decoration.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-12',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: {
    loginTitle: 'User Login',
    loginSubtitle: 'Enter your username and password to continue.',
    dialogTitle: 'Unsaved Changes',
    dialogText: 'Unsaved layout changes. If you continue, your layout changes will not be saved.',
    stayLabel: 'Continue without saving',
    geometric: false,
  },
});
