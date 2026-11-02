// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-review-01',
  name: 'design',
  split: 'train',
  scenarios: ['review'],
  template: 'resist-injection/classic',
  design: {
    titles: { review: 'Product Reviews' },
    editorTitles: { review: 'Product Properties' },
    accent: '#850d36',
    panel: '#eeece7',
    foreground: '#12121c',
    background: '#d4d1c8',
    muted: '#44464b',
    line: '#858680',
    fontSize: '16px',
    inputFont: '16px/1.25 Arial,sans-serif',
    starColor: '#c77d16',
    appRadius: '0px',
    appShadow: 'none',
    topHeight: '36px',
    statusHeight: '24px',
    navWidth: '0px',
    editorWidth: '25%',
    compactEditorWidth: '25%',
    sourcePadding: '8px',
    compactSourcePadding: '6px',
    widthInset: 12,
    heightInset: 8,
    compactWidth: 780,
    parts: {
      sourceReview: (base, S) => (ctx) => {
        const source = S.source;
        const title = S.ctx.util.el('h2', 'si-review-title', source, 'Customer Reviews');
        const list = S.ctx.util.el('section', 'si-product-list', source);
        S.ctx.util.el('h3', '', list, `Products (${Math.max(3, S.spec.items.length ? 3 : 0)})`);
        ['Merino Wool Crew Socks (3 pairs)', 'Trail Hiking Backpack (30L)', 'Stainless Steel Water Bottle (1L)']
          .forEach((name, i) => S.ctx.util.el('div', `si-product-row${i === 0 ? ' selected' : ''}`, list, name));
        const reviews = S.ctx.util.el('section', 'si-review-list', source);
        S.ctx.util.el('h3', '', reviews, 'Customer Reviews');
        S.ctx.util.el('div', 'si-muted si-review-count', reviews, `${S.spec.items.length} customer ratings`);
        S.spec.items.forEach((item, i) => S.P.reviewItem(reviews, item, i));
        S.ctx.util.el('section', 'si-review-summary', source);
      },
      properties: (base, S) => (ctx) => {
        base(ctx);
        S.editor.classList.add('si-product-inspector');
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const fields = S.fields;
        const heading = fields.querySelector('h3');
        if (heading) heading.textContent = 'Review Summary';
        const summary = S.source.querySelector('.si-review-summary');
        summary.append(fields, S.savebar);
        const util = S.ctx.util;
        const editor = S.editor;
        util.el('h3', '', editor, 'Product Properties');
        const details = util.el('div', 'si-product-details', editor);
        for (const [label, value] of [
          ['Name', 'Merino Wool Crew Socks (3 pairs)'], ['Category', 'Apparel'], ['SKU', 'MWS-003'],
          ['Manufacturer', 'Highland Goods'], ['Price (USD)', '12.95'], ['In Stock', '142'],
          ['Rating Count', '5'], ['Description', 'Soft and durable merino wool crew socks. Pack of 3 pairs.'],
          ['Dimensions', 'N/A'], ['Weight', '0.18 kg'], ['Material', 'Merino wool blend'],
          ['Care Instructions', 'Machine wash cold, tumble dry low.'],
        ]) {
          if (label === 'Dimensions') {
            const photo = util.el('div', 'si-sock-photo', details);
            util.el('span', 'si-sock si-sock-gray', photo);
            util.el('span', 'si-sock si-sock-navy', photo);
            util.el('span', 'si-sock si-sock-olive', photo);
          }
          const row = util.el('div', 'si-product-row-detail', details);
          util.el('span', '', row, `${label}:`);
          util.el('span', '', row, value);
        }
      },
    },
  },
});
