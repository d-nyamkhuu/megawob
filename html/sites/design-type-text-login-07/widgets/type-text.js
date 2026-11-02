// Adds password affordances and moves the sign-in control into the page header.
(function () {
  'use strict';

  env.widget({
    task: 'type-text',
    site: 'design-type-text-login-07',
    name: 'design',
    split: 'train',
    scenarios: ['login'],
    template: 'type-text/fields',
    design: {
      title: '',
      placeholderAlways: ' ',
      parts: {
        makeBox: (base) => (e) => {
          const box = base(e);
          if (e.f.type === 'password') box.classList.add('ft-password');
          return box;
        },
        fieldDone: (base) => (ctx, e, look) => {
          base(ctx, e, look);
          if (e.f.type === 'password') {
            const eye = ctx.util.el('button', 'ft-eye', e.box);
            eye.type = 'button';
            eye.tabIndex = -1;
            eye.setAttribute('aria-label', 'Show password');
            eye.setAttribute('aria-pressed', 'false');
            eye.addEventListener('click', () => {
              const shown = e.el.type === 'password';
              e.el.type = shown ? 'text' : 'password';
              eye.setAttribute('aria-label', shown ? 'Hide password' : 'Show password');
              eye.setAttribute('aria-pressed', String(shown));
            });
          }
        },
        saveButton: (base) => (ctx, btn, row, card) => {
          base(ctx, btn, row, card);
          card.id = 'ft-login-form';
          btn.setAttribute('form', card.id);
          btn.textContent = 'Sign In';
          const links = document.querySelector('.ds-toplinks');
          if (links) {
            links.lastElementChild.replaceWith(btn);
            btn.classList.add('ds-header-save');
          }
        },
      },
    },
  });
})();
