/* choose-option/_base-search: base widget implementations.
 * reference.js retains their part hooks; scopeRef reads the live, overridable reference scope.
 */
(function () {
  'use strict';

  function buildCombobox(scopeRef, field, ctx, o = {}) {
    const { util, spec, rng } = ctx;
    const fam = scopeRef.env.taskDef.helpers;
    const rowH = rng.int(30, 34);
    const box = util.el('div', 'fp-dd', field);
    box.style.position = 'relative';
    const trigger = util.el('div', 'fp-ctl fp-trigger', box);
    trigger.dataset.role = 'trigger';
    const val = util.el('span', 'fp-val', trigger);
    let clr = null;
    if (o.clear) {
      // Select2's allowClear: an x that empties the selection without opening the list.
      clr = util.el('span', 'fp-x fp-clr', trigger, '×');
      clr.dataset.role = 'clear';
      clr.setAttribute('aria-label', 'Clear selection');
      clr.addEventListener('click', (e) => {
        e.stopPropagation();
        scopeRef.set({ value: '', open: false, active: -1 });
        show();
      });
    }
    trigger.insertAdjacentHTML('beforeend', scopeRef.CHEV);
    const pop = util.el('div', 'fp-pop', box);
    pop.style.top = 'calc(100% + 4px)';
    const sbox = util.el('div', 'fp-ctl fp-search', pop);
    sbox.insertAdjacentHTML('beforeend', scopeRef.SEARCH);
    const input = util.el('input', 'fp-input', sbox);
    Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: rng.pick(['Search…', 'Type to filter', 'Find a product']) });
    input.dataset.role = 'field';
    const list = util.el('div', 'fp-clist', pop);
    list.dataset.role = 'listbox';
    let maxRows = 7;
    list.style.overflowY = 'auto';
    scopeRef.wheelPane(list, () => {});
    const rows = new Map();
    let key = '';
    const pick = (o) => { scopeRef.set({ value: o, open: false, active: -1 }); show(); };
    input.addEventListener('input', () => {
      const q = input.value;
      scopeRef.set({ query: q, active: fam.comboFilter(spec, q).length ? 0 : -1 });
      show();
    });
    input.addEventListener('keydown', (e) => {
      const m = scopeRef.st.ctx.model;
      const f = fam.comboFilter(spec, m.query);
      if (e.key === 'Escape') { scopeRef.set({ open: false, active: -1 }); show(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!f.length) return;
        const a = m.active ?? -1;
        scopeRef.set({ active: e.key === 'ArrowDown' ? Math.min(f.length - 1, a + 1) : Math.max(0, a - 1) });
        show();
      } else if (e.key === 'Enter' && m.active >= 0 && m.active < f.length) {
        e.preventDefault();
        pick(f[m.active]);
      }
    });
    trigger.addEventListener('click', () => {
      const open = !scopeRef.st.ctx.model.open;
      scopeRef.set(open ? { open, query: '', active: -1 } : { open });
      show();
      if (open) input.focus();
    });
    scopeRef.st.outside = (e) => {
      if (scopeRef.st.ctx.model.open && !box.contains(e.target)) { scopeRef.set({ open: false, active: -1 }); show(); }
    };
    scopeRef.st.alive = () => box.isConnected;
    function show() {
      const m = scopeRef.st.ctx.model;
      val.textContent = m.value || spec.placeholder;
      val.classList.toggle('empty', !m.value);
      if (clr) clr.hidden = !m.value;
      trigger.classList.toggle('open', !!m.open);
      pop.hidden = !m.open;
      if (input.value !== (m.query || '')) input.value = m.query || '';
      const k = JSON.stringify([!!m.open, m.query, m.active, m.value]);
      if (k === key) return;
      key = k;
      list.replaceChildren();
      rows.clear();
      if (!m.open) return;
      const f = fam.comboFilter(spec, m.query);
      if (!f.length) {
        util.el('div', 'fp-msg', list, 'No matches');
        return;
      }
      const q = (m.query || '').trim().toLowerCase();
      f.forEach((o, i) => {
        const r = util.el('div', 'fp-opt' + (i === m.active ? ' active' : '') + (o === m.value ? ' sel' : ''), list);
        r.dataset.role = 'option';
        r.style.height = rowH + 'px';
        r.innerHTML = scopeRef.TICK;
        const lab = util.el('span', '', r);
        const at = q ? o.toLowerCase().indexOf(q) : -1;
        if (at >= 0) {
          lab.append(o.slice(0, at));
          util.el('span', 'fp-m', lab, o.slice(at, at + q.length));
          lab.append(o.slice(at + q.length));
        } else lab.textContent = o;
        r.addEventListener('mousedown', (e) => e.preventDefault());
        r.addEventListener('click', () => pick(o));
        rows.set(o, r);
      });
    }
    scopeRef.st.layout = () => {
      const sr = ctx.stage.getBoundingClientRect();
      const tr = trigger.getBoundingClientRect();
      const avail = sr.bottom - tr.bottom - 4 - 12 - 50 - 12;
      maxRows = util.clamp(Math.floor(avail / rowH), 4, 8);
      list.style.maxHeight = maxRows * rowH + 'px';
    };
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => {
      if (t.open !== undefined) return scopeRef.req(trigger, 'trigger');
      if (t.field !== undefined) return scopeRef.req(input, 'search box');
      if (t.option !== undefined) return scopeRef.req(rows.get(t.option), `option ${t.option}`);
      return null;
    };
  }

  function buildChips(scopeRef, field, ctx) {
    const { util, spec, rng } = ctx;
    const wrap = util.el('div', '', field);
    wrap.style.position = 'relative';
    const boxEl = util.el('div', 'fp-chipbox', wrap);
    boxEl.dataset.role = 'chips';
    const chipsEl = util.el('div', '', boxEl);
    chipsEl.style.display = 'contents';
    const input = util.el('input', 'fp-chipin', boxEl);
    Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: rng.pick(['Add…', `Add ${spec.plural}…`, 'Type or pick']) });
    input.dataset.role = 'field';
    const pop = util.el('div', 'fp-pop fp-chippop', wrap);
    pop.style.top = 'calc(100% + 4px)';
    pop.dataset.role = 'listbox';
    const square = rng.bool(0.3);
    const rowH = rng.int(30, 33);
    const chipEls = new Map();
    const optEls = new Map();
    let key = '';
    let filter = '';
    let cols = 1;
    const shown = (m) => spec.options.filter((o) => !m.values.includes(o) && (!filter || o.toLowerCase().includes(filter)));
    boxEl.addEventListener('click', (e) => {
      if (e.target.closest('.fp-x')) return;
      if (!scopeRef.st.ctx.model.open) { scopeRef.set({ open: true }); show(); }
      input.focus();
    });
    input.addEventListener('input', () => { filter = input.value.trim().toLowerCase(); key = ''; if (!scopeRef.st.ctx.model.open) scopeRef.set({ open: true }); show(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { scopeRef.set({ open: false }); show(); } });
    scopeRef.st.outside = (e) => {
      if (scopeRef.st.ctx.model.open && !wrap.contains(e.target)) { scopeRef.set({ open: false }); show(); }
    };
    scopeRef.st.alive = () => wrap.isConnected;
    function show() {
      const m = scopeRef.st.ctx.model;
      const k = JSON.stringify([m.values, !!m.open, filter]);
      if (k === key) return;
      key = k;
      boxEl.classList.toggle('open', !!m.open);
      chipsEl.replaceChildren();
      chipEls.clear();
      for (const v of m.values) {
        const c = util.el('span', 'fp-chip' + (square ? ' sq' : ''), chipsEl);
        c.dataset.role = 'chip';
        util.el('span', '', c, v);
        const x = util.el('span', 'fp-x', c, '×');
        x.dataset.role = 'remove';
        x.setAttribute('aria-label', `Remove ${v}`);
        x.addEventListener('click', (e) => {
          e.stopPropagation();
          scopeRef.set({ values: scopeRef.st.ctx.model.values.filter((y) => y !== v) });
          show();
        });
        chipEls.set(v, x);
      }
      pop.hidden = !m.open;
      pop.replaceChildren();
      optEls.clear();
      if (!m.open) return;
      const list = shown(m);
      if (!list.length) { util.el('div', 'fp-msg', pop, filter ? 'No matches' : `All ${spec.plural} added`); return; }
      const per = Math.ceil(list.length / cols);
      pop.style.gridTemplateRows = `repeat(${per}, ${rowH}px)`;
      for (const o of list) {
        const r = util.el('div', 'fp-opt', pop);
        r.dataset.role = 'option';
        util.el('span', '', r, o);
        r.addEventListener('mousedown', (e) => e.preventDefault());
        r.addEventListener('click', () => {
          filter = '';
          input.value = '';
          scopeRef.set({ values: spec.options.filter((x) => x === o || scopeRef.st.ctx.model.values.includes(x)), open: true });
          show();
        });
        optEls.set(o, r);
      }
    }
    scopeRef.st.layout = () => {
      const sr = ctx.stage.getBoundingClientRect();
      const br = boxEl.getBoundingClientRect();
      const avail = sr.bottom - br.bottom - 70; // the box may grow by about two lines of chips
      cols = 1;
      while (cols < 4 && Math.ceil(spec.options.length / cols) * rowH > avail) cols++;
      const w = Math.min(sr.right - br.left - 12, Math.max(br.width, cols * 200));
      pop.style.right = 'auto';
      pop.style.width = w + 'px';
      pop.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    };
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => {
      if (t.remove !== undefined) return scopeRef.req(chipEls.get(t.remove), `chip ${t.remove}`);
      if (t.field !== undefined) return scopeRef.req(input, 'chips input');
      if (t.option !== undefined) return scopeRef.req(optEls.get(t.option), `option ${t.option}`);
      return null;
    };
  }

  function buildTags(scopeRef, field, ctx) {
    const { util, spec, rng } = ctx;
    const fam = scopeRef.env.taskDef.helpers;
    const wrap = util.el('div', 'fp-tags', field);
    wrap.style.position = 'relative';
    const boxEl = util.el('div', 'fp-chipbox', wrap);
    boxEl.dataset.role = 'tags';
    const chipsEl = util.el('div', '', boxEl);
    chipsEl.style.display = 'contents';
    const input = util.el('input', 'fp-chipin', boxEl);
    Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: spec.placeholder });
    input.dataset.role = 'field';
    const pop = util.el('div', 'fp-pop fp-chippop', wrap);
    pop.style.top = 'calc(100% + 4px)';
    pop.dataset.role = 'suggestions';
    const square = rng.bool(0.3);
    const rowH = rng.int(30, 33);
    const xEls = new Map();
    const sugEls = new Map();
    let moreEl = null;
    let key = '';
    let cols = 1;
    const add = (x) => {
      input.value = '';
      scopeRef.set({ values: scopeRef.st.ctx.model.values.concat(x), text: '', open: false, active: -1 });
      show();
    };
    boxEl.addEventListener('click', (e) => {
      if (e.target.closest('.fp-x, .fp-more')) return;
      input.focus();
    });
    input.addEventListener('input', () => {
      scopeRef.set({ text: input.value, open: input.value.trim() !== '', active: -1 });
      show();
    });
    input.addEventListener('keydown', (e) => {
      const m = scopeRef.st.ctx.model;
      if (e.key === 'Escape') { scopeRef.set({ open: false, active: -1 }); show(); return; }
      if (!m.open) return;
      const list = fam.tagSuggest(spec, m);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!list.length) return;
        const a = m.active ?? -1;
        scopeRef.set({ active: e.key === 'ArrowDown' ? Math.min(list.length - 1, a + 1) : Math.max(0, a - 1) });
        show();
      } else if (e.key === 'Enter' && m.active >= 0 && m.active < list.length) {
        e.preventDefault();
        add(list[m.active]);
      }
    });
    scopeRef.st.outside = (e) => {
      if (scopeRef.st.ctx.model.open && !wrap.contains(e.target)) { scopeRef.set({ open: false, active: -1 }); show(); }
    };
    scopeRef.st.alive = () => wrap.isConnected;
    function drawChips(values, expanded) {
      chipsEl.replaceChildren();
      xEls.clear();
      moreEl = null;
      const vis = expanded ? values : values.slice(0, spec.maxShow);
      for (const v of vis) {
        const c = util.el('span', 'fp-chip' + (square ? ' sq' : ''), chipsEl);
        c.dataset.role = 'chip';
        util.el('span', '', c, v);
        const x = util.el('span', 'fp-x', c, '×');
        x.dataset.role = 'remove';
        x.setAttribute('aria-label', `Remove ${v}`);
        x.addEventListener('click', (e) => {
          e.stopPropagation();
          scopeRef.set({ values: scopeRef.st.ctx.model.values.filter((y) => y !== v) });
          show();
        });
        xEls.set(v, x);
      }
      const extra = values.length - spec.maxShow;
      if (extra > 0) {
        moreEl = util.el('button', 'fp-chip fp-more' + (square ? ' sq' : ''), chipsEl, expanded ? 'Show less' : `+${extra} more`);
        moreEl.type = 'button';
        moreEl.dataset.role = 'more';
        moreEl.addEventListener('click', (e) => {
          e.stopPropagation();
          scopeRef.set({ expanded: !scopeRef.st.ctx.model.expanded });
          show();
        });
      }
    }
    function show() {
      const m = scopeRef.st.ctx.model;
      if (input.value !== m.text) input.value = m.text;
      const k = JSON.stringify([m.values, m.text, !!m.open, m.active, !!m.expanded]);
      if (k === key) return;
      key = k;
      boxEl.classList.toggle('open', !!m.open);
      drawChips(m.values, !!m.expanded);
      pop.hidden = !m.open;
      pop.replaceChildren();
      sugEls.clear();
      if (!m.open) return;
      const list = fam.tagSuggest(spec, m);
      if (!list.length) { util.el('div', 'fp-msg', pop, `No matches for “${m.text.trim()}”`); pop.style.gridTemplateRows = ''; return; }
      pop.style.gridTemplateRows = `repeat(${Math.ceil(list.length / cols)}, ${rowH}px)`;
      const typed = m.text.trim().length;
      list.forEach((x, i) => {
        const r = util.el('div', 'fp-opt' + (i === m.active ? ' active' : ''), pop);
        r.dataset.role = 'suggestion';
        const lab = util.el('span', '', r);
        util.el('span', 'fp-m', lab, x.slice(0, typed));
        lab.append(x.slice(typed));
        r.addEventListener('mousedown', (e) => e.preventDefault());
        r.addEventListener('click', () => add(x));
        sugEls.set(x, r);
      });
    }
    // Room for the worst case (every target plus three long extras, all expanded) so the card never resizes.
    scopeRef.st.reserve = () => {
      const extra = spec.options.filter((o) => !spec.targets.includes(o)).sort((a, b) => b.length - a.length).slice(0, 3);
      drawChips(spec.targets.concat(extra), true);
      boxEl.style.minHeight = Math.max(34, boxEl.offsetHeight) + 'px';
      key = '';
    };
    scopeRef.st.layout = () => {
      const sr = ctx.stage.getBoundingClientRect();
      const br = boxEl.getBoundingClientRect();
      const avail = sr.bottom - br.bottom - 4 - 12;
      cols = 1;
      while (cols < 3 && Math.ceil(fam.MAX_SUGGEST / cols) * rowH + 8 > avail) cols++;
      const w = Math.min(sr.right - br.left - 12, Math.max(br.width, cols * 190));
      pop.style.right = 'auto';
      pop.style.width = w + 'px';
      pop.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
      key = '';
    };
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => {
      if (t.remove !== undefined) return scopeRef.req(xEls.get(t.remove), `chip ${t.remove}`);
      if (t.field !== undefined) return scopeRef.req(input, 'tag input');
      if (t.more !== undefined) return scopeRef.req(moreEl, '"+N more" chip');
      if (t.suggestion !== undefined) return scopeRef.req(sugEls.get(t.suggestion), `suggestion ${t.suggestion}`);
      return null;
    };
  }

  env.template('choose-option/_base-search', () => ({ buildCombobox, buildChips, buildTags }));
})();
