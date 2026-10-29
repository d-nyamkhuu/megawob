/*
 * use-text-editor/rich: document editor with attributed suggestions and review controls.
 * Scenarios: cursor, findreplace, trackchanges (traits.doc = 'prose').
 * With design: {}, reproduces design-use-text-editor-trackchanges-01.
 * Scenario presets: none; scenarios use the same widget with their task's model and plan.
 * Design: { <token>: value, parts: { <name>: (base, S) => replacement } }.
 * S.ctx/spec/st/els/metrics/view read the live page state; S.D/P are the resolved tokens/parts.
 * els is the control map from build, metrics is the measured geometry, view exposes draw-shape/loc/offsetAt.
 * Factories hold all page state and perform no DOM work until render. All part calls go through P.
 * CSS supplies structural classes and theme palettes; site.css may restyle those classes.
 *
 * Tokens (objects/arrays replace whole defaults, rather than merging):
 *   palette = {}: theme -> CSS variable table (e.g. { dark: { '--tr-sel': '#369' } }); empty uses CSS palettes.
 *   noResults = 'No results': empty find-result message.
 *   placeGap = 8: reserved room at the far card edge in placement calculations (px).
 *   placeInset = 4: card inset from the usable stage origin (px).
 *   marginWidth = 210: suggestion column width (px).
 *   minPageWidth = 420, maxPageWidth = 660: document page width bounds (px).
 *   minBodyHeight = 240: minimum body height (px).
 *   fontSizes = [15, 14, 13, 12]: document sizes (px) tried in order until text fits.
 *   fontFamilies = ["'DejaVu Serif', Georgia, serif", "'Liberation Serif', 'Times New Roman', serif",
 *     "'DejaVu Sans', Arial, sans-serif"]: sampled document font stacks (keep the look.pick draw).
 *   lineHeight = 1.6: document line height multiplier.
 *   selfAuthor = 'You': author appended to spec.authors for color lookup.
 *   authorColors = ['#1a73e8', '#d93025', '#188038', '#a142f4', '#e37400', '#00838f']: cycling author colors.
 *   labels = { title: 'Untitled document', saved: 'All changes saved', saving: 'Saving… all changes saved',
 *     undo: 'Undo', redo: 'Redo', style: 'Normal text ▾', findButton: 'Find and replace', mode: 'Mode',
 *     find: 'Find', previous: 'Previous', next: 'Next', expand: 'Replace…', replaceWith: 'Replace with',
 *     matchCase: 'Match case', wholeWord: 'Whole words', replace: 'Replace', replaceAll: 'Replace all',
 *     with: 'with', close: 'Close', accept: 'Accept suggestion', reject: 'Reject suggestion' }: UI labels.
 *   modes = [['edit', 'Editing', 'Edit document directly'], ['suggest', 'Suggesting', 'Edits become suggestions'],
 *     ['view', 'Viewing', 'Read or print final document']]: mode menu [model key, label, description] entries.
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
 *   frame(ctx) -> card: create the themed editor frame and apply P.palette.
 *   heading(ctx) -> { head, saved }: logo, document title and save status.
 *   toolbar(ctx, look) -> { bar, bUndo, bRedo, bFind, mode, menu, MI, mItems }: toolbar/mode menu.
 *     MI is the modes table; mItems maps mode keys to buttons. Retains look.bool(.5) order draw.
 *   modeItem(ctx, key, name, description) -> button: one labeled mode-menu entry.
 *   findStrip(ctx) -> { strip, ruler, find, q, count, bPrev, bNext, exp, rp, bCase, bWord,
 *     bOne, bAll, bClose }: ruler and find/replace controls (query=q, replacement=rp).
 *   body(ctx) -> { bodyEl, page, textEl, over, margin }: document page, overlay and suggestion margin.
 *   metrics(ctx, box, squeeze, look, controls) -> { fs, bodyH }: fit page and sample font with look.pick.
 *   authorColor(ctx, author) -> CSS color: cycle authorColors over spec.authors plus selfAuthor.
 *   run(ctx, run, offset, colorOf) -> span: text, suggestion class/color and data-o for DOM hit testing.
 *   paragraph(ctx, runs, offset, colorOf) -> { p, spans, end }: paragraph and flat-offset text-node map.
 *     spans = [{ node, o, n }] pairs each text node with its flat start and length; end is the next offset.
 *   suggestionCard(ctx, suggestion, colorOf) -> { card, controls }: author, description, accept/reject.
 *     controls = { accept, reject } buttons; suggestions() returns these keyed by suggestion id.
 *   suggestion(ctx, card, suggestion): decorate a completed suggestion card (default: nothing).
 *   suggestions(ctx, suggestions, margin, bodyH, caretRect, colorOf) -> controlsById: stack cards by text.
 *   footer(ctx, foot, model, suggestions): word count, open suggestions and mode.
 *   shown(ctx, controls, model): after each draw, including sync and input updates (default: nothing).
 *   build(ctx, box, squeeze?) -> { card, draw, loc, offsetAt, fits? }: assemble parts and keep interaction logic.
 *     draw(model) redraws; loc(target) returns a viewport point; offsetAt(x,y) returns a flat text offset.
 *     fits() is rich-only and tests page text height before the next squeeze attempt.
 *   render(ctx) -> { anchors, sync }: build, squeeze if needed, place and redraw the card.
 *   locate(target) -> [x, y]: delegate to the current view; throw for an unknown target.
 * Keep each reference rng draw in order, even when hiding its sampled decoration. Rich retries fork
 * look anew for each squeeze, drawing toolbar order before font choice. Extra draws use ctx.rng.fork(label).
 */
(function () {
  'use strict';

  const fam = () => env.taskDef.helpers;

  function textGeometry(textEl, spansOf) {
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
    for (const s of spansOf()) {
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
    return { offsetAt, rangeAt, rectsOf, caretRect };
  }


  const TOKENS = {
    palette: {},
    noResults: 'No results',
    placeGap: 8,
    placeInset: 4,
    marginWidth: 210,
    minPageWidth: 420,
    maxPageWidth: 660,
    minBodyHeight: 240,
    fontSizes: [15, 14, 13, 12],
    fontFamilies: ["'DejaVu Serif', Georgia, serif", "'Liberation Serif', 'Times New Roman', serif", "'DejaVu Sans', Arial, sans-serif"],
    lineHeight: 1.6,
    selfAuthor: 'You',
    authorColors: ['#1a73e8', '#d93025', '#188038', '#a142f4', '#e37400', '#00838f'],
    labels: { title: 'Untitled document', saved: 'All changes saved', saving: 'Saving… all changes saved',
      undo: 'Undo', redo: 'Redo', style: 'Normal text ▾', findButton: 'Find and replace', mode: 'Mode',
      find: 'Find', previous: 'Previous', next: 'Next', expand: 'Replace…', replaceWith: 'Replace with',
      matchCase: 'Match case', wholeWord: 'Whole words', replace: 'Replace', replaceAll: 'Replace all',
      with: 'with', close: 'Close', accept: 'Accept suggestion', reject: 'Reject suggestion' },
    modes: [['edit', 'Editing', 'Edit document directly'], ['suggest', 'Suggesting', 'Edits become suggestions'], ['view', 'Viewing', 'Read or print final document']],
  };

  env.template('use-text-editor/rich', (design, def) => {
    const shared = env.templateLib('use-text-editor/_shared');
    const { isInput } = shared;
    const CSS = env.templateLib('use-text-editor/_styles').rich;

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
    };

    BASE.frame = function (ctx) {
      const t = P.theme();
      const card = P.el('div', `te-card tr ${t === 'dark' ? 'dark' : ''}`);
      P.palette(card, t);
      return card;
    };

    BASE.heading = function (ctx) {
      const { spec } = ctx;
      const head = P.el('div', 'tr-head');
      const saved = P.el('span', 'tr-saved', D.labels.saved);
      head.append(P.el('div', 'tr-logo'), P.el('span', 'tr-title', spec.title || D.labels.title), saved);
      return { head, saved };
    };

    BASE.toolbar = function (ctx, look) {
      const bar = P.el('div', 'tr-bar');
      const bUndo = P.el('button', 'tr-b', '↶');
      bUndo.title = D.labels.undo;
      const bRedo = P.el('button', 'tr-b', '↷');
      bRedo.title = D.labels.redo;
      const style = P.el('button', 'tr-b', D.labels.style);
      style.disabled = true;
      const bold = P.el('button', 'tr-b', 'B');
      bold.style.fontWeight = '700';
      const ital = P.el('button', 'tr-b', 'I');
      ital.style.fontStyle = 'italic';
      const und = P.el('button', 'tr-b', 'U');
      und.style.textDecoration = 'underline';
      for (const b of [bold, ital, und]) b.disabled = true;
      const bFind = P.el('button', 'tr-b', D.labels.findButton);
      const mode = P.el('button', 'tr-b tr-mode', '');
      mode.title = D.labels.mode;
      const menu = P.el('div', 'tr-menu');
      const MI = D.modes;
      const mItems = {};
      for (const [k, name, desc] of MI) {
        const b = P.modeItem(ctx, k, name, desc);
        mItems[k] = b;
        menu.append(b);
      }
      const order = look.bool(0.5);
      bar.append(bUndo, bRedo, P.el('span', 'tr-sep'), style, P.el('span', 'tr-sep'), bold, ital, und, P.el('span', 'tr-sep'));
      if (order) bar.append(bFind, P.el('span', 'tr-grow'), mode, menu);
      else bar.append(P.el('span', 'tr-grow'), bFind, P.el('span', 'tr-sep'), mode, menu);
      for (const b of [bUndo, bRedo, style, bold, ital, und, bFind, mode]) b.type = 'button';
      return { bar, bUndo, bRedo, bFind, mode, menu, MI, mItems };
    };

    BASE.modeItem = function (ctx, key, name, desc) {
      const b = P.el('button', 'tr-mi');
      b.type = 'button';
      b.append(P.el('b', '', name), P.el('span', '', desc));
      return b;
    };

    BASE.findStrip = function (ctx) {
      const strip = P.el('div', 'tr-strip');
      const ruler = P.el('div', 'tr-ruler');
      const find = P.el('div', 'tr-find');
      const q = P.el('input');
      q.placeholder = D.labels.find;
      q.spellcheck = false;
      const count = P.el('span', 'tr-count', '');
      const bPrev = P.el('button', 'tr-fb', '‹');
      bPrev.title = D.labels.previous;
      const bNext = P.el('button', 'tr-fb', '›');
      bNext.title = D.labels.next;
      const exp = P.el('button', 'tr-fb tr-exp', D.labels.expand);
      const rpWrap = P.el('span', 'rp');
      const rp = P.el('input');
      rp.placeholder = D.labels.replaceWith;
      rp.spellcheck = false;
      const bCase = P.el('button', 'tr-chk', D.labels.matchCase);
      const bWord = P.el('button', 'tr-chk', D.labels.wholeWord);
      const bOne = P.el('button', 'tr-fb', D.labels.replace);
      const bAll = P.el('button', 'tr-fb', D.labels.replaceAll);
      rpWrap.append(P.el('span', '', D.labels.with), rp, bOne, bAll);
      const bClose = P.el('button', 'tr-fb', '✕');
      bClose.title = D.labels.close;
      find.append(P.el('span', '', D.labels.find), q, count, bPrev, bNext, bCase, bWord, exp, rpWrap, bClose);
      for (const b of [bPrev, bNext, exp, bCase, bWord, bOne, bAll, bClose]) b.type = 'button';
      strip.append(ruler, find);
      return { strip, ruler, find, q, count, bPrev, bNext, exp, rp, bCase, bWord, bOne, bAll, bClose };
    };

    BASE.body = function (ctx) {
      const bodyEl = P.el('div', 'tr-body');
      const page = P.el('div', 'tr-page');
      const textEl = P.el('div', 'tr-text');
      const over = P.el('div', 'tr-over');
      page.append(textEl, over);
      const margin = P.el('div', 'tr-margin');
      bodyEl.append(page, margin);
      return { bodyEl, page, textEl, over, margin };
    };

    BASE.metrics = function (ctx, box, squeeze, look, controls) {
      const { card, page, textEl, margin, bodyEl } = controls;
      const marginW = D.marginWidth;
      const pageW = Math.round(Math.max(D.minPageWidth, Math.min(D.maxPageWidth, box.w - 12 - marginW - 14 * 3)));
      const fs = D.fontSizes[squeeze] || D.fontSizes[D.fontSizes.length - 1];
      const fontFamily = look.pick(D.fontFamilies);
      textEl.style.cssText = `font: ${fs}px/${D.lineHeight} ${fontFamily};`;
      page.style.width = `${pageW}px`;
      margin.style.width = `${marginW}px`;
      card.style.width = `${pageW + marginW + 14 * 3 + 2}px`;
      const bodyH = Math.max(D.minBodyHeight, box.h - 12 - (38 + 38 + 40 + 24 + 2 + 8));
      bodyEl.style.height = `${bodyH}px`;
      page.style.height = `${bodyH - 8}px`;

      return { fs, bodyH };
    };

    BASE.authorColor = function (ctx, author) {
      const authors = [...(ctx.spec.authors || []), D.selfAuthor];
      return D.authorColors[Math.max(0, authors.indexOf(author)) % D.authorColors.length];
    };

    BASE.run = function (ctx, r, o, colorOf) {
      const sp = P.el('span', r.k === 'b' ? '' : r.k, r.t);
      sp.dataset.o = String(o);
      if (r.k !== 'b') sp.style.color = colorOf(r.a);
      return sp;
    };

    BASE.paragraph = function (ctx, para, o, colorOf) {
      const spans = [];
      const p = P.el('p');
      p.dataset.o = String(o);
      for (const r of para) {
        const sp = P.run(ctx, r, o, colorOf);
        spans.push({ node: sp.firstChild, o, n: r.t.length });
        o += r.t.length;
        p.append(sp);
      }
      if (!para.length || !para.some((r) => r.t.length)) {
        const sp = P.el('span', '', '​');
        sp.dataset.o = String(o);
        p.append(sp);
      }
      p.dataset.e = String(o);
      return { p, spans, end: o };
    };

    BASE.suggestionCard = function (ctx, s, colorOf) {
      const F = fam();
      const { spec } = ctx;
      const cd = P.el('div', 'tr-card');
      const hd = P.el('div', 'hd');
      const av = P.el('span', 'av', (s.author || '?')[0].toUpperCase());
      av.style.background = colorOf(s.author);
      const ac = P.el('div', 'ac');
      const ok = P.el('button', 'ok', '\u2713');
      ok.type = 'button';
      ok.title = D.labels.accept;
      const no = P.el('button', 'no', '\u2715');
      no.type = 'button';
      no.title = D.labels.reject;
      P.onBtn(ok, () => P.commit(F.review(st.ctx.model, spec, s.id, 'accept')));
      P.onBtn(no, () => P.commit(F.review(st.ctx.model, spec, s.id, 'reject')));
      ac.append(ok, no);
      hd.append(av, P.el('span', 'nm', s.author), ac);
      const ins = s.ins.trim();
      const del = s.del.trim();
      const ds = ins && del ? `Replace: "${del}" with "${ins}"` : ins ? `Add: "${ins}"` : `Delete: "${del}"`;
      cd.append(hd, P.el('div', 'ds', ds));
      const controls = { accept: ok, reject: no };
      P.suggestion(ctx, cd, s);
      return { card: cd, controls };
    };

    BASE.suggestion = (ctx, card, suggestion) => {};

    BASE.suggestions = function (ctx, ss, margin, bodyH, caretRect, colorOf) {
      const cards = {};
      const els = ss.map((s) => {
        const built = P.suggestionCard(ctx, s, colorOf);
        cards[s.id] = built.controls;
        return built.card;
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
      return cards;
    };

    BASE.footer = function (ctx, foot, m, suggestions) {
      const F = fam();
      foot.replaceChildren(P.el('span', '', `Words: ${F.wordCount(m.doc)}`), P.el('span', '', `Suggestions: ${suggestions.length}`),
          P.el('span', '', `Mode: ${F.MODE_LABEL[m.mode]}`));
    };

    BASE.shown = (ctx, controls, m) => {};

    BASE.build = function (ctx, box, squeeze) {
      const { spec } = ctx;
      const F = fam();
      const look = ctx.rng.fork('look');
      const card = P.frame(ctx);
      const colorOf = (a) => P.authorColor(ctx, a);
      // head
      const { head, saved } = P.heading(ctx);
      // toolbar
      const { bar, bUndo, bRedo, bFind, mode, menu, MI, mItems } = P.toolbar(ctx, look);
      // find strip
      const { strip, ruler, find, q, count, bPrev, bNext, exp, rp, bCase, bWord, bOne, bAll, bClose } = P.findStrip(ctx);
      // body
      const { bodyEl, page, textEl, over, margin } = P.body(ctx);
      const foot = P.el('div', 'tr-foot');
      card.append(head, bar, strip, bodyEl, foot);
      ctx.stage.append(card);

      const controls = { card, head, saved, bar, bUndo, bRedo, bFind, mode, menu, MI, mItems, strip, ruler, find, q, count, bPrev, bNext, exp, rp, bCase, bWord, bOne, bAll, bClose, bodyEl, page, textEl, over, margin, foot };
      st.els = controls;
      st.metrics = P.metrics(ctx, box, squeeze, look, controls);
      const { fs, bodyH } = st.metrics;
      const inputs = { query: q, repl: rp };
      shared.wireFind(S, controls, bFind);
      P.onBtn(bUndo, () => P.commit(F.undo(st.ctx.model, spec)));
      P.onBtn(bRedo, () => P.commit(F.redo(st.ctx.model, spec)));
      P.onBtn(mode, () => P.commit(F.toggleMenu(st.ctx.model)));
      for (const [k] of MI) P.onBtn(mItems[k], () => P.commit(F.setMode(st.ctx.model, spec, k)));

      // flat offset <-> DOM
      let spans = [];
      const { offsetAt, rectsOf, caretRect } = textGeometry(textEl, () => spans);

      page.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        if (isInput(document.activeElement)) document.activeElement.blur();
        const o = offsetAt(e.clientX, e.clientY);
        if (o === null) return;
        const count = ctx.util.clickCount(e);
        const n = F.pointerDown(st.ctx.model, spec, o, { shift: e.shiftKey, count });
        st.drag = count === 1 ? { a: n.cur[0].a } : null;
        P.commit(n);
      });

      let cards = {};
      function draw(m) {
        // text
        spans = [];
        let o = 0;
        textEl.replaceChildren(...m.doc.map((para, pi) => {
          if (pi) o += 1;
          const built = P.paragraph(ctx, para, o, colorOf);
          spans.push(...built.spans);
          o = built.end;
          return built.p;
        }));
        // overlay: find hits, selection, caret
        const pr = page.getBoundingClientRect();
        const parts = [];
        const box2 = (r, cls) => {
          const d = P.el('div', cls);
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
            const d = P.el('div', 'tr-caret');
            d.style.cssText = `left:${r.left - pr.left - 1}px; top:${r.top - pr.top}px; height:${r.height || fs * 1.3}px;`;
            parts.push(d);
          }
        }
        over.replaceChildren(...parts);
        // suggestion cards, next to their text, stacked without overlap (squeezed to the top when too tall)
        const ss = F.suggestions(m.doc);
        cards = P.suggestions(ctx, ss, margin, bodyH, caretRect, colorOf);
        // toolbar, menu, find
        mode.textContent = `✎ ${F.MODE_LABEL[m.mode]} ▾`;
        menu.classList.toggle('open', !!m.menu);
        for (const [k] of MI) mItems[k].classList.toggle('on', m.mode === k);
        bUndo.disabled = !(m.hist && m.hist.length);
        bRedo.disabled = !(m.fut && m.fut.length);
        saved.textContent = m.hist && m.hist.length ? D.labels.saving : D.labels.saved;
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
          count.textContent = P.findCount(m, spec);
        }
        P.syncFocus(m, inputs);
        P.footer(ctx, foot, m, ss);
        P.shown(ctx, controls, m);
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

    ({ D, P } = env.templateDesign('use-text-editor/rich', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return { traits: { doc: 'prose' }, render: (ctx) => P.render(ctx), locate: (target) => P.locate(target) };
  }, { uses: ['use-text-editor/_shared', 'use-text-editor/_styles'] });
})();
