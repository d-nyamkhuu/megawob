// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-hscroll-03',
  name: 'design',
  split: 'train',
  scenarios: ['hscroll'],
  template: 'scroll-page/longform',
  design: {
    cardWidth: [220, 220], cardHeight: [220, 220], foreground: '#0c162b', muted: '#61708d', accent: '#2f7bff',
    parts: {
      rendered: (base, S) => function (st) {
        const stage = st.ctx.stage;
        const intro = st.el('div', 'finance-intro', stage);
        const hero = st.el('div', 'finance-hero', intro);
        const copy = st.el('div', 'finance-hero-text', hero);
        st.el('div', 'finance-eyebrow', copy, 'GUIDE');
        st.el('h1', '', copy, 'Building a stronger financial future');
        st.el('p', '', copy, 'Practical steps, expert insights and helpful resources to help you take control of your money and work toward your goals.');
        st.el('div', 'finance-hero-image', hero);
        const why = st.el('section', 'finance-why', intro);
        st.el('h2', '', why, 'Why financial wellness matters');
        st.el('p', '', why, 'A solid financial foundation can give you more freedom, less stress and greater opportunities for the future. Whether you’re just getting started or looking to refine your strategy, small, consistent steps can make a big difference over time.');
        const host = st.el('section', 'finance-articles', stage);
        const row = st.el('div', 'finance-articles-head', host);
        st.el('h2', '', row, 'Help articles');
        const viewAll = st.el('a', 'finance-view-all', row, 'View all  ›');
        stage.prepend(intro);
        intro.after(host);
        const strip = st.ctx.stage.querySelector('.ps-pane.ps-hbox');
        viewAll.addEventListener('click', () => { if (strip) strip.querySelector('.ps-list').scrollLeft = strip.querySelector('.ps-list').scrollWidth; });
        if (strip && host) {
          const section = strip.closest('.ps-sec');
          if (section) {
            // Keep the section's seeded links and actions in the article.
            // Only the horizontally scrolling pane belongs in the preview strip.
            host.append(strip);
          }
        }
        base(st);
        // The template sampled visibility before this pane was placed in the
        // preview. Refresh its scroll model against the final geometry.
        S.P.onScroll(st);
      },
      decorated: (base, S) => function (st, element, kind, data) {
        base(st, element, kind, data);
        if (kind === 'card') {
          const picture = st.el('div', 'finance-card-photo', null);
          const index = Array.from(element.parentElement.children).indexOf(element) % 5;
          picture.classList.add('finance-thumb-' + index);
          element.prepend(picture);
          const summaries = [
            'Practical steps to build a plan and keep moving forward.',
            'Find out what matters most and how to improve it.',
            'Explore useful strategies and avoid common costs.',
            'Get tips on making a plan that works at any stage.',
            'Learn options that help you stay on track.'
          ];
          const description = st.el('div', 'finance-card-description', null, summaries[index]);
          const metadata = element.querySelector('.m');
          if (metadata) element.insertBefore(description, metadata);
        }
      },
    },
  },
});
