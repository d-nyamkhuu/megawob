(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-terminal-04',
    'brand': 'Terminal',
    'mode': 'neo',
    'tokens': {
      'bg': '#285184',
      'panel': '#ccccd2',
      'fg': '#0a1038',
      'accent': '#f5da48',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
      'button-fg': '#000',
    },
    'nav': 'Terminal    Edit    Settings    Help',
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
      const vp = ctx.size || {},
        vw = vp.width || vp.w || window.innerWidth,
        vh = vp.height || vp.h || window.innerHeight;
      let display = ctx.display || 'header';
      if ((display === 'panel' && vw < 1180) || (display === 'toast' && (vw < 1080 || vh < 650))) display = 'header';
      document.body.className = D.mode + ' instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body),
        header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell),
        note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        if (display === 'panel') u.el('h2', 'terminal-panel-title', note, 'TASK / 01');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body),
        footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          pool = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            'Complete',
            'I am done',
          ];
        const norm = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const variation = er.pick(['default', 'default', 'header', 'link']);
        const alternatives = pool.map(norm).filter((x) => x.trim().toLowerCase() !== 'submit');
        const label = variation === 'default' ? 'Submit' : alternatives.length ? er.pick(alternatives) : 'Done';
        let placement = variation === 'default' ? 'footer' : variation;
        if (placement === 'header' && display === 'hidden') placement = 'footer';
        const addEnd = (parent, cls, text, tag) => {
          const b = u.el(tag || 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'header') {
          const row = u.el('div', 'terminal-note-row', note),
            p = note.querySelector('p');
          row.appendChild(p);
          submit = addEnd(row, 'terminal-header-end', label);
        } else if (placement === 'link') submit = addEnd(footer, 'terminal-end-link', label + ' ›', 'a');
        else submit = addEnd(footer, 'end-control', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const choices = pool.map(norm).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) {
            const word = cr.pick(choices),
              d = u.el('button', 'terminal-xtra', placement === 'header' ? note : footer, word);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: word, collide: true }));
          }
        }
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
