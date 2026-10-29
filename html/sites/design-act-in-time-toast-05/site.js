// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-toast-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-act-in-time-toast-05',
        'brand': 'Account Center',
        'title': 'Account Center',
        'instruction': 'top',
        'rail': 'Account|Overview|Sign-in & Security|Devices|Activity|Personal Info|Notifications|Connected Apps',
        'menu': 'File|Edit|View|Account|Tools|Help',
        'briefTitle': 'Sign-in & Security',
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
              const bar = u.el('div', 'ds-toolbar', _c.nav);
              const icons = [
                '<svg viewBox="0 0 40 40"><path d="M3 19 20 4l17 15-4 4-3-3v16H10V20l-3 3z" fill="#3384cf" stroke="#121820" stroke-width="2.4"/><path d="M16 36V23h8v13" fill="#aed8fb" stroke="#121820" stroke-width="2"/><path d="M4 19 20 4l16 15" fill="none" stroke="#9ed2fa" stroke-width="2"/></svg>',
                '<svg viewBox="0 0 40 40"><circle cx="14" cy="13" r="6" fill="#56a8ea" stroke="#14212c" stroke-width="2"/><circle cx="27" cy="13" r="6" fill="#56a8ea" stroke="#14212c" stroke-width="2"/><path d="M2 31c0-7 5-11 12-11 5 0 8 2 10 5 2-3 6-5 9-5 4 1 6 5 6 11v5H2z" fill="#2c83d4" stroke="#14212c" stroke-width="2"/><path d="M14 21c7 0 11 5 11 14" fill="none" stroke="#a5d8fa" stroke-width="2"/></svg>',
                '<svg viewBox="0 0 40 40"><circle cx="27" cy="12" r="9" fill="#ffd43f" stroke="#171717" stroke-width="2.5"/><circle cx="29" cy="10" r="2" fill="#171717"/><path d="M21 18 6 33l-2-2 1-5 4-1 1-4 4-1 5-5" fill="#f6b716" stroke="#171717" stroke-width="2.5" stroke-linejoin="round"/></svg>',
                '<svg viewBox="0 0 40 40"><path d="M17 2h6l1 5 4 2 4-3 4 5-3 4 1 4 5 2-1 6-5 1-2 4 2 4-5 3-4-4-4 1-2 4h-6l-1-5-4-2-4 3-4-5 3-4-1-4-5-2 1-6 5-1 2-4-2-4 5-3 4 4 4-1z" fill="#398bcd" stroke="#16232d" stroke-width="2"/><circle cx="20" cy="20" r="7" fill="#d7ecfa" stroke="#16232d" stroke-width="2"/></svg>'
              ];
              ['Home', 'Contacts', 'Security', 'Preferences'].forEach((name, i) => {
                const item = u.el('div', 'ds-tool' + (i === 2 ? ' is-selected' : ''), bar);
                const icon = u.el('span', 'ds-tool-icon', item);
                icon.innerHTML = icons[i];
                u.el('span', 'ds-tool-label', item, name);
              });
            }
          },
        'frame.10': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, u } = _c;
            if (!C.rail) return;
            const rail = u.el('aside', 'ds-rail', body);
            const blue = 'fill="#3187ce" stroke="#17212a" stroke-width="2"';
            const icons = [
              `<circle cx="16" cy="9" r="6" ${blue}/><path d="M5 29v-5c0-6 5-9 11-9s11 3 11 9v5z" ${blue}/>`,
              `<circle cx="16" cy="9" r="6" ${blue}/><path d="M5 29v-5c0-6 5-9 11-9s11 3 11 9v5z" ${blue}/>`,
              '<path d="M9 14V9a7 7 0 0 1 14 0v5" fill="none" stroke="#1b2530" stroke-width="3"/><rect x="5" y="14" width="22" height="17" rx="2" fill="#ffcf26" stroke="#161616" stroke-width="2"/><circle cx="16" cy="21" r="2.5" fill="#161616"/><path d="M15 23h2l1 5h-4z" fill="#161616"/>',
              '<rect x="2" y="3" width="28" height="20" rx="1" fill="#3d9ce5" stroke="#17212a" stroke-width="2"/><path d="M5 6h22v14H5z" fill="#b8dcf6"/><path d="M16 23v5M9 29h14" fill="none" stroke="#17212a" stroke-width="2.5"/>',
              '<rect x="4" y="2" width="24" height="29" fill="#c6e4f8" stroke="#17212a" stroke-width="2"/><path d="M8 8h4v4H8zM16 9h8M8 16h4v4H8zM16 17h8M8 24h4v4H8zM16 25h8" fill="none" stroke="#1a4f7d" stroke-width="2"/>',
              '<rect x="2" y="6" width="28" height="23" rx="1" fill="#a7d9f7" stroke="#17212a" stroke-width="2"/><circle cx="10" cy="15" r="3" fill="#f4d2a9" stroke="#17212a"/><path d="M5 24c0-5 10-5 10 0M18 13h9M18 18h9M18 23h6" fill="none" stroke="#17212a" stroke-width="2"/>',
              '<path d="M8 24h16l-2-4V12c0-5-2-8-6-8s-6 3-6 8v8z" fill="#ffca24" stroke="#17212a" stroke-width="2"/><circle cx="16" cy="27" r="3" fill="#f3b310" stroke="#17212a"/>',
              '<path d="M16 4v6M16 10 6 20M16 10l10 10" fill="none" stroke="#17212a" stroke-width="2"/><rect x="12" y="2" width="8" height="8" fill="#61ade2" stroke="#17212a" stroke-width="2"/><rect x="2" y="20" width="9" height="9" fill="#61ade2" stroke="#17212a" stroke-width="2"/><rect x="21" y="20" width="9" height="9" fill="#61ade2" stroke="#17212a" stroke-width="2"/>'
            ];
            C.rail.split('|').forEach((t, i) => {
              const row = u.el('div', '', rail);
              const icon = u.el('span', 'ds-rail-icon', row);
              icon.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true">${icons[i] || icons[0]}</svg>`;
              u.el('span', 'ds-rail-label', row, t);
            });
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
