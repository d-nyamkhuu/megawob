// The article layout adds a newspaper story, a vertical paragraph link list, and a fitting pass.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-11',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  template: 'click-control/controls',
  design: {
    obstacle: true,
    articleFit: { room: 30 },
    parts: {
      linkHead: (base) => (ctx, art) => {
        const { util } = ctx;
        util.el('div', 'article-section', art, 'U.S. NEWS');
        util.el('h1', 'article-headline', art, 'City Council Weighs New Park Plan');
        util.el('div', 'article-byline', art, 'By Laura Mendel  |  March 14, 2011');
        const photo = util.el('figure', 'article-photo', art);
        const img = util.el('img', '', photo);
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="296" height="224"/%3E';
        img.alt = 'Riverside park and city skyline';
        util.el('figcaption', '', photo, 'A view of the proposed riverfront park area in Riverton.');
        const related = util.el('section', 'related-articles', photo);
        util.el('strong', '', related, 'RELATED ARTICLES');
        [
          'Riverton’s growth and green space',
          'How other cities have transformed their riverfronts',
          'What to expect at this week’s meeting',
        ].forEach((text) => util.el('p', '', related, text));
        util.el(
          'p',
          'article-intro',
          art,
          'Riverton’s city council will meet this week to discuss a proposal for a new riverfront park, a project supporters say could bring green space, jobs and a stronger sense of community to the downtown area.',
        );
        util.el(
          'p',
          'article-intro article-details',
          art,
          'The full agenda and related documents are available on the city’s website. Read more about the plan, including the draft map, community feedback and next steps, at the links below:',
        );
      },
      linkDecor: () => (ctx, art, links) => {
        if (ctx.spec.mode !== 'list') {
          const list = ctx.util.el('div', 'uc-links col article-link-list', art);
          links.forEach((link) => list.appendChild(link));
          Array.from(art.children)
            .filter((el) => el.tagName === 'P' && !el.className)
            .forEach((el) => el.remove());
        }
        ctx.util.el(
          'p',
          'article-quote',
          art,
          '“This is an exciting opportunity for our city,” said Mayor Elena Park. “We want to make sure every voice is heard.”',
        );
        ctx.util.el('p', 'article-ending', art, 'The council is expected to vote on the proposal later this month.');
      },
    },
  },
});
