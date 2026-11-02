(function () {
  'use strict';
  const palette = { bg: '#d9dadd', panel: '#ffffff', fg: '#080808', muted: '#79818f', line: '#bbc2c9' };
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
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const main = u.el('div', 'ds-main', content);
      const header = u.el('aside', 'ds-brief', main);
      header.hidden = _c.display !== 'header' && _c.display !== 'panel';
      const toolbar = u.el('div', 'ds-end-tools', main);
      Object.assign(_c, { shell, content, main, header, toolbar });
    },
    'frame.nav': () => () => {},
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
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('ds-instruction');
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
      const text = _c.header.querySelector('.ds-instruction');
      if (text) {
        let fs = parseFloat(getComputedStyle(text).fontSize);
        while (text.getBoundingClientRect().height > _c.header.clientHeight - 4 && fs > 12) {
          fs -= 0.5;
          text.style.fontSize = fs + 'px';
        }
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.classList.toggle('ds-finish', !!_c.ctx.finish);
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const u = _c.util;
      const qa = u.el('div', 'ds-quick', foot);
      qa.setAttribute('aria-disabled', 'true');
      u.el('span', 'ds-qbolt', qa, '⚡');
      const qt = u.el('div', 'ds-qtext', qa);
      u.el('b', '', qt, 'Quick action');
      u.el('i', '', qt, 'Auto-fill from email');
      u.el('small', 'ds-qnote', foot, 'Unavailable at this time');
      u.el('span', 'ds-divider', foot);
      const clr = u.el('button', 'ds-clear', foot, 'Clear form');
      clr.type = 'button';
      const aux = u.el('div', 'ds-aux', foot);
      for (const button of [..._c.headerTools.querySelectorAll('.ref-xtra'), ...foot.querySelectorAll('.ref-tools .ref-xtra')]) aux.appendChild(button);
      Object.assign(_c, { foot });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.classList.add('ds-floating');
        _c.foot.appendChild(dock);
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
    name: 'design-fill-form-email-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-email-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffd93d'],
      LOW_ACCENTS: ['#ffd93d'],
      parts,
    },
  });
})();
