/* use-shop/_shared-flight: identical flight part implementations shared by store and adapted.
 * Call with the factory scope; each template retains its overridable BASE entries. */
(function () {
  'use strict';
  function fieldDecor(S) {
    return () => {};
  }

  function flightField(S) {
    return (V, f) => {
      const { ctx, util, fam, row, fields, set, step } = V;
      const fld = util.el('div', 'fl-field', row);
      util.el('label', 'fl-lab', fld, S.D.fieldLabels[f]);
      const ctl = util.el('div', 'fl-ctl', fld);
      ctl.innerHTML = f === 'from' ? S.H.ICON.plane : S.H.ICON.pin;
      const input = util.el('input', 'fl-input', ctl);
      Object.assign(input, {
        type: 'text',
        autocomplete: 'off',
        spellcheck: false,
        placeholder: f === 'from' ? S.D.fromPlaceholder : 'Where to?',
      });
      input.dataset.role = `${f}-field`;
      S.P.fieldDecor(V, f, ctl, input);
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
            r.innerHTML = S.H.ICON.plane;
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
    };
  }

  function flightDeals(S) {
    return (V) => {
      const { util, rng, fam, body, form } = V;
      const deals = util.el('div', 'fl-deals', form);
      const hues = [
        ['#4dabf7', '#1864ab'],
        ['#ffa94d', '#d9480f'],
        ['#69db7c', '#2b8a3e'],
        ['#b197fc', '#5f3dc4'],
      ];
      for (const a of rng.sample(fam.AIRPORTS, body.getBoundingClientRect().width > 1100 ? 4 : 3)) {
        const d = util.el('div', 'fl-deal', deals);
        const i = util.el('i', '', d);
        const h = rng.pick(hues);
        i.style.setProperty('--c1', h[0]);
        i.style.setProperty('--c2', h[1]);
        util.el('b', '', d, `${a.city}, ${a.st}`);
        util.el('span', '', d, `from $${rng.int(59, 399)}`);
      }
    };
  }

  function flightForm(S) {
    return (V) => {
      const { util, body } = V;
      V.form = util.el('div', 'fl-form', body);
      S.P.flightHeading(V);
      V.card = util.el('div', 'fl-card', V.form);
      const pills = util.el('div', 'fl-pills', V.card);
      util.el('span', 'fl-pill on', pills, 'One-way');
      util.el('span', 'fl-pill', pills, '1 adult');
      util.el('span', 'fl-pill', pills, 'Economy');
      V.row = util.el('div', 'fl-row', V.card);
      V.fields = {};
      for (const f of ['from', 'to']) S.P.flightField(V, f);
      S.P.flightDate(V);
      S.P.flightStatics(V);
      V.go = S.H.btn(util, 'as-btn primary fl-go', V.row, S.D.searchLabel, 'search-button');
      V.go.addEventListener('click', () => V.step({ click: { button: 'search' } }));
      S.P.flightEmpty(V);
      S.P.flightDeals(V);
    };
  }

  function resultsSummary(S) {
    return (V, s) => {
      const { fam } = V;
      V.route.textContent = `${fam.airport(s.from).city} (${s.from}) → ${fam.airport(s.to).city} (${s.to})`;
      V.sdate.textContent = `${fam.fmtDate(s.date, 'long')} · 1 adult · Economy`;
    };
  }

  function flightResults(S) {
    return (V, m) => {
      const { ctx, spec, fam, pane, gap, bookEls } = V;
      const s = m.searched;
      const flights = fam.flightsFor(spec, s);
      S.P.resultsSummary(V, s);
      if (!V.pitch) S.P.flightPitch(V);
      for (const k of Object.keys(bookEls)) delete bookEls[k];
      V.lbx = S.H.listPane(ctx, pane, {
        keys: flights.map((f, i) => i),
        rows: spec.rows,
        pitch: V.pitch,
        gap,
        scroll: m.scroll,
        label: 'flights',
        build(i) {
          return S.P.flightRow(V, i, flights[i], flights, s);
        },
      });
    };
  }

  function flightCal(S) {
    return (V, m) => {
      const { util, spec, fam, cal, prevEl, nextEl, calT, grid } = V;
      V.calBuilt = m.calView;
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
          const d = util.el(
            'div',
            'fl-day' + (c.inMonth ? '' : ' blank') + (c.iso === spec.today ? ' today' : ''),
            grid,
            String(c.day),
          );
          d.dataset.iso = c.iso;
          if (c.inMonth) {
            d.dataset.role = 'day';
            cal.bindDay(d, c.iso);
          }
        }
      }
    };
  }

  function paintResultsHead(S) {
    return (V, m) => {
      const { spec, fam, count, cover, pane } = V;
      const loading = m.loading > 0;
      const n = fam.flightsFor(spec, m.searched).length;
      count.textContent = loading
        ? 'Searching airlines for the best fares…'
        : `${n} flights found · prices per person, taxes included`;
      cover.hidden = !loading;
      if (loading)
        Object.assign(cover.style, {
          left: pane.offsetLeft + 'px',
          top: pane.offsetTop + 'px',
          width: pane.offsetWidth + 'px',
          height: pane.offsetHeight + 'px',
        });
    };
  }

  function paintBookRow(S) {
    return (V, m, i, b) => {
      const mine = !!m.booked && m.booked.index === +i;
      b.disabled = !!m.booked;
      b.textContent = mine ? S.D.bookedLabel : S.D.bookLabel;
      b.classList.toggle('mine', mine);
      V.rowEls[i].classList.toggle('booked', mine);
    };
  }

  function paintEnd(S) {
    return () => {};
  }

  function flightPaint(S) {
    return (V, m) => {
      const { fam, fields, dval, dctl, derr, calPop, grid } = V;
      S.P.paintScreen(V, m);
      for (const f of ['from', 'to']) {
        const fd = fields[f];
        if (fd.input.value !== m[f + 'Text']) fd.ac.set({ text: m[f + 'Text'] });
        // Open state follows the model too: a reverted model (pageFaults=revert) can reopen the list.
        fd.ac.set({ open: m.ac === f });
        const bad = m.invalid.includes(f);
        fd.ctl.classList.toggle('bad', bad);
        fd.err.hidden = !bad;
      }
      dval.textContent = m.date ? fam.fmtDate(m.date, S.D.dateFormat) : 'MM/DD/YYYY';
      dval.classList.toggle('empty', !m.date);
      dctl.classList.toggle('bad', m.invalid.includes('date'));
      dctl.classList.toggle('open', m.calOpen);
      derr.hidden = !m.invalid.includes('date');
      calPop.hidden = !m.calOpen;
      if (m.calOpen && V.calBuilt !== m.calView) S.P.flightCal(V, m);
      if (m.calOpen)
        for (const d of grid.children)
          d.classList.toggle('sel', d.dataset.iso === m.date && !d.classList.contains('blank'));
      if (m.screen === 'results' && m.searched) {
        const key = JSON.stringify(m.searched);
        if (key !== V.builtKey) {
          V.builtKey = key;
          S.P.flightResults(V, m);
        }
        S.P.paintResultsHead(V, m);
        for (const [i, b] of Object.entries(V.bookEls)) S.P.paintBookRow(V, m, i, b);
        V.back.disabled = !!m.booked;
        V.cancelBook.hidden = !m.booked;
      } else V.cover.hidden = true;
      S.P.paintEnd(V, m);
    };
  }

  function flightLocate(S) {
    return (V, t) => {
      const { fields, dctl, cal, go, back, cancelBook, lbx, bookEls } = V;
      if (t.suggestion !== undefined) return fields[t.field].ac.locateSuggestion(t.suggestion);
      if (t.field === 'from' || t.field === 'to') return fields[t.field].ac.locateInput();
      if (t.field === 'date') return S.H.where(dctl, 'date field');
      if (t.nav) return cal.locateNav(t.nav);
      if (t.day) return cal.locateDay(t.day);
      if (t.button) return S.H.where(go, 'Search');
      if (t.back) return S.H.where(back, 'Modify search');
      if (t.cancelBook) return S.H.where(cancelBook, 'Cancel booking');
      if (t.thumb) return lbx.locateThumb();
      if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
      if (t.pane) return S.H.where(lbx.list, 'flight list');
      if (t.book !== undefined) return S.H.where(bookEls[t.book], `Book ${t.book}`);
      return null;
    };
  }
  env.template('use-shop/_shared-flight', () => ({ fieldDecor, flightField, flightDeals, flightForm, resultsSummary, flightResults, flightCal, paintResultsHead, paintBookRow, paintEnd, flightPaint, flightLocate }));
})();
