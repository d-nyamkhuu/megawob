(function () {
  'use strict';
  const C = { site: 'design-set-date-duration-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top', content);
      u.el('span', 'ds-brand', top, 'Campus Parking');
      const nav = u.el('nav', 'ds-menu', top);
      for (const [i, label] of ['Home', 'Permits', 'Parking Lots', 'Visits', 'Vehicles', 'Reports', 'Help'].entries()) {
        if (i) u.el('span', 'ds-separator', nav, '|');
        const a = u.el('a', '', nav, label);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: 'nav', label });
        });
      }
      const intro = u.el('div', 'ds-intro', content);
      u.el('h1', '', intro, 'Add Parking Visit');
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
      const context = u.el('section', 'ds-context-form', main);
      const fields = [
        ['Date', 'Apr 12, 1995'],
        ['Lot', 'North Campus'],
        ['Space', 'B-27'],
        ['Vehicle', 'ACM 315 (Faculty)'],
      ];
      for (const [label, value] of fields) {
        const row = u.el('div', 'ds-static-row', context);
        u.el('span', '', row, label + ':');
        u.el('div', '', row, value);
      }
      const stage = u.el('main', 'ds-stage', main);
      const notes = u.el('div', 'ds-static-row ds-notes-row', main);
      u.el('span', '', notes, 'Notes:');
      u.el('div', 'ds-notes-box', notes);
      const foot = u.el('footer', 'ds-footer', content);
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Submit';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
        } else {
          const alternatives = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          if (alternatives.length) label = endRng.pick(alternatives);
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const endButton = (parent, cls, text, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', cls, parent, text);
        if (asLink) {
          b.href = '#';
        } else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'header') submit = endButton(top, 'ds-end-header', label, false);
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', label, false);
      if (placement === 'link') submit = endButton(foot, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (words.length) {
            const text = cr.pick(words);
            const d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      const rail = u.el('aside', 'ds-rail', body);
      u.el('h2', '', rail, 'Recent Parking Visits');
      const table = u.el('table', 'ds-records', rail);
      const thead = u.el('thead', '', table);
      const hr = u.el('tr', '', thead);
      for (const x of ['Date', 'Time In', 'Lot', 'Space', 'Vehicle']) u.el('th', '', hr, x);
      const tbody = u.el('tbody', '', table);
      const rows = [
        ['Apr 12, 1995', '08:14', 'North', 'B-12', 'ACM 102'],
        ['Apr 12, 1995', '09:03', 'West', 'C-08', 'STU 417'],
        ['Apr 12, 1995', '09:26', 'North', 'A-19', 'FAC 220'],
        ['Apr 11, 1995', '14:37', 'East', 'E-06', 'ACM 315'],
        ['Apr 11, 1995', '10:12', 'North', 'B-27', 'VIS 908'],
        ['Apr 10, 1995', '16:05', 'West', 'D-14', 'STU 417'],
        ['Apr 10, 1995', '11:48', 'North', 'A-03', 'ACM 102'],
        ['Apr 9, 1995', '13:22', 'East', 'E-11', 'FAC 220'],
        ['Apr 9, 1995', '09:15', 'North', 'B-27', 'ACM 315'],
        ['Apr 8, 1995', '15:46', 'West', 'C-02', 'VIS 908'],
        ['Apr 8, 1995', '08:33', 'North', 'A-19', 'STU 417'],
        ['Apr 7, 1995', '12:01', 'East', 'D-08', 'ACM 102'],
        ['Apr 7, 1995', '09:27', 'North', 'B-12', 'FAC 220'],
        ['Apr 6, 1995', '14:18', 'West', 'C-08', 'ACM 315'],
        ['Apr 6, 1995', '10:41', 'North', 'A-03', 'VIS 908'],
      ];
      for (const row of rows) {
        const tr = u.el('tr', '', tbody);
        for (const x of row) u.el('td', '', tr, x);
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
