// This design fits the panel to the visible stage and uses the site's chat-style title, messages, and feedback.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-10',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    body: 'messages',
    wellInside: true,
    wellPosition: false,
    messages: [
      ['Alex', 'Hi there.', '10:21 AM'],
      ['Taylor', 'Looks good.', '10:22 AM'],
      ['Jordan', 'Let’s sync later.', '10:23 AM'],
    ],
    parts: {
      geometry: (base, S) => (ctx) => {
        const F = S.frame;
        const visibleW = Math.max(ctx.model.w, ctx.spec.target.w);
        const visibleH = Math.max(ctx.model.h, ctx.spec.target.h);
        const zoom = Math.min(1.85, (ctx.size.width - 18) / visibleW, (ctx.size.height - 18) / visibleH);
        F.customZoom = zoom;
        F.areaW = ctx.size.width / zoom;
        F.areaH = ctx.size.height / zoom;
        F.lim.max.w = Math.min(F.lim.max.w, Math.floor((ctx.size.width - 18) / zoom + 1e-7));
        F.lim.max.h = Math.min(F.lim.max.h, Math.floor((ctx.size.height - 18) / zoom + 1e-7));
      },
      rectOf: (base, S) => (size) => {
        const { ax, ay, areaW, areaH, zoom } = S.frame;
        return {
          x: ax ? areaW - 18 / zoom - size.w : 0,
          y: ay ? areaH - 18 / zoom - size.h : 0,
          w: size.w,
          h: size.h,
        };
      },
      boxPosition: (base, S) => () => {
        const { box, ax, ay, zoom } = S.frame;
        Object.assign(box.style,
          ax ? { right: 18 / zoom + 'px' } : { left: '0px' },
          ay ? { bottom: 18 / zoom + 'px' } : { top: '0px' });
      },
      title: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const title = util.el('div', 'rz-title', S.frame.box);
        const dots = util.el('span', 'rz-dots', title);
        for (let i = 0; i < 3; i++) util.el('i', '', dots);
        util.el('span', '', title, spec.title);
        const buttons = util.el('span', 'mpanel-btns', title);
        for (const glyph of ['−', '□', '×']) util.el('span', 'mwindow-button', buttons, glyph);
        return title;
      },
      body: (base, S) => (ctx) => {
        const { util } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        util.el('span', 'mchat-rail', body);
        for (const [name, text, time] of [
          ['Alex', 'Hi there.', '10:21 AM'],
          ['Taylor', 'Looks good.', '10:22 AM'],
          ['Jordan', 'Let’s sync later.', '10:23 AM'],
        ]) {
          const message = util.el('div', 'rz-message', body);
          util.el('strong', '', message, name);
          util.el('em', '', message, time);
          util.el('p', '', message, text);
        }
        return body;
      },
      paintWell: (base, S) => (ctx, size) => {
        const { util, spec } = ctx;
        const well = S.frame.well;
        if (!well) return;
        well.textContent = '';
        const currentRow = util.el('div', '', well);
        util.el('span', '', currentRow, `Width: ${size.w} px`);
        util.el('span', '', currentRow, `Height: ${size.h} px`);
        if (spec.target && spec.target.w) {
          const targetRow = util.el('div', '', well);
          util.el('span', '', targetRow, `Target: ${spec.target.w} px × ${spec.target.h} px (±6 px)`);
        }
      },
      fit: (base, S) => () => S.frame.customZoom,
      compact: (base, S) => (ctx, size) => {
        base(ctx, size);
        const { box, zoom } = S.frame;
        box.classList.toggle('narrow', size.w * zoom < 650);
        box.style.setProperty('--feedback-size', Math.min(20, Math.max(10, (size.w * zoom - 32) / 23)) + 'px');
        box.style.setProperty('--compact-message', Math.min(15, Math.max(9, (size.h * zoom - 64) / 4)) + 'px');
      },
      handleOffset: (base) => (name) => /[ew]/.test(name) && /[ns]/.test(name) ? [6, 6] : [0, 0],
      place: (base, S) => () => {
        Object.assign(S.frame.wrap.style, { left: '0px', top: '0px' });
      },
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
