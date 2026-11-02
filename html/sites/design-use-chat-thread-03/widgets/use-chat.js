// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-thread-03',
  name: 'design',
  split: 'train',
  scenarios: ['thread'],
  template: 'use-chat/workspace',
  design: {
    inset: '0px',
    radius: '0px',
    // The desktop frame supplies the toolbar and horizontal channel navigation.
    parts: {
      topbar: () => () => {},
      rail: () => () => {},
      navigation: (base, S) => () => {
        const el = S.ctx.util.el('div', 'ch-navitem');
        const text = S.ctx.util.el('span', '', el, S.spec.channelName);
        return { el, text };
      },
      channelTabs: () => () => {},
    },
  },
});
