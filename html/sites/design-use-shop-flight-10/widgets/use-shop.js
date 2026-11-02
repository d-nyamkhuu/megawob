// Adds airport details, a compact results search card and branded flight rows.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-flight-10',
  name: 'design',
  split: 'train',
  scenarios: ['flight'],
  template: 'use-shop/store',
  design: {
    fieldLabels: { from: 'From', to: 'To', date: 'Date' },
    searchLabel: 'Search',
    dateFormat: 'long',
    parts: {
      flightStatics: () => () => {},
      flightEmpty: () => () => {},
      flightColumns: () => () => {},
      flightForm: (base) => (V) => {
        base(V);
        const { util, row, fields } = V;
        const pills = V.card.querySelector('.fl-pills');
        pills.children[1].textContent = 'Round-trip';
        pills.children[2].textContent = 'Multi-city';
        const toField = fields.to.input.closest('.fl-field');
        const swap = util.el('div', 'fl-swap', row, '⇄');
        swap.setAttribute('aria-hidden', 'true');
        row.insertBefore(swap, toField);
        for (const f of ['from', 'to']) {
          const fd = fields[f];
          fd.fld = fd.input.closest('.fl-field');
          fd.airportCode = util.el('span', 'fl-code', fd.ctl);
          fd.airportCode.setAttribute('aria-hidden', 'true');
          fd.city = util.el('div', 'fl-city', fd.fld);
        }
      },
      flightSummary: (base, S) => (V) => {
        const { util, body, step, ctx } = V;
        const res = (V.res = util.el('div', 'fl-res', body));
        const resultCard = util.el('div', 'fl-card fl-results-card', res);
        const pills = util.el('div', 'fl-pills', resultCard);
        for (const [i, label] of ['One-way', 'Round-trip', 'Multi-city'].entries())
          util.el('span', 'fl-pill' + (i === 0 ? ' on' : ''), pills, label);
        const row = util.el('div', 'fl-row', resultCard);
        V.x.resultValues = {};
        for (const f of ['from', 'to', 'date']) {
          if (f === 'to') util.el('div', 'fl-swap', row, '⇄');
          const field = util.el('div', 'fl-field' + (f === 'date' ? ' date' : ''), row);
          util.el('div', 'fl-lab', field, f === 'from' ? 'From' : f === 'to' ? 'To' : 'Date');
          const ctl = util.el('div', 'fl-ctl' + (f === 'date' ? ' fl-dctl' : ''), field);
          if (f === 'date') ctl.innerHTML = S.H.ICON.cal;
          const value = util.el('span', f === 'date' ? 'fl-dval' : 'fl-input', ctl);
          const city = util.el('div', 'fl-city', field);
          V.x.resultValues[f] = { value, city };
        }
        V.x.modify = S.H.btn(util, 'as-btn primary fl-go', row, 'Search');
        V.x.modify.addEventListener('click', () => {
          if (!ctx.model.booked) step({ click: { back: true } });
        });
        const sum = (V.sum = util.el('div', 'fl-sum', res));
        util.el('div', 'fl-title', sum, 'Departing flights');
        const sort = util.el('div', 'fl-sort', sum);
        util.el('span', '', sort, 'Sort by');
        const sortButton = S.H.btn(util, '', sort, 'Recommended');
        sortButton.addEventListener('click', () => env.log('decoy', { what: 'Recommended sort' }));
        V.back = S.H.btn(util, 'as-btn fl-back', sum, undefined, 'back');
        V.back.innerHTML = `${S.H.ICON.left}<span>Modify search</span>`;
        V.back.addEventListener('click', () => step({ click: { back: true } }));
        V.route = util.el('span', 'fl-route', sum);
        V.sdate = util.el('span', 'fl-sdate', sum);
        V.cancelBook = S.H.btn(util, 'as-btn sm fl-cancel', sum, 'Cancel booking', 'cancel-booking');
        V.cancelBook.addEventListener('click', () => {
          if (ctx.model.booked) step({ click: { cancelBook: true } });
        });
      },
      resultsSummary: () => (V, s) => {
        V.route.textContent = `${V.fam.airport(s.from).city} (${s.from}) → ${V.fam.airport(s.to).city} (${s.to})`;
        for (const f of ['from', 'to']) {
          V.x.resultValues[f].value.textContent = s[f];
          const airport = V.fam.airport(s[f]);
          V.x.resultValues[f].city.textContent = `${airport.city}${airport.st ? ', ' + airport.st : ''}`;
        }
        V.x.resultValues.date.value.textContent = V.fam.fmtDate(s.date, 'long');
        V.sdate.textContent = `| ${V.fam.fmtDate(s.date, 'long')}`;
      },
      flightResults: (base) => (V, m) => {
        V.gap = 14;
        base(V, m);
      },
      flightPitch: (base, S) => (V) => {
        const { ctx, spec, rng, body, pane } = V;
        V.gap = 14;
        V.pitch = S.H.pitchFor(pane, body, spec.rows, V.gap, 60, rng.int(84, 100) + 20, 48);
        pane.style.height = spec.rows * V.pitch - V.gap + 2 + 'px';
        S.H.mirrorPitch(ctx, V.pitch);
      },
      flightRow: (base, S) => (V, i, fl, flights, s) => {
        const { ctx, util, fam, fmt, step, bookEls, rowEls } = V;
        const r = util.el('div', 'fl-frow');
        r.dataset.role = 'flight';
        const air = util.el('div', 'fl-air', r);
        const logo = util.el('div', 'fl-logo', air);
        const airline = fl.airline.toLowerCase();
        if (airline.includes('delta')) logo.innerHTML = '<svg viewBox="0 0 44 48"><path d="M22 3 2 42l20-13 20 13z" fill="#cf0035"/><path d="m22 3 0 26 20 13z" fill="#a6002a"/><path d="m2 42 20-10 20 10-20-4z" fill="#ef174c"/></svg>';
        else if (airline.includes('american')) logo.innerHTML = '<svg viewBox="0 0 44 48"><path d="M1 2h13l12 18H13z" fill="#0796d3"/><path d="m18 24 12 0 13 23H29L19 33q-5-5-1-9" fill="#dc1734"/><path d="m14 19 17 2-9 6-10-4z" fill="#b4cadd"/></svg>';
        else if (airline.includes('united')) logo.innerHTML = '<svg viewBox="0 0 44 48"><path fill="#073394" d="M1 1h42v46H1z"/><g fill="none" stroke="#fff" stroke-width="1"><circle cx="5" cy="44" r="37"/><circle cx="5" cy="44" r="30"/><circle cx="5" cy="44" r="23"/><path d="M1 9q36 5 38 38M1 18q27 5 28 29M1 27q16 5 18 20M4 1l35 46M1 13l29 34M1 28l20 19M1 40l8 7M1 21l28-13M1 31l35-12M1 41l39-9"/></g></svg>';
        else if (airline.includes('jetblue')) logo.innerHTML = '<svg viewBox="0 0 70 45"><text x="0" y="30" fill="#00378c" font-family="Arial,sans-serif" font-weight="700" font-size="23" letter-spacing="-2">jetBlue</text></svg>';
        else if (airline.includes('southwest')) logo.innerHTML = '<svg viewBox="0 0 44 48"><path d="M22 43C-8 25 0 5 12 4q8 0 10 7 10-13 18-3 12 15-18 35z" fill="#e31b3d"/><path d="M22 11q10-13 18-3l1 5z" fill="#f8b51d"/><path d="M2 17 29 36l-7 7Q5 33 2 17" fill="#064cad"/><path d="m2 16 28 20" stroke="white" stroke-width="2"/></svg>';
        else logo.innerHTML = S.H.ICON.plane;
        util.el('b', '', air, fl.airline);
        util.el('span', '', air, fl.no);
        const times = util.el('div', 'fl-times', r);
        const depart = util.el('span', 'fl-t', times, fam.fmtTime(fl.dep));
        util.el('span', 'fl-airport', depart, s.from);
        const line = util.el('div', 'fl-line', times);
        util.el('span', '', line, fam.fmtDur(fl.dur));
        util.el('i', '', line);
        util.el('span', '', line, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
        const arr = util.el('span', 'fl-t', times, fam.fmtTime(fl.dep + fl.dur));
        if (fl.dep + fl.dur >= 1440) util.el('sup', '', arr, '+1');
        util.el('span', 'fl-airport', arr, s.to);
        const fare = util.el('div', 'fl-fare', r);
        fare.append(['Economy Light', 'Economy', 'Economy Flex', 'Basic'][(fl.price / 100 + fl.dep) % 4]);
        util.el('br', '', fare);
        if ((fl.price / 100 * 7 + fl.dur) % 3 === 0) util.el('b', '', fare, `${1 + ((fl.price / 100 + fl.dur) % 5)} seats left`);
        else fare.append('Carry-on included');
        util.el('div', 'fl-fp', r, fmt(fl.price));
        const b = S.H.btn(util, 'as-btn primary fl-book', r, 'Book', 'book');
        b.addEventListener('click', () => { if (!ctx.model.booked && !(ctx.model.loading > 0)) step({ click: { book: i } }); });
        bookEls[i] = b;
        rowEls[i] = r;
        return r;
      },
      flightPaint: (base) => (V, m) => {
        base(V, m);
        for (const f of ['from', 'to']) {
          const fd = V.fields[f];
          const airport = m[f] ? V.fam.airport(m[f]) : null;
          fd.city.textContent = airport ? `${airport.city}${airport.st ? ', ' + airport.st : ''}` : '';
          fd.fld.classList.toggle('has-airport', !!airport);
          fd.airportCode.textContent = airport ? m[f] : '';
        }
        if (m.screen === 'results' && m.searched) V.x.modify.disabled = !!m.booked;
      },
    },
  },
});
