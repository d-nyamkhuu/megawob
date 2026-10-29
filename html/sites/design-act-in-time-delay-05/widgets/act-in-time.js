// The delay preset adds this site's four-step processing strip.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-delay-05',
  name: 'design',
  split: 'train',
  scenarios: ['delay'],
  template: 'act-in-time/arena',
  design: {},
});
