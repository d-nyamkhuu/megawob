// Preserve flight-07's bespoke inline search form and comparison results.
(function () {
  'use strict';
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-flight-07',
    name: 'design',
    split: 'train',
    scenarios: ['flight'],
    template: 'use-shop/store',
    design: {
      parts: {
        buildFlight: (base, S) => {
          const F = () => env.taskDef.helpers;
          const ICON = S.H.ICON;
          const whole = S.H.whole;
          const btn = S.H.btn;
          const where = S.H.where;
          const listPane = S.H.listPane;
          const pitchFor = S.H.pitchFor;
          const mirrorPitch = S.H.mirrorPitch;
const buildFlight = function (ctx, body) {
    const style = document.getElementById('as-style');
    if (style) document.head.prepend(style);
    const { util, spec, rng } = ctx;
    const fam = F();
    const fmt = whole(spec);
    const commit = (m) => { ctx.update(m); paint(ctx.model); };
    const step = (s) => commit(fam.apply(ctx.model, spec, s));
    const set = (patch) => commit({ ...ctx.model, ...patch });

    // ---- form screen
    const dateLabel = document.querySelector('.design-date');
    if (dateLabel && spec.today) {
      const [year, month, day] = spec.today.split('-').map(Number);
      dateLabel.textContent = `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][fam.weekday(spec.today)]}, ${fam.MONTHS[month - 1].slice(0, 3)} ${day}, ${year}`;
    }
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
      const hint = util.el('div', 'fl-hint', fld);
      fields[f] = { ctl, input, err, ac, hint };
    }
    const dfld = util.el('div', 'fl-field date', row);
    util.el('label', 'fl-lab', dfld, 'Depart Date');
    const dctl = util.el('div', 'fl-ctl fl-dctl', dfld);
    dctl.dataset.role = 'date-field';
    dctl.innerHTML = '<svg viewBox="0 0 30 30" aria-hidden="true"><rect x="1" y="1" width="28" height="28" fill="#ddd" stroke="#666"/><path d="M2 28V2H28" fill="none" stroke="#fff"/><rect x="4" y="5" width="22" height="21" fill="#fff" stroke="#858585"/><path d="M4 9H26" stroke="#476c99" stroke-width="5"/><path d="M9 3V8M21 3V8" stroke="#777" stroke-width="2"/><g fill="#486b91"><path d="M7 13h3v3H7zM13 13h3v3h-3zM19 13h3v3h-3zM7 18h3v3H7zM13 18h3v3h-3zM19 18h3v3h-3zM7 23h3v2H7zM13 23h3v2h-3zM19 23h3v2h-3z"/></g></svg>';
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
    for (const [lab, val, wide] of [['Passengers', '1', false], ['Trip Type', 'One-way', true]]) {
      const ff = util.el('div', 'fl-field fl-fake' + (wide ? ' wide' : ''), row);
      util.el('label', 'fl-lab', ff, lab);
      const fc = util.el('div', 'fl-ctl', ff);
      util.el('span', '', fc, val);
      util.el('i', '', fc, '▼');
    }
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
    const count = util.el('div', 'fl-count', res, '\u00a0');
    const th = util.el('div', 'fl-th', res);
    for (const [k, t] of [['sel', 'Select'], ['air', 'Airline'], ['route', 'Route'], ['dep', 'Depart'], ['arr', 'Arrive'], ['dur', 'Duration ▲'], ['price', 'Price'], ['book', '']]) util.el('span', 't-' + k, th, t);
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

    function buildResults(m) {
      const s = m.searched;
      const flights = fam.flightsFor(spec, s);
      th.style.paddingRight = flights.length > spec.rows ? '15px' : '0';
      route.textContent = `One-Way Flights: ${s.from} to ${fam.airport(s.to).city}`;
      sdate.textContent = fam.fmtDate(s.date, 'long');
      if (!pitch) {
        const sampledPitch = rng.int(84, 100);
        const rowHeight = 57 * card.getBoundingClientRect().height / 132;
        pitch = pitchFor(pane, body, spec.rows, gap, rowHeight, Math.min(sampledPitch, rowHeight), 48);
        pane.style.height = spec.rows * pitch - gap + 2 + 'px';
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
          const sel = util.el('div', 'c-sel', r);
          util.el('span', 'fl-radio', sel);
          util.el('div', 'c-air', r, fl.airline);
          util.el('div', 'c-route', r, `${s.from} → ${s.to}` + (fl.stops ? ` (${fl.stops} stop${fl.stops > 1 ? 's' : ''})` : ' (nonstop)'));
          util.el('div', 'c-dep', r, fam.fmtTime(fl.dep));
          const arr = util.el('div', 'c-arr', r, fam.fmtTime(fl.dep + fl.dur));
          if (fl.dep + fl.dur >= 1440) util.el('sup', '', arr, '+1');
          util.el('div', 'c-dur', r, fam.fmtDur(fl.dur));
          util.el('div', 'c-price', r, fmt(fl.price));
          const bc = util.el('div', 'c-book', r);
          const b = btn(util, 'as-btn primary fl-book', bc, 'Book', 'book');
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
      // Retain the search summary without exposing form-only actions on the results screen.
      form.inert = m.screen !== 'form';
      res.hidden = m.screen !== 'results';
      for (const f of ['from', 'to']) {
        const fd = fields[f];
        fd.hint.textContent = m[f] ? fam.airport(m[f]).label : '';
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
        count.hidden = !loading;
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
  }
        ;
          return buildFlight;
        },
      },
    },
  });
})();
