// Default center design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-center-02',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: { maxWidth: 2400, maxHeight: 1400, widthInset: 0, heightInset: 0, panelWidth: 360,
    maxMapWidth: 2400, brand: 'City Explorer', mapHeaderHeight: 34, font: '14px/1.25 "Courier New",monospace',
    parts: {
      explorerHeading: (base, S) => (ctx, panel) => {
        const section = ctx.util.el('div', 'mpe-section', panel);
        ctx.util.el('div', 'mpe-heading', section, `Places (${ctx.spec.places.length})`);
        const categories = [
          ['Stations', /station/], ['Shops', /shop|market|grocer|store|laundrette|florist|post office/],
          ['Food & Drink', /cafe|restaurant|food|bakery/], ['Health', /hospital|clinic|medical|pharmacy/],
          ['Education', /school|college|university|library|gallery|studio/],
          ['Parks & Leisure', /park|leisure|stadium|swimming|community|tennis|gym|theatre|pool/],
        ];
        const tally = ctx.util.el('div', 'map-category-list', panel);
        const row = (label, count, selected) => {
          const item = ctx.util.el('div', `map-category${selected ? ' selected' : ''}`, tally);
          ctx.util.el('span', 'map-category-icon', item, selected ? '▧' : '▣');
          ctx.util.el('span', 'map-category-label', item, label);
          ctx.util.el('span', 'map-category-count', item, String(count));
        };
        row('All Places', ctx.spec.places.length, true);
        for (const [label, pattern] of categories) row(label, ctx.spec.places.filter((p) => pattern.test(`${p.kind} ${p.name}`)).length, false);
        return section;
      },
      explorerFrame: (base, S) => (ctx, chrome) => {
        const frame = base(ctx, chrome);
        frame.head.querySelector('.mp-title').textContent = 'City Map';
        return frame;
      },
      filter: (base, S) => (ctx, parent, label, active) => {
        const count = label === 'All places' ? ctx.spec.places.length : ctx.spec.places.filter((p) =>
          label === 'Food' ? /cafe|market|bakery|grocer/.test(p.kind) : /station|museum|library|university/.test(p.kind)).length;
        const button = base(ctx, parent, `${label}   ${count}`, active);
        return button;
      },
      directoryEnd: (base, S) => (ctx, list, count) => {
        base(ctx, list, count);
        const panel = list.parentElement;
        panel.querySelector('.map-status')?.remove();
        const status = ctx.util.el('section', 'map-status', panel);
        ctx.util.el('div', 'map-status-title', status, 'Map Status');
        const visible = ctx.util.el('div', 'map-status-row', status);
        ctx.util.el('span', '', visible, 'Visible Places');
        ctx.util.el('b', 'map-visible-count', visible, String(count));
        const zoom = ctx.util.el('div', 'map-status-row', status);
        ctx.util.el('span', '', zoom, 'Zoom Level');
        ctx.util.el('b', 'map-zoom-level', zoom, String(ctx.model.z));
        const centre = ctx.util.el('div', 'map-status-row', status);
        ctx.util.el('span', '', centre, 'Centre');
        ctx.util.el('b', 'map-centre', centre, ctx.model.c.map((n) => Math.round(n)).join(', '));
      },
      explorerPaint: (base, S) => (ctx, elements, model) => {
        base(ctx, elements, model);
        const status = ctx.stage.querySelector('.map-status');
        if (!status) return;
        status.querySelector('.map-zoom-level').textContent = String(model.z);
        status.querySelector('.map-centre').textContent = model.c.map((n) => Math.round(n)).join(', ');
      },
    } },
});
