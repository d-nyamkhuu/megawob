// type-text/base: the base site's type-text widgets (fields) as a template. This file is their source. The
// design-* sites that started from a copy of them, and the composite sites that embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/type-text.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/type-text.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/type-text.js`, HTML).href };
    /*
     * reference / type-text / fields: a form card with native <input type=text|password> and <textarea>
     * elements. Per seed: label style (above, inline left, two columns, floating label inside the field, or
     * placeholder-only labels when every field starts empty), field widths, heights, radii, underline vs boxed
     * inputs, disabled look (greyed or subtle), and the card's position inside the stage (sampled within the
     * stage rectangle, so it never leaves it whatever frame the site draws around the stage).
     * Fields are bound with env.ui.textField (masks for phone / card numbers, maxLength with a counter drawn
     * inside the field). Forms with an in-app save (spec.save) have a submit button inside the <form>: a click
     * or Enter in a one-line field runs the task's validate(); errors show in a fixed-height slot under each
     * field and a status line next to the button, so nothing moves when they appear. The focused field is
     * mirrored into model.focus (the Tab route of the oracle reads it). Long forms (spec.long) scroll the page.
     *
     * Scenario-specific parts:
     *   sections   spec.panes 'tabs': a tab strip (env.ui.tabs) over panes stacked in one grid cell (hidden panes
     *              are visibility:hidden, so switching never moves anything and Tab skips them); 'accordion':
     *              exclusive collapsible sections (env.ui.collapsible) in a box whose min-height is the tallest
     *              open state. The open tab/section is mirrored into model.section; plan target { section: k }
     *              is the tab / header. A tab or header whose fields have save errors shows a red dot.
     *   complete   required fields carry a "*", optional ones "(optional)"; with spec.source 'card' a profile
     *              card (spec.profile) sits beside the form (left or right) or above it when the stage is narrow.
     * Widget mode autofocus (about a third of the episodes, drawn from ctx.rng.fork('autofocus') so the other
     * layout draws of a seed are unchanged): after layout the first enabled field (the first field with an
     * error, in error forms; the first field of the open pane in sections) gets focus, like an autofocus
     * attribute, and model.focus mirrors it, so typing without a click goes into that field.
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get SUBTITLES() { return SUBTITLES; },
        get st() { return st; }, set st(v) { st = v; },
        get stageBox() { return stageBox; },
        get ensureStyle() { return ensureStyle; },
        get update() { return update; },
        get paint() { return paint; },
        get doSave() { return doSave; },
        get addField() { return addField; },
        get buildSections() { return buildSections; },
        get buildProfile() { return buildProfile; },
        get build() { return build; },
        get autofocus() { return autofocus; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('stageBox')) stageBox = __parts['stageBox'](stageBox, __scope);
      if (__has('ensureStyle')) ensureStyle = __parts['ensureStyle'](ensureStyle, __scope);
      if (__has('update')) update = __parts['update'](update, __scope);
      if (__has('paint')) paint = __parts['paint'](paint, __scope);
      if (__has('doSave')) doSave = __parts['doSave'](doSave, __scope);
      if (__has('addField')) addField = __parts['addField'](addField, __scope);
      if (__has('buildSections')) buildSections = __parts['buildSections'](buildSections, __scope);
      if (__has('buildProfile')) buildProfile = __parts['buildProfile'](buildProfile, __scope);
      if (__has('build')) build = __parts['build'](build, __scope);
      if (__has('autofocus')) autofocus = __parts['autofocus'](autofocus, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (`
      .ft-card {
        flex: none; position: relative; padding: var(--ft-pad) calc(var(--ft-pad) + 4px);
        border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
        box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 18px rgba(0,0,0,.06);
      }
      .ft-card.flat { box-shadow: none; border-radius: 6px; }
      .ft-card h2 { margin: 0 0 4px; font-size: 21px; font-weight: 700; letter-spacing: -.01em; }
      .ft-sub { margin: 0 0 16px; color: var(--muted); font-size: 14px; }
      .ft-card.ruled h2 { padding-bottom: 10px; margin-bottom: 16px; border-bottom: 1px solid var(--line); }
      .ft-card.ruled .ft-sub { margin-top: -8px; }
      .ft-grid { display: grid; column-gap: 22px; row-gap: var(--ft-gap); align-items: center; }
      .ft-grid.stacked, .ft-grid.floating, .ft-grid.placeholder { grid-template-columns: var(--ft-w); }
      .ft-grid.columns { grid-template-columns: var(--ft-w) var(--ft-w); align-items: start; }
      .ft-grid.columns .ft-wide { grid-column: 1 / -1; }
      .ft-grid.inline { grid-template-columns: max-content var(--ft-w); column-gap: 16px; }
      .ft-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
      .ft-grid.inline .ft-field { display: contents; }
      .ft-label { font-size: 14px; font-weight: 600; color: var(--fg); }
      .ft-grid.inline .ft-label { text-align: var(--ft-align); align-self: start; padding-top: calc(var(--ft-h) / 2 - 9px); }
      .ft-label.caps { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
      .ft-inwrap { position: relative; min-width: 0; }
      .ft-input {
        display: block; width: 100%; height: var(--ft-h); padding: 0 12px; margin: 0;
        border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: var(--ft-r);
        background: color-mix(in srgb, var(--panel) 70%, var(--bg)); color: var(--fg);
        font: inherit; font-size: var(--ft-fs); outline: none;
        user-select: text; -webkit-user-select: text; caret-color: var(--accent);
      }
      textarea.ft-input { height: auto; padding: 9px 12px; line-height: 1.35; resize: none; }
      .ft-input.counted { padding-right: 64px; }
      textarea.ft-input.counted { padding-right: 12px; padding-bottom: 22px; }
      .ft-input.underline { border-width: 0 0 2px; border-radius: 0; background: transparent; padding-left: 2px; padding-right: 2px; }
      .ft-input::placeholder { color: var(--muted); opacity: .75; }
      .ft-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
      .ft-input.underline:focus { box-shadow: none; }
      .ft-input[type=password] { letter-spacing: .12em; }
      .ft-input:disabled { cursor: not-allowed; }
      .ft-card.dis-grey .ft-input:disabled { background: color-mix(in srgb, var(--muted) 14%, var(--panel)); color: var(--muted); border-style: dashed; }
      .ft-card.dis-subtle .ft-input:disabled { color: color-mix(in srgb, var(--fg) 70%, var(--muted)); opacity: .9; }
      .ft-input.bad { border-color: #d6336c; }
      .ft-count { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--muted); pointer-events: none; font-variant-numeric: tabular-nums; }
      .ft-inwrap.ta .ft-count { top: auto; bottom: 6px; transform: none; }
      .ft-count.full { color: #d6336c; font-weight: 600; }
      .ft-err { height: 16px; margin-top: -3px; font-size: 12.5px; line-height: 16px; color: #d6336c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .ft-grid.inline .ft-err { grid-column: 2; margin-top: calc(-1 * var(--ft-gap) + 2px); }
      .ft-hint { font-size: 12.5px; color: var(--muted); }
      .ft-grid.inline .ft-hint { grid-column: 2; margin-top: calc(-1 * var(--ft-gap) + 4px); }

      /* floating labels: the label sits inside the field and moves to its top edge when focused or filled */
      .ft-grid.floating .ft-field { gap: 0; }
      .ft-grid.floating .ft-input { height: calc(var(--ft-h) + 10px); padding-top: 14px; }
      .ft-grid.floating textarea.ft-input { padding-top: 22px; }
      .ft-grid.floating .ft-label {
        position: absolute; left: 13px; top: 50%; transform: translateY(-50%); z-index: 1; pointer-events: none;
        font-weight: 500; color: var(--muted); font-size: var(--ft-fs);
      }
      .ft-grid.floating .ft-inwrap.ta .ft-label { top: 18px; }
      .ft-grid.floating .ft-input:focus + .ft-label, .ft-grid.floating .ft-input:not(:placeholder-shown) + .ft-label,
      .ft-grid.floating .ft-input:disabled + .ft-label {
        top: 12px; font-size: 11.5px; font-weight: 600; letter-spacing: .02em;
      }
      .ft-grid.floating .ft-inwrap.ta .ft-input:focus + .ft-label, .ft-grid.floating .ft-inwrap.ta .ft-input:not(:placeholder-shown) + .ft-label { top: 10px; }
      .ft-grid.floating .ft-input:focus + .ft-label { color: var(--accent); }

      .ft-actions { display: flex; align-items: center; gap: 14px; margin-top: 16px; min-width: 0; }
      .ft-actions.right { flex-direction: row-reverse; }
      .ft-save {
        flex: none; height: 38px; padding: 0 18px; border: 0; border-radius: var(--ft-r); cursor: pointer;
        font: inherit; font-size: 15px; font-weight: 600; color: #fff; background: var(--accent);
      }
      .ft-save.ghost { background: transparent; color: var(--accent); border: 1.5px solid var(--accent); }
      .ft-status { flex: 1; min-width: 0; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--muted); }
      .ft-actions.right .ft-status { text-align: right; }
      .ft-status.ok { color: #2b8a3e; font-weight: 600; }
      .ft-status.bad { color: #d6336c; font-weight: 600; }
      .ft-foot { display: flex; justify-content: space-between; margin-top: 14px; font-size: 13.5px; color: var(--muted); }
      .ft-foot .ft-link { color: var(--accent); }
      .ft-req { color: #d6336c; margin-left: 2px; }
      .ft-opt { color: var(--muted); font-weight: 400; }

      /* sections: tabs over stacked panes, or an exclusive accordion */
      .ft-tabs { display: flex; gap: 2px; margin: 0 0 14px; border-bottom: 1px solid var(--line); }
      .ft-tabs.pills { border-bottom: 0; gap: 6px; }
      .ft-tab {
        position: relative; padding: 8px 14px; margin: 0 0 -1px; border: 1px solid transparent; border-bottom: 0;
        border-radius: 7px 7px 0 0; background: transparent; color: var(--muted); font: inherit; font-size: 14px;
        cursor: pointer; white-space: nowrap;
      }
      .ft-tab[aria-selected="true"] { color: var(--fg); font-weight: 600; border-color: var(--line); background: var(--panel); }
      .ft-tabs.pills .ft-tab { margin: 0; border: 1px solid var(--line); border-radius: 999px; padding: 6px 14px; }
      .ft-tabs.pills .ft-tab[aria-selected="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
      .ft-tabs.under .ft-tab { border: 0; border-radius: 0; border-bottom: 2px solid transparent; }
      .ft-tabs.under .ft-tab[aria-selected="true"] { background: transparent; border-bottom-color: var(--accent); }
      .ft-tab.err::after, .ft-acc-h.err::after {
        content: ''; position: absolute; top: 6px; right: 5px; width: 7px; height: 7px; border-radius: 50%; background: #d6336c;
      }
      .ft-panes { display: grid; }
      .ft-pane { grid-area: 1 / 1; }
      .ft-pane.off { visibility: hidden; }
      .ft-acc { display: flex; flex-direction: column; gap: 6px; }
      .ft-acc-sec { border: 1px solid var(--line); border-radius: var(--ft-r); }
      .ft-acc-h {
        position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%;
        padding: 9px 14px; border: 0; background: color-mix(in srgb, var(--muted) 7%, var(--panel)); color: var(--fg);
        font: inherit; font-size: 14.5px; font-weight: 600; text-align: left; cursor: pointer; border-radius: var(--ft-r);
      }
      .ft-acc-h .chev { color: var(--muted); font-size: 12px; margin-left: 12px; }
      .ft-acc-h .cnt { color: var(--muted); font-weight: 400; font-size: 13px; margin-left: auto; }
      .ft-acc-b { padding: 12px 14px 4px; }
      .ft-acc-b[hidden] { display: none; }

      /* complete: the record the form is filled from */
      .ft-wrap { display: flex; align-items: flex-start; gap: 20px; }
      .ft-wrap.left { flex-direction: row-reverse; }
      .ft-wrap.top { flex-direction: column; align-items: stretch; gap: 14px; }
      .ft-profile {
        flex: none; width: var(--ft-pw); box-sizing: border-box; padding: 16px 18px; border: 1px solid var(--line);
        border-radius: 10px; background: color-mix(in srgb, var(--accent) 5%, var(--panel)); font-size: 13.5px;
      }
      .ft-wrap.top .ft-profile { width: auto; padding: 12px 16px; }
      .ft-profile-h { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-weight: 700; font-size: 15px; }
      .ft-avatar {
        flex: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center;
        background: var(--accent); color: #fff; font-size: 13px; font-weight: 700; letter-spacing: .03em;
      }
      .ft-profile dl { margin: 0; display: grid; grid-template-columns: 1fr; row-gap: 7px; }
      .ft-wrap.top .ft-profile dl { grid-template-columns: repeat(var(--ft-pcols), minmax(0, 1fr)); column-gap: 18px; }
      .ft-profile dt { font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; }
      .ft-profile dd { margin: 1px 0 0; color: var(--fg); overflow-wrap: anywhere; }
      `);

      let st = __has('st') ? __parts['st'](undefined, __scope) : (null); // { ctx, spec, fam, host, card, inputs: {id: {w, el, counter, err}}, save, status }

      // The stage box. A scrollable page's stage can shrink to its content (flex: none) and report width 0
      // before anything is drawn; then measure the free space of its row and give the widget a host of that
      // width, so the stage takes it.
      function stageBox(ctx) {
        let { width, height } = ctx.size;
        let host = ctx.stage;
        if (width < 240 && ctx.stage.parentElement) {
          const p = ctx.stage.parentElement;
          width = p.clientWidth;
          for (const c of p.children) {
            if (c === ctx.stage) continue;
            const cs = getComputedStyle(c);
            width -= c.getBoundingClientRect().width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
          }
          width -= 8; // room for a page scrollbar
          host = ctx.util.el('div', '', ctx.stage);
          host.style.cssText = `width:${Math.floor(width)}px;display:flex;align-items:flex-start;justify-content:center;`;
        }
        if (height < 240) height = Math.max(240, window.innerHeight - ctx.stage.getBoundingClientRect().top);
        return { width, height, host };
      }

      function ensureStyle() {
        if (document.getElementById('ft-style')) return;
        const s = document.createElement('style');
        s.id = 'ft-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      const SUBTITLES = __has('SUBTITLES') ? __parts['SUBTITLES'](undefined, __scope) : ({
        single: ['Fill in the field below.', 'Text is case sensitive.', ''],
        transform: ['Text is case sensitive.', 'Mind the exact spelling.', ''],
        password: ['Use letters, numbers and symbols.', 'Both entries must match.', ''],
        login: ['Use your account credentials.', 'Enter your details to continue.', ''],
        multi: ['Please check your entries.', 'All information is kept private.', ''],
        textarea: ['Line breaks are kept.', 'We will print this on the label.', ''],
        copy: ['Please review before continuing.', 'Required fields are marked.', ''],
        'validation-fix': ['Your changes have not been saved.', 'Please review the highlighted field.', ''],
        sections: ['Manage your account details.', 'Changes apply to all devices.', ''],
        complete: ['Fields marked * are required.', 'Please complete all required fields.', ''],
      });

      // ---------------------------------------------------------------- model updates

      function update(patch) {
        st.ctx.update({ ...st.ctx.model, ...patch });
        paint(st.ctx.model);
      }

      function paint(m) {
        for (const [id, x] of Object.entries(st.inputs)) {
          if (x.counter) {
            const n = st.fam.helpers.countOf(x.f, m.fields[id]);
            x.counter.textContent = `${n}/${x.f.maxLength}`;
            x.counter.classList.toggle('full', n >= x.f.maxLength);
          }
          if (x.err) {
            const msg = (m.errors || {})[id] || '';
            x.err.textContent = msg;
            x.el.classList.toggle('bad', !!msg);
          }
        }
        if (st.status) {
          const errs = m.errors || {};
          const n = Object.keys(errs).length;
          st.status.className = 'ft-status' + (m.saved ? ' ok' : n ? ' bad' : '');
          st.status.textContent = m.saved ? st.okText : errs._form ? errs._form : n ? st.badText : st.idleText;
        }
        // Tabs / section headers whose fields have errors get a dot.
        (st.secHeads || []).forEach((h, k) => {
          h.classList.toggle('err', st.spec.sections[k].ids.some((id) => (m.errors || {})[id]));
        });
      }

      function doSave() {
        if (st.spec.judge && st.spec.judge.mode === 'confirm') st.ctx.flag('irreversible');
        const errs = st.fam.helpers.validate(st.spec, st.ctx.model.fields);
        const ok = !Object.keys(errs).length;
        st.ctx.log('save', { ok });
        update({ saved: ok, errors: errs });
      }

      // ---------------------------------------------------------------- build

      function addField(ctx, look, grid, f, i) {
        const { spec, util } = ctx;
        const ta = f.type === 'textarea';
        const wrap = util.el('div', 'ft-field' + (ta || (f.maxLength && f.maxLength > 30) ? ' ft-wide' : ''), grid);
        const id = `ft-${f.id}`;
        const floating = look.layout === 'floating';
        const optional = (look.optional || spec.scenario === 'complete') && f.blank;
        const labelText = f.label + (optional ? ' (optional)' : '');
        const decorate = (label) => {
          // complete: a red "*" on required fields; "(optional)" in a muted span.
          if (spec.scenario !== 'complete') return;
          label.textContent = f.label;
          if (f.required) util.el('span', 'ft-req', label, '*');
          if (optional) util.el('span', 'ft-opt', label, ' (optional)');
        };
        let label = null;
        if (look.layout !== 'placeholder' && !floating) {
          label = util.el('label', 'ft-label' + (look.caps ? ' caps' : ''), wrap, labelText);
          label.htmlFor = id;
          decorate(label);
        }
        const box = util.el('div', 'ft-inwrap' + (ta ? ' ta' : ''), wrap);
        const el = util.el(ta ? 'textarea' : 'input', 'ft-input' + (look.underline && !ta ? ' underline' : '') + (f.counter ? ' counted' : ''), box);
        if (floating) {
          label = util.el('label', 'ft-label', box, labelText);
          label.htmlFor = id;
          decorate(label);
        }
        el.id = id;
        el.name = f.id;
        if (ta) el.rows = f.rows || 4;
        else el.type = f.type === 'password' ? 'password' : 'text';
        el.autocomplete = f.type === 'password' ? 'new-password' : 'off';
        el.spellcheck = false;
        el.setAttribute('autocapitalize', 'off');
        el.setAttribute('autocorrect', 'off');
        el.setAttribute('aria-label', f.label);
        el.dataset.role = 'field';
        el.dataset.field = f.id;
        if (look.layout === 'placeholder') el.placeholder = labelText + (spec.scenario === 'complete' && f.required ? ' *' : '');
        else if (floating) el.placeholder = ' ';
        else if (f.placeholder) el.placeholder = f.placeholder;
        if (f.disabled) el.disabled = true;
        let counter = null;
        if (f.counter) counter = util.el('span', 'ft-count', box);
        const w = env.ui.textField(el, {
          value: ctx.model.fields[f.id] ?? '',
          label: f.id,
          ...(f.mask ? { mask: f.mask } : {}),
          ...(f.maxLength ? { maxLength: f.maxLength } : {}),
          onInput: (v) => update({ fields: { ...st.ctx.model.fields, [f.id]: v }, saved: false }),
        });
        el.addEventListener('focus', () => { if (st.ctx.model.focus !== f.id) update({ focus: f.id }); });
        el.addEventListener('blur', () => { if (st.ctx.model.focus === f.id) update({ focus: null }); });
        const err = spec.save && !f.disabled ? util.el('div', 'ft-err', wrap) : null;
        st.inputs[f.id] = { f, w, el, counter, err };
        if (spec.scenario === 'password' && i === 0 && look.hint && !spec.save) util.el('div', 'ft-hint', wrap, look.hint);
      }

      // sections: tabs over stacked panes, or an exclusive accordion; mirrors the open one into model.section.
      function buildSections(ctx, look, card) {
        const { spec, util } = ctx;
        const byId = Object.fromEntries(spec.fields.map((f) => [f.id, f]));
        const open = ctx.model.section ?? 0;
        st.secHeads = [];
        if (spec.panes === 'tabs') {
          const strip = util.el('div', `ft-tabs ${look.tabStyle}`, card);
          strip.setAttribute('role', 'tablist');
          const panes = util.el('div', 'ft-panes', card);
          const paneEls = [];
          spec.sections.forEach((sec, k) => {
            const t = util.el('button', 'ft-tab', strip, sec.title);
            t.type = 'button';
            t.dataset.role = 'tab';
            st.secHeads.push(t);
            const pane = util.el('div', 'ft-pane', panes);
            paneEls.push(pane);
            const grid = util.el('div', `ft-grid ${look.layout}`, pane);
            sec.ids.forEach((id, i) => addField(ctx, look, grid, byId[id], i));
          });
          const tabs = env.ui.tabs(st.secHeads, paneEls, {
            keys: spec.sections.map((_, k) => k),
            value: open,
            keyboard: true,
            show: (p, vis) => p.classList.toggle('off', !vis),
            onChange: (k) => update({ section: k }),
          });
          st.sec = { set: (k) => tabs.set(k), locate: (k) => tabs.locate(k) };
          return;
        }
        const acc = util.el('div', 'ft-acc', card);
        const group = {};
        const cs = [];
        spec.sections.forEach((sec, k) => {
          const box = util.el('div', 'ft-acc-sec', acc);
          const h = util.el('button', 'ft-acc-h', box);
          h.type = 'button';
          h.dataset.role = 'section';
          util.el('span', '', h, sec.title);
          if (look.counts) util.el('span', 'cnt', h, `${sec.ids.length} fields`);
          const chev = util.el('span', 'chev', h, '▸');
          st.secHeads.push(h);
          const body = util.el('div', 'ft-acc-b', box);
          const grid = util.el('div', `ft-grid ${look.layout}`, body);
          sec.ids.forEach((id, i) => addField(ctx, look, grid, byId[id], i));
          const c = env.ui.collapsible(h, body, {
            open: k === open,
            group, // headers are <button>s: Enter / Space already click them
            mark: (el, isOpen) => { chev.textContent = isOpen ? '▾' : '▸'; el.setAttribute('aria-expanded', String(isOpen)); },
            onChange: (isOpen) => {
              const cur = st.ctx.model.section;
              update({ section: isOpen ? k : cur === k ? null : cur });
            },
          });
          cs.push(c);
        });
        const setOpen = (k) => cs.forEach((c, j) => c.set(j === k));
        // Reserve the height of the tallest open state, so expanding a section never moves the card.
        let tallest = 0;
        for (let k = 0; k < cs.length; k++) {
          setOpen(k);
          tallest = Math.max(tallest, acc.getBoundingClientRect().height);
        }
        acc.style.minHeight = `${Math.ceil(tallest)}px`;
        setOpen(open);
        st.sec = { set: setOpen, locate: (k) => cs[k].locate() };
      }

      // complete: the profile card the missing values come from.
      function buildProfile(ctx, look, parent) {
        const { spec, util } = ctx;
        const p = util.el('aside', 'ft-profile', parent);
        p.dataset.role = 'profile';
        const h = util.el('div', 'ft-profile-h', p);
        const first = spec.fields.find((f) => f.kind === 'first');
        const last = spec.fields.find((f) => f.kind === 'last');
        const ini = ((first ? first.target[0] : '') + (last ? last.target[0] : '')).toUpperCase() || spec.profile.title[0];
        if (look.avatar) util.el('span', 'ft-avatar', h, ini);
        util.el('span', '', h, spec.profile.title);
        const dl = util.el('dl', '', p);
        for (const row of spec.profile.rows) {
          const cell = util.el('div', '', dl);
          util.el('dt', '', cell, row.label);
          util.el('dd', '', cell, row.value);
        }
        return p;
      }

      function build(ctx, look) {
        const { spec, util } = ctx;
        const stage = st.host;
        const withCard = spec.scenario === 'complete' && spec.source === 'card';
        const outer = withCard ? util.el('div', `ft-wrap ${look.aside}`, stage) : stage;
        const card = util.el('form', `ft-card dis-${look.disabled}` + (look.flat ? ' flat' : '') + (look.ruled ? ' ruled' : ''), outer);
        card.dataset.role = 'form';
        card.autocomplete = 'off';
        card.noValidate = true;
        card.addEventListener('submit', (e) => {
          e.preventDefault();
          if (spec.save) doSave();
        });
        for (const [k, v] of Object.entries(look.vars)) (withCard ? outer : card).style.setProperty(k, v);
        util.el('h2', '', card, spec.title);
        if (look.subtitle) util.el('p', 'ft-sub', card, look.subtitle);
        st.card = card;
        st.box = withCard ? outer : card;
        st.inputs = {};
        st.secHeads = null;
        st.sec = null;
        if (withCard) {
          buildProfile(ctx, look, outer);
          if (look.aside === 'top') outer.prepend(outer.lastChild);
        }
        if (spec.sections) buildSections(ctx, look, card);
        else {
          const grid = util.el('div', `ft-grid ${look.layout}`, card);
          spec.fields.forEach((f, i) => addField(ctx, look, grid, f, i));
        }
        st.save = null;
        st.status = null;
        if (spec.save) {
          const row = util.el('div', 'ft-actions' + (look.btnRight ? ' right' : ''), card);
          const btn = util.el('button', 'ft-save' + (look.ghost ? ' ghost' : ''), row, spec.saveLabel);
          btn.type = 'submit';
          btn.dataset.role = 'save';
          st.save = btn;
          st.status = util.el('span', 'ft-status', row);
        }
        if (spec.scenario === 'login' && look.foot) {
          const foot = util.el('div', 'ft-foot', card);
          util.el('span', 'ft-link', foot, 'Forgot password?');
          util.el('span', '', foot, 'Need an account?');
        }
        paint(ctx.model);
        return card;
      }

      // Widget mode autofocus: the field a real page would focus on load.
      function autofocus(ctx) {
        const { spec, model } = ctx;
        const usable = spec.fields.filter((f) => !f.disabled && st.inputs[f.id]
          && (!spec.sections || f.section === model.section));
        const f = usable.find((x) => (model.errors || {})[x.id]) || usable[0];
        if (!f) return;
        st.inputs[f.id].el.focus({ preventScroll: true });
        ctx.log('autofocus', { field: f.id });
      }

      // ---------------------------------------------------------------- widget

      env.widget({
        task: 'type-text',
        site: 'base',
        name: 'fields',
        split: 'train',
        scenarios: ['single', 'transform', 'password', 'login', 'multi', 'textarea', 'copy', 'validation-fix', 'sections', 'complete'],
        scrollable: (spec) => !!spec.long,

        render(ctx) {
          ensureStyle();
          const { spec, rng } = ctx;
          st = { ctx, spec, fam: env.taskDef };
          const size = stageBox(ctx);
          st.host = size.host;
          if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
          const n = spec.sections ? Math.max(...spec.sections.map((x) => x.ids.length)) : spec.fields.length;
          const many = n >= 3;
          const allEmpty = spec.fields.every((f) => !f.disabled && !(ctx.model.fields[f.id] || '').length);
          const hasTa = spec.fields.some((f) => f.type === 'textarea');
          const layouts = ['stacked', 'stacked', 'floating', 'inline'];
          if (many) layouts.push('columns', 'columns');
          if (allEmpty && !hasTa) layouts.push('placeholder');
          const first = rng.pick(layouts);
          const base = {
            flat: rng.bool(0.25),
            ruled: rng.bool(0.35),
            caps: rng.bool(0.2),
            underline: rng.bool(0.2),
            subtitle: rng.pick(SUBTITLES[spec.scenario] || ['']),
            hint: rng.pick(['Use 8 or more characters.', 'Must include a number and a symbol.', '']),
            foot: rng.bool(0.6),
            optional: rng.bool(0.5),
            disabled: rng.pick(['grey', 'grey', 'subtle']),
            btnRight: rng.bool(0.3),
            ghost: rng.bool(0.25),
            h: rng.int(34, 44),
            gap: rng.int(12, 20),
            pad: rng.int(22, 32),
            r: rng.pick([3, 4, 6, 8]),
            fs: rng.pick([15, 16, 17]),
            w: many ? rng.int(230, 330) : rng.int(270, 460),
            align: rng.pick(['left', 'right']),
          };
          // Looks of the newer scenarios come from their own stream, so older scenarios keep their layouts.
          const lr = rng.fork('look2');
          Object.assign(base, {
            tabStyle: lr.pick(['', 'pills', 'under']),
            counts: lr.bool(0.4),
            aside: lr.pick(['right', 'left']),
            avatar: lr.bool(0.6),
            pw: lr.int(200, 250),
          });
          st.okText = rng.pick(['✓ Saved', 'Changes saved.', '✓ Signed in', 'All set - saved.']);
          if (spec.scenario === 'login') st.okText = rng.pick(['✓ Signed in', 'Welcome back!']);
          st.badText = rng.pick(['Please fix the errors above.', 'Check the highlighted field.', 'Could not save.']);
          st.idleText = spec.scenario === 'validation-fix' ? 'Not saved: 1 error.' : '';
          const withCard = spec.scenario === 'complete' && spec.source === 'card';
          // Try the sampled layout first, then the others, then tighter spacing until the card fits the stage;
          // a profile card goes beside the form first, above it when that does not fit.
          const order = [first, ...['stacked', 'columns', 'inline', 'floating'].filter((l) => l !== first && (l !== 'columns' || many))];
          const tries = [];
          for (const aside of withCard ? [base.aside, 'top'] : ['']) {
            for (const squeeze of [0, 1, 2]) for (const layout of order) tries.push({ layout, squeeze, aside });
          }
          const maxH = size.height - 16;
          const maxW = size.width - 24;
          let look;
          for (const t of tries) {
            const s = t.squeeze;
            const side = t.aside === 'left' || t.aside === 'right' ? base.pw + 20 : 0;
            look = {
              ...base,
              layout: t.layout,
              aside: t.aside,
              subtitle: s >= 1 ? '' : base.subtitle,
              vars: {
                '--ft-h': `${s >= 2 ? Math.min(base.h, 34) : base.h}px`,
                '--ft-gap': `${s >= 1 ? Math.min(base.gap, 10) : base.gap}px`,
                '--ft-pad': `${s >= 2 ? 16 : base.pad}px`,
                '--ft-r': `${base.r}px`,
                '--ft-fs': `${base.fs}px`,
                '--ft-w': `${Math.min(t.layout === 'columns' ? Math.min(base.w, 270) : base.w, Math.floor((maxW - 80 - side) / (t.layout === 'columns' ? 2 : 1)) - (t.layout === 'inline' ? 140 : 0))}px`,
                '--ft-align': base.align,
                '--ft-pw': `${base.pw}px`,
                '--ft-pcols': '3',
              },
            };
            st.host.replaceChildren();
            build(ctx, look);
            const r = st.box.getBoundingClientRect();
            if ((spec.long || r.height <= maxH) && r.width <= maxW) break;
          }
          // Place the card at a seeded spot inside the stage rectangle (stage-relative, whatever the frame).
          const card = st.box;
          // Freeze the card's width so status and error texts that appear later cannot widen it.
          card.style.boxSizing = 'border-box';
          card.style.width = `${Math.ceil(card.getBoundingClientRect().width)}px`;
          const sr = ctx.stage.getBoundingClientRect();
          const r = card.getBoundingClientRect();
          const span = (lo, hi) => (hi > lo ? [lo, hi] : [(lo + hi) / 2, (lo + hi) / 2]);
          const [x0, x1] = span(sr.left + 8 - r.left, sr.right - 8 - r.right);
          const [y0, y1] = spec.long ? span(sr.top + 8 - r.top, Math.max(sr.top + 8 - r.top, sr.bottom - 8 - r.bottom))
            : span(sr.top + 6 - r.top, sr.bottom - 6 - r.bottom);
          const dx = Math.round(rng.float(x0, x1));
          const dy = Math.round(rng.float(y0, y1));
          card.style.transform = `translate(${dx}px, ${dy}px)`;
          if (rng.fork('autofocus').bool(0.35)) autofocus(ctx);
          return {
            anchors: [card],
            sync(m) {
              for (const [id, x] of Object.entries(st.inputs)) x.w.set(m.fields[id] ?? '');
              if (st.sec && m.section !== undefined && m.section !== null) st.sec.set(m.section);
              paint(m);
            },
          };
        },

        locate(t) {
          if (t.field !== undefined && st.inputs[t.field]) {
            const el = st.inputs[t.field].el;
            const r = el.getBoundingClientRect();
            // Left of centre: away from the counter and (floating mode) on the input, not on its label.
            return [r.left + Math.min(r.width * 0.4, 140), r.top + r.height * (el.tagName === 'TEXTAREA' ? 0.55 : 0.6)];
          }
          if (t.save && st.save) return st.ctx.util.center(st.save);
          if (t.section !== undefined && st.secHeads && st.secHeads[t.section]) return st.ctx.util.center(st.secHeads[t.section]);
          throw new Error(`type-text/fields cannot locate ${JSON.stringify(t)}`);
        },
      });
    })();

    return captured;
  }
  env.template('type-text/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`type-text/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('type-text/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`type-text/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`type-text/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  });
})();
