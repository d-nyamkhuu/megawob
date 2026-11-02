(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function ink(u, parent, teal) {
    const layer = u.el('span', 'rv-ink', parent);
    layer.setAttribute('aria-hidden', 'true');
    const id = 'ink-' + parent.className.replace(/\s+/g, '-');
    const x = teal ? 1500 : 1000, y = teal ? 18 : 40,
      w = teal ? 90 : 300, h = teal ? 45 : 80;
    layer.innerHTML = '<svg width="100%" height="100%" xmlns="' + NS +
      '"><defs><pattern id="' + id + '" width="' + w + '" height="' + h +
      '" patternUnits="userSpaceOnUse"><image href="sites/design-type-text-login-06/assets/reference-art.webp" x="-' +
      x + '" y="-' + y + '" width="1672" height="941"/></pattern></defs><rect width="100%" height="100%" fill="url(#' + id + ')"/></svg>';
  }
  function styleControls(u, parent) {
    parent.querySelectorAll('.ref-submit').forEach((b) => {
      const text = b.textContent;
      b.textContent = '';
      ink(u, b, false);
      u.el('span', 'rv-submit-label', b, text);
    });
  }
  const palette = { bg: '#fbf8ed', panel: '#fcf8ec', fg: '#1f5a63', muted: '#6b6f6c', line: '#862b3d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Toasts use the same reserved instruction card even at short viewports.
      if (_c.ctx.display === 'toast') _c.display = 'toast';
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
      const win = u.el('div', 'rv-win', document.body);
      const top = u.el('header', 'ds-top', win);
      ink(u, top, false);
      u.el('span', 'ds-brand', top, 'Rivet');
      const nav = u.el('nav', 'ds-menu', top);
      'Home|Projects|Archive|Settings'.split('|').forEach((t) => u.el('span', '', nav, t));
      const pal = u.el('aside', 'rv-pal', document.body);
      const ph = u.el('div', 'rv-pal-h', pal);
      ink(u, ph, true);
      u.el('span', '', ph, 'Notes');
      u.el('span', 'rv-min', ph, '');
      const pb = u.el('div', 'rv-pal-b', pal);
      u.el('div', 'rv-pal-t', pb, 'Tasks for today:');
      ['Sign in to Rivet', 'Explore the workspace', 'Save a project'].forEach((t) => {
        const r = u.el('div', 'rv-pal-r', pb);
        u.el('i', '', r);
        u.el('span', '', r, t);
      });
      const content = u.el('div', 'ds-content', win);
      Object.assign(_c, { win, top, pb, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = note.textContent;
        note.textContent = '';
        _c.util.el('span', 'rv-ex', note, '!');
        _c.util.el('div', 'ds-instruction', note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      styleControls(_c.util, _c.headerTools);
      _c.top.classList.toggle('rv-with-tools', !!_c.headerTools.children.length);
    },
    'frame.body': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.content);
      const art = _c.util.el('div', 'rv-art', main);
      art.innerHTML = '<svg viewBox="670 346 644 563" preserveAspectRatio="none" aria-hidden="true" xmlns="' + NS +
        '"><defs><clipPath id="rv-scene"><path d="M740 346H1314V909H670L740 780Z"/></clipPath></defs><image clip-path="url(#rv-scene)" href="sites/design-type-text-login-06/assets/reference-art.webp" width="1672" height="941"/></svg>';
      const col = _c.util.el('div', 'rv-col', main);
      Object.assign(_c, { main, col, body: main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.pb;
      base(_c);
      _c.body = body;
      const panel = _c.pb.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('rv-panel-task');
        panel.querySelector('.ref-panel-title').textContent = 'Current task';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.col);
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
      _c.col.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      styleControls(_c.util, foot);
      const orr = _c.util.el('div', 'rv-or', foot);
      _c.util.el('span', '', orr, 'or');
      _c.util.el('a', 'rv-help', foot, 'Need help signing in?');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.insertBefore(dock, _c.foot.firstChild);
        styleControls(_c.util, dock);
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
    name: 'design-type-text-login-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#862b3d'], LOW_ACCENTS: ['#862b3d'], parts,
    },
  });
})();
