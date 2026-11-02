// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-copy-01',
  name: 'design',
  split: 'train',
  scenarios: ['copy'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      toc(base, S) {
        return (st) => {
          const { spec, main, el, tocEls } = st;
          if (spec.scenario !== 'copy') return base(st);
          const nav = el('nav', 'ps-toc ps-product-tabs', main);
          const entries = spec.sections.map((section) => [section.id, section.heading]);
          if (spec.faq) entries.splice(spec.faq.at + 1, 0, ['faq', 'FAQ']);
          entries.forEach(([id, label]) => {
            const link = el('a', '', nav, label);
            link.href = '#';
            link.dataset.role = 'toc';
            link.addEventListener('click', (event) => {
              event.preventDefault();
              S.P.jump(st, id);
            });
            tocEls[id] = link;
          });
        };
      },
      spacer(base, S) {
        return (st) => {
          const original = base(st);
          if (st.spec.scenario === 'copy' && !original.classList.contains('ps-fig')) {
            const figure = st.el('figure', 'ps-fig ps-product-photo', st.main);
            figure.setAttribute('aria-hidden', 'true');
            figure.style.height = '186px';
          }
          return original;
        };
      },
      header(base, S) {
        return (st) => {
          const { el, main, spec, rng } = st;
          const serif = spec.kind === 'article' && rng.bool(0.6);
          const head = el('header', 'ps-head ps-product-head', main);
          const logo = el('div', 'ps-product-mark', head);
          logo.setAttribute('aria-hidden', 'true');
          logo.innerHTML = '<svg viewBox="0 0 52 52" width="52" height="52"><path fill="#1c72d8" d="M5 8h42c2 0 3 2 2 4L29 47c-1 2-4 2-5 0L3 12c-1-2 0-4 2-4z"/><path fill="#1555b8" d="M24 10h19L27 40z"/><path fill="#438de8" d="M8 12h14L12 29z"/></svg>';
          const copy = el('div', 'ps-product-copy', head);
          el('h1', `ps-title${serif ? ' serif' : ''}`, copy, 'Vertex Desktop');
          el('div', 'ps-product-subtitle', copy, 'Product Information');
          const tools = el('div', 'ps-tools ps-product-tools', head);
          for (const a of spec.tools) S.P.action(st, tools, a, 'ps-tool');
          return head;
        };
      },
    },
  },
});
