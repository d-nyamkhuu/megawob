// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-wip-01',
  name: 'design',
  split: 'train',
  scenarios: ['wip'],
  template: 'use-project-board/workspace',
  design: { cardMax: 100,
    parts: {
      card(base, S) {
        return function (it) {
          const u = S.ctx.util, scene = S.scene, spec = S.spec;
          const card = u.el('div', 'pj-card qt-card', scene.wrap);
          card.style.height = `${scene.cardH}px`;
          card.style.setProperty('--task', it.color);
          card.setAttribute('role', 'button');
          card.setAttribute('aria-label', it.title);

          const icon = u.el('span', 'qt-card-icon', card);
          const marks = [
            '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
            '<path d="M4 3h16v18H4zM8 7h8M8 11h8M8 15h8M8 19h5"/>',
            '<path d="M3 20h18M5 18V11h4v7m2 0V5h4v13m2 0V8h4v10"/>',
            '<path d="M4 20l4-1 11-11-3-3L5 16zM14 7l3 3"/>',
          ];
          const svg = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, icon);
          svg.innerHTML = marks[(it.number || 0) % marks.length];

          const details = u.el('div', 'qt-card-details', card);
          u.el('div', 'qt-card-title', details, it.title);
          const teams = ['Data Team', 'Platform Team', 'Analytics Team', 'Build Team', 'DevOps Team'];
          u.el('div', 'qt-card-team', details, it.team || teams[(it.number || 0) % teams.length]);
          const start = Math.max(1, Number(it.start) || ((it.number || 1) % 20) + 1);
          const end = start + Math.max(1, Number(it.duration) || 4);
          u.el('div', 'qt-card-date', details, `Apr ${start}, 2003　–　Apr ${end}, 2003`);
          const priority = ((it.number || 0) % 3) + 1;
          u.el('span', `qt-priority p${priority}`, card, `P${priority}`);
          card.title = `${it.title} / ${teams[(it.number || 0) % teams.length]}`;
          scene.cards[it.id] = card;
          return card;
        };
      },
    },
  },
});
