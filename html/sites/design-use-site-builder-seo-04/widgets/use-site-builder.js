// Publishing studio design; defaults reproduce this scenario's scaffold.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-seo-04',
  name: 'design',
  split: 'train',
  scenarios: ['seo'],
  template: 'use-site-builder/studio',
  design: {
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    fontSize: '15px',
    parts: {
      style: (base, S) => (ctx) => {
        base(ctx);
        ctx.css('skyline-editor', `
          .ab-field { display: ${ctx.size.width < 720 ? 'block' : 'grid'}; grid-template-columns: minmax(120px,26%) minmax(0,1fr) auto; column-gap: 14px; align-items: center; }
          .ab-input { min-height: 44px; padding: 8px 12px; }
          textarea.ab-input { min-height: 108px; padding: 10px 12px; }
          .ab-fieldlabel, .ab-counter, .ab-hint, .ab-caption, .ab-tree-row, .ab-head .ab-btn, .ab-tools, .ab-foot, .ab-preview-url, .ab-preview-desc { font-size: 13px; }
          .ab-form h2 { font-size: 20px; }
          @media (max-width: 1100px) {
            .ab-input { min-height: 37px; }
            textarea.ab-input { min-height: 78px; }
            .ab-field { column-gap: 8px; }
          }
        `);
      },
    },
  },
});
