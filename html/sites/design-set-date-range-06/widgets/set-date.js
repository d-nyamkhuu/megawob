// Keeps the range site's calendar icon, four-week grids, and separate end-date summary.
(() => {
  let endText;
  let summary;
  let helpEl;

  env.widget({
    task: 'set-date',
    site: 'design-set-date-range-06',
    name: 'design',
    split: 'train',
    scenarios: ['range'],
    template: 'set-date/calendar',
    design: {
      calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/><path fill="currentColor" stroke="none" d="M6 12h3v3H6zM11 12h3v3h-3zM16 12h3v3h-3zM6 16h3v3H6zM11 16h3v3h-3zM16 16h3v3h-3z"/></svg>',
      minWeeks: 4,
      rangeLayout: null,
      adjacentDays: false,
      parts: {
        gridBuilt: (base, S) => (box, grid) => {
          grid.style.setProperty('--weeks', grid.children.length / 7);
        },
        calendarPopup: (base, S) => (ctx, range, row, help) => {
          base(ctx, range, row, help);
          if (!range) return;

          const { spec, control, card } = S;
          const { util } = ctx;
          helpEl = help;
          card.classList.add('fd-range');
          row.classList.add('fd-start-row');
          row.querySelector('.fd-label').textContent = `${spec.scene.label} (Start date)`;

          const endRow = util.el('div', 'fd-row fd-end-row', card);
          util.el('label', 'fd-label', endRow, `${spec.scene.label2} (End date)`);
          const endControl = S.P.clickControl(endRow, S.D.calendarIcon, util);
          endText = util.el('span', 'fd-txt', endControl);
          endControl.addEventListener('click', () => S.P.act({ field: 'main' }));

          const panel = util.el('aside', 'fd-summary', card);
          util.el('h3', '', panel, 'Selected Range');
          summary = util.el('div', '', panel);
          const clear = document.querySelector('.ds-clear');
          if (clear) clear.onclick = () => {
            S.ctxRef.update({ ...S.ctxRef.model, start: null, end: null });
            S.P.paint();
          };
        },
        rangeReadout: (base, S) => (ctx, model, txt) => {
          const { util } = ctx;
          const { spec, geo, control } = S;
          const startText = model.start ? S.P.fmtLocal(model.start, geo.disp) : 'Select date';
          const endValue = model.end ? S.P.fmtLocal(model.end, geo.disp) : 'Select date';
          const start = util.el('span', model.start ? '' : 'fd-ph', txt, startText);
          start.dataset.part = 'start';
          endText.textContent = endValue;
          endText.classList.toggle('fd-ph', !model.end);
          summary.textContent = model.start
            ? `${S.P.fmtLocal(model.start, geo.disp)}${model.end ? ' → ' + S.P.fmtLocal(model.end, geo.disp) : ' → …'}`
            : 'No dates selected.';
          const bad = model.start && model.end && model.end < model.start;
          control.classList.toggle('bad', !!bad);
          if (bad) {
            helpEl.textContent = `${spec.scene.label2} is before ${spec.scene.label.toLowerCase()}.`;
            helpEl.classList.add('err');
          } else if (helpEl.classList.contains('err')) {
            helpEl.classList.remove('err');
            helpEl.textContent = spec.rule === 'minmax'
              ? `Minimum stay ${spec.minN} nights · maximum ${spec.maxN} nights`
              : spec.rule === 'booked' ? 'Unavailable dates cannot be selected.' : '';
          }
        },
      },
    },
  });
})();
