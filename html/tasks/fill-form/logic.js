/*
 * fill-form: copy the values from a document on the page into a web form.
 * "document-to-form lite". The page shows a source document and a web form; the agent copies
 * the values from the document into the form, leaves fields blank when the document does not contain
 * them, and finishes. MiniWoB counterparts: form-sequence*, multi-layouts, multi-orderings, book-flight.
 * Reward design: per-field
 * exact match after normalization, with blank-gold fields as the false-positive check.
 *
 * scenarios
 *   card     a profile / contact / ID card with labeled values (labels may be synonyms of the form's:
 *            "Surname" vs "Last name"; the name may be a heading or "Smith, Jane"; ID cards print the
 *            height in feet and inches while the form wants centimetres)
 *   email    a short registration email; the values are embedded in prose, header and signature (the
 *            number of nights must be computed from the arrival and departure dates; a 12-hour arrival
 *            time must be typed in 24-hour form)
 *   invoice  an invoice or a till receipt: header block, line-item table, subtotal / tax / total; the
 *            total quantity is a sum of the lines; in compute mode the document has no totals (an order
 *            confirmation / packing slip) and the form's total is the sum of the line amounts
 *   fix      (new scenario; not used by design-* sites) a prefilled form in which exactly one field disagrees
 *            with the document (a near miss: one letter or digit off, a date a few days out, another option,
 *            a flipped checkbox; never a format scenario of the right value, never a blank-gold, computed
 *            field). The document is a card, an email or an invoice (spec.base, from rng.fork('fix')).
 *            spec.fix = { id, value, kind, mode }: mode 'anon' ("fix the field that doesn't match the
 *            document") or 'kind' ("fix the date field", only when no other field of the form has that
 *            kind: never ambiguous). Every start mode except solved starts with the gold form plus that one
 *            wrong value (error 1/n).
 *
 *   receipt  scanned thermal receipt, line items and payment details; copy into an expense record.
 *   idcard   scanned fictional civic identity card, portrait, identity and validity fields.
 *   claim    scanned insurance loss notice, handwritten incident details and estimated loss.
 *            These three scenarios always use the scan workspace; invoice also uses it on the scan widget.
 *            opts.level selects 4 / 6 / 8 fields; opts.ood adds a field and a longer source document.
 * Hooks: facts(model, spec) reports 2-4 entered field values with their visible form labels.
 *        silent(next, prev, spec, rng) truncates a newly corrected text field; repeating the edit repairs it.
 *        retarget(spec, model, rng) requests withholding one entered field, using the same source document.
 *        parts(model, spec) preempt=cancel: each form field by its label with the value entered.
 *        judgeModes ambiguous / impossible apply to all scanned scenarios as to the existing scenarios. spec.judge:
 *          ambiguous   the usual copy-the-document instruction plus a sentence giving two values for one field
 *                      ("The phone is X or Y."; X is what the document says, Y a new value); the reply asks (status
 *                      ask) with one option per value (cands: [[X], [Y]]; others: the document's other values, never offered)
 *          impossible  "Set the fax number to ..." (a field the form lacks) or a value that is not an option of a
 *                      dropdown / radio; status impossible, what names the field or the value (spec.judge.what)
 * Scan UI model: scanForm { top, view, max, pos: { id: [top, bottom] } } mirrors the inner form pane;
 * plan target { scanForm: true } scrolls it before typing. model.pdf mirrors the scanned source pane.
 *
 * Page modes (spec.layout, sampled per episode; every widget of this task must support them):
 *   tabs     (25%) the document and the form are two tabs of the page; only one is visible at a time
 *            (partial observability: switch back and forth). model.tab / model.seen track it.
 *   image    (30%) the document is drawn as an image (canvas text, slight rotation, scan noise): it is not
 *            in the DOM / accessibility tree and must be read from pixels.
 *   long     (20%, always with ood) 8-11 fields in one column: the page scrolls (scrollable widget).
 *
 * Opt-in modes (only when the widget declares the trait in its traits object; drawn from rng.fork('form-x')
 * after the legacy draws, so widgets without traits - the 36 design-fill-form-* design widgets - get exactly the
 * spec, model and plan they always had). A trait is true (always) or a probability.
 *   traits.wizard  layout.wizard = { steps: [{ cat, title, ids[] }] }: a multi-step form (2-4 steps of
 *                  related fields, then a review page with every value). Next validates the step: a
 *                  required field left blank or a value in the wrong format (field.check: 'digits' |
 *                  'number' | 'amount' | 'date' | 'time' | 'email') shows inline errors and stays on the
 *                  step; it does not check values against the document. Back / Edit go back. Fields get
 *                  required (bool) and check. long and pdf are off. model.step (0..steps.length, the last
 *                  index is the review page), model.errors { id: 'required' | 'format' }.
 *   traits.pdf     layout.pdf = { route, cover, zoom, file, filler, note }: the document sits in a PDF-viewer
 *                  pane (pages on a grey background, toolbar, page x of y, zoom) with its own scrollbar; a
 *                  cover sheet ('cover'), a cover note on page 1 ('letter') or nothing ('none') comes first
 *                  and a terms page (filler) may follow, so values may sit below the pane's fold. tabs and
 *                  long are off; 'wheel' joins the inputs. The widget mirrors model.pdf = { top, view, max,
 *                  seen, pos: { fieldId: y } } (scroll offset, pane height, scroll range, the lowest
 *                  document y shown so far, and where each field's source ends in document px; values the
 *                  widget cannot pin down map to the end of the document).
 *   traits.dense   layout.dense (ERP): 10-14 fields (2-4 blank-gold), cols 3, layout.mainLabel and
 *                  layout.decoys (3-5 labels of tabs that show unrelated panes); 25% of non-tabs episodes
 *                  start on a decoy tab (layout.startTab 'x<i>'); model.tab is then 'x<i>' until the form
 *                  tab is clicked. long is off.
 *   traits.keys    the widget mirrors the focused field into model.focus (text / date input, checkbox or
 *                  radio group id) and lets Tab / Space / arrow keys / Enter work natively: spec.keys (50%)
 *                  makes the oracle take keyboard routes where the focus allows (Tab from a text field into
 *                  the next field's checkbox, Space there; Enter in a text field of a wizard step = Next;
 *                  dropdowns and radio groups are always clicked).
 *
 * Two more opt-in traits for single-site reference fidelity (they change the sampling of that widget only):
 *   traits.noTabs     never the tabs layout: the document and the form are always on screen together (the rest
 *                     of the spec matches the same seed without the trait).
 *   traits.fieldset   { card?: { keys, blank? }, invoice?: { keys, blank? } }: the form asks exactly the facts in
 *                     keys (field ids of DOC_ORDER) plus the blank-gold ones in blank (asked, never on the
 *                     document); the document shows only the asked non-blank facts. E.g. a three-row contact
 *                     card: { card: { keys: ['firstName', 'lastName', 'email'], blank: ['phone'] } }; the
 *                     five-field invoice: { invoice: { keys: ['invNo', 'date', 'vendor', 'total', 'currency'],
 *                     blank: ['po'] } }. Other scenarios (and scenarios not listed) sample as usual.
 *
 * opts.route (episode knob; undefined = the sampling above) only acts on trait widgets and never changes
 *   content draws: 'keyboard' sets spec.keys (traits.keys), 'pointer' clears spec.keys and makes the PDF
 *   pane scroll by thumb drag, 'wheel' makes the PDF pane scroll by wheel. spec.forcedRoute records an
 *   honoured value. Typing is the only way to fill a text field, so every route types. Legacy widgets
 *   (no traits) have no keyboard route and ignore the knob.
 *
 * spec   { scenario, isplit, csplit, startMode, ood, docStyle, docName, formTitle,
 *          align-layout: { cols, order, docSide, tabs, image, long, startTab, tabLabels: [doc, form],
 *                    wizard?, pdf?, dense?, mainLabel?, decoys? },
 *          base?, fix?, keys?, forcedRoute?   (fix scenario / trait widgets only)
 *          doc: { kind: 'card' | 'email' | 'invoice', style, ... }     plain data the widget renders
 *          fields: [{ id, kind, label, placeholder, options?, gold, match, src, computed?, wrong[] }] }
 *            kind     'text' | 'date' | 'dropdown' | 'radio' | 'checkbox'
 *            gold     expected value: string ('' = must stay blank) or boolean (checkbox)
 *            match    'text' (trim, collapse spaces, case-insensitive) | 'exact' (trim only: numbers,
 *                     digits-only phones, dates in the format shown by the placeholder) | 'option' | 'bool'
 *            src      how the document shows the value (null for blank-gold fields; for computed fields a
 *                     description); computed fields are derived from several document values
 *            wrong    plausible wrong values for 'wrong' starts (the document's own text where the form
 *                     wants another format, a neighbouring value, a near miss, another option)
 *          Date fields are plain text inputs typed in the placeholder's format (no picker). Dropdowns are
 *          custom listboxes (no native <select>); text, radio and checkbox fields are plain inputs.
 * model  { fields: { id: string | boolean }, open: id | null, tab: 'doc' | 'form' | 'x<i>', seen: bool,
 *          step?, errors?, focus?, pdf? }
 *          strings for text / date / dropdown (the option label, '' = nothing chosen) / radio (label or '');
 *          booleans for checkboxes. open = the dropdown whose list is showing; tab / seen = the visible tab
 *          and whether the document tab was shown (UI state the oracle needs; ignored by the error).
 * error  fraction of fields that are wrong after normalization; a blank-gold field is wrong when it is
 *        not empty. Wizard: (wrong fields + [not on the review page]) / (fields + 1), so the last subgoal
 *        is reaching the review page. tau 0 (every field right), sigma 0.25.
 *
 * start modes  off (empty form, a few default choices), partial (about half the fields right, the rest
 *              empty), wrong (plausible wrong values: document text in the wrong format, a neighbouring
 *              value, another option, a blank field filled in), solved.
 *
 * levels (normal is the task as above): easy = at most 3 fields (no blank-gold or computed ones while others
 *   remain), no tabs / image / long layout; medium = at most 5 fields, no image / long layout. The field cut applies to
 *   widgets with traits only (the trait-less design widgets keep their field count).
 *
 * judge modes (judgeModes ambiguous, impossible; the fix scenario only when asked for): the form starts completely right (solved)
 *   and the instruction asks for a change:
 *   ambiguous   two candidate values for one text field (the usual instruction plus "The phone is A or B."; the form
 *               keeps its layout, every field right); the reply asks (status ask), one option per value (cands: [[A], [B]];
 *               others: the document's other field values)
 *   impossible  "Set the fax number in the form to X" (no such field) or "Select Atlantis as the Country" (not an
 *               option); status impossible, what names the field or the value
 *   There is no confirm mode: the end control is the kit's, not an in-app irreversible control.
 *
 * plan targets
 *   { tab: 'doc' | 'form' }     a page tab (tabs mode: the oracle shows the document once, then the form)
 *   { field: id }               a text / date input (the oracle types into it: click, Ctrl+A, type)
 *   { clear: id }               the clear button of a non-empty text / date input
 *   { open: id }                a dropdown's button (opens, or closes when open)
 *   { option: [id, label] }     an option in the open dropdown's list
 *   { radio: [id, label] }      a radio button of a group
 *   { checkbox: id }            a checkbox (toggles)
 *   { tab: 'x<i>' }             (dense) a decoy tab; the oracle only ever clicks { tab: 'form' } back
 *   { next: true } / { back: true } / { edit: stepIndex }   (wizard) Next, Back, a review page's Edit link
 *   { pdfPane: true }           (pdf) the middle of the viewer's scroll area (wheel target)
 *   { pdfThumb: true } / { pdfTo: y }   (pdf) the viewer's scrollbar thumb / where to release it so the
 *                               pane scrolls to offset y
 * plan steps: { click }, { type } as before; (keys) { key: 'Tab' | 'Space' | 'Enter' };
 *   (pdf) { wheel: [{ pdfPane: true }, dy] } or { drag: [{ pdfThumb: true }, { pdfTo: y }] } before a field
 *   whose source has not been in view yet (model.pdf.seen < pos), so the value is on screen when it is
 *   typed. The wizard plan fixes the current step's fields, then Next (or Enter); Back / Edit when a wrong
 *   field sits on an earlier step.
 *
 * Helpers (widget API, env.taskDef.helpers):
 *   wizardGo(model, spec, 'next' | 'back' | stepIndex): wizard transition; Next validates the step.
 * The self-test lives in selftest.js; data.js, scan.js and scenarios/*.js provide source samplers through lib.
 * Deviations: instructions never name the end control; values come from env.content banks.
 */
(function () {
  'use strict';

  const { pad } = env.util;
  const C = env.content;
  const I = env.instruct;

  const FORM_TITLES = {
    card: ['New contact', 'Member registration', 'Customer details', 'Account setup', 'Update your profile', 'Visitor sign-in', 'New patient form'],
    email: ['Attendee registration', 'Event sign-up', 'Registration desk entry', 'Guest details', 'Booking request'],
    invoice: ['Expense claim', 'Enter vendor bill', 'Accounts payable entry', 'Reimbursement request', 'Purchase record'],
  };
  const DOC_ORDER = {
    card: ['firstName', 'middle', 'lastName', 'sex', 'dob', 'height', 'email', 'altEmail', 'phone', 'fax', 'website', 'street', 'apt', 'city', 'zip', 'country', 'company', 'job', 'tier', 'donor'],
    email: ['firstName', 'middle', 'lastName', 'email', 'phone', 'fax', 'website', 'company', 'job', 'city', 'country', 'arrive', 'arrTime', 'depart', 'nights', 'tickets', 'size', 'meal', 'contact', 'emergency', 'newsletter'],
    invoice: ['vendor', 'invNo', 'date', 'due', 'customer', 'po', 'vat', 'cost', 'project', 'qtySum', 'subtotal', 'tax', 'total', 'currency', 'method', 'paid'],
  };
  const TAB_LABELS = {
    card: [['{D}', 'Form'], ['Document', 'Form'], ['Scan', 'Registration'], ['Attachment', 'Details']],
    email: [['Email', 'Registration form'], ['Inbox', 'Sign-up'], ['Message', 'Form'], ['Original email', 'Booking']],
    invoice: [['{D}', 'Expense form'], ['Document', 'Entry'], ['Scan', 'Claim'], ['Attachment', 'Form']],
  };

  // Wizard steps: topics in a fixed order (every fact of a scenario belongs to one topic).
  const WIZ_CATS = {
    card: [['who', ['firstName', 'middle', 'lastName', 'sex', 'dob', 'height']], ['contact', ['email', 'altEmail', 'phone', 'fax', 'website']],
      ['address', ['street', 'apt', 'city', 'zip', 'country']], ['more', ['company', 'job', 'tier', 'donor']]],
    email: [['who', ['firstName', 'middle', 'lastName', 'company', 'job', 'emergency']], ['contact', ['email', 'phone', 'fax', 'website', 'city', 'country', 'contact', 'newsletter']],
      ['trip', ['arrive', 'arrTime', 'depart', 'nights', 'tickets']], ['extras', ['size', 'meal']]],
    invoice: [['doc', ['vendor', 'invNo', 'date', 'due', 'customer', 'po', 'vat']], ['amounts', ['qtySum', 'subtotal', 'tax', 'total', 'currency']],
      ['payment', ['method', 'paid', 'cost', 'project']]],
  };
  const STEP_TITLES = {
    who: [
      'Personal details', 'About you', 'Identity', 'Communication', 'Reachability'
    ], contact: ['Contact details', 'How to reach you', 'Contact'],
    address: [
      'Address', 'Home address', 'Where you live', 'Residence', 'Whereabouts', 'Your location'
    ], more: ['Other details', 'Work and membership', 'More details'],
    trip: [
      'Your stay', 'Travel', 'Dates and tickets', 'Choices', 'Your needs'
    ], extras: ['Preferences', 'Extras', 'Options'],
    doc: [
      'Document', 'Bill details', 'Header data', 'Charges', 'Values', 'Billing'
    ], amounts: ['Amounts', 'Totals', 'Figures'], payment: ['Payment', 'Payment and coding', 'Settlement'],
  };
  // ERP mode: the form's own tab and decoy tabs that show unrelated panes.
  const MAIN_TAB = { card: ['General', 'Main data', 'Details'], email: ['General', 'Registration', 'Attendee'], invoice: ['Header', 'General', 'Bill data'] };
  const DECOYS = {
    card: ['History', 'Notes', 'Permissions', 'Consents', 'Activity', 'Documents', 'Relations'],
    email: ['History', 'Notes', 'Activity', 'Sessions', 'Badges', 'Messages', 'Payments'],
    invoice: ['Approvals', 'History', 'Notes', 'Audit trail', 'Workflow', 'Related documents', 'Postings'],
  };
  // Fix scenario: what kind of field each fact is ("fix the date field"): the widget for dropdowns, radios,
  // checkboxes and dates, the meaning for text fields.
  const KIND_OF = {
    firstName: 'name', lastName: 'name', middle: 'name', customer: 'name', emergency: 'name',
    email: 'email', altEmail: 'email', phone: 'phone', fax: 'phone', street: 'address', apt: 'address', city: 'address',
    zip: 'postcode', company: 'company', vendor: 'company', job: 'job', website: 'website', subtotal: 'amount', tax: 'amount',
    total: 'amount', tickets: 'count', nights: 'count', qtySum: 'count', height: 'height', arrTime: 'time', invNo: 'reference',
    po: 'reference', vat: 'reference', cost: 'reference', project: 'reference',
  };
  const kindOf = (f) => (f.kind === 'text' ? KIND_OF[f.id] || f.id : f.kind);
  const KIND_WORDS = {
    name: ['name field', 'name'], email: ['email address', 'email field'], phone: ['phone number', 'phone field'],
    address: ['address field', 'address line'], postcode: ['postal code', 'postcode field'], company: ['company name', 'company field'],
    job: ['job title', 'job field'], website: ['website field', 'web address'], amount: ['amount field', 'amount'],
    count: ['number field', 'count'], height: ['height', 'height field'], time: ['time field', 'time'],
    reference: [
      'reference number', 'reference field', 'combobox field', 'pulldown menu'
    ], date: ['date field', 'date'], dropdown: ['drop-down', 'drop-down field', 'selection list'],
    radio: [
      'multiple-choice question', 'radio-button choice', 'option group', 'single-answer question', 'radio cluster'
    ], checkbox: ['checkbox', 'tick box'],
  };

  // ---------------------------------------------------------------- sampling

  function buildSpec(rng, scenario, opts) {
    const ood = !!opts.ood;
    const g = { rng: rng.fork(`task/${scenario}`), csplit: opts.csplit || 'train', ood };
    const task = env.scenariosOf('fill-form')[scenario].task(g);
    const r = rng.fork('form');
    const F = task.facts;
    // Opt-in modes (widget traits). Without traits nothing below draws, and every legacy draw is unchanged.
    const T = opts.traits || {};
    const traitOn = !!(T.wizard || T.pdf || T.dense || T.keys);
    const fx = rng.fork('form-x');
    const on = (t) => t === true || (typeof t === 'number' && fx.bool(t));
    const X = { wizard: on(T.wizard), pdf: on(T.pdf), dense: on(T.dense) };
    if (X.dense) X.wizard = false;
    if (X.wizard) X.pdf = false;
    const single = X.wizard || X.pdf || X.dense; // modes that replace the long page
    const long = single ? false : ood || r.bool(0.2);
    // traits.noTabs: the draw is kept (so the rest of the spec is the tabs-free twin of the same seed), the result dropped.
    const tabs = (X.pdf ? false : !long && r.bool(0.25)) && !T.noTabs;
    const image = r.bool(0.3);
    const n = X.dense ? fx.int(10, 14) : long ? r.int(8, ood ? 11 : 10) : r.int(4, ood && single ? 10 : 8);
    const nBlank = X.dense ? fx.pick([2, 3, 3, 4]) : Math.min(r.pick(long ? [1, 2, 2, 3] : [0, 1, 1, 1, 2, 2]), n - 3);
    // Blank-gold fields: blank-only facts, or optional text/date facts the document will not show.
    const blankPool = Object.keys(F).filter((k) => F[k].blankOnly
      || (task.optional.includes(k) && (F[k].kind === 'text' || F[k].kind === 'date') && !F[k].computed));
    const blank = new Set(r.sample(blankPool, nBlank));
    // A computed field needs its inputs on the document: never pair it with a blank input.
    const avail = [...task.always, ...task.optional].filter((k) => !blank.has(k) && !(F[k].needs || []).some((x) => blank.has(x)));
    const chosen = new Set();
    // Mix widget kinds: maybe one dropdown, radio, checkbox and date each, a computed or converted value, then text.
    for (const [kind, p] of [['dropdown', 0.75], ['radio', 0.65], ['checkbox', 0.55], ['date', 0.7]]) {
      const pool = avail.filter((k) => F[k].kind === kind);
      if (pool.length && r.bool(p) && chosen.size < n - blank.size - 1) chosen.add(r.pick(pool));
    }
    const special = avail.filter((k) => F[k].computed || ['height', 'arrTime'].includes(k));
    if (special.length && r.bool(0.55) && chosen.size < n - blank.size - 1) chosen.add(r.pick(special));
    const rest = r.shuffle(avail.filter((k) => !chosen.has(k) && F[k].kind === 'text' && !F[k].computed));
    const restOther = r.shuffle(avail.filter((k) => !chosen.has(k) && (F[k].kind !== 'text' || F[k].computed)));
    for (const k of [...rest, ...restOther]) {
      if (chosen.size >= n - blank.size) break;
      chosen.add(k);
    }
    // traits.fieldset[scenario] = { keys, blank }: exactly these facts are asked (blank: asked but absent from the
    // document, so gold ''); facts the scenario's task did not sample (e.g. a compute-mode invoice has no subtotal)
    // are dropped. The document shows only the asked facts that are not blank.
    const FS = T.fieldset && T.fieldset[scenario];
    if (FS) {
      blank.clear();
      chosen.clear();
      for (const k of FS.blank || []) if (F[k]) blank.add(k);
      for (const k of FS.keys) if (F[k] && !blank.has(k)) chosen.add(k);
    }
    // The document shows every asked (non-blank) fact plus some extra ones, never a blank-gold one.
    const shown = new Set(FS ? chosen : [...task.always, ...chosen]);
    for (const k of [...shown]) for (const x of F[k].needs || []) shown.add(x);
    if (!FS) for (const k of task.optional) if (!blank.has(k) && !shown.has(k) && !F[k].computed && r.bool(0.45)) shown.add(k);
    const doc = task.build(shown);

    let keys = DOC_ORDER[scenario].filter((k) => chosen.has(k) || blank.has(k));
    const order = r.bool(0.6) ? 'natural' : 'shuffled';
    if (order === 'shuffled') keys = r.shuffle(keys);
    const fields = keys.map((k) => {
      const f = F[k];
      const isBlank = blank.has(k);
      const out = {
        id: k,
        kind: f.kind,
        label: r.pick(f.labels),
        placeholder: f.placeholder || '',
        gold: isBlank ? (f.kind === 'checkbox' ? false : '') : f.gold,
        match: f.match,
        src: isBlank ? null : f.src,
      };
      if (f.computed && !isBlank) out.computed = true;
      if (f.options) out.options = f.options.slice();
      // Plausible wrong values for 'wrong' starts (never equal to the gold after normalization).
      let wrong = [];
      if (isBlank) wrong = [...doc.extras ? doc.extras.map((x) => x.value) : [], 'n/a', '-', 'none'];
      else if (f.kind === 'text' || f.kind === 'date') wrong = (f.wrong || []).filter(Boolean);
      else if (f.kind === 'dropdown' || f.kind === 'radio') wrong = f.options.filter((o) => o !== f.gold);
      out.wrong = wrong.filter((w) => !fieldOk(out, w)).slice(0, 6);
      return out;
    });
    // Levels: fewer fields (blank-gold and computed ones go first; only for widgets with traits: the trait-less design widgets
    // lay out for the field count they were drawn with), a calmer page.
    const lvl = opts.level === 'easy' || opts.level === 'medium' ? opts.level : null;
    if (lvl && !FS && traitOn) {
      const cap = lvl === 'easy' ? 3 : 5;
      while (fields.length > cap) {
        let i = -1;
        for (let k = fields.length - 1; k >= 0 && i < 0; k--) if (fields[k].src === null) i = k;
        for (let k = fields.length - 1; k >= 0 && i < 0; k--) if (fields[k].computed) i = k;
        fields.splice(i < 0 ? fields.length - 1 : i, 1);
      }
    }
    const wide = fields.filter((f) => f.kind === 'radio' || f.kind === 'checkbox').length;
    const cols = long ? 1 : fields.length + wide >= 7 ? 2 : r.bool(0.35) && fields.length >= 5 ? 2 : 1;
    const spec = {
      scenario,
      isplit: opts.isplit || 'train',
      csplit: g.csplit,
      startMode: opts.startMode,
      ood,
      docStyle: task.style,
      docName: task.docName,
      formTitle: r.pick(FORM_TITLES[scenario]),
      layout: { cols, order, docSide: r.pick(['left', 'right']), tabs: tabs && lvl !== 'easy', image: image && !lvl, long: long && !lvl,
        startTab: tabs && lvl !== 'easy' ? r.pick(['doc', 'form']) : 'form',
        tabLabels: r.pick(TAB_LABELS[scenario]).map((s) => s.replace('{D}', task.docName[0].toUpperCase() + task.docName.slice(1))) },
      doc,
      fields,
    };
    if (traitOn) addModes(spec, X, T, fx, task, opts);
    return spec;
  }

  // The opt-in modes of trait widgets (see the header). All draws come from fx = rng.fork('form-x') and
  // rng.fork('route').
  function addModes(spec, X, T, fx, task, opts) {
    const L = spec.layout;
    const base = spec.scenario;
    if (X.wizard) {
      // Group the fields by topic (fixed topic order), merge one-field steps into a neighbour, 2-4 steps.
      let steps = WIZ_CATS[base].map(([cat, keys]) => ({ cat, ids: spec.fields.filter((f) => keys.includes(f.id)).map((f) => f.id) }))
        .filter((st) => st.ids.length);
      const merge = (i, j) => {
        const [a, b] = i < j ? [i, j] : [j, i];
        const big = steps[a].ids.length >= steps[b].ids.length ? steps[a] : steps[b];
        steps[a] = { cat: big.cat, ids: spec.fields.map((f) => f.id).filter((id) => steps[a].ids.includes(id) || steps[b].ids.includes(id)) };
        steps.splice(b, 1);
      };
      for (let guard = 0; guard < 8; guard++) {
        const i = steps.findIndex((st) => st.ids.length === 1);
        if (steps.length > 4) {
          let best = 0;
          for (let k = 1; k < steps.length - 1; k++) if (steps[k].ids.length + steps[k + 1].ids.length < steps[best].ids.length + steps[best + 1].ids.length) best = k;
          merge(best, best + 1);
        } else if (i >= 0 && steps.length > 2) merge(i, i > 0 ? i - 1 : i + 1);
        else break;
      }
      if (steps.length === 1) {
        const ids = steps[0].ids;
        const h = Math.ceil(ids.length / 2);
        steps = [{ cat: steps[0].cat, ids: ids.slice(0, h) }, { cat: 'more', ids: ids.slice(h) }];
      }
      const usedTitles = new Set();
      L.wizard = { steps: steps.map((st) => {
        const titles = STEP_TITLES[st.cat].filter((t) => !usedTitles.has(t));
        const title = fx.pick(titles.length ? titles : ['Details']);
        usedTitles.add(title);
        return { cat: st.cat, title, ids: st.ids };
      }) };
      for (const f of spec.fields) {
        f.required = f.gold !== '' && f.kind !== 'checkbox' && (task.always.includes(f.id) || fx.bool(0.55));
        f.check = checkOf(f);
      }
      L.wizard.reviewTitle = fx.pick([
        'Review', 'Review and confirm', 'Summary', 'Check your answers', 'Look it over', 'Your entries',
        'Form overview', 'Answer check', 'Response recap', 'At a glance', 'Completed form', 'Last check'
      ]);
    }
    if (X.pdf) {
      const d = spec.docName;
      L.pdf = {
        cover: fx.pick(['none', 'cover', 'cover', 'letter']),
        zoom: fx.pick([1, 1, 0.9, 0.8]),
        file: `${fx.pick({ card: ['scan', 'id_upload', 'applicant', 'document'], email: ['message', 'email_print', 'registration'], invoice: ['invoice', 'bill', 'scan', 'receipt'] }[base])}_${fx.int(1000, 9999)}.pdf`,
        filler: fx.bool(0.55) ? { title: fx.pick([
          'Terms and conditions', 'Privacy notice', 'General information', 'Notes', 'Document overview', 'Background',
          'Record details', 'Additional context'
        ]),
          paras: C.paragraphs(fx, fx.int(2, 4), { domain: 'policy', csplit: spec.csplit }) } : null,
        note: fx.pick([`Please find the ${d} attached for processing.`, `Scanned copy of the ${d} as received.`,
          `Attached: the ${d}. Please key it into the system.`, `For data entry - original ${d} enclosed.`]),
        route: fx.pick(['wheel', 'thumb']),
      };
    }
    if (X.dense) {
      L.dense = true;
      L.cols = 3;
      L.mainLabel = fx.pick(MAIN_TAB[base]);
      L.decoys = fx.sample(DECOYS[base], fx.int(3, 5));
      if (!L.tabs && fx.bool(0.25)) L.startTab = `x${fx.int(0, L.decoys.length - 1)}`;
    }
    if (T.keys) spec.keys = fx.bool(0.5);
    // opts.route: overrides the drawn routes (after every draw, so content never depends on it).
    const route = opts.route;
    if (route === 'keyboard' && T.keys) { spec.keys = true; spec.forcedRoute = route; }
    if (route === 'pointer' && (T.keys || L.pdf)) {
      if (T.keys) spec.keys = false;
      if (L.pdf) L.pdf.route = 'thumb';
      spec.forcedRoute = route;
    }
    if (route === 'wheel' && L.pdf) { L.pdf.route = 'wheel'; spec.forcedRoute = route; }
  }

  // ---------------------------------------------------------------- fix scenario

  function parseForm(s, fmt) {
    const p = s.split(/[-/.]/).map(Number);
    if (fmt === 'YYYY-MM-DD') return { y: p[0], m: p[1], d: p[2] };
    if (fmt === 'MM/DD/YYYY') return { y: p[2], m: p[0], d: p[1] };
    return { y: p[2], m: p[1], d: p[0] };
  }
  // A near miss of a right value: same format, visibly different content (one digit or letter, a date a
  // few days out, an hour off, another option, a flipped checkbox).
  function nearMiss(rng, f) {
    const v = f.gold;
    if (f.kind === 'checkbox') return !v;
    if (f.kind === 'dropdown' || f.kind === 'radio') return rng.pick(f.options.filter((o) => o !== v));
    if (f.kind === 'date') {
      const dt = parseForm(v, f.placeholder);
      return env.taskOf('fill-form').lib.fmtForm(env.taskOf('fill-form').lib.addDays(dt, rng.pick([1, 2, 3, 7, 10, 14, 30])), f.placeholder);
    }
    if (f.check === 'time' || /^\d\d:\d\d$/.test(v)) {
      const [h, m] = v.split(':').map(Number);
      return `${pad((h + rng.pick([1, 2, 3, 22])) % 24)}:${pad(m)}`;
    }
    const ds = [...v].map((ch, i) => (/\d/.test(ch) ? i : -1)).filter((i) => i >= 0);
    if (ds.length) {
      // Never the leading digit of a number (keeps "0.50" from becoming "00.50").
      const pool = ds.length > 1 && /^\d/.test(v) ? ds.slice(1) : ds;
      const i = rng.pick(pool);
      const d = rng.pick('0123456789'.split('').filter((c) => c !== v[i]));
      return v.slice(0, i) + d + v.slice(i + 1);
    }
    // Letters: a vowel swapped, or two inner letters transposed, in the longest word.
    const words = v.split(/(\s+|@|\.)/);
    let wi = 0;
    words.forEach((w, i) => { if (/^\p{L}+$/u.test(w) && w.length > (words[wi] || '').length) wi = i; });
    const w = words[wi];
    let nw = w;
    const vow = [...w].map((ch, i) => (i > 0 && /[aeiou]/i.test(ch) ? i : -1)).filter((i) => i >= 0);
    if (vow.length && rng.bool(0.6)) {
      const i = rng.pick(vow);
      const lower = w[i].toLowerCase();
      const rep = rng.pick('aeiou'.split('').filter((c) => c !== lower));
      nw = w.slice(0, i) + (w[i] === lower ? rep : rep.toUpperCase()) + w.slice(i + 1);
    } else if (w.length >= 4) {
      for (let k = 0; k < 6 && nw.toLowerCase() === w.toLowerCase(); k++) {
        const i = rng.int(1, w.length - 3);
        nw = w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
      }
    }
    if (nw.toLowerCase() === w.toLowerCase()) nw = `${w}${rng.pick(['s', 'e', 'n'])}`;
    words[wi] = nw;
    return words.join('');
  }

  function fixSpec(rng, opts) {
    const fr = rng.fork('fix');
    const base = fr.pick(['card', 'email', 'invoice']);
    const spec = buildSpec(rng, base, opts);
    spec.scenario = 'fix';
    spec.base = base;
    const fields = spec.fields;
    const kinds = {};
    for (const f of fields) kinds[kindOf(f)] = (kinds[kindOf(f)] || 0) + 1;
    const cand = fields.filter((f) => f.src !== null && !f.computed);
    const nameable = cand.filter((f) => kinds[kindOf(f)] === 1 && KIND_WORDS[kindOf(f)]);
    const mode = nameable.length && fr.bool(0.5) ? 'kind' : 'anon';
    const f = fr.pick(mode === 'kind' ? nameable : cand);
    let value = nearMiss(fr, f);
    for (let k = 0; k < 8 && fieldOk(f, value); k++) value = nearMiss(fr, f);
    spec.fix = { id: f.id, value, kind: kindOf(f), mode };
    return spec;
  }

  const DATE_RE = { 'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/, 'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/, 'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    'DD.MM.YYYY': /^\d{2}\.\d{2}\.\d{4}$/ };
  function checkOf(f) {
    if (f.kind === 'date') return 'date';
    if (f.kind !== 'text') return null;
    const p = f.placeholder;
    if (p === 'digits only') return 'digits';
    if (p === 'number' || p === 'cm') return 'number';
    if (p === '0.00') return 'amount';
    if (/HH:MM/.test(p)) return 'time';
    if (f.id === 'email' || f.id === 'altEmail') return 'email';
    return null;
  }
  // Format validation of a wizard step (never against the document).
  function formatOk(f, v) {
    const s = String(v === undefined || v === null ? '' : v).trim();
    if (!s || !f.check) return true;
    if (f.check === 'digits' || f.check === 'number') return /^\d+$/.test(s);
    if (f.check === 'amount') return /^\d+\.\d{2}$/.test(s);
    if (f.check === 'date') return (DATE_RE[f.placeholder] || /./).test(s);
    if (f.check === 'time') return /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
    if (f.check === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    return true;
  }

  // ---------------------------------------------------------------- scoring and plan

  function norm(v, match) {
    const s = v === undefined || v === null ? '' : String(v);
    if (match === 'text') return s.trim().replace(/\s+/g, ' ').toLowerCase();
    if (match === 'exact') return s.trim();
    return s;
  }

  function fieldOk(f, v) {
    if (f.kind === 'checkbox') return !!v === !!f.gold;
    return norm(v, f.match) === norm(f.gold, f.match);
  }

  // ---- wizard helpers (layout.wizard): steps are spec.layout.wizard.steps[{ cat, title, ids[] }]; the step
  // index spec.layout.wizard.steps.length is the review page.
  const stepOf = (spec, id) => (spec.layout.wizard ? spec.layout.wizard.steps.findIndex((st) => st.ids.includes(id)) : -1);
  const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

  // { fieldId: 'required' | 'format' } for the fields of one wizard step (never checked against the document).
  function invalidOf(spec, model, step) {
    const out = {};
    const st = spec.layout.wizard.steps[step];
    if (!st) return out;
    for (const f of spec.fields) {
      if (!st.ids.includes(f.id)) continue;
      const v = model.fields[f.id];
      if (f.required && f.kind !== 'checkbox' && isBlank(v)) out[f.id] = 'required';
      else if (!formatOk(f, v)) out[f.id] = 'format';
    }
    return out;
  }

  // The wizard's transition: to = 'next' (validates the current step; stays with errors when invalid),
  // 'back', or a step index (the review page's Edit links; the last index is the review page).
  function wizardGo(model, spec, to) {
    const n = spec.layout.wizard.steps.length;
    const m = { ...model, errors: {}, open: null };
    if (to === 'next') {
      if (model.step >= n) return m;
      const bad = invalidOf(spec, model, model.step);
      return Object.keys(bad).length ? { ...m, errors: bad } : { ...m, step: model.step + 1 };
    }
    if (to === 'back') return { ...m, step: Math.max(0, model.step - 1) };
    return { ...m, step: Math.max(0, Math.min(n, to)) };
  }

  // The field a Tab press moves focus to from field `id`: the next field of the form (of the open wizard
  // step) when both are tab stops of the reference mechanics (text / date inputs and checkboxes; dropdown
  // buttons and radio groups are skipped over by plan, never tabbed through); else null.
  function tabOrderNext(spec, id) {
    const st = spec.layout.wizard && spec.layout.wizard.steps[stepOf(spec, id)];
    const list = st ? spec.fields.filter((f) => st.ids.includes(f.id)) : spec.fields;
    const i = list.findIndex((f) => f.id === id);
    const stop = (f) => f && (f.kind === 'text' || f.kind === 'date' || f.kind === 'checkbox');
    return i >= 0 && stop(list[i]) && stop(list[i + 1]) ? list[i + 1].id : null;
  }

  function errorOf(model, spec) {
    let wrong = 0;
    for (const f of spec.fields) if (!fieldOk(f, model.fields[f.id])) wrong++;
    const w = spec.layout.wizard;
    if (w) return (wrong + (model.step >= w.steps.length ? 0 : 1)) / (spec.fields.length + 1);
    return wrong / spec.fields.length;
  }

  function planOf(model, spec) {
    const L = spec.layout;
    const wiz = L.wizard;
    const wrong = spec.fields.filter((f) => !fieldOk(f, model.fields[f.id]));
    const review = wiz ? wiz.steps.length : 0;
    if (!wrong.length && !(wiz && model.step < review)) return null;
    if (L.tabs) {
      if (!model.seen) return { click: { tab: 'doc' } };
      if (model.tab !== 'form') return { click: { tab: 'form' } };
    } else if (L.dense && model.tab !== 'form') return { click: { tab: 'form' } };
    if (model.scanForm && wrong.length && !model.open) {
      const V = model.scanForm;
      const p = V.pos[wrong[0].id];
      if (p && (p[0] < V.top || p[1] > V.top + V.view)) {
        const want = Math.max(0, Math.min(V.max, p[0] - 12));
        if (Math.abs(want - V.top) > 2) return { wheel: [{ scanForm: true }, want - V.top] };
      }
    }
    if (model.open) {
      const f = spec.fields.find((x) => x.id === model.open);
      if (f && !fieldOk(f, model.fields[f.id])) return { click: { option: [f.id, f.gold] } };
      return { click: { open: model.open } }; // close it before touching anything it may cover
    }
    const focusF = spec.fields.find((x) => x.id === model.focus);
    const textFocus = !!focusF && (focusF.kind === 'text' || focusF.kind === 'date');
    let pool = wrong;
    if (wiz) {
      // Go to the first step with a wrong field (the review page when none): forward with Next, back with
      // Back / Edit; fix the wrong fields of the open step.
      const target = wrong.length ? Math.min(...wrong.map((f) => stepOf(spec, f.id))) : review;
      if (model.step < target) {
        if (spec.keys && textFocus && stepOf(spec, model.focus) === model.step) return { key: 'Enter' };
        return { click: { next: true } };
      }
      if (model.step > target) return model.step >= review ? { click: { edit: target } } : { click: { back: true } };
      pool = wrong.filter((f) => stepOf(spec, f.id) === model.step);
    }
    const f = pool[0];
    if (!f) return null;
    // The PDF pane: scroll until the document's source of this value has been on screen.
    const P = model.pdf;
    if (L.pdf && P && P.view > 0 && f.src !== null && P.pos && P.pos[f.id] !== undefined && P.pos[f.id] > P.seen && P.top < P.max) {
      const want = Math.min(P.max, Math.max(P.top + 1, Math.round(P.pos[f.id] - P.view + 40)));
      return L.pdf.route === 'thumb' ? { drag: [{ pdfThumb: true }, { pdfTo: want }] } : { wheel: [{ pdfPane: true }, want - P.top] };
    }
    if (f.kind === 'text' || f.kind === 'date') {
      if (f.gold === '') return { click: { clear: f.id } };
      if (spec.keys && model.focus && model.focus !== f.id && tabOrderNext(spec, model.focus) === f.id) return { key: 'Tab' };
      return { type: [{ field: f.id }, f.gold] };
    }
    if (f.kind === 'dropdown') return { click: { open: f.id } };
    if (f.kind === 'radio') return { click: { radio: [f.id, f.gold] } };
    if (spec.keys && model.focus === f.id) return { key: 'Space' };
    if (spec.keys && model.focus && tabOrderNext(spec, model.focus) === f.id) return { key: 'Tab' };
    return { click: { checkbox: f.id } };
  }

  // Model-space effect of a plan step (what the base widgets do on that action). spec is needed for the
  // wizard, Tab order and the PDF pane steps.
  function applyStep(model, step, spec) {
    const m = { ...model, fields: { ...model.fields }, open: model.open };
    if (step.type) {
      m.fields[step.type[0].field] = step.type[1];
      m.open = null;
      if (m.focus !== undefined) m.focus = step.type[0].field;
      return m;
    }
    if (step.key) {
      if (step.key === 'Tab') m.focus = tabOrderNext(spec, model.focus);
      else if (step.key === 'Space') m.fields[model.focus] = !m.fields[model.focus];
      else if (step.key === 'Enter') return { ...wizardGo(model, spec, 'next') };
      return m;
    }
    if (step.wheel || step.drag) {
      if (step.wheel && step.wheel[0].scanForm) {
        m.scanForm = { ...m.scanForm, top: Math.max(0, Math.min(m.scanForm.max, m.scanForm.top + step.wheel[1])) };
        return m;
      }
      const P = { ...m.pdf };
      const to = step.wheel ? P.top + step.wheel[1] : step.drag[1].pdfTo;
      P.top = Math.max(0, Math.min(P.max, Math.round(to)));
      P.seen = Math.max(P.seen, P.top + P.view);
      m.pdf = P;
      return m;
    }
    const t = step.click;
    if (t.next) return wizardGo(model, spec, 'next');
    if (t.back) return wizardGo(model, spec, 'back');
    if (t.edit !== undefined) return wizardGo(model, spec, t.edit);
    if (t.tab !== undefined) { m.tab = t.tab; m.seen = m.seen || t.tab === 'doc'; m.open = null; }
    else if (t.open !== undefined) m.open = m.open === t.open ? null : t.open;
    else if (t.option) { m.fields[t.option[0]] = t.option[1]; m.open = null; }
    else if (t.radio) { m.fields[t.radio[0]] = t.radio[1]; m.open = null; if (m.focus !== undefined) m.focus = t.radio[0]; }
    else if (t.checkbox !== undefined) { m.fields[t.checkbox] = !m.fields[t.checkbox]; m.open = null; if (m.focus !== undefined) m.focus = t.checkbox; }
    else if (t.clear !== undefined) { m.fields[t.clear] = ''; m.open = null; }
    return m;
  }

  // ---------------------------------------------------------------- instructions

  // User requests describe the record to produce, never viewer or navigation mechanics.
  const CORE = {
    all: [
      'Fill in the form with the details from the {d}, leaving a field blank if the {d} does not contain that information.',
      'Copy the information from the {d} into the form and leave empty any field the {d} does not mention.',
      'Complete the form using the {d}; fields the {d} has no information for must stay blank.',
      'Use the {d} to fill out the form; anything the {d} does not say stays empty.',
      'Transfer the details on the {d} to the form, leaving fields without information blank.',
      'Enter the data from the {d} into the form without guessing values that are not on the {d}.',
      'Key in the {d}: every field the {d} covers, nothing else.',
      'Fill out the form from the {d} in the formats the form asks for, and leave the rest empty.',
      'Where the {d} has data, fill the form in its requested formats; leave other fields blank.',
      'Prepare the form from the {d}, using the required formats and leaving missing details blank.',
      'With the {d} as source, complete each supported field in its format; keep the rest blank.',
      'Base the form on the {d}: follow the required formats and leave missing values empty.',
      'Use form formats for values supplied by the {d}; fields without source data stay empty.',
      'Complete every field supported by the {d} in the requested format, leaving others blank.',
      'Build the form record using the {d}, respecting field formats and leaving gaps unfilled.',
      'From the {d}, provide matching form values in the required formats; leave unknowns blank.',
    ],
    card: ['Register this person using their {d}; leave out anything the {d} does not show.',
      'Create the record from the {d} and leave unknown fields empty.'],
    email: ['Register the sender of this {d} with the details they gave, leaving anything they did not mention blank.',
      'Sign up the person who wrote the {d}, using only what the {d} says.'],
    invoice: ['Enter this {d} in the form, leaving fields that the {d} does not cover blank.',
      'Record the {d} in the form; skip fields the {d} has no value for.'],
  };
  const SOURCE_CONTEXT = ['Use the attached {d} as the source of truth.', 'Please keep the record faithful to the {d}.',
    'These details are for our records, so please do not infer anything missing.',
    'The attached {d} is the authority for the details here.',
    'Ensure the record reflects the information in the {d}.',
    'Our records must not contain inferred missing values.'];
  // fix scenario: a prefilled form with one value that disagrees with the document.
  const FIX = {
    anon: ['Fix the one field in the form that does not match the {d}.', 'Correct the field in the form that disagrees with the {d}.',
      'Check the form against the {d} and fix the field that is wrong.', 'Find the wrong value in the form, using the {d}, and fix it.',
      'Bring the form into agreement with the {d} by fixing one field.',
      'Locate the single mismatch with the {d} in the form and fix it.',
      'Match the form to the {d} by correcting its one wrong field.'],
    kind: ['Fix the {k} so that it matches the {d}.', 'Correct the {k} so that it agrees with the {d}.', 'Update the {k} to match the {d}.',
      'Make the {k} in the form agree with the {d}.',
      'Bring the {k} back into line with the {d}.',
      'The {k} needs correcting to suit the {d}.',
      'Align the {k} with the {d} in the form.'],
  };
  const REVIEW_CONTEXT = ['Leave the completed record ready for review.', 'I need a complete draft for our records.',
    'Please make sure all the available details are included.',
    'The finished record should be ready for review.',
    'I would like the record as a completed draft.',
    'Keep the record complete with available details.'];
  const FINISH = [
    'Finish when you are done.', 'Then finish.', 'Let me know when it is done.', 'Stop when all is done.',
    'Finish up afterward.'
  ];

  // ---------------------------------------------------------------- judge modes

  const ABSENT_FIELDS = [['fax number', '555-0148'], ['middle name', 'Alexander'], ['passport number', 'X4829316'], ['VAT number', 'GB123456789'],
    ['nickname', 'Sunny'], ['second address line', 'Flat 4B'], ['emergency contact', 'Maria Santos']];
  const ABSENT_OPTIONS = { country: ['Atlantis (AT)', 'Narnia (NR)'], tier: ['Diamond', 'Titanium'], sex: ['Other'], size: ['XXXXL', 'Tiny'],
    meal: ['Pescatarian', 'Halal'], contact: ['Post', 'Carrier pigeon'], method: ['Cheque', 'Cryptocurrency'], currency: ['Atlantean dollar (ATD)'] };

  // New plausible values for the fields that can come twice (the document is not consulted).
  const FIRSTS = ['Anna', 'Marcus', 'Leila', 'Tomas', 'Sofia', 'Daniel'];
  const LASTS = ['Weber', 'Okafor', 'Silva', 'Nguyen', 'Hansen', 'Rossi'];
  const NEW_VALUE = {
    phone: (r) => `${r.int(201, 989)}${r.int(200, 989)}${String(r.int(0, 9999)).padStart(4, '0')}`,
    email: (r) => `${r.pick(FIRSTS).toLowerCase()}.${r.pick(LASTS).toLowerCase()}@example.com`,
    street: (r) => `${r.int(2, 240)} ${r.pick(['Maple Avenue', 'Harbor Road', 'Mill Lane', 'Station Road'])}`,
    city: (r) => r.pick(['Leeds', 'Porto', 'Madison', 'Bergen', 'Lyon', 'Perth']),
    zip: (r) => String(r.int(10000, 99999)),
    vendor: (r) => r.pick(C.COMPANIES),
    customer: (r) => `${r.pick(FIRSTS)} ${r.pick(LASTS)}`,
    company: (r) => r.pick(C.COMPANIES),
    job: (r) => r.pick(C.JOB_TITLES),
    cost: (r) => `CC-${r.int(100, 999)}`,
    project: (r) => `PRJ-${r.int(1000, 9999)}`,
    website: (r) => `https://www.${r.pick(['northwind', 'bluepeak', 'harborpine'])}.example`,
    po: (r) => `PO-${r.int(10000, 99999)}`,
  };

  function judgeOf(jr, spec, mode) {
    if (mode === 'impossible') {
      const withOpts = spec.fields.filter((f) => (f.kind === 'dropdown' || f.kind === 'radio') && f.options);
      if (withOpts.length && jr.bool(0.5)) {
        const f = jr.pick(withOpts);
        const pool = ABSENT_OPTIONS[f.id] || ['Option Z'];
        const free = pool.filter((x) => !f.options.includes(x));
        const value = free.length ? jr.pick(free) : 'Option Z';
        const bare = value.replace(/\s*\(.*\)$/, '');
        return { mode, kind: 'option', field: f.id, value, what: [...new Set([value, bare])], message: `I can't do that: "${value}" is not an option for ${f.label}.` };
      }
      const taken = spec.fields.map((f) => f.label.toLowerCase()).join(' | ');
      const [what, value] = jr.pick(ABSENT_FIELDS.filter(([w]) => !taken.includes(w)));
      return { mode, kind: 'field', what: [what, `${what} field`], thing: what, value, message: `I can't do that: the form has no ${what} field.` };
    }
    // ambiguous: two candidate values for one field (no field is added: the page keeps its layout).
    const ok = (f) => f.kind === 'text' && f.gold !== '' && f.src !== null && !f.computed;
    const cand = spec.fields.filter(ok);
    if (!cand.length) return undefined;
    const f = jr.pick(cand);
    let b = NEW_VALUE[f.id] ? NEW_VALUE[f.id](jr) : (f.wrong || []).find((w) => w && !fieldOk(f, w));
    for (let k = 0; k < 8 && (b === undefined || fieldOk(f, b)); k++) b = nearMiss(jr, f);
    const a = f.gold;
    const l = f.label.replace(/ \(.*\)$/, '').toLowerCase();
    // The other values the page shows (never offered as a choice).
    const shown = new Set([a, b].map((x) => String(x).toLowerCase()));
    const others = spec.fields.filter((x) => x !== f && ['text', 'date', 'dropdown', 'radio'].includes(x.kind) && String(x.gold || '').length >= 3
      && !shown.has(String(x.gold).toLowerCase())).map((x) => [String(x.gold)]);
    return { mode, base: f.label, cands: [[a], [b]], others, values: [a, b],
      message: `Which ${l} should I enter: "${a}" or "${b}"?`,
      templates: [
        'The {l} is {a} or {b}.', 'For the {l}, enter {a} or {b}.', 'Use {a} or {b} for the {l}.',
        'Put the {l} down as {a} or {b}.', 'Either {a} or {b} is the {l}.', 'Give the {l} as {a} or {b}.',
        'Record {a} or {b} under {l}.'
      ],
      vars: { l, a: `"${a}"`, b: `"${b}"` } };
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const S = spec.isplit;
    if (j.mode === 'ambiguous') {
      const d = spec.docName;
      const core = I.phrase(rng, [...CORE.all, ...(CORE[spec.scenario] || [])], { d }, S);
      const said = I.say(rng, core, { isplit: S, terse: `copy the ${d} into the form`, steps: [`use the ${d} as the source`, 'complete the matching record', 'leave unavailable details blank'] });
      return `${/[.!?]$/.test(said) ? said : `${said}.`} ${I.phrase(rng, j.templates, j.vars, S)}`;
    }
    if (j.kind === 'option') {
      const f = spec.fields.find((x) => x.id === j.field);
      return I.phrase(rng, [
        'Select "{v}" as the {l} in the form.', 'Set the {l} in the form to "{v}".', 'Change the {l} to "{v}".',
        'Have the {l} in the form be "{v}".'
      ],
        { l: f.label.replace(/ \(.*\)$/, '').toLowerCase(), v: j.value }, S);
    }
    return I.phrase(rng, ['Set the {l} in the form to "{v}".', 'Enter "{v}" as the {l} in the form.', 'Change the {l} in the form to "{v}".'],
      { l: j.thing, v: j.value }, S);
  }

  // ---------------------------------------------------------------- task

  env.task({
    name: 'fill-form',
    scenarios: ['card', 'email', 'invoice', 'fix', 'receipt', 'idcard', 'claim'],
    judgeModes: ['ambiguous', 'impossible'],
    startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: (spec) => (spec && spec.layout && spec.layout.pdf ? ['pointer', 'keyboard', 'wheel'] : ['pointer', 'keyboard']),

    files: ['data.js', 'scan.js', 'scenarios/card.js', 'scenarios/email.js', 'scenarios/invoice.js',
      'scenarios/fix.js', 'scenarios/receipt.js', 'scenarios/idcard.js', 'scenarios/claim.js'],
    lib: { fieldOk, applyStep, formatOk, stepOf, kindOf, buildSpec, fixSpec },
    helpers: { wizardGo },

    sample(rng, opts) {
      let pool = opts.scenarios && opts.scenarios.length ? opts.scenarios : this.scenarios;
      const judgeMode = this.judgeModes.includes(opts.judge) ? opts.judge : null;
      if (judgeMode && !opts.scenario && pool.some((v) => v !== 'fix')) pool = pool.filter((v) => v !== 'fix');
      const scenario = opts.scenario || rng.pick(pool);
      const spec = env.scenariosOf('fill-form')[scenario].sample(rng, opts);
      if (judgeMode) {
        const j = judgeOf(rng.fork('judge'), spec, judgeMode);
        if (j) spec.judge = j;
      }
      return spec;
    },

    init(spec, rng) {
      const fields = {};
      const tab = spec.layout.startTab || 'form';
      const model = { fields, open: null, tab, seen: tab === 'doc' };
      if (spec.layout.wizard) { model.step = 0; model.errors = {}; }
      if (spec.keys !== undefined) model.focus = null;
      if (spec.layout.pdf) model.pdf = { top: 0, view: 0, max: 0, seen: 0, pos: {} };
      for (const f of spec.fields) {
        if (f.kind === 'checkbox') fields[f.id] = rng.bool(0.3);
        else if (f.kind === 'dropdown' && f.options.length && rng.bool(0.25)) fields[f.id] = rng.pick(f.options);
        else fields[f.id] = '';
      }
      const mode = spec.startMode;
      if (mode === 'partial') {
        const k = Math.max(1, Math.floor(spec.fields.length * rng.float(0.35, 0.65)));
        for (const f of rng.sample(spec.fields, k)) fields[f.id] = f.gold;
      } else if (mode === 'wrong') {
        // Most fields filled in, some of them wrong in a plausible way (the document's own format, a
        // neighbouring value, another option, a blank field filled in).
        const cand = spec.fields.filter((f) => f.kind === 'checkbox' || f.wrong.length);
        const nWrong = Math.max(1, Math.min(cand.length, rng.int(1, 3)));
        const bad = new Set(rng.sample(cand, nWrong).map((f) => f.id));
        for (const f of spec.fields) {
          if (bad.has(f.id)) fields[f.id] = f.kind === 'checkbox' ? !f.gold : rng.pick(f.wrong);
          else if (rng.bool(0.6)) fields[f.id] = f.gold;
        }
      }
      if (spec.scenario === 'fix') {
        // The gold form with the one disagreeing field (error 1/n) in every unsolved start.
        for (const f of spec.fields) fields[f.id] = f.id === spec.fix.id ? spec.fix.value : f.gold;
      }
      if (spec.judge) return this.solve(spec, model); // judge episodes start on the right form
      if (errorOf(model, spec) === 0) {
        const f = spec.fields.find((x) => x.kind !== 'checkbox' && x.gold !== '') || spec.fields[0];
        fields[f.id] = f.kind === 'checkbox' ? !f.gold : '';
      }
      return model;
    },

    error: errorOf,

    tolerance() {
      return { tau: 0, sigma: 0.25 };
    },

    instruction(spec, rng) {
      if (spec.judge) return judgeInstruction(spec, rng);
      const S = spec.isplit;
      const d = spec.docName;
      const fix = spec.scenario === 'fix';
      const core = fix ? I.phrase(rng, FIX[spec.fix.mode], { d, k: KIND_WORDS[spec.fix.kind] ? rng.pick(KIND_WORDS[spec.fix.kind]) : spec.fix.kind }, S)
        : I.phrase(rng, [...CORE.all, ...(CORE[spec.scenario] || [])], { d }, S);
      const tail = [];
      if (spec.layout.wizard) tail.push(I.pick(rng, REVIEW_CONTEXT, S));
      if (spec.layout.pdf && rng.bool(0.4)) tail.push(I.phrase(rng, SOURCE_CONTEXT, { d }, S));
      if (spec.layout.tabs && rng.bool(0.5)) tail.push(I.phrase(rng, SOURCE_CONTEXT, { d }, S));
      if (rng.bool(0.25)) tail.push(I.pick(rng, FINISH, S));
      const said = I.say(rng, core, { isplit: S, terse: fix ? `fix the form against the ${d}` : `copy the ${d} into the form`,
        steps: [`use the ${d} as the source`, 'complete the matching record', 'leave unavailable details blank'] });
      const text = tail.length ? [/[.!?]$/.test(said) ? said : `${said}.`, ...tail].join(' ') : said;
      return spec.redact ? `${text} ${I.phrase(rng, ['For privacy, leave the {l} field empty even though it appears on the document.',
        'Withhold the {l}: leave that field blank and copy the other details as usual.',
        'Do not record the {l}; keep that field empty while completing the rest.',
        'Copy the rest; clear the {l} and leave it blank despite the source value.',
        'Even if documented, erase any {l} entry and fill the other fields as usual.'], { l: spec.redact }, S)}` : text;
    },

    facts(model, spec) {
      return spec.fields.filter((f) => ['text', 'date', 'dropdown', 'radio'].includes(f.kind) && model.fields[f.id])
        .slice(0, 4).map((f) => {
          // No ', ' in the value (free-text replies split clauses there; the spellings compare equal); the original is an alias.
          const shown = String(model.fields[f.id]);
          const value = shown.replace(/[,;.]\s+/g, ' ');
          return value === shown ? { label: f.label, value } : { label: f.label, value, aliases: [shown] };
        });
    },

    // preempt=cancel: every field of the form by its label, with the value entered
    parts: (model, spec) => spec.fields.map((f) => ({ name: f.label, value: model.fields[f.id] === undefined ? '' : model.fields[f.id] })),

    silent(next, prev, spec, rng) {
      const pool = spec.fields.filter((f) => ['text', 'date'].includes(f.kind) && String(next.fields[f.id] || '').length > 1
        && next.fields[f.id] !== prev.fields[f.id] && fieldOk(f, next.fields[f.id]));
      if (!pool.length) return null;
      const f = rng.pick(pool);
      const out = env.util.clone(next);
      out.fields[f.id] = String(out.fields[f.id]).slice(0, -1);
      return errorOf(out, spec) > 0 ? out : null;
    },

    retarget(spec, model, rng) {
      if (spec.judge) return null;
      const pool = spec.fields.filter((f) => ['text', 'date'].includes(f.kind) && f.gold && model.fields[f.id]);
      if (!pool.length) return null;
      const f = rng.pick(pool);
      const out = env.util.clone(spec);
      const target = out.fields.find((x) => x.id === f.id);
      target.gold = '';
      target.required = false;
      target.wrong = [String(model.fields[f.id])];
      out.redact = f.label;
      return errorOf(model, out) > 0 ? out : null;
    },

    plan: planOf,

    solve(spec, model) {
      const fields = {};
      for (const f of spec.fields) fields[f.id] = f.gold;
      const out = { ...(model || {}), fields, open: null, tab: (model && model.tab) || spec.layout.startTab || 'form', seen: !!(model && model.seen) };
      if (spec.layout.wizard) { out.step = spec.layout.wizard.steps.length; out.errors = {}; }
      return out;
    },

  });
})();
