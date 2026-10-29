// Design of this site on click-control/controls: adds the mail message and places the real controls in the action bar.
env.widget({
  task: 'click-control',
  site: 'design-click-control-button-12',
  name: 'design',
  split: 'train',
  scenarios: ['button'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const result = base(ctx);
        const { page, content } = result;
        const message = ctx.util.el('div', 'message', page);
        ctx.util.el('p', '', message, 'Hi team,');
        ctx.util.el(
          'p',
          '',
          message,
          'Here is the latest update on the project. Please review and let me know if you have any questions.',
        );
        ctx.util.el('p', '', message, 'Thanks,\nAlex');
        page.insertBefore(message, content);
        return result;
      },
      rendered: () => (ctx, page, content) => {
        const actions = document.querySelector('.task-actions');
        if (actions) {
          const buttons = content.querySelectorAll('.uc-btn');
          actions.classList.toggle('many-actions', buttons.length > 2);
          buttons.forEach((button) => actions.append(button));
        }
      },
    },
  },
});
