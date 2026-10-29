// Reference workspace design; shared widget: templates/use-dev-tools/workspace.js.
env.widget({
  task: 'use-dev-tools',
  site: 'design-use-dev-tools-flag-03',
  name: 'design',
  split: 'train',
  scenarios: ['flag'],
  template: 'use-dev-tools/workspace',
  design: {
    inset: 0, bottomInset: 0, minHeight: 180,
    font: 'Arial, -apple-system, BlinkMacSystemFont, sans-serif', fontSize: 16,
    tabs: { flag: ['Configuration', 'Rules', 'Metrics', 'Activity'] },
    parts: {
      frame: (base, S) => (ctx) => {
        const card = base(ctx);
        card.style.height = ctx.size.height + 'px';
        return card;
      },
      top: () => () => {},
      layout: (base, S) => (ctx, card) => {
        const { el } = S.st;
        const shell = el('div', 'dv-shell', card);
        const work = el('div', 'dv-work', shell);
        const main = el('div', 'dv-main', work);
        const heading = el('div', 'flag-list-heading', main, 'Flags');
        const query = S.P.tools(ctx, main);
        const content = el('div', 'dv-content', work);
        const badge = el('span', 'flag-state', content);
        return { shell, sidebar: heading, work, badge, query, content, main };
      },
      tools: (base, S) => (ctx, work) => {
        const query = base(ctx, work);
        query.placeholder = 'Search flags…';
        S.P.icon(query.parentElement, 'search');
        return query;
      },
      context: (base, S) => (ctx, main) => {
        base(ctx, main);
        S.st.refs.scopeContext.parentElement.hidden = true;
      },
      columnHead: () => () => {},
      detail: (base, S) => (ctx, content) => {
        const { el, badge, refs } = S.st;
        const detail = el('aside', 'dv-detail', content);
        const header = el('div', 'flag-editor-heading', detail);
        const title = el('div', 'flag-editor-title', header);
        const dh = el('h3', '', title, 'Flag configuration');
        title.appendChild(badge);
        const id = el('div', 'flag-editor-id', header);
        el('span', '', id, 'Flag ID');
        refs.flagId = el('span', 'flag-id-value', id, '—');
        const copy = el('button', 'flag-copy-id', id);
        copy.type = 'button';
        copy.title = 'Copy flag ID';
        copy.setAttribute('aria-label', 'Copy flag ID');
        S.P.icon(copy, 'review');
        copy.onclick = () => env.log('decoy', {label:'Copy flag ID'});
        const meta = el('p', 'dv-muted flag-description', detail);
        S.P.tabs(ctx, detail);
        return { detail, dh, meta };
      },
      controlsFlag: (base, S) => (ctx, detail) => {
        const { el, s, refs } = S.st;
        const fields = el('div', 'flag-fields', detail);
        S.st.scopes = {};
        for (const [key, label, values, glyph] of [
          ['environment', 'Environment', s.environments, 'package'],
          ['segment', 'Segment', s.segments, 'review'],
        ]) {
          const field = el('div', 'flag-field', fields);
          el('label', '', field, label);
          const scope = el('div', 'flag-select', field);
          const trigger = el('button', 'flag-select-trigger', scope);
          trigger.type = 'button';
          trigger.setAttribute('aria-label', label);
          trigger.setAttribute('aria-expanded', 'false');
          if (key === 'segment') {
            const icon = S.st.U.svg('svg', {viewBox:'0 0 24 24',class:'dv-icon','aria-hidden':'true'}, trigger);
            for (const d of ['M16 21v-3a4 4 0 0 0-8 0v3','M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8','M3 21v-3a4 4 0 0 1 3-4','M21 21v-3a4 4 0 0 0-3-4','M5 11a3 3 0 0 1 0-6','M19 11a3 3 0 0 0 0-6']) S.st.U.svg('path',{d},icon);
          } else S.P.icon(trigger, glyph);
          const valueLabel = el('span', 'flag-select-value', trigger);
          S.P.icon(trigger, 'chevron');
          const menu = el('div', 'flag-select-menu', scope);
          menu.hidden = true;
          for (const value of values) {
            const option = S.P.chip(menu, key, value);
            const choose = option.onclick;
            option.onclick = () => {
              menu.hidden = true;
              trigger.setAttribute('aria-expanded', 'false');
              choose();
              ctx.reanchor();
            };
          }
          trigger.onclick = () => {
            const open = menu.hidden;
            for (const control of Object.values(S.st.scopes)) {
              control.menu.hidden = true;
              control.trigger.setAttribute('aria-expanded', 'false');
            }
            menu.hidden = !open;
            trigger.setAttribute('aria-expanded', String(open));
            if (open) {
              const bounds = ctx.stage.getBoundingClientRect();
              const editor = detail.getBoundingClientRect();
              const button = trigger.getBoundingClientRect();
              const scale = button.height / trigger.offsetHeight;
              const above = (button.top - Math.max(bounds.top, editor.top)) / scale - 6;
              const below = (Math.min(bounds.bottom, editor.bottom) - button.bottom) / scale - 6;
              const upward = menu.scrollHeight > below && above > below;
              menu.style.top = upward ? 'auto' : 'calc(100% + 5px)';
              menu.style.bottom = upward ? 'calc(100% + 5px)' : 'auto';
              menu.style.maxHeight = Math.max(0, upward ? above : below) + 'px';
              menu.style.overflowY = 'auto';
            }
            ctx.reanchor();
          };
          S.st.scopes[key] = {trigger, menu, valueLabel};
        }
        const rule = el('div', 'dv-rule', detail);
        const copy = el('div', 'flag-switch-copy', rule);
        el('strong', '', copy, 'Enabled for this environment and segment');
        el('p', '', copy, 'When disabled, this flag is not active for the selected environment and segment.');
        const toggle = S.P.button(rule, 'toggle', '');
        toggle.className = 'dv-switch';
        toggle.setAttribute('role', 'switch');
        toggle.setAttribute('aria-label', 'Feature enabled');
        const toggleValue = el('span', 'flag-toggle-value', rule);
        refs.rule = rule;
        const actions = el('div', 'flag-deployment-actions', detail);
        const prepare = S.P.button(actions, 'prepare', 'Prepare deployment', true);
        const run = S.P.button(actions, 'run', 'Deploy to Production', true);
        return { toggle, toggleValue, prepare, run };
      },
      facts: (base, S) => (ctx, detail) => {
        const box = base(ctx, detail);
        const { el, refs } = S.st;
        const rule = el('div', 'flag-active-rule', detail);
        el('span', 'flag-info-icon', rule, 'i');
        const text = el('div', '', rule);
        el('strong', '', text, 'Active rule');
        refs.activeCount = el('span', 'flag-active-count', text);
        refs.ruleText = el('p', '', text);
        const config = el('div', 'flag-config-version', detail);
        S.P.icon(config, 'file');
        const configText = el('div', '', config);
        el('strong', '', configText, 'Configuration version');
        refs.configVersion = el('div', 'flag-version-value', configText);
        el('p', '', configText, `Last updated 2 hours ago by ${S.st.colleagues[0]}`);
        return box;
      },
      detailExtra: (base, S) => (ctx, detail) => {
        base(ctx, detail);
        S.st.refs.extra.hidden = true;
      },
      footer: (base, S) => (ctx, work) => {
        const result = base(ctx, work);
        result.footCount.parentElement.hidden = true;
        return result;
      },
      paint: (base, S) => (model) => {
        base(model);
        const { s, F, dh, meta, badge, refs, toggleValue, toggle, el } = S.st;
        for (const [key, control] of Object.entries(S.st.scopes)) control.valueLabel.textContent = model[key];
        const item = s.items.find(row => row.id === model.selected);
        const on = item && model.values[F.helpers.flagKey(item.id, model.environment, model.segment)];
        dh.textContent = item ? item.label : 'Flag configuration';
        meta.textContent = item ? item.description : 'Select a flag to configure its environment and segment.';
        badge.textContent = item ? on ? 'Enabled' : 'Disabled' : 'No selection';
        badge.classList.toggle('enabled', !!on);
        refs.flagId.textContent = item ? item.label : '—';
        toggleValue.textContent = on ? 'On' : 'Off';
        refs.ruleText.textContent = item
          ? `This flag is ${on ? 'enabled' : 'disabled'} for the ${model.segment} segment in ${model.environment}.`
          : `Choose a flag to view its active rule for ${model.segment} in ${model.environment}.`;
        const facts = F.facts(model, s);
        const count = facts.find(fact => /active/i.test(fact.label));
        refs.activeCount.textContent = count ? ` · ${count.value} active` : '';
        const version = facts.find(fact => /version/i.test(fact.label));
        refs.configVersion.textContent = version ? version.value : '—';
        const inspector = document.querySelector('.ref-inspector');
        if (inspector) {
          const values = [item ? item.label : '—', item ? item.description : 'Select a flag to view its details', item ? item.owner : '—', item ? 'Release' : '—', item ? 'Jan 14, 2019' : '—', item ? '3 days ago' : '—'];
          inspector.querySelectorAll('.ref-inspector-row span:last-child').forEach((node, index) => { node.textContent = values[index]; });
        }
      },
      locate: (base, S) => (target) => {
        for (const key of ['environment', 'segment']) {
          if (target[key] !== undefined && S.st.scopes[key].menu.hidden) {
            return S.st.U.center(S.st.scopes[key].trigger);
          }
        }
        return base(target);
      },
    },
  },
});
