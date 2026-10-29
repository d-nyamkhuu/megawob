/* use-social-feed/feed: timeline parts; each part remains independently overridable. */
(function () {
  'use strict';

  function installTimeline(BASE, S) {
    // ---------------------------------------------------------------- feed (rebuilt on structure changes)

    const structKey = (R, m) => {
      const { spec, F } = R;
      return JSON.stringify([m.tab, F.helpers.feedOf(spec, m), m.expanded, F.helpers.feedOf(spec, m).map((p) => F.helpers.collapsedBy(spec, m, p) >= 0 ? m.picks[F.helpers.collapsedBy(spec, m, p)] : 0)]);
    };

    // The scroll offset kept when the feed is rebuilt for the same tab.
    BASE.buildStart = () => {};
    BASE.keepOf = (R, m) => (R.fd && R.builtKey && JSON.parse(R.builtKey)[0] === m.tab ? R.fd.feed.scrollTop : 0);
    BASE.scrollbar = (R) => {
      const { util, box } = R;
      const track = util.el('div', 'as-track', box);
      track.dataset.role = 'scrollbar';
      const thumb = util.el('div', 'as-thumb', track);
      thumb.dataset.role = 'thumb';
      return { track, thumb, host: track, pad: 2 };
    };
    BASE.sentinel = (R, feed, m) => {
      const { util, spec, F } = R;
      if (F.helpers.moreToLoad(spec, m)) {
        const sentinel = util.el('div', 'as-loading', feed);
        sentinel.innerHTML = '<svg viewBox="0 0 22 22"><circle class="ring" cx="11" cy="11" r="8.5" fill="none" stroke-width="3"/>'
          + '<path class="arc" d="M11 2.5A8.5 8.5 0 0 1 19.5 11" fill="none" stroke-width="3" stroke-linecap="round"/></svg>';
        util.el('span', '', sentinel, 'Loading more posts…');
        return sentinel;
      }
      return util.el('div', 'as-end', feed, "You're all caught up");
    };
    BASE.feedMade = () => {};
    BASE.rowAdded = () => {};
    BASE.rowsBuilt = () => {};
    BASE.onScroll = (R) => { R.report(); };
    BASE.restoreScroll = (R, B, m, keep, first) => {
      B.feed.scrollTop = keep;
      B.lbx.set(S.D.scrollSet === 'model' || (S.D.scrollSet === 'first' && first) ? { scroll: m.scroll } : {});
    };
    BASE.built = () => {};

    BASE.build = (R, m) => {
      const { util, spec, F } = R;
      S.P.buildStart(R, m);
      const keep = S.P.keepOf(R, m);
      const first = !R.fd;
      if (R.fd) {
        R.fd.feed.remove();
        R.fd.track.remove();
        for (const pt of R.fd.parts.values()) if (pt.panel) pt.panel.remove();
      }
      const feed = util.el('div', 'as-feed' + (spec.hoverBar ? ' hoverbar' : ''), R.box);
      feed.dataset.role = 'feed';
      const sb = S.P.scrollbar(R);
      const B = { feed, track: sb.track, thumb: sb.thumb };
      S.P.feedMade(R, B, m);
      const rows = new Map();
      const parts = new Map();
      for (const p of F.helpers.feedOf(spec, m)) {
        const [row, pt] = S.P.buildPost(R, feed, p, m);
        S.P.rowAdded(R, feed, row, p, m);
        rows.set(p, row);
        parts.set(p, pt);
      }
      B.rows = rows;
      B.parts = parts;
      B.sentinel = S.P.sentinel(R, feed, m);
      S.P.rowsBuilt(R, B, m);
      B.lbx = env.ui.listbox(feed, {
        label: 'feed',
        options: [...rows.entries()],
        onScroll() { S.P.onScroll(R, feed); },
        scrollbar: { track: sb.host, thumb: sb.thumb, pad: sb.pad, minThumb: 36, onDrag: (on) => sb.thumb.classList.toggle('drag', on) },
      });
      S.P.restoreScroll(R, B, m, keep, first);
      R.fd = B;
      R.builtKey = structKey(R, m);
      S.P.built(R, B, m);
    };

    // ---------------------------------------------------------------- the pane's layout, mirrored into the model

    // Is this row (box r) shown completely in the pane [top0, top0 + h]?
    BASE.inView = (R, p, row, r, top0, h) => r.top >= top0 - 0.5 && r.bottom <= top0 + h + 0.5;
    // Is the "Loading more posts" row (box sr) shown in the pane?
    BASE.atEnd = (R, sr, top0, h) => sr.top < top0 + h - 4;
    BASE.scrollOf = (R) => Math.round(R.fd.lbx.scrollIndex() * 1000) / 1000;
    BASE.layoutOf = (R) => {
      const { fd } = R;
      const fr = fd.feed.getBoundingClientRect();
      const top0 = fr.top + fd.feed.clientTop;
      const h = fd.feed.clientHeight;
      const view = [];
      const offs = [];
      for (const [p, row] of fd.rows) {
        const r = row.getBoundingClientRect();
        offs.push(Math.round(r.top - top0 + fd.feed.scrollTop));
        if (S.P.inView(R, p, row, r, top0, h)) view.push(p);
      }
      const sr = fd.sentinel.getBoundingClientRect();
      const atEnd = R.F.helpers.moreToLoad(R.spec, R.ctx.model) && S.P.atEnd(R, sr, top0, h, fr);
      return { scroll: S.P.scrollOf(R), view, atEnd, px: { top: Math.round(fd.feed.scrollTop), h, offs } };
    };
    BASE.report = (R) => {
      // a late scroll event from a past episode's feed: R.spec is that episode's, R.ctx.model the current one
      if (!R.fd || !R.fd.feed.isConnected) return;
      const m = R.ctx.model;
      const lay = S.P.layoutOf(R);
      const changed = lay.scroll !== m.scroll || JSON.stringify(lay.view) !== JSON.stringify(m.view) || lay.atEnd !== m.atEnd
        || JSON.stringify(lay.px) !== JSON.stringify(m.px);
      if (!changed) return;
      const closeMenu = m.menu !== null && m.scroll !== lay.scroll && m.view !== null;
      R.ctx.update(R.F.helpers.act(m, R.spec, { view: lay, closeMenu }));
      if (closeMenu) R.paintMenus();
    };

    const markHover = (R) => {
      if (!R.fd) return;
      for (const [p, row] of R.fd.rows) {
        if (R.ctx.model.hover === p) row.setAttribute('data-hover', 'true');
        else row.removeAttribute('data-hover');
      }
    };

    return { structKey, markHover };
  }

  env.template('use-social-feed/_timeline', () => ({ installTimeline }), { uses: ['use-social-feed/_assets'] });
})();
