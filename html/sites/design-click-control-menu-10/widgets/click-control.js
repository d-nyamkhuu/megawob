// This design adds the site-specific contact table and hides its submenu caret glyph.
env.widget({
  task: 'click-control',
  site: 'design-click-control-menu-10',
  name: 'design',
  split: 'train',
  scenarios: ['menu'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      menuPrelude: () => (ctx, content) => {
        const { util } = ctx;
        const list = util.el('div', 'contact-list', content);
        const heading = util.el('div', 'contact-heading', list);
        ['Name', 'Role', 'Department', 'Location', 'Status', ''].forEach((h) => util.el('span', '', heading, h));
        const people = [
          ['Ada', 'Designer', 'Product', 'New York', 'Active'],
          ['Arturo', 'Manager', 'Operations', 'Chicago', 'Active'],
          ['Bea', 'Analyst', 'Finance', 'Boston', 'Away'],
          ['Chen', 'Engineer', 'Platform', 'Austin', 'Active'],
          ['Diego', 'Researcher', 'Insights', 'Denver', 'Active'],
          ['Elena', 'Director', 'Strategy', 'New York', 'Away'],
          ['Fatima', 'Coordinator', 'Support', 'Toronto', 'Active'],
        ];
        people.forEach((p) => {
          const row = util.el('div', 'contact-row' + (p[0] === 'Arturo' ? ' hl' : ''), list);
          p.forEach((c, i) => {
            util.el('span', i === 4 ? 'st' + (c === 'Away' ? ' away' : '') : '', row, c);
          });
          util.el('span', 'dots', row, '•••');
        });
      },
      caret: (base, S) => (el) => {
        S.ctx.util.el('span', 'car', el).setAttribute('aria-hidden', 'true');
      },
    },
  },
});
