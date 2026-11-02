/* choose-option/_widgets-autocomplete: widget template parts, installed in their original order.
 * All BASE keys remain design-overridable through the parent template.
 */
(function () {
  'use strict';
  function acCtl(scopeRef, o) {
    const fam = env.taskDef.helpers;
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
      if (m.loading) {
        o.msg('loading', m.text);
        return;
      }
      const it = items(m);
      if (!it.length) {
        o.msg('none', m.text.trim());
        return;
      }
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

  function install(scopeRef) {

    scopeRef.BASE.marker = (ctx) => {
      if (!scopeRef.D.marker) return;
      const marker = ctx.util.el('div', 'ds-swiss-label', ctx.stage);
      ctx.util.el('strong', '', marker, '01');
      ctx.util.el('h1', '', marker, 'Trip Details');
      ctx.util.el('div', 'ds-redrule', marker);
      ctx.util.el('p', '', marker, 'Fill in your travel information to continue.');
    };

    scopeRef.BASE.travelExtra = (ctx) => {
      if (!scopeRef.D.travelExtra) return;
      const extra = ctx.util.el('section', 'ds-travel-extra', ctx.stage);
      ctx.util.el('h3', '', extra, 'Travel Dates');
      const dates = ctx.util.el('div', 'ds-travel-dates', extra);
      ['Check-in', 'Check-out'].forEach((text) => {
        const label = ctx.util.el('label', '', dates, text);
        const ctl = ctx.util.el('div', 'ds-travel-date', label);
        const input = ctx.util.el('input', '', ctl);
        input.type = 'text';
        input.placeholder = 'mm/dd/yyyy';
        ctx.util.el('span', '', ctl, '▣');
      });
      ctx.util.el('h3', '', extra, 'Travelers');
      const travelers = ctx.util.el('button', 'ds-travelers', extra, '1 adult');
      travelers.type = 'button';
    };

    scopeRef.BASE.autocompleteInput = () => {};

    scopeRef.BASE.autocompleteControl = () => {};

    scopeRef.BASE.autocompletePainted = () => {};

    scopeRef.BASE.autocompleteShown = () => {};

    scopeRef.BASE.autocompleteReady = () => {};

    scopeRef.BASE.suggestions = (ctx, controls) => {
      if (!scopeRef.D.suggestionColumns) return;
      const { pop, input } = controls;
      const opts = [...pop.querySelectorAll('.fp-opt')];
      const room = ctx.stage.getBoundingClientRect().bottom - input.getBoundingClientRect().bottom - 24;
      const columns = opts.length * 30 > room ? 2 : 1;
      pop.classList.toggle('cols', columns > 1);
      if (columns > 1) {
        pop.style.gridTemplateRows = `repeat(${Math.ceil(opts.length / columns)},28px)`;
        pop.style.gridTemplateColumns = '1fr 1fr';
      } else {
        pop.style.gridTemplateRows = '';
        pop.style.gridTemplateColumns = '';
      }
      opts.forEach((option) => {
        option.style.height = (columns > 1 ? 28 : 36) + 'px';
      });
    };

    const buildAutocomplete = (field, ctx) => {
      const { util, spec } = ctx;
      const box = util.el('div', 'fp-ac', field);
      box.style.position = 'relative';
      const ctl = util.el('div', 'fp-ctl', box);
      ctl.insertAdjacentHTML('beforeend', scopeRef.D.searchSvg);
      const input = util.el('input', 'fp-input', ctl);
      Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: spec.placeholder });
      input.dataset.role = 'field';
      const controls = { box, ctl, input };
      scopeRef.P.autocompleteInput(ctx, controls);
      ctl.insertAdjacentHTML('beforeend', scopeRef.D.okSvg);
      const pop = util.el('div', 'fp-pop', box);
      pop.style.top = 'calc(100% + 4px)';
      pop.dataset.role = 'suggestions';
      Object.assign(controls, { pop });
      scopeRef.P.autocompleteControl(ctx, controls);
      const status = util.el('div', 'fp-status', field);
      const rowH = ctx.rng.int(32, 36);
      const ac = acCtl(scopeRef, {
        input,
        pop,
        s: scopeRef.st,
        spec,
        set: scopeRef.set,
        after: (m) => scopeRef.P.autocompletePainted(ctx, controls, m),
        show: (open) => {
          pop.hidden = !open;
        },
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
          if (kind === 'loading') {
            util.el('span', 'fp-spin', r);
            r.append('Searching…');
          } else r.textContent = `No results for “${text}”`;
        },
      });
      function show() {
        const m = scopeRef.st.ctx.model;
        ac.paint();
        scopeRef.P.suggestions(ctx, controls);
        box.classList.toggle('committed', !!m.value);
        scopeRef.P.autocompleteShown(ctx, controls, m);
        status.replaceChildren();
        if (m.value) {
          status.append('Selected: ');
          util.el('b', '', status, m.value);
        } else status.textContent = `No ${spec.noun} selected yet`;
      }
      Object.assign(controls, { ac, show, status, rowH });
      Object.assign(scopeRef.els, controls);
      scopeRef.P.autocompleteReady(ctx, controls);
      scopeRef.st.show = show;
      scopeRef.st.loc = (t) =>
        t.field !== undefined
          ? ac.locateInput()
          : t.suggestion !== undefined
            ? ac.locateSuggestion(t.suggestion)
            : null;
    };
    scopeRef.buildAutocomplete = buildAutocomplete;
  }
  env.template('choose-option/_widgets-autocomplete', () => ({ install }));
})();
