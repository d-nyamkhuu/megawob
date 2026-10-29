// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const THEMES = {
    light: { bg: '#f5f8fb', panel: '#ffffff', fg: '#1f2b51', muted: '#7187a7', line: '#d5e0ee' },
    dark: { bg: '#15171c', panel: '#20232b', fg: '#e8eaf0', muted: '#9aa1ad', line: '#3a3f4b' },
    warm: { bg: '#f6f1e8', panel: '#fffaf2', fg: '#2b2118', muted: '#7d6b58', line: '#e2d6c3' },
  };

  const ICONS = {
    app: '<path d="m8 5 7-2 3 4-2 8-7 4-3-4 2-10Zm0 7 7-6"/>',
    add: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
    reply: '<path d="m9 4-6 5 6 5M3 9h10a7 7 0 0 1 0 14H8"/>',
    forward: '<path d="m15 4 6 5-6 5M21 9h-9a8 8 0 0 0-8 8v4"/>',
    person: '<circle cx="10" cy="6" r="3"/><path d="M3 20v-3a6 6 0 0 1 11-3"/><circle cx="18" cy="18" r="3"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
    tag: '<path d="m3 12 9-9h8v8l-9 10-8-8Z"/><circle cx="16" cy="7" r=".7"/>',
    more: '<circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    inbox: '<path d="m4 9 2-5h12l2 5M3 10h5l2 4h4l2-4h5v10H3V10Z"/>',
    star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6h4"/>',
    list: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h2m3 0h5M7 12h10M7 16h7"/>',
    bill: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10m-2 3h-4v5h4m-6-3h7"/>',
    tech: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 11h10m-7 0v6m-3-3h7"/>',
    device: '<rect x="6" y="2" width="13" height="20" rx="1"/><path d="M10 6h5"/><circle cx="12.5" cy="14" r="2.5"/>',
    file: '<path d="M6 2h8l5 5v15H6V2Zm8 0v6h5"/>',
    team: '<circle cx="9" cy="7" r="3"/><path d="M2 21v-3a6 6 0 0 1 12 0v3m1-18a3 3 0 0 1 0 6m2 5a5 5 0 0 1 5 5v2"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="1"/><path d="M12 17v5m-5 0h10"/>',
    gear: '<path d="m9 3 1-2h4l1 3 3 1 2-1 2 4-2 2v4l2 2-2 4-3-1-2 2-1 2h-4l-1-3-3-1-2 1-2-4 2-2v-4L2 8l2-4 3 1 2-2Z"/><circle cx="12" cy="12" r="3"/>',
  };

  const iconMarkup = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.list}</svg>`;

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
        if (kind === 'chat') util.el('div', 'ref-chat-heading', box, 'Chat with us');
        if (kind === 'cookie') util.el('span', 'ref-cookie-icon', box, '◉');
        if (kind === 'promo') {
          const art = util.el('div', 'ref-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 220 240" aria-hidden="true"><circle cx="106" cy="133" r="88" fill="#e5f2ff"/><path d="m40 122 67-58 67 58v80H40Z" fill="#0878ff"/><rect x="58" y="88" width="99" height="96" rx="4" fill="#fff"/><path d="M73 110h69m-69 17h69m-69 17h52" stroke="#b2d5ff" stroke-width="7"/><path d="m40 125 67 44 67-44v77H40Z" fill="#2387ff"/><path d="m40 202 67-57 67 57" fill="#449bff"/><path d="m135 49 67-26-26 63-13-26-28-11Z" fill="#65b1ff"/><path d="m163 60 39-37-27 49" fill="#0878ff"/><path d="m145 82-27 20" stroke="#65b1ff" stroke-width="2" stroke-dasharray="5 5"/></svg>';
          util.el('h2', 'ref-promo-title', box, 'Get product updates in your inbox');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'ref-promo-email', box);
          email.type = 'text';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
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
        if (kind === 'chat') {
          box.querySelector('.ref-chat-heading').appendChild(dismiss);
          const compose = util.el('div', 'ref-chat-compose', box);
          const input = util.el('input', '', compose);
          input.type = 'text';
          input.placeholder = 'Type a message...';
          input.setAttribute('aria-label', 'Chat message');
          const send = util.el('button', '', compose, '➤');
          send.setAttribute('aria-label', 'Send chat message');
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send chat message' }));
        }
        if (kind === 'promo' || kind === 'cookie') {
          const close = util.el('button', 'ref-overlay-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => dismiss.click());
        }
        if (kind === 'banner') {
          const menu = document.querySelector('.ref-menubar');
          if (menu) el.style.top = menu.getBoundingClientRect().bottom + 'px';
        }
        if (kind === 'chat' || kind === 'cookie') {
          const end = document.querySelector('[data-role="submit"]');
          const bounds = end && end.getBoundingClientRect();
          if (bounds && bounds.top > document.documentElement.clientHeight * 0.75) {
            el.style.bottom = document.documentElement.clientHeight - bounds.top + 10 + 'px';
          }
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        // This reference design is a single-purpose macOS utility with a fixed light palette.
        name = 'light';
        accent = '#0878ff';
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = ctx.size ? ctx.size.width : document.documentElement.clientWidth;
        const H = ctx.size ? ctx.size.height : document.documentElement.clientHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.instructionMode = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { rng, util } = _c;
        const { TITLES } = S;
        const win = util.el('div', 'ref-window', document.body);
        const titlebar = util.el('div', 'ref-titlebar', win);
        util.el('span', 'ref-app-icon', titlebar).innerHTML = iconMarkup('app');
        const brand = util.el('div', 'ref-brand', titlebar, 'SupportDesk');
        brand.dataset.role = 'brand';
        rng.pick(TITLES); // retain the base site's seeded frame draw
        const menubar = util.el('nav', 'ref-menubar', win);
        for (const item of ['File', 'Edit', 'View', 'Ticket', 'Tools', 'Window', 'Help']) {
          const m = util.el('span', 'ref-menu-item', menubar, item);
          m.dataset.role = 'menu';
        }
        const header = util.el('header', 'ref-task', win);
        const actionbar = util.el('div', 'ref-actionbar', header);
        for (const [icon, label] of [
          ['add', 'New Ticket'],
          ['reply', 'Reply'],
          ['forward', 'Forward'],
          ['person', 'Assign'],
          ['check', 'Mark Resolved'],
          ['tag', 'Tags'],
          ['more', 'More'],
        ]) {
          const action = util.el('div', 'ref-action', actionbar);
          util.el('span', 'ref-action-icon', action).innerHTML = iconMarkup(icon);
          util.el('span', 'ref-action-label', action, label);
        }
        const search = util.el('div', 'ref-ticket-search', actionbar);
        util.el('span', 'ref-search-icon', search).innerHTML = iconMarkup('search');
        util.el('span', 'ref-ticket-search-label', search, 'Search tickets...');
        Object.assign(_c, { actionbar, brand, header, menubar, search, titlebar, win });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, titlebar, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', titlebar, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, placement, titlebar, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', titlebar);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util, win } = _c;
        const body = util.el('div', 'ref-body', win);
        const appNav = util.el('aside', 'ref-helpdesk-nav', body);
        const navGroup = (title, rows) => {
          const group = util.el('div', 'ref-nav-group', appNav);
          if (title) util.el('div', 'ref-nav-heading', group, title);
          for (const [icon, text, count, active] of rows) {
            const item = util.el('div', `ref-helpdesk-item${active ? ' is-active' : ''}`, group);
            util.el('span', 'ref-helpdesk-icon', item).innerHTML = iconMarkup(icon);
            util.el('span', 'ref-helpdesk-label', item, text);
            if (count) util.el('span', 'ref-helpdesk-count', item, count);
          }
        };
        navGroup('', [
          ['inbox', 'Inbox', '48', true],
          ['star', 'My Tickets', '12'],
          ['person', 'Unassigned', '7'],
          ['star', 'Starred', '3'],
          ['check', 'Resolved', '231'],
          ['clock', 'Spam', '4'],
        ]);
        navGroup('Views', [
          ['list', 'All Tickets', '48'],
          ['bill', 'Billing', '11'],
          ['tech', 'Technical', '14'],
          ['tech', 'Account Access', '9'],
          ['device', 'Hardware', '6'],
          ['file', 'Feedback', '8'],
        ]);
        navGroup('Teams', [
          ['team', 'Customer Support'],
          ['tag', 'Billing'],
          ['monitor', 'IT Support'],
          ['gear', 'Operations'],
        ]);
        S.frameSidebar(_c, body);
        Object.assign(_c, { appNav, body, navGroup });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const {
          body,
          closeLabel,
          collide,
          ctx,
          decoyBtn,
          decoys,
          display,
          endBtn,
          label,
          lr,
          placement,
          rng,
          stage,
          util,
          wantFooter,
          win,
          word,
        } = _c;
        let { submit } = _c;
        const inspector = util.el('aside', 'ref-ticket-inspector', body);
        const tabs = util.el('div', 'ref-inspector-tabs', inspector);
        util.el('span', 'is-current', tabs, 'Details');
        util.el('span', '', tabs, 'Activity');
        util.el('span', '', tabs, 'Attachments');
        const details = util.el('div', 'ref-ticket-properties', inspector);
        for (const [key, value] of [
          ['ID', '1014'],
          ['Subject', 'Billing discrepancy'],
          ['Requester', 'Aibek Erdenebat'],
          ['Owner', 'Sofia Martinez'],
          ['Status', '●  Open'],
          ['Priority', '●  High'],
          ['Created', 'Apr 16, 2019 9:18 AM'],
          ['Last updated', 'Apr 16, 2019 9:18 AM'],
        ]) {
          const row = util.el('div', 'ref-property-row', details);
          util.el('span', 'ref-property-key', row, key);
          util.el('span', 'ref-property-value', row, value);
        }
        const tags = util.el('div', 'ref-property-row ref-property-tags', details);
        util.el('span', 'ref-property-key', tags, 'Tags');
        const tagList = util.el('span', 'ref-property-value', tags);
        util.el('span', 'ref-ticket-tag', tagList, 'billing');
        util.el('span', 'ref-ticket-tag', tagList, 'payment');
        util.el('div', 'ref-property-key ref-description-label', inspector, 'Description');
        util.el(
          'div',
          'ref-ticket-description',
          inspector,
          'There appears to be a discrepancy on my latest invoice. The amount charged is higher than expected. Could you please review and advise?\n\nThank you,\nAibek Erdenebat',
        );
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) inspector.appendChild(taskPanel);

        // Keep the read-only inspector in step with whichever seeded record the
        // task grid just selected. The grid remains the source of truth for values.
        stage.addEventListener('click', (event) => {
          const row = event.target.closest('.to-row');
          if (!row) return;
          inspector.dataset.row = row.dataset.id;
          const cells = [...row.querySelectorAll('.to-c')].map(
            (cell) => cell.querySelector('.to-edit')?.value || cell.innerText.trim(),
          );
          if (cells.length < 6) return;
          const values = [cells[0], cells[2], cells[1], cells[3], cells[5], cells[4]];
          const propertyRows = [...details.querySelectorAll('.ref-property-row')];
          values.forEach((value, index) => {
            const target = propertyRows[index] && propertyRows[index].querySelector('.ref-property-value');
            if (target) {
              target.textContent = value;
              target.classList.toggle('ref-status-dot', index === 4);
              target.classList.toggle('ref-priority-dot', index === 5);
            }
          });
          const description = inspector.querySelector('.ref-ticket-description');
          if (description)
            description.textContent = description.textContent.replace(
              /Thank you,\n[\s\S]*$/,
              `Thank you,\n${cells[1]}`,
            );
        });
        if (display === 'toast') {
          const noteDock = util.el('div', 'ref-note-dock', win);
          const note = util.el('div', 'ref-note', noteDock);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', win);
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
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        Object.assign(_c, { details, inspector, submit, tabs, tagList, tags, taskPanel });
      },
    'frame.footer': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-data-grid-virtual-04',
    template: 'site/base',
    design: { THEMES, parts },
  });
})();
