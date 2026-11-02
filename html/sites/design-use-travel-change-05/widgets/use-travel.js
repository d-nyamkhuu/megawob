// Portal defaults cover both date and seat changes.
env.widget({
  task: 'use-travel',
  site: 'design-use-travel-change-05',
  name: 'design',
  split: 'train',
  scenarios: ['change'],
  template: 'use-travel/portal',
  design: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Segoe UI", Arial, sans-serif',
    accent: '#1a73e8', panel: '#f6f7f9', foreground: '#1d1d1f',
    muted: '#6b7280', line: '#e1e4e9', summaryWidth: 0,
    parts: {
      frame: (base, S) => (ctx) => {
        const P = S.P;
        S.app = P.app(ctx);
        const IC = {
          cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4M8 14h2M14 14h2"/>',
          seat: '<path d="M7 3a2 2 0 0 0-2 2l1.5 10a4 4 0 0 0 4 3H18a2 2 0 0 0 0-4h-6a2 2 0 0 1-2-2L9 5a2 2 0 0 0-2-2zM9 18l-1 4M16 18l2 4"/>',
          person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6z"/>',
          plane: '<path d="M21 10.5h-6l-5-8H7.5l3 8H5l-2-3H1l2 4.5-2 4.5h2l2-3h5.5l-3 8H10l5-8h6a1.5 1.5 0 0 0 0-3z"/>',
          bag: '<path d="M8 7V4a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 4v3"/><rect x="2.5" y="7" width="19" height="15" rx="2.5" fill="currentColor" stroke="none"/><path d="M7 7v15M17 7v15" stroke="#f4f7fc" stroke-width="1.3"/>',
          compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
          bed: '<path d="M2 4v16M22 13v7M2 16h20"/><path d="M11 8h7a4 4 0 0 1 4 4v2H11z" fill="currentColor"/><rect x="4" y="8" width="5" height="5" rx="1.5" fill="currentColor"/>',
          car: '<path d="M4 16v-4l2-5h12l2 5v4zM4 16v3h3v-3M17 16v3h3v-3M7 12h10"/>',
          tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',
          bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/>',
          heart: '<path d="M12 20S3 14 3 8.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 1.5C21 14 12 20 12 20z"/>',
          book: '<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z M12 6v14"/>',
          search: '<circle cx="11" cy="11" r="7"/><path d="M16 16l5 5"/>',
          home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
          dots: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
          ticket: '<path d="M3 8l15-5 3 7a3 3 0 0 0-1 5l-1 4-16 2-1-7a3 3 0 0 0 1-6zM13 6l3 12M7 11l3-1M7 15l4-1"/>',
          chev: '<path d="M9 5l7 7-7 7"/>',
          info: '<circle cx="12" cy="12" r="10" fill="#1a73e8" stroke="none"/><path d="M12 11v6M12 7.5v.5" stroke="#fff" stroke-width="2.4"/>',
          arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
        };
        S.ic = (name, cls) => {
          const e = P.el('span', `mx-ic ${cls || ''}`);
          e.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${IC[name]}</svg>`;
          return e;
        };
        const side = P.el('aside', 'mx-sidebar', S.app);
        const navList = (items, sel) => {
          for (const [ic, label] of items) {
            const row = P.el('div', `mx-sb-item${label === sel ? ' mx-sb-sel' : ''}`, side);
            row.append(S.ic(ic));
            P.el('span', '', row, label);
          }
        };
        navList([['bag', 'Trips'], ['compass', 'Explore'], ['plane', 'Flights'], ['bed', 'Stays'], ['car', 'Cars'], ['tag', 'Deals']], 'Trips');
        P.el('div', 'mx-sb-rule', side);
        navList([['bell', 'Price Alerts'], ['heart', 'Saved'], ['book', 'Travel Guides']]);
        const bg = P.el('div', 'mx-bg', S.app);
        P.el('h1', 'mx-bg-title', bg, 'My Trips');
        const tabs = P.el('div', 'mx-bg-tabs', bg);
        P.el('span', 'mx-on', tabs, 'Upcoming');
        P.el('span', '', tabs, 'Past Trips');
        P.el('span', '', tabs, 'Canceled');
        const cards = P.el('div', 'mx-bg-cards', bg);
        for (const [city, dates, k] of [['Seoul', 'Dec 20 – Dec 27, 2027', 'seoul'], ['Tokyo', 'Mar 14 – Mar 20, 2028', 'tokyo'], ['Singapore', 'Jun 5 – Jun 12, 2028', 'sing']]) {
          const card = P.el('div', 'mx-card', cards);
          P.el('div', `mx-card-img mx-img-${k}`, card);
          P.el('b', '', card, city);
          P.el('span', '', card, dates);
        }
        const dock = P.el('nav', 'mx-dock', S.app);
        for (const [ic, label] of [['home', 'Home'], ['search', 'Search'], ['bag', 'Trips'], ['bed', 'Stays'], ['dots', 'More']]) {
          const it = P.el('div', `mx-dock-item${label === 'Home' ? ' mx-dock-on' : ''}`, dock);
          it.append(S.ic(ic));
          P.el('span', '', it, label);
        }
        S.progress = P.el('div', 'at-progress', S.app);
        S.content = P.el('div', 'at-content', S.app);
        S.footer = P.el('footer', 'at-footer', S.app);
      },
      progress: (base, S) => (m) => {
        S.app.classList.toggle('mx-managing', m.page === 'manage');
      },
      worknav: () => () => {},
      passengerRail: () => () => {},
      seats: (base, S) => (main, m) => {
        base(main, m);
        S.pane.classList.add('mx-fit-editor');
      },
      review: (base, S) => (main, m) => {
        base(main, m);
        S.pane.classList.add('mx-fit-editor');
      },
      painted: (base, S) => (ctx) => {
        base(ctx);
        const pane = S.pane;
        if (!pane || !pane.classList.contains('mx-fit-editor')) return;
        const layout = S.P.el('div', 'mx-editor-layout');
        while (pane.firstChild) layout.append(pane.firstChild);
        pane.append(layout);
        const available = pane.clientHeight - parseFloat(getComputedStyle(pane).paddingTop) - parseFloat(getComputedStyle(pane).paddingBottom);
        const scale = Math.min(1, available / Math.max(1, layout.scrollHeight));
        layout.style.zoom = String(scale);
        layout.style.width = '100%';
      },
      manage: (base, S) => (main, m) => {
        const P = S.P, s = S.spec, F = env.taskDef;
        const date = `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][env.content.dayOfWeek(m.date)]}, ${F.helpers.fmtDate(m.date)}`;
        P.el('h2', 'mx-heading', main, 'Manage Booking');
        const pane = P.newPane(main);
        const form = P.el('div', 'mx-booking-form', pane);
        const identity = P.el('div', 'mx-identity', form);
        for (const [label, value] of [['Booking reference', s.reference], ['Passenger', s.passenger]]) {
          const cell = P.el('div', 'mx-idcell', identity);
          P.el('div', 'mx-label', cell, label);
          P.el('div', 'mx-value mx-input-value', cell, value);
        }
        const fl = S.details.flight;
        const card = P.el('div', 'mx-flightcard', form);
        const air = P.el('div', 'mx-air', card);
        const logo = P.el('i', 'mx-logo', air);
        logo.innerHTML = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#fff"/><path d="M3 20a17 17 0 1 1 34 0c-1-7-8-10-13-5-4 4-4 10-11 10-5 0-9-2-10-5z" fill="#ed2636"/><path d="M37 20A17 17 0 0 1 3 20c1 7 8 10 13 5 4-4 4-10 11-10 5 0 9 2 10 5z" fill="#124c9e"/></svg>';
        const at = P.el('div', '', air);
        P.el('b', '', at, fl.airline || fl.name || fl.no.split(' ')[0]);
        P.el('span', '', at, fl.no);
        const stop = (iata, city, time, cls) => {
          const b = P.el('div', `mx-stop ${cls}`, card);
          P.el('b', '', b, iata); P.el('span', '', b, city); P.el('strong', '', b, time);
        };
        stop(s.origin.iata, s.origin.city, '10:35', 'mx-from');
        card.append(S.ic('plane', 'mx-flyer'));
        stop(s.dest.iata, s.dest.city, '06:50', 'mx-to');
        const schedule = P.el('div', 'mx-schedule', form);
        const seatClass = 'Economy';
        for (const [ic, label, value, sub] of [['cal', 'Departure date', F.helpers.fmtDate(m.date), ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][env.content.dayOfWeek(m.date)]], ['seat', 'Seat', m.seat, seatClass]]) {
          const cell = P.el('div', 'mx-sched-cell', schedule);
          const badge = P.el('span', 'mx-badge', cell);
          badge.append(S.ic(ic));
          const t = P.el('div', '', cell);
          P.el('span', 'mx-label', t, label);
          P.el('div', 'mx-value', t, value);
          P.el('span', 'mx-sub', t, sub);
        }
        P.el('h3', 'mx-update-title', pane, 'Update booking');
        const list = P.el('div', 'mx-actions', pane);
        const edit = P.button(list, 'Edit Booking', {control:'edit'}, 'mx-edit', true);
        const act = (cls, ic, title, sub) => {
          const row = P.el('div', cls, list);
          const badge = P.el('span', 'mx-badge', row);
          badge.append(S.ic(ic));
          const t = P.el('div', '', row);
          P.el('b', '', t, title); P.el('span', '', t, sub);
          row.append(S.ic('chev', 'mx-chev'));
          return row;
        };
        if (edit) {
          const badge = P.el('span', 'mx-badge', edit);
          badge.append(S.ic('cal'));
          edit.prepend(badge);
          P.el('span', 'mx-edit-sub', edit, 'Find available dates on this flight');
          edit.append(S.ic('chev', 'mx-chev'));
        }
        act('mx-act', 'seat', 'Change seat', 'View seat map and choose a different seat');
        act('mx-act', 'person', 'Edit passenger details', 'Update name, contact information or frequent flyer number');
      },
      sidepanel: (base, S) => (m) => {
        const P = S.P, s = S.spec, d = S.details, F = env.taskDef;
        const side = P.el('div', 'mx-inspector', S.content);
        side.setAttribute('role', 'complementary');
        side.setAttribute('aria-label', 'Passenger & Booking Details');
        const note = S.app.motifTaskNote || document.querySelector('.ref-panel');
        if (note) {
          S.app.motifTaskNote = note;
          side.append(note);
        }
        const head = P.el('h2', 'mx-heading mx-help-head', side);
        head.append(S.ic('info', 'mx-info'));
        P.el('span', '', head, 'Help & tips');
        P.el('h3', 'mx-help-title', side, 'Changing your booking');
        P.el('p', 'mx-help-text', side, 'You can update your flight date, seat or passenger details for eligible bookings. Availability and fare differences are shown before you confirm any changes.');
        P.el('div', 'mx-help-rule', side);
        P.el('h3', 'mx-help-title', side, 'Your current booking');
        const date = F.helpers.fmtDate(m.date);
        const list = P.el('div', 'mx-cur', side);
        for (const [ic, label, value, sub] of [
          ['cal', 'Booking reference', s.reference],
          ['person', 'Passenger', s.passenger],
          ['plane', 'Route', `${s.origin.iata}  →  ${s.dest.iata}`, `${s.origin.city} to ${s.dest.city}`],
          ['cal', 'Departure date', date],
          ['seat', 'Seat', `${m.seat} (Economy)`],
          ['ticket', 'Airline', `${d.flight.airline || d.flight.name || ''}${d.flight.airline || d.flight.name ? ' (' + d.flight.no + ')' : d.flight.no}`]]) {
          const row = P.el('div', 'mx-cur-row', list);
          row.append(S.ic(ic));
          const t = P.el('div', '', row);
          P.el('span', '', t, label); P.el('b', '', t, value);
          if (sub) P.el('span', '', t, sub);
        }
      },
      footer: (base, S) => (m) => {
        if (m.page !== 'manage') base(m);
      },
    },
  },
});
