// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      if (kind === 'chat') util.el('strong', 'bank-chat-title', box, 'Harborview Support');
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
      if (kind === 'chat') {
        const options = util.el('div', 'bank-chat-options', box);
        for (const text of ['Help with a transfer', 'Account questions', 'Something else']) {
          const b = util.el('button', 'ref-ov-btn', options, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('overlay-click', { label: text }));
        }
        util.el('div', 'bank-chat-compose', box, 'Type a message…');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const desktop = util.el('div', 'bank-window', document.body);
      const leftPane = util.el('aside', 'bank-sidebar', desktop);
      const titlebar = util.el('div', 'bank-titlebar', desktop);
      util.el('span', 'bank-title-icon', titlebar, '▦');
      util.el('strong', '', titlebar, 'Rivermark Bank');
      const windowControls = util.el('div', 'bank-window-controls', titlebar);
      for (const mark of ['−', '□', '×']) util.el('span', '', windowControls, mark);
      const menu = util.el('nav', 'bank-menubar', desktop);
      for (const item of ['File', 'Edit', 'View', 'Transfers', 'Payments', 'Accounts', 'Tools', 'Help']) util.el('span', '', menu, item);
      const traffic = util.el('div', 'bank-traffic', leftPane);
      for (const color of ['red', 'yellow', 'green']) util.el('i', `bank-dot ${color}`, traffic);
      const paths = {
        search: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 6 6',
        Home: 'M3 10 12 3l9 7M5 9v12h14V9M9 21v-8h6v8',
        Accounts: 'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm-1 5h18M7 14h4',
        Transfers: 'M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4',
        'Bill Pay': 'M4 5h16v16H4V5Zm4-3v6m8-6v6M4 10h16M8 14h2m4 0h2m-8 4h2',
        Cards: 'M3 5h18v15H3V5Zm0 5h18M7 16h4',
        Transactions: 'M8 5h13M8 12h13M8 19h13M3 5h.1M3 12h.1M3 19h.1',
        Insights: 'M3 15h4v6H3v-6Zm7-5h4v11h-4V10Zm7-7h4v18h-4V3Z',
        Support: 'M21 11a9 9 0 0 1-9 9c-2 0-3-.4-4-1l-6 2 2-6a9 9 0 1 1 17-4Z',
        Settings: 'm10 2 4 0 1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1 1-3Zm2 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
        'One-time transfer': 'M4 12h16m-6-7 7 7-7 7',
        'Recurring transfer': 'M21 10a9 9 0 1 0-1 8M21 3v7h-7',
        'External accounts': 'm2 8 10-6 10 6H2Zm3 3v8m7-8v8m7-8v8M3 22h18M2 19h20',
        cart: 'M2 3h3l3 13h12l2-10H6m3 7h11M9 21h.1M18 21h.1',
        coffee: 'M5 7h12v13H5V7Zm12 2h3a4 4 0 0 1-3 8M8 3v1m5-1v1',
      };
      const icon = (parent, name) => {
        const svg = util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, parent);
        util.svg('path', { d: paths[name] || paths['External accounts'] }, svg);
      };
      const search = util.el('div', 'bank-search', leftPane);
      icon(search, 'search');
      util.el('span', '', search, 'Search');
      const logo = util.el('div', 'bank-logo', leftPane);
      util.el('span', 'bank-mark', logo);
      util.el('strong', '', logo, 'Harborview Bank');
      const sideNav = util.el('nav', 'bank-sidenav', leftPane);
      for (const [icon, item] of [['⌂','Home'],['▤','Accounts'],['⇄','Transfers'],['▣','Bill Pay'],['▱','Cards'],['☷','Transactions'],['▥','Insights']]) {
        const a = util.el('a', `bank-side-link${item === 'Transfers' ? ' selected' : ''}`, sideNav);
        const glyph = util.el('span', 'bank-side-icon', a); 
        const svg = util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, glyph);
        util.svg('path', { d: paths[item] }, svg); util.el('span', '', a, item);
      }
      const sideBottom = util.el('div', 'bank-side-bottom', leftPane);
      for (const [icon, item] of [['◉','Support'],['⚙','Settings']]) {
        const a = util.el('a', 'bank-side-link', sideBottom);
        const glyph = util.el('span', 'bank-side-icon', a);
        const svg = util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, glyph);
        util.svg('path', { d: paths[item] }, svg); util.el('span', '', a, item);
      }
      const header = util.el('header', 'ref-task', desktop);
      S.frameBrand(_c, header);
      Object.assign(_c, { desktop, header, icon, leftPane, logo, paths, search, sideBottom, sideNav, traffic });
    },
    'frame.nav': (base, S) => function (_c) {
      const { header, util } = _c;
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Home', 'Transfer', 'Pay Bills', 'Scheduled', 'Cards', 'Activity']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
    },
    'frame.body': (base, S) => function (_c) {
      const { desktop, icon, util } = _c;
      const body = util.el('div', 'ref-body', desktop);
      const inspector = util.el('aside', 'bank-inspector', body);
      util.el('h3', '', inspector, 'Accounts');
      const account = (title, balance, selected) => {
        const card = util.el('div', `bank-account${selected ? ' current' : ''}`, inspector);
        util.el('div', '', card, `${title}  •${selected ? '8930' : '8856'}`); util.el('strong', '', card, balance);
        util.el('small', '', card, 'Available balance');
      };
      account('Everyday checking', '$4,218.62', true);
      account('Reserve savings', '$12,480.17', false);
      util.el('hr', '', inspector);
      util.el('h3', '', inspector, 'Account details');
      util.el('div', 'bank-detail-name', inspector, 'Everyday checking  •8930');
      for (const [key, value] of [['Account number','•••• 8930'],['Account type','Checking'],['Routing number','021000021']]) {
        const row = util.el('div', 'bank-detail', inspector); util.el('span','',row,key); util.el('span','',row,value);
      }
      util.el('a', 'bank-view', inspector, 'View account details');
      util.el('hr', '', inspector);
      const recent = util.el('div', 'bank-recent-title', inspector);
      util.el('h3','',recent,'Recent transactions');
      util.el('a','',recent,'View all');
      const columns = util.el('div','bank-transaction bank-transaction-head',inspector);
      for (const label of ['Date ▾','Description','Account','Category','Amount']) util.el('span','',columns,label);
      for (const [glyph, color, date, name, detail, amount] of [['cart','#d9f7ec','Mar 10, 2015','Whole Foods Market','Groceries','-$68.24'],['bank','#deedff','Mar 9, 2015','Rivermark Credit Card Payment','Transfers','-$250.00'],['coffee','#eee3ff','Mar 8, 2015','AT&T Wireless','Bills & Utilities','-$102.17'],['bank','#deedff','Mar 6, 2015','Direct Deposit – Acme Corp','Income','$1,845.00'],['cart','#d9f7ec','Mar 4, 2015','Shell Oil','Transportation','-$45.60']]) {
        const row = util.el('div','bank-transaction',inspector); const badge=util.el('span',`bank-transaction-icon ${glyph}`,row); badge.style.background=color; icon(badge, glyph);
        util.el('span','bank-transaction-date',row,date);
        const desc=util.el('div','bank-transaction-desc',row); util.el('span','',desc,name); util.el('small','',desc,detail);
        util.el('span','bank-transaction-account',row,'Everyday Checking •5262');
        util.el('span','bank-transaction-category',row,detail);
        const val=util.el('div','bank-transaction-val',row); util.el('span','',val,amount); util.el('small','',val,date);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { account, body, inspector, recent });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, inspector, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        inspector.prepend(panel);
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, paths, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Transfers landing view behind the recurring-transfer sub-window.
      // These are presentation-only elements; task anchors and seeded content remain untouched.
      const landing = util.el('div', 'bank-landing', body);
      util.el('h1', '', landing, 'Transfers');
      util.el('p', '', landing, 'Move money between your accounts or to others.');
      const transferNav = util.el('nav', 'bank-transfer-nav', landing);
      for (const [icon, label] of [['→', 'One-time transfer'], ['◌', 'Recurring transfer'], ['♙', 'External accounts']]) {
        const item = util.el('div', `bank-transfer-item${label === 'Recurring transfer' ? ' active' : ''}`, transferNav);
        const glyph = util.el('span', 'bank-transfer-icon', item);
        const svg = util.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, glyph);
        util.svg('path', { d: paths[label] }, svg);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { landing, stage, transferNav });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, desktop, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        if (tools.childElementCount) desktop.classList.add('bank-has-footer');
        else foot.remove();
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-bank-schedule-05',
    template: 'site/base',
    design: { parts },
  });
})();
