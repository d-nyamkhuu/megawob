// Design on templates/choose-option/base.js: the base site's choose-option widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-toggles-04',
  name: 'design',
  split: 'train',
  scenarios: ['toggles'],
  template: 'choose-option/base',
  design: {
    parts: {
      place: (base) => (card, ctx, popup) => {
        base(card, ctx, popup);
        // Preserve seeded placement; fit the settings before anchors are frozen.
        const available = Math.max(0, ctx.size.height - card.offsetTop);
        if (card.offsetHeight <= available) return;
        const grid = card.querySelector('.fp-trows');
        const rows = Array.from(grid.children);
        const overhead = card.offsetHeight - grid.offsetHeight;
        let budget = (available - overhead - 2) / rows.length;
        if (budget < 25) {
          grid.style.display = 'grid';
          grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
          budget = (available - overhead - 2) / Math.ceil(rows.length / 2);
        }
        rows.forEach((row) => {
          const title = row.querySelector('.fp-tl');
          const description = row.querySelector('.fp-td');
          const style = getComputedStyle(row);
          const paddingTop = parseFloat(style.paddingTop);
          const paddingBottom = parseFloat(style.paddingBottom);
          const scale = Math.min(1, (budget - 1) / (title.offsetHeight + description.offsetHeight + paddingTop + paddingBottom));
          [title, description].forEach((text) => {
            text.style.fontSize = parseFloat(getComputedStyle(text).fontSize) * scale + 'px';
          });
          row.style.paddingTop = paddingTop * scale + 'px';
          row.style.paddingBottom = paddingBottom * scale + 'px';
        });
        card.style.height = 'auto';
        card.style.height = card.offsetHeight + 'px';
      },
    },
  },
});
