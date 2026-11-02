(function () {
  'use strict';
  const palette = { bg: '#f7f8fa', panel: '#ffffff', fg: '#263241', muted: '#576474', line: '#cbd2da' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The existing left pane has room for each note mode at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('bsadmin', 'tworow', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const center = u.el('div', 'center', app);
      const bp = u.el('section', 'bpanel', center);
      u.el('h2', 'phead', bp, 'Counting Task');
      const wp = u.el('section', 'wpanel', center);
      u.el('h2', 'phead', wp, 'Workspace');
      const footer = u.el('footer', 'bottom', app);
      u.el('h2', 'phead', footer, 'Your Answer');
      const fb = u.el('div', 'fbar', footer);
      Object.assign(_c, { app, center, bp, wp, fb, header: bp });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief', 'brief-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.fb;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.bp;
      base(_c);
      _c.body = body;
      const panel = _c.bp.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief', 'brief-panel');
      const u = _c.util;
      const details = u.el('div', 'details', _c.bp);
      u.el('p', '', details, 'Details:');
      const ul = u.el('ul', '', details);
      for (const text of [
        'Count only the items matching the task.',
        'Ignore items in other categories.',
        'Check each figure carefully.',
        'Each item is a non-overlapping figure.',
      ]) u.el('li', '', ul, text);
      _c.details = details;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.wp);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'brief-toast');
        _c.bp.insertBefore(note, _c.details);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.fb.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.fb.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-count-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a73d0'],
      LOW_ACCENTS: ['#1a73d0'],
      parts,
    },
  });
})();
