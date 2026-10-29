// Keeps the inspector form, its live dimensions, and the original stage placement.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-03',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    fitPadX: 0,
    fitPadY: 0,
    zoomMax: 1.6,
    parts: {
      body: (base, S) => (ctx) => {
        const body = ctx.util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        const fieldW = [], fieldH = [];
        for (const [head, rows] of [
          ['Appearance', [['Theme', 'Olive', 1], ['Corner radius', '8 px']]],
          ['Layout', [['Width', null, 'w'], ['Height', null, 'h']]],
        ]) {
          const group = ctx.util.el('div', 'in-group', body);
          ctx.util.el('div', 'in-head', group, head);
          for (const [label, value, kind] of rows) {
            const row = ctx.util.el('div', 'in-row', group);
            ctx.util.el('span', 'in-label', row, label);
            const field = ctx.util.el('span', 'in-field' + (kind === 1 ? ' in-select' : ''), row, value || '');
            if (kind === 'w') fieldW.push(field);
            if (kind === 'h') fieldH.push(field);
          }
        }
        S.frame.formFields = { fieldW, fieldH };
        return body;
      },
      fit: (base, S) => (ctx) => Math.min(
        1.6,
        (ctx.size.width * 0.91) / (S.frame.W + (S.frame.refW ? S.frame.refW + 12 : 0)),
        (ctx.size.height * 0.74) / (S.frame.H + (S.frame.refH ? S.frame.refH + 12 : 0)),
      ),
      decorate: (base, S) => (ctx, size) => {
        const compact = size.h < 200;
        S.frame.box.classList.toggle('compact-form', compact);
        S.frame.box.style.setProperty('--form-unit', String(Math.max(
          0.22,
          Math.min(1, (size.h - 40) / (compact ? 82 : 216), size.w / (compact ? 450 : 320)),
        )));
      },
      drawn: (base, S) => (ctx, size) => {
        const { fieldW, fieldH } = S.frame.formFields;
        for (const field of fieldW) field.textContent = `${size.w} px`;
        for (const field of fieldH) field.textContent = `${size.h} px`;
        for (const el of document.querySelectorAll('[data-cur="w"]')) el.textContent = `${size.w} px`;
        for (const el of document.querySelectorAll('[data-cur="h"]')) el.textContent = `${size.h} px`;
      },
      briefing: (base, S) => (ctx) => {
        const { spec } = ctx;
        for (const el of document.querySelectorAll('[data-tgt="w"]')) el.textContent = `${spec.target.w} px`;
        for (const el of document.querySelectorAll('[data-tgt="h"]')) el.textContent = `${spec.target.h} px`;
        for (const el of document.querySelectorAll('[data-tgt="label"]')) el.textContent = `Target size: ${spec.target.w} × ${spec.target.h} px`;
        const corner = spec.grip === 'se' ? 'bottom-right' : spec.grip === 'sw' ? 'bottom-left' : spec.grip === 'ne' ? 'top-right' : 'top-left';
        const guide = document.querySelector('[data-guide="0"]');
        if (guide) guide.textContent = `Drag the ${corner} corner of the “${spec.title}” panel.`;
        const endGuide = document.querySelector('[data-guide="2"]');
        if (endGuide && !ctx.finish) endGuide.textContent = 'Click the completion control when the sizes match.';
      },
      place: (base, S) => (ctx) => {
        base(ctx);
        S.frame.wrap.style.left = Math.round(ctx.size.width * 0.044) + 'px';
        S.frame.wrap.style.top = Math.round(ctx.size.height * 0.165) + 'px';
      },
    },
  },
});
