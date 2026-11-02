// Design for the notebook resource list and its closing notes.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-04',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      linkDecor: (base, S) => (ctx, art, links) => {
        const { util } = ctx;
        S.P.clearArticle(art);
        if (art.firstChild) art.firstChild.remove();
        util.el('div', 'wf-featured', art);
        const fl = art.lastChild;
        util.el('h2', 'wf-strip', fl, 'Featured Links');
        const tbl = util.el('div', 'wf-flist', fl);
        const descs = [
          'General information and resources',
          'Articles, news and updates',
          'Community site for discussion',
          'Helpful tools and utilities',
          'Guides, tips and how-to',
          'Reference materials and links',
          'Interesting places on the web',
          'Pages worth exploring',
          'Curated resources and more',
          "A closer look at what's new",
          'Collections and highlights',
          'Special topics and features',
          'Additional reading',
          'Other useful sites',
        ];
        const fillers = [
          'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
          'elit', 'sed', 'do', 'eiusmod', 'incididunt', 'ut',
        ];
        const used = new Set(links.map((a) => a.textContent.trim().toLowerCase()));
        const rows = fillers
          .filter((f) => !used.has(f))
          .slice(0, Math.max(0, 14 - links.length))
          .map((f) => ({ f }));
        links.forEach((a, index) => rows.splice(((rows.length * (index + 1)) / (links.length + 1)) | 0, 0, { a }));
        rows.forEach((r, i) => {
          const row = util.el('div', 'wf-row', tbl);
          const c = util.el('span', 'wf-name', row);
          if (r.a) c.append(r.a);
          else util.el('span', 'wf-dead', c, r.f);
          util.el('span', 'wf-desc', row, '- ' + descs[i % descs.length]);
        });
        util.el('p', 'notebook-closing', art, 'If you have questions, reach out to the team.');
        util.el('p', 'notebook-thanks', art, 'Thanks!');
      },
    },
  },
});
