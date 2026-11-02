// This outline design adds its crop tools to the inspector and keeps Apply in the crop toolbar.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-09',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  traits: {
    aspect: 16 / 9,
    placement: { x: 0.15, y: 0.15, w: 0.6, h: 0.6 },
    startBox: { x: 0.104, y: 0.102, w: 0.672, h: 0.671 },
  },
  template: 'crop-image/box',
  design: {
    fitMode: 'floor-height',
    insetX: 16,
    insetY: 16,
    inspector: true,
    inspectorTitle: 'Crop Box',
    asideApply: false,
    parts: {
      inspectorTools: (base, S) => (ctx, inspector) => {
        const panel = ctx.util.el('section', 'crop-tool-panel', inspector);
        S.els.toolPanel = panel;
        ctx.util.el('h3', '', panel, 'Tools');
        const fit = ctx.util.el('button', 'crop-fit', panel, 'Fit to Image');
        fit.type = 'button';
        fit.onclick = () => {
          const fitted = { ...ctx.model, l: 0, t: 0, r: 1, b: 1 };
          S.crop.set(fitted);
          S.els.commit(fitted);
          env.log('fit-image');
        };
      },
      reset: (base, S) => (ctx, inspector) => {
        const restore = ctx.util.el('button', 'crop-reset', S.els.toolPanel || inspector, 'Reset');
        S.els.restore = restore;
        const initial = { ...ctx.model };
        restore.onclick = () => {
          S.crop.set(initial);
          ctx.update({ ...initial });
          S.els.showBox();
          S.els.paintTools();
          env.log('reset-crop');
        };
        return restore;
      },
      inspected: (base, S) => (ctx, inspector) => {
        const shell = document.querySelector('.shell');
        inspector.style.top = ctx.stage.getBoundingClientRect().top - shell.getBoundingClientRect().top + 8 + 'px';
      },
    },
  },
});
