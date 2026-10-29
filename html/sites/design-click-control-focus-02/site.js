(function () {
  'use strict';
  const TABS = ['Home', 'Orders', 'Inventory', 'Accounts', 'Reports', 'Support'];
  const TOOLS = [
    [
      'New Request',
      '<path d="M6 3h13l5 5v21H6Z" fill="#fff" stroke="#3a5a8c" stroke-width="1.5"/><path d="M10 12h10M10 16h10M10 20h10" stroke="#8aa" />',
    ],
    [
      'Open Request',
      '<path d="M3 9h9l3 3h14v15H3Z" fill="#f2b632" stroke="#8a5a10" stroke-width="1.5"/><path d="M3 14h26l-3 13H3Z" fill="#ffd45c" stroke="#8a5a10"/>',
    ],
    [
      'Save',
      '<path d="M4 4h21l4 4v21H4Z" fill="#17408f" stroke="#0a2260"/><rect x="9" y="4" width="13" height="9" fill="#e8eef8"/><rect x="9" y="19" width="14" height="10" fill="#fff"/>',
    ],
    [
      'Print',
      '<rect x="9" y="3" width="14" height="9" fill="#fff" stroke="#345"/><rect x="3" y="12" width="26" height="12" rx="2" fill="#aab4c4" stroke="#345"/><rect x="9" y="19" width="14" height="10" fill="#fff" stroke="#345"/>',
    ],
    [
      'Search',
      '<circle cx="13" cy="13" r="9" fill="#cfe6ff" stroke="#1b3f8f" stroke-width="3"/><path d="m20 20 9 9" stroke="#1b3f8f" stroke-width="4"/>',
    ],
    [
      'View Reports',
      '<rect x="5" y="16" width="6" height="13" fill="#2a5fc0"/><rect x="13" y="6" width="6" height="23" fill="#c8402a"/><rect x="21" y="12" width="6" height="17" fill="#2a5fc0"/>',
    ],
    [
      'Preferences',
      '<circle cx="16" cy="16" r="10" fill="#3a78d0" stroke="#17408f" stroke-width="2"/><circle cx="16" cy="16" r="4" fill="#fff"/><path d="M16 1v5M16 26v5M1 16h5M26 16h5" stroke="#17408f" stroke-width="4"/>',
    ],
    [
      'Help',
      '<circle cx="16" cy="16" r="14" fill="#1f5fd0" stroke="#0a2a80" stroke-width="1.5"/><text x="16" y="23" font-size="20" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">?</text>',
    ],
  ];
  env.site({
    name: 'design-click-control-focus-02',
    styles: ['extranet.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref extranet';
      const shell = u.el('main', 'shell', document.body);
      const mast = u.el('header', 'mast', shell);
      const top = u.el('div', 'mast-top', mast);
      const brand = u.el('div', 'brand', top);
      brand.innerHTML =
        '<svg viewBox="0 0 54 42" width="54" height="42"><defs><linearGradient id="logo" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#a9c4da"/></linearGradient></defs><path d="M27 1 23 7h8ZM21 10h12l3 4H18ZM16 17h22l3 4H13ZM11 24h32l3 4H8ZM6 31h42l3 4H3ZM2 38h50l2 3H0Z" fill="url(#logo)"/></svg>';
      u.el('span', 'brand-name', brand, 'Northbridge Supply');
      u.el('span', 'brand-sep', brand, '|');
      u.el('span', 'brand-sub', brand, 'Partner Extranet');
      const util = u.el('div', 'mast-util', top);
      u.el('div', '', util, 'Welcome, jcarter   |   Help   |   Log Out');
      u.el('div', '', util, 'Apr 29, 1999');
      const tabs = u.el('nav', 'tabs', mast);
      TABS.forEach((t) => u.el('span', 'tab', tabs, t));
      const titlebar = u.el('div', 'titlebar', shell);
      u.el('h1', '', titlebar, 'Create Purchase Request');
      u.el('span', 'reqno', titlebar, 'Request #:   PR-1999-0047');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const dock = u.el('footer', 'dock', shell);
      const tools = u.el('div', 'dock-tools', dock);
      const pictures = [
        '<path d="M5 1h16l7 7v23H5Z" fill="white" stroke="#091745" stroke-width="1.5"/><path d="M21 1v8h7" fill="#b9d7ff" stroke="#091745"/><path d="M8 5h10M8 8h10M8 12h16M8 15h16M8 18h16M8 21h16M8 24h16M8 27h13" stroke="#80b6f7"/><path d="M7 11v17" stroke="#b0d9ff" stroke-width="2"/>',
        '<path d="M2 6V4q0-2 3-2h7l3 4h14v23H2Z" fill="#ffb000" stroke="#061b44" stroke-width="1.7"/><path d="M4 7h24v19H4Z" fill="white" stroke="#536e83"/><path d="M2 11h29l-3 18H1Z" fill="url(#gold)" stroke="#121c3f" stroke-width="1.5"/><path d="M4 12h25" stroke="#fffba0" stroke-width="2"/>',
        '<path d="M2 2h25l3 3v26H2Z" fill="url(#blue)" stroke="#061439" stroke-width="1.6"/><path d="M7 2h16v11H7Z" fill="#b9cfe4" stroke="#071541"/><path d="M17 2h5v9h-5Z" fill="#254b9b"/><path d="M7 19h18v12H7Z" fill="#eefbff" stroke="#102755"/><path d="M9 22h14M9 25h14M9 28h14" stroke="#8cb7db"/><path d="M4 3v26" stroke="#6ac1ff"/>',
        '<path d="M9 1h12l7 7v12H9Z" fill="white" stroke="#11214b" stroke-width="1.5"/><path d="M21 1v8h7" fill="#adbad5" stroke="#11214b"/><path d="M4 13h23q4 0 4 4v10H1V17q0-4 3-4Z" fill="url(#silver)" stroke="#0b1d52" stroke-width="1.5"/><path d="M5 16h22v4H5Z" fill="#e8f5ff" stroke="#11214b"/><path d="M8 23h17v8H8Z" fill="white" stroke="#11214b" stroke-width="1.5"/><path d="M11 26h11M11 28h11" stroke="#84ace1"/><path d="M26 16h2" stroke="#124df0" stroke-width="2"/>',
        '<path d="m20 20 10 10" stroke="#081d43" stroke-width="5" stroke-linecap="round"/><path d="m20 20 10 10" stroke="#5e9cd8" stroke-width="2.5"/><circle cx="12" cy="12" r="10.5" fill="url(#blue)" stroke="#061343" stroke-width="1.4"/><circle cx="12" cy="12" r="8" fill="#e8ffff" stroke="white"/><circle cx="12" cy="12" r="6.5" fill="url(#glass)" stroke="#267cff"/><path d="M7 9q1-4 6-3" fill="none" stroke="white" stroke-width="1.5"/>',
        '<path d="M2 31V18h7v13M12 31V12h7v19M22 31V2h7v29" fill="url(#blue)" stroke="#07193f" stroke-width="1.5"/><path d="M12 31V12h7v19" fill="url(#red)" stroke="#07193f"/><path d="M4 20v9M14 14v15M24 4v25" stroke="white"/><path d="M0 31h31" stroke="#06173e"/>',
        '<path d="m13 1 5 0 1 5 3 1 4-3 3 4-3 4 1 3 5 1v5l-5 1-1 3 3 4-4 3-4-3-3 1-1 5h-5l-1-5-3-1-4 3-3-4 3-4-1-3-5-1v-5l5-1 1-3-3-4 4-3 4 3 3-1Z" transform="translate(2 0) scale(.87)" fill="url(#blue)" stroke="#061744" stroke-width="1.5"/><circle cx="16" cy="16" r="8.5" fill="#b5e2ff" stroke="white"/><circle cx="16" cy="16" r="5" fill="#163668" stroke="#061642" stroke-width="1.4"/>',
        '<path d="m11 1 9 0 7 5 4 9-2 9-7 7-10 0-9-7-2-10 4-8Z" fill="url(#blue)" stroke="#06133e" stroke-width="1.5"/><path d="M6 10q4-8 13-6" fill="none" stroke="#aacfff" stroke-width="1.4"/><text x="16" y="24" font-size="25" font-weight="bold" text-anchor="middle" fill="white" stroke="#8bc8ff" stroke-width=".3" font-family="Arial">?</text>',
      ];
      TOOLS.forEach((t, i) => {
        const b = u.el('div', 'dock-tool', tools);
        b.innerHTML =
          '<svg viewBox="0 0 34 34" width="40" height="40"><defs><linearGradient id="blue' +
          i +
          '" x2="1" y2="1"><stop stop-color="#7ccaff"/><stop offset=".4" stop-color="#286afa"/><stop offset="1" stop-color="#06176b"/></linearGradient><linearGradient id="gold' +
          i +
          '" x2="0" y2="1"><stop stop-color="#ffff8b"/><stop offset=".5" stop-color="#ffc337"/><stop offset="1" stop-color="#f59600"/></linearGradient><linearGradient id="silver' +
          i +
          '" x2="0" y2="1"><stop stop-color="white"/><stop offset="1" stop-color="#7895b8"/></linearGradient><linearGradient id="glass' +
          i +
          '" x2="1" y2="1"><stop stop-color="white"/><stop offset="1" stop-color="#77d5ff"/></linearGradient><linearGradient id="red' +
          i +
          '" x2="1" y2="0"><stop stop-color="#ffc4bb"/><stop offset="1" stop-color="#d32b4f"/></linearGradient></defs>' +
          pictures[i].replace(/url\(#(blue|gold|silver|glass|red)\)/g, 'url(#$1' + i + ')') +
          '</svg>';
        u.el('span', '', b, t[0]);
        if (i === 0)
          b.addEventListener('click', () =>
            stage.querySelectorAll('input,textarea').forEach((input) => (input.value = '')),
          );
      });
      let display = ctx.display || 'header';
      if ((display === 'panel' && window.innerWidth < 1260) || (display === 'toast' && window.innerHeight < 700))
        display = 'header';
      let note = null;
      if (display !== 'hidden') {
        if (display === 'panel') {
          const panel = u.el('aside', 'episode-panel', work);
          u.el('strong', '', panel, 'Request instructions');
          note = u.el('div', 'instruction panel-instruction', panel, ctx.instruction);
        } else {
          note = u.el('div', 'instruction', dock, ctx.instruction);
          note.dataset.display = display;
          if (display === 'toast') note.classList.add('instruction-toast');
        }
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ];
        const defaultEnd = er.bool(0.5);
        const placement = defaultEnd ? 'dock' : er.pick(['title', 'link']);
        const picked = defaultEnd ? 'Submit' : labels[er.int(0, labels.length - 1)];
        const text = typeof picked === 'string' ? picked : picked.label || picked.text || String(picked);
        const parent = placement === 'title' ? titlebar : dock;
        const cls =
          placement === 'title'
            ? 'submit submit-title'
            : placement === 'link'
              ? 'submit-link'
              : placement === 'icon'
                ? 'submit submit-icon'
                : 'submit';
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, placement === 'icon' ? '✓' : text);
        submit.type = 'button';
        if (placement === 'link') submit.href = '#';
        submit.setAttribute('aria-label', text);
        submit.title = text;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
            .filter((x) => x.trim().toLowerCase() !== text.trim().toLowerCase());
          if (options.length) {
            const other = options[cr.int(0, options.length - 1)];
            const decoy = u.el('button', 'dock-xtra', tools, other);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: other, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
