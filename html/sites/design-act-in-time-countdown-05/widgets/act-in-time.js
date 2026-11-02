// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-countdown-05',
  name: 'design',
  split: 'train',
  scenarios: ['countdown'],
  template: 'act-in-time/base',
  traits: { countdown: { hold: 18000 } },
  design: {
    parts: {
      buildCountdown: (base) => (ctx, f) => {
        // Keep the template's controls, event handlers, locate targets and RNG draws.
        const view = base(ctx, f);
        const main = f.body.querySelector('.ut-main');
        const card = main.querySelector('.ut-hold');
        card.style.setProperty('--groups', ctx.spec.groups.length);
        const picture = ctx.util.el('div', 'gem-product-picture', main);
        const image = ctx.util.el('img', '', picture);
        image.src = new URL('assets/shirt.svg', document.querySelector('script[src*="sites/design-act-in-time-countdown-05/site.js"]').src).href;
        image.alt = 'Ridge Line cotton T-shirt';
        main.insertBefore(picture, card);
        const head = card.querySelector('.ut-holdhead');
        ctx.util.el('div', 'gem-product-copy', head, 'Classic cotton tee with a relaxed fit.\nDurable, everyday comfort.\n100% cotton.');
        const timer = head.querySelector('.ut-timer');
        const timerBox = ctx.util.el('div', 'gem-timer-box', head);
        ctx.util.el('div', 'gem-timer-label', timerBox, 'Hold expires in:');
        timerBox.append(timer, card.querySelector('.ut-holdbar'));
        card.querySelectorAll('.ut-chip').forEach((button) => {
          const color = { Black: '#080808', White: '#fff', Grey: '#8c8c8c', Gray: '#8c8c8c', Navy: '#003b78' }[button.textContent];
          if (color) {
            button.classList.add('gem-color-option');
            button.style.setProperty('--swatch', color);
          }
        });
        const confirm = card.querySelector('.ut-btn.primary');
        const cart = ctx.util.el('span', 'gem-cart-icon', confirm);
        cart.innerHTML = '<svg viewBox="0 0 34 34" aria-hidden="true"><path d="m2 4 4 1 5 18h15l4-14H8M11 18h16M17 10v7M24 10v7" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="14" cy="28" r="2.4"/><circle cx="25" cy="28" r="2.4"/></svg>';
        confirm.insertBefore(cart, confirm.firstChild);
        return {
          ...view,
          sync(model) {
            view.sync(model);
            timer.dataset.time = timer.textContent.replace(/^Held for /, '');
          },
        };
      },
    },
  },
});
