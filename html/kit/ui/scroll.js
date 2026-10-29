/*
 * kit/ui/scroll.js: a headless scroll pane: wheel scrolling at once by the event's delta, and an optional custom
 * scrollbar kept in step. Behavior and geometry only: nothing here creates visible elements or sets colors, fonts
 * or sizes; the widget draws the thumb (from onScroll) and styles it while dragged (from onDrag).
 *
 * env.ui.scrollPane(pane, opts) -> { get(), to(px), max(), locateThumb(), detach() }
 *   pane is an element the widget built with overflow hidden or auto. The primitive owns its scroll offset along one
 *   axis (scrollTop, or scrollLeft with axis 'x'):
 *   - wheel: scrolls at once (no smooth scrolling) by the event's delta, in px; deltaMode 1 (lines) counts `line` px
 *     per line, deltaMode 2 (pages) one page(). With axis 'x' the larger of deltaX and deltaY is used. The page's
 *     default wheel scroll is prevented.
 *   - thumb (optional): dragging it scrolls in proportion, travel() px of thumb movement covering max() px.
 *   - track (optional, with a thumb): a press on the track itself (not on the thumb), left button, pages towards the
 *     press by trackPage x page() px.
 *   opts:
 *     axis       'y' (default) | 'x'
 *     max()      largest scroll offset in px (default scrollHeight - clientHeight, or the widths)
 *     page()     px of one page (default clientHeight, or clientWidth)
 *     line       px per wheel line (default 40)
 *     thumb, track   the custom scrollbar's elements
 *     travel()   px the thumb can move (default the track's length minus the thumb's; pass it for a thumb without
 *                a track)
 *     trackPage  fraction of a page a track press scrolls (default 0.8)
 *     onScroll(px)      after every scroll the primitive makes (wheel, thumb, track, to()); the widget places the thumb
 *                       and mirrors the offset into its model here
 *     onDrag(dragging)  the thumb was pressed (true) or released (false)
 *     label      grab label of the thumb (default 'scrollbar')
 *   get() is the current offset; to(px) scrolls to px, clamped to [0, max()] (0 when max() < 0), and calls onScroll. A native scroll
 *   (text selection past the edge, keyboard) does not call onScroll: listen to the pane's 'scroll' event for that.
 *   locateThumb() is the thumb's centre in viewport px (where to press it).
 */
(function () {
  'use strict';
  const ui = (env.ui = env.ui || {});
  const { center } = ui._base;

  ui.scrollPane = function scrollPane(pane, opts = {}) {
    const X = opts.axis === 'x';
    const prop = X ? 'scrollLeft' : 'scrollTop';
    const max = opts.max || (() => (X ? pane.scrollWidth - pane.clientWidth : pane.scrollHeight - pane.clientHeight));
    const page = opts.page || (() => (X ? pane.clientWidth : pane.clientHeight));
    const line = opts.line ?? 40;
    const get = () => pane[prop];
    const to = (px) => {
      pane[prop] = Math.max(0, Math.min(max(), px));
      if (opts.onScroll) opts.onScroll(pane[prop]);
    };
    const detachers = [];
    const listen = (el, type, fn, o) => {
      el.addEventListener(type, fn, o);
      detachers.push(() => el.removeEventListener(type, fn, o));
    };

    listen(pane, 'wheel', (e) => {
      const unit = e.deltaMode === 1 ? line : e.deltaMode === 2 ? page() : 1;
      const d = X ? (Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY) : e.deltaY;
      e.preventDefault();
      to(get() + d * unit);
    }, { passive: false });

    const { thumb, track } = opts;
    const length = (el) => {
      const r = el.getBoundingClientRect();
      return X ? r.width : r.height;
    };
    const travel = opts.travel || (() => length(track) - length(thumb));
    if (thumb) {
      let s0 = 0;
      detachers.push(ui.track(thumb, {
        start() {
          s0 = get();
          if (opts.onDrag) opts.onDrag(true);
        },
        move(p) {
          const span = travel();
          to(s0 + (span > 0 ? ((X ? p.dx : p.dy) / span) * max() : 0));
        },
        end() {
          if (opts.onDrag) opts.onDrag(false);
        },
      }, opts.label || 'scrollbar'));
    }
    if (track && thumb) {
      listen(track, 'pointerdown', (e) => {
        if (e.target !== track || e.button !== 0) return;
        const r = thumb.getBoundingClientRect();
        const dir = (X ? e.clientX < r.left : e.clientY < r.top) ? -1 : 1;
        to(get() + dir * page() * (opts.trackPage ?? 0.8));
      });
    }

    return {
      get,
      to,
      max,
      locateThumb() {
        if (!thumb) throw new Error(`env.ui.scrollPane: ${opts.label || 'scrollbar'} has no thumb`);
        return center(thumb);
      },
      detach() { for (const f of detachers.splice(0)) f(); },
    };
  };
})();
