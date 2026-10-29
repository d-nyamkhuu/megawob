// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  function organizerIcon(kind) {
    const shapes = {
      '✉': '<rect x="3" y="7" width="30" height="22" rx="1" fill="url(#gold)" stroke="#75572e"/><path d="m4 8 14 12L32 8M4 28l10-11m18 11L22 17" fill="none" stroke="#896a35"/><path d="m5 8 13 10L31 8" fill="none" stroke="#fff8d6"/>',
      '▤': '<path d="M8 3h17l7 7v23H8z" fill="url(#steel)" stroke="#536679"/><path d="M25 3v8h7M12 9h9m-9 6h16m-16 4h16m-16 4h16m-16 4h16" fill="none" stroke="#65788b"/>',
      '▥': '<path d="M5 23h6v10H5zm11-10h6v20h-6zM27 3h6v30h-6z" fill="url(#blue)" stroke="#294a67"/>',
      '▧': '<rect x="4" y="15" width="28" height="18" rx="3" fill="url(#steel)" stroke="#435b70"/><path d="M4 26h28M13 15v18M23 15v18" fill="none" stroke="#435b70"/><path d="M6 14V7h6v7m3 0V3h6v11m3 0V6h6v8" fill="url(#steel)" stroke="#435b70"/>',
      '♟': '<path d="M11 11a7 8 0 1 1 14 0c0 5-3 6-3 9 0 3 10 3 10 10v3H4v-3c0-7 10-7 10-10 0-3-3-4-3-9" fill="url(#steel)" stroke="#4c6273"/>',
      '▦': '<rect x="5" y="7" width="26" height="26" rx="2" fill="url(#steel)" stroke="#3f5669"/><path d="M5 14h26M12 3v9M24 3v9" stroke="#36566e" stroke-width="3"/><text x="18" y="28" text-anchor="middle" fill="#324857" font-size="17" font-family="Georgia">28</text>',
      '▰': '<path d="M3 11V6h12l4 4h14v23H3z" fill="url(#gold)" stroke="#84632c"/><path d="M4 12h28" stroke="#fff2b9"/>',
    };
    return (
      '<svg viewBox="0 0 36 36" aria-hidden="true"><defs><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#fff4bc"/><stop offset=".5" stop-color="#f0d684"/><stop offset="1" stop-color="#c99c40"/></linearGradient><linearGradient id="steel" x2="0" y2="1"><stop stop-color="#e7f1f7"/><stop offset="1" stop-color="#8da6b9"/></linearGradient><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#a6c9e5"/><stop offset="1" stop-color="#316c9f"/></linearGradient></defs>' +
      (shapes[kind] || shapes['▤']) +
      '</svg>'
    );
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
        document.body.style.removeProperty('--organizer-header-height');
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
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const organizerMenu = util.el('nav', 'organizer-menu', header);
        organizerMenu.setAttribute('aria-label', 'Workspace navigation');
        for (const [icon, label] of [
          ['✉', 'Mail'],
          ['▤', 'Accounts Payable'],
          ['▧', 'Accounts'],
          ['▥', 'Reports'],
          ['♟', 'Contacts'],
          ['▦', 'Calendar'],
          ['▰', 'Documents'],
        ]) {
          const item = util.el('span', 'organizer-menu-item', organizerMenu);
          util.el('span', 'organizer-menu-icon', item).innerHTML = organizerIcon(icon);
          util.el('span', '', item, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { header, organizerMenu });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        header.style.setProperty('--tools-width', `${Math.ceil(headerTools.getBoundingClientRect().width) + 25}px`);
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { display, header, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const summary = util.el('section', 'organizer-summary', body);
        const identity = util.el('div', 'organizer-identity', summary);
        const tree = util.el('div', 'organizer-tree', identity);
        tree.innerHTML =
          '<svg viewBox="0 0 120 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M57 94Q61 75 60 52M59 74L42 59M60 67L78 48M59 61L50 43M61 57L70 37M53 66L37 66M67 57L88 58"/></g><path fill="currentColor" d="M53 95Q57 77 56 61h8q-1 18 4 34z"/><g fill="currentColor"><circle cx="59" cy="14" r="6"/><circle cx="48" cy="18" r="6"/><circle cx="70" cy="18" r="7"/><circle cx="37" cy="25" r="7"/><circle cx="52" cy="28" r="7"/><circle cx="65" cy="29" r="8"/><circle cx="82" cy="27" r="7"/><circle cx="26" cy="37" r="7"/><circle cx="42" cy="40" r="8"/><circle cx="57" cy="42" r="7"/><circle cx="73" cy="41" r="8"/><circle cx="94" cy="38" r="7"/><circle cx="34" cy="53" r="7"/><circle cx="49" cy="54" r="8"/><circle cx="66" cy="55" r="8"/><circle cx="82" cy="52" r="7"/><circle cx="101" cy="49" r="6"/><circle cx="45" cy="14" r="4"/><circle cx="76" cy="12" r="4"/><circle cx="31" cy="31" r="4"/><circle cx="48" cy="36" r="4"/><circle cx="60" cy="22" r="4"/><circle cx="88" cy="31" r="4"/><circle cx="25" cy="45" r="4"/><circle cx="41" cy="47" r="4"/><circle cx="57" cy="48" r="4"/><circle cx="76" cy="34" r="4"/><circle cx="90" cy="47" r="4"/><circle cx="37" cy="61" r="4"/><circle cx="55" cy="62" r="4"/><circle cx="72" cy="63" r="4"/><circle cx="87" cy="59" r="4"/></g></svg>';
        const clusters = [
          [51, 8],
          [62, 7],
          [73, 13],
          [39, 16],
          [52, 19],
          [64, 20],
          [84, 23],
          [29, 27],
          [41, 29],
          [54, 30],
          [70, 30],
          [96, 33],
          [18, 39],
          [31, 40],
          [44, 42],
          [61, 40],
          [78, 41],
          [91, 45],
          [108, 45],
          [14, 52],
          [27, 54],
          [41, 55],
          [55, 53],
          [71, 54],
          [84, 57],
          [99, 58],
          [20, 64],
          [34, 66],
          [48, 65],
          [77, 66],
          [92, 68],
        ];
        const leaves = clusters
          .map(([cx, cy], i) =>
            Array.from({ length: 7 }, (_, k) => {
              const a = k * 2.4;
              return (
                '<ellipse cx="' +
                (cx + Math.cos(a) * 5) +
                '" cy="' +
                (cy + Math.sin(a) * 4) +
                '" rx="3.1" ry="2.2" transform="rotate(' +
                ((i * 29 + k * 53) % 180) +
                ' ' +
                (cx + Math.cos(a) * 5) +
                ' ' +
                (cy + Math.sin(a) * 4) +
                ')"/>'
              );
            }).join(''),
          )
          .join('');
        tree.innerHTML =
          '<svg viewBox="0 0 120 100" aria-hidden="true"><g stroke="currentColor" stroke-width="2" fill="none"><path d="M59 92V26m0 47L32 48m27 14L85 35M58 52L42 25m18 29L71 20M45 62L24 62m47-8 28-5M43 51L22 35"/></g><path fill="currentColor" d="M55 50h6l3 39 10 7H44l11-7z"/><g fill="currentColor">' +
          leaves +
          '</g></svg>';
        util.el('div', 'organizer-company', identity, 'Rivermere Trading Co.');
        util.el('div', 'organizer-motto', identity, 'Quality Goods for a Wider World');
        if (display === 'header') identity.appendChild(header.querySelector('.ref-instruction'));
        const summaryCards = [
          [
            '✉',
            'Mail',
            [
              ['Inbox', '8'],
              ['Sent Items', '3'],
              ['Drafts', '2'],
              ['Deleted Items', '0'],
            ],
          ],
          [
            '▤',
            'Accounts Payable',
            [
              ['Invoices', '12'],
              ['Pending Approval', '3'],
              ['Scheduled Payments', '5'],
              ['Overdue', '1'],
            ],
          ],
          [
            '▥',
            'Accounts',
            [
              ['Total Balance', '$284,620'],
              ['Available Funds', '$125,430'],
              ['Pending Payments', '$18,200'],
              ['Last Reconciled', 'Apr 2, 2010'],
            ],
          ],
        ];
        for (const [icon, title, rows] of summaryCards) {
          const card = util.el('section', 'organizer-card', summary);
          util.el('span', 'organizer-card-icon', card).innerHTML = organizerIcon(icon);
          util.el('strong', 'organizer-card-title', card, title);
          const list = util.el('div', 'organizer-card-rows', card);
          for (const [key, value] of rows) {
            const row = util.el('div', 'organizer-card-row', list);
            util.el('span', '', row, key);
            util.el('span', '', row, value);
          }
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, clusters, identity, leaves, summary, summaryCards, tree });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, summary, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
          summary.appendChild(panel);
          summary.classList.add('has-task-panel');
        }
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, display, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // BeOS desktop frame and fixed utility navigation for this design.
        document.body.classList.add('beos-mail');
        document.body.classList.toggle('beos-header-note', display === 'header');
        const menu = util.el('div', 'beos-menu', document.body);
        for (const item of ['File', 'Edit', 'View', 'Message', 'Accounts', 'Tools', 'Window', 'Help'])
          util.el('span', '', menu, item);
        const toolbar = util.el('div', 'beos-toolbar', body);
        for (const [icon, label] of [
          ['✉', 'New'],
          ['↶', 'Reply'],
          ['↶', 'Reply All'],
          ['➜', 'Forward'],
          ['▤', 'Delete'],
          ['▧', 'Print'],
          ['☑', 'Mark Read'],
        ]) {
          const item = util.el('div', 'beos-tool', toolbar);
          util.el('span', 'beos-tool-icon', item, icon);
          util.el('span', '', item, label);
        }
        Object.assign(_c, { menu, stage, toolbar });
      },
  };

  env.site({
    name: 'design-avoid-phishing-attachment-02',
    template: 'site/base',
    design: { parts },
  });
})();
