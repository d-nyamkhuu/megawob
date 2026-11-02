// Keep the community sheet's layout inside the stage during the template render.
env.widget({
  task: 'click-control',
  site: 'design-click-control-rows-01',
  name: 'design',
  split: 'train',
  scenarios: ['rows'],
  template: 'click-control/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const frame = base(ctx);
        Object.assign(frame.page.style, {
          left: '0px', top: '0px', bottom: '0px', width: ctx.size.width + 'px',
        });
        frame.page.querySelector('.uc-nav').hidden = true;
        frame.page.querySelector('.uc-nav').style.display = 'none';
        frame.page.querySelector('.uc-crumb').hidden = true;
        Object.assign(frame.h1.style, {
          height: '60px', flex: 'none', margin: '0', padding: '6px 0 10px',
        });
        Object.assign(frame.content.parentElement.style, { minHeight: '0', gap: '12px' });
        frame.content.style.padding = '0';
        return frame;
      },
      box: (base) => (ctx, content, opts) => {
        const box = base(ctx, content, opts);
        Object.assign(box.style, {
          width: '100%', flex: '1 1 0', minHeight: '0', overflow: 'auto', padding: '0',
        });
        return box;
      },
      buildRows: (base) => (ctx, content, up) => {
        const rows = base(ctx, content, up);
        const table = content.querySelector('.uc-rows');
        Object.assign(table.style, { width: '100%', maxWidth: 'none', tableLayout: 'fixed' });
        const heads = table.querySelectorAll('th');
        heads[0].style.width = '38%';
        const compact = parseFloat(getComputedStyle(heads[0]).fontSize) <= 15;
        for (const head of heads) {
          head.style.height = compact ? '34px' : '43px';
          head.style.padding = compact ? '4px 6px' : '7px 12px';
        }
        // Reserve real space for the revealed controls; long values stay in their columns.
        const actions = table.querySelector('.uc-acts');
        const buttons = Array.from(actions.children);
        const actionWidth = buttons.reduce((sum, button) => sum + button.getBoundingClientRect().width, 0)
          + Math.max(0, buttons.length - 1) * 4 + 22;
        heads[heads.length - 1].style.width = actionWidth + 'px';
        for (const cell of table.querySelectorAll('td')) {
          cell.style.overflow = 'hidden';
          cell.style.padding = compact ? '0 6px' : '0 12px';
        }
        const pane = table.parentElement;
        const header = heads[0].parentElement;
        // Measure the actual pane after the instruction has taken its space.
        if (pane.clientHeight < header.getBoundingClientRect().height + ctx.spec.rows.length * 28 + 2) {
          const main = content.parentElement;
          Object.assign(main.querySelector('.uc-h1').style, {
            height: '40px', fontSize: '30px', padding: '0 0 4px',
          });
          Object.assign(main.style, { paddingTop: '4px', paddingBottom: '4px', gap: '4px' });
          for (const head of heads) Object.assign(head.style, { height: '32px', padding: '4px 6px' });
        }
        const rowHeight = Math.max(24, Math.min(40,
          Math.floor((pane.clientHeight - header.getBoundingClientRect().height - 2) / ctx.spec.rows.length)));
        table.style.setProperty('--rowh', rowHeight + 'px');
        if (rowHeight < 28) {
          for (const cell of table.querySelectorAll('td')) cell.style.fontSize = '15px';
          for (const button of table.querySelectorAll('.uc-act')) {
            Object.assign(button.style, { height: '22px', fontSize: '12px' });
          }
        }
        return rows;
      },
    },
  },
});
