/*
 * base / use-text-editor: two editors that draw the task's editor model (tasks/use-text-editor/logic.js) and
 * feed it pointer and key events; no contenteditable, no native selection, so the state is exact.
 *
 *   classic  a Monaco / VS Code-like code editor (traits.doc 'code'): a tab bar, a fixed strip under it with the
 *            breadcrumbs, a "Find and replace" button and the find widget (Aa = match case, ab = whole word,
 *            prev / next, Replace, Replace All), a line-number gutter, syntax-coloured lines in a monospace
 *            font (one span per token, columns from the measured character width), carets and selections drawn
 *            over the text, a completion popup under the caret, an optional minimap, and a status bar with
 *            Ln / Col, selections, the line count, Spaces, encoding and the language.
 *   rich     a Docs-like document editor (traits.doc 'prose'): title, toolbar (undo / redo, decorative style
 *            buttons, Find and replace, the Editing / Suggesting / Viewing mode menu), a find-and-replace bar
 *            in a fixed strip, a page whose runs are spans (suggested insertions underlined, deletions struck,
 *            coloured per author), suggestion cards in the margin with Accept / Reject, and a footer with the
 *            word count, open suggestions and the mode. Offsets come from caretRangeFromPoint over spans that
 *            carry their flat offsets; caret and selection are drawn from DOM Ranges.
 *
 * Keys go to the task's keyDown while the model's focus is the editor and no input has DOM focus (the find
 * inputs handle Enter = next, Shift+Enter = previous, Escape = close themselves). Light / dark / warm / low come
 * from <html data-theme> and the site's CSS variables.
 */
(function () {
  'use strict';

  const fam = () => env.taskDef.helpers;
  let st = null;

  const CSS = `
  .te-card { position: absolute; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--line);
    border-radius: 8px; box-shadow: 0 6px 24px rgba(0,0,0,.12); font: 13px/1.3 system-ui, -apple-system, 'Segoe UI', sans-serif; }
  .te-card button { font: inherit; color: inherit; cursor: pointer; }
  .te-card input { font: inherit; }

  /* ---------- classic (code) ---------- */
  .tc { background: var(--tc-bg); color: var(--tc-fg); }
  .tc .tc-tabs { flex: none; display: flex; align-items: stretch; height: 32px; background: var(--tc-chrome); border-bottom: 1px solid var(--tc-border); }
  .tc .tc-dots { display: flex; gap: 6px; align-items: center; padding: 0 12px; }
  .tc .tc-dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--tc-dot); display: block; }
  .tc .tc-tab { display: flex; align-items: center; gap: 7px; padding: 0 14px; background: var(--tc-bg); border-right: 1px solid var(--tc-border);
    border-top: 2px solid var(--accent); font-size: 12.5px; }
  .tc .tc-tab2 { display: flex; align-items: center; gap: 7px; padding: 0 14px; color: var(--tc-muted); font-size: 12.5px; border-right: 1px solid var(--tc-border); }
  .tc .tc-ficon { font: 700 9px/1 system-ui, sans-serif; padding: 2px 3px; border-radius: 3px; background: var(--tc-ficon); color: #1b1b1b; }
  .tc .tc-dirty { font-size: 10px; color: var(--tc-muted); width: 10px; }
  .tc .tc-strip { flex: none; position: relative; height: 62px; border-bottom: 1px solid var(--tc-border); background: var(--tc-bg); }
  .tc .tc-crumbs { position: absolute; left: 12px; top: 8px; font-size: 12px; color: var(--tc-muted); white-space: nowrap; }
  .tc .tc-findbtn { position: absolute; right: 10px; top: 5px; display: flex; gap: 6px; align-items: center; padding: 3px 10px;
    border: 1px solid var(--tc-border); border-radius: 4px; background: var(--tc-chrome); font-size: 12px; }
  .tc .tc-find { position: absolute; left: 8px; right: 8px; top: 4px; display: none; grid-template-columns: 22px 1fr auto; column-gap: 6px; row-gap: 4px;
    padding: 4px 6px; background: var(--tc-widget); border: 1px solid var(--tc-border); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,.18); }
  .tc .tc-find.open { display: grid; }
  .tc .tc-find .tc-exp { grid-row: 1 / span 2; border: 0; background: transparent; font-size: 13px; padding: 0; }
  .tc .tc-find input { min-width: 0; height: 22px; padding: 0 6px; border: 1px solid var(--tc-border); border-radius: 3px; background: var(--tc-input);
    color: var(--tc-fg); font-size: 12.5px; outline: none; }
  .tc .tc-find input:focus { border-color: var(--accent); }
  .tc .tc-row { display: flex; gap: 3px; align-items: center; }
  .tc .tc-ib { height: 22px; min-width: 24px; padding: 0 5px; border: 1px solid transparent; border-radius: 3px; background: transparent; font-size: 12px; }
  .tc .tc-ib:hover { background: var(--tc-hover); }
  .tc .tc-ib.on { border-color: var(--accent); background: var(--tc-on); }
  .tc .tc-ib.tc-ww { text-decoration: underline; }
  .tc .tc-tb { height: 22px; padding: 0 8px; border: 1px solid var(--tc-border); border-radius: 3px; background: var(--tc-chrome); font-size: 12px; }
  .tc .tc-count { font-size: 11.5px; color: var(--tc-muted); min-width: 64px; text-align: center; white-space: nowrap; }
  .tc .tc-r2 { display: none; }
  .tc .tc-find.rep .tc-r2 { display: contents; }
  .tc .tc-body { flex: none; display: flex; position: relative; overflow: hidden; }
  .tc .tc-gutter { flex: none; text-align: right; color: var(--tc-gutter); user-select: none; padding-right: 10px; box-sizing: border-box; }
  .tc .tc-gutter div.cur { color: var(--tc-gutter-cur); }
  .tc .tc-code { flex: none; position: relative; overflow: hidden; cursor: text; user-select: none; }
  .tc .tc-lines div, .tc .tc-gutter div { white-space: pre; }
  .tc .tc-over { position: absolute; inset: 0; pointer-events: none; }
  .tc .tc-line-cur { position: absolute; left: 0; right: 0; background: var(--tc-curline); }
  .tc .tc-sel { position: absolute; background: var(--tc-sel); }
  .tc .tc-match { position: absolute; background: var(--tc-match); }
  .tc .tc-match.now { background: var(--tc-match-now); outline: 1px solid var(--tc-match-edge); }
  .tc .tc-caret { position: absolute; width: 2px; background: var(--tc-caret); }
  .tc .tc-pop { position: absolute; pointer-events: auto; min-width: 190px; background: var(--tc-widget); border: 1px solid var(--tc-border);
    box-shadow: 0 3px 10px rgba(0,0,0,.25); border-radius: 3px; font-size: 12px; z-index: 3; }
  .tc .tc-pop div { display: flex; align-items: center; gap: 6px; height: 20px; padding: 0 8px; white-space: pre; cursor: pointer; }
  .tc .tc-pop div.sel { background: var(--tc-popsel); }
  .tc .tc-pop b { color: var(--tc-pophl); font-weight: 700; }
  .tc .tc-pop .ic { font-size: 9px; width: 18px; color: var(--tc-muted); }
  .tc .tc-pop .dt { margin-left: auto; padding-left: 14px; color: var(--tc-muted); font-size: 11px; }
  .tc .tc-mini { flex: none; position: relative; width: 56px; border-left: 1px solid var(--tc-border); overflow: hidden; }
  .tc .tc-mini i { position: absolute; height: 2px; background: var(--tc-mini); display: block; }
  .tc .tc-mini .view { position: absolute; left: 0; right: 0; top: 0; background: var(--tc-miniview); }
  .tc .tc-status { flex: none; display: flex; gap: 16px; align-items: center; height: 22px; padding: 0 10px; background: var(--accent); color: #fff; font-size: 11.5px; white-space: nowrap; }
  .tc .tc-status .sp { flex: 1; }
  .tc .k { color: var(--tc-k); } .tc .kc { color: var(--tc-kc); } .tc .s { color: var(--tc-s); } .tc .c { color: var(--tc-c); }
  .tc .n { color: var(--tc-n); } .tc .f { color: var(--tc-f); } .tc .v { color: var(--tc-v); } .tc .K { color: var(--tc-K); } .tc .p { color: var(--tc-p); }

  .tc { --tc-bg: #ffffff; --tc-fg: #1f1f1f; --tc-chrome: #f3f3f3; --tc-border: #e1e1e1; --tc-muted: #6f6f6f; --tc-dot: #d0d0d0;
    --tc-gutter: #8a9199; --tc-gutter-cur: #0b216f; --tc-curline: #f5f7fa; --tc-sel: #add6ff; --tc-match: #ffe08a; --tc-match-now: #f8c64a;
    --tc-match-edge: #c09000; --tc-caret: #000000; --tc-widget: #f8f8f8; --tc-input: #ffffff; --tc-hover: #e6e6e6; --tc-on: #dbe8fb;
    --tc-popsel: #d6ebff; --tc-pophl: #0066bf; --tc-mini: #c8ccd2; --tc-miniview: rgba(100,100,100,.12); --tc-ficon: #f1d23b;
    --tc-k: #0000ff; --tc-kc: #af00db; --tc-s: #a31515; --tc-c: #008000; --tc-n: #098658; --tc-f: #795e26; --tc-v: #001080; --tc-K: #0070c1; --tc-p: #3b3b3b; }
  .tc.dark { --tc-bg: #1e1e1e; --tc-fg: #d4d4d4; --tc-chrome: #252526; --tc-border: #3c3c3c; --tc-muted: #9d9d9d; --tc-dot: #4a4a4a;
    --tc-gutter: #858585; --tc-gutter-cur: #c6c6c6; --tc-curline: #282828; --tc-sel: #264f78; --tc-match: #623315; --tc-match-now: #9e6a03;
    --tc-match-edge: #f0b030; --tc-caret: #aeafad; --tc-widget: #252526; --tc-input: #3c3c3c; --tc-hover: #3a3d41; --tc-on: #094771;
    --tc-popsel: #04395e; --tc-pophl: #2aaaff; --tc-mini: #4b4f55; --tc-miniview: rgba(200,200,200,.1); --tc-ficon: #cbcb41;
    --tc-k: #569cd6; --tc-kc: #c586c0; --tc-s: #ce9178; --tc-c: #6a9955; --tc-n: #b5cea8; --tc-f: #dcdcaa; --tc-v: #9cdcfe; --tc-K: #4fc1ff; --tc-p: #d4d4d4; }
  .tc.warm { --tc-bg: var(--panel); --tc-chrome: var(--bg); --tc-border: var(--line); --tc-curline: rgba(0,0,0,.03); --tc-widget: var(--bg); --tc-input: var(--panel); }
  .tc.low { --tc-bg: var(--panel); --tc-fg: var(--fg); --tc-chrome: var(--bg); --tc-border: var(--line); --tc-k: #5b6fa0; --tc-kc: #8a6a9c;
    --tc-s: #9a6b5c; --tc-c: #7f9a7f; --tc-n: #6f8f80; --tc-f: #8a7a55; --tc-v: #5d6f86; --tc-K: #5a7f9c; --tc-p: var(--fg); --tc-widget: var(--bg); --tc-input: var(--panel); }

  /* ---------- rich (prose) ---------- */
  .tr { background: var(--bg); color: var(--fg); }
  .tr .tr-head { flex: none; display: flex; align-items: center; gap: 10px; height: 38px; padding: 0 14px; background: var(--panel); }
  .tr .tr-logo { width: 18px; height: 22px; border-radius: 2px; background: var(--accent); position: relative; }
  .tr .tr-logo::after { content: ''; position: absolute; left: 4px; right: 4px; top: 7px; height: 8px; border-top: 2px solid #fff; border-bottom: 2px solid #fff; }
  .tr .tr-title { font-size: 15px; }
  .tr .tr-saved { font-size: 11.5px; color: var(--muted); }
  .tr .tr-bar { flex: none; display: flex; align-items: center; gap: 2px; height: 38px; padding: 0 8px; margin: 0 8px; border-radius: 19px; background: var(--panel);
    border: 1px solid var(--line); position: relative; }
  .tr .tr-b { height: 28px; min-width: 28px; padding: 0 7px; border: 0; border-radius: 4px; background: transparent; font-size: 13px; display: flex; align-items: center; gap: 5px; }
  .tr .tr-b:hover { background: var(--tr-hover); }
  .tr .tr-b[disabled] { opacity: .45; cursor: default; }
  .tr .tr-sep { width: 1px; height: 20px; background: var(--line); margin: 0 4px; }
  .tr .tr-grow { flex: 1; }
  .tr .tr-mode { border: 1px solid var(--line); background: var(--panel); }
  .tr .tr-menu { position: absolute; right: 8px; top: 38px; width: 230px; background: var(--panel); border: 1px solid var(--line); border-radius: 6px;
    box-shadow: 0 6px 18px rgba(0,0,0,.2); padding: 4px 0; z-index: 4; display: none; }
  .tr .tr-menu.open { display: block; }
  .tr .tr-mi { display: block; width: 100%; text-align: left; padding: 6px 14px; border: 0; background: transparent; }
  .tr .tr-mi:hover { background: var(--tr-hover); }
  .tr .tr-mi b { display: block; font-weight: 600; }
  .tr .tr-mi span { display: block; font-size: 11.5px; color: var(--muted); }
  .tr .tr-mi.on b::before { content: '\\2713  '; }
  .tr .tr-strip { flex: none; position: relative; height: 40px; }
  .tr .tr-ruler { position: absolute; left: 0; right: 0; top: 14px; height: 12px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
    background: repeating-linear-gradient(90deg, transparent 0 11px, var(--line) 11px 12px); opacity: .7; }
  .tr .tr-find { position: absolute; left: 10px; right: 10px; top: 4px; height: 32px; display: none; align-items: center; gap: 5px; padding: 0 8px;
    background: var(--panel); border: 1px solid var(--line); border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,.15); font-size: 12.5px; white-space: nowrap; }
  .tr .tr-find.open { display: flex; }
  .tr .tr-find input { width: 120px; height: 22px; padding: 0 6px; border: 1px solid var(--line); border-radius: 3px; background: var(--bg); color: var(--fg); outline: none; }
  .tr .tr-find input:focus { border-color: var(--accent); }
  .tr .tr-find .rp { display: none; align-items: center; gap: 5px; }
  .tr .tr-find.rep .rp { display: flex; }
  .tr .tr-find.rep .tr-exp { display: none; }
  .tr .tr-chk { display: flex; align-items: center; gap: 3px; height: 22px; padding: 0 6px; border: 1px solid var(--line); border-radius: 3px; background: transparent; font-size: 12px; }
  .tr .tr-chk::before { content: ''; width: 10px; height: 10px; border: 1px solid var(--muted); border-radius: 2px; }
  .tr .tr-chk.on::before { background: var(--accent); border-color: var(--accent); }
  .tr .tr-fb { height: 22px; padding: 0 7px; border: 1px solid var(--line); border-radius: 3px; background: var(--bg); font-size: 12px; }
  .tr .tr-count { color: var(--muted); font-size: 11.5px; min-width: 52px; text-align: center; }
  .tr .tr-body { flex: none; display: flex; gap: 14px; padding: 0 14px; overflow: hidden; }
  .tr .tr-page { flex: none; position: relative; box-sizing: border-box; padding: 26px 34px; background: var(--panel); border: 1px solid var(--line);
    box-shadow: 0 1px 3px rgba(0,0,0,.08); cursor: text; user-select: none; overflow: hidden; }
  .tr .tr-text p { margin: 0 0 12px; }
  .tr .tr-text span.i { text-decoration: underline; text-decoration-thickness: 1.5px; }
  .tr .tr-text span.d { text-decoration: line-through; text-decoration-thickness: 1.5px; }
  .tr .tr-over { position: absolute; inset: 0; pointer-events: none; }
  .tr .tr-sel { position: absolute; background: var(--tr-sel); }
  .tr .tr-hit { position: absolute; background: var(--tr-hit); }
  .tr .tr-hit.now { background: var(--tr-hitnow); }
  .tr .tr-caret { position: absolute; width: 2px; background: var(--fg); }
  .tr .tr-margin { flex: none; position: relative; }
  .tr .tr-card { position: absolute; left: 0; right: 0; box-sizing: border-box; padding: 6px 8px; background: var(--panel); border: 1px solid var(--line);
    border-radius: 7px; box-shadow: 0 1px 3px rgba(0,0,0,.1); font-size: 12px; }
  .tr .tr-card .hd { display: flex; align-items: center; gap: 6px; height: 22px; }
  .tr .tr-card .av { width: 18px; height: 18px; border-radius: 50%; color: #fff; font: 700 10px/18px system-ui, sans-serif; text-align: center; flex: none; }
  .tr .tr-card .nm { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .tr .tr-card .ac { margin-left: auto; display: flex; gap: 2px; }
  .tr .tr-card .ac button { width: 24px; height: 22px; border: 0; border-radius: 4px; background: transparent; font-size: 14px; line-height: 22px; padding: 0; }
  .tr .tr-card .ac button:hover { background: var(--tr-hover); }
  .tr .tr-card .ac .ok { color: #188038; } .tr .tr-card .ac .no { color: #c5221f; }
  .tr .tr-card .ds { color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
  .tr .tr-foot { flex: none; display: flex; gap: 18px; align-items: center; height: 24px; padding: 0 16px; font-size: 11.5px; color: var(--muted);
    background: var(--panel); border-top: 1px solid var(--line); margin-top: auto; }
  .tr { --tr-hover: rgba(0,0,0,.06); --tr-sel: rgba(66,133,244,.28); --tr-hit: rgba(255,214,0,.45); --tr-hitnow: rgba(255,150,0,.6); }
  .tr.dark { --tr-hover: rgba(255,255,255,.08); --tr-sel: rgba(110,160,255,.35); --tr-hit: rgba(200,160,0,.4); --tr-hitnow: rgba(230,120,0,.6); }
  `;

  const theme = () => (document.documentElement.dataset.theme || 'light');

  // ---------------------------------------------------------------- shared plumbing

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  const isInput = (e) => !!e && (e.tagName === 'INPUT' || e.tagName === 'TEXTAREA');

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

  // Apply a new model: update the kit, then redraw (the kit never calls sync after ctx.update).
  function commit(n) {
    if (!st) return;
    if (n !== st.ctx.model) st.ctx.update(n);
    st.draw(st.ctx.model);
  }

  let installed = false;
  function install() {
    if (installed) return;
    installed = true;
    document.addEventListener('keydown', (e) => {
      if (!st || isInput(document.activeElement)) return;
      const m = st.ctx.model;
      if (!m || m.focus !== 'editor') return;
      const name = fam().keyFromEvent(e);
      if (!name) return;
      const r = fam().keyDown(m, st.ctx.spec, name);
      if (!r.handled) return;
      e.preventDefault();
      commit(r.model);
    });
    window.addEventListener('pointermove', (e) => {
      if (!st || !st.drag || !(e.buttons & 1)) return;
      const o = st.offsetAt(e.clientX, e.clientY);
      const m = st.ctx.model;
      const c = m.cur[0];
      if (o === null || (m.cur.length === 1 && c.h === o && c.a === st.drag.a)) return;
      commit(fam().pointerDrag(m, st.ctx.spec, st.drag.a, o));
    });
    window.addEventListener('pointerup', () => { if (st) st.drag = null; });
  }

  // Wire a find input: value -> model, focus -> model, Enter / Shift+Enter / Escape.
  function wireInput(input, which) {
    input.addEventListener('focus', () => {
      const m = st.ctx.model;
      if (m.focus !== which) commit(fam().focusTo(m, which));
    });
    input.addEventListener('input', () => commit(fam().findOp(st.ctx.model, st.ctx.spec, which, input.value)));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); commit(fam().findOp(st.ctx.model, st.ctx.spec, e.shiftKey ? 'prev' : 'next')); }
      else if (e.key === 'Escape') { e.preventDefault(); input.blur(); commit(fam().findOp(st.ctx.model, st.ctx.spec, 'close')); }
    });
  }
  function onBtn(b, fn) {
    b.addEventListener('click', (e) => { e.preventDefault(); fn(); });
  }
  // Mirror the model's focus into the DOM (the find inputs).
  function syncFocus(m, inputs) {
    const want = inputs[m.focus];
    if (want && document.activeElement !== want && want.offsetParent !== null) want.focus({ preventScroll: true });
    else if (!want && isInput(document.activeElement) && Object.values(inputs).includes(document.activeElement)) document.activeElement.blur();
  }
  function findCount(m, spec) {
    const ms = fam().matches(m, spec);
    if (!m.find || !m.find.query) return '';
    if (!ms.length) return 'No results';
    const cm = fam().currentMatch(m, spec);
    const i = Math.max(0, ms.findIndex((x) => x[0] === cm[0]));
    return `${i + 1} of ${ms.length}`;
  }

  // ---------------------------------------------------------------- classic: code editor

  const JS_CTRL = new Set(['if', 'else', 'for', 'while', 'return', 'await', 'import', 'from', 'export', 'try', 'catch', 'switch', 'case', 'break', 'continue', 'throw']);
  const PY_CTRL = new Set(['if', 'elif', 'else', 'for', 'while', 'return', 'await', 'import', 'from', 'try', 'except', 'raise', 'with', 'yield', 'pass', 'break', 'continue']);

  function tokens(line, spec) {
    const out = [];
    const kws = new Set(fam().KEYWORDS[spec.lang] || []);
    const ctrl = spec.lang === 'py' ? PY_CTRL : JS_CTRL;
    let i = 0;
    while (i < line.length) {
      const rest = line.slice(i);
      let mm;
      if (rest.startsWith(spec.tok)) { out.push([rest, 'c']); break; }
      if ((mm = rest.match(/^(['"])(?:\\.|(?!\1).)*\1?/))) { out.push([mm[0], 's']); i += mm[0].length; continue; }
      if ((mm = rest.match(/^\d+(\.\d+)?/))) { out.push([mm[0], 'n']); i += mm[0].length; continue; }
      if ((mm = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/))) {
        const w = mm[0];
        const after = line.slice(i + w.length);
        let cls = 'v';
        if (ctrl.has(w)) cls = 'kc';
        else if (kws.has(w)) cls = 'k';
        else if (/^\s*\(/.test(after)) cls = 'f';
        else if (/^[A-Z][A-Z0-9_]+$/.test(w)) cls = 'K';
        out.push([w, cls]);
        i += w.length;
        continue;
      }
      if ((mm = rest.match(/^\s+/))) { out.push([mm[0], '']); i += mm[0].length; continue; }
      out.push([line[i], 'p']);
      i += 1;
    }
    return out;
  }

  function buildClassic(ctx, box) {
    const { spec } = ctx;
    const F = fam();
    const look = ctx.rng.fork('look');
    const minimap = look.bool(0.6);
    const dots = look.bool(0.5);
    const second = look.bool(0.5) ? look.pick(spec.lang === 'py' ? ['README.md', 'settings.toml', 'test_util.py'] : ['README.md', 'package.json', 'util.test.js']) : null;
    const t = theme();
    const card = el('div', `te-card tc ${t === 'dark' ? 'dark' : t === 'warm' ? 'warm' : t === 'low' ? 'low' : ''}`);
    const tabs = el('div', 'tc-tabs');
    if (dots) { const d = el('div', 'tc-dots'); d.append(el('i'), el('i'), el('i')); tabs.append(d); }
    const tab = el('div', 'tc-tab');
    const ficon = el('span', 'tc-ficon', spec.lang === 'py' ? 'PY' : 'JS');
    const fname = el('span', '', spec.file);
    const dirty = el('span', 'tc-dirty', '');
    tab.append(ficon, fname, dirty);
    tabs.append(tab);
    if (second) tabs.append(el('div', 'tc-tab2', second));
    // strip: breadcrumbs + find button, or the find widget
    const strip = el('div', 'tc-strip');
    const crumbs = el('div', 'tc-crumbs', `src › ${spec.file}`);
    const findBtn = el('button', 'tc-findbtn');
    findBtn.type = 'button';
    findBtn.append(el('span', '', '⌕'), el('span', '', 'Find and replace'));
    const find = el('div', 'tc-find');
    const exp = el('button', 'tc-exp', '›');
    exp.type = 'button';
    exp.title = 'Toggle Replace';
    const q = el('input');
    q.placeholder = 'Find';
    q.spellcheck = false;
    const r1 = el('div', 'tc-row');
    const bCase = el('button', 'tc-ib', 'Aa');
    bCase.title = 'Match Case';
    const bWord = el('button', 'tc-ib tc-ww', 'ab');
    bWord.title = 'Match Whole Word';
    const count = el('span', 'tc-count', '');
    const bPrev = el('button', 'tc-ib', '↑');
    bPrev.title = 'Previous Match';
    const bNext = el('button', 'tc-ib', '↓');
    bNext.title = 'Next Match';
    const bClose = el('button', 'tc-ib', '✕');
    bClose.title = 'Close';
    r1.append(bCase, bWord, count, bPrev, bNext, bClose);
    const r2 = el('div', 'tc-r2');
    const rp = el('input');
    rp.placeholder = 'Replace';
    rp.spellcheck = false;
    const r2b = el('div', 'tc-row');
    const bOne = el('button', 'tc-tb', 'Replace');
    const bAll = el('button', 'tc-tb', 'Replace All');
    r2b.append(bOne, bAll);
    r2.append(rp, r2b);
    for (const b of [exp, bCase, bWord, bPrev, bNext, bClose, bOne, bAll]) b.type = 'button';
    find.append(exp, q, r1, r2);
    strip.append(crumbs, findBtn, find);
    // body
    const body = el('div', 'tc-body');
    const gutter = el('div', 'tc-gutter');
    const code = el('div', 'tc-code');
    const linesEl = el('div', 'tc-lines');
    const under = el('div', 'tc-over');
    const over = el('div', 'tc-over');
    code.append(under, linesEl, over);
    body.append(gutter, code);
    const mini = minimap ? el('div', 'tc-mini') : null;
    if (mini) body.append(mini);
    const status = el('div', 'tc-status');
    card.append(tabs, strip, body, status);
    ctx.stage.append(card);

    // metrics: line height from the room left, the font from the line height
    const nMax = Math.max(F.lines(spec.base).length, F.lines(spec.target).length) + 3;
    const chromeH = 32 + 63 + 22 + 2;
    const lh = Math.max(12, Math.min(20, Math.floor((box.h - 12 - chromeH) / nMax)));
    const fs = Math.max(10, Math.min(14, Math.round(lh * 0.7)));
    const font = `${fs}px/${lh}px 'DejaVu Sans Mono', 'Liberation Mono', Menlo, Consolas, monospace`;
    const probe = el('span', '', 'M'.repeat(80));
    probe.style.cssText = `font: ${font}; position: absolute; visibility: hidden; white-space: pre;`;
    code.append(probe);
    const cw = probe.getBoundingClientRect().width / 80;
    probe.remove();
    const PAD = 10;
    const TOP = 4;
    const maxLen = Math.max(...[...F.lines(spec.base), ...F.lines(spec.target)].map((x) => x.length)) + 14;
    const gutterW = Math.ceil(cw * 3 + 22);
    const miniW = mini ? 57 : 0;
    const codeW = Math.ceil(Math.min(box.w - 12 - gutterW - miniW, Math.max(maxLen * cw + PAD * 2, 560 - gutterW - miniW)));
    const bodyH = nMax * lh + TOP * 2;
    gutter.style.cssText = `width:${gutterW}px; font:${font}; padding-top:${TOP}px;`;
    code.style.cssText = `width:${codeW}px; height:${bodyH}px; font:${font};`;
    linesEl.style.cssText = `position:absolute; left:${PAD}px; top:${TOP}px; right:0;`;
    body.style.height = `${bodyH}px`;
    card.style.width = `${gutterW + codeW + miniW + 2}px`;

    const inputs = { query: q, repl: rp };
    wireInput(q, 'query');
    wireInput(rp, 'repl');
    const op = (name, arg) => () => commit(F.findOp(st.ctx.model, spec, name, arg));
    onBtn(findBtn, op('open', true));
    onBtn(exp, op('expand'));
    onBtn(bCase, op('case'));
    onBtn(bWord, op('word'));
    onBtn(bPrev, op('prev'));
    onBtn(bNext, op('next'));
    onBtn(bClose, op('close'));
    onBtn(bOne, op('one'));
    onBtn(bAll, op('all'));

    const text = () => st.ctx.model.text;
    function offsetAt(x, y) {
      const r = code.getBoundingClientRect();
      const ls = F.lines(text());
      const l = Math.max(0, Math.min(ls.length - 1, Math.floor((y - r.top - TOP) / lh)));
      const c = Math.max(0, Math.min(ls[l].length, Math.round((x - r.left - PAD) / cw)));
      return F.offOf(text(), l, c);
    }
    code.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('.tc-pop')) return;
      e.preventDefault();
      if (isInput(document.activeElement)) document.activeElement.blur();
      const m = st.ctx.model;
      const o = offsetAt(e.clientX, e.clientY);
      const count = ctx.util.clickCount(e);
      const n = F.pointerDown(m, spec, o, { shift: e.shiftKey, alt: e.altKey, count });
      st.drag = count === 1 && !e.altKey ? { a: n.cur[0].a } : null;
      commit(n);
    });
    gutter.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      if (isInput(document.activeElement)) document.activeElement.blur();
      const r = code.getBoundingClientRect();
      const o = offsetAt(r.left + PAD, e.clientY);
      const n = F.pointerDown(st.ctx.model, spec, o, { count: 3 });
      st.drag = null;
      commit(n);
    });

    const pt = (o) => {
      const [l, c] = F.lc(text(), o);
      return [PAD + c * cw, TOP + l * lh];
    };
    function draw(m) {
      const ls = F.lines(m.text);
      const [cl, cc] = F.lc(m.text, m.cur[0].h);
      // gutter and lines
      gutter.replaceChildren(...ls.map((_, i) => {
        const d = el('div', i === cl ? 'cur' : '', String(i + 1));
        d.style.height = `${lh}px`;
        return d;
      }));
      linesEl.replaceChildren(...ls.map((line) => {
        const d = el('div');
        d.style.height = `${lh}px`;
        for (const [tx, cls] of tokens(line, spec)) {
          if (!cls) d.append(document.createTextNode(tx));
          else d.append(el('span', cls, tx));
        }
        return d;
      }));
      // under the text: current line, matches, selections; over it: carets, popup
      const parts = [];
      if (m.cur.length === 1 && m.cur[0].h === m.cur[0].a) {
        const b = el('div', 'tc-line-cur');
        b.style.cssText = `top:${TOP + cl * lh}px; height:${lh}px;`;
        parts.push(b);
      }
      const rect = (a, b, cls) => {
        const [la] = F.lc(m.text, a);
        const [lb] = F.lc(m.text, b);
        for (let l = la; l <= lb; l++) {
          const s = l === la ? F.lc(m.text, a)[1] : 0;
          const e = l === lb ? F.lc(m.text, b)[1] : ls[l].length + 0.6;
          if (e <= s && la !== lb) continue;
          const d = el('div', cls);
          d.style.cssText = `left:${PAD + s * cw}px; top:${TOP + l * lh}px; width:${Math.max(0, (e - s) * cw)}px; height:${lh}px;`;
          parts.push(d);
        }
      };
      if (m.find && m.find.open && m.find.query) {
        const cm = F.currentMatch(m, spec);
        for (const [a, b] of F.matches(m, spec)) rect(a, b, `tc-match${cm && cm[0] === a ? ' now' : ''}`);
      }
      for (const c of m.cur) if (c.h !== c.a) rect(F.lo(c), F.hi(c), 'tc-sel');
      under.replaceChildren(...parts.splice(0));
      if (m.focus === 'editor' || m.cur.length > 1 || m.focus === null) {
        for (const c of m.cur) {
          const [x, y] = pt(c.h);
          const d = el('div', 'tc-caret');
          d.style.cssText = `left:${x - 1}px; top:${y}px; height:${lh}px;${m.focus === 'editor' ? '' : ' opacity:.35;'}`;
          parts.push(d);
        }
      }
      st.popRows = [];
      if (m.pop) {
        const pop = el('div', 'tc-pop');
        const [x, y] = pt(m.pop.a);
        const w = m.text.slice(m.pop.a, m.pop.o);
        m.pop.items.forEach((it, i) => {
          const row = el('div', i === m.pop.sel ? 'sel' : '');
          const kw = (F.KEYWORDS[spec.lang] || []).includes(it);
          row.append(el('span', 'ic', kw ? 'kw' : 'abc'));
          const lab = el('span');
          const k = it.toLowerCase().startsWith(w.toLowerCase()) ? w.length : 0;
          lab.append(el('b', '', it.slice(0, k)), document.createTextNode(it.slice(k)));
          row.append(lab, el('span', 'dt', kw ? 'keyword' : 'variable'));
          row.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            commit(F.popPick(st.ctx.model, spec, i));
          });
          st.popRows.push(row);
          pop.append(row);
        });
        const h = m.pop.items.length * 20 + 2;
        const below = y + lh + h <= bodyH;
        pop.style.left = `${Math.max(0, Math.min(codeW - 200, x - 22))}px`;
        pop.style.top = `${below ? y + lh : Math.max(0, y - h)}px`;
        parts.push(pop);
      }
      over.replaceChildren(...parts);
      // minimap
      if (mini) {
        const sc = Math.min(3, (bodyH - 8) / Math.max(1, ls.length));
        const bars = ls.map((line, i) => {
          const b = el('i');
          const ind = line.length - line.trimStart().length;
          b.style.cssText = `left:${4 + ind * 0.9}px; top:${4 + i * sc}px; width:${Math.min(46, line.trim().length * 0.9)}px;`;
          return b;
        });
        const view = el('div', 'view');
        view.style.height = `${Math.min(bodyH, ls.length * sc + 8)}px`;
        mini.replaceChildren(view, ...bars);
      }
      // tab, strip, find widget
      dirty.textContent = m.hist && m.hist.length ? '●' : '';
      const f = m.find;
      const open = !!(f && f.open);
      find.classList.toggle('open', open);
      find.classList.toggle('rep', open && !!f.rep);
      crumbs.style.visibility = open ? 'hidden' : '';
      findBtn.style.visibility = open ? 'hidden' : '';
      exp.textContent = open && f.rep ? '⌄' : '›';
      if (open) {
        if (q.value !== f.query) q.value = f.query;
        if (rp.value !== f.repl) rp.value = f.repl;
        bCase.classList.toggle('on', !!f.mc);
        bWord.classList.toggle('on', !!f.ww);
        count.textContent = findCount(m, spec);
      }
      syncFocus(m, inputs);
      // status bar
      const nsel = m.cur.length;
      const selChars = m.cur.reduce((s, c) => s + F.hi(c) - F.lo(c), 0);
      const items = [`Ln ${cl + 1}, Col ${cc + 1}`];
      if (nsel > 1) items.push(`${nsel} selections`);
      else if (selChars) items.push(`(${selChars} selected)`);
      status.replaceChildren(...items.map((s) => el('span', '', s)), el('span', 'sp'),
        el('span', '', `${ls.length} lines`), el('span', '', `Spaces: ${spec.unit}`), el('span', '', 'UTF-8'), el('span', '', 'LF'),
        el('span', '', F.LANG_LABEL[spec.lang]));
    }

    const center = (e) => ctx.util.center(e);
    function loc(t) {
      if (t.pos !== undefined) {
        const r = code.getBoundingClientRect();
        const [x, y] = pt(t.pos);
        return [r.left + x, r.top + y + lh / 2];
      }
      if (t.find) {
        const m = { open: findBtn, expand: exp, query: q, repl: rp, case: bCase, word: bWord, prev: bPrev, next: bNext, close: bClose, one: bOne, all: bAll }[t.find];
        return m ? center(m) : null;
      }
      if (t.pop !== undefined) return st.popRows[t.pop] ? center(st.popRows[t.pop]) : null;
      return null;
    }
    return { card, draw, loc, offsetAt };
  }

  // ---------------------------------------------------------------- rich: document editor

  const AUTHOR_COLORS = ['#1a73e8', '#d93025', '#188038', '#a142f4', '#e37400', '#00838f'];

  function buildRich(ctx, box, squeeze) {
    const { spec } = ctx;
    const F = fam();
    const look = ctx.rng.fork('look');
    const t = theme();
    const card = el('div', `te-card tr ${t === 'dark' ? 'dark' : ''}`);
    const authors = [...(spec.authors || []), 'You'];
    const colorOf = (a) => AUTHOR_COLORS[Math.max(0, authors.indexOf(a)) % AUTHOR_COLORS.length];
    // head
    const head = el('div', 'tr-head');
    const saved = el('span', 'tr-saved', 'All changes saved');
    head.append(el('div', 'tr-logo'), el('span', 'tr-title', spec.title || 'Untitled document'), saved);
    // toolbar
    const bar = el('div', 'tr-bar');
    const bUndo = el('button', 'tr-b', '↶');
    bUndo.title = 'Undo';
    const bRedo = el('button', 'tr-b', '↷');
    bRedo.title = 'Redo';
    const style = el('button', 'tr-b', 'Normal text ▾');
    style.disabled = true;
    const bold = el('button', 'tr-b', 'B');
    bold.style.fontWeight = '700';
    const ital = el('button', 'tr-b', 'I');
    ital.style.fontStyle = 'italic';
    const und = el('button', 'tr-b', 'U');
    und.style.textDecoration = 'underline';
    for (const b of [bold, ital, und]) b.disabled = true;
    const bFind = el('button', 'tr-b', 'Find and replace');
    const mode = el('button', 'tr-b tr-mode', '');
    mode.title = 'Mode';
    const menu = el('div', 'tr-menu');
    const MI = [['edit', 'Editing', 'Edit document directly'], ['suggest', 'Suggesting', 'Edits become suggestions'], ['view', 'Viewing', 'Read or print final document']];
    const mItems = {};
    for (const [k, name, desc] of MI) {
      const b = el('button', 'tr-mi');
      b.type = 'button';
      b.append(el('b', '', name), el('span', '', desc));
      mItems[k] = b;
      menu.append(b);
    }
    const order = look.bool(0.5);
    bar.append(bUndo, bRedo, el('span', 'tr-sep'), style, el('span', 'tr-sep'), bold, ital, und, el('span', 'tr-sep'));
    if (order) bar.append(bFind, el('span', 'tr-grow'), mode, menu);
    else bar.append(el('span', 'tr-grow'), bFind, el('span', 'tr-sep'), mode, menu);
    for (const b of [bUndo, bRedo, style, bold, ital, und, bFind, mode]) b.type = 'button';
    // find strip
    const strip = el('div', 'tr-strip');
    const ruler = el('div', 'tr-ruler');
    const find = el('div', 'tr-find');
    const q = el('input');
    q.placeholder = 'Find';
    q.spellcheck = false;
    const count = el('span', 'tr-count', '');
    const bPrev = el('button', 'tr-fb', '‹');
    bPrev.title = 'Previous';
    const bNext = el('button', 'tr-fb', '›');
    bNext.title = 'Next';
    const exp = el('button', 'tr-fb tr-exp', 'Replace…');
    const rpWrap = el('span', 'rp');
    const rp = el('input');
    rp.placeholder = 'Replace with';
    rp.spellcheck = false;
    const bCase = el('button', 'tr-chk', 'Match case');
    const bWord = el('button', 'tr-chk', 'Whole words');
    const bOne = el('button', 'tr-fb', 'Replace');
    const bAll = el('button', 'tr-fb', 'Replace all');
    rpWrap.append(el('span', '', 'with'), rp, bOne, bAll);
    const bClose = el('button', 'tr-fb', '✕');
    bClose.title = 'Close';
    find.append(el('span', '', 'Find'), q, count, bPrev, bNext, bCase, bWord, exp, rpWrap, bClose);
    for (const b of [bPrev, bNext, exp, bCase, bWord, bOne, bAll, bClose]) b.type = 'button';
    strip.append(ruler, find);
    // body
    const bodyEl = el('div', 'tr-body');
    const page = el('div', 'tr-page');
    const textEl = el('div', 'tr-text');
    const over = el('div', 'tr-over');
    page.append(textEl, over);
    const margin = el('div', 'tr-margin');
    bodyEl.append(page, margin);
    const foot = el('div', 'tr-foot');
    card.append(head, bar, strip, bodyEl, foot);
    ctx.stage.append(card);

    const marginW = 210;
    const pageW = Math.round(Math.max(420, Math.min(660, box.w - 12 - marginW - 14 * 3)));
    const fs = [15, 14, 13, 12][squeeze] || 12;
    const fontFamily = look.pick(["'DejaVu Serif', Georgia, serif", "'Liberation Serif', 'Times New Roman', serif", "'DejaVu Sans', Arial, sans-serif"]);
    textEl.style.cssText = `font: ${fs}px/1.6 ${fontFamily};`;
    page.style.width = `${pageW}px`;
    margin.style.width = `${marginW}px`;
    card.style.width = `${pageW + marginW + 14 * 3 + 2}px`;
    const bodyH = Math.max(240, box.h - 12 - (38 + 38 + 40 + 24 + 2 + 8));
    bodyEl.style.height = `${bodyH}px`;
    page.style.height = `${bodyH - 8}px`;

    const inputs = { query: q, repl: rp };
    wireInput(q, 'query');
    wireInput(rp, 'repl');
    const op = (name, arg) => () => commit(F.findOp(st.ctx.model, spec, name, arg));
    onBtn(bFind, op('open', true));
    onBtn(exp, op('expand'));
    onBtn(bCase, op('case'));
    onBtn(bWord, op('word'));
    onBtn(bPrev, op('prev'));
    onBtn(bNext, op('next'));
    onBtn(bClose, op('close'));
    onBtn(bOne, op('one'));
    onBtn(bAll, op('all'));
    onBtn(bUndo, () => commit(F.undo(st.ctx.model, spec)));
    onBtn(bRedo, () => commit(F.redo(st.ctx.model, spec)));
    onBtn(mode, () => commit(F.toggleMenu(st.ctx.model)));
    for (const [k] of MI) onBtn(mItems[k], () => commit(F.setMode(st.ctx.model, spec, k)));

    // flat offset <-> DOM
    let spans = [];
    function offsetAt(x, y) {
      const r = document.caretRangeFromPoint ? document.caretRangeFromPoint(x, y) : null;
      if (!r) return null;
      let node = r.startContainer;
      let off = r.startOffset;
      if (node.nodeType === 3) {
        const sp = node.parentElement && node.parentElement.closest('[data-o]');
        if (sp && textEl.contains(sp)) return Number(sp.dataset.o) + off;
      }
      const elx = node.nodeType === 1 ? node : node.parentElement;
      const p = elx && elx.closest('p[data-o]');
      if (p && textEl.contains(p)) {
        const kids = [...p.children];
        if (off >= kids.length) return Number(p.dataset.e);
        return Number((kids[off] && kids[off].dataset.o) || p.dataset.o);
      }
      // outside the text (page padding): the nearest paragraph by y
      const ps = [...textEl.children];
      let best = null;
      for (const pp of ps) {
        const rr = pp.getBoundingClientRect();
        if (y < rr.top) return best === null ? Number(pp.dataset.o) : best;
        best = Number(pp.dataset.e);
        if (y <= rr.bottom) return x < rr.left + rr.width / 2 ? Number(pp.dataset.o) : best;
      }
      return best;
    }
    function rangeAt(o) {
      // the text node and local offset for flat offset o (the span that contains o, else the one ending at o)
      let hit = null;
      for (const s of spans) {
        if (o >= s.o && o < s.o + s.n) { hit = s; break; }
        if (o === s.o + s.n) hit = s;
      }
      if (!hit) return null;
      return [hit.node, o - hit.o];
    }
    function rectsOf(a, b) {
      const ra = rangeAt(a);
      const rb = rangeAt(b);
      if (!ra || !rb) return [];
      const r = document.createRange();
      r.setStart(ra[0], ra[1]);
      r.setEnd(rb[0], rb[1]);
      return [...r.getClientRects()];
    }
    function caretRect(o) {
      const ra = rangeAt(o);
      if (!ra) return null;
      const r = document.createRange();
      r.setStart(ra[0], ra[1]);
      r.setEnd(ra[0], ra[1]);
      const rs = r.getClientRects();
      if (rs.length) return rs[rs.length > 1 && ra[1] === 0 ? rs.length - 1 : 0];
      // empty range rects can be missing at a node start: use the next character's box
      if (ra[1] < ra[0].length) {
        r.setEnd(ra[0], ra[1] + 1);
        const b = r.getBoundingClientRect();
        return { left: b.left, top: b.top, bottom: b.bottom, height: b.height };
      }
      r.setStart(ra[0], Math.max(0, ra[1] - 1));
      const b = r.getBoundingClientRect();
      return { left: b.right, top: b.top, bottom: b.bottom, height: b.height };
    }

    page.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      if (isInput(document.activeElement)) document.activeElement.blur();
      const o = offsetAt(e.clientX, e.clientY);
      if (o === null) return;
      const count = ctx.util.clickCount(e);
      const n = F.pointerDown(st.ctx.model, spec, o, { shift: e.shiftKey, count });
      st.drag = count === 1 ? { a: n.cur[0].a } : null;
      commit(n);
    });

    let cards = {};
    function draw(m) {
      // text
      spans = [];
      let o = 0;
      textEl.replaceChildren(...m.doc.map((para, pi) => {
        if (pi) o += 1;
        const p = el('p');
        p.dataset.o = String(o);
        for (const r of para) {
          const sp = el('span', r.k === 'b' ? '' : r.k, r.t);
          sp.dataset.o = String(o);
          if (r.k !== 'b') sp.style.color = colorOf(r.a);
          spans.push({ node: sp.firstChild, o, n: r.t.length });
          o += r.t.length;
          p.append(sp);
        }
        if (!para.length || !para.some((r) => r.t.length)) {
          const sp = el('span', '', '​');
          sp.dataset.o = String(o);
          p.append(sp);
        }
        p.dataset.e = String(o);
        return p;
      }));
      // overlay: find hits, selection, caret
      const pr = page.getBoundingClientRect();
      const parts = [];
      const box2 = (r, cls) => {
        const d = el('div', cls);
        d.style.cssText = `left:${r.left - pr.left}px; top:${r.top - pr.top}px; width:${Math.max(2, r.width)}px; height:${r.height}px;`;
        parts.push(d);
      };
      if (m.find && m.find.open && m.find.query) {
        const cm = F.currentMatch(m, spec);
        for (const [a, b] of F.matches(m, spec)) for (const r of rectsOf(a, b)) box2(r, `tr-hit${cm && cm[0] === a ? ' now' : ''}`);
      }
      const c = m.cur[0];
      if (c.h !== c.a) for (const r of rectsOf(F.lo(c), F.hi(c))) box2(r, 'tr-sel');
      else if (m.focus === 'editor' && m.mode !== 'view') {
        const r = caretRect(c.h);
        if (r) {
          const d = el('div', 'tr-caret');
          d.style.cssText = `left:${r.left - pr.left - 1}px; top:${r.top - pr.top}px; height:${r.height || fs * 1.3}px;`;
          parts.push(d);
        }
      }
      over.replaceChildren(...parts);
      // suggestion cards, next to their text, stacked without overlap (squeezed to the top when too tall)
      const ss = F.suggestions(m.doc);
      cards = {};
      const els = ss.map((s) => {
        const cd = el('div', 'tr-card');
        const hd = el('div', 'hd');
        const av = el('span', 'av', (s.author || '?')[0].toUpperCase());
        av.style.background = colorOf(s.author);
        const ac = el('div', 'ac');
        const ok = el('button', 'ok', '\u2713');
        ok.type = 'button';
        ok.title = 'Accept suggestion';
        const no = el('button', 'no', '\u2715');
        no.type = 'button';
        no.title = 'Reject suggestion';
        onBtn(ok, () => commit(F.review(st.ctx.model, spec, s.id, 'accept')));
        onBtn(no, () => commit(F.review(st.ctx.model, spec, s.id, 'reject')));
        ac.append(ok, no);
        hd.append(av, el('span', 'nm', s.author), ac);
        const ins = s.ins.trim();
        const del = s.del.trim();
        const ds = ins && del ? `Replace: "${del}" with "${ins}"` : ins ? `Add: "${ins}"` : `Delete: "${del}"`;
        cd.append(hd, el('div', 'ds', ds));
        cards[s.id] = { accept: ok, reject: no };
        return cd;
      });
      margin.replaceChildren(...els);
      const mr = margin.getBoundingClientRect();
      const GAP = 6;
      const hs = els.map((cd) => cd.offsetHeight);
      const total = hs.reduce((a, b) => a + b + GAP, 0);
      let y = 0;
      els.forEach((cd, i) => {
        const rr = caretRect(ss[i].o);
        const want = total > bodyH - 8 || !rr ? y : Math.max(0, rr.top - mr.top - 4);
        // never push later cards out of the margin
        const rest = hs.slice(i).reduce((a, b) => a + b + GAP, 0);
        const top = Math.max(y, Math.min(want, bodyH - 8 - rest));
        cd.style.top = `${top}px`;
        y = top + hs[i] + GAP;
      });
      // toolbar, menu, find
      mode.textContent = `✎ ${F.MODE_LABEL[m.mode]} ▾`;
      menu.classList.toggle('open', !!m.menu);
      for (const [k] of MI) mItems[k].classList.toggle('on', m.mode === k);
      bUndo.disabled = !(m.hist && m.hist.length);
      bRedo.disabled = !(m.fut && m.fut.length);
      saved.textContent = m.hist && m.hist.length ? 'Saving… all changes saved' : 'All changes saved';
      const f = m.find;
      const open = !!(f && f.open);
      find.classList.toggle('open', open);
      find.classList.toggle('rep', open && !!f.rep);
      ruler.style.visibility = open ? 'hidden' : '';
      if (open) {
        if (q.value !== f.query) q.value = f.query;
        if (rp.value !== f.repl) rp.value = f.repl;
        bCase.classList.toggle('on', !!f.mc);
        bWord.classList.toggle('on', !!f.ww);
        count.textContent = findCount(m, spec);
      }
      syncFocus(m, inputs);
      foot.replaceChildren(el('span', '', `Words: ${F.wordCount(m.doc)}`), el('span', '', `Suggestions: ${ss.length}`),
        el('span', '', `Mode: ${F.MODE_LABEL[m.mode]}`));
    }

    const center = (e) => ctx.util.center(e);
    function loc(t) {
      if (t.pos !== undefined) {
        const r = caretRect(t.pos);
        return r ? [r.left, r.top + (r.height || fs) / 2] : null;
      }
      if (t.find) {
        const m = { open: bFind, expand: exp, query: q, repl: rp, case: bCase, word: bWord, prev: bPrev, next: bNext, close: bClose, one: bOne, all: bAll }[t.find];
        return m ? center(m) : null;
      }
      if (t.sug) return cards[t.sug] ? center(cards[t.sug][t.act]) : null;
      if (t.mode) return t.mode === 'menu' ? center(mode) : center(mItems[t.mode]);
      if (t.undo) return center(bUndo);
      return null;
    }
    // fits: the text inside the page
    const fits = () => textEl.scrollHeight <= bodyH - 8 - 52;
    return { card, draw, loc, offsetAt, fits };
  }

  // ---------------------------------------------------------------- widgets

  function renderWith(build) {
    return function render(ctx) {
      ctx.css('te-style', CSS);
      install();
      const box = usable(ctx);
      let view = null;
      for (const squeeze of [0, 1, 2, 3]) {
        ctx.stage.replaceChildren();
        st = { ctx, drag: null, popRows: [] };
        view = build(ctx, box, squeeze);
        st.draw = view.draw;
        st.offsetAt = view.offsetAt;
        st.view = view;
        view.draw(ctx.model);
        if (!view.fits || view.fits()) break;
      }
      // place the card in the usable box (sampled alignment)
      const pr = ctx.rng.fork('place');
      const r = view.card.getBoundingClientRect();
      const free = (room, size) => Math.max(0, room - size - 8);
      const ax = pr.pick([0, 0.5, 0.5, 1]);
      const ay = pr.pick([0, 0.5, 1]);
      view.card.style.left = `${Math.round(box.x + 4 + free(box.w, r.width) * ax)}px`;
      view.card.style.top = `${Math.round(box.y + 4 + free(box.h, r.height) * ay)}px`;
      view.draw(ctx.model);
      return { anchors: [view.card], sync: (m) => view.draw(m) };
    };
  }
  function locate(t) {
    const p = st && st.view && st.view.loc(t);
    if (!p) throw new Error(`use-text-editor cannot locate ${JSON.stringify(t)}`);
    return p;
  }

  env.widget({
    task: 'use-text-editor',
    site: 'base',
    name: 'classic',
    split: 'train',
    scenarios: ['cursor', 'multiline', 'multicursor', 'findreplace', 'autocomplete'],
    traits: { doc: 'code' },
    render: renderWith(buildClassic),
    locate,
  });

  env.widget({
    task: 'use-text-editor',
    site: 'base',
    name: 'rich',
    split: 'train',
    scenarios: ['cursor', 'findreplace', 'trackchanges'],
    traits: { doc: 'prose' },
    render: renderWith(buildRich),
    locate,
  });
})();
