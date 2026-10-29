(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-12',
    'brand': 'DraftPro 2014 \u2014 Drawing1.dwg',
    'mode': 'top',
    'tokens': {
      'bg': '#0d2332',
      'panel': '#122c40',
      'fg': '#c9e9fd',
      'accent': '#547693',
      'font': 'Arial,sans-serif',
      'line': '#4c6375',
      'muted': '#a0c3da',
    },
    'nav': 'File    Edit    View    Draw    Modify    Format    Tools    Window    Help',
    'obstruction': null,
    'footer': 'X: 182.420    Y: 77.315    Z: 0.000  |  ORTHO  OFF  |  SNAP  ON  |  GRID  ON  |  OSNAP  ON',
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
      document.body.className = D.mode + ' instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header, D.brand);
      const icon = u.el('span', 'draft-icon', brand);
      icon.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18L8 4l4 15 5-11 4 12M3 11l16 4M8 4v17"/></svg>';
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const endRng = ctx.rng.fork('chrome/end');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const defaultEnd = endRng.bool(0.5);
      const alternates = labels.filter((x) => labelText(x).trim().toLowerCase() !== 'submit');
      const label = defaultEnd ? 'Submit' : labelText(endRng.pick(alternates.length ? alternates : labels));
      const placement = defaultEnd ? 'footer' : endRng.pick(['footer', 'header', 'link']);
      const tabs = u.el('div', 'layout-tabs', footer);
      let collide = null;
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = [
          ...new Set(labels.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (options.length) collide = collideRng.pick(options);
      }
      if (collide) {
        const cb = u.el('button', 'end-pq', footer, collide);
        cb.type = 'button';
        cb.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      for (const item of ['MODEL', 'LAYOUT1', 'LAYOUT2']) u.el('span', '', tabs, item);
      u.el('b', '', tabs, '▦');
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? header : footer;
        const cls =
          'end-control' + (placement === 'header' ? ' end-header' : '') + (placement === 'link' ? ' end-link' : '');
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const decoy = u.el('button', 'design-xtra', footer, 'Preview');
      const lens = u.el('span', 'preview-icon', decoy);
      lens.innerHTML =
        '<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="6" stroke-linecap="round"><circle cx="24" cy="24" r="17"/><path d="M37 37L54 54"/></svg>';
      decoy.insertBefore(lens, decoy.firstChild);
      body.appendChild(decoy);
      decoy.type = 'button';
      decoy.addEventListener('click', () => env.log('decoy', { what: 'Preview' }));
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
