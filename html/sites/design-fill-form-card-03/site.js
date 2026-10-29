(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-card-03',
    'title': 'CONTACT FORM',
    'fillTitle': 'FILL FROM PROFILE',
    'fillText': 'Use the profile on the right to complete the form. Leave any field blank if it’s not provided.',
    'rail': 'PEOPLE',
  };
  const ICONS = {
    person:
      '<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="7.5" r="4" fill="currentColor"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7z" fill="currentColor"/></svg>',
    group:
      '<svg viewBox="0 0 28 24" width="30" height="26"><circle cx="9" cy="7" r="3.8" fill="currentColor"/><circle cx="20" cy="8" r="3.2" fill="currentColor"/><path d="M1 20c0-5 4-7 8-7s8 2 8 7zM17 14c5-1.5 10 1 10 6h-8z" fill="currentColor"/></svg>',
    gear: '<svg viewBox="0 0 24 24" width="27" height="27"><path fill="currentColor" fill-rule="evenodd" d="M10 1h4l.7 3 2 .9 2.6-1.6 2.8 2.8-1.6 2.6.9 2 3 .7v4l-3 .7-.9 2 1.6 2.6-2.8 2.8-2.6-1.6-2 .9-.7 3h-4l-.7-3-2-.9-2.6 1.6-2.8-2.8 1.6-2.6-.9-2-3-.7v-4l3-.7.9-2L3.9 6.1l2.8-2.8 2.6 1.6 2-.9zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const blue = u.el('section', 'k-blue', document.body);
      u.el('h1', 'k-title', blue, C.title);
      let mode = ctx.display || 'header';
      if (
        (mode === 'panel' || mode === 'toast') &&
        (document.documentElement.clientWidth < 1260 || document.documentElement.clientHeight < 700)
      )
        mode = 'header';
      if (mode === 'header') {
        const b = u.el('aside', 'ds-header-note', blue);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', blue);
      const foot = u.el('footer', 'ds-footer', blue);
      const rail = u.el('aside', 'k-rail', document.body);
      u.el('div', 'k-rail-h', rail, C.rail);
      [
        ['Contact Form', 'person', true],
        ['Directory', 'group', false],
        ['Settings', 'gear', false],
      ].forEach(([t, k, on]) => {
        const it = u.el('div', 'k-nav' + (on ? ' on' : ''), rail);
        const ic = u.el('span', 'k-ico', it);
        ic.innerHTML = ICONS[k];
        u.el('span', '', it, t);
        it.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const fill = u.el('section', 'k-fill', document.body);
      u.el('div', 'k-fill-h', fill, C.fillTitle);
      u.el('p', '', fill, C.fillText);
      if (mode === 'panel' || mode === 'toast') {
        const note = u.el('aside', mode === 'panel' ? 'ds-panel-note' : 'ds-toast', rail);
        u.el('div', 'k-note-h', note, mode === 'panel' ? 'TASK NOTE' : 'CURRENT TASK');
        u.el('div', 'ds-instruction', note, ctx.instruction);
        if (note.getBoundingClientRect().bottom > document.documentElement.clientHeight * 0.56) {
          note.className = 'ds-header-note';
          note.querySelector('.k-note-h').remove();
          blue.appendChild(note);
        }
      }
      // New frame choices use separate streams, preserving the task's seeded draws.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5),
        placement = original ? 'footer' : er.pick(['rail', 'link']);
      const label = original ? 'Submit' : er.pick(labels.filter((t) => t !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'rail' ? rail : placement === 'link' ? fill : foot;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'footer' ? '' : ' ds-submit-' + placement),
          parent,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options),
            b = u.el('button', 'ds-xtra', foot, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
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
