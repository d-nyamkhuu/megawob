(function () {
  'use strict';
  const C = {
    site: 'design-type-text-copy-02',
    brand: 'PeopleLink',
    title: 'Contacts',
    rail: 'Contacts|Calendar|Tasks|Mail|Notes|Settings',
    briefTitle: 'Task',
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
      const logo = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-mark', logo, '●');
      u.el('span', '', logo, C.brand);
      u.el('strong', 'ds-title', top, C.title);
      const search = u.el('div', 'ds-search', top, 'Search contacts');
      u.el('span', 'ds-search-icon', search, '⌕');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => {
        const item = u.el('div', 'ds-navitem' + (i === 0 ? ' selected' : ''), rail);
        u.el('span', 'ds-navicon', item, ['▣', '▦', '☑', '✉', '▤', '⚙'][i]);
        u.el('span', '', item, t);
      });
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel' && window.innerWidth >= 1260
              ? 'left'
              : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left') {
        briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      const inspector = u.el('aside', 'ds-inspector', main);
      u.el('h2', 'ds-inspector-title', inspector, 'Contact Details');
      const summary = u.el('div', 'ds-contact-summary', inspector);
      u.el('div', 'ds-avatar', summary, '●');
      const who = u.el('div', '', summary);
      u.el('strong', '', who, 'Alex Turner');
      u.el('span', '', who, 'Riverton Books');
      const details = u.el('div', 'ds-details', inspector);
      [
        ['Email:', 'alex.turner@rivertonbooks.com'],
        ['Mobile:', '555-493-0178'],
        ['Delivery:', ''],
        ['Office:', '555-281-6600'],
        ['Fax:', '555-281-6601'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'ds-detail-row', details);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      u.el('div', 'ds-address-label', inspector, 'Address:');
      u.el('div', 'ds-address', inspector, '742 Market St.\nPortland, OR 97204\nUSA');
      u.el('div', 'ds-meta', inspector, 'Category:　 Customer');
      u.el('div', 'ds-meta', inspector, 'Last Updated:　 Apr 14, 2002　 10:32 AM');
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'PeopleLink　 ·　 Contact record');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const canonical = er.bool(0.5);
        let label = 'Submit',
          placement = null;
        if (!canonical) {
          placement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          label = String(
            er.pick(
              Array.isArray(labels) && labels.length
                ? labels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
            ),
          );
        }
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = (
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const options = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = cr.pick(options);
        }
        const decoy = (p, text, cls) => {
          const b = u.el('button', cls, p, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
        const end = (p, cls) => {
          const b = u.el('button', cls, p, label);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (canonical) submit = end(foot, 'ds-submit');
        else if (placement === 'header') {
          if (collide) decoy(top, collide, 'ds-xtra ds-pq-header');
          submit = end(top, 'ds-submit ds-submit-header');
        } else {
          if (collide) decoy(foot, collide, 'ds-xtra ds-pq-link');
          submit = end(foot, 'ds-submit ds-submit-link');
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
