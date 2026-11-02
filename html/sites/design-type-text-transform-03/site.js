(function () {
  'use strict';
  const palette = { bg: '#3a2417', panel: '#f6efdc', fg: '#2a1d12', muted: '#6b5d4a', line: '#bda97f' };
  const railItems = [
    ['Text', 'M4 1h12l6 7v17H4zM16 1v7h6M7 7h5v1H7zM7 11h12v1H7zM7 15h12v1H7zM7 19h12v1H7z'],
    ['Transform', 'M10 1h4l.6 2.6 2 .9 2.3-1.3 2.8 2.8-1.3 2.3.9 2L24 11v4l-2.7.6-.8 2 1.3 2.3-2.8 2.8-2.3-1.3-2 .9L14 25h-4l-.6-2.7-2-.9-2.3 1.3-2.8-2.8 1.3-2.3-.9-2L0 15v-4l2.7-.6.9-2L2.3 6 5.1 3.2l2.3 1.3 2-.9zM12 7a6 6 0 1 0 0 12 6 6 0 0 0 0-12z'],
    ['Format', 'M4 2h20v5h-2v19H3V5zM6 7h13v2H6zM6 12h13v2H6zM6 17h13v2H6zM6 22h13v1H6z'],
    ['Tools', 'M15 1a7 7 0 0 0-6 10L1 21q-1 2 2 4t4-1l8-11a7 7 0 0 0 9-9l-5 5-5-3z'],
    ['Help', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.5'],
  ];
  function sizeNote(_c, note) {
    const text = note.querySelector('.ref-panel-text, .ref-note-text') || note;
    text.classList.add('ds-instruction');
    if (_c.display !== 'panel' && _c.ctx.instruction.length > 42)
      text.style.fontSize = 4.6 * Math.sqrt(34 / _c.ctx.instruction.length) + 'vw';
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-logo', top, 'T');
      u.el('span', 'ds-brand', top, 'Text Workshop');
      const wc = u.el('span', 'ds-wc', top);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wc, t));
      const outer = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', outer);
      railItems.forEach((r, i) => {
        const it = u.el('div', 'ds-rail-item' + (i === 0 ? ' on' : ''), rail);
        it.innerHTML = '<svg viewBox="-1 0 27 27" stroke-linejoin="round" stroke-linecap="round"><defs><linearGradient id="brass-icon" x2=".6" y2="1"><stop stop-color="#f2dc9e"/><stop offset=".45" stop-color="#c5a666"/><stop offset="1" stop-color="#a7884b"/></linearGradient></defs><path fill-rule="evenodd" d="' + r[1] + '"/><path fill="none" stroke="#edd79c" stroke-width=".32" transform="translate(-.3,-.3)" d="' + r[1] + '"/></svg>';
        if (i === 4) it.querySelector('svg').innerHTML = '<circle cx="12" cy="12" r="11" fill="url(#brass-icon)" stroke="#36260e"/><circle cx="12" cy="12" r="8.8" fill="#382915" stroke="#d8bd7b"/><text x="12" y="19" text-anchor="middle" fill="#e0c68b" stroke="none" font-family="Georgia" font-size="21">?</text>';
        u.el('span', '', it, r[0]);
      });
      const content = u.el('div', 'ds-content', outer);
      const toolbar = u.el('div', 'ds-head', content);
      u.el('span', 'ds-head-title', toolbar, 'Text Tools');
      u.el('em', '', toolbar, 'Simple text tasks. Solid results.');
      const body = u.el('div', 'ds-frame', content);
      ['tl', 'tr', 'bl', 'br'].forEach((c) => u.el('i', 'ds-screw ' + c, body));
      body.classList.toggle('panel-mode', _c.display === 'panel');
      const header = u.el('div', 'ds-note-slot', body);
      Object.assign(_c, { toolbar, body, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        sizeNote(_c, note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.toolbar.querySelector('em').hidden = true;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-panel-note');
        sizeNote(_c, note);
      }
    },
    'frame.stage': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.body);
      _c.stage = _c.util.el('main', 'ds-stage', main);
      // Retain the source passage as task data, without leaking the requested operation
      // into the widget's answer label when the instruction is hidden.
      const source = /"([^\"]+)"/.exec(_c.ctx.plainInstruction || _c.ctx.instruction);
      if (source) _c.stage.dataset.sourceInstruction = '"' + source[1] + '"';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.header.appendChild(note);
        sizeNote(_c, note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.body.appendChild(foot);
      if (_c.placement === 'footer' && _c.submit) {
        _c.submit.classList.add('ds-submit');
        ['tl', 'tr', 'bl', 'br'].forEach((c) => _c.util.el('i', 'ds-screw ' + c, _c.submit));
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-type-text-transform-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#a8823c'], LOW_ACCENTS: ['#a8823c'], parts,
    },
  });
})();
