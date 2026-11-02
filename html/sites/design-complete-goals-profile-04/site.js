// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-complete-goals-profile-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.26': (base, S) =>
          function (_c) {
            const nav = true;
            Object.assign(_c, { nav });
          },
        'frame.34': (base, S) =>
          function (_c) {
            const { TITLES } = S;
            const { content, header, nav, rng, util } = _c;
            if (_c.display !== 'header' || nav) {
              const title = rng.pick(TITLES);
              const brand = util.el('div', 'ref-brand', header, 'Kayak Rentals');
              brand.dataset.role = 'brand';
              const icon = util.el('span', 'win95-app-icon', brand);
              icon.setAttribute('aria-hidden', 'true');
              icon.innerHTML =
                '<svg viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg"><path d="M2 23 Q13 26 29 12 L28 17 Q14 28 2 25Z" fill="#0076b3"/><path d="M3 20 Q15 21 29 11 Q30 15 25 18 L8 24 Q4 24 3 20Z" fill="#ed1719" stroke="#111" stroke-width="1.2"/><path d="M9 20 L14 13 L20 14 L23 17 L17 19Z" fill="#111"/><circle cx="17" cy="9" r="2.3" fill="#111"/><path d="M16 12 L14 17 L21 17 M15 14 L22 10" fill="none" stroke="#111" stroke-width="2"/><path d="M7 22 L26 6" stroke="#111" stroke-width="1.4"/><path d="M23 7 L28 3 L29 5 L25 9Z" fill="#222"/></svg>';
            }
            if (nav) {
              const n = util.el('nav', 'ref-nav', header);
              rng.sample(content.NAV_ITEMS, rng.int(3, 5));
              for (const item of ['Projects', 'Create', 'Assets', 'Team', 'Reports']) {
                const a = util.el('a', 'ref-navlink', n, item);
                a.dataset.role = 'nav';
                a.addEventListener('click', (e) => {
                  e.preventDefault();
                  env.log('decoy', { what: 'nav', label: item });
                });
              }
            }
          },
        'frame.35': () => () => {},
        'frame.37': (base, S) =>
          function (_c) {
            const { header, util } = _c;
            header.classList.add('studio-header');
            const decoyBtn = (parent, text, collides) => {
              const b = util.el('button', 'ref-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () =>
                env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
              );
            };
            Object.assign(_c, { decoyBtn });
          },
        'frame.45': (base, S) =>
          function (_c) {
            const { header, util } = _c;
            const windowControls = util.el('div', 'win95-window-controls', header);
            windowControls.setAttribute('aria-hidden', 'true');
            for (const kind of ['minimize', 'maximize', 'close']) {
              util.el('span', `win95-window-button win95-${kind}`, windowControls);
            }
            const body = util.el('div', 'ref-body', document.body);
            const records = util.el('aside', 'studio-records', body);
            util.el('h2', 'studio-records-title', records, 'Recent Items');
            const recent = [
              ['Cherry', 'Apr 14, 2016', '#c7353c'],
              ['Ocean', 'Apr 12, 2016', '#2374ad'],
              ['Lime', 'Apr 10, 2016', '#71a83d'],
              ['Sunflower', 'Apr 8, 2016', '#f7c51c'],
              ['Slate', 'Apr 6, 2016', '#778794'],
              ['Violet', 'Apr 3, 2016', '#8960b7'],
              ['Mint', 'Mar 30, 2016', '#59bca7'],
              ['Coral', 'Mar 28, 2016', '#ed7258'],
              ['Sky', 'Mar 25, 2016', '#69c2df'],
              ['Sand', 'Mar 22, 2016', '#cfc3a8'],
            ];
            for (const [title, date, color] of recent) {
              const row = util.el('div', 'studio-record', records);
              const sw = util.el('i', 'studio-record-swatch', row);
              sw.style.background = color;
              const copy = util.el('span', 'studio-record-copy', row);
              util.el('span', 'studio-record-name', copy, title);
              util.el('span', 'studio-record-date', copy, date);
            }
            const main = util.el('div', 'studio-main', body);
            util.el('h1', 'studio-title', main, 'New Item');
            util.el('div', 'studio-rule', main);
            Object.assign(_c, { body, main, recent, records, windowControls });
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
        'frame.72': (base, S) =>
          function (_c) {
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
        'frame.76': (base, S) =>
          function (_c) {
            const { body, closeLabel, ctx, main, util } = _c;
            const help = util.el('aside', 'win95-help', body);
            if (_c.display === 'panel') help.append(main.querySelector('.ref-panel'));
            util.el('div', 'win95-photo', help);
            const helpBox = util.el('section', 'win95-helpbox', help);
            util.el('h2', '', helpBox, 'Rental Information');
            util.el('p', '', helpBox, 'High-quality kayaks for lakes, rivers, and coastal waters.');
            util.el('p', '', helpBox, 'Multiple pickup locations across North and South America.');
            util.el('p', '', helpBox, 'Choose a company, pickup city, and kayak color to continue.');
            if (_c.display === 'toast') {
              const note = util.el('div', 'ref-note', document.body);
              util.el('div', 'ref-note-text', note, ctx.instruction);
              const x = util.el('button', 'ref-note-x', note, '×');
              x.type = 'button';
              x.setAttribute('aria-label', closeLabel);
              x.addEventListener('click', () => {
                note.style.visibility = 'hidden';
                env.log('note-close');
              });
            }
            Object.assign(_c, { help, helpBox });
          },
        'overlay.6': (base, S) =>
          function (_c) {
            const { el, kind, util } = _c;
            if (kind === 'banner' || kind === 'promo' || kind === 'toast') {
              el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom + 10}px`;
            }
            const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
            Object.assign(_c, { box });
          },
      },
    },
  });
})();
