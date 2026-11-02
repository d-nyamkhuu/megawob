(function () {
  'use strict';
  const palette = { bg: '#07283c', panel: '#0b2a3e', fg: '#d6edf9', muted: '#9cc5d8', line: '#549bbd' };
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
      const top = u.el('header', 'ds-top', document.body);
      const appIcon = u.el('span', 'ds-app-icon', top);
      appIcon.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><rect x="1" y="1" width="17" height="17"/><path d="M10 3v14M6 6l4 2 4-2M5 12l5-3 5 3M6 14l4-2 4 2"/></svg>';
      u.el('span', 'ds-brand', top, 'MediPlan Pro 2014 - Appointment Scheduler');
      u.el('span', 'ds-wc', top, '−    □    ×');
      const content = u.el('div', 'ds-content');
      const header = u.el('div', 'ds-header-note', content);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { content, header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Tools|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const toolbar = u.el('div', 'ds-tools', document.body);
      const icons = {
        New: '<path d="M5 2h10l5 5v15H5z" fill="#e3edf2"/><path d="M15 2v6h5"/>',
        Open: '<path d="M2 7V4h8l3 3h8v4M2 7h20l-4 13H1z" fill="#cbdce7"/>',
        Save: '<path d="M3 2h18v20H3z" fill="#bdcedb"/><path d="M7 2v7h10V2M6 14h12v8M15 3v4"/>',
        Print: '<path d="M6 2h12v6H6zM6 15h12v7H6z" fill="#dce8ef"/><path d="M3 8h18v10h-3M6 18H3V8M7 12h10M18 11h1M8 18h8"/>',
        Undo: '<path d="M3 3v8h8M3 11c2-9 16-10 18 0 1 6-3 10-9 10"/>',
        Redo: '<path d="M21 3v8h-8M21 11C19 2 5 1 3 11c-1 6 3 10 9 10"/>',
        'Zoom In': '<circle cx="10" cy="10" r="8" fill="#b9ccdb"/><path d="M16 16l6 6M6 10h8M10 6v8"/>',
        'Zoom Out': '<circle cx="10" cy="10" r="8" fill="#b9ccdb"/><path d="M16 16l6 6M6 10h8"/>',
        Fit: '<rect x="2" y="2" width="20" height="20" fill="#b9ccdb"/><path d="M6 12h12M12 6v12"/>',
      };
      ['New', 'Open', 'Save', 'Print', '|', 'Undo', 'Redo', '|', 'Zoom In', 'Zoom Out', 'Fit'].forEach((t) => {
        if (t === '|') u.el('i', '', toolbar);
        else {
          const item = u.el('span', 'ds-tool' + (t === 'Undo' || t === 'Redo' ? ' dim' : ''), toolbar);
          item.innerHTML = '<svg viewBox="0 0 24 24">' + icons[t] + '</svg>';
          u.el('span', '', item, t);
        }
      });
      _c.toolbar = toolbar;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'ds-body', document.body);
      body.appendChild(_c.content);
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
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
      const status = _c.util.el('em', '', foot);
      status.innerHTML = '<span class="ds-status-dim">CAP</span>   NUM   <span class="ds-status-dim">SCRL</span>   X: 347.6   Y: 112.3   mm';
      foot.insertBefore(status, foot.querySelector('.ref-tools'));
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
    name: 'design-set-date-typed-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-typed-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1177b7'],
      LOW_ACCENTS: ['#1177b7'],
      parts,
    },
  });
})();
