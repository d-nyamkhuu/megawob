// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-search-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-act-in-time-search-05',
        'brand': 'Product Catalog',
        'title': 'Product Catalog',
        'instruction': 'panel',
        'rail': '',
        'menu': 'File|Edit|View|Products|Tools|Help',
        'briefTitle': 'Task Note',
      },
      parts: {
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { u } = _c;
            _c.nav = null;
            if (C.menu) {
              _c.nav = u.el('nav', 'ds-menu', document.body);
              C.menu.split('|').forEach((t) => u.el('span', '', _c.nav, t));
            }
            const bar = u.el('nav', 'ds-toolbar', document.body);
            const icons = [
              '<path d="M2 11 12 2l10 9h-3v10h-5v-7H9v7H5V11z"/>',
              '<path d="M3 3h10l9 9-10 10L2 12V4a1 1 0 0 1 1-1zm4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>',
              '<path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z"/>',
              '<path d="M2 13h4v9H2zm8-9h4v18h-4zm8 5h4v13h-4z"/>',
              '<path d="M10 1h4l.5 2.5 2.2.9 2.1-1.4 2.8 2.8-1.4 2.1.9 2.2L23 10v4l-2.5.5-.9 2.2 1.4 2.1-2.8 2.8-2.1-1.4-2.2.9L14 23h-4l-.5-2.5-2.2-.9-2.1 1.4-2.8-2.8 1.4-2.1-.9-2.2L1 14v-4l2.5-.5.9-2.2L3 5.2l2.8-2.8 2.1 1.4 2.2-.9zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/>'
            ];
            [['Home'],['Products'],['Categories'],['Reports'],['Settings']].forEach(([label],i) => {
              const item = u.el('span', i === 1 ? 'selected' : '', bar);
              const icon = u.el('b', '', item);
              icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[i]}</svg>`;
              u.el('span', '', item, label);
            });
          },
        'frame.13': () => function (_c) {
          _c.mode = _c.ctx.display === 'panel' ? 'left' : _c.ctx.display === 'header' ? 'top' : _c.ctx.display;
        },
        'frame.17': () => function (_c) {
          const {u, main, mode, briefing} = _c;
          const side = u.el('aside', 'catalog-side', main);
          const tips = u.el('section', 'catalog-tips', side);
          const h = u.el('h2', '', tips);
          h.innerHTML = '<span class="tip-icon">☀</span> Search Tips';
          u.el('p', '', tips, 'Find products quickly using keywords in the search box.');
          const ul = u.el('ul', '', tips);
          ['You can search by product name, category, brand or keyword.', 'Use fewer, broader terms for more results.', "Try different keywords if you don’t see what you need."].forEach(t => u.el('li', '', ul, t));
          const cats = u.el('section', 'catalog-cats', side);
          const ch = u.el('h2', '', cats);
          ch.innerHTML = '<span class="cat-folder">▰</span> Categories';
          const names = ['Musical Instruments','Audio & Electronics','Office Supplies','Home & Garden','Sports & Outdoors','Toys & Games','Books & Media','Arts & Crafts','Health & Personal Care','Tools & Hardware'];
          const glyphs = ['♫','◖','▯','⌂','◉','♠','◧','●','♥','⚒'];
          names.forEach((name,i) => { const row=u.el('div','catalog-cat',cats); u.el('span','',row,glyphs[i]); u.el('span','',row,name); });
          if (mode === 'left' || mode === 'right') {
            const note = briefing(side, 'ds-brief');
            note.classList.add('catalog-note');
            side.insertBefore(note, tips);
          }
        },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, top, u } = _c;
            const er = ctx.rng.fork('chrome/end');
            const labels = (
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x));
            const submitWord = labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0] || 'Submit';
            const classic = er.bool(0.5);
            const placement = classic ? 'footer' : er.pick(['header', 'link']);
            const label = classic ? submitWord : er.pick(labels);
            const cr = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (cr.bool(0.3)) {
              const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (options.length)
                _c.collide = { label: cr.pick(options), where: cr.pick(['header', 'header', 'footer']) };
            }
            const makeEnd = (parent, cls, text, tag = 'button') => {
              const b = u.el(tag, cls, parent, text);
              if (tag === 'button') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              return b;
            };
            const decoy = (parent, text) => {
              const b = u.el('button', 'ds-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
              return b;
            };
            _c.submit = null;
            if (_c.nav && (placement === 'header' || (_c.collide && _c.collide.where === 'header'))) {
              const tools = u.el('span', 'ds-menu-tools', _c.nav);
              if (_c.collide && _c.collide.where === 'header') decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            } else if (_c.collide && _c.collide.where === 'header') {
              const tools = u.el('span', 'ds-menu-tools', _c.nav || top);
              decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            }
            if (_c.collide && _c.collide.where === 'footer') decoy(foot, _c.collide.label);
            if (!ctx.finish && placement === 'footer') _c.submit = makeEnd(foot, 'ds-submit', label);
            if (!ctx.finish && placement === 'link') _c.submit = makeEnd(foot, 'ds-endlink', label + ' ›');
            Object.assign(_c, { classic, cr, decoy, er, label, labels, makeEnd, placement, submitWord });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
      },
    },
  });
})();
