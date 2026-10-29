/* use-desktop-tools/_base-week: week grid and event dragging.
 * build(ctx, main, frame?, scope) owns one render's state; scope supplies the base template's
 * overridable units. Named setup, painting and input helpers keep their original statement order.
 */
(function () {
  'use strict';
  function paint(state, m) {
    for (const e of state.spec.events) {
      const v = m.evs[e.id];
      let el = state.evEls[e.id];
      if (!el) {
        el = state.util.el('div', `at-wev t${e.tone}`, state.cols[v.day]);
        el.dataset.id = e.id;
        state.evEls[e.id] = el;
      }
      if (el.parentElement !== state.cols[v.day]) state.cols[v.day].append(el);
      el.style.top = `${v.start * state.rowH + 1}px`;
      el.style.height = `${v.dur * state.rowH - 2}px`;
      el.replaceChildren();
      state.util.el('b', '', el, e.name);
      if (v.dur * state.rowH > 36) state.util.el('span', '', el, `${state.tl(v.start)} – ${state.tl(v.start + v.dur)}`);
      state.util.el('div', 'at-whandle', el);
    }
    if (m.last) {
      const e = state.spec.events.find((x) => x.id === m.last.id);
      const v = m.evs[m.last.id];
      const p = m.last.prev;
      state.toastText.textContent = v.dur !== p.dur && v.start === p.start && v.day === p.day ? `“${e.name}” resized` : `“${e.name}” moved to ${state.spec.dayNames[v.day].slice(0, 3)} ${state.tl(v.start)}`;
      state.toast.hidden = false;
    } else state.toast.hidden = true;
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
    state.util.el('h3', '', state.head, `${state.spec.month} ${state.spec.dates[0]} – ${state.spec.dates[state.spec.days - 1]}`);
    state.util.el('span', 'chip', state.head, 'Week');
    state.wrap = state.util.el('div', 'at-cal-wrap', state.cal);
    state.fr = state.util.el('div', 'at-wframe', state.wrap);
    state.dh = state.util.el('div', 'at-wdays', state.fr);
    state.util.el('div', 'g', state.dh);
    state.spec.dayNames.forEach((d, i) => {
      const c = state.util.el('div', '', state.dh);
      state.util.el('span', '', c, d.slice(0, 3));
      state.util.el('b', '', c, String(state.spec.dates[i]));
    });
    state.util.el('div', 's', state.dh);
    state.body = state.util.el('div', 'at-wrow', state.fr);
    state.avail = Math.floor(state.wrap.getBoundingClientRect().height - state.dh.getBoundingClientRect().height) - 4;
    state.rowH = Math.max(20, Math.min(30, Math.floor(state.avail / 16)));
    state.rows = Math.floor(state.avail / state.rowH);
    state.sc = state.util.el('div', 'at-cal-scroll', state.body);
    state.sc.style.height = `${state.rows * state.rowH}px`;
    state.sc.dataset.role = 'week';
    state.grid = state.util.el('div', 'at-cal-grid', state.sc);
    state.grid.style.height = `${state.N * state.rowH}px`;
    state.gut = state.util.el('div', 'at-gut', state.grid);
    state.colsEl = state.util.el('div', 'at-wcols', state.grid);
    state.colsEl.style.cssText = 'flex: 1; min-width: 0; display: flex; position: relative;';
    state.cols = [];
    for (let d = 0; d < state.spec.days; d++) {
      const c = state.util.el('div', 'at-col', state.colsEl);
      for (let i = 0; i < state.N; i++) {
        const l = state.util.el('div', 'at-hh' + (i % 2 ? ' half' : ''), c);
        l.style.top = `${i * state.rowH}px`;
      }
      state.cols.push(c);
    }
    for (let i = 0; i < state.N; i += 2) {
      const s = state.util.el('span', '', state.gut, state.spec.h24 ? state.tl(i) : state.tl(i).toUpperCase());
      s.style.top = `${i * state.rowH}px`;
    }
    state.ghost = state.util.el('div', 'at-wghost', state.colsEl);
    state.ghost.hidden = true;
    state.S = state.scrollGrid(state.ctx, state.body, state.sc, state.rows, state.rowH, state.N);
    state.toast = state.util.el('div', 'at-toast', state.cal);
    state.toast.hidden = true;
    state.toastText = state.util.el('span', '', state.toast);
    state.undo = state.util.el('button', '', state.toast, 'Undo');
    state.undo.type = 'button';
    state.evEls = {};
    state.commit = (m) => { state.ctx.update(m); state.paint(state.ctx.model); };
    state.undo.addEventListener('click', () => state.commit(state.fam.wkUndo(state.ctx.model)));
    state.colAt = (x) => {
      let best = 0;
      state.cols.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        if (x >= r.left) best = i;
      });
      return best;
    };
    state.top0 = () => state.cols[0].getBoundingClientRect().top;
    state.drag = null;
  }

  function bindEvents(state) {
    state.env.ui.track(state.colsEl, {
      start(p, e) {
        const evEl = e.target.closest('.at-wev');
        if (!evEl) return false;
        const id = evEl.dataset.id;
        const v = state.ctx.model.evs[id];
        const resize = !!e.target.closest('.at-whandle');
        state.drag = { id, resize, off: Math.max(0, Math.floor((p.y - state.top0() - v.start * state.rowH) / state.rowH)) };
        evEl.dataset.dragging = '';
        return true;
      },
      move(p) {
        if (!state.drag) return;
        const v = state.ctx.model.evs[state.drag.id];
        let day = v.day;
        let start = v.start;
        let dur = v.dur;
        if (state.drag.resize) dur = Math.max(1, Math.round((p.y - state.top0()) / state.rowH) - v.start);
        else {
          day = state.colAt(p.x);
          start = state.clamp(Math.floor((p.y - state.top0()) / state.rowH) - state.drag.off, 0, state.N - v.dur);
        }
        const cr = state.cols[day].getBoundingClientRect();
        const gr = state.colsEl.getBoundingClientRect();
        state.ghost.hidden = false;
        Object.assign(state.ghost.style, { left: `${cr.left - gr.left + 2}px`, width: `${cr.width - 4}px`, top: `${start * state.rowH}px`, height: `${dur * state.rowH}px` });
      },
      end(p) {
        if (!state.drag) return;
        const d = state.drag;
        state.drag = null;
        state.ghost.hidden = true;
        if (state.evEls[d.id]) delete state.evEls[d.id].dataset.dragging;
        const v = state.ctx.model.evs[d.id];
        if (d.resize) state.commit(state.fam.wkResize(state.ctx.model, d.id, Math.round((p.y - state.top0()) / state.rowH)));
        else state.commit(state.fam.wkMove(state.ctx.model, d.id, state.colAt(p.x), Math.floor((p.y - state.top0()) / state.rowH) - d.off));
        if (v === state.ctx.model.evs[d.id]) state.paint(state.ctx.model);
      },
    }, 'week-event');
    state.paint(state.ctx.model);
    state.S.report();
    state.inView = (y) => {
      const r = state.sc.getBoundingClientRect();
      return y >= r.top + 2 && y <= r.bottom - 2;
    };
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
          return [r.left + r.width / 2, r.top + r.height / 2];
        }
        if (t.toast) return state.toast.hidden ? null : state.hitPoint(state.undo);
        if (t.evgrab !== undefined || t.evhandle !== undefined) {
          const id = t.evgrab ?? t.evhandle;
          const el = state.evEls[id];
          const r = el.getBoundingClientRect();
          const y = t.evgrab !== undefined ? r.top + state.rowH / 2 - 1 : r.bottom - 2.5;
          if (!state.inView(y)) return null;
          for (const u of [0.5, 0.3, 0.7, 0.15, 0.85]) {
            const x = r.left + r.width * u;
            const hit = document.elementFromPoint(x, y);
            if (hit && el.contains(hit) && (t.evhandle === undefined || hit.closest('.at-whandle'))) return [x, y];
          }
          return [r.left + r.width / 2, y];
        }
        if (t.cell || t.edge) {
          const [day, row] = t.cell || t.edge;
          const c = state.cols[day].getBoundingClientRect();
          const y = t.cell ? state.top0() + (row + 0.5) * state.rowH : state.top0() + row * state.rowH - 2;
          if (!state.inView(y)) return null;
          return [c.left + c.width / 2, y];
        }
        return null;
      },
    };
  }

  function build(ctx, main, scope) {
    const state = {
      ctx, main, env: scope.env, svg: scope.svg, scrollGrid: scope.scrollGrid,
      clamp: scope.clamp, hitPoint: scope.hitPoint,
    };
    state.paint = (m) => paint(state, m);
    buildGrid(state);
    bindEvents(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_base-week', () => ({ build }));
})();
