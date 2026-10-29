// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  // Small, shaded system icons shared by the application frame and service list.
  window.quotaLunaIcon = (parent, name) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 48 48');
    svg.setAttribute('class', `xp-art xp-art-${name}`);
    svg.setAttribute('aria-hidden', 'true');
    const blue = 'url(#luna-blue)',
      steel = 'url(#luna-steel)';
    const art = {
      compute: `<path d="M9 9 17 3h24v36l-8 6H9Z" fill="${steel}" stroke="#102852" stroke-width="1.8"/><path d="M9 10h24v35M33 10l8-7" fill="none" stroke="#17345c" stroke-width="1.5"/>${[13, 24, 35].map((y) => `<rect x="12" y="${y}" width="18" height="7" rx="1" fill="#b9cbd5" stroke="#50617a"/><rect x="15" y="${y + 2}" width="7" height="2" fill="#526b78"/><circle cx="27" cy="${y + 3}" r="1.4" fill="#55ae73"/>`).join('')}`,
      storage: `<path d="M7 10v27c0 10 34 10 34 0V10Z" fill="${blue}" stroke="#092a67" stroke-width="1.7"/><ellipse cx="24" cy="10" rx="17" ry="7" fill="#a5d0ff" stroke="#092a67" stroke-width="1.7"/><path d="M7 22c0 9 34 9 34 0M7 33c0 9 34 9 34 0" fill="none" stroke="#183f80" stroke-width="1.4"/><path d="M10 14v22" stroke="#eef7ff" stroke-width="2.2"/>`,
      network: `<path d="M24 17v12M9 35v-9h30v9" fill="none" stroke="#06327a" stroke-width="3"/>${[
        [16, 3],
        [2, 32],
        [30, 32],
      ]
        .map(
          ([x, y]) =>
            `<rect x="${x}" y="${y}" width="16" height="15" rx="1" fill="${blue}" stroke="#052769" stroke-width="1.8"/><path d="M${x + 2} ${y + 3}h12" stroke="#b5e7ff" stroke-width="2"/>`,
        )
        .join('')}`,
      settings: `<path d="m19 3 9 0 2 7 6 3 6-2 4 8-5 5 0 6 3 5-6 7-7-3-5 2-3 5-9-2-1-7-5-4-6 0-2-9 6-4 2-6-1-6 8-4Z" fill="${blue}" stroke="#092b67" stroke-width="1.8"/><circle cx="24" cy="24" r="8" fill="#f4faff" stroke="#163f7c" stroke-width="2"/>`,
      home: `<path d="M8 22v22h32V22L24 7Z" fill="#f0e7b8" stroke="#1b3a69" stroke-width="1.5"/><path d="m3 23 21-20 21 20-5 4L24 11 8 27Z" fill="#e37a27" stroke="#944915" stroke-width="1.5"/><path d="M19 43V27h11v16" fill="${blue}" stroke="#123d75"/><path d="M10 23v18h5V24" fill="#fff"/>`,
      document: `<path d="M10 3h22l8 8v34H10Z" fill="#fafbff" stroke="#566b8e" stroke-width="1.6"/><path d="M32 3v9h8" fill="#c8d8f0" stroke="#566b8e"/><path d="M15 19h18M15 24h18M15 29h18M15 34h11" stroke="#8bb2c9" stroke-width="2"/><path d="m14 37 8-9 5 4 8-11" fill="none" stroke="#63a72d" stroke-width="3"/>`,
      help: `<circle cx="24" cy="24" r="21" fill="${blue}" stroke="#00347d" stroke-width="1.8"/><path d="M17 16c0-11 18-10 16 0-1 5-8 5-8 12" fill="none" stroke="white" stroke-width="5"/><circle cx="25" cy="35" r="2.8" fill="white"/>`,
      back: `<circle cx="24" cy="24" r="21" fill="url(#luna-green)" stroke="#30671b" stroke-width="1.8"/><path d="M25 12 13 24l12 12v-8h11v-8H25Z" fill="white"/>`,
      forward: `<circle cx="24" cy="24" r="21" fill="${steel}" stroke="#959595" stroke-width="1.8"/><path d="m22 12 12 12-12 12v-8H11v-8h11Z" fill="white"/>`,
      refresh: `<path d="M39 19A17 17 0 0 0 9 12L4 8v16h16l-6-6A11 11 0 0 1 34 19ZM9 29a17 17 0 0 0 30 7l5 4V24H28l6 6a11 11 0 0 1-20-1Z" fill="url(#luna-green)" stroke="#39711f" stroke-width="1.3"/>`,
      users: `<circle cx="30" cy="12" r="7" fill="#f2bf60" stroke="#804315"/><path d="M20 39V27c0-13 22-13 22 0v12Z" fill="url(#luna-green)" stroke="#214977"/><circle cx="17" cy="14" r="8" fill="#ffd17c" stroke="#804315"/><path d="M5 42V30c0-14 24-14 24 0v12Z" fill="${blue}" stroke="#214977"/>`,
      monitor: `<rect x="3" y="5" width="42" height="33" rx="3" fill="${blue}" stroke="#173363" stroke-width="2"/><path d="m8 31 9-12 7 6L38 9v23Z" fill="#7cb349"/><path d="M19 39v5h12v-5" fill="#738cb4" stroke="#173363"/>`,
      cloud: `<path d="M10 36c-13-1-9-21 2-21C15-2 36 1 38 16c13 0 13 20 0 20Z" fill="${blue}" stroke="#bbeaff" stroke-width="1.7"/>`,
    };
    svg.innerHTML = `<defs><linearGradient id="luna-blue"><stop stop-color="#e0efff"/><stop offset=".32" stop-color="#8ab8ef"/><stop offset=".7" stop-color="#428bdf"/><stop offset="1" stop-color="#7da8e4"/></linearGradient><linearGradient id="luna-steel" x2="1" y2="1"><stop stop-color="#e3e9f4"/><stop offset=".5" stop-color="#8296af"/><stop offset="1" stop-color="#c1c9d2"/></linearGradient><linearGradient id="luna-green" x2="0" y2="1"><stop stop-color="#9ddd66"/><stop offset=".5" stop-color="#58a828"/><stop offset="1" stop-color="#328911"/></linearGradient></defs>${art[name] || art.document}`;
    parent.append(svg);
    return svg;
  };

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
        let chatHeading = null;
        if (kind === 'chat') {
          chatHeading = util.el('div', 'xp-chat-heading', box, 'Chat with Support');
        }
        if (kind === 'promo') {
          const bounds = document.querySelector('.ref-body').getBoundingClientRect();
          el.style.top = `${bounds.top}px`;
          el.style.bottom = `${window.innerHeight - bounds.bottom}px`;
          const heading = util.el('div', 'xp-promo-heading', box);
          util.el('span', 'xp-envelope', heading);
          util.el('strong', '', heading, 'Stay informed');
          const close = util.el('button', 'xp-promo-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
        }
        if (kind === 'banner') {
          el.style.top = `${document.querySelector('.ref-body').getBoundingClientRect().top}px`;
          window.quotaLunaIcon(box, 'help');
        }
        if (kind === 'cookie') {
          util.el('span', 'xp-cookie-icon', box, '●');
          const end = document.querySelector('[data-role="submit"]');
          const endBox = end?.getBoundingClientRect();
          if (endBox && endBox.top > window.innerHeight / 2)
            el.style.bottom = `${window.innerHeight - endBox.top + 12}px`;
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'xp-promo-email', box);
          email.type = 'text';
          email.placeholder = 'Enter your email address';
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
        if (kind === 'chat') {
          chatHeading.append(dismiss);
          const compose = util.el('div', 'xp-chat-compose', box);
          const message = util.el('input', '', compose);
          message.type = 'text';
          message.placeholder = 'Type a message...';
          message.setAttribute('aria-label', 'Support message');
          const send = util.el('button', '', compose, '➤');
          send.type = 'button';
          send.setAttribute('aria-label', 'Send support message');
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send support message' }));
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx, util } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.instructionDisplay = display;

        // Windows XP application title and menu bars.
        const deskMenu = util.el('div', 'next-menu', document.body);
        for (const item of ['File', 'Edit', 'View', 'Tools', 'Actions', 'Help'])
          util.el('span', 'next-menu-item', deskMenu, item);
        const winbar = util.el('div', 'next-titlebar', document.body);
        window.quotaLunaIcon(util.el('span', 'next-window-icon', winbar), 'cloud');
        util.el('span', 'next-window-title', winbar, 'Cloud Administration Console');
        const winControls = util.el('span', 'next-window-controls', winbar);
        for (const [glyph, cls] of [
          ['−', 'min'],
          ['□', 'max'],
          ['×', 'close'],
        ])
          util.el('span', `xp-winbtn ${cls}`, winControls, glyph);
        const xpTools = util.el('div', 'xp-toolbar', document.body);
        for (const [glyph, label] of [
          ['⬅', 'Back'],
          ['➜', 'Forward'],
          ['⌂', 'Home'],
          ['✳', 'New'],
          ['▤', 'Properties'],
          ['↻', 'Refresh'],
          ['?', 'Help'],
        ]) {
          const tool = util.el('div', 'xp-tool', xpTools);
          const toolIcon = util.el('span', `xp-tool-icon ${label.toLowerCase()}`, tool);
          window.quotaLunaIcon(
            toolIcon,
            { Home: 'home', New: 'document', Properties: 'document' }[label] || label.toLowerCase(),
          );
          if (label === 'New') util.el('span', 'xp-new-star', toolIcon, '✳');
          util.el('span', 'xp-tool-label', tool, label);
        }
        Object.assign(_c, { H, W, deskMenu, display, roomy, tall, winControls, winbar, xpTools });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('aside', 'next-rail', body);
        const navigation = util.el('section', 'xp-administration', rail);
        util.el('div', 'xp-rail-heading', navigation, 'Administration');
        const railItems = [
          ['⌂', 'Overview'],
          ['▣', 'Subscriptions'],
          ['▦', 'Compute'],
          ['▤', 'Storage'],
          ['⌘', 'Networking'],
          ['♟', 'Identity & Access'],
          ['⚙', 'Service Management'],
          ['▥', 'Monitoring'],
          ['▧', 'Reports'],
        ];
        for (const [icon, label] of railItems) {
          const item = util.el('div', `next-rail-item${label === 'Subscriptions' ? ' active' : ''}`, navigation);
          const iconNode = util.el('span', 'next-rail-icon', item);
          window.quotaLunaIcon(
            iconNode,
            {
              Overview: 'home',
              Subscriptions: 'document',
              Compute: 'compute',
              Storage: 'storage',
              Networking: 'network',
              'Identity & Access': 'users',
              'Service Management': 'settings',
              Monitoring: 'monitor',
              Reports: 'document',
            }[label],
          );
          util.el('span', 'next-rail-label', item, label);
        }
        const support = util.el('section', 'xp-support', rail);
        const supportHeading = util.el('div', 'xp-support-heading', support);
        window.quotaLunaIcon(supportHeading, 'help');
        util.el('span', '', supportHeading, 'Help and Support');
        util.el('strong', 'xp-support-title', support, 'Subscription Settings');
        util.el('p', '', support, 'Manage compute, storage and network quotas for your subscriptions.');
        util.el('p', '', support, 'Select a service from the list to view and update regional limits.');
        util.el(
          'p',
          'xp-tip',
          support,
          'Tip: Quotas control the maximum amount of resources that can be provisioned in each region. Check the current usage and headroom before making changes.',
        );
        util.el('a', 'xp-learn', support, 'Learn more about quotas');
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, navigation, rail, railItems, support, supportHeading });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, support, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', support);
          support.insertBefore(panel, support.children[1]);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const taskColumn = util.el('section', 'xp-task-column', body);
        const pageHeading = util.el('header', 'xp-page-heading', taskColumn);
        window.quotaLunaIcon(pageHeading, 'storage');
        const headingCopy = util.el('div', '', pageHeading);
        util.el('h1', '', headingCopy, 'Subscriptions');
        util.el('p', '', headingCopy, 'View and manage your subscriptions, service settings and regional quotas.');
        const stage = util.el('main', 'ref-stage', taskColumn);
        Object.assign(_c, { headingCopy, pageHeading, stage, taskColumn });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { body, closeLabel, ctx, display, headerTools, stage, taskColumn, util } = _c;
        // Persistent subscription resource summary shown above the live quota task.
        const quotaSummary = util.el('section', 'quota-summary', taskColumn);
        taskColumn.insertBefore(quotaSummary, stage);
        util.el('div', 'quota-summary-title', quotaSummary, 'Quota Summary (All Subscriptions)');
        const quotaMetrics = util.el('div', 'quota-summary-metrics', quotaSummary);
        for (const [icon, title, value, total, width] of [
          ['▦', 'Virtual CPUs', '892', 'of 2,400 used', '37%'],
          ['◉', 'Storage (GB)', '3,420', 'of 10,000 used', '34%'],
          ['⌘', 'Public IPs', '68', 'of 200 used', '34%'],
        ]) {
          const metric = util.el('div', 'quota-metric', quotaMetrics);
          const metricIcon = util.el('span', 'quota-metric-icon', metric);
          window.quotaLunaIcon(
            metricIcon,
            title === 'Virtual CPUs' ? 'compute' : title === 'Storage (GB)' ? 'storage' : 'network',
          );
          const copy = util.el('div', 'quota-metric-copy', metric);
          util.el('div', 'quota-metric-label', copy, title);
          util.el('strong', 'quota-metric-value', copy, value);
          util.el('div', 'quota-metric-total', copy, total);
          const bar = util.el('div', 'quota-meter', copy);
          const fill = util.el('i', '', bar);
          fill.style.width = width;
        }
        const quotaMeta = util.el('div', 'quota-summary-meta', quotaMetrics);
        util.el('div', '', quotaMeta, 'Headroom (vCPUs)　 1,508');
        util.el('div', '', quotaMeta, 'Active Subscriptions　 3');
        util.el('div', '', quotaMeta, 'Last Updated　 Apr 26, 2024　10:12 AM');
        util.el('div', '', quotaMeta, 'Audit Reference　 AUD-20240426-0017');
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', document.body);
          // A toolbar end control or decoy remains visible above the notification.
          if (headerTools.childElementCount) note.style.top = `${body.getBoundingClientRect().top + 8}px`;
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
        Object.assign(_c, { quotaMeta, quotaMetrics, quotaSummary });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el(
            'div',
            'ref-float-dock',
            document.querySelector('.ref-foot .ref-tools') || document.body,
          );
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        Object.assign(_c, { submit });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { stage } = _c;
        S.frameAlign(_c, stage);
      },
  };

  env.site({
    name: 'design-use-admin-console-quota-03',
    template: 'site/base',
    design: { parts },
  });
})();
