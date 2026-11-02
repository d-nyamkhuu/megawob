// Vista notebook chrome on the shared site frame; the widget retains its pie styling.
(function () {
  'use strict';
  const cfg = { title: 'Notebook - Tasks', tabs: ['Tasks', 'Notes', 'Projects', 'References', 'Archive'] };

  function styleTools(tools) {
    for (const control of tools.children) {
      control.classList.add(control.dataset.role === 'submit'
        ? (control.classList.contains('ref-endlink') ? 'end-link' : 'submit')
        : 'xtra');
    }
  }

  const parts = {
    'frame.theme': () => function (_c) {
      const { rng, util, content } = _c.ctx;
      document.body.className = 'ref vista';
      Object.assign(_c, { rng, util, content });
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      // The notebook always has an action strip, including when the end control is elsewhere.
      _c.wantFooter = true;
    },
    'frame.header': () => function (_c) {
      const u = _c.util;
      const win = u.el('main', 'win', document.body);
      const tb = u.el('header', 'titlebar', win);
      const ico = u.el('span', 'tb-icon', tb);
      ico.innerHTML =
        '<svg viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#faf8ff" stroke="#8a8cac"/><path d="M12.5 4.5H7Q5.5 4.5 5.5 6v8Q5.5 15.5 7 15.5h6l-1.5-3 1.5-2-1.5-2Z" fill="#dce9f4" stroke="#6285a4" stroke-width="1.5"/><path d="M9 6v4l2 2" fill="none" stroke="#8799af" stroke-width="1.2"/></svg>';
      u.el('span', 'tb-title', tb, cfg.title);
      const wc = u.el('span', 'wincontrols', tb);
      wc.innerHTML =
        '<i class="min"><svg viewBox="0 0 16 16"><path d="M3 12h9" stroke="#fff" stroke-width="2.4"/></svg></i><i class="max"><svg viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="9" fill="none" stroke="#fff" stroke-width="2"/></svg></i><i class="cls"><svg viewBox="0 0 16 16"><path d="m3.5 3.5 9 9M12.5 3.5l-9 9" stroke="#fff" stroke-width="2.4"/></svg></i>';
      const nb = u.el('div', 'nb', win);
      const sheet = u.el('section', 'sheet', nb);
      const tabs = u.el('nav', 'tabs', nb);
      cfg.tabs.forEach((t, i) => {
        const tab = u.el('div', 'tab t' + i + (i === 0 ? ' on' : ''), tabs);
        u.el('span', '', tab, t);
      });
      const sp = u.el('div', 'spiral', nb);
      for (let i = 0; i < 22; i++) u.el('i', '', sp);
      u.el('h1', 'pg-title', sheet, 'Task');
      sheet.dataset.display = _c.display;
      Object.assign(_c, { sheet, header: sheet });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      base(_c);
      const note = _c.sheet.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'header';
      } else _c.sheet.querySelector('.ref-spacer').remove();
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.headerTools.classList.add('header-tools');
      styleTools(_c.headerTools);
    },
    'frame.body': () => function (_c) {
      // The paper itself is the content column; the colored notebook tabs replace generic navigation.
      _c.body = _c.sheet;
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.sheet.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        panel.dataset.display = 'panel';
      }
    },
    'frame.stage': () => function (_c) {
      _c.stage = _c.util.el('div', 'stage', _c.sheet);
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.querySelector('.ref-note');
        note.className = 'instruction instruction-toast';
        note.dataset.display = 'toast';
        _c.sheet.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const u = _c.util;
      const foot = document.querySelector('.ref-foot');
      foot.className = 'foot';
      foot.querySelector('.ref-foot-text').remove();
      const tools = foot.querySelector('.ref-tools');
      tools.classList.add('foot-tools');
      styleTools(tools);
      const reset = u.el('button', 'reset', foot);
      reset.type = 'button';
      reset.title = 'Reset menu view';
      reset.innerHTML =
        '<svg viewBox="0 0 20 20"><path d="M16 10a6 6 0 1 1-2-4.5" fill="none" stroke="#1b3d6e" stroke-width="2.4" stroke-linecap="round"/><path d="M11 1.5 16 5.5 10.5 8Z" fill="#1b3d6e"/></svg>';
      u.el('span', '', reset, 'Reset');
      foot.prepend(reset);
      _c.sheet.appendChild(foot);
      _c.footTools = tools;
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      if (_c.placement === 'floating') {
        const dock = _c.submit.parentElement;
        dock.className = 'end-dock';
        _c.submit.classList.add('submit');
        _c.footTools.appendChild(dock);
      }
    },
  };

  env.site({
    name: 'design-click-control-pie-10',
    template: 'site/base',
    design: { parts },
  });
})();
