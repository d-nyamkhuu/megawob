// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const icons = {
    Home: '<path d="M3 11 12 3l9 8M6 9v12h5v-7h3v7h5V9"/>',
    Flights: '<path d="m12 2 1 8 8 5v2l-8-2v5l3 2h-8l3-2v-5l-8 2v-2 0l8-5z" fill="currentColor" stroke-width="1"/>',
    Hotels: '<path d="M3 4v17M3 17h19v4M3 15h19v-5h-10v5M7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>',
    'Car Hire': '<path d="m4 11 2-7h12l2 7M3 11h18v8H3zM5 19v3M19 19v3M6 14h2M16 14h2"/>',
    'My Trips': '<path d="M3 7h18v15H3zM8 7V4h8v3M10 7h4"/>',
    'Special Offers': '<path d="M2 14 13 3h8v8L10 22z"/><circle cx="17" cy="7" r="1"/>',
    'Travel Guides': '<path d="M12 5c-3-3-7-3-10-2v17c3-1 7-1 10 2 3-3 7-3 10-2V3c-3-1-7-1-10 2Zm0 0v17"/>',
    list: '<path d="M8 4h14M8 12h14M8 20h14M2 4h1M2 12h1M2 20h1"/>',
  };
  const drawIcon = (node, name) => {
    node.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="square" aria-hidden="true">${icons[name]}</svg>`;
  };

  const parts = {
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'promo') {
        const box = result.el.querySelector('.ref-ov-box');
        const title = ctx.util.el('div', 'air-promo-title', box, '✉  Stay in the loop');
        box.prepend(title);
        const close = ctx.util.el('button', 'air-promo-close', title, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => result.dismiss.click());
        const art = ctx.util.el('div', 'air-promo-art', box);
        art.innerHTML = '<svg viewBox="0 0 110 140" aria-hidden="true"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#5a79ad"/><stop offset=".48" stop-color="#dba5a8"/><stop offset=".59" stop-color="#f8dbac"/><stop offset="1" stop-color="#6b7b91"/></linearGradient></defs><path d="M0 0h110v140H0z" fill="url(#sky)"/><path d="m0 115 29-12 15 7 36-28 30 8v50H0" fill="#56718c"/><path d="m30 91 78-43-12 37-48 20z" fill="#293e55"/><path d="m48 104 48-18 7 5-42 23z" fill="#abb8c0"/></svg>';
        const heading = ctx.util.el('strong', 'air-promo-heading', box, 'Great deals & inspiration');
        box.insertBefore(heading, box.querySelector('.ref-ov-text'));
      }
      return result;
    },
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
      // The reference design has a fixed parchment-and-olive palette across episodes.
      for (const [k, v] of Object.entries({ bg:'#fbfaf7', panel:'#fffefa', fg:'#171713', muted:'#655f55', line:'#e2ddd3', accent:'#29372a' })) root.style.setProperty(`--${k}`, v);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('air-header');
      const airbrand = util.el('div', 'air-brand', header);
      const brandIcon = util.el('span', 'air-brand-icon', airbrand);
      brandIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m22 1-4 2-5 5L3 6 1 8l9 4-5 5H2l-1 2 4 1 1 4 2-1v-3l5-5 4 9 2-2-2-10 5-5z"/></svg>';
      util.el('span', '', airbrand, 'SkyWays Travel - Flights');
      const windowTools = util.el('div', 'air-window-tools', airbrand);
      for (const [name, shape] of [['Minimize','min'],['Maximize','max'],['Close','close']]) {
        const control = util.el('button', `air-window-control ${shape}`, windowTools);
        control.type = 'button'; control.title = name; control.setAttribute('aria-label', name);
      }
      const airtabs = util.el('nav', 'air-tabs', header);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Tools', 'Help']) {
        const a = util.el('a', 'air-tab', airtabs, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { airbrand, airtabs, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.classList.add('air-body');
      const rail = util.el('aside', 'air-rail', body);
      for (const [icon, item] of [['⌂','Home'],['✈','Flights'],['▰','Hotels'],['▣','Car Hire'],['▱','My Trips'],['◇','Special Offers'],['▤','Travel Guides']]) {
        if (item === 'Special Offers') util.el('div', 'air-rail-rule', rail);
        const link = util.el('a', `air-rail-link${item === 'Flights' ? ' selected' : ''}`, rail);
        drawIcon(util.el('span', 'air-rail-icon', link), item);
        util.el('span', '', link, item);
        link.href = '#';
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const inspector = util.el('aside', 'air-inspector', body);
      const recordsTitle = util.el('h2', '', inspector);
      drawIcon(util.el('span', 'air-list-icon', recordsTitle), 'list');
      util.el('span', '', recordsTitle, 'Other flights');
      const section = (title, rows) => {
        const box = util.el('section', 'air-section', inspector);
        util.el('h3', '', box, title);
        for (const [k, v] of rows) {
          const row = util.el('div', 'air-detail', box);
          util.el('span', '', row, k); util.el('span', '', row, v);
        }
      };
      const records = util.el('div', 'air-records', inspector);
      const recordHeads = util.el('div', 'air-record-heads', records);
      ['Date','Route','Fare from'].forEach((label) => util.el('strong', '', recordHeads, label));
      const fares = ['£81.99','£84.99','£84.99','£89.99','£89.99','£91.99','£91.99','£94.99','£94.99','£99.99','£99.99','£101.99','£101.99','£104.99','£104.99','£108.99','£108.99'];
      fares.forEach((fare, i) => {
        const date = `${['Tue','Wed','Thu','Fri','Sat','Sun','Mon'][i % 7]} ${14 + i} May`;
        const row = util.el('div', `air-record${i === 0 ? ' active' : ''}`, records);
        util.el('span', '', row, date); util.el('span', '', row, 'DEB → YYZ'); util.el('span', '', row, fare);
      });
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, inspector, section });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.classList.add('air-results');
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-bait-05',
    template: 'site/base',
    design: { parts },
  });
})();
