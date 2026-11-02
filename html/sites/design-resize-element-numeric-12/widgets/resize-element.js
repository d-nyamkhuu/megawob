// This design shows the target instruction inside the panel and fits the full workspace.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-12',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    parts: {
      body: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        S.frame.instructionText = document.querySelector('.instruction')?.textContent || '';
        const pxRow = (label) => {
          const row = util.el('div', 'rz-px', body);
          util.el('span', 'rz-k', row, label);
          return util.el('span', 'rz-v', row, '');
        };
        S.frame.wVal = pxRow('Width:');
        S.frame.hVal = pxRow('Height:');
        util.el('div', 'rz-sep', body);
        util.el('div', 'rz-tg', body, 'Target size:');
        const target = util.el('div', 'rz-tg', body, '');
        target.textContent = S.frame.instructionText;
        target.classList.add('rz-target-copy');
        return body;
      },
      briefing: (base, S) => (ctx) => {
        const gripNames = {
          se: 'bottom-right corner', sw: 'bottom-left corner', ne: 'top-right corner', nw: 'top-left corner',
          e: 'right edge', w: 'left edge', n: 'top edge', s: 'bottom edge',
        };
        const sub = document.querySelector('.instruction-sub');
        if (sub) sub.textContent = `Drag the ${gripNames[ctx.spec.grip]} to resize.\nRead the current size in the panel.`;
        const firstStep = document.querySelector('.n-body li');
        if (firstStep) firstStep.textContent = `Drag the ${gripNames[ctx.spec.grip]} of the ${ctx.spec.title} panel.`;
      },
      handle: (base) => (ctx, handle, name) => {
        if (name !== ctx.spec.grip || !/[ew]/.test(name) || !/[ns]/.test(name)) return;
        const cursor = ctx.util.svg('svg', { class: 'rz-pointer', width: 27, height: 40, viewBox: '0 0 27 40', 'aria-hidden': 'true' }, handle);
        ctx.util.svg('path', {
          d: 'M2 1V29L9 23L16 37L21 34L14 21H24Z', fill: '#fff', stroke: '#0c2a52',
          'stroke-width': 2, 'stroke-linejoin': 'miter',
        }, cursor);
      },
      paintWell: (base, S) => (ctx, size) => {
        const { util } = ctx;
        const { well, wVal, hVal, instructionText } = S.frame;
        if (!well) return;
        wVal.textContent = `${size.w} px`;
        hVal.textContent = `${size.h} px`;
        well.textContent = '';
        const currentRow = util.el('div', '', well);
        util.el('span', 'well-label', currentRow, 'Current size:');
        util.el('span', '', currentRow, `${size.w} px (width) × ${size.h} px (height)`);
        const targetRow = util.el('div', '', well);
        util.el('span', 'well-label', targetRow, 'Target size:');
        util.el('span', '', targetRow, instructionText);
      },
      fit: (base, S) => (ctx) => {
        const { lim, well, W, H } = S.frame;
        return Math.min(
          1,
          (ctx.size.width - 18) / lim.max.w,
          (ctx.size.height - well.offsetHeight - 42) / lim.max.h,
          (ctx.size.width - 16) / W,
          (ctx.size.height - 16) / H,
        );
      },
      compact: (base, S) => (ctx, size) => {
        const { box, well, zoom } = S.frame;
        box.classList.toggle('compact', size.h * zoom < 168);
        box.classList.toggle('compact-tall', size.h * zoom >= 126 && size.h * zoom < 168);
        well.classList.toggle('tiny-panel', size.h * zoom < 120);
        box.style.setProperty('--message-size', Math.min(20, Math.max(12, (size.h * zoom - 55) / 10)) + 'px');
        box.style.setProperty('--compact-size', Math.min(12, Math.max(9, (size.h * zoom - 26) / 3.4)) + 'px');
        box.style.setProperty('--message-pad', Math.min(18, Math.max(5, (size.h * zoom - 190) / 4)) + 'px');
        box.style.setProperty('--message-gap', Math.min(16, Math.max(4, (size.h * zoom - 190) / 4)) + 'px');
      },
      place: (base, S) => (ctx) => {
        const { wrap, o, zoom, W, H, lim } = S.frame;
        const insetX = Math.min(ctx.size.width * 0.27, Math.max(0, ctx.size.width - lim.max.w * zoom - 16));
        const insetY = Math.min(ctx.size.height * 0.16, Math.max(18, ctx.size.height - lim.max.h * zoom - 16));
        wrap.style.left = Math.max(0, Math.min(ctx.size.width - W * zoom, insetX - o.x * zoom)) + 'px';
        wrap.style.top = Math.max(0, Math.min(ctx.size.height - H * zoom, insetY - o.y * zoom)) + 'px';
      },
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
