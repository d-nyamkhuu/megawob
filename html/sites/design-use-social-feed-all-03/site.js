// ChatterDesk's e-ink frame on the shared site template.
(function () {
  'use strict';

  const ink = {
    bg: '#f1f0ec', panel: '#f3f2ee', fg: '#111111', accent: '#111111',
    font: "Georgia,'Times New Roman',serif", line: '#8a8a85', muted: '#333333',
  };

  // Fit the prominent instruction without changing the perimeter's dimensions.
  function fitInstruction(note) {
    const heading = note.querySelector('.ref-instruction');
    if (!heading) return;
    heading.style.whiteSpace = 'nowrap';
    const fs = parseFloat(getComputedStyle(heading).fontSize);
    const fit = Math.min(1, heading.clientWidth / heading.scrollWidth);
    heading.style.fontSize = Math.max(22, fs * fit - 0.25) + 'px';
    heading.style.whiteSpace = '';
  }

  env.site({
    name: 'design-use-social-feed-all-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { ink },
      LOW_THEME: ink,
      ACCENTS: ['#111111'],
      LOW_ACCENTS: ['#111111'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.className = 'bottom instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const header = u.el('header', 'design-header', shell);
          const brand = u.el('div', 'design-brand', header);
          brand.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.6"><rect x="3" y="4" width="18" height="13" rx="3"/><path d="M8 17v3l4-3"/><circle cx="8" cy="10" r=".65" fill="#111"/><circle cx="12" cy="10" r=".65" fill="#111"/><circle cx="16" cy="10" r=".65" fill="#111"/></svg><span>ChatterDesk</span>';
          u.el('div', 'window-controls', header, '−  □  ×');
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const { header, util: u } = _c;
          const note = u.el('section', 'task-note', header);
          note.dataset.role = 'instruction';
          u.el('h2', '', note, 'Social Feed — Task');
          const instruction = header.querySelector('.ref-instruction');
          if (instruction) note.append(instruction);
          else note.hidden = true;
          Object.assign(_c, { note });
        },
        'frame.body': () => (_c) => {
          const { shell, note, util: u } = _c;
          const body = u.el('div', 'design-body ref-body', shell);
          body.append(note);
          const ico = {
            Tasks: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8l3 3 5-6M8 15l3 3 5-6"/>',
            Search: '<circle cx="10" cy="10" r="7"/><path d="M15 15l6 6"/>',
            Notifications: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/>',
            Settings:
              '<circle cx="12" cy="12" r="3.5"/><path d="M9 2h6l1 3 3 1 3 3-2 3 2 3-3 3-3 1-1 3H9l-1-3-3-1-3-3 2-3-2-3 3-3 3-1z"/>',
          };
          const tools = u.el('nav', 'tools-panel', body);
          u.el('h3', '', tools, 'Tools');
          ['Tasks', 'Search', 'Notifications', 'Settings'].forEach((n, i) => {
            const b = u.el('button', 'tool-item' + (i ? '' : ' on'), tools);
            b.type = 'button';
            b.innerHTML =
              '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.7">' +
              ico[n] +
              '</svg><span>' +
              n +
              '</span>';
            b.addEventListener('click', () => env.log('decoy', { what: n }));
          });
          const rc = u.el('div', 'right-col', body);
          const fp = u.el('section', 'side-panel', rc);
          u.el('h3', '', fp, 'Filters');
          ['All posts', 'Following', 'Mentions', 'Hashtags'].forEach((n, i) => {
            const r = u.el('div', 'flt', fp);
            u.el('i', i ? '' : 'on', r, i ? '' : '✓');
            u.el('span', '', r, n);
          });
          u.el('hr', '', fp);
          u.el('div', '', fp, 'Sort by');
          const sel = u.el('div', 'sel', fp);
          u.el('span', '', sel, 'Most recent');
          u.el('span', '', sel, '▾');
          const pp = u.el('section', 'side-panel', rc);
          u.el('h3', '', pp, 'Post Activity');
          u.el('div', 'task-progress-count', pp, '0 posts acted on');
          u.el('div', 'prog-bar', pp);
          const lower = u.el('section', 'office-lower', body);
          const actionbar = u.el('div', 'office-final-actions', lower);
          Object.assign(_c, { body, tools, actionbar });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const { body, tools } = _c;
          const panel = body.querySelector('.ref-panel');
          if (!panel) return;
          panel.classList.add('task-note', 'perimeter-note');
          panel.dataset.role = 'instruction';
          panel.querySelector('.ref-panel-title').textContent = 'Social Feed — Task';
          tools.append(panel);
        },
        'frame.stage': () => (_c) => {
          const stage = _c.util.el('main', 'stage', _c.body);
          Object.assign(_c, { stage });
        },
        'frame.end': (base) => (_c) => {
          const { actionbar, body, header, headerTools, note, placement, submit, tools } = _c;
          // Keep the template's end labels, decoys and finish behavior; dock its controls in this frame.
          for (const decoy of document.querySelectorAll('.ref-xtra')) {
            decoy.classList.add('chrome-xtra');
            tools.insertBefore(decoy, tools.querySelector('.ref-panel'));
          }
          if (submit) {
            const inHeader = placement === 'header' || placement === 'icon';
            submit.classList.add('end-control', 'end-' + (inHeader ? 'header' : placement === 'link' ? 'link' : 'footer'));
            if (inHeader) {
              header.insertBefore(submit, header.querySelector('.window-controls'));
              header.classList.add('has-end');
            } else if (placement === 'link') {
              tools.insertBefore(submit, tools.querySelector('.ref-panel'));
            } else actionbar.append(submit);
          }
          headerTools.remove();
          for (const extra of document.querySelectorAll('.ref-foot, .ref-float-dock, .ref-spacer')) extra.remove();
          const toast = document.querySelector('.ref-note');
          if (toast) body.append(toast);
          const panel = tools.querySelector('.ref-panel');
          if (panel && tools.getBoundingClientRect().bottom > body.getBoundingClientRect().bottom - 18) {
            // Long goals fit the center header when the perimeter card would run out of height.
            note.hidden = false;
            note.append(panel.querySelector('.ref-panel-text'));
            note.lastChild.classList.add('ref-instruction');
            panel.remove();
            document.body.classList.replace('instruction-panel', 'instruction-header');
          }
          fitInstruction(note);
          return base(_c);
        },
      },
    },
  });
})();
