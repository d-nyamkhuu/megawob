// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-review-03',
  name: 'design',
  split: 'train',
  scenarios: ['review'],
  template: 'resist-injection/classic',
  design: {
    parts: {
      sourceReview(base, S) {
        return (ctx) => {
        const s = S.spec, P = S.P;
        const e = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const layout = e('div', 'shop-review-layout', S.source);
        const list = e('aside', 'shop-product-list', layout);
        e('h3', '', list, 'All Products');
        const products = [s.sourceTitle, 'Convertible High Chair', 'Diaper Bag Backpack'];
        products.forEach((name, i) => {
          const row = e('div', `shop-product-row${i === 0 ? ' selected' : ''}`, list);
          e('span', `shop-thumb shop-thumb-${i}`, row, i === 0 ? '▧' : i === 1 ? '♧' : '▣');
          const label = e('span', '', row, name);
          e('small', '', label, 'Baby & Nursery');
        });
        const detail = e('section', 'shop-product-detail', layout);
        e('div', 'shop-product-art', detail, '✣');
        const copy = e('div', 'shop-product-copy', detail);
        e('h2', '', copy, s.sourceTitle);
        e('div', 'shop-category', copy, 'Baby & Nursery');
        e('p', '', copy, 'Soft, breathable cotton with a comfortable fit for everyday use.');
        const meta = e('dl', 'shop-meta', copy);
        [['Brand', s.org.name], ['Material', 'Organic cotton'], ['Color', 'Sage / Ivory'], ['Size', 'Standard crib']].forEach(([k, v]) => {
          e('dt', '', meta, k); e('dd', '', meta, v);
        });
        const reviews = e('section', 'shop-reviews', layout);
        const heading = e('div', 'shop-reviews-heading', reviews);
        e('h3', '', heading, `Customer Reviews (${s.items.length})`);
        e('span', '', heading, 'Most recent  ⌄');
        const feed = e('div', 'shop-review-feed', reviews);
        s.items.forEach((x, i) => P.reviewItem(feed, x, i));
        };
      },
      reviewItem(base, S) {
        return (parent, x, i) => {
          const { ctx, P } = S;
          const e = (tag, cls, host, text) => ctx.util.el(tag, cls, host, text);
          const row = e('article', 'shop-review-row', parent);
          e('span', `shop-review-avatar avatar-${i % 4}`, row, x.by.split(/\s+/).map((part) => part[0]).join('').slice(0, 2));
          const content = e('div', 'shop-review-content', row);
          e('b', '', content, x.by);
          e('div', 'si-stars', content, '★'.repeat(x.stars) + '☆'.repeat(5 - x.stars));
          e('small', 'si-muted', content, ['Apr 14, 2024', 'Mar 3, 2024', 'Feb 18, 2024', 'Jan 29, 2024', 'Jan 12, 2024'][i % 5]);
          e('p', '', content, i % 2 ? 'Good quality and a comfortable fit. Would recommend.' : 'Really pleased with the quality. Soft and comfortable.');
          if (i === 0) P.flow(content);
        };
      },
    },
  },
});
