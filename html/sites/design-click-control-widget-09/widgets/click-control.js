// CRM form design: custom widget headings and grouped contact, options, and action areas.
env.widget({
  task: 'click-control',
  site: 'design-click-control-widget-09',
  name: 'design',
  split: 'train',
  scenarios: ['widget'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    obstacle: true,
    headings: {
      text: 'Full Name:',
      textarea: 'Message:',
      radio: 'Choose a fruit:',
      checkbox: 'I agree:',
      button: 'Action:',
      other: 'Learn more:',
    },
    parts: {
      widgetsBuilt: (base) => (ctx, card, rows) => {
        const { spec, util } = ctx;
        card.style.gridTemplateColumns = '';
        const fields = util.el('div', 'crm-fields', card);
        const contact = util.el('fieldset', 'crm-group crm-contact', card);
        util.el('legend', '', contact, 'Preferred Contact Method');
        const options = util.el('fieldset', 'crm-group crm-options', card);
        util.el('legend', '', options, 'Account Options');
        const actions = util.el('div', 'crm-actions', card);
        rows.forEach((row, i) => {
          const type = spec.widgets[i].type;
          const parent = type === 'radio' ? contact : type === 'checkbox' ? options : type === 'button' ? actions : fields;
          parent.appendChild(row);
          if (type === 'radio' || type === 'checkbox') row.querySelector('.widget-heading').hidden = true;
        });
        if (!contact.querySelector('.uc-widget')) util.el('p', 'crm-empty', contact, 'No contact method selected.');
        if (!options.querySelector('.uc-widget')) util.el('p', 'crm-empty', options, 'No account options selected.');
        if (!actions.children.length) actions.hidden = true;
      },
    },
  },
});
