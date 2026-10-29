// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-10',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  template: 'handle-text/editor',
  design: {
    parts: {
      lineApi: (base, S) => (ctx, box, list, els, opts, scrollbar) => {
        function agreementScroll(ctx, list, opts, scrollbar) {
          const max = () => S.P.fam().helpers.maxScroll(ctx.spec);
          const range = () => Math.max(0, list.scrollHeight - list.clientHeight);
          const index = () => range() ? list.scrollTop / range() * max() : 0;
          const geometry = () => {
            const rect = scrollbar.track.getBoundingClientRect();
            const height = Math.min(Math.max(0, rect.height - 4), Math.max(24,
              rect.height * list.clientHeight / Math.max(1, list.scrollHeight)));
            return { rect, height, travel: Math.max(0, rect.height - height - 4) };
          };
          const draw = () => {
            if (!scrollbar) return;
            const g = geometry();
            scrollbar.thumb.style.height = g.height + 'px';
            scrollbar.thumb.style.top = (2 + (max() ? index() / max() : 0) * g.travel) + 'px';
          };
          const publish = () => {
            draw();
            opts.onScroll(index());
          };
          const set = (state) => {
            if (state.scroll !== undefined) {
              list.scrollTop = max() ? Math.max(0, Math.min(max(), state.scroll)) / max() * range() : 0;
            }
            draw();
          };
          list.tabIndex = 0;
          list.addEventListener('scroll', publish);
          list.addEventListener('keydown', (e) => {
            const step = list.clientHeight / ctx.spec.rows;
            const targets = { ArrowDown: list.scrollTop + step, ArrowUp: list.scrollTop - step,
              PageDown: list.scrollTop + list.clientHeight, PageUp: list.scrollTop - list.clientHeight,
              Home: 0, End: range() };
            if (!(e.key in targets)) return;
            e.preventDefault();
            list.scrollTop = targets[e.key];
            publish();
          });
          if (scrollbar) {
            const { track, thumb } = scrollbar;
            let pointer = null;
            let grab = 0;
            const move = (e) => {
              const g = geometry();
              const fraction = g.travel ? (e.clientY - g.rect.top - 2 - grab) / g.travel : 0;
              list.scrollTop = Math.max(0, Math.min(1, fraction)) * range();
              publish();
            };
            track.addEventListener('pointerdown', (e) => {
              if (e.button !== 0) return;
              e.preventDefault();
              pointer = e.pointerId;
              grab = thumb.contains(e.target) ? e.clientY - thumb.getBoundingClientRect().top : geometry().height / 2;
              track.setPointerCapture(pointer);
              scrollbar.onDrag(true);
              if (!thumb.contains(e.target)) move(e);
            });
            track.addEventListener('pointermove', (e) => {
              if (pointer === e.pointerId) move(e);
            });
            const release = (e) => {
              if (pointer !== e.pointerId) return;
              pointer = null;
              scrollbar.onDrag(false);
              if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
            };
            track.addEventListener('pointerup', release);
            track.addEventListener('pointercancel', release);
            track.addEventListener('lostpointercapture', release);
          }
          draw();
          return {
            set,
            scrollIndex: index,
            locateThumb() { draw(); return ctx.util.center(scrollbar.thumb); },
            locateThumbFor(value) {
              const g = geometry();
              return [g.rect.left + g.rect.width / 2,
                g.rect.top + 2 + g.height / 2 + (max() ? Math.max(0, Math.min(max(), value)) / max() : 0) * g.travel];
            },
          };

        }
        // Agreement geometry is finalized after its field and actions are built.
        // Bind only then so the scrollbar measures the actual viewport and rows.
        let lbx;
        const bind = () => lbx || (lbx = opts.deferBinding
          ? agreementScroll(ctx, list, opts, scrollbar)
          : env.ui.listbox(list, { label: 'text', options: els, onScroll: opts.onScroll, scrollbar }));
        if (!opts.deferBinding) bind();
        return { box, list, get lbx() { return lbx; }, bind };
      },
      signScroll: (base, S) => (ctx, card) => {
        let sb, scrollInput = false, scrollReady = false;
        return {
          options: { deferBinding: true },
          read(i, paint) {
            if (!scrollReady || !scrollInput || !S.st || S.st.ctx !== ctx) return;
            const pane = sb.list;
            const range = Math.max(0, pane.scrollHeight - pane.clientHeight);
            const bottom = pane.scrollTop >= range - 1;
            const s = bottom ? S.P.fam().helpers.maxScroll(ctx.spec) : Math.round(i * 1000) / 1000;
            const m = ctx.model;
            if (Math.abs(s - m.scroll) > .01) {
              const n = S.P.fam().helpers.scrolled(m, ctx.spec, s);
              S.st.ctx.update(n);
              if (n.unlocked !== m.unlocked) paint(n);
            }
          },
          initial(value) {
            sb = value;
            for (const kind of ['pointerdown', 'wheel', 'keydown']) sb.box.addEventListener(kind, () => { scrollInput = true; }, { capture: true, passive: true });
          },
          built() {},
          after() {
            const lh = sb.list.clientHeight / ctx.spec.rows;
            card.style.setProperty('--ut-lh', lh + 'px');
            sb.bind();
            const max = S.P.fam().helpers.maxScroll(ctx.spec);
            sb.lbx.set({ scroll: ctx.model.scroll });
            sb.list.scrollTop = max ? (ctx.model.scroll / max) * (sb.list.scrollHeight - sb.list.clientHeight) : 0;
            scrollReady = true;
          },
          sync(value, m) {
            const max = S.P.fam().helpers.maxScroll(ctx.spec);
            if (m.scroll >= max) sb.list.scrollTop = sb.list.scrollHeight - sb.list.clientHeight;
            else if (Math.abs(sb.lbx.scrollIndex() - m.scroll) > .01) sb.lbx.set({ scroll: m.scroll });
          },
          dispose() {},
        };
      },
    },
  },
});
