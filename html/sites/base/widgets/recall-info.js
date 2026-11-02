/*
 * base / recall-info / classic: a small web app frame (title bar, work area) whose views carry the fact the task
 * needs. One builder per scenario, all inside a fixed-size frame so nothing moves after setup:
 *   code       a request card: a step bar and one panel per step (the first shows the code in a box; tick-to-agree,
 *              info and radio steps; the last asks for the code), a footer with Next / Confirm, plus a Back button
 *              or a "Start over" link depending on spec.back; the confirmation panel shows the code on file and a
 *              link to change it
 *   count      a lazy table: a header row over a pane that loads a batch when its end is reached and keeps only the
 *              rows in view in the DOM (the rest unload), wheel and a custom scrollbar (track press pages), an
 *              answer box with its own button and a readout of what is on file
 *   paginate   a results table of fixed height with a pager (numbers or prev / next), a Select button per row and a
 *              bar that names the current selection
 *   crossref   a tab strip: read-only source tabs (key / value tables) and a form tab with text fields and a
 *              Save button; what was saved is listed under the button
 *   compare    a catalog of names only (View details, and Choose when spec.listChoose), a detail view per product
 *              (price, rating, delivery, colour, warranty) with a Back link and a Choose button; the choice bar
 *              above names the current choice
 * Mechanics from env.ui: textField (answers, fields), scrollPane (count). The frame is the anchor.
 */
(function () {
  'use strict';

  const CSS = `
  .ur-app { position: absolute; display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box;
    background: var(--panel); color: var(--fg); border: 1px solid var(--line); border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 12px 32px rgba(0,0,0,.06); font-size: 14px; }
  .ur-app.flat { box-shadow: none; border-radius: 4px; }
  .ur-bar { flex: none; display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 18px; box-sizing: border-box;
    border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .ur-mark { width: 20px; height: 20px; border-radius: 5px; background: var(--accent); flex: none; }
  .ur-appname { font-weight: 700; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ur-user { margin-left: auto; font-size: 12.5px; color: var(--muted); white-space: nowrap; }
  .ur-work { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 10px; padding: 14px 20px 16px; box-sizing: border-box; }
  .ur-work.tight { gap: 7px; padding: 10px 16px 12px; }
  .ur-h { margin: 0; font-size: 17px; font-weight: 700; letter-spacing: -.01em; }
  .ur-sub { color: var(--muted); font-size: 12.5px; }
  .ur-p { margin: 0; line-height: 1.45; }
  .ur-hint { margin: 0; color: var(--muted); font-size: 12.5px; }
  .ur-panel[hidden], .ur-view[hidden] { display: none; }
  .ur-panel h3 { margin: 0 0 8px; font-size: 15px; font-weight: 650; }
  .ur-btn { padding: 7px 16px; border-radius: 7px; font: inherit; font-weight: 600; font-size: 13.5px; cursor: pointer;
    border: 1px solid var(--line); background: var(--panel); color: var(--fg); white-space: nowrap; }
  .ur-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .ur-btn.small { padding: 4px 12px; font-size: 12.5px; }
  .ur-btn.on { background: color-mix(in srgb, var(--accent) 14%, var(--panel)); border-color: var(--accent); color: var(--accent); }
  .ur-btn.gone { visibility: hidden; }
  .ur-link { color: var(--accent); cursor: pointer; font-weight: 600; font-size: 13.5px; text-decoration: none; background: none; border: 0; padding: 6px 4px; font-family: inherit; }
  .ur-link:hover { text-decoration: underline; }
  .ur-link.gone { visibility: hidden; }
  .ur-input { height: 34px; padding: 0 10px; box-sizing: border-box; border: 1px solid color-mix(in srgb, var(--fg) 22%, var(--line)); border-radius: 6px;
    background: color-mix(in srgb, var(--panel) 75%, var(--bg)); color: var(--fg); font: inherit; font-size: 14px; outline: none; min-width: 0;
    user-select: text; -webkit-user-select: text; }
  .ur-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
  .ur-label { font-size: 13px; font-weight: 600; }
  .ur-err { min-height: 16px; font-size: 12.5px; color: #d63939; }
  .ur-foot { flex: none; display: flex; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid var(--line); }
  .ur-foot .grow { flex: 1; }

  .ur-prog { flex: none; display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--muted); }
  .ur-prog b { color: var(--fg); }
  .ur-barline { height: 6px; border-radius: 99px; background: var(--line); overflow: hidden; }
  .ur-barfill { height: 100%; background: var(--accent); border-radius: 99px; }
  .ur-codebox { margin: 12px 0 8px; padding: 14px 18px; border: 2px dashed var(--accent); border-radius: 10px; display: inline-block;
    background: color-mix(in srgb, var(--accent) 7%, var(--panel)); }
  .ur-codelabel { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
  .ur-code { font: 700 28px/1.2 ui-monospace, Menlo, Consolas, monospace; letter-spacing: .06em; margin-top: 2px; }
  .ur-opts { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
  .ur-opt, .ur-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .ur-opt input, .ur-check input { margin: 0; width: 16px; height: 16px; accent-color: var(--accent); }
  .ur-check { margin-top: 10px; font-weight: 600; }
  .ur-done { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
  .ur-done .ok { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;
    font-weight: 700; color: #2f9e44; background: color-mix(in srgb, #2f9e44 18%, var(--panel)); }
  .ur-done h3 { margin: 0; font-size: 18px; }
  .ur-done .ur-code { font-size: 22px; }

  .ur-grid { display: grid; grid-template-columns: var(--ur-cols); column-gap: 10px; align-items: center; }
  .ur-colhead { flex: none; padding: 0 12px; height: 28px; border: 1px solid var(--line); border-radius: 7px 7px 0 0; font-size: 11.5px;
    text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 650; background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .ur-panewrap { position: relative; flex: 1; min-height: 0; border: 1px solid var(--line); border-top: 0; border-radius: 0 0 7px 7px; overflow: hidden; }
  .ur-pane { position: absolute; left: 0; top: 0; bottom: 0; right: 14px; overflow: hidden; }
  .ur-inner { position: relative; }
  .ur-row { position: absolute; left: 0; right: 0; height: 32px; box-sizing: border-box; padding: 0 12px; font-size: 13.5px;
    border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
  .ur-row span, .ur-trow span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ur-row.odd { background: color-mix(in srgb, var(--fg) 3%, var(--panel)); }
  .ur-row .n { color: var(--muted); font-variant-numeric: tabular-nums; }
  .ur-end { position: absolute; left: 0; right: 0; height: 30px; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 12.5px; }
  .ur-track { position: absolute; right: 0; top: 0; bottom: 0; width: 14px; background: color-mix(in srgb, var(--fg) 5%, var(--panel)); border-left: 1px solid var(--line); cursor: default; }
  .ur-thumb { position: absolute; left: 2px; right: 2px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 32%, var(--panel)); cursor: grab; touch-action: none; }
  .ur-ans { flex: none; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding-top: 4px; }
  .ur-ans .ur-input { width: 90px; }
  .ur-readout { color: var(--muted); font-size: 13px; }
  .ur-readout b { color: var(--fg); }

  .ur-sel { flex: none; height: 34px; display: flex; align-items: center; gap: 6px; padding: 0 12px; border-radius: 7px; font-size: 13px; white-space: nowrap;
    overflow: hidden; background: color-mix(in srgb, var(--accent) 9%, var(--panel)); border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--line)); }
  .ur-sel b { overflow: hidden; text-overflow: ellipsis; }
  .ur-tbl { flex: none; border: 1px solid var(--line); border-radius: 7px; overflow: hidden; }
  .ur-thead { padding: 0 12px; height: 28px; font-size: 11.5px; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); font-weight: 650;
    background: color-mix(in srgb, var(--fg) 3%, var(--panel)); border-bottom: 1px solid var(--line); }
  .ur-trow { padding: 0 12px; height: 40px; box-sizing: border-box; font-size: 13.5px; border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
  .ur-trow:last-child { border-bottom: 0; }
  .ur-trow.off { visibility: hidden; }
  .ur-trow .num { font-variant-numeric: tabular-nums; }
  .ur-badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 12px; background: color-mix(in srgb, var(--fg) 8%, var(--panel)); }
  .ur-pager { flex: none; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; color: var(--muted); }
  .ur-pager .ur-btn { min-width: 34px; padding: 5px 10px; }

  .ur-tabs { flex: none; display: flex; gap: 2px; border-bottom: 1px solid var(--line); }
  .ur-tab { padding: 8px 16px; background: none; border: 0; border-bottom: 2px solid transparent; font: inherit; font-weight: 600; font-size: 14px;
    color: var(--muted); cursor: pointer; margin-bottom: -1px; }
  .ur-tab.on { color: var(--fg); border-bottom-color: var(--accent); }
  .ur-kv { border-collapse: collapse; width: 100%; font-size: 14px; }
  .ur-kv td { padding: 7px 10px; border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent); }
  .ur-kv td:first-child { color: var(--muted); width: 38%; }
  .ur-kv td:last-child { font-weight: 600; overflow-wrap: anywhere; }
  .ur-fields { display: grid; grid-template-columns: repeat(var(--ur-fc, 1), minmax(0, 1fr)); gap: 8px 16px; }
  .ur-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .ur-field .ur-input { width: 100%; }
  .ur-saved { font-size: 13px; color: var(--muted); line-height: 1.4; overflow-wrap: anywhere; min-height: 56px; }
  .ur-saved b { color: var(--fg); }

  .ur-choice { flex: none; height: 34px; display: flex; align-items: center; gap: 6px; padding: 0 12px; border-radius: 7px; font-size: 13px; white-space: nowrap;
    overflow: hidden; background: color-mix(in srgb, var(--accent) 9%, var(--panel)); border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--line)); }
  .ur-cgrid { display: grid; grid-template-columns: repeat(var(--ur-cc, 1), minmax(0, 1fr)); gap: 8px 14px; }
  .ur-tile { display: flex; align-items: center; gap: 10px; padding: 8px 12px; height: 46px; box-sizing: border-box; border: 1px solid var(--line); border-radius: 8px; }
  .ur-tile .sw { width: 30px; height: 30px; flex: none; border-radius: 6px; background: color-mix(in srgb, var(--fg) 10%, var(--panel)); color: var(--muted);
    display: flex; align-items: center; justify-content: center; font-weight: 700; }
  .ur-tile .nm { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
  .ur-detail h3 { margin: 6px 0 2px; font-size: 18px; }
  .ur-price { font-size: 24px; font-weight: 750; margin: 2px 0 8px; }
  .ur-specs { display: grid; grid-template-columns: auto 1fr; gap: 4px 18px; margin: 0 0 8px; font-size: 14px; }
  .ur-specs dt { color: var(--muted); }
  .ur-specs dd { margin: 0; font-weight: 600; }
  `;

  const el = (tag, cls, parent, text) => env.util.el(tag, cls, parent, text);
  let view = null;

  // Usable part of the stage (stage-local px): the whole stage minus a floating end control inside it.
  function usable(ctx) {
    const box = { x: 0, y: 0, w: ctx.size.width, h: ctx.size.height };
    const st = ctx.stage.getBoundingClientRect();
    const sub = env.submitEl && env.submitEl.getBoundingClientRect();
    if (sub && sub.width && sub.left < st.right && sub.right > st.left && sub.top < st.bottom && sub.bottom > st.top) {
      const cutH = st.bottom - sub.top + 10;
      const cutW = st.right - sub.left + 10;
      if (cutH * box.w <= cutW * box.h) box.h -= cutH;
      else box.w -= cutW;
    }
    return box;
  }

  // The app frame: placed after its content height is known (placeFrame).
  function frame(ctx, title) {
    const { rng } = ctx;
    const app = el('div', 'ur-app' + (rng.bool(0.25) ? ' flat' : ''), ctx.stage);
    app.dataset.role = 'recall';
    const bar = el('div', 'ur-bar', app);
    el('span', 'ur-mark', bar);
    el('span', 'ur-appname', bar, title);
    el('span', 'ur-user', bar, rng.pick(['J. Doe', 'A. Kim', 'M. Silva', 'R. Lee', 'T. Park']));
    const work = el('div', 'ur-work', app);
    return { app, work };
  }

  function placeFrame(ctx, app, W, H) {
    const box = usable(ctx);
    const w = Math.round(Math.min(W, box.w - 16));
    const h = Math.round(Math.min(H, box.h - 12));
    app.style.width = `${w}px`;
    app.style.height = `${h}px`;
    const align = ctx.rng.pick(['start', 'center', 'center', 'end']);
    const left = align === 'start' ? 8 : align === 'end' ? box.w - w - 8 : (box.w - w) / 2;
    app.style.left = `${Math.round(box.x + Math.max(0, left))}px`;
    app.style.top = `${Math.round(box.y + Math.max(0, (box.h - h) / 2))}px`;
  }

  // Natural height of the work area (app as tall as its content).
  function naturalHeight(app, work) {
    app.style.height = 'auto';
    work.style.flex = 'none';
    const h = app.offsetHeight;
    work.style.flex = '';
    return h;
  }

  const center = (e) => env.util.center(e);

  // ------------------------------------------------------------------ code

  function buildCode(ctx, work) {
    const { spec } = ctx;
    const fam = env.taskDef;
    const L = spec.steps.length - 1;
    const N = L + 1;
    const s = { acks: [], errs: [], radios: [], panels: [] };
    const apply = (act) => {
      const m = fam.helpers.apply(ctx.model, spec, act);
      if (m !== ctx.model) ctx.update(m);
      paint(ctx.model);
    };
    const prog = el('div', 'ur-prog', work);
    s.progText = el('div', '', prog);
    s.fill = el('div', 'ur-barfill', el('div', 'ur-barline', prog));
    const body = el('div', 'ur-body', work);
    spec.steps.forEach((st, i) => {
      const p = el('section', 'ur-panel', body);
      el('h3', '', p, st.title);
      el('p', 'ur-p', p, st.body);
      if (st.kind === 'show' && spec.judge) {
        el('p', 'ur-hint', p, `Your ${spec.codeLabel.toLowerCase()} will be sent to you by email within a few minutes.`);
      } else if (st.kind === 'show') {
        const box = el('div', 'ur-codebox', p);
        el('div', 'ur-codelabel', box, spec.codeLabel);
        // The code is in the DOM only while step 1 is on screen for the first time (paint): once the step is passed its
        // text is removed, and Back shows no code (Start over, which clears the flow, shows it again).
        s.codeEl = el('div', 'ur-code', box, '');
        el('p', 'ur-hint', p, `Keep this ${spec.codeLabel.toLowerCase()} safe.`);
      } else if (st.kind === 'ack') {
        const lab = el('label', 'ur-check', p);
        const cb = el('input', '', lab);
        cb.type = 'checkbox';
        el('span', '', lab, st.ack);
        cb.addEventListener('change', () => apply({ ack: i, v: cb.checked }));
        s.acks[i] = cb;
        s.errs[i] = el('div', 'ur-err', p, '');
      } else if (st.kind === 'choice') {
        const box = el('div', 'ur-opts', p);
        s.radios[i] = st.options.map((o, k) => {
          const lab = el('label', 'ur-opt', box);
          const r = el('input', '', lab);
          r.type = 'radio';
          r.name = `ur-choice-${i}`;
          el('span', '', lab, o);
          r.addEventListener('change', () => { if (r.checked) apply({ choose: [i, k] }); });
          return r;
        });
      } else if (st.kind === 'verify') {
        const lab = el('label', 'ur-label', p, spec.codeLabel);
        lab.style.display = 'block';
        lab.style.marginTop = '10px';
        const input = el('input', 'ur-input', p);
        input.type = 'text';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.style.width = '240px';
        input.style.marginTop = '4px';
        input.dataset.role = 'field';
        input.placeholder = 'e.g. as shown on page 1';
        lab.htmlFor = 'ur-code-field';
        input.id = 'ur-code-field';
        s.tf = env.ui.textField(input, { value: ctx.model.entered, label: 'code', onInput: (v) => apply({ type: v }) });
        s.input = input;
      }
      s.panels[i] = p;
    });
    const conf = el('section', 'ur-panel', body);
    const dd = el('div', 'ur-done', conf);
    el('div', 'ok', dd, '✓');
    el('h3', '', dd, spec.labels.done);
    const line = el('p', 'ur-p', dd);
    line.append(`${spec.codeLabel} on file: `);
    s.saved = el('b', 'ur-code', line);
    s.reopen = el('a', 'ur-link', dd, spec.labels.reopen);
    s.reopen.href = '#';
    s.reopen.addEventListener('click', (e) => { e.preventDefault(); apply({ reopen: true }); });
    s.conf = conf;
    const foot = el('div', 'ur-foot', work);
    s.restart = el('a', 'ur-link', foot, spec.labels.restart);
    s.restart.href = '#';
    s.restart.addEventListener('click', (e) => { e.preventDefault(); s.codeSeen = false; apply({ restart: true }); });
    el('span', 'grow', foot);
    s.back = el('button', 'ur-btn', foot, spec.labels.back);
    s.back.type = 'button';
    s.back.addEventListener('click', () => apply({ back: true }));
    s.primary = el('button', 'ur-btn primary', foot, spec.labels.next);
    s.primary.type = 'button';
    s.primary.addEventListener('click', () => {
      const m = ctx.model;
      if (m.confirmed) return;
      if (m.step < L) {
        const n = fam.helpers.apply(m, spec, { next: true });
        if (n === m) {
          if (s.errs[m.step]) s.errs[m.step].textContent = 'Please tick the box to continue.';
        } else ctx.update(n);
        paint(ctx.model);
      } else apply({ confirm: true });
    });

    function paint(m) {
      if (s.codeEl) {
        const first = !m.confirmed && m.step === 0;
        if (first && !s.codeSeen) { s.codeEl.textContent = spec.code; s.codeOn = true; }
        else {
          if (s.codeOn) { s.codeSeen = true; s.codeOn = false; }
          s.codeEl.textContent = first ? '(shown once)' : '';
        }
      }
      s.panels.forEach((p, i) => { p.hidden = m.confirmed || i !== m.step; });
      s.conf.hidden = !m.confirmed;
      s.progText.innerHTML = '';
      s.progText.append(m.confirmed ? '' : `Step ${m.step + 1} of ${N} · `);
      const b = document.createElement('b');
      b.textContent = m.confirmed ? spec.labels.done : spec.steps[m.step].title;
      s.progText.append(b);
      s.fill.style.width = `${Math.round(((m.confirmed ? N : m.step + 1) / N) * 100)}%`;
      s.acks.forEach((cb, i) => { if (cb) cb.checked = !!m.acks[i]; });
      s.errs.forEach((e, i) => { if (e && !(i === m.step && e.textContent && !m.acks[i])) e.textContent = ''; });
      s.radios.forEach((rs, i) => { if (rs) rs.forEach((r, k) => { r.checked = (m.choice[i] ?? 0) === k; }); });
      if (s.tf && s.tf.get() !== m.entered) s.tf.set(m.entered);
      s.saved.textContent = m.saved ?? '';
      const inFlow = !m.confirmed && m.step > 0;
      s.back.classList.toggle('gone', !(spec.back === 'back' && inFlow));
      s.back.style.display = spec.back === 'back' ? '' : 'none';
      s.restart.classList.toggle('gone', !(spec.back === 'restart' && inFlow));
      s.restart.style.display = spec.back === 'restart' ? '' : 'none';
      s.primary.classList.toggle('gone', m.confirmed);
      s.primary.textContent = m.step < L ? spec.labels.next : spec.labels.confirm;
    }

    const measure = () => {
      let hmax = 0;
      if (s.codeEl) s.codeEl.textContent = spec.code; // the tallest state of step 1; paint() sets the real one
      for (const p of [...s.panels, s.conf]) {
        for (const q of [...s.panels, s.conf]) q.hidden = q !== p;
        hmax = Math.max(hmax, p.offsetHeight);
      }
      body.style.height = `${hmax + 4}px`;
    };
    measure();
    paint(ctx.model);
    return {
      paint,
      locate(t) {
        if (t.field) return s.tf.locate();
        if (t.ack !== undefined) return center(s.acks[t.ack]);
        if (t.nav === 'next' || t.nav === 'confirm') return center(s.primary);
        if (t.nav === 'back') return center(s.back);
        if (t.nav === 'restart') return center(s.restart);
        if (t.nav === 'reopen') return center(s.reopen);
        throw new Error(`recall-info/classic cannot locate ${JSON.stringify(t)}`);
      },
    };
  }

  // ------------------------------------------------------------------ count

  const COUNT_COLS = {
    orders: '40px 1.1fr 1.6fr 1fr 0.9fr',
    tickets: '40px 0.9fr 2.6fr 0.9fr 1fr',
    files: '40px 2.2fr 1fr 0.9fr 1.2fr',
  };

  function buildCount(ctx, work, app) {
    const { spec } = ctx;
    const fam = env.taskDef;
    const rowH = 32;
    const footH = 30;
    const T = spec.T;
    app.style.setProperty('--ur-cols', COUNT_COLS[spec.dataset]);
    const head = el('div', '', work);
    head.style.cssText = 'display:flex;align-items:baseline;gap:10px;flex:none';
    el('h2', 'ur-h', head, spec.title);
    const subEl = el('span', 'ur-sub', head, 'Scroll to load more');
    const cols = el('div', 'ur-colhead ur-grid', work);
    spec.cols.forEach((c) => el('span', '', cols, c));
    const wrap = el('div', 'ur-panewrap', work);
    const pane = el('div', 'ur-pane', wrap);
    pane.dataset.role = 'list';
    const inner = el('div', 'ur-inner', pane);
    const track = el('div', 'ur-track', wrap);
    const thumb = el('div', 'ur-thumb', track);
    const endRow = el('div', 'ur-end', inner);
    const ans = el('div', 'ur-ans', work);
    const lab = el('label', 'ur-label', ans, spec.ansLabel);
    const input = el('input', 'ur-input', ans);
    input.type = 'text';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.dataset.role = 'field';
    input.id = 'ur-count-field';
    lab.htmlFor = 'ur-count-field';
    const btn = el('button', 'ur-btn primary', ans, spec.submitLabel);
    btn.type = 'button';
    const readout = el('span', 'ur-readout', ans);
    const apply = (act) => {
      const m = fam.helpers.apply(ctx.model, spec, act);
      if (m !== ctx.model) ctx.update(m);
      paint(ctx.model);
    };
    const tf = env.ui.textField(input, { value: ctx.model.entered, accept: /\d/, maxLength: 4, label: 'count', onInput: (v) => apply({ type: v }) });
    btn.addEventListener('click', () => apply({ commit: true }));

    let loaded = Math.min(T, spec.batch);
    const live = new Map();
    const totalH = () => loaded * rowH + footH;
    const makeRow = (i) => {
      const r = el('div', `ur-row ur-grid${i % 2 ? ' odd' : ''}`, inner);
      r.style.top = `${i * rowH}px`;
      spec.rows[i].forEach((c, k) => el('span', k === 0 ? 'n' : '', r, c));
      return r;
    };
    function refresh() {
      const h = pane.clientHeight;
      let top = pane.scrollTop;
      let grew = false;
      while (loaded < T && top + h >= loaded * rowH - rowH) { loaded = Math.min(T, loaded + spec.batch); grew = true; }
      if (grew) inner.style.height = `${totalH()}px`;
      endRow.style.top = `${loaded * rowH}px`;
      endRow.textContent = loaded < T ? 'Loading more…' : `End of list · ${T} items`;
      subEl.textContent = loaded < T ? 'Scroll to load more' : `All ${T} items loaded`;
      top = pane.scrollTop;
      const first = Math.max(0, Math.floor(top / rowH));
      const lastI = Math.min(loaded - 1, Math.floor((top + h - 1) / rowH));
      for (const [i, r] of live) if (i < first || i > lastI) { r.remove(); live.delete(i); }
      for (let i = first; i <= lastI; i++) if (!live.has(i)) live.set(i, makeRow(i));
      const sh = pane.scrollHeight;
      const tl = track.clientHeight;
      const th = Math.max(28, Math.round((tl * h) / Math.max(sh, h)));
      thumb.style.height = `${th}px`;
      thumb.style.top = `${sh > h ? Math.round((top / (sh - h)) * (tl - th)) : 0}px`;
      const reached = Math.min(loaded, Math.ceil((top + h) / rowH));
      if (reached > ctx.model.reached) ctx.patch({ reached });
    }
    inner.style.height = `${totalH()}px`;
    const sp = env.ui.scrollPane(pane, { thumb, track, label: 'list-scrollbar', onScroll: refresh });
    pane.addEventListener('scroll', refresh);
    // A start part-way down the list: load up to there and scroll so that row `reached` is the last one in view.
    const r0 = ctx.model.reached;
    if (r0 > 0) {
      while (loaded < T && r0 * rowH >= loaded * rowH - rowH) loaded = Math.min(T, loaded + spec.batch);
      inner.style.height = `${totalH()}px`;
      pane.scrollTop = Math.max(0, r0 * rowH - pane.clientHeight);
    }
    refresh();

    function paint(m) {
      if (tf.get() !== m.entered) tf.set(m.entered);
      readout.innerHTML = '';
      if (m.committed) {
        readout.append('Answer on file: ');
        el('b', '', readout, String(m.saved));
      } else readout.append('Nothing sent yet');
    }
    paint(ctx.model);
    return {
      paint,
      pane,
      locate(t) {
        if (t.list) return center(pane);
        if (t.field) return tf.locate();
        if (t.commit) return center(btn);
        if (t.track) {
          const tr = track.getBoundingClientRect();
          const th = thumb.getBoundingClientRect();
          const room = tr.bottom - th.bottom;
          if (room < 3) return [tr.left + tr.width / 2, tr.top + tr.height / 2];
          return [tr.left + tr.width / 2, th.bottom + Math.min(14, room / 2)];
        }
        throw new Error(`recall-info/classic cannot locate ${JSON.stringify(t)}`);
      },
      sp,
    };
  }

  // ------------------------------------------------------------------ paginate

  function buildPaginate(ctx, work, app) {
    const { spec } = ctx;
    const fam = env.taskDef;
    const per = spec.perPage;
    const P = spec.pages;
    app.style.setProperty('--ur-cols', 'minmax(0,2.6fr) minmax(0,1fr) minmax(0,0.9fr) minmax(0,1.3fr) 104px');
    const head = el('div', '', work);
    head.style.cssText = 'display:flex;align-items:baseline;gap:10px;flex:none';
    el('h2', 'ur-h', head, spec.title);
    const total = el('span', 'ur-sub', head, `${spec.rows.length} results`);
    const sel = el('div', 'ur-sel', work);
    const tbl = el('div', 'ur-tbl', work);
    const th = el('div', 'ur-thead ur-grid', tbl);
    [...spec.cols, ''].forEach((c) => el('span', '', th, c));
    const slots = [];
    for (let k = 0; k < per; k++) {
      const r = el('div', 'ur-trow ur-grid', tbl);
      const name = el('span', '', r);
      const num = el('span', 'num', r);
      const rate = el('span', 'num', r);
      const cat = el('span', '', r);
      const b = el('button', 'ur-btn small', r, spec.actLabel);
      b.type = 'button';
      b.addEventListener('click', () => { const i = slots[k].idx; if (i !== null) apply({ pick: i }); });
      el('span', 'ur-badge', cat);
      slots.push({ r, name, num, rate, cat: cat.firstChild, b, idx: null });
    }
    const pager = el('div', 'ur-pager', work);
    const pb = {};
    pb.prev = el('button', 'ur-btn small', pager, spec.pager === 'numbers' ? '‹' : '‹ Previous');
    pb.nums = [];
    let pageText = null;
    if (spec.pager === 'numbers') {
      for (let p = 0; p < P; p++) {
        const b = el('button', 'ur-btn small', pager, String(p + 1));
        b.type = 'button';
        b.addEventListener('click', () => apply({ goto: p }));
        pb.nums.push(b);
      }
    } else pageText = el('span', '', pager);
    pb.next = el('button', 'ur-btn small', pager, spec.pager === 'numbers' ? '›' : 'Next ›');
    pb.prev.type = 'button';
    pb.next.type = 'button';
    pb.prev.addEventListener('click', () => apply({ prev: true }));
    pb.next.addEventListener('click', () => apply({ next: true }));
    function apply(act) {
      const m = fam.helpers.apply(ctx.model, spec, act);
      if (m !== ctx.model) ctx.update(m);
      paint(ctx.model);
    }
    function paint(m) {
      const idxs = fam.helpers.rowsOnPage(spec, m.page);
      slots.forEach((sl, k) => {
        const i = idxs[k];
        sl.idx = i === undefined ? null : i;
        sl.r.classList.toggle('off', i === undefined);
        if (i === undefined) return;
        const row = spec.rows[i];
        sl.name.textContent = row.name;
        sl.name.title = row.name;
        sl.num.textContent = fam.helpers.fmtNum(spec, row.num);
        sl.rate.textContent = `★ ${row.rate.toFixed(2)}`;
        sl.cat.textContent = row.cat;
        const on = m.picked === i;
        sl.b.textContent = on ? '✓ Selected' : spec.actLabel;
        sl.b.classList.toggle('on', on);
      });
      sel.innerHTML = '';
      if (m.picked == null) sel.append('Nothing selected yet');
      else {
        const r = spec.rows[m.picked];
        sel.append('Selected: ');
        el('b', '', sel, r.name);
        sel.append(` · ${spec.numCol} ${fam.helpers.fmtNum(spec, r.num)} · ★ ${r.rate.toFixed(2)} · ${spec.catCol}: ${r.cat}`);
      }
      const a = m.page * per + 1;
      const z = Math.min(spec.rows.length, (m.page + 1) * per);
      total.textContent = `${spec.rows.length} results · showing ${a}-${z}`;
      pb.nums.forEach((b, p) => b.classList.toggle('on', p === m.page));
      if (pageText) pageText.textContent = `Page ${m.page + 1} of ${P}`;
      pb.prev.classList.toggle('gone', m.page === 0);
      pb.next.classList.toggle('gone', m.page === P - 1);
    }
    paint(ctx.model);
    return {
      paint,
      locate(t) {
        if (t.page !== undefined) return center(pb.nums[t.page]);
        if (t.pager) return center(t.pager === 'next' ? pb.next : pb.prev);
        if (t.pick !== undefined) {
          const sl = slots.find((x) => x.idx === t.pick);
          if (!sl) throw new Error(`recall-info/classic: row ${t.pick} is not on this page`);
          return center(sl.b);
        }
        throw new Error(`recall-info/classic cannot locate ${JSON.stringify(t)}`);
      },
    };
  }

  // ------------------------------------------------------------------ crossref

  function buildCrossref(ctx, work) {
    const { spec } = ctx;
    const fam = env.taskDef;
    const tabs = el('div', 'ur-tabs', work);
    tabs.setAttribute('role', 'tablist');
    const tb = spec.tabs.map((t, i) => {
      const b = el('button', 'ur-tab', tabs, t.name);
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.dataset.role = 'tab';
      b.addEventListener('click', () => apply({ tab: i }));
      return b;
    });
    const body = el('div', 'ur-body', work);
    const panels = [];
    const tfs = {};
    let saveBtn = null;
    let savedEl = null;
    spec.tabs.forEach((t, i) => {
      const p = el('section', 'ur-panel', body);
      panels[i] = p;
      if (t.kind === 'src') {
        const table = el('table', 'ur-kv', p);
        for (const [k, v] of t.rows) {
          const tr = el('tr', '', table);
          el('td', '', tr, k);
          el('td', '', tr, v);
        }
        return;
      }
      el('h3', '', p, t.name);
      const grid = el('div', 'ur-fields', p);
      grid.style.setProperty('--ur-fc', spec.fields.length > 3 ? '2' : '1');
      for (const f of spec.fields) {
        const w = el('div', 'ur-field', grid);
        const lab = el('label', 'ur-label', w, f.label);
        const input = el('input', 'ur-input', w);
        input.type = 'text';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.id = `ur-x-${f.id}`;
        input.dataset.role = 'field';
        lab.htmlFor = input.id;
        tfs[f.id] = env.ui.textField(input, { value: ctx.model.entered[f.id] || '', label: f.id, onInput: (v) => apply({ type: [f.id, v] }) });
      }
      const row = el('div', '', p);
      row.style.cssText = 'display:flex;align-items:center;gap:12px;margin-top:12px';
      saveBtn = el('button', 'ur-btn primary', row, spec.labels.save);
      saveBtn.type = 'button';
      saveBtn.addEventListener('click', () => apply({ commit: true }));
      savedEl = el('div', 'ur-saved', p);
      savedEl.style.marginTop = '8px';
    });
    function apply(act) {
      const m = fam.helpers.apply(ctx.model, spec, act);
      if (m !== ctx.model) ctx.update(m);
      paint(ctx.model);
    }
    function paint(m) {
      panels.forEach((p, i) => { p.hidden = i !== m.tab; });
      tb.forEach((b, i) => { b.classList.toggle('on', i === m.tab); b.setAttribute('aria-selected', i === m.tab ? 'true' : 'false'); });
      for (const f of spec.fields) if (tfs[f.id].get() !== (m.entered[f.id] || '')) tfs[f.id].set(m.entered[f.id] || '');
      savedEl.innerHTML = '';
      if (m.committed && m.saved) {
        el('b', '', savedEl, `${spec.labels.saved}: `);
        savedEl.append(spec.fields.map((f) => `${f.label} ${m.saved[f.id]}`).join(' · '));
      } else savedEl.append('Not saved yet');
    }
    let hmax = 0;
    for (const p of panels) {
      for (const q of panels) q.hidden = q !== p;
      hmax = Math.max(hmax, p.offsetHeight);
    }
    body.style.height = `${hmax + 4}px`;
    paint(ctx.model);
    return {
      paint,
      locate(t) {
        if (t.tab !== undefined) return center(tb[t.tab]);
        if (t.field) return tfs[t.field].locate();
        if (t.commit) return center(saveBtn);
        throw new Error(`recall-info/classic cannot locate ${JSON.stringify(t)}`);
      },
    };
  }

  // ------------------------------------------------------------------ compare

  function buildCompare(ctx, work) {
    const { spec } = ctx;
    const fam = env.taskDef;
    const items = spec.items;
    el('h2', 'ur-h', work, spec.title);
    const bar = el('div', 'ur-choice', work);
    const body = el('div', 'ur-body', work);
    const list = el('div', 'ur-view', body);
    const grid = el('div', 'ur-cgrid', list);
    grid.style.setProperty('--ur-cc', items.length > 5 ? '2' : '1');
    const tiles = items.map((it, i) => {
      const t = el('div', 'ur-tile', grid);
      el('span', 'sw', t, it.name.charAt(0).toUpperCase());
      el('span', 'nm', t, it.name).title = it.name;
      const v = el('button', 'ur-btn small', t, 'View details');
      v.type = 'button';
      v.addEventListener('click', () => apply({ open: i }));
      let c = null;
      if (spec.listChoose) {
        c = el('button', 'ur-btn small', t, spec.actLabel);
        c.type = 'button';
        c.addEventListener('click', () => apply({ pick: i }));
      }
      return { v, c };
    });
    const det = el('div', 'ur-view ur-detail', body);
    const back = el('button', 'ur-link', det, `‹ All ${spec.nouns}`);
    back.type = 'button';
    back.style.paddingLeft = '0';
    back.addEventListener('click', () => apply({ back: true }));
    const dName = el('h3', '', det);
    const dPrice = el('div', 'ur-price', det);
    const dl = el('dl', 'ur-specs', det);
    const dBlurb = el('p', 'ur-p', det);
    const dBtn = el('button', 'ur-btn primary', det, spec.actLabel);
    dBtn.type = 'button';
    dBtn.style.marginTop = '8px';
    dBtn.addEventListener('click', () => apply({ pick: ctx.model.open }));
    const showDetail = (i) => {
      const it = items[i];
      dName.textContent = it.name;
      dPrice.textContent = `$${it.price.toFixed(2)}`;
      dl.innerHTML = '';
      for (const [k, v] of [['Rating', `★ ${it.rating.toFixed(1)} / 5`], ['Delivery', `${it.delivery} day${it.delivery === 1 ? '' : 's'}`],
        ['Colour', it.colour], ['Warranty', `${it.warranty} year${it.warranty === 1 ? '' : 's'}`]]) {
        el('dt', '', dl, k);
        el('dd', '', dl, v);
      }
      dBlurb.textContent = it.blurb;
    };
    function apply(act) {
      const m = fam.helpers.apply(ctx.model, spec, act);
      if (m !== ctx.model) ctx.update(m);
      paint(ctx.model);
    }
    function paint(m) {
      list.hidden = m.view !== 'list';
      det.hidden = m.view !== 'detail';
      bar.innerHTML = '';
      if (m.picked == null) bar.append('Your choice: none yet');
      else {
        bar.append('Your choice: ');
        el('b', '', bar, items[m.picked].name);
        bar.append(` · $${items[m.picked].price.toFixed(2)}`);
      }
      if (m.view === 'detail' && m.open !== null) {
        showDetail(m.open);
        const on = m.picked === m.open;
        dBtn.textContent = on ? '✓ Chosen' : `${spec.actLabel} this ${spec.noun}`;
        dBtn.classList.toggle('on', on);
      }
      tiles.forEach((t, i) => {
        if (!t.c) return;
        const on = m.picked === i;
        t.c.textContent = on ? '✓ Chosen' : spec.actLabel;
        t.c.classList.toggle('on', on);
      });
    }
    let hmax = 0;
    list.hidden = false;
    det.hidden = true;
    hmax = list.offsetHeight;
    list.hidden = true;
    det.hidden = false;
    for (let i = 0; i < items.length; i++) { showDetail(i); hmax = Math.max(hmax, det.offsetHeight); }
    body.style.height = `${hmax + 4}px`;
    paint(ctx.model);
    return {
      paint,
      locate(t) {
        if (t.open !== undefined) return center(tiles[t.open].v);
        if (t.nav === 'back') return center(back);
        if (t.choose !== undefined) return center(tiles[t.choose].c);
        if (t.chooseOpen) return center(dBtn);
        throw new Error(`recall-info/classic cannot locate ${JSON.stringify(t)}`);
      },
    };
  }

  // ------------------------------------------------------------------ widget

  const TITLES = { code: (s) => s.title, count: () => 'Workspace', paginate: () => 'Catalog', crossref: () => 'Back office', compare: () => 'Store' };
  const WIDTH = { code: 600, count: 700, paginate: 740, crossref: 640, compare: 720 };

  env.widget({
    task: 'recall-info',
    site: 'base',
    name: 'classic',
    split: 'train',
    scenarios: ['code', 'count', 'paginate', 'crossref', 'compare'],

    render(ctx) {
      ctx.css('ur-style', CSS);
      const { spec, size } = ctx;
      const { app, work } = frame(ctx, TITLES[spec.scenario](spec));
      const tight = size.height < 560;
      if (tight) work.classList.add('tight');
      const W = WIDTH[spec.scenario] + ctx.rng.int(-30, 30);
      app.style.width = `${Math.min(W, size.width - 16)}px`;
      let H;
      if (spec.scenario === 'count') {
        const box = usable(ctx);
        H = Math.max(420, Math.min(box.h - 12, 600));
        placeFrame(ctx, app, W, H);
        view = buildCount(ctx, work, app);
      } else {
        view = { code: buildCode, paginate: buildPaginate, crossref: buildCrossref, compare: buildCompare }[spec.scenario](ctx, work, app);
        H = naturalHeight(app, work);
        placeFrame(ctx, app, W, H);
      }
      return { anchors: [app], sync(m) { view.paint(m); } };
    },

    locate(t) {
      if (!view) throw new Error('recall-info/classic not rendered');
      return view.locate(t);
    },
  });
})();
