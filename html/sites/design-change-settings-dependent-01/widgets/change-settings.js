// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-dependent-01',
  name: 'design',
  split: 'train',
  scenarios: ['dependent'],
  template: 'change-settings/preferences',
  design: {
    widthInset: 24, widthMax: 1600, tabWidthMin: 700, sideTabsAt: 700,
    titleSize: '0px', labelSize: '17px', detailSize: '14px', rowHeight: 74,
    minRowHeight: 32, descriptionAt: 999, onOffChance: 0,
    subtitles: [''], placeholders: [''],
    parts: {
      panel: (base, S) => (ctx, body) => {
        const panel = base(ctx, body);
        if (!S.geo.long) {
          panel.style.maxHeight = '100%';
          panel.style.boxSizing = 'border-box';
        }
        return panel;
      },
      select: (base, S) => (ctx, row, setting) => {
        const control = base(ctx, row, setting);
        // Menus belong above the scrolling rows, without being clipped by them.
        S.els.card.append(control.pop);
        return control;
      },
      paintRow: (base, S) => (model, id, row, visible, query) => {
        base(model, id, row, visible, query);
        if (!S.geo.long && S.ctx.size.height < 620) {
          Object.assign(row.row.style, { minHeight: '32px', padding: '4px 10px', gap: '4px 10px' });
          row.row.querySelector('.lab b').style.fontSize = '15px';
          if (row.kind === 'toggle') Object.assign(row.ctl.style, { width: '24px', height: '24px', lineHeight: '19px' });
          else if (row.kind === 'select') row.ctl.style.height = '30px';
          for (const heading of S.els.card.querySelectorAll('.sp-sec')) Object.assign(heading.style, { fontSize: '18px', padding: '4px 10px', marginBottom: '6px' });
        }
        if (row.kind !== 'select' || model.open !== id || !visible.has(id)) return;
        const card = S.els.card;
        const bounds = card.getBoundingClientRect();
        const trigger = row.ctl.getBoundingClientRect();
        const stage = S.ctx.stage.getBoundingClientRect();
        const menuHeight = row.pop.getBoundingClientRect().height;
        const top = Math.max(4, stage.top);
        const bottom = Math.min(window.innerHeight - 4, stage.bottom);
        const below = trigger.bottom - 4;
        const y = below + menuHeight <= bottom ? below : trigger.top - menuHeight + 4;
        row.pop.style.top = Math.max(top, Math.min(y, bottom - menuHeight)) - bounds.top - card.clientTop + 'px';
        row.pop.style.bottom = '';
        row.pop.style.right = Math.max(2, bounds.right - trigger.right) + 'px';
      },
    },
  },
});
