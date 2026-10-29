/* use-shop/_store-flight: store flight parts; designs still override each BASE part. */
(function () {
  'use strict';
  function install(BASE, S) {
    installFlightHeading(BASE, S);
    installFlightRow(BASE, S);
  }

  function installFlightHeading(BASE, S) {
    BASE.flightHeading = (V) => {
      const { util, rng, form } = V;
      util.el('div', 'fl-h', form, rng.pick(['Where to next?', 'Find your flight', 'Book a flight']));
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
      dctl.innerHTML = S.D.dateIcon ?? S.H.ICON.cal;
      const dval = util.el('span', 'fl-dval', dctl);
      const derr = util.el('div', 'fl-err', dfld, 'Select a date');
      const calPop = util.el('div', 'fl-cal', dfld);
      calPop.dataset.role = 'calendar';
      // The popup stays inside the app's body, outside the clipped form (token calendarInBody).
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

    // Fixed fields after the date field (default: none).
    BASE.flightStatics = () => {};

    // A comparison table shown before the first search (default: none).
    BASE.flightEmpty = () => {};

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
      V.cancelBook = S.H.btn(util, 'as-btn sm fl-cancel', sum, 'Cancel booking', 'cancel-booking');
      V.cancelBook.addEventListener('click', () => {
        if (ctx.model.booked) step({ click: { cancelBook: true } });
      });
    };

    // Column heads between the count line and the flight pane (default: none).
    BASE.flightColumns = () => {};

    // The count line, the flight pane, the fare note and the loading cover.
    BASE.flightTable = (V) => {
      const { util, res } = V;
      V.count = util.el('div', 'fl-count', res, ' ');
      S.P.flightColumns(V);
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
      const { ctx, spec, rng, body, pane, gap } = V;
      V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, 60, rng.int(84, 100), 48);
      pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
      S.H.mirrorPitch(ctx, V.pitch);
    };
  }

  function installFlightRow(BASE, S) {
    BASE.flightRow = (V, i, fl, flights, s) => {
      const { ctx, util, fam, fmt, step, bookEls, rowEls } = V;
      const r = util.el('div', 'fl-frow');
      r.dataset.role = 'flight';
      const air = util.el('div', 'fl-air', r);
      util.el('b', '', air, fl.airline);
      util.el('span', '', air, fl.no);
      const times = util.el('div', 'fl-times', r);
      util.el('span', 'fl-t', times, fam.fmtTime(fl.dep));
      const line = util.el('div', 'fl-line', times);
      util.el('span', '', line, fam.fmtDur(fl.dur));
      util.el('i', '', line);
      util.el('span', '', line, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
      const arr = util.el('span', 'fl-t', times, fam.fmtTime(fl.dep + fl.dur));
      if (fl.dep + fl.dur >= 1440) util.el('sup', '', arr, '+1');
      const fare = util.el('div', 'fl-fare', r);
      fare.append(['Economy Light', 'Economy', 'Economy Flex', 'Basic'][(fl.price / 100 + fl.dep) % 4]);
      util.el('br', '', fare);
      if (((fl.price / 100) * 7 + fl.dur) % 3 === 0)
        util.el('b', '', fare, `${1 + ((fl.price / 100 + fl.dur) % 5)} seats left`);
      else fare.append('Carry-on included');
      util.el('div', 'fl-fp', r, fmt(fl.price));
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

    // Which screen shows.
    BASE.paintScreen = (V, m) => {
      V.form.hidden = m.screen !== 'form';
      V.res.hidden = m.screen !== 'results';
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
  env.template('use-shop/_store-flight', () => ({ install }), { uses: ['use-shop/_shared-flight'] });
})();
