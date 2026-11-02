// Design of this site on click-control/controls: custom widget groups and headings match its form layout.
(function () {
  'use strict';

  let fields, choices, extras;

  env.widget({
    task: 'click-control',
    site: 'design-click-control-widget-12',
    name: 'design',
    split: 'train',
    scenarios: ['widget'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      obstacle: false,
      headings: {
        text: 'Name:',
        textarea: 'Message:',
        radio: 'Choose a fruit:',
        checkbox: 'I agree:',
        button: 'Action:',
        other: 'Learn more:',
      },
      parts: {
        widgetGrid: () => () => {},
        widgetsStart: () => (ctx, card) => {
          const { util } = ctx;
          fields = util.el('div', 'widget-fields', card);
          choices = ctx.spec.widgets.some((w) => w.type === 'radio')
            ? util.el('fieldset', 'widget-choices', fields)
            : null;
          if (choices) util.el('legend', '', choices, 'Choose a fruit:');
          extras = util.el('div', 'widget-extras', card);
        },
        widgetHeading: (base, S) => (ctx, row, wd) => {
          const labels = S.D.headings;
          const heading = ctx.util.el('strong', 'widget-heading', row, wd.type in labels ? labels[wd.type] : labels.other);
          row.prepend(heading);
          if (wd.type === 'radio' || wd.type === 'checkbox') heading.hidden = true;
          return heading;
        },
        widgetPlace: () => (ctx, card, row, wd) => {
          (wd.type === 'radio' ? choices : wd.type === 'text' || wd.type === 'textarea' ? fields : extras).appendChild(row);
        },
        widgetsBuilt: () => () => {
          const actions = document.querySelector('.actions');
          if (actions) extras.appendChild(actions);
        },
      },
    },
  });
})();
