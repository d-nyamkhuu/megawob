// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-siblings-04',
  name: 'design',
  split: 'train',
  scenarios: ['siblings'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      // Keep the recovery panel outside the inherited direct-child article styling.
      away: (base) => (st) => {
        const panel = base(st);
        st.wrap.appendChild(panel.away);
        return panel;
      },
    },
  },
});
