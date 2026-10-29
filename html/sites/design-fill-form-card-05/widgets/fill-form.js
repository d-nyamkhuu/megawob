// Card design: render the source as a profile table and keep the card site's footer and fit behavior.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-card-05',
  name: 'design',
  split: 'train',
  scenarios: ['card'],
  template: 'fill-form/document',
  design: {
    formTitle: 'Contact Form',
    parts: {
      renderCard: (base) => (util, pane, d, rng) => {
        if (d.kind !== 'card') return base(util, pane, d, rng);
        const card = util.el('div', 'ff-card ff-paper ff-profile', pane);
        const head = util.el('div', 'ff-phead', card);
        util.el('b', '', head, 'Profile');
        const table = util.el('table', 'ff-ptable', card);
        const rows = [];
        if (d.heading) rows.push({ label: 'Name:', value: d.heading });
        if (d.subtitle) rows.push({ label: 'Company:', value: d.subtitle });
        if (d.style === 'id') rows.push({ label: 'Issuer:', value: d.issuer }, { label: 'Organization:', value: d.org });
        rows.push(...d.rows, ...d.extras);
        for (const r of rows) {
          const tr = util.el('tr', '', table);
          util.el('td', '', tr, r.label);
          util.el('td', '', tr, r.value);
        }
        if (rng.bool(0.5)) card.style.borderRadius = '.35em';
        return card;
      },
      rootReady: (base) => (ctx, R) => {
        base(ctx, R);
        R.root.dataset.density = ctx.spec.fields.length > 6 ? 'dense' : 'regular';
      },
      formEnd: (base) => (form, grid, pane, spec) => {
        base(form, grid, pane, spec);
        const actions = document.querySelector('.ds-footer');
        if (actions) {
          if (spec.layout.tabs && actions.querySelector('[data-role="submit"]')) {
            actions.classList.add('ds-tab-footer');
            document.querySelector('.ds-title').append(actions);
          } else form.append(actions);
        }
      },
      fit: () => (ctx, R) => {
        const { root, docPane, formPane, form } = R;
        let fs = Math.min(21, ctx.size.width / 57);
        const maxH = root.clientHeight;
        for (; fs >= 8; fs -= 0.5) {
          root.style.fontSize = fs + 'px';
          if (
            form.scrollHeight <= maxH + 1 &&
            docPane.firstElementChild.scrollHeight <= maxH + 1 &&
            root.scrollWidth <= ctx.size.width + 1
          ) break;
        }
      },
    },
  },
});
