// This design adds the flight site's searchable fare table and selected-flight booking flow.
(function () {
  'use strict';

  const DATE_ICON = '<svg viewBox="0 0 28 30" fill="none" aria-hidden="true"><rect x="2" y="4" width="24" height="24" stroke="currentColor" stroke-width="1.5"/><path d="M2 10h24M8 1v7M20 1v7" stroke="currentColor" stroke-width="2"/><path d="M7 14h2m4 0h2m4 0h2M7 19h2m4 0h2m4 0h2M7 24h2m4 0h2m4 0h2" stroke="currentColor" stroke-width="2"/></svg>';

  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-flight-06',
    name: 'design',
    split: 'train',
    scenarios: ['flight'],
    traits: { sort: true },
    template: 'use-shop/store',
    design: {
      fieldLabels: { from: 'From', to: 'To', date: 'Date' },
      searchLabel: 'Search Flights',
      dateIcon: DATE_ICON,
      dateFormat: 'us',
      parts: {
        flightHeading: (base, S) => (V) => {
          const { util, rng, form } = V;
          rng.pick(['Where to next?', 'Find your flight', 'Book a flight']);
          util.el('div', 'fl-h', form, 'Search Flights');
          util.el('div', 'fl-hs', form, rng.pick([
            'Search hundreds of airlines and pick the fare that suits you.',
            'Low fares, no hidden fees.',
            'Compare flights and book in minutes.',
          ]));
        },
        flightForm: (base, S) => (V) => {
          base(V);
          const pills = V.card.querySelector('.fl-pills');
          pills.replaceChildren();
          const { util } = V;
          util.el('span', 'fl-trip-label', pills, 'Trip type:');
          util.el('span', 'fl-pill on', pills, 'One-way');
          util.el('span', 'fl-pill', pills, 'Round-trip');
          V.card.append(V.go);
        },
        flightDate: (base, S) => (V) => {
          base(V);
          const { util } = V;
          V.dctl.addEventListener('click', (e) => {
            if (V.ctx.model.screen !== 'form') {
              e.stopImmediatePropagation();
              e.preventDefault();
            }
          }, true);
        },
        flightStatics: () => () => {},
        flightEmpty: () => () => {},
        flightSummary: (base, S) => (V) => {
          const { ctx, util, step, fam } = V;
          V.res = util.el('div', 'fl-res', V.body);
          V.sum = util.el('div', 'fl-sum', V.res);
          V.back = S.H.btn(util, 'as-btn fl-back', V.sum, undefined, 'back');
          V.back.innerHTML = `${S.H.ICON.left}<span>Modify search</span>`;
          V.back.addEventListener('click', () => step({ click: { back: true } }));
          V.route = util.el('span', 'fl-route', V.sum);
          V.sdate = util.el('span', 'fl-sdate', V.sum);
          const sort = V.x.sort = util.el('div', 'fl-sort', V.sum);
          util.el('span', '', sort, 'Sort:');
          const trigger = V.x.sortTrigger = util.el('button', 'fl-sort-trigger', sort);
          trigger.type = 'button';
          V.x.sortValue = util.el('span', '', trigger);
          const pop = V.x.sortPop = util.el('div', 'fl-sort-pop', sort);
          V.x.sortOptions = {};
          for (const [k, label] of fam.FLIGHT_SORTS) {
            const option = util.el('div', 'fl-sort-option', pop, label);
            option.dataset.role = 'sort-option';
            V.x.sortOptions[k] = option;
          }
          V.x.sortDd = env.ui.dropdown(trigger, pop, {
            label: 'flight sort', value: ctx.model.sort,
            options: fam.FLIGHT_SORTS.map(([k]) => [k, V.x.sortOptions[k]]),
            onChange(value) { if (value !== ctx.model.sort) step({ click: { sortBy: value } }); },
          });
          V.cancelBook = S.H.btn(util, 'as-btn sm fl-cancel', V.sum, 'Cancel booking', 'cancel-booking');
          V.cancelBook.addEventListener('click', () => {
            if (ctx.model.booked) step({ click: { cancelBook: true } });
          });
          V.count = util.el('div', 'fl-count', V.res, '\u00a0');
          V.tableHead = util.el('div', 'fl-table-head', V.res);
          for (const label of ['Select', 'Airline', 'Flight #', 'Departure', 'Arrival', 'Duration', 'Price (USD)'])
            util.el('b', '', V.tableHead, label);
          V.pane = util.el('div', 'as-pane', V.res);
          util.el('div', 'fl-empty', V.pane, 'Search for flights to view available fares.');
          V.x.selectedFlight = null;
          V.x.resultActions = util.el('div', 'fl-result-actions', V.res);
          V.x.bookSelected = S.H.btn(util, 'as-btn fl-book-selected', V.x.resultActions, 'Book Selected Flight', 'book-selected');
          V.x.resultActions.append(V.back, V.cancelBook);
          V.x.bookSelected.addEventListener('click', () => {
            if (ctx.model.screen === 'results' && V.x.selectedFlight !== null && !ctx.model.booked && !(ctx.model.loading > 0))
              step({ click: { book: V.x.selectedFlight } });
          });
          V.x.passenger = util.el('section', 'fl-passenger', V.body);
          util.el('h2', '', V.x.passenger, 'Passenger Information');
          for (const label of ['Full name:', 'Email:', 'Phone:']) {
            const line = util.el('label', 'fl-passenger-line', V.x.passenger);
            util.el('span', '', line, label);
            const input = util.el('input', '', line);
            input.type = 'text';
            input.autocomplete = 'off';
          }
        },
        flightTable: (base, S) => (V) => {
          const { util, res } = V;
          V.foot = util.el('div', 'as-foot', res);
          V.foot.innerHTML = '<span>Fares include taxes and carrier fees. Baggage allowance varies by airline. <b>Free cancellation</b> within 24 hours.</span>';
          V.cover = util.el('div', 'fl-cover', res);
          V.cover.dataset.role = 'loading';
          for (let i = 0; i < 4; i++) util.el('div', 'as-skel', V.cover).style.width = `${92 - i * 13}%`;
        },
        flightPitch: (base, S) => (V) => {
          const { ctx, spec, rng, pane, gap } = V;
          S.H.pitchFor(pane, V.body, spec.rows, gap, 60, rng.int(84, 100), 48);
          V.pitch = Math.max(16, Math.floor((pane.getBoundingClientRect().height - 2 + gap) / spec.rows));
          pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
          S.H.mirrorPitch(ctx, V.pitch);
        },
        resultsSummary: () => (V, s) => {
          V.x.selectedFlight = null;
          V.route.textContent = `One-way flights: ${s.from} to ${s.to}`;
          V.sdate.textContent = `on ${V.fam.fmtDate(s.date, 'long')}`;
          V.tableHead.children[3].textContent = `Departure\n${s.from}`;
          V.tableHead.children[4].textContent = `Arrival\n${s.to}`;
        },
        flightRow: (base, S) => (V, i, fl, flights, s) => {
          const { ctx, util, fam, fmt, step, bookEls, rowEls } = V;
          const r = util.el('div', 'fl-frow');
          r.dataset.role = 'flight';
          const air = util.el('div', 'fl-air', r);
          util.el('b', '', air, fl.airline);
          util.el('span', 'fl-number', r, fl.no);
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
          if ((fl.price / 100 * 7 + fl.dur) % 3 === 0)
            util.el('b', '', fare, `${1 + ((fl.price / 100 + fl.dur) % 5)} seats left`);
          else fare.append('Carry-on included');
          util.el('div', 'fl-fp', r, fmt(fl.price));
          const b = S.H.btn(util, 'as-btn primary fl-book', r, 'Book', 'book');
          b.setAttribute('role', 'radio');
          b.setAttribute('aria-label', `Select ${fl.airline} ${fl.no}`);
          b.setAttribute('aria-checked', 'false');
          b.addEventListener('click', () => {
            if (ctx.model.screen === 'results' && !ctx.model.booked && !(ctx.model.loading > 0)) {
              V.x.selectedFlight = i;
              for (const [key, el] of Object.entries(bookEls)) {
                el.classList.toggle('selected', +key === i);
                el.setAttribute('aria-checked', String(+key === i));
              }
            }
          });
          bookEls[i] = b;
          rowEls[i] = r;
          return r;
        },
        flightResults: (base, S) => (V, m) => {
          const { ctx, spec, fam, pane, gap, bookEls } = V;
          const s = m.searched;
          const flights = fam.flightsFor(spec, s);
          S.P.resultsSummary(V, s);
          if (!V.pitch) S.P.flightPitch(V);
          for (const k of Object.keys(bookEls)) delete bookEls[k];
          V.lbx = S.H.listPane(ctx, pane, {
            keys: fam.flightOrder(spec, s, ctx.model.sort), rows: spec.rows,
            pitch: V.pitch, gap, scroll: m.scroll, label: 'flights',
            build(i) { return S.P.flightRow(V, i, flights[i], flights, s); },
          });
        },
        flightPaint: (base, S) => (V, m) => {
          const { fam, fields, dval, dctl, derr, calPop, grid } = V;
          V.form.hidden = false;
          V.res.hidden = false;
          V.back.hidden = m.screen !== 'results';
          V.x.bookSelected.disabled = !!m.booked || m.loading > 0;
          V.go.disabled = m.screen !== 'form';
          dctl.setAttribute('aria-disabled', String(m.screen !== 'form'));
          if (!m.searched) {
            V.route.textContent = 'One-way flights';
            V.sdate.textContent = '';
            V.count.textContent = '';
            V.cancelBook.hidden = true;
            if (V.builtKey !== null) {
              V.pane.replaceChildren();
              V.util.el('div', 'fl-empty', V.pane, 'Search for flights to view available fares.');
              V.builtKey = null;
              V.x.selectedFlight = null;
              V.lbx = null;
              for (const key of Object.keys(V.bookEls)) delete V.bookEls[key];
              for (const key of Object.keys(V.rowEls)) delete V.rowEls[key];
            }
          }
          V.x.sort.hidden = !m.searched;
          if (m.sort) {
            const selected = fam.FLIGHT_SORTS.find(([k]) => k === m.sort);
            V.x.sortValue.textContent = selected ? selected[1] : String(m.sort);
          }
          for (const f of ['from', 'to']) {
            const fd = fields[f];
            fd.input.disabled = m.screen !== 'form';
            if (fd.input.value !== m[f + 'Text']) fd.ac.set({ text: m[f + 'Text'] });
            fd.ac.set({ open: m.ac === f }); // a reverted model (pageFaults=revert) can reopen the list
            const bad = m.invalid.includes(f);
            fd.ctl.classList.toggle('bad', bad);
            fd.err.hidden = !bad;
          }
          dval.textContent = m.date ? fam.fmtDate(m.date, 'us') : 'MM/DD/YYYY';
          dval.classList.toggle('empty', !m.date);
          dctl.classList.toggle('bad', m.invalid.includes('date'));
          dctl.classList.toggle('open', m.calOpen);
          derr.hidden = !m.invalid.includes('date');
          calPop.hidden = !m.calOpen;
          if (m.calOpen && V.calBuilt !== m.calView) S.P.flightCal(V, m);
          if (m.calOpen) for (const d of grid.children) d.classList.toggle('sel', d.dataset.iso === m.date && !d.classList.contains('blank'));
          if (m.screen === 'results' && m.searched) {
            const key = JSON.stringify([m.searched, m.sort]);
            if (key !== V.builtKey) {
              V.builtKey = key;
              S.P.flightResults(V, m);
            }
            const loading = m.loading > 0;
            const n = fam.flightsFor(V.spec, m.searched).length;
            V.count.textContent = loading ? 'Searching airlines for the best fares…' : `${n} flights found · prices per person, taxes included`;
            V.cover.hidden = !loading;
            if (loading) Object.assign(V.cover.style, { left: V.pane.offsetLeft + 'px', top: V.pane.offsetTop + 'px', width: V.pane.offsetWidth + 'px', height: V.pane.offsetHeight + 'px' });
            for (const [i, b] of Object.entries(V.bookEls)) {
              const mine = !!m.booked && m.booked.index === +i;
              b.disabled = !!m.booked || loading;
              b.textContent = mine ? 'Booked' : 'Book';
              b.classList.toggle('mine', mine);
              b.setAttribute('aria-checked', String(mine || V.x.selectedFlight === +i));
              V.rowEls[i].classList.toggle('booked', mine);
            }
            V.back.disabled = !!m.booked;
            V.cancelBook.hidden = !m.booked;
          } else {
            V.cover.hidden = true;
            for (const b of Object.values(V.bookEls)) b.disabled = true;
          }
        },
        flightLocate: (base, S) => (V, t) => {
          if (t.sort) return V.x.sortDd.locateTrigger();
          if (t.sortBy) return V.x.sortDd.locateOption(t.sortBy);
          if (t.book !== undefined)
            return V.x.selectedFlight === t.book
              ? S.H.where(V.x.bookSelected, 'Book Selected Flight')
              : S.H.where(V.bookEls[t.book], `Select ${t.book}`);
          return base(V, t);
        },
      },
    },
  });
})();
