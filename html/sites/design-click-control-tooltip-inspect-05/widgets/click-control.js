// Keep the shared tooltip bindings and random draws, then arrange them as an archive utility.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tooltip-inspect-05',
  name: 'design',
  split: 'train',
  scenarios: ['tooltip-inspect'],
  template: 'click-control/base',
  design: {
    parts: {
      buildTooltip: (base) => function (ctx, content, up, page) {
        const view = base(ctx, content, up, page);
        const { util } = ctx;
        const box = content.querySelector('.uc-box');
        box.classList.add('archive-workspace');
        const dates = ['2019-02-11', '2019-03-14', '2019-01-28', '2019-02-03', '2019-03-01', '2019-02-19', '2019-01-17', '2019-02-27', '2019-03-05', '2019-02-08'];
        const toolbarIcons = [
          '<circle cx="22" cy="12" r="7"/><circle cx="8" cy="17" r="5"/><circle cx="36" cy="17" r="5"/><path d="M11 36v-5a11 10 0 0 1 22 0v5zM1 35v-5a8 8 0 0 1 9-8l-2 13zM36 35l-2-13a8 8 0 0 1 9 8v5z"/>',
          '<rect x="4" y="9" width="36" height="29" rx="2"/><path d="m5 11 17 14 17-14" fill="none" stroke="white" stroke-width="2"/>',
          '<path d="M5 14h34l-3-8H8zM7 17h30v23H7z"/><path d="M17 24h10" stroke="white" stroke-width="2"/>',
          '<path d="M9 15a15 15 0 1 1 0 18" fill="none" stroke="currentColor" stroke-width="4"/><path d="M6 5v15h15z"/>',
          '<path d="M10 14h24l-2 27H12zM6 8h32v4H6zM17 4h11v4H17z"/><path d="M18 18v18m7-18v18" stroke="white" stroke-width="2"/>'
        ];
        let toolbar = box.querySelector('.uc-tools');
        if (!toolbar) {
          toolbar = util.el('div', 'archive-toolbar', box);
          toolbarIcons.forEach((path) => {
            const icon = util.el('span', 'archive-toolbar-icon', toolbar);
            icon.innerHTML = '<svg viewBox="0 0 44 44" aria-hidden="true">' + path + '</svg>';
          });
          box.prepend(toolbar);
        } else toolbar.classList.add('archive-toolbar');
        const doc = box.querySelector('.uc-doc');
        if (doc) doc.remove();
        let table = box.querySelector('.uc-table');
        if (!table) {
          table = util.el('table', 'uc-table archive-preview', box);
          table.innerHTML = '<tr><th>Name</th><th>Department</th><th>Archived On</th><th></th></tr>';
          const users = [
            ['Priya Desai', 'Marketing'], ['Marcus Lee', 'Engineering'], ['Elena García', 'Design'],
            ['Chen Wei', 'Engineering'], ['Soo-ah Bae', 'Product'], ['Liam O’Connor', 'Customer Support'],
            ['Amina Hassan', 'Operations'], ['Noah Patel', 'Finance'], ['Isabella Rossi', 'Marketing'], ['Mateo Silva', 'Engineering']
          ];
          users.forEach(([name, department], i) => {
            const row = util.el('tr', '', table);
            const cell = util.el('td', '', row);
            util.el('span', 'uc-idname', cell, name);
            util.el('td', '', row, department);
            util.el('td', 'archive-date', row, dates[i]);
            const actionCell = util.el('td', '', row);
            const button = util.el('button', 'uc-act', actionCell, 'Restore');
            button.type = 'button';
            button.addEventListener('click', () => {
              button.textContent = 'Restored';
              row.classList.add('dead');
            });
          });
        }
        if (ctx.spec.mode === 'id') {
          const header = table.rows[0];
          header.cells[1].textContent = 'Department';
          const dateHeader = util.el('th', '', header, 'Archived On');
          header.insertBefore(dateHeader, header.cells[2]);
          for (const [index, row] of Array.from(table.rows).slice(1).entries()) {
            const date = util.el('td', 'archive-date', row, dates[index % dates.length]);
            row.insertBefore(date, row.cells[2]);
            const name = row.querySelector('.uc-idname');
            name.style.display = 'flex';
            name.style.alignItems = 'center';
          }
        }
        const headHeight = Math.round(ctx.size.height * 0.056);
        const rowHeight = Math.max(26, Math.floor((content.clientHeight - toolbar.offsetHeight - headHeight - 24) / (table.rows.length - 1)));
        table.style.tableLayout = 'fixed';
        table.rows[0].style.height = headHeight + 'px';
        table.style.setProperty('--contact-icon-height', Math.min(34, rowHeight - 12) + 'px');
        for (const row of Array.from(table.rows).slice(1)) {
          row.style.height = rowHeight + 'px';
        }
        return view;
      },
    },
  },
});
