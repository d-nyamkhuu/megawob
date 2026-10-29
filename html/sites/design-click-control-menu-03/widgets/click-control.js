// Menu items keep their fallback icons, and the menu's decoy actions carry icons.
env.widget({
  task: 'click-control',
  site: 'design-click-control-menu-03',
  name: 'design',
  split: 'train',
  scenarios: ['menu'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    decoysBefore: [['New Contact...', 'copy'], ['Open Group...', 'folder']],
    decoysAfter: [['Import...', 'download'], ['Export...', 'mail']],
    parts: {
      itemIcon: (base, S) => (el, n) => {
        el.dataset.icon = n.icon || 'user';
        el.innerHTML = S.icon(n.icon || 'user');
      },
    },
  },
});
