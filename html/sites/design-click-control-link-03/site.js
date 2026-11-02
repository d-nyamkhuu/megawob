(function () {
  'use strict';
  const cfg = { title: 'Readme.txt', menus: ['Desk', 'File', 'Edit', 'Search', 'Options', 'Help'], clock: '10:24 AM' };
  let iconId = 0;
  const S = (p) => {
    const id = 'gem-icon-' + iconId++;
    return (
      '<svg viewBox="0 0 48 48" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="miter" stroke-linecap="square"><defs><pattern id="' +
      id +
      '" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M-1 1 1-1M0 3 3 0M2 4 4 2" stroke="#aaa" stroke-width=".55"/></pattern></defs>' +
      p.replaceAll('HATCH', 'url(#' + id + ')') +
      '</svg>'
    );
  };
  const tools = [
    [
      'Open',
      S(
        '<path d="M6 15V10h16l3 6" fill="#eee"/><path d="M3 17h40v24H3Z" fill="#eee"/><path d="M6 20h34v18H6Z" fill="HATCH" stroke="#777" stroke-width="1"/><path d="M7 12h13" stroke="#fff"/>',
      ),
    ],
    [
      'New',
      S(
        '<path d="M9 3h20l10 10v30H9Z" fill="#eee"/><path d="M29 3v11h10M15 11h10M15 19h17M15 26h17M15 33h17M15 39h17" stroke="#888" stroke-width="1"/><path d="M11 5v36" stroke="#fff"/>',
      ),
    ],
    [
      'Save',
      S(
        '<path d="M5 3h32l5 5v35H5Z" fill="#ddd"/><path d="M11 3v15h24V3M12 43V28h23v15" fill="#eee"/><path d="M26 6h5v9h-5Z" fill="#ccc" stroke-width="1"/><path d="M7 5v36M14 30h18" stroke="#fff" stroke-width="1"/><path d="M16 32h15v8H16Z" fill="HATCH" stroke="none"/>',
      ),
    ],
    [
      'Find',
      S(
        '<path d="m29 30 13 13" stroke="#eee" stroke-width="9"/><path d="m29 30 13 13" stroke="#111" stroke-width="6"/><circle cx="20" cy="19" r="14" fill="#eee"/><circle cx="20" cy="19" r="11" fill="HATCH" stroke="#fff" stroke-width="1"/>',
      ),
    ],
    [
      'Print',
      S(
        '<path d="M13 3h21v15H13Z" fill="#eee"/><path d="M16 5h15v11H16Z" fill="HATCH" stroke="none"/><path d="M5 15h36v20H5Z" fill="#eee"/><path d="M8 18h30v14H8Z" fill="HATCH" stroke="#777" stroke-width="1"/><path d="M12 28h23v15H12Z" fill="#eee"/><path d="M15 31h17v10H15Z" fill="#d9e7e9" stroke="#537986" stroke-width="1"/><path d="M17 34h13M17 37h13M17 40h13" stroke="#537986" stroke-width=".8"/><path d="M10 20h3"/>',
      ),
    ],
  ];
  const palette = { bg: '#ccc', panel: '#efefef', fg: '#111', muted: '#333', line: '#111' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'gem');
      const shell = u.el('main', 'shell', document.body);
      const bar = u.el('header', 'menubar', shell);
      cfg.menus.forEach((m) => u.el('span', 'menu', bar, m));
      u.el('span', 'sp', bar);
      u.el('span', 'clock-ic', bar);
      u.el('span', 'clock', bar, cfg.clock);
      const desk = u.el('div', 'desk', shell);
      const win = u.el('section', 'window', desk);
      const tb = u.el('div', 'titlebar', win);
      u.el('i', 'gadget close', tb).innerHTML = '<b></b>';
      u.el('span', 'hatch', tb);
      u.el('span', 'wtitle', tb, cfg.title);
      u.el('span', 'hatch', tb);
      u.el('i', 'gadget full', tb).innerHTML = '<b></b>';
      const body = u.el('div', 'wbody', win);
      const center = u.el('div', 'center', body);
      center.dataset.display = _c.display;
      const sb = u.el('div', 'vscroll', body);
      u.el('i', 'arr up', sb);
      u.el('div', 'vtrack', sb).innerHTML = '<b></b>';
      u.el('i', 'arr down', sb);
      const dock = u.el('footer', 'footer', shell);
      const strip = u.el('div', 'strip', dock);
      tools.forEach((t) => {
        const b = u.el('div', 'tool', strip);
        b.innerHTML = t[1];
        u.el('span', '', b, t[0]);
      });
      Object.assign(_c, { shell, center, body, dock, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        const text = _c.util.el('span', 'instruction-text');
        text.textContent = note.textContent;
        note.replaceChildren(text);
        let size = parseFloat(getComputedStyle(note).fontSize);
        const ns = getComputedStyle(note);
        const room = note.clientHeight - parseFloat(ns.paddingTop) - parseFloat(ns.paddingBottom);
        while (text.getBoundingClientRect().height > room + 1 && size > 18) {
          note.style.fontSize = --size + 'px';
        }
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.dock;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) panel.classList.add('instruction', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.dock.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
      if (_c.submit) {
        const divider = _c.util.el('span', 'vsep');
        _c.submit.parentNode.insertBefore(divider, _c.submit);
      }
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
    name: 'design-click-control-link-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-link-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0a2a9c'],
      LOW_ACCENTS: ['#0a2a9c'],
      parts,
    },
  });
})();
