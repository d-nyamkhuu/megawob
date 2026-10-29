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
      if (kind === 'banner') {
        const header = document.querySelector('.ref-task');
        const instruction = header && header.querySelector('.ref-instruction');
        const edge = Math.max(header ? header.getBoundingClientRect().bottom : 0,
          instruction ? instruction.getBoundingClientRect().bottom : 0);
        el.style.top = `${edge}px`;
        document.querySelector('.ref-body').before(el);
      }
      if (kind === 'promo') el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px';
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const controls = util.el('div', 'motif-window-controls', header);
      for (const icon of ['−', '□', '×']) util.el('span', '', controls, icon);
      if (display !== 'header' || nav) {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Riverside Medical Center');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        if (nav) rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['File', 'Edit', 'View', 'Patient', 'Unit', 'Bed', 'Transfer', 'Tools', 'Reports', 'Window', 'Help']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
        const search = util.el('input', 'ehr-top-search', header);
        search.placeholder = 'Search patient (name or MRN)';
        search.setAttribute('aria-label', search.placeholder);
        util.el('span', 'ehr-account', header, 'My Account　|　Help　|　Log Out');
      }
      const toolbar = util.el('div', 'ehr-iconbar', header);
      const toolPaths = [
        '<rect x="5" y="2" width="14" height="21" fill="#f5f1df"/><circle cx="12" cy="8" r="3" fill="#efc491"/><path d="M8 18v-6h8v6M7 21h10" fill="#92bce0"/>',
        '<path d="M2 8v14M22 12v10M3 18h19V11H3z" fill="#719be1"/><path d="M5 11V6h6v5M12 12V8h8v4" fill="#ddd9cd"/>',
        '<path d="M2 8h14V4l6 6-6 5v-4H2z" fill="#e8ce47"/><path d="M22 17H8v-4l-6 6 6 5v-4h14z" fill="#b876c0"/>',
        '<path d="M3 22V2M3 22h20"/><path d="M6 20V11h4v9" fill="#4ca8bd"/><path d="M12 20V5h4v15" fill="#f0cc4f"/><path d="M18 20V8h4v12" fill="#77bdb1"/>',
        '<rect x="4" y="3" width="17" height="21" fill="#fff9e8"/><path d="M8 2h9v4H8z" fill="#c5c0b3"/><path d="M8 10h10M8 14h10M8 18h10"/>',
        '<g transform="rotate(40 12 12)"><rect x="7" y="1" width="10" height="23" rx="5" fill="#e5524c"/><path d="M7 12h10v6q0 6-5 6t-5-6z" fill="#79b2df"/></g>',
        '<rect x="3" y="2" width="20" height="22" fill="#fff"/><path d="M7 4v17M12 4v17M17 4v17M4 8h17M4 13h17M4 18h17" stroke="#9aadb0"/><path d="m5 19 4-8 4 4 5-10 3 4" stroke="#d63d3d"/>',
        '<rect x="4" y="2" width="18" height="22" fill="#c6e0e6"/><path d="M8 6h10M8 10h10M8 14h10M8 18h10M7 3l3 3 3-3"/>'
      ];
      for (const [index, label] of ['Patients','Beds','Transfers','Census','Orders','Medications','Flowsheets','Reports'].entries()) {
        const item = util.el('div', 'ehr-toolitem', toolbar);
        const icon = util.el('span', 'ehr-toolicon', item);
        icon.innerHTML = '<svg viewBox="0 0 26 27" fill="none" stroke="#17212a" stroke-width="1.2">' + toolPaths[index] + '</svg>';
        util.el('span', 'ehr-toolcaption', item, label);
      }
      Object.assign(_c, { controls, header, toolPaths, toolbar });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      header.classList.toggle('motif-with-instruction', display === 'header');
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
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : 'Task Note');
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const legend = util.el('aside', 'ehr-legend', body);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) legend.append(taskPanel);
      const legendGroup = (title, entries) => {
        const group = util.el('section', 'ehr-legend-group', legend);
        util.el('div', 'ehr-legend-title', group, title);
        for (const [tone, text] of entries) {
          const row = util.el('div', 'ehr-legend-row', group);
          util.el('span', `ehr-swatch ${tone}`, row);
          util.el('span', '', row, text);
        }
      };
      legendGroup('Bed Legend', [['available','Available bed'],['restricted','Available (restricted)'],['occupied','Occupied bed'],['blocked','Unavailable / Blocked']]);
      legendGroup('Acuity Levels', [['high','High'],['moderate','Moderate'],['low','Low']]);
      legendGroup('Isolation Precautions', [['contact','Contact'],['droplet','Droplet'],['airborne','Airborne'],['protective','Protective'],['standard','Standard']]);
      const rules = util.el('section', 'ehr-legend-group ehr-rules', legend);
      util.el('div', 'ehr-legend-title', rules, 'Placement Rules');
      util.el('div', 'ehr-rules-text', rules, '• Sex cohort must match.\n• Isolation requirement must be supported by the bed.\n• Bed maximum acuity must be equal to or higher than the patient’s acuity.');
      Object.assign(_c, { legend, legendGroup, rules, stage, taskPanel });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-health-records-beds-04',
    template: 'site/base',
    design: { parts },
  });
})();
