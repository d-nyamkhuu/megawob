// Uses this site's two-column civic count variable and keyboard-operable shade tiles.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-02',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columnVar: '--civic-columns',
    columnDivisor: 2,
    parts: {
      tile: (base, S) => (ctx, d, i) => {
        d.tabIndex = 0;
        d.setAttribute('aria-label', `Color tile ${i + 1}`);
        d.addEventListener('keydown', (e) => {
          if (e.key !== ' ' && e.key !== 'Enter') return;
          e.preventDefault();
          d.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              ctrlKey: e.ctrlKey,
              metaKey: e.metaKey,
              shiftKey: e.shiftKey,
            }),
          );
        });
      },
    },
  },
});
