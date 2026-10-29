// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        if (kind === 'banner') document.querySelector('.ref-body').before(el);
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
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
        root.dataset.theme = name;
        // This design is a fixed monochrome desktop application. Keep the legacy draws above
        // so seeded task/frame streams remain stable, then apply its own window palette.
        for (const [k, v] of Object.entries({
          bg: '#f4f4f2',
          panel: '#fbfbfa',
          fg: '#111315',
          muted: '#55585a',
          line: '#bfc1c2',
        }))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', '#55585a');
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const windowBar = util.el('div', 'ref-windowbar', document.body);
        const apple = util.el('span', 'ref-window-apple', windowBar);
        apple.innerHTML =
          '<svg viewBox="0 0 22 25" width="21" height="24" aria-hidden="true"><path fill="currentColor" d="M14 1c.2 3-1.5 5-4 5-.4-2.5 1.9-4.6 4-5ZM11 7C6 4 2 8 2 12c0 5 3.5 11 6 11 1.4 0 2.1-1 3.4-1 1.4 0 2 1 3.6 1 2.3 0 5-4.3 5.5-6.2-5-2-4.8-7.3-1-9.1C17.5 5.8 14.4 5.4 11 7Z"/></svg>';
        util.el('strong', 'ref-window-appname', windowBar, 'MediChart EHR');
        const status = util.el('span', 'ref-window-status', windowBar);
        for (const shape of [
          '<rect x="2" y="6" width="22" height="12" rx="3" fill="none" stroke-width="2"/><path d="M5 9h16v6H5zM25 10v4"/>',
          '<path d="M2 8Q14-2 26 8M6 12q8-7 16 0M10 16q4-4 8 0" fill="none" stroke-width="2.4"/><circle cx="14" cy="20" r="1.6"/>',
          '<path d="M3 19v-4h3v4zm6 0v-7h3v7zm6 0V8h3v11zm6 0V4h3v15z"/>',
          '<circle cx="14" cy="12" r="8" fill="none" stroke-width="1.7"/><path d="M14 6v7h5" fill="none" stroke-width="1.7"/>',
        ]) {
          const icon = util.el('span', 'ref-status-icon', status);
          icon.innerHTML = `<svg viewBox="0 0 28 24" width="25" height="23" fill="currentColor" stroke="currentColor" aria-hidden="true">${shape}</svg>`;
        }
        util.el('span', 'ref-window-meta', windowBar, 'Mon Apr 22   10:24 AM');
        Object.assign(_c, {
          apple,
          collide,
          cr,
          decoys,
          label,
          nav,
          placement,
          sidebar,
          status,
          wantFooter,
          windowBar,
        });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, rng, status, util, windowBar } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) rng.pick(TITLES); // preserve the legacy frame draw
        const brand = util.el('div', 'ref-brand', header, 'MediChart EHR');
        brand.dataset.role = 'brand';
        {
          const n = util.el('nav', 'ref-nav', windowBar);
          windowBar.insertBefore(n, status);
          if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5)); // preserve legacy conditional draws
          for (const item of [
            'File',
            'Edit',
            'View',
            'Patient',
            'Orders',
            'Results',
            'Chart',
            'Tools',
            'Window',
            'Help',
          ]) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const titleStrip = util.el('div', 'ref-title-strip', header);
        for (const color of ['red', 'yellow', 'green']) util.el('span', `ref-traffic-light ${color}`, titleStrip);
        const toolbar = util.el('div', 'ref-app-toolbar', header);
        for (const [icon, label] of [
          ['person', 'Patients'],
          ['calendar', 'Schedule'],
          ['chart', 'Chart'],
          ['orders', 'Orders'],
          ['results', 'Results'],
          ['meds', 'Medications'],
          ['flow', 'Flowsheets'],
          ['bed', 'Bed Board'],
          ['print', 'Print'],
        ]) {
          const b = util.el('button', 'ref-app-tool', toolbar);
          if (label === 'Orders') b.classList.add('selected');
          b.type = 'button';
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 28 28');
          svg.setAttribute('class', 'ref-app-icon');
          svg.setAttribute('aria-hidden', 'true');
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('fill', 'url(#aqua-icon)');
          g.setAttribute('stroke', '#15538e');
          g.setAttribute('stroke-width', '1');
          const shapes = {
            person: '<circle cx="14" cy="8" r="5"/><path d="M4 25v-4c0-5 4-8 10-8s10 3 10 8v4z"/>',
            calendar:
              '<rect x="4" y="5" width="20" height="20" rx="2" fill="#f7fbff"/><path d="M4 10h20M9 2v6M19 2v6M8 14h3m4 0h3m-10 4h3m4 0h3m-10 4h3" fill="none" stroke-width="1.6"/><path d="m15 21 2 2 4-5" fill="none"/>',
            chart:
              '<rect x="4" y="3" width="18" height="23" rx="2" fill="#f3faff"/><path d="m10 18 2-5L22 3l3 3-10 10z" stroke-width="1.3"/><path d="m12 13 3 3m4-10 3 3M8 21h5" fill="none" stroke-width="1.5"/>',
            orders:
              '<path d="M6 2h12l6 6v18H6z" fill="#1684ed"/><path d="M18 2v7h6" fill="#c7eaff"/><path d="M10 15h10M10 19h8" fill="none" stroke="#fff" stroke-width="1.5"/>',
            results:
              '<path d="M6 3h17v23H6z" fill="#fff"/><path d="M9 23v-8h3v8z" fill="#1996dc"/><path d="M14 23V7h3v16z" fill="#e65942"/><path d="M19 23V11h2v12z" fill="#55a344"/>',
            meds: '<path d="M10 8V5c0-4 9-4 9 0v3" fill="none" stroke-width="1.8"/><rect x="3" y="9" width="23" height="16" rx="4"/><path d="M3 15h23M11 9v16m8-16v16" fill="none" stroke="#d5edff" stroke-width="1.3"/>',
            flow: '<rect x="4" y="3" width="21" height="23" rx="1" fill="#fff"/><path d="M8 9h2m2 0h6M8 14h2m2 0h6M8 19h2m2 0h8" fill="none"/><path d="m18 12 6-9 2 2-7 8-2 1z" fill="#ed864a"/>',
            bed: '<path d="M4 7v15m0-5h20v5m-20-9h8v4H4zm8 0h12v5H12z" fill="none" stroke-width="2"/><path d="M5 6h5v3H5z"/>',
            print:
              '<path d="M8 4h12v6H8zM6 18H4v-8h20v8h-2"/><path d="M8 15h12v9H8zM18 12h3" fill="none" stroke="#fff" stroke-width="2"/>',
          };
          const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
          defs.innerHTML =
            '<linearGradient id="aqua-icon" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".45" stop-color="#83c8ff"/><stop offset="1" stop-color="#1674d0"/></linearGradient>';
          svg.appendChild(defs);
          g.innerHTML = shapes[icon];
          svg.appendChild(g);
          b.appendChild(svg);
          util.el('span', '', b, label);
          b.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label }));
        }
        const search = util.el('label', 'ref-app-search', toolbar);
        util.el('span', '', search, '⌕');
        const searchField = util.el('input', '', search);
        searchField.type = 'text';
        searchField.placeholder = 'Patient Search';
        searchField.setAttribute('aria-label', 'Patient Search');
        const patient = util.el('section', 'ref-patient-banner', header);
        util.el('div', 'ref-patient-avatar', patient, '');
        const identity = util.el('div', 'ref-patient-identity', patient);
        util.el('strong', '', identity, 'Melnyk, Tatiana');
        util.el('span', '', identity, 'DOB: 1965-08-15');
        util.el('span', '', identity, 'Age: 58');
        util.el('span', '', identity, 'Sex: Female');
        util.el('span', '', identity, 'MRN: 10034872');
        const encounter = util.el('div', 'ref-encounter-info', patient);
        util.el('span', '', encounter, 'Encounter:  E000125678');
        util.el('span', '', encounter, 'Outpatient');
        util.el('span', '', encounter, 'Visit Date:  2004-04-22');
        util.el('span', '', encounter, 'PCP:  Daniel Cho, MD');
        Object.assign(_c, { brand, encounter, header, identity, patient, search, searchField, titleStrip, toolbar });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, placement, titleStrip, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools ref-header-tools', titleStrip);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-health-records-order-03',
    template: 'site/base',
    design: { parts },
  });
})();
