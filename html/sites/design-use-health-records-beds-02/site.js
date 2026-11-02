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
        if (kind === 'banner') document.querySelector('.ref-task').after(el);
        if (kind === 'promo') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          const illustration = util.el('div', 'bp-mail-tile', box);
          illustration.innerHTML =
            '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M16 39h88v61H16z" fill="#0766c5" stroke="#fff" stroke-width="3"/><path d="m16 39 44 37 44-37M16 100l31-34m57 34L73 66" fill="none" stroke="#c8edff" stroke-width="3"/><path d="M60 9v14M10 25l10 12m90-12-10 12M3 68h10m94 0h10M28 108l-6 9m70-9 6 9" stroke="#3899f0" stroke-width="2"/></svg>';
          util.el('h2', 'bp-promo-title', box, 'Stay informed');
        }
        if (kind === 'cookie' || kind === 'banner')
          util.el('div', 'bp-overlay-symbol', box, kind === 'cookie' ? '◉' : '⚑');
        const message = util.el('div', 'ref-ov-text', box);
        if (kind === 'cookie' || kind === 'banner')
          util.el('strong', 'bp-overlay-title', message, kind === 'cookie' ? 'We use cookies' : 'System notice');
        util.el('div', '', message, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
        if (kind === 'promo') {
          const email = util.el('input', 'bp-promo-email', box);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', email.placeholder);
        }
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
        if (kind === 'chat') {
          const heading = util.el('div', 'bp-chat-heading', box, 'Need help?');
          box.prepend(heading);
          heading.append(row);
          const compose = util.el('div', 'bp-chat-compose', box);
          const input = util.el('input', '', compose);
          input.placeholder = 'Type a message...';
          input.setAttribute('aria-label', input.placeholder);
          const send = util.el('button', '', compose, '➤');
          send.type = 'button';
          send.setAttribute('aria-label', 'Send message');
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send message' }));
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Hospital Bed Management');
        brand.dataset.role = 'brand';
        const windowControls = util.el('div', 'ehr-window-controls', header);
        const minimize = util.el('button', 'ehr-window-control ehr-minimize', windowControls, '−');
        minimize.type = 'button';
        minimize.setAttribute('aria-label', 'Minimize');
        const maximize = util.el('button', 'ehr-window-control ehr-maximize', windowControls, '');
        maximize.type = 'button';
        maximize.setAttribute('aria-label', 'Maximize');
        const closeWindow = util.el('button', 'ehr-window-control ehr-close', windowControls, '×');
        closeWindow.type = 'button';
        closeWindow.setAttribute('aria-label', 'Close');
        {
          const n = util.el('nav', 'ref-nav', header);
          if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of ['Home', 'Patients', 'Orders', 'Medications', 'Nursing', 'Bed Management', 'Reports']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
          const search = util.el('input', 'ehr-top-search', header);
          search.placeholder = 'Search patient (name or MRN)';
          search.setAttribute('aria-label', search.placeholder);
          util.el('span', 'ehr-account', header, 'My Account　|　Help　|　Log Out');
        }
        Object.assign(_c, { brand, closeWindow, header, maximize, minimize, windowControls });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const patients = util.el('aside', 'ehr-patients', body);
        const censusPanel = util.el('section', 'bp-rail-panel bp-unit-census', patients);
        const censusHead = util.el('div', 'ehr-patient-head', censusPanel, 'Unit Census');
        util.el('small', 'bp-census-date', censusHead, 'Tue Apr 22, 2014　10:24');
        const railTable = (parent, headings, rows) => {
          const table = util.el('table', 'bp-rail-table', parent);
          const head = util.el('tr', '', util.el('thead', '', table));
          for (const label of headings) util.el('th', '', head, label);
          const tbody = util.el('tbody', '', table);
          for (const cells of rows) {
            const row = util.el('tr', '', tbody);
            for (const value of cells) util.el('td', '', row, String(value));
          }
        };
        railTable(
          censusPanel,
          ['Unit', 'Beds', 'Occupied', 'Available'],
          [
            ['Medical (N)', 32, 28, 4],
            ['Surgical (S)', 28, 25, 3],
            ['ICU (I)', 16, 15, 1],
            ['Telemetry (T)', 24, 22, 2],
            ['Maternity (M)', 18, 16, 2],
            ['Isolation (Z)', 12, 10, 2],
            ['Total', 130, 116, 14],
          ],
        );
        const filterPanel = util.el('section', 'bp-rail-panel bp-filters', patients);
        util.el('div', 'ehr-patient-head', filterPanel, 'Bed Status Filter');
        const filters = util.el('div', 'ehr-filter-grid', filterPanel);
        for (const [i, label] of [
          'Available only',
          'Male cohort',
          'Female cohort',
          'Isolation capable',
          'Minimum acuity',
          'Medical (N)',
          'Surgical (S)',
          'Telemetry (T)',
          'ICU (I)',
          'Maternity (M)',
        ].entries()) {
          const filter = util.el('div', 'ehr-filter', filters);
          util.el('span', `bp-check${i === 0 ? ' checked' : ''}`, filter, i === 0 ? '✓' : '');
          const text = util.el('span', '', filter, label);
          if (i === 4) util.el('span', 'bp-acuity-choice', text, 'Any');
        }
        const otherPanel = util.el('section', 'bp-rail-panel bp-other-units', patients);
        util.el('div', 'ehr-patient-head', otherPanel, 'Other Units');
        railTable(
          otherPanel,
          ['Unit', 'Occupied', 'Available'],
          [
            ['ED', 18, 2],
            ['Observation', 12, 4],
            ['PACU', 8, 2],
            ['Rehab', 20, 4],
          ],
        );
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, censusHead, censusPanel, filterPanel, filters, otherPanel, patients, railTable });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, rng, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        Object.assign(_c, { stage });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-health-records-beds-02',
    template: 'site/base',
    design: { parts },
  });
})();
