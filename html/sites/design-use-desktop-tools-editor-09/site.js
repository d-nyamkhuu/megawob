(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-09',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#c4c4c4',
      'panel': '#c4c4c4',
      'fg': '#000000',
      'accent': '#008080',
      'font': 'Arial,sans-serif',
      'line': '#777777',
      'muted': '#555555',
      'button-fg': '#000',
    },
    'nav': 'Terminal    Edit    Settings    Help',
    'obstruction': [
      'OS/2 Workplace Shell',
      'Your text editor workspace is ready. Close this notice to continue.',
      'Close',
    ],
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
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['menu', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      let display = ctx.display;
      if ((display === 'panel' && root.clientWidth < 1200) || (display === 'toast' && root.clientHeight < 700))
        display = 'header';
      document.body.className = D.mode + ' instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('span', 'os-icon', header);
      u.el('div', 'design-brand', header, 'OS/2  Text Editor - Document1');
      const wc = u.el('span', 'os-wc', header);
      u.el('i', '', wc, '_');
      u.el('i', '', wc, '□');
      u.el('i', '', wc, '×');
      const body = u.el('div', 'design-body', shell);
      const menu = u.el('nav', 'os-menu', shell);
      for (const m of ['File', 'Edit', 'Format', 'Options', 'Help']) {
        const s = u.el('span', '', menu);
        u.el('u', '', s, m[0]);
        s.append(m.slice(1));
      }
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, '');
      if (display === 'toast') footer.append(note);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'end-control' + (placement === 'menu' ? ' end-menu' : placement === 'link' ? ' end-link' : ''),
          placement === 'menu' ? menu : footer,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (cr.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'exit-btn end-xtra', footer, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const ex = u.el('button', 'exit-btn', footer);
      ex.type = 'button';
      ex.append('E');
      u.el('u', '', ex, 'x');
      ex.append('it');
      ex.addEventListener('click', () => env.log('decoy', { label: 'Exit' }));
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
