// Design on the choose-option/widgets template.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-listbox-01',
  name: 'design',
  split: 'train',
  scenarios: ['listbox'],
  template: 'choose-option/widgets',
  design: {
    sampleRows: false,
    integralRows: false,
    arrowStep: 'geometry',
    parts: {
      layout: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const wrap = util.el('div', 'fp-wrap', ctx.stage);
        const card = util.el('div', 'fp-card', wrap);
        card.dataset.role = 'form';
        util.el('h1', 'ds-meeting-title', card, 'Plan a Meeting');
        const grid = util.el('div', 'ds-form-grid', card);
        const cal =
          '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h20v20H3zM3 10h20M8 1v7M18 1v7M7 15h12M7 20h12M10 12v10M16 12v10"/></svg>';
        const chevron =
          '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m4 7 6 7 6-7"/></svg>';
        function row(label, value, icon, cls) {
          util.el('div', 'ds-field-label', grid, label);
          const ctl = util.el('div', 'ds-control' + (cls ? ' ' + cls : ''), grid);
          util.el('span', 'ds-control-text', ctl, value);
          if (icon) util.el('span', 'ds-control-symbol', ctl).innerHTML = icon;
          return ctl;
        }
        row('Event Name:', 'Team Sync');
        row('Date:', 'Apr 24, 2025', cal);
        row('Time:', '10:00 AM', chevron);
        const field = util.el('div', 'fp-field', grid);
        util.el('div', 'fp-label', field, spec.label.replace(/:$/, '') + ':');
        S.els.meeting = { row, chevron };
        return { wrap, card, field };
      },
      freeze: (base, S) => (ctx) => {
        const { util } = ctx;
        const { row, chevron } = S.els.meeting;
        row('Meeting Type:', 'In Person', chevron);
        const attendees = row('Attendees:', '10', null, 'ds-attendees');
        const spinner = util.el('span', 'ds-control-symbol ds-spinner', attendees);
        util.el('span', '', spinner, '⌃');
        util.el('span', '', spinner, '⌄');
        const notes = row('Notes (optional):', '', null, 'ds-notes-control');
        const notesRail = util.el('div', 'ds-notes-scroll', notes);
        util.el('span', '', notesRail, '⌃');
        util.el('span', '', notesRail, '⌄');
      },
      place: () => () => {},
      geometry: () => (ctx) => {
        const rowH = Math.max(18, Math.round((ctx.size.height * 238) / 737 / ctx.spec.rows));
        return { rowH, H: ctx.spec.rows * rowH, border: 2 };
      },
      rail: () => (ctx, controls) => {
        const { util } = ctx;
        const { lb } = controls;
        const rail = util.el('div', 'ds-scrollbar', lb);
        const up = util.el('button', 'ds-scroll-arrow', rail);
        up.type = 'button';
        up.setAttribute('aria-label', 'Scroll up');
        up.innerHTML =
          '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 13 6-6 6 6"/></svg>';
        const track = util.el('div', 'fp-track', rail);
        track.dataset.role = 'scrollbar';
        const thumb = util.el('div', 'fp-thumb', track);
        thumb.dataset.role = 'thumb';
        const down = util.el('button', 'ds-scroll-arrow', rail);
        down.type = 'button';
        down.setAttribute('aria-label', 'Scroll down');
        down.innerHTML =
          '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 7 6 6 6-6"/></svg>';
        return { track, thumb, up, down };
      },
    },
  },
});
