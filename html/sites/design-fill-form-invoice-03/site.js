(function () {
  'use strict';
  const C = {
    site: 'design-fill-form-invoice-03',
    brand: 'Atlas Office Companion',
    tag: 'Tools for a More Organized Tomorrow',
    title: 'Document Workbench',
  };
  const GUIDE = [
    'Copy the information from the receipt on the left into the matching fields.',
    'If the receipt does not provide a value (for example, PO number), leave the field blank.',
    'Enter the date in YYYY-MM-DD format.',
    'Check that the total amount and currency match the receipt.',
  ];
  const palette = { bg: '#24248f', panel: '#f5f0e5', fg: '#0a0d26', muted: '#656573', line: '#85889b' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The inspector has space for every note mode, including on short viewports.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const globe = u.el('span', 'ds-globe', top);
      globe.innerHTML =
        '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#438aa8" stroke="#b6c2d7" stroke-width="2"/><path d="M19 7l11 4 2 8-9 4-5-6-6 4-5 13 11 3 8 14 9 2 4-16 12-6-6-11-10-5 3-9z" fill="#71a94a" stroke="#233e65"/><ellipse cx="30" cy="30" rx="13" ry="27" fill="none" stroke="#173c74" stroke-width="2"/><path d="M4 30h52M10 14q20 12 40 0M10 46q20-12 40 0" fill="none" stroke="#173c74" stroke-width="2"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-tag', top, C.tag);
      u.el('span', 'ds-wb', top, C.title);
      u.el('span', 'ds-cd', top);
      const body = u.el('div', 'ds-body', document.body);
      const bench = u.el('section', 'ds-bench', body);
      const tabs = u.el('div', 'ds-tabs', bench);
      ['1. Review Document', '2. Enter Information', '3. Submit'].forEach((t, i) =>
        u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t),
      );
      const side = u.el('aside', 'ds-side', body);
      u.el('h2', 'ds-side-h', side, 'Task Inspector');
      const card = u.el('div', 'ds-card', side);
      Object.assign(_c, { body, bench, tabs, card, header: bench });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-headnote');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.card;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const panel = _c.card.querySelector('.ref-panel');
      if (panel) {
        const h = panel.querySelector('.ref-panel-title');
        h.classList.add('ds-h3');
        h.textContent = '';
        const icon = u.el('i', 'ds-ico ds-clip', h);
        icon.innerHTML =
          '<svg viewBox="0 0 48 60"><rect x="5" y="9" width="38" height="48" rx="4" fill="#d5d9df" stroke="#101a36" stroke-width="3"/><rect x="10" y="14" width="28" height="37" fill="#fff" stroke="#53617a"/><path d="M17 5h5V2h5v3h5v12H17z" fill="#c3cad6" stroke="#101a36" stroke-width="2"/><path d="M20 24h13m-13 7h13m-13 7h13m-13 7h13M14 24h2m-2 7h2m-2 7h2m-2 7h2" stroke="#172544" stroke-width="2"/></svg>';
        u.el('span', '', h, 'Your Task');
        const brief = u.el('div', 'ds-brief', panel);
        const text = panel.querySelector('.ref-panel-text');
        text.classList.add('ds-instruction');
        brief.appendChild(text);
        u.el('hr', 'ds-hr', _c.card);
      }
      const g = u.el('h3', 'ds-h3', _c.card);
      const book = u.el('i', 'ds-ico ds-book', g);
      book.innerHTML =
        '<svg viewBox="0 0 60 48"><path d="M2 7Q16 0 30 7Q44 0 58 7v38Q44 38 30 45Q16 38 2 45z" fill="#7083ad" stroke="#111d3a" stroke-width="3"/><path d="M7 5q12-4 23 4q11-8 23-4v34q-12-4-23 3q-11-7-23-3z" fill="#dce2ed" stroke="#172442" stroke-width="2"/><path d="M30 9v33M12 12q7-2 13 2m-13 3q7-2 13 2m10-5q7-4 13-2m-13 7q7-4 13-2m-13 7q7-4 13-2" fill="none" stroke="#34496b" stroke-width="2"/></svg>';
      u.el('span', '', g, 'Field Guide');
      const ul = u.el('ul', 'ds-guide', _c.card);
      GUIDE.forEach((t) => u.el('li', '', ul, t));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.bench);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (_c.display === 'toast' && note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.card.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.card.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      // Fit the inspector only after all template notes and controls have been placed.
      for (let fit = 1; fit > 0.5 && _c.card.scrollHeight > _c.card.clientHeight + 1;) {
        fit = Math.round((fit - 0.02) * 100) / 100;
        _c.card.style.setProperty('--cfit', String(fit));
      }
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-invoice-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#142974'],
      LOW_ACCENTS: ['#142974'],
      parts,
    },
  });
})();
