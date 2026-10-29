// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-dependent-03',
  name: 'design',
  split: 'train',
  scenarios: ['dependent'],
  template: 'change-settings/preferences',
  design: { sideTabsAt: 100000 },
});
