(function () {
  'use strict';
  const ic = (p) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    p +
    '</svg>';
  const ICONS = {
    home: '<svg viewBox="0 0 56 56"><defs><linearGradient id="folder" x2="0" y2="1"><stop stop-color="#f8d384"/><stop offset="1" stop-color="#c38b36"/></linearGradient></defs><path d="M5 15V7q0-2 3-2h13l4 4h22v7" fill="#f9f7ed" stroke="#5f5549"/><path d="M5 13h44v28q0 3-3 3H7q-2 0-2-3Z" fill="url(#folder)" stroke="#60452b" stroke-width="1.5"/><path d="M7 16h39v25H7Z" fill="none" stroke="#ffe9b0"/><path d="m18 29 10-9 10 9h-4v9h-6v-6h-4v6h-5v-9Z" fill="#ba7628" stroke="#805028" stroke-width="1.3"/><path d="M7 11h37" stroke="white" stroke-width="2"/></svg>',
    disk: '<svg viewBox="0 0 56 56"><defs><linearGradient id="drive" x2=".3" y2="1"><stop stop-color="#fff"/><stop offset=".65" stop-color="#d0d1d0"/><stop offset="1" stop-color="#929694"/></linearGradient></defs><path d="M4 38 12 11q1-3 4-3h26q2 0 3 3l8 27v7H4Z" fill="url(#drive)" stroke="#5b5e5b" stroke-width="1.5"/><path d="M8 35 15 11h27l7 24Z" fill="none" stroke="#fff"/><ellipse cx="28" cy="22" rx="13" ry="8" fill="#d9dcda" stroke="#b8bcba"/><path d="M28 15q-11 0-11 7t14 7" fill="none" stroke="#fff" stroke-width="2"/><path d="M5 37h47v7H5Z" fill="#939796" stroke="#555"/><path d="M9 40h16m19 0h4" stroke="#d7d9d8" stroke-width="2"/></svg>',
    trash:
      '<svg viewBox="0 0 56 56"><defs><linearGradient id="bin"><stop stop-color="#757e80"/><stop offset=".3" stop-color="#e4e6e4"/><stop offset=".65" stop-color="#adb5b5"/><stop offset="1" stop-color="#626c70"/></linearGradient><radialGradient id="inside"><stop stop-color="#232d30"/><stop offset="1" stop-color="#687174"/></radialGradient></defs><path d="M8 11 13 44q2 7 15 7t15-7l5-33Z" fill="url(#bin)" stroke="#3e4648" stroke-width="1.5"/><ellipse cx="28" cy="12" rx="20" ry="9" fill="#d9dddd" stroke="#40484b" stroke-width="1.5"/><ellipse cx="28" cy="11" rx="17" ry="6.5" fill="url(#inside)" stroke="white"/><path d="m12 20 4 23q1 5 7 5" fill="none" stroke="#fff" opacity=".6"/></svg>',
    back: '<svg viewBox="0 0 32 32"><path d="M3 15 15 4q2-1 2 1v7h11q1 0 1 1v7q0 1-1 1H17v7q0 2-2 1L3 18q-2-1 0-3Z" fill="#81786b" stroke="#40382e" stroke-width="1.4"/><path d="m5 15 10-9m3 8h9" fill="none" stroke="#b8ae9d" stroke-width="1"/></svg>',
    fwd: '<svg viewBox="0 0 32 32"><path d="m29 15-12-11q-2-1-2 1v7H4q-1 0-1 1v7q0 1 1 1h11v7q0 2 2 1l12-11q2-1 0-3Z" fill="#cbc5bb" stroke="#aaa297" stroke-width="1.2"/><path d="m27 15-10-9M4 14h9" fill="none" stroke="#eee8de"/></svg>',
    reload:
      '<svg viewBox="0 0 32 32"><path d="m25 6 4-3v12H17l5-4a8 8 0 1 0 0 12l4 4A14 14 0 1 1 25 6Z" fill="#81786b" stroke="#40382e" stroke-width="1.3"/><path d="M24 8A11 11 0 1 0 23 26" fill="none" stroke="#b6ada0" stroke-width="1"/></svg>',
    logo: '<svg viewBox="0 0 28 28"><path d="M9 5 4 10l-2 1v5l3 1 5 6 7 1 4-5 3-2-1-6-4-4-2-4-5 1Z" fill="#df8e42" stroke="#79502c" stroke-width=".8"/><path d="m12 7-6 6 6 7 6-2 2-6-4-5Z" fill="#f4e6cf" stroke="#a66a36"/><circle cx="17" cy="4" r="3" fill="#edb574" stroke="#79502c" stroke-width=".7"/><circle cx="23" cy="18" r="3" fill="#edb574" stroke="#79502c" stroke-width=".7"/><circle cx="5" cy="14" r="3" fill="#edb574" stroke="#79502c" stroke-width=".7"/></svg>',
    globe:
      '<svg viewBox="0 0 24 24"><defs><radialGradient id="app"><stop stop-color="#ffe4a0"/><stop offset=".7" stop-color="#ce9232"/><stop offset="1" stop-color="#875719"/></radialGradient></defs><circle cx="12" cy="12" r="11" fill="url(#app)" stroke="#513c24"/><path d="m7 7 5-4 6 8-5 8-6-5Z" fill="#b3b2aa" stroke="#514c42"/><path d="m10 6 5 3-4 5 5 1m-5-9 1 12m-5-7 9 1" fill="none" stroke="#f4eee0" stroke-width=".8"/></svg>',
    ff: '<svg viewBox="0 0 28 28"><defs><radialGradient id="web"><stop stop-color="#8bc7ee"/><stop offset="1" stop-color="#184a86"/></radialGradient><linearGradient id="fox" x2="0" y2="1"><stop stop-color="#ffdb57"/><stop offset="1" stop-color="#d97615"/></linearGradient></defs><circle cx="14" cy="14" r="12" fill="url(#web)" stroke="#6e543c"/><path d="m5 4 3 4 5-2-1 5 4 2-7 3q4 7 11 1l-3-1 5-3-1-6q9 11-3 18C5 29-1 17 5 4Z" fill="url(#fox)" stroke="#a55b17" stroke-width=".8"/><path d="m8 10 4 1-4 2M17 23q7-4 6-11" fill="none" stroke="#ffe58a"/></svg>',
    help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#2f6fd0" stroke="#e8eefc" stroke-width="1.5"/><text x="12" y="17.5" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" font-family="Arial">?</text></svg>',
    vol: ic('<path d="M3 9h4l5-4v14l-5-4H3Z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/>'),
    mail: ic('<rect x="2" y="5" width="20" height="14" rx="1"/><path d="m2 6 10 8 10-8"/>'),
  };
  env.site({
    name: 'design-click-control-link-05',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      // Independent streams preserve every existing seeded widget draw.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const originalEnd = er.bool(0.5);
      const placement = originalEnd ? 'note' : er.pick(['toolbar', 'status']);
      const endLabel = originalEnd ? 'Submit' : er.pick(endLabels);
      const cr = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && collideLabels.length ? cr.pick(collideLabels) : null;
      document.body.className = 'ref gnome';
      // Each SVG owns its paint servers. Reusing bare IDs across desktop/taskbar
      // copies can leave URL references bound to a different icon after reset.
      let iconIndex = 0;
      const set = (el, h) => {
        const prefix = 'gnome-icon-' + iconIndex++ + '-';
        el.innerHTML = h
          .replace(/id="([^"]+)"/g, (_, id) => 'id="' + prefix + id + '"')
          .replace(/url\(#([^)]+)\)/g, (_, id) => 'url(#' + prefix + id + ')');
        return el;
      };
      // top panel
      const top = u.el('header', 'g-top', document.body);
      set(u.el('span', 'g-logo', top), ICONS.logo);
      ['Applications', 'Places', 'System'].forEach((t) => u.el('span', 'g-pm', top, t));
      set(u.el('span', 'g-ti', top), ICONS.ff);
      set(u.el('span', 'g-ti', top), ICONS.help);
      u.el('span', 'g-sp', top);
      set(u.el('span', 'g-ti g-mono', top), ICONS.vol);
      set(u.el('span', 'g-ti g-mono', top), ICONS.mail);
      u.el('span', 'g-clock', top, 'Mon Apr 24, 2006  10:15 AM');
      // desktop icons
      const di = u.el('div', 'g-desk', document.body);
      [
        ['home', 'Home'],
        ['disk', 'File System'],
        ['trash', 'Trash'],
      ].forEach(([k, t]) => {
        const d = u.el('div', 'g-di', di);
        set(u.el('span', '', d), ICONS[k]);
        u.el('b', '', d, t);
      });
      // window
      const win = u.el('main', 'shell g-win', document.body);
      const tb = u.el('div', 'g-title', win);
      set(u.el('i', 'g-wi', tb), ICONS.globe);
      u.el('span', '', tb, 'Web Links - Link Viewer');
      const wc = u.el('span', 'g-wc', tb);
      u.el('i', '', wc).innerHTML = '<s class="min"></s>';
      u.el('i', '', wc).innerHTML = '<s class="max"></s>';
      u.el('i', 'x', wc).innerHTML = '<s class="cls">✕</s>';
      const mb = u.el('div', 'g-menu', win);
      ['File', 'Edit', 'View', 'Help'].forEach((t) => {
        const s = u.el('span', '', mb);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      const tl = u.el('div', 'g-tool', win);
      [
        ['back', 'Back', 1],
        ['fwd', 'Forward', 0],
        ['reload', 'Reload', 1],
      ].forEach(([k, t, on]) => {
        const b = u.el('div', 'g-tb' + (on ? '' : ' off'), tl);
        set(u.el('span', '', b), ICONS[k]);
        u.el('em', '', b, t);
      });
      const tools = u.el('div', 'g-end-tools', tl);
      if (collide) {
        const b = u.el('button', 'g-xtra', tools, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const work = u.el('div', 'work', win);
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const st = u.el('footer', 'footer g-status', win);
      u.el('span', '', st, 'Done');
      u.el('span', 'g-grip', st);
      // task note
      const side = u.el('aside', 'g-task g-task-' + ctx.display, document.body);
      side.classList.toggle('g-task-note-only', ctx.finish || placement !== 'note');
      side.setAttribute('aria-label', 'Task');
      u.el('h2', '', side, 'Task');
      const note = u.el('div', 'instruction', side, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tools : placement === 'status' ? st : side;
        submit = u.el(placement === 'status' ? 'a' : 'button', 'submit g-end-' + placement, parent, endLabel);
        if (placement === 'status') submit.href = '#';
        else submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        // Avoid the native link-drag preview when the footer form is used.
        submit.draggable = false;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (ctx.display === 'hidden') {
        side.querySelector('h2').hidden = true;
        if (!submit || placement !== 'note') side.hidden = true;
      }
      // bottom panel
      const bot = u.el('footer', 'g-bot', document.body);
      set(u.el('span', 'g-bi', bot), ICONS.home);
      const tk = u.el('span', 'g-task-btn', bot);
      set(u.el('i', '', tk), ICONS.globe);
      u.el('span', '', tk, 'Web Links - Link Viewer');
      u.el('span', 'g-sp', bot);
      const ws = u.el('span', 'g-ws', bot);
      u.el('i', 'on', ws);
      u.el('i', '', ws);
      set(u.el('span', 'g-bin', bot), ICONS.trash);
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
