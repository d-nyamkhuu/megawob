/* use-project-board/_view: Committed board layout and shared paint, mirror and target dispatchers.
 * install(BASE, W) retains the workspace's design parts; W is its live per-page state. */
(function () {
  'use strict';
  function install(BASE, W) {
    BASE.boardMirror = () => {
      const { cells, cardOffsets, cardH } = W.scene;
      const v = {};
      for (const { id } of W.active) {
        const c = W.ctx.model.cards[id], cell = cells[`${c.column}:${c.lane}`];
        v[id] = { center: cardOffsets[id] + cardH / 2, scroll: cell.scrollTop, height: cell.clientHeight, cell: [c.column, c.lane] };
      }
      const view = { scroll: W.body.scrollTop, cards: v, reset: W.P.currentViewReset() };
      if (JSON.stringify(W.ctx.model.view) !== JSON.stringify(view)) W.ctx.update({ ...W.ctx.model, view });
    };

    BASE.boardPaint = (m) => {
      const { counters, cells, contents, cards, empty, cardH, cardOffsets } = W.scene;
      const counts = W.F.helpers.counts(m, W.s);
      counters.forEach(({ h, value }, c) => { value.textContent = W.s.scenario === 'wip' || W.s.judge ? `${counts[c]} / ${W.s.limits[c]} WIP` : String(counts[c]); h.classList.toggle('over', W.s.scenario === 'wip' && counts[c] > W.s.limits[c]); });
      for (const k of Object.keys(cells)) {
        const [column, lane] = k.split(':').map(Number);
        const members = W.active.filter(({ id }) => m.cards[id].column === column && m.cards[id].lane === lane);
        const group = members.filter(() => W.filter === 'All work' || (W.filter === 'Completed work' ? column === 2 : column !== 2));
        if (W.grouping === 'Assignee') group.sort((a, b) => a.owner.localeCompare(b.owner, 'en'));
        members.forEach((it) => { cards[it.id].style.display = group.includes(it) ? '' : 'none'; });
        contents[k].style.height = `${Math.max(cells[k].clientHeight, group.length * (cardH + W.D.cardGap) + W.D.cardGap)}px`;
        empty[k].style.display = group.length ? 'none' : '';
        group.forEach((it, i) => {
          if (cards[it.id].parentElement !== contents[k]) contents[k].append(cards[it.id]);
          const top = W.D.cardGap + i * (cardH + W.D.cardGap); cards[it.id].style.top = `${top}px`; cardOffsets[it.id] = top;
        });
      }
    };

    BASE.boardRefresh = () => {
      const { backlogCards, backlogGrid } = W.scene;
      for (const it of W.related) backlogCards[it.id].style.display = W.filter === 'All work' || (W.filter === 'Completed work' ? it.state === 'Complete' : it.state !== 'Complete') ? '' : 'none';
      if (W.grouping === 'Assignee') [...W.related].sort((a, b) => a.owner.localeCompare(b.owner, 'en')).forEach((it) => backlogGrid.append(backlogCards[it.id]));
      else W.related.forEach((it) => backlogGrid.append(backlogCards[it.id]));
      W.P.paint(W.ctx.model);
    };

    BASE.boardLocate = (t) => {
      const { cards, cells } = W.scene;
      return t.card ? W.u.center(cards[t.card]) : W.u.center(cells[t.cell.join(':')]);
    };

    BASE.paint = (m) => {
      W.P.paintScene(m); W.P.footer(m); W.P.mirror();
    };

    BASE.footer = (m) => {
      W.foot.replaceChildren();
      W.u.el('span', '', W.foot, 'Current sprint');
      for (const fact of W.F.facts(m, W.s)) { const el = W.u.el('span', '', W.foot, `${fact.label}:`); W.u.el('strong', '', el, fact.value); }
    };

    BASE.paintScene = (m) => {
      return W.isBoard ? W.P.boardPaint(m) : W.P.timelinePaint(m);
    };

    BASE.mirror = () => {
      return W.isBoard ? W.P.boardMirror() : W.P.timelineMirror();
    };

    BASE.refreshView = () => {
      return W.isBoard ? W.P.boardRefresh() : W.P.timelineRefresh();
    };

    BASE.locateScene = (t) => {
      return W.isBoard ? W.P.boardLocate(t) : W.P.timelineLocate(t);
    };

    BASE.locate = (t) => {
      return t.resetView ? W.u.center(W.clearBtn) : t.pane ? [W.body.getBoundingClientRect().right - 25, W.body.getBoundingClientRect().top + 20] : W.P.locateScene(t);
    };

    BASE.item = (ctx, el, it) => {};

    BASE.rendered = (ctx) => {
      // Decoration hook, after the first layout and model mirror.
    };
  }
  env.template('use-project-board/_view', () => ({ install }));
})();
