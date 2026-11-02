// Keep the reference form's behavior, sizing the patient-records design from its stage.
env.widget({
  task: 'type-text',
  site: 'design-type-text-complete-04',
  name: 'design',
  split: 'train',
  scenarios: ['complete'],
  template: 'type-text/base',
  design: {
    parts: {
      build: (base, S) => (ctx, look) => {
        const { width, height } = ctx.size;
        const withCard = ctx.spec.source === 'card';
        const formWidth = (width - 24) * (withCard ? 0.615 : 1) - (withCard ? 14 : 0);
        const compact = height < 540 || formWidth < 500;
        const count = ctx.spec.fields.length;
        const pad = compact ? 12 : 22;
        const gap = compact ? 4 : 17;
        const error = ctx.spec.save ? (compact ? 12 : 16) : 0;
        const available = height - 18 - pad * 2 - (compact ? 56 : 60) - (ctx.spec.save ? 46 : 0);
        const h = Math.max(24, Math.min(44, Math.floor(available / count - gap - error - 2)));
        return base(ctx, {
          ...look, layout: 'inline', aside: 'left', caps: false, underline: false,
          subtitle: '',
          vars: {
            ...look.vars,
            '--patient-width': `${Math.max(0, width - 24)}px`,
            '--patient-height': `${Math.max(0, height - 16)}px`,
            '--patient-label': `${Math.max(95, Math.min(178, formWidth * 0.36))}px`,
            '--patient-font': `${compact ? 14 : 19}px`,
            '--patient-title': `${compact ? 19 : 24}px`,
            '--patient-error': `${error}px`,
            '--patient-avatar-width': `${compact ? 34 : 146}px`,
            '--patient-avatar-height': `${compact ? 34 : 157}px`,
            '--ft-h': `${h}px`, '--ft-gap': `${gap}px`, '--ft-pad': `${pad}px`,
            '--ft-fs': `${compact ? 15 : 19}px`, '--ft-align': 'left',
          },
        });
      },
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('patient-form-style')) return;
        const style = document.createElement('style');
        style.id = 'patient-form-style';
        style.textContent = `
        .ft-wrap { width:var(--patient-width); height:var(--patient-height); gap:14px; align-items:stretch; }
        .ft-wrap.left .ft-card { width:calc(61.5% - 14px); }
        .ft-wrap .ft-profile { width:38.5%; }
        .ft-card { width:var(--patient-width); height:var(--patient-height); padding:var(--ft-pad); }
        .ft-wrap .ft-card { height:100%; }
        .ft-card h2 { font-size:var(--patient-title); margin:0 0 14px; padding-bottom:11px; border-bottom:1px solid var(--line); }
        .ft-grid.inline { grid-template-columns:var(--patient-label) minmax(0,1fr); column-gap:12px; }
        .ft-label { font-size:var(--patient-font); font-weight:400; }
        .ft-grid.inline .ft-label { padding-top:calc(var(--ft-h) / 2 - 9px); }
        .ft-grid.inline .ft-err { height:var(--patient-error); line-height:var(--patient-error); font-size:11px; }
        .ft-actions { margin-top:12px; }
        .ft-save { height:34px; padding:4px 16px; font-size:15px; }
        .ft-profile { padding:var(--ft-pad); font-size:var(--patient-font); }
        .ft-profile-h { font-size:var(--patient-title); }
        .ft-avatar { width:var(--patient-avatar-width); height:var(--patient-avatar-height); border-radius:3px; }
        `;
        document.head.append(style);
      },
    },
  },
});
