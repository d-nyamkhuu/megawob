(function () {
  'use strict';
  const C = { 'site': 'design-type-text-login-09', 'brand': 'User Access Manager', 'menu': 'File|Edit|View|Tools|Help' };
  const ROWS = [
    ['1001', 'Alice Brown', 'alice.brown@example.com', 'Admin', 'Active', '2024-05-10 14:22'],
    ['1002', 'Mark Chen', 'mark.chen@example.com', 'Editor', 'Active', '2024-05-09 09:11'],
    ['1003', 'Priya Singh', 'priya.singh@example.com', 'Viewer', 'Active', '2024-05-08 16:45'],
    ['1004', 'Daniel Lee', 'daniel.lee@example.com', 'Editor', 'Inactive', '2024-04-30 11:02'],
    ['1005', 'Sofia Martinez', 'sofia.martinez@example.com', 'Viewer', 'Active', '2024-05-07 13:18'],
    ['1006', 'Luca Rossi', 'luca.rossi@example.com', 'Editor', 'Active', '2024-05-06 10:33'],
    ['1007', 'Emma Wilson', 'emma.wilson@example.com', 'Viewer', 'Inactive', '2024-04-28 08:21'],
    ['1008', 'Chen Wei', 'chen.wei@example.com', 'Admin', 'Active', '2024-05-05 17:09'],
    ['1009', 'Fatima Khan', 'fatima.khan@example.com', 'Viewer', 'Active', '2024-05-04 12:56'],
    ['1010', 'Noah Patel', 'noah.patel@example.com', 'Editor', 'Active', '2024-05-03 15:40'],
  ];
  const SV = (b) =>
    '<svg viewBox="1 1 22 22" width="26" height="26"><defs><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#e6f7ff"/><stop offset=".45" stop-color="#77b9ef"/><stop offset="1" stop-color="#216bb4"/></linearGradient><linearGradient id="gold" x2="1" y2="1"><stop stop-color="#fff6b7"/><stop offset=".45" stop-color="#efc45c"/><stop offset="1" stop-color="#c58719"/></linearGradient><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#cbddec"/></linearGradient><linearGradient id="green" x2="1" y2="1"><stop stop-color="#daf5bb"/><stop offset="1" stop-color="#239847"/></linearGradient></defs>' +
    b
      .replace(/fill="#(?:5b8fd6|4a7fc8)"/g, 'fill="url(#blue)"')
      .replace(/fill="#(?:e8a838|e8b020|f0c8a0|f6d8b8)"/g, 'fill="url(#gold)"')
      .replace(/fill="#fff"/g, 'fill="url(#paper)"')
      .replace(/fill="#3aa84a"/g, 'fill="url(#green)"') +
    '</svg>';
  const ICO = {
    user: SV(
      '<circle cx="9" cy="7" r="4" fill="#f0c8a0" stroke="#7a5a3a"/><path d="M2 20c0-6 4-8 7-8s7 2 7 8z" fill="#5b8fd6" stroke="#2a4a86"/><circle cx="17" cy="9" r="3" fill="#f6d8b8" stroke="#7a5a3a"/><path d="M13 20c0-4 2-6 4-6s5 2 5 6z" fill="#e8a838" stroke="#7a5a2a"/>',
    ),
    edit: SV(
      '<rect x="2" y="2" width="18" height="20" fill="#4a7fc8" stroke="#3a5a9a"/><rect x="4" y="4" width="14" height="16" fill="#fff" stroke="#c4ddf3"/><path d="M8 18l1-5L19 2l3 3-10 11z" fill="#4a7fc8" stroke="#1a3a7a"/><path d="M8 18l1-5 3 3z" fill="#f3d68a"/><path d="M11 13l8-9" stroke="#ebf8ff"/>',
    ),
    del: SV(
      '<path d="M4 4l16 16M20 4L4 20" stroke="#c82020" stroke-width="5" stroke-linecap="round"/><path d="M4 4l16 16M20 4L4 20" stroke="#f66" stroke-width="2" stroke-linecap="round"/>',
    ),
    ref: SV(
      '<path d="M3 2h13l5 5v15H3z" fill="#fff" stroke="#6e8195"/><path d="M16 2v5h5" fill="#c2dcf9" stroke="#6e8195"/><path d="M6 12a6 6 0 0 1 11-3M18 13a6 6 0 0 1-11 5" stroke="#2a68c8" stroke-width="2.5" fill="none"/><path d="M13 5l5 4-6 2M11 21l-5-3 5-4" fill="#4a7fc8" stroke="#345b88"/>',
    ),
    add: SV(
      '<circle cx="9" cy="7" r="4" fill="#f0c8a0" stroke="#7a5a3a"/><path d="M2 20c0-6 4-8 7-8s7 2 7 8z" fill="#5b8fd6" stroke="#2a4a86"/><circle cx="18" cy="17" r="5" fill="#3aa84a" stroke="#1a6a2a"/><path d="M18 14v6M15 17h6" stroke="#fff" stroke-width="2"/>',
    ),
    lock: SV(
      '<path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke="#957f46" stroke-width="3"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#fff0b4"/><rect x="4" y="11" width="16" height="11" rx="2" fill="#e8b020" stroke="#8a6010"/><circle cx="12" cy="15" r="2" fill="#634915"/><path d="M12 16v4" stroke="#634915" stroke-width="2"/>',
    ),
    log: SV(
      '<path d="M4 2h12l4 4v16H4z" fill="#fff" stroke="#667"/><path d="M16 2v4h4" fill="#a7c7e7" stroke="#667"/><path d="M7 7h3v4H7zM7 13h3v5H7z" fill="#4a7fc8" stroke="#53789d"/><path d="M12 8h5M12 11h5M12 14h5M12 17h5M7 20h10" stroke="#5a7ab0"/>',
    ),
    exp: SV(
      '<path d="M4 2h12l4 4v16H4z" fill="#fff" stroke="#667"/><path d="M16 2v4h4" fill="#a7c7e7" stroke="#667"/><path d="M7 8h7M7 11h5M7 14h3" stroke="#5a7ab0"/><path d="M14 12v4h-4v4h4v3l8-6z" fill="#3aa84a" stroke="#1a6a2a"/><path d="M15 14v3h-3" fill="none" stroke="#e2faca"/>',
    ),
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['toolbar', 'status']);
      const endLabel = original ? 'Submit' : er.pick(endWords);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(endWords.filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      const display =
        (ctx.display === 'panel' && !window.matchMedia('(min-width:1260px) and (min-height:700px)').matches) ||
        (ctx.display === 'toast' && !window.matchMedia('(min-height:700px)').matches)
          ? 'header'
          : ctx.display;
      const endBtn = (parent, cls) => {
        const b = u.el('button', 'ds-submit ' + cls, parent, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const decoyBtn = (parent, label) => {
        const b = u.el('button', 'q-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      const top = u.el('header', 'q-title', document.body);
      u.el('i', 'q-appico', top).innerHTML = SV(
        '<path d="M4 2h12l4 4v16H4z" fill="#fff" stroke="#65798a"/><path d="M6 8h10v11H6z" fill="#4a7fc8" stroke="#244a80"/><path d="M10 5l-3 9 4 4 5-8-2-5z" fill="none" stroke="#deefff"/>',
      );
      u.el('span', 'q-brand', top, C.brand);
      const wc = u.el('span', 'q-wc', top);
      ['_', '□', '×'].forEach((t) => u.el('b', '', wc, t));
      const nav = u.el('nav', 'q-menu', document.body);
      C.menu.split('|').forEach((t) => {
        const s = u.el('span', '', nav);
        s.innerHTML = t.charAt(0).replace(/./, (m) => '<u>' + m + '</u>') + t.slice(1);
      });
      const tb = u.el('div', 'q-toolbar', document.body);
      [
        ['New User', 'user'],
        ['Edit', 'edit'],
        ['Delete', 'del'],
        ['Refresh', 'ref'],
      ].forEach((p, i) => {
        if (i === 1 || i === 3) u.el('s', 'q-sep', tb);
        const b = u.el('span', 'q-tool', tb);
        const ic = u.el('i', 'q-ic', b);
        ic.dataset.icon = p[1];
        ic.innerHTML = ICO[p[1]];
        u.el('span', '', b, p[0]);
      });
      u.el('s', 'q-sep', tb);
      u.el('span', 'q-searchl', tb, 'Search:');
      u.el('span', 'q-search', tb);
      u.el('i', 'q-ic q-magnifier', tb).innerHTML = SV(
        '<circle cx="14" cy="9" r="6" fill="#dff0ff" stroke="#3a5a9a" stroke-width="2"/><path d="M10 13L3 21" stroke="#3a5a9a" stroke-width="3"/>',
      );
      const body = u.el('div', 'q-body', document.body);
      const left = u.el('div', 'q-left', body);
      const led = u.el('section', 'q-ledger', left);
      const lh = u.el('div', 'q-ph', led);
      u.el('span', '', lh, 'User Ledger');
      u.el('i', 'q-x', lh, '×');
      const tw = u.el('div', 'q-tablewrap', led);
      const tbl = u.el('table', 'q-table', tw);
      const th = u.el('tr', '', u.el('thead', '', tbl));
      ['ID', 'Name', 'Email', 'Role', 'Status', 'Last Login'].forEach((h) => u.el('th', '', th, h));
      const tbd = u.el('tbody', '', tbl);
      ROWS.forEach((r, i) => {
        const tr = u.el('tr', i === 1 ? 'sel' : '', tbd);
        r.forEach((c) => u.el('td', '', tr, c));
      });
      const scroll = u.el('div', 'q-vscroll', tw);
      u.el('b', 'q-scrollbutton up', scroll);
      u.el('i', 'q-thumb', scroll);
      u.el('b', 'q-scrollbutton down', scroll);
      const login = u.el('section', 'q-login', left);
      u.el('div', 'q-ph', login, 'Login to Continue');
      const lb = u.el('div', 'q-lbody', login);
      let note = null;
      if (display !== 'hidden') {
        note = u.el('aside', 'q-note' + (display === 'header' ? '' : ' q-note-' + display), lb);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', lb);
      const foot = u.el('footer', 'q-actions', login);
      let submit = null;
      if (!ctx.finish && placement === 'footer') submit = endBtn(foot, '');
      const clear = u.el('button', 'q-clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
      const right = u.el('div', 'q-right', body);
      const tasks = u.el('section', 'q-tasks', right);
      const th2 = u.el('div', 'q-ph', tasks);
      u.el('span', '', th2, '▾ Tasks');
      [
        ['Add User', 'add'],
        ['Edit User', 'edit'],
        ['Reset Password', 'lock'],
        ['View Logs', 'log'],
        ['Export List', 'exp'],
      ].forEach((p) => {
        const r = u.el('div', 'q-task', tasks);
        const ic = u.el('i', 'q-ic', r);
        ic.dataset.icon = p[1];
        ic.innerHTML = ICO[p[1]];
        u.el('span', '', r, p[0]);
      });
      u.el('hr', 'q-hr', tasks);
      u.el('div', 'q-ftitle', tasks, 'Filters');
      const fl = u.el('div', 'q-filters', tasks);
      ['Role:', 'Status:'].forEach((l) => {
        const r = u.el('div', 'q-frow', fl);
        u.el('span', '', r, l);
        const s = u.el('span', 'q-combo', r, 'All');
        u.el('i', '', s, '▾');
      });
      u.el('span', 'q-apply', fl, 'Apply');
      const pv = u.el('section', 'q-preview', right);
      const ph = u.el('div', 'q-ph', pv);
      u.el('span', '', ph, 'Preview');
      u.el('i', 'q-x', ph, '×');
      const pb = u.el('div', 'q-pbody', pv);
      u.el('i', 'q-person', pb);
      const pt = u.el('div', '', pb);
      u.el('b', '', pt, 'No user selected');
      u.el('div', 'q-pmuted', pt, 'Select a user from the list to view details here.');
      if (note && display === 'panel') {
        pb.classList.add('q-instruction-panel');
        pb.append(note);
      }
      if (note && display === 'toast') document.body.append(note);
      const st = u.el('footer', 'q-status', document.body);
      u.el('span', '', st, 'Ready');
      u.el('span', 'q-users', st, 'Users: 10');
      if (collide || (!ctx.finish && placement === 'toolbar')) {
        const tools = u.el('div', 'q-endtools', tb);
        if (collide) decoyBtn(tools, collide);
        if (!ctx.finish && placement === 'toolbar') submit = endBtn(tools, 'q-toolbar-end');
      }
      if (!ctx.finish && placement === 'status') {
        submit = endBtn(st, 'q-status-end');
        st.insertBefore(submit, st.querySelector('.q-users'));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
