env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-12',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  traits: { aspect: 1188 / 568, startBox: { x: 0.17, y: 0.12, w: 0.36, h: 0.45 } },
  template: 'crop-image/box',
  design: {
    fitMode: 'floor-width',
    insetX: 32,
    insetY: 32,
    placementPad: 10,
    placementClient: true,
    surfaceHandles: true,
    parts: {
      fit: (base) => (ctx, tools) => base({ ...ctx, size: {
        width: ctx.stage.clientWidth, height: ctx.stage.clientHeight,
      } }, tools),
      inspectorHeading: (base, S) => (ctx, inspector) => {
        const { util } = ctx;
        util.el('div', 'crop-image-info', inspector, 'Image:  lake_church.jpg\nImage size:  1024 × 576');
        const cropInfo = util.el('div', 'crop-reference-info', inspector);
        const targetInfo = util.el('div', 'crop-reference-info', inspector);
        const cropValues = util.el('div', 'crop-info-values', cropInfo);
        const targetValues = util.el('div', 'crop-info-values', targetInfo);
        util.el('strong', '', cropInfo, 'Crop box:');
        util.el('strong', '', targetInfo, 'Target box:');
        cropInfo.append(cropValues);
        targetInfo.append(targetValues);
        util.el('h3', 'crop-task-title', inspector, 'Task:');
        const taskSteps = util.el('ol', 'crop-task-steps', inspector);
        util.el('li', '', taskSteps, document.querySelector('.instruction')?.textContent || '');
        util.el('li', '', taskSteps, 'Click Submit when aligned.');
        Object.assign(S.els, { cropValues, targetValues, taskSteps });
      },
      inspected: (base, S) => (ctx, inspector) => {
        const { taskSteps, restore } = S.els;
        const display = document.body.dataset.instruction;
        const note = document.querySelector('.task-note');
        if (display === 'panel' || display === 'toast') {
          inspector.append(note);
          taskSteps.hidden = true;
          inspector.querySelector('.crop-task-title').hidden = true;
        }
        if (display === 'hidden') {
          taskSteps.hidden = true;
          inspector.querySelector('.crop-task-title').hidden = true;
        }
        const end = document.querySelector('[data-role="submit"]');
        taskSteps.lastChild.textContent = end ? `Click ${end.textContent} when aligned.` : 'Finish when aligned.';
        document.querySelector('.footer-tools').prepend(restore);
        inspector.style.top = ctx.stage.getBoundingClientRect().top - document.querySelector('.shell').getBoundingClientRect().top + 6 + 'px';
      },
      measure: (base, S) => (ctx, m) => {
        base(ctx, m);
        const px = (v, s) => Math.round(v * s);
        S.els.cropValues.textContent = `${px(m.r - m.l, 1024)} × ${px(m.b - m.t, 576)}\nPosition: (${px(m.l, 1024)}, ${px(m.t, 576)})`;
        const t = ctx.spec.target;
        S.els.targetValues.textContent = `${px(t.r - t.l, 1024)} × ${px(t.b - t.t, 576)}\nPosition: (${px(t.l, 1024)}, ${px(t.t, 576)})`;
      },
      rendered: (base, S) => () => {
        const { bar, wrap } = S.els;
        if (bar) bar.style.width = 'max-content';
        wrap.style.width = `${wrap.getBoundingClientRect().width}px`;
      },
    },
  },
});
