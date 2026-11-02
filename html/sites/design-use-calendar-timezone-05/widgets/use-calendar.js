// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-timezone-05',
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
        const team = st.u.el('button', 'crm-view-team', controls.top, 'Team');
        team.addEventListener('click', () => S.P.openMenu(st, 'view'));
        const picker = st.u.el('button', 'crm-date-picker', controls.top);
        picker.type = 'button';
        picker.setAttribute('aria-label', 'Choose date');
        picker.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v16H5zM8 3v4m8-4v4M5 9h14M8 12h2m3 0h2m-7 3h2m3 0h2"/></svg>';
        picker.addEventListener('click', () => S.P.openMenu(st, 'view'));
        const create = st.u.el('button', 'crm-new', controls.top, 'New Event　⌄');
        create.addEventListener('click', () => S.P.openMenu(st, 'view'));
        const week = controls.top.querySelector('.ac-tab');
        if (week) week.classList.add('crm-week-current');
        return controls;
      },
      timeHeader: (base, S) => st => {
        const names = base(st), header = st.main.querySelector('.ac-head');
        const axis = header.querySelector('.ac-axis-head');
        axis.textContent = 'UTC';
        const secondary = st.u.el('div', 'ac-axis-head crm-secondary-head', header, 'UTC' + (st.s.offset < 0 ? '−' : '+') + st.f.helpers.time(Math.abs(st.s.offset)));
        axis.after(secondary);
        return names;
      },
      timeGrid: (base, S) => (st, names) => {
        // Measure after the header controls have taken their final responsive size.
        // Gestures, card placement and locate all continue to use this same scale.
        // Keep the ruler scale aligned with the shared calendar's event
        // placement, locate() coordinates, and drag gesture conversion.
        S.D.minuteHeight = .8;
        const nodes = base(st, names);
        const width = nodes.grid.clientWidth, ruler = width * .07, zoneRuler = width * .12;
        const axis = ruler + zoneRuler;
        const day = (width - axis) / 5;
        st.root.style.setProperty('--crm-ruler', ruler + 'px');
        st.root.style.setProperty('--crm-zone-ruler', zoneRuler + 'px');
        st.root.style.setProperty('--crm-day', day + 'px');
        st.root.style.setProperty('--crm-hour', (S.D.minuteHeight * 60) + 'px');
        for (const el of [nodes.columns, nodes.eventLayer]) {
          el.style.left = axis + 'px';
          el.style.right = '0px';
        }
        st.refs.axis = axis;
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
          return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
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
          const h = ((Math.floor(t / 60) % 24) + 24) % 24;
          return String(h).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
        };
        el.querySelector('small').textContent = format(e.start) + ' – ' + format(e.start + e.duration);
      },
      painted: (base, S) => (st, model) => {
        base(st, model);
        const offset = model.browse || 0;
        const selected = model.selected || st.s.target;
        const draft = model.events[selected];
        const exists = selected !== st.s.target || model.created;
        if (draft) {
          const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][((st.s.firstWeekday + draft.day - 1) % 7 + 7) % 7];
          document.querySelector('.crm-date-value').textContent = weekday + ', ' + st.s.month.slice(0, 3) + ' ' + draft.day + ', 2027';
          document.querySelector('.crm-start-value').textContent = st.f.helpers.time(draft.start + st.s.offset);
          const hours = Math.floor(draft.duration / 60), minutes = draft.duration % 60;
          document.querySelector('.crm-duration-value').textContent = (hours ? hours + ' hour' + (hours === 1 ? '' : 's') : '') + (hours && minutes ? ' ' : '') + (minutes ? minutes + ' minutes' : '');
          document.querySelector('.crm-title-value').textContent = exists ? S.P.eventInfo(st, selected).title : '';
          document.querySelector('.crm-location-value').textContent = exists ? (selected === st.s.target ? st.s.room : st.roomNames.get(selected) || '') : '';
        }
        const zone = 'UTC' + (st.s.offset < 0 ? '−' : '+') + st.f.helpers.time(Math.abs(st.s.offset));
        const zoneName = st.s.offset === 330 ? ' India Standard Time' : st.s.offset === -210 ? ' Newfoundland Standard Time' : '';
        document.querySelector('.crm-zone-value').textContent = '(' + zone + ')' + zoneName;
        document.querySelector('.crm-big-title strong').textContent = st.s.month + ' 2027';
        st.refs.dayHeads.forEach((head, index) => { head.querySelector('b').textContent = st.s.month.slice(0, 3) + ' ' + (8 + index + offset * 7); });
        st.period.textContent = st.s.month.slice(0, 3) + ' ' + (7 + offset * 7) + ' – ' + (13 + offset * 7) + ', 2027';
        document.querySelectorAll('.crm-month-caption b').forEach(caption => { caption.textContent = st.s.month + ' 2027'; });
        for (const mini of document.querySelectorAll('.crm-month-grid')) {
        mini.replaceChildren();
        for (const day of ['M','T','W','T','F','S','S']) st.u.el('span', 'crm-weekday', mini, day);
        for (let i = 0; i < st.s.firstWeekday; i++) st.u.el('span', '', mini);
        for (let day = 1; day <= st.s.monthDays; day++) st.u.el('span', day === (draft ? draft.day : 9) ? 'crm-today' : '', mini, String(day));
        }
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
