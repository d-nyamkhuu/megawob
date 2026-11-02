// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-crm-04',
  name: 'design',
  split: 'train',
  scenarios: ['crm'],
  template: 'use-data-grid/grid',
  design: {
    contextAt: 0,
    contextHeight: 0,
    contextWidth: 220,
    navWidth: 0,
    railWidth: 0,
    cardInsetY: 18,
    cardTop: 0,
    fixedHeight: 142,
    rowMax: 49,
    extraCss: `
      .to-card { font:14px/1.35 Arial,sans-serif; }
      .to-context { top:0; overflow:auto; }
      .to-tools { height:34px; }
      .to-hrow { height:50px; }
      .to-h { font-size:14px; }
      .to-foot { height:34px; }
      .to-facts { height:22px; }
      .crm-inspector-utilities { margin-top:18px; border-top:1px solid var(--line); }
      .crm-inspector-utilities .to-appbar { height:auto; flex-wrap:wrap; gap:6px; padding:10px 0; }
      .crm-inspector-utilities .to-global { margin:0; width:100%; }
      .crm-inspector-utilities .to-nav { position:static; width:auto; display:grid; grid-template-columns:1fr 1fr; padding:8px 0; border:0; }
      .crm-inspector-utilities .to-nav small { grid-column:1 / -1; }
      .crm-inspector-utilities .to-nav .nav-label { display:inline; }
      .crm-inspector-utilities .to-head { height:auto; flex-wrap:wrap; padding:10px 0; }
      .crm-inspector-utilities .to-tabs { height:auto; flex-wrap:wrap; padding:8px 0; gap:8px; }
    `,
    parts: {
      heading(base, S) {
        return function () {
          S.scale = Math.min(S.scale, (S.cardW - 46) / S.nominal);
          base();
          S.ctx.stage.querySelector('.crm-inspector-utilities').appendChild(S.head);
        };
      },
      tabs(base, S) {
        return function () {
          base();
          S.ctx.stage.querySelector('.crm-inspector-utilities').appendChild(S.tabs);
        };
      },
      contextPanel(base, S) {
        return function () {
          base();
          const panel = S.ctx.stage.querySelector('.to-context');
          if (!panel) return;
          panel.replaceChildren();
          const el = (tag, cls, parent, text) => S.ctx.util.el(tag, cls, parent, text);
          el('div', 'crm-inspector-head', panel, 'Ticket Details');
          const row = S.spec.rows[0];
          if (!row) return;
          const fields = el('div', 'crm-inspector-fields', panel);
          for (const col of S.spec.cols) {
            const line = el('div', 'crm-inspector-field', fields);
            el('strong', '', line, col.label);
            el('span', '', line, S.fam.helpers.cellText(S.spec, row, col.id, S.ctx.model));
          }
          const utilities = el('div', 'crm-inspector-utilities', panel);
          utilities.appendChild(S.appbar);
          S.nav.hidden = false;
          utilities.appendChild(S.nav);
        }
      },
    },
  },
});
