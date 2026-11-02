(function () {
  'use strict';
  const MAP = '<svg viewBox="3 200 1183 591" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><image href="sites/design-choose-option-autocomplete-06/assets/map-reference.webp" width="1672" height="941"/></svg>';
  const palette = { bg: '#10212c', panel: '#1d2d39', fg: '#c6dbed', muted: '#acc5db', line: '#63869e' };
  function decorate(text) {
    // Preserve the reference's yellow quoted phrases inside the template note.
    const value = text.textContent;
    text.textContent = '';
    value.split(/("[^"]+")/g).forEach((part, i) => {
      if (i % 2) {
        const span = document.createElement('span');
        span.className = 'ds-q';
        span.textContent = part;
        text.appendChild(span);
      } else text.append(part);
    });
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses the top note only at narrow widths.
      _c.display = _c.ctx.display || 'header';
      if (_c.W <= 1100 && _c.display !== 'hidden') _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = '<svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="8"/><path d="M13 1V25M1 13H25M13 5L16 13L13 21L10 13Z"/></svg>';
      u.el('span', 'ds-brand', top, 'Route Planner - Global Navigation');
      const wc = u.el('span', 'ds-wc', top);
      wc.innerHTML = '<i class="ds-min"></i><i class="ds-max"></i><i class="ds-close"></i>';
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Tools', 'Window', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const header = u.el('div', 'ds-note-slot', content);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { menu, body, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-instruction');
        _c.header.classList.add('ds-header-note');
        decorate(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.content);
      const map = _c.util.el('div', 'ds-map', main);
      map.innerHTML = MAP;
      Object.assign(_c, { main, map });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.map;
      base(_c);
      _c.body = body;
      const panel = _c.map.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-episode-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Route instructions';
        const note = panel.querySelector('.ref-panel-text');
        note.classList.add('ds-instruction');
        decorate(note);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-episode-toast');
        const text = note.querySelector('.ref-note-text');
        text.classList.add('ds-instruction');
        decorate(text);
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const ro = _c.util.el('div', 'ds-readout');
      [ ['CURSOR', '33.4° N   44.4° E'], ['ELEV', '312 m'], ['GRID', '10°'], ['MODE', 'Route Planning'] ].forEach((r) => {
        _c.util.el('span', '', ro, r[0]);
        _c.util.el('span', '', ro, r[1]);
      });
      foot.prepend(ro);
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
    name: 'design-choose-option-autocomplete-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-autocomplete-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f8de0'],
      LOW_ACCENTS: ['#2f8de0'],
      parts,
    },
  });
})();
