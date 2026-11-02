/* use-desktop-tools/_base-calendar: day grid and event form.
 * build(ctx, main, frame?, scope) owns one render's state; scope supplies the base template's
 * overridable units. Named setup, painting and input helpers keep their original statement order.
 */
(function () {
  'use strict';
  function paintEvent(state, m) {
    const e = m.event;
    state.mine.hidden = !e;
    if (e) {
      state.place(state.mine, e);
      state.mine.classList.toggle('draft', !e.saved);
      state.mine.replaceChildren();
      state.util.el('b', '', state.mine, e.name || (e.saved ? '(no title)' : 'New event'));
      if (e.dur > 1) state.util.el('span', '', state.mine, state.label(e));
      state.when.textContent = `${state.label(e)} · ${e.dur * 30} min`;
    }
  }

  function paint(state, m) {
    state.paintEvent(m);
    state.form.hidden = !m.form && !state.spec.selectors;
    state.hint.hidden = m.form || !!state.spec.selectors;
    if (state.spec.selectors) {
      const e = m.form && m.event && !m.event.saved ? m.event : null;
      state.sels.start.btn.textContent = e ? state.tl(e.start) : 'Select';
      state.sels.dur.btn.textContent = e ? state.fam.durLabel(e.dur) : 'Select';
      for (const id of ['start', 'dur']) {
        const was = state.sels[id].list.hidden;
        state.sels[id].list.hidden = m.dd !== id;
        const on = e && state.sels[id].items[id === 'start' ? e.start : e.dur];
        if (was && !state.sels[id].list.hidden && on) state.sels[id].list.scrollTop = on.offsetTop - (state.sels[id].list.clientHeight - on.offsetHeight) / 2;
        for (const [v, b] of Object.entries(state.sels[id].items)) b.toggleAttribute('data-on', !!e && Number(v) === (id === 'start' ? e.start : e.dur));
      }
    }
    if (m.form && state.field.get() !== (m.event ? m.event.name : '')) state.field.set(m.event ? m.event.name : '');
    state.agenda.replaceChildren();
    const items = state.spec.events.map((e) => ({ ...e })).concat(m.event && m.event.saved ? [{ ...m.event, name: m.event.name || '(no title)' }] : []);
    items.sort((a, b) => a.start - b.start);
    for (const e of items) {
      const d = state.util.el('div', '', state.agenda);
      state.util.el('span', '', d, state.tl(e.start));
      state.util.el('span', '', d, e.name);
    }
    state.S.scrollTo(m.view.top);
  }

  function buildGrid(state) {
    ({ util: state.util, spec: state.spec } = state.ctx);
    state.fam = state.env.taskDef.helpers;
    state.N = state.fam.SLOTS;
    state.tl = (i) => state.fam.timeLabel(i, state.spec.h24);
    state.cal = state.util.el('div', 'at-cal', state.main);
    state.head = state.util.el('div', 'at-cal-h', state.cal);
    state.util.el('span', 'today', state.head, 'Today');
    state.util.el('span', 'nav', state.head).innerHTML = state.svg('<path d="M10 3.5L5.5 8 10 12.5"/>', 16);
    state.util.el('span', 'nav', state.head).innerHTML = state.svg('<path d="M6 3.5L10.5 8 6 12.5"/>', 16);
    state.util.el('h3', '', state.head, state.spec.day);
    state.util.el('span', 'chip', state.head, 'Day');
    state.wrap = state.util.el('div', 'at-cal-wrap', state.cal);
    state.side = state.util.el('aside', 'at-side', state.main);
    state.side.style.width = `${Math.round(state.clamp(state.main.getBoundingClientRect().width * 0.32, 210, 290))}px`;
    state.avail = Math.floor(state.wrap.getBoundingClientRect().height) - 2;
    state.R = state.spec.range || null;
    state.rowH = state.R ? Math.max(12, Math.min(34, Math.floor(state.avail / (state.R[1] - state.R[0])))) : Math.max(20, Math.min(34, Math.floor(state.avail / 16)));
    state.rows = state.R ? state.R[1] - state.R[0] : Math.floor(state.avail / state.rowH);
    state.fr = state.util.el('div', 'at-cal-frame', state.wrap);
    state.sc = state.util.el('div', 'at-cal-scroll', state.fr);
    state.sc.style.height = `${state.rows * state.rowH}px`;
    state.sc.dataset.role = 'day';
    if (state.R) state.sc.style.overflowY = 'hidden';
    state.grid = state.util.el('div', 'at-cal-grid', state.sc);
    state.grid.style.height = `${state.N * state.rowH}px`;
    state.gut = state.util.el('div', 'at-gut', state.grid);
    state.col = state.util.el('div', 'at-col', state.grid);
    state.col.dataset.role = 'timeslots';
    for (let i = 0; i < state.N; i++) {
      const l = state.util.el('div', 'at-hh' + (i % 2 ? ' half' : ''), state.col);
      l.style.top = `${i * state.rowH}px`;
      if (i % 2 === 0) {
        const s = state.util.el('span', '', state.gut, state.spec.h24 ? state.tl(i) : state.tl(i).toUpperCase());
        s.style.top = `${i * state.rowH}px`;
      }
    }
    state.label = (e) => `${state.tl(e.start)} – ${state.tl(e.start + e.dur)}`;
    state.place = (el, e) => {
      el.style.top = `${e.start * state.rowH + 2}px`;
      el.style.height = `${e.dur * state.rowH - 4}px`;
    };
    for (const e of state.spec.events) {
      const el = state.util.el('div', `at-ev t${e.tone}`, state.col);
      state.place(el, e);
      state.util.el('b', '', el, e.name);
      if (e.dur > 1 && state.rowH * e.dur > 34) state.util.el('span', '', el, state.label(e));
    }
    state.mine = state.util.el('div', 'at-ev user', state.col);
    state.mine.hidden = true;
    state.S = undefined;
    if (state.R) {
      state.sc.scrollTop = state.R[0] * state.rowH;
      state.S = {
        slider: null,
        scrollTo() {},
        report() {
          const v = state.ctx.model.view;
          if (v.top === state.R[0] && v.bottom === state.R[1] && v.px === state.rowH) return;
          state.ctx.update({ ...state.ctx.model, view: { top: state.R[0], bottom: state.R[1], px: state.rowH } });
        },
      };
    } else state.S = state.scrollGrid(state.ctx, state.fr, state.sc, state.rows, state.rowH, state.N);
    if (!state.spec.selectors) state.util.el('h4', '', state.side, 'Agenda');
    state.agenda = state.util.el('div', 'at-agenda', state.side);
    if (state.spec.selectors) state.agenda.hidden = true;
    state.hint = state.util.el('div', 'at-hint', state.side, 'Drag across the time slots to add an event. Scroll the day to see more hours.');
    state.form = state.util.el('div', 'at-form', state.side);
    state.util.el('h4', '', state.form, 'New event');
    state.name = state.util.el('input', '', state.form);
    state.name.type = 'text';
    state.name.placeholder = 'Event name';
    state.sels = {};
  }

  function buildForm(state) {
    if (state.spec.selectors) {
      const opts = {
        start: Array.from({ length: state.R ? state.R[1] - state.R[0] : state.N }, (_, i) => (state.R ? state.R[0] : 0) + i).map((i) => [i, state.tl(i)]),
        dur: state.fam.CAL_DURS.map((n) => [n, state.fam.durLabel(n)]),
      };
      const selRow = state.util.el('div', 'at-selrow', state.form);
      for (const [id, text] of [['start', 'Start time'], ['dur', 'Duration']]) {
        const g = state.util.el('div', 'at-sel', selRow, text);
        const btn = state.util.el('button', 'at-selbtn', g, '');
        btn.type = 'button';
        const list = state.util.el('div', 'at-sellist', g);
        list.hidden = true;
        const items = {};
        for (const [v, label] of opts[id]) {
          const b = state.util.el('button', '', list, label);
          b.type = 'button';
          items[v] = b;
          b.addEventListener('click', () => state.commit(state.fam.calendarSelect(state.ctx.model, id, v)));
        }
        btn.addEventListener('click', () => state.commit(state.fam.calendarDd(state.ctx.model, id)));
        state.sels[id] = { btn, list, items };
      }
      state.main.addEventListener('pointerdown', (e) => {
        const m = state.ctx.model;
        if (m.dd && !state.sels[m.dd].list.contains(e.target) && !state.sels[m.dd].btn.contains(e.target)) state.commit({ ...m, dd: null });
      });
    }
    state.when = state.util.el('div', 'when', state.form);
    state.row = state.util.el('div', 'row', state.form);
    state.cancel = state.util.el('button', 'at-btn', state.row, 'Cancel');
    state.cancel.type = 'button';
    state.create = state.util.el('button', 'at-btn pri', state.row, 'Create');
    state.create.type = 'button';
    state.field = state.env.ui.textField(state.name, {
      value: '',
      label: 'event-name',
      onInput: (v) => {
        const m = state.ctx.model;
        if (!m.event || m.event.name === v) return;
        state.ctx.update({ ...m, event: { ...m.event, name: v } });
        state.paintEvent(state.ctx.model);
      },
    });
    state.commit = (m) => { const prev = state.ctx.model; state.ctx.update(m); state.guard(state.ctx, prev, m); state.paint(state.ctx.model); };
    state.name.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      state.commit(state.fam.calendarCreate(state.ctx.model));
    });
    state.create.addEventListener('click', () => state.commit(state.fam.calendarCreate(state.ctx.model)));
    state.cancel.addEventListener('click', () => state.commit(state.fam.calendarCancel(state.ctx.model)));
    state.slotAt = (y) => Math.max(0, Math.min(state.N - 1, Math.floor((y - state.col.getBoundingClientRect().top) / state.rowH)));
    state.anchor = null;
    state.env.ui.track(state.col, {
      start(p) {
        state.anchor = state.slotAt(p.y);
        state.commit(state.fam.calendarDrag(state.ctx.model, state.anchor, state.anchor));
      },
      move(p) {
        if (state.anchor === null) return;
        const b = state.slotAt(p.y);
        const e = state.ctx.model.event;
        if (e && !e.saved && e.start === Math.min(state.anchor, b) && e.dur === Math.abs(b - state.anchor) + 1) return;
        state.ctx.update(state.fam.calendarDrag(state.ctx.model, state.anchor, b));
        state.paintEvent(state.ctx.model);
      },
      end() {
        if (state.anchor === null) return;
        state.anchor = null;
        state.commit({ ...state.ctx.model, form: true });
        state.name.focus({ preventScroll: true });
      },
    }, 'timeslots');
    state.paint(state.ctx.model);
    state.S.report();
  }

  function handlers(state) {
    return {
      sync(m) {
        state.paint(m);
        state.S.report();
      },
      locate(t) {
        if (t.thumb) return state.S.slider.locateThumb(0);
        if (t.scroll !== undefined) return state.S.slider.locate(t.scroll);
        if (t.pane) {
          const r = state.sc.getBoundingClientRect();
          return [r.left + r.width * 0.6, r.top + r.height / 2];
        }
        if (t.slot !== undefined) {
          const c = state.col.getBoundingClientRect();
          const s = state.sc.getBoundingClientRect();
          const y = c.top + (t.slot + 0.5) * state.rowH;
          if (y < s.top + 2 || y > s.bottom - 2) return null;
          for (const u of [0.62, 0.8, 0.45, 0.9]) if (state.freeAt(state.col, c.left + c.width * u, y)) return [c.left + c.width * u, y];
          return [c.left + c.width * 0.62, y];
        }
        if (t.field === 'name') {
          const p = state.field.locate();
          return p && p[0] + p[1] > 0 ? p : null;
        }
        if (t.form) return state.hitPoint(t.form === 'create' ? state.create : state.cancel);
        if (t.select) return state.sels[t.select] ? state.hitPoint(state.sels[t.select].btn) : null;
        if (t.option) {
          const [id, v] = t.option;
          const c = state.sels[id];
          if (!c || c.list.hidden) return null;
          const b = c.items[v];
          if (!b) return null;
          // Scroll the open list so the option is inside it (a user would wheel the list).
          const lr = c.list.getBoundingClientRect();
          const br = b.getBoundingClientRect();
          if (br.top < lr.top || br.bottom > lr.bottom) c.list.scrollTop += br.top - lr.top - (lr.height - br.height) / 2;
          return state.hitPoint(b);
        }
        return null;
      },
    };
  }

  function build(ctx, main, scope) {
    const state = {
      ctx, main, env: scope.env, svg: scope.svg, clamp: scope.clamp,
      scrollGrid: scope.scrollGrid, guard: scope.guard, freeAt: scope.freeAt,
      hitPoint: scope.hitPoint,
    };
    state.paintEvent = (m) => paintEvent(state, m);
    state.paint = (m) => paint(state, m);
    buildGrid(state);
    buildForm(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_base-calendar', () => ({ build }));
})();
