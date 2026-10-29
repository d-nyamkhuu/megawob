(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-08',
    'brand': 'Sun',
    'title': 'Add Contact',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|Options|Help',
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
      u.el('span', 'ds-title', top, 'Message Entry Task');
      const wc = u.el('span', 'ds-wc', top);
      ['−', '□', '×'].forEach((t) => u.el('span', 'ds-window-button', wc, t));
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'right'
              : natural;
      if ((mode === 'right' && window.innerWidth < 1260) || (mode === 'toast' && window.innerHeight < 700))
        mode = 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        if (cls === 'ds-brief') u.el('div', 'ds-helpbtn', b, 'Help');
        return b;
      }
      if (mode === 'top') {
        const hn = briefing(content, 'ds-header-note');
        u.el('div', 'ds-helpbtn', hn, 'Help');
      }
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
      const endR = ctx.rng.fork('chrome/end');
      const labels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const placement = ctx.finish
        ? null
        : endR.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'floating']);
      const labelPool = labels.includes('Submit')
        ? [...labels, ...Array(Math.max(0, labels.length - 1)).fill('Submit')]
        : labels;
      const label = placement ? endR.pick(labelPool) : null;
      const collideR = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const opts = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (opts.length) collision = { label: collideR.pick(opts), where: collideR.pick(['header', 'footer']) };
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      let submit = null;
      const end = (parent, asLink) => {
        const b = u.el(
          asLink ? 'a' : 'button',
          asLink ? 'ds-endlink' : 'ds-submit',
          parent,
          asLink ? label + ' ›' : label,
        );
        if (!asLink) b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collision && collision.where === 'header') {
        const menu = document.querySelector('.ds-menu');
        decoy(menu || foot, collision.label);
      }
      if (placement === 'header') {
        const menu = document.querySelector('.ds-menu');
        submit = end(menu || foot, false);
      }
      if (placement === 'footer') submit = end(foot, false);
      if (placement === 'link') submit = end(foot, true);
      if (placement === 'floating') {
        const dock = u.el('div', 'ds-float-dock', document.body);
        submit = end(dock, false);
      }
      if (collision && collision.where === 'footer') decoy(foot, collision.label);
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
