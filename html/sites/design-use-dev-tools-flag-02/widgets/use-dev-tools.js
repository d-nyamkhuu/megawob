// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-flag-02',
  name: 'design',
  split: 'train',
  scenarios: ['flag'],
  template: 'use-dev-tools/workspace',
  design: {
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    fontSize: 14,
    inset: 0,
    bottomInset: 0,
    parts: {
      frame: (base, S) => (ctx) => {
        const card = base(ctx);
        Object.assign(card.style, {left: '0px', top: '0px', width: '100%', height: '100%'});
        return card;
      },
      top: (base, S) => (ctx, card) => {
        const {el} = S.st;
        const bar = el('div', 'flag-titlebar', card);
        el('span', 'flag-title-icon', bar, '⚑');
        el('h2', '', bar, 'Feature flags');
        const close = el('button', 'flag-window-close', bar, '×');
        close.type = 'button'; close.title = 'Close window';
        close.onclick = () => env.log('decoy', {label: 'Close window'});
      },
      layout: (base, S) => (ctx, card) => {
        const {el} = S.st;
        const shell = el('div', 'dv-shell', card);
        const work = el('div', 'dv-work', shell);
        const content = el('div', 'dv-content', work);
        const main = el('div', 'dv-main', content);
        const query = S.P.tools(ctx, main);
        const badge = el('span', 'flag-hidden', card);
        return {shell, sidebar: null, work, badge, query, content, main};
      },
      tools: (base, S) => (ctx, main) => {
        const {el, refs} = S.st;
        const tools = el('div', 'dv-tools', main);
        S.P.icon(tools, 'search');
        const query = el('input', 'dv-input dv-search', tools);
        refs.query = query;
        query.type = 'text'; query.autocomplete = 'off'; query.spellcheck = false;
        query.placeholder = 'Search flags by name or key…';
        query.setAttribute('aria-label', 'Search');
        query.oninput = () => S.P.change('query', query.value);
        return query;
      },
      context: (base, S) => (ctx, main) => {
        S.st.refs.scopeContext = S.st.el('span', 'flag-hidden', main);
      },
      columnHead: (base, S) => (ctx, main) => {
        const head = S.st.el('div', 'dv-columnhead flag-table-grid', main);
        for (const label of ['', 'Flag name ♢', 'Key', 'Description', 'Owner', 'Last updated']) {
          S.st.el('span', label === 'Last updated' ? 'flag-updated' : label ? '' : 'flag-checkbox', head, label);
        }
      },
      rowContent: (base, S) => (ctx, row, item, rec) => {
        const {el} = S.st;
        row.classList.add('flag-table-grid');
        el('span', 'flag-checkbox', row);
        el('span', 'flag-name', row, item.label);
        el('span', 'flag-key', row, item.label);
        el('span', 'flag-description', row, item.description);
        const names = item.owner.trim().split(/\s+/);
        const owner = el('span', 'flag-owner', row, names.length > 1 ? `${names[0][0]}.${names[names.length - 1]}`.toLowerCase() : item.owner);
        owner.title = item.owner;
        const dates = ['Nov 6, 2024', 'Nov 5, 2024', 'Nov 4, 2024', 'Nov 3, 2024', 'Nov 1, 2024', 'Oct 28, 2024', 'Oct 25, 2024', 'Oct 22, 2024', 'Oct 18, 2024', 'Oct 15, 2024', 'Oct 12, 2024', 'Oct 9, 2024'];
        el('span', 'flag-updated', row, dates[S.st.s.items.indexOf(item) % dates.length]);
      },
      detail: (base, S) => (ctx, content) => {
        const result = base(ctx, content);
        content.prepend(result.detail);
        result.dh.classList.add('flag-hidden');
        result.meta.classList.add('flag-hidden');
        return result;
      },
      controlsFlag: (base, S) => (ctx, detail) => {
        const {s, el, refs} = S.st;
        refs.scopePickers = {};
        for (const [kind, title, options] of [['environment', 'Environment', s.environments], ['segment', 'Segment', s.segments]]) {
          const field = el('div', 'flag-scope-field', detail);
          el('label', '', field, title);
          const trigger = el('button', 'flag-scope-trigger', field);
          trigger.type = 'button'; trigger.setAttribute('aria-label', title);
          el('span', kind === 'environment' ? 'flag-environment-dot' : 'flag-segment-icon', trigger, kind === 'segment' ? '♧' : '');
          const value = el('span', 'flag-scope-value', trigger);
          el('span', 'flag-chevron', trigger, '⌄');
          const menu = el('div', 'flag-scope-menu', field);
          menu.hidden = true;
          trigger.onclick = () => {
            const open = menu.hidden;
            for (const picker of Object.values(refs.scopePickers)) picker.menu.hidden = true;
            menu.hidden = !open;
            trigger.setAttribute('aria-expanded', String(open));
          };
          for (const option of options) {
            const button = S.P.chip(menu, kind, option);
            const choose = button.onclick;
            button.onclick = () => { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); choose(); };
          }
          refs.scopePickers[kind] = {trigger, value, menu};
        }
        const status = el('div', 'flag-status', detail);
        const label = el('div', 'flag-status-label', status);
        el('b', '', label, 'Flag status ');
        refs.statusScope = el('span', 'dv-muted', label);
        const toggle = S.P.button(status, 'toggle', '');
        toggle.className = 'flag-radio-control';
        toggle.setAttribute('role', 'switch'); toggle.setAttribute('aria-label', 'Feature enabled');
        el('span', 'flag-radio-on', toggle, 'On');
        el('span', 'flag-radio-off', toggle, 'Off');
        const toggleValue = el('span', 'flag-hidden', status);
        const prepare = S.P.button(detail, 'prepare', 'Prepare deployment', true);
        const run = S.P.button(detail, 'run', 'Deploy to Production', true);
        return {toggle, toggleValue, prepare, run};
      },
      detailExtra: (base, S) => (ctx, detail) => {
        const {el, refs, factsBox} = S.st;
        const info = el('section', 'flag-info', detail);
        detail.insertBefore(info, factsBox);
        el('h4', '', info, 'Flag details');
        refs.flagDetails = {};
        for (const label of ['Key', 'Description', 'Owner', 'Created']) {
          const line = el('div', 'flag-detail-line', info);
          el('span', '', line, label);
          refs.flagDetails[label] = el('span', '', line, '—');
        }
        const active = el('section', 'flag-active-rule', detail);
        detail.insertBefore(active, factsBox);
        const title = el('h4', '', active, 'Active rule ');
        refs.activeScope = el('span', 'dv-muted', title);
        refs.ruleHint = el('div', 'flag-rule-hint', active, 'Select a flag to view the active rule for this environment and segment.');
        refs.rules = el('div', 'flag-rule-list', active);
        const version = el('h4', 'flag-config-title', detail, 'Configuration version');
        detail.insertBefore(version, factsBox);
        const updated = el('div', 'flag-config-updated', detail);
        el('div', '', updated, 'Updated today, 10:21 AM');
        el('div', '', updated, `by ${S.st.s.author}`);
      },
      paint: (base, S) => (model) => {
        base(model);
        const {s, refs} = S.st;
        const item = s.items.find(item => item.id === model.selected);
        for (const [kind, picker] of Object.entries(refs.scopePickers)) picker.value.textContent = model[kind];
        const scope = `(${model.environment} / ${model.segment})`;
        refs.statusScope.textContent = scope;
        refs.activeScope.textContent = scope;
        refs.flagDetails.Key.textContent = item ? item.label : '—';
        refs.flagDetails.Description.textContent = item ? item.description : '—';
        refs.flagDetails.Owner.textContent = item ? item.owner : '—';
        refs.rules.hidden = !item;
        refs.ruleHint.hidden = !!item;
        const facts = S.st.factsBox.querySelectorAll('.dv-fact');
        if (facts.length > 1) {
          refs.rules.append(facts[0]);
          facts[1].querySelector('b').hidden = true;
          facts[1].querySelector('.dv-mono').textContent += `-${s.revision}`;
        }
      },
      locate: (base, S) => (target) => {
        for (const kind of ['environment', 'segment']) {
          if (target[kind] !== undefined) {
            const picker = S.st.refs.scopePickers[kind];
            if (picker.menu.hidden) return env.util.center(picker.trigger);
          }
        }
        return base(target);
      },
    },
  },
});
