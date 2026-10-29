// Design of this site on click-control/controls: displays only the user's action history.
env.widget({
  task: 'click-control',
  site: 'design-click-control-sequence-09',
  name: 'design',
  split: 'train',
  scenarios: ['sequence'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      synced: () => (ctx, m) => {
        const rows = document.querySelectorAll('.det .row');
        const clicks = m.clicks || [];
        if (rows[3]) rows[3].lastChild.textContent = clicks.length ? 'In progress' : 'Not started';
        const last = clicks.length
          ? ctx.spec.buttons.find((b) => String(b.key) === String(clicks[clicks.length - 1]))
          : null;
        if (rows[4]) rows[4].lastChild.textContent = last ? last.label : 'None';
        const log = document.querySelector('.log-text');
        if (log)
          log.textContent = clicks.length
            ? clicks
                .map((key, i) => `${i + 1}. ${ctx.spec.buttons.find((b) => String(b.key) === String(key))?.label || key}`)
                .join('\n')
            : 'No actions yet.';
      },
    },
  },
});
