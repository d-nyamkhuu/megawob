/* use-data-grid/_input: grid input parts; S holds the live episode state and resolved design parts. */
(function () {
  'use strict';

  function mirrorScreenRows(S) {
    if (S.spec.scenario !== 'paginate' || !S.body.isConnected) return;
    const viewport = S.body;
    const box = viewport.getBoundingClientRect();
    const rows = [...S.body.querySelectorAll('.to-row')].filter(r => {
      const b = r.getBoundingClientRect(); return b.top >= box.top - 1 && b.bottom <= box.bottom + 1;
    }).map(r => r.dataset.id);
    if (JSON.stringify(rows) !== JSON.stringify(S.ctx.model.screenRows)) S.ctx.update({ ...S.ctx.model, screenRows: rows });
  }

  function act(S, m, redraw = true) {
    if (S.spec.judge && S.spec.judge.mode === 'confirm' && m.history.length > S.ctx.model.history.length) { S.ctx.flag('irreversible'); return; }
    S.ctx.update(m);
    if (redraw) S.P.draw(S.ctx.model);
    else S.P.drawLite(S.ctx.model);
  }

  function bindHeader(S, h, col) {
    const episodeCtx = S.ctx;
    h.addEventListener('focus', () => S.P.focusIs({ kind: 'header', col }));
    h.addEventListener('blur', () => S.P.focusIs(null, { kind: 'header', col }));
    h.addEventListener('keydown', (e) => {
      if (e.target !== h) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        S.P.act(S.fam.helpers.headerClick(S.ctx.model, S.spec, col));
      }
    });
    h.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const x0 = e.clientX;
      const y0 = e.clientY;
      let moved = false;
      let ghost = null;
      let line = null;
      const cardR = () => S.card.getBoundingClientRect();
      const slotAt = (x) => {
        const others = S.ctx.model.order.filter((c) => c !== col);
        let k = 0;
        for (const o of others) {
          const r = S.hcells[o].getBoundingClientRect();
          if (r.left + r.width / 2 < x) k++;
        }
        return { k, others };
      };
      const move = (ev) => {
        if (S.ctx !== episodeCtx) return;
        if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
        if (!moved) {
          moved = true;
          ghost = S.P.el('div', 'to-ghost', S.card, S.spec.cols.find((c) => c.id === col).label);
          line = S.P.el('div', 'to-dropline', S.card);
          h.style.opacity = '.45';
          S.ctx.log('grab', { what: 'column', col });
        }
        const cr = cardR();
        const hr = h.getBoundingClientRect();
        ghost.style.left = ev.clientX - cr.left + 8 + 'px';
        ghost.style.top = hr.top - cr.top + 4 + 'px';
        const { k, others } = slotAt(ev.clientX);
        let x;
        if (!others.length) x = hr.left;
        else if (k === 0) x = S.hcells[others[0]].getBoundingClientRect().left;
        else x = S.hcells[others[k - 1]].getBoundingClientRect().right;
        line.style.left = x - cr.left - 1 + 'px';
        line.style.top = hr.top - cr.top + 'px';
        line.style.height = Math.min(cr.bottom, S.grid.getBoundingClientRect().bottom) - hr.top + 'px';
      };
      const up = (ev) => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        if (S.ctx !== episodeCtx) return;
        h.style.opacity = '';
        if (ghost) ghost.remove();
        if (line) line.remove();
        if (moved) {
          const { k } = slotAt(ev.clientX);
          S.ctx.log('release', { what: 'column', col, k });
          S.P.act(S.fam.helpers.moveCol(S.ctx.model, col, k));
        } else {
          S.P.act(S.fam.helpers.headerClick(S.ctx.model, S.spec, col));
        }
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
  }

  function bindEdge(S, edge, col, keysOnly = false) {
    const episodeCtx = S.ctx;
    edge.addEventListener('focus', () => S.P.focusIs({ kind: 'edge', col }));
    edge.addEventListener('blur', () => S.P.focusIs(null, { kind: 'edge', col }));
    edge.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      e.stopPropagation();
      const d = (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 1 : 10);
      S.P.act(S.fam.helpers.nudgeWidth(S.ctx.model, col, d));
    });
    if (keysOnly) { edge.tabIndex = 0; return; }
    edge.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (e.button !== 0) return;
      const x0 = e.clientX;
      const w0 = S.ctx.model.widths[col];
      edge.classList.add('live');
      S.ctx.log('grab', { what: 'edge', col });
      const move = (ev) => {
        if (S.ctx === episodeCtx) S.P.act(S.fam.helpers.setWidth(S.ctx.model, col, w0 + (ev.clientX - x0) / S.scale), false);
      };
      const up = (ev) => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        if (S.ctx !== episodeCtx) return;
        edge.classList.remove('live');
        S.ctx.log('release', { what: 'edge', col });
        if (ev.clientX !== x0) S.P.act(S.fam.helpers.setWidth(S.ctx.model, col, w0 + (ev.clientX - x0) / S.scale), false);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
    edge.addEventListener('click', (e) => e.stopPropagation());
  }

  function focusIs(S, f, leaving) {
    const cur = S.ctx.model.focus;
    if (!f && !(cur && leaving && cur.kind === leaving.kind && cur.col === leaving.col)) return;
    if (JSON.stringify(cur) === JSON.stringify(f)) return;
    S.ctx.update(S.fam.helpers.setFocus(S.ctx.model, f));
    for (const [id, h] of Object.entries(S.hcells)) h.classList.toggle('focused', !!(f && f.kind === 'header' && f.col === id));
  }

  function cellField(S, cell, editing) {
    const episodeCtx = S.ctx;
    const inp = S.P.el('input', 'to-edit', cell);
    inp.type = 'text';
    inp.value = editing.draft;
    inp.setAttribute('aria-label', 'Edit cell');
    let done = false;
    const finish = (commit) => {
      if (done || S.ctx !== episodeCtx) return;
      done = true;
      S.P.act(commit ? S.fam.helpers.commitEdit(S.ctx.model, S.spec) : S.fam.helpers.cancelEdit(S.ctx.model));
    };
    inp.addEventListener('input', () => S.ctx.update(S.fam.helpers.setDraftCell(S.ctx.model, inp.value)));
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); finish(true); } else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
    });
    inp.addEventListener('blur', () => finish(true));
    S.editInput = inp;
    inp.focus();
    inp.select();
  }

  env.template('use-data-grid/_input', () => ({ mirrorScreenRows, act, bindHeader, bindEdge, focusIs, cellField }));
})();
