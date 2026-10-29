// Design on the shared use-calendar/workspace template: a Windows 2000 attendee-lane day view.
(function () {
  'use strict';
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const TZ = ['PST', 'EET', 'CST', 'GMT'];
  const pad = (n) => String(n).padStart(2, '0');
  const hm = (t) => `${Math.floor(t / 60)}:${pad(t % 60)}`;
  const hm2 = (t) => `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
  const t0 = (s) => s.open - 60;
  const span = (s) => s.close - s.open + 165;
  const durText = (d) => {
    const h = Math.floor(d / 60);
    const m = d % 60;
    return [h ? `${h} hour${h > 1 ? 's' : ''}` : '', m ? `${m} minute${m > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ');
  };
  const dateText = (s) => `Mon ${MONTHS.indexOf(s.month) + 1}/8/2027`;
  const PERSON =
    '<svg viewBox="0 0 16 18" width="22" height="24" aria-hidden="true"><path d="M1 17v-4q0-3 4-3h6q4 0 4 3v4z" fill="#1f3f9f" stroke="#000" stroke-width=".7"/><circle cx="8" cy="5.5" r="4" fill="#f2c27c" stroke="#000" stroke-width=".7"/><path d="M4 5.5q0-4.2 4-4.2t4 4.2q-1-2.2-4-2.2t-4 2.2z" fill="#1a1a1a"/></svg>';
  const CAL =
    '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1" y="2" width="14" height="13" fill="#fff" stroke="#1f3f9f"/><rect x="1" y="2" width="14" height="3.5" fill="#1f3f9f"/><path d="M4 8h2M7 8h2M10 8h2M4 11h2M7 11h2M10 11h2M4 14h2M7 14h2" stroke="#4a78d0" stroke-width="1.3"/></svg>';
  const CAL_BIG =
    '<svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true"><rect x="2" y="4" width="30" height="28" fill="#fff" stroke="#1f3f9f" stroke-width="1.5"/><rect x="2" y="4" width="30" height="7" fill="#1f3f9f"/><path d="M7 15h5M14 15h5M21 15h5M7 20h5M14 20h5M21 20h5M7 26h5M14 26h5" stroke="#4a78d0" stroke-width="3"/></svg>';
  const PENCIL =
    '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M3 17l1-4 9-9 3 3-9 9z" fill="#f0b000" stroke="#604000"/><path d="M3 17l1-4 3 3z" fill="#fff" stroke="#604000"/></svg>';
  const CROSS =
    '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" stroke="#d01010" stroke-width="3"/></svg>';
  const FIND =
    '<svg viewBox="0 0 24 22" width="22" height="20" aria-hidden="true"><circle cx="9" cy="6" r="4" fill="#f2c27c" stroke="#000" stroke-width=".8"/><path d="M1 21v-5q0-4 8-4t8 4v5z" fill="#1f3f9f" stroke="#000" stroke-width=".8"/><circle cx="17" cy="8" r="3.4" fill="#f2c27c" stroke="#000" stroke-width=".8"/><path d="M12 21v-4q0-3 5-3t6 3v4z" fill="#d89020" stroke="#000" stroke-width=".8"/></svg>';

  env.widget({
    task: 'use-calendar',
    site: 'design-use-calendar-freeslot-05',
    name: 'design',
    split: 'train',
    scenarios: ['freeslot'],
    template: 'use-calendar/workspace',
    design: {
      colors: ['#1675ee', '#2fa527', '#ef8500', '#7040d8'],
      inset: 0,
      parts: {
        miniCalendar: (base, S) => (st, side) => {
          const { s, u } = st;
          const head = u.el('div', 'ol-month-head', side);
          u.el('span', '', head, '‹');
          u.el('strong', '', head, `${s.month} 2027`);
          u.el('span', '', head, '›');
          const cal = u.el('div', 'ol-month', side);
          ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].forEach((w) => u.el('span', 'ol-weekday', cal, w));
          const first = s.firstWeekday;
          for (let k = 0; k < Math.ceil((first + s.monthDays) / 7) * 7; k++) {
            const d = k - first + 1;
            u.el('span', d === 8 ? 'ol-today' : d < 1 || d > s.monthDays ? 'ol-out' : '', cal, String(d < 1 ? 31 + d : d > s.monthDays ? d - s.monthDays : d));
          }
        },
        sidebar: (base, S) => (st) => {
          const { u, body } = st;
          const side = u.el('aside', 'ol-sidebar', body);
          S.P.miniCalendar(st, side);
        },
        workspace: (base, S) => (st) => {
          const { u, body } = st;
          const main = u.el('div', 'ac-main ol-main', body);
          const summary = document.querySelector('.outlook-summary');
          if (summary) main.appendChild(summary);
          const context = u.el('div', 'ol-date-heading', main);
          const contextTitle = u.el('b', '', context);
          return { main, context, contextTitle };
        },
        timeHeader: (base, S) => (st) => {
          const { s, u, main, refs } = st;
          const header = u.el('div', 'ac-head w2k-head', main);
          refs.axis = 150;
          u.el('div', 'w2k-axis-head', header, 'Attendees');
          const times = u.el('div', 'w2k-times', header);
          const a = t0(s);
          const n = span(s);
          for (let t = a; t <= a + n; t += 60) {
            const l = u.el('span', 'w2k-hour', times, hm(t));
            l.style.left = `${((t - a) / n) * 100}%`;
          }
          const names = s.people.concat('Your calendar');
          refs.count = names.length;
          refs.dayHeads = [];
          names.forEach(() => {
            const h = u.el('div', '', header);
            h.hidden = true;
            u.el('b', '', h);
            refs.dayHeads.push(h);
          });
          return names;
        },
        allDay: (base, S) => () => {},
        timeGrid: (base, S) => (st, names) => {
          const { s, u, main, refs } = st;
          const wrap = u.el('div', 'ac-scroll-wrap w2k-wrap', main);
          const pane = u.el('div', 'ac-pane w2k-pane', wrap);
          const grid = u.el('div', 'ac-time-grid w2k-grid', pane);
          refs.pane = pane;
          refs.grid = grid;
          const nameCol = u.el('div', 'w2k-names', grid);
          names.forEach((name, i) => {
            const row = u.el('div', 'w2k-name', nameCol);
            const ic = u.el('span', 'w2k-ico', row);
            ic.innerHTML = PERSON;
            const who = u.el('span', 'w2k-who', row);
            u.el('b', '', who, name);
            u.el('small', '', who, i < s.people.length ? `(${TZ[i % 4]})` : '(Local)');
          });
          const columns = u.el('div', 'ac-columns w2k-columns', grid);
          columns.style.setProperty('--hours', String(span(s) / 60));
          refs.columns = columns;
          names.forEach(() => u.el('div', 'ac-column w2k-lane', columns));
          const now = u.el('div', 'ac-now', grid);
          refs.now = now;
          const eventLayer = u.el('div', 'ac-columns w2k-layer', grid);
          eventLayer.style.pointerEvents = 'none';
          refs.eventLayer = eventLayer;
          return { wrap, pane, grid, columns, eventLayer };
        },
        adjacentEvents: (base, S) => (st, grid) => {
          const { D } = S;
          const { s, u, f, refs } = st;
          const adj = u.el('div', 'ac-columns w2k-layer', grid);
          adj.style.pointerEvents = 'none';
          refs.adjacent = adj;
          for (let i = 0; i < refs.count; i++) {
            const ev = u.el('div', 'ac-event', adj);
            const start = s.open + 90 + i * 45;
            ev.style.left = `${((start - t0(s)) / span(s)) * 100}%`;
            ev.style.width = `${(60 / span(s)) * 100}%`;
            ev.style.top = `calc(${(100 * i) / refs.count}% + var(--w2k-pad, 11px))`;
            ev.style.height = `calc(${100 / refs.count}% - 2 * var(--w2k-pad, 11px))`;
            u.el('b', '', ev, D.projects[i % D.projects.length]);
            u.el('small', '', ev, `${f.helpers.time(start)} - ${f.helpers.time(start + 60)}`);
          }
        },
        positionEvent: (base, S) => (st, el, e, id) => {
          const { refs, s, f } = st;
          if (!el) return;
          const cols = refs.count;
          const owner = S.P.eventInfo(st, id).owner;
          const row = id === s.target ? cols - 1 : owner;
          el.style.left = `${((e.start - t0(s)) / span(s)) * 100}%`;
          el.style.width = `${(e.duration / span(s)) * 100}%`;
          el.style.top = `calc(${(100 * row) / cols}% + var(--w2k-pad, 11px))`;
          el.style.height = `calc(${100 / cols}% - 2 * var(--w2k-pad, 11px))`;
          const when = `${f.helpers.time(e.start)} - ${f.helpers.time(e.start + e.duration)}`;
          el.querySelector('small').textContent = when;
          el.title = when;
          el.toggleAttribute('data-short', e.duration < 60);
          el.toggleAttribute('data-halfhour', e.duration === 30);
          el.toggleAttribute('data-tiny', e.duration < 30);
        },
        minute: (base, S) => (st, grid, x) => {
          const { s, refs } = st;
          const r = refs.columns.getBoundingClientRect();
          const m = Math.round((x - r.left) / (r.width / span(s)) / 15) * 15 + t0(s);
          return Math.max(s.open, Math.min(s.close, m));
        },
        creation: (base, S) => (st, grid, columns) => {
          const { ctx, s, u, f, refs } = st;
          const P = S.P;
          const draft = u.el('div', 'ac-draft w2k-draft', refs.eventLayer);
          let begin;
          env.ui.track(grid, {
            start(p, e) {
              if (ctx.model.browse || !['freeslot', 'timezone'].includes(s.scenario) || e.target.closest('.ac-event')) return false;
              const r = columns.getBoundingClientRect();
              if (p.x < r.left) return false;
              begin = { day: s.date, start: P.minute(st, grid, p.x) };
              return true;
            },
            move(p) {
              const now = P.minute(st, grid, p.x);
              const a = Math.min(begin.start, now);
              const len = Math.max(15, Math.abs(now - begin.start));
              draft.style.display = 'block';
              draft.style.left = `${((a - t0(s)) / span(s)) * 100}%`;
              draft.style.width = `${(len / span(s)) * 100}%`;
              draft.style.top = `calc(${(100 * (refs.count - 1)) / refs.count}% + var(--w2k-pad, 11px))`;
              draft.style.height = `calc(${100 / refs.count}% - 2 * var(--w2k-pad, 11px))`;
            },
            end(p) {
              draft.style.display = 'none';
              const end = P.minute(st, grid, p.x);
              const start = Math.min(begin.start, end);
              const duration = Math.max(15, Math.abs(end - begin.start));
              P.commit(st, f.helpers.change(ctx.model, s.target, { day: begin.day, start, duration }, s));
            },
          }, 'calendar-create');
        },
        attach: (base, S) => (st, el, id, isEdge = false) => {
          const P = S.P;
          const { ctx, s, f, refs } = st;
          let original;
          let grab;
          const perMinute = () => refs.columns.getBoundingClientRect().width / span(s);
          env.ui.track(el, {
            start(p, e) {
              if (!isEdge && e.target.closest('.ac-edge')) return false;
              e.stopPropagation();
              original = { ...ctx.model.events[id] };
              grab = { x: p.x, y: p.y };
            },
            move(p) {
              const k = perMinute();
              const patch = isEdge
                ? { duration: Math.max(15, Math.round((original.duration + p.dx / k) / 15) * 15) }
                : { day: s.date, start: original.start + Math.round(p.dx / k / 15) * 15 };
              const candidate = f.helpers.change(ctx.model, id, patch, s).events[id];
              P.positionEvent(st, el.closest('.ac-event'), candidate, id);
            },
            end(p) {
              const k = perMinute();
              const patch = isEdge
                ? { duration: original.duration + Math.round(p.dx / k / 15) * 15 }
                : { day: s.date, start: original.start + Math.round((p.x - grab.x) / k / 15) * 15 };
              if (Math.abs(p.dx) + Math.abs(p.dy) < 3) P.commit(st, { ...ctx.model, selected: id });
              else P.commit(st, f.helpers.change(ctx.model, id, patch, s));
            },
          }, isEdge ? 'calendar-duration' : 'calendar-event');
        },
        scrollbar: (base, S) => (st, wrap, pane) => {
          const { ctx, s, refs } = st;
          refs.scroll = {
            to() {},
            get() {
              return 0;
            },
            max() {
              return 0;
            },
            locateThumb() {
              const b = pane.getBoundingClientRect();
              return [b.left + b.width / 2, b.top + b.height / 2];
            },
          };
          ctx.patch({ view: { top: s.open, bottom: s.close, px: 0 } });
        },
        locate: (base, S) => (st, t) => {
          const { ctx, s, refs } = st;
          const r = refs;
          const m = ctx.model;
          const center = (el) => {
            if (!el) throw new Error(`use-calendar target not rendered: ${JSON.stringify(t)}`);
            const b = el.getBoundingClientRect();
            return [b.left + b.width / 2, b.top + b.height / 2];
          };
          if (t.today) return center(r.today);
          if (t.event) {
            const b = r.events.get(t.event).getBoundingClientRect();
            return [b.left + Math.min(8, b.width / 3), b.top + b.height / 2];
          }
          if (t.edge) return center(r.edges.get(t.edge));
          if (t.pane) {
            const b = r.pane.getBoundingClientRect();
            return [b.left + 20, b.top + b.height / 2];
          }
          if (t.thumb || t.scroll !== undefined) return r.scroll.locateThumb();
          const cell = t.cell || t.end;
          if (cell) {
            const b = r.columns.getBoundingClientRect();
            const dx = t.cell && m.created ? 8 : t.end ? -2 : 0;
            return [b.left + ((cell[1] - t0(s)) / span(s)) * b.width + dx, b.top + (b.height * (r.count - 0.5)) / r.count];
          }
          throw new Error(`use-calendar unknown target ${JSON.stringify(t)}`);
        },
        inspector: (base, S) => (st) => {
          const { u, body, s } = st;
          const ins = u.el('aside', 'ol-right', body);
          ins.setAttribute('aria-label', 'Event Details');
          const title = u.el('div', 'ol-right-title', ins);
          title.insertAdjacentHTML('afterbegin', CAL_BIG);
          u.el('span', '', title, 'Event Details');
          const form = u.el('div', 'w2k-form', ins);
          const row = (label, cls) => {
            const r = u.el('div', `w2k-row ${cls || ''}`, form);
            u.el('label', '', r, label);
            return r;
          };
          const drop = (parent, cls) => {
            const d = u.el('div', `w2k-input w2k-drop ${cls || ''}`, parent);
            const text = u.el('span', '', d);
            u.el('i', '', d);
            return text;
          };
          const subject = u.el('div', 'w2k-input', row('Subject:'));
          u.el('div', 'w2k-input', row('Location:'));
          const r1 = row('Start:');
          const startDate = drop(r1);
          const startTime = drop(r1, 'w2k-time');
          const r2 = row('End:');
          const endDate = drop(r2);
          const endTime = drop(r2, 'w2k-time');
          const duration = drop(row('Duration:'));
          const allDay = u.el('div', 'w2k-row w2k-allday', form);
          u.el('i', 'w2k-cb', allDay);
          u.el('span', '', allDay, 'All day event');
          const att = u.el('div', 'w2k-att', form);
          u.el('label', '', att, 'Attendees:');
          const wrap = u.el('div', 'w2k-att-wrap', att);
          const list = u.el('div', 'w2k-att-list', wrap);
          s.people.forEach((name, i) => {
            const r = u.el('div', '', list);
            u.el('i', 'w2k-cb', r);
            const ic = u.el('span', 'w2k-ico', r);
            ic.innerHTML = PERSON;
            u.el('span', '', r, name);
            u.el('small', '', r, `(${TZ[i % 4]})`);
          });
          const btns = u.el('div', 'w2k-att-btns', wrap);
          ['Add...', 'Remove', 'Make Optional'].forEach((label, i) => u.el('div', `w2k-btn ${i ? 'dis' : ''}`, btns, label));
          u.el('label', 'w2k-notes-label', form, 'Notes:');
          u.el('div', 'w2k-notes', form);
          st.w2k = { subject, startDate, startTime, endDate, endTime, duration };
          return ins;
        },
        painted: (base, S) => (st, m) => {
          const { s } = st;
          st.contextTitle.textContent = `Monday, ${s.month} ${8 + (m.browse || 0) * 7}, 2027`;
          const w = st.w2k;
          if (!w) return;
          const e = m.events[s.target];
          const made = !!m.created && !!e;
          const start = made ? e.start : s.open;
          const dur = made ? e.duration : s.duration;
          w.subject.textContent = made ? s.title : '';
          w.startDate.textContent = dateText(s);
          w.endDate.textContent = dateText(s);
          w.startTime.textContent = hm2(start);
          w.endTime.textContent = hm2(start + dur);
          w.duration.textContent = durText(dur);
          if (w.refresh) w.refresh(m);
        },
        rendered: (base, S) => (st) => {
          const { s, f, u, ctx } = st;
          const P = S.P;
          const summary = st.main.querySelector('.outlook-summary');
          if (summary) {
            summary.querySelector('.outlook-summary-title').textContent = s.title;
            summary.querySelector('.outlook-summary-subtitle').textContent = `Mon 8 ${s.month} 2027　 ${f.helpers.time(s.open)} – ${f.helpers.time(s.close)}　 (${s.duration} minutes)`;
          }
          // The header note belongs to the day heading, as in the reference.
          const note = document.querySelector('.ref-instruction');
          if (note && st.context) st.context.appendChild(note);
          const right = st.root.querySelector('.ol-right');
          const taskPanel = document.querySelector('.ref-panel');
          if (taskPanel && right) right.appendChild(taskPanel);
          // Toolbar: live Today / previous / next controls and small classic icons.
          const ribbonToday = document.querySelector('.outlook-group:nth-child(2) .outlook-action:first-child');
          if (ribbonToday) {
            st.today.className = 'outlook-action ol-today-control';
            st.today.replaceChildren(...ribbonToday.childNodes);
            ribbonToday.replaceWith(st.today);
          }
          const slots = document.querySelectorAll('.outlook-group:nth-child(2) .outlook-action');
          [[st.previous, 1, '◀'], [st.next, 2, '▶']].forEach(([btn, i, glyph]) => {
            const slot = slots[i];
            if (!btn || !slot) return;
            btn.className = 'outlook-action ol-arrow-control';
            btn.replaceChildren();
            u.el('b', '', btn, glyph);
            slot.replaceWith(btn);
          });
          const setIcon = (sel, html) => {
            const b = document.querySelector(sel);
            if (b) b.innerHTML = html;
          };
          setIcon('.outlook-group:nth-child(1) .outlook-action:nth-child(2) b', PENCIL);
          setIcon('.outlook-group:nth-child(1) .outlook-action:nth-child(3) b', CROSS);
          setIcon('.outlook-group:nth-child(6) .outlook-action:first-child b', FIND);
          // Bottom of the task area: month grid and the day's meeting list.
          const bottom = u.el('div', 'w2k-bottom', st.main);
          const mini = u.el('div', 'w2k-mini', bottom);
          const mh = u.el('div', 'w2k-mini-head', mini);
          u.el('i', 'w2k-arrow', mh, '◀');
          u.el('b', '', mh, `${s.month} 2027`);
          u.el('i', 'w2k-arrow', mh, '▶');
          const wd = u.el('div', 'w2k-mini-wd', mini);
          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((w) => u.el('span', '', wd, w));
          const cells = u.el('div', 'w2k-mini-grid', mini);
          const off = (s.firstWeekday + 1) % 7;
          const prevLen = LENGTHS[(MONTHS.indexOf(s.month) + 11) % 12] || 30;
          const rows = Math.ceil((off + s.monthDays) / 7);
          for (let k = 0; k < rows * 7; k++) {
            const d = k - off + 1;
            const out = d < 1 || d > s.monthDays;
            u.el('span', out ? 'out' : d === 8 ? 'sel' : '', cells, String(d < 1 ? prevLen + d : d > s.monthDays ? d - s.monthDays : d));
          }
          const list = u.el('div', 'w2k-list', bottom);
          u.el('div', 'w2k-list-title', list, `Monday, ${s.month} 8, 2027`);
          const head = u.el('div', 'w2k-list-head', list);
          ['Time', 'Subject', 'Attendees'].forEach((h) => u.el('span', '', head, h));
          const rowsEl = u.el('div', 'w2k-list-body', list);
          const refresh = (m) => {
            const model = m || ctx.model;
            const key = JSON.stringify(s.events.map((e) => model.events[e.id]));
            if (rowsEl.dataset.key === key) return;
            rowsEl.dataset.key = key;
            rowsEl.replaceChildren();
            const items = s.events.map((e) => ({ e, ev: model.events[e.id], owner: P.eventInfo(st, e.id).owner }));
            items.sort((a, b) => a.ev.start - b.ev.start);
            for (const { e, ev, owner } of items) {
              const r = u.el('div', 'w2k-lrow', rowsEl);
              u.el('span', '', r, `${hm2(ev.start)} – ${hm2(ev.start + ev.duration)}`);
              const sub = u.el('span', 'w2k-sub', r);
              u.el('i', '', sub).innerHTML = CAL;
              u.el('span', '', sub, e.title);
              u.el('span', '', r, s.people[owner] || '');
            }
          };
          st.w2k.refresh = refresh;
          refresh(ctx.model);
        },
      },
    },
  });
})();
