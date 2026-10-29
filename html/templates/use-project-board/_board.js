/* use-project-board/_board: Board lanes, status cells, cards, backlog and pointer gestures.
 * install(BASE, W) retains the workspace's design parts; W is its live per-page state. */
(function () {
  'use strict';
  function install(BASE, W) {
    BASE.boardFrame = () => {
      const wrap = W.u.el('div', 'pj-board', W.body), heads = W.u.el('div', 'pj-colheads', wrap), counters = [];
      W.s.columns.forEach((label) => counters.push(W.P.columnHeading(heads, label)));
      const laneH = Math.max(W.D.laneMin, (W.body.clientHeight - W.D.boardHeadHeight) / W.s.lanes.length), cardH = Math.max(W.D.cardMin, Math.min(W.D.cardMax, laneH - W.D.cardInset));
      const cells = {}, contents = {}, cards = {}, empty = {}, cardOffsets = {};

      W.scene = { wrap, heads, counters, laneH, cardH, cells, contents, cards, empty, cardOffsets };
    };

    BASE.columnHeading = (heads, label) => {
      const h = W.u.el('div', 'pj-colhead', heads, label);
      return { h, value: W.u.el('span', '', h) };
    };

    BASE.lane = (label, l) => {
      const { wrap, laneH } = W.scene;
      const row = W.u.el('div', 'pj-lane', wrap); row.style.height = `${laneH}px`;
      const title = W.u.el('div', 'pj-lane-title', row); W.P.icon(title, 'down'); W.u.el('span', '', title, `${label} / Current sprint`);

      W.s.columns.forEach((col, c) => W.P.cell(row, col, c, label, l));
      return row;
    };

    BASE.cell = (row, col, c, label, l) => {
      const { cells, contents, empty } = W.scene;
      const k = `${c}:${l}`, cell = W.u.el('div', 'pj-cell', row); cell.style.left = `${c * 100 / 3}%`;
      cell.setAttribute('aria-label', `${col} / ${label}`); cells[k] = cell;
      contents[k] = W.u.el('div', 'pj-cell-content', cell); empty[k] = W.u.el('div', 'pj-empty', contents[k]);
      W.P.icon(empty[k], 'tasks'); W.u.el('span', '', empty[k], 'No work in this status');
      cell.addEventListener('scroll', () => W.P.mirror());

      return cell;
    };

    BASE.card = (it) => {
      const { wrap, cardH, cards } = W.scene;
      const card = W.u.el('div', `pj-card${cardH < 65 ? ' compact' : ''}`, wrap); card.style.height = `${cardH}px`; card.style.setProperty('--task', it.color);
      card.setAttribute('role', 'button'); card.setAttribute('aria-label', it.title);
      const top = W.u.el('div', 'pj-card-top', card); W.u.el('span', 'pj-grow', top, `DLV-${it.number}`);
      const tag = W.u.el('span', 'pj-chip', top, it.number % 2 ? 'Delivery' : 'Platform'); tag.style.setProperty('--state', it.color);
      W.u.el('div', 'pj-name', card, it.title);
      const bottom = W.u.el('div', 'pj-card-bottom', card); W.P.avatar(bottom, it.owner, it.color); W.u.el('span', 'pj-grow pj-owner', bottom, it.owner.split(' ')[0]);
      W.P.icon(bottom, 'chat'); W.u.el('span', '', bottom, String(it.number % 4)); W.u.el('span', '', bottom, `${it.points} pts`);
      card.title = `${it.title} / ${it.owner} / ${it.points} pts`; cards[it.id] = card;

      return card;
    };

    BASE.backlog = () => {
      const { wrap } = W.scene;
      const backlog = W.u.el('section', 'pj-backlog', wrap); W.u.el('h4', '', backlog, 'Next sprint / Related project backlog');
      W.u.el('p', '', backlog, 'Uncommitted work across the delivery workspace. Outside current sprint WIP limits.');
      const backlogGrid = W.u.el('div', 'pj-backlog-grid', backlog), backlogCards = {};

      Object.assign(W.scene, { backlog, backlogGrid, backlogCards });
      W.related.forEach((it, i) => W.P.backlogCard(it, i));
    };

    BASE.backlogCard = (it, i) => {
      const { backlogGrid, backlogCards } = W.scene;
      const card = W.u.el('div', 'pj-backlog-card', backlogGrid); backlogCards[it.id] = card;
      W.u.el('div', 'pj-muted', card, `REQ-${301 + i} / ${i % 2 ? 'Cedar customer hub' : 'Service audit'}`);
      const b = W.u.el('button', 'pj-name', card, it.title); b.type = 'button'; b.onclick = () => W.P.drawer('Work item details', it);
      const sub = W.u.el('div', 'pj-card-bottom', card); W.P.avatar(sub, it.owner, it.color); W.u.el('span', 'pj-grow', sub, it.state); W.u.el('span', '', sub, `${it.points} pts`);

      return card;
    };

    BASE.board = () => {
      W.P.boardFrame();
      const { cells } = W.scene;
      W.s.lanes.forEach((label, l) => W.P.lane(label, l));
      for (const it of W.active) {
        const card = W.P.card(it);
        let ghost;
        const hit = (p) => Object.entries(cells).find(([, cell]) => { const r = cell.getBoundingClientRect(); return p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom; });
        env.ui.track(card, {
          start(p) { card.classList.add('pj-dragging'); ghost = W.P.ghost(it); ghost.style.left = `${p.x + 12}px`; ghost.style.top = `${p.y + 12}px`; },
          move(p) {
            ghost.style.left = `${p.x + 12}px`; ghost.style.top = `${p.y + 12}px`;
            const h = hit(p); Object.entries(cells).forEach(([k, cell]) => cell.classList.toggle('over', !!h && h[0] === k));
          },
          end(p) {
            ghost.remove(); card.classList.remove('pj-dragging'); Object.values(cells).forEach((cell) => cell.classList.remove('over'));
            const h = hit(p); if (h) { const [column, lane] = h[0].split(':').map(Number); W.P.update({ card: it.id, column, lane }); }
          },
        }, `board-${it.id}`);
        W.P.item(W.ctx, card, it);
      }

      W.P.backlog();
      W.today.onclick = () => { W.body.scrollTop = 0; W.P.mirror(); };
    };
  }
  env.template('use-project-board/_board', () => ({ install }));
})();
