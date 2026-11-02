// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-booking-04',
  name: 'design',
  split: 'train',
  scenarios: ['booking'],
  template: 'complete-goals/sections',
  design: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      wrapPadding: '0',
      headingGap: '10px',
      titleSize: '44px',
      subtitleSize: '0px',
      labelSize: '0px',
      styles: ['ruled', 'ruled', 'ruled'],
      subtitles: [''],
      gapRange: [20, 24],
      columnRange: [900, 980],
      gridMinWidth: 9999,
      heightRange: [260, 340],
      heightInset: 20,
      cardInset: 26,
      minBoxHeight: 160,
      contentMargin: 26,
      growMargin: 18,
      parts: {
        rendered: (base, S) => (ctx) => {
          base(ctx);
          const host = S.st.host;
          host.classList.add('booking-ready');
          const calendarIcon = '<svg viewBox="0 0 32 32" aria-hidden="true"><g stroke="#111" stroke-width="1.3"><path fill="#eee" d="M3 5h26v24H3z"/><path fill="#4975cf" d="M3 5h26v6H3z"/><path fill="#fff" d="M6 13h20v13H6z"/><path stroke="#d4352b" stroke-width="3" d="M8 2v6m15-6v6"/><path stroke="#445c9d" stroke-width="2" d="M9 16h2m4 0h2m4 0h2M9 20h2m4 0h2m4 0h2M9 24h2m4 0h2m4 0h2"/></g></svg>';
          for (const entry of S.st.parts) {
            entry.card.classList.add('booking-' + entry.part.task);
            entry.card.dataset.scenario = entry.part.scenario;
            const title = ctx.util.el('h2', 'booking-section-title', entry.card,
              entry.part.task === 'type-text' ? 'Business Information' :
              entry.part.task === 'choose-option' ? 'Email Preferences' : 'Reservation Date');
            entry.card.prepend(title);
            if (entry.part.task === 'set-date') {
              const input = entry.card.querySelector('.fd-input');
              if (input) {
                const icon = ctx.util.el('span', 'booking-calendar booking-typed-calendar', input.parentElement);
                icon.innerHTML = calendarIcon;
                icon.setAttribute('aria-hidden', 'true');
              }
            }
            if (entry.part.task === 'type-text') {
              entry.card.querySelectorAll('.ft-grid').forEach(grid => grid.classList.remove('floating', 'placeholder', 'inline'));
              entry.card.querySelectorAll('.ft-field').forEach((field, i) => {
                let label = field.querySelector('.ft-label');
                if (!label && entry.part.spec.fields[i]) {
                  label = ctx.util.el('label', 'ft-label', field, entry.part.spec.fields[i].label);
                  const input = field.querySelector('input, textarea');
                  if (input) label.htmlFor = input.id;
                }
                if (label) field.prepend(label);
              });
            }
          }
          if (!S.st.parts.some(e => e.part.task === 'set-date')) {
            const card = ctx.util.el('section', 'booking-static-date', host);
            ctx.util.el('h2', 'booking-section-title', card, 'Reservation Date');
            const row = ctx.util.el('div', 'booking-business-row', card);
            ctx.util.el('span', '', row, 'Date:');
            const value = ctx.util.el('div', 'booking-static-date-value', row);
            ctx.util.el('div', 'booking-business-value', value, '04/20/1994');
            ctx.util.el('span', 'booking-calendar', value).innerHTML = calendarIcon;
            ctx.util.el('div', 'booking-date-hint', value, '(MM/DD/YYYY)');
          }
          if (!S.st.parts.some(e => e.part.task === 'type-text')) {
            const card = ctx.util.el('section', 'booking-static-business', host);
            ctx.util.el('h2', 'booking-section-title', card, 'Business Information');
            const row = ctx.util.el('div', 'booking-business-row', card);
            ctx.util.el('span', '', row, 'Business Name:');
            ctx.util.el('div', 'booking-business-value', row, 'Riverside Outfitters');
          }
          for (const entry of S.st.parts.filter(e => e.part.task === 'choose-option')) {
            const extras = ctx.util.el('div', 'booking-preferences', entry.card);
            for (const label of ['Reservation reminders', 'Special offers and news']) {
              const row = ctx.util.el('label', 'booking-check-row', extras);
              const check = ctx.util.el('input', '', row);
              check.type = 'checkbox';
              check.checked = true;
              check.addEventListener('change', () => ctx.log('decoy', { label }));
              ctx.util.el('span', '', row, label);
            }
          }
          const inspector = document.querySelector('.booking-inspector');
          if (inspector) {
            const values = inspector.querySelectorAll('.booking-detail-value');
            const text = host.querySelector('.ft-input');
            const pick = host.querySelector('.fp-val');
            const date = host.querySelector('.fd-input, .fd-txt');
            if (text) values[0].textContent = text.value;
            if (pick) values[1].textContent = pick.textContent;
            if (date) values[2].textContent = date.value || date.textContent;
          }
        },
      },
  },
});
