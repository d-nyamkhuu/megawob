// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-warehouse-03',
  name: 'design',
  split: 'train',
  scenarios: ['warehouse'],
  template: 'use-dispatch/workspace',
  design: {
      inset: 8, cardHeight: 68, cardGap: 8, paneInset: 6,
      laneHeaderHeight: 128, inspectorWidth: 372, roomyWidth: 0,
      font: '"Arial Narrow", "Liberation Sans Narrow", Arial, sans-serif',
      panel: '#cececd', foreground: '#101014', line: '#929292',
      background: '#c5c5c3', accent: '#004480', muted: '#53555b',
    parts: {
      toolbar: (base, S) => () => { base(); },
      shell: (base, S) => () => {
        const u = S.ctx.util;
        const shell = u.el('div', 'ad-shell', S.app);
        S.els.rail = u.el('aside', 'ad-rail', shell);
        S.els.work = u.el('div', 'ad-work', shell);
      },
      rail: () => () => {},
      navigation: () => () => {},
      context: () => () => {},
      filters: (base, S) => () => {
        S.refs.exceptionCount = S.ctx.util.el('span', 'wh-hidden', S.els.work);
      },
      workspace: (base, S) => () => {
        const u = S.ctx.util;
        S.els.workspace = u.el('div', 'ad-workspace', S.els.work);
        S.els.main = u.el('div', 'ad-main', S.els.workspace);
        const title = u.el('div', 'wh-subtitle', S.els.main);
        S.P.icon(title, 'archive', 24);
        u.el('span', '', title, 'Storage Assignment');
        u.el('span', 'wh-title-close', title, '×');
        S.els.footer = u.el('div', 'wh-summary', S.els.main);
      },
      lanes: (base, S) => () => {
        const u = S.ctx.util;
        const lanes = u.el('div', 'wh-allocation', S.els.main);
        S.P.lane({ id: 'pool', label: 'Unassigned Items' }, lanes);
        const storage = u.el('div', 'wh-storage', lanes);
        u.el('div', 'wh-pane-caption', storage, 'Storage Bins');
        const grid = u.el('div', 'wh-storage-grid', storage);
        grid.style.setProperty('--bin-count', S.spec.lanes.length);
        for (const lane of S.spec.lanes) S.P.lane(lane, grid);
        for (const item of S.spec.items) S.P.card(item, S.refs.panes.get(S.model.assign[item.id] || 'pool'));
      },
      laneHeader: (base, S) => (lane, l) => {
        const u = S.ctx.util;
        const pool = l.id === 'pool';
        lane.classList.add(pool ? 'wh-pool' : 'wh-bin');
        const head = u.el('div', 'ad-lane-head', lane);
        S.refs.heads.set(l.id, head);
        const label = u.el('strong', '', head);
        if (!pool) S.P.icon(label, l.haz ? 'alert' : l.temp === 'chilled' ? 'snow' : 'archive', 30);
        u.el('span', '', label, pool ? `Unassigned Items (${S.spec.items.length})` : `${l.label}   ${l.temp === 'chilled' ? 'Chilled' : l.haz ? 'Hazmat' : 'Ambient'}`);
        if (!pool) {
          const pairs = u.el('div', 'wh-bin-pairs', head);
          for (const [key, value] of [['Capacity:', `${l.capacity.toLocaleString('en-US')} kg`], ['Temperature:', l.temp === 'chilled' ? '2°C to 8°C' : '15°C to 25°C'], ['Hazmat Certified:', l.haz ? 'Yes' : 'No']]) {
            u.el('span', '', pairs, key); u.el('span', '', pairs, value);
          }
        }
        S.refs.loads.set(l.id, u.el('div', 'ad-load', head));
        S.refs.fills.set(l.id, u.el('div', 'ad-fill', head));
        return head;
      },
      empty: (base, S) => (pane, l) => {
        const empty = S.ctx.util.el('div', 'ad-empty', pane, l.id === 'pool' ? 'All items assigned' : 'Drag items here');
        S.refs.rows.set(l.id, empty);
        return empty;
      },
      laneDecorated: (base, S) => (lane, l) => {
        if (l.id !== 'pool') return;
        const u = S.ctx.util;
        const rail = u.el('div', 'wh-scroll-rail', lane);
        rail.setAttribute('aria-hidden', 'true');
        u.el('span', 'wh-scroll-up', rail, '▲');
        const track = u.el('div', 'wh-scroll-track', rail);
        const thumb = u.el('div', 'wh-scroll-thumb', track);
        u.el('span', 'wh-scroll-down', rail, '▼');
        const pane = S.refs.panes.get('pool');
        const update = () => {
          const ratio = Math.min(1, pane.clientHeight / Math.max(1, pane.scrollHeight));
          const height = Math.max(25, ratio * track.clientHeight);
          thumb.style.height = `${height}px`;
          thumb.style.top = `${(track.clientHeight - height) * pane.scrollTop / Math.max(1, pane.scrollHeight - pane.clientHeight)}px`;
        };
        pane.addEventListener('scroll', update);
        S.refs.refreshScrollRail = update;
      },
      rendered: (base, S) => {
        let initialized = false;
        return (ctx) => {
          base(ctx);
          S.refs.refreshScrollRail();
          if (initialized) ctx.reanchor();
          initialized = true;
        };
      },
      cardContent: (base, S) => (item, el) => {
        const u = S.ctx.util;
        el.dataset.tint = ['blue', 'yellow', 'red', 'green', 'yellow', 'blue', 'green', 'red'][S.spec.items.indexOf(item) % 8];
        const icon = u.el('span', 'wh-item-icon', el);
        S.P.icon(icon, /plant|seed|nutrient|apple|produce/i.test(item.name) ? 'plant' : /water|bottle|brew|oil/i.test(item.name) ? 'bottle' : /tire|part|pack/i.test(item.name) ? 'parts' : item.haz ? 'flask' : 'can', 44);
        const copy = u.el('div', 'wh-item-copy', el);
        const top = u.el('div', 'wh-item-name', copy);
        u.el('b', '', top, item.id);
        u.el('span', '', top, item.name);
        const meta = u.el('div', 'wh-item-meta', copy);
        u.el('span', '', meta, `${item.weight.toLocaleString('en-US')} kg`);
        u.el('span', '', meta, item.temp === 'chilled' ? '2°C to 8°C' : '15°C to 25°C');
        u.el('span', 'ad-state', el);
        if (item.haz) {
          const haz = u.el('div', 'wh-hazmat', el);
          u.el('span', 'wh-haz-diamond', haz, '!');
          u.el('span', '', haz, 'Hazmat');
        }
      },
      icon: (base, S) => (parent, name, size) => {
        const paths = {
          plant: 'M12 22V11M12 16C3 17 2 10 2 8c7-1 11 2 10 8m0-4C11 4 17 3 22 3c0 7-4 12-10 9m0 0 6-5M12 16l-6-5',
          bottle: 'M9 2h6v3H9zM10 5 7 10v11q5 2 10 0V10l-3-5M7 11h10M7 17h10',
          can: 'M4 5c0-4 16-4 16 0s-16 4-16 0m0 0v15c0 4 16 4 16 0V5M4 11c3 3 13 3 16 0M4 17c3 3 13 3 16 0',
          flask: 'M8 2h8v3H8zM9 5v7L3 21q0 2 3 2h12q3 0 3-2l-6-9V5M6 17h12M9 14h6',
          parts: 'M8 3h10l4 5-5 7H8l-6-6zM8 3v12m9-7h5M2 9h6m0 6 8 6 6-6V8M8 15v6l8 2v-8',
        };
        if (!paths[name]) return base(parent, name, size);
        const svg = S.ctx.util.svg('svg', { viewBox: '0 0 24 26', width: size || 24, height: size || 24, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'aria-hidden': 'true' }, parent);
        S.ctx.util.svg('path', { d: paths[name] }, svg);
        return svg;
      },
      inspector: (base, S) => () => {
        const u = S.ctx.util;
        const inspector = u.el('aside', 'ad-inspector', S.els.workspace);
        S.refs.inspector = inspector;
        inspector.setAttribute('aria-label', 'Item Details');
        const title = u.el('div', 'ad-inspector-head', inspector);
        S.P.icon(title, 'panel', 22);
        u.el('span', '', title, 'Item Details');
        S.P.button(title, '×', '', () => { S.els.detail.hidden = !S.els.detail.hidden; }, 'wh-detail-close').setAttribute('aria-label', 'Collapse or restore item details');
        S.els.detail = u.el('div', 'wh-detail', inspector);
        S.refs.detail = S.els.detail;
      },
      detail: (base, S) => (model, alerts) => {
        const u = S.ctx.util, item = S.spec.items.find(it => it.id === S.selected), detail = S.els.detail;
        detail.replaceChildren();
        const title = u.el('div', 'wh-detail-product', detail);
        const picture = u.el('span', 'wh-detail-picture', title);
        S.P.icon(picture, /plant|seed|nutrient|apple/i.test(item.name) ? 'plant' : item.haz ? 'flask' : /water|brew/i.test(item.name) ? 'bottle' : 'can', 46);
        u.el('b', '', title, `${item.id}   ${item.name}`);
        const pairs = u.el('div', 'wh-detail-pairs', detail);
        for (const [key, value] of [['Weight:', `${item.weight.toLocaleString('en-US')} kg`], ['Temperature:', item.temp === 'chilled' ? '2°C to 8°C' : '15°C to 25°C'], ['Hazardous Material:', item.haz ? 'Yes' : 'No']]) {
          u.el('span', '', pairs, key); u.el('span', '', pairs, value);
        }
        u.el('div', 'wh-description-label', detail, 'Description:');
        u.el('div', 'wh-description', detail, item.description || `${item.name}.`);
        const compatibility = u.el('div', 'wh-compatibility', detail);
        u.el('b', 'wh-compat-caption', compatibility, 'Compatibility');
        for (const lane of S.spec.lanes) {
          const row = u.el('div', 'wh-compat-row', compatibility);
          u.el('span', '', row, `${lane.label}   ${lane.temp === 'chilled' ? 'Chilled' : lane.haz ? 'Hazmat' : 'Ambient'}`);
          u.el('span', '', row, env.taskDef.helpers.compatible(item, lane, S.spec) ? 'Compatible' : 'Not compatible');
        }
        if (alerts.length) u.el('div', 'wh-detail-alert', detail, alerts.join('. '));
      },
      footer: (base, S) => () => {
        for (let i = 0; i < 3; i++) S.refs.facts.push(S.ctx.util.el('span', `wh-fact wh-fact-${i}`, S.els.footer));
      },
      facts: (base, S) => (model) => {
        base(model);
        const u = S.ctx.util;
        const remaining = S.spec.items.filter(it => !model.assign[it.id] || model.assign[it.id] === 'pool').length;
        S.refs.facts.forEach((node, i) => {
          const text = node.textContent, colon = text.indexOf(':');
          if (colon < 0) return;
          node.replaceChildren();
          u.el('span', 'wh-fact-label', node, ['Assigned Load:', 'Unassigned Items:', 'Dispatch Reference:'][i]);
          let value = text.slice(colon + 1).trim();
          if (i === 0) value = `${value.replace(/\s*kg$/, '')} / ${S.spec.lanes.reduce((n, lane) => n + lane.capacity, 0).toLocaleString('en-US')} kg`;
          if (i === 1) value = `${remaining} / ${S.spec.items.length}`;
          u.el('span', 'wh-fact-value', node, value);
        });
        S.refs.heads.get('pool').querySelector('strong span').textContent = `Unassigned Items (${remaining})`;
      },
    },
  },
});
