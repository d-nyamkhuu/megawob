// NEXTSTEP frame sections on the shared site template.
(function () {
  'use strict';

  const gray = { bg: '#a8a8a8', panel: '#c4c4c4', fg: '#111', muted: '#444', line: '#555' };
  const styleTools = (tools) => {
    for (const button of tools.children) {
      button.classList.add(button.dataset.role === 'submit' ? 'end-action' : 'end-xtra');
    }
  };

  env.site({
    name: 'design-click-control-sequence-09',
    template: 'site/base',
    styles: ['../base/site.css', 'ns.css'],
    langs: ['en'],
    design: {
      THEMES: { gray }, LOW_THEME: gray, ACCENTS: ['#222'], LOW_ACCENTS: ['#222'],
      parts: {
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          document.body.className = 'ref ns';
          const shell = u.el('main', 'shell', document.body);
          const mb = u.el('header', 'menubar', shell);
          mb.innerHTML = '<svg class="logo" viewBox="0 0 30 36"><path d="M15 2 27 9v19l-12 6L1 27V10Z" fill="#070707" stroke="#888"/><path d="m1 10 14 7 12-8M15 17v17M8 6l8 3 5-6-9-2Z" fill="none" stroke="#aaa"/><path d="m13 6 4-3-1 5m4 15 4-4-1 7m-12-6 3-2-1 6" fill="none" stroke="#aaa"/></svg>';
          for (const s of ['Workspace', 'File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', 'm', mb, s);
          u.el('span', 'clock', mb, 'Mon Apr 12  10:24 AM');
          const header = u.el('div', 'titlebar', shell);
          u.el('span', 'wc', header).innerHTML = '<i><svg viewBox="0 0 20 20"><path d="M4 16V5h12v3H9v8Z" fill="#333"/><path d="m5 15 8-8M4 5h12" stroke="#eee"/></svg></i><i></i><i><svg viewBox="0 0 20 20"><path d="m5 16 3-9 8-3-3 9-3-3Z" fill="#333"/><path d="m5 16 5-6" stroke="#eee"/></svg></i>';
          u.el('span', '', header, 'Task Window');
          const panes = u.el('div', 'panes', shell);
          const left = u.el('section', 'pane task', panes);
          u.el('h2', '', left, 'Task');
          const center = u.el('div', 'center', left);
          Object.assign(_c, { shell, header, panes, center });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.center });
          const note = _c.center.querySelector('.ref-instruction');
          if (note) note.className = 'instruction';
          _c.center.querySelector('.ref-spacer')?.remove();
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.className = 'title-tools';
          styleTools(_c.headerTools);
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          const { util: u, panes } = _c;
          const right = u.el('section', 'pane details', panes);
          u.el('h2', '', right, 'Details');
          const det = u.el('div', 'det', right);
          base({ ..._c, body: det });
          const note = det.querySelector('.ref-panel');
          if (note) {
            note.className = 'instruction instruction-panel';
            note.querySelector('.ref-panel-title').remove();
          }
          const rows = (data) => {
            for (const [label, text] of data) {
              const row = u.el('div', 'row', det);
              u.el('b', '', row, label);
              u.el('span', '', row, text);
            }
          };
          rows([['Task:', 'Button workspace.'], ['Controls:', 'Mouse input'], ['Note:', 'Click a button to record an action.']]);
          u.el('hr', '', det);
          u.el('h3', '', det, 'Status').style.fontWeight = '700';
          rows([['Status:', 'Not started'], ['Last action:', 'None']]);
          u.el('hr', '', det);
          u.el('h3', '', det, 'Log').style.fontWeight = '700';
          const log = u.el('div', 'log', det);
          u.el('span', 'log-text', log, 'No actions yet.');
          log.insertAdjacentHTML('beforeend', '<span class="sb"><i style="top:0">▲</i><i style="bottom:0">▼</i></span>');
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('div', 'stage', _c.center);
        },
        'frame.footer': (base) => (_c) => {
          // The status bar is permanent; the template owns its controls and decoys.
          base(_c);
          let foot = document.querySelector('.ref-foot');
          if (!foot) {
            foot = _c.util.el('footer', 'ref-foot', _c.shell);
            _c.util.el('span', 'ref-foot-text', foot);
            _c.util.el('div', 'ref-tools', foot);
          }
          foot.className = 'statusbar';
          _c.shell.appendChild(foot);
          const ready = foot.querySelector('.ref-foot-text');
          ready.className = 'ready';
          ready.textContent = 'Ready.';
          const tools = foot.querySelector('.ref-tools');
          styleTools(tools);
          const link = tools.querySelector('.ref-endlink');
          if (link) link.classList.add('end-link');
          if (_c.placement === 'footer') {
            _c.center.appendChild(_c.submit);
            _c.submit.className = 'submit stage-submit';
          }
          const note = document.querySelector('.ref-note');
          if (note) {
            ready.hidden = true;
            note.classList.add('instruction', 'instruction-toast');
            foot.insertBefore(note, tools);
          }
          _c.util.el('span', 'task-runner', foot, 'Task Runner');
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          if (_c.placement === 'floating') {
            const dock = _c.submit.parentElement;
            _c.center.appendChild(_c.submit);
            _c.submit.className = 'submit stage-submit';
            dock.remove();
          }
        },
      },
    },
  });
})();
