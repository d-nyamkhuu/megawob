// This card design uses a blue source card and fits its dense source text before the page fit.
(function () {
  'use strict';

  const PERSON_SVG = '<svg viewBox="0 0 60 64"><circle cx="30" cy="22" r="13" fill="rgba(0,0,0,.28)"/>' +
    '<path d="M4 64 C6 44 18 38 30 38 C42 38 54 44 56 64 Z" fill="rgba(0,0,0,.28)"/></svg>';

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-card-12',
    name: 'design',
    split: 'train',
    scenarios: ['card'],
    traits: { fieldset: { card: { keys: ['firstName', 'lastName', 'email'], blank: ['phone'] } } },
    template: 'fill-form/document',
    design: {
      parts: {
        formStart: (base) => (form, pane, spec) => {
          base(form, pane, spec);
          pane.style.setProperty('--field-count', spec.fields.length);
        },
        renderCard: (base, S) => (util, pane, d, rng) => {
          const card = util.el('div', 'ff-card ff-paper', pane);
          card.classList.add('ff-bluecard');
          const photo = util.el('div', 'ff-bluephoto', card);
          photo.innerHTML = PERSON_SVG;
          const main = util.el('div', 'ff-bluerows', card);
          if (d.heading) S.P.row(util, main, 'Name:', d.heading);
          if (d.subtitle) S.P.row(util, main, 'Organization:', d.subtitle);
          for (const r of d.rows) S.P.row(util, main, r.label.replace(/:$/, '') + ':', r.value);
          const meta = util.el('div', 'ff-bluemeta', card);
          S.P.row(util, meta, 'Type:', d.issuer);
          if (d.org) S.P.row(util, meta, 'Organization:', d.org);
          for (const r of d.extras) S.P.row(util, meta, r.label, r.value);
          card.style.setProperty('--doc-lines', Math.max(3, main.children.length));
          if (rng.bool(0.5)) card.style.borderRadius = '.35em';
          return card;
        },
        showTab: (base) => (ctx, R) => {
          base(ctx, R);
          const sourceRows = R.docPane.querySelector('.ff-bluerows');
          if (sourceRows) {
            for (let size = 20; size >= 9; size -= 0.5) {
              sourceRows.style.setProperty('font-size', size + 'px', 'important');
              if (sourceRows.scrollHeight <= sourceRows.clientHeight + 1) break;
            }
          }
        },
      },
    },
  });
})();
