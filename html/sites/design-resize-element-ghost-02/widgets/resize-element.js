// Keeps the archived CAD chat, cyan target outline, selection marks and stage-relative placement.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-02',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    parts: {
      title: (base, S) => (ctx) => {
        const title = ctx.util.el('div', 'rz-title', S.frame.box);
        ctx.util.el('span', 'cad-ttl', title, ctx.spec.title);
        ctx.util.el('span', 'cad-wc', title, '—  ☐  ✕');
        return title;
      },
      body: (base, S) => (ctx) => {
        const body = ctx.util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        for (const [who, when, text] of [
          ['Alex', '4/21/2014  10:14', 'Check door clearance.'],
          ['Maria', '4/21/2014  11:03', 'Looks good.'],
          ['Chen', '4/21/2014  13:27', 'Verify room numbers.'],
        ]) {
          const message = ctx.util.el('div', 'cad-entry', body);
          ctx.util.el('div', '', message, who + '   ' + when);
          ctx.util.el('div', '', message, text);
        }
        return body;
      },
      ghostContent: (base, S) => (ctx, ghost) => {
        const outline = ctx.util.svg('svg', { width: '100%', height: '100%', fill: 'none' }, ghost);
        ctx.util.svg('rect', {
          x: 0, y: 0, width: '100%', height: '100%', stroke: '#49d8fa',
          'stroke-width': 3, 'stroke-dasharray': '12 10',
        }, outline);
      },
      handlesReady: (base, S) => () => {
        const { ctx, frame, POINTS } = S;
        frame.selection = Object.entries(POINTS)
          .filter(([name]) => !frame.handles[name])
          .map(([name, point]) => ({ el: ctx.util.el('i', 'cad-selection', frame.area), point }));
        frame.cursor = ctx.util.svg('svg', {
          class: 'cad-pointer', width: 24, height: 32, viewBox: '0 0 24 32',
          fill: '#fff', stroke: '#263644', 'stroke-width': 1,
        }, frame.area);
        ctx.util.svg('path', { d: 'M1 1L20 21L11 21L16 30L11 32L6 23L1 28Z' }, frame.cursor);
      },
      drawn: (base, S) => (ctx, s) => {
        const { frame, POINTS, P } = S;
        const r = P.rectOf(s);
        for (const { el, point: [fx, fy] } of frame.selection) {
          Object.assign(el.style, { left: r.x + fx * r.w + 'px', top: r.y + fy * r.h + 'px' });
        }
        const [cx, cy] = POINTS[ctx.spec.grip];
        Object.assign(frame.cursor.style, { left: r.x + cx * r.w + 2 + 'px', top: r.y + cy * r.h + 2 + 'px' });
        const rowHeight = Math.max(22, (s.h - 62) / 3);
        const rowFont = Math.min(16, rowHeight * 0.4);
        S.frame.box.style.setProperty('--cad-row-height', rowHeight + 'px');
        S.frame.box.style.setProperty('--cad-row-font', rowFont + 'px');
        S.frame.box.style.setProperty('--cad-row-leading', String(Math.min(1.55, (rowHeight - 2) / (rowFont * 2))));
      },
      place: (base, S) => () => {
        const { frame, ctx } = S;
        const { W, H, zoom, wrap } = frame;
        const fitW = W * zoom;
        const fitH = H * zoom;
        wrap.style.left = Math.max(0, Math.min(Math.round(ctx.size.width * 0.6), Math.floor(ctx.size.width - fitW - 6))) + 'px';
        wrap.style.top = Math.max(0, Math.min(Math.round(ctx.size.height * 0.16), Math.floor(ctx.size.height - fitH - 6))) + 'px';
      },
    },
  },
});
