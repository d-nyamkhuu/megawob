(function () {
  'use strict';
  const C = {
    site: 'design-type-text-multi-12',
    title: 'Shipping Address',
    sub: 'Enter the delivery details below.',
    menu: 'File|Edit|Form|Window|Help',
    wmenu: 'File|Edit|View|Help',
  };
  const TRUCK =
    '<svg viewBox="0 0 130 80" width="130" height="80" fill="none" stroke="#000" stroke-width="4" stroke-linejoin="round"><path d="M4 6h74v52H4z"/><path d="M78 20h24l14 18v20H78z"/><path d="M88 26h12l8 10H88z" stroke-width="3"/><circle cx="26" cy="62" r="8" fill="#fff"/><circle cx="104" cy="62" r="8" fill="#fff"/><path d="M4 58h14M34 58h62" /></svg>';
  const DOC =
    '<svg viewBox="0 0 40 52" width="40" height="52" fill="#fff" stroke="#000" stroke-width="3"><path d="M3 3h24l10 10v36H3z"/><path d="M27 3v10h10" fill="none"/><rect x="10" y="11" width="4" height="4" stroke-width="2"/><path d="M10 22h20M10 29h20M10 36h20M10 43h20" stroke-width="2.5"/></svg>';
  const APPLE =
    '<svg viewBox="0 0 24 28" width="22" height="26"><path fill="#000" d="M17 15c0-3 2-4 3-5-1-2-3-3-5-3-2 0-3 1-4 1s-2-1-4-1c-3 0-6 3-6 7 0 5 3 11 6 11 2 0 2-1 4-1s2 1 4 1c2 0 4-3 5-6-2-1-3-2-3-4zM14 4c1-1 2-3 2-4-2 0-4 2-4 3-1 1-1 2-1 3 1 0 2-1 3-2z"/></svg>';
  // The desktop artwork is local; shared frame parts own episode behavior.
  const parts = {
    'frame.layout': (base) => function (_c) {
      base(_c);
      // This design already fits its task window at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.header': () => function (_c) {
      const { util: u, display } = _c;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const bar = u.el('nav', 'mac-bar', document.body);
      u.el('span', 'mac-apple', bar).innerHTML = APPLE;
      C.menu.split('|').forEach((t) => u.el('span', 'mac-mi', bar, t));
      u.el('span', 'mac-icon', bar).innerHTML =
        '<svg viewBox="0 0 24 26" width="22" height="24" fill="#fff" stroke="#000" stroke-width="2"><path d="M2 2h17l3 4v18H2z"/><path d="M19 2v4h3M5 6h6v7H5zM13 8h5v8h-5zM7 8v3m8 0v3M5 19h5v-4m4 4h5m-9 2h5" stroke-width="1.5"/></svg>';
      u.el('span', 'mac-clock', bar, '10:24 AM');
      const body = u.el('div', 'ref-body mac-desk', document.body);
      let brief = null;
      if (display === 'header' || display === 'panel') {
        const task = u.el('section', 'mac-win mac-task', body);
        const title = u.el('div', 'mac-title left', task);
        u.el('span', 'mac-ttl', title, 'Task');
        brief = u.el('aside', 'ds-brief', u.el('div', 'mac-wbody', task));
        u.el('div', 'ds-head', brief, 'Enter these values:');
      }
      const form = u.el('section', 'mac-win mac-form', body);
      const title = u.el('div', 'mac-title', form);
      u.el('span', 'mac-box', title);
      u.el('span', 'mac-ttl', title, C.title);
      u.el('span', 'mac-box r', title);
      const menu = u.el('div', 'mac-wmenu', form);
      C.wmenu.split('|').forEach((t) => u.el('span', 'mac-mi', menu, t));
      Object.assign(_c, { body, brief, form, menu, header: brief || u.el('div') });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        instruction.classList.add('ds-instruction');
        instruction.dataset.role = 'instruction';
      }
    },
    'frame.tools': (base) => function (_c) {
      // Use the template's controls and choices inside the window menu.
      const instructionHost = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = instructionHost;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => function (_c) {
      const { brief, util: u } = _c;
      if (!brief) return;
      base({ ..._c, body: brief });
      const instruction = brief.querySelector('.ref-panel-text');
      if (instruction) {
        instruction.classList.add('ds-instruction');
        instruction.dataset.role = 'instruction';
      }
      u.el('div', 'ds-help', brief, 'Use the form on the right.');
      u.el('div', 'ds-help', brief, 'Type the values into the matching fields.');
    },
    'frame.stage': () => function (_c) {
      const { form, util: u } = _c;
      const hd = u.el('div', 'mac-hd', form);
      u.el('span', 'mac-truck', hd).innerHTML = TRUCK;
      const text = u.el('div', '', hd);
      u.el('div', 'mac-h1', text, C.title);
      u.el('div', 'mac-h2', text, C.sub);
      _c.stage = u.el('main', 'ds-stage', form);
    },
    'frame.footer': (base) => function (_c) {
      const { form, util: u, decoyBtn } = _c;
      const foot = u.el('footer', 'ds-footer', form);
      decoyBtn(foot, 'Preview Address');
      const preview = foot.lastElementChild;
      preview.className = 'mac-preview';
      preview.textContent = '';
      u.el('span', '', preview).innerHTML = DOC;
      u.el('span', '', preview, 'Preview Address');
      const right = u.el('span', 'mac-right', foot);
      decoyBtn(right, 'Clear');
      right.lastElementChild.className = 'mac-btn';
      base(_c);
      const sharedFooter = document.body.querySelector(':scope > .ref-foot');
      if (sharedFooter) right.append(sharedFooter);
      Object.assign(_c, { foot, right });
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.body.querySelector(':scope > .ref-float-dock');
      if (dock) _c.right.append(dock);
    },
  };

  const MONO = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#222', line: '#000' };
  env.site({
    name: C.site,
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      THEMES: { light: MONO }, LOW_THEME: MONO,
      ACCENTS: ['#000'], LOW_ACCENTS: ['#000'], LANGS: ['en'],
      parts,
    },
  });
})();
