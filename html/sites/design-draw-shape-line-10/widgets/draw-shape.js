// Keep this site's full-height board, olive target marker, and live miniature preview.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-line-10',
  name: 'design',
  split: 'train',
  scenarios: ['line'],
  template: 'draw-shape/canvas',
  design: {
    reserveH: 2,
    insetW: 2,
    capHeight: false,
    dotLayers: [{ r: 9, fill: 'var(--panel)' }, { r: 10.5, fill: '#353d21' }],
    parts: {
      penCreated: (base) => (b, pen) => {
        base(b, pen);
        const previewBox = document.querySelector('.pv-box');
        const preview = b.svg.cloneNode(true);
        preview.removeAttribute('data-role');
        preview.removeAttribute('width');
        preview.removeAttribute('height');
        preview.style.cursor = 'default';
        preview.querySelectorAll('defs, rect').forEach((el) => el.remove());
        b.previewInk = preview.querySelector('polyline');
        const previewRect = previewBox.getBoundingClientRect();
        const previewRatio = Math.min(previewRect.width / b.W, previewRect.height / b.H);
        preview.querySelectorAll('circle[fill="#353d21"]').forEach((el) => el.setAttribute('r', 9 / previewRatio));
        previewBox.append(preview);
      },
      ink: (base, S) => (points, b, el) => {
        base(points, b, el);
        b.previewInk.setAttribute('points', S.fmtPx(points, b.px));
      },
    },
  },
});
