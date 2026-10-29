// OpenLook calendar design with fixed context rows and a booking summary beneath the date field.
env.widget({
  task: 'set-date',
  site: 'design-set-date-calendar-03',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'set-date/calendar',
  design: {
    calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="19"/><path d="M3 9h18M7 1v6M17 1v6"/><path stroke-width="2.5" d="M6 12h3m2 0h3m2 0h2M6 16h3m2 0h3m2 0h2M6 20h3m2 0h3m2 0h2"/></svg>',
    fieldClass: 'fd-main',
    trimWeeks: true,
    parts: {
      fieldRow: (base, S) => (parent, label, help, util) => {
        const result = base(parent, label, help, util);
        if (label.length > 14) result.row.querySelector('.fd-label').classList.add('fd-label-long');
        return result;
      },
      staticRow: (base, S) => (parent, [key, value], util) => {
        const { spec } = S;
        const kind = {
          'Title:': 'title',
          'Location:': 'location',
          'Start time:': 'start',
          'End time:': 'end',
          'Attendees:': 'attendees',
        }[key] || 'context';
        const row = util.el('div', 'fd-row fd-row-' + kind, parent);
        util.el('div', 'fd-label', row, key);
        const className = /time:$/.test(key) ? ' fd-dd' : key === 'Attendees:' ? ' fd-tall' : '';
        const valueEl = util.el('div', 'fd-static' + className, row, value);
        if (className === ' fd-dd') util.el('span', 'fd-ddb', valueEl, '▼');
        if (className === ' fd-tall') {
          valueEl.textContent = '';
          for (const name of value.split(', ')) util.el('div', '', valueEl, name);
        }
      },
      geometry: (base, S) => (ctx, extras, nAbove) => {
        const geometry = base(ctx, extras, nAbove);
        geometry.placeholder = '__/__/____';
        geometry.extrasBelow.push(
          ['Start time:', '9:00 AM'],
          ['End time:', '10:00 AM'],
          ['Attendees:', 'Alex Kim, Jordan Lee, Taylor Smith'],
        );
        return geometry;
      },
      bodyStart: (base, S) => (ctx) => {
        const { util } = ctx;
        S.P.staticRow(S.card, ['Title:', 'Project Review'], util);
        S.P.staticRow(S.card, ['Location:', ''], util);
      },
      fitCard: (base, S) => (height, util) => {
        const row = util.el('div', 'fd-row fd-notes', S.card);
        util.el('div', 'fd-label', row, 'Notes:');
        const notes = util.el('div', 'fd-static', row);
        util.el('span', 'fd-note-hint', notes, S.geo.note);
        S.card.style.height = Math.max(S.card.offsetHeight, height) + 'px';
      },
    },
  },
});
