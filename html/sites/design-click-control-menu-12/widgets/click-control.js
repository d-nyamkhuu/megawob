// Design of this site on click-control/controls: library icons replace the menu trigger and item icons.
env.widget({
  task: 'click-control',
  site: 'design-click-control-menu-12',
  name: 'design',
  split: 'train',
  scenarios: ['menu'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      menuTrigger: () => () => `${window.refLibraryIcon('book')}<span>Menu</span>`,
      itemIcon: (base, S) => (el, n) => {
        if (S.spec.mode !== 'button') {
          el.innerHTML = window.refLibraryIcon('person');
          return;
        }
        const decorativeIcon = { Settings: 'gear', Help: 'menuHelp', Security: 'security', Exit: 'exit' }[n.label];
        if (decorativeIcon) el.innerHTML = window.refLibraryIcon(decorativeIcon);
        else base(el, n);
      },
    },
  },
});
