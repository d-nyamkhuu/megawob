(function () {
  'use strict';
  const palette = { bg: '#f3f5f8', panel: '#ffffff', fg: '#101c30', muted: '#66707d', line: '#b9c0cb' };
  const styleControls = (el, header) => {
    el.querySelectorAll('.ref-submit').forEach((b) => {
      b.classList.add('ds-submit');
      if (header) b.classList.add('ds-submit-header');
    });
    el.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('ds-xtra'));
    el.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-submit', 'ds-submit-link'));
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Match the intake window's original available-space thresholds.
      const roomy = _c.W * 0.94 - 2 >= 1150;
      const tall = _c.H * 0.869 >= 590;
      _c.display = _c.ctx.display === 'hidden' ? 'hidden'
        : _c.ctx.display === 'toast' && tall ? 'toast'
        : _c.ctx.display === 'panel' && roomy ? 'panel' : 'header';
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
      const frame = u.el('div', 'ds-frame', document.body);
      frame.dataset.instruction = { header: 'top', panel: 'left', toast: 'toast', hidden: 'hidden' }[_c.display];
      const top = u.el('header', 'ds-top', frame);
      const ic = u.el('span', 'ds-icon', top);
      ic.innerHTML = '<svg viewBox="0 0 32 38" aria-hidden="true"><path fill="#ff7b18" d="M3 1h20l8 8v26a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z"/><path fill="#ffbd89" d="M23 1v8h8Z"/><path fill="white" d="M8 9h12v7h6v14H8Z"/><path stroke="#ff9a49" stroke-width="1.6" d="M11 19h12M11 23h12M11 27h12"/></svg>';
      u.el('span', 'ds-brand', top, 'Information Transfer');
      const step = u.el('span', 'ds-step', top, 'Step 1 of 1');
      u.el('i', 'ds-dot', step);
      const outer = u.el('div', 'ds-body', frame);
      const content = u.el('div', 'ds-content', outer);
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { frame, top, content, main, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('aside', 'ds-header-note', _c.content);
        _c.util.el('span', 'ds-bang', box, '!');
        note.classList.add('ds-instruction');
        box.appendChild(note);
        _c.content.insertBefore(box, _c.main);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-tools');
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        const marker = _c.util.el('span', 'ds-panel-marker', null, '!');
        panel.prepend(marker);
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'ds-stage', _c.main); },
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
      foot.querySelector('.ref-foot-text').remove();
      _c.content.appendChild(foot);
      styleControls(foot, false);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock, false);
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
    name: 'design-fill-form-email-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-email-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff7915'],
      LOW_ACCENTS: ['#ff7915'],
      parts,
    },
  });
})();
