// Invoice workspace scenario: the footer stays in its own row and the document uses the full workspace height.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-invoice-12',
  name: 'design',
  split: 'train',
  scenarios: ['invoice'],
  template: 'fill-form/document',
  design: {
    dateIcon: null,
    parts: {
      stageBox: (base) => (ctx) => {
        const box = base(ctx);
        const content = ctx.stage.closest('.ds-content');
        const footer = content.querySelector('.ds-footer');
        box.height -= footer.getBoundingClientRect().height + parseFloat(getComputedStyle(content).rowGap);
        return box;
      },
      rootReady: (base) => (ctx, R) => {
        R.root.style.height = R.box.height + 'px';
      },
      heading: () => (util, pane, form, text) => {
        const heading = util.el('h2', 'ff-heading', pane, text);
        pane.insertBefore(heading, form);
      },
      grid: () => (grid, form, pane, spec) => {
        grid.style.setProperty('--rows', Math.max(6, spec.fields.length));
      },
      arranged: () => () => {},
      fit: () => (ctx, R) => {
        const { root, docPane, formPane, availH } = R;
        const L = ctx.spec.layout;
        let fs = L.long ? ctx.rng.pick([14.5, 15, 15.5]) * 1.5 : Math.max(12, Math.min(24, R.box.height / 23));
        const fitsPane = (el) => {
          if (el === docPane) return true;
          if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) return false;
          return [...el.querySelectorAll('.ff-field')].every((field) => field.scrollHeight <= field.clientHeight + 1);
        };
        for (;;) {
          root.style.fontSize = fs + 'px';
          if ((fitsPane(docPane) && fitsPane(formPane)) || fs <= 9) break;
          fs -= 0.5;
        }
      },
      finished: () => (ctx, R) => {
        const paper = R.docPane.querySelector('.ff-paper');
        if (!paper) return;
        let paperSize = parseFloat(getComputedStyle(paper).fontSize);
        const cs = getComputedStyle(R.docPane);
        const paperHeight = R.docPane.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        while (paperSize > 10 && (paper.scrollHeight > paperHeight + 1 || paper.scrollWidth > paper.clientWidth + 1)) {
          paperSize -= 0.5;
          paper.style.fontSize = paperSize + 'px';
        }
      },
      renderImage: (base) => (util, pane, d, rng, W, maxH, look) => {
        look.size *= 1.5;
        look.ink = '#111';
        const paneStyle = getComputedStyle(pane);
        const scanWidth = pane.clientWidth - parseFloat(paneStyle.paddingLeft) - parseFloat(paneStyle.paddingRight);
        const scanHeight = pane.clientHeight - parseFloat(paneStyle.paddingTop) - parseFloat(paneStyle.paddingBottom);
        const scan = base(util, pane, d, rng, scanWidth, scanHeight, look);
        if (d.kind === 'invoice' && d.style === 'receipt') scan.classList.add('ff-scan-receipt');
        return scan;
      },
    },
  },
});
