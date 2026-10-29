(function () {
  'use strict';
  const C = {
    site: 'design-type-text-textarea-02',
    nav: 'Startseite|Politik|Wirtschaft|Feuilleton|Sport|Gesellschaft|Wissen|Reise|Abo|Shop',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        top = u.el('header', 'ds-top', document.body),
        mast = u.el('div', 'ds-mast', top);
      const logo = u.el('div', 'ds-brand', mast);
      u.el('strong', '', logo, 'Frankfurter Allgemeine');
      u.el('small', '', logo, 'ZEITUNG FÜR DEUTSCHLAND');
      const tools = u.el('div', 'ds-tools', mast);
      u.el('span', '', tools, 'Mein Konto');
      u.el('i', '', tools, '|');
      u.el('span', '', tools, 'Hilfe');
      u.el('i', '', tools, '|');
      u.el('span', '', tools, 'Kontakt');
      const search = u.el('div', 'ds-search', mast);
      u.el('span', '', search, 'Suche');
      u.el('b', '', search, '⌕');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.nav.split('|').forEach((t, i) => u.el('span', i === 9 ? 'shop' : '', nav, t));
      const natural = 'header',
        mode =
          ctx.display === 'hidden'
            ? 'hidden'
            : ctx.display === 'toast'
              ? 'toast'
              : ctx.display === 'panel'
                ? 'panel'
                : natural;
      let note = null;
      if (mode !== 'hidden') {
        const cls = mode === 'panel' ? 'ds-brief' : mode === 'toast' ? 'ds-toast' : 'ds-header-note';
        note = u.el('aside', cls, document.body);
        if (mode === 'panel') u.el('h2', '', note, 'Hinweis');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const hero = u.el('section', 'ds-hero', document.body),
        photo = u.el('div', 'ds-paper', hero);
      u.el('div', 'paper-brand', photo, 'Frankfurter Allgemeine');
      u.el('div', 'paper-sub', photo, 'ZEITUNG FÜR DEUTSCHLAND');
      u.el('div', 'paper-lines', photo, 'DIE WELT VON HEUTE  ·  POLITIK  ·  WIRTSCHAFT');
      const pitch = u.el('div', 'ds-pitch', hero);
      u.el('h1', '', pitch, 'F.A.Z. im Abo');
      u.el('p', '', pitch, 'Täglich bestens informiert.');
      const promises = u.el('ul', '', pitch);
      ['Gedruckt oder digital', 'Bequeme Lieferung', 'Jederzeit kündbar'].forEach((t) => u.el('li', '', promises, t));
      const stats = u.el('aside', 'ds-stats', hero);
      [
        ['♧', '1', 'Abo', 'im Warenkorb'],
        ['♙', '1', 'Schritt', 'von 3'],
        ['♧', '0,00 €', 'Versandkosten', ''],
      ].forEach((row) => {
        const item = u.el('div', 'ds-stat', stats);
        u.el('span', 'stat-icon', item, row[0]);
        u.el('b', '', item, row[1]);
        const text = u.el('span', 'stat-copy', item);
        u.el('strong', '', text, row[2]);
        if (row[3]) u.el('small', '', text, row[3]);
      });
      const content = u.el('div', 'ds-content', document.body),
        main = u.el('div', 'ds-main', content),
        stage = u.el('main', 'ds-stage', main);
      const order = u.el('aside', 'ds-order', main);
      u.el('h2', '', order, 'Ihre Bestellung');
      const product = u.el('div', 'ds-product', order);
      u.el('div', 'ds-thumb', product, 'F.A.Z.');
      const info = u.el('div', '', product);
      u.el('strong', '', info, 'Frankfurter Allgemeine Tageszeitung');
      u.el('span', '', info, 'Print-Abo · Monatlich kündbar');
      const rows = u.el('div', 'ds-prices', order);
      [
        ['Zwischensumme', '29,90 €'],
        ['Versand', '0,00 €'],
        ['Gesamtbetrag', '29,90 €'],
      ].forEach((r, i) => {
        const line = u.el('div', i === 2 ? 'total' : '', rows);
        u.el('span', '', line, r[0]);
        u.el('b', '', line, r[1]);
      });
      if (mode === 'panel') {
        main.appendChild(note);
      }
      if (mode === 'toast') {
        content.appendChild(note);
      }
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const canonical = er.bool(0.5);
        let placement = 'footer',
          label = 'Submit';
        if (!canonical) {
          placement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool =
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          label = String(er.pick(pool));
        }
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS,
            pool = (
              Array.isArray(labels) && labels.length
                ? labels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const choices = [...new Set(pool)].filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (choices.length) collide = cr.pick(choices);
        }
        const decoy = (p, t) => {
          const b = u.el('button', 'ds-xtra', p, t);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: t, collide: true }));
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
        if (placement === 'header') {
          if (collide) decoy(nav, collide);
          submit = end(nav, 'ds-submit ds-submit-header');
        } else if (placement === 'link') {
          if (collide) decoy(foot, collide);
          submit = end(foot, 'ds-submit ds-submit-link');
        } else {
          if (collide) decoy(foot, collide);
          submit = end(foot, 'ds-submit');
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'Wir verwenden Cookies, um Ihren Besuch zu verbessern.',
        toast: 'Einstellungen gespeichert.',
        chat: 'Willkommen. Wie können wir Ihnen helfen?',
        promo: 'Lesen Sie die F.A.Z. jetzt im Probeabo.',
        banner: 'Hinweis: Unser Kundenservice ist heute eingeschränkt erreichbar.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Einverstanden' : 'Schließen');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
