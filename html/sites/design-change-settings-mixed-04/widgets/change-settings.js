// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-mixed-04',
  name: 'design',
  split: 'train',
  scenarios: ['mixed'],
  template: 'change-settings/preferences',
  design: {
    widthMax: 1100, tabWidthMin: 1, titleSize: '20px', rowHeight: 88, minRowHeight: 44,
    descriptionAt: 52, sideTabsAt: 1, wideHeadAt: 640,
    parts: {
      title(base, S) {
        return function (ctx, head) {
          base(ctx, head);
          // Fill the framed stage before the template calculates row geometry.
          // Keep the template's width draw, but avoid a narrow random card whose
          // wrapped labels can exceed the calculated compact row height.
          const cardW = Math.max(480, Math.min(1100, ctx.size.width - 44));
          S.geo.cardW = cardW;
          head.parentElement.style.width = cardW + 'px';
          const title = head.querySelector('h1');
          if (title) title.textContent = 'Preferences';
          if (title) {
            const icon = ctx.util.el('span', 'prefs-gear', title, '⚙ ');
            title.insertBefore(icon, title.firstChild);
          }
        };
      },
    },
  },
});
