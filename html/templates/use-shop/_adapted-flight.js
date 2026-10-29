/* use-shop/_adapted-flight: adapted flight parts; designs still override each BASE part. */
(function () {
  'use strict';
  function install(BASE, S) {
    installFlightTrip(BASE, S);
    installFlightTable(BASE, S);
  }

  function installFlightTrip(BASE, S) {
    BASE.flightTrip = (V) => {
      const { fam } = V;
      V.tripValues = {};
      for (const name of ['from', 'to', 'date']) {
        V.tripValues[name] = document.querySelector(`[data-trip="${name}"]`);
        if (name !== 'date' && V.tripValues[name]) {
          const codes = fam.suggest(V.tripValues[name].textContent);
          if (codes.length === 1) V.tripValues[name].textContent = `${fam.airport(codes[0]).city} (${codes[0]})`;
        }
      }
      V.tripSelection = document.querySelector('[data-role="trip-selection"]');
    };

    BASE.flightHeading = (V) => {
      const { util, rng, form } = V;
      util.el('div', 'fl-h', form, 'Find Flights');
      util.el(
        'div',
        'fl-hs',
        form,
        rng.pick([
          'Search hundreds of airlines and pick the fare that suits you.',
          'Low fares, no hidden fees.',
          'Compare flights and book in minutes.',
        ]),
      );
    };

    BASE.fieldDecor = env.templateLib('use-shop/_shared-flight').fieldDecor(S);

    // The From / To autocomplete field f.
    BASE.flightField = env.templateLib('use-shop/_shared-flight').flightField(S);

    // The Depart field with its calendar popup (env.ui.calendar).
    BASE.flightDate = (V) => {
      const { ctx, util, rng, fam, body, row, step, set } = V;
      const dfld = util.el('div', 'fl-field date', row);
      util.el('label', 'fl-lab', dfld, S.D.fieldLabels.date);
      const dctl = util.el('div', 'fl-ctl fl-dctl', dfld);
      dctl.dataset.role = 'date-field';
      dctl.innerHTML = S.D.dateIcon;
      const dval = util.el('span', 'fl-dval', dctl);
      const derr = util.el('div', 'fl-err', dfld, 'Select a date');
      const calPop = util.el('div', 'fl-cal', dfld);
      calPop.dataset.role = 'calendar';
      // Keep the popup inside the app's available stage, outside the clipped form
      // and its stacking context. Calendar targets and bindings remain the same.
      if (S.D.calendarInBody) body.append(calPop);
      const calH = util.el('div', 'fl-calh', calPop);
      const prevEl = util.el('div', 'fl-nav', calH);
      prevEl.innerHTML = S.H.ICON.left;
      const calT = util.el('span', '', calH);
      const nextEl = util.el('div', 'fl-nav', calH);
      nextEl.innerHTML = S.H.ICON.right;
      const wk = util.el('div', 'fl-wk', calPop);
      const weekStart = rng.pick([0, 1]);
      for (let i = 0; i < 7; i++)
        util.el('span', '', wk, ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][(weekStart + i) % 7]);
      const grid = util.el('div', 'fl-grid', calPop);
      if (body.getBoundingClientRect().height < 540) calPop.classList.add('compact');
      const cal = env.ui.calendar({
        label: 'depart',
        weekStart,
        math: { days: fam.days, fromDays: fam.fromDays, weekday: fam.weekday },
        onDay(iso, { inMonth }) {
          if (inMonth) step({ click: { day: iso } });
        },
        onNav(dir) {
          step({ click: { nav: dir } });
        },
      });
      cal.bindNav(prevEl, 'prev');
      cal.bindNav(nextEl, 'next');
      dctl.addEventListener('click', () => step({ click: { field: 'date' } }));
      // A press outside the date field and its calendar closes the calendar.
      const outside = (e) => {
        if (!calPop.isConnected) {
          document.removeEventListener('pointerdown', outside, true);
          return;
        }
        if (ctx.model.calOpen && !dfld.contains(e.target) && !(S.D.calendarInBody && calPop.contains(e.target)))
          set({ calOpen: false });
      };
      document.addEventListener('pointerdown', outside, true);
      Object.assign(V, { dfld, dctl, dval, derr, calPop, prevEl, nextEl, calT, grid, cal });
    };

    // The fixed Trip Type / Passengers fields.
    BASE.flightStatics = (V) => {
      const { util, row } = V;
      for (const [lab, val] of [
        ['Trip Type:', 'One-way'],
        ['Passengers:', '1'],
      ]) {
        const sf = util.el('div', 'fl-field fl-static', row);
        util.el('label', 'fl-lab', sf, lab);
        util.el('div', 'fl-ctl fl-sctl', sf, val);
      }
    };

    // The comparison table's frame is visible before a search, without invented flights.
    BASE.flightEmpty = (V) => {
      const { util, spec, form } = V;
      const empty = (V.empty = util.el('div', 'fl-empty', form));
      util.el('div', 'fl-bar', empty, 'One-Way Flights');
      const emptyHead = util.el('div', 'fl-head', empty);
      ['Airline', 'Depart', 'Arrive', 'Duration', 'Price (USD) ▲', ''].forEach((t) =>
        util.el('span', '', emptyHead, t),
      );
      const emptySheet = util.el('div', 'fl-empty-sheet', empty);
      emptySheet.style.setProperty('--flight-rows', spec.rows);
    };

    BASE.flightDeals = env.templateLib('use-shop/_shared-flight').flightDeals(S);

    BASE.flightForm = env.templateLib('use-shop/_shared-flight').flightForm(S);

    // The summary bar of the results screen: Modify search, route, date, Cancel booking.
    BASE.flightSummary = (V) => {
      const { ctx, util, body, step } = V;
      const res = (V.res = util.el('div', 'fl-res', body));
      const sum = (V.sum = util.el('div', 'fl-sum', res));
      const back = (V.back = S.H.btn(util, 'as-btn fl-back', sum, undefined, 'back'));
      back.innerHTML = `${S.H.ICON.left}<span>Modify search</span>`;
      back.addEventListener('click', () => step({ click: { back: true } }));
      V.route = util.el('span', 'fl-route', sum);
      V.sdate = util.el('span', 'fl-sdate', sum);
      const cancelBook = (V.cancelBook = S.H.btn(util, 'as-btn sm fl-cancel', sum, 'Cancel booking', 'cancel-booking'));
      cancelBook.addEventListener('click', () => {
        if (ctx.model.booked) step({ click: { cancelBook: true } });
      });
      const resultBar = util.el('div', 'fl-bar', res, 'One-Way Flights');
      resultBar.append(back, cancelBook);
    };
  }

  function installFlightTable(BASE, S) {
    BASE.flightTable = (V) => {
      const { util, res } = V;
      const fhead = util.el('div', 'fl-head', res);
      ['Airline', 'Depart', 'Arrive', 'Duration', 'Price (USD) ▲', ''].forEach((t) => util.el('span', '', fhead, t));
      V.count = util.el('div', 'fl-count', res, ' ');
      V.pane = util.el('div', 'as-pane', res);
      const ffoot = util.el('div', 'as-foot', res);
      ffoot.innerHTML =
        '<span>Fares include taxes and carrier fees. Baggage allowance varies by airline. <b>Free cancellation</b> within 24 hours.</span>';
      V.cover = util.el('div', 'fl-cover', res);
      V.cover.dataset.role = 'loading';
      for (let i = 0; i < 4; i++) util.el('div', 'as-skel', V.cover).style.width = `${92 - i * 13}%`;
    };

    // The route and date texts of the summary bar for the searched trip s.
    BASE.resultsSummary = env.templateLib('use-shop/_shared-flight').resultsSummary(S);

    // Row pitch of the flight pane (once per page): sets V.pitch, the pane height and the mirrored pitch.
    BASE.flightPitch = (V) => {
      const { ctx, spec, rng, body, pane, sum, res, gap } = V;
      const reserve = getComputedStyle(sum).display === 'none' ? 0 : sum.getBoundingClientRect().height;
      V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, 26, rng.int(84, 100), reserve);
      res.classList.toggle('compact-results', V.pitch < 36);
      pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
      S.H.mirrorPitch(ctx, V.pitch);
    };

    // One flight row i (fl = flights[i]) of the searched trip s.
    BASE.flightRow = (V, i, fl, flights, s) => {
      const { ctx, util, fam, fmt, step, bookEls, rowEls } = V;
      const r = util.el('div', 'fl-frow');
      r.dataset.role = 'flight';
      const air = util.el('div', 'fl-air', r);
      const logo = util.el('span', 'fl-logo', air);
      const airline = fl.airline.toLowerCase();
      const artwork = airline.includes('delta')
        ? '<path fill="#d40b2e" d="M24 2L2 43l22-9 22 9z"/><path fill="#fff" d="M24 7v23L6 40l18-5 18 5z"/>'
        : airline.includes('southwest')
          ? '<path fill="#ee1327" d="M24 43L5 25C-8 10 10-4 24 8 38-4 56 10 43 25z"/><path fill="#0060ae" d="M3 19l30 23-9 4L7 30z"/><path fill="#ffbd21" d="M25 8Q40-4 47 12l-8 8z"/>'
          : airline.includes('american')
            ? '<path fill="#007db7" d="M2 2h12l14 20H16z"/><path fill="#eee" d="M16 24q8-7 17 0l13 20H33z"/><path fill="#c51230" d="M21 26q7-5 13 0l11 17H30z"/>'
            : airline.includes('united')
              ? '<rect x="2" y="2" width="44" height="44" fill="#111785"/><g fill="none" stroke="#fff" stroke-width="1.3"><path d="M2 7q34 1 40 39M2 13q27 3 32 33M2 22q18 4 23 24M2 33q10 2 13 13M5 2q33 15 41 36M14 2q24 16 32 25M2 44l38-28M2 35L30 9M2 25L21 3"/></g>'
              : airline.includes('jetblue')
                ? '<text x="0" y="33" fill="#0b0b63" font-family="Arial,sans-serif" font-size="15" font-weight="bold">jetBlue</text>'
                : '<circle cx="24" cy="24" r="21" fill="#1a3985"/><path d="M7 24l13-3 4-15 4 15 13 3v4l-13-2-2 13h-4l-2-13-13 2z" fill="#f4e9b5"/>';
      logo.innerHTML = `<svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">${artwork}</svg>`;
      util.el('b', '', air, fl.airline);
      util.el('span', '', air, fl.no);
      const times = util.el('div', 'fl-times', r);
      util.el('span', 'fl-t', times, `${s.from} ${fam.fmtTime(fl.dep)}`);
      const line = util.el('div', 'fl-line', times);
      util.el('span', '', line, fam.fmtDur(fl.dur));
      util.el('i', '', line);
      util.el('span', '', line, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
      const arr = util.el('span', 'fl-t', times, `${s.to} ${fam.fmtTime(fl.dep + fl.dur)}`);
      if (fl.dep + fl.dur >= 1440) util.el('sup', '', arr, '(+1 day)');
      const fare = util.el('div', 'fl-fare', r);
      fare.append(['Economy Light', 'Economy', 'Economy Flex', 'Basic'][(fl.price / 100 + fl.dep) % 4]);
      util.el('br', '', fare);
      if (((fl.price / 100) * 7 + fl.dur) % 3 === 0)
        util.el('b', '', fare, `${1 + ((fl.price / 100 + fl.dur) % 5)} seats left`);
      else fare.append('Carry-on included');
      const price = util.el('div', 'fl-fp', r, fmt(fl.price));
      price.classList.toggle('low', fl.price === Math.min(...flights.map((f) => f.price)));
      price.classList.toggle('high', fl.price === Math.max(...flights.map((f) => f.price)));
      const b = S.H.btn(util, 'as-btn primary fl-book', r, 'Book', 'book');
      b.addEventListener('click', () => {
        if (!ctx.model.booked && !(ctx.model.loading > 0)) step({ click: { book: i } });
      });
      bookEls[i] = b;
      rowEls[i] = r;
      return r;
    };

    // Rebuild the flight list for the searched trip (m.searched).
    BASE.flightResults = env.templateLib('use-shop/_shared-flight').flightResults(S);

    BASE.flightCal = env.templateLib('use-shop/_shared-flight').flightCal(S);

    // Which screen shows, and the trip information in the site's frame.
    BASE.paintScreen = (V, m) => {
      const { spec, fam, fmt, form, res, card, empty, tripSelection, tripValues } = V;
      form.hidden = m.screen !== 'form';
      res.hidden = m.screen !== 'results';
      // The scene is sampled by the task. Keep its populated search fields visible
      // together with the candidates, using the same controls and event handlers.
      if (m.screen === 'results' && card.parentElement !== res) res.prepend(card);
      else if (m.screen === 'form' && card.parentElement !== form) form.insertBefore(card, empty);
      if (tripSelection) {
        const selected = m.booked && m.searched ? fam.flightsFor(spec, m.searched)[m.booked.index] : null;
        tripSelection.textContent = selected ? `${selected.airline} · ${fmt(selected.price)}` : '(none yet)';
      }
      if (m.searched) {
        if (tripValues.from) tripValues.from.textContent = `${fam.airport(m.searched.from).city} (${m.searched.from})`;
        if (tripValues.to) tripValues.to.textContent = `${fam.airport(m.searched.to).city} (${m.searched.to})`;
        if (tripValues.date) tripValues.date.textContent = fam.fmtDate(m.searched.date, 'us');
      }
    };

    // The count line and the loading cover over the flight pane.
    BASE.paintResultsHead = env.templateLib('use-shop/_shared-flight').paintResultsHead(S);

    BASE.paintBookRow = env.templateLib('use-shop/_shared-flight').paintBookRow(S);

    BASE.paintEnd = env.templateLib('use-shop/_shared-flight').paintEnd(S);

    BASE.flightPaint = env.templateLib('use-shop/_shared-flight').flightPaint(S);

    BASE.flightLocate = env.templateLib('use-shop/_shared-flight').flightLocate(S);

    BASE.buildFlight = (ctx, body) => {
      const { util, spec, rng } = ctx;
      const fam = S.H.F();
      const V = { ctx, body, util, spec, rng, fam, fmt: S.H.whole(spec), x: {} };
      V.commit = (m) => {
        ctx.update(m);
        V.paint(ctx.model);
      };
      V.step = (s) => V.commit(fam.apply(ctx.model, spec, s));
      V.set = (patch) => V.commit({ ...ctx.model, ...patch });
      V.paint = (m) => S.P.flightPaint(V, m);
      S.P.flightTrip(V);
      S.P.flightForm(V);
      S.P.flightSummary(V);
      S.P.flightTable(V);
      V.lbx = null;
      V.builtKey = null;
      V.pitch = 0;
      V.gap = 1;
      V.bookEls = {};
      V.rowEls = {};
      V.paint(ctx.model);
      S.P.built(V);
      return { paint: V.paint, locate: (t) => S.P.flightLocate(V, t) };
    };
  }
  env.template('use-shop/_adapted-flight', () => ({ install }), { uses: ['use-shop/_shared-flight'] });
})();
