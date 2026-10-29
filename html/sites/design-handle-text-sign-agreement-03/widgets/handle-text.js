// The agreement preset supplies the layout; these parts preserve its logical scroll gate.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-03',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  template: 'handle-text/editor',
  design: {
    parts: {
      lineApi: (base, S) => (ctx, box, list, els, opts, scrollbar) => {
        const maxScroll = S.P.fam().helpers.maxScroll(ctx.spec);
        let ready = false;
        let settingScroll = false;
        let lastScrollTop = null;
        const mappedOpts = {
          ...opts,
          onScroll(i) {
            if (!ready || settingScroll || !list.isConnected || !S.st || S.st.ctx !== ctx) return;
            if (lastScrollTop === list.scrollTop) return;
            lastScrollTop = list.scrollTop;
            const travel = list.scrollHeight - list.clientHeight;
            const at = travel > 0 ? list.scrollTop / travel * maxScroll : i;
            opts.onScroll(Math.round(at * 1000) / 1000);
          },
        };
        const sb = base(ctx, box, list, els, mappedOpts, scrollbar);
        const physical = sb.lbx;
        sb.lbx = {
          ...physical,
          scrollIndex() {
            const travel = list.scrollHeight - list.clientHeight;
            return travel > 0 ? list.scrollTop / travel * maxScroll : 0;
          },
          set({ scroll }) {
            settingScroll = true;
            try {
              const travel = list.scrollHeight - list.clientHeight;
              list.scrollTop = maxScroll > 0 ? scroll / maxScroll * travel : 0;
              physical.set({ scroll: physical.scrollIndex() });
            } finally {
              lastScrollTop = list.scrollTop;
              settingScroll = false;
            }
          },
          locateThumbFor(scroll) {
            const track = box.querySelector('.ut-track');
            const thumb = box.querySelector('.ut-thumb');
            if (!track || !thumb) return physical.locateThumbFor(scroll);
            const rect = track.getBoundingClientRect();
            const height = thumb.getBoundingClientRect().height;
            const fraction = Math.max(0, Math.min(1, scroll / maxScroll));
            return [physical.locateThumb()[0], rect.top + 2 + height / 2 + fraction * (rect.height - 4 - height)];
          },
          activate() { ready = true; },
        };
        return sb;
      },
      signScroll: (base, S) => (ctx, card) => {
        let sb;
        return {
          options: {},
          read(i, paint) {
            const s = Math.round(i * 1000) / 1000;
            const m = S.st.ctx.model;
            if (s !== m.scroll) {
              const n = S.P.fam().helpers.scrolled(m, ctx.spec, s);
              S.st.ctx.update(n);
              if (n.unlocked !== m.unlocked) paint(n);
            }
          },
          initial(value) {
            sb = value;
            sb.lbx.set({ scroll: ctx.model.scroll });
          },
          built() {},
          after(value) {
            sb = value;
            const height = sb.box.clientHeight - 2;
            sb.list.style.setProperty('height', height + 'px', 'important');
            const pad = parseFloat(getComputedStyle(sb.list).paddingBottom) || 0;
            const text = Array.from(sb.list.children).reduce((n, child) => n + child.offsetHeight, 0);
            const want = Math.max(30, Math.round(sb.list.clientHeight * 0.12));
            const real = sb.list.scrollHeight - sb.list.clientHeight;
            const over = real > 0 ? real : text + pad - sb.list.clientHeight;
            if (over < want) sb.list.style.setProperty('padding-bottom', pad + want - over + 'px', 'important');
            sb.lbx.set({ scroll: ctx.model.scroll });
            sb.lbx.activate();
          },
          sync(value, m) {
            sb = value;
            if (Math.abs(sb.lbx.scrollIndex() - m.scroll) > 0.01) sb.lbx.set({ scroll: m.scroll });
          },
          dispose() {},
        };
      },
    },
  },
});
