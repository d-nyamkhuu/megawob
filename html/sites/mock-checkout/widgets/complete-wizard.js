/*
 * mock-checkout / wizard / steps: a multi-step checkout form (frozen eval-only replica; heldout). Only the
 * 'checkout' scenario: the other wizard flows (application, booking, signup) are different real-world patterns.
 *
 * Layout: a store frame with a slim header (logo mark and store name, "Secure checkout", a lock note) over a
 * two-column body: the form on the left, an inert order summary on the right (two or three lines, subtotal,
 * shipping "calculated at the next step", total; hidden when the frame is narrow). The form column has a
 * breadcrumb trail "Cart > Information > Shipping > Payment > Review" (the finished steps are links when
 * spec.jumpNav; Cart is inert), the step heading, the step's fields and a footer with a text link back
 * ("< Return to shipping") and the primary button ("Continue to shipping", "Review order", "Place order").
 *   fields   text inputs with the label above (outlined or underlined, 1 or 2 columns), choices as bordered
 *            radio rows with the price at the right (or option cards), a select as a button + DOM listbox
 *            (env.ui.dropdown), checkboxes. Inline errors under the field and a banner on the step.
 *   review   boxed rows "Contact / Ship to / Method / Payment" with a Change link each, then the confirm
 *            button; the confirmation shows a check mark, the order reference and a "Make changes" link.
 * The body has a fixed height (the tallest panel), so the anchor (the frame) never moves. Compact looks
 * (tighter fields, no summary, no hints) kick in until it fits; a last resort scales the frame.
 * Every interaction goes through env.familyDef.helpers.apply(). Enter in a text field acts like the primary button.
 */
(function () {
  'use strict';

  const CSS = `
  .rw-frame { position: absolute; display: flex; flex-direction: column; overflow: hidden; background: var(--panel); color: var(--fg);
    border: 1px solid var(--line); border-radius: calc(var(--r) + 2px); box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .rw-frame [hidden] { display: none !important; }
  .rw-top { flex: none; display: flex; align-items: center; gap: 12px; height: 50px; padding: 0 var(--rw-pad); border-bottom: 1px solid var(--line); }
  .rw-logo { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background: var(--fg); color: var(--panel);
    font-weight: 900; font-size: 13px; border-radius: 50% 50% 50% 4px; }
  .rw-brand { font-family: var(--hfont); font-weight: 800; font-size: 16px; }
  .rw-secure { margin-left: auto; display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); }
  .rw-secure svg { width: 13px; height: 13px; }
  .rw-main { flex: 1; min-height: 0; display: flex; }
  .rw-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--rw-gap2); padding: var(--rw-pad); }
  .rw-side { flex: none; width: 270px; padding: var(--rw-pad); background: var(--soft); border-left: 1px solid var(--line); display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; }
  .rw-side h4 { margin: 0; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .rw-line { display: flex; align-items: center; gap: 10px; }
  .rw-line i { width: 34px; height: 34px; flex: none; border-radius: 6px; background: color-mix(in srgb, var(--accent) 16%, var(--panel)); border: 1px solid var(--line); }
  .rw-line span { flex: 1; min-width: 0; }
  .rw-line small { display: block; color: var(--muted); font-size: 12px; }
  .rw-sum { display: flex; justify-content: space-between; color: var(--muted); }
  .rw-sum.total { color: var(--fg); font-weight: 750; font-size: 15px; padding-top: 8px; border-top: 1px solid var(--line); }
  .rw-trail { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; margin: 0; padding: 0; list-style: none; font-size: 12.5px; color: var(--muted); }
  .rw-trail li + li::before { content: '\\203A'; margin-right: 6px; color: var(--muted); }
  .rw-trail li.cur { color: var(--fg); font-weight: 700; }
  .rw-trail li.jump { color: var(--accent); cursor: pointer; }
  .rw-trail li.jump:hover { text-decoration: underline; }
  .rw-title { margin: 0; font-family: var(--hfont); font-size: 19px; font-weight: 750; letter-spacing: -.01em; }
  .rw-body { position: relative; flex: none; }
  .rw-panel { display: flex; flex-direction: column; gap: var(--rw-gap2); }
  .rw-alert { padding: 8px 12px; border-radius: var(--r); background: color-mix(in srgb, var(--bad) 10%, var(--panel)); color: var(--bad);
    border: 1px solid color-mix(in srgb, var(--bad) 40%, var(--line)); font-size: 13px; }
  .rw-alert.off { display: none; }
  .rw-grid { display: grid; grid-template-columns: repeat(var(--rw-cols), minmax(0, 1fr)); gap: var(--rw-gap) 14px; }
  .rw-field { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .rw-field.wide { grid-column: 1 / -1; }
  .rw-label { font-size: 12.5px; font-weight: 650; color: var(--muted); }
  .rw-input, .rw-trigger { height: var(--rw-h); padding: 0 11px; width: 100%; border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--line));
    border-radius: var(--r); background: var(--panel); color: var(--fg); font: inherit; outline: none; text-align: left; user-select: text; -webkit-user-select: text; }
  .rw-under .rw-input, .rw-under .rw-trigger { border-width: 0 0 1.5px; border-radius: 0; padding-left: 2px; background: transparent; }
  .rw-input:focus, .rw-trigger:focus { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 22%, transparent); }
  .rw-under .rw-input:focus, .rw-under .rw-trigger:focus { box-shadow: none; }
  .rw-trigger { cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none; }
  .rw-trigger::after { content: ''; width: 7px; height: 7px; border: solid currentColor; border-width: 0 1.6px 1.6px 0; transform: rotate(45deg) translate(-2px, -2px); opacity: .6; }
  .rw-trigger.empty { color: var(--muted); }
  .rw-pop { position: absolute; left: 0; right: 0; z-index: 8; max-height: 368px; overflow: auto; padding: 4px; background: var(--panel);
    border: 1px solid var(--line); border-radius: var(--r); box-shadow: 0 10px 28px rgba(0,0,0,.18); }
  .rw-opt { padding: 7px 10px; border-radius: 4px; cursor: pointer; }
  .rw-opt:hover { background: var(--soft); }
  .rw-opt.sel { font-weight: 700; color: var(--accent); }
  .rw-hint { font-size: 12px; color: var(--muted); }
  .rw-err { min-height: 0; font-size: 12px; color: var(--bad); }
  .rw-field.bad .rw-input, .rw-field.bad .rw-trigger { border-color: var(--bad); }
  .rw-opts { display: flex; flex-direction: column; border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--line)); border-radius: var(--r); overflow: hidden; }
  .rw-opts.cards { border: 0; flex-direction: row; flex-wrap: wrap; gap: 8px; overflow: visible; }
  .rw-radio { display: flex; align-items: center; gap: 10px; padding: 10px 12px; cursor: pointer; }
  .rw-opts:not(.cards) .rw-radio + .rw-radio { border-top: 1px solid var(--line); }
  .rw-radio input { margin: 0; accent-color: var(--accent); }
  .rw-radio > span:first-of-type { flex: 1; }
  .rw-radio .price { color: var(--muted); font-size: 13px; white-space: nowrap; }
  .rw-card { flex: 1 1 140px; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 9px 12px; text-align: left; cursor: pointer;
    border: 1.5px solid var(--line); border-radius: var(--r); background: var(--panel); color: var(--fg); font: inherit; font-weight: 650; }
  .rw-card .price { font-weight: 500; color: var(--muted); font-size: 12.5px; }
  .rw-card[aria-checked=true] { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 9%, var(--panel)); }
  .rw-check { display: flex; align-items: center; gap: 9px; cursor: pointer; }
  .rw-check input { margin: 0; width: 16px; height: 16px; accent-color: var(--accent); }
  .rw-review { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: var(--r); }
  .rw-rrow { display: flex; align-items: baseline; gap: 12px; padding: 8px 12px; font-size: 13.5px; }
  .rw-rrow + .rw-rrow { border-top: 1px solid var(--line); }
  .rw-rrow .k { flex: 0 0 120px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rw-rrow .v { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .rw-rrow .v.empty { color: var(--muted); font-style: italic; }
  .rw-rrow a { color: var(--accent); font-size: 13px; cursor: pointer; text-decoration: none; }
  .rw-rrow a:hover { text-decoration: underline; }
  .rw-done { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding-top: 6px; }
  .rw-done .ok { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800;
    background: color-mix(in srgb, var(--ok) 16%, var(--panel)); color: var(--ok); }
  .rw-done h3 { margin: 0; font-size: 18px; }
  .rw-done p { margin: 0; color: var(--muted); }
  .rw-done a { color: var(--accent); font-weight: 600; cursor: pointer; }
  .rw-foot { display: flex; align-items: center; gap: 12px; padding-top: 10px; border-top: 1px solid var(--line); }
  .rw-foot.rev { flex-direction: row-reverse; justify-content: flex-end; }
  .rw-back { border: 0; background: none; padding: 6px 2px; color: var(--accent); font: inherit; cursor: pointer; font-weight: 600; }
  .rw-back:hover { text-decoration: underline; }
  .rw-go { margin-left: auto; padding: 0 22px; height: var(--rw-h); border-radius: var(--r); border: 1px solid var(--accent); background: var(--accent);
    color: var(--onaccent); font: inherit; font-weight: 700; cursor: pointer; }
  .rw-foot.rev .rw-go { margin-left: 0; }
  .rw-gone { visibility: hidden; }
  html[data-rc-theme=contrast] .rw-input, html[data-rc-theme=contrast] .rw-trigger, html[data-rc-theme=contrast] .rw-opts { border-color: #000; border-width: 2px; }
  .ref-panel-text, .ref-note-text, .ref-instruction { overflow-wrap: anywhere; }
  `;

  function ensureStyle() {
    if (document.getElementById('rw-style')) return;
    const s = document.createElement('style');
    s.id = 'rw-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  const LOCK = '<svg viewBox="0 0 16 16"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="2.5" y="7" width="11" height="7.5" rx="1.6" fill="currentColor"/></svg>';
  const CONTINUE = ['Continue', 'Continue to {next}', 'Next: {next}', 'Next'];
  const BACK = ['Return to {prev}', 'Back to {prev}', '< {prev}', 'Back'];
  const ITEMS = [['Cotton crew tee', 'Size M'], ['Canvas weekender', 'One size'], ['Trail socks, 3 pack', 'Grey'], ['Ceramic mug', 'Set of 2']];

  let st = null;
  const priceText = (f, o) => {
    const p = f.prices && f.prices[o];
    if (p == null) return '';
    const money = p === 0 ? 'Free' : `$${p.toFixed(2)}`;
    const d = f.days && f.days[o];
    return d !== undefined ? `${money} · ${d <= 1 ? (d === 0 ? 'today' : '1 day') : `up to ${d} days`}` : money;
  };

  function buildField(ctx, s, grid, f, look) {
    const { util } = ctx;
    const wrap = util.el('div', 'rw-field' + ((f.kind === 'choice' || f.kind === 'check') && look.cols > 1 ? ' wide' : ''), grid);
    wrap.dataset.field = f.id;
    s.wraps[f.id] = wrap;
    if (f.kind !== 'check') {
      const lab = util.el('label', 'rw-label', wrap, f.label + (f.required && look.stars ? ' *' : ''));
      lab.htmlFor = `rw-${f.id}`;
    }
    if (f.kind === 'text') {
      const input = util.el('input', 'rw-input', wrap);
      input.id = `rw-${f.id}`;
      input.type = f.fmt === 'password' || f.fmt === 'match' ? 'password' : 'text';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.dataset.role = 'field';
      if (f.placeholder) input.placeholder = f.placeholder;
      const tf = env.ui.textField(input, { value: ctx.model.values[f.id] ?? '', label: f.id, onInput: (v) => s.apply({ set: [f.id, v] }) });
      input.addEventListener('focus', () => { if (ctx.model.focus !== f.id) s.apply({ focus: f.id }); });
      input.addEventListener('blur', () => { if (ctx.model.focus === f.id) s.apply({ focus: null }); });
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (ctx.model.step < ctx.spec.steps.length) s.apply({ next: true });
      });
      s.fields[f.id] = { kind: 'text', tf, el: input };
      if (f.hint && look.hints) util.el('div', 'rw-hint', wrap, f.hint);
    } else if (f.kind === 'choice') {
      const els = [];
      if (look.cards) {
        const box = util.el('div', 'rw-opts cards', wrap);
        for (const o of f.options) {
          const b = util.el('button', 'rw-card', box, o);
          b.type = 'button';
          b.setAttribute('role', 'radio');
          const p = priceText(f, o);
          if (p) util.el('span', 'price', b, p);
          els.push([o, b]);
        }
      } else {
        const box = util.el('div', 'rw-opts', wrap);
        for (const o of f.options) {
          const lab = util.el('label', 'rw-radio', box);
          const r = util.el('input', '', lab);
          r.type = 'radio';
          r.name = `rw-${f.id}`;
          util.el('span', '', lab, o);
          const p = priceText(f, o);
          if (p) util.el('span', 'price', lab, p);
          els.push([o, r]);
        }
      }
      const ch = env.ui.choices(els, { value: ctx.model.values[f.id] || null, label: f.id, onChange: (v) => s.apply({ set: [f.id, v || ''] }) });
      s.fields[f.id] = { kind: 'choice', ch };
    } else if (f.kind === 'check') {
      const lab = util.el('label', 'rw-check', wrap);
      const el = util.el('input', '', lab);
      el.type = 'checkbox';
      el.addEventListener('change', () => s.apply({ set: [f.id, el.checked] }));
      util.el('span', '', lab, f.label);
      s.fields[f.id] = { kind: 'check', el };
    } else {
      const trigger = util.el('button', 'rw-trigger', wrap);
      trigger.type = 'button';
      trigger.id = `rw-${f.id}`;
      const pop = util.el('div', 'rw-pop', wrap);
      const opts = [];
      for (const o of f.options) opts.push([o, util.el('div', 'rw-opt', pop, o)]);
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
          // The frame clips (overflow hidden) and may end above the viewport bottom: measure the room inside
          // both, in screen pixels (the frame may be scaled), or a list that fits the window opens below the
          // card's bottom edge and its last options cannot be clicked.
          const tr = trigger.getBoundingClientRect();
          const fr = (wrap.closest('.rw-frame') || document.documentElement).getBoundingClientRect();
          const h = popup.offsetHeight * (trigger.offsetHeight ? tr.height / trigger.offsetHeight : 1);
          const win = api.room();
          const room = { above: Math.min(win.above, tr.top - fr.top), below: Math.min(win.below, fr.bottom - tr.bottom) };
          if (room.below < h + 12 && room.above > room.below) popup.style.bottom = `${wrap.offsetHeight - trigger.offsetTop + 2}px`;
          else popup.style.top = `${trigger.offsetTop + trigger.offsetHeight + 2}px`;
        },
      });
      s.fields[f.id] = { kind: 'select', dd, trigger, opts };
    }
    s.errs[f.id] = util.el('div', 'rw-err', wrap, '');
  }

  function build(ctx, look) {
    const { spec, util, stage } = ctx;
    const R = spec.steps.length;
    const fam = env.taskDef;
    const s = { fields: {}, panels: [], ind: [], edit: [], review: {}, errs: {}, wraps: {}, look, spec };
    s.apply = (act) => {
      const m = fam.helpers.apply(ctx.model, spec, act);
      if (m !== ctx.model) ctx.update(m);
      paint(ctx.model);
    };
    const names = [...spec.steps.map((x) => x.title), spec.labels.review];

    const frame = util.el('div', 'rw-frame' + (look.under ? ' rw-under' : ''), stage);
    frame.dataset.role = 'wizard';
    for (const [k, v] of Object.entries(look.vars)) frame.style.setProperty(k, v);
    frame.style.width = `${look.width}px`;
    s.frame = frame;
    const top = util.el('div', 'rw-top', frame);
    util.el('span', 'rw-logo', top, 'P');
    util.el('span', 'rw-brand', top, look.store);
    const sec = util.el('span', 'rw-secure', top);
    sec.innerHTML = LOCK;
    util.el('span', '', sec, 'Secure checkout');
    const main = util.el('div', 'rw-main', frame);
    const col = util.el('div', 'rw-col', main);
    s.col = col;

    const trail = util.el('ol', 'rw-trail', col);
    const crumbs = ['Cart', ...names];
    crumbs.forEach((n, i) => {
      const li = util.el('li', '', trail, n);
      if (i === 0) return;
      s.ind[i - 1] = li;
      li.addEventListener('click', () => { if (spec.jumpNav && i - 1 < ctx.model.step && ctx.model.step <= R) s.apply({ jump: i - 1 }); });
    });
    const body = util.el('div', 'rw-body', col);
    s.body = body;
    s.heads = [];
    spec.steps.forEach((stp, si) => {
      const panel = util.el('section', 'rw-panel', body);
      s.heads[si] = util.el('h3', 'rw-title', panel, stp.title);
      const alert = util.el('div', 'rw-alert off', panel, '');
      const grid = util.el('div', 'rw-grid', panel);
      s.panels[si] = { el: panel, alert };
      for (const id of stp.fields) buildField(ctx, s, grid, spec.fields.find((x) => x.id === id), look);
    });

    const rev = util.el('section', 'rw-panel', body);
    util.el('h3', 'rw-title', rev, look.reviewHead);
    const rbox = util.el('div', 'rw-review', rev);
    spec.steps.forEach((stp, si) => {
      for (const id of stp.fields) {
        const f = spec.fields.find((x) => x.id === id);
        const row = util.el('div', 'rw-rrow', rbox);
        util.el('span', 'k', row, f.label.replace(/ \(optional\)$/, '')).title = f.label;
        s.review[id] = util.el('span', 'v', row, '');
        if (id === stp.fields[0]) {
          const ed = util.el('a', '', row, spec.labels.edit);
          ed.dataset.role = 'edit';
          ed.addEventListener('click', (e) => { e.preventDefault(); s.apply({ edit: si }); });
          s.edit[si] = ed;
        } else util.el('span', '', row).style.width = ed0Width();
      }
    });
    s.panels[R] = { el: rev, alert: null };

    const done = util.el('section', 'rw-panel', body);
    const dd = util.el('div', 'rw-done', done);
    util.el('div', 'ok', dd, '✓');
    util.el('h3', '', dd, spec.labels.done);
    util.el('p', '', dd, `Order ${spec.ref}. A receipt was sent to your email.`);
    const reopen = util.el('a', '', dd, spec.labels.reopen);
    reopen.addEventListener('click', (e) => { e.preventDefault(); s.apply({ reopen: true }); });
    s.reopen = reopen;
    s.panels[R + 1] = { el: done, alert: null };

    const foot = util.el('div', 'rw-foot' + (look.footRev ? ' rev' : ''), col);
    const back = util.el('button', 'rw-back', foot, spec.labels.back);
    back.type = 'button';
    back.addEventListener('click', () => s.apply({ back: true }));
    const primary = util.el('button', 'rw-go', foot, spec.labels.next);
    primary.type = 'button';
    primary.addEventListener('click', () => s.apply(ctx.model.step < R ? { next: true } : { confirm: true }));
    s.back = back;
    s.primary = primary;

    if (look.side) {
      const side = util.el('aside', 'rw-side', main);
      util.el('h4', '', side, 'Order summary');
      for (const [t, sub] of look.items) {
        const ln = util.el('div', 'rw-line', side);
        util.el('i', '', ln);
        const sp = util.el('span', '', ln, t);
        util.el('small', '', sp, sub);
      }
      const r1 = util.el('div', 'rw-sum', side);
      util.el('span', '', r1, 'Subtotal');
      util.el('span', '', r1, look.subtotal);
      const r2 = util.el('div', 'rw-sum', side);
      util.el('span', '', r2, 'Shipping');
      util.el('span', '', r2, 'Next step');
      const r3 = util.el('div', 'rw-sum total', side);
      util.el('span', '', r3, 'Total');
      util.el('span', '', r3, look.subtotal);
    }
    return s;
  }
  const ed0Width = () => '34px';

  function paint(model) {
    if (!st) return;
    const { spec } = st;
    const fam = env.taskDef;
    const R = spec.steps.length;
    st.panels.forEach((p, i) => { p.el.hidden = i !== model.step; });
    const cur = Math.min(model.step, R);
    st.ind.forEach((li, i) => {
      li.classList.toggle('cur', i === cur && model.step <= R);
      li.classList.toggle('jump', !!spec.jumpNav && i < model.step && model.step <= R);
    });
    for (const f of spec.fields) {
      const w = st.fields[f.id];
      const v = model.values[f.id];
      if (w.kind === 'text') { if (w.tf.get() !== (v ?? '')) w.tf.set(v ?? ''); } else if (w.kind === 'choice') w.ch.set(v || null);
      else if (w.kind === 'check') w.el.checked = !!v;
      else {
        w.dd.set({ value: v || null, open: model.open === f.id });
        w.trigger.textContent = v || 'Select';
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
      p.alert.textContent = n ? `Please fix ${n === 1 ? 'the highlighted field' : `the ${n} highlighted fields`} to continue.` : '';
    }
    const names = [...spec.steps.map((x) => x.title), spec.labels.review];
    st.back.classList.toggle('rw-gone', !(model.step > 0 && model.step <= R));
    st.primary.classList.toggle('rw-gone', model.step > R);
    if (model.step > 0 && model.step <= R) st.back.textContent = st.look.backText.replace('{prev}', names[model.step - 1].toLowerCase());
    st.primary.textContent = model.step < R
      ? (model.ret ? spec.labels.save : st.look.nextText.replace('{next}', names[model.step + 1].toLowerCase()))
      : spec.labels.confirm;
  }

  env.widget({
    task: 'complete-wizard',
    site: 'mock-checkout',
    name: 'steps',
    split: 'heldout',
    scenarios: ['checkout'],

    render(ctx) {
      ensureStyle();
      const { spec, rng, size, stage } = ctx;
      const R = spec.steps.length;
      const maxFields = Math.max(...spec.steps.map((x) => x.fields.length));
      const items = rng.sample(ITEMS, rng.int(2, 3));
      const base = {
        store: rng.pick(['Parcelry', 'Northline Goods', 'Kettle & Co', 'Marlow Supply', 'Fieldhouse']),
        under: rng.bool(0.25),
        cards: rng.bool(0.4),
        stars: rng.bool(0.5),
        hints: rng.bool(0.6),
        footRev: rng.bool(0.3),
        side: rng.bool(0.8),
        items,
        subtotal: `$${(rng.int(3800, 15900) / 100).toFixed(2)}`,
        cols: maxFields >= 4 ? rng.pick([1, 2, 2]) : rng.pick([1, 1, 2]),
        h: rng.int(36, 42),
        pad: rng.int(18, 26),
        gap: rng.int(8, 12),
        nextText: rng.pick(CONTINUE),
        backText: rng.pick(BACK),
        reviewHead: rng.pick(['Review your order', 'Check and confirm', 'Review']),
      };
      const px = rng.float(0, 1);
      const py = rng.float(0, 1);
      let fitted = false;
      let look;
      for (const q of [0, 1, 2, 3, 4, 5]) {
        const side = base.side && q < 3 && size.width >= 900;
        const cols = q >= 1 ? 2 : base.cols;
        const width = Math.min(Math.max(side ? 880 : cols === 2 ? 620 : 520, q >= 3 ? 700 : 0), size.width - 24);
        const pad = q >= 2 ? 14 : base.pad;
        look = { ...base, side, cols, width, hints: base.hints && q < 2,
          vars: { '--rw-cols': String(cols), '--rw-h': `${q >= 3 ? 32 : base.h}px`, '--rw-gap': `${q >= 2 ? 4 : base.gap}px`,
            '--rw-gap2': `${q >= 2 ? 8 : 14}px`, '--rw-pad': `${pad}px` } };
        stage.replaceChildren();
        st = build(ctx, look);
        let hmax = 0;
        const full = env.taskDef.solve(spec, ctx.model);
        for (const m of [{ ...full, step: 0, confirmed: false }, ctx.model]) {
          paint(m);
          for (const p of st.panels) {
            for (const q2 of st.panels) q2.el.hidden = q2 !== p;
            hmax = Math.max(hmax, p.el.offsetHeight);
          }
        }
        st.body.style.height = `${hmax + 10}px`;
        const r = st.frame.getBoundingClientRect();
        if (r.height <= size.height - 12 && r.width <= size.width - 12) { fitted = true; break; }
      }
      void R;
      paint(ctx.model);
      const natural = st.frame.getBoundingClientRect();
      st.frame.style.width = `${Math.ceil(natural.width)}px`;
      st.frame.style.height = `${Math.ceil(natural.height)}px`;
      const scale = fitted ? 1 : Math.min(1, (size.width - 16) / Math.ceil(natural.width), (size.height - 12) / Math.ceil(natural.height));
      st.frame.style.transformOrigin = 'top left';
      if (scale < 1) st.frame.style.transform = `scale(${scale})`;
      const r = st.frame.getBoundingClientRect();
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
      st.frame.style.transform = `translate(${Math.round(x - r.left)}px, ${Math.round(y - r.top)}px) scale(${scale})`;
      return { anchors: [st.frame], sync(m) { paint(m); } };
    },

    locate(t) {
      if (!st) throw new Error('wizard/steps not rendered');
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
      throw new Error(`wizard/steps cannot locate ${JSON.stringify(t)}`);
    },
  });
})();
