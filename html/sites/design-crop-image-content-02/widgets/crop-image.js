// Keep the base template's stage sizing and drag coordinates; customize decorations only.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-content-02',
  name: 'design',
  split: 'train',
  scenarios: ['content'],
  template: 'crop-image/base',
  design: {
    parts: {
      'ensureStyle@0': (base) => function () {
        base();
        if (document.getElementById('newspaper-crop-style')) return;
        const style = document.createElement('style');
        style.id = 'newspaper-crop-style';
        style.textContent = `
          .cr-dim, .cr-grid, .cr-readout, .cr-sep, .cr-badge { display: none; }
          .cr-tools { order: 1; align-self: flex-start; }
          .cr-apply { height: 58px; padding: 8px 40px; font-size: 24px; }
        `;
        document.head.append(style);
      },
    },
  },
});
