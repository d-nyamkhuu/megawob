// Ledger frame design on the shared site template.
(function () {
  'use strict';
  const cfg = { title: 'Ledger', nav: ['People', 'Projects', 'Reports', 'Settings'] };

  function styleInstruction(note, util) {
    note.classList.add('instruction');
    const text = note.textContent;
    const match = /^(\S+\s)([\s\S]*)$/.exec(text);
    if (match && /^select\s$/i.test(match[1])) {
      note.textContent = '';
      util.el('span', 'pre', note, match[1]);
      util.el('span', '', note, match[2]);
    }
    if (text.length > 32) note.classList.add('long-instruction');
  }

  env.site({
    name: 'design-click-control-menu-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['site.css', 'bauhaus.css'],
    design: {
      THEMES: { ledger: { bg: '#f8f5ec', panel: '#fcf9f1', fg: '#111', muted: '#777', line: '#ddd6c8' } },
      LOW_THEME: { bg: '#f8f5ec', panel: '#fcf9f1', fg: '#111', muted: '#777', line: '#ddd6c8' },
      ACCENTS: ['#d7071c'],
      LOW_ACCENTS: ['#d7071c'],
      parts: {
        'frame.theme': (base) => (_c) => {
          document.body.className = 'ref bauhaus';
          base(_c);
        },
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.dataset.display = _c.display;
        },
        'frame.header': () => (_c) => {
          const u = _c.util;
          const shell = u.el('main', 'shell', document.body);
          const top = u.el('header', 'topbar', shell);
          const brand = u.el('div', 'brand', top);
          u.el('span', 'logo', brand);
          u.el('span', '', brand, cfg.title);
          const nav = u.el('nav', 'topnav', top);
          cfg.nav.forEach((n, i) => u.el('span', i === 0 ? 'on' : '', nav, n));
          const sr = u.el('span', 'top-search', top);
          sr.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>';
          u.el('span', 'avatar', top, 'JS');
          const header = u.el('div', 'titlerow', shell);
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) styleInstruction(note, _c.util);
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { endBtn, decoyBtn } = _c;
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add(cls === 'ref-endlink' ? 'end-link' : 'submit');
            return button;
          };
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.classList.add('chrome-xtra');
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.classList.add('endtools');
        },
        'frame.body': () => (_c) => {
          _c.body = _c.util.el('div', 'ref-body', _c.shell);
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            _c.header.appendChild(panel);
            const note = panel.querySelector('.ref-panel-text');
            styleInstruction(note, _c.util);
            note.classList.add('instruction-panel');
            note.dataset.display = 'panel';
          }
        },
        'frame.stage': () => (_c) => {
          const u = _c.util;
          const { shell } = _c;
          const card = u.el('section', 'card', shell);
          const tb = u.el('div', 'toolbar', card);
          const add = u.el('span', 'addbtn', tb);
          add.innerHTML =
            '<svg viewBox="0 0 16 16" stroke="#fff" stroke-width="2"><path d="M8 2v12M2 8h12"/></svg>Add Person';
          const s = u.el('span', 'tsearch', tb);
          s.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><i>Search people...</i>';
          const f = u.el('span', 'filterbtn', tb);
          f.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2"><path d="M3 4h18l-7 8v7l-4 2v-9z"/></svg>Filter<svg viewBox="0 0 16 16" fill="none" stroke="#222" stroke-width="2"><path d="m3 6 5 5 5-5"/></svg>';
          const stage = u.el('div', 'stage', card);
          const pv = u.el('aside', 'preview', shell);
          const ph = u.el('div', 'pv-head', pv);
          u.el('span', '', ph, 'Preview');
          u.el('i', '', ph);
          const pb = u.el('div', 'pv-body', pv);
          const pt = u.el('span', 'pv-ph', pb);
          pt.innerHTML =
            '<svg viewBox="0 0 90 90"><circle cx="45" cy="34" r="13" fill="#1a1a1a"/><path d="M22 70c0-22 46-22 46 0Z" fill="#1a1a1a"/></svg>';
          const tx = u.el('div', '', pb);
          u.el('b', '', tx, 'No person selected');
          u.el('p', '', tx, 'Details will appear here.');
          Object.assign(_c, { stage });
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('instruction', 'instruction-toast');
            note.dataset.display = 'toast';
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            _c.shell.appendChild(foot);
            foot.classList.add('end-footer');
            if (_c.submit && foot.contains(_c.submit)) _c.submit.classList.add('end-footer-btn');
          }
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.shell.appendChild(dock);
            dock.classList.add('end-footer');
            _c.submit.classList.add('end-footer-btn');
          }
        },
      },
    },
  });
})();
