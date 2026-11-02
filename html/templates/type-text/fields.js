/*
 * templates / type-text / fields: the shared widget code of the design-type-text-* sites (taken from the reference
 * widget type-text/fields as those sites had it: a form card with native <input type=text|password> and
 * <textarea> elements). A site's widgets/type-text.js is only its design:
 *
 *   env.widget({ task: 'type-text', site, name: 'design', split, scenarios: ['transform'],
 *              template: 'type-text/fields', design: { title: 'Your Answer', layout: 'stacked', parts: { ... } } });
 *
 * Scenarios: single, transform, password, login, multi (textarea, copy and validation-fix run too, with the
 * same card). The defaults reproduce design-type-text-transform-02. VARIANTS holds what the sites of one scenario
 * share (applied to a widget that declares exactly that scenario, before its design); with design {} the template
 * reproduces, per scenario:
 *   transform  design-type-text-transform-02 (also -04, -10)       preset: none
 *   single     design-type-text-single-02 (also -04)               preset: layout 'stacked', title 'Your Answer'
 *   login      design-type-text-login-10                           preset: layout 'stacked'
 *   multi      design-type-text-multi-01                           preset: title 'Personal Information', scrollable
 *                                                               false, fit 'columns-scale'
 *   password   design-type-text-password-07                        preset: sample { layout: 'try' },
 *                                                               labelWithPlaceholder true
 *
 * Looks:
 *   fixed look   (default) the card's look comes from the tokens: one layout, fixed sizes (a site's frame
 *                frames the card; the card fills the stage width). No rng draws.
 *   sampled look (token sample, the password sites) the base widget's per-seed look: label style (above,
 *                inline left, two columns, floating label, placeholder-only labels), widths, heights, radii,
 *                underline vs boxed inputs, flat / ruled card, disabled look, texts, and the card's position
 *                inside the stage. Layouts are tried until the card fits the stage.
 * Fields are bound with env.ui.textField (masks, maxLength with a counter inside the field). Forms with an
 * in-app save (spec.save) have a submit button inside the <form>: a click or Enter in a one-line field runs
 * the task's validate(); errors show in a fixed-height slot under each field and a status line next to the
 * button. The focused field is mirrored into model.focus. Long forms (spec.long) scroll the page.
 * Widget CSS is the template's (ft-* classes, colors from the site's --panel, --line, --accent, --muted, --fg,
 * --bg); a site restyles it in its site.css.
 *
 * design tokens (defaults in TOKENS):
 *   layout          'inline'   fixed look: stacked | inline | columns | floating | placeholder
 *   disabled        'subtle'   fixed look: disabled fields look 'subtle' or 'grey'
 *   subtitle, hint  ''         fixed look: subtitle under the title; hint under the first password field
 *   foot            false      fixed look: login footer links ("Forgot password?" / "Need an account?")
 *   optional        true       "(optional)" after the label of a blank field
 *   flat, ruled, caps, underline, btnRight, ghost   false   fixed look: flat card, ruled title, uppercase
 *                              labels, underlined inputs, save button on the right, ghost save button
 *   vars            {}         fixed look: replaces entries of the card's custom properties (--ft-w, --ft-h,
 *                              --ft-gap, --ft-pad, --ft-r, --ft-fs, --ft-align); merged over the defaults
 *   okText          'Saved'    fixed look: the status line after a good save
 *   badText         'Please check your entries.'   fixed look: the status after a bad save
 *   idleText        ''         fixed look: the status before saving
 *   title           ''         fixed look: text of the card's h2 (null: the episode's spec.title)
 *   titleHidden     false      fixed look: hide the h2 (display none)
 *   cardWidth       '100%'     fixed look: the card's width (null: leave it)
 *   fit             null       fixed look: 'scale' shrinks the card with transform: scale() to fit the stage
 *                              height (top center); 'columns-scale' first switches an overflowing inline grid
 *                              to two columns, then scales
 *   scrollable      true       the page scrolls for long forms (false: never)
 *   errIn           'field'    where a field's error slot goes: 'field' (the field's wrapper) | 'box' (inside
 *                              the input's wrapper)
 *   label           null       text of every field label (null: the field's label + "(optional)" + labelSuffix)
 *   labelSuffix     ''         appended to a field label, after "(optional)"
 *   labelWithPlaceholder false draw the label above the input in the placeholder layout too
 *   floating        true       false: never a floating label (a floating layout draws labels above)
 *   gridClass       null       class of the field grid instead of the look's layout (null: the layout)
 *   placeholderLayout 'label'  in the placeholder layout the input's placeholder is 'label' (the label text),
 *                              '' (empty) or null (as in any layout)
 *   placeholderField true      a field's own placeholder: true (shown), false (hidden), or a string (shown
 *                              instead, where the field has one)
 *   placeholderAlways null     a string: every input gets this placeholder, whatever the layout and field
 *   emptyClass      null       class toggled on each input's wrapper while its field is empty
 *   sample          null       {} switches to the sampled look; {layout, first, margin, growShort} (merged over
 *                              the defaults below; a design's sample replaces the preset's whole):
 *                              layout  'stacked' (the reference draws every try stacked) | 'try' (the try's
 *                                      layout) | a layout name (always that one)
 *                              first   null | a layout name that replaces the sampled first choice (the rng
 *                                      still draws it)
 *                              margin  24: px kept free beside the card in the stage when fitting it
 *                              growShort true: a stage under 240 px high measures the window below it
 *
 * design.parts: { <part>: (base, S) => replacement } replaces a part (resolved by env.templateDesign: defaults,
 * scenario preset, design); the replacement takes the part's
 * arguments and may call base(...). S reads the live state: S.st (the page's state { ctx, spec, fam, host,
 * card, inputs: {id: {f, w, el, counter, err}}, save, status, okText, badText, idleText }), S.ctx, S.D
 * (tokens), S.P (the parts, overrides included), S.update(patch) (merges a patch into the model, repaints),
 * S.paint(model). An override must keep the rng draws of the part it replaces
 * (rng.int / pick / bool / float calls, in order), or every seed's episode changes. Parts:
 *   ensureStyle()              installs the shared ft-style stylesheet once (no return value)
 *   begin(ctx)                  render start: the page state exists (st.host is the stage); may change st.host
 *                               and add state to st (default: nothing)
 *   fixedCard(ctx) -> card      the fixed look: build, title, decorate, width, fit, finish
 *   sampledCard(ctx) -> card    the sampled look
 *   look(ctx) -> look           the fixed look object (tokens)
 *   build(ctx, look)            builds the card in st.host (sets st.card, st.inputs, st.save, st.status)
 *   heading(ctx, card)          the h2 (default: spec.title)
 *   field(ctx, look, f, i, grid)   builds one field; e is its record { f, i, ta, id, wrap, floating, text,
 *                               label, box, el, counter, err }
 *   labelText(f, look) -> text  label text of a field        labelClass(text, look) -> class of a label above
 *   labelAbove(look, floating) / labelInside(look, floating) -> bool   where a field's label is drawn
 *   makeBox(e) -> el            the input's wrapper (ft-inwrap)
 *   placeholder(f, text, look, floating) -> string | undefined   the input's placeholder (undefined: none)
 *   bindFocus(ctx, f, el)       mirrors focus into model.focus
 *   fieldDone(ctx, e, look)     after each field is built (default: nothing)
 *   beforeFields(ctx, grid, look)  before the first field (default: nothing)
 *   afterFields(ctx, grid, look)   after all fields (default: nothing)
 *   saveButton(ctx, btn, row, card)  after the save button and status line exist (default: nothing)
 *   decorate(ctx, card)         fixed look: after the title, before the width (default: nothing)
 *   fit(ctx, card)              fixed look: fits the card to the stage (default: the fit token)
 *   finish(ctx, card)           fixed look: after fit; sampled look: after the card is placed (default: nothing)
 *   anchors(ctx, card) -> [el]  the render's anchors (default: the card)
 *   settle(ctx, size)           sampled look: after the layout is chosen, before the card is placed
 *   stageBox(ctx) -> {width, height, host}   the stage box of the sampled look
 *   paintInput(x, id, m)        each input after the model changed (default: emptyClass)
 *   painted(m)                  after the page was painted for model m (default: nothing)
 *   clear()                     empties the enabled fields (a site's Clear button calls env.widgetDef.clear())
 *   locate(t) -> [x, y]         viewport point of a plan target
 */
(function () {
  'use strict';

  const CSS = `
  .ft-card {
    flex: none; position: relative; padding: var(--ft-pad) calc(var(--ft-pad) + 4px);
    border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
    box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 18px rgba(0,0,0,.06);
  }
  .ft-card.flat { box-shadow: none; border-radius: 6px; }
  .ft-card h2 { margin: 0 0 4px; font-size: 21px; font-weight: 700; letter-spacing: -.01em; }
  .ft-sub { margin: 0 0 16px; color: var(--muted); font-size: 14px; }
  .ft-card.ruled h2 { padding-bottom: 10px; margin-bottom: 16px; border-bottom: 1px solid var(--line); }
  .ft-card.ruled .ft-sub { margin-top: -8px; }
  .ft-grid { display: grid; column-gap: 22px; row-gap: var(--ft-gap); align-items: center; }
  .ft-grid.stacked, .ft-grid.floating, .ft-grid.placeholder { grid-template-columns: var(--ft-w); }
  .ft-grid.columns { grid-template-columns: var(--ft-w) var(--ft-w); align-items: start; }
  .ft-grid.columns .ft-wide { grid-column: 1 / -1; }
  .ft-grid.inline { grid-template-columns: max-content var(--ft-w); column-gap: 16px; }
  .ft-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .ft-grid.inline .ft-field { display: contents; }
  .ft-label { font-size: 14px; font-weight: 600; color: var(--fg); }
  .ft-grid.inline .ft-label { text-align: var(--ft-align); align-self: start; padding-top: calc(var(--ft-h) / 2 - 9px); }
  .ft-label.caps { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .ft-inwrap { position: relative; min-width: 0; }
  .ft-input {
    display: block; width: 100%; height: var(--ft-h); padding: 0 12px; margin: 0;
    border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: var(--ft-r);
    background: color-mix(in srgb, var(--panel) 70%, var(--bg)); color: var(--fg);
    font: inherit; font-size: var(--ft-fs); outline: none;
    user-select: text; -webkit-user-select: text; caret-color: var(--accent);
  }
  textarea.ft-input { height: auto; padding: 9px 12px; line-height: 1.35; resize: none; }
  .ft-input.counted { padding-right: 64px; }
  textarea.ft-input.counted { padding-right: 12px; padding-bottom: 22px; }
  .ft-input.underline { border-width: 0 0 2px; border-radius: 0; background: transparent; padding-left: 2px; padding-right: 2px; }
  .ft-input::placeholder { color: var(--muted); opacity: .75; }
  .ft-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent); }
  .ft-input.underline:focus { box-shadow: none; }
  .ft-input[type=password] { letter-spacing: .12em; }
  .ft-input:disabled { cursor: not-allowed; }
  .ft-card.dis-grey .ft-input:disabled { background: color-mix(in srgb, var(--muted) 14%, var(--panel)); color: var(--muted); border-style: dashed; }
  .ft-card.dis-subtle .ft-input:disabled { color: color-mix(in srgb, var(--fg) 70%, var(--muted)); opacity: .9; }
  .ft-input.bad { border-color: #d6336c; }
  .ft-count { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; color: var(--muted); pointer-events: none; font-variant-numeric: tabular-nums; }
  .ft-inwrap.ta .ft-count { top: auto; bottom: 6px; transform: none; }
  .ft-count.full { color: #d6336c; font-weight: 600; }
  .ft-err { height: 16px; margin-top: -3px; font-size: 12.5px; line-height: 16px; color: #d6336c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ft-grid.inline .ft-err { grid-column: 2; margin-top: calc(-1 * var(--ft-gap) + 2px); }
  .ft-hint { font-size: 12.5px; color: var(--muted); }
  .ft-grid.inline .ft-hint { grid-column: 2; margin-top: calc(-1 * var(--ft-gap) + 4px); }

  /* floating labels: the label sits inside the field and moves to its top edge when focused or filled */
  .ft-grid.floating .ft-field { gap: 0; }
  .ft-grid.floating .ft-input { height: calc(var(--ft-h) + 10px); padding-top: 14px; }
  .ft-grid.floating textarea.ft-input { padding-top: 22px; }
  .ft-grid.floating .ft-label {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%); z-index: 1; pointer-events: none;
    font-weight: 500; color: var(--muted); font-size: var(--ft-fs);
  }
  .ft-grid.floating .ft-inwrap.ta .ft-label { top: 18px; }
  .ft-grid.floating .ft-input:focus + .ft-label, .ft-grid.floating .ft-input:not(:placeholder-shown) + .ft-label,
  .ft-grid.floating .ft-input:disabled + .ft-label {
    top: 12px; font-size: 11.5px; font-weight: 600; letter-spacing: .02em;
  }
  .ft-grid.floating .ft-inwrap.ta .ft-input:focus + .ft-label, .ft-grid.floating .ft-inwrap.ta .ft-input:not(:placeholder-shown) + .ft-label { top: 10px; }
  .ft-grid.floating .ft-input:focus + .ft-label { color: var(--accent); }

  .ft-actions { display: flex; align-items: center; gap: 14px; margin-top: 16px; min-width: 0; }
  .ft-actions.right { flex-direction: row-reverse; }
  .ft-save {
    flex: none; height: 38px; padding: 0 18px; border: 0; border-radius: var(--ft-r); cursor: pointer;
    font: inherit; font-size: 15px; font-weight: 600; color: #fff; background: var(--accent);
  }
  .ft-save.ghost { background: transparent; color: var(--accent); border: 1.5px solid var(--accent); }
  .ft-status { flex: 1; min-width: 0; font-size: 13.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--muted); }
  .ft-actions.right .ft-status { text-align: right; }
  .ft-status.ok { color: #2b8a3e; font-weight: 600; }
  .ft-status.bad { color: #d6336c; font-weight: 600; }
  .ft-foot { display: flex; justify-content: space-between; margin-top: 14px; font-size: 13.5px; color: var(--muted); }
  .ft-foot .ft-link { color: var(--accent); }
  `;

  const SUBTITLES = {
    single: ['Fill in the field below.', 'Text is case sensitive.', ''],
    transform: ['Text is case sensitive.', 'Mind the exact spelling.', ''],
    password: ['Use letters, numbers and symbols.', 'Both entries must match.', ''],
    login: ['Use your account credentials.', 'Enter your details to continue.', ''],
    multi: ['Please check your entries.', 'All information is kept private.', ''],
    textarea: ['Line breaks are kept.', 'We will print this on the label.', ''],
    copy: ['Please review before continuing.', 'Required fields are marked.', ''],
    'validation-fix': ['Your changes have not been saved.', 'Please review the highlighted field.', ''],
  };

  const TOKENS = {
    layout: 'inline',
    disabled: 'subtle',
    subtitle: '',
    hint: '',
    foot: false,
    optional: true,
    flat: false,
    ruled: false,
    caps: false,
    underline: false,
    btnRight: false,
    ghost: false,
    vars: {},
    okText: 'Saved',
    badText: 'Please check your entries.',
    idleText: '',
    title: '',
    titleHidden: false,
    cardWidth: '100%',
    fit: null,
    scrollable: true,
    errIn: 'field',
    label: null,
    labelSuffix: '',
    labelWithPlaceholder: false,
    floating: true,
    gridClass: null,
    placeholderLayout: 'label',
    placeholderField: true,
    placeholderAlways: null,
    emptyClass: null,
    sample: null,
  };
  const VARS = { '--ft-w': '100%', '--ft-h': '38px', '--ft-gap': '12px', '--ft-pad': '26px', '--ft-r': '3px', '--ft-fs': '16px', '--ft-align': 'left' };
  const SAMPLE = { layout: 'stacked', first: null, margin: 24, growShort: true };

  // What the sites of one scenario share (applied to widgets that declare exactly that scenario, before their design).
  const SCENARIOS = {
    transform: {},
    single: { layout: 'stacked', title: 'Your Answer' },
    login: { layout: 'stacked' },
    multi: { title: 'Personal Information', scrollable: false, fit: 'columns-scale' },
    password: { sample: { layout: 'try' }, labelWithPlaceholder: true },
  };

  env.template('type-text/fields', (design, def) => {
    let D, P; // tokens and parts, resolved below
    let st = null; // { ctx, spec, fam, host, card, inputs: {id: {f, w, el, counter, err}}, save, status }
    const BASE = {};
    const S = { get st() { return st; }, get ctx() { return st && st.ctx; }, get D() { return D; }, get P() { return P; },
      update: (patch) => update(patch), paint: (m) => paint(m) };

    // ---------------------------------------------------------------- model updates

    function update(patch) {
      st.ctx.update({ ...st.ctx.model, ...patch });
      paint(st.ctx.model);
    }

    function paint(m) {
      for (const [id, x] of Object.entries(st.inputs)) {
        P.paintInput(x, id, m);
        if (x.counter) {
          const n = st.fam.helpers.countOf(x.f, m.fields[id]);
          x.counter.textContent = `${n}/${x.f.maxLength}`;
          x.counter.classList.toggle('full', n >= x.f.maxLength);
        }
        if (x.err) {
          const msg = (m.errors || {})[id] || '';
          x.err.textContent = msg;
          x.el.classList.toggle('bad', !!msg);
        }
      }
      if (st.status) {
        const errs = m.errors || {};
        const n = Object.keys(errs).length;
        st.status.className = 'ft-status' + (m.saved ? ' ok' : n ? ' bad' : '');
        st.status.textContent = m.saved ? st.okText : errs._form ? errs._form : n ? st.badText : st.idleText;
      }
      P.painted(m);
    }

    function doSave() {
      const errs = st.fam.helpers.validate(st.spec, st.ctx.model.fields);
      const ok = !Object.keys(errs).length;
      st.ctx.log('save', { ok });
      update({ saved: ok, errors: errs });
    }

    // ---------------------------------------------------------------- page

    BASE.ensureStyle = () => {
      if (document.getElementById('ft-style')) return;
      const s = document.createElement('style');
      s.id = 'ft-style';
      s.textContent = CSS;
      document.head.append(s);
    };

    // The stage box. A scrollable page's stage can shrink to its content (flex: none) and report width 0
    // before anything is drawn; then measure the free space of its row and give the widget a host of that
    // width, so the stage takes it.
    BASE.stageBox = (ctx) => {
      let { width, height } = ctx.size;
      let host = ctx.stage;
      if (width < 240 && ctx.stage.parentElement) {
        const p = ctx.stage.parentElement;
        width = p.clientWidth;
        for (const c of p.children) {
          if (c === ctx.stage) continue;
          const cs = getComputedStyle(c);
          width -= c.getBoundingClientRect().width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
        }
        width -= 8; // room for a page scrollbar
        host = ctx.util.el('div', '', ctx.stage);
        host.style.cssText = `width:${Math.floor(width)}px;display:flex;align-items:flex-start;justify-content:center;`;
      }
      if (D.sample.growShort && height < 240) height = Math.max(240, window.innerHeight - ctx.stage.getBoundingClientRect().top);
      return { width, height, host };
    };

    BASE.begin = () => {};
    BASE.decorate = () => {};
    BASE.finish = () => {};
    BASE.settle = () => {};
    BASE.painted = () => {};
    BASE.fieldDone = () => {};
    BASE.beforeFields = () => {};
    BASE.afterFields = () => {};
    BASE.saveButton = () => {};
    BASE.anchors = (ctx, card) => [card];

    BASE.paintInput = (x, id, m) => {
      if (D.emptyClass) x.el.parentElement.classList.toggle(D.emptyClass, !(m.fields[id] ?? ''));
    };

    // The fixed look: the tokens make the look; the card fills the stage.
    BASE.look = () => ({
      layout: D.layout,
      disabled: D.disabled,
      subtitle: D.subtitle,
      hint: D.hint,
      foot: D.foot,
      optional: D.optional,
      flat: D.flat,
      ruled: D.ruled,
      caps: D.caps,
      underline: D.underline,
      btnRight: D.btnRight,
      ghost: D.ghost,
      vars: D.vars,
    });

    BASE.fit = (ctx, card) => {
      if (!D.fit) return;
      if (D.fit === 'columns-scale' && card.offsetHeight > ctx.size.height - 6) {
        const grid = card.querySelector('.ft-grid');
        grid.classList.remove('inline');
        grid.classList.add('columns');
        grid.style.setProperty('grid-template-columns', '1fr 1fr', 'important');
      }
      const cr = card.getBoundingClientRect();
      const ratio = Math.min(1, (ctx.size.height - 8) / cr.height);
      if (ratio < 1) {
        card.style.setProperty('transform', `scale(${ratio})`, 'important');
        card.style.transformOrigin = 'top center';
      }
    };

    BASE.fixedCard = (ctx) => {
      st.okText = D.okText;
      st.badText = D.badText;
      st.idleText = D.idleText;
      P.build(ctx, P.look(ctx));
      if (D.title !== null) st.card.querySelector('h2').textContent = D.title;
      if (D.titleHidden) st.card.querySelector('h2').style.display = 'none';
      const card = st.card;
      P.decorate(ctx, card);
      if (D.cardWidth !== null) card.style.width = D.cardWidth;
      P.fit(ctx, card);
      P.finish(ctx, card);
      return card;
    };

    // The sampled look: sample the look, try layouts until the card fits the stage, place it at a seeded spot.
    BASE.sampledCard = (ctx) => {
      const { spec, rng } = ctx;
      const size = P.stageBox(ctx);
      st.host = size.host;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const n = spec.fields.length;
      const many = n >= 3;
      const allEmpty = spec.fields.every((f) => !f.disabled && !(ctx.model.fields[f.id] || '').length);
      const hasTa = spec.fields.some((f) => f.type === 'textarea');
      const layouts = ['stacked', 'stacked', 'floating', 'inline'];
      if (many) layouts.push('columns', 'columns');
      if (allEmpty && !hasTa) layouts.push('placeholder');
      const picked = rng.pick(layouts);
      const first = D.sample.first || picked;
      const base = {
        flat: rng.bool(0.25),
        ruled: rng.bool(0.35),
        caps: rng.bool(0.2),
        underline: rng.bool(0.2),
        subtitle: rng.pick(SUBTITLES[spec.scenario] || ['']),
        hint: rng.pick(['Use 8 or more characters.', 'Must include a number and a symbol.', '']),
        foot: rng.bool(0.6),
        optional: rng.bool(0.5),
        disabled: rng.pick(['grey', 'grey', 'subtle']),
        btnRight: rng.bool(0.3),
        ghost: rng.bool(0.25),
        h: rng.int(34, 44),
        gap: rng.int(12, 20),
        pad: rng.int(22, 32),
        r: rng.pick([3, 4, 6, 8]),
        fs: rng.pick([15, 16, 17]),
        w: many ? rng.int(230, 330) : rng.int(270, 460),
        align: rng.pick(['left', 'right']),
      };
      st.okText = rng.pick(['✓ Saved', 'Changes saved.', '✓ Signed in', 'All set - saved.']);
      if (spec.scenario === 'login') st.okText = rng.pick(['✓ Signed in', 'Welcome back!']);
      st.badText = rng.pick(['Please fix the errors above.', 'Check the highlighted field.', 'Could not save.']);
      st.idleText = spec.scenario === 'validation-fix' ? 'Not saved: 1 error.' : '';
      // Try the sampled layout first, then the others, then tighter spacing until the card fits the stage.
      const order = [first, ...['stacked', 'columns', 'inline', 'floating'].filter((l) => l !== first && (l !== 'columns' || many))];
      const tries = [];
      for (const squeeze of [0, 1, 2]) for (const layout of order) tries.push({ layout, squeeze });
      const maxH = size.height - 16;
      const maxW = size.width - D.sample.margin;
      for (const t of tries) {
        const s = t.squeeze;
        const look = {
          ...base,
          layout: D.sample.layout === 'try' ? t.layout : D.sample.layout,
          subtitle: s >= 1 ? '' : base.subtitle,
          vars: {
            '--ft-h': `${s >= 2 ? Math.min(base.h, 34) : base.h}px`,
            '--ft-gap': `${s >= 1 ? Math.min(base.gap, 10) : base.gap}px`,
            '--ft-pad': `${s >= 2 ? 16 : base.pad}px`,
            '--ft-r': `${base.r}px`,
            '--ft-fs': `${base.fs}px`,
            '--ft-w': `${Math.min(t.layout === 'columns' ? Math.min(base.w, 270) : base.w, Math.floor((maxW - 80) / (t.layout === 'columns' ? 2 : 1)) - (t.layout === 'inline' ? 140 : 0))}px`,
            '--ft-align': base.align,
          },
        };
        st.host.replaceChildren();
        P.build(ctx, look);
        const r = st.card.getBoundingClientRect();
        if ((spec.long || r.height <= maxH) && r.width <= maxW) break;
      }
      P.settle(ctx, size);
      // Place the card at a seeded spot inside the stage rectangle (stage-relative, whatever the frame).
      const card = st.card;
      // Freeze the card's width so status and error texts that appear later cannot widen it.
      card.style.boxSizing = 'border-box';
      card.style.width = `${Math.ceil(card.getBoundingClientRect().width)}px`;
      const sr = ctx.stage.getBoundingClientRect();
      const r = card.getBoundingClientRect();
      const span = (lo, hi) => (hi > lo ? [lo, hi] : [(lo + hi) / 2, (lo + hi) / 2]);
      const [x0, x1] = span(sr.left + 8 - r.left, sr.right - 8 - r.right);
      const [y0, y1] = spec.long ? span(sr.top + 8 - r.top, Math.max(sr.top + 8 - r.top, sr.bottom - 8 - r.bottom))
        : span(sr.top + 6 - r.top, sr.bottom - 6 - r.bottom);
      const dx = Math.round(rng.float(x0, x1));
      const dy = Math.round(rng.float(y0, y1));
      card.style.transform = `translate(${dx}px, ${dy}px)`;
      P.finish(ctx, card);
      return card;
    };

    // ---------------------------------------------------------------- build

    BASE.heading = (ctx, card) => {
      ctx.util.el('h2', '', card, ctx.spec.title);
    };

    BASE.labelText = (f, look) => D.label ?? f.label + (look.optional && f.blank ? ' (optional)' : '') + D.labelSuffix;
    BASE.labelClass = (text, look) => 'ft-label' + (look.caps ? ' caps' : '');
    BASE.labelAbove = (look, floating) => (D.labelWithPlaceholder || look.layout !== 'placeholder') && !floating;
    BASE.labelInside = (look, floating) => floating;
    BASE.makeBox = (e) => st.ctx.util.el('div', 'ft-inwrap' + (e.ta ? ' ta' : ''), e.wrap);

    BASE.placeholder = (f, text, look, floating) => {
      if (look.layout === 'placeholder' && D.placeholderLayout !== null) return D.placeholderLayout === 'label' ? text : D.placeholderLayout;
      if (floating) return ' ';
      if (f.placeholder && D.placeholderField !== false) return D.placeholderField === true ? f.placeholder : D.placeholderField;
      return undefined;
    };

    BASE.bindFocus = (ctx, f, el) => {
      el.addEventListener('focus', () => { if (st.ctx.model.focus !== f.id) update({ focus: f.id }); });
      el.addEventListener('blur', () => { if (st.ctx.model.focus === f.id) update({ focus: null }); });
    };

    BASE.field = (ctx, look, f, i, grid) => {
      const { spec, util } = ctx;
      const ta = f.type === 'textarea';
      const wrap = util.el('div', 'ft-field' + (ta || (f.maxLength && f.maxLength > 30) ? ' ft-wide' : ''), grid);
      const id = `ft-${f.id}`;
      const floating = D.floating && look.layout === 'floating';
      const e = { f, i, ta, id, wrap, floating, text: P.labelText(f, look), label: null, box: null, el: null, counter: null, err: null };
      if (P.labelAbove(look, floating)) {
        e.label = util.el('label', P.labelClass(e.text, look), wrap, e.text);
        e.label.htmlFor = id;
      }
      e.box = P.makeBox(e);
      const el = e.el = util.el(ta ? 'textarea' : 'input', 'ft-input' + (look.underline && !ta ? ' underline' : '') + (f.counter ? ' counted' : ''), e.box);
      if (P.labelInside(look, floating)) {
        e.label = util.el('label', 'ft-label', e.box, e.text);
        e.label.htmlFor = id;
      }
      el.id = id;
      el.name = f.id;
      if (ta) el.rows = f.rows || 4;
      else el.type = f.type === 'password' ? 'password' : 'text';
      el.autocomplete = f.type === 'password' ? 'new-password' : 'off';
      el.spellcheck = false;
      el.setAttribute('autocapitalize', 'off');
      el.setAttribute('autocorrect', 'off');
      el.setAttribute('aria-label', f.label);
      el.dataset.role = 'field';
      el.dataset.field = f.id;
      const ph = P.placeholder(f, e.text, look, floating);
      if (ph !== undefined) el.placeholder = ph;
      if (D.placeholderAlways !== null) el.placeholder = D.placeholderAlways;
      if (f.disabled) el.disabled = true;
      if (f.counter) e.counter = util.el('span', 'ft-count', e.box);
      const w = env.ui.textField(el, {
        value: ctx.model.fields[f.id] ?? '',
        label: f.id,
        ...(f.mask ? { mask: f.mask } : {}),
        ...(f.maxLength ? { maxLength: f.maxLength } : {}),
        onInput: (v) => update({ fields: { ...st.ctx.model.fields, [f.id]: v }, saved: false }),
      });
      P.bindFocus(ctx, f, el);
      e.err = spec.save && !f.disabled ? util.el('div', 'ft-err', D.errIn === 'box' ? e.box : wrap) : null;
      st.inputs[f.id] = { f, w, el, counter: e.counter, err: e.err };
      if (spec.scenario === 'password' && i === 0 && look.hint && !spec.save) util.el('div', 'ft-hint', wrap, look.hint);
      P.fieldDone(ctx, e, look);
    };

    BASE.build = (ctx, look) => {
      const { spec, util } = ctx;
      const stage = st.host;
      const card = util.el('form', `ft-card dis-${look.disabled}` + (look.flat ? ' flat' : '') + (look.ruled ? ' ruled' : ''), stage);
      card.dataset.role = 'form';
      card.autocomplete = 'off';
      card.noValidate = true;
      card.addEventListener('submit', (e) => {
        e.preventDefault();
        if (spec.save) doSave();
      });
      for (const [k, v] of Object.entries(look.vars)) card.style.setProperty(k, v);
      P.heading(ctx, card);
      if (look.subtitle) util.el('p', 'ft-sub', card, look.subtitle);
      const grid = util.el('div', `ft-grid ${D.gridClass ?? look.layout}`, card);
      st.card = card;
      st.inputs = {};
      P.beforeFields(ctx, grid, look);
      spec.fields.forEach((f, i) => P.field(ctx, look, f, i, grid));
      P.afterFields(ctx, grid, look);
      st.save = null;
      st.status = null;
      if (spec.save) {
        const row = util.el('div', 'ft-actions' + (look.btnRight ? ' right' : ''), card);
        const btn = util.el('button', 'ft-save' + (look.ghost ? ' ghost' : ''), row, spec.saveLabel);
        btn.type = 'submit';
        btn.dataset.role = 'save';
        st.save = btn;
        st.status = util.el('span', 'ft-status', row);
        P.saveButton(ctx, btn, row, card);
      }
      if (spec.scenario === 'login' && look.foot) {
        const foot = util.el('div', 'ft-foot', card);
        util.el('span', 'ft-link', foot, 'Forgot password?');
        util.el('span', '', foot, 'Need an account?');
      }
      paint(ctx.model);
      return card;
    };

    BASE.clear = () => {
      if (!st) return;
      const fields = { ...st.ctx.model.fields };
      for (const [id, x] of Object.entries(st.inputs)) {
        if (!x.f.disabled) {
          fields[id] = '';
          x.w.set('');
        }
      }
      update({ fields, saved: false, errors: {} });
    };

    BASE.locate = (t) => {
      if (t.field !== undefined && st.inputs[t.field]) {
        const el = st.inputs[t.field].el;
        const r = el.getBoundingClientRect();
        // Left of centre: away from the counter and (floating mode) on the input, not on its label.
        return [r.left + Math.min(r.width * 0.4, 140), r.top + r.height * (el.tagName === 'TEXTAREA' ? 0.55 : 0.6)];
      }
      if (t.save && st.save) return st.ctx.util.center(st.save);
      throw new Error(`type-text/fields cannot locate ${JSON.stringify(t)}`);
    };

    ({ D, P } = env.templateDesign('type-text/fields', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    for (const k of Object.keys(D.sample || {})) if (!(k in SAMPLE)) throw new Error(`type-text/fields: unknown sample token '${k}'`);
    D.vars = { ...VARS, ...D.vars };
    D.sample = D.sample ? { ...SAMPLE, ...D.sample } : null;

    return {
      ...(D.scrollable ? { scrollable: (spec) => !!spec.long } : {}),

      render(ctx) {
        P.ensureStyle();
        st = { ctx, spec: ctx.spec, fam: env.taskDef, host: ctx.stage };
        P.begin(ctx);
        const card = D.sample ? P.sampledCard(ctx) : P.fixedCard(ctx);
        return {
          anchors: P.anchors(ctx, card),
          sync(m) {
            for (const [id, x] of Object.entries(st.inputs)) x.w.set(m.fields[id] ?? '');
            paint(m);
          },
        };
      },

      clear() { return P.clear(); },

      locate(t) { return P.locate(t); },
    };
  });
})();
