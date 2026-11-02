// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-search-03',
  name: 'design',
  split: 'train',
  scrollable: (spec) => !!spec.scroll,
  scenarios: ['search'],
  template: 'change-settings/preferences',
  design: {
    foreground: '#111318', muted: '#4d5056', panel: '#e1e3e7', background: '#d7d9dd',
    line: '#969ba4', accent: '#79aaf2', font: 'inherit', minWidth: 480, widthInset: 0,
    tabWidthMin: 0, widthMax: 1800, sideTabsAt: 1800, rowHeight: 68, minRowHeight: 52,
    descriptionAt: 999, bottomSpace: 48,
    parts: {
      toggle: (base) => (ctx, row, setting) => {
        const result = base(ctx, row, setting);
        Object.assign(result.ctl.style, { width:'27px', minWidth:'27px', height:'27px', boxSizing:'border-box' });
        return result;
      },
      place: (base, S) => (ctx) => {
        base(ctx);
        S.els.wrap.style.marginTop = '0';
      },
      wrap: (base) => (ctx) => {
        const wrap = base(ctx);
        wrap.style.margin = '0';
        return wrap;
      },
      width: (base) => (ctx) => {
        base(ctx); // Preserve the template's seeded width sample.
        return ctx.size.width;
      },
      header: (base) => (ctx, card) => {
        const result = base(ctx, card);
        result.head.firstElementChild.hidden = true;
        Object.assign(result.head.style, { padding: '0 20px 20px', minHeight: '64px', boxSizing: 'border-box' });
        Object.assign(result.sInput.parentElement.style, { flex: '1 1 0', width: 'auto', height: '40px', boxSizing: 'border-box' });
        return result;
      },
    },
  },
});
