// The kinetic sheet keeps its three bands on the shared site frame.
(function () {
  'use strict';

  function styleInstruction(note, display) {
    note.classList.add('instruction');
    note.dataset.display = display;
    if (display !== 'header') note.classList.add('instruction-' + display);
    const text = note.textContent;
    note.textContent = '';
    for (const part of text.split(/(\b\d+(?:st|nd|rd|th)\b)/)) {
      if (/^\d+(?:st|nd|rd|th)$/.test(part)) {
        const ordinal = document.createElement('span');
        ordinal.className = 'ord';
        ordinal.textContent = part;
        note.appendChild(ordinal);
      } else note.appendChild(document.createTextNode(part));
    }
  }

  function fitInstruction(note, header, hasControl) {
    let size = parseFloat(getComputedStyle(note).fontSize);
    const range = document.createRange();
    range.selectNodeContents(note);
    const box = header.getBoundingClientRect();
    for (let i = 0; i < 30; i++) {
      const bounds = range.getBoundingClientRect();
      if (note.scrollHeight <= header.clientHeight * 0.84 &&
          bounds.left >= box.left + box.width * 0.12 &&
          bounds.right <= box.right - box.width * (hasControl ? 0.22 : 0.12) &&
          bounds.top >= box.top + 4 && bounds.bottom <= box.bottom - 4) break;
      size *= 0.92;
      note.style.setProperty('--note-size', size + 'px');
    }
    range.detach();
  }

  env.site({
    name: 'design-click-control-focus-10',
    template: 'site/base',
    styles: ['site.css', 'kinetic.css'],
    design: {
      THEMES: { kinetic: { bg: '#f5f6f8', panel: '#fff', fg: '#18233b', muted: '#6b7280', line: '#bccada' } },
      LOW_THEME: { bg: '#f5f6f8', panel: '#fff', fg: '#18233b', muted: '#6b7280', line: '#bccada' },
      ACCENTS: ['#0050f0'],
      LOW_ACCENTS: ['#0050f0'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The sheet has room for its side panel and header toast at every viewport.
          _c.display = _c.ctx.display;
          document.body.className = 'ref kin';
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const shell = util.el('main', 'shell', document.body);
          const header = util.el('header', 'head', shell);
          util.el('span', 'k-task', header, 'TASK');
          const tag = util.el('span', 'k-tag', header);
          for (const line of ['SIMPLE', 'ACTIONS', 'REAL', 'RESULTS']) util.el('span', '', tag, line);
          util.el('i', '', tag);
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) styleInstruction(note, 'header');
        },
        'frame.body': () => (_c) => {
          const work = _c.util.el('div', 'work ref-body', _c.shell);
          const body = _c.util.el('section', 'center', work);
          Object.assign(_c, { work, body });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('task-panel');
            const heading = panel.querySelector('.ref-panel-title');
            heading.classList.add('panel-label');
            heading.textContent = 'TASK';
            styleInstruction(panel.querySelector('.ref-panel-text'), 'panel');
            _c.work.appendChild(panel);
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('div', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            _c.header.appendChild(note);
            note.classList.add('kin-note');
            styleInstruction(note.querySelector('.ref-note-text'), 'toast');
          }
        },
        'frame.footer': (base) => (_c) => {
          // The dark footer is part of the design even when its controls are elsewhere.
          _c.wantFooter = true;
          base(_c);
          const foot = document.querySelector('.ref-foot');
          foot.classList.add('footer');
          _c.shell.appendChild(foot);
          foot.querySelector('.ref-foot-text').remove();
          const ready = _c.util.el('span', 'ready', foot);
          for (const line of ['READY', 'WHEN', 'YOU ARE']) _c.util.el('span', '', ready, line);
          _c.util.el('i', '', ready);
          if (_c.submit && foot.contains(_c.submit)) foot.appendChild(_c.submit);
          const tools = foot.querySelector('.ref-tools');
          // Keep the narrow header available for the large instruction.
          for (const decoy of _c.headerTools.querySelectorAll('.ref-xtra')) tools.appendChild(decoy);
          Object.assign(_c, { foot });
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.foot.appendChild(dock);
        },
        'frame.end': (base) => (_c) => {
          const { display, header, placement, shell, submit } = _c;
          shell.dataset.end = placement || 'none';
          if (submit) {
            submit.classList.add('submit', 'end-' + placement);
            if (placement === 'icon') submit.classList.add('end-header');
          }
          if (display === 'header') {
            fitInstruction(header.querySelector('.instruction'), header,
              placement === 'header' || placement === 'icon');
          }
          return base(_c);
        },
      },
    },
  });
})();
