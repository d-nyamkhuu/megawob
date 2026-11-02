// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-logs-04',
  name: 'design',
  split: 'train',
  scenarios: ['logs'],
  template: 'use-dev-tools/workspace',
  design: {
    font: 'Arial, Helvetica, sans-serif',
    fontSize: 14,
    parts: {
      layout: (base, S) => (ctx, card) => {
        const layout = base(ctx, card);
        layout.sidebar.remove();
        layout.work.querySelector('.dv-tabs').remove();
        return layout;
      },
      heading: (base, S) => (ctx, work) => {
        const badge = base(ctx, work);
        const heading = badge.parentElement;
        const icon = S.st.el('span', 'orion-log-icon', heading);
        const glyph = ctx.util.svg('svg', {viewBox:'0 0 24 24', class:'dv-icon', 'aria-hidden':'true'}, icon);
        ctx.util.svg('path', {d:'M6 3h9l4 4v7M15 3v5h4M6 3v18h9M9 8h3M9 11h6M9 14h3M19 19l3 3'}, glyph);
        ctx.util.svg('circle', {cx:16, cy:16, r:4}, glyph);
        heading.prepend(icon);
        return badge;
      },
      tools: (base, S) => (ctx, work) => {
        const query = base(ctx, work);
        const tools = query.parentElement;
        const time = tools.querySelector('.dv-toolbtn');
        time.replaceChildren();
        const calendar = ctx.util.svg('svg', {viewBox:'0 0 24 24', class:'dv-icon', 'aria-hidden':'true'}, time);
        ctx.util.svg('path', {d:'M4 5h16v16H4ZM4 10h16M8 3v5M16 3v5'}, calendar);
        S.st.el('span', '', time, 'Last 1 hour');
        S.P.icon(time, 'chevron');
        work.querySelector('.dv-heading').append(time);
        tools.querySelectorAll('.dv-spacer,small').forEach(node => node.remove());
        const search = S.st.el('div', 'orion-log-search', tools);
        S.P.icon(search, 'search');
        search.append(query);
        query.placeholder = 'Search logs...';
        S.st.refs.filterBar = tools;
        return query;
      },
      facets: (base, S) => (ctx, main) => {
        base(ctx, main);
        const facets = main.querySelector('.dv-facets');
        facets.classList.add('orion-filter-bar');
        S.st.refs.filterBar.append(facets);
        S.st.filterMenus = {};
        for (const [index, name] of ['service', 'severity'].entries()) {
          const group = facets.children[index];
          const options = S.st.el('div', 'orion-filter-options', group);
          const chips = [...group.querySelectorAll('.dv-chip')];
          chips.forEach(chip => options.append(chip));
          const trigger = S.st.el('button', 'orion-filter-trigger', group);
          trigger.type = 'button';
          trigger.setAttribute('aria-expanded', 'false');
          trigger.setAttribute('aria-label', name === 'service' ? 'Service filter' : 'Severity filter');
          const caption = S.st.el('span', '', trigger);
          S.P.icon(trigger, 'chevron');
          trigger.onclick = () => {
            const open = !group.classList.contains('open');
            for (const menu of Object.values(S.st.filterMenus)) {
              menu.group.classList.remove('open');
              menu.trigger.setAttribute('aria-expanded', 'false');
            }
            group.classList.toggle('open', open);
            trigger.setAttribute('aria-expanded', String(open));
          };
          for (const chip of chips) {
            const change = chip.onclick;
            chip.onclick = () => {
              group.classList.remove('open');
              trigger.setAttribute('aria-expanded', 'false');
              change();
            };
          }
          S.st.filterMenus[name] = {group, trigger, caption};
        }
        const more = S.st.el('button', 'dv-btn orion-more-filters', facets);
        more.type = 'button';
        S.P.icon(more, 'filter');
        S.st.el('span', '', more, 'More filters');
        more.onclick = () => S.P.peek('More filters', [['Environment', 'Production / application logs', 'cloud'], ['Indexed fields', 'Request identifiers and trace context', 'filter']]);
      },
      columnHead: (base, S) => (ctx, main) => {
        base(ctx, main);
        const head = main.querySelector('.dv-columnhead');
        head.replaceChildren();
        for (const title of ['Timestamp ↓', 'Service', 'Level', 'Message']) S.st.el('span', '', head, title);
      },
      rowContent: (base, S) => (ctx, row, item, rec) => {
        // Preserve the seeded event values and the template's row selection handler.
        S.st.el('span', 'dv-mono orion-event-time', row, item.time);
        S.st.el('span', 'dv-mono orion-event-service', row, item.service);
        S.st.el('span', `dv-level ${item.severity.toLowerCase()}`, row, item.severity);
        const message = S.st.el('span', 'dv-mono orion-event-message', row, `${item.message}  request_id=${item.requestId}`);
        message.title = item.message;
      },
      detail: (base, S) => (ctx, content) => {
        const result = base(ctx, content);
        const icon = S.st.el('span', 'orion-detail-icon', result.detail);
        S.P.icon(icon, 'database');
        const text = S.st.el('div', 'orion-detail-text', result.detail);
        text.append(result.dh, result.meta);
        result.detail.prepend(icon, text);
        return result;
      },
      paint: (base, S) => model => {
        // Apply presentation before base.paint measures the visible row geometry.
        const selected = !!model.selected;
        S.st.detail.dataset.selected = String(selected);
        base(model);
        if (!selected) {
          S.st.dh.textContent = 'No event selected';
          S.st.meta.textContent = 'Select a log entry to view full details, metadata and related events.';
        }
        for (const [name, menu] of Object.entries(S.st.filterMenus)) {
          menu.caption.textContent = model[name] === 'All' ? (name === 'service' ? 'All services' : 'All levels') : model[name];
        }
      },
      locate: (base, S) => target => {
        // Filter options retain their original target keys. A closed filter first
        // locates its trigger; the next closed-loop oracle step selects the option.
        for (const name of ['service', 'severity']) {
          const menu = S.st.filterMenus[name];
          if (target[name] !== undefined && !menu.group.classList.contains('open')) return S.ctx.util.center(menu.trigger);
        }
        return base(target);
      },
    },
  },
});
