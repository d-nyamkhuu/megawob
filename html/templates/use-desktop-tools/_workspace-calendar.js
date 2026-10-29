/* use-desktop-tools/_workspace-calendar: day grid and event form.
 * install(S, BASE) installs the existing design parts and returns the builder; S keeps the live
 * tokens and resolved parts. Each build owns its rendering, painting and input state.
 */
(function () {
  'use strict';
  function install(S, BASE) {
    installScroll(S, BASE);
    installTimePicker(S, BASE);
    installGridParts(S, BASE);
    installFormParts(S, BASE);
    function buildCalendar(ctx, main) {
      return build(ctx, main, S);
    }
    return buildCalendar;
  }

  function installScroll(S, BASE) {
    BASE.scrollGrid = (ctx, fr, sc, rows, rowH, N) => {
      const sb = ctx.util.el('div', 'at-sb', fr);
      const thumb = ctx.util.el('i', '', sb);
      const thumbH = Math.max(28, Math.round((rows * rowH * rows) / N));
      thumb.style.height = `${thumbH}px`;
      const maxTop = N - rows;
      const slider = env.ui.slider(sb, {
        thumbs: [thumb],
        min: 0,
        max: maxTop,
        step: 1,
        values: [0],
        orientation: 'vertical-reverse',
        inset: thumbH / 2,
        label: 'scrollbar',
        place(el, p) {
          const r = sb.getBoundingClientRect();
          el.style.top = `${(p[1] - r.top - thumbH / 2).toFixed(2)}px`;
        },
        onInput: (vals) => {
          sc.scrollTop = vals[0] * rowH;
          report();
        },
      });
      function report() {
        const top = Math.round((sc.scrollTop / rowH) * 1000) / 1000;
        slider.set([top]);
        const v = ctx.model.view;
        if (v.top === top && v.bottom === top + rows && v.px === rowH) return;
        ctx.update({ ...ctx.model, view: { top, bottom: top + rows, px: rowH } });
      }
      sc.addEventListener('scroll', report);
      const scrollTo = (top) => {
        const want = Math.max(0, Math.min(maxTop, top));
        if (Math.abs(sc.scrollTop / rowH - want) > 1e-3) sc.scrollTop = want * rowH;
      };
      const G = { slider, report, scrollTo, maxTop, sb, sc, rowH, rows, N };
      S.P.scrollExtra(G, ctx);
      return G;
    };
    BASE.scrollExtra = () => {};
  }

  function installTimePicker(S, BASE) {
    S.timePicker = (C, opts = {}) => {
      const { util, ctx, fam, N, tl, form } = C;
      const p = { sel: { start: 24, dur: 1 } };
      p.dateLabel = util.el('label', 'calendar-label', form, 'Date');
      p.dateReadout = util.el('div', 'calendar-readout', form, C.spec.day);
      p.timeFields = util.el('div', 'calendar-time-fields', form);
      p.startLabel = util.el('label', 'calendar-label', p.timeFields, 'Start');
      p.startButton = util.el('button', 'calendar-readout', p.startLabel, '12:00 PM');
      p.startButton.type = 'button';
      if (opts.end) {
        p.endLabel = util.el('label', 'calendar-label', p.timeFields, 'End');
        p.endReadout = util.el('div', 'calendar-readout end', p.endLabel, '12:30 PM');
      }
      p.endText = (st, d) => {
        const i = st + d;
        return i >= N ? '12:00 AM' : tl(i);
      };
      p.durationLabel = util.el('label', 'calendar-label', opts.durationIn === 'form' ? form : p.timeFields, 'Duration');
      p.durationButton = util.el('button', 'calendar-readout', p.durationLabel, '30 minutes');
      p.durationButton.type = 'button';
      if (opts.between) opts.between(p);
      const timePop = p.timePop = util.el('div', 'calendar-picker', form);
      timePop.hidden = true;
      function timeMenu(kind) {
        timePop.replaceChildren();
        const choices = kind === 'start' ? Array.from({ length: N }, (_, i) => i) : [1, 2, 3, 4, 6, 8];
        for (const value of choices) {
          const option = util.el('button', '', timePop, kind === 'start' ? tl(value) : `${value * 30} minutes`);
          option.type = 'button';
          option.addEventListener('click', () => {
            if (kind === 'start') p.sel.start = value;
            else p.sel.dur = value;
            p.sel.start = Math.min(p.sel.start, N - p.sel.dur);
            const old = ctx.model.event;
            let m = fam.calendarDrag(ctx.model, p.sel.start, p.sel.start + p.sel.dur - 1);
            m = { ...m, form: true, event: { ...m.event, name: old ? old.name : '' } };
            ctx.update(m);
            timePop.hidden = true;
            C.paint(m);
          });
        }
        timePop.hidden = false;
      }
      p.startButton.addEventListener('click', () => timeMenu('start'));
      p.durationButton.addEventListener('click', () => timeMenu('duration'));
      p.sync = (e) => {
        p.startButton.textContent = tl(e.start);
        p.durationButton.textContent = `${e.dur * 30} minutes`;
        if (p.endReadout) p.endReadout.textContent = p.endText(e.start, e.dur);
        p.sel.start = e.start;
        p.sel.dur = e.dur;
      };
      return p;
    };
  }

  function installGridParts(S, BASE) {
    BASE.calTimeLabel = (C, i) => {
      if (!S.D.calTime12) return C.fam.timeLabel(i, C.spec.h24);
      const hour = Math.floor(i / 2) % 24;
      return `${hour % 12 || 12}:${i % 2 ? '30' : '00'} ${hour < 12 ? 'AM' : 'PM'}`;
    };
    BASE.calStart = () => {};
    BASE.calBeforeCal = () => {};
    BASE.calHead = (C) => {
      const { util, spec } = C;
      if (S.D.calToday) util.el('span', 'today', C.head, 'Today');
      const prev = util.el('span', 'nav', C.head);
      if (S.D.calNavText) prev.textContent = '<';
      else prev.innerHTML = S.svg('<path d="M10 3.5L5.5 8 10 12.5"/>', 16);
      const next = util.el('span', 'nav', C.head);
      if (S.D.calNavText) next.textContent = '>';
      else next.innerHTML = S.svg('<path d="M6 3.5L10.5 8 6 12.5"/>', 16);
      util.el('h3', '', C.head, spec.day);
      util.el('span', 'chip', C.head, 'Day');
    };
    BASE.calSideBuilt = () => {};
    BASE.calRows = (C, avail) => {
      const rowH = S.D.calRowCount === null ? Math.max(20, Math.min(34, Math.floor(avail / 16))) : avail / S.D.calRowCount;
      return { rowH, rows: Math.floor(avail / rowH) };
    };
    BASE.calGridBuilt = () => {};
    BASE.calLine = (C, i) => {
      const { util, spec } = C;
      const l = util.el('div', 'at-hh' + (i % 2 ? ' half' : ''), C.col);
      l.style.top = `${i * C.rowH}px`;
      if (i % 2 === 0) {
        const s = util.el('span', '', C.gut, spec.h24 ? C.tl(i) : C.tl(i).toUpperCase());
        s.style.top = `${i * C.rowH}px`;
      }
    };
    BASE.calPlace = (C, el, e) => {
      el.style.top = `${e.start * C.rowH + 2}px`;
      el.style.height = `${e.dur * C.rowH - 4}px`;
    };
    BASE.calEvent = (C, e) => {
      const { util } = C;
      const el = util.el('div', `at-ev t${e.tone}`, C.col);
      C.place(el, e);
      util.el('b', '', el, e.name);
      if (e.dur > 1 && C.rowH * e.dur > 34) util.el('span', '', el, C.label(e));
    };
    BASE.calFormPre = () => {};
    BASE.calFormFields = () => {};
  }

  function installFormParts(S, BASE) {
    BASE.calSide = (C) => {
      const { util, side } = C;
      let panel = side;
      if (S.D.calEventPanel) {
        panel = util.el('section', 'at-new', side);
        util.el('h4', '', panel, 'Create New Event');
      } else {
        util.el('h4', '', side, 'Agenda').hidden = S.D.agendaHidden;
        C.agenda = util.el('div', 'at-agenda', side);
        C.agenda.hidden = S.D.agendaHidden;
      }
      C.hint = util.el('div', 'at-hint', panel, S.D.calEventPanel
        ? 'Drag across the time slots to choose a start time and duration, then enter an event title. Scroll the day to see more hours.'
        : 'Drag across the time slots to add an event. Scroll the day to see more hours.');
      C.form = util.el('div', 'at-form', panel);
      if (S.D.calEventPanel) {
        util.el('h4', '', side, 'Event Details');
        C.agenda = util.el('div', 'at-agenda', side);
        util.el('label', 'at-lbl', C.form, 'Title:');
      } else util.el('h4', '', C.form, S.D.formTitle);
      S.P.calFormPre(C);
      const name = C.name = util.el('input', '', C.form);
      name.type = 'text';
      name.placeholder = S.D.namePlaceholder === null ? (S.D.calEventPanel ? 'Event name' : '') : S.D.namePlaceholder;
      S.P.calFormFields(C);
      C.when = util.el('div', 'when', C.form);
      C.row = util.el('div', 'row', C.form);
      C.cancel = util.el('button', 'at-btn', C.row, S.D.cancelLabel);
      C.cancel.type = 'button';
      C.create = util.el('button', 'at-btn pri', C.row, S.D.createLabel);
      C.create.type = 'button';
    };
    BASE.calFormBuilt = () => {};
    BASE.calNameInput = (C, v) => {
      const m = C.ctx.model;
      if (!m.event || m.event.name === v) return;
      C.ctx.update({ ...m, event: { ...m.event, name: v } });
      C.paintEvent(C.ctx.model);
    };
    BASE.calActions = (C) => {
      const { fam, ctx, commit } = C;
      C.name.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        commit(fam.calendarCreate(ctx.model));
      });
      C.create.addEventListener('click', () => commit(fam.calendarCreate(ctx.model)));
      C.cancel.addEventListener('click', () => commit(fam.calendarCancel(ctx.model)));
    };
    BASE.calEventPainted = () => {};
    BASE.calPaintEvent = (C, m) => {
      const { util } = C;
      const e = m.event;
      C.mine.hidden = !e;
      if (e) {
        C.place(C.mine, e);
        C.mine.classList.toggle('draft', !e.saved);
        C.mine.replaceChildren();
        util.el('b', '', C.mine, e.name || (e.saved ? '(no title)' : 'New event'));
        if (e.dur > 1) util.el('span', '', C.mine, C.label(e));
        if (C.when) C.when.textContent = `${C.label(e)} · ${e.dur * 30} min`;
      }
      S.P.calEventPainted(C, m, e);
    };
    BASE.calPaintForm = (C, m) => {
      const inline = S.D.formAlways && !S.D.calEventPanel;
      C.form.hidden = inline ? false : !m.form;
      C.hint.hidden = inline ? true : m.form;
      if (m.form && C.field.get() !== (m.event ? m.event.name : '')) C.field.set(m.event ? m.event.name : '');
    };
    BASE.calPaintAgenda = (C, m) => {
      const { util, spec } = C;
      C.agenda.replaceChildren();
      const items = S.D.calSelectedAgenda
        ? (m.event ? [{ ...m.event, name: m.event.name || 'New event' }] : [])
        : spec.events.map((e) => ({ ...e })).concat(m.event && m.event.saved ? [{ ...m.event, name: m.event.name || '(no title)' }] : []);
      if (S.D.calSelectedAgenda && !m.event) {
        util.el('strong', 'at-empty-title', C.agenda, 'No event selected.');
        util.el('p', 'at-empty-copy', C.agenda, 'Choose a time on the calendar or create a new event.');
      }
      items.sort((a, b) => a.start - b.start);
      for (const e of items) {
        const d = util.el('div', '', C.agenda);
        util.el('span', '', d, C.tl(e.start));
        util.el('span', '', d, e.name);
      }
    };
    BASE.calPaintStart = () => {};
    BASE.calPaintExtra = () => {};
    BASE.calReady = () => {};
    BASE.calStarted = () => {};
    BASE.calLocate = () => undefined;
  }
  function paintEvent(state, m, ...rest) { state.P.calPaintEvent(state.C, m, ...rest); }

  function paint(state, m) {
    state.P.calPaintStart(state.C, m);
    state.paintEvent(m);
    state.P.calPaintForm(state.C, m);
    state.P.calPaintAgenda(state.C, m);
    state.P.calPaintExtra(state.C, m);
    state.G.scrollTo(m.view.top);
  }

  function buildGrid(state) {
    ({ util: state.util, spec: state.spec } = state.ctx);
    state.fam = env.taskDef.helpers;
    state.N = state.fam.SLOTS;
    state.C = { ctx: state.ctx, util: state.util, spec: state.spec, fam: state.fam, main: state.main, N: state.N };
    state.C.tl = (i) => state.P.calTimeLabel(state.C, i);
    state.P.calStart(state.C);
    state.P.calBeforeCal(state.C);
    state.cal = state.C.cal = state.util.el('div', 'at-cal', state.main);
    state.C.head = state.util.el('div', 'at-cal-h', state.cal);
    state.P.calHead(state.C);
    state.wrap = state.C.wrap = state.util.el('div', 'at-cal-wrap', state.cal);
    state.side = state.C.side = state.util.el('aside', 'at-side', state.main);
    state.side.style.width = `${Math.round(state.clamp(state.main.getBoundingClientRect().width * 0.32, 210, 290))}px`;
    state.P.calSideBuilt(state.C);
    state.avail = Math.floor(state.wrap.getBoundingClientRect().height) - 2;
    ({ rowH: state.rowH, rows: state.rows } = state.P.calRows(state.C, state.avail));
    state.C.rowH = state.rowH;
    state.C.rows = state.rows;
    state.fr = state.C.fr = state.util.el('div', 'at-cal-frame', state.wrap);
    state.sc = state.C.sc = state.util.el('div', 'at-cal-scroll', state.fr);
    state.sc.style.height = `${state.rows * state.rowH}px`;
    state.sc.dataset.role = 'day';
    state.grid = state.C.grid = state.util.el('div', 'at-cal-grid', state.sc);
    state.grid.style.height = `${state.N * state.rowH}px`;
    state.C.gut = state.util.el('div', 'at-gut', state.grid);
    state.col = state.C.col = state.util.el('div', 'at-col', state.grid);
    state.col.dataset.role = 'timeslots';
    state.P.calGridBuilt(state.C);
    for (let i = 0; i < state.N; i++) state.P.calLine(state.C, i);
    state.C.label = (e) => `${state.C.tl(e.start)} – ${state.C.tl(e.start + e.dur)}`;
    state.C.place = (el, e) => state.P.calPlace(state.C, el, e);
    for (const e of state.spec.events) state.P.calEvent(state.C, e);
    state.C.mine = state.util.el('div', 'at-ev user', state.col);
    state.C.mine.hidden = true;
    state.G = state.C.G = state.P.scrollGrid(state.ctx, state.fr, state.sc, state.rows, state.rowH, state.N);
    state.P.calSide(state.C);
    state.P.calFormBuilt(state.C);
    state.field = state.C.field = env.ui.textField(state.C.name, {
      value: '',
      label: 'event-name',
      onInput: (v) => state.P.calNameInput(state.C, v),
    });
    state.commit = state.C.commit = (m) => { state.ctx.update(m); state.paint(state.ctx.model); };
    state.P.calActions(state.C);
    state.slotAt = (y) => Math.max(0, Math.min(state.N - 1, Math.floor((y - state.col.getBoundingClientRect().top) / state.rowH)));
    state.anchor = null;
    env.ui.track(state.col, {
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
        state.C.name.focus({ preventScroll: true });
      },
    }, 'timeslots');
    state.C.paintEvent = state.paintEvent;
    state.C.paint = state.paint;
    state.P.calReady(state.C);
    state.paint(state.ctx.model);
    state.G.report();
    state.P.calStarted(state.C);
  }

  function handlers(state) {
    return {
      sync(m) {
        state.paint(m);
        state.G.report();
      },
      locate(t) {
        const own = state.P.calLocate(state.C, t);
        if (own !== undefined) return own;
        if (t.thumb) return state.G.slider.locateThumb(0);
        if (t.scroll !== undefined) return state.G.slider.locate(t.scroll);
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
        if (t.form) return state.hitPoint(t.form === 'create' ? state.C.create : state.C.cancel);
        return null;
      },
    };
  }

  function build(ctx, main, scope) {
    const state = {
      ctx, main, P: scope.P, clamp: scope.clamp, freeAt: scope.freeAt, hitPoint: scope.hitPoint,
    };
    state.paintEvent = (m, ...rest) => paintEvent(state, m, ...rest);
    state.paint = (m) => paint(state, m);
    buildGrid(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_workspace-calendar', () => ({ install }));
})();
