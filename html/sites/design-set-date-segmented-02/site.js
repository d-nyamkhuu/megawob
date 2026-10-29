(function () {
  'use strict';
  const name = 'design-set-date-segmented-02';
  env.site({
    name,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = u.el('div', 'ds-body', document.body),
        top = u.el('header', 'ds-top', body),
        brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-paw', brand, '');
      u.el('div', 'ds-brandtext', brand, 'Paw Haven');
      u.el('small', '', brand, 'Animal Shelter');
      const nav = u.el('nav', 'ds-menu', top);
      ['Animals', 'Adoptions', 'Donors', 'Reports', 'Settings'].forEach((x, i) =>
        u.el('div', 'ds-tab' + (!i ? ' active' : ''), nav, x),
      );
      u.el('div', 'ds-search', top, '⌕  Search animals…');
      const workspace = u.el('div', 'ds-workspace', body),
        side = u.el('aside', 'ds-side', workspace);
      u.el('h2', '', side, 'Animals');
      const list = u.el('div', 'ds-animal-list', side);
      [
        ['Luna', 'Cat · Female'],
        ['Max', 'Dog · Male'],
        ['Bella', 'Cat · Female'],
        ['Charlie', 'Dog · Male'],
        ['Molly', 'Cat · Female'],
        ['Cooper', 'Dog · Male'],
        ['Daisy', 'Cat · Female'],
        ['Rocky', 'Dog · Male'],
        ['Lucy', 'Cat · Female'],
        ['Buddy', 'Dog · Male'],
      ].forEach((a, i) => {
        const row = u.el('div', 'ds-animal' + (!i ? ' selected' : ''), list);
        u.el('span', 'ds-thumb', row, '');
        const t = u.el('span', '', row);
        u.el('b', '', t, a[0]);
        u.el('small', '', t, a[1]);
      });
      u.el('div', 'ds-count', side, '10 animals');
      const content = u.el('main', 'ds-content', workspace),
        summary = u.el('section', 'ds-summary', content);
      u.el('div', 'ds-catphoto', summary, '');
      const inf = u.el('div', 'ds-summary-main', summary);
      u.el('h1', '', inf, 'Luna');
      u.el('div', 'ds-subline', inf, 'Cat  ·  Female  ·  Domestic Shorthair');
      const facts = u.el('div', 'ds-facts', inf);
      [
        ['Age:', '2 years', 'Status:', 'Available'],
        ['Weight:', '7.6 kg', 'Intake Date:', '2022-06-14'],
        ['Color:', 'Gray and White', 'Location:', 'Main Shelter'],
        ['ID:', 'A1023', 'Microchip:', '985112006543210'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-factrow', facts);
        row.forEach((v, i) => u.el('span', 'ds-factpart' + (i % 2 ? ' value' : ''), r, v));
      });
      const lower = u.el('div', 'ds-lower', content),
        work = u.el('section', 'ds-work', lower),
        tabs = u.el('div', 'ds-detailtabs', work);
      ['Details', 'Medical', 'Adoption', 'Notes', 'Photos'].forEach((x, i) =>
        u.el('div', 'ds-detailtab' + (!i ? ' active' : ''), tabs, x),
      );
      if (ctx.display === 'panel') {
        const p = u.el('aside', 'ds-brief', work);
        u.el('div', 'ds-instruction', p, ctx.instruction);
      }
      const stage = u.el('div', 'ds-stage', work);
      if (ctx.display === 'header') {
        const n = u.el('div', 'ds-header-note', content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        content.insertBefore(n, lower);
      }
      if (ctx.display === 'toast') {
        const n = u.el('div', 'ds-toast', content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      const activity = u.el('aside', 'ds-activity', lower);
      u.el('h2', '', activity, 'Recent Activity');
      [
        ['2022-06-14', 'Intake record created'],
        ['2022-06-16', 'Health check completed'],
        ['2022-06-18', 'Vaccination updated'],
        ['2022-06-20', 'Photo added'],
        ['2022-06-22', 'Moved to main shelter'],
      ].forEach((a) => {
        const r = u.el('div', 'ds-activityrow', activity);
        u.el('span', '', r, a[0]);
        u.el('span', '', r, a[1]);
      });
      const foot = u.el('footer', 'ds-footer', work),
        rng = ctx.rng.fork('chrome/end'),
        bank = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ],
        text = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      let place = null,
        label = 'Save';
      if (!ctx.finish) {
        if (rng.bool(0.5)) place = 'footer';
        else {
          const options = bank.map(text).filter((x) => x.toLowerCase() !== 'submit');
          if (options.length) label = rng.pick(options);
          place = rng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const button = (p, c, t, link) => {
        const b = u.el(link ? 'a' : 'button', c, p, t);
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
      if (place === 'header') submit = button(top, 'ds-end-header', label, false);
      if (place === 'footer') submit = button(foot, 'ds-submit', label, false);
      if (place === 'link') submit = button(foot, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const opts = bank.map(text).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (opts.length) {
            const s = cr.pick(opts),
              d = u.el('button', 'ds-xtra', foot, s);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: s, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        e = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      e.dataset.role = 'overlay';
      const words = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', e, words[ctx.kind]);
      const b = u.el('button', '', e, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el: e, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
