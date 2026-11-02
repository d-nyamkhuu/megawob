// Login labels, hidden field placeholders, and height fitting match this site's original form.
env.widget({
  task: 'type-text',
  site: 'design-type-text-login-05',
  name: 'design',
  split: 'train',
  scenarios: ['login'],
  template: 'type-text/fields',
  scrollable: (spec) => !!spec.long,
  design: {
    fit: 'scale',
    parts: {
      labelText: (base, S) => (f, look) => S.st.spec.scenario === 'login'
        ? (f.type === 'password' ? 'Password:' : 'Username or email:')
        : base(f, look),
      placeholder: (base, S) => (f, text, look, floating) =>
        S.st.spec.scenario === 'login' && look.layout !== 'placeholder' && !floating
          ? undefined
          : base(f, text, look, floating),
    },
  },
});
