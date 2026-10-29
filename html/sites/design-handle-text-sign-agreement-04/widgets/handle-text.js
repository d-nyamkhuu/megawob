// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-04',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  template: 'handle-text/editor',
  design: {
    signScrollMode: 'plain', unlockAtEnd: true,
    parts: {
      lineApi: (base, S) => (ctx, box, list, els, opts, scrollbar) => {
        const { util } = ctx;
        // Wrapped agreement paragraphs have unequal heights. Normalize the DOM scroll range
        // to the task's logical line range, keeping its gate and scene state exact.
        const normalized = ctx.spec.scenario === 'sign-agreement';
        const logicalMax = normalized ? S.P.fam().helpers.maxScroll(ctx.spec) : 0;
        let settingScroll = false;
        let renderedTop = 0;
        const readScroll = () => {
          const pixels = list.scrollHeight - list.clientHeight;
          // Chromium may stop at a fractional pixel short of scrollHeight. The
          // agreement's bottom gate must still receive the exact logical maximum.
          if (pixels > 0 && pixels - list.scrollTop <= 1) return logicalMax;
          return pixels > 0 ? list.scrollTop / pixels * logicalMax : 0;
        };
        // When the whole agreement fits in the (tall) pane the DOM has nothing to scroll, yet the task
        // still gates the form on reaching the end. Pad the bottom (scroll-past-end) so the pane always
        // scrolls through the task's logical range.
        const ensureRange = () => {
          if (!normalized || !list.isConnected || !list.clientHeight || !els.length) return;
          const first = els[0][1].getBoundingClientRect();
          const lastRow = els[els.length - 1][1].getBoundingClientRect();
          const content = lastRow.bottom - first.top;
          const want = Math.max(0, Math.ceil(list.clientHeight + logicalMax * Math.max(1, first.height) - content));
          const have = parseFloat(list.style.paddingBottom) || 0;
          if (Math.abs(want - have) >= 1) list.style.paddingBottom = want + 'px';
        };
        if (normalized && typeof ResizeObserver === 'function') new ResizeObserver(ensureRange).observe(list);
        if (normalized) {
          // The generic listbox assumes equal-height rows. These paragraphs wrap,
          // so bind the existing scrollbar to the actual DOM pixel range instead.
          const paintThumb = () => {
            ensureRange();
            if (!scrollbar) return;
            const room = Math.max(0, scrollbar.track.clientHeight - 2 * scrollbar.pad);
            const height = Math.min(room, Math.max(scrollbar.minThumb,
              room * list.clientHeight / Math.max(1, list.scrollHeight)));
            const range = Math.max(0, list.scrollHeight - list.clientHeight);
            scrollbar.thumb.style.height = height + 'px';
            scrollbar.thumb.style.top = (scrollbar.pad + (range ? list.scrollTop / range : 0) * (room - height)) + 'px';
          };
          const changed = (fromInput = false) => {
            paintThumb();
            if (!list.isConnected || !S.st || S.st.ctx !== ctx || settingScroll) return;
            if (!fromInput && Math.abs(list.scrollTop - renderedTop) < .01) return;
            renderedTop = list.scrollTop;
            opts.onScroll(readScroll());
          };
          list.addEventListener('scroll', () => changed());
          // Commit wheel input before the task clock's sync can restore the old
          // controlled value. Native scroll events arrive on a later browser turn.
          list.tabIndex = 0;
          list.addEventListener('wheel', e => {
            if (!e.deltaY) return;
            e.preventDefault();
            const unit = e.deltaMode === 1 ? opts.lh : e.deltaMode === 2 ? list.clientHeight : 1;
            list.scrollTop += e.deltaY * unit;
            changed(true);
          }, { passive: false });
          if (scrollbar) {
            const { track, thumb, pad } = scrollbar;
            let dragging = false;
            let grab = 0;
            const move = e => {
              const r = track.getBoundingClientRect();
              const room = track.clientHeight - 2 * pad - thumb.getBoundingClientRect().height;
              const offset = e.clientY - r.top - pad - grab;
              // Oracle coordinates and mouse events can round opposite ways at a
              // fractional CSS pixel. Snap the last two track pixels to the edge.
              const fraction = room <= 0 || offset <= 2 ? 0 : offset >= room - 2 ? 1 : offset / room;
              list.scrollTop = fraction * Math.max(0, list.scrollHeight - list.clientHeight);
              changed(true);
            };
            track.addEventListener('pointerdown', e => {
              if (e.button !== 0) return;
              e.preventDefault();
              const r = thumb.getBoundingClientRect();
              grab = e.target === thumb ? e.clientY - r.top : r.height / 2;
              dragging = true;
              scrollbar.onDrag(true);
              track.setPointerCapture(e.pointerId);
              move(e);
            });
            track.addEventListener('pointermove', e => { if (dragging) move(e); });
            const release = () => { dragging = false; scrollbar.onDrag(false); };
            track.addEventListener('pointerup', e => { if (dragging) move(e); release(); });
            track.addEventListener('pointercancel', release);
          }
          const lbx = {
            scrollIndex: readScroll,
            locateThumb: () => scrollbar ? util.center(scrollbar.thumb) : util.center(list),
            locateThumbFor(i) {
              const fraction = logicalMax ? Math.max(0, Math.min(1, i / logicalMax)) : 0;
              if (!scrollbar) {
                const r = list.getBoundingClientRect();
                return [r.right - 5, r.top + fraction * r.height];
              }
              const r = scrollbar.track.getBoundingClientRect();
              const h = scrollbar.thumb.getBoundingClientRect().height;
              return [r.left + r.width / 2, r.top + scrollbar.pad + h / 2 + fraction * (scrollbar.track.clientHeight - 2 * scrollbar.pad - h)];
            },
            set(value) {
              settingScroll = true;
              try {
                list.scrollTop = (logicalMax ? value.scroll / logicalMax : 0) * Math.max(0, list.scrollHeight - list.clientHeight);
                renderedTop = list.scrollTop;
                paintThumb();
              } finally { settingScroll = false; }
            },
          };
          return { box, list, lbx };
        }

        return base(ctx, box, list, els, opts, scrollbar);
      },
      signScroll: (base, S) => (ctx, card) => {
        const controller = base(ctx, card);
        controller.after = (sb) => sb.lbx.set({ scroll: ctx.model.scroll });
        return controller;
      },
    },
  },
});
