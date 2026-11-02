// Restores this site's login copy and omits the template's geometric backdrop.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-10',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: {
    loginTitle: 'Log In',
    loginSubtitle: 'Access your account to manage your services.',
    geometric: false,
  },
});
