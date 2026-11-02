// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-sticky-01',
  name: 'design',
  split: 'train',
  scenarios: ['sticky'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      actionElement: (base, S) => (st, parent, action, cls) => {
        const control = base(st, parent, action, cls);
        if (st.spec.scenario === 'sticky' && parent.classList.contains('ps-row')) {
          // A focused row action needs its complete row in the page's usable view.
          // Keep the template's visibility gate and native pane scrolling intact.
          control.addEventListener('focus', () => {
            const row = parent.getBoundingClientRect();
            const top = S.P.stickyBottom() + 8;
            const bottom = window.innerHeight - 8;
            const delta = row.top < top ? row.top - top
              : row.bottom > bottom ? row.bottom - bottom : 0;
            if (delta) {
              window.scrollBy({ top: delta, behavior: 'instant' });
              S.P.onScroll(st);
            }
          });
        }
        return control;
      },
    },
  },
});
