// Document-grid presentation; the template owns sizing, scrolling and selection.
env.widget({
  task: 'select-text',
  site: 'design-select-text-word-01',
  name: 'design',
  split: 'train',
  scenarios: ['word'],
  template: 'select-text/base',
  design: {
    parts: {
      ensureStyle: (_base, S) => () => env.util.css('hl-style', S.CSS + `
        .bauhaus .stage .hl-card {
          flex: 1 1 0; min-width: 0; max-width: calc(100% - 60px); align-self: flex-start;
          border: 0; border-radius: 0; background: transparent; box-shadow: none;
        }
        .bauhaus .stage .hl-card:not(:has(.hl-pane)) { min-height: calc(100% - 32px); }
        .bauhaus .stage .hl-head, .bauhaus .stage .hl-foot { display: none; }
        .bauhaus .stage .hl-text {
          flex: 1; display: flex; flex-direction: column;
          padding: 0; border: 1px solid #dedbd3; background: #fffdf8;
          font-family: Arial, Helvetica, sans-serif; counter-reset: hl-par;
        }
        .bauhaus .stage .hl-text::before {
          content: '#                     Text'; white-space: pre; display: block;
          flex: none; height: 68px; padding: 14px 30px 12px 32px;
          background: #f0efeb; border-bottom: 1px solid #ddd9d1;
          font-size: 22px; font-weight: 700; line-height: 40px;
        }
        .bauhaus .stage .hl-text p {
          flex: 1 0 auto; margin: 0; padding: 22px 30px 18px 148px;
          border-bottom: 1px solid #ddd9d1; text-indent: 0;
        }
        .bauhaus .stage .hl-text p + p { margin-top: 0; }
        .bauhaus .stage .hl-text:has(p:nth-of-type(5)) p {
          padding-top: 0; padding-bottom: 0; line-height: 1.25;
        }
        .bauhaus .stage .hl-text:has(p:nth-of-type(5))::before {
          box-sizing: border-box; height: 48px; padding-block: 8px;
          font-size: 16px; line-height: 32px;
        }
        .bauhaus .stage .hl-text:has(p:nth-of-type(5)) p::before {
          top: 0; height: 100%; font-size: inherit; line-height: inherit;
        }
        .bauhaus .stage .hl-text p:last-child { border-bottom: 0; }
        .bauhaus .stage .hl-text p::before {
          content: counter(hl-par); position: absolute; left: 32px; top: 20px;
          width: 80px; height: calc(100% - 20px); border-right: 1px solid #ddd9d1;
          text-align: left; font: 22px/1.5 Arial, Helvetica, sans-serif; color: #111;
        }
        @media (max-width: 1100px) {
          .bauhaus .stage .hl-text::before {
            height: 48px; padding: 7px 20px; line-height: 32px; font-size: 16px;
          }
          .bauhaus .stage .hl-text p { padding: 10px 14px 8px 88px; }
          .bauhaus .stage .hl-text p::before {
            left: 18px; top: 10px; width: 52px; height: calc(100% - 10px); font-size: 16px;
          }
        }
      `),
    },
  },
});
