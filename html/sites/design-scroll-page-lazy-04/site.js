// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const ICONS = {
    cloud:
      '<path d="M15 31C5 33 1 19 10 15 7 4 21-1 27 7 35 0 43 6 43 10 58 7 64 29 49 31 45 39 34 39 30 35 23 43 14 39 15 31Z"/>',
    search: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
    home: '<path d="m3 11 9-8 9 8-3 0v10h-5v-7h-3v7H6V11Z"/>',
    accounts:
      '<path d="M6 2h12v20h3v2H3v-2h3Z" fill="currentColor" stroke="none"/>' +
      [5, 9, 13]
        .map((y) =>
          [9, 14]
            .map((x) => `<rect x="${x}" y="${y}" width="2" height="2" fill="var(--sf-icon-hole,#fff)" stroke="none"/>`)
            .join(''),
        )
        .join('') +
      '<path d="M10 24v-6h4v6" fill="var(--sf-icon-hole,#fff)" stroke="none"/>',
    contacts: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-4a8 8 0 0 1 16 0v4Z"/>',
    crown:
      '<path d="m3 7 4 5 5-8 5 8 4-5-3 12H6ZM6 22h12"/><circle cx="2" cy="5" r="1"/><circle cx="12" cy="2" r="1"/><circle cx="22" cy="5" r="1"/>',
    chart:
      '<path d="M3 22h19"/><rect x="5" y="10" width="3" height="9" fill="currentColor" stroke="none"/><rect x="11" y="3" width="3" height="16" fill="currentColor" stroke="none"/><rect x="17" y="7" width="3" height="12" fill="currentColor" stroke="none"/>',
    gauge: '<path d="M2 20a10 10 0 0 1 20 0M12 20l6-9"/>',
    gear:
      '<circle cx="12" cy="12" r="8" fill="currentColor" stroke="none"/>' +
      Array.from(
        { length: 8 },
        (_, i) =>
          `<rect x="10" y="0" width="4" height="7" rx=".5" transform="rotate(${i * 45} 12 12)" fill="currentColor" stroke="none"/>`,
      ).join('') +
      '<circle cx="12" cy="12" r="4" fill="white" stroke="none"/>',
    bell: '<path d="M5 17h14l-2-3V8a5 5 0 0 0-10 0v6Zm5 4h4"/>',
    print: '<path d="M6 8V2h12v6M6 17H3V8h18v9h-3M6 13h12v9H6Zm11-2h1"/>',
    share:
      '<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="4" r="2.5"/><circle cx="19" cy="20" r="2.5"/><path d="m7 11 10-6M7 13l10 6"/>',
    report: '<path d="M4 2h16v20H4Zm4 5h8M8 11h6m-6 4h4"/>',
    calendar: '<path d="M3 5h18v17H3Zm0 4h18M7 2v6m10-6v6m-9 7 3 3 5-6"/>',
  };

  function icon(util, parent, name, cls) {
    const span = util.el('span', `sf-icon sf-icon-${name} ${cls || ''}`, parent);
    span.innerHTML = `<svg viewBox="0 0 ${name === 'cloud' ? '64 44' : '24 24'}" aria-hidden="true">${ICONS[name] || ICONS.report}</svg>`;
    return span;
  }

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
        if (kind === 'cookie') util.el('span', 'sf-cookie-icon', box, '🍪');
        if (kind === 'promo') {
          const art = util.el('div', 'sf-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 280 440" aria-hidden="true"><rect width="280" height="440" rx="12" fill="#a7def5"/><path d="M0 260 66 178l57 61 64-86 93 110v177H0Z" fill="#6cb9de"/><path d="m0 260 66-82 57 61-35-17-22-22-23 29-16 1Z" fill="#f3fbff"/><path d="m123 239 64-86 58 69-33-17-25-31-24 42-18-3Z" fill="#f3fbff"/><path d="M0 348q75-80 140-25t140-30v147H0Z" fill="#278d50"/><path d="M0 401q100-82 167-32t113-10v81H0Z" fill="#147342"/><g fill="#08794f"><path d="m18 270-26 99h52Zm50 37-35 107h70Zm149-93-42 154h84Z"/><path d="m247 282-30 105h60Z" fill="#095d43"/></g><g transform="translate(69 68) scale(2.2)" fill="#009de0"><path d="M15 31C5 33 1 19 10 15 7 4 21-1 27 7 35 0 43 6 43 10 58 7 64 29 49 31 45 39 34 39 30 35 23 43 14 39 15 31Z"/></g></svg>';
          util.el('h2', 'sf-promo-title', box, 'Stay in the Loop');
          util.el(
            'p',
            'sf-promo-description',
            box,
            'Get the latest Salesforce news, product updates, and helpful tips delivered to your inbox.',
          );
          const email = util.el('input', 'sf-promo-email', box);
          email.type = 'text';
          email.placeholder = 'you@company.com';
          email.setAttribute('aria-label', 'Email address');
        }
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
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        if (kind === 'promo') {
          dismiss.classList.add('sf-promo-close');
          dismiss.title = dismiss.textContent;
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
          dismiss.textContent = '×';
        }
        if (kind === 'banner') {
          const helpbar = document.querySelector('.sf-helpbar');
          el.style.top = `${Math.max(56, helpbar ? helpbar.getBoundingClientRect().bottom : 56)}px`;
        }
        if (kind === 'chat') {
          const head = util.el('div', 'sf-chat-head', el);
          icon(util, head, 'cloud');
          util.el('strong', '', head, 'Salesforce Assistant');
          head.append(dismiss);
          el.prepend(head);
          const actions = util.el('div', 'sf-chat-actions', el);
          ['Find help articles', 'Contact support', 'Give product feedback'].forEach((label) => {
            const button = util.el('button', '', actions, label);
            button.type = 'button';
            button.addEventListener('click', () => env.log('overlay-click', { label }));
          });
          const compose = util.el('div', 'sf-chat-compose', el);
          util.el('span', '', compose, 'Type a message...');
          util.el('b', '', compose, '➤');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        for (const [k, v] of Object.entries({
          bg: '#e5eef5',
          panel: '#ffffff',
          fg: '#0b2145',
          muted: '#59677e',
          line: '#d4e1ec',
          accent: '#0070f5',
        }))
          root.style.setProperty(`--${k}`, v);
        root.dataset.theme = 'light';
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'icon', 'link']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        if (!word && rng.fork('lightning/end-label').bool(0.55)) label = 'OK';
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        if (collide && !word && label !== 'Finish task') collide.text = 'Finish task';
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const appBrand = util.el('div', 'sf-app-brand', header);
        icon(util, appBrand, 'cloud');
        util.el('span', '', appBrand, 'Sales');
        const globalSearch = util.el('div', 'sf-global-search', header);
        icon(util, globalSearch, 'search');
        util.el('span', '', globalSearch, 'Search Salesforce...');
        const profile = util.el('div', 'sf-profile', header);
        util.el('span', 'sf-question', profile, '?');
        icon(util, profile, 'bell');
        util.el('span', 'sf-profile-avatar', profile, 'JD');
        util.el('span', 'sf-profile-name', profile, 'Jamie Diaz');
        util.el('span', '', profile, '⌄');
        S.frameBrand(_c, header);
        Object.assign(_c, { appBrand, globalSearch, header, profile });
      },
    'frame.controls': (base, S) =>
      function (_c) {
        const { ctx, label, util } = _c;
        const decoyBtn = (parent, text, collides) => {
          const b = util.el('button', 'ref-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.dataset.collide = collides ? 'true' : 'false';
          b.addEventListener('click', () =>
            env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
          );
        };
        const endBtn = (parent, cls, text) => {
          const b = util.el(cls === 'ref-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
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
        Object.assign(_c, { decoyBtn, endBtn });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(headerTools, 'ref-endlink', `${label} ›`);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        // Salesforce-style dashboard remains visible around the floating help window.
        const leftDash = util.el('aside', 'sf-dashboard sf-dashboard-left', body);
        const statCard = (parent, title, value, detail) => {
          const card = util.el('section', 'sf-card', parent);
          util.el('div', 'sf-card-title', card, title);
          util.el('div', 'sf-card-value', card, value);
          util.el('a', 'sf-card-link', card, detail);
        };
        statCard(leftDash, 'My Open Opportunities', '12', 'View All');
        statCard(leftDash, 'My Accounts', '8', 'View All');
        const chart = util.el('section', 'sf-card sf-chart', leftDash);
        util.el('div', 'sf-card-title', chart, 'Pipeline by Stage');
        const graph = util.el('div', 'sf-chart-graph', chart);
        const ticks = util.el('div', 'sf-chart-ticks', graph);
        ['200', '150', '100', '50', '0'].forEach((x) => util.el('span', '', ticks, x));
        const bars = util.el('div', 'sf-chart-bars', graph);
        ['Prospecting', 'Qualification', 'Proposal', 'Closed'].forEach((x, i) => {
          const bar = util.el('div', 'sf-chart-bar', bars);
          util.el('i', '', bar).style.height = `${[75, 45, 62, 34][i]}%`;
          util.el('span', '', bar, x);
        });
        const records = util.el('section', 'sf-card sf-records', leftDash);
        util.el('div', 'sf-card-title', records, 'Latest Records');
        [
          ['accounts', 'Acme Corporation', 'Account'],
          ['crown', 'Global Media', 'Opportunity'],
          ['contacts', 'West Coast Territory', 'Territory'],
          ['report', 'Q2 Forecast', 'Report'],
          ['calendar', 'Product Demo', 'Event'],
        ].forEach(([ico, title, kind]) => {
          const row = util.el('div', 'sf-record-line', records);
          icon(util, row, ico, `sf-record-icon sf-${ico}`);
          const text = util.el('div', '', row);
          util.el('a', '', text, title);
          util.el('small', '', text, kind);
        });
        const rightDash = util.el('aside', 'sf-dashboard sf-dashboard-right', body);
        const tasks = util.el('section', 'sf-card sf-tasks', rightDash);
        util.el('div', 'sf-card-title', tasks, "Today's Tasks");
        [
          'Call Acme Corp',
          'Follow up with Global Media',
          'Send proposal',
          'Update opportunity',
          'Prep for demo',
        ].forEach((x, i) => {
          const row = util.el('div', 'sf-task-line', tasks);
          util.el('span', 'sf-checkbox', row);
          util.el('a', '', row, x);
          util.el('small', '', row, i < 2 ? 'Today' : i === 4 ? 'Apr 25' : 'Apr 24');
        });
        util.el('a', 'sf-card-link', tasks, 'View All Tasks');
        const events = util.el('section', 'sf-card sf-events', rightDash);
        util.el('div', 'sf-card-title', events, 'Upcoming Events');
        [
          ['24', 'Product Demo', '10:00 AM – 11:00 AM', 'Office'],
          ['25', 'Team Sync', '2:00 PM – 3:00 PM', 'Conference Room B'],
        ].forEach(([day, title, time, place]) => {
          const row = util.el('div', 'sf-event-line', events);
          const date = util.el('div', 'sf-event-date', row);
          util.el('small', '', date, 'APR');
          util.el('span', '', date, day);
          const text = util.el('div', '', row);
          util.el('a', '', text, title);
          util.el('span', '', text, time);
          util.el('span', '', text, place);
        });
        util.el('a', 'sf-card-link', events, 'View All Events');
        const chatter = util.el('section', 'sf-card sf-chatter', rightDash);
        util.el('div', 'sf-card-title', chatter, 'Recent Chatter');
        [
          ['MK', 'Maria Keller', 'Great progress on Q2!', '2h ago'],
          ['CN', 'Colin Ngo', 'Shared a file', '4h ago'],
          ['SL', 'Sarah Lee', 'Looking forward to the demo.', '5h ago'],
        ].forEach(([initials, title, message, time]) => {
          const row = util.el('div', 'sf-chatter-line', chatter);
          util.el('span', 'sf-chatter-avatar', row, initials);
          const text = util.el('div', '', row);
          util.el('a', '', text, title);
          util.el('span', '', text, message);
          util.el('small', '', text, time);
        });
        S.frameSidebar(_c, body);
        Object.assign(_c, {
          bars,
          body,
          chart,
          chatter,
          events,
          graph,
          leftDash,
          records,
          rightDash,
          statCard,
          tasks,
          ticks,
        });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, header, lr, rightDash, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
          rightDash.prepend(panel);
        }
        const helpWindow = util.el('section', 'sf-window', body);
        const helpbar = util.el('div', 'sf-helpbar', helpWindow);
        icon(util, helpbar, 'cloud');
        util.el('strong', 'sf-window-name', helpbar, 'Help Center');
        const instruction = header.querySelector('.ref-instruction');
        if (instruction) helpbar.append(instruction);
        const search = util.el('div', 'sf-help-search', helpbar);
        icon(util, search, 'search');
        util.el('span', '', search, 'Search help articles...');
        const windowBody = util.el('div', 'sf-window-body', helpWindow);
        const topics = util.el('aside', 'sf-topics', windowBody);
        util.el('div', 'sf-topic-all', topics, 'All Help Topics');
        [
          'Getting Started',
          'Account Management',
          'Sales',
          'Service',
          'Marketing',
          'Reports & Dashboards',
          'Mobile',
          'Integrations',
          'Data Management',
          'Security',
          'Billing',
          'Troubleshooting',
        ].forEach((text, i) => {
          const row = util.el('div', `sf-topic${i === 0 ? ' selected' : ''}`, topics);
          util.el('span', '', row, text);
          util.el('span', 'sf-chevron', row, '›');
        });
        const main = util.el('div', 'sf-window-main', windowBody);
        const intro = util.el('article', 'sf-intro', main);
        const crumbs = util.el('div', 'sf-crumbs', intro);
        util.el('a', '', crumbs, 'Help Center');
        util.el('span', '', crumbs, '›');
        util.el('span', '', crumbs, 'Getting Started');
        const articleTools = util.el('div', 'sf-article-tools', crumbs);
        icon(util, articleTools, 'print');
        icon(util, articleTools, 'share');
        util.el('h1', '', intro, 'Getting Started with Salesforce');
        util.el(
          'p',
          'sf-welcome',
          intro,
          'Welcome to Salesforce! This section will help you get familiar with the basics, from setting up your account to using key features like accounts, contacts, and opportunities.',
        );
        const popular = util.el('section', 'sf-popular', intro);
        util.el('h2', '', popular, 'Popular Articles');
        [
          ['Log in to Salesforce', 'Learn how to access your Salesforce account.'],
          ['Navigate the Home Page', 'Get an overview of the Salesforce Home Page and main features.'],
          ['Update Your Profile', 'Personalize your settings, notification preferences, and more.'],
          ['Use the Global Search', 'Find accounts, contacts, opportunities, and more.'],
        ].forEach(([title, desc]) => {
          const row = util.el('div', 'sf-popular-row', popular);
          util.el('a', '', row, title);
          util.el('span', '', row, desc);
          util.el('b', '', row, '›');
        });
        const browse = util.el('section', 'sf-browse', intro);
        util.el('h2', '', browse, 'Browse by Topic');
        const cards = util.el('div', 'sf-topic-cards', browse);
        [
          ['contacts', 'Accounts & Contacts', 'Learn how to manage your accounts and contacts.'],
          ['crown', 'Opportunities', 'Work with opportunities throughout your sales process.'],
          ['chart', 'Reports & Dashboards', 'Create and customize reports and dashboards.'],
          ['gear', 'Personal Settings', 'Update your profile, preferences, and additional settings.'],
        ].forEach(([ico, title, desc]) => {
          const card = util.el('div', 'sf-topic-card', cards);
          icon(util, card, ico, `sf-${ico}`);
          util.el('a', '', card, title);
          util.el('p', '', card, desc);
        });
        const guides = util.el('section', 'sf-guides', intro);
        util.el('h2', '', guides, 'How-To Guides');
        const guideCards = util.el('div', 'sf-guide-cards', guides);
        ['Set Up Your Workspace', 'Manage Customer Relationships', 'Explore Salesforce'].forEach((x) =>
          util.el('div', '', guideCards, x),
        );
        const stage = util.el('main', 'ref-stage', main);
        Object.assign(_c, {
          articleTools,
          browse,
          cards,
          crumbs,
          guideCards,
          guides,
          helpWindow,
          helpbar,
          instruction,
          intro,
          main,
          popular,
          search,
          stage,
          topics,
          windowBody,
        });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        }
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, ctx, display, endBtn, header, headerTools, label, main, placement, stage, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const dock = util.el('nav', 'sf-bottom-dock', document.body);
        [
          ['home', 'Home'],
          ['accounts', 'Accounts'],
          ['contacts', 'Contacts'],
          ['crown', 'Opportunities'],
          ['chart', 'Reports'],
          ['gauge', 'Dashboards'],
          ['more', 'More'],
        ].forEach(([ico, text], i) => {
          const tab = util.el('div', i === 0 ? 'sf-dock-item active' : 'sf-dock-item', dock);
          if (ico === 'more') util.el('span', 'sf-more-icon', tab, '•••');
          else icon(util, tab, ico);
          util.el('span', '', tab, text);
        });
        const secondaryTools = util.el('div', 'sf-secondary-tools', main);
        for (const button of headerTools.querySelectorAll('.ref-xtra')) {
          if (ctx.finish || button.dataset.collide !== 'true') secondaryTools.append(button);
        }

        // This design is a simple university help page. Reuse the task stage and frame
        // controls above, but arrange them as a traditional two-column document.
        const taskStage = stage;
        const taskPanel = body.querySelector('.ref-panel');
        const taskNote = header.querySelector('.ref-instruction');
        header.replaceChildren();
        body.replaceChildren();
        const top = util.el('div', 'uni-top', header);
        const mast = util.el('div', 'uni-masthead', top);
        const globe = util.el('span', 'uni-globe', mast);
        globe.innerHTML =
          '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><radialGradient id="uni-ocean" cx="30%" cy="24%" r="78%"><stop offset="0" stop-color="#68e5ff"/><stop offset=".48" stop-color="#0788e8"/><stop offset="1" stop-color="#063caa"/></radialGradient><linearGradient id="uni-land" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#86ff43"/><stop offset="1" stop-color="#00a93d"/></linearGradient><clipPath id="uni-sphere"><circle cx="24" cy="24" r="21.5"/></clipPath></defs><circle cx="24" cy="24" r="22.5" fill="url(#uni-ocean)" stroke="#06439e" stroke-width="1"/><g clip-path="url(#uni-sphere)" fill="url(#uni-land)" stroke="#078a36" stroke-width=".45"><path d="M7 13 11 8l6-2 4 3 5 1 1 4-4 2-2 4-4 1-2 4-4-2-1-4-4-2z"/><path d="m18 25 4 1 3 4-1 5-3 4-1 6-3-2-1-6-3-5 1-4z"/><path d="m26 12 4-3 5 1 2 3 5 1 3 4-2 4-4-1-2 3-4-2-2-4-5-1z"/><path d="m29 21 5 1 3 4-2 7-4 6-3-3-1-6-3-5z"/><path d="m39 30 4-1 4 3-1 5-5 2-3-3z"/></g><ellipse cx="16" cy="11" rx="11" ry="5" fill="#fff" opacity=".14" transform="rotate(-29 16 11)"/><path d="M8 25c2 10 9 17 18 19" fill="none" stroke="#9ceaff" stroke-opacity=".36" stroke-width="1"/></svg>';
        util.el('strong', '', mast, 'Riverton University');
        const navline = util.el('nav', 'uni-nav', top);
        ['Home', 'About', 'Admissions', 'Academics', 'Campus Life', 'Help'].forEach((label) => {
          const a = util.el('a', '', navline, label);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
        });
        headerTools.classList.add('uni-tools');
        top.append(headerTools);
        if (display === 'header') header.append(taskNote || util.el('div', 'ref-instruction', header, ctx.instruction));
        const sidebarIndex = util.el('aside', 'uni-sidebar', body);
        util.el('h2', '', sidebarIndex, 'Help Articles');
        const indexItems = [
          'All Topics',
          'Getting Started',
          'Your Account',
          'Registration',
          'Classes and Programs',
          'Tuition and Fees',
          'Financial Aid',
          'Housing',
          'Dining',
          'Campus Services',
          'Computing and IT',
          'Library',
          'Health and Safety',
          'Student Life',
          'Policies',
          'Contact Help Desk',
        ];
        indexItems.forEach((label, i) => {
          const a = util.el('a', i === 9 ? 'uni-selected' : '', sidebarIndex, label);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'sidebar', label });
          });
        });
        if (display === 'panel' && taskPanel) sidebarIndex.prepend(taskPanel);
        const contentArea = util.el('main', 'uni-content', body);
        const uniIntro = util.el('article', 'sf-intro uni-article', contentArea);
        const universityCrumbs = util.el('div', 'uni-crumbs', uniIntro);
        ['Home', 'Help', 'Campus Services'].forEach((label, i) => {
          if (i) util.el('span', '', universityCrumbs, '>');
          const a = util.el('a', '', universityCrumbs, label);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'breadcrumb', label });
          });
        });
        util.el('h1', '', uniIntro, 'Campus Services');
        util.el(
          'p',
          'uni-lede',
          uniIntro,
          'Find answers to common questions about the services and resources available on campus, including dining, housing, transportation, mail, and more.',
        );
        util.el('hr', '', uniIntro);
        util.el('h2', '', uniIntro, 'About Campus Services');
        util.el(
          'p',
          '',
          uniIntro,
          'Riverton University offers a wide range of services to support students, faculty, and staff. This section brings together help articles about everyday campus resources, with step-by-step guidance and useful contact information.',
        );
        util.el('h2', '', uniIntro, 'Featured Topics');
        const featured = util.el('ul', 'uni-featured', uniIntro);
        ['Dining on Campus', 'Campus Housing', 'Getting Around Campus', 'Mail and Deliveries'].forEach((label) => {
          const li = util.el('li', '', featured);
          const a = util.el('a', '', li, label);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'topic', label });
          });
        });
        contentArea.append(taskStage);
        taskStage.style.justifyContent = 'flex-start';
        taskStage.style.alignItems = 'flex-start';
        const dockNode = document.querySelector('.sf-bottom-dock');
        if (dockNode) dockNode.remove();
        if (secondaryTools) secondaryTools.remove();
        Object.assign(_c, {
          contentArea,
          dock,
          dockNode,
          featured,
          globe,
          indexItems,
          mast,
          navline,
          secondaryTools,
          sidebarIndex,
          submit,
          taskNote,
          taskPanel,
          taskStage,
          top,
          uniIntro,
          universityCrumbs,
        });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { stage } = _c;
        S.frameAlign(_c, stage);
      },
  };

  env.site({
    name: 'design-scroll-page-lazy-04',
    template: 'site/base',
    design: { parts },
  });
})();
