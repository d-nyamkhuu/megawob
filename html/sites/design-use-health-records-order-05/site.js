// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base) => function (ctx) {
      const out = base(ctx);
      if (ctx.kind === 'banner') {
        const header = document.querySelector('.ref-task');
        if (header) out.el.style.setProperty('top', `${header.getBoundingClientRect().bottom}px`, 'important');
      }
      return out;
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      if (!_c.ctx.finish && _c.ctx.rng.fork('beos/end').bool(0.5)) {
        _c.placement = 'header';
        _c.label = 'Continue';
        _c.wantFooter = false;
        if (_c.collide && _c.collide.text.trim().toLowerCase() === 'continue') _c.collide.text = 'Apply';
      }
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
      for (const [k, v] of Object.entries({ bg: '#c7d5e1', panel: '#e8eaec', fg: '#111111', muted: '#43576b', line: '#7f8f9d' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#1955b2');
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) rng.pick(TITLES); // preserve the legacy frame draw
      const brand = util.el('div', 'ref-brand', header, 'HealthTrack 1.2  –  Patient Chart');
      brand.dataset.role = 'brand';
      const controls = util.el('div', 'beos-window-controls', header);
      for (const glyph of ['_', '□', '×']) util.el('span', '', controls, glyph);
      if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5)); // preserve legacy conditional draws
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
      // Decorative chart chrome must not identify the patient requested in the goal.
      const banner = util.el('section', 'chart-banner', body);
      const identity = util.el('div', 'chart-identity', banner);
      util.el('strong', 'chart-name', identity, 'Patient Chart');
      util.el('span', '', identity, 'DOB:  —');
      util.el('span', 'chart-mrn', identity, 'MRN:  418736');
      util.el('span', 'chart-sex', identity, 'Sex:  F');
      const loc = util.el('div', 'chart-location', identity);
      util.el('span', '', loc, 'Location:  Medical Unit 3B      Bed:  3B-12');
      util.el('span', '', loc, 'Attending:  Patel, R.');
      const encounter = util.el('div', 'chart-encounter', banner);
      for (const t of ['Admit Date:  2024-08-05', 'Admitting Diagnosis:  Pneumonia', 'Code Status:  Full Code', 'Allergies:  Penicillin (rash), Sulfa (hives)']) util.el('span', '', encounter, t);
      const info = util.el('aside', 'chart-info', body);
      const section = (title, rows) => {
        const block = util.el('section', 'chart-info-section', info);
        util.el('h2', '', block, title);
        for (const [k,v] of rows) {
          const field = title === 'Patient Information' ? ` chart-field-${k.replace(/[^A-Za-z]/g,'').toLowerCase()}` : '';
          const line = util.el('div', `chart-info-line${field}`, block);
          if (k) util.el('span', '', line, k);
          util.el('span', '', line, v);
        }
      };
      section('Patient Information', [['Age:', '59 years'], ['Gender:', 'Female'], ['MRN:', '418736'], ['DOB:', '—'], ['Language:', 'English'], ['Weight:', '68 kg'], ['Height:', '165 cm'], ['BMI:', '25.0']]);
      section('Active Problems', [['','Pneumonia'],['','Type 2 Diabetes Mellitus'],['','Hypertension'],['','Chronic Kidney Disease (Stage 3)']]);
      section('Care Team', [['Attending:', 'Patel, R.'],['PCP:', 'Nguyen, T.'],['Nurse:', 'Wallace, K.']]);
      Object.assign(_c, { banner, info });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util, banner, info } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      util.el('div', 'order-tab', body, 'New Medication Order');
      util.el('div', 'order-caption', body, 'Order Details');
      util.el('div', 'order-caption existing-caption', body, 'Existing Medication Orders');
      util.el('div', 'order-med-label', body, 'Medication:');
      const help = util.el('aside', 'order-help', body);
      util.el('h2', '', help, 'Order Entry Help');
      const helpBody = util.el('div', 'order-help-body', help);
      const group = (title, items) => {
        util.el('h3', '', helpBody, title);
        const ul = util.el('ul', '', helpBody);
        for (const item of items) util.el('li', '', ul, item);
      };
      group('Medication Orders', ['Select a medication from the list.', 'Enter the dose and choose the unit.', 'Specify frequency, route and priority.', 'Add start date, duration and indication as needed.']);
      group('Common Dose Units', ['mg – milligrams', 'mcg – micrograms', 'units – international units', 'mEq – milliequivalents', 'puffs – inhalation puffs']);
      group('Priority Levels', ['Routine – standard timing', 'Urgent – sooner, within 24 hours', 'STAT – immediate']);
      const lower = util.el('div', 'chart-lower', body);
      const table = (title, heads, rows) => {
        const box = util.el('section', 'chart-lower-box', lower);
        util.el('h2', '', box, title);
        const t = util.el('table', '', box);
        const trh = util.el('tr', '', t);
        heads.forEach(x => util.el('th', '', trh, x));
        rows.forEach((row, i) => {
          const tr = util.el('tr', title === 'Bed Management' && i === 2 ? 'selected' : '', t);
          row.forEach(x => util.el('td', '', tr, x));
        });
      };
      table('Recent Vital Signs', ['Date/Time','T (°C)','HR','BP','RR','SpO₂'], [['2024-08-12 08:00','36.8','78','128/76','16','98%'],['2024-08-11 20:00','37.1','82','132/80','18','97%'],['2024-08-11 08:00','36.9','80','126/72','16','98%'],['2024-08-10 20:00','37.0','84','130/78','18','97%']]);
      table('Recent Labs', ['Date','Test','Result','Ref Range'], [['2024-08-11','WBC','6.4','4.0 – 11.0'],['2024-08-11','Hgb','12.8','12.0 – 16.0'],['2024-08-11','Plt','245','150 – 400'],['2024-08-10','Na','138','135 – 145'],['2024-08-10','K','3.9','3.5 – 5.0']]);
      table('Bed Management', ['Unit','Bed','Status','Patient'], [['3B','3B-10','Occupied','Nguyen, T.'],['3B','3B-11','Occupied','Wallace, K.'],['3B','3B-12','Occupied','Current chart'],['3B','3B-13','Available','—'],['3B','3B-14','Occupied','Ahmed, S.']]);
      _c.stage = stage;
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-health-records-order-05',
    template: 'site/base',
    design: { parts },
  });
})();
