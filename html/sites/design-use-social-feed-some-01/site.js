// Civic service sheet on the shared frame; only the sheet's presentation differs.
(function () {
  'use strict';

  const sheet = {
    bg: '#ffffff', panel: '#ffffff', fg: '#00133b', accent: '#214a77',
    font: 'Arial,sans-serif', line: '#c8cdd5', muted: '#5f6a78',
  };

  function taskNote(_c, note, text = note) {
    if (!note) return;
    const p = _c.util.el('p', '', null, text.textContent);
    if (text === note) note.replaceChildren(p);
    else text.replaceWith(p);
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    _c.util.el('div', 'task-sub', note, 'Browse the feed and use the buttons beside each post.');
  }

  env.site({
    name: 'design-use-social-feed-some-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { sheet },
      LOW_THEME: sheet,
      ACCENTS: [sheet.accent],
      LOW_ACCENTS: [sheet.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.className = 'index instruction-' + _c.display;
          document.body.classList.toggle('episode-finish', !!_c.ctx.finish);
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // This sheet always reserves its bottom action row.
          _c.wantFooter = true;
          document.body.dataset.end = _c.placement || 'none';
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const shell = util.el('div', 'site-shell', document.body);
          const index = util.el('nav', 'task-index', document.body);
          for (let i = 1; i <= 10; i++) util.el('span', i === 1 ? 'on' : '', index, String(i));
          const header = util.el('header', 'design-header', shell);
          util.el('div', 'design-brand', header, 'HarborSocial');
          util.el('nav', 'design-nav', header, 'My Account');
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          taskNote(_c, _c.header.querySelector('.ref-instruction'));
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { endBtn, decoyBtn, placement } = _c;
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add('end-control', 'end-' + placement);
            return button;
          };
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.classList.add('chrome-xtra');
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.classList.add('chrome-tools');
        },
        'frame.body': () => (_c) => {
          const { header, shell, util } = _c;
          const body = util.el('div', 'design-body ref-body', shell);
          const note = header.querySelector('.ref-instruction');
          if (note) body.append(note);
          Object.assign(_c, { body });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const note = _c.body.querySelector('.ref-panel');
          if (note) taskNote(_c, note, note.querySelector('.ref-panel-text'));
        },
        frameAlign: () => () => {},
        'frame.stage': (base) => (_c) => {
          base(_c);
          _c.stage.classList.add('stage');
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) taskNote(_c, note, note.querySelector('.ref-note-text'));
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          foot.classList.add('design-footer');
          _c.shell.append(foot);
          Object.assign(_c, { foot });
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.foot.append(dock);
        },
      },
    },
  });
})();
