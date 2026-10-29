// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-pan-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'organizer',
        'title': '',
        'menu': '▣  Photos       ▤  Albums       ♟  People       ♦  Places       More ▾',
        'aside': 'Item Details',
        'foot': '',
        'accent': '#9a7954',
        'bg': '#eee4cf',
        'surface': '#fbf6e9',
        'font': "Georgia, 'Times New Roman', serif",
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            _c.display = ctx.display || 'header';
            const size = ctx.size || {},
              width = size.width || size.w || document.documentElement.clientWidth;
            if ((_c.display === 'panel' || _c.display === 'toast') && width < 1260) _c.display = 'header';
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (_c.display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { size, width });
          },
        'frame.3': () => () => {},
        'frame.18': (base, S) =>
          function (_c) {
            const { note, u } = _c;
            if (_c.display === 'hidden' || _c.display === 'panel') note.hidden = true;
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, instruction, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside, text);
                  bt.type = 'button';
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
              } else {
                u.el('h3', '', _c.aside, C.aside || 'Instructions');
                if (C.aside === 'Your Answer') {
                  u.el('p', '', _c.aside, 'No point selected yet.');
                  u.el('hr', '', _c.aside);
                  u.el('p', '', _c.aside, 'X:    —');
                  u.el('p', '', _c.aside, 'Y:    —');
                } else if (C.aside === 'Progress') {
                  u.el('p', '', _c.aside, 'Problem 1 of 5');
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, 'Use the navigator to explore the image.');
                else if (C.theme === 'crop-minimal' && _c.display !== 'hidden')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.layout === 'palette') {
                  const ol = u.el('ol', 'guide', _c.aside);
                  for (const t of [
                    'Drag each handle to the target value.',
                    'Keep the lower value on the left and the higher value on the right.',
                    'Do not click on the track.',
                  ])
                    u.el('li', '', ol, t);
                }
              }
            }
            if (_c.aside && C.theme === 'organizer') {
              const hero = u.el('div', 'catalog-hero', _c.aside);
              const cover = u.el('div', 'catalog-book', hero);
              cover.innerHTML = `<svg viewBox="0 0 108 172" xmlns="http://www.w3.org/2000/svg" aria-label="The Nature Handbook illustrated book cover"><defs><path id="fir" d="M0-49 7-32 3-34 13-18 6-20 19-4 8-7 24 11 5 6 5 23-3 23-3 6-23 12-9-5-17-2-5-21-12-17-3-35-7-31Z"/></defs><rect x="1" y="1" width="106" height="170" fill="#f2ebcf" stroke="#25291d" stroke-width="2"/><rect x="5" y="4" width="98" height="163" fill="none" stroke="#6e7856"/><path d="M3 3H9V168H3" fill="#709480"/><g fill="#10140f" font-family="Georgia,serif" font-size="18" font-weight="bold" text-anchor="middle"><text x="57" y="22">The</text><text x="57" y="42">Nature</text><text x="57" y="62">Handbook</text></g><path d="M10 112 33 84 49 106 71 86 101 116V163H10Z" fill="#9daaa0"/><path d="M18 106 33 84 42 98 33 94 27 103M57 103 71 86 91 110 73 99 69 102" fill="#f8f7e8"/><path d="M10 123 31 112 61 133 100 113V165H10" fill="#b1b58a"/><path d="M10 149 48 134 101 144V165H10" fill="#879268"/><g fill="#283e2c"><use href="#fir" transform="translate(57 127) scale(.84 1.02)"/><use href="#fir" transform="translate(24 145) scale(.43 .65)"/><use href="#fir" transform="translate(88 143) scale(.42 .66)"/><use href="#fir" transform="translate(40 153) scale(.35 .43)"/></g><path d="m12 164 28-8 19 4 34-7 8 6" fill="none" stroke="#46533c" stroke-width="2"/></svg>`;
              cover.querySelector('svg').insertAdjacentHTML('beforeend', `<g stroke="#7b8861" stroke-width=".65" fill="none"><path d="M57 82V149M57 92 52 98M57 95 63 102M57 102 47 110M57 107 68 116M57 114 43 124M57 122 73 132M57 131 40 141M57 138 76 148M24 117V158M24 130 18 138M24 139 31 149M88 113V158M88 127 81 138M88 136 96 149"/><path d="m10 157 11-3 9 3 9-5 7 3 12-4 11 3 17-6 14 5"/></g><path d="M57 118V150M24 140V158M88 139V159" stroke="#786b45" stroke-width="1"/>`);
              u.el('h4', 'catalog-title', hero, 'The Nature Handbook');
              const meta = u.el('div', 'catalog-meta', _c.aside);
              for (const [label, value] of [['Author:', 'Ellis, Margaret'], ['Year:', '1985'], ['Publisher:', 'Riverton Press'], ['ISBN:', '0-395-27104-8'], ['Subjects:', 'Natural history|Field study|Ecology']]) {
                u.el('b', '', meta, label);
                u.el('span', '', meta, value.replaceAll('|', '\n'));
              }
              u.el('hr', '', _c.aside);
              u.el('b', 'description-label', _c.aside, 'Description:');
              u.el('p', 'description-copy', _c.aside, 'A general introduction to the natural world, with illustrations of common plants, animals, and landscapes.');
              const shell = _c.shell || content.parentElement;
              const head = shell.querySelector('.head');
              const brand = u.el('div', 'library-brand', head);
              brand.innerHTML = `<svg viewBox="0 0 90 80" aria-hidden="true"><g stroke="#531024" stroke-width="2"><path d="M8 53 51 43 81 52 39 65 8 58Z" fill="#5a1025"/><path d="M10 59 39 68 82 55 82 68 39 79 10 68Z" fill="#fbf5e8"/><path d="M10 63 39 73 79 61M13 67 39 76 79 65" fill="none"/><path d="M8 34 48 24 79 34 37 47 8 40Z" fill="#5a1025"/><path d="M10 41 37 50 80 37 80 50 37 62 10 51Z" fill="#fbf5e8"/><path d="M13 46 37 54 77 42M13 50 37 58 77 47" fill="none"/><path d="M10 14 50 3 82 13 40 26 10 20Z" fill="#5a1025"/><path d="M12 21 40 30 81 17 81 29 40 42 12 31Z" fill="#fbf5e8"/><path d="M15 25 40 34 78 22M15 30 40 38 78 27" fill="none"/></g></svg><div><strong>Riverton Public Library</strong><span>C A T A L O G</span></div>`;
              const search = u.el('div', 'library-search', head);
              u.el('b', '', search, 'Search Catalog:');
              const field = u.el('input', '', search); field.value = 'natural history'; field.setAttribute('aria-label', 'Search catalog');
              u.el('button', '', search, 'Search');
              const links = u.el('div', '', search);
              for (const label of ['Advanced Search', 'Browse Subjects']) { const a = u.el('a', '', links, label); a.href = '#'; a.onclick = (e) => e.preventDefault(); }
              const results = u.el('section', 'catalog-results', content);
              u.el('h3', '', results, 'Search Results');
              const table = u.el('table', '', results);
              const header = u.el('tr', '', u.el('thead', '', table));
              for (const text of ['Title', 'Year']) u.el('th', '', header, text);
              const tbody = u.el('tbody', '', table);
              for (const [title, year] of [['A Field Guide to North American Birds','1988'],['Trees of the Eastern Forest','1991'],['The Nature Handbook','1985'],['Rivers and Their Life','1990'],['Insects of the Meadow','1987'],['Coastal Wildlife','1992'],['Forest Ecosystems','1989'],['Our National Parks','1986'],['The Living Earth','1991'],['Animal Tracks','1984'],['Plant Life Illustrated','1990'],['Wetlands and Wildlife','1988']]) {
                const tr = u.el('tr', title === 'The Nature Handbook' ? 'selected' : '', tbody); u.el('td', '', tr, title); u.el('td', '', tr, year);
              }
              const dock = u.el('nav', 'library-dock', shell);
              const paths = ['M3 13 16 2 29 13M7 11V29H13V19H20V29H26V11','M22 21 30 29M25 13A11 11 0 1 1 3 13 11 11 0 0 1 25 13','M29 4H8Q2 4 2 9T8 14H29M29 15H8Q2 15 2 20T8 25H29M8 8H29M8 19H29','M16 2A6 6 0 1 0 16 14 6 6 0 0 0 16 2M4 31V25Q4 16 16 16T28 25V31Z','M3 3H29V29H3ZM7 7H25V12H7ZM7 18H15M7 23H23','M13 5 3 13 13 21V16H26V28H7M3 13H29','M2 5Q9 1 16 5Q23 1 30 5V29Q23 25 16 29Q9 25 2 29ZM16 5V29','M16 1A15 15 0 1 0 16 31 15 15 0 0 0 16 1M11 11Q11 5 17 6T19 16L16 20M16 25V26'];
              ['Home','Search','Catalog','My Account','Check Out','Returns','Reference','Help'].forEach((label, i) => { const b = u.el('button', i === 1 ? 'selected' : '', dock); b.innerHTML = `<svg viewBox="0 0 32 32"><path d="${paths[i]}"/></svg><span>${label}</span>`; });
            }
            if (_c.display === 'panel' && _c.aside) {
              _c.aside.classList.add('panel-mode');
              const card = u.el('section', 'catalog-task-card', _c.aside);
              u.el('h4', '', card, 'Catalog note');
              // Keep the frame's instruction element as the only goal display.
              instruction.classList.add('completion-note', 'panel-instruction');
              card.append(instruction);
              _c.aside.insertBefore(card, _c.aside.querySelector('.catalog-hero'));
            }
            if (_c.display === 'hidden' && _c.aside) _c.aside.classList.add('hidden-mode');
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, shell, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              labelBank = ctx.content && ctx.content.END_LABELS;
            const endLabels = (
              Array.isArray(labelBank) && labelBank.length
                ? labelBank
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
            ((_c.placement = null), (_c.label = null));
            if (!ctx.finish) {
              const common = [endRng.bool(0.5), endRng.bool(0.5), endRng.bool(0.5)].filter(Boolean).length >= 2;
              if (common) {
                _c.placement = 'aside';
                _c.label = 'Apply';
              } else {
                _c.placement = endRng.pick(['footer', 'link']);
                const alternatives = endLabels.filter((x) => String(x).trim().toLowerCase() !== 'apply');
                _c.label = endRng.pick(alternatives.length ? alternatives : endLabels);
              }
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const options = [
                ...new Set(
                  endLabels.filter((x) => String(x).trim().toLowerCase() !== String(_c.label).trim().toLowerCase()),
                ),
              ];
              if (options.length) _c.collide = collideRng.pick(options);
            }
            _c.submit = null;
            const makeSubmit = (parent, cls, text) => {
              const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', _c.label);
              b.title = _c.label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            if (_c.placement === 'aside' && _c.aside) _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            else if (_c.placement === 'footer') _c.submit = makeSubmit(shell, 'submit placed-footer', _c.label);
            else if (_c.placement === 'link') _c.submit = makeSubmit(shell, 'end-link', _c.label + ' ›');
            if (!ctx.finish && _c.aside && (!_c.submit || !_c.submit.isConnected || _c.submit.closest('[hidden]'))) {
              if (_c.submit) _c.submit.remove();
              _c.placement = 'aside';
              _c.label = 'Submit';
              _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            }
            if (_c.collide) {
              const parent = _c.aside || footer;
              const b = u.el('button', 'end-xtra', parent, _c.collide);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
            }
            footer.hidden = true;
            Object.assign(_c, { collideRng, endLabels, endRng, labelBank, makeSubmit });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
