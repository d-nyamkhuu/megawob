// Native desktop design on the shared HR workspace; task mechanics stay in the template.
function cadDepartment(person, geo) {
  let boss = person;
  while (geo.parents[boss.id] && geo.parents[boss.id] !== 'p0') boss = geo.byId[geo.parents[boss.id]];
  return person.team || (boss.id === 'p0' ? 'Executive' : boss.role.replace(/\b(manager|director|officer|chief|vp)\b/ig, '').trim());
}
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-orgchart-01',
  name: 'design',
  split: 'train',
  scenarios: ['orgchart'],
  template: 'use-hr/workspace',
  design: {
      inset: '0px', radius: '0px', sidebarWidth: '142px', railWidthAt: 0,
      font: '16px/1.35 "Segoe UI", Tahoma, Arial, sans-serif',
      panel: '#0c293c', foreground: '#e0edf9', line: '#356581', accent: '#72d4f8',
      muted: '#a6c7dd', background: '#092333',
      tree: { rootX: 419, rootY: 54, columnX: 62, columnGap: 350, columnY: 201,
        depthOffset: 28, rowGap: 106, bottom: 24, minWidth: 1070, padding: 48,
        minHeight: 720, cardWidth: 246, cardHeight: 84, busY: 173,
        connectorGap: 22, gripX: 45, gripY: 28 },
    parts: {
      icon: (base, S) => (ctx, parent, name) => {
        const svg = base(ctx, parent, name);
        const filled = {
          people: '<circle cx="9" cy="7" r="4"/><circle cx="18" cy="8" r="3"/><path d="M1 22v-4a8 8 0 0 1 16 0v4ZM18 13a7 7 0 0 1 6 7v2h-5v-4a10 10 0 0 0-1-5Z"/>',
          home: '<path d="m1 11 11-10 11 10h-4v12h-5v-8h-4v8H5V11Z"/>',
          tree: '<rect x="8" y="1" width="8" height="6"/><path d="M11 6h2v7h8v4h-2v-2h-6v2h-2v-2H5v2H3v-4h8Z"/><rect x="1" y="17" width="7" height="6"/><rect x="9" y="17" width="6" height="6"/><rect x="17" y="17" width="7" height="6"/>',
          case: '<path d="M8 2h8v4h6v6H2V6h6Zm2 2v2h4V4ZM1 14h9v2h4v-2h9v7H1Z"/>',
          file: '<path d="M3 1h14l4 4v18H3Zm3 6v2h12V7Zm0 5v2h9v-2Zm0 5v2h11v-2Z"/>',
          chart: '<rect x="2" y="15" width="5" height="8"/><rect x="9" y="8" width="5" height="15"/><rect x="16" y="1" width="5" height="22"/>',
        };
        if (filled[name]) { svg.innerHTML = filled[name]; svg.classList.add('cad-filledicon'); }
        return svg;
      },
      brand: () => () => {},
      sidebar: (base, S) => (ctx) => {
        const { P } = S, { sidebar } = S.current;
        for (const [glyph, label] of [['home', 'Home'], ['people', 'People'], ['case', 'Recruiting'],
          ['file', 'Onboarding'], ['calendar', 'Time Off'], ['chart', 'Performance'], ['chart', 'Reports'], ['gear', 'Admin']]) {
          P.navItem(ctx, sidebar, glyph, label, label === 'People' ? 'orgchart' : label);
        }
      },
      heading: (base, S) => (ctx) => {
        const { P } = S;
        const title = P.element(ctx, 'div', 'cad-charttitle', S.current.main);
        P.icon(ctx, title, 'tree');
        P.element(ctx, 'h2', '', title, 'Organization Chart');
      },
      tabs: () => () => {},
      toolbar: (base, S) => (ctx) => {
        const { P } = S, state = S.current;
        const toolbar = P.element(ctx, 'div', 'hr-toolbar cad-charttools', state.main);
        const box = P.element(ctx, 'div', 'hr-search', toolbar); P.icon(ctx, box, 'search');
        const search = state.search = P.element(ctx, 'input', '', box);
        search.type = 'search'; search.placeholder = 'Search people by name, title, or department...';
        search.setAttribute('aria-label', search.placeholder);
        search.addEventListener('input', () => { state.ui.query = search.value.trim().toLowerCase(); P.draw(ctx); });
        P.button(ctx, toolbar, 'All Departments  ▾', () => P.notice(ctx, 'Departments', ['All departments are included in this view.']), 'cad-departments');
        P.element(ctx, 'span', 'hr-spacer', toolbar);
        const fit = P.button(ctx, toolbar, '', () => { state.ui.collapsed.clear(); P.draw(ctx); }, 'cad-fit');
        fit.title = 'Fit chart'; fit.setAttribute('aria-label', 'Fit chart');
        ctx.util.svg('svg', { class: 'hr-svg', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, fit).innerHTML = '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M3 3l6 6m12-6-6 6m6 12-6-6M3 21l6-6"/>';
        const zoom = P.element(ctx, 'div', 'cad-zoom', toolbar);
        P.button(ctx, zoom, '−', () => P.notice(ctx, 'Chart view', ['Use the scrollbars to explore the reporting tree.']));
        P.element(ctx, 'span', '', zoom, '100%');
        P.button(ctx, zoom, '+', () => P.notice(ctx, 'Chart view', ['Use the scrollbars to explore the reporting tree.']));
        const expand = P.iconButton(ctx, toolbar, 'tree', 'Expand all', () => { state.ui.collapsed.clear(); P.draw(ctx); });
        expand.classList.add('cad-expand');
      },
      avatar: (base, S) => (ctx, parent, person) => {
        const p = S.P.element(ctx, 'span', 'hr-avatar cad-portrait', parent);
        const id = String(person.id || 'p0'), index = Number(id.replace(/\D/g, '')) || 0;
        const photo = (id.startsWith('d') ? index + 8 : [0, 1, 2, 7, 4, 5, 6, 8, 10][index] ?? index) % 16;
        p.style.setProperty('background-position', `${(photo % 4) * 100 / 3}% ${Math.floor(photo / 4) * 100 / 3}%`, 'important');
        p.setAttribute('aria-hidden', 'true');
        return p;
      },
      orgCard: (base, S) => (ctx, canvas, person, position, count, editable) => {
        const card = base(ctx, canvas, person, position, count, editable);
        const { s, ui, geo } = S.current;
        const selected = ui.inspected || s.people.find(p => p.id !== 'p0' && !Object.values(geo.parents).includes(p.id))?.id;
        card.classList.toggle('cad-selected', person.id === selected);
        card.dataset.person = person.id;
        card.classList.toggle('cad-topmanager', S.geo.parents[person.id] === 'p0');
        const meta = card.querySelector('.hr-orgmeta'); meta.replaceChildren();
        S.P.element(ctx, 'span', 'cad-team', meta, cadDepartment(person, geo));
        if (count) S.P.element(ctx, 'span', 'cad-count', meta, String(count));
        return card;
      },
      orgConnectors: (base, S) => (ctx, canvas, geo) => {
        const svg = ctx.util.svg('svg', { class: 'hr-connectors', 'aria-hidden': 'true' }, canvas);
        const { D } = S;
        for (const [id, pos] of Object.entries(geo.positions)) {
          const parentId = geo.parents[id], parent = geo.positions[parentId];
          if (!parent) continue;
          const root = parentId === 'p0';
          const x1 = parent.x + D.tree.cardWidth / 2, y1 = parent.y + D.tree.cardHeight;
          const x2 = pos.x + D.tree.cardWidth / 2;
          const d = root ? `M${x1},${y1} V${D.tree.busY} H${x2} V${pos.y}`
            : `M${parent.x - 18},${parent.y + D.tree.cardHeight / 2} H${parent.x - 4} M${parent.x - 18},${parent.y + D.tree.cardHeight / 2} V${pos.y + D.tree.cardHeight / 2} H${pos.x}`;
          ctx.util.svg('path', { d }, svg);
        }
      },
      orgToggle: (base, S) => (ctx, card, person) => {
        base(ctx, card, person);
        const toggle = card.querySelector('.hr-orgtoggle');
        toggle.replaceChildren(document.createTextNode(S.ui.collapsed.has(person.id) ? '+' : '−'));
      },
      orgRail: (base, S) => (ctx, all, geo) => {
        const { P } = S, { ui, s, main } = S.current;
        main.querySelector('.cad-inspector')?.remove();
        const selected = ui.inspected || s.people.find(p => p.id !== 'p0' && !Object.values(geo.parents).includes(p.id))?.id || 'p0';
        const person = geo.byId[selected], manager = geo.byId[geo.parents[selected]], reports = all.filter(p => geo.parents[p.id] === selected);
        const inspector = P.element(ctx, 'aside', 'cad-inspector', main);
        const title = P.element(ctx, 'div', 'cad-inspectortitle', inspector); P.icon(ctx, title, 'people');
        P.element(ctx, 'h2', '', title, 'Employee Details');
        const detail = P.element(ctx, 'section', 'cad-details', inspector);
        const profile = P.element(ctx, 'div', 'cad-profile', detail); P.identity(ctx, profile, person);
        P.element(ctx, 'div', 'cad-profileteam', profile.querySelector('.hr-persontext'), cadDepartment(person, geo));
        P.iconButton(ctx, profile, 'more', 'Employee information', () => P.notice(ctx, 'Employee information', [person.name, person.email || 'Active employee']));
        const fields = P.element(ctx, 'dl', 'cad-fields', detail);
        const rows = [['Employee ID', 'E-' + (1040 + all.indexOf(person))], ['Email', person.email || '—'],
          ['Phone', '+1 (415) 555-0187'], ['Location', person.city || '—'], ['Department', cadDepartment(person, geo)],
          ['Reports to', manager?.name || '—'], ['Direct reports', String(reports.length)], ['Total in branch', String(geo.totalBelow(selected) + 1)],
          ['Employment type', 'Full Time'], ['Start date', person.date || 'Mar 3, 2021']];
        for (const [label, value] of rows) {
          P.element(ctx, 'dt', '', fields, label); P.element(ctx, 'dd', label === 'Email' ? 'cad-email' : '', fields, value);
        }
        const reportTitle = P.element(ctx, 'div', 'cad-reporttitle', inspector); P.icon(ctx, reportTitle, 'people');
        P.element(ctx, 'h2', '', reportTitle, `Direct Reports (${reports.length})`);
        const table = P.element(ctx, 'table', 'cad-reporttable', inspector), head = P.element(ctx, 'tr', '', P.element(ctx, 'thead', '', table));
        for (const name of ['Name', 'Title', 'Department']) P.element(ctx, 'th', '', head, name);
        const body = P.element(ctx, 'tbody', '', table);
        for (const report of reports) {
          const row = P.element(ctx, 'tr', '', body);
          for (const value of [report.name, report.role, report.team || person.role]) P.element(ctx, 'td', '', row, value);
        }
        if (!reports.length) P.element(ctx, 'div', 'cad-noreports', inspector, 'No direct reports');
      },
      orgchart: (base, S) => (ctx) => {
        base(ctx);
        const viewport = S.panes.chart, canvas = viewport.querySelector('.hr-canvas');
        const scale = Math.min(1, viewport.clientWidth / 1070);
        canvas.style.zoom = String(scale);
      },
      notice: (base, S) => (ctx, title, lines) => {
        const person = [...S.spec.people, ...(S.spec.directory || [])].find(p => p.name === title);
        if (person) { S.ui.inspected = person.id; S.P.draw(ctx); }
        else base(ctx, title, lines);
      },
    },
  },
});
