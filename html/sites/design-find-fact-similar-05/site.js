(function () {
  'use strict';
  const book = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M16 6C10 2 4 3 3 5v23c5-2 9-2 13 0 4-2 8-2 13 0V5c-3-2-9-2-13 1Zm0 0v22M7 9h5M7 13h5M20 9h5M20 13h5"/></svg>';
  const palette = { bg: '#f2f0ff', panel: '#f9fafc', fg: '#100e30', muted: '#66707d', line: '#dbd9ef' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      const appIcon = u.el('span', 'ds-app-icon', top);
      appIcon.innerHTML = book;
      u.el('span', 'ds-brand', top, 'Word Finder');
      u.el('span', 'ds-window-controls', top, '−    □    ×');
      document.body.classList.toggle('ds-finish', !!_c.ctx.finish);
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      const main = u.el('div', 'ds-main', content);
      main.classList.toggle('ds-panel-mode', _c.display === 'panel');
      let brief = null;
      if (_c.display === 'header' || _c.display === 'panel') {
        brief = u.el('aside', 'ds-brief', main);
        const heading = u.el('h2', '', brief, 'Task');
        u.el('span', 'ds-book', heading).innerHTML = book;
      }
      const workspace = u.el('section', 'ds-workspace', main);
      Object.assign(_c, { top, content, main, brief, workspace, header: brief || top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-header-tools');
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief || body;
      base(_c);
      _c.body = body;
      const note = _c.brief && _c.brief.querySelector('.ref-panel-text');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.workspace);
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
      _c.workspace.appendChild(foot);
      const clear = _c.util.el('button', 'ds-clear', null, 'Clear All');
      clear.type = 'button';
      clear.addEventListener('click', () => { if (env.widgetDef.clear) env.widgetDef.clear(); });
      foot.insertBefore(clear, foot.firstChild);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-find-fact-similar-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-similar-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6052df'],
      LOW_ACCENTS: ['#6052df'],
      parts,
    },
  });
})();
