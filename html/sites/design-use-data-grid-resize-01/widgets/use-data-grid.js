// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-resize-01',
  name: 'design',
  split: 'train',
  scenarios: ['resize'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Inventory Pro',
    parts: {
      appbar: (_base, S) => () => {
          const el = (tag, cls, parent, text) => S.util.el(tag, cls, parent, text);
          S.shell = el('section', 'to-workspace', S.ctx.stage);
          S.shell.setAttribute('aria-label', 'Orders window');
          S.appbar = el('div', 'to-appbar mac-window-titlebar', S.shell);
          el('span', 'window-traffic', S.appbar).innerHTML = '<i></i><i></i><i></i>';
          el('strong', 'window-title', S.appbar, 'Orders');
          S.utility = null;
        },
      card: (base, S) => () => {
          base();
          Object.assign(S.card.style, { left: '0px', top: '44px', width: '100%', height: 'calc(100% - 44px)' });
          S.card.classList.remove('upper');
        },
    },
  },
});
