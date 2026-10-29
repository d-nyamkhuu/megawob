// This design keeps the login labels and docks Save in the site's footer.
env.widget({
  task: 'type-text',
  site: 'design-type-text-login-09',
  name: 'design',
  split: 'train',
  scenarios: ['login'],
  template: 'type-text/fields',
  design: {
    parts: {
      labelText: (base) => (f, look) => {
        const text = f.type === 'password'
          ? 'Password:'
          : /email/i.test(f.label)
            ? 'Email:'
            : `${f.label}:`;
        return text + (look.optional && f.blank ? ' (optional)' : '');
      },
      saveButton: (base, S) => (ctx, btn, row, card) => {
        card.id = 'login-form';
        btn.setAttribute('form', card.id);
        const footer = ctx.stage.closest('.q-login').querySelector('.q-actions');
        footer.append(btn);
      },
    },
  },
});
