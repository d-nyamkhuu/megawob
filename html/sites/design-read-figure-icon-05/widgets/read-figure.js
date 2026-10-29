// Design on templates/read-figure/base.js: the base site's read-figure widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-icon-05',
  name: 'design',
  split: 'train',
  scenarios: ['icon'],
  template: 'read-figure/base',
  design: {
    parts: {
      buildIcon: (base, S) => (ctx, body, up, B) => {
        const view = S.buildItemsBoard(ctx, body, up, B, 56);
        const board = body.querySelector('.up-board');
        if (board) {
          const oldCell = Number(board.getAttribute('width')) / ctx.spec.cols;
          const cols = 4;
          const rows = Math.ceil(ctx.spec.items.length / cols);
          const cellX = 220;
          const cellY = 180;
          board.setAttribute('viewBox', `0 0 ${cellX * cols} ${cellY * rows}`);
          board.setAttribute('width', cellX * cols);
          board.setAttribute('height', cellY * rows);
          board.style.width = `${cellX * cols}px`;
          board.style.height = 'auto';
          board.querySelectorAll('.up-item .hit').forEach((hit, i) => {
            const item = ctx.spec.items[i];
            const row = Math.floor(i / cols);
            const col = i % cols + (row === rows - 1 && ctx.spec.items.length % cols ? (cols - (ctx.spec.items.length % cols)) / 2 : 0);
            const dx = col * cellX + (cellX - oldCell) / 2 - item.c * oldCell;
            const dy = row * cellY + (cellY - oldCell) / 2 - item.r * oldCell;
            const group = hit.parentElement;
            group.setAttribute('transform', `translate(${dx} ${dy})`);
            const graphic = group.querySelector('.up-fig, .up-sym, .up-emoji');
            if (graphic && graphic.tagName.toLowerCase() === 'text') {
              graphic.setAttribute('font-size', Number(graphic.getAttribute('font-size')) * 4.5);
              if (graphic.classList.contains('up-sym')) graphic.style.fontWeight = '700';
            } else if (graphic) {
              const match = graphic.getAttribute('transform').match(/translate\(([-\d.]+),([-\d.]+)\)\s*scale\(([-\d.]+)\)/);
              if (match) {
                const x = Number(match[1]);
                const y = Number(match[2]);
                const k = Number(match[3]);
                const enlarged = k * 4.5;
                graphic.setAttribute('transform', `translate(${x + 12 * (k - enlarged)},${y + 12 * (k - enlarged)}) scale(${enlarged})`);
              }
            }
            hit.setAttribute('x', item.c * oldCell + cellX * 0.12 - (cellX - oldCell) / 2);
            hit.setAttribute('y', item.r * oldCell + cellY * 0.08 - (cellY - oldCell) / 2);
            hit.setAttribute('width', cellX * 0.76);
            hit.setAttribute('height', cellY * 0.84);
            hit.removeAttribute('rx');
          });
        }
        return view;
      },
    },
  },
});
