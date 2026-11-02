// This card design fixes the contact heading and keeps the original viewport-aware fit.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-card-02',
  name: 'design',
  split: 'train',
  scenarios: ['card'],
  template: 'fill-form/document',
  design: {
    formTitle: 'Enter Contact Information',
    parts: {
      fit: () => (ctx, R) => {
        const { root, docPane, formPane } = R;
        let fs = Math.min(26, ctx.size.width / 62);
        const maxH = ctx.size.height;
        root.style.height = maxH + 'px';
        for (; fs >= 8; fs -= 0.5) {
          root.style.fontSize = fs + 'px';
          if (
            docPane.scrollHeight <= maxH + 1 &&
            formPane.scrollHeight <= maxH + 1 &&
            root.scrollWidth <= ctx.size.width + 1
          ) break;
        }
      },
    },
  },
});
