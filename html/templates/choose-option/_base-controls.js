/* choose-option/_base-controls: base widget implementations.
 * reference.js retains their part hooks; scopeRef reads the live, overridable reference scope.
 */
(function () {
  'use strict';

  function ensureStyle(scopeRef, id, css) {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.append(s);
  }

  function wheelPane(scopeRef, el, after) {
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const k = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? el.clientHeight : 1;
      el.scrollTop += e.deltaY * k;
      after();
    }, { passive: false });
  }

  function acCtl(scopeRef, o) {
    const fam = scopeRef.env.taskDef.helpers;
    const { input, spec } = o;
    const rows = new Map();
    let key = '';
    const items = (m) => (m.loading ? [] : fam.suggest(spec, m.text));
    function commit(x) {
      o.set({ value: x, text: x, open: false, active: -1, loading: false });
      input.value = x;
      paint();
    }
    function paint() {
      const m = o.s.ctx.model;
      if (input.value !== m.text) input.value = m.text;
      const k = JSON.stringify([!!m.open, !!m.loading, m.text, m.active, m.value]);
      if (k === key) return;
      key = k;
      if (o.after) o.after(m);
      o.show(!!m.open);
      rows.clear();
      if (!m.open) return;
      o.pop.replaceChildren();
      if (m.loading) { o.msg('loading', m.text); return; }
      const it = items(m);
      if (!it.length) { o.msg('none', m.text.trim()); return; }
      it.forEach((x, i) => {
        const r = o.row(x, i === m.active, m.text.trim());
        r.dataset.role = 'suggestion';
        r.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus in the field
        r.addEventListener('click', () => commit(x));
        rows.set(x, r);
      });
    }
    input.addEventListener('input', () => {
      const text = input.value;
      const open = text.trim() !== '';
      const lat = spec.latency || 0;
      o.set({ text, value: '', active: -1, open, loading: open && lat > 0, readyAt: o.s.ctx.clock() + lat });
      paint();
    });
    input.addEventListener('keydown', (e) => {
      const m = o.s.ctx.model;
      if (e.key === 'Escape') {
        if (m.open) o.set({ open: false, active: -1 });
        paint();
        return;
      }
      if (!m.open || m.loading) return;
      const it = items(m);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!it.length) return;
        const a = m.active ?? -1;
        o.set({ active: e.key === 'ArrowDown' ? Math.min(it.length - 1, a + 1) : Math.max(0, a - 1) });
        paint();
      } else if (e.key === 'Enter' && m.active >= 0 && m.active < it.length) {
        e.preventDefault();
        commit(it[m.active]);
      }
    });
    input.addEventListener('blur', () => {
      if (!input.isConnected) return;
      if (o.s.ctx.model.open) o.set({ open: false, active: -1 });
      paint();
    });
    return {
      paint,
      locateInput: () => scopeRef.req(input, 'autocomplete field'),
      locateSuggestion: (x) => scopeRef.req(rows.get(x), `suggestion ${x}`),
    };
  }

  function place(scopeRef, card, ctx, popup) {
    const { rng, size } = ctx;
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const mx = 16;
    const my = 12;
    const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
    const fy = popup ? rng.float(0, 0.22) : rng.pick([0.5, 0.5, 0, 1, rng.float()]);
    card.style.left = Math.round(mx + fx * Math.max(0, size.width - w - 2 * mx)) + 'px';
    card.style.top = Math.round(my + fy * Math.max(0, size.height - h - 2 * my)) + 'px';
  }

  function buildSelect(scopeRef, parent, ctx, o) {
    const { util } = ctx;
    const box = util.el('div', 'fp-dd', parent);
    box.style.position = 'relative';
    const trigger = util.el('div', 'fp-ctl fp-trigger', box);
    trigger.dataset.role = 'trigger';
    trigger.tabIndex = 0;
    const val = util.el('span', 'fp-val', trigger);
    trigger.insertAdjacentHTML('beforeend', scopeRef.CHEV);
    const pop = util.el('div', 'fp-pop', box);
    pop.style.top = 'calc(100% + 4px)';
    pop.dataset.role = 'listbox';
    let rows = new Map();
    const rowMax = ctx.rng.int(32, 36);
    const dd = scopeRef.env.ui.dropdown(trigger, pop, {
      label: o.key,
      keyboard: true,
      open: o.isOpen(),
      value: o.value() || null,
      options: [],
      onActive: () => show(),
      onChange(x) { o.onPick(x); show(); },
      onOpenChange(open) { if (o.isOpen() !== open) o.setOpen(open); show(); },
    });
    function setOptions(list) {
      dd.clear();
      pop.replaceChildren();
      rows = new Map();
      for (const x of list) {
        const r = util.el('div', 'fp-opt', pop);
        r.dataset.role = 'option';
        r.innerHTML = scopeRef.TICK;
        util.el('span', '', r, x);
        rows.set(x, r);
      }
      dd.options([...rows]);
      layout();
    }
    // All options fit below the trigger inside the stage: shrink rows, then use columns.
    function layout() {
      if (!rows.size) return;
      const sr = ctx.stage.getBoundingClientRect();
      const tr = trigger.getBoundingClientRect();
      const avail = sr.bottom - tr.bottom - 4 - 10 - 12;
      const n = rows.size;
      let cols = 1;
      while (cols < 3 && Math.ceil(n / cols) * 24 > avail) cols++;
      const per = Math.ceil(n / cols);
      const h = util.clamp(Math.floor(avail / per), 22, rowMax);
      pop.classList.toggle('cols', cols > 1);
      pop.style.gridTemplateRows = cols > 1 ? `repeat(${per}, ${h}px)` : '';
      pop.style.gridTemplateColumns = cols > 1 ? `repeat(${cols}, minmax(0, 1fr))` : '';
      const w = Math.max(tr.width, cols > 1 ? cols * 190 : tr.width);
      const left = Math.min(0, sr.right - 8 - (tr.left + w));
      pop.style.left = left + 'px';
      pop.style.right = 'auto';
      pop.style.width = w + 'px';
      for (const r of rows.values()) { r.style.height = h + 'px'; r.style.fontSize = h < 28 ? '14px' : ''; }
    }
    function show() {
      const open = o.isOpen();
      const v = o.value();
      dd.set({ open, value: v || null });
      val.textContent = v || o.placeholder;
      val.classList.toggle('empty', !v);
      trigger.classList.toggle('open', open);
      trigger.classList.toggle('disabled', !!(o.disabled && o.disabled()));
      for (const [x, r] of rows) {
        r.classList.toggle('sel', x === v);
        r.classList.toggle('active', x === dd.active());
      }
    }
    return { setOptions, layout, show, trigger, locateTrigger: () => dd.locateTrigger(), locateOption: (x) => dd.locateOption(x) };
  }

  function buildDropdown(scopeRef, field, ctx) {
    const { spec } = ctx;
    const sel = scopeRef.buildSelect(field, ctx, {
      key: 'dropdown',
      placeholder: spec.placeholder,
      value: () => scopeRef.st.ctx.model.value,
      isOpen: () => !!scopeRef.st.ctx.model.open,
      setOpen: (open) => scopeRef.set({ open }),
      onPick: (x) => scopeRef.set({ value: x, open: false }),
    });
    scopeRef.st.layout = () => sel.setOptions(spec.options);
    scopeRef.st.show = sel.show;
    scopeRef.st.loc = (t) => (t.open !== undefined ? sel.locateTrigger() : t.option !== undefined ? sel.locateOption(t.option) : null);
  }

  function buildDependent(scopeRef, card, ctx) {
    const { util, spec, rng } = ctx;
    const caps = rng.bool(0.3);
    const f1 = util.el('div', 'fp-field', card);
    util.el('div', 'fp-label' + (caps ? ' caps' : ''), f1, spec.label);
    const f2 = util.el('div', 'fp-field', card);
    util.el('div', 'fp-label' + (caps ? ' caps' : ''), f2, spec.label2);
    const country = scopeRef.buildSelect(f1, ctx, {
      key: 'country',
      placeholder: 'Select a country',
      value: () => scopeRef.st.ctx.model.country,
      isOpen: () => scopeRef.st.ctx.model.open === 'country',
      setOpen: (open) => scopeRef.set({ open: open ? 'country' : '' }),
      onPick: (x) => {
        const m = scopeRef.st.ctx.model;
        scopeRef.set({ country: x, city: x === m.country ? m.city : '', open: '' });
        if (x !== m.country) city.setOptions(spec.cities[x] || []);
        show();
      },
    });
    const city = scopeRef.buildSelect(f2, ctx, {
      key: 'city',
      placeholder: rng.pick(['Select a city', 'Choose a city']),
      value: () => scopeRef.st.ctx.model.city,
      isOpen: () => scopeRef.st.ctx.model.open === 'city',
      setOpen: (open) => scopeRef.set({ open: open ? 'city' : '' }),
      onPick: (x) => scopeRef.set({ city: x, open: '' }),
      disabled: () => !scopeRef.st.ctx.model.country,
    });
    const status = util.el('div', 'fp-status', card);
    let shownCountry = null;
    function show() {
      const m = scopeRef.st.ctx.model;
      if (m.country !== shownCountry) {
        shownCountry = m.country;
        city.setOptions(m.country ? spec.cities[m.country] || [] : []);
      }
      country.show();
      city.show();
      status.textContent = m.country ? `${spec.cities[m.country].length} cities available in ${m.country}` : 'Choose a country to see its cities';
    }
    scopeRef.st.layout = () => { country.setOptions(spec.options); shownCountry = null; };
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => {
      const s = t.open === 'country' || t.of === 'country' ? country : city;
      return t.open !== undefined ? s.locateTrigger() : s.locateOption(t.option);
    };
  }

  function buildMatrix(scopeRef, field, ctx) {
    const { util, spec, rng } = ctx;
    scopeRef.ensureStyle('fpm-style', scopeRef.CSS_MX);
    const table = util.el('table', 'fp-mx', field);
    table.dataset.role = 'matrix';
    table.style.setProperty('--fp-mxh', (spec.rows.length > 5 ? rng.int(34, 38) : rng.int(40, 48)) + 'px');
    const head = util.el('tr', '', util.el('thead', '', table));
    util.el('th', '', head);
    for (const c of spec.cols) util.el('th', '', head, c);
    const body = util.el('tbody', '', table);
    const name = `fp-mx-${rng.int(0, 1e6)}`;
    const labs = spec.rows.map(() => ({}));
    const inputs = spec.rows.map(() => ({}));
    spec.rows.forEach((r, i) => {
      const tr = util.el('tr', '', body);
      const th = util.el('th', 'r', tr, r);
      th.scope = 'row';
      spec.cols.forEach((c) => {
        const lab = util.el('label', '', util.el('td', '', tr));
        const inp = util.el('input', '', lab);
        inp.type = 'radio';
        inp.name = `${name}-${i}`;
        inp.value = c;
        inp.setAttribute('aria-label', `${r}: ${c}`);
        inp.addEventListener('change', () => {
          const values = scopeRef.st.ctx.model.values.slice();
          values[i] = c;
          scopeRef.set({ values });
        });
        labs[i][c] = lab;
        inputs[i][c] = inp;
      });
    });
    function show() {
      const m = scopeRef.st.ctx.model;
      spec.rows.forEach((_, i) => spec.cols.forEach((c) => { inputs[i][c].checked = m.values[i] === c; }));
    }
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => (t.cell ? scopeRef.req(labs[spec.rows.indexOf(t.cell[0])][t.cell[1]], 'matrix cell') : null);
  }

  function buildChoices(scopeRef, field, ctx, kind) {
    const { util, spec, rng } = ctx;
    const tiles = !!spec.details || rng.bool(0.45);
    const group = util.el('div', 'fp-group' + (tiles ? ' tiles' : ''), field);
    group.dataset.role = kind === 'radio' ? 'radiogroup' : 'group';
    const n = spec.options.length;
    const longest = Math.max(...spec.options.map((o) => o.length));
    const cols = kind === 'checkbox' ? (n > 5 ? 2 : 1) : (n > 6 || (tiles && n > 3 && longest <= 14) ? 2 : 1);
    group.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    if (!tiles) group.style.rowGap = rng.int(8, 13) + 'px';
    const name = `fp-${kind}-${ctx.rng.int(0, 1e6)}`;
    const inputs = [];
    const labels = {};
    for (const o of spec.options) {
      const lab = util.el('label', 'fp-choice', group);
      lab.dataset.role = 'option';
      const inp = util.el('input', '', lab);
      inp.type = kind;
      inp.name = name;
      inp.value = o;
      const txt = util.el('span', '', lab, o);
      if (spec.details && spec.details[o]) util.el('span', 'fp-det', txt, spec.details[o]);
      inputs.push([o, inp]);
      labels[o] = lab;
    }
    const multi = kind === 'checkbox';
    const ch = scopeRef.env.ui.choices(inputs, {
      label: kind,
      multi,
      value: ctx.model.value,
      values: ctx.model.values,
      onChange(v) { scopeRef.set(multi ? { values: v } : { value: v }); show(); },
    });
    function show() {
      const m = scopeRef.st.ctx.model;
      ch.set(multi ? m.values : m.value);
      for (const o of spec.options) labels[o].classList.toggle('on', multi ? m.values.includes(o) : m.value === o);
    }
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => (t.option !== undefined ? ch.locate(t.option) : null);
  }

  function buildAutocomplete(scopeRef, field, ctx) {
    const { util, spec } = ctx;
    const box = util.el('div', 'fp-ac', field);
    box.style.position = 'relative';
    const ctl = util.el('div', 'fp-ctl', box);
    ctl.insertAdjacentHTML('beforeend', scopeRef.SEARCH);
    const input = util.el('input', 'fp-input', ctl);
    Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: spec.placeholder });
    input.dataset.role = 'field';
    ctl.insertAdjacentHTML('beforeend', scopeRef.OK);
    const pop = util.el('div', 'fp-pop', box);
    pop.style.top = 'calc(100% + 4px)';
    pop.dataset.role = 'suggestions';
    const status = util.el('div', 'fp-status', field);
    const rowH = ctx.rng.int(32, 36);
    const ac = scopeRef.acCtl({
      input, pop, s: scopeRef.st, spec, set: scopeRef.set,
      show: (open) => { pop.hidden = !open; },
      row(x, active, typed) {
        const r = util.el('div', 'fp-opt' + (active ? ' active' : ''), pop);
        r.style.height = rowH + 'px';
        const label = util.el('span', '', r);
        util.el('span', 'fp-m', label, x.slice(0, typed.length));
        label.append(x.slice(typed.length));
        return r;
      },
      msg(kind, text) {
        const r = util.el('div', 'fp-msg', pop);
        if (kind === 'loading') { util.el('span', 'fp-spin', r); r.append('Searching…'); } else r.textContent = `No results for “${text}”`;
      },
    });
    function show() {
      const m = scopeRef.st.ctx.model;
      ac.paint();
      box.classList.toggle('committed', !!m.value);
      status.replaceChildren();
      if (m.value) {
        status.append('Selected: ');
        util.el('b', '', status, m.value);
      } else status.textContent = `No ${spec.noun} selected yet`;
    }
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => (t.field !== undefined ? ac.locateInput() : t.suggestion !== undefined ? ac.locateSuggestion(t.suggestion) : null);
  }

  env.template('choose-option/_base-controls', () => ({ ensureStyle, wheelPane, acCtl, place, buildSelect, buildDropdown, buildDependent, buildMatrix, buildChoices, buildAutocomplete }));
})();
