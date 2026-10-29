// Motif workstation design on the shared frame; task mechanics stay in the widget.
(function () {
  'use strict';

  // Keep the template's controls and events, applying only this design's button classes.
  function styleControls(parent) {
    for (const button of parent.querySelectorAll('.ref-xtra')) button.classList.add('motif-xtra');
    for (const button of parent.querySelectorAll('.ref-submit')) {
      button.classList.add(parent.classList.contains('mbar') ? 'motif-end' : 'mbtn', 'submit');
    }
    for (const link of parent.querySelectorAll('.ref-endlink')) link.classList.add('motif-link');
  }

  const motif = { bg: '#bdbab3', panel: '#bdbab3', fg: '#111', muted: '#4a4944', line: '#77756e' };
  const parts = {
    'frame.header': () => function (_c) {
      const { util: u } = _c;
      document.body.className = 'ref motif';
      const shell = u.el('main', 'shell', document.body);
      const title = u.el('div', 'mtitle', shell);
      const sys = u.el('span', 'sysmenu', title);
      u.el('i', '', sys);
      u.el('span', 'mtitle-t', title, 'Menu Practice – /usr/local/share/tasks/pie_menu');
      const wc = u.el('span', 'mctl', title);
      wc.innerHTML =
        '<b><svg viewBox="0 0 16 16"><path d="M3 12h8"/></svg></b><b><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></b><b><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></b>';
      const mb = u.el('div', 'mbar', shell);
      ['File', 'Edit', 'View', 'Options'].forEach((t) => {
        const s = u.el('span', 'mi', mb);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      const hp = u.el('span', 'mi help', mb);
      hp.innerHTML = '<u>H</u>elp';
      const info = u.el('div', 'minfo', shell);
      const ic = u.el('div', 'minfo-icon', info);
      ic.innerHTML =
        '<svg viewBox="0 0 48 44"><path d="M4 37V9l5-6h12l5 4h15v30Z" fill="#a7a59e" stroke="#111" stroke-width="2"/><path d="M6 11h34l3-4h-17l-5-4H10L6 8Z" fill="#d0cec8" stroke="#111" stroke-width="1.5"/><path d="M3 40V14h42l-4 26Z" fill="#989792" stroke="#111" stroke-width="2"/><path d="M5 15h37M5 17v21" fill="none" stroke="#eee" stroke-width="1.5"/></svg>';
      const txt = u.el('div', 'minfo-t', info);
      const l1 = u.el('div', '', txt);
      u.el('b', '', l1, 'Task:');
      l1.append('  Menu Practice');
      u.el('div', '', txt, 'Use the pie menu to select the requested item.');
      Object.assign(_c, { shell, mb, header: mb });
    },
    'frame.nav': () => () => {},
    // Instructions belong inside the recessed work area, which is built after the menu tools.
    'frame.instruction': (base) => function (_c) {
      _c.drawInstruction = base;
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      styleControls(_c.header);
    },
    'frame.body': () => function (_c) {
      const { util, shell, drawInstruction } = _c;
      const body = util.el('div', 'work ref-body', shell);
      const well = util.el('div', 'well', body);
      const center = util.el('section', 'center', well);
      drawInstruction({ ..._c, header: center });
      const note = center.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
      const sb = util.el('div', 'vsb', well);
      util.el('i', 'up', sb);
      util.el('div', 'thumb', sb);
      util.el('i', 'dn', sb);
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('instruction-panel');
    },
    'frame.stage': () => function (_c) {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.footer': (base) => function (_c) {
      const { util, shell } = _c;
      const act = util.el('fieldset', 'actions', shell);
      util.el('legend', '', act, 'Actions');
      const reset = util.el('button', 'mbtn', act, 'Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
      util.el('span', 'sp', act);
      const cancel = util.el('button', 'mbtn', act, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      base(_c);
      const foot = document.body.querySelector(':scope > .ref-foot');
      if (foot) act.append(foot);
      styleControls(act);
      Object.assign(_c, { act });
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.body.querySelector(':scope > .ref-float-dock');
      if (dock) _c.act.append(dock);
      styleControls(_c.act);
    },
  };

  env.site({
    name: 'design-click-control-pie-03',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { motif },
      LOW_THEME: motif,
      ACCENTS: ['#384570'],
      LOW_ACCENTS: ['#384570'],
      parts,
    },
  });
})();
