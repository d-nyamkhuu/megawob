// The shared crop widget supplies the scene and mechanics. The inspector shows only the current selection.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-content-01',
  name: 'design',
  split: 'train',
  scenarios: ['content'],
  template: 'crop-image/base',
  design: {
    parts: {
      place: (base, S) => (el, rect, grow = 0) => {
        base(el, rect, grow);
        if (el.dataset.role !== 'crop-move') return;
        const source = S.frame.querySelector('canvas');
        const preview = document.querySelector('.preview-crop');
        const x = rect.l * source.width;
        const y = rect.t * source.height;
        const width = (rect.r - rect.l) * source.width;
        const height = (rect.b - rect.t) * source.height;
        if (preview && width > 0 && height > 0) {
          preview.width = Math.max(1, Math.round(width));
          preview.height = Math.max(1, Math.round(height));
          preview.getContext('2d').drawImage(source, x, y, width, height, 0, 0, preview.width, preview.height);
        }
        for (const [key, value] of Object.entries({ X: x, Y: y, Width: width, Height: height })) {
          const output = document.querySelector('[data-crop-measure="' + key + '"]');
          if (output) output.textContent = String(Math.round(value));
        }
      },
    },
  },
});
