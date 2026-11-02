/* find-fact/_base-chart: reference builders. S is the live reference unit scope;
 * the wrappers in reference.js retain every design override and its original call order.
 * B holds one render's local state, shared by its setup, painting and interaction functions. */
(function () {
  'use strict';

  function buildChart(S, ctx, work, up, room) {
    const { spec, util, rng } = ctx;
    const { card: cc, body } = S.card(util, work, spec.title, spec.unit);
    cc.classList.add('rl-chart');
    body.style.position = 'relative';
    const W = Math.round(Math.min(room.w - 30, rng.int(560, 760)));
    const H = Math.round(Math.max(170, Math.min(room.h - 44 - 64 - 26, rng.int(280, 360))));
    const pad = { l: 46, r: 14, t: 18, b: spec.cats.length > 8 ? 46 : 30 };
    const svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, body);
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;
    const y = (v) => pad.t + ph * (1 - v / spec.max);
    const half = spec.values.some((v) => v % spec.step !== 0);
    const ticks = spec.max / spec.step;
    for (let k = 0; k <= ticks; k++) {
      const v = k * spec.step;
      util.svg('line', { class: 'grid', x1: pad.l, x2: W - pad.r, y1: y(v), y2: y(v) }, svg);
      const tx = util.svg('text', { x: pad.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, svg);
      tx.textContent = String(v);
      if (half && k < ticks) util.svg('line', { class: 'grid minor', x1: pad.l, x2: W - pad.r, y1: y(v + spec.step / 2), y2: y(v + spec.step / 2) }, svg);
    }
    util.svg('line', { class: 'axis', x1: pad.l, x2: W - pad.r, y1: y(0), y2: y(0) }, svg);
    util.svg('line', { class: 'axis', x1: pad.l, x2: pad.l, y1: pad.t, y2: y(0) }, svg);
    const n = spec.cats.length;
    const bw = pw / n;
    const cx = (i) => pad.l + bw * (i + 0.5);
    const marks = [];
    const hits = [];
    if (spec.kind === 'line') {
      util.svg('polyline', { class: 'line', points: spec.values.map((v, i) => `${cx(i)},${y(v)}`).join(' ') }, svg);
    }
    spec.values.forEach((v, i) => {
      const hit = util.svg('rect', { class: 'hit', x: pad.l + bw * i, y: pad.t, width: bw, height: ph }, svg);
      hit.dataset.role = 'bar';
      hit.dataset.key = String(i);
      const mk = spec.kind === 'bar'
        ? util.svg('rect', { class: 'bar', x: cx(i) - bw * 0.3, y: y(v), width: bw * 0.6, height: y(0) - y(v), rx: 2 }, svg)
        : util.svg('circle', { class: 'pt', cx: cx(i), cy: y(v), r: 5 }, svg);
      mk.style.pointerEvents = 'none';
      marks.push(mk);
      hits.push(hit);
      const lx = util.svg('text', { x: cx(i), y: H - pad.b + 16, 'text-anchor': n > 8 ? 'end' : 'middle' }, svg);
      lx.textContent = spec.cats[i];
      if (n > 8) lx.setAttribute('transform', `rotate(-30 ${cx(i)} ${H - pad.b + 16})`);
      if (spec.labels) {
        const vl = util.svg('text', { class: 'val', x: cx(i), y: y(v) - 7, 'text-anchor': 'middle' }, svg);
        vl.textContent = String(v);
      }
    });
    const tip = util.el('div', 'rl-tip', body);
    tip.style.visibility = 'hidden';
    hits.forEach((hit, i) => {
      hit.addEventListener('pointerenter', () => {
        marks.forEach((mk, k) => mk.classList.toggle('hov', k === i));
        tip.textContent = `${spec.cats[i]}: ${spec.values[i]} ${spec.unit}`;
        tip.style.visibility = 'visible';
        const br = body.getBoundingClientRect();
        const r = marks[i].getBoundingClientRect();
        tip.style.left = Math.round(Math.min(r.left - br.left + r.width / 2 - 40, W - 120)) + 'px';
        tip.style.top = Math.round(Math.max(0, r.top - br.top - 34)) + 'px';
        S.env.log('hover', { what: 'bar', key: i });
        if (ctx.model.hover !== i) up({ hover: i });
      });
      hit.addEventListener('pointerleave', () => {
        marks[i].classList.remove('hov');
        tip.style.visibility = 'hidden';
      });
    });
    const foot = util.el('div', 'rl-gfoot', body);
    foot.style.borderTop = '0';
    util.el('span', 'rl-count', foot, spec.labels ? 'Values shown on the chart.' : spec.mode === 'hover' ? rng.pick(['Hover over a bar for its value.', 'Point at the chart for details.']) : rng.pick(['Source: internal reports', 'Updated weekly', '']));
    const ans = util.el('div', 'rl-ans', foot);
    const al = util.el('label', '', ans, rng.pick(['Answer', 'Your answer', 'Reading']));
    const ainp = S.input(util, ans, 'field', rng.pick(['Type the answer', '', 'Answer']));
    ainp.id = 'rl-cans';
    al.htmlFor = ainp.id;
    const field = S.env.ui.textField(ainp, { value: ctx.model.answers[0], label: 'answer0', onInput: (v) => up({ answers: [v] }) });
    const fields = [field];
    return {
      sync(m) { fields[0].set(m.answers[0]); },
      locate(tg) {
        if (tg.field === 0) return fields[0].locate();
        if (tg.bar !== undefined) {
          const r = marks[tg.bar].getBoundingClientRect();
          return [r.left + r.width / 2, r.top + r.height / 2];
        }
        return null;
      },
    };
  }

  env.template('find-fact/_base-chart', () => ({ buildChart }));
})();
