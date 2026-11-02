/* recall-info/_classic-count: classic's count parts and view builder; part names stay in classic. */
(function () {
  'use strict';

  function parts(S, shared) {
    const { el, titleLine } = shared;
    const BASE = {};
    // count: a virtual lazy-loading count table.
    const countHeading = (ctx, work) => titleLine(ctx, work, 'Scroll to load more');

    BASE.list = (ctx, work) => {
      const { spec } = ctx;
      const cols = el('div', 'ur-colhead ur-grid', work);
      spec.cols.forEach((c) => el('span', '', cols, c));
      const wrap = el('div', 'ur-panewrap', work);
      const pane = el('div', 'ur-pane', wrap);
      pane.dataset.role = 'list';
      const inner = el('div', 'ur-inner', pane);
      const track = el('div', 'ur-track', wrap);
      const thumb = el('div', 'ur-thumb', track);
      const endRow = el('div', 'ur-end', inner);
      return { pane, inner, track, thumb, endRow };
    };

    BASE.answer = (ctx, work) => {
      const { spec } = ctx;
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
      return { input, btn, readout };
    };

    const countRow = (ctx, inner, i) => {
      const { spec } = ctx;
      const r = el('div', `ur-row ur-grid${i % 2 ? ' odd' : ''}`, inner);
      r.style.top = `${i * S.D.rowHeight}px`;
      spec.rows[i].forEach((c, k) => el('span', k === 0 ? 'n' : '', r, c));
      S.P.decorated(ctx, r, ctx.spec.rows[i]);
      return r;
    };

    BASE.readout = (ctx, readout, m) => {
      readout.innerHTML = '';
      if (m.committed) {
        readout.append('Answer on file: ');
        el('b', '', readout, String(m.saved));
      } else readout.append('Nothing sent yet');
    };

    return { parts: BASE, countHeading, countRow };
  }

  function build(S, shared) {
    const { el, center, actions, fitPanels } = shared;
    return (ctx, work, app) => {
      const { spec } = ctx;
      const rowH = S.D.rowHeight;
      const footH = S.D.footerHeight;
      const T = spec.T;
      app.style.setProperty('--ur-cols', S.D.columns[spec.dataset]);
      const subEl = S.P.heading(ctx, work);
      const { pane, inner, track, thumb, endRow } = S.P.list(ctx, work);
      const { input, btn, readout } = S.P.answer(ctx, work);
      const apply = actions(ctx, paint);
      const tf = env.ui.textField(input, { value: ctx.model.entered, accept: /\d/, maxLength: 4, label: 'count', onInput: (v) => apply({ type: v }) });
      btn.addEventListener('click', () => apply({ commit: true }));

      let loaded = Math.min(T, spec.batch);
      const live = new Map();
      const totalH = () => loaded * rowH + footH;
      const makeRow = (i) => S.P.row(ctx, inner, i);
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
        S.P.readout(ctx, readout, m);
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
    };
  }

  env.template('recall-info/_classic-count', () => ({ parts, build }));
})();
