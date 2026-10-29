(function () {
  'use strict';
  const C = {
    site: 'design-fill-form-invoice-11',
    instruction: 'top',
    rail: '',
    menu: 'Invoices|Help',
    briefTitle: 'Your Task',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map(labelOf);
      const placement = endRng.pick(['footer', 'footer', 'header', 'link']);
      const label = placement === 'footer' ? 'Submit' : endRng.pick(labels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collide = collideRng.bool(0.3)
        ? collideRng.pick(labels.filter((x) => x.trim().toLowerCase() !== label.toLowerCase()))
        : null;
      const decoyBtn = (parent, text, collides = false) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const top = u.el('header', 'ds-top', document.body);
      const br = u.el('span', 'ds-brand', top);
      u.el('b', '', br, 'DOC');
      u.el('b', 'ds-fill', br, 'FILL');
      u.el('i', 'ds-tag', top, 'Process invoices faster');
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => {
        const item = u.el('span', '', nav, t);
        item.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      u.el('span', 'ds-avatar', nav, 'JD');
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      u.el('div', 'ds-band', content);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel' && document.body.clientWidth >= 1280
              ? 'right'
              : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      cancel.innerHTML = '<span>Cancel</span>';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      if (collide) decoyBtn(foot, collide, true);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'header' ? ' ds-end-header' : placement === 'link' ? ' ds-end-link' : ''),
          placement === 'header' ? nav : foot,
        );
        submit.type = 'button';
        u.el('span', '', submit, label);
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const el = u.el('section', 'ds-initial ds-initial-tip', document.body);
        el.dataset.role = 'overlay';
        const ic = u.el('div', 'ds-bulb', el);
        ic.innerHTML =
          '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#111" stroke-width="1.8"><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/><path d="M9 18h6M9.6 20h4.8M11 21.7h2" stroke-width="1.2" stroke-linecap="round"/></svg>';
        u.el('h2', '', el, 'Tip of the day');
        u.el('p', '', el, 'Double-check amounts and dates before submitting.');
        const x = u.el('span', 'ds-x', el, '×');
        x.addEventListener('click', () => ctx.dismiss('close'));
        const l = u.el('label', '', el);
        const cb = u.el('input', '', l);
        cb.type = 'checkbox';
        l.append(' Do not show again');
        const dismiss = u.el('button', '', el, 'Close');
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss };
      }
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
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
