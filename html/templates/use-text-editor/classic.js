/*
 * use-text-editor/classic: code editor with syntax-colored lines, multiple carets and completions.
 * Scenarios: cursor, multiline, multicursor, findreplace, autocomplete (traits.doc = 'code').
 * With design: {}, reproduces design-use-text-editor-cursor-01, design-use-text-editor-multiline-01,
 * design-use-text-editor-multicursor-01, design-use-text-editor-findreplace-01 and design-use-text-editor-autocomplete-01.
 * Scenario presets: none; scenarios use the same widget with their task's model and plan.
 * Design: { <token>: value, parts: { <name>: (base, S) => replacement } }.
 * S.ctx/spec/st/els/metrics/view read the live page state; S.D/P are the resolved tokens/parts.
 * els is the control map from build, metrics is the measured geometry, view exposes draw-shape/loc/offsetAt.
 * Factories hold all page state and perform no DOM work until render. All part calls go through P.
 * CSS supplies structural classes and theme palettes; site.css may restyle those classes.
 *
 * Tokens (objects/arrays replace whole defaults, rather than merging):
 *   palette = {}: theme -> CSS variable table (e.g. { dark: { '--tc-bg': '#111' } }); empty uses CSS palettes.
 *   noResults = 'No results': empty find-result message.
 *   placeGap = 8: reserved room at the far card edge in placement calculations (px).
 *   placeInset = 4: card inset from the usable stage origin (px).
 *   fontFamily = "'DejaVu Sans Mono', 'Liberation Mono', Menlo, Consolas, monospace": code font stack.
 *   minLineHeight = 12, maxLineHeight = 20: line height bounds (px), sized to fit base and target text.
 *   minFontSize = 10, maxFontSize = 14: measured code font size bounds (px).
 *   fontRatio = 0.7: font size as a fraction of line height before rounding/clamping.
 *   codePadding = 10, codeTop = 4: text origin inside the code pane (px).
 *   minWidth = 560: preferred minimum card content width before fitting the stage (px).
 *   completionHeight = 20: popup row height, used by both CSS and popup placement (px).
 *   labels = { find: 'Find', replace: 'Replace', replaceAll: 'Replace All', findButton: 'Find and replace',
 *     toggleReplace: 'Toggle Replace', matchCase: 'Match Case', wholeWord: 'Match Whole Word',
 *     previous: 'Previous Match', next: 'Next Match', close: 'Close', keyword: 'keyword', variable: 'variable' }:
 *     find controls and completion detail labels.
 *
 * Parts (return nothing unless noted):
 *   el(tag, cls?, text?) -> element: create an unattached node with class/text.
 *   usable(ctx) -> { x, y, w, h }: stage minus any overlapping floating end control.
 *   commit(model): update the kit when changed, then redraw from the current model.
 *   install(): install page keyboard and pointer-drag listeners once per factory.
 *   wireInput(input, which): bind find query/replacement input, focus and Enter/Escape.
 *   onBtn(button, fn): bind a click handler and prevent its default action.
 *   syncFocus(model, inputs): mirror editor/find focus to the DOM.
 *   findCount(model, spec) -> string: current match index, empty string or noResults.
 *   theme() -> string: html data-theme, falling back to light.
 *   begin(ctx): before sizing/building the editor (default: nothing).
 *   rendered(ctx, view): after placement and the final draw (default: nothing).
 *   place(ctx, box, view): place the card; place fork draws horizontal then vertical alignment.
 *   palette(card, theme): apply the theme token variables (classic also sets changed popup row height).
 *   appearance(ctx, look) -> { minimap, dots, second }: draw bool(.6), bool(.5), bool(.5), optional pick.
 *   frame(ctx) -> card: create the themed editor frame and apply P.palette.
 *   tabs(ctx, { dots, second }) -> { tabs, dirty }: file tabs and optional window dots.
 *   findStrip(ctx) -> { strip, crumbs, findBtn, find, exp, q, rp, bCase, bWord, count,
 *     bPrev, bNext, bClose, bOne, bAll }: breadcrumbs and find/replace controls (query=q, replacement=rp).
 *   body(ctx, minimap) -> { body, gutter, code, linesEl, under, over, mini }: code panes and optional minimap.
 *   metrics(ctx, box, controls) -> { lh, fs, cw, PAD, TOP, codeW, bodyH }: measure font and size panes.
 *   gutterLine(ctx, index, current, lh) -> element: numbered gutter row with current-line class.
 *   codeLine(ctx, line, lh) -> element: syntax-colored line drawn with P.tokens.
 *   completionRow(ctx, item, index, prefix, model) -> element: highlighted completion label and kind.
 *   completion(ctx, model, geometry, pt) -> element|null: popup, row handlers and st.popRows oracle targets.
 *   minimap(ctx, mini, lines, bodyH): redraw the minimap viewport and code bars.
 *   status(ctx, statusEl, model, lines, currentLine, currentCol): redraw the code status bar.
 *   shown(ctx, controls, model): after each draw, including sync and input updates (default: nothing).
 *   tokens(line, spec) -> [text, class][]: syntax tokenization without any random draws.
 *   build(ctx, box, squeeze?) -> { card, draw, loc, offsetAt, fits? }: assemble parts and keep interaction logic.
 *     draw(model) redraws; loc(target) returns a viewport point; offsetAt(x,y) returns a flat text offset.
 *     fits() is rich-only and tests page text height before the next squeeze attempt.
 *   render(ctx) -> { anchors, sync }: build, squeeze if needed, place and redraw the card.
 *   locate(target) -> [x, y]: delegate to the current view; throw for an unknown target.
 * Keep each reference rng draw in order, even when hiding its sampled decoration. The look fork draws
 * minimap, window dots, second-tab presence and optional tab name; place draws x then y alignment.
 * Extra decoration randomness uses ctx.rng.fork(label).
 */
(function () {
  'use strict';

  const fam = () => env.taskDef.helpers;

  const JS_CTRL = new Set(['if', 'else', 'for', 'while', 'return', 'await', 'import', 'from', 'export', 'try', 'catch', 'switch', 'case', 'break', 'continue', 'throw']);
  const PY_CTRL = new Set(['if', 'elif', 'else', 'for', 'while', 'return', 'await', 'import', 'from', 'try', 'except', 'raise', 'with', 'yield', 'pass', 'break', 'continue']);

  const TOKENS = {
    palette: {},
    noResults: 'No results',
    placeGap: 8,
    placeInset: 4,
    fontFamily: "'DejaVu Sans Mono', 'Liberation Mono', Menlo, Consolas, monospace",
    minLineHeight: 12,
    maxLineHeight: 20,
    minFontSize: 10,
    maxFontSize: 14,
    fontRatio: 0.7,
    codePadding: 10,
    codeTop: 4,
    minWidth: 560,
    completionHeight: 20,
    labels: { find: 'Find', replace: 'Replace', replaceAll: 'Replace All', findButton: 'Find and replace',
      toggleReplace: 'Toggle Replace', matchCase: 'Match Case', wholeWord: 'Match Whole Word',
      previous: 'Previous Match', next: 'Next Match', close: 'Close', keyword: 'keyword', variable: 'variable' },
  };

  env.template('use-text-editor/classic', (design, def) => {
    const shared = env.templateLib('use-text-editor/_shared');
    const { isInput } = shared;
    const CSS = env.templateLib('use-text-editor/_styles').classic;

    let D, P;
    let st = null;
    let ctxRef = null;
    const BASE = {};
    const S = { get st() { return st; }, get ctx() { return ctxRef; },
      get spec() { return ctxRef && ctxRef.spec; }, get els() { return st && st.els; },
      get metrics() { return st && st.metrics; }, get view() { return st && st.view; },
      get D() { return D; }, get P() { return P; } };

    shared.parts(BASE, S);

    BASE.palette = function (card, theme) {
      for (const [key, value] of Object.entries(D.palette[theme] || {})) card.style.setProperty(key, value);
      if (D.completionHeight !== 20) card.style.setProperty('--te-completion-height', `${D.completionHeight}px`);
    };

    BASE.appearance = function (ctx, look) {
      const { spec } = ctx;
      const minimap = look.bool(0.6);
      const dots = look.bool(0.5);
      const second = look.bool(0.5) ? look.pick(spec.lang === 'py' ? ['README.md', 'settings.toml', 'test_util.py'] : ['README.md', 'package.json', 'util.test.js']) : null;
      return { minimap, dots, second };
    };

    BASE.frame = function (ctx) {
      const t = P.theme();
      const card = P.el('div', `te-card tc ${t === 'dark' ? 'dark' : t === 'warm' ? 'warm' : t === 'low' ? 'low' : ''}`);
      P.palette(card, t);
      return card;
    };

    BASE.tabs = function (ctx, look) {
      const { spec } = ctx;
      const { dots, second } = look;
      const tabs = P.el('div', 'tc-tabs');
      if (dots) { const d = P.el('div', 'tc-dots'); d.append(P.el('i'), P.el('i'), P.el('i')); tabs.append(d); }
      const tab = P.el('div', 'tc-tab');
      const ficon = P.el('span', 'tc-ficon', spec.lang === 'py' ? 'PY' : 'JS');
      const fname = P.el('span', '', spec.file);
      const dirty = P.el('span', 'tc-dirty', '');
      tab.append(ficon, fname, dirty);
      tabs.append(tab);
      if (second) tabs.append(P.el('div', 'tc-tab2', second));
      return { tabs, dirty };
    };

    BASE.findStrip = function (ctx) {
      const { spec } = ctx;
      const strip = P.el('div', 'tc-strip');
      const crumbs = P.el('div', 'tc-crumbs', `src › ${spec.file}`);
      const findBtn = P.el('button', 'tc-findbtn');
      findBtn.type = 'button';
      findBtn.append(P.el('span', '', '⌕'), P.el('span', '', D.labels.findButton));
      const find = P.el('div', 'tc-find');
      const exp = P.el('button', 'tc-exp', '›');
      exp.type = 'button';
      exp.title = D.labels.toggleReplace;
      const q = P.el('input');
      q.placeholder = D.labels.find;
      q.spellcheck = false;
      const r1 = P.el('div', 'tc-row');
      const bCase = P.el('button', 'tc-ib', 'Aa');
      bCase.title = D.labels.matchCase;
      const bWord = P.el('button', 'tc-ib tc-ww', 'ab');
      bWord.title = D.labels.wholeWord;
      const count = P.el('span', 'tc-count', '');
      const bPrev = P.el('button', 'tc-ib', '↑');
      bPrev.title = D.labels.previous;
      const bNext = P.el('button', 'tc-ib', '↓');
      bNext.title = D.labels.next;
      const bClose = P.el('button', 'tc-ib', '✕');
      bClose.title = D.labels.close;
      r1.append(bCase, bWord, count, bPrev, bNext, bClose);
      const r2 = P.el('div', 'tc-r2');
      const rp = P.el('input');
      rp.placeholder = D.labels.replace;
      rp.spellcheck = false;
      const r2b = P.el('div', 'tc-row');
      const bOne = P.el('button', 'tc-tb', D.labels.replace);
      const bAll = P.el('button', 'tc-tb', D.labels.replaceAll);
      r2b.append(bOne, bAll);
      r2.append(rp, r2b);
      for (const b of [exp, bCase, bWord, bPrev, bNext, bClose, bOne, bAll]) b.type = 'button';
      find.append(exp, q, r1, r2);
      strip.append(crumbs, findBtn, find);
      return { strip, crumbs, findBtn, find, exp, q, rp, bCase, bWord, count, bPrev, bNext, bClose, bOne, bAll };
    };

    BASE.body = function (ctx, minimap) {
      const body = P.el('div', 'tc-body');
      const gutter = P.el('div', 'tc-gutter');
      const code = P.el('div', 'tc-code');
      const linesEl = P.el('div', 'tc-lines');
      const under = P.el('div', 'tc-over');
      const over = P.el('div', 'tc-over');
      code.append(under, linesEl, over);
      body.append(gutter, code);
      const mini = minimap ? P.el('div', 'tc-mini') : null;
      if (mini) body.append(mini);
      return { body, gutter, code, linesEl, under, over, mini };
    };

    BASE.metrics = function (ctx, box, controls) {
      const { spec } = ctx;
      const F = fam();
      const { card, gutter, code, linesEl, body, mini } = controls;
      const nMax = Math.max(F.lines(spec.base).length, F.lines(spec.target).length) + 3;
      const chromeH = 32 + 63 + 22 + 2;
      const lh = Math.max(D.minLineHeight, Math.min(D.maxLineHeight, Math.floor((box.h - 12 - chromeH) / nMax)));
      const fs = Math.max(D.minFontSize, Math.min(D.maxFontSize, Math.round(lh * D.fontRatio)));
      const font = `${fs}px/${lh}px ${D.fontFamily}`;
      const probe = P.el('span', '', 'M'.repeat(80));
      probe.style.cssText = `font: ${font}; position: absolute; visibility: hidden; white-space: pre;`;
      code.append(probe);
      const cw = probe.getBoundingClientRect().width / 80;
      probe.remove();
      const PAD = D.codePadding;
      const TOP = D.codeTop;
      const maxLen = Math.max(...[...F.lines(spec.base), ...F.lines(spec.target)].map((x) => x.length)) + 14;
      const gutterW = Math.ceil(cw * 3 + 22);
      const miniW = mini ? 57 : 0;
      const codeW = Math.ceil(Math.min(box.w - 12 - gutterW - miniW, Math.max(maxLen * cw + PAD * 2, D.minWidth - gutterW - miniW)));
      const bodyH = nMax * lh + TOP * 2;
      gutter.style.cssText = `width:${gutterW}px; font:${font}; padding-top:${TOP}px;`;
      code.style.cssText = `width:${codeW}px; height:${bodyH}px; font:${font};`;
      linesEl.style.cssText = `position:absolute; left:${PAD}px; top:${TOP}px; right:0;`;
      body.style.height = `${bodyH}px`;
      card.style.width = `${gutterW + codeW + miniW + 2}px`;

      return { lh, fs, cw, PAD, TOP, codeW, bodyH };
    };

    BASE.gutterLine = function (ctx, index, current, lh) {
      const d = P.el('div', index === current ? 'cur' : '', String(index + 1));
      d.style.height = `${lh}px`;
      return d;
    };

    BASE.codeLine = function (ctx, line, lh) {
      const d = P.el('div');
      d.style.height = `${lh}px`;
      for (const [tx, cls] of P.tokens(line, ctx.spec)) {
        if (!cls) d.append(document.createTextNode(tx));
        else d.append(P.el('span', cls, tx));
      }
      return d;
    };

    BASE.completionRow = function (ctx, it, i, w, m) {
      const F = fam();
      const { spec } = ctx;
      const row = P.el('div', i === m.pop.sel ? 'sel' : '');
      const kw = (F.KEYWORDS[spec.lang] || []).includes(it);
      row.append(P.el('span', 'ic', kw ? 'kw' : 'abc'));
      const lab = P.el('span');
      const k = it.toLowerCase().startsWith(w.toLowerCase()) ? w.length : 0;
      lab.append(P.el('b', '', it.slice(0, k)), document.createTextNode(it.slice(k)));
      row.append(lab, P.el('span', 'dt', kw ? D.labels.keyword : D.labels.variable));
      return row;
    };

    BASE.completion = function (ctx, m, geometry, pt) {
      const F = fam();
      const { spec } = ctx;
      const { lh, codeW, bodyH } = geometry;
      st.popRows = [];
      if (!m.pop) return null;
      const pop = P.el('div', 'tc-pop');
      const [x, y] = pt(m.pop.a);
      const w = m.text.slice(m.pop.a, m.pop.o);
      m.pop.items.forEach((it, i) => {
        const row = P.completionRow(ctx, it, i, w, m);
        row.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          P.commit(F.popPick(st.ctx.model, spec, i));
        });
        st.popRows.push(row);
        pop.append(row);
      });
      const h = m.pop.items.length * D.completionHeight + 2;
      const below = y + lh + h <= bodyH;
      pop.style.left = `${Math.max(0, Math.min(codeW - 200, x - 22))}px`;
      pop.style.top = `${below ? y + lh : Math.max(0, y - h)}px`;
      return pop;
    };

    BASE.minimap = function (ctx, mini, ls, bodyH) {
      const sc = Math.min(3, (bodyH - 8) / Math.max(1, ls.length));
      const bars = ls.map((line, i) => {
        const b = P.el('i');
        const ind = line.length - line.trimStart().length;
        b.style.cssText = `left:${4 + ind * 0.9}px; top:${4 + i * sc}px; width:${Math.min(46, line.trim().length * 0.9)}px;`;
        return b;
      });
      const view = P.el('div', 'view');
      view.style.height = `${Math.min(bodyH, ls.length * sc + 8)}px`;
      mini.replaceChildren(view, ...bars);
    };

    BASE.status = function (ctx, status, m, ls, cl, cc) {
      const F = fam();
      const { spec } = ctx;
      const nsel = m.cur.length;
      const selChars = m.cur.reduce((s, c) => s + F.hi(c) - F.lo(c), 0);
      const items = [`Ln ${cl + 1}, Col ${cc + 1}`];
      if (nsel > 1) items.push(`${nsel} selections`);
      else if (selChars) items.push(`(${selChars} selected)`);
      status.replaceChildren(...items.map((s) => P.el('span', '', s)), P.el('span', 'sp'),
        P.el('span', '', `${ls.length} lines`), P.el('span', '', `Spaces: ${spec.unit}`), P.el('span', '', 'UTF-8'), P.el('span', '', 'LF'),
        P.el('span', '', F.LANG_LABEL[spec.lang]));
    };

    BASE.shown = (ctx, controls, m) => {};

    BASE.tokens = function (line, spec) {
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
    };
    BASE.build = function (ctx, box) {
      const { spec } = ctx;
      const F = fam();
      const look = ctx.rng.fork('look');
      const { minimap, dots, second } = P.appearance(ctx, look);
      const card = P.frame(ctx);
      const { tabs, dirty } = P.tabs(ctx, { dots, second });
      // strip: breadcrumbs + find button, or the find widget
      const { strip, crumbs, findBtn, find, exp, q, rp, bCase, bWord, count, bPrev, bNext, bClose, bOne, bAll } = P.findStrip(ctx);
      // body
      const { body, gutter, code, linesEl, under, over, mini } = P.body(ctx, minimap);
      const status = P.el('div', 'tc-status');
      card.append(tabs, strip, body, status);
      ctx.stage.append(card);

      // metrics: line height from the room left, the font from the line height
      const controls = { card, tabs, dirty, strip, crumbs, findBtn, find, exp, q, rp, bCase, bWord, count, bPrev, bNext, bClose, bOne, bAll, body, gutter, code, linesEl, under, over, mini, status };
      st.els = controls;
      st.metrics = P.metrics(ctx, box, controls);
      const { lh, cw, PAD, TOP, bodyH } = st.metrics;
      const inputs = { query: q, repl: rp };
      shared.wireFind(S, controls, findBtn);

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
        P.commit(n);
      });
      gutter.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        if (isInput(document.activeElement)) document.activeElement.blur();
        const r = code.getBoundingClientRect();
        const o = offsetAt(r.left + PAD, e.clientY);
        const n = F.pointerDown(st.ctx.model, spec, o, { count: 3 });
        st.drag = null;
        P.commit(n);
      });

      const pt = (o) => {
        const [l, c] = F.lc(text(), o);
        return [PAD + c * cw, TOP + l * lh];
      };
      function draw(m) {
        const ls = F.lines(m.text);
        const [cl, cc] = F.lc(m.text, m.cur[0].h);
        // gutter and lines
        gutter.replaceChildren(...ls.map((_, i) => P.gutterLine(ctx, i, cl, lh)));
        linesEl.replaceChildren(...ls.map((line) => P.codeLine(ctx, line, lh)));
        // under the text: current line, matches, selections; over it: carets, popup
        const parts = [];
        if (m.cur.length === 1 && m.cur[0].h === m.cur[0].a) {
          const b = P.el('div', 'tc-line-cur');
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
            const d = P.el('div', cls);
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
            const d = P.el('div', 'tc-caret');
            d.style.cssText = `left:${x - 1}px; top:${y}px; height:${lh}px;${m.focus === 'editor' ? '' : ' opacity:.35;'}`;
            parts.push(d);
          }
        }
        const pop = P.completion(ctx, m, st.metrics, pt);
        if (pop) parts.push(pop);
        over.replaceChildren(...parts);
        // minimap
        if (mini) P.minimap(ctx, mini, ls, bodyH);
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
          count.textContent = P.findCount(m, spec);
        }
        P.syncFocus(m, inputs);
        // status bar
        P.status(ctx, status, m, ls, cl, cc);
        P.shown(ctx, controls, m);
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
    };

    BASE.render = function (ctx) {
      ctxRef = ctx;
      ctx.css('te-style', CSS);
      P.install();
      P.begin(ctx);
      const box = P.usable(ctx);
      let view = null;
      for (const squeeze of [0, 1, 2, 3]) {
        ctx.stage.replaceChildren();
        st = { ctx, drag: null, popRows: [] };
        view = P.build(ctx, box, squeeze);
        st.draw = view.draw;
        st.offsetAt = view.offsetAt;
        st.view = view;
        view.draw(ctx.model);
        if (!view.fits || view.fits()) break;
      }
      P.place(ctx, box, view);
      view.draw(ctx.model);
      P.rendered(ctx, view);
      return { anchors: [view.card], sync: (m) => view.draw(m) };
    };
    BASE.locate = function (t) {
      const p = st && st.view && st.view.loc(t);
      if (!p) throw new Error(`use-text-editor cannot locate ${JSON.stringify(t)}`);
      return p;
    };

    ({ D, P } = env.templateDesign('use-text-editor/classic', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return { traits: { doc: 'code' }, render: (ctx) => P.render(ctx), locate: (target) => P.locate(target) };
  }, { uses: ['use-text-editor/_shared', 'use-text-editor/_styles'] });
})();
