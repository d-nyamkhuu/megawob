// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-timezone-01',
  name: 'design',
  split: 'train',
  scenarios: ['timezone'],
  template: 'use-calendar/workspace',
  design: {
    inset: 0,
    colors: ['#0078f5', '#269d3d', '#ff6c0b', '#8050ce'],
    theme: {fg: '#071638', muted: '#36517d', line: '#d8e3ed', panel: '#ffffff', accent: '#0078f5'},
    parts: {
      toolbar: (base, S) => st => {
        const controls = base(st);
        const old = document.querySelector('.crm-summary-actions');
        old.replaceWith(controls.top);
        controls.top.classList.add('crm-summary-actions');
        const day = st.u.el('button', 'crm-view-day', controls.top, 'Day');
        day.addEventListener('click', () => S.P.openMenu(st, 'view'));
        controls.top.insertBefore(day, controls.top.querySelector('.ac-tab'));
        const month = st.u.el('button', 'crm-view-month', controls.top, 'Month');
        month.addEventListener('click', () => S.P.openMenu(st, 'view'));
        const create = st.u.el('button', 'crm-new', controls.top, 'New Event　⌄');
        create.addEventListener('click', () => S.P.openMenu(st, 'view'));
        return controls;
      },
      timeHeader: (base, S) => st => {
        const names = base(st), header = st.main.querySelector('.ac-head');
        const axis = header.querySelector('.ac-axis-head');
        axis.textContent = 'UTC';
        const sun = st.u.el('div', 'ac-day-head crm-weekend-head', header, 'Sun ');
        st.u.el('b', '', sun, '7');
        axis.after(sun);
        const sat = st.u.el('div', 'ac-day-head crm-weekend-head', header, 'Sat ');
        st.u.el('b', '', sat, '13');
        st.u.el('div', 'ac-axis-head crm-secondary-head', header, 'UTC' + (st.s.offset < 0 ? '−' : '+') + st.f.helpers.time(Math.abs(st.s.offset)));
        return names;
      },
      timeGrid: (base, S) => (st, names) => {
        // Measure after the header controls have taken their final responsive size.
        // Gestures, card placement and locate all continue to use this same scale.
        // Keep the ruler scale aligned with the shared calendar's event
        // placement, locate() coordinates, and drag gesture conversion.
        S.D.minuteHeight = .8;
        const nodes = base(st, names);
        const width = nodes.grid.clientWidth, ruler = width * .055;
        const day = (width - ruler * 2) / 7;
        st.root.style.setProperty('--crm-ruler', ruler + 'px');
        st.root.style.setProperty('--crm-day', day + 'px');
        st.root.style.setProperty('--crm-hour', (S.D.minuteHeight * 60) + 'px');
        for (const el of [nodes.columns, nodes.eventLayer]) {
          el.style.left = (ruler + day) + 'px';
          el.style.right = (ruler + day) + 'px';
        }
        st.refs.axis = ruler + day;
        const weekends = st.u.el('div', 'crm-weekends', nodes.grid);
        for (let i = 0; i < 2; i++) {
          const col = st.u.el('div', 'ac-column', weekends);
          col.style.left = (i ? width - ruler - day : ruler) + 'px';
          col.style.width = day + 'px';
          for (let t = st.s.open; t < st.s.close; t += 60) {
            const line = st.u.el('div', 'ac-hour-line', col);
            line.style.top = ((t - st.s.open) * S.D.minuteHeight) + 'px';
          }
        }
        return nodes;
      },
      adjacentEvents: (base, S) => (st, grid) => {
        base(st, grid);
        st.refs.adjacent.style.right = st.refs.columns.style.right;
      },
      scrollbar: (base, S) => (st, wrap, pane, grid) => {
        base(st, wrap, pane, grid);
        st.refs.track.hidden = st.refs.scroll.max() <= 1;
      },
      rulers: (base, S) => (st, grid) => {
        const format = t => {
          const h = ((Math.floor(t / 60) % 24) + 24) % 24, m = ((t % 60) + 60) % 60;
          return (h % 12 || 12) + (m ? ':' + String(m).padStart(2, '0') : '') + (h < 12 ? ' AM' : ' PM');
        };
        for (let zone = 0; zone < 2; zone++) {
          const ruler = st.u.el('div', 'ac-rulers crm-ruler-' + zone, grid);
          for (let t = st.s.open; t < st.s.close; t += 60) {
            const label = st.u.el('div', 'ac-hour-label', ruler, format(t + (zone ? st.s.offset : 0)));
            label.style.top = (8 + (t - st.s.open) * S.D.minuteHeight) + 'px';
          }
        }
      },
      positionEvent: (base, S) => (st, el, e, id) => {
        base(st, el, e, id);
        if (!el) return;
        const format = t => {
          const h = Math.floor(t / 60) % 24;
          return (h % 12 || 12) + ':' + String(t % 60).padStart(2, '0') + (h < 12 ? ' AM' : ' PM');
        };
        el.querySelector('small').textContent = format(e.start) + ' – ' + format(e.start + e.duration);
      },
      painted: (base, S) => (st, model) => {
        base(st, model);
        const offset = model.browse || 0;
        st.period.textContent = st.s.month.slice(0, 3) + ' ' + (7 + offset * 7) + ' – ' + (13 + offset * 7) + ', 2027';
        const weekends = st.main.querySelectorAll('.crm-weekend-head b');
        weekends.forEach((el, i) => { el.textContent = (i ? 13 : 7) + offset * 7; });
        document.querySelector('.crm-month-caption b').textContent = st.s.month + ' 2027';
        const mini = document.querySelector('.crm-month-grid');
        mini.replaceChildren();
        for (const day of ['Su','Mo','Tu','We','Th','Fr','Sa']) st.u.el('span', 'crm-weekday', mini, day);
        for (let i = 0; i < (st.s.firstWeekday + 1) % 7; i++) st.u.el('span', '', mini);
        for (let day = 1; day <= st.s.monthDays; day++) st.u.el('span', day === 8 ? 'crm-today' : '', mini, String(day));
        const list = document.querySelector('.crm-list-body');
        list.replaceChildren();
        const format = t => {
          const h = ((Math.floor(t / 60) % 24) + 24) % 24;
          return (h % 12 || 12) + ':' + String(((t % 60) + 60) % 60).padStart(2, '0') + (h < 12 ? ' AM' : ' PM');
        };
        document.querySelector('.crm-list-head span:nth-child(3)').textContent = 'Time (UTC)';
        document.querySelector('.crm-list-head span:nth-child(4)').textContent = 'Time (UTC' + (st.s.offset < 0 ? '−' : '+') + st.f.helpers.time(Math.abs(st.s.offset)) + ')';
        const events = st.s.events.filter(e => e.id !== st.s.target || model.created).slice();
        if (model.created && !events.some(e => e.id === st.s.target)) events.push({id: st.s.target, title: st.s.title, tone: 0});
        events.sort((a,b) => model.events[a.id].day - model.events[b.id].day || model.events[a.id].start - model.events[b.id].start);
        for (const event of events) {
          const value = model.events[event.id];
          const row = st.u.el('div', 'crm-list-row', list);
          row.style.setProperty('--tone', S.D.colors[event.tone % 4]);
          const title = st.u.el('b', '', row);
          st.u.el('i', '', title);st.u.el('span', '', title, event.title);
          const owner = event.owner === undefined ? event.tone % st.s.people.length : event.owner;
          const attendees = [st.s.people[owner], st.s.people[(owner + 1) % st.s.people.length]].join(', ');
          const date = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][((value.day - 8) % 7 + 7) % 7] + ', ' + st.s.month.slice(0, 3) + ' ' + value.day + ', 2027';
          for (const text of [date, format(value.start), format(value.start + st.s.offset), value.duration === 60 ? '1 hr' : value.duration + ' min', attendees, st.roomNames.get(event.id) || st.s.room]) st.u.el('span', '', row, text);
        }
      },
    },
  },
});
