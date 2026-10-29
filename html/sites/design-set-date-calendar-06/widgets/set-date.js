// Keeps this calendar's height-based filler trimming and viewport-fit popup scaling.
(function () {
  let popScale = 1;

  env.widget({
    task: 'set-date',
    site: 'design-set-date-calendar-06',
    name: 'design',
    split: 'train',
    scenarios: ['calendar'],
    template: 'set-date/calendar',
    design: {
      calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="18"/><path d="M2 9h20M7 1v6M17 1v6"/><path d="M6 12h2m3 0h2m3 0h2M6 16h2m3 0h2m3 0h2M6 19h2m3 0h2" stroke-width="2"/></svg>',
      notesLabel: 'Notes (optional)',
      parts: {
        built: (base, S) => (ctx) => {
          const { card } = S;
          const filler = [...card.querySelectorAll(':scope > .fd-row')].filter(
            (row) => row.querySelector('.fd-static') && !row.classList.contains('fd-notes'),
          );
          while (filler.length && card.offsetHeight > ctx.size.height) filler.pop().remove();
          return base(ctx);
        },
        calendarHelp: (base, S) => (ctx, range) => {
          base(ctx, range);
          if (range) return;
          const { geo } = S;
          const { util } = ctx;
          const method = util.el('div', 'fd-row fd-method', geo.body);
          util.el('div', 'fd-label', method, 'Delivery method');
          util.el('div', 'fd-static', method, 'Standard Shipping');
          const address = util.el('div', 'fd-row fd-address', geo.body);
          util.el('div', 'fd-label', address, 'Shipping address');
          util.el('div', 'fd-static', address, '123 Market St\nSeattle, WA 98101');
        },
        painted: (base, S) => (ctx) => {
          base(ctx);
          const { pop, ctxRef } = S;
          if (!ctxRef.model.open) return;
          for (let i = 0; i < 4 && pop && !pop.hidden; i++) {
            const rect = pop.getBoundingClientRect();
            const room = window.innerHeight - 4 - rect.top;
            if (rect.bottom <= window.innerHeight - 4 || rect.height <= 0 || room <= 0) return;
            popScale = Math.max(0.5, (popScale * room) / rect.height);
            pop.style.setProperty('transform-origin', 'top left', 'important');
            pop.style.setProperty('transform', `scale(${popScale})`, 'important');
          }
        },
      },
    },
  });
})();
