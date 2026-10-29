// Aqua notebook chrome on site/base; shared controls, instructions and perturbations.
(function () {
  'use strict';

  const aqua = {
    bg: '#4a86cf', panel: '#f8fbff', fg: '#10243f', accent: '#188de0',
    font: "'Lucida Grande','Lucida Sans Unicode','Segoe UI',Arial,sans-serif",
    line: '#b8c6d8', muted: '#5f6a78',
  };
  const TABS = [
    [
      'Feed',
      '<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="3"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6zM15 15c4-1 7 1 7 5h-5"/>',
    ],
    [
      'Explore',
      '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16 8l-2 6-6 2 2-6z"/>',
    ],
    [
      'Messages',
      '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 7l10 7 10-7" fill="none" stroke="#e9f1fa" stroke-width="1.6"/>',
    ],
    ['Saved', '<path d="M6 2h12v20l-6-5-6 5z"/>'],
    ['Profile', '<circle cx="12" cy="8" r="4.5"/><path d="M3 22c0-6 4-8 9-8s9 2 9 8z"/>'],
  ];

  // Keep the notebook's inline blue handles in every instruction presentation.
  function notebookNote(note, mode) {
    if (!note) return;
    note.classList.add('aq-note');
    note.dataset.role = 'instruction';
    note.dataset.mode = mode;
    const text = note.querySelector('.ref-panel-text, .ref-note-text') || note;
    const instruction = text.textContent;
    text.textContent = '';
    const p = env.util.el('p', '', text);
    for (const bit of instruction.split(/(@[\w]+)/g))
      env.util.el('span', bit.startsWith('@') ? 'aq-handle' : '', p, bit);
  }

  env.site({
    name: 'design-use-social-feed-some-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { aqua },
      LOW_THEME: aqua,
      ACCENTS: [aqua.accent],
      LOW_ACCENTS: [aqua.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This notebook has compact panel and toast presentations at every size.
          _c.display = _c.ctx.display;
          document.body.className = 'aqua instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'aq-shell', document.body);
          const mb = u.el('div', 'aq-menubar', shell);
          const apple = u.el('span', 'aq-apple', mb);
          apple.innerHTML =
            '<svg viewBox="0 0 24 24" width="17" height="17" fill="#111"><path d="M16.5 12.7c0-2.4 2-3.5 2-3.6-1.100-1.600-2.800-1.800-3.400-1.800-1.400-.1-2.800.9-3.500.9s-1.800-.8-3-.8c-1.500 0-3 .9-3.800 2.300-1.600 2.800-.4 7 1.200 9.300.8 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7 2-1.100 2.800-2.200c.9-1.300 1.200-2.500 1.200-2.600-.1 0-2.400-.9-2.400-3.800zM14.200 5.700c.6-.8 1.100-1.900 1-3-1 0-2.100.7-2.800 1.500-.6.700-1.100 1.800-1 2.900 1.100.1 2.200-.6 2.800-1.400z"/></svg>';
          u.el('b', '', mb, 'Chatter');
          for (const m of ['File', 'Edit', 'View', 'Post', 'Window', 'Help']) u.el('span', '', mb, m);
          const status = u.el('span', 'aq-status', mb);
          status.innerHTML =
            '<svg viewBox="0 0 24 24"><path d="M2 8q10-9 20 0M5 11q7-6 14 0M8 14q4-3 8 0" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="12" cy="18" r="1.7"/></svg><svg viewBox="0 0 24 24"><path d="M3 9h4l6-5v16l-6-5H3z"/><path d="M16 7q6 5 0 10M18 4q9 8 0 16" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
          u.el('span', 'aq-clock', mb, 'Mon Apr 16   10:24 AM');
          const win = u.el('div', 'aq-window', shell);
          const tb = u.el('div', 'aq-titlebar', win);
          const dots = u.el('span', 'aq-dots', tb);
          for (const c of ['r', 'y', 'g']) u.el('i', c, dots);
          u.el('span', 'aq-title', tb, 'Chatter');
          const s = u.el('div', 'aq-search', tb, 'Search posts, people...');
          const nb = u.el('div', 'aq-nb', win);
          const tabs = u.el('div', 'aq-tabs', nb);
          TABS.forEach(([n, p], i) => {
            const t = u.el('button', 'aq-tab' + (i === 0 ? ' on' : ''), tabs);
            t.type = 'button';
            t.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor">' + p + '</svg>';
            u.el('span', '', t, n);
            t.addEventListener('click', () => env.log('decoy', { what: n }));
          });
          const rings = u.el('div', 'aq-rings', nb);
          for (let i = 0; i < 23; i++) {
            const ring = u.el('i', '', rings);
            ring.innerHTML =
              '<svg viewBox="0 0 48 30"><defs><linearGradient id="metal' +
              i +
              '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#454b4c"/><stop offset=".3" stop-color="#d7dada"/><stop offset=".55" stop-color="#939a9a"/><stop offset="1" stop-color="#495051"/></linearGradient></defs><ellipse cx="39" cy="12" rx="7" ry="8" fill="#5e6365"/><path d="M9 24C0 19 5 9 18 8L34 7Q45 6 42 15" fill="none" stroke="url(#metal' +
              i +
              ')" stroke-width="8" stroke-linecap="round"/><path d="M7 18Q7 11 20 11L33 10" fill="none" stroke="#edf0ee" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/></svg>';
          }
          const page = u.el('div', 'aq-page ref-body', nb);
          Object.assign(_c, { shell, win, page, header: page });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          notebookNote(_c.header.querySelector('.ref-instruction'), 'header');
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { endBtn, decoyBtn } = _c;
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add(cls === 'ref-endlink' ? 'aq-endlink' : 'end-control');
            return button;
          };
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.classList.add('aq-xtra');
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.classList.add('aq-tools');
        },
        'frame.body': () => (_c) => {
          _c.body = _c.page;
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const note = _c.body.querySelector('.ref-panel');
          notebookNote(note, 'panel');
          if (note) _c.headerTools.before(note);
        },
        'frame.stage': (base) => (_c) => {
          base(_c);
          _c.stage.classList.add('stage');
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          if (_c.display === 'toast') {
            const note = document.querySelector('.ref-note');
            notebookNote(note, 'toast');
            _c.headerTools.before(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot') || _c.util.el('div', '', _c.page);
          foot.classList.add('aq-foot');
          _c.page.append(foot);
          _c.foot = foot;
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
