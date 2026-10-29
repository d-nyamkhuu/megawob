(function () {
  'use strict';
  env.site({
    name: 'design-find-fact-count-12',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const head = u.el('header', 'ds-top', document.body),
        id = u.el('div', 'ds-identity', head);
      u.el('strong', 'ds-brand', id, 'Riverton University');
      u.el('span', 'ds-subbrand', id, 'Computing Services');
      const links = u.el('nav', 'ds-links', head);
      ['Home', 'Help', 'Site Map', 'Contact'].forEach((x, i) => {
        if (i) u.el('i', '', links, '|');
        u.el('a', '', links, x);
      });
      const tabs = u.el('nav', 'ds-tabs', document.body);
      ['Guides', 'Software', 'Hardware', 'Network', 'Accounts', 'Facilities', 'Policies'].forEach((x, i) =>
        u.el('span', i ? '' : 'on', tabs, x),
      );
      const content = u.el('div', 'ds-content', document.body),
        mode = ctx.display;
      function note(p, c) {
        const n = u.el('aside', c, p);
        u.el('b', '', n, 'Task');
        u.el('span', '', n, ctx.instruction);
      }
      if (mode === 'header') note(content, 'ds-header-note');
      const stage = u.el('main', 'ds-stage', content);
      if (mode === 'panel') note(content, 'ds-brief');
      if (mode === 'toast') note(content, 'ds-toast');
      const related = u.el('aside', 'ds-related', content);
      u.el('h2', '', related, 'Related Documents');
      const list = u.el('div', 'ds-list', related);
      [
        ['Title', 'Date'],
        ['Lab Equipment Guide', 'Mar 12, 1995'],
        ['Software Installation', 'Feb 28, 1995'],
        ['Printing in the Labs', 'Feb 20, 1995'],
        ['Network Access for Students', 'Jan 15, 1995'],
        ['Accounts and Passwords', 'Jan 10, 1995'],
        ['Using E-mail', 'Dec 1, 1994'],
        ['File Storage Areas', 'Nov 18, 1994'],
        ['Computer Lab Locations', 'Nov 2, 1994'],
        ['Unix User Guide', 'Oct 14, 1994'],
        ['Windows for Workgroups', 'Sep 30, 1994'],
        ['Backup and Recovery', 'Sep 12, 1994'],
        ['Safety in the Labs', 'Aug 25, 1994'],
        ['Hardware Purchase Policy', 'Aug 10, 1994'],
        ['Frequently Asked Questions', 'Jul 28, 1994'],
        ['Glossary of Terms', 'Jul 10, 1994'],
      ].forEach((row, i) => {
        const r = u.el('div', i ? 'ds-row' : 'ds-row ds-row-head', list);
        row.forEach((v, j) => u.el(j ? 'span' : 'a', '', r, v));
      });
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-status', foot, 'Riverton University Computing Services');
      const er = ctx.rng.fork('chrome/end'),
        labels = (ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm']).map(
          (x) => (typeof x === 'string' ? x : x.label),
        );
      const place = ctx.finish ? null : er.bool(0.52) ? 'footer' : er.pick(['header', 'link']),
        label = ctx.finish
          ? ''
          : place === 'footer'
            ? 'Finish'
            : er.pick(labels.filter((x) => x.toLowerCase() !== 'submit'));
      let submit = null;
      const end = (p, tag, cls, text) => {
        const b = u.el(tag, cls, p, text);
        if (tag === 'a') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      if (place === 'footer') submit = end(foot, 'button', 'ds-submit', label);
      if (place === 'header') submit = end(links, 'button', 'ds-submit', label);
      if (place === 'link') submit = end(foot, 'a', 'ds-endlink', label + ' ›');
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const d = u.el(
          'button',
          'ds-xtra',
          foot,
          cr.pick(labels.filter((x) => x.toLowerCase() !== label.toLowerCase())),
        );
        d.type = 'button';
        d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        e = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      e.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        e,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new services.',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const d = u.el('button', '', e, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      d.onclick = () => ctx.dismiss('close');
      return { el: e, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
