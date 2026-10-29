// E-ink workspace: visual sections on the shared site frame.
(function () {
  'use strict';
  const ICONS = {
    Picker:
      '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M23 15L7 31l-1 5 5-1 16-16" fill="#faf8f3" stroke="#111" stroke-width="2.1" stroke-linejoin="round"/><path d="M21 14l8 8" stroke="#111" stroke-width="5" stroke-linecap="round"/><path d="M25 15l6-6a4.5 4.5 0 0 1 6 6l-6 6z" fill="#111"/></svg>',
    Hue: '<svg viewBox="0 0 40 40" width="100%" height="100%"><circle cx="20" cy="20" r="14" fill="none" stroke="#111" stroke-width="2.6"/></svg>',
    Saturation:
      '<svg viewBox="0 0 40 40" width="100%" height="100%"><circle cx="20" cy="20" r="14" fill="none" stroke="#111" stroke-width="2.6"/><path d="M20 6a14 14 0 0 0 0 28z" fill="#111"/></svg>',
    Value:
      '<svg viewBox="0 0 40 40" width="100%" height="100%"><g fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"><circle cx="20" cy="20" r="7"/><path d="M20 4v5M20 31v5M4 20h5M31 20h5M8.7 8.7l3.5 3.5M27.8 27.8l3.5 3.5M31.3 8.7l-3.5 3.5M12.2 27.8l-3.5 3.5"/></g></svg>',
  };

  const PAPER = { bg: '#f7f5ef', panel: '#f7f5ef', fg: '#111', muted: '#222', line: '#333' };

  // Keep the template's controls and handlers, with this frame's CSS classes.
  function dressControls(host, header) {
    for (const b of host.querySelectorAll('.ref-xtra')) b.className = 'chrome-xtra';
    for (const b of host.querySelectorAll('.ref-submit')) {
      b.className = 'submit' + (header ? ' header-submit' : '');
      if (!header) {
        const wrap = document.createElement('div');
        wrap.className = 'submit-wrap';
        b.before(wrap);
        wrap.appendChild(b);
      }
    }
    for (const b of host.querySelectorAll('.ref-endlink')) b.className = 'chrome-endlink';
  }

  env.site({
    name: 'design-pick-color-hex-08',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { eink: PAPER },
      LOW_THEME: PAPER,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts: {
        'frame.theme': (base) => function (_c) {
          base(_c);
          document.body.className = 'design eink';
        },
        'frame.layout': (base) => function (_c) {
          base(_c);
          // The fixed task column has room for every instruction mode at every viewport.
          _c.display = _c.ctx.display;
        },
        'frame.placement': (base) => function (_c) {
          base(_c);
          // This design always has a footer, including at the smallest viewport.
          _c.wantFooter = true;
        },
        'frame.header': () => function (_c) {
          const { util: u } = _c;
          const shell = u.el('div', 'shell display-' + _c.display, document.body);
          const title = u.el('header', 'title-bar', shell);
          u.el('div', 'title', title, 'Color Match');
          const controls = u.el('div', 'window-controls', title);
          const glyph = {
            Minimize: '<svg viewBox="0 0 20 20"><path d="M3 15h13" stroke="#111" stroke-width="1.6"/></svg>',
            Maximize:
              '<svg viewBox="0 0 20 20"><rect x="3.5" y="3.5" width="13" height="13" fill="none" stroke="#111" stroke-width="1.8"/></svg>',
            Close:
              '<svg viewBox="0 0 20 20"><path d="M3.5 3.5l13 13M16.5 3.5l-13 13" stroke="#111" stroke-width="1.8"/></svg>',
          };
          for (const name of ['Minimize', 'Maximize', 'Close']) {
            const b = u.el('button', 'window-button', controls);
            b.type = 'button';
            b.setAttribute('aria-label', name);
            b.innerHTML = glyph[name];
            b.onclick = () => env.log('window-control', { name });
          }

          const note = u.el('section', 'task-note', shell);
          u.el('div', 'task-label', note, 'Task');
          Object.assign(_c, { shell, header: title, note });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => function (_c) {
          base({ ..._c, header: _c.note });
          const instruction = _c.note.querySelector('.ref-instruction');
          if (instruction) instruction.className = 'instruction';
          _c.note.querySelector('.ref-spacer')?.remove();
        },
        'frame.tools': (base) => function (_c) {
          base(_c);
          _c.headerTools.className = 'header-action';
          _c.header.querySelector('.window-controls').before(_c.headerTools);
          dressControls(_c.headerTools, true);
        },
        'frame.body': () => function (_c) {
          const { util: u, shell } = _c;
          u.el('div', 'panel panel-l', shell);
          const pr = u.el('div', 'panel panel-r', shell);
          u.el('div', 'panel-title', pr, 'Color Picker');
          _c.body = shell;
        },
        'frame.panel': (base) => function (_c) {
          base({ ..._c, body: _c.note });
          const panel = _c.note.querySelector('.ref-panel');
          if (panel) {
            panel.className = 'instruction-panel';
            panel.querySelector('.ref-panel-title').remove();
            panel.querySelector('.ref-panel-text').className = 'instruction';
          }
        },
        'frame.stage': (base) => function (_c) {
          base(_c);
          _c.stage.className = 'stage';
          _c.stage.dataset.role = 'stage';
        },
        'frame.toast': (base) => function (_c) {
          base(_c);
          const toast = document.querySelector('.ref-note');
          if (toast) {
            toast.className = 'instruction-toast';
            toast.querySelector('.ref-note-text').className = 'instruction';
            toast.querySelector('.ref-note-x').className = 'note-close';
            _c.note.appendChild(toast);
          }
          const { util: u, note } = _c;
          u.el('div', 'task-rule', note);
          u.el('p', 'task-desc', note,
            'Adjust the color using the picker on the right. The readouts show the current hue, saturation and value.');
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const { util: u, shell } = _c;
          const footer = document.querySelector('.ref-foot');
          footer.className = 'footer';
          shell.appendChild(footer);
          footer.querySelector('.ref-foot-text').remove();
          const actions = footer.querySelector('.ref-tools');
          actions.className = 'actions';
          actions.remove();
          const sel = u.el('section', 'sel-section', footer);
          sel.dataset.role = 'selected-host';
          u.el('div', 'sel-title', sel, 'Selected color');
          u.el('div', 'f-divider', footer);
          const tools = u.el('div', 'tools', footer);
          ['Picker', 'Hue', 'Saturation', 'Value'].forEach((name, i) => {
            const b = u.el('button', 'tool' + (i === 0 ? ' on' : ''), tools);
            b.type = 'button';
            u.el('span', 'tool-ico', b).innerHTML = ICONS[name];
            u.el('span', 'tool-name', b, name);
            b.onclick = () => {
              for (const t of tools.children) t.classList.remove('on');
              b.classList.add('on');
              env.log('tool', { name });
            };
          });
          u.el('div', 'f-divider', footer);
          footer.appendChild(actions);
          const reset = u.el('button', 'reset', actions, 'Reset');
          reset.type = 'button';
          reset.onclick = () => env.log('reset', {});

          actions.prepend(reset);
          dressControls(actions, false);
          _c.actions = actions;
        },
        'frame.floating': (base) => function (_c) {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            dock.className = 'floating-action';
            _c.actions.appendChild(dock);
            dressControls(dock, false);
          }
        },
        // These obstruction cards are drawn in the same e-ink style as the workspace.
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
              cookie: 'Optional settings may be stored on this workstation.',
              toast: 'The color utility is ready.',
              chat: 'The picker provides hue, saturation and value controls.',
              promo: 'The preview shows your current selection.',
              banner: 'Color Match is running with the default profile.',
            }[kind],
          );
          const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
          dismiss.type = 'button';
          dismiss.onclick = () => ctx.dismiss('close');
          return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
        },
      },
    },
  });
})();
