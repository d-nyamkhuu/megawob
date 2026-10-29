(function () {
  'use strict';
  const menus = ['Workspace', 'Applications', 'File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help'];
  const wmenus = ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Options'];
  const tools = [
    [
      'New Window',
      '<path d="m7 2 7 1v2l-2 1-1 5 2 2-1 1-8-1v-2l3-1 1-5-2-1z" fill="#777"/><path d="m8 14-1 5M8 3l5 1"/>',
    ],
    ['Open File...', '<path d="M3 6V3h5l2 2h7v3M2 7h7l2 1h8l-3 9H2z" fill="#c7cdd2"/>'],
    [
      'Print...',
      '<path d="M5 7V2h10v6" fill="#f4f4f4"/><path d="M2 7h16v9H2z" fill="#999"/><path d="M4 10h12M5 13h10v6H5z" fill="#eee"/><path d="M7 16h6M15 9h1"/>',
    ],
    ['Find...', '<circle cx="8" cy="8" r="6" fill="#ddd"/><path d="m12.5 12.5 5 5" stroke-width="3"/>'],
  ];
  const svg = (p) =>
    '<svg viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linejoin="round">' + p + '</svg>';
  env.site({
    name: 'design-click-control-link-08',
    styles: ['openlook.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ol';
      const roomy = window.innerWidth >= 1260,
        tall = window.innerHeight >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      const endR = ctx.rng.fork('chrome/end');
      const endPool = (ctx.content && ctx.content.END_LABELS) || [
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
      const labels = endPool.map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)));
      const keepDefault = endR.bool(0.5);
      const endLabel = keepDefault
        ? labels.find((x) => String(x).trim().toLowerCase() === 'submit') || 'Submit'
        : endR.pick(labels) || 'Done';
      const place = ctx.finish ? null : keepDefault ? 'status' : endR.pick(['palette', 'toolbar', 'status']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const bar = u.el('div', 'ol-menubar', document.body);
      menus.forEach((m, i) => u.el('span', 'ol-mi' + (i === 0 ? ' on' : ''), bar, m));
      u.el('span', 'ol-clock', bar, 'Mon Mar 9   10:24 AM');
      const win = u.el('main', 'ol-win', document.body);
      const tb = u.el('div', 'ol-title', win);
      u.el('span', 'ol-pin', tb);
      u.el('span', 'ol-ttext', tb, 'Web Browser – Welcome');
      u.el('span', 'ol-wbtn min', tb);
      u.el('span', 'ol-wbtn max', tb);
      const mb = u.el('div', 'ol-wmenu', win);
      wmenus.forEach((m) => u.el('span', '', mb, m));
      u.el('span', 'ol-help', mb, 'Help');
      let submit = null;
      const endBtn = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const decoy = (parent, label) => {
        const b = u.el('button', 'ol-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      if (place === 'toolbar') submit = endBtn(mb, 'ol-end-toolbar', endLabel);
      if (collide && place === 'toolbar') decoy(mb, collide);
      const nav = u.el('div', 'ol-nav', win);
      [
        ['Back', '<path d="M14 3 5 10l9 7z" fill="#333"/>', 0],
        ['Forward', '<path d="M6 3l9 7-9 7z" fill="#999" stroke="#999"/>', 1],
        ['Home', '<path d="M2 10 10 2l8 8-2 1-1-1v8h-4v-6H8v6H4v-8l-1 1z" fill="#ccc"/><path d="M13 3v3"/>', 0],
        [
          'Reload',
          '<path d="m7 2 7 1v2l-2 1-1 5 2 2-1 1-8-1v-2l3-1 1-5-2-1z" fill="#555"/><path d="m8 14-1 5M8 3l5 1"/>',
          0,
        ],
        ['Stop', '<path d="m6 2 8 0 5 5v7l-5 5H6l-5-5V7z" fill="#aaa" stroke="#777"/>', 1],
      ].forEach((t) => {
        const b = u.el('span', 'ol-navb' + (t[2] ? ' dim' : ''), nav);
        b.innerHTML = svg(t[1]);
        u.el('span', '', b, t[0]);
      });
      const loc = u.el('div', 'ol-loc', win);
      u.el('span', '', loc, 'Location:');
      u.el('span', 'ol-url', loc, 'http://example.com/resources.html');
      u.el('span', 'ol-drop', loc);
      const body = u.el('div', 'ol-body', win);
      const sb = u.el('div', 'ol-vscroll', body);
      u.el('i', 'up', sb);
      u.el('i', 'thumb', sb);
      u.el('i', 'dn', sb);
      const page = u.el('div', 'ol-page', body);
      const note = u.el('div', 'instruction', page, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'panel') {
        page.classList.add('panel-mode');
        note.classList.add('instruction-panel');
      }
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        document.body.append(note);
      }
      const stage = u.el('div', 'stage', page);
      const st = u.el('div', 'ol-status', win);
      u.el('span', 'ol-stic', st);
      const statusText = u.el('span', 'ol-sttext', st, 'Document: Done');
      if (place === 'status') submit = endBtn(st, 'ol-end-status', endLabel);
      if (collide && place === 'status') decoy(st, collide);
      const pal = u.el('aside', 'ol-pal', document.body);
      const pt = u.el('div', 'ol-ptitle', pal);
      u.el('span', 'ol-pin', pt);
      u.el('span', 'ol-ttext', pt, 'Tools');
      u.el('span', 'ol-wbtn min', pt);
      u.el('span', 'ol-wbtn x', pt);
      const pb = u.el('div', 'ol-pbody', pal);
      tools.forEach((t) => {
        const b = u.el('div', 'ol-pbtn', pb);
        const ic = u.el('span', 'ol-pic', b);
        ic.innerHTML = svg(t[1]);
        u.el('span', '', b, t[0]);
      });
      if (!ctx.finish && place === 'palette') submit = endBtn(pb, 'ol-pbtn submit', endLabel);
      if (collide && place === 'palette') decoy(pb, collide);
      const tr = u.el('div', 'ol-trash', document.body);
      tr.innerHTML =
        '<svg viewBox="0 0 50 72" fill="none" stroke="#303846" stroke-width="1.6"><defs><linearGradient id="trash-metal"><stop stop-color="#71849c"/><stop offset=".25" stop-color="#e6eaf0"/><stop offset=".5" stop-color="#9dacc1"/><stop offset=".75" stop-color="#d9e0e9"/><stop offset="1" stop-color="#63768e"/></linearGradient></defs><path d="M7 20 12 64q13 9 26 0l5-44" fill="url(#trash-metal)"/><ellipse cx="25" cy="20" rx="23" ry="8" fill="url(#trash-metal)"/><ellipse cx="25" cy="17" rx="19" ry="5" fill="#c5cedc"/><path d="M16 15q0-11 9-11t9 11h-4q0-7-5-7t-5 7z" fill="#c5cedc"/><path d="m13 29 3 33m4-32 1 34m7-34-1 34m9-35-3 33" stroke="#53647b" stroke-width="2"/><path d="m15 29 3 33m4-32 1 34m7-34-1 34m9-35-3 33" stroke="#e0e6ef"/></svg>';
      u.el('span', '', tr, 'Trash');
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
