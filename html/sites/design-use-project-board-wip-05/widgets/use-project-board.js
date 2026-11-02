// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-wip-05',
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
            '<path d="M5 2.5h9l5 5V21.5H5zM14 2.5v5h5M8 11h8M8 14h8M8 17h8"/>',
            '<path d="M5 2.5h9l5 5V21.5H5zM14 2.5v5h5M8 11h8M8 14h8M8 17h8"/>',
            '<path d="M5 2.5h9l5 5V21.5H5zM14 2.5v5h5M8 11h8M8 14h8M8 17h8"/>',
            '<path d="M5 2.5h9l5 5V21.5H5zM14 2.5v5h5M8 11h8M8 14h8M8 17h8"/>',
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
