(function () {
  'use strict';
  const C = { 'site': 'design-type-text-multi-02' };
  const ICON_DOC =
    '<svg viewBox="0 0 24 30" width="100%" height="100%"><path d="M2 1h14l6 6v22H2z" fill="#f4f4f4" stroke="#000" stroke-width="1.4"/><path d="M16 1v7h6M5 4h7v6H5zM5 13h6m2 0h6M5 16h6m2 0h6M5 19h6m2 0h6M5 22h6m2 0h6M5 25h14" fill="none" stroke="#000" stroke-width="1"/></svg>';
  const ICON_BOOK =
    '<svg viewBox="0 0 110 140" width="100%" height="100%"><g stroke="#111" stroke-width="2.2" stroke-linejoin="miter"><path d="M9 36L80 3V101L31 137L9 134Z" fill="#ddd"/><path d="M14 38L95 7V109L31 137L14 135Z" fill="#eee"/><path d="M17 40L110 9V103L31 137L17 136Z" fill="#e6e6e6"/><path d="M31 42v95M17 40l14 2L110 9M35 49l10-5m-10 9 13-7M74 53l22-8M74 64l22-8M74 75l22-8M74 86l22-8" fill="none"/><path d="M55 51c-8 2-11 10-10 18 0 5 4 8 4 11l-3 8-10 10v8l28-10v-8l-8-3-1-6c7-5 9-12 7-19-1-7-3-11-7-9Z" fill="#000" stroke-width="1"/><path d="M104 19l3-2m-2 5 3-1"/><g fill="#f5f5f5"><path d="M6 40h16v6H6zM6 53h16v6H6zM6 66h16v6H6zM6 79h16v6H6zM6 92h16v6H6zM6 105h16v6H6zM6 118h16v6H6zM6 131h16v6H6z"/></g></g></svg>';
  const ICON_Q =
    '<svg viewBox="0 0 30 30" width="100%" height="100%"><path d="M2 2h26v26H2z" fill="#ddd" stroke="#fff"/><path d="M3 28h25V3" fill="none" stroke="#555"/><text x="15" y="25" font-size="29" font-weight="bold" text-anchor="middle" font-family="Arial" fill="#fff">?</text><text x="14" y="24" font-size="29" font-weight="bold" text-anchor="middle" font-family="Arial">?</text></svg>';
  const ICON_ERASE =
    '<svg viewBox="0 0 40 30" width="100%" height="100%"><path d="M3 18L25 2L37 10L17 27L6 25Z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M3 18l13 5 1 4-11-2Z" fill="#999" stroke="#000" stroke-width="1.5"/></svg>';
  const ICON_X =
    '<svg viewBox="0 0 30 30" width="100%" height="100%"><path d="M5 5L25 25M25 5L5 25" stroke="#fff" stroke-width="4"/><path d="M4 4L24 24M24 4L4 24" stroke="#000" stroke-width="2"/></svg>';
  const ICON_APP =
    '<svg viewBox="0 0 30 30" width="100%" height="100%"><path d="M2 1h25l2 3v25H2z" fill="#eee" stroke="#111" stroke-width="1.3"/><path d="M5 4h21v22H5z" fill="#212da2" stroke="#111"/><g fill="none" stroke="#dad471" stroke-width="1"><path d="M10 8v14m3-13v11m3-13 2 16m3-13v12M9 9l6 3 8-4M9 17l6-4 8 8M10 23l9-6M12 6l2 3m5-3-2 5"/></g><path d="M4 3h22M4 3v24" stroke="#fff" fill="none"/></svg>';
  const ICON_FOLDER =
    '<svg viewBox="0 0 30 30" width="100%" height="100%"><path d="M3 8h7l3-4h6l2 4h6v20H3z" fill="#ddd" stroke="#111" stroke-width="2"/><path d="M4 10h23v16H4z" fill="#fff" stroke="#111"/><path d="M6 13h18M6 17h18M6 21h8m3 0h7" stroke="#111" stroke-width="1.3"/></svg>';
  const ICON_CONTACT =
    '<svg viewBox="0 0 30 30" width="100%" height="100%"><path d="M2 2h26v26H2z" fill="#ccc" stroke="#eee" stroke-width="2"/><path d="M6 5h14l5 5v14H6z" fill="#eee" stroke="#111"/><path d="M20 5v5h5M9 10h4m-4 3h3m8 0h3m-3 4h3m-3 4h3" fill="none" stroke="#111"/><circle cx="15" cy="12" r="2"/><path d="M12 20v-3l3-3 3 3v3z" fill="#111"/></svg>';
  const END_FALLBACK = [
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
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      function icon(parent, cls, svg) {
        const s = u.el('span', cls, parent);
        s.innerHTML = svg;
        return s;
      }
      const top = u.el('header', 'os-top', document.body);
      const brand = u.el('span', 'os-brand', top);
      icon(brand, 'os-ico', ICON_APP);
      u.el('span', '', brand, 'Workplace Shell');
      const tm = u.el('span', 'os-topmenu', top);
      icon(tm, 'os-ico os-ico-folder', ICON_FOLDER);
      ['Folder', 'View', 'Special', 'Help'].forEach((t) => u.el('span', '', tm, t));
      u.el('span', 'os-clock', top, '10:24 AM');
      const win = u.el('div', 'os-win', document.body);
      const tb = u.el('div', 'os-title', win);
      icon(tb, 'os-ico', ICON_CONTACT);
      u.el('span', 'os-title-t', tb, 'People Manager - New Contact - Workplace Shell');
      const endRng = ctx.rng.fork('chrome/end');
      const endPool = (
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_FALLBACK
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const alternatives = endPool.filter((x) => x.trim().toLowerCase() !== 'submit');
      const endLabel = endRng.bool(0.5) || !alternatives.length ? 'Submit' : endRng.pick(alternatives);
      const labelCode = Array.from(endLabel).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
      const endPlace = endLabel.trim().toLowerCase() === 'submit' ? 'footer' : labelCode % 2 ? 'title' : 'link';
      const endBtn = (parent, cls, label) => {
        const b = u.el(cls === 'os-end-link' ? 'a' : 'button', 'os-btn ' + cls, parent, label);
        if (cls === 'os-end-link') b.href = '#';
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
      let submit = null;
      if (!ctx.finish && endPlace === 'title') submit = endBtn(tb, 'os-title-end', endLabel);
      const wb = u.el('span', 'os-wbtn', tb);
      ['_', '□', '×'].forEach((t) => u.el('b', '', wb, t));
      const mb = u.el('nav', 'os-menu', win);
      ['File', 'Edit', 'View', 'Insert', 'Tools', 'Help'].forEach((t) => u.el('span', '', mb, t));
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const choices = [...new Set(endPool)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) {
          const text = collideRng.pick(choices);
          const d = u.el('button', 'os-pq', mb, text);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      let note = null;
      if (ctx.display !== 'hidden') {
        note = u.el('aside', 'os-note os-note-' + ctx.display, win);
        icon(note, 'os-note-ico', ICON_DOC);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const tabs = u.el('div', 'os-tabs', win);
      ['Contact Details', 'Address', 'Notes', 'Categories'].forEach((t, i) =>
        u.el('span', 'os-tab' + (i === 0 ? ' on' : ''), tabs, t),
      );
      const panel = u.el('div', 'os-panel', win);
      const side = u.el('div', 'os-side', panel);
      if (ctx.display === 'panel' && note) {
        side.classList.add('os-side-instruction');
        side.append(note);
      }
      icon(side, 'os-book', ICON_BOOK);
      const stage = u.el('main', 'ds-stage', panel);
      const foot = u.el('footer', 'os-foot', win);
      function btn(parent, cls, svg, text) {
        const b = u.el('button', 'os-btn ' + cls, parent);
        b.type = 'button';
        icon(b, 'os-bico', svg);
        u.el('span', '', b, text);
        return b;
      }
      btn(foot, 'os-help', ICON_Q, 'Help');
      u.el('span', 'os-spacer', foot);
      const clear = btn(foot, 'os-clear', ICON_ERASE, 'Clear');
      clear.addEventListener('click', () => {
        stage.querySelectorAll('input,textarea').forEach((i) => {
          if (i.disabled || !i.value) return;
          i.value = '';
          i.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
      if (!ctx.finish && endPlace === 'footer') {
        submit = btn(foot, 'ds-submit', ICON_DOC, endLabel);
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', () => ctx.submit());
      }
      if (!ctx.finish && endPlace === 'link') submit = endBtn(foot, 'os-end-link', endLabel + ' ›');
      btn(foot, 'os-cancel', ICON_X, 'Cancel');
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
