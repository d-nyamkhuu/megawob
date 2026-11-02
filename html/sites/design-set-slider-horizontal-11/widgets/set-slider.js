// Adds the library book record header and uses three unfilled settings rows.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-11',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    rows: 3,
    labels: ['Brightness', 'Sharpness', 'Contrast'],
    max: 1000,
    order: 'swap',
    ticks: 4,
    fill: false,
    heading: 'Image Settings',
    decorative: null,
    parts: {
      begin: () => (ctx) => {
        const u = ctx.util;
        u.el('h2', 'record-title', ctx.stage, 'Book Record — Edit Scan');
        const book = u.el('img', 'book-cover', ctx.stage);
        book.src = 'sites/design-set-slider-horizontal-11/assets/riverside-cover.webp';
        book.alt = 'The Riverside Chronicle by A. L. Whitmore, 1894, illustrated cloth book cover';
        const metadata = u.el('dl', 'book-metadata', ctx.stage);
        for (const [label, value] of [
          ['Title', 'The Riverside Chronicle'],
          ['Author', 'Whitmore, A. L.'],
          ['Year', '1894'],
          ['Format', 'Book'],
          ['Call Number', 'FIC W617'],
          ['Subject', 'Rivers — History'],
          ['Status', 'In Collection'],
        ]) {
          u.el('dt', '', metadata, label + ':');
          u.el('dd', '', metadata, value);
        }
      },
    },
  },
});
