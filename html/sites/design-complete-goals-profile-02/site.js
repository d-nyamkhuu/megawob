// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-complete-goals-profile-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.26': (base, S) => function (_c) {
          const nav = true;
          Object.assign(_c, { nav });
        },
        'frame.34': (base, S) => function (_c) {
          const { TITLES } = S;
          const { content, header, nav, rng, util } = _c;
          if (_c.display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Studio');
        brand.dataset.role = 'brand';
      }
          if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Contacts', 'Groups', 'Messages', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          const paths = {
            Contacts: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
            Groups: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
            Messages: '<path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
            Settings: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3m10-10h-3M5 12H2m17.07-7.07-2.12 2.12M7.05 16.95l-2.12 2.12m14.14 0-2.12-2.12M7.05 7.05 4.93 4.93"/>'
          };
          a.insertAdjacentHTML('afterbegin', `<svg class="studio-nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[item]}</svg>`);
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
        },
        'frame.35': () => () => {},
        'frame.37': (base, S) => function (_c) {
          const { header, util } = _c;
          header.classList.add('studio-header');
          const decoyBtn = (parent, text, collides) => {
        const b = util.el('button', 'ref-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label: text, collide: true } : { label: text }));
      };
          Object.assign(_c, { decoyBtn });
        },
        'frame.45': (base, S) => function (_c) {
          const { header, util } = _c;
          const windowControls = util.el('div', 'studio-window-controls', header);
          for (const [title, path] of [['Minimize', '<path d="M5 12h14"/>'], ['Maximize', '<rect x="5" y="5" width="14" height="14" rx="1"/>'], ['Close', '<path d="m6 6 12 12M18 6 6 18"/>']]) {
        const control = util.el('button', 'studio-window-control', windowControls);
        control.type = 'button'; control.title = title; control.setAttribute('aria-label', title);
        control.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
        control.addEventListener('click', () => env.log('decoy', { what: 'window-control', label: title }));
      }
          const body = util.el('div', 'ref-body', document.body);
          const records = util.el('aside', 'studio-records', body);
          util.el('h2', 'studio-records-title', records, 'Contacts');
          const recent = [['Avery Chen','Product Designer','#367ee9'],['Riley Park','Marketing Lead','#329c55'],['Jordan Kim','Software Engineer','#8957d8'],['Taylor Morgan','Customer Success','#fa861d'],['Casey Nguyen','Data Analyst','#0eaca5'],['Morgan Lee','Operations','#e84b85']];
          for (const [title, role, color] of recent) {
        const row = util.el('div', 'studio-record', records);
        const sw = util.el('i', 'studio-record-swatch', row, title.split(' ').map((x) => x[0]).join('')); sw.style.background = color;
        const copy = util.el('span', 'studio-record-copy', row);
        util.el('span', 'studio-record-name', copy, title);
        util.el('span', 'studio-record-date', copy, role);
      }
          const stats = util.el('aside', 'studio-stats', body);
          for (const [label, value] of [['Contacts', '6'], ['Groups', '3'], ['Active today', '4']]) {
        const card = util.el('div', 'studio-stat', stats);
        util.el('div', 'studio-stat-label', card, label);
        util.el('div', 'studio-stat-value', card, value);
      }
          util.el('h2', 'studio-activity-title', stats, 'Recent activity');
          for (const [person, action, color] of [['Avery Chen', 'Updated profile', '#13bfd1'], ['Riley Park', 'Added to Marketing', '#43b85c'], ['Jordan Kim', 'Changed role', '#9160e9'], ['Taylor Morgan', 'New contact', '#ff891d']]) {
        const row = util.el('div', 'studio-activity', stats);
        const dot = util.el('i', 'studio-activity-dot', row); dot.style.background = color;
        const copy = util.el('span', 'studio-activity-copy', row);
        util.el('span', 'studio-activity-name', copy, person);
        util.el('span', 'studio-activity-action', copy, action);
      }
          const main = util.el('div', 'studio-main', body);
          util.el('h1', 'studio-title', main, 'New Item');
          util.el('div', 'studio-rule', main);
          Object.assign(_c, { body, main, recent, records, stats, windowControls });
        },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.49': () => () => {},
        'frame.50': () => () => {},
        'frame.51': () => () => {},
        'frame.52': () => () => {},
        'frame.53': () => () => {},
        'frame.54': () => () => {},
        'frame.55': () => () => {},
        'frame.56': () => () => {},
        'frame.57': () => () => {},
        'frame.58': () => () => {},
        'frame.59': () => () => {},
        'frame.60': () => () => {},
        'frame.61': () => () => {},
        'frame.62': () => () => {},
        'frame.63': () => () => {},
        'frame.64': () => () => {},
        'frame.65': () => () => {},
        'frame.66': () => () => {},
        'frame.67': () => () => {},
        'frame.68': () => () => {},
        'frame.69': () => () => {},
        'frame.70': () => () => {},
        'frame.72': (base, S) => function (_c) {
          const { K } = S;
          const { body, ctx, lr, main, rng, util, word } = _c;
          if (_c.display === 'panel') {
        const panel = util.el('aside', 'ref-panel', main);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
          const stage = util.el('main', 'ref-stage', main);
          stage.classList.add('studio-stage');
          Object.assign(_c, { stage });
        },
        'frame.73': () => () => {},
      },
    },
  });
})();
