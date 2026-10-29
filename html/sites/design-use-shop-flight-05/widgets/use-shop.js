// Preserves this site's inline flight form, itinerary sidebar, filters and detailed fare rows.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-flight-05',
  name: 'design',
  split: 'train',
  scenarios: ['flight'],
  template: 'use-shop/store',
  design: {
    dateFormat: 'us',
    parts: {
        buildFlight: (base, S) => (ctx, body) => {
          const { F, ICON, whole, btn, listPane, pitchFor, mirrorPitch, money, where } = S.H;
          const style = document.getElementById('as-style');
          if (style) document.head.prepend(style);
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
    util.el('span', 'fl-pill', pills, '1 adult');
    util.el('span', 'fl-pill', pills, 'Economy');
    const row = util.el('div', 'fl-row', card);
    const fields = {};
    for (const f of ['from', 'to']) {
      const fld = util.el('div', 'fl-field', row);
      util.el('label', 'fl-lab', fld, f === 'from' ? 'From' : 'To');
      const ctl = util.el('div', 'fl-ctl', fld);
      ctl.innerHTML = ICON.plane;
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
      const clear = btn(util, 'fl-clear', ctl, '×');
      clear.setAttribute('aria-label', `Clear ${f}`);
      clear.addEventListener('click', () => set({ [f + 'Text']: '', [f]: null, ac: null }));
      fields[f] = { ctl, input, err, ac };
      if (f === 'from') {
        const swap = btn(util, 'fl-swap', row, '⇄');
        swap.setAttribute('aria-label', 'Swap airports');
        swap.addEventListener('click', () => {
          const m = ctx.model;
          set({ from: m.to, to: m.from, fromText: m.toText, toText: m.fromText, ac: null });
        });
      }
    }
    const dfld = util.el('div', 'fl-field date', row);
    util.el('label', 'fl-lab', dfld, 'Date');
    const dctl = util.el('div', 'fl-ctl fl-dctl', dfld);
    dctl.dataset.role = 'date-field';
    dctl.innerHTML = ICON.cal;
    const dval = util.el('span', 'fl-dval', dctl);
    const dateClear = btn(util, 'fl-clear', dctl, '×');
    dateClear.setAttribute('aria-label', 'Clear date');
    dateClear.addEventListener('click', (e) => { e.stopPropagation(); set({ date: null, calOpen: false }); });
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
    const oneWay = util.el('div', 'fl-oneway', row, 'One-way');
    const tripChevron = util.el('span', 'fl-chevron', oneWay); tripChevron.innerHTML = ICON.chev;
    const go = btn(util, 'as-btn primary fl-go', row, 'Search', 'search-button');
    go.innerHTML = ICON.search + '<span>Search</span>';
    go.addEventListener('click', () => step({ click: { button: 'search' } }));
    const filterBar = (parent) => {
      const fb = util.el('div', 'sf-filters', parent);
      for (const t of ['Stops', 'Airlines', 'Price', 'Departure time', 'Duration']) {
        const chip = util.el('span', 'sf-chip', fb, t);
        const arrow = util.el('span', 'fl-chevron', chip); arrow.innerHTML = ICON.chev;
      }
      util.el('span', 'sf-reset', fb, 'Reset');
      const sort = util.el('span', 'sf-sort', fb, 'Sort by:  Cheapest first');
      const arrow = util.el('span', 'fl-chevron', sort); arrow.innerHTML = ICON.chev;
    };
    filterBar(form);

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
    const side = document.querySelector('.sf-side');
    // The reference's Edit link is the original Modify-search control.
    side.querySelector('.sf-edit').replaceWith(back);
    back.className = 'sf-edit';
    back.textContent = 'Edit';
    const sideEdit = back;
    const route = util.el('span', 'fl-route', sum);
    const sdate = util.el('span', 'fl-sdate', sum);
    const cancelBook = btn(util, 'as-btn sm fl-cancel', sum, 'Cancel booking', 'cancel-booking');
    cancelBook.addEventListener('click', () => { if (ctx.model.booked) step({ click: { cancelBook: true } }); });
    side.querySelector('.sf-itinerary .fl-cancel')?.remove();
    side.querySelector('.sf-itinerary').append(cancelBook);
    filterBar(res);
    const count = util.el('div', 'fl-count', res, '\u00a0');
    const pane = util.el('div', 'as-pane', res);
    const ffoot = util.el('div', 'as-foot', res);
    ffoot.innerHTML = '<span>Fares include taxes and carrier fees. Baggage allowance varies by airline. <b>Free cancellation</b> within 24 hours.</span>';
    const cover = util.el('div', 'fl-cover', res);
    cover.dataset.role = 'loading';
    for (let i = 0; i < 4; i++) util.el('div', 'as-skel', cover).style.width = `${92 - i * 13}%`;
    let lbx = null;
    let builtKey = null;
    let pitch = 0;
    let gap = 12;
    const bookEls = {};
    const rowEls = {};

    function buildResults(m) {
      const s = m.searched;
      const flights = fam.flightsFor(spec, s);
      route.textContent = `${fam.airport(s.from).city} (${s.from}) → ${fam.airport(s.to).city} (${s.to})`;
      sdate.textContent = `${fam.fmtDate(s.date, 'long')} · 1 adult · Economy`;
      if (!pitch) {
        const maxPitch = rng.int(84, 100) * 1.65;
        pitch = pitchFor(pane, body, spec.rows, gap, 48, maxPitch, 0);
        const available = () => Math.floor(Math.min(body.getBoundingClientRect().bottom,
          ctx.stage.getBoundingClientRect().bottom) - pane.getBoundingClientRect().top - 2);
        if (spec.rows * pitch - gap > available()) {
          // Long instructions can leave less room than the normal minimum pitch.
          // Recover header whitespace first, then fit every logical row in the stage.
          res.classList.add('tight');
          const height = available();
          gap = Math.max(4, Math.min(gap, Math.floor((height - spec.rows * 36) / (spec.rows - 1))));
          pitch = Math.min(maxPitch, Math.floor((height + gap) / spec.rows));
        }
        pane.style.height = spec.rows * pitch - gap + 2 + 'px';
        pane.classList.toggle('compact', pitch < 140);
        mirrorPitch(ctx, pitch);
      }
      for (const k of Object.keys(bookEls)) delete bookEls[k];
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
          r.classList.toggle('cheapest', fl.price === Math.min(...flights.map(f => f.price)));
          const logo = util.el('div', 'fl-airlogo', r);
          const carrier = fl.airline.toLowerCase();
          if (carrier.includes('delta')) { logo.classList.add('delta'); logo.innerHTML = '<svg viewBox="0 0 48 48"><path fill="#ec183b" d="M24 3L1 44l23-12 23 12z"/><path fill="#921127" d="M24 3v29L1 44l23-5 23 5-23-12z"/></svg>'; }
          else if (carrier.includes('spirit')) { logo.classList.add('spirit'); logo.textContent = 'S'; }
          else if (carrier.includes('united')) { logo.classList.add('united'); logo.innerHTML = '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.2"><circle cx="15" cy="36" r="30"/><ellipse cx="15" cy="36" rx="20" ry="30"/><ellipse cx="15" cy="36" rx="10" ry="30"/><path d="M0 12q23 15 42 7M0 21q23 15 47 7M0 32q23 15 47 7M8 0q22 22 30 48"/></svg>'; }
          else { logo.textContent = fl.airline.split(' ').map(w => w[0]).join('').slice(0, 2); }
          const air = util.el('div', 'fl-air', r);
          util.el('b', '', air, fl.airline);
          util.el('span', '', air, fl.no);
          const times = util.el('div', 'fl-times', r);
          const dep = util.el('div', 'fl-time', times);
          util.el('span', 'fl-t', dep, fam.fmtTime(fl.dep));
          util.el('span', 'fl-code', dep, s.from);
          const line = util.el('div', 'fl-line', times);
          util.el('span', '', line, fam.fmtDur(fl.dur));
          util.el('i', '', line);
          util.el('span', '', line, fl.stops ? `${fl.stops} stop${fl.stops > 1 ? 's' : ''}` : 'Nonstop');
          const dest = util.el('div', 'fl-time', times);
          const arr = util.el('span', 'fl-t', dest, fam.fmtTime(fl.dep + fl.dur));
          util.el('span', 'fl-code', dest, s.to);
          if (fl.dep + fl.dur >= 1440) util.el('sup', '', arr, '+1');
          const fare = util.el('div', 'fl-fare', r);
          fare.append(['Economy Light', 'Economy', 'Economy Flex', 'Basic'][(fl.price / 100 + fl.dep) % 4]);
          util.el('br', '', fare);
          if ((fl.price / 100 * 7 + fl.dur) % 3 === 0) util.el('b', '', fare, `${1 + ((fl.price / 100 + fl.dur) % 5)} seats left`);
          else fare.append('Carry-on included');
          util.el('div', 'fl-fp', r, fmt(fl.price));
          if (fl.price === Math.min(...flights.map(f => f.price))) util.el('span', 'fl-cheapest', r, 'Cheapest');
          const b = btn(util, 'as-btn primary fl-book', r, 'Book', 'book');
          const extras = util.el('div', 'fl-extras', r);
          for (const [icon, label] of [[ICON.bag, 'Personal item included'], [ICON.bag, 'Checked bag extra'], ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8q10-8 20 0M5 12q7-6 14 0M8 16q4-4 8 0"/><circle cx="12" cy="20" r="1"/></svg>', 'Wi-Fi extra']]) {
            const extra = util.el('span', '', extras); extra.innerHTML = icon; util.el('span', '', extra, label);
          }
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
      const chosenRoute = m.searched || (m.from && m.to ? m : null);
      side.querySelector('.sf-route').textContent = chosenRoute ? `${fam.airport(chosenRoute.from).city} (${chosenRoute.from}) → ${fam.airport(chosenRoute.to).city} (${chosenRoute.to})` : 'From → To';
      side.querySelector('.sf-tripdate').textContent = (chosenRoute && chosenRoute.date ? fam.fmtDate(chosenRoute.date, 'long') + '  •  ' : '') + 'One-way  •  1 traveler';
      sideEdit.disabled = m.screen !== 'results' || !!m.booked;
      const bookedFlight = m.booked && m.searched ? fam.flightsFor(spec, m.searched)[m.booked.index] : null;
      side.querySelector('.sf-e1').textContent = bookedFlight ? bookedFlight.airline + ' · ' + bookedFlight.no : 'No flight selected';
      side.querySelector('.sf-e2').textContent = bookedFlight ? `${fam.fmtTime(bookedFlight.dep)} → ${fam.fmtTime(bookedFlight.dep + bookedFlight.dur)} · ${fam.fmtDur(bookedFlight.dur)}` : 'Choose a flight and click Book to continue.';
      const total = fam.fmtMoney(bookedFlight ? bookedFlight.price : 0, spec.money);
      side.querySelector('.sf-sum.fare .sf-value').textContent = total;
      side.querySelector('.sf-sum.tax .sf-value').textContent = fam.fmtMoney(0, spec.money);
      side.querySelector('.sf-sum.tot .sf-value').textContent = total;
      // Retain the real search controls above the comparison list, without
      // supplying values or candidates before the task has searched.
      form.hidden = false;
      body.classList.toggle('flight-results', m.screen === 'results');
      res.hidden = m.screen !== 'results';
      cancelBook.hidden = !m.booked;
      go.disabled = !!m.booked;
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
      if (m.screen === 'results' && m.searched) {
        const key = JSON.stringify(m.searched);
        if (key !== builtKey) {
          builtKey = key;
          buildResults(m);
        }
        const loading = m.loading > 0;
        const n = fam.flightsFor(spec, m.searched).length;
        count.textContent = loading ? 'Searching airlines for the best fares…' : `${n} flights found   •   One-way   •   ${fam.airport(m.searched.from).city} (${m.searched.from}) → ${fam.airport(m.searched.to).city} (${m.searched.to})   •   ${fam.fmtDate(m.searched.date, 'long')}`;
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
