// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const TITLES = ['Relayboard'];

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
        if (kind === 'cookie') {
          const cookie = util.el('span', 'relay-cookie-icon', el);
          cookie.innerHTML =
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27 13a7 7 0 0 1-8-9C3-1-5 19 8 28c12 8 25-3 19-15Z" fill="#e8aa58" stroke="#574025" stroke-width="1.5"/><g fill="#75502a"><circle cx="9" cy="13" r="2"/><circle cx="15" cy="20" r="2"/><circle cx="22" cy="23" r="1.5"/><circle cx="8" cy="22" r="1.5"/><circle cx="18" cy="12" r="1.5"/></g></svg>';
          el.prepend(cookie);
        }
        if (kind === 'chat') {
          const title = util.el('div', 'relay-chat-title', el, 'Chat with us');
          title.appendChild(dismiss);
          el.prepend(title);
          const entry = util.el('div', 'relay-chat-entry', el);
          const input = util.el('input', '', entry);
          input.placeholder = 'Type a message…';
          input.setAttribute('aria-label', 'Chat message');
          const send = util.el('button', 'ref-ov-btn', entry, 'Send');
          send.type = 'button';
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send' }));
        }
        if (kind === 'promo') {
          const art = util.el('div', 'relay-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="85" cy="85" r="68" fill="#abc8ff"/><circle cx="140" cy="28" r="13" fill="#b6cfff"/><circle cx="32" cy="155" r="10" fill="#c6daff"/><path d="M32 55h116v82H32Z" fill="#e3ecff" stroke="#253354" stroke-width="3"/><path d="m34 58 56 46 56-46M34 134l39-40m73 40-39-40" fill="none" stroke="#253354" stroke-width="3"/></svg>';
          box.prepend(art);
          const title = util.el('h2', 'relay-promo-title', box, 'Stay in the loop');
          box.insertBefore(title, box.querySelector('.ref-ov-text'));
          const input = util.el('input', 'relay-promo-email', box);
          input.placeholder = 'Your email address…';
          input.setAttribute('aria-label', 'Your email address');
          box.insertBefore(input, row);
          const x = util.el('button', 'relay-promo-close', box, '×');
          x.type = 'button';
          x.setAttribute('aria-label', 'Close');
          x.addEventListener('click', () => ctx.dismiss('close'));
        }
        const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
        const bottomFrame = document.querySelector('.ref-float-dock') || document.querySelector('.ref-foot');
        const bottomInset = bottomFrame ? window.innerHeight - bottomFrame.getBoundingClientRect().top + 8 : 18;
        if (kind === 'banner') el.style.top = headerBottom + 86 + 'px';
        if (kind === 'cookie' || kind === 'chat') el.style.bottom = bottomInset + 'px';
        if (kind === 'promo')
          Object.assign(el.style, {
            top: headerBottom + 110 + 'px',
            bottom: 'auto',
            left: '23%',
            right: 'auto',
            width: 'min(740px, 72vw)',
          });
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K } = S;
        const header = util.el('header', 'ref-task', document.body);
        const menuBar = util.el('div', 'relay-menubar', document.body);
        const apple = util.el('span', 'relay-apple', menuBar);
        apple.innerHTML =
          '<svg viewBox="0 0 24 28" aria-hidden="true"><defs><linearGradient id="apple-blue" x2=".4" y2="1"><stop stop-color="#a6d7ff"/><stop offset=".5" stop-color="#3485fa"/><stop offset="1" stop-color="#293fc7"/></linearGradient></defs><path d="M14 6c0-4 3-5 5-5-1 4-3 5-5 5ZM12 8c-5-5-12 0-10 8 1 6 4 11 7 9 2-1 4-1 6 0 4 2 7-4 8-7-5-2-6-7-2-10-3-3-6-2-9 0Z" fill="url(#apple-blue)" stroke="#243e9f" stroke-width=".8"/></svg>';
        util.el('strong', '', menuBar, 'Relayboard');
        for (const text of ['File', 'Edit', 'View', 'Workflow', 'Step', 'Window', 'Help'])
          util.el('span', '', menuBar, text);
        util.el('span', 'relay-menu-clock', menuBar, '10:24 AM');
        util.el('span', '', menuBar, '◖))');
        util.el('span', '', menuBar, '▣');
        const windowTitle = util.el('span', 'relay-window-title', header, '▣  Relayboard');
        const windowControls = util.el('span', 'relay-window-controls', header);
        for (const [text, tone] of [
          ['−', 'grey'],
          ['−', 'yellow'],
          ['×', 'red'],
        ])
          util.el('span', `relay-window-control ${tone}`, windowControls, text);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { apple, header, menuBar, windowControls, windowTitle });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('nav', 'relay-rail', body);
        const railItems = [
          [
            '<path d="M9 2h16v21H9z" fill="url(#rail-paper)"/><path d="M5 5h15v20H5z" fill="url(#rail-blue)"/><path d="M2 8h12l5 5v14H2z" fill="url(#rail-paper)"/><path d="M14 8v6h5M5 17h10M5 20h10M5 23h8M18 5h4v7" fill="none"/>',
            'Workflows',
          ],
          [
            '<path d="m2 8 12-6 12 6v16l-12 5-12-6z" fill="url(#rail-paper)"/><path d="m2 8 12 6 12-6M14 14v15M8 5l12 6v5l-4 2v-5L5 7" fill="url(#rail-blue)"/>',
            'Library',
          ],
          ['<path d="M6 2v25l20-13Z" fill="url(#rail-green)"/><path d="M8 6v17" stroke="#c5ffb2"/>', 'Runs'],
          [
            '<path d="M2 5h26v24H2z" fill="url(#rail-paper)"/><path d="M2 10h26V5H2z" fill="url(#rail-blue)"/><path d="M7 1v7M22 1v7" stroke-width="2.2"/><path d="M7 14h2m5 0h2m5 0h2M7 19h2m5 0h2m5 0h2M7 24h2m5 0h2m5 0h2" stroke="#363c9e" stroke-width="2"/>',
            'Schedules',
          ],
          [
            '<path d="M9 1v10M19 1v10" stroke-width="2.5"/><path d="M5 9h18v8c0 10-18 10-18 0z" fill="url(#rail-blue)"/><path d="M5 13h18M14 24v6" fill="none" stroke-width="2"/>',
            'Connections',
          ],
          [
            '<path d="m12 2 5 0 1 4 3 1 4-2 3 4-3 3 1 3 4 1v5l-4 1-1 3 2 4-4 3-3-3-3 1-1 4h-5l-1-4-3-1-4 2-3-4 3-3-1-3-4-1v-5l4-1 1-3-2-4 4-3 3 3 3-1z" transform="translate(2 0) scale(.8)" fill="url(#rail-blue)"/><circle cx="14" cy="14" r="5" fill="url(#rail-paper)"/>',
            'Settings',
          ],
        ];
        for (const [icon, label] of railItems) {
          const item = util.el('a', 'relay-rail-item', rail);
          item.href = '#';
          item.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'sidebar', label });
          });
          const glyph = util.el('span', 'relay-rail-icon', item);
          glyph.innerHTML = `<svg viewBox="0 0 30 32" aria-hidden="true" focusable="false"><defs><linearGradient id="rail-paper" x2=".6" y2="1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#f4f5fa"/><stop offset="1" stop-color="#a9b3cf"/></linearGradient><linearGradient id="rail-blue" x2=".6" y2="1"><stop stop-color="#dbe7ff"/><stop offset="1" stop-color="#778dd3"/></linearGradient><linearGradient id="rail-green" x2="1" y2="1"><stop stop-color="#bcffa3"/><stop offset="1" stop-color="#1ba823"/></linearGradient></defs>${icon}</svg>`;
          util.el('span', 'relay-rail-label', item, label);
        }
        const summary = util.el('aside', 'relay-summary', body);
        util.el('div', 'relay-summary-title', summary, 'Workflow Summary');
        const facts = util.el('div', 'relay-summary-facts', summary);
        for (const [label, value] of [
          ['Name:', 'Current workflow'],
          ['Steps:', '6'],
          ['Connections:', '5'],
          ['Last modified:', 'Mar 12, 2001   9:14 AM'],
        ]) {
          const row = util.el('div', 'relay-summary-row', facts);
          util.el('span', 'relay-summary-key', row, label);
          util.el('span', 'relay-summary-value', row, value);
        }
        const status = util.el('div', 'relay-summary-status', summary);
        util.el('span', 'relay-summary-key', status, 'Status:');
        util.el('span', 'relay-status-light', status);
        util.el('span', '', status, 'Active');
        util.el('div', 'relay-counts-title', summary, 'Step Counts');
        const counts = util.el('div', 'relay-counts', summary);
        for (const [tone, label, count] of [
          ['trigger', 'Trigger', '1'],
          ['logic', 'Logic', '1'],
          ['action', 'Action', '2'],
          ['data', 'Data', '2'],
          ['other', 'Other', '0'],
        ]) {
          const row = util.el('div', `relay-count-row relay-count-${tone}`, counts);
          util.el('span', 'relay-count-dot', row);
          util.el('span', 'relay-count-name', row, label);
          util.el('span', 'relay-count-value', row, count);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, counts, facts, rail, railItems, status, summary });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, summary, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', summary);
          summary.prepend(panel);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : 'Task Note');
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
      },
  };

  env.site({
    name: 'design-use-workflow-editor-configure-01',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
