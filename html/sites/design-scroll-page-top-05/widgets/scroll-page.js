// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-top-05',
  name: 'design',
  split: 'train',
  scenarios: ['top'],
  template: 'scroll-page/longform',
  design: {
    foreground: '#0b1533', muted: '#293d65', accent: '#0875ff', line: '#dce2ec',
    parts: {
      frame: (base) => (st) => {
        const frame = base(st);
        frame.wrap.classList.add('br-document');
        return frame;
      },
      header: (base) => (st) => {
        const head = base(st);
        const header = document.querySelector('.mac-title-bar');
        if (header) {
          const tools = st.el('div', 'ps-tools br-header-tools', null);
          for (const label of ['Download PDF', 'Save', 'Share']) {
            const action = st.spec.tools.find((a) => a.label === label);
            const item = st.el(action ? 'button' : 'span', 'ps-tool', tools, label);
            if (action) {
              item.type = 'button';
              item.addEventListener('click', () => {
                if (window.scrollY <= 1) st.actionEls[action.id].click();
              });
            } else item.setAttribute('aria-hidden', 'true');
          }
          header.insertBefore(tools, header.querySelector('.ref-tools'));
        }
        return head;
      },
      help: (base) => (st) => {
        base(st);
        st.main.querySelector('.ps-help').remove();
        const { el, main } = st;
        const ending = el('section', 'br-article-ending', main);
        const takeaway = el('div', 'br-takeaway', ending);
        const leaf = el('span', 'br-leaf', takeaway);
        leaf.innerHTML = '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 22C0 8 11 5 24 3c0 15-7 22-17 17M3 26C8 16 13 12 20 8"/></svg>';
        const takeawayCopy = el('div', '', takeaway);
        el('h3', '', takeawayCopy, 'Key takeaway');
        el('p', '', takeawayCopy, 'Small, consistent changes add up. By choosing lower-carbon options, using less energy, and supporting climate solutions, you can reduce your footprint and help build a more resilient future.');
        el('h2', '', ending, 'Related reading');
        const cards = el('div', 'br-reading-cards', ending);
        const stories = [
          ['forest', 'How Forests Help Fight Climate Change', 'Explore how healthy forests\nabsorb carbon, support biodiversity,\nand strengthen communities.'],
          ['solar', 'A Beginner’s Guide to Renewable Energy', 'Learn the basics of solar, wind\nand other clean energy sources.'],
          ['city', '10 Ways to Make Your Home More Energy Efficient', 'Practical tips to save energy,\nlower bills and reduce emissions\nat home.'],
        ];
        for (const [photo, title, copy] of stories) {
          const card = el('div', 'br-reading-card', cards);
          const img = el('img', 'br-reading-photo', card);
          img.src = `sites/design-scroll-page-top-05/assets/${photo}.png`;
          img.alt = '';
          const text = el('div', 'br-reading-copy', card);
          el('h3', '', text, title);
          el('p', '', text, copy);
          const link = el('a', 'br-reading-link', text, 'Read article  →');
          link.href = '#';
          link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', {label: title}); });
        }
        const refs = el('section', 'br-references', ending);
        el('h2', '', refs, 'References');
        const list = el('ol', '', refs);
        for (const [source, title] of [
          ['Intergovernmental Panel on Climate Change (IPCC). (2023). ', 'Climate Change 2023: Synthesis Report.'],
          ['U.S. Environmental Protection Agency. (2024). ', 'Greenhouse Gas Emissions Overview.'],
          ['Project Drawdown. (2022). ', 'Climate Solutions 101.'],
          ['World Resources Institute. (2023). ', '10 Ideas for a More Sustainable Home.'],
        ]) {
          const item = el('li', '', list, source);
          el('em', '', item, title);
        }
      },
      bottomTools: (base) => (st) => {
        base(st);
        st.bottomBar = st.main.querySelector('.ps-bottomtools');
      },
      footer: (base) => (st) => {
        const result = base(st);
        result.totopInline.classList.add('br-inline-top');
        result.foot.replaceChildren();
        st.el('span', 'br-updated', result.foot, 'Last updated: April 22, 2024');
        const tags = (parent) => {
          const row = st.el('div', 'br-tags', parent);
          for (const tag of ['Climate Change', 'Sustainability', 'Clean Energy', 'At Home']) st.el('span', '', row, tag);
        };
        tags(result.foot);
        if (st.bottomBar) {
          st.main.appendChild(st.bottomBar);
          st.bottomBar.style.marginLeft = -st.main.getBoundingClientRect().left + 'px';
          st.bottomBar.style.marginRight = '0';
          tags(st.bottomBar);
        }
        return result;
      },
      fitPage: (base) => (st) => {
        base(st);
        const extra = parseFloat(st.foot.style.paddingBottom) || 0;
        if (extra) {
          st.foot.style.paddingBottom = '';
          st.spacer.style.minHeight = (st.spacer.getBoundingClientRect().height + extra) + 'px';
        }
      },
    },
  },
});
