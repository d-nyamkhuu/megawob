// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-link-02',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  template: 'avoid-phishing/classic',
  design: {
    radius: '10px', font: 'inherit',
    parts: {
      // Keep the detached window inside the stage without the fit safety net
      // repeatedly reducing a CSS-sized frame.
      frame: (base) => (ctx) => {
        const app = base(ctx);
        const top = Math.min(ctx.size.width * 0.02, ctx.size.height * 0.05);
        const fontSize = Math.max(14, Math.min(ctx.size.width <= 1100 ? 18 : 22,
          Math.floor((ctx.size.height * 0.9 - 180) / 15)));
        app.style.setProperty('--eink-font-size', `${fontSize}px`);
        Object.assign(app.style, {
          boxSizing: 'border-box', flex: 'none', minWidth: '0', zIndex: '1',
          width: `${ctx.size.width * 0.58}px`,
          height: `${ctx.size.height * 0.9}px`,
          margin: `${top}px 0 0 ${ctx.size.width * 0.36}px`,
        });
        return app;
      },
      // These decorative browser/sidebar regions are absent in the native mail design.
      browser: () => () => {},
      navigation: () => () => {},
      styles: (base) => (ctx) => {
        base(ctx);
        ctx.css('safe-phish-eink', `
          .sp-app { font: var(--eink-font-size)/1.38 Georgia, "Times New Roman", serif; }
          .sp-top strong, .sp-top small, .sp-toolbar, .sp-reading h2,
          .sp-reading h3, .sp-meta, .sp-muted, .sp-status {
            font-size: var(--eink-font-size); line-height: 1.38;
          }
          .sp-reading p { line-height: 1.38; }
          .sp-actions:empty { min-height: 0; padding: 0; border-top: 0; }
        `);
      },
    },
  },
});
