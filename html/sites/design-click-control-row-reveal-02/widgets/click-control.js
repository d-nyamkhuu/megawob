// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-row-reveal-02',
  name: 'design',
  split: 'train',
  scenarios: ['row-reveal'],
  template: 'click-control/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        // Keep the template's seeded frame draws, then size the desk to the stage.
        const frame = base(ctx);
        const { page, content, h1 } = frame;
        Object.assign(page.style, { left: '0px', top: '0px', bottom: '0px', width: ctx.size.width + 'px' });
        page.classList.add('chronicle-page');
        const nav = page.querySelector('.uc-nav');
        nav.hidden = true;
        nav.style.display = 'none';
        const body = page.querySelector('.uc-body');
        body.classList.add('chronicle-body');
        const side = page.querySelector('.uc-side');
        if (side) {
          side.classList.add('chronicle-side');
          Array.from(side.children).forEach((child) => { child.hidden = true; child.style.display = 'none'; });
        }
        const main = content.parentElement;
        main.classList.add('chronicle-main');
        main.querySelector('.uc-crumb').hidden = true;
        h1.classList.add('chronicle-list-title');
        h1.textContent = 'All Documents';
        const band = ctx.util.el('div', 'chronicle-record', main);
        const reserve = 36 + ctx.spec.rows.length * 29 + 52;
        const bandHeight = Math.max(64, Math.min(244, ctx.size.height - reserve - 18));
        band.style.height = bandHeight + 'px';
        main.insertBefore(band, h1);
        content.classList.add('chronicle-content');
        return frame;
      },
      box: (base) => (ctx, content, opts) => {
        const box = base(ctx, content, opts);
        box.classList.add('chronicle-box');
        return box;
      },
      buildRowReveal: (base) => (ctx, content, up, page) => {
        const view = base(ctx, content, up, page);
        const table = content.querySelector('.uc-table');
        table.style.width = '100%';
        table.style.maxWidth = 'none';
        table.style.tableLayout = 'fixed';
        // Leave room for every row, including its concealed action buttons.
        const height = content.getBoundingClientRect().height;
        table.style.setProperty('--rowh', Math.min(40, Math.max(28, Math.floor((height - 38) / ctx.spec.rows.length))) + 'px');
        return view;
      },
    },
  },
});
