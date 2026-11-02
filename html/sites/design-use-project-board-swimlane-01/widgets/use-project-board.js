// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-swimlane-01',
  name: 'design',
  split: 'train',
  scenarios: ['swimlane'],
  template: 'use-project-board/workspace',
  design: {
    inset: 0,
    radius: 0,
    font: '18px/1.25 "Times New Roman",Times,serif',
    laneMin: 180,
    laneTitleHeight: 0,
    boardHeadHeight: 56,
    cardMin: 92,
    cardMax: 92,
    cardInset: 32,
    cardGap: 12,
    parts: {
      lane: (base) => (label, index) => {
        const row = base(label, index);
        const title = row.querySelector('.pj-lane-title');
        if (title) { title.style.height = '100%'; title.style.alignItems = 'center'; }
        const name = row.querySelector('.pj-lane-title span');
        if (name) name.textContent = label;
        return row;
      },
      card: (base, S) => (item) => {
        const card = base(item);
        const month = String(S.spec.month || 'June').slice(0, 3);
        const ranges = [[6, 17], [10, 24], [28, 4], [8, 21], [9, 20], [30, 6]];
        const [start, end] = ranges[Math.max(0, S.active.indexOf(item)) % ranges.length];
        const startMonth = start > end ? 'May' : month;
        const endMonth = end < start ? month : startMonth;
        const date = document.createElement('div');
        date.className = 'pj-date-range';
        date.textContent = `${startMonth} ${String(start).padStart(2, '0')} – ${endMonth} ${String(end).padStart(2, '0')}`;
        card.append(date);
        return card;
      },
      backlog: (base, S) => () => {
        base();
        const { backlog, backlogGrid } = S.scene;
        backlogGrid.remove();
        const heading = backlog.querySelector('h4');
        if (heading) heading.textContent = 'Tasks';
        const table = document.createElement('table');
        table.className = 'pj-record-table';
        const head = document.createElement('thead');
        const headerRow = document.createElement('tr');
        for (const label of ['Name', 'Team', 'Status', 'Start', 'End']) {
          const cell = document.createElement('th'); cell.textContent = label; headerRow.append(cell);
        }
        head.append(headerRow); table.append(head);
        const body = document.createElement('tbody');
        const month = String(S.spec.month || 'June').slice(0, 3);
        const ranges = [[6, 17], [10, 24], [28, 4], [8, 21], [9, 20], [30, 6]];
        for (const [index, item] of S.active.entries()) {
          const card = S.ctx.model.cards[item.id];
          const row = document.createElement('tr');
          const [start, end] = ranges[index % ranges.length];
          const startMonth = start > end ? 'May' : month;
          const endMonth = end < start ? month : startMonth;
          const values = [item.title, S.spec.lanes[card.lane], S.spec.columns[card.column], `${startMonth.slice(0, 3)} ${String(start).padStart(2, '0')}`, `${endMonth.slice(0, 3)} ${String(end).padStart(2, '0')}`];
          for (const value of values) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }
          body.append(row);
        }
        table.append(body); backlog.append(table);
      },
      footer: (_base, S) => (model) => {
        const foot = S.els.foot;
        foot.replaceChildren();
        const title = document.createElement('div');
        title.className = 'pj-totals-title';
        title.textContent = 'Totals by status';
        foot.append(title);
        for (let column = 0; column < S.spec.columns.length; column++) {
          const box = document.createElement('div');
          box.className = `pj-total-box status-${column}`;
          const label = document.createElement('strong');
          label.textContent = S.spec.columns[column];
          const count = document.createElement('b');
          count.textContent = String(Object.values(model.cards).filter((card) => card.column === column).length);
          box.append(label, count); foot.append(box);
        }
      },
    },
  },
});
