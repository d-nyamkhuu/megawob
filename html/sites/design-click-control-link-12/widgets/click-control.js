// The article presents the seeded links as references in a feature about a quieter city.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-12',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    articleFit: {},
    parts: {
      linkDecor: (base) => (ctx, art, links) => {
        const { util } = ctx;
        Array.from(art.children).forEach((el) => {
          if (el.tagName !== 'H3') el.remove();
        });
        util.el('h1', 'q-title', art, 'A Quieter City');
        util.el('p', 'q-sub', art, 'Notes on a more humane urban life.');
        util.el('p', 'q-by', art, 'By Elena Park   |   May 14, 2023');
        util.el(
          'p',
          'q-body q-first',
          art,
          'Cities are made not only of buildings but of habits. Many people are looking for a slower, kinder rhythm. In neighborhoods across the world, residents and planners are reimagining public space, from tree-lined streets to peaceful neighborhood plazas.',
        );
        util.el(
          'p',
          'q-body',
          art,
          'The benefits are tangible. Fewer cars can mean less noise and cleaner neighborhood air. More green space invites conversation. As urban writer Elena Park reminds us, “a kinder city is a healthier city.”',
        );
        util.el('p', 'q-body q-further', art, 'For further reading, explore these related articles:');
        const refs = util.el('p', 'q-body q-refs', art);
        links.forEach((a, i) => {
          if (i > 0) refs.append(i === links.length - 1 && links.length > 2 ? ', and a helpful guide on ' : ', ');
          refs.append(a);
        });
        refs.append('.');
        util.el(
          'p',
          'q-body q-close',
          art,
          'Real change happens when residents, planners, and local businesses work together. Small shifts in daily life — a slower commute, a visit to a local market, a conversation with a neighbor — can add up to a brighter, more connected tomorrow.',
        );
      },
    },
  },
});
