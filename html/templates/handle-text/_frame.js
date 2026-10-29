/* handle-text/_frame: shared frame units; S supplies live state and resolved parts. */
(function () {
  'use strict';
  function frame(S, ctx, look, file, tag) {
    const { util, stage } = ctx;
    const card = util.el('div', 'ut-card', stage);
    card.dataset.role = 'window';
    for (const [k, v] of Object.entries(look.vars)) card.style.setProperty(k, v);
    const bar = util.el('div', 'ut-bar', card);
    if (look.dots) {
      const d = util.el('div', 'ut-dots', bar);
      for (let i = 0; i < 3; i++) util.el('i', '', d);
    }
    util.el('span', 'ut-file', bar, file);
    if (tag) util.el('span', 'ut-tag', bar, tag);
    const body = util.el('div', 'ut-body col', card);
    return { card, body };
  }

  function statusBar(S, card, util, items) {
    const s = util.el('div', 'ut-status', card);
    for (const t of items) util.el('span', '', s, t);
    return s;
  }

  function resultLine(S, ctx, parent, onUndo) {
    const { util } = ctx;
    const line = util.el('div', 'ut-result', parent);
    const text = util.el('span', '', line);
    const btn = util.el('button', 'ut-btn', line, ctx.rng.pick(['Undo', 'Go back', 'Undo click']));
    btn.type = 'button';
    btn.dataset.role = 'undo';
    btn.style.visibility = 'hidden';
    btn.addEventListener('click', () => { S.env.log('click', { what: 'undo' }); onUndo(); });
    return {
      set(kind, msg, undo) {
        line.className = 'ut-result' + (kind ? ` ${kind}` : '');
        text.textContent = msg;
        btn.style.visibility = undo ? 'visible' : 'hidden';
      },
      locate: () => ctx.util.center(btn),
    };
  }

  function scrollLoc(S, t, lbx, spec, list) {
    if (t.pane) {
      const r = list.getBoundingClientRect();
      return [r.left + r.width * 0.45, r.top + r.height / 2];
    }
    if (t.thumb !== undefined) return lbx.locateThumb();
    if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
    if (t.scrollEdge !== undefined) {
      const top = t.scrollEdge === 'top';
      const p = lbx.locateThumbFor(top ? 0 : S.fam().helpers.maxScroll(spec));
      return [p[0], p[1] + (top ? -4 : 4)];
    }
    return null;
  }
  env.template('handle-text/_frame', () => ({ frame, statusBar, resultLine, scrollLoc }));
})();
