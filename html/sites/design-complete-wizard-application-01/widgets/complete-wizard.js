// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-application-01',
  name: 'design',
  split: 'train',
  scenarios: ['application'],
  template: 'complete-wizard/stepper',
  design: {
    look: { ind: 'side', flat: true, title: false, stepHead: true, cols: 2, inline: false,
      width: 980, h: 50, r: 4, pad: 24, gap: 30, foot: 'right' },
    parts: {
      place: (base) => (ctx, fitted) => base(ctx, fitted, 0, 0),
      panel: () => (ctx, s, panel) => {
        const heading = panel.firstElementChild;
        if (heading && heading.tagName === 'H3') heading.classList.add('gtk-step-heading');
      },
      fit: (base) => (ctx, sampled, trial, maxFields) => {
        const look = base(ctx, sampled, trial, maxFields);
        look.width = ctx.size.width - 16;
        return look;
      },
      indicator: (base) => (ctx, s, look) => {
        const main = base(ctx, s, look);
        if (look.ind === 'side') {
          const compact = ctx.size.width < 850 || ctx.size.height < 520;
          const rail = compact ? 176 : 244;
          const stride = Math.min(98, Math.max(42, (ctx.size.height - 76) / s.ind.length));
          const ol = s.ind[0].parentElement;
          Object.assign(ol.style, { width: `${rail}px`, gap: '0' });
          for (const [i, li] of s.ind.entries()) {
            Object.assign(li.style, { minHeight: `${stride}px`, padding: '0',
              gap: compact ? '10px' : '20px', fontSize: compact ? '15px' : '20px',
              position: 'relative', background: 'transparent' });
            const dot = li.firstElementChild;
            const diameter = compact ? 32 : 48;
            Object.assign(dot.style, { width: `${diameter}px`, height: `${diameter}px`,
              fontSize: compact ? '18px' : '24px' });
            if (i < s.ind.length - 1) {
              const line = ctx.util.el('span', 'gtk-step-connector', li);
              Object.assign(line.style, { position: 'absolute', left: `${diameter / 2 - 1}px`,
                top: `${(stride + diameter) / 2 + 3}px`, width: '2px',
                height: `${Math.max(0, stride - diameter - 6)}px` });
            }
          }
        }
        return main;
      },
    },
  },
});
