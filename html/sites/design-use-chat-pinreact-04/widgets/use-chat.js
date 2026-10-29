// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-pinreact-04',
  name: 'design',
  split: 'train',
  scenarios: ['pinreact'],
  template: 'use-chat/workspace',
  design: {
    parts: {
      // This design keeps the channel index but omits the template's top bar and generic workspace destinations.
      topbar: () => () => {},
      navItem: (base) => (kind, label, count, active) => {
        const row = base(kind, label, count, active);
        if (['Activity', 'Threads', 'Drafts & sent', 'Later', 'Autumn release', 'Website refresh'].includes(label)) row.el.remove();
        return row;
      },
      navGroup: (base, S) => (label) => {
        base(label);
        if (label === 'Projects') S.navScroll.lastElementChild.remove();
      },
    },
  },
});
