// Adds the two-field rental layout, vehicle choices, and trip summary to the shared range calendar.
(function () {
  const CALENDAR_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4M7 13h2M12 13h2M17 13h1M7 16h2M12 16h2M17 16h1M7 19h2M12 19h2M17 19h1"/></svg>';
  let startSummary, endSummary, durationSummary;

  env.widget({
    task: 'set-date',
    site: 'design-set-date-range-05',
    name: 'design',
    split: 'train',
    scenarios: ['range'],
    template: 'set-date/calendar',
    design: {
      calendarIcon: CALENDAR_ICON,
      adjacentDays: false,
      parts: {
        monthBlock: (base, S) => (parent, key, options, util) => {
          const result = base(parent, key, options, util);
          const head = result.box.querySelector('.fd-head');
          const navs = head.querySelectorAll('.fd-nav');
          navs.forEach((nav) => nav.classList.add(nav === navs[0] ? 'fd-prev' : 'fd-next'));
          return result;
        },
        blankDay: (base, S) => (grid, day, util) => {
          util.el('div', 'fd-empty', grid);
        },
        gridBuilt: (base, S) => (box, grid) => {
          grid.style.gridTemplateRows = `repeat(${grid.children.length / 7}, 1fr)`;
        },
        calendarLabel: (base, S) => (range) => range ? 'Pick-up date (start):' : base(range),
        calendarRow: (base, S) => (ctx, range, row) => {
          base(ctx, range, row);
          if (!range) return;
          row.classList.add('fd-start-row');
          row.querySelector('.fd-label').firstChild.textContent = 'Pick-up date (start):';
        },
        calendarFields: (base, S) => (ctx, range, row, txt) => {
          if (!range) return base(ctx, range, row, txt);
          const { geo, D, P } = S;
          const { util } = ctx;
          const endRow = P.fieldRow(geo.body, 'Return date (end):', null, util).row;
          endRow.classList.add('fd-end-row');
          const endControl = P.clickControl(endRow, D.calendarIcon, util);
          const endTxt = util.el('span', 'fd-txt', endControl);
          endControl.addEventListener('click', () => P.act({ field: 'main' }));
          return { endControl, endTxt };
        },
        calendarPopup: (base, S) => (ctx, range, row, help) => {
          if (!range) return base(ctx, range, row, help);
        },
        calendarSized: (base, S) => (ctx, range) => {
          if (!range) return base(ctx, range);
          const { card, spec, ctxRef, fam, geo, D } = S;
          const { util, size } = ctx;
          card.classList.add('fd-range-card');
          card.style.setProperty('--calendar-height', Math.max(180, Math.round(size.height * 0.482)) + 'px');
          const lower = util.el('section', 'fd-trip-details', card);
          const vehicle = util.el('div', 'fd-vehicle', lower);
          const vehicleTitle = util.el('h3', '', vehicle);
          vehicleTitle.innerHTML = '<svg viewBox="0 0 60 36" aria-hidden="true"><path d="M4 23V17L13 12L19 4H38L47 12L55 17V25H48M12 25H41M13 12H46M23 4V12"/><circle cx="13" cy="25" r="5"/><circle cx="45" cy="25" r="5"/></svg>Vehicle class';
          const choices = util.el('div', 'fd-vehicle-options', vehicle);
          ['Economy', 'Compact', 'Midsize', 'SUV', 'Luxury'].forEach((label, i) => {
            const option = util.el('label', '', choices);
            const radio = util.el('input', '', option);
            radio.type = 'radio';
            radio.name = 'vehicle-class';
            radio.checked = i === 0;
            util.el('span', '', option, label);
          });
          const summary = util.el('div', 'fd-trip-summary', lower);
          const title = util.el('h3', '', summary);
          title.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M3 46H46M7 46V17H18M18 46V3H34V46M34 16H42V46M23 8H29M23 14H29M23 20H29M23 26H29M23 32H29M11 22H14M11 28H14M11 34H14M37 22H39M37 28H39M37 34H39M23 46V38H29V46"/></svg>Trip summary';
          const list = util.el('div', 'fd-summary-values', summary);
          util.el('span', '', list, 'Pick-up:');
          startSummary = util.el('span', '', list);
          util.el('span', '', list, 'Return:');
          endSummary = util.el('span', '', list);
          util.el('span', '', list, 'Duration:');
          durationSummary = util.el('span', '', list);
        },
        rangeReadout: (base, S) => (ctx, model, txt, fields) => {
          const { fam, geo } = S;
          const { util } = ctx;
          const start = model.start ? S.P.fmtLocal(model.start, geo.disp) : 'Not selected';
          const end = model.end ? S.P.fmtLocal(model.end, geo.disp) : 'Not selected';
          const a = util.el('span', model.start ? '' : 'fd-ph', txt, start);
          a.dataset.part = 'start';
          fields.endTxt.textContent = end;
          startSummary.textContent = start;
          endSummary.textContent = end;
          durationSummary.textContent = model.start && model.end
            ? `${fam.helpers.days(model.end) - fam.helpers.days(model.start)} days`
            : '—';
        },
      },
    },
  });
})();
