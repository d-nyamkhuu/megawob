(function () {
  'use strict';
  const cfg = {
    title: 'Customer Information - CRM',
    tabs: ['Home', 'Insert', 'View', 'Tools'],
    heading: 'Customer Information',
    date: 'Tuesday, April 15, 2008',
    obstacle: 'Welcome!',
    copy: 'This short tour will show you around the interface.',
    dismiss: 'Skip tour',
  };
  const ICONS = {
    doc: '<path d="M8 3h13l7 7v19H8Z" fill="#fff" stroke="#8a97a8"/><path d="M21 3v7h7" fill="#dde4ee" stroke="#8a97a8"/>',
    open: '<path d="M3 9h10l3 3h13v15H3Z" fill="#f2c64a" stroke="#b8861c"/><path d="M3 27l5-11h24l-5 11Z" fill="#ffe08a" stroke="#b8861c"/>',
    save: '<path d="M4 4h22l4 4v22H4Z" fill="#2b5fae" stroke="#143a7a"/><rect x="9" y="4" width="14" height="9" fill="#e8eef7"/><rect x="9" y="19" width="16" height="11" fill="#cfd8e6"/>',
    cut: '<path d="M10 3l10 17M24 3 14 20" stroke="#8a97a8" stroke-width="2" fill="none"/><circle cx="11" cy="25" r="4" fill="none" stroke="#2457b5" stroke-width="2.5"/><circle cx="23" cy="25" r="4" fill="none" stroke="#2457b5" stroke-width="2.5"/>',
    copy: '<path d="M6 4h14v18H6Z" fill="#fff" stroke="#8a97a8"/><path d="M13 10h14v19H13Z" fill="#e9eef6" stroke="#6f7f95"/><path d="M16 16h8M16 20h8M16 24h8" stroke="#7fa0cf"/>',
    paste:
      '<rect x="5" y="6" width="22" height="24" rx="2" fill="#d9a44e" stroke="#98691c"/><rect x="11" y="3" width="10" height="6" fill="#aab4c4" stroke="#6f7f95"/><path d="M12 13h18v17H12Z" fill="#fff" stroke="#8a97a8"/>',
    find: '<circle cx="14" cy="14" r="9" fill="#e6f1fb" stroke="#35649f" stroke-width="3"/><path d="M21 21l9 9" stroke="#24456f" stroke-width="5" stroke-linecap="round"/>',
    abac: '<text x="2" y="16" font-size="13" fill="#24344f" font-family="Arial">abac</text><path d="M12 22l5 5 11-12" stroke="#4a6fa8" stroke-width="3.5" fill="none"/>',
    abc: '<text x="3" y="15" font-size="14" font-weight="700" fill="#24344f" font-family="Arial">ABC</text><path d="M7 23l7 7 15-16" stroke="#2f62b3" stroke-width="4" fill="none"/>',
    help: '<circle cx="17" cy="17" r="14" fill="url(#blue)" stroke="#164b97"/><circle cx="17" cy="17" r="12.5" fill="none" stroke="#a6d5ff" stroke-width=".7"/><text x="17" y="25" font-size="26" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial">?</text>',
    add: '<path d="M13 3h8v10h10v8H21v10h-8V21H3v-8h10Z" fill="url(#green)" stroke="#357726"/><path d="M15 4h4v11h11v3H18v12h-3V18H4v-3h11Z" fill="#fff" opacity=".3"/>',
    pen: '<g transform="rotate(40 17 17)"><path d="M13 5h9v21l-4.5 6-4.5-6Z" fill="url(#gold)" stroke="#93652a"/><path d="M13 26h9l-4.5 6Z" fill="#ead1a1"/><path d="m15.8 30 1.7 2 1.7-2Z" fill="#333"/><path d="M13 5V3q4-3 9 0v2Z" fill="#d26b51" stroke="#9a4536"/><path d="M13 6h9v3h-9Z" fill="#e9edf1"/><path d="M15 10v15" stroke="#fff4b8" stroke-width="2"/></g>',
    undo: '<path d="M13 3 2 13l11 10v-7h6c10 0 10 12 0 12h-9v5h9c18 0 18-22 0-22h-6Z" fill="url(#sky)" stroke="#3d699b" stroke-linejoin="round"/><path d="m12 5-8 8 8 7M14 13h5c15 0 15 17 0 17h-8" fill="none" stroke="#c7e9ff" stroke-width=".8"/>',
  };
  const defs =
    '<defs><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#a4d9ff"/><stop offset=".45" stop-color="#3c86dc"/><stop offset="1" stop-color="#1754aa"/></linearGradient><linearGradient id="gold" x2=".7" y2="1"><stop stop-color="#fff9b4"/><stop offset=".45" stop-color="#ffdb65"/><stop offset="1" stop-color="#e8a91c"/></linearGradient><linearGradient id="green" x2="0" y2="1"><stop stop-color="#8ce563"/><stop offset="1" stop-color="#23951c"/></linearGradient><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#c4e7ff"/><stop offset="1" stop-color="#4794e3"/></linearGradient><linearGradient id="paper" x2=".3" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d8e9f9"/></linearGradient></defs>';
  ICONS.doc =
    '<path d="M7 3h15l7 7v21H7Z" fill="url(#paper)" stroke="#7895b6"/><path d="M22 3v7h7" fill="#dce9f6" stroke="#7895b6"/><path d="M10 13h15M10 16h15M10 19h15M10 22h15M10 25h15M10 28h15" stroke="#b0c5dc" stroke-width=".7"/><path d="M9 4v25" stroke="#fff"/>';
  ICONS.open =
    '<path d="M3 9V6q0-2 2-2h9l3 4h11v21H3Z" fill="url(#gold)" stroke="#c19729"/><path d="M4 13h27l-4 16H2Z" fill="url(#gold)" stroke="#bb881e"/><path d="M5 15h24M5 10h19" stroke="#fff5bb"/>';
  ICONS.save =
    '<path d="M4 3h24l2 2v27H4Z" fill="url(#blue)" stroke="#284b89"/><path d="M9 3h16v13H9Z" fill="url(#paper)" stroke="#496c9d"/><path d="M22 4v10" stroke="#bdc7d4" stroke-width="2"/><path d="M9 22h16v10H9Z" fill="#e2e8ec" stroke="#43608a"/><path d="M12 25h5v7h-5Z" fill="#3264b1"/><path d="M5 4v26" stroke="#a3d5ff"/>';
  ICONS.find =
    '<circle cx="14" cy="14" r="10" fill="url(#sky)" stroke="#345f8c"/><circle cx="14" cy="14" r="7.8" fill="#e4f4ff" stroke="#fff"/><path d="m22 22 8 8" stroke="#283842" stroke-width="5" stroke-linecap="round"/><path d="m23 22 7 7" stroke="#73818c" stroke-width="1.3"/>';
  ICONS.cut =
    '<path d="M12 22C14 16 8 10 11 2c2 0 2 12 7 17L23 2c3 8-2 15-6 21" fill="#d4dde7" stroke="#7d8b9a" stroke-width="1.2"/><path d="M12 3c0 9 2 11 5 15M23 3l-5 15" stroke="white" stroke-width=".8" fill="none"/><path d="M14 23c-2-5-7-3-7 2 0 8 9 8 9 1l2-7 2 7c0 7 9 7 9-1 0-5-5-7-7-2" fill="url(#blue)" stroke="#315981"/><ellipse cx="11.5" cy="26" rx="2.2" ry="3.2" fill="#dbe9f5"/><ellipse cx="24.5" cy="26" rx="2.2" ry="3.2" fill="#dbe9f5"/><circle cx="18" cy="19" r="1" fill="#59718d"/>';
  ICONS.copy =
    '<path d="M10 2h12l6 6v22H10Z" fill="url(#paper)" stroke="#7a9dbf"/><path d="M22 2v6h6" fill="#e0ebf5" stroke="#7a9dbf"/><path d="M4 7h10l5 5v16H4Z" fill="url(#paper)" stroke="#7a9dbf"/><path d="M14 7v5h5" fill="#dceaf5" stroke="#7a9dbf"/><path d="M14 13h11v19H14Z" fill="url(#paper)" stroke="#7296b7"/><path d="M6 16h5M6 19h5M6 22h5M16 18h7M16 21h7M16 24h7M16 27h7M16 30h7" stroke="#a9c2de" stroke-width=".7"/>';
  ICONS.paste =
    '<rect x="5" y="6" width="22" height="24" rx="1" fill="url(#gold)" stroke="#9d7e39"/><path d="M7 8h18v20H7Z" fill="none" stroke="#fff5b5"/><path d="M12 4h3V2h4v2h3v5H12Z" fill="#dce3e8" stroke="#6b7884"/><path d="M15 15h12l4 4v14H15Z" fill="url(#paper)" stroke="#7795af"/><path d="M27 15v5h4M17 23h11M17 26h11M17 29h11" stroke="#b0c1d1" fill="none"/>';
  ICONS.abc =
    '<text x="2" y="13" font-size="14" font-weight="700" fill="#26303d" font-family="Arial">ABC</text><path d="m7 23 6 6 16-17-4-3-12 14-3-3Z" fill="url(#sky)" stroke="#37689e" stroke-width=".8"/><path d="m8 23 5 4L27 12" fill="none" stroke="#c8e7ff" stroke-width=".8"/>';
  ICONS.abac =
    '<text x="2" y="16" font-size="13" fill="#26303d" font-family="Arial">ab<tspan fill="#669acf">ac</tspan></text><path d="m15 23 5 5 9-11-3-2-6 8-3-3Z" fill="url(#sky)" stroke="#426e91" stroke-width=".7"/>';
  const GROUPS = [
    [
      'File',
      [
        ['New<br>Record', 'doc'],
        ['Open', 'open'],
        ['Save', 'save'],
      ],
    ],
    [
      'Clipboard',
      [
        ['Cut', 'cut'],
        ['Copy', 'copy'],
        ['Paste', 'paste'],
      ],
    ],
    [
      'Editing',
      [
        ['Find', 'find'],
        ['Replace', 'abac'],
      ],
    ],
    ['Review', [['Spelling', 'abc']]],
    ['Help', [['Help', 'help']]],
  ];
  env.site({
    name: 'design-click-control-widget-09',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref office';
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const usual = er.bool(0.5);
      const placement = usual ? 'footer' : er.pick(['ribbon', 'link']);
      const endLabel = usual ? 'Submit' : er.pick(endLabels.filter((x) => x !== 'Submit'));
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      const logDecoy = (el, label, collides = false) =>
        el.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
      const shell = u.el('main', 'shell', document.body);
      const tb = u.el('div', 'titlebar', shell);
      u.el('span', 'app-icon', tb).innerHTML =
        '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#ecf4f5" stroke="#718a94"/><path d="M8 7h9v8H8Z" fill="#86b2de" stroke="#466d89"/><path d="M17 9h8v9h-8Z" fill="#f0c147" stroke="#9c9038"/><path d="M8 18h10v8H8Z" fill="#a9b4c5" stroke="#65778d"/><path d="M19 18h5l2 6h-6Z" fill="#6ba652"/><path d="m6 11 15 11M10 9l12 13" stroke="white" stroke-width="2"/></svg>';
      u.el('span', 'title', tb, cfg.title);
      const wc = u.el('span', 'wincap', tb);
      wc.innerHTML = '<i class="min"></i><i class="max"></i><i class="cls">✕</i>';
      const tabs = u.el('div', 'tabs', shell);
      cfg.tabs.forEach((t, i) => logDecoy(u.el('span', i === 0 ? 'tab on' : 'tab', tabs, t), t));
      const rib = u.el('div', 'ribbon', shell);
      GROUPS.forEach((g) => {
        const grp = u.el('div', 'rgroup', rib);
        const row = u.el('div', 'rbtns', grp);
        g[1].forEach((b) => {
          const d = u.el('div', 'rbtn', row);
          const ic = u.el('span', 'ric', d);
          ic.innerHTML = '<svg viewBox="0 0 34 34" width="100%" height="100%">' + defs + ICONS[b[1]] + '</svg>';
          const l = u.el('span', 'rlbl', d);
          l.innerHTML = b[0];
          logDecoy(d, l.textContent);
        });
        u.el('div', 'rname', grp, g[0]);
      });
      const ribbonActions = u.el('div', 'ribbon-actions', rib);
      if (collide) {
        const b = u.el('button', 'chrome-xtra', ribbonActions, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        logDecoy(b, collide, true);
      }
      const work = u.el('div', 'work', shell);
      const hd = u.el('div', 'formhead', work);
      u.el('h1', '', hd, cfg.heading);
      u.el('span', 'date', hd, cfg.date);
      const center = u.el('section', 'center', work);
      const display =
        (ctx.display === 'panel' && shell.clientWidth < 1260) || (ctx.display === 'toast' && shell.clientHeight < 700)
          ? 'header'
          : ctx.display;
      center.dataset.display = display;
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      const tools = u.el('div', 'dock-tools', foot);
      [
        ['Add Record', 'add'],
        ['Clear Form', 'pen'],
        ['Reset', 'undo'],
      ].forEach((t) => {
        const b = u.el('span', 'dbtn', tools);
        const i = u.el('span', 'dic ' + t[1], b);
        i.innerHTML = '<svg viewBox="0 0 34 34">' + defs + ICONS[t[1]] + '</svg>';
        u.el('span', '', b, t[0]);
        logDecoy(b, t[0]);
      });
      if (!ctx.finish && placement !== 'ribbon') u.el('span', 'vsep', foot);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'ribbon' ? 'submit ribbon-end' : placement === 'link' ? 'end-link' : 'submit',
          placement === 'ribbon' ? ribbonActions : foot,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      foot.classList.toggle('footer-no-end', ctx.finish || placement === 'ribbon');
      logDecoy(u.el('span', 'closebtn', foot, 'Close'), 'Close');
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.kind === 'chat') {
        const old = document.querySelector('.design-obstacle');
        if (old) old.hidden = true;
        const el = ctx.util.el('section', 'perturb chat tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const next = ctx.util.el('button', 'next-design', el, 'Next');
        next.type = 'button';
        next.addEventListener('click', ctx.dismiss);
        const x = ctx.util.el('button', 'x-design', el, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        x.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
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
