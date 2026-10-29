(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-flight-11',
    'brand': 'SkyWays Travel',
    'mode': 'side-left',
    'tokens': {
      'bg': '#292b2c',
      'panel': '#c9c9c9',
      'fg': '#080808',
      'accent': '#3c3c3c',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'NeXT    File    Edit    View    Go    Bookmarks    Tools    Help',
    'obstruction': [
      'Welcome to SkyWays Travel!',
      'Take a quick tour to learn about finding and booking flights.',
      'Skip tour',
    ],
    'footer': '',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      const er = ctx.rng.fork('chrome/end');
      const endWords = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const referenceEnd = er.bool(0.5);
      const endPlace = referenceEnd ? 'footer' : er.pick(['title', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endWords);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      const display = ctx.display === 'toast' && root.clientHeight < 740 ? 'header' : ctx.display;
      document.body.className = D.mode + ' instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('span', 'nx-logo', header);
      D.nav
        .split(/\s+/)
        .filter(Boolean)
        .forEach((t) => u.el('span', 'nx-menu' + (t === 'NeXT' ? ' first' : ''), header, t));
      u.el('span', 'nx-clock', header, 'Mon Nov 2 1998    10:24 AM');
      const body = u.el('div', 'design-body', shell);
      const left = u.el('section', 'nx-left', body);
      const titleBar = (p, t) => {
        const tb = u.el('div', 'nx-title', p);
        u.el('i', 'nx-ticon', tb);
        u.el('span', 'nx-ttext', tb, t);
        u.el('i', 'nx-close', tb);
        return tb;
      };
      titleBar(left, 'Task Briefing');
      const note = u.el('section', 'task-note', left);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const extra = u.el('div', 'nx-extra', left);
      const goal = ctx.plainInstruction || ctx.instruction;
      const criterion = /shortest/i.test(goal) ? 'shortest' : /nonstop|non-stop/i.test(goal) ? 'nonstop' : 'cheapest';
      u.el(
        'p',
        '',
        extra,
        'Use the flight search and booking controls on the right to find and book the ' +
          (criterion === 'cheapest' ? 'lowest priced' : criterion === 'shortest' ? 'shortest' : 'requested') +
          ' one-way flight for the specified route and date.',
      );
      u.el('h3', '', extra, 'Important:');
      const l1 = u.el('ul', '', extra);
      const arrowRoute = goal.match(/^(.+?)\s*→\s*([^,]+)/);
      const proseRoute = goal.match(/\bfrom:?\s+(.+?)\s+to:?\s+(.+?)(?=\s+(?:on|for)\b|[.?]|$)/i);
      const routeInfo = arrowRoute || proseRoute;
      const goalDate = goal.match(/\b(?:\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})\b/);
      if (ctx.display !== 'hidden') {
        if (routeInfo) {
          note.dataset.origin = routeInfo[1];
          note.dataset.destination = routeInfo[2];
        }
        if (goalDate) note.dataset.date = goalDate[0];
      }
      [
        'This is a one-way flight (not round trip).',
        'Find the ' +
          criterion +
          ' available option, then click Book' +
          (ctx.finish ? '.' : ' (but do not submit yet).'),
        ctx.finish
          ? 'After booking, finish the task.'
          : 'After booking, click the separate ' + endLabel + ' control to complete the task.',
      ].forEach((t, i) => {
        u.el('li', '', l1, t);
        if (i === 0 && ctx.display !== 'hidden') {
          if (routeInfo) {
            u.el('li', '', l1, 'Origin: ' + routeInfo[1]);
            u.el('li', '', l1, 'Destination: ' + routeInfo[2]);
          }
          if (goalDate) u.el('li', '', l1, 'Date: ' + goalDate[0]);
        }
      });
      u.el('h3', '', extra, 'Notes:');
      const l2 = u.el('ul', '', extra);
      [
        'A help tour may appear. You can click Skip tour to continue.',
        'Use the mouse, keyboard, or scroll wheel as needed.',
        'Do not leave this application.',
      ].forEach((t) => u.el('li', '', l2, t));
      for (const li of extra.querySelectorAll('li')) {
        const text = li.textContent;
        li.replaceChildren();
        for (const part of text.split(/(Skip tour|Book|Submit|Do not)/g)) {
          u.el(/^(Skip tour|Book|Submit|Do not)$/.test(part) ? 'b' : 'span', '', li, part);
        }
      }
      const win = u.el('section', 'nx-win', body);
      const winTitle = titleBar(win, D.brand);
      const stage = u.el('main', 'stage', win);
      const footer = u.el('footer', 'design-footer', win);
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlace === 'title' ? winTitle : footer;
        submit = u.el(
          'button',
          'end-control' + (endPlace === 'title' ? ' nx-end-title' : endPlace === 'link' ? ' nx-end-link' : ''),
          parent,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
        if (endPlace === 'title') winTitle.insertBefore(submit, winTitle.querySelector('.nx-close'));
        footer.classList.add('end-' + endPlace);
      }
      if (collide) {
        const decoy = u.el('button', 'nx-end-xtra', footer, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        footer.insertBefore(decoy, footer.firstChild);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const named = ctx.initial ? D.obstruction : null;
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
      const el = u.el(
        'section',
        'reference-overlay ' + ctx.kind + (ctx.initial ? ' nx-initial-tour' : ' nx-notification'),
        document.body,
      );
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('i', 'nx-ticon', el);
      const close = u.el('button', 'nx-tour-close', el, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close tour');
      close.addEventListener('click', () => ctx.dismiss());
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (named) {
        const accept = u.el('button', '', actions, 'Start tour');
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
