// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-logs-05',
  name: 'design',
  split: 'train',
  scenarios: ['logs'],
  template: 'use-dev-tools/workspace',
  design: {
    inset: 0, bottomInset: 0, minHeight: 0, font: 'Arial,Helvetica,sans-serif', fontSize: 14, radius: 0,
    parts: {
      // The window frame belongs to the site; the widget draws only the log viewer.
      top: () => () => {},
      tabs: () => () => {},
      layout: (base, S) => (ctx, card) => {
        const { st, P } = S;
        const { el } = st;
        const shell = el('div', 'dv-shell', card);
        const sidebar = el('aside', 'dv-sidebar', shell);
        const work = el('div', 'dv-work', shell);
        const badge = P.heading(ctx, work);
        const query = P.tools(ctx, work);
        const content = el('div', 'dv-content', work);
        const main = el('div', 'dv-main', content);
        return { shell, sidebar, work, badge, query, content, main };
      },
      heading: (base, S) => (ctx, work) => {
        const badge = S.st.el('span', 'dv-badge logs-hidden-badge', work);
        return badge;
      },
      tools: (base, S) => (ctx, work) => {
        const { st, P } = S;
        const { el, refs } = st;
        const strip = el('div', 'logs-filter-strip', work);
        st.filterBar = strip;
        el('strong', 'logs-filter-title', strip, 'Filters');
        const search = el('div', 'logs-filter-search', strip);
        el('label', '', search, 'Search');
        const query = el('input', 'dv-input dv-search', search);
        refs.query = query;
        query.type = 'text'; query.autocomplete = 'off'; query.spellcheck = false;
        query.setAttribute('aria-label', 'Search');
        query.oninput = () => P.change('query', query.value);
        return query;
      },
      histogram: (base, S) => (ctx, main) => {
        const { el, refs } = S.st;
        const hidden = el('div', 'logs-data-only', main);
        refs.chartCount = el('span', '', hidden);
        refs.bars = Array.from({length:30}, () => el('span', '', hidden));
      },
      facets: (base, S) => (ctx, main) => {
        const { st, P } = S;
        const { el } = st;
        const service = el('div', 'logs-filter-service', st.filterBar);
        el('label', '', service, 'Service');
        const serviceOptions = el('div', 'logs-filter-options', service);
        for (const name of ['All', 'edge-api', 'billing-worker', 'session-cache']) P.chip(serviceOptions, 'service', name);
        const severity = el('div', 'logs-filter-severity', st.filterBar);
        el('label', '', severity, 'Severity');
        const severityOptions = el('div', 'logs-filter-options', severity);
        for (const name of ['All', 'INFO', 'WARN', 'ERROR']) P.chip(severityOptions, 'severity', name);
        const range = el('div', 'logs-filter-range', st.filterBar);
        el('label', '', range, 'Time Range');
        el('div', 'logs-filter-range-value', range, 'Last 1 hour  ▾');
      },
      columnHead: (base, S) => (ctx, main) => {
        const { el } = S.st;
        el('div', 'logs-list-title', main, 'Log Events');
        const head = el('div', 'dv-columnhead dv-loghead', main);
        for (const name of ['Time', 'Service', 'Level', 'Message']) el('span', '', head, name);
      },
      rowContent: (base, S) => (ctx, row, item, rec) => {
        const { el } = S.st;
        el('span', 'logs-row-time', row, item.time);
        el('span', 'logs-row-service', row, item.service);
        const level = el('span', 'logs-row-level', row);
        el('i', 'logs-level-square logs-level-' + item.severity.toLowerCase(), level);
        el('span', '', level, item.severity);
        el('span', 'logs-row-message', row, item.message);
      },
      detail: (base) => (ctx, content) => {
        const made = base(ctx, content);
        const title = env.util.el('div', 'logs-detail-title', null, '▤  Event Details');
        made.detail.prepend(title);
        return made;
      },
    },
  },
});
