/* choose-option/_base-lists: base widget implementations.
 * reference.js retains their part hooks; scopeRef reads the live, overridable reference scope.
 */
(function () {
  'use strict';

  function buildListbox(scopeRef, field, ctx) {
    const { util, spec, rng } = ctx;
    const rowH = rng.int(30, 34);
    const n = spec.options.length;
    const H = spec.rows * rowH;
    const lb = util.el('div', 'fp-lb', field);
    lb.style.height = H + 2 + 'px';
    const list = util.el('div', 'fp-list', lb);
    list.dataset.role = 'listbox';
    list.style.height = H + 'px';
    const rows = {};
    for (const o of spec.options) {
      const r = util.el('div', 'fp-row' + (spec.multi ? '' : ' single'), list);
      r.dataset.role = 'option';
      Object.assign(r.style, { height: rowH + 'px', boxSizing: 'border-box' });
      if (spec.multi) util.el('span', 'fp-box', r).innerHTML = scopeRef.BOXTICK;
      util.el('span', '', r, o);
      rows[o] = r;
    }
    rows[spec.options[n - 1]].style.borderBottom = '0';
    const track = util.el('div', 'fp-track', lb);
    track.dataset.role = 'scrollbar';
    const thumb = util.el('div', 'fp-thumb', track);
    thumb.dataset.role = 'thumb';
    const status = util.el('div', 'fp-status', field);
    const mirror = (i) => {
      const s = Math.round(i * 1000) / 1000;
      if (s !== scopeRef.st.ctx.model.scroll) scopeRef.set({ scroll: s });
    };
    const lbx = scopeRef.env.ui.listbox(list, {
      label: 'listbox',
      multi: spec.multi,
      values: ctx.model.values,
      options: spec.options.map((o) => [o, rows[o]]),
      onChange(values) { scopeRef.set({ values }); show(); },
      onScroll: mirror,
      scrollbar: { track, thumb, pad: 2, minThumb: 28, onDrag: (on) => thumb.classList.toggle('dragging', on) },
    });
    scopeRef.wheelPane(list, () => { lbx.refresh(); mirror(lbx.scrollIndex()); });
    function show() {
      const m = scopeRef.st.ctx.model;
      lbx.set({ values: m.values });
      for (const o of spec.options) rows[o].classList.toggle('sel', m.values.includes(o));
      status.replaceChildren();
      if (!m.values.length) status.textContent = 'Nothing selected';
      else {
        status.append(spec.multi ? `Selected (${m.values.length}): ` : 'Selected: ');
        util.el('b', '', status, m.values.join(', '));
      }
    }
    lbx.set({ scroll: ctx.model.scroll || 0 });
    scopeRef.st.layout = () => {
      const px = rows[spec.options[1]].offsetTop - rows[spec.options[0]].offsetTop;
      if (px > 0 && px !== scopeRef.st.ctx.model.px) scopeRef.set({ px });
    };
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => {
      if (t.option !== undefined) return lbx.locateOption(t.option);
      if (t.thumb !== undefined) return lbx.locateThumb();
      if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
      if (t.list !== undefined) return scopeRef.center(list);
      return null;
    };
  }

  function buildGrouped(scopeRef, field, ctx) {
    const { util, spec, rng } = ctx;
    const fam = scopeRef.env.taskDef.helpers;
    const lay = { row: rng.int(30, 34), head: rng.int(26, 30), pad: 4, view: 0 };
    lay.view = spec.rows * lay.row;
    const badge = rng.pick(['Unavailable', 'Sold out', 'Full', 'Closed']);
    const box = util.el('div', 'fp-dd', field);
    box.style.position = 'relative';
    const trigger = util.el('div', 'fp-ctl fp-trigger', box);
    trigger.dataset.role = 'trigger';
    const val = util.el('span', 'fp-val', trigger);
    trigger.insertAdjacentHTML('beforeend', scopeRef.CHEV);
    const pop = util.el('div', 'fp-pop fp-gpop', box);
    pop.style.top = 'calc(100% + 4px)';
    pop.dataset.role = 'listbox';
    const list = util.el('div', 'fp-glist', pop);
    list.style.height = lay.view + 'px';
    const inner = util.el('div', '', list);
    inner.style.padding = `${lay.pad}px 4px`;
    const rows = new Map();
    for (const g of spec.groups) {
      const h = util.el('div', 'fp-ghead', inner, g.name);
      h.style.height = lay.head + 'px';
      for (const o of g.options) {
        const off = spec.disabled.includes(o);
        const r = util.el('div', 'fp-opt' + (off ? ' off' : ''), inner);
        r.dataset.role = 'option';
        r.style.height = lay.row + 'px';
        r.innerHTML = scopeRef.TICK;
        util.el('span', '', r, o);
        if (off) {
          util.el('span', 'fp-badge', r, badge);
          r.setAttribute('aria-disabled', 'true');
        } else r.addEventListener('click', () => { scopeRef.set({ value: o, open: false }); show(); });
        rows.set(o, r);
      }
    }
    const track = util.el('div', 'fp-track', pop);
    track.dataset.role = 'scrollbar';
    track.style.height = lay.view + 'px';
    const thumb = util.el('div', 'fp-thumb', track);
    thumb.dataset.role = 'thumb';
    const total = () => fam.listHeight(spec, lay);
    const maxTop = () => Math.max(0, total() - lay.view);
    const thumbLen = () => Math.max(28, Math.round(((lay.view - 4) * lay.view) / total()));
    const usable = () => lay.view - 4 - thumbLen();
    function placeThumb() {
      const t = maxTop() ? list.scrollTop / maxTop() : 0;
      thumb.style.height = thumbLen() + 'px';
      thumb.style.top = Math.round(2 + t * usable()) + 'px';
    }
    function scrollTo(px) {
      list.scrollTop = util.clamp(Math.round(px), 0, maxTop());
      placeThumb();
      if (list.scrollTop !== scopeRef.st.ctx.model.top) scopeRef.set({ top: list.scrollTop });
    }
    scopeRef.wheelPane(list, () => scrollTo(list.scrollTop));
    thumb.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      thumb.setPointerCapture(e.pointerId);
      thumb.classList.add('dragging');
      const y0 = e.clientY;
      const s0 = list.scrollTop;
      const move = (ev) => scrollTo(s0 + ((ev.clientY - y0) / Math.max(1, usable())) * maxTop());
      const up = () => {
        thumb.classList.remove('dragging');
        thumb.removeEventListener('pointermove', move);
        thumb.removeEventListener('pointerup', up);
        thumb.removeEventListener('pointercancel', up);
      };
      thumb.addEventListener('pointermove', move);
      thumb.addEventListener('pointerup', up);
      thumb.addEventListener('pointercancel', up);
    });
    track.addEventListener('pointerdown', (e) => {
      if (e.target !== track || e.button !== 0) return;
      const tr = thumb.getBoundingClientRect();
      scrollTo(list.scrollTop + (e.clientY < tr.top ? -1 : 1) * (lay.view - lay.row));
    });
    trigger.addEventListener('click', () => {
      const open = !scopeRef.st.ctx.model.open;
      scopeRef.set(open ? { open, top: 0 } : { open });
      show();
    });
    scopeRef.st.outside = (e) => {
      if (scopeRef.st.ctx.model.open && !box.contains(e.target)) { scopeRef.set({ open: false }); show(); }
    };
    scopeRef.st.alive = () => box.isConnected;
    let wasOpen = null;
    function show() {
      const m = scopeRef.st.ctx.model;
      val.textContent = m.value || spec.placeholder;
      val.classList.toggle('empty', !m.value);
      trigger.classList.toggle('open', !!m.open);
      pop.hidden = !m.open;
      for (const [o, r] of rows) r.classList.toggle('sel', o === m.value);
      if (m.open && (wasOpen !== true || list.scrollTop !== (m.top || 0))) {
        list.scrollTop = m.top || 0;
        placeThumb();
      }
      wasOpen = !!m.open;
    }
    scopeRef.st.layout = () => {
      // Mirror the popup geometry (px) the plan computes with.
      scopeRef.set({ lay: { ...lay } });
    };
    scopeRef.st.show = show;
    scopeRef.st.loc = (t) => {
      if (t.open !== undefined) return scopeRef.req(trigger, 'trigger');
      if (t.option !== undefined) return scopeRef.req(rows.get(t.option), `option ${t.option}`);
      if (t.list !== undefined) return scopeRef.req(list, 'list');
      if (t.thumb !== undefined) return scopeRef.req(thumb, 'thumb');
      if (t.scrollTop !== undefined) {
        const tr = track.getBoundingClientRect();
        const th = thumb.getBoundingClientRect();
        const f = maxTop() ? t.scrollTop / maxTop() : 0;
        return [th.left + th.width / 2, tr.top + 2 + thumbLen() / 2 + f * usable()];
      }
      return null;
    };
  }

  env.template('choose-option/_base-lists', () => ({ buildListbox, buildGrouped }));
})();
