// set-date/_base-time: popup time columns, independent dropdowns and clock dial.
// S is the reference unit scope: mutable state stays live across paints and event callbacks.
// The reference units delegate here so their design overrides and helper hooks still apply.
(function () {
  'use strict';

  function buildTimeColumns(ctx, S) {
    const { fieldRow, clickControl, ICON_CLOCK, staticRow, placePop, popRoom, fitCard, sizePop, env, act } = S;
    const { util, size } = ctx;
    const { row } = fieldRow(S.geo.body, S.spec.scene.label, null, util);
    S.control = clickControl(row, ICON_CLOCK, util);
    const txt = util.el('span', 'fd-txt', S.control);
    for (const ex of S.geo.extrasBelow) staticRow(S.geo.body, ex, util);
    placePop(util);
    const hours = S.geo.hour12First ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const mins = Array.from({ length: 60 / S.spec.step }, (_, i) => i * S.spec.step);
    S.geo.row = Math.max(20, Math.min(S.geo.row, Math.floor((popRoom(size) - 24 - 24) / 12)));
    const popW = 24 + 3 * 64 + 2 * 12;
    const popH = 24 + 24 + 12 * S.geo.row;
    S.pop.style.setProperty('--row', S.geo.row + 'px');
    S.card.style.width = Math.min(size.width - 32, Math.max(S.geo.cardW, popW + S.control.offsetLeft * 2)) + 'px';
    fitCard(sizePop(popW, popH), util);
    const P = S.fam.helpers.parts12;

    S.paintFns.push((m) => {
      S.control.classList.toggle('open', !!m.open);
      txt.replaceChildren();
      util.el('span', m.value === null ? 'fd-ph' : '', txt, m.value === null ? '--:-- --' : S.fam.helpers.fmt12(m.value));
      S.pop.hidden = !m.open;
      if (!m.open) return;
      S.pop.replaceChildren();
      const cur = m.value === null ? null : P(m.value);
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
          onChange: (v) => act({ col: kind, value: v }),
        });
      };
      column('Hour', 'hour', hours, (v) => (S.geo.padHour ? String(v).padStart(2, '0') : String(v)), (v) => cur && cur.h === v);
      column('Min', 'minute', mins, (v) => String(v).padStart(2, '0'), (v) => cur && cur.m === v);
      column('', 'ampm', ['AM', 'PM'], String, (v) => cur && cur.ap === v);
    });
  }

  function buildTimeDropdowns(ctx, S) {
    const { fieldRow, DOWN, env, act, staticRow, fitCard } = S;
    const { util, size } = ctx;
    const { row } = fieldRow(S.geo.body, S.spec.scene.label, null, util);
    const strip = util.el('div', 'fd-ddrow', row);
    const hours = S.geo.hour12First ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const mins = Array.from({ length: 60 / S.spec.step }, (_, i) => i * S.spec.step);
    const kinds = [
      { kind: 'hour', f: 'h', ph: 'Hour', values: hours, show: (v) => (S.geo.padHour ? String(v).padStart(2, '0') : String(v)), cols: 3 },
      { kind: 'minute', f: 'm', ph: 'Min', values: mins, show: (v) => String(v).padStart(2, '0'), cols: 3 },
      { kind: 'ampm', f: 'ap', ph: 'AM/PM', values: ['AM', 'PM'], show: String, cols: 1 },
    ];
    const rowH = Math.max(22, Math.min(S.geo.row, 28));
    for (const k of kinds) {
      k.trig = util.el('div', 'fd-control', strip);
      k.trig.dataset.role = `${k.kind}-select`;
      k.txt = util.el('span', 'fd-txt', k.trig);
      k.trig.insertAdjacentHTML('beforeend', DOWN);
      k.pop = util.el('div', 'fd-pop fd-ddpop', S.card);
      k.pop.dataset.role = 'picker';
      k.pop.hidden = true;
      k.pop.style.setProperty('--ddcols', k.cols);
      k.pop.style.gridAutoRows = rowH + 'px';
      k.dd = env.ui.dropdown(k.trig, k.pop, {
        label: `time ${k.kind}`,
        open: ctx.model.open === k.kind,
        show: () => {}, // paint() owns the popup's visibility and contents
        onOpenChange: (open, reason) => {
          if (reason === 'select') return;
          act(reason === 'outside' ? { outside: true } : { dd: k.kind });
        },
        onChange: (v) => act({ col: k.kind, value: v }),
      });
      S.ui.ddk[k.kind] = k.dd;
    }
    for (const ex of S.geo.extrasBelow) staticRow(S.geo.body, ex, util);
    S.card.style.width = Math.max(S.geo.cardW, 3 * 104 + 2 * 10 + 48) + 'px';
    let bottom = 0;
    for (const k of kinds) {
      const w = k.cols * 52 + 14;
      const h = Math.ceil(k.values.length / k.cols) * (rowH + 2) + 12;
      Object.assign(k.pop.style, { left: Math.min(k.trig.offsetLeft, S.card.offsetWidth - w - 8) + 'px', top: k.trig.offsetTop + k.trig.offsetHeight + 4 + 'px', width: w + 'px', height: h + 'px' });
      bottom = Math.max(bottom, k.trig.offsetTop + k.trig.offsetHeight + 4 + h + 18);
    }
    fitCard(Math.min(bottom, size.height - 24), util);

    S.paintFns.push((m) => {
      for (const k of kinds) {
        const cur = m[k.f];
        k.txt.replaceChildren();
        util.el('span', cur === null ? 'fd-ph' : '', k.txt, cur === null ? k.ph : k.show(cur));
        const open = m.open === k.kind;
        k.trig.classList.toggle('open', open);
        k.pop.hidden = !open;
        k.dd.clear();
        k.pop.replaceChildren();
        if (!open) { k.dd.set({ open: false }); continue; }
        const map = new Map();
        for (const v of k.values) {
          const o = util.el('div', 'fd-opt' + (cur === v ? ' on' : ''), k.pop, k.show(v));
          o.dataset.role = 'option';
          map.set(v, o);
        }
        k.dd.options(map);
        k.dd.set({ open: true, value: cur });
      }
    });
  }

  function buildClock(ctx, S) {
    const { fieldRow, clickControl, ICON_CLOCK, staticRow, placePop, popRoom, fitCard, sizePop, act } = S;
    const { util, size } = ctx;
    const { row } = fieldRow(S.geo.body, S.spec.scene.label, null, util);
    S.control = clickControl(row, ICON_CLOCK, util);
    const txt = util.el('span', 'fd-txt', S.control);
    for (const ex of S.geo.extrasBelow) staticRow(S.geo.body, ex, util);
    placePop(util);
    const D = Math.max(170, Math.min(230, popRoom(size) - 24 - 54));
    const popW = Math.max(D + 24, 250);
    const popH = 24 + 54 + D;
    S.card.style.width = Math.min(size.width - 32, Math.max(S.geo.cardW, popW + S.control.offsetLeft * 2)) + 'px';
    fitCard(sizePop(popW, popH), util);
    const P = S.fam.helpers.parts12;
    S.paintFns.push((m) => {
      S.control.classList.toggle('open', !!m.open);
      txt.textContent = S.fam.helpers.fmt12(m.value);
      S.pop.hidden = !m.open;
      if (!m.open) return;
      S.pop.replaceChildren();
      S.ui.el = { nums: new Map() };
      const cur = P(m.value);
      const head = util.el('div', 'fd-chead', S.pop);
      const read = util.el('div', 'fd-cread', head);
      const hs = util.el('span', m.stage === 'hour' ? 'on' : '', read, String(cur.h).padStart(2, '0'));
      read.append(':');
      const ms = util.el('span', m.stage === 'minute' ? 'on' : '', read, String(cur.m).padStart(2, '0'));
      hs.addEventListener('click', () => act({ faceMode: 'hour' }));
      ms.addEventListener('click', () => act({ faceMode: 'minute' }));
      S.ui.el.hourPart = hs;
      S.ui.el.minutePart = ms;
      const ap = util.el('div', 'fd-ampm vert', head);
      for (const a of ['AM', 'PM']) {
        const b = util.el('div', 'fd-ap' + (cur.ap === a ? ' on' : ''), ap, a);
        b.style.padding = '5px 12px';
        b.addEventListener('click', () => act({ ampm: a }));
        S.ui.el[a] = b;
      }
      const dial = util.el('div', 'fd-dial', S.pop);
      Object.assign(dial.style, { width: D + 'px', height: D + 'px', margin: '0 auto' });
      const R = D / 2 - 22;
      const vals = m.stage === 'hour' ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : Array.from({ length: 12 }, (_, i) => i * 5);
      const sel = m.stage === 'hour' ? cur.h : cur.m;
      const svg = util.svg('svg', { width: D, height: D }, dial);
      vals.forEach((v, i) => {
        const a = (i / 12) * 2 * Math.PI;
        const x = D / 2 + R * Math.sin(a);
        const y = D / 2 - R * Math.cos(a);
        const n = util.el('div', 'fd-num' + (v === sel ? ' on' : ''), dial, m.stage === 'hour' ? String(v) : String(v).padStart(2, '0'));
        n.dataset.role = m.stage;
        Object.assign(n.style, { left: x + 'px', top: y + 'px' });
        n.addEventListener('click', () => act({ face: m.stage, value: v }));
        S.ui.el.nums.set(v, n);
        if (v === sel) util.svg('line', { x1: D / 2, y1: D / 2, x2: x, y2: y, stroke: 'var(--accent)', 'stroke-width': 2 }, svg);
      });
      util.svg('circle', { cx: D / 2, cy: D / 2, r: 4, fill: 'var(--accent)' }, svg);
    });
  }

  env.template('set-date/_base-time', () => ({ buildTimeColumns, buildTimeDropdowns, buildClock }));
})();
