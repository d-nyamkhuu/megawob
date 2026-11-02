(function () {
  'use strict';
  const palette = { bg: '#ececec', panel: '#f7f7f7', fg: '#111', muted: '#333', line: '#111' };
  const ICON = {
    reply: '<path d="M9 4L2 11l7 7v-5h7c3 0 4 2 4 6h3v-6c0-4-3-6-7-6H9z" fill="currentColor" stroke="none"/>',
    retweet: '<path d="M2 8l5-6 5 6H9v10h6v3H6V8zM12 3h7v13h3l-5 6-5-6h3V6h-3z" fill="currentColor" stroke="none"/>',
    like: '<defs><pattern id="inspector-heart" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 3L3 0" stroke="#111" stroke-width="1"/></pattern></defs><path d="M12 21L3 12V6h3V3h4l2 3 2-3h4v3h3v6z" fill="url(#inspector-heart)" stroke-width="1.5"/>',
  };
  const ico = (k) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="miter">' + ICON[k] + '</svg>';
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every mode has a dedicated note slot, even in the compact workbench.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'monospace');
      document.body.classList.add('gem', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const top = u.el('header', 'design-header', shell);
      const doc = u.el('span', 'gem-doc', top);
      doc.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 2h10l5 5v15H5zM15 2v5h5M8 11h9M8 15h9M8 19h9"/></svg>';
      u.el('span', 'gem-menu on', top, 'Chatter');
      for (const m of ['File', 'Edit', 'View', 'Options', 'Help']) {
        const b = u.el('span', 'gem-menu', top, m);
        b.addEventListener('click', () => env.log('decoy', { what: m }));
      }
      u.el('span', 'gem-clock', top, 'Mon Apr 14, 1987  10:24 AM');
      const body = u.el('div', 'design-body', shell);
      const left = u.el('section', 'win win-left', body);
      const title = u.el('div', 'win-title', left);
      u.el('span', '', title, 'Chatter');
      const brand = u.el('div', 'gem-brand', left);
      const logo = u.el('div', 'gem-logo', brand);
      logo.innerHTML = '<i class="bubble bubble-back"></i><i class="bubble bubble-front"></i>';
      const bt = u.el('div', 'gem-brand-t', brand);
      u.el('b', '', bt, 'Chatter');
      u.el('span', '', bt, 'Conversations for a smaller world');
      const noteSlot = u.el('section', 'gem-note-slot', left);
      noteSlot.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, body, left, brand, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.brand;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const right = u.el('aside', 'win win-right', _c.body);
      const rt = u.el('div', 'win-title', right);
      const resize = u.el('span', 'win-box', rt);
      resize.innerHTML = '<svg viewBox="0 0 24 28" fill="none" stroke="#111" stroke-width="1"><path d="M9 2h6M12 2v24M9 26h6"/></svg>';
      const close = u.el('span', 'win-box close-box', rt);
      close.innerHTML = '<svg viewBox="0 0 24 28" fill="none" stroke="#111" stroke-width="1"><path d="M2 3h20v22H2zM4 5l16 18M20 5L4 23"/></svg>';
      const p1 = u.el('section', 'gem-panel', right);
      u.el('h3', '', p1, 'Post Details');
      const pb = u.el('div', 'gem-pbody', p1);
      const who = u.el('div', 'gem-who', pb);
      u.el('i', 'gem-face', who);
      const wt = u.el('div', '', who);
      u.el('b', 'detail-target-author', wt).hidden = true;
      u.el('b', '', wt, 'Chatter');
      u.el('span', '', wt, 'Joined Jan 1986');
      const stats = u.el('dl', 'gem-stats', pb);
      for (const [k, v] of [['Posts', '237'], ['Following', '104'], ['Followers', '321']]) {
        u.el('dt', '', stats, k);
        u.el('dd', '', stats, v);
      }
      const p2 = u.el('section', 'gem-panel', right);
      u.el('h3', '', p2, 'This Post');
      const tb = u.el('div', 'gem-pbody', p2);
      u.el('div', 'gem-small', tb, 'Apr 14, 1987  9:12 AM');
      u.el('p', 'detail-post-starts-with', tb).hidden = true;
      u.el('p', '', tb, 'Browse conversations in the timeline.');
      const p3 = u.el('section', 'gem-panel gem-actions', right);
      u.el('h3', '', p3, 'Actions');
      const ab = u.el('div', 'gem-pbody', p3);
      for (const [k, l] of [['reply', 'Reply'], ['retweet', 'Retweet'], ['like', 'Like']]) {
        const r = u.el('div', 'gem-arow', ab);
        u.el('i', '', r).innerHTML = ico(k);
        const b = u.el('button', '', r, l);
        b.type = 'button';
        b.dataset.inspectorAction = k;
      }
      const st = u.el('div', 'gem-status', right);
      u.el('span', '', st, 'Action:');
      u.el('span', 'detail-action', st).hidden = true;
      u.el('span', '', st, 'Status:');
      u.el('span', 'detail-status', st, 'Not completed');
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.left);
      _c.strip = _c.util.el('div', 'gem-strip', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.strip.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = _c.ctx.finish ? 'Chatter · Workspace ready' : '';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.strip.prepend(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      const [title, copy, label] = texts[ctx.kind];
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-social-feed-one-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#111'], LOW_ACCENTS: ['#111'], parts },
  });
})();
