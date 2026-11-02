(function () {
  'use strict';
  const palette = { bg: '#efe9da', panel: '#f6f1e4', fg: '#1d1a14', muted: '#6b6455', line: '#b9b19c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const roomy = _c.W >= 1280 && _c.H >= 700;
      _c.display = _c.ctx.display === 'panel' && !roomy ? 'header' : (_c.ctx.display || 'header');
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
      const ico = u.el('span', 'ds-appicon', top);
      ico.innerHTML =
        '<svg viewBox="0 0 40 44"><defs><linearGradient id="book"><stop stop-color="#e8d99d"/><stop offset="1" stop-color="#a58a49"/></linearGradient></defs><rect x="5" y="3" width="31" height="38" rx="4" fill="url(#book)" stroke="#f0dfa2"/><path d="M9 4v36M4 10h5M4 18h5M4 26h5M4 34h5" stroke="#594927" stroke-width="2"/><ellipse cx="23" cy="17" rx="5" ry="6" fill="#382e1b"/><path d="M14 34c0-12 17-13 17 0z" fill="#382e1b"/><path d="M19 25v11" stroke="#dac589" stroke-width="2"/></svg>';
      u.el('span', 'ds-brand', top, 'Contact Entry');
      const wc = u.el('span', 'ds-winctl', top);
      wc.innerHTML =
        '<i><svg viewBox="0 0 20 20" width="18" height="18"><path d="M4 14h12" stroke="#e8d9b0" stroke-width="2"/></svg></i><i><svg viewBox="0 0 20 20" width="18" height="18"><rect x="4" y="4" width="12" height="12" fill="none" stroke="#e8d9b0" stroke-width="2"/></svg></i><i><svg viewBox="0 0 20 20" width="18" height="18"><path d="M4 4l12 12M16 4L4 16" stroke="#e8d9b0" stroke-width="2"/></svg></i>';
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { top, wc, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction', null, note.textContent);
        note.textContent = '';
        _c.util.el('span', 'ds-info', note, 'i');
        note.appendChild(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.top.insertBefore(_c.headerTools, _c.wc);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-panel-note');
        const title = note.querySelector('.ref-panel-title');
        title.textContent = 'i';
        title.classList.add('ds-info');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.util.el('span', 'ds-info', note, 'i');
        note.insertBefore(note.lastChild, note.firstChild);
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      const text = foot.querySelector('.ref-foot-text');
      text.remove();
      const contacts = _c.util.el('button', 'ds-brass ds-contacts', null);
      contacts.type = 'button';
      contacts.innerHTML =
        '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="9" cy="8" r="4" fill="#3a2a14"/><path d="M1 21c0-8 16-8 16 0z" fill="#3a2a14"/><path d="M15 12l6 4v5h-6" fill="#3a2a14"/></svg><span>Contacts</span>';
      foot.insertBefore(contacts, foot.firstChild);
      Object.assign(_c, { foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ref-tools'));
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
    name: 'design-fill-form-card-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-card-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6f7a56'],
      LOW_ACCENTS: ['#6f7a56'],
      parts,
    },
  });
})();
