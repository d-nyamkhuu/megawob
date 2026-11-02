// Keep this spinner's filled arrows and add its calibration settings and profile controls.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-spinner-10',
  name: 'design',
  split: 'train',
  scenarios: ['spinner'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {
    upSvg: '<svg viewBox="0 0 20 12" fill="currentColor"><path d="M0 12L10 0L20 12Z"/></svg>',
    downSvg: '<svg viewBox="0 0 20 12" fill="currentColor"><path d="M0 0L10 12L20 0Z"/></svg>',
    parts: {
      rendered: (base) => (ctx, view, look, box) => {
        base(ctx, view, look, box);
        if (ctx.spec.scenario !== 'spinner') return;
        const body = view.card.querySelector('.ut-body');
        [['Font Family:', 'DejaVu Sans Mono'], ['Font Style:', 'Regular'], ['Line Spacing:', '1.0　　▴　▾　 x']].forEach(([label, value]) => {
          const row = ctx.util.el('div', 'calib-setting-row', body);
          ctx.util.el('span', 'calib-setting-label', row, label);
          ctx.util.el('span', 'calib-setting-value', row, value);
        });
        const profile = ctx.util.el('div', 'calib-profile-controls', view.card);
        ctx.util.el('span', 'calib-active-label', profile, 'Active Profile:');
        ctx.util.el('span', 'calib-profile-value', profile, 'Workstation');
        const load = ctx.util.el('button', 'calib-profile-button', profile, 'Load...');
        const save = ctx.util.el('button', 'calib-profile-button', profile, 'Save...');
        load.type = save.type = 'button';
        load.addEventListener('click', () => env.log('decoy', { label: 'Load...' }));
        save.addEventListener('click', () => env.log('decoy', { label: 'Save...' }));
      },
    },
  },
});
