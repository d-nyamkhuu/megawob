(function () {
  'use strict';
  const palette = { bg: '#f7f5f0', panel: '#fff', fg: '#11151c', muted: '#646b77', line: '#d7d9dc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Alternate notes used only the large workstation layout in this design.
      const roomy = _c.W >= 1260 && _c.H - 53 >= 750;
      _c.display = _c.ctx.display === 'hidden' ? 'hidden'
        : roomy && ['panel', 'toast'].includes(_c.ctx.display) ? _c.ctx.display : 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      u.el('span', 'ds-brand', top, 'Focus Challenge');
      const meta = u.el('div', 'ds-window-meta', top);
      u.el('span', '', meta, 'Mon, Apr 27, 2026  10:14 AM');
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      content.dataset.instructionMode = _c.display === 'header' ? 'top' : _c.display === 'panel' ? 'left' : _c.display;
      Object.assign(_c, { top, meta, body, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('aside', 'ds-header-note', _c.content);
        note.classList.add('ds-instruction');
        box.appendChild(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-end-tools');
      _c.top.insertBefore(_c.headerTools, _c.meta);
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      if (_c.display === 'panel') {
        const pane = _c.util.el('aside', 'ds-brief ds-panel-note', _c.main);
        _c.util.el('h2', '', pane, 'Your Progress');
        base({ ..._c, body: pane });
        const note = pane.querySelector('.ref-panel');
        note.classList.add('ds-instruction');
      } else base(_c);
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
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      foot.classList.toggle('ds-footer-link', _c.placement === 'link');
      const link = foot.querySelector('.ref-endlink');
      if (link) _c.top.appendChild(link);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.top.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      el.dataset.initial = String(!!ctx.initial);
      if (ctx.kind === 'promo') {
        el.classList.add('ds-newsletter');
        const icon = u.el('div', 'ds-newsletter-icon', el);
        icon.innerHTML =
          '<svg viewBox="0 0 40 32" aria-hidden="true"><rect x="2" y="4" width="36" height="25" rx="3" fill="#1674e8"/><path d="M4 7l16 12L36 7" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/></svg>';
        const copy = u.el('div', 'ds-newsletter-copy', el);
        u.el('h2', '', copy, 'Join our newsletter');
        u.el('p', '', copy, 'Get product tips and updates, straight to your inbox.');
        const x = u.el('button', 'ds-newsletter-x', el, '×');
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => ctx.dismiss('close'));
        const actions = u.el('div', 'ds-newsletter-actions', el);
        const later = u.el('button', 'ds-newsletter-later', actions, 'Not now');
        later.addEventListener('click', () => ctx.dismiss('close'));
        const dismiss = u.el('button', 'ds-newsletter-close', actions, 'Close');
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss };
      }
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-chase-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    pauseOnOverlay: true,
    design: {
      THEMES: { 'design-act-in-time-chase-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2878e8'],
      LOW_ACCENTS: ['#2878e8'],
      parts,
    },
  });
})();
