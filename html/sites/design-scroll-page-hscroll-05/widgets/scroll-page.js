// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-hscroll-05',
  name: 'design',
  split: 'train',
  scenarios: ['hscroll'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      stickyBottom: (base) => function () {
        const nav = document.querySelector('.gnome-menubar');
        return Math.max(base(), nav ? nav.getBoundingClientRect().bottom : 0);
      },
      // Same header (draws and tool actions kept); the seeded title block is hidden behind a Help Center hero.
      header: (base) => function (st) {
        const head = base(st);
        head.classList.add('aq-head');
        st.helpSheet = st.el('div', 'aq-sheet', null);
        st.main.insertBefore(st.helpSheet, head);
        st.helpSheet.appendChild(head);
        const hero = st.el('div', 'aq-hero', null);
        st.el('h1', 'aq-hero-title', hero, 'Creative Suite Help Center');
        st.el('div', 'aq-hero-sub', hero, 'Practical guidance, tutorials, and troubleshooting for your creative work.');
        st.el('span', 'aq-feather', hero);
        const instruction = document.querySelector('.ref-instruction');
        if (instruction) {
          hero.appendChild(instruction);
          hero.classList.add('aq-with-instruction');
        }
        const tools = head.querySelector('.ps-tools');
        if (tools) st.main.appendChild(tools);
        head.insertBefore(hero, head.firstChild);
        return head;
      },
      // Same spacer (draws kept); static Get started / Popular topics blocks are placed before it.
      spacer: (base) => function (st) {
        const spacer = base(st);
        const blk = st.el('section', 'aq-static', null);
        st.el('h2', '', blk, 'Get started');
        const gs = st.el('div', 'aq-gs', blk);
        [['Learn the basics', 'Quick tutorials for new users'], ['Explore features', 'Discover what’s new in this release'],
          ['Fix a problem', 'Troubleshooting and support'], ['Join the community', 'Share ideas and get help from others']].forEach(([t, d], i) => {
          const c = st.el('div', 'aq-gs-item', gs);
          st.el('i', 'aq-gs-ic n' + i, c);
          const x = st.el('div', '', c);
          st.el('b', '', x, t);
          st.el('span', '', x, d);
        });
        st.el('h2', 'aq-pt', blk, 'Popular topics');
        const pl = st.el('div', 'aq-pop', blk);
        ['Working with layers', 'File formats and compatibility', 'Color correction basics', 'Printing and output',
          'Exporting for web', 'Plug-ins and extensions', 'Keyboard shortcuts', 'Performance tips'].forEach((t) => st.el('span', '', pl, t));
        st.helpSheet.appendChild(blk);
        spacer.style.display = 'none';
        return spacer;
      },
      container: (base) => function (st, sec) {
        const before = sec.children.length;
        const result = base(st, sec);
        const feature = st.el('section', 'aq-articles', null);
        for (const node of Array.from(sec.children).slice(before)) feature.appendChild(node);
        feature.firstElementChild?.classList.add('aq-articles-title');
        const block = st.main.querySelector('.aq-static');
        block.insertAdjacentElement('afterend', feature);
        return result;
      },
    },
  },
});
