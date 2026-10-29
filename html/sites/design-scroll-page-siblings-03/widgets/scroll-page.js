// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-siblings-03',
  name: 'design',
  split: 'train',
  scenarios: ['siblings'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      // Keep utility controls outside the stage's direct-child page-card styling.
      floatButton: (base) => (st) => {
        const button = base(st);
        st.wrap.appendChild(button);
        return button;
      },
      away: (base) => (st) => {
        const panel = base(st);
        st.wrap.appendChild(panel.away);
        return panel;
      },
    },
  },
});
