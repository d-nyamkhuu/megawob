(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-02',
    'brand': 'Notebook',
    'mode': 'side-right',
    'tokens': {
      'bg': '#dededc',
      'panel': '#ffffff',
      'fg': '#131923',
      'accent': '#f78008',
      'font': 'monospace',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'File    Edit    View    Help',
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
      let display = ctx.display;
      if (
        (display === 'panel' && innerWidth < 1260) ||
        (display === 'toast' && (innerWidth < 1260 || innerHeight < 700))
      )
        display = 'header';
      document.body.className = D.mode + ' instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      const ic = u.el('span', 'notebook-mark', brand);
      brand.append(D.brand);
      const wc = u.el('div', 'window-controls', header);
      wc.innerHTML =
        '<svg viewBox="0 0 210 43" fill="none" stroke="#fff" stroke-width="1.6"><path d="M28 21h15M98 15h13v14H98zM166 15l14 14m0-14l-14 14"/></svg>';
      const nav = u.el('nav', 'design-nav', header);
      for (const label of D.nav.trim().split(/ +/)) u.el('span', '', nav, label);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Task');
        u.el('p', '', note, ctx.instruction);
        u.el('div', 'editor-task-help', note, 'Apply the requested changes to the text, including any formatting.');
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const endRng = ctx.rng.fork('chrome/end');
      const baseEnd = !ctx.finish && endRng.bool(0.5);
      const endPlacement = ctx.finish ? null : baseEnd ? 'bottom' : endRng.pick(['top', 'link']);
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labelText = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const label = baseEnd ? 'Submit' : labelText(endRng.pick(endLabels.filter((x) => labelText(x) !== 'Submit')));
      let submit = null;
      const feedback = u.el('aside', 'editor-feedback', body);
      u.el('h2', '', feedback, 'Feedback');
      u.el(
        'p',
        '',
        feedback,
        ctx.finish
          ? 'Your changes will be checked when you finish this task.'
          : `Your changes will be checked after you press ${label}.`,
      );
      if (!ctx.finish) {
        submit = u.el('button', 'end-control end-' + endPlacement, feedback, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      if ((display === 'panel' || display === 'toast') && ctx.display !== 'hidden')
        feedback.insertBefore(note, feedback.querySelector('p'));
      if (display === 'hidden') note.hidden = true;
      if (submit && endPlacement === 'top') nav.append(submit);
      if (submit && endPlacement === 'link') {
        submit.textContent = label + ' ›';
        feedback.append(submit);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = endLabels.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const decoy = u.el('button', 'end-xtra', feedback, collideRng.pick(pool));
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
        }
      }
      const taskbar = u.el('div', 'electron-taskbar', shell);
      const windows = u.el('span', 'windows-mark', taskbar);
      windows.innerHTML =
        '<svg viewBox="0 0 32 32" fill="#65b9ec"><path d="M3 6l11-1.5V15H3zM16 4.3L29 2.5V15H16zM3 17h11v10.5L3 26zM16 17h13v12.5L16 27.8z"/></svg>';
      const search = u.el('div', 'windows-search', taskbar);
      search.innerHTML =
        '<svg viewBox="0 0 32 32" fill="none" stroke="#303845" stroke-width="1.5"><circle cx="18" cy="12" r="9"/><path d="M11.5 18.5L2 29"/></svg><span>Type here to search</span>';
      const apps = u.el('span', 'taskbar-apps', taskbar);
      apps.innerHTML =
        '<span><svg viewBox="0 0 36 36"><path d="M3 8h12l3 3h15v23H3z" fill="#ffcf57"/><path d="M3 14h30v20H3z" fill="#efb630"/><path d="M5 16h26v11H5z" fill="#ffd366"/><path d="M15 25h11v10H15z" fill="#65acd6"/></svg></span><span><svg viewBox="0 0 36 36"><path d="M2 13L18 3l16 10v21H2z" fill="#149eda"/><path d="M5 11h26v19H5z" fill="#e9f6ff"/><path d="M2 14l16 11 16-11v20H2z" fill="#3db6ec"/><path d="M2 34l16-12 16 12" fill="#149eda"/></svg></span><span class="active"><i class="notebook-mark"></i></span>';
      const tray = u.el('span', 'taskbar-tray', taskbar);
      tray.innerHTML =
        '<svg viewBox="0 0 120 32" fill="none" stroke="#f5f5f5" stroke-width="1.5"><path d="M6 20l8-8 8 8M51 25c0-9 6-16 15-17M56 25c0-6 4-11 10-12M61 25c0-3 2-6 5-7M88 13h5l6-5v18l-6-5h-5zM104 11q7 6 0 12M108 7q11 10 0 20"/></svg>';
      u.el('span', 'taskbar-clock', taskbar, '10:24 AM\nApr 12, 2018');
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
      /* Dismissing a notification must retain the editor selection and open formatting menu. */ el.addEventListener(
        'pointerdown',
        (e) => {
          if (e.target.closest('button')) e.preventDefault();
          e.stopPropagation();
        },
      );
      el.addEventListener('pointerup', (e) => e.stopPropagation());
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
