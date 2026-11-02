// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-mixed-01',
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
          .office-settings { margin:0 auto; align-self:flex-start; }
          .office-settings .sp-card { width:100%; min-height:0; box-shadow:none; }
          .office-settings .sp-head { display:grid; position:relative; grid-template-columns:minmax(0,1fr) 128px;
            grid-template-rows:var(--office-title-row) 48px; padding:10px 16px 8px; gap:0 14px; border-bottom:0; }
          .office-settings .sp-head::after { content:''; position:absolute; left:14px; right:14px;
            top:calc(var(--office-title-row) + 10px); height:2px; background:#a31616; }
          .office-settings .sp-head .t { grid-column:1 / 3; grid-row:1; min-width:0; align-self:center; }
          .office-settings .sp-head .sub { display:none; }
          .office-settings .sp-search { grid-column:1; grid-row:2; width:auto; min-width:0; height:38px; align-self:end; }
          .office-settings .sp-head .sp-btn { grid-column:2; grid-row:2; align-self:end; }
          .office-settings .sp-body { min-height:0; }
          .office-settings .sp-tabs, .office-settings .sp-index { width:var(--office-tabs-width); padding:12px 0 12px 14px; gap:0; }
          .office-settings .sp-tab, .office-settings .sp-index a { display:flex; align-items:center;
            min-height:var(--office-tab-height); padding:4px 12px; box-sizing:border-box; white-space:normal; flex:none; }
          .office-settings .sp-panel { padding:8px var(--office-panel-pad) 12px; }
          .office-settings .sp-row { gap:12px; padding:4px 0; }
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
        const height = Math.max(240, ctx.size.height - 24);
        const width = Math.min(1040, ctx.size.width * .96);
        const compact = height < 520;
        const head = compact ? 36 : 54;
        const panelHeight = height - head - 66 - 48;
        wrap.style.width = 'min(1040px, 96%)';
        if (!S.geo.long) wrap.style.height = height + 'px';
        wrap.style.setProperty('--office-title-row', head + 'px');
        wrap.style.setProperty('--office-tabs-width', (width < 800 ? 190 : 246) + 'px');
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
        const height = Math.max(240, ctx.size.height - 24);
        const head = height < 520 ? 36 : 54;
        const rowH = Math.max(36, Math.min(58, Math.floor((height - head - 66 - 48 - 56) / env.taskDef.helpers.RESULT_CAP)));
        return { ...geo, sideTabs:true, rowH, showDesc:rowH >= 52 };
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
