// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-colfilter-03',
  name: 'design',
  split: 'train',
  scenarios: ['colfilter'],
  template: 'use-data-grid/grid',
  design: {
    brand: 'Help Desk',
    parts: {
      heading: (base, S) => () => {
        base();
        if (S.title.textContent === 'Customer operations') {
          S.title.textContent = 'Support Tickets';
          S.title.classList.add('breeze-grid-title');
        }
      },
      // This design uses the full task card for the ticket list and page controls.
      stream: (base) => () => {},
      toolbar: (base, S) => () => {
        base();
        const symbols = {
          status: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.1"/><path d="m7.5 12.1 3 3 6.2-6.3" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          archive: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 5.2h9.1l8.1 7.1-8.8 8.8-8.4-8.4V5.2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="8" cy="9.2" r="1.35" fill="currentColor"/></svg>',
        };
        for (const [key, svg] of Object.entries(symbols)) {
          const icon = S.card.querySelector(`.to-tools [data-key="${key}"] .to-icon`);
          if (icon) icon.innerHTML = svg;
        }
      },
    },
  },
});
