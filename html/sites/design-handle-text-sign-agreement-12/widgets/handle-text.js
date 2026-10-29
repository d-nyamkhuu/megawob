// Adds this site's agreement pane, acknowledgment, touched scroll gate, and fitted document rows.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-12',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  template: 'handle-text/editor',
  design: {
    signFieldLabel: null,
    signPlaceholder: 'Enter your full name',
    signScrollMode: 'touched',
    deferSignRestore: true,
    scrollArrows: false,
    parts: {
      signParent: (base, S) => (ctx, body) => {
        const pane = ctx.util.el('div', 'sign-pane', body);
        for (const kind of ['pointerdown', 'wheel', 'keydown']) {
          pane.addEventListener(kind, () => { S.st.userScrolled = true; }, { capture: true });
        }
        return pane;
      },
      signAcknowledgment: (base) => (ctx, parent) => {
        ctx.util.el('p', 'sign-ack', parent, 'By entering your name below, you acknowledge that you have read and agree to be bound by this User Agreement.');
      },
      signLook: (base) => (ctx, look, card) => {
        look.lh = Math.max(12, Math.min(31, Math.floor((ctx.size.height - 300) / ctx.spec.rows)));
        look.vars['--ut-lh'] = look.lh + 'px';
        card.style.setProperty('--ut-lh', look.lh + 'px');
      },
      signScroll: (base, S) => (ctx, card, body, look) => {
        const controller = base(ctx, card, body, look);
        controller.after = (sb, fr) => {
          const pane = sb.box.parentElement;
          const ack = pane.querySelector('.sign-ack');
          const pcs = getComputedStyle(pane), acs = getComputedStyle(ack);
          const available = pane.clientHeight - parseFloat(pcs.paddingTop) - parseFloat(pcs.paddingBottom)
            - ack.getBoundingClientRect().height - parseFloat(acs.marginTop) - parseFloat(acs.marginBottom)
            - fr.row.getBoundingClientRect().height;
          const lh = Math.min(31, Math.floor(available / ctx.spec.rows));
          if (lh > 0 && lh !== look.lh) {
            card.style.setProperty('--ut-lh', lh + 'px');
            sb.list.style.setProperty('height', (ctx.spec.rows * lh) + 'px', 'important');
          }
          if (lh > 0) {
            sb.list.style.fontSize = Math.min(parseFloat(getComputedStyle(sb.list).fontSize), lh - 1) + 'px';
            sb.list.style.setProperty('--sign-heading-size', Math.min(parseFloat(getComputedStyle(sb.list.querySelector('.ut-ln.head') || sb.list).fontSize), lh - 1) + 'px');
          }
          // The original only initialized the scrollbar thumb for a nonzero scene scroll.
          if (ctx.model.scroll) sb.lbx.set({ scroll: ctx.model.scroll });
        };
        return controller;
      },
    },
  },
});
