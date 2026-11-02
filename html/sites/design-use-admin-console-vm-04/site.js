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
        const title = ['chat', 'promo'].includes(kind)
          ? util.el('div', 'mac-overlay-title', box, kind === 'chat' ? 'Support' : 'Get product updates')
          : null;
        if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
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
        if (kind === 'chat') {
          title.append(dismiss);
          const composer = util.el('div', 'mac-chat-composer', box);
          const input = util.el('input', '', composer);
          input.placeholder = 'Type a message…';
          input.setAttribute('aria-label', 'Support message');
          const send = util.el('button', 'ref-ov-btn', composer, '➤');
          send.type = 'button';
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send support message' }));
        }
        if (kind === 'promo') {
          const close = util.el('button', 'mac-overlay-close', title, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
          const email = util.el('input', 'mac-promo-email', box);
          email.placeholder = 'Enter your email address';
          email.setAttribute('aria-label', 'Newsletter email address');
          row.before(email);
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        document.body.classList.add('mac-desktop');
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
        const { content, display, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const menu = util.el('div', 'mac-menubar', document.body);
        menu.innerHTML =
          '<b class="mac-mark"><svg viewBox="0 0 24 28" aria-hidden="true"><path d="M15 5c1-2 3-3 3-5-3 0-5 2-5 5ZM20 16c-4-2-4-6 0-8-3-4-6-1-8-1S7 4 4 8C0 14 4 25 8 26c2 0 3-2 5-2s3 2 5 1c2-1 4-4 5-7Z"/></svg></b><span>File</span><span>Edit</span><span>View</span><span>Resources</span><span>Tools</span><span>Window</span><span>Help</span><i></i><span class="mac-menu-utility">?</span><span class="mac-menu-utility">▧</span><span class="mac-clock">10:24 AM</span>';
        util.el('span', 'mac-window-menu', header, '▧');
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'CloudForge');
          brand.innerHTML = 'Cloud<span>Forge</span>';
          brand.dataset.role = 'brand';
        } else {
          const brand = util.el('div', 'ref-brand', header, 'CloudForge');
          brand.innerHTML = 'Cloud<span>Forge</span>';
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        } else {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of ['Compute', 'Storage', 'Network', 'Identity', 'Service Desk', 'Quotas']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        // The seeded navigation draws above stay intact; this application's service
        // bar uses the six permanent Macintosh dock items instead of a portal menu.
        const dock = header.querySelector('.ref-nav');
        dock.replaceChildren();
        const dockIcons = [
          'M12 2 22 7v12l-10 5L2 19V7Zm-10 5 10 5 10-5M12 12v12',
          'M3 6c0-5 18-5 18 0s-18 5-18 0Zm0 0v16c0 5 18 5 18 0V6M3 12c0 5 18 5 18 0M3 18c0 5 18 5 18 0',
          'M10 3h5v6h-5zM1 20h6v6H1zM18 20h6v6h-6zM12 9v6M4 20v-5h17v5',
          'M15 9a4 5 0 1 0-8 0 4 5 0 1 0 8 0ZM3 26v-6c0-8 16-8 16 0v6ZM17 4c6 0 6 9 1 10M20 15c5 1 4 7 4 11h-3',
          'M5 2h18v23H5ZM1 6h18v23H1ZM5 11h10M5 16h10M5 21h10',
          'M2 28V14h5v14ZM11 28V7h5v21ZM20 28V2h5v26Z',
        ];
        ['Compute', 'Storage', 'Network', 'Identity', 'Service Desk', 'Quotas'].forEach((item, i) => {
          const a = util.el('a', 'ref-navlink', dock);
          a.dataset.role = 'nav';
          a.innerHTML = `<svg viewBox="0 0 28 32" aria-hidden="true"><path d="${dockIcons[i]}"/></svg><span>${item}</span>`;
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        });
        Object.assign(_c, { dock, dockIcons, header, menu });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, local, rng, sidebar, util } = _c;
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
        Object.assign(_c, { body });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const inspector = util.el('aside', 'mac-inspector', body);
        inspector.innerHTML =
          '<div class="mac-pane-title">Properties</div><div class="mac-resource"><span class="mac-cube"><svg viewBox="0 0 48 52" aria-hidden="true"><defs><pattern id="mac-dots" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#000"/></pattern></defs><path d="M24 3 44 14 24 25 4 14Z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M4 14 24 25 24 49 4 38Z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M24 25 44 14 44 38 24 49Z" fill="url(#mac-dots)" stroke="#000" stroke-width="2"/></svg></span><div><b>vm-001</b><br>Virtual Machine</div></div><hr><dl><dt>Name:</dt><dd>vm-001</dd><dt>Status:</dt><dd>Not created</dd><dt>Region:</dt><dd>—</dd><dt>Operating system:</dt><dd>—</dd><dt>Instance size:</dt><dd>—</dd><dt>Boot disk (GiB):</dt><dd>—</dd><dt>Virtual network:</dt><dd>—</dd><dt>Environment tag:</dt><dd>—</dd></dl><hr><div class="mac-cost"><span>Estimated monthly cost:</span><b>$0.00 (USD)</b></div><hr><b>Description</b><p>A virtual machine is an on-demand compute instance with a selected operating system, instance size, network, and storage.</p>';
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) inspector.append(taskPanel);
        S.frameAlign(_c, stage);
        Object.assign(_c, { inspector, stage, taskPanel });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-admin-console-vm-04',
    template: 'site/base',
    design: { parts },
  });
})();
