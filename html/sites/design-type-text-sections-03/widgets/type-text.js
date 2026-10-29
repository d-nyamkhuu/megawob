// Design on templates/type-text/base.js, measured inside the available stage.
env.widget({
  task: 'type-text',
  site: 'design-type-text-sections-03',
  name: 'design',
  split: 'train',
  scenarios: ['sections'],
  template: 'type-text/base',
  design: {
    parts: {
      // Keep the visual design in the widget so the template measures it while fitting.
      ensureStyle: (base) => function () {
        base();
        if (document.getElementById('sections-design')) return;
        const style = document.createElement('style');
        style.id = 'sections-design';
        style.textContent = `
          .ds-stage .ft-card {
            width: var(--ds-card-width); max-width: none; margin: 0; padding: 0;
            border: 0; border-radius: 0; background: transparent; box-shadow: none; color: var(--fg);
          }
          .ds-stage .ft-card h2, .ds-stage .ft-sub { display: none; }
          .ds-stage .ft-label { font-size: var(--ds-label-size); font-weight: 500; color: #18223c; }
          .ds-stage .ft-input {
            border: 1px solid #cbd6e4; border-radius: 9px; background: #fff; color: #17213b;
            box-shadow: inset 0 1px 2px #263d5b0a, 0 1px 2px #263d5b0a;
          }
          .ds-stage .ft-input:focus { border-color: #1680ff; box-shadow: 0 0 0 3px #1680ff21; }
          .ds-stage .ft-acc { gap: var(--ds-acc-gap); }
          .ds-stage .ft-acc-sec {
            border: 1px solid #e0e9f4; border-radius: 14px; background: #fff;
            box-shadow: 0 3px 10px #24395508;
          }
          .ds-stage .ft-acc-h {
            min-height: var(--ds-section-h); padding: var(--ds-header-y) var(--ds-body-x); border-radius: 13px;
            background: #f5f8fc; color: #141d37; font-size: var(--ds-section-size); font-weight: 700;
          }
          .ds-stage .ft-acc-sec:first-child .ft-acc-h[aria-expanded=true] { background: #eaf3ff; }
          .ds-stage .ft-acc-h .chev { font-size: 0; color: #197eff; }
          .ds-stage .ft-acc-h .chev:after { content: '⌄'; font-size: var(--ds-chevron-size); line-height: 1; }
          .ds-stage .ft-acc-h[aria-expanded=true] .chev:after { content: '⌃'; }
          .ds-stage .ft-acc-b { padding: var(--ds-body-y) var(--ds-body-x); }
          .ds-stage .ft-actions { margin-top: var(--ds-action-gap); }
          .ds-stage .ft-save { height: var(--ds-save-h); border-radius: 9px; background: #147af2; font-size: 17px; }
          .ds-stage .ft-status { font-size: 14px; }
        `;
        document.head.appendChild(style);
      },
      build: (base) => function (ctx, look) {
        const tight = look.vars['--ft-pad'] === '16px';
        const compact = ctx.size.height < 600 || tight;
        Object.assign(look.vars, {
          '--ds-card-width': `${Math.max(0, Math.floor(ctx.size.width - 24))}px`,
          '--ds-section-h': `${tight ? 30 : compact ? 60 : 88}px`,
          '--ds-section-size': `${tight ? 16 : compact ? 19 : 23}px`,
          '--ds-label-size': `${tight ? 14 : compact ? 16 : 19}px`,
          '--ds-acc-gap': `${tight ? 4 : compact ? 10 : 16}px`,
          '--ds-body-x': `${compact ? (tight ? 14 : 24) : 34}px`,
          '--ds-body-y': `${tight ? 4 : compact ? 18 : 26}px`,
          '--ds-header-y': `${tight ? 4 : 8}px`,
          '--ds-chevron-size': `${tight ? 16 : 28}px`,
          '--ds-action-gap': `${tight ? 12 : 19}px`,
          '--ds-save-h': `${tight ? 34 : 38}px`,
        });
        if (tight) {
          look.vars['--ft-h'] = '30px';
          look.vars['--ft-gap'] = '6px';
        }
        if (!compact) {
          look.vars['--ft-h'] = '52px';
          look.vars['--ft-fs'] = '18px';
        }
        return base(ctx, look);
      },
    },
  },
});
