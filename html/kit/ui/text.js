/*
 * kit/ui/text.js: headless text primitives (native text selection, text fields).
 * Behavior and geometry only: nothing here creates visible elements or sets colors, fonts or sizes.
 * The look of the selection is the widget's ::selection CSS; the look of a field is the widget's CSS.
 *
 * env.ui.textSelection(container, opts) -> { get(), set(v), read(), locate(t), locateChar(i, edge),
 *                                          offsetAt(node, off), pointAt(i), length }
 *   Binds the browser's native selection inside container (any markup: paragraphs, inline spans,
 *   columns, grids, soft-wrapped lines) to a range { start, end } (half-open, start <= end) of
 *   character offsets in a document string the widget owns (e.g. spec.doc).
 *   opts:
 *     segments   [{ node, start }]: node is a Text node, or an Element whose descendant text nodes
 *                (minus `skip`) are read in DOM order; its first character is document offset start
 *                and the following characters map 1:1. Offsets between segments (e.g. the '\n\n'
 *                between paragraphs) have no glyph. Default: every text node in container (minus
 *                `skip`), numbered contiguously from 0.
 *     skip       CSS selector for decorations inside container whose text is not document text (line
 *                numbers, markers, labels). They get user-select:none (a behavior, not a style), and a
 *                selection boundary inside them snaps to the start of the next segment.
 *     length     document length (default: end of the last segment); offsets are clamped to [0, length]
 *     value      initial { start, end }, applied to the DOM at once (start == end: nothing selected)
 *     onInput(v) every change of the mapped selection while a press that started in container is held
 *     onChange(v) the selection settled: on release (if it differs from the last committed value), or
 *                any change outside a gesture (double click, keyboard selection when the task allows it;
 *                read synchronously on keyup, not only on the asynchronous selectionchange)
 *     fresh      default true: a press inside container first clears the old selection, so every drag
 *                starts a new one (no drag-and-drop of selected text)
 *     label      event label (default 'text')
 *   Presses outside every live textSelection container (margins, buttons, the submit control) do not clear
 *   the selection, so the visible selection always equals the model. Presses on form fields (input,
 *   textarea, select, contenteditable) are let through.
 *   A selection that does not touch container is ignored (the value keeps its last state). dragstart of
 *   selected text inside container is cancelled. Logs 'select' { start, end } when a gesture commits.
 *   set(v) applies v to the DOM selection without calling back (use it in render and in sync()).
 *   read() maps the live DOM selection, or returns null if it does not touch container.
 *   locateChar(i, edge) -> [x, y]: viewport point just inside the left ('before') or right ('after')
 *   side of the glyph of doc[i], vertically centred on its line, chosen so that a press or release there
 *   puts the caret at offset i ('before') or i + 1 ('after'); verified with caretRangeFromPoint, so it
 *   holds for any font, wrapping, columns or transforms. An offset with no glyph snaps forward ('before')
 *   or backward ('after') to the nearest one. locate({ char, edge }) is the same (plan-target form).
 *   offsetAt(node, off) maps a DOM boundary point to a document offset; pointAt(i) maps back.
 *
 * env.ui.textField(el, opts) -> { get(), set(value), locate(), format(raw) }
 *   Binds a native <input>, <textarea> or contenteditable element to a string value.
 *   opts:
 *     value      initial value (written to the element)
 *     onInput(v) every edit, after filtering and masking (the value the element now shows)
 *     onChange(v) the edit settled (native 'change', i.e. blur after editing; blur for contenteditable)
 *     accept     RegExp tested against each typed character; others are dropped (e.g. /\d/ digits only)
 *     mask       pattern string: '9' a digit, 'a' a letter, '*' a letter or digit, anything else a literal
 *                separator inserted automatically once the next slot is filled ('99/99/9999',
 *                '(999) 999-9999', 'aa-9999'); typed separators are absorbed. Or a function
 *                (raw) -> formatted (e.g. upper-casing, thousands separators); the caret keeps its
 *                distance from the end.
 *     maxLength  truncate the (masked) value to this many characters
 *     label      event label (default: el.name || el.id || 'field')
 *   The field itself handles typing natively (the task must allow 'keyboard'). Logs 'focus'.
 *   set(value) writes the value without calling back (use it in sync()). format(raw) applies
 *   accept/mask/maxLength, so a widget can show a masked default or a task can type through it.
 *   locate() is the field's centre (where to click to focus it).
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});
  const { clamp, center } = ui._base;

  // ---------------------------------------------------------------- textSelection

  // Live instances; the document-level listeners below outlive reset() and serve whichever are connected.
  let live = [];
  const alive = () => (live = live.filter((s) => s.container.isConnected));
  const isField = (t) => !!(t && t.closest && t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'));

  let installed = false;
  function install() {
    if (installed) return;
    installed = true;
    document.addEventListener('selectionchange', () => { for (const s of alive()) s._sync(false); });
    // selectionchange fires asynchronously: settle keyboard selection (Shift+Arrows) on keyup too, so the model
    // never lags behind the page when the next action is planned right after a key press.
    document.addEventListener('keyup', () => { for (const s of alive()) s._sync(false); });
    window.addEventListener('pointerup', () => { for (const s of alive()) s._sync(true); });
    window.addEventListener('pointercancel', () => { for (const s of alive()) s._sync(true); });
    document.addEventListener('mousedown', (e) => {
      const ss = alive();
      if (!ss.length || isField(e.target)) return;
      if (ss.some((s) => s.container.contains(e.target))) return;
      e.preventDefault();
    }, true);
    document.addEventListener('dragstart', (e) => {
      if (alive().some((s) => s.container.contains(e.target))) e.preventDefault();
    }, true);
  }

  function textNodes(root, skip) {
    const out = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (skip && n.parentElement && n.parentElement.closest(skip) && root.contains(n.parentElement.closest(skip))
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n);
    return out;
  }

  ui.textSelection = function textSelection(container, opts = {}) {
    install();
    const skip = opts.skip || null;
    const label = opts.label || 'text';

    // Flatten segments to [{ node: Text, start }] in document order.
    const segs = [];
    collectSegments();
    if (!segs.length) throw new Error('textSelection: no text segments');
    const last = segs[segs.length - 1];
    const length = opts.length ?? last.start + last.node.data.length;
    if (skip) {
      for (const d of container.querySelectorAll(skip)) {
        d.style.userSelect = 'none';
        d.style.webkitUserSelect = 'none';
      }
    }

    let committed = norm(opts.value || { start: 0, end: 0 });
    let current = { ...committed };
    let pressed = false;

    const same = (a, b) => a.start === b.start && a.end === b.end;

    // DOM boundary point -> document offset. Points before a segment (between segments, inside skipped
    // decorations) snap to that segment's start; points after the last one to the document end.
    const probe = document.createRange();
    const api = createApi();

    container.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      pressed = true;
      if (opts.fresh !== false) window.getSelection().removeAllRanges();
    });

    apply(committed);
    live.push(api);
    alive();
    return api;

    function norm(v) {
      const a = clamp(Math.round(v.start || 0), 0, length);
      const b = clamp(Math.round(v.end || 0), 0, length);
      return { start: Math.min(a, b), end: Math.max(a, b) };
    }

    function offsetAt(node, off) {
      for (const s of segs) {
        probe.selectNodeContents(s.node);
        let c;
        try { c = probe.comparePoint(node, off); } catch (e) { return null; }
        if (c < 0) return s.start;
        if (c === 0) return s.start + (node === s.node ? off : 0);
      }
      return length;
    }

    // Document offset -> DOM boundary point (offsets in a gap map to the start of the next segment).
    function pointAt(i) {
      for (const s of segs) if (i <= s.start + s.node.data.length) return [s.node, clamp(i - s.start, 0, s.node.data.length)];
      return [last.node, last.node.data.length];
    }

    // The segment holding the glyph of doc[i], snapping to the nearest glyph in the given direction.
    function glyph(i, dir) {
      for (let k = 0; k < segs.length; k++) {
        const s = segs[k];
        const len = s.node.data.length;
        if (i >= s.start && i < s.start + len) return [s, i - s.start];
        if (i < s.start) {
          if (dir > 0 && len) return [s, 0];
          for (let j = k - 1; j >= 0; j--) if (segs[j].node.data.length) return [segs[j], segs[j].node.data.length - 1];
          return [s, 0];
        }
      }
      for (let j = segs.length - 1; j >= 0; j--) if (segs[j].node.data.length) return [segs[j], segs[j].node.data.length - 1];
      return [last, 0];
    }

    function read() {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return null;
      const r = sel.getRangeAt(0);
      if (!r.intersectsNode(container)) return null;
      const a = offsetAt(r.startContainer, r.startOffset);
      const b = offsetAt(r.endContainer, r.endOffset);
      if (a === null || b === null) return null;
      return norm({ start: a, end: b });
    }

    function apply(v) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      if (!(v.end > v.start)) return;
      const [an, ao] = pointAt(v.start);
      const [fn, fo] = pointAt(v.end);
      sel.setBaseAndExtent(an, ao, fn, fo);
    }

    // Caret offset a press at (x, y) would produce, or null if it lands outside the segments.
    function caretAt(x, y) {
      const r = document.caretRangeFromPoint ? document.caretRangeFromPoint(x, y) : null;
      if (r) return offsetAt(r.startContainer, r.startOffset);
      const p = document.caretPositionFromPoint ? document.caretPositionFromPoint(x, y) : null;
      return p ? offsetAt(p.offsetNode, p.offset) : null;
    }

    function locateChar(i, edge = 'before') {
      const after = edge === 'after';
      const [s, k] = glyph(i, after ? -1 : 1);
      const r = document.createRange();
      r.setStart(s.node, k);
      r.setEnd(s.node, Math.min(s.node.data.length, k + 1));
      const rects = [...r.getClientRects()].filter((q) => q.width > 0);
      const q = (after ? rects[rects.length - 1] : rects[0]) || r.getBoundingClientRect();
      const y = q.top + q.height / 2;
      const want = s.start + k + (after ? 1 : 0);
      // Just inside the glyph edge (1 px, or a third of a narrow glyph); fall back further inside if a
      // hit test says the caret would land elsewhere (kerning, transforms, odd fonts).
      const insets = [Math.min(1, q.width / 3), q.width / 4, q.width / 3, q.width / 2.5];
      let best = null;
      for (const d of insets) {
        const x = after ? q.right - d : q.left + d;
        if (!best) best = [x, y];
        if (caretAt(x, y) === want) return [x, y];
      }
      return best;
    }

    function collectSegments() {
      if (opts.segments) {
        for (const s of opts.segments) {
          if (s.node.nodeType === Node.TEXT_NODE) segs.push({ node: s.node, start: s.start });
          else {
            let at = s.start;
            for (const n of textNodes(s.node, skip)) {
              segs.push({ node: n, start: at });
              at += n.data.length;
            }
          }
        }
      } else {
        let at = 0;
        for (const n of textNodes(container, skip)) {
          segs.push({ node: n, start: at });
          at += n.data.length;
        }
      }
    }

    function createApi() {
      return {
        container,
        length,
        get: () => ({ ...committed }),
        set(v) {
          committed = norm(v);
          current = { ...committed };
          apply(committed);
        },
        read,
        offsetAt,
        pointAt,
        locateChar,
        locate(t) {
          if (t.char === undefined) throw new Error(`textSelection cannot locate ${JSON.stringify(t)}`);
          return locateChar(t.char, t.edge);
        },
        // Called by the shared listeners: settle = pointer released.
        _sync(settle) {
          const m = read();
          const wasPressed = pressed;
          if (settle) pressed = false;
          if (m && !same(m, current)) {
            current = m;
            if (wasPressed && !settle) {
              if (opts.onInput) opts.onInput({ ...m });
              return;
            }
          }
          if (wasPressed && !settle) return;
          if (!same(current, committed)) {
            committed = { ...current };
            if (settle && wasPressed) env.log('select', { what: label, start: committed.start, end: committed.end });
            if (opts.onChange) opts.onChange({ ...committed });
          }
        },
      };
    }
  };

  // ---------------------------------------------------------------- textField

  const SLOTS = { 9: /\d/, a: /[A-Za-z]/, '*': /[A-Za-z0-9]/ };

  function patternMask(pattern, raw) {
    const chars = [...raw];
    let j = 0;
    let out = '';
    for (const p of pattern) {
      const cls = SLOTS[p];
      if (cls) {
        while (j < chars.length && !cls.test(chars[j])) j++;
        if (j >= chars.length) break;
        out += chars[j++];
      } else {
        // A literal appears only once something is left to fill the slots after it.
        if (!chars.slice(j).some((c) => /[A-Za-z0-9]/.test(c))) break;
        if (chars[j] === p) j++;
        out += p;
      }
    }
    return out;
  }

  // Number of slot characters (non-literals) before position i of a pattern-masked string.
  function slotsBefore(pattern, s, i) {
    let n = 0;
    for (let k = 0; k < Math.min(i, s.length); k++) if (SLOTS[pattern[k]]) n++;
    return n;
  }

  ui.textField = function textField(el, opts = {}) {
    const editable = !('value' in el) || el.isContentEditable;
    const label = opts.label || el.name || el.id || 'field';
    const read = () => (editable ? el.textContent : el.value);
    const write = (v) => {
      if (editable) el.textContent = v;
      else el.value = v;
    };

    function format(raw) {
      let v = String(raw ?? '');
      if (opts.accept) v = [...v].filter((c) => opts.accept.test(c)).join('');
      if (typeof opts.mask === 'string') v = patternMask(opts.mask, v);
      else if (typeof opts.mask === 'function') v = String(opts.mask(v));
      if (opts.maxLength != null) v = v.slice(0, opts.maxLength);
      return v;
    }
    const masked = !!(opts.accept || opts.mask || opts.maxLength != null);

    let value = String(opts.value ?? '');
    write(value);

    function caretToEnd() {
      if (editable) {
        const sel = window.getSelection();
        if (document.activeElement !== el) return;
        sel.selectAllChildren(el);
        sel.collapseToEnd();
      }
    }

    el.addEventListener('input', (e) => {
      if (e.isComposing) return;
      const raw = read();
      let next = raw;
      if (masked) {
        next = format(raw);
        if (next !== raw) {
          if (editable) {
            write(next);
            caretToEnd();
          } else {
            const caret = el.selectionStart ?? raw.length;
            let pos;
            if (typeof opts.mask === 'string') {
              // Keep the caret after the same number of typed characters.
              const kept = format(raw.slice(0, caret));
              const n = slotsBefore(opts.mask, kept, kept.length);
              pos = 0;
              for (let seen = 0; pos < next.length && seen < n; pos++) if (SLOTS[opts.mask[pos]]) seen++;
              // Step over separators right after the caret that were just auto-inserted.
              while (pos < next.length && !SLOTS[opts.mask[pos]] && pos < caret) pos++;
            } else {
              pos = next.length - (raw.length - caret);
            }
            write(next);
            const p = clamp(pos, 0, next.length);
            try { el.setSelectionRange(p, p); } catch (err) { /* type=email etc. have no selection API */ }
          }
        }
      }
      value = next;
      if (opts.onInput) opts.onInput(value);
    });
    el.addEventListener(editable ? 'blur' : 'change', () => {
      if (opts.onChange) opts.onChange(value);
    });
    el.addEventListener('focus', () => env.log('focus', { what: label }));

    return {
      get: () => value,
      set(v) {
        value = String(v ?? '');
        if (read() !== value) write(value);
      },
      format,
      locate: () => center(el),
    };
  };
})();
