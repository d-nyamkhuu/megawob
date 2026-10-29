// Keeps the original dated chat rows, decorative grip and pointer on the shared ghost panel.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-08',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: {
    grips: ['se'],
    geometry: { start: { w: [390, 430], h: [355, 390] }, target: { w: 560, h: 440 } },
  },
  template: 'resize-element/panel',
  design: {
    messages: [
      ['Taylor', 'Looks good overall.', 'Apr 21'],
      ['Morgan', 'Consider a simpler hero image.', 'Apr 22'],
      ['Casey', 'Let’s review the mobile layout.', 'Apr 22'],
    ],
    topFraction: 0,
    parts: {
      body: (base, S) => (ctx) => {
        const { util } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        for (const [name, text, date] of S.D.messages) {
          const message = util.el('div', 'cm-item', body);
          const author = util.el('div', 'cm-head', message);
          util.el('strong', '', author, name);
          util.el('span', 'cm-date', author, date);
          util.el('p', '', message, text);
        }
        util.el('div', 'cm-grip', S.frame.box);
        return body;
      },
      handle: (base, S) => (ctx, handle, name) => {
        base(ctx, handle, name);
        if (name !== ctx.spec.grip) return;
        const pointer = ctx.util.svg('svg', {
          class: 'e8-pointer', viewBox: '0 0 28 38', fill: '#111', stroke: '#fff', 'stroke-width': 2,
        }, handle);
        ctx.util.svg('path', { d: 'M2 2V29L9 23L15 35L21 32L15 21H25Z' }, pointer);
      },
    },
  },
});
