// Design on templates/set-date/calendar.js.
env.widget({
  task: 'set-date',
  site: 'design-set-date-range-02',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  traits: { sceneRows: 3 },
  template: 'set-date/calendar',
  design: {
    calendarIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect x="3" y="5" width="18" height="17"/><path fill="currentColor" d="M3 6h18v4H3z"/><path d="M8 3v5M16 3v5M3 14h18M3 18h18M8 10v12M13 10v12M17 10v12"/></svg>', left: '&lt;', right: '&gt;',
    rangeLayout: null, adjacentDays: false, trimWithOutside: false, minWeeks: 4, inlineBinding: 'button',
    parts: {
      begin: (base, S) => (ctx) => {
        if (S.rangeEvents) S.rangeEvents.abort();
        S.rangeEvents = new AbortController();
      },
      calendarPopup: (base, S) => (ctx, range, row, help) => {
        const { ctxRef, card, control, pop, geo, paintFns } = S;
        const { util } = ctx;
        if (range) {
          row.classList.add('fd-start-row');
          row.querySelector('.fd-label').textContent = 'Pick-up date:';
          // Stay bounds are task data, including when the goal asks for the longest stay.
          const intro = document.querySelector('.ds-intro');
          if (intro) intro.append(help);
          // Use the task's unscored scene rows in the existing rental-details table.
          const details = document.querySelectorAll('.ds-rrow');
          geo.extrasBelow.forEach(([label, value], i) => {
            const detail = details[i];
            if (!detail) return;
            detail.querySelector('.ds-rlab').textContent = label.replace(/:$/, '') + ':';
            const select = detail.querySelector('.ds-rsel');
            select.firstElementChild.textContent = value;
            select.dataset.sceneValue = value;
          });
          const endRow = util.el('div', 'fd-row fd-end-row', card);
          util.el('label', 'fd-label', endRow, 'Return date:');
          const endControl = S.P.clickControl(endRow, S.D.calendarIcon, util);
          const endText = util.el('span', 'fd-txt', endControl);
          S.P.bindInlineField(endControl);
          document.addEventListener('pointerdown', (e) => {
            const path = e.composedPath();
            if (ctxRef.model.open && !path.includes(control) && !path.includes(endControl) && !path.includes(pop)) S.P.act({ outside: true });
          }, { capture: true, signal: S.rangeEvents.signal });
          paintFns.push((m) => {
            endText.textContent = m.end ? S.P.fmtLocal(m.end, geo.disp) : '';
            endControl.setAttribute('aria-expanded', String(!!m.open));
          });
          const reset = document.querySelector('.ds-reset');
          const cancel = document.querySelector('.ds-cancel');
          if (reset) reset.addEventListener('click', () => {
            ctxRef.update({ ...ctxRef.model, start: null, end: null, open: false });
            S.P.paint();
          });
          if (cancel) cancel.addEventListener('click', () => { if (ctxRef.model.open) S.P.act({ outside: true }); });
        }
      },
      calendarPainting: (base, S) => (ctx, m) => {
        const { control } = S;
        control.setAttribute('aria-expanded', String(!!m.open));
      },
      rangeReadout: (base, S) => (ctx, m, txt) => {
        const { geo } = S;
        const a = ctx.util.el('span', m.start ? '' : 'fd-ph', txt, m.start ? S.P.fmtLocal(m.start, geo.disp) : '');
        a.dataset.part = 'start';
      },
    },
  },
});
