// Design on templates/use-desktop-tools/base.js: the base site's use-desktop-tools widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-week-04',
  name: 'design',
  split: 'train',
  scenarios: ['week'],
  template: 'use-desktop-tools/base',
  design: {
    parts: {
      'buildWeek': (base, scope) => function buildWeek(ctx, main) {
        const { clamp, env, hitPoint, scrollGrid, svg } = scope;
        const { util, spec } = ctx;
        const fam = env.taskDef.helpers;
        const N = fam.SLOTS;
        const tl = (i) => fam.timeLabel(i, spec.h24);
        const calendarRail = util.el('aside', 'week-rail', main);
        util.el('button', 'week-new', calendarRail, 'New Event');
        const own = util.el('div', 'week-list', calendarRail);
        [['#0878eb','My Calendar'],['#13b447','Work'],['#7125ef','Personal'],['#f27a08','Family'],['#526d8d','Holidays']].forEach(([color,label]) => {
          const row = util.el('div', 'week-check', own);
          util.el('i', '', row).style.background = color;
          util.el('span', '', row, label);
        });
        util.el('h4', 'week-section', calendarRail, 'My Calendars');
        [['▦','Calendar',true],['☑','Tasks',false],['▤','Notes',false]].forEach(([icon,label,on]) => {
          const row = util.el('div', 'week-shortcut' + (on ? ' on' : ''), calendarRail);
          util.el('b', '', row, icon); util.el('span', '', row, label);
        });
        util.el('h4', 'week-section other', calendarRail, 'Other Calendars　＋');
        [['#e3425b','Team'],['#ffb400','Birthdays'],['#8da5bc','US Holidays']].forEach(([color,label]) => {
          const row = util.el('div', 'week-check', calendarRail);
          util.el('i', '', row).style.background = color;
          util.el('span', '', row, label);
        });
        const cal = util.el('div', 'at-cal', main);
        const head = util.el('div', 'at-cal-h', cal);
        const viewTabs = util.el('div', 'at-view-tabs', head);
        ['Day', 'Week', 'Work Week', 'Month', 'Agenda'].forEach((label) => {
          util.el('span', label === 'Week' ? 'active' : '', viewTabs, label);
        });
        util.el('span', 'today', head, 'Today');
        util.el('span', 'nav', head).innerHTML = svg('<path d="M10 3.5L5.5 8 10 12.5"/>', 16);
        util.el('span', 'nav', head).innerHTML = svg('<path d="M6 3.5L10.5 8 6 12.5"/>', 16);
        util.el('h3', '', head, `${spec.month} ${spec.dates[0]} – ${spec.dates[spec.days - 1]}, 2025`);
        util.el('span', 'chip', head, 'Week');
        const wrap = util.el('div', 'at-cal-wrap', cal);
        const fr = util.el('div', 'at-wframe', wrap);
        const dh = util.el('div', 'at-wdays', fr);
        util.el('div', 'g', dh);
        spec.dayNames.forEach((d, i) => {
          const c = util.el('div', '', dh);
          util.el('span', '', c, d.slice(0, 3));
          util.el('b', '', c, String(spec.dates[i]));
        });
        util.el('div', 's', dh);
        const body = util.el('div', 'at-wrow', fr);

        // The undo toast sits over the bottom-left of the calendar (14px up, about 42px tall): end the grid above it, so the toast never covers a row the oracle drags to.
        const toastRoom = cal.getBoundingClientRect().bottom - 57 - dh.getBoundingClientRect().bottom;
        const avail = Math.min(Math.floor(wrap.getBoundingClientRect().height - dh.getBoundingClientRect().height) - 4, Math.floor(toastRoom));
        const rowH = Math.max(20, Math.min(30, Math.floor(avail / 16)));
        const rows = Math.floor(avail / rowH);
        const sc = util.el('div', 'at-cal-scroll', body);
        sc.style.height = `${rows * rowH}px`;
        sc.dataset.role = 'week';
        const grid = util.el('div', 'at-cal-grid', sc);
        grid.style.height = `${N * rowH}px`;
        const colsEl = util.el('div', 'at-wcols', grid);
        colsEl.style.cssText = 'flex: 1; min-width: 0; display: flex; position: relative;';
        const gut = util.el('div', 'at-gut', grid);
        const cols = [];
        for (let d = 0; d < spec.days; d++) {
          const c = util.el('div', 'at-col', colsEl);
          for (let i = 0; i < N; i++) {
            const l = util.el('div', 'at-hh' + (i % 2 ? ' half' : ''), c);
            l.style.top = `${i * rowH}px`;
          }
          cols.push(c);
        }
        for (let i = 0; i < N; i++) {
          const s = util.el('span', '', gut, spec.h24 ? tl(i) : tl(i).toUpperCase());
          s.style.top = `${i * rowH}px`;
        }
        const ghost = util.el('div', 'at-wghost', colsEl);
        ghost.hidden = true;
        const S = scrollGrid(ctx, body, sc, rows, rowH, N);
        const toast = util.el('div', 'at-toast', cal);
        toast.hidden = true;
        const toastText = util.el('span', '', toast);
        const undo = util.el('button', '', toast, 'Undo');
        undo.type = 'button';

        const inspector = util.el('aside', 'week-inspector', main);
        // Default inspector content follows calendar order, independent of the goal.
        const chosen = spec.events[0];
        const chosenTime = (v) => `${tl(v.start)} – ${tl(v.start + v.dur)}`;
        util.el('h2', 'inspector-title', inspector, chosen ? chosen.name : 'Event details');
        const category = util.el('div', 'inspector-category', inspector);
        util.el('i', '', category).style.background = chosen ? ['#0878eb','#13b447','#f27a08','#7125ef'][chosen.tone % 4] : '#0878eb';
        util.el('span', '', category, chosen ? (['Work','Personal','Family','Personal'][chosen.tone % 4]) : 'Calendar');
        const divider = () => util.el('div', 'inspector-divider', inspector);
        divider();
        const dateLine = util.el('div', 'inspector-line', inspector);
        util.el('b', '', dateLine, '◷');
        const dateText = util.el('div', '', dateLine);
        util.el('strong', '', dateText, chosen ? `${spec.dayNames[ctx.model.evs[chosen.id].day]}, ${spec.month} ${spec.dates[ctx.model.evs[chosen.id].day]}, 2025` : 'This week');
        const timeText = util.el('span', '', dateText, chosen ? chosenTime(ctx.model.evs[chosen.id]) : '');
        divider();
        const placeLine = util.el('div', 'inspector-line', inspector);
        util.el('b', '', placeLine, '◆');
        const placeText = util.el('div', '', placeLine);
        util.el('strong', '', placeText, 'Music Studio');
        util.el('span', '', placeText, '123 Maple St');
        util.el('span', '', placeText, 'Riverton, CA 94536');
        divider();
        const descLine = util.el('div', 'inspector-line', inspector);
        util.el('b', '', descLine, '▤');
        util.el('div', '', descLine, 'Weekly calendar event with details.');

        const evEls = {};
        const commit = (m) => { ctx.update(m); paint(ctx.model); };
        undo.addEventListener('click', () => commit(fam.wkUndo(ctx.model)));

        function paint(m) {
          for (const e of spec.events) {
            const v = m.evs[e.id];
            let el = evEls[e.id];
            if (!el) {
              el = util.el('div', `at-wev t${e.tone}`, cols[v.day]);
              el.dataset.id = e.id;
              evEls[e.id] = el;
            }
            if (el.parentElement !== cols[v.day]) cols[v.day].append(el);
            el.style.top = `${v.start * rowH + 1}px`;
            el.style.height = `${v.dur * rowH - 2}px`;
            el.replaceChildren();
            util.el('b', '', el, e.name);
            if (v.dur * rowH > 36) util.el('span', '', el, `${tl(v.start)} – ${tl(v.start + v.dur)}`);
            util.el('div', 'at-whandle', el);
          }
          if (chosen) {
            const v = m.evs[chosen.id];
            dateText.querySelector('strong').textContent = `${spec.dayNames[v.day]}, ${spec.month} ${spec.dates[v.day]}, 2025`;
            timeText.textContent = chosenTime(v);
          }
          if (m.last) {
            const e = spec.events.find((x) => x.id === m.last.id);
            const v = m.evs[m.last.id];
            const p = m.last.prev;
            toastText.textContent = v.dur !== p.dur && v.start === p.start && v.day === p.day ? `“${e.name}” resized` : `“${e.name}” moved to ${spec.dayNames[v.day].slice(0, 3)} ${tl(v.start)}`;
            toast.hidden = false;
          } else toast.hidden = true;
          S.scrollTo(m.view.top);
        }

        // Drag: body moves (day by column, start by row), the bottom handle resizes.
        const colAt = (x) => {
          let best = 0;
          cols.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            if (x >= r.left) best = i;
          });
          return best;
        };
        const top0 = () => cols[0].getBoundingClientRect().top;
        let drag = null;
        env.ui.track(colsEl, {
          start(p, e) {
            const evEl = e.target.closest('.at-wev');
            if (!evEl) return false;
            const id = evEl.dataset.id;
            const v = ctx.model.evs[id];
            const resize = !!e.target.closest('.at-whandle');
            drag = { id, resize, off: Math.max(0, Math.floor((p.y - top0() - v.start * rowH) / rowH)) };
            evEl.dataset.dragging = '';
            return true;
          },
          move(p) {
            if (!drag) return;
            const v = ctx.model.evs[drag.id];
            let day = v.day;
            let start = v.start;
            let dur = v.dur;
            if (drag.resize) dur = Math.max(1, Math.round((p.y - top0()) / rowH) - v.start);
            else {
              day = colAt(p.x);
              start = clamp(Math.floor((p.y - top0()) / rowH) - drag.off, 0, N - v.dur);
            }
            const cr = cols[day].getBoundingClientRect();
            const gr = colsEl.getBoundingClientRect();
            ghost.hidden = false;
            Object.assign(ghost.style, { left: `${cr.left - gr.left + 2}px`, width: `${cr.width - 4}px`, top: `${start * rowH}px`, height: `${dur * rowH}px` });
          },
          end(p) {
            if (!drag) return;
            const d = drag;
            drag = null;
            ghost.hidden = true;
            if (evEls[d.id]) delete evEls[d.id].dataset.dragging;
            const v = ctx.model.evs[d.id];
            if (d.resize) commit(fam.wkResize(ctx.model, d.id, Math.round((p.y - top0()) / rowH)));
            else commit(fam.wkMove(ctx.model, d.id, colAt(p.x), Math.floor((p.y - top0()) / rowH) - d.off));
            if (v === ctx.model.evs[d.id]) paint(ctx.model);
          },
        }, 'week-event');

        paint(ctx.model);
        S.report();

        const inView = (y) => {
          const r = sc.getBoundingClientRect();
          return y >= r.top + 2 && y <= r.bottom - 2;
        };
        return {
          sync(m) {
            paint(m);
            S.report();
          },
          locate(t) {
            if (t.thumb) return S.slider.locateThumb(0);
            if (t.scroll !== undefined) return S.slider.locate(t.scroll);
            if (t.pane) {
              const r = sc.getBoundingClientRect();
              return [r.left + r.width / 2, r.top + r.height / 2];
            }
            if (t.toast) return toast.hidden ? null : hitPoint(undo);
            if (t.evgrab !== undefined || t.evhandle !== undefined) {
              const id = t.evgrab ?? t.evhandle;
              const el = evEls[id];
              const r = el.getBoundingClientRect();
              const y = t.evgrab !== undefined ? r.top + rowH / 2 - 1 : r.bottom - 2.5;
              if (!inView(y)) return null;
              for (const u of [0.5, 0.3, 0.7, 0.15, 0.85]) {
                const x = r.left + r.width * u;
                const hit = document.elementFromPoint(x, y);
                if (hit && el.contains(hit) && (t.evhandle === undefined || hit.closest('.at-whandle'))) return [x, y];
              }
              return [r.left + r.width / 2, y];
            }
            if (t.cell || t.edge) {
              const [day, row] = t.cell || t.edge;
              const c = cols[day].getBoundingClientRect();
              const y = t.cell ? top0() + (row + 0.5) * rowH : top0() + row * rowH - 2;
              if (!inView(y)) return null;
              return [c.left + c.width / 2, y];
            }
            return null;
          },
        };
      },
    },
  },
});
