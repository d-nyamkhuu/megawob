// use-desktop-tools/base: the base site's use-desktop-tools widgets (workspace) as a template. This file is their source. The
// design-* sites that started from a copy of them, and the composite sites that embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/use-desktop-tools.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/use-desktop-tools.js (what
// document.currentScript was for the reference file). design.parts replaces units of it: { '<key>': (base, S) =>
// replacement }, where base is the unit's reference value (functions and widget props) and S the scope of the unit's
// IIFE (getters for its top-level names, setters for its lets). Keys: top-level functions, constants and lets by name
// (name@<iife> when the name repeats), other top-level statements as stmt<iife>.<n>, widget props as <widget name>.<prop>
// (a new prop adds it), and '+<iife>.<name>' for a function, constant or let a design adds (read through S, built on
// first read; a let can be assigned). Editing this code and its unit hooks: templates/README.md, "Reference
// templates".
// The _base-*.js libraries hold the builders; _styles.js and _shared.js hold shared defaults.
// Unit hooks stay here, so every existing design override keeps its name and scope.
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/use-desktop-tools.js`, HTML).href };
    /*
     * reference / use-desktop-tools / workspace: one desktop-style "Workspace" app window (title bar, an activity rail with
     * one entry per tool and a settings gear, the tool's pane). The window is sized from ctx.size and placed at a
     * sampled position inside the stage. Mechanics per scenario:
     *   tree / files / move   an Explorer pane drawn from taskDef.helpers.rows() (folders first, then files; lazy folders
     *             show a clock-driven spinner row while loading). The list scrolls natively (wheel); visible rows are
     *             mirrored into model.view for the plan. tree: clicking a file opens it in the preview (recoverable:
     *             with a Back button); arrow keys when spec.keys. files: click selects, double-click / F2 starts an
     *             inline rename field, right-click opens a drawn context menu (Rename, Delete, New folder, decoys),
     *             Delete key deletes; deletes show a toast (Undo when recoverable). move: press on a file, drag
     *             (a ghost follows the pointer), hovering a closed folder springs it open on the kit clock, release
     *             on a folder (or on a file: its folder; on empty space: the root).
     *   terminal  a dark shell pane; the command line is a native <input> (env.ui.textField), Enter runs it through
     *             taskDef.helpers.run(); the output scrolls natively and follows the prompt.
     *   editor    a toolbar (size menu, B / I / U, color menu, alignment, bullet / numbered lists, undo / redo) over a
     *             page of paragraphs, one span per character, bound with env.ui.textSelection (drag to select;
     *             list markers are skipped). Ctrl+B/I/U/Z/Y work too.
     *   calendar  a 24 h day view in a scroller (wheel) with a custom scrollbar (env.ui.slider); dragging over the
     *             time column drafts an event; a side form names and creates it.
     *   week      a week grid (5 or 7 day columns, scroller + custom scrollbar); dragging an event's body moves it
     *             (day by column, time by row), dragging its bottom edge resizes it; an Undo toast follows changes.
     *   prefs     a home pane behind a modal Preferences dialog (opened from the rail gear or the title menu) with
     *             top or side tabs, switches / checkboxes / segmented controls / dropdowns / number steppers, and a
     *             footer whose Save is disabled until something changed.
     * locate() checks with elementFromPoint and picks a point of the target that nothing (e.g. a floating end
     * control) covers.
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get ICON() { return ICON; },
        get svg() { return svg; },
        get CHEV() { return CHEV; },
        get CARET() { return CARET; },
        get FOLDER() { return FOLDER; },
        get EXT_COLOR() { return EXT_COLOR; },
        get FILE() { return FILE; },
        get SPIN() { return SPIN; },
        get PROJECTS() { return PROJECTS; },
        get TITLES() { return TITLES; },
        get RAIL() { return RAIL; },
        get clamp() { return clamp; },
        get same() { return same; },
        get isField() { return isField; },
        get fail() { return fail; },
        get BUILDERS() { return BUILDERS; },
        get view() { return view; }, set view(v) { view = v; },
        get wired() { return wired; }, set wired(v) { wired = v; },
        get guard() { return guard; },
        get wire() { return wire; },
        get ensureStyle() { return ensureStyle; },
        get hitPoint() { return hitPoint; },
        get freeAt() { return freeAt; },
        get frame() { return frame; },
        get buildTree() { return buildTree; },
        get buildTerminal() { return buildTerminal; },
        get buildEditor() { return buildEditor; },
        get scrollGrid() { return scrollGrid; },
        get buildCalendar() { return buildCalendar; },
        get buildWeek() { return buildWeek; },
        get buildPrefs() { return buildPrefs; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('guard')) guard = __parts['guard'](guard, __scope);
      if (__has('wire')) wire = __parts['wire'](wire, __scope);
      if (__has('ensureStyle')) ensureStyle = __parts['ensureStyle'](ensureStyle, __scope);
      if (__has('hitPoint')) hitPoint = __parts['hitPoint'](hitPoint, __scope);
      if (__has('freeAt')) freeAt = __parts['freeAt'](freeAt, __scope);
      if (__has('frame')) frame = __parts['frame'](frame, __scope);
      if (__has('buildTree')) buildTree = __parts['buildTree'](buildTree, __scope);
      if (__has('buildTerminal')) buildTerminal = __parts['buildTerminal'](buildTerminal, __scope);
      if (__has('buildEditor')) buildEditor = __parts['buildEditor'](buildEditor, __scope);
      if (__has('scrollGrid')) scrollGrid = __parts['scrollGrid'](scrollGrid, __scope);
      if (__has('buildCalendar')) buildCalendar = __parts['buildCalendar'](buildCalendar, __scope);
      if (__has('buildWeek')) buildWeek = __parts['buildWeek'](buildWeek, __scope);
      if (__has('buildPrefs')) buildPrefs = __parts['buildPrefs'](buildPrefs, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('use-desktop-tools/_styles').referenceCSS);

      const ICON = __has('ICON') ? __parts['ICON'](undefined, __scope) : (env.templateLib('use-desktop-tools/_shared').ICON);
      const svg = __has('svg') ? __parts['svg'](undefined, __scope) : env.templateLib('use-desktop-tools/_shared').svg;
      const CHEV = __has('CHEV') ? __parts['CHEV'](undefined, __scope) : (svg('<path d="M6 3.5L10.5 8 6 12.5"/>', 16, 'class="chev"'));
      const CARET = __has('CARET') ? __parts['CARET'](undefined, __scope) : (svg('<path d="M4 6l4 4 4-4"/>', 16));
      const FOLDER = __has('FOLDER') ? __parts['FOLDER'](undefined, __scope) : env.templateLib('use-desktop-tools/_shared').FOLDER_SVG;
      const EXT_COLOR = __has('EXT_COLOR') ? __parts['EXT_COLOR'](undefined, __scope) : (env.templateLib('use-desktop-tools/_shared').EXT_COLOR);
      const FILE = __has('FILE') ? __parts['FILE'](undefined, __scope) : { FILE: (name, cls = 'ico') => {
        const m = /\.(tar\.gz|[A-Za-z0-9]+)$/.exec(name);
        const c = EXT_COLOR[m ? m[1].toLowerCase() : ''] || '#868e96';
        return env.templateLib('use-desktop-tools/_shared').FILE_SVG(name, cls, c);
      } }.FILE;
      const SPIN = __has('SPIN') ? __parts['SPIN'](undefined, __scope) : env.templateLib('use-desktop-tools/_shared').SPIN;
      const PROJECTS = __has('PROJECTS') ? __parts['PROJECTS'](undefined, __scope) : (env.templateLib('use-desktop-tools/_shared').PROJECTS);
      const TITLES = __has('TITLES') ? __parts['TITLES'](undefined, __scope) : ({ tree: 'Files', files: 'Files', move: 'Files', terminal: 'Terminal', editor: 'Notes', calendar: 'Calendar', week: 'Calendar', prefs: 'Home' });
      const RAIL = __has('RAIL') ? __parts['RAIL'](undefined, __scope) : ({ tree: 'files', files: 'files', move: 'files', terminal: 'terminal', editor: 'editor', calendar: 'calendar', week: 'calendar', prefs: 'home' });

      let view = __has('view') ? __parts['view'](undefined, __scope) : (null); // live episode: { sync(m), locate(t), onKey?(e), onDown?(e), onMove?(e), onUp?(e) }
      let wired = __has('wired') ? __parts['wired'](undefined, __scope) : (false);
      // confirm judge episodes: the irreversible press (a file opened / deleted, the rm run, the settings saved) ends the
      // episode with reward 0; the task says when it has happened (taskDef.helpers.changed).
      function guard(ctx, prev, next) {
        const spec = ctx.spec;
        if (!spec.judge || spec.judge.mode !== 'confirm') return;
        const F = env.taskDef.helpers;
        if (!F.changed(prev, spec) && F.changed(next, spec)) ctx.flag('irreversible');
      }

      function wire() {
        if (wired) return;
        wired = true;
        window.addEventListener('keydown', (e) => { if (view && view.onKey) view.onKey(e); });
        window.addEventListener('pointerdown', (e) => { if (view && view.onDown) view.onDown(e); });
        window.addEventListener('pointermove', (e) => { if (view && view.onMove) view.onMove(e); });
        window.addEventListener('pointerup', (e) => { if (view && view.onUp) view.onUp(e); });
      }

      function ensureStyle() {
        if (document.getElementById('at-style')) return;
        const s = document.createElement('style');
        s.id = 'at-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      const clamp = __has('clamp') ? __parts['clamp'](undefined, __scope) : env.templateLib('use-desktop-tools/_shared').clamp;
      const same = __has('same') ? __parts['same'](undefined, __scope) : env.templateLib('use-desktop-tools/_shared').same;
      const isField = __has('isField') ? __parts['isField'](undefined, __scope) : env.templateLib('use-desktop-tools/_shared').isField;

      // A viewport point inside el that is not covered by something else (a floating end control, a toast).
      function hitPoint(el, fx = [0.5, 0.3, 0.7, 0.15, 0.85], fy = [0.5, 0.3, 0.7]) { return env.templateLib('use-desktop-tools/_shared').hitPoint(...arguments); }
      // Point (x, y) is usable when the element at it belongs to `owner`.
      function freeAt(owner, x, y) { return env.templateLib('use-desktop-tools/_shared').freeAt(...arguments); }

      function frame(ctx) {
        const { util, spec, rng, size } = ctx;
        const W = size.width;
        const H = size.height;
        const maxW = Math.max(300, W - 20);
        const maxH = Math.max(300, H - 16);
        const w = Math.round(Math.min(maxW, Math.max(Math.min(maxW, 780), maxW * rng.float(0.82, 1))));
        const h = Math.round(Math.min(maxH, Math.max(Math.min(maxH, 470), maxH * rng.float(0.86, 1))));
        const ax = rng.pick([0, 0.5, 1, rng.float()]);
        const ay = rng.pick([0, 0.5, 1, rng.float()]);
        const win = util.el('div', 'at-win', ctx.stage);
        Object.assign(win.style, { width: `${w}px`, height: `${h}px`, left: `${Math.round(10 + (W - 20 - w) * ax)}px`, top: `${Math.round(8 + (H - 16 - h) * ay)}px` });
        if (W - 20 < w) win.style.left = `${Math.max(0, Math.round((W - w) / 2))}px`;
        if (H - 16 < h) win.style.top = `${Math.max(0, Math.round((H - h) / 2))}px`;
        const title = util.el('div', 'at-title', win);
        util.el('div', 'at-dots', title).innerHTML = '<i></i><i></i><i></i>';
        let appMenu = null;
        if (spec.scenario === 'prefs' && spec.opener === 'menu') {
          appMenu = util.el('button', 'at-appmenu', title, `${rng.pick(['Workspace', 'App', 'File'])} ▾`);
          appMenu.type = 'button';
        }
        util.el('b', '', title, `${TITLES[spec.scenario]} — ${rng.pick(['Workspace', 'Workbench', 'Desk'])}`);
        const body = util.el('div', 'at-body', win);
        const rail = util.el('nav', 'at-rail', body);
        const on = RAIL[spec.scenario];
        for (const k of ['home', 'files', 'terminal', 'editor', 'calendar', 'search']) {
          util.el('span', k === on ? 'on' : '', rail).innerHTML = svg(ICON[k]);
        }
        const gear = util.el('span', 'end', rail);
        gear.innerHTML = svg(ICON.gear);
        gear.title = 'Settings';
        gear.dataset.role = 'settings';
        const main = util.el('div', 'at-main', body);
        return { win, main, gear, appMenu, title };
      }

      const fail = __has('fail') ? __parts['fail'](undefined, __scope) : { fail: (t) => { throw new Error(`use-desktop-tools/workspace cannot locate ${JSON.stringify(t)}`); } }.fail;

      // ================================================================ tree, files, move

      function buildTree(ctx, main) {
        return env.templateLib('use-desktop-tools/_base-explorer').build(ctx, main, __scope);
      }

      // ================================================================ terminal

      function buildTerminal(ctx, main) {
        return env.templateLib('use-desktop-tools/_base-terminal').build(ctx, main, __scope);
      }

      // ================================================================ editor

      function buildEditor(ctx, main) {
        return env.templateLib('use-desktop-tools/_base-editor').build(ctx, main, __scope);
      }

      // ================================================================ calendar (day)

      function scrollGrid(ctx, fr, sc, rows, rowH, N) {
        const sb = ctx.util.el('div', 'at-sb', fr);
        const thumb = ctx.util.el('i', '', sb);
        const thumbH = Math.max(28, Math.round((rows * rowH * rows) / N));
        thumb.style.height = `${thumbH}px`;
        const maxTop = N - rows;
        const slider = env.ui.slider(sb, {
          thumbs: [thumb],
          min: 0,
          max: maxTop,
          step: 1,
          values: [0],
          orientation: 'vertical-reverse',
          inset: thumbH / 2,
          label: 'scrollbar',
          place(el, p) {
            const r = sb.getBoundingClientRect();
            el.style.top = `${(p[1] - r.top - thumbH / 2).toFixed(2)}px`;
          },
          onInput: (vals) => {
            sc.scrollTop = vals[0] * rowH;
            report();
          },
        });
        function report() {
          const top = Math.round((sc.scrollTop / rowH) * 1000) / 1000;
          slider.set([top]);
          const v = ctx.model.view;
          if (v.top === top && v.bottom === top + rows && v.px === rowH) return;
          ctx.update({ ...ctx.model, view: { top, bottom: top + rows, px: rowH } });
        }
        sc.addEventListener('scroll', report);
        const scrollTo = (top) => {
          const want = Math.max(0, Math.min(maxTop, top));
          if (Math.abs(sc.scrollTop / rowH - want) > 1e-3) sc.scrollTop = want * rowH;
        };
        return { slider, report, scrollTo, maxTop };
      }

      function buildCalendar(ctx, main) {
        return env.templateLib('use-desktop-tools/_base-calendar').build(ctx, main, __scope);
      }

      // ================================================================ week

      function buildWeek(ctx, main) {
        return env.templateLib('use-desktop-tools/_base-week').build(ctx, main, __scope);
      }

      // ================================================================ prefs

      function buildPrefs(ctx, main, chrome) {
        return env.templateLib('use-desktop-tools/_base-prefs').build(ctx, main, chrome, __scope);
      }

      const BUILDERS = __has('BUILDERS') ? __parts['BUILDERS'](undefined, __scope) : ({ tree: buildTree, files: buildTree, move: buildTree, terminal: buildTerminal, editor: buildEditor,
        calendar: buildCalendar, week: buildWeek, prefs: buildPrefs });

      env.widget({
        task: 'use-desktop-tools',
        site: 'base',
        name: 'workspace',
        split: 'train',
        scenarios: ['tree', 'files', 'move', 'terminal', 'editor', 'calendar', 'week', 'prefs'],

        render(ctx) {
          ensureStyle();
          wire();
          view = null;
          const chrome = frame(ctx);
          if (ctx.spec.scenario !== 'prefs') chrome.gear.addEventListener('click', () => env.log('decoy', { what: 'settings' }));
          view = BUILDERS[ctx.spec.scenario](ctx, chrome.main, chrome);
          return { anchors: [chrome.win], sync: (m) => view.sync(m) };
        },

        locate(t) {
          return (view && view.locate(t)) || fail(t);
        },
      });
    })();

    return captured;
  }
  env.template('use-desktop-tools/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`use-desktop-tools/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('use-desktop-tools/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`use-desktop-tools/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`use-desktop-tools/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ["use-desktop-tools/_styles","use-desktop-tools/_shared","use-desktop-tools/_base-explorer","use-desktop-tools/_base-terminal","use-desktop-tools/_base-editor","use-desktop-tools/_base-calendar","use-desktop-tools/_base-week","use-desktop-tools/_base-prefs"] });
})();
