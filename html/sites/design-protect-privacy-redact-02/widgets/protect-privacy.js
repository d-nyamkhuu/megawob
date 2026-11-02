// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-redact-02',
  name: 'design',
  split: 'train',
  scenarios: ['redact'],
  template: 'protect-privacy/classic',
  design: {
    radius: '0',
    parts: {
      fit: (base) => (ctx) => {
        // Keep the template's seeded draws, then fit the workstation to its stage.
        const geo = base(ctx);
        return { ...geo, M: 0, fullW: ctx.size.width, fullH: ctx.size.height,
          winW: ctx.size.width, winH: ctx.size.height };
      },
      tabs: (base, S) => (ctx) => {
        // Keep the browser's draws; the workstation already has a title bar.
        base(ctx);
        S.win.lastElementChild.remove();
      },
      document: (base) => (main, model) => {
        base(main, model);
        const page = main.lastElementChild.firstElementChild;
        // Long reports also have to fit beside the instruction card.
        let size = parseFloat(getComputedStyle(page).fontSize);
        while (size > 12 && (page.scrollHeight > page.clientHeight || page.scrollWidth > page.clientWidth)) {
          page.style.fontSize = `${--size}px`;
        }
      },
      styles: (base) => () => `${base()}
        .sp-tools { height:auto; min-height:44px; flex-wrap:wrap; }
        .sp-pdf { position:relative; padding:7px 10px 0 180px; }
        .sp-pdf::before { content:"▤\\A Page 1\\A\\A ▤\\A Page 2\\A\\A ▤\\A Page 3";
          white-space:pre; position:absolute; left:0; top:0; bottom:0; width:168px;
          padding-top:18px; border-right:2px solid #555;
          background:linear-gradient(90deg,#d0cfca,#e0dfd9); color:#111;
          text-align:center; font:bold 18px/1.3 Georgia,serif; }
        .sp-page { width:100%; padding:30px 38px; overflow:auto;
          font:26px/1.4 Georgia,"Times New Roman",serif; }
        @media (max-width:1260px) {
          .sp-page { padding:18px 22px; font-size:20px; }
        }
      `,
    },
  },
});
