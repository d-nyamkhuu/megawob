(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#090909', muted: '#7c818a', line: '#a0a5ac' };
  const parts = {
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
      const bw = u.el('span', 'ds-brand', top);
      u.el('b', 'ds-logo', bw, 'WordMatch');
      u.el('i', 'ds-tag', bw, 'Find. Compare. Learn.');
      const nav = u.el('nav', 'ds-menu', top);
      ['Task', 'Resources', 'Settings', 'Help'].forEach((t, i) => u.el('span', i ? '' : 'on', nav, t));
      const usr = u.el('span', 'ds-user', top);
      u.el('span', 'ds-avatar', usr);
      u.el('span', '', usr, 'Guest');
      u.el('span', 'ds-chevron', usr);
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      let header = content;
      if (_c.display === 'header') {
        const note = u.el('aside', 'ds-header-note', content);
        u.el('span', 'ds-num', note, '01');
        header = u.el('div', 'ds-ttl', note);
        u.el('div', 'ds-kick', header, 'SIMILAR WORDS');
      }
      Object.assign(_c, { top, usr, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) instruction.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-top-tools');
      _c.top.insertBefore(_c.headerTools, _c.usr);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel');
        const title = panel.querySelector('.ref-panel-title');
        title.classList.add('ds-panel-title');
        title.textContent = 'TASK NOTES';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
      _c.body.classList.remove('ref-panel-right');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('ds-count');
      status.textContent = 'Ready';
      const clear = _c.util.el('button', 'ds-clear', foot, 'Clear All');
      clear.type = 'button';
      clear.addEventListener('click', () => _c.stage.querySelectorAll('input:checked').forEach(i => i.click()));
      foot.insertBefore(clear, foot.querySelector('.ref-tools'));
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
        cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.',
        chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.'
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: 'design-find-fact-similar-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-similar-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ee302d'],
      LOW_ACCENTS: ['#ee302d'],
      parts
    }
  });
})();
