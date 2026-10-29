// select-text/base: the base site's select-text widgets (paragraphs, code, terms, chat, table, pdf, textbox,
// scanpdf) as a template. Its _base-* helpers hold assets, code rendering and scanned-PDF rendering.
// The design-* sites that started from a copy of them, and the
// composite sites that embed them, are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/select-text.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/select-text.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/select-text.js`, HTML).href };
    /*
     * reference / highlight: real DOM text and the browser's native selection, bound to the model by
     * env.ui.textSelection (kit/ui/text.js): every paragraph's text node is a segment at its offset in
     * spec.doc (paragraphs joined with '\n\n'); the kit keeps the visible selection equal to the model,
     * ignores selections outside the text, keeps the selection when pressing elsewhere and starts a fresh
     * selection on every press inside the text. locate() delegates to locateChar().
     *
     *   paragraphs  an article card: sans or serif type, optional paragraph numbers / pilcrows / indents. Also the
     *               'tip' scenario: dotted-underlined words (marks of kind 'tip') show a dark tooltip under the word
     *               while the pointer is over them; entering the instructed word sets model.tipSeen
     *   code        a monospace text editor: tab bar, line-number gutter (one logical line per paragraph,
     *               blank lines between), soft-wrapped lines with wrap markers, light or dark theme, and a
     *               status bar that reports the live selection
     *   terms       a terms-of-service page (traits.unit 'clause'): numbered clause titles, optional contents column,
     *               banner and footer buttons, scrolling pane with its own scrollbar in pane episodes
     *   chat        a chat transcript (traits.unit 'message'): bubbles with sender and time, "You" on the right,
     *               pane episodes start scrolled to the newest message; composer bar under it
     *   table       text in table cells (traits.unit 'cell'): column headers, zebra rows, one cell per paragraph
     *   pdf         pages of a PDF viewer (traits.pane 'always'): grey pane with toolbar and its own scrollbar,
     *               page sheets with running header and page number, justified serif text, links / bold runs
     *   textbox     a native <textarea> (mail composer or ruled notepad) or one-line <input>, read-only, where the
     *               selection is the control's own selectionStart/End (traits.native); locate() measures glyphs in
     *               a mirror element with the control's box and font
     *   scanpdf     a scanned-PDF viewer drawn on one <canvas> (no DOM text layer): scan noise, a slight rotation, the
     *               widget's own text layout, hit testing and selection tool (drag, double / triple click, Shift+click,
     *               Shift+Arrows); see its section at the end of the file
     * All of terms / chat / table / pdf / paragraphs / code / scanpdf declare traits.triple (a triple click selects the
     * paragraph, cell or message).
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get KICKERS() { return KICKERS; },
        get TITLES() { return TITLES; },
        get ensureStyle() { return ensureStyle; },
        get CODE_CSS() { return CODE_CSS; },
        get THEMES() { return THEMES; },
        get FONTS() { return FONTS; },
        get FILES() { return FILES; },
        get ensureCodeStyle() { return ensureCodeStyle; },
        get CSS3() { return CSS3; },
        get ensureStyle3() { return ensureStyle3; },
        get pad() { return pad; },
        get locateDom() { return locateDom; },
        get TERMS_TITLES() { return TERMS_TITLES; },
        get SITE_NAMES() { return SITE_NAMES; },
        get CHAT_TITLES() { return CHAT_TITLES; },
        get TABLE_TITLES() { return TABLE_TITLES; },
        get SP_CSS() { return SP_CSS; },
        get SP_FONTS() { return SP_FONTS; },
        get SP_STAMPS() { return SP_STAMPS; },
        get sel() { return sel; }, set sel(v) { sel = v; },
        get scroller() { return scroller; }, set scroller(v) { scroller = v; },
        get field() { return field; }, set field(v) { field = v; },
        get fieldFocus() { return fieldFocus; }, set fieldFocus(v) { fieldFocus = v; },
        get spView() { return spView; }, set spView(v) { spView = v; },
        get bindSelection() { return bindSelection; },
        get paragraphAt() { return paragraphAt; },
        get fillParagraph() { return fillParagraph; },
        get scrollPane() { return scrollPane; },
        get framed() { return framed; },
        get paragraphSegment() { return paragraphSegment; },
        get fieldPoint() { return fieldPoint; },
        get renderScanpdf() { return renderScanpdf; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('bindSelection')) bindSelection = __parts['bindSelection'](bindSelection, __scope);
      if (__has('paragraphAt')) paragraphAt = __parts['paragraphAt'](paragraphAt, __scope);
      if (__has('fillParagraph')) fillParagraph = __parts['fillParagraph'](fillParagraph, __scope);
      if (__has('scrollPane')) scrollPane = __parts['scrollPane'](scrollPane, __scope);
      if (__has('framed')) framed = __parts['framed'](framed, __scope);
      if (__has('paragraphSegment')) paragraphSegment = __parts['paragraphSegment'](paragraphSegment, __scope);
      if (__has('fieldPoint')) fieldPoint = __parts['fieldPoint'](fieldPoint, __scope);
      if (__has('renderScanpdf')) renderScanpdf = __parts['renderScanpdf'](renderScanpdf, __scope);

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('select-text/_base-assets').CSS);

      const KICKERS = __has('KICKERS') ? __parts['KICKERS'](undefined, __scope) : (env.templateLib('select-text/_base-assets').KICKERS);
      const TITLES = __has('TITLES') ? __parts['TITLES'](undefined, __scope) : (env.templateLib('select-text/_base-assets').TITLES);

      let sel = __has('sel') ? __parts['sel'](undefined, __scope) : (null); // env.ui.textSelection of the live episode
      let scroller = __has('scroller') ? __parts['scroller'](undefined, __scope) : (null); // scroll pane helper (pane episodes)

      const ensureStyle = __has('ensureStyle') ? __parts['ensureStyle'](undefined, __scope) : { ensureStyle: () => env.util.css('hl-style', CSS) }.ensureStyle;

      // Mechanics shared by both widgets: the native selection inside textEl is the model.
      // A plain press starts a fresh selection; Shift+press extends the current one (fresh: false + this).
      function bindSelection(ctx, textEl, segments, onShow) {
        const update = (m) => {
          if (onShow) onShow(m);
          ctx.update({ ...ctx.model, start: m.start, end: m.end });
        };
        textEl.addEventListener('pointerdown', (e) => {
          if (e.button === 0 && !e.shiftKey) window.getSelection().removeAllRanges();
        });
        const ts = env.ui.textSelection(textEl, {
          segments,
          skip: '[data-skip]',
          length: ctx.spec.doc.length,
          value: ctx.model,
          fresh: false,
          onInput: update,
          onChange: update,
        });
        // Keyboard extension (Shift+Arrows): read the selection as soon as the key is released, so the model
        // never lags behind the page (selectionchange fires asynchronously).
        document.addEventListener('keyup', () => {
          if (!textEl.isConnected) return;
          const m = ts.read();
          if (m && (m.start !== ctx.model.start || m.end !== ctx.model.end)) update(m);
        });
        // Triple click: the browser selects the paragraph on a native triple click (detail 3); harnesses that send
        // three single clicks (BrowserGym) get the same result here, counted with util.clickCount.
        textEl.addEventListener('click', (e) => {
          if (e.button !== 0 || e.shiftKey || ctx.util.clickCount(e) < 3 || !document.caretRangeFromPoint) return;
          const r = document.caretRangeFromPoint(e.clientX, e.clientY);
          if (!r) return;
          const range = paragraphAt(ctx.spec, ts.offsetAt(r.startContainer, r.startOffset));
          ts.set(range);
          update(range);
        });
        return ts;
      }

      // The paragraph (as a { start, end } range of spec.doc) at or nearest to a document offset.
      function paragraphAt(spec, off) {
        let base = 0;
        let best = null;
        for (const t of spec.paragraphs) {
          const r = { start: base, end: base + t.length };
          if (off >= r.start && off <= r.end + 1) return r;
          if (!best || Math.abs(off - r.start) < Math.abs(off - best.start)) best = r;
          base += t.length + 2;
        }
        return best;
      }

      // Inline marks (links, bold runs) inside one paragraph: append text and mark elements to p.
      function fillParagraph(util, p, text, base, marks, hooks) {
        let at = 0;
        for (const m of marks) {
          const a = m.start - base;
          const b = m.end - base;
          if (a < 0 || b > text.length || a < at) continue;
          if (a > at) p.append(document.createTextNode(text.slice(at, a)));
          const el = util.el(m.kind === 'link' ? 'a' : m.kind === 'tip' ? 'span' : 'strong', m.kind === 'link' ? 'hl-link' : m.kind === 'tip' ? 'hl-tip' : '', p, text.slice(a, b));
          if (m.kind === 'tip' && hooks && hooks.tip) hooks.tip(m, el);
          if (m.kind === 'link') {
            el.href = '#';
            el.draggable = false;
            el.addEventListener('click', (e) => e.preventDefault());
          }
          at = b;
        }
        if (at < text.length || !text.length) p.append(document.createTextNode(text.slice(at)));
      }

      // A vertical scroll pane with a custom scrollbar; mirrors { scroll, view, max, y0, y1 } into model.pane.
      function scrollPane(ctx, pane, content, bar, thumb) {
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
          ctx.patch({ pane: p });
        };
        const { to } = env.ui.scrollPane(pane, {
          max: () => st.max,
          thumb,
          track: bar,
          travel: () => st.trackH - st.thumbH,
          onScroll: () => mirror(),
          onDrag(on) {
            thumb.classList.toggle('on', on);
            if (!on) mirror();
          },
        });
        // Selecting past the edge scrolls the pane natively; keep the mirror in sync.
        pane.addEventListener('scroll', () => mirror());
        return {
          st,
          init(sel, atEnd) {
            st.sel = sel;
            measure();
            if (atEnd) pane.scrollTop = st.max;
            mirror();
          },
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
      }

      env.widget({
        task: 'select-text',
        site: 'base',
        name: 'paragraphs',
        split: 'train',
        scenarios: ['paragraph', 'sentence', 'phrase', 'word', 'field', 'tip'],
        traits: { pane: true, marks: true, triple: true },

        render(ctx) {
          ensureStyle();
          const { rng, util, size, spec } = ctx;

          const maxW = Math.min(880, size.width - 120);
          const width = rng.int(Math.min(560, maxW), maxW);
          const serif = rng.bool(spec.source === 'message' ? 0.2 : 0.5);
          let font = rng.int(16, 19);
          const lh = rng.pick([1.5, 1.6, 1.7]);
          const marker = spec.source === 'message' ? 'none' : rng.pick(['none', 'numbered', 'pilcrow', 'indent']);
          const gap = rng.int(10, 18);
          const selAlpha = rng.int(28, 42);

          const card = util.el('div', 'hl-card', ctx.stage);
          card.style.width = width + 'px';
          card.style.margin = `${rng.int(4, 12)}px ${rng.int(8, 30)}px`;
          card.style.setProperty('--hl-sel', `color-mix(in srgb, var(--accent) ${selAlpha}%, transparent)`);
          const head = util.el('div', 'hl-head', card);
          if (spec.source === 'message') {
            util.el('span', 'hl-kicker', head, rng.pick(['Inbox', 'Message', 'Support', 'Mail']));
            const subj = ctx.content.EMAIL_SUBJECTS ? ctx.content.pick(rng, ctx.content.EMAIL_SUBJECTS, { csplit: spec.csplit }) : 'Your request';
            util.el('span', 'hl-title', head, subj);
            util.el('span', 'hl-meta', head, rng.pick(['Today', 'Yesterday', '2 days ago', 'Mon', 'Fri']));
          } else {
            util.el('span', 'hl-kicker', head, rng.pick(KICKERS));
            const title = spec.source === 'real' && ctx.content.HEADLINES ? ctx.content.pick(rng, ctx.content.HEADLINES, { csplit: spec.csplit }) : rng.pick(TITLES);
            util.el('span', 'hl-title', head, title);
            util.el('span', 'hl-meta', head, `${spec.paragraphs.length} paragraphs`);
          }

          let pane = null;
          let host = card;
          let bar = null;
          let thumb = null;
          if (spec.pane) {
            const row = util.el('div', 'hl-panerow', card);
            pane = util.el('div', 'hl-pane', row);
            bar = util.el('div', 'hl-bar', row);
            thumb = util.el('div', 'hl-thumb', bar);
            thumb.dataset.role = 'scrollbar';
            host = pane;
          }
          const textEl = util.el('div', 'hl-text', host);
          textEl.dataset.role = 'text';
          if (serif) textEl.classList.add('serif');
          if (marker !== 'none') textEl.classList.add(marker);
          textEl.style.setProperty('--hl-gap', gap + 'px');
          if (marker === 'numbered' || marker === 'pilcrow') textEl.style.paddingLeft = '46px';
          const segments = [];
          let base = 0;
          const marks = spec.marks || [];
          // Hover-only tooltips (tip scenario): a dark box under the word while the pointer is over it.
          let tipBox = null;
          const hooks = {
            tip(m, el) {
              el.addEventListener('mouseenter', () => {
                if (!tipBox) {
                  tipBox = util.el('div', 'hl-tipbox', card);
                  tipBox.dataset.skip = '1';
                }
                tipBox.textContent = m.tip;
                const cr = card.getBoundingClientRect();
                const r = el.getBoundingClientRect();
                tipBox.style.display = 'block';
                tipBox.style.left = Math.max(6, Math.min(cr.width - tipBox.offsetWidth - 6, r.left - cr.left)) + 'px';
                tipBox.style.top = r.bottom - cr.top + 6 + 'px';
                if (spec.ask && spec.ask.anchorAt === m.start && !ctx.model.tipSeen) ctx.update({ ...ctx.model, tipSeen: true });
              });
              el.addEventListener('mouseleave', () => { if (tipBox) tipBox.style.display = 'none'; });
            },
          };
          for (const ptext of spec.paragraphs) {
            const p = util.el('p', '', textEl);
            const mine = marks.filter((m) => m.start >= base && m.end <= base + ptext.length);
            if (mine.length) {
              fillParagraph(util, p, ptext, base, mine, hooks);
              segments.push({ node: p, start: base });
            } else {
              const node = document.createTextNode(ptext);
              p.append(node);
              segments.push({ node, start: base });
            }
            base += ptext.length + 2;
          }
          if (rng.bool(0.5)) util.el('div', 'hl-foot', card, rng.pick(['Drag across the text to select it.', 'Select text with the mouse.',
            'Tip: double-click selects a word.', 'Selections are highlighted.']));

          const fit = () => {
            textEl.style.fontSize = font + 'px';
            textEl.style.lineHeight = String(lh);
            textEl.style.setProperty('--hl-lh', font * lh + 'px');
          };
          fit();
          const room = size.height - 32;
          if (pane) {
            // Shrink the type a little if needed so a pane of at least ~45% of the text fits.
            const chrome = () => card.getBoundingClientRect().height - pane.getBoundingClientRect().height;
            pane.style.height = '0px';
            const full = () => textEl.getBoundingClientRect().height;
            while (font > 13 && chrome() + 0.45 * full() > room) { font--; fit(); }
            const avail = room - chrome();
            const view = Math.floor(Math.min(avail, Math.max(160, full() * rng.float(0.4, 0.62))));
            pane.style.height = view + 'px';
          } else {
            // Shrink the type until the card fits the stage (layout is deterministic, so is the result).
            while (card.getBoundingClientRect().height > room && font > 12) {
              font--;
              fit();
            }
          }

          sel = bindSelection(ctx, textEl, segments);
          scroller = null;
          if (pane) {
            scroller = scrollPane(ctx, pane, textEl, bar, thumb);
            scroller.init(sel);
          }
          return { anchors: [card], sync: (m) => sel.set(m) };
        },

        locate: (t) => (t.char !== undefined ? sel.locate(t) : scroller.locate(t)),
      });
      // ---------------------------------------------------------------- code: a monospace text editor

      const CODE_CSS = __has('CODE_CSS') ? __parts['CODE_CSS'](undefined, __scope) : (env.templateLib('select-text/_base-assets').CODE_CSS);

      const THEMES = __has('THEMES') ? __parts['THEMES'](undefined, __scope) : (env.templateLib('select-text/_base-assets').THEMES);
      const FONTS = __has('FONTS') ? __parts['FONTS'](undefined, __scope) : (env.templateLib('select-text/_base-assets').FONTS);
      const FILES = __has('FILES') ? __parts['FILES'](undefined, __scope) : (env.templateLib('select-text/_base-assets').FILES);

      const ensureCodeStyle = __has('ensureCodeStyle') ? __parts['ensureCodeStyle'](undefined, __scope) : { ensureCodeStyle: () => env.util.css('cd-style', CODE_CSS) }.ensureCodeStyle;

      env.widget({
        task: 'select-text',
        site: 'base',
        name: 'code',
        split: 'train',
        scenarios: ['paragraph', 'sentence', 'phrase', 'word', 'field'],
        traits: { pane: false, marks: false },

        render(ctx) {
          return env.templateLib('select-text/_base-code').render(ctx, __scope);
        },

        locate: (t) => sel.locate(t),
      });
      // ================================================================ terms, chat, table, pdf, textbox

      const CSS3 = __has('CSS3') ? __parts['CSS3'](undefined, __scope) : (env.templateLib('select-text/_base-assets').CSS3);

      const ensureStyle3 = __has('ensureStyle3') ? __parts['ensureStyle3'](undefined, __scope) : { ensureStyle3: () => env.util.css('hl-style3', CSS3) }.ensureStyle3;

      const pad = __has('pad') ? __parts['pad'](undefined, __scope) : { pad: (n) => String(n).padStart(2, '0') }.pad;

      // Common frame of the DOM-text widgets: a card with a head, an optional scrolling pane (spec.pane) around the
      // text, fonts shrunk until the card fits the stage. o: { cls, head(card), body(textEl) -> segments[],
      // maxW, minW, font: [lo, hi], tag, textCls, atEnd, tail(card), split(card) -> host,
      // compact(card): last resort when the card is still too tall at the smallest font }.
      function framed(ctx, o) {
        ensureStyle();
        ensureStyle3();
        const { rng, util, size, spec } = ctx;
        const maxW = Math.min(o.maxW || 880, size.width - 120);
        const width = rng.int(Math.min(o.minW || 560, maxW), maxW);
        let font = rng.int(...(o.font || [15, 18]));
        const lh = rng.pick([1.45, 1.55, 1.65]);
        const gap = rng.int(10, 18);
        const card = util.el('div', `hl-card ${o.cls || ''}`, ctx.stage);
        card.style.width = `${width}px`;
        card.style.margin = `${rng.int(4, 10)}px ${rng.int(8, 30)}px`;
        card.style.setProperty('--hl-sel', `color-mix(in srgb, var(--accent) ${rng.int(28, 42)}%, transparent)`);
        o.head(card);
        const split = o.split ? o.split(card) : card;
        let pane = null;
        let host = split;
        let bar = null;
        let thumb = null;
        if (spec.pane) {
          const row = util.el('div', 'hl-panerow', split);
          row.style.flex = '1';
          pane = util.el('div', 'hl-pane', row);
          bar = util.el('div', 'hl-bar', row);
          thumb = util.el('div', 'hl-thumb', bar);
          thumb.dataset.role = 'scrollbar';
          host = pane;
        }
        const textEl = util.el(o.tag || 'div', `hl-text ${o.textCls || ''}`, host);
        textEl.dataset.role = 'text';
        textEl.style.setProperty('--hl-gap', `${gap}px`);
        textEl.style.setProperty('--ch-gap', `${Math.max(6, gap - 4)}px`);
        const segments = o.body(textEl);
        if (o.tail) o.tail(card);
        const fit = () => {
          textEl.style.fontSize = `${font}px`;
          textEl.style.lineHeight = String(lh);
          textEl.style.setProperty('--hl-lh', `${font * lh}px`);
        };
        fit();
        const room = size.height - 32;
        if (pane) {
          const chrome = () => card.getBoundingClientRect().height - pane.getBoundingClientRect().height;
          pane.style.height = '0px';
          const full = () => textEl.getBoundingClientRect().height;
          while (font > 13 && chrome() + 0.45 * full() > room) { font--; fit(); }
          const avail = room - chrome();
          pane.style.height = `${Math.floor(Math.min(avail, Math.max(160, full() * rng.float(0.4, 0.62))))}px`;
        } else {
          const font0 = font;
          const tall = () => card.getBoundingClientRect().height > room;
          while (tall() && font > (o.minFont || 12)) { font--; fit(); }
          // Still too tall at the smallest font (a long chat in a short stage): widen the card to its maximum, so
          // fewer lines wrap, tighten the gaps and fit the font again from the top.
          if (tall()) {
            card.style.width = `${maxW}px`;
            font = font0;
            fit();
            for (let g = gap - 2; tall() && g >= 4; g -= 2) {
              textEl.style.setProperty('--hl-gap', `${g}px`);
              textEl.style.setProperty('--ch-gap', `${Math.max(4, g - 4)}px`);
            }
            while (tall() && font > (o.minFont || 12)) { font--; fit(); }
          }
          // Still too tall: the widget's last resort (chat drops the name/time lines above its bubbles), then the font
          // is fitted again from the top.
          if (tall() && o.compact) {
            o.compact(card);
            font = font0;
            fit();
            while (tall() && font > (o.minFont || 12)) { font--; fit(); }
          }
        }
        sel = bindSelection(ctx, textEl, segments);
        scroller = null;
        if (pane) {
          scroller = scrollPane(ctx, pane, textEl, bar, thumb);
          scroller.init(sel, o.atEnd);
        }
        return { anchors: [card], sync: (m) => sel.set(m) };
      }

      const locateDom = __has('locateDom') ? __parts['locateDom'](undefined, __scope) : { locateDom: (t) => (t.char !== undefined ? sel.locate(t) : scroller.locate(t)) }.locateDom;

      // Paragraph text with the marks that fall inside it; returns the segment.
      function paragraphSegment(util, parent, spec, text, base) {
        const p = util.el('p', '', parent);
        const mine = (spec.marks || []).filter((m) => m.start >= base && m.end <= base + text.length);
        if (mine.length) {
          fillParagraph(util, p, text, base, mine);
          return { node: p, start: base };
        }
        const node = document.createTextNode(text);
        p.append(node);
        return { node, start: base };
      }

      // ---------------------------------------------------------------- terms: a terms-of-service page

      const TERMS_TITLES = __has('TERMS_TITLES') ? __parts['TERMS_TITLES'](undefined, __scope) : (env.templateLib('select-text/_base-assets').TERMS_TITLES);
      const SITE_NAMES = __has('SITE_NAMES') ? __parts['SITE_NAMES'](undefined, __scope) : (env.templateLib('select-text/_base-assets').SITE_NAMES);

      env.widget({
        task: 'select-text',
        site: 'base',
        name: 'terms',
        split: 'train',
        scenarios: ['paragraph', 'sentence', 'phrase', 'word'],
        traits: { pane: true, marks: true, unit: 'clause', triple: true },

        render(ctx) {
          const { rng, util, spec } = ctx;
          const serif = rng.bool(0.4);
          const toc = rng.bool(0.5);
          const foot = rng.bool(0.5);
          const months = (ctx.content && ctx.content.MONTHS) || ['January', 'March', 'June', 'September', 'November'];
          return framed(ctx, {
            cls: 'legal',
            maxW: toc ? 980 : 860,
            minW: toc ? 780 : 560,
            textCls: serif ? 'serif' : '',
            head(card) {
              const head = util.el('div', 'hl-head', card);
              util.el('span', 'hl-kicker', head, rng.pick(SITE_NAMES));
              util.el('span', 'hl-title', head, rng.pick(TERMS_TITLES));
              util.el('span', 'hl-meta', head, `Last updated ${rng.int(1, 28)} ${rng.pick(months)} ${rng.int(2022, 2025)}`);
              if (rng.bool(0.5)) util.el('div', 'tm-banner', card, rng.pick(['Please read these terms carefully before using the service.',
                'By continuing you agree to the terms below.', 'This agreement applies to all customers.']));
            },
            split(card) {
              if (!toc) return card;
              const row = util.el('div', 'hl-split', card);
              const side = util.el('div', 'tm-toc', row);
              util.el('b', '', side, 'Contents');
              spec.titles.forEach((t, i) => util.el('div', '', side, `${i + 1}. ${t}`));
              return util.el('div', 'hl-main', row);
            },
            body(textEl) {
              let base = 0;
              return spec.paragraphs.map((t, i) => {
                const sec = util.el('section', 'tm-clause', textEl);
                const h = util.el('h3', 'tm-h', sec, `${i + 1}. ${spec.titles[i]}`);
                h.dataset.skip = '';
                const seg = paragraphSegment(util, sec, spec, t, base);
                base += t.length + 2;
                return seg;
              });
            },
            tail(card) {
              if (!foot) return;
              const f = util.el('div', 'tm-foot', card);
              for (const b of rng.pick([['Print', 'Download PDF'], ['Decline', 'Accept'], ['Back to top', 'Contact us']])) util.el('span', '', f, b);
            },
          });
        },
        locate: locateDom,
      });

      // ---------------------------------------------------------------- chat: a transcript

      const CHAT_TITLES = __has('CHAT_TITLES') ? __parts['CHAT_TITLES'](undefined, __scope) : (env.templateLib('select-text/_base-assets').CHAT_TITLES);

      env.widget({
        task: 'select-text',
        site: 'base',
        name: 'chat',
        split: 'train',
        scenarios: ['paragraph', 'sentence', 'phrase', 'word', 'field'],
        traits: { pane: true, unit: 'message', triple: true },

        render(ctx) {
          const { rng, util, spec } = ctx;
          const C = spec.chat;
          const others = C.people.slice(1);
          const letter = (n) => n.charAt(0).toUpperCase();
          return framed(ctx, {
            cls: 'ch-card',
            maxW: 640,
            minW: 460,
            font: [14, 16],
            minFont: 11,
            atEnd: rng.bool(0.6),
            head(card) {
              const top = util.el('div', 'ch-top', card);
              util.el('div', 'av', top, letter(others[0]));
              const w = util.el('div', '', top);
              util.el('b', '', w, others.length > 1 ? rng.pick(CHAT_TITLES) : others[0]);
              util.el('small', '', w, others.length > 1 ? `${C.people.length} people` : rng.pick(['online', 'active now', 'last seen recently']));
            },
            tag: 'div',
            textCls: 'ch-text',
            body(textEl) {
              util.el('div', 'ch-day', textEl, rng.pick(['Today', 'Yesterday', 'Monday']));
              let base = 0;
              return spec.paragraphs.map((t, i) => {
                const who = C.people[C.who[i]];
                const me = C.who[i] === 0;
                const row = util.el('div', 'ch-row' + (me ? ' me' : ''), textEl);
                if (!me) util.el('div', 'av', row, letter(who)).dataset.skip = '';
                const col = util.el('div', 'ch-col', row);
                util.el('div', 'ch-meta', col, me ? C.at[i] : `${who} · ${C.at[i]}`).dataset.skip = '';
                const bub = util.el('div', 'ch-bub', col);
                const node = document.createTextNode(t);
                bub.append(node);
                const seg = { node, start: base };
                base += t.length + 2;
                return seg;
              });
            },
            compact(card) {
              for (const m of card.querySelectorAll('.ch-meta')) m.style.display = 'none';
            },
            tail(card) {
              const c = util.el('div', 'ch-compose', card);
              util.el('div', '', c, 'Type a message…');
              util.el('span', '', c, 'Send');
            },
          });
        },
        locate: locateDom,
      });

      // ---------------------------------------------------------------- table: text in cells

      const TABLE_TITLES = __has('TABLE_TITLES') ? __parts['TABLE_TITLES'](undefined, __scope) : (env.templateLib('select-text/_base-assets').TABLE_TITLES);

      env.widget({
        task: 'select-text',
        site: 'base',
        name: 'table',
        split: 'train',
        scenarios: ['paragraph', 'sentence', 'phrase', 'word', 'field'],
        traits: { unit: 'cell', triple: true },

        render(ctx) {
          const { rng, util, spec } = ctx;
          const T = spec.table;
          const nC = T.cols.length;
          const zebra = rng.bool(0.6);
          const colLines = rng.bool(0.4);
          return framed(ctx, {
            cls: 'tbl-card',
            maxW: 1040,
            minW: 760,
            font: [13, 15],
            tag: 'table',
            textCls: `tbl${zebra ? ' zebra' : ''}${colLines ? ' cols' : ''}`,
            head(card) {
              const bar = util.el('div', 'tbl-bar', card);
              util.el('b', '', bar, rng.pick(TABLE_TITLES));
              util.el('span', '', bar, `${T.rows} rows`);
              util.el('span', 'grow', bar);
              for (const c of rng.pick([['Filter', 'Export'], ['Columns', 'Sort'], ['Search', 'New']])) util.el('span', 'chip', bar, c);
            },
            body(textEl) {
              textEl.style.setProperty('--tb-pad', `${rng.int(5, 9)}px`);
              const thead = util.el('thead', '', textEl);
              const hr = util.el('tr', '', thead);
              for (const c of T.cols) util.el('th', '', hr, c.label).dataset.skip = '';
              const tbody = util.el('tbody', '', textEl);
              const segs = [];
              let base = 0;
              for (let r = 0; r < T.rows; r++) {
                const tr = util.el('tr', '', tbody);
                for (let c = 0; c < nC; c++) {
                  const t = spec.paragraphs[r * nC + c];
                  const td = util.el('td', '', tr);
                  const node = document.createTextNode(t);
                  td.append(node);
                  segs.push({ node, start: base });
                  base += t.length + 2;
                }
              }
              return segs;
            },
            tail(card) {
              if (rng.bool(0.5)) util.el('div', 'tbl-foot', card, `Showing 1-${T.rows} of ${T.rows + rng.int(0, 40)}`);
            },
          });
        },
        locate: locateDom,
      });

      // ---------------------------------------------------------------- pdf: pages in a viewer pane

      env.widget({
        task: 'select-text',
        site: 'base',
        name: 'pdf',
        split: 'train',
        scenarios: ['paragraph', 'sentence', 'phrase', 'word', 'field'],
        traits: { pane: 'always', marks: true, triple: true },

        render(ctx) {
          ensureStyle();
          ensureStyle3();
          const { rng, util, size, spec } = ctx;
          const win = util.el('div', 'pf-win', ctx.stage);
          const room = size.height - 32;
          const winW = Math.min(size.width - 120, rng.int(600, 820));
          win.style.width = `${winW}px`;
          win.style.height = `${room}px`;
          win.style.margin = `${rng.int(2, 8)}px ${rng.int(8, 24)}px`;
          const bar = util.el('div', 'pf-bar', win);
          util.el('span', 'name', bar, rng.pick(['report.pdf', 'agreement_v2.pdf', 'scan_0412.pdf', 'newsletter.pdf', 'minutes.pdf']));
          const pgLabel = util.el('span', 'pg', bar, '');
          const zoom = util.el('span', 'zm', bar);
          for (const z of ['−', '100%', '+']) util.el('span', '', zoom, z);
          const body = util.el('div', 'pf-body', win);
          const pane = util.el('div', 'pf-pane', body);
          pane.dataset.role = 'pane';
          const sbar = util.el('div', 'pf-scroll', body);
          const thumb = util.el('div', 'pf-thumb', sbar);
          thumb.dataset.role = 'scrollbar';
          const pages = util.el('div', 'pf-pages', pane);
          pages.dataset.role = 'text';
          pages.style.setProperty('--hl-sel', 'rgba(51,144,255,.38)');
          pages.style.setProperty('--hl-gap', `${rng.int(8, 14)}px`);
          const pageW = Math.min(winW - 70, rng.int(420, 520));
          const font = rng.int(12, 14);
          const perPage = Math.max(2, Math.ceil(spec.paragraphs.length / rng.int(2, 3)));
          const just = rng.bool(0.6);
          const runner = rng.pick(['Annual report', 'Confidential', 'Draft', 'Internal use']);
          const segments = [];
          let base = 0;
          const nPages = Math.ceil(spec.paragraphs.length / perPage);
          for (let k = 0; k < nPages; k++) {
            const page = util.el('div', 'pf-page' + (just ? ' just' : ''), pages);
            page.style.width = `${pageW}px`;
            page.style.minHeight = `${Math.round(pageW * 1.28)}px`;
            page.style.padding = `46px ${Math.round(pageW * 0.12)}px 54px`;
            page.style.fontSize = `${font}px`;
            page.style.lineHeight = '1.5';
            page.style.fontFamily = 'Georgia, "Liberation Serif", "DejaVu Serif", serif';
            util.el('div', 'pf-run', page, runner).dataset.skip = '';
            spec.paragraphs.slice(k * perPage, (k + 1) * perPage).forEach((t) => {
              segments.push(paragraphSegment(util, page, spec, t, base));
              base += t.length + 2;
            });
            util.el('div', 'pf-num', page, String(k + 1)).dataset.skip = '';
          }
          pgLabel.textContent = `1 / ${nPages}`;
          sel = bindSelection(ctx, pages, segments);
          scroller = scrollPane(ctx, pane, pages, sbar, thumb);
          scroller.init(sel);
          const pageEls = [...pages.children];
          pane.addEventListener('scroll', () => {
            let cur = 0;
            pageEls.forEach((el, i) => { if (el.offsetTop <= pane.scrollTop + pane.clientHeight / 2) cur = i; });
            pgLabel.textContent = `${cur + 1} / ${nPages}`;
          });
          return { anchors: [win], sync: (m) => sel.set(m) };
        },
        locate: locateDom,
      });

      // ---------------------------------------------------------------- textbox: a native <textarea> / <input>

      // Viewport point of the glyph at doc offset i inside a native field: a mirror element with the field's own
      // box and font lays the text out the same way (wrapping included); edge 'before' / 'after' picks the left /
      // right quarter of the glyph, where a press puts the caret before / after it.
      function fieldPoint(el, i, edge) {
        const cs = getComputedStyle(el);
        const m = document.createElement('div');
        for (const k of ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'wordSpacing', 'textTransform', 'textIndent',
          'lineHeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth',
          'borderBottomWidth', 'borderLeftWidth', 'boxSizing', 'tabSize', 'textAlign']) m.style[k] = cs[k];
        m.style.borderStyle = 'solid';
        m.style.borderColor = 'transparent';
        m.style.position = 'fixed';
        m.style.left = '0';
        m.style.top = '0';
        m.style.visibility = 'hidden';
        m.style.width = `${el.offsetWidth}px`;
        const multi = el.tagName === 'TEXTAREA';
        m.style.whiteSpace = multi ? 'pre-wrap' : 'pre';
        m.style.overflowWrap = multi ? 'break-word' : 'normal';
        m.textContent = el.value;
        document.body.append(m);
        const r = document.createRange();
        const k = Math.max(0, Math.min(el.value.length - 1, i));
        r.setStart(m.firstChild, k);
        r.setEnd(m.firstChild, k + 1);
        const g = r.getBoundingClientRect();
        m.remove();
        const box = el.getBoundingClientRect();
        const x = box.left + g.left - el.scrollLeft + (edge === 'after' ? g.width * 0.75 : g.width * 0.25);
        const y = multi ? box.top + g.top - el.scrollTop + g.height / 2 : box.top + box.height / 2;
        return [x, y];
      }

      let field = __has('field') ? __parts['field'](undefined, __scope) : (null); // the live native field
      // The episode whose field had focus when it was last seen: a mid-episode re-render (fault shift / revert,
      // preempt switch) gives the new field the focus back, so Shift+Arrow keys keep extending its selection.
      let fieldFocus = __has('fieldFocus') ? __parts['fieldFocus'](undefined, __scope) : (null);

      env.widget({
        task: 'select-text',
        site: 'base',
        name: 'textbox',
        split: 'train',
        scenarios: ['paragraph', 'sentence', 'phrase', 'word', 'field'],
        traits: { native: true, triple: true },

        render(ctx) {
          ensureStyle();
          ensureStyle3();
          const { rng, util, size, spec } = ctx;
          const one = spec.native === 'input';
          const maxW = Math.min(size.width - 120, one ? 820 : 760);
          const width = rng.int(Math.min(one ? 600 : 520, maxW), maxW);
          let font = rng.int(one ? 15 : 14, one ? 18 : 17);
          const lh = rng.pick([1.45, 1.55, 1.65]);
          const card = util.el('div', 'hl-card tb-card', ctx.stage);
          card.style.width = `${width}px`;
          card.style.margin = `${rng.int(4, 10)}px ${rng.int(8, 30)}px`;
          card.style.setProperty('--hl-sel', `color-mix(in srgb, var(--accent) ${rng.int(28, 42)}%, transparent)`);
          const look = one ? 'row' : rng.pick(['composer', 'note']);
          let el;
          if (one) {
            const head = util.el('div', 'hl-head', card);
            util.el('span', 'hl-kicker', head, rng.pick(['Quick reply', 'Subject', 'Status update', 'Search']));
            const row = util.el('div', 'tb-row', card);
            util.el('label', '', row, rng.pick(['Message', 'Text', 'Note', 'Draft']));
            el = util.el('input', 'tb-in', row);
            el.type = 'text';
            el.style.flex = '1';
            util.el('span', 'btn', row, rng.pick(['Send', 'Save', 'Go']));
          } else if (look === 'composer') {
            const bar = util.el('div', 'tb-bar', card);
            util.el('span', '', bar, 'To');
            util.el('input', '', bar).value = rng.pick(['support@example.com', 'team@example.org', 'all@company.test']);
            util.el('span', '', bar, rng.pick(['Cc', 'Bcc']));
            const tb = util.el('div', 'tb-toolbar', card);
            for (const t of ['B', 'I', 'U', 'Link', 'List']) util.el('span', '', tb, t);
            el = util.el('textarea', 'tb-ta', card);
          } else {
            const head = util.el('div', 'hl-head', card);
            util.el('span', 'hl-kicker', head, rng.pick(['Notes', 'Memo', 'Journal', 'Scratchpad']));
            util.el('span', 'hl-title', head, rng.pick(['Untitled note', 'Meeting notes', 'Draft', 'Reading list']));
            el = util.el('textarea', 'tb-ta paper', card);
          }
          el.dataset.role = 'text';
          el.readOnly = true;
          el.spellcheck = false;
          el.value = spec.doc;
          el.setAttribute('aria-label', 'Text');
          if (!one && look === 'composer') {
            const f = util.el('div', 'tb-foot', card);
            util.el('span', '', f, `${spec.doc.length} characters`);
            util.el('span', 'btn', f, 'Send');
          }
          const fit = () => {
            card.style.fontSize = `${font}px`;
            card.style.lineHeight = String(lh);
            card.style.setProperty('--hl-lh', `${font * lh}px`);
            if (!one) {
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }
          };
          fit();
          const room = size.height - 32;
          while (card.getBoundingClientRect().height > room && font > 12) { font--; fit(); }
          if (one) {
            // Wide enough for the whole line, so the field never scrolls horizontally.
            while (el.scrollWidth > el.clientWidth && font > 11) { font--; fit(); }
          }

          field = el;
          let last = [-1, -1];
          const read = () => {
            const a = el.selectionStart;
            const b = el.selectionEnd;
            if (a === last[0] && b === last[1]) return;
            last = [a, b];
            ctx.update({ ...ctx.model, start: a, end: b });
          };
          const set = (m) => {
            if (el.selectionStart !== m.start || el.selectionEnd !== m.end) el.setSelectionRange(m.start, m.end);
            last = [m.start, m.end];
          };
          set(ctx.model);
          const refocus = fieldFocus === ctx.episode;
          el.addEventListener('focus', () => { fieldFocus = ctx.episode; });
          // Removing the field blurs it while it is still connected: only a blur that leaves it on the page counts.
          el.addEventListener('blur', () => queueMicrotask(() => { if (el.isConnected) fieldFocus = null; }));
          for (const ev of ['select', 'keyup', 'pointerup', 'dblclick', 'focus']) el.addEventListener(ev, read);
          el.addEventListener('click', (e) => {
            if (e.button !== 0 || e.shiftKey || util.clickCount(e) < 3) return;
            const range = paragraphAt(spec, el.selectionStart);
            el.setSelectionRange(range.start, range.end);
            read();
          });
          el.addEventListener('pointermove', (e) => { if (e.buttons & 1) read(); });
          document.addEventListener('selectionchange', () => { if (el.isConnected && document.activeElement === el) read(); });
          if (refocus) el.focus({ preventScroll: true });
          return { anchors: [card], sync: set };
        },

        locate: (t) => {
          if (t.char === undefined) throw new Error(`select-text/textbox cannot locate ${JSON.stringify(t)}`);
          return fieldPoint(field, t.char, t.edge);
        },
      });
      // ================================================================ scanpdf
      /*
       * scanpdf: a scanned-PDF viewer. The page is one raster <canvas>: paper tone, scan speckles, a faint scanner
       * streak, a rubber stamp, a tiny rotation and per-line jitter, and the text drawn as ink pixels. There is no DOM
       * text layer (no text nodes, no ARIA, no OCR layer), so the text and the selection exist only in pixels; the
       * toolbar (file name, page count, zoom) is DOM. The widget lays out the text itself (greedy wrap with
       * measureText) and keeps every glyph's box: hit testing, the drawn selection and locate() all come from these
       * boxes through the page's rotation. Selection works like a viewer's own text tool: press + drag, double
       * click (a word: letters and digits), triple click (the paragraph), Shift+click and Shift+drag extend from the
       * anchor, Shift+ArrowLeft / Shift+ArrowRight move the focus by a character and Control+Shift+ArrowRight to the
       * next word end. Scenarios: paragraph, sentence, phrase, word, field (no pane: the type shrinks until the page
       * fits; no inline marks; no tip). traits.triple.
       */
      const SP_CSS = __has('SP_CSS') ? __parts['SP_CSS'](undefined, __scope) : (env.templateLib('select-text/_base-assets').SP_CSS);
      const SP_FONTS = __has('SP_FONTS') ? __parts['SP_FONTS'](undefined, __scope) : (env.templateLib('select-text/_base-assets').SP_FONTS);
      const SP_STAMPS = __has('SP_STAMPS') ? __parts['SP_STAMPS'](undefined, __scope) : (env.templateLib('select-text/_base-assets').SP_STAMPS);
      let spView = __has('spView') ? __parts['spView'](undefined, __scope) : (null);

      function renderScanpdf(ctx) {
        return env.templateLib('select-text/_base-scanpdf').renderScanpdf(ctx, __scope);
      }

      env.widget({
        task: 'select-text',
        site: 'base',
        name: 'scanpdf',
        split: 'train',
        scenarios: ['paragraph', 'sentence', 'phrase', 'word', 'field'],
        traits: { triple: true },
        render: renderScanpdf,
        locate(t) {
          const p = spView && spView.locate(t);
          if (!p) throw new Error(`select-text/scanpdf cannot locate ${JSON.stringify(t)}`);
          return p;
        },
      });
    })();

    return captured;
  }
  env.template('select-text/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`select-text/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('select-text/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`select-text/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`select-text/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ['select-text/_base-assets', 'select-text/_base-code', 'select-text/_base-scanpdf'] });
})();
