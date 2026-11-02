// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-application-03',
  name: 'design',
  split: 'train',
  scenarios: ['application'],
  template: 'complete-wizard/stepper',
  design: {
    look: { ind: 'circles', flat: true, title: false, stepHead: true, cols: 1, inline: false, hints: false, h: 46, r: 7, pad: 28, gap: 8 },
    parts: {
      fit: (base) => (ctx, look, attempt, maxFields) => base(ctx, {
        ...look,
        width: ctx.size.width - 24,
        h: ctx.size.height >= 700 ? 46 : 36,
        pad: ctx.size.height >= 700 ? 28 : 18,
      }, attempt, maxFields),
      indicatorItem: (base) => (ctx, ol, name, i, look) => {
        const item = base(ctx, ol, name, i, look);
        if (look.ind === 'circles') {
          Object.assign(item.style, { flexDirection: 'column', gap: '10px', fontSize: '15px' });
          const dot = item.firstElementChild;
          Object.assign(dot.style, { width: '38px', height: '38px', fontSize: '20px' });
        }
        return item;
      },
      stepPanel: (base) => (ctx, s, body, step, i, look) => {
        base(ctx, s, body, step, i, look);
        if (look.stepHead) {
          const heading = s.panels[i].el.firstElementChild;
          Object.assign(heading.style, { fontSize: ctx.size.height >= 700 ? '40px' : '28px', fontWeight: '650' });
          if (i === 0) {
            const intro = ctx.util.el('p', 'app-form-intro', null, 'Tell us who you are and how to contact you.');
            Object.assign(intro.style, { margin: '0 0 18px', fontSize: '18px', color: '#c7d0db' });
            heading.after(intro);
          }
        }
      },
    },
  },
});
