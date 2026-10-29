// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-timeoff-05',
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
        S.P.element(ctx, 'h2', '', title, 'Leave Request Queue (6)');
        const instruction = document.querySelector('.ref-task .ref-instruction');
        if (instruction && document.body.dataset.instruction === 'header') title.appendChild(instruction);
      },
      policy: (base, S) => (ctx) => {
        const { P } = S, { s, main } = S.current;
        const policy = P.element(ctx, 'section', 'qt-policy', main);
        P.element(ctx, 'h3', '', policy, 'Leave Policy Reference');
        P.element(ctx, 'h4', 'qt-policy-label', policy, 'Leave Balances');
        const balance = P.element(ctx, 'table', 'qt-policy-table', policy);
        const head = P.element(ctx, 'tr', '', P.element(ctx, 'thead', '', balance));
        P.element(ctx, 'th', '', head, 'Leave Type');
        P.element(ctx, 'th', '', head, 'Annual Allowance');
        const body = P.element(ctx, 'tbody', '', balance);
        for (const [type, allowance] of [['Vacation', '20 days'], ['Sick Leave', '10 days'], ['Personal Leave', '5 days']]) {
          const row = P.element(ctx, 'tr', '', body);
          P.element(ctx, 'td', '', row, type);
          P.element(ctx, 'td', '', row, allowance);
        }
        P.element(ctx, 'h4', 'qt-policy-label qt-rules-title', policy, 'Key Policy Rules');
        const rules = P.element(ctx, 'ul', 'qt-policy-rules', policy);
        for (const rule of [
          "A request cannot exceed the employee's current balance.",
          'Requests cannot overlap a department blackout period.',
          `Maintain minimum team coverage (${s.policy?.coverage ?? 0} available) during the requested dates.`,
          'Sick leave may be used for consecutive days up to 5.',
          'Personal leave is limited to 1 day per request (up to 5 per year).',
        ]) P.element(ctx, 'li', '', rules, rule);
        P.element(ctx, 'h4', 'qt-policy-label qt-blackout-title', policy, 'Department Blackout Periods');
        const blackouts = P.element(ctx, 'table', 'qt-policy-table qt-blackout-table', policy);
        const blackoutHead = P.element(ctx, 'tr', '', P.element(ctx, 'thead', '', blackouts));
        P.element(ctx, 'th', '', blackoutHead, 'Department');
        P.element(ctx, 'th', '', blackoutHead, 'Blackout Period');
        const blackoutBody = P.element(ctx, 'tbody', '', blackouts);
        const departments = [...new Set((s.requests || []).map((request) => request.team))];
        for (const department of departments) {
          const row = P.element(ctx, 'tr', '', blackoutBody);
          P.element(ctx, 'td', '', row, department);
          const range = s.policy?.blackoutStart && s.policy?.blackoutEnd
            ? `${formatDate(s.policy.blackoutStart)} – ${formatDate(s.policy.blackoutEnd)}`
            : 'None';
          P.element(ctx, 'td', '', row, range);
        }
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
        P.element(ctx, 'div', 'qt-department', row, request.team);
        P.requestEvidence(ctx, row, request);
        P.requestActions(ctx, row, request);
        P.decorated(ctx, row, request, 'request');
      },
      timeoff: (base, S) => (ctx) => {
        const { P } = S, { s, work } = S.current;
        const table = P.element(ctx, 'div', 'qt-request-table', work);
        const header = P.element(ctx, 'div', 'qt-request-head', table);
        for (const label of ['Employee', 'Department', 'Leave Type', 'Dates', 'Days', 'Balance', 'Status']) P.element(ctx, 'b', '', header, label);
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
