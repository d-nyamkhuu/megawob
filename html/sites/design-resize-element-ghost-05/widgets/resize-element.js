// Design on templates/resize-element/panel.js.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-05',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: {'grips': ['se', 'e', 's', 'sw', 'w', 'ne', 'n', 'nw'], 'lock': true},
  template: 'resize-element/panel',
  design: {
    messages: [['TomH', 'The park is going to be a great addition!'], ['LisaM', 'I hope they add a swing set too.']],
    messageTime: 'archive', bodyScroll: true, compactHeight: 200, topFraction: 0, extraScaleVar: '--rz-zoom',
    parts: {
      geometry: (base, S) => (ctx) => {
        const F = S.frame;
        F.baseW = Math.min(180, ctx.size.width * 0.2);
        F.baseH = ctx.size.height * 0.72;
        F.dragX = (ctx.size.width - F.baseW - 8) / F.W;
        F.dragY = (ctx.size.height - F.baseH - 8) / F.H;
        F.areaW = F.baseW + F.W * F.dragX;
        F.areaH = F.baseH + F.H * F.dragY;
      },
      displaySize: (base, S) => (s) => ({ w: S.frame.baseW + s.w * S.frame.dragX, h: S.frame.baseH + s.h * S.frame.dragY }),
      rectOf: (base, S) => (s) => {
        const F = S.frame, d = S.P.displaySize(s);
        return { x: F.ax ? F.areaW - F.o.x - d.w : F.o.x, y: F.ay ? F.areaH - F.o.y - d.h : F.o.y, w: d.w, h: d.h };
      },
      ghostContent: () => (ctx, ghost) => ctx.util.el('div', 'rz-ghost-hint', ghost, 'Drag the bottom-right handle to resize the panel.'),
      fit: () => () => 1,
      decorate: (base, S) => (ctx, s) => {
        const ghost = S.frame.ghost;
        if (!ghost) return;
        const hint = ghost.firstChild, d = S.P.displaySize(s), g = S.P.displaySize(ctx.spec.target);
        hint.hidden = g.w <= d.w + 120 && g.h <= d.h + 45;
        if (g.w > d.w + 120) Object.assign(hint.style, { left: d.w + 15 + 'px', right: '12px', top: '50%', transform: 'translateY(-50%)' });
        else Object.assign(hint.style, { left: '8px', right: '8px', top: d.h + 6 + 'px', transform: 'none' });
      },
    },
  },
});
