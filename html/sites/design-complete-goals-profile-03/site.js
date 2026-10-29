// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-complete-goals-profile-03',
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
        const brand = util.el('div', 'ref-brand', header, 'Workbench  Project Manager');
        brand.dataset.role = 'brand';
      }
          if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Projects', 'Assets', 'People', 'Settings']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
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
        'frame.46': (base, S) => function (_c) {
          const { body, util } = _c;
          const records = util.el('aside', 'studio-records', body);
          util.el('h2', 'studio-records-title', records, 'Project Details');
          const details = [['Name', 'Website Redesign'], ['Type', 'Creative Project'], ['Status', 'Active'],
        ['Owner', 'Alex Chen'], ['Client', 'Ridgeway Media'], ['Created', 'Mar 12, 1990'], ['Modified', 'Mar 12, 1990']];
          for (const [label, value] of details) {
        const row = util.el('div', 'studio-record', records);
        row.classList.add('studio-property');
        util.el('span', 'studio-record-name', row, `${label}:`);
        util.el('span', 'studio-record-date', row, value);
      }
          const description = util.el('section', 'studio-description', records);
          util.el('div', 'studio-record-name', description, 'Description:');
          util.el('div', 'studio-description-copy', description, 'Redesign of the public website with updated branding and content.');
          const files = util.el('section', 'studio-files', records);
          util.el('div', 'studio-record-name', files, 'Files (6)');
          for (const [file, size] of [['brief.txt','2 KB'],['logo.iff','14 KB'],['mockup1.iff','28 KB'],['colors.pal','1 KB'],['layout.iff','26 KB'],['notes.txt','3 KB']]) {
        const row = util.el('div', 'studio-file', files);
        util.el('span', '', row, file); util.el('span', '', row, size);
      }
          const main = util.el('div', 'studio-main', body);
          util.el('h1', 'studio-title', main, 'New Item');
          util.el('div', 'studio-rule', main);
          Object.assign(_c, { description, details, files, main, records });
        },
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
