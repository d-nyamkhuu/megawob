// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const assetBase = new URL('.', document.currentScript.src);

  const assetUrl = (name) => new URL(`assets/${name}`, assetBase).href;

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
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
          document.querySelector('.ref-task').after(el);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'Riverton Borough Council');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          const councilNav = ['My Applications', 'New Application', 'Evidence', 'Messages', 'My Details'];
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
        // A complete row of civic-service tabs is permanent homepage frame.
        if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand', header, 'Riverton Borough Council');
        const serviceTabs = header.querySelector('.ref-nav') || util.el('nav', 'ref-nav', header);
        for (const item of ['My Applications', 'New Application', 'Evidence', 'Messages', 'My Details'].slice(
          serviceTabs.children.length,
        )) {
          const tab = util.el('a', 'ref-navlink', serviceTabs, item);
          tab.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        }
        Object.assign(_c, { header, serviceTabs });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        S.frameSidebar(_c, body);
        const home = util.el('aside', 'ref-home-nav', body);
        const civicIcons = {
          'Home':
            '<path fill="#af754d" d="M3 14 16 2l13 12-3 3L16 8 6 17Z"/><path fill="#f9e8b1" d="M7 15v15h18V15l-9-8Z"/><path fill="#7397c3" d="M13 19h6v11h-6Z"/><path fill="white" d="M9 15h4v4H9m10-4h4v4h-4"/>',
          'Housing':
            '<path fill="#c3834f" d="m2 15 14-13 14 13-4 3L16 8 6 18Z"/><path fill="#f7d97d" d="M7 16v14h18V16l-9-8Z"/><path fill="#729bcc" d="M13 21h6v9h-6Z"/>',
          'Council Services':
            '<path fill="#f8f0cb" d="M4 12h24v18H4Z"/><path fill="#bbc6d5" d="M2 30h28v-3H2m3-15h22L16 5Zm8-6h6V1h-6Z"/><path fill="#e4c265" d="M8 15h4v12H8m12-12h4v12h-4m-6-4h4v7h-4Z"/>',
          'Benefits & Support':
            '<path fill="#fbc34e" d="M12 10a5 5 0 1 0 10 0 5 5 0 1 0-10 0M3 13a4 4 0 1 0 8 0 4 4 0 1 0-8 0m19 1a4 4 0 1 0 8 0 4 4 0 1 0-8 0"/><path fill="#6cb8df" d="M1 29v-6a6 6 0 0 1 12 0v6m7 0v-6a6 6 0 0 1 12 0v6Z"/><path fill="#f5b848" d="M9 30v-8a8 8 0 0 1 16 0v8Z"/>',
          'Council Tax':
            '<path fill="#f7cc24" d="M3 17v10c0 5 15 5 15 0V17Zm11-11v15c0 5 15 5 15 0V6Z"/><ellipse fill="#ffdf42" cx="21.5" cy="6" rx="7.5" ry="3.5"/><ellipse fill="#ffdf42" cx="10.5" cy="17" rx="7.5" ry="3.5"/><path d="M3 22c3 3 12 3 15 0m-15 4c3 3 12 3 15 0m-4-15c3 3 12 3 15 0m-15 5c3 3 12 3 15 0"/>',
          'Environment':
            '<path fill="#946529" d="M13 19h6v12h-6Z"/><path fill="#5f8d20" d="M5 25c-7-1-3-10 1-11-3-6 3-9 6-8 0-8 13-6 13 2 7 1 8 8 3 11 5 8-6 11-11 7-5 3-9 1-12-1Z"/>',
          'Transport':
            '<rect fill="#74b2d5" x="5" y="3" width="23" height="25" rx="4"/><path fill="#fff4cb" d="M8 8h17v10H8Z"/><path d="M16 8v10M2 10h3m23 0h3"/><path fill="#333" d="M7 27h4v4H7m15-4h4v4h-4"/><path fill="#f2d055" d="M9 21h3v3H9m12-3h3v3h-3Z"/>',
          'Leisure & Culture':
            '<path fill="#e9ba38" d="m2 5 14-2 1 18c-5 10-13 5-13-1Z"/><path fill="#df5d6b" d="m17 8 13 3-3 18c-7 7-14-1-13-7Z"/><path fill="#111" d="m6 9 4-1 1 3-4 1Zm6-1 3-1 1 3-3 1Zm7 7 3 1-1 3-3-1m6 0 3 1-1 3-3-1"/><path d="M7 19q4 5 8-1m3 7q4-4 8 0"/>',
          'News & Events':
            '<rect fill="#fffbed" x="3" y="3" width="26" height="27" rx="1"/><path fill="#7ba6bf" d="M6 7h8v9H6Z"/><path d="M18 7h8m-8 4h8m-8 5h8M6 21h20M6 25h20"/>',
          'Contact Us':
            '<rect fill="#e9eff6" x="2" y="6" width="29" height="23" rx="1"/><path d="m3 7 13 12L30 7M3 28l9-13m18 13-9-13"/>',
        };
        for (const [icon, label] of [
          ['⌂', 'Home'],
          ['♜', 'Council Services'],
          ['♟', 'Benefits & Support'],
          ['⌂', 'Housing'],
          ['¢', 'Council Tax'],
          ['♣', 'Environment'],
          ['▣', 'Transport'],
          ['♬', 'Leisure & Culture'],
          ['▤', 'News & Events'],
          ['✉', 'Contact Us'],
        ]) {
          const row = util.el('div', 'ref-home-link', home);
          const badge = util.el('span', 'ref-home-icon', row);
          badge.innerHTML =
            '<svg viewBox="0 0 34 34" aria-hidden="true" fill="none" stroke="#111827" stroke-width="1.6" stroke-linejoin="round">' +
            civicIcons[label] +
            '</svg>';
          util.el('span', '', row, label);
        }
        const town = util.el('div', 'ref-home-town', home);
        const townPhoto = util.el('img', 'ref-home-photo', town);
        townPhoto.src = assetUrl('town-river.jpg');
        townPhoto.alt = 'Riverton riverside and town church';
        util.el('strong', '', town, 'Riverton');
        util.el('span', '', town, 'Our town');
        util.el('span', '', town, 'Our community');
        util.el('span', '', town, 'Our future');
        Object.assign(_c, { body, civicIcons, home, town, townPhoto });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const promo = util.el('aside', 'ref-promo', body);
        const taskCard = body.querySelector('.ref-panel');
        if (taskCard) promo.prepend(taskCard);
        const council = util.el('section', 'ref-promo-card ref-promo-council', promo);
        util.el('h2', '', council, 'Riverton Borough Council');
        util.el('div', 'ref-promo-copy', council, 'People\nServices\nA Cleaner\nGreener Town');
        const councilPhoto = util.el('img', 'ref-promo-photo', council);
        councilPhoto.src = assetUrl('council-garden-v2.webp');
        councilPhoto.alt = 'Flowers and historic Riverton buildings';
        const popular = util.el('section', 'ref-promo-card ref-promo-popular', promo);
        util.el('h2', '', popular, 'Popular Links');
        const popularList = util.el('ul', 'ref-popular-list', popular);
        for (const label of [
          'Apply for Council Housing',
          'Report a Street Problem',
          'Rubbish and Recycling',
          'Library Services',
          'Parks and Open Spaces',
        ])
          util.el('span', 'ref-promo-link', util.el('li', '', popularList), label);
        const help = util.el('section', 'ref-promo-card ref-promo-help', promo);
        util.el('h2', '', help, 'Need Help?');
        const phone = util.el('div', 'ref-promo-phone', help);
        const phoneIcon = util.el('span', 'ref-help-phone', phone);
        phoneIcon.innerHTML =
          '<svg viewBox="0 0 48 45" fill="#0575ac" stroke="#091520" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6 17c-7-1-4-13 3-14 8-3 23-3 30 1 7 3 9 12 3 14l-8-1-1-8H15l-1 8Z"/><path d="M14 14h20l7 26H7Z"/><path fill="#9fc7dc" d="M17 15h14v6H17Z"/><circle cx="24" cy="29" r="9" fill="#b4c4c9"/><circle cx="24" cy="29" r="4" fill="#234e6e"/><path d="M11 42h27M7 7l8 2m18 0 8-2M6 12l8 2m20 0 9-2"/></svg>';
        util.el('span', '', phone, 'Riverton Direct\n01788 655 300');
        util.el('div', 'ref-promo-copy', help, 'Mon – Fri 9am – 5pm');
        const community = util.el('section', 'ref-promo-card ref-promo-community', promo);
        util.el('h2', '', community, 'In the Community');
        const marketPhoto = util.el('img', 'ref-promo-photo', community);
        marketPhoto.src = assetUrl('market.jpg');
        marketPhoto.alt = 'Market stalls on Riverton High Street';
        util.el('div', 'ref-promo-link', community, 'Riverton Market');
        util.el('div', 'ref-promo-copy', community, 'Every Saturday\nRiverton High Street');
        Object.assign(_c, {
          community,
          council,
          councilPhoto,
          help,
          marketPhoto,
          phone,
          phoneIcon,
          popular,
          popularList,
          promo,
          stage,
          taskCard,
        });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-gov-portal-saveresume-04',
    template: 'site/base',
    design: { parts },
  });
})();
