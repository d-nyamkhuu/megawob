/*
 * kit/ui/form.js: headless form primitives (dropdown, listbox + custom scrollbar, autocomplete, choice
 * groups, calendar, spinner). Behavior and geometry only: the widget creates every element (trigger,
 * popup, options, cells, buttons), decides layout, size, colors and whether a popup opens up or down.
 * Nothing here creates visible elements, injects CSS or sets colors, fonts, borders or shadows. Where
 * something must change on screen the primitive calls a widget-overridable hook (show / place / mark),
 * whose default only toggles `hidden`, `checked`, an aria attribute or a position.
 *
 * Common rules
 *   - Controlled state: pass the current state in (opts or set()), get callbacks out, then call
 *     ctx.update(model) yourself. set(...) syncs from the model WITHOUT firing callbacks (call it from
 *     the widget's paint / sync). Callbacks may fire in sequence for one gesture (e.g. onChange, then
 *     onOpenChange(false, 'select')); write them idempotently (compare with the model before updating).
 *   - Popup state is model state: dropdown / autocomplete report every open/close via
 *     onOpenChange(open, reason) (reason: 'trigger' | 'outside' | 'escape' | 'select' | 'key' | 'input'
 *     | 'blur' | 'api'), because plans often depend on it ({ open } targets).
 *   - A press (pointerdown, capture phase) outside an open popup closes it ('outside'); for autocomplete,
 *     elements in opts.inside count as inside. The press still reaches its target.
 *   - Keyboard handling only with opts.keyboard === true (pass it only when the task's inputs include
 *     'keyboard'; otherwise the kit rejects every keydown before it arrives).
 *   - locate*(...) return viewport px [x, y] (element centers unless stated) and throw when the target
 *     is not rendered, so a widget's locate() can delegate directly.
 *   - Events: env.log('open' | 'close' | 'select' | 'scroll' | 'step', { what: label, ... }).
 *   - Values are compared with ===; option registries keep registration order (used for arrows and for
 *     the order of multi-selections). Pass [[value, el], ...] pairs (or a Map) rather than an object when
 *     values are numbers or numeric strings: object keys are strings and integer-like keys reorder.
 *
 * env.ui.dropdown(trigger, popup, opts) -> api
 *   Click on trigger toggles; click on a registered option selects it and closes the popup.
 *   opts: open, value (initial), label, options ({value: el} | [[value, el]] | Map), onChange(value),
 *   onOpenChange(open, reason), onActive(value | null) (keyboard highlight moved; the widget draws it),
 *   show(popup, open, api) (default: popup.hidden = !open; do layout / flip-up here, see api.room()),
 *   keyboard (keys go to the trigger; give it tabIndex), text(value) (type-ahead text; default the
 *   option's textContent). Keys: Enter / Space / ArrowDown open; ArrowUp/Down/Home/End move the
 *   highlight; Enter picks it; Escape closes (anywhere while open); printable keys type-ahead.
 *   api: isOpen(), get(), set({ open?, value? }), open(reason), close(reason), toggle(),
 *        option(value, el), options(map), clear() (forget options, e.g. before re-rendering the popup),
 *        active(), room() -> { above, below, left, right } px between the trigger and the viewport
 *        edges, locateTrigger(), locateOption(value).
 *
 * env.ui.listbox(list, opts) -> api
 *   Single or multi selection over option elements inside a scrollable container (native overflow, so
 *   the wheel works), plus an optional custom scrollbar kept in sync with the native scroll position.
 *   Positions are measured from the DOM (option rects), so rows may have any size; an "index" is a
 *   fractional option index: index i is at the top edge when the list is scrolled by the offset of
 *   option i from option 0 (linear extrapolation past either end).
 *   opts: multi (false; multi: clicks toggle, else a click replaces the selection),
 *         values | value (initial), options, label, axis ('y' | 'x'),
 *         onChange(values, value), onScroll(index) (first visible index, float, deduplicated),
 *         keyboard (keys go to the list),
 *         scrollbar: { track, thumb, pad (px kept free at both track ends, 0), minThumb (px, 0),
 *                      length (px or fn(innerTrackPx, visibleRatio) -> px; default proportional),
 *                      page (px or fn() -> px; default one view minus one row),
 *                      place(thumb, { offset, length, axis }) (default style.top/height or left/width),
 *                      onDrag(dragging) },
 *   The thumb drags (scroll proportional to thumb travel); a press on the track beside the thumb
 *   pages towards the press.
 *   api: get(), set({ values?, scroll? }) (scroll = index; no callbacks), option(value, el), options(map),
 *        scrollIndex(), scrollTo(index, align = 'start' | 'center') (fires onScroll),
 *        refresh() (re-place the thumb after layout changes),
 *        locateOption(value), locateThumb(), locateThumbFor(index, align = 'start' | 'center')
 *        (where the thumb's center must be released, pressing at its center, so that `index` ends at
 *        the top (or center) of the view; linear in index, may lie past the track ends: the thumb clamps).
 *
 * env.ui.autocomplete(input, popup, opts) -> api
 *   Every input event asks filter(text) for suggestions, lets the widget render them, and opens the
 *   popup iff there are any; a click on a suggestion (or highlight + Enter) commits it (the field shows
 *   it unless fill: false). Blur, Escape and outside presses close it.
 *   opts: filter(text) -> [values] (required), render(values, text, active, api) (widget builds the suggestion
 *         elements inside popup and registers each with api.suggestion(value, el)),
 *         text (initial), onInput(text, values) (the committed value is now cleared),
 *         onChange(value) (commit), onOpenChange(open, reason), inside, fill (true), keyboard, label.
 *   The popup starts closed and is shown with popup.hidden.
 *   api: get() -> { text, value, open }, set({ text?, value?, open? }), items(), suggestion(value, el),
 *        open(), close(reason), locateInput(), locateSuggestion(value).
 *
 * env.ui.choices(elements, opts) -> api
 *   Radio (single) or checkbox (multi) semantics over any elements: native radio/checkbox inputs
 *   (listens to 'change', so label clicks work) or custom tiles / switches / chips (listens to 'click').
 *   elements: { value: el } | [[value, el]] | Map.
 *   opts: multi, value | values (initial),
 *         onChange(value) (single) | onChange(values, value, on) (multi),
 *         mark(el, on, value) (default: native inputs get .checked, others aria-checked),
 *         keyboard (custom elements: Space/Enter activate, arrows move between single choices), label.
 *   api: get(), set(value | values), element(value), locate(value).
 *
 * env.ui.calendar(opts) -> api
 *   Pure month-grid model (ISO 'YYYY-MM-DD' dates, 'YYYY-MM' month keys; proleptic Gregorian; no Date
 *   object, no clock) plus bindings for widget-rendered cells and buttons.
 *   opts: weekStart (0 = Sunday .. 6), math ({ days(iso), fromDays(n), weekday(iso) } to use the task's
 *         own arithmetic; default built in, see env.ui.calendar.check), onDay(iso, { inMonth }),
 *         onNav(dir), onToggle(), onYear(year), label.
 *   model: weeks(monthKey, { rows: 6 | 'auto' }) -> [[{ iso, day, month, inMonth, weekday }] x 7],
 *          weekdays() -> [weekday numbers in column order], step(monthKey, dir, { min, max }) (dir 'prev' |
 *          'next' | n months, clamped), years(lo, hi), pickRange({ start, end }, iso) -> { start, end, done }
 *          (first click starts, a click on or after the start ends, an earlier click restarts),
 *          plus helpers days,
 *          fromDays, weekday, daysInMonth(y, m), monthKey(y, m), monthOf(iso), addMonths(key, n),
 *          monthDiff(a, b), addDays(iso, n).
 *   bindings (click -> callback): bindDay(el, iso, { inMonth = true }), bindNav(el, 'prev' | 'next'),
 *          bindToggle(el) (e.g. the "Month YYYY" header), bindYear(el, year), clear() (forget bound
 *          elements, e.g. before re-rendering the grid).
 *   locate: locateDay(iso) (prefers the in-month cell), locateNav(dir), locateToggle(), locateYear(y).
 *
 * env.ui.spinner(opts) -> api
 *   Up / down buttons over a numeric value. opts: up, down (elements), value, step (1), min, max, wrap
 *   (false: clamp; true: cycle through min..max in steps), onStep(dir, next) (every click),
 *   onChange(value, dir) (when the value changes), field (the value element, for locate('value') and
 *   keyboard), keyboard (ArrowUp/ArrowDown on field), label.
 *   api: get(), set(v), next(v, dir) (pure), locate('up' | 'down' | 'value').
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});
  const { clamp, center, shown, where, entries: entriesOf, onKeys } = ui._base;

  // ---------------------------------------------------------------- global press / key routing

  // Widgets that close on outside presses or document-level Escape. Entries of a previous episode
  // (reset() replaces the page) are dropped once their elements are disconnected: on each press, and when a widget
  // of a later episode registers, so many resets without a press do not keep old widget trees alive. (An entry of
  // the running episode stays: its widget may not have attached the element yet.)
  const live = new Set();
  let installed = false;
  function watch(w) {
    for (const x of live) if (x.episode !== env.episode && !x.alive()) live.delete(x);
    w.episode = env.episode;
    live.add(w);
    if (installed) return;
    installed = true;
    document.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      for (const x of [...live]) {
        if (!x.alive()) live.delete(x);
        else if (x.outside) x.outside(e);
      }
    }, true);
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      for (const x of [...live]) if (x.alive() && x.escape) x.escape(e);
    });
  }

  // ---------------------------------------------------------------- dropdown

  ui.dropdown = function dropdown(trigger, popup, opts = {}) {
    const label = opts.label || 'dropdown';
    const order = [];
    const els = new Map();
    const valueOf = new WeakMap();
    let open = !!opts.open;
    let value = opts.value === undefined ? null : opts.value;
    let active = null;
    let typed = '';
    const show = opts.show || ((pop, isOpen) => { pop.hidden = !isOpen; });
    const insideEls = () => [trigger, popup];
    const textOf = opts.text || ((v) => (els.get(v) ? els.get(v).textContent.trim() : String(v)));

    function setActive(v) {
      if (active === v) return;
      active = v;
      if (opts.onActive) opts.onActive(v);
    }
    function setOpen(next, reason) {
      next = !!next;
      if (next === open) return;
      open = next;
      typed = '';
      setActive(null);
      show(popup, open, api);
      env.log(open ? 'open' : 'close', { what: label, reason });
      if (opts.onOpenChange) opts.onOpenChange(open, reason);
    }
    function select(v, reason) {
      value = v;
      env.log('select', { what: label, value: v });
      if (opts.onChange) opts.onChange(v);
      setOpen(false, reason || 'select');
    }
    function option(v, el) {
      if (!els.has(v)) order.push(v);
      els.set(v, el);
      if (!valueOf.has(el)) el.addEventListener('click', () => { if (valueOf.get(el) !== undefined) select(valueOf.get(el)); });
      valueOf.set(el, v);
      return el;
    }

    trigger.addEventListener('click', () => setOpen(!open, 'trigger'));

    if (opts.keyboard) {
      trigger.addEventListener('keydown', (e) => {
        const n = order.length;
        if (!open) {
          if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            setOpen(true, 'key');
          }
          return;
        }
        if (e.key === 'Escape') {
          setOpen(false, 'escape');
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
          e.preventDefault();
          if (!n) return;
          const cur = active !== null ? order.indexOf(active) : order.indexOf(value);
          let i;
          if (e.key === 'Home') i = 0;
          else if (e.key === 'End') i = n - 1;
          else i = e.key === 'ArrowDown' ? Math.min(n - 1, cur + 1) : Math.max(0, cur - 1);
          setActive(order[i]);
        } else if (e.key === 'Enter' && active !== null) {
          e.preventDefault();
          select(active, 'key');
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ') {
          // Type-ahead without a clock: extend the prefix while it still matches, else restart.
          const find = (p) => order.find((v) => textOf(v).toLowerCase().startsWith(p));
          let hit = find(typed + e.key.toLowerCase());
          typed = hit !== undefined ? typed + e.key.toLowerCase() : e.key.toLowerCase();
          if (hit === undefined) hit = find(typed);
          if (hit !== undefined) setActive(hit);
        }
      });
    }

    const api = {
      isOpen: () => open,
      get: () => value,
      set(s = {}) {
        if ('value' in s) value = s.value;
        if ('open' in s && !!s.open !== open) {
          open = !!s.open;
          active = null;
          show(popup, open, api);
        }
      },
      open: (reason = 'api') => setOpen(true, reason),
      close: (reason = 'api') => setOpen(false, reason),
      toggle: (reason = 'api') => setOpen(!open, reason),
      option,
      options(map) { for (const [v, el] of entriesOf(map)) option(v, el); },
      clear() {
        for (const el of els.values()) valueOf.set(el, undefined);
        els.clear();
        order.length = 0;
      },
      active: () => active,
      room() {
        const r = trigger.getBoundingClientRect();
        return { above: r.top, below: innerHeight - r.bottom, left: r.left, right: innerWidth - r.right };
      },
      locateTrigger: () => where(trigger, `${label} trigger`),
      locateOption(v) {
        return where(els.get(v), `${label} option ${JSON.stringify(v)}`);
      },
    };
    api.options(opts.options);
    show(popup, open, api);
    watch({
      alive: () => trigger.isConnected,
      outside(e) {
        if (open && !insideEls().some((el) => el && el.contains(e.target))) setOpen(false, 'outside');
      },
      escape: opts.keyboard ? () => setOpen(false, 'escape') : null,
    });
    return api;
  };

  // ---------------------------------------------------------------- listbox (+ custom scrollbar)

  ui.listbox = function listbox(list, opts = {}) {
    const label = opts.label || 'listbox';
    const multi = !!opts.multi;
    const X = opts.axis === 'x';
    const K = X
      ? { scroll: 'scrollLeft', client: 'clientWidth', size: 'scrollWidth', start: 'left', len: 'width', edge: 'clientLeft', ptr: 'clientX' }
      : { scroll: 'scrollTop', client: 'clientHeight', size: 'scrollHeight', start: 'top', len: 'height', edge: 'clientTop', ptr: 'clientY' };
    const order = [];
    const els = new Map();
    const valueOf = new WeakMap();
    let values = (opts.values || (opts.value !== undefined && opts.value !== null ? [opts.value] : [])).slice();
    let active = null;
    let lastIndex = null;
    const sb = opts.scrollbar || null;

    const maxScroll = () => Math.max(0, list[K.size] - list[K.client]);
    const rowSize = () => (order.length ? els.get(order[0]).getBoundingClientRect()[K.len] : 0);
    const visibleCount = () => (rowSize() ? list[K.client] / rowSize() : 0);
    const place = (sb && sb.place) || ((thumb, { offset, length }) => {
      thumb.style[K.start] = offset + 'px';
      thumb.style[K.len] = length + 'px';
    });
    list.addEventListener('scroll', sync);

    if (sb) bindScrollbar();

    if (opts.keyboard) bindKeyboard();

    const api = createApi();
    api.options(opts.options);
    return api;

    function select(v) {
      if (multi) {
        const on = !values.includes(v);
        values = order.filter((x) => (x === v ? on : values.includes(x)));
      } else values = [v];
      env.log('select', { what: label, value: v });
      if (opts.onChange) opts.onChange(values.slice(), v);
    }

    function option(v, el) {
      if (!els.has(v)) order.push(v);
      els.set(v, el);
      if (!valueOf.has(el)) el.addEventListener('click', () => { if (valueOf.get(el) !== undefined) select(valueOf.get(el)); });
      valueOf.set(el, v);
      return el;
    }

    // Option offsets along the scroll axis, relative to option 0 in scroll-content coordinates.
    function spans() {
      const lr = list.getBoundingClientRect();
      const base = lr[K.start] + list[K.edge] - list[K.scroll];
      return order.map((v) => {
        const r = els.get(v).getBoundingClientRect();
        return [r[K.start] - base, r[K.len]];
      });
    }

    function offsetOf(index, s = spans()) {
      const n = s.length;
      if (!n) return 0;
      const o0 = s[0][0];
      if (index <= 0) return index * s[0][1];
      if (index >= n - 1) return s[n - 1][0] - o0 + (index - (n - 1)) * s[n - 1][1];
      const k = Math.floor(index);
      return s[k][0] - o0 + (index - k) * s[k][1];
    }

    function indexAt(off, s = spans()) {
      const n = s.length;
      if (!n) return 0;
      const o0 = s[0][0];
      if (off <= 0) return s[0][1] ? off / s[0][1] : 0;
      for (let k = 0; k < n; k++) {
        const a = s[k][0] - o0;
        if (k === n - 1 || off < s[k + 1][0] - o0) return k + (s[k][1] ? (off - a) / s[k][1] : 0);
      }
      return 0;
    }

    function isVisible(v) {
      const el = els.get(v);
      if (!el) return false;
      const lr = list.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const lo = lr[K.start] + list[K.edge];
      return r[K.start] >= lo - 0.5 && r[K.start] + r[K.len] <= lo + list[K.client] + 0.5;
    }

    // ---- scrollbar geometry: thumb length and travel from the live track
    function sbGeom() {
      const pad = sb.pad || 0;
      const inner = sb.track[K.client];
      const ratio = list[K.size] ? list[K.client] / list[K.size] : 1;
      let length;
      if (typeof sb.length === 'function') length = sb.length(inner, ratio);
      else if (typeof sb.length === 'number') length = sb.length;
      else length = Math.max(sb.minThumb || 0, Math.round(((inner - 2 * pad) * list[K.client]) / (list[K.size] || 1)));
      return { pad, inner, length, usable: inner - 2 * pad - length };
    }

    function placeThumb() {
      if (!sb) return;
      const g = sbGeom();
      const m = maxScroll();
      place(sb.thumb, { offset: g.pad + (m ? list[K.scroll] / m : 0) * g.usable, length: g.length, axis: X ? 'x' : 'y' });
    }

    function sync() {
      placeThumb();
      const i = indexAt(list[K.scroll]);
      if (i !== lastIndex) {
        lastIndex = i;
        if (opts.onScroll) opts.onScroll(i);
      }
    }

    function bindScrollbar() {
      let s0 = 0;
      ui.track(sb.thumb, {
        start(p, e) {
          e.stopPropagation();
          s0 = list[K.scroll];
          if (sb.onDrag) sb.onDrag(true);
        },
        move(p) {
          const g = sbGeom();
          const d = X ? p.dx : p.dy;
          list[K.scroll] = clamp(s0 + (g.usable > 0 ? (d * maxScroll()) / g.usable : 0), 0, maxScroll());
          sync();
        },
        end(p) {
          const g = sbGeom();
          const d = X ? p.dx : p.dy;
          list[K.scroll] = clamp(s0 + (g.usable > 0 ? (d * maxScroll()) / g.usable : 0), 0, maxScroll());
          if (sb.onDrag) sb.onDrag(false);
          sync();
          env.log('scroll', { what: label, index: lastIndex });
        },
      }, label + ':thumb');
      sb.track.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || sb.thumb.contains(e.target)) return;
        const r = sb.thumb.getBoundingClientRect();
        const page = typeof sb.page === 'function' ? sb.page() : typeof sb.page === 'number' ? sb.page : list[K.client] - rowSize();
        list[K.scroll] = clamp(list[K.scroll] + (e[K.ptr] < r[K.start] ? -page : page), 0, maxScroll());
        sync();
        env.log('scroll', { what: label, index: lastIndex, page: true });
      });
    }

    function bindKeyboard() {
      list.addEventListener('keydown', (e) => {
        const n = order.length;
        if (!n) return;
        const prev = X ? 'ArrowLeft' : 'ArrowUp';
        const next = X ? 'ArrowRight' : 'ArrowDown';
        if (e.key === prev || e.key === next || e.key === 'Home' || e.key === 'End') {
          e.preventDefault();
          const cur = active !== null ? order.indexOf(active) : order.indexOf(values[values.length - 1]);
          const i = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : e.key === next ? Math.min(n - 1, cur + 1) : Math.max(0, cur - 1);
          active = order[i];
          if (!isVisible(active)) {
            const vis = visibleCount();
            api.scrollTo(i < api.scrollIndex() ? i : i - Math.max(0, Math.floor(vis) - 1));
          }
          if (!multi) select(active);
        } else if ((e.key === ' ' || e.key === 'Enter') && active !== null) {
          e.preventDefault();
          select(active);
        }
      });
    }

    function createApi() {
      return {
        get: () => values.slice(),
        set(s = {}) {
          if (s.values) values = s.values.slice();
          if (s.scroll !== undefined && s.scroll !== null) {
            list[K.scroll] = clamp(offsetOf(s.scroll), 0, maxScroll());
            lastIndex = indexAt(list[K.scroll]);
          }
          placeThumb();
        },
        option,
        options(map) { for (const [v, el] of entriesOf(map)) option(v, el); },
        scrollIndex: () => indexAt(list[K.scroll]),
        scrollTo(index, align = 'start') {
          const i = align === 'center' ? index - (visibleCount() - 1) / 2 : index;
          list[K.scroll] = clamp(offsetOf(i), 0, maxScroll());
          sync();
        },
        refresh: placeThumb,
        locateOption(v) {
          return where(els.get(v), `${label} option ${JSON.stringify(v)}`);
        },
        locateThumb() {
          if (!sb) throw new Error(`env.ui: ${label} has no scrollbar`);
          return where(sb.thumb, `${label} thumb`);
        },
        locateThumbFor(index, align = 'start') {
          if (!sb) throw new Error(`env.ui: ${label} has no scrollbar`);
          const i = align === 'center' ? index - (visibleCount() - 1) / 2 : index;
          const g = sbGeom();
          const m = maxScroll();
          const frac = m ? offsetOf(i) / m : 0;
          const tr = sb.track.getBoundingClientRect();
          const th = sb.thumb.getBoundingClientRect();
          const along = tr[K.start] + sb.track[K.edge] + g.pad + g.length / 2 + frac * g.usable;
          return X ? [along, th.top + th.height / 2] : [th.left + th.width / 2, along];
        },
      };
    }
  };

  // ---------------------------------------------------------------- autocomplete

  ui.autocomplete = function autocomplete(input, popup, opts = {}) {
    const label = opts.label || 'autocomplete';
    if (typeof opts.filter !== 'function') throw new Error('env.ui.autocomplete: opts.filter(text) is required');
    let open = false;
    let value = '';
    let items = [];
    let active = null;
    const sugg = new Map();
    const valueOf = new WeakMap();
    const show = (pop, isOpen) => { pop.hidden = !isOpen; };
    const insideEls = () => [input, popup, ...(opts.inside || [])];
    if (opts.text !== undefined && input.value !== opts.text) input.value = opts.text;

    function fill() {
      sugg.clear();
      if (opts.render) opts.render(items.slice(), input.value, active, api);
    }
    function setActive(v) {
      if (active === v) return;
      active = v;
      fill();
    }
    function setOpen(next, reason) {
      next = !!next;
      if (next === open) return;
      open = next;
      show(popup, open, api);
      env.log(open ? 'open' : 'close', { what: label, reason });
      if (opts.onOpenChange) opts.onOpenChange(open, reason);
    }
    function commit(v) {
      value = v;
      items = [];
      active = null;
      if (opts.fill !== false) input.value = v;
      env.log('select', { what: label, value: v });
      if (opts.onChange) opts.onChange(v);
      setOpen(false, 'select');
    }
    function close(reason) {
      active = null;
      setOpen(false, reason);
    }

    input.addEventListener('input', () => {
      const text = input.value;
      items = opts.filter(text) || [];
      active = null;
      value = '';
      if (opts.onInput) opts.onInput(text, items.slice());
      fill();
      setOpen(items.length > 0, 'input');
    });
    input.addEventListener('blur', () => {
      if (!input.isConnected) return; // blur from reset() removing the page
      close('blur');
    });
    if (opts.keyboard) {
      input.addEventListener('keydown', (e) => {
        if (!open) return;
        if (e.key === 'Escape') close('escape');
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (!items.length) return;
          const cur = active === null ? -1 : items.indexOf(active);
          setActive(items[e.key === 'ArrowDown' ? Math.min(items.length - 1, cur + 1) : Math.max(0, cur - 1)]);
        } else if (e.key === 'Enter' && active !== null) {
          e.preventDefault();
          commit(active);
        }
      });
    }

    const api = {
      get: () => ({ text: input.value, value, open }),
      set(s = {}) {
        if (s.text !== undefined && input.value !== s.text) input.value = s.text;
        if (s.value !== undefined) value = s.value;
        if (s.open !== undefined && !!s.open !== open) {
          open = !!s.open;
          active = null;
          items = open ? opts.filter(input.value) || [] : [];
          if (open) fill();
          show(popup, open, api);
        }
      },
      items: () => items.slice(),
      suggestion(v, el) {
        sugg.set(v, el);
        if (!valueOf.has(el)) {
          el.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus in the field
          el.addEventListener('click', () => commit(valueOf.get(el)));
        }
        valueOf.set(el, v);
        return el;
      },
      open(reason = 'api') {
        items = opts.filter(input.value) || [];
        fill();
        setOpen(true, reason);
      },
      close: (reason = 'api') => close(reason),
      locateInput: () => where(input, `${label} field`),
      locateSuggestion(v) {
        return where(sugg.get(v), `${label} suggestion ${JSON.stringify(v)}`);
      },
    };
    show(popup, open, api);
    watch({
      alive: () => input.isConnected,
      outside(e) {
        if (open && !insideEls().some((el) => el && el.contains(e.target))) close('outside');
      },
    });
    return api;
  };

  // ---------------------------------------------------------------- choices (radio / checkbox groups)

  ui.choices = function choices(elements, opts = {}) {
    const label = opts.label || 'choices';
    const multi = !!opts.multi;
    const list = entriesOf(elements);
    const order = list.map(([v]) => v);
    const els = new Map(list);
    let value = opts.value === undefined ? null : opts.value;
    let values = (opts.values || []).slice();
    const isNative = (el) => el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox');
    const mark = opts.mark || ((el, on) => {
      if (isNative(el)) el.checked = on;
      else el.setAttribute('aria-checked', String(on));
    });
    const isOn = (v) => (multi ? values.includes(v) : value === v);
    const paint = () => { for (const [v, el] of els) mark(el, isOn(v), v); };

    function pick(v) {
      value = v;
      paint();
      env.log('select', { what: label, value: v });
      if (opts.onChange) opts.onChange(v);
    }
    function toggle(v, on) {
      values = order.filter((x) => (x === v ? on : values.includes(x)));
      paint();
      env.log('select', { what: label, value: v, on });
      if (opts.onChange) opts.onChange(values.slice(), v, on);
    }
    function activate(v) {
      if (multi) toggle(v, !values.includes(v));
      else if (v !== value) pick(v);
    }

    for (const [v, el] of list) {
      if (isNative(el)) {
        el.addEventListener('change', () => {
          if (multi) toggle(v, el.checked);
          else if (el.checked) pick(v);
        });
      } else {
        el.addEventListener('click', () => activate(v));
        if (opts.keyboard) {
          const step = (d) => () => {
            const nv = order[(order.indexOf(v) + d + order.length) % order.length];
            pick(nv);
            if (els.get(nv).focus) els.get(nv).focus();
          };
          const arrows = multi ? {} : { ArrowDown: step(1), ArrowRight: step(1), ArrowUp: step(-1), ArrowLeft: step(-1) };
          onKeys(el, { ' ': () => activate(v), Enter: () => activate(v), ...arrows });
        }
      }
    }
    paint();

    return {
      get: () => (multi ? values.slice() : value),
      set(v) {
        if (multi) values = (v || []).slice();
        else value = v === undefined ? null : v;
        paint();
      },
      element: (v) => els.get(v),
      locate(v) {
        return where(els.get(v), `${label} choice ${JSON.stringify(v)}`);
      },
    };
  };

  // ---------------------------------------------------------------- calendar

  const fdiv = Math.floor;
  const { pad2, civilToDays, daysToCivil, monthKey, mIndex } = env.util;
  const isoOf = (y, m, d) => `${y}-${pad2(m)}-${pad2(d)}`;
  const MATH = {
    days(iso) {
      const r = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
      return r ? civilToDays(+r[1], +r[2], +r[3]) : null;
    },
    fromDays: (n) => isoOf(...daysToCivil(n)),
    weekday(iso) { return (((MATH.days(iso) % 7) + 11) % 7); }, // 1970-01-01 was a Thursday (4)
  };
  const keyOf = (i) => monthKey(fdiv(i / 12), (i % 12) + 1);

  ui.calendar = function calendar(opts = {}) {
    const label = opts.label || 'calendar';
    const math = { ...MATH, ...(opts.math || {}) };
    const weekStart = opts.weekStart || 0;
    const days = new Map(); // iso -> [{ el, inMonth }]
    const navs = new Map();
    const yearEls = new Map();
    let toggleEl = null;
    const handlers = new WeakMap();

    const daysInMonth = (y, m) => (m === 12 ? civilToDays(y + 1, 1, 1) : civilToDays(y, m + 1, 1)) - civilToDays(y, m, 1);
    const addMonths = (key, n) => keyOf(mIndex(key) + n);
    const cmp = (a, b) => math.days(a) - math.days(b);

    function weeks(key, { rows = 6 } = {}) {
      const first = math.days(`${key}-01`);
      const lead = (math.weekday(`${key}-01`) - weekStart + 7) % 7;
      const count = rows === 'auto' ? Math.ceil((lead + daysInMonth(+key.slice(0, 4), +key.slice(5, 7))) / 7) : rows;
      const out = [];
      for (let w = 0; w < count; w++) {
        const week = [];
        for (let d = 0; d < 7; d++) {
          const iso = math.fromDays(first - lead + w * 7 + d);
          week.push({ iso, day: +iso.slice(8), month: iso.slice(0, 7), inMonth: iso.slice(0, 7) === key, weekday: (weekStart + d) % 7 });
        }
        out.push(week);
      }
      return out;
    }

    function on(el, fn) {
      if (!handlers.has(el)) el.addEventListener('click', () => handlers.get(el)());
      handlers.set(el, fn);
      return el;
    }

    function pick(map, key, what) {
      const el = map.get(key);
      return where(el, `${label} ${what}`);
    }

    return {
      // ---- model
      weeks,
      weekdays: () => Array.from({ length: 7 }, (_, i) => (weekStart + i) % 7),
      step(key, dir, { min, max } = {}) {
        let i = mIndex(key) + (dir === 'prev' ? -1 : dir === 'next' ? 1 : dir);
        if (min) i = Math.max(mIndex(min), i);
        if (max) i = Math.min(mIndex(max), i);
        return keyOf(i);
      },
      years: (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
      pickRange(state, iso) {
        if (state.start && !state.end && cmp(iso, state.start) >= 0) return { start: state.start, end: iso, done: true };
        return { start: iso, end: '', done: false };
      },
      days: math.days,
      fromDays: math.fromDays,
      weekday: math.weekday,
      daysInMonth,
      monthKey,
      monthOf: (iso) => iso.slice(0, 7),
      addMonths,
      monthDiff: (a, b) => mIndex(b) - mIndex(a),
      addDays: (iso, n) => math.fromDays(math.days(iso) + n),

      // ---- bindings
      bindDay(el, iso, { inMonth = true } = {}) {
        if (!days.has(iso)) days.set(iso, []);
        days.get(iso).push({ el, inMonth });
        return on(el, () => {
          env.log('select', { what: label, day: iso });
          if (opts.onDay) opts.onDay(iso, { inMonth });
        });
      },
      bindNav(el, dir) {
        navs.set(dir, el);
        return on(el, () => {
          env.log('nav', { what: label, dir });
          if (opts.onNav) opts.onNav(dir);
        });
      },
      bindToggle(el) {
        toggleEl = el;
        return on(el, () => {
          env.log('nav', { what: label, dir: 'toggle' });
          if (opts.onToggle) opts.onToggle();
        });
      },
      bindYear(el, year) {
        yearEls.set(year, el);
        return on(el, () => {
          env.log('select', { what: label, year });
          if (opts.onYear) opts.onYear(year);
        });
      },
      clear() {
        days.clear();
        navs.clear();
        yearEls.clear();
        toggleEl = null;
      },

      // ---- locate
      locateDay(iso) {
        const cells = (days.get(iso) || []).filter((c) => shown(c.el));
        const c = cells.find((x) => x.inMonth) || cells[0];
        return where(c && c.el, `${label} day ${iso}`);
      },
      locateNav: (dir) => pick(navs, dir, `nav ${dir}`),
      locateToggle: () => where(toggleEl, `${label} toggle`),
      locateYear: (y) => pick(yearEls, y, `year ${y}`),
    };
  };
  ui.calendar.math = MATH;
  // Cross-check another implementation (e.g. a task's days/fromDays/weekday) against the built-in
  // arithmetic over a day range; returns failure strings (empty when they agree).
  ui.calendar.check = function check(math, from = '2019-12-01', to = '2033-01-31') {
    const out = [];
    for (let n = MATH.days(from); n <= MATH.days(to) && out.length < 5; n++) {
      const iso = MATH.fromDays(n);
      if (math.fromDays && math.fromDays(n) !== iso) out.push(`fromDays(${n}): ${math.fromDays(n)} != ${iso}`);
      if (math.days && math.days(iso) !== n) out.push(`days(${iso}): ${math.days(iso)} != ${n}`);
      if (math.weekday && math.weekday(iso) !== MATH.weekday(iso)) out.push(`weekday(${iso}): ${math.weekday(iso)} != ${MATH.weekday(iso)}`);
    }
    if (MATH.weekday('2026-10-13') !== 2) out.push('built-in weekday(2026-10-13) is not Tuesday');
    return out;
  };

  // ---------------------------------------------------------------- spinner

  ui.spinner = function spinner(opts = {}) {
    const label = opts.label || 'spinner';
    const step = opts.step || 1;
    const min = opts.min === undefined ? -Infinity : opts.min;
    const max = opts.max === undefined ? Infinity : opts.max;
    let value = opts.value === undefined ? (Number.isFinite(min) ? min : 0) : opts.value;

    function next(v, dir) {
      const x = v + (dir === 'up' ? step : -step);
      if (opts.wrap && Number.isFinite(min) && Number.isFinite(max)) {
        const span = max - min + step;
        return ((((x - min) % span) + span) % span) + min;
      }
      return clamp(x, min, max);
    }
    function press(dir) {
      const n = next(value, dir);
      env.log('step', { what: label, dir, value: n });
      if (opts.onStep) opts.onStep(dir, n);
      if (n !== value) {
        value = n;
        if (opts.onChange) opts.onChange(n, dir);
      }
    }
    if (opts.up) opts.up.addEventListener('click', () => press('up'));
    if (opts.down) opts.down.addEventListener('click', () => press('down'));
    if (opts.keyboard && opts.field) {
      onKeys(opts.field, { ArrowUp: () => press('up'), ArrowDown: () => press('down') });
    }
    return {
      get: () => value,
      set(v) { value = v; },
      next,
      locate(which) {
        const el = which === 'up' ? opts.up : which === 'down' ? opts.down : opts.field;
        return where(el, `${label} ${which}`);
      },
    };
  };
})();
