(function () {
  'use strict';
  const palette = { bg: '#ececed', panel: '#f7f5f1', fg: '#202a33', muted: '#202a33', line: '#cfcdc6' };
  function fitNote(_c) {
    const note = _c.shell.querySelector('.task-note');
    if (!note) return;
    const instruction = note.querySelector('.ref-instruction, .ref-panel-text, .ref-note-text');
    if (!instruction) return;
    const style = getComputedStyle(note);
    const room = _c.shell.clientHeight * (_c.display === 'toast' ? 0.052 : 0.105) -
      parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - 2;
    let fontSize = parseFloat(getComputedStyle(instruction).fontSize);
    while (instruction.getBoundingClientRect().height > room && fontSize > 8) {
      fontSize -= 0.5;
      instruction.style.fontSize = fontSize + 'px';
    }
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'notebook');
      const shell = u.el('div', 'shell', document.body);
      const title = u.el('header', 'title-bar', shell);
      const appIcon = u.el('div', 'app-icon', title);
      appIcon.innerHTML = '<svg viewBox="0 0 24 26" aria-hidden="true"><rect x="3" y="2" width="18" height="22" rx="3" fill="#ff955b" stroke="#ffc095"/><path d="M7 3v20M5 7h3M5 11h3M5 15h3M5 19h3M10 7h8M10 10h8M10 13h8M10 16h6" fill="none" stroke="#ffba83" stroke-width=".8"/></svg>';
      u.el('div', 'title', title, 'Color Notebook');
      const menus = u.el('nav', 'menus', title);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const b = u.el('button', 'window-button', controls, label);
        const path = name === 'Minimize' ? '<path d="M3 9h12"/>' : name === 'Maximize' ?
          '<rect x="4" y="4" width="11" height="11" rx=".5"/><path d="M6 2h11v11"/>' : '<path d="m3 3 12 12M15 3 3 15"/>';
        b.innerHTML = '<svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4">' + path + '</svg>';
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      Object.assign(_c, { shell });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('div', 'tabs', _c.shell);
      const art = [
        '<path fill="currentColor" d="M12 1a11 11 0 1 0 0 22h2a3 3 0 0 0 2-5c-2-2 0-4 2-4h2c5 0 3-13-8-13Z"/><g fill="#f7f5f1"><circle cx="7" cy="7" r="1.7"/><circle cx="13" cy="5" r="1.7"/><circle cx="18" cy="9" r="1.7"/><circle cx="5" cy="13" r="1.7"/></g>',
        '<path d="M4 3h16M12 3v19" fill="none" stroke="currentColor" stroke-width="2"/>',
        '<path d="M5 2h14l2 4v11l-3 4-6 2-6-2-3-4V6Z M3 15h18" fill="none" stroke="currentColor" stroke-width="1.8"/>',
        '<rect x="2" y="3" width="20" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/><path d="m3 18 6-6 4 4 4-6 4 7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
      ];
      ['Color', 'Text', 'Shapes', 'Image'].forEach((label, i) => {
        const b = u.el('button', 'tab tab-' + label.toLowerCase() + (i === 0 ? ' on' : ''), tabs);
        b.type = 'button';
        b.style.width = [10.1, 11.4, 11.1, 11.2][i] + '%';
        const icon = u.el('span', 'tab-ico', b);
        icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + art[i] + '</svg>';
        u.el('span', '', b, label);
        b.onclick = () => env.log('tab', { label });
      });
      u.el('h1', 'nb-head', _c.shell, 'Pick a color');
      u.el('p', 'nb-sub', _c.shell, 'Drag in the color area or adjust the sliders to choose a color.');
      u.el('div', 'right-rule', _c.shell);
      const header = u.el('section', '', _c.shell);
      if (_c.display === 'header') header.classList.add('task-note');
      Object.assign(_c, { tabs, header });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      fitNote(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.shell; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const note = _c.header.querySelector('.ref-panel');
      if (note) note.classList.add('task-note', 'instruction-panel');
      fitNote(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.shell);
      _c.stage.dataset.role = 'stage';
      const delta = _c.util.el('div', 'difference-value', _c.shell, '');
      delta.dataset.role = 'color-difference';
      delta.hidden = true;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        _c.shell.classList.add('has-instruction-toast');
        _c.shell.appendChild(note);
        fitNote(_c);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.shell.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el('h3', '', box, { cookie: 'Preferences', toast: 'Notice', chat: 'Support', promo: 'Reminder', banner: 'Notice' }[kind]);
      u.el('p', '', box, {
        cookie: 'Optional settings may be stored on this computer.',
        toast: 'Color Notebook is ready.',
        chat: 'Drag in the color area or the hue strip to match the target.',
        promo: 'Review your notebook settings before continuing.',
        banner: 'Color Notebook is using the default profile.',
      }[kind]);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-hex-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { notebook: palette }, LOW_THEME: palette, ACCENTS: ['#ff5b17'], LOW_ACCENTS: ['#ff5b17'], parts },
  });
})();
