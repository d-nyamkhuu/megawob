/* solve-puzzle/_base-widgets: default base widget implementations. S is the live reference unit scope;
 * reference.js keeps every override hook and delegates here so replaced units remain visible to each caller. */
(function () {
  'use strict';
  function ensureStyle(S) {
    if (document.getElementById('pz-style')) return;
    const s = document.createElement('style');
    s.id = 'pz-style';
    s.textContent = S.CSS;
    document.head.append(s);
  }

  function numberField(S, ctx, parent, value, onInput, opts = {}) {
    const input = ctx.util.el('input', 'pz-in pz-num', parent);
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.inputMode = 'numeric';
    input.dataset.role = 'field';
    input.setAttribute('aria-label', 'Answer');
    if (S.st.look.placeholder) input.placeholder = '?';
    S.st.input = input;
    S.st.field = S.env.ui.textField(input, { value, accept: opts.accept || /[\d\-−]/, maxLength: opts.maxLength || 6, label: 'answer', onInput });
    return input;
  }

  function buildEquation(S, ctx, body) {
    const { spec, util, rng } = ctx;
    const stacked = rng.bool(0.45);
    const onInput = (v) => ctx.update({ ...ctx.model, answer: v });
    if (spec.scenario === 'arithmetic') {
      const eq = util.el('div', 'pz-eq' + (stacked ? ' stacked' : ''), body);
      S.html(util.el('div', 'pz-expr pz-num', eq), `${S.eqHtml(spec.expr)}${stacked ? '' : ' ='}`);
      if (stacked) {
        const wrap = util.el('div', 'pz-stack', eq);
        util.el('div', 'pz-label', wrap, 'Answer');
        S.numberField(ctx, wrap, ctx.model.answer, onInput);
      } else S.numberField(ctx, eq, ctx.model.answer, onInput);
    } else {
      const eq = util.el('div', 'pz-eq stacked', body);
      S.html(util.el('div', 'pz-expr pz-num', eq), S.eqHtml(spec.expr));
      const row = util.el('div', 'pz-xrow pz-num', eq);
      S.html(util.el('span', '', row), '<i>x</i> =');
      S.numberField(ctx, row, ctx.model.answer, onInput);
    }
    S.st.main = S.st.input;
    S.st.paint = () => {};
  }

  function buildOddEven(S, ctx, body) {
    const { spec, util, rng } = ctx;
    const layout = rng.pick(['sides', 'right']);
    const rows = util.el('div', spec.numbers.length > S.st.oeRows ? 'pz-oe-grid' : 'pz-rows', body);
    if (spec.numbers.length > S.st.oeRows) rows.style.width = 'max-content';
    S.st.rows = spec.numbers.map((n, i) => {
      const row = util.el('div', `pz-oe ${layout}`, rows);
      row.dataset.role = 'row';
      const odd = util.el('button', 'pz-btn', null, 'Odd');
      const even = util.el('button', 'pz-btn', null, 'Even');
      for (const b of [odd, even]) b.type = 'button';
      const val = util.el('div', 'pz-val pz-num', null, S.fmtNum(n));
      if (layout === 'sides') row.append(odd, val, even);
      else {
        const seg = util.el('div', 'pz-seg', null);
        seg.append(odd, even);
        row.append(val, seg);
      }
      return S.env.ui.choices({ odd, even }, {
        value: ctx.model.marks[i],
        label: `row${i}`,
        onChange(v) {
          const marks = ctx.model.marks.slice();
          marks[i] = v;
          ctx.update({ marks });
          S.st.paint(ctx.model);
        },
      });
    });
    S.st.main = rows;
    S.st.paint = (m) => {
      S.st.rows.forEach((r, i) => r.set(m.marks[i]));
      const k = m.marks.filter(Boolean).length;
      S.st.status.innerHTML = `<span><b>${k}</b> of ${m.marks.length} marked</span>`;
    };
  }

  function buildGuess(S, ctx, body) {
    const { spec, util } = ctx;
    const fam = S.env.taskDef.helpers;
    S.html(util.el('p', 'pz-lead', body), `I'm thinking of a whole number from <b>${spec.lo}</b> to <b>${spec.hi}</b>.`);
    const row = util.el('div', 'pz-grow', body);
    S.numberField(ctx, row, ctx.model.text, (v) => ctx.update({ ...ctx.model, text: v, note: null }));
    const btn = util.el('button', 'pz-btn primary', row, 'Guess');
    btn.type = 'button';
    const doGuess = () => {
      const m = fam.makeGuess({ ...ctx.model, text: S.st.field.get() }, spec);
      if (m === ctx.model) return;
      ctx.update(m);
      S.st.field.set(m.text);
      S.st.paint(m);
    };
    S.st.buttons = S.env.ui.buttons([btn], { keys: ['guess'], label: 'guess', disabled: () => fam.locked(ctx.model, spec), onClick: doGuess });
    S.st.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doGuess();
      }
    });
    S.st.input.addEventListener('focus', () => { if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true }); });
    S.st.input.addEventListener('blur', () => { if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false }); });
    // A partial start plants model.focus (the oracle presses Enter next): make it true on the page too.
    if (ctx.model.focus) S.st.input.focus({ preventScroll: true });
    S.st.msg = util.el('div', 'pz-msg', body);
    S.st.hist = util.el('div', 'pz-hist', body);
    S.st.guessBtn = btn;
    S.st.main = row;
    S.st.paint = (m) => {
      const last = m.guesses[m.guesses.length - 1];
      let cls = '';
      let text;
      if (m.note === 'invalid') {
        cls = 'bad';
        text = `Enter a whole number from ${spec.lo} to ${spec.hi}.`;
      } else if (!last) text = 'Make your first guess.';
      else if (last.verdict === 'correct') {
        cls = 'ok';
        text = `${S.CHECK}Correct! The number is ${S.fmtNum(last.value)}.`;
      } else if (last.verdict === 'higher') {
        cls = 'up';
        text = `${S.ARROW_UP}Higher than ${S.fmtNum(last.value)}`;
      } else {
        cls = 'down';
        text = `${S.ARROW_DOWN}Lower than ${S.fmtNum(last.value)}`;
      }
      if (last && last.verdict !== 'correct' && fam.left(m, spec) <= 0) {
        cls = 'bad';
        text = 'No guesses left.';
      }
      S.st.msg.className = `pz-msg ${cls}`;
      S.st.msg.innerHTML = text;
      S.st.hist.innerHTML = m.guesses.map((g) => {
        const arrow = g.verdict === 'higher' ? '↑' : g.verdict === 'lower' ? '↓' : '✓';
        return `<span class="pz-chip pz-num${g.verdict === 'correct' ? ' ok' : ''}">${S.fmtNum(g.value)} <small>${arrow}</small></span>`;
      }).join('');
      const left = fam.left(m, spec);
      S.st.status.innerHTML = `<span>Guesses left: <b>${left}</b> of ${spec.budget}</span><span class="pz-dots">${
        Array.from({ length: spec.budget }, (_, i) => `<i class="${i < spec.budget - left ? 'used' : ''}"></i>`).join('')}</span>`;
      S.st.guessBtn.classList.toggle('off', fam.locked(m, spec));
    };
  }

  function buildGenerate(S, ctx, body) {
    const { spec, util, rng } = ctx;
    const fam = S.env.taskDef.helpers;
    const box = util.el('div', 'pz-gen', body);
    S.st.display = util.el('div', 'pz-display pz-num' + (rng.bool(0.35) ? ' lcd' : ''), box);
    const btn = util.el('button', 'pz-btn primary', box, rng.pick(['Generate', 'Generate number', 'Roll']));
    btn.type = 'button';
    util.el('div', 'pz-cap', box, 'Each press shows a random number from 0 to 10.');
    S.st.buttons = S.env.ui.buttons([btn], {
      keys: ['generate'],
      label: 'generate',
      onClick() {
        const m = fam.generate(ctx.model, spec);
        ctx.update(m);
        S.st.paint(m);
      },
    });
    S.st.main = box;
    S.st.paint = (m) => {
      const none = m.value === null || m.value === undefined;
      S.st.display.textContent = none ? '–' : String(m.value);
      S.st.display.classList.toggle('empty', none);
      S.st.status.innerHTML = `<span>Generated <b>${m.presses}</b> time${m.presses === 1 ? '' : 's'}</span>`;
    };
  }

  function buildHotCold(S, ctx, body, avail) {
    const { spec, util, rng } = ctx;
    const fam = S.env.taskDef.helpers;
    const panelW = 200;
    const side = avail.width - panelW - 20 >= 360;
    let bw = Math.min(rng.int(560, 700), side ? avail.width - panelW - 20 : avail.width);
    const maxH = avail.height - (side ? 0 : 70);
    if ((bw * spec.H) / spec.W > maxH) bw = (maxH * spec.W) / spec.H;
    bw = Math.floor(bw);
    const bh = Math.floor((bw * spec.H) / spec.W);
    const wrap = util.el('div', 'pz-hc' + (side ? '' : ' below'), body);
    const board = util.el('div', 'pz-board' + (rng.bool(0.4) ? ' lines' : ''), wrap);
    board.dataset.role = 'board';
    board.style.width = `${bw}px`;
    board.style.height = `${bh}px`;
    board.style.setProperty('--pz-grid', `${Math.round(bw / rng.pick([10, 12, 16, 20]))}px`);
    const svg = util.svg('svg', { width: bw, height: bh, viewBox: `0 0 ${bw} ${bh}` }, board);
    const panel = util.el('div', 'pz-panel', wrap);
    S.st.temp = util.el('div', 'pz-temp', panel);
    S.st.trend = util.el('div', 'pz-trend none', panel);
    const legend = util.el('div', 'pz-legend', panel);
    for (const [band, label] of [['hot', 'HOT'], ['warm', 'WARM'], ['cold', 'COLD'], ['ice', 'ICE COLD']]) {
      util.el('i', '', legend).style.background = S.BAND_COLOR[band];
      util.el('span', '', legend, label);
    }
    const sx = bw / spec.W;
    const sy = bh / spec.H;
    const rect = () => board.getBoundingClientRect();
    S.st.board = S.env.ui.board(board, {
      toBoard: ([x, y]) => {
        const r = rect();
        return [((x - r.left) / r.width) * spec.W, ((y - r.top) / r.height) * spec.H];
      },
      fromBoard: ([u, v]) => {
        const r = rect();
        return [r.left + (u / spec.W) * r.width, r.top + (v / spec.H) * r.height];
      },
      bounds: { x0: 0, y0: 0, x1: spec.W, y1: spec.H },
      precision: 3,
      label: 'board',
      inside: () => !fam.locked(ctx.model, spec),
      onChange(p) {
        const m = fam.probe(ctx.model, spec, p);
        ctx.update(m);
        S.st.paint(m);
      },
    });
    S.st.main = board;
    S.st.paint = (m) => {
      const ps = m.probes;
      const parts = [];
      if (ps.length > 1) {
        parts.push(`<polyline points="${ps.map(([u, v]) => `${(u * sx).toFixed(1)},${(v * sy).toFixed(1)}`).join(' ')}" fill="none" ` +
          'stroke="color-mix(in srgb, var(--fg) 30%, transparent)" stroke-width="1.5" stroke-dasharray="4 4"/>');
      }
      ps.forEach(([u, v], i) => {
        const fb = fam.feedback(spec, ps, i);
        const x = (u * sx).toFixed(1);
        const y = (v * sy).toFixed(1);
        const lastOne = i === ps.length - 1;
        if (lastOne) parts.push(`<circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${S.BAND_COLOR[fb.band]}" stroke-width="2.5" opacity=".75"/>`);
        parts.push(`<circle cx="${x}" cy="${y}" r="${lastOne ? 9 : 7}" fill="${S.BAND_COLOR[fb.band]}" stroke="var(--panel)" stroke-width="2"/>`);
        if (ps.length <= 30) parts.push(`<text x="${x}" y="${(v * sy - 13).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--muted)">${i + 1}</text>`);
      });
      svg.innerHTML = parts.join('');
      const last = ps.length ? fam.feedback(spec, ps, ps.length - 1) : null;
      S.st.temp.className = 'pz-temp' + (last ? ` ${last.band}` : '');
      S.st.temp.textContent = last ? last.label : '—';
      if (!last) {
        S.st.trend.className = 'pz-trend none';
        S.st.trend.textContent = 'Click anywhere on the board to start.';
      } else if (!last.trend) {
        S.st.trend.className = 'pz-trend none';
        S.st.trend.textContent = 'First click. Try another spot.';
      } else if (last.trend === 'same') {
        S.st.trend.className = 'pz-trend none';
        S.st.trend.textContent = 'Same as your last click.';
      } else {
        S.st.trend.className = `pz-trend ${last.trend}`;
        S.st.trend.innerHTML = last.trend === 'warmer' ? `${S.ARROW_UP}Warmer than your last click` : `${S.ARROW_DOWN}Colder than your last click`;
      }
      S.st.status.innerHTML = `<span>Clicks left: <b>${fam.left(m, spec)}</b> of ${spec.budget}</span>`;
    };
  }

  function buildTictactoe(S, ctx, body, avail) {
    const { spec, util, rng } = ctx;
    const fam = S.env.taskDef.helpers;
    const lined = rng.bool(0.5);
    const cell = Math.max(64, Math.min(rng.int(92, 118), Math.floor((avail.height - 20) / 3)));
    const grid = util.el('div', 'pz-ttt' + (lined ? ' lined' : ''), body);
    grid.style.setProperty('--pz-cell', `${cell}px`);
    grid.style.setProperty('--pz-tgap', `${rng.pick([6, 8, 10])}px`);
    const cells = [];
    for (let i = 0; i < 9; i++) {
      const c = util.el('div', 'pz-cellb', grid);
      c.dataset.role = 'cell';
      c.dataset.cell = String(i);
      cells.push(c);
    }
    const strike = util.svg('svg', { class: 'pz-strike' }, grid);
    S.st.cells = S.env.ui.buttons(cells, {
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      label: 'cell',
      disabled: (k) => !!ctx.model.board[k] || !!ctx.model.result,
      onClick(k) {
        const m = fam.play(ctx.model, spec, k);
        if (m === ctx.model) return;
        ctx.update(m);
        S.st.paint(m);
      },
    });
    S.st.main = grid;
    S.st.paint = (m) => {
      cells.forEach((c, i) => {
        const v = m.board[i];
        if (c.dataset.mark !== v) {
          c.dataset.mark = v;
          c.innerHTML = v === 'X' ? S.MARK_X : v === 'O' ? S.MARK_O : '';
        }
        c.classList.toggle('taken', !!v || !!m.result);
      });
      const line = fam.winLine(m.board);
      if (line) {
        const g = grid.getBoundingClientRect();
        const ctr = (i) => {
          const r = cells[i].getBoundingClientRect();
          return [r.left - g.left + r.width / 2, r.top - g.top + r.height / 2];
        };
        const [a, b] = [ctr(line[0]), ctr(line[2])];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const len = Math.hypot(dx, dy) || 1;
        const ext = cell * 0.32;
        const p = [a[0] - (dx / len) * ext, a[1] - (dy / len) * ext];
        const q = [b[0] + (dx / len) * ext, b[1] + (dy / len) * ext];
        const color = m.board[line[0]] === 'X' ? '#2f9e44' : '#e03131';
        strike.innerHTML = `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${color}" stroke-width="7" stroke-linecap="round" opacity=".85"/>`;
      } else strike.innerHTML = '';
      const text = { win: 'You win!', draw: 'It\'s a draw.', loss: 'The computer wins.' }[m.result] ||
        (spec.oFirst && m.board.filter(Boolean).length === 1 ? 'The computer went first. Your move (X).' : 'Your move. You play X.');
      S.st.status.innerHTML = `<span class="pz-turn ${m.result || ''}"><i></i>${text}</span>`;
    };
  }

  function buildCompute(S, ctx, body, avail) {
    const { spec, util, rng } = ctx;
    const fam = S.env.taskDef.helpers;
    if (spec.mode === 'pick') {
      const n = spec.cards.length;
      const cw = S.st.squeeze ? 150 : 172;
      const cols = Math.max(2, Math.min(n, Math.floor((avail.width + 12) / (cw + 12)), n > 4 ? Math.ceil(n / 2) : n));
      const grid = util.el('div', 'pz-offers', body);
      grid.style.gridTemplateColumns = `repeat(${cols}, ${cw}px)`;
      const cards = [];
      const btns = spec.cards.map((c, i) => {
        const box = util.el('div', 'pz-offer', grid);
        box.dataset.role = 'card';
        util.el('b', '', box, c.name);
        util.el('div', 'price pz-num', box, `$${c.price.toFixed(2)}`);
        const meta = util.el('div', 'meta', box);
        util.el('span', '', meta, `★ ${c.rating.toFixed(1)}`);
        util.el('span', '', meta, c.days === 1 ? '1-day delivery' : `${c.days}-day delivery`);
        const b = util.el('button', 'pz-btn', box, rng.pick(['Select', 'Choose']));
        b.type = 'button';
        b.dataset.key = String(i);
        cards.push(box);
        return b;
      });
      S.st.buttons = S.env.ui.buttons(btns, {
        keys: spec.cards.map((_, i) => i),
        label: 'offer',
        onClick(k) {
          if (ctx.model.chosen === k) return;
          ctx.update({ chosen: k });
          S.st.paint(ctx.model);
        },
      });
      S.st.main = grid;
      S.st.paint = (m) => {
        cards.forEach((c, i) => c.classList.toggle('on', m.chosen === i));
        btns.forEach((b, i) => { b.textContent = m.chosen === i ? 'Selected' : b.dataset.label || (b.dataset.label = b.textContent); });
        S.st.status.innerHTML = m.chosen === null || m.chosen === undefined ? '<span>Nothing selected yet</span>' : `<span>Selected: <b>${spec.cards[m.chosen].name.replace(/[<&]/g, '')}</b></span>`;
      };
      return;
    }
    const below = avail.width < 640 || rng.bool(0.3);
    const wrap = util.el('div', 'pz-calc' + (below ? ' below' : ''), body);
    const tbl = util.el('table', 'pz-tbl', wrap);
    const rh = Math.max(24, Math.min(34, Math.floor((avail.height - 36 - (below ? 90 : 0)) / spec.rows.length)));
    tbl.style.setProperty('--pz-trh', `${rh}px`);
    if (rh < 28) tbl.style.setProperty('--pz-tfs', '13px');
    const tr0 = util.el('tr', '', util.el('thead', '', tbl));
    spec.cols.forEach((c, i) => util.el('th', i === spec.money || c === 'Qty' ? 'num' : '', tr0, c));
    const tb = util.el('tbody', '', tbl);
    for (const r of spec.rows) {
      const tr = util.el('tr', '', tb);
      r.forEach((v, i) => util.el('td', i === spec.money || spec.cols[i] === 'Qty' ? 'num pz-num' : '', tr, v));
    }
    if (!below) tbl.style.width = `${Math.min(avail.width - 210, 520)}px`;
    const side = util.el('div', 'pz-side', wrap);
    util.el('div', 'pz-label', side, spec.mode === 'count' ? rng.pick(['Count', 'Number of rows']) : rng.pick(['Total', 'Sum', 'Amount']));
    S.numberField(ctx, side, ctx.model.answer, (v) => ctx.update({ ...ctx.model, answer: v }), { accept: /[\d\-−.,$]/, maxLength: 12 });
    S.st.main = wrap;
    S.st.paint = () => {
      S.st.status.innerHTML = `<span>${spec.rows.length} rows</span>`;
    };
    void fam;
  }

  function buildFixError(S, ctx, body, avail) {
    const { spec, util, rng } = ctx;
    const fam = S.env.taskDef.helpers;
    const banner = util.el('div', 'pz-banner', body);
    const n = spec.fields.length;
    const colW = S.st.squeeze ? 230 : 250;
    const twoCols = n > (S.st.squeeze ? 4 : 5) && avail.width >= 2 * colW + 22;
    const form = util.el('div', 'pz-form', body);
    form.style.gridTemplateColumns = twoCols ? `repeat(2, ${colW}px)` : `${Math.min(340, avail.width)}px`;
    if (S.st.squeeze) form.style.gap = '0 18px';
    const flds = spec.fields.map((f, i) => {
      const box = util.el('div', 'pz-fld', form);
      const lab = util.el('label', '', box, f.label);
      const inp = util.el('input', 'pz-in', box);
      inp.type = 'text';
      inp.id = `pz-ff${i}`;
      lab.htmlFor = inp.id;
      inp.autocomplete = 'off';
      inp.spellcheck = false;
      inp.dataset.role = 'field';
      const err = util.el('div', 'pz-err', box);
      const api = S.env.ui.textField(inp, {
        value: ctx.model.values[i],
        label: `field${i}`,
        onInput(v) {
          const values = ctx.model.values.slice();
          values[i] = v;
          ctx.update({ values });
          S.st.paint(ctx.model);
        },
      });
      return { box, inp, err, api };
    });
    S.st.fields = flds;
    S.st.main = form;
    const genericMsg = (f) => ({ email: 'Enter a valid email address.', zip: 'ZIP code must be 5 digits.', phone: 'Enter a 10-digit phone number.',
      qty: `Quantity must be between ${f.min} and ${f.max}.`, confirm: 'Email addresses do not match.', date: 'Use the format MM/DD/YYYY.',
      required: `${f.label} is required.`, url: 'Enter a full URL starting with https://', text: 'Invalid value.' }[f.kind]);
    S.st.paint = (m) => {
      let bad = 0;
      flds.forEach((x, i) => {
        const ok = fam.fieldValid(spec, i, m.values);
        if (!ok) bad++;
        x.box.classList.toggle('bad', !ok);
        x.err.textContent = ok ? '' : (i === spec.bad && m.values[i] === spec.fields[i].value ? spec.fields[i].msg : genericMsg(spec.fields[i]));
      });
      banner.className = 'pz-banner' + (bad ? '' : ' ok');
      banner.textContent = bad ? (bad === 1 ? rng.pick(['We could not save your changes. Please fix the highlighted field.']) : `Please fix the ${bad} highlighted fields.`) : 'All fields look good.';
      S.st.status.innerHTML = `<span>${n} fields</span><span>${bad ? `${bad} with errors` : 'no errors'}</span>`;
    };
  }

  function usable(S, ctx) {
    const box = { x: 0, y: 0, w: ctx.size.width, h: ctx.size.height };
    const sr = ctx.stage.getBoundingClientRect();
    const sub = S.env.submitEl && S.env.submitEl.getBoundingClientRect();
    if (sub && sub.width && sub.left < sr.right && sub.right > sr.left && sub.top < sr.bottom && sub.bottom > sr.top) {
      const cutH = sr.bottom - sub.top + 10;
      const cutW = sr.right - sub.left + 10;
      if (cutH * box.w <= cutW * box.h) box.h -= cutH;
      else box.w -= cutW;
    }
    return box;
  }

  function build(S, ctx, box, squeeze) {
    const { spec, util, stage } = ctx;
    const rng = ctx.rng.fork('look'); // the same draws on every pass
    const meta = S.META[spec.scenario];
    const look = {
      band: rng.bool(0.55),
      font: rng.pick(['sans', 'sans', 'mono', 'serif']),
      r: rng.pick([8, 10, 12, 16]),
      pad: squeeze ? 14 : rng.int(18, 28),
      title: rng.pick(meta.titles),
      sub: squeeze > 1 ? '' : rng.pick(meta.subs),
      placeholder: rng.bool(0.5),
      fs: rng.int(34, 46) - 6 * squeeze,
      fh: rng.int(46, 56) - 6 * squeeze,
      fw: rng.int(120, 170),
      rh: rng.int(42, 50) - 5 * squeeze,
      gap: rng.int(8, 14) - 3 * squeeze,
      dw: rng.int(140, 180) - 20 * squeeze,
      width: rng.int(400, 500),
      align: [rng.pick(['start', 'center', 'center', 'end']), rng.pick(['start', 'center', 'center', 'end'])],
      jitter: [rng.float(-1, 1), rng.float(-1, 1)],
    };
    stage.replaceChildren();
    S.st = { look, squeeze, oeRows: Math.max(3, Math.floor((box.h - 140) / (look.rh + look.gap))) };
    const card = util.el('section', `pz-card ${look.band ? 'band' : 'ruled'}`, stage);
    card.dataset.role = 'puzzle';
    card.style.position = 'absolute';
    card.style.maxWidth = `${box.w - 8}px`;
    const vars = {
      '--pz-r': `${look.r}px`, '--pz-pad': `${look.pad}px`, '--pz-font': S.FONTS[look.font], '--pz-fs': `${look.fs}px`,
      '--pz-fh': `${look.fh}px`, '--pz-fw': `${look.fw}px`, '--pz-rh': `${look.rh}px`, '--pz-gap': `${look.gap}px`,
      '--pz-dw': `${look.dw}px`,
    };
    for (const [k, v] of Object.entries(vars)) card.style.setProperty(k, v);
    const head = util.el('div', 'pz-head', card);
    if (squeeze) head.style.padding = '9px 16px';
    S.html(util.el('div', 'pz-badge', head), S.ICONS[meta.icon]);
    const tt = util.el('div', '', head);
    util.el('div', 'pz-title', tt, look.title);
    if (look.sub) util.el('div', 'pz-sub', tt, look.sub);
    const body = util.el('div', 'pz-body', card);
    const foot = util.el('div', 'pz-foot', card);
    S.st.status = util.el('div', 'pz-status', foot);
    S.st.status.style.display = 'contents';

    // Room for the body: the usable box minus the card's head, foot and padding.
    const avail = { width: box.w - 2 * look.pad - 12 - 16, height: box.h - (squeeze ? 46 : 64) - 40 - 2 * look.pad - 12 };
    const wide = spec.scenario === 'hot-cold' || spec.scenario === 'tictactoe' || spec.scenario === 'compute' || spec.scenario === 'fix-error'
      || (spec.scenario === 'odd-even' && spec.numbers.length > S.st.oeRows);
    if (!wide) card.style.width = `${Math.min(look.width, box.w - 8)}px`;
    S.BUILD[spec.scenario](ctx, body, avail);
    if (spec.scenario === 'tictactoe') card.style.minWidth = `${Math.min(look.width, box.w - 8)}px`;
    if (spec.scenario === 'arithmetic' || spec.scenario === 'algebra') {
      util.el('span', '', foot, rng.pick(['Type your answer in the box.', 'Negative answers start with a minus sign.', 'Whole numbers only.']));
    }
    S.st.paint(ctx.model);
    return card;
  }

  function render(S, ctx) {
      S.ensureStyle();
      const { spec } = ctx;
      const box = S.usable(ctx);
      let card;
      for (const squeeze of [0, 1, 2]) {
        card = S.build(ctx, box, squeeze);
        const r = card.getBoundingClientRect();
        if (r.width <= box.w - 4 && r.height <= box.h - 4 && card.scrollWidth <= card.clientWidth + 1 && card.scrollHeight <= card.clientHeight + 1) break;
      }
      // Freeze the card's size so later content changes never move the scored controls, then place it.
      const r = card.getBoundingClientRect();
      const w = Math.ceil(r.width);
      const h = Math.ceil(Math.min(r.height, box.h - 4));
      card.style.width = `${w}px`;
      card.style.height = `${h}px`;
      const { align, jitter } = S.st.look;
      const place = (a, room, size, j) => {
        const free = Math.max(0, room - size - 8);
        const base = a === 'start' ? 4 : a === 'end' ? free + 4 : free / 2 + 4;
        return Math.round(Math.max(4, Math.min(free + 4, base + j * Math.min(free / 4, 60))));
      };
      card.style.left = `${box.x + place(align[0], box.w, w, jitter[0])}px`;
      card.style.top = `${box.y + place(align[1], box.h, h, jitter[1])}px`;
      return {
        anchors: [card, S.st.main],
        sync(m) {
          if (S.st.field) S.st.field.set(spec.scenario === 'guess' ? m.text : m.answer);
          if (S.st.fields) S.st.fields.forEach((f, i) => f.api.set(m.values[i]));
          S.st.paint(m);
        },
      };
    }

  function locate(S, t) {
      if (t.field !== undefined && S.st.field) return S.st.field.locate();
      if (t.ffield !== undefined && S.st.fields) return S.st.fields[t.ffield].api.locate();
      if (t.button !== undefined && S.st.buttons) return S.st.buttons.locate(t.button);
      if (t.card !== undefined && S.st.buttons) return S.st.buttons.locate(t.card);
      if (t.mark && S.st.rows) return S.st.rows[t.mark[0]].locate(t.mark[1]);
      if (t.cell !== undefined && S.st.cells) return S.st.cells.locate(t.cell);
      if (t.point && S.st.board) return S.st.board.locate(t.point);
      throw new Error(`solve-puzzle/puzzle cannot locate ${JSON.stringify(t)}`);
    }

    env.template('solve-puzzle/_base-widgets', () => ({
      ensureStyle, numberField, buildEquation, buildOddEven, buildGuess, buildGenerate, buildHotCold, buildTictactoe, buildCompute, buildFixError, usable, build, render, locate,
    }));
  })();
