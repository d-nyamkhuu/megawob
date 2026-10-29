// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-timeoff-01',
  name: 'design',
  split: 'train',
  scenarios: ['timeoff'],
  template: 'use-hr/workspace',
  design: {
    font: '16px/1.3 Arial,Helvetica,sans-serif',
    panel: '#f3f5f7', foreground: '#111722', line: '#a9b6c4',
    accent: '#3978bd', muted: '#505967', background: '#e3e8ee',
    radius: '3px', inset: '0px',
    parts: {
      brand: () => () => {},
      sidebar: () => () => {},
      tabs: () => () => {},
      heading: (base, S) => (ctx) => {
        const title = S.P.element(ctx, 'div', 'qt-sheet-title', S.current.main);
        S.P.element(ctx, 'h2', '', title, 'Leave Requests');
        const instruction = document.querySelector('.ref-task .ref-instruction');
        if (instruction) title.appendChild(instruction);
      },
      policy: (base, S) => (ctx) => {
        const { P } = S, { s, main } = S.current;
        const policy = P.element(ctx, 'section', 'qt-policy', main);
        P.element(ctx, 'h3', '', policy, 'Leave Policy');
        const columns = P.element(ctx, 'div', 'qt-policy-columns', policy);
        const left = P.element(ctx, 'div', '', columns);
        P.element(ctx, 'b', '', left, 'Team Coverage Requirement');
        P.element(ctx, 'p', '', left, `At least ${s.policy?.coverage ?? 0} team members must be working each day.`);
        P.element(ctx, 'b', '', left, 'Blackout Dates');
        P.element(ctx, 'p', '', left, `${s.policy?.blackoutStart ? formatDate(s.policy.blackoutStart) : '—'} – ${s.policy?.blackoutEnd ? formatDate(s.policy.blackoutEnd) : '—'} (no time off allowed).`);
        const right = P.element(ctx, 'div', '', columns);
        P.element(ctx, 'b', '', right, 'Accrual & Balances');
        P.element(ctx, 'p', '', right, 'Vacation: 20 days per year (max 30).');
        P.element(ctx, 'p', '', right, 'Sick Leave: 10 days per year (no carryover).');
        P.element(ctx, 'p', '', right, 'Personal Leave: 3 days per year.');
        const rule = P.element(ctx, 'small', 'qt-balance-rule', policy, 'Available balance must cover all requested days.');
        rule.title = 'Each request has an independent coverage forecast.';
      },
      requestEvidence: (base, S) => (ctx, row, request) => {
        const { P } = S;
        P.element(ctx, 'div', 'qt-leave-type', row, request.note);
        const dates = P.element(ctx, 'div', 'qt-request-dates', row);
        P.element(ctx, 'span', '', dates, formatDate(request.start) + ' –');
        P.element(ctx, 'span', '', dates, formatDate(request.end));
        P.element(ctx, 'div', '', row, request.days + ' days');
        P.element(ctx, 'div', '', row, request.balance + ' days');
        const coverage = P.element(ctx, 'div', 'qt-coverage', row);
        const dot = P.element(ctx, 'i', '', coverage);
        dot.classList.toggle('low', request.coverage < (S.current?.s?.policy?.coverage ?? 0));
        P.element(ctx, 'span', '', coverage, request.coverage + ' of 5 working');
      },
      request: (base, S) => (ctx, parent, request) => {
        const { P } = S;
        const row = P.element(ctx, 'article', 'qt-request-row', parent);
        const person = P.element(ctx, 'div', 'qt-request-person', row);
        P.element(ctx, 'strong', '', person, request.name).title = request.name;
        P.element(ctx, 'span', '', person, request.team);
        P.requestEvidence(ctx, row, request);
        P.requestActions(ctx, row, request);
        P.decorated(ctx, row, request, 'request');
      },
      timeoff: (base, S) => (ctx) => {
        const { P } = S, { s, work } = S.current;
        const table = P.element(ctx, 'div', 'qt-request-table', work);
        const header = P.element(ctx, 'div', 'qt-request-head', table);
        for (const label of ['Employee', 'Leave Type', 'Dates', 'Requested', 'Available Balance', 'Team Coverage', 'Decision']) P.element(ctx, 'b', '', header, label);
        const queue = P.pane(ctx, table, 'queue', 'qt-request-queue');
        const visible = s.requests.filter((request) => P.match(ctx, request));
        if (!visible.length) P.empty(ctx, queue, 'No requests match this search');
        for (const request of visible) P.request(ctx, queue, request);
      },
    },
  },
});

function formatDate(value) {
  const [year, month, day] = value.split('-');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month) - 1] + ' ' + Number(day) + ', ' + year;
}
