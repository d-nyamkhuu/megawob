// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-timeoff-03',
  name: 'design',
  split: 'train',
  scenarios: ['timeoff'],
  template: 'use-hr/workspace',
  design: {
    inset: '0px', radius: '0px', font: '16px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif',
    parts: {
      icon: (base) => (ctx, parent, name) => {
        if (!['people', 'calendar'].includes(name)) return base(ctx, parent, name);
        const svg = ctx.util.svg('svg', { class: 'hr-svg', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, parent);
        svg.innerHTML = name === 'people'
          ? '<g fill="currentColor" stroke="none"><circle cx="12" cy="6" r="3.5"/><circle cx="4.5" cy="9" r="2.8"/><circle cx="19.5" cy="9" r="2.8"/><path d="M6 20v-2a6 6 0 0 1 12 0v2ZM0 20v-2a5 5 0 0 1 7-4.6A8 8 0 0 0 4 20Zm24 0h-4a8 8 0 0 0-3-6.6A5 5 0 0 1 24 18Z"/></g>'
          : '<path d="M3 5h18v17H3ZM3 9h18M7 2v5M17 2v5"/>';
        return svg;
      },
      policy: () => () => {},
      timeoff: (base, S) => (ctx) => {
        const { P } = S;
        const state = S.current, { s, ui, work } = state;
        const el = (tag, cls, parent, text) => P.element(ctx, tag, cls, parent, text);
        const date = (value, year = false) => {
          const [y, m, d] = value.split('-').map(Number);
          return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1] + ' ' + d + (year ? ', ' + y : '');
        };
        const range = (r) => r.start === r.end ? date(r.start, true) : date(r.start) + ' – ' + date(r.end, true);
        const selected = s.requests.find(r => r.id === ui.selectedRequest) || s.requests[0];
        const layout = el('div', 'leave-layout', work);
        const list = el('section', 'leave-list', layout);
        const head = el('div', 'leave-list-heading', list);
        el('b', '', head, 'Leave Requests (' + s.requests.length + ')');
        el('span', '', head, 'Sort by Date ⌄');
        const rows = P.pane(ctx, list, 'queue', 'leave-list-rows');
        for (const request of s.requests) {
          const row = el('article', 'leave-list-row' + (request === selected ? ' is-selected' : ''), rows);
          row.tabIndex = 0;
          row.setAttribute('aria-label', 'Review ' + request.name);
          const choose = () => { ui.selectedRequest = request.id; P.draw(ctx); };
          row.addEventListener('click', (e) => { if (!e.target.closest('button')) choose(); });
          row.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target === row) choose(); });
          P.avatar(ctx, row, request);
          const text = el('div', 'leave-list-person', row);
          el('b', '', text, request.name);
          el('div', '', text, request.team);
          el('div', '', text, range(request));
          const tail = el('div', 'leave-list-tail', row);
          el('b', '', tail, request.days + (request.days === 1 ? ' day' : ' days'));
          P.requestActions(ctx, tail, request);
        }
        const detail = el('section', 'leave-detail', layout);
        const upper = el('div', 'leave-upper', detail);
        const facts = el('section', 'leave-facts', upper);
        const identity = el('div', 'leave-identity', facts);
        P.avatar(ctx, identity, selected);
        const who = el('div', '', identity);
        el('h1', '', who, selected.name);
        el('div', 'leave-subtitle', who, selected.team + ' · ' + selected.note);
        const summary = el('div', 'leave-summary', facts);
        for (const [label, value, sub] of [
          ['Request dates', range(selected), selected.days + (selected.days === 1 ? ' day' : ' days')],
          ['Leave type', 'Paid Time Off', ''],
          ['Current balance', selected.balance + ' days available', '(after request: ' + (selected.balance - selected.days) + ' days)']
        ]) {
          const cell = el('div', '', summary);
          el('div', 'leave-label', cell, label);
          el('div', 'leave-value', cell, value);
          if (sub) el('div', 'leave-secondary', cell, sub);
        }
        const forecast = el('section', 'leave-forecast', facts);
        const forecastHead = el('h2', '', forecast, 'Team coverage forecast');
        el('span', 'leave-help', forecastHead, '?');
        const table = el('table', 'leave-table', forecast);
        const tr = el('tr', '', el('thead', '', table));
        for (const label of ['Date', 'Team members in office', 'Required', 'Coverage']) el('th', '', tr, label);
        const tbody = el('tbody', '', table);
        const dates = selected.start === selected.end ? [selected.start] : [selected.start, selected.end];
        for (const day of dates) {
          const line = el('tr', '', tbody);
          el('td', '', line, date(day));
          el('td', '', line, selected.coverage);
          el('td', '', line, s.policy.coverage);
          el('td', selected.coverage >= s.policy.coverage ? 'coverage-pass' : 'coverage-low', line, selected.coverage >= s.policy.coverage ? 'Meets' : 'Below');
        }
        const policy = el('section', 'leave-rules', upper);
        el('h2', '', policy, 'Leave Policy');
        const rule = (kind, icon, title, body) => {
          const row = el('div', 'leave-rule', policy);
          const symbol = el('div', 'leave-rule-icon ' + kind, row);
          P.icon(ctx, symbol, icon);
          const text = el('div', 'leave-rule-text', row);
          el('h3', '', text, title);
          el('p', '', text, body);
          return text;
        };
        rule('blue', 'people', 'Team Coverage Requirement', 'At least ' + s.policy.coverage + ' teammates must remain available each day during the requested leave.');
        const blackout = rule('red', 'close', 'Blackout Dates', 'No time off can be taken during company blackout dates.');
        el('div', 'leave-blackout', blackout, '●  ' + date(s.policy.blackoutStart) + ' – ' + date(s.policy.blackoutEnd, true));
        rule('purple', 'calendar', 'Leave Balance Requirement', 'Available balance must cover all requested days.');
        const colleagues = el('section', 'leave-colleagues', detail);
        el('h2', '', colleagues, 'Colleagues also requesting leave');
        const otherTable = el('table', 'leave-table', colleagues);
        const otherHead = el('tr', '', el('thead', '', otherTable));
        for (const label of ['Name', 'Team', 'Dates', 'Days']) el('th', '', otherHead, label);
        const otherBody = el('tbody', '', otherTable);
        for (const request of s.requests.filter(r => r !== selected).slice(0, 2)) {
          const line = el('tr', '', otherBody);
          for (const value of [request.name, request.team, range(request), request.days]) el('td', '', line, value);
        }
        const decision = el('div', 'leave-decision', detail);
        // Keep the shared decision bindings and oracle keys on the selected detail controls.
        P.requestActions(ctx, decision, selected);
        for (const key of ['decision/' + selected.id, 'decision/' + selected.id + '/Approved', 'decision/' + selected.id + '/Denied']) S.refs[key].pane = null;
        const buttons = decision.querySelectorAll('button');
        buttons[0].classList.add('leave-approve');
        buttons[0].querySelector('span').textContent = 'Approve Request';
        buttons[1].querySelector('span').textContent = 'Deny Request';
        const inspector = document.querySelector('.hr-inspector');
        if (inspector) {
          const fields = inspector.querySelectorAll('.hr-inspector-value');
          if (fields[1]) fields[1].textContent = selected.team;
        }
      },
    },
  },
});
