(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-single-05',
    'brand': 'Text Entry Exercise',
    'title': 'Your Answer',
    'instruction': 'left',
    'rail': '',
    'menu': 'File|Edit|View|Tools|Help',
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
      const body = u.el('div', 'ds-body', document.body);
      const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#ff780b" stroke-width="2">';
      const DARK = '<svg viewBox="0 0 24 24" fill="none" stroke="#2b3240" stroke-width="1.6">';
      const tools = u.el('aside', 'ds-tools', body);
      u.el('h3', '', tools, 'Tools');
      [
        [
          'Calculator',
          ICON +
            '<rect x="3" y="1" width="18" height="22" rx="1" fill="#ff780b"/><path d="M6 5h12" stroke="#fff" stroke-width="3"/><path d="M6 10h2m3 0h2m3 0h2M6 14h2m3 0h2m3 0h2M6 18h2m3 0h2m3 0h2" stroke="#fff" stroke-width="2"/></svg>',
        ],
        ['Notepad', DARK + '<path d="M3 1h10l7 7v15H3zM13 1v7h7"/><path d="M6 11h11M6 15h11M6 19h9"/></svg>'],
        ['Timer', DARK + '<circle cx="12" cy="12" r="9.5"/><path d="M12 5v7h5"/></svg>'],
      ].forEach(([n, s]) => {
        const t = u.el('div', 'ds-tool', tools);
        t.insertAdjacentHTML('beforeend', s);
        u.el('span', '', t, n);
      });
      const content = u.el('div', 'ds-content', body);
      const notes = u.el('aside', 'ds-notes', body);
      const nh = u.el('h3', '', notes);
      nh.insertAdjacentHTML(
        'beforeend',
        ICON +
          '<path d="M4 1h10l6 6v15q0 1-1 1H4q-1 0-1-1V2q0-1 1-1z" fill="#ff780b"/><path d="M14 2v6h6M6 11h11M6 15h11M6 19h11" stroke="#fff" stroke-width="1.5"/></svg>',
      );
      u.el('span', '', nh, 'Notes');
      const notesText = u.el(
        'p',
        '',
        notes,
        ctx.display === 'panel' ? ctx.instruction : 'You can use the tools on the left if needed.',
      );
      notes.classList.toggle('ds-note-panel', ctx.display === 'panel');
      const head = u.el('div', 'ds-cardhead', content);
      const hl = u.el('div', 'l', head);
      u.el('span', 'bar', hl);
      u.el('span', '', hl, 'Task 1 of 1');
      u.el('span', 'ds-req', head, 'Required');
      const natural = C.instruction;
      let mode = ctx.display || 'header';
      if (mode === 'panel' && window.innerWidth < 900) mode = 'header';
      if (mode === 'toast' && window.innerHeight < 560) mode = 'header';
      const main = u.el('div', 'ds-main', content);
      let instruction = null;
      if (mode !== 'hidden' && mode !== 'panel') {
        const note = mode === 'toast' ? u.el('aside', 'ds-toast', main) : main;
        instruction = u.el('div', 'ds-instruction', note, ctx.instruction);
        instruction.style.whiteSpace = 'normal';
        if (mode === 'header') u.el('p', 'ds-sub', main, 'Type the exact text shown above into the input field below.');
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', main);
      const ready = u.el('span', '', foot, 'Ready');
      let submit = null;
      let placement = null;
      let label = null;
      const er = ctx.rng.fork('chrome/end');
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish) {
        if (er.bool(0.5)) {
          placement = 'footer';
          label = 'Submit';
        } else {
          placement = er.pick(['footer', 'header', 'link']);
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
          const picked = er.pick(labels);
          label = typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || String(picked);
        }
      }
      const endButton = (parent, cls, text) => {
        const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text, collide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const words = (
          (ctx.content && ctx.content.END_LABELS) || [
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
          ]
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const opts = [...new Set(words)].filter((x) => x.trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (opts.length) collide = cr.pick(opts);
      }
      if (placement === 'footer' && !ctx.finish) submit = endButton(foot, 'ds-submit', label);
      if (placement === 'link' && !ctx.finish) submit = endButton(foot, 'ds-endlink', label + ' ›');
      if (placement === 'header' && !ctx.finish) submit = endButton(head, 'ds-submit ds-submit-head', label);
      if (collide) decoy(foot, collide, true);
      ready.textContent = ctx.finish ? 'Ready' : '';
      foot.classList.toggle('ds-finish', !!ctx.finish);
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
