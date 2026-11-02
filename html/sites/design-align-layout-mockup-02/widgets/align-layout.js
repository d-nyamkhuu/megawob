// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-mockup-02',
  name: 'design',
  split: 'train',
  scenarios: ['mockup'],
  template: 'align-layout/canvas',
  design: {
    titles: { mockup: ['Canvas'] },
    mockupCaption: 'Reference (50%)',
    radiusMin: 0,
    radiusMax: 0,
    itemRadius: 0,
    rulerWidth: 30,
    rulerHeight: 20,
    rulerStep: 100,
    gridSize: 0,
    cardGap: 0,
    cardPadding: '14px',
    bodyGap: 14,
    titleSize: 16,
    itemSize: 16,
    handleSize: 10,
    panel: '#f8f5ed',
    line: '#d8d1c3',
    accent: '#0e5660',
    muted: '#49586a',
    fg: '#173746',
    parts: {
      body: (base, S) => (ctx, card) => {
        const body = ctx.util.el('div', 'lo-body', card);
        const left = ctx.util.el('div', 'lo-work-left', body);
        const right = ctx.util.el('div', 'lo-work-right', body);
        S.st.left = left;
        S.st.right = right;
        const tips = ctx.util.el('section', 'lo-tips', right);
        ctx.util.el('h3', 'lo-tips-head', tips, 'Tips');
        const move = ctx.util.el('div', 'lo-tip', tips);
        ctx.util.el('span', 'lo-tip-icon', move, '✥');
        ctx.util.el('span', '', move, 'Drag a box by its body to move it.');
        const resize = ctx.util.el('div', 'lo-tip', tips);
        ctx.util.el('span', 'lo-tip-icon', resize, '↗');
        ctx.util.el('span', '', resize, 'Drag a corner handle to resize the box.');
        return body;
      },
      pane: (base, S) => (ctx, parent, caption) => {
        const pane = base(ctx, caption === 'Canvas' ? S.st.left : parent, caption);
        const head = pane.querySelector('.lo-cap');
        if (head) {
          const scale = caption === 'Canvas' ? 1 : ctx.spec.scale;
          ctx.util.el('span', 'lo-cap-size', head,
            `${Math.round(ctx.spec.W * scale)} × ${Math.round(ctx.spec.H * scale)}`);
        }
        return pane;
      },
      mockup: (base, S) => (ctx) => base(ctx, S.st.right),
    },
  },
});
