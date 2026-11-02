(function () {
  'use strict';
  const D = { obstruction: null };
  const palette = { bg: '#d9e7f5', panel: '#f8fbff', fg: '#072c60', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'bottom instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'Chirp 1.2 - Social Client');
      const wc = u.el('div', 'window-controls', header);
      for (const [cl, label] of [['min', '−'], ['max', '□'], ['close', '×']]) u.el('span', cl, wc, label);
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
      for (const [label, key] of [['Refresh','home'],['New Post','refresh'],['Open','folder'],['Save','save'],['Search','search'],['Filter','filter'],['Mark Read','mail'],['Mark Unread','mail'],['Favorite','star'],['Settings','gear'],['Help','gear']]) {
        const b = u.el('button', 'ribbon-tool', ribbon);
        b.type = 'button';
        b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' + paths[key] + '</svg>';
        u.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      for (const [name, start, end] of [['Timeline',0,1],['File',1,4],['Find',4,6],['Actions',6,9],['Options',9,11]]) {
        const group = u.el('section', 'ribbon-group', ribbon);
        for (const b of Array.from(ribbon.querySelectorAll(':scope > button')).slice(0, end - start)) group.append(b);
        u.el('span', 'ribbon-group-name', group, name);
      }
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, body, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) instruction.style.fontSize = `clamp(16px, calc((100vw - 300px) / ${Math.max(1, _c.ctx.instruction.length * 0.52)}), 40px)`;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      // The task band is this client's native toolbar for episode controls.
      if (_c.display === 'hidden') _c.header = _c.util.el('div', 'hidden-tools', _c.shell);
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task information';
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const body = _c.body;
      _c.stage = u.el('main', 'stage', body);
      // The feed painter updates these legacy fields; they have no visible UI.
      const fields = u.el('div', 'office-lower', body);
      fields.hidden = true;
      for (const name of ['target-author', 'post-starts-with', 'action', 'status']) u.el('span', 'detail-' + name, fields);
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
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.prepend(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('design-footer');
      _c.shell.appendChild(footer);
      const label = footer.querySelector('.ref-foot-text');
      label.classList.add('footer-label');
      label.textContent = 'Ready';
      const tools = footer.querySelector('.ref-tools');
      tools.classList.add('footer-tools');
      const u = _c.util;
      const sc = u.el('span', 'status-count', footer);
      u.el('span', 'post-count', sc, '6 posts');
      u.el('i', 'online-dot', sc);
      u.el('span', '', sc, 'Online');
      u.el('span', 'resize-grip', footer);
      const hiddenTools = _c.shell.querySelector('.hidden-tools .ref-tools');
      if (hiddenTools) tools.prepend(...hiddenTools.children);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-use-social-feed-one-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#188de0'], LOW_ACCENTS: ['#188de0'], parts,
    },
  });
})();
