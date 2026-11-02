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
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'cookie') util.el('span', 'ref-ov-symbol', box, '◌');
        if (['cookie', 'chat', 'promo', 'banner'].includes(kind)) {
          util.el(
            'strong',
            'ref-ov-heading',
            box,
            {
              cookie: 'We use cookies',
              chat: 'CloudConsole Assistant',
              promo: 'Stay in the know',
              banner: 'CloudConsole notice',
            }[kind],
          );
        }
        if (kind === 'promo') {
          const art = util.el('div', 'ref-ov-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 180 180" fill="none"><rect x="24" y="64" width="132" height="90" rx="7" fill="#75b4ff"/><path d="m24 69 66-49 66 49-66 48Z" fill="#4a9aff"/><rect x="47" y="31" width="87" height="87" rx="6" fill="#cce4ff"/><path d="M61 48h57M61 62h57M61 76h42M61 90h49" stroke="#99c7ff" stroke-width="7"/><path d="m24 72 66 45 66-45v81H24Z" fill="#72b3ff"/><path d="m24 154 66-52 66 52" fill="#98c9ff"/><path d="m144 21 4-9 4 9 9 4-9 4-4 9-4-9-9-4ZM18 42l3-7 3 7 7 3-7 3-3 7-3-7-7-3Z" fill="#8fc2ff"/></svg>';
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'chat') {
          const suggestions = util.el('div', 'ref-chat-suggestions', box);
          for (const label of ['Explain this page', 'Help me create a VM', 'What are instance types?']) {
            const suggestion = util.el('button', '', suggestions, label);
            suggestion.type = 'button';
            suggestion.addEventListener('click', () => env.log('decoy', { label }));
          }
          util.el('div', 'ref-chat-input', box, 'Type a message…');
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
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        document.body.dataset.refDisplay = display;
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        document.body.dataset.refEnd = placement || 'none';
        document.body.dataset.refFinish = String(ctx.finish);
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'CloudConsole');
          brand.innerHTML = 'Cloud<span>Console</span>';
          brand.dataset.role = 'brand';
        } else {
          const brand = util.el('div', 'ref-brand', header, 'CloudConsole');
          brand.innerHTML = 'Cloud<span>Console</span>';
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
          for (const item of ['Virtual Machines', 'Kubernetes', 'Databases', 'Networking', 'Images', 'Tags']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        } else {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of ['Virtual Machines', 'Kubernetes', 'Databases', 'Networking', 'Images', 'Tags']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const stats = util.el('div', 'ref-stats', header);
        for (const [count, label, color] of [
          ['12', 'VMs', 'green'],
          ['3', 'Volumes', 'gray'],
          ['4', 'Networks', 'gray'],
        ]) {
          const stat = util.el('div', 'ref-stat', stats);
          util.el('span', `ref-stat-dot ${color}`, stat);
          const copy = util.el('span', 'ref-stat-copy', stat);
          util.el('b', '', copy, count);
          util.el('small', '', copy, label);
        }
        Object.assign(_c, { header, stats });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, display, header, local, rng, sidebar, util } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        if (sidebar) {
          const side = util.el('aside', 'ref-side', body);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
            const a = util.el('a', 'ref-sidelink', side, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'sidebar', label: item });
            });
          }
        } else {
          util.el('aside', 'ref-side', body);
        }
        // Retain the original sidebar draws above; only its decorative navigation changes.
        const side = body.querySelector('.ref-side');
        side.replaceChildren();
        const icons = [
          'M3 10 12 2l9 8M5 9v13h5v-8h4v8h5V9',
          'M3 2h18v8H3zM3 14h18v8H3zM6 6h1m3 0h1M6 18h1m3 0h1',
          'M21 5c0 2-4 4-9 4S3 7 3 5s4-4 9-4 9 2 9 4ZM3 5v14c0 2 4 4 9 4s9-2 9-4V5M3 10c0 2 4 4 9 4s9-2 9-4M3 15c0 2 4 4 9 4s9-2 9-4',
          'M9 11 16 5M9 14l7 5M9 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM23 4a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM23 20a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
          'M16 22H2v-3a7 7 0 0 1 14 0v3ZM14 5a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM18 1a5 5 0 0 1 0 10M18 14a7 7 0 0 1 5 7',
          'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM5 17l4-7 5 5 4-10',
          'M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM1 10h22m-6 7h3',
          'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM5 5l4 4m6 6 4 4M5 19l4-4m6-6 4-4',
        ];
        [
          'Overview',
          'Compute',
          'Storage',
          'Networking',
          'Identity & Access',
          'Monitoring',
          'Billing',
          'Support',
        ].forEach((label, i) => {
          const item = util.el('a', `ref-sidelink${i === 1 ? ' active' : ''}`, side);
          item.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[i]}"/></svg>`;
          util.el('span', '', item, label);
          item.dataset.role = 'nav';
          item.addEventListener('click', () => env.log('decoy', { what: 'sidebar', label }));
        });
        const title = util.el('div', 'ref-page-heading', body);
        util.el('h1', '', title, 'Create Virtual Machine');
        if (display === 'header') title.append(header.querySelector('.ref-instruction'));
        else util.el('p', 'ref-page-subtitle', title, 'Provision a new virtual machine in your cloud environment.');
        Object.assign(_c, { body, icons, side, title });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { H, body, title, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const summary = util.el('section', 'ref-resource-summary', body);
        const summaryTitle = util.el('div', 'ref-summary-title', summary);
        summaryTitle.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M5 6h1m3 0h1M5 18h1m3 0h1"/></svg>';
        util.el('span', '', summaryTitle, 'Resource Summary');
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) {
          if (H < 780) {
            // Use the header fallback when a long note and summary cannot both fit vertically.
            // Its original panel draws have already been consumed above.
            title.querySelector('.ref-page-subtitle')?.remove();
            const note = taskPanel.querySelector('.ref-panel-text');
            note.className = 'ref-instruction';
            title.append(note);
            taskPanel.remove();
            document.body.dataset.refDisplay = 'header';
          } else summary.append(taskPanel);
        }
        util.el('div', 'ref-summary-label', summary, 'Resource Name');
        const resource = util.el('div', 'ref-resource-name', summary, 'vm-001');
        const copyIcon = util.el('span', 'ref-copy-icon', resource);
        copyIcon.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="7" width="11" height="14" rx="2"/><path d="M9 7V3h11v14h-4"/></svg>';
        const rows = util.el('div', 'ref-summary-rows', summary);
        for (const item of ['Region', 'Image', 'Instance Size', 'Boot Disk', 'Network', 'Environment Tag']) {
          const row = util.el('div', 'ref-summary-row', rows);
          util.el('span', '', row, item);
          util.el('span', 'ref-summary-dash', row, '—');
        }
        const costLabel = util.el('div', 'ref-summary-cost-label', summary, 'Estimated Monthly Cost');
        const info = util.el('span', 'ref-cost-info', costLabel, 'i');
        info.setAttribute('aria-label', 'Information');
        util.el('div', 'ref-summary-cost', summary, '$0.00');
        util.el('span', 'ref-summary-unit', summary, 'USD / month');
        Object.assign(_c, { copyIcon, costLabel, info, resource, rows, stage, summary, summaryTitle, taskPanel });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { H, display, endBtn, headerTools, label, placement, title, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const footer = document.querySelector('.ref-foot');
        const dock = document.querySelector('.ref-float-dock');
        let shelf = null;
        if (placement !== 'header' && placement !== 'icon') {
          shelf = util.el('div', 'ref-action-shelf', document.body);
          shelf.append(headerTools);
          if (placement === 'footer' || placement === 'link') shelf.append(footer);
          if (placement === 'floating') shelf.append(dock);
        }
        document.body.dataset.refShelf = String(Boolean(shelf?.querySelector('button, a')));
        if (display === 'toast' && H < 780) {
          const note = document.querySelector('.ref-note');
          title.querySelector('.ref-page-subtitle')?.remove();
          const text = note.querySelector('.ref-note-text');
          text.className = 'ref-instruction';
          title.append(text);
          note.remove();
          document.body.dataset.refDisplay = 'header';
          document.body.classList.remove('ref-has-note');
        }
        Object.assign(_c, { dock, footer, shelf, submit });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-admin-console-vm-03',
    template: 'site/base',
    design: { parts },
  });
})();
