(function () {
  'use strict';
  env.site({
    name: 'design-click-control-sequence-08',
    styles: ['site.css', 'pastel.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref pastel';
      const I = {
        folder: '<svg viewBox="0 0 24 24"><path d="M2 6q0-3 2-3h5l3 3h8q2 0 2 2v13H2ZM2 9h20"/></svg>',
        home: '<svg viewBox="0 0 24 24"><path d="m2 11 10-9 10 9M5 9v13h5v-8h4v8h5V9"/></svg>',
        people:
          '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.500"/><path d="M3 20q0-6 6-6t6 6M16 5a3.500 3.500 0 0 1 0 6.500M18 14q3 1 3 6"/></svg>',
        trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
        gear: '<svg viewBox="0 0 24 24"><path d="m10 2 4 0 .7 3 2 .9 2.6-1.4 2 3.5-2.3 2v2l2.3 2-2 3.5-2.6-1.4-2 .9-.7 3h-4l-.7-3-2-.9-2.6 1.4-2-3.5 2.3-2v-2l-2.3-2 2-3.5 2.6 1.4 2-.9Z"/><circle cx="12" cy="11.5" r="3.4"/></svg>',
        min: '<svg viewBox="0 0 16 16"><path d="M2 8h12"/></svg>',
        max: '<svg viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="1"/></svg>',
        x: '<svg viewBox="0 0 16 16"><path d="m2 2 12 12M14 2 2 14"/></svg>',
        search: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg>',
        chev: '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>',
        check: '<svg viewBox="0 0 16 16"><path d="m3.500 8.500 3 3 6-7"/></svg>',
      };
      const D = (cls, parent, html, text) => {
        const e = u.el('div', cls, parent, text);
        if (html) e.innerHTML = html;
        return e;
      };
      const desk = u.el('main', 'desk', document.body);
      const top = u.el('header', 'topbar', desk);
      D('appicon', top, I.folder);
      u.el('span', 'apptitle', top, 'File Organizer');
      const sb = u.el('div', 'searchbox', top);
      D('ico', sb, I.search);
      u.el('span', '', sb, 'Search files...');
      const wc = u.el('span', 'wctl', top);
      D('', wc, I.min);
      D('', wc, I.max);
      D('', wc, I.x);
      const nav = u.el('nav', 'sidenav', desk);
      [
        ['Home', I.home],
        ['Projects', I.folder],
        ['Shared', I.people],
        ['Trash', I.trash],
      ].forEach((p, i) => {
        const r = u.el('div', 'navitem' + (i === 0 ? ' active' : ''), nav);
        D('ico', r, p[1]);
        u.el('span', '', r, p[0]);
      });
      const display = ctx.display || 'panel';
      const card = u.el('div', 'notecard ' + display, desk);
      u.el('div', 'tasklabel', card, 'Task');
      const note = u.el('div', 'instruction', card, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      card.hidden = display === 'hidden';
      if (display === 'header') card.classList.add('header-note');
      if (display === 'toast') card.classList.add('toast-note');
      const dlg = u.el('section', 'dlg', desk);
      const tb = u.el('div', 'dlgtitle', dlg);
      D('ico', tb, I.gear);
      u.el('span', '', tb, 'Organize Files');
      const dw = u.el('span', 'wctl', tb);
      D('', dw, I.min);
      D('', dw, I.max);
      D('', dw, I.x);
      const s1 = u.el('div', 'sec s1', dlg);
      u.el('h3', '', s1, '1. Select Source');
      u.el('div', 'flabel', s1, 'Folder:');
      u.el('div', 'finput', s1, 'C:\\Users\\Alex\\Downloads');
      u.el('div', 'fbrowse', s1, 'Browse...');
      const s2 = u.el('div', 'sec s2', dlg);
      u.el('h3', '', s2, '2. File Options');
      [
        ['Include subfolders', 1],
        ['Organize by file type', 0],
        ['Rename files (safe)', 0],
      ].forEach((c, i) => {
        const r = u.el('div', 'chk c' + i, s2);
        const b = D('box' + (c[1] ? ' on' : ''), r, c[1] ? I.check : '');
        u.el('span', '', r, c[0]);
      });
      u.el('div', 'sl l1', s2, 'File types:');
      u.el('div', 'sl l2', s2, 'Date range:');
      [
        ['All files', 'd1'],
        ['Any time', 'd2'],
      ].forEach((p) => {
        const d = u.el('div', 'dd ' + p[1], s2);
        u.el('span', '', d, p[0]);
        D('', d, I.chev);
      });
      const s3 = u.el('div', 'sec s3', dlg);
      u.el('h3', '', s3, '3. Actions');
      const stage = u.el('div', 'stage', dlg);
      let submit = null;
      let collide = null;
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
        const preferReference = er.bool(0.5);
        const picked = preferReference ? 'Submit' : er.pick(labels);
        const label =
          typeof picked === 'string' ? picked : (picked && (picked.label || picked.text || picked.name)) || 'Done';
        const placement = er.pick(['footer', 'footer', 'footer', 'title', 'link']);
        const endPlacement = preferReference ? 'footer' : placement === 'title' ? 'title' : 'link';
        submit = u.el('button', 'submit end-' + endPlacement, dlg, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            collide = u.el('button', 'end-xtra', dlg, cr.pick(pool));
            collide.type = 'button';
            collide.addEventListener('click', () => env.log('decoy', { label: collide.textContent, collide: true }));
          }
        }
      }
      const tk = u.el('footer', 'taskbar', desk);
      D(
        'win',
        tk,
        '<svg viewBox="0 0 28 28"><defs><linearGradient id="win-blue" x2="0" y2="1"><stop stop-color="#20bfff"/><stop offset="1" stop-color="#0075dc"/></linearGradient></defs><rect x="1" y="1" width="26" height="26" rx="2" fill="url(#win-blue)"/><path d="M14 1v26M1 14h26" stroke="#d8f4ff" stroke-width="1"/></svg>',
      );
      const ts = u.el('div', 'tsearch', tk);
      D('ico', ts, I.search);
      u.el('span', '', ts, 'Search');
      [
        '<svg viewBox="0 0 28 28"><path d="M1 5q0-2 2-2h8l3 3h11q2 0 2 2v16H1Z" fill="#f6bd38" stroke="none"/><path d="M1 9h26v15H1Z" fill="#ffd65a" stroke="none"/><path d="M1 9h26v3H1Z" fill="#ffe17b" stroke="none"/><path d="M6 18h16v7H6Z" fill="#51a8ec" stroke="none"/></svg>',
        '<svg viewBox="0 0 28 28"><defs><linearGradient id="chrome-green" x2="0" y2="1"><stop stop-color="#66c56b"/><stop offset="1" stop-color="#159947"/></linearGradient></defs><circle cx="14" cy="14" r="13" fill="#e74b3f" stroke="none"/><path d="M14 14 7 25.2A13 13 0 0 0 25.2 7.5H14Z" fill="#f6d140" stroke="none"/><path d="m14 14-6.5-11.3A13 13 0 0 0 7 25.2Z" fill="url(#chrome-green)" stroke="none"/><circle cx="14" cy="14" r="6" fill="#3f9ce8" stroke="#edf8ff" stroke-width="1.2"/></svg>',
        '<svg viewBox="0 0 28 28"><path d="m1 11 13-10 13 10v15H1Z" fill="#219ff1" stroke="none"/><path d="M4 10h20v12H4Z" fill="#8bd8ff" stroke="none"/><path d="m1 11 13 9 13-9v15H1Z" fill="#0088e0" stroke="none"/><path d="m1 26 10-9h6l10 9" fill="#28adf8" stroke="none"/></svg>',
        '<svg viewBox="0 0 28 28"><path d="m11 1 6 0 1 4 3 1 3-1 3 5-3 3v3l3 3-3 5-4-2-3 2-1 3h-5l-1-4-3-1-3 1-3-5 3-3v-3l-3-3 3-5 4 2 3-2Z" fill="#607b9f" stroke="none"/><circle cx="14" cy="14" r="5" fill="#d7e0f7" stroke="#476486" stroke-width="1.4"/></svg>',
      ].forEach((h) => {
        D('tico', tk, h);
      });
      const tray = u.el('div', 'tray', tk);
      [
        '<svg viewBox="0 0 16 16"><path d="m3.500 10.500 4.500-4.500 4.500 4.500"/></svg>',
        '<svg viewBox="0 0 24 24"><path d="M2 9a14 14 0 0 1 20 0M5 13a9 9 0 0 1 14 0M8.500 17a4 4 0 0 1 7 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>',
        '<svg viewBox="0 0 24 24"><path d="M3 9.500h4l5-4v13l-5-4H3ZM16 8.500a5 5 0 0 1 0 7M18.500 5.500a9 9 0 0 1 0 13"/></svg>',
      ].forEach((h) => D('', tray, h));
      u.el('span', 'clock', tk).innerHTML = '10:24 AM<br>Apr 25, 2024';
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
