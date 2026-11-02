(function () {
  'use strict';
  const palette = { bg: '#eef1f5', panel: '#fafcfe', fg: '#1a2433', muted: '#4d5a6b', line: '#d5dce6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'LexiLearn');
      ['Home', 'Practice', 'Reports', 'Admin'].forEach((t) =>
        u.el('span', 'ds-nav' + (t === 'Practice' ? ' on' : ''), top, t));
      u.el('span', 'ds-user', top, 'Welcome, Alex ▾   |   Sign out');
      const body = u.el('div', 'ds-body', document.body);
      body.dataset.display = _c.display;
      const rail = u.el('aside', 'ds-rail', body);
      ['Vocabulary', 'Reading', 'Listening', 'Progress', 'Settings'].forEach((t, i) =>
        u.el('div', i ? '' : 'on', rail, t));
      const content = u.el('div', 'ds-content', body);
      const titleRow = u.el('div', 'ds-title-row', content);
      u.el('h1', 'ds-h1', titleRow, 'Word Practice');
      const help = u.el('div', 'ds-help', document.body);
      const ht = u.el('div', 'ds-help-t', help);
      u.el('span', '', ht, 'Study Help');
      const hc = u.el('div', 'ds-help-controls', ht);
      const minimize = u.el('button', '', hc, '−');
      minimize.type = 'button';
      minimize.title = 'Minimize Study Help';
      minimize.addEventListener('click', () => help.classList.toggle('minimized'));
      const close = u.el('button', '', hc, '×');
      close.type = 'button';
      close.title = 'Close Study Help';
      close.addEventListener('click', () => { help.hidden = true; });
      const hb = u.el('div', 'ds-help-b', help);
      const hs = u.el('div', 'ds-help-s', hb);
      ['Synonyms', 'Examples', 'Tips'].forEach((t, i) => u.el('div', i ? '' : 'on', hs, t));
      const hm = u.el('div', 'ds-help-m', hb);
      u.el('h4', '', hm, 'What are synonyms?');
      u.el('p', '', hm, 'Synonyms are words that have the same or very similar meaning.');
      const ex = u.el('div', 'ds-help-ex', hm);
      u.el('b', '', ex, 'Example');
      u.el('div', '', ex, 'happy  →  glad');
      u.el('p', '', hm, 'Read each option carefully and select the words that match the meaning.');
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { body, content, titleRow, main, header: main });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.main.querySelector('.ref-instruction');
      if (note) {
        const brief = _c.util.el('aside', 'ds-brief ds-header-note');
        note.before(brief);
        brief.appendChild(note);
        note.classList.add('ds-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.titleRow;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const clear = _c.util.el('button', 'ds-clear', foot, 'Clear All');
      clear.type = 'button';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ds-clear'));
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
    name: 'design-find-fact-similar-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f67a8'],
      LOW_ACCENTS: ['#2f67a8'],
      parts,
    },
  });
})();
