(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-07',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#ffffff',
      'panel': '#ffffff',
      'fg': '#2b3340',
      'accent': '#4fb89f',
      'font': "'Source Sans Pro','Segoe UI',Helvetica,Arial,sans-serif",
      'line': '#e6e9ec',
      'muted': '#7b8794',
      'button-fg': '#fff',
    },
    'nav': 'Terminal    Edit    Settings    Help',
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
      document.body.className = D.mode + ' instruction-' + (ctx.display === 'toast' ? 'notice' : ctx.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note mode-' + ctx.display, body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin')
          u.el(
            'h2',
            '',
            note,
            ctx.display === 'panel' ? 'Task details' : ctx.display === 'toast' ? 'Task note' : 'Your Task',
          );
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end'),
          labels = ctx.content && ctx.content.END_LABELS;
        const endLabels =
          Array.isArray(labels) && labels.length
            ? labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const referenceEnd = endRng.bool(0.5);
        const label = referenceEnd ? 'Submit' : endRng.pick(endLabels.filter((x) => x !== 'Submit'));
        const alternatePlacement = endRng.pick(['toolbar', 'link']);
        const placement = referenceEnd ? 'right' : alternatePlacement;
        footer.classList.add('end-' + placement);
        const collideRng = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (collideRng.bool(0.3)) {
          const pool = [...new Set(endLabels)].filter(
            (x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase(),
          );
          if (pool.length) collide = collideRng.pick(pool);
        }
        if (collide) {
          const decoy = u.el('button', 'end-xtra', footer, collide);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'end-control ' + (placement === 'link' ? 'end-link' : '') + (placement === 'toolbar' ? ' end-toolbar' : ''),
          footer,
          label,
        );
        submit.type = placement === 'link' ? 'button' : 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
