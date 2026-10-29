// Vista frame design on the shared site template.
(function () {
  'use strict';

  function clearEntry(stage) {
    const input = stage.querySelector('input,textarea');
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
  }

  env.site({
    name: 'design-type-text-transform-07',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      LANGS: ['en'],
      THEMES: { vista: { bg: '#5f93bb', panel: '#eef3fa', fg: '#111', muted: '#555', line: '#a9bccf' } },
      LOW_THEME: { bg: '#5f93bb', panel: '#eef3fa', fg: '#111', muted: '#555', line: '#a9bccf' },
      ACCENTS: ['#2d7fd0'],
      LOW_ACCENTS: ['#2d7fd0'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This desktop frame has room for its panel and inline note at every supported size.
          _c.display = _c.ctx.display || 'header';
          document.body.classList.remove('ref-has-note');
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
          const selection = window.getSelection();
          if (selection) selection.removeAllRanges();
          const top = u.el('header', 'ds-top', document.body);
          const title = u.el('span', 'ds-title', top);
          const icon = u.el('i', 'ds-icon', title);
          icon.innerHTML =
        '<svg viewBox="0 0 30 36" aria-hidden="true"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e5edf1"/></linearGradient></defs><path d="M3 2h17l8 8v24H3z" fill="url(#paper)" stroke="#445d6b" stroke-width="1.5"/><path d="M20 2v9h8" fill="#c7d1d6" stroke="#445d6b" stroke-width="1.5"/><path d="M7 8h9M7 11h9M14 16h9M14 19h9M7 23h16M7 26h16M7 29h13" stroke="#708695" stroke-width="1.2"/><path d="M7 15h5v5H7z" fill="#9dc8db" stroke="#718c9c"/></svg>';
          u.el('span', '', title, 'Text Tools');
          const wc = u.el('span', 'ds-wc', top);
          u.el('i', 'mn', u.el('span', '', wc));
          u.el('i', 'mx', u.el('span', '', wc));
          u.el('span', '', wc, '✕');
          const header = u.el('nav', 'ds-menu', document.body);
          for (const text of ['File', 'Edit', 'View', 'Help']) u.el('span', '', header, text);
          const shell = u.el('div', 'ds-body', document.body);
          const content = u.el('div', 'ds-content', shell);
          const source = u.el('div', 'ds-source', content);
          u.el('label', '', source, 'Text Workspace');
          u.el('div', 'ds-source-box', source, 'Ready for text entry.');
          const pane = u.el('div', 'ds-pane', content);
          Object.assign(_c, { header, content, pane });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.pane });
          const text = _c.pane.querySelector('.ref-instruction');
          if (text) {
            text.className = 'ds-instruction';
            const note = _c.util.el('aside', 'ds-header-note', _c.pane);
            note.append(text);
          }
          _c.pane.querySelector('.ref-spacer')?.remove();
        },
        'frame.body': () => (_c) => {
          _c.body = _c.util.el('div', 'ds-main ref-body', _c.pane);
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.className = 'ds-brief';
            panel.querySelector('.ref-panel-title').className = 'ds-brief-title';
            panel.querySelector('.ref-panel-text').className = 'ds-instruction';
          }
        },
        frameAlign: () => () => {},
        'frame.stage': (base) => (_c) => {
          base(_c);
          _c.stage.classList.add('ds-stage');
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.className = 'ds-toast';
            note.querySelector('.ref-note-text').className = 'ds-instruction';
            _c.pane.insertBefore(note, _c.body);
          }
        },
        'frame.footer': (base) => (_c) => {
          // The design always has a footer, including when the end control is elsewhere.
          _c.wantFooter = true;
          base(_c);
          const foot = document.querySelector('.ref-foot');
          foot.classList.add('ds-footer');
          _c.content.append(foot);
          const clear = _c.util.el('button', 'ds-btn ds-clear', foot, 'Clear');
          clear.type = 'button';
          clear.addEventListener('click', () => clearEntry(_c.stage));
          foot.prepend(clear);
          _c.decoyBtn(foot, 'Close');
          foot.lastElementChild.classList.add('ds-btn');
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          // Dock floating controls inside the existing footer's reserved space.
          const dock = document.querySelector('.ref-float-dock');
          if (dock) document.querySelector('.ds-footer').insertBefore(dock, document.querySelector('.ds-footer').lastElementChild);
        },
      },
    },
  });
})();
