(function () {
  'use strict';
  const palette = { bg: '#f8f5ee', panel: '#f8f5ee', fg: '#292832', muted: '#4a4650', line: '#8d6558' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four note modes have a dedicated place in the reading pane.
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
      u.el('span', 'ds-logo', top).innerHTML =
        '<svg viewBox="0 0 90 58" width="90" height="58"><defs><linearGradient id="paper"><stop stop-color="#bc8d70"/><stop offset=".45" stop-color="#f4e2ca"/><stop offset="1" stop-color="#a96c50"/></linearGradient></defs><path d="M1 13H8V48Q26 44 45 53Q64 44 82 48V13H89V55H1Z" fill="#4e1520"/><path d="M10 8Q28 4 45 16Q62 4 80 8V46Q61 42 45 52Q29 42 10 46Z" fill="#f9ead7" stroke="#783e30"/><path d="M15 3Q31 2 44 13V48Q29 37 15 40ZM46 13Q59 2 75 3V40Q61 37 46 48Z" fill="url(#paper)" stroke="#9b6c55" stroke-width=".7"/><path d="M44 13V48M46 13V48" stroke="#63302a"/><path d="M18 9Q30 8 41 17M49 17Q61 8 72 9" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 12Q30 11 41 20M49 20Q61 11 72 12" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 15Q30 14 41 23M49 23Q61 14 72 15" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 18Q30 17 41 26M49 26Q61 17 72 18" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 21Q30 20 41 29M49 29Q61 20 72 21" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 24Q30 23 41 32M49 32Q61 23 72 24" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 27Q30 26 41 35M49 35Q61 26 72 27" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 30Q30 29 41 38M49 38Q61 29 72 30" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 33Q30 32 41 41M49 41Q61 32 72 33" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M18 36Q30 35 41 44M49 44Q61 35 72 36" fill="none" stroke="#81513e" stroke-width=".65"/><path d="M7 10V49Q28 46 45 54Q62 46 83 49V10" fill="none" stroke="#fff5e6" stroke-width="1.3"/></svg>';
      const tt = u.el('div', 'ds-titles', top);
      u.el('div', 'ds-brand', tt, 'Rivermere Public Library');
      u.el('div', 'ds-nav', tt, 'Catalog  ·  Books  ·  Knowledge  ·  Our Community');
      const tag = u.el('div', 'ds-tag', top);
      u.el('div', '', tag, 'A More Informed Tomorrow');
      u.el('div', 'ds-tagrule', tag);
      // Prepare the existing reading pane so the template can put its note here.
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      content.dataset.instruction = _c.display;
      const main = u.el('div', 'ds-main', content);
      const left = u.el('div', 'ds-left', main);
      const rec = u.el('div', 'ds-record', left);
      u.el('h1', '', rec, 'The Quiet Compass');
      [
        ['Author:', 'Holloway, Miriam'],
        ['Year:', '1996'],
        ['Publisher:', 'Northfield Press'],
        ['Subjects:', 'Travel -- Europe -- Description and travel'],
        ['', 'Self-discovery -- Anecdotes'],
        ['ISBN:', '0-917362-28-4'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-rrow', rec);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const right = u.el('aside', 'ds-right', main);
      u.el('h2', '', right, 'Reading Comprehension Task');
      const header = u.el('div', 'ds-note-place', right);
      u.el('div', 'ds-yours', right, 'Your Answer:');
      u.el('div', 'ds-slot', right);
      u.el('h3', '', right, 'Item Details');
      const dl = u.el('div', 'ds-details', right);
      [
        ['Format:', 'Book'], ['Language:', 'English'], ['Pages:', '320'],
        ['Call Number:', '914.04 HOL'], ['Location:', 'Main Library'], ['Status:', 'Available'],
      ].forEach((r) => {
        const row = u.el('div', '', dl);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      u.el('div', 'ds-ask', right, 'Questions? Ask a librarian.');
      Object.assign(_c, { header, tag, libraryBody: body, left, right });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction', note);
        text.textContent = note.firstChild.textContent;
        note.firstChild.remove();
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tag;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.libraryBody; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'ds-stage', _c.left); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Rivermere Public Library';
      _c.util.el('span', 'ds-motto', foot, 'Knowledge Brings Us Together');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ds-motto'));
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
    name: 'design-find-fact-find-word-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#650f1b'],
      LOW_ACCENTS: ['#650f1b'],
      parts,
    },
  });
})();
