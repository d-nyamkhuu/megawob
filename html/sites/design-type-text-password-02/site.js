(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-password-02',
    'brand': 'Manuscript Keeper',
    'menu': 'File|Edit|Tools|Help',
    'instruction': 'top',
    'briefTitle': 'Notes:',
    'notes': [
      'Type the password exactly as shown, including uppercase letters, lowercase letters, numbers and symbols.',
      'Enter it in both fields.',
    ],
  };
  env.site({
    name: C.site,
    styles: ['ref.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const book = u.el('span', 'ds-logo', top);
      book.innerHTML =
        '<svg viewBox="0 0 40 34" width="100%" height="100%"><path d="M3 5 L19 8 L19 31 L3 28Z" fill="#d8b866" stroke="#6b4a1c" stroke-width="2"/><path d="M37 5 L21 8 L21 31 L37 28Z" fill="#e8cf8a" stroke="#6b4a1c" stroke-width="2"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const wc = u.el('span', 'ds-wc', top);
      wc.innerHTML =
        '<svg viewBox="0 0 150 24" width="100%" height="100%" fill="none" stroke="#d9c9a8" stroke-width="2"><path d="M4 18 H22"/><rect x="62" y="4" width="15" height="15"/><path d="M110 4 L126 20 M126 4 L110 20"/></svg>';
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const commonEnd = endRng.bool(0.5);
      const endLabel = commonEnd ? 'Submit' : labelText(endRng.pick(endLabels));
      const placement = ctx.finish
        ? null
        : commonEnd
          ? 'footer'
          : endRng.pick(['footer-link', 'header', 'header-icon']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [
          ...new Set(endLabels.map(labelText).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (options.length) collide = collideRng.pick(options);
      }
      const endButton = (parent, cls, text, icon) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const decoyButton = (parent, text, isCollide) => {
        const b = u.el('button', isCollide ? 'ds-pq' : 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      if (placement === 'header' || placement === 'header-icon') {
        const tools = u.el('div', 'ds-header-tools', top);
        submit = endButton(tools, 'ds-submit ds-icon', '✓');
      }
      if (collide && (placement === 'header' || placement === 'header-icon')) decoyButton(foot, collide, true);
      if (placement === 'footer') {
        if (collide) decoyButton(foot, collide, true);
        submit = endButton(foot, 'ds-submit', endLabel);
      } else if (placement === 'footer-link') {
        if (collide) decoyButton(foot, collide, true);
        const link = u.el('a', 'ds-endlink', foot, endLabel + ' ›');
        link.href = '#';
        link.dataset.role = 'submit';
        link.setAttribute('aria-label', endLabel);
        link.title = endLabel;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = link;
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      {
        if (mode === 'panel') {
          const side = u.el('aside', 'ds-margin', body);
          u.el('div', 'ds-instruction', side, ctx.instruction);
          u.el('hr', 'ds-hr', side);
          u.el('h3', 'ds-notes-h', side, C.briefTitle);
          const ul = u.el('ul', 'ds-notes', side);
          C.notes
            .filter((t, i) => !ctx.finish || i !== 2)
            .forEach((t, i) => {
              const li = u.el('li', '', ul, i === 0 ? '' : t);
              if (i === 0)
                [
                  'Type the password exactly',
                  'as shown, including',
                  'uppercase letters, lowercase',
                  'letters, numbers and symbols.',
                ].forEach((line) => u.el('span', 'ds-note-line', li, line));
            });
        }
        if (mode === 'header') {
          const note = u.el('div', 'ds-header-note', content, ctx.instruction);
          content.insertBefore(note, main);
          note.setAttribute('aria-label', 'Task instruction');
        }
        if (mode === 'toast') {
          const note = u.el('div', 'ds-toast', content, ctx.instruction);
          content.insertBefore(note, main);
          note.setAttribute('aria-label', 'Task instruction');
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
