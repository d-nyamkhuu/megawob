// Windows desktop design on the shared frame; widget geometry stays site-owned.
(function () {
  'use strict';

  const appArt = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" stroke="#111" d="M12 2h18v23H12zM2 19h17v11H2z"/><path fill="#653a73" d="M14 4h13v17H14z"/><path stroke="#fff" fill="none" d="M16 6h9v5h-9zM17 13h6v7M20 5v16"/><path fill="#000080" d="M4 21h12v7H4z"/><path stroke="#ff0" d="M6 22l8 5M14 22l-8 5"/><path stroke="#111" fill="#c0c0c0" d="M9 12h9v10H9z"/><path fill="#fff" d="M11 14h5v3h-5z"/></svg>';

  function styleInstruction(el, util) {
    const text = el.textContent;
    el.classList.add('instruction');
    el.textContent = '';
    for (const part of text.split(/(#[0-9a-fA-F]{6}[^.!]*|rgb\([^)]*\)|picker)/g)) {
      util.el(part === 'picker' ? 'em' : 'span', /^(#|rgb\()/.test(part) ? 'instruction-color' : '', el, part);
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const { ctx, util: u } = _c;
      // The offset document has room for every instruction mode even at 1024px.
      const display = ctx.display || 'header';
      document.body.className = 'design win31';
      const shell = u.el('div', 'shell', document.body);
      const note = u.el('section', 'task-note', shell);
      note.hidden = display === 'hidden';
      note.classList.toggle('instruction-panel', display === 'panel');
      note.classList.toggle('instruction-toast', display === 'toast');
      const win = u.el('div', 'win', shell);
      Object.assign(_c, { display, shell, note, win });
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      // This window always includes its bottom action strip.
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const { util: u, win } = _c;
      const title = u.el('header', 'title-bar', win);
      u.el('div', 'app-icon', title).innerHTML = appArt;
      u.el('div', 'title', title, 'Color Picker');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [
        ['_', 'Minimize'],
        ['□', 'Maximize'],
        ['×', 'Close'],
      ]) {
        const b = u.el('button', 'window-button', controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.classList.add('window-' + name.toLowerCase());
        b.onclick = () => env.log('window-control', { name });
      }

      Object.assign(_c, { header: title, controls });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        _c.note.append(instruction);
        styleInstruction(instruction, _c.util);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.insertBefore(_c.headerTools, _c.controls);
    },
    'frame.body': () => (_c) => {
      const { util: u, win } = _c;
      const body = u.el('div', 'win-body ref-body', win);
      const tools = u.el('div', 'tools', body);
      for (const kind of ['dropper', 'wheel', 'chip']) {
        const b = u.el('button', 'tool tool-' + kind, tools);
        b.type = 'button';
        b.setAttribute('aria-label', kind);
        b.onclick = () => env.log('tool', { kind });
        u.el('span', 'tool-art', b);
        if (kind === 'dropper')
          b.firstChild.innerHTML =
            '<svg viewBox="0 0 40 40" aria-hidden="true"><g transform="rotate(40 20 20)" stroke="#111" stroke-width="2"><path fill="#222" d="M17 2h6v11h-6zM13 12h14v5H13z"/><path fill="#eee" d="M17 17h6v15l-3 5-3-5z"/><path stroke="#777" d="M19 19v11"/></g></svg>';
      }

      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('note-panel');
        panel.querySelector('.ref-panel-title').classList.add('note-panel-title');
        styleInstruction(panel.querySelector('.ref-panel-text'), _c.util);
        _c.note.append(panel);
      }
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.body);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const toast = document.querySelector('.ref-note');
      if (toast) {
        toast.classList.add('note-toast');
        toast.querySelector('.ref-note-x').classList.add('note-close');
        styleInstruction(toast.querySelector('.ref-note-text'), _c.util);
        _c.note.append(toast);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const { util: u, shell } = _c;
      const footer = document.querySelector('.ref-foot');
      footer.classList.add('footer');
      footer.querySelector('.ref-foot-text').remove();
      _c.body.append(footer);
      for (const [cls, label] of [['btn-reset', 'Reset'], ['btn-cancel', 'Cancel']]) {
        const button = u.el('button', 'btn ' + cls, footer, label);
        button.type = 'button';
        button.onclick = () => env.log('button', { label });
      }
      const bar = u.el('div', 'taskbar', shell);
      const start = u.el('div', 'start', bar);
      const flag = u.el('span', 'flag', start);
      for (let i = 0; i < 4; i++) u.el('i', 'f' + i, flag);
      u.el('span', '', start, 'Start');
      const task = u.el('div', 'task-btn', bar);
      u.el('span', 'task-ico', task).innerHTML = appArt;
      u.el('span', '', task, 'Color Picker');
      const tray = u.el('div', 'tray', bar);
      u.el('span', 'spk', tray).innerHTML =
        '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#ddd" stroke="#111" stroke-width="2" d="M3 12h6l7-6v20l-7-6H3z"/><path fill="none" stroke="#111" stroke-width="2" d="M20 10q8 6 0 12M24 5q12 11 0 22"/></svg>';
      u.el('span', '', tray, '10:24 AM');

      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.footer.append(dock);
    },
    // Keep the existing beveled, blue-titlebar overlays in this design's style.
    overlay: () => function (ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        { cookie: 'Preferences', toast: 'Notice', chat: 'Support', promo: 'Reminder', banner: 'Notice' }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this computer.',
          toast: 'The color picker is ready.',
          chat: 'Drag the hue and saturation/value handles to adjust the color.',
          promo: 'Review the color settings before continuing.',
          banner: 'The color picker is using the default profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };

  const colors = { bg: '#008080', panel: '#c0c0c0', fg: '#000', muted: '#000', line: '#808080' };
  env.site({
    name: 'design-pick-color-hex-09',
    template: 'site/base',
    styles: ['templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      THEMES: { classic: colors },
      LOW_THEME: colors,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
