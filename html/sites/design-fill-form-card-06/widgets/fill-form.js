// Card profile design with the compact form sizing and dense-list placement used by this site.
(function () {
  'use strict';

  const PERSON_SVG = '<svg viewBox="0 0 60 64"><circle cx="30" cy="22" r="13" fill="rgba(0,0,0,.28)"/>' +
    '<path d="M4 64 C6 44 18 38 30 38 C42 38 54 44 56 64 Z" fill="rgba(0,0,0,.28)"/></svg>';

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-card-06',
    name: 'design',
    split: 'train',
    scenarios: ['card'],
    template: 'fill-form/document',
    design: {
      formTitle: 'Enter Contact Information',
      parts: {
        showList: (base, S) => (dd, btn, list, open) => {
          dd.classList.toggle('open', open);
          if (!open) return;
          dd.classList.remove('up');
          list.style.cssText = '';
          const r = btn.getBoundingClientRect();
          const h = list.offsetHeight;
          const end = env.submitEl ? env.submitEl.getBoundingClientRect() : null;
          const limit = end && r.left < end.right && r.right > end.left
            ? Math.min(window.innerHeight - 6, end.top - 8)
            : window.innerHeight - 6;
          if (r.bottom + 4 + h > limit && r.top - 4 - h > 6) dd.classList.add('up');
          if (r.bottom + 4 + h > limit && r.top - 4 - h <= 6) {
            const available = Math.max(80, limit - 12);
            if (h > available) {
              const options = [...list.children];
              const optionHeight = (available - 12) / options.length;
              for (const option of options) {
                option.style.padding = '2px 6px';
                option.style.fontSize = Math.min(14, optionHeight - 4) + 'px';
                option.style.lineHeight = Math.max(10, optionHeight - 4) + 'px';
              }
            }
            const height = list.offsetHeight;
            list.style.position = 'fixed';
            list.style.left = r.left + 'px';
            list.style.width = r.width + 'px';
            list.style.top = Math.max(6, Math.min(r.bottom + 4, limit - height)) + 'px';
            list.style.bottom = 'auto';
          }
        },
        renderCard: (base, S) => (util, pane, d, rng) => {
          const card = util.el('div', 'ff-card ff-paper', pane);
          const body = util.el('div', 'ff-profilebody', card);
          const photo = util.el('div', 'ff-profilephoto', body);
          photo.innerHTML = PERSON_SVG;
          const content = util.el('div', 'ff-profilecontent', body);
          const heading = util.el('div', 'ff-profileidentity', content);
          util.el('b', '', heading, [d.issuer, d.heading].filter(Boolean).join(' — '));
          util.el('span', '', heading, [d.org, d.subtitle].filter(Boolean).join(' · '));
          const rows = [...d.rows, ...d.extras];
          const grid = util.el('div', 'ff-profilerows' + (rows.length > 4 ? ' dense' : ''), content);
          for (const r of rows) S.P.row(util, grid, r.label + ':', r.value);
          if (rng.bool(0.5)) card.style.borderRadius = '.35em';
          return card;
        },
        fit: () => (ctx, R) => {
          const { root, formPane } = R;
          root.style.fontSize = Math.max(14, Math.min(22, ctx.size.width / 55, ctx.size.height / 34)) + 'px';
          root.style.setProperty('--ff-count', ctx.spec.fields.length);
          root.classList.toggle('many-fields', ctx.spec.fields.length > 5);
          const grid = formPane.querySelector('.ff-grid');
          const footer = ctx.stage.parentElement.querySelector('.ds-footer');
          if (footer && grid.getBoundingClientRect().bottom > footer.getBoundingClientRect().top - 12)
            root.classList.add('compact-fields');
          const first = formPane.querySelector('.ff-input');
          if (first && (!ctx.spec.layout.tabs || (ctx.model.tab || 'form') === 'form')) first.focus({ preventScroll: true });
        },
      },
    },
  });
})();
