// Keeps the magazine title, comment thread, workspace fit, and sampled placement.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-11',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: {
    grips: ['se'],
    geometry: {
      start: { w: [408, 424], h: [440, 456] },
      target: { w: [636, 652], h: [480, 494] },
      max: { w: 660, h: 500 },
      portrait: true,
      grow: true,
    },
  },
  template: 'resize-element/panel',
  design: {
    origin: 'sampled',
    titleIcon: 'dots',
    titleClass: 'rz-ttl',
    composer: false,
    fitPadX: 28,
    fitPadY: 28,
    ghostLayer: false,
    placement: 'sampled',
    parts: {
      body: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        for (const [name, when, text] of [
          ['Eleanor Park', 'Apr 22, 2008  9:14 AM', 'Consider adding a note about weekend access.'],
          ['Marcus Lee', 'Apr 22, 2008  1:03 PM', 'The timeline looks good to me.'],
          ['Priya Desai', 'Apr 23, 2008  4:27 PM', 'Let’s confirm the budget section before sending to the board.'],
        ]) {
          const comment = util.el('div', 'rz-cmt', body);
          const header = util.el('div', 'rz-cmt-h', comment);
          util.el('strong', '', header, name);
          util.el('span', '', header, when);
          util.el('p', '', comment, text);
        }
        util.el('div', 'rz-add', body, 'Add a comment...');
        util.el('div', 'rz-post', body, 'Post');
        return body;
      },
      fit: (base, S) => (ctx) => Math.min(
        1,
        (ctx.size.width - 28) / (S.frame.W + (S.frame.refW ? S.frame.refW + 12 : 0)),
        (ctx.size.height - 28) / (S.frame.H + (S.frame.refH ? S.frame.refH + 12 : 0)),
      ),
      scaled: (base, S) => () => {
        const { wrap, zoom, ax, ay, pad, o } = S.frame;
        wrap.style.setProperty('--panel-scale', String(zoom));
        wrap.style.setProperty('--panel-inset-x', (ax ? pad : o.x) * zoom + 'px');
        wrap.style.setProperty('--panel-inset-y', (ay ? pad : o.y) * zoom + 'px');
        wrap.style.transform = 'scale(' + zoom + ')';
        wrap.style.transformOrigin = '0 0';
      },
    },
  },
});
