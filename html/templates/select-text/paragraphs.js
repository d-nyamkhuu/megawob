/*
 * templates / highlight / paragraphs: native DOM text selection on an article card.
 * Lineage L1 (36 sites); based on medoid design-select-text-sentence-01. The filtered-out
 * code-editor registration is dead in every member and is deliberately omitted.
 * Scenarios: paragraph, sentence, phrase (also retains the medoid's live word/field paths).
 * Empty designs reproduce design-select-text-sentence-01, -paragraph-01 and -phrase-11.
 *
 * Tokens (defaults; presets below):
 *   fontMax 28, fontDivisor 55: min(cap, round(ctx.size.width / divisor)).
 *   paragraphCount true: set --hl-paragraph-count on the card.
 *   sections false: section wrappers, headings, paragraph dataset and hl-full class.
 *   headings ['A Quiet Morning', 'Plans for the Day', 'Looking Ahead']; headingFallback
 *     'Further Notes': section heading text (null headings omits headings).
 *   roomMode 'stage': stage clientHeight - 2; 'paragraph': max(size.height - 32,
 *     stage.clientHeight - 8); 'padded': min(size.height, clientHeight) minus stage padding;
 *     'bounded': max(0, min(size.height, clientHeight) - 2).
 *   lineHeight null: use the sampled line height (always keep its rng draw).
 *   minFont 10: full-document fitting floor (pane floor remains 13).
 *   sentenceRows null: plain paragraphs; 'flow' or 'numbered' splits sentence spans.
 *   clearSelection false: install env.widgetDef.clear after binding selection.
 *   readKeyup false, readPointerup false: immediately mirror native selection after input.
 *   dragEndpoints null: native drag; 'checked', 'pointer', 'button' commit actual carets
 *     with the three members' original validation, pointercancel scope and listener order.
 *   tripleClick null: native click; 'exact' selects containing paragraph, 'nearest' falls back.
 *
 * Presets: sentence {} (all 12 count paragraphs); paragraph {fontMax:34, fontDivisor:42,
 * paragraphCount:false, roomMode:'paragraph'} (6/12 share room); phrase {fontDivisor:40,
 * paragraphCount:false, sections:true, roomMode:'padded'} (12/12 sections, 9/12 room).
 * See README.md here for the complete variation census and one-off migration map.
 *
 * Parts (called through P; replacements receive (base, S) => function):
 *   width(ctx) -> px: size.width - 44; font(ctx, width) -> px: token formula.
 *   begin(ctx): before card creation, noop; card(ctx, el): paragraph-count property.
 *   heading(ctx, el): seeded article/message header; meta(ctx) -> text: paragraph count.
 *   textCreated(ctx): immediately after text creation, before data-role, noop.
 *   text(ctx): after data-role, section dataset/class; paragraphsBefore(ctx): noop.
 *   paragraph(ctx, index) -> p: optional section/heading then paragraph.
 *   paragraphContent(ctx, p, text, offset, marks, segments) -> sentence count or null.
 *   sentenceRuns(text) -> {text,start}[]: the selected sentence tokenizer.
 *   segment(ctx, el, text, offset, marks, segments, force=false): inline marks/text nodes.
 *   fillParagraph(util, el, text, offset, marks): append text/link/bold runs.
 *   paragraphsAfter(ctx, counts): before footer, noop (previews, sentence-count tips).
 *   footer(ctx): keep the medoid's conditional footer and rng draws.
 *   fit(ctx): apply current font and sampled/token line height.
 *   room(ctx) -> px: roomMode formula; beforeFit(ctx, room): noop.
 *   preparePane(ctx): before zeroing pane height, noop; paneChrome(ctx) -> px: card - pane.
 *   paneView(ctx, avail, full) -> px: seeded 40-62% view, bounded by available height.
 *   fitPane(ctx, room): fit scrolling text, then size pane (one float draw).
 *   prepareFull(ctx, room): section text height; overflows(ctx, room) -> bool: card/sections.
 *   reduceFont(font) -> px: font - 1; fitFull(ctx, room): prepare then shrink to minFont.
 *   afterFit(ctx, room): noop (compact fallbacks/previews).
 *   bindSelection(ctx, textEl, segments, onShow?) -> primitive: native selection binding.
 *   selectionBound(ctx, textEl, selection, update): noop (one-off caret verification).
 *   dragSelection(ctx, textEl, selection, update, drag, caretAt): endpoint listeners.
 *   paragraphAt(spec, offset) -> range|null: exact/nearest paragraph for triple-click.
 *   bound(ctx): install optional clear; show(model): noop (selection counters).
 *   clear(): set empty selection, show it, update model.
 *   scrollPane(ctx, pane, content, bar, thumb) -> {st,init,to,locate}: custom scrollbar.
 *   rendered(ctx): after scrollbar init, noop; sync(model): set selection, show it.
 * S exposes live ctx, spec, card, head, pane, bar, thumb, textEl, sel, scroller, D, P,
 * and settable font/lh. Build DOM only in render. Preserve every rng draw in order.
 */
(function () {
  'use strict';

  const CSS = `
  .hl-card {
    position: relative; display: flex; flex-direction: column;
    background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 8px 24px rgba(0,0,0,.05);
  }
  .hl-head {
    display: flex; align-items: baseline; gap: 12px; padding: 16px 30px 12px;
    border-bottom: 1px solid var(--line);
  }
  .hl-kicker { white-space: nowrap; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); }
  .hl-title { font-size: 17px; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hl-meta { margin-left: auto; font-size: 12px; color: var(--muted); white-space: nowrap; }
  .hl-text {
    padding: 18px 30px 22px;
    user-select: text; -webkit-user-select: text; -webkit-user-drag: none;
    cursor: text; counter-reset: hl-par;
  }
  .hl-text p { margin: 0; counter-increment: hl-par; position: relative; }
  .hl-text p + p { margin-top: var(--hl-gap); }
  .hl-text.serif { font-family: Georgia, "Liberation Serif", "DejaVu Serif", serif; }
  .hl-text.indent p + p { text-indent: 1.6em; }
  .hl-text.numbered p::before {
    content: counter(hl-par); position: absolute; left: -26px; top: 0; width: 16px; text-align: right;
    font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; line-height: var(--hl-lh); color: var(--muted);
  }
  .hl-text.pilcrow p::before {
    content: "\\00B6" counter(hl-par); position: absolute; left: -30px; top: 0;
    font-family: system-ui, sans-serif; font-size: 11px; line-height: var(--hl-lh); color: var(--muted); opacity: .8;
  }
  .hl-text ::selection { background: var(--hl-sel); color: inherit; }
  .hl-foot { padding: 0 30px 14px; font-size: 12px; color: var(--muted); }
  .hl-link { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; -webkit-user-drag: none; }
  .hl-text strong { font-weight: 700; }
  .hl-panerow { display: flex; gap: 6px; padding-right: 8px; border-bottom: 1px solid var(--line); }
  .hl-pane { flex: 1; overflow: hidden; position: relative; }
  .hl-bar { flex: none; position: relative; width: 12px; margin: 8px 0; border-radius: 6px; background: color-mix(in srgb, var(--line) 70%, transparent); }
  .hl-thumb { position: absolute; left: 1px; width: 10px; border-radius: 5px; background: color-mix(in srgb, var(--muted) 65%, var(--panel)); cursor: grab; }
  .hl-thumb:hover, .hl-thumb.on { background: var(--accent); }
  `;

  const KICKERS = ['Reading passage', 'Field notes', 'Archive entry', 'Travel journal', 'Excerpt', 'Story draft'];
  const TITLES = ['Places along the coast', 'A walk through town', 'Notes from the valley',
    'Things we saw that year', 'Letters from the north', 'An ordinary week'];

  function ensureStyle() {
    if (document.getElementById('hl-style')) return;
    const s = document.createElement('style');
    s.id = 'hl-style';
    s.textContent = CSS;
    document.head.append(s);
  }


  const TOKENS = {
    fontMax: 28, fontDivisor: 55, paragraphCount: true, sections: false,
    headings: ['A Quiet Morning', 'Plans for the Day', 'Looking Ahead'], headingFallback: 'Further Notes',
    roomMode: 'stage', lineHeight: null, minFont: 10, sentenceRows: null,
    clearSelection: false, readKeyup: false, readPointerup: false, dragEndpoints: null, tripleClick: null,
  };
  const SCENARIOS = {
    sentence: {},
    paragraph: { fontMax: 34, fontDivisor: 42, paragraphCount: false, roomMode: 'paragraph' },
    phrase: { fontDivisor: 40, paragraphCount: false, sections: true, roomMode: 'padded' },
  };

  env.template('select-text/paragraphs', (design, def) => {
    let D, P;
    let ctxRef, card, head, pane, bar, thumb, textEl, font, lh;
    let sel = null, scroller = null;
    const BASE = {};
    const S = {
      get ctx() { return ctxRef; }, get spec() { return ctxRef.spec; },
      get card() { return card; }, get head() { return head; }, get pane() { return pane; },
      get bar() { return bar; }, get thumb() { return thumb; }, get textEl() { return textEl; },
      get sel() { return sel; }, get scroller() { return scroller; },
      get font() { return font; }, set font(v) { font = v; },
      get lh() { return lh; }, set lh(v) { lh = v; }, get D() { return D; }, get P() { return P; },
    };

    BASE.width = (ctx) => ctx.size.width - 44;
    BASE.font = (ctx) => Math.min(D.fontMax, Math.round(ctx.size.width / D.fontDivisor));
    BASE.begin = () => {};
    BASE.card = (ctx, el) => {
      if (D.paragraphCount) el.style.setProperty('--hl-paragraph-count', ctx.spec.paragraphs.length);
    };
    BASE.meta = (ctx) => `${ctx.spec.paragraphs.length} paragraphs`;
    BASE.heading = (ctx, head) => {
      const { rng, util, spec } = ctx;
      if (spec.source === 'message') {
        util.el('span', 'hl-kicker', head, rng.pick(['Inbox', 'Message', 'Support', 'Mail']));
        const subj = ctx.content.EMAIL_SUBJECTS ? ctx.content.pick(rng, ctx.content.EMAIL_SUBJECTS, { csplit: spec.csplit }) : 'Your request';
        util.el('span', 'hl-title', head, subj);
        util.el('span', 'hl-meta', head, rng.pick(['Today', 'Yesterday', '2 days ago', 'Mon', 'Fri']));
      } else {
        util.el('span', 'hl-kicker', head, rng.pick(KICKERS));
        const title = spec.source === 'real' && ctx.content.HEADLINES ? ctx.content.pick(rng, ctx.content.HEADLINES, { csplit: spec.csplit }) : rng.pick(TITLES);
        util.el('span', 'hl-title', head, title);
        util.el('span', 'hl-meta', head, P.meta(ctx));
      }
    };
    BASE.textCreated = () => {};
    BASE.text = (ctx) => {
      if (D.sections) {
        textEl.dataset.paragraphs = String(ctx.spec.paragraphs.length);
        if (!pane) textEl.classList.add('hl-full');
      }
    };
    BASE.paragraphsBefore = () => {};
    BASE.paragraph = (ctx, index) => {
      let host = textEl;
      if (D.sections) {
        host = ctx.util.el('section', 'hl-section', textEl);
        if (D.headings) {
          const heading = ctx.util.el('h2', 'section-heading', host, D.headings[index] || D.headingFallback);
          heading.dataset.skip = '';
        }
      }
      return ctx.util.el('p', '', host);
    };
    BASE.sentenceRuns = (text) => {
      if (D.sentenceRows === 'numbered') {
        return [...text.matchAll(/[\s\S]+?(?:[.!?]+["”']?(?=\s|$)|$)/g)].map((m) => ({ text: m[0], start: m.index }));
      }
      let start = 0;
      return (text.match(/.*?[.!?](?:\s+|$)|.+$/g) || [text]).map((text) => {
        const run = { text, start };
        start += text.length;
        return run;
      });
    };
    BASE.segment = (ctx, el, text, start, marks, segments, force = false) => {
      if (marks.length || force) {
        P.fillParagraph(ctx.util, el, text, start, marks);
        segments.push({ node: el, start });
      } else {
        const node = document.createTextNode(text);
        el.append(node);
        segments.push({ node, start });
      }
    };
    BASE.paragraphContent = (ctx, p, text, base, marks, segments) => {
      if (!D.sentenceRows) {
        const mine = marks.filter((m) => m.start >= base && m.end <= base + text.length);
        P.segment(ctx, p, text, base, mine, segments);
        return null;
      }
      const runs = P.sentenceRuns(text);
      for (const run of runs) {
        const row = ctx.util.el('span', 'hl-sentence', p);
        const start = base + run.start, end = start + run.text.length;
        const mine = marks.filter((m) => m.end > start && m.start < end)
          .map((m) => ({ ...m, start: Math.max(start, m.start), end: Math.min(end, m.end) }));
        P.segment(ctx, row, run.text, start, mine, segments, D.sentenceRows === 'numbered');
      }
      return runs.length;
    };
    BASE.paragraphsAfter = () => {};
    BASE.footer = (ctx) => {
      const { rng, util } = ctx;
      if (rng.bool(0.5)) util.el('div', 'hl-foot', card, rng.pick(['Drag across the text to select it.', 'Select text with the mouse.',
        'Tip: double-click selects a word.', 'Selections are highlighted.']));
    };
    BASE.fit = () => {
      const height = D.lineHeight === null ? lh : D.lineHeight;
      textEl.style.setProperty('font-size', font + 'px', 'important');
      textEl.style.lineHeight = String(height);
      textEl.style.setProperty('--hl-lh', font * height + 'px');
    };
    BASE.room = (ctx) => {
      if (D.roomMode === 'paragraph') return Math.max(ctx.size.height - 32, ctx.stage.clientHeight - 8);
      if (D.roomMode === 'bounded') return Math.max(0, Math.min(ctx.size.height, ctx.stage.clientHeight) - 2);
      if (D.roomMode === 'padded') {
        const style = getComputedStyle(ctx.stage);
        return Math.min(ctx.size.height, ctx.stage.clientHeight) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      }
      return ctx.stage.clientHeight - 2;
    };
    BASE.beforeFit = () => {};
    BASE.preparePane = () => {};
    BASE.paneChrome = () => card.getBoundingClientRect().height - pane.getBoundingClientRect().height;
    BASE.paneView = (ctx, avail, full) => Math.floor(Math.min(avail, Math.max(160, full * ctx.rng.float(0.4, 0.62))));
    BASE.fitPane = (ctx, room) => {
      P.preparePane(ctx);
      pane.style.height = '0px';
      const full = () => textEl.getBoundingClientRect().height;
      while (font > 13 && P.paneChrome(ctx) + 0.45 * full() > room) { font--; P.fit(ctx); }
      const avail = room - P.paneChrome(ctx);
      pane.style.height = P.paneView(ctx, avail, full()) + 'px';
    };
    BASE.prepareFull = (ctx, room) => {
      if (D.sections) textEl.style.height = room + 'px';
    };
    BASE.overflows = (ctx, room) => {
      if (!D.sections) return card.getBoundingClientRect().height > room;
      return textEl.scrollHeight > textEl.clientHeight + 1 || [...textEl.children].some((section) => {
        const box = section.getBoundingClientRect();
        const last = section.lastElementChild.getBoundingClientRect();
        return last.bottom - box.top + parseFloat(getComputedStyle(section).paddingBottom) > box.height + 1;
      });
    };
    BASE.reduceFont = (value) => value - 1;
    BASE.fitFull = (ctx, room) => {
      P.prepareFull(ctx, room);
      while (P.overflows(ctx, room) && font > D.minFont) { font = P.reduceFont(font); P.fit(ctx); }
    };
    BASE.afterFit = () => {};
    BASE.selectionBound = () => {};
    BASE.paragraphAt = (spec, offset) => {
      let base = 0, best = null;
      for (const text of spec.paragraphs) {
        const range = { start: base, end: base + text.length };
        if (offset >= range.start && offset <= range.end + 1) return range;
        if (!best || Math.abs(offset - range.start) < Math.abs(offset - best.start)) best = range;
        base += text.length + 2;
      }
      return D.tripleClick === 'nearest' ? best : null;
    };
    BASE.dragSelection = (ctx, textEl, ts, update, drag, caretAt) => {
      if (!D.dragEndpoints) return;
      if (D.dragEndpoints !== 'button') textEl.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.shiftKey) {
          if (D.dragEndpoints === 'checked') drag.value = null;
          return;
        }
        const offset = caretAt(e);
        drag.value = offset === null ? null : { offset, x: e.clientX, y: e.clientY, id: e.pointerId };
      });
      document.addEventListener('pointerup', (e) => {
        const from = drag.value;
        drag.value = null;
        if (!from || !textEl.isConnected ||
            (D.dragEndpoints === 'button' ? e.button !== 0 : e.pointerId !== from.id) ||
            Math.hypot(e.clientX - from.x, e.clientY - from.y) < 3) return;
        const end = caretAt(e);
        if (end === null) return;
        const range = { start: Math.min(from.offset, end), end: Math.max(from.offset, end) };
        ts.set(range);
        update(range);
      });
      if (D.dragEndpoints !== 'button') {
        const host = D.dragEndpoints === 'checked' ? document : textEl;
        host.addEventListener('pointercancel', () => { drag.value = null; });
      }
    };
    BASE.bindSelection = (ctx, textEl, segments, onShow) => {
      let ts;
      const drag = { value: null };
      const caretAt = (e) => {
        const r = D.dragEndpoints === 'button' ? document.caretRangeFromPoint(e.clientX, e.clientY)
          : document.caretRangeFromPoint?.(e.clientX, e.clientY);
        if (!r || !textEl.contains(r.startContainer)) return null;
        const offset = ts.offsetAt(r.startContainer, r.startOffset);
        return D.dragEndpoints !== 'checked' || Number.isInteger(offset) && offset >= 0 && offset <= ctx.spec.doc.length ? offset : null;
      };
      const update = (m) => {
        if (onShow) onShow(m);
        ctx.update({ ...ctx.model, start: m.start, end: m.end });
      };
      textEl.addEventListener('pointerdown', (e) => {
        if (D.dragEndpoints === 'button') drag.value = null;
        if (e.button === 0 && !e.shiftKey) {
          window.getSelection().removeAllRanges();
          if (D.dragEndpoints === 'button') {
            const offset = caretAt(e);
            if (offset !== null) drag.value = { offset, x: e.clientX, y: e.clientY };
          }
        }
      });
      ts = env.ui.textSelection(textEl, {
        segments, skip: '[data-skip]', length: ctx.spec.doc.length, value: ctx.model,
        fresh: false, onInput: update, onChange: update,
      });
      P.selectionBound(ctx, textEl, ts, update);
      P.dragSelection(ctx, textEl, ts, update, drag, caretAt);
      const read = () => {
        if (!textEl.isConnected) return;
        const m = ts.read();
        if (m && (m.start !== ctx.model.start || m.end !== ctx.model.end)) update(m);
      };
      if (D.readPointerup) textEl.addEventListener('pointerup', read);
      if (D.readKeyup) document.addEventListener('keyup', read);
      if (D.tripleClick) textEl.addEventListener('click', (e) => {
        if (e.button !== 0 || e.shiftKey || ctx.util.clickCount(e) < 3 || !document.caretRangeFromPoint) return;
        const r = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (!r) return;
        const range = P.paragraphAt(ctx.spec, ts.offsetAt(r.startContainer, r.startOffset));
        if (range) { ts.set(range); update(range); }
      });
      return ts;
    };
    BASE.show = () => {};
    BASE.clear = () => {
      const m = { ...ctxRef.model, start: 0, end: 0 };
      sel.set(m);
      P.show(m);
      ctxRef.update(m);
    };
    BASE.bound = () => {
      if (D.clearSelection) env.widgetDef.clear = () => P.clear();
    };
    BASE.rendered = () => {};
    BASE.sync = (m) => { sel.set(m); P.show(m); };
    BASE.fillParagraph = function (util, p, text, base, marks) {
      let at = 0;
      for (const m of marks) {
        const a = m.start - base;
        const b = m.end - base;
        if (a < 0 || b > text.length || a < at) continue;
        if (a > at) p.append(document.createTextNode(text.slice(at, a)));
        const el = util.el(m.kind === 'link' ? 'a' : 'strong', m.kind === 'link' ? 'hl-link' : '', p, text.slice(a, b));
        if (m.kind === 'link') {
          el.href = '#';
          el.draggable = false;
          el.addEventListener('click', (e) => e.preventDefault());
        }
        at = b;
      }
      if (at < text.length || !text.length) p.append(document.createTextNode(text.slice(at)));
    };
    BASE.scrollPane = function (ctx, pane, content, bar, thumb) {
      const st = { max: 0, trackH: 0, thumbH: 0 };
      let y0 = 0;
      let y1 = 0;
      const measure = () => {
        st.max = Math.max(0, content.scrollHeight - pane.clientHeight);
        st.trackH = bar.clientHeight;
        st.thumbH = Math.max(28, Math.round((pane.clientHeight / Math.max(1, content.scrollHeight)) * st.trackH));
        thumb.style.height = st.thumbH + 'px';
        bar.style.visibility = st.max > 0 ? 'visible' : 'hidden';
        const { start, end } = ctx.spec.target;
        const r = document.createRange();
        const sel = st.sel;
        const [an, ao] = sel.pointAt(start);
        const [bn, bo] = sel.pointAt(end);
        r.setStart(an, ao);
        r.setEnd(bn, bo);
        const rects = [...r.getClientRects()].filter((q) => q.width > 0);
        const top = pane.getBoundingClientRect().top - pane.scrollTop;
        y0 = Math.round(Math.min(...rects.map((q) => q.top)) - top);
        y1 = Math.round(Math.max(...rects.map((q) => q.bottom)) - top);
      };
      const thumbTop = (s) => (st.max > 0 ? (s / st.max) * (st.trackH - st.thumbH) : 0);
      const mirror = () => {
        thumb.style.top = thumbTop(pane.scrollTop) + 'px';
        const p = { scroll: Math.round(pane.scrollTop), view: pane.clientHeight, max: st.max, y0, y1 };
        const old = ctx.model.pane;
        if (old && old.scroll === p.scroll && old.view === p.view && old.y0 === p.y0) return;
        ctx.update({ ...ctx.model, pane: p });
      };
      const to = (s) => {
        pane.scrollTop = Math.max(0, Math.min(st.max, s));
        mirror();
      };
      pane.addEventListener('wheel', (e) => {
        const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? pane.clientHeight : 1;
        e.preventDefault();
        to(pane.scrollTop + e.deltaY * unit);
      }, { passive: false });
      // Selecting past the edge scrolls the pane natively; keep the mirror in sync.
      pane.addEventListener('scroll', () => mirror());
      let s0 = 0;
      env.ui.track(thumb, {
        start() { s0 = pane.scrollTop; thumb.classList.add('on'); },
        move(p) {
          const span = st.trackH - st.thumbH;
          to(s0 + (span > 0 ? (p.dy / span) * st.max : 0));
        },
        end() { thumb.classList.remove('on'); mirror(); },
      }, 'scrollbar');
      bar.addEventListener('pointerdown', (e) => {
        if (e.target !== bar || e.button !== 0) return;
        const r = thumb.getBoundingClientRect();
        to(pane.scrollTop + (e.clientY < r.top ? -1 : 1) * pane.clientHeight * 0.8);
      });
      return {
        st,
        init(sel, atEnd) { st.sel = sel; measure(); if (atEnd) pane.scrollTop = st.max; mirror(); },
        to,
        locate(t) {
          if (t.pane !== undefined) {
            const r = pane.getBoundingClientRect();
            return [r.left + r.width / 2, r.top + r.height / 2];
          }
          const tr = thumb.getBoundingClientRect();
          if (t.thumb !== undefined) return [tr.left + tr.width / 2, tr.top + tr.height / 2];
          const br = bar.getBoundingClientRect();
          return [tr.left + tr.width / 2, br.top + thumbTop(Math.max(0, Math.min(st.max, t.thumbAt))) + st.thumbH / 2];
        },
      };
    };

    ({ D, P } = env.templateDesign('select-text/paragraphs', design, def, {
      tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S,
    }));
    return {
      traits: { pane: true, marks: true, triple: true },
      render(ctx) {
        ctxRef = ctx;
        ensureStyle();
        const { rng, util, spec } = ctx;
        const width = P.width(ctx);
        font = P.font(ctx, width);
        lh = rng.pick([1.5, 1.6, 1.7]);
        const gap = rng.int(10, 18);
        const selAlpha = rng.int(28, 42);
        P.begin(ctx);
        card = util.el('div', 'hl-card', ctx.stage);
        P.card(ctx, card);
        card.style.width = width + 'px';
        card.style.margin = `${rng.int(4, 12)}px ${rng.int(8, 30)}px`;
        card.style.setProperty('--hl-sel', `color-mix(in srgb, var(--accent) ${selAlpha}%, transparent)`);
        head = util.el('div', 'hl-head', card);
        P.heading(ctx, head);
        pane = bar = thumb = null;
        let host = card;
        if (spec.pane) {
          const row = util.el('div', 'hl-panerow', card);
          pane = util.el('div', 'hl-pane', row);
          bar = util.el('div', 'hl-bar', row);
          thumb = util.el('div', 'hl-thumb', bar);
          thumb.dataset.role = 'scrollbar';
          host = pane;
        }
        textEl = util.el('div', 'hl-text', host);
        P.textCreated(ctx);
        textEl.dataset.role = 'text';
        P.text(ctx);
        textEl.style.setProperty('--hl-gap', gap + 'px');
        const segments = [], counts = [];
        let offset = 0;
        const marks = spec.marks || [];
        P.paragraphsBefore(ctx);
        spec.paragraphs.forEach((text, i) => {
          const p = P.paragraph(ctx, i);
          const count = P.paragraphContent(ctx, p, text, offset, marks, segments);
          if (count !== null) counts.push(count);
          offset += text.length + 2;
        });
        P.paragraphsAfter(ctx, counts);
        P.footer(ctx);
        P.fit(ctx);
        const room = P.room(ctx);
        P.beforeFit(ctx, room);
        if (pane) P.fitPane(ctx, room);
        else P.fitFull(ctx, room);
        P.afterFit(ctx, room);
        sel = P.bindSelection(ctx, textEl, segments, (m) => P.show(m));
        P.bound(ctx);
        scroller = null;
        if (pane) {
          scroller = P.scrollPane(ctx, pane, textEl, bar, thumb);
          scroller.init(sel);
        }
        P.rendered(ctx);
        return { anchors: [card], sync: (m) => P.sync(m) };
      },
      locate: (t) => t.char !== undefined ? sel.locate(t) : scroller.locate(t),
    };
  });
})();
