(function () {
  'use strict';
  const C = { site: 'design-set-date-segmented-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const win = u.el('div', 'ds-window', body);
      const title = u.el('header', 'ds-top', win);
      u.el('span', 'ds-appicon', title, '▦');
      u.el('span', 'ds-brand', title, 'Personal Organizer');
      const controls = u.el('div', 'ds-window-controls', title);
      ['—', '□', '×'].forEach((x) => u.el('span', '', controls, x));
      const menu = u.el('nav', 'ds-menu', win);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const content = u.el('div', 'ds-content', win);
      const main = u.el('div', 'ds-main', content);
      function note(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') note(main, 'ds-brief');
        else {
          const n = note(content, ctx.display === 'toast' ? 'ds-toast' : 'ds-header-note');
          content.insertBefore(n, main);
        }
      }
      const stage = u.el('main', 'ds-stage', main);
      const rail = u.el('aside', 'ds-rail', main);
      u.el('h2', '', rail, 'Appointment Properties');
      [
        ['Category:', 'Business'],
        ['Status:', 'Busy'],
        ['Reminder:', 'None'],
      ].forEach(([a, b]) => {
        u.el('label', 'ds-proplabel', rail, a);
        u.el('div', 'ds-select', rail, b + '　▾');
      });
      u.el('div', 'ds-separator', rail);
      u.el(
        'div',
        'ds-proptext',
        rail,
        'Created:\nTue 1 Oct 1996\n10:24 AM\n\nLast modified:\nTue 1 Oct 1996\n10:24 AM',
      );
      const foot = u.el('footer', 'ds-footer', win);
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Submit';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) placement = 'footer';
        else {
          const alt = bank.map(labelOf).filter((x) => x.toLowerCase() !== 'submit');
          if (alt.length) label = endRng.pick(alt);
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const endButton = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'header') submit = endButton(title, 'ds-end-header', label, false);
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', label, false);
      if (placement === 'link') submit = endButton(foot, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (words.length) {
            const text = cr.pick(words),
              d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      const dock = u.el('nav', 'ds-dock', win);
      [
        ['▦', 'Calendar'],
        ['♟', 'Contacts'],
        ['☑', 'Tasks'],
        ['▰', 'Notes'],
        ['■', 'Journal'],
      ].forEach(([i, t], n) => {
        const b = u.el('button', n === 0 ? 'active' : '', dock);
        u.el('span', 'ds-dockicon', b, i);
        u.el('span', '', b, t);
      });
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
