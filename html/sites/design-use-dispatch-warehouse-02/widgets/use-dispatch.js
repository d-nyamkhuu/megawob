// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-warehouse-02',
  name: 'design',
  split: 'train',
  scenarios: ['warehouse'],
  template: 'use-dispatch/workspace',
  design: {
    cardHeight: 125,
    paneInset: 0,
    parts: {
      styles: (base, S) => (ctx) => {
        base(ctx);
        const compact = ctx.size.width < 1050;
        const gap = compact ? 46 : 80;
        const bottom = compact ? 15 : 41;
        const header = compact ? 94 : 145;
        const pool = Math.min(ctx.size.height * (compact ? .52 : .4378),
          ctx.size.height - bottom - gap - header - 30 - 142);
        const style = ctx.util.el('style', '', ctx.stage);
        style.textContent = `
          .ref-stage .ad-app .ad-lanes { row-gap: ${gap}px; column-gap: ${compact ? 9 : 12}px; }
          .ref-stage .ad-lane { height: ${ctx.size.height - bottom - gap - pool}px; }
          .ref-stage .ad-lane:first-child { height: ${pool}px; }
          .ref-stage .ad-lane:first-child .ad-card { height: 100%; }
          .ref-stage .ad-lane-head { min-height: ${header}px; }
          .ref-stage .ad-lanes::before { top: ${pool + 2}px; }
          .ref-stage .wh-storage-title { top: ${pool + (compact ? 10 : 19)}px; }
          .ref-stage .ad-lane:not(:first-child) .ad-card {
            height: ${S.D.cardHeight}px; min-height: 0; flex: none;
          }
          .ref-stage .ad-lane:not(:first-child) .ad-pane { padding: 0 0 16px; }
          .ref-stage .ad-empty[hidden] { display: none; }
        `;
      },
      item: (base, S) => (card, item) => {
        base(card, item);
        card.dataset.zone = item.temp;
        card.dataset.hazmat = String(!!item.haz);
        const title = item.name;
        card.dataset.art = /clean|solvent|acetone|insulin/i.test(title) ? 'bottle' : /coffee|brew/i.test(title) ? 'coffee' : /salmon|fish/i.test(title) ? 'fish' : /lettuce|seed|nutrient/i.test(title) ? 'leaf' : /plier|part|tire/i.test(title) ? 'gear' : /oat|cream|drink/i.test(title) ? 'drink' : 'can';
        card.querySelector('.ad-card-note span').textContent = item.temp === 'chilled' ? '2–8°C' : item.temp === 'frozen' ? '≤−18°C' : '15–25°C';
      },
      laneHeader: (base, S) => (lane, spec) => {
        const head = base(lane, spec);
        if (spec.id === 'pool') {
          const title = S.ctx.util.el('span', 'wh-pool-title', head);
          const sort = S.ctx.util.el('div', 'wh-pool-sort', head);
          S.ctx.util.el('span', '', sort, 'Sort by');
          const button = S.ctx.util.el('button', '', sort, 'Name (A–Z)  ⌄');
          button.type = 'button';
          button.addEventListener('click', () => env.log('decoy', { label: 'Sort by' }));
        } else {
          const zone = spec.haz ? 'hazmat' : spec.temp;
          lane.dataset.zone = zone;
          head.querySelector('.ad-meta').textContent = zone.charAt(0).toUpperCase() + zone.slice(1);
          S.ctx.util.el('div', 'wh-bin-temp', head, spec.temp === 'chilled' ? '2–8°C' : spec.temp === 'frozen' ? '≤−18°C' : '15–25°C');
        }
        return head;
      },
      empty: (base, S) => (pane, lane) => {
        const empty = base(pane, lane);
        if (lane.id !== 'pool') empty.querySelector('span').textContent = 'Drop items here';
        return empty;
      },
      lanes: (base, S) => () => {
        base();
        S.ctx.util.el('h2', 'wh-storage-title', S.refs.lanes.get('pool').parentNode, `Storage bins (${S.spec.lanes.length})`);
      },
      facts: (base, S) => (model) => {
        base(model);
        const assigned = S.spec.items.filter(item => (model.assign[item.id] || 'pool') !== 'pool').length;
        const unassigned = S.spec.items.length - assigned;
        S.refs.heads.get('pool').querySelector('.wh-pool-title').textContent = `Unassigned items (${unassigned})`;
        const groups = { Ambient: 0, Chilled: 0, Frozen: 0, 'Hazmat certified': 0 };
        for (const lane of S.spec.lanes) {
          groups[lane.temp === 'chilled' ? 'Chilled' : lane.temp === 'frozen' ? 'Frozen' : 'Ambient']++;
          if (lane.haz) groups['Hazmat certified']++;
        }
        S.ctx.stage.dispatchEvent(new CustomEvent('warehouse-summary', { detail: {
          reference: S.refs.facts[2].textContent.replace(/^Dispatch reference:\s*/, ''),
          assigned, total: S.spec.items.length, bins: S.spec.lanes.length, groups,
        } }));
      },
      mirror: (base, S) => () => {
        const view = {};
        for (const [id, pane] of S.refs.panes) {
          // Pool cards share one horizontal row; destination cards form vertical rows.
          view[id] = { px: pane.scrollTop, h: pane.clientHeight,
            row: id === 'pool' ? 0 : S.D.cardHeight + S.D.cardGap };
        }
        if (JSON.stringify(view) !== JSON.stringify(S.ctx.model.view)) S.ctx.patch({ view });
      },
    },
  },
});

