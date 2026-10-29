(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-11',
    'brand': 'Note Pad',
    'mode': 'side-left',
    'tokens': {
      'bg': '#f1f8fd',
      'panel': '#ffffff',
      'fg': '#153958',
      'accent': '#609c35',
      'font': 'Trebuchet MS,Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'New Note    My Notes    Settings    Help    Sign Out',
    'obstruction': [
      'System Maintenance This Weekend',
      'Our service will be unavailable Saturday 10:00 PM \u2013 Sunday 6:00 AM (PT). You can still work now. Save your changes regularly!',
      'Collapse announcement',
    ],
    'footer': '',
  };
  function announcement(u, onDismiss) {
    const el = u.el('section', 'reference-overlay banner', document.body);
    el.dataset.siteAnnouncement = '';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', D.obstruction[0]);
    u.el('h2', '', el, D.obstruction[0]);
    const copy = u.el('div', 'overlay-copy', el);
    D.obstruction[1].split(/(?<=\.) (?=You )/).forEach((line, i) => u.el('div', 'oc' + i, copy, line));
    const actions = u.el('div', 'overlay-actions', el);
    const dismiss = u.el('button', 'primary', actions, D.obstruction[2]);
    dismiss.type = 'button';
    dismiss.addEventListener('click', onDismiss);
    return { el, dismiss };
  }
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
      const ribbon = announcement(u, () => ribbon.el.remove());
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      if (ctx.display === 'header') {
        const headline = u.el('div', 'header-instruction', header, ctx.instruction);
        headline.dataset.role = 'instruction';
      }
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      note.classList.add('instruction-' + ctx.display);
      if (ctx.display !== 'hidden' && ctx.display !== 'header') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const endR = ctx.rng.fork('chrome/end');
        const placement = endR.pick(['footer', 'footer', 'footer', 'footer', 'toolbar', 'link']);
        const labels = ctx.content && ctx.content.END_LABELS;
        const options =
          labels && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const label = placement === 'footer' && endR.bool(0.75) ? 'Submit' : String(endR.pick(options));
        const cn = u.el('button', 'cancel-btn', footer, 'Cancel');
        cn.type = 'button';
        submit = u.el('button', 'end-control end-' + placement, footer, label);
        submit.type = 'button';
        submit.addEventListener('click', () => ctx.submit());
        const collideR = ctx.rng.fork('chrome/collide');
        if (collideR.bool(0.3)) {
          const words = options.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
          const alternatives = words.filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
          if (alternatives.length) {
            const decoy = u.el('button', 'end-xtra', footer, String(collideR.pick(alternatives)));
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.kind === 'banner') {
        document.querySelector('[data-site-announcement]')?.remove();
        return announcement(u, () => ctx.dismiss());
      }
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
      const oc = u.el('div', 'overlay-copy', el);
      if (named && ctx.kind === 'banner') {
        copy.split(/(?<=\.) (?=You )/).forEach((p, i) => u.el('div', 'oc' + i, oc, p));
      } else oc.textContent = copy;
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
