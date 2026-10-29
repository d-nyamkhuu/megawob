// Preserve the document typography while allowing the template's fit loop to shrink it.
env.widget({
  task: 'select-text',
  site: 'design-select-text-tip-01',
  name: 'design',
  split: 'train',
  scenarios: ['tip'],
  template: 'select-text/base',
  design: {
    parts: {
      ensureStyle: (base, S) => () => {
        S.env.util.css('hl-style', S.CSS);
        S.env.util.css('ipad-highlight-fit', `
          .ipad .hl-text p {
            font-size: clamp(12px, calc(5em - 48px), clamp(21px, 1.86vw, 31px));
          }
          .ipad .hl-text p + p { margin-top: min(62px, 2.2em); }
          @media (max-height: 760px) {
            .ipad .hl-text p + p { margin-top: min(28px, 2.2em); }
          }
          @media (max-width: 1100px) {
            .ipad .hl-text p {
              font-size: clamp(12px, calc(5em - 48px), 18px);
            }
            .ipad .hl-text p + p { margin-top: min(20px, 2.2em); }
          }
        `);
      },
    },
  },
});
