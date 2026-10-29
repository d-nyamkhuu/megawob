// CAD frame design on templates/site/base.js; shared controls and episode UI come from the template.
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const DRAWING =
    '<svg class="draft" viewBox="0 0 1250 732" preserveAspectRatio="none" xmlns="' +
    NS +
    '">' +
    '<defs><pattern id="g" width="27.5" height="27.5" patternUnits="userSpaceOnUse"><path d="M27.5 0H0V27.5" fill="none" stroke="#254050" stroke-opacity=".55" stroke-width=".7"/></pattern>' +
    '<pattern id="major" width="110" height="110" patternUnits="userSpaceOnUse"><rect width="110" height="110" fill="url(#g)"/><path d="M110 0H0V110" fill="none" stroke="#365263" stroke-opacity=".35" stroke-width="1"/></pattern><marker id="ar" markerWidth="10" markerHeight="4" refX="9" refY="2" orient="auto-start-reverse"><path d="M0 0L10 2L0 4Z" fill="#9ff0f5"/></marker></defs>' +
    '<rect width="1250" height="732" fill="url(#major)"/>' +
    '<g fill="none" stroke="#8fe9f3" stroke-width="2.2">' +
    '<path d="M183 291V528H665V260Q665 160 550 160Q520 160 495 170L183 290"/>' +
    '<circle cx="550" cy="283" r="71"/><circle cx="250" cy="460" r="40"/><circle cx="586" cy="460" r="40"/></g>' +
    '<g fill="none" stroke="#9ff0f5" stroke-width="1.4">' +
    '<path d="M183 290V105M665 245V105"/><path d="M183 108H665" marker-start="url(#ar)" marker-end="url(#ar)"/>' +
    '<path d="M124 295H183M124 526H183"/><path d="M141 295V526" marker-start="url(#ar)" marker-end="url(#ar)"/>' +
    '<path d="M600 283H706M620 412H706"/><path d="M701 283V412" marker-start="url(#ar)" marker-end="url(#ar)"/>' +
    '<path d="M345 528V570M510 528V570"/><path d="M345 565H510" marker-start="url(#ar)" marker-end="url(#ar)"/>' +
    '<path d="M550 130V420" stroke-dasharray="26 8 4 8"/><path d="M440 283H680" stroke-dasharray="26 8 4 8"/>' +
    '<path d="M250 420V500M210 460H290M586 420V500M546 460H626" stroke-width="1"/>' +
    '<path d="M358 401H316L283 434M730 505H680L623 476" stroke-width="1.2" marker-end="url(#ar)"/></g>' +
    '<g fill="#ffe81a"><rect x="199" y="455" width="9" height="9"/><rect x="293" y="455" width="9" height="9"/><rect x="246" y="408" width="9" height="9"/><rect x="246" y="502" width="9" height="9"/>' +
    '<rect x="535" y="455" width="9" height="9"/><rect x="629" y="455" width="9" height="9"/><rect x="582" y="408" width="9" height="9"/><rect x="582" y="502" width="9" height="9"/></g>' +
    '<g fill="#a6f0f7" font-family="Arial,sans-serif" font-size="22" text-anchor="middle">' +
    '<text x="424" y="96">120</text><text x="104" y="424">80</text><text x="727" y="357">40</text><text x="428" y="593">60</text>' +
    '<text x="336" y="391">ø20</text><text x="711" y="489">ø20</text></g>' +
    '<g fill="#a6f0f7" font-family="Arial,sans-serif" font-size="19"><text x="20" y="32">Top  |  2D Wireframe</text>' +
    '<text x="33" y="628">Y</text><text x="128" y="704">X</text></g>' +
    '<path d="M40 634V696H121" stroke="#9ff0f5" fill="none" stroke-width="1.3"/><rect x="33" y="689" width="14" height="14" fill="none" stroke="#9ff0f5"/>' +
    '<path class="draft-pointer" d="M1138 438v31l8-7 7 15 6-3-7-15 10-1Z" fill="#fff" stroke="#07111b" stroke-width="2" stroke-linejoin="round" pointer-events="none"/>' +
    '</svg>';
  const ICONS = [
    '<path fill="#ead47b" d="M2 18V5h7l2 3h9l-3 10z"/><path fill="#f8e799" d="M2 18 5 9h15l-3 9z"/>',
    '<path fill="#6c80c6" d="M3 2h15l1 2v16H3z"/><path fill="#eaf1f7" d="M6 2h9v7H6zM6 13h10v7H6z"/><path d="M8 15h6v4H8zM13 3v4"/>',
    '<path fill="#d8e3ec" d="M2 8h18v10H2z"/><path fill="#f6f8fa" d="M6 2h10v8H6zM6 13h10v8H6z"/><path d="M4 11h2M8 16h6M8 18h6"/>',
    '<path fill="#ecf2f5" d="M3 3h12l3 3v13H3z"/><path fill="#fff" d="M7 1h9l4 4v14H7z"/><path d="M15 1v5h5M9 8h7M9 11h8M10 15h5"/>',
    '<path d="m8 3-5 5 5 4V9h5a6 6 0 0 1 0 12M3 8h10"/>',
    '<path opacity=".65" d="m14 3 5 5-5 4V9H9a6 6 0 0 0 0 12M19 8H9"/>',
    '<path d="m3 19 15-16M5 20 20 4"/><path fill="#b8d4e5" d="m2 17 3 3 2-3-2-2zM16 2l3 3 2-3-2-2z"/>',
    '<path d="M3 18V4h15v14zM3 18Q20 15 18 4Q1 1 3 18"/><path fill="#bfd7ed" d="M1 2h4v4H1zM16 2h4v4h-4zM1 16h4v4H1zM16 16h4v4h-4z"/>',
    '<path stroke-dasharray="3 2" d="M3 3h15v15H3z"/><path fill="#d7e3ee" d="M16 16h4v4h-4z"/>',
    '<path d="M2 11h19M11 2v19M4 19 19 4M4 4l3 3M15 15l4 4"/><circle cx="17" cy="5" r="2" fill="#d9ecf3"/>',
    '<circle cx="11" cy="11" r="9"/><path d="M2 11h18M11 2v18M11 2Q3 11 11 20M11 2q8 9 0 18"/>',
    '<circle cx="9" cy="9" r="6.5" fill="#e8f2f6"/><path stroke-width="3" d="m14 14 6 6"/><path d="M5 9h8M9 5v8"/>',
    '<circle cx="9" cy="9" r="7" fill="#eef5f8"/><path stroke-width="3" d="m14 14 6 6"/><path d="M5 9h8M9 5v8"/>',
    '<g opacity=".25"><path d="M3 3h16v16H3zM6 6h9v9H6zM7 7l7 7M14 7l-7 7"/></g>',
    '<path d="M4 4h5v5H4zM14 14h5v5h-5zM3 15h5v5H3zM6 9v6M9 6h6v8M12 2l7 7M10 4l7 7"/>',
    '<path fill="#f2f5f7" d="M4 2h10l5 5v14H4z"/><path d="M13 2v6h6M7 9h3v5h5v3H7zM8 5h2"/>',
  ];
  const CAD_THEME = {
    bg: '#0a1a2c', panel: '#f5faff', fg: '#12203a', muted: '#56677e', line: '#c5cdd8',
  };

  env.site({
    name: 'design-click-control-pie-06',
    template: 'site/base',
    styles: ['sites/base/site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { cad: CAD_THEME },
      LOW_THEME: CAD_THEME,
      ACCENTS: ['#1a64d0'],
      LOW_ACCENTS: ['#1a64d0'],
      LANGS: ['en'],
      parts: {
        'frame.theme': (base) => (_c) => {
          base(_c);
          document.body.className = 'ref cad';
        },
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This fixed sidebar has room for each instruction mode at every viewport.
          _c.display = _c.ctx.display;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('main', 'shell', document.body);
          const brief = u.el('section', 'brief', shell);
          const bh = u.el('header', 'brief-head', brief);
          const ic = u.el('span', 'brief-ic', bh);
          ic.innerHTML =
            '<svg viewBox="0 0 40 44" fill="none" stroke="#15304c" stroke-width="1.8"><path fill="#fafcff" d="M2 1h27l9 9v32H2z"/><path d="M29 1v10h9M7 7h16M8 11h8v10H8zM8 26h8v10H8zM21 14h11M21 19h11M21 24h11M21 29h11M21 34h11M7 39h25"/><path stroke="#6a93b7" stroke-width="1" d="M4 4v35M18 9v28"/></svg>';
          u.el('span', '', bh, 'Task');
          const briefBody = u.el('div', 'brief-body', brief);
          const briefFoot = u.el('footer', 'brief-foot', brief);
          const app = u.el('section', 'app', shell);
          Object.assign(_c, { shell, brief, briefBody, briefFoot, app, header: briefBody });
        },
        'frame.nav': () => (_c) => {
          const { app, util: u } = _c;
          const tb = u.el('div', 'titlebar', app);
          tb.innerHTML =
            '<svg class="app-ic" viewBox="0 0 16 16"><rect x="2" y="1" width="12" height="14" fill="#cfe6f7" stroke="#3a78b8"/><path d="M5 5h6M5 8h6M5 11h4" stroke="#3a78b8"/></svg>';
          u.el('span', '', tb, 'DraftPro 2014 - [Mechanical Bracket.dwg]');
          const wc = u.el('span', 'winctl', tb);
          wc.innerHTML =
            '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
          const mb = u.el('nav', 'menubar', app);
          ['File', 'Edit', 'View', 'Draw', 'Modify', 'Dimension', 'Tools', 'Window', 'Help'].forEach((t) =>
            u.el('span', '', mb, t),
          );
          const menuActions = u.el('div', 'menu-actions', mb);
          const tools = u.el('div', 'toolbar', app);
          const grp = [
            [0, 3],
            [4, 5],
            [6, 9],
            [10, 13],
            [14, 15],
          ];
          grp.forEach(([a, b]) => {
            const g = u.el('span', 'tgrp', tools);
            for (let i = a; i <= b; i++) {
              const t = u.el('i', '', g);
              t.innerHTML = '<svg viewBox="0 0 22 22">' + ICONS[i] + '</svg>';
            }
          });
          [
            ['Layer:', 'Default', 116],
            ['Line:', 'Continuous', 118],
            ['Color:', 'Cyan', 120],
          ].forEach(([l, v, w], i) => {
            u.el('span', 'tlabel', tools, l);
            const s = u.el('span', 'tsel', tools);
            s.style.width = w + 'px';
            if (i === 2) {
              u.el('b', 'swatch', s);
            }
            u.el('span', '', s, v);
          });
          Object.assign(_c, { menuActions });
        },
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) note.classList.add('instruction');
        },
        'frame.tools': (base) => (_c) => {
          const instructionHost = _c.header;
          _c.header = _c.menuActions;
          base(_c);
          _c.header = instructionHost;
          for (const b of _c.headerTools.querySelectorAll('.ref-xtra')) b.classList.add('chrome-xtra');
          if (_c.submit) {
            _c.submit.classList.add('submit');
            _c.briefFoot.appendChild(_c.submit);
          }
        },
        'frame.body': () => (_c) => {
          // The template panel occupies the task sidebar, while the widget lives in model space.
          _c.body = _c.briefBody;
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const { briefBody, display, util: u } = _c;
          const panel = briefBody.querySelector('.ref-panel');
          if (panel) panel.classList.add('instruction', 'instruction-panel');
          if (display !== 'hidden') {
            u.el('hr', 'brief-rule', briefBody);
            u.el('p', 'brief-help', briefBody,
              'The drawing area on the right contains a pie menu. The center control expands the available segments.');
          } else {
            u.el('p', 'brief-help document-note', briefBody, 'Mechanical Bracket.dwg');
            u.el('p', 'document-details', briefBody, 'Model space · 2D Wireframe');
          }
        },
        'frame.stage': () => (_c) => {
          const { app, util: u } = _c;
          const canvas = u.el('div', 'canvas', app);
          canvas.insertAdjacentHTML('afterbegin', DRAWING);
          const stage = u.el('div', 'stage', canvas);
          Object.assign(_c, { stage });
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          if (_c.display === 'toast') {
            const note = document.body.querySelector('.ref-note');
            note.classList.add('instruction', 'instruction-toast');
            _c.briefBody.prepend(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          const { app, util: u } = _c;
          const cmd = u.el('div', 'cmdline', app);
          u.el('span', '', cmd, 'Command:');
          u.el('div', 'cmdbox', cmd);
          const st = u.el('div', 'statusbar', app);
          u.el('span', 'coords', st, '215.340, 118.662,  0.000');
          const modes = u.el('span', 'modes', st);
          ['SNAP', 'GRID', 'ORTHO', 'POLAR', 'OSNAP'].forEach((t) => u.el('b', t === 'OSNAP' ? 'on' : '', modes, t));
          u.el('span', 'model', st, 'Model');
          base(_c);
          const foot = document.body.querySelector(':scope > .ref-foot');
          if (foot) {
            const tools = foot.querySelector('.ref-tools');
            cmd.appendChild(tools);
            for (const b of tools.querySelectorAll('.ref-xtra')) b.classList.add('chrome-xtra');
            if (_c.submit && tools.contains(_c.submit)) _c.submit.classList.add('chrome-end');
            foot.remove();
          }
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          if (_c.placement === 'floating') {
            _c.briefFoot.appendChild(_c.submit.parentElement);
            _c.submit.classList.add('submit');
          }
        },
        'frame.end': (base) => (_c) => {
          if (!_c.briefFoot.querySelector('[data-role="submit"]')) {
            _c.briefFoot.classList.add('brief-foot-ready');
            _c.util.el('span', '', _c.briefFoot, 'Drawing workspace · Ready');
          }
          return base(_c);
        },
      },
    },
  });
})();
