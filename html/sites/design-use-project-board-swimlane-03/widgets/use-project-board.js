// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-swimlane-03',
  name: 'design',
  split: 'train',
  scenarios: ['swimlane'],
  template: 'use-project-board/workspace',
  design: {
    parts: {
      boardFrame: (base, S) => () => {
        const u = S.ctx.util, body = S.els.body;
        const layout = u.el('div', 'pixel-layout', body);
        const summary = u.el('aside', 'pixel-summary', layout);
        const head = u.el('h2', '', summary, 'Release Summary');
        const total = u.el('div', 'pixel-total', summary);
        u.el('span', '', total, 'Total tasks'); u.el('strong', '', total, String(S.spec.items.length));
        const rows = [['Ready', '#65b4ef'], ['In progress', '#ffd34f'], ['Done', '#45bb43']];
        rows.forEach(([label, color]) => { const row = u.el('div', 'pixel-stat', summary); const sw = u.el('i', '', row); sw.style.background = color; u.el('span', '', row, label); u.el('strong', '', row, String(S.spec.items.filter((it, i) => S.ctx.model.cards[it.id].column === rows.indexOf(rows.find(x => x[0] === label))).length)); });
        u.el('h3', 'pixel-team-head', summary, 'By team');
        S.spec.lanes.forEach((team, lane) => { const row = u.el('div', 'pixel-stat', summary); const sw = u.el('i', '', row); sw.style.background = lane ? '#31a5b1' : '#6365c7'; u.el('span', '', row, team); u.el('strong', '', row, String(S.spec.items.filter(it => S.ctx.model.cards[it.id].lane === lane).length)); });
        const milestone = u.el('section', 'pixel-milestones', summary); u.el('h3', '', milestone, 'Milestones');
        [['Beta release','Apr 30, 2025'],['General release','Jun 30, 2025']].forEach(([name,date]) => { const r=u.el('div','pixel-milestone',milestone);u.el('i','',r);const t=u.el('div','',r);u.el('b','',t,name);u.el('span','',t,date); });
        const result = base(); layout.appendChild(S.scene.wrap);
        return result;
      },
      lane: (base, S) => (label, l) => {
        const u = S.ctx.util, row = u.el('div','pj-lane',S.scene.wrap);
        const title = u.el('div','pj-lane-title',row);
        const people = u.el('span','pixel-team-icon',title);
        people.style.color = l ? '#278c9b' : '#555db0';
        for (let n=0;n<3;n++) u.el('i','',people);
        u.el('span','',title,label);
        S.spec.columns.forEach((col,c) => S.P.cell(row,col,c,label,l));
        return row;
      },
      card: (base, S) => (it) => {
        const u = S.ctx.util, { wrap, cardH, cards } = S.scene;
        const card = u.el('div', `pj-card pixel-card${cardH < 65 ? ' compact' : ''}`, wrap);
        card.style.height = `${Math.max(84, cardH)}px`; card.style.setProperty('--task', it.color);
        card.setAttribute('role','button'); card.setAttribute('aria-label',it.title);
        const art = u.el('span','pixel-card-icon',card); art.textContent = ['▤','▧','▣','⚙','▤','▤'][it.number % 6];
        const content = u.el('div','pixel-card-copy',card); u.el('div','pj-name',content,it.title);
        const spans = ['Apr 14 – Apr 25, 2025','Apr 10 – Apr 28, 2025','Mar 24 – Apr 4, 2025',
          'Apr 7 – Apr 18, 2025','Apr 14 – May 2, 2025','Mar 31 – Apr 11, 2025'];
        u.el('div','pixel-date',content,spans[(it.number - 101) % spans.length]);
        u.el('span','pixel-team-tag',content,it.lane || (it.number % 2 ? S.spec.lanes[0] : S.spec.lanes[1]));
        card.title = `${it.title} / ${it.owner} / ${it.points} pts`; cards[it.id] = card; return card;
      },
    },
  },
});
