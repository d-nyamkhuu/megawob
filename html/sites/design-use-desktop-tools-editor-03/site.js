(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-03',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#faf7f0',
      'panel': '#fffdfa',
      'fg': '#2a2e22',
      'accent': '#3d4433',
      'font': "Georgia,'Times New Roman',serif",
      'line': '#d8d1bc',
      'muted': '#6b6a58',
      'button-fg': '#fff',
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
      let display = ctx.display || 'header';
      const width = (ctx.size && ctx.size.width) || window.innerWidth,
        height = (ctx.size && ctx.size.height) || window.innerHeight;
      if ((display === 'panel' && width < 1180) || (display === 'toast' && height < 700)) display = 'header';
      const er = ctx.rng.fork('chrome/end');
      let placement, label;
      if (!ctx.finish && er.pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) < 5) {
        placement = 'footer';
        label = 'Submit';
      } else if (!ctx.finish) {
        placement = er.pick(['header', 'link']);
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          Array.isArray(bank) && bank.length ? bank : ['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const text = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const options = labels.map(text).filter((x) => x.toLowerCase() !== 'submit');
        label = options.length ? er.pick(options) : 'Done';
      }
      document.body.className =
        D.mode +
        ' instruction-' +
        display +
        (ctx.finish ? ' finish-mode' : '') +
        (placement === 'header' ? ' end-header' : '');
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note display-' + display, body);
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Writing task');
        u.el('p', '', note, ctx.instruction);
        u.el(
          'p',
          'hint',
          note,
          'In the editor on the right, apply the requested formatting to the document text.',
        );
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, '');
      let submit = null;
      if (!ctx.finish) {
        const cancel = u.el('button', 'cancel-control', footer, 'Cancel');
        cancel.type = 'button';
        if (placement === 'link') {
          submit = u.el('button', 'end-control end-link', footer, label);
        } else {
          submit = u.el('button', 'end-control', footer, label);
        }
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const bank = ctx.content && ctx.content.END_LABELS;
          const words =
            Array.isArray(bank) && bank.length
              ? bank
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          const text = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
          const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
          const choices = [...new Set(words.map(text))].filter((x) => !same(x));
          if (choices.length) {
            const collision = cr.pick(choices);
            const decoy = u.el(
              'button',
              'pqs-control' +
                (cr.pick(['footer', 'footer', 'header']) === 'header' ? ' pqs-at-header' : ''),
              footer,
              collision,
            );
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
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
