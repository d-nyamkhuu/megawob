// Design on templates/use-desktop-tools/base.js: the base site's use-desktop-tools widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-prefs-01',
  name: 'design',
  split: 'train',
  scenarios: ['prefs'],
  template: 'use-desktop-tools/base',
  design: {
    parts: {
      ensureStyle: base => () => {
        base();
        if (document.getElementById('deskmate-prefs-style')) return;
        const style = document.createElement('style');
        style.id = 'deskmate-prefs-style';
        style.textContent = `
          /* Keep every seeded tab reachable within the desktop dialog. */
          .at-tabs { flex-wrap: wrap; }
          .at-tab { flex: 1 0 auto; }
        `;
        document.head.append(style);
      },
    },
  },
});
