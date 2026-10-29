(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-chase-02',
    brand: 'Pointer Practice',
    title: 'Pointer Practice',
    instruction: 'top',
    rail: '',
    menu: 'File|Edit|Task|Help',
    briefTitle: 'Pointer Practice',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const meta = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const content = u.el('div', 'ds-content', document.body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? window.innerWidth >= 1260 && window.innerHeight >= 700
                ? 'panel'
                : 'top'
              : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        const text = String(ctx.instruction || '');
        const parts = text.split(/(?<=\.)\s+/, 2);
        const instruction = u.el('div', 'ds-instruction', b);
        u.el('span', 'ds-instruction-primary', instruction, parts[0] || text);
        if (parts[1]) u.el('span', 'ds-instruction-secondary', instruction, parts[1]);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') {
        const panel = briefing(main, 'ds-panel-note');
        const title = u.el('h2', 'ds-panel-title', panel, 'Task Note');
        panel.insertBefore(title, panel.firstChild);
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const er = ctx.rng.fork('chrome/end');
      const base = !ctx.finish && er.bool(0.5);
      const label = base
        ? 'Submit'
        : String(
            er.pick(
              (
                (ctx.content && ctx.content.END_LABELS) || [
                  'Submit',
                  'Done',
                  'Finish',
                  'Continue',
                  'Save',
                  'OK',
                  'Confirm',
                  'Apply',
                ]
              ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name)),
            ),
          );
      const placement = ctx.finish ? null : base ? 'footer' : er.pick(['menu', 'link']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = (
          (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ]
        )
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      if (collide) {
        const d = u.el('button', 'ds-pq', top, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        top.insertBefore(d, meta);
      }
      let submit = null;
      if (placement === 'menu') {
        submit = u.el('button', 'ds-end-menu', nav, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      } else if (placement === 'footer') {
        submit = u.el('button', 'ds-submit', foot, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      } else if (placement === 'link') {
        submit = u.el('a', 'ds-footer-link', foot, label + ' ›');
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
