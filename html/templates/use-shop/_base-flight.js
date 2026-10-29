/* use-shop/_base-flight: reference flight units; scope reads preserve live design overrides. */
(function () {
  'use strict';
  function buildFlight(scope, ctx, body) {
    // One render owns the elements and callbacks shared by its named steps.
    const view = { scope, ctx, body };
    view.buildResults = (...args) => buildResults(view, ...args);
    view.buildCal = (...args) => buildCal(view, ...args);
    view.paint = (...args) => paint(view, ...args);
    createFlightForm(view);
    createFlightCalendarAndResults(view);
    return {
      paint: view.paint,
      locate(t) {
        if (t.suggestion !== undefined) return view.fields[t.field].ac.locateSuggestion(t.suggestion);
        if (t.field === 'from' || t.field === 'to') return view.fields[t.field].ac.locateInput();
        if (t.field === 'date') return view.scope.where(view.dctl, 'date field');
        if (t.nav) return view.cal.locateNav(t.nav);
        if (t.day) return view.cal.locateDay(t.day);
        if (t.button) return view.scope.where(view.go, 'Search');
        if (t.back) return view.scope.where(view.back, 'Modify search');
        if (t.cancelBook) return view.scope.where(view.cancelBook, 'Cancel booking');
        if (t.thumb) return view.lbx.locateThumb();
        if (t.scroll !== undefined) return view.lbx.locateThumbFor(t.scroll);
        if (t.pane) return view.scope.where(view.lbx.list, 'flight list');
        if (t.book !== undefined) return view.scope.where(view.bookEls[t.book], `Book ${t.book}`);
        if (t.sort && view.dd) return view.dd.locateTrigger();
        if (t.sortBy && view.dd) return view.dd.locateOption(t.sortBy);
        return null;
      },
    };
  }

  function buildResults(view, m) {
    const s = m.searched;
    const flights = view.fam.flightsFor(view.spec, s);
    view.route.textContent = `${view.fam.airport(s.from).city} (${s.from}) to ${view.fam.airport(s.to).city} (${s.to})`;
    view.sdate.textContent = `${view.fam.fmtDate(s.date, 'long')} · 1 adult · Economy`;
    if (!view.pitch) {
      view.pitch = view.scope.pitchFor(view.pane, view.body, view.spec.rows, view.gap, 60, view.rng.int(84, 100), 48);
      view.pane.style.height = view.spec.rows * view.pitch - view.gap + 2 + 'px';
      view.scope.mirrorPitch(view.ctx, view.pitch);
    }
    for (const k of Object.keys(view.bookEls)) delete view.bookEls[k];
    view.lbx = view.scope.listPane(view.ctx, view.pane, {
      keys: view.spec.sortable ? view.fam.flightOrder(view.spec, s, m.sort) : flights.map((f, i) => i),
      rows: view.spec.rows,
      pitch: view.pitch,
      gap: view.gap,
      scroll: m.scroll,
      label: 'flights',
      build(i) {
        const fl = flights[i];
        const r = view.util.el('div', 'fl-frow');
        r.dataset.role = 'flight';
        const air = view.util.el('div', 'fl-air', r);
        view.util.el('span', 'as-inline-icon', air).innerHTML = view.scope.ICON.plane;
        view.util.el('b', '', air, fl.airline);
        view.util.el('span', '', air, fl.no);
        const times = view.util.el('div', 'fl-times', r);
        view.util.el('span', 'fl-t', times, view.fam.fmtTime(fl.dep));
        const line = view.util.el('div', 'fl-line', times);
        view.util.el('span', '', line, view.fam.fmtDur(fl.dur));
        view.util.el('i', '', line);
        view.util.el('span', '', line, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
        const arr = view.util.el('span', 'fl-t', times, view.fam.fmtTime(fl.dep + fl.dur));
        if (fl.dep + fl.dur >= 1440) view.util.el('sup', '', arr, '+1');
        const fare = view.util.el('div', 'fl-fare', r);
        fare.append(['Economy Light', 'Economy', 'Economy Flex', 'Basic'][Math.floor(fl.price / 100 + fl.dep) % 4]);
        view.util.el('br', '', fare);
        if ((fl.price / 100 * 7 + fl.dur) % 3 === 0) view.util.el('b', '', fare, `${1 + (Math.floor(fl.price / 100 + fl.dur) % 5)} seats left`);
        else fare.append('Carry-on included');
        view.util.el('div', 'fl-fp', r, view.fmt(fl.price));
        const b = view.scope.btn(view.util, 'as-btn primary fl-book', r, 'Book', 'book');
        b.addEventListener('click', () => { if (!view.ctx.model.booked && !(view.ctx.model.loading > 0)) view.step({ click: { book: i } }); });
        view.bookEls[i] = b;
        view.rowEls[i] = r;
        return r;
      },
    });
  }

  function buildCal(view, m) {
    view.calBuilt = m.calView;
    view.cal.clear();
    view.cal.bindNav(view.prevEl, 'prev');
    view.cal.bindNav(view.nextEl, 'next');
    const y = +m.calView.slice(0, 4);
    const mo = +m.calView.slice(5, 7);
    view.calT.textContent = `${view.fam.MONTHS[mo - 1]} ${y}`;
    view.prevEl.classList.toggle('off', view.fam.monthDiff(view.spec.start, m.calView) <= 0);
    view.nextEl.classList.toggle('off', view.fam.monthDiff(m.calView, view.spec.maxMonth) <= 0);
    view.grid.replaceChildren();
    for (const week of view.cal.weeks(m.calView, { rows: 'auto' })) {
      for (const c of week) {
        const d = view.util.el('div', 'fl-day' + (c.inMonth ? '' : ' blank') + (c.iso === view.spec.today ? ' today' : ''), view.grid, String(c.day));
        d.dataset.iso = c.iso;
        if (c.inMonth) {
          d.dataset.role = 'day';
          view.cal.bindDay(d, c.iso);
        }
      }
    }
  }

  function paint(view, m) {
    view.form.hidden = m.screen !== 'form';
    view.res.hidden = m.screen !== 'results';
    for (const f of ['from', 'to']) {
      const fd = view.fields[f];
      if (fd.input.value !== m[f + 'Text']) fd.ac.set({ text: m[f + 'Text'] });
      fd.ac.set({ open: m.ac === f }); // a reverted model (pageFaults=revert) can reopen the list
      const bad = m.invalid.includes(f);
      fd.ctl.classList.toggle('bad', bad);
      fd.err.hidden = !bad;
    }
    view.dval.textContent = m.date ? view.fam.fmtDate(m.date, 'us') : 'MM/DD/YYYY';
    view.dval.classList.toggle('empty', !m.date);
    view.dctl.classList.toggle('bad', m.invalid.includes('date'));
    view.dctl.classList.toggle('open', m.calOpen);
    view.derr.hidden = !m.invalid.includes('date');
    view.calPop.hidden = !m.calOpen;
    if (m.calOpen && view.calBuilt !== m.calView) view.buildCal(m);
    if (m.calOpen) for (const d of view.grid.children) d.classList.toggle('sel', d.dataset.iso === m.date && !d.classList.contains('blank'));
    if (m.calOpen) {
      // A short frame (a long instruction header, a distractor bar) can leave the month's last week under the
      // app's clipped bottom edge: lift the popup over the field until the whole month is inside the frame.
      view.calPop.style.top = '';
      const out = view.calPop.getBoundingClientRect().bottom - (view.body.getBoundingClientRect().bottom - 6);
      if (out > 0) view.calPop.style.top = `calc(100% + 6px - ${Math.ceil(out)}px)`;
    }
    if (m.screen === 'results' && m.searched) {
      const key = JSON.stringify([m.searched, m.sort]);
      if (key !== view.builtKey) {
        view.builtKey = key;
        view.buildResults(m);
      }
      const loading = m.loading > 0;
      const n = view.fam.flightsFor(view.spec, m.searched).length;
      view.count.textContent = loading ? 'Searching airlines for the best fares…' : `${n} flights found · prices per person, taxes included`;
      view.cover.hidden = !loading;
      if (view.dd) {
        view.dd.set({ value: m.sort });
        view.sortVal.textContent = view.fam.FLIGHT_SORTS.find(([k]) => k === m.sort)[1];
        for (const [k, el] of Object.entries(view.optEls)) el.classList.toggle('sel', k === m.sort);
      }
      if (loading) Object.assign(view.cover.style, { left: view.pane.offsetLeft + 'px', top: view.pane.offsetTop + 'px', width: view.pane.offsetWidth + 'px',
        height: view.pane.offsetHeight + 'px' });
      for (const [i, b] of Object.entries(view.bookEls)) {
        const mine = !!m.booked && m.booked.index === +i;
        b.disabled = !!m.booked;
        b.textContent = mine ? 'Booked' : 'Book';
        b.classList.toggle('mine', mine);
        view.rowEls[i].classList.toggle('booked', mine);
      }
      view.back.disabled = !!m.booked;
      view.cancelBook.hidden = !m.booked;
    } else view.cover.hidden = true;
  }
  function createFlightForm(view) {
    ({ util: view.util, spec: view.spec, rng: view.rng } = view.ctx);
    view.fam = view.scope.F();
    view.fmt = view.scope.whole(view.spec);
    view.commit = (m) => { view.ctx.update(m); view.paint(view.ctx.model); };
    view.step = (s) => { view.scope.irreversible(view.ctx, s.click); view.commit(view.fam.apply(view.ctx.model, view.spec, s)); };
    view.set = (patch) => view.commit({ ...view.ctx.model, ...patch });
    view.form = view.util.el('div', 'fl-form', view.body);
    view.util.el('div', 'fl-h', view.form, view.rng.pick(['Where to next?', 'Find your flight', 'Book a flight']));
    view.util.el('div', 'fl-hs', view.form, view.rng.pick(['Search hundreds of airlines and pick the fare that suits you.', 'Low fares, no hidden fees.', 'Compare flights and book in minutes.']));
    view.card = view.util.el('div', 'fl-card', view.form);
    view.pills = view.util.el('div', 'fl-pills', view.card);
    view.util.el('span', 'fl-pill on', view.pills, 'One-way');
    view.util.el('span', 'fl-pill', view.pills, '1 adult');
    view.util.el('span', 'fl-pill', view.pills, 'Economy');
    view.row = view.util.el('div', 'fl-row', view.card);
    view.fields = {};
    for (const f of ['from', 'to']) {
      const fld = view.util.el('div', 'fl-field', view.row);
      view.util.el('label', 'fl-lab', fld, f === 'from' ? 'From' : 'To');
      const ctl = view.util.el('div', 'fl-ctl', fld);
      ctl.innerHTML = f === 'from' ? view.scope.ICON.plane : view.scope.ICON.pin;
      const input = view.util.el('input', 'fl-input', ctl);
      Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: f === 'from' ? 'City or airport' : 'Where to?' });
      input.dataset.role = `${f}-field`;
      const pop = view.util.el('div', 'fl-pop', fld);
      pop.dataset.role = 'suggestions';
      const err = view.util.el('div', 'fl-err', fld, 'Pick an airport from the list');
      const ac = view.scope.env.ui.autocomplete(input, pop, {
        label: f,
        keyboard: true,
        fill: false,
        inside: [fld],
        text: view.ctx.model[f + 'Text'],
        filter: (text) => view.fam.suggest(text),
        render(items, text, active, api) {
          pop.replaceChildren();
          const t = text.trim().toLowerCase();
          for (const code of items) {
            const a = view.fam.airport(code);
            const r = view.util.el('div', 'fl-sug', pop);
            r.dataset.role = 'suggestion';
            r.innerHTML = view.scope.ICON.plane;
            const lab = view.util.el('span', '', r);
            const k = t ? a.label.toLowerCase().indexOf(t) : -1;
            if (k >= 0) {
              lab.append(a.label.slice(0, k));
              view.util.el('b', '', lab, a.label.slice(k, k + t.length));
              lab.append(a.label.slice(k + t.length));
            } else lab.textContent = a.label;
            api.suggestion(code, r);
          }
        },
        onInput(text, items) {
          view.set({ [f + 'Text']: text, [f]: view.fam.exactAirport(text), ac: items.length ? f : null, calOpen: false });
        },
        onChange(code) {
          input.value = view.fam.airport(code).label;
          view.step({ click: { suggestion: code, field: f } });
        },
        onOpenChange(open) {
          if (open && view.ctx.model.ac !== f) view.set({ ac: f });
          else if (!open && view.ctx.model.ac === f) view.set({ ac: null });
        },
      });
      view.fields[f] = { ctl, input, err, ac };
    }
    view.dfld = view.util.el('div', 'fl-field date', view.row);
    view.util.el('label', 'fl-lab', view.dfld, 'Depart');
    view.dctl = view.util.el('div', 'fl-ctl fl-dctl', view.dfld);
    view.dctl.dataset.role = 'date-field';
    view.dctl.innerHTML = view.scope.ICON.cal;
    view.dval = view.util.el('span', 'fl-dval', view.dctl);
    view.derr = view.util.el('div', 'fl-err', view.dfld, 'Select a date');
    view.calPop = view.util.el('div', 'fl-cal', view.dfld);
    view.calPop.dataset.role = 'calendar';
    view.calH = view.util.el('div', 'fl-calh', view.calPop);
    view.prevEl = view.util.el('div', 'fl-nav', view.calH);
    view.prevEl.innerHTML = view.scope.ICON.left;
    view.calT = view.util.el('span', '', view.calH);
    view.nextEl = view.util.el('div', 'fl-nav', view.calH);
    view.nextEl.innerHTML = view.scope.ICON.right;
    view.wk = view.util.el('div', 'fl-wk', view.calPop);
    view.weekStart = view.rng.pick([0, 1]);
    for (let i = 0; i < 7; i++) view.util.el('span', '', view.wk, ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][(view.weekStart + i) % 7]);
    view.grid = view.util.el('div', 'fl-grid', view.calPop);
    if (view.body.getBoundingClientRect().height < 540) view.calPop.classList.add('compact');
  }

  function createFlightCalendarAndResults(view) {
    view.cal = view.scope.env.ui.calendar({
      label: 'depart',
      weekStart: view.weekStart,
      math: { days: view.fam.days, fromDays: view.fam.fromDays, weekday: view.fam.weekday },
      onDay(iso, { inMonth }) { if (inMonth) view.step({ click: { day: iso } }); },
      onNav(dir) { view.step({ click: { nav: dir } }); },
    });
    view.cal.bindNav(view.prevEl, 'prev');
    view.cal.bindNav(view.nextEl, 'next');
    view.dctl.addEventListener('click', () => view.step({ click: { field: 'date' } }));
    view.outside = (e) => {
      if (!view.calPop.isConnected) {
        document.removeEventListener('pointerdown', view.outside, true);
        return;
      }
      if (view.ctx.model.calOpen && !view.dfld.contains(e.target)) view.set({ calOpen: false });
    };
    document.addEventListener('pointerdown', view.outside, true);
    view.go = view.scope.btn(view.util, 'as-btn primary fl-go', view.row, 'Search', 'search-button');
    view.go.addEventListener('click', () => view.step({ click: { button: 'search' } }));
    view.deals = view.util.el('div', 'fl-deals', view.form);
    view.hues = [['#4dabf7', '#1864ab'], ['#ffa94d', '#d9480f'], ['#69db7c', '#2b8a3e'], ['#b197fc', '#5f3dc4']];
    for (const a of view.rng.sample(view.fam.AIRPORTS, view.body.getBoundingClientRect().width > 1100 ? 4 : 3)) {
      const d = view.util.el('div', 'fl-deal', view.deals);
      const i = view.util.el('i', '', d);
      const h = view.rng.pick(view.hues);
      i.innerHTML = view.scope.ICON.city;
      i.style.setProperty('--c1', h[0]);
      i.style.setProperty('--c2', h[1]);
      view.util.el('b', '', d, `${a.city}, ${a.st}`);
      view.util.el('span', '', d, `from $${view.rng.int(59, 399)}`);
    }
    view.assurances = view.util.el('div', 'as-special-note', view.form);
    view.scope.iconLabel(view.util, view.assurances, 'shield', 'Secure booking · taxes included');
    view.scope.iconLabel(view.util, view.assurances, 'clock', 'Manage bookings in My trips');
    view.res = view.util.el('div', 'fl-res', view.body);
    view.sum = view.util.el('div', 'fl-sum', view.res);
    view.back = view.scope.btn(view.util, 'as-btn fl-back', view.sum, undefined, 'back');
    view.back.innerHTML = `${view.scope.ICON.left}<span>Modify search</span>`;
    view.back.addEventListener('click', () => view.step({ click: { back: true } }));
    view.route = view.util.el('span', 'fl-route', view.sum);
    view.sdate = view.util.el('span', 'fl-sdate', view.sum);
    view.cancelBook = view.scope.btn(view.util, 'as-btn sm fl-cancel', view.sum, 'Cancel booking', 'cancel-booking');
    view.cancelBook.addEventListener('click', () => { if (view.ctx.model.booked) view.step({ click: { cancelBook: true } }); });
    view.crow = view.spec.sortable ? view.util.el('div', 'fl-crow', view.res) : view.res;
    view.count = view.util.el('div', 'fl-count', view.crow, '\u00a0');
    view.dd = null;
    view.sortVal = null;
    view.optEls = {};
    if (view.spec.sortable) {
      const sortBox = view.util.el('div', 'tk-sort', view.crow);
      view.util.el('span', '', sortBox, 'Sort by');
      const trig = view.util.el('div', 'tk-trigger', sortBox);
      trig.dataset.role = 'sort';
      view.sortVal = view.util.el('span', '', trig);
      trig.insertAdjacentHTML('beforeend', view.scope.ICON.chev);
      const pop = view.util.el('div', 'tk-pop', sortBox);
      pop.dataset.role = 'sort-options';
      for (const [k, label] of view.fam.FLIGHT_SORTS) {
        const o = view.util.el('div', 'tk-opt', pop, label);
        o.dataset.role = 'option';
        view.optEls[k] = o;
      }
      view.dd = view.scope.env.ui.dropdown(trig, pop, {
        label: 'sort',
        value: view.ctx.model.sort,
        options: view.fam.FLIGHT_SORTS.map(([k]) => [k, view.optEls[k]]),
        onChange(v) { if (v !== view.ctx.model.sort) view.step({ click: { sortBy: v } }); },
      });
    }
    view.pane = view.util.el('div', 'as-pane', view.res);
    view.ffoot = view.util.el('div', 'as-foot', view.res);
    view.ffoot.innerHTML = '<span>Fares include taxes and carrier fees. Baggage allowance varies by airline. <b>Free cancellation</b> within 24 hours.</span>';
    view.cover = view.util.el('div', 'fl-cover', view.res);
    view.cover.dataset.role = 'loading';
    for (let i = 0; i < 4; i++) view.util.el('div', 'as-skel', view.cover).style.width = `${92 - i * 13}%`;
    view.lbx = null;
    view.builtKey = null;
    view.pitch = 0;
    view.gap = 1;
    view.bookEls = {};
    view.rowEls = {};
    view.calBuilt = null;
    view.paint(view.ctx.model);
  }
  env.template('use-shop/_base-flight', () => ({ buildFlight }));
})();
