// This widget design uses the site's original captions and adds its textarea scrollbar decoration.
env.widget({
  task: 'click-control',
  site: 'design-click-control-widget-02',
  name: 'design',
  split: 'train',
  scenarios: ['widget'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    headings: {
      text: 'Name:',
      textarea: 'Comments:',
      radio: 'Contact method:',
      checkbox: 'I agree:',
      button: 'Action:',
      other: 'Learn more:',
    },
    parts: {
      widgetHeading: (base) => (ctx, row, wd, i) => {
        if (wd.type === 'textarea') {
          const scroll = ctx.util.el('span', 'gem-scroll', row);
          scroll.setAttribute('aria-hidden', 'true');
          scroll.innerHTML = '<b>▲</b><i></i><b>▼</b>';
        }
        return base(ctx, row, wd, i);
      },
    },
  },
});
