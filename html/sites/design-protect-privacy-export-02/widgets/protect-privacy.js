// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-export-02',
  name: 'design',
  split: 'train',
  scenarios: ['export'],
  template: 'protect-privacy/classic',
  design: {
    font: '16px/1.4 Arial, "Segoe UI", sans-serif',
    radius: '0px',
    parts: {
      // Keep the template's seeded draws, then fit the page to its actual stage.
      fit: (base) => (ctx) => ({
        ...base(ctx), M: 0, fullW: ctx.size.width, fullH: ctx.size.height,
        winW: ctx.size.width, winH: ctx.size.height, ax: 'left',
      }),
      tabs: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
      address: (base, S) => (ctx) => {
        base(ctx);
        S.win.lastElementChild.remove();
      },
      navigation: () => () => {},
      table: (base, S) => (main, model) => {
        base(main, model);
        const { P, ctx, spec } = S;
        main.classList.add('export-main');
        main.style.padding = '0';
        main.style.setProperty('--export-row-height', `${Math.min(56, Math.max(28, (ctx.size.height - 200) / (spec.rows.length + 1)))}px`);
        const head = main.firstElementChild;
        const [title, count, spacer, filter, open] = [...head.children];
        head.className = 'export-head';
        head.removeAttribute('style');
        title.classList.add('export-title');
        count.classList.add('export-subtitle');
        count.textContent = `Manage your newsletter subscribers. ${spec.total.toLocaleString('en-US')} total.`;
        spacer.remove();
        const caption = P.element('div', 'export-caption', head);
        caption.append(title, count);
        const stats = P.element('section', 'subscriber-stats', head);
        for (const [label, value, tone] of [
          ['Total subscribers', '1,248', 'total'], ['Active', '892', 'active'],
          ['Paused', '214', 'paused'], ['Canceled', '142', 'canceled'],
        ]) {
          const stat = P.element('div', `subscriber-stat subscriber-stat-${tone}`, stats);
          P.element('div', 'subscriber-stat-label', stat, label);
          P.element('div', 'subscriber-stat-value', stat, value);
        }
        const card = head.nextElementSibling;
        card.classList.add('export-table-pane');
        card.style.overflow = 'auto';
        for (const cell of card.querySelectorAll('th, td')) cell.classList.add('export-cell');
        for (const cell of card.querySelectorAll('th')) cell.classList.add('export-heading');
        const actions = P.element('div', 'export-actions', main);
        open.classList.add('export-open');
        actions.append(open, filter);
      },
      styles: (base) => () => base() + `
        .sp-win { border:0; box-shadow:none; }
        .export-main { min-height:0; }
        .export-head { flex:none; display:flex; align-items:center; justify-content:space-between; gap:20px; padding:16px 24px 26px; }
        .export-caption { min-width:0; }
        .export-subtitle { display:block; margin-top:8px; }
        .subscriber-stats { flex:0 1 43%; display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; align-items:center; padding:20px 12px; }
        .subscriber-stat { min-width:0; padding:0 14px; text-align:center; }
        .subscriber-stat:first-child { text-align:left; border-left:0; }
        .subscriber-stat-value { margin-top:10px; }
        .export-table-pane { flex:1 1 auto; min-height:0; margin:0 18px; }
        .export-cell { height:var(--export-row-height); padding:8px 18px; }
        .export-actions { flex:none; display:flex; align-items:center; gap:12px; padding:14px 20px 22px; }
        .export-open { height:58px; padding:12px 26px; }
        @media(max-width:1100px) {
          .export-head { padding:12px 18px 18px; gap:12px; }
          .subscriber-stats { padding:14px 6px; }
          .subscriber-stat { padding:0 6px; }
          .export-cell { padding:6px 8px; }
          .export-actions { padding:12px 18px; }
          .export-open { height:46px; }
        }
      `,
    },
  },
});
