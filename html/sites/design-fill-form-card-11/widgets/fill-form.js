// Forum card design: compact contact preview with stage-aware menus and form controls.
(function () {
  'use strict';

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-card-11',
    name: 'design',
    split: 'train',
    scenarios: ['card'],
    template: 'fill-form/document',
    design: {
      rootFont: '19px',
      modalControls: false,
      fitReserve: 12,
      parts: {
        rootReady: (base, S) => (ctx, R) => {
          base(ctx, R);
          R.root.style.setProperty('--ff-stage-h', ctx.size.height + 'px');
          R.root.style.setProperty('--ff-field-count', S.spec.fields.length);
        },
        showList: (base, S) => (dd, btn, list, open) => {
          dd.classList.toggle('open', open);
          if (!open) return;
          dd.classList.remove('up');
          const r = btn.getBoundingClientRect();
          const stage = S.ctx.stage.getBoundingClientRect();
          const top = Math.max(6, stage.top + 4);
          const bottom = Math.min(window.innerHeight - 6, stage.bottom - 4);
          const end = env.submitEl ? env.submitEl.getBoundingClientRect() : null;
          const limit = end && end.top > r.bottom && r.left < end.right && r.right > end.left
            ? Math.min(bottom, end.top - 8)
            : bottom;
          const above = Math.max(0, r.top - top - 4);
          const below = Math.max(0, limit - r.bottom - 4);
          list.style.fontSize = '';
          let h = list.getBoundingClientRect().height;
          const room = Math.max(above, below);
          for (let pass = 0; pass < 3 && h > room && room > 0; pass++) {
            const fs = parseFloat(getComputedStyle(list).fontSize);
            list.style.fontSize = fs * Math.max(0.1, (room - 10) / h) + 'px';
            h = list.getBoundingClientRect().height;
          }
          if (h > below && above >= below) dd.classList.add('up');
        },
        heading: (base, S) => (util, pane, form) => {
          util.el('h2', '', form, 'Enter Contact Information');
          form.setAttribute('aria-label', S.spec.formTitle);
        },
        formEnd: (base, S) => (form, grid, pane, spec) => {
          base(form, grid, pane, spec);
          const end = document.querySelector('.ds-submit');
          if (end && !spec.layout.tabs) {
            const actions = S.ctx.util.el('div', 'ff-actions', form);
            actions.append(end);
          }
        },
        renderCard: (base, S) => (util, pane, d, rng) => {
          const card = util.el('div', 'ff-card ff-paper', pane);
          const title = util.el('div', 'ff-source-title', card, 'Contact Profile (read-only)');
          util.el('small', '', title, [d.issuer, d.org].filter(Boolean).join(' · '));
          const table = util.el('div', 'ff-source-table', card);
          const rows = [
            ...(d.heading ? [{ label: 'Name:', value: d.heading }] : []),
            ...(d.subtitle ? [{ label: 'Position:', value: d.subtitle }] : []),
            ...d.rows,
            ...d.extras,
          ];
          card.style.setProperty('--ff-source-rows', rows.length > 5 ? Math.ceil(rows.length / 2) : rows.length);
          table.classList.toggle('dense', rows.length > 5);
          for (const r of rows) S.P.row(util, table, r.label, r.value, 'ff-source-row');
          if (rng.bool(0.5)) card.style.borderRadius = '.35em';
          return card;
        },
        scaled: (base, S) => (ctx, R, ratio) => {
          base(ctx, R, ratio);
          R.root.style.setProperty('width', 100 / ratio + '%', 'important');
        },
      },
    },
  });
})();
