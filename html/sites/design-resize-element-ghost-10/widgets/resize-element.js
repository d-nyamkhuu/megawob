// Design on templates/resize-element/panel.js.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-10',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: {'grips': ['se'], 'geometry': {'start': {'w': [560, 580], 'h': [290, 310]}, 'target': {'w': [790, 810], 'h': [350, 360]}, 'max': {'w': 810, 'h': 360}, 'grow': true, 'gap': 35}},
  template: 'resize-element/panel',
  design: {
    messages: [['Visitor', 'Hi there!'], ['Guide', 'Welcome to WebGuide.'], ['Visitor', 'Can you recommend some good travel sites?']],
    compactChat: false,
    parts: {
      icon: () => (ctx, dots) => {
        const icon = ctx.util.svg('svg', { class: 'chat-icon', viewBox: '0 0 30 28' }, dots);
        ctx.util.svg('path', { d: 'M15 2C7 2 2 6 2 12c0 4 2 7 6 9l-2 5 7-3h2c8 0 13-5 13-11S23 2 15 2Z', fill: '#fff', stroke: '#092452', 'stroke-width': 1.7 }, icon);
        for (const x of [9, 15, 21]) ctx.util.svg('circle', { cx: x, cy: 12, r: 1.5, fill: '#092452' }, icon);
      },
      title: (base) => (ctx) => {
        const title = base(ctx);
        const controls = ctx.util.el('span', 'chat-controls', title);
        for (const [label, cls] of [['−', 'chat-minimize'], ['×', 'chat-close']]) {
          const button = ctx.util.el('button', cls, controls, label);
          button.type = 'button';
          button.onclick = () => env.log('window-control', { label });
        }
        return title;
      },
      fit: (base, S) => (ctx) => {
        const { W, H, refW, refH } = S.frame;
        return Math.min((ctx.size.width - 10) / (W + (refW ? refW + 12 : 0)), (ctx.size.height - ctx.size.height * 0.045 - 3) / (H + (refH ? refH + 12 : 0)));
      },
      chromeUnit: () => () => 1,
      decorate: (base, S) => (ctx, s) => {
        const { box, zoom, chromeUnit } = S.frame;
        const pageUnit = ctx.size.width / 830;
        box.classList.toggle('compact-chat', s.h * zoom < 250 * pageUnit);
        const compactUnit = Math.min(1, (s.h * zoom) / chromeUnit / pageUnit / 230);
        box.style.setProperty('--compact-unit', compactUnit);
        const narrow = (s.w * zoom) / chromeUnit / pageUnit < 260;
        box.classList.toggle('narrow-chat', narrow);
        const titleUnit = Math.min(1, (s.w * zoom) / chromeUnit / pageUnit / 250);
        box.style.setProperty('--title-unit', titleUnit);
        box.style.setProperty('--control-unit', Math.min(compactUnit, titleUnit));
        const bodyRoom = (s.h * zoom) / chromeUnit / pageUnit - 80 * compactUnit;
        box.style.setProperty('--message-size', Math.max(8, Math.min(narrow ? 13 : 19.5, (bodyRoom - 12) / (narrow ? 8 : 4.5))));
      },
      handleOffset: (base, S) => (name) => {
        const h = S.frame.handles[name];
        return S.movesX(name) && S.movesY(name) ? [h.offsetWidth * 0.2, h.offsetHeight * 0.2] : [0, 0];
      },
    },
  },
});
