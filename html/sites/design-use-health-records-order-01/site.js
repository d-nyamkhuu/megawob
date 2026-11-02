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
      root.dataset.theme = name;
      // This design is a fixed monochrome desktop application. Keep the legacy draws above
      // so seeded task/frame streams remain stable, then apply its own window palette.
      for (const [k, v] of Object.entries({ bg: '#f4f4f2', panel: '#fbfbfa', fg: '#111315', muted: '#55585a', line: '#bfc1c2' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#55585a');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES); // preserve the legacy frame draw
      const brand = util.el('div', 'ref-brand', header, '✚  Riverside Medical Center');
      brand.dataset.role = 'brand';
      {
        const n = util.el('nav', 'ref-nav', header);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5)); // preserve legacy conditional draws
        for (const item of ['Patients', 'Scheduling', 'Orders', 'Medications', 'Results', 'Nursing', 'Bed Management']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const patientList = util.el('aside', 'ehr-patient-list', body);
      util.el('h2', '', patientList, 'Patient List');
      const patientSearch = util.el('div', 'ehr-search', patientList, 'Search patients…  ⌕');
      patientSearch.setAttribute('aria-hidden', 'true');
      const patientFilters = util.el('div', 'ehr-filters', patientList);
      for (const item of ['All Patients', 'My Patients', 'Inpatients', 'Outpatients']) util.el('span', '', patientFilters, item);
      const patientTable = util.el('div', 'ehr-patient-table', patientList);
      const patientHead = util.el('div', 'ehr-patient-row ehr-patient-head', patientTable);
      for (const item of ['Name', 'DOB', 'MRN', 'Location']) util.el('span', '', patientHead, item);
      // Decorative patient index: never derive its content or emphasis from the goal.
      for (const row of [
        ['Ali, Samir','1975-11-02','RM000418','Clinic A'], ['Brown, Taylor','1990-06-24','RM000532','ED'],
        ['Chen, Liling','1968-01-17','RM000771','3 West'], ['de Jong, Femke','1983-03-15','RM000693','Medical 2'],
        ['Garcia, Mateo','2001-08-30','RM000881','Clinic B'], ['Khan, Aisha','1979-12-11','RM000162','4 North'],
        ['Nguyen, Daniel','1986-04-03','RM000995','Surgery'], ['Patel, Rina','1952-07-19','RM000203','Medical 1'],
        ['Silva, Jorge','1973-09-28','RM000676','Clinic A'], ['Wilson, Hannah','1995-02-14','RM000854','ED'],
      ]) {
        const line = util.el('div', 'ehr-patient-row', patientTable);
        for (const value of row) util.el('span', '', line, value);
      }
      Object.assign(_c, { patientFilters, patientHead, patientList, patientSearch, patientTable });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      _c.stage = stage;
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-health-records-order-01',
    template: 'site/base',
    design: { parts },
  });
})();
