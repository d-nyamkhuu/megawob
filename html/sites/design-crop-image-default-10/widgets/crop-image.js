// This design adds dark outlines to the warm canvas and magazine-layout crop styling.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-10',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 1.94 },
  template: 'crop-image/box',
  design: {
    background: '#ececeb',
    parts: {
      style: (base) => () => `${base()}
  .layout-magazine .cr-box { outline: 2px solid #d21919; box-shadow: none; }
  .layout-magazine .cr-hole { box-shadow: none !important; }
  .layout-magazine .cr-grid { display: none; }
  .layout-magazine .cr-handle { width: 18px; height: 18px; margin: -9px 0 0 -9px; border: 3px solid #d21919; border-radius: 0; background: #f8f7f3; box-shadow: none; }
  /* A narrow intermediate box can put a midpoint over a corner's center.
     Keep the corner draggable without changing any handle's visible size. */
  .layout-magazine .cr-handle[data-role="handle-nw"],
  .layout-magazine .cr-handle[data-role="handle-ne"],
  .layout-magazine .cr-handle[data-role="handle-se"],
  .layout-magazine .cr-handle[data-role="handle-sw"] { z-index: 1; }
  .layout-magazine .cr-frame { box-shadow: none; border-radius: 0; }
  .layout-magazine .cr-frame canvas { background: #ececeb; }
`,
      background: (base, S) => (g, ...args) => {
        g.lineWidth = Math.max(1.5, S.W / 500);
        g.strokeStyle = '#111';
        return base(g, ...args);
      },
      filled: (base) => (g, ...args) => {
        base(g, ...args);
        g.stroke();
      },
    },
  },
});
