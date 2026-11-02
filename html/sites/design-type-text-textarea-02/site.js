(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#11151b', muted: '#555961', line: '#c7c7c7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const mast = u.el('div', 'ds-mast', top);
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
      _c.header = document.body;
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      'Startseite|Politik|Wirtschaft|Feuilleton|Sport|Gesellschaft|Wissen|Reise|Abo|Shop'.split('|')
        .forEach((t, i) => _c.util.el('span', i === 9 ? 'shop' : '', nav, t));
      _c.toolbar = nav;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const hero = u.el('section', 'ds-hero', document.body);
      const photo = u.el('div', 'ds-paper', hero);
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
      const content = u.el('div', 'ds-content', document.body);
      const main = u.el('div', 'ds-main', content);
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
      Object.assign(_c, { contentBox: content, body: main });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-brief');
        note.querySelector('.ref-panel-title').textContent = 'Hinweis';
      }
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'ds-stage', _c.body);
      _c.body.prepend(stage);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.contentBox.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentBox.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-type-text-textarea-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#d20d12'],
      LOW_ACCENTS: ['#d20d12'],
      parts,
    },
  });
})();
