// Card design: show the source card as a profile preview and fit dense forms below the modal controls.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-card-03',
  name: 'design',
  split: 'train',
  scenarios: ['card'],
  template: 'fill-form/document',
  design: {
    parts: {
      grid: (base) => (grid, form, pane, spec) => {
        base(grid, form, pane, spec);
        const cells = spec.fields.reduce((n, f) => n + (f.kind === 'radio' || f.kind === 'checkbox' ? 2 : 1), 0);
        pane.classList.toggle('ff-dense', cells > 4);
        pane.classList.toggle('ff-extra-dense', cells > 8);
      },
      renderCard: (base) => (util, pane, d, rng) => {
        const card = base(util, pane, d, rng);
        const title = util.el('div', 'ff-preview-title', card);
        util.el('span', '', title, 'CONTACT PROFILE');
        util.el('span', 'ff-preview-menu', title, '•••');
        card.insertBefore(title, card.firstChild);

        const source = [...card.children].filter((el) => el !== title);
        const body = util.el('div', 'ff-preview-body', card);
        const head = util.el('div', 'ff-chead', body);
        util.el(
          'div',
          'ff-avatar',
          head,
          d.initials ||
            (d.heading || d.issuer || '')
              .split(/\s+/)
              .map((s) => s[0])
              .slice(0, 2)
              .join(''),
        );
        const who = util.el('div', 'ff-preview-who', head);
        util.el('div', 'ff-cname', who, d.heading || d.issuer);
        const context = [d.issuer, d.org, d.subtitle].filter((s, i, a) => s && s !== d.heading && a.indexOf(s) === i);
        if (context.length) util.el('div', 'ff-csub', who, context.join(' · '));
        const table = util.el('div', 'ff-ctable', body);
        const rows = [...d.rows, ...d.extras];
        for (const r of rows) {
          util.el('div', 'ff-doclabel', table, r.label);
          util.el('div', 'ff-v', table, r.value).style.whiteSpace = 'pre-line';
        }
        source.forEach((el) => el.remove());
        card.classList.toggle('ff-preview-dense', rows.length > 5);
        card.classList.toggle('ff-preview-extra-dense', rows.length > 9);
        return card;
      },
      fit: () => (ctx, R) => {
        const { root } = R;
        let fit = 1;
        for (let i = 0; i < 4; i++) {
          const h = root.getBoundingClientRect().height;
          if (h <= ctx.size.height - 1) break;
          fit *= Math.min(1, (ctx.size.height - 2) / h);
          root.style.setProperty('--ff-fit', fit);
        }
        let fs = 21;
        const maxH = ctx.size.height - 62;
        for (; fs >= 8; fs -= 0.5) {
          root.style.fontSize = fs + 'px';
          if (root.offsetHeight <= maxH && root.scrollWidth <= ctx.size.width + 1) break;
        }
        const rr = root.getBoundingClientRect();
        const ratio = Math.min(1, (maxH - 4) / rr.height, (ctx.size.width - 4) / rr.width);
        if (ratio < 0.98) {
          root.style.transformOrigin = 'top left';
          root.style.transform = `scale(${ratio})`;
        }
      },
    },
  },
});
