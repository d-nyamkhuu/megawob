// Login design: shorten email field labels while keeping the shared stacked form layout.
env.widget({
  task: 'type-text',
  site: 'design-type-text-login-03',
  name: 'design',
  split: 'train',
  scenarios: ['login'],
  template: 'type-text/fields',
  design: {
    parts: {
      labelText: (base, S) => (f, look) =>
        base(S.st.spec.scenario === 'login' && /^email( address)?$/i.test(f.label) ? { ...f, label: 'Email' } : f, look),
    },
  },
});
