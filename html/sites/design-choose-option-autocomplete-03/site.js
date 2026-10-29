(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-autocomplete-03',
    'brand': 'Trip Details',
    'title': 'Destination',
    'instruction': 'top',
    'rail': '',
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
      u.el('span', 'ds-logo', top);
      u.el('span', 'ds-brand', top, 'Amiga Workbench');
      u.el('span', 'ds-clock', top, 'Mon  Apr 22  1991   10:24');
      const gad = u.el('span', 'ds-gads', top);
      u.el('i', '', gad);
      u.el('i', '', gad);
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      const tabs = u.el('aside', 'ds-tabs', body);
      ['Trip Details', 'Traveller Info', 'Preferences', 'Review', 'Confirm'].forEach((t, i) =>
        u.el('div', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t),
      );
      const rings = u.el('div', 'ds-rings', body);
      for (let i = 0; i < 13; i++) u.el('i', '', rings);
      const content = u.el('div', 'ds-content', body);
      const title = u.el('div', 'ds-ptitle', content, 'Plan a Trip');
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
      const form = u.el('div', 'ds-form', main);
      const stage = u.el('main', 'ds-stage', form);
      [
        ['From:', 'London', 'ds-r1 ds-l'],
        ['Depart Date:', 'May 14, 1991', 'ds-r1 ds-r'],
        ['Return Date:', 'May 28, 1991', 'ds-r2 ds-r'],
        ['Passengers:', '1', 'ds-r4 ds-l ds-sm'],
        ['Class:', 'Economy', 'ds-r4 ds-r'],
      ].forEach((a) => {
        const row = u.el('div', 'ds-row ' + a[2], form);
        u.el('span', 'ds-lab', row, a[0]);
        const f = u.el('span', 'ds-fake', row);
        u.el('span', '', f, a[1]);
        u.el('b', 'ds-btn', f, a[0] === 'Passengers:' ? '▲▼' : a[0].indexOf('Date') > 0 ? '▦' : '▼');
      });
      const marker = u.el('div', 'ds-swiss-label', stage);
      u.el('strong', '', marker, '01');
      u.el('h1', '', marker, 'Trip Details');
      u.el('div', 'ds-redrule', marker);
      u.el('p', '', marker, 'Fill in your travel information to continue.');
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const classic = er.bool(0.5);
        const labels = ctx.content.END_LABELS;
        let label = 'Submit';
        if (!classic) {
          const picked = er.pick(labels);
          label = typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || String(picked);
        }
        const placement = classic ? 'footer' : er.pick(['title', 'footer-link']);
        let titleTools = null;
        const makeEnd = (parent, cls, tag) => {
          const b = u.el(tag, cls, parent, label);
          if (tag === 'button') b.type = 'button';
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
        if (placement === 'title') {
          titleTools = u.el('div', 'ds-title-tools', title);
          submit = makeEnd(titleTools, 'ds-submit ds-title-submit', 'button');
        } else if (placement === 'footer-link') {
          submit = makeEnd(foot, 'ds-endlink', 'a');
        } else submit = makeEnd(foot, 'ds-submit', 'button');
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (words.length) {
            const decoyLabel = cr.pick(words);
            const parent = placement === 'title' ? titleTools : foot;
            const d = u.el('button', 'ds-end-xtra', parent, decoyLabel);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
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
