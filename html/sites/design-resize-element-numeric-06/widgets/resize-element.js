// Keeps the origin-aligned inspector, its live dimensions, and the original compact sizing.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-06',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    origin: 'zero',
    parts: {
      geometry: (base, S) => (ctx) => {
        const F = S.frame;
        F.o = { x: 0, y: 0 };
        F.W = F.o.x + F.lim.max.w;
        F.H = F.o.y + F.lim.max.h;
      },
      body: (base, S) => (ctx) => {
        const { util } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        S.frame.whW = util.el('div', 'rz-wh', body);
        S.frame.whH = util.el('div', 'rz-wh', body);
        util.el('hr', 'rz-hr', body);
        util.el('div', 'rz-sec', body, 'Content');
        for (const [key, value] of [
          ['Title:', 'Project Plan'],
          ['Type:', 'Document'],
          ['Status:', 'Draft'],
        ]) {
          const row = util.el('div', 'rz-row', body);
          util.el('span', '', row, key);
          util.el('span', 'rz-field', row, value);
        }
        return body;
      },
      briefing: (base, S) => (ctx) => {
        base(ctx);
        const gripNames = {
          se: 'bottom-right corner', sw: 'bottom-left corner',
          ne: 'top-right corner', nw: 'top-left corner',
          e: 'right edge', w: 'left edge', n: 'top edge', s: 'bottom edge',
        };
        const academicStep = document.querySelector('.academic .margin ol li');
        if (academicStep) academicStep.textContent = `Move the pointer to the ${gripNames[ctx.spec.grip]} of the “${ctx.spec.title}” panel.`;
      },
      compact: (base, S) => (ctx, size) => {
        base(ctx, size);
        const { box, zoom } = S.frame;
        box.style.setProperty('--panel-unit', Math.min(1.2, Math.max(0.25, (size.h * zoom - 48) / 290)) + 'px');
        box.classList.toggle('narrow', size.w * zoom < 240);
      },
      drawn: (base, S) => (ctx, size) => {
        S.frame.whW.textContent = `Width:   ${size.w} px`;
        S.frame.whH.textContent = `Height:  ${size.h} px`;
      },
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
