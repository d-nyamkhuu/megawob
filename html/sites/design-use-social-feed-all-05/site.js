// BeOS twin-pane design on the shared site frame.
(function () {
  'use strict';

  const palette = {
    bg: '#4a78ab', panel: '#f4f5f8', fg: '#14181f', accent: '#0b3f94',
    font: 'Arial,Helvetica,sans-serif', line: '#b9bdc6', muted: '#555c68',
  };

  const styleTools = (parent) => {
    for (const button of parent.querySelectorAll('.ref-xtra')) button.classList.add('bx-xtra');
    for (const button of parent.querySelectorAll('.ref-submit')) button.classList.add('end-control');
    for (const link of parent.querySelectorAll('.ref-endlink')) link.classList.add('end-link');
  };

  env.site({
    name: 'design-use-social-feed-all-05',
    template: 'site/base',
    styles: ['site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css'],
    design: {
      THEMES: { beos: palette }, LOW_THEME: palette,
      ACCENTS: [palette.accent], LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.className = 'twin instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { display, util: u } = _c;
          const shell = u.el('div', 'site-shell' + (display === 'header' ? ' header-display' : ''), document.body);
          const title = u.el('header', 'bx-title', shell);
          const icon = u.el('span', 'bx-icon', title);
          icon.innerHTML = '<svg viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" fill="#fff" stroke="#222"/><path d="M5 6h10M5 9h10M5 12h10M5 15h6" stroke="#222"/></svg>';
          u.el('span', 'bx-tab', title, 'Social Runner');
          const wc = u.el('div', 'bx-wc', title);
          for (const glyph of ['_', '□', '✕']) u.el('span', '', wc, glyph);
          const header = u.el('nav', 'bx-menu', shell);
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => (_c) => {
          const { util: u, header } = _c;
          for (const text of ['File', 'Edit', 'View', 'Tools', 'Help']) {
            const item = u.el('button', 'bx-menu-item', header, text);
            item.type = 'button';
            if (text === 'File') {
              const popup = u.el('div', 'bx-file-menu', header);
              popup.hidden = true;
              _c.filePopup = popup;
              item.addEventListener('click', () => { popup.hidden = !popup.hidden; });
            } else item.addEventListener('click', () => env.log('decoy', { what: text }));
          }
        },
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) {
            note.classList.add('bx-header-note');
            note.dataset.role = 'instruction';
            _c.shell.append(note);
          }
          const spacer = _c.header.querySelector('.ref-spacer');
          if (spacer) spacer.remove();
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.classList.add('bx-menu-tools');
          styleTools(_c.headerTools);
          if (_c.submit) _c.submit.classList.add('end-header');
          _c.decoyBtn(_c.filePopup, 'Clear');
          _c.filePopup.firstElementChild.className = 'clear-task';
        },
        'frame.body': () => (_c) => {
          _c.body = _c.util.el('div', 'design-body ref-body', _c.shell);
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const { body, util: u } = _c;
          const note = body.querySelector('.ref-panel');
          const right = u.el('section', 'bx-pane bx-right', body);
          u.el('h2', 'bx-ph', right, 'Task Instructions');
          const rb = u.el('div', 'bx-rbody', right);
          if (note) {
            note.classList.add('task-note');
            note.dataset.role = 'instruction';
            note.querySelector('.ref-panel-title').remove();
            rb.append(note);
          }
          const heading = u.el('h3', 'bx-sec', rb);
          u.el('span', '', heading, 'Details');
          const details = u.el('div', 'bx-text', rb);
          for (const text of [
            'Browse posts in the list on the left.',
            'Each post shows its author and time.',
            'Reaction buttons appear below each post.',
            'Open the More menu for additional options.',
          ]) u.el('p', 'bx-detail-line', details, text);
          const activity = u.el('h3', 'bx-sec', rb);
          u.el('span', '', activity, 'Activity');
          u.el('div', 'bx-prog-t', rb, '');
          u.el('div', 'bx-bar', rb);
          const actionbar = u.el('div', 'bx-actions', rb);
          Object.assign(_c, { rb, actionbar });
        },
        'frame.stage': () => (_c) => {
          const { body, util: u } = _c;
          const left = u.el('section', 'bx-pane bx-left');
          body.prepend(left);
          u.el('h2', 'bx-ph', left, 'All Posts');
          _c.stage = u.el('main', 'stage', left);
          left.after(u.el('div', 'bx-divider'));
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('bx-toast');
            note.dataset.role = 'instruction';
            _c.rb.insertBefore(note, _c.actionbar);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { shell, util: u, actionbar, placement } = _c;
          const inherited = document.querySelector('.ref-foot');
          const footer = u.el('footer', 'bx-status', shell);
          const icon = u.el('span', 'bx-sicon', footer);
          icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 5h5V3c0-3 5-3 5 0v2h4v6h2c3 0 3 5 0 5h-2v5h-6v-2c0-3-5-3-5 0v2H3v-6h2c3 0 3-5 0-5H3V5Z" fill="#278ed0" stroke="#12365a"/><path d="M6 6v4M6 6h4M16 7h2v3" stroke="#b6e8ff"/><path d="M8 22h5" stroke="#efbb36" stroke-width="2"/></svg>';
          u.el('span', 'bx-ready', footer, 'Ready');
          if (inherited) {
            const tools = inherited.querySelector('.ref-tools');
            tools.classList.add('bx-footer-end');
            styleTools(tools);
            footer.append(tools);
            if (placement === 'link' && _c.submit) actionbar.append(_c.submit);
            inherited.remove();
          }
          u.el('span', 'bx-date', footer, 'Mar 14, 1999   2:17 PM');
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            styleTools(dock);
            _c.actionbar.append(dock);
          }
        },
      },
    },
  });
})();
