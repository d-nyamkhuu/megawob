// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-search-05',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  template: 'act-in-time/base',
  design: { parts: {
    frame: (base, S) => function (ctx) { return base(ctx); },
    buildSearch: (base, S) => function (ctx, f) {
      const v = base(ctx, f);
      const col = f.body.querySelector('.ut-col');
      const row = f.body.querySelector('.ut-searchrow');
      const inp = f.body.querySelector('.ut-sinput');
      const head = f.body.querySelector('.ut-reshead');
      if (col) { col.style.width='100%'; col.style.left='0px'; }
      if (inp) inp.placeholder = '';
      if (row) {
        const b = ctx.util.el('button', 'catalog-search', row, 'Search');
        b.type = 'button';
        b.addEventListener('click', () => { if (inp) inp.blur(); });
      }
      if (head && head.lastElementChild) head.lastElementChild.textContent = 'View all';
      const oldSync = v.sync;
      v.sync = function (m) {
        oldSync(m);
        const caption = f.body.querySelector('.ut-reshead span:first-child');
        if (caption && caption.textContent === 'Popular products') caption.textContent = 'Popular Products';
        f.body.querySelectorAll('.ut-row2').forEach((r, i) => {
          r.style.height = '76px';
          const thumb = r.querySelector('.ut-thumb');
          if (thumb && !thumb.querySelector('svg')) {
            thumb.style.background = '#e9edf1';
            const art = ['<path d="M18 46V30a22 22 0 0 1 44 0v16M18 45c0 20 12 28 20 15V43c-8-13-20-10-20 2m44 0c0 20-12 28-20 15V43c8-13 20-10 20 2"/>','<path d="M7 49 65 27l8 14L15 63zM10 47 67 25l5 9-57 22z"/>','<path d="M30 8h20v6h-2v7h-1v46H33V21h-1v-7h-2z"/>','<path d="M21 18 60 9l14 53-40 9zM18 20l14 52"/>','<path d="M40 61V40M40 44c-17-2-21-16-12-21 8 0 12 9 12 17m0-1c3-19 17-23 24-17 0 11-9 17-24 17M24 61h32l-4 11H28z"/>'];
            thumb.innerHTML = `<svg viewBox="0 0 80 80" aria-hidden="true" fill="none" stroke="#39454f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${art[i % art.length]}</svg>`;
          }
          if (!r.querySelector('.catalog-view')) {
            const b = ctx.util.el('button', 'catalog-view', r, 'View');
            b.type='button';
          }
        });
      };
      const oldLocate = v.locate;
      v.locate = function (target) {
        if (target.result !== undefined) {
          const ids = env.taskDef.helpers.searchList(ctx.spec, ctx.model.settled);
          const row = f.body.querySelectorAll('.ut-row2')[ids.indexOf(target.result)];
          if (row) row.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        }
        return oldLocate(target);
      };
      return v;
    },
  } },
});
