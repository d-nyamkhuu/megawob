// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-export-04',
  name: 'design',
  split: 'train',
  scenarios: ['export'],
  template: 'protect-privacy/classic',
  design: {
    font: '15px/1.35 Georgia, "Times New Roman", serif',
    radius: '0',
    parts: {
      // Keep the template's random draws, then fit the existing full-stage design.
      fit: (base) => (ctx) => {
        const geo = base(ctx);
        return { ...geo, M: 0, fullW: ctx.size.width, fullH: ctx.size.height,
          winW: ctx.size.width, winH: ctx.size.height };
      },
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
      address: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
      // The community's navigation is already in the bottom dock.
      navigation: () => () => {},
      table: (base, S) => (main, m) => {
        base(main, m);
        main.style.padding = '0';
        const actions = main.firstElementChild;
        const title = actions.firstElementChild;
        title.classList.add('community-export-title');
        title.style.cssText = 'flex:none;margin:0;padding:7px 16px';
        main.prepend(title);
        const card = actions.nextElementSibling;
        card.style.cssText = 'flex:none;margin:12px;overflow:auto';
        const table = card.firstElementChild;
        for (const row of table.rows) {
          for (const cell of row.cells) {
            cell.style.fontSize = S.ctx.size.width < 760 ? '12px' : '15px';
            cell.style.padding = '5px 7px';
          }
        }
        actions.style.cssText = 'display:flex;flex:none;align-items:center;gap:10px;margin:16px 12px';
        main.append(actions);
      },
      dialog: (base, S) => (m) => {
        base(m);
        const scrim = S.app.lastElementChild;
        scrim.style.padding = '6px';
        const dialog = scrim.firstElementChild;
        dialog.style.maxHeight = '100%';
        dialog.style.overflowY = 'auto';
      },
    },
  },
});
