// Designer property sheet with responsive fields and a stage-fitted workspace.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-09',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    parts: {
      title: () => () => null,
      body: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const form = util.el('div', 'rz-form', S.frame.box);
        S.frame.form = form;
        const title = util.el('div', 'rz-title', form);
        util.el('span', 'rz-name', title, spec.title);
        util.el('span', 'rz-x', title, '×');
        const body = util.el('div', 'rz-body', form);
        S.frame.body = body;
        const tabs = util.el('div', 'rz-tabs', body);
        ['Properties', 'Appearance', 'Layout'].forEach((t, i) => util.el('span', i ? '' : 'on', tabs, t));
        const dimRows = {};
        for (const [key, label] of [['w', 'Width'], ['h', 'Height']]) {
          const row = util.el('div', 'rz-row', body);
          util.el('span', 'rz-lab', row, label);
          dimRows[key] = { val: util.el('span', 'rz-val', row, ''), tgt: util.el('span', 'rz-tgt', row, '') };
        }
        S.frame.dimRows = dimRows;
        util.el('div', 'rz-sep', body);
        const bgRow = util.el('div', 'rz-row', body);
        util.el('span', 'rz-lab', bgRow, 'Background');
        const bgBox = util.el('span', 'rz-val rz-sel', bgRow);
        util.el('i', 'rz-swatch', bgBox);
        util.el('span', '', bgBox, '#FFFFFF');
        util.el('b', 'rz-chev', bgBox);
        const opRow = util.el('div', 'rz-row', body);
        util.el('span', 'rz-lab', opRow, 'Opacity');
        const slider = util.el('span', 'rz-slider', opRow);
        util.el('i', '', slider);
        util.el('span', 'rz-pct', opRow, '100 %');
        const crRow = util.el('div', 'rz-row', body);
        util.el('span', 'rz-lab', crRow, 'Corner radius');
        const crBox = util.el('span', 'rz-val rz-sel', crRow);
        util.el('span', '', crBox, '8 px');
        util.el('b', 'rz-chev', crBox);
        util.el('div', 'rz-sep', body);
        const stRow = util.el('div', 'rz-row', body);
        util.el('span', 'rz-lab', stRow, 'Stroke');
        util.el('span', 'rz-toggle', stRow);
        util.el('span', 'rz-off', stRow, 'Off');
        return body;
      },
      handle: (base, S) => (ctx, handle, name) => {
        base(ctx, handle, name);
        if (name === ctx.spec.grip) handle.classList.add('primary-grip');
      },
      paintWell: (base, S) => (ctx, size) => {
        const { util, spec } = ctx;
        const { well, dimRows } = S.frame;
        if (!well) return;
        dimRows.w.val.textContent = `${size.w} px`;
        dimRows.h.val.textContent = `${size.h} px`;
        if (spec.target && spec.target.w) {
          dimRows.w.tgt.textContent = `Target: ${spec.target.w} px`;
          dimRows.h.tgt.textContent = `Target: ${spec.target.h} px`;
        }
        well.textContent = '';
        util.el('strong', 'well-title', well, spec.title);
        const currentRow = util.el('div', '', well);
        util.el('span', 'well-label', currentRow, 'Current size:');
        util.el('span', '', currentRow, `${size.w} px (width) × ${size.h} px (height)`);
        if (spec.target && spec.target.w) {
          const targetRow = util.el('div', '', well);
          util.el('span', 'well-label', targetRow, 'Target size:');
          util.el('span', '', targetRow, `${spec.target.w} px (width) × ${spec.target.h} px (height)`);
        }
      },
      fit: (base, S) => (ctx) => {
        const { W, H } = S.frame;
        const topInset = Math.min(12, ctx.size.height * 0.02);
        return Math.min(1, (ctx.size.width - 2) / W, (ctx.size.height - topInset - 2) / H);
      },
      decorate: (base, S) => (ctx, size) => {
        const { form, box, well, zoom } = S.frame;
        form.style.transform = `scale(${(size.w - 2) / 437})`;
        form.style.width = '437px';
        box.classList.toggle('short-form', size.h / size.w < 0.65);
        well.classList.toggle('small-panel-feedback', size.w * zoom < 270 || size.h * zoom < 65);
      },
      place: (base, S) => (ctx) => {
        const topInset = Math.min(12, ctx.size.height * 0.02);
        S.frame.wrap.style.left = '1px';
        S.frame.wrap.style.top = topInset + 'px';
      },
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
