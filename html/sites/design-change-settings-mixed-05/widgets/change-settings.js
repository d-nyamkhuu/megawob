// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-mixed-05',
  name: 'design',
  split: 'train',
  scenarios: ['mixed'],
  template: 'change-settings/preferences',
  design: {
    parts: {
      style: (base) => (ctx) => {
        base(ctx);
        if (document.getElementById('office-settings-style')) return;
        const style = ctx.util.el('style', '', document.head);
        style.id = 'office-settings-style';
        style.textContent = `
          .office-settings { margin:0 auto; align-self:stretch; }
          .office-settings .sp-card { width:100%; min-height:0; box-shadow:none; }
          .office-settings .sp-head { display:grid; position:relative; grid-template-columns:160px minmax(0,1fr);
            grid-template-rows:40px; padding:10px 16px 8px; gap:0 12px; border-bottom:0; }
          .office-settings .sp-head .t { display:none; }
          .office-settings .sp-head .sub { display:none; }
          .office-settings .sp-search { grid-column:2; grid-row:1; width:auto; min-width:0; height:36px; align-self:center; }
          .office-settings .sp-head .sp-btn { display:none; }
          .office-settings .sp-body { min-height:0; display:flex; flex-direction:column; }
          .office-settings .sp-tabs, .office-settings .sp-index { width:100%; height:48px; padding:0 14px; gap:0; flex-direction:row; }
          .office-settings .sp-tab, .office-settings .sp-index a { display:flex; align-items:center;
            height:48px; padding:4px 18px; box-sizing:border-box; white-space:nowrap; flex:none; }
          .office-settings .sp-panel { flex:1; overflow:auto; padding:18px 28px 12px; }
          .office-settings .sp-row { gap:12px; padding:5px 0; }
          .office-settings .sp-row .tag { display:none; }
          .office-settings .sp-switch { width:62px; height:36px; }
          .office-settings .sp-switch::after { width:28px; height:28px; top:4px; left:4px; }
          .office-settings .sp-switch.on::after { left:30px; }
          .office-settings .sp-onoff { width:40px; }
          .office-settings .sp-select { min-width:var(--office-select-width); height:38px; }
          .office-settings .sp-num input { width:90px; height:38px; }
          .office-settings .sp-foot { padding:7px 16px; }
          .office-settings .sp-btn { height:32px; }
          .office-settings:not(.sp-long) .sp-card { height:100%; }
          .office-settings:not(.sp-long) .sp-panel { height:auto; }
        `;
      },
      wrap: (base, S) => (ctx) => {
        const wrap = base(ctx);
        wrap.classList.add('office-settings');
        const height = Math.max(240, ctx.size.height - 100);
        const width = ctx.size.width * .99;
        const compact = height < 520;
        const head = compact ? 36 : 54;
        const panelHeight = height - head - 66 - 48;
        wrap.style.width = '99%';
        wrap.style.height = height + 'px';
        wrap.style.setProperty('--office-title-row', head + 'px');
        wrap.style.setProperty('--office-tabs-width', '100%');
        wrap.style.setProperty('--office-tab-height', Math.min(60, Math.max(28, (panelHeight - 24) / ctx.spec.sections.length)) + 'px');
        wrap.style.setProperty('--office-panel-pad', (width < 800 ? 16 : 34) + 'px');
        wrap.style.setProperty('--office-select-width', (width < 800 ? 180 : 290) + 'px');
        return wrap;
      },
      width: (base, S) => (ctx) => {
        base(ctx); // Preserve the template's seeded width draw.
        return S.els.wrap.getBoundingClientRect().width;
      },
      geometry: (base, S) => (ctx) => {
        const geo = base(ctx);
        if (geo.long) return geo;
        const height = Math.max(240, ctx.size.height - 100);
        const head = height < 520 ? 36 : 54;
        const rowH = Math.max(36, Math.min(58, Math.floor((height - head - 66 - 48 - 56) / env.taskDef.helpers.RESULT_CAP)));
        return { ...geo, sideTabs:false, rowH, showDesc:rowH >= 52 };
      },
      place: (base, S) => (ctx) => {
        base(ctx); // Preserve the sampled placement draw in tabbed episodes.
        S.els.wrap.style.marginTop = '0';
      },
      // This design scrolls the settings inside the paper sheet. Long-layout
      // menus must fit that pane, rather than assuming the whole page scrolls.
      paintRow: (base, S) => (model, id, row, visible, query) => {
        base(model, id, row, visible, query);
        if (row.kind !== 'select' || model.open !== id || !visible.has(id)) return;
        const panel = S.els.panel;
        const bounds = panel.getBoundingClientRect();
        const rect = row.row.getBoundingClientRect();
        const bottom = Math.min(window.innerHeight, bounds.top + panel.clientTop + panel.clientHeight);
        const below = rect.bottom + row.pop.offsetHeight <= bottom;
        row.pop.style.top = below ? 'calc(100% - 4px)' : '';
        row.pop.style.bottom = below ? '' : 'calc(100% - 4px)';
      },
    },
  },
});
