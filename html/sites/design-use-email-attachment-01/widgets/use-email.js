// Design on templates/use-email/base.js: the base site's use-email widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-email',
  site: 'design-use-email-attachment-01',
  name: 'design',
  split: 'train',
  scenarios: ['attachment'],
  traits: { search: true, rowIcons: [] }, // the design shows no row icons: the oracle acts through the message toolbar
  template: 'use-email/base',
  design: {
    parts: {
      'mailTopActions': (base, S) => function mailTopActions(ctx, nodes) {
        const { util } = ctx;
        const { app, topEl, composeInSide } = nodes;
        if (!composeInSide) {
          const actions = util.el('div', 'am-actions', topEl);
          const groups = [
            [['Delete', '<path d="M4 6h12M8 6V4h4v2m-6 0 1 11h6l1-11M9 9v5m2-5v5"/>'], ['Archive', '<path d="M3 4h14v4H3zM4 8v8h12V8m-5 3H9"/>']],
            [['Reply', '<path d="M9 5 4 10l5 5M4 10h7c3 0 5 2 5 5"/>'], ['Reply All', '<path d="m10 5-5 5 5 5M6 5l-5 5 5 5m0-5h6c3 0 5 2 5 5"/>'], ['Forward', '<path d="m11 5 5 5-5 5m5-5H9c-3 0-5 2-5 5"/>']],
            [['More', '<circle cx="4" cy="10" r="1"/><circle cx="10" cy="10" r="1"/><circle cx="16" cy="10" r="1"/>']]
          ];
          for (const group of groups) {
            const g = util.el('div', 'am-action-group', actions);
            for (const [label, path] of group) {
              const b = util.el('button', 'am-action', g);
              b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
              b.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true">${path}</svg>`;
              b.addEventListener('click', () => {
                const target = [...app.querySelectorAll('button[aria-label],button[title]')].find(x => x !== b && (x.getAttribute('aria-label') === label || x.title === label));
                if (target) target.click();
              });
            }
          }
        }

      },
      'mailBlank': () => () => 'Select an email from the list to view it here.',
    },
  },
});
