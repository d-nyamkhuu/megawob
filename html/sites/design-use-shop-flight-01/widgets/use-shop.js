// Amiga Workbench flight booking design, preserving its original comparison table and flight rows.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-flight-01',
  name: 'design',
  split: 'train',
  scenarios: ['flight'],
  template: 'use-shop/adapted',
  design: {
    brand: 'SkyWays Travel – Book a Flight',
    css: '\n.design-header{background:#c4c4c4;border:2px outset #eee}.design-brand{font-family:monospace;font-size:18px}.task-note{font:700 20px/1.5 monospace;background:#b9b9b9;border:3px outset #ddd}.end-control,.as-btn{background:#c4c4c4;color:#000;border:2px outset #eee;border-radius:0}.as-app{border:3px outset #ddd}.fl-search,.fl-box{border-radius:0}.as-track{background:repeating-linear-gradient(45deg,#aaa 0 1px,#ddd 1px 2px)}',
    parts: {
      buildFlight: (base, S) => (ctx, body) => {
        const { F, whole, btn, pitchFor, mirrorPitch, listPane, where } = S.H;
        const ICON = S.H.ICON;
    const { util, spec, rng } = ctx;
    const fam = F();
    const fmt = whole(spec);
    const commit = (m) => { ctx.update(m); paint(ctx.model); };
    const step = (s) => commit(fam.apply(ctx.model, spec, s));
    const set = (patch) => commit({ ...ctx.model, ...patch });

    // ---- form screen
    const form = util.el('div', 'fl-form', body);
    util.el('div', 'fl-h', form, 'Find Flights');
    util.el('div', 'fl-hs', form, rng.pick(['Search hundreds of airlines and pick the fare that suits you.', 'Low fares, no hidden fees.', 'Compare flights and book in minutes.']));
    const card = util.el('div', 'fl-card', form);
    const pills = util.el('div', 'fl-pills', card);
    util.el('span', 'fl-pill on', pills, 'One-way');
    util.el('span', 'fl-pill', pills, '1 adult');
    util.el('span', 'fl-pill', pills, 'Economy');
    const row = util.el('div', 'fl-row', card);
    const fields = {};
    for (const f of ['from', 'to']) {
      const fld = util.el('div', 'fl-field', row);
      util.el('label', 'fl-lab', fld, f === 'from' ? 'From' : 'To');
      const ctl = util.el('div', 'fl-ctl', fld);
      ctl.innerHTML = f === 'from' ? ICON.plane : ICON.pin;
      const input = util.el('input', 'fl-input', ctl);
      Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: f === 'from' ? 'Airport' : 'Where to?' });
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
    }
    const dfld = util.el('div', 'fl-field date', row);
    util.el('label', 'fl-lab', dfld, 'Date');
    const dctl = util.el('div', 'fl-ctl fl-dctl', dfld);
    dctl.dataset.role = 'date-field';
    dctl.innerHTML = '<svg viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="2" shape-rendering="crispEdges" aria-hidden="true"><path d="M2 5H22V26H2ZM2 10H22M7 1V8M17 1V8"/><path d="M6 13H8V15H6ZM11 13H13V15H11ZM16 13H18V15H16ZM6 18H8V20H6ZM11 18H13V20H11ZM16 18H18V20H16" stroke-width="1"/></svg>';
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
    const trip = util.el('div', 'fl-field trip', row);
    util.el('label', 'fl-lab', trip, 'Trip Type');
    const tripControl = util.el('details', 'fl-trip', trip);
    util.el('summary', 'fl-ctl', tripControl, 'One-way');
    const oneWay = btn(util, 'fl-trip-option', tripControl, 'One-way');
    oneWay.addEventListener('click', () => { tripControl.open = false; });
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
    const sum = util.el('div', 'fl-sum fl-result-form', res);
    const resultFields = {};
    for (const [key, label] of [['from', 'From'], ['to', 'To'], ['date', 'Date'], ['trip', 'Trip Type']]) {
      const field = util.el('div', 'fl-field' + (key === 'date' ? ' date' : ''), sum);
      util.el('span', 'fl-lab', field, label);
      const control = btn(util, 'fl-ctl fl-result-control', field, '');
      const value = util.el('span', 'fl-result-value', control);
      if (key === 'date') control.insertAdjacentHTML('beforeend', dctl.firstElementChild.outerHTML);
      control.addEventListener('click', () => back.click());
      resultFields[key] = { control, value };
    }
    const resultActions = util.el('div', 'fl-result-actions', sum);
    const back = btn(util, 'as-btn fl-back', resultActions, undefined, 'back');
    back.innerHTML = `${ICON.left}<span>Modify search</span>`;
    back.addEventListener('click', () => step({ click: { back: true } }));
    const route = util.el('span', 'fl-route', sum);
    const sdate = util.el('span', 'fl-sdate', sum);
    route.hidden = sdate.hidden = true;
    const cancelBook = btn(util, 'as-btn sm fl-cancel', resultActions, 'Cancel booking', 'cancel-booking');
    cancelBook.addEventListener('click', () => { if (ctx.model.booked) step({ click: { cancelBook: true } }); });
    const count = util.el('div', 'fl-count', res, '\u00a0');
    const columns = (parent) => {
      const h = util.el('div', 'fl-columns', parent);
      for (const label of ['Airline', 'Departure', 'Arrival', 'Duration', 'Price']) util.el('span', '', h, label);
    };
    columns(res);
    const pane = util.el('div', 'as-pane', res);
    const ffoot = util.el('div', 'as-foot', res);
    ffoot.innerHTML = '<span>Fares include taxes and carrier fees. Baggage allowance varies by airline. <b>Free cancellation</b> within 24 hours.</span>';
    const cover = util.el('div', 'fl-cover', res);
    cover.dataset.role = 'loading';
    for (let i = 0; i < 4; i++) util.el('div', 'as-skel', cover).style.width = `${92 - i * 13}%`;
    let lbx = null;
    let builtKey = null;
    let pitch = 0;
    const gap = 1;
    const bookEls = {};
    const rowEls = {};
    // Selection is a view preference only. Booking still uses the original task action,
    // and the original per-row buttons remain available to the oracle.
    const footer = body.closest('.win').querySelector('.design-footer');
    const bookFlight = footer.querySelector('.book-flight');
    let selectedIndex = null;
    const emptyComparison = util.el('div', 'fl-empty-comparison', form);
    columns(emptyComparison);
    util.el('div', 'fl-empty-surface', emptyComparison);
    const airlineMarks = [
      '<path d="M3 35L29 26 39 6 48 4 42 23 62 17 66 22 39 37 16 54 24 39 5 39Z" fill="#0035ce"/>',
      '<path d="M6 48L34 6H52L24 48Z" fill="#d00008"/><path d="M30 48L57 6H70L44 48Z" fill="#0035a8"/>',
      '<g stroke="#ffb400" stroke-width="4"><path d="M35 3v11M13 9l7 9M3 28h12M55 9l-7 9M56 28h13"/></g><circle cx="35" cy="29" r="16" fill="#ffb400"/><path d="M4 56L35 31 67 56Z" fill="#0035ce"/>',
      '<path d="M35 1L17 20H24L9 36H22L5 49H28V61H41V49H65L47 36H59L44 20H51Z" fill="#008338"/>',
      '<path d="M3 12L31 23 42 13 71 6 56 34 41 40 23 56H12L26 36 14 30Z" fill="#0035ce"/>'
    ];
    function paintSelection(m) {
      const flights = m.searched ? fam.flightsFor(spec, m.searched) : [];
      const index = m.booked ? m.booked.index : selectedIndex;
      const f = m.screen === 'results' ? flights[index] : null;
      const facts = f ? {airline: f.airline, departure: fam.fmtTime(f.dep), arrival: fam.fmtTime(f.dep + f.dur), duration: fam.fmtDur(f.dur), price: fmt(f.price)} : {};
      for (const v of footer.querySelectorAll('[data-fact]')) v.textContent = facts[v.dataset.fact] || '—';
      bookFlight.disabled = !f || !!m.booked || m.loading > 0;
      bookFlight.textContent = m.booked ? 'Booked' : 'Book Flight';
      for (const [i, r] of Object.entries(rowEls)) {
        const radio = r.querySelector('.fl-select');
        if (radio) radio.setAttribute('aria-checked', String(!!f && +i === index));
      }
    }
    bookFlight.onclick = () => {
      if (selectedIndex !== null && bookEls[selectedIndex]) bookEls[selectedIndex].click();
    };

    function buildResults(m) {
      const s = m.searched;
      const flights = fam.flightsFor(spec, s);
      route.textContent = `${fam.airport(s.from).city} (${s.from}) → ${fam.airport(s.to).city} (${s.to})`;
      sdate.textContent = `${fam.fmtDate(s.date, 'long')} · 1 adult · Economy`;
      const values = { from: s.from, to: `${fam.airport(s.to).city} (${s.to})`, date: fam.fmtDate(s.date, 'long'), trip: 'One-way' };
      for (const [key, field] of Object.entries(resultFields)) field.value.textContent = values[key];
      if (!pitch) {
        pitch = pitchFor(pane, body, spec.rows, gap, 36, rng.int(84, 100), 48);
        pane.style.height = spec.rows * pitch - gap + 2 + 'px';
        mirrorPitch(ctx, pitch);
      }
      for (const k of Object.keys(bookEls)) delete bookEls[k];
      for (const k of Object.keys(rowEls)) delete rowEls[k];
      selectedIndex = null;
      lbx = listPane(ctx, pane, {
        keys: flights.map((f, i) => i),
        rows: spec.rows,
        pitch,
        gap,
        scroll: m.scroll,
        label: 'flights',
        build(i) {
          const fl = flights[i];
          const r = util.el('div', 'fl-frow');
          r.dataset.role = 'flight';
          const airlineCell = util.el('div', 'fl-airline-cell', r);
          const select = btn(util, 'fl-select', airlineCell, '', 'select-flight');
          select.setAttribute('role', 'radio');
          select.setAttribute('aria-label', 'Select ' + fl.airline + ' ' + fl.no);
          select.setAttribute('aria-checked', 'false');
          select.addEventListener('click', () => { selectedIndex = i; paintSelection(ctx.model); });
          const mark = util.el('span', 'fl-air-mark', airlineCell);
          mark.innerHTML = '<svg viewBox="0 0 74 64">' + airlineMarks[i % airlineMarks.length] + '</svg>';
          const air = util.el('div', 'fl-air', airlineCell);
          util.el('b', '', air, fl.airline);
          util.el('span', '', air, fl.no);
          const times = util.el('div', 'fl-times', r);
          const departure = util.el('span', 'fl-t fl-departure', times, fam.fmtTime(fl.dep));
          util.el('small', '', departure, s.from);
          const line = util.el('div', 'fl-line', times);
          util.el('span', '', line, fam.fmtDur(fl.dur));
          util.el('i', '', line);
          util.el('span', '', line, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
          const arr = util.el('span', 'fl-t fl-arrival', times, fam.fmtTime(fl.dep + fl.dur));
          if (fl.dep + fl.dur >= 1440) util.el('sup', '', arr, '+1');
          util.el('small', '', arr, s.to);
          const fare = util.el('div', 'fl-fare', r);
          fare.append(['Economy Light', 'Economy', 'Economy Flex', 'Basic'][(fl.price / 100 + fl.dep) % 4]);
          util.el('br', '', fare);
          if ((fl.price / 100 * 7 + fl.dur) % 3 === 0) util.el('b', '', fare, `${1 + ((fl.price / 100 + fl.dur) % 5)} seats left`);
          else fare.append('Carry-on included');
          util.el('div', 'fl-fp', r, fmt(fl.price));
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
      form.hidden = m.screen !== 'form';
      res.hidden = m.screen !== 'results';
      for (const f of ['from', 'to']) {
        const fd = fields[f];
        if (fd.input.value !== m[f + 'Text']) fd.ac.set({ text: m[f + 'Text'] });
        fd.ac.set({ open: m.ac === f }); // a reverted model (pageFaults=revert) can reopen the list
        const bad = m.invalid.includes(f);
        fd.ctl.classList.toggle('bad', bad);
        fd.err.hidden = !bad;
      }
      dval.textContent = m.date ? fam.fmtDate(m.date, 'long') : 'MM/DD/YYYY';
      dval.classList.toggle('empty', !m.date);
      dctl.classList.toggle('bad', m.invalid.includes('date'));
      dctl.classList.toggle('open', m.calOpen);
      derr.hidden = !m.invalid.includes('date');
      calPop.hidden = !m.calOpen;
      if (m.calOpen && calBuilt !== m.calView) buildCal(m);
      if (m.calOpen) for (const d of grid.children) d.classList.toggle('sel', d.dataset.iso === m.date && !d.classList.contains('blank'));
      if (m.screen === 'results' && m.searched) {
        const key = JSON.stringify(m.searched);
        if (key !== builtKey) {
          builtKey = key;
          buildResults(m);
        }
        const loading = m.loading > 0;
        const n = fam.flightsFor(spec, m.searched).length;
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
        for (const field of Object.values(resultFields)) field.control.disabled = !!m.booked;
        cancelBook.hidden = !m.booked;
      } else cover.hidden = true;
      paintSelection(m);
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
        if (t.thumb) return lbx.locateThumb();
        if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
        if (t.pane) return where(lbx.list, 'flight list');
        if (t.book !== undefined) return where(bookEls[t.book], `Book ${t.book}`);
        return null;
      },
    };      },

    },
  },
});
