// Login card adds its welcome copy, sign-in links, and compact-height scaling.
(function () {
  'use strict';

  env.widget({
    task: 'type-text',
    site: 'design-type-text-login-02',
    name: 'design',
    split: 'train',
    scenarios: ['login'],
    scrollable: (spec) => !!spec.long,
    template: 'type-text/fields',
    design: {
      layout: 'stacked',
      title: 'Welcome Back',
      parts: {
        placeholder: (base) => (f, text, look, floating) => {
          const value = base(f, text, look, floating);
          if (value !== undefined) return value;
          return 'Enter your ' + f.label.toLowerCase();
        },
        beforeFields: () => (ctx, grid) => {
          const subtitle = document.createElement('div');
          subtitle.className = 'ds-welcome-sub';
          subtitle.textContent = 'Log in to your account to continue.';
          grid.parentElement.insertBefore(subtitle, grid);
        },
        finish: () => (ctx, card) => {
          const row = document.createElement('div');
          row.className = 'ds-row';
          row.innerHTML = '<span class="ds-keep"><span class="ds-box"></span>Keep me signed in</span><span class="ds-forgot">Forgot password?</span>';
          card.appendChild(row);
          const footer = document.querySelector('.ds-footer');
          if (footer) card.appendChild(footer);
          card.style.width = '100%';
          const rect = card.getBoundingClientRect();
          const ratio = Math.min(1, (Math.max(ctx.size.height, ctx.stage.clientHeight) - 8) / rect.height);
          if (ratio < 1) {
            card.style.setProperty('transform', `scale(${ratio})`, 'important');
            card.style.transformOrigin = 'top left';
            card.style.width = (100 / ratio) + '%';
          }
        },
      },
    },
  });
})();
