(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-menu-09',
    'brand': 'Chatter',
    'tokens': {
      'bg': '#4a78b4',
      'panel': '#f1efe9',
      'fg': '#1b2430',
      'accent': '#2f6fc0',
      'font': "'DejaVu Sans','Noto Sans',Arial,sans-serif",
      'line': '#cfcabd',
      'muted': '#5f6a78',
    },
    'obstruction': null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = 'bottom instruction-' + ctx.display;
      const bird =
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.5.6-2.4.7.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7C8.4 8.8 5.4 7.200 3.400 4.700a4.100 4.100 0 0 0 1.300 5.500c-.7 0-1.300-.2-1.900-.5 0 2 1.400 3.700 3.300 4.100-.6.2-1.200.2-1.800.1.500 1.600 2 2.800 3.800 2.900A8.200 8.200 0 0 1 2 18.500 11.600 11.600 0 0 0 8.300 20.300c7.500 0 11.700-6.300 11.700-11.700v-.5c.8-.6 1.500-1.300 2-2.200z"/></svg>';
      const panel = u.el('div', 'gtk-panel', document.body);
      const pl = u.el('div', 'gp-left', panel);
      const gi = u.el('span', 'gp-gear', pl);
      gi.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 1h6l1 3 4 2 2 5-2 4-1 5-4 3-5-1-4-2-3-5 1-5 2-4z"/><circle cx="12" cy="12" r="5" fill="#dddcd5"/><path d="M10 6l4 3-2 3 2 5-4 1-2-4 2-3z"/></svg>';
      for (const t of ['Applications', 'Places', 'System']) u.el('span', 'gp-item', pl, t);
      const pr = u.el('div', 'gp-right', panel);
      const sound = u.el('span', 'gp-ico', pr);
      sound.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9h4l5-5v16l-5-5H2z" fill="currentColor"/><path d="M15 7q7 5 0 10M18 3q10 9 0 18"/></svg>';
      const monitor = u.el('span', 'gp-ico', pr);
      monitor.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="15" rx="1"/><path d="M8 22h8M12 17v5"/><path d="M5 5h14v9H5z" fill="currentColor"/></svg>';
      u.el('span', 'gp-clock', pr, 'Mon Apr 27, 2009    10:24 AM');
      const win = u.el('div', 'gtk-window', document.body);
      const tb = u.el('div', 'gtk-title', win);
      const ti = u.el('span', 'gt-ico', tb);
      ti.innerHTML = bird;
      u.el('span', 'gt-text', tb, 'Chatter – Home');
      const bs = u.el('span', 'gt-btns', tb);
      for (const c of ['−', '□', '×']) u.el('span', 'gt-btn' + (c === '×' ? ' close' : ''), bs, c);
      const mb = u.el('div', 'gtk-menu', win);
      for (const t of ['File', 'Edit', 'View', 'Go', 'Help']) u.el('span', '', mb, t);
      const hd = u.el('div', 'chat-head', win);
      const br = u.el('div', 'chat-brand', hd);
      const bi = u.el('span', 'chat-bird', br);
      bi.innerHTML = bird;
      u.el('span', '', br, D.brand);
      const se = u.el('div', 'chat-search', hd);
      se.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg><span>Search posts...</span>';
      const stage = u.el('main', 'stage', win);
      const pal = u.el('div', 'gtk-palette', document.body);
      const pt = u.el('div', 'gtk-title pal-title', pal);
      const pi = u.el('span', 'gt-ico pal-ico', pt, '◉');
      u.el('span', 'gt-text', pt, 'Task');
      u.el('span', 'gt-btn close', pt, '×');
      const body = u.el('div', 'pal-body', pal);
      const note = u.el(
        'section',
        'task-note ' + (ctx.display === 'panel' ? 'note-panel' : ctx.display === 'toast' ? 'note-toast' : ''),
        body,
      );
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'toast') u.el('div', 'note-caption', note, 'Task notification');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const actions = u.el('div', 'pal-actions', body);
      const clear = u.el('button', 'clear-task', actions, 'Reset');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { what: 'Reset' }));
      const endR = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const sampledLabel = endR.bool(0.5) ? 'Submit' : labelOf(endR.pick(labels));
      const sampledPlacement = endR.pick(['actions', 'actions', 'title', 'link']);
      const formR = ctx.rng.fork('chrome/end/form');
      const referenceEnd = formR.bool(0.5);
      const alternatives = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = referenceEnd
        ? 'Submit'
        : sampledLabel === 'Submit'
          ? formR.pick(alternatives.length ? alternatives : ['Done'])
          : sampledLabel;
      const placement = referenceEnd
        ? 'actions'
        : sampledPlacement === 'actions'
          ? formR.pick(['title', 'link'])
          : sampledPlacement;
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const opts = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (opts.length) collide = labelOf(collideR.pick(opts));
      }
      let submit = null;
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'actions') submit = endButton(actions, 'end-control', label);
        else if (placement === 'title') {
          const close = pt.lastElementChild;
          submit = endButton(pt, 'pal-end-title', label);
          pt.insertBefore(submit, close);
        } else {
          const row = u.el('div', 'pal-end-link-row', body);
          submit = endButton(row, 'pal-end-link', label + ' ›');
        }
      }
      if (collide) {
        const d = u.el('button', 'pal-xtra', actions, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
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
