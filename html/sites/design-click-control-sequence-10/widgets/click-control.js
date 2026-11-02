// Design of this site on the click-control/controls template (templates/click-control/controls.js): six buttons at set spots,
// two of them larger, with the label font fitted to the button.
env.widget({
  task: 'click-control',
  site: 'design-click-control-sequence-10',
  name: 'design',
  split: 'train',
  scenarios: ['sequence'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    seqSpots: [[0.31, 0.155], [0.88, 0.205], [0.12, 0.52], [0.77, 0.52], [0.46, 0.82], [0.04, 0.82]],
    parts: {
      // Geometry and label fitting are visual only; every seeded control keeps its key and behavior.
      seqPlace: () => (button, index, { W, H, spots }) => {
        const accent = index === 2 || index === 4;
        const w = Math.min(280, W * (accent ? 0.156 : 0.14));
        const h = Math.min(120, H * (accent ? 0.126 : 0.12));
        const p = spots[index % spots.length];
        Object.assign(button.style, {
          width: w + 'px',
          height: h + 'px',
          left: p[0] * (W - w) + 'px',
          top: p[1] * (H - h) + 'px',
          fontSize: Math.max(13, Math.min(44, h * 0.58, (w * 1.65) / button.textContent.length)) + 'px',
        });
        if (button.scrollWidth > button.clientWidth) {
          button.style.fontSize = (parseFloat(button.style.fontSize) * (w - 16)) / button.scrollWidth + 'px';
        }
      },
    },
  },
});
