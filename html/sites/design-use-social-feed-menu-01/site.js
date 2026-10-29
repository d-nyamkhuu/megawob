(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-menu-01',
    'brand': 'Horizon',
    'mode': 'bottom',
    'tokens': {
      'bg': '#1b172c',
      'panel': '#191627',
      'fg': '#eee8ff',
      'accent': '#ff756c',
      'font': 'Arial,sans-serif',
      'line': '#383145',
      'muted': '#c6badf',
    },
    'nav': 'Home',
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
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const mark = u.el('span', 'brand-symbol', header);
      mark.innerHTML =
        '<svg viewBox="0 0 24 25"><path fill="#b27afa" d="M6 0h12a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6h-4v-5h3V6h-9v13h13v6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6z"/></svg>';
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const wc = u.el('span', 'win-ctl', header);
      wc.innerHTML =
        '<svg viewBox="0 0 140 24" width="140" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h15"/><rect x="62" y="5" width="14" height="14" rx="1"/><path d="M119 5l14 14m0-14l-14 14"/></svg>';
      const idx = u.el('aside', 'side-index', document.body);
      const P = [
        '<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" fill="currentColor"/>',
        '<path d="M12 2c3 4 5 6 4 10 3-1 3-4 3-6 5 6 5 11 1 15-4 3-10 3-14-1-4-4-3-9 1-13 0 4 2 6 3 7-1-5 1-9 2-12z"/>',
        '<path d="M9 4L7 20M17 4l-2 16M4 9h17M3 15h17"/>',
        '<circle cx="12" cy="7" r="3.3"/><path d="M6 20v-2c0-3 2-5 6-5s6 2 6 5v2zM5 5a3 3 0 0 0 0 6M3 14c-2 1-2 3-2 6h3M19 5a3 3 0 0 1 0 6M21 14c2 1 2 3 2 6h-3"/>',
        '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 9h8M8 13h8M8 17h4"/>',
        '<path d="M6 3h12v18l-6-4-6 4z"/>',
        '<path d="M9.5 3l.7-2h3.6l.7 2 2 .9 2.1-.8 2.5 2.5-.8 2.1.9 2 2 .7V14l-2 .7-.9 2 .8 2.1-2.5 2.5-2.1-.8-2 .9-.7 2h-3.6l-.7-2-2-.9-2.1.8-2.5-2.5.8-2.1-.9-2-2-.7v-3.6l2-.7.9-2-.8-2.1 2.5-2.5 2.1.8z" transform="translate(1 0) scale(.92)"/><circle cx="12" cy="12" r="3.5"/>',
      ];
      P.forEach((p, i) => {
        const b = u.el('div', 'si' + (i === 0 ? ' on' : ''), idx);
        b.innerHTML =
          '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">' +
          p +
          '</svg>';
      });
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels));
      const isScene = new URLSearchParams(location.search).get('start') === 'scene';
      const placement = ctx.finish
        ? null
        : isScene
          ? 'header'
          : er.pick(['footer', 'footer', 'footer', 'header', 'link', 'link']);
      let collide = null;
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = [
          ...new Set(labels.map(labelOf).filter((s) => s.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (choices.length) collide = cr.pick(choices);
      }
      const addDecoy = (parent, text, clash) => {
        const b = u.el('button', clash ? 'end-xtra collide' : 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', clash ? { label: text, collide: true } : { label: text }));
        return b;
      };
      const addEnd = (parent, kind, text) => {
        const b = u.el(
          kind === 'link' ? 'a' : 'button',
          kind === 'link' ? 'end-link' : 'end-control ' + kind,
          parent,
          text,
        );
        if (kind === 'link') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') submit = addEnd(header, 'header-end', endLabel);
        else if (placement === 'link') submit = addEnd(footer, 'link', endLabel + '  :');
        else submit = addEnd(footer, 'button', endLabel);
      }
      if (collide) addDecoy(footer, collide, true);
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
