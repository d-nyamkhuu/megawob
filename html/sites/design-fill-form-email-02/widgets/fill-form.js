// Email document styling and compact form behavior with a viewport-safe dropdown menu.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-email-02',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'fill-form/document',
  design: {
    parts: {
      showList: (base, S) => (dd, btn, list, open) => {
        dd.classList.toggle('open', open);
        if (!open) return;
        dd.classList.remove('up');
        list.style.top = '';
        list.style.bottom = '';
        list.style.fontSize = '';
        const r = btn.getBoundingClientRect();
        let h = list.offsetHeight;
        const end = env.submitEl ? env.submitEl.getBoundingClientRect() : null;
        const limit = end && end.top > r.bottom && r.left < end.right && r.right > end.left
          ? Math.min(window.innerHeight - 6, end.top - 8)
          : window.innerHeight - 6;
        if (r.bottom + 4 + h > limit) {
          if (r.top - 4 - h > 6) dd.classList.add('up');
          else {
            let fs = parseFloat(getComputedStyle(list).fontSize);
            while (h > limit - 12 && fs > 12) {
              fs -= 1;
              list.style.fontSize = fs + 'px';
              h = list.offsetHeight;
            }
            const top = Math.max(6, limit - h);
            list.style.top = top - dd.getBoundingClientRect().top + 'px';
            list.style.bottom = 'auto';
          }
        }
      },
      beforeForm: (base) => (ctx, R) => {
        ctx.util.el('div', 'ff-panehead', R.formPane, 'Enter the Information');
      },
      grid: (base, S) => (grid, form, pane, spec) => {
        base(grid, form, pane, spec);
        S.st.root.classList.toggle('ff-dense', spec.fields.length > 5);
        S.st.root.classList.toggle('ff-many', spec.fields.length > 8);
        if (spec.layout.tabs && spec.fields.length > 5) {
          grid.style.setProperty('grid-template-columns', '1fr 1fr', 'important');
        }
      },
      renderEmail: (base) => (util, pane, d, rng) => {
        if (d.style !== 'plain') {
          rng.pick([
            ['Reply', 'Forward', 'Archive'],
            ['Reply all', 'Forward', 'Delete'],
            ['Inbox', 'Reply', 'Mark unread'],
          ]);
        }
        const heading = util.el('div', 'ff-panehead', pane);
        util.el('b', '', heading, 'Email');
        util.el('span', 'ff-date', heading, d.date);
        const box = util.el('div', 'ff-mail ff-document', pane);
        const meta = util.el('div', 'ff-mailmeta', box);
        for (const [label, value] of [
          ['From:', `${d.from.name} <${d.from.addr}>`],
          ['To:', d.to],
          ['Subject:', d.subject],
        ]) {
          const line = util.el('div', 'ff-metaline', meta);
          util.el('b', '', line, label);
          util.el('span', '', line, value);
        }
        const body = util.el('div', 'ff-mailbody', box);
        util.el('p', '', body, d.greeting);
        for (const p of d.paragraphs) util.el('p', '', body, p);
        util.el('p', 'sig', body, d.signature.join('\n'));
        return box;
      },
      finished: (base) => (ctx, R) => {
        const frame = ctx.stage.closest('.ds-frame');
        if (frame && frame.protectEnd) frame.protectEnd();
      },
      syncField: (base) => (id, x, model) => {
        base(id, x, model);
        if (x.sync) x.sync();
      },
    },
  },
});
