(function () {
  'use strict';
  const C = { site: 'design-act-in-time-refresh-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.classList.add('plain-contacts');
      const frame = u.el('div', 'app-frame', document.body);
      const rail = u.el('nav', 'app-rail', frame);
      const links = [
        ['▣', 'Contacts'],
        ['▦', 'Calendar'],
        ['✉', 'Mail'],
        ['▤', 'Tasks'],
        ['▱', 'Notes'],
      ];
      links.forEach((x, i) => {
        const a = u.el('div', 'rail-item' + (i === 0 ? ' selected' : ''), rail);
        u.el('span', 'rail-icon', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const content = u.el('div', 'app-content', frame);
      const head = u.el('header', 'page-head', content);
      const title = u.el('h1', '', head, 'Contacts');
      const date = u.el('span', 'page-date', head, 'Tuesday, April 12, 1994');
      let submit = null,
        placement = 'header',
        label = 'Continue';
      const mk = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['header', 'footer', 'link', 'icon']);
        label = er.pick(['Continue', 'Continue', 'Done', 'Finish', 'Submit']);
        if (placement === 'header') submit = mk(head, 'end-control', label);
        if (placement === 'icon') submit = mk(head, 'end-control icon-control', '✓');
      }
      const dec = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && dec.bool(0.3)) {
        const d = u.el('button', 'xtra-control', head, 'Send');
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: 'Send', collide: true }));
      }
      const summary = u.el('section', 'summary-band', content);
      u.el('div', 'book-art', summary, '▤');
      const summaryText = u.el('div', 'summary-copy', summary);
      u.el('p', 'summary-desc', summaryText, 'Manage your business contacts, customers, and colleagues.');
      const stats = u.el('div', 'summary-stats', summaryText);
      [
        ['Total Contacts:', '328'],
        ['Companies:', '214'],
        ['Individuals:', '114'],
      ].forEach((r) => {
        const row = u.el('div', 'stat-row', stats);
        u.el('b', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const lower = u.el('div', 'lower-layout', content);
      const main = u.el('main', 'ds-stage', lower);
      const inspector = u.el('aside', 'details-inspector', lower);
      u.el('h2', '', inspector, 'Contact Details');
      [
        ['Name:', '—'],
        ['Company:', '—'],
        ['Title:', '—'],
        ['Department:', '—'],
        ['Phone:', '—'],
        ['Fax:', '—'],
        ['Email:', '—'],
        ['Address:', '—'],
        ['', '—'],
        ['', '—'],
        ['', '—'],
        ['Notes:', '—'],
      ].forEach((r, i) => {
        const row = u.el('div', 'detail-line' + (i === 4 || i === 7 || i === 11 ? ' gap-before' : ''), inspector);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const mode = ctx.display || 'header';
      let note = null;
      if (mode === 'header') {
        note = u.el('div', 'task-note header-note', content, ctx.instruction);
        content.insertBefore(note, summary);
      } else if (mode === 'panel') {
        note = u.el('div', 'task-note panel-note', rail);
        u.el('b', '', note, 'Task');
        u.el('span', '', note, ctx.instruction);
      } else if (mode === 'toast') {
        note = u.el('div', 'task-note toast-note', content, ctx.instruction);
        content.insertBefore(note, lower);
      }
      if (!ctx.finish && placement === 'footer') {
        submit = mk(content, 'end-control footer-control', label);
      } else if (!ctx.finish && placement === 'link') {
        const a = u.el('a', 'end-link', content, label);
        a.href = '#';
        a.dataset.role = 'submit';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = a;
      }
      return { stage: main, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This site uses cookies. Please choose whether to accept them.',
        toast: 'Your contacts are up to date.',
        chat: 'Hello. How may we help you?',
        promo: 'Discover the latest features.',
        banner: 'Notice: scheduled maintenance is planned.',
      };
      u.el('div', 'overlay-copy', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
