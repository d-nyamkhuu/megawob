// This design adds the five extra contacts and keeps the menu trigger labeled "Menu".
env.widget({
  task: 'click-control',
  site: 'design-click-control-menu-09',
  name: 'design',
  split: 'train',
  scenarios: ['menu'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    menuLabel: 'Menu',
    parts: {
      menuPrelude: () => (ctx, content) => {
        const { util } = ctx;
        const list = util.el('div', 'contact-list', content);
        const heading = util.el('div', 'contact-heading', list);
        util.el('span', 'name-column', heading, 'Name');
        util.el('span', 'email-column', heading, 'Email');
        const names = [
          'Arturo', 'Bianca', 'Chen', 'Diego', 'Elena', 'Freda', 'George', 'Hiro', 'Isabel',
          'Jamal', 'Keiko', 'Leon', 'Marta', 'Nico', 'Olga', 'Pavel', 'Quinn',
        ];
        names.forEach((name) => {
          const row = util.el('div', 'contact-row', list);
          row.innerHTML = '<svg viewBox="0 0 20 24" fill="#8996a6" stroke="#576273"><circle cx="10" cy="6" r="4"/><path d="M3 22v-6c0-8 14-8 14 0v6Z"/></svg>';
          util.el('span', '', row, name);
        });
      },
    },
  },
});
