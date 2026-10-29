// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-siblings-01',
  name: 'design',
  split: 'train',
  scenarios: ['siblings'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      // Keep fixed utility controls outside the direct-child sheet styling.
      floatButton: (base) => (st) => {
        const button = base(st);
        st.wrap.append(button);
        return button;
      },
      away: (base) => (st) => {
        const panel = base(st);
        st.wrap.append(panel.away);
        return panel;
      },
    },
  },
});
