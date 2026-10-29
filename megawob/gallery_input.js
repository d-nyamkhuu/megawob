/*
 * megawob/gallery_input.js: the gallery viewer's synthetic input. It sends one oracle action
 * (__env.oracle(), action types in the html/kit/env.js header) to the task page in the viewer's iframe the way
 * megawob/driver.py act() does with Playwright, but as DOM events built in the page's own realm. gallery.py inlines
 * this file into gallery.html.
 *
 *   MegawobInput.run(win, action, { moveMs, steps }) -> Promise<{ ok, note }>
 *       win     the task page's window (same origin: the gallery is served over HTTP)
 *       moveMs  extra wait per interpolated pointer move (0: one animation frame each)
 *       steps   interpolated moves per drag (driver --steps default, 8)
 *       note    what the synthetic route could not do the way a browser would, or ''
 *
 * Synthetic events skip a browser's default actions, so the ones tasks rely on are done here, each only when the
 * page did not cancel the event (the kit's input gate cancels keyboard and wheel input a task does not allow, and
 * that must keep working): focus on mousedown, the text selection of a press-drag, double and triple clicks, typing
 * (execCommand insertText), editing keys, Tab focus, Enter / Space activation, a copy / cut / paste clipboard of its
 * own, and wheel scrolling. Pointer capture on the synthetic pointer (POINTER_ID) is shimmed: the browser refuses
 * setPointerCapture for a pointer it does not know. A press on a [draggable=true] element runs HTML5 drag and drop
 * the way Chromium does (dragstart, then pointercancel, dragover along the path, drop where accepted, dragend), and a
 * press on the resize grip of an element with CSS resize (a native textarea) resizes it.
 * Known limits: CSS :hover does not follow a synthetic pointer, and code that checks event.isTrusted ignores it.
 */
(function () {
  'use strict';

  const POINTER_ID = 999;
  const MODIFIERS = ['Control', 'Shift', 'Alt', 'Meta'];
  const BUTTON_BITS = [1, 4, 2]; // event.button -> event.buttons bit
  const KEY_CODES = {
    Backspace: 8, Tab: 9, Enter: 13, Shift: 16, Control: 17, Alt: 18, Escape: 27, ' ': 32, PageUp: 33, PageDown: 34,
    End: 35, Home: 36, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Delete: 46, Meta: 91,
  };
  const FOCUSABLE = 'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), '
    + 'a[href], area[href], iframe, summary, [tabindex], [contenteditable]:not([contenteditable="false"])';

  // ------------------------------------------------------------------------------------------- per-page state

  function state(win) {
    if (win.__megawobSynth) return win.__megawobSynth;
    const S = {
      x: 0, y: 0, buttons: 0, over: null, capture: null, mods: new Set(), downTarget: null, downPrevented: false,
      clickRun: { n: 1 }, selAnchor: null, dndSource: null, dnd: null, grip: null, fieldAnchor: null, clipboard: '', pressAt: null,
    };
    win.__megawobSynth = S;
    // Pointer capture for the synthetic pointer: the native call throws NotFoundError for an id the browser does
    // not know, so record the target and route later events there (a real mouse keeps the native path).
    const P = win.Element.prototype;
    const nativeSet = P.setPointerCapture;
    const nativeRelease = P.releasePointerCapture;
    const nativeHas = P.hasPointerCapture;
    P.setPointerCapture = function (id) {
      if (id !== POINTER_ID) return nativeSet.call(this, id);
      if (S.capture === this) return undefined;
      if (S.capture) fire(win, S.capture, 'PointerEvent', 'lostpointercapture', pointerInit(win, S, S.x, S.y));
      S.capture = this;
      fire(win, this, 'PointerEvent', 'gotpointercapture', pointerInit(win, S, S.x, S.y));
      return undefined;
    };
    P.releasePointerCapture = function (id) {
      if (id !== POINTER_ID) return nativeRelease.call(this, id);
      if (S.capture === this) releaseCapture(win, S);
      return undefined;
    };
    P.hasPointerCapture = function (id) {
      return id === POINTER_ID ? S.capture === this : nativeHas.call(this, id);
    };
    return S;
  }

  function releaseCapture(win, S) {
    const el = S.capture;
    S.capture = null;
    if (el) fire(win, el, 'PointerEvent', 'lostpointercapture', pointerInit(win, S, S.x, S.y));
  }

  // ------------------------------------------------------------------------------------------- events

  const modInit = (S) => ({
    ctrlKey: S.mods.has('Control'), shiftKey: S.mods.has('Shift'), altKey: S.mods.has('Alt'), metaKey: S.mods.has('Meta'),
  });

  function mouseInit(win, S, x, y, extra = {}) {
    return {
      bubbles: true, cancelable: true, composed: true, view: win, clientX: x, clientY: y, screenX: x, screenY: y,
      button: 0, buttons: S.buttons, detail: 0, ...modInit(S), ...extra,
    };
  }

  function pointerInit(win, S, x, y, extra = {}) {
    return {
      ...mouseInit(win, S, x, y, extra), pointerId: POINTER_ID, pointerType: 'mouse', isPrimary: true,
      width: 1, height: 1, pressure: (extra.buttons ?? S.buttons) ? 0.5 : 0,
    };
  }

  // Dispatch an event built with the page realm's constructor; returns true when the page did not cancel it.
  function fire(win, target, ctor, type, init, legacy) {
    if (!target) return true;
    const Ctor = win[ctor] || win.Event;
    const e = new Ctor(type, init);
    if (legacy) for (const [k, v] of Object.entries(legacy)) Object.defineProperty(e, k, { get: () => v });
    return target.dispatchEvent(e);
  }

  const doc = (win) => win.document;
  const hit = (win, S, x, y) => S.capture || doc(win).elementFromPoint(x, y) || doc(win).documentElement;
  const frame = (win) => new Promise((done) => win.requestAnimationFrame(() => done()));
  const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

  function ancestors(el) {
    const out = [];
    for (let n = el; n; n = n.parentElement) out.push(n);
    return out;
  }

  // Over / out / enter / leave when the element under the pointer changes (hover menus listen for them).
  function hover(win, S, el, x, y) {
    if (el === S.over) return;
    const old = S.over && S.over.isConnected ? S.over : null;
    const oldUp = old ? ancestors(old) : [];
    const newUp = ancestors(el);
    if (old) {
      fire(win, old, 'PointerEvent', 'pointerout', pointerInit(win, S, x, y, { relatedTarget: el }));
      fire(win, old, 'MouseEvent', 'mouseout', mouseInit(win, S, x, y, { relatedTarget: el }));
      for (const n of oldUp.filter((n) => !newUp.includes(n))) {
        fire(win, n, 'PointerEvent', 'pointerleave', { ...pointerInit(win, S, x, y), bubbles: false, cancelable: false });
        fire(win, n, 'MouseEvent', 'mouseleave', { ...mouseInit(win, S, x, y), bubbles: false, cancelable: false });
      }
    }
    fire(win, el, 'PointerEvent', 'pointerover', pointerInit(win, S, x, y, { relatedTarget: old }));
    fire(win, el, 'MouseEvent', 'mouseover', mouseInit(win, S, x, y, { relatedTarget: old }));
    for (const n of newUp.filter((n) => !oldUp.includes(n)).reverse()) {
      fire(win, n, 'PointerEvent', 'pointerenter', { ...pointerInit(win, S, x, y), bubbles: false, cancelable: false });
      fire(win, n, 'MouseEvent', 'mouseenter', { ...mouseInit(win, S, x, y), bubbles: false, cancelable: false });
    }
    S.over = el;
  }

  // ------------------------------------------------------------------------------------------- text helpers

  const isTextInput = (el) => !!el && ((el.tagName === 'INPUT'
    && !/^(button|submit|reset|checkbox|radio|range|color|file|image|hidden)$/i.test(el.type)) || el.tagName === 'TEXTAREA');
  const isEditable = (el) => !!el && (isTextInput(el) || el.isContentEditable);
  const isClickable = (el) => !!el && (el.tagName === 'BUTTON' || el.tagName === 'SUMMARY'
    || (el.tagName === 'INPUT' && /^(button|submit|reset|checkbox|radio|image)$/i.test(el.type))
    || (el.tagName === 'A' && el.hasAttribute('href')) || /^(button|checkbox|radio|switch|menuitem|tab|option|link)$/
    .test(el.getAttribute('role') || ''));
  const active = (win) => {
    const a = doc(win).activeElement;
    return a && a !== doc(win).body ? a : null;
  };

  // user-select: the nearest value other than auto decides (a user-select: text child of a none parent selects).
  function selectable(win, el) {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const v = win.getComputedStyle(n).userSelect;
      if (v !== 'auto') return v !== 'none';
    }
    return true;
  }

  // A double click selects the word under the caret (letters, digits, _ and inner apostrophes), as Chromium on Linux
  // does: no trailing space.
  const WORD = /[\p{L}\p{N}_'’]/u;
  function selectWord(sel, r) {
    const node = r.startContainer;
    if (node.nodeType !== 3) return;
    const t = node.data;
    let a = r.startOffset;
    let b = r.startOffset;
    if (!WORD.test(t[a] || '') && WORD.test(t[a - 1] || '')) a--;
    if (!WORD.test(t[a] || '')) return;
    while (a > 0 && WORD.test(t[a - 1])) a--;
    while (b < t.length && WORD.test(t[b])) b++;
    sel.setBaseAndExtent(node, a, node, b);
  }

  function caretAt(win, x, y) {
    const d = doc(win);
    return d.caretRangeFromPoint ? d.caretRangeFromPoint(x, y) : null;
  }

  // Insert text at the caret of the focused field the way typing does (beforeinput / input fire; undo works).
  function insertText(win, el, text) {
    if (!isEditable(el)) return;
    if (doc(win).execCommand('insertText', false, text)) return;
    // Fields execCommand refuses (type=number, email): set the value through the native setter (frameworks track
    // it) and send the input event.
    if (!isTextInput(el)) return;
    const proto = el.tagName === 'TEXTAREA' ? win.HTMLTextAreaElement.prototype : win.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    let start = el.value.length;
    let end = start;
    try { start = el.selectionStart ?? start; end = el.selectionEnd ?? end; } catch (err) { /* no selection API */ }
    setter.call(el, el.value.slice(0, start) + text + el.value.slice(end));
    try { el.setSelectionRange(start + text.length, start + text.length); } catch (err) { /* no selection API */ }
    fire(win, el, 'InputEvent', 'input', { bubbles: true, inputType: 'insertText', data: text });
  }

  function deleteText(win, el, forward) {
    if (!isEditable(el)) return;
    if (doc(win).execCommand(forward ? 'forwardDelete' : 'delete', false)) return;
    if (!isTextInput(el)) return;
    const proto = el.tagName === 'TEXTAREA' ? win.HTMLTextAreaElement.prototype : win.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    let start = el.value.length;
    let end = start;
    try { start = el.selectionStart ?? start; end = el.selectionEnd ?? end; } catch (err) { /* no selection API */ }
    if (start === end) {
      if (forward) end = Math.min(el.value.length, end + 1);
      else start = Math.max(0, start - 1);
    }
    setter.call(el, el.value.slice(0, start) + el.value.slice(end));
    fire(win, el, 'InputEvent', 'input', { bubbles: true, inputType: forward ? 'deleteContentForward' : 'deleteContentBackward' });
  }

  function selectAll(win) {
    const el = active(win);
    if (isTextInput(el)) {
      try { el.select(); } catch (err) { /* no selection API */ }
      return;
    }
    if (el && el.isContentEditable) {
      let root = el;
      while (root.parentElement && root.parentElement.isContentEditable) root = root.parentElement;
      win.getSelection().selectAllChildren(root);
      return;
    }
    doc(win).execCommand('selectAll', false);
  }

  function selectedText(win) {
    const el = active(win);
    if (isTextInput(el)) {
      try { return el.value.slice(el.selectionStart, el.selectionEnd); } catch (err) { return ''; }
    }
    return String(win.getSelection());
  }

  function tabbables(win) {
    const all = [...doc(win).querySelectorAll(FOCUSABLE)].filter((el) => el.tabIndex >= 0 && !el.closest('[inert]')
      && el.getClientRects().length && win.getComputedStyle(el).visibility !== 'hidden');
    const pos = all.filter((el) => el.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex);
    return [...pos, ...all.filter((el) => el.tabIndex === 0)];
  }

  // ------------------------------------------------------------------------------------------- pointer

  async function moveTo(win, S, x, y, steps, opts) {
    const n = Math.max(1, steps | 0);
    const [x0, y0] = [S.x, S.y];
    for (let i = 1; i <= n; i++) {
      const px = x0 + ((x - x0) * i) / n;
      const py = y0 + ((y - y0) * i) / n;
      S.x = px;
      S.y = py;
      if (S.dnd) dragOver(win, S, px, py);
      else {
        const el = hit(win, S, px, py);
        hover(win, S, doc(win).elementFromPoint(px, py) || el, px, py);
        fire(win, el, 'PointerEvent', 'pointermove', pointerInit(win, S, px, py));
        if (!(S.buttons && S.downPrevented)) fire(win, el, 'MouseEvent', 'mousemove', mouseInit(win, S, px, py));
        if (S.buttons & 1) pressMove(win, S, px, py);
      }
      if (n > 1 || opts.moveMs) {
        await frame(win);
        if (opts.moveMs) await sleep(opts.moveMs);
      }
    }
  }

  // A press on the resize grip of an element with CSS resize (a native textarea's bottom-right corner): the
  // browser's own resize, which sets the element's width / height while the button is held.
  const GRIP = 16;
  function gripAt(win, el, x, y) {
    if (!el || el.nodeType !== 1) return null;
    const cs = win.getComputedStyle(el);
    if (!cs.resize || cs.resize === 'none' || cs.overflow === 'visible') return null;
    const r = el.getBoundingClientRect();
    if (x > r.right || y > r.bottom || r.right - x > GRIP || r.bottom - y > GRIP) return null;
    return { el, x0: x, y0: y, w0: parseFloat(cs.width), h0: parseFloat(cs.height), mode: cs.resize };
  }

  function gripMove(S, x, y) {
    const g = S.grip;
    if (/both|horizontal|inline/.test(g.mode)) g.el.style.width = `${Math.max(0, g.w0 + x - g.x0)}px`;
    if (/both|vertical|block/.test(g.mode)) g.el.style.height = `${Math.max(0, g.h0 + y - g.y0)}px`;
  }

  // Held left button moved: resize on a grip, start native drag and drop on a draggable, else extend the text
  // selection.
  function pressMove(win, S, x, y) {
    if (S.grip) return gripMove(S, x, y);
    const start = S.pressAt;
    if (!start || Math.hypot(x - start[0], y - start[1]) < 4) return;
    if (S.dndSource && !S.dnd) {
      const dt = new win.DataTransfer();
      const ok = fire(win, S.dndSource, 'DragEvent', 'dragstart', { ...mouseInit(win, S, x, y), dataTransfer: dt });
      const source = S.dndSource;
      S.dndSource = null;
      if (!ok) return;
      // Chromium cancels the pointer at dragstart and sends no pointerup / mouseup / click.
      fire(win, S.downTarget || source, 'PointerEvent', 'pointercancel', pointerInit(win, S, x, y, { cancelable: false }));
      releaseCapture(win, S);
      S.dnd = { source, dt, over: null, accept: false };
      S.selAnchor = null;
      dragOver(win, S, x, y);
      return;
    }
    if (S.selAnchor) {
      const r = caretAt(win, x, y);
      if (r) win.getSelection().setBaseAndExtent(S.selAnchor.startContainer, S.selAnchor.startOffset, r.startContainer, r.startOffset);
    } else if (S.fieldAnchor) {
      const { el, off } = S.fieldAnchor;
      const at = fieldOffset(win, el, x, y);
      if (at !== null) setField(el, off, at);
    }
  }

  // A press on page text: the caret (Shift extends the selection), a word (double click) or a block (triple).
  function pressText(win, S, x, y, count) {
    const r = caretAt(win, x, y);
    const sel = win.getSelection();
    if (!r) return;
    if (count === 1 && S.mods.has('Shift') && sel.rangeCount) {
      sel.extend(r.startContainer, r.startOffset);
      S.selAnchor = { startContainer: sel.anchorNode, startOffset: sel.anchorOffset };
      return;
    }
    sel.collapse(r.startContainer, r.startOffset);
    if (count === 1) S.selAnchor = r;
    else if (count === 2) selectWord(sel, r);
    else {
      sel.modify('move', 'backward', 'paragraphboundary');
      sel.modify('extend', 'forward', 'paragraphboundary');
    }
  }

  // The same in a text field (input, textarea), whose text caretRangeFromPoint cannot see.
  function pressField(win, S, el, x, y, count) {
    const at = fieldOffset(win, el, x, y);
    if (at === null) return;
    const v = el.value;
    let s0; let e0;
    try { s0 = el.selectionStart; e0 = el.selectionEnd; } catch (err) { return; }
    if (count === 1 && S.mods.has('Shift') && s0 !== null) {
      const anchor = el.selectionDirection === 'backward' ? e0 : s0;
      setField(el, anchor, at);
      S.fieldAnchor = { el, off: anchor };
    } else if (count === 1) {
      setField(el, at, at);
      S.fieldAnchor = { el, off: at };
    } else if (count === 2) {
      let a = at;
      let b = at;
      if (!WORD.test(v[a] || '') && WORD.test(v[a - 1] || '')) a--;
      if (WORD.test(v[a] || '')) {
        while (a > 0 && WORD.test(v[a - 1])) a--;
        b = a;
        while (b < v.length && WORD.test(v[b])) b++;
        setField(el, a, b);
      }
    } else if (el.tagName === 'TEXTAREA') {
      const a = v.lastIndexOf('\n', at - 1) + 1;
      const n = v.indexOf('\n', at);
      setField(el, a, n < 0 ? v.length : n);
    } else setField(el, 0, v.length);
  }

  function setField(el, anchor, focus) {
    try {
      el.setSelectionRange(Math.min(anchor, focus), Math.max(anchor, focus), focus < anchor ? 'backward' : 'forward');
    } catch (err) { /* no selection API */ }
  }

  // The character offset under (x, y) in a text field: a hidden copy of the field (same box, font and wrapping,
  // scrolled the same) asked with caretRangeFromPoint.
  const MIRROR = ['boxSizing', 'width', 'height', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth',
    'borderLeftWidth', 'borderStyle', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontStyle',
    'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'lineHeight', 'fontFamily', 'fontKerning',
    'fontFeatureSettings', 'textAlign', 'textTransform', 'textIndent', 'letterSpacing', 'wordSpacing', 'tabSize',
    'direction', 'wordBreak', 'overflowWrap'];
  function fieldOffset(win, el, x, y) {
    const d = doc(win);
    if (!d.caretRangeFromPoint) return null;
    const cs = win.getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const m = d.createElement('div');
    for (const k of MIRROR) m.style[k] = cs[k];
    const area = el.tagName === 'TEXTAREA';
    Object.assign(m.style, {
      position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, margin: '0', zIndex: '2147483647', opacity: '0',
      pointerEvents: 'auto', whiteSpace: area ? 'pre-wrap' : 'pre', overflowX: 'hidden',
      overflowY: area && el.scrollHeight > el.clientHeight && cs.overflowY !== 'hidden' ? 'scroll' : 'hidden',
      userSelect: 'text',
    });
    m.textContent = `${el.value} `;
    (d.body || d.documentElement).appendChild(m);
    m.scrollTop = el.scrollTop;
    m.scrollLeft = el.scrollLeft;
    let at = null;
    try {
      const c = d.caretRangeFromPoint(x, y);
      if (c && c.startContainer === m.firstChild) at = Math.min(c.startOffset, el.value.length);
      else if (c && m.contains(c.startContainer)) at = el.value.length;
    } finally {
      m.remove();
    }
    return at;
  }

  function dragOver(win, S, x, y) {
    const D = S.dnd;
    const init = { ...mouseInit(win, S, x, y), dataTransfer: D.dt };
    fire(win, D.source, 'DragEvent', 'drag', init);
    const el = doc(win).elementFromPoint(x, y);
    if (el !== D.over) {
      if (el) fire(win, el, 'DragEvent', 'dragenter', init);
      if (D.over && D.over.isConnected) fire(win, D.over, 'DragEvent', 'dragleave', { ...init, cancelable: false });
      D.over = el;
    }
    D.accept = el ? !fire(win, el, 'DragEvent', 'dragover', init) : false;
  }

  // count: the press's click count (event.detail), given by the action as Playwright's click_count is.
  function down(win, S, x, y, button = 0, count = 1) {
    const target = hit(win, S, x, y);
    S.clickRun = { n: count };
    S.buttons |= BUTTON_BITS[button] || 1;
    S.downTarget = target;
    S.pressAt = [x, y];
    S.downPrevented = !fire(win, target, 'PointerEvent', 'pointerdown', pointerInit(win, S, x, y, { button }));
    // A cancelled pointerdown suppresses the compatibility mouse events, not the click.
    let mouseOk = true;
    if (!S.downPrevented) mouseOk = fire(win, target, 'MouseEvent', 'mousedown', mouseInit(win, S, x, y, { button, detail: count }));
    S.selAnchor = null;
    S.fieldAnchor = null;
    S.dndSource = null;
    if (!S.downPrevented && mouseOk) {
      // Default actions of a press: focus (or blur), a drag source, the caret or a word / block selection.
      const focusable = target.closest && target.closest(FOCUSABLE);
      const cur = active(win);
      if (focusable && focusable !== cur) focusable.focus({ preventScroll: true });
      else if (!focusable && cur && !cur.contains(target)) cur.blur();
      S.grip = button === 0 ? gripAt(win, target, x, y) : null;
      if (button === 0 && !S.grip) {
        S.dndSource = (target.closest && target.closest('[draggable="true"]')) || null;
        if (S.dndSource) { /* a drag source: no selection */ } else if (isTextInput(target)) pressField(win, S, target, x, y, count);
        else if (selectable(win, target)) pressText(win, S, x, y, count);
      }
    }
    // Linux Chromium opens the context menu on the press.
    if (button === 2) fire(win, target, 'MouseEvent', 'contextmenu', mouseInit(win, S, x, y, { button }));
    return count;
  }

  function up(win, S, x, y, button = 0) {
    S.buttons &= ~(BUTTON_BITS[button] || 1);
    if (S.dnd) {
      const D = S.dnd;
      const init = { ...mouseInit(win, S, x, y), dataTransfer: D.dt };
      if (D.accept && D.over) fire(win, D.over, 'DragEvent', 'drop', init);
      fire(win, D.source, 'DragEvent', 'dragend', { ...init, cancelable: false });
      S.dnd = null;
      S.pressAt = null;
      return;
    }
    const target = hit(win, S, x, y);
    fire(win, target, 'PointerEvent', 'pointerup', pointerInit(win, S, x, y, { button }));
    if (!S.downPrevented) fire(win, target, 'MouseEvent', 'mouseup', mouseInit(win, S, x, y, { button, detail: S.clickRun ? S.clickRun.n : 1 }));
    releaseCapture(win, S);
    S.selAnchor = null;
    S.fieldAnchor = null;
    S.dndSource = null;
    S.grip = null;
    S.pressAt = null;
    // click goes to the nearest common ancestor of the press and release targets.
    const from = S.downTarget && S.downTarget.isConnected ? S.downTarget : target;
    let common = target;
    while (common && !common.contains(from)) common = common.parentElement;
    S.downTarget = null;
    if (!common) return;
    const count = S.clickRun ? S.clickRun.n : 1;
    if (button === 0) {
      fire(win, common, 'PointerEvent', 'click', pointerInit(win, S, x, y, { button, detail: count }));
      if (count === 2) fire(win, common, 'MouseEvent', 'dblclick', mouseInit(win, S, x, y, { button, detail: 2 }));
    } else {
      fire(win, common, 'PointerEvent', 'auxclick', pointerInit(win, S, x, y, { button, detail: count }));
    }
  }

  // ------------------------------------------------------------------------------------------- keyboard

  // Playwright key names that are not KeyboardEvent.key values.
  const KEY_NAMES = {
    Space: ' ', Minus: '-', Equal: '=', Comma: ',', Period: '.', Slash: '/', Backslash: '\\', Semicolon: ';',
    Quote: "'", Backquote: '`', BracketLeft: '[', BracketRight: ']', Esc: 'Escape', Return: 'Enter',
  };
  const keyName = (k) => KEY_NAMES[k] || (/^Key[A-Z]$/.test(k) ? k.slice(3).toLowerCase() : /^Digit[0-9]$/.test(k) ? k.slice(5) : k);

  function parseKey(spec) {
    if (spec === '+' || spec.length === 1) return { mods: [], key: spec };
    const parts = spec.endsWith('++') ? [...spec.slice(0, -2).split('+'), '+'] : spec.split('+');
    const key = keyName(parts.pop());
    return { mods: parts.map((m) => (m === 'Ctrl' ? 'Control' : m === 'ControlOrMeta' ? 'Control' : m)), key };
  }

  function keyInit(win, S, key, code) {
    return { bubbles: true, cancelable: true, composed: true, view: win, key, code, ...modInit(S) };
  }

  function codeOf(key) {
    if (/^[a-z]$/i.test(key)) return `Key${key.toUpperCase()}`;
    if (/^[0-9]$/.test(key)) return `Digit${key}`;
    if (key === ' ') return 'Space';
    if (MODIFIERS.includes(key)) return `${key}Left`;
    return key.length === 1 ? '' : key;
  }

  function keyCodeOf(key) {
    if (KEY_CODES[key]) return KEY_CODES[key];
    if (/^F([1-9]|1[0-2])$/.test(key)) return 111 + Number(key.slice(1));
    return key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0;
  }

  function keyEvent(win, S, type, key) {
    const target = active(win) || doc(win).body;
    const code = keyCodeOf(key);
    return fire(win, target, 'KeyboardEvent', type, keyInit(win, S, key, codeOf(key)), { keyCode: code, which: code });
  }

  function modifierDown(win, S, m) {
    if (S.mods.has(m)) return;
    S.mods.add(m);
    keyEvent(win, S, 'keydown', m);
  }

  function modifierUp(win, S, m) {
    if (!S.mods.has(m)) return;
    S.mods.delete(m);
    keyEvent(win, S, 'keyup', m);
  }

  function clipboardEvent(win, S, type, data) {
    const dt = new win.DataTransfer();
    if (data !== undefined) dt.setData('text/plain', data);
    const target = active(win) || doc(win).body;
    const ok = fire(win, target, 'ClipboardEvent', type, { bubbles: true, cancelable: true, composed: true, clipboardData: dt });
    return { ok, dt };
  }

  // One key press with its default action (unless keydown or keypress was cancelled).
  function press(win, S, key) {
    const shortcut = S.mods.has('Control') || S.mods.has('Meta');
    let ok = keyEvent(win, S, 'keydown', key);
    const el = active(win);
    const printable = key.length === 1 && !shortcut;
    if (ok && printable) {
      const code = key.charCodeAt(0);
      ok = fire(win, el || doc(win).body, 'KeyboardEvent', 'keypress', keyInit(win, S, key, codeOf(key)), { keyCode: code, which: code, charCode: code });
    }
    let after = null; // Space activates a button on keyup
    if (ok) {
      const lower = key.toLowerCase();
      if (printable && isEditable(el)) insertText(win, el, key);
      else if (printable && key === ' ' && isClickable(el)) after = el;
      else if (shortcut && lower === 'a') selectAll(win);
      else if (shortcut && (lower === 'c' || lower === 'x')) {
        const text = selectedText(win);
        const { ok: copied, dt } = clipboardEvent(win, S, lower === 'c' ? 'copy' : 'cut');
        S.clipboard = copied ? text : dt.getData('text/plain');
        if (copied && lower === 'x' && text) deleteText(win, el, false);
      } else if (shortcut && lower === 'v') {
        if (clipboardEvent(win, S, 'paste', S.clipboard).ok && S.clipboard) insertText(win, el, S.clipboard);
      } else if (shortcut && lower === 'z') doc(win).execCommand(S.mods.has('Shift') ? 'redo' : 'undo', false);
      else if (key === 'Backspace' || key === 'Delete') deleteText(win, el, key === 'Delete');
      else if (key === 'Enter') enter(win, el);
      else if (key === 'Tab') {
        const list = tabbables(win);
        if (list.length) {
          const i = list.indexOf(el);
          const dir = S.mods.has('Shift') ? -1 : 1;
          const next = i < 0 ? list[dir > 0 ? 0 : list.length - 1] : list[(i + dir + list.length) % list.length];
          next.focus({ preventScroll: false });
          if (isTextInput(next)) try { next.select(); } catch (err) { /* no selection API */ }
        }
      } else if (/^(ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Home|End)$/.test(key)) caretKey(win, S, el, key);
      else if (/^(PageUp|PageDown)$/.test(key) && !isEditable(el)) {
        const se = doc(win).scrollingElement;
        se.scrollBy({ top: (key === 'PageDown' ? 1 : -1) * win.innerHeight * 0.875, behavior: 'instant' });
      }
    }
    keyEvent(win, S, 'keyup', key);
    if (after && after.isConnected) after.click();
  }

  function enter(win, el) {
    if (!el) return;
    if (el.tagName === 'TEXTAREA') insertText(win, el, '\n');
    else if (el.isContentEditable) doc(win).execCommand('insertParagraph', false);
    else if (isTextInput(el) && el.form) {
      const btn = el.form.querySelector('button:not([type]), button[type=submit], input[type=submit], input[type=image]');
      if (btn) btn.click();
      else el.form.requestSubmit();
    } else if (isClickable(el) && !(el.tagName === 'INPUT' && /^(checkbox|radio)$/i.test(el.type))) el.click();
  }

  function caretKey(win, S, el, key) {
    const extend = S.mods.has('Shift');
    if (isTextInput(el)) {
      let s; let e;
      try { s = el.selectionStart; e = el.selectionEnd; } catch (err) { return; }
      if (s === null) return;
      const len = el.value.length;
      const line = el.tagName === 'TEXTAREA' && (key === 'ArrowUp' || key === 'ArrowDown');
      if (line) {
        const sel = win.getSelection();
        if (sel.modify) sel.modify(extend ? 'extend' : 'move', key === 'ArrowUp' ? 'backward' : 'forward', 'line');
        return;
      }
      const to = { ArrowLeft: (extend ? e : Math.min(s, e)) - (extend || s === e ? 1 : 0), ArrowRight: (extend ? e : Math.max(s, e)) + (extend || s === e ? 1 : 0),
        ArrowUp: 0, ArrowDown: len, Home: 0, End: len }[key];
      const p = Math.max(0, Math.min(len, to));
      el.setSelectionRange(extend ? s : p, p);
      return;
    }
    const sel = win.getSelection();
    if (el && el.isContentEditable && sel.modify) {
      const dir = key === 'ArrowLeft' || key === 'ArrowUp' || key === 'Home' ? 'backward' : 'forward';
      const unit = key === 'Home' || key === 'End' ? 'lineboundary' : key === 'ArrowUp' || key === 'ArrowDown' ? 'line' : 'character';
      sel.modify(extend ? 'extend' : 'move', dir, unit);
      return;
    }
    if (!isEditable(el)) {
      const se = doc(win).scrollingElement;
      const by = { ArrowUp: [0, -40], ArrowDown: [0, 40], ArrowLeft: [-40, 0], ArrowRight: [40, 0] }[key];
      if (by) se.scrollBy({ left: by[0], top: by[1], behavior: 'instant' });
      else se.scrollTo({ top: key === 'Home' ? 0 : se.scrollHeight, behavior: 'instant' });
    }
  }

  async function pressSpec(win, S, spec) {
    const { mods, key } = parseKey(spec);
    for (const m of mods) modifierDown(win, S, m);
    press(win, S, key);
    for (const m of [...mods].reverse()) modifierUp(win, S, m);
  }

  // ------------------------------------------------------------------------------------------- wheel

  function scrollerFor(win, el, axis, delta) {
    const d = doc(win);
    for (let n = el; n && n !== d.body && n !== d.documentElement; n = n.parentElement) {
      const cs = win.getComputedStyle(n);
      const ov = axis === 'y' ? cs.overflowY : cs.overflowX;
      if (!/(auto|scroll|overlay)/.test(ov)) continue;
      const pos = axis === 'y' ? n.scrollTop : n.scrollLeft;
      const max = axis === 'y' ? n.scrollHeight - n.clientHeight : n.scrollWidth - n.clientWidth;
      if (max > 0 && ((delta > 0 && pos < max - 0.5) || (delta < 0 && pos > 0.5))) return n;
    }
    const root = [d.documentElement, d.body].map((n) => win.getComputedStyle(n));
    const hidden = root.some((cs) => (axis === 'y' ? cs.overflowY : cs.overflowX) === 'hidden');
    return hidden ? null : d.scrollingElement;
  }

  async function wheel(win, S, x, y, dx, dy) {
    const target = doc(win).elementFromPoint(x, y) || doc(win).documentElement;
    const ok = fire(win, target, 'WheelEvent', 'wheel', { ...mouseInit(win, S, x, y), deltaX: dx, deltaY: dy, deltaMode: 0 });
    if (ok) {
      if (dy) {
        const s = scrollerFor(win, target, 'y', dy);
        if (s) s.scrollBy({ top: dy, behavior: 'instant' });
      }
      if (dx) {
        const s = scrollerFor(win, target, 'x', dx);
        if (s) s.scrollBy({ left: dx, behavior: 'instant' });
      }
    }
    // Scroll events and the handlers they run land within a frame or two (driver.SETTLE_SCROLL).
    await frame(win);
    await frame(win);
  }

  // ------------------------------------------------------------------------------------------- actions

  async function click(win, S, [x, y], button, count, opts) {
    await moveTo(win, S, x, y, 1, opts);
    for (let i = 1; i <= count; i++) {
      down(win, S, x, y, button, i);
      up(win, S, x, y, button);
    }
  }

  async function run(win, action, opts = {}) {
    const S = state(win);
    const steps = opts.steps || 8;
    const kind = action.type;
    const mods = action.modifiers || [];
    let note = '';
    if (['click', 'drag', 'path', 'down'].includes(kind)) for (const m of mods) modifierDown(win, S, m);
    switch (kind) {
      case 'click': await click(win, S, action.at, 0, 1, opts); break;
      case 'dblclick': await click(win, S, action.at, 0, 2, opts); break;
      case 'tripleclick': await click(win, S, action.at, 0, 3, opts); break;
      case 'rightclick': await click(win, S, action.at, 2, 1, opts); break;
      case 'type':
        await click(win, S, action.at, 0, 1, opts);
        await pressSpec(win, S, 'Control+A');
        if (action.text) for (const ch of String(action.text)) press(win, S, ch === '\n' ? 'Enter' : ch);
        else press(win, S, 'Delete');
        break;
      case 'key': await pressSpec(win, S, action.key); break;
      case 'move':
        for (const p of action.points || [action.at]) await moveTo(win, S, p[0], p[1], action.points ? 2 : steps, opts);
        break;
      case 'down':
        await moveTo(win, S, action.at[0], action.at[1], steps, opts);
        down(win, S, action.at[0], action.at[1], 0);
        break;
      case 'up':
        await moveTo(win, S, action.at[0], action.at[1], steps, opts);
        up(win, S, action.at[0], action.at[1], 0);
        break;
      case 'wheel':
        await moveTo(win, S, action.at[0], action.at[1], 1, opts);
        await wheel(win, S, action.at[0], action.at[1], action.dx || 0, action.dy || 0);
        break;
      case 'wait': break;
      case 'finish': win.__env.finish(action.message || ''); break;
      case 'drag':
        await moveTo(win, S, action.from[0], action.from[1], 1, opts);
        down(win, S, action.from[0], action.from[1], 0);
        await moveTo(win, S, action.to[0], action.to[1], steps, opts);
        up(win, S, action.to[0], action.to[1], 0);
        break;
      case 'path': {
        const pts = action.points;
        await moveTo(win, S, pts[0][0], pts[0][1], 1, opts);
        down(win, S, pts[0][0], pts[0][1], 0);
        for (const p of pts.slice(1)) await moveTo(win, S, p[0], p[1], 2, opts);
        const last = pts[pts.length - 1];
        up(win, S, last[0], last[1], 0);
        break;
      }
      default:
        return { ok: false, note: `unknown action type ${kind}` };
    }
    if (['click', 'drag', 'path', 'up'].includes(kind)) for (const m of [...mods].reverse()) modifierUp(win, S, m);
    if (S.dnd) note = 'native drag still open';
    await frame(win);
    return { ok: true, note };
  }

  window.MegawobInput = { run, POINTER_ID };
})();
