(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-one-06',
    'brand': 'Social Task Manager',
    'mode': 'bottom',
    'tokens': {
      'bg': '#d9e7f5',
      'panel': '#f8fbff',
      'fg': '#072c60',
      'accent': '#188de0',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'Home    View    Tools    Help',
    'obstruction': null,
    'footer': '',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const ends = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = ends.map(labelOf);
      const placement = endR.pick([
        'header',
        'header',
        'header',
        'header',
        'header',
        'footer',
        'footer',
        'link',
        'icon',
      ]);
      const label = endR.bool(0.5) ? 'Submit' : labelOf(endR.pick(ends));
      const collidePool = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = collideR.bool(0.3) && collidePool.length ? labelOf(collideR.pick(collidePool)) : null;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'Chirp 1.2 - Social Client');
      const wc = u.el('div', 'window-controls', header);
      for (const [cl, label] of [
        ['min', '−'],
        ['max', '□'],
        ['close', '×'],
      ])
        u.el('span', cl, wc, label);
      u.el('nav', 'design-nav', header, 'File    Edit    View    Tools    Help');
      const ribbon = u.el('div', 'office-ribbon', header);
      const paths = {
        home: '<path d="M3 11L12 3l9 8M5 10v11h14V10M10 21v-7h4v7"/>',
        refresh: '<path d="M20 8a8 8 0 1 0 0 9M20 3v6h-6"/>',
        folder: '<path d="M3 6h7l2 3h9v12H3z"/>',
        save: '<path d="M3 3h16l2 3v15H3zM7 3v7h10V3M7 21v-7h10v7"/>',
        search: '<circle cx="10" cy="10" r="7"/><path d="M15 15l7 7"/>',
        filter: '<path d="M3 3h18l-7 9v9l-4-3v-6z"/>',
        mail: '<rect x="2" y="4" width="20" height="16" rx="1"/><path d="M2 5l10 8L22 5"/>',
        star: '<path d="M12 2l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/>',
        gear: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
      };
      for (const [label, key] of [
        ['Refresh', 'home'],
        ['New Post', 'refresh'],
        ['Open', 'folder'],
        ['Save', 'save'],
        ['Search', 'search'],
        ['Filter', 'filter'],
        ['Mark Read', 'mail'],
        ['Mark Unread', 'mail'],
        ['Favorite', 'star'],
        ['Settings', 'gear'],
        ['Help', 'gear'],
      ]) {
        const b = u.el('button', 'ribbon-tool', ribbon);
        b.type = 'button';
        b.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' + paths[key] + '</svg>';
        u.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      for (const [name, start, end] of [
        ['Timeline', 0, 1],
        ['File', 1, 4],
        ['Find', 4, 6],
        ['Actions', 6, 9],
        ['Options', 9, 11],
      ]) {
        const group = u.el('section', 'ribbon-group', ribbon);
        for (const b of Array.from(ribbon.querySelectorAll(':scope > button')).slice(0, end - start)) group.append(b);
        u.el('span', 'ribbon-group-name', group, name);
      }
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      u.el('h2', '', note, ctx.display === 'panel' ? 'Task information' : 'Your Task');
      if (ctx.display !== 'hidden') {
        u.el('span', 'task-clipboard', note, '▣');
        const instruction = u.el('p', '', note, ctx.instruction);
        instruction.style.fontSize = `clamp(16px, calc((100vw - 300px) / ${Math.max(1, ctx.instruction.length * 0.52)}), 40px)`;
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const det = u.el('aside', 'detail-pane', body);
      u.el('div', 'pane-title', det, 'Post Details');
      const dh = u.el('div', 'dp-head', det);
      u.el('div', 'dp-av', dh);
      const dm = u.el('div', '', dh);
      u.el('b', '', dm, 'Selected post');
      u.el('div', 'dp-sub', dm, 'Apr 22, 2024   10:24 AM');
      u.el('p', 'dp-text', det, 'Small steps, big progress. Grateful for today.');
      const dbar = u.el('div', 'dp-btns', det);
      for (const l of ['Reply', 'Retweet', 'Like', '···']) {
        const b = u.el('button', 'dp-btn', dbar, l);
        b.type = 'button';
        b.dataset.action = l === '···' ? 'more' : l.toLowerCase();
      }
      u.el('div', 'dp-stats', det).innerHTML = '<b>12</b> Reposts &nbsp; <b>48</b> Likes';
      for (const [n, t, a] of [
        ['@mikechen', 'Totally agree. 👏', '42m'],
        ['@sarahlim', 'Needed to hear this today.', '1h'],
        ['@emilyzhou', 'Well said!', '2h'],
      ]) {
        const r = u.el('div', 'dp-reply', det);
        u.el('div', 'dp-rav', r);
        const rt = u.el('div', '', r);
        u.el('b', '', rt, n);
        const replyText = u.el('div', '', rt, t.replace(' 👏', ''));
        if (t.includes('👏')) u.el('span', 'clap-sprite', replyText);
        u.el('span', 'dp-age', r, a);
      }
      const lower = u.el('section', 'office-lower', body);
      const details = u.el('div', 'task-details', lower);
      u.el('h3', '', details, 'Task Details');
      const fields = u.el('dl', 'task-detail-fields', details);
      for (const [label, value] of [
        ['Action:', 'Use the requested post action.'],
        ['Target Author:', ''],
        ['Post Starts With:', ''],
        ['Status:', 'Not completed'],
      ]) {
        u.el('dt', '', fields, label);
        u.el('dd', 'detail-' + label.split(':')[0].replaceAll(' ', '-').toLowerCase(), fields, value);
      }
      const right = u.el('div', 'office-reminder-side', lower);
      const reminder = u.el('div', 'office-reminder', right);
      u.el('b', '', reminder, 'ⓘ  Reminder');
      u.el('p', '', reminder, ctx.instruction);
      const actionbar = u.el('div', 'office-final-actions', right);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const tools = u.el('div', 'footer-tools', footer);
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (collide) decoyBtn(tools, collide);
      let submit = null;
      if (!ctx.finish) {
        const target =
          placement === 'footer' ||
          placement === 'link' ||
          (ctx.display === 'hidden' && (placement === 'header' || placement === 'icon'))
            ? tools
            : note;
        const link = placement === 'link';
        submit = u.el(
          link ? 'a' : 'button',
          'end-control' + (link ? ' end-link' : '') + (placement === 'icon' ? ' end-icon' : ''),
          target,
          placement === 'icon' ? '✓' : link ? label + ' ›' : label,
        );
        if (link) submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit.dataset.role = 'submit';
      }
      const clear = u.el('button', 'clear-task', actionbar, 'Clear');
      clear.addEventListener('click', () => env.log('decoy', { what: 'Clear' }));
      const sc = u.el('span', 'status-count', footer);
      u.el('span', 'post-count', sc, '6 posts');
      u.el('i', 'online-dot', sc);
      u.el('span', '', sc, 'Online');
      u.el('span', 'resize-grip', footer);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
