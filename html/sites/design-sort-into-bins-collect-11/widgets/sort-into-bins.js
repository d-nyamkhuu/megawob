// A central collection box with one-bit distractors and stippled purple shapes.
(function () {
  'use strict';

  env.widget({
    task: 'sort-into-bins',
    site: 'design-sort-into-bins-collect-11',
    name: 'design',
    split: 'train',
    scenarios: ['collect'],
    traits: {
      layout: 'central',
      itemCount: 13,
      itemSize: 0.19,
      palette: { target: 'purple', distractors: ['black', 'outline'] },
    },
    template: 'sort-into-bins/boxes',
    design: {
      shapes: {
        square: '<rect x="8" y="8" width="84" height="84"/>',
      },
      caption: null,
      parts: {
        fit: (base, S) => (ctx) => {
          return { H: Math.floor(ctx.size.height - 24), W: Math.floor(ctx.size.width - 24) };
        },
        item: (base, S) => (ctx, el, it) => {
          base(ctx, el, it);
          // Keep each hit rectangle exactly aligned with its normalized model rectangle.
          // The SVG keeps the visible geometry square within that rectangle.
          el.style.height = S.spec.item.h * S.geo.H + 'px';
        },
        box: (base, S) => (ctx, el, c) => {
          base(ctx, el, c);
          if (S.spec.scenario === 'collect' && S.spec.containers.length === 1) {
            // Label the container without revealing the requested color or action.
            const caption = ctx.util.el('div', 'bin-caption', S.board, 'Collection box');
            const captionWidth = Math.min(S.geo.W, Math.max(c.w * S.geo.W, S.geo.W * 0.38));
            const captionCenter = Math.max(captionWidth / 2, Math.min(S.geo.W - captionWidth / 2, (c.x + c.w / 2) * S.geo.W));
            Object.assign(caption.style, {
              left: captionCenter + 'px',
              top: c.y * S.geo.H + 'px',
              width: captionWidth + 'px',
            });
            const canvas = document.createElement('canvas'), paint = canvas.getContext('2d');
            paint.font = 'bold 14px Arial';
            canvas.width = Math.ceil(paint.measureText(caption.textContent).width) + 4;
            canvas.height = 18;
            paint.font = 'bold 14px Arial';
            paint.textBaseline = 'middle';
            paint.fillText(caption.textContent, 2, 9);
            const pixels = paint.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 3; i < pixels.data.length; i += 4) pixels.data[i] = pixels.data[i] >= 96 ? 255 : 0;
            paint.putImageData(pixels, 0, 0);
            const scale = parseFloat(getComputedStyle(caption).fontSize) / 14;
            canvas.className = 'bitmap-ink';
            canvas.setAttribute('aria-hidden', 'true');
            Object.assign(canvas.style, { width: canvas.width * scale + 'px', height: canvas.height * scale + 'px', left: '50%', transform: 'translate(-50%,-50%)' });
            caption.classList.add('bitmap-label');
            caption.append(canvas);
          }
        },
        shapeSvg: (base, S) => (content, it) => {
          const ink = it.color === 'purple' ? '#a000ff' : content.COLORS[it.color] || '#000';
          const fill = it.fill === 'outline' ? '#fff' : it.color === 'black' ? '#000' : `url(#bitmap-${it.id})`;
          return `<svg viewBox="0 0 100 100" fill="${fill}" stroke="#000" stroke-width="3" shape-rendering="crispEdges"><defs><pattern id="bitmap-${it.id}" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="${ink}" stroke="none"/><path d="M0 0H2V2H0ZM3 3H5V5H3Z" fill="white" stroke="none"/></pattern></defs>${S.SHAPES[it.shape]}</svg>`;
        },
      },
    },
  });
})();
