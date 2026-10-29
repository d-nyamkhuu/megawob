// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-report-02',
  name: 'design',
  split: 'train',
  scenarios: ['report'],
  template: 'avoid-phishing/classic',
  design: {
    parts: {
      toolbar: (base, S) => (ctx, work) => {
        const toolbar = ctx.util.el('div', 'sp-toolbar', work);
        ctx.util.el('strong', 'sp-mail-title', toolbar, 'Inbox');
        ctx.util.el('span', 'sp-mail-count', toolbar, `${ctx.spec.records.length} messages`);
        return toolbar;
      },
      row: (base, S) => (ctx, x) => {
        const { P, rows } = S;
        const row = P.mark({ row: x.id }, ctx.util.el('div', 'sp-row sp-mail-row', S.els.pane));
        row.setAttribute('role', 'button');
        row.tabIndex = 0;
        ctx.util.el('span', 'sp-mail-check', row).setAttribute('aria-hidden', 'true');
        const palette = ['#687583', '#7540ba', '#e682a7', '#d84040', '#0878d1', '#348a24', '#e9bc21'];
        const initials = x.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
        const avatar = ctx.util.el('span', 'sp-mail-avatar', row, initials);
        avatar.style.background = palette[Math.abs(Number(x.id) || 0) % palette.length];
        const copy = ctx.util.el('div', 'sp-mail-copy', row);
        ctx.util.el('strong', '', copy, x.name);
        ctx.util.el('span', '', copy, x.subject);
        const preview = x.risky ? P.fill(ctx, ctx.spec.pretext.body)
          : `Your ticket ${ctx.spec.reference} has been received. No sign-in, payment or reply is needed.`;
        ctx.util.el('small', '', copy, preview);
        const actions = ctx.util.el('div', 'sp-mail-actions', row);
        P.button(ctx, actions, 'Report', 'report');
        P.button(ctx, actions, 'Keep', 'keep');
        const open = () => P.send(ctx, { open: x.id });
        row.addEventListener('click', open);
        row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        for (const button of actions.children) button.addEventListener('click', (e) => e.stopPropagation());
        rows.set(x.id, row);
        P.rowDecorated(ctx, row, x);
        return row;
      },
    },
  },
});
