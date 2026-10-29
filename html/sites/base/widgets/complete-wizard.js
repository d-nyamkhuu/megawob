/*
 * reference / wizard / stepper: a multi-step form card. One panel per step plus a summary and a
 * confirmation panel; only the current one is shown. Varies per seed: the step indicator (numbered
 * circles, pills, "Step 2 of 4" with a progress bar, or a vertical list beside the form), field layout
 * (1-2 columns, labels above or beside), radio rows vs option tiles, checkboxes vs switches, footer button
 * arrangement, card look and its position in the stage. The card has a fixed size (the largest panel), so
 * the anchor never moves. Every interaction goes through env.familyDef.helpers.apply(), so widget, plan and selfTest
 * agree. Enter in a text field acts like the primary button. Dropdowns use env.ui.dropdown.
 */
(function () {
  'use strict';

  const CSS = `
  .wz-card { position: relative; flex: none; display: flex; flex-direction: column; background: var(--panel);
    border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.07);
    padding: var(--wz-pad); gap: var(--wz-gap2); }
  .wz-card.flat { box-shadow: none; border-radius: 4px; }
  .wz-card.side-layout { flex-direction: row; gap: 22px; }
  .wz-main { display: flex; flex-direction: column; gap: var(--wz-gap2); min-width: 0; flex: 1; }
  .wz-title { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -.01em; }
  .wz-ind { display: flex; align-items: center; gap: 6px; margin: 0; padding: 0; list-style: none; font-size: 13px; color: var(--muted); }
  .wz-ind li { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
  .wz-ind li.jump { cursor: pointer; color: var(--accent); }
  .wz-ind li.jump:hover .wz-ind-t { text-decoration: underline; }
  .wz-ind .wz-dot { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
    border: 2px solid var(--line); font-weight: 700; font-size: 12px; color: var(--muted); background: var(--panel); flex: none; }
  .wz-ind li.cur { color: var(--fg); font-weight: 650; }
  .wz-ind li.cur .wz-dot { border-color: var(--accent); color: var(--accent); }
  .wz-ind li.done .wz-dot { background: var(--accent); border-color: var(--accent); color: #fff; }
  .wz-ind .wz-sep { flex: 1; min-width: 10px; height: 2px; background: var(--line); }
  .wz-ind.pills { gap: 4px; flex-wrap: nowrap; }
  .wz-ind.pills li { padding: 5px 10px; border-radius: 99px; border: 1px solid var(--line); }
  .wz-ind.pills li.cur { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); border-color: var(--accent); }
  .wz-ind.pills li.done { color: var(--fg); }
  .wz-prog { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--muted); }
  .wz-prog-row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; white-space: nowrap; height: 20px; overflow: hidden; }
  .wz-prog-row > span:first-child { overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .wz-prog-back { flex: none; }
  .wz-prog-row b { color: var(--fg); font-size: 14px; }
  .wz-prog-bar { height: 6px; border-radius: 99px; background: var(--line); overflow: hidden; }
  .wz-prog-fill { height: 100%; background: var(--accent); border-radius: 99px; }
  .wz-prog-back { color: var(--accent); cursor: pointer; }
  .wz-ind.side { flex-direction: column; align-items: stretch; gap: 4px; width: 168px; flex: none; padding-right: 18px;
    border-right: 1px solid var(--line); }
  .wz-ind.side li { padding: 7px 8px; border-radius: 6px; }
  .wz-ind.side li.cur { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
  .wz-body { position: relative; }
  .wz-panel[hidden] { display: none; }
  .wz-panel h3 { margin: 0 0 10px; font-size: 16px; font-weight: 650; }
  .wz-alert { margin: -2px 0 10px; padding: 7px 10px; border-radius: 6px; font-size: 13px;
    background: color-mix(in srgb, #d63939 12%, var(--panel)); color: color-mix(in srgb, #d63939 75%, var(--fg));
    border: 1px solid color-mix(in srgb, #d63939 40%, var(--line)); }
  .wz-alert.off { display: none; }
  .wz-grid { display: grid; grid-template-columns: repeat(var(--wz-cols), minmax(0, 1fr)); column-gap: 18px; row-gap: var(--wz-gap); }
  .wz-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; position: relative; }
  .wz-field.wide { grid-column: 1 / -1; }
  .wz-field.inline { display: grid; grid-template-columns: var(--wz-lw) minmax(0, 1fr); column-gap: 12px; align-items: center; }
  .wz-field.inline > .wz-err, .wz-field.inline > .wz-hint { grid-column: 2; }
  .wz-label { font-size: 13.5px; font-weight: 600; }
  .wz-label .req { color: #d63939; margin-left: 2px; }
  .wz-input { width: 100%; height: var(--wz-h); padding: 0 10px; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    border-radius: var(--wz-r); background: color-mix(in srgb, var(--panel) 75%, var(--bg)); color: var(--fg); font: inherit;
    font-size: 14.5px; outline: none; user-select: text; -webkit-user-select: text; }
  .wz-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
  .wz-field.bad .wz-input, .wz-field.bad .wz-trigger { border-color: #d63939; }
  .wz-err { min-height: 15px; font-size: 12px; line-height: 15px; color: #d63939; }
  .wz-hint { font-size: 12px; color: var(--muted); margin-top: -2px; }
  .wz-opts { display: flex; flex-direction: column; gap: 4px; }
  .wz-opts.row { flex-direction: row; flex-wrap: wrap; gap: 6px 16px; }
  .wz-radio { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
  .wz-radio input { margin: 0; width: 16px; height: 16px; accent-color: var(--accent); }
  .wz-radio .price { margin-left: auto; color: var(--muted); font-size: 13px; padding-left: 12px; }
  .wz-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; }
  .wz-tile { padding: 7px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); color: var(--fg);
    font: inherit; font-size: 13.5px; text-align: left; cursor: pointer; line-height: 1.25; }
  .wz-tile .price { display: block; color: var(--muted); font-size: 12px; }
  .wz-tile[aria-checked=true] { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent);
    background: color-mix(in srgb, var(--accent) 10%, var(--panel)); }
  .wz-check { display: flex; align-items: center; gap: 9px; font-size: 14px; cursor: pointer; }
  .wz-check input { margin: 0; width: 17px; height: 17px; accent-color: var(--accent); }
  .wz-switch { width: 38px; height: 22px; border-radius: 99px; border: 0; padding: 0; background: var(--line); position: relative;
    cursor: pointer; flex: none; }
  .wz-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%;
    background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.3); transition: left .12s; }
  .wz-switch[aria-checked=true] { background: var(--accent); }
  .wz-switch[aria-checked=true]::after { left: 19px; }
  .wz-trigger { width: 100%; height: var(--wz-h); padding: 0 30px 0 10px; text-align: left; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line));
    border-radius: var(--wz-r); background: var(--panel); color: var(--fg); font: inherit; font-size: 14.5px; cursor: pointer; position: relative; }
  .wz-trigger::after { content: "▾"; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: var(--muted); }
  .wz-trigger.empty { color: var(--muted); }
  .wz-pop { position: absolute; left: 0; right: 0; z-index: 30; padding: 4px; background: var(--panel); border: 1px solid var(--line);
    border-radius: 8px; box-shadow: 0 10px 28px rgba(0,0,0,.18); }
  .wz-pop[hidden] { display: none; }
  .wz-opt { padding: 6px 10px; border-radius: 5px; font-size: 14px; cursor: pointer; }
  .wz-opt:hover { background: color-mix(in srgb, var(--accent) 12%, var(--panel)); }
  .wz-opt.sel { font-weight: 650; color: var(--accent); }
  .wz-review { display: grid; grid-template-columns: repeat(var(--wz-rcols), minmax(0, 1fr)); gap: 10px 16px; }
  .wz-group { border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; min-width: 0; }
  .wz-group-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-weight: 650; font-size: 13.5px; }
  .wz-edit { color: var(--accent); font-weight: 600; font-size: 13px; cursor: pointer; padding: 2px 4px; text-decoration: none; }
  .wz-edit:hover { text-decoration: underline; }
  .wz-row { display: flex; gap: 8px; font-size: 13px; line-height: 1.35; padding: 1px 0; }
  .wz-row .k { color: var(--muted); flex: 0 0 42%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .wz-row .v { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .wz-row .v.empty { color: var(--muted); font-style: italic; }
  .wz-done { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; height: 100%; padding: 10px; }
  .wz-done .ok { width: 54px; height: 54px; border-radius: 50%; background: color-mix(in srgb, #2f9e44 18%, var(--panel)); color: #2f9e44;
    display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 700; }
  .wz-done h3 { margin: 0; font-size: 19px; }
  .wz-done p { margin: 0; color: var(--muted); font-size: 14px; }
  .wz-facts { display: grid; grid-template-columns: auto auto; gap: 2px 14px; font-size: 13.5px; text-align: left; }
  .wz-facts .k { color: var(--muted); }
  .wz-facts .v { font-weight: 650; font-variant-numeric: tabular-nums; }
  .wz-reopen { color: var(--accent); cursor: pointer; font-weight: 600; font-size: 14px; }
  .wz-foot { display: flex; align-items: center; gap: 10px; padding-top: 12px; border-top: 1px solid var(--line); position: relative; z-index: 2; background: var(--panel); }
  .wz-foot.right { justify-content: flex-end; }
  .wz-foot .grow { flex: 1; }
  .wz-btn { padding: 8px 18px; border-radius: 7px; font: inherit; font-weight: 600; font-size: 14px; cursor: pointer; border: 1px solid var(--line);
    background: var(--panel); color: var(--fg); }
  .wz-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .wz-btn.link { border: 0; background: none; color: var(--accent); padding: 8px 6px; }
  .wz-btn.gone { visibility: hidden; }
  /* Site workaround: long unbreakable values (emails) in the instruction panel overflow it and the page. */
  .ref-panel-text, .ref-note-text, .ref-instruction { overflow-wrap: anywhere; }
  `;

  function ensureStyle() {
    if (document.getElementById('wz-style')) return;
    const s = document.createElement('style');
    s.id = 'wz-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  let st = null; // live widgets of the current render

  const priceText = (f, o) => {
    const p = f.prices && f.prices[o];
    if (p == null) return '';
    const money = p === 0 ? 'Free' : `$${p.toFixed(2)}`;
    const d = f.days && f.days[o];
    return f.id === 'room' ? `${money} / night` : d !== undefined ? `${money} · ${d <= 1 ? (d === 0 ? 'today' : '1 day') : `up to ${d} days`}` : money;
  };

  function build(ctx, look) {
    const { spec, util, stage } = ctx;
    const fam = env.taskDef;
    const R = spec.steps.length;
    const s = { fields: {}, panels: [], ind: [], edit: [], review: {}, errs: {}, wraps: {}, look };
    const apply = (act) => {
      const m = fam.helpers.apply(ctx.model, spec, act);
      if (m !== ctx.model) ctx.update(m);
      paint(ctx.model);
    };
    s.apply = apply;

    const card = util.el('div', 'wz-card' + (look.flat ? ' flat' : '') + (look.ind === 'side' ? ' side-layout' : ''), stage);
    card.dataset.role = 'wizard';
    for (const [k, v] of Object.entries(look.vars)) card.style.setProperty(k, v);
    card.style.width = `${look.width}px`;
    s.card = card;

    // Step indicator.
    const names = [...spec.steps.map((x) => x.title), spec.labels.review];
    let main = card;
    const indItem = (li, i) => {
      s.ind[i] = li;
      li.addEventListener('click', () => {
        if (spec.jumpNav && i < ctx.model.step && ctx.model.step <= R) apply({ jump: i });
      });
    };
    if (look.ind === 'side') {
      const ol = util.el('ol', 'wz-ind side', card);
      names.forEach((n, i) => {
        const li = util.el('li', '', ol);
        util.el('span', 'wz-dot', li, String(i + 1));
        util.el('span', 'wz-ind-t', li, n);
        indItem(li, i);
      });
      main = util.el('div', 'wz-main', card);
      if (look.title) util.el('h2', 'wz-title', main, spec.title);
    } else {
      if (look.title) util.el('h2', 'wz-title', card, spec.title);
      if (look.ind === 'progress') {
        const pr = util.el('div', 'wz-prog', card);
        const row = util.el('div', 'wz-prog-row', pr);
        s.progText = util.el('span', '', row);
        s.progBack = util.el('span', 'wz-prog-back', row, spec.jumpNav ? `‹ ${names[0]}` : '');
        const bar = util.el('div', 'wz-prog-bar', pr);
        s.progFill = util.el('div', 'wz-prog-fill', bar);
        // The jump target in this style: a link to the first step plus clickable step names in the text row.
        s.progNames = names;
        if (spec.jumpNav) {
          // One clickable crumb per earlier step (shown only while it is earlier than the current step).
          s.progBack.textContent = '';
          names.slice(0, R).forEach((n, i) => {
            const a = util.el('span', 'wz-prog-crumb', s.progBack, (i ? ' · ' : '') + n);
            a.style.cursor = 'pointer';
            indItem(a, i);
          });
        }
      } else {
        const ol = util.el('ol', `wz-ind ${look.ind}`, card);
        names.forEach((n, i) => {
          if (i && look.ind === 'circles') util.el('span', 'wz-sep', ol);
          const li = util.el('li', '', ol);
          if (look.ind === 'circles') util.el('span', 'wz-dot', li, String(i + 1));
          util.el('span', 'wz-ind-t', li, look.ind === 'pills' ? `${i + 1}. ${n}` : n);
          indItem(li, i);
        });
      }
    }

    const body = util.el('div', 'wz-body', main);
    s.body = body;

    // Input steps.
    spec.steps.forEach((stp, si) => {
      const panel = util.el('section', 'wz-panel', body);
      if (look.stepHead) util.el('h3', '', panel, stp.title);
      const alert = util.el('div', 'wz-alert off', panel, '');
      const grid = util.el('div', 'wz-grid', panel);
      s.panels[si] = { el: panel, alert };
      for (const id of stp.fields) {
        const f = spec.fields.find((x) => x.id === id);
        buildField(ctx, s, grid, f, look);
      }
    });

    // Summary.
    const rev = util.el('section', 'wz-panel', body);
    if (look.stepHead) util.el('h3', '', rev, look.reviewHead);
    const rgrid = util.el('div', 'wz-review', rev);
    spec.steps.forEach((stp, si) => {
      const g = util.el('div', 'wz-group', rgrid);
      const head = util.el('div', 'wz-group-head', g);
      util.el('span', '', head, stp.title);
      const ed = util.el('a', 'wz-edit', head, spec.labels.edit);
      ed.href = '#';
      ed.dataset.role = 'edit';
      ed.addEventListener('click', (e) => { e.preventDefault(); apply({ edit: si }); });
      s.edit[si] = ed;
      for (const id of stp.fields) {
        const f = spec.fields.find((x) => x.id === id);
        const row = util.el('div', 'wz-row', g);
        util.el('span', 'k', row, f.label.replace(/ \(optional\)$/, '')).title = f.label;
        s.review[id] = util.el('span', 'v', row, '');
      }
    });
    s.panels[R] = { el: rev, alert: null };

    // Confirmation.
    const done = util.el('section', 'wz-panel', body);
    const dd = util.el('div', 'wz-done', done);
    util.el('div', 'ok', dd, '✓');
    util.el('h3', '', dd, spec.labels.done);
    util.el('p', '', dd, `Reference ${spec.ref}. A copy of the details was sent by email.`);
    s.doneFacts = util.el('div', 'wz-facts', dd); // the task's facts after the reference code (filled while the screen shows)
    const reopen = util.el('a', 'wz-reopen', dd, spec.labels.reopen);
    reopen.href = '#';
    reopen.addEventListener('click', (e) => { e.preventDefault(); apply({ reopen: true }); });
    s.reopen = reopen;
    s.panels[R + 1] = { el: done, alert: null };

    // Footer.
    const foot = util.el('div', 'wz-foot' + (look.foot === 'right' ? ' right' : ''), main);
    const back = util.el('button', 'wz-btn' + (look.foot === 'link' ? ' link' : ''), foot, spec.labels.back);
    back.type = 'button';
    back.addEventListener('click', () => apply({ back: true }));
    if (look.foot !== 'right') util.el('span', 'grow', foot);
    const primary = util.el('button', 'wz-btn primary', foot, spec.labels.next);
    primary.type = 'button';
    primary.addEventListener('click', () => {
      const m = ctx.model;
      if (m.step >= R && spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible');
      apply(m.step < R ? { next: true } : { confirm: true });
    });
    s.back = back;
    s.primary = primary;
    s.foot = foot;
    return s;
  }

  function buildField(ctx, s, grid, f, look) {
    const { util, spec } = ctx;
    const fam = env.taskDef;
    const wrap = util.el('div', 'wz-field' + (look.inline && f.kind === 'text' ? ' inline' : '') +
      (f.kind === 'choice' && look.cols > 1 && (f.prices || f.options.length > 3) ? ' wide' : ''), grid);
    wrap.dataset.field = f.id;
    s.wraps[f.id] = wrap;
    const req = f.required && f.kind !== 'check';
    const labelText = f.label;
    if (f.kind !== 'check') {
      const lab = util.el('label', 'wz-label', wrap, labelText);
      if (req && look.stars) util.el('span', 'req', lab, '*');
      lab.htmlFor = `wz-${f.id}`;
    }
    if (f.kind === 'text') {
      const input = util.el('input', 'wz-input', wrap);
      input.id = `wz-${f.id}`;
      input.type = f.fmt === 'password' || f.fmt === 'match' ? 'password' : 'text';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.dataset.role = 'field';
      if (f.placeholder) input.placeholder = f.placeholder;
      const tf = env.ui.textField(input, {
        value: ctx.model.values[f.id] ?? '',
        label: f.id,
        onInput: (v) => s.apply({ set: [f.id, v] }),
      });
      input.addEventListener('focus', () => { if (ctx.model.focus !== f.id) s.apply({ focus: f.id }); });
      input.addEventListener('blur', () => { if (ctx.model.focus === f.id) s.apply({ focus: null }); });
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (ctx.model.step < spec.steps.length) s.apply({ next: true });
      });
      s.fields[f.id] = { kind: 'text', tf, el: input };
      if (f.hint && look.hints) util.el('div', 'wz-hint', wrap, f.hint);
    } else if (f.kind === 'choice') {
      const els = [];
      if (look.tiles) {
        const box = util.el('div', 'wz-tiles', wrap);
        for (const o of f.options) {
          const b = util.el('button', 'wz-tile', box, o);
          b.type = 'button';
          b.setAttribute('role', 'radio');
          const p = priceText(f, o);
          if (p) util.el('span', 'price', b, p);
          els.push([o, b]);
        }
      } else {
        const box = util.el('div', 'wz-opts' + (!f.prices && f.options.length <= 4 && look.rowRadios ? ' row' : ''), wrap);
        for (const o of f.options) {
          const lab = util.el('label', 'wz-radio', box);
          const r = util.el('input', '', lab);
          r.type = 'radio';
          r.name = `wz-${f.id}`;
          util.el('span', '', lab, o);
          const p = priceText(f, o);
          if (p) util.el('span', 'price', lab, p);
          els.push([o, r]);
        }
      }
      const ch = env.ui.choices(els, { value: ctx.model.values[f.id] || null, label: f.id,
        onChange: (v) => s.apply({ set: [f.id, v || ''] }) });
      s.fields[f.id] = { kind: 'choice', ch };
    } else if (f.kind === 'check') {
      const lab = util.el('label', 'wz-check', wrap);
      let el;
      if (look.switches) {
        el = util.el('button', 'wz-switch', lab);
        el.type = 'button';
        el.setAttribute('role', 'switch');
        el.addEventListener('click', (e) => { e.preventDefault(); s.apply({ set: [f.id, !ctx.model.values[f.id]] }); });
        util.el('span', '', lab, f.label);
      } else {
        el = util.el('input', '', lab);
        el.type = 'checkbox';
        el.addEventListener('change', () => s.apply({ set: [f.id, el.checked] }));
        util.el('span', '', lab, f.label);
        if (f.required && look.stars) util.el('span', 'req', lab, '*');
      }
      s.fields[f.id] = { kind: 'check', el };
    } else {
      const trigger = util.el('button', 'wz-trigger', wrap);
      trigger.type = 'button';
      trigger.id = `wz-${f.id}`;
      const pop = util.el('div', 'wz-pop', wrap);
      const opts = [];
      for (const o of f.options) {
        const row = util.el('div', 'wz-opt', pop, o);
        opts.push([o, row]);
      }
      const dd = env.ui.dropdown(trigger, pop, {
        label: f.id,
        options: opts,
        value: ctx.model.values[f.id] || null,
        open: ctx.model.open === f.id,
        onChange: (v) => { if (ctx.model.values[f.id] !== v) s.apply({ set: [f.id, v] }); },
        onOpenChange: (open) => {
          const want = open ? f.id : (ctx.model.open === f.id ? null : ctx.model.open);
          if (ctx.model.open !== want) s.apply({ open: want });
        },
        show: (popup, open, api) => {
          popup.hidden = !open;
          if (!open) return;
          popup.style.top = '';
          popup.style.bottom = '';
          const h = popup.offsetHeight;
          const room = api.room();
          if (room.below < h + 12 && room.above > room.below) popup.style.bottom = `${wrap.offsetHeight - trigger.offsetTop + 2}px`;
          else popup.style.top = `${trigger.offsetTop + trigger.offsetHeight + 2}px`;
        },
      });
      s.fields[f.id] = { kind: 'select', dd, trigger, opts };
    }
    s.errs[f.id] = util.el('div', 'wz-err', wrap, '');
    void fam;
  }

  function paint(model) {
    if (!st) return;
    const { spec } = st;
    const fam = env.taskDef;
    const R = spec.steps.length;
    st.panels.forEach((p, i) => { p.el.hidden = i !== model.step; });
    // Indicator.
    const names = [...spec.steps.map((x) => x.title), spec.labels.review];
    st.ind.forEach((li, i) => {
      if (!li) return;
      const cur = Math.min(model.step, R);
      li.classList.toggle('cur', i === cur && model.step <= R);
      li.classList.toggle('done', i < cur || model.step > R);
      const jump = spec.jumpNav && i < model.step && model.step <= R;
      li.classList.toggle('jump', jump);
      if (st.look.ind === 'progress') li.style.visibility = jump ? '' : 'hidden';
    });
    if (st.progText) {
      const cur = Math.min(model.step, R);
      st.progText.innerHTML = '';
      st.progText.append(`Step ${cur + 1} of ${R + 1} · `);
      const b = document.createElement('b');
      b.textContent = model.step > R ? spec.labels.done : names[cur];
      st.progText.append(b);
      st.progFill.style.width = `${Math.round(((model.step > R ? R + 1 : cur + 1) / (R + 1)) * 100)}%`;
    }
    // Fields.
    for (const f of spec.fields) {
      const w = st.fields[f.id];
      const v = model.values[f.id];
      if (w.kind === 'text') { if (w.tf.get() !== (v ?? '')) w.tf.set(v ?? ''); } else if (w.kind === 'choice') w.ch.set(v || null);
      else if (w.kind === 'check') {
        if (w.el.tagName === 'INPUT') w.el.checked = !!v;
        else w.el.setAttribute('aria-checked', v ? 'true' : 'false');
      } else {
        w.dd.set({ value: v || null, open: model.open === f.id });
        w.trigger.textContent = v || 'Select…';
        w.trigger.classList.toggle('empty', !v);
        for (const [o, row] of w.opts) row.classList.toggle('sel', o === v);
      }
      const bad = model.invalid.includes(f.id) && f.step === model.step;
      st.errs[f.id].textContent = bad ? fam.helpers.validate(f, v, model.values) || '' : '';
      st.wraps[f.id].classList.toggle('bad', bad);
      if (st.review[f.id]) {
        const d = fam.helpers.display(f, v);
        st.review[f.id].textContent = d || '—';
        st.review[f.id].classList.toggle('empty', !d);
      }
    }
    if (model.step < R) {
      const p = st.panels[model.step];
      const n = model.invalid.length;
      p.alert.classList.toggle('off', !n);
      p.alert.textContent = n ? `Please correct ${n === 1 ? 'the highlighted field' : `the ${n} highlighted fields`} to continue.` : '';
    }
    // Confirmation details (the task's facts after the reference code).
    if (st.doneFacts && model.step > R && fam.facts) {
      st.doneFacts.replaceChildren();
      for (const f of fam.facts(model, spec).slice(1)) {
        const k = document.createElement('span');
        k.className = 'k';
        k.textContent = f.label;
        const v = document.createElement('span');
        v.className = 'v';
        v.textContent = f.value;
        st.doneFacts.append(k, v);
      }
    }
    // Footer.
    st.back.classList.toggle('gone', !(model.step > 0 && model.step <= R));
    st.primary.classList.toggle('gone', model.step > R);
    st.primary.textContent = model.step < R ? (model.ret ? spec.labels.save : spec.labels.next) : spec.labels.confirm;
  }

  env.widget({
    task: 'complete-wizard',
    site: 'base',
    name: 'stepper',
    split: 'train',
    scenarios: ['checkout', 'application', 'booking', 'signup'],

    render(ctx) {
      ensureStyle();
      const { spec, rng, size, stage } = ctx;
      const R = spec.steps.length;
      const maxFields = Math.max(...spec.steps.map((x) => x.fields.length));
      const base = {
        ind: rng.pick(['circles', 'pills', 'progress', 'side']),
        flat: rng.bool(0.25),
        title: rng.bool(0.7),
        stepHead: rng.bool(0.6),
        tiles: rng.bool(0.4),
        switches: rng.bool(0.4),
        rowRadios: rng.bool(0.5),
        stars: rng.bool(0.6),
        hints: rng.bool(0.6),
        foot: rng.pick(['split', 'right', 'link']),
        cols: maxFields >= 4 ? rng.pick([1, 2, 2]) : rng.pick([1, 1, 2]),
        inline: rng.bool(0.3),
        width: rng.int(500, 640),
        h: rng.int(34, 40),
        r: rng.pick([4, 6, 8]),
        pad: rng.int(18, 26),
        gap: rng.int(6, 12),
        reviewHead: rng.pick(['Check your details', 'Review', 'Summary', 'Almost done']),
      };
      const px = rng.float(0, 1);
      const py = rng.float(0, 1);
      // Wider indicators need room; fall back gracefully.
      const tries = [];
      const inds = [base.ind, ...(base.ind === 'side' ? ['progress'] : []), ...(base.ind === 'circles' || base.ind === 'pills' ? ['progress'] : [])];
      for (const ind of inds) {
        for (const squeeze of [0, 1, 2, 3, 4, 5]) tries.push({ ind, squeeze });
      }
      let look;
      let fitted = false;
      for (const t of tries) {
        const q = t.squeeze;
        const cols = q >= 1 ? (q >= 5 && maxFields >= 5 ? 3 : 2) : base.cols;
        const sideW = t.ind === 'side' ? 190 : 0;
        const want = q >= 3 ? Math.max(base.width, cols === 3 ? 760 : 680) : Math.max(base.width, cols === 2 ? 560 : 440);
        const width = Math.min(want + sideW, size.width - 24);
        const pad = q >= 2 ? 14 : base.pad;
        look = {
          ...base,
          width,
          ind: t.ind,
          cols,
          inline: base.inline && cols === 1 && q === 0,
          title: base.title && q < 3,
          stepHead: base.stepHead && q < 2,
          hints: base.hints && q < 2,
          vars: {
            '--wz-cols': String(cols),
            '--wz-rcols': String(Math.max(1, Math.min(R, Math.floor((width - sideW - 2 * pad) / (q >= 4 ? 180 : 210))))),
            '--wz-h': `${q >= 3 ? 32 : base.h}px`,
            '--wz-gap': `${q >= 2 ? 3 : base.gap}px`,
            '--wz-gap2': `${q >= 2 ? 8 : 14}px`,
            '--wz-pad': `${pad}px`,
            '--wz-r': `${base.r}px`,
            '--wz-lw': '150px',
          },
        };
        stage.replaceChildren();
        st = build(ctx, look);
        st.spec = spec;
        // Fixed body height: the tallest panel, measured with the target values filled in (the summary
        // grows with long values) and with the current values, plus slack for longer wrong values.
        let hmax = 0;
        const full = env.taskDef.solve(spec, ctx.model);
        for (const m of [{ ...full, step: 0, confirmed: false }, full, ctx.model]) { // full: the confirmation screen with its facts
          paint(m);
          for (const p of st.panels) {
            for (const q2 of st.panels) q2.el.hidden = q2 !== p;
            hmax = Math.max(hmax, p.el.offsetHeight);
          }
        }
        st.body.style.height = `${hmax + 14}px`;
        const r = st.card.getBoundingClientRect();
        if (r.height <= size.height - 12 && r.width <= size.width - 12) { fitted = true; break; }
      }
      paint(ctx.model);
      // Freeze the card's size, so nothing inside can move the anchor.
      const natural = st.card.getBoundingClientRect();
      st.card.style.width = `${Math.ceil(natural.width)}px`;
      st.card.style.height = `${Math.ceil(natural.height)}px`;
      // A long instruction and the site's end-control dock can leave less room than the most compact
      // layout needs. Fit that final layout as a whole while retaining every field and the fixed anchor.
      const scale = fitted ? 1 : Math.min(1, (size.width - 16) / Math.ceil(natural.width), (size.height - 12) / Math.ceil(natural.height));
      st.card.style.transformOrigin = 'top left';
      if (scale < 1) st.card.style.transform = `scale(${scale})`;
      const r = st.card.getBoundingClientRect();
      // Position inside the stage (alignment offset within the free space), away from a floating end
      // control the site may pin to the bottom-right corner.
      const sr = stage.getBoundingClientRect();
      const fx = Math.max(0, sr.width - r.width - 16);
      const fy = Math.max(0, sr.height - r.height - 12);
      let x = sr.left + 8 + fx * px;
      let y = sr.top + 6 + fy * py;
      for (const el of document.querySelectorAll('[data-role=submit]')) {
        if (getComputedStyle(el).position !== 'fixed') continue;
        const b = el.getBoundingClientRect();
        const hit = () => x < b.right + 8 && x + r.width > b.left - 8 && y < b.bottom + 8 && y + r.height > b.top - 8;
        if (hit()) x = Math.max(sr.left + 8, Math.min(x, b.left - 12 - r.width));
        if (hit()) y = Math.max(sr.top + 6, Math.min(y, b.top - 12 - r.height));
      }
      st.card.style.transform = `translate(${Math.round(x - r.left)}px, ${Math.round(y - r.top)}px) scale(${scale})`;
      return {
        anchors: [st.card],
        sync(m) { paint(m); },
      };
    },

    locate(t) {
      if (!st) throw new Error('complete-wizard/stepper not rendered');
      const c = (el) => env.util.center(el);
      if (t.field !== undefined) return st.fields[t.field].tf.locate();
      if (t.choice) return st.fields[t.choice[0]].ch.locate(t.choice[1]);
      if (t.check !== undefined) return c(st.fields[t.check].el);
      if (t.open !== undefined) return st.fields[t.open].dd.locateTrigger();
      if (t.option) return st.fields[t.option[0]].dd.locateOption(t.option[1]);
      if (t.edit !== undefined) return c(st.edit[t.edit]);
      if (t.jump !== undefined) return c(st.ind[t.jump]);
      if (t.nav === 'next' || t.nav === 'confirm') return c(st.primary);
      if (t.nav === 'back') return c(st.back);
      if (t.nav === 'reopen') return c(st.reopen);
      throw new Error(`complete-wizard/stepper cannot locate ${JSON.stringify(t)}`);
    },
  });
})();
