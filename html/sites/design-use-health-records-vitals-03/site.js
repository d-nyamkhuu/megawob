// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const xpIcon = (kind) => {
    const art = {
      patient: '<circle cx="13" cy="8" r="5" fill="#f6cfad" stroke="#16428d"/><path d="M5 26v-4c0-6 4-9 8-9s8 3 8 9v4" fill="#2b83e7" stroke="#16428d"/><circle cx="21" cy="23" r="5" fill="#69ce34" stroke="#256700"/>',
      search: '<circle cx="12" cy="11" r="8" fill="#e4f7ff" stroke="#174c9b" stroke-width="2"/><path d="m18 18 8 8" stroke="#674222" stroke-width="4"/><circle cx="11" cy="10" r="3" fill="#ffd49c"/>',
      calendar: '<rect x="3" y="4" width="24" height="24" rx="2" fill="white" stroke="#17459d" stroke-width="2"/><path d="M3 10h24" stroke="#194caf" stroke-width="3"/><path d="M8 2v6m14-6v6" stroke="#de4848" stroke-width="3"/><path d="M8 15h3m4 0h3m4 0h3M8 20h3m4 0h3m4 0h3" stroke="#0b57b9" stroke-width="2"/>',
      pen: '<path d="M7 26 4 29l1-8L22 3c2-2 6 2 4 4L9 24Z" fill="#fff" stroke="#18429c" stroke-width="2"/><path d="m19 6 5 5" stroke="#ef4e55" stroke-width="3"/><path d="m4 29 5-5" stroke="#40b447" stroke-width="3"/>',
      pill: '<g transform="rotate(40 15 15)"><rect x="8" y="2" width="14" height="27" rx="7" fill="#fff" stroke="#0c3b94" stroke-width="2"/><path d="M8 15h14v7a7 7 0 0 1-14 0Z" fill="#f1225a"/></g>',
      nurse: '<rect x="6" y="4" width="19" height="25" rx="2" fill="#fff" stroke="#1453a9" stroke-width="2"/><rect x="11" y="2" width="9" height="5" rx="1" fill="#8ec4ef" stroke="#1551a3"/><path d="M10 13h10m-10 5h8m-8 5h11" stroke="#214994" stroke-width="2"/><path d="M21 12v8m-4-4h8" stroke="#f14242" stroke-width="2"/>',
      bars: '<rect x="3" y="3" width="25" height="25" fill="#fff" stroke="#1651aa" stroke-width="2"/><path d="M8 23v-8m5 8V9m5 14V6m5 17V12" stroke="#2da952" stroke-width="3"/><path d="M6 24h20" stroke="#235db9"/>',
      page: '<path d="M6 2h17l4 5v22H6Z" fill="#fff" stroke="#1750a6" stroke-width="2"/><path d="M10 11h13m-13 5h13m-13 5h13" stroke="#2969bc" stroke-width="2"/><path d="M19 2v6h8" fill="none" stroke="#1750a6"/>',
      home: '<path d="m2 14 13-11 13 11" fill="none" stroke="#e8392b" stroke-width="3"/><path d="M6 12v16h18V12L15 5Z" fill="#fff6ba" stroke="#2157aa" stroke-width="2"/><path d="M12 28v-9h6v9" fill="#9c6444" stroke="#2157aa"/>',
      folder: '<path d="M2 7h10l3 3h13v17H2Z" fill="#f5c840" stroke="#9c6a07" stroke-width="2"/><path d="M2 10h26" stroke="#fff1a7" stroke-width="2"/>',
      bed: '<path d="M4 8v19m0-6h23v6M4 16h23" stroke="#1458ad" stroke-width="3"/><rect x="7" y="12" width="18" height="7" rx="2" fill="#a9d8ff" stroke="#1458ad"/><rect x="7" y="11" width="7" height="4" fill="#fff"/>',
      gear: '<circle cx="15" cy="15" r="11" fill="#badbf7" stroke="#13519d" stroke-width="2"/><circle cx="15" cy="15" r="4" fill="white" stroke="#13519d" stroke-width="2"/><path d="M15 1v5m0 18v5M1 15h5m18 0h5M5 5l4 4m12 12 4 4M25 5l-4 4M9 21l-4 4" stroke="#13519d" stroke-width="2"/>',
    };
    return `<svg viewBox="0 0 30 30" width="30" height="30" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${art[kind] || art.page}</svg>`;
  };

  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      if (!_c.ctx.finish && !_c.rng.fork('xp-primary-end').bool(0.45)) {
        _c.placement = 'header';
        _c.wantFooter = false;
        _c.label = 'Apply';
        if (_c.collide && _c.collide.text === 'Apply') _c.collide = null;
      }
    },
    'frame.header': (base) => (_c) => {
      base(_c);
      const { util, header } = _c;
      const title = util.el('div', 'xp-titlebar', document.body);
      document.body.insertBefore(title, header);
      util.el('span', 'xp-appicon', title, '✚');
      util.el('span', 'xp-title', title, 'MediChart 2003 - Electronic Health Records');
      const win = util.el('div', 'xp-window-buttons', title);
      for (const [symbol, name] of [['–', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const b = util.el('button', 'xp-window-button', win, symbol);
        b.type = 'button'; b.setAttribute('aria-label', name);
      }
      const menu = util.el('div', 'xp-menubar', document.body);
      document.body.insertBefore(menu, header);
      for (const label of ['File', 'Edit', 'View', 'Patient', 'Orders', 'Nursing', 'Tools', 'Help']) {
        const item = util.el('span', 'xp-menuitem', menu, label);
        item.setAttribute('role', 'menuitem');
      }
      const tray = util.el('div', 'xp-toolbar-main', header);
      const items = [
        ['patient', 'New Patient'], ['search', 'Patient Search'], ['calendar', 'Schedule'],
        ['pen', 'Orders'], ['pill', 'Medications'], ['nurse', 'Nursing'],
        ['bars', 'Results'], ['page', 'Reports'], ['bars', 'Chart View']
      ];
      for (const [icon, name] of items) {
        const item = util.el('div', `xp-toolbar-item${name === 'Nursing' ? ' active' : ''}`, tray);
        util.el('span', 'xp-toolbar-icon', item).innerHTML = xpIcon(icon);
        util.el('span', '', item, name);
      }
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) _c.header.after(note);
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      if (_c.placement === 'header' && _c.label === 'Apply' && !_c.ctx.finish) {
        const b = _c.util.el('button', 'ref-xtra', _c.headerTools, 'Check');
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: 'Check' }));
      }
    },
    'frame.body': (base) => (_c) => {
      base(_c);
      const { util, body, ctx } = _c;
      const aside = util.el('aside', 'xp-sidebar', body);
      const patients = util.el('section', 'xp-listbox xp-patients', aside);
      util.el('div', 'xp-box-title', patients, 'Patient List - Medical Unit');
      const list = util.el('div', 'xp-list-inner', patients);
      const header = util.el('div', 'xp-grid-row xp-grid-head', list);
      for (const text of ['Rm', 'Name', 'MRN']) util.el('span', '', header, text);
      const rr = ctx.rng.fork('xp-sidebar-index');
      const pool = ['Allen, Robert', 'Park, Mina', 'Ibrahim, Noor', 'Sato, Kenji',
        'Miller, Dana', 'Kumar, Ravi', 'Rivera, Lucia', 'Brown, Elise',
        'Owens, Mark', 'Zhao, Mei', 'Davis, Elena', 'Walsh, Peter',
        'Hassan, Leila', 'Young, Aaron', 'Silva, Marina', 'Green, Samuel',
        'Walker, Nina', 'Wilson, Grace', 'Costa, Rafael', 'Bennett, Maya'];
      const names = rr.sample(pool, 16);
      // Decorative selection stays independent of the episode's goal text.
      names[3] = 'Current Patient';
      const roomStart = rr.int(201, 225);
      const mrnStart = rr.int(100100, 101300);
      names.forEach((name, i) => {
        const row = util.el('div', `xp-grid-row${i === 3 ? ' selected' : ''}`, list);
        util.el('span', '', row, String(roomStart + i));
        util.el('span', '', row, name);
        util.el('span', '', row, String(mrnStart + i));
      });
      const records = util.el('section', 'xp-listbox xp-records', aside);
      util.el('div', 'xp-box-title', records, 'Recent Records');
      const rec = util.el('div', 'xp-list-inner', records);
      const rh = util.el('div', 'xp-record-row xp-grid-head', rec);
      util.el('span', '', rh, 'Date/Time'); util.el('span', '', rh, 'Type');
      const types = ['Nursing Flowsheet', 'Nursing Flowsheet', 'Medication Review', 'Physician Orders',
        'Progress Note', 'Nursing Flowsheet', 'Respiratory Therapy', 'Nursing Flowsheet', 'Physician Note', 'Admission Note'];
      const recDay = rr.int(8, 19);
      types.forEach((type, i) => {
        const row = util.el('div', `xp-record-row${i === 0 ? ' selected' : ''}`, rec);
        util.el('span', '', row, `Mar ${String(recDay - Math.floor(i / 3)).padStart(2, '0')}, 2003  ${['14:30','09:15','08:20','16:10','12:05','18:45','11:30','14:22','09:10','16:00'][i]}`);
        util.el('span', '', row, type);
      });
    },
    'frame.end': (base) => (_c) => {
      const result = base(_c);
      const { util } = _c;
      const dock = util.el('nav', 'xp-dock', document.body);
      const tabs = [['home','Home'],['folder','Patients'],['calendar','Scheduling'],['page','Orders'],
        ['pill','Medications'],['nurse','Nursing'],['bed','Beds'],['bars','Results'],['gear','Reports']];
      for (const [icon, name] of tabs) {
        const item = util.el('div', `xp-dock-item${name === 'Patients' ? ' active' : ''}`, dock);
        util.el('span', 'xp-dock-icon', item).innerHTML = xpIcon(icon); util.el('span', '', item, name);
      }
      return result;
    },
  };

  env.site({
    name: 'design-use-health-records-vitals-03',
    template: 'site/base',
    design: { parts },
  });
})();
