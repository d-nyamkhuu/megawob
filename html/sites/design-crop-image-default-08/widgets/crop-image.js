// This design uses the site's gray canvas, aspect trait, and compact hit areas and readouts.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-08',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 1.72 },
  template: 'crop-image/box',
  design: {
    background: '#e5e6e6',
    parts: {
      placed: (base, S) => (ctx, el, m) => {
        base(ctx, el, m);
        el.style.setProperty('--crop-hit-width', Math.max(1, Math.min(20, (m.r - m.l) * S.W / 2 - 2)) + 'px');
        el.style.setProperty('--crop-hit-height', Math.max(1, Math.min(20, (m.b - m.t) * S.H / 2 - 2)) + 'px');
        const px = (v, size) => Math.round(v * size);
        const fields = document.querySelectorAll('.amiga .value-box');
        [px(m.l, S.W), px(m.t, S.H), px(m.r - m.l, S.W), px(m.b - m.t, S.H)].forEach((v, i) => {
          if (fields[i]) fields[i].textContent = String(v);
        });
        // Preview only the user's current selection, independent of the goal.
        const preview = document.querySelector('.amiga .preview-art');
        if (preview) {
          const g = preview.getContext('2d');
          g.clearRect(0, 0, preview.width, preview.height);
          g.drawImage(S.els.canvas, m.l * S.W, m.t * S.H,
            (m.r - m.l) * S.W, (m.b - m.t) * S.H,
            0, 0, preview.width, preview.height);
        }
      },
    },
  },
});
