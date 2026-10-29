(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-calendar-05',
    'brand': 'Calendar',
    'mode': 'top',
    'tokens': {
      'bg': '#0a50d8',
      'panel': '#f1efe6',
      'fg': '#0a1470',
      'accent': '#2a62d8',
      'font': 'Tahoma,Verdana,Arial,sans-serif',
      'line': '#a9c0e0',
      'muted': '#3a4a80',
      'button-fg': '#000',
    },
    'nav': '',
    'obstruction': ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
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
      const shell = u.el('div', 'site-shell', document.body),
        header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const tools = u.el('div', 'chrome-tools', header),
        wb = u.el('div', 'xp-btns', header);
      u.el('i', 'xp-min', wb);
      u.el('i', 'xp-max', wb);
      u.el('i', 'xp-close', wb);
      const body = u.el('div', 'design-body', shell),
        note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') u.el('h2', 'note-heading', note, 'Task details');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body),
        footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const endR = ctx.rng.fork('chrome/end'),
        bank = ctx.content && ctx.content.END_LABELS;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels =
        Array.isArray(bank) && bank.length
          ? bank.map(labelOf)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const defaultEnd = endR.bool(0.5);
      const label = defaultEnd ? 'Submit' : endR.pick(labels.filter((x) => x !== 'Submit'));
      const placement = ctx.finish ? null : defaultEnd ? 'footer' : endR.pick(['header', 'note']);
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') submit = makeEnd(tools, 'end-control end-header', label);
        else if (placement === 'note' && ctx.display !== 'hidden') {
          note.classList.add('has-note-end');
          submit = makeEnd(note, 'end-control end-note', '✓');
          submit.title = label;
          submit.setAttribute('aria-label', label);
        } else submit = makeEnd(footer, 'end-control', label);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const choices = labels.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (choices.length) {
          const text = collideR.pick(choices),
            b = u.el('button', 'chrome-xtra', tools, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        named = D.obstruction,
        texts = {
          cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
          toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
          chat: ['Help', 'Need help with this workspace?', 'Close'],
          promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
          banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
        };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
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
