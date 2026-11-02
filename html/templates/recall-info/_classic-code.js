/* recall-info/_classic-code: classic's code parts and view builder; part names stay in classic. */
(function () {
  'use strict';

  function parts(S, shared) {
    const { el, titleLine } = shared;
    const BASE = {};
    // code: a request flow with a once-visible code.
    BASE.progress = (ctx, work, s) => {
      const prog = el('div', 'ur-prog', work);
      s.progText = el('div', '', prog);
      s.fill = el('div', 'ur-barfill', el('div', 'ur-barline', prog));
    };

    BASE.codeBox = (ctx, p, s) => {
      const { spec } = ctx;
      const box = el('div', 'ur-codebox', p);
      el('div', 'ur-codelabel', box, spec.codeLabel);
      // The code is in the DOM only while step 1 is on screen for the first time (paint): once the step is passed its
      // text is removed, and Back shows no code (Start over, which clears the flow, shows it again).
      s.codeEl = el('div', 'ur-code', box, '');
      el('p', 'ur-hint', p, `Keep this ${spec.codeLabel.toLowerCase()} safe.`);
    };

    BASE.ack = (ctx, p, st, i, s, apply) => {
      const lab = el('label', 'ur-check', p);
      const cb = el('input', '', lab);
      cb.type = 'checkbox';
      el('span', '', lab, st.ack);
      cb.addEventListener('change', () => apply({ ack: i, v: cb.checked }));
      s.acks[i] = cb;
      s.errs[i] = el('div', 'ur-err', p, '');
    };

    BASE.choices = (ctx, p, st, i, s, apply) => {
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
    };

    const codeField = (ctx, p, s, apply) => {
      const { spec } = ctx;
      const lab = el('label', 'ur-label', p, spec.codeLabel);
      lab.style.display = 'block';
      lab.style.marginTop = '10px';
      const input = el('input', 'ur-input', p);
      input.type = 'text';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.style.width = S.D.fieldWidth;
      input.style.marginTop = '4px';
      input.dataset.role = 'field';
      input.placeholder = 'e.g. as shown on page 1';
      lab.htmlFor = 'ur-code-field';
      input.id = 'ur-code-field';
      s.tf = env.ui.textField(input, { value: ctx.model.entered, label: 'code', onInput: (v) => apply({ type: v }) });
      s.input = input;
    };

    BASE.panel = (ctx, body, st, i, s, apply) => {
      const { spec } = ctx;
      const p = el('section', 'ur-panel', body);
      el('h3', '', p, st.title);
      el('p', 'ur-p', p, st.body);
      if (st.kind === 'show' && spec.judge) {
        el('p', 'ur-hint', p, `Your ${spec.codeLabel.toLowerCase()} will be sent to you by email within a few minutes.`);
      } else if (st.kind === 'show') {
        S.P.codeBox(ctx, p, s);
      } else if (st.kind === 'ack') {
        S.P.ack(ctx, p, st, i, s, apply);
      } else if (st.kind === 'choice') {
        S.P.choices(ctx, p, st, i, s, apply);
      } else if (st.kind === 'verify') {
        S.P.field(ctx, p, s, apply);
      }
      S.P.decorated(ctx, p, st);
      return p;
    };

    BASE.confirmation = (ctx, body, s, apply) => {
      const { spec } = ctx;
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
    };

    const codeControls = (ctx, work, s, apply, next) => {
      const { spec } = ctx;
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
      s.primary.addEventListener('click', next);
    };

    return { parts: BASE, codeField, codeControls };
  }

  function build(S, shared) {
    const { el, center, actions, fitPanels } = shared;
    return (ctx, work, app) => {
      const { spec } = ctx;
      const fam = env.taskDef;
      const L = spec.steps.length - 1;
      const N = L + 1;
      const s = { acks: [], errs: [], radios: [], panels: [] };
      const apply = actions(ctx, paint);
      S.P.progress(ctx, work, s);
      const body = el('div', 'ur-body', work);
      spec.steps.forEach((st, i) => {
        const p = S.P.panel(ctx, body, st, i, s, apply);
        s.panels[i] = p;
      });
      S.P.confirmation(ctx, body, s, apply);
      const next = () => {
        const m = ctx.model;
        if (m.confirmed) return;
        if (m.step < L) {
          const n = fam.helpers.apply(m, spec, { next: true });
          if (n === m) {
            if (s.errs[m.step]) s.errs[m.step].textContent = 'Please tick the box to continue.';
          } else ctx.update(n);
          paint(ctx.model);
        } else apply({ confirm: true });
      };
      S.P.controls(ctx, work, s, apply, next);

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

      if (s.codeEl) s.codeEl.textContent = spec.code; // the tallest state of step 1; paint() sets the real one
      fitPanels(body, [...s.panels, s.conf]);
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
    };
  }

  env.template('recall-info/_classic-code', () => ({ parts, build }));
})();
