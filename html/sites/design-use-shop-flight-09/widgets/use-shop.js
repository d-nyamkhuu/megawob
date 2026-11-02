// Retains the original inline flight builder; its layout depends on the site's bespoke workbench geometry.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-flight-09',
  name: 'design',
  split: 'train',
  scenarios: ['flight'],
  traits: { sort: true },
  template: 'use-shop/store',
  design: {
    fieldLabels: { from: 'From', to: 'To', date: 'Depart Date' },
    searchLabel: 'Search Flights',
    dateIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="4.5" width="18" height="17" rx="1"/><path d="M3 9h18M7.5 2v5M16.5 2v5" stroke-width="2.6"/><path d="M6 12h3m3 0h3m3 0h1M6 16h3m3 0h3m3 0h1M6 19h3m3 0h3" stroke-width="2"/></svg>',
    dateFormat: 'us',
    parts: {
      buildFlight: (base, S) => (ctx, body) => {
        const { F, whole, btn, where, pitchFor, mirrorPitch, listPane, ICON } = S.H;
    const { util, spec, rng } = ctx;
    const fam = F();
    const fmt = whole(spec);
    const commit = (m) => { ctx.update(m); paint(ctx.model); };
    const step = (s) => commit(fam.apply(ctx.model, spec, s));
    const set = (patch) => commit({ ...ctx.model, ...patch });

    // ---- form screen
    const form = util.el('div', 'fl-form', body);
    util.el('div', 'fl-h', form, rng.pick(['Where to next?', 'Find your flight', 'Book a flight']));
    util.el('div', 'fl-hs', form, rng.pick(['Search hundreds of airlines and pick the fare that suits you.', 'Low fares, no hidden fees.', 'Compare flights and book in minutes.']));
    const card = util.el('div', 'fl-card', form);
    const pills = util.el('div', 'fl-pills', card);
    util.el('span', 'fl-pill on', pills, 'One-way');
    util.el('span', 'fl-pill', pills, 'Round-trip');
    util.el('span', 'fl-pill', pills, 'Multi-city');
    const row = util.el('div', 'fl-row', card);
    const fields = {};
    for (const f of ['from', 'to']) {
      const fld = util.el('div', 'fl-field', row);
      util.el('label', 'fl-lab', fld, f === 'from' ? 'From' : 'To');
      const ctl = util.el('div', 'fl-ctl', fld);
      ctl.innerHTML = f === 'from' ? ICON.plane : ICON.pin;
      const input = util.el('input', 'fl-input', ctl);
      Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: f === 'from' ? 'City or airport' : 'Where to?' });
      input.dataset.role = `${f}-field`;
      const pop = util.el('div', 'fl-pop', fld);
      pop.dataset.role = 'suggestions';
      const err = util.el('div', 'fl-err', fld, 'Pick an airport from the list');
      const ac = env.ui.autocomplete(input, pop, {
        label: f,
        keyboard: true,
        fill: false,
        inside: [fld],
        text: ctx.model[f + 'Text'],
        filter: (text) => fam.suggest(text),
        render(items, text, active, api) {
          pop.replaceChildren();
          const t = text.trim().toLowerCase();
          for (const code of items) {
            const a = fam.airport(code);
            const r = util.el('div', 'fl-sug', pop);
            r.dataset.role = 'suggestion';
            r.innerHTML = ICON.plane;
            const lab = util.el('span', '', r);
            const k = t ? a.label.toLowerCase().indexOf(t) : -1;
            if (k >= 0) {
              lab.append(a.label.slice(0, k));
              util.el('b', '', lab, a.label.slice(k, k + t.length));
              lab.append(a.label.slice(k + t.length));
            } else lab.textContent = a.label;
            api.suggestion(code, r);
          }
        },
        onInput(text, items) {
          set({ [f + 'Text']: text, [f]: fam.exactAirport(text), ac: items.length ? f : null, calOpen: false });
        },
        onChange(code) {
          input.value = fam.airport(code).label;
          step({ click: { suggestion: code, field: f } });
        },
        onOpenChange(open) {
          if (open && ctx.model.ac !== f) set({ ac: f });
          else if (!open && ctx.model.ac === f) set({ ac: null });
        },
      });
      fields[f] = { ctl, input, err, ac };
      if (f === 'from') util.el('span', 'fl-swap', row, '⇄');
    }
    const dfld = util.el('div', 'fl-field date', row);
    util.el('label', 'fl-lab', dfld, 'Depart Date');
    const dctl = util.el('div', 'fl-ctl fl-dctl', dfld);
    dctl.dataset.role = 'date-field';
    dctl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="4.5" width="18" height="17" rx="1"/><path d="M3 9h18M7.5 2v5M16.5 2v5" stroke-width="2.6"/><path d="M6 12h3m3 0h3m3 0h1M6 16h3m3 0h3m3 0h1M6 19h3m3 0h3" stroke-width="2"/></svg>';
    const dval = util.el('span', 'fl-dval', dctl);
    const derr = util.el('div', 'fl-err', dfld, 'Select a date');
    const calPop = util.el('div', 'fl-cal', dfld);
    calPop.dataset.role = 'calendar';
    const calH = util.el('div', 'fl-calh', calPop);
    const prevEl = util.el('div', 'fl-nav', calH);
    prevEl.innerHTML = ICON.left;
    const calT = util.el('span', '', calH);
    const nextEl = util.el('div', 'fl-nav', calH);
    nextEl.innerHTML = ICON.right;
    const wk = util.el('div', 'fl-wk', calPop);
    const weekStart = rng.pick([0, 1]);
    for (let i = 0; i < 7; i++) util.el('span', '', wk, ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][(weekStart + i) % 7]);
    const grid = util.el('div', 'fl-grid', calPop);
    if (body.getBoundingClientRect().height < 540) calPop.classList.add('compact');
    const cal = env.ui.calendar({
      label: 'depart',
      weekStart,
      math: { days: fam.days, fromDays: fam.fromDays, weekday: fam.weekday },
      onDay(iso, { inMonth }) { if (inMonth) step({ click: { day: iso } }); },
      onNav(dir) { step({ click: { nav: dir } }); },
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
      if (ctx.model.calOpen && !dfld.contains(e.target)) set({ calOpen: false });
    };
    document.addEventListener('pointerdown', outside, true);
    const passengers = util.el('div', 'fl-field fl-passengers', row);
    util.el('label', 'fl-lab', passengers, 'Passengers');
    util.el('div', 'fl-ctl fl-passenger-value', passengers, '1 Adult');
    const go = btn(util, 'as-btn primary fl-go', row, 'Search Flights', 'search-button');
    go.addEventListener('click', () => step({ click: { button: 'search' } }));

    const deals = util.el('div', 'fl-deals', form);
    const hues = [['#4dabf7', '#1864ab'], ['#ffa94d', '#d9480f'], ['#69db7c', '#2b8a3e'], ['#b197fc', '#5f3dc4']];
    for (const a of rng.sample(fam.AIRPORTS, body.getBoundingClientRect().width > 1100 ? 4 : 3)) {
      const d = util.el('div', 'fl-deal', deals);
      const i = util.el('i', '', d);
      const h = rng.pick(hues);
      i.style.setProperty('--c1', h[0]);
      i.style.setProperty('--c2', h[1]);
      util.el('b', '', d, `${a.city}, ${a.st}`);
      util.el('span', '', d, `from $${rng.int(59, 399)}`);
    }

    // ---- results screen
    const res = util.el('div', 'fl-res', body);
    const sum = util.el('div', 'fl-sum', res);
    const back = btn(util, 'as-btn fl-back', sum, undefined, 'back');
    back.innerHTML = `${ICON.left}<span>Modify search</span>`;
    back.addEventListener('click', () => step({ click: { back: true } }));
    const route = util.el('span', 'fl-route', sum);
    const sdate = util.el('span', 'fl-sdate', sum);
    const cancelBook = btn(util, 'as-btn sm fl-cancel', sum, 'Cancel booking', 'cancel-booking');
    cancelBook.addEventListener('click', () => { if (ctx.model.booked) step({ click: { cancelBook: true } }); });
    // Keep recovery controls in the form's utility row so result columns stay fixed.
    const searchActions = util.el('div', 'fl-search-actions', pills);
    searchActions.append(back, cancelBook);
    const sorting = util.el('div', 'fl-sorting', sum);
    util.el('span', '', sorting, 'Sort by');
    const sortTrig = util.el('div', 'fl-sort-label', sorting);
    sortTrig.dataset.role = 'sort';
    const sortVal = util.el('span', '', sortTrig);
    sortTrig.insertAdjacentHTML('beforeend', ICON.chev);
    const sortPop = util.el('div', 'fl-sort-pop', sorting);
    sortPop.dataset.role = 'sort-options';
    const sortEls = {};
    for (const [k, label] of (fam.FLIGHT_SORTS || [['recommended', 'Recommended']])) {
      const opt = util.el('div', 'fl-sort-opt', sortPop, label);
      opt.dataset.role = 'option';
      sortEls[k] = opt;
    }
    const sortDd = env.ui.dropdown(sortTrig, sortPop, {
      label: 'sort', value: ctx.model.sort,
      options: (fam.FLIGHT_SORTS || [['recommended', 'Recommended']]).map(([k]) => [k, sortEls[k]]),
      onChange(v) { if (v !== ctx.model.sort) step({ click: { sortBy: v } }); },
    });
    const initialSort = (fam.FLIGHT_SORTS || []).find(([k]) => k === ctx.model.sort);
    sortVal.textContent = initialSort ? initialSort[1] : 'Recommended';
    const count = util.el('div', 'fl-count', res, '\u00a0');
    const heads = util.el('div', 'fl-heads', res);
    for (const h of ['Airline', 'Depart', 'Arrive', 'Duration', 'Price (USD)', '']) util.el('span', '', heads, h);
    const pane = util.el('div', 'as-pane', res);
    const empty = util.el('div', 'fl-empty', res, 'Search for flights to compare fares.');
    const ffoot = util.el('div', 'as-foot', res);
    ffoot.innerHTML = '<span>Fares include taxes and carrier fees. Baggage allowance varies by airline. <b>Free cancellation</b> within 24 hours.</span>';
    const cover = util.el('div', 'fl-cover', res);
    cover.dataset.role = 'loading';
    for (let i = 0; i < 4; i++) util.el('div', 'as-skel', cover).style.width = `${92 - i * 13}%`;
    let lbx = null;
    let builtKey = null;
    let builtSort = null;
    let pitch = 0;
    const gap = 1;
    const bookEls = {};
    const rowEls = {};

    function buildResults(m) {
      const s = m.searched;
      const flights = fam.flightsFor(spec, s);
      route.textContent = `${s.from} → ${s.to}`;
      sdate.textContent = fam.fmtDate(s.date, 'long');
      if (!pitch) {
        pitch = pitchFor(pane, body, spec.rows, gap, 36, rng.int(84, 100), 48);
        pane.style.height = spec.rows * pitch - gap + 2 + 'px';
        mirrorPitch(ctx, pitch);
      }
      for (const k of Object.keys(bookEls)) delete bookEls[k];
      lbx = listPane(ctx, pane, {
        keys: spec.sortable ? fam.flightOrder(spec, s, m.sort) : flights.map((f, i) => i),
        rows: spec.rows,
        pitch,
        gap,
        scroll: m.scroll,
        label: 'flights',
        build(i) {
          const fl = flights[i];
          const r = util.el('div', 'fl-frow');
          r.dataset.role = 'flight';
          const air = util.el('div', 'fl-air', r);
          const lg = util.el('i', 'fl-logo', air, fl.airline.charAt(0));
          let hh = 0;
          for (const ch of fl.airline) hh = (hh * 31 + ch.charCodeAt(0)) % 360;
          lg.style.background = `hsl(${hh},62%,42%)`;
          const marks = {
            Frontier: '<path fill="#00734f" d="M12 4h31l-4 10H9zm-4 13h29l-4 10H5zm-4 13h19l-4 10H1z"/>',
            Delta: '<path fill="#d6002a" d="M24 2L2 40l22-13 22 13z"/><path fill="#fff" d="M24 25L2 40l22-9 22 9z"/><path fill="#920021" d="M24 2v23l22 15z"/>',
            United: '<rect fill="#00359b" x="3" y="2" width="41" height="41"/><g fill="none" stroke="white" stroke-width="1.2"><path d="M3 6c28 0 37 12 37 37M3 12c22 0 31 11 31 31M3 18c16 0 25 10 25 25M3 24c10 0 19 9 19 19M3 30c6 0 13 7 13 13M5 2c27 14 28 29 13 41M13 2c25 17 20 32 11 41M23 2c17 17 16 28 7 41M3 8l34 34M3 18l24 24M3 28l14 14"/></g>',
            American: '<path fill="#009bdb" d="M1 2h13l17 21H17z"/><path fill="#aab8c5" d="M16 21h14l6 8H22z"/><path fill="#e51a2b" d="M21 29h14l13 16H34z"/>'
          };
          const mark = Object.keys(marks).find(k => fl.airline.includes(k));
          lg.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true">' + (mark ? marks[mark] : '<path fill="currentColor" d="M4 40L24 3l20 37-20-10z"/><path fill="#fff" d="M24 9v19l15 8z"/>') + '</svg>';
          lg.style.color = `hsl(${hh},62%,42%)`;
          lg.style.background = 'transparent';
          util.el('b', '', air, fl.airline);
          const dep = util.el('div', 'fl-cell fl-t', r);
          util.el('span', '', dep, fam.fmtTime(fl.dep));
          util.el('em', '', dep, s.from);
          const arr = util.el('div', 'fl-cell fl-t', r);
          const at = util.el('span', '', arr, fam.fmtTime(fl.dep + fl.dur));
          if (fl.dep + fl.dur >= 1440) util.el('sup', '', at, '+1');
          util.el('em', '', arr, s.to);
          const dur = util.el('div', 'fl-cell fl-dur', r);
          util.el('span', '', dur, fam.fmtDur(fl.dur));
          util.el('em', '', dur, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
          const price = util.el('div', 'fl-fp', r, fmt(fl.price));
          price.classList.toggle('cheapest', fl.price === Math.min(...flights.map(f => f.price)));
          const b = btn(util, 'as-btn primary fl-book', r, 'Book', 'book');
          b.addEventListener('click', () => { if (!ctx.model.booked && !(ctx.model.loading > 0)) step({ click: { book: i } }); });
          bookEls[i] = b;
          rowEls[i] = r;
          return r;
        },
      });
    }

    let calBuilt = null;
    function buildCal(m) {
      calBuilt = m.calView;
      cal.clear();
      cal.bindNav(prevEl, 'prev');
      cal.bindNav(nextEl, 'next');
      const y = +m.calView.slice(0, 4);
      const mo = +m.calView.slice(5, 7);
      calT.textContent = `${fam.MONTHS[mo - 1]} ${y}`;
      prevEl.classList.toggle('off', fam.monthDiff(spec.start, m.calView) <= 0);
      nextEl.classList.toggle('off', fam.monthDiff(m.calView, spec.maxMonth) <= 0);
      grid.replaceChildren();
      for (const week of cal.weeks(m.calView, { rows: 'auto' })) {
        for (const c of week) {
          const d = util.el('div', 'fl-day' + (c.inMonth ? '' : ' blank') + (c.iso === spec.today ? ' today' : ''), grid, String(c.day));
          d.dataset.iso = c.iso;
          if (c.inMonth) {
            d.dataset.role = 'day';
            cal.bindDay(d, c.iso);
          }
        }
      }
    }

    function paint(m) {
      form.hidden = false;
      res.hidden = false;
      const showingResults = m.screen === 'results' && !!m.searched;
      pane.hidden = !showingResults;
      empty.hidden = showingResults;
      back.hidden = !showingResults;
      cancelBook.hidden = !m.booked;
      for (const f of ['from', 'to']) fields[f].input.disabled = showingResults;
      go.disabled = showingResults;
      dctl.style.pointerEvents = showingResults ? 'none' : '';
      if (!showingResults) {
        route.textContent = 'One-way flights';
        sdate.textContent = '';
      }
      res.classList.toggle('has-results', showingResults);
      for (const f of ['from', 'to']) {
        const fd = fields[f];
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
      if (m.calOpen && calBuilt !== m.calView) buildCal(m);
      if (m.calOpen) for (const d of grid.children) d.classList.toggle('sel', d.dataset.iso === m.date && !d.classList.contains('blank'));
      const trip = showingResults ? m.searched : m;
      const kv = document.querySelector('.insp-kv');
      if (kv) {
        kv.children[1].textContent = trip.from ? fam.airport(trip.from).label : (m.fromText || '—');
        kv.children[3].textContent = trip.to ? fam.airport(trip.to).label : (m.toText || '—');
        kv.children[5].textContent = trip.date ? fam.fmtDate(trip.date, 'long') : '—';
      }
      const selected = m.booked && m.searched ? fam.flightsFor(spec, m.searched)[m.booked.index] : null;
      const summary = document.querySelector('.insp-none');
      const prices = document.querySelector('.insp-rows');
      if (summary) {
        summary.querySelector('b').textContent = selected ? selected.airline + ' · Booked' : 'No flight selected';
        summary.querySelector('span').textContent = selected ? fam.fmtTime(selected.dep) + ' → ' + fam.fmtTime(selected.dep + selected.dur) + ' · ' + fam.fmtDur(selected.dur) : 'Choose a flight from the results on the left to see details here.';
      }
      if (prices) {
        prices.children[1].textContent = selected ? fmt(selected.price) : '—';
        prices.children[3].textContent = selected ? 'Included' : '—';
        prices.children[6].textContent = selected ? fmt(selected.price) : '—';
      }
      if (m.screen === 'results' && m.searched) {
        route.textContent = `${m.searched.from} → ${m.searched.to}`;
        sdate.textContent = fam.fmtDate(m.searched.date, 'long');
        const key = JSON.stringify(m.searched);
        if (key !== builtKey || (spec.sortable && m.sort !== builtSort)) {
          builtKey = key;
          builtSort = m.sort;
          buildResults(m);
        }
        const loading = m.loading > 0;
        const n = fam.flightsFor(spec, m.searched).length;
        const activeSort = (fam.FLIGHT_SORTS || []).find(([k]) => k === m.sort);
        sortVal.textContent = activeSort ? activeSort[1] : 'Recommended';
        sorting.hidden = !spec.sortable;
        sortDd.set({ value: m.sort });
        count.textContent = loading ? 'Searching airlines for the best fares…' : `${n} flights found · prices per person, taxes included`;
        cover.hidden = !loading;
        if (loading) Object.assign(cover.style, { left: pane.offsetLeft + 'px', top: pane.offsetTop + 'px', width: pane.offsetWidth + 'px',
          height: pane.offsetHeight + 'px' });
        for (const [i, b] of Object.entries(bookEls)) {
          const mine = !!m.booked && m.booked.index === +i;
          b.disabled = !!m.booked;
          b.textContent = mine ? 'Booked' : 'Book';
          b.classList.toggle('mine', mine);
          rowEls[i].classList.toggle('booked', mine);
        }
        back.disabled = !!m.booked;
        cancelBook.hidden = !m.booked;
      } else cover.hidden = true;
    }
    paint(ctx.model);
    return {
      paint,
      locate(t) {
        if (t.suggestion !== undefined) return fields[t.field].ac.locateSuggestion(t.suggestion);
        if (t.field === 'from' || t.field === 'to') return fields[t.field].ac.locateInput();
        if (t.field === 'date') return where(dctl, 'date field');
        if (t.nav) return cal.locateNav(t.nav);
        if (t.day) return cal.locateDay(t.day);
        if (t.button) return where(go, 'Search');
        if (t.back) return where(back, 'Modify search');
        if (t.cancelBook) return where(cancelBook, 'Cancel booking');
        if (t.sort) return sortDd.locateTrigger();
        if (t.sortBy) return sortDd.locateOption(t.sortBy);
        if (t.thumb) return lbx.locateThumb();
        if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
        if (t.pane) return where(lbx.list, 'flight list');
        if (t.book !== undefined) return where(bookEls[t.book], `Book ${t.book}`);
        return null;
      },
    };

      },
    },
  },
});
