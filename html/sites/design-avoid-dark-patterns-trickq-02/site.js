// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, header, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // Wrenfield Mart's fixed account rail and page furniture. The task widget remains
        // responsible for the live form and its anchors; these elements are decorative.
        const rail = util.el('aside', 'wm-rail', document.body);
        util.el('div', 'wm-logo', rail, 'Wrenfield\nMart');
        const railItems = ['Home', 'Shop', 'Deals', 'My Account', 'Orders', 'Lists', 'Support'];
        for (const item of railItems) {
          const a = util.el('a', `wm-link${item === 'My Account' ? ' active' : ''}`, rail, item);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        }
        const hero = util.el('div', 'wm-hero', stage);
        const heroWords = util.el('div', 'wm-hero-words', hero);
        util.el('strong', '', heroWords, 'Wrenfield Mart');
        util.el('em', '', heroWords, 'More of What You Need. Every Day.');
        util.el('div', 'wm-box-art', hero, 'Wrenfield\nMart  🛒');
        util.el('div', 'wm-slogan', hero, 'GREAT CHOICES\nLOWER PRICES\nBRIGHTER DAYS');
        const sidePanel = util.el('aside', 'wm-sidepanels', stage);
        util.el('h2', 'wm-panel-head', sidePanel, 'Account Benefits');
        const benefits = [
          ['🛒', 'Faster checkout', 'Save your details for a quicker, easier way to shop.'],
          ['🚚', 'Track your orders', 'See the latest status at a glance.'],
          ['▤', 'Manage your lists', 'Keep your favourites in one place.'],
          ['⚙', 'Update preferences', 'Control your communication settings anytime.'],
        ];
        for (const [icon, title, copy] of benefits) {
          const row = util.el('div', 'wm-benefit', sidePanel);
          util.el('span', 'wm-benefit-icon', row, icon);
          const words = util.el('div', '', row);
          util.el('strong', '', words, title);
          util.el('span', '', words, copy);
        }
        util.el('h2', 'wm-panel-head wm-recent-head', sidePanel, 'Recent Accounts');
        const recent = util.el('div', 'wm-recent', sidePanel);
        util.el(
          'div',
          'wm-row wm-table-head',
          recent,
          'Date                         Name                                      Status',
        );
        for (const line of [
          'Apr 12, 2000     Parker, Elise                     Active',
          'Apr 10, 2000     Nguyen, Daniel                 Active',
          'Apr 08, 2000     Ross, Patricia                  Pending',
          'Apr 07, 2000     Chen, Marcus                    Active',
          'Apr 06, 2000     Wilson, Heather               Active',
          'Apr 05, 2000     Patel, Sandeep                 Active',
          'Apr 03, 2000     Brooks, Amanda             Active',
          'Apr 01, 2000     Garcia, Luis                    Pending',
        ]) {
          util.el('div', 'wm-row', recent, line);
        }

        // Office 2008 account frame. The existing page furniture above remains in the
        // DOM for its seeded frame draws, but is visually replaced by this design.
        const drawIcon = (parent, name, cls) => {
          const paths = {
            overview:
              '<rect x="8" y="5" width="31" height="38" rx="2"/><path d="M14 13h19M14 19h19M14 25h19M14 31h11"/><path d="M4 10h4M4 18h4M4 26h4M4 34h4"/>',
            orders:
              '<rect x="8" y="8" width="31" height="35" rx="3"/><path d="M16 5h15v8H16zM14 20h18M14 27h18M14 34h13"/><path d="M4 11h4M4 19h4M4 27h4"/>',
            mail: '<rect x="4" y="9" width="40" height="29" rx="3"/><path d="m5 12 19 15 19-15M5 36l13-12M43 36 30 24"/>',
            home: '<path d="m4 22 20-17 20 17v20H29V29H19v13H4z"/><path d="M16 42V28h16v14"/>',
            card: '<rect x="4" y="9" width="40" height="30" rx="4"/><path d="M4 17h40M10 30h13M10 34h8"/>',
            person: '<circle cx="24" cy="15" r="9"/><path d="M8 43c1-10 7-15 16-15s15 5 16 15z"/>',
            lock: '<rect x="8" y="20" width="32" height="25" rx="3"/><path d="M15 20v-7a9 9 0 0 1 18 0v7M24 29v8"/><circle cx="24" cy="28" r="2"/>',
            help: '<circle cx="24" cy="24" r="20"/><path d="M17 17a7 7 0 0 1 14 1c0 5-7 6-7 12M24 36v1"/>',
            gift: '<path d="M6 20h36v24H6zM3 14h42v9H3zM24 14c-12 0-14-10-7-10 5 0 7 10 7 10zm0 0c12 0 14-10 7-10-5 0-7 10-7 10zM24 14v30"/>',
            phone: '<rect x="12" y="3" width="24" height="42" rx="4"/><path d="M16 9h16v27H16zM21 40h6"/>',
            people:
              '<circle cx="24" cy="13" r="7"/><circle cx="9" cy="20" r="5"/><circle cx="39" cy="20" r="5"/><path d="M11 43c0-10 4-17 13-17s13 7 13 17zM2 42c0-8 2-13 8-14M46 42c0-8-2-13-8-14"/>',
            leaf: '<path d="M23 43C8 38 4 25 7 8c13 0 23 4 25 16-5-6-10-9-17-10 8 5 12 11 13 19 6-15 14-22 20-24-1 16-7 29-25 34z"/>',
            basket: '<path d="M5 18h38l-5 25H11zM15 18l9-13M33 18 24 5M15 24v13M24 24v13M33 24v13"/>',
            search: '<circle cx="20" cy="20" r="13"/><path d="m30 30 13 13"/>',
            heart: '<path d="M24 42 7 25C-3 12 13 2 24 14 35 2 51 12 41 25z"/>',
          };
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 48 48');
          svg.setAttribute('class', cls);
          svg.setAttribute('aria-hidden', 'true');
          svg.innerHTML = `<defs><linearGradient id="office-blue" x2="0" y2="1"><stop stop-color="#91c9f5"/><stop offset="1" stop-color="#2878b9"/></linearGradient><linearGradient id="office-green" x2="0" y2="1"><stop stop-color="#9bbb88"/><stop offset="1" stop-color="#456d4c"/></linearGradient></defs><g fill="url(#office-blue)" stroke="#28649a" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">${paths[name]}</g>`;
          parent.appendChild(svg);
          return svg;
        };
        const titlebar = util.el('div', 'office-titlebar', header);
        drawIcon(titlebar, 'leaf', 'office-leaf');
        util.el('span', 'office-title', titlebar, 'Larkspur Goods - My Account');
        const winBtns = util.el('div', 'office-window-buttons', titlebar);
        for (const [label, glyph, cls] of [
          ['Minimize', '−', 'min'],
          ['Maximize', '□', 'max'],
          ['Close', '×', 'close'],
        ]) {
          const b = util.el('button', `office-win ${cls}`, winBtns, glyph);
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
        }
        const tabs = util.el('div', 'office-tabs', header);
        for (const [label, active] of [
          ['Home', true],
          ['Shop', false],
          ['My Account', false],
          ['Help', false],
        ]) {
          const b = util.el('button', `office-tab${active ? ' active' : ''}`, tabs, label);
          b.type = 'button';
        }
        const ribbon = util.el('div', 'office-ribbon', header);
        const groups = [
          [
            ['overview', 'Account Overview'],
            ['orders', 'Orders'],
            ['mail', 'Communication Preferences', true],
            ['home', 'Address Book'],
            ['card', 'Payment Methods'],
          ],
          [
            ['person', 'View Profile'],
            ['lock', 'Security Settings'],
          ],
          [
            ['help', 'Help Centre'],
            ['mail', 'Contact Us'],
          ],
        ];
        for (const [gi, items] of groups.entries()) {
          const g = util.el('div', 'office-group', ribbon);
          for (const [icon, label, active] of items) {
            const b = util.el('button', `office-command${active ? ' active' : ''}`, g);
            b.type = 'button';
            drawIcon(b, icon, 'office-command-icon');
            util.el('span', 'office-command-label', b, label);
          }
          util.el('span', 'office-group-caption', g, ['Account', 'Manage', 'Support'][gi]);
        }
        const accountSide = util.el('aside', 'office-account-side', body);
        const brand = util.el('div', 'office-brand', accountSide);
        drawIcon(brand, 'leaf', 'office-brand-leaf');
        const brandText = util.el('div', '', brand);
        util.el('strong', '', brandText, 'Larkspur Goods');
        util.el('small', '', brandText, 'Home · Style · For a Brighter Everyday');
        const accountLinks = [
          ['person', 'Account Overview'],
          ['orders', 'Orders'],
          ['mail', 'Communication Preferences'],
          ['home', 'Address Book'],
          ['card', 'Payment Methods'],
          ['lock', 'Security Settings'],
        ];
        for (const [iconName, label] of accountLinks) {
          const a = util.el(
            'a',
            `office-account-link${label === 'Communication Preferences' ? ' active' : ''}`,
            accountSide,
          );
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
          drawIcon(a, iconName, 'office-side-icon');
          util.el('span', '', a, label);
        }
        const summary = util.el('section', 'office-summary', accountSide);
        const taskPanel = Array.from(body.children).find((node) => node.classList.contains('ref-panel'));
        if (taskPanel) accountSide.insertBefore(taskPanel, summary);
        const extraNav = Array.from(body.children).find((node) => node.classList.contains('ref-side'));
        if (extraNav) accountSide.appendChild(extraNav);
        util.el('h3', '', summary, 'Account summary');
        for (const [k, v] of [
          ['Total orders', '12'],
          ['Saved items', '7'],
          ['Reward points', '320'],
          ['Newsletter status', 'Subscribed'],
        ]) {
          const row = util.el('div', 'office-summary-row', summary);
          util.el('span', '', row, k);
          util.el('span', '', row, v);
        }
        const benefitsPanel = util.el('aside', 'office-benefits', body);
        util.el('h2', '', benefitsPanel, 'Why we stay in touch');
        for (const [iconName, title, copy] of [
          ['mail', 'Special offers', 'Be the first to know about new arrivals and exclusive deals.'],
          ['gift', 'Personalised content', 'Recommendations based on what you love.'],
          ['phone', 'Text updates', 'Get offers and reminders on the go.'],
          ['people', 'Partner offers', 'Selected brands we think you’ll like.'],
        ]) {
          const row = util.el('div', 'office-benefit', benefitsPanel);
          drawIcon(row, iconName, 'office-benefit-icon');
          const words = util.el('div', '', row);
          util.el('strong', '', words, title);
          util.el('span', '', words, copy);
        }
        const dock = util.el('nav', 'office-dock', document.body);
        for (const [iconName, label, active] of [
          ['home', 'Home', false],
          ['search', 'Shop', false],
          ['basket', 'Basket (0)', false],
          ['heart', 'Saved Items (7)', false],
          ['person', 'My Account', true],
        ]) {
          const a = util.el('a', `office-dock-item${active ? ' active' : ''}`, dock);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
          drawIcon(a, iconName, 'office-dock-icon');
          util.el('span', '', a, label);
        }
        Object.assign(_c, {
          accountLinks,
          accountSide,
          benefits,
          benefitsPanel,
          brand,
          brandText,
          dock,
          drawIcon,
          groups,
          hero,
          heroWords,
          rail,
          railItems,
          recent,
          ribbon,
          sidePanel,
          stage,
          summary,
          tabs,
          titlebar,
          winBtns,
        });
      },
  };

  env.site({
    name: 'design-avoid-dark-patterns-trickq-02',
    template: 'site/base',
    design: { parts },
  });
})();
