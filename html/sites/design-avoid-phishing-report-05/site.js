// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const icon = (kind) => {
    const paths = {
      mail: '<rect x="3" y="5" width="26" height="21" rx="1"/><path d="m4 6 12 10L28 6"/>',
      calendar: '<rect x="4" y="6" width="24" height="23" rx="1"/><path d="M4 12h24M10 2v8M22 2v8M10 17h2m6 0h2m-10 5h2m6 0h2"/>',
      document: '<path d="M7 3h12l7 7v20H7zM19 3v8h7M11 16h11m-11 5h11m-11 5h11"/>',
      chat: '<path d="M4 4h25v20H13l-8 7v-7H4z"/>',
      laptop: '<rect x="5" y="4" width="23" height="21" rx="1"/><path d="M5 25 1 30h31l-4-5M13 28h7"/>',
      payment: '<rect x="3" y="5" width="27" height="23" rx="1"/><path d="M6 11h21M7 21h10"/>',
      people: '<circle cx="16" cy="10" r="5"/><path d="M7 28v-5c0-9 18-9 18 0v5zM5 7a4 4 0 0 0 0 8M28 7a4 4 0 0 1 0 8M2 27v-5q0-5 4-5m24 10v-5q0-5-4-5"/>',
      settings: '<path d="m13 2 6 0 1 5 4 2 5-1 3 5-4 4v4l3 4-3 5-5-2-4 2-1 4h-6l-1-5-4-2-5 1-3-5 4-4v-4L0 11l3-5 5 2 4-2z"/><circle cx="16" cy="18" r="5"/>',
    };
    return `<svg viewBox="0 0 34 34" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">${paths[kind] || paths.document}</svg>`;
  };
  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
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
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        // Keep the notebook palette stable across episode frame scenarios.
        root.style.setProperty('--bg', '#e7f3ea');
        root.style.setProperty('--panel', '#ffffff');
        root.style.setProperty('--fg', '#17212e');
        root.style.setProperty('--muted', '#425650');
        root.style.setProperty('--line', '#bbcdc7');
        root.style.setProperty('--accent', '#0865d9');
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'CONTOSO');
        const building = util.el('span', 'brand-building', brand);
        building.innerHTML = '<svg viewBox="0 0 40 44" aria-hidden="true"><path fill="currentColor" d="M1 7 11 5v37H1zm12-6h13v41H13zm15 5 11 4v32H28z"/><path fill="#174438" d="M4 11h4v4H4zm0 9h4v4H4zm0 9h4v4H4zm12-23h6v5h-6zm0 10h6v5h-6zm0 10h6v5h-6zm1 10h5v6h-5zm14-23h4v5h-4zm0 10h4v5h-4zm0 10h4v5h-4z"/></svg>';
        brand.dataset.role = 'brand';
        util.el('span', 'ref-brand-sub', header, 'Workplace');
        const summary = util.el('div', 'sp-summary', header);
        summary.innerHTML = [
          ['Offline Access','laptop','<i class="online-dot"></i>Available offline','Last sync: Today 9:14 AM'],
          ['Email','mail','Contoso Mail','jwright@contoso.com<br>12 unread'],
          ['Documents','document','Online library','Synced 3 mins ago'],
          ['Calendar','calendar','Tue, Apr 30, 2024','3 events today'],
          ['Chat','chat','Teams (Contoso)','<i class="online-dot"></i>Online'],
          ['Accounts Payable','payment','5 invoices pending','Next due: May 3, 2024'],
        ].map(([title, symbol, line, sub]) => `<div><b>${title}</b><div class="summary-info">${icon(symbol)}<div><span>${line}</span><small>${sub}</small></div></div></div>`).join('');
        Object.assign(_c, { brand, header, title });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const tips = util.el('aside', 'ref-tips', body);
        const nav = util.el('nav', 'sp-nav', tips);
        nav.innerHTML = [['Mail','mail'],['Calendar','calendar'],['Contacts','people'],['Documents','document'],['Accounts Payable','document'],['Chat','chat'],['Offline Access','laptop'],['Settings','settings']].map(([label, symbol], i) => `<div${i === 0 ? ' class="active"' : ''}>${icon(symbol)}<span>${label}</span></div>`).join('');
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, tips });
      },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'promo') {
        const box = result.el.querySelector('.ref-ov-box');
        result.el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
        const heading = ctx.util.el('h2', 'notebook-promo-title', box, 'Contoso Workplace');
        box.prepend(heading);
        const art = ctx.util.el('div', 'notebook-promo-art', box);
        art.innerHTML = '<svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="76" fill="#e4f1e9"/><path fill="#27644f" d="m32 77 48-38 48 38v58H32z"/><rect x="49" y="45" width="64" height="68" rx="3" fill="#fff"/><path stroke="#28644f" stroke-width="5" d="M61 62h22m-22 14h39M61 89h39"/><path fill="#164b3a" d="m32 77 48 37 48-37v58H32z"/><path fill="#23634b" d="m32 135 48-40 48 40z"/></svg>';
        const close = ctx.util.el('button', 'notebook-promo-close', box, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Close');
        close.addEventListener('click', () => ctx.dismiss('close'));
      }
      return result;
    },
  };

  env.site({
    name: 'design-avoid-phishing-report-05',
    template: 'site/base',
    design: { parts },
  });
})();
