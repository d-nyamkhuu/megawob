/* set-date/_calendar-time: shared template builders; S retains the live template scope and design hooks. */
(function () {
  'use strict';
  env.template('set-date/_calendar-time', () => ({
    buildTimeColumns(S, ctx) {
      const { util, size } = ctx;
      const { row } = S.P.fieldRow(S.geo.body, S.spec.scene.label, null, util);
      S.control = S.P.clickControl(row, S.D.clockIcon, util);
      const txt = util.el('span', 'fd-txt', S.control);
      for (const ex of S.geo.extrasBelow) S.P.staticRow(S.geo.body, ex, util);
      S.P.placePop(util);
      const hours = S.geo.hour12First ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const mins = Array.from({ length: 60 / S.spec.step }, (_, i) => i * S.spec.step);
      S.geo.row = Math.max(20, Math.min(S.geo.row, Math.floor((S.P.popRoom(size) - 24 - 24) / 12)));
      const popW = 24 + 3 * 64 + 2 * 12;
      const popH = 24 + 24 + 12 * S.geo.row;
      S.pop.style.setProperty('--row', S.geo.row + 'px');
      S.card.style.width = Math.min(size.width - 32, Math.max(S.geo.cardW, popW + S.control.offsetLeft * 2)) + 'px';
      S.P.fitCard(S.P.sizePop(popW, popH), util);
      const parts12 = S.fam.helpers.parts12;

      S.paintFns.push((m) => {
        S.control.classList.toggle('open', !!m.open);
        S.P.timeReadout(txt, m.value, util, 'columns');
        S.pop.hidden = !m.open;
        if (!m.open) return;
        S.pop.replaceChildren();
        const cur = m.value === null ? null : parts12(m.value);
        const cols = util.el('div', 'fd-cols', S.pop);
        const column = (title, kind, values, show, on) => {
          const col = util.el('div', 'fd-col', cols);
          util.el('h4', '', col, title);
          const els = values.map((v) => {
            const o = util.el('div', 'fd-opt' + (on(v) ? ' on' : ''), col, show(v));
            o.dataset.role = 'option';
            return [v, o];
          });
          S.ui.cols[kind] = env.ui.choices(els, {
            label: `time ${kind}`,
            value: values.find(on) ?? null,
            onChange: (v) => S.P.act({ col: kind, value: v }),
          });
        };
        column('Hour', 'hour', hours, (v) => (S.geo.padHour ? String(v).padStart(2, '0') : String(v)), (v) => cur && cur.h === v);
        column('Min', 'minute', mins, (v) => String(v).padStart(2, '0'), (v) => cur && cur.m === v);
        column('', 'ampm', ['AM', 'PM'], String, (v) => cur && cur.ap === v);
      });
    },

    buildClock(S, ctx) {
      const { util, size } = ctx;
      const { row } = S.P.fieldRow(S.geo.body, S.spec.scene.label, null, util);
      S.control = S.P.clickControl(row, S.D.clockIcon, util);
      const txt = util.el('span', 'fd-txt', S.control);
      for (const ex of S.geo.extrasBelow) S.P.staticRow(S.geo.body, ex, util);
      S.P.placePop(util);
      const diameter = Math.max(170, Math.min(230, S.P.popRoom(size) - 24 - 54));
      const popW = Math.max(diameter + 24, 250);
      const popH = 24 + 54 + diameter;
      S.card.style.width = Math.min(size.width - 32, Math.max(S.geo.cardW, popW + S.control.offsetLeft * 2)) + 'px';
      S.P.fitCard(S.P.sizePop(popW, popH), util);
      const parts12 = S.fam.helpers.parts12;
      S.paintFns.push((m) => {
        S.control.classList.toggle('open', !!m.open);
        S.P.timeReadout(txt, m.value, util, 'clock');
        S.pop.hidden = !m.open;
        if (!m.open) return;
        S.pop.replaceChildren();
        S.ui.el = { nums: new Map() };
        const cur = parts12(m.value);
        const head = util.el('div', 'fd-chead', S.pop);
        const read = util.el('div', 'fd-cread', head);
        const hs = util.el('span', m.stage === 'hour' ? 'on' : '', read, String(cur.h).padStart(2, '0'));
        read.append(':');
        const ms = util.el('span', m.stage === 'minute' ? 'on' : '', read, String(cur.m).padStart(2, '0'));
        hs.addEventListener('click', () => S.P.act({ faceMode: 'hour' }));
        ms.addEventListener('click', () => S.P.act({ faceMode: 'minute' }));
        S.ui.el.hourPart = hs;
        S.ui.el.minutePart = ms;
        const ap = util.el('div', 'fd-ampm vert', head);
        for (const a of ['AM', 'PM']) {
          const b = util.el('div', 'fd-ap' + (cur.ap === a ? ' on' : ''), ap, a);
          b.style.padding = '5px 12px';
          b.addEventListener('click', () => S.P.act({ ampm: a }));
          S.ui.el[a] = b;
        }
        const dial = util.el('div', 'fd-dial', S.pop);
        Object.assign(dial.style, { width: diameter + 'px', height: diameter + 'px', margin: '0 auto' });
        const R = diameter / 2 - 22;
        const vals = m.stage === 'hour' ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : Array.from({ length: 12 }, (_, i) => i * 5);
        const sel = m.stage === 'hour' ? cur.h : cur.m;
        const svg = util.svg('svg', { width: diameter, height: diameter }, dial);
        vals.forEach((v, i) => {
          const a = (i / 12) * 2 * Math.PI;
          const x = diameter / 2 + R * Math.sin(a);
          const y = diameter / 2 - R * Math.cos(a);
          const n = util.el('div', 'fd-num' + (v === sel ? ' on' : ''), dial, m.stage === 'hour' ? String(v) : String(v).padStart(2, '0'));
          n.dataset.role = m.stage;
          Object.assign(n.style, { left: x + 'px', top: y + 'px' });
          n.addEventListener('click', () => S.P.act({ face: m.stage, value: v }));
          S.ui.el.nums.set(v, n);
          if (v === sel) util.svg('line', { x1: diameter / 2, y1: diameter / 2, x2: x, y2: y, stroke: 'var(--accent)', 'stroke-width': 2 }, svg);
        });
        util.svg('circle', { cx: diameter / 2, cy: diameter / 2, r: 4, fill: 'var(--accent)' }, svg);
      });
    },

    buildSpin(S, ctx) {
      const { util } = ctx;
      const { row, help } = S.P.fieldRow(S.geo.body, S.spec.scene.label, ctx.rng.pick(['Use the arrows to change the time.', 'Click a number and use the arrow keys, or the buttons.']), util);
      S.control = util.el('div', 'fd-spin', row);
      S.control.dataset.role = 'field';
      const seg = (kind, range) => {
        const s = util.el('div', 'fd-seg', S.control);
        const up = util.el('div', 'fd-arr', s);
        up.innerHTML = S.D.up;
        const val = util.el('div', 'fd-val', s);
        val.tabIndex = 0;
        val.dataset.role = `${kind}-value`;
        val.addEventListener('focus', () => { if (S.ctxRef.model.focus !== kind) S.P.act({ spinField: kind }); });
        val.addEventListener('blur', () => {
          if (!val.isConnected) return;
          if (S.ctxRef.model.focus === kind) { S.ctxRef.update({ ...S.ctxRef.model, focus: '' }); }
        });
        const down = util.el('div', 'fd-arr', s);
        down.innerHTML = S.D.down;
        S.ui.spin[kind] = env.ui.spinner({ up, down, field: val, wrap: true, ...range, label: `time ${kind}`, keyboard: true,
          onStep: (dir) => S.P.act({ spin: kind, dir }) });
        S.ui.el[kind] = val;
        return val;
      };
      const hv = seg('hour', { min: 1, max: 12, step: 1 });
      util.el('div', 'fd-colon', S.control, ':');
      const mv = seg('minute', { min: 0, max: 60 - S.spec.step, step: S.spec.step });
      const ampm = util.el('div', 'fd-ampm' + (S.geo.vertAmpm ? ' vert' : ''), S.control);
      const aps = ['AM', 'PM'].map((a) => {
        const el = util.el('div', 'fd-ap', ampm, a);
        el.dataset.ampm = a;
        return el;
      });
      S.ui.ampm = env.ui.choices(aps.map((el) => [el.dataset.ampm, el]), {
        label: 'ampm',
        value: ctx.model.value >= 720 ? 'PM' : 'AM',
        onChange: (a) => S.P.act({ ampm: a }),
      });
      row.append(help);
      for (const ex of S.geo.extrasBelow) S.P.staticRow(S.geo.body, ex, util);
      S.card.style.width = S.geo.cardW + 'px';
      S.card.style.height = S.card.offsetHeight + 'px';
      S.paintFns.push((m) => {
        const h = Math.floor(m.value / 60) % 12 || 12;
        hv.textContent = S.geo.padHour ? String(h).padStart(2, '0') : String(h);
        mv.textContent = String(m.value % 60).padStart(2, '0');
        aps.forEach((el) => el.classList.toggle('on', el.dataset.ampm === (m.value >= 720 ? 'PM' : 'AM')));
        S.ui.spin.hour.set(h);
        S.ui.spin.minute.set(m.value % 60);
        S.ui.ampm.set(m.value >= 720 ? 'PM' : 'AM');
      });
    },

    buildDropdowns(S, ctx) {
      const { util } = ctx;
      const { row } = S.P.fieldRow(S.geo.body, S.spec.scene.label, null, util);
      S.control = util.el('div', 'fd-timeparts fd-time-dropdowns', row);
      S.control.dataset.role = 'field';
      S.ui.dropdowns = {};
      S.ui.el.triggers = {};
      for (const [kind, key, values] of [
        ['hour', 'h', Array.from({ length: 12 }, (_, i) => i + 1)],
        ['minute', 'm', Array.from({ length: 60 / S.spec.step }, (_, i) => i * S.spec.step)],
        ['ampm', 'ap', ['AM', 'PM']],
      ]) {
        const part = util.el('div', 'fd-dd-part', S.control);
        const trigger = util.el('button', 'fd-timepart', part);
        trigger.type = 'button';
        trigger.setAttribute('aria-label', `${S.spec.scene.label}: ${kind}`);
        trigger.setAttribute('aria-haspopup', 'listbox');
        S.ui.el.triggers[kind] = trigger;
        const menu = util.el('div', 'fd-dd-menu', part);
        menu.setAttribute('role', 'listbox');
        menu.hidden = true;
        const show = v => v === null ? '—' : kind === 'minute' ? String(v).padStart(2, '0') : String(v);
        const options = values.map(value => {
          const option = util.el('div', 'fd-opt', menu, show(value));
          option.dataset.role = 'option';
          option.setAttribute('role', 'option');
          return [value, option];
        });
        S.ui.cols[kind] = env.ui.choices(options, {
          label: `time ${kind}`, value: ctx.model[key],
          onChange: value => S.P.act({ col: kind, value }),
        });
        S.ui.dropdowns[kind] = env.ui.dropdown(trigger, menu, {
          label: `time ${kind}`, open: ctx.model.open === kind,
          onOpenChange: (open, reason) => S.P.act(reason === 'outside' ? { outside: true } : { dd: kind }),
        });
        S.paintFns.push(m => {
          trigger.textContent = show(m[key]);
          trigger.setAttribute('aria-expanded', String(m.open === kind));
          menu.hidden = m.open !== kind;
          S.ui.cols[kind].set(m[key]);
          for (const [value, option] of options) {
            option.classList.toggle('on', value === m[key]);
            option.setAttribute('aria-selected', String(value === m[key]));
          }
        });
      }
      for (const ex of S.geo.extrasBelow) S.P.staticRow(S.geo.body, ex, util);
      S.card.style.width = S.geo.cardW + 'px';
      S.card.style.height = S.card.offsetHeight + 'px';
    },

    timeReadout(S, txt, value, util, kind) {
      if (S.D.timeParts) {
        txt.replaceChildren();
        const p = value === null ? { h: '--', m: '--', ap: '--' } : S.fam.helpers.parts12(value);
        const [hour, colon, minute, ampm, wrapper] = S.D.timeParts;
        const parent = wrapper ? util.el('span', wrapper, txt) : txt;
        util.el('span', hour, parent, String(p.h));
        if (colon !== null) util.el('span', colon, parent, ':');
        util.el('span', minute, parent, String(p.m).padStart(2, '0'));
        util.el('span', ampm, parent, p.ap);
        return;
      }
      if (kind === 'clock') { txt.textContent = S.fam.helpers.fmt12(value); return; }
      txt.replaceChildren();
      util.el('span', value === null ? 'fd-ph' : '', txt, value === null ? '--:-- --' : S.fam.helpers.fmt12(value));
    }
  }));
})();
