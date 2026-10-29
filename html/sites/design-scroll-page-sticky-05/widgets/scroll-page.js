// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-sticky-05',
  name: 'design',
  split: 'train',
  scenarios: ['sticky'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      actionElement: (base, S) => (st, parent, action, cls) => {
        if (st.spec.scenario === 'sticky' && parent.classList.contains('ps-row')) {
          const pane = Object.values(st.panes).find(candidate => candidate.list === parent.parentElement);
          if (pane) {
            // Keep the template's full-row visibility and thumb geometry in step
            // with this design's compact newspaper rows and pinned heading.
            pane.pitch = 32;
            pane.hh = 32;
          }
        }
        const control = base(st, parent, action, cls);
        if (st.spec.scenario === 'sticky' && parent.classList.contains('ps-row')) {
          const head = parent.parentElement.querySelector('.ps-shead');
          if (!head.querySelector('.paper-category-cell')) {
            const count = document.querySelector('.paper-summary .paper-stat b');
            if (count) count.textContent = String(st.spec.pane.rows.length);
            head.firstElementChild.textContent = 'Title';
            head.lastElementChild.textContent = '';
            const label = st.el('span', 'paper-category-cell', head, 'Category');
            head.insertBefore(label, head.children[1]);
          }
          if (!parent.querySelector('.paper-category-cell')) {
            const index = Array.from(parent.parentElement.querySelectorAll('.ps-row')).indexOf(parent);
            const category = st.el('span', 'paper-category-cell', parent, index < 5 ? 'Account help' : index < 9 ? 'Using the website' : 'Troubleshooting');
            parent.insertBefore(category, parent.children[1]);
          }
          let tools = parent.querySelector('.paper-row-tools');
          if (!tools) {
            tools = st.el('span', 'paper-row-tools', parent);
          }
          tools.appendChild(control);
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
