// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-carousel-04',
  name: 'design',
  split: 'train',
  scenarios: ['carousel'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      frame(base, S) { return (st) => {
        const f = base(st);
        const { ctx, el } = st;
        const hero = el('div', 'fluent-hero', ctx.stage);
        ctx.stage.insertBefore(hero, f.wrap);
        f.hero = hero;
        f.wrap.className = 'ps-wrap fluent-columns';
        f.wrap.style.width = '100%';
        f.wrap.style.maxWidth = 'none';
        f.wrap.style.margin = '0';
        f.wrap.style.padding = '30px 4.5% 0';
        f.wrap.style.display = 'grid';
        f.wrap.style.gridTemplateColumns = '245px minmax(0, 1fr) minmax(270px, 24%)';
        f.wrap.style.columnGap = '5.0%';
        f.main.style.gridColumn = '2';
        f.main.style.gridRow = '1';
        let side = f.sideNav;
        if (!side) side = el('nav', 'ps-side fluent-toc', f.wrap);
        side.classList.add('fluent-toc');
        side.style.gridColumn = '1';
        side.style.gridRow = '1';
        f.sideNav = side;
        let rail = f.wrap.querySelector('.ps-rail');
        if (!rail) {
          rail = el('aside', 'ps-rail fluent-tip', f.wrap);
          el('h4', '', rail, 'Quick tip');
          el('p', '', rail, 'Look for activities that match your interests and fitness level. Even short bursts of activity can make a big difference.');
        }
        rail.classList.add('fluent-tip');
        rail.style.gridColumn = '3';
        rail.style.gridRow = '1';
        return f;
      }; },
      rail(base, S) { return (st, wrap) => {
        const { el, rng, spec } = st;
        // Keep the template's rail draws so later seeded page content remains unchanged.
        rng.pick(S.D.railLabels);
        const c = env.content || {};
        const pool = c.HEADLINES && spec.kind === 'article' ? c.HEADLINES : c.TOPICS || ['Getting started', 'Billing basics', 'Security tips'];
        rng.sample(pool, 5);
        const rail = el('aside', 'ps-rail fluent-tip', wrap);
        el('h4', '', rail, 'Quick tip');
        el('p', '', rail, 'Look for activities that match your interests and fitness level. Even short bursts of activity can make a big difference.');
        return rail;
      }; },
      header(base, S) { return (st) => {
        const head = base(st);
        st.head = head;
        st.headerTools = head.querySelector('.ps-tools');
        if (st.headerTools) st.headerTools.remove();
        st.hero.appendChild(head);
        return head;
      }; },
      toc(base, S) { return (st) => {
        const original = st.layout;
        base(st);
        const toc = st.main.querySelector('.ps-toc');
        if (toc && st.sideNav) {
          const label = toc.querySelector('b');
          if (label) label.textContent = 'In this article';
          st.sideNav.appendChild(toc);
          toc.className = 'fluent-toc-list';
        }
        if (st.sideNav && !st.sideNav.querySelector('h4')) {
          const h = st.el('h4', '', st.sideNav, 'In this article');
          const first = st.sideNav.firstChild;
          if (first !== h) st.sideNav.insertBefore(h, first);
        }
        if (st.sideNav && !st.sideNav.querySelector('a')) {
          for (const sec of st.spec.sections) {
            const a = st.el('a', '', st.sideNav, sec.heading);
            a.href = '#';
            a.dataset.role = 'toc';
            a.addEventListener('click', (e) => { e.preventDefault(); S.P.jump(st, sec.id); });
            st.tocEls[sec.id] = a;
          }
          if (st.spec.faq) {
            const a = st.el('a', '', st.sideNav, 'Frequently asked questions');
            a.href = '#';
            a.addEventListener('click', (e) => { e.preventDefault(); S.P.jump(st, 'faq'); });
            st.tocEls.faq = a;
          }
          const top = st.el('a', 'ps-totop-inline', st.sideNav, S.D.topText);
          top.href = '#';
          top.addEventListener('click', (e) => S.P.toTop(st, e));
        }
        st.layout = 'docs';
        return original;
      }; },
      spacer(base, S) { return (st) => {
        const spacer = base(st);
        spacer.classList.add('fluent-spacer');
        return spacer;
      }; },
      fitPage(base, S) { return (st) => {
        // The reference opens with the carousel already in view; retain natural scrolling below it.
        if (S.P.docH() < 2 * window.innerHeight) {
          st.foot.style.paddingBottom = Math.round(240 + 2 * window.innerHeight - S.P.docH()) + 'px';
        }
      }; },
      section(base, S) { return (st, sec, i) => {
        const node = base(st, sec, i);
        if (i === 0 && st.spec.pane && st.spec.pane.at > 0) {
          const extras = [...node.children].slice(2);
          if (extras.length) {
            st.openingExtras = st.el('div', 'fluent-after-carousel');
            for (const child of extras) st.openingExtras.appendChild(child);
          }
        }
        if (st.spec.pane && i === st.spec.pane.at) {
          const carousel = node.querySelector('.ps-pane.ps-car');
          if (carousel) {
            const list = carousel.querySelector('.ps-list');
            // Wrapped slide copy and actions must fit within the horizontal scroller.
            list.style.minHeight = '176px';
            list.style.height = 'auto';
            const withImage = list.clientWidth >= 600 && st.ctx.stage.getBoundingClientRect().width > 1100;
            carousel.classList.toggle('fluent-carousel-compact', !withImage);
            for (const slide of list.children) {
              slide.style.padding = withImage ? '18px 82px 36px 18px' : '18px 18px 36px';
              for (const child of slide.children) {
                child.style.marginLeft = withImage ? '322px' : '0';
                child.style.width = withImage ? 'calc(100% - 322px)' : '100%';
              }
            }
          }
          const title = carousel && carousel.previousElementSibling;
          const first = st.main.querySelector('.ps-sec');
          if (first && first !== node) st.main.insertBefore(node, first.nextSibling);
          if (carousel && title) {
            node.insertBefore(title, node.firstChild);
            node.insertBefore(carousel, title.nextSibling);
            if (st.openingExtras) node.insertBefore(st.openingExtras, carousel.nextSibling);
            if (st.headerTools) node.appendChild(st.headerTools);
          }
        }
        return node;
      }; },
    },
  },
});
