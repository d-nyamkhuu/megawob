(function () {
  'use strict';
  const cfg = {
    'title': 'Text Transfer - IRIX',
    'theme': 'openlook',
    'layout': 'board',
    'tools': 'File    Edit    View    Tools    Options    Help',
  };
  const icon = (kind) => {
    const shapes = {
      crystal:
        '<path fill="#625b96" d="M32 2 59 20 58 46 32 63 5 45 5 21Z"/><path fill="#aaa3d8" d="m32 2-9 23 21-9Z"/><path fill="#827ab7" d="m32 2 12 14 15 4-9 17Z"/><path fill="#4b477b" d="m23 25 9 38 18-26Z"/><path fill="#7169a9" d="m5 21 18 4 9-23Z"/><path fill="#9a93c8" d="m5 21 18 4-5 19Z"/><path fill="#3d3969" d="m18 44 14 19-27-18Z"/><path fill="#7e76ae" d="m50 37 9-17-1 26-26 17Z"/><path fill="#b4aedc" d="m23 25 21-9 6 21Z"/>',
      folder:
        '<path fill="#4e639c" stroke="#3f4773" d="M3 17h24l5-9h23v12h6l-6 37H7Z"/><path fill="#7e94c7" stroke="#aeb8dc" d="M4 20h25l5-9h18v10h8l-6 34H8Z"/><path fill="#536da7" d="m8 27 49-3-4 30H10Z"/>',
      text: '<path fill="#4d486a" d="M18 5h34v55H15V13Z"/><path fill="#c3b7a4" stroke="#6f668a" d="M14 8h34v50H12V17Z"/><path fill="#9a95bf" stroke="#66618b" d="M9 13h33v48H9Z"/><path fill="#c4bedc" d="M12 15h27v4H12Z"/><path stroke="#6d678e" d="M14 24h23M14 29h23M14 34h23M14 39h23M14 44h23M14 49h23M14 54h23"/>',
      system:
        '<path fill="#8b85b7" stroke="#514d83" d="M7 7h50v50H7Z"/><path fill="#b0a8d1" d="M9 9h46v3H9Z"/><path fill="#65629a" stroke="#bbb4d9" d="M12 15h15v14H12Zm23 0h15v14H35ZM12 36h15v15H12Zm23 0h15v15H35Z"/><path stroke="#494574" d="M17 19h7v7h-7m23-7h7v7h-7M17 40h7v8h-7m23-8h7v8h-7"/>',
      display:
        '<path fill="#8f88b9" stroke="#4e4977" d="M5 7h52v39H5Z"/><path fill="#bbb5d9" d="M8 10h45v3H8Z"/><path fill="#34315d" stroke="#666492" d="M11 14h39v26H11Z"/><path fill="#4b457f" d="M14 16h32L14 36Z"/><path fill="#68618d" d="M25 46h12v7h10v5H16v-5h9Z"/><path stroke="#bab4d6" d="M17 54h29"/>',
      media:
        '<path fill="#66618f" stroke="#45426c" d="M9 14h47v37c0 14-47 14-47 0Z"/><ellipse cx="32.5" cy="14" rx="23.5" ry="10" fill="#8d84ba" stroke="#b3a9d5"/><path fill="none" stroke="#b2a7d6" stroke-width="2" d="M10 27c10 12 34 12 45 0M10 40c10 12 34 12 45 0M10 51c10 12 34 12 45 0"/><path fill="none" stroke="#4b466f" d="M10 31c10 12 34 12 45 0M10 44c10 12 34 12 45 0"/>',
      print:
        '<path fill="#8b83b4" stroke="#544d7b" d="M18 5h27v24H18Z"/><path fill="#b2aad0" d="M21 7h21v3H21Z"/><path fill="#72699e" stroke="#514972" d="M8 27h47l5 9v17H5V36Z"/><path fill="#aaa1c9" d="M8 29h45l3 6H7Z"/><path fill="#51486f" d="M14 43h36v9H14Z"/><path fill="#9690b6" stroke="#554e77" d="M17 46h29v13H17Z"/><path stroke="#b5afcd" d="M20 50h23m-23 4h23"/><path fill="#c2b6d5" d="M49 36h5v3h-5Z"/>',
      clear:
        '<path fill="#7972ad" stroke="#514b80" d="m10 43 32-34 14 10-32 35Z"/><path fill="#a7a0d0" d="m12 40 30-31 13 9-31 32Z"/><path fill="#5f598f" d="m24 50 31-32 1 8-31 30Z"/><path fill="#8981b5" stroke="#b3acd5" d="m10 43 14 9 1 6-15-9Z"/>',
      play: '<path fill="#625b9b" stroke="#4c4477" d="m15 9 39 24-39 23Z"/><path fill="#958bc7" d="m17 10 34 22-32-15Z"/><path fill="#7870b3" d="m18 19 29 14-29 17Z"/>',
      help: '<circle cx="32" cy="32" r="26" fill="#7168a3" stroke="#b0a8d3" stroke-width="3"/><path fill="#514b83" d="M13 45a26 26 0 0 0 42-20A24 24 0 0 1 13 45Z"/><text x="32" y="49" text-anchor="middle" fill="#f4f1ff" font-family="Arial" font-weight="bold" font-size="45">?</text>',
    };
    return '<svg viewBox="0 0 64 64" aria-hidden="true">' + (shapes[kind] || shapes.crystal) + '</svg>';
  };
  function workstation(ctx, shell, foot) {
    const u = ctx.util;
    const rail = u.el('aside', 'desktop-rail', document.body);
    rail.setAttribute('aria-hidden', 'true');
    u.el('strong', 'sgi-word', rail, 'sgi');
    const mountain = u.el('div', 'desktop-mountain', rail);
    mountain.innerHTML =
      '<svg viewBox="0 0 140 700" preserveAspectRatio="none"><defs><filter id="irix-grain"><feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="3" seed="9"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".18"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter></defs><g filter="url(#irix-grain)"><path fill="#394777" d="M0 65 75 0 140 29v671H0Z"/><path fill="#53578b" d="M0 65 75 0 29 147Z"/><path fill="#7776a2" d="m75 0 65 29v97l-111 21Z"/><path fill="#5d608c" d="m75 0 22 66-68 81Z"/><path fill="#343d69" d="m0 65 29 82L0 234Z"/><path fill="#737694" d="m29 147 111-21v99l-77 83Z"/><path fill="#a1a0b2" d="m97 66 43 60-77 182Z"/><path fill="#525875" d="m29 147 34 161L0 234Z"/><path fill="#2e3b62" d="m0 234 63 74 77-83v475H0Z"/><path fill="#3e4e76" d="m0 340 140 23v337H0Z"/><path fill="#35456d" d="m140 363-83 142L0 417v283h140Z"/></g></svg>';
    u.el('div', 'desktop-signature', rail, 'Silicon\nGraphics\nIRIX');
    const shelf = u.el('nav', 'workstation-shelf', foot);
    shelf.setAttribute('aria-label', 'Workstation tools');
    [
      ['Applications', 'crystal'],
      ['Utilities', 'folder'],
      ['Text Tools', 'text'],
      ['System', 'system'],
      ['Display', 'display'],
      ['Media', 'media'],
      ['Print', 'print'],
    ].forEach(([label, kind]) => {
      const b = u.el('button', 'shelf-tool' + (kind === 'text' ? ' selected' : ''), shelf);
      b.type = 'button';
      b.innerHTML = icon(kind);
      u.el('span', '', b, label);
      b.addEventListener('click', () => env.log('decoy', { label }));
    });
    const badge = u.el('div', 'irix-crystal', shell.querySelector('.center'));
    badge.innerHTML = icon('crystal');
    const help = u.el('button', 'workstation-help', shell.querySelector('.center'));
    help.type = 'button';
    help.innerHTML = icon('help');
    u.el('span', '', help, 'Help');
    help.addEventListener('click', () => {
      env.log('decoy', { label: 'Help' });
      panel.hidden = !panel.hidden;
    });
    const panel = u.el('section', 'workstation-help-panel', shell);
    panel.hidden = true;
    u.el('strong', '', panel, 'Text Transfer Help');
    u.el('p', '', panel, 'Use the source text and follow the task instruction. Clear empties the text field.');
    const close = u.el('button', '', panel, 'Close');
    close.type = 'button';
    close.addEventListener('click', () => {
      panel.hidden = true;
    });
  }
  const palette = { bg: '#bfc1c5', panel: '#d2d3d6', fg: '#101326', muted: '#303747', line: '#777d88' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes share the workstation's dedicated central task area.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.instruction = _c.display;
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const toolbar = u.el('div', 'tools', head);
      cfg.tools.split(/\s{2,}/).forEach((t) => u.el('span', 'menu-item', toolbar, t));
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, toolbar, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'footer', _c.shell);
      u.el('span', 'ready', foot, 'Ready.');
      workstation(_c.ctx, _c.shell, foot);
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      _c.foot = foot;
      const clear = u.el('button', 'clear-text', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = _c.stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      clear.insertAdjacentHTML('afterbegin', icon('clear'));
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.center.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-unicode-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-unicode-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#514e9b'],
      LOW_ACCENTS: ['#514e9b'],
      parts,
    },
  });
})();
