// Design on use-health-records/chart; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-health-records',
  site: 'design-use-health-records-beds-05',
  name: 'design',
  split: 'train',
  scenarios: ['beds'],
  template: 'use-health-records/chart',
  design: {
    fontFamily: '"Trebuchet MS",Arial,sans-serif', fontSize: '14px', rootInset: '0px',
    parts: {
      heading: (base, S) => () => {
        S.refs.riversideTitle = S.ctx.util.el('div', 'riverside-title', S.main, 'Patient Transfer & Bed Assignment');
      },
      transfer: (base, S) => (ctx) => {
        base(ctx);
        const u = ctx.util, p = S.spec.patient, tray = S.refs.patient;
        const placement = S.refs.placement;
        tray.replaceChildren();
        tray.classList.add('riverside-transfer');
        u.el('div', 'riverside-grip', tray, '⠿\n⠿\n⠿');
        const info = u.el('div', 'riverside-patient-info', tray);
        const identity = u.el('div', 'riverside-identity', info);
        u.el('strong', '', identity, p.name);
        u.el('span', '', identity, `MRN: ${p.mrn}`);
        const demo = u.el('div', 'riverside-demographics', identity);
        u.el('span', '', demo, `DOB:  ${p.dob}`);
        u.el('span', '', demo, `Sex:  ${p.sex}`);
        const location = u.el('div', 'riverside-location', info);
        const service = u.el('div', 'riverside-loc-cell', location);
        u.el('span', '', service, 'Admitting Service:');u.el('strong', '', service, 'General Medicine');
        const current = u.el('div', 'riverside-loc-cell', location);
        u.el('span', '', current, 'Current Location:');u.el('strong', 'riverside-current-value', current, 'ED');
        const status = u.el('div', 'riverside-loc-cell', location);
        u.el('span', '', status, 'Status:');u.el('strong', '', status, 'Awaiting Bed Placement');
        const flags = u.el('div', 'riverside-flags', info);
        const isolation = u.el('div', 'riverside-isolation', flags);
        u.el('div', '', isolation, 'Isolation requirement');
        const precaution = u.el('span', 'riverside-precaution', isolation);
        const glove = u.svg('svg', {viewBox:'0 0 32 32', class:'riverside-glove', 'aria-hidden':'true'}, precaution);
        u.svg('path', {d:'M11 29 5 20 3 14Q3 11 5 12L9 17 6 6Q6 3 8 5L12 14 11 3Q12 0 14 3L16 13 18 2Q20 1 20 4L20 15 24 6Q27 4 26 8L23 21 18 29Z', fill:'#6da5c5', stroke:'#558bab', 'stroke-width':'0.7'}, glove);
        u.el('span', '', precaution, `${p.isolation === 'None' ? 'Standard' : p.isolation} Precautions`);
        const acuity = u.el('div', 'riverside-acuity', flags);
        u.el('div', '', acuity, 'Acuity');
        const level = u.el('span', 'riverside-level', acuity);
        const bars = u.el('i', 'riverside-bars', level);
        for (let i = 0; i < 3; i++) u.el('i', '', bars);
        u.el('span', '', level, ['', 'Low', 'Moderate', 'High'][p.acuity] || p.acuity);
        placement.hidden = true;
        tray.appendChild(placement);
      },
      beds: (base, S) => (ctx) => {
        const u = ctx.util, s = S.spec;
        const panel = (parent, title, cls) => {
          const box = u.el('section', `riverside-panel ${cls || ''}`, parent);
          u.el('div', 'riverside-panel-title', box, title);
          return u.el('div', 'riverside-panel-body', box);
        };
        const rows = (parent, values) => {
          for (const [label, value] of values) {
            const row = u.el('div', 'riverside-detail', parent);
            u.el('span', '', row, label);u.el('span', '', row, value);
          }
        };
        const table = (parent, headers, data, cls) => {
          const t = u.el('table', `riverside-table ${cls || ''}`, parent);
          const h = u.el('tr', '', u.el('thead', '', t));
          for (const text of headers) u.el('th', '', h, text);
          const body = u.el('tbody', '', t);
          for (const cells of data) {
            const tr = u.el('tr', '', body);
            for (const text of cells) u.el('td', '', tr, String(text));
          }
          return t;
        };
        const top = u.el('div', 'riverside-upper', S.pane);
        const left = u.el('div', 'riverside-left', top);
        left.appendChild(S.refs.riversideTitle);
        panel(left, 'Patient for Transfer', 'riverside-transfer-panel').appendChild(S.refs.patient);
        const req = panel(left, 'Placement Requirements', 'riverside-requirements');
        rows(req, [
          ['Sex Cohort', `${s.patient.sex} bed required`],
          ['Isolation', s.patient.isolation === 'None' ? 'Standard precautions' : `${s.patient.isolation} isolation required`],
          ['Acuity', `Requires ${['', 'Low', 'Moderate', 'High'][s.patient.acuity] || s.patient.acuity} acuity bed`],
          ['Other Considerations', 'None'],
        ]);
        const requirements = req.querySelectorAll('.riverside-detail');
        const precautionArt = u.svg('svg', {viewBox:'0 0 90 76', class:'riverside-requirement-art', 'aria-hidden':'true'}, requirements[1]);
        u.svg('path', {d:'M23 9 13 13 3 45 12 49 20 28 16 70Q32 77 49 70L45 28 53 49 61 45 51 13 41 9Q33 16 23 9Z',fill:'#62a987',stroke:'#36785e','stroke-width':'1.5'}, precautionArt);
        u.svg('path', {d:'M23 9Q32 22 41 9M32 19v49M18 52h10m10 0h9M15 16 8 44m40-29 9 29',fill:'none',stroke:'#3f8e6a','stroke-width':'1.3'}, precautionArt);
        u.svg('path', {d:'m69 62-6-17q-2-5 1-5l5 8-1-23q1-4 3-1l3 17 1-24q2-4 3 0l1 22 3-21q3-2 3 2l-2 23 4-13q3-2 2 3l-4 23-4 10Z',fill:'#68ad87',stroke:'#397e60','stroke-width':'1.4'}, precautionArt);
        const acuityArt = u.svg('svg', {viewBox:'0 0 90 76', class:'riverside-requirement-art', 'aria-hidden':'true'}, requirements[2]);
        u.svg('path', {d:'M9 25v40m65-30v30M10 53h63M13 46h55v11H13Z',fill:'#076096',stroke:'#075181','stroke-width':'5','stroke-linecap':'round'}, acuityArt);
        u.svg('rect', {x:'31',y:'40',width:'37',height:'11',rx:'2',fill:'#075a91'}, acuityArt);
        u.svg('rect', {x:'16',y:'32',width:'16',height:'10',rx:'5',fill:'#075a91'}, acuityArt);
        const right = u.el('div', 'riverside-right', top);
        const capacity = panel(right, 'Unit Capacity – North Tower (N)', 'riverside-capacity');
        const view = u.el('div', 'riverside-view', capacity.parentElement.firstChild);
        u.el('span', '', view, 'View:');u.el('span', 'riverside-view-field', view, 'North Tower (N)　⌄');
        u.el('div', 'riverside-updated', capacity, 'Last updated: Apr 24, 2005 10:18');
        const capTable = table(capacity, ['Total Beds', 'Occupied', 'Available', 'Female Available', 'Male Available', 'Isolation Rooms (avail)'], [['', '', '', '', '', '']], 'riverside-capacity-table');
        S.refs.riversideCapacity = [...capTable.querySelectorAll('td')];
        const board = panel(right, 'Available Beds – North Unit (N)', 'riverside-bed-panel');
        const grid = u.el('div', 'riverside-bedgrid', board);
        grid.dataset.count = String(s.beds.length);
        grid.style.setProperty('--bed-columns', s.beds.length <= 4 ? s.beds.length : 3);
        grid.style.setProperty('--bed-rows', s.beds.length <= 4 ? 1 : Math.ceil(s.beds.length / 3));
        for (const bed of s.beds) S.P.bed(grid, bed);
        left.appendChild(board.parentElement);
        const bottom = u.el('div', 'riverside-bottom', right);
        const census = panel(bottom, 'North Unit Bed Board', 'riverside-units');
        const unitTable = table(census, ['Bed', 'Status', 'Sex Cohort', 'Isolation', 'Acuity', 'Patient'], [
          ['North Tower (N)', '', '', '', '', ''], ...s.beds.map(b => [
          b.id, b.occupied ? 'Occupied' : 'Available', b.sex, b.isolation, ['', 'Low', 'Moderate', 'High'][b.acuity] || b.acuity, b.occupant || '—',
        ])]);
        const unitRows = unitTable.querySelectorAll('tbody tr');
        s.beds.forEach((b, i) => unitRows[i + 1]?.classList.add(b.occupied ? 'occupied-row' : 'available-row'));
        /*
        const unitTable = table(census, ['Unit', 'Total', 'Occupied', 'Available', 'Isolation (avail)'], [
          ['North Tower (N)', '', '', '', ''], ['South Tower (S)', 24, 20, 4, '3 (1)'],
          ['East Wing (E)', 18, 15, 3, '2 (1)'], ['West Wing (W)', 18, 16, 2, '2 (0)'],
        ]); */
        S.refs.riversideUnit = [...unitTable.querySelector('tbody tr').children];
        const transport = panel(bottom, 'Unit Patient List (North)', 'riverside-transport');
        table(transport, ['Name', 'MRN', 'Sex', 'Isolation', 'Acuity', 'Bed'], S.worklist.slice(0, 8).map((p, i) => [
          p.name, p.mrn || '—', p.sex ? p.sex[0] : (i % 2 ? 'F' : 'M'), p.isolation || 'None', ['', 'Low', 'Moderate', 'High'][p.acuity] || p.acuity || 'Acute', s.beds[i % s.beds.length].id,
        ]));
      },
      bed: (base, S) => (grid, bed) => {
        const u = S.ctx.util, refs = S.refs;
        const card = u.el('section', `riverside-bed${bed.occupied ? ' occupied' : ''}`, grid);
        refs.beds.set(bed.id, card);refs.targets.set(`bed:${bed.id}`, card);
        const head = u.el('div', 'riverside-bed-head', card);
        u.el('b', '', head, bed.id);
        const state = u.el('span', 'riverside-bed-state', head);
        refs.bedStatus.set(bed.id, u.el('span', 'riverside-live-status', state));
        const patient = u.el('span', 'riverside-bed-patient', state);patient.dataset.bedPatient = bed.id;
        const art = u.el('div', 'riverside-bed-art', card);
        const svg = u.svg('svg', {viewBox:'0 0 240 132', preserveAspectRatio:'xMidYMid meet', class:'riverside-bed-drawing', 'aria-hidden':'true'}, art);
        const defs = u.svg('defs', {}, svg);
        const id = `bed-${bed.id.replace(/[^a-z0-9]/gi, '')}`;
        const green = bed.id.endsWith('101');
        const gradient = (name, colors) => {
          const g = u.svg('linearGradient', {id:`${id}-${name}`,x1:'0',y1:'0',x2:'.3',y2:'1'}, defs);
          colors.forEach((color, i) => u.svg('stop', {offset:String(i / (colors.length - 1)), 'stop-color':color}, g));
          return `url(#${id}-${name})`;
        };
        const metal = gradient('metal', ['#f8f9f8','#adb7be','#e3e6e6','#89949f']);
        const shade = gradient('shade', ['#c6cdd1','#808d98']);
        const sheet = gradient('sheet', bed.occupied ? ['#fff','#e4e7e8'] : green ? ['#a3d3b7','#6db68b'] : ['#a9d4ec','#79b1d4']);
        const side = gradient('side', bed.occupied ? ['#e8ebed','#c3c9ce'] : green ? ['#64ac83','#458d68'] : ['#78aacf','#4c86ae']);
        const path = (d, fill, stroke='#737e89', width='1.2') => u.svg('path', {d,fill,stroke,'stroke-width':width,'stroke-linejoin':'round'}, svg);
        u.svg('ellipse', {cx:'122',cy:'113',rx:'95',ry:'8',fill:'#a29e90',opacity:'.24'}, svg);
        for (const [x,y] of [[45,104],[192,115],[79,96],[213,102]]) {
          path(`M${x-3} ${y-12}v12`, 'none','#7a8790','5');
          u.svg('ellipse', {cx:x,cy:y,rx:'5',ry:'8',fill:shade,stroke:'#626e79','stroke-width':'1.4'}, svg);
          u.svg('ellipse', {cx:x+1,cy:y-1,rx:'2',ry:'4',fill:'#b3bdc4'}, svg);
        }
        path('M33 76 64 53 220 75 193 105 34 91Z',shade);
        path('M38 81 194 98 211 80 211 87 195 109 38 92Z',metal);
        path('M31 84V51Q31 42 39 36L65 18Q72 14 75 19L76 59 64 76Z',shade);
        path('M33 81V51Q33 45 40 39L66 21Q72 17 73 23L72 57',metal);
        path('M38 52Q38 48 43 44L65 29Q69 27 69 32L69 38 42 58Z','#e8ecee');
        path('M42 56 73 36 211 53 185 85 43 72Z','#fcfcf8');
        path('M43 72 185 85 185 96 43 82Z','#d8dfe3');
        path('M80 42 207 55 184 82 68 69Z',sheet);
        path('M68 69 184 82 184 95 68 81Z',side);
        path('M184 82 207 55 207 69 184 95Z',side);
        path('M46 51Q51 42 63 42L84 45 70 60 47 58Q43 57 46 51Z','#fbfcfa','#a8b1b8');
        path('M47 57 70 61 83 46', 'none','#d3dce0','.8');
        path('M69 69 82 43 92 44 81 70 81 82 69 81Z',bed.occupied?'#f4f6f5':green?'#acd8be':'#c7e2f3','#a9bec6','.6');
        if (bed.occupied) {
          for (let i=0;i<9;i++) path(`M${92+i*12} ${46+i*1.3}l-10 12 4 8-9 9`, 'none',i%2?'#d1d8de':'#f9fafa','.9');
          path('M91 72q29-10 48-4t43 6', 'none','#c4cdd4','.8');
        }
        path('M187 99V75Q187 69 192 64L213 39Q220 32 221 40L221 79 202 103Z',shade);
        path('M189 98V76Q189 71 194 66L215 42Q219 37 219 42V78L200 100Z',metal);
        path('M195 70 215 47v7l-19 22Z','#e9ecee');
        path('M35 83 184 99', 'none','#f4f5f3','2');
        const body = u.el('div', 'riverside-bed-body', card);
        for (const [label, value] of [
          ['Sex Cohort:', bed.sex],
          ['Isolation:', bed.isolation],
          ['Acuity Capacity:', ['', 'Low', 'Moderate', 'High'][bed.acuity] || bed.acuity],
          [bed.occupied ? 'Current Patient:' : 'Room type:', bed.occupied ? (bed.occupant || '—') : (bed.roomType || 'Private')],
        ]) {
          const row = u.el('div', 'riverside-detail', body);
          u.el('span', '', row, label);u.el('span', '', row, value);
        }
        return card;
      },
      paint: (base, S) => (m) => {
        base(m);
        const s = S.spec;
        const location = S.refs.patient?.querySelector('.riverside-location');
        if (location) {
          const value = location.querySelector('.riverside-current-value');
          if (value) value.textContent = m.placements.patient;
        }
        if (!S.refs.riversideCapacity) return;
        const occupied = s.occupants.length + (s.beds.some(b => b.id === m.placements.patient) ? 1 : 0);
        const ready = s.beds.filter(b => !b.occupied && b.id !== m.placements.patient);
        const isolation = s.beds.filter(b => b.isolation !== 'None');
        const isoReady = ready.filter(b => b.isolation !== 'None').length;
        const values = [s.beds.length, occupied, s.beds.length - occupied, ready.filter(b => b.sex === 'Female' || b.sex === 'Any').length, ready.filter(b => b.sex === 'Male' || b.sex === 'Any').length, `${isolation.length} (${isoReady})`];
        S.refs.riversideCapacity.forEach((el, i) => {el.textContent = values[i];});
        [s.beds.length, occupied, s.beds.length - occupied, `${isolation.length} (${isoReady})`].forEach((value, i) => {S.refs.riversideUnit[i + 1].textContent = value;});
        for (const [id, card] of S.refs.beds) card.classList.toggle('occupied', m.placements.patient === id || s.occupants.some(o => o.bed === id));
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const row = document.querySelector('.ehr-patient-row.selected');
        if (row) {row.children[0].textContent = S.spec.patient.name;row.children[1].textContent = S.spec.patient.mrn;}
      },
    },
  },
});
