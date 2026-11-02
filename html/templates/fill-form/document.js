/*
 * templates / fill-form / document: the shared widget code of the design-fill-form-* sites (taken from the reference
 * widget fill-form/document as those sites had it; the defaults reproduce design-fill-form-email-01). The source
 * document (an ID / contact / profile card, an email in a mail-client or plain-text look, an invoice on paper
 * or a monospace till receipt) sits beside a compact web form. Text and date fields are plain text inputs with
 * a clear button that shows while they hold text; the dropdown is a custom listbox (button + absolutely
 * positioned list that opens downward, or upward when there is no room; env.ui.dropdown); radios and checkboxes
 * are native inputs with clickable labels (env.ui.choices). A site's widgets/fill-form.js is only its design:
 *
 *   env.widget({ task: 'fill-form', site, name: 'design', split, scenarios: ['email'], traits?: {...},
 *              template: 'fill-form/document', design: { formTitle: 'Add Contact', parts: { fit: (base, S) => (ctx, R) => ... } } });
 *
 * Scenarios: card, email, invoice (one template serves all three: the document renderers, the form and the page
 * code are shared). A widget that declares exactly one scenario starts from that scenario's preset (VARIANTS below),
 * then applies its own design:
 *   card     { modalControls: true, fitReserve: 62 }       design: {} reproduces design-fill-form-card-01
 *   email    {}                                            design: {} reproduces design-fill-form-email-01
 *   invoice  standard layout, listAvoidSubmit: false, formTitle: 'Enter Invoice Details', a dateIcon,
 *            fieldWrap (date class), arranged (footer move), finished (receipt fit):
 *            design: {} reproduces design-fill-form-invoice-09
 * Page modes from spec.layout: tabs (document and form are two tabs of one card, stacked in the same grid cell
 * so switching never moves anything; env.ui.tabs). Widget CSS is the template's (ff-* classes, colors from the
 * site's --panel, --line, --accent, --muted, --fg, --bg); a site restyles it in its site.css.
 *
 * Two layouts (token layout) draw the page; a site uses one:
 *   compact    (default) one root sized by a font loop and scaled to fit the stage; the tabbed page is
 *              [tabs, panels]. The layout of design-fill-form-email-01 and the 26 sites of its kind.
 *   standard   the base widget's page: a root as wide as the stage box (stageBox), seeded paper color and
 *              ink, doc-right / long modes, the document drawn on a canvas in the image mode (renderImage),
 *              a scrollable page for long forms (the widget key `scrollable`), pills and a swapped tab order.
 *              The layout of the design-fill-form-invoice-02..10 and 12 sites.
 *
 * design tokens (defaults in TOKENS reproduce design-fill-form-email-01; a scenario's preset changes some):
 *   layout          'compact' | 'standard' (see above)
 *   rootFont        compact: the root's start font size, a CSS length ('21px')
 *   paper, ink      compact: the root's --ff-paper and --ff-ink ('#ffffff', 'var(--accent)')
 *   modalControls   true: a ds-modal-controls strip of three buttons (minimize, maximize, close) in the stage
 *   formTitle       the form's heading (null: spec.formTitle)
 *   tabsGrid        compact, tabbed pages with more than 5 fields: the form grid's grid-template-columns
 *                   ('1fr 1fr'; '1fr' a single column; null leaves the form's own grid)
 *   fitStart        compact fit: the font size the loop starts from (21)
 *   fitReserve      compact fit: stage height kept free of the root (12)
 *   listAvoidSubmit true: the dropdown list stays above the end control when it sits over the button (the
 *                   default); false: only the window bottom limits the list
 *   dateIcon        null | a calendar icon on date fields: { svg, cls: 'ff-calendar', host: 'box' | 'wrap' (the
 *                   input box, or the field wrapper), early: true (inside the box before the clear button;
 *                   otherwise after the field is built), tag: 'span' | 'button', text, title, boxCls (class added
 *                   to the input box), aria (aria-hidden), focus (a click focuses the input) }
 *
 * design.parts: { <part>: (base, S) => replacement } replaces a part; the replacement takes the part's arguments
 * and may call base(...) for the default. S reads the live state: S.st (the episode: { ctx, spec, el, tabs,
 * root }), S.el (st.el: { fieldId: entry }), S.ctx, S.spec, S.D (tokens), S.P (the parts, overrides included).
 * R is the render record the render hooks share: { root, docPane, formPane, tabbar, form, ... }. Parts:
 *   Page (compact; standard has the same hook names and slots, so a design's hooks fit either)
 *   renderCompact(ctx), renderStandard(ctx)   the two page layouts; calls the hooks in this order:
 *   begin(ctx)               render start, after ensureStyle (default: the modalControls strip)
 *   rootReady(ctx, R)        the root exists with its fonts and colors (R: root; standard also box, availW, availH, ink)
 *   panes(ctx, R)            the document and form panes (and tabs) exist, nothing drawn in them yet
 *   (document drawn by renderDoc)
 *   beforeForm(ctx, R)       the document is drawn, the form is not (default: nothing)
 *   (form drawn by renderForm; R.form is the form; compact applies tabsGrid)
 *   arranged(ctx, R)         the form is drawn: move frame in, add decorations, fit local pieces
 *   showTab(ctx, R)          the tab panels' off classes (compact: before fit; standard: after fit)
 *   fit(ctx, R)              the font loop (compact: root font + scale; standard: root font until both panes fit)
 *   scaled(ctx, R, ratio)    compact fit: after the root was scaled by ratio < .98
 *   finished(ctx, R)         everything is laid out, anchors not yet taken
 *   anchors(ctx, R) -> [el]  the anchors render returns
 *   syncField(id, x, m)      sync(model): put the model's value into field entry x
 *   stageBox(ctx) -> { width, height, host }   standard: the stage box
 *   clear()                  (only when a design sets it) the widget key `clear` the site's Clear button calls
 *   fieldPoint(r) -> [x, y]  locate: where to press a text field of client rect r
 *   Form
 *   renderForm(util, pane, spec, model, rng) -> form    heading(util, pane, form, text): the h2
 *   formStart(form, pane, spec)   after the heading        grid(grid, form, pane, spec)   after the grid element
 *   fieldWrap(f, wrap)       after each field wrapper       labelText(f) -> string   a field label's text
 *   label(f, lab, wrap)      after each label               entry(f, x)   after each field entry was stored (x: the entry)
 *   fieldDone(f, x, wrap)    after each non-checkbox field  formEnd(form, grid, pane, spec)   after the last field
 *   textField(util, wrap, f, value) -> { input, clear, sync }   placeholder(f) -> string   inputBox(f, box, input)
 *   dateIcon(f, box, wrap, input)   draws the dateIcon token for a date field
 *   dropdownField(...) -> { dd, btn, list, opts, w, show }   radioField(...) -> { w, radios }   (checkbox: { w, cb })
 *   showList(dd, btn, list, open)   the dropdown layout hook   listLimit(r) -> number   the list's lower bound
 *   setField(id, value, open), setOpen(id)   model updates
 *   Documents
 *   renderDoc(util, pane, d, rng)    dispatches on d.kind to renderCard / renderEmail / renderInvoice (rng.fork('doc'))
 *   renderCard(util, pane, d, rng): cardFill(util, card, d) -> cardId / cardContact / cardProfile by d.style,
 *                                    then the seeded corner radius (one rng.bool)
 *   renderEmail(util, pane, d, rng): mailPlain(util, pane, d) or mailClient(util, pane, d, rng); mailTools(rng) is
 *                                    the client toolbar's one seeded draw (a design that drops the toolbar calls it)
 *   mailHeader(util, parent, d, { cls, addr, skip, labelTag, labelCls }) -> el   a block of From / To / Subject / Date rows
 *   renderInvoice(util, pane, d, rng): isReceipt(d) -> receipt(util, pane, d), else invoiceSheet(util, pane, d, rng),
 *                                    which calls sheetStart(inv, d) (noop), sheetFont(inv, rng, d),
 *                                    sheetHeader(util, inv, d), sheetBillTo(util, inv, d), sheetItems(util, inv, d),
 *                                    sheetTotals(util, inv, d) -> table, sheetEnd(util, inv, tot, d).
 *                                    sheetHeader uses sheetTitle(d); sheetItems uses sheetCols(d).
 *   renderImage(util, pane, d, rng, W, maxH, look) -> canvas   (standard) imageDrawn(cv, pane, d, dpr) after it is drawn
 *   row(util, parent, label, value, cls)
 * An override must keep the rng draws of the parts it replaces (rng.int / pick / bool calls, in order), or
 * episodes change for every seed.
 */
(function () {
  'use strict';

  const TOKENS = {
    layout: 'compact',
    rootFont: '21px',
    paper: '#ffffff',
    ink: 'var(--accent)',
    modalControls: false,
    formTitle: null,
    tabsGrid: '1fr 1fr',
    fitStart: 21,
    fitReserve: 12,
    listAvoidSubmit: true,
    dateIcon: null,
  };

  // What the sites of one scenario share (applied to a widget that declares exactly that scenario).
  const SCENARIOS = {
    card: { modalControls: true, fitReserve: 62 },
    email: {},
    invoice: {
      layout: 'standard', listAvoidSubmit: false,
      formTitle: 'Enter Invoice Details',
      dateIcon: { cls: 'ff-calendar', host: 'wrap', aria: true, svg: '<svg viewBox="0 0 32 34" shape-rendering="crispEdges"><path d="M2 5h28v27H2z" fill="#deedf4" stroke="#174879" stroke-width="2"/><path d="M3 12h26M8 1v8M24 1v8" stroke="#174879" stroke-width="3"/><path d="M6 16h4v4H6zM14 16h4v4h-4zM22 16h4v4h-4zM6 23h4v4H6zM14 23h4v4h-4zM22 23h4v4h-4z" fill="#174879"/></svg>' },
      parts: {
        fieldWrap: () => (f, wrap) => {
          if (f.kind === 'date') wrap.classList.add('ff-date');
        },
        arranged: () => (ctx, R) => {
          const footer = document.querySelector('.ds-footer');
          if (footer && !ctx.spec.layout.tabs) R.formPane.append(footer);
        },
        // Keep every source line readable within the framed paper at each viewport.
        finished: () => (ctx, R) => {
          const paper = R.docPane.querySelector('.ff-receipt');
          if (paper && !ctx.spec.layout.long) {
            let paperSize = parseFloat(getComputedStyle(paper).fontSize);
            while (paper.scrollHeight > paper.clientHeight + 1 && paperSize > 10) {
              paperSize -= .5;
              paper.style.fontSize = paperSize + 'px';
            }
          }
        },
      },
    },
  };

  function ensureStyle() {
    if (document.getElementById('ff-style')) return;
    const s = document.createElement('style');
    s.id = 'ff-style';
    s.textContent = env.templateLib('fill-form/_assets').DOCUMENT_CSS;
    document.head.append(s);
  }

  // ---------------------------------------------------------------- document as an image (canvas)

  // The document as a list of simple blocks the canvas layout understands.
  function docBlocks(d) {
    return env.templateLib('fill-form/_documents').docBlocks(env.templateLib('fill-form/_assets'), d);
  }

  function layoutDoc(c, blocks, W, F, fam, ink) {
    return env.templateLib('fill-form/_documents').layoutDoc(env.templateLib('fill-form/_assets'), c, blocks, W, F, fam, ink);
  }

  env.template('fill-form/document', (design, def) => {
    const { PAPERS, INVOICE_FONTS, PERSON_SVG, DOC_FONTS } = env.templateLib('fill-form/_assets');
    let D;
    let P; // tokens and parts, resolved below
    let st = null; // live episode: { ctx, spec, el: { id: {...} }, root, tabs }
    const BASE = {};
    const S = {
      get st() { return st; }, set st(v) { st = v; },
      get PAPERS() { return PAPERS; },
      get INVOICE_FONTS() { return INVOICE_FONTS; },
      get PERSON_SVG() { return PERSON_SVG; },
      get DOC_FONTS() { return DOC_FONTS; },
      get docBlocks() { return docBlocks; },
      get layoutDoc() { return layoutDoc; },
      get ensureStyle() { return ensureStyle; },
      get el() { return st.el; },
      get ctx() { return st.ctx; },
      get spec() { return st.spec; },
      get D() { return D; },
      get P() { return P; },
    };

    // ------------------------------------------------------------ model updates

    env.templateLib('fill-form/_document-form').installFields(BASE, S);

    env.templateLib('fill-form/_document-form').installForm(BASE, S);

    env.templateLib('fill-form/_document-content').installCard(BASE, S);

    env.templateLib('fill-form/_document-content').installEmail(BASE, S);

    env.templateLib('fill-form/_document-content').installInvoice(BASE, S);

    env.templateLib('fill-form/_document-content').installImage(BASE, S);

    env.templateLib('fill-form/_document-page').installPage(BASE, S);

    // Compact: the root's font shrinks until it fits the stage, then the root is scaled down if it still does not.
    const fitCompact = env.templateLib('fill-form/_document-page').installCompact(BASE, S);

    const fitStandard = env.templateLib('fill-form/_document-page').installStandard(BASE, S);

    BASE.fieldPoint = (r) => [r.left + Math.min(r.width * 0.35, 110), r.top + r.height / 2];

    BASE.clear = () => {};

    // ------------------------------------------------------------ assemble

    BASE.fit = (ctx, R) => (D.layout === 'standard' ? fitStandard(ctx, R) : fitCompact(ctx, R));

    ({ D, P } = env.templateDesign('fill-form/document', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));

    return {
      ...(D.layout === 'standard' ? { scrollable: (spec) => !!(spec.layout && spec.layout.long) } : {}),
      ...(P.clear !== BASE.clear ? { clear: () => P.clear() } : {}),

      render(ctx) {
        if (D.layout !== 'compact' && D.layout !== 'standard') throw new Error(`fill-form/document: unknown layout '${D.layout}'`);
        return D.layout === 'standard' ? P.renderStandard(ctx) : P.renderCompact(ctx);
      },

      locate(t) {
        const center = st.ctx.util.center;
        const e = (id) => {
          const x = st.el[id];
          if (!x) throw new Error(`fill-form/document: no field ${id}`);
          return x;
        };
        if (t.tab !== undefined) return st.tabs.locate(t.tab);
        if (t.field !== undefined) return P.fieldPoint(e(t.field).input.getBoundingClientRect());
        if (t.clear !== undefined) return center(e(t.clear).clear);
        if (t.open !== undefined) return e(t.open).w.locateTrigger();
        if (t.option !== undefined) return e(t.option[0]).w.locateOption(t.option[1]);
        if (t.radio !== undefined) return e(t.radio[0]).w.locate(t.radio[1]);
        if (t.checkbox !== undefined) return e(t.checkbox).w.locate(t.checkbox);
        throw new Error(`fill-form/document cannot locate ${JSON.stringify(t)}`);
      },
    };
  }, { uses: ["fill-form/_assets","fill-form/_documents","fill-form/_document-form","fill-form/_document-content","fill-form/_document-page"] });
})();
