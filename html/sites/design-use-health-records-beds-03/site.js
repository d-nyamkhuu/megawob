// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
      const endControl = document.querySelector('[data-role="submit"]');
      const endRect = endControl && endControl.getBoundingClientRect();
      const lowerClearance = endRect && endRect.top > headerBottom + 50 ? window.innerHeight - endRect.top + 12 : 60;
      if (kind === 'banner') el.style.top = `${headerBottom}px`;
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${lowerClearance + (kind === 'chat' ? 12 : 0)}px`;
      if (kind === 'promo') { el.style.top = `${headerBottom + 8}px`; el.style.bottom = `${lowerClearance}px`; }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.dataset.instruction = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      document.body.classList.toggle('placement-footer', wantFooter);
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Riverview Medical Center');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        const navIcons = [
          'M3 18V5m0 10h18v5m-18-5V9h5v6m0-5h11a2 2 0 0 1 2 2v3M3 19h18',
          'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a2.5 2.5 0 1 0 0-5M2 20v-2a5 5 0 0 1 10 0v2Zm13-6a5 5 0 0 1 7 4v2h-7',
          'M6 3h9l4 4v14H6Zm8 0v5h5M9 11h7m-7 4h7m-7 3h5',
          'M6 18a5 5 0 0 1 0-7l7-7a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7 0Zm3-10 7 7',
          'M4 3h17v18H4Zm3 12 4-5 4 3 4-6M7 18h11',
          'M4 5h17v16H4ZM8 2v6m9-6v6M4 10h17M8 14h1m4 0h1m4 0h1M8 18h1m4 0h1',
          'M5 3h15v18H3V5a2 2 0 0 1 2-2Zm3 14v-5m4 5V7m4 10V9',
          'M4 12h.01M12 12h.01M20 12h.01'
        ];
        let iconIndex = 0;
        for (const item of ['Bed Management', 'Patients', 'Orders', 'Medication', 'Flowsheets', 'Scheduling', 'Reports', 'More']) {
          const a = util.el('a', 'ref-navlink', n);
          const icon = util.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, a);
          util.svg('path', { d: navIcons[iconIndex++] }, icon);
          util.el('span', '', a, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
        const search = util.el('input', 'ehr-top-search', header);
        search.placeholder = 'Search patient (name or MRN)';
        search.setAttribute('aria-label', search.placeholder);
        util.el('span', 'ehr-account', header, 'My Account　|　Help　|　Log Out');
      }
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const patients = util.el('aside', 'ehr-patients', body);
      util.el('div', 'ehr-patient-head', patients, 'Inpatients & ED (32)');
      const psearch = util.el('input', 'ehr-patient-search', patients);
      psearch.placeholder = 'Search by name or MRN';
      const ptable = util.el('div', 'ehr-patient-table', patients);
      util.el('div', 'ehr-patient-row ehr-patient-columns', ptable, 'Name　　　　　　　　　MRN　　 Unit');
      for (const line of ['Adams, Robert　　 1006123　 4E','Baker, Jill　　　　 1003349　 3W','Clark, Daniel　　 1007712　 ED',
        'de Jong, Femke　 1007284　 ED','Garcia, Elena　　 1005581　 4E','Harris, Michael　 1006390　 5N','Ibrahim, Samir　 1004456　 3W',
        'Kim, Laura　　　 1007820　 ED','Lee, Andrew　　　1006671　 4W','Martinez, Carla　 1005198　 5N','Nguyen, Thanh　 1003102　 3W',
        'Patel, Rina　　　 1006027　 4E','Robinson, James 1007133　 ED','Singh, Arjun　　　1004841　 5N','Smith, Megan　　1005932　 4W']) {
        util.el('div', `ehr-patient-row${line.includes('de Jong') ? ' selected' : ''}`, ptable, line);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, patients, psearch, ptable });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // The widget fills these fields directly from the accepted patient record.
      const inspector = util.el('aside', 'ehr-inspector', body);
      util.el('div', 'ehr-inspector-title', inspector, 'Patient Details');
      const detailRows = {};
      for (const [key, title] of [['name','Name'],['mrn','MRN'],['dob','DOB'],['sex','Sex'],['isolation','Isolation'],['acuity','Acuity'],['bed','Current bed'],['service','Service'],['allergies','Allergies'],['code','Code status']]) {
        const row = util.el('div', 'ehr-inspector-row', inspector);
        util.el('span', 'ehr-inspector-label', row, title);
        detailRows[key] = util.el('span', 'ehr-inspector-value', row, '—');
      }
      Object.assign(_c, { detailRows, inspector, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-health-records-beds-03',
    template: 'site/base',
    design: { parts },
  });
})();
