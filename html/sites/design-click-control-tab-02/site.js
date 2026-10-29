// The Windows desktop chrome is a design on the shared frame.
(function () {
  'use strict';

  function desktop(u) {
    const desktop = u.el('div', 'desktop-icons', document.body);
    const iconArt = [
      '<path d="M15 3 44 1 44 32 12 34 12 6Z" fill="url(#case)" stroke="#202526" stroke-width="2"/><path d="M15 6 42 4 42 29 15 31Z" fill="#fff"/><path d="M18 8 39 7 39 27 17 28Z" fill="#171a24"/><path d="M21 11 37 10 37 24 20 25Z" fill="#143fa0"/><path d="m22 20 4-6 3 4 4-3 2 6H22Z" fill="#58b32c"/><path d="M24 13h10v2H24Z" fill="#b7c7ef"/><path d="M11 34 46 32 46 45 7 47Z" fill="url(#case)" stroke="#202526" stroke-width="2"/><path d="M13 37h18v4H13Z" fill="#8e9088"/><path d="M37 37h6" stroke="#333" stroke-width="2"/><path d="M7 47 46 45 51 54 2 55Z" fill="#d8d9cc" stroke="#222" stroke-width="2"/><path d="M10 49h33M7 51h39M14 48v4M19 48v4M24 48v4M29 48v4M34 48v4M39 48v4" stroke="#74786c" stroke-width="1"/>',
      '<path d="M3 12h19l5 6h26v34H3Z" fill="#e6d65e" stroke="#6a652c" stroke-width="2"/><path d="M4 19h48v31H4Z" fill="url(#folder)"/><path d="M5 20h46" stroke="#fff7ba" stroke-width="2"/><path d="M5 15h16l4 5" fill="none" stroke="#fff7ba" stroke-width="2"/>',
      '<g transform="translate(0 0) scale(.7)"><path d="M15 3 44 1 44 32 12 34 12 6Z" fill="url(#case)" stroke="#202526" stroke-width="2"/><path d="M15 6 42 4 42 29 15 31Z" fill="#fff"/><path d="M18 8 39 7 39 27 17 28Z" fill="#171a24"/><path d="M21 11 37 10 37 24 20 25Z" fill="#143fa0"/><path d="m22 20 4-6 3 4 4-3 2 6H22Z" fill="#58b32c"/><path d="M24 13h10v2H24Z" fill="#b7c7ef"/><path d="M11 34 46 32 46 45 7 47Z" fill="url(#case)" stroke="#202526" stroke-width="2"/><path d="M13 37h18v4H13Z" fill="#8e9088"/><path d="M37 37h6" stroke="#333" stroke-width="2"/><path d="M7 47 46 45 51 54 2 55Z" fill="#d8d9cc" stroke="#222" stroke-width="2"/><path d="M10 49h33M7 51h39M14 48v4M19 48v4M24 48v4M29 48v4M34 48v4M39 48v4" stroke="#74786c" stroke-width="1"/></g><g transform="translate(16 17) scale(.7)"><path d="M15 3 44 1 44 32 12 34 12 6Z" fill="url(#case)" stroke="#202526" stroke-width="2"/><path d="M15 6 42 4 42 29 15 31Z" fill="#fff"/><path d="M18 8 39 7 39 27 17 28Z" fill="#171a24"/><path d="M21 11 37 10 37 24 20 25Z" fill="#143fa0"/><path d="m22 20 4-6 3 4 4-3 2 6H22Z" fill="#58b32c"/><path d="M24 13h10v2H24Z" fill="#b7c7ef"/><path d="M11 34 46 32 46 45 7 47Z" fill="url(#case)" stroke="#202526" stroke-width="2"/><path d="M13 37h18v4H13Z" fill="#8e9088"/><path d="M37 37h6" stroke="#333" stroke-width="2"/><path d="M7 47 46 45 51 54 2 55Z" fill="#d8d9cc" stroke="#222" stroke-width="2"/><path d="M10 49h33M7 51h39M14 48v4M19 48v4M24 48v4M29 48v4M34 48v4M39 48v4" stroke="#74786c" stroke-width="1"/></g>',
      '<path d="M10 15 46 18 41 49Q32 57 16 50Z" fill="url(#case)" stroke="#323d3a" stroke-width="2"/><path d="m14 16 6 33M22 17l2 34M31 17v35M39 16l-3 36" stroke="#737d73" stroke-width="3"/><path d="M8 12 12 7 22 5 36 6 47 11 49 15 45 19 30 21 12 17Z" fill="#ced6c9" stroke="#33463b" stroke-width="2"/><path d="M12 11 22 7 36 9 43 12 30 17Z" fill="#657c63"/><path d="m30 21-1 30" stroke="#f7faf4" stroke-width="2"/>',
    ];
    ['Program Manager', 'My Documents', 'Network Neighborhood', 'Recycle Bin'].forEach((t, i) => {
      const icon = u.el('div', '', desktop);
      icon.innerHTML =
        '<svg viewBox="0 0 56 56" stroke-linejoin="round"><defs><linearGradient id="case"><stop stop-color="#fff"/><stop offset=".5" stop-color="#bbbcb4"/><stop offset="1" stop-color="#777"/></linearGradient><linearGradient id="folder" x2="0" y2="1"><stop stop-color="#fff8a4"/><stop offset="1" stop-color="#d1c64f"/></linearGradient></defs>' +
        iconArt[i] +
        (i === 3
          ? '<path d="m17 23 4 1-1 7-3-1Z" fill="#51a349" stroke="none"/><path d="m18 32 3 2-1 7-3-2Z" fill="#66ad59" stroke="none"/><path d="m12 20 4 2 4 26M27 24l1 27M36 23l-2 29M43 23l-4 27" stroke="#fafafa" stroke-width="2" fill="none"/>'
          : '') +
        '</svg>';
      u.el('span', '', icon, t);
    });
    const taskbar = u.el('div', 'desktop-taskbar', document.body);
    u.el('span', 'start', taskbar, 'Start');
    u.el('span', '', taskbar, 'Knowledge Ledger');
    u.el('span', 'clock', taskbar, '10:24 AM');
  }

  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      document.body.className = 'ref win92 ledger';
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The detached preview needs the same compact fallback as the original frame.
      if (_c.display === 'panel' && _c.H < 700) _c.display = 'header';
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      desktop(util);
      const shell = util.el('main', 'shell', document.body);
      const head = util.el('header', 'head', shell);
      const title = util.el('div', 'title', head, 'Knowledge Ledger');
      const controls = util.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const header = util.el('div', 'tools', head, 'File    Edit    View    Tools    Help');
      const work = util.el('div', 'work ref-body', shell);
      const center = util.el('section', 'center', work);
      Object.assign(_c, { shell, header, work, center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.center });
      const note = _c.center.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'header';
      }
    },
    'frame.controls': (base) => (_c) => {
      base(_c);
      const { endBtn, decoyBtn, header } = _c;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add(cls === 'ref-endlink' ? 'submit-link' : 'submit');
        if (header.contains(parent)) button.classList.add('toolbar-submit');
        return button;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.classList.add('submit-xtra');
      };
    },
    'frame.body': () => (_c) => {
      const { util, work, center } = _c;
      const aside = util.el('aside', 'inspector', work);
      const title = util.el('h2', '', aside, 'Link Preview');
      const controls = util.el('span', 'preview-controls', title);
      controls.innerHTML = '<i>−</i><i>×</i>';
      const preview = util.el('div', 'inspector-body', aside);
      util.el('p', '', preview, 'No link selected.');
      util.el('p', '', preview, 'Click a link to see a preview here.');
      _c.body = center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        panel.dataset.display = 'panel';
      }
    },
    frameAlign: () => () => {},
    'frame.stage': (base) => (_c) => {
      base(_c);
      _c.stage.classList.add('stage');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.center.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot') || _c.util.el('footer', 'ref-foot');
      foot.classList.add('footer');
      _c.shell.append(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.foot.append(dock);
    },
  };

  env.site({
    name: 'design-click-control-tab-02',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: { parts },
  });
})();
