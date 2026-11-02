// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // The reference uses a single bright iPadOS palette; keep the original theme draws above
      // so the seeded frame sequence remains stable, but render the map app in that palette.
      root.dataset.theme = 'light';
      for (const [k, v] of Object.entries({ bg:'#e5effb', panel:'#fafcff', fg:'#0b173f', muted:'#75819a', line:'#d3dfef' }))
        root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#087bff');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.nav': (base, S) => function (_c) {
      const { W, content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav || W >= 0) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const [i, item] of ['Map', 'Places', 'Routes', 'Areas'].entries()) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.classList.toggle('is-active', i === 0);
          const icons = [
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.2 8 4l8 2.8L21 4v14l-5 2.2L8 17.4 3 20zM8 4v13.4m8-10.6v13.4"/></svg>',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V7h7v13M11 20V4h9v16M2 20h20M7 10h1m-1 3h1m-1 3h1m7-9h2m-2 3h2m-2 3h2m-2 3h2"/></svg>',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="7" r="2.5"/><path d="m8 16 8-7"/></svg>',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z" stroke-dasharray="3 2"/></svg>'
          ];
          a.insertAdjacentHTML('afterbegin', icons[i]);
          a.setAttribute('aria-label', item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const legend = util.el('aside', 'ref-legend', body);
      util.el('strong', '', legend, 'Map Legend');
      for (const [icon, label, cls] of [
        ['●','Saved Pin','pin'],['●','Place','place'],['♣','Park / Green Space','park'],['●','Water','water'],
        ['━','Major Road','major'],['━','Street','street'],['┄','Transit Route','transit'],['▣','Transit Station','station'],
        ['✚','Hospital','hospital'],['◆','School','school'],['▤','Museum','museum'],['▣','Shopping','shopping'],['♜','Restaurant','restaurant'],['▰','Hotel','hotel']
      ]) {
        const row = util.el('div', `ref-legend-row ${cls}`, legend);
        util.el('span', 'ref-legend-icon', row, icon);
        util.el('span', '', row, label);
      }
      Object.assign(_c, { legend, stage });
    },
  };

  env.site({
    name: 'design-pan-map-pin-04',
    template: 'site/base',
    design: { parts },
  });
})();
