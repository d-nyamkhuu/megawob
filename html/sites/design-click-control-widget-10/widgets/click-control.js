// Design of this site on the click-control/controls template (templates/click-control/controls.js): a survey form; the widgets
// of each type sit in a titled group, in the order text, radio, checkbox, textarea, button.
(function () {
  'use strict';
  const TITLES = {
    text: 'Your name',
    textarea: 'Your feedback',
    radio: 'How would you rate city services?',
    checkbox: 'Areas of interest (select all that apply)',
    button: 'Send feedback',
  };
  let groups = new Map();
  env.widget({
    task: 'click-control',
    site: 'design-click-control-widget-10',
    name: 'design',
    split: 'train',
    scenarios: ['widget'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      parts: {
        widgetsStart: () => (ctx, card) => {
          const { spec, util } = ctx;
          groups = new Map();
          const order = ['text', 'radio', 'checkbox', 'textarea', 'button'].filter((type) =>
            spec.widgets.some((w) => w.type === type),
          );
          if (!order.includes('radio') && order.includes('textarea'))
            order.splice(1, 0, ...order.splice(order.indexOf('textarea'), 1));
          order.forEach((type) => {
            const group = util.el('section', 'widget-group group-' + type, card);
            util.el('strong', 'widget-heading', group, TITLES[type] || 'Learn more about our plans:');
            const fields = util.el('div', 'widget-fields', group);
            if (type === 'textarea' && spec.widgets.filter((w) => w.type === type).length > 2 && order.length <= 3)
              group.style.gridRow = 'span 2';
            groups.set(type, fields);
          });
        },
        widgetHeading: () => () => null,
        widgetPlace: () => (ctx, card, row, wd) => (groups.get(wd.type) || card).append(row),
      },
    },
  });
})();
