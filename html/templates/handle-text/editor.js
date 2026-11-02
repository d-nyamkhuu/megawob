/*
 * handle-text/editor: the shared editor window of handle-text/L1 (72 sites).
 * Scenarios: copy-paste, copy-paste-2, scroll-text, sign-agreement, spinner, unicode.
 * The reference edit/find paths remain live for callers that explicitly support them.
 * Frame, clipboard, selection, fields, scroll DOM and helpers are shared across the widgets.
 *
 * Source medoid: design-handle-text-spinner-12. TOKENS + BASE alone reproduce it exactly.
 * VARIANTS apply the recurring scenario changes before design. Empty designs reproduce:
 *   copy-paste: design-handle-text-copy-paste-01; copy-paste-2: design-handle-text-copy-paste-2-04;
 *   scroll-text: design-handle-text-scroll-text-01; sign-agreement: design-handle-text-sign-agreement-07;
 *   spinner: design-handle-text-spinner-01; unicode: design-handle-text-unicode-01.
 * The medoid opts out of the spinner preset with its original upSvg/downSvg and
 * spinnerWheel:false, spinnerPreview:false (11/12 spinners use the preset).
 * VARIANTS below lists every preset; README.md records counts and migration seams.
 *
 * Tokens (defaults before the single-scenario preset):
 *   avoidSubmit true: subtract overlapping submit rectangle from usable stage.
 *   emptyPlaceholder null: absent placeholder fallback; unicode uses one space.
 *   copyPlaceholder false: source-aware clipboard placeholder.
 *   denseSources Infinity: add dense-sources above this source count.
 *   sourceGrid false: set two grid columns above three sources after building.
 *   unicodeSample false: show the answer sample instead of the reference type hint.
 *   copyLineHeight false: fit first source lines in copy-paste-2.
 *   document false: printed rows, document heading, range counter and field cleanup.
 *   documentTitle 'Document: Partner Onboarding Guide (v1.4)': heading text.
 *   documentFieldLabel null: use the sampled label with one trailing colon.
 *   printMin 18, printMax 20.5, printDivisor 78: printed line-height fit.
 *   recordSeen false: also publish changed seen state when scroll is unchanged.
 *   agreementLook false: use --agreement-reserve (fallback 164) for row height.
 *   lineImportant false: important list height and fixed flex box.
 *   scrollArrows false: add the agreement's up/down arrow rail.
 *   forcePane false: reapply list height before final card sizing.
 *   signFieldLabel null: retain the sampled name-field label.
 *   signPlaceholder false: retain placeholder; null removes it, string replaces it.
 *   pendingResult false: toggle pending on the agreement result.
 *   directDecline false: Cancel can bypass the scroll gate in decline mode.
 *   signScrollMode 'plain': reference callbacks; 'position' ignores restoration echoes;
 *     'touched' ignores scroll before pointer/wheel/key interaction.
 *   deferSignRestore false: restore agreement scroll after final card sizing.
 *   unlockAtEnd false: publish an unchanged endpoint if the gate is still locked.
 *   upSvg UP_SVG, downSvg DN_SVG: original stroked arrow markup.
 *   spinnerWheel false: enable focused wheel stepping.
 *   spinnerPreview false: add preview and regroup label/hint.
 *   previewTitle 'Preview', previewSubtitle 'Sample text with the current font size.': labels.
 *   previewText 'The quick brown fox jumps over the lazy dog.': preview body.
 *   spinnerDescription 'Set the font size for the document text.': regrouped hint.
 *   dockAnswer false: move end control and visible instruction into answer row.
 *   endSelector '.submit': end control selected for answer docking.
 *   unicodeActions false: create the Unicode action row.
 *   unicodeControls '.submit,.clear-text': controls considered for that row.
 *
 * Parts: design.parts.name = (base, S) => replacement. All calls use resolved P.
 * S.st (get/set) is this page's episode state; S.ctx/spec/D/P are live getters.
 * Views have card, loc(target), sync(model), optional after()/dispose().
 * signScroll controllers have options, read(index,paint), initial(scrollBox), built(),
 * after(scrollBox,field), sync(scrollBox,model), dispose(). They keep policy state per render.
 * Keep every original rng draw in order; resultLine samples its Undo label. Extra draws
 * must use ctx.rng.fork(label). No DOM work runs in the template factory.
 *   ensureStyle() -> void; prepend the shared ut-style once
 *   fam() -> task definition (widget helpers under .helpers)
 *   live() -> bool; current card is connected
 *   isTextInput(el) -> bool; enabled writable text/search input or textarea
 *   up(patch) -> void; merge a patch into the current model
 *   liveSel() -> source selection or null; require a single source box
 *   sameSel(a, b) -> bool; compare source/field selection endpoints
 *   modelSel(selection) -> selection; adapt edit note selections
 *   copied(text) -> void; update page clipboard, log and mirror model
 *   onCopy(event) -> void; deterministic page copy/cut handler
 *   onPaste(event) -> void; paste page clipboard at the focused caret
 *   install() -> void; install page listeners once per factory instance
 *   usable(ctx) -> {x,y,w,h}; stageBox minus an overlapping end control
 *   caretPoint(input, index) -> [x,y]; measure a caret boundary
 *   frame(ctx, look, file, tag) -> {card,body}; editor window and title bar
 *   statusBar(card, util, items) -> element; append the status strip
 *   fieldRow(ctx, parent, field, inline, id, onInput, value) -> {row,input,api}; labeled textField
 *   resultLine(ctx, parent, onUndo) -> {set,locate}; result and sampled Undo label
 *   lineBox(ctx, parent, lines, opts) -> {box,list,lbx,...}; scrolling DOM
 *   scrollLoc(target, lbx, spec, list) -> point or null; pane/thumb/edge targets
 *   sourceBox(ctx, parent, source, index, onFocus, onSel) -> {text,sel}; scoped source selection
 *   buildCopy(ctx, look) -> view; clipboard boxes or Unicode text entry
 *   buildButtons(ctx, look) -> view; Unicode button test and result
 *   buildScroll(ctx, look) -> view; scrolling document with optional answer
 *   buildSign(ctx, look) -> view; agreement, name, actions and result
 *   buildSpinner(ctx, look) -> view; held stepping, editable value and status
 *   buildEdit(ctx, look) -> view; retained reference caret/cut/undo/paste-at path
 *   buildFind(ctx, look) -> view; retained reference pane/page phrase selection
 *   makeLook(rng, spec, box, squeeze) -> look; fixed editor layout and CSS variables
 *   stageBox(ctx) -> {x,y,w,h}; full ctx.size rectangle
 *   fieldInput(ctx, row, id) -> element; create a text input (replace for textarea)
 *   fieldCreated(ctx, field, definition, id) -> void; noop after binding textField
 *   sourceLines(ctx, text, source, index) -> void; noop before source line DOM
 *   sourceCreated(ctx, parent, source, index, {text,sel}) -> void; noop after selection binding
 *   sourceContainer(ctx, src, source, index) -> void; noop before source title
 *   copyBuilt(ctx, card, sources) -> void; noop after source/answer construction
 *   copyField(ctx, field, typed) -> void; optional source-aware paste placeholder
 *   typedSample(ctx, body, look) -> void; Unicode sample or reference hint
 *   lineHeight(spec, box) -> number; sampled row fit or document row fit
 *   lookMade(ctx, look, box) -> void; copy-2/agreement line-height presets
 *   lineLayout(ctx, box, list, opts) -> void; pane height and printed reading space
 *   lineRow(ctx, row, opts, index) -> void; optional printed row height
 *   linesCreated(ctx, box, list, indexedRows, opts) -> void; noop before scrollbar
 *   scrollbar(ctx, box, list, opts) -> scrollbar; optional arrow rail, thumb and pad
 *   lineApi(ctx, box, list, indexedRows, opts, scrollbar) -> {box,list,lbx,...}; bind listbox
 *   printLineHeight(ctx, look) -> number; clamp width / divisor between printMin/Max
 *   documentRange(ctx, holder, look) -> {printLh,visibleRows?,read,show,bind,sb?}; document count
 *   documentBound(ctx, scrollBox, range) -> void; noop before initial scroll restore
 *   documentAfter(ctx, scrollBox, range, look) -> void; noop after final geometry
 *   documentField(ctx, field) -> void; document label and placeholder cleanup
 *   signLook(ctx, look, card) -> void; noop before agreement heading
 *   signParent(ctx, body) -> element; body, replace to add a document/name pane
 *   signAcknowledgment(ctx, parent) -> void; noop between document and name field
 *   signCaption(ctx, body) -> void; noop between name field and actions
 *   signField(ctx, field) -> void; optional name label/placeholder
 *   signEnabled(ctx, model, key) -> bool; unlocked, or optional direct decline
 *   signPaint(ctx, body, model) -> void; optional pending result class
 *   signScroll(ctx, card, body, look) -> controller; reference/position/touched scroll policy
 *   spinnerInput(ctx, input, clamp, show) -> void; optional focused wheel stepping
 *   spinnerBuilt(ctx, body) -> void; noop before spinner status strip
 *   spinnerPreview(ctx, view) -> void; optional preview and regrouped label/hint
 *   beforeRender(ctx) -> void; noop, can dispose the previous S.st.view
 *   viewBuilt(ctx, view, look, box) -> void; optional dense grid/pane sizing before card sizing
 *   cardLayout(ctx, view, box) -> void; full-stage absolute card sizing
 *   rendered(ctx, view, look, box) -> void; preview/answer docking/Unicode actions before view.after
 *   unicodeControl(ctx, control) -> bool; true, filter controls moved into Unicode actions
 *   afterRender(ctx, view, look, box) -> void; noop after view.after and before anchors
 *   fitFlow(ctx, view) -> void; unicode button flow taller than the card goes to 2, then 3 columns
 *   renderResult(ctx, view) -> {anchors,sync}; card anchor and view sync
 *   build(ctx, look) -> view; dispatch through the resolved scenario builder
 */
(function () {
  'use strict';

  const UP_SVG = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.8L6 4.3l3.5 3.5"/></svg>';
  const DN_SVG = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4.2L6 7.7l3.5-3.5"/></svg>';
  const TOKENS = {
    avoidSubmit: true, emptyPlaceholder: null, copyPlaceholder: false, denseSources: Infinity,
    sourceGrid: false, unicodeSample: false, copyLineHeight: false,
    document: false, documentTitle: 'Document: Partner Onboarding Guide (v1.4)',
    documentFieldLabel: null, printMin: 18, printMax: 20.5, printDivisor: 78, recordSeen: false,
    agreementLook: false, lineImportant: false, scrollArrows: false, forcePane: false,
    signFieldLabel: null, signPlaceholder: false, pendingResult: false, directDecline: false,
    signScrollMode: 'plain', deferSignRestore: false, unlockAtEnd: false,
    upSvg: UP_SVG, downSvg: DN_SVG, spinnerWheel: false, spinnerPreview: false,
    previewTitle: 'Preview', previewSubtitle: 'Sample text with the current font size.',
    previewText: 'The quick brown fox jumps over the lazy dog.',
    spinnerDescription: 'Set the font size for the document text.',
    dockAnswer: false, endSelector: '.submit', unicodeActions: false, unicodeControls: '.submit,.clear-text',
  };
  const SCENARIOS = {
    'copy-paste': { copyPlaceholder: true, denseSources: 3, sourceGrid: true },
    'copy-paste-2': { copyLineHeight: true, dockAnswer: true },
    'scroll-text': { document: true, lineImportant: true, forcePane: true },
    'sign-agreement': {
      agreementLook: true, lineImportant: true, scrollArrows: true, forcePane: true,
      signFieldLabel: 'Full name:', signPlaceholder: null, pendingResult: true, signScrollMode: 'position',
    },
    spinner: {
      upSvg: '<svg viewBox="0 0 20 12" fill="currentColor"><path d="M0 12L10 0L20 12Z"/></svg>',
      downSvg: '<svg viewBox="0 0 20 12" fill="currentColor"><path d="M0 0L10 12L20 0Z"/></svg>',
      spinnerWheel: true, spinnerPreview: true,
    },
    unicode: { avoidSubmit: false, emptyPlaceholder: ' ', unicodeSample: true, unicodeActions: true },
  };

  env.template('handle-text/editor', (design, def) => {
    const CSS = env.templateLib('handle-text/_style').editorCSS;
    let D, P;
    const BASE = {};
    const S = {
      get CSS() { return CSS; },
      get measurer() { return measurer; },
      set measurer(value) { measurer = value; },
      get env() { return env; },
      get live() { return P.live; },
      get copied() { return P.copied; },
      get liveSel() { return P.liveSel; },
      get fam() { return P.fam; },
      get isTextInput() { return P.isTextInput; },
      get installed() { return installed; },
      set installed(value) { installed = value; },
      get onCopy() { return P.onCopy; },
      get onPaste() { return P.onPaste; },
      get modelSel() { return P.modelSel; },
      get sameSel() { return P.sameSel; },
      get frame() { return P.frame; },
      get resultLine() { return P.resultLine; },
      get statusBar() { return P.statusBar; },
      get sourceBox() { return P.sourceBox; },
      get fieldRow() { return P.fieldRow; },
      get caretPoint() { return P.caretPoint; },
      ofEpisode: (ctx, fn) => fn,
      get st() { return st; },
      set st(value) { st = value; },
      get ctx() { return st?.ctx; },
      get spec() { return st?.ctx.spec; },
      get D() { return D; },
      get P() { return P; },
    };
    // Live episode state; the document listeners below outlive reset() and serve whatever is connected.
    let st = null;
    let installed = false;
    let measurer = null;

    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').clipboardParts(S));

    // ---------------------------------------------------------------- geometry helpers

    // Usable part of the stage (stage-local px): the stage minus a floating end control inside it.
    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').geometryParts(S));

    // Scrolling line box: fixed-height lines, a custom scrollbar (or the native one), bound by env.ui.listbox.
    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').sourcesParts(S));

    // ---------------------------------------------------------------- copy tasks (and unicode 'type')

    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').copyParts(S));

    // ---------------------------------------------------------------- scroll-text

    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').scrollParts(S));

    // ---------------------------------------------------------------- sign-agreement

    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').agreementParts(S));

    // ---------------------------------------------------------------- spinner

    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').spinnerParts(S));

    // ---------------------------------------------------------------- edit (caret, cut, undo, paste-at)

    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').editingParts(S));

    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').fieldsParts(S));
    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').linesParts(S));
    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').signingParts(S));
    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').previewParts(S));
    Object.assign(BASE, env.templateLib('handle-text/_editor-parts').renderingParts(S));

    ({ D, P } = env.templateDesign('handle-text/editor', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
      render(ctx) {
        P.beforeRender(ctx);
        P.ensureStyle();
        P.install();
        const box = P.usable(ctx);
        const look = P.makeLook(ctx.rng, ctx.spec, box, 0);
        P.lookMade(ctx, look, box);
        st = { ctx, clip: null, sels: null, field: null, copyModel: false, maxW: box.w - 60, pageW: box.w };
        const view = P.build(ctx, look);
        st.card = view.card;
        st.view = view;
        P.viewBuilt(ctx, view, look, box);
        if (st.copyModel && ctx.model.clip !== null && ctx.model.clip !== undefined) st.clip = ctx.model.clip;
        P.cardLayout(ctx, view, box);
        P.rendered(ctx, view, look, box);
        if (view.after) view.after();
        P.afterRender(ctx, view, look, box);
        P.fitFlow(ctx, view);
        return P.renderResult(ctx, view);
      },
      locate(t) {
        const p = st && st.view && st.view.loc(t);
        if (!p) throw new Error(`handle-text/editor cannot locate ${JSON.stringify(t)}`);
        return p;
      },
    };
  }, { uses: ["handle-text/_editor-parts","handle-text/_style","handle-text/_clipboard","handle-text/_frame","handle-text/_views"] });
})();
