// WorkBench's numeric panel adds document controls and a task list, then fits it to the desktop canvas.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-11',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: { grips: ['se', 'e', 's', 'sw', 'w', 'ne', 'n', 'nw'] },
  template: 'resize-element/panel',
  design: {
    well: false,
    compact: false,
    parts: {
      origin: (base) => (ctx, ruler) => {
        const o = base(ctx, ruler);
        o.y = ruler ? 26 : 4;
        return o;
      },
      title: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const title = util.el('div', 'rz-title', S.frame.box);
        const dots = util.el('span', 'rz-dots', title);
        for (let i = 0; i < 3; i++) util.el('i', '', dots);
        util.el('span', '', title, spec.title);
        ctx.util.el('span', 'rz-wbtn rz-wmin', title, '_');
        ctx.util.el('span', 'rz-wbtn rz-wclose', title, '×');
        return title;
      },
      body: (base, S) => (ctx) => {
        const { util } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        util.el('div', 'rz-copy', body, 'Project kickoff went well. A few action items remain:');
        const actions = util.el('ul', 'rz-actions', body);
        for (const text of ['Confirm timeline with engineering', 'Share design mockups', 'Schedule next review']) {
          util.el('li', '', actions, text);
        }
        return body;
      },
      briefing: () => () => {},
      readout: (base, S) => (ctx) => {
        const readout = ctx.util.el('div', 'rz-readout', S.frame.box);
        readout.dataset.role = 'readout';
        S.frame.currentSize = ctx.util.el('span', 'rz-current', readout);
        readout.hidden = !ctx.spec.readout;
        return readout;
      },
      fit: (base, S) => (ctx) => {
        const F = S.frame;
        const textSize = parseFloat(getComputedStyle(ctx.stage).fontSize);
        const note = document.querySelector('.task-note');
        F.insetX = Math.max(18, ctx.size.width * 0.09);
        F.insetY = note?.hidden ? textSize * 9 : textSize * 1.2;
        return Math.min(
          1.45,
          (ctx.size.width - F.insetX - 20) / (F.W + (F.refW ? F.refW + 12 : 0)),
          (ctx.size.height - F.insetY - 18) / (F.H + (F.refH ? F.refH + 12 : 0)),
        );
      },
      paintReadout: (base, S) => (ctx, size) => {
        const { currentSize, zoom } = S.frame;
        currentSize.textContent = `Current size: ${size.w} × ${size.h} px`;
        S.frame.box.classList.toggle('rz-narrow', size.w < 500);
        S.frame.box.classList.toggle('rz-compact', size.h * zoom < 220);
      },
      place: (base, S) => () => {
        const { wrap, o, zoom, insetX, insetY } = S.frame;
        wrap.style.left = Math.max(12, insetX - o.x * zoom) + 'px';
        wrap.style.top = Math.max(12, insetY - o.y * zoom) + 'px';
      },
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
