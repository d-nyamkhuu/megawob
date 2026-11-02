(function () {
  'use strict';
  const palette = { bg: '#c9c7c0', panel: '#cfcdc5', fg: '#111', muted: '#4a4644', line: '#a6a19b' };
  function radios(u, parent, items) {
    items.forEach((t, i) => {
      const r = u.el('div', 'ds-radio', parent);
      u.el('i', i === 0 ? 'on' : '', r);
      u.el('span', '', r, t);
    });
  }
  function drawRight(u, body) {
    const right = u.el('aside', 'ds-right', body);
    const t1 = u.el('div', 'ds-side', right);
    u.el('h3', '', t1, 'Tools');
    const tb = u.el('div', 'ds-side-b', t1);
    const icons = [
      '<path fill="#eee" d="M8 6h28v34H8z"/><path d="M12 2v8m6-8v8m6-8v8m6-8v8M12 15h20M12 20h20M12 25h16M12 30h12"/><path fill="#c7c4bc" d="m28 33 12-15 4 4-12 15-6 2z"/>',
      '<rect x="8" y="4" width="30" height="40" rx="2" fill="#dad8d2"/><path fill="#a7bdcf" d="M12 8h22v9H12z"/><path d="M13 22h5v4h-5zM23 22h5v4h-5zM13 30h5v4h-5zM23 30h5v4h-5zM13 38h5v3h-5zM23 38h5v3h-5zM32 22h2v19"/>',
      '<path fill="#777" d="m29 29 14 13-5 5-14-14z"/><circle cx="19" cy="20" r="15" fill="#8d9396"/><circle cx="19" cy="20" r="11" fill="#dae1e5"/><path stroke="#fff" d="M11 20a8 8 0 0 1 9-8"/>',
    ];
    ['Notepad', 'Calculator', 'Look Up'].forEach((label, i) => {
      const r = u.el('div', 'ds-tool', tb);
      const icon = u.el('b', '', r);
      icon.innerHTML = '<svg viewBox="0 0 48 50" fill="none" stroke="#191919" stroke-width="2" stroke-linejoin="round">' + icons[i] + '</svg>';
      u.el('span', '', r, label);
    });
    u.el('hr', '', tb);
    const t2 = u.el('div', 'ds-side', right);
    u.el('h3', '', t2, 'Display');
    const db = u.el('div', 'ds-side-b', t2);
    radios(u, db, ['Normal', 'High Contrast', 'Monochrome']);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      u.el('span', 'ds-x', top, '✕');
      u.el('span', 'ds-brand', top, 'Personnel Records Lookup - Calibration Utility');
      const wc = u.el('span', 'ds-wc', top);
      ['_', '□', '✕'].forEach((t) => u.el('i', '', wc, t));
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|Tools|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const shell = u.el('div', 'ds-body', document.body);
      const left = u.el('aside', 'ds-side ds-left', shell);
      u.el('h3', '', left, 'Data Source');
      const lb = u.el('div', 'ds-side-b', left);
      radios(u, lb, ['Personnel DB', 'Lab Systems', 'Archive']);
      u.el('hr', '', lb);
      u.el('button', 'ds-btn', lb, 'Refresh').type = 'button';
      const ver = u.el('div', 'ds-ver', left);
      u.el('div', '', ver, 'v1.2.3');
      u.el('div', '', ver, 'Linux');
      const content = u.el('div', 'ds-content', shell);
      const title = u.el('h2', 'ds-title', content, 'Record Lookup');
      Object.assign(_c, { shell, content, title, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-title-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      _c.body = u.el('div', 'ds-main', _c.content);
      drawRight(u, _c.shell);
      const st = u.el('div', 'ds-status', document.body);
      u.el('span', '', st, 'Ready.');
      u.el('span', 'ds-clock', st, 'Mon Apr 12 2004   10:24');
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
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
      if (_c.placement === 'footer') foot.classList.add('ds-form-footer');
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
    name: 'design-find-fact-table-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#591c2b'],
      LOW_ACCENTS: ['#591c2b'],
      parts,
    },
  });
})();
