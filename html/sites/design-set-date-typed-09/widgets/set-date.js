// Keeps the typed date accessory and editable Notes area from this form design.
env.widget({
  task: 'set-date',
  site: 'design-set-date-typed-09',
  name: 'design',
  split: 'train',
  scenarios: ['typed'],
  traits: { sceneRows: 2 },
  template: 'set-date/calendar',
  design: {
    typedContext: null,
    typedAux: null,
    typedReminder: false,
    parts: {
      buildTyped: (base, S) => (ctx) => {
        const { util } = ctx;
        const { spec, D, P } = S;
        const shown = spec.maskShown || spec.mask;
        P.buildText(ctx, spec.mask, shown, `Format: ${shown}`);
        const control = S.control;
        control.parentElement.classList.add('fd-date-row');
        const accessory = util.el('button', 'fd-calendar-accessory', control.parentElement);
        accessory.type = 'button';
        accessory.setAttribute('aria-label', 'Focus date entry');
        accessory.innerHTML = D.calendarIcon;
        accessory.addEventListener('click', () => control.focus());
        const context = util.el('div', 'fd-context fd-row', S.card);
        util.el('label', 'fd-label', context, 'Notes:');
        const notes = util.el('textarea', 'fd-description', context);
        notes.setAttribute('aria-label', 'Notes');
        const scroll = util.el('div', 'fd-notes-scroll', context);
        util.el('span', '', scroll, '▴');
        util.el('span', '', scroll, '▾');
      },
      built: (base, S) => (ctx) => {
        const { card } = S;
        const notes = card.querySelector('.fd-description');
        const gap = parseFloat(getComputedStyle(card).marginTop) || 0;
        if (notes && card.offsetHeight + gap > ctx.size.height) {
          card.style.setProperty('--fd-top', '0px');
          const fixedHeight = card.offsetHeight - notes.offsetHeight;
          card.style.setProperty(
            '--fd-notes',
            Math.min(notes.offsetHeight, Math.max(49, ctx.size.height - fixedHeight - 2)) + 'px',
          );
        }
      },
    },
  },
});
