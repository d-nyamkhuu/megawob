// Gives the time reservation form its segmented readout and indexed reservation rows.
env.widget({
  task: 'set-date',
  site: 'design-set-date-time-11',
  name: 'design',
  split: 'train',
  scenarios: ['time'],
  traits: { sceneRows: 5 },
  template: 'set-date/calendar',
  design: {
    title: 'Conference Room Reservation',
    parts: {
      timeReadout: (base, S) => (el, value, util) => {
        el.replaceChildren();
        const p = value === null ? { h: '--', m: '--', ap: '--' } : S.fam.helpers.parts12(value);
        util.el('span', 'gem-read-hour', el, String(p.h));
        util.el('span', 'gem-read-colon', el, ':');
        util.el('span', 'gem-read-minute', el, String(p.m).padStart(2, '0'));
        util.el('span', 'gem-read-ap', el, p.ap);
      },
      staticCreated: (base, S) => (parent, row, label, value, util) => {
        row.dataset.label = label;
      },
      built: (base, S) => (ctx) => {
        const { card, control, pop } = S;
        const { size } = ctx;
        const timeRow = control.closest('.fd-row');
        timeRow.classList.add('gem-time-row');
        const rows = Array.from(card.children).filter(
          (e) => e.classList.contains('fd-row') && e !== timeRow && !e.classList.contains('fd-notes'),
        );
        card.querySelectorAll('.fd-notes').forEach((e) => e.remove());
        const slots = ['gem-room-row', 'gem-date-row', 'gem-purpose-row', 'gem-attendees-row', 'gem-notes-row'];
        rows.forEach((row, i) => {
          row.classList.add(slots[i]);
          if (i < 2) row.classList.add('gem-select-row');
          if (i === 4) row.classList.add('fd-notes');
          const value = row.querySelector('.fd-static');
          if (i === 3 && /^\d+$/.test(value.textContent)) row.classList.add('gem-number-row');
          if (value.textContent.length > 13) value.classList.add('gem-long-value');
        });
        if (pop) {
          const em = parseFloat(getComputedStyle(card).fontSize);
          const scale = Math.min(
            1,
            (size.height - 20.3 * em - 4) / parseFloat(pop.style.height),
            (size.width - 15 * em - 4) / parseFloat(pop.style.width),
          );
          Object.assign(pop.style, {
            left: '15em',
            top: '20.3em',
            transformOrigin: 'top left',
            transform: `scale(${Math.max(0.3, scale)})`,
          });
        }
      },
    },
  },
});
