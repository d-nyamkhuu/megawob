(function () {
  'use strict';
  const palette = {
    bg: '#382b4b', panel: '#ffffff', fg: '#111029', muted: '#60647c', line: '#e3e6ee',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes have a dedicated place on the notebook surface.
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
      u.el('span', 'ds-brand', top, 'WorkFlow Pro');
      const controls = u.el('div', 'ds-controls', top);
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const icons = [
        '<rect x="3" y="6" width="24" height="19" rx="2"/><path d="m4 8 11 9 11-9"/>',
        '<path d="M6 3h14l6 7v19H6zM20 3v8h6M10 15h12M10 20h12M10 25h8"/>',
        '<path d="M11 6H5v23h22V6h-6M12 3h8v6h-8zM10 18l4 4 9-11"/>',
        '<path d="M6 29V15M15 29V4M24 29V11"/>',
        '<path d="m13 3 5 0 2 4 4 1 4 5-2 4 1 4-4 5-4-1-4 3-5-3-4 1-3-5 1-4-2-4 4-5 4-1z"/><circle cx="15.5" cy="16" r="5"/>',
      ];
      ['Email', 'Form', 'Tasks', 'Notes', 'Settings'].forEach((t, i) => {
        const tab = u.el('div', 'ds-tab', rail);
        const icon = u.el('span', 'ds-tab-icon', tab);
        icon.innerHTML = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">' + icons[i] + '</svg>';
        u.el('span', 'ds-tab-label', tab, t);
      });
      const content = u.el('div', 'ds-content', body);
      const rings = u.el('div', 'ds-rings', content);
      for (let i = 0; i < 16; i++) u.el('i', '', rings);
      Object.assign(_c, { top, controls, notebookBody: body, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('aside', 'ds-header-note', _c.header);
        box.appendChild(note);
        note.classList.add('ds-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.controls;
      base(_c);
      _c.header = header;
      ['min', 'max', 'close'].forEach((k) => _c.util.el('i', k, _c.controls));
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
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
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      const clear = _c.util.el('button', 'ds-clear-all', null, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        if (env.widgetDef.clear) env.widgetDef.clear();
      });
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
    name: 'design-fill-form-email-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-email-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4483ff'],
      LOW_ACCENTS: ['#4483ff'],
      parts,
    },
  });
})();
