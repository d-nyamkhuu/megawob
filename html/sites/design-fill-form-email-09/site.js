(function () {
  'use strict';
  function icon(t) {
    const paper =
      '<path d="M5 2H16L21 7V23H5Z" fill="#f5f6fa" stroke="#536580"/><path d="M16 2V7H21M8 10H17M8 13H17M8 16H14" fill="none" stroke="#91a4bc"/>';
    const envelope =
      '<path d="M2 8L12 3L21 9V21H2Z" fill="#f2ecbe" stroke="#647089"/><path d="M2 9L11 15L21 9M2 21L9 14M21 21L14 14" fill="none" stroke="#7a8298"/>';
    let body = paper;
    if (t === 'Delete') body = '<path d="M3 3L21 22M21 3L3 22" stroke="#1e2e41" stroke-width="3"/>';
    else if (t === 'Print')
      body =
        '<path d="M6 2H18V10H6Z" fill="white" stroke="#546176"/><path d="M3 9H21V20H3Z" fill="#b6c0d2" stroke="#546176"/><path d="M7 16H18V24H7Z" fill="white" stroke="#546176"/><path d="M9 19H16M9 21H16" stroke="#758399"/><circle cx="18" cy="12" r="1" fill="#4365ad"/>';
    else if (t.includes('Reply') || t === 'Forward')
      body =
        envelope +
        '<path d="' +
        (t === 'Forward' ? 'M10 15H19V11L25 17L19 23V19H10Z' : 'M16 15H7V11L1 17L7 23V19H16Z') +
        '" fill="' +
        (t === 'Forward' ? '#54a7d6' : '#7587bb') +
        '" stroke="#3b5378"/>' +
        (t === 'Reply All' ? '<path d="M13 5L8 1L3 5" fill="none" stroke="#d779a0" stroke-width="2"/>' : '');
    else if (t === 'Move...')
      body = paper + '<path d="M12 12H20V8L25 15L20 21V17H12Z" fill="#718bb6" stroke="#465d7b"/>';
    return '<svg viewBox="0 0 26 26" aria-hidden="true">' + body + '</svg>';
  }
  const C = {
  }
  const palette = { bg: '#d9dce2', panel: '#e4e6ea', fg: '#14171c', muted: '#66707d', line: '#9a9fa8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The workstation has room for its docked note at every viewport.
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
      const brand = u.el('span', 'ds-brand', top);
      const app = u.el('span', 'qt-appicon', brand);
      app.innerHTML = icon('Reply');
      u.el('span', '', brand, 'Mail and Tasks');
      const win = u.el('div', 'qt-windowbuttons', top);
      ['−', '□', '×'].forEach((t) => u.el('span', '', win, t));
      // Header instructions occupy the original blue dock, between mail and form.
      const header = u.el('aside', 'ds-brief');
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Tools|Actions|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      ['New', 'Reply', 'Reply All', 'Forward', 'Delete', 'Move...', 'Print'].forEach((t) => {
        const tool = u.el('div', 'qt-tool', toolbar);
        tool.innerHTML = icon(t);
        u.el('span', '', tool, t);
        if (t === 'New' || t === 'Forward') u.el('small', '', tool, '▾');
      });
      _c.toolbar = toolbar;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      if (_c.display === 'header') main.appendChild(_c.header);
      Object.assign(_c, { body, content, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
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
      foot.querySelector('.ref-foot-text').textContent = '';
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
    name: 'design-fill-form-email-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-email-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f6fc4'],
      LOW_ACCENTS: ['#2f6fc4'],
      parts,
    },
  });
})();
