// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-toggle-03',
  name: 'design',
  split: 'train',
  scenarios: ['toggle'],
  template: 'change-settings/preferences',
  design: {
    parts: {
      begin: (base) => (ctx) => {
        document.documentElement.classList.toggle('civic-page-scroll', !!ctx.episode?.scrollable);
        base(ctx);
      },
      card: (base, S) => (ctx, wrap) => {
        const card = base(ctx, wrap);
        if (!S.geo.long) card.style.height = `${ctx.size.height}px`;
        return card;
      },
      panel: (base, S) => (ctx, body) => {
        const panel = base(ctx, body);
        Object.assign(panel.style, { width: '100%', minWidth: '0', padding: '0' });
        if (!S.geo.long) Object.assign(panel.style, { height: 'auto', minHeight: '0', overflow: 'auto' });
        return panel;
      },
      toggle: (base) => (ctx, row, setting) => {
        const control = base(ctx, row, setting);
        const group = ctx.util.el('div', `civic-toggle-control${control.onoff ? ' civic-toggle-labelled' : ''}`, row);
        group.append(control.ctl);
        if (control.onoff) group.append(control.onoff);
        return control;
      },
      navigation: (base, S) => (ctx, body) => {
        base(ctx, body);
        if (S.geo.long) {
          const index = Object.values(S.els.navEls)[0]?.parentElement;
          if (index) index.style.position = 'static';
        }
      },
    },
  },
});
