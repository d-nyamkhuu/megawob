// Design of this site on the use-shop/adapted template (templates/use-shop/adapted.js): a NeXTSTEP-style inspector
// layout with a tool strip, selectable flight rows and a bottom action bar (Book, View Details, Cancel booking).
(function () {
  'use strict';
  const dateCaption = (fam, iso) =>
    fam
      .fmtDate(iso, 'long')
      .replace(
        /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|June|July|August|September|October|November|December)\b/g,
        (word) => word.slice(0, 3),
      );
  const flightTime = (mins) => {
    const dayMins = ((mins % 1440) + 1440) % 1440;
    const hour = Math.floor(dayMins / 60);
    return `${hour % 12 || 12}:${String(dayMins % 60).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
  };
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-flight-11',
    name: 'design',
    split: 'train',
    scenarios: ['flight'],
    template: 'use-shop/adapted',
    design: {
      fieldLabels: { from: 'From', to: 'To', date: 'Date' },
      dateIcon:
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 6.5h12M5.2 1.6v2.6M10.8 1.6v2.6"/></svg>',
      calendarInBody: false,
      searchLabel: 'Search',
      parts: {
        frameTop: (base, S) => (ctx, top) => {
          const { ICON } = S.H;
          const icons = [
            ICON.plane,
            '<svg viewBox="0 0 32 32"><path d="M12 8V4h8v4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="8" width="24" height="21" rx="2" fill="currentColor"/><path d="M10 10v17M22 10v17" stroke="#bbb" stroke-width="2"/></svg>',
            '<svg viewBox="0 0 32 32"><ellipse cx="16" cy="9" rx="6" ry="7" fill="currentColor"/><path d="M6 29v-6c0-8 20-8 20 0v6z" fill="currentColor"/><path d="M16 19v9" stroke="#bbb" stroke-width="2"/></svg>',
            '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 2h20v28H7z"/><path d="M11 7h12M11 12h12M11 17h12M11 22h12"/></svg>',
            '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M9 9C9 0 25 0 25 10c0 6-9 6-9 13"/><circle cx="16" cy="29" r="1"/></svg>',
          ];
          ['Flights', 'My Trips', 'Travelers', 'Preferences', 'Help'].forEach((t, i) => {
            const tl = ctx.util.el('span', 'nx-tool' + (i ? '' : ' on'), top);
            ctx.util.el('i', 'nx-tbox', tl).innerHTML = icons[i];
            ctx.util.el('em', '', tl, t);
          });
        },
        flightTrip: () => () => {},
        fieldDecor: (base, S) => (V, f, ctl, input) => {
          const { util } = V;
          const { btn } = S.H;
          const arrow = btn(util, 'nx-arrow', ctl, '▼');
          arrow.setAttribute('aria-label', f === 'from' ? 'Choose origin' : 'Choose destination');
          arrow.addEventListener('click', () => input.focus());
        },
        flightStatics: (base, S) => (V) => {
          const { util, row } = V;
          const trip = util.el('div', 'fl-field nx-trip', row);
          util.el('label', 'fl-lab', trip, 'Trip Type');
          const tripValue = util.el('div', 'fl-ctl', trip);
          util.el('span', '', tripValue, 'One-way');
          util.el('span', 'nx-arrow', tripValue, '▼');
        },
        flightEmpty: () => () => {},
        flightSummary: (base, S) => (V) => {
          const { ctx, util, body, step } = V;
          const { ICON, btn } = S.H;
          const res = (V.res = util.el('div', 'fl-res', body));
          const sum = (V.sum = util.el('div', 'fl-sum', res));
          const back = (V.back = btn(util, 'as-btn fl-back', sum, undefined, 'back'));
          back.innerHTML = `${ICON.left}<span>Modify search</span>`;
          back.addEventListener('click', () => step({ click: { back: true } }));
          V.route = util.el('span', 'fl-route', sum);
          V.sdate = util.el('span', 'fl-sdate', sum);
          const cancelBook = (V.cancelBook = btn(util, 'as-btn sm fl-cancel', sum, 'Cancel booking', 'cancel-booking'));
          cancelBook.addEventListener('click', () => {
            if (ctx.model.booked) step({ click: { cancelBook: true } });
          });
        },
        flightTable: (base, S) => (V) => {
          const { ctx, util, spec, fam, body, res, cancelBook } = V;
          const { btn } = S.H;
          V.count = util.el('div', 'fl-count', res, '\u00a0');
          const headings = (parent) => {
            const h = util.el('div', 'nx-flight-head', parent);
            ['Select', 'Airline', 'Depart ▲', 'Arrive', 'Duration', 'Stops', 'Price (USD)'].forEach((t) =>
              util.el('span', '', h, t),
            );
          };
          headings(res);
          V.pane = util.el('div', 'as-pane', res);
          const ffoot = util.el('div', 'as-foot', res);
          ffoot.innerHTML =
            '<span>Fares include taxes and carrier fees. Baggage allowance varies by airline. <b>Free cancellation</b> within 24 hours.</span>';
          V.cover = util.el('div', 'fl-cover', res);
          V.cover.dataset.role = 'loading';
          for (let i = 0; i < 4; i++) util.el('div', 'as-skel', V.cover).style.width = `${92 - i * 13}%`;
          const selectEls = {};
          V.x.selected = null;
          V.x.showDetails = false;
          const empty = util.el('section', 'nx-empty-results', body);
          const emptyTitle = util.el('div', 'nx-empty-title', empty);
          const briefing = document.querySelector('.task-note');
          const routeLabel = (text) => {
            const codes = fam.suggest(text || '');
            const code = codes.find(
              (c) => c === text || fam.airport(c).city.toLowerCase() === (text || '').toLowerCase(),
            );
            return code ? `${fam.airport(code).city} (${code})` : text;
          };
          const requestedFrom = briefing && briefing.dataset.origin;
          const requestedTo = briefing && briefing.dataset.destination;
          util.el(
            'span',
            'nx-empty-route',
            emptyTitle,
            requestedFrom && requestedTo
              ? `One-way flights: ${routeLabel(requestedFrom)} → ${routeLabel(requestedTo)}`
              : 'One-way flights',
          );
          const requestedDate = (briefing && briefing.dataset.date) || '';
          const dateParts = requestedDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
          const requestedISO = dateParts ? `${dateParts[3]}-${dateParts[1]}-${dateParts[2]}` : requestedDate;
          util.el('span', 'nx-empty-date', emptyTitle, requestedISO ? dateCaption(fam, requestedISO) : '');
          headings(empty);
          const blank = util.el('div', 'nx-empty-table', empty);
          const blankGrid = util.el('div', 'nx-empty-grid', blank);
          blankGrid.setAttribute('aria-hidden', 'true');
          for (let i = 0; i < 4; i++) {
            const blankRow = util.el('div', 'nx-empty-row', blankGrid);
            for (let j = 0; j < 7; j++) util.el('span', '', blankRow);
          }
          util.el('p', 'nx-empty-message', blank, 'Search for flights to compare available fares.');
          const actions = util.el('div', 'nx-flight-actions', body);
          const actionCopy = util.el('div', 'nx-action-copy', actions);
          const actionTitle = util.el('b', '', actionCopy, 'No flight selected');
          const actionDesc = util.el(
            'span',
            '',
            actionCopy,
            'Select a flight to see details, fare rules, and continue to booking.',
          );
          const actionBook = btn(util, 'as-btn nx-action-book', actions, 'Book');
          actionBook.disabled = true;
          const details = btn(util, 'as-btn nx-details', actions, 'View Details');
          details.disabled = true;
          actions.append(cancelBook);
          actionBook.addEventListener('click', () => {
            if (
              V.x.selected !== null &&
              V.bookEls[V.x.selected] &&
              !V.bookEls[V.x.selected].disabled &&
              !(ctx.model.loading > 0)
            )
              V.bookEls[V.x.selected].click();
          });
          details.addEventListener('click', () => {
            V.x.showDetails = !V.x.showDetails;
            V.paint(ctx.model);
          });

          Object.assign(V.x, { selectEls, empty, actionTitle, actionDesc, actionBook, details });
        },
        resultsSummary: () => (V, s) => {
          const { spec, fam, res, route, sdate } = V;
          res.classList.toggle('nx-scrollable', fam.flightsFor(spec, s).length > spec.rows);
          V.x.selected = null;
          V.x.showDetails = false;
          route.textContent = `One-way flights: ${fam.airport(s.from).city} (${s.from}) → ${fam.airport(s.to).city} (${s.to})`;
          sdate.textContent = dateCaption(fam, s.date);
        },
        flightPitch: (base, S) => (V) => {
          const { ctx, spec, rng, pane, res, gap } = V;
          V.pitch = S.H.pitchFor(pane, res, spec.rows, gap, 18, rng.int(84, 100), -18);
          pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
          S.H.mirrorPitch(ctx, V.pitch);
        },
        flightRow: (base, S) => (V, i, fl, flights, s) => {
          const { ctx, util, fam, fmt, step, bookEls, rowEls } = V;
          const { btn } = S.H;
          const { selectEls } = V.x;

          const r = util.el('div', 'fl-frow');
          r.dataset.role = 'flight';
          const select = util.el('div', 'nx-select', r);
          const radio = btn(util, 'nx-flight-radio', select, '');
          radio.setAttribute('role', 'radio');
          radio.setAttribute('aria-label', 'Select ' + fl.airline + ' ' + fl.no);
          radio.addEventListener('click', () => {
            if (!ctx.model.booked && !(ctx.model.loading > 0)) {
              V.x.selected = i;
              V.x.showDetails = false;
              V.paint(ctx.model);
            }
          });
          selectEls[i] = radio;
          const air = util.el('div', 'fl-air', r);
          const logo = util.el('i', 'nx-airline-logo', air);
          logo.innerHTML = [
            '<svg viewBox="0 0 48 32" fill="currentColor"><path d="M2 30L18 6h7L9 30zm11 0L29 6h7L20 30zm11 0L40 6h7L31 30z"/></svg>',
            '<svg viewBox="0 0 48 32" fill="currentColor"><path d="M1 20c20-27 28 8 46-14-12 29-28-8-46 14zm0 11c20-25 30 5 46-12-17 26-29-5-46 12z"/></svg>',
            '<svg viewBox="0 0 48 40" fill="currentColor"><path d="M24 1L9 19h7L5 31h11l-3 7h22l-3-7h11L32 19h7z"/></svg>',
            '<svg viewBox="0 0 48 32" fill="currentColor"><path d="M0 30L14 10l7 9L29 0l19 30z"/><path d="M22 18l7-18 7 19-7-9z" fill="#eee"/></svg>',
          ][i % 4];
          util.el('b', '', air, fl.airline);
          util.el('span', '', air, fl.no);
          const dep = util.el('div', 'nx-time-cell', r);
          util.el('span', 'fl-t', dep, flightTime(fl.dep));
          util.el('span', '', dep, s.from);
          const arrive = util.el('div', 'nx-time-cell', r);
          const arr = util.el('span', 'fl-t', arrive, flightTime(fl.dep + fl.dur));
          util.el('span', '', arrive, s.to);
          if (fl.dep + fl.dur >= 1440) util.el('sup', '', arr, '+1');
          util.el('div', 'nx-duration', r, fam.fmtDur(fl.dur));
          util.el('div', 'nx-stops', r, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
          const fare = util.el('div', 'fl-fare', r);
          fare.append(['Economy Light', 'Economy', 'Economy Flex', 'Basic'][(fl.price / 100 + fl.dep) % 4]);
          util.el('br', '', fare);
          if (((fl.price / 100) * 7 + fl.dur) % 3 === 0)
            util.el('b', '', fare, `${1 + ((fl.price / 100 + fl.dur) % 5)} seats left`);
          else fare.append('Carry-on included');
          const price = util.el('div', 'fl-fp', r);
          const b = btn(util, 'as-btn primary fl-book', price, 'Book', 'book');
          b.dataset.fare = fmt(fl.price);
          b.setAttribute('aria-label', `Book ${fl.airline} for ${fmt(fl.price)}`);
          b.addEventListener('click', () => {
            if (!ctx.model.booked && !(ctx.model.loading > 0)) step({ click: { book: i } });
          });
          bookEls[i] = b;
          rowEls[i] = r;
          return r;
        },
        paintScreen: () => (V, m) => {
          const { form, res, cancelBook, fmt } = V;
          const { empty, actionTitle, actionDesc, actionBook, details } = V.x;
          form.hidden = m.screen !== 'form';
          form.inert = m.screen !== 'form';
          res.hidden = m.screen !== 'results';
          empty.hidden = m.screen !== 'form';
          if (m.screen !== 'results') {
            V.x.selected = null;
            V.x.showDetails = false;
          }
          actionTitle.textContent = m.booked ? 'Flight booked' : 'No flight selected';
          actionDesc.textContent = m.booked
            ? 'Your booking is confirmed. Use Cancel booking to return to the flight list.'
            : 'Select a flight to see details, fare rules, and continue to booking.';
          actionBook.disabled = V.x.selected === null || !!m.booked || m.loading > 0;
          details.disabled = V.x.selected === null;
          actionBook.hidden = !!m.booked;
          details.hidden = !!m.booked;
          cancelBook.hidden = !m.booked;
        },
        paintBookRow: () => (V, m, i, b) => {
          const { rowEls } = V;
          const { selectEls } = V.x;
          const loading = m.loading > 0;
          const mine = !!m.booked && m.booked.index === +i;
          const picked = mine || V.x.selected === +i;
          selectEls[i].setAttribute('aria-checked', String(picked));
          selectEls[i].disabled = !!m.booked || loading;
          b.disabled = !!m.booked;
          b.textContent = mine ? `${b.dataset.fare} ✓` : b.dataset.fare;
          b.classList.toggle('mine', mine);
          rowEls[i].classList.toggle('booked', mine);
        },
        paintEnd: () => (V, m) => {
          const { spec, fam, fmt, rowEls } = V;
          const { actionTitle, actionDesc } = V.x;
          if (m.screen === 'results' && m.searched) {
            if (V.x.selected !== null && !m.booked) {
              const fl = fam.flightsFor(spec, m.searched)[V.x.selected];
              actionTitle.textContent = fl.airline + ' · ' + fmt(fl.price);
              actionDesc.textContent = V.x.showDetails
                ? rowEls[V.x.selected].querySelector('.fl-fare').textContent
                : fam.fmtDur(fl.dur) + ' · ' + (fl.stops ? fl.stops + ' stop(s)' : 'Nonstop') + ' · Ready to book';
            }
          }
        },
      },
    },
  });
})();
