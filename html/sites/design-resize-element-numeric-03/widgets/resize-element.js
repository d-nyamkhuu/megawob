// Keeps the property sheet, live dimensions, and workspace-sized placement.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-03',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    placement: 'fixed',
    left: 2,
    top: 2,
    parts: {
      body: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        const tabs = util.el('div', 'rz-tabs', body);
        ['Properties', 'Adjustments', 'Info'].forEach((text, i) =>
          util.el('span', 'rz-tab' + (i === 0 ? ' on' : ''), tabs, text),
        );
        const sheet = util.el('div', 'rz-sheet', body);
        util.el('div', 'rz-sizehd', sheet, 'Size (px)');
        const wRow = util.el('div', 'rz-field', sheet);
        util.el('span', 'rz-fl', wRow, 'Width:');
        const wVal = util.el('span', 'rz-fv', wRow);
        const hRow = util.el('div', 'rz-field', sheet);
        util.el('span', 'rz-fl', hRow, 'Height:');
        const hVal = util.el('span', 'rz-fv', hRow);
        const target = util.el('div', 'rz-target', sheet);
        if (document.body.classList.contains('note-hidden')) {
          const heading = document.querySelector('.task-note .instruction');
          if (heading) {
            heading.textContent = `“${spec.title}” panel — ${spec.target.w} px wide and ${spec.target.h} px tall (±6 px).`;
            heading.classList.add('source-dimensions');
          }
        }
        if (spec.target && spec.target.w) {
          util.el('b', '', target, 'Target size:');
          util.el('span', '', target, `${spec.target.w} px wide and ${spec.target.h} px tall (±6 px).`);
        } else target.hidden = true;
        S.frame.numericFields = { wVal, hVal };
        return body;
      },
      fit: (base, S) => (ctx) => Math.min(
        1,
        (ctx.size.width - 4) / S.frame.W,
        (ctx.size.height - 4) / S.frame.H,
      ),
      compact: (base, S) => (ctx, size) => {
        const { box, zoom } = S.frame;
        box.classList.toggle('compact', size.h < 225);
        box.classList.toggle('medium', size.h >= 225 && size.h < 350);
        box.classList.toggle('tiny', size.h * zoom < 125);
        box.classList.toggle('compact-tall', size.h * zoom >= 126 && size.h * zoom < 168);
        box.style.setProperty('--message-size', Math.min(20, Math.max(12, (size.h * zoom - 55) / 10)) + 'px');
        box.style.setProperty('--compact-size', Math.min(12, Math.max(9, (size.h * zoom - 26) / 3.4)) + 'px');
        box.style.setProperty('--message-pad', Math.min(18, Math.max(5, (size.h * zoom - 190) / 4)) + 'px');
        box.style.setProperty('--message-gap', Math.min(16, Math.max(4, (size.h * zoom - 190) / 4)) + 'px');
      },
      drawn: (base, S) => (ctx, size) => {
        const { wVal, hVal } = S.frame.numericFields;
        wVal.textContent = `${size.w} (current, read-only)`;
        hVal.textContent = `${size.h} (current, read-only)`;
      },
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
