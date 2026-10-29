/* use-shop/_common: shared formatting, controls, focus tracking and scrolling lists. */
(function () {
  'use strict';
  const F = () => env.taskDef.helpers;
  const hashStr = (s) => [...String(s)].reduce((h, c) => Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0, 2166136261);
  function where(el, what) {
    if (!el || !el.isConnected || el.closest('[hidden]')) throw new Error(`use-shop/store: ${what} is not shown`);
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) throw new Error(`use-shop/store: ${what} has no box`);
    return [r.left + r.width / 2, r.top + r.height / 2];
  }
  const money = (spec) => (c) => F().fmtMoney(c, spec.money);
  // Whole amounts without the trailing zero cents ("$129", "45 €").
  const whole = (spec) => (c) =>
    F()
      .fmtMoney(c, spec.money)
      .replace(/([.,])00(?!\d)/, '');
  const btn = (util, cls, parent, text, role) => {
    const b = util.el('button', cls, parent, text);
    b.type = 'button';
    if (role) b.dataset.role = role;
    return b;
  };

  // Mirror which text field has focus (model.focus), so the oracle only presses Enter in a focused field.
  function trackFocus(ctx, input, name) {
    input.addEventListener('focus', () => {
      if (ctx.model.focus !== name) ctx.update({ ...ctx.model, focus: name });
    });
    input.addEventListener('blur', () => {
      if (ctx.model.focus === name) ctx.update({ ...ctx.model, focus: null });
    });
  }

  // A fixed pane holding a natively scrolling list (wheel) and a custom scrollbar (env.ui.listbox).
  function listPane(ctx, pane, { keys, build, rows, pitch, gap, scroll, label }) {
    const { util } = ctx;
    pane.replaceChildren();
    const list = util.el('div', 'as-list', pane);
    list.dataset.role = 'list';
    list.style.height = rows * pitch - gap + 'px';
    const opts = keys.map((k, i) => {
      const r = build(k, i);
      r.style.height = pitch - gap + 'px';
      if (i) r.style.marginTop = gap + 'px';
      list.append(r);
      return [k, r];
    });
    const track = util.el('div', 'as-track' + (keys.length <= rows ? ' idle' : ''), pane);
    track.dataset.role = 'scrollbar';
    const thumb = util.el('div', 'as-thumb', track);
    thumb.dataset.role = 'thumb';
    const lbx = env.ui.listbox(list, {
      label,
      options: opts,
      onScroll(i) {
        const s = Math.round(i * 1000) / 1000;
        if (ctx.model.scroll !== s) ctx.update({ ...ctx.model, scroll: s });
      },
      scrollbar: { track, thumb, pad: 3, minThumb: 30, onDrag: (on) => thumb.classList.toggle('drag', on) },
    });
    lbx.set({ scroll: scroll || 0 });
    lbx.list = list;
    return lbx;
  }

  function pitchFor(pane, bottomEl, rows, gap, lo, hi, reserve = 0) {
    const top = pane.getBoundingClientRect().top;
    const bottom = bottomEl.getBoundingClientRect().bottom - 18 - reserve;
    return Math.max(lo, Math.min(hi, Math.floor((bottom - top - 2 + gap) / rows)));
  }
  // The oracle sizes wheel steps from model.pitch (px per row): mirror the pane's row pitch.
  function mirrorPitch(ctx, pitch) {
    if (ctx.model.pitch !== pitch) ctx.update({ ...ctx.model, pitch });
  }


  env.template('use-shop/_common', () => ({ F, hashStr, where, money, whole, btn, trackFocus, listPane, pitchFor, mirrorPitch }));
})();
