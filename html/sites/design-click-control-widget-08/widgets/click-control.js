// Design of this site on click-control/controls: compact large widget forms to keep every row in view.
env.widget({
  task: 'click-control',
  site: 'design-click-control-widget-08',
  name: 'design',
  split: 'train',
  scenarios: ['widget'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      widgetsBuilt: () => (ctx, card, rows, r) => {
        card.style.setProperty('--widget-rows', String(Math.max(3, Math.ceil(rows.length / 2))));
        if (rows.length > 6) card.classList.add('uc-wlist-many');
        // Compact only forms that would otherwise extend below the clipped stage.
        if (rows.length > 6 && card.scrollHeight > r.height) {
          const rowCount = Math.ceil(rows.length / 2);
          const rowHeight = (r.height - 12 - Math.max(0, rowCount - 1) * 4) / rowCount;
          card.classList.add('uc-wlist-compact');
          card.style.setProperty('--widget-compact-font', Math.max(9, Math.min(16, (rowHeight - 4) / 3.4)) + 'px');
        }
      },
    },
  },
});
