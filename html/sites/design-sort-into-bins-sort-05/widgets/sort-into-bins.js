// Full-stage sorting board with note-aware sizing, source and bin headings, and the site's shape styling.
(() => {
let reserve = 0;
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-sort-05',
  name: 'design',
  split: 'train',
  scenarios: ['sort'],
  traits: {
    itemsAt: 'above',
    orient: 'row',
    containers: [
      { x: .022, y: .39, w: .303, h: .57 },
      { x: .348, y: .39, w: .298, h: .57 },
      { x: .669, y: .39, w: .303, h: .57 },
    ],
  },
  template: 'sort-into-bins/boxes',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const { size } = ctx;
        reserve = 0;
        if (document.body.classList.contains('note-mode-header')) {
          const note = document.querySelector('.task-note');
          const sourceItems = S.spec.items.filter((it) => ctx.model.pos[it.id][1] < .39);
          const right = Math.max(0, ...sourceItems.map((it) => ctx.model.pos[it.id][0] + S.spec.item.w / 2));
          const available = Math.min(.35, 1 - right - .035);
          if (available >= .19 && size.width >= 1200) {
            note.style.width = available * 100 + '%';
            note.style.setProperty('--note-font', Math.min(28, Math.max(17, available * size.width / 17)) + 'px');
          } else {
            reserve = Math.min(150, Math.max(90, size.height * .2));
            note.classList.add('wide-note');
            note.style.height = reserve - 6 + 'px';
          }
        }
        return { H: Math.floor(size.height - 4 - reserve), W: Math.floor(size.width - 4) };
      },
      board: (base, S) => (ctx) => {
        const board = base(ctx);
        board.style.width = S.geo.W + 'px';
        board.style.height = S.geo.H + 'px';
        if (reserve) board.style.alignSelf = 'flex-end';
        const divider = ctx.util.el('div', 'board-split', board);
        divider.style.top = '29%';
        ctx.util.el('div', 'source-heading', board, 'Shapes to Sort');
        const heading = ctx.util.el('div', 'bins-heading', board, 'Color Bins');
        heading.style.top = 'calc(39% - 38px)';
        return board;
      },
      item: (base, S) => (ctx, el) => {
        el.style.height = S.spec.item.h * S.geo.H + 'px';
      },
      shapeSvg: (base, S) => (content, item) =>
        `<svg viewBox="0 0 100 100" fill="${content.COLORS[item.color]}" stroke="#111820" stroke-width="2">${S.SHAPES[item.shape]}</svg>`,
    },
  },
});
})();
