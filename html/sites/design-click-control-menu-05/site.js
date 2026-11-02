// Modernist project workspace: the frame's visual sections on the shared site template.
(function () {
  'use strict';
  const cfg = {
    brand: 'NEXO',
    nav: ['Projects', 'Calendar', 'Files', 'Team'],
    notes: ['Workspace tools are grouped in menus.', 'Icons appear beside menu labels.', 'Project details are listed on the left.'],
  };
  const palette = { bg: '#fdfcf9', panel: '#fff', fg: '#05090c', muted: '#555a63', line: '#dadddd' };
  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      document.body.className = 'ref modernist';
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has room for its margin panel at every supported viewport.
      _c.display = _c.ctx.display;
      document.body.classList.remove('ref-has-note');
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const left = u.el('div', 'head-l', head);
      const logo = u.el('div', 'logo', left);
      const mark = u.el('span', 'logo-mark', logo);
      mark.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 5l7 7-7 7-7-7z" fill="#15171c"/></svg>';
      u.el('span', 'logo-text', logo, cfg.brand);
      const nav = u.el('nav', 'nav', left);
      cfg.nav.forEach((t, i) => u.el('span', 'nav-i' + (i === 0 ? ' on' : ''), nav, t));
      const hr = u.el('div', 'head-r', head);
      const search = u.el('div', 'search', hr);
      search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="7"/><path d="M16 16l5 5"/></svg><span>Search...</span>';
      // The template's header instruction and tools belong in this design's margin.
      const header = u.el('div');
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => () => {},
    'frame.controls': (base) => (_c) => {
      base(_c);
      const { endBtn, decoyBtn } = _c;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add('submit');
        if (cls === 'ref-endlink') button.classList.add('submit-link');
        else if (_c.placement === 'header' || _c.placement === 'icon') button.classList.add('submit-task');
        return button;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.classList.add('end-xtra');
      };
    },
    'frame.body': () => (_c) => {
      const { shell, util } = _c;
      const body = util.el('div', 'work', shell);
      const center = util.el('section', 'center', body);
      const aside = util.el('aside', 'inspector', body);
      Object.assign(_c, { body, center, aside });
    },
    'frame.panel': (base) => (_c) => {
      const { aside, ctx, display, header, headerTools, util: u } = _c;
      // Reuse the template's instruction sections, then apply the margin typography.
      const instruction = header.querySelector('.ref-instruction');
      if (instruction) {
        instruction.classList.add('instruction', 'instruction-header');
        instruction.dataset.display = display;
        aside.append(instruction);
      }
      base({ ..._c, body: aside });
      const panel = aside.querySelector('.ref-panel');
      if (panel) {
        const text = panel.querySelector('.ref-panel-text');
        text.classList.add('instruction', 'instruction-panel');
        text.dataset.display = display;
        panel.replaceWith(text);
      }
      if (display === 'hidden') {
        const note = u.el('div', 'instruction', aside);
        note.dataset.display = display;
        note.hidden = true;
      }
      const nt = u.el('div', 'notes', aside);
      u.el('h3', '', nt, 'Notes:');
      const ul = u.el('ul', '', nt);
      cfg.notes.forEach((t) => u.el('li', '', ul, t));
      const task = u.el('div', 'task', aside);
      u.el('h3', '', task, 'Your task:');
      u.el('p', '', task, ctx.display === 'hidden' ? 'Follow your workspace task.' : 'Follow the instruction above.');
      task.append(headerTools);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.aside.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) _c.aside.append(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.aside.append(dock);
    },
  };
  env.site({
    name: 'design-click-control-menu-05',
    langs: ['en'],
    template: 'site/base',
    design: {
      THEMES: { light: palette },
      LOW_THEME: palette,
      ACCENTS: ['#c5ff39'],
      LOW_ACCENTS: ['#c5ff39'],
      parts,
    },
  });
})();
