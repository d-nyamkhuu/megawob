// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
        const end = document.querySelector('[data-role="submit"]');
        const endRect = end && end.getBoundingClientRect();
        const bottomReserve =
          endRect && endRect.top > window.innerHeight * 0.65 ? window.innerHeight - endRect.top + 12 : 0;
        if (kind === 'banner') el.style.top = `${headerBottom}px`;
        if (kind === 'promo') {
          el.style.top = `${headerBottom}px`;
          el.style.bottom = `${bottomReserve}px`;
        }
        if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${Math.max(18, bottomReserve)}px`;
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'cookie') util.el('span', 'ref-ov-symbol', box, '🍪');
        if (kind === 'promo') {
          const illustration = util.el('div', 'ref-promo-art', box);
          illustration.innerHTML =
            '<svg viewBox="0 0 160 160" aria-hidden="true"><path d="M12 64 80 18l68 46v82H12Z" fill="#006bff"/><path d="m37 30 84-6 6 87-84 6Z" fill="#edf1f4" stroke="#bcc8d3" stroke-width="3"/><path d="m51 49 54-4m-52 19 54-4m-53 19 46-3" stroke="#bac5ce" stroke-width="6"/><path d="m12 65 68 49 68-49v82H12Z" fill="#0875ff"/></svg>';
          util.el('h2', 'ref-promo-title', box, 'Stay in the know');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const input = util.el('input', 'ref-promo-email', box);
          input.type = 'text';
          input.placeholder = 'Enter your email address';
          input.setAttribute('aria-label', 'Email address');
          const close = util.el('button', 'ref-promo-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
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
        root.style.setProperty('--bg', '#ffffff');
        root.style.setProperty('--panel', '#ffffff');
        root.style.setProperty('--fg', '#101216');
        root.style.setProperty('--muted', '#526071');
        root.style.setProperty('--line', '#d7dce1');
        root.style.setProperty('--accent', '#f12918');
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, ctx, display, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        // Preserve the reference frame's seeded draws even though this design uses fixed tabs.
        if (display !== 'header' || nav) rng.pick(TITLES);
        if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const title = util.el('div', 'carbon-title', header);
        util.el('span', 'carbon-app-icon', title, '▣');
        util.el('strong', '', title, 'Support Center');
        util.el('span', 'carbon-window-controls', title, '−　□　×');
        const menu = util.el('nav', 'carbon-menu', header);
        for (const item of ['File', 'Edit', 'View', 'Case', 'Tools', 'Actions', 'Help']) util.el('span', '', menu, item);
        const bar = util.el('div', 'carbon-toolbar', header);
        for (const [icon, item] of [['＋','New Case'],['✉','Reply'],['➜','Forward'],['▤','Add Note'],['▦','Schedule'],['☎','Call'],['●','Chat'],['✉','Email'],['⌁','Attach'],['▾','More']]) {
          const b = util.el('button', 'carbon-tool', bar);
          b.type = 'button';
          util.el('b', '', b, icon); util.el('span', '', b, item);
        }
        const n = menu;
        const search = bar;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        Object.assign(_c, { header, n, search });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          // Consume the original sidebar draws; this design uses only the tab navigation.
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        }
        let taskPanel = null;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          taskPanel = panel;
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          rng.bool(0.5);
        }
        const list = util.el('aside', 'carbon-cases', body);
        util.el('h2', '', list, 'Cases ▾');
        const find = util.el('div', 'carbon-find', list, 'Search cases　⌕');
        const tabs = util.el('div', 'carbon-case-tabs', list);
        for (const t of ['Open (24)','Pending (6)','On Hold (3)','Closed']) util.el('span', '', tabs, t);
        const th = util.el('div', 'carbon-case-row carbon-case-head', list);
        for (const t of ['Case #','Subject','Requester','Updated']) util.el('span', '', th, t);
        const rows = [
          ['CASE-8149','Cannot access account','Patricia Gomez','Apr 14, 2009'],['CASE-8148','Reset email password','Daniel Park','Apr 14, 2009'],['CASE-8147','Invoice approval issue','Laura Chen','Apr 14, 2009'],['CASE-8146','Add user to mailing list','Michael Torres','Apr 13, 2009'],['CASE-8145','Payment not issued',"James O’Neil",'Apr 13, 2009'],['CASE-8144','Calendar permission','Susan Patel','Apr 13, 2009'],['CASE-8143','Error opening document','Robert Kim','Apr 13, 2009'],['CASE-8142','Unable to sign in','Linda Murphy','Apr 12, 2009'],['CASE-8141','Accounts payable query','Mark Davis','Apr 12, 2009'],['CASE-8140','Request for new account','Angela Wright','Apr 12, 2009'],['CASE-8139','Email delivery failure','Thomas Gray','Apr 11, 2009'],['CASE-8138','Vendor payment status','Karen Holt','Apr 11, 2009'],['CASE-8137','Access to shared folder','Steven Price','Apr 10, 2009'],['CASE-8136','Update contact details','Rachel Green','Apr 10, 2009'],['CASE-8135','Problem with attachment','Kevin Wilson','Apr 10, 2009'],['CASE-8134','Set up conference room','Amy Brooks','Apr 9, 2009'],['CASE-8133','Distribution list change','Brian Scott','Apr 9, 2009'],['CASE-8132','Unable to print invoice','Melissa Carter','Apr 8, 2009']
        ];
        for (let i=0;i<rows.length;i++) { const row=util.el('div', `carbon-case-row${i===0?' selected':''}`, list); for(const v of rows[i]) util.el('span','',row,v); }
        Object.assign(_c, { body, taskPanel, carbonList:list });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, taskPanel, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        if (taskPanel) stage.append(taskPanel);
        Object.assign(_c, { stage });
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.instruction': (base, S) => function (_c) {},
    'frame.panel': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-avoid-phishing-callback-05',
    template: 'site/base',
    design: { parts },
  });
})();
