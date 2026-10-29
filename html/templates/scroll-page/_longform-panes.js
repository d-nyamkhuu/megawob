/* scroll-page/_longform-panes: install the native-scroll pane parts; S reads the live design and parts. */
(function () {
  'use strict';

  function installPaneRows(BASE, S) {
    BASE.paneFrame = (st, parent, className) => {
      const { el } = st;
      const box = el('div', className, parent);
      const list = el('div', 'ps-list', box);
      list.dataset.role = 'pane';
      const track = el('div', 'ps-track', box);
      const thumb = el('div', 'ps-thumb', track);
      return { box, list, track, thumb };
    };

    BASE.decorated = (st, element, kind, data) => {};

    BASE.row = (st, list, r, pitch) => {
      const { el } = st;
      const re = el('div', 'ps-row', list);
      re.style.height = pitch + 'px';
      el('span', 't', re, r.title);
      el('span', 'm', re, r.meta);
      for (const a of r.actions) S.P.action(st, re, a, 'ps-btn');
      S.P.decorated(st, re, 'row', r);
      return re;
    };

    BASE.group = (st, list, g, rowH) => {
      const { el } = st;
      const ge = el('div', 'ps-group', list);
      ge.style.height = rowH + 'px';
      const head = el('h5', '', ge, g.title);
      S.P.pane(st, ge, g.pane, rowH - 44, 44, list);
      return head;
    };

    BASE.pane = (st, parent, p, height, rowH, parentList) => {
      const { panes } = st;
      const { box, list, track, thumb } = S.P.paneFrame(st, parent, 'ps-pane');
      box.style.height = height + 'px';
      const rec = { id: p.id, box, list, track, thumb, pitch: rowH, parentList, count: 0 };
      panes[p.id] = rec;
      if (p.groups) {
        rec.count = p.groups.length;
        rec.heads = [];
        for (const g of p.groups) {
          rec.heads.push(S.P.group(st, list, g, rowH));
        }
      } else {
        rec.count = p.rows.length;
        for (const r of p.rows) {
          S.P.row(st, list, r, rowH);
        }
      }
      S.P.scrollbar(st, rec);
      return rec;
    };

    BASE.paneTitle = (st, parent, text) => {
      const { el } = st;
      const h = el('h3', '', parent, text);
      h.style.margin = '14px 0 4px';
      h.style.fontSize = '17px';
      return h;
    };
  }

  function installCards(BASE, S) {
    BASE.card = (st, list, r, width, slide) => {
      const { el } = st;
      const c = el('div', slide ? 'ps-slide' : 'ps-hcard', list);
      c.style.width = width + 'px';
      el('div', 't', c, r.title);
      el('div', 'm', c, r.meta);
      const acts = el('div', 'acts', c);
      for (const a of r.actions) S.P.action(st, acts, a, 'ps-btn');
      S.P.decorated(st, c, slide ? 'slide' : 'card', r);
      return c;
    };

    BASE.cards = (st, rec, p, o) => {
      const { box, list } = rec;
      box.style.height = '';
      // The strip grows to its tallest card: a long title and wrapped action buttons would otherwise run under
      // the scrollbar track, which then takes the clicks.
      list.style.height = '';
      list.style.minHeight = o.height + 'px';
      for (const r of p.rows) S.P.card(st, list, r, o.pitch, false);
    };

    BASE.slides = (st, rec, p, o) => {
      const { box, list } = rec;
      box.style.height = '';
      list.style.height = o.height + 'px';
      rec.pitch = list.clientWidth;
      p.rows.forEach((r) => S.P.card(st, list, r, rec.pitch, true));
      S.P.slideControls(st, rec, p);
    };

    BASE.arrow = (st, box, dir) => {
      const { el } = st;
      const b = el('button', `ps-arrow ${dir}`, box, dir === 'prev' ? '‹' : '›');
      b.type = 'button';
      b.dataset.role = 'arrow';
      b.setAttribute('aria-label', dir === 'prev' ? 'Previous slide' : 'Next slide');
      return b;
    };

    BASE.slideControls = (st, rec, p) => {
      const { el, util } = st;
      const { box, list } = rec;
      const dots = el('div', 'ps-dots', box);
      rec.dots = p.rows.map(() => el('i', '', dots));
      // Sync at once: the list's scroll event comes a frame later, and an action read before it would see the
      // old slide (the oracle then pressed next again).
      const goTo = (idx) => {
        const i = Math.max(0, Math.min(p.rows.length - 1, idx));
        list.scrollLeft = i * rec.pitch;
        S.P.onScroll(st);
      };
      for (const dir of ['prev', 'next']) {
        const b = S.P.arrow(st, box, dir);
        b.addEventListener('click', () => goTo(Math.round(list.scrollLeft / rec.pitch) + (dir === 'prev' ? -1 : 1)));
        rec[dir] = b;
      }
      // wheel with dx moves whole slides (a step always lands on one); a vertical wheel scrolls the page
      list.addEventListener('wheel', (e) => {
        if (!e.deltaX || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        goTo(Math.round((list.scrollLeft + e.deltaX) / rec.pitch));
      }, { passive: false });
      // swipe: drag a slide's background sideways
      util.drag(list, {
        start(e) {
          if (e.target.closest('button, a')) return false;
          rec.s0 = list.scrollLeft;
          list.style.scrollSnapType = 'none';
          return true;
        },
        move(e, dx) { list.scrollLeft = Math.max(0, Math.min(list.scrollWidth - list.clientWidth, rec.s0 - dx)); },
        end(e, dx) {
          let i = Math.round(rec.s0 / rec.pitch);
          if (Math.abs(dx) > rec.pitch * 0.2) i += dx < 0 ? 1 : -1;
          list.style.scrollSnapType = '';
          goTo(i);
        },
      }, 'slide-swipe');
    };
  }

  function installRowLoading(BASE, S) {
    BASE.stickyHeader = (st, list, p, o) => {
      const { el } = st;
      const head = el('div', 'ps-shead', list);
      head.style.height = o.hh + 'px';
      el('b', '', head, p.title);
      el('span', '', head, p.kind === 'sellers' ? 'Price · Ships' : 'Details');
      el('span', '', head, 'Actions');
      return head;
    };

    BASE.sticky = (st, rec, p, o) => {
      const { gates } = st;
      const { list } = rec;
      rec.head = S.P.stickyHeader(st, list, p, o);
      for (const r of p.rows) {
        const re = S.P.addRow(st, rec, r);
        for (const a of r.actions) gates[a.id] = () => S.P.rowFull(st, rec, re, st.actionEls[a.id]);
      }
    };

    BASE.lazy = (st, rec, p, o) => {
      const { ctx, el } = st;
      const { list } = rec;
      rec.sent = el('div', 'ps-sent', list, S.D.loadingText);
      rec.sent.style.height = o.pitch + 'px';
      rec.shown = 0;
      rec.syncLazy = (m) => {
        const want = Math.min(p.rows.length, m.loaded === undefined ? p.initial : m.loaded);
        while (rec.shown < want) S.P.addRow(st, rec, p.rows[rec.shown++], rec.sent);
        rec.count = rec.shown;
        rec.sent.style.display = rec.shown < p.rows.length ? '' : 'none';
      };
      rec.syncLazy({ loaded: p.initial });
      rec.maybeLoad = () => {
        const m = ctx.model;
        if (rec.shown >= p.rows.length || m.loaded >= p.rows.length) return;
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - o.pitch * 0.6) {
          ctx.update({ ...m, loaded: Math.min(p.rows.length, m.loaded + p.batch) });
          rec.syncLazy(ctx.model);
        }
      };
    };

    BASE.addRow = (st, rec, r, before) => {
      const re = S.P.row(st, rec.list, r, rec.pitch);
      if (before) rec.list.insertBefore(re, before);
      rec.rowEls[r.id] = re;
      return re;
    };
  }

  function installScrollbars(BASE, S) {
    BASE.placeThumb = (st, rec) => {
      if (rec.kind === 'slides') return;
      const { list, track, thumb } = rec;
      const x = rec.axis === 'x';
      const max = x ? list.scrollWidth - list.clientWidth : list.scrollHeight - list.clientHeight;
      const view = x ? list.clientWidth : list.clientHeight;
      const whole = x ? list.scrollWidth : list.scrollHeight;
      const th = x ? track.clientWidth : track.clientHeight;
      const h = max > 0 ? Math.max(S.D.thumbMinimum, th * view / whole) : th;
      const pos = max > 0 ? (th - h) * (x ? list.scrollLeft : list.scrollTop) / max : 0;
      if (x) { thumb.style.width = h + 'px'; thumb.style.left = pos + 'px'; } else { thumb.style.height = h + 'px'; thumb.style.top = pos + 'px'; }
      thumb.style.display = max > 0 ? '' : 'none';
    };

    BASE.scrollbar = (st, rec) => {
      const { util } = st;
      const { list, track, thumb } = rec;
      const x = rec.axis === 'x';
      rec.placeThumb = () => S.P.placeThumb(st, rec);
      list.addEventListener('scroll', () => {
        if (rec.maybeLoad) rec.maybeLoad();
        rec.placeThumb();
        S.P.onScroll(st);
      }, { passive: true });
      if (rec.kind === 'slides') return;
      util.drag(thumb, {
        start() { rec.drag0 = x ? list.scrollLeft : list.scrollTop; },
        move(e, dx, dy) {
          const max = x ? list.scrollWidth - list.clientWidth : list.scrollHeight - list.clientHeight;
          const room = x ? track.clientWidth - thumb.offsetWidth : track.clientHeight - thumb.offsetHeight;
          if (room > 0) {
            const v = rec.drag0 + (x ? dx : dy) * max / room;
            if (x) list.scrollLeft = v; else list.scrollTop = v;
          }
        },
      }, 'pane-thumb');
    };

    BASE.scroller = (st, parent, p, o) => {
      const { panes } = st;
      const x = o.axis === 'x';
      const { box, list, track, thumb } = S.P.paneFrame(st, parent, `ps-pane${x ? ' ps-hbox' : ''}${o.kind === 'slides' ? ' ps-car' : ''}`);
      const rec = { id: p.id, box, list, track, thumb, pitch: o.pitch, parentList: null, count: p.rows.length, axis: o.axis,
        kind: o.kind, hh: o.hh || 0, rowEls: {} };
      panes[p.id] = rec;
      if (x) list.style.height = o.height + 'px';
      else box.style.height = o.height + 'px';
      if (o.kind === 'slides') track.style.display = 'none';
      if (o.kind === 'cards') S.P.cards(st, rec, p, o);
      else if (o.kind === 'slides') S.P.slides(st, rec, p, o);
      else if (o.kind === 'sticky') S.P.sticky(st, rec, p, o);
      else if (o.kind === 'lazy') S.P.lazy(st, rec, p, o);
      else for (const r of p.rows) S.P.addRow(st, rec, r);
      S.P.scrollbar(st, rec);
      return rec;
    };

    // hit (a click gate): only the clicked control's centre must clear the site's sticky header and the window bottom,
    // the rule the oracle reveals points by; a row whose top edge the page scrolled under a tall pinned header still
    // takes a click on its visible button
    BASE.rowFull = (st, rec, re, hit) => {
      const lr = rec.list.getBoundingClientRect();
      const rr = re.getBoundingClientRect();
      const tol = Math.max(0.5, 0.02 * rec.pitch);
      if (!(rr.top >= lr.top + rec.hh - tol && rr.bottom <= lr.bottom + tol)) return false;
      if (hit) {
        const hr = hit.getBoundingClientRect();
        const cy = hr.top + hr.height / 2;
        return cy >= S.P.stickyBottom() && cy <= window.innerHeight;
      }
      return rr.top >= S.P.stickyBottom() - 0.5 && rr.bottom <= window.innerHeight + 0.5;
    };
  }

  env.template('scroll-page/_longform-panes', () => ({
    installPaneRows, installCards, installRowLoading, installScrollbars,
  }));
})();
