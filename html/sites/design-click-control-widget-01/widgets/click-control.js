// This design keeps the widget headings used by the original site.
env.widget({
  task: 'click-control',
  site: 'design-click-control-widget-01',
  name: 'design',
  split: 'train',
  scenarios: ['widget'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    headings: {
      text: 'Your name',
      textarea: 'Message',
      radio: 'How did you hear about us?',
      checkbox: 'Subscribe to updates',
      button: 'Action',
      other: 'Learn more',
    },
  },
});
