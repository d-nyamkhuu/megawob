// choose-option/base: the base site's choose-option widgets (widgets, segmented, select2, dense) as a template. This
// file is their source. The design-* sites that started from a copy of them, and the composite sites that embed them,
// are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/choose-option.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/choose-option.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates".
(function () {
  const HTML = new URL('../../', document.currentScript.src);
  const UNITS = new Set(); // the part keys of the units below, recorded as they run (__has)
  let widgets = null;
  let parts = null;
  // Keep widget registrations visible to the static trait recorder; widget implementations live in the libraries.
  function registerWidgets(scopeRef) {
    scopeRef.env.widget({
      task: 'choose-option',
      site: 'base',
      name: 'widgets',
      split: 'train',
      scenarios: ['dropdown', 'radio', 'checkbox', 'autocomplete', 'listbox', 'grouped', 'combobox', 'chips', 'tags', 'toggles', 'tree', 'dependent', 'matrix'],

      render(ctx) {
        return scopeRef.renderCard(ctx, {});
      },

      locate(t) {
        const at = scopeRef.st.loc(t);
        if (!at) throw new Error(`choose-option/widgets cannot locate ${JSON.stringify(t)}`);
        return at;
      },
    });
  }

  function registerSegmented(scopeRef) {
    scopeRef.env.widget({
      task: 'choose-option',
      site: 'base',
      name: 'segmented',
      split: 'train',
      scenarios: ['dropdown', 'radio', 'checkbox', 'autocomplete', 'listbox'],

      render(ctx) {
        scopeRef.ensureStyle('fs-style', scopeRef.CSS2);
        const { util, rng, spec, size } = ctx;
        scopeRef.st2 = { ctx, spec, alive: () => false };
        const v = spec.scenario;
        const wrap = util.el('div', 'fs-wrap', ctx.stage);
        const panel = util.el('div', 'fs-panel', wrap);
        panel.dataset.role = 'form';
        const wide = v === 'checkbox' || v === 'radio';
        panel.style.width = Math.min(size.width - 40, rng.int(wide ? 600 : 540, wide ? 700 : 620)) + 'px';
        const head = util.el('div', 'fs-head', panel);
        util.el('b', '', head, spec.title);
        util.el('span', '', head, spec.note);
        const body = util.el('div', 'fs-body', panel);
        body.style.setProperty('--fs-lab', rng.int(120, 160) + 'px');
        util.el('div', 'fs-lab', body, spec.label);
        const cell = util.el('div', '', body);
        scopeRef.st2.foot = util.el('div', 'fs-foot', panel);

        if (v === 'dropdown') scopeRef.segDropdown(cell, ctx);
        else if (v === 'radio' || v === 'checkbox') scopeRef.segChoices(cell, ctx, v);
        else if (v === 'autocomplete') scopeRef.segAutocomplete(cell, ctx);
        else scopeRef.segListbox(cell, ctx);

        panel.style.height = panel.offsetHeight + 'px';
        // Placement: the palette sits low (its suggestions open upwards); others anywhere.
        const W = size.width;
        const H = size.height;
        const w = panel.offsetWidth;
        const h = panel.offsetHeight;
        const fx = rng.pick([0, 0.5, 0.5, 1, rng.float()]);
        const fy = v === 'autocomplete' ? rng.float(0.75, 1) : rng.pick([0.5, 0.5, 0, 1, rng.float()]);
        panel.style.left = Math.round(20 + fx * Math.max(0, W - w - 40)) + 'px';
        panel.style.top = Math.round(14 + fy * Math.max(0, H - h - 28)) + 'px';
        if (scopeRef.st2.layout) scopeRef.st2.layout();
        scopeRef.st2.show();
        return { anchors: [panel], sync: () => scopeRef.st2.show() };
      },

      locate(t) {
        const at = scopeRef.st2.loc(t);
        if (!at) throw new Error(`choose-option/segmented cannot locate ${JSON.stringify(t)}`);
        return at;
      },
    });
  }

  function registerExtra(scopeRef) {
    scopeRef.env.widget({
      task: 'choose-option',
      site: 'base',
      name: 'select2',
      split: 'train',
      scenarios: ['combobox', 'chips', 'tags'],

      render(ctx) {
        return scopeRef.renderCard(ctx, { cls: 's2', combo: { clear: true } });
      },

      locate(t) {
        const at = scopeRef.st.loc(t);
        if (!at) throw new Error(`choose-option/select2 cannot locate ${JSON.stringify(t)}`);
        return at;
      },
    });

    scopeRef.env.widget({
      task: 'choose-option',
      site: 'base',
      name: 'dense',
      split: 'train',
      scenarios: ['checkbox', 'radio'],
      traits: { grid: true },

      render(ctx) {
        scopeRef.ensureStyle('fp-style', scopeRef.CSS);
        scopeRef.ensureStyle('fp3-style', scopeRef.CSS3);
        const { util, rng, spec, size } = ctx;
        scopeRef.st = { ctx, spec, alive: () => false };
        const kind = spec.scenario;
        const multi = kind === 'checkbox';
        const wrap = util.el('div', 'fp-wrap', ctx.stage);
        const card = util.el('div', 'dn-card', wrap);
        card.dataset.role = 'form';
        const W = Math.min(size.width - 32, rng.int(560, 720));
        card.style.width = W + 'px';
        const bar = util.el('div', 'dn-bar', card);
        util.el('span', '', bar, spec.title);
        const count = util.el('span', 'n', bar, '');
        const body = util.el('div', 'dn-body', card);
        util.el('div', 'dn-sub', body, spec.note);
        const lab = util.el('div', 'dn-lab', body, spec.label);
        if (multi) {
          const clear = util.el('span', 'dn-link', lab, 'Clear all');
          clear.addEventListener('click', () => { scopeRef.set({ values: [] }); show(); });
        }
        const n = spec.options.length;
        const longest = Math.max(...spec.options.map((o) => o.length));
        const fit = Math.max(1, Math.floor((W - 24) / (longest * 6.6 + 40)));
        const cols = multi ? Math.max(2, Math.min(n > 20 ? 5 : n > 15 ? 4 : 3, fit, 5)) : (spec.details ? 1 : n > 4 && fit >= 2 ? 2 : 1);
        const rowsN = Math.ceil(n / cols);
        const room = size.height - 24 - 46 - 76 - 26;
        const rowH = util.clamp(Math.floor(room / rowsN), 20, rng.int(24, 27));
        card.style.setProperty('--dn-row', rowH + 'px');
        const grid = util.el('div', 'dn-grid', body);
        grid.dataset.role = multi ? 'group' : 'radiogroup';
        grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        if (rng.bool(0.5)) { grid.style.gridAutoFlow = 'column'; grid.style.gridTemplateRows = `repeat(${rowsN}, ${rowH}px)`; }
        const name = `dn-${kind}-${rng.int(0, 1e6)}`;
        const inputs = [];
        const cells = {};
        for (const o of spec.options) {
          const cell = util.el('label', 'dn-cell', grid);
          cell.dataset.role = 'option';
          cell.title = o;
          const inp = util.el('input', '', cell);
          inp.type = kind;
          inp.name = name;
          inp.value = o;
          util.el('span', '', cell, o);
          if (spec.details && spec.details[o]) util.el('span', 'fp-det', cell, spec.details[o]);
          inputs.push([o, inp]);
          cells[o] = cell;
        }
        const foot = util.el('div', 'dn-foot', body);
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
          for (const o of spec.options) cells[o].classList.toggle('on', multi ? m.values.includes(o) : m.value === o);
          count.textContent = multi ? `${m.values.length} / ${n} selected` : '';
          foot.textContent = multi ? (m.values.length ? m.values.join(', ') : 'Nothing selected') : (m.value ? `Selected: ${m.value}` : 'No option selected');
        }
        scopeRef.st.show = show;
        scopeRef.st.loc = (t) => (t.option !== undefined ? ch.locate(t.option) : null);
        card.style.height = card.offsetHeight + 'px';
        scopeRef.place(card, ctx, false);
        show();
        return { anchors: [card], sync: show };
      },

      locate(t) {
        const at = scopeRef.st.loc(t);
        if (!at) throw new Error(`choose-option/dense cannot locate ${JSON.stringify(t)}`);
        return at;
      },
    });
  }

  function reference(site, __parts) {
    const captured = [];
    let scopeNow = null;
    const __has = (key) => { UNITS.add(key); return key in __parts; };
    const env = new Proxy(window.env, {
      get: (t, k) => (k === 'widget' ? (d) => {
        for (const key of Object.keys(__parts)) {
          const dot = key.indexOf('.');
          if (!key.startsWith('stmt') && !key.startsWith('+') && dot > 0 && key.slice(0, dot) === d.name) d[key.slice(dot + 1)] = __parts[key](d[key.slice(dot + 1)], scopeNow);
        }
        captured.push(d);
      } : Reflect.get(t, k)),
    });
    const scriptOf = { src: new URL(`sites/${site}/widgets/choose-option.js`, HTML).href };
    /*
     * reference / choose-option / widgets: one form card with a single picking widget, placed at a sampled position
     * inside the stage (sized from ctx.size).
     *   dropdown      div trigger + absolutely positioned option list (all options fit: the row height comes from
     *                 the room below the trigger, and the list splits into 2-3 columns when it would not fit);
     *                 click outside or Escape closes it; keyboard: Enter/Space/ArrowDown opens, arrows, Enter
     *   radio         native radio inputs (plain rows or bordered tiles, 1-2 columns); criterion groups show
     *                 price and delivery time under each option
     *   checkbox      native checkboxes (plain rows or bordered tiles, 1-2 columns)
     *   autocomplete  text input; every input event shows the matching suggestions below it (after spec.latency
     *                 ms of "Searching..." on the task clock) or "No results"; clicking a suggestion or arrows +
     *                 Enter commits it; blur, Escape or clicking elsewhere hides the list
     *   listbox       fixed-height list with the native scrollbar hidden and a custom track + thumb beside it:
     *                 drag the thumb, click the track to page, or wheel inside the list (the wheel scrolls by its
     *                 delta immediately, no smooth scrolling). Clicks select (single) or toggle (multi)
     *   grouped       a select whose popup lists group headers and options (disabled ones greyed with a badge),
     *                 spec.rows rows tall, with its own wheel handling and a custom scrollbar (thumb + track)
     *   combobox      a select whose popup has a search box on top (focused on open) and the filtered options;
     *                 the first match is highlighted after typing; arrows + Enter or a click picks
     *   chips         a box with one chip per chosen option (x removes) and an "Add" input; a click on the box
     *                 opens the remaining options in a grid (typing filters them); the list stays open
     *   tags          chips (x removes) plus a text field; typing lists the matching unchosen options below it, a click
     *                 or ArrowDown + Enter adds one; only spec.maxShow chips show, the rest hide behind a "+N more"
     *                 chip that expands them (a "Show less" chip folds them again); the chip box reserves room for
     *                 the worst case, so the card never changes size
     *   toggles       settings rows (label, description, switch); native checkbox switches or custom buttons
     *   tree          groups with a tri-state parent checkbox (native, .indeterminate) or Select all / Clear links,
     *                 children indented below; several groups sit in columns
     *   matrix        a Likert grid: one row per statement, one native radio per scale column under the column headers
     *                 (header row on top, zebra rows); the plan clicks { cell: [row, column] }
     *   dependent     Country and City selects; the city select is disabled until a country is chosen and its
     *                 option list is rebuilt (and the city cleared) when the country changes
     * The card's box never changes during an episode (it is the anchor); popups are overlays.
     * Mechanics: env.ui (kit/ui/form.js) dropdown, choices, listbox (+ scrollbar); the autocomplete, grouped,
     * combobox, chips, toggles and tree mechanics are local to this file (the kit primitives have no loading
     * state, groups or chips). A second widget, `segmented`, covers the five original scenarios with a different
     * design; a third, `select2`, restyles the searchable select (search box inside the popup, clear x), chips and
     * tags as a jQuery-plugin-like form; a fourth, `dense`, is an enterprise filter panel with a dense grid of
     * small native checkboxes in 3-5 columns (trait grid) and compact native radios.
     */
    const values = {};
    const __scope = { get env() { return env; }, get scriptOf() { return scriptOf; } };
    for (const key of ["CSS","CSS3","CHEV","TICK","SEARCH","OK","BOXTICK","center","req","set","CSS_MX","WIDTH","POPUP","CSS2","set2","st","st2","ensureStyle","wheelPane","acCtl","place","buildSelect","buildDropdown","buildDependent","buildMatrix","buildChoices","buildAutocomplete","buildListbox","buildGrouped","buildCombobox","buildChips","buildTags","buildToggles","buildTree","renderCard","foot2","segDropdown","segChoices","segAutocomplete","segListbox"]) {
      UNITS.add(key);
      Object.defineProperty(__scope, key, {
        enumerable: true, configurable: true,
        get() {
          if (!(key in values)) throw new ReferenceError(`Cannot access '${key}' before initialization`);
          return values[key];
        },
        ...(["st","st2"].includes(key) ? { set(v) {
          if (!(key in values)) throw new ReferenceError(`Cannot access '${key}' before initialization`);
          values[key] = v;
        } } : {}),
      });
    }
    UNITS.add('stmt0.0');
    for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
      let v; let built = false;
      Object.defineProperty(__scope, k.slice(3), {
        get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
        set: (x) => { built = true; v = x; },
      });
    }
    scopeNow = __scope;
    for (const name of ["ensureStyle","wheelPane","acCtl","place","buildSelect","buildDropdown","buildDependent","buildMatrix","buildChoices","buildAutocomplete"]) {
      values[name] = env.templateLib('choose-option/_base-controls')[name].bind(null, __scope);
    }
    for (const name of ["buildListbox","buildGrouped"]) {
      values[name] = env.templateLib('choose-option/_base-lists')[name].bind(null, __scope);
    }
    for (const name of ["buildCombobox","buildChips","buildTags"]) {
      values[name] = env.templateLib('choose-option/_base-search')[name].bind(null, __scope);
    }
    for (const name of ["buildToggles","buildTree","renderCard"]) {
      values[name] = env.templateLib('choose-option/_base-settings')[name].bind(null, __scope);
    }
    for (const name of ["foot2","segDropdown","segChoices","segAutocomplete","segListbox"]) {
      values[name] = env.templateLib('choose-option/_base-segmented')[name].bind(null, __scope);
    }
    for (const name of ["ensureStyle","wheelPane","acCtl","place","buildSelect","buildDropdown","buildDependent","buildMatrix","buildChoices","buildAutocomplete","buildListbox","buildGrouped","buildCombobox","buildChips","buildTags","buildToggles","buildTree","renderCard","foot2","segDropdown","segChoices","segAutocomplete","segListbox"]) {
      if (__has(name)) values[name] = __parts[name](values[name], __scope);
    }
    const set = (key, value) => { values[key] = value; };
    env.templateLib('choose-option/_base-frame').initialize(__scope, set, __has, __parts);
    registerWidgets(__scope);
    env.templateLib('choose-option/_base-segmented-init').initialize(__scope, set, __has, __parts);
    registerSegmented(__scope);
    registerExtra(__scope);

    return captured;
  }
  env.template('choose-option/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`choose-option/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('choose-option/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`choose-option/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`choose-option/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['choose-option/_styles', 'choose-option/_base-controls', 'choose-option/_base-lists', 'choose-option/_base-search', 'choose-option/_base-settings', 'choose-option/_base-segmented', 'choose-option/_base-frame', 'choose-option/_base-segmented-init'] });
})();
