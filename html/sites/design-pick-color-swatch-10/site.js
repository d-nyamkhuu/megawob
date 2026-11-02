(function () {
  'use strict';
  const palette = { bg: '#f6f2e6', panel: '#f4f0e4', fg: '#111', muted: '#111', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Match the original workstation's compact panel fallback.
      if (_c.display === 'panel' && (_c.W - 4 < 1260 || _c.H < 760)) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'lisa');
      const shell = u.el('div', 'shell', document.body);
      const menu = u.el('nav', 'menu-bar', shell);
      const icon = u.el('div', 'app-icon', menu);
      icon.innerHTML =
        '<svg viewBox="0 0 34 34" width="100%" height="100%"><rect x="5" y="2" width="24" height="19" fill="#f4f0e4" stroke="#111" stroke-width="2.5"/><rect x="9" y="6" width="16" height="11" fill="#cfcabb" stroke="#111" stroke-width="1.5"/><rect x="2" y="23" width="30" height="8" fill="#f4f0e4" stroke="#111" stroke-width="2.5"/><line x1="8" y1="27" x2="26" y2="27" stroke="#111" stroke-width="2"/></svg>';
      const menus = u.el('div', 'menus', menu);
      for (const label of ['File', 'Edit', 'Tools', 'Window', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      u.el('div', 'clock', menu, 'Mon Apr 22, 1985   10:24 AM');
      const main = u.el('div', 'main', shell);
      const win = u.el('section', 'workbench', main);
      const tb = u.el('div', 'title-strip', win);
      u.el('span', 'close-box', tb);
      u.el('span', 'title-rule', tb);
      u.el('span', 'title', tb, 'Color Match');
      u.el('span', 'title-rule', tb);
      const header = u.el('section', 'task-note instruction-' + _c.display, win);
      if (_c.display === 'hidden' || _c.display === 'panel') win.classList.add('instruction-hidden');
      Object.assign(_c, { shell, menu, main, win, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note && note.textContent.length > 50) note.classList.add('instruction-long');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const insp = u.el('aside', 'inspector', _c.main);
      u.el('div', 'insp-title', insp, 'Inspector');
      const pv = u.el('div', 'insp-sec', insp);
      u.el('div', 'insp-head', pv, 'Color Preview');
      const row1 = u.el('div', 'prev-row', pv);
      u.el('div', 'prev-sw', row1).dataset.role = 'insp-target';
      u.el('div', 'prev-label', row1, 'Target');
      const row2 = u.el('div', 'prev-row', pv);
      u.el('div', 'prev-sw', row2).dataset.role = 'insp-current';
      const l2 = u.el('div', 'prev-label', row2, 'Current');
      u.el('div', '', l2).dataset.role = 'insp-hex';
      const cv = u.el('div', 'insp-sec rule', insp);
      u.el('div', 'insp-head', cv, 'Current Values');
      const g1 = u.el('div', 'kv', cv);
      for (const k of ['H', 'S', 'V']) {
        u.el('span', '', g1, k + ':');
        u.el('span', '', g1).dataset.role = 'insp-' + k.toLowerCase();
      }
      const g2 = u.el('div', 'kv rule2', cv);
      for (const k of ['R', 'G', 'B']) {
        u.el('span', '', g2, k + ':');
        u.el('span', '', g2).dataset.role = 'insp-' + k.toLowerCase();
      }
      const df = u.el('div', 'insp-sec rule', insp);
      u.el('div', 'insp-head', df, 'Color Difference');
      const g3 = u.el('div', 'kv last', df);
      u.el('span', '', g3, 'ΔE00:');
      u.el('span', '', g3, '—').dataset.role = 'color-difference';
      Object.assign(_c, { body: _c.win, insp });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.insp;
      base(_c);
      _c.body = body;
      const note = _c.insp.querySelector('.ref-panel-text');
      if (note && note.textContent.length > 50) note.classList.add('instruction-long');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.win);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        const text = note.querySelector('.ref-note-text');
        if (text.textContent.length > 50) text.classList.add('instruction-long');
      }
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'footer', _c.win);
      const reset = _c.util.el('button', 'reset', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) footer.appendChild(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        { cookie: 'Preferences', toast: 'Notice', chat: 'Help', promo: 'Reminder', banner: 'Workstation notice' }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The color utility is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the color profile before matching.',
          banner: 'The workstation is using the default profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-swatch-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
