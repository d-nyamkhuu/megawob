// Vista People Search: frame sections on the shared site template.
(function () {
  'use strict';

  const glass = {
    bg: '#cbd0d6', panel: '#e9ecf0', fg: '#101923', line: '#c8cdd5', muted: '#5f6a78',
  };

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This console has room for its instruction in the right pane at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'side-left instruction-' + _c.display;
    },
    'frame.header': () => (_c) => {
      const { util } = _c;
      const shell = util.el('div', 'site-shell', document.body);
      const header = util.el('header', 'design-header', shell);
      const appIcon = util.el('span', 'vi-icon', header);
      appIcon.innerHTML = '<svg viewBox="0 0 28 26" aria-hidden="true"><defs><linearGradient id="personBlue" x2="1" y2="1"><stop stop-color="#abe4f0"/><stop offset="1" stop-color="#238495"/></linearGradient><linearGradient id="personGreen" x2="1" y2="1"><stop stop-color="#d1eabd"/><stop offset="1" stop-color="#549353"/></linearGradient><radialGradient id="personHead"><stop stop-color="#f6ddb2"/><stop offset="1" stop-color="#839578"/></radialGradient></defs><ellipse cx="19" cy="8" rx="4.5" ry="6" fill="url(#personHead)" stroke="#648f77"/><path d="M12 25v-7q0-6 7-6t7 6v6Z" fill="url(#personGreen)" stroke="#598b70"/><ellipse cx="9" cy="7" rx="4.5" ry="6" fill="url(#personHead)" stroke="#5b8a8d"/><path d="M1 22v-5q0-6 8-6t7 6v7Z" fill="url(#personBlue)" stroke="#4c8a99"/></svg>';
      util.el('div', 'design-brand', header, 'People Search');
      const wc = util.el('div', 'window-controls', header);
      util.el('span', 'wc', wc, '–');
      util.el('span', 'wc', wc, '');
      util.el('span', 'wc close', wc, '✕');
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const { util } = _c;
      const note = util.el('section', 'task-note pane');
      note.dataset.role = 'instruction';
      util.el('h2', '', note, 'Task');
      base({ ..._c, header: note });
      const text = note.querySelector('.ref-instruction');
      if (text) text.classList.add('food-task');
      _c.note = note;
    },
    'frame.body': () => (_c) => {
      const { note, shell, util } = _c;
      const body = util.el('div', 'design-body ref-body', shell);
      const left = util.el('div', 'col-left', body);
      left.append(note);
      const search = util.el('section', 'search-pane pane', left);
      util.el('h2', '', search, 'Search People');
      const right = util.el('aside', 'col-right pane', body);
      util.el('h2', '', right, 'Your Progress');
      Object.assign(_c, { body, search, right });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.right });
      const panel = _c.right.querySelector('.ref-panel');
      if (panel) panel.classList.add('episode-note-panel');
    },
    'frame.stage': () => (_c) => {
      const { ctx, label, right, search, util } = _c;
      const stage = util.el('main', 'stage', search);
      const steps = util.el('div', 'steps', right);
      ['Enter a search query', 'Browse search results', ctx.finish ? 'Finish' : label].forEach((text, i) => {
        const step = util.el('div', 'step' + (i === 0 ? ' on' : ''), steps);
        util.el('span', 'radio', step);
        util.el('span', '', step, `${i + 1}. ${text}`);
      });
      util.el('h3', '', right, 'Details');
      util.el('div', 'dl', right, 'Selected person:');
      util.el('div', 'dv', right, 'None');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const toast = document.querySelector('.ref-note');
      if (toast) {
        toast.classList.add('episode-note-toast');
        _c.right.append(toast);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.querySelector('.ref-foot') || _c.util.el('footer');
      footer.classList.add('design-footer');
      _c.right.append(footer);
      // Clear is the design's inert secondary action, using the shared decoy handler.
      _c.decoyBtn(footer, 'Clear');
      footer.lastElementChild.classList.add('clear-btn');
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.footer.prepend(dock);
    },
    'frame.end': (base) => (_c) => {
      const { header, footer, submit } = _c;
      for (const button of header.querySelectorAll('.ref-xtra')) button.classList.add('pqs-xtra');
      if (submit) submit.classList.add(header.contains(submit) ? 'header-end-control'
        : submit.tagName === 'A' ? 'footer-end-link' : 'end-control');
      for (const button of footer.querySelectorAll('.ref-xtra:not(.clear-btn)')) button.classList.add('pqs-xtra');
      return base(_c);
    },
  };

  env.site({
    name: 'design-use-shop-search-06',
    template: 'site/base',
    design: {
      THEMES: { glass }, LOW_THEME: glass, ACCENTS: ['#88a9cd'], LOW_ACCENTS: ['#88a9cd'],
      parts,
    },
  });
})();
