// fill-form/base: the base site's fill-form widgets (document, wizard, viewer, erp, scan) as a template. This
// file is their source. The design-* sites that started from a copy of them, and the composite sites that embed them,
// are designs on it.
// A widget file with no widget name and design: {} registers every sub-widget (the base site's widgets/fill-form.js). A
// named widget gets the first sub-widget that serves its scenario, or with design: { widget: name } the sub-widget of that
// name.
// The reference code runs once per page with env.widget captured; scriptOf is the site's own widgets/fill-form.js (what
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
    const scriptOf = { src: new URL(`sites/${site}/widgets/fill-form.js`, HTML).href };
    /*
     * reference / fill-form / document: the source document (ID / contact / profile card, an email in a
     * mail-client or plain-text look, an invoice on paper or a monospace till receipt) and a compact web
     * form. Text and date fields are plain text inputs with a clear button that shows while they hold text;
     * the dropdown is a custom listbox (button + absolutely positioned list that opens downward, or upward
     * when there is no room; env.ui.dropdown); radios and checkboxes are native inputs with clickable labels
     * (env.ui.choices). The document side, document width, fonts and paper colors vary per seed; everything
     * is sized in em and the base font shrinks until both panels fit the stage.
     * scan: a manual document-intake workspace with a canvas-only scanned source, functional zoom,
     * pan and scroll controls, and an independently scrolling form. Source content has no DOM transcription.
     * New receipt / idcard / claim scenarios use this workspace on the document widget too. All widgets share
     * seeded batch queues, neighboring records, document provenance, notifications and review activity.
     * Icons are inline SVG; contextual records never add scored targets or reveal the active scan's values.
     * Page modes from spec.layout: tabs (document and form are two tabs of one card, stacked in the same grid
     * cell so switching never moves anything; env.ui.tabs), image (the document is drawn on a canvas with a
     * slight rotation and scan noise and shown as an <img>: no document text in the DOM), long (one-column
     * form taller than the viewport: the widget is scrollable and the page scrolls).
     */
    (function () {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get ICONS() { return ICONS; },
        get WORKSPACE_CSS() { return WORKSPACE_CSS; },
        get CSS() { return CSS; },
        get PAPERS() { return PAPERS; },
        get INVOICE_FONTS() { return INVOICE_FONTS; },
        get ensureStyle() { return ensureStyle; },
        get PERSON_SVG() { return PERSON_SVG; },
        get DOC_FONTS() { return DOC_FONTS; },
        get SCAN_CSS() { return SCAN_CSS; },
        get CSS2() { return CSS2; },
        get ensureStyle2() { return ensureStyle2; },
        get NEXT_LABELS() { return NEXT_LABELS; },
        get PDF_TITLES() { return PDF_TITLES; },
        get ERP_APPS() { return ERP_APPS; },
        get ERP_RIB() { return ERP_RIB; },
        get ERP_CHANGES() { return ERP_CHANGES; },
        get ERP_USERS() { return ERP_USERS; },
        get st() { return st; }, set st(v) { st = v; },
        get icon() { return icon; },
        get iconButton() { return iconButton; },
        get workspace() { return workspace; },
        get renderWorkspace() { return renderWorkspace; },
        get sectionOf() { return sectionOf; },
        get recordBar() { return recordBar; },
        get setField() { return setField; },
        get setOpen() { return setOpen; },
        get showList() { return showList; },
        get textField() { return textField; },
        get dropdownField() { return dropdownField; },
        get radioField() { return radioField; },
        get addField() { return addField; },
        get renderForm() { return renderForm; },
        get row() { return row; },
        get renderCard() { return renderCard; },
        get renderEmail() { return renderEmail; },
        get renderInvoice() { return renderInvoice; },
        get docBlocks() { return docBlocks; },
        get layoutDoc() { return layoutDoc; },
        get renderImage() { return renderImage; },
        get locateTarget() { return locateTarget; },
        get stageBox() { return stageBox; },
        get renderDoc() { return renderDoc; },
        get imageLook() { return imageLook; },
        get buildFrame() { return buildFrame; },
        get scanBitmap() { return scanBitmap; },
        get renderScan() { return renderScan; },
        get mirrorFocus() { return mirrorFocus; },
        get renderWizard() { return renderWizard; },
        get renderViewer() { return renderViewer; },
        get renderErp() { return renderErp; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      scopeNow = __scope;
      if (__has('icon')) icon = __parts['icon'](icon, __scope);
      if (__has('iconButton')) iconButton = __parts['iconButton'](iconButton, __scope);
      if (__has('workspace')) workspace = __parts['workspace'](workspace, __scope);
      if (__has('renderWorkspace')) renderWorkspace = __parts['renderWorkspace'](renderWorkspace, __scope);
      if (__has('sectionOf')) sectionOf = __parts['sectionOf'](sectionOf, __scope);
      if (__has('recordBar')) recordBar = __parts['recordBar'](recordBar, __scope);
      if (__has('setField')) setField = __parts['setField'](setField, __scope);
      if (__has('setOpen')) setOpen = __parts['setOpen'](setOpen, __scope);
      if (__has('showList')) showList = __parts['showList'](showList, __scope);
      if (__has('textField')) textField = __parts['textField'](textField, __scope);
      if (__has('dropdownField')) dropdownField = __parts['dropdownField'](dropdownField, __scope);
      if (__has('radioField')) radioField = __parts['radioField'](radioField, __scope);
      if (__has('addField')) addField = __parts['addField'](addField, __scope);
      if (__has('renderForm')) renderForm = __parts['renderForm'](renderForm, __scope);
      if (__has('row')) row = __parts['row'](row, __scope);
      if (__has('renderCard')) renderCard = __parts['renderCard'](renderCard, __scope);
      if (__has('renderEmail')) renderEmail = __parts['renderEmail'](renderEmail, __scope);
      if (__has('renderInvoice')) renderInvoice = __parts['renderInvoice'](renderInvoice, __scope);
      if (__has('docBlocks')) docBlocks = __parts['docBlocks'](docBlocks, __scope);
      if (__has('layoutDoc')) layoutDoc = __parts['layoutDoc'](layoutDoc, __scope);
      if (__has('renderImage')) renderImage = __parts['renderImage'](renderImage, __scope);
      if (__has('locateTarget')) locateTarget = __parts['locateTarget'](locateTarget, __scope);
      if (__has('stageBox')) stageBox = __parts['stageBox'](stageBox, __scope);
      if (__has('renderDoc')) renderDoc = __parts['renderDoc'](renderDoc, __scope);
      if (__has('imageLook')) imageLook = __parts['imageLook'](imageLook, __scope);
      if (__has('buildFrame')) buildFrame = __parts['buildFrame'](buildFrame, __scope);
      if (__has('scanBitmap')) scanBitmap = __parts['scanBitmap'](scanBitmap, __scope);
      if (__has('renderScan')) renderScan = __parts['renderScan'](renderScan, __scope);
      if (__has('mirrorFocus')) mirrorFocus = __parts['mirrorFocus'](mirrorFocus, __scope);
      if (__has('renderWizard')) renderWizard = __parts['renderWizard'](renderWizard, __scope);
      if (__has('renderViewer')) renderViewer = __parts['renderViewer'](renderViewer, __scope);
      if (__has('renderErp')) renderErp = __parts['renderErp'](renderErp, __scope);

      // Product frame shared by all reference fill-form workflows. Queue records, provenance and activity
      // are seeded context, never another goal or a transcription of the active source document.
      const ICONS = __has('ICONS') ? __parts['ICONS'](undefined, __scope) : (env.templateLib('fill-form/_assets').ICONS);
      function icon(util, parent, name) {
        return env.templateLib('fill-form/_workspace').icon(__scope, util, parent, name);
      }
      function iconButton(util, parent, name, label, text = '') {
        return env.templateLib('fill-form/_workspace').iconButton(__scope, util, parent, name, label, text);
      }
      const WORKSPACE_CSS = __has('WORKSPACE_CSS') ? __parts['WORKSPACE_CSS'](undefined, __scope) : (env.templateLib('fill-form/_assets').WORKSPACE_CSS);

      function workspace(ctx, scan = false) {
        return env.templateLib('fill-form/_workspace').workspace(__scope, ctx, scan);
      }

      function renderWorkspace(ctx, render) {
        return env.templateLib('fill-form/_workspace').renderWorkspace(__scope, ctx, render);
      }

      function sectionOf(f) {
        return env.templateLib('fill-form/_workspace').sectionOf(__scope, f);
      }
      function recordBar(util, parent, text='Draft record') {
        return env.templateLib('fill-form/_workspace').recordBar(__scope, util, parent, text);
      }

      const CSS = __has('CSS') ? __parts['CSS'](undefined, __scope) : (env.templateLib('fill-form/_assets').CSS);

      const PAPERS = __has('PAPERS') ? __parts['PAPERS'](undefined, __scope) : (env.templateLib('fill-form/_assets').PAPERS);
      const INVOICE_FONTS = __has('INVOICE_FONTS') ? __parts['INVOICE_FONTS'](undefined, __scope) : (env.templateLib('fill-form/_assets').INVOICE_FONTS);

      let st = __has('st') ? __parts['st'](undefined, __scope) : (null); // live episode: { ctx, spec, el: { id: {...} }, root }

      const ensureStyle = __has('ensureStyle') ? __parts['ensureStyle'](undefined, __scope) : { ensureStyle: () => env.util.css('ff-style', CSS) }.ensureStyle;

      // ---------------------------------------------------------------- model updates

      function setField(id, value, open = null) {
        return env.templateLib('fill-form/_fields').setField(__scope, id, value, open);
      }

      function setOpen(id) {
        return env.templateLib('fill-form/_fields').setOpen(__scope, id);
      }

      // The widget's layout hook for env.ui.dropdown: show the list, and open it upward when it would leave
      // the viewport below the button.
      function showList(dd, btn, list, open) {
        return env.templateLib('fill-form/_fields').showList(__scope, dd, btn, list, open);
      }

      // ---------------------------------------------------------------- form

      function textField(util, wrap, f, value) {
        return env.templateLib('fill-form/_fields').textField(__scope, util, wrap, f, value);
      }

      function dropdownField(util, wrap, f, value) {
        return env.templateLib('fill-form/_fields').dropdownField(__scope, util, wrap, f, value);
      }

      function radioField(util, wrap, f, value) {
        return env.templateLib('fill-form/_fields').radioField(__scope, util, wrap, f, value);
      }

      // One field cell of the form grid (label + widget; checkboxes carry their own label). withErr adds a
      // reserved line under the widget for inline errors (the wizard).
      function addField(util, grid, f, v, withErr) {
        return env.templateLib('fill-form/_fields').addField(__scope, util, grid, f, v, withErr);
      }

      function renderForm(util, pane, spec, model, rng) {
        return env.templateLib('fill-form/_fields').renderForm(__scope, util, pane, spec, model, rng);
      }

      // ---------------------------------------------------------------- documents

      const PERSON_SVG = __has('PERSON_SVG') ? __parts['PERSON_SVG'](undefined, __scope) : (env.templateLib('fill-form/_assets').PERSON_SVG);

      function row(util, parent, label, value, cls = 'ff-row') {
        return env.templateLib('fill-form/_documents').row(__scope, util, parent, label, value, cls);
      }

      function renderCard(util, pane, d, rng) {
        return env.templateLib('fill-form/_documents').renderCard(__scope, util, pane, d, rng);
      }

      function renderEmail(util, pane, d, rng) {
        return env.templateLib('fill-form/_documents').renderEmail(__scope, util, pane, d, rng);
      }

      function renderInvoice(util, pane, d, rng) {
        return env.templateLib('fill-form/_documents').renderInvoice(__scope, util, pane, d, rng);
      }

      // ---------------------------------------------------------------- document as an image (canvas)

      const DOC_FONTS = __has('DOC_FONTS') ? __parts['DOC_FONTS'](undefined, __scope) : (env.templateLib('fill-form/_assets').DOC_FONTS);

      // The document as a list of simple blocks the canvas layout understands.
      function docBlocks(d) {
        return env.templateLib('fill-form/_documents').docBlocks(__scope, d);
      }

      function layoutDoc(c, blocks, W, F, fam, ink) {
        return env.templateLib('fill-form/_documents').layoutDoc(__scope, c, blocks, W, F, fam, ink);
      }

      // Draw the document onto a canvas: paper, a slight rotation, faint scan noise. Deterministic (seeded).
      function renderImage(util, pane, d, rng, W, maxH, look) {
        return env.templateLib('fill-form/_documents').renderImage(__scope, util, pane, d, rng, W, maxH, look);
      }

      // ---------------------------------------------------------------- widgets

      // Plan targets shared by every widget of this file (the widget-specific ones are handled before it is called).
      function locateTarget(t, widget) {
        return env.templateLib('fill-form/_frame').locateTarget(__scope, t, widget);
      }


      // The stage box. A scrollable page's stage can shrink to its content (flex: none) and report width 0
      // before anything is drawn; then measure the free space of its row and draw into a host of that width.
      function stageBox(ctx) {
        return env.templateLib('fill-form/_frame').stageBox(__scope, ctx);
      }

      function renderDoc(util, pane, d, rng) {
        return env.templateLib('fill-form/_documents').renderDoc(__scope, util, pane, d, rng);
      }

      // The look of a document drawn as an image (canvas): fonts and paper per seed.
      function imageLook(rng, d, receipt, ink) {
        return env.templateLib('fill-form/_documents').imageLook(__scope, rng, d, receipt, ink);
      }

      // The page of the document widget and of the wizard widget: document and form side by side, or as two tabs
      // (layout.tabs), the document as DOM or as an image, sized from the stage. formBuilder(host, rng) draws
      // the form into host (the form pane, or the inner box of the form tab).
      function buildFrame(ctx, formBuilder) {
        return env.templateLib('fill-form/_frame').buildFrame(__scope, ctx, formBuilder);
      }

      env.widget({
        task: 'fill-form',
        site: 'base',
        name: 'document',
        split: 'train',
        scenarios: ['card', 'email', 'invoice', 'fix', 'receipt', 'idcard', 'claim'],
        scrollable: (spec) => !!(spec.layout && spec.layout.long),

        render: (ctx) => ctx.spec.layout.scan ? renderScan(ctx) : renderWorkspace(ctx, (child) => buildFrame(child, (host, rng) => renderForm(child.util, host, child.spec, child.model, rng))),

        locate: (t) => locateTarget(t, 'document'),
      });
      // ================================================================ scan intake workspace
      // The original document widget delegates only new scanned scenarios here. Its existing scenarios retain
      // their renderer. The scan widget always paints the source, including legacy invoices, onto a bitmap.
      const SCAN_CSS = __has('SCAN_CSS') ? __parts['SCAN_CSS'](undefined, __scope) : (env.templateLib('fill-form/_assets').SCAN_CSS);

      function scanBitmap(ctx, parent) {
        return env.templateLib('fill-form/_scan').scanBitmap(__scope, ctx, parent);
      }

      function renderScan(ctx) {
        return env.templateLib('fill-form/_scan').renderScan(__scope, ctx);
      }

      env.widget({ task:'fill-form', site:'base', name:'scan', split:'train',
        scenarios:['invoice','receipt','idcard','claim'], traits:{pdf:true}, render:renderScan,
        locate:(t) => locateTarget(t,'scan') });

      // ================================================================ wizard, viewer and erp widgets

      const CSS2 = __has('CSS2') ? __parts['CSS2'](undefined, __scope) : (env.templateLib('fill-form/_assets').CSS2);

      const ensureStyle2 = __has('ensureStyle2') ? __parts['ensureStyle2'](undefined, __scope) : { ensureStyle2: () => env.util.css('ff-style2', CSS2) }.ensureStyle2;

      // traits.keys: mirror the focused field (text / date input, checkbox, radio group, dropdown button) into model.focus.
      function mirrorFocus(root) {
        return env.templateLib('fill-form/_fields').mirrorFocus(__scope, root);
      }

      // ---------------------------------------------------------------- wizard

      const NEXT_LABELS = __has('NEXT_LABELS') ? __parts['NEXT_LABELS'](undefined, __scope) : (env.templateLib('fill-form/_assets').NEXT_LABELS);

      function renderWizard(ctx, host, rng) {
        return env.templateLib('fill-form/_modes').renderWizard(__scope, ctx, host, rng);
      }

      env.widget({
        task: 'fill-form',
        site: 'base',
        name: 'wizard',
        split: 'train',
        scenarios: ['card', 'email', 'invoice', 'fix'],
        traits: { wizard: true, keys: true },

        render(ctx) {
          const r = renderWorkspace(ctx, (child) => buildFrame(child, (host, rng) => renderWizard(child, host, rng)));
          mirrorFocus(st.root);
          return r;
        },
        locate: (t) => locateTarget(t, 'wizard'),
      });

      // ---------------------------------------------------------------- viewer (the document in a PDF pane)

      const PDF_TITLES = __has('PDF_TITLES') ? __parts['PDF_TITLES'](undefined, __scope) : (env.templateLib('fill-form/_assets').PDF_TITLES);

      function renderViewer(ctx) {
        return env.templateLib('fill-form/_modes').renderViewer(__scope, ctx);
      }

      env.widget({
        task: 'fill-form',
        site: 'base',
        name: 'viewer',
        split: 'train',
        scenarios: ['card', 'email', 'invoice', 'fix'],
        traits: { pdf: true, keys: true },
        render: (ctx) => renderWorkspace(ctx, renderViewer),
        locate: (t) => locateTarget(t, 'viewer'),
      });

      // ---------------------------------------------------------------- erp (dense enterprise form)

      const ERP_APPS = __has('ERP_APPS') ? __parts['ERP_APPS'](undefined, __scope) : (env.templateLib('fill-form/_assets').ERP_APPS);
      const ERP_RIB = __has('ERP_RIB') ? __parts['ERP_RIB'](undefined, __scope) : (env.templateLib('fill-form/_assets').ERP_RIB);
      const ERP_CHANGES = __has('ERP_CHANGES') ? __parts['ERP_CHANGES'](undefined, __scope) : (env.templateLib('fill-form/_assets').ERP_CHANGES);
      const ERP_USERS = __has('ERP_USERS') ? __parts['ERP_USERS'](undefined, __scope) : (env.templateLib('fill-form/_assets').ERP_USERS);

      function renderErp(ctx) {
        return env.templateLib('fill-form/_modes').renderErp(__scope, ctx);
      }

      env.widget({
        task: 'fill-form',
        site: 'base',
        name: 'erp',
        split: 'train',
        scenarios: ['card', 'email', 'invoice', 'fix'],
        traits: { dense: true, keys: true },
        render: (ctx) => renderWorkspace(ctx, renderErp),
        locate: (t) => locateTarget(t, 'erp'),
      });
    })();

    return captured;
  }
  env.template('fill-form/base', (design, def) => {
    const keys = Object.keys(design || {}).filter((k) => k !== 'widget' && k !== 'parts');
    if (keys.length) throw new Error(`fill-form/base takes no design keys but widget and parts (got ${keys.join(', ')})`);
    const O = (design && design.parts) || {};
    if (widgets && parts !== O && (Object.keys(O).length || Object.keys(parts).length)) throw new Error('fill-form/base: two designs with parts on one page');
    if (!widgets) { parts = O; widgets = reference(def.site, O); }
    for (const k of Object.keys(O)) {
      const dot = k.indexOf('.');
      if (!UNITS.has(k) && !/^\+\d+\.[\w$]+$/.test(k) && !(dot > 0 && !k.startsWith('stmt') && widgets.some((d) => d.name === k.slice(0, dot)))) throw new Error(`fill-form/base: unknown part '${k}'`);
    }
    if (!def.name && !(design && design.widget)) return widgets;
    const scenario = (def.scenarios || [])[0];
    const widget = design && design.widget ? widgets.find((d) => d.name === design.widget)
      : widgets.find((d) => (d.scenarios || []).includes(scenario));
    if (!widget) throw new Error(`fill-form/base: no base widget ${design && design.widget ? `named '${design.widget}'` : `serves scenario '${scenario}'`}`);
    return widget;
  }, { uses: ["fill-form/_assets","fill-form/_workspace","fill-form/_fields","fill-form/_documents","fill-form/_frame","fill-form/_scan","fill-form/_modes"] });
})();
