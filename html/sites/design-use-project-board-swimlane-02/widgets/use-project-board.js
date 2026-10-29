// Design on templates/use-project-board/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-project-board',
  site: 'design-use-project-board-swimlane-02',
  name: 'design',
  split: 'train',
  scenarios: ['swimlane'],
  template: 'use-project-board/workspace',
  design: {
    parts: {
      lane: (base, S) => (label, l) => {
        const row = base(label, l);
        const title = row.querySelector('.pj-lane-title');
        title.classList.add('irix-lane-title');
        title.replaceChildren();
        const mark = S.ctx.util.el('span', 'irix-lane-mark', title);
        const paths = label.toLowerCase().includes('product')
          ? '<path d="M12 1 23 20 12 24 1 20z"/><path d="M12 1v23M1 20l11-8 11 8"/>'
          : '<path d="M12 1 23 7v10l-11 6L1 17V7z"/><path d="m1 7 11 6 11-6M12 13v10"/>';
        mark.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
        S.ctx.util.el('span', '', title, label);
        row.querySelectorAll('.pj-cell').forEach((cell, c) => {
          cell.style.left = `calc(13% + ${c * 29}% )`;
          cell.style.width = '29%';
        });
        return row;
      },
      card: (base, S) => (it) => {
        const card = base(it);
        card.classList.add('irix-card');
        const cardH = Math.max(S.scene.cardH, 82);
        S.scene.cardH = cardH;
        card.style.height = `${cardH}px`;
        card.replaceChildren();
        S.ctx.util.el('div', 'pj-name irix-card-name', card, it.title);
        const bottom = S.ctx.util.el('div', 'pj-card-bottom irix-card-bottom', card);
        const duration = 2 + (it.number % 4), start = 2 + ((it.number * 3) % 10), end = start + duration - 1;
        const month = 'Aug';
        S.ctx.util.el('span', 'pj-grow', bottom, `${duration} days`);
        S.ctx.util.el('span', '', bottom, `${month} ${start} – ${month} ${end}`);
        card.title = `${it.title} / ${duration} days / ${month} ${start} – ${month} ${end}`;
        return card;
      },
    },
  },
});
