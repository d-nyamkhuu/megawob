/* set-date/_calendar-fields: shared template builders; S retains the live template scope and design hooks. */
(function () {
  'use strict';
  env.template('set-date/_calendar-fields', () => ({
    buildText(S, ctx, mask, shown, helpText, unmasked = false) {
      const { util } = ctx;
      const { row, help } = S.P.fieldRow(S.geo.body, S.spec.scene.label, helpText, util);
      S.control = util.el('input', 'fd-input', row);
      S.control.dataset.role = 'field';
      Object.assign(S.control, { type: 'text', placeholder: shown, autocomplete: 'off', spellcheck: false });
      S.control.setAttribute('inputmode', unmasked ? 'text' : 'numeric');
      S.control.value = ctx.model.text;
      S.P.textCreated(ctx, row, help, shown, unmasked);
      row.append(help);
      S.P.textHelp(ctx, row, help, shown);
      for (const ex of S.geo.extrasBelow) S.P.staticRow(S.geo.body, ex, util);
      S.control.addEventListener('input', () => {
        const t = unmasked ? S.control.value : S.fam.helpers.maskText(S.control.value, mask);
        if (S.control.value !== t) {
          S.control.value = t;
          S.control.setSelectionRange(t.length, t.length);
        }
        ctx.update({ text: t });
      });
      S.paintFns.push((m) => { if (S.control.value !== m.text) S.control.value = m.text; });
      S.card.style.width = S.geo.cardW + 'px';
      S.card.style.height = S.card.offsetHeight + 'px';
    },

    buildDuration(S, ctx) {
      const { util, rng } = ctx;
      const fmt = (v) => S.fam.helpers.fmtDur(v);
      if (S.spec.control === 'spin') {
        const { row, help } = S.P.fieldRow(S.geo.body, S.spec.scene.label, 'Hours and minutes', util);
        S.control = util.el('div', 'fd-spin', row);
        S.control.dataset.role = 'field';
        const seg = (kind, range, unit) => {
          const s = util.el('div', 'fd-seg', S.control);
          const up = util.el('div', 'fd-arr', s);
          up.innerHTML = S.D.up;
          const val = util.el('div', 'fd-val', s);
          const down = util.el('div', 'fd-arr', s);
          down.innerHTML = S.D.down;
          util.el('span', 'fd-unit', S.control, unit);
          S.ui.dur[kind] = env.ui.spinner({ up, down, field: val, ...range, label: `duration ${kind}`, onStep: (dir) => S.P.act({ dur: kind, dir }) });
          return val;
        };
        const hv = seg('hours', { min: 0, max: 12, step: 1 }, 'h');
        const mv = seg('minutes', { min: 0, max: 60 - S.spec.step, step: S.spec.step, wrap: true }, 'min');
        row.append(help);
        S.paintFns.push((m) => {
          hv.textContent = String(Math.floor(m.value / 60));
          mv.textContent = String(m.value % 60).padStart(2, '0');
          S.ui.dur.hours.set(Math.floor(m.value / 60));
          S.ui.dur.minutes.set(m.value % 60);
        });
      } else if (S.spec.control === 'fields') {
        const { row, help } = S.P.fieldRow(S.geo.body, S.spec.scene.label, rng.pick(['Enter hours and minutes.', 'Whole numbers only.']), util);
        S.control = util.el('div', 'fd-dur', row);
        S.control.dataset.role = 'field';
        const inp = (key, unit) => {
          const i = util.el('input', 'fd-input', S.control);
          Object.assign(i, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: '0' });
          i.setAttribute('inputmode', 'numeric');
          i.dataset.role = key === 'h' ? 'hours' : 'minutes';
          util.el('span', 'fd-unit', S.control, unit);
          i.addEventListener('input', () => {
            const t = i.value.replace(/\D/g, '').slice(0, 3);
            if (i.value !== t) i.value = t;
            S.ctxRef.update({ ...S.ctxRef.model, [key]: t });
          });
          return i;
        };
        S.ui.el.hours = inp('h', rng.pick(['h', 'hours', 'hrs']));
        S.ui.el.minutes = inp('m', rng.pick(['min', 'minutes', 'mins']));
        row.append(help);
        S.paintFns.push((m) => {
          if (S.ui.el.hours.value !== m.h) S.ui.el.hours.value = m.h;
          if (S.ui.el.minutes.value !== m.m) S.ui.el.minutes.value = m.m;
        });
      } else {
        const { row, help } = S.P.fieldRow(S.geo.body, S.spec.scene.label, `Steps of ${S.spec.step} minutes`, util);
        const chips = util.el('div', 'fd-presets', row);
        S.ui.el.presets = new Map();
        for (const p of S.spec.presets) {
          const c = util.el('div', 'fd-chip', chips, fmt(p));
          c.dataset.role = 'preset';
          c.addEventListener('click', () => S.P.act({ preset: p }));
          S.ui.el.presets.set(p, c);
        }
        S.control = util.el('div', 'fd-stepper', row);
        S.control.dataset.role = 'field';
        const dn = util.el('div', 'fd-sbtn', S.control, `−${S.spec.step}`);
        const out = util.el('div', 'fd-readout', S.control);
        const upb = util.el('div', 'fd-sbtn', S.control, `+${S.spec.step}`);
        dn.addEventListener('click', () => S.P.act({ stepBtn: 'down' }));
        upb.addEventListener('click', () => S.P.act({ stepBtn: 'up' }));
        S.ui.el.stepdown = dn;
        S.ui.el.stepup = upb;
        row.append(help);
        S.paintFns.push((m) => {
          out.textContent = fmt(m.value);
          for (const [p, c] of S.ui.el.presets) c.classList.toggle('on', p === m.value);
        });
      }
      for (const ex of S.geo.extrasBelow) S.P.staticRow(S.geo.body, ex, util);
      S.card.style.width = S.geo.cardW + 'px';
      S.card.style.height = S.card.offsetHeight + 'px';
    },

    buildTyped(S, ctx) {
      S.P.typedBefore(ctx);
      const longForm = S.D.longText && Boolean(S.spec.longForm);
      const shown = longForm ? S.spec.longShown || S.spec.maskShown || S.spec.mask : S.spec.maskShown || S.spec.mask;
      S.P.buildText(ctx, longForm ? null : S.spec.mask, shown, `Format: ${shown}`, longForm);
      S.P.typedAfter(ctx);
    },

    typedBefore(S, ctx) {
      if (!S.D.typedContext) return;
      const context = ctx.util.el('div', 'fd-context', S.card);
      ctx.util.el('label', '', context, S.D.typedContext[0]);
      ctx.util.el('div', 'fd-description', context, S.D.typedContext[1]);
    },

    typedAfter(S, ctx) {
      const { util } = ctx;
      if (S.D.typedAux) {
        const aux = util.el('div', 'fd-auxgrid', S.card);
        S.D.typedAux.forEach(([k, v]) => {
          const box = util.el('div', '', aux);
          util.el('label', '', box, k);
          util.el('div', 'fd-static', box, v);
        });
      }
      if (S.D.typedReminder) {
        const reminder = util.el('label', 'fd-reminder', S.card);
        const check = util.el('input', '', reminder);
        check.type = 'checkbox';
        reminder.append(' Add a reminder');
      }
    }
  }));
})();
