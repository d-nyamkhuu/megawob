/*
 * kit/ui/click.js: headless click-type widgets: buttons, tabs, collapsibles, dialogs, nested menus and
 * pie (radial) menus. Behavior and geometry only: nothing here creates visible elements, sets colors,
 * fonts, borders or sizes, or injects CSS. The widget builds every element; a primitive listens to them,
 * keeps the widget state, calls back, and answers locate() for the oracle.
 *
 * Conventions shared by every primitive below
 *   keys        parts are named by widget-chosen keys (strings or numbers). Where elements are passed as an
 *               array, keys come from opts.keys[i], else el.dataset.key, else the index i.
 *               dataset keys are always strings; pass opts.keys for numeric keys.
 *   show(el, visible, key)   widget-overridable; default sets el.hidden = !visible. Called for panels,
 *               submenus, dialog boxes and pie panels whenever they open or close.
 *   mark(el, state, key)     widget-overridable; default writes state as attributes (data-active,
 *               data-open, aria-selected, aria-expanded, ...), so a widget can style with attribute selectors.
 *   onChange    fires after a user gesture changed the state (not after set()); the widget then calls
 *               ctx.update(model). set(...) syncs the primitive from the model (call it from sync()).
 *   locate...   viewport px [x, y] of a semantic target, read from the live DOM (element centers), so
 *               widgets implement locate() by delegation. null when the target is not on screen.
 *   keyboard    handled only with opts.keyboard: true (pass it only when the task allows 'keyboard').
 *   clock       menu hover timing runs on the kit clock: pass opts.clock = ctx.clock and call poll() from
 *               the widget's sync(), which the kit calls after it advances time (only tasks with tick()
 *               advance time). hoverDelay 0 or no clock acts at once.
 *   Events go to env.log: 'click', 'open', 'close', 'select', 'tab', 'expand', 'collapse', 'result', ...
 *
 * env.ui.buttons(els, opts) -> { history(), set(history), locate(key), elements(key) }
 *   Click tracking over any clickable elements (buttons, links, widgets, text fields, shapes). Several
 *   elements may share a key (e.g. two "OK" buttons). history is the list of keys activated, in order,
 *   so sequences ("ONE, then TWO") are graded from it.
 *   els: array of elements, or { key: element | [elements] }.
 *   opts: keys[], on ('click' default | 'press' = pointerdown | 'focus' = the element receives focus),
 *         history (initial list), disabled(key) -> true ignores it (logged 'disabled'),
 *         onClick(key, history, el), onChange(history),
 *         hover (true: track the hovered key), onHover(key | null), mark(el, { clicked, hover }, key),
 *         label (log name), point(el, key) -> [x, y] (where to click a non-rectangular element, e.g. a
 *         ring wedge; default its bounding-box center).
 *   locate(key) is the click point of the first visible element with that key.
 *
 * env.ui.tabs(tabEls, panelEls, opts) -> { get(), set(key), locate(key) }
 *   One active tab, activated by a click; its panel is shown, the others hidden. panelEls[i] belongs to
 *   tabEls[i] (may be null). Tabs are marked with aria-selected and data-active.
 *   opts: keys[], value (active key, null = none), onChange(key, prev), show(panel, visible, key),
 *         keyboard, orientation ('horizontal' | 'vertical'), label.
 *   Keyboard: arrows move and activate, Home/End.
 *
 * env.ui.collapsible(header, body, opts) -> { get(), set(open), toggle(), locate() }
 *   A press on header toggles body. opts: open (bool), group (any shared object: opening one member
 *   closes the others = accordion), onChange(open), show(body, open), mark(header, open).
 *   locate() is the header's center.
 *
 * env.ui.dialog(el, opts) -> { isOpen(), open(), close(result), set(open), locate(result), locateOpener() }
 *   A dialog box el that opens from opener(s) and closes with a result.
 *   opts: open (default true), opener (element or [elements]), close (the "x" element; its result is
 *         closeResult, default 'close'), buttons ({ result: el } | [[result, el]] | [els with data-result]),
 *         backdrop (element shown with the dialog; a press on it is logged 'ignored'),
 *         onChange(open, result), show(el, open).
 *   locate(result) is that button's center ('close' or closeResult: the "x").
 *
 * env.ui.menu(trigger, opts) -> { get(), set(path), poll(), locate(key), locateTrigger(), visible(key) }
 *   Nested menus over widget-built elements. State is the open path: null = closed (only with a trigger),
 *   [] = the root panel open, [k1, k2] = submenu of k1 open and, inside it, the submenu of k2.
 *   trigger: element that toggles the root panel, or null when the root is always visible (menubar, list).
 *   opts: root (root panel element), items (tree: [{ key, el, panel?, children?: [...], disabled? }] where
 *         el is the item's row and panel the element holding its children), value (initial path),
 *         open ('hover' default | 'click': how submenus open; in hover mode a click opens at once too),
 *         hoverDelay (ms on opts.clock, default 300; hovering an item that long opens its submenu, or
 *         closes deeper submenus when it is a leaf), clock, onSelect(key, path) for a leaf click,
 *         onChange(path), show(panel, visible, key|null for root), keyboard (arrows, Enter, Escape).
 *   Selecting a leaf closes the menu; a press outside trigger and panels closes everything. Items are
 *   marked with data-open and data-active.
 *   Item keys must be unique in the tree. locate(key) is the item's center (null while hidden).
 *
 * env.ui.pieMenu(area, opts) -> { get(), set(open), locateOpen(), locate(key) }
 *   A radial menu: a press opens it around a point, the item is chosen by angle; the items cover the
 *   full circle. area: element receiving presses (keep panel and trigger inside it).
 *   opts: items (keys in angular order), slices (elements parallel to items, marked with data-active),
 *         panel (element shown while open; without a trigger its center goes to the press point through
 *         style.left/top, area-local px), trigger (element: a press on it opens the menu centered on the
 *         trigger; without a trigger a press anywhere in area opens it centered on the press point),
 *         constrain([x, y]) -> [x, y] (keep a press-point center inside the design), start (deg, center
 *         angle of item 0; 0 = 12 o'clock), dir (1 clockwise default, -1), inner / outer (radius px or
 *         functions; the dead zone and the outer edge of the slices; outer default Infinity),
 *         openAt() (no trigger: where locateOpen() presses, default the area's center),
 *         onSelect(key), onChange(open).
 *   Gestures: click to open then click a slice; or press, drag onto a slice and release (marking menu).
 *   Choosing a slice closes it; so does a press in the dead zone or outside the slices.
 *   locateOpen() is where to press to open (trigger / openAt() / area center); locate(key) is the middle
 *   of the item's slice around the current (or predicted) center.
 *   set(true) opens the menu without a press: around the last center if it was open before, else at
 *   locateOpen(), so a widget can start it open from its model state at build time. It is silent (no
 *   onChange); set(false) closes silently as before.
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});

  // ---------------------------------------------------------------- helpers

  const { visibleCenter: center, val, onKeys } = ui._base;
  const keyOf = (el, i, keys) => (keys && keys[i] !== undefined ? keys[i] : el && el.dataset && el.dataset.key !== undefined ? el.dataset.key : i);
  const attr = (el, name, on) => {
    if (!el) return;
    if (on) el.setAttribute(name, 'true');
    else el.removeAttribute(name);
  };
  const defaultShow = (el, visible) => { if (el) el.hidden = !visible; };
  const { sameJson } = env.util;

  // Document-level listener that removes itself once its widget leaves the DOM (widgets are rebuilt per episode).
  function docListener(type, owner, fn, capture = true) {
    const h = (e) => {
      if (!owner.isConnected) {
        document.removeEventListener(type, h, capture);
        return;
      }
      fn(e);
    };
    document.addEventListener(type, h, capture);
    return () => document.removeEventListener(type, h, capture);
  }

  // ---------------------------------------------------------------- buttons

  ui.buttons = function buttons(els, opts = {}) {
    const entries = []; // [key, el]
    if (Array.isArray(els)) els.forEach((el, i) => entries.push([keyOf(el, i, opts.keys), el]));
    else for (const [k, v] of Object.entries(els)) for (const el of [].concat(v)) entries.push([k, el]);
    let hist = (opts.history || []).slice();
    let hovered = null;
    const label = opts.label || 'button';
    const mark = opts.mark || ((el, s) => { attr(el, 'data-clicked', s.clicked); attr(el, 'data-hover', s.hover); });
    const paint = () => { for (const [k, el] of entries) mark(el, { clicked: hist.includes(k), hover: hovered === k }, k); };

    function activate(k, el) {
      if (opts.disabled && opts.disabled(k)) {
        env.log('disabled', { what: label, key: k });
        return;
      }
      hist = hist.concat([k]);
      env.log('click', { what: label, key: k });
      paint();
      if (opts.onClick) opts.onClick(k, hist.slice(), el);
      if (opts.onChange) opts.onChange(hist.slice());
    }

    const on = opts.on || 'click';
    for (const [k, el] of entries) {
      if (on === 'focus') el.addEventListener('focus', () => activate(k, el));
      else if (on === 'press') el.addEventListener('pointerdown', (e) => { if (e.button === 0) activate(k, el); });
      else el.addEventListener('click', (e) => { if (e.button === 0) activate(k, el); });
      if (opts.hover) {
        el.addEventListener('pointerenter', () => {
          if (hovered === k) return;
          hovered = k;
          paint();
          if (opts.onHover) opts.onHover(k);
        });
        el.addEventListener('pointerleave', (e) => {
          // Moving straight onto another element with the same key keeps the hover.
          const to = e.relatedTarget;
          if (to && entries.some(([k2, el2]) => k2 === k && el2.contains(to))) return;
          if (hovered !== k) return;
          hovered = null;
          paint();
          if (opts.onHover) opts.onHover(null);
        });
      }
    }
    paint();

    return {
      history: () => hist.slice(),
      set(h) { hist = (h || []).slice(); paint(); },
      elements: (k) => entries.filter(([k2]) => k2 === k).map(([, el]) => el),
      locate(k) {
        for (const [k2, el] of entries) if (k2 === k) { const c = center(el) && (opts.point ? opts.point(el, k2) : center(el)); if (c) return c; }
        return null;
      },
    };
  };

  // ---------------------------------------------------------------- tabs

  ui.tabs = function tabs(tabEls, panelEls, opts = {}) {
    const keys = tabEls.map((el, i) => keyOf(el, i, opts.keys));
    const panels = panelEls || [];
    let value = opts.value !== undefined ? opts.value : null;
    const show = opts.show || defaultShow;
    const mark = (el, active) => {
      el.setAttribute('aria-selected', active ? 'true' : 'false');
      attr(el, 'data-active', active);
    };
    const apply = () => keys.forEach((k, i) => {
      mark(tabEls[i], k === value);
      if (panels[i]) show(panels[i], k === value, k);
    });

    function activate(k, how) {
      if (k === value) return;
      const prev = value;
      value = k;
      apply();
      env.log('tab', { what: opts.label || 'tabs', key: k, how });
      if (opts.onChange) opts.onChange(k, prev);
    }

    tabEls.forEach((el, i) => {
      const k = keys[i];
      el.addEventListener('click', (e) => { if (e.button === 0) activate(k, 'click'); });
      if (opts.keyboard) {
        const vertical = opts.orientation === 'vertical';
        const go = (j) => () => {
          activate(keys[j], 'key');
          if (tabEls[j].focus) tabEls[j].focus();
        };
        onKeys(el, {
          [vertical ? 'ArrowDown' : 'ArrowRight']: go((i + 1) % keys.length),
          [vertical ? 'ArrowUp' : 'ArrowLeft']: go((i - 1 + keys.length) % keys.length),
          Home: go(0),
          End: go(keys.length - 1),
          Enter: go(i),
          ' ': go(i),
        });
      }
    });
    apply();

    return {
      get: () => value,
      set(k) { value = k; apply(); },
      locate(k) { const i = keys.indexOf(k); return i < 0 ? null : center(tabEls[i]); },
    };
  };

  // ---------------------------------------------------------------- collapsible

  ui.collapsible = function collapsible(header, body, opts = {}) {
    let open = !!opts.open;
    const show = opts.show || defaultShow;
    const mark = opts.mark || ((el, o) => el.setAttribute('aria-expanded', o ? 'true' : 'false'));
    const apply = () => { mark(header, open); show(body, open); };

    const self = {
      get: () => open,
      set(o) { open = !!o; apply(); },
      toggle() { change(!open); },
      locate: () => center(header),
      _notify(o) { change(o); },
    };
    function change(o) {
      if (o === open) return;
      if (o && opts.group) for (const m of opts.group.members || []) if (m !== self && m.get()) m._notify(false);
      open = o;
      apply();
      env.log(o ? 'expand' : 'collapse', { what: opts.label || 'section' });
      if (opts.onChange) opts.onChange(open);
    }
    if (opts.group) (opts.group.members = opts.group.members || []).push(self);

    header.addEventListener('click', (e) => { if (e.button === 0) change(!open); });
    apply();
    return self;
  };

  // ---------------------------------------------------------------- dialog

  ui.dialog = function dialog(el, opts = {}) {
    let open = opts.open !== undefined ? !!opts.open : true;
    const show = opts.show || defaultShow;
    const closeResult = opts.closeResult || 'close';
    const btns = []; // [result, el]
    const b = opts.buttons || [];
    if (Array.isArray(b)) {
      for (const x of b) {
        if (Array.isArray(x)) btns.push([x[0], x[1]]);
        else btns.push([x.dataset.result, x]);
      }
    } else for (const [r, e] of Object.entries(b)) btns.push([r, e]);
    if (opts.close) btns.push([closeResult, opts.close]);
    const openers = [].concat(opts.opener || []);

    const apply = () => {
      show(el, open);
      if (opts.backdrop) show(opts.backdrop, open);
    };
    function doOpen() {
      if (open) return;
      open = true;
      apply();
      env.log('open', { what: opts.label || 'dialog' });
      if (opts.onChange) opts.onChange(true, null);
    }
    function doClose(result) {
      if (!open) return;
      open = false;
      apply();
      env.log('result', { what: opts.label || 'dialog', result });
      if (opts.onChange) opts.onChange(false, result);
    }
    for (const o of openers) o.addEventListener('click', (e) => { if (e.button === 0) doOpen(); });
    for (const [r, e] of btns) e.addEventListener('click', (ev) => { if (ev.button === 0) doClose(r); });
    if (opts.backdrop) {
      opts.backdrop.addEventListener('pointerdown', (e) => {
        if (e.target === opts.backdrop) env.log('ignored', { what: 'backdrop' });
      });
    }
    apply();

    return {
      isOpen: () => open,
      open: doOpen,
      close: doClose,
      set(o) { open = !!o; apply(); },
      locate(r) {
        for (const [r2, e] of btns) if (r2 === r) return open ? center(e) : null;
        return null;
      },
      locateOpener: () => {
        for (const o of openers) { const c = center(o); if (c) return c; }
        return null;
      },
    };
  };

  // ---------------------------------------------------------------- menu

  ui.menu = function menu(trigger, opts = {}) {
    const nodes = new Map(); // key -> { key, el, panel, children, disabled, parent, depth }
    const byEl = new Map(); // row element -> key
    registerItems(opts.items, null, 0);
    const root = opts.root || null;
    const show = opts.show || defaultShow;
    const mark = (el, s) => { attr(el, 'data-open', s.open); attr(el, 'data-active', s.active); };
    const mode = opts.open || 'hover';
    const delay = opts.hoverDelay ?? 300;
    let path = opts.value !== undefined ? (opts.value && opts.value.slice()) : (trigger ? null : []);
    let active = null; // hovered item key
    let pending = null; // { key, t }
    const label = opts.label || 'menu';

    const ancestors = (k) => {
      const out = [];
      for (let p = nodes.get(k).parent; p !== null; p = nodes.get(p).parent) out.unshift(p);
      return out;
    };
    const visible = (k) => {
      if (path === null || !nodes.has(k)) return false;
      const a = ancestors(k);
      return a.every((p, i) => path[i] === p);
    };
    const innermost = (t) => {
      for (let e = t; e && e !== document; e = e.parentNode) if (byEl.has(e)) return byEl.get(e);
      return null;
    };

    const closed = () => (trigger ? null : []);

    if (trigger) bindTrigger();
    bindItems();
    const owner = trigger || root || (nodes.size && nodes.values().next().value.el);
    if (owner) bindOutsidePress();
    if (opts.keyboard) bindKeyboard();
    apply();

    return {
      get: () => path && path.slice(),
      set(p) { path = p && p.slice(); apply(); },
      poll() {
        if (!pending || !opts.clock) return;
        if (opts.clock() - pending.t < delay) return;
        const k = pending.key;
        pending = null;
        focusItem(k, 'hover');
      },
      visible,
      locate: (k) => (visible(k) ? center(nodes.get(k).el) : null),
      locateTrigger: () => center(trigger),
    };

    function apply() {
      if (trigger) attr(trigger, 'aria-expanded', path !== null);
      if (root) show(root, path !== null, null);
      for (const [k, n] of nodes) {
        const isOpen = path !== null && path[n.depth] === k && n.children.length > 0;
        if (n.panel) show(n.panel, isOpen && visible(k), k);
        mark(n.el, { open: isOpen, active: active === k });
      }
    }

    function setPath(p, why) {
      if (sameJson(p, path)) return;
      path = p && p.slice();
      apply();
      env.log(path === null ? 'close' : 'open', { what: label, path: path && path.slice(), why });
      if (opts.onChange) opts.onChange(path && path.slice());
    }

    // Hovering or clicking an item: a parent opens its submenu, a leaf closes deeper submenus.
    function focusItem(k, why) {
      if (!visible(k)) return;
      const n = nodes.get(k);
      const a = ancestors(k);
      if (n.children.length && !n.disabled) setPath(a.concat([k]), why);
      else if (path.length > a.length) setPath(a, why);
    }

    function select(k) {
      const n = nodes.get(k);
      if (n.disabled) {
        env.log('disabled', { what: label, key: k });
        return;
      }
      if (n.children.length) {
        const a = ancestors(k);
        if (mode === 'click' && path[n.depth] === k) setPath(a, 'click');
        else setPath(a.concat([k]), 'click');
        return;
      }
      const p = ancestors(k).concat([k]);
      env.log('select', { what: label, key: k });
      setPath(closed(), 'select');
      if (opts.onSelect) opts.onSelect(k, p);
    }

    function registerItems(items, parent, depth) {
      for (const it of items || []) {
        if (nodes.has(it.key)) throw new Error(`env.ui.menu: duplicate key ${it.key}`);
        const n = { ...it, parent, depth, children: it.children || [] };
        nodes.set(it.key, n);
        byEl.set(it.el, it.key);
        registerItems(it.children, it.key, depth + 1);
      }
    }

    function bindTrigger() {
      trigger.addEventListener('click', (e) => {
        if (e.button !== 0) return;
        setPath(path === null ? [] : null, 'trigger');
      });
    }

    function bindItems() {
      for (const [k, n] of nodes) {
        n.el.addEventListener('click', (e) => {
          if (e.button !== 0 || innermost(e.target) !== k || !visible(k)) return;
          pending = null;
          select(k);
        });
        n.el.addEventListener('pointerover', (e) => {
          if (innermost(e.target) !== k || active === k) return;
          active = k;
          apply();
          if (mode !== 'hover') return;
          if (!opts.clock || delay <= 0) focusItem(k, 'hover');
          else pending = { key: k, t: opts.clock() };
        });
        n.el.addEventListener('pointerout', (e) => {
          if (innermost(e.target) !== k) return;
          const to = innermost(e.relatedTarget);
          if (to !== null) return; // still on this item, or onto another one (its pointerover takes over)
          active = null;
          if (pending && pending.key === k) pending = null;
          apply();
        });
      }
    }

    function bindOutsidePress() {
      docListener('pointerdown', owner, (e) => {
        if (path === null || (trigger ? path === null : path.length === 0)) return;
        const t = e.target;
        if (trigger && trigger.contains(t)) return;
        if (root && root.contains(t)) return;
        for (const n of nodes.values()) if (n.el.contains(t) || (n.panel && n.panel.contains(t))) return;
        pending = null;
        setPath(closed(), 'outside');
      });
    }

    function bindKeyboard() {
      docListener('keydown', owner, (e) => {
        if (path === null) return;
        const level = active !== null && visible(active) ? active : null;
        const siblings = (k) => {
          const p = k === null ? null : nodes.get(k).parent;
          return [...nodes.values()].filter((n) => n.parent === p && visible(n.key)).map((n) => n.key);
        };
        if (e.key === 'Escape') setPath(path.length ? path.slice(0, -1) : closed(), 'key');
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          const sib = level !== null ? siblings(level) : [...nodes.values()].filter((n) => n.depth === path.length && visible(n.key)).map((n) => n.key);
          if (!sib.length) return;
          const i = level !== null ? sib.indexOf(level) : -1;
          const down = e.key === 'ArrowDown';
          active = i < 0 ? sib[down ? 0 : sib.length - 1] : sib[(i + (down ? 1 : sib.length - 1)) % sib.length];
          apply();
        } else if (e.key === 'ArrowRight' && level !== null) {
          focusItem(level, 'key');
          const n = nodes.get(level);
          if (n.children.length) { active = n.children[0].key; apply(); }
        } else if (e.key === 'ArrowLeft' && level !== null && nodes.get(level).parent !== null) {
          active = nodes.get(level).parent;
          setPath(ancestors(active), 'key');
          apply();
        } else if (e.key === 'Enter' && level !== null) select(level);
        else return;
        e.preventDefault();
      }, false);
    }
  };

  // ---------------------------------------------------------------- pie menu

  ui.pieMenu = function pieMenu(area, opts = {}) {
    const items = opts.items || [];
    const n = items.length;
    const w = 360 / Math.max(1, n);
    const start = opts.start ?? 0;
    const dir = opts.dir === -1 ? -1 : 1;
    const show = opts.show || defaultShow;
    // Without a trigger the panel follows the press point (area-local px).
    const place = () => {
      if (!opts.panel || opts.trigger) return;
      const r = area.getBoundingClientRect();
      opts.panel.style.left = c[0] - r.left - area.clientLeft + 'px';
      opts.panel.style.top = c[1] - r.top - area.clientTop + 'px';
    };
    let open = false;
    let c = null; // center in viewport px while open
    let active = null;

    const fixedCenter = () => (opts.trigger ? center(opts.trigger) : null);
    const areaCenter = () => center(area);
    function sliceAt([x, y]) {
      if (!c) return null;
      const dx = x - c[0];
      const dy = y - c[1];
      const r = Math.hypot(dx, dy);
      if (r < val(opts.inner, 0) || r > val(opts.outer, Infinity)) return null;
      const ang = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = up, clockwise
      const rel = (((dir * (ang - start) + w / 2) % 360) + 360) % 360;
      const i = Math.floor(rel / w);
      return i < n ? items[i] : null;
    }
    function paint() {
      if (opts.panel) show(opts.panel, open);
      (opts.slices || []).forEach((el, i) => el && attr(el, 'data-active', open && active === items[i]));
    }
    function doOpen(at) {
      c = at;
      place();
      open = true;
      active = null;
      paint();
      env.log('open', { what: opts.label || 'pie', at: c.map((v) => Math.round(v)) });
      if (opts.onChange) opts.onChange(true);
    }
    function doClose(why) {
      if (!open) return;
      open = false;
      active = null;
      paint();
      env.log('close', { what: opts.label || 'pie', why });
      if (opts.onChange) opts.onChange(false);
    }
    function choose(k) {
      env.log('select', { what: opts.label || 'pie', key: k });
      doClose('select');
      if (opts.onSelect) opts.onSelect(k);
    }

    function locateOpen() {
      if (opts.trigger) return center(opts.trigger);
      return opts.openAt ? opts.openAt() : areaCenter();
    }
    // Programmatic open (a scene start, a model sync): same state as a press at `at`, but silent (no
    // onChange, the caller already holds the model). Returns false when there is no point to open at.
    function openQuiet(at) {
      if (!at) return false;
      c = at.slice();
      if (opts.constrain) c = opts.constrain(c);
      place();
      open = true;
      active = null;
      paint();
      env.log('open', { what: opts.label || 'pie', at: c.map((v) => Math.round(v)), why: 'set' });
      return true;
    }

    let opened = false;
    ui.track(area, {
      start(p, e) {
        if (!open) {
          if (opts.trigger && !opts.trigger.contains(e.target)) return false;
          let at = fixedCenter() || [p.x, p.y];
          if (opts.constrain) at = opts.constrain(at);
          doOpen(at);
          opened = true;
        } else opened = false;
        return true;
      },
      move(p) {
        const k = sliceAt([p.x, p.y]);
        if (k !== active) { active = k; paint(); }
      },
      end(p) {
        const k = sliceAt([p.x, p.y]);
        if (opened) {
          if (k !== null) choose(k); // press-drag-release onto a slice
          return;
        }
        if (k !== null) choose(k);
        else doClose(Math.hypot(p.x - c[0], p.y - c[1]) < val(opts.inner, 0) ? 'center' : 'outside');
      },
    }, opts.label || 'pie');
    paint();

    return {
      get: () => ({ open, center: c && c.slice() }),
      set(o) {
        if (!o) { open = false; active = null; }
        else if (!open) {
          if (c) open = true;
          else if (!openQuiet(locateOpen())) return;
        }
        paint();
      },
      locateOpen,
      locate(k) {
        const i = items.indexOf(k);
        if (i < 0) return null;
        let cc = open ? c : fixedCenter() || (opts.openAt ? opts.openAt() : areaCenter());
        if (!open && opts.constrain && cc) cc = opts.constrain(cc);
        if (!cc) return null;
        const inner = val(opts.inner, 0);
        const outer = val(opts.outer, Infinity);
        const r = Number.isFinite(outer) ? (inner + outer) / 2 : inner + 40;
        const a = ((start + dir * i * w) * Math.PI) / 180;
        return [cc[0] + r * Math.sin(a), cc[1] - r * Math.cos(a)];
      },
    };
  };
})();
