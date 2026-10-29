(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-login-03',
    'brand': 'Account Access',
    'title': '',
    'instruction': 'top',
    'rail': '',
    'menu': 'Home|Accounts|Settings|Help|Sign out',
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
      const top = u.el('header', 'ds-top', document.body);
      const ap = u.el('span', 'ds-apple', top);
      ap.innerHTML =
        '<svg width="20" height="22" viewBox="0 0 20 22"><path fill="#111" d="M14 0c0 2-1.500 3.600-3.300 3.700C10.500 1.800 12.200.1 14 0zM17.500 7.500c-2.500 1.500-2.100 5 .6 6.100-.7 1.800-2.200 4.600-4 4.600-1.200 0-1.600-.7-3-.7s-1.900.7-3 .7C5.100 18.200 2 13.500 2 9.800c0-3.200 2.300-4.800 4.200-4.800 1.400 0 2.300.8 3.200.8s1.900-.8 3.300-.8c1 0 2.800.4 4.800 2.500z"/></svg>';
      u.el('span', 'b', top, 'NeXTSTEP');
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((t) => u.el('span', 'm', top, t));
      u.el('span', 'ds-clock', top, 'Mon Apr 26  9:17 AM');
      const left = u.el('div', 'ds-left', document.body);
      const mode = ctx.display;
      if (mode !== 'hidden') {
        const note = u.el(
          'aside',
          'ds-instruction' + (mode === 'toast' ? ' ds-instruction-toast' : ''),
          left,
          ctx.instruction,
        );
        note.dataset.display = mode;
      }
      const win = u.el('div', 'ds-win', document.body);
      const tt = u.el('div', 'ds-title', win);
      u.el('i', '', tt);
      u.el('span', '', tt, 'Account Login');
      const panel = u.el('div', 'ds-panel', win);
      u.el('h1', 'ds-h1', panel, 'Sign In');
      u.el('div', 'ds-rule', panel);
      u.el('div', 'ds-sub', panel, 'Access your account to continue.');
      const stage = u.el('main', 'ds-stage', panel);
      const tools = u.el('div', 'ds-tools', document.body);
      u.el('div', 'ds-tool first', tools);
      const icons = [
        '<path d="M5 2h10l5 5v16H5z M15 2v5h5 M7 9h10M7 11h10M7 13h10M7 15h10M7 17h10M7 19h10M7 21h10" fill="none" stroke="#111" stroke-width="1.600"/>',
        '<path d="M3 5h7l2 2h9v13H3z M3 11l3-3h17l-2 12H3z" fill="#666" stroke="#111" stroke-width="1.600"/>',
        '<circle cx="10" cy="10" r="6" fill="none" stroke="#111" stroke-width="2.200"/><path d="M14.500 14.500L21 21" stroke="#111" stroke-width="3"/>',
        '<rect x="4" y="4" width="16" height="16" fill="#333" stroke="#111"/><path d="M6 6v12M9 6v12M12 6v12M15 6v12M18 6v12" stroke="#bbb" stroke-dasharray="1 2"/>',
      ];
      icons.forEach((s) => {
        const t = u.el('div', 'ds-tool', tools);
        t.innerHTML = '<svg viewBox="0 0 24 24">' + s + '</svg>';
      });
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'form' : er.pick(['title', 'footer']);
      const label = original ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'ds-submit' +
            (placement === 'title' ? ' ds-submit-title' : placement === 'footer' ? ' ds-submit-footer' : ''),
          placement === 'title' ? tt : panel,
          label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.placement = placement;
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const decoy = u.el('button', 'ds-xtra', panel, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
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
