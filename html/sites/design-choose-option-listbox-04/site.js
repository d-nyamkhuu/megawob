(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-listbox-04',
    'brand': 'Trip Details',
    'title': 'Destination',
    'instruction': 'top',
    'rail': '',
    'menu': '',
    'briefTitle': 'Instructions',
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
      const mast = u.el('header', 'ds-mast', document.body);
      const mb = u.el('div', 'ds-mast-l', mast);
      u.el('div', 'ds-mast-t', mb, 'Event Registration');
      u.el('div', 'ds-mast-s', mb, 'Conference Attendance');
      const nav = u.el('nav', 'ds-nav', mast);
      ['Home', 'Schedule', 'Registration', 'Contact'].forEach((t) => {
        const item = u.el('span', '', nav, t);
        item.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const content = u.el('div', 'ds-content', document.body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'top';
      u.el('h1', 'ds-h1', content, 'Attendee Information');
      u.el('p', 'ds-lede', content, 'Please provide the details below to register for the conference.');
      const r1 = u.el('div', 'ds-row r1', content);
      u.el('span', 'ds-lab', r1, 'Full Name');
      u.el('div', 'ds-fld', r1, 'Taylor Morgan');
      const r2 = u.el('div', 'ds-row r2', content);
      u.el('span', 'ds-lab', r2, 'Email Address');
      u.el('div', 'ds-fld', r2, 'taylor.morgan@example.com');
      const r3 = u.el('div', 'ds-row r3', content);
      u.el('span', 'ds-lab', r3, 'City');
      const stage = u.el('main', 'ds-stage', content);
      if (mode === 'top' || mode === 'panel') {
        const b = u.el('aside', 'ds-side' + (mode === 'panel' ? ' ds-note-panel' : ''), content);
        if (mode === 'panel') u.el('div', 'ds-note-title', b, 'Registration note');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        u.el('div', 'ds-hint', b, 'Select from the list.');
      }
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-note-title', note, 'Registration reminder');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const reference = er.bool(0.5);
      const placement = reference ? 'footer' : er.pick(['header', 'link']);
      const label = reference ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'header' ? ' ds-submit-header' : placement === 'link' ? ' ds-submit-link' : ''),
          placement === 'header' ? mast : foot,
          label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const alternatives = [...new Set(labels)].filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase());
        if (alternatives.length) {
          const text = cr.pick(alternatives);
          const decoy = u.el('button', 'ds-xtra', foot, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      const step = u.el('div', 'ds-step', foot);
      u.el('span', '', step, 'Step 1 of 3');
      ['1', '2', '3'].forEach((t, i) => u.el('span', 'ds-pg' + (i ? '' : ' cur'), step, t));
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
