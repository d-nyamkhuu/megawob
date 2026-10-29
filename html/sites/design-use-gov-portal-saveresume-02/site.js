// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-gov-portal-saveresume-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, rng } = _c;
            _c.placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
          },
        'frame.34': (base, S) =>
          function (_c) {
            const { K, TITLES } = S;
            const { content, header, local, nav, rng, util, word } = _c;
            const titlebar = util.el('div', 'gov-titlebar', header);
            const icon = (parent, path, cls = '') => {
              const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              svg.setAttribute('viewBox', '0 0 24 24');
              svg.setAttribute('fill', 'none');
              svg.setAttribute('stroke', 'currentColor');
              svg.setAttribute('stroke-width', '1.8');
              svg.setAttribute('stroke-linecap', 'round');
              svg.setAttribute('stroke-linejoin', 'round');
              svg.setAttribute('class', `civic-icon ${cls}`);
              svg.setAttribute('aria-hidden', 'true');
              const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              shape.setAttribute('d', path);
              svg.append(shape);
              parent.append(svg);
              return svg;
            };
            if (_c.display !== 'header' || nav) {
              const title = rng.pick(TITLES);
              const brand = util.el('div', 'ref-brand', titlebar, 'Rivermere City Council');
              brand.dataset.role = 'brand';
            }
            if (!titlebar.querySelector('.ref-brand')) util.el('div', 'ref-brand', titlebar, 'Rivermere City Council');
            const councilBrand = titlebar.querySelector('.ref-brand');
            const leaf = icon(
              councilBrand,
              'M8 20C3 20 2 15 2 9c5 0 8 1 10 4M7 22C6 11 12 4 23 3c0 11-5 16-12 15M8 20l10-11',
              'civic-leaf',
            );
            councilBrand.prepend(leaf);
            if (nav) {
              const n = util.el('nav', 'ref-nav', titlebar);
              const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
              const councilNav = ['Home', 'Benefits & Support', 'Housing', 'Council Tax', 'Services', 'My Account'];
              for (const [index, sampled] of navItems.entries()) {
                const item = word ? sampled : councilNav[index % councilNav.length];
                const a = util.el('a', 'ref-navlink', n, item);
                a.dataset.role = 'nav';
                a.addEventListener('click', (e) => {
                  e.preventDefault();
                  env.log('decoy', { what: 'nav', label: item });
                });
              }
            }
            Object.assign(_c, { councilBrand, icon, leaf, titlebar });
          },
        'frame.35': () => () => {},
        'frame.37': (base, S) =>
          function (_c) {
            const { header, icon, util } = _c;
            const menu = util.el('nav', 'gov-menubar', header);
            for (const item of ['File', 'Edit', 'View', 'Applications', 'Tools', 'Help'])
              util.el('span', '', menu, item);
            const toolbar = util.el('div', 'gov-toolbar', header);
            const quick = util.el('div', 'gov-quick-actions', toolbar);
            for (const [ico, label, active] of [
              ['M14 3H5v18h14V8l-5-5Zm0 0v5h5', 'New Application', false],
              ['M3 7V4h6l2 3h10v13H3V7Zm0 4h18', 'Open Saved', false],
              ['M4 3h14l3 3v15H4V3Zm4 0v6h9V3M8 14h9m-9 3h9', 'Open review', true],
              ['M6 9V3h12v6M6 18H3v-8h18v8h-3M6 14h12v7H6v-7Z', 'Print', false],
            ]) {
              const b = util.el('button', `gov-quick${active ? ' selected' : ''}`, quick);
              b.type = 'button';
              b.dataset.role = 'xtra';
              icon(b, ico, 'gov-quick-icon');
              util.el('span', '', b, label);
              b.addEventListener('click', () => env.log('decoy', { label }));
            }
            const decoyBtn = (parent, text, collides) => {
              const b = util.el('button', 'ref-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () =>
                env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
              );
            };
            Object.assign(_c, { decoyBtn, menu, quick, toolbar });
          },
        'frame.40': (base, S) =>
          function (_c) {
            const { toolbar, util } = _c;
            const headerTools = util.el('div', 'ref-tools', toolbar);
            Object.assign(_c, { headerTools });
          },
        'frame.46': (base, S) =>
          function (_c) {
            const { K } = S;
            const { body, content, icon, local, menu, rng, sidebar, util } = _c;
            const rail = util.el('nav', 'gov-rail', body);
            for (const [i, item] of [
              'Home',
              'My Applications',
              'Messages',
              'Appointments',
              'Guidance',
              'Settings',
            ].entries()) {
              const a = util.el('a', `gov-rail-item${i === 1 ? ' active' : ''}`, rail);
              a.href = '#';
              a.addEventListener('click', (e) => {
                e.preventDefault();
                env.log('decoy', { what: 'nav', label: item });
              });
              icon(
                a,
                [
                  'M3 11l9-8 9 8M5 10v11h5v-7h4v7h5V10',
                  'M5 2h10l4 4v16H5V2Zm10 0v5h4M8 11h8m-8 4h8m-8 3h6',
                  'M3 5h18v14H3V5Zm0 1 9 7 9-7',
                  'M4 5h16v16H4V5Zm0 5h16M8 2v6m8-6v6M8 14h1m6 0h1m-8 4h1m6 0h1',
                  'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6m0-10h.01',
                  'M10 2h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1 1-3Zm6 10a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z',
                ][i],
                'gov-rail-icon',
              );
              util.el('span', '', a, item);
            }
            if (sidebar) {
              const services = util.el('details', 'gov-services-menu', menu);
              const original = [...menu.children].find((el) => el !== services && el.textContent === 'Applications');
              if (original) original.replaceWith(services);
              util.el('summary', '', services, 'Applications');
              const side = util.el('div', 'gov-services-list', services);
              for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
                const a = util.el('a', 'ref-sidelink', side, item);
                a.dataset.role = 'nav';
                a.addEventListener('click', (e) => {
                  e.preventDefault();
                  env.log('decoy', { what: 'sidebar', label: item });
                });
              }
            }
            Object.assign(_c, { rail });
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
        'frame.71': () => () => {},
        'frame.76': (base, S) =>
          function (_c) {
            const { closeLabel, ctx, titlebar, util } = _c;
            if (_c.display === 'toast') {
              const note = util.el('div', 'ref-note', titlebar);
              util.el('div', 'ref-note-text', note, ctx.instruction);
              const x = util.el('button', 'ref-note-x', note, '×');
              x.type = 'button';
              x.setAttribute('aria-label', closeLabel);
              x.addEventListener('click', () => {
                note.style.visibility = 'hidden';
                env.log('note-close');
              });
            }
          },
        'overlay.9': (base, S) =>
          function (_c) {
            const { K } = S;
            const { box, ctx, el, kind, rng, row, util, word } = _c;
            const btn = (label, how, primary) => {
              if (word && K.button[label]) label = word(K.button[label]);
              const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
              b.type = 'button';
              b.addEventListener('click', () => {
                if (how) {
                  ctx.dismiss(how);
                } else env.log('overlay-click', { label });
              });
              return b;
            };
            if (kind === 'cookie') {
              if (rng.bool(0.5)) btn('Settings', null, false);
              btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
              _c.dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
            } else if (kind === 'promo') {
              const title = util.el('h2', 'civic-promo-title', box, 'Stay informed about Rivermere');
              box.prepend(title);
              const illustration = util.el('div', 'civic-promo-art', box, '✉');
              box.prepend(illustration);
              const email = util.el('input', 'civic-newsletter-input', box);
              email.type = 'text';
              email.placeholder = 'your.email@example.com';
              email.setAttribute('aria-label', 'Email for council updates');
              const optin = util.el('label', 'civic-newsletter-optin', box);
              const check = util.el('input', '', optin);
              check.type = 'checkbox';
              util.el('span', '', optin, 'Yes, I would like to receive updates from Rivermere City Council.');
              box.append(row);
              _c.dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
              btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
            } else if (kind === 'banner') {
              _c.dismiss = btn('Dismiss', 'close', false);
            } else {
              if (kind === 'chat') {
                const heading = util.el('h3', 'civic-chat-heading', el, 'Chat with us');
                el.prepend(heading);
                const options = util.el('div', 'civic-chat-options', el);
                for (const label of ['Get help with this application', 'Check eligibility', 'Speak to an advisor']) {
                  const option = util.el('button', '', options, label);
                  option.type = 'button';
                  option.addEventListener('click', () => env.log('overlay-click', { label }));
                }
                const message = util.el('input', 'civic-chat-input', el);
                message.type = 'text';
                message.placeholder = 'Type a message…';
                message.setAttribute('aria-label', 'Chat message');
              }
              _c.dismiss = btn('×', 'close', false);
              _c.dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
            }
            Object.assign(_c, { btn });
          },
        'overlay.10': () => () => {},
        'overlay.11': () => () => {},
      },
    },
  });
})();
