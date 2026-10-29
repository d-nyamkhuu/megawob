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
      if (kind === 'banner') {
        const header = document.querySelector('.ref-task');
        el.style.top = `${header.getBoundingClientRect().bottom}px`;
      }
      el.dataset.role = 'overlay';
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
      root.dataset.theme = name;
      for (const [key, value] of Object.entries({ bg:'#eaf2f8', panel:'#fff', fg:'#191c32', muted:'#52647a', line:'#a8cbea', accent:'#245d95' })) root.style.setProperty(`--${key}`, value);
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Riverview Medical Center');
        brand.dataset.role = 'brand';
      }
      if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand', header, 'Riverview Medical Center');
      const brandNode = header.querySelector('.ref-brand');
      const landscape = util.el('div', 'ref-landscape', brandNode);
      landscape.setAttribute('aria-hidden', 'true');
      const emblem = util.svg('svg', {viewBox:'0 0 76 68', class:'ref-medical-emblem', 'aria-hidden':'true'}, brandNode);
      util.svg('path', {d:'M38 10v52m-2-3 2 5 2-5',fill:'none',stroke:'#f4d47f','stroke-width':'2.4','stroke-linecap':'round'}, emblem);
      util.svg('circle', {cx:'38',cy:'7',r:'3',fill:'#ffe1a0',stroke:'#d4ad57'}, emblem);
      util.svg('path', {d:'M34 14C26 12 23 19 29 23c6 4 15 3 16 9s-14 6-14 12 12 5 11 11l-3 5M42 14c8-2 11 5 5 9-6 4-15 3-16 9s14 6 14 12-12 5-11 11l3 5',fill:'none',stroke:'#efd084','stroke-width':'1.65','stroke-linecap':'round'}, emblem);
      for (const direction of [-1, 1]) {
        const wing = util.svg('g', {transform:`translate(38 0) scale(${direction} 1)`}, emblem);
        util.svg('path', {d:'M4 12Q10 5 18 8L33 12Q26 15 20 13L8 16Q4 17 4 12Z',fill:'#f4d58b',stroke:'#d0a859','stroke-width':'.8'}, wing);
        for (let i=0;i<5;i++) util.svg('path', {d:`M${8+i*4} ${12+i*.25}q5 5 12 2q-7 6-14 1`,fill:'#e8c477',stroke:'#c9a050','stroke-width':'.65'}, wing);
        util.svg('path', {d:'M6 11Q16 12 29 13',fill:'none',stroke:'#fff0b3','stroke-width':'1'}, wing);
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Patient List', 'Chart', 'Orders', 'Medications', 'Nursing', 'Bed Management', 'Scheduling']) {
          const a = util.el('a', 'ref-navlink', n, item);
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
      const patientRow = (values, cls = '') => {
        const row = util.el('div', `ehr-patient-row${cls ? ` ${cls}` : ''}`, ptable);
        for (const value of values) util.el('span', '', row, value);
        return row;
      };
      patientRow(['Name', 'MRN', 'Unit'], 'ehr-patient-columns');
      for (const [name, mrn, unit] of [
        ['Adams, Robert','1006123','4E'],['Baker, Jill','1003349','3W'],['Clark, Daniel','1007712','ED'],
        ['de Jong, Femke','1007284','ED'],['Garcia, Elena','1005581','4E'],['Harris, Michael','1006390','5N'],
        ['Ibrahim, Samir','1004456','3W'],['Kim, Laura','1007820','ED'],['Lee, Andrew','1006671','4W'],
        ['Martinez, Carla','1005198','5N'],['Nguyen, Thanh','1003102','3W'],['Patel, Rina','1006027','4E'],
        ['Robinson, James','1007133','ED'],['Singh, Arjun','1004841','5N'],['Smith, Megan','1005932','4W'],
        ['Taylor, Brian','1006508','3W'],['Wilson, Sara','1002761','4E'],
      ]) {
        patientRow([name, mrn, unit], name === 'de Jong, Femke' ? 'selected' : '');
      }
      S.frameSidebar(_c, body);
      const noteTitle = body.querySelector('.ref-panel-title');
      if (noteTitle) noteTitle.textContent = 'Task Note';
      Object.assign(_c, { body, patientRow, patients, psearch, ptable });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-health-records-beds-05',
    template: 'site/base',
    design: { parts },
  });
})();
