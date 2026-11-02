// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-gantt-resize-01',
  name: 'design',
  split: 'train',
  scenarios: ['gantt-resize'],
  template: 'use-project-board/workspace',
  design: {
    brand: 'Product Release Planner',
    workspaceLabel: 'Product Release Planner',
    statuses: ['Complete', 'In progress', 'In progress', 'In progress', 'In progress', 'At risk'],
    inset: 10,
    radius: 11,
    font: '15px/1.4 Arial, "Segoe UI", sans-serif',
    sidebarWidth: 158,
    compactSidebarWidth: 130,
    compactAt: 920,
    axisHeight: 80,
    rowHeight: 60,
    phaseHeight: 26,
    metaMin: 210,
    metaMax: 250,
    metaRatio: .22,
    boardHeadHeight: 52,
    laneTitleHeight: 30,
    laneMin: 86,
    cardMin: 48,
    cardMax: 80,
    cardInset: 34,
    cardGap: 7,
    parts: {
      toolbar(base, S) {
        return () => {
        base();
        const { tools, findBtn, filterBtn, groupBtn, today, zoomButtons } = S.els;
        const icons = {
          plus: '<rect x="2" y="2" width="20" height="20" rx="4" fill="#43a0ff" stroke="#258eff"/><path d="M12 5v14M5 12h14" stroke="white"/>',
          link: '<path d="M10 7l3-3a5 5 0 017 7l-3 3M14 17l-3 3a5 5 0 01-7-7l3-3M8 16l8-8"/>',
          diamond: '<path d="M12 2L22 12 12 22 2 12z" fill="#b5dcff" stroke="#1685ff"/>',
          trash: '<path d="M4 6h16M9 3h6l1 3M6 6l1 15h10l1-15M10 9v9m4-9v9"/>',
          fit: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
          in: '<circle cx="10" cy="10" r="7"/><path d="M15 15l7 7M6 10h8m-4-4v8"/>',
          out: '<circle cx="10" cy="10" r="7"/><path d="M15 15l7 7M6 10h8"/>'
        };
        const icon = (button, name) => {
          button.querySelector('svg')?.remove();
          const svg = S.ctx.util.svg('svg', {class:'pj-icon',viewBox:'0 0 24 24'}, button);
          svg.innerHTML = icons[name]; button.prepend(svg);
        };
        icon(findBtn, 'plus'); icon(filterBtn, 'link'); icon(groupBtn, 'diamond');
        const del = S.P.button(tools.querySelector('.pj-toolbar'), 'Delete', null, 'ref-delete');
        icon(del, 'trash'); tools.querySelector('.pj-zoom').before(del);
        del.onclick = () => S.P.drawer('Work item details');
        today.classList.add('ref-today');
        for (const [key, label, glyph] of [['Day','Fit Timeline','fit'], ['Week','Zoom In','in'], ['Month','Zoom Out','out']]) {
          zoomButtons[key].textContent = label; icon(zoomButtons[key], glyph);
        }
        };
      },
      body(base, S) {
        return () => {
        base();
        const u = S.ctx.util;
        const band = u.el('section', 'ref-project-band');
        S.els.body.before(band);
        const copy = u.el('div', 'ref-project-copy', band);
        u.el('h1', '', copy, 'Website 2.0 Release');
        u.el('p', '', copy, 'Plan and track work across teams to deliver the next major release.');
        const dates = u.el('div', 'ref-project-dates', copy);
        for (const [label, value] of [['Start', `${S.spec.month} 1, 2020`], ['Target Release', `${S.spec.month} ${S.spec.days}, 2020`]]) {
          const date = u.el('div', 'ref-project-date', dates);
          S.P.icon(date, 'calendar');
          const text = u.el('span', '', date); u.el('small', '', text, label); u.el('span', '', text, value);
        }
        const summary = document.querySelector('.ref-summary');
        if (summary) band.append(summary);
        const states = S.active.map(it => it.state);
        const values = [S.active.length, states.filter(s => s === 'In progress').length, states.filter(s => s === 'Complete').length, S.spec.scenario === 'milestone' ? S.active.length : 0];
        summary?.querySelectorAll('strong').forEach((el, i) => el.textContent = values[i]);
        const note = document.querySelector('.ref-instruction');
        if (note) { copy.querySelector('p').replaceWith(note); }
        const panel = document.querySelector('.ref-panel');
        if (panel) band.append(panel);
        const toast = document.querySelector('.ref-note');
        if (toast) { band.before(toast); copy.querySelector('p').remove(); }
        };
      },
      timelineFrame(base, S) {
        return () => {
        base();
        const u = S.ctx.util;
        const board = u.el('aside', 'ref-delivery', S.els.body);
        board.style.height = `${S.els.body.clientHeight}px`;
        S.els.body.style.setProperty('--view-height', `${S.els.body.clientHeight}px`);
        u.el('h2', '', board, 'Delivery Board');
        const columns = u.el('div', 'ref-delivery-columns', board);
        const names = ['To Do', 'In Progress', 'Review', 'Done'];
        const state = {'Planned':0, 'In progress':1, 'At risk':2, 'Complete':3};
        for (let i = 0; i < names.length; i++) {
          const col = u.el('section', `ref-delivery-column ref-col-${i}`, columns);
          const items = S.active.filter(it => state[it.state] === i);
          col.style.setProperty('--card-count', Math.max(1, items.length));
          const heading = u.el('div', 'ref-delivery-heading', col);
          u.el('strong', '', heading, names[i]); u.el('span', '', heading, String(items.length));
          for (const [index, it] of items.entries()) {
            const card = u.el('button', 'ref-delivery-card', col); card.type = 'button';
            const title = u.el('span', 'ref-delivery-title', card);
            u.el('i', `ref-dot ref-dot-${i}`, title); u.el('span', '', title, it.title);
            if (i === 2 || (i === 1 && index > 0)) {
              u.el('small', '', card, it.lane || (i === 2 || index === items.length - 1 ? 'Release' : 'Platform'));
            }
            card.onclick = () => S.P.drawer('Work item details', it);
          }
        }
        S.scene.metaW = Math.max(160, Math.min(208, S.scene.wrap.clientWidth * .2));
        S.scene.axisLabel.style.width = `${S.scene.metaW}px`;
        S.scene.axisLabel.replaceChildren(); u.el('strong', '', S.scene.axisLabel, 'Task');
        S.scene.AXIS = S.D.axisHeight + 6;
        const fill = u.el('div', 'ref-grid-fill', S.scene.wrap);
        fill.style.left = `${S.scene.metaW + 6}px`;
        S.scene.gridFill = fill;
        };
      },
      timelineRow(base, S) {
        return (it, index) => {
          const row = base(it, index);
          row.firstElementChild.style.width = `${S.scene.metaW}px`;
          const dot = S.ctx.util.el('i', `ref-dot ref-dot-${({'Planned':0, 'In progress':1, 'At risk':2, 'Complete':3})[it.state]}`, row.querySelector('.pj-task-top'));
          row.querySelector('.pj-task-top').prepend(dot);
          return row;
        };
      },
      timelineCalendar(base, S) {
        return () => {
        base();
        const sc = S.scene;
        sc.dayW = sc.dates.clientWidth / sc.shownDays;
        sc.dates.querySelector('.pj-month').textContent = `${S.spec.month} 2020`;
        sc.dates.querySelectorAll('.pj-date').forEach((el, i) => {
          el.style.left = `${i * sc.dayW}px`; el.style.width = `${sc.dayW}px`;
        });
        Object.values(sc.nodes).forEach(row => row.lastElementChild.style.setProperty('--day', `${sc.dayW}px`));
        sc.gridFill.style.setProperty('--day', `${sc.dayW}px`);
        };
      },
      timelineAt(base) {
        return (...args) => { const p = base(...args); return [p[0] + 6, p[1]]; };
      },
      timelinePaint(base, S) {
        return m => {
          base(m);
          for (const it of [...S.active, ...S.related]) {
            const b = it.related ? it : m.bars[it.id];
            const bar = S.scene.bars[it.id];
            bar.classList.toggle('ref-muted-bar', it.state !== 'In progress' && it.state !== 'Complete');
            bar.classList.toggle('ref-complete-bar', it.state === 'Complete');
            bar.classList.toggle('ref-label-inside', b.duration * S.scene.dayW > 65);
            if (S.scene.captions[it.id]) S.scene.captions[it.id].textContent = `${b.duration} days`;
          }
        };
      },
      footer(base, S) {
        return m => {
          base(m);
          const foot = S.els.foot;
          foot.firstElementChild.textContent = 'Timeline Summary';
          const bars = Object.values(m.bars);
          const work = bars.reduce((sum, b) => sum + b.duration, 0);
          const duration = Math.max(...bars.map(b => b.start + b.duration - 1)) - Math.min(...bars.map(b => b.start)) + 1;
          const values = [['Project Duration', `${duration} days`], ['Task Work', `${work} days`], ['Dependencies', String(m.edges.length)], ['Milestones', '0']];
          foot.replaceChildren(foot.firstElementChild);
          for (const [label, value] of values) {
            const metric = S.ctx.util.el('span', 'ref-footer-metric', foot, label);
            S.ctx.util.el('strong', '', metric, value);
          }
        };
      },
    },
  },
});
