/* choose-option/_base-segmented: base widget implementations.
 * reference.js retains their part hooks; scopeRef reads the live, overridable reference scope.
 */
(function () {
  'use strict';

  function foot2(scopeRef) {
    const { spec, util } = scopeRef.st2.ctx;
    const m = scopeRef.st2.ctx.model;
    const v = spec.scenario;
    const got = v === 'checkbox' || v === 'listbox' ? m.values.join(', ') : m.value;
    scopeRef.st2.foot.replaceChildren(`${spec.noun} = `);
    if (got) util.el('b', '', scopeRef.st2.foot, got);
    else scopeRef.st2.foot.append('(none)');
  }

  function segDropdown(scopeRef, cell, ctx) {
    const { util, spec, rng } = ctx;
    const trigger = util.el('div', 'fs-picker', cell);
    trigger.dataset.role = 'trigger';
    trigger.tabIndex = 0;
    const val = util.el('span', '', trigger);
    util.el('span', 'go', trigger, '›');
    const scrim = util.el('div', 'fs-scrim', ctx.stage);
    const sheet = util.el('div', 'fs-sheet', ctx.stage);
    sheet.dataset.role = 'listbox';
    util.el('div', 'fs-grab', sheet);
    util.el('h3', '', sheet, spec.placeholder);
    const tiles = util.el('div', 'fs-tiles', sheet);
    const longest = Math.max(...spec.options.map((o) => o.length));
    const cols = longest > 18 ? 2 : spec.options.length <= 6 ? 2 : rng.pick([3, 3, 4]);
    tiles.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    const els = spec.options.map((o) => {
      const t = util.el('div', 'fs-tile', tiles, o);
      t.dataset.role = 'option';
      return [o, t];
    });
    const dd = scopeRef.env.ui.dropdown(trigger, sheet, {
      label: 'sheet',
      keyboard: true,
      open: !!ctx.model.open,
      value: ctx.model.value || null,
      options: els,
      show(pop, open) { pop.hidden = !open; scrim.hidden = !open; },
      onActive: () => show(),
      onChange(o) { scopeRef.set2({ value: o, open: false }); show(); },
      onOpenChange(open) { if (!!scopeRef.st2.ctx.model.open !== open) scopeRef.set2({ open }); show(); },
    });
    function show() {
      const m = scopeRef.st2.ctx.model;
      dd.set({ open: !!m.open, value: m.value || null });
      val.className = m.value ? '' : 'ph';
      val.textContent = m.value || spec.placeholder;
      for (const [o, t] of els) {
        t.classList.toggle('sel', o === m.value);
        t.classList.toggle('active', o === dd.active());
      }
      scopeRef.foot2();
    }
    scopeRef.st2.show = show;
    scopeRef.st2.loc = (t) => (t.open !== undefined ? dd.locateTrigger() : t.option !== undefined ? dd.locateOption(t.option) : null);
  }

  function segChoices(scopeRef, cell, ctx, kind) {
    const { util, spec } = ctx;
    const multi = kind === 'checkbox';
    const group = util.el('div', multi ? 'fs-chips' : 'fs-seg', cell);
    group.dataset.role = multi ? 'group' : 'radiogroup';
    const els = spec.options.map((o) => {
      const b = util.el('div', multi ? 'fs-chip' : 'fs-segbtn', group, o);
      if (!multi && spec.details && spec.details[o]) util.el('small', '', b, spec.details[o]);
      b.dataset.role = 'option';
      b.setAttribute('role', multi ? 'checkbox' : 'radio');
      b.tabIndex = 0;
      return [o, b];
    });
    const ch = scopeRef.env.ui.choices(els, {
      label: kind,
      multi,
      keyboard: true,
      value: ctx.model.value,
      values: ctx.model.values,
      onChange(v) { scopeRef.set2(multi ? { values: v } : { value: v }); show(); },
    });
    function show() {
      const m = scopeRef.st2.ctx.model;
      ch.set(multi ? m.values : m.value);
      scopeRef.foot2();
    }
    scopeRef.st2.show = show;
    scopeRef.st2.loc = (t) => (t.option !== undefined ? ch.locate(t.option) : null);
  }

  function segAutocomplete(scopeRef, cell, ctx) {
    const { util, spec } = ctx;
    const box = util.el('div', 'fs-cmdbox', cell);
    const ctl = util.el('div', 'fs-cmd', box);
    util.el('span', 'pr', ctl, '>');
    const input = util.el('input', '', ctl);
    Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: spec.placeholder });
    input.dataset.role = 'field';
    util.el('span', 'ok', ctl, 'OK');
    const pop = util.el('div', 'fs-sugg', box);
    pop.dataset.role = 'suggestions';
    const ac = scopeRef.acCtl({
      input, pop, s: scopeRef.st2, spec, set: scopeRef.set2,
      // Layout is the widget's call: open upwards when the suggestions fit above the field.
      show(open) {
        pop.hidden = !open;
        if (!open) return;
        pop.classList.remove('up', 'down');
        const above = ctl.getBoundingClientRect().top - ctx.stage.getBoundingClientRect().top - 12;
        pop.classList.add((spec.maxSuggest || 8) * 30 + 10 <= above ? 'up' : 'down');
      },
      row(x, active, typed) {
        const r = util.el('div', 'fs-sg' + (active ? ' active' : ''), pop);
        const lab = util.el('span', '', r);
        util.el('u', '', lab, x.slice(0, typed.length));
        lab.append(x.slice(typed.length));
        util.el('span', 'k', r, '↵');
        return r;
      },
      msg(kind, text) {
        util.el('div', 'fs-sgmsg', pop, kind === 'loading' ? '… searching' : `0 matches for "${text}"`);
      },
    });
    function show() {
      ac.paint();
      box.classList.toggle('committed', !!scopeRef.st2.ctx.model.value);
      scopeRef.foot2();
    }
    scopeRef.st2.show = show;
    scopeRef.st2.loc = (t) => (t.field !== undefined ? ac.locateInput() : t.suggestion !== undefined ? ac.locateSuggestion(t.suggestion) : null);
  }

  function segListbox(scopeRef, cell, ctx) {
    const { util, spec, rng } = ctx;
    const rowH = rng.int(24, 27);
    const tbl = util.el('div', 'fs-tbl', cell);
    const head = util.el('div', 'fs-thead', tbl);
    util.el('span', '', head, spec.multi ? '☑' : '#');
    util.el('span', '', head, spec.noun);
    util.el('span', 'c', head, 'code');
    const main = util.el('div', 'fs-tmain', tbl);
    const rail = util.el('div', 'fs-rail', main);
    rail.dataset.role = 'scrollbar';
    const knob = util.el('div', 'fs-knob', rail);
    knob.dataset.role = 'thumb';
    const body = util.el('div', 'fs-tbody', main);
    body.dataset.role = 'listbox';
    body.style.height = spec.rows * rowH + 'px';
    const rows = spec.options.map((o, i) => {
      const r = util.el('div', 'fs-tr', body);
      r.dataset.role = 'option';
      r.style.height = rowH + 'px';
      util.el('span', 'n', r, spec.multi ? '☐' : String(i + 1).padStart(2, '0'));
      util.el('span', 'nm', r, o);
      util.el('span', 'c', r, o.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase());
      return [o, r];
    });
    const mirror = (i) => {
      const s = Math.round(i * 1000) / 1000;
      if (s !== scopeRef.st2.ctx.model.scroll) scopeRef.set2({ scroll: s });
    };
    const lbx = scopeRef.env.ui.listbox(body, {
      label: 'table',
      multi: spec.multi,
      values: ctx.model.values,
      options: rows,
      onChange(values) { scopeRef.set2({ values }); show(); },
      onScroll: mirror,
      scrollbar: { track: rail, thumb: knob, pad: 1, minThumb: 18, onDrag: (on) => knob.classList.toggle('dragging', on) },
    });
    scopeRef.wheelPane(body, () => { lbx.refresh(); mirror(lbx.scrollIndex()); });
    function show() {
      const m = scopeRef.st2.ctx.model;
      lbx.set({ values: m.values });
      for (const [o, r] of rows) {
        const on = m.values.includes(o);
        r.classList.toggle('sel', on);
        if (spec.multi) r.firstChild.textContent = on ? '☑' : '☐';
      }
      scopeRef.foot2();
    }
    lbx.set({ scroll: ctx.model.scroll || 0 });
    scopeRef.st2.layout = () => {
      const px = rows[1][1].offsetTop - rows[0][1].offsetTop;
      if (px > 0 && px !== scopeRef.st2.ctx.model.px) scopeRef.set2({ px });
    };
    scopeRef.st2.show = show;
    scopeRef.st2.loc = (t) => {
      if (t.option !== undefined) return lbx.locateOption(t.option);
      if (t.thumb !== undefined) return lbx.locateThumb();
      if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
      if (t.list !== undefined) return scopeRef.center(body);
      return null;
    };
  }

  env.template('choose-option/_base-segmented', () => ({ foot2, segDropdown, segChoices, segAutocomplete, segListbox }));
})();
