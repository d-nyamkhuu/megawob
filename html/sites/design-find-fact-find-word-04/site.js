(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-04',
    'brand': 'Contact Book',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': 'Contacts|Calendar|Notes|Settings',
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
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = labelOf(er.bool(0.5) ? labels.find((x) => labelOf(x) === 'Submit') || labels[0] : er.pick(labels));
      const placement = er.pick(['header', 'answer', 'answer', 'answer', 'footer', 'link']);
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (options.length) collide = cr.pick(options);
      }
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-logo', top).innerHTML =
        '<svg viewBox="0 0 90 58" width="90" height="58"><defs><linearGradient id="paper"><stop stop-color="#bc8d70"/><stop offset=".45" stop-color="#f4e2ca"/><stop offset="1" stop-color="#a96c50"/></linearGradient></defs><path d="M1 13H8V48Q26 44 45 53Q64 44 82 48V13H89V55H1Z" fill="#4e1520"/><path d="M10 8Q28 4 45 16Q62 4 80 8V46Q61 42 45 52Q29 42 10 46Z" fill="#f9ead7" stroke="#783e30"/><path d="M15 3Q31 2 44 13V48Q29 37 15 40ZM46 13Q59 2 75 3V40Q61 37 46 48Z" fill="url(#paper)" stroke="#9b6c55" stroke-width=".7"/><path d="M44 13V48M46 13V48" stroke="#63302a"/><path d="M18 9Q30 8 41 17M49 17Q61 8 72 9" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 12Q30 11 41 20M49 20Q61 11 72 12" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 15Q30 14 41 23M49 23Q61 14 72 15" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 18Q30 17 41 26M49 26Q61 17 72 18" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 21Q30 20 41 29M49 29Q61 20 72 21" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 24Q30 23 41 32M49 32Q61 23 72 24" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 27Q30 26 41 35M49 35Q61 26 72 27" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 30Q30 29 41 38M49 38Q61 29 72 30" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 33Q30 32 41 41M49 41Q61 32 72 33" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 36Q30 35 41 44M49 44Q61 35 72 36" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M7 10V49Q28 46 45 54Q62 46 83 49V10" fill="none" stroke="#fff5e6" stroke-width="1.3"/></svg>';
      const tt = u.el('div', 'ds-titles', top);
      u.el('div', 'ds-brand', tt, 'Rivermere Public Library');
      u.el('div', 'ds-nav', tt, 'Catalog  ·  Books  ·  Knowledge  ·  Our Community');
      const tag = u.el('div', 'ds-tag', top);
      u.el('div', '', tag, 'A More Informed Tomorrow');
      u.el('div', 'ds-tagrule', tag);
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display || 'header';
      content.dataset.instruction = mode;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', content);
      const left = u.el('div', 'ds-left', main);
      const rec = u.el('div', 'ds-record', left);
      u.el('h1', '', rec, 'The Quiet Compass');
      [
        ['Author:', 'Holloway, Miriam'],
        ['Year:', '1996'],
        ['Publisher:', 'Northfield Press'],
        ['Subjects:', 'Travel -- Europe -- Description and travel'],
        ['', 'Self-discovery -- Anecdotes'],
        ['ISBN:', '0-917362-28-4'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-rrow', rec);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const stage = u.el('main', 'ds-stage', left);
      const right = u.el('aside', 'ds-right', main);
      u.el('h2', '', right, 'Reading Comprehension Task');
      if (mode === 'header') briefing(right, 'ds-header-note');
      if (mode === 'panel') briefing(right, 'ds-brief');
      if (mode === 'toast') briefing(right, 'ds-toast');
      u.el('div', 'ds-yours', right, 'Your Answer:');
      u.el('div', 'ds-slot', right);
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el(placement === 'link' && cls === 'ds-link' ? 'a' : 'button', cls, parent, text);
        b.type = 'button';
        if (b.tagName === 'A') b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (!ctx.finish && placement === 'answer') submit = makeEnd(right, 'ds-submit', label);
      u.el('h3', '', right, 'Item Details');
      const dl = u.el('div', 'ds-details', right);
      [
        ['Format:', 'Book'],
        ['Language:', 'English'],
        ['Pages:', '320'],
        ['Call Number:', '914.04 HOL'],
        ['Location:', 'Main Library'],
        ['Status:', 'Available'],
      ].forEach((r) => {
        const row = u.el('div', '', dl);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      u.el('div', 'ds-ask', right, 'Questions? Ask a librarian.');
      if (!ctx.finish && placement === 'header') submit = makeEnd(tag, 'ds-header-end', label);
      if (mode === 'hidden') content.dataset.instruction = 'hidden';
      const foot = u.el('footer', 'ds-footer', document.body);
      u.el('span', '', foot, 'Rivermere Public Library');
      u.el('span', '', foot, 'Knowledge Brings Us Together');
      if (!ctx.finish && (placement === 'footer' || placement === 'link'))
        submit = makeEnd(
          foot,
          placement === 'link' ? 'ds-link' : 'ds-footer-end',
          placement === 'link' ? label + ' ›' : label,
        );
      if (collide) decoy(placement === 'footer' || placement === 'link' ? foot : tag, collide);
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
