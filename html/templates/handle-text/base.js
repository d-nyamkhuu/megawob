// handle-text/base: the base site's handle-text widgets (editor) as a template. This file is their source. The design-*
// sites that started from a copy of them, and the composite sites that embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/handle-text.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/handle-text.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/handle-text.js`, HTML).href };
    /*
     * reference / handle-text / editor: a small "editor" window (title bar with a file name, a body, a status
     * strip) for every handle-text scenario, placed absolutely inside the stage (sized from ctx.size, kept clear of
     * a floating end control, sampled alignment; rebuilt tighter when it does not fit). Mechanics come from
     * env.ui (kit/ui): textSelection on source boxes and documents (drag selection, plus Control+A inside a
     * focused box selecting only that box), textField on text inputs, listbox on the scrolling text,
     * agreement and document panes (a custom scrollbar, or in about half of the wheel-route episodes the
     * native thin scrollbar only).
     *
     * Page-level clipboard (documented in tasks/handle-text/logic.js): document copy / cut / paste listeners.
     * Copy (Control+C) of a selection in a source box stores the exact source text; copy or cut inside a text
     * input stores that input's selected text (a native cut then removes it); any other page selection
     * stores its whitespace-normalized string. Paste (Control+V) into an enabled text input inserts the page
     * clipboard at the caret (setRangeText + an input event) and never reads the system clipboard.
     *
     * Scenario notes: unicode 'button' and sign-agreement show a result line with an Undo for a pending wrong
     * choice (recoverable episodes); spinner buttons step on press and auto-repeat while held (the task's
     * tick on the kit clock; release anywhere stops), the field takes ArrowUp / ArrowDown, and editable
     * spinners accept typed numbers on the step grid; edit fields mirror focus, caret and selection into the
     * model, and the 'undo' field keeps the page's own Control+Z history; find 'pane' mirrors where the phrase
     * is (above / in view / below), find 'page' renders the document in the page flow (the widget is scrollable).
     * Layouts vary per seed: boxes in a row, column or 2-up grid, the field before or after the boxes, box
     * widths, fonts, line heights, numbered gutters, spinner style (stacked arrows or - / +).
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get UP_SVG() { return UP_SVG; },
        get DN_SVG() { return DN_SVG; },
        get FONTS() { return FONTS; },
        get fam() { return fam; },
        get live() { return live; },
        get isTextInput() { return isTextInput; },
        get up() { return up; },
        get sameSel() { return sameSel; },
        get modelSel() { return modelSel; },
        get ofEpisode() { return ofEpisode; },
        get BUILD() { return BUILD; },
        get st() { return st; }, set st(v) { st = v; },
        get installed() { return installed; }, set installed(v) { installed = v; },
        get measurer() { return measurer; }, set measurer(v) { measurer = v; },
        get ensureStyle() { return ensureStyle; },
        get liveSel() { return liveSel; },
        get copied() { return copied; },
        get onCopy() { return onCopy; },
        get onPaste() { return onPaste; },
        get install() { return install; },
        get usable() { return usable; },
        get caretPoint() { return caretPoint; },
        get frame() { return frame; },
        get statusBar() { return statusBar; },
        get fieldRow() { return fieldRow; },
        get resultLine() { return resultLine; },
        get lineBox() { return lineBox; },
        get scrollLoc() { return scrollLoc; },
        get sourceBox() { return sourceBox; },
        get buildCopy() { return buildCopy; },
        get buildButtons() { return buildButtons; },
        get buildScroll() { return buildScroll; },
        get buildSign() { return buildSign; },
        get buildSpinner() { return buildSpinner; },
        get buildEdit() { return buildEdit; },
        get buildFind() { return buildFind; },
        get makeLook() { return makeLook; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('ensureStyle')) ensureStyle = __parts['ensureStyle'](ensureStyle, __scope);
      if (__has('liveSel')) liveSel = __parts['liveSel'](liveSel, __scope);
      if (__has('copied')) copied = __parts['copied'](copied, __scope);
      if (__has('onCopy')) onCopy = __parts['onCopy'](onCopy, __scope);
      if (__has('onPaste')) onPaste = __parts['onPaste'](onPaste, __scope);
      if (__has('install')) install = __parts['install'](install, __scope);
      if (__has('usable')) usable = __parts['usable'](usable, __scope);
      if (__has('caretPoint')) caretPoint = __parts['caretPoint'](caretPoint, __scope);
      if (__has('frame')) frame = __parts['frame'](frame, __scope);
      if (__has('statusBar')) statusBar = __parts['statusBar'](statusBar, __scope);
      if (__has('fieldRow')) fieldRow = __parts['fieldRow'](fieldRow, __scope);
      if (__has('resultLine')) resultLine = __parts['resultLine'](resultLine, __scope);
      if (__has('lineBox')) lineBox = __parts['lineBox'](lineBox, __scope);
      if (__has('scrollLoc')) scrollLoc = __parts['scrollLoc'](scrollLoc, __scope);
      if (__has('sourceBox')) sourceBox = __parts['sourceBox'](sourceBox, __scope);
      if (__has('buildCopy')) buildCopy = __parts['buildCopy'](buildCopy, __scope);
      if (__has('buildButtons')) buildButtons = __parts['buildButtons'](buildButtons, __scope);
      if (__has('buildScroll')) buildScroll = __parts['buildScroll'](buildScroll, __scope);
      if (__has('buildSign')) buildSign = __parts['buildSign'](buildSign, __scope);
      if (__has('buildSpinner')) buildSpinner = __parts['buildSpinner'](buildSpinner, __scope);
      if (__has('buildEdit')) buildEdit = __parts['buildEdit'](buildEdit, __scope);
      if (__has('buildFind')) buildFind = __parts['buildFind'](buildFind, __scope);
      if (__has('makeLook')) makeLook = __parts['makeLook'](makeLook, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('handle-text/_style').referenceCSS);

      const UP_SVG = __has('UP_SVG') ? __parts['UP_SVG'](undefined, __scope) : ('<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.8L6 4.3l3.5 3.5"/></svg>');
      const DN_SVG = __has('DN_SVG') ? __parts['DN_SVG'](undefined, __scope) : ('<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4.2L6 7.7l3.5-3.5"/></svg>');
      const FONTS = __has('FONTS') ? __parts['FONTS'](undefined, __scope) : ({
        sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        serif: 'Georgia, "DejaVu Serif", "Liberation Serif", serif',
        mono: '"DejaVu Sans Mono", "Liberation Mono", Menlo, monospace',
      });

      // Live episode state; the document listeners below outlive reset() and serve whatever is connected.
      let st = __has('st') ? __parts['st'](undefined, __scope) : (null);

      function ensureStyle() {
        if (document.getElementById('ut-style')) return;
        const s = document.createElement('style');
        s.id = 'ut-style';
        s.textContent = CSS;
        document.head.append(s);
      }

      const fam = __has('fam') ? __parts['fam'](undefined, __scope) : { fam: () => env.taskDef }.fam;
      const live = __has('live') ? __parts['live'](undefined, __scope) : { live: () => st && st.card && st.card.isConnected }.live;
      const isTextInput = __has('isTextInput') ? __parts['isTextInput'](undefined, __scope) : { isTextInput: (el) => !!(el && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search'))) && !el.disabled && !el.readOnly) }.isTextInput;
      const up = __has('up') ? __parts['up'](undefined, __scope) : { up: (patch) => st.ctx.update({ ...st.ctx.model, ...patch }) }.up;

      // ---------------------------------------------------------------- page clipboard

      // The selection inside exactly one source box as { box, start, end } (non-empty), or null.
      function liveSel() {
        return env.templateLib('handle-text/_clipboard').liveSel(__scope);
      }
      const sameSel = __has('sameSel') ? __parts['sameSel'](undefined, __scope) : { sameSel: (a, b) => (!a && !b) || (a && b && a.box === b.box && a.field === b.field && a.start === b.start && a.end === b.end) }.sameSel;
      // Edit scenario: the note box selection is stored as { box: true, ... }.
      const modelSel = __has('modelSel') ? __parts['modelSel'](undefined, __scope) : { modelSel: (s) => (s && st.editBox ? { box: true, start: s.start, end: s.end } : s) }.modelSel;

      function copied(text) {
        return env.templateLib('handle-text/_clipboard').copied(__scope, text);
      }

      function onCopy(e) {
        return env.templateLib('handle-text/_clipboard').onCopy(__scope, e);
      }

      function onPaste(e) {
        return env.templateLib('handle-text/_clipboard').onPaste(__scope, e);
      }

      let installed = __has('installed') ? __parts['installed'](undefined, __scope) : (false);
      function install() {
        return env.templateLib('handle-text/_clipboard').install(__scope);
      }

      // ---------------------------------------------------------------- geometry helpers

      // Usable part of the stage (stage-local px): the stage minus a floating end control inside it.
      function usable(ctx) {
        const box = { x: 0, y: 0, w: ctx.size.width, h: ctx.size.height };
        const sr = ctx.stage.getBoundingClientRect();
        const sub = env.submitEl && env.submitEl.getBoundingClientRect();
        if (sub && sub.width && sub.left < sr.right && sub.right > sr.left && sub.top < sr.bottom && sub.bottom > sr.top) {
          const cutH = sr.bottom - sub.top + 10;
          const cutW = sr.right - sub.left + 10;
          if (cutH * box.w <= cutW * box.h) box.h -= cutH;
          else box.w -= cutW;
        }
        return box;
      }

      // Viewport point of the caret boundary before character k of a single-line input.
      let measurer = __has('measurer') ? __parts['measurer'](undefined, __scope) : (null);
      function caretPoint(input, k) {
        if (!measurer || !measurer.isConnected) {
          measurer = document.createElement('span');
          measurer.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden;white-space:pre;';
          document.body.append(measurer);
        }
        const cs = getComputedStyle(input);
        // The computed `font` shorthand is empty when a longhand it cannot express is set (the checker's pinned
        // font-variant-ligatures), and an empty font would measure in the default face: copy the longhands.
        measurer.style.font = cs.font;
        if (!measurer.style.font) {
          measurer.style.fontFamily = cs.fontFamily;
          measurer.style.fontSize = cs.fontSize;
          measurer.style.fontWeight = cs.fontWeight;
          measurer.style.fontStyle = cs.fontStyle;
          measurer.style.fontStretch = cs.fontStretch;
        }
        measurer.style.letterSpacing = cs.letterSpacing;
        measurer.textContent = input.value.slice(0, k);
        const w = measurer.getBoundingClientRect().width;
        const r = input.getBoundingClientRect();
        const x = r.left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft) + w - input.scrollLeft;
        // The line of text is the input's content box: a design that pads a tall input unevenly (text at the top)
        // puts the box centre below the line, where a click lands past the end of the text.
        const top = r.top + parseFloat(cs.borderTopWidth) + parseFloat(cs.paddingTop);
        const bottom = r.bottom - parseFloat(cs.borderBottomWidth) - parseFloat(cs.paddingBottom);
        return [Math.min(r.right - 3, x), bottom > top ? (top + bottom) / 2 : r.top + r.height / 2];
      }

      // ---------------------------------------------------------------- shared pieces

      function frame(ctx, look, file, tag) {
        return env.templateLib('handle-text/_frame').frame(__scope, ctx, look, file, tag);
      }

      function statusBar(card, util, items) {
        return env.templateLib('handle-text/_frame').statusBar(__scope, card, util, items);
      }

      function fieldRow(ctx, parent, f, inline, id, onInput, value) {
        const { util } = ctx;
        const row = util.el('div', 'ut-fieldrow' + (inline ? ' inline' : ''), parent);
        const label = util.el('label', 'ut-label', row, f.label);
        const input = util.el('input', 'ut-input', row);
        input.type = 'text';
        input.id = `ut-${id}`;
        label.htmlFor = input.id;
        input.name = id;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('autocorrect', 'off');
        input.dataset.role = 'field';
        if (f.placeholder) input.placeholder = f.placeholder;
        const api = env.ui.textField(input, { value, label: id, onInput });
        return { row, input, api };
      }

      // A "result" line with an Undo button (recoverable wrong choices). Fixed height, always present.
      function resultLine(ctx, parent, onUndo) {
        return env.templateLib('handle-text/_frame').resultLine(__scope, ctx, parent, onUndo);
      }

      // Scroll events arrive a frame late, possibly after the next reset: drop those from a previous episode,
      // or they would write this episode's scroll fields into the next one's model.
      const ofEpisode = __has('ofEpisode') ? __parts['ofEpisode'](undefined, __scope) : { ofEpisode: (ctx, fn) => fn && ((...a) => { if (st && st.ctx === ctx) fn(...a); }) }.ofEpisode;

      // Scrolling line box: fixed-height lines, a custom scrollbar (or the native one), bound by env.ui.listbox.
      function lineBox(ctx, parent, lines, opts) {
        const { util } = ctx;
        const box = util.el('div', 'ut-scroll', parent);
        box.dataset.role = 'textbox';
        const list = util.el('div', 'ut-list' + (opts.numbered ? '' : ' plain') + (opts.native ? ' native' : ''), box);
        list.dataset.role = 'scrolltext';
        list.style.height = opts.rows * opts.lh + 'px';
        const els = lines.map((l, i) => {
          const row = util.el('div', 'ut-ln' + (opts.head && opts.head(l) ? ' head' : ''), list);
          if (opts.numbered) util.el('span', 'ut-num', row, String(i + 1));
          util.el('span', '', row, l || ' ');
          return [i, row];
        });
        let scrollbar = null;
        if (!opts.native) {
          const track = util.el('div', 'ut-track', box);
          track.dataset.role = 'scrollbar';
          const thumb = util.el('div', 'ut-thumb', track);
          thumb.dataset.role = 'thumb';
          scrollbar = { track, thumb, pad: 2, minThumb: 24, onDrag: (on) => thumb.classList.toggle('dragging', on) };
        }
        const lbx = env.ui.listbox(list, { label: 'text', options: els, onScroll: ofEpisode(ctx, opts.onScroll), scrollbar });
        return { box, list, lbx };
      }

      function scrollLoc(t, lbx, spec, list) {
        return env.templateLib('handle-text/_frame').scrollLoc(__scope, t, lbx, spec, list);
      }

      // Source box (selectable text with Control+A scoped to the box).
      function sourceBox(ctx, parent, b, i, onFocus, onSel) {
        const { util } = ctx;
        const text = util.el('div', 'ut-text' + (b.lines ? ' lines' + (b.numbered ? '' : ' plain') : ''), parent);
        text.tabIndex = 0;
        text.dataset.role = 'source';
        text.dataset.box = String(i);
        let segments;
        if (b.lines) {
          segments = [];
          let at = 0;
          b.lines.forEach((l, k) => {
            const row = util.el('div', 'ut-ln', text);
            if (b.numbered) util.el('span', 'ut-num', row, String(k + 1));
            const span = util.el('span', '', row, l);
            segments.push({ node: span, start: at });
            at += l.length + 1;
          });
        } else {
          text.textContent = b.text;
          segments = [{ node: text.firstChild, start: 0 }];
        }
        const sel = env.ui.textSelection(text, {
          segments,
          skip: '.ut-num',
          length: b.text.length,
          value: { start: 0, end: 0 },
          label: `box${i}`,
          onChange: () => onSel(),
        });
        text.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            sel.set({ start: 0, end: b.text.length });
            env.log('select', { what: `box${i}`, start: 0, end: b.text.length, all: true });
            onSel({ start: 0, end: b.text.length });
          }
        });
        text.addEventListener('focus', () => onFocus(true));
        text.addEventListener('blur', () => onFocus(false));
        return { text, sel };
      }

      // ---------------------------------------------------------------- copy tasks (and unicode 'type')

      function buildCopy(ctx, look) {
        const { spec, util } = ctx;
        const typed = !fam().helpers.isCopy(spec);
        const file = typed ? look.pick(['entry.txt', 'input.txt', 'untitled']) : look.pick(['clipboard.txt', 'notes.txt', 'scratch.md', 'untitled.txt']);
        const { card, body } = frame(ctx, look, file, typed ? 'UTF-8' : look.tag);
        st.copyModel = !typed;
        const fieldFirst = !typed && look.fieldFirst;
        function setFocus(f) {
          const m = st.ctx.model;
          if (m.focus !== f) st.ctx.update({ ...m, focus: f });
        }
        const field = () => {
          const fr = fieldRow(ctx, body, spec.field, look.inline, 'answer', (v) => {
            const m = st.ctx.model;
            if (m.field !== v) st.ctx.update({ ...m, field: v });
          }, ctx.model.field);
          st.field = fr;
          fr.input.addEventListener('focus', () => setFocus('field'));
          fr.input.addEventListener('blur', () => setFocus(null));
        };
        if (typed) {
          util.el('p', 'ut-sub', body, look.pick(['Unicode text is supported.', 'Any characters are allowed.', 'Type the text exactly.']));
          field();
          statusBar(card, util, ['UTF-8', 'Ln 1, Col 1', look.pick(['Plain text', 'Text'])]);
          return { card, loc: (t) => (t.field ? st.field.api.locate() : null), sync: (m) => st.field.api.set(m.field) };
        }
        if (fieldFirst) field();
        const wrapEl = util.el('div', 'ut-boxes ' + look.boxDir, body);
        st.sels = [];
        spec.boxes.forEach((b, i) => {
          const src = util.el('div', 'ut-src', wrapEl);
          util.el('div', 'ut-src-title', src, spec.refBy === 'ordinal' ? `${b.title} · ${i + 1}` : b.title);
          const { sel } = sourceBox(ctx, src, b, i, (on) => setFocus(on ? `box:${i}` : null), (v) => {
            const s = v ? { box: i, ...v } : liveSel();
            const mm = st.ctx.model;
            if (!sameSel(s, mm.sel)) st.ctx.update({ ...mm, sel: s });
          });
          const m = ctx.model;
          if (m.sel && m.sel.box === i) sel.set(m.sel);
          st.sels.push(sel);
        });
        if (!fieldFirst) field();
        statusBar(card, util, [`${spec.boxes.length} ${spec.boxes.length === 1 ? 'source' : 'sources'}`, 'Ctrl+C copy · Ctrl+V paste', 'UTF-8']);
        return {
          card,
          loc(t) {
            if (t.field) return st.field.api.locate();
            if (t.box !== undefined && t.char !== undefined) return st.sels[t.box].locateChar(t.char, t.edge);
            if (t.box !== undefined) return util.center(st.sels[t.box].container);
            return null;
          },
          sync(m) { st.field.api.set(m.field); },
        };
      }

      // ---------------------------------------------------------------- unicode buttons (unicode-test)

      function buildButtons(ctx, look) {
        return env.templateLib('handle-text/_views').buildButtons(__scope, ctx, look);
      }

      // ---------------------------------------------------------------- scroll-text

      function buildScroll(ctx, look) {
        const { spec, util } = ctx;
        const { card, body } = frame(ctx, look, look.pick(['readme.txt', 'chapter.txt', 'notes.txt', 'log.txt', 'draft.md']), look.tag);
        const holder = util.el('div', 'ut-body ' + (spec.mode === 'edge' ? 'col' : look.inline ? 'row' : 'col'), body);
        holder.style.padding = '0';
        const sb = lineBox(ctx, holder, spec.lines, {
          rows: spec.rows,
          lh: look.lh,
          numbered: spec.numbered,
          native: spec.route === 'wheel' && look.native,
          onScroll(i) {
            const s = Math.round(i * 1000) / 1000;
            const m = st.ctx.model;
            if (s !== m.scroll) st.ctx.update(fam().helpers.scrolled(m, spec, s));
          },
        });
        sb.lbx.set({ scroll: ctx.model.scroll });
        if (spec.mode !== 'edge') {
          const col = util.el('div', 'ut-body col', holder);
          col.style.padding = '0';
          st.field = fieldRow(ctx, col, spec.field, false, 'answer', (v) => {
            const m = st.ctx.model;
            if (m.field !== v) st.ctx.update({ ...m, field: v });
          }, ctx.model.field);
        }
        statusBar(card, util, [`${spec.lines.length} lines`, look.pick(['Read only', 'UTF-8', 'Plain text'])]);
        return {
          card,
          loc(t) {
            if (t.field) return st.field.api.locate();
            return scrollLoc(t, sb.lbx, spec, sb.list);
          },
          sync(m) {
            if (Math.abs(sb.lbx.scrollIndex() - m.scroll) > 0.01) sb.lbx.set({ scroll: m.scroll });
            if (st.field) st.field.api.set(m.field);
          },
        };
      }

      // ---------------------------------------------------------------- sign-agreement

      function buildSign(ctx, look) {
        const { spec, util } = ctx;
        const { card, body } = frame(ctx, look, look.pick(['agreement.pdf', 'terms.html', 'license.txt']), null);
        util.el('h2', 'ut-h', body, spec.heading);
        const sb = lineBox(ctx, body, spec.lines, {
          rows: spec.rows,
          lh: look.lh,
          numbered: false,
          native: spec.route === 'wheel' && look.native,
          head: (l) => /^\d+\. /.test(l),
          onScroll(i) {
            const s = Math.round(i * 1000) / 1000;
            const m = st.ctx.model;
            if (s !== m.scroll) {
              const n = fam().helpers.scrolled(m, spec, s);
              st.ctx.update(n);
              if (n.unlocked !== m.unlocked) paint(n);
            }
          },
        });
        sb.lbx.set({ scroll: ctx.model.scroll });
        const fr = fieldRow(ctx, body, spec.field, look.inline, 'name', (v) => {
          const m = st.ctx.model;
          if (m.name !== v && !m.pressed) st.ctx.update({ ...m, name: v });
        }, ctx.model.name);
        st.field = fr;
        const actions = util.el('div', 'ut-actions', body);
        const hint = util.el('span', 'ut-hint', actions, 'Scroll to the end of the agreement to continue.');
        const mk = (key, label, primary) => {
          const b = util.el('button', 'ut-btn' + (primary ? ' primary' : ''), actions, label);
          b.type = 'button';
          b.dataset.role = 'button';
          b.addEventListener('click', () => {
            const m = st.ctx.model;
            if (!m.unlocked || m.pressed) return;
            env.log('click', { what: key });
            const n = { ...m, pressed: key, signed: m.name };
            if (!fam().helpers.signCorrect(n, spec)) n.wrongs = (m.wrongs || 0) + 1;
            st.ctx.update(n);
            paint(st.ctx.model);
          });
          return b;
        };
        const order = look.agreeFirst ? [['agree', 'Agree', true], ['cancel', 'Cancel', false]] : [['cancel', 'Cancel', false], ['agree', 'Agree', true]];
        const btns = {};
        for (const [k, l, p] of order) btns[k] = mk(k, l, p);
        const res = resultLine(ctx, body, () => {
          const m = st.ctx.model;
          if (!fam().helpers.wrongPending(m, spec)) return;
          st.ctx.update({ ...m, pressed: null, signed: null });
          paint(st.ctx.model);
        });
        function paint(m) {
          const on = m.unlocked && !m.pressed;
          fr.input.disabled = !on;
          btns.agree.disabled = !on;
          btns.cancel.disabled = !on;
          hint.classList.toggle('ok', !!m.unlocked);
          hint.textContent = m.unlocked ? 'You have reached the end.' : 'Scroll to the end of the agreement to continue.';
          for (const k of ['agree', 'cancel']) btns[k].classList.toggle('pressed', m.pressed === k);
          if (!m.pressed) res.set('', 'Not signed yet.', false);
          else {
            const bad = fam().helpers.wrongPending(m, spec);
            const what = m.pressed === 'agree' ? `Signed by ${m.signed || '(no name)'}.` : 'You declined the agreement.';
            res.set(bad ? 'bad' : 'ok', what, bad && spec.recoverable);
          }
        }
        paint(ctx.model);
        statusBar(card, util, [`${spec.lines.length} lines`, look.pick(['Version 3.2', 'Effective immediately', 'Last updated: see section 1'])]);
        return {
          card,
          loc(t) {
            if (t.field) return fr.api.locate();
            if (t.button) return util.center(btns[t.button]);
            if (t.undo) return res.locate();
            return scrollLoc(t, sb.lbx, spec, sb.list);
          },
          sync(m) {
            if (Math.abs(sb.lbx.scrollIndex() - m.scroll) > 0.01) sb.lbx.set({ scroll: m.scroll });
            fr.api.set(m.name);
            paint(m);
          },
        };
      }

      // ---------------------------------------------------------------- spinner

      function buildSpinner(ctx, look) {
        const { spec, util } = ctx;
        const F = fam();
        const { card, body } = frame(ctx, look, look.pick(['settings', 'preferences.ini', 'options']), null);
        util.el('p', 'ut-sub', body, spec.editable ? look.pick(['Type a value or use the arrows.', 'Enter a number or step with the buttons.'])
          : look.pick(['Adjust the value with the arrows.', 'Hold a button to change the value faster.', 'Values change one step per click.']));
        const row = util.el('div', 'ut-fieldrow' + (look.inline ? ' inline' : ''), body);
        const label = util.el('label', 'ut-label', row, spec.label);
        const wrapEl = util.el('div', 'ut-spin ' + look.spin, row);
        const input = util.el('input', 'ut-input');
        input.type = 'text';
        input.readOnly = !spec.editable;
        input.id = 'ut-spin';
        input.autocomplete = 'off';
        input.spellcheck = false;
        label.htmlFor = input.id;
        input.dataset.role = 'field';
        if (spec.editable) input.style.cursor = 'text';
        const mkBtn = (cls, html) => {
          const b = util.el('button', 'ut-sb ' + cls);
          b.type = 'button';
          b.dataset.role = 'button';
          b.innerHTML = html;
          return b;
        };
        let upB;
        let downB;
        if (look.spin === 'stacked') {
          wrapEl.append(input);
          const arrows = util.el('div', 'ut-arrows', wrapEl);
          upB = mkBtn('up', UP_SVG);
          downB = mkBtn('dn', DN_SVG);
          arrows.append(upB, downB);
        } else {
          downB = mkBtn('dn', '−');
          upB = mkBtn('up', '+');
          wrapEl.append(downB, input, upB);
        }
        if (spec.unit) util.el('span', 'ut-unit', wrapEl, spec.unit);
        const clampV = (v) => Math.max(spec.min ?? -Infinity, Math.min(spec.max ?? Infinity, v));
        const show = (v) => { input.value = F.helpers.fmtSpin(spec, v); };
        st.spinHold = true;
        // Press: one step at once, then auto-repeat on the kit clock (task tick) until released.
        for (const [b, dir] of [[upB, 1], [downB, -1]]) {
          b.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            const m = st.ctx.model;
            const v = clampV(m.value + dir);
            env.log('step', { what: 'spinner', dir, value: v });
            st.ctx.update({ ...m, value: v, hold: { dir, since: st.ctx.clock(), n: 0 } });
            show(st.ctx.model.value);
          });
        }
        input.addEventListener('keydown', (e) => {
          if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
          e.preventDefault();
          const m = st.ctx.model;
          const v = clampV(m.value + (e.key === 'ArrowUp' ? 1 : -1));
          env.log('step', { what: 'spinner', key: e.key, value: v });
          if (v !== m.value) st.ctx.update({ ...m, value: v });
          show(st.ctx.model.value);
        });
        input.addEventListener('focus', () => { if (!st.ctx.model.focus) up({ focus: true }); });
        input.addEventListener('blur', () => {
          show(st.ctx.model.value);
          if (st.ctx.model.focus) up({ focus: false });
        });
        if (spec.editable) {
          input.addEventListener('input', () => {
            const t = F.helpers.parseSpin(spec, input.value);
            const m = st.ctx.model;
            if (t !== null && t !== m.value) st.ctx.update({ ...m, value: t });
          });
          input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); show(st.ctx.model.value); } });
        }
        show(ctx.model.value);
        const range = spec.min !== null || spec.max !== null
          ? `Range ${spec.min !== null ? F.helpers.fmtSpin(spec, spec.min) : '−∞'} – ${spec.max !== null ? F.helpers.fmtSpin(spec, spec.max) : '∞'}`
          : 'No limits';
        statusBar(card, util, [`Step ${F.helpers.fmtSpin(spec, 1)}${spec.unit ? ' ' + spec.unit : ''}`, range]);
        return {
          card,
          loc: (t) => (t.spin === 'up' ? util.center(upB) : t.spin === 'down' ? util.center(downB) : t.spin === 'value' ? util.center(input) : null),
          sync(m) {
            if (document.activeElement === input && spec.editable && F.helpers.parseSpin(spec, input.value) === m.value) return;
            show(m.value);
          },
        };
      }

      // ---------------------------------------------------------------- edit (caret, cut, undo, paste-at)

      function buildEdit(ctx, look) {
        return env.templateLib('handle-text/_views').buildEdit(__scope, ctx, look);
      }

      // ---------------------------------------------------------------- find (find in page)

      function buildFind(ctx, look) {
        return env.templateLib('handle-text/_views').buildFind(__scope, ctx, look);
      }

      // ---------------------------------------------------------------- widget

      function makeLook(rng, spec, box, squeeze) {
        const font = rng.pick(['sans', 'sans', 'serif', 'mono']);
        const fs = rng.pick([15, 16, 17]) - (squeeze > 1 ? 1 : 0);
        const r = rng.pick([6, 8, 10, 12]);
        const look = {
          pick: (xs) => rng.pick(xs),
          dots: rng.bool(0.6),
          tag: rng.pick([null, 'Edit', 'Read only', 'Draft']),
          fieldFirst: rng.bool(0.35),
          inline: rng.bool(0.45),
          primary: rng.bool(0.4),
          agreeFirst: rng.bool(0.5),
          native: rng.bool(0.55),
          spin: rng.pick(['stacked', 'split']),
          boxDir: 'row',
          lh: rng.int(24, 28) - (squeeze ? 3 : 0),
          align: [rng.pick(['start', 'center', 'center', 'end']), rng.pick(['start', 'center', 'center', 'end'])],
          jitter: [rng.float(-1, 1), rng.float(-1, 1)],
          paneW: Math.min(box.w - 90, rng.int(460, 640)),
          paneH: Math.max(160, Math.min(box.h - 190 + (squeeze ? 40 : 0), rng.int(260, 360))),
          vars: {},
        };
        const nBoxes = spec.boxes ? spec.boxes.length : 1;
        let bw = rng.int(260, 380);
        if (spec.scenario === 'copy-paste-2' || (spec.scenario === 'unicode' && spec.mode === 'button')) bw = rng.int(380, 480);
        if (spec.boxes && spec.boxes[0].lines) bw = 'max-content';
        bw = typeof bw === 'number' ? Math.min(bw, box.w - 90) : bw;
        // Several boxes sit in a row if they fit, else in a column (2 per row when there are many).
        const rowW = typeof bw === 'number' ? nBoxes * bw + (nBoxes - 1) * 18 + 60 : 0;
        look.boxDir = nBoxes > 1 && (rowW > box.w - 40 || rng.bool(0.35)) ? 'col' : 'row';
        if (look.boxDir === 'col' && nBoxes >= 4 && typeof bw === 'number') {
          look.boxDir = 'row wrap';
          bw = Math.min(bw, Math.floor((box.w - 110) / 2));
        }
        look.vars = {
          '--ut-r': `${r}px`,
          '--ut-pad': `${squeeze ? 14 : rng.int(18, 26)}px`,
          '--ut-gap': `${squeeze ? 10 : rng.int(12, 18)}px`,
          '--ut-fs': `${fs}px`,
          '--ut-lh': `${look.lh}px`,
          '--ut-font': FONTS[font],
          '--ut-bw': typeof bw === 'number' ? `${bw}px` : bw,
          '--ut-fw': `${Math.min(rng.int(280, 380), box.w - 120)}px`,
          '--ut-ih': `${squeeze ? 34 : rng.int(38, 44)}px`,
          '--ut-sw': `${rng.int(90, 140)}px`,
        };
        return look;
      }

      const BUILD = __has('BUILD') ? __parts['BUILD'](undefined, __scope) : ({
        'copy-paste': buildCopy,
        'copy-paste-2': buildCopy,
        unicode: (ctx, look) => (ctx.spec.mode === 'button' ? buildButtons(ctx, look) : buildCopy(ctx, look)),
        'scroll-text': buildScroll,
        'sign-agreement': buildSign,
        spinner: buildSpinner,
        edit: buildEdit,
        find: buildFind,
      });

      env.widget({
        task: 'handle-text',
        site: 'base',
        name: 'editor',
        split: 'train',
        scenarios: ['copy-paste', 'copy-paste-2', 'unicode', 'scroll-text', 'sign-agreement', 'spinner', 'edit', 'find'],
        // find-in-page 'page' mode: the document is a long page that scrolls as a whole.
        scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',

        render(ctx) {
          ensureStyle();
          install();
          const { spec } = ctx;
          const box = usable(ctx);
          // A scrollable page's stage is sized by its content: measure the room beside the site's side columns.
          let pageW = 0;
          if (ctx.episode && ctx.episode.scrollable) {
            const host = ctx.stage.parentElement;
            const sib = [...host.children].filter((e) => e !== ctx.stage).reduce((a, e) => a + e.getBoundingClientRect().width + 32, 0);
            pageW = Math.round(Math.max(420, Math.min(760, host.getBoundingClientRect().width - sib - 48)));
          }
          let view;
          let look;
          for (const squeeze of [0, 1, 2]) {
            // Same layout draws for every pass (the squeezed ones only tighten spacing).
            look = makeLook(ctx.rng.fork('look'), spec, box, squeeze);
            ctx.stage.replaceChildren();
            st = { ctx, clip: null, sels: null, field: null, copyModel: false, maxW: box.w - 60, pageW };
            view = BUILD[spec.scenario](ctx, look);
            st.card = view.card;
            if (view.page) break;
            view.card.style.position = 'absolute';
            view.card.style.maxWidth = `${box.w - 8}px`;
            const r = view.card.getBoundingClientRect();
            if (r.height <= box.h - 8 && r.width <= box.w - 8 && view.card.scrollWidth <= view.card.clientWidth + 1) break;
          }
          st.view = view;
          if (st.copyModel && ctx.model.clip !== null && ctx.model.clip !== undefined) st.clip = ctx.model.clip;
          if (!view.page) {
            // Place the window inside the usable box at a sampled alignment.
            const r = view.card.getBoundingClientRect();
            const w = Math.ceil(r.width);
            const h = Math.ceil(r.height);
            view.card.style.width = `${w}px`;
            const place = (a, room, size, j) => {
              const free = Math.max(0, room - size - 8);
              const base = a === 'start' ? 4 : a === 'end' ? free + 4 : free / 2 + 4;
              return Math.round(Math.max(4, Math.min(free + 4, base + j * Math.min(free / 4, 60))));
            };
            view.card.style.left = `${box.x + place(look.align[0], box.w, w, look.jitter[0])}px`;
            view.card.style.top = `${box.y + place(look.align[1], box.h, h, look.jitter[1])}px`;
          } else ctx.stage.style.alignItems = 'flex-start';
          if (view.after) view.after();
          return { anchors: [view.card], sync: (m) => view.sync(m) };
        },

        locate(t) {
          const p = st && st.view && st.view.loc(t);
          if (!p) throw new Error(`handle-text/editor cannot locate ${JSON.stringify(t)}`);
          return p;
        },
      });
    })();

    return captured;
  }
  env.template('handle-text/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`handle-text/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('handle-text/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`handle-text/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`handle-text/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ["handle-text/_style","handle-text/_clipboard","handle-text/_frame","handle-text/_views"] });
})();
