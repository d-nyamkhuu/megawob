(function () {
  'use strict';
  const ICON = {
    select: '<path d="M7 2l11 11-7 1-4 7zM12 15l3 5"/>',
    crop: '<path d="M6 2v16h16M2 6h16v16"/>',
    adjust:
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    text: '<path d="M5 5h14M12 5v15M9 20h6"/>',
    shapes: '<path d="M20 12C16 1 5 1 3 10c-1 5 2 9 7 12l3-7zM13 15l7-3"/>',
    pen: '<path d="M4 20l1-5L16 4l4 4L9 19z"/>',
    more: '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3.5"/>',
    clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6"/>',
    image:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 17l5-5 4 4 3-3 6 5"/><circle cx="9" cy="9" r="1.5"/>',
    undo: '<path d="M8 6L4 10l4 4M4 10h10a6 6 0 010 12h-3"/>',
    redo: '<path d="M16 6l4 4-4 4M20 10H10a6 6 0 000 12h3"/>',
    wifi: '<path d="M2 8a15 15 0 0120 0M5 12a10 10 0 0114 0M8 16a5 5 0 018 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>',
    volume: '<path d="M3 9h4l5-4v14l-5-4H3zM16 8a6 6 0 010 8M19 5a10 10 0 010 14"/>',
    battery:
      '<rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4"/><path d="M5 9h12v6H5z" fill="currentColor" stroke="none"/>',
  };
  function svg(name, cls) {
    return '<svg class="' + (cls || 'ic') + '" viewBox="0 0 24 24">' + ICON[name] + '</svg>';
  }
  const WINCTL =
    '<i><svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3.5 3.5h9v9h-9z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
  // Keep the fixed FrameLab chrome; the template owns episode behavior.
  const palette = {
    bg: '#2a1236', panel: '#211a2b', fg: '#f1ecf7', muted: '#b9b0c6', line: '#3a3146',
  };
  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      document.body.className = 'ref fl';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      // The reference always has a file/status footer, including short viewports.
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const desk = u.el('main', 'shell', document.body);
      // FrameLab main window
      const win = u.el('section', 'fl-win', desk);
      const tb = u.el('div', 'fl-title', win);
      const logo = u.el('span', 'fl-logo', tb);
      logo.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M5 5h6l-1 6H4zM13 5h7l-1 8h-7zM4 13h5l-1 5H3zM11 15h7v4h-7z" fill="#fff"/></svg>';
      u.el('span', 'fl-appname', tb, 'FrameLab');
      u.el('span', 'fl-ctl', tb).innerHTML = WINCTL;
      const menu = u.el('div', 'fl-menu', win);
      ['Edit', 'Annotate', 'View', 'Help'].forEach((t, i) => u.el('span', i === 1 ? 'on' : '', menu, t));
      Object.assign(_c, { desk, win, header: menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => { _c.drawInstruction = base; },
    'frame.controls': (base) => (_c) => {
      base(_c);
      const { endBtn, decoyBtn } = _c;
      // Reuse the template's controls and handlers with this design's class names.
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.className = cls === 'ref-endlink' ? 'submit-link'
          : cls.includes('ref-icon') ? 'end-icon'
          : cls.includes('ref-float') ? 'submit'
          : parent.closest('.fl-menu') ? 'submit-toolbar' : 'submit';
        return button;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.className = 'end-xtra';
      };
    },
    'frame.body': () => (_c) => {
      const { util: u, win } = _c;
      const body = u.el('div', 'fl-body', win);
      const tools = u.el('nav', 'fl-tools', body);
      [
        ['select', 'Select'],
        ['crop', 'Crop'],
        ['adjust', 'Adjust'],
        ['text', 'Text'],
        ['shapes', 'Shapes'],
        ['pen', 'Annotate'],
        ['more', 'More'],
      ].forEach((p, i) => {
        const t = u.el('div', i === 0 ? 'on' : '', tools);
        const ic = u.el('span', '', t);
        ic.innerHTML = svg(p[0]);
        u.el('b', '', t, p[1]);
      });
      const view = u.el('div', 'fl-view', body);
      Object.assign(_c, { body, view });
      // The header instruction belongs over the photograph, below the app menus.
      _c.drawInstruction({ ..._c, header: view });
      const note = view.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
      const prev = u.el('button', 'fl-preview', view);
      prev.type = 'button';
      prev.innerHTML =
        svg('eye', 'pv-ic') + '<span class="pv-t">Preview</span><span class="pv-s">See changes instantly</span>';
    },
    'frame.panel': (base) => (_c) => {
      const { ctx, desk, display, label, util: u } = _c;
      const g = u.el('section', 'fl-guide', desk);
      const gt = u.el('div', 'fl-title', g);
      u.el('span', 'fl-clip', gt).innerHTML = svg('clip');
      u.el('span', 'fl-appname', gt, 'Task Guide');
      u.el('span', 'fl-ctl', gt).innerHTML = WINCTL;
      const gtabs = u.el('div', 'fl-gtabs', g);
      u.el('span', 'on', gtabs, 'Instructions');
      u.el('span', '', gtabs, 'Notes');
      const steps = u.el('div', 'fl-steps', g);
      const hints = ['The center control opens and closes the pie menu.',
        'Preview lets you see changes in the workspace.'];
      for (let i = 0; i < 3; i++) {
        const row = u.el('div', 'fl-step' + (i === 0 ? ' first' : ''), steps);
        u.el('span', 'n', row, String(i + 1));
        if (i === 0 && display === 'panel') {
          base({ ..._c, body: row });
          row.querySelector('.ref-panel').classList.add('fl-guide-instruction');
          row.querySelector('.ref-panel-text').classList.add('instruction', 'instruction-panel');
        } else if (i < 2) {
          u.el('p', '', row, hints[i]);
        } else {
          const text = u.el('p', '', row);
          if (ctx.finish) text.textContent = 'Finish the task when you are done.';
          else {
            text.append('Click ');
            u.el('strong', '', text, label);
            text.append(' when you are done.');
          }
        }
      }
      // taskbar
      const bar = u.el('div', 'fl-taskbar', desk);
      u.el('span', 'fl-start', bar).innerHTML = '<i></i><i></i><i></i><i></i>';
      u.el('span', 'fl-search', bar, 'Search').insertAdjacentHTML(
        'afterbegin',
        '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg>',
      );
      const apps = u.el('span', 'fl-apps', bar);
      const appIcons = [
        '<path d="M2 5h10l3 3h15v20H2z" fill="#edaa21"/><path d="M2 11h28v17H2z" fill="#ffca4a"/><path d="M13 22h9v6h-9z" fill="#2b91ec"/>',
        '<defs><linearGradient id="edge" x2="1" y2="1"><stop stop-color="#23d4b9"/><stop offset="1" stop-color="#0074d8"/></linearGradient></defs><circle cx="16" cy="16" r="15" fill="url(#edge)"/><path d="M2 20c2-14 20-18 28-6C20 7 12 15 16 20c4 6 12 1 13 0-2 15-26 13-27 0" fill="#0878d9"/><path d="M4 13c5-8 19-10 26 1-8-3-11-1-14 3-1-8-8-8-12-4" fill="#34d2b7"/>',
        '<rect x="3" y="3" width="27" height="27" rx="3" fill="#159ce9"/><rect x="5" y="5" width="23" height="23" rx="2" fill="#113e68"/><circle cx="23" cy="10" r="3" fill="#c4ebff"/><path d="M5 23l8-10 6 7 4-4 5 7v5H5z" fill="#b0e9fa"/>',
        '<rect x="2" y="2" width="29" height="29" rx="5" fill="#7735c4"/><path d="M9 9h7l-1 6H8zM18 9h7l-1 8h-7zM8 17h6l-1 7H7zM16 19h7v5h-7z" fill="#fff"/>',
        '<path d="m13 1 6 0 1 5 4 2 5-1 3 5-4 4v4l4 3-3 5-5-1-4 2-1 4h-6l-1-4-4-2-5 1-3-5 4-3v-4l-4-4 3-5 5 1 4-2z" fill="#9da2af"/><circle cx="16" cy="17" r="6" fill="#201c29"/>',
      ];
      appIcons.forEach((markup, i) => {
        const a = u.el('i', i === 3 ? 'on' : '', apps);
        a.innerHTML = '<svg viewBox="0 0 34 34">' + markup + '</svg>';
      });
      u.el('span', 'fl-tray', bar).innerHTML = svg('wifi') + svg('volume') + svg('battery');
      u.el('span', 'fl-clock', bar).innerHTML = '10:24 AM<br>Apr 24, 2026';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.view);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        _c.view.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const { util: u, win } = _c;
      const foot = document.querySelector('.ref-foot');
      foot.className = 'footer';
      foot.querySelector('.ref-foot-text').remove();
      const tools = foot.querySelector('.ref-tools');
      u.el('span', 'fl-file', foot).innerHTML = svg('image') + '<em>lake_view.jpg</em>';
      u.el('span', 'fl-zoom', foot, '100%  ▾');
      u.el('span', 'fl-undo', foot).innerHTML = svg('undo') + svg('redo');
      foot.appendChild(tools);
      win.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    fault: (base) => (ctx) => {
      const result = base(ctx);
      // Keep the template's shift banner in the fixed app window's flex layout.
      if (ctx.kind === 'shift') document.querySelector('.fl-body').before(result.el);
      return result;
    },
  };

  env.site({
    name: 'design-click-control-pie-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['site.css', 'fl.css'],
    design: {
      THEMES: { dark: palette }, LOW_THEME: palette,
      ACCENTS: ['#ff6b72'], LOW_ACCENTS: ['#ff6b72'],
      parts,
    },
  });
})();
