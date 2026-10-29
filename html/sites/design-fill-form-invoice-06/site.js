(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-invoice-06',
    'brand': 'Receipt Entry',
    'title': 'Receipt Entry',
    'sub': 'Enter the details from the receipt',
    'instruction': 'left',
  };
  const notes = [
    'Enter the information exactly as shown on the receipt.',
    'If a field is not on the receipt, leave it blank.',
    'Check that all entered information matches the receipt.',
  ];
  const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const act = u.el('span', 'ds-act', top);
      act.innerHTML =
        '<svg viewBox="0 0 16 20" width="14" height="18"><path d="M8 1 3 6v4L1 12l3 6 6 1 4-5-2-5-4-1V5l3-2z" fill="white"/><path d="M5 10h5v5H6" fill="none" stroke="#333"/></svg><span>Activities</span>';
      const app = u.el('span', 'ds-app', top);
      app.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16"><rect x="1" y="1" width="14" height="14" rx="3" fill="#2b7bf0"/><path d="M5 5h6M5 8h6M5 11h4" stroke="#fff" stroke-width="1.4"/></svg>';
      u.el('span', '', app, C.brand);
      u.el('span', 'ds-clock', top, 'Sat Sep 13  10:24');
      const sys = u.el('span', 'ds-sys', top);
      sys.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M2 8q10-8 20 0M5 11q7-6 14 0M8 14q4-3 8 0" fill="none" stroke="white" stroke-width="2.7"/><path d="m10 17 2 3 2-3z" fill="white"/></svg><svg viewBox="0 0 24 24"><path d="M3 9h4l5-5v16l-5-5H3z" fill="white"/><path d="M16 7q6 5 0 10M19 4q8 8 0 16" fill="none" stroke="white" stroke-width="1.8"/></svg><svg viewBox="0 0 28 24"><rect x="2" y="5" width="22" height="14" rx="2" fill="none" stroke="white" stroke-width="2"/><path d="M25 10h2v4h-2M5 8h16v8H5z" fill="white"/></svg>';
      const head = u.el('div', 'ds-head', document.body);
      const ht = u.el('div', 'ds-head-t', head);
      u.el('b', '', ht, C.title);
      u.el('span', '', ht, C.sub);
      const wc = u.el('div', 'ds-wc', head);
      const group = u.el('div', 'ds-wc-group', wc);
      ['–', '▫'].forEach((t) => u.el('span', '', group, t));
      u.el('span', 'ds-wc-close', wc, '×');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = u.el('aside', 'ds-brief', main);
        const ic = u.el('div', 'ds-icon', b);
        ic.innerHTML =
          '<svg viewBox="0 0 36 36" width="36" height="36"><rect width="36" height="36" rx="9" fill="#2b7bf0"/><path d="M11 8h10l5 5v15H11z" fill="#fff"/><path d="M14 17h8M14 21h8M14 25h6" stroke="#2b7bf0" stroke-width="2"/></svg>';
        u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        u.el('hr', '', b);
        u.el('h3', '', b, 'Notes');
        const ul = u.el('ul', 'ds-notes', b);
        notes.forEach((t) => u.el('li', '', ul, t));
        if (mode === 'right') b.style.order = '2';
      }
      const right = u.el('div', 'ds-right', main);
      const stage = u.el('main', 'ds-stage', right);
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', note, ctx.instruction);
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', right);
      let submit = null;
      const clear = u.el('button', 'ds-cancel', foot, 'Clear All');
      clear.type = 'button';
      const er = ctx.rng.fork('chrome/end');
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(endWords.filter((t) => t !== 'Submit'));
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'header' ? ' ds-header-end' : placement === 'link' ? ' ds-endlink' : ''),
          placement === 'header' ? head : foot,
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
        const choices = endWords.filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const text = cr.pick(choices);
          const decoy = u.el('button', 'ds-cancel ds-xtra', foot, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          foot.insertBefore(decoy, clear);
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
