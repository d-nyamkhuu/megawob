// Link design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-link-01',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  template: 'scroll-page/longform',
  design: {
    minimumWidth: 0,
    widthInset: 32,
    columnWidth: [1640, 1860],
    fontFamily: 'Georgia, "Times New Roman", serif',
    bodySize: 21,
    sectionTitleSize: 31,
    parts: {
      // Install the account-page layout before construction, leaving every seeded
      // control and the template's scrolling, recovery and targeting intact.
      styles: (base) => function (ctx) {
        base(ctx);
        if (document.getElementById('maple-page-layout')) return;
        const style = document.createElement('style');
        style.id = 'maple-page-layout';
        style.textContent = `
          .ps-wrap { margin:0 16px; }
          .ps-wrap.docs, .ps-wrap.rail { display:block; }
          .ps-title { display:flex; align-items:center; min-height:218px; margin:0;
            padding:34px 40px; box-sizing:border-box; overflow-wrap:anywhere; }
          .ps-sec { position:relative; display:grid; grid-template-columns:58px minmax(0,1fr);
            column-gap:12px; padding:10px 0 8px; }
          .ps-sec::before { grid-column:1; grid-row:1 / span 5; justify-self:start; padding-top:3px; }
          .ps-sec > h2, .ps-sec > p, .ps-sec > .ps-acts, .ps-sec > .ps-card,
          .ps-sec > .ps-pane, .ps-sec > .ps-sib, .ps-sec > .ps-faq { grid-column:2; }
          .ps-sec h2 { margin:0 0 1px; }
          .ps-sec p { margin:0 0 3px; }
          .ps-sec .ps-acts { margin:2px 0 3px; }
          .ps-sec .ps-btn { padding:0; }
          .ps-sec .ps-sec { display:block; }
          @media(max-width:1100px) {
            .ps-title { min-height:170px; padding:26px; }
            .ps-sec { grid-template-columns:42px minmax(0,1fr); column-gap:7px; }
          }
        `;
        document.head.append(style);
      },
    },
  },
});
