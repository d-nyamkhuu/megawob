(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-listbox-10',
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
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'form' : er.pick(['header', 'footer']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endWords);
      const cr = ctx.rng.fork('chrome/collide');
      const colliding = cr.bool(0.3)
        ? cr.pick(endWords.filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      const decoyBtn = (parent, label, collide) => {
        const b = u.el('button', 'ds-end-link ds-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
        return b;
      };
      const top = u.el('header', 'ds-top', document.body);
      const tl = u.el('div', 'ds-top-l', top);
      u.el('span', 'ds-brand', tl, 'CivicWorks');
      u.el('span', 'ds-portal', tl, 'City Administration Portal');
      const tr = u.el('div', 'ds-top-r', top);
      ['Help', 'My Account', 'Sign Out'].forEach((t, i) => {
        if (i) u.el('i', '', tr, '|');
        u.el('span', '', tr, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('section', 'ds-pane ds-left', body);
      u.el('h2', 'ds-ph', left, 'City Selection');
      const lbody = u.el('div', 'ds-pb', left);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
      let note = null;
      if (mode !== 'hidden') {
        note = u.el('div', 'ds-instruction' + (ctx.instruction.length > 70 ? ' long' : ''), lbody, ctx.instruction);
      }
      const row = u.el('div', 'ds-row', lbody);
      const stage = u.el('main', 'ds-stage', row);
      const det = u.el('div', 'ds-details', row);
      u.el('h3', 'ds-dh', det, 'City Details');
      if (note && mode === 'left') {
        note.classList.add('ds-panel-instruction');
        det.prepend(note);
      }
      if (note && mode === 'toast') note.classList.add('ds-toast');
      const dl = u.el('div', 'ds-db', det);
      ['Name:', 'State:', 'Population:', 'Region:'].forEach((t) => {
        const r = u.el('div', 'ds-kv', dl);
        u.el('b', '', r, t);
        u.el('span', '', r, '—');
      });
      const right = u.el('section', 'ds-pane ds-right', body);
      const rightHead = u.el('h2', 'ds-ph', right, 'Additional Information');
      const rb = u.el('div', 'ds-pb ds-rb', right);
      u.el('p', 'ds-hint', rb, 'Details will appear here after you select a city.');
      const kv = u.el('div', 'ds-kvs', rb);
      ['Mayor:', 'Founded:', 'Elevation:', 'Time Zone:', 'Website:'].forEach((t) => {
        const r = u.el('div', 'ds-kv', kv);
        u.el('b', '', r, t);
        u.el('span', '', r, '—');
      });
      u.el('hr', '', rb);
      u.el('div', 'ds-notes-l', rb, 'Notes');
      const ta = u.el('textarea', 'ds-notes', rb);
      ta.placeholder = 'Add notes about the selected city...';
      const acts = u.el('div', 'ds-acts', rb);
      const clear = u.el('button', 'ds-clear', acts, 'Clear');
      clear.type = 'button';
      let submit = null;
      if (!ctx.finish && placement !== 'footer') {
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'header' ? ' ds-end-header' : ''),
          placement === 'header' ? rightHead : acts,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      u.el('span', '', foot, '© 2013 CivicWorks. All rights reserved.');
      const ft = u.el('div', 'ds-footer-tools', foot);
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'ds-end-link', ft, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (colliding) decoyBtn(ft, colliding, true);
      ['Help', 'My Account', 'Sign Out'].forEach((label) => {
        const item = [...tr.querySelectorAll('span')].find((el) => el.textContent === label);
        item.addEventListener('click', () => env.log('decoy', { label }));
      });
      const fl = u.el('div', 'ds-fl', foot);
      ['Terms of Use', 'Privacy Policy', 'Contact'].forEach((t, i) => {
        if (i) u.el('i', '', fl, '|');
        u.el('span', '', fl, t);
      });
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
