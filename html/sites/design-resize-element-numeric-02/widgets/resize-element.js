// Design on templates/resize-element/panel.js.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-02',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: {'grips': ['se']},
  template: 'resize-element/panel',
  design: {
    messages: [], wellInside: true, currentFormat: 'plain', currentTag: 'strong', targetFormat: 'plain',
    targetTolerance: false, rectFrame: 'max', transform: false, top: 12, placement: 'fixed', wellPosition: false,
    parts: {
      body: (base, S) => (ctx) => {
        const body = base(ctx), { util, spec } = ctx, { box, title } = S.frame;
        for (const [name, text, time] of [
          ['AlexR', `I'm trying to resize the ${spec.title} panel to get a better view. What size should it be?`, '10:12 AM'],
          ['SamanthaK', "There's a specific size for this task. Check the instructions below.", '10:18 AM'],
          ['DevJoe', 'Right, use the bottom-right handle to resize. Make sure it matches the exact dimensions.', '10:27 AM'],
        ]) {
          const message = util.el('div', 'rz-message', body);
          util.el('strong', '', message, name);
          util.el('em', '', message, time);
          util.el('p', '', message, text);
        }
        const reset = util.el('button', 'rz-reset', title);
        reset.type = 'button'; reset.title = 'Reset Panel'; reset.setAttribute('aria-label', 'Reset Panel');
        reset.onclick = () => env.widgetDef.clear?.();
        const scrollbar = util.el('div', 'rz-scrollbar', box);
        const up = util.el('button', '', scrollbar, '▴');
        up.type = 'button'; up.setAttribute('aria-label', 'Scroll comments up'); up.onclick = () => { body.scrollTop -= 48; };
        util.el('i', '', scrollbar); util.el('span', '', scrollbar);
        const down = util.el('button', '', scrollbar, '▾');
        down.type = 'button'; down.setAttribute('aria-label', 'Scroll comments down'); down.onclick = () => { body.scrollTop += 48; };
        return body;
      },
      fit: (base, S) => (ctx) => {
        const { area, box, lim } = S.frame;
        const zoom = Math.min(1.22, (ctx.size.height - 26) / lim.max.h);
        S.frame.dragX = Math.min(1.63, (ctx.size.width - 18) / lim.max.w);
        Object.assign(area.style, { width: ctx.size.width + 'px', height: Math.max(0, ctx.size.height - 12) + 'px' });
        Object.assign(box.style, { right: 'auto', bottom: 'auto', left: '0px', top: '0px' });
        return zoom;
      },
      compact: (base, S) => (ctx, s) => {
        base(ctx, s);
        S.frame.box.classList.toggle('narrow', s.w * S.frame.dragX < 410);
      },
      displaySize: (base, S) => (s) => ({ w: s.w * S.frame.dragX, h: s.h * S.frame.zoom }),
      // The model rectangle stays in model units; only its displayed rectangle is scaled.
      rectOf: (base, S) => (s) => {
        const { ax, ay, lim } = S.frame;
        return { x: ax ? lim.max.w - s.w : 0, y: ay ? lim.max.h - s.h : 0, w: s.w, h: s.h };
      },
      pixelRect: (base, S) => (s) => {
        const r = S.P.rectOf(s);
        return { x: r.x * S.frame.dragX, y: r.y * S.frame.zoom, w: r.w * S.frame.dragX, h: r.h * S.frame.zoom };
      },
      decorate: (base, S) => (ctx, s) => {
        const r = S.P.pixelRect(s);
        Object.assign(S.frame.box.style, { left: r.x + 'px', top: r.y + 'px' });
      },
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
