// Preserves the typed form's Date label, notes grouping, reminder, and stage fitting.
env.widget({
  task: 'set-date',
  site: 'design-set-date-typed-03',
  name: 'design',
  split: 'train',
  scenarios: ['typed'],
  traits: { typedFormat: 'longDay' },
  template: 'set-date/calendar',
  design: {
    typedContext: null,
    typedAux: null,
    typedReminder: false,
    fit: 'stage',
    parts: {
      fieldRow: (base, S) => (parent, label, help, util) => {
        const row = util.el('div', 'fd-row' + (S.D.fieldClass ? ' ' + S.D.fieldClass : ''), parent);
        const lab = util.el('label', 'fd-label', row, S.spec.scenario === 'typed' ? 'Date' : S.P.fieldLabel(label));
        lab.title = label;
        util.el('b', '', lab, '*');
        return { row, help: help === null ? null : util.el('div', 'fd-help', null, help) };
      },
      textCreated: (base, S) => (ctx, row, help, shown) => {
        S.control.setAttribute('aria-label', S.spec.scene.label);
        if (S.spec.scenario === 'typed') {
          const example = shown.replace(/YYYY/gi, '2023').replace(/YY/gi, '23').replace(/MM/gi, '08').replace(/DD/gi, '11');
          ctx.util.el('span', 'fd-format-example', help, `(e.g., ${example})`);
        }
      },
      buildTyped: (base, S) => (ctx) => {
        const { util } = ctx;
        const { card, spec, P } = S;
        const contextRows = Array.from(card.querySelectorAll('.fd-row'));
        const titleRow = util.el('div', 'fd-row fd-titlerow', card);
        util.el('div', 'fd-label', titleRow, 'Title');
        util.el('div', 'fd-static', titleRow, 'Birthday');
        const longForm = Boolean(spec.longForm);
        const shown = longForm ? (spec.longShown || spec.maskShown || spec.mask) : (spec.maskShown || spec.mask);
        P.buildText(ctx, longForm ? null : spec.mask, shown, `Format: ${shown}`, longForm);
        for (const row of card.querySelectorAll('.fd-row')) {
          if (row !== titleRow && !row.contains(S.control) && !contextRows.includes(row)) contextRows.push(row);
        }
        const notesRow = util.el('div', 'fd-row fd-notesrow', card);
        util.el('div', 'fd-label', notesRow, 'Notes');
        const notes = util.el('div', 'fd-notebox', notesRow);
        for (const row of contextRows) {
          row.classList.add('fd-contextrow');
          notes.appendChild(row);
        }
        const reminder = util.el('label', 'fd-reminder', card);
        const check = util.el('input', '', reminder);
        check.type = 'checkbox';
        util.el('span', '', reminder, 'Set a reminder');
        util.el('span', 'fd-fakesel', reminder, '1 day before');
      },
    },
  },
});
