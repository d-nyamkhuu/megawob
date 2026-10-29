(function () {
  'use strict';
  const C = { site: 'design-act-in-time-simon-09' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        r = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, '◉　MEMORY.PRG');
      const win = u.el('span', 'ds-window', top);
      ['−', '□', '×'].forEach((x) => u.el('b', '', win, x));
      const nav = u.el('nav', 'ds-menu', document.body);
      ['File', 'Game', 'Options', 'Help'].forEach((x) => u.el('span', '', nav, x));
      const content = u.el('div', 'ds-content', document.body);
      let display = ctx.display;
      if (display === 'panel' || display === 'toast') display = 'top';
      document.body.dataset.simonbrief = display;
      function brief(parent, cls) {
        const n = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        return n;
      }
      if (ctx.display === 'header') brief(content, 'ds-header-note');
      const stage = u.el('main', 'ds-stage', content);
      if (ctx.display === 'toast') {
        const note = brief(content, 'ds-toast');
        content.insertBefore(note, stage);
        note.dataset.role = 'instruction';
      } else if (ctx.display === 'panel') {
        const note = brief(content, 'ds-panel');
        content.insertBefore(note, stage);
        note.dataset.role = 'instruction';
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-sequence', foot, '▣　Sequence:');
      const tools = u.el('div', 'ds-footer-tools', foot);
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || 'Submit');
      let label = 'Submit';
      if (!ctx.finish) label = r.bool(0.5) ? 'Submit' : labelOf(r.pick(labels));
      function decoy(text, collide, parent) {
        const b = u.el('button', 'ds-xtra', parent || tools, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
      }
      let submit = null;
      if (!ctx.finish) {
        const place = r.pick(['footer', 'footer', 'header', 'link']);
        const parent = place === 'header' ? nav : tools;
        if (place === 'header') nav.classList.add('ds-menu-with-submit');
        if (place === 'link') {
          submit = u.el('button', 'ds-submit ds-link-submit', tools, label + ' ›');
        } else {
          submit = u.el('button', 'ds-submit' + (place === 'header' ? ' ds-header-submit' : ''), parent, label);
        }
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (cr.bool(0.3) && !ctx.finish) {
        const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) decoy(cr.pick(pool), true, cr.pick(['footer', 'header']) === 'header' ? nav : tools);
      }
      if (r.bool(0.3))
        decoy(r.pick((ctx.content && ctx.content.DECOY_LABELS) || ['Help', 'Save draft', 'History']), false);
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
