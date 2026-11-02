// Design on templates/use-email/base.js: the base site's use-email widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-email',
  site: 'design-use-email-archive-03',
  name: 'design',
  split: 'train',
  scenarios: ['archive'],
  template: 'use-email/base',
  design: {
    parts: {
      'mailTopActions': (base, S) => function mailTopActions(ctx, nodes) {
        const { util, spec } = ctx;
        const { I, env } = S;
        const fam = env.taskDef;
        const { topEl, newBtn, on, button, reg } = nodes;
        const amigaActions = util.el('div', 'am-actions', topEl);
        amigaActions.append(newBtn);
        const actionTarget = () => {
          const m = ctx.model;
          const i = m.open !== null && m.open !== undefined ? m.open : m.checked[0];
          return i !== undefined && i !== null ? i : fam.helpers.listOrder(m, spec)[0];
        };
        on(button('am-tb', I.reply, 'Reply', amigaActions), () => {
          const i = actionTarget();
          return i === undefined ? {} : { reply: i };
        });
        on(button('am-tb', I.forward, 'Forward', amigaActions), () => {
          const i = actionTarget();
          return i === undefined ? {} : { forward: i };
        });
        const move = (box) => {
          const m = ctx.model;
          const selected = m.checked.length ? m.checked : m.open !== null && m.open !== undefined ? [m.open] : [];
          return { move: [selected, box] };
        };
        const archive = on(button('am-tb', I.archive, 'Archive', amigaActions), () => move('archive'));
        reg.fixed.set('a:archive', archive);
        const remove = on(button('am-tb del', I.trash, 'Delete', amigaActions), () => move('trash'));
        reg.fixed.set('a:delete', remove);
        const restore = on(button('am-tb recovery', I.restore, 'Restore', amigaActions), () => move('inbox'));
        reg.fixed.set('a:inbox', restore);
        return { restore };

      },
      'mailGeometry': (base) => (ctx, ads) => ({ ...base(ctx, ads), stack: false }),
      'mailPaintTop': () => (ctx, state, m) => {
        state.restore.hidden = m.open === null || m.open === undefined || m.box[m.open] === 'inbox';
      },
      'mailSidebar': () => (ctx, side) => {
        const pane = ctx.util.el('div', 'archive-folders', null);
        pane.append(...side.children);
        side.append(pane);
      },
      'mailSized': () => (ctx, listbox) => { if (listbox) listbox.refresh(); },
      'mailListHeading': (base, S) => function mailListHeading(ctx, lb) {
        const { util } = ctx;
        // The table sits below the search/toolbar/column headings: fit every declared visible row there.
        const available = lb.parentElement.clientHeight - 44 - 168;
        ctx.stage.style.setProperty('--archive-row-height', Math.max(20, Math.min(41, Math.floor(available / ctx.spec.rows))) + 'px');
        const columns = util.el('div', 'am-columns', lb);
        util.el('span', 'check-col', columns, '☐');
        util.el('span', 'from-col', columns, 'From  ▾');
        util.el('span', 'subject-col', columns, 'Subject');
        util.el('span', 'date-col', columns, 'Date  ▲');
        util.el('span', 'size-col', columns, 'Size');

      },
      'mailTime': () => (email) => (email.date && email.date.line) || email.time,
    },
  },
});
