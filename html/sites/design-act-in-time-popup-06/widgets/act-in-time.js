// Adds password visibility and login options, plus extra update dialog controls.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-06',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      fields: (base) => (ctx, card, userEl, passEl) => {
        const { util } = ctx;
        const eye = util.el('button', 'ds-password-eye', passEl.parentElement, '');
        eye.type = 'button';
        eye.title = 'Show password';
        eye.setAttribute('aria-label', 'Show password');
        eye.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
        eye.addEventListener('click', () => {
          const show = passEl.type === 'password';
          passEl.type = show ? 'text' : 'password';
          eye.title = show ? 'Hide password' : 'Show password';
          eye.setAttribute('aria-label', eye.title);
        });
        const options = util.el('div', 'ds-login-options', card);
        const remember = util.el('label', 'ds-remember', options);
        const keep = util.el('input', '', remember);
        keep.type = 'checkbox';
        util.el('span', '', remember, 'Keep me signed in');
        const forgot = util.el('button', 'ut-link ds-forgot', options, 'Forgot password?');
        forgot.type = 'button';
        forgot.addEventListener('click', () => env.log('decoy', { label: 'Forgot password?' }));
        return { ...base(ctx, card, userEl, passEl), options };
      },
      loginButton: (base) => (ctx, login, extra) => {
        base(ctx, login, extra);
        extra.options.append(login);
      },
      dialogContent: () => (ctx, box) => {
        const { util } = ctx;
        util.el('h3', '', box, 'System Update');
        util.el('p', '', box, 'A new version is ready to install. You can update now or continue working.');
      },
      dialogButtons: () => (ctx, box, row, choice, mk) => {
        const later = mk('Remind Me Later');
        later.classList.add('ds-remind');
        later.addEventListener('click', () => choice.stay.click());
        row.append(later);
        choice.stay.classList.add('primary');
        choice.leave.classList.add('ds-leave');
        const close = ctx.util.el('button', 'ds-dialog-close', box, '×');
        close.type = 'button';
        close.title = 'Close';
        close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => choice.stay.click());
      },
    },
  },
});
