// Agreement scrolling follows physical pane position and maps its thumb to the task's logical range.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-06',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
  template: 'handle-text/editor',
  design: {
    parts: {
      lineApi: (base, S) => (ctx, box, list, els, opts, scrollbar) => {
        const result = base(ctx, box, list, els, opts, scrollbar);
        if (opts.maxScroll === undefined || !scrollbar) return result;
        return {
          ...result,
          lbx: {
            ...result.lbx,
            locateThumbFor(index) {
              const rail = scrollbar.track.getBoundingClientRect();
              const thumb = scrollbar.thumb.getBoundingClientRect();
              const fraction = Math.max(0, Math.min(1, index / Math.max(1, opts.maxScroll)));
              const travel = Math.max(0, scrollbar.track.clientHeight - 2 * scrollbar.pad - thumb.height);
              return [rail.left + rail.width / 2, rail.top + scrollbar.pad + thumb.height / 2 + fraction * travel];
            },
          },
        };
      },
      signScroll: (base, S) => (ctx, card) => {
        let sb;
        let scrollReady = false;
        let previousTop = 0;
        let paintCurrent = () => {};
        const maxScroll = S.P.fam().helpers.maxScroll(ctx.spec);
        const positionScroll = (model) => {
          const range = Math.max(0, sb.list.scrollHeight - sb.list.clientHeight);
          const top = Math.max(0, Math.min(1, model.scroll / Math.max(1, maxScroll))) * range;
          if (Math.abs(sb.list.scrollTop - top) > 1) sb.list.scrollTop = top;
          previousTop = sb.list.scrollTop;
        };
        const readScroll = (paint) => {
          if (!scrollReady || !sb.list.isConnected || !card.isConnected || !S.st || S.st.ctx !== ctx) return;
          const range = sb.list.scrollHeight - sb.list.clientHeight;
          if (range <= 0 || Math.abs(sb.list.scrollTop - previousTop) < 0.5) return;
          previousTop = sb.list.scrollTop;
          const atEnd = range - sb.list.scrollTop <= 1;
          const scroll = atEnd ? maxScroll : Math.min(maxScroll - 0.001,
            Math.round(sb.list.scrollTop / range * maxScroll * 1000) / 1000);
          const model = ctx.model;
          if (scroll !== model.scroll) {
            const next = S.P.fam().helpers.scrolled(model, ctx.spec, scroll);
            ctx.update(next);
            if (next.unlocked !== model.unlocked) paint(next);
          }
        };
        return {
          options: { maxScroll },
          read(_index, paint) { paintCurrent = paint; readScroll(paint); },
          initial(value) {
            sb = value;
            sb.list.addEventListener('scroll', () => readScroll(paintCurrent), { passive: true });
            sb.lbx.set({ scroll: ctx.model.scroll });
          },
          built() {},
          after(value) {
            sb = value;
            if (maxScroll > 0 && sb.list.scrollHeight <= sb.list.clientHeight + 1) {
              const height = Math.ceil(sb.list.clientHeight / ctx.spec.rows) + 1;
              for (const row of sb.list.children) row.style.minHeight = height + 'px';
              sb.lbx.set({ scroll: ctx.model.scroll });
            }
            positionScroll(ctx.model);
            scrollReady = true;
          },
          sync(value, model) { positionScroll(model); },
          dispose() {},
        };
      },
    },
  },
});
