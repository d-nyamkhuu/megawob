(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-radio-05',
    'title': 'Subscription',
    'note': 'Note',
    'clock': '10:24 AM',
    'menus': ['File', 'Edit', 'View', 'Special', 'Help'],
  };
  const ICONS = {
    disk: '<svg viewBox="0 0 60 64" width="60" height="64"><path d="M3 3h54v58H3z" fill="#fff" stroke="#000" stroke-width="3"/><rect x="14" y="3" width="32" height="18" fill="#fff" stroke="#000" stroke-width="3"/><rect x="36" y="7" width="5" height="10" fill="#000"/><rect x="10" y="30" width="40" height="26" fill="#fff" stroke="#000" stroke-width="3"/><path d="M15 38h30M15 44h30M15 50h30" stroke="#000" stroke-width="2.5"/></svg>',
    folder:
      '<svg viewBox="0 0 66 58" width="66" height="58"><path d="M5 13V7h7l5-5h14l7 11" fill="#fff" stroke="#000" stroke-width="3"/><path d="M3 12h60v43H3z" fill="#fff" stroke="#000" stroke-width="3"/><path d="M59 13v41h4V13" fill="#000"/></svg>',
    trash:
      '<svg viewBox="0 0 48 70" width="48" height="70"><defs><pattern id="trash-dots" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#000"/></pattern></defs><path d="M17 8V3h12l4 5" fill="#fff" stroke="#000" stroke-width="2"/><path d="M4 9h41v7H4zM7 17h36v48l-4 3H10l-3-3z" fill="#fff" stroke="#000" stroke-width="2.5"/><path d="M34 17h9v48l-4 3h-5z" fill="url(#trash-dots)" stroke="#000" stroke-width="1"/><path d="M13 22v40M20 22v40M27 22v40M4 12h41" stroke="#000" stroke-width="2"/></svg>',
    apple:
      '<svg viewBox="0 0 20 24" width="20" height="24"><path d="M10 7c-3-2-8 0-8 7 0 5 3 9 5 9 1 0 2-1 3-1s2 1 3 1c2 0 5-4 5-6-3-1-4-6 0-8-2-3-6-3-8-2zM11 5c0-3 2-4 4-5 0 3-1 5-4 5z" fill="#000"/></svg>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const canonical = endRng.bool(0.5);
      const submitLabel = labels.find((x) => labelText(x).trim().toLowerCase() === 'submit') || labels[0];
      const endLabel = canonical ? labelText(submitLabel) : labelText(endRng.pick(labels));
      const endPlace = canonical ? 'footer' : endRng.pick(['menubar', 'titlebar', 'footer-link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideRng.bool(0.3)) {
        const options = [
          ...new Set(labels.map(labelText).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (options.length) collision = collideRng.pick(options);
      }
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const bar = u.el('nav', 'mac-menubar', content);
      const ap = u.el('span', 'mac-apple', bar);
      ap.innerHTML = ICONS.apple;
      C.menus.forEach((m) => u.el('span', 'mac-menu', bar, m));
      const ck = u.el('span', 'mac-clock', bar);
      ck.innerHTML =
        '<svg viewBox="0 0 22 22" width="22" height="22" style="vertical-align:middle;margin-right:1.2vw"><rect x="1.5" y="1.5" width="19" height="19" rx="3" fill="#fff" stroke="#000" stroke-width="3"/><circle cx="11" cy="10" r="4" fill="#000"/><rect x="3" y="15" width="16" height="3" fill="#000"/></svg>' +
        C.clock;
      if (!ctx.finish && endPlace === 'menubar') {
        const b = u.el('button', 'mac-end-menu', bar, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', () => ctx.submit());
      }
      const headerNote = ctx.display === 'header' ? u.el('div', 'mac-task-header', content, ctx.instruction) : null;
      if (ctx.display === 'panel' || ctx.display === 'toast')
        u.el('div', 'mac-task-header mac-task-fallback', content, ctx.instruction);
      const mk = (cls, svg, label) => {
        const d = u.el('div', 'mac-icon ' + cls, content);
        const i = u.el('div', 'mac-glyph', d);
        i.innerHTML = svg;
        u.el('div', 'mac-cap', d, label);
      };
      mk('hd', ICONS.disk, 'Macintosh HD');
      mk('docs', ICONS.folder, 'Documents');
      mk('trash', ICONS.trash, 'Trash');
      let submit = null;
      const win = u.el('div', 'mac-win', content);
      const tb = u.el('div', 'mac-title', win);
      const stage = u.el('main', 'ds-stage', win);
      u.el('span', 'mac-close', tb);
      u.el('span', 'mac-title-text', tb, C.title);
      if (!ctx.finish && endPlace === 'titlebar') {
        submit = u.el('button', 'mac-end-title', tb, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      const showNote = ctx.display === 'panel' || ctx.display === 'toast';
      const note = showNote
        ? u.el('aside', `mac-note${ctx.display === 'toast' ? ' mac-note-toast' : ''}`, content)
        : null;
      if (note) {
        const nt = u.el('div', 'mac-note-title', note);
        u.el('span', 'mac-close', nt);
        u.el('span', 'mac-title-text', nt, ctx.display === 'toast' ? 'Message' : C.note);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', win);
      const reset = u.el('button', 'ds-reset', foot, 'Cancel');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        const controls = stage.querySelectorAll('input[type=radio]');
        controls.forEach((el) => (el.checked = false));
      });
      if (!ctx.finish && endPlace === 'footer') {
        submit = u.el('button', 'ds-submit', foot, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      } else if (!ctx.finish && endPlace === 'footer-link') {
        submit = u.el('button', 'ds-submit ds-submit-link', foot, endLabel + ' ›');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', () => ctx.submit());
      }
      if (!ctx.finish && endPlace === 'menubar') submit = bar.querySelector('[data-role="submit"]');
      if (collision) {
        const p = endPlace === 'menubar' ? bar : endPlace === 'titlebar' ? tb : foot;
        const cls =
          endPlace === 'menubar' ? 'mac-xtra-menu' : endPlace === 'titlebar' ? 'mac-xtra-title' : 'mac-xtra-footer';
        const b = u.el('button', cls, p, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
