// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-matrix-05',
  name: 'design',
  split: 'train',
  scenarios: ['matrix'],
  template: 'choose-option/base',
  design: {
    parts: {
      renderCard: base => (ctx, options) => {
        const result = base(ctx, options);
        const title = ctx.util.el('h1', 'ratings-title', ctx.stage, 'Product Ratings');
        ctx.stage.prepend(title);
        const card = ctx.stage.querySelector('.fp-card');
        const table = ctx.stage.querySelector('table');
        if (card && table) {
          card.classList.add('vista-matrix-card');
          table.classList.add('vista-grid');
          const rows = Array.from(table.rows);
          if (rows.length) {
            rows[0].classList.add('vista-scale');
            if (Array.from(rows[0].cells).slice(1).some(cell => cell.textContent.length > 14)) table.classList.add('vista-long-scale');
            const first = rows[0].cells[0];
            if (first && !first.textContent.trim()) first.textContent = 'Product or Service';
            rows.slice(1).forEach(row => row.classList.add('vista-rating-row'));
          }
          card.appendChild(table);
        }
        return result;
      },
    },
  },
});
