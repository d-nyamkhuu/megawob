/*
 * choose-option/widgets: a form card with the widget of the widget's scenario: native checkbox/radio choices, a DOM select
 * with an all-options popup (dropdown), a text input with task-clock suggestions (autocomplete), or a listbox with a
 * custom scrollbar in the reference card (listbox).
 * Scenarios, and the site design: {} reproduces with the scenario's preset: checkbox design-choose-option-checkbox-11 (the
 * lineage medoid), radio design-choose-option-radio-01, dropdown design-choose-option-dropdown-01, autocomplete
 * design-choose-option-autocomplete-01, listbox design-choose-option-listbox-11. See VARIATIONS.md for the 60-site inventory.
 * Tokens (default before the preset):
 *   Card: cardClass = 'fp-card'; cardWidth = true (width: stage width minus 60px, minimum 240px); radius = '3px' and
 *   controlRadius = '2px' (card and control radii); titleTag = 'div' (null omits the title); titleClass = 'fp-title';
 *   titleText = null (null uses spec.title); note = true (draw spec.note); fieldClass = 'fp-field';
 *   compact = false (add .compact when the card is taller than the stage minus 24px); freeze = true (freeze the card
 *   height); scale = true (scale an overflowing card); scaleBeforeLayout = false (scale before the widget's
 *   align-layout/show); scaleInset = 10 (height reserved below the card, px).
 *   Choices (checkbox, radio): choiceFlow = null (grid-auto-flow; null leaves CSS alone); choiceRows = null (fixed
 *   column count for the grid rows; null omits rows); choiceRowsVar = null (CSS custom property receiving
 *   ceil(count / choiceRowsDivisor)); choiceRowsDivisor = 3; clearSelector = null (existing clear button to bind);
 *   detailTable = {} and detailFallback = null (option details when spec has none).
 *   Radio: emailHeader = false (email heading instead of title/note); emailTitle = 'Email Preferences';
 *   emailNote = 'Select how often ... at any time.' (introductory paragraph); emailContent = false (add the email
 *   content checkboxes); emailContentTitle = 'Email content:'; emailOptions = ['University news', 'Events and
 *   activities', 'Alumni stories'] (decorative checkbox labels); resetSelector = null (existing reset button);
 *   optionCount = false (mirror the option count to card.dataset.options).
 *   Dropdown: chevron = CHEV (trigger SVG); rowMaxExtra = 0 (added to the sampled maximum row height);
 *   revealOptions = false (reveal active/located rows in a scrolling popup); details = false (description and
 *   attachments aside); motif = false (title input instead of the title, plus decoy fields); motifTitle = 'Title:'
 *   and motifValue = 'Update user guide' (title input); motifFields = [['Priority:', 'Medium'], ['Due Date:',
 *   'Apr 24, 1991'], ['Status:', 'In Progress']] (decoy label/value pairs).
 *   Autocomplete: searchSvg = SEARCH and okSvg = OK (input and committed icons); marker = false (Trip Details
 *   marker); travelExtra = false (travel dates and travelers section); suggestionColumns = false (fit suggestions
 *   into one or two columns).
 *   Listbox: sampleRows = true (draw rng.int(30, 34); false matches meeting-01, which draws none); syncScroll = true
 *   (reapply the model scroll in show); scrollPad = 2 (scrollbar padding, px; null uses max(20, stage width * .061));
 *   minThumb = 28; keyboard = false (list keyboard input); railClass = 'fp-rail' (scrollbar wrapper; null puts the
 *   track in the list frame); arrows = true (arrow buttons); arrowClass = 'fp-arrow'; arrowUp = '⌃';
 *   arrowDown = '⌄'; arrowStep = 'row' (row: a row's offsetHeight; geometry: rowH); stopArrows = false (stop arrow
 *   pointerdown/click propagation); integralRows = false (integer row/list CSS properties from the frame height);
 *   emptyText = 'Nothing selected'; rowBox = false (empty selection box for single selection too).
 * Presets (VARIANTS): checkbox none; radio { emailHeader: true, emailContent: true, resetSelector: '.ds-reset',
 *   optionCount: true, scaleBeforeLayout: true, scaleInset: 8 }; dropdown { details: true, motif: true,
 *   scaleBeforeLayout: true, scaleInset: 8 }; autocomplete { marker: true, titleTag: 'h3', titleClass:
 *   'ds-destination-title', titleText: 'Destination', travelExtra: true, suggestionColumns: true, scale: false };
 *   listbox { compact: true, syncScroll: false, integralRows: true }.
 * Parts (all calls go through P; overrides are (base, S) => replacement):
 *   begin(ctx): before the card; P.marker, then P.details.
 *   layout(ctx) -> {wrap, card, field}: P.wrap, P.card, P.heading, P.field.
 *   wrap(ctx) -> el: fp-wrap in the stage.
 *   card(ctx, wrap) -> el: create and size the card (listbox: the reference card with sampled radii and width).
 *   heading(ctx, card): email header, or P.motifTitle or the title, then the note.
 *   field(ctx, card) -> el: create the field and call P.label.
 *   label(ctx, field) -> el: spec.label (listbox: with a sampled caps draw).
 *   decorated(ctx, card, field, wrap): after the widget; P.motifFields, P.emailContent, the option count,
 *   P.travelExtra.
 *   freeze(ctx, card): compact and freeze its height.
 *   scale(ctx, card): fit its height, retaining layout order (not on listbox).
 *   ready(ctx, card): after scale (before the layout when scaleBeforeLayout); bind resetSelector. Listbox:
 *   ready(ctx, controls) at the end of build instead (nothing).
 *   place(ctx, card): listbox only, after freeze: sampled reference placement.
 *   rendered(ctx, card, field, wrap): after align-layout/show/scale (nothing).
 *   locate(target) -> [x,y]: delegate to the widget; throw on a missing target.
 *   build(field, ctx): build the scenario's widget, install st.show/st.loc/st.layout.
 *   Choices: choiceGrid(ctx, group, n, cols): flow/row styles after grid columns; choiceBeforeText(ctx, label,
 *   input, option, index): before the option text (nothing); choiceDetail(ctx, option) -> text: spec detail, then
 *   the token table/fallback; choicesReady(ctx, controls): before the first show, bind clearSelector;
 *   choicesShown(ctx, controls): after the classes update (nothing); emailContent(ctx, card): email checkboxes.
 *   Controls: { group, inputs, labels, ch, show, set }.
 *   Dropdown: select(parent, ctx, options) -> controller: DOM dropdown, keeps the rowMax draw;
 *   selectLayout(ctx, controls): rows/columns within the stage, controls { rows, trigger, pop, rowMax, dd };
 *   option(ctx, row, value, index): option label after the tick; reveal(ctx, controls, value): scroll an option
 *   into view (revealOptions); details(ctx): description/attachments aside; motifTitle(ctx, card): title input;
 *   motifFields(ctx, card): decoy inputs.
 *   Autocomplete: marker(ctx): Trip Details marker; travelExtra(ctx, card, field, wrap): travel dates and
 *   travelers; autocompleteInput(ctx, controls): after the input, before the OK icon; autocompleteControl(ctx,
 *   controls): after the popup, before the status; autocompletePainted(ctx, controls, model): after a controller
 *   paint change; autocompleteShown(ctx, controls, model): after the committed class update;
 *   autocompleteReady(ctx, controls): before the first show (these five: nothing); suggestions(ctx, controls):
 *   after every paint, columns of 28px or single rows of 36px. Controls gain { box, ctl, input, pop, ac, show,
 *   status, rowH } in construction order.
 *   Listbox: geometry(ctx, controls, sampledRowH) -> {rowH, H, border}: sampled rows and 2px border;
 *   list(ctx, controls) -> el: fp-list of the geometry height; row(ctx, controls, option, index) -> el: selection
 *   box, decoration, text; rowDecoration(ctx, controls, row, option, index): before the row text (nothing);
 *   rowsDone(ctx, controls): after the last row's border removal (nothing); rail(ctx, controls) -> {track, thumb,
 *   up?, down?}: track/thumb and optional arrows; status(ctx, controls) -> el; prepare(ctx, controls): before the
 *   controller, optional whole-pixel CSS geometry; scrollOptions(ctx, controls) -> pad/minThumb/onDrag;
 *   mirror(ctx, controls, physicalIndex): round and mirror the scroll index into the model; toPhysical(ctx,
 *   controls, logicalIndex) -> number: identity; wheelScale(ctx, controls) -> 1; wheel(ctx, controls): bind the
 *   wheel, refresh and mirror; arrowsReady(ctx, controls): bind the arrow clicks; controllerReady(ctx, controls):
 *   after the controller, before the wheel (nothing); values(ctx, controls, model): set the selected values, and
 *   the scroll when syncScroll; shown(ctx, controls, model): after the selection/status update (nothing);
 *   measured(ctx, controls): row pitch into model.px. Controls gain { field, initialScroll, lb, rowH, H, border,
 *   list, rows, track, thumb, up, down, status, mirror, lbx, show } in construction order.
 * S.ctx/spec/st read the live episode; S.els holds wrap/card/field and the widget's controls (autocomplete: spread
 * into S.els; listbox: S.els.controls); S.D/P are resolved.
 * Keep every rng draw in order. Extra decoration randomness must use ctx.rng.fork(label).
 */
(function () {
  'use strict';

  env.template('choose-option/widgets', (design, def) => {
    const { CSS, CHEV, TICK, SEARCH, OK, BOXTICK, ensureStyle, center, req, TOKENS, SCENARIOS } = env.templateLib('choose-option/_widgets-data');
    const V = def.scenarios[0];
    let D, P;
    let st;
    const els = {};
    const BASE = {};
    const S = {
      get ctx() {
        return st && st.ctx;
      },
      get spec() {
        return st && st.spec;
      },
      get st() {
        return st;
      },
      get D() {
        return D;
      },
      get P() {
        return P;
      },
      els,
    };
    const set = (patch) => st.ctx.update({ ...st.ctx.model, ...patch });
    let buildChoices, buildDropdown, buildAutocomplete, buildListbox;
    const scopeRef = {
      get V() { return V; },
      get D() { return D; },
      get P() { return P; },
      get st() { return st; },
      get els() { return els; },
      get BASE() { return BASE; },
      get S() { return S; },
      get set() { return set; },
      get CSS() { return CSS; },
      get CHEV() { return CHEV; },
      get TICK() { return TICK; },
      get SEARCH() { return SEARCH; },
      get OK() { return OK; },
      get BOXTICK() { return BOXTICK; },
      get ensureStyle() { return ensureStyle; },
      get center() { return center; },
      get req() { return req; },
      get TOKENS() { return TOKENS; },
      get SCENARIOS() { return SCENARIOS; },
      get buildChoices() { return buildChoices; }, set buildChoices(v) { buildChoices = v; },
      get buildDropdown() { return buildDropdown; }, set buildDropdown(v) { buildDropdown = v; },
      get buildAutocomplete() { return buildAutocomplete; }, set buildAutocomplete(v) { buildAutocomplete = v; },
      get buildListbox() { return buildListbox; }, set buildListbox(v) { buildListbox = v; },
    };


    // The card: each scenario's decorations are parts that do nothing unless their token is on.
    env.templateLib('choose-option/_widgets-frame').install(scopeRef);

    // Choices (checkbox, radio): native inputs in a grid of rows or tiles.
    env.templateLib('choose-option/_widgets-choices').install(scopeRef);

    // Dropdown: a trigger and an all-options popup that fits its columns to the stage.
    env.templateLib('choose-option/_widgets-select').install(scopeRef);

    // Autocomplete: a text input whose suggestions follow the task clock (spec.latency).
    env.templateLib('choose-option/_widgets-autocomplete').install(scopeRef);

    // Listbox: rows in a scrolling frame with a custom scrollbar (and optional arrows), mirrored into model.scroll.
    env.templateLib('choose-option/_widgets-listbox').install(scopeRef);

    BASE.build = {
      checkbox: buildChoices,
      radio: buildChoices,
      dropdown: buildDropdown,
      autocomplete: buildAutocomplete,
      listbox: buildListbox,
    }[V];

    ({ D, P } = env.templateDesign('choose-option/widgets', design, def, {
      tokens: TOKENS,
      scenarios: SCENARIOS,
      base: BASE,
      state: S,
    }));
    // After freeze the listbox places its card; the other widgets scale it, then call ready.
    const fit = (ctx, card) => {
      P.scale(ctx, card);
      P.ready(ctx, card);
    };
    return {
      render(ctx) {
        ensureStyle('fp-style', CSS);
        st = { ctx, spec: ctx.spec, alive: () => false };
        for (const key of Object.keys(els)) delete els[key];
        P.begin(ctx);
        const { wrap, card, field } = P.layout(ctx);
        Object.assign(els, { wrap, card, field });
        P.build(field, ctx);
        P.decorated(ctx, card, field, wrap);
        P.freeze(ctx, card);
        if (V === 'listbox') P.place(ctx, card);
        else if (D.scaleBeforeLayout) fit(ctx, card);
        if (st.layout) st.layout();
        st.show();
        if (V !== 'listbox' && !D.scaleBeforeLayout) fit(ctx, card);
        P.rendered(ctx, card, field, wrap);
        return { anchors: [card], sync: () => st.show() };
      },
      locate(t) {
        return P.locate(t);
      },
    };
  }, { uses: ['choose-option/_widgets-data', 'choose-option/_widgets-frame', 'choose-option/_widgets-choices', 'choose-option/_widgets-select', 'choose-option/_widgets-autocomplete', 'choose-option/_widgets-listbox'] });
})();
