(function () {
  'use strict';
  const D = {
    site: 'design-use-social-feed-reply-03',
    tokens: {
      bg: '#dfe3fa', panel: '#ffffff', fg: '#171b24', muted: '#596579',
      accent: '#1675f9', line: '#e2e7ed', font: 'Arial, sans-serif'
    }
  };
  env.site({
    name: D.site,
    template: 'site/base',
    styles: ['site.css'],
    scripts: [],
    design: { parts: {
    frame: () => function (ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'chirp instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('div', 'native-titlebar', shell);
      const bird = u.el('span', 'bird-mark', title);
      bird.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#1675f9" d="M21 6c-1 .5-2 .7-3 .8-1.4-1.5-3.8-1.4-5.1.2-1 1.2-1 2.5-.7 3.4-4.2-.2-7.8-2.3-10.3-5.4-.9 2.3.2 4.3 1.7 5.2-.7 0-1.2-.2-1.7-.5 0 2.3 1.5 3.8 3.4 4.2-.6.2-1.2.2-1.7.1.5 1.7 2 2.7 3.9 2.8-1.6 1.2-3.6 1.8-5.7 1.6 2 1.3 4.4 2 6.9 2 8.3 0 12.8-6.9 12.5-13.1.9-.7 1.8-1.5 2.5-2.4z"/></svg>';
      u.el('span', 'native-title', title, 'Chirp');
      const win = u.el('div', 'native-controls', title);
      for (const [path, label] of [['<path d="M1 8h14"/>', 'Minimize'], ['<rect x="2" y="2" width="12" height="12" rx="1.5"/>', 'Maximize'], ['<path d="m2 2 12 12M14 2 2 14"/>', 'Close']]) {
        const b = u.el('button', 'native-control', win);
        b.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' + path + '</svg>';
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
      }
      const page = u.el('div', 'page-surface', shell);
      const head = u.el('header', 'feed-header', page);
      const heading = u.el('div', 'heading-group', head);
      u.el('h1', 'feed-title', heading, 'Home');
      if (ctx.display === 'header' || ctx.display === 'panel' || ctx.display === 'toast') {
        const note = u.el('p', 'header-note', heading, ctx.instruction);
        note.dataset.role = 'instruction';
      }
      const stats = u.el('div', 'feed-stats', head);
      u.el('span', '', stats, '124 posts');
      u.el('span', '', stats, '37 following');
      u.el('span', '', stats, '291 followers');

      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
      const endText = (x) => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      let placement = 'form', label = 'Save';
      if (!ctx.finish && !er.bool(0.5)) {
        placement = er.pick(['header', 'footer', 'link', 'icon']);
        label = endText(er.pick(labels));
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const options = [...new Set(labels.map(endText))].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = cr.pick(options);
      }
      const makeEnd = (parent, cls) => {
        const b = u.el('button', cls, parent, placement === 'icon' ? '✓' : label);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = makeEnd(head, 'end-control header-end');

      const body = u.el('div', 'feed-body', page);
      const stage = u.el('main', 'stage', body);
      if (ctx.display === 'panel') {
        const panel = u.el('aside', 'task-panel', body);
        const cap = u.el('div', 'task-panel-heading', panel);
        u.el('span', 'task-panel-icon', cap, '▤');
        u.el('strong', '', cap, 'Task');
        const note = u.el('p', '', panel, ctx.instruction);
        note.dataset.role = 'instruction';
      }
      if (ctx.display === 'toast') {
        const note = u.el('aside', 'task-toast', body);
        note.dataset.role = 'instruction';
        u.el('span', 'task-toast-icon', note, '✓');
        u.el('p', '', note, ctx.instruction);
        const close = u.el('button', 'task-toast-close', note, '×');
        close.type = 'button'; close.title = 'Dismiss'; close.setAttribute('aria-label', 'Dismiss');
        close.addEventListener('click', () => note.remove());
      }
      const footer = u.el('footer', 'design-footer', page);
      const actions = u.el('div', 'footer-actions', footer);
      if (!ctx.finish && placement !== 'header') {
        submit = makeEnd(actions, 'end-control ' + (placement === 'link' ? 'link-end' : placement === 'icon' ? 'icon-end' : 'footer-end'));
      }
      if (collide) {
        const b = u.el('button', 'xtra-control', actions, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay: () => function (ctx) {
      const u = ctx.util;
      if (ctx.kind === 'chat') {
        const el = u.el('section', 'reference-overlay chat', document.body);
        el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Chirp Support');
        const top = u.el('div', 'chat-top', el);
        u.el('span', 'chat-avatar', top);
        const identity = u.el('div', 'chat-identity', top);
        u.el('strong', '', identity, 'Chirp Support');
        u.el('small', '', identity, '● Online');
        const dismiss = u.el('button', 'chat-close', top, '×');
        dismiss.type = 'button'; dismiss.title = 'Close'; dismiss.setAttribute('aria-label', 'Close');
        dismiss.addEventListener('click', () => ctx.dismiss());
        const message = u.el('div', 'chat-message', el);
        u.el('strong', '', message, 'Hi! 👋');
        u.el('p', '', message, 'How can we help you today?');
        const choices = u.el('div', 'chat-choices', el);
        for (const text of ['I have a question', 'Report a problem', 'Share feedback']) {
          const button = u.el('button', '', choices, text);
          button.type = 'button'; button.addEventListener('click', () => env.log('decoy', {what:text}));
        }
        const row = u.el('div', 'chat-input-row', el);
        const field = u.el('input', '', row); field.type = 'text'; field.placeholder = 'Type a message…';
        const send = u.el('button', '', row, '➤'); send.type = 'button'; send.title = 'Send';
        send.addEventListener('click', () => env.log('decoy', {what:'Chat send'}));
        return {el, dismiss};
      }
      if (ctx.kind === 'promo') {
        const el = u.el('div', 'reference-overlay promo', document.body);
        el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Stay in the loop');
        u.el('div', 'promo-scrim', el);
        const card = u.el('section', 'promo-card', el);
        const dismiss = u.el('button', 'promo-close', card, '×');
        dismiss.type = 'button'; dismiss.title = 'Close'; dismiss.setAttribute('aria-label', 'Close');
        dismiss.addEventListener('click', () => ctx.dismiss());
        const icon = u.el('div', 'promo-icon', card);
        icon.innerHTML = '<svg viewBox="0 0 80 64" width="80" height="64" aria-hidden="true"><path d="M14 22h52v34H14z" fill="#1675f9"/><path d="M14 23l26 20 26-20" fill="none" stroke="#fff" stroke-width="3"/><path d="M14 56l17-18M66 56L49 38" fill="none" stroke="#fff" stroke-width="2"/><path d="M19 7l4 8M39 2v10M61 8l-4 8" stroke="#1675f9" stroke-width="3" stroke-linecap="round"/><path d="M31 4l2 7" stroke="#f5b400" stroke-width="3" stroke-linecap="round"/><path d="M51 4l-2 7" stroke="#ec5bd2" stroke-width="3" stroke-linecap="round"/></svg>';
        u.el('h2', '', card, 'Stay in the loop');
        u.el('p', '', card, 'Get the latest updates, travel tips, and featured stories delivered to your inbox.');
        const email = u.el('input', 'promo-email', card); email.type = 'email'; email.placeholder = 'your@email.com';
        const subscribe = u.el('button', 'promo-subscribe', card, 'Subscribe');
        subscribe.type = 'button'; subscribe.addEventListener('click', () => ctx.dismiss());
        const later = u.el('button', 'promo-later', card, 'Maybe later');
        later.type = 'button'; later.addEventListener('click', () => ctx.dismiss());
        return {el, dismiss};
      }
      const texts = {
        cookie: ['Privacy settings', 'We use cookies to improve your experience, personalize content, and analyze traffic.', 'Dismiss'],
        toast: ['Notification', 'Your feed is up to date.', 'Dismiss'],
        banner: ['Spring Travel Deals Are Here!', 'Save up to 30% on flights to top destinations.', 'Dismiss']
      };
      const [title, copy, label] = texts[ctx.kind] || texts.toast;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      if (ctx.kind === 'banner') el.style.top = document.querySelector('.feed-header').getBoundingClientRect().bottom + 'px';
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', title);
      if (ctx.kind === 'cookie' || ctx.kind === 'banner') {
        const mark = u.el('span', 'overlay-mark', el);
        mark.innerHTML = ctx.kind === 'banner'
          ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5577aa" stroke-width="1.7" aria-hidden="true"><path d="M4 9h5l9-5v16l-9-5H4zM7 15l2 6h3l-2-6M21 8v8"/></svg>'
          : '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M23 13A10.5 10.5 0 1 1 13 2a5 5 0 0 0 4 6 4 4 0 0 0 6 5" fill="#d9aa6f" stroke="#af7b43"/><g fill="#875b36"><circle cx="7" cy="10" r="1.5"/><circle cx="11" cy="18" r="1.6"/><circle cx="16" cy="13" r="1.4"/><circle cx="17" cy="20" r="1.2"/></g></svg>';
      }
      u.el('strong', '', el, title);
      u.el('p', '', el, copy);
      if (ctx.kind === 'cookie' || ctx.kind === 'banner') {
        const link = u.el('a', 'overlay-link', el, 'Learn more');
        link.href = '#'; link.addEventListener('click', e => { e.preventDefault(); env.log('decoy', {what:'Learn more'}); });
      }
      const dismiss = u.el('button', 'overlay-dismiss', el, ctx.kind === 'banner' ? '×' : label);
      dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss());
      dismiss.setAttribute('aria-label', label);
      return { el, dismiss };
    }
    } }
  });
})();
