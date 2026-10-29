// This design uses the site's gray canvas, width fitting, compact readouts, and Apply toolbar dock.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-11',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 1.05 },
  template: 'crop-image/box',
  design: {
    background: '#f4f4f4',
    asideApply: false,
    parts: {
      fit: (base, S) => (ctx, tools) => {
        const availW = Math.floor(ctx.size.width * 0.91);
        const availH = Math.floor(ctx.size.height - S.D.insetY - (tools ? 40 : 0));
        let H = availH;
        let W = Math.round(H * ctx.spec.aspect);
        if (W > availW) {
          W = availW;
          H = Math.round(W / ctx.spec.aspect);
        }
        return { W, H };
      },
      measure: (base, S) => (ctx, m) => {
        base(ctx, m);
        const fields = document.querySelectorAll('.dk-row .dk-field span');
        if (fields.length === 2) {
          fields[0].textContent = Math.round((m.r - m.l) * S.W);
          fields[1].textContent = Math.round((m.b - m.t) * S.H);
        }
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        if (S.els.bar) {
          const dock = document.querySelector('.dk-hand > div');
          if (dock) dock.append(S.els.bar);
        }
      },
    },
  },
});
