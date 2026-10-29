// The store lineage's most divergent live flight builder: inline form, sorted selectable rows and a trip inspector.
(function () {
  'use strict';
  const flightTime = (minutes) => {
    const n = ((minutes % 1440) + 1440) % 1440;
    return `${Math.floor(n / 60) % 12 || 12}:${String(n % 60).padStart(2, '0')} ${n < 720 ? 'AM' : 'PM'}`;
  };
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-flight-03',
    name: 'design',
    split: 'train',
    scenarios: ['flight'],
    template: 'use-shop/store',
    design: {
      dateFormat: 'us',
      dateIcon:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="1"/><path d="M7 2v5M17 2v5M3 9h18M7 11v8M12 11v8M17 11v8M5 14h14M5 17h14"/></svg>',
      parts: {
        flightField: (base, S) => (V, f) => {
          base(V, f);
          const { ctx, util, row, set } = V;
          const { btn } = S.H;
          const fd = V.fields[f];
          fd.caption = util.el('div', 'fl-caption', fd.err.parentElement, '\u00a0');
          if (f === 'from') {
            const swap = btn(util, 'fl-swap', row, '⇄', 'swap');
            swap.title = 'Swap origin and destination';
            swap.addEventListener('click', () =>
              set({
                from: ctx.model.to,
                to: ctx.model.from,
                fromText: ctx.model.toText,
                toText: ctx.model.fromText,
                ac: null,
              }),
            );
          }
        },
        flightStatics: () => (V) => {
          const { util, row } = V;
          const tripType = util.el('div', 'fl-triptype', row);
          util.el('label', 'fl-lab', tripType, 'Trip type');
          util.el('div', 'fl-typevalue', tripType, 'One-way');
        },
        flightEmpty: () => (V) => {
          const { util, form } = V;
          V.x.empty = util.el('section', 'fl-empty', V.form);
          util.el('h3', '', V.x.empty, 'One-way flights');
          const emptyHead = util.el('div', 'fl-columns', V.x.empty);
          for (const label of ['', 'Airline', 'Depart ▴', 'Arrive', 'Duration', 'Price'])
            util.el('span', '', emptyHead, label);
        },
        flightSummary: (base, S) => (V) => {
          const { ctx, util, body, step, fam } = V;
          const { btn, ICON } = S.H;
          V.res = util.el('div', 'fl-res', V.body);
          V.sum = util.el('div', 'fl-sum', V.res);
          V.back = btn(util, 'as-btn fl-back', V.sum, undefined, 'back');
          V.back.innerHTML = `${ICON.left}<span>Modify search</span>`;
          V.back.addEventListener('click', () => step({ click: { back: true } }));
          V.route = util.el('span', 'fl-route', V.sum);
          V.sdate = util.el('span', 'fl-sdate', V.sum);
          V.cancelBook = btn(util, 'as-btn sm fl-cancel', V.sum, 'Cancel booking', 'cancel-booking');
          V.cancelBook.addEventListener('click', () => {
            if (ctx.model.booked) step({ click: { cancelBook: true } });
          });
          const sort = util.el('div', 'fl-sort', V.sum);
          util.el('span', '', sort, 'Sort by');
          const sortTrigger = util.el('div', 'fl-sort-trigger', sort);
          sortTrigger.dataset.role = 'sort';
          V.x.sortValue = util.el('span', '', sortTrigger);
          sortTrigger.insertAdjacentHTML('beforeend', ICON.chev);
          const sortPop = util.el('div', 'fl-sort-pop', sort);
          sortPop.dataset.role = 'sort-options';
          V.x.sortOptions = fam.FLIGHT_SORTS || fam.SORTS;
          V.x.sortEls = {};
          for (const [key, label] of V.x.sortOptions) {
            const option = util.el('div', 'fl-sort-opt', sortPop, label);
            option.dataset.role = 'option';
            V.x.sortEls[key] = option;
          }
          V.x.sortUI = env.ui.dropdown(sortTrigger, sortPop, {
            label: 'sort',
            value: ctx.model.sort,
            options: V.x.sortOptions.map(([key]) => [key, V.x.sortEls[key]]),
            onChange(value) {
              if (value !== ctx.model.sort) step({ click: { sortBy: value } });
            },
          });
        },
        flightColumns: () => (V) => {
          const { util, res } = V;
          const tableTitle = util.el('h3', 'fl-table-title', res, 'One-way flights');
          const columns = util.el('div', 'fl-columns', res);
          for (const label of ['', 'Airline', 'Depart ▴', 'Arrive', 'Duration', 'Price'])
            util.el('span', '', columns, label);
        },
        flightTable: (base, S) => (V) => {
          base(V);
          const { ctx, util, fam, fmt, step } = V;
          const { hashStr } = S.H;
          V.x.choiceEls = {};
          V.x.selected = null;
          V.x.currentFlights = [];
          V.x.side = document.querySelector('.trip');
          V.x.sideBook = V.x.side.querySelector('.trip-book');
          V.x.logo = (airline) => {
            const name = airline.toLowerCase();
            const kind = name.includes('frontier')
              ? 0
              : name.includes('delta')
                ? 1
                : name.includes('american')
                  ? 2
                  : name.includes('southwest')
                    ? 3
                    : name.includes('united')
                      ? 4
                      : hashStr(airline) % 5;
            const paths = [
              '<path fill="#087449" d="M10 5h34l-5 12H8zM8 20h29l-5 11H5zM5 34h20l-5 9H2z"/><path stroke="#549585" d="M9 18h27M6 32h20"/>',
              '<path fill="#b50830" d="M24 3L45 43 24 30 3 43z"/><path fill="#fff" d="M24 24L45 43 24 35 3 43z"/><path fill="#820426" d="M24 3v27L45 43z"/>',
              '<path fill="#258ac0" d="M3 2h10c4 0 9 9 16 21H17z"/><path fill="#b20b22" d="M22 25h10l15 21H32c-4 0-7-5-10-11z"/><path fill="#b9c4c8" d="M17 21c10-5 18-2 23 3l-14 2 5 9-9-1z"/>',
              '<path fill="#dba632" stroke="#aaa" stroke-width="1" d="M24 9C9-5-9 16 6 30l18 16 18-17C56 15 39-4 24 9z"/><path fill="#c1172b" d="M24 11C10-1-5 15 8 28l16 15 16-16C52 15 38-1 24 11z"/><path fill="#183681" d="M6 24l18 19 10-10L8 15z"/><path stroke="#fff" stroke-width="2" d="M8 16l26 17"/>',
              '<rect x="3" y="2" width="43" height="44" fill="#07379b"/><circle cx="8" cy="40" r="34" fill="none" stroke="#fff" stroke-width="1.7"/><path fill="none" stroke="#fff" stroke-width="1.3" d="M7 8c29 5 35 19 24 36M5 13c25 4 31 17 20 31M4 19c20 3 25 14 14 25M4 26c17 1 19 8 8 18M7 7c5 15 16 29 27 32M3 11c7 15 16 25 34 23M3 18c8 12 17 18 36 9M3 26c10 9 21 9 34-2M10 6c1 17 7 30 17 38M17 7c1 13 6 28 13 36"/>',
            ];
            return `<svg class="air-logo" viewBox="0 0 48 48" aria-hidden="true">${paths[kind]}</svg>`;
          };
          V.x.selectFlight = (i) => {
            if (ctx.model.booked) i = ctx.model.booked.index;
            V.x.selected = i;
            const fl = V.x.currentFlights[i];
            if (!fl) return;
            for (const [key, el] of Object.entries(V.rowEls)) {
              el.classList.toggle('selected', +key === i);
              V.x.choiceEls[key].setAttribute('aria-checked', String(+key === i));
            }
            const card = V.x.side.querySelector('.sel');
            card.replaceChildren();
            const name = util.el('div', 'selected-air', card);
            name.innerHTML = V.x.logo(fl.airline);
            util.el('span', '', name, fl.airline);
            const s = ctx.model.searched;
            const times = util.el('div', 'selected-times', card);
            util.el('span', '', times, flightTime(fl.dep));
            util.el('span', 'selected-code', times, s.from);
            util.el('span', 'selected-arrow', times, '→');
            util.el('span', '', times, flightTime(fl.dep + fl.dur));
            util.el('span', 'selected-code', times, s.to);
            util.el(
              'div',
              'selected-duration',
              card,
              `${fam.fmtDur(fl.dur)} · ${fl.stops ? fl.stops + ' stop' : 'Nonstop'}`,
            );
            util.el('strong', 'selected-price', card, fmt(fl.price));
            V.x.sideBook.disabled = !!ctx.model.booked || ctx.model.loading > 0;
          };
          V.x.sideBook.addEventListener('click', () => {
            if (V.x.selected !== null && !ctx.model.booked && !(ctx.model.loading > 0))
              step({ click: { book: V.x.selected } });
          });
        },
        resultsSummary: () => (V, s) => {
          const { fam } = V;
          V.route.textContent = `${fam.airport(s.from).city} (${s.from}) → ${fam.airport(s.to).city} (${s.to})`;
          V.sdate.textContent = `${fam.fmtDate(s.date, 'long')} · 1 adult · Economy`;
        },
        flightPitch: (base, S) => (V) => {
          const { ctx, spec, rng, body, pane, gap } = V;
          V.pitch = S.H.pitchFor(pane, body, spec.rows, gap, 36, rng.int(84, 100), 0);
          pane.style.height = spec.rows * V.pitch - gap + 2 + 'px';
          S.H.mirrorPitch(ctx, V.pitch);
        },
        flightRow: (base, S) => (V, i, fl, flights, s) => {
          const { ctx, util, fam, fmt, step, bookEls, rowEls } = V;
          const { btn } = S.H;
          const r = util.el('div', 'fl-frow');
          r.dataset.role = 'flight';
          r.addEventListener('click', () => {
            if (!ctx.model.booked && !(ctx.model.loading > 0)) V.x.selectFlight(i);
          });
          const choice = btn(util, 'fl-choice', r, '', 'select-flight');
          choice.setAttribute('role', 'radio');
          choice.setAttribute('aria-label', 'Select ' + fl.airline + ' ' + flightTime(fl.dep));
          choice.setAttribute('aria-checked', 'false');
          V.x.choiceEls[i] = choice;
          const air = util.el('div', 'fl-air', r);
          const mark = util.el('div', 'fl-air-mark', air);
          mark.innerHTML = V.x.logo(fl.airline);
          util.el('b', '', air, fl.airline);
          util.el('span', '', air, fl.no);
          const times = util.el('div', 'fl-times', r);
          util.el('span', 'fl-t', times, flightTime(fl.dep));
          const line = util.el('div', 'fl-line', times);
          util.el('span', '', line, fam.fmtDur(fl.dur));
          util.el('i', '', line);
          util.el('span', '', line, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
          const arr = util.el('span', 'fl-t', times, flightTime(fl.dep + fl.dur));
          if (fl.dep + fl.dur >= 1440) util.el('sup', '', arr, '+1');
          const depart = util.el('div', 'fl-depart', r);
          depart.append(times.querySelector('.fl-t'));
          util.el('small', '', depart, s.from);
          const arrive = util.el('div', 'fl-arrive', r);
          arrive.append(arr);
          util.el('small', '', arrive, s.to);
          const duration = util.el('div', 'fl-duration', r);
          util.el('span', '', duration, fam.fmtDur(fl.dur));
          util.el('small', '', duration, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
          const fare = util.el('div', 'fl-fare', r);
          fare.append(['Economy Light', 'Economy', 'Economy Flex', 'Basic'][(fl.price / 100 + fl.dep) % 4]);
          util.el('br', '', fare);
          if (((fl.price / 100) * 7 + fl.dur) % 3 === 0)
            util.el('b', '', fare, `${1 + ((fl.price / 100 + fl.dur) % 5)} seats left`);
          else fare.append('Carry-on included');
          const b = btn(util, 'fl-fp fl-book', r, fmt(fl.price), 'book');
          b.title = 'Book this flight for ' + fmt(fl.price);
          b.setAttribute('aria-label', 'Book ' + fl.airline + ' for ' + fmt(fl.price));
          b.addEventListener('click', () => {
            if (!ctx.model.booked && !(ctx.model.loading > 0)) step({ click: { book: i } });
          });
          V.bookEls[i] = b;
          V.rowEls[i] = r;
          return r;
        },
        flightResults: (base, S) => (V, m) => {
          const { ctx, spec, fam, pane, gap, bookEls, rowEls } = V;
          const s = m.searched;
          const flights = fam.flightsFor(spec, s);
          V.x.currentFlights = flights;
          S.P.resultsSummary(V, s);
          if (!V.pitch) S.P.flightPitch(V);
          for (const k of Object.keys(bookEls)) delete bookEls[k];
          for (const k of Object.keys(rowEls)) delete rowEls[k];
          for (const k of Object.keys(V.x.choiceEls)) delete V.x.choiceEls[k];
          V.lbx = S.H.listPane(ctx, pane, {
            keys: fam.flightOrder(spec, s, m.sort),
            rows: spec.rows,
            pitch: V.pitch,
            gap,
            scroll: m.scroll,
            label: 'flights',
            build(i) {
              return S.P.flightRow(V, i, flights[i], flights, s);
            },
          });
          V.x.selectFlight(m.booked ? m.booked.index : 0);
        },
        flightPaint: (base, S) => (V, m) => {
          const { ctx, util, spec, fam, fmt, fields, dval, dctl, derr, calPop, grid } = V;
          V.form.hidden = false;
          V.res.hidden = m.screen !== 'results';
          V.x.empty.hidden = m.screen === 'results';
          for (const f of ['from', 'to']) {
            const fd = V.fields[f];
            if (fd.input.value !== m[f + 'Text']) fd.ac.set({ text: m[f + 'Text'] });
            fd.ac.set({ open: m.ac === f }); // a reverted model (pageFaults=revert) can reopen the list
            const bad = m.invalid.includes(f);
            fd.ctl.classList.toggle('bad', bad);
            fd.err.hidden = !bad;
            fd.caption.textContent = m[f] ? fam.airport(m[f]).label : '\u00a0';
            fd.input.disabled = !!m.booked;
          }
          V.go.disabled = !!m.booked;
          V.dval.textContent = m.date ? fam.fmtDate(m.date, 'us') : 'MM/DD/YYYY';
          V.dval.classList.toggle('empty', !m.date);
          V.dctl.classList.toggle('bad', m.invalid.includes('date'));
          V.dctl.classList.toggle('open', m.calOpen);
          V.derr.hidden = !m.invalid.includes('date');
          const shown = m.screen === 'results' && m.searched ? m.searched : m;
          const tripRoute = V.x.side.querySelector('.trip-route');
          tripRoute.replaceChildren();
          util.el('span', '', tripRoute, shown.from || '—');
          util.el('span', 'trip-arrow', tripRoute, '→');
          util.el('span', '', tripRoute, shown.to ? fam.airport(shown.to).city : '—');
          const tripDate =
            shown.date &&
            fam
              .fmtDate(shown.date, 'long')
              .replace(/^(\w+), (\w+) /, (_, day, month) => `${day.slice(0, 3)}, ${month.slice(0, 3)} `);
          V.x.side.querySelector('.trip-date').textContent = shown.date ? `${tripDate} · One-way` : 'One-way';
          V.calPop.hidden = !m.calOpen;
          if (m.calOpen && V.calBuilt !== m.calView) S.P.flightCal(V, m);
          if (m.calOpen)
            for (const d of V.grid.children)
              d.classList.toggle('sel', d.dataset.iso === m.date && !d.classList.contains('blank'));
          if (m.screen === 'results' && m.searched) {
            const key = JSON.stringify([m.searched, m.sort]);
            if (key !== V.builtKey) {
              V.builtKey = key;
              S.P.flightResults(V, m);
            }
            const loading = m.loading > 0;
            V.x.sortUI.set({ value: m.sort });
            V.x.sortValue.textContent = (V.x.sortOptions.find(([key]) => key === m.sort) || V.x.sortOptions[0])[1];
            for (const [key, option] of Object.entries(V.x.sortEls)) option.classList.toggle('sel', key === m.sort);
            const n = fam.flightsFor(spec, m.searched).length;
            V.count.textContent = loading
              ? 'Searching airlines for the best fares…'
              : `${n} flights found · prices per person, taxes included`;
            V.cover.hidden = !loading;
            if (loading)
              Object.assign(V.cover.style, {
                left: V.pane.offsetLeft + 'px',
                top: V.pane.offsetTop + 'px',
                width: V.pane.offsetWidth + 'px',
                height: V.pane.offsetHeight + 'px',
              });
            for (const [i, b] of Object.entries(V.bookEls)) {
              const mine = !!m.booked && m.booked.index === +i;
              b.disabled = !!m.booked;
              b.textContent = fmt(V.x.currentFlights[+i].price);
              b.classList.toggle('mine', mine);
              V.rowEls[i].classList.toggle('booked', mine);
              V.x.choiceEls[i].disabled = !!m.booked || loading;
            }
            V.x.selectFlight(m.booked ? m.booked.index : V.x.selected === null ? 0 : V.x.selected);
            V.back.disabled = !!m.booked;
            V.cancelBook.hidden = !m.booked;
            V.x.sideBook.disabled = !!m.booked || loading;
            V.x.sideBook.textContent = m.booked ? 'Booked' : 'Book';
          } else {
            V.cover.hidden = true;
            V.x.sideBook.disabled = true;
            V.x.sideBook.textContent = 'Book';
            V.x.side.querySelector('.sel').textContent = 'Choose a flight from the list.';
          }
        },
        flightLocate: (base) => (V, t) => {
          if (t.sort) return V.x.sortUI.locateTrigger();
          if (t.sortBy) return V.x.sortUI.locateOption(t.sortBy);
          return base(V, t);
        },
      },
    },
  });
})();
