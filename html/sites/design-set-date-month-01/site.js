(function () {
  'use strict';
  const C = { site: 'design-set-date-month-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = u.el('div', 'ds-body', document.body),
        content = u.el('div', 'ds-content', body),
        top = u.el('header', 'ds-top', document.body),
        mark = u.el('span', 'ds-mark', top, '▤'),
        brand = u.el('span', 'ds-brand', top, 'Riverton Public Library'),
        motto = u.el('span', 'ds-motto', top, 'Knowledge　·　Community　·　Always Open');
      u.el('span', 'ds-building', top, '♜');
      const nav = u.el('nav', 'ds-menu', document.body);
      ['Catalog', 'Circulation', 'Acquisitions', 'Serials', 'Administration', 'Reports', 'Help'].forEach((x, i) => {
        const a = u.el('span', 'ds-navitem' + (i === 2 ? ' active' : ''), nav, x);
      });
      const heading = u.el('div', 'ds-pagehead', content);
      u.el('h1', '', heading, 'New Acquisition');
      const main = u.el('div', 'ds-main', content),
        stage = u.el('main', 'ds-stage', main),
        foot = u.el('footer', 'ds-footer', content),
        rail = u.el('aside', 'ds-rail', body);
      const note = (parent, cls) => {
        const n = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        return n;
      };
      if (ctx.display === 'header') note(heading, 'ds-header-note');
      else if (ctx.display === 'panel') note(rail, 'ds-brief');
      else if (ctx.display === 'toast') note(content, 'ds-toast');
      const endRng = ctx.rng.fork('chrome/end'),
        bank =
          ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let label = 'Finish',
        placement = 'footer';
      if (!ctx.finish) {
        const alternatives = bank.map(labelOf).filter((x) => x.toLowerCase() !== 'finish');
        if (endRng.bool(0.5)) label = 'Finish';
        else if (alternatives.length) label = endRng.pick(alternatives);
        placement = endRng.pick(['footer', 'footer', 'header', 'link']);
      }
      const makeEnd = (parent, cls, txt, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, txt);
        if (link) b.href = '#';
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
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') submit = makeEnd(top, 'ds-end-header', label, false);
        else if (placement === 'link') submit = makeEnd(foot, 'ds-end-link', label + ' ›', true);
        else submit = makeEnd(foot, 'ds-submit', label, false);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (words.length) {
            const t = cr.pick(words),
              d = u.el('button', 'ds-xtra', foot, t);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.onclick = () => env.log('decoy', { label: t, collide: true });
          }
        }
      }
      u.el('span', 'ds-books', rail, '▤');
      u.el('h2', '', rail, 'Recent Titles');
      const table = u.el('div', 'ds-records', rail);
      [
        ['Title', 'Year', 'Type'],
        ['Handbook of Western Architecture', '2028', 'Book'],
        ['The River and the City', '2027', 'Book'],
        ['Maps of the Pacific', '2026', 'Book'],
        ['A History of Medieval Europe', '2026', 'Book'],
        ['Gardens and the Natural World', '2025', 'Book'],
        ['The Science of Rain', '2025', 'Book'],
        ['Literary Movements in America', '2024', 'Book'],
        ['Desert Plants', '2024', 'Book'],
        ['Atlantic Voyages', '2023', 'Book'],
        ['The Art of Printmaking', '2023', 'Book'],
      ].forEach((row, i) => {
        const r = u.el('div', 'ds-record' + (i === 1 ? ' selected' : ''), table);
        row.forEach((v) => u.el('span', '', r, v));
      });
      const details = u.el('section', 'ds-details', rail);
      u.el('h2', '', details, 'Bibliographic Details');
      [
        ['Title:', 'Handbook of Western Architecture'],
        ['Author:', 'Fletcher, Banister'],
        ['Publisher:', 'Oxford University Press'],
        ['Year:', '2028'],
        ['ISBN:', '978-0-19-288776-5'],
        ['Subjects:', 'Architecture, Western Architecture -- History Buildings -- Design and construction'],
      ].forEach((a) => {
        const p = u.el('p', '', details);
        u.el('b', '', p, a[0]);
        u.el('span', '', p, a[1]);
      });
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This site uses cookies to improve your library experience.',
        toast: 'Your catalog session is active.',
        chat: 'How may we help you find a title?',
        promo: 'Discover the latest additions to our collection.',
        banner: 'Library catalog notice: scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind] || 'Library notice');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
