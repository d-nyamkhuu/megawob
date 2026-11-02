// Keep the reference behavior; size the reservation rows to the available stage.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-countdown-01',
  name: 'design',
  split: 'train',
  scenarios: ['countdown'],
  template: 'act-in-time/base',
  design: {
    parts: {
      buildCountdown: (base) => (ctx, frame) => {
        const compact = ctx.size.height < 450;
        const padding = compact ? 10 : 16;
        const gap = compact ? 5 : 9;
        const book = compact ? 40 : 54;
        const groupPadding = compact ? 4 : 10;
        const label = compact ? 19 : 25;
        const row = (ctx.size.height * .94 - padding * 2 - gap * 3 - book) / 3;
        const chip = Math.min(compact ? 42 : 60, Math.floor(row - groupPadding * 2 - label * 1.2 - 10));
        const properties = {
          '--hold-padding': padding + 'px', '--hold-gap': gap + 'px',
          '--hold-book-height': book + 'px', '--hold-group-padding': groupPadding + 'px',
          '--hold-label-size': label + 'px', '--hold-chip-height': Math.max(20, chip) + 'px',
          '--hold-chip-font': (compact ? 15 : 20) + 'px',
        };
        for (const [key, value] of Object.entries(properties)) frame.body.style.setProperty(key, value);
        return base(ctx, frame);
      },
    },
  },
});
