(function () {
  'use strict';
  const icons = {
    Home: '<path d="M18 6l7 1-6 3" fill="#d0e9f4" stroke="#172c3f" stroke-width=".8"/><path d="M4 13c3 0 5-2 6-5-1-4 2-7 6-6 5 1 6 6 4 10 0 7-4 12-10 11-4 0-7-3-8-7l5 2" fill="#a0d3ed" stroke="#192f42" stroke-width=".9"/><path d="M3 12c2 1 5 1 8 0 1 4-3 7-7 5M8 24l3 1m3-2 2 1" fill="none" stroke="#d3eafa" stroke-width="1.2"/><circle cx="17" cy="6" r="1" fill="#142737"/>',
    Messages:
      '<path d="M3 5h20v15H3z" fill="currentColor"/><path d="M3 5l10 9L23 5M3 20l7-8m13 8-7-8" stroke="#1d252b"/>',
    Favorites: '<path d="M13 2l3.2 7.5 8 .8-6 5.2 1.9 8L13 19l-7.1 4.5 1.9-8-6-5.2 8-.8z" fill="currentColor"/>',
    Profile:
      '<circle cx="13" cy="8" r="5" fill="currentColor"/><path d="M4 23v-2c0-7 18-7 18 0v2z" fill="currentColor"/>',
  };
  env.site({
    name: 'design-use-social-feed-all-01',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const tokens = {
        bg: '#22272a',
        panel: '#15181a',
        fg: '#dce5ef',
        accent: '#6f9bbc',
        line: '#30363b',
        muted: '#bfccd9',
        font: 'Lato, "DejaVu Sans", Arial, sans-serif',
      };
      for (const [k, v] of Object.entries(tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'carbon instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const menu = u.el('div', 'mac-menu', header);
      const apple = u.el('span', 'apple-mark', menu);
      apple.innerHTML =
        '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M17 1c0 4-3 6-5 6 0-3 2-5 5-6zm3 8c-5-3-6 0-8 0S8 6 4 9c-7 5 0 18 4 18 2 0 2-1 4-1s3 1 5 1c2 0 5-5 6-8-5-2-6-7-3-10z" fill="currentColor"/></svg>';
      for (const title of ['Chirp', 'File', 'Edit', 'View', 'Go', 'Account', 'Help'])
        u.el('span', title === 'Chirp' ? 'menu-brand' : '', menu, title);
      const titlebar = u.el('div', 'mac-titlebar', header);
      const lights = u.el('div', 'window-lights', titlebar);
      for (const color of ['red', 'yellow', 'green']) u.el('i', color, lights);
      u.el('div', 'design-brand', titlebar, 'Chirp');
      const endRng = ctx.rng.fork('chrome/end');
      const endWords = (
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const labels = [...new Set(endWords)];
      const label =
        endRng.bool(0.5) || !labels.some((x) => x.trim().toLowerCase() === 'submit')
          ? 'Submit'
          : endRng.pick(labels.filter((x) => x.trim().toLowerCase() !== 'submit'));
      const placement = endRng.pick(['footer', 'footer', 'footer', 'header', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
      const collidePool = [...new Set(endWords)].filter((x) => !same(x));
      const collide = collidePool.length && collideRng.bool(0.3) ? collideRng.pick(collidePool) : null;
      const endButton = (parent, cls, text, isLink) => {
        const b = u.el(isLink ? 'a' : 'button', cls, parent, text);
        if (isLink) b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide) {
        const decoy = u.el('button', 'end-xtra title-xtra', titlebar, collide);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      let headerEnd = null;
      if (!ctx.finish && placement === 'header') headerEnd = endButton(titlebar, 'end-control title-end', label, false);
      const tabs = u.el('nav', 'design-nav', header);
      for (const title of ['Home', 'Mentions', 'Messages', 'Favorites', 'Profile']) {
        const tab = u.el('button', 'chrome-tab' + (title === 'Home' ? ' selected' : ''), tabs);
        tab.type = 'button';
        const icon = u.el('span', 'tab-icon', tab);
        icon.innerHTML =
          title === 'Mentions' ? '@' : '<svg viewBox="0 0 26 26" aria-hidden="true">' + icons[title] + '</svg>';
        u.el('span', '', tab, title);
        tab.addEventListener('click', () => env.log('decoy', { what: title }));
      }
      const body = u.el('div', 'design-body', shell);
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const note = u.el('section', 'task-note', footer);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', '', note, ctx.instruction);
      else note.hidden = true;
      let submit = null;
      if (!ctx.finish && placement === 'footer') {
        submit = endButton(footer, 'end-control', label, false);
      } else if (!ctx.finish && placement === 'link') {
        submit = endButton(footer, 'end-link', label + ' ›', true);
      }
      return { stage, submit: submit || headerEnd };
    },
    overlay(ctx) {
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
  });
})();
