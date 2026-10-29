(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-07',
    'brand': 'WorkFlow Pro',
    'title': 'Add Contact',
    'instruction': 'top',
    'rail': 'Email|Form|Tasks|Notes|Settings',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const controls = u.el('div', 'ds-controls', top);
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end');
      const original = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : original ? 'footer' : er.pick(['header', 'link', 'icon']);
      const label = original ? 'Submit' : labelOf(er.pick(endLabels));
      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (placement === 'header') submit = makeEnd(controls, 'ds-end-header', label);
      if (placement === 'icon') submit = makeEnd(controls, 'ds-end-icon', '✓');
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const options = [...new Set(endLabels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = cr.pick(options);
      }
      if (collide) {
        const b = u.el('button', 'ds-xtra-end', controls, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      ['min', 'max', 'close'].forEach((k) => u.el('i', k, controls));
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        const icons = [
          '<rect x="3" y="6" width="24" height="19" rx="2"/><path d="m4 8 11 9 11-9"/>',
          '<path d="M6 3h14l6 7v19H6zM20 3v8h6M10 15h12M10 20h12M10 25h8"/>',
          '<path d="M11 6H5v23h22V6h-6M12 3h8v6h-8zM10 18l4 4 9-11"/>',
          '<path d="M6 29V15M15 29V4M24 29V11"/>',
          '<path d="m13 3 5 0 2 4 4 1 4 5-2 4 1 4-4 5-4-1-4 3-5-3-4 1-3-5 1-4-2-4 4-5 4-1z"/><circle cx="15.5" cy="16" r="5"/>',
        ];
        C.rail.split('|').forEach((t, i) => {
          const tab = u.el('div', 'ds-tab', rail);
          const icon = u.el('span', 'ds-tab-icon', tab);
          icon.innerHTML =
            '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">' +
            icons[i] +
            '</svg>';
          u.el('span', 'ds-tab-label', tab, t);
        });
      }
      const content = u.el('div', 'ds-content', body);
      const rings = u.el('div', 'ds-rings', content);
      for (let i = 0; i < 16; i++) u.el('i', '', rings);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
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
      u.el('span', '', foot, 'Ready');
      const clear = u.el('button', 'ds-clear-all', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        if (env.widgetDef.clear) env.widgetDef.clear();
      });
      if (placement === 'footer') submit = makeEnd(foot, 'ds-submit', 'Submit');
      else if (placement === 'link') submit = makeEnd(foot, 'ds-endlink', label + ' ›');
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
