// This design adds the signature caption, sidebar progress highlight, and guarded agreement scrolling.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-08',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  template: 'handle-text/editor',
  design: {
    directDecline: true,
    deferSignRestore: true,
    signPlaceholder: 'Enter your full name',
    parts: {
      viewBuilt: (base, S) => (ctx, view, look, box) => {
        if (ctx.spec.scenario !== 'sign-agreement') base(ctx, view, look, box);
      },
      lineApi: (base, S) => (ctx, box, list, els, opts, scrollbar) => {
        if (ctx.spec.scenario !== 'sign-agreement') return base(ctx, box, list, els, opts, scrollbar);

        const rowHeight = Math.max(1, Math.floor(box.clientHeight / opts.rows));
        list.style.setProperty('height', rowHeight * opts.rows + 'px', 'important');
        list.style.setProperty('--ut-lh', rowHeight + 'px');

        const onScroll = opts.onScroll;
        let restoring = false;
        let restoredIndex = 0;
        opts.onScroll = (index) => {
          if (!list.isConnected || !S.st || S.st.ctx !== ctx || restoring ||
              (restoredIndex !== null && Math.abs(index - restoredIndex) < 0.01)) return;
          restoredIndex = null;
          const last = S.P.fam().helpers.maxScroll(ctx.spec);
          const atBottom = index >= last - 0.01 ||
            (index >= last - 1 && list.scrollTop > 0 &&
              list.scrollHeight - list.clientHeight - list.scrollTop <= 1);
          onScroll(atBottom ? last : index);
        };

        const result = base(ctx, box, list, els, opts, scrollbar);
        const restore = (scroll) => {
          restoring = true;
          result.lbx.set({ scroll });
          restoredIndex = result.lbx.scrollIndex();
          restoring = false;
        };
        return { ...result, restore };
      },
      signCaption: (base, S) => (ctx, body) => {
        const signature = ctx.util.el('div', 'signature-caption', body);
        ctx.util.el('strong', '', signature, 'SIGNATURE');
        ctx.util.el(
          'p',
          '',
          signature,
          'By entering your name below, you acknowledge that you have read, understood, and agree to be bound by this Agreement.',
        );
      },
      signScroll: (base, S) => (ctx, card) => {
        const controller = base(ctx, card);
        controller.after = (sb) => {
          if (ctx.model.scroll) sb.restore(ctx.model.scroll);
        };
        controller.sync = (sb, model) => {
          if (Math.abs(sb.lbx.scrollIndex() - model.scroll) > 0.01) sb.restore(model.scroll);
        };
        return controller;
      },
      signPaint: (base, S) => (ctx, body, model) => {
        base(ctx, body, model);
        const items = document.querySelectorAll('nav.rail > div');
        items.forEach((item, i) => item.classList.toggle('active', i === (model.unlocked ? items.length - 1 : 0)));
      },
    },
  },
});
